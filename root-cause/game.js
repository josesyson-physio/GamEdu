/* Root Raid: Body City. A Gamified Edu physiotherapy game (folder and save key keep the name root-cause).
   Open world: roam a city shaped like a body, meet a patient, run tests at street kiosks, refer the red flag,
   pick the right hideout, then clear symptoms with the right tool and defeat the root cause. */
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

/* ================= NAMES ================= */
const NICK = {pain:'Ouch', swell:'Puff', stiff:'Brick', tingle:'Zappy', weak:'Noodle', fear:'Overthink', habit:'Bad Habit', night:'Night Ache', unstable:'Wobble', tight:'Knot', load:'Overload'};
const QUEST = {'tennis-elbow':'Grip Glitch', 'carpal-tunnel':'Pins & Needles FM', 'subacromial-pain':'Shoulder Side Quest', 'frozen-shoulder':'Frozen Mode', 'cervical-radiculopathy':'Neck Signal Lost',
  'lbp':'Back in Its Villain Era', 'lumbar-disc':'Disc Drama', 'knee-oa':'Creaky Knee Arc', 'ankle-sprain':'Ankle Plot Twist', 'plantar-heel-pain':'First-Step Jumpscare'};
const ECOL = {pain:'#ff4d5e', swell:'#5fb8ff', stiff:'#9aa4b8', tingle:'#ffe066', weak:'#d6d0ff', fear:'#b06bff', habit:'#ff9f43', night:'#5a6bff', unstable:'#3ee0b0', tight:'#ff6fb5', load:'#c98b5a'};

/* ================= WORLD: a city in the shape of a body ================= */
const S = 10, MW = 400, MH = 810, WW = MW * S, WH = MH * S, CELL = 160, B0 = 30, BW = 100;
function bodyPath(g, grow, col){
  g.strokeStyle = col; g.fillStyle = col; g.lineCap = 'round'; g.lineJoin = 'round'; g.lineWidth = 44 + grow;
  for(const pts of [[[118,175],[92,320],[82,452]], [[282,175],[308,320],[322,452]], [[168,430],[160,600],[158,760]], [[232,430],[240,600],[246,760]]]){ g.beginPath(); pts.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.stroke(); }
  g.beginPath(); g.arc(200, 66, 44 + grow / 2, 0, 7); g.fill();
  g.fillRect(183 - grow / 2, 100, 34 + grow, 50);
  g.lineWidth = grow + 2; g.beginPath(); g.moveTo(112, 160); g.quadraticCurveTo(200, 128, 288, 160); g.lineTo(268, 440); g.quadraticCurveTo(200, 462, 132, 440); g.closePath(); g.fill(); g.stroke();
  g.beginPath(); g.ellipse(150, 770, 26 + grow / 2, 12 + grow / 2, 0, 0, 7); g.fill(); g.beginPath(); g.ellipse(254, 770, 26 + grow / 2, 12 + grow / 2, 0, 0, 7); g.fill();
}
const MASK = (() => { const c = document.createElement('canvas'); c.width = MW; c.height = MH; const g = c.getContext('2d'); bodyPath(g, 0, '#fff'); const d = g.getImageData(0, 0, MW, MH).data, m = new Uint8Array(MW * MH); for(let i = 0; i < m.length; i++) m[i] = d[i * 4 + 3] > 128 ? 1 : 0; return m; })();
const inside = (x, y) => { const mx = x / S | 0, my = y / S | 0; return mx >= 0 && my >= 0 && mx < MW && my < MH && MASK[my * MW + mx] === 1; };
/* main streets (the nerve highways). Kept clear of buildings so every place is reachable. */
const SK = [[[200,30],[200,430]], [[200,170],[118,175]], [[118,175],[92,320]], [[92,320],[82,452]], [[200,170],[282,175]], [[282,175],[308,320]], [[308,320],[322,452]],
  [[200,430],[168,445]], [[168,445],[160,600]], [[160,600],[158,760]], [[200,430],[232,445]], [[232,445],[240,600]], [[240,600],[246,760]]].map(s => s.map(p => [p[0] * S, p[1] * S]));
const SAMPLES = []; SK.forEach(([a, b]) => { const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.ceil(L / 40); for(let k = 0; k <= n; k++) SAMPLES.push([a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n]); });
function distSk(x, y){ let best = 1e9; for(const [a, b] of SK){ const vx = b[0] - a[0], vy = b[1] - a[1], t = Math.max(0, Math.min(1, ((x - a[0]) * vx + (y - a[1]) * vy) / (vx * vx + vy * vy))); best = Math.min(best, Math.hypot(x - a[0] - vx * t, y - a[1] - vy * t)); } return best; }
const snap = (x, y) => SAMPLES.reduce((b, p) => Math.hypot(p[0] - x, p[1] - y) < Math.hypot(b[0] - x, b[1] - y) ? p : b, SAMPLES[0]);
const SITES = CASES.map(c => snap(c.x * MW * S, c.y * 800 * S));
const THEME = r => { r = (r || '').toLowerCase();
  if(/spine|back|neck/.test(r)) return ['#5b4a9e', '#6d5bb5', '#ffb347'];
  if(/wrist|hand|elbow/.test(r)) return ['#2f5f96', '#3a73b0', '#ffe066'];
  if(/knee|ankle|foot|heel/.test(r)) return ['#2f7a72', '#3a9086', '#7fe3d2'];
  return ['#8a3f7e', '#a04d92', '#ff8f6b']; };
const COLS = Math.ceil(WW / CELL), ROWS = Math.ceil(WH / CELL), BLD = new Array(COLS * ROWS).fill(null);
(() => { let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for(let j = 0; j < ROWS; j++) for(let i = 0; i < COLS; i++){ const x0 = i * CELL + B0, y0 = j * CELL + B0, cx = x0 + BW / 2, cy = y0 + BW / 2, r = rnd(), r2 = rnd(), r3 = rnd();
    if(![[x0 - 8, y0 - 8], [x0 + BW + 8, y0 - 8], [x0 - 8, y0 + BW + 8], [x0 + BW + 8, y0 + BW + 8], [cx, cy]].every(p => inside(p[0], p[1]))) continue;
    if(distSk(cx, cy) < 96) continue;
    let k = 0, bd = 1e9; SITES.forEach((p, n) => { const d = Math.hypot(p[0] - cx, p[1] - cy); if(d < bd){ bd = d; k = n; } });
    const th = THEME(CASES[k].region); BLD[j * COLS + i] = {h: 10 + Math.floor(r * 18), col: th[r2 > .5 ? 1 : 0], acc: th[2], lit: r3 > .45, park: r > .93}; } })();
function inBld(x, y){ const i = x / CELL | 0, j = y / CELL | 0; if(i < 0 || j < 0 || i >= COLS || j >= ROWS) return false; const b = BLD[j * COLS + i]; if(!b || b.park) return false; const lx = x - i * CELL, ly = y - j * CELL; return lx > B0 && lx < B0 + BW && ly > B0 && ly < B0 + BW; }
const solid = (x, y) => !inside(x, y) || inBld(x, y);
function spots(site, n){ const out = [], cand = SAMPLES.map(p => [p, Math.hypot(p[0] - site[0], p[1] - site[1])]).filter(q => q[1] >= 190).sort((a, b) => a[1] - b[1]);
  for(const [p] of cand){ if(out.every(o => Math.hypot(o[0] - p[0], o[1] - p[1]) >= 190)) out.push(p); if(out.length >= n) break; } return out; }

