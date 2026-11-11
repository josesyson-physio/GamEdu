/* Assessment Lab: the second, independent game. Three challenges + one practical goniometry task. */
'use strict';
(function(){
const esc = s => GE.art.esc(s);
let run = null;   // {i, answers:[], prac:{...}}

function root(){ return document.getElementById('labRoot'); }
function C(){ return window.LAB_CONTENT; }
function demoBanner(){
  if(C().status === 'reviewed') return '';
  if(C().status === 'draft') return `<div class="lab-flag" role="note"><b>Draft content, pending clinical review.</b> These challenges are written for the demo and have not yet been approved by the review panel.</div>`;
  return `<div class="lab-flag" role="note"><b>Demonstration content.</b> These challenge slots are waiting for questions from the clinical review panel. They are not validated clinical teaching.</div>`;
}
function progressDots(){
  const total = C().challenges.length + 1;
  const at = run ? (run.stage === 'q' ? run.i : run.stage === 'prac' ? total - 1 : total) : -1;
  return `<ol class="lab-dots" aria-label="Mission progress">${Array.from({length: total}, (_, k) =>
    `<li class="${k < at ? 'done' : k === at ? 'now' : ''}"><span class="sr">${k < total - 1 ? 'Challenge ' + (k + 1) : 'Practical task'}</span></li>`).join('')}</ol>`;
}

function intro(){
  const ev = GE.state.evidence();
  const unlocked = GE.state.stageDone(1, ev);
  const s = GE.state.get();
  let h = `<div class="lab-shell"><header class="lab-head"><div><span class="lab-kicker">ASSESSMENT LAB</span><h1>${esc(C().mission.title)}</h1></div><a class="lab-x" href="#library" aria-label="Leave the lab">Exit</a></header>`;
  if(!unlocked){
    h += `<div class="lab-card lab-lock"><svg class="i" aria-hidden="true"><use href="#ic-lock"/></svg><h2>Locked</h2><p>Assessment Lab opens when Jo completes <b>Stage 1: Anatomical Foundations</b>, shown by solving 6 Anatomy Run levels.</p>
      <p class="muted">Progress: ${ev.arLevels} of 6 levels${ev.ar.found ? '' : ' (no Anatomy Run progress found on this device yet)'}.</p>
      <div class="row"><a class="btn gold" href="#game-anatomy-run">Play Anatomy Run</a><a class="btn ghost" href="#learning">See the skill map</a></div></div></div>`;
    return h;
  }
  h += demoBanner();
  h += `<div class="lab-card lab-intro"><div class="chart"><div class="chart-top"><span>PATIENT CHART</span><span class="mono">MISSION 01</span></div>
    <p class="brief">${esc(C().mission.brief)}</p><ul class="lab-steps">${C().challenges.map((c, i) => `<li><span class="mono">0${i + 1}</span>${esc(c.skill)}${s.lab.correct[i] ? ' <em>passed</em>' : ''}</li>`).join('')}
    <li><span class="mono">0${C().challenges.length + 1}</span>Practical: ${esc(C().practical.skill)}${s.lab.practical ? ' <em>passed</em>' : ''}</li></ul></div>
    <div class="rewards"><div><b>+40</b><span>sparks per correct challenge</span></div><div><b>+50</b><span>XP per correct challenge</span></div><div><b>Stage 2</b><span>unlocks the Diagnostic Wing</span></div></div>
    <button class="btn gold big" id="labStart" type="button">${s.lab.attempts ? 'Run the mission again' : 'Start the mission'}</button></div></div>`;
  return h;
}

function question(){
  const c = C().challenges[run.i];
  return `<div class="lab-shell"><header class="lab-head"><div><span class="lab-kicker">ASSESSMENT LAB · ${esc(c.skill.toUpperCase())}</span><h1>${esc(c.title)}</h1></div>${progressDots()}</header>${demoBanner()}
    <div class="lab-card"><div class="story"><span class="mono">CASE</span><p>${esc(c.story)}</p></div>
    <h2 class="q">${esc(c.question)}</h2><div class="lab-opts" role="group" aria-label="Answers">${c.options.map((o, k) => `<button class="lab-opt" type="button" data-k="${k}"><span class="mono">${String.fromCharCode(65 + k)}</span>${esc(o)}</button>`).join('')}</div>
    <div id="labFb" class="lab-fb" hidden></div></div></div>`;
}
function answer(k){
  const c = C().challenges[run.i], ok = k === c.correct;
  run.answers[run.i] = ok;
  root().querySelectorAll('.lab-opt').forEach(b => { const kk = +b.dataset.k; b.disabled = true; if(kk === c.correct) b.classList.add('right'); else if(kk === k) b.classList.add('wrong'); });
  const fb = root().querySelector('#labFb');
  fb.hidden = false; fb.className = 'lab-fb ' + (ok ? 'ok' : 'no');
  fb.innerHTML = `<b>${ok ? 'Correct.' : 'Not this time.'}</b> ${esc(c.explanation)}${c.reference ? `<div class="ref">Reference: ${esc(c.reference)}</div>` : ''}${c.reviewed ? `<div class="ref">Reviewed by ${esc(c.reviewer)}</div>` : ''}
    <button class="btn gold" id="labNext" type="button">${run.i < C().challenges.length - 1 ? 'Next challenge' : 'Go to the practical task'}</button>`;
  GE.ui.sfx(ok ? 'good' : 'bad');
  fb.querySelector('#labNext').focus({preventScroll: true});
}

/* ---------- practical: virtual goniometer ---------- */
function practical(){
  const p = C().practical;
  run.prac = run.prac || {target: 55 + Math.round(Math.random() * 70), step: 0, axis: false, arm: 20};
  const r = run.prac;
  return `<div class="lab-shell"><header class="lab-head"><div><span class="lab-kicker">PRACTICAL · SHOWS HOW</span><h1>${esc(p.title)}</h1></div>${progressDots()}</header>${demoBanner()}
    <div class="lab-card prac"><div class="prac-grid"><div class="gonio-wrap">${gonioSVG(r)}</div>
    <div class="prac-side"><ol class="prac-steps">${p.steps.map((s, i) => `<li class="${i < r.step ? 'done' : i === r.step ? 'now' : ''}">${esc(s)}</li>`).join('')}</ol>
    <div id="pracCtl">${pracControls(r)}</div><div class="ref">Method: ${esc(p.reference)}</div></div></div></div></div>`;
}
function gonioSVG(r){
  // elbow at (0,0); humerus to the left; forearm rotated up by target degrees from straight
  const t = r.target * Math.PI / 180, a = r.arm * Math.PI / 180;
  const fx = Math.cos(t) * 150, fy = -Math.sin(t) * 150;
  const mx = Math.cos(a) * 130, my = -Math.sin(a) * 130;
  let o = `<svg class="gonio" viewBox="-230 -190 420 260" role="img" aria-label="Side view of an arm with a goniometer">`;
  o += `<rect x="-230" y="-190" width="420" height="260" fill="#0f2e33"/>`;
  // upper arm and forearm (soft limb shapes)
  o += `<line x1="-200" y1="0" x2="0" y2="0" stroke="#d2936a" stroke-width="44" stroke-linecap="round"/>`;
  o += `<line x1="0" y1="0" x2="${fx}" y2="${fy}" stroke="#c98458" stroke-width="36" stroke-linecap="round"/>`;
  o += `<circle cx="${fx}" cy="${fy}" r="20" fill="#d2936a"/>`;
  o += `<text x="-196" y="-30" class="glbl">Acromion ←</text><text x="${fx * 1.08}" y="${fy * 1.08 - 26}" class="glbl" text-anchor="middle">Radial styloid</text>`;
  // landmark choices
  const marks = [['epi', 0, 0, 'Lateral epicondyle'], ['olec', -26, 14, 'Olecranon'], ['rad', Math.cos(t) * 34, -Math.sin(t) * 34 + 6, 'Radial head']];
  if(!r.axis) o += marks.map(([id, x, y, n]) => `<g class="mark" data-m="${id}" tabindex="0" role="button" aria-label="Place axis on ${n}"><circle cx="${x}" cy="${y}" r="13" fill="rgba(127,227,210,.25)" stroke="#7fe3d2" stroke-width="2"/><circle cx="${x}" cy="${y}" r="3.5" fill="#7fe3d2"/></g>`).join('');
  else {
    // goniometer: stationary arm to the left, moving arm at r.arm, protractor dial
    o += `<g class="gm"><rect x="-150" y="-6" width="150" height="12" rx="6" fill="rgba(230,240,240,.92)" stroke="#173F31"/>`;
    o += `<g transform="rotate(${-r.arm})"><rect x="0" y="-6" width="140" height="12" rx="6" fill="rgba(242,199,92,.95)" stroke="#173F31"/><polygon points="140,-9 156,0 140,9" fill="#F2C75C"/></g>`;
    o += `<circle r="34" fill="rgba(255,255,255,.12)" stroke="#e8f0f0"/>`;
    for(let d = 0; d <= 180; d += 15){ const q = -d * Math.PI / 180; o += `<line x1="${Math.cos(q) * 28}" y1="${Math.sin(q) * 28}" x2="${Math.cos(q) * 34}" y2="${Math.sin(q) * 34}" stroke="#e8f0f0" stroke-width="${d % 45 ? 1 : 2}"/>`; }
    o += `<circle r="5" fill="#173F31" stroke="#F2C75C" stroke-width="2"/></g>`;
    o += `<g id="gHandle" class="ghandle" tabindex="0" role="slider" aria-label="Moving arm angle" aria-valuemin="0" aria-valuemax="170" aria-valuenow="${r.arm}"><circle cx="${mx}" cy="${my}" r="16" fill="rgba(242,199,92,.35)" stroke="#F2C75C" stroke-width="2"/></g>`;
    o += `<text x="60" y="52" class="gread">Reading: <tspan id="gRead">${r.step >= 3 ? r.arm + '°' : '…'}</tspan></text>`;
  }
  return o + '</svg>';
}
function pracControls(r){
  if(!r.axis) return `<p class="muted">Tap the landmark where the goniometer axis belongs.</p><p id="pracMsg" class="prac-msg" aria-live="polite"></p>`;
  if(r.step < 3) return `<label class="mono" for="armRange">Moving arm</label><input id="armRange" type="range" min="0" max="170" value="${r.arm}"><p class="muted">Drag the gold handle (or use the slider) until the moving arm lines up with the forearm.</p><button class="btn gold" id="pracRead" type="button">Lock it and read the angle</button>`;
  return `<div class="lab-fb ${r.pass ? 'ok' : 'no'}"><b>${r.pass ? 'Passed.' : 'Not within 5°.'}</b> You measured <b>${r.arm}°</b>. The forearm was at <b>${r.target}°</b> of flexion (error ${Math.abs(r.arm - r.target)}°).
    ${r.pass ? 'Accurate goniometry depends on the axis over the lateral epicondyle and the arms along the bone landmarks, exactly as you did.' : 'Line the moving arm up with the forearm toward the radial styloid, not with the skin edge. Try a new angle.'}
    <div class="row">${r.pass ? '<button class="btn gold" id="pracDone" type="button">See mission results</button>' : '<button class="btn gold" id="pracRetry" type="button">Try a new angle</button>'}</div></div>`;
}
function bindPractical(){
  const R = root(), r = run.prac;
  R.querySelectorAll('.mark').forEach(m => {
    const go = () => {
      if(m.dataset.m === 'epi'){ r.axis = true; r.step = 1; GE.ui.sfx('good'); render(); }
      else { GE.ui.sfx('bad'); const msg = R.querySelector('#pracMsg'); if(msg) msg.textContent = m.dataset.m === 'olec' ? 'That is the olecranon, behind the joint. The axis sits over the lateral epicondyle.' : 'That is the radial head, below the joint line. The axis sits over the lateral epicondyle.'; }
    };
    m.addEventListener('click', go); m.addEventListener('keydown', e => { if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); go(); } });
  });
  const setArm = v => { r.arm = Math.max(0, Math.min(170, Math.round(v))); if(r.step < 2) r.step = 2;
    const svgWrap = R.querySelector('.gonio-wrap'); svgWrap.innerHTML = gonioSVG(r); bindHandle();
    const rg = R.querySelector('#armRange'); if(rg) rg.value = r.arm;
    R.querySelectorAll('.prac-steps li').forEach((li, i) => li.className = i < r.step ? 'done' : i === r.step ? 'now' : ''); };
  const rg = R.querySelector('#armRange'); if(rg) rg.addEventListener('input', () => setArm(+rg.value));
  function bindHandle(){
    const svg = R.querySelector('svg.gonio'), h = R.querySelector('#gHandle'); if(!h || r.step >= 3) return;
    let drag = false;
    const angleAt = e => { const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY; const q = pt.matrixTransform(svg.getScreenCTM().inverse()); return Math.atan2(-q.y, q.x) * 180 / Math.PI; };
    h.addEventListener('pointerdown', e => { drag = true; h.setPointerCapture(e.pointerId); e.preventDefault(); });
    h.addEventListener('pointermove', e => { if(drag) setArm(angleAt(e)); });
    h.addEventListener('pointerup', () => { drag = false; });
    h.addEventListener('keydown', e => { if(e.key === 'ArrowRight' || e.key === 'ArrowDown'){ e.preventDefault(); setArm(r.arm - 1); R.querySelector('#gHandle').focus(); } if(e.key === 'ArrowLeft' || e.key === 'ArrowUp'){ e.preventDefault(); setArm(r.arm + 1); R.querySelector('#gHandle').focus(); } });
  }
  bindHandle();
  const rd = R.querySelector('#pracRead');
  if(rd) rd.addEventListener('click', () => { r.step = 3; r.pass = Math.abs(r.arm - r.target) <= C().practical.tolerance; GE.ui.sfx(r.pass ? 'good' : 'bad'); render(); });
  const rt = R.querySelector('#pracRetry'); if(rt) rt.addEventListener('click', () => { run.prac = {target: 55 + Math.round(Math.random() * 70), step: 1, axis: true, arm: 20}; render(); });
  const dn = R.querySelector('#pracDone'); if(dn) dn.addEventListener('click', finish);
}

