/* Root Cause: Body City. A Gamified Edu physiotherapy game.
   Loop per case: investigate (tests, red flag, root cause) -> arena (clear symptoms with the right tool) -> defeat the root cause -> debrief. */
'use strict';
(function(){
if(window.top !== window.self){ document.body.textContent = 'Open Root Cause in its own tab.'; throw new Error('framed'); }
const $ = s => document.querySelector(s), app = $('#rc');
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const shuffle = a => { a = a.slice(); for(let i = a.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const CASES = window.RC_CASES, TOOLS = window.RC_TOOLS, KEY = 'root-cause';

/* ---------- save (this game's own key; Gamified Edu reads it, never writes it) ---------- */
let SAVE = {v:1, done:{}, look:0};
try{ const s = JSON.parse(localStorage.getItem(KEY)); if(s && typeof s === 'object' && s.done && typeof s.done === 'object') SAVE = {v:1, done:{}, look: s.look === 1 ? 1 : 0, ...{done: Object.fromEntries(Object.entries(s.done).filter(([k, v]) => CASES.some(c => c.id === k)).map(([k, v]) => [k, Math.max(1, Math.min(3, Math.floor(+v) || 1))]))}}; }catch(e){}
try{ const ge = JSON.parse(localStorage.getItem('gamified-edu-demo')); if(ge && ge.look === 1) SAVE.look = 1; }catch(e){}
const persist = () => { try{ localStorage.setItem(KEY, JSON.stringify(SAVE)); }catch(e){} };
const unlockedCount = () => Math.min(CASES.length, 3 + Object.keys(SAVE.done).length);

/* ---------- sound ---------- */
let AC = null;
function sfx(kind){ try{ AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if(AC.state === 'suspended') AC.resume();
  const N = {hit:[520], kill:[660, 880], miss:[180], hurt:[220, 150], shield:[392, 523, 784], boss:[110, 82], win:[523, 659, 784, 1046], ok:[660, 880], no:[260, 200], tap:[700]}[kind] || [500];
  N.forEach((f, i) => { const o = AC.createOscillator(), g = AC.createGain(), t = AC.currentTime + i * .07; o.type = kind === 'miss' || kind === 'hurt' || kind === 'boss' ? 'sawtooth' : 'triangle'; o.frequency.value = f;
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(kind === 'hit' ? .05 : .1, t + .012); g.gain.exponentialRampToValueAtTime(.0001, t + (kind === 'boss' ? .5 : .18)); o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t + .55); });
}catch(e){} }
let toastT = 0;
function toast(m){ const t = $('#toast'); t.textContent = m; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => t.hidden = true, 2600); }

/* ---------- Jo sprite (same character as Anatomy Run) ---------- */
const SPR = {};
function jo(look, frame){
  const k = look + frame; if(SPR[k]) return SPR[k];
  const c = document.createElement('canvas'); c.width = 20; c.height = 24; const g = c.getContext('2d');
  const fem = look === 1, skin = fem ? '#f0bd95' : '#d2936a', skin2 = fem ? '#d09a72' : '#ad7148', hair = fem ? '#4a2416' : '#221528', hair2 = fem ? '#7a3f24' : '#4b3460',
    shirt = fem ? '#ef8f7b' : '#7fc3db', shirt2 = fem ? '#c25e49' : '#3f8fae', pant = fem ? '#4a5266' : '#3d4c6b', shoe = fem ? '#77B85A' : '#DF755F', WH = '#fff', INK = '#1b1220';
  const F = {a:{fl:[0,0],bl:[0,0]}, b:{fl:[2,0],bl:[-2,-1]}, c:{fl:[-2,-1],bl:[2,0]}}[frame];
  const R = (x, y, w, h, col) => { g.fillStyle = col; g.fillRect(x + 1, y + 1, w, h); };
  const leg = (x, o, back) => { R(x + o[0], 17, 3, 3 + o[1], back ? '#2b3550' : pant); R(x + o[0], 20 + o[1], 4, 2, shoe); };
  leg(6, F.bl, true); leg(10, F.fl, false);
  R(4, 12, 2, 2, shirt2); R(4, 14, 2, 3, skin2); R(5, 12, 9, 5, shirt); R(5, 16, 9, 1, shirt2);
  R(8, 13, 3, 3, WH); R(9, 13, 1, 3, '#e3342f'); R(8, 14, 3, 1, '#e3342f');
  R(4, 4, 11, 7, skin); R(5, 11, 9, 1, skin2); R(4, 8, 1, 2, skin2);
  R(3, 1, 11, 3, hair); R(2, 2, 13, 3, hair); R(4, 0, 2, 1, hair); R(7, 0, 3, 1, hair); R(11, 0, 2, 1, hair); R(1, 3, 1, 4, hair); R(2, 5, 2, 4, hair); R(15, 3, 1, 2, hair);
  R(4, 5, 2, 1, hair); R(7, 5, 2, 1, hair); R(11, 5, 1, 1, hair); R(13, 5, 2, 1, hair); R(5, 1, 2, 1, hair2); R(9, 2, 2, 1, hair2);
  if(fem){ R(1, 6, 3, 8, hair); }
  R(7, 6, 2, 3, INK); R(7, 6, 1, 1, WH); R(11, 6, 2, 3, INK); R(11, 6, 1, 1, WH); R(5, 9, 2, 1, '#f29a8a');
  if(fem) R(10, 10, 2, 1, '#c2553f'); else R(9, 10, 5, 1, hair);
  R(12, 12, 2, 2, shirt2); R(12, 14, 2, 3, skin);
  const d = g.getImageData(0, 0, 20, 24).data, op = (x, y) => x >= 0 && y >= 0 && x < 20 && y < 24 && d[(y * 20 + x) * 4 + 3] > 0, add = [];
  for(let y = 0; y < 24; y++) for(let x = 0; x < 20; x++) if(!op(x, y) && (op(x - 1, y) || op(x + 1, y) || op(x, y - 1) || op(x, y + 1))) add.push([x, y]);
  g.fillStyle = INK; add.forEach(([x, y]) => g.fillRect(x, y, 1, 1));
  return SPR[k] = c;
}

/* ================= SCREENS ================= */
function title(){
  stopArena();
  app.innerHTML = `<section class="title"><div class="stars"></div><div class="tcard">
    <span class="kick">GAMIFIED EDU · PHYSIOTHERAPY</span><h1><span>ROOT</span><span>CAUSE</span></h1><p class="sub">Body City</p>
    <p class="pitch">Every symptom is a clue. Investigate the case, clear the symptoms with the right treatment, then take down the root cause, because symptoms keep coming back until you do.</p>
    <div class="row"><button class="btn gold big" id="play">Enter Body City</button><a class="btn ghost" href="../#cat-physio">Back to Gamified Edu</a></div>
    <p class="draft">Draft clinical content, pending review by the clinical panel. Adapted from the Learn Anywhere library (CC BY-NC-SA 4.0).</p></div></section>`;
  $('#play').onclick = () => { sfx('tap'); map(); };
}

function bodySVG(){
  // the body as a city: a silhouette masked over streets, blocks, nerve highways and vessel rivers
  let blocks = '';
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for(let y = 0; y < 800; y += 22) for(let x = 40; x < 360; x += 22){ const h = 8 + rnd() * 10, col = ['#3b2f6b', '#4a3a86', '#2f5d7c', '#5a3d7a', '#355e6f'][Math.floor(rnd() * 5)];
    blocks += `<rect x="${x + 3}" y="${y + 3}" width="16" height="16" rx="2" fill="${col}"/>`; if(rnd() > .55) blocks += `<rect x="${x + 6}" y="${y + 6}" width="4" height="4" fill="#ffd36e" opacity=".8"/>`; }
  const limbs = (w, col, extra = '') => `<g stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" fill="none" ${extra}>
    <path d="M118 175 L92 320 L82 452"/><path d="M282 175 L308 320 L322 452"/><path d="M168 430 L160 600 L158 760"/><path d="M232 430 L240 600 L246 760"/></g>
    <circle cx="200" cy="66" r="${44 + (w - 44) / 2}" fill="${col}"/><rect x="${183 - (w - 44) / 4}" y="100" width="${34 + (w - 44) / 2}" height="50" fill="${col}"/>
    <path d="M112 160 Q200 128 288 160 L268 440 Q200 462 132 440 Z" fill="${col}" stroke="${col}" stroke-width="${w - 44 + 2}" stroke-linejoin="round"/>
    <ellipse cx="150" cy="770" rx="${26 + (w - 44) / 2}" ry="${12 + (w - 44) / 2}" fill="${col}"/><ellipse cx="254" cy="770" rx="${26 + (w - 44) / 2}" ry="${12 + (w - 44) / 2}" fill="${col}"/>`;
  const nodes = CASES.map((c, i) => { const open = i < unlockedCount(), st = SAVE.done[c.id] || 0, X = c.x * 400, Y = c.y * 800, left = X < 200;
    return `<g class="node ${open ? 'open' : 'locked'} ${st ? 'done' : ''}" data-i="${i}" tabindex="${open ? 0 : -1}" role="button" aria-label="${esc(c.district)}: ${esc(c.title)}${open ? '' : ' (locked)'}">
      <circle class="ring" cx="${X}" cy="${Y}" r="17"/><circle cx="${X}" cy="${Y}" r="11" class="core"/><text x="${X}" y="${Y + 4}" class="num">${open ? i + 1 : '🔒'}</text>
      <g transform="translate(${left ? X - 24 : X + 24},${Y - 4})"><text class="dlbl" text-anchor="${left ? 'end' : 'start'}">${esc(c.district)}</text><text class="slbl" y="15" text-anchor="${left ? 'end' : 'start'}">${st ? '★'.repeat(st) + '☆'.repeat(3 - st) : open ? 'Open case' : 'Locked'}</text></g></g>`; }).join('');
  return `<svg class="bodymap" viewBox="-60 0 520 810" role="group" aria-label="Body City map">
    <defs><mask id="bm">${limbs(44, '#fff')}</mask><radialGradient id="glow"><stop offset="0" stop-color="#ff5d8f" stop-opacity=".55"/><stop offset="1" stop-color="#ff5d8f" stop-opacity="0"/></radialGradient></defs>
    ${limbs(54, '#0b0820')}
    <g mask="url(#bm)"><rect x="0" y="0" width="400" height="810" fill="#22183f"/>${blocks}
      <path d="M200 20 V430 M200 430 L160 760 M200 430 L246 760 M200 170 L92 320 L82 452 M200 170 L308 320 L322 452" stroke="#ffe066" stroke-width="3" fill="none" opacity=".75" class="nerve"/>
      <path d="M190 30 V440 M190 440 L150 760 M210 440 L236 760" stroke="#ff5d6c" stroke-width="2.4" fill="none" opacity=".6" stroke-dasharray="6 5" class="vessel"/></g>
    ${nodes}</svg>`;
}
function map(){
  stopArena();
  const done = Object.keys(SAVE.done).length;
  app.innerHTML = `<section class="map"><header class="bar"><button class="ib" id="back" aria-label="Title">←</button><div><b>Body City</b><small>${done} of 10 cases solved</small></div><a class="ib" href="../#cat-physio" aria-label="Gamified Edu">GE</a></header>
    <div class="mapgrid"><div class="mapwrap">${bodySVG()}</div><aside class="side"><h2>Pick a district</h2><p>Each district hides a condition. Its symptoms are attacking the city. Find what is driving them.</p>
    <ul class="legend"><li><i class="lg open"></i>Open case</li><li><i class="lg done"></i>Solved</li><li><i class="lg locked"></i>Locked: solve another case</li></ul>
    <p class="muted">Yellow roads are the nerves; red rivers are the blood vessels.</p></aside></div></section>`;
  $('#back').onclick = title;
  app.querySelectorAll('.node.open').forEach(n => { const go = () => { sfx('tap'); investigate(+n.dataset.i); }; n.addEventListener('click', go); n.addEventListener('keydown', e => { if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); go(); } }); });
}

