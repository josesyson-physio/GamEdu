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
  {id:'stack', n:'04', name:'Stack & Send', desc:'Build it from the bottom up, then launch a satellite to orbit.'}
];
let SAVE = {v:1, done:{}, best:{}};
try{ const s = JSON.parse(localStorage.getItem(KEY)); if(s && typeof s === 'object' && s.done && typeof s.done === 'object'){
  for(const m of MODES){ const v = Math.floor(+s.done[m.id]); if(v >= 1) SAVE.done[m.id] = Math.min(3, v); const b = +((s.best || {})[m.id]); if(b > 0 && b < 36000) SAVE.best[m.id] = Math.round(b); } } }catch(e){}
const persist = () => { try{ localStorage.setItem(KEY, JSON.stringify(SAVE)); }catch(e){} };
const unlocked = i => i === 0 || !!SAVE.done[MODES[i - 1].id];

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
      <p class="pitch">Blow a rocket into pieces, learn what every part does, then stack it back and send a satellite to orbit. 13 parts. 4 missions. Zero boring diagrams.</p>
      <div class="row"><button class="btn gold big" id="go" type="button">${done ? 'Continue' : 'Start the countdown'}</button><a class="btn ghost" href="../#cat-rocket">Back to Gamified Edu</a></div></div>
    <div class="tart"><svg viewBox="110 0 200 800" aria-hidden="true">${defs}${rocketMarkup('t')}</svg></div></section>`;
  $('#go').onclick = () => { sfx('tap'); modes(); };
}
function modes(){
  stopAnim();
  const total = MODES.reduce((a, m) => a + (SAVE.done[m.id] || 0), 0);
  app.innerHTML = `<header class="bar"><button class="ib" id="back" type="button" aria-label="Title">←</button><div><b>Liftoff Lab</b><small>Rocket science, one part at a time</small></div><a class="ib" href="../#cat-rocket">GE</a></header>
  <section class="modes"><div class="progress"><b>${total}/12 ★</b><span class="muted">Clear each mission to unlock the next. Every star earns sparks and XP in Gamified Edu.</span></div>
  <div class="mgrid">${MODES.map((m, i) => { const op = unlocked(i), st = SAVE.done[m.id] || 0;
    return `<button class="mode" type="button" data-i="${i}" ${op ? '' : 'disabled'}>${op ? '' : '<span class="lock">🔒 Clear the last one</span>'}<span class="n">${m.n}</span><h3>${esc(m.name)}</h3><p>${esc(m.desc)}</p><span class="st" aria-label="${st} of 3 stars">${stars(st)}</span></button>`; }).join('')}</div></section>`;
  $('#back').onclick = title;
  app.querySelectorAll('.mode:not(:disabled)').forEach(b => b.onclick = () => { sfx('tap'); play(MODES[+b.dataset.i].id); });
}

/* ================= PLAY ================= */
let S = null, raf = 0;
function stopAnim(){ cancelAnimationFrame(raf); raf = 0; if(S && S.timers) S.timers.forEach(clearTimeout); S = null; }
function play(mode){
  stopAnim();
  const m = MODES.find(x => x.id === mode);
  app.innerHTML = `<header class="bar"><button class="ib" id="back" type="button" aria-label="Missions">←</button><div><b>${esc(m.name)}</b><small id="sub"></small></div><div class="hudstat" id="hud"></div></header>
    <section class="play"><div class="stage" id="stage"><svg id="sv" viewBox="0 0 ${VW} ${VH}" preserveAspectRatio="xMidYMid meet" role="group" aria-label="Rocket">${defs}
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
    const y = partCenterY(p.id) + (p.id === 'fins' ? 34 : p.id === 'payload' ? -10 : 0), lines = text.length, h = lines * 20 + 12, w = known ? 104 : 40;
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
  const i = MODES.findIndex(x => x.id === m), nx = MODES[i + 1];
  sfx('win');
  const ov = $('#ov'); ov.hidden = false;
  ov.innerHTML = `<div class="result"><div class="stars3" aria-label="${st} of 3 stars">${'★'.repeat(st)}<span>${'★'.repeat(3 - st)}</span></div><span class="kick">${esc(MODES[i].name)} cleared</span><h2>${esc(line)}</h2>
    <p class="muted">${m === 'explore' ? 'Next: can you name them without help?' : `Misses: ${S.miss} · Time: ${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}${best && sec < best ? ' · New best!' : ''}`}</p>
    ${st < 3 && m !== 'explore' ? `<p class="muted">For 3 stars: ${m === 'stack' ? 'stack with no misses' : m === 'name' ? 'one miss or fewer' : 'one miss or fewer'}.</p>` : ''}
    <div class="row" style="justify-content:center">${nx ? `<button class="btn gold big" id="rNext" type="button">Next: ${esc(nx.name)}</button>` : `<a class="btn gold big" href="../#cat-rocket">Collect rewards</a>`}<button class="btn ghost" id="rAgain" type="button">Replay</button><button class="btn ghost" id="rModes" type="button">Missions</button></div></div>`;
  const n = $('#rNext'); if(n) n.onclick = () => play(nx.id); $('#rAgain').onclick = () => play(m); $('#rModes').onclick = modes;
  (n || $('#rAgain')).focus({preventScroll:true});
  if(!prev) toast('Sparks waiting for you in Gamified Edu');
}

/* test hook (only with ?test in the URL): read-only state */
if(/[?&]test\b/.test(location.search)) window.__rlTest = () => S && {mode:S.mode, t:S.t, placed:[...S.placed], visited:[...S.visited], miss:S.miss, round:S.round, job:S.rounds[S.round] || null, need:S.mode === 'stack' ? nextNeeded() : null, finished:!!S.finished, launchT:S.launch ? S.launch.T : null};
title();
})();
