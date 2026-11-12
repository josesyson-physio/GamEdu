/* Liftoff Lab: a Gamified Edu rocket science game.
   Blow a rocket apart, learn every part, name it, match its job, stack it back and launch a satellite. */
'use strict';
(function(){
if(window.top !== window.self){ document.body.textContent = 'Open Liftoff Lab in its own tab.'; throw new Error('framed'); }
const $ = s => document.querySelector(s), app = $('#app');
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const shuffle = a => { a = a.slice(); for(let i = a.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const KEY = 'rocket-lab';

/* ---------- the rocket: 13 parts, top to bottom ---------- */
const PARTS = [
  {id:'nose', name:'Nose cone', ix:0, side:'L', stage:'top',
   info:'The pointed, smooth tip. It pushes air aside so the rocket faces less drag (air resistance) on the way up.',
   job:'I cut through the air so there is less drag.', fact:'Fast through thick air, the nose heats up from the air being squeezed in front of it.'},
  {id:'fairing', name:'Payload fairing', ix:1, side:'R', stage:'top',
   info:'A shell made of two halves. It shields the satellite from air pressure and heat in the atmosphere, then splits open and falls away once the air is thin, to save weight.',
   job:'I protect the satellite through the atmosphere, then split open and fall away.', fact:'Some launch companies catch fairing halves and fly them again.'},
  {id:'payload', name:'Payload', ix:1, side:'L', stage:'pay',
   info:'The reason for the whole launch: a satellite, a space probe or a crew capsule. Everything below it exists to carry it to space.',
   job:'I am the reason for the whole launch.', fact:'Most of a rocket’s launch weight is propellant. The payload is only a few percent.'},
  {id:'avionics', name:'Avionics & guidance', ix:2, side:'R', stage:'s2',
   info:'The rocket’s brain: computers, gyroscopes and sensors that know where the rocket is and which way it points, and send steering commands to the engines.',
   job:'I am the brain that knows where we are pointing and steers.', fact:'Gyroscopes sense tiny turns, so the computer can correct the path many times a second.'},
  {id:'s2tank', name:'Upper stage tanks', ix:3, side:'L', stage:'s2',
   info:'Fuel and oxidizer for the second stage. This stage takes over high up, where the air is thin, and pushes the payload the rest of the way to orbit.',
   job:'I carry propellant for the second stage, high above the clouds.', fact:'Dropping empty weight in stages is why rockets can reach orbit at all.'},
  {id:'s2engine', name:'Upper stage engine', ix:4, side:'R', stage:'s2',
   info:'A smaller engine built for near-vacuum. It fires after the first stage has dropped away.',
   job:'I fire high up, after the first stage drops away.', fact:'India’s PSLV has four stages, alternating solid and liquid propellant.'},
  {id:'interstage', name:'Interstage', ix:5, side:'L', stage:'s1',
   info:'The connecting ring between the two stages. It holds the separation system that releases the empty first stage.',
   job:'I join the two stages and release the empty first stage.', fact:'Separation often uses springs or small pushers so the stages do not bump.'},
  {id:'lox', name:'Oxidizer tank', ix:6, side:'R', stage:'s1',
   info:'Holds liquid oxygen. Fire needs oxygen, and there is no air in space, so a rocket carries its own.',
   job:'I hold the oxygen, because space has no air for burning.', fact:'Liquid oxygen is stored at about −183 °C.'},
  {id:'fuel', name:'Fuel tank', ix:7, side:'L', stage:'s1',
   info:'Holds the fuel, such as refined kerosene or liquid hydrogen, that burns with the oxygen.',
   job:'I hold what burns with the oxygen.', fact:'Fuel and oxidizer together are called propellant.'},
  {id:'fins', name:'Fins', ix:7, side:'R', stage:'s1',
   info:'Help keep the rocket flying straight in the lower atmosphere, like the feathers on an arrow. Many large rockets steer mostly by tilting their engines instead.',
   job:'I keep the rocket flying straight, like the feathers on an arrow.', fact:'Model rockets rely completely on fins to fly straight.'},
  {id:'turbopump', name:'Turbopump', ix:8, side:'L', stage:'s1',
   info:'A powerful pump that forces fuel and oxidizer into the engine at very high pressure, fast enough to feed the fire.',
   job:'I force fuel and oxygen into the engine at huge pressure.', fact:'A turbopump is spun by a small turbine driven by hot gas.'},
  {id:'chamber', name:'Combustion chamber', ix:9, side:'R', stage:'s1',
   info:'Where fuel and oxidizer meet and burn, making extremely hot, high-pressure gas.',
   job:'I am where fuel and oxygen burn into super-hot gas.', fact:'The chamber walls are often cooled by flowing cold fuel around them.'},
  {id:'nozzle', name:'Nozzle', ix:10, side:'L', stage:'s1',
   info:'The bell-shaped exit. It speeds the hot gas out of the bottom: gas shoots down, so the rocket goes up. That is Newton’s third law.',
   job:'I shoot the hot gas out downwards, so the rocket goes up.', fact:'Engines can tilt (gimbal) so the push steers the rocket.'}
];
const P = Object.fromEntries(PARTS.map(p => [p.id, p]));
const STROKE = 'stroke="#0b1230" stroke-width="2.5" stroke-linejoin="round"';
const ART = {
  nose:`<path d="M168 92 C168 52 190 26 210 17 C230 26 252 52 252 92 Z" fill="url(#gBody)" ${STROKE}/><path d="M197 28 C202 23 206 19 210 17 C214 19 218 23 223 28 Z" fill="#ff5a3d" ${STROKE}/><rect x="168" y="84" width="84" height="8" fill="#ffc94d" ${STROKE}/>`,
  fairing:`<g class="fl"><path d="M168 92 H210 V204 H168 Z" fill="url(#gBody)" ${STROKE}/><rect x="176" y="120" width="10" height="60" rx="3" fill="#2f6fd6"/></g><g class="fr"><path d="M210 92 H252 V204 H210 Z" fill="url(#gBody)" ${STROKE}/><rect x="234" y="120" width="10" height="60" rx="3" fill="#ff5a3d"/></g>`,
  payload:`<g class="sat"><line x1="210" y1="104" x2="210" y2="118" stroke="#cfd8ea" stroke-width="3"/><circle cx="210" cy="104" r="7" fill="#e7ecf7" ${STROKE}/><g class="pl"><rect x="176" y="120" width="14" height="60" fill="#2f6fd6" ${STROKE}/><path d="M176 140 H190 M176 160 H190" stroke="#9cc1ff" stroke-width="1.5"/></g><g class="pr"><rect x="230" y="120" width="14" height="60" fill="#2f6fd6" ${STROKE}/><path d="M230 140 H244 M230 160 H244" stroke="#9cc1ff" stroke-width="1.5"/></g><rect x="190" y="118" width="40" height="64" rx="4" fill="#e8b54a" ${STROKE}/><path d="M190 140 H230 M190 160 H230 M210 118 V182" stroke="#b9842a" stroke-width="1.5"/></g>`,
  avionics:`<rect x="168" y="204" width="84" height="26" fill="#2b3350" ${STROKE}/><circle cx="182" cy="217" r="3.5" fill="#3ee0b0"/><circle cx="194" cy="217" r="3.5" fill="#ffc94d"/><circle cx="206" cy="217" r="3.5" fill="#ff6b7a"/><rect x="216" y="211" width="28" height="12" rx="2" fill="#6fc3ff" opacity=".85"/>`,
  s2tank:`<rect x="168" y="230" width="84" height="106" fill="url(#gBody)" ${STROKE}/><rect x="168" y="240" width="84" height="6" fill="#c8d2e8"/><text x="210" y="293" text-anchor="middle" font-family="Unbounded,sans-serif" font-weight="900" font-size="26" fill="#2f6fd6">2</text>`,
  s2engine:`<rect x="197" y="336" width="26" height="12" fill="#3a4255" ${STROKE}/><rect x="200" y="348" width="20" height="12" fill="url(#gCopper)" ${STROKE}/><path d="M201 360 H219 L234 384 H186 Z" fill="url(#gDark)" ${STROKE}/>`,
  interstage:`<rect x="168" y="336" width="84" height="50" fill="#1d2233" ${STROKE}/><path d="M176 336 V386 M188 336 V386 M200 336 V386 M212 336 V386 M224 336 V386 M236 336 V386" stroke="#2c3349" stroke-width="3"/>`,
  lox:`<rect x="168" y="386" width="84" height="140" fill="url(#gBody)" ${STROKE}/><rect x="168" y="440" width="84" height="26" fill="#2f6fd6"/><text x="210" y="459" text-anchor="middle" font-family="Unbounded,sans-serif" font-weight="800" font-size="14" fill="#fff">LOX</text>`,
  fuel:`<rect x="168" y="526" width="84" height="120" fill="url(#gBody)" ${STROKE}/><rect x="168" y="560" width="84" height="26" fill="#ff9f2e"/><text x="210" y="579" text-anchor="middle" font-family="Unbounded,sans-serif" font-weight="800" font-size="13" fill="#2a1400">FUEL</text><text x="210" y="622" text-anchor="middle" font-family="Unbounded,sans-serif" font-weight="900" font-size="22" fill="#ff5a3d">1</text>`,
  fins:`<g class="fnl"><path d="M168 584 L126 668 L126 692 L168 668 Z" fill="#ff5a3d" ${STROKE}/></g><g class="fnr"><path d="M252 584 L294 668 L294 692 L252 668 Z" fill="#ff5a3d" ${STROKE}/></g>`,
  turbopump:`<rect x="176" y="646" width="68" height="30" fill="#3a4255" ${STROKE}/><circle cx="192" cy="661" r="9" fill="#8d97b3" ${STROKE}/><circle cx="228" cy="661" r="9" fill="#8d97b3" ${STROKE}/><path d="M201 661 H219" stroke="#ffc94d" stroke-width="4"/>`,
  chamber:`<rect x="188" y="676" width="44" height="28" rx="6" fill="url(#gCopper)" ${STROKE}/>`,
  nozzle:`<path d="M192 704 H228 C232 738 248 770 262 792 H158 C172 770 188 738 192 704 Z" fill="url(#gDark)" ${STROKE}/><path d="M186 744 H234 M172 772 H248" stroke="#59627c" stroke-width="2"/>`
};
const BOX = {nose:[168,17,252,92], fairing:[168,92,252,204], payload:[176,100,244,184], avionics:[168,204,252,230], s2tank:[168,230,252,336], s2engine:[186,336,234,384], interstage:[168,336,252,386],
  lox:[168,386,252,526], fuel:[168,526,252,646], fins:[126,584,294,692], turbopump:[176,646,244,676], chamber:[188,676,232,704], nozzle:[158,704,262,792]};
const DRAW_ORDER = ['payload','fairing','nose','avionics','s2tank','s2engine','interstage','lox','fuel','fins','turbopump','chamber','nozzle'];
const VW = 420, VH = 1112, GAP = 30, ASM = 150;
const defs = `<defs>
  <linearGradient id="gBody" x1="0" x2="1"><stop offset="0" stop-color="#c3cde3"/><stop offset=".45" stop-color="#ffffff"/><stop offset="1" stop-color="#9fabc7"/></linearGradient>
  <linearGradient id="gDark" x1="0" x2="1"><stop offset="0" stop-color="#2a3142"/><stop offset=".5" stop-color="#5b6680"/><stop offset="1" stop-color="#232838"/></linearGradient>
  <linearGradient id="gCopper" x1="0" x2="1"><stop offset="0" stop-color="#8a4526"/><stop offset=".5" stop-color="#e39a5f"/><stop offset="1" stop-color="#7a3a1f"/></linearGradient>
  <linearGradient id="gFlame" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff6c2"/><stop offset=".35" stop-color="#ffc94d"/><stop offset=".75" stop-color="#ff6a3d"/><stop offset="1" stop-color="#ff6a3d" stop-opacity="0"/></linearGradient>
  <linearGradient id="gSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b8de0"/><stop offset="1" stop-color="#a9dcff"/></linearGradient>
  <radialGradient id="gEarth" cx=".5" cy=".5" r=".5"><stop offset=".86" stop-color="#2f7fd6"/><stop offset=".96" stop-color="#6fc3ff"/><stop offset="1" stop-color="#6fc3ff" stop-opacity="0"/></radialGradient>
</defs>`;
function wrapLabel(s){ const out = []; let line = ''; for(const w of s.split(' ')){ const t = line ? line + ' ' + w : w; if(t.length > 11 && line){ out.push(line); line = w; } else line = t; } if(line) out.push(line); return out; }

/* ---------- save ---------- */
const MODES = [
  {id:'explore', n:'01', name:'Explode It', desc:'Blow the rocket apart and tap every part to learn what it is.'},
  {id:'name', n:'02', name:'Name Drop', desc:'Every part lost its name tag. Put them back. Fewer misses, more stars.'},
  {id:'job', n:'03', name:'What’s Its Job?', desc:'A part tells you what it does. Find who said it.'},
  {id:'stack', n:'04', name:'Stack & Send', desc:'Build it from the bottom up, then launch a satellite to orbit.'},
  {id:'puzzle', n:'05', open:1, name:'Flight Puzzle', sub:'How a flight works', desc:'Put a launch in the right order, from ignition to orbit. Then sort rocket truths from myths.'},
  {id:'thrust', n:'06', adv:1, name:'Thrust Tuner', sub:'The rocket equation', desc:'Design a rocket light enough and strong enough to reach orbit. Fuel, engines, staging: your call.'},
  {id:'count', n:'07', adv:1, name:'Countdown Crew', sub:'Go or no-go', desc:'You are the launch director. Read the data, catch the one thing that is wrong, and call the hold.'},
  {id:'orbit', n:'08', adv:1, name:'Orbit Desk', sub:'The right orbit for the job', desc:'Weather, crops, village internet, the Moon. Send each satellite to the orbit that fits its job.'}
];
let SAVE = {v:1, done:{}, best:{}};
try{ const s = JSON.parse(localStorage.getItem(KEY)); if(s && typeof s === 'object' && s.done && typeof s.done === 'object'){
  for(const m of MODES){ const v = Math.floor(+s.done[m.id]); if(v >= 1) SAVE.done[m.id] = Math.min(3, v); const b = +((s.best || {})[m.id]); if(b > 0 && b < 36000) SAVE.best[m.id] = Math.round(b); } } }catch(e){}
const persist = () => { try{ localStorage.setItem(KEY, JSON.stringify(SAVE)); }catch(e){} };
const unlocked = i => MODES[i].adv || MODES[i].open ? !!SAVE.done.explore : i === 0 || !!SAVE.done[MODES[i - 1].id];

/* ---------- sound ---------- */
let AC = null;
function ac(){ AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if(AC.state === 'suspended') AC.resume(); return AC; }
function sfx(kind){ try{ const a = ac();
  if(kind === 'boom' || kind === 'rumble'){ const len = kind === 'boom' ? .7 : 4.5, buf = a.createBuffer(1, a.sampleRate * len, a.sampleRate), d = buf.getChannelData(0); for(let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, kind === 'boom' ? 2 : .6);
    const s = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain(); f.type = 'lowpass'; f.frequency.value = kind === 'boom' ? 700 : 380; g.gain.value = kind === 'boom' ? .5 : .35; s.buffer = buf; s.connect(f); f.connect(g); g.connect(a.destination); s.start(); return; }
  const N = {ok:[660, 880], no:[240, 190], tap:[720], win:[523, 659, 784, 1046], tick:[880], go:[440, 660, 990], pop:[990, 1320]}[kind] || [500];
  N.forEach((fq, i) => { const o = a.createOscillator(), g = a.createGain(), t = a.currentTime + i * .08; o.type = kind === 'no' ? 'sawtooth' : 'triangle'; o.frequency.value = fq;
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.1, t + .012); g.gain.exponentialRampToValueAtTime(.0001, t + .2); o.connect(g); g.connect(a.destination); o.start(t); o.stop(t + .25); });
}catch(e){} }
let toastT = 0;
function toast(m){ const t = $('#toast'); t.textContent = m; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => t.hidden = true, 2600); }
const stars = n => `${'★'.repeat(n)}<i>${'★'.repeat(3 - n)}</i>`;

/* ================= SCREENS ================= */
function rocketMarkup(cls){ return DRAW_ORDER.map(id => `<g class="${cls}" data-id="${id}">${ART[id]}</g>`).join(''); }
function title(){
  stopAnim();
  const done = Object.keys(SAVE.done).length;
  app.innerHTML = `<section class="title"><div class="stars"></div>
    <div class="tcopy"><span class="kick">Gamified Edu · Basics of Rocket Science</span><h1><span>LIFTOFF</span><span>LAB</span></h1>
      <p class="pitch">Blow a rocket into pieces, learn what every part does, then stack it back and send a satellite to orbit. Then fly it like an engineer: tune thrust, run the countdown, pick the orbit. 13 parts. 8 missions.</p>
      <div class="row"><button class="btn gold big" id="go" type="button">${done ? 'Continue' : 'Start the countdown'}</button><a class="btn ghost" href="../#cat-rocket">Back to Gamified Edu</a></div></div>
    <div class="tart"><svg viewBox="110 0 200 800" aria-hidden="true">${defs}${rocketMarkup('t')}</svg></div></section>`;
  $('#go').onclick = () => { sfx('tap'); modes(); };
}
function modes(){
  stopAnim();
  const total = MODES.reduce((a, m) => a + (SAVE.done[m.id] || 0), 0);
  const card = (m, i) => { const op = unlocked(i), st = SAVE.done[m.id] || 0;
    return `<button class="mode ${m.adv ? 'adv' : ''}" type="button" data-i="${i}" ${op ? '' : 'disabled'}><span class="top"><span class="n">${m.n}</span>${op ? `<span class="st" aria-label="${st} of 3 stars">${stars(st)}</span>` : `<span class="lock">🔒 ${m.adv || m.open ? 'Clear Explode It' : 'Clear the last one'}</span>`}</span><h3>${esc(m.name)}</h3><p>${esc(m.desc)}</p></button>`; };
  app.innerHTML = `<header class="bar"><button class="ib" id="back" type="button" aria-label="Title">←</button><div><b>Liftoff Lab</b><small>Rocket science, one part at a time</small></div><a class="ib" href="../#cat-rocket">GE</a></header>
  <section class="modes"><div class="progress"><b>${total}/${MODES.length * 3} ★</b><span class="muted">Every star earns sparks and XP in Gamified Edu.</span></div>
  <div class="tier"><span class="kick">Flight school</span><h2>Know your rocket</h2><p class="muted">Clear each mission to unlock the next.</p></div>
  <div class="mgrid">${MODES.map((m, i) => m.adv ? '' : card(m, i)).join('')}</div>
  <div class="tier"><span class="kick">Mission control · Advanced</span><h2>Fly it like an engineer</h2><p class="muted">Real physics and real launch decisions. Opens after Explode It.</p></div>
  <div class="mgrid">${MODES.map((m, i) => m.adv ? card(m, i) : '').join('')}</div></section>`;
  $('#back').onclick = title;
  app.querySelectorAll('.mode:not(:disabled)').forEach(b => b.onclick = () => { sfx('tap'); play(MODES[+b.dataset.i].id); });
}

/* ================= PLAY ================= */
let S = null, raf = 0;
function stopAnim(){ cancelAnimationFrame(raf); raf = 0; if(S && S.timers) S.timers.forEach(clearTimeout); S = null; }
function play(mode){
  stopAnim();
  const m = MODES.find(x => x.id === mode);
  if(m.adv || m.open) return advPlay(mode);
  app.innerHTML = `<header class="bar"><button class="ib" id="back" type="button" aria-label="Missions">←</button><div><b>${esc(m.name)}</b><small id="sub"></small></div><div class="hudstat" id="hud"></div></header>
    <section class="play"><div class="stage" id="stage"><svg id="sv" viewBox="-22 0 ${VW + 44} ${VH}" preserveAspectRatio="xMidYMid meet" role="group" aria-label="Rocket">${defs}
      <g id="world"></g><g id="rk">${DRAW_ORDER.map(id => `<g class="prt" data-id="${id}" tabindex="0" role="button" aria-label="${esc(P[id].name)}"><g class="mv">${ART[id]}</g></g>`).join('')}</g><g id="fx"></g><g id="lbls"></g></svg></div>
    <aside class="panel" id="panel"></aside></section><div class="overlay" id="ov" hidden></div>`;
  $('#back').onclick = modes;
  S = {mode, t:0, target:0, visited:new Set(), placed:new Set(), sel:null, selPart:null, miss:0, start:performance.now(), timers:[], round:0, rounds:[], perChip:{}, launch:null};
  app.querySelectorAll('.prt').forEach(g => { const go = () => tapPart(g.dataset.id); g.addEventListener('click', go); g.addEventListener('keydown', e => { if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); go(); } }); });
  $('#stage').classList.add('fit'); loop();
  ({explore:startExplore, name:startName, job:startJob, stack:startStack})[mode]();
}
/* position of each part: assembled (t=0) or exploded (t=1) */
function placeParts(){
  const t = S.t;
  for(const p of PARTS){ const g = app.querySelector(`.prt[data-id="${p.id}"]`); if(!g) continue;
    const dy = ASM + (10 + p.ix * GAP - ASM) * t; let extra = '';
    const L = S.launch ? S.launch.off[p.id] : null;
    g.setAttribute('transform', `translate(${L ? L.x : 0},${dy + (L ? L.y : 0)})${L && L.r ? ` rotate(${L.r} 210 ${(BOX[p.id][1] + BOX[p.id][3]) / 2})` : ''}`);
    if(p.id === 'fairing'){ const s = 40 * t + (L ? L.split : 0); g.querySelector('.fl').setAttribute('transform', `translate(${-s},0)${L && L.split ? ` rotate(${-L.split / 3} 189 148)` : ''}`); g.querySelector('.fr').setAttribute('transform', `translate(${s},0)${L && L.split ? ` rotate(${L.split / 3} 231 148)` : ''}`); }
    if(p.id === 'fins'){ const s = 18 * t; g.querySelector('.fnl').setAttribute('transform', `translate(${-s},0)`); g.querySelector('.fnr').setAttribute('transform', `translate(${s},0)`); }
    if(p.id === 'payload' && L && L.unfold){ const u = L.unfold; g.querySelector('.pl').setAttribute('transform', `translate(${190 - 190 * (1 + u * 2.4) + 0},0) scale(${1 + u * 2.4},1)`); g.querySelector('.pr').setAttribute('transform', `translate(${230 - 230 * (1 + u * 2.4)},0) scale(${1 + u * 2.4},1)`); }
  }
  drawLabels();
}
const ease = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
function loop(){
  let last = performance.now();
  const step = now => { if(!S) return; const dt = Math.min(.05, (now - last) / 1000); last = now;
    if(S.t !== S.target){ S.tt = Math.min(1, (S.tt || 0) + dt / .9); const a = S.from + (S.target - S.from) * ease(S.tt); S.t = S.tt >= 1 ? S.target : a; placeParts(); }
    if(S.launch) launchStep(dt);
    if(S.mode !== 'explore' && !S.finished){ const hh = hudHtml(); if(hh !== S.lastHud){ S.lastHud = hh; const h = $('#hud'); if(h) h.innerHTML = hh; } }
    raf = requestAnimationFrame(step); };
  raf = requestAnimationFrame(step);
}
function hudHtml(){ const sec = Math.floor((performance.now() - S.start) / 1000); return `<span>⏱ ${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}</span><span>✖ ${S.miss}</span>`; }
function explode(to){ S.from = S.t; S.target = to; S.tt = 0; const st = $('#stage'); if(st) st.classList.toggle('fit', to === 0); if(to === 1){ sfx('boom'); burst(210, ASM + 400, 26); } }
/* labels beside exploded parts */
function partCenterY(id){ const b = BOX[id], p = P[id], dy = ASM + (10 + p.ix * GAP - ASM) * S.t; return (b[1] + b[3]) / 2 + dy; }
function drawLabels(){
  const L = $('#lbls'); if(!L) return;
  if(S.t < .85 || S.hideLabels){ L.innerHTML = ''; return; }
  L.innerHTML = PARTS.map(p => {
    const known = S.mode === 'explore' || S.mode === 'job' || S.placed.has(p.id);
    const text = known ? wrapLabel(p.name) : ['?'];
    const y = partCenterY(p.id) + (p.id === 'fins' ? 34 : p.id === 'payload' ? -10 : 0), lines = text.length, h = lines * 20 + 12, w = known ? 118 : 40;
    const left = p.side === 'L', bx = left ? 106 - w : 314, edge = p.id === 'fins' ? (left ? 108 : 312) : p.id === 'fairing' ? (left ? 128 : 292) : left ? Math.max(BOX[p.id][0], 160) : Math.min(BOX[p.id][2], 260);
    const cls = ['lbl', S.placed.has(p.id) && S.mode === 'name' ? 'ok' : '', S.visited.has(p.id) && S.mode === 'explore' ? 'ok' : '', S.selPart === p.id ? 'on' : ''].join(' ');
    return `<g class="${cls}" data-id="${p.id}" style="cursor:pointer"><line x1="${left ? bx + w : bx}" y1="${y}" x2="${edge}" y2="${y}"/><rect x="${bx}" y="${y - h / 2}" width="${w}" height="${h}" rx="9"/>
      ${text.map((t, k) => `<text class="${known ? '' : 'q'}" x="${bx + w / 2}" y="${y - h / 2 + 21 + k * 20}" text-anchor="middle">${esc(t)}</text>`).join('')}</g>`; }).join('');
  L.querySelectorAll('.lbl').forEach(g => g.addEventListener('click', () => tapPart(g.dataset.id)));
}
function burst(x, y, n){ const fx = $('#fx'); if(!fx) return; const cols = ['#ffc94d', '#ff6a3d', '#ffffff', '#6fc3ff'];
  let s = ''; for(let i = 0; i < n; i++){ const a = Math.random() * 6.28, r = 60 + Math.random() * 140; s += `<circle cx="${x}" cy="${y}" r="${3 + Math.random() * 4}" fill="${cols[i % 4]}"><animate attributeName="cx" to="${x + Math.cos(a) * r}" dur=".7s" fill="freeze"/><animate attributeName="cy" to="${y + Math.sin(a) * r}" dur=".7s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" dur=".7s" fill="freeze"/></circle>`; }
  fx.innerHTML = s; S.timers.push(setTimeout(() => { if(fx) fx.innerHTML = ''; }, 800)); }
