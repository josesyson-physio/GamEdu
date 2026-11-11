/* Gamified Edu demo: screens */
'use strict';
(function(){
const A = () => GE.art, S = () => GE.state.get(), esc = s => GE.art.esc(s);
const statusPill = st => `<span class="pill st-${st}">${GE.STATUS_LABEL[st]}</span>`;
const sparkI = '<svg class="i" aria-hidden="true"><use href="#ic-spark"/></svg>';
const lockI = '<svg class="i" aria-hidden="true"><use href="#ic-lock"/></svg>';

function gameCard(g){
  const ev = GE.state.evidence();
  let status, cta, href;
  if(g.id === 'anatomy-run'){ status = 'Play now · free'; cta = ev.arReal ? `Continue · ${ev.arReal}/22 levels` : 'Play'; href = '#game-anatomy-run'; }
  else if(g.id === 'assessment-lab'){ const open = GE.state.stageDone(1, ev); status = open ? (S().lab.done ? 'Completed' : 'Unlocked') : 'Locked · finish Stage 1'; cta = open ? 'Enter the lab' : 'See how to unlock'; href = open ? '#lab' : '#learning'; }
  else { status = 'Progression hub'; cta = 'Open the clinic'; href = '#clinic'; }
  return `<a class="gcard" href="${href}"><div class="art">${A().cardArt(g.id)}<span class="kind">${g.kind === 'real' ? 'Live game' : g.id === 'clinic' ? 'Platform feature' : 'Demo game'}</span></div>
    <div class="body"><span class="subj">${esc(g.subject)}</span><h3>${esc(g.name)}</h3><p>${esc(g.desc)}</p><div class="foot"><span class="status">${esc(status)}</span><span class="cta">${esc(cta)} →</span></div></div></a>`;
}
function catCard(c){
  return `<a class="ccard env-${c.env}" href="#cat-${c.id}"><div class="art">${A().cardArt(c.id)}</div><div class="body">${statusPill(c.status)}<h3>${esc(c.name)}</h3><p>${esc(c.blurb)}</p></div></a>`;
}
function journeyStrip(){
  const ev = GE.state.evidence();
  return `<ol class="journey">${GE.STAGES.map(st => { const done = GE.state.stageDone(st.n, ev), pr = GE.state.stageProgress(st.n, ev);
    return `<li class="${done ? 'done' : pr > 0 ? 'active' : st.live ? 'next' : 'future'}"><span class="n">${done ? '✓' : st.n}</span><b>${esc(st.name)}</b><span class="bar"><i style="--p:${Math.round(pr * 100)}%"></i></span><small>${st.live ? esc(st.game) : 'Future module'}</small></li>`; }).join('')}</ol>`;
}

/* ---------- HOME ---------- */
function home(){
  const ev = GE.state.evidence();
  return `<section class="hero">${A().heroWorld()}<div class="hero-copy"><span class="eyebrow">An educational gaming universe</span><h1 class="brand">GAMIFIED EDU</h1>
    <p class="tag">LEARN IT. PLAY IT. MASTER IT.</p><p class="sub">Your next learning adventure starts here.</p>
    <div class="row"><a class="btn gold big" href="#explore">Explore games</a><a class="btn cream" href="#game-anatomy-run">Continue learning</a><a class="btn ghost light" href="#clinic">Discover Jo's Clinic</a></div></div></section>
  <section class="wrap"><div class="sechead"><h2>Featured adventures</h2><a href="#library">My library →</a></div><div class="grid3">${GE.GAMES.map(gameCard).join('')}</div></section>
  <section class="wrap"><div class="sechead"><h2>Continue playing</h2></div>
    <div class="continue"><div class="art">${A().cardArt('anatomy-run')}</div><div class="body"><span class="subj">Physiotherapy · Anatomy Run</span><h3>${ev.arReal ? `${ev.arReal} of 22 levels solved` : 'Start with level 1: Upper Limb Hills'}</h3>
      <div class="meter"><i style="--p:${Math.round(ev.arReal / 22 * 100)}%"></i></div><p>${ev.ar.found ? 'Progress read from Anatomy Run on this device.' : 'No Anatomy Run progress on this device yet. Your progress appears here automatically after you play.'}</p>
      <a class="btn gold" href="#game-anatomy-run">Continue</a></div></div></section>
  <section class="wrap"><div class="sechead"><h2>Explore categories</h2><a href="#explore">All categories →</a></div><div class="grid3">${GE.CATEGORIES.slice(0, 3).map(catCard).join('')}</div></section>
  <section class="wrap two"><div><div class="sechead"><h2>Popular games</h2></div><ul class="rank">${GE.GAMES.slice(0, 2).map((g, i) => `<li><span class="n">${i + 1}</span><a href="${g.id === 'anatomy-run' ? '#game-anatomy-run' : '#lab'}"><b>${esc(g.name)}</b><small>${esc(g.subject)}</small></a></li>`).join('')}</ul></div>
    <div><div class="sechead"><h2>New experiences</h2></div><ul class="news"><li><b>Assessment Lab</b><span>A second game with a hands-on goniometry task.</span></li><li><b>Jo's Clinic</b><span>12 buildings, from reception to a futuristic smart clinic.</span></li><li><b>More categories</b><span>School, Science and Maths worlds are coming.</span></li></ul></div></section>
  <section class="wrap"><div class="sechead"><h2>My learning journey</h2><a href="#learning">Skill map →</a></div>${journeyStrip()}</section>`;
}

/* ---------- EXPLORE + CATEGORY ---------- */
function explore(){
  return `<section class="wrap pagehead"><span class="eyebrow">Explore</span><h1>Choose a world</h1><p>Each subject is its own world with its own games. Physiotherapy is open now; the others are on the way and are clearly marked.</p></section>
  <section class="wrap"><div class="grid3">${GE.CATEGORIES.map(catCard).join('')}</div></section>`;
}
function category(id){
  const c = GE.CATEGORIES.find(x => x.id === id); if(!c) return notFound();
  if(c.id === 'physio') return physio();
  return `<section class="catworld env-${c.env}"><div class="art">${A().cardArt(c.id)}</div><div class="wrap"><a class="back" href="#explore">← Explore</a>${statusPill(c.status)}<h1>${esc(c.name)}</h1><p>${esc(c.blurb)}</p></div></section>
  <section class="wrap"><div class="soon"><h2>${c.status === 'soon' ? 'Coming soon' : 'Future expansion'}</h2><p>This world is not playable yet. Nothing here is a working product; it shows the planned direction.</p>
    <h3>Planned experiences</h3><ul class="planned">${c.planned.map(p => `<li>${lockI}${esc(p)}</li>`).join('')}</ul><a class="btn gold" href="#cat-physio">Play the Physiotherapy world instead</a></div></section>`;
}
function physio(){
  const ev = GE.state.evidence();
  return `<section class="catworld env-physio"><div class="art">${A().cardArt('physio')}</div><div class="wrap"><a class="back" href="#explore">← Explore</a>${statusPill('available')}<h1>Physiotherapy & Health Sciences</h1><p>Learn the body, assess like a clinician and build Jo's clinic as you go.</p></div></section>
  <section class="wrap"><div class="sechead"><h2>Skill areas</h2></div><div class="chips">${GE.PHYSIO_SKILLS.map(s => `<span class="chip">${esc(s)}</span>`).join('')}</div></section>
  <section class="wrap"><div class="sechead"><h2>Games in this world</h2></div><div class="grid3">${GE.GAMES.map(gameCard).join('')}</div></section>
  <section class="wrap"><div class="sechead"><h2>How the learning builds</h2></div>${millerLadder()}<p class="muted small">Based on Miller's pyramid of clinical competence. Games can build “knows”, “knows how” and “shows how”. “Does” only happens in supervised clinical practice.</p></section>`;
}
function millerLadder(){
  return `<ol class="miller">${GE.MILLER.slice().reverse().map((m, i) => `<li class="m-${m.id}" style="--w:${55 + i * 15}%"><b>${esc(m.name)}</b><span>${esc(m.desc)}</span><small>${esc(m.where)}</small></li>`).join('')}</ol>`;
}

/* ---------- GAME PROFILE: Anatomy Run ---------- */
function anatomyRun(){
  const ev = GE.state.evidence();
  const keep = ['Jo, with two looks','22 levels across 4 worlds','Creator, Student and Pro modes','Clue gems and diagnosis','Flashcards and recap','Sparks, My Clinic and Jo’s story'];
  return `<section class="gamehero"><div class="art">${A().cardArt('anatomy-run')}</div><div class="wrap"><a class="back" href="#cat-physio">← Physiotherapy</a><span class="pill st-available">Live game</span><h1>Anatomy Run</h1>
    <p>Run, collect clinical clue gems and make the diagnosis. Upper Limb Hills, Sports Ground, Spine Canyon and Neuro Nights.</p>
    <div class="row"><a class="btn gold big" href="${GE.ANATOMY_RUN_URL}" target="_blank" rel="noopener noreferrer" id="launchAR">Launch Anatomy Run ↗</a><a class="btn ghost light" href="#learning">How it unlocks skills</a></div>
    <p class="note">Opens the real game in its own tab. It runs on its own, with its own security and privacy protections.</p></div></section>
  <section class="wrap two"><div><div class="sechead"><h2>Your progress</h2></div>
    <div class="stat-grid"><div><b>${ev.arReal}</b><span>levels solved (real)</span></div><div><b>${Math.max(0, 6 - ev.arLevels)}</b><span>levels to Stage 1</span></div><div><b>${ev.ar.found ? ev.ar.sparks : '–'}</b><span>sparks inside Anatomy Run</span></div></div>
    <p class="muted small">${ev.ar.found ? 'Read from Anatomy Run on this device. The platform never changes your Anatomy Run save.' : 'No Anatomy Run progress on this device yet. Play on this same browser and it appears here.'}</p>
    ${GE.state.stageDone(1, ev) ? '' : `<div class="simbox"><b>Presenter control</b><p>Simulate the Stage 1 milestone (6 solved levels) for a walkthrough. Clearly logged as simulated.</p><button class="btn ghost" type="button" id="simMs">Simulate milestone</button></div>`}</div>
    <div><div class="sechead"><h2>In the game</h2></div><ul class="ticks">${keep.map(k => `<li>${esc(k)}</li>`).join('')}</ul>
    <p class="muted small">Anatomy Run's in-game sparks stay inside Anatomy Run. The platform awards its own sparks and XP for the levels you solve.</p></div></section>`;
}

/* ---------- LIBRARY ---------- */
function library(){
  return `<section class="wrap pagehead"><span class="eyebrow">My library</span><h1>Your games</h1><p>Everything you can play, and what's next.</p></section><section class="wrap"><div class="grid3">${GE.GAMES.map(gameCard).join('')}</div></section>
  <section class="wrap"><div class="sechead"><h2>Coming to your library</h2></div><ul class="planned">${GE.STAGES.filter(s => !s.live).map(s => `<li>${lockI}<b>${esc(s.name)}</b> · ${esc(s.game)}</li>`).join('')}</ul></section>`;
}

/* ---------- SKILL MAP ---------- */
function learning(){
  const ev = GE.state.evidence();
  const rows = GE.STAGES.map(st => {
    const done = GE.state.stageDone(st.n, ev), pr = GE.state.stageProgress(st.n, ev), sk = GE.state.skillsOf(st.n, ev), fr = GE.STAGE_FRAME[st.n];
    const state = done ? 'done' : (st.n === 1 || GE.state.stageDone(st.n - 1, ev)) && st.live ? 'active' : st.live ? 'next' : 'future';
    return `<li class="stage ${state}"><div class="node"><span>${done ? '✓' : st.n}</span></div><div class="card">
      <div class="top"><div><span class="eyebrow">Stage ${st.n} · ${esc(st.live ? st.game : 'Future game module')}</span><h3>${esc(st.name)}</h3></div><div class="ring" style="--p:${Math.round(pr * 100)}"><b>${Math.round(pr * 100)}%</b></div></div>
      <div class="frame">${fr.miller.map(m => `<span class="mtag m-${m}">${esc(GE.MILLER.find(x => x.id === m).name)}</span>`).join('')}${fr.domains.map(d => `<span class="dtag">${esc(d)}</span>`).join('')}</div>
      <ul class="skills">${sk.map(s => `<li class="${s.got ? 'got' : ''}" title="${esc(s.need)}"><span class="dot"></span>${esc(s.name)}<small>${s.got ? 'Earned' : esc(s.need)}</small></li>`).join('')}</ul>
      <div class="unlock"><b>Unlocks:</b> ${esc(st.unlockText)}</div>
      ${st.evidence ? `<div class="evid"><b>Learning evidence:</b> ${esc(st.evidence)}</div>` : ''}
      ${st.n === 1 && !done ? `<div class="row"><a class="btn gold" href="#game-anatomy-run">Play Anatomy Run</a></div>` : ''}
      ${st.n === 2 && GE.state.stageDone(1, ev) && !done ? `<div class="row"><a class="btn gold" href="#lab">Play Assessment Lab</a></div>` : ''}
    </div></li>`;
  }).join('');
  return `<section class="wrap pagehead"><span class="eyebrow">My learning</span><h1>Skill map</h1><p>Skills unlock only from what you show in the games. Sparks build the clinic; they never buy a skill.</p></section>
  <section class="wrap"><ol class="stages">${rows}</ol>
  <p class="muted small disclaimer">Game achievements show learning progress. They are not professional qualifications or clinical certification. Competency areas follow widely used frameworks (Miller's pyramid; communication, teamwork, ethical practice and lifelong learning as stressed in competency-based physiotherapy curricula).</p></section>`;
}

/* ---------- CLINIC ---------- */
function clinic(){
  const s = S(), built = Object.values(s.buildings).filter(Boolean).length;
  return `<section class="clinic-page"><div class="clinic-top wrap"><div><span class="eyebrow">Jo's Clinic</span><h1>From one room to a smart rehab centre</h1><p>Tap a building. Sparks build and upgrade. Learning stages unlock new buildings.</p></div>
    <div class="clinic-stats"><div><b>${built}</b><span>of 12 buildings</span></div><div><b>${s.sparks}</b><span>sparks</span></div><a class="btn gold" href="#future">Futuristic clinic →</a></div></div>
    <div class="mapwrap" id="mapWrap">${A().clinicMap()}</div>
    <aside class="bpanel" id="bPanel" hidden></aside>
    <div class="wrap legend"><span><i class="lg built"></i>Built (tap to upgrade)</span><span><i class="lg plot"></i>Ready to build</span><span><i class="lg locked"></i>Locked by a learning stage</span><span class="sim">All spark transactions are simulated demo progress.</span></div></section>`;
}
function buildingPanel(id){
  const b = GE.BUILDINGS.find(x => x.id === id), st = GE.state.buildingState(b);
  const lv = [1, 2, 3].map(l => `<li class="${st.lvl >= l ? 'have' : ''}"><b>Level ${l}</b><span>${l === 1 ? 'Core building' : l === 2 ? 'Second floor, extra wing, solar roof' : 'Glass dome, garden, lit windows'}</span><em>${b.cost[l - 1] ? b.cost[l - 1] + ' sparks' : 'Free'}</em></li>`).join('');
  let action;
  if(!st.unlocked) action = `<div class="req">${lockI}<div><b>Locked</b><span>${esc(st.req)}</span></div></div><a class="btn ghost" href="#learning">See the skill map</a>`;
  else if(st.nextCost == null) action = `<div class="req ok"><b>Fully upgraded</b><span>This building is at its highest level.</span></div>`;
  else action = `<button class="btn gold big" id="buyB" data-b="${b.id}" type="button" ${st.canAfford ? '' : 'disabled'}>${st.lvl ? 'Upgrade to level ' + (st.lvl + 1) : 'Build'} · ${sparkI}${st.nextCost}</button>${st.canAfford ? '' : `<p class="muted small">You need ${st.nextCost - S().sparks} more sparks. Earn them by solving Anatomy Run levels and Assessment Lab challenges.</p>`}`;
  return `<button class="pclose" id="pClose" type="button" aria-label="Close">×</button><span class="eyebrow">${st.unlocked ? (st.lvl ? 'Level ' + st.lvl + ' of 3' : 'Ready to build') : 'Locked'}</span><h2>${esc(b.name)}</h2><p>${esc(b.desc)}</p>
    <dl><dt>Function</dt><dd>${esc(b.fn)}</dd><dt>Unlock condition</dt><dd>${esc(st.req)}</dd><dt>Required skills</dt><dd>${b.need ? esc(GE.STAGES[Math.max(0, b.need - 1)].skills.map(x => Array.isArray(x) ? x[0] : x).slice(0, 3).join(', ')) : 'None'}</dd></dl>
    <ol class="levels">${lv}</ol>${action}`;
}

/* ---------- FUTURE ---------- */
function future(preview){
  const ev = GE.state.evidence(), done = GE.state.stagesComplete(ev);
  const parts = A().FUTURE_PARTS.map(p => `<li class="${preview || done >= p.stage ? 'on' : ''}"><span>${preview || done >= p.stage ? '✓' : 'Stage ' + p.stage}</span>${esc(p.name)}</li>`).join('');
  return `<section class="future-page"><div class="wrap clinic-top"><div><span class="eyebrow">The destination</span><h1>Futuristic Smart Clinic</h1><p>${preview ? 'Vision preview: everything Jo is working towards. Not yet unlocked.' : `${done} of 6 learning stages complete. Each stage brings more of the clinic to life; the rest shows as blueprints.`}</p></div>
    <div class="row"><button class="btn ${preview ? 'ghost' : 'gold'}" id="toggleVision" type="button">${preview ? 'Back to my progress' : 'Preview the full vision'}</button><a class="btn ghost" href="#clinic">← Jo's Clinic</a></div></div>
    ${preview ? '<div class="wrap"><div class="vision-banner">VISION PREVIEW · NOT YET UNLOCKED · CONCEPT ART</div></div>' : ''}
    <div class="mapwrap future">${A().futureClinic(done, preview)}</div>
    <div class="wrap two"><div><div class="sechead"><h2>What's inside</h2></div><ul class="parts">${parts}</ul></div>
    <div><div class="sechead"><h2>Built on</h2></div><p>Robotic gait training, AI movement analysis, sensor-based assessment, wearables, hydrotherapy and neurological rehabilitation, in sustainable glass architecture in a green valley.</p><p class="muted small">Technology serves the clinician; the clinician serves the patient. This is the long-term ambition of the physiotherapy world, revealed one learning stage at a time.</p></div></div></section>`;
}

/* ---------- PROFILE ---------- */
function profile(){
  const s = S(), ev = GE.state.evidence(), L = GE.state.levelInfo();
  const pct = L.to ? Math.round((s.xp - L.from) / (L.to - L.from) * 100) : 100;
  const skills = GE.STAGES.flatMap(st => GE.state.skillsOf(st.n, ev)).filter(x => x.got);
  const upcoming = GE.BUILDINGS.filter(b => !GE.state.buildingState(b, ev).unlocked).slice(0, 3);
  return `<section class="wrap profile"><div class="pcard"><div class="avatar" id="profAv"></div><div class="who"><span class="eyebrow">Player</span><h1>Jo</h1><p class="rank">Level ${L.level} · ${esc(L.title)}</p>
      <div class="xpbar"><i style="--p:${pct}%"></i></div><small>${s.xp} XP${L.to ? ` · ${L.to - s.xp} XP to ${esc(L.nextTitle)}` : ''}</small>
      <div class="looks" role="radiogroup" aria-label="Jo's look"><button type="button" class="look ${s.look === 0 ? 'on' : ''}" data-l="0" role="radio" aria-checked="${s.look === 0}">Look 1</button><button type="button" class="look ${s.look === 1 ? 'on' : ''}" data-l="1" role="radio" aria-checked="${s.look === 1}">Look 2</button></div></div>
    <div class="stat-grid"><div><b>${s.xp}</b><span>Platform XP</span></div><div><b>${s.sparks}</b><span>Sparks</span></div><div><b>${(ev.arLevels >= 1 ? 1 : 0) + (s.lab.done ? 1 : 0)}</b><span>Games with progress</span></div><div><b>${Object.values(s.buildings).filter(Boolean).length}/12</b><span>Clinic buildings</span></div></div></div>
  </section>
  <section class="wrap two"><div><div class="sechead"><h2>Current skills</h2></div>${skills.length ? `<div class="chips">${skills.map(x => `<span class="chip got">${esc(x.name)}</span>`).join('')}</div>` : '<p class="muted">No skills yet. Solve your first Anatomy Run level.</p>'}
    <div class="sechead"><h2>Achievement badges</h2></div><ul class="badges">${GE.BADGES.map(b => `<li class="${s.badges[b.id] ? 'on' : ''}"><span class="medal">${s.badges[b.id] ? sparkI : lockI}</span><b>${esc(b.name)}</b><small>${esc(b.desc)}</small></li>`).join('')}</ul></div>
    <div><div class="sechead"><h2>Progress map</h2></div>${journeyStrip()}
    <div class="sechead"><h2>Upcoming unlocks</h2></div><ul class="planned">${upcoming.map(b => `<li>${lockI}<b>${esc(b.name)}</b> · ${esc(GE.state.buildingState(b, ev).req)}</li>`).join('')}</ul>
    <div class="sechead"><h2>Completed missions</h2></div><ul class="ticks">${s.missions.stage1 ? '<li>Stage 1: Anatomical Foundations</li>' : ''}${s.lab.done ? '<li>Assessment Lab · Mission 1</li>' : ''}${s.missions.stage2 ? '<li>Stage 2: Assessment Skills</li>' : ''}${!s.missions.stage1 && !s.lab.done ? '<li class="none">None yet</li>' : ''}</ul></div></section>
  <section class="wrap"><div class="sechead"><h2>Activity ledger</h2><span class="pill st-soon">Simulated demo progress</span></div><div class="ledger"><table><thead><tr><th>Activity</th><th>Sparks</th><th>XP</th><th></th></tr></thead><tbody>
    ${s.tx.slice().reverse().slice(0, 14).map(t => `<tr><td>${esc(t.label)}</td><td class="${t.sparks < 0 ? 'neg' : 'pos'}">${t.sparks > 0 ? '+' : ''}${t.sparks || '–'}</td><td>${t.xp ? '+' + t.xp : '–'}</td><td>${t.sim ? '<span class="simtag">simulated</span>' : '<span class="realtag">from game</span>'}</td></tr>`).join('')}</tbody></table></div></section>
  <section class="wrap"><div class="danger"><div><b>Reset demo progress</b><span>Clears the platform's demo state on this device. Anatomy Run's own save is not touched.</span></div><button class="btn ghost" id="resetAsk" type="button">Reset demo</button><div id="resetConfirm" hidden><span>Reset everything?</span><button class="btn danger-btn" id="resetYes" type="button">Yes, reset</button><button class="btn ghost" id="resetNo" type="button">Cancel</button></div></div>
  <p class="muted small">No account, no name, no payments and no tracking. Progress is stored only in this browser.</p></section>`;
}
function notFound(){ return `<section class="wrap pagehead"><h1>Page not found</h1><p><a href="#home">Back home</a></p></section>`; }

GE.views = {home, explore, category, anatomyRun, library, learning, clinic, buildingPanel, future, profile, notFound};
})();
