/* Village Lab: a Gamified Edu "AI in Remote Areas" game.
   A junior scientist listens to a village problem, defines it, builds a fix (sense, think, tell, power, connect),
   field-tests it and pitches it. Scored out of 100 on real problem, empathy, smart design, works-in-the-village and impact. */
'use strict';
(function(){
if(window.top !== window.self){ document.body.textContent = 'Open Village Lab in its own tab.'; throw new Error('framed'); }
const $ = s => document.querySelector(s), app = $('#app');
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const shuffle = a => { a = a.slice(); for(let i = a.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const MS = window.VL_MISSIONS, PARTS = window.VL_PARTS, COMMON = window.VL_COMMON, KEY = 'village-lab';
const SLOTS = ['sense', 'think', 'tell', 'power', 'connect'];
const rupee = n => '₹' + n.toLocaleString('en-IN');
const clean = s => String(s || '').replace(/[\u0000-\u001f\u007f<>]/g, '').trim().slice(0, 18);

/* ---------- save ---------- */
let SAVE = {v:1, done:{}, best:{}, look:0, name:''};
try{ const s = JSON.parse(localStorage.getItem(KEY)); if(s && typeof s === 'object'){
  SAVE.look = s.look === 1 ? 1 : 0; SAVE.name = clean(s.name);
  for(const m of MS){ const d = Math.floor(+(s.done || {})[m.id]), b = Math.floor(+(s.best || {})[m.id]); if(d >= 1) SAVE.done[m.id] = Math.min(3, d); if(b >= 0 && b <= 100 && (s.best || {})[m.id] != null) SAVE.best[m.id] = b; } } }catch(e){}
const persist = () => { try{ localStorage.setItem(KEY, JSON.stringify(SAVE)); }catch(e){} };
const openCount = () => Math.min(MS.length, 3 + Object.keys(SAVE.done).length);
const me = () => SAVE.name || 'Junior Scientist';

/* ---------- sound ---------- */
let AC = null;
function sfx(kind){ try{ AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if(AC.state === 'suspended') AC.resume();
  const N = {ok:[660, 880], no:[260, 200], tap:[720], win:[523, 659, 784, 1046], step:[600, 760], warn:[440, 400]}[kind] || [500];
  N.forEach((f, i) => { const o = AC.createOscillator(), g = AC.createGain(), t = AC.currentTime + i * .08; o.type = kind === 'no' ? 'sawtooth' : 'triangle'; o.frequency.value = f;
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.09, t + .012); g.gain.exponentialRampToValueAtTime(.0001, t + .2); o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t + .25); });
}catch(e){} }
let toastT = 0;
function toast(m){ const t = $('#toast'); t.textContent = m; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => t.hidden = true, 2600); }

/* ---------- characters (code-drawn) ---------- */
function kid(look, cls){
  const girl = look === 1, skin = girl ? '#c88f63' : '#b77d55', hair = '#1d1416';
  return `<svg class="${cls || ''}" viewBox="0 0 200 220" aria-hidden="true">
    <ellipse cx="100" cy="212" rx="60" ry="7" fill="#000" opacity=".1"/>
    <path d="M44 216 C44 160 60 140 100 140 C140 140 156 160 156 216 Z" fill="#fff" stroke="#2b1d14" stroke-width="4"/>
    <path d="M100 142 L84 216 M100 142 L116 216" stroke="#d8d2c8" stroke-width="3"/><rect x="118" y="168" width="16" height="20" rx="3" fill="#7cc6ef" stroke="#2b1d14" stroke-width="3"/>
    <path d="M88 140 L100 158 L112 140" fill="${girl ? '#e8457a' : '#2f8a4e'}" stroke="#2b1d14" stroke-width="3"/>
    ${girl ? `<path d="M52 90 C46 130 52 150 60 156 L70 110 Z" fill="${hair}"/><path d="M148 90 C154 130 148 150 140 156 L130 110 Z" fill="${hair}"/>` : ''}
    <circle cx="100" cy="88" r="46" fill="${skin}" stroke="#2b1d14" stroke-width="4"/>
    <path d="M54 82 C56 46 80 34 102 34 C128 34 148 50 146 84 C134 70 120 62 100 62 C82 62 66 70 54 82 Z" fill="${hair}"/>
    ${girl ? '<circle cx="134" cy="46" r="10" fill="#e8457a" stroke="#2b1d14" stroke-width="3"/>' : ''}
    <g><rect x="62" y="56" width="32" height="18" rx="8" fill="#7cc6ef" stroke="#2b1d14" stroke-width="3" opacity=".9"/><rect x="106" y="56" width="32" height="18" rx="8" fill="#7cc6ef" stroke="#2b1d14" stroke-width="3" opacity=".9"/><path d="M94 64 H106" stroke="#2b1d14" stroke-width="3"/></g>
    <circle cx="82" cy="92" r="5" fill="#2b1d14"/><circle cx="118" cy="92" r="5" fill="#2b1d14"/><circle cx="84" cy="90" r="1.6" fill="#fff"/><circle cx="120" cy="90" r="1.6" fill="#fff"/>
    <circle cx="72" cy="106" r="6" fill="#f29a8a" opacity=".6"/><circle cx="128" cy="106" r="6" fill="#f29a8a" opacity=".6"/>
    <path d="M86 110 Q100 124 114 110" fill="none" stroke="#2b1d14" stroke-width="4" stroke-linecap="round"/></svg>`;
}
function person(w, mood, cls){
  const L = w.look, mouth = mood === 'happy' ? 'M84 122 Q100 138 116 122' : mood === 'sad' ? 'M86 130 Q100 118 114 130' : mood === 'hope' ? 'M86 124 Q100 130 114 124' : 'M86 126 H114';
  const brow = mood === 'sad' || mood === 'worried' ? '<path d="M72 80 L90 86 M128 80 L110 86" stroke="#2b1d14" stroke-width="4" stroke-linecap="round"/>' : '<path d="M72 82 Q81 77 90 82 M110 82 Q119 77 128 82" stroke="#2b1d14" stroke-width="4" fill="none" stroke-linecap="round"/>';
  const acc = {
    bindi:'<circle cx="100" cy="74" r="4" fill="#c8403a"/>',
    glasses:'<circle cx="82" cy="98" r="13" fill="none" stroke="#2b1d14" stroke-width="3"/><circle cx="118" cy="98" r="13" fill="none" stroke="#2b1d14" stroke-width="3"/><path d="M95 98 H105" stroke="#2b1d14" stroke-width="3"/>',
    towel:'<path d="M52 70 C60 40 140 40 148 70 C130 60 70 60 52 70 Z" fill="#f2f2f2" stroke="#2b1d14" stroke-width="3"/>',
    turban:'<path d="M50 78 C46 40 154 40 150 78 C130 66 70 66 50 78 Z" fill="#f2b134" stroke="#2b1d14" stroke-width="3"/><path d="M60 62 Q100 48 140 62" stroke="#c8552f" stroke-width="4" fill="none"/>',
    plaits:'<path d="M58 96 C50 130 56 150 64 160" stroke="#1d1416" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M142 96 C150 130 144 150 136 160" stroke="#1d1416" stroke-width="12" fill="none" stroke-linecap="round"/><circle cx="64" cy="160" r="6" fill="#e8457a"/><circle cx="136" cy="160" r="6" fill="#e8457a"/>'}[L.acc] || '';
  const hairTop = L.acc === 'turban' || L.acc === 'towel' ? '' : `<path d="M54 92 C52 50 76 36 100 36 C124 36 148 50 146 92 C138 70 120 60 100 60 C80 60 62 70 54 92 Z" fill="${L.hair}"/>`;
  return `<svg class="${cls || ''}" viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="98" fill="#fff1d9"/>
    <path d="M40 200 C40 156 64 142 100 142 C136 142 160 156 160 200 Z" fill="${L.top}" stroke="#2b1d14" stroke-width="4"/>
    ${L.acc === 'plaits' ? acc : ''}<circle cx="100" cy="98" r="46" fill="${L.skin}" stroke="#2b1d14" stroke-width="4"/>${hairTop}
    <circle cx="82" cy="98" r="5" fill="#2b1d14"/><circle cx="118" cy="98" r="5" fill="#2b1d14"/>${brow}
    <path d="${mouth}" fill="none" stroke="#2b1d14" stroke-width="4" stroke-linecap="round"/>${mood === 'sad' ? '<path d="M126 108 q4 8 0 12 q-4 -4 0 -12" fill="#7cc6ef"/>' : ''}
    ${L.acc !== 'plaits' ? acc : ''}</svg>`;
}
const ICON = {farm:'🌾', ajji:'💊', leaf:'🍅', jumbo:'🐘', school:'📚', well:'💧'};

/* ================= TITLE ================= */
function title(){
  app.innerHTML = `<section class="title"><div class="tcard"><div><span class="kick">Gamified Edu · AI in Remote Areas</span><h1><span>VILLAGE</span><span>LAB</span></h1><p class="tag">Junior Scientist</p>
    <p class="pitch">Real people. Real problems. You listen, you think, you build something that actually works in a village with patchy power, no internet and a tight budget. Then the village tells you if it helped.</p>
    <div class="row"><button class="btn main big" id="go" type="button">${Object.keys(SAVE.done).length ? 'Back to the village' : 'Start your first project'}</button><a class="btn ghost" href="../#cat-ai-remote">Back to Gamified Edu</a></div></div>
    <div class="who"><div id="avbig">${kid(SAVE.look, 'av')}</div><div class="looks" role="radiogroup" aria-label="Choose your scientist">${[0, 1].map(l => `<button type="button" role="radio" aria-checked="${SAVE.look === l}" class="${SAVE.look === l ? 'on' : ''}" data-l="${l}" aria-label="Look ${l + 1}">${kid(l)}</button>`).join('')}</div>
    <div class="field"><label for="nm">Your scientist name</label><input id="nm" maxlength="18" autocomplete="off" placeholder="Junior Scientist" value="${esc(SAVE.name)}"></div></div></div></section>`;
  app.querySelectorAll('.looks button').forEach(b => b.onclick = () => { SAVE.look = +b.dataset.l; persist(); sfx('tap'); title(); });
  $('#nm').addEventListener('input', e => { SAVE.name = clean(e.target.value); persist(); });
  $('#go').onclick = () => { SAVE.name = clean($('#nm').value); persist(); sfx('tap'); map(); };
}

/* ================= VILLAGE MAP ================= */
function villageSVG(){
  const n = openCount();
  const huts = [[120, 360], [200, 400], [610, 300], [700, 350], [470, 440], [300, 470]].map(([x, y]) => `<g transform="translate(${x},${y})"><rect x="-28" y="-26" width="56" height="34" fill="#f4dfb8" stroke="#7a4d2c" stroke-width="3"/><path d="M-36 -24 L0 -54 L36 -24 Z" fill="#c8552f" stroke="#7a4d2c" stroke-width="3"/><rect x="-7" y="-12" width="14" height="20" fill="#7a4d2c"/></g>`).join('');
  const trees = Array.from({length:14}, (_, i) => { const x = 760 + (i % 5) * 52 + (i > 4 ? 22 : 0), y = 70 + Math.floor(i / 5) * 46; return `<g transform="translate(${x},${y})"><rect x="-4" y="0" width="8" height="22" fill="#6b4226"/><circle r="24" fill="${i % 2 ? '#2f8a4e' : '#1f6b3a'}"/></g>`; }).join('');
  const pins = MS.map((m, i) => { const op = i < n, done = SAVE.done[m.id], x = m.map[0] * 1000, y = m.map[1] * 620;
    return `<g class="pin ${op ? '' : 'locked'}" data-i="${i}" tabindex="${op ? 0 : -1}" role="button" aria-label="${esc(m.title)}${op ? '' : ' (locked)'}">
      ${op && !done ? `<circle class="halo" cx="${x}" cy="${y - 34}" r="30" fill="#f2b134" opacity=".5"/>` : ''}
      <path d="M${x} ${y} L${x - 14} ${y - 22} A26 26 0 1 1 ${x + 14} ${y - 22} Z" class="head" fill="${!op ? '#bba98e' : done ? '#2f8a4e' : '#c8552f'}" stroke="#2b1d14" stroke-width="3"/>
      <text x="${x}" y="${y - 30}" text-anchor="middle" font-size="22">${op ? ICON[m.id] : '🔒'}</text>
      <text x="${x}" y="${y + 22}" text-anchor="middle" font-family="Unbounded,sans-serif" font-weight="800" font-size="15" fill="#2b1d14" paint-order="stroke" stroke="#fffaf0" stroke-width="5">${esc(m.title)}</text></g>`; }).join('');
  return `<svg viewBox="0 0 1000 620" role="group" aria-label="Village map">
    <defs><linearGradient id="vs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fd8f7"/><stop offset="1" stop-color="#e6f5fc"/></linearGradient></defs>
    <rect width="1000" height="620" fill="url(#vs)"/><circle cx="120" cy="80" r="40" fill="#f2b134"/>
    <path d="M0 230 Q160 150 330 210 T640 190 T1000 200 V620 H0 Z" fill="#9cc96b"/><path d="M0 280 Q200 230 420 270 T1000 260 V620 H0 Z" fill="#7fb553"/>
    ${trees}<text x="880" y="235" text-anchor="middle" font-weight="800" font-size="14" fill="#1f4a2a">FOREST EDGE</text>
    <g opacity=".9">${Array.from({length:7}, (_, i) => `<path d="M40 ${420 + i * 22} Q200 ${410 + i * 22} 330 ${425 + i * 22}" stroke="#5f9a3a" stroke-width="6" fill="none"/>`).join('')}</g>
    <g opacity=".9">${Array.from({length:6}, (_, i) => `<path d="M680 ${400 + i * 22} Q820 ${392 + i * 22} 960 ${402 + i * 22}" stroke="#c96b3a" stroke-width="6" fill="none"/>`).join('')}</g>
    <path d="M520 620 C540 560 470 520 500 470 C530 420 600 420 640 380 C690 330 740 330 820 300" stroke="#6fbbe6" stroke-width="20" fill="none" stroke-linecap="round" opacity=".85"/>
    ${huts}
    <g transform="translate(360,190)"><rect x="-56" y="-34" width="112" height="56" fill="#f9e7c4" stroke="#7a4d2c" stroke-width="3"/><path d="M-64 -32 H64 L52 -52 H-52 Z" fill="#3f6fd6" stroke="#2b1d14" stroke-width="3"/><rect x="-10" y="-8" width="20" height="30" fill="#7a4d2c"/><text y="-16" text-anchor="middle" font-size="12" font-weight="800" fill="#2b1d14">SCHOOL</text></g>
    <g transform="translate(500,330)"><path d="M-22 -40 L0 -70 L22 -40 Z" fill="#f2b134" stroke="#7a4d2c" stroke-width="3"/><rect x="-26" y="-40" width="52" height="40" fill="#fff3d6" stroke="#7a4d2c" stroke-width="3"/><circle cx="20" cy="-56" r="6" fill="#c8552f"/></g>
    <g transform="translate(600,520)"><ellipse rx="34" ry="12" fill="#5d6b78" stroke="#2b1d14" stroke-width="3"/><rect x="-34" y="-30" width="68" height="30" fill="#9aa4ae" stroke="#2b1d14" stroke-width="3"/><path d="M-30 -30 V-60 H30 V-30 M-30 -60 H30" stroke="#6b4226" stroke-width="5" fill="none"/></g>
    ${pins}</svg>`;
}
function map(){
  const solved = Object.keys(SAVE.done).length, total = Object.values(SAVE.best).reduce((a, b) => a + b, 0);
  app.innerHTML = `<header class="bar"><button class="ib" id="back" type="button" aria-label="Title">←</button><div class="me">${kid(SAVE.look)}<div><b>${esc(me())}</b><small>${solved}/6 ideas built · ${total} idea points</small></div></div><a class="ib" href="../#cat-ai-remote">GE</a></header>
    <section class="mapwrap"><div class="mapcard">${villageSVG()}</div>
    <div class="side"><div class="panelc"><span class="kick">Your village</span><h2 style="font-size:1.1rem">Who needs you today?</h2><p class="muted">Tap someone on the map. Every problem is real: listen first, then build. Solve one to unlock the next.</p></div>
    <ul class="mlist">${MS.map((m, i) => { const op = i < openCount(), st = SAVE.done[m.id] || 0;
      return `<li><button class="mitem" type="button" data-i="${i}" ${op ? '' : 'disabled'}>${person(m.who, st ? 'happy' : 'worried')}<div><b>${esc(m.title)}</b><small>${esc(m.who.name)} · ${esc(m.who.role)}</small></div><span class="sc">${st ? `${SAVE.best[m.id]}/100<i>${'★'.repeat(st)}${'☆'.repeat(3 - st)}</i>` : op ? 'New' : '🔒'}</span></button></li>`; }).join('')}</ul></div></section>`;
  $('#back').onclick = title;
  const go = i => { sfx('tap'); mission(i); };
  app.querySelectorAll('.pin:not(.locked)').forEach(p => { p.addEventListener('click', () => go(+p.dataset.i)); p.addEventListener('keydown', e => { if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); go(+p.dataset.i); } }); });
  app.querySelectorAll('.mitem:not(:disabled)').forEach(b => b.onclick = () => go(+b.dataset.i));
}