function flashPart(id, ok){ const g = app.querySelector(`.prt[data-id="${id}"]`); if(!g) return; g.classList.remove('flash'); void g.getBBox(); if(!ok) g.classList.add('flash'); else { g.classList.add('ok'); S.timers.push(setTimeout(() => g.classList.remove('ok'), 700)); } }
function scrollToPart(id){ const st = $('#stage'); if(!st || st.scrollHeight <= st.clientHeight + 4) return; const sv = $('#sv'), k = sv.clientHeight / VH; st.scrollTo({top:Math.max(0, partCenterY(id) * k - st.clientHeight / 2), behavior:'smooth'}); }

/* ---------- mode 1: Explode It ---------- */
function startExplore(){
  $('#sub').textContent = 'Tap any part to learn it';
  S.finished = false; panelExplore(null);
}
function panelExplore(id){
  const n = S.visited.size, p = id ? P[id] : null;
  $('#panel').innerHTML = `${p ? `<div class="card"><span class="kick">Part ${PARTS.indexOf(p) + 1} of 13</span><h2>${esc(p.name)}</h2><p>${esc(p.info)}</p><div class="fact"><b>Fun fact:</b> ${esc(p.fact)}</div></div>`
    : `<div class="card"><span class="kick">Mission 01</span><h2>${S.t > .5 ? 'Tap a part' : 'This is a two-stage rocket'}</h2><p>${S.t > .5 ? 'Each piece has one job. Tap it, or its label, to find out what it is.' : 'It looks like one tube, but it is 13 parts working together. Blow it apart to see inside.'}</p></div>`}
    <div class="card"><div class="meter"><b>${n}/13</b><div class="bar3"><i style="width:${n / 13 * 100}%"></i></div></div><p class="hint">Learn all 13 to clear this mission.</p>
    <div class="row"><button class="btn ${S.t > .5 ? 'ghost' : 'gold big'}" id="ex" type="button">${S.t > .5 ? 'Put it back together' : '💥 Explode it'}</button></div></div>`;
  $('#ex').onclick = () => { explode(S.target > .5 ? 0 : 1); S.timers.push(setTimeout(() => S && panelExplore(id), 950)); };
}

