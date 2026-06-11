// HOUSE PLEDGE — engine: renderer, player, UI systems, sequencer
const G = (() => {
  // ---------- renderer ----------
  const container = document.getElementById('game-container');
  const renderer = new THREE.WebGLRenderer({ antialias: false });
  const RES_SCALE = 0.34;
  renderer.setPixelRatio(1);
  container.appendChild(renderer.domElement);

  let scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(72, 1, 0.1, 400);
  const BASE_FOV = 72, FOCUS_FOV = 46;

  function onResize() {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w * RES_SCALE, h * RES_SCALE, false);
    renderer.domElement.style.width = w + 'px';
    renderer.domElement.style.height = h + 'px';
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', onResize);
  onResize();

  // ---------- VHS noise ----------
  const nc = document.getElementById('noise-canvas');
  const ng = nc.getContext('2d');
  nc.width = 240; nc.height = 140;
  function drawNoise() {
    const img = ng.createImageData(nc.width, nc.height);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const v = Math.random() * 255 | 0;
      d[i] = d[i+1] = d[i+2] = v; d[i+3] = 255;
    }
    ng.putImageData(img, 0, 0);
  }
  function setNoise(level) {
    nc.style.opacity = level;
    document.querySelector('#vhs .tracking').style.opacity = Math.min(1, level * 14);
  }

  // ---------- state ----------
  const keys = {};
  const player = {
    pos: new THREE.Vector3(0, 0, 0),
    eyeY: 1.74, eyeTarget: 1.74,
    yaw: 0, pitch: 0,
    speed: 3.4, sprintMult: 1.7, speedMult: 1,
    stamina: 1, canSprint: true,
    bobT: 0, stepT: 0,
    frozen: true,
  };
  let colliders = [];
  let snowPts = null;
  let interactables = [];
  let zones = [];
  let npcs = [];
  let movers = [];          // walking NPCs
  let pointerLocked = false;
  let wantPointer = false;
  let started = false;
  let paused = false;
  let suppressPause = 0;    // timestamp until which auto-pause is ignored
  let clock = new THREE.Clock();
  let walkSoundSnow = true;
  let shakeAmp = 0, tremor = 0;
  let drunk = 0, drunkTarget = 0;
  let focusNPC = null;      // dialogue camera target
  let carryMesh = null;

  // ---------- input ----------
  document.addEventListener('keydown', e => {
    keys[e.code] = true;
    if (e.code === 'Tab') { e.preventDefault(); Phone.toggle(); }
    if (e.code === 'Escape' && started) {
      if (paused) resumeGame();
    }
    if (e.code === 'Space' || e.code === 'Enter') {
      if (advanceCb) { e.preventDefault(); const cb = advanceCb; advanceCb = null; cb(); }
    }
    if (e.code === 'KeyE') tryInteract();
    if (/^Digit[1-4]$/.test(e.code)) {
      const i = +e.code.slice(5) - 1;
      const els = document.querySelectorAll('#choices .choice');
      if (els[i]) els[i].click();
      const reps = document.querySelectorAll('#phone .reply-opt');
      if (!els.length && reps[i]) reps[i].click();
    }
  });
  document.addEventListener('keyup', e => keys[e.code] = false);
  document.addEventListener('mousemove', e => {
    if (!pointerLocked || focusNPC) return;
    player.yaw -= e.movementX * 0.0021;
    player.pitch -= e.movementY * 0.0021;
    player.pitch = Math.max(-1.45, Math.min(1.45, player.pitch));
  });
  document.addEventListener('click', () => {
    if (advanceCb) { const cb = advanceCb; advanceCb = null; cb(); return; }
    if (wantPointer && !pointerLocked && !Phone.isOpen() && !choicesShowing && !paused) {
      renderer.domElement.requestPointerLock();
    }
  });
  document.addEventListener('pointerlockchange', () => {
    pointerLocked = document.pointerLockElement === renderer.domElement;
    // Esc released the lock → pause (unless we released it ourselves for UI)
    if (!pointerLocked && started && wantPointer && !paused &&
        !Phone.isOpen() && !choicesShowing && performance.now() > suppressPause) {
      showPause();
    }
  });
  function grabPointer() {
    wantPointer = true;
    if (!Phone.isOpen() && !choicesShowing && !paused) renderer.domElement.requestPointerLock();
  }
  function releasePointer() {
    suppressPause = performance.now() + 600;
    document.exitPointerLock && document.exitPointerLock();
  }

  // ---------- pause ----------
  const pauseEl = document.getElementById('pause');
  function showPause() { paused = true; pauseEl.style.display = 'flex'; }
  function resumeGame() {
    paused = false; pauseEl.style.display = 'none';
    if (wantPointer && !player.frozen) grabPointer();
  }
  document.getElementById('btn-resume').onclick = resumeGame;
  document.getElementById('btn-restart').onclick = () => location.reload();

  // ---------- collision ----------
  function collide(nx, nz) {
    for (const c of colliders) {
      if (c.wallBox) {
        const b = c.wallBox;
        nx = Math.max(b.minX, Math.min(b.maxX, nx));
        nz = Math.max(b.minZ, Math.min(b.maxZ, nz));
      } else {
        const dx = nx - c.x, dz = nz - c.z;
        if (Math.abs(dx) < c.hw + 0.45 && Math.abs(dz) < c.hd + 0.45) {
          const px = c.hw + 0.45 - Math.abs(dx);
          const pz = c.hd + 0.45 - Math.abs(dz);
          if (px < pz) nx = c.x + Math.sign(dx || 1) * (c.hw + 0.45);
          else nz = c.z + Math.sign(dz || 1) * (c.hd + 0.45);
        }
      }
    }
    // people are solid too
    for (const n of npcs) {
      if (n.userData.noCollide) continue;
      const dx = nx - n.position.x, dz = nz - n.position.z;
      const d = Math.hypot(dx, dz);
      if (d < 0.55 && d > 0.0001) {
        nx = n.position.x + dx / d * 0.55;
        nz = n.position.z + dz / d * 0.55;
      }
    }
    nx = Math.max(-170, Math.min(170, nx));
    nz = Math.max(-200, Math.min(170, nz));
    return [nx, nz];
  }

  // ---------- per-frame ----------
  let noiseT = 0;
  function tick() {
    requestAnimationFrame(tick);
    const dt = Math.min(0.05, clock.getDelta());
    const t = performance.now() * 0.001;

    // movement (correct camera-relative basis: forward = (-sin yaw, -cos yaw))
    if (!player.frozen && !Phone.isOpen() && !paused) {
      let mx = 0, mz = 0;
      if (keys['KeyW']) mz -= 1;
      if (keys['KeyS']) mz += 1;
      if (keys['KeyA']) mx -= 1;
      if (keys['KeyD']) mx += 1;
      const moving = mx || mz;
      let sp = player.speed * player.speedMult;
      const sprinting = keys['ShiftLeft'] && moving && player.stamina > 0.05 && player.canSprint;
      if (sprinting) { sp *= player.sprintMult; player.stamina = Math.max(0, player.stamina - dt * 0.38); }
      else player.stamina = Math.min(1, player.stamina + dt * 0.2);
      document.querySelector('#stamina .fill').style.width = (player.stamina * 100) + '%';
      document.getElementById('stamina').style.opacity = player.stamina < 0.99 ? 1 : 0;

      if (moving) {
        const len = Math.hypot(mx, mz); mx /= len; mz /= len;
        const sin = Math.sin(player.yaw), cos = Math.cos(player.yaw);
        const dx = (mx * cos + mz * sin) * sp * dt;
        const dz = (-mx * sin + mz * cos) * sp * dt;
        const [nx, nz] = collide(player.pos.x + dx, player.pos.z + dz);
        player.pos.x = nx; player.pos.z = nz;
        player.bobT += dt * (sprinting ? 11 : 7.5);
        player.stepT += dt * (sprinting ? 1.8 : 1);
        if (player.stepT > 0.52) { player.stepT = 0; AudioSys.footstep(walkSoundSnow); }
      }
    }

    // dialogue focus: steer view toward speaker's head + zoom
    let targetFov = BASE_FOV;
    if (focusNPC) {
      targetFov = FOCUS_FOV;
      const hp = new THREE.Vector3();
      (focusNPC.userData.head || focusNPC).getWorldPosition(hp);
      hp.y = Math.max(hp.y, 1.7);
      const dx = hp.x - player.pos.x, dz = hp.z - player.pos.z;
      const wantYaw = Math.atan2(-dx, -dz);
      const dist = Math.hypot(dx, dz);
      const wantPitch = Math.atan2(hp.y - player.eyeY, dist);
      let dy = wantYaw - player.yaw;
      while (dy > Math.PI) dy -= Math.PI * 2;
      while (dy < -Math.PI) dy += Math.PI * 2;
      player.yaw += dy * Math.min(1, dt * 5);
      player.pitch += (wantPitch - player.pitch) * Math.min(1, dt * 5);
    }
    if (Math.abs(camera.fov - targetFov) > 0.2) {
      camera.fov += (targetFov - camera.fov) * Math.min(1, dt * 4);
      camera.updateProjectionMatrix();
    }

    // eye height (wall sit / crouch) + drunk
    player.eyeY += (player.eyeTarget - player.eyeY) * Math.min(1, dt * 3.5);
    drunk += (drunkTarget - drunk) * Math.min(1, dt * 0.7);
    container.style.filter = drunk > 0.03
      ? `blur(${(drunk * 2.2).toFixed(2)}px) saturate(${1 + drunk * 0.4}) brightness(${1 + drunk * 0.08})`
      : '';

    // camera transform with bob / shake / tremor / drunk roll
    shakeAmp = Math.max(0, shakeAmp - dt * 1.6);
    const sh = shakeAmp + tremor;
    const bob = Math.sin(player.bobT) * 0.045;
    camera.position.set(
      player.pos.x + (Math.random() - 0.5) * sh,
      player.eyeY + bob + (Math.random() - 0.5) * sh,
      player.pos.z + (Math.random() - 0.5) * sh);
    camera.rotation.order = 'YXZ';
    camera.rotation.y = player.yaw + (drunk ? Math.sin(t * 0.6) * 0.05 * drunk : 0);
    camera.rotation.x = player.pitch + (drunk ? Math.sin(t * 0.43) * 0.03 * drunk : 0);
    camera.rotation.z = drunk ? Math.sin(t * 0.9) * 0.06 * drunk : 0;

    updateInteractPrompt();

    for (let i = zones.length - 1; i >= 0; i--) {
      const z = zones[i];
      if (Math.hypot(player.pos.x - z.x, player.pos.z - z.z) < z.r) {
        zones.splice(i, 1); z.cb();
      }
    }

    if (snowPts) World.updateSnow(snowPts, dt, player.pos);

    // walking NPCs
    for (let i = movers.length - 1; i >= 0; i--) {
      const m = movers[i];
      const dx = m.tx - m.npc.position.x, dz = m.tz - m.npc.position.z;
      const d = Math.hypot(dx, dz);
      if (d < 0.15) { movers.splice(i, 1); m.npc.userData.baseRy = m.npc.rotation.y; m.res(); continue; }
      const step = Math.min(d, m.speed * dt);
      m.npc.position.x += dx / d * step;
      m.npc.position.z += dz / d * step;
      m.npc.rotation.y = Math.atan2(dx, dz); // model faces +z
      m.npc.position.y = Math.abs(Math.sin(t * 9)) * 0.05; // walk bounce
      if (m.npc.userData.armL) {
        m.npc.userData.armL.rotation.x = Math.sin(t * 9) * 0.55;
        m.npc.userData.armR.rotation.x = -Math.sin(t * 9) * 0.55;
      }
    }

    // npc idle sway + dance (kept subtle)
    for (const n of npcs) {
      if (movers.some(m => m.npc === n)) continue;
      n.rotation.y = n.userData.baseRy + Math.sin(t * 0.7 + n.userData.sway) * 0.08;
      const baseY = n.userData.baseY || 0;
      n.position.y = baseY + Math.abs(Math.sin(t * (n.userData.dance ? 2.3 : 1.2) + n.userData.sway)) * (n.userData.dance ? 0.05 : 0.012);
      if (n.userData.dance && n.userData.armL) {
        n.userData.armL.rotation.x = Math.sin(t * 2.3 + n.userData.sway) * 0.45;
        n.userData.armR.rotation.x = -Math.sin(t * 2.3 + n.userData.sway) * 0.45;
      }
    }
    if (markerSpr) markerSpr.position.y = markerY + Math.sin(t * 2.2) * 0.18;

    // scene effects: strobe, flickering TVs/lights
    if (scene.userData.strobe) {
      const s = scene.userData.strobe;
      if (Math.random() < 0.18) {
        s.intensity = Math.random() < 0.5 ? 2.2 : 0;
        s.color.setHex([0xffffff, 0x66ff88, 0x88ffaa][Math.random() * 3 | 0]);
      }
    }
    if (scene.userData.loungeTv && Math.random() < 0.2) {
      scene.userData.loungeTv.material.color.setHex(0x60708a + ((Math.random() * 0x202020) | 0));
    }
    if (scene.userData.flicker && Math.random() < 0.06) {
      scene.userData.flicker.intensity = Math.random() < 0.4 ? 0.05 : 0.5;
    }

    noiseT += dt;
    if (noiseT > 0.085) { noiseT = 0; drawNoise(); }

    renderer.render(scene, camera);
  }

  // ---------- interact ----------
  let currentTarget = null;
  function interactPos(it) {
    if (it.mesh) {
      const v = new THREE.Vector3();
      it.mesh.getWorldPosition(v);
      return v;
    }
    return it.pos;
  }
  function updateInteractPrompt() {
    currentTarget = null;
    if (player.frozen) { setPrompt(null); return; }
    let best = null, bestD = 1e9;
    for (const it of interactables) {
      if (it.disabled) continue;
      const p = interactPos(it);
      const d = Math.hypot(player.pos.x - p.x, player.pos.z - p.z);
      if (d < (it.radius || 2.6) && d < bestD) { best = it; bestD = d; }
    }
    currentTarget = best;
    setPrompt(best ? best.label : null);
  }
  function setPrompt(label) {
    const el = document.getElementById('interact-prompt');
    if (label) { document.getElementById('interact-text').textContent = label; el.style.opacity = 1; }
    else el.style.opacity = 0;
  }
  function tryInteract() {
    if (currentTarget && currentTarget.onUse) {
      const t = currentTarget;
      t.disabled = true;
      setPrompt(null);
      t.onUse();
    }
  }

  // ---------- narration (dimmed + frozen) ----------
  let advanceCb = null;
  const narEl = document.getElementById('narration');
  const narDim = document.getElementById('nar-dim');
  function typeText(el, text, cps = 38, tickSound = false) {
    return new Promise(res => {
      el.textContent = '';
      let i = 0;
      const iv = setInterval(() => {
        i++;
        el.textContent = text.slice(0, i);
        if (tickSound && i % 3 === 0) AudioSys.uiTick();
        if (i >= text.length) { clearInterval(iv); res(); }
      }, 1000 / cps);
      advanceCb = () => { clearInterval(iv); el.textContent = text; res(); };
    });
  }
  async function narrate(lines, opts = {}) {
    if (typeof lines === 'string') lines = [lines];
    const wasFrozen = player.frozen;
    player.frozen = true;
    if (opts.black) { narDim.style.background = '#000'; narDim.style.opacity = 1; }
    else if (opts.dim !== false) { narDim.style.background = 'rgba(0,0,0,0.62)'; narDim.style.opacity = 1; }
    narEl.style.opacity = 1;
    for (const line of lines) {
      await typeText(narEl, line, 34, true);
      narEl.textContent = line + ' ▾';
      await waitAdvance();
    }
    narEl.style.opacity = 0;
    narDim.style.opacity = 0;
    player.frozen = wasFrozen;
    await sleep(0.4);
    narEl.textContent = '';
    narDim.style.background = 'rgba(0,0,0,0.62)';
  }
  function waitAdvance() { return new Promise(res => { advanceCb = res; }); }

  // ---------- dialogue ----------
  const dlgEl = document.getElementById('dialogue');
  const dlgSpeaker = document.getElementById('dlg-speaker');
  const dlgLine = document.getElementById('dlg-line');
  const choicesEl = document.getElementById('choices');
  let choicesShowing = false;

  function npcByName(name) {
    return npcs.find(n => n.userData.name && n.userData.name.toLowerCase() === name.toLowerCase());
  }
  async function say(speaker, line) {
    dlgEl.style.display = 'block';
    document.getElementById('dlg-hint').style.display = 'block';
    choicesEl.style.display = 'none';
    dlgSpeaker.textContent = speaker.toUpperCase();
    const n = npcByName(speaker);
    focusNPC = (speaker.toLowerCase() === 'ethan') ? null : (n || null);
    AudioSys.babble(n ? n.userData.voice : (speaker.toLowerCase() === 'ethan' ? 3 : 5), line.length);
    await typeText(dlgLine, line, 46);
    await waitAdvance();
  }
  async function conv(lines) {
    for (const [s, l] of lines) await say(s, l);
    closeDialogue();
  }
  function closeDialogue() { dlgEl.style.display = 'none'; focusNPC = null; }

  function choice(options) {
    return new Promise(res => {
      choicesShowing = true;
      releasePointer();
      dlgEl.style.display = 'block';
      document.getElementById('dlg-hint').style.display = 'none';
      choicesEl.style.display = 'block';
      choicesEl.innerHTML = '';
      options.forEach((o, i) => {
        const d = document.createElement('div');
        d.className = 'choice';
        d.textContent = `${i + 1}. ${o.text}`;
        d.onclick = () => {
          choicesShowing = false;
          choicesEl.style.display = 'none';
          dlgEl.style.display = 'none';
          focusNPC = null;
          if (wantPointer && !paused) grabPointer();
          res(o.value !== undefined ? o.value : o.text);
        };
        choicesEl.appendChild(d);
      });
    });
  }

  // ---------- objective / fades / cards ----------
  function objective(text) {
    const el = document.getElementById('objective');
    if (!text) { el.style.opacity = 0; return; }
    document.getElementById('objective-text').textContent = text;
    el.style.opacity = 1;
  }
  const fadeEl = document.getElementById('fade');
  function fadeOut(s = 1.2) {
    fadeEl.style.transition = `opacity ${s}s`;
    fadeEl.style.opacity = 1;
    return sleep(s + 0.1);
  }
  function fadeIn(s = 1.2) {
    fadeEl.style.transition = `opacity ${s}s`;
    fadeEl.style.opacity = 0;
    return sleep(s + 0.1);
  }
  async function chapterCard(when, title, holdS = 3.2) {
    const card = document.getElementById('chapter-card');
    document.getElementById('card-when').textContent = when;
    document.getElementById('card-title').textContent = title;
    card.style.opacity = 1;
    AudioSys.stinger();
    await sleep(holdS);
    card.style.opacity = 0;
    await sleep(1.1);
  }
  function stamp(time, date) {
    document.getElementById('stamp-time').textContent = time;
    document.getElementById('stamp-date').textContent = date;
    document.getElementById('ph-clock').textContent = time;
  }
  const sleep = s => new Promise(r => setTimeout(r, s * 1000));

  // ---------- destination marker (white bobbing arrow) ----------
  let markerSpr = null, markerY = 3;
  function marker(x, z, y = 3) {
    if (markerSpr) { scene.remove(markerSpr); markerSpr = null; }
    if (x === null || x === undefined) return;
    const c = document.createElement('canvas');
    c.width = 64; c.height = 64;
    const g = c.getContext('2d');
    g.font = '44px Arial'; g.textAlign = 'center';
    g.shadowColor = '#000'; g.shadowBlur = 9;
    g.fillStyle = 'rgba(255,255,255,0.95)';
    g.fillText('▼', 32, 46);
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthTest: false }));
    sp.scale.set(0.8, 0.8, 1);
    sp.position.set(x, y, z);
    markerY = y;
    scene.add(sp);
    markerSpr = sp;
  }

  // ---------- taking a shot: head tips back, gulp, settle ----------
  async function shotAnim() {
    const p0 = player.pitch;
    AudioSys.gulp();
    for (let i = 0; i <= 10; i++) { player.pitch = p0 + (0.95 - p0) * (i / 10); await sleep(0.028); }
    await sleep(0.3);
    AudioSys.gulp();
    await sleep(0.25);
    for (let i = 0; i <= 12; i++) { player.pitch = 0.95 + (p0 - 0.95) * (i / 12); await sleep(0.04); }
    shake(0.12);
  }

  // ---------- effects ----------
  function shake(amp = 0.25, opts = {}) {
    shakeAmp = Math.max(shakeAmp, amp);
    if (opts.hit) {
      AudioSys.thud();
      const f = document.getElementById('flash');
      f.style.transition = 'none'; f.style.opacity = 1;
      requestAnimationFrame(() => { f.style.transition = 'opacity 0.5s'; f.style.opacity = 0; });
    }
  }
  function setTremor(v) { tremor = v; }
  function setEye(y) { player.eyeTarget = y; }
  function setDrunk(v) { drunkTarget = v; }
  function setCarry(on) {
    if (carryMesh) { camera.remove(carryMesh); carryMesh = null; }
    player.speedMult = 1; player.canSprint = true;
    if (on) {
      carryMesh = new THREE.Group();
      const box = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.14, 0.24),
        new THREE.MeshBasicMaterial({ color: 0x8a2828 }));
      const handle = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.04, 0.04),
        new THREE.MeshBasicMaterial({ color: 0x333 }));
      handle.position.y = 0.1;
      carryMesh.add(box); carryMesh.add(handle);
      carryMesh.position.set(0.34, -0.32, -0.62);
      carryMesh.rotation.y = -0.3;
      camera.add(carryMesh);
      player.speedMult = 0.62; player.canSprint = false;
    }
  }

  // ---------- scene management ----------
  function clearScene() {
    scene.traverse(o => { if (o.geometry) o.geometry.dispose(); });
    scene = new THREE.Scene();
    scene.add(camera);
    colliders = []; interactables = []; zones = []; npcs = []; movers = []; snowPts = null;
    focusNPC = null; markerSpr = null;
  }
  function loadScene(builder, spawn, opts = {}) {
    clearScene();
    const out = builder(scene) || {};
    colliders = out.colliders || [];
    if (out.snow) snowPts = out.snow;
    player.pos.set(spawn.x, 0, spawn.z);
    player.yaw = spawn.ry || 0;
    player.pitch = 0;
    player.eyeTarget = 1.74; player.eyeY = 1.74;
    walkSoundSnow = opts.snowSteps !== false;
    setNoise(opts.noise !== undefined ? opts.noise : 0.045);
    return out;
  }
  function addCollider(c) { colliders.push(c); }
  function addZone(x, z, r) { return new Promise(res => zones.push({ x, z, r, cb: res })); }
  function addInteract(opt) {
    return new Promise(res => {
      const it = Object.assign({}, opt);
      it.onUse = () => { interactables = interactables.filter(x => x !== it); res(); };
      interactables.push(it);
    });
  }

  // ---------- NPCs ----------
  const labelCache = {};
  function nameSprite(name) {
    if (!labelCache[name]) {
      const c = document.createElement('canvas');
      c.width = 128; c.height = 40;
      const g = c.getContext('2d');
      g.font = '16px Courier New';
      g.textAlign = 'center';
      g.fillStyle = 'rgba(255,255,255,0.92)';
      g.shadowColor = '#000'; g.shadowBlur = 5;
      g.fillText(name.toUpperCase(), 64, 16);
      g.fillText('▾', 64, 34);
      const tex = new THREE.CanvasTexture(c);
      tex.magFilter = THREE.NearestFilter;
      labelCache[name] = tex;
    }
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: labelCache[name], transparent: true, depthTest: false }));
    sp.scale.set(1.15, 0.36, 1);
    sp.position.y = 2.18;
    return sp;
  }
  function addNPC(group, { x, z, ry = 0, name, dance = false, label = true }) {
    group.position.set(x, 0, z);
    group.rotation.y = ry;
    group.userData.baseRy = ry;
    group.userData.dance = dance;
    group.userData.name = name;
    if (name && label && !/^pledge/i.test(name) && name !== 'P') group.add(nameSprite(name));
    scene.add(group);
    npcs.push(group);
    return group;
  }
  function removeNPC(group) {
    scene.remove(group);
    npcs = npcs.filter(n => n !== group);
  }
  function walkNPC(npc, tx, tz, speed = 1.6) {
    return new Promise(res => movers.push({ npc, tx, tz, speed, res }));
  }
  function spawnCrowd(n, cx, cz, spread, dance = true) {
    for (let i = 0; i < n; i++) {
      const p = World.npc();
      addNPC(p, {
        x: cx + (Math.random() - 0.5) * spread,
        z: cz + (Math.random() - 0.5) * spread,
        ry: Math.random() * Math.PI * 2,
        dance
      });
    }
  }
  function freeze(v) {
    player.frozen = v;
    if (!v) grabPointer();
  }
  function lookAt(x, z) {
    player.yaw = Math.atan2(-(x - player.pos.x), -(z - player.pos.z));
  }

  // cinematic camera move (cutscenes): tween player pos/yaw over dur seconds
  async function cinematic(from, to, lookTarget, dur = 8) {
    player.frozen = true;
    const steps = Math.floor(dur * 30);
    for (let i = 0; i <= steps; i++) {
      const k = i / steps;
      const e = k < 0.5 ? 2*k*k : 1 - Math.pow(-2*k + 2, 2) / 2; // easeInOut
      player.pos.x = from.x + (to.x - from.x) * e;
      player.pos.z = from.z + (to.z - from.z) * e;
      if (lookTarget) lookAt(lookTarget.x, lookTarget.z);
      await sleep(dur / steps);
    }
  }

  // ---------- PHONE ----------
  const Phone = (() => {
    const el = document.getElementById('phone');
    const body = document.getElementById('ph-body');
    const titleEl = document.getElementById('ph-title');
    const backEl = document.getElementById('ph-back');
    const repliesEl = document.getElementById('ph-replies');
    const hintEl = document.getElementById('phone-hint');
    const threads = {};
    const unread = {};
    let view = 'list';
    let open = false;
    let confiscated = false;
    let enabled = false;
    let pendingReply = null;

    const AV_COLORS = ['#7a4a8a', '#3a6a4a', '#8a5a2a', '#3a5a8a', '#8a3a3a', '#5a5a6a'];
    function avColor(name) {
      let h = 0;
      for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
      return AV_COLORS[Math.abs(h) % AV_COLORS.length];
    }
    function parseSender(thread, text) {
      // group chats embed "Name: message"
      const m = /^([A-Z][a-z]{1,12}):\s(.+)$/s.exec(text);
      if (m && /GC|SAE/i.test(thread)) return { name: m[1], body: m[2] };
      return { name: thread.replace(/ ?(GC|SAE)/gi, '').trim() || thread, body: text };
    }
    function ensure(t) { if (!threads[t]) { threads[t] = []; unread[t] = 0; } }

    function render() {
      backEl.style.display = view === 'list' ? 'none' : 'inline';
      titleEl.textContent = view === 'list' ? 'Messages' : view;
      body.innerHTML = '';
      if (view === 'list') {
        repliesEl.style.display = 'none';
        const names = Object.keys(threads);
        if (!names.length) body.innerHTML = '<div style="color:#444;text-align:center;margin-top:40px;font-size:12px">No messages</div>';
        for (const name of names) {
          const msgs = threads[name];
          const last = msgs.length ? msgs[msgs.length - 1].text : '';
          const d = document.createElement('div');
          d.className = 'thread-item';
          d.innerHTML = `<div><div>${name}</div><div class="preview">${last}</div></div>` +
            (unread[name] ? `<span class="badge">${unread[name]}</span>` : '');
          d.onclick = () => { view = name; unread[name] = 0; render(); };
          body.appendChild(d);
        }
      } else {
        const msgs = threads[view] || [];
        const isGroup = /GC/i.test(view);
        let lastSender = null;
        for (const m of msgs) {
          if (m.who === 'sys') {
            const d = document.createElement('div');
            d.className = 'msg sys'; d.textContent = m.text;
            body.appendChild(d);
            lastSender = null;
            continue;
          }
          const row = document.createElement('div');
          row.className = 'msg-row ' + m.who;
          if (m.who === 'them') {
            const p = parseSender(view, m.text);
            const av = document.createElement('div');
            av.className = 'avatar';
            av.style.background = avColor(p.name);
            av.textContent = p.name[0] || '?';
            row.appendChild(av);
            const col = document.createElement('div');
            col.className = 'msg-col';
            if (isGroup && p.name !== lastSender) {
              const s = document.createElement('div');
              s.className = 'sender'; s.textContent = p.name;
              col.appendChild(s);
            }
            const bub = document.createElement('div');
            bub.className = 'msg them'; bub.textContent = p.body;
            col.appendChild(bub);
            row.appendChild(col);
            lastSender = p.name;
          } else {
            const bub = document.createElement('div');
            bub.className = 'msg me'; bub.textContent = m.text;
            row.appendChild(bub);
            lastSender = null;
          }
          body.appendChild(row);
        }
        body.scrollTop = body.scrollHeight;
        if (pendingReply && pendingReply.thread === view) {
          repliesEl.style.display = 'block';
          repliesEl.innerHTML = '';
          pendingReply.options.forEach(o => {
            const r = document.createElement('div');
            r.className = 'reply-opt';
            r.textContent = o.text;
            r.onclick = () => {
              push(view, 'me', o.text, true);
              const pr = pendingReply; pendingReply = null;
              repliesEl.style.display = 'none';
              render();
              pr.res(o.value !== undefined ? o.value : o.text);
            };
            repliesEl.appendChild(r);
          });
        } else repliesEl.style.display = 'none';
      }
    }

    function push(thread, who, text, silent) {
      ensure(thread);
      threads[thread].push({ who, text });
      if (who === 'them' && !(open && view === thread)) {
        unread[thread]++;
        if (!silent && !confiscated) {
          AudioSys.buzz(); AudioSys.notifBlip();
          const p = parseSender(thread, text);
          showNotif(/GC/i.test(thread) ? `${thread} — ${p.name}` : thread, p.body);
        }
      }
      if (open) render();
    }

    function showNotif(from, text) {
      const n = document.getElementById('notif');
      document.getElementById('n-from').textContent = from;
      document.getElementById('n-text').textContent = text.length > 70 ? text.slice(0, 70) + '…' : text;
      n.classList.add('show');
      setTimeout(() => n.classList.remove('show'), 4200);
    }

    function toggle() {
      if (!enabled) return;
      if (confiscated) {
        const n = document.getElementById('notif');
        document.getElementById('n-from').textContent = '';
        document.getElementById('n-text').textContent = 'You don\'t have your phone.';
        n.classList.add('show');
        setTimeout(() => n.classList.remove('show'), 2500);
        return;
      }
      open = !open;
      el.classList.toggle('open', open);
      if (open) { releasePointer(); render(); }
      else if (wantPointer && !player.frozen && !paused) grabPointer();
    }
    function close() {
      open = false; el.classList.remove('open');
      if (wantPointer && !player.frozen && !paused) grabPointer();
    }
    function waitReply(thread, options) {
      ensure(thread);
      return new Promise(res => {
        pendingReply = { thread, options, res };
        if (open && view === thread) render();
      });
    }
    function setEnabled(v) { enabled = v; hintEl.style.opacity = v && !confiscated ? 1 : 0; }
    function confiscate(v) {
      confiscated = v;
      hintEl.style.opacity = enabled && !v ? 1 : 0;
      if (v && open) close();
    }
    backEl.onclick = () => { view = 'list'; render(); };

    return {
      toggle, close, waitReply, confiscate, setEnabled,
      msg: (thread, text, silent) => push(thread, 'them', text, silent),
      me: (thread, text) => push(thread, 'me', text, true),
      sys: (thread, text) => push(thread, 'sys', text, true),
      isOpen: () => open,
      isConfiscated: () => confiscated,
    };
  })();

  // ---------- boot ----------
  World.buildTextures();
  drawNoise();
  scene.add(camera);
  tick();

  document.getElementById('btn-start').addEventListener('click', async () => {
    AudioSys.init(); AudioSys.resume();
    AudioSys.hiss();
    started = true;
    const ts = document.getElementById('title-screen');
    ts.style.opacity = 0;
    setTimeout(() => ts.style.display = 'none', 1600);
    Story.run().catch(e => console.error(e));
  });

  return {
    scene: () => scene, camera, player, renderer,
    narrate, say, conv, closeDialogue, choice, objective,
    fadeOut, fadeIn, chapterCard, stamp, sleep,
    loadScene, addZone, addInteract, addCollider, addNPC, removeNPC, walkNPC, spawnCrowd,
    freeze, lookAt, grabPointer, releasePointer, cinematic, marker, shotAnim,
    shake, setTremor, setEye, setDrunk, setCarry, setNoise,
    Phone,
    setSnowSteps: v => walkSoundSnow = v,
    endScreen: (text, note) => {
      const es = document.getElementById('end-screen');
      document.getElementById('end-text').innerHTML = text;
      document.getElementById('end-note').innerHTML = note || '';
      es.style.display = 'flex';
    }
  };
})();