/* ================= MISSION ================= */
let M = null;
const STEPS = ['Listen', 'Define', 'Build', 'Field test', 'Pitch'];
function mission(i){
  const m = MS[i];
  M = {i, m, step:0, asked:[], def:null, defOrder:shuffle(m.define.map((d, k) => k)), qOrder:shuffle(m.questions.map((q, k) => k)), pick:{}, tests:0, firstWorks:null,
    impOrder:shuffle(m.impact.map((x, k) => k)), pitch:{name:'', impact:null, maintain:null, feedback:null}};
  render();
}
const knowsBudget = () => M.asked.some(k => M.m.questions[k].budget);
const cost = () => SLOTS.reduce((a, s) => a + (M.pick[s] ? PARTS[s].items[M.pick[s]].cost : 0), 0);
const slotPts = s => { const o = M.m.slots[s].find(x => x.id === M.pick[s]); return o ? o.pts : 0; };
function mood(){
  if(M.step <= 1) return 'worried'; if(M.step === 2) return 'hope';
  const avg = SLOTS.reduce((a, s) => a + slotPts(s), 0) / 5; return avg >= 3.2 ? 'happy' : avg >= 2.2 ? 'hope' : 'sad';
}
function render(){
  const m = M.m, w = m.who, notes = M.asked.map(k => m.questions[k]).filter(q => q.good);
  app.innerHTML = `<header class="bar"><button class="ib" id="back" type="button" aria-label="Village">←</button><div><b>${ICON[m.id]} ${esc(m.title)}</b><small>Project for ${esc(w.name)}</small></div><div class="me">${kid(SAVE.look)}</div></header>
    <nav class="steps" aria-label="Project steps">${STEPS.map((s, k) => `<span class="${k === M.step ? 'on' : k < M.step ? 'done' : ''}">${k < M.step ? '✓ ' : ''}${s}</span>`).join('')}</nav>
    <section class="mgrid"><aside class="person">${person(w, mood(), 'face')}<h2>${esc(w.name)}, ${w.age}</h2><p class="role">${esc(w.role)}</p>
      <div class="bubble">${esc(m.story)}</div>
      ${notes.length ? `<div class="notes"><h3>📝 Field notes</h3>${notes.map(q => `<div class="note">${esc(q.note)}</div>`).join('')}</div>` : ''}</aside>
    <div class="work" id="work"></div></section>`;
  $('#back').onclick = map;
  [stepListen, stepDefine, stepBuild, stepTest, stepPitch][M.step]();
  window.scrollTo({top:0});
}
function next(){ M.step++; sfx('step'); render(); }