/* ---------- mode 2: Name Drop ---------- */
function startName(){
  explode(1); $('#sub').textContent = 'Pick a name, then tap its part';
  S.chips = shuffle(PARTS.map(p => p.id)); panelName('');
}
function panelName(msg, ok){
  $('#panel').innerHTML = `<div class="card"><span class="kick">Mission 02 · ${S.placed.size}/13 placed</span><h2>Name Drop</h2><p class="hint">Pick a name tag, then tap the part it belongs to. You can also tap a part first.</p>
    ${msg ? `<div class="fb ${ok ? 'ok' : 'no'}">${esc(msg)}</div>` : ''}</div>
    <div class="card"><div class="chips">${S.chips.map(id => `<button class="chip ${S.placed.has(id) ? 'gone' : ''} ${S.sel === id ? 'sel' : ''}" type="button" data-id="${id}" ${S.placed.has(id) ? 'tabindex="-1" aria-hidden="true"' : ''}>${esc(P[id].name)}</button>`).join('')}</div></div>`;
  app.querySelectorAll('.chip').forEach(b => b.onclick = () => { sfx('tap'); S.sel = S.sel === b.dataset.id ? null : b.dataset.id; if(S.sel && S.selPart){ const part = S.selPart; S.selPart = null; tryName(S.sel, part); } else panelName(msg, ok); });
}
function tryName(chip, part){
  S.sel = null;
  if(chip === part){ S.placed.add(part); sfx('ok'); flashPart(part, true); placeParts();
    if(S.placed.size === 13) return finish(S.miss <= 1 ? 3 : S.miss <= 4 ? 2 : 1, 'Every part has its name back.');
    return panelName(`Yes! That is the ${P[part].name}.`, true); }
  S.miss++; S.perChip[chip] = (S.perChip[chip] || 0) + 1; sfx('no'); flashPart(part, false);
  panelName(S.perChip[chip] >= 2 ? `Not there. Clue: the ${P[chip].name} says “${P[chip].job}”` : `Not that one. Look at the shape and where it sits.`, false);
}

