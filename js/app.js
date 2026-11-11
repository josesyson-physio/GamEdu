/* Gamified Edu demo: router, navigation, HUD, sound, presenter walkthrough */
'use strict';
(function(){
/* refuse to run inside another site's frame (same protection as Anatomy Run) */
if(window.top !== window.self){
  const d = document.createElement('div'); d.className = 'framed';
  const a = document.createElement('a'); a.href = location.href; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.textContent = 'Open Gamified Edu in a new tab';
  d.appendChild(a); document.body.replaceChildren(d); throw new Error('Gamified Edu: framed by another site');
}
const $ = id => document.getElementById(id);
const app = $('app');

/* ---------- sound (tiny Web Audio cues, start only after a tap) ---------- */
let AC = null;
function sfx(kind){
  try{
    AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if(AC.state === 'suspended') AC.resume();
    const notes = {good:[660, 880], bad:[300, 220], buy:[523, 659, 784], win:[523, 659, 784, 1046], tap:[740], unlock:[392, 523, 659, 880]}[kind] || [600];
    notes.forEach((f, i) => { const o = AC.createOscillator(), g = AC.createGain(), t = AC.currentTime + i * .08;
      o.type = kind === 'bad' ? 'sawtooth' : 'triangle'; o.frequency.value = f; g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.12, t + .015); g.gain.exponentialRampToValueAtTime(.0001, t + .22);
      o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t + .25); });
  }catch(e){}
}
/* ---------- toast + HUD ---------- */
let toastT = 0;
function toast(msg){ const t = $('toast'); t.textContent = msg; t.hidden = false; t.classList.remove('out'); clearTimeout(toastT); toastT = setTimeout(() => { t.classList.add('out'); setTimeout(() => t.hidden = true, 300); }, 2800); }
let lastSp = null, lastXp = null;
function refreshHud(){
  const s = GE.state.get();
  [['hudSparks', s.sparks, lastSp], ['hudXp', s.xp, lastXp]].forEach(([id, v, prev]) => { const el = $(id); el.textContent = v; if(prev != null && prev !== v){ el.parentElement.classList.remove('bump'); void el.offsetWidth; el.parentElement.classList.add('bump'); } });
  lastSp = s.sparks; lastXp = s.xp;
  const L = GE.state.levelInfo(); $('hudLvl').textContent = 'Lv ' + L.level;
}

/* ---------- Jo sprites inside rendered views ---------- */
function paintJo(){
  const look = GE.state.get().look;
  document.querySelectorAll('#joHeroImg, #joMapImg, .cardjo').forEach(img => img.setAttribute('href', GE.art.joURL(look, 'idle')));
  const av = $('profAv'); if(av){ av.replaceChildren(GE.art.joCanvas(look, 6, 'wave')); }
  const hj = $('hudJo'); if(hj){ hj.replaceChildren(GE.art.joCanvas(look, 2)); }
}