/* ---------- investigation ---------- */
let INV = null;
function investigate(i){
  const c = CASES[i];
  INV = {i, step:0, firstTry:true};
  const steps = [
    {q:`Which <b>two</b> tests would confirm what is going on?`, multi:2, opts:shuffle([...c.tests.right.map(t => [t, true]), ...c.tests.wrong.map(t => [t, false])]),
     why:`${c.tests.right.join(' and ')} are the tests for this condition.`},
    {q:`Before treating: which finding would make you <b>stop and refer</b> (or rethink)?`, opts:shuffle([[c.flag.right, true], ...c.flag.others.map(o => [o, false])]),
     why:`Red flag: ${c.flag.right}. The other findings fit the condition and are safe to treat.`},
    {q:`What is the <b>root cause</b> driving these symptoms?`, opts:shuffle([[c.root.name, true], ...c.root.mimics.map(m => [m, false])]),
     why:`${c.simple}`}
  ];
  INV.steps = steps;
  const render = () => {
    const s = steps[INV.step];
    app.innerHTML = `<section class="case"><header class="bar"><button class="ib" id="back" aria-label="Map">←</button><div><b>${esc(c.district)}</b><small>Case ${i + 1} · Investigation ${INV.step + 1} of 3</small></div><span class="ib dots">${steps.map((_, k) => `<i class="${k < INV.step ? 'on' : k === INV.step ? 'now' : ''}"></i>`).join('')}</span></header>
      <div class="cgrid"><article class="patient"><span class="kick">INCOMING PATIENT</span><h2>${esc(c.patient.name)}, ${c.patient.age}</h2><p class="job">${esc(c.patient.job)}</p><blockquote>“${esc(c.patient.says)}”</blockquote>
        <div class="cityalert"><b>City alert:</b> ${c.enemies.map(e => esc(e.name)).join(', ')} spreading through ${esc(c.district)}.</div></article>
      <div class="qcard"><h3>${s.q}</h3><div class="opts">${s.opts.map(([t], k) => `<button class="opt" data-k="${k}" type="button">${esc(t)}</button>`).join('')}</div>
        ${s.multi ? '<button class="btn gold" id="confirm" type="button" disabled>Confirm 2 tests</button>' : ''}<div class="fb" id="fb" hidden></div></div></div></section>`;
    $('#back').onclick = map;
    const picks = new Set();
    const finish = ok => {
      app.querySelectorAll('.opt').forEach((b, k) => { b.disabled = true; if(s.opts[k][1]) b.classList.add('right'); else if(b.classList.contains('sel')) b.classList.add('wrong'); });
      if(!ok) INV.firstTry = false;
      const fb = $('#fb'); fb.hidden = false; fb.className = 'fb ' + (ok ? 'ok' : 'no');
      fb.innerHTML = `<b>${ok ? 'Good call.' : 'Not quite.'}</b> ${esc(s.why)}<button class="btn gold" id="next" type="button">${INV.step < 2 ? 'Next' : 'Enter the arena'}</button>`;
      sfx(ok ? 'ok' : 'no'); const cf = $('#confirm'); if(cf) cf.remove();
      $('#next').onclick = () => { if(INV.step < 2){ INV.step++; render(); } else briefing(i); };
      $('#next').focus({preventScroll:true});
    };
    app.querySelectorAll('.opt').forEach(b => b.onclick = () => {
      const k = +b.dataset.k;
      if(s.multi){ b.classList.toggle('sel'); b.classList.contains('sel') ? picks.add(k) : picks.delete(k); $('#confirm').disabled = picks.size !== 2; sfx('tap'); }
      else { b.classList.add('sel'); finish(s.opts[k][1]); }
    });
    const cf = $('#confirm'); if(cf) cf.onclick = () => finish([...picks].every(k => s.opts[k][1]));
  };
  render();
}
function briefing(i){
  const c = CASES[i], tools = arenaTools(c);
  app.innerHTML = `<section class="case"><header class="bar"><button class="ib" id="back" aria-label="Map">←</button><div><b>Treatment plan</b><small>${esc(c.title)}</small></div><span class="ib blank" aria-hidden="true"></span></header>
    <div class="brief"><div class="boss-card"><span class="kick">ROOT CAUSE IDENTIFIED</span><h2>${esc(c.root.name)}</h2><p>It keeps sending out symptoms. Clear <b>10 symptoms</b> to break its shield. Then select the treatment that targets the root cause: Jo aims at the root cause while that tool is selected. Its pulses only reach nearby, so keep your distance.</p></div>
    <h3>Your treatment tools</h3><ul class="toollist">${tools.map(t => `<li><i style="background:${t.col}"></i><b>${esc(t.name)}</b></li>`).join('')}</ul>
    <p class="muted">Match each symptom to the right tool. One tool on this belt does not work; finding out which is part of the case.</p>
    <h3>Controls</h3><p class="muted">Move: WASD / arrow keys, or the joystick. Jo fires automatically at the nearest target. Switch tools: number keys or the tool buttons.</p>
    <button class="btn gold big" id="go" type="button">Start treatment</button></div></section>`;
  $('#back').onclick = map; $('#go').onclick = () => arena(i);
}
function arenaTools(c){
  const list = c.tools.map(k => ({key:k, name:TOOLS[k].name, col:TOOLS[k].col}));
  list.push({key:'decoy', name:c.decoy.name, col:'#9aa4ae', decoy:true});
  return shuffle(list);
}