/* ================= SCREENS ================= */
function title(){
  stopGame();
  app.innerHTML = `<section class="title"><div class="stars"></div><div class="tcard">
    <span class="kick">GAMIFIED EDU · PHYSIOTHERAPY</span><h1><span>ROOT</span><span>RAID</span></h1><p class="sub">Body City</p>
    <p class="pitch">A whole city built inside a body, and its streets are acting up. Roam the districts, find people who need help, run the right tests, chase the trail and raid the root cause. Symptoms respawn until the boss is gone.</p>
    <div class="row"><button class="btn gold big" id="play">${Object.keys(SAVE.done).length ? 'Back to the streets' : 'Drop into Body City'}</button><a class="btn ghost" href="../#cat-physio">Back to Gamified Edu</a></div>
    <p class="keys">Move: WASD / arrows · Ride: Shift · Action: E · Tools: 1–5 · Map: M</p>
    <p class="draft">Draft clinical content, pending review by the clinical panel. Adapted from the Learn Anywhere library (CC BY-NC-SA 4.0).</p></div></section>`;
  $('#play').onclick = () => { sfx('tap'); world(); };
}

let G = null, raf = 0;
function stopGame(){ cancelAnimationFrame(raf); raf = 0; if(G && G.cleanup) G.cleanup(); G = null; }
const openCount = () => Math.min(CASES.length, 3 + Object.keys(SAVE.done).length);

function world(){
  stopGame();
  app.innerHTML = `<section class="world"><canvas id="cv" aria-label="Body City"></canvas>
    <div class="obj" id="obj"></div>
    <div class="hpbox" id="hpbox" hidden><div class="hp"><span>ENERGY</span><b id="hp"></b></div><div class="shield"><span id="bossName"></span><div class="bar2"><i id="shieldBar"></i></div><small id="shieldTxt"></small></div></div>
    <div class="topbtns"><button class="ib" id="mapb" type="button" aria-label="City map">MAP</button><button class="ib" id="menu" type="button" aria-label="Menu">☰</button></div>
    <div class="subt" id="sub" hidden></div>
    <div class="tools" id="tools" role="radiogroup" aria-label="Treatment tools" hidden></div>
    <div class="joy" id="joy" aria-hidden="true"><i id="knob"></i></div>
    <button class="act" id="act" type="button" hidden></button><button class="ride" id="ride" type="button" aria-pressed="false">RIDE</button>
    <div class="overlay" id="ov" hidden></div></section>`;
  const cv = $('#cv'), x = cv.getContext('2d');
  const start = snap(2000, 2400);
  G = {t:0, jo:{x:start[0], y:start[1], hp:5, inv:0, face:1, step:0, moving:false}, keys:{}, joy:{x:0, y:0}, ride:false, M:null, near:null, dlg:[], subT:0, banner:null, big:false, paused:false, shake:0,
    en:[], shots:[], fx:[], pops:[], boss:null, tools:[], tool:0, fire:0, spawn:0, district:'', distT:0, cam:{x:start[0], y:start[1]}, W:0, H:0, Z:1,
    traffic:Array.from({length:26}, (_, k) => ({s:k % SK.length, t:Math.random(), v:(.05 + Math.random() * .08) * (k % 2 ? 1 : -1)}))};
  const fit = () => { const dpr = Math.min(2, window.devicePixelRatio || 1); G.W = cv.clientWidth; G.H = cv.clientHeight; cv.width = G.W * dpr; cv.height = G.H * dpr; G.dpr = dpr; G.Z = Math.max(.6, Math.min(1.15, Math.min(G.W, G.H) / 640)); };
  fit(); addEventListener('resize', fit);
  const kd = e => { if(!G) return; const k = e.key.toLowerCase(); G.keys[k] = true;
    if(k === 'e' || k === 'enter' || k === ' '){ act(); e.preventDefault(); }
    if(k === 'm'){ G.big = !G.big; } if(k === 'escape'){ if(G.big) G.big = false; else menu(); }
    const n = +e.key; if(n >= 1 && n <= G.tools.length && G.M && G.M.step === 'raid') setTool(n - 1);
    if(k.startsWith('arrow')) e.preventDefault(); };
  const ku = e => { if(G) G.keys[e.key.toLowerCase()] = false; };
  addEventListener('keydown', kd); addEventListener('keyup', ku);
  const joy = $('#joy'), knob = $('#knob'); let jid = null, jc = null;
  const jstart = e => { const t = e.changedTouches ? e.changedTouches[0] : e; jid = t.identifier ?? 'm'; const r = joy.getBoundingClientRect(); jc = {x:r.left + r.width / 2, y:r.top + r.height / 2}; jmove(e); };
  const jmove = e => { if(jid === null || !G) return; const t = e.changedTouches ? [...e.changedTouches].find(q => q.identifier === jid) : e; if(!t) return; let dx = t.clientX - jc.x, dy = t.clientY - jc.y; const d = Math.hypot(dx, dy), m = 46; if(d > m){ dx *= m / d; dy *= m / d; } G.joy = {x:dx / m, y:dy / m}; knob.style.transform = `translate(${dx}px,${dy}px)`; e.preventDefault(); };
  const jend = () => { jid = null; if(G) G.joy = {x:0, y:0}; knob.style.transform = ''; };
  joy.addEventListener('touchstart', jstart, {passive:false}); joy.addEventListener('touchmove', jmove, {passive:false}); joy.addEventListener('touchend', jend); joy.addEventListener('touchcancel', jend);
  G.cleanup = () => { removeEventListener('keydown', kd); removeEventListener('keyup', ku); removeEventListener('resize', fit); };
  $('#act').onclick = act; $('#sub').onclick = act; $('#menu').onclick = menu; $('#mapb').onclick = () => { G.big = !G.big; };
  $('#ride').onclick = () => { G.ride = !G.ride; $('#ride').setAttribute('aria-pressed', G.ride); $('#ride').classList.toggle('on', G.ride); };
  objective(); say([Object.keys(SAVE.done).length ? 'Welcome back. Yellow blips on the radar are people who need you.' : 'Welcome to Body City. Follow a yellow blip on the radar to find someone who needs help.']);
  let last = performance.now();
  const loop = now => { if(!G) return; const dt = Math.min(.033, (now - last) / 1000); last = now; if(!G.paused) update(dt); draw(x); raf = requestAnimationFrame(loop); };
  raf = requestAnimationFrame(loop);
}

/* ---------- HUD helpers ---------- */
function say(lines, hold){ if(!G) return; G.dlg = lines.slice(); G.hold = !!hold; showSub(); }
function showSub(){ const s = $('#sub'); if(!s) return; if(!G.dlg.length){ s.hidden = true; return; } s.hidden = false; s.innerHTML = esc(G.dlg[0]) + (G.hold ? '<em>E / tap to continue</em>' : ''); G.subT = G.hold ? 1e9 : 2.2 + G.dlg[0].length * .045; }
function nextSub(){ G.dlg.shift(); if(!G.dlg.length && G.after){ const f = G.after; G.after = null; G.hold = false; showSub(); f(); return; } if(!G.dlg.length) G.hold = false; showSub(); }
function objective(){ const o = $('#obj'); if(!o || !G) return; const M = G.M;
  if(!M){ const left = CASES.length - Object.keys(SAVE.done).length; o.innerHTML = `<b>FREE ROAM</b><span>${left ? `Find a yellow blip to start a case. ${Object.keys(SAVE.done).length}/10 closed.` : 'All 10 cases closed. Replay any green blip for more stars.'}</span>`; return; }
  const c = M.c, T = {
    tests:`Examine ${c.patient.name}: run the tests that fit the story. Positive tests: ${M.tests.filter(t => t.done && t.right).length}/2`,
    triage:`Three locals nearby describe what they feel. One needs a hospital, not the clinic. Find them and call the ambulance.`,
    hunt:`The findings point to one source. Three hideouts, one root cause. Raid the right one.`,
    raid:`Clear symptoms with the tool that fits each one, break the shield, then treat the root cause.`}[M.step] || '';
  o.innerHTML = `<b>${esc(QUEST[c.id] || c.district)} · ${esc(c.district)}</b><span>${esc(T)}</span>`; }