function finish(){
  const before = GE.state.get().sparks, xpBefore = GE.state.get().xp;
  const res = GE.state.recordLab(run.answers.map(Boolean), {pass: !!(run.prac && run.prac.pass)});
  const events = GE.state.syncEvidence();
  const s = GE.state.get();
  run.stage = 'done';
  const gained = s.sparks - before, xp = s.xp - xpBefore, total = C().challenges.length;
  let h = `<div class="lab-shell"><header class="lab-head"><div><span class="lab-kicker">MISSION RESULTS</span><h1>${res.score} of ${total} challenges · practical ${run.prac && run.prac.pass ? 'passed' : 'not passed'}</h1></div>${progressDots()}</header>`;
  h += `<div class="lab-card results"><div class="tally"><div><b>+${gained}</b><span>sparks (clinic currency)</span></div><div><b>+${xp}</b><span>XP (learning progress)</span></div></div>`;
  if(res.firstClear){
    h += `<div class="unlock-banner"><svg class="i" aria-hidden="true"><use href="#ic-spark"/></svg><div><b>Stage 2: Assessment Skills complete</b><span>Skills earned: Patient history · Special tests · Red-flag recognition · Range of motion. The Diagnostic Wing is now available in Jo's Clinic.</span></div></div>`;
    h += `<p class="muted">These are game achievements that show learning progress. They are not a professional qualification or clinical certification.</p>`;
  } else if(GE.state.get().lab.done){
    h += `<p>Mission already complete. Replays keep your skills sharp; rewards are paid once per challenge.</p>`;
  } else {
    h += `<p>To complete Stage 2, get every challenge right and pass the practical. You keep credit for the parts you already passed.</p>`;
  }
  h += `<div class="next-mission"><span class="mono">NEXT MISSION</span><b>Mission 2: The neurological screen</b><span>Coming in the next Assessment Lab update: dermatomes, myotomes and reflexes.</span></div>`;
  h += `<div class="row"><a class="btn gold" href="#clinic">Open Jo's Clinic</a><a class="btn ghost" href="#learning">View skill map</a><button class="btn ghost" id="labAgain" type="button">Play again</button></div></div></div>`;
  root().innerHTML = h;
  root().querySelector('#labAgain').addEventListener('click', start);
  GE.ui.refreshHud(); if(res.firstClear) GE.ui.toast('Stage 2 complete: Diagnostic Wing available');
  GE.ui.sfx('win');
}
function start(){ run = {stage:'q', i:0, answers:[], prac:null}; render(); }
function render(){
  const R = root(); if(!R) return;
  if(!run || run.stage === 'intro'){ R.innerHTML = intro(); const b = R.querySelector('#labStart'); if(b) b.addEventListener('click', start); return; }
  if(run.stage === 'q'){ R.innerHTML = question(); R.querySelectorAll('.lab-opt').forEach(b => b.addEventListener('click', () => answer(+b.dataset.k)));
    R.addEventListener('click', onNext); return; }
  if(run.stage === 'prac'){ R.innerHTML = practical(); bindPractical(); }
}
function onNext(e){
  if(e.target && e.target.id === 'labNext'){
    root().removeEventListener('click', onNext);
    if(run.i < C().challenges.length - 1){ run.i++; render(); } else { run.stage = 'prac'; render(); }
  }
}
GE.lab = {open(){ run = null; render(); }, reset(){ run = null; }};
})();
