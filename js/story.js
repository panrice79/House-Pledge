// HOUSE PLEDGE — full narrative script
// Ethan Brooks, freshman, Waterford University, spring semester.
const Story = (() => {
  const P = G.Phone;
  const N = G.narrate, CONV = G.conv, CH = G.choice, OBJ = G.objective;

  async function run() {
    await intro();
    await ch1_rush();
    await ch2_bid_and_first_lineup();
    await ch3_summons();
    await ch4_deterioration();
    await ch4b_emma();
    await ch5_stpatricks_eve();
    await ch6_climax();
    await cutscene_aftermath();
    await epilogue();
  }

  // ---------------------------------------------------------------------
  async function intro() {
    G.stamp('11:52 PM', 'APR 02 2025');
    await G.sleep(1.5);
    await N([
      "I was nineteen when I rushed a fraternity at Waterford.",
      "Everyone knows a story like this one. Most people think it could never happen at their school.",
      "This is how I remember that spring."
    ], { black: true });
  }

  // ---------------------------------------------------------------------
  // CHAPTER 1 — RUSH NIGHT
  // ---------------------------------------------------------------------
  async function ch1_rush() {
    await G.chapterCard('FEBRUARY 21 — FRIDAY', 'RUSH NIGHT');
    G.stamp('8:14 PM', 'FEB 21 2025');

    // --- dorm room ---
    G.loadScene(s => World.buildDorm(s), { x: 0.4, z: 1.6, ry: -0.4 }, { snowSteps: false, noise: 0.015 });
    const jake = G.addNPC(World.npc({ color: 0x6a3a3a, beanie: false, voice: 2, backpack: false }), { x: 1.4, z: -0.8, ry: -2.6, name: 'Jake' });
    AudioSys.roomTone(0.08);
    await G.fadeIn(1.5);
    P.setEnabled(true);

    await N([
      "Spring semester, freshman year. My roommate Jake had been talking about SAE since October.",
      "Rush had been going for two weeks. Tonight was the last open event before bids went out."
    ]);
    G.freeze(false);

    await G.sleep(2);
    P.msg('Emma', 'are you actually rushing sae lol');
    await G.sleep(1.2);
    P.msg('Emma', 'heard their parties are insane');
    OBJ('Check your phone [TAB]');
    const r1 = await P.waitReply('Emma', [
      { text: 'yeah jake is dragging me to the thing tonight', value: 'a' },
      { text: 'idk maybe. you going out?', value: 'b' },
    ]);
    await G.sleep(1.4);
    if (r1 === 'a') P.msg('Emma', 'lmaoo ok frat star. text me after');
    else P.msg('Emma', 'pregame at kayla\'s maybe. text me after your frat thing');
    await G.sleep(1.2);
    P.msg('Emma', 'dont let them make you shotgun anything gross');
    OBJ('Talk to Jake');

    await G.addInteract({ mesh: jake, radius: 2.2, label: 'Talk to Jake' });
    G.freeze(true);
    await CONV([
      ['Jake', 'Yo. You\'re wearing that?'],
      ['Ethan', 'What\'s wrong with it?'],
      ['Jake', 'Nothing. It\'s fine. Tyler said come through around 8:30. They\'re doing a casino thing then it turns into a normal party.'],
      ['Ethan', 'You really think we get bids?'],
      ['Jake', 'Connor\'s been up there literally every night. He says Tyler likes us. Quote, "you guys are solid."'],
      ['Jake', 'Bro if we get in, our entire college experience is set. Like, set set.'],
      ['Ethan', 'Alright, alright. Let\'s go.'],
    ]);
    G.freeze(false);
    OBJ('Head out');
    G.marker(-0.6, 2.8, 2.4);
    await G.addInteract({ pos: { x: -0.6, z: 2.7 }, radius: 1.6, label: 'Into the hallway' });
    await G.fadeOut(0.6);
    AudioSys.stopAllLayers(0.6);

    // --- dorm hallway ---
    G.loadScene(s => World.buildDormHall(s), { x: 0, z: 15.5, ry: 0 }, { snowSteps: false, noise: 0.015 });
    AudioSys.roomTone(0.08);
    G.addNPC(World.npc({ voice: 4 }), { x: 0.4, z: 3.8, ry: 2.6, name: 'Floormate', label: false });
    G.addNPC(World.npc({ voice: 6 }), { x: 1.3, z: 4.5, ry: -0.6, name: 'Floormate2', label: false });
    await G.fadeIn(0.8);
    G.freeze(false);
    OBJ('Take the stairs at the end of the hall');
    G.marker(0, -15.4, 2.5);
    G.addZone(0.5, 5, 2.8).then(async () => {
      AudioSys.babble(4, 30); await G.sleep(0.8); AudioSys.babble(6, 24);
    });
    await G.addInteract({ pos: { x: 0, z: -16 }, radius: 2.2, label: 'Stairs down' });
    AudioSys.doorSlam();
    await G.fadeOut(0.7);
    AudioSys.stopAllLayers(0.6);
    await N(["Three flights down, past the RA's door, and out into the cold."], { black: true });

    // --- campus walk to SAE ---
    G.stamp('8:31 PM', 'FEB 21 2025');
    G.loadScene(s => World.buildCampus(s, 'night'), { x: 4, z: 58, ry: 0.2 });
    AudioSys.wind(0.16, 0.7);
    G.spawnCrowd(8, 0, 20, 26, false);
    G.spawnCrowd(6, -2, -60, 20, false);
    const jakeWalk = G.addNPC(World.npc({ color: 0x6a3a3a, voice: 2, beanie: true }), { x: 2, z: 52, ry: Math.PI, name: 'Jake' });
    await G.fadeIn(1.4);
    await N([
      "Campus that night felt like a brochure. Old stone, iron lamps, snow on the quad. Tuition money everywhere you looked.",
    ]);
    G.freeze(false);
    OBJ('Follow Jake — through the Greek Row gate at the end of the walk');
    G.marker(0, -85, 7);
    G.walkNPC(jakeWalk, 1, -40, 3).then(() => G.walkNPC(jakeWalk, -1, -100, 3));
    setTimeout(() => AudioSys.distantShout(), 5000);
    setTimeout(() => AudioSys.distantShout(), 14000);

    await G.addZone(0, -70, 8);
    AudioSys.partyMusic(0.22, true);
    await N(["You could hear the SAE house from two hundred yards away."]);
    await G.addZone(0, -110, 8);
    AudioSys.setLayerVol('party', 0.32, 2);

    OBJ('Enter the SAE house');
    G.marker(0, -120.5, 5);
    await G.addInteract({ pos: { x: 0, z: -121 }, radius: 3.2, label: 'Enter the house' });
    await G.fadeOut(0.8);
    AudioSys.stopLayer('wind', 0.8);

    // --- SAE hall, rush party — LOUD ---
    G.stamp('8:47 PM', 'FEB 21 2025');
    G.loadScene(s => World.buildSaeHall(s, { party: true }), { x: 0, z: 9, ry: 0 }, { snowSteps: false, noise: 0.018 });
    AudioSys.partyMusic(0.5, false);
    AudioSys.crowd(0.3);
    G.spawnCrowd(14, 0, -2, 11, true);
    const tyler = G.addNPC(World.npc({ color: 0x2d3a55, beanie: false, voice: 1, backpack: false, hair: 0x4a3520 }), { x: -2, z: -6, ry: 0.6, name: 'Tyler' });
    const connor = G.addNPC(World.npc({ color: 0x3a5a3a, voice: 5, backpack: false }), { x: 3.4, z: 3.6, ry: -2.6, name: 'Connor' });
    G.addNPC(World.npc({ color: 0x44444c, voice: 7, backpack: false }), { x: -5, z: 2, ry: 1.8, name: 'Noah' });
    await G.fadeIn(1);
    await N([
      "Inside, it was everything Jake promised. Strobes, speakers the size of fridges, brothers handing out drinks. Everyone knew your name somehow.",
      "Connor was already there. So was Noah, this quiet engineering kid from our floor who I was surprised even came."
    ]);
    G.freeze(false);
    OBJ('Find Connor — by the pong table');
    await G.addInteract({ mesh: connor, radius: 2.2, label: 'Talk to Connor' });
    G.freeze(true);
    await CONV([
      ['Connor', 'BROOKS. Dude they have a whole casino set up. I just won like forty bucks in dining dollars.'],
      ['Ethan', 'How long you been here?'],
      ['Connor', 'Since six. Bro I\'m telling you, this house is different. Tyler introduced me to alumni. ALUMNI. One guy works at Goldman.'],
      ['Noah', 'It\'s a pretty good party. Statistically better than the last three I\'ve been to.'],
      ['Connor', 'Noah\'s six beers deep, ignore him.'],
      ['Noah', 'Two. Two beers.'],
    ]);
    G.freeze(false);

    OBJ('Talk to Tyler before you leave — navy jacket, by the couches');
    await G.addInteract({ mesh: tyler, radius: 2.4, label: 'Talk to Tyler' });
    G.freeze(true);
    await CONV([
      ['Tyler', 'Ethan, right? Jake\'s roommate. Glad you came through, man.'],
      ['Ethan', 'Yeah, this is a great house.'],
      ['Tyler', 'Built in 1891. Oldest house on the row. Lot of history here.'],
      ['Tyler', 'Look — I\'m not supposed to say anything, but keep your phone on tomorrow. That\'s all I\'m saying.'],
    ]);
    const c1 = await CH([
      { text: '"Wait, are you serious?"', value: 'serious' },
      { text: 'Play it cool. "Sounds good man."', value: 'cool' },
    ]);
    if (c1 === 'serious') await CONV([['Tyler', 'Ha. Just keep it on. Go have fun, there\'s a whole table of pizza in the back.']]);
    else await CONV([['Tyler', 'That\'s what I like to hear. Go have fun.']]);
    G.freeze(false);
    OBJ(null);
    await G.fadeOut(1.4);
    AudioSys.stopAllLayers(1.2);
    await N(["I remember walking home that night thinking I'd never wanted anything so badly in my life."], { black: true });
  }

  // ---------------------------------------------------------------------
  // CHAPTER 2 — BID + FIRST LINEUP
  // ---------------------------------------------------------------------
  async function ch2_bid_and_first_lineup() {
    await G.chapterCard('FEBRUARY 22 — SATURDAY', 'BID DAY');
    G.stamp('11:05 AM', 'FEB 22 2025');

    G.loadScene(s => World.buildDorm(s), { x: -0.8, z: 0.8, ry: 1.1 }, { snowSteps: false, noise: 0.015 });
    AudioSys.roomTone(0.08);
    await G.fadeIn(1.2);
    await N(["The text came the next morning."]);
    await G.sleep(1);
    P.msg('Tyler SAE', 'Congrats. You got a bid. House at 9 tonight, dress nice. Don\'t post anything.');
    await G.sleep(2);
    P.msg('Jake', 'DUDE');
    await G.sleep(0.8);
    P.msg('Jake', 'TELL ME YOU GOT IT');
    OBJ('Reply to Jake [TAB]');
    await P.waitReply('Jake', [
      { text: 'LETS GOOOO', value: 'a' },
      { text: 'yeah I got it. you?', value: 'b' },
    ]);
    await G.sleep(1.2);
    P.msg('Jake', 'me connor and noah all got it. all four of us bro');
    await G.sleep(1.4);
    P.msg('Jake', 'this semester is gonna be legendary');
    await G.sleep(1.5);
    P.msg('Emma', 'jake says you\'re a frat guy now. RIP');
    await G.sleep(1.2);
    P.msg('Emma', 'congrats tho :) celebrate later?');
    await P.waitReply('Emma', [
      { text: 'haha definitely. pledge thing tonight first', value: 'a' },
      { text: 'RIP is right. yeah I\'ll text you', value: 'b' },
    ]);
    await G.sleep(1.3);
    P.msg('Emma', 'ok have fun with your weird rituals');
    await G.fadeOut(1);
    await N([
      "Pledging started that same night. Eleven of us got bids.",
      "The first few days were honestly fun. We learned the house history, did scavenger hunts, got matching shirts. Then they made a group chat."
    ], { black: true });
    P.sys('SAE Pledge GC', 'Mason added you and 10 others');
    P.msg('SAE Pledge GC', 'Mason: welcome to the best 8 weeks of your life gentlemen', true);
    P.msg('SAE Pledge GC', 'Mason: rule 1. when we text SAE 10, you have 10 minutes to be at the house. no exceptions', true);
    P.msg('SAE Pledge GC', 'Brett: rule 2. dont be late', true);
    AudioSys.stopAllLayers(1);

    // --- first lineup ---
    await G.chapterCard('MARCH 1 — ONE WEEK INTO PLEDGING', 'LINEUP');
    G.stamp('11:48 PM', 'MAR 01 2025');
    G.loadScene(s => World.buildBasement(s, { lineup: true }), { x: 0, z: 6, ry: 0 }, { snowSteps: false, noise: 0.018 });
    AudioSys.basementDrone(0.14);
    AudioSys.roomTone(0.05);
    const lineX = [-3, -2, -1, 1, 2, 3];
    const names = ['Jake', 'Connor', 'Noah', null, null, null];
    const pledges = lineX.map((x, i) =>
      G.addNPC(World.npc({ beanie: false, voice: 2 + i, backpack: false }), { x, z: 1.5, ry: Math.PI, name: names[i] || 'Pledge' }));
    G.addNPC(World.npc({ color: 0x5a2a2a, beanie: false, voice: 0, height: 1.1, backpack: false }), { x: -1.5, z: -3, ry: 0, name: 'Brett' });
    G.addNPC(World.npc({ color: 0x2a3a2a, beanie: false, voice: 3, backpack: false }), { x: 1.5, z: -3, ry: 0, name: 'Mason' });
    await G.fadeIn(1.4);
    await N([
      "A week in, the tone changed.",
      "They called it lineup. Every pledge, shoulder to shoulder on a strip of tape in a basement that smelled like beer that had died down there. Phones in a shoebox by the stairs."
    ]);
    OBJ('Take your place on the line');
    G.marker(0, 1.5, 2.2);
    G.freeze(false);
    await G.addZone(0, 1.5, 1.2);
    G.marker(null);
    G.freeze(true);
    G.lookAt(0, -3);
    P.confiscate(true);

    await CONV([
      ['Mason', 'Phones in the box. You\'ll get them back when we feel like it.'],
      ['Brett', 'Eyes forward. Did I say look at me? Eyes FORWARD.'],
      ['Mason', 'Alright. Founding fathers. In order. Brooks, go.'],
    ]);
    const a1 = await CH([
      { text: '"DeVotie, Rudulph, Cockrell..."', value: 'right' },
      { text: '"Uh... DeVotie... Kerr...?"', value: 'wrong' },
    ]);
    if (a1 === 'right') {
      await CONV([
        ['Mason', 'Huh. Okay. Somebody studied.'],
        ['Brett', 'Don\'t smile. Nobody told you to smile.'],
        ['Brett', 'Since Brooks is so comfortable — everybody on the wall. Let\'s see how long comfortable lasts.'],
      ]);
    } else {
      await CONV([
        ['Brett', 'Wrong. Everybody on the wall. Thank Brooks on your way over.'],
        ['Mason', 'You think we\'re kidding? Backs against the wall. Sit.'],
      ]);
    }

    // --- THE WALL SIT — against the actual wall ---
    G.closeDialogue();
    // everyone moves to the west wall
    pledges.forEach((p, i) => { p.position.set(-4.75, 0, -1.5 + i * 1.3); p.rotation.y = Math.PI/2; p.userData.baseRy = Math.PI/2; });
    G.player.pos.set(-4.55, 0, 1.2);
    G.lookAt(2, 1.2);
    await G.sleep(0.6);
    G.setEye(1.02);
    await G.sleep(2);
    G.setTremor(0.004);
    await N(["Ninety seconds in, it's uncomfortable."], { dim: false });
    await G.sleep(3);
    G.setTremor(0.012);
    await N(["Three minutes in, your thighs start to burn and you stop trusting the clock."], { dim: false });
    await G.sleep(3.5);
    G.setTremor(0.026);
    AudioSys.heartbeat(0.12, 1.0);
    await N(["My legs were shaking after four minutes. Nobody on the line looked at me. That was the point — you learn fast not to be the reason."], { dim: false });
    await G.sleep(2.5);
    await CONV([
      ['Brett', 'Up. That was a warm-up.'],
      ['Mason', 'Here\'s the thing nobody tells you, gentlemen. Every brother in this house sat on that exact wall. It means something.'],
      ['Brett', 'Or quit. Door\'s right there. Anybody?'],
      ['Mason', 'Nobody? Shocker. Connor, founding date.'],
      ['Connor', '1856! March 9th, 1856, University of Alabama!'],
      ['Mason', 'See, Connor gets it. Connor LOVES it here.'],
    ]);
    AudioSys.stopLayer('heart', 1);
    G.setTremor(0);
    G.setEye(1.74);
    P.confiscate(false);
    await G.fadeOut(1.2);
    AudioSys.stopAllLayers(1);
    await N(["It went on like that until two in the morning. Recite, mess up, hold a gallon jug at arm's length, recite again."], { black: true });

    // --- walking home: NOW you can talk ---
    G.stamp('2:09 AM', 'MAR 02 2025');
    G.loadScene(s => World.buildCampus(s, 'night'), { x: 0, z: -78, ry: Math.PI }, {});
    AudioSys.wind(0.2, 0.9);
    const jw = G.addNPC(World.npc({ color: 0x6a3a3a, voice: 2 }), { x: -1.2, z: -76, ry: Math.PI, name: 'Jake' });
    const cw = G.addNPC(World.npc({ color: 0x3a5a3a, voice: 5 }), { x: 1.2, z: -75, ry: Math.PI, name: 'Connor' });
    const nw = G.addNPC(World.npc({ color: 0x44444c, voice: 7 }), { x: 0.2, z: -73, ry: Math.PI, name: 'Noah' });
    await G.fadeIn(1.2);
    await N(["Nobody said a word until we were through the gate and out of earshot of the house."]);
    await CONV([
      ['Jake', 'Dude this is actually ridiculous.'],
      ['Connor', 'It\'s one semester. Every house does this.'],
      ['Noah', 'I have an 8 AM.'],
      ['Jake', 'We all have 8 AMs, bro.'],
    ]);
    G.walkNPC(jw, -2, -20, 2.8);
    G.walkNPC(cw, 0, -18, 2.8);
    G.walkNPC(nw, 2, -22, 2.8);
    G.freeze(false);
    OBJ('Walk home — back up the main walk');
    G.marker(2, 30, 4);
    await G.addZone(2, 30, 10);
    await G.fadeOut(1.2);
    AudioSys.stopAllLayers(1);
  }

  // ---------------------------------------------------------------------
  // CHAPTER 3 — 3 AM SUMMONS
  // ---------------------------------------------------------------------
  async function ch3_summons() {
    await G.chapterCard('MARCH 6 — THURSDAY', '2:58 AM');
    G.stamp('2:58 AM', 'MAR 06 2025');

    G.loadScene(s => World.buildDorm(s, { dark: true }), { x: -1.6, z: -1.4, ry: -2.3 }, { snowSteps: false, noise: 0.015 });
    AudioSys.roomTone(0.06);
    await G.fadeIn(1.8);
    await N(["By the second week the texts started coming at night."]);
    await G.sleep(2.2);
    AudioSys.buzz();
    await G.sleep(0.8);
    P.msg('SAE Pledge GC', 'Brett: SAE 10');
    await G.sleep(2);
    P.msg('SAE Pledge GC', 'Brett: clock started');
    await G.sleep(1.5);
    P.msg('Jake', 'are they serious. it\'s 3am');
    OBJ('Reply to Jake [TAB]');
    await P.waitReply('Jake', [
      { text: 'I\'m not getting cut over this. get up', value: 'a' },
      { text: 'we could just not go', value: 'b' },
    ]);
    await G.sleep(1.4);
    P.msg('Jake', 'connor\'s already there. of course he is');
    await G.sleep(1.2);
    P.msg('Jake', 'I\'m taking the early shuttle from the gym side. just go, dont wait for me');
    await N(["Jake had started finding ways to not walk with me. I didn't think anything of it at the time."]);
    G.freeze(false);
    OBJ('Get to the house. 9 minutes.');
    G.marker(-0.6, 2.8, 2.4);
    await G.addInteract({ pos: { x: -0.6, z: 2.7 }, radius: 1.6, label: 'Into the hallway' });
    await G.fadeOut(0.5);

    // dark hallway
    G.loadScene(s => World.buildDormHall(s, { dark: true }), { x: 0, z: 15.5, ry: 0 }, { snowSteps: false, noise: 0.02 });
    AudioSys.roomTone(0.05);
    await G.fadeIn(0.9);
    G.freeze(false);
    OBJ('Stairs. Quietly.');
    G.marker(0, -15.4, 2.5);
    await G.addInteract({ pos: { x: 0, z: -16 }, radius: 2.2, label: 'Stairs down' });
    AudioSys.doorSlam();
    await G.fadeOut(0.6);
    AudioSys.stopAllLayers(0.5);

    // --- THE WALK. Storm. ---
    G.stamp('3:04 AM', 'MAR 06 2025');
    G.loadScene(s => World.buildCampus(s, 'storm'), { x: 2, z: 58, ry: 0.1 }, { noise: 0.045 });
    AudioSys.wind(0.4, 1.6);
    await G.fadeIn(2.2);
    await N([
      "Campus at 3 AM in a snowstorm is a different planet.",
      "No music. No people. Just wind, and the sound of your own boots."
    ]);
    G.freeze(false);
    OBJ('SAE house — through the Greek Row gate, end of the walk');
    G.marker(0, -120.5, 5);

    G.addZone(0, 20, 9).then(async () => {
      AudioSys.distantShout();
      await N(["Somewhere behind the library, somebody yelled something. Or maybe it was just the wind. I walked faster."]);
    });
    G.addZone(0, -40, 9).then(async () => {
      AudioSys.stinger();
      P.msg('SAE Pledge GC', 'Brett: 4 minutes');
      await G.sleep(1.6);
      P.msg('SAE Pledge GC', 'Mason: jog, gentlemen');
    });
    G.addZone(0, -95, 9).then(async () => {
      await N(["The house lights were on. Every window. At three in the morning, that should have looked warm. It didn't."]);
    });

    await G.addZone(0, -114, 6);
    OBJ('Enter the house');
    await G.addInteract({ pos: { x: 0, z: -121 }, radius: 3.2, label: 'Enter the house' });
    AudioSys.doorSlam();
    await G.fadeOut(0.6);
    AudioSys.stopLayer('wind', 0.8);

    // --- backyard cold exposure ---
    G.stamp('3:21 AM', 'MAR 06 2025');
    G.loadScene(s => World.buildCampus(s, 'storm'), { x: 0, z: -150, ry: Math.PI }, { noise: 0.045 });
    AudioSys.wind(0.45, 1.7);
    const lineNames = ['Jake', 'Connor', 'Noah', 'Pledge', 'Pledge'];
    lineNames.forEach((nm, i) => G.addNPC(World.npc({ beanie: false, voice: 2 + i, backpack: false }), { x: -4 + i * 2, z: -152, ry: 0, name: nm }));
    G.addNPC(World.npc({ color: 0x5a2a2a, voice: 0, height: 1.1, backpack: false }), { x: 0, z: -147, ry: Math.PI, name: 'Brett' });
    G.addNPC(World.npc({ color: 0x2a3a2a, voice: 3, backpack: false }), { x: 2.5, z: -147, ry: Math.PI, name: 'Mason' });
    await G.fadeIn(1.2);
    await N([
      "They had us line up in the backyard. In the snow. Shirts only — jackets in a pile by the door.",
      "Brett walked the line with a beer in his hand, quizzing us. Every wrong answer added five minutes."
    ]);
    G.freeze(true);
    G.lookAt(0, -147);
    P.confiscate(true);
    await CONV([
      ['Brett', 'Chapter designation of this house. Anyone.'],
      ['Connor', 'New York Sigma Phi!'],
      ['Brett', 'Wasn\'t talking to you. Noah. Same question.'],
      ['Noah', '...New York. Sigma. Phi.'],
      ['Brett', 'Why\'d you say it like that? You good?'],
      ['Noah', 'Yes. Cold.'],
    ]);
    const stand = await CH([
      { text: 'Say it: "He\'s freezing, man. Look at him."', value: 'speak' },
      { text: 'Keep your eyes forward.', value: 'quiet' },
    ]);
    if (stand === 'speak') {
      await CONV([
        ['Brett', 'What did you say?'],
        ['Ethan', 'I just mean— it\'s been like half an hour—'],
      ]);
      G.shake(0.5, { hit: true });
      await G.sleep(0.8);
      await N(["He crossed the line in two steps and put both hands into my chest. The snow caught me. The cold went through everything at once."], { dim: false });
      await CONV([
        ['Brett', 'There\'s no clock out here. There\'s no clock ANYWHERE unless I say there\'s a clock. Get up.'],
        ['Mason', 'Easy. Easy! He\'s good. Brooks is good, right Brooks? He\'s smiling. We\'re all good out here.'],
      ]);
      await N(["That was Mason's job, I figured out later. Brett breaks the glass, Mason sweeps it up. You end up grateful to one of the two men freezing you in a yard."]);
    } else {
      await CONV([
        ['Brett', 'Cold. He\'s cold, guys. You know what builds brotherhood? Shared adversity. Look it up.'],
      ]);
      await N(["I kept my eyes forward. I've thought about that choice every day since."]);
    }
    await N([
      "We were out there forty minutes. I stopped feeling my ears at some point and started doing math instead — six more weeks, attendance points, whether any of this was worth it.",
      "The answer kept coming back yes. That's the part I still don't understand."
    ]);
    await CONV([
      ['Mason', 'Alright, get inside before somebody\'s mom calls the school. Phones are on the pong table.'],
      ['Mason', 'Good work tonight gentlemen. See? We\'re not monsters.'],
    ]);
    P.confiscate(false);
    await G.sleep(0.5);
    P.msg('Emma', 'you up? saw your light on from the quad lol');
    await G.sleep(1.5);
    OBJ('Reply to Emma [TAB]');
    const r3 = await P.waitReply('Emma', [
      { text: 'pledge stuff. just got back. I\'m fine', value: 'fine' },
      { text: 'honestly this is getting kind of bad', value: 'honest' },
    ]);
    await G.sleep(1.6);
    if (r3 === 'honest') {
      P.msg('Emma', 'bad how??');
      await G.sleep(1.4);
      P.msg('Emma', 'ethan. bad how');
      await G.sleep(1.6);
      P.msg('Emma', 'you know you can just leave right. it\'s a club. it\'s a CLUB');
    } else {
      P.msg('Emma', 'it\'s 4am and you\'re "fine" lol ok');
      await G.sleep(1.4);
      P.msg('Emma', 'get some sleep');
    }
    await G.fadeOut(1.4);
    AudioSys.stopAllLayers(1);
  }

  // ---------------------------------------------------------------------
  // CHAPTER 4 — ATTRITION (dining hall, daylight)
  // ---------------------------------------------------------------------
  async function ch4_deterioration() {
    await G.chapterCard('MARCH 12 — WEEK FOUR', 'ATTRITION');
    G.stamp('4:37 PM', 'MAR 12 2025');

    const dh = G.loadScene(s => World.buildDining(s), { x: -2, z: 6.5, ry: 0 }, { snowSteps: false, noise: 0.015 });
    AudioSys.roomTone(0.06);
    AudioSys.crowd(0.12);
    // seated diners
    for (const [x, z, ry] of [[-5.5, -3.85, 0], [-3.6, -2.15, Math.PI], [5.2, -3.85, 0], [3.8, -2.15, Math.PI], [5.8, 1.65, 0]]) {
      const d = G.addNPC(World.npc({ backpack: false }), { x, z, ry, name: 'Diner', label: false });
      d.userData.baseY = -0.42; d.userData.noCollide = true; d.position.y = -0.42;
    }
    const noah4 = G.addNPC(World.npc({ color: 0x44444c, beanie: false, voice: 7, backpack: true }), { x: -6, z: 2.2, ry: 0.9, name: 'Noah' });
    await G.fadeIn(1.4);
    await N([
      "Two pledges dropped that week. The group chat just got quieter and the texts got shorter.",
      "Noah stopped coming to dinner with us. When I finally caught him at the dining hall, tray still full, I almost didn't recognize him."
    ]);
    G.freeze(false);
    OBJ('Talk to Noah — far table by the windows');
    G.marker(-6, 2.2, 2.6);
    await G.addInteract({ mesh: noah4, radius: 2.4, label: 'Talk to Noah' });
    G.marker(null);
    G.freeze(true);
    await CONV([
      ['Ethan', 'Noah. Dude. You look rough.'],
      ['Noah', 'I\'m fine. I have a thermo midterm Friday and they took my laptop charger.'],
      ['Ethan', 'They took your charger?'],
      ['Noah', 'Pledge tax. Mason called it pledge tax. It\'s fine, I can use the library ones.'],
      ['Noah', 'Hey — did Brett say anything about me? After the yard thing?'],
      ['Ethan', 'What? No. Why would he?'],
      ['Noah', 'I keep getting singled out. You\'ve seen it. Tell me you\'ve seen it.'],
    ]);
    const c4 = await CH([
      { text: '"Yeah... they\'re on you more than the rest of us."', value: 'validate' },
      { text: '"They do it to everyone, man. Don\'t spiral."', value: 'deflect' },
    ]);
    if (c4 === 'validate') {
      await CONV([
        ['Noah', 'I knew it. I KNEW it. Okay. I just have to be perfect. If I\'m perfect there\'s nothing to single out.'],
        ['Ethan', 'That\'s not— Noah, that\'s not what I meant.'],
        ['Noah', 'I have to go. Library closes the charging lockers at five.'],
      ]);
    } else {
      await CONV([
        ['Noah', 'Right. Everyone. Sure.'],
        ['Noah', 'I literally haven\'t slept more than three hours since Sunday, so. Maybe I\'m just tired.'],
        ['Noah', 'Don\'t tell Jake I said anything. Or Connor. ESPECIALLY Connor, he repeats everything to Mason now.'],
      ]);
    }
    await G.walkNPC(noah4, -2.2, 7, 3); // he hugs his backpack and goes
    G.removeNPC(noah4);
    G.freeze(false);

    OBJ('Head back to your dorm');
    G.marker(-2, 7.3, 2.6);
    await G.addInteract({ pos: { x: -2, z: 7.2 }, radius: 2, label: 'Leave the dining hall' });
    await G.fadeOut(1);
    AudioSys.stopAllLayers(0.8);

    G.stamp('9:12 PM', 'MAR 12 2025');
    G.loadScene(s => World.buildDorm(s), { x: 0.4, z: 1.6, ry: -0.4 }, { snowSteps: false, noise: 0.015 });
    AudioSys.roomTone(0.08);
    const jake4 = G.addNPC(World.npc({ color: 0x6a3a3a, beanie: false, voice: 2, backpack: false }), { x: 1.4, z: -0.9, ry: -2.6, name: 'Jake' });
    await G.fadeIn(1);
    G.freeze(false);
    OBJ('Talk to Jake');
    await G.addInteract({ mesh: jake4, radius: 2.4, label: 'Talk to Jake' });
    G.freeze(true);
    await CONV([
      ['Jake', 'I\'m gonna say something and you can\'t repeat it.'],
      ['Ethan', 'Okay...'],
      ['Jake', 'I think I\'m done. Like actually done. I added it up — I\'ve slept maybe 30 hours this week, I bombed my econ quiz, and for what? So Brett can scream at me about founding fathers?'],
      ['Ethan', 'There\'s only three weeks left.'],
      ['Jake', 'That\'s what Connor says. "Only got 3 weeks left." Bro, Connor would walk into traffic if Tyler asked.'],
      ['Jake', 'And Noah— have you SEEN Noah? Lowkey think Noah is losing it. Like actually.'],
    ]);
    const c5 = await CH([
      { text: '"If you drop, I might too, honestly."', value: 'support' },
      { text: '"We\'ve already eaten the worst of it. Don\'t waste that."', value: 'sunk' },
    ]);
    if (c5 === 'support') {
      await CONV([
        ['Jake', 'Don\'t say that unless you mean it, because I will actually do it.'],
        ['Jake', '...Let\'s just get through St. Patrick\'s. Everyone says pledging basically pauses for it. Then we decide.'],
      ]);
    } else {
      await CONV([
        ['Jake', 'Sunk cost, bro. That\'s literally the sunk cost thing from econ. The class I\'m failing. Because of this.'],
        ['Jake', 'Whatever. St. Patrick\'s is this weekend. Let me at least have one good night, then I\'ll decide.'],
      ]);
    }
    G.freeze(false);
    await G.sleep(1);
    P.msg('Mom', 'Haven\'t heard from you in 2 weeks! Everything ok? Grandma asks about you');
    OBJ('Reply [TAB]');
    await P.waitReply('Mom', [
      { text: 'all good! just busy with classes. love you', value: 'a' },
      { text: 'yeah sorry, midterms. call you sunday', value: 'b' },
    ]);
    await G.sleep(1.5);
    P.msg('Mom', 'Ok honey. Don\'t party too hard this weekend, I know how that school gets in March 🍀');
    await N([
      "I typed \"all good\" to my mom with hands that still ached from holding a keg over my head two nights before.",
      "Don't tell your parents. Nobody ever said it as a rule. Nobody had to."
    ]);
    await G.fadeOut(1.4);
    AudioSys.stopAllLayers(1);
  }

  // ---------------------------------------------------------------------
  // CHAPTER 4B — EMMA
  // ---------------------------------------------------------------------
  async function ch4b_emma() {
    await G.chapterCard('MARCH 14 — FRIDAY', 'A NORMAL NIGHT');
    G.stamp('10:24 PM', 'MAR 14 2025');
    G.loadScene(s => World.buildDormHall(s), { x: 0, z: 12, ry: 0 }, { snowSteps: false, noise: 0.015 });
    AudioSys.roomTone(0.07);
    await G.fadeIn(1.2);
    await N(["Jake was at his girlfriend's. For one night there was no lineup, no group chat, nothing. Emma texted around ten."]);
    await G.sleep(1);
    P.msg('Emma', 'kayla bailed on the movie. tragic');
    await G.sleep(1.4);
    P.msg('Emma', 'you have a tv right');
    OBJ('Reply [TAB]');
    await P.waitReply('Emma', [
      { text: 'I have a laptop and exactly one working lamp', value: 'a' },
      { text: 'come over. bring snacks tho', value: 'b' },
    ]);
    await G.sleep(1.6);
    P.msg('Emma', 'omw. you better not live like a raccoon');
    await G.sleep(1.4);
    P.msg('Emma', 'ok I\'m on your floor. by the sad little lounge');
    const emma = G.addNPC(World.npc({ female: true, color: 0x4a6a4a, hair: 0x5a4028, voice: 6, backpack: false }), { x: 0.6, z: 2.8, ry: Math.PI, name: 'Emma' });
    G.freeze(false);
    OBJ('Meet Emma — by the lounge');
    G.marker(0.6, 2.8, 2.5);
    await G.addInteract({ mesh: emma, radius: 2.2, label: 'Talk to Emma' });
    G.marker(null);
    G.freeze(true);
    await CONV([
      ['Emma', 'Your hallway smells like a laundromat had a fight with a microwave.'],
      ['Ethan', 'That\'s mostly room 304.'],
      ['Emma', 'Charming. Okay, show me this so-called room. I brought the good popcorn, not the dining hall one.'],
    ]);
    G.closeDialogue();
    G.walkNPC(emma, -0.4, 14.8, 2.8);
    G.freeze(false);
    OBJ('Head to your room');
    G.marker(0, 16.2, 2.4);
    await G.addInteract({ pos: { x: 0, z: 16 }, radius: 2, label: 'Your room' });
    await G.fadeOut(0.6);
    AudioSys.stopAllLayers(0.5);

    // --- the room ---
    G.loadScene(s => World.buildDorm(s, { dark: true }), { x: 0.6, z: 1.6, ry: 0.6 }, { snowSteps: false, noise: 0.015 });
    AudioSys.roomTone(0.07);
    const emma2 = G.addNPC(World.npc({ female: true, color: 0x4a6a4a, hair: 0x5a4028, voice: 6, backpack: false }), { x: -0.8, z: 0.2, ry: 2.6, name: 'Emma' });
    await G.fadeIn(0.8);
    G.freeze(true);
    G.lookAt(-0.8, 0.2);
    await CONV([
      ['Emma', 'Okay. It\'s less raccoon than expected.'],
      ['Ethan', 'I cleaned for literally ten minutes.'],
      ['Emma', 'I can tell. There\'s a sock on the flag.'],
      ['Emma', 'So what are we watching? And don\'t say a movie about finance bros, I will leave.'],
    ]);
    const movie = await CH([
      { text: '"Horror movie. The dumb fun kind."', value: 'horror' },
      { text: '"Whatever you want. I\'ll fall asleep anyway, I\'m wrecked."', value: 'tired' },
    ]);
    if (movie === 'horror') {
      await CONV([
        ['Emma', 'Acceptable. But if I scream your RA is gonna think someone\'s being murdered in here.'],
        ['Ethan', 'My RA sleeps through fire alarms. We\'re good.'],
      ]);
    } else {
      await CONV([
        ['Emma', 'Wow. Thrilling company. Why are you so tired, anyway? You\'re a freshman, you have like two classes.'],
        ['Ethan', '...Pledge stuff.'],
        ['Emma', 'Right. "Pledge stuff."'],
      ]);
    }
    await G.fadeOut(0.8);

    // --- lying on the bed, laptop between you ---
    G.player.pos.set(-2.0, 0, -1.9);
    G.player.eyeY = 0.95; G.setEye(0.95);
    emma2.userData.noCollide = true;
    emma2.userData.baseY = 0.52;
    emma2.rotation.z = -Math.PI / 2;
    emma2.rotation.y = 0;
    emma2.position.set(-1.15, 0.52, -1.8);
    const lap = World.laptop(true, 0x8aa6cc);
    lap.position.set(-1.5, 0.68, -0.95);
    lap.rotation.y = Math.PI;
    G.scene().add(lap);
    G.scene().userData.loungeTv = lap.userData.screen; // engine flickers it like a movie
    const movieGlow = new THREE.PointLight(0x8aa6cc, 0.7, 5, 1.8);
    movieGlow.position.set(-1.5, 1, -1.2);
    G.scene().add(movieGlow);
    G.lookAt(-1.5, -0.95);
    G.player.pitch = -0.15;
    await G.fadeIn(1);
    await N(["We watched the movie on my laptop, both of us on a bed built for one person, the string lights doing most of the work. For two hours, college was exactly what the brochure promised."], { dim: false });
    await G.sleep(1.5);
    await CONV([
      ['Emma', 'Hey. Can I say something without you getting weird?'],
      ['Ethan', 'That\'s a trap, but go ahead.'],
      ['Emma', 'You winced. When you laid down. Like an old man. And you\'ve got a bruise coming through right here.'],
      ['Ethan', '...'],
      ['Emma', 'You don\'t have to tell me. But you also don\'t have to do whatever it is you\'re doing. You know that, right?'],
    ]);
    const honest = await CH([
      { text: '"It\'s three more weeks. Then it\'s over and it\'s worth it."', value: 'deflect' },
      { text: 'Tell her about the basement. All of it.', value: 'truth' },
    ]);
    if (honest === 'truth') {
      await N(["So I told her. The lineups, the wall sits, the yard, the box of phones. Out loud, in order, it sounded insane. She didn't interrupt once."], { dim: false });
      await CONV([
        ['Emma', 'Ethan, that\'s not a club, that\'s a hostage situation with a composite photo.'],
        ['Ethan', 'It\'s almost over.'],
        ['Emma', 'That\'s what the hostages say.'],
        ['Emma', '...Promise me something. St. Patrick\'s. One actual normal night, with me, no frat. You owe yourself one.'],
        ['Ethan', 'Deal.'],
      ]);
    } else {
      await CONV([
        ['Emma', '"Worth it." Okay.'],
        ['Emma', 'St. Patrick\'s, then. You\'re spending it with me and not those guys, and that\'s the toll for the popcorn. Deal?'],
        ['Ethan', 'Deal.'],
      ]);
    }
    // she gets up and heads out — stays in-scene
    await G.fadeOut(0.6);
    emma2.rotation.z = 0;
    emma2.userData.baseY = 0;
    emma2.position.set(-0.4, 0, 0.8);
    emma2.rotation.y = Math.PI * 0.9;
    G.player.pos.set(-1.6, 0, -0.4);
    G.setEye(1.74); G.player.eyeY = 1.74;
    G.scene().remove(lap); G.scene().remove(movieGlow);
    G.lookAt(-0.4, 0.8);
    await G.fadeIn(0.6);
    await CONV([
      ['Emma', 'It\'s one. I have a 9 AM I\'m definitely attending.'],
      ['Ethan', 'Sure you are.'],
      ['Emma', 'Saturday. You promised. Don\'t make me come get you out of that creepy mansion.'],
    ]);
    await G.walkNPC(emma2, -0.6, 2.9, 2.4);
    G.removeNPC(emma2);
    AudioSys.doorSlam();
    await N([
      "She left around one. I lay there thinking that whatever the house was selling — brotherhood, status, the next four years —",
      "the best night I'd had all semester cost a bag of popcorn."
    ]);
    await G.fadeOut(1.4);
    AudioSys.stopAllLayers(1);
  }

  // ---------------------------------------------------------------------
  // CHAPTER 5 — ST. PATRICK'S EVE
  // ---------------------------------------------------------------------
  async function ch5_stpatricks_eve() {
    await G.chapterCard('MARCH 16 — ST. PATRICK\'S EVE', 'THE BIGGEST NIGHT OF THE YEAR');
    G.stamp('9:38 PM', 'MAR 16 2025');

    G.loadScene(s => World.buildCampus(s, 'stpat'), { x: 2, z: 54, ry: 0.1 });
    AudioSys.wind(0.1, 0.6);
    AudioSys.partyMusic(0.32, false);
    AudioSys.crowd(0.3);
    G.spawnCrowd(16, 0, 25, 30, true);
    G.spawnCrowd(14, -5, -30, 26, true);
    G.spawnCrowd(18, 0, -100, 34, true);
    const emma = G.addNPC(World.npc({ female: true, color: 0x4a6a4a, hair: 0x5a4028, hat: 0x2a8a3a, voice: 6, backpack: false }), { x: -3, z: 18, ry: 2.6, name: 'Emma' });
    const inter = setInterval(() => { if (Math.random() < 0.7) AudioSys.distantShout(); }, 3500);
    await G.fadeIn(1.6);
    await N([
      "St. Patrick's Eve at Waterford is famous. People drive in from other schools. The whole campus turns green — lights in the windows, banners on the gate, kegs just sitting on lawns.",
      "Pledging was supposed to pause for it. For a few hours, we were just college kids again."
    ]);
    G.freeze(false);
    OBJ('Find Emma — green beanie, middle of the quad');
    G.marker(-3, 18, 2.6);
    await G.addInteract({ mesh: emma, radius: 2.6, label: 'Talk to Emma' });
    G.marker(null);
    G.freeze(true);
    await CONV([
      ['Emma', 'HE LIVES. And he\'s on time. Character development.'],
      ['Ethan', 'I promised, didn\'t I?'],
      ['Emma', 'You did. Okay — Kayla\'s thing at eleven, quad concert at midnight, and you\'re not allowed to check your phone, those are the rules.'],
      ['Ethan', 'You\'re very bossy tonight.'],
      ['Emma', 'It\'s the hat. Green gives me power.'],
    ]);
    G.freeze(false);
    await N(["For about an hour, it was the best night of the whole semester. Then, at 10:54 PM, every pledge's phone went off at once."]);
    await G.sleep(1.2);
    AudioSys.buzz();
    P.msg('SAE Pledge GC', 'Tyler: House. Now.');
    await G.sleep(2.2);
    AudioSys.buzz();
    P.msg('SAE Pledge GC', 'Brett: where tf are you');
    await G.sleep(1.8);
    P.msg('Jake', 'are you kidding me. TONIGHT?');
    G.stamp('10:54 PM', 'MAR 16 2025');
    G.freeze(true);
    G.lookAt(-3, 18);
    await CONV([
      ['Emma', 'Don\'t. Ethan. Don\'t look at me like that.'],
      ['Ethan', 'Twenty minutes. I\'ll be back in twenty minutes.'],
      ['Emma', 'You won\'t. You know you won\'t.'],
    ]);
    G.walkNPC(emma, -16, 26, 2.4); // she walks off into the crowd
    G.freeze(false);
    OBJ('House. Now.');
    G.marker(0, -120.5, 5);
    await N(["I watched the green hat disappear into the crowd. That's the decision I'd undo, if I could undo one."]);

    G.addZone(0, -50, 12).then(async () => {
      await G.sleep(1);
      P.msg('Emma', 'concert\'s at 12. if you make it, you make it');
      await G.sleep(1.4);
      P.msg('Emma', 'no pressure. (pressure)');
    });

    await G.addZone(0, -114, 7);
    clearInterval(inter);
    OBJ('Enter the house');
    await G.addInteract({ pos: { x: 0, z: -121 }, radius: 3.2, label: 'Enter the house' });
    AudioSys.doorSlam();
    await G.fadeOut(0.7);
    AudioSys.stopAllLayers(0.8);

    // --- inside ---
    G.stamp('11:09 PM', 'MAR 16 2025');
    G.loadScene(s => World.buildSaeHall(s, { party: true, trashed: true }), { x: 0, z: 9, ry: 0 }, { snowSteps: false, noise: 0.018 });
    AudioSys.partyMusic(0.5, false);
    AudioSys.crowd(0.3);
    G.spawnCrowd(16, 0, -2, 11, true);
    const mason5 = G.addNPC(World.npc({ color: 0x2a3a2a, beanie: false, voice: 3, backpack: false }), { x: -4.5, z: -8.5, ry: 0.7, name: 'Mason' });
    await G.fadeIn(1);
    await N(["The house was packed. Hundreds of people. And the brothers were the drunkest I'd ever seen them."]);
    G.freeze(false);
    OBJ('Find Mason — back of the hall');
    G.marker(-4.5, -8.5, 2.6);
    await G.addInteract({ mesh: mason5, radius: 2.4, label: 'Talk to Mason' });
    G.marker(null);
    G.freeze(true);
    await CONV([
      ['Mason', 'There he is! Brooks! You having fun? Great party right?'],
      ['Ethan', 'Yeah— the text said—'],
      ['Mason', 'Relax. Tonight\'s easy. Pledges run the party. Bar\'s dry downstairs, door needs a guy, and SOMEBODY clogged the second floor toilet.'],
      ['Mason', 'Phones in the box first. Tyler\'s rule. Too many cameras out tonight, last thing we need is pledge stuff on somebody\'s story.'],
      ['Ethan', 'For the whole night?'],
      ['Mason', 'Is that a problem?'],
    ]);
    const c7 = await CH([
      { text: 'Hand over the phone.', value: 'comply' },
      { text: '"I\'m expecting a text, can I keep it?"', value: 'push' },
    ]);
    if (c7 === 'push') {
      await CONV([
        ['Mason', 'A text. He\'s expecting a text, everybody.'],
        ['Mason', 'Box. Now. Or walk home and don\'t come back. Your call, genius.'],
      ]);
      await N(["His tone flipped like a light switch. That was Mason — funniest guy in the house until the exact second he wasn't."]);
    }
    await CONV([
      ['Mason', 'Good man. Basement. Brett\'s running pledges tonight. Keep him happy and you\'re drinking with us by one.'],
    ]);
    P.confiscate(true);
    G.freeze(false);
    OBJ('Basement door — north wall, left of the letters');
    G.marker(-5.5, -10, 2.6);
    await G.addInteract({ pos: { x: -5.5, z: -10.2 }, radius: 2.2, label: 'Basement door' });
    AudioSys.doorSlam();
    await G.fadeOut(0.6);

    // --- basement: Brett, Noah, the shots ---
    G.stamp('11:31 PM', 'MAR 16 2025');
    G.loadScene(s => World.buildBasement(s), { x: 0, z: 7, ry: 0 }, { snowSteps: false, noise: 0.018 });
    AudioSys.basementDrone(0.14);
    AudioSys.partyMusic(0.14, true);
    const brett5 = G.addNPC(World.npc({ color: 0x5a2a2a, beanie: false, voice: 0, height: 1.1, backpack: false }), { x: 3, z: -4, ry: -2.6, name: 'Brett' });
    const noah5 = G.addNPC(World.npc({ color: 0x44444c, beanie: false, voice: 7, backpack: false }), { x: -3.5, z: 2.8, ry: 2.4, name: 'Noah' });
    await G.fadeIn(1);
    await N([
      "You could hear the whole party through the ceiling. A thousand people having the best night of the year, one floor up.",
      "Down here it was me, Brett, and Noah. Jake and Connor were working the door."
    ]);
    G.freeze(false);
    OBJ('Report to Brett — by the kegs');
    G.marker(3, -4, 2.6);
    await G.addInteract({ mesh: brett5, radius: 2.4, label: 'Talk to Brett' });
    G.marker(null);
    G.freeze(true);
    await CONV([
      ['Brett', 'Brooks! Perfect. House rule tonight: nobody works sober. Pledge tax.'],
      ['Ethan', 'I\'m good, I\'ll just—'],
      ['Brett', 'That wasn\'t a question. Two. They\'re on the table. One for the house, one for Noah here, because Noah\'s CRUSHING it tonight.'],
    ]);
    G.freeze(false);
    OBJ('The shots are on the table');
    G.marker(-3.8, 3.5, 1.8);
    await G.addInteract({ pos: { x: -3.8, z: 2.6 }, radius: 1.8, label: 'The shots' });
    G.marker(null);
    G.freeze(true);
    G.lookAt(-3.8, 3.5);
    const drink = await CH([
      { text: 'Take the shots.', value: 'take' },
      { text: '"I\'m not drinking tonight, Brett."', value: 'refuse' },
    ]);
    if (drink === 'refuse') {
      await CONV([
        ['Brett', 'Sorry — say that again?'],
        ['Brett', 'You know what, fine. Noah can do yours. Noah! Two more, big man, Brooks is too good for us.'],
        ['Ethan', 'Wait— no. Fine. Give it.'],
        ['Brett', 'See? Everybody figures it out eventually.'],
      ]);
      await N(["That's the trick of it. Refusing never landed on you. It landed on whoever was least able to take it."], { dim: false });
    }
    G.closeDialogue();
    await G.shotAnim();
    await G.sleep(0.4);
    await G.shotAnim();
    G.setDrunk(0.45);
    await N(["The handle was plastic and the shots were warm. The room got soft around the edges almost immediately — I hadn't eaten since lunch."], { dim: false });
    G.freeze(false);

    OBJ('Check on Noah — by the line');
    G.marker(-3.5, 2.8, 2.4);
    await G.addInteract({ mesh: noah5, radius: 2.2, label: 'Talk to Noah' });
    G.marker(null);
    G.freeze(true);
    await CONV([
      ['Noah', 'Hey. Hey Ethan. I figured it out.'],
      ['Ethan', 'Figured what out?'],
      ['Noah', 'If I just don\'t say no to anything, there\'s nothing to punish. It\'s a control problem. You remove the error signal.'],
      ['Ethan', 'Noah, how much have you had?'],
      ['Noah', 'Brett keeps count. Ask Brett. Brett\'s my friend.'],
      ['Brett', 'Noah\'s a machine tonight! Pledge of the week, this guy.'],
      ['Ethan', 'He needs water, man.'],
      ['Brett', 'He needs to finish what\'s in his hand, is what he needs. You want his reps, Brooks? Keep talking.'],
    ]);
    G.freeze(false);
    await N(["I told myself the thing everyone in that house told themselves: somebody else is watching him. Somebody more senior. Somebody whose problem this is."]);

    OBJ('Brett\'s task: get the spare tap kit from the annex');
    G.marker(3, -4, 2.6);
    await G.addInteract({ mesh: brett5, radius: 2.4, label: 'Talk to Brett' });
    G.marker(null);
    G.freeze(true);
    await CONV([
      ['Brett', 'Tap\'s blown. Spare kit\'s at the annex — brick house directly across the row, west side. Side door\'s open. Go.'],
      ['Ethan', 'By myself?'],
      ['Brett', 'No, take your security detail. YES by yourself. And jog, the line upstairs is twenty deep.'],
    ]);
    G.freeze(false);
    OBJ('Take the stairs up');
    G.marker(0, 8.4, 2.6);
    await G.addInteract({ pos: { x: 0, z: 8.4 }, radius: 2, label: 'Go upstairs' });
    await G.fadeOut(0.6);
    AudioSys.stopAllLayers(0.6);

    // --- annex run ---
    G.stamp('12:18 AM', 'MAR 17 2025');
    G.loadScene(s => World.buildCampus(s, 'stpat'), { x: 0, z: -118, ry: 1.6 }, { noise: 0.04 });
    AudioSys.wind(0.3, 1.2);
    AudioSys.partyMusic(0.12, true);
    AudioSys.crowd(0.08);
    await G.fadeIn(1.4);
    await N([
      "It's a strange kind of alone, being on an errand outside the biggest party of the year.",
      "Everyone on campus was inside somewhere. Just string lights over an empty walk, and bass you could feel in your teeth.",
      "No phone. If something happened to me out here, nobody would even know where to look."
    ]);
    G.freeze(false);
    OBJ('The annex — brick house across the row, west. Side door.');
    G.marker(-24, -111, 3.4);
    G.addZone(-14, -116, 7).then(() => AudioSys.distantShout());
    await G.addZone(-22, -112, 5);
    await G.addInteract({ pos: { x: -24, z: -111 }, radius: 3, label: 'Side door' });
    AudioSys.doorSlam();
    await G.fadeOut(0.6);

    // --- inside the annex ---
    G.stamp('12:34 AM', 'MAR 17 2025');
    const annex = G.loadScene(s => World.buildAnnex(s), { x: 0, z: 6.5, ry: 0 }, { snowSteps: false, noise: 0.02 });
    AudioSys.roomTone(0.06);
    AudioSys.basementDrone(0.06);
    await G.fadeIn(1);
    await N(["The annex was dark and freezing — storage for forty years of parties. The only light came from a beer fridge humming in the corner."]);
    G.freeze(false);
    OBJ('Find the tap kit — red box, far end by the kegs');
    G.marker(0.2, -6.6, 1.6);
    await G.addInteract({ mesh: annex.interactables.kit, radius: 2, label: 'Take the tap kit' });
    G.marker(null);
    G.scene().remove(annex.interactables.kit);
    G.setCarry(true);
    await N(["I checked the microwave clock on the way out. 12:40. Emma's concert had started. I wondered if she was still looking for me."], { dim: false });
    OBJ('Carry the kit back — you can\'t run with it');
    G.marker(0, 7.5, 2.4);
    await G.addInteract({ pos: { x: 0, z: 7.5 }, radius: 2.4, label: 'Back outside' });
    AudioSys.doorSlam();
    await G.fadeOut(0.6);
    AudioSys.stopAllLayers(0.6);

    // --- carry it back ---
    G.loadScene(s => World.buildCampus(s, 'stpat'), { x: -22, z: -111, ry: -1.6 }, { noise: 0.04 });
    G.setCarry(true);
    AudioSys.wind(0.3, 1.2);
    AudioSys.partyMusic(0.12, true);
    await G.fadeIn(0.9);
    G.freeze(false);
    AudioSys.stinger();
    OBJ('Back to the house — front door');
    G.marker(0, -120.5, 5);
    await G.addZone(0, -114, 6);
    await G.addInteract({ pos: { x: 0, z: -121 }, radius: 3.2, label: 'Enter the house' });
    G.setCarry(false);
    await G.fadeOut(0.7);
    AudioSys.stopAllLayers(0.7);
    await N(["I handed the kit to some sophomore at the door who didn't say thanks. It was 12:55. I'd been gone forty minutes."], { black: true });
  }

  // ---------------------------------------------------------------------
  // CHAPTER 6 — THE CLIMAX
  // ---------------------------------------------------------------------
  async function ch6_climax() {
    G.stamp('1:23 AM', 'MAR 17 2025');
    G.loadScene(s => World.buildSaeHall(s, { party: true, trashed: true }), { x: 0, z: 9, ry: 0 }, { snowSteps: false, noise: 0.018 });
    AudioSys.partyMusic(0.22, false);
    AudioSys.crowd(0.12);
    G.setDrunk(0.2);
    G.spawnCrowd(6, 2, -2, 9, true);
    const connor6 = G.addNPC(World.npc({ color: 0x3a5a3a, beanie: false, voice: 5, backpack: false }), { x: -4.6, z: -9.4, ry: 0.4, name: 'Connor' });
    await G.fadeIn(0.9);
    await N(["The music was still going, but something was off. Connor was standing in front of the basement door, not letting anyone past."]);
    G.freeze(false);
    OBJ('Talk to Connor — basement door');
    G.marker(-4.6, -9.4, 2.5);
    await G.addInteract({ mesh: connor6, radius: 2.4, label: 'Talk to Connor' });
    G.marker(null);
    G.freeze(true);
    await CONV([
      ['Connor', 'Don\'t freak out.'],
      ['Ethan', 'Why would I— what happened.'],
      ['Connor', 'Noah\'s not... they took him out back to wake him up and he\'s not waking up right. Brett says he\'s fine, he\'s done this before with other pledges, you just walk them around—'],
      ['Ethan', 'Out BACK? It\'s twenty degrees out, how long has he been—'],
      ['Connor', 'Just— Tyler\'s handling it. Don\'t make it a thing. Go around the side.'],
    ]);
    G.freeze(false);
    OBJ('Get to the backyard. NOW.');
    G.marker(0, 10.2, 2.6);
    await G.addInteract({ pos: { x: 0, z: 10.2 }, radius: 2.4, label: 'Out the front, around back' });
    AudioSys.doorSlam();
    await G.fadeOut(0.5);
    AudioSys.stopAllLayers(0.5);

    // --- backyard ---
    G.stamp('1:31 AM', 'MAR 17 2025');
    G.loadScene(s => World.buildCampus(s, 'storm'), { x: 6, z: -146, ry: 1.1 }, { noise: 0.045 });
    AudioSys.wind(0.4, 1.5);
    AudioSys.partyMusic(0.06, true);
    AudioSys.heartbeat(0.16, 1.3);
    G.setDrunk(0.12);
    const noahDown = World.npc({ color: 0x44444c, beanie: false });
    noahDown.rotation.z = Math.PI / 2;
    noahDown.position.set(-2, 0.3, -150);
    G.scene().add(noahDown);
    G.addNPC(World.npc({ color: 0x2d3a55, beanie: false, voice: 1, backpack: false }), { x: -3.4, z: -149, ry: 2.4, name: 'Tyler' });
    G.addNPC(World.npc({ color: 0x5a2a2a, beanie: false, voice: 0, height: 1.1, backpack: false }), { x: -1, z: -148, ry: 2.9, name: 'Brett' });
    G.addNPC(World.npc({ color: 0x6a3a3a, beanie: false, voice: 2, backpack: false }), { x: -2.5, z: -152, ry: 0.3, name: 'Jake' });
    G.addNPC(World.npc({ color: 0x3a5a3a, beanie: false, voice: 5, backpack: false }), { x: 0.5, z: -152.5, ry: 0.6, name: 'Connor' });
    await G.fadeIn(0.8);
    G.freeze(false);
    OBJ('Get to Noah');
    G.marker(-2, -150, 2.4);
    await G.addZone(-2, -150, 3.5);
    G.marker(null);
    G.freeze(true);
    G.lookAt(-2, -150);

    await N(["Noah was on his back in the snow. Someone had put a jacket over him. His lips were the wrong color."], { dim: false });
    await CONV([
      ['Jake', 'He was talking like ten minutes ago. He was TALKING.'],
      ['Brett', 'He\'s breathing. Look— he\'s breathing. He\'s just gotta sleep it off. We put them on their side, we watch them, it\'s fine. We\'ve literally done this before.'],
      ['Ethan', 'His lips are blue. That\'s not sleeping it off, that\'s—'],
      ['Brett', 'Don\'t. Don\'t say it.'],
      ['Tyler', 'Everyone shut up for one second. Let me think.'],
      ['Jake', 'Think about WHAT? Call 911!'],
      ['Tyler', 'And tell them what, Jake? There are four hundred people inside. Half of them are underage. If a truck rolls up, this house is done. Everyone in this yard is done.'],
      ['Brett', 'The school has the amnesty thing— the medical amnesty—'],
      ['Tyler', 'That covers HIM. It doesn\'t cover us, it doesn\'t cover hazing, it doesn\'t— okay. Okay. We drive him. Mercy is six minutes. We drive him ourselves, we say we found him at the quad—'],
      ['Jake', 'He needs an AMBULANCE, not your Jetta!'],
      ['Connor', 'Guys, he\'s really cold. Guys. He\'s really, really cold.'],
    ]);
    AudioSys.stinger();
    await N(["Everyone was waiting for someone else to decide. Four smart kids and two seniors standing in a circle, and the only thing anyone was sure of was that they didn't want to be the one."], { dim: false });
    const decision = await CH([
      { text: 'Call 911 from Tyler\'s phone. Now.', value: 'call' },
      { text: 'Run inside and pull the fire alarm — clear the house, force the call.', value: 'alarm' },
    ]);
    if (decision === 'call') {
      await CONV([
        ['Ethan', 'Give me your phone. Tyler. Phone.'],
        ['Tyler', 'Ethan—'],
        ['Ethan', 'I\'ll say it was me. I called. Nobody else has to be here. GIVE ME THE PHONE.'],
        ['Tyler', '...'],
        ['Jake', 'He\'s giving it to him. Okay. Okay okay okay.'],
      ]);
      await N([
        "Tyler handed me the phone. I want to be honest about that — he handed it to me, and then he walked inside and started telling people the party was over.",
        "The dispatcher asked me how long Noah had been outside. I realized I didn't know. Nobody knew."
      ], { dim: false });
    } else {
      await CONV([
        ['Ethan', 'I\'m pulling the fire alarm. House clears, trucks come, it\'s out of everyone\'s hands.'],
        ['Brett', 'Are you INSANE—'],
        ['Jake', 'No— no, he\'s right, GO—'],
      ]);
      await N([
        "I don't remember running through the house. I remember the little white handle, and how easy it was, after weeks of doing every single thing they said.",
        "The alarm did what alarms do. Four hundred people in the snow, and finally, finally, a dozen of them on their phones with 911."
      ], { dim: false });
    }
    AudioSys.stopLayer('heart', 1);
    G.setDrunk(0);
    AudioSys.siren(11, 0.07);
    await G.sleep(4);
    await N([
      "The EMTs were not gentle and not slow. One of them kept asking 'what did he take, what did he drink, how much' and Brett — Brett, of all people — was the one who finally answered honestly.",
    ], { dim: false });
    await G.fadeOut(2);
    AudioSys.stopAllLayers(1.5);
  }

  // ---------------------------------------------------------------------
  // CUTSCENE — HOSPITAL / FUNERAL
  // ---------------------------------------------------------------------
  async function cutscene_aftermath() {
    G.stamp('4:51 AM', 'MAR 17 2025');
    G.loadScene(s => World.buildHospital(s), { x: 0, z: 10, ry: 0 }, { snowSteps: false, noise: 0.012 });
    AudioSys.roomTone(0.1);
    G.objective(null);
    await G.fadeIn(2);
    AudioSys.ekg(6, true);
    const dolly = G.cinematic({ x: 0, z: 10 }, { x: 0, z: -6 }, { x: 0, z: -14 }, 14);
    await G.sleep(3);
    await N([
      "They let Jake and me sit in the hallway at Mercy General. Nobody asked us to leave. Nobody talked to us either.",
      "Severe hypothermia and acute alcohol poisoning. He'd been 'resting' outside for almost forty minutes before anyone got worried.",
    ], { dim: false });
    await dolly;
    await N(["Noah was twenty years old. He died at 5:14 that morning."], { dim: false });
    await G.fadeOut(2.5);
    AudioSys.stopAllLayers(1.5);
    await G.sleep(1);

    G.stamp('11:00 AM', 'MAR 22 2025');
    G.loadScene(s => World.buildFuneral(s), { x: 7, z: 3, ry: 1.9 }, { noise: 0.03 });
    AudioSys.wind(0.14, 0.5);
    for (let r = 0; r < 2; r++) {
      for (let i = 0; i < 7; i++) {
        G.addNPC(World.npc({ color: 0x16161a, pants: 0x111114, beanie: false, backpack: false }),
          { x: -4.5 + i * 1.5 + (Math.random()-0.5)*0.4, z: -1 + r * 1.6, ry: Math.PI, name: null, label: false });
      }
    }
    await G.fadeIn(2.5);
    AudioSys.bell();
    const pan = G.cinematic({ x: 7, z: 3 }, { x: -5, z: 2 }, { x: 0, z: -6 }, 16);
    await G.sleep(2);
    AudioSys.bell();
    await N([
      "The funeral was in his hometown, two hours north. The university sent a van so students could attend. It was full.",
      "His mom asked to meet his friends from school. We stood in a line and shook her hand. Connor cried harder than anyone.",
    ], { dim: false });
    AudioSys.bell();
    await N(["Tyler and Brett did not attend. Their lawyers had advised against it."], { dim: false });
    await pan;
    await G.fadeOut(3);
    AudioSys.stopAllLayers(2);
    await G.sleep(1);
  }

  // ---------------------------------------------------------------------
  // EPILOGUE
  // ---------------------------------------------------------------------
  async function epilogue() {
    await G.chapterCard('APRIL 2 — TWO WEEKS LATER', 'AFTER');
    G.stamp('11:52 PM', 'APR 02 2025');
    G.loadScene(s => World.buildDorm(s, { dark: true }), { x: -1.6, z: -1.3, ry: -2.3 }, { snowSteps: false, noise: 0.015 });
    AudioSys.roomTone(0.07);
    P.confiscate(false);
    await G.fadeIn(2);
    await N([
      "You probably read about it. It was national news for about four days.",
      "The university suspended SAE for five years. Tyler and Brett were charged — hazing, and furnishing alcohol to a minor. Both pled out. Neither saw the inside of a jail.",
      "There was a vigil. The same people who ran the parties held candles at it."
    ]);
    await G.sleep(1);
    P.msg('Jake', 'my parents are picking me up saturday. transferring for fall');
    await G.sleep(2);
    P.msg('Jake', 'you were the only one who did anything that night. I keep thinking about that');
    OBJ('Reply to Jake [TAB]');
    await P.waitReply('Jake', [
      { text: 'I was 40 minutes too late, man', value: 'a' },
      { text: 'take care of yourself jake', value: 'b' },
    ]);
    await G.sleep(2);
    P.msg('Jake', 'it wasn\'t your fault. it wasn\'t even brett\'s fault exactly. that\'s the part that messes me up');
    await G.sleep(2.5);
    P.msg('Emma', 'saw you at the vigil. you should\'ve come said hi');
    await G.sleep(1.6);
    P.msg('Emma', 'whenever you\'re ready to talk, i\'m around. no rush');
    OBJ('Reply [TAB]');
    await P.waitReply('Emma', [
      { text: 'movie night soon? I owe you popcorn', value: 'a' },
      { text: 'thanks. not yet. but soon', value: 'b' },
    ]);
    await G.sleep(2);
    P.msg('Emma', 'whenever you want. I\'m not going anywhere');
    await G.sleep(2.5);
    P.msg('Connor', 'hey. so a few of the juniors are talking about recolonizing under a new name in like 2 years');
    await G.sleep(2);
    P.msg('Connor', 'they\'re keeping a list of guys who\'d be interested. obviously no pressure');
    await G.sleep(1.5);
    P.msg('Connor', 'it\'d be different this time. new culture and everything');
    await G.sleep(2.5);
    await N([
      "That's the text I think about the most. Not the 'House. Now.' Not even the ones from that night.",
      "\"It'd be different this time.\"",
      "Rush starts again in September."
    ]);
    await G.fadeOut(3);
    AudioSys.stopAllLayers(2);
    await G.sleep(1);
    G.endScreen(
      "Noah's parents settled with the university for an undisclosed amount.<br>" +
      "The basement was renovated into a study lounge.<br>" +
      "Nationally, at least one college student has died in a hazing-related incident<br>almost every year since 1959.",
      "Based on the kinds of stories survivors actually tell.<br>If you or someone you know is being hazed: 1-888-NOT-HAZE (anonymous).<br><br>THANK YOU FOR PLAYING"
    );
  }

  return { run };
})();