/* ---------- mode 3: What's Its Job? ---------- */
function startJob(){
  explode(1); $('#sub').textContent = 'Find the part that does this job';
  S.rounds = shuffle(PARTS.map(p => p.id)).slice(0, 10); S.round = 0; panelJob('');
}
function panelJob(msg, ok){
  const id = S.rounds[S.round];
  $('#panel').innerHTML = `<div class="card"><span class="kick">Mission 03 · Round ${S.round + 1} of 10</span><p class="job"><q>${esc(P[id].job)}</q></p><p class="hint">Who said it? Tap that part.</p>${msg ? `<div class="fb ${ok ? 'ok' : 'no'}">${esc(msg)}</div>` : ''}</div>
    <div class="card"><div class="meter"><b>${S.round}/10</b><div class="bar3"><i style="width:${S.round * 10}%"></i></div></div></div>`;
}
function tryJob(part){
  const id = S.rounds[S.round];
  if(part === id){ sfx('ok'); flashPart(part, true); S.round++; if(S.round >= 10) return finish(S.miss <= 1 ? 3 : S.miss <= 3 ? 2 : 1, 'You know what every part is for.');
    return panelJob(`Correct: the ${P[part].name}.`, true); }
  S.miss++; sfx('no'); flashPart(part, false); panelJob(`That is the ${P[part].name}: “${P[part].job}” Try again.`, false);
}

/* ---------- mode 4: Stack & Send ---------- */
const NEEDS = {nozzle:[], chamber:['nozzle'], turbopump:['chamber'], fuel:['turbopump'], fins:['fuel'], lox:['fuel'], interstage:['lox'], s2engine:['lox'], s2tank:['interstage', 's2engine'], avionics:['s2tank'], payload:['avionics'], fairing:['payload'], nose:['fairing']};
const ORDER = ['nozzle','chamber','turbopump','fuel','fins','lox','interstage','s2engine','s2tank','avionics','payload','fairing','nose'];
function startStack(){
  S.t = 0; S.target = 0; placeParts(); $('#stage').classList.add('fit'); $('#sub').textContent = 'Build from the bottom up';
  app.querySelectorAll('.prt').forEach(g => { g.style.opacity = '0'; g.style.pointerEvents = 'none'; });
  $('#world').innerHTML = `<g opacity=".18">${rocketMarkup('ghost').replace(/fill="[^"]*"/g, 'fill="none"').replace(/stroke="#0b1230"/g, 'stroke="#a9b4e0"')}</g>`.replace('<g opacity', `<g transform="translate(0,${ASM})" opacity`);
  $('#world').insertAdjacentHTML('beforeend', `<rect x="90" y="${ASM + 800}" width="240" height="14" rx="4" fill="#3a4680"/><text x="210" y="${ASM + 846}" text-anchor="middle" font-family="Unbounded,sans-serif" font-size="16" fill="#a9b4e0">LAUNCH PAD</text>`);
  S.chips = shuffle(PARTS.map(p => p.id)); panelStack('');
  scrollBottom();
}
function scrollBottom(){ const st = $('#stage'); if(st) st.scrollTo({top:st.scrollHeight}); }
function nextNeeded(){ return ORDER.find(id => !S.placed.has(id) && NEEDS[id].every(n => S.placed.has(n))); }
function panelStack(msg, ok){
  const all = S.placed.size === 13;
  $('#panel').innerHTML = `<div class="card"><span class="kick">Mission 04 · ${S.placed.size}/13 stacked</span><h2>${all ? 'Ready for launch' : 'Stack & Send'}</h2>
    <p class="hint">${all ? 'Every part is where it belongs. Clear the pad.' : 'Rockets are built from the bottom up. Tap the part that goes on next.'}</p>${msg ? `<div class="fb ${ok ? 'ok' : 'no'}">${esc(msg)}</div>` : ''}</div>
    ${all ? `<button class="btn gold big" id="launch" type="button">🚀 Launch</button>` : `<div class="card"><div class="chips">${S.chips.map(id => `<button class="chip ${S.placed.has(id) ? 'gone' : ''}" type="button" data-id="${id}" ${S.placed.has(id) ? 'tabindex="-1" aria-hidden="true"' : ''}>${esc(P[id].name)}</button>`).join('')}</div></div>`}`;
  app.querySelectorAll('.chip').forEach(b => b.onclick = () => stackPick(b.dataset.id, b));
  const l = $('#launch'); if(l) l.onclick = startLaunch;
}
function stackPick(id, btn){
  if(NEEDS[id].every(n => S.placed.has(n))){ S.placed.add(id); sfx('pop'); const g = app.querySelector(`.prt[data-id="${id}"]`);
    g.style.transition = 'none'; g.style.opacity = '0'; g.querySelector('.mv').setAttribute('transform', 'translate(0,-160)');
    requestAnimationFrame(() => { g.style.transition = 'opacity .25s'; g.style.opacity = '1'; let k = 0; const drop = () => { k += .08; g.querySelector('.mv').setAttribute('transform', `translate(0,${-160 * Math.max(0, 1 - k * k)})`); if(k < 1 && S) requestAnimationFrame(drop); }; drop(); });
    const nx = nextNeeded(); panelStack(S.placed.size === 13 ? 'Stacked! The rocket is complete.' : `${P[id].name} locked in.`, true); return; }
  S.miss++; sfx('no'); if(btn) btn.classList.add('bad'); const need = nextNeeded();
  panelStack(`Not yet: the ${P[id].name} needs ${NEEDS[id].filter(n => !S.placed.has(n)).map(n => 'the ' + P[n].name.toLowerCase()).join(' and ')} under it first. Next goes the part that says “${P[need].job}”`, false);
}
/* launch: stage 1 burns, separates, fairing opens, satellite unfolds in orbit */
function startLaunch(){
  S.hideLabels = true; sfx('tap'); $('#panel').innerHTML = `<div class="card"><span class="kick">Mission control</span><h2 id="lc">T-minus 3</h2><p class="hint" id="lmsg">All systems go.</p></div>`;
  const st = $('#stage'); st.classList.add('fit'); st.style.overflow = 'hidden'; st.scrollTo({top:0});
  const w = $('#world'); w.innerHTML = `<rect id="sky" x="-400" y="-3000" width="1220" height="5200" fill="url(#gSky)"/><g id="starsg" opacity="0">${Array.from({length:70}, (_, i) => `<circle cx="${(i * 97) % 440 - 10}" cy="${(i * 173) % 1100}" r="${i % 5 ? 1.4 : 2.4}" fill="#fff"/>`).join('')}</g>
    <g id="ground"><rect x="-400" y="${ASM + 800}" width="1220" height="900" fill="#3c8a4a"/><rect x="60" y="${ASM + 790}" width="300" height="16" rx="3" fill="#59627c"/><rect x="290" y="${ASM + 260}" width="18" height="540" fill="#ff5a3d" opacity=".9"/><path d="M290 ${ASM + 300} L308 ${ASM + 330} M290 ${ASM + 380} L308 ${ASM + 410} M290 ${ASM + 460} L308 ${ASM + 490} M290 ${ASM + 540} L308 ${ASM + 570}" stroke="#a83a26" stroke-width="3"/></g>
    <circle id="earth" cx="210" cy="2300" r="1500" fill="url(#gEarth)" opacity="0"/><g id="smoke"></g>`;
  const rk = $('#rk'); rk.insertAdjacentHTML('afterbegin', `<path id="fl1" d="M162 792 Q210 1030 258 792 Z" fill="url(#gFlame)" opacity="0"/><path id="fl2" d="M190 384 Q210 520 230 384 Z" fill="url(#gFlame)" opacity="0"/>`);
  S.launch = {T:-3.2, off:Object.fromEntries(PARTS.map(p => [p.id, {x:0, y:0, r:0, split:0, unfold:0}])), cd:3};
  app.querySelectorAll('.prt').forEach(g => { g.style.opacity = '1'; g.style.transition = 'none'; });
  const ov = document.createElement('div'); ov.className = 'count'; ov.id = 'cd'; ov.textContent = '3'; st.appendChild(ov); sfx('tick');
}
function launchStep(dt){
  const L = S.launch, T = (L.T += dt), o = L.off, msg = $('#lmsg'), lc = $('#lc');
  if(T < 0){ const c = Math.ceil(-T); if(c !== L.cd){ L.cd = c; const cd = $('#cd'); if(cd) cd.textContent = c; if(lc) lc.textContent = 'T-minus ' + c; sfx('tick'); } return; }
  if(!L.lit){ L.lit = true; const cd = $('#cd'); if(cd) cd.remove(); sfx('rumble'); sfx('go'); if(lc) lc.textContent = 'Liftoff!'; if(msg) msg.textContent = 'Fuel and oxygen burn in the combustion chamber. Hot gas blasts out of the nozzle, so the rocket goes up.'; }
  const rise = T < 2.4 ? -Math.pow(T / 2.4, 2) * 110 : -110, world = T < 2.4 ? Math.pow(T / 2.4, 3) * 300 : 300 + (T - 2.4) * 700;
  const shake = T < 2 ? (Math.random() - .5) * 3 : 0;
  PARTS.forEach(p => { o[p.id].y = rise; o[p.id].x = shake; });
  $('#ground').setAttribute('transform', `translate(0,${world})`);
  const sp = Math.min(1, Math.max(0, (T - 2.5) / 3)); $('#sky').setAttribute('opacity', 1 - sp); $('#starsg').setAttribute('opacity', sp);
  $('#starsg').setAttribute('transform', `translate(0,${(world * .05) % 120})`);
  const f1 = $('#fl1'), f2 = $('#fl2');
  f1.setAttribute('transform', `translate(0,${rise + ASM})`); f2.setAttribute('transform', `translate(0,${rise + ASM})`);
  f1.setAttribute('opacity', T < 4.6 ? .95 : 0); f1.setAttribute('d', `M162 792 Q210 ${1000 + Math.random() * 60} 258 792 Z`);
  if(T < 2.6){ const sm = $('#smoke'); if(Math.random() < .5) sm.insertAdjacentHTML('beforeend', `<circle cx="${150 + Math.random() * 120}" cy="${ASM + 790}" r="${20 + Math.random() * 30}" fill="#e7ecf7" opacity=".8"><animate attributeName="cx" by="${(Math.random() - .5) * 360}" dur="1.6s" fill="freeze"/><animate attributeName="opacity" to="0" dur="1.6s" fill="freeze"/></circle>`); }
  $('#smoke').setAttribute('transform', `translate(0,${world})`);
  if(T > 4.6){ const k = T - 4.6; if(!L.sep){ L.sep = true; sfx('boom'); if(msg) msg.textContent = 'Stage separation! The empty first stage drops away, so the rocket stops carrying dead weight.'; if(lc) lc.textContent = 'Stage 1 separation'; }
    ['interstage','lox','fuel','fins','turbopump','chamber','nozzle'].forEach(id => { o[id].y = rise + k * k * 160 + k * 40; o[id].r = k * 9; o[id].x = k * 14; }); }
  f2.setAttribute('opacity', T > 5.1 ? .95 : 0); f2.setAttribute('d', `M190 384 Q210 ${500 + Math.random() * 40} 230 384 Z`);
  if(T > 6.2){ const k = T - 6.2; if(!L.fair){ L.fair = true; sfx('pop'); if(msg) msg.textContent = 'The air is thin now, so the fairing splits open and falls away.'; if(lc) lc.textContent = 'Fairing separation'; }
    o.fairing.split = k * 130; o.fairing.y = rise + k * k * 60; o.nose.y = rise - k * 80; o.nose.x = k * 120; o.nose.r = k * 40; }
  if(T > 7.4){ const k = Math.min(1, (T - 7.4) / 1.2); $('#earth').setAttribute('opacity', k); $('#earth').setAttribute('cy', 2700 - k * 600); }
  if(T > 8.2){ const k = T - 8.2; if(!L.dep){ L.dep = true; sfx('pop'); if(msg) msg.textContent = 'In orbit. The upper stage lets the satellite go and its solar panels unfold.'; if(lc) lc.textContent = 'Payload deployed'; }
    f2.setAttribute('opacity', 0); ['avionics','s2tank','s2engine'].forEach(id => { o[id].y = rise + k * 70; o[id].r = -k * 6; }); o.payload.y = rise - k * 30; o.payload.unfold = Math.min(1, k / 1.2); }
  placeParts();
  if(T > 10.4 && !S.finished) finish(S.miss === 0 ? 3 : S.miss <= 2 ? 2 : 1, 'Satellite in orbit. Mission complete.');
}