function hud(){ if(!G) return; const raid = G.M && G.M.step === 'raid'; $('#hpbox').hidden = !raid; $('#tools').hidden = !raid; $('#ride').hidden = !!raid; if(!raid) return;
  $('#hp').textContent = '♥'.repeat(Math.max(0, G.jo.hp)) + '♡'.repeat(5 - Math.max(0, G.jo.hp));
  const b = G.boss, sh = b.shield > 0; $('#bossName').textContent = 'BOSS · ' + G.M.c.root.name;
  $('#shieldBar').style.width = (sh ? b.cleared / 10 : b.hp / b.max) * 100 + '%'; $('#shieldBar').className = sh ? 'sh' : 'hpbar';
  $('#shieldTxt').textContent = sh ? `Shield up: clear ${10 - b.cleared} more symptoms` : 'Shield down! Pick the root-cause treatment'; }
function setTool(k){ if(!G) return; G.tool = k; document.querySelectorAll('.tool').forEach((b, j) => { b.classList.toggle('on', j === k); b.setAttribute('aria-checked', j === k); }); sfx('tap'); }
function banner(text, sub, col, t){ G.banner = {text, sub, col, t:t || 3, T:t || 3}; }
function menu(){ if(!G) return; const ov = $('#ov'); G.paused = true; ov.hidden = false;
  ov.innerHTML = `<div class="panel small"><h2>Paused</h2><div class="col"><button class="btn gold" id="mResume" type="button">Resume</button>${G.M ? '<button class="btn ghost" id="mDrop" type="button">Drop this case</button>' : ''}<button class="btn ghost" id="mTitle" type="button">Title screen</button><a class="btn ghost" href="../#cat-physio">Back to Gamified Edu</a></div></div>`;
  const close = () => { ov.hidden = true; ov.innerHTML = ''; G.paused = false; };
  $('#mResume').onclick = close; $('#mTitle').onclick = title; const d = $('#mDrop'); if(d) d.onclick = () => { endMission(); close(); }; $('#mResume').focus(); }

/* ---------- missions ---------- */
function startMission(i){
  const c = CASES[i], site = SITES[i], sp = shuffle(spots(site, 10));
  const M = G.M = {c, i, site, step:'meet', mistakes:0,
    tests:shuffle([...c.tests.right.map(n => [n, true]), ...c.tests.wrong.map(n => [n, false])]).map(([name, right], k) => ({x:sp[k][0], y:sp[k][1], name, right, done:false})),
    npcs:shuffle([[c.flag.right, true], ...c.flag.others.map(o => [o, false])]).map(([text, flag], k) => ({x:sp[4 + k][0], y:sp[4 + k][1], text, flag, done:false, hue:k})),
    dens:shuffle([[c.root.name, true], ...c.root.mimics.map(m => [m, false])]).map(([name, right], k) => ({x:sp[7 + k][0], y:sp[7 + k][1], name, right, tried:false}))};
  sfx('ok'); banner(QUEST[c.id] || c.title, c.district.toUpperCase(), '#ffd36e', 2.6);
  G.after = () => { M.step = 'tests'; objective(); };
  say([`${c.patient.name}, ${c.patient.age}, ${c.patient.job}: “${c.patient.says}”`, `Street report: ${c.enemies.map(e => e.name.toLowerCase()).join(', ')} spreading through ${c.district}. Run the tests at the teal kiosks nearby.`], true);
  objective();
}
function endMission(){ if(!G) return; G.M = null; G.boss = null; G.en = []; G.shots = []; G.jo.hp = 5; hud(); objective(); }
function interactables(){
  const M = G.M, out = [];
  if(!M){ for(let i = 0; i < openCount(); i++) out.push({x:SITES[i][0], y:SITES[i][1], label:`${SAVE.done[CASES[i].id] ? 'Replay' : 'Start'}: ${QUEST[CASES[i].id]}`, go:() => startMission(i), kind:'case', i}); return out; }
  if(M.step === 'tests') M.tests.forEach(t => { if(!t.done) out.push({x:t.x, y:t.y, label:`Run ${t.name}`, kind:'test', right:t.right, go:() => {
    t.done = true; if(t.right){ sfx('ok'); pop(t.x, t.y - 40, 'POSITIVE', '#3ee0b0'); const n = M.tests.filter(q => q.done && q.right).length;
      if(n >= 2){ M.step = 'triage'; G.after = objective; say([`${t.name}: positive. That is both key tests.`, `Findings so far: ${M.c.flow[2]}.`, 'Before treating, check the locals nearby. One of them does not belong in a clinic.'], true); }
      else say([`${t.name}: positive. It reproduces ${M.c.patient.name}'s problem. One more to find.`]); }
    else { M.mistakes++; sfx('no'); pop(t.x, t.y - 40, 'negative', '#ffb3b3'); say([`${t.name}: negative. That test belongs to a different problem.`]); }
    objective(); }}); });
  if(M.step === 'triage') M.npcs.forEach(n => { if(!n.done) out.push({x:n.x, y:n.y, label:'Call the ambulance', kind:'npc', right:n.flag, go:() => {
    if(n.flag){ n.done = true; n.amb = 1; sfx('shield'); M.step = 'hunt'; G.after = objective; say([`Good catch. Red flag: ${n.text}. Referred, not treated here.`, 'Now follow the findings to the source. Three hideouts are marked nearby.'], true); }
    else { n.done = true; M.mistakes++; sfx('no'); say([`“${n.text}” fits ${M.c.title.split('(')[0].trim()}. Safe to treat in the clinic. Keep looking.`]); }
    objective(); }}); });
  if(M.step === 'hunt') M.dens.forEach(d => { if(!d.tried) out.push({x:d.x, y:d.y, label:`Raid: ${d.name}`, kind:'den', right:d.right, go:() => {
    if(d.right){ startRaid(d); } else { d.tried = true; M.mistakes++; sfx('no'); say([`Empty. The findings do not match ${d.name.toLowerCase()}. Check the other hideouts.`]); } }}); });
  return out;
}
function act(){ if(!G || G.paused) return; if(G.dlg.length && G.hold){ sfx('tap'); nextSub(); return; } if(G.near){ G.near.go(); } }
function startRaid(d){
  const M = G.M, c = M.c; M.step = 'raid'; M.den = d;
  G.tools = shuffle([...c.tools.map(k => ({key:k, name:TOOLS[k].name, col:TOOLS[k].col})), {key:'decoy', name:c.decoy.name, col:'#9aa4ae', decoy:true}]);
  $('#tools').innerHTML = G.tools.map((t, k) => `<button class="tool" type="button" role="radio" data-k="${k}" style="--c:${t.col}"><span class="key">${k + 1}</span>${esc(t.name)}</button>`).join('');
  document.querySelectorAll('.tool').forEach(b => b.onclick = () => setTool(+b.dataset.k));
  resetRaid(); setTool(0); G.ride = false; $('#ride').classList.remove('on');
  sfx('boss'); banner('BOSS FOUND', c.root.name, '#ff5d8f', 2.6);
  say(['Each symptom only gives way to the treatment that fits it. One tool on your belt is a dud.']); objective();
}
function resetRaid(){ const d = G.M.den; G.boss = {x:d.x, y:d.y, hp:12, max:12, shield:10, cleared:0, pulse:5, ring:0, dead:false, hit:0}; G.en = []; G.shots = []; G.jo.hp = 5; G.jo.inv = 1.5; G.spawn = 1; G.wrong = {}; G.decoyWarned = false; G.bossHint = 0;
  const away = SAMPLES.filter(q => { const dd = Math.hypot(q[0] - d.x, q[1] - d.y); return dd > 300 && dd < 400; }).sort((p, q) => Math.hypot(p[0] - G.jo.x, p[1] - G.jo.y) - Math.hypot(q[0] - G.jo.x, q[1] - G.jo.y))[0] || G.M.site; G.jo.x = away[0]; G.jo.y = away[1]; hud(); }

