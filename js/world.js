// HOUSE PLEDGE — world / scene construction. PS1-flavored procedural assets.
const World = (() => {

  // ---------- canvas texture helpers ----------
  function makeTex(w, h, drawFn, repeatX = 1, repeatY = 1) {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const g = c.getContext('2d');
    drawFn(g, w, h);
    const tex = new THREE.CanvasTexture(c);
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeatX, repeatY);
    return tex;
  }
  function dither(g, w, h, amount = 18) {
    const img = g.getImageData(0, 0, w, h), d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const n = (Math.random() - 0.5) * amount;
      d[i] += n; d[i+1] += n; d[i+2] += n;
    }
    g.putImageData(img, 0, 0);
  }

  const TEX = {};
  function buildTextures() {
    TEX.snow = makeTex(64, 64, (g,w,h) => {
      g.fillStyle = '#cfd4dc'; g.fillRect(0,0,w,h);
      for (let i=0;i<260;i++){ g.fillStyle = Math.random()<.5?'#dde2ea':'#c2c8d2'; g.fillRect(Math.random()*w|0, Math.random()*h|0, 2, 2); }
      dither(g,w,h,14);
    }, 40, 40);

    TEX.path = makeTex(64, 64, (g,w,h) => {
      g.fillStyle = '#8d9098'; g.fillRect(0,0,w,h);
      for (let i=0;i<150;i++){ g.fillStyle = Math.random()<.5?'#7c7f87':'#9a9da6'; g.fillRect(Math.random()*w|0, Math.random()*h|0, 3, 2); }
      for (let i=0;i<6;i++){ g.fillStyle='#b8bdc6'; g.fillRect(Math.random()*w|0, Math.random()*h|0, 9, 5); }
      dither(g,w,h,16);
    }, 3, 30);

    TEX.brick = makeTex(64, 64, (g,w,h) => {
      g.fillStyle = '#6e4438'; g.fillRect(0,0,w,h);
      g.fillStyle = '#5a352b';
      for (let y=0;y<h;y+=8){
        g.fillRect(0,y,w,1);
        const off = (y/8)%2 ? 8 : 0;
        for (let x=off;x<w;x+=16) g.fillRect(x,y,1,8);
      }
      dither(g,w,h,20);
    }, 6, 3);

    TEX.gothic = makeTex(64, 64, (g,w,h) => {
      g.fillStyle = '#5d5f66'; g.fillRect(0,0,w,h);
      g.fillStyle = '#4c4e55';
      for (let y=0;y<h;y+=12){
        g.fillRect(0,y,w,2);
        const off = (y/12)%2 ? 14 : 0;
        for (let x=off;x<w;x+=28) g.fillRect(x,y,2,12);
      }
      for (let i=0;i<60;i++){ g.fillStyle='rgba(40,42,48,0.5)'; g.fillRect(Math.random()*w|0,Math.random()*h|0,3,2); }
      dither(g,w,h,18);
    }, 5, 3);

    TEX.window = makeTex(32, 48, (g,w,h) => {
      g.fillStyle = '#1a1c22'; g.fillRect(0,0,w,h);
      g.fillStyle = '#e8c97a';
      g.fillRect(3,3,11,19); g.fillRect(18,3,11,19);
      g.fillRect(3,26,11,19); g.fillRect(18,26,11,19);
      dither(g,w,h,26);
    });
    TEX.windowDark = makeTex(32, 48, (g,w,h) => {
      g.fillStyle = '#15171c'; g.fillRect(0,0,w,h);
      g.fillStyle = '#23262e';
      g.fillRect(3,3,11,19); g.fillRect(18,3,11,19);
      g.fillRect(3,26,11,19); g.fillRect(18,26,11,19);
      dither(g,w,h,12);
    });
    TEX.windowGreen = makeTex(32, 48, (g,w,h) => {
      g.fillStyle = '#101510'; g.fillRect(0,0,w,h);
      g.fillStyle = '#5fdc7a';
      g.fillRect(3,3,11,19); g.fillRect(18,3,11,19);
      g.fillRect(3,26,11,19); g.fillRect(18,26,11,19);
      dither(g,w,h,30);
    });

    TEX.concrete = makeTex(64, 64, (g,w,h) => {
      g.fillStyle = '#6e6f73'; g.fillRect(0,0,w,h);
      for (let i=0;i<240;i++){ g.fillStyle=Math.random()<.5?'#636468':'#797a7e'; g.fillRect(Math.random()*w|0,Math.random()*h|0,3,2); }
      for (let i=0;i<9;i++){ g.fillStyle='rgba(50,46,40,0.5)'; const x=Math.random()*w,y=Math.random()*h; g.beginPath(); g.ellipse(x,y,3+Math.random()*7,2+Math.random()*5,0,0,7); g.fill(); }
      dither(g,w,h,16);
    }, 4, 2);

    TEX.woodFloor = makeTex(64, 64, (g,w,h) => {
      g.fillStyle = '#7a5a3a'; g.fillRect(0,0,w,h);
      g.fillStyle = '#684a2e';
      for (let y=0;y<h;y+=10) g.fillRect(0,y,w,1);
      for (let i=0;i<90;i++){ g.fillStyle='rgba(96,72,46,0.5)'; g.fillRect(Math.random()*w|0,Math.random()*h|0,8,1); }
      for (let i=0;i<5;i++){ g.fillStyle='rgba(60,42,24,0.55)'; const x=Math.random()*w,y=Math.random()*h; g.beginPath(); g.ellipse(x,y,4+Math.random()*6,3+Math.random()*4,0,0,7); g.fill(); }
      dither(g,w,h,14);
    }, 8, 8);

    TEX.carpet = makeTex(64, 64, (g,w,h) => {
      g.fillStyle = '#4a4e58'; g.fillRect(0,0,w,h);
      for (let i=0;i<200;i++){ g.fillStyle=Math.random()<.5?'#42454f':'#525663'; g.fillRect(Math.random()*w|0,Math.random()*h|0,2,2); }
      dither(g,w,h,12);
    }, 6, 6);

    TEX.hallCarpet = makeTex(64, 64, (g,w,h) => {
      g.fillStyle = '#5a4848'; g.fillRect(0,0,w,h);
      g.fillStyle = '#4e3e3e';
      for (let y=0;y<h;y+=16) g.fillRect(0,y,w,2);
      for (let i=0;i<160;i++){ g.fillStyle=Math.random()<.5?'#544343':'#604c4c'; g.fillRect(Math.random()*w|0,Math.random()*h|0,2,2); }
      dither(g,w,h,12);
    }, 2, 12);

    TEX.tile = makeTex(64, 64, (g,w,h) => {
      g.fillStyle = '#b8b4a8'; g.fillRect(0,0,w,h);
      g.strokeStyle = '#9a968a'; g.lineWidth = 1;
      for (let y=0;y<=h;y+=16){ g.beginPath(); g.moveTo(0,y); g.lineTo(w,y); g.stroke(); }
      for (let x=0;x<=w;x+=16){ g.beginPath(); g.moveTo(x,0); g.lineTo(x,h); g.stroke(); }
      dither(g,w,h,12);
    }, 8, 8);

    TEX.wallpaper = makeTex(64, 64, (g,w,h) => {
      g.fillStyle = '#b8b0a0'; g.fillRect(0,0,w,h);
      g.fillStyle = '#aaa294';
      for (let x=0;x<w;x+=10) g.fillRect(x,0,2,h);
      dither(g,w,h,10);
    }, 4, 2);

    TEX.cinder = makeTex(64, 64, (g,w,h) => {
      g.fillStyle = '#56585c'; g.fillRect(0,0,w,h);
      g.fillStyle = '#47494d';
      for (let y=0;y<h;y+=14){
        g.fillRect(0,y,w,2);
        const off=(y/14)%2?16:0;
        for (let x=off;x<w;x+=32) g.fillRect(x,y,2,14);
      }
      for (let i=0;i<14;i++){ g.fillStyle='rgba(34,36,34,0.5)'; const x=Math.random()*w; g.fillRect(x,0,2+Math.random()*4,h*Math.random()); }
      for (let i=0;i<10;i++){ g.fillStyle='rgba(46,58,40,0.45)'; const x=Math.random()*w,y=Math.random()*h; g.beginPath(); g.ellipse(x,y,2+Math.random()*5,2+Math.random()*4,0,0,7); g.fill(); }
      dither(g,w,h,20);
    }, 4, 2);

    // dense sharpie scribble — tiles across whole basement walls
    TEX.scribble = makeTex(128, 128, (g,w,h) => {
      g.clearRect(0,0,w,h);
      const inks = ['rgba(28,28,32,0.8)','rgba(110,28,28,0.7)','rgba(28,28,90,0.65)','rgba(30,70,40,0.6)'];
      for (let i = 0; i < 46; i++) {
        g.strokeStyle = inks[i % inks.length];
        g.lineWidth = 1 + Math.random() * 1.5;
        g.beginPath();
        const x = Math.random()*w, y = Math.random()*h;
        g.moveTo(x, y);
        for (let k = 0; k < 3; k++) g.lineTo(x + (Math.random()-0.5)*26, y + (Math.random()-0.5)*16);
        g.stroke();
      }
      const words = ['ΣAE','09','RUSH','PC 24','86','KEGGY','BD','PLEDGE','XX','RIP','NYΣΦ','...'];
      g.font = 'bold 10px Arial';
      for (let i = 0; i < 14; i++) {
        g.fillStyle = inks[i % inks.length];
        g.save();
        g.translate(Math.random()*w, Math.random()*h);
        g.rotate((Math.random()-0.5)*0.7);
        g.fillText(words[i % words.length], 0, 0);
        g.restore();
      }
    }, 3, 1);

    TEX.banner = makeTex(24, 48, (g,w,h) => {
      g.fillStyle = '#5a1f2a'; g.fillRect(0,0,w,h);
      g.strokeStyle = '#caa84a'; g.strokeRect(1.5,1.5,w-3,h-3);
      g.fillStyle = '#caa84a'; g.font = 'bold 18px Georgia'; g.textAlign='center';
      g.fillText('W', w/2, 32);
      dither(g,w,h,16);
    });

    TEX.patBanner = makeTex(96, 28, (g,w,h) => {
      g.fillStyle = '#e8e4d8'; g.fillRect(0,0,w,h);
      g.fillStyle = '#1d7a35'; g.font = 'bold 11px Arial'; g.textAlign = 'center';
      g.fillText("HAPPY ST. PAT'S", w/2, 18);
      g.fillStyle = '#2a9a48';
      g.fillText('☘', 10, 19); g.fillText('☘', w-10, 19);
      dither(g,w,h,10);
    });

    TEX.clock = makeTex(32, 32, (g,w,h) => {
      g.fillStyle = '#d8d2b8'; g.beginPath(); g.arc(16,16,14,0,7); g.fill();
      g.strokeStyle = '#2a2a2a'; g.lineWidth = 2;
      g.beginPath(); g.moveTo(16,16); g.lineTo(16,6); g.stroke();
      g.beginPath(); g.moveTo(16,16); g.lineTo(23,19); g.stroke();
      g.strokeStyle = '#555'; g.lineWidth = 1; g.beginPath(); g.arc(16,16,14,0,7); g.stroke();
    });

    // dorm decor
    TEX.flagUS = makeTex(76, 40, (g,w,h) => {
      for (let i = 0; i < 13; i++) { g.fillStyle = i % 2 ? '#e8e4dc' : '#a83242'; g.fillRect(0, i * (h/13), w, h/13 + 0.5); }
      g.fillStyle = '#2c3a6a'; g.fillRect(0, 0, 30, h * 7/13);
      g.fillStyle = '#e8e4dc';
      for (let r = 0; r < 5; r++) for (let c = 0; c < 6; c++) g.fillRect(3 + c*4.5, 2.5 + r*4, 1.6, 1.6);
      dither(g,w,h,12);
    });
    TEX.beerPoster = makeTex(48, 64, (g,w,h) => {
      g.fillStyle = '#16294a'; g.fillRect(0,0,w,h);
      g.fillStyle = '#c8d2dc';
      g.beginPath(); g.moveTo(6,40); g.lineTo(24,16); g.lineTo(42,40); g.closePath(); g.fill();
      g.fillStyle = '#e8eef6'; g.font = 'bold 9px Arial'; g.textAlign = 'center';
      g.fillText('NATTY', w/2, 50);
      g.fillText('LITE', w/2, 60);
      dither(g,w,h,16);
    });
    TEX.skiPoster = makeTex(48, 64, (g,w,h) => {
      g.fillStyle = '#27354f'; g.fillRect(0,0,w,h);
      g.fillStyle = '#e8ecf4';
      g.beginPath(); g.moveTo(2,52); g.lineTo(20,12); g.lineTo(34,34); g.lineTo(46,52); g.closePath(); g.fill();
      g.fillStyle = '#c9d4e8'; g.font = 'bold 8px Arial'; g.textAlign = 'center';
      g.fillText('WATERFORD', w/2, 60);
      dither(g,w,h,16);
    });
  }

  function mat(tex, opts = {}) { return new THREE.MeshLambertMaterial(Object.assign({ map: tex }, opts)); }
  function flat(color, opts = {}) { return new THREE.MeshLambertMaterial(Object.assign({ color }, opts)); }
  function greekSign(text, color = '#d8c890') {
    const t = makeTex(96, 32, (g,w,h) => {
      g.clearRect(0,0,w,h);
      g.fillStyle = color; g.font = 'bold 22px Georgia';
      g.textAlign = 'center'; g.fillText(text, w/2, 24);
    });
    return new THREE.Mesh(new THREE.PlaneGeometry(3, 1), new THREE.MeshBasicMaterial({ map: t, transparent: true }));
  }

  // ---------- generic building ----------
  function building(w, h, d, wallTex, winTex, winRows = 3, winCols = 5, gabled = false) {
    const grp = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(wallTex));
    body.position.y = h / 2;
    grp.add(body);
    const winG = new THREE.PlaneGeometry(1.4, 2.1);
    const wm = new THREE.MeshBasicMaterial({ map: winTex });
    for (const sgn of [1, -1]) {
      for (let r = 0; r < winRows; r++) {
        for (let c = 0; c < winCols; c++) {
          if (Math.random() < 0.25) continue;
          const m = new THREE.Mesh(winG, wm);
          m.position.set(-w/2 + (c+1) * w/(winCols+1), h * (0.28 + r * 0.55/winRows) + 1, sgn * (d/2 + 0.02));
          if (sgn < 0) m.rotation.y = Math.PI;
          grp.add(m);
        }
      }
    }
    if (gabled) {
      const roof = new THREE.Mesh(new THREE.ConeGeometry(Math.max(w,d)*0.62, h*0.45, 4), flat(0x23252b));
      roof.rotation.y = Math.PI/4;
      roof.scale.set(w/Math.max(w,d), 1, d/Math.max(w,d));
      roof.position.y = h + h*0.22; grp.add(roof);
    } else {
      const roof = new THREE.Mesh(new THREE.BoxGeometry(w + 0.6, 0.5, d + 0.6), flat(0x2a2c30));
      roof.position.y = h + 0.25; grp.add(roof);
    }
    grp.userData.collider = { hw: w/2 + 0.5, hd: d/2 + 0.5 };
    return grp;
  }

  // ---------- gothic SAE mansion ----------
  function saeHouse(lit = 'warm') {
    const grp = new THREE.Group();
    const winTex = lit === 'green' ? TEX.windowGreen : (lit === 'dark' ? TEX.windowDark : TEX.window);
    const stone = mat(TEX.gothic);
    const main = new THREE.Mesh(new THREE.BoxGeometry(26, 13, 16), stone);
    main.position.y = 6.5; grp.add(main);
    const roofM = flat(0x23252b);
    const roof = new THREE.Mesh(new THREE.ConeGeometry(15.5, 8, 4), roofM);
    roof.rotation.y = Math.PI / 4;
    roof.scale.set(1.25, 1, 0.78);
    roof.position.y = 17; grp.add(roof);
    for (const sx of [-11, 11]) {
      const tw = new THREE.Mesh(new THREE.BoxGeometry(7, 18, 7), stone);
      tw.position.set(sx, 9, 2); grp.add(tw);
      const sp = new THREE.Mesh(new THREE.ConeGeometry(5.4, 7.5, 4), roofM);
      sp.rotation.y = Math.PI / 4;
      sp.position.set(sx, 21.5, 2); grp.add(sp);
    }
    const wm = new THREE.MeshBasicMaterial({ map: winTex });
    const tallWin = new THREE.PlaneGeometry(1.5, 3.2);
    for (let i = 0; i < 5; i++) {
      const m = new THREE.Mesh(tallWin, wm);
      m.position.set(-8 + i * 4, 7.5, 8.03); grp.add(m);
      const m2 = new THREE.Mesh(tallWin, wm);
      m2.position.set(-8 + i * 4, 3.4, 8.03); grp.add(m2);
    }
    for (const sx of [-11, 11]) {
      for (let r = 0; r < 3; r++) {
        const m = new THREE.Mesh(tallWin, wm);
        m.position.set(sx, 4 + r * 5, 5.56); grp.add(m);
      }
    }
    const door = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 4.4), flat(0x16140f));
    door.position.set(0, 2.2, 8.05); grp.add(door);
    for (const sx of [-2.4, 2.4]) {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.5, 5.4, 6), flat(0x84868d));
      col.position.set(sx, 2.7, 9.4); grp.add(col);
    }
    const porch = new THREE.Mesh(new THREE.BoxGeometry(8, 0.5, 4), flat(0x6c6e74));
    porch.position.set(0, 0.5, 9.6); grp.add(porch);
    const steps = new THREE.Mesh(new THREE.BoxGeometry(6, 0.5, 2), flat(0x7b7d83));
    steps.position.set(0, 0.22, 12); grp.add(steps);
    const lm = greekSign('ΣAE');
    lm.position.set(0, 5.4, 8.06); grp.add(lm);
    grp.userData.collider = { hw: 15, hd: 9.5 };
    return grp;
  }

  // ---------- props ----------
  function lamppost(on = true, color = 0xffd9a0, banner = true) {
    const grp = new THREE.Group();
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.12, 4.6, 5), flat(0x1e2024));
    pole.position.y = 2.3; grp.add(pole);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.3, 6, 5), new THREE.MeshBasicMaterial({ color: on ? color : 0x333339 }));
    head.position.y = 4.7; grp.add(head);
    if (on) {
      const light = new THREE.PointLight(color, 0.85, 16, 1.6);
      light.position.y = 4.6; grp.add(light);
    }
    if (banner) {
      const b = new THREE.Mesh(new THREE.PlaneGeometry(0.66, 1.3), new THREE.MeshBasicMaterial({ map: TEX.banner, side: THREE.DoubleSide }));
      b.position.set(0.45, 3.6, 0); grp.add(b);
    }
    return grp;
  }

  function ironFence(len) {
    const grp = new THREE.Group();
    const black = flat(0x17181c);
    const rail = new THREE.Mesh(new THREE.BoxGeometry(len, 0.06, 0.05), black);
    rail.position.y = 0.95; grp.add(rail);
    const rail2 = rail.clone(); rail2.position.y = 0.35; grp.add(rail2);
    for (let x = -len/2; x <= len/2; x += 1.1) {
      const p = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.05, 4), black);
      p.position.set(x, 0.52, 0); grp.add(p);
    }
    return grp;
  }

  function bench() {
    const grp = new THREE.Group();
    const seat = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.08, 0.5), flat(0x4a3a28));
    seat.position.y = 0.46; grp.add(seat);
    const back = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.5, 0.07), flat(0x4a3a28));
    back.position.set(0, 0.78, -0.22); grp.add(back);
    for (const sx of [-0.75, 0.75]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.46, 0.4), flat(0x1c1d22));
      leg.position.set(sx, 0.23, 0); grp.add(leg);
    }
    return grp;
  }

  function bareTree(scale = 1) {
    const grp = new THREE.Group();
    const bark = flat(0x3b3027);
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18*scale, 0.3*scale, 4.4*scale, 5), bark);
    trunk.position.y = 2.2*scale; grp.add(trunk);
    for (let i = 0; i < 5; i++) {
      const br = new THREE.Mesh(new THREE.CylinderGeometry(0.04*scale, 0.1*scale, 2.4*scale, 4), bark);
      br.position.y = (3.4 + Math.random() * 1.4) * scale;
      br.rotation.z = (Math.random() - 0.5) * 1.6;
      br.rotation.y = Math.random() * Math.PI * 2;
      br.translateY(1 * scale);
      grp.add(br);
    }
    return grp;
  }

  // ---------- NPC — human-shaped, model faces +z ----------
  function npc(opts = {}) {
    const grp = new THREE.Group();
    const female = !!opts.female;
    const scale = opts.height || (0.92 + Math.random() * 0.16) * (female ? 0.94 : 1);
    const jacket = opts.color !== undefined ? opts.color : [0x37415c, 0x4c3a3a, 0x2f4a39, 0x3d3d44, 0x5c5340, 0x4a3656, 0x2c4a52][Math.random()*7|0];
    const pants = opts.pants !== undefined ? opts.pants : [0x23252c, 0x2c3242, 0x3a3026, 0x44485a][Math.random()*4|0];
    const skin = opts.skin || [0xc9a384, 0xb98a66, 0x8a6243, 0xd9b394][Math.random()*4|0];
    const hairC = opts.hair !== undefined ? opts.hair : [0x2c2018, 0x1a1612, 0x4a3520, 0x6a5232, 0x101010][Math.random()*5|0];
    const jm = flat(jacket);

    // legs — two boxes
    for (const sx of [-0.11, 0.11]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.85, 0.2), flat(pants));
      leg.position.set(sx, 0.425, 0); grp.add(leg);
    }
    // torso — box with shoulders
    const tw = female ? 0.38 : 0.46;
    const torso = new THREE.Mesh(new THREE.BoxGeometry(tw, 0.62, 0.24), jm);
    torso.position.y = 1.16; grp.add(torso);
    // jacket zipper line
    const zip = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.56, 0.012), flat(0x1c1d22));
    zip.position.set(0, 1.16, 0.127); grp.add(zip);
    // arms — pivoted at the shoulder so they can swing
    for (const sx of [-1, 1]) {
      const pivot = new THREE.Group();
      pivot.position.set(sx * (tw/2 + 0.07), 1.43, 0);
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.6, 0.13), jm);
      arm.position.y = -0.27;
      pivot.add(arm);
      // hand
      const hand = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.09, 0.09), flat(skin));
      hand.position.y = -0.6;
      pivot.add(hand);
      pivot.rotation.z = sx * -0.06;
      grp.add(pivot);
      if (sx < 0) grp.userData.armL = pivot; else grp.userData.armR = pivot;
    }
    // head + eyes on the FRONT (+z)
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.155, 8, 7), flat(skin));
    head.position.y = 1.61; grp.add(head);
    grp.userData.head = head;
    for (const sx of [-0.055, 0.055]) {
      const eye = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.02), flat(0x1d1612));
      eye.position.set(sx, 1.64, 0.142); grp.add(eye);
    }
    // hair / beanie
    if (female) {
      const hairTop = new THREE.Mesh(new THREE.SphereGeometry(0.165, 8, 6, 0, Math.PI*2, 0, Math.PI/1.9), flat(hairC));
      hairTop.position.y = 1.63; grp.add(hairTop);
      const hairBack = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.44, 0.1), flat(hairC));
      hairBack.position.set(0, 1.42, -0.11); grp.add(hairBack);
      if (opts.hat) {
        const hat = new THREE.Mesh(new THREE.SphereGeometry(0.17, 8, 5, 0, Math.PI*2, 0, Math.PI/2.4), flat(opts.hat));
        hat.position.y = 1.66; grp.add(hat);
      }
    } else if (opts.beanie !== false && Math.random() < (opts.beanie ? 1 : 0.45)) {
      const hat = new THREE.Mesh(new THREE.SphereGeometry(0.165, 8, 5, 0, Math.PI*2, 0, Math.PI/2.2), flat(opts.hat || jacket));
      hat.position.y = 1.64; grp.add(hat);
    } else {
      const hair = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 5, 0, Math.PI*2, 0, Math.PI/2.5), flat(hairC));
      hair.position.y = 1.645; grp.add(hair);
    }
    // sometimes a backpack
    if (opts.backpack || (opts.backpack !== false && Math.random() < 0.25)) {
      const bp = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.4, 0.14), flat([0x6a3030, 0x2c4a6a, 0x3a3a3a][Math.random()*3|0]));
      bp.position.set(0, 1.18, -0.2); grp.add(bp);
    }
    grp.scale.setScalar(scale);
    grp.userData.sway = Math.random() * Math.PI * 2;
    grp.userData.isNPC = true;
    grp.userData.voice = opts.voice || (1 + Math.random() * 6 | 0);
    return grp;
  }

  function stringLights(from, to, n = 9, c1 = 0x4dff6a, c2 = 0xc8ffc0) {
    const grp = new THREE.Group();
    for (let i = 1; i < n; i++) {
      const t = i / n;
      const x = from.x + (to.x - from.x) * t;
      const z = from.z + (to.z - from.z) * t;
      const y = from.y + (to.y - from.y) * t - Math.sin(t * Math.PI) * 0.8;
      const b = new THREE.Mesh(new THREE.SphereGeometry(0.09, 5, 4),
        new THREE.MeshBasicMaterial({ color: i % 2 ? c1 : c2 }));
      b.position.set(x, y, z); grp.add(b);
    }
    return grp;
  }

  // furniture
  function bed(color = 0x4a5a7a) {
    const grp = new THREE.Group();
    const frame = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.45, 2.2), flat(0x5a4630));
    frame.position.y = 0.22; grp.add(frame);
    const matr = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.22, 2.1), flat(color));
    matr.position.y = 0.55; grp.add(matr);
    const pillow = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.14, 0.45), flat(0xd8d8d0));
    pillow.position.set(0, 0.7, -0.78); grp.add(pillow);
    return grp;
  }
  function desk() {
    const grp = new THREE.Group();
    const top = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.08, 0.7), flat(0x6e5638));
    top.position.y = 0.78; grp.add(top);
    for (const [sx, sz] of [[-0.62,-0.28],[0.62,-0.28],[-0.62,0.28],[0.62,0.28]]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.78, 0.07), flat(0x4e3c26));
      leg.position.set(sx, 0.39, sz); grp.add(leg);
    }
    return grp;
  }
  function laptop(open = true, glow = 0x9fb6d8) {
    const grp = new THREE.Group();
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.025, 0.3), flat(0x9a9da3));
    grp.add(base);
    if (open) {
      const scr = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.3, 0.02), new THREE.MeshBasicMaterial({ color: glow }));
      scr.position.set(0, 0.15, -0.15); scr.rotation.x = -0.25; grp.add(scr);
      grp.userData.screen = scr;
    }
    return grp;
  }
  function cup(color = 0xc03030) {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.038, 0.13, 7), flat(color));
    m.position.y = 0.065;
    return m;
  }
  function can() {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.12, 6), flat([0x8898a8, 0x5878a0, 0x90651f][Math.random()*3|0]));
    m.position.y = 0.06;
    if (Math.random() < 0.6) { m.rotation.z = Math.PI/2; m.position.y = 0.035; }
    return m;
  }
  function trashBag() {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.34 + Math.random()*0.18, 6, 5), flat(0x16181a));
    m.scale.y = 0.75; m.position.y = 0.26;
    return m;
  }
  function keg() {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.62, 8), flat(0x8d9298));
    m.position.y = 0.31;
    return m;
  }

  // ---------- SNOW ----------
  function snowSystem(count = 1200, range = 60, storm = false) {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i*3] = (Math.random() - 0.5) * range * 2;
      pos[i*3+1] = Math.random() * 22;
      pos[i*3+2] = (Math.random() - 0.5) * range * 2;
      vel[i] = 1.2 + Math.random() * (storm ? 4 : 1.4);
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const m = new THREE.PointsMaterial({ color: 0xe8ecf2, size: storm ? 0.16 : 0.1, transparent: true, opacity: 0.85 });
    const pts = new THREE.Points(geo, m);
    pts.userData = { vel, range, storm, drift: storm ? 6 : 1.2 };
    pts.frustumCulled = false;
    return pts;
  }
  function updateSnow(pts, dt, center) {
    const pos = pts.geometry.attributes.position.array;
    const { vel, range, drift } = pts.userData;
    const n = vel.length;
    for (let i = 0; i < n; i++) {
      pos[i*3+1] -= vel[i] * dt;
      pos[i*3] += (Math.sin(pos[i*3+1] * 0.8 + i) * 0.4 + drift) * dt;
      if (pos[i*3+1] < 0) {
        pos[i*3+1] = 18 + Math.random() * 4;
        pos[i*3] = center.x + (Math.random() - 0.5) * range * 2;
        pos[i*3+2] = center.z + (Math.random() - 0.5) * range * 2;
      }
    }
    pts.geometry.attributes.position.needsUpdate = true;
  }

  // =========================================================================
  // SCENES
  // =========================================================================

  // ---- CAMPUS ----  mode: 'day' | 'evening' | 'night' | 'storm' | 'stpat'
  function buildCampus(scene, mode) {
    const colliders = [];
    const isDay = mode === 'day';
    const isStorm = mode === 'storm';
    const isPat = mode === 'stpat';
    const night = !isDay && mode !== 'evening';

    let fogC, fogD;
    if (isDay)      { fogC = 0xbfc6d2; fogD = 0.012; scene.background = new THREE.Color(0xbfc6d2); }
    else if (mode === 'evening') { fogC = 0x4d5468; fogD = 0.013; scene.background = new THREE.Color(0x434a60); }
    else if (isStorm){ fogC = 0x10131a; fogD = 0.05; scene.background = new THREE.Color(0x0c0e14); }
    else            { fogC = 0x0d1018; fogD = 0.024; scene.background = new THREE.Color(0x0a0c12); }
    scene.fog = new THREE.FogExp2(fogC, fogD);

    const hemi = new THREE.HemisphereLight(
      isDay ? 0xcdd4e0 : (mode === 'evening' ? 0x6a7290 : 0x232838),
      isDay ? 0x8a8f9a : 0x14161c,
      isDay ? 1.0 : (mode === 'evening' ? 0.85 : (isStorm ? 0.34 : 0.52)));
    scene.add(hemi);
    if (isDay) {
      const sun = new THREE.DirectionalLight(0xfff2da, 0.7);
      sun.position.set(30, 40, 20); scene.add(sun);
    } else if (mode === 'evening') {
      const dusk = new THREE.DirectionalLight(0xe8a86a, 0.35);
      dusk.position.set(-40, 14, 10); scene.add(dusk);
    }

    const ground = new THREE.Mesh(new THREE.PlaneGeometry(440, 440), mat(TEX.snow));
    ground.rotation.x = -Math.PI / 2; scene.add(ground);
    const path = new THREE.Mesh(new THREE.PlaneGeometry(6, 280), mat(TEX.path));
    path.rotation.x = -Math.PI / 2; path.position.set(0, 0.02, -45); scene.add(path);
    const cross = new THREE.Mesh(new THREE.PlaneGeometry(130, 5), mat(TEX.path));
    cross.rotation.x = -Math.PI / 2; cross.position.set(0, 0.02, 20); scene.add(cross);

    const winT = night || isPat ? TEX.window : TEX.windowDark;

    const addB = (b, x, z, ry = 0) => { b.position.set(x, 0, z); b.rotation.y = ry; scene.add(b);
      const c = b.userData.collider; if (c) colliders.push({ x, z, hw: c.hw, hd: c.hd }); return b; };

    // ===== THE QUAD =====
    addB(building(22, 12, 14, TEX.brick, winT, 3, 6, true), 18, 62);
    const dining = addB(building(28, 9, 18, TEX.gothic, winT, 2, 7, true), -34, 18);
    addB(building(36, 18, 20, TEX.gothic, winT, 4, 8, true), 38, -14);
    addB(building(24, 11, 16, TEX.gothic, winT, 3, 6, true), -38, -52);
    addB(building(26, 13, 16, TEX.gothic, winT, 3, 6, true), 46, -58);
    addB(building(20, 10, 14, TEX.brick, winT, 2, 5, true), -48, -10);
    addB(building(18, 14, 14, TEX.gothic, winT, 3, 4, true), 52, 28);

    { // chapel
      const ch = new THREE.Group();
      const nave = new THREE.Mesh(new THREE.BoxGeometry(10, 9, 18), mat(TEX.gothic));
      nave.position.y = 4.5; ch.add(nave);
      const roof = new THREE.Mesh(new THREE.ConeGeometry(7.4, 5, 4), flat(0x23252b));
      roof.rotation.y = Math.PI/4; roof.scale.set(0.75, 1, 1.3); roof.position.y = 11; ch.add(roof);
      const tower = new THREE.Mesh(new THREE.BoxGeometry(5, 16, 5), mat(TEX.gothic));
      tower.position.set(0, 8, 10); ch.add(tower);
      const spire = new THREE.Mesh(new THREE.ConeGeometry(3.6, 9, 4), flat(0x23252b));
      spire.rotation.y = Math.PI/4; spire.position.set(0, 20.5, 10); ch.add(spire);
      ch.position.set(-55, 0, 45); ch.rotation.y = 0.5; scene.add(ch);
      colliders.push({ x: -55, z: 45, hw: 7, hd: 12 });
    }
    { // clock tower
      const t = new THREE.Group();
      const shaft = new THREE.Mesh(new THREE.BoxGeometry(7, 30, 7), mat(TEX.gothic));
      shaft.position.y = 15; t.add(shaft);
      const cap = new THREE.Mesh(new THREE.ConeGeometry(5.4, 7, 4), flat(0x23252b));
      cap.rotation.y = Math.PI/4; cap.position.y = 33.5; t.add(cap);
      const cm = new THREE.MeshBasicMaterial({ map: TEX.clock });
      for (const [ry, dz] of [[0, 3.56], [Math.PI, -3.56]]) {
        const face = new THREE.Mesh(new THREE.CircleGeometry(2.2, 12), cm);
        face.position.set(0, 26, dz); face.rotation.y = ry; t.add(face);
      }
      if (night || isPat) {
        const gl = new THREE.PointLight(0xfff4d0, 0.5, 22, 1.8);
        gl.position.y = 26; t.add(gl);
      }
      t.position.set(-20, 0, 40); scene.add(t);
      colliders.push({ x: -20, z: 40, hw: 4, hd: 4 });
    }

    // iron fences + benches — with hitboxes
    for (const z of [44, 8, -26]) {
      for (const sx of [-4.4, 4.4]) {
        const f = ironFence(13); f.position.set(sx, 0, z); f.rotation.y = Math.PI/2; scene.add(f);
        colliders.push({ x: sx, z, hw: 0.15, hd: 6.6 });
      }
    }
    for (const [x, z, ry] of [[5.6, 30, -Math.PI/2], [-5.6, -6, Math.PI/2], [5.6, -40, -Math.PI/2]]) {
      const b = bench(); b.position.set(x, 0, z); b.rotation.y = ry; scene.add(b);
      colliders.push({ x, z, hw: 0.6, hd: 0.95 });
    }

    // ===== STONE GATE into Greek Row =====
    {
      const gate = new THREE.Group();
      for (const sx of [-4.4, 4.4]) {
        const p = new THREE.Mesh(new THREE.BoxGeometry(1.6, 5.2, 1.6), mat(TEX.gothic));
        p.position.set(sx, 2.6, 0); gate.add(p);
        const cap = new THREE.Mesh(new THREE.ConeGeometry(1.35, 1.2, 4), flat(0x3a3c42));
        cap.rotation.y = Math.PI/4; cap.position.set(sx, 5.8, 0); gate.add(cap);
        const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.2, 6, 5),
          new THREE.MeshBasicMaterial({ color: (night || isPat) ? 0xffe2a8 : 0x44464c }));
        lamp.position.set(sx, 6.6, 0); gate.add(lamp);
      }
      const signT = makeTex(256, 32, (g,w,h) => {
        g.fillStyle = '#2c2e34'; g.fillRect(0,0,w,h);
        g.strokeStyle = '#55585f'; g.strokeRect(2,2,w-4,h-4);
        g.fillStyle = '#c8b888'; g.font = '17px Georgia'; g.textAlign = 'center';
        g.fillText('GREEK ROW · EST. 1891', w/2, 22);
      });
      const beam = new THREE.Mesh(new THREE.BoxGeometry(10.4, 1.1, 0.4), flat(0x2c2e34));
      beam.position.y = 5.35; gate.add(beam);
      for (const dz of [0.21, -0.21]) {
        const sign = new THREE.Mesh(new THREE.PlaneGeometry(8.8, 1.1), new THREE.MeshBasicMaterial({ map: signT }));
        sign.position.set(0, 5.35, dz);
        if (dz < 0) sign.rotation.y = Math.PI;
        gate.add(sign);
      }
      if (isPat) {
        const pat = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 1.2), new THREE.MeshBasicMaterial({ map: TEX.patBanner, side: THREE.DoubleSide }));
        pat.position.set(0, 4.1, 0); gate.add(pat);
      }
      gate.position.set(0, 0, -85); scene.add(gate);
      colliders.push({ x: -4.4, z: -85, hw: 1.2, hd: 1.2 });
      colliders.push({ x: 4.4, z: -85, hw: 1.2, hd: 1.2 });
    }

    // ===== GREEK ROW =====
    const sae = saeHouse(isPat ? 'green' : (isStorm ? 'warm' : (night ? 'warm' : 'dark')));
    sae.position.set(0, 0, -132);
    scene.add(sae);
    colliders.push({ x: 0, z: -134, hw: 15, hd: 10 });

    const fratDefs = [
      [-24, -118, 0,   'ΦΔΘ'], [25, -112, 0,   'ΚΣ'],
      [-27, -142, 0.3, 'ΔΚΕ'], [28, -140, -0.2,'XΨ'], [-30, -96, 0.15, 'ΘΔX'],
    ];
    for (const [x, z, ry, letters] of fratDefs) {
      const b = addB(building(16, 10, 12, TEX.brick, (isPat && Math.random() < 0.6) ? TEX.windowGreen : winT, 2, 4, true), x, z, ry);
      const sign = greekSign(letters);
      sign.position.set(0, 7.2, 6.06);
      b.add(sign);
    }

    // distant silhouettes
    const silM = flat(night || isPat ? 0x14161c : 0x9aa0ac);
    for (const [x, z, w, h, d] of [
      [-90, 30, 24, 16, 16], [-95, -30, 20, 12, 14], [-88, -80, 26, 18, 18],
      [90, 60, 24, 14, 16], [95, 0, 20, 18, 14], [92, -60, 26, 13, 18],
      [-60, 90, 30, 14, 18], [40, 95, 26, 16, 16], [0, 110, 34, 18, 20],
      [-70, -130, 18, 11, 14], [75, -135, 20, 12, 14], [0, -190, 40, 20, 22],
    ]) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), silM);
      m.position.set(x, h/2, z); scene.add(m);
    }

    // lampposts — warm light always; hitboxes
    const lampOn = night || isPat;
    const lampPositions = [];
    for (let z = 50; z >= -140; z -= 17) {
      const side = (z / 17 % 2 === 0) ? 4 : -4;
      const lp = lamppost(lampOn, 0xffd9a0, z > -85 && !isPat);
      lp.position.set(side, 0, z); scene.add(lp);
      colliders.push({ x: side, z, hw: 0.18, hd: 0.18 });
      lampPositions.push([side, z]);
    }

    // ===== ST PAT'S — real decorations, no filter =====
    if (isPat) {
      // green string lights zig-zagging between lamps
      for (let i = 0; i < lampPositions.length - 1; i++) {
        const [x1, z1] = lampPositions[i], [x2, z2] = lampPositions[i+1];
        scene.add(stringLights({ x: x1, y: 4.4, z: z1 }, { x: x2, y: 4.4, z: z2 }, 12));
      }
      // banners on buildings
      for (const [x, z, ry] of [[18, 54.8, 0], [-34, 27.2, 0], [0, -84.9, 0]]) {
        const b = new THREE.Mesh(new THREE.PlaneGeometry(6, 1.6), new THREE.MeshBasicMaterial({ map: TEX.patBanner, side: THREE.DoubleSide }));
        b.position.set(x, 6.5, z); b.rotation.y = ry; scene.add(b);
      }
      // litter everywhere + kegs on lawns
      for (let i = 0; i < 60; i++) {
        const c = Math.random() < 0.5 ? cup(Math.random() < 0.5 ? 0x2a8a48 : 0xc03030) : can();
        c.position.x = (Math.random() - 0.5) * 60;
        c.position.z = 40 - Math.random() * 160;
        scene.add(c);
      }
      for (const [x, z] of [[-10, -100], [12, -108], [-8, 14], [9, 26]]) {
        const k = keg(); k.position.x = x; k.position.z = z; scene.add(k);
        colliders.push({ x, z, hw: 0.4, hd: 0.4 });
      }
    }

    // trees + drifts
    for (let i = 0; i < 30; i++) {
      const t = bareTree(0.8 + Math.random() * 0.7);
      let x = (Math.random() - 0.5) * 130;
      if (Math.abs(x) < 7) x += Math.sign(x || 1) * 9;
      t.position.set(x, 0, 55 - Math.random() * 190);
      scene.add(t);
      colliders.push({ x: t.position.x, z: t.position.z, hw: 0.3, hd: 0.3 });
    }
    for (let i = 0; i < 12; i++) {
      const pile = new THREE.Mesh(new THREE.SphereGeometry(1.6 + Math.random()*1.6, 7, 5), mat(TEX.snow));
      pile.scale.y = 0.32;
      pile.position.set((Math.random()-0.5)*90, 0, 50 - Math.random()*170);
      scene.add(pile);
    }

    const snow = snowSystem(isStorm ? 2600 : 1100, 55, isStorm);
    scene.add(snow);
    return { colliders, snow };
  }

  // ---- DORM ROOM (small + decorated) ----
  function buildDorm(scene, opts = {}) {
    const colliders = [];
    scene.background = new THREE.Color(0x0a0a0c);
    scene.fog = new THREE.FogExp2(0x0a0a0c, 0.055);
    const amb = new THREE.AmbientLight(0xfff0dc, opts.dark ? 0.22 : 0.75);
    scene.add(amb);
    const ceil = new THREE.PointLight(0xffe9c8, opts.dark ? 0.3 : 1.1, 11, 1.8);
    ceil.position.set(0, 2.5, 0); scene.add(ceil);

    const W = 5.4, D = 6.6, H = 2.7;
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, D), mat(TEX.carpet));
    floor.rotation.x = -Math.PI/2; scene.add(floor);
    const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(W, D), flat(0xcac4b8));
    ceiling.rotation.x = Math.PI/2; ceiling.position.y = H; scene.add(ceiling);
    const wallM = mat(TEX.wallpaper);
    const mkWall = (w, h, x, y, z, ry) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), wallM);
      m.position.set(x, y, z); m.rotation.y = ry; scene.add(m);
    };
    mkWall(W, H, 0, H/2, -D/2, 0);
    mkWall(W, H, 0, H/2, D/2, Math.PI);
    mkWall(D, H, -W/2, H/2, 0, Math.PI/2);
    mkWall(D, H, W/2, H/2, 0, -Math.PI/2);
    colliders.push({ wallBox: { minX: -W/2+0.4, maxX: W/2-0.4, minZ: -D/2+0.4, maxZ: D/2-0.4 } });

    const win = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.3),
      new THREE.MeshBasicMaterial({ color: opts.dark ? 0x131a2a : 0x37425e }));
    win.position.set(0.6, 1.7, -D/2 + 0.03); scene.add(win);

    const myBed = bed(0x4a5a7a); myBed.position.set(-1.55, 0, -1.9); myBed.rotation.y = Math.PI/2; scene.add(myBed);
    const jakeBed = bed(0x6a4a4a); jakeBed.position.set(1.55, 0, -1.9); jakeBed.rotation.y = -Math.PI/2; scene.add(jakeBed);
    colliders.push({ x: -1.55, z: -1.9, hw: 1.1, hd: 0.58 }, { x: 1.55, z: -1.9, hw: 1.1, hd: 0.58 });
    const d1 = desk(); d1.position.set(-1.95, 0, 1.5); d1.rotation.y = Math.PI/2; scene.add(d1);
    const d2 = desk(); d2.position.set(1.95, 0, 1.5); d2.rotation.y = -Math.PI/2; scene.add(d2);
    colliders.push({ x: -1.95, z: 1.5, hw: 0.4, hd: 0.75 }, { x: 1.95, z: 1.5, hw: 0.4, hd: 0.75 });
    const lp1 = laptop(); lp1.position.set(-1.95, 0.82, 1.5); lp1.rotation.y = Math.PI/2; scene.add(lp1);
    const fridge = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.85, 0.55), flat(0x9aa0a8));
    fridge.position.set(2.3, 0.42, 2.7); scene.add(fridge);
    colliders.push({ x: 2.3, z: 2.7, hw: 0.35, hd: 0.35 });

    // DECOR: big American flag over my bed
    const flag = new THREE.Mesh(new THREE.PlaneGeometry(2.1, 1.15), new THREE.MeshBasicMaterial({ map: TEX.flagUS }));
    flag.position.set(-W/2 + 0.03, 1.85, -1.5); flag.rotation.y = Math.PI/2; scene.add(flag);
    // beer poster + ski poster on Jake's side
    const beer = new THREE.Mesh(new THREE.PlaneGeometry(0.85, 1.15), new THREE.MeshBasicMaterial({ map: TEX.beerPoster }));
    beer.position.set(W/2 - 0.03, 1.75, -0.6); beer.rotation.y = -Math.PI/2; scene.add(beer);
    const ski = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 1.05), new THREE.MeshBasicMaterial({ map: TEX.skiPoster }));
    ski.position.set(W/2 - 0.03, 1.75, 0.9); ski.rotation.y = -Math.PI/2; scene.add(ski);
    // mini hoop on the door
    const board = new THREE.Mesh(new THREE.PlaneGeometry(0.45, 0.32), flat(0xd8d8d0));
    board.position.set(0.55, 2.05, D/2 - 0.04); board.rotation.y = Math.PI; scene.add(board);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.016, 5, 10), flat(0xc05028));
    rim.position.set(0.55, 1.92, D/2 - 0.16); rim.rotation.x = Math.PI/2; scene.add(rim);
    // string lights + rug + laundry + TV
    scene.add(stringLights({x:-2.5,y:2.45,z:-D/2+0.15},{x:2.5,y:2.45,z:-D/2+0.15},12, 0xffd9a0, 0xffeacc));
    const rug = new THREE.Mesh(new THREE.CircleGeometry(1, 10), flat(0x6a3a3a));
    rug.rotation.x = -Math.PI/2; rug.position.set(0, 0.012, 0.3); scene.add(rug);
    const clothes = new THREE.Mesh(new THREE.SphereGeometry(0.3, 6, 4), flat(0x44506a));
    clothes.scale.y = 0.4; clothes.position.set(1.2, 0.11, 0.3); scene.add(clothes);
    const tv = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.55, 0.07),
      new THREE.MeshBasicMaterial({ color: opts.dark ? 0x0c0e12 : 0x12161e }));
    tv.position.set(2.3, 1.45, 2.95); tv.rotation.y = Math.PI; scene.add(tv);

    const door = new THREE.Mesh(new THREE.PlaneGeometry(1.05, 2.1), flat(0x5e4a32));
    door.position.set(-0.6, 1.05, D/2 - 0.02); door.rotation.y = Math.PI; scene.add(door);

    return { colliders, interactables: { door, myBed } };
  }

  // ---- DORM HALLWAY ----
  function buildDormHall(scene, opts = {}) {
    const colliders = [];
    const dark = !!opts.dark;
    scene.background = new THREE.Color(0x0a0a0c);
    scene.fog = new THREE.FogExp2(0x0a0a0c, dark ? 0.09 : 0.05);
    scene.add(new THREE.AmbientLight(0xfff0dc, dark ? 0.16 : 0.5));

    const W = 4, D = 34, H = 2.7;
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(W + 8, D), mat(TEX.hallCarpet));
    floor.rotation.x = -Math.PI/2; scene.add(floor);
    const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(W + 8, D), flat(0xc2bcb0));
    ceiling.rotation.x = Math.PI/2; ceiling.position.y = H; scene.add(ceiling);
    const wallM = mat(TEX.wallpaper);
    const mkWall = (w,h,x,y,z,ry) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w,h), wallM); m.position.set(x,y,z); m.rotation.y = ry; scene.add(m); };
    mkWall(W+8, H, 0, H/2, -D/2, 0); mkWall(W+8, H, 0, H/2, D/2, Math.PI);
    mkWall(D, H, -W/2, H/2, 0, Math.PI/2); mkWall(D, H, W/2, H/2, 0, -Math.PI/2);
    colliders.push({ wallBox: { minX: -W/2+0.35, maxX: W/2-0.35, minZ: -D/2+0.5, maxZ: D/2-0.5 } });

    for (let z = -14; z <= 14; z += 6) {
      const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.06, 0.3),
        new THREE.MeshBasicMaterial({ color: dark ? 0x2a2c30 : 0xfff2cc }));
      lamp.position.set(0, H - 0.04, z); scene.add(lamp);
      if (!dark || z === -2) {
        const pl = new THREE.PointLight(0xffeecc, dark ? 0.35 : 0.6, 9, 1.8);
        pl.position.set(0, H - 0.3, z); scene.add(pl);
      }
    }
    // dorm doors
    for (let i = 0; i < 10; i++) {
      const z = -13 + i * 3;
      const side = i % 2 === 0 ? -1 : 1;
      if (side > 0 && z === -7 && !dark) continue; // this one is the OPEN room
      const door = new THREE.Mesh(new THREE.PlaneGeometry(1, 2.1), flat(0x5e4a32));
      door.position.set(side * (W/2 - 0.02), 1.05, z);
      door.rotation.y = side < 0 ? Math.PI/2 : -Math.PI/2;
      scene.add(door);
      const numT = makeTex(16, 16, (g,w,h)=>{ g.fillStyle='#d8d2c2'; g.fillRect(0,0,w,h); g.fillStyle='#333'; g.font='8px Arial'; g.fillText('3' + String(i).padStart(2,'1'), 1, 11); });
      const num = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.22), new THREE.MeshBasicMaterial({ map: numT }));
      num.position.set(side * (W/2 - 0.03), 1.95, z);
      num.rotation.y = side < 0 ? Math.PI/2 : -Math.PI/2;
      scene.add(num);
    }
    // the open room — door ajar, warm light spilling, someone in the doorway
    if (!dark) {
      const openDoor = new THREE.Mesh(new THREE.PlaneGeometry(1, 2.1), flat(0x5e4a32));
      openDoor.position.set(W/2 - 0.35, 1.05, -7.45);
      openDoor.rotation.y = -Math.PI/2 + 0.9;
      scene.add(openDoor);
      const glowPlane = new THREE.Mesh(new THREE.PlaneGeometry(0.95, 2.05), new THREE.MeshBasicMaterial({ color: 0xffd9a0 }));
      glowPlane.position.set(W/2 - 0.015, 1.05, -7);
      glowPlane.rotation.y = -Math.PI/2;
      scene.add(glowPlane);
      const spill = new THREE.PointLight(0xffd9a0, 0.8, 6, 1.8);
      spill.position.set(W/2 - 0.5, 1.4, -7);
      scene.add(spill);
    }
    // corkboard
    const corkT = makeTex(48, 32, (g,w,h)=>{ g.fillStyle='#9a7a4a'; g.fillRect(0,0,w,h); for(let i=0;i<8;i++){ g.fillStyle=['#e8e2d2','#d2e8e2','#e8d2d2'][i%3]; g.fillRect(3+Math.random()*36, 3+Math.random()*20, 8, 7);} dither(g,w,h,14); });
    const cork = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1), new THREE.MeshBasicMaterial({ map: corkT }));
    cork.position.set(-(W/2 - 0.03), 1.6, 8.5); cork.rotation.y = Math.PI/2; scene.add(cork);

    // lounge
    const couch = new THREE.Group();
    const seat = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.5, 1), flat(0x3a4a5c)); seat.position.y = 0.42; couch.add(seat);
    const back = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.7, 0.25), flat(0x32404e)); back.position.set(0, 0.95, -0.4); couch.add(back);
    couch.position.set(1.2, 0, 2); couch.rotation.y = -Math.PI/2; scene.add(couch);
    colliders.push({ x: 1.2, z: 2, hw: 0.7, hd: 1.3 });
    const loungeTv = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.7),
      new THREE.MeshBasicMaterial({ color: dark ? 0x707a8a : 0x8aa0c0 }));
    loungeTv.position.set(-(W/2 - 0.04), 1.5, 2); loungeTv.rotation.y = Math.PI/2; scene.add(loungeTv);
    scene.userData.loungeTv = loungeTv;
    const vend = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.7, 0.6), flat(0x24344a));
    vend.position.set(1.6, 0.85, 13); scene.add(vend);
    const vendGlow = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 1.2), new THREE.MeshBasicMaterial({ color: 0x6a90c8 }));
    vendGlow.position.set(1.6, 0.9, 12.68); vendGlow.rotation.y = Math.PI; scene.add(vendGlow);
    colliders.push({ x: 1.6, z: 13, hw: 0.5, hd: 0.4 });

    const myDoor = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 2.1), flat(0x5e4a32));
    myDoor.position.set(0, 1.05, D/2 - 0.04); myDoor.rotation.y = Math.PI; scene.add(myDoor);
    const stairDoor = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 2.1), flat(0x73624a));
    stairDoor.position.set(0, 1.05, -D/2 + 0.04); scene.add(stairDoor);
    const exitT = makeTex(24, 10, (g,w,h)=>{ g.fillStyle='#102818'; g.fillRect(0,0,w,h); g.fillStyle='#48e878'; g.font='7px Arial'; g.fillText('EXIT', 3, 8); });
    const exitSign = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.2), new THREE.MeshBasicMaterial({ map: exitT }));
    exitSign.position.set(0, 2.35, -D/2 + 0.05); scene.add(exitSign);

    return { colliders, interactables: { stairDoor, myDoor } };
  }

  // ---- DINING HALL ----
  function buildDining(scene) {
    const colliders = [];
    scene.background = new THREE.Color(0x0c0c0e);
    scene.fog = new THREE.FogExp2(0x0c0c0e, 0.04);
    scene.add(new THREE.AmbientLight(0xfff0dc, 0.6));
    const W = 18, D = 16, H = 4;
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, D), mat(TEX.tile));
    floor.rotation.x = -Math.PI/2; scene.add(floor);
    const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(W, D), flat(0x9a9486));
    ceiling.rotation.x = Math.PI/2; ceiling.position.y = H; scene.add(ceiling);
    const wallM = mat(TEX.wallpaper);
    const mkWall = (w,h,x,y,z,ry) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w,h), wallM); m.position.set(x,y,z); m.rotation.y = ry; scene.add(m); };
    mkWall(W,H, 0,H/2,-D/2, 0); mkWall(W,H, 0,H/2,D/2, Math.PI);
    mkWall(D,H, -W/2,H/2,0, Math.PI/2); mkWall(D,H, W/2,H/2,0, -Math.PI/2);
    colliders.push({ wallBox: { minX: -W/2+0.45, maxX: W/2-0.45, minZ: -D/2+0.45, maxZ: D/2-0.45 } });

    // tall windows with late-afternoon light
    for (let i = 0; i < 4; i++) {
      const win = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 2.6), new THREE.MeshBasicMaterial({ color: 0x8a92aa }));
      win.position.set(-6.5 + i * 4.4, 2, -D/2 + 0.03); scene.add(win);
    }
    for (const z of [-4, 2]) {
      const pl = new THREE.PointLight(0xffeecc, 0.7, 14, 1.8);
      pl.position.set(0, H - 0.5, z); scene.add(pl);
    }
    // long tables with benches
    for (const [x, z] of [[-4.5, -3], [-4.5, 2.5], [4.5, -3], [4.5, 2.5]]) {
      const table = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.75, 1), flat(0x8a6a44));
      table.position.set(x, 0.375, z); scene.add(table);
      colliders.push({ x, z, hw: 2.85, hd: 0.65 });
      for (const dz of [-0.85, 0.85]) {
        const b = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.45, 0.35), flat(0x6e5234));
        b.position.set(x, 0.225, z + dz); scene.add(b);
        colliders.push({ x, z: z + dz, hw: 2.7, hd: 0.3 });
      }
      // trays and cups
      for (let i = 0; i < 3; i++) {
        const tray = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.03, 0.32), flat(0x9a4030));
        tray.position.set(x - 2 + Math.random() * 4, 0.77, z + (Math.random()-0.5)*0.5);
        scene.add(tray);
      }
    }
    // serving counter along east wall
    const counter = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1, 10), flat(0x6a6e74));
    counter.position.set(W/2 - 1.2, 0.5, -1); scene.add(counter);
    colliders.push({ x: W/2 - 1.2, z: -1, hw: 0.75, hd: 5.2 });
    const heat = new THREE.Mesh(new THREE.PlaneGeometry(9.5, 0.5), new THREE.MeshBasicMaterial({ color: 0xff9a50 }));
    heat.position.set(W/2 - 0.55, 1.3, -1); heat.rotation.y = -Math.PI/2; scene.add(heat);

    const door = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 2.3), flat(0x4e4232));
    door.position.set(-2, 1.15, D/2 - 0.03); door.rotation.y = Math.PI; scene.add(door);

    return { colliders, interactables: { door } };
  }

  // ---- SAE HALL ----
  function buildSaeHall(scene, opts = {}) {
    const colliders = [];
    const party = !!opts.party;
    scene.background = new THREE.Color(0x080808);
    scene.fog = new THREE.FogExp2(0x080808, 0.045);
    scene.add(new THREE.AmbientLight(party ? 0x304028 : 0xffeedd, party ? 0.3 : (opts.dark ? 0.12 : 0.42)));
    const W = 16, D = 22, H = 4.4;
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, D), mat(TEX.woodFloor));
    floor.rotation.x = -Math.PI/2; scene.add(floor);
    const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(W, D), flat(0x3a342c));
    ceiling.rotation.x = Math.PI/2; ceiling.position.y = H; scene.add(ceiling);
    const wallM = flat(0x4f4639);
    const mkWall = (w,h,x,y,z,ry) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w,h), wallM); m.position.set(x,y,z); m.rotation.y = ry; scene.add(m); };
    mkWall(W,H, 0,H/2,-D/2, 0); mkWall(W,H, 0,H/2,D/2, Math.PI);
    mkWall(D,H, -W/2,H/2,0, Math.PI/2); mkWall(D,H, W/2,H/2,0, -Math.PI/2);
    colliders.push({ wallBox: { minX: -W/2+0.45, maxX: W/2-0.45, minZ: -D/2+0.45, maxZ: D/2-0.45 } });

    for (const z of [-6, 4]) {
      const pl = new THREE.PointLight(party ? 0x55ff77 : 0xffd9a0, party ? 0.9 : 0.7, 18, 1.7);
      pl.position.set(0, H - 0.5, z); scene.add(pl);
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.18, 6, 5),
        new THREE.MeshBasicMaterial({ color: party ? 0x66ff88 : 0xffe8b8 }));
      bulb.position.set(0, H - 0.5, z); scene.add(bulb);
    }
    if (party) {
      const strobe = new THREE.PointLight(0xffffff, 0, 26, 1.4);
      strobe.position.set(0, H - 0.4, -2); scene.add(strobe);
      scene.userData.strobe = strobe;
      scene.add(stringLights({x:-7.6,y:H-0.4,z:-10.6},{x:7.6,y:H-0.4,z:-10.6},14));
      scene.add(stringLights({x:-7.6,y:H-0.4,z:10.6},{x:7.6,y:H-0.4,z:10.6},14));
      for (const sx of [-6.6, 6.6]) {
        const spk = new THREE.Mesh(new THREE.BoxGeometry(1, 1.8, 0.8), flat(0x101114));
        spk.position.set(sx, 0.9, -9.8); scene.add(spk);
        const cone = new THREE.Mesh(new THREE.CircleGeometry(0.3, 8), flat(0x2c2e34));
        cone.position.set(sx, 1.2, -9.38); scene.add(cone);
        colliders.push({ x: sx, z: -9.8, hw: 0.7, hd: 0.6 });
      }
    }
    const lm = greekSign('ΣAE');
    lm.position.set(0, 3.2, -D/2 + 0.03); scene.add(lm);
    for (let i = 0; i < 4; i++) {
      const fr = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 0.9), flat(0x2c2418));
      fr.position.set(-W/2 + 0.03, 2.4, -7 + i * 4.6); fr.rotation.y = Math.PI/2; scene.add(fr);
      const ph = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.7), flat(0x6a6452));
      ph.position.set(-W/2 + 0.04, 2.4, -7 + i * 4.6); ph.rotation.y = Math.PI/2; scene.add(ph);
    }
    for (const [x, z, ry] of [[-5.4, -3, Math.PI/2], [5.4, -3, -Math.PI/2], [0, -8.5, 0]]) {
      const c = new THREE.Group();
      const seat = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.5, 1), flat(0x57321f)); seat.position.y = 0.42; c.add(seat);
      const back = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.7, 0.25), flat(0x4a2a1a)); back.position.set(0, 0.95, -0.4); c.add(back);
      c.position.set(x, 0, z); c.rotation.y = ry; scene.add(c);
      colliders.push({ x, z, hw: 1.4, hd: 0.7 });
    }
    const pong = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.78, 1.1), flat(0x2e4a32));
    pong.position.set(3.4, 0.39, 5); scene.add(pong);
    colliders.push({ x: 3.4, z: 5, hw: 1.4, hd: 0.7 });
    for (let i = 0; i < 6; i++) { const c = cup(); c.position.set(2.5 + Math.random()*1.8, 0.78 + 0.065, 4.6 + Math.random()*0.8); scene.add(c); }
    if (opts.trashed) {
      for (let i = 0; i < 26; i++) {
        const c = Math.random() < 0.5 ? cup(Math.random() < 0.3 ? 0x3060c0 : 0xc03030) : can();
        c.position.x = (Math.random()-0.5)*13; c.position.z = (Math.random()-0.5)*19;
        scene.add(c);
      }
    }
    const bDoor = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 2.1), flat(0x2a2118));
    bDoor.position.set(-5.5, 1.05, -D/2 + 0.03); scene.add(bDoor);
    const fDoor = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 2.3), flat(0x241c12));
    fDoor.position.set(0, 1.15, D/2 - 0.03); fDoor.rotation.y = Math.PI; scene.add(fDoor);
    const stair = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.4, 4), flat(0x3c332a));
    stair.position.set(6.4, 1.2, -7.5); scene.add(stair);
    colliders.push({ x: 6.4, z: -7.5, hw: 1.3, hd: 2.2 });

    return { colliders, interactables: { basementDoor: bDoor, frontDoor: fDoor, pong } };
  }

  // ---- BASEMENT (filthy, graffiti everywhere) ----
  function buildBasement(scene, opts = {}) {
    const colliders = [];
    scene.background = new THREE.Color(0x050505);
    scene.fog = new THREE.FogExp2(0x050505, 0.085);
    scene.add(new THREE.AmbientLight(0xb8c0c8, opts.lineup ? 0.10 : 0.14));
    const W = 11, D = 18, H = 2.5;
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, D), mat(TEX.concrete));
    floor.rotation.x = -Math.PI/2; scene.add(floor);
    const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(W, D), flat(0x26262a));
    ceiling.rotation.x = Math.PI/2; ceiling.position.y = H; scene.add(ceiling);
    const wallM = mat(TEX.cinder);
    const scribM = new THREE.MeshBasicMaterial({ map: TEX.scribble, transparent: true });
    const mkWall = (w,h,x,y,z,ry) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w,h), wallM);
      m.position.set(x,y,z); m.rotation.y = ry; scene.add(m);
      // graffiti coats every wall
      const s = new THREE.Mesh(new THREE.PlaneGeometry(w,h), scribM);
      s.position.set(x,y,z); s.rotation.y = ry;
      s.translateZ(0.012);
      scene.add(s);
    };
    mkWall(W,H, 0,H/2,-D/2, 0); mkWall(W,H, 0,H/2,D/2, Math.PI);
    mkWall(D,H, -W/2,H/2,0, Math.PI/2); mkWall(D,H, W/2,H/2,0, -Math.PI/2);
    colliders.push({ wallBox: { minX: -W/2+0.4, maxX: W/2-0.4, minZ: -D/2+0.4, maxZ: D/2-0.4 } });

    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.09, 6, 5), new THREE.MeshBasicMaterial({ color: 0xffe9c0 }));
    bulb.position.set(0, H - 0.25, -2); scene.add(bulb);
    const bl = new THREE.PointLight(0xffe2b0, 1.0, 12, 1.9);
    bl.position.set(0, H - 0.3, -2); scene.add(bl);
    scene.userData.bulb = bulb; scene.userData.bulbLight = bl;

    const furnace = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.9, 1.2), flat(0x3a3d42));
    furnace.position.set(-4.2, 0.95, -7.5); scene.add(furnace);
    colliders.push({ x: -4.2, z: -7.5, hw: 1, hd: 0.8 });
    for (const x of [-3, 0.5, 3.5]) {
      const p = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, D - 1, 5), flat(0x4d5056));
      p.rotation.x = Math.PI/2; p.position.set(x, H - 0.12, 0); scene.add(p);
    }
    for (const [x, z] of [[4.3, -6], [4.3, -4.6], [3.4, -5.4]]) {
      const k = keg(); k.position.set(x, 0.31, z); scene.add(k);
    }
    colliders.push({ x: 4, z: -5.3, hw: 1, hd: 1.2 });
    const table = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.74, 0.9), flat(0x6b6e74));
    table.position.set(-3.8, 0.37, 3.5); scene.add(table);
    colliders.push({ x: -3.8, z: 3.5, hw: 1.2, hd: 0.6 });
    for (let i = 0; i < 5; i++) { const c = cup(); c.position.set(-4.6 + i * 0.4, 0.74 + 0.065, 3.4); scene.add(c); }
    for (let i = 0; i < 3; i++) {
      const b = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.34, 6), flat(0x6a4a18));
      b.position.set(-3.2 + i * 0.3, 0.74 + 0.17, 3.7); scene.add(b);
    }

    for (const [x, z] of [[-4.6, -2], [-4.8, 6.5], [4.6, 2.5], [3.8, 7.6]]) {
      const t = trashBag(); t.position.x = x; t.position.z = z; scene.add(t);
    }
    for (let i = 0; i < 30; i++) {
      const c = Math.random() < 0.5 ? can() : cup(Math.random() < 0.4 ? 0x3060c0 : 0xc03030);
      c.position.x = (Math.random()-0.5)*9.5; c.position.z = (Math.random()-0.5)*16;
      scene.add(c);
    }
    for (let i = 0; i < 8; i++) {
      const stain = new THREE.Mesh(new THREE.CircleGeometry(0.3 + Math.random()*0.6, 8),
        flat(Math.random() < 0.5 ? 0x3a3026 : 0x44423a));
      stain.rotation.x = -Math.PI/2;
      stain.position.set((Math.random()-0.5)*9, 0.013 + i*0.0008, (Math.random()-0.5)*15);
      scene.add(stain);
    }
    const bucket = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.18, 0.4, 7), flat(0x707a30));
    bucket.position.set(4.5, 0.2, 6.8); scene.add(bucket);
    const mop = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.5, 4), flat(0x6a5a40));
    mop.position.set(4.7, 0.75, 6.6); mop.rotation.z = 0.3; scene.add(mop);
    const matt = new THREE.Mesh(new THREE.BoxGeometry(0.25, 1.9, 1), flat(0x8a8270));
    matt.position.set(-5, 0.95, -5.4); matt.rotation.z = -0.12; scene.add(matt);

    const line = new THREE.Mesh(new THREE.PlaneGeometry(7, 0.12), flat(0xb8b840));
    line.rotation.x = -Math.PI/2; line.position.set(0, 0.016, 1.5); scene.add(line);
    const stairs = new THREE.Group();
    for (let i = 0; i < 6; i++) {
      const st = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.18, 0.4), mat(TEX.concrete));
      st.position.set(0, 0.2 + i * 0.36, 7.4 + i * 0.36); stairs.add(st);
    }
    scene.add(stairs);
    const upDoor = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 2.1), flat(0x2a2118));
    upDoor.position.set(0, 2.4, D/2 - 0.05); upDoor.rotation.y = Math.PI; scene.add(upDoor);
    const drain = new THREE.Mesh(new THREE.CircleGeometry(0.22, 8), flat(0x1c1e22));
    drain.rotation.x = -Math.PI/2; drain.position.set(1.5, 0.015, -4); scene.add(drain);

    return { colliders, interactables: { upDoor, table, furnace } };
  }

  // ---- ANNEX ----
  function buildAnnex(scene) {
    const colliders = [];
    scene.background = new THREE.Color(0x050506);
    scene.fog = new THREE.FogExp2(0x050506, 0.1);
    scene.add(new THREE.AmbientLight(0xb0b8c8, 0.13));
    const W = 6, D = 16, H = 2.6;
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, D), mat(TEX.concrete));
    floor.rotation.x = -Math.PI/2; scene.add(floor);
    const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(W, D), flat(0x26262a));
    ceiling.rotation.x = Math.PI/2; ceiling.position.y = H; scene.add(ceiling);
    const wallM = mat(TEX.cinder);
    const mkWall = (w,h,x,y,z,ry) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w,h), wallM); m.position.set(x,y,z); m.rotation.y = ry; scene.add(m); };
    mkWall(W,H, 0,H/2,-D/2, 0); mkWall(W,H, 0,H/2,D/2, Math.PI);
    mkWall(D,H, -W/2,H/2,0, Math.PI/2); mkWall(D,H, W/2,H/2,0, -Math.PI/2);
    colliders.push({ wallBox: { minX: -W/2+0.4, maxX: W/2-0.4, minZ: -D/2+0.4, maxZ: D/2-0.4 } });

    const fridge = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.6, 0.7), flat(0x222830));
    fridge.position.set(-2.2, 0.8, -5); scene.add(fridge);
    const fGlow = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 1.1), new THREE.MeshBasicMaterial({ color: 0x9fc8e8 }));
    fGlow.position.set(-1.84, 0.85, -5); fGlow.rotation.y = Math.PI/2; scene.add(fGlow);
    const fLight = new THREE.PointLight(0x9fc8e8, 0.7, 7, 2);
    fLight.position.set(-1.4, 1, -5); scene.add(fLight);
    colliders.push({ x: -2.2, z: -5, hw: 0.6, hd: 0.5 });
    const farBulb = new THREE.PointLight(0xffe2b0, 0.4, 8, 2);
    farBulb.position.set(0, H - 0.3, -7); scene.add(farBulb);

    for (const sx of [-2.4, 2.4]) {
      for (let z = -1; z <= 6; z += 2.4) {
        const shelf = new THREE.Group();
        for (let lvl = 0; lvl < 3; lvl++) {
          const board = new THREE.Mesh(new THREE.BoxGeometry(1, 0.05, 2), flat(0x5a4a34));
          board.position.set(0, 0.4 + lvl * 0.7, 0); shelf.add(board);
          if (Math.random() < 0.8) {
            const box = new THREE.Mesh(new THREE.BoxGeometry(0.5 + Math.random()*0.3, 0.4, 0.6), flat(0x7a6648));
            box.position.set((Math.random()-0.5)*0.3, 0.62 + lvl * 0.7, (Math.random()-0.5)*1);
            shelf.add(box);
          }
        }
        shelf.position.set(sx, 0, z); scene.add(shelf);
        colliders.push({ x: sx, z, hw: 0.6, hd: 1.1 });
      }
    }
    for (const [x, z] of [[1.8, -6.4], [1.1, -6.8]]) {
      const k = keg(); k.position.set(x, 0.31, z); scene.add(k);
    }
    const crate = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.5, 0.7), flat(0x6a5638));
    crate.position.set(0.2, 0.25, -6.6); scene.add(crate);
    const kit = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.18, 0.3), flat(0xa83232));
    kit.position.set(0.2, 0.59, -6.6); scene.add(kit);
    const micro = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.35, 0.4), flat(0x2e3036));
    micro.position.set(2.5, 1.5, 4); scene.add(micro);
    const mGlow = new THREE.Mesh(new THREE.PlaneGeometry(0.18, 0.08), new THREE.MeshBasicMaterial({ color: 0x40d860 }));
    mGlow.position.set(2.22, 1.5, 4); mGlow.rotation.y = -Math.PI/2; scene.add(mGlow);

    const door = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 2.1), flat(0x2a2118));
    door.position.set(0, 1.05, D/2 - 0.04); door.rotation.y = Math.PI; scene.add(door);

    return { colliders, interactables: { kit, door } };
  }

  // ---- HOSPITAL CORRIDOR ----
  function buildHospital(scene) {
    scene.background = new THREE.Color(0x0c0d0f);
    scene.fog = new THREE.FogExp2(0x0c0d0f, 0.07);
    scene.add(new THREE.AmbientLight(0xdce4ec, 0.45));
    const W = 4.4, D = 26, H = 2.8;
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, D), flat(0xb8bcc2));
    floor.rotation.x = -Math.PI/2; scene.add(floor);
    const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(W, D), flat(0xd8dade));
    ceiling.rotation.x = Math.PI/2; ceiling.position.y = H; scene.add(ceiling);
    const wallM = flat(0xc8cdd2);
    const mkWall = (w,h,x,y,z,ry) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w,h), wallM); m.position.set(x,y,z); m.rotation.y = ry; scene.add(m); };
    mkWall(W,H, 0,H/2,-D/2, 0); mkWall(W,H, 0,H/2,D/2, Math.PI);
    mkWall(D,H, -W/2,H/2,0, Math.PI/2); mkWall(D,H, W/2,H/2,0, -Math.PI/2);
    for (let z = -10; z <= 10; z += 4) {
      const strip = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 2.2), new THREE.MeshBasicMaterial({ color: 0xeef2f6 }));
      strip.rotation.x = Math.PI/2; strip.rotation.z = Math.PI/2;
      strip.position.set(0, H - 0.02, z); scene.add(strip);
      const pl = new THREE.PointLight(0xe8f0f8, 0.5, 8, 1.8);
      pl.position.set(0, H - 0.4, z); scene.add(pl);
      if (z === -6) scene.userData.flicker = pl;
    }
    const gurney = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.18, 2), flat(0xd8dce2));
    gurney.position.set(-1.4, 0.75, -3); scene.add(gurney);
    for (const sz of [-0.7, 0.7]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.7, 0.06), flat(0x8a8e94));
      leg.position.set(-1.4, 0.35, -3 + sz); scene.add(leg);
    }
    for (let i = 0; i < 4; i++) {
      const chair = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.45, 0.5), flat(0x4a5e74));
      chair.position.set(1.7, 0.23, 2 + i * 0.8); scene.add(chair);
    }
    for (const sx of [-0.6, 0.6]) {
      const dd = new THREE.Mesh(new THREE.PlaneGeometry(1.15, 2.2), flat(0x9aa2ac));
      dd.position.set(sx, 1.1, -D/2 + 0.05); scene.add(dd);
      const pw = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.5), new THREE.MeshBasicMaterial({ color: 0x6a7686 }));
      pw.position.set(sx, 1.6, -D/2 + 0.06); scene.add(pw);
    }
    const signT = makeTex(64, 16, (g,w,h)=>{ g.fillStyle='#23456a'; g.fillRect(0,0,w,h); g.fillStyle='#e8eef6'; g.font='9px Arial'; g.textAlign='center'; g.fillText('EMERGENCY', w/2, 12); });
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.4), new THREE.MeshBasicMaterial({ map: signT }));
    sign.position.set(0, 2.4, -D/2 + 0.06); scene.add(sign);
    return { colliders: [] };
  }

  // ---- FUNERAL ----
  function buildFuneral(scene) {
    scene.background = new THREE.Color(0x33363c);
    scene.fog = new THREE.FogExp2(0x33363c, 0.03);
    scene.add(new THREE.HemisphereLight(0x9aa2ae, 0x3a3e44, 0.75));
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), mat(TEX.snow));
    ground.rotation.x = -Math.PI/2; scene.add(ground);
    const casket = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.6, 0.8), flat(0x3a2a1c));
    casket.position.set(0, 1, -6); scene.add(casket);
    const stand = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.7, 0.6), flat(0x2a2c30));
    stand.position.set(0, 0.35, -6); scene.add(stand);
    const wreath = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.1, 6, 10), flat(0x2e4a30));
    wreath.position.set(0, 1.3, -5.55); scene.add(wreath);
    for (let r = 0; r < 4; r++) {
      for (let i = 0; i < 7; i++) {
        const hs = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.8 + Math.random()*0.3, 0.14), mat(TEX.gothic));
        hs.position.set(-9 + i * 3 + (Math.random()-0.5), 0.4, -12 - r * 4 + (Math.random()-0.5));
        scene.add(hs);
      }
    }
    for (let i = 0; i < 8; i++) {
      const t = bareTree(0.9 + Math.random()*0.6);
      t.position.set(-20 + Math.random()*40, 0, -25 + Math.random()*14);
      scene.add(t);
    }
    const snow = snowSystem(700, 35, false);
    scene.add(snow);
    return { colliders: [], snow };
  }

  return { buildTextures, TEX, makeTex, mat, flat, greekSign,
           building, saeHouse, lamppost, ironFence, bench, bareTree, npc, stringLights,
           bed, desk, laptop, cup, can, trashBag, keg,
           snowSystem, updateSnow,
           buildCampus, buildDorm, buildDormHall, buildDining, buildSaeHall, buildBasement,
           buildAnnex, buildHospital, buildFuneral };
})();