/* ---------- parts: tap routing ---------- */
function tapPart(id){
  if(!S || S.finished) return;
  if(S.mode === 'explore'){ if(S.t < .5){ explode(1); S.timers.push(setTimeout(() => S && panelExplore(null), 950)); return; }
    S.visited.add(id); sfx('tap'); flashPart(id, true); drawLabels(); panelExplore(id);
    if(S.visited.size === 13 && !S.finished) S.timers.push(setTimeout(() => S && finish(3, 'You know all 13 parts of the rocket.'), 1600)); return; }
  if(S.mode === 'name'){ if(S.placed.has(id)) return; if(S.sel) tryName(S.sel, id); else { S.selPart = id; sfx('tap'); drawLabels(); panelName(`Now pick the name for this part.`, true); } return; }
  if(S.mode === 'job') return tryJob(id);
}
function finish(st, line){
  if(S.finished) return; S.finished = true;
  const m = S.mode, sec = Math.round((performance.now() - S.start) / 1000), prev = SAVE.done[m] || 0, best = SAVE.best[m];
  SAVE.done[m] = Math.max(prev, st); if(m !== 'explore' && (!best || sec < best)) SAVE.best[m] = sec; persist();
  const i = MODES.findIndex(x => x.id === m), nx = MODES[i + 1] && unlocked(i + 1) ? MODES[i + 1] : null;
  sfx('win');
  const ov = $('#ov'); ov.hidden = false;
  ov.innerHTML = `<div class="result"><div class="stars3" aria-label="${st} of 3 stars">${'★'.repeat(st)}<span>${'★'.repeat(3 - st)}</span></div><span class="kick">${esc(MODES[i].name)} cleared</span><h2>${esc(line)}</h2>
    <p class="muted">${m === 'explore' ? 'Next: can you name them without help?' : `${m === 'thrust' ? 'Failed flights' : 'Misses'}: ${S.miss} · Time: ${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}${best && sec < best ? ' · New best!' : ''}`}</p>
    ${st < 3 && m !== 'explore' ? `<p class="muted">For 3 stars: ${{stack:'stack with no misses', thrust:'reach orbit with a liftoff mass under 115 t', orbit:'no wrong orbits'}[m] || 'one miss or fewer'}.</p>` : ''}
    <div class="row" style="justify-content:center">${nx ? `<button class="btn gold big" id="rNext" type="button">Next: ${esc(nx.name)}</button>` : `<a class="btn gold big" href="../#cat-rocket">Collect rewards</a>`}<button class="btn ghost" id="rAgain" type="button">Replay</button><button class="btn ghost" id="rModes" type="button">Missions</button></div></div>`;
  const n = $('#rNext'); if(n) n.onclick = () => play(nx.id); $('#rAgain').onclick = () => play(m); $('#rModes').onclick = modes;
  (n || $('#rAgain')).focus({preventScroll:true});
  if(!prev) toast('Sparks waiting for you in Gamified Edu');
}


/* ================= MISSION CONTROL (advanced) ================= */
function advPlay(mode){
  const m = MODES.find(x => x.id === mode);
  app.innerHTML = `<header class="bar"><button class="ib" id="back" type="button" aria-label="Missions">←</button><div><b>${esc(m.name)}</b><small>${m.adv ? 'Mission Control · ' : ''}${esc(m.sub)}</small></div><div class="hudstat" id="hud"></div></header>
    <section class="play adv"><div class="stage" id="stage"></div><aside class="panel" id="panel"></aside></section><div class="overlay" id="ov" hidden></div>`;
  $('#back').onclick = modes;
  S = {mode, miss:0, start:performance.now(), timers:[], finished:false, round:0, placed:new Set(), visited:new Set(), rounds:[]};
  ({puzzle:startPuzzle, thrust:startThrust, count:startCount, orbit:startOrbit})[mode]();
}
const starField = (n, w, h) => Array.from({length:n}, (_, i) => `<circle cx="${(i * 97) % w}" cy="${(i * 173) % h}" r="${i % 5 ? 1.1 : 2}" fill="#fff" opacity="${.35 + (i % 4) * .15}"/>`).join('');
const fmt = (n, d) => n.toLocaleString('en-IN', {maximumFractionDigits:d == null ? 0 : d, minimumFractionDigits:d || 0});

/* ---------- 05: Flight Puzzle (order the flight, then true or myth) ---------- */
const PZ_STEPS = [
  ['Engines ignite', 'Fuel and oxygen meet in the combustion chamber and start to burn.'],
  ['Liftoff', 'Thrust grows bigger than the rocket’s weight, so it leaves the pad.'],
  ['Hardest push from the air', 'About a minute up, speed and air together press hardest on the rocket. Engineers call it max Q.'],
  ['Stage 1 runs empty', 'The big first stage has burned its propellant. Now it is only dead weight.'],
  ['Stage separation', 'The empty first stage is released and falls away.'],
  ['Stage 2 ignites', 'The smaller upper engine takes over in near-empty space.'],
  ['Fairing falls away', 'Above the thick air the satellite needs no shield, so the shell is dropped to save weight.'],
  ['Satellite released', 'At orbital speed the upper stage lets the satellite go.']];