/* 1. Listen */
function stepListen(){
  const m = M.m, left = 3 - M.asked.length;
  $('#work').innerHTML = `<span class="kick">Step 1 · Listen</span><h2>Ask ${esc(m.who.name)} 3 questions</h2>
    <p class="muted">Good scientists listen before they build. Pick questions that tell you about their life, their tools and their limits, not ones that push your own idea.</p>
    <div class="chat">${M.asked.map(k => { const q = m.questions[k]; return `<div class="q">${esc(q.q)}</div><div class="a ${q.good ? '' : 'meh'}">${esc(q.a)}</div>`; }).join('')}</div>
    ${left ? `<p style="font-weight:800;margin:0">${left} question${left > 1 ? 's' : ''} left</p><div class="qs">${M.qOrder.filter(k => !M.asked.includes(k)).map(k => `<button class="qbtn" type="button" data-k="${k}">${esc(m.questions[k].q)}</button>`).join('')}</div>`
      : `<div class="row"><button class="btn main big" id="nx" type="button">I understand the problem →</button></div>`}`;
  app.querySelectorAll('.qbtn').forEach(b => b.onclick = () => { const k = +b.dataset.k, q = m.questions[k]; M.asked.push(k); sfx(q.good ? 'ok' : 'warn'); if(q.good) toast('New field note: ' + q.note); render(); });
  const nx = $('#nx'); if(nx) nx.onclick = next;
}
/* 2. Define */
function stepDefine(){
  const m = M.m;
  $('#work').innerHTML = `<span class="kick">Step 2 · Define</span><h2>What is the real problem?</h2>
    <p class="muted">A sharp problem names the person, what goes wrong, and why. Too small and you build the wrong thing; too big and you build nothing.</p>
    <div class="qs">${M.defOrder.map(k => `<button class="opt ${M.def === k ? 'on' : ''}" type="button" data-k="${k}">${esc(m.define[k].t)}</button>`).join('')}</div>
    <div class="row"><button class="btn main big" id="nx" type="button" ${M.def == null ? 'disabled' : ''}>Lock it in →</button></div>`;
  app.querySelectorAll('.opt').forEach(b => b.onclick = () => { M.def = +b.dataset.k; sfx('tap'); stepDefine(); });
  $('#nx').onclick = next;
}
/* 3. Build */
function stepBuild(){
  const m = M.m, c = cost(), kb = knowsBudget(), all = SLOTS.every(s => M.pick[s]);
  $('#work').innerHTML = `<span class="kick">Step 3 · Build</span><h2>Design your invention</h2>
    <p class="muted">Every smart device does five things. Pick one part for each. Think about what ${esc(m.who.name)} told you: phones, power, signal, money. Use AI only where it really helps.</p>
    <div class="budget"><b>Cost: ${rupee(c)}</b>${kb ? `<div class="b3"><i class="${c > m.budget ? 'over' : ''}" style="width:${Math.min(100, c / m.budget * 100)}%"></i></div><span>Budget ${rupee(m.budget)}</span>` : `<span class="muted">Budget unknown. You didn’t ask about money.</span>`}</div>
    <div class="slots">${SLOTS.map(s => `<fieldset class="slot"><legend>${PARTS[s].label}</legend><p class="ask">${esc(PARTS[s].ask)}</p><div class="sopts">${m.slots[s].map(o => { const it = PARTS[s].items[o.id];
      return `<button class="opt ${M.pick[s] === o.id ? 'on' : ''}" type="button" data-s="${s}" data-id="${o.id}" aria-pressed="${M.pick[s] === o.id}">${esc(it.name)}<small>${it.cost ? rupee(it.cost) : 'Free'}</small></button>`; }).join('')}</div></fieldset>`).join('')}</div>
    <div class="row"><button class="btn main big" id="nx" type="button" ${all ? '' : 'disabled'}>🧪 Run the field test</button>${all ? '' : `<span class="muted" style="align-self:center">${5 - SLOTS.filter(s => M.pick[s]).length} parts to pick</span>`}</div>`;
  app.querySelectorAll('.slot .opt').forEach(b => b.onclick = () => { M.pick[b.dataset.s] = b.dataset.id; sfx('tap'); const y = window.scrollY; stepBuild(); window.scrollTo({top:y}); });
  $('#nx').onclick = next;
}
/* 4. Field test */
function worksScore(){ const c = cost(), b = M.m.budget; return slotPts('power') * 1.5 + slotPts('connect') * 1.5 + (c <= b ? 8 : c <= b * 1.3 ? 4 : 0); }
function stepTest(){
  const m = M.m; M.tests++; if(M.firstWorks == null) M.firstWorks = worksScore() + slotPts('sense') + slotPts('think') + slotPts('tell');
  const lines = SLOTS.map(s => { const o = m.slots[s].find(x => x.id === M.pick[s]); return {s:PARTS[s].label, name:PARTS[s].items[o.id].name, pts:o.pts, why:o.why}; });
  const c = cost(); lines.push({s:'BUDGET', name:`${rupee(c)} of ${rupee(m.budget)}`, pts:c <= m.budget ? 4 : c <= m.budget * 1.3 ? 2 : 0, why:c <= m.budget ? `Fits what ${m.who.name}’s family can spend.` : c <= m.budget * 1.3 ? 'A bit over budget. Can a cheaper part do the same job?' : 'Far over budget. They can’t afford it.'});
  const bad = lines.filter(l => l.pts <= 2).length;
  $('#work').innerHTML = `<span class="kick">Step 4 · Field test${M.tests > 1 ? ` (try ${M.tests})` : ''}</span><h2>${esc(m.who.name)} tries it for a week</h2>
    <ul class="tests" id="tl"></ul><div id="after" hidden><p style="font-weight:700">${bad ? `${bad} thing${bad > 1 ? 's' : ''} to fix. Real engineers test, fail and improve. Going back to the bench is smart, not a loss.` : 'Everything held up in the real village. Time to pitch it.'}</p>
    <div class="row">${bad ? `<button class="btn main big" id="fix" type="button">🔧 Back to the bench</button><button class="btn ghost" id="nx" type="button">Pitch it anyway</button>` : `<button class="btn main big" id="nx" type="button">Pitch it →</button><button class="btn ghost" id="fix" type="button">Tweak the design</button>`}</div></div>`;
  const tl = $('#tl');
  lines.forEach((l, k) => setTimeout(() => { if(!tl.isConnected) return; const cls = l.pts >= 3 ? 'ok' : l.pts === 2 ? 'warn' : 'no';
    tl.insertAdjacentHTML('beforeend', `<li><span class="ic ${cls}" aria-label="${cls}">${cls === 'ok' ? '✓' : cls === 'warn' ? '!' : '✕'}</span><div><b>${l.s}: ${esc(l.name)}</b>${esc(l.why)}</div></li>`); sfx(cls === 'ok' ? 'ok' : cls === 'warn' ? 'warn' : 'no');
    if(k === lines.length - 1){ const a = $('#after'); a.hidden = false; $('#fix').onclick = () => { M.step = 2; render(); }; $('#nx').onclick = next; } }, 450 + k * 520));
}
/* 5. Pitch */
function stepPitch(){
  const m = M.m, P = M.pitch, ready = P.impact != null && P.maintain != null && P.feedback != null;
  const grp = (key, list, order, label) => `<fieldset class="slot"><legend>${label}</legend><div class="qs">${order.map(k => `<button class="opt ${P[key] === k ? 'on' : ''}" type="button" data-g="${key}" data-k="${k}">${esc(list[k].t.replace('{name}', m.who.name))}</button>`).join('')}</div></fieldset>`;
  $('#work').innerHTML = `<span class="kick">Step 5 · Pitch</span><h2>Present it to ${esc(m.who.name)}</h2>
    <div class="field"><label for="pn">Name your invention</label><input id="pn" maxlength="18" autocomplete="off" placeholder="e.g. Soil Talk" value="${esc(P.name)}"></div>
    <div class="slots">${grp('impact', m.impact, M.impOrder, 'WHAT WILL CHANGE?')}${grp('maintain', COMMON.maintain, [0, 1, 2], 'WHO KEEPS IT WORKING?')}${grp('feedback', COMMON.feedback, [0, 1, 2], 'WHAT NEXT?')}</div>
    <div class="row"><button class="btn main big" id="nx" type="button" ${ready ? '' : 'disabled'}>🎤 Present it</button></div>`;
  $('#pn').addEventListener('input', e => { P.name = clean(e.target.value); });
  app.querySelectorAll('[data-g]').forEach(b => b.onclick = () => { P[b.dataset.g] = +b.dataset.k; sfx('tap'); const y = window.scrollY; stepPitch(); window.scrollTo({top:y}); });
  $('#nx').onclick = () => { P.name = clean($('#pn').value); results(); };
}