/* ---------- routing ---------- */
const ROUTES = {home:'home', explore:'explore', library:'library', learning:'learning', clinic:'clinic', profile:'profile', lab:'lab', future:'future', 'future-preview':'future', 'game-anatomy-run':'anatomyRun'};
const NAV_OF = {home:'home', explore:'explore', 'cat':'explore', 'game-anatomy-run':'explore', library:'library', lab:'library', learning:'learning', clinic:'clinic', future:'clinic', 'future-preview':'clinic', profile:'profile'};
function route(){
  const h = (location.hash || '#home').slice(1) || 'home';
  let html, key = h;
  const events = GE.state.syncEvidence();
  try{
    if(h.startsWith('cat-')){ html = GE.views.category(h.slice(4)); key = 'cat'; }
    else if(h === 'lab'){ html = '<div id="labRoot" class="lab"></div>'; }
    else if(h === 'future' || h === 'future-preview'){ html = GE.views.future(h === 'future-preview'); if(h === 'future-preview') GE.state.markVision(); }
    else if(ROUTES[h]) html = GE.views[ROUTES[h]]();
    else html = GE.views.notFound();
  }catch(e){ console.error(e); html = `<section class="wrap pagehead"><h1>Something went wrong</h1><p>This screen failed to load. <a href="#home">Go home</a> or reset the demo from your profile.</p></section>`; }
  app.classList.add('leaving');
  requestAnimationFrame(() => {
    app.innerHTML = html; app.classList.remove('leaving'); app.classList.toggle('dark', h === 'lab');
    document.body.dataset.route = key;
    document.querySelectorAll('[data-nav]').forEach(a => a.classList.toggle('on', a.dataset.nav === (NAV_OF[key] || '')));
    bind(h); paintJo(); refreshHud(); walkSync(h);
    if(!app.dataset.first) app.dataset.first = '1'; else window.scrollTo({top: 0, behavior: 'instant' in window ? 'instant' : 'auto'});
    const h1 = app.querySelector('h1'); if(h1){ h1.setAttribute('tabindex', '-1'); }
    events.forEach(ev => toast(ev.kind === 'level' ? `Anatomy Run level ${ev.n}: +20 sparks, +40 XP` : `Stage ${ev.n} complete! New buildings unlocked`));
  });
}
function bind(h){
  if(h === 'lab'){ GE.lab.open(); }
  const sim = $('simMs'); if(sim) sim.addEventListener('click', () => { GE.state.simulateMilestone(); sfx('unlock'); route(); });
  const tv = $('toggleVision'); if(tv) tv.addEventListener('click', () => { location.hash = h === 'future-preview' ? '#future' : '#future-preview'; });
  if(h === 'clinic') bindClinic();
  if(h === 'profile'){
    document.querySelectorAll('.look').forEach(b => b.addEventListener('click', () => { GE.state.setLook(+b.dataset.l); route(); }));
    $('resetAsk').addEventListener('click', () => { $('resetConfirm').hidden = false; $('resetAsk').hidden = true; });
    $('resetNo').addEventListener('click', () => { $('resetConfirm').hidden = true; $('resetAsk').hidden = false; });
    $('resetYes').addEventListener('click', () => { GE.state.reset(); GE.lab.reset(); toast('Demo progress reset'); location.hash = '#home'; route(); });
  }
}
function bindClinic(){
  const panel = $('bPanel');
  const open = id => {
    panel.innerHTML = GE.views.buildingPanel(id); panel.hidden = false; panel.dataset.b = id; sfx('tap');
    document.querySelectorAll('.bld').forEach(g => g.classList.toggle('sel', g.dataset.b === id));
    $('pClose').addEventListener('click', () => { panel.hidden = true; document.querySelectorAll('.bld.sel').forEach(g => g.classList.remove('sel')); });
    const buy = $('buyB'); if(buy) buy.addEventListener('click', () => {
      const r = GE.state.buyBuilding(id);
      if(!r.ok){ toast(r.msg); sfx('bad'); return; }
      sfx('buy'); toast(`${GE.BUILDINGS.find(b => b.id === id).name}: level ${r.lvl} · −${r.cost} sparks · +${r.xp} XP`);
      $('mapWrap').innerHTML = GE.art.clinicMap(); bindMap(); paintJo(); refreshHud();
      const g = document.querySelector(`.bld[data-b="${id}"]`); if(g){ g.classList.add('just'); }
      open(id);
      const stats = document.querySelector('.clinic-stats'); if(stats){ const s = GE.state.get(); stats.children[0].querySelector('b').textContent = Object.values(s.buildings).filter(Boolean).length; stats.children[1].querySelector('b').textContent = s.sparks; }
    });
  };
  function bindMap(){
    document.querySelectorAll('.bld').forEach(g => {
      g.addEventListener('click', () => open(g.dataset.b));
      g.addEventListener('keydown', e => { if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); open(g.dataset.b); } });
    });
  }
  bindMap();
  // centre the map on small screens
  const mw = $('mapWrap'); if(mw && mw.scrollWidth > mw.clientWidth) mw.scrollLeft = (mw.scrollWidth - mw.clientWidth) / 2;
}