/* ================= ARENA ================= */
let G = null, raf = 0;
const W = 960, H = 600;
function stopArena(){ cancelAnimationFrame(raf); raf = 0; if(G && G.cleanup) G.cleanup(); G = null; }
function arena(i){
  stopArena();
  const c = CASES[i], tools = arenaTools(c);
  app.innerHTML = `<section class="arena"><div class="hud"><button class="ib" id="quit" aria-label="Leave">←</button>
      <div class="hp" aria-label="Energy"><span>ENERGY</span><b id="hp"></b></div>
      <div class="shield"><span id="bossName">${esc(c.root.name)}</span><div class="bar2"><i id="shieldBar"></i></div><small id="shieldTxt"></small></div></div>
    <div class="stage"><canvas id="cv" width="${W}" height="${H}" aria-label="Arena inside ${esc(c.district)}"></canvas><div class="tip" id="tip" hidden></div>
      <div class="joy" id="joy" aria-hidden="true"><i id="knob"></i></div></div>
    <div class="tools" role="radiogroup" aria-label="Treatment tools">${tools.map((t, k) => `<button class="tool" type="button" role="radio" data-k="${k}" style="--c:${t.col}"><span class="key">${k + 1}</span>${esc(t.name)}</button>`).join('')}</div></section>`;
  const cv = $('#cv'), x = cv.getContext('2d');
  const theme = themeOf(c);
  G = {c, i, tools, tool:0, t:0, jo:{x:W / 2, y:H - 90, vx:0, vy:0, hp:5, inv:0, face:1, step:0}, en:[], shots:[], fx:[], pops:[],
    boss:{x:W / 2, y:118, hp:12, max:12, shield:10, cleared:0, pulse:3.5, ring:0, dead:false, hit:0}, spawn:.6, fire:0, wrong:{}, decoyWarned:false, over:false, keys:{}, joy:{x:0, y:0}, theme};
  // inputs
  const kd = e => { G.keys[e.key.toLowerCase()] = true; const n = +e.key; if(n >= 1 && n <= tools.length){ setTool(n - 1); } if(['arrowup','arrowdown','arrowleft','arrowright',' '].includes(e.key.toLowerCase())) e.preventDefault(); };
  const ku = e => { G.keys[e.key.toLowerCase()] = false; };
  addEventListener('keydown', kd); addEventListener('keyup', ku);
  const joy = $('#joy'), knob = $('#knob'); let jid = null, jc = null;
  const jstart = e => { const t = e.changedTouches ? e.changedTouches[0] : e; jid = t.identifier ?? 'm'; const r = joy.getBoundingClientRect(); jc = {x:r.left + r.width / 2, y:r.top + r.height / 2}; jmove(e); };
  const jmove = e => { if(jid === null) return; const t = e.changedTouches ? [...e.changedTouches].find(q => q.identifier === jid) : e; if(!t) return; let dx = t.clientX - jc.x, dy = t.clientY - jc.y; const d = Math.hypot(dx, dy), m = 46; if(d > m){ dx *= m / d; dy *= m / d; } G.joy = {x:dx / m, y:dy / m}; knob.style.transform = `translate(${dx}px,${dy}px)`; e.preventDefault(); };
  const jend = () => { jid = null; G.joy = {x:0, y:0}; knob.style.transform = ''; };
  joy.addEventListener('touchstart', jstart, {passive:false}); joy.addEventListener('touchmove', jmove, {passive:false}); joy.addEventListener('touchend', jend);
  joy.addEventListener('pointerdown', e => { if(e.pointerType === 'mouse'){ jstart(e); joy.setPointerCapture(e.pointerId); } }); joy.addEventListener('pointermove', e => { if(e.pointerType === 'mouse') jmove(e); }); joy.addEventListener('pointerup', e => { if(e.pointerType === 'mouse') jend(); });
  G.cleanup = () => { removeEventListener('keydown', kd); removeEventListener('keyup', ku); };
  app.querySelectorAll('.tool').forEach(b => b.onclick = () => setTool(+b.dataset.k));
  $('#quit').onclick = () => { stopArena(); map(); };
  setTool(0); hud();
  let last = performance.now();
  const loop = now => { const dt = Math.min(.033, (now - last) / 1000); last = now; if(G && !G.over){ update(dt); draw(x); } if(G) raf = requestAnimationFrame(loop); };
  raf = requestAnimationFrame(loop);
}
function setTool(k){ if(!G) return; G.tool = k; app.querySelectorAll('.tool').forEach((b, j) => { b.classList.toggle('on', j === k); b.setAttribute('aria-checked', j === k); }); sfx('tap'); }
function themeOf(c){
  const r = (c.region || '').toLowerCase();
  if(/spine|back/.test(r)) return {bg:'#1d1636', street:'#2c2350', block:['#3d2f6e', '#4b3a86'], accent:'#ffb347', name:'vertebra blocks'};
  if(/wrist|hand/.test(r)) return {bg:'#13213a', street:'#1d3356', block:['#26467a', '#2f5a96'], accent:'#ffe066', name:'the carpal tunnel'};
  if(/knee|ankle|foot/.test(r)) return {bg:'#1f1a2e', street:'#2e2846', block:['#4a3b5e', '#5a4870'], accent:'#7fe3d2', name:'cartilage avenues'};
  return {bg:'#221430', street:'#331f48', block:['#5a2f5e', '#6e3a72'], accent:'#ff8f6b', name:'tendon fibres'};
}
function tip(msg){ const t = $('#tip'); if(!t) return; t.textContent = msg; t.hidden = false; clearTimeout(tip.t); tip.t = setTimeout(() => { t.hidden = true; }, 3200); }
function hud(){
  if(!G) return; $('#hp').textContent = '♥'.repeat(Math.max(0, G.jo.hp)) + '♡'.repeat(5 - Math.max(0, G.jo.hp));
  const b = G.boss, sh = b.shield > 0;
  $('#shieldBar').style.width = (sh ? b.cleared / 10 : b.hp / b.max) * 100 + '%';
  $('#shieldBar').className = sh ? 'sh' : 'hpbar';
  $('#shieldTxt').textContent = sh ? `Shield: clear ${10 - b.cleared} more symptoms` : `Shield down! Hit it with the root-cause treatment`;
}
function spawnEnemy(){
  const g = G, kinds = g.c.enemies, e = kinds[Math.floor(Math.random() * kinds.length)];
  const a = Math.random() * Math.PI * 2;
  g.en.push({kind:e.kind, name:e.name, shape:e.shape, tool:e.tool, x:g.boss.x + Math.cos(a) * 60, y:g.boss.y + 40 + Math.abs(Math.sin(a)) * 30, hp:2, sp:40 + Math.random() * 26 + g.boss.cleared * 1.5, ph:Math.random() * 6, hit:0});
}
function update(dt){
  const g = G, j = g.jo, b = g.boss; g.t += dt;
  // move
  let mx = (g.keys['d'] || g.keys['arrowright'] ? 1 : 0) - (g.keys['a'] || g.keys['arrowleft'] ? 1 : 0) + g.joy.x;
  let my = (g.keys['s'] || g.keys['arrowdown'] ? 1 : 0) - (g.keys['w'] || g.keys['arrowup'] ? 1 : 0) + g.joy.y;
  const m = Math.hypot(mx, my); if(m > 1){ mx /= m; my /= m; }
  j.x = Math.max(24, Math.min(W - 24, j.x + mx * 230 * dt)); j.y = Math.max(190, Math.min(H - 24, j.y + my * 230 * dt));
  if(Math.abs(mx) > .1) j.face = mx > 0 ? 1 : -1; if(m > .1) j.step += dt * 10;
  j.inv = Math.max(0, j.inv - dt);
  // spawn (keeps coming while the root cause lives)
  if(!b.dead){ g.spawn -= dt; if(g.spawn <= 0 && g.en.length < (b.shield > 0 ? 8 : 5)){ spawnEnemy(); g.spawn = b.shield > 0 ? Math.max(.55, 1.25 - b.cleared * .04) : 1.6; } }
  // boss pulse
  if(!b.dead){ b.pulse -= dt; if(b.pulse <= 0){ b.pulse = 6; b.ring = 1; sfx('boss'); } if(b.ring > 0){ b.ring += dt * 340; const d = Math.hypot(j.x - b.x, j.y - b.y); if(b.ring < 300 && Math.abs(d - b.ring) < 16 && j.inv <= 0) hurt(); if(b.ring > 300) b.ring = 0; } }
  b.hit = Math.max(0, b.hit - dt);
  // enemies
  for(const e of g.en){ const dx = j.x - e.x, dy = j.y - e.y, d = Math.hypot(dx, dy) || 1; e.x += dx / d * e.sp * dt + Math.cos(g.t * 3 + e.ph) * 20 * dt; e.y += dy / d * e.sp * dt; e.hit = Math.max(0, e.hit - dt);
    if(d < 26 && j.inv <= 0){ hurt(); e.x -= dx / d * 40; e.y -= dy / d * 40; } }
  // fire at nearest target
  g.fire -= dt;
  if(g.fire <= 0){
    let tgt = null, best = 420;
    for(const e of g.en){ const d = Math.hypot(e.x - j.x, e.y - j.y); if(d < best){ best = d; tgt = e; } }
    // shield down: every other shot goes at the root cause, so it can be treated while symptoms are still around
    if(!b.dead && b.shield <= 0 && (!tgt || g.tools[g.tool].key === g.c.root.tool)) tgt = b;   // root-cause tool selected: aim at the root cause
    if(!tgt && !b.dead && Math.hypot(b.x - j.x, b.y - j.y) < 520) tgt = b;
    if(tgt){ const tl = g.tools[g.tool], a = Math.atan2(tgt.y - j.y, tgt.x - j.x); g.shots.push({x:j.x, y:j.y - 10, vx:Math.cos(a) * 520, vy:Math.sin(a) * 520, tool:tl, life:.9}); g.fire = .3; }
  }
  for(const s of g.shots){ s.x += s.vx * dt; s.y += s.vy * dt; s.life -= dt;
    for(const e of g.en){ if(e.hp > 0 && Math.hypot(e.x - s.x, e.y - s.y) < 20){ s.life = 0; hitEnemy(e, s.tool); break; } }
    if(s.life > 0 && !b.dead && Math.hypot(b.x - s.x, b.y - s.y) < 58){ s.life = 0; hitBoss(s.tool); } }
  g.shots = g.shots.filter(s => s.life > 0 && s.x > -20 && s.x < W + 20 && s.y > -20 && s.y < H + 20);
  g.en = g.en.filter(e => e.hp > 0);
  for(const p of g.fx){ p.x += p.vx * dt; p.y += p.vy * dt; p.t -= dt; } g.fx = g.fx.filter(p => p.t > 0);
  for(const p of g.pops){ p.y -= 30 * dt; p.t -= dt; } g.pops = g.pops.filter(p => p.t > 0);
}
function burst(x0, y0, col, n = 12){ for(let k = 0; k < n; k++){ const a = Math.random() * 6.28, s = 60 + Math.random() * 180; G.fx.push({x:x0, y:y0, vx:Math.cos(a) * s, vy:Math.sin(a) * s, t:.5, col}); } }
function pop(x0, y0, text, col = '#fff'){ G.pops.push({x:x0, y:y0, text, col, t:1}); }
function hitEnemy(e, tl){
  const g = G;
  if(tl.decoy){ pop(e.x, e.y - 18, 'no effect', '#c9d1d9'); sfx('miss'); if(!g.decoyWarned){ g.decoyWarned = true; tip(`${tl.name}: ${g.c.decoy.why}`); } g.misses = (g.misses || 0) + 1; return; }
  if(tl.key !== e.tool){ pop(e.x, e.y - 18, 'resists', '#ffb3b3'); sfx('miss'); g.wrong[e.kind] = (g.wrong[e.kind] || 0) + 1; g.misses = (g.misses || 0) + 1;
    if(g.wrong[e.kind] === 2) tip(`${e.name} needs ${TOOLS[e.tool].name}.`); return; }
  e.hp--; e.hit = .12; sfx('hit');
  if(e.hp <= 0){ burst(e.x, e.y, TOOLS[e.tool].col); sfx('kill'); pop(e.x, e.y - 18, e.name + ' cleared', TOOLS[e.tool].col);
    const b = g.boss; if(b.shield > 0){ b.cleared++; if(b.cleared >= 10){ b.shield = 0; sfx('shield'); tip(`Shield down! Select the treatment for the root cause and Jo will aim at it.`); } } hud(); }
}
function hitBoss(tl){
  const g = G, b = g.boss;
  if(b.shield > 0){ pop(b.x, b.y - 70, 'shielded: clear symptoms first', '#cfd8ff'); return; }
  if(tl.decoy || tl.key !== g.c.root.tool){ pop(b.x, b.y - 70, tl.decoy ? 'no effect' : 'only eases symptoms', '#ffb3b3'); sfx('miss'); g.misses = (g.misses || 0) + 1;
    if(!g.bossHint){ g.bossHint = 1; } else if(++g.bossHint === 4) tip(`The root cause responds to ${TOOLS[g.c.root.tool].name}.`); return; }
  b.hp--; b.hit = .15; sfx('hit'); burst(b.x + (Math.random() - .5) * 60, b.y + (Math.random() - .5) * 40, TOOLS[tl.key].col, 6); hud();
  if(b.hp <= 0){ b.dead = true; sfx('win'); burst(b.x, b.y, '#ffe066', 60); g.en.forEach(e => { burst(e.x, e.y, '#ffffff', 6); e.hp = 0; }); tip('Root cause treated. The symptoms fade with it.'); setTimeout(() => win(), 1600); }
}
function hurt(){ const g = G, j = g.jo; j.hp--; j.inv = 1.6; sfx('hurt'); hud(); const cv = $('#cv'); if(cv){ cv.classList.remove('shake'); void cv.offsetWidth; cv.classList.add('shake'); }
  if(j.hp <= 0){ g.over = true; setTimeout(lose, 500); } }