/* ---------- update ---------- */
function update(dt){
  const g = G, j = g.jo, M = g.M; g.t += dt; g.shake = Math.max(0, g.shake - dt);
  if(g.dlg.length && !g.hold){ g.subT -= dt; if(g.subT <= 0) nextSub(); }
  if(g.banner){ g.banner.t -= dt; if(g.banner.t <= 0) g.banner = null; }
  const frozen = g.dlg.length && g.hold;
  let mx = 0, my = 0;
  if(!frozen){ mx = (g.keys['d'] || g.keys['arrowright'] ? 1 : 0) - (g.keys['a'] || g.keys['arrowleft'] ? 1 : 0) + g.joy.x; my = (g.keys['s'] || g.keys['arrowdown'] ? 1 : 0) - (g.keys['w'] || g.keys['arrowup'] ? 1 : 0) + g.joy.y; }
  const m = Math.hypot(mx, my); if(m > 1){ mx /= m; my /= m; }
  const raid = M && M.step === 'raid', riding = !raid && (g.ride || g.keys['shift']); j.riding = riding && m > .1;
  const sp = raid ? 235 : riding ? 470 : 250, R = 11;
  const free = (px, py) => !solid(px - R, py - R) && !solid(px + R, py - R) && !solid(px - R, py + R) && !solid(px + R, py + R);
  const nx = j.x + mx * sp * dt, ny = j.y + my * sp * dt;
  if(free(nx, j.y)) j.x = nx; if(free(j.x, ny)) j.y = ny;
  if(Math.abs(mx) > .1) j.face = mx > 0 ? 1 : -1; j.moving = m > .1; if(j.moving) j.step += dt * (riding ? 0 : 10);
  j.inv = Math.max(0, j.inv - dt);
  g.cam.x += (j.x - g.cam.x) * Math.min(1, dt * 7); g.cam.y += (j.y - g.cam.y) * Math.min(1, dt * 7);
  for(const c of g.traffic){ const seg = SK[c.s], L = Math.hypot(seg[1][0] - seg[0][0], seg[1][1] - seg[0][1]); c.t += c.v * dt * 1500 / L; if(c.t > 1 || c.t < 0){ c.v = -c.v; c.t = Math.max(0, Math.min(1, c.t)); } }
  // district label
  let dn = '', bd = 520; SITES.forEach((p, n) => { const d = Math.hypot(p[0] - j.x, p[1] - j.y); if(d < bd){ bd = d; dn = CASES[n].district; } });
  if(dn !== g.district){ g.district = dn; g.distT = dn ? 3 : 0; } g.distT = Math.max(0, g.distT - dt);
  // nearest thing to interact with
  let near = null, best = 78; if(!frozen) for(const it of interactables()){ const d = Math.hypot(it.x - j.x, it.y - j.y); if(d < best){ best = d; near = it; } }
  g.near = near; const want = frozen ? 'Continue' : near ? near.label : '';
  if(want !== g.actLabel){ g.actLabel = want; const a = $('#act'); a.hidden = !want; if(want) a.innerHTML = `<kbd>E</kbd>${esc(want)}`; }
  if(M) M.npcs.forEach(n => { if(n.amb) n.amb = Math.min(3, n.amb + dt); });
  if(raid) combat(dt);
  for(const p of g.fx){ p.x += p.vx * dt; p.y += p.vy * dt; p.t -= dt; } g.fx = g.fx.filter(p => p.t > 0);
  for(const p of g.pops){ p.y -= 30 * dt; p.t -= dt; } g.pops = g.pops.filter(p => p.t > 0);
}
function combat(dt){
  const g = G, j = g.jo, b = g.boss; if(!b) return;
  if(!b.dead){ g.spawn -= dt; if(g.spawn <= 0 && g.en.length < (b.shield > 0 ? 8 : 5)){ const kinds = g.M.c.enemies, e = kinds[Math.floor(Math.random() * kinds.length)], a = Math.random() * 6.28;
      g.en.push({kind:e.kind, name:e.name, shape:e.shape, tool:e.tool, x:b.x + Math.cos(a) * 70, y:b.y + Math.sin(a) * 70, hp:2, sp:42 + Math.random() * 26 + b.cleared * 1.5, ph:Math.random() * 6, hit:0}); g.spawn = b.shield > 0 ? Math.max(.6, 1.3 - b.cleared * .04) : 1.6; }
    b.pulse -= dt; if(b.pulse <= 0){ b.pulse = 6; b.ring = 1; sfx('boss'); }
    if(b.ring > 0){ b.ring += dt * 300; const d = Math.hypot(j.x - b.x, j.y - b.y); if(b.ring < 300 && Math.abs(d - b.ring) < 16 && j.inv <= 0) hurt(); if(b.ring > 300) b.ring = 0; } }
  b.hit = Math.max(0, b.hit - dt);
  for(const e of g.en){ const dx = j.x - e.x, dy = j.y - e.y, d = Math.hypot(dx, dy) || 1; e.x += dx / d * e.sp * dt + Math.cos(g.t * 3 + e.ph) * 20 * dt; e.y += dy / d * e.sp * dt; e.hit = Math.max(0, e.hit - dt);
    if(d < 26 && j.inv <= 0){ hurt(); e.x -= dx / d * 46; e.y -= dy / d * 46; } }
  g.fire -= dt;
  if(g.fire <= 0 && !b.dead && j.hp > 0){ let tgt = null, best = 430; for(const e of g.en){ const d = Math.hypot(e.x - j.x, e.y - j.y); if(d < best){ best = d; tgt = e; } }
    const bd = Math.hypot(b.x - j.x, b.y - j.y);
    if(bd < 560 && b.shield <= 0 && (!tgt || g.tools[g.tool].key === g.M.c.root.tool)) tgt = b;   // root-cause tool selected: aim at the boss
    if(!tgt && bd < 480) tgt = b;
    if(tgt){ const tl = g.tools[g.tool], a = Math.atan2(tgt.y - j.y, tgt.x - j.x); g.shots.push({x:j.x, y:j.y - 10, vx:Math.cos(a) * 540, vy:Math.sin(a) * 540, tool:tl, life:1}); g.fire = .3; } }
  for(const s of g.shots){ s.x += s.vx * dt; s.y += s.vy * dt; s.life -= dt;
    for(const e of g.en){ if(e.hp > 0 && Math.hypot(e.x - s.x, e.y - s.y) < 20){ s.life = 0; hitEnemy(e, s.tool); break; } }
    if(s.life > 0 && !b.dead && Math.hypot(b.x - s.x, b.y - s.y) < 56){ s.life = 0; hitBoss(s.tool); } }
  g.shots = g.shots.filter(s => s.life > 0); g.en = g.en.filter(e => e.hp > 0);
}
function burst(x0, y0, col, n = 12){ for(let k = 0; k < n; k++){ const a = Math.random() * 6.28, s = 60 + Math.random() * 180; G.fx.push({x:x0, y:y0, vx:Math.cos(a) * s, vy:Math.sin(a) * s, t:.5, col}); } }
function pop(x0, y0, text, col = '#fff'){ G.pops.push({x:x0, y:y0, text, col, t:1.1}); }
function hitEnemy(e, tl){
  const g = G;
  if(tl.decoy){ pop(e.x, e.y - 18, 'no effect', '#c9d1d9'); sfx('miss'); if(!g.decoyWarned){ g.decoyWarned = true; say([`${tl.name}: ${g.M.c.decoy.why}`]); } return; }
  if(tl.key !== e.tool){ pop(e.x, e.y - 18, 'resists', '#ffb3b3'); sfx('miss'); g.wrong[e.kind] = (g.wrong[e.kind] || 0) + 1; if(g.wrong[e.kind] === 2) say([`${e.name} gives way to ${TOOLS[e.tool].name}.`]); return; }
  e.hp--; e.hit = .12; sfx('hit');
  if(e.hp <= 0){ burst(e.x, e.y, TOOLS[e.tool].col); sfx('kill'); pop(e.x, e.y - 18, `${NICK[e.kind] || e.name} cleared`, TOOLS[e.tool].col);
    const b = g.boss; if(b.shield > 0){ b.cleared++; if(b.cleared >= 10){ b.shield = 0; sfx('shield'); say(['Shield down! Pick the treatment for the root cause. Jo aims at the boss while it is selected.']); } } hud(); }
}
function hitBoss(tl){
  const g = G, b = g.boss, c = g.M.c;
  if(b.shield > 0){ pop(b.x, b.y - 74, 'shielded: clear symptoms first', '#cfd8ff'); return; }
  if(tl.decoy || tl.key !== c.root.tool){ pop(b.x, b.y - 74, tl.decoy ? 'no effect' : 'only eases symptoms', '#ffb3b3'); sfx('miss'); if(++g.bossHint === 4) say([`The root cause responds to ${TOOLS[c.root.tool].name}.`]); return; }
  b.hp--; b.hit = .15; sfx('hit'); burst(b.x + (Math.random() - .5) * 60, b.y + (Math.random() - .5) * 40, TOOLS[tl.key].col, 6); hud();
  if(b.hp <= 0){ b.dead = true; sfx('win'); burst(b.x, b.y, '#ffe066', 70); g.en.forEach(e => { burst(e.x, e.y, '#ffffff', 6); e.hp = 0; }); g.en = []; win(); }
}
function hurt(){ const g = G, j = g.jo; if(j.hp <= 0) return; j.hp--; j.inv = 1.6; g.shake = .3; sfx('hurt'); hud();
  if(j.hp <= 0){ banner('BURNT OUT', 'Take a breath. The raid restarts.', '#ff6b7a', 2.4); g.en = []; g.shots = []; setTimeout(() => { if(G && G.M && G.M.step === 'raid') resetRaid(); }, 2300); } }