/* ---------- presenter walkthrough ---------- */
const WALK = [
  {go:'#home', t:'Explore Gamified Edu', d:'One universe of educational games. Learn it, play it, master it.'},
  {go:'#explore', t:'Choose a world', d:'Physiotherapy is live. School, Science, Maths and more are clearly marked as coming.'},
  {go:'#cat-physio', t:'Enter Physiotherapy', d:'Eight skill areas and a learning ladder from “knows” to “shows how”.'},
  {go:'#game-anatomy-run', t:'Open Anatomy Run', d:'The real, live game opens in its own tab. Its progress flows back here.'},
  {go:'#game-anatomy-run', t:'Reach a milestone', d:'Play 6 levels, or press “Simulate milestone” for the demo. It is logged as simulated.', act:'sim'},
  {go:'#learning', t:'Earn sparks and XP', d:'Stage 1 complete: sparks for the clinic, XP for learning. Assessment Lab is unlocked.'},
  {go:'#lab', t:'Play Assessment Lab', d:'A second, separate game: three challenges and a hands-on goniometry task.'},
  {go:'#clinic', t:'Upgrade Jo’s Clinic', d:'Build the Assessment Lab and Diagnostic Wing. Buildings visibly change with each level.'},
  {go:'#learning', t:'Reveal future progression', d:'Stages 3 to 6 show what comes next: reasoning, rehab planning, practice, technology.'},
  {go:'#future-preview', t:'Preview the Smart Clinic', d:'The destination: robotics, AI analysis, hydrotherapy and research, revealed stage by stage.'}
];
let walkI = -1;
function walkRender(){
  const w = $('walk'); if(walkI < 0){ w.hidden = true; $('walkBtn').setAttribute('aria-expanded', 'false'); return; }
  const s = WALK[walkI]; w.hidden = false; $('walkBtn').setAttribute('aria-expanded', 'true');
  w.innerHTML = `<div class="wtop"><span class="mono">STEP ${walkI + 1} / ${WALK.length}</span><button type="button" id="wClose" aria-label="Close walkthrough">×</button></div><b>${GE.art.esc(s.t)}</b><p>${GE.art.esc(s.d)}</p>
    ${s.act === 'sim' && !GE.state.stageDone(1) ? '<button class="btn gold" id="wSim" type="button">Simulate milestone</button>' : ''}
    <div class="wnav"><button class="btn ghost" id="wPrev" type="button" ${walkI ? '' : 'disabled'}>Back</button><button class="btn gold" id="wNext" type="button">${walkI < WALK.length - 1 ? 'Next' : 'Finish'}</button></div>`;
  $('wClose').addEventListener('click', () => { walkI = -1; walkRender(); });
  $('wPrev').addEventListener('click', () => { walkI--; location.hash = WALK[walkI].go; walkRender(); });
  $('wNext').addEventListener('click', () => { if(walkI >= WALK.length - 1){ walkI = -1; walkRender(); toast('Walkthrough complete'); return; } walkI++; const to = WALK[walkI].go; if(location.hash === to) route(); else location.hash = to; walkRender(); });
  const ws = $('wSim'); if(ws) ws.addEventListener('click', () => { GE.state.simulateMilestone(); sfx('unlock'); route(); walkRender(); });
}
function walkSync(){ if(walkI >= 0) walkRender(); }

/* ---------- init ---------- */
$('walkBtn').addEventListener('click', () => { walkI = walkI < 0 ? 0 : -1; if(walkI === 0) location.hash = WALK[0].go; walkRender(); });
window.addEventListener('hashchange', route);
window.addEventListener('storage', e => { if(e.key === GE.state.AR_KEY && (location.hash || '#home') !== '#lab') route(); });
document.addEventListener('visibilitychange', () => {   // back from the Anatomy Run tab: pick up new progress
  if(document.hidden) return; const h = (location.hash || '#home').slice(1);
  if(h === 'lab' || h === 'clinic'){ const ev = GE.state.syncEvidence(); refreshHud(); ev.forEach(e => toast(e.kind === 'level' ? `Anatomy Run level ${e.n}: +20 sparks, +40 XP` : `Stage ${e.n} complete!`)); }
  else route(); });
GE.state.badge('welcome'); GE.state.save();
GE.ui = {toast, sfx, refreshHud};
route();
})();