const PZ_FACTS = [
  ['A rocket moves by pushing against the air.', false, 'Myth. It pushes its own exhaust backwards, and the exhaust pushes it forwards. That works even better in empty space.'],
  ['A rocket carries its own oxygen.', true, 'True. Space has no air, so nothing could burn without it.'],
  ['There is no gravity in orbit.', false, 'Myth. Gravity up there is almost as strong as on the ground. Astronauts float because they are falling around the Earth all the time.'],
  ['At liftoff, most of a rocket’s weight is propellant.', true, 'True. Usually more than four-fifths of it. The satellite is only a few percent.'],
  ['To reach orbit, the main thing is to go very high.', false, 'Myth. The main thing is to go sideways at about 7.8 km every second, so you keep missing the ground.'],
  ['Dropping empty stages helps the rest go faster.', true, 'True. The same push moves a lighter rocket much faster.']];
function startPuzzle(){ S.part = 0; S.round = 0; S.chips = shuffle(PZ_STEPS.map((x, i) => i)); S.facts = shuffle(PZ_FACTS.map((x, i) => i)); puzzleOrder(''); }
function puzzleOrder(msg, ok){
  const n = S.round, all = n >= PZ_STEPS.length;
  $('#stage').innerHTML = `<ol class="tline">${PZ_STEPS.map((s, i) => `<li class="${i < n ? 'done' : i === n ? 'now' : ''}"><span class="dot">${i < n ? '✓' : i + 1}</span><div><b>${i < n ? esc(s[0]) : i === n ? 'What happens next?' : ''}</b>${i < n ? `<small>${esc(s[1])}</small>` : ''}</div></li>`).join('')}</ol>`;
  $('#panel').innerHTML = `<div class="card"><span class="kick">Mission 05 · Puzzle 1 of 2</span><h2>${all ? 'That is a full flight' : 'Put the flight in order'}</h2>
      <p class="hint">${all ? 'Eight events in about ten minutes, from the pad to orbit.' : 'From the launch pad to orbit, eight things happen in a fixed order. Tap the one that comes next.'}</p>${msg ? `<div class="fb ${ok ? 'ok' : 'no'}">${esc(msg)}</div>` : ''}
      ${all ? `<div class="row"><button class="btn gold big" id="nx" type="button">Puzzle 2: True or myth?</button></div>` : ''}</div>
    ${all ? '' : `<div class="card"><div class="chips">${S.chips.map(i => `<button class="chip ${i < n ? 'gone' : ''}" type="button" data-i="${i}" ${i < n ? 'tabindex="-1" aria-hidden="true"' : ''}>${esc(PZ_STEPS[i][0])}</button>`).join('')}</div></div>`}`;
  app.querySelectorAll('.chip').forEach(b => b.onclick = () => { const i = +b.dataset.i; if(i === S.round){ S.round++; sfx('pop'); puzzleOrder(PZ_STEPS[i][1], true); } else { S.miss++; sfx('no'); puzzleOrder(i < S.round ? 'That has already happened.' : `Not yet. “${PZ_STEPS[i][0]}” comes later. Think about what the rocket needs right now.`, false); } });
  const st = $('#stage').querySelector('.now'); if(st) st.scrollIntoView({block:'nearest'});
  const nx = $('#nx'); if(nx){ nx.onclick = () => { S.part = 1; S.round = 0; sfx('tap'); puzzleFact(); }; nx.focus({preventScroll:true}); }
}
function puzzleFact(ans){
  const f = PZ_FACTS[S.facts[S.round]], done = ans != null, right = done && ans === f[1];
  $('#stage').innerHTML = `<div class="console"><div class="claim"><small>Statement ${S.round + 1} of ${PZ_FACTS.length}</small><b>${esc(f[0])}</b></div>
    <div class="tiles"><button class="tile tf" type="button" data-v="1" ${done ? 'disabled' : ''}><b>✔ True</b></button><button class="tile tf" type="button" data-v="0" ${done ? 'disabled' : ''}><b>✖ Myth</b></button></div></div>`;
  $('#panel').innerHTML = `<div class="card"><span class="kick">Mission 05 · Puzzle 2 of 2</span><h2>True or myth?</h2><p class="hint">Six things people say about rockets. Some are true. Some just sound true.</p>
      ${done ? `<div class="fb ${right ? 'ok' : 'no'}">${right ? '' : 'Not quite. '}${esc(f[2])}</div><div class="row"><button class="btn gold big" id="nx" type="button">${S.round + 1 < PZ_FACTS.length ? 'Next statement' : 'Finish'}</button></div>` : ''}</div>
    <div class="card"><div class="meter"><b>${S.round + (done ? 1 : 0)}/${PZ_FACTS.length}</b><div class="bar3"><i style="width:${(S.round + (done ? 1 : 0)) / PZ_FACTS.length * 100}%"></i></div></div></div>`;
  app.querySelectorAll('.tf').forEach(b => b.onclick = () => { const v = b.dataset.v === '1'; if(v === f[1]) sfx('ok'); else { S.miss++; sfx('no'); } puzzleFact(v); });
  const nx = $('#nx'); if(nx){ nx.onclick = () => { S.round++; if(S.round >= PZ_FACTS.length) return finish(S.miss <= 1 ? 3 : S.miss <= 4 ? 2 : 1, 'You know how a flight really works.'); puzzleFact(); }; nx.focus({preventScroll:true}); }
}