function win(){
  const g = G, M = g.M, c = M.c, clean = M.mistakes === 0, fit = g.jo.hp >= 3, stars = 1 + (clean ? 1 : 0) + (fit ? 1 : 0);
  const prev = SAVE.done[c.id] || 0; SAVE.done[c.id] = Math.max(prev, stars); persist();
  banner('CASE CLOSED', `${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}  ·  ${stars === 3 ? 'W. Clean run.' : 'Root cause gone, symptoms gone.'}`, '#ffd36e', 3.2);
  setTimeout(() => { if(!G) return; const ov = $('#ov'); G.paused = true; ov.hidden = false;
    ov.innerHTML = `<div class="panel debrief"><div class="stars3" aria-label="${stars} of 3 stars">${'★'.repeat(stars)}<span>${'★'.repeat(3 - stars)}</span></div><span class="kick">CASE FILE · ${esc(QUEST[c.id] || '')}</span><h2>${esc(c.title)}</h2>
    <p class="lead">${esc(c.simple)}</p>
    <div class="cols"><div><h3>From root cause to treatment</h3><ol class="chain">${c.flow.map((f, k) => `<li class="${k === 1 ? 'rootstep' : ''}">${esc(f)}</li>`).join('')}</ol></div>
    <div><h3>What worked</h3><ul class="worked">${c.enemies.map(e => `<li><b>${esc(e.name)}</b> → ${esc(TOOLS[e.tool].name)}</li>`).join('')}<li class="root"><b>Root cause</b> → ${esc(TOOLS[c.root.tool].name)}</li><li class="decoy"><b>The dud:</b> ${esc(c.decoy.name)}. ${esc(c.decoy.why)}</li></ul>
    <h3>Red flags to screen</h3><ul class="flags">${c.flags.map(f => `<li>${esc(f)}</li>`).join('')}</ul></div></div>
    <details><summary>Physiotherapy management (full)</summary><ul>${c.management.map(m => `<li>${esc(m)}</li>`).join('')}</ul></details>
    <details><summary>Read more</summary><ul class="refs">${c.refs.map(r => `<li>${esc(r)}</li>`).join('')}</ul></details>
    <p class="muted">Content adapted from the Learn Anywhere library (Learn Anywhere contributors, CC BY-NC-SA 4.0). Draft, pending clinical review. Educational only, not medical advice.</p>
    <p class="stars-why">${stars === 3 ? 'Perfect: no wasted tests, right referral, right hideout, and Jo stayed healthy.' : `For more stars: ${clean ? '' : 'no wrong tests, referrals or hideouts · '}${fit ? '' : 'finish with 3 or more energy'}`}</p>
    <div class="row"><button class="btn gold big" id="dNext" type="button">Back to the streets</button><a class="btn ghost" href="../#clinic">Spend rewards in Jo's Clinic</a></div></div>`;
    $('#dNext').onclick = () => { ov.hidden = true; ov.innerHTML = ''; G.paused = false; endMission(); if(!prev) toast(openCount() > 3 + Object.keys(SAVE.done).length - 1 && Object.keys(SAVE.done).length < 8 ? 'New district unlocked. Check the radar.' : 'Case skill earned.'); };
    $('#dNext').focus({preventScroll:true}); }, 3000);
}

/* ---------- draw ---------- */
function rr(x, a, b, w, h, r){ x.beginPath(); x.moveTo(a + r, b); x.arcTo(a + w, b, a + w, b + h, r); x.arcTo(a + w, b + h, a, b + h, r); x.arcTo(a, b + h, a, b, r); x.arcTo(a, b, a + w, b, r); x.closePath(); }
function wrap(x, text, maxW){ const out = []; let line = ''; for(const w of String(text).split(' ')){ const t = line ? line + ' ' + w : w; if(x.measureText(t).width > maxW && line){ out.push(line); line = w; } else line = t; } if(line) out.push(line); return out; }
function label(x, text, px, py, col, size, maxW){ x.font = `800 ${size || 13}px "Bricolage Grotesque",sans-serif`; x.textAlign = 'center'; const lines = maxW ? wrap(x, text, maxW) : [text]; x.lineWidth = 4; x.strokeStyle = 'rgba(8,6,24,.85)'; x.fillStyle = col || '#fff';
  lines.forEach((l, k) => { const yy = py - (lines.length - 1 - k) * ((size || 13) + 3); x.strokeText(l, px, yy); x.fillText(l, px, yy); }); }
function bubble(x, text, px, py, col){ x.font = '700 13px "Bricolage Grotesque",sans-serif'; const lines = wrap(x, text, 210), w = Math.max(...lines.map(l => x.measureText(l).width)) + 20, h = lines.length * 17 + 14;
  x.fillStyle = 'rgba(20,16,43,.94)'; x.strokeStyle = col || '#ffd36e'; x.lineWidth = 2; rr(x, px - w / 2, py - h, w, h, 10); x.fill(); x.stroke(); x.beginPath(); x.moveTo(px - 7, py); x.lineTo(px, py + 9); x.lineTo(px + 7, py); x.fillStyle = 'rgba(20,16,43,.94)'; x.fill();
  x.fillStyle = '#fff'; x.textAlign = 'center'; lines.forEach((l, k) => x.fillText(l, px, py - h + 22 + k * 17)); }
function person(x, px, py, shirt, t){ x.fillStyle = 'rgba(0,0,0,.3)'; x.beginPath(); x.ellipse(px, py + 16, 11, 4, 0, 0, 7); x.fill(); const bob = Math.sin(t * 3) * 1.5;
  x.fillStyle = '#3d4c6b'; x.fillRect(px - 6, py + 4, 5, 11); x.fillRect(px + 1, py + 4, 5, 11); x.fillStyle = shirt; rr(x, px - 9, py - 10 + bob, 18, 16, 4); x.fill(); x.fillStyle = '#e2b08a'; x.beginPath(); x.arc(px, py - 17 + bob, 8, 0, 7); x.fill(); x.fillStyle = '#2a1a22'; x.beginPath(); x.arc(px, py - 20 + bob, 8, Math.PI, 0); x.fill(); x.strokeStyle = '#1b1220'; x.lineWidth = 1.5; x.beginPath(); x.arc(px, py - 17 + bob, 8, 0, 7); x.stroke(); }