function draw(x){
  const g = G, th = g.theme, b = g.boss, j = g.jo;
  x.fillStyle = th.bg; x.fillRect(0, 0, W, H);
  // body-city streets: cells as blocks, fibres as roads
  x.fillStyle = th.street; for(let yy = 0; yy < H; yy += 60) x.fillRect(0, yy, W, 14); for(let xx = 0; xx < W; xx += 80) x.fillRect(xx, 0, 12, H);
  let s = 3; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
  for(let yy = 14; yy < H; yy += 60) for(let xx = 12; xx < W; xx += 80){ x.fillStyle = th.block[r() > .5 ? 1 : 0]; roundRect(x, xx + 4, yy + 4, 60, 38, 8); x.fill();
    x.fillStyle = 'rgba(255,255,255,.07)'; roundRect(x, xx + 8, yy + 8, 24, 10, 4); x.fill(); if(r() > .6){ x.fillStyle = th.accent + '55'; x.fillRect(xx + 46, yy + 12, 8, 8); } }
  // a glowing nerve highway
  x.strokeStyle = 'rgba(255,224,102,.35)'; x.lineWidth = 5; x.beginPath(); x.moveTo(0, 470); for(let xx = 0; xx <= W; xx += 40) x.lineTo(xx, 470 + Math.sin(xx * .01 + g.t) * 10); x.stroke();
  // root cause boss: a pulsing building-organism with roots
  if(!b.dead){
    x.save(); x.translate(b.x, b.y);
    x.strokeStyle = 'rgba(255,93,143,.5)'; x.lineWidth = 4; for(let k = 0; k < 7; k++){ x.beginPath(); x.moveTo(0, 30); const a = -0.3 + k * .55; x.quadraticCurveTo(Math.cos(a) * 80, 70, Math.cos(a) * 150 + Math.sin(g.t * 2 + k) * 10, 120 + Math.sin(g.t + k) * 8); x.stroke(); }
    const pulse = 1 + Math.sin(g.t * 4) * .04 + (b.hit ? .08 : 0); x.scale(pulse, pulse);
    const gr = x.createRadialGradient(0, 0, 10, 0, 0, 90); gr.addColorStop(0, b.shield > 0 ? 'rgba(160,140,255,.5)' : 'rgba(255,93,143,.6)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = gr; x.beginPath(); x.arc(0, 0, 90, 0, 7); x.fill();
    x.fillStyle = b.hit ? '#fff' : '#7a1f4a'; roundRect(x, -52, -44, 104, 80, 16); x.fill(); x.fillStyle = '#a32a63'; roundRect(x, -40, -60, 80, 30, 10); x.fill();
    x.fillStyle = '#ffe066'; for(let k = 0; k < 3; k++){ x.fillRect(-34 + k * 26, -16, 14, 12); } x.fillStyle = '#1b0f22'; roundRect(x, -12, 8, 24, 28, 6); x.fill();
    x.fillStyle = '#ff5d8f'; x.beginPath(); x.arc(-18, -38, 6, 0, 7); x.arc(18, -38, 6, 0, 7); x.fill();
    if(b.shield > 0){ x.strokeStyle = `rgba(170,160,255,${.55 + Math.sin(g.t * 5) * .2})`; x.lineWidth = 5; x.beginPath(); x.arc(0, -8, 78, 0, 7); x.stroke(); }
    x.restore();
    if(b.ring > 0){ x.strokeStyle = 'rgba(255,93,143,.75)'; x.lineWidth = 6; x.beginPath(); x.arc(b.x, b.y, b.ring, 0, 7); x.stroke(); x.lineWidth = 2; x.strokeStyle = 'rgba(255,255,255,.4)'; x.beginPath(); x.arc(b.x, b.y, Math.max(1, b.ring - 8), 0, 7); x.stroke(); }
    x.fillStyle = '#fff'; x.font = '700 13px "Bricolage Grotesque",sans-serif'; x.textAlign = 'center'; x.fillText('ROOT CAUSE', b.x, b.y + 62);
  }
  // symptoms
  for(const e of g.en){ drawEnemy(x, e); }
  // shots
  for(const sh of g.shots){ x.fillStyle = sh.tool.col; x.beginPath(); x.arc(sh.x, sh.y, 6, 0, 7); x.fill(); x.fillStyle = 'rgba(255,255,255,.7)'; x.beginPath(); x.arc(sh.x - 1.5, sh.y - 1.5, 2, 0, 7); x.fill(); }
  // Jo
  if(!(j.inv > 0 && Math.floor(g.t * 14) % 2)){ const frame = Math.hypot(g.joy.x, g.joy.y) > .1 || ['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright'].some(k => g.keys[k]) ? (Math.floor(j.step) % 2 ? 'b' : 'c') : 'a';
    x.save(); x.translate(j.x, j.y); x.fillStyle = 'rgba(0,0,0,.3)'; x.beginPath(); x.ellipse(0, 22, 14, 5, 0, 0, 7); x.fill(); x.scale(j.face, 1); x.imageSmoothingEnabled = false; x.drawImage(jo(SAVE.look, frame), -25, -36, 50, 60); x.restore();
    x.strokeStyle = g.tools[g.tool].col; x.lineWidth = 3; x.beginPath(); x.arc(j.x, j.y + 22, 18, 0, 7); x.stroke(); }
  for(const p of g.fx){ x.globalAlpha = Math.max(0, p.t * 2); x.fillStyle = p.col; x.fillRect(p.x - 2, p.y - 2, 4, 4); } x.globalAlpha = 1;
  x.textAlign = 'center'; for(const p of g.pops){ x.globalAlpha = Math.min(1, p.t * 2); x.font = '800 14px "Bricolage Grotesque",sans-serif'; x.lineWidth = 3; x.strokeStyle = 'rgba(0,0,0,.6)'; x.strokeText(p.text, p.x, p.y); x.fillStyle = p.col; x.fillText(p.text, p.x, p.y); } x.globalAlpha = 1;
}
function roundRect(x, a, b, w, h, r){ x.beginPath(); x.moveTo(a + r, b); x.arcTo(a + w, b, a + w, b + h, r); x.arcTo(a + w, b + h, a, b + h, r); x.arcTo(a, b + h, a, b, r); x.arcTo(a, b, a + w, b, r); x.closePath(); }
function drawEnemy(x, e){
  const col = {pain:'#ff4d5e', swell:'#5fb8ff', stiff:'#9aa4b8', tingle:'#ffe066', weak:'#d6d0ff', fear:'#b06bff', habit:'#ff9f43', night:'#5a6bff', unstable:'#3ee0b0', tight:'#ff6fb5', load:'#c98b5a'}[e.kind] || '#fff';
  x.save(); x.translate(e.x, e.y); const t = performance.now() / 1000 + e.ph;
  x.fillStyle = e.hit ? '#fff' : col; x.strokeStyle = 'rgba(0,0,0,.5)'; x.lineWidth = 2;
  switch(e.shape){
    case 'spike': x.beginPath(); for(let k = 0; k < 16; k++){ const a = k / 16 * 6.28 + t, r = k % 2 ? 9 : 19; x.lineTo(Math.cos(a) * r, Math.sin(a) * r); } x.closePath(); x.fill(); x.stroke(); break;
    case 'blob': x.beginPath(); for(let k = 0; k <= 20; k++){ const a = k / 20 * 6.28, r = 16 + Math.sin(a * 3 + t * 3) * 3; x.lineTo(Math.cos(a) * r, Math.sin(a) * r); } x.fill(); x.stroke(); break;
    case 'block': x.rotate(Math.sin(t) * .1); roundRect(x, -15, -15, 30, 30, 4); x.fill(); x.stroke(); x.strokeStyle = 'rgba(0,0,0,.35)'; x.beginPath(); x.moveTo(-15, -5); x.lineTo(15, -5); x.moveTo(-15, 5); x.lineTo(15, 5); x.stroke(); break;
    case 'zap': x.beginPath(); x.moveTo(-6, -18); x.lineTo(8, -4); x.lineTo(0, -2); x.lineTo(8, 18); x.lineTo(-8, 2); x.lineTo(0, 0); x.closePath(); x.fill(); x.stroke(); break;
    case 'ghost': x.globalAlpha = .85; x.beginPath(); x.arc(0, -4, 14, Math.PI, 0); x.lineTo(14, 14); for(let k = 0; k < 4; k++) x.lineTo(14 - (k + .5) * 7, 10 + (k % 2) * 6); x.lineTo(-14, 14); x.closePath(); x.fill(); x.stroke(); break;
    case 'eye': x.beginPath(); x.ellipse(0, 0, 19, 12, 0, 0, 7); x.fill(); x.stroke(); x.fillStyle = '#1b0f22'; x.beginPath(); x.arc(Math.sin(t * 2) * 4, 0, 6, 0, 7); x.fill(); break;
    case 'gear': x.rotate(t * 2); x.beginPath(); for(let k = 0; k < 12; k++){ const a = k / 12 * 6.28, r = k % 2 ? 12 : 18; x.lineTo(Math.cos(a) * r, Math.sin(a) * r); } x.closePath(); x.fill(); x.stroke(); x.fillStyle = '#1b0f22'; x.beginPath(); x.arc(0, 0, 5, 0, 7); x.fill(); break;
    case 'moon': x.beginPath(); x.arc(0, 0, 16, 0, 7); x.fill(); x.stroke(); x.fillStyle = '#1b1636'; x.beginPath(); x.arc(7, -5, 13, 0, 7); x.fill(); break;
    case 'wobble': x.rotate(Math.sin(t * 6) * .4); x.beginPath(); x.moveTo(0, -18); x.lineTo(16, 12); x.lineTo(-16, 12); x.closePath(); x.fill(); x.stroke(); break;
    case 'knot': x.lineWidth = 6; x.strokeStyle = e.hit ? '#fff' : col; x.beginPath(); for(let k = 0; k <= 30; k++){ const a = k / 30 * 6.28 * 2; x.lineTo(Math.cos(a) * (10 + Math.sin(a * 1.5) * 5), Math.sin(a) * (10 + Math.sin(a * 1.5) * 5)); } x.stroke(); break;
    default: x.beginPath(); roundRect(x, -14, -10, 28, 24, 5); x.fill(); x.stroke(); x.fillStyle = 'rgba(0,0,0,.4)'; x.font = '800 10px sans-serif'; x.textAlign = 'center'; x.fillText('KG', 0, 6);
  }
  x.restore();
  x.fillStyle = 'rgba(255,255,255,.85)'; x.font = '700 10px "Bricolage Grotesque",sans-serif'; x.textAlign = 'center'; x.fillText(e.name, e.x, e.y + 32);
}

/* ---------- end of case ---------- */
function win(){
  const g = G; if(!g) return; const c = g.c;
  const stars = 1 + (INV && INV.firstTry ? 1 : 0) + (g.jo.hp >= 3 ? 1 : 0);
  const prev = SAVE.done[c.id] || 0; SAVE.done[c.id] = Math.max(prev, stars); persist();
  stopArena();
  app.innerHTML = `<section class="case"><header class="bar"><button class="ib" id="back" aria-label="Map">←</button><div><b>Case solved</b><small>${esc(c.district)}</small></div><span class="ib blank" aria-hidden="true"></span></header>
    <div class="debrief"><div class="stars3" aria-label="${stars} of 3 stars">${'★'.repeat(stars)}<span>${'★'.repeat(3 - stars)}</span></div><h2>${esc(c.title)}</h2>
    <p class="lead">${esc(c.simple)}</p>
    <div class="cols"><div><h3>From root cause to treatment</h3><ol class="chain">${c.flow.map((f, k) => `<li class="${k === 1 ? 'rootstep' : ''}">${esc(f)}</li>`).join('')}</ol></div>
    <div><h3>What worked here</h3><ul class="worked">${c.enemies.map(e => `<li><b>${esc(e.name)}</b> → ${esc(TOOLS[e.tool].name)}</li>`).join('')}<li class="root"><b>Root cause</b> → ${esc(TOOLS[c.root.tool].name)}</li><li class="decoy"><b>Not helpful:</b> ${esc(c.decoy.name)}. ${esc(c.decoy.why)}</li></ul>
    <h3>Red flags to screen</h3><ul class="flags">${c.flags.map(f => `<li>${esc(f)}</li>`).join('')}</ul></div></div>
    <details><summary>Physiotherapy management (full)</summary><ul>${c.management.map(m => `<li>${esc(m)}</li>`).join('')}</ul></details>
    <details><summary>Read more</summary><ul class="refs">${c.refs.map(r => `<li>${esc(r)}</li>`).join('')}</ul></details>
    <p class="muted">Content adapted from the Learn Anywhere library (Learn Anywhere contributors, CC BY-NC-SA 4.0). Draft, pending clinical review. Educational only, not medical advice.</p>
    <p class="stars-why">${stars < 3 ? `Stars: ${INV && INV.firstTry ? '' : 'get every investigation step right first time · '}${g.jo.hp >= 3 ? '' : 'finish with 3 or more energy'}` : 'Perfect case: every call right and Jo stayed healthy.'}</p>
    <div class="row"><button class="btn gold big" id="next" type="button">Back to Body City</button><button class="btn ghost" id="again" type="button">Replay case</button><a class="btn ghost" href="../#clinic">Spend rewards in Jo's Clinic</a></div></div></section>`;
  $('#back').onclick = map; $('#next').onclick = map; $('#again').onclick = () => investigate(g.i);
  if(!prev) toast(`New case skill: ${c.title.split('(')[0].trim()}`);
}
function lose(){
  const g = G; if(!g) return; const i = g.i, c = g.c; stopArena();
  app.innerHTML = `<section class="case"><header class="bar"><button class="ib" id="back" aria-label="Map">←</button><div><b>Jo needs a break</b><small>${esc(c.district)}</small></div><span class="ib blank" aria-hidden="true"></span></header>
    <div class="debrief"><h2>The symptoms overwhelmed the clinic</h2><p class="lead">Keep moving to dodge, and match each symptom to its treatment. Remember: symptoms keep coming until the root cause is treated.</p>
    <ul class="worked">${c.enemies.map(e => `<li><b>${esc(e.name)}</b> → ${esc(TOOLS[e.tool].name)}</li>`).join('')}</ul>
    <div class="row"><button class="btn gold big" id="retry" type="button">Try the arena again</button><button class="btn ghost" id="map" type="button">Body City</button></div></div></section>`;
  $('#back').onclick = map; $('#map').onclick = map; $('#retry').onclick = () => arena(i);
}

// automated test hook (only with ?test in the URL): read-only snapshot of the arena
if(/[?&]test\b/.test(location.search)) window.__rcTest = () => G && {tools:G.tools.map(t => t.key), tool:G.tool, root:G.c.root.tool, shield:G.boss.shield, jo:{x:G.jo.x, y:G.jo.y, hp:G.jo.hp},
  en:G.en.map(e => ({x:e.x, y:e.y, tool:e.tool}))};
title();
})();
