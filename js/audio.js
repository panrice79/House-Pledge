// HOUSE PLEDGE — procedural audio engine (no external assets)
const AudioSys = (() => {
  let ctx = null, master = null;
  const layers = {}; // named looping layers

  function init() {
    if (ctx) return;
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain();
    master.gain.value = 0.8;
    master.connect(ctx.destination);
  }
  function resume(){ if (ctx && ctx.state === 'suspended') ctx.resume(); }

  function noiseBuffer(seconds = 2) {
    const len = ctx.sampleRate * seconds;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return buf;
  }

  // ---- looping ambient layers ----
  function stopLayer(name, fade = 1.5) {
    const L = layers[name];
    if (!L) return;
    const t = ctx.currentTime;
    L.gain.gain.cancelScheduledValues(t);
    L.gain.gain.setValueAtTime(L.gain.gain.value, t);
    L.gain.gain.linearRampToValueAtTime(0.0001, t + fade);
    setTimeout(() => { try { L.nodes.forEach(n => n.stop && n.stop()); } catch(e){} delete layers[name]; }, fade * 1000 + 100);
  }
  function stopAllLayers(fade = 1.5) { Object.keys(layers).forEach(n => stopLayer(n, fade)); }

  function addLayer(name, buildFn, vol = 0.3, fade = 2) {
    if (!ctx) return;
    if (layers[name]) return layers[name];
    const gain = ctx.createGain();
    gain.gain.value = 0.0001;
    gain.connect(master);
    const nodes = buildFn(gain) || [];
    const t = ctx.currentTime;
    gain.gain.linearRampToValueAtTime(vol, t + fade);
    layers[name] = { gain, nodes };
    return layers[name];
  }
  function setLayerVol(name, vol, ramp = 1) {
    const L = layers[name];
    if (!L) return;
    L.gain.gain.cancelScheduledValues(ctx.currentTime);
    L.gain.gain.setValueAtTime(L.gain.gain.value, ctx.currentTime);
    L.gain.gain.linearRampToValueAtTime(Math.max(0.0001, vol), ctx.currentTime + ramp);
  }

  // Constant faint VHS tape hiss — runs the whole game
  function hiss(vol = 0.012) {
    addLayer('hiss', (out) => {
      const src = ctx.createBufferSource();
      src.buffer = noiseBuffer(3); src.loop = true;
      const f = ctx.createBiquadFilter();
      f.type = 'highpass'; f.frequency.value = 3800;
      src.connect(f); f.connect(out);
      src.start();
      return [src];
    }, vol, 3);
  }

  // tiny typewriter tick for narration/dialogue text
  function uiTick() {
    if (!ctx) return;
    const t = ctx.currentTime;
    const src = ctx.createBufferSource(); src.buffer = noiseBuffer(0.03);
    const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 2600; f.Q.value = 3;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.025, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
    src.connect(f); f.connect(g); g.connect(master);
    src.start(t);
  }

  // Wind: filtered noise with slow LFO on filter freq
  function wind(vol = 0.25, intensity = 1) {
    addLayer('wind', (out) => {
      const src = ctx.createBufferSource();
      src.buffer = noiseBuffer(4); src.loop = true;
      const filt = ctx.createBiquadFilter();
      filt.type = 'bandpass'; filt.frequency.value = 300 * intensity; filt.Q.value = 0.7;
      const lfo = ctx.createOscillator(); lfo.frequency.value = 0.07 + Math.random()*0.05;
      const lfoG = ctx.createGain(); lfoG.gain.value = 180 * intensity;
      lfo.connect(lfoG); lfoG.connect(filt.frequency);
      src.connect(filt); filt.connect(out);
      src.start(); lfo.start();
      return [src, lfo];
    }, vol);
  }

  // Interior room tone: very low hum + faint hiss
  function roomTone(vol = 0.07) {
    addLayer('room', (out) => {
      const osc = ctx.createOscillator(); osc.type = 'sine'; osc.frequency.value = 58;
      const og = ctx.createGain(); og.gain.value = 0.4;
      const src = ctx.createBufferSource(); src.buffer = noiseBuffer(3); src.loop = true;
      const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 500;
      const ng = ctx.createGain(); ng.gain.value = 0.05;
      osc.connect(og); og.connect(out);
      src.connect(f); f.connect(ng); ng.connect(out);
      osc.start(); src.start();
      return [osc, src];
    }, vol);
  }

  // Party music: muffled four-on-the-floor kick + bass line. muffle 0..1 (1 = heard through walls)
  function partyMusic(vol = 0.25, muffled = true) {
    addLayer('party', (out) => {
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass'; lp.frequency.value = muffled ? 220 : 2400;
      lp.connect(out);
      const bpm = 124, beat = 60 / bpm;
      const bassNotes = [41.2, 41.2, 49, 36.7]; // E1 E1 G1 D1
      let bar = 0, stopped = false;
      const kick = (t) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.frequency.setValueAtTime(120, t);
        o.frequency.exponentialRampToValueAtTime(40, t + 0.12);
        g.gain.setValueAtTime(0.9, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
        o.connect(g); g.connect(lp); o.start(t); o.stop(t + 0.3);
      };
      const bass = (t, f) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'sawtooth'; o.frequency.value = f;
        g.gain.setValueAtTime(0.22, t);
        g.gain.setTargetAtTime(0.0001, t + beat * 1.6, 0.18);
        o.connect(g); g.connect(lp); o.start(t); o.stop(t + beat * 2);
      };
      const hat = (t) => {
        const src = ctx.createBufferSource(); src.buffer = noiseBuffer(0.05);
        const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 7000;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.12, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
        src.connect(f); f.connect(g); g.connect(lp); src.start(t);
      };
      const stab = (t, f0) => { // chord hit on the off-beats
        [f0 * 2, f0 * 3].forEach(fr => {
          const o = ctx.createOscillator(), g = ctx.createGain();
          o.type = 'square'; o.frequency.value = fr;
          g.gain.setValueAtTime(0.06, t);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
          o.connect(g); g.connect(lp); o.start(t); o.stop(t + 0.25);
        });
      };
      let nextT = ctx.currentTime + 0.1;
      const tick = () => {
        if (stopped || !layers['party']) return;
        while (nextT < ctx.currentTime + 1.2) {
          const f0 = bassNotes[bar % 4];
          for (let b = 0; b < 4; b++) {
            kick(nextT + b * beat);
            hat(nextT + b * beat + beat / 2);
            if (b === 1 || b === 3) stab(nextT + b * beat, f0);
          }
          bass(nextT, f0);
          nextT += beat * 4; bar++;
        }
        setTimeout(tick, 400);
      };
      tick();
      return [{ stop(){ stopped = true; } }];
    }, vol);
  }

  // Charlie-Brown-teacher gibberish for dialogue. seed picks the voice register.
  function babble(seed = 1, chars = 40) {
    if (!ctx) return;
    const t0 = ctx.currentTime;
    const base = 95 + (seed % 7) * 26;            // per-character pitch
    const syll = Math.min(14, 3 + Math.floor(chars / 9));
    let t = t0;
    for (let i = 0; i < syll; i++) {
      const dur = 0.07 + Math.random() * 0.08;
      const o = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter();
      o.type = 'sawtooth';
      const p = base * (0.9 + Math.random() * 0.35);
      o.frequency.setValueAtTime(p, t);
      o.frequency.linearRampToValueAtTime(p * (0.85 + Math.random() * 0.3), t + dur);
      f.type = 'bandpass'; f.Q.value = 4;
      f.frequency.value = 420 + Math.random() * 900; // random "vowel"
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.055, t + 0.015);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      o.connect(f); f.connect(g); g.connect(master);
      o.start(t); o.stop(t + dur + 0.02);
      t += dur + (Math.random() < 0.25 ? 0.09 : 0.018); // occasional word gap
    }
  }

  function gulp() { // taking a shot
    if (!ctx) return;
    const t = ctx.currentTime;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(300, t);
    o.frequency.exponentialRampToValueAtTime(110, t + 0.13);
    g.gain.setValueAtTime(0.09, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + 0.17);
    const src = ctx.createBufferSource(); src.buffer = noiseBuffer(0.06);
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 600;
    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(0.06, t + 0.1);
    g2.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    src.connect(f); f.connect(g2); g2.connect(master); src.start(t + 0.1);
  }

  function thud() { // body hit / shove
    if (!ctx) return;
    const t = ctx.currentTime;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.setValueAtTime(90, t);
    o.frequency.exponentialRampToValueAtTime(30, t + 0.12);
    g.gain.setValueAtTime(0.55, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + 0.25);
    const src = ctx.createBufferSource(); src.buffer = noiseBuffer(0.1);
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 400;
    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(0.3, t);
    g2.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    src.connect(f); f.connect(g2); g2.connect(master); src.start(t);
  }

  function bell() { // church bell toll
    if (!ctx) return;
    const t = ctx.currentTime;
    [196, 247, 392].forEach((fr, i) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine'; o.frequency.value = fr * (1 + (Math.random() - 0.5) * 0.004);
      g.gain.setValueAtTime(0.12 / (i + 1), t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 4.5);
      o.connect(g); g.connect(master); o.start(t); o.stop(t + 4.6);
    });
  }

  function ekg(beats = 6, thenFlatline = true) { // hospital monitor
    if (!ctx) return;
    const t0 = ctx.currentTime;
    for (let i = 0; i < beats; i++) {
      const t = t0 + i * 1.05;
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine'; o.frequency.value = 880;
      g.gain.setValueAtTime(0.05, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
      o.connect(g); g.connect(master); o.start(t); o.stop(t + 0.15);
    }
    if (thenFlatline) {
      const t = t0 + beats * 1.05 + 0.4;
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine'; o.frequency.value = 880;
      g.gain.setValueAtTime(0.045, t);
      g.gain.linearRampToValueAtTime(0.0001, t + 5);
      o.connect(g); g.connect(master); o.start(t); o.stop(t + 5.1);
    }
  }

  // Crowd murmur: band-filtered noise w/ random swells
  function crowd(vol = 0.18) {
    addLayer('crowd', (out) => {
      const src = ctx.createBufferSource(); src.buffer = noiseBuffer(4); src.loop = true;
      const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 800; f.Q.value = 0.4;
      const g = ctx.createGain(); g.gain.value = 0.5;
      const lfo = ctx.createOscillator(); lfo.frequency.value = 0.21;
      const lg = ctx.createGain(); lg.gain.value = 0.18;
      lfo.connect(lg); lg.connect(g.gain);
      src.connect(f); f.connect(g); g.connect(out);
      src.start(); lfo.start();
      return [src, lfo];
    }, vol);
  }

  // Furnace / basement drone
  function basementDrone(vol = 0.12) {
    addLayer('basement', (out) => {
      const o1 = ctx.createOscillator(); o1.type = 'sine'; o1.frequency.value = 49;
      const o2 = ctx.createOscillator(); o2.type = 'sine'; o2.frequency.value = 51.5;
      const g = ctx.createGain(); g.gain.value = 0.5;
      o1.connect(g); o2.connect(g); g.connect(out);
      o1.start(); o2.start();
      return [o1, o2];
    }, vol);
  }

  // Heartbeat layer (for stress moments)
  function heartbeat(vol = 0.2, rate = 1.1) {
    addLayer('heart', (out) => {
      let stopped = false;
      const thump = (t, loud) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.frequency.setValueAtTime(65, t);
        o.frequency.exponentialRampToValueAtTime(35, t + 0.1);
        g.gain.setValueAtTime(loud, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
        o.connect(g); g.connect(out); o.start(t); o.stop(t + 0.2);
      };
      let nextT = ctx.currentTime + 0.1;
      const tick = () => {
        if (stopped || !layers['heart']) return;
        while (nextT < ctx.currentTime + 1.5) {
          thump(nextT, 0.9); thump(nextT + 0.28, 0.5);
          nextT += 1 / rate;
        }
        setTimeout(tick, 500);
      };
      tick();
      return [{ stop(){ stopped = true; } }];
    }, vol);
  }

  // ---- one-shots ----
  function footstep(snow = false) {
    if (!ctx) return;
    const t = ctx.currentTime;
    const src = ctx.createBufferSource(); src.buffer = noiseBuffer(0.15);
    const f = ctx.createBiquadFilter();
    f.type = snow ? 'lowpass' : 'bandpass';
    f.frequency.value = snow ? 900 : 300; f.Q.value = 1;
    const g = ctx.createGain();
    g.gain.setValueAtTime(snow ? 0.14 : 0.1, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + (snow ? 0.18 : 0.12));
    src.connect(f); f.connect(g); g.connect(master);
    src.start(t);
  }

  function notifBlip() {
    if (!ctx) return;
    const t = ctx.currentTime;
    [880, 1174].forEach((fr, i) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine'; o.frequency.value = fr;
      const t0 = t + i * 0.09;
      g.gain.setValueAtTime(0.12, t0);
      g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.18);
      o.connect(g); g.connect(master); o.start(t0); o.stop(t0 + 0.2);
    });
  }

  function buzz() { // phone vibration
    if (!ctx) return;
    const t = ctx.currentTime;
    for (let i = 0; i < 2; i++) {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'square'; o.frequency.value = 90;
      const t0 = t + i * 0.32;
      g.gain.setValueAtTime(0.04, t0);
      g.gain.setValueAtTime(0.0001, t0 + 0.2);
      o.connect(g); g.connect(master); o.start(t0); o.stop(t0 + 0.22);
    }
  }

  function doorSlam() {
    if (!ctx) return;
    const t = ctx.currentTime;
    const src = ctx.createBufferSource(); src.buffer = noiseBuffer(0.4);
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 250;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.7, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    src.connect(f); f.connect(g); g.connect(master);
    src.start(t);
  }

  function distantShout() { // far-off party yell, formant-ish
    if (!ctx) return;
    const t = ctx.currentTime;
    const o = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(180 + Math.random() * 120, t);
    o.frequency.linearRampToValueAtTime(140, t + 0.7);
    f.type = 'bandpass'; f.frequency.value = 700; f.Q.value = 2;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.05, t + 0.15);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.9);
    o.connect(f); f.connect(g); g.connect(master);
    o.start(t); o.stop(t + 1);
  }

  function siren(durSec = 8, vol = 0.05) { // distant ambulance
    if (!ctx) return;
    const t = ctx.currentTime;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'triangle';
    for (let i = 0; i < durSec; i += 1.4) {
      o.frequency.setValueAtTime(660, t + i);
      o.frequency.linearRampToValueAtTime(880, t + i + 0.7);
      o.frequency.linearRampToValueAtTime(660, t + i + 1.4);
    }
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(vol, t + durSec * 0.4);
    g.gain.linearRampToValueAtTime(0.0001, t + durSec);
    o.connect(g); g.connect(master);
    o.start(t); o.stop(t + durSec);
  }

  function stinger() { // low dread swell, used sparingly
    if (!ctx) return;
    const t = ctx.currentTime;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(55, t);
    o.frequency.linearRampToValueAtTime(48, t + 3);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.22, t + 1.6);
    g.gain.linearRampToValueAtTime(0.0001, t + 3.4);
    o.connect(g); g.connect(master);
    o.start(t); o.stop(t + 3.5);
  }

  return { init, resume, wind, roomTone, partyMusic, crowd, basementDrone, heartbeat, hiss,
           footstep, notifBlip, buzz, doorSlam, distantShout, siren, stinger, uiTick,
           babble, thud, bell, ekg, gulp,
           stopLayer, stopAllLayers, setLayerVol };
})();