function draw(x){
  const g = G, j = g.jo, M = g.M, Z = g.Z * g.dpr, vw = g.W / g.Z, vh = g.H / g.Z;
  x.setTransform(1, 0, 0, 1, 0, 0); x.fillStyle = '#0a0720'; x.fillRect(0, 0, g.W * g.dpr, g.H * g.dpr);
  const sx = g.shake ? (Math.random() - .5) * 10 : 0, sy = g.shake ? (Math.random() - .5) * 10 : 0;
  const ox = g.cam.x - vw / 2 + sx, oy = g.cam.y - vh / 2 + sy;
  x.setTransform(Z, 0, 0, Z, -ox * Z, -oy * Z);
  // the body: glowing skin edge, then street surface
  x.save(); x.scale(S, S); bodyPath(x, 9, '#ff9f8026'); bodyPath(x, 2.4, '#e8907a'); bodyPath(x, 0, '#241b47'); x.restore();
  // nerve highways and vessel rivers
  x.lineCap = 'round'; x.strokeStyle = '#33295f'; x.lineWidth = 64; for(const [a, b] of SK){ x.beginPath(); x.moveTo(a[0], a[1]); x.lineTo(b[0], b[1]); x.stroke(); }
  x.strokeStyle = 'rgba(255,224,102,.55)'; x.lineWidth = 4; x.setLineDash([26, 22]); x.lineDashOffset = -g.t * 40; for(const [a, b] of SK){ x.beginPath(); x.moveTo(a[0], a[1]); x.lineTo(b[0], b[1]); x.stroke(); } x.setLineDash([]);
  // buildings (top-down with a little height)
  const i0 = Math.max(0, ox / CELL | 0), i1 = Math.min(COLS - 1, (ox + vw) / CELL | 0), j0 = Math.max(0, oy / CELL | 0), j1 = Math.min(ROWS - 1, (oy + vh + 40) / CELL | 0);
  for(let jj = j0; jj <= j1; jj++) for(let ii = i0; ii <= i1; ii++){ const b = BLD[jj * COLS + ii]; if(!b) continue; const bx = ii * CELL + B0, by = jj * CELL + B0;
    if(b.park){ x.fillStyle = '#1f5a4a'; rr(x, bx, by, BW, BW, 14); x.fill(); x.fillStyle = '#3ea77d'; for(let k = 0; k < 4; k++){ x.beginPath(); x.arc(bx + 26 + (k % 2) * 48, by + 26 + (k >> 1) * 48, 15, 0, 7); x.fill(); } continue; }
    x.fillStyle = 'rgba(0,0,0,.35)'; rr(x, bx + 8, by + 10, BW, BW, 8); x.fill();
    x.fillStyle = '#17112f'; rr(x, bx, by, BW, BW, 8); x.fill();
    x.fillStyle = b.col; rr(x, bx, by - b.h, BW, BW, 8); x.fill(); x.strokeStyle = 'rgba(255,255,255,.14)'; x.lineWidth = 2; rr(x, bx + 7, by - b.h + 7, BW - 14, BW - 14, 5); x.stroke();
    if(b.lit){ x.fillStyle = b.acc; x.globalAlpha = .75; x.fillRect(bx + 16, by - b.h + 18, 12, 12); x.fillRect(bx + 72, by - b.h + 66, 12, 12); x.globalAlpha = 1; }
    x.fillStyle = 'rgba(255,255,255,.1)'; x.fillRect(bx + 56, by - b.h + 20, 26, 16); }
  // traffic: red blood cells cruising the main streets
  for(const c of g.traffic){ const seg = SK[c.s], px = seg[0][0] + (seg[1][0] - seg[0][0]) * c.t + 18, py = seg[0][1] + (seg[1][1] - seg[0][1]) * c.t; if(px < ox - 30 || px > ox + vw + 30 || py < oy - 30 || py > oy + vh + 30) continue;
    x.fillStyle = '#d83a4a'; x.beginPath(); x.ellipse(px, py, 13, 10, 0, 0, 7); x.fill(); x.fillStyle = '#a3202f'; x.beginPath(); x.ellipse(px, py, 6, 4, 0, 0, 7); x.fill(); }
  // case markers / mission objects
  const pulse = 1 + Math.sin(g.t * 4) * .12;
  if(!M){ for(let i = 0; i < openCount(); i++){ const p = SITES[i], done = SAVE.done[CASES[i].id]; x.strokeStyle = done ? '#3ee0b0' : '#ffd36e'; x.lineWidth = 5; x.beginPath(); x.arc(p[0], p[1], 34 * pulse, 0, 7); x.stroke(); x.fillStyle = done ? 'rgba(62,224,176,.2)' : 'rgba(255,211,110,.2)'; x.fill();
      person(x, p[0], p[1], done ? '#3ee0b0' : '#ffd36e', g.t + i); label(x, done ? '★'.repeat(done) : '!', p[0], p[1] - 34, done ? '#3ee0b0' : '#ffd36e', 18);
      if(Math.hypot(p[0] - j.x, p[1] - j.y) < 420) label(x, `${QUEST[CASES[i].id]} · ${CASES[i].district}`, p[0], p[1] + 54, '#fff', 13); } }
  else {
    person(x, M.site[0], M.site[1], '#ffd36e', g.t); label(x, M.c.patient.name, M.site[0], M.site[1] + 34, '#ffd36e', 12);
    if(M.step === 'tests') M.tests.forEach(t => { x.fillStyle = t.done ? (t.right ? '#3ee0b0' : '#5b556f') : '#17c3b2'; rr(x, t.x - 22, t.y - 22, 44, 44, 10); x.fill(); x.strokeStyle = '#0a0720'; x.lineWidth = 3; x.stroke(); x.fillStyle = '#fff'; x.fillRect(t.x - 4, t.y - 13, 8, 26); x.fillRect(t.x - 13, t.y - 4, 26, 8);
      if(!t.done){ x.strokeStyle = '#17c3b2'; x.lineWidth = 3; x.beginPath(); x.arc(t.x, t.y, 36 * pulse, 0, 7); x.stroke(); } label(x, t.name + (t.done ? (t.right ? ' ✓ positive' : ' ✗ negative') : ''), t.x, t.y - 34, t.done ? (t.right ? '#3ee0b0' : '#a59fc0') : '#fff', 13, 180); });
    if(M.step === 'triage') M.npcs.forEach(n => { person(x, n.x, n.y, ['#ff8f6b', '#7fc3db', '#c9a0ff'][n.hue], g.t + n.hue);
      if(n.amb){ const ax = n.x + 260 - n.amb * 80; x.fillStyle = '#fff'; rr(x, ax - 30, n.y - 16, 60, 32, 6); x.fill(); x.fillStyle = '#e3342f'; x.fillRect(ax - 4, n.y - 10, 8, 20); x.fillRect(ax - 10, n.y - 4, 20, 8); x.fillStyle = Math.floor(g.t * 6) % 2 ? '#ff3b3b' : '#3b7bff'; x.fillRect(ax - 8, n.y - 22, 16, 6); }
      if(n.done) label(x, n.flag ? 'Referred' : 'Fits the condition', n.x, n.y - 34, n.flag ? '#3ee0b0' : '#a59fc0', 12);
      else if(Math.hypot(n.x - j.x, n.y - j.y) < 300) bubble(x, n.text, n.x, n.y - 36, '#ffd36e'); else label(x, '…', n.x, n.y - 30, '#ffd36e', 20); });
    if(M.step === 'hunt') M.dens.forEach(d => { x.fillStyle = d.tried ? '#3a3355' : '#7a1f4a'; rr(x, d.x - 34, d.y - 30, 68, 56, 10); x.fill(); x.strokeStyle = '#0a0720'; x.lineWidth = 3; x.stroke(); x.fillStyle = '#12091c'; rr(x, d.x - 11, d.y - 4, 22, 30, 5); x.fill();
      if(!d.tried){ x.fillStyle = '#ffe066'; x.fillRect(d.x - 26, d.y - 20, 10, 8); x.fillRect(d.x + 16, d.y - 20, 10, 8); x.strokeStyle = '#ff5d8f'; x.lineWidth = 3; x.beginPath(); x.arc(d.x, d.y, 50 * pulse, 0, 7); x.stroke(); }
      label(x, d.tried ? 'Empty' : d.name, d.x, d.y - 42, d.tried ? '#a59fc0' : '#fff', 13, 190); });
  }
  // boss + symptoms
  const b = g.boss;
  if(b && !b.dead){ x.save(); x.translate(b.x, b.y);
    x.strokeStyle = 'rgba(255,93,143,.5)'; x.lineWidth = 4; for(let k = 0; k < 8; k++){ const a = k / 8 * 6.28 + .3; x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(Math.cos(a) * 60, Math.sin(a) * 60 + 20, Math.cos(a) * 120 + Math.sin(g.t * 2 + k) * 10, Math.sin(a) * 110 + Math.sin(g.t + k) * 8); x.stroke(); }
    const pl = 1 + Math.sin(g.t * 4) * .04 + (b.hit ? .08 : 0); x.scale(pl, pl);
    const gr = x.createRadialGradient(0, 0, 10, 0, 0, 90); gr.addColorStop(0, b.shield > 0 ? 'rgba(160,140,255,.5)' : 'rgba(255,93,143,.6)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = gr; x.beginPath(); x.arc(0, 0, 90, 0, 7); x.fill();
    x.fillStyle = b.hit ? '#fff' : '#7a1f4a'; rr(x, -50, -40, 100, 76, 16); x.fill(); x.fillStyle = b.hit ? '#fff' : '#a32a63'; rr(x, -38, -56, 76, 28, 10); x.fill();
    x.fillStyle = '#ffe066'; for(let k = 0; k < 3; k++) x.fillRect(-33 + k * 26, -14, 14, 12); x.fillStyle = '#1b0f22'; rr(x, -12, 8, 24, 28, 6); x.fill(); x.fillStyle = '#ff5d8f'; x.beginPath(); x.arc(-17, -36, 6, 0, 7); x.arc(17, -36, 6, 0, 7); x.fill();
    if(b.shield > 0){ x.strokeStyle = `rgba(170,160,255,${.55 + Math.sin(g.t * 5) * .2})`; x.lineWidth = 5; x.beginPath(); x.arc(0, -6, 76, 0, 7); x.stroke(); }
    x.restore();
    if(b.ring > 0){ x.strokeStyle = `rgba(255,93,143,${Math.max(0, 1 - b.ring / 300)})`; x.lineWidth = 6; x.beginPath(); x.arc(b.x, b.y, b.ring, 0, 7); x.stroke(); }
    label(x, 'ROOT CAUSE', b.x, b.y + 60, '#ff9fbd', 12); }
  for(const e of g.en) drawEnemy(x, e);
  for(const sh of g.shots){ x.fillStyle = sh.tool.col; x.beginPath(); x.arc(sh.x, sh.y, 6, 0, 7); x.fill(); x.fillStyle = 'rgba(255,255,255,.7)'; x.beginPath(); x.arc(sh.x - 1.5, sh.y - 1.5, 2, 0, 7); x.fill(); }
  // Jo
  if(!(j.inv > 0 && Math.floor(g.t * 14) % 2) && j.hp > 0){ const frame = j.moving && !j.riding ? (Math.floor(j.step) % 2 ? 'b' : 'c') : 'a';
    x.save(); x.translate(j.x, j.y); x.fillStyle = 'rgba(0,0,0,.35)'; x.beginPath(); x.ellipse(0, 20, j.riding ? 22 : 14, 5, 0, 0, 7); x.fill(); x.scale(j.face, 1);
    if(j.riding){ x.fillStyle = '#1b1220'; x.beginPath(); x.arc(-15, 16, 7, 0, 7); x.arc(17, 16, 7, 0, 7); x.fill(); x.fillStyle = '#3ee0b0'; rr(x, -20, 4, 40, 9, 4); x.fill(); x.fillRect(14, -10, 4, 16); x.fillRect(10, -12, 12, 4); x.fillStyle = 'rgba(62,224,176,.5)'; x.fillRect(-44 - Math.random() * 10, 8, 22, 3); }
    x.imageSmoothingEnabled = false; x.drawImage(jo(SAVE.look, frame), -22, j.riding ? -40 : -34, 44, 53); x.restore();
    if(M && M.step === 'raid'){ x.strokeStyle = g.tools[g.tool].col; x.lineWidth = 3; x.beginPath(); x.arc(j.x, j.y + 20, 19, 0, 7); x.stroke(); } }
  for(const p of g.fx){ x.globalAlpha = Math.max(0, p.t * 2); x.fillStyle = p.col; x.fillRect(p.x - 2, p.y - 2, 4, 4); } x.globalAlpha = 1;
  for(const p of g.pops){ x.globalAlpha = Math.min(1, p.t * 2); label(x, p.text, p.x, p.y, p.col, 14); } x.globalAlpha = 1;

  /* ----- screen space ----- */
  x.setTransform(g.dpr, 0, 0, g.dpr, 0, 0);
  // waypoint arrow to the nearest goal
  const goals = M && M.step === 'raid' ? (b && !b.dead ? [b] : []) : interactables(); let goal = null, gd = 1e9; for(const it of goals){ if(!M && SAVE.done[CASES[it.i].id] && goals.some(q => !SAVE.done[CASES[q.i].id])) continue; const d = Math.hypot(it.x - j.x, it.y - j.y); if(d < gd){ gd = d; goal = it; } }
  if(goal){ const gx = (goal.x - ox) * g.Z, gy = (goal.y - oy) * g.Z, pad = 46;
    if(gx < pad || gy < pad + 40 || gx > g.W - pad || gy > g.H - pad - 60){ const cx = g.W / 2, cy = g.H / 2, a = Math.atan2(gy - cy, gx - cx), r = Math.min(g.W, g.H) / 2 - pad; const ax = cx + Math.cos(a) * r, ay = cy + Math.sin(a) * r;
      x.save(); x.translate(ax, ay); x.rotate(a); x.fillStyle = '#ffd36e'; x.strokeStyle = '#14102b'; x.lineWidth = 3; x.beginPath(); x.moveTo(16, 0); x.lineTo(-10, -11); x.lineTo(-4, 0); x.lineTo(-10, 11); x.closePath(); x.fill(); x.stroke(); x.restore();
      label(x, Math.round(gd / 10) + ' m', ax - Math.cos(a) * 30, ay - Math.sin(a) * 30 + 5, '#ffd36e', 12); } }
  // radar: the whole body
  const big = g.big, rh = big ? Math.min(g.H - 120, 620) : (g.W < 560 ? 132 : 190), rs = rh / MH, rw = MW * rs, rx = big ? (g.W - rw) / 2 : g.W - rw - 14, ry = big ? (g.H - rh) / 2 : 62;
  if(big){ x.fillStyle = 'rgba(8,6,24,.8)'; x.fillRect(0, 0, g.W, g.H); }
  x.fillStyle = 'rgba(20,16,43,.82)'; rr(x, rx - 8, ry - 8, rw + 16, rh + 16, 14); x.fill(); x.strokeStyle = 'rgba(255,255,255,.18)'; x.lineWidth = 1.5; x.stroke();
  x.save(); x.translate(rx, ry); x.scale(rs, rs); bodyPath(x, 0, '#4a3f86'); x.restore();
  const dot = (wx, wy, col, r) => { x.fillStyle = col; x.beginPath(); x.arc(rx + wx / S * rs, ry + wy / S * rs, r, 0, 7); x.fill(); };
  if(!M) for(let i = 0; i < CASES.length; i++){ const open = i < openCount(), done = SAVE.done[CASES[i].id]; dot(SITES[i][0], SITES[i][1], !open ? '#6a6390' : done ? '#3ee0b0' : '#ffd36e', big ? 7 : open ? 4 : 2.5); if(big) { x.textAlign = 'left'; x.font = '700 12px "Bricolage Grotesque",sans-serif'; x.fillStyle = open ? '#fff' : '#8c85b0'; x.fillText(open ? CASES[i].district : 'Locked', rx + SITES[i][0] / S * rs + 11, ry + SITES[i][1] / S * rs + 4); } }
  else { dot(M.site[0], M.site[1], '#ffd36e', 3); goals.forEach(it => dot(it.x, it.y, M.step === 'raid' ? '#ff5d8f' : '#17c3b2', big ? 6 : 3.5)); }
  dot(j.x, j.y, '#fff', big ? 6 : 4); x.strokeStyle = '#fff'; x.lineWidth = 1.5; x.beginPath(); x.arc(rx + j.x / S * rs, ry + j.y / S * rs, (big ? 10 : 7) + Math.sin(g.t * 5) * 1.5, 0, 7); x.stroke();
  if(big) label(x, 'BODY CITY · press M or tap MAP to close', g.W / 2, ry + rh + 34, '#b9b0dd', 13);
  // district name, GTA style
  if(g.distT > 0 && !big){ x.globalAlpha = Math.min(1, g.distT); x.font = `800 ${g.W < 560 ? 22 : 30}px Unbounded,sans-serif`; x.textAlign = 'right'; x.lineWidth = 5; x.strokeStyle = 'rgba(8,6,24,.8)'; x.fillStyle = '#fff'; const ty = g.H - (g.W < 560 ? 170 : 96); x.strokeText(g.district, g.W - 20, ty); x.fillText(g.district, g.W - 20, ty); x.globalAlpha = 1; }
  if(g.banner){ const bn = g.banner, a = Math.min(1, bn.t * 2, (bn.T - bn.t) * 4); x.globalAlpha = Math.max(0, a); x.fillStyle = 'rgba(8,6,24,.55)'; x.fillRect(0, g.H * .32, g.W, g.H * .22);
    x.textAlign = 'center'; x.font = `900 ${Math.min(64, g.W / 9)}px Unbounded,sans-serif`; x.lineWidth = 8; x.strokeStyle = '#14102b'; x.fillStyle = bn.col; x.strokeText(bn.text, g.W / 2, g.H * .44); x.fillText(bn.text, g.W / 2, g.H * .44);
    x.font = '700 16px "Bricolage Grotesque",sans-serif'; x.fillStyle = '#fff'; wrap(x, bn.sub || '', g.W - 40).slice(0, 2).forEach((l, k) => x.fillText(l, g.W / 2, g.H * .44 + 34 + k * 20)); x.globalAlpha = 1; }
}
function drawEnemy(x, e){
  const col = ECOL[e.kind] || '#fff'; x.save(); x.translate(e.x, e.y); const t = G.t + e.ph; x.fillStyle = e.hit ? '#fff' : col; x.strokeStyle = 'rgba(0,0,0,.5)'; x.lineWidth = 2;
  switch(e.shape){
    case 'spike': x.beginPath(); for(let k = 0; k < 16; k++){ const a = k / 16 * 6.28 + t, r = k % 2 ? 9 : 19; x.lineTo(Math.cos(a) * r, Math.sin(a) * r); } x.closePath(); x.fill(); x.stroke(); break;
    case 'blob': x.beginPath(); for(let k = 0; k <= 20; k++){ const a = k / 20 * 6.28, r = 16 + Math.sin(a * 3 + t * 3) * 3; x.lineTo(Math.cos(a) * r, Math.sin(a) * r); } x.fill(); x.stroke(); break;
    case 'block': x.rotate(Math.sin(t) * .1); rr(x, -15, -15, 30, 30, 4); x.fill(); x.stroke(); x.strokeStyle = 'rgba(0,0,0,.35)'; x.beginPath(); x.moveTo(-15, -5); x.lineTo(15, -5); x.moveTo(-15, 5); x.lineTo(15, 5); x.stroke(); break;
    case 'zap': x.beginPath(); x.moveTo(-6, -18); x.lineTo(8, -4); x.lineTo(0, -2); x.lineTo(8, 18); x.lineTo(-8, 2); x.lineTo(0, 0); x.closePath(); x.fill(); x.stroke(); break;
    case 'ghost': x.globalAlpha = .85; x.beginPath(); x.arc(0, -4, 14, Math.PI, 0); x.lineTo(14, 14); for(let k = 0; k < 4; k++) x.lineTo(14 - (k + .5) * 7, 10 + (k % 2) * 6); x.lineTo(-14, 14); x.closePath(); x.fill(); x.stroke(); break;
    case 'eye': x.beginPath(); x.ellipse(0, 0, 19, 12, 0, 0, 7); x.fill(); x.stroke(); x.fillStyle = '#1b0f22'; x.beginPath(); x.arc(Math.sin(t * 2) * 4, 0, 6, 0, 7); x.fill(); break;
    case 'gear': x.rotate(t * 2); x.beginPath(); for(let k = 0; k < 12; k++){ const a = k / 12 * 6.28, r = k % 2 ? 12 : 18; x.lineTo(Math.cos(a) * r, Math.sin(a) * r); } x.closePath(); x.fill(); x.stroke(); x.fillStyle = '#1b0f22'; x.beginPath(); x.arc(0, 0, 5, 0, 7); x.fill(); break;
    case 'moon': x.beginPath(); x.arc(0, 0, 16, 0, 7); x.fill(); x.stroke(); x.fillStyle = '#1b1636'; x.beginPath(); x.arc(7, -5, 13, 0, 7); x.fill(); break;
    case 'wobble': x.rotate(Math.sin(t * 6) * .4); x.beginPath(); x.moveTo(0, -18); x.lineTo(16, 12); x.lineTo(-16, 12); x.closePath(); x.fill(); x.stroke(); break;
    case 'knot': x.lineWidth = 6; x.strokeStyle = e.hit ? '#fff' : col; x.beginPath(); for(let k = 0; k <= 30; k++){ const a = k / 30 * 6.28 * 2; x.lineTo(Math.cos(a) * (10 + Math.sin(a * 1.5) * 5), Math.sin(a) * (10 + Math.sin(a * 1.5) * 5)); } x.stroke(); break;
    default: rr(x, -14, -10, 28, 24, 5); x.fill(); x.stroke(); x.fillStyle = 'rgba(0,0,0,.4)'; x.font = '800 10px sans-serif'; x.textAlign = 'center'; x.fillText('KG', 0, 6);
  }
  x.restore(); label(x, `${NICK[e.kind] || e.name} · ${e.name}`, e.x, e.y + 34, '#fff', 11);
}

// automated test hook (only with ?test in the URL)
if(/[?&]test\b/.test(location.search)){ window.__rcTest = () => G && {step:G.M ? G.M.step : 'roam', dlg:G.dlg.length && G.hold, paused:G.paused, tools:G.tools.map(t => t.key), tool:G.tool, root:G.M ? G.M.c.root.tool : null, shield:G.boss ? G.boss.shield : null, boss:G.boss ? {x:G.boss.x, y:G.boss.y} : null,
    jo:{x:G.jo.x, y:G.jo.y, hp:G.jo.hp}, en:G.en.map(e => ({x:e.x, y:e.y, tool:e.tool})), targets:interactables().map(t => ({x:t.x, y:t.y, kind:t.kind, right:t.right, i:t.i}))};
  window.__rcTest.tp = (px, py) => { if(G){ G.jo.x = px; G.jo.y = py; } }; }
title();
})();