/* ---------- 06: Thrust Tuner (the rocket equation) ---------- */
const TT = {pay:1.5, need:9400, ve1:2943, ve2:3335, engKN:400};
function tcalc(D){
  const s2dry = D.s2 * .08 + .5, s1dry = D.s1 * .08 + D.eng * .5, m0 = TT.pay + s2dry + D.s2 + s1dry + D.s1;
  const thrust = D.eng * TT.engKN, weight = m0 * 9.81, twr = thrust / weight;
  const dv1 = TT.ve1 * Math.log(m0 / (m0 - D.s1)), m1 = TT.pay + s2dry + D.s2 + (D.staged ? 0 : s1dry), dv2 = TT.ve2 * Math.log(m1 / (m1 - D.s2));
  const loss = twr < 1 ? dv1 + dv2 : twr < 1.2 ? (1.2 - twr) * 4000 : 0;
  return {m0, thrust, weight, twr, dv1, dv2, loss, dv:Math.max(0, dv1 + dv2 - loss), s1dry};
}
function thrustSvg(D, R, path){
  const h1 = 50 + D.s1 * 1.05, h2 = 24 + D.s2 * 1.9, base = 520, y1 = base - 22 - h1, y2 = y1 - 10 - h2;
  const noz = Array.from({length:D.eng}, (_, i) => { const x = 210 + (i - (D.eng - 1) / 2) * (44 / Math.max(D.eng, 4)) * 1.6; return `<path d="M${x - 4} ${base - 22} L${x + 4} ${base - 22} L${x + 7} ${base - 4} L${x - 7} ${base - 4} Z" fill="url(#gDark)" stroke="#0b1230" stroke-width="1.5"/>`; }).join('');
  return `<svg viewBox="0 70 420 500" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Rocket design and flight path">${defs}
    <g transform="translate(-400,0)">${starField(150, 1220, 500)}</g>
    <circle cx="210" cy="1520" r="1120" fill="none" stroke="#6fc3ff" stroke-width="1.5" stroke-dasharray="5 7" opacity=".7"/><text x="412" y="418" text-anchor="end" class="svgt">ORBIT</text>
    <circle cx="210" cy="1520" r="1000" fill="url(#gEarth)"/><circle cx="210" cy="1520" r="998" fill="#1d5fae"/>
    <g id="ttR"><rect x="186" y="${y1}" width="48" height="${h1}" rx="4" fill="url(#gBody)" stroke="#0b1230" stroke-width="2"/><rect x="186" y="${y1 + h1 * .45}" width="48" height="12" fill="#ff9f2e"/>
      <rect x="194" y="${y1 - 10}" width="32" height="10" fill="${D.staged ? '#1d2233' : '#59627c'}" stroke="#0b1230" stroke-width="2"/>
      <rect x="192" y="${y2}" width="36" height="${h2}" rx="3" fill="url(#gBody)" stroke="#0b1230" stroke-width="2"/><rect x="192" y="${y2 + h2 * .4}" width="36" height="8" fill="#2f6fd6"/>
      <path d="M192 ${y2} C192 ${y2 - 26} 204 ${y2 - 40} 210 ${y2 - 44} C216 ${y2 - 40} 228 ${y2 - 26} 228 ${y2} Z" fill="#e8b54a" stroke="#0b1230" stroke-width="2"/>${noz}</g>
    ${path || ''}</svg>`;
}
function startThrust(){
  S.d = {s1:60, s2:6, eng:2, staged:true}; S.tries = 0;
  $('#panel').innerHTML = `<div class="card"><span class="kick">Mission 06 · Flight design</span><h2>Reach orbit with the lightest rocket</h2>
      <p class="hint">Cargo: a 1,500 kg satellite. To stay in low Earth orbit the rocket must gain about <b>9.4 km/s</b> of speed in total: 7.8 km/s sideways, plus what gravity and air steal on the way up.</p></div>
    <div class="card tune">
      <label><span>Stage 1 propellant</span><output id="o1"></output><input id="r1" type="range" min="20" max="200" step="5" value="60"></label>
      <label><span>Stage 2 propellant</span><output id="o2"></output><input id="r2" type="range" min="2" max="40" step="1" value="6"></label>
      <label><span>Stage 1 engines</span><output id="o3"></output><input id="r3" type="range" min="1" max="9" step="1" value="2"></label>
      <label class="sw"><input id="r4" type="checkbox" checked><span>Drop stage 1 when it is empty (staging)</span></label></div>
    <div class="card"><div class="read"><div><small>Liftoff mass</small><b id="vM"></b></div><div><small>Thrust ÷ weight</small><b id="vT"></b></div><div><small>Speed it can gain</small><b id="vD"></b></div></div>
      <div class="dvbar" aria-hidden="true"><i id="b1"></i><i id="b2"></i><u></u></div><p class="hint" id="vH"></p>
      <div class="row"><button class="btn gold big" id="fire" type="button">🚀 Launch test flight</button></div></div>
    <div id="tfb"></div>
    <details class="card eq"><summary>The rocket equation</summary><p>Speed gained = exhaust speed × ln(full mass ÷ empty mass).</p><p class="hint">Named after Konstantin Tsiolkovsky. Propellant is heavy, so doubling it does not double your speed. The trick is to throw away empty tanks: that is staging.</p></details>`;
  const upd = () => { const D = S.d; D.s1 = +$('#r1').value; D.s2 = +$('#r2').value; D.eng = +$('#r3').value; D.staged = $('#r4').checked; const R = tcalc(D);
    $('#o1').textContent = D.s1 + ' t'; $('#o2').textContent = D.s2 + ' t'; $('#o3').textContent = D.eng + ' × 400 kN';
    $('#vM').textContent = fmt(R.m0, 1) + ' t'; const vt = $('#vT'); vt.textContent = fmt(R.twr, 2); vt.className = R.twr < 1 ? 'bad' : R.twr < 1.2 ? 'mid' : 'good';
    const vd = $('#vD'); vd.textContent = fmt(R.dv / 1000, 2) + ' km/s'; vd.className = R.dv >= TT.need ? 'good' : R.dv >= 7800 ? 'mid' : 'bad';
    const sc = 12000, a = R.twr < 1 ? 0 : R.dv1 - R.loss; $('#b1').style.width = Math.max(0, Math.min(100, a / sc * 100)) + '%'; $('#b2').style.width = Math.max(0, Math.min(100 - a / sc * 100, (R.twr < 1 ? 0 : R.dv2) / sc * 100)) + '%';
    $('#vH').textContent = R.twr < 1 ? 'Thrust is less than weight. It will not leave the pad.' : R.twr < 1.2 ? 'It lifts, but slowly. Gravity steals speed while it crawls.' : 'Gold = stage 1, blue = stage 2. The line is the 9.4 km/s you need.';
    $('#stage').innerHTML = thrustSvg(D, R); };
  let q = 0; const soon = () => { if(q) return; q = requestAnimationFrame(() => { q = 0; if(S && S.mode === 'thrust' && !S.busy) upd(); }); };
  ['r1', 'r2', 'r3', 'r4'].forEach(id => $('#' + id).addEventListener('input', soon)); upd();
  $('#fire').onclick = () => { if(S.busy || S.finished) return; const D = S.d, R = tcalc(D); S.tries++; S.busy = true; sfx('rumble');
    let path, head, body, ok = false;
    if(R.twr < 1){ path = `<g opacity=".8">${[0, 1, 2, 3].map(i => `<circle cx="${170 + i * 27}" cy="520" r="${18 + i % 2 * 8}" fill="#e7ecf7" opacity=".6"/>`).join('')}</g>`; head = 'It never left the pad'; body = `The engines push with ${fmt(R.thrust)} kN, but the rocket weighs ${fmt(R.weight)} kN. Thrust must beat weight. Add engines, or carry less propellant.`; }
    else if(R.dv < 3000){ path = `<path class="traj" d="M210 500 Q232 380 262 515"/>`; head = 'Up… and straight back down'; body = `It could only gain ${fmt(R.dv / 1000, 1)} km/s. It needs more propellant for its mass.`; }
    else if(R.dv < 7800){ path = `<path class="traj" d="M210 500 Q300 240 408 512"/>`; head = 'It reached space, then fell back'; body = `Orbit is not about height. It is about going sideways so fast (7.8 km/s) that you keep missing the ground. You had ${fmt(R.dv / 1000, 1)} of the 9.4 km/s needed.`; }
    else if(R.dv < TT.need){ path = `<path class="traj" d="M210 500 C214 420 300 392 418 470"/>`; head = 'So close'; body = `${fmt(R.dv / 1000, 2)} km/s. It skimmed along the top of the air, slowed down and came home. A little more push.`; }
    else { ok = true; path = `<path class="traj ok" d="M210 500 C214 430 262 402 330 407"/><circle r="6" fill="#ffc94d"><animateMotion dur="7s" begin="1.4s" repeatCount="indefinite" path="M330 407 A1120 1120 0 0 1 430 421"/></circle>`; head = 'Orbit!'; body = `${fmt(R.dv / 1000, 2)} km/s from a ${fmt(R.m0, 1)} t rocket.`; }
    let tip = '';
    if(!ok && R.twr >= 1){ if(!D.staged) tip = `You carried the empty first stage (${fmt(R.s1dry, 1)} t of dead metal) all the way up. Turn staging on.`; else if(R.loss > 0) tip = `The slow lift-off cost about ${fmt(R.loss)} m/s. Aim for thrust ÷ weight of 1.2 or more.`; else if(R.dv2 < R.dv1 * .8) tip = 'Try more stage 2 propellant: after separation it pushes a much lighter rocket, so every tonne counts for more.'; else tip = 'Try more stage 1 propellant, and enough engines to lift it.'; }
    $('#stage').innerHTML = thrustSvg(D, R, path);
    $('#tfb').innerHTML = `<div class="fb ${ok ? 'ok' : 'no'}"><b>${head}.</b> ${esc(body)}${tip ? ' ' + esc(tip) : ''}${ok ? ' ' + (R.m0 <= 115 ? 'Beautifully light.' : R.m0 <= 140 ? 'For 3 stars, get the liftoff mass under 115 t.' : 'It works, but it is heavy. Lighter rockets cost less: under 140 t for 2 stars, under 115 t for 3.') : ''}</div>`;
    if(!ok){ S.miss++; sfx('no'); } else sfx('go');
    S.timers.push(setTimeout(() => { if(!S) return; S.busy = false; if(ok){ const st = R.m0 <= 115 ? 3 : R.m0 <= 140 ? 2 : 1; S.okCount = (S.okCount || 0) + 1;
      if(st === 3 || S.okCount >= 2 || S.wantEnd){ finish(st, st === 3 ? 'A lean rocket that reaches orbit.' : 'Your design reaches orbit.'); }
      else { S.wantEnd = false; $('#tfb').insertAdjacentHTML('beforeend', `<div class="row"><button class="btn ghost" id="bank" type="button">Bank ${st}★ and finish</button><span class="hint" style="align-self:center">or keep tuning for a lighter rocket</span></div>`); $('#bank').onclick = () => finish(st, 'Your design reaches orbit.'); } } }, ok ? 2600 : 900));
  };
}

/* ---------- 06: Countdown Crew (go / no-go) ---------- */
const CC_NOM = {wind:['Upper-level wind', '12 m/s', '20 m/s or less'], lightning:['Nearest lightning', 'None in 50 km', 'None within 10 km'], lox:['Liquid oxygen temp', '−184 °C', '−183 °C or colder'],
  press:['Fuel tank pressure', '3.1 bar', '2.8 to 3.4 bar'], guid:['Guidance computers', '3 of 3 agree', 'All 3 must agree'], range:['Sea drop zone', 'Clear', 'No boats or aircraft'], batt:['Flight battery', '98%', '95% or more']};
const CC_ROUNDS = [
  {t:'T−60:00', k:'wind', v:'28 m/s', why:'High winds can bend and break a tall, thin rocket as it punches through them. Hold until they drop.'},
  {t:'T−45:00', k:null, why:'Every reading is inside its limit. The count continues.'},
  {t:'T−30:00', k:'lox', v:'−171 °C', why:'Too warm. The liquid oxygen is boiling off into gas, so the tank holds less than the engine needs.'},
  {t:'T−20:00', k:'lightning', v:'Strike 6 km away', why:'A rocket and its exhaust trail can trigger lightning. No launch with a storm this close.'},
  {t:'T−10:00', k:'guid', v:'2 of 3 agree', why:'One computer disagrees about where the rocket is pointing. Never fly with a confused brain.'},
  {t:'T−05:00', k:'range', v:'Fishing boat inside', why:'The empty first stage falls into this patch of sea. Nobody may be under it.'},
  {t:'T−02:00', k:'press', v:'3.9 bar', why:'Over the limit. The tank could burst. Vent it and check the valve before going on.'},
  {t:'T−00:30', k:null, why:'All green. You are go for launch.'}];