/* ================= SCORE ================= */
function scoreAll(){
  const m = M.m, kind = m.define[M.def].kind, good = M.asked.filter(k => m.questions[k].good).length;
  const cat = {
    problem: {sharp:20, surface:8, broad:4}[kind],
    empathy: Math.min(20, good * 5 + (slotPts('tell') >= 3 ? 5 : 0)),
    design: slotPts('sense') * 2 + slotPts('think') * 2 + slotPts('tell'),
    works: Math.round(worksScore()),
    impact: m.impact[M.pitch.impact].pts + COMMON.maintain[M.pitch.maintain].pts + COMMON.feedback[M.pitch.feedback].pts};
  const nowWorks = worksScore() + slotPts('sense') + slotPts('think') + slotPts('tell'), iterated = M.tests > 1 && nowWorks > M.firstWorks;
  let total = Object.values(cat).reduce((a, b) => a + b, 0) + (iterated ? 3 : 0); total = Math.min(100, Math.round(total));
  return {cat, total, iterated, good, kind};
}
function results(){
  const m = M.m, R = scoreAll(), T = R.total;
  const tier = T >= 85 ? 'Village Hero' : T >= 70 ? 'Smart Fix' : T >= 50 ? 'Bright Idea' : 'First Spark';
  const st = T >= 85 ? 3 : T >= 70 ? 2 : 1, md = T >= 80 ? 'happy' : T >= 55 ? 'hope' : 'sad', say = m.thanks[T >= 80 ? 2 : T >= 55 ? 1 : 0];
  const prevSt = SAVE.done[m.id] || 0; SAVE.done[m.id] = Math.max(prevSt, st); SAVE.best[m.id] = Math.max(SAVE.best[m.id] || 0, T); persist();
  const LBL = {problem:'Real problem', empathy:'Empathy', design:'Smart design', works:'Works in the village', impact:'Impact & heart'};
  const worst = s => m.slots[s].find(x => x.id === M.pick[s]);
  const fix = {
    problem:`Sharpen the problem: name who it hurts, what goes wrong and why. “${m.define.find(d => d.kind === 'sharp').t}”`,
    empathy:`You asked ${R.good} useful question${R.good === 1 ? '' : 's'}. Ask about their phone, power, money and daily routine, and talk to them in their language.`,
    design:(() => { const s = ['sense', 'think', 'tell'].sort((a, b) => slotPts(a) - slotPts(b))[0]; return `${PARTS[s].label}: ${worst(s).why}`; })(),
    works:(() => { const c = cost(); if(c > m.budget) return `It costs ${rupee(c)} against a budget of ${rupee(m.budget)}. Find cheaper parts that do the same job.`; const s = slotPts('power') <= slotPts('connect') ? 'power' : 'connect'; return `${PARTS[s].label}: ${worst(s).why}`; })(),
    impact:(() => { const a = [[m.impact[M.pitch.impact].pts / 6, 'Promise what you can really deliver, for this person, not the whole world.'], [COMMON.maintain[M.pitch.maintain].pts / 7, COMMON.maintain[M.pitch.maintain].why], [COMMON.feedback[M.pitch.feedback].pts / 7, COMMON.feedback[M.pitch.feedback].why]].sort((x, y) => x[0] - y[0]); return a[0][1]; })()};
  const good = {problem:'You found the real, sharp problem.', empathy:'You listened before building, and it talks in their language.', design:'Smart parts, and AI only where it adds value.', works:'It survives power cuts, weak signal and a tight budget.', impact:'An honest promise, local repair and a plan to keep improving.'};
  const keys = Object.keys(R.cat), wins = keys.filter(k => R.cat[k] >= 16), fixes = keys.filter(k => R.cat[k] < 16).sort((a, b) => R.cat[a] - R.cat[b]).slice(0, 3);
  const inv = M.pitch.name || 'your invention';
  $('#work').innerHTML = `<span class="kick">Idea score</span><div class="score"><div><div class="big" id="bigs">0<small>/100</small></div><div class="stars3" aria-label="${st} of 3 stars">${'★'.repeat(st)}<span>${'★'.repeat(3 - st)}</span></div></div>
      <div><span class="tier">${tier}</span><h2 style="margin-top:8px">${esc(m.who.name)} on ${esc(inv)}</h2><div class="bubble" style="margin-top:8px">“${esc(say)}”</div></div></div>
    <div class="bars">${keys.map(k => `<div><span>${LBL[k]}</span><span class="t"><i data-w="${R.cat[k] * 5}"></i></span><span>${R.cat[k]}/20</span></div>`).join('')}${R.iterated ? '<div><span>Tested & improved</span><span class="t"><i data-w="100"></i></span><span>+3</span></div>' : ''}</div>
    <div class="fbk"><div class="panelc"><h3 style="font-size:.95rem">💪 What went well</h3><ul>${(wins.length ? wins.map(k => good[k]) : ['You finished a full design cycle: listen, define, build, test, pitch.']).map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>
      <div class="panelc"><h3 style="font-size:.95rem">🔧 Level up next time</h3><ul>${(fixes.length ? fixes.map(k => fix[k]) : ['Try another village problem. Each one has different limits.']).map(x => `<li>${esc(x)}</li>`).join('')}</ul></div></div>
    <p class="real">🌍 <b>Real world:</b> ${esc(m.real)}</p>
    <div class="row"><button class="btn main big" id="vb" type="button">Back to the village</button><button class="btn ghost" id="ag" type="button">Rebuild this project</button></div>`;
  app.querySelector('.person .face').outerHTML = person(m.who, md, 'face');
  sfx(T >= 70 ? 'win' : 'step');
  requestAnimationFrame(() => app.querySelectorAll('.bars i').forEach(i => i.style.width = i.dataset.w + '%'));
  let n = 0; const big = $('#bigs'); const tick = () => { if(!big.isConnected) return; n = Math.min(T, n + Math.max(1, Math.round(T / 40))); big.innerHTML = `${n}<small>/100</small>`; if(n < T) requestAnimationFrame(tick); }; tick();
  $('#vb').onclick = () => { if(!prevSt) toast(Object.keys(SAVE.done).length + 3 <= MS.length ? 'A new villager needs your help!' : 'Idea saved. Sparks are waiting in Gamified Edu.'); map(); };
  $('#ag').onclick = () => mission(M.i);
  window.scrollTo({top:0});
}

/* test hook (only with ?test in the URL): read-only state */
if(/[?&]test\b/.test(location.search)) window.__vlTest = () => M && {id:M.m.id, step:M.step, asked:M.asked.slice(), pick:Object.assign({}, M.pick), def:M.def, tests:M.tests,
  good:M.m.questions.map((q, k) => q.good ? k : -1).filter(k => k >= 0), sharp:M.m.define.findIndex(d => d.kind === 'sharp'), best:Object.fromEntries(SLOTS.map(s => [s, M.m.slots[s].slice().sort((a, b) => b.pts - a.pts)[0].id])),
  impactBest:M.m.impact.findIndex(x => x.pts === 6)};
title();
})();