function startCount(){ S.round = 0; S.order = CC_ROUNDS.map(r => { const keys = shuffle(Object.keys(CC_NOM).filter(k => k !== r.k)).slice(0, r.k ? 3 : 4); if(r.k) keys.push(r.k); return shuffle(keys); }); countRender(''); }
function countRender(msg, ok, solved){
  const r = CC_ROUNDS[S.round], keys = S.order[S.round];
  $('#stage').innerHTML = `<div class="console"><div class="clock"><small>Launch clock</small><b>${r.t}</b></div>
    <div class="tiles">${keys.map(k => { const n = CC_NOM[k], bad = k === r.k; return `<button class="tile ${solved && bad ? 'hit' : ''}" type="button" data-k="${k}" ${solved ? 'disabled' : ''}><small>${esc(n[0])}</small><b>${esc(bad ? r.v : n[1])}</b><span>Limit: ${esc(n[2])}</span></button>`; }).join('')}</div></div>`;
  $('#panel').innerHTML = `<div class="card"><span class="kick">Mission 07 · Check ${S.round + 1} of ${CC_ROUNDS.length}</span><h2>Go or no-go?</h2>
      <p class="hint">You are the launch director. Compare each reading with its limit. If one is outside its limit, tap it to call a hold. If all are fine, say go.</p>${msg ? `<div class="fb ${ok ? 'ok' : 'no'}">${esc(msg)}</div>` : ''}
      <div class="row">${solved ? `<button class="btn gold big" id="nx" type="button">${S.round + 1 < CC_ROUNDS.length ? 'Next check' : 'Finish the count'}</button>` : `<button class="btn gold big" id="allgo" type="button">✔ All go</button>`}</div></div>
    <div class="card"><div class="meter"><b>${S.round + (solved ? 1 : 0)}/${CC_ROUNDS.length}</b><div class="bar3"><i style="width:${(S.round + (solved ? 1 : 0)) / CC_ROUNDS.length * 100}%"></i></div></div>
      <p class="hint">Real launches are stopped for exactly these reasons. Chandrayaan-2’s first attempt in July 2019 was called off less than an hour before liftoff; it flew a week later.</p></div>`;
  app.querySelectorAll('.tile').forEach(b => b.onclick = () => { const k = b.dataset.k; if(k === r.k){ sfx('ok'); countRender('Hold called. ' + r.why, true, true); } else { S.miss++; sfx('no'); countRender(`${CC_NOM[k][0]} reads ${CC_NOM[k][1]}, and the limit is “${CC_NOM[k][2]}”. That one is fine. Look again.`, false); } });
  const g = $('#allgo'); if(g) g.onclick = () => { if(!r.k){ sfx('ok'); countRender(r.why, true, true); } else { S.miss++; sfx('no'); countRender('Not safe yet. One reading is outside its limit. Find it.', false); } };
  const n = $('#nx'); if(n){ n.onclick = () => { S.round++; if(S.round >= CC_ROUNDS.length) return finish(S.miss <= 1 ? 3 : S.miss <= 3 ? 2 : 1, 'A safe count, all the way to zero.'); sfx('tick'); countRender(''); }; n.focus({preventScroll:true}); }
}

/* ---------- 07: Orbit Desk (which orbit for which job) ---------- */
const ORB = {
  leo:{n:'Low Earth orbit', d:'About 400 km up. One lap every 90 minutes.', no:'A low satellite races past. It sees any one place for only a few minutes at a time.'},
  sso:{n:'Polar Sun-synchronous orbit', d:'600 to 800 km up, over the poles. Sees every place at the same local time of day.', no:'A polar satellite passes overhead, then is gone for hours or days.'},
  geo:{n:'Geostationary orbit', d:'35,786 km above the equator. One lap a day, so it hangs over one spot.', no:'36,000 km is too far away for this job.'},
  moon:{n:'Lunar transfer', d:'384,000 km. Leaves Earth orbit and crosses to the Moon.', no:'That path leaves Earth behind completely.'}};
const ORB_ROUNDS = [
  {job:'Cyclone watcher', need:'It must stare at India all day and all night, never looking away, to track storms as they grow.', a:'geo', real:'India’s INSAT-3D class weather satellites watch from geostationary orbit.'},
  {job:'Crop mapper', need:'It must photograph every farm in the country, always in the same morning light, so pictures from different weeks can be compared.', a:'sso', real:'India’s Resourcesat satellites map crops from Sun-synchronous orbit.'},
  {job:'Village TV and internet link', need:'A dish on a village school roof is bolted in place. The satellite must never move in the sky.', a:'geo', real:'GSAT communication satellites sit in geostationary orbit, so a fixed dish always points at them.'},
  {job:'Space station', need:'Astronauts and supplies must fly up and back often, using as little rocket as possible.', a:'leo', real:'The International Space Station flies about 400 km up.'},
  {job:'Flood radar', need:'It must scan the whole planet, pole to pole, and see flooded villages through thick cloud.', a:'sso', real:'Radar satellites such as RISAT-1 flew in polar Sun-synchronous orbits.'},
  {job:'Moon lander', need:'It carries a lander and a rover to explore near the Moon’s south pole.', a:'moon', real:'Chandrayaan-3 raised its orbit step by step, crossed to the Moon and landed in August 2023.'}];
function orbitSvg(pick, right){
  const cls = k => `orb ${pick === k ? (right ? 'ok' : 'no') : ''}`;
  return `<svg viewBox="0 50 420 410" preserveAspectRatio="xMidYMid meet" role="group" aria-label="Orbits around Earth, not to scale">${defs}<g transform="translate(-400,-200)">${starField(220, 1220, 1040)}</g>
    <g class="${cls('moon')}" data-k="moon" tabindex="0" role="button" aria-label="Lunar transfer"><path d="M196 300 C120 120 250 60 344 96" fill="none"/><circle cx="356" cy="92" r="20" fill="#cfd4e2" stroke="#0b1230" stroke-width="2"/><circle cx="350" cy="86" r="4" fill="#aab1c4"/><circle cx="362" cy="98" r="3" fill="#aab1c4"/><text x="356" y="134" text-anchor="middle" class="svgt">MOON</text></g>
    <g class="${cls('geo')}" data-k="geo" tabindex="0" role="button" aria-label="Geostationary orbit"><ellipse cx="210" cy="340" rx="186" ry="74" fill="none"/><circle r="6" fill="#ffc94d" cx="396" cy="340"/><text x="210" y="436" text-anchor="middle" class="svgt">GEOSTATIONARY · 35,786 km</text></g>
    <g class="${cls('sso')}" data-k="sso" tabindex="0" role="button" aria-label="Polar Sun-synchronous orbit"><ellipse cx="210" cy="340" rx="34" ry="96" fill="none"/><circle r="5" fill="#3ee0b0"><animateMotion dur="5s" repeatCount="indefinite" path="M210 244 A34 96 0 1 1 209.9 244"/></circle><text x="210" y="234" text-anchor="middle" class="svgt">POLAR · 700 km</text></g>
    <circle cx="210" cy="340" r="50" fill="#1d5fae" stroke="#6fc3ff" stroke-width="3"/><path d="M186 318 q14 -12 26 0 q10 12 -4 22 q-16 6 -22 -8 Z M214 348 q12 -4 16 8 q-2 12 -14 8 Z" fill="#3c8a4a"/>
    <g class="${cls('leo')}" data-k="leo" tabindex="0" role="button" aria-label="Low Earth orbit"><ellipse cx="210" cy="340" rx="72" ry="26" fill="none"/><circle r="5" fill="#ff6a3d"><animateMotion dur="3s" repeatCount="indefinite" path="M138 340 A72 26 0 1 1 138 340.1"/></circle><text x="296" y="372" class="svgt">LOW · 400 km</text></g>
    <text x="14" y="452" class="svgt" opacity=".6">Not to scale</text></svg>`;
}
function startOrbit(){ S.round = 0; S.rounds = shuffle(ORB_ROUNDS.map((r, i) => i)); orbitRender(''); }
function orbitRender(msg, ok, solved, pick){
  const r = ORB_ROUNDS[S.rounds[S.round]];
  $('#stage').innerHTML = orbitSvg(pick, ok);
  $('#panel').innerHTML = `<div class="card"><span class="kick">Mission 08 · Satellite ${S.round + 1} of ${ORB_ROUNDS.length}</span><h2>${esc(r.job)}</h2><p>${esc(r.need)}</p><p class="hint">Which orbit do you send it to? Tap a ring, or pick below.</p>${msg ? `<div class="fb ${ok ? 'ok' : 'no'}">${esc(msg)}</div>` : ''}
      ${solved ? `<div class="fact"><b>Real mission:</b> ${esc(r.real)}</div><div class="row"><button class="btn gold big" id="nx" type="button">${S.round + 1 < ORB_ROUNDS.length ? 'Next satellite' : 'Finish'}</button></div>` : ''}</div>
    <div class="card olist">${Object.entries(ORB).map(([k, o]) => `<button class="ochip ${solved && k === r.a ? 'ok' : ''}" type="button" data-k="${k}" ${solved ? 'disabled' : ''}><b>${esc(o.n)}</b><span>${esc(o.d)}</span></button>`).join('')}</div>`;
  const choose = k => { if(solved || S.finished) return; if(k === r.a){ sfx('ok'); orbitRender(`Right. ${ORB[k].n}: ${ORB[k].d}`, true, true, k); } else { S.miss++; sfx('no'); orbitRender(`Not ${ORB[k].n.toLowerCase()}. ${ORB[k].no}`, false, false, k); } };
  app.querySelectorAll('.ochip').forEach(b => b.onclick = () => choose(b.dataset.k));
  app.querySelectorAll('.orb').forEach(g => { g.addEventListener('click', () => choose(g.dataset.k)); g.addEventListener('keydown', e => { if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); choose(g.dataset.k); } }); });
  const n = $('#nx'); if(n){ n.onclick = () => { S.round++; if(S.round >= ORB_ROUNDS.length) return finish(S.miss === 0 ? 3 : S.miss <= 2 ? 2 : 1, 'Every satellite is in the right orbit.'); orbitRender(''); }; n.focus({preventScroll:true}); }
}

/* test hook (only with ?test in the URL): read-only state */
if(/[?&]test\b/.test(location.search)) window.__rlTest = () => S && {mode:S.mode, t:S.t, placed:[...S.placed], visited:[...S.visited], miss:S.miss, round:S.round, job:S.rounds[S.round] || null, need:S.mode === 'stack' ? nextNeeded() : null, pz:S.mode === 'puzzle' ? {part:S.part, round:S.round, truth:S.part ? PZ_FACTS[S.facts[S.round]][1] : null} : null, fault:S.mode === 'count' ? CC_ROUNDS[S.round] && CC_ROUNDS[S.round].k : null, orbit:S.mode === 'orbit' && S.rounds.length ? ORB_ROUNDS[S.rounds[S.round]].a : null, finished:!!S.finished, launchT:S.launch ? S.launch.T : null};
title();
})();
