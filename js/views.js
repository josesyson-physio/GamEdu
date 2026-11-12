/* Gamified Edu demo: screens */
'use strict';
(function(){
const A = () => GE.art, S = () => GE.state.get(), esc = s => GE.art.esc(s);
const statusPill = st => `<span class="pill st-${st}">${GE.STATUS_LABEL[st]}</span>`;
const sparkI = '<svg class="i" aria-hidden="true"><use href="#ic-spark"/></svg>';
const lockI = '<svg class="i" aria-hidden="true"><use href="#ic-lock"/></svg>';
const starStr = n => '★'.repeat(n) + '☆'.repeat(3 - n);
const crumb = (...parts) => `<nav class="crumb" aria-label="Breadcrumb">${parts.map((p, i) => i < parts.length - 1 ? `<a href="${p[1]}">${esc(p[0])}</a><span aria-hidden="true">›</span>` : `<b>${esc(p[0])}</b>`).join('')}</nav>`;

function arCard(){
  const ev = GE.state.evidence();
  return `<a class="gcard" href="#game-anatomy-run"><div class="art">${A().cardArt('anatomy-run')}<span class="kind">Live game</span></div>
    <div class="body"><span class="subj">Physiotherapy · Anatomy & clinical reasoning</span><h3>Anatomy Run</h3><p>${esc(GE.GAMES[0].desc)}</p>
    <div class="foot"><span class="status">${ev.realCount ? `${ev.realCount}/22 levels solved` : 'Free · play now'}</span><span class="cta">${ev.realCount ? 'Continue' : 'Play'} →</span></div></div></a>`;
}
function rcCard(){
  const rc = GE.state.readRootCause();
  return `<a class="gcard" href="#game-root-cause"><div class="art">${A().cardArt('root-cause')}<span class="kind">New game</span></div>
    <div class="body"><span class="subj">Physiotherapy · Assessment & treatment</span><h3>Root Raid: Body City</h3><p>${esc(GE.GAMES[1].desc)}</p>
    <div class="foot"><span class="status">${rc.count ? `${rc.count}/10 cases solved` : 'Free · play now'}</span><span class="cta">${rc.count ? 'Continue' : 'Play'} →</span></div></div></a>`;
}
function clinicCard(){
  const sc = GE.state.setupScore();
  return `<a class="gcard reward" href="#clinic"><div class="art">${A().cardArt('clinic')}<span class="kind gold">Rewards</span></div>
    <div class="body"><span class="subj">Physiotherapy · Your reward space</span><h3>Jo's Clinic</h3><p>${esc(GE.CLINIC_CARD.desc)}</p>
    <div class="foot"><span class="status">Setup ${sc}/36</span><span class="cta">Build →</span></div></div></a>`;
}
function catCard(c){
  return `<a class="ccard env-${c.env}" href="#cat-${c.id}"><div class="art">${A().cardArt(c.id)}</div><div class="body">${statusPill(c.status)}<h3>${esc(c.name)}</h3><p>${esc(c.blurb)}</p></div></a>`;
}
function journeyStrip(){
  const ev = GE.state.evidence();
  const items = GE.STAGES.map(st => { const done = GE.state.stageDone(st.n, ev), pr = GE.state.stageProgress(st.n, ev);
    return `<li class="${done ? 'done' : pr > 0 ? 'active' : 'next'}"><span class="n">${done ? '✓' : st.n}</span><b>${esc(st.name)}</b><span class="bar"><i style="--p:${Math.round(pr * 100)}%"></i></span><small>Levels ${st.from}–${st.to} · ${Math.round(pr * st.levels.length)}/${st.levels.length}</small></li>`; });
  const smart = (S().buildings.smart || 0) > 0;
  items.push(`<li class="${smart ? 'done' : 'goal'}"><span class="n">${smart ? '✓' : '★'}</span><b>Futuristic Smart Clinic</b><span class="bar"><i style="--p:${Math.round(GE.state.setupScore() / 36 * 100)}%"></i></span><small>Ultimate goal · Jo's Clinic</small></li>`);
  return `<ol class="journey">${items.join('')}</ol>`;
}
function loopDiagram(){
  return `<ol class="loop" aria-label="How rewards work"><li><b>Play</b><span>Solve Anatomy Run cases</span></li><li><b>Earn</b><span>Sparks for every level and star, a skill for every case</span></li><li><b>Unlock</b><span>Skills set the limit: a world unlocks buildings, more stars allow higher upgrades</span></li><li><b>Build</b><span>Spend sparks in Jo's Clinic, up to your skill limit</span></li><li class="goal"><b>Goal</b><span>The Futuristic Smart Clinic</span></li></ol>`;
}

/* ---------- HOME ---------- */
function home(){
  const ev = GE.state.evidence();
  return `<section class="hero">${A().heroWorld()}<div class="hero-copy"><span class="eyebrow">An educational gaming universe</span><h1 class="brand">GAMIFIED EDU</h1>
    <p class="tag">LEARN IT. PLAY IT. MASTER IT.</p><p class="sub">Your next learning adventure starts here.</p>
    <div class="row"><a class="btn gold big" href="#explore">Explore games</a><a class="btn cream" href="#game-anatomy-run">Continue learning</a><a class="btn ghost light" href="#cat-physio">Enter Physiotherapy</a></div></div></section>
  <section class="wrap"><div class="sechead"><h2>Featured adventure</h2></div><div class="grid3">${arCard()}${catCard(GE.CATEGORIES[1])}${catCard(GE.CATEGORIES[2])}</div></section>
  <section class="wrap"><div class="sechead"><h2>Continue playing</h2></div>
    <div class="continue"><div class="art">${A().cardArt('anatomy-run')}</div><div class="body"><span class="subj">Physiotherapy · Anatomy Run</span><h3>${ev.realCount ? `${ev.realCount} of 22 levels solved` : 'Start with level 1: Upper Limb Hills'}</h3>
      <div class="meter"><i style="--p:${Math.round(ev.realCount / 22 * 100)}%"></i></div><p>${ev.ar.found ? 'Progress read from Anatomy Run on this device.' : 'No Anatomy Run progress on this device yet. It appears here automatically after you play in this browser.'}</p>
      <div class="row"><a class="btn gold" href="#game-anatomy-run">Continue</a><a class="btn ghost" href="#clinic">Spend rewards in Jo's Clinic</a></div></div></div></section>
  <section class="wrap"><div class="sechead"><h2>Explore categories</h2><a href="#explore">All categories →</a></div><div class="grid3">${GE.CATEGORIES.map(catCard).join('')}</div></section>
  <section class="wrap two"><div><div class="sechead"><h2>Popular now</h2></div><ul class="rank"><li><span class="n">1</span><a href="#game-anatomy-run"><b>Anatomy Run</b><small>Physiotherapy · 22 levels</small></a></li><li><span class="n">2</span><a href="#game-root-cause"><b>Root Raid: Body City</b><small>Physiotherapy · 10 cases</small></a></li></ul></div>
    <div><div class="sechead"><h2>New experiences</h2></div><ul class="news"><li><b>Jo's Clinic rewards</b><span>Turn the points and skills you earn into your own clinic.</span></li><li><b>Liftoff Lab: Mission Control</b><span>New advanced missions: tune thrust with the rocket equation, run the countdown, pick the orbit.</span></li><li><b>Village Lab: Data Detective</b><span>New AI lab: train a fair AI, find its blind spots and decide what happens when it is wrong.</span></li></ul></div></section>
  <section class="wrap"><div class="sechead"><h2>My learning journey</h2><a href="#learning">Skill map →</a></div>${journeyStrip()}</section>`;
}

/* ---------- EXPLORE + CATEGORY ---------- */
function explore(){
  return `<section class="wrap pagehead"><span class="eyebrow">Explore</span><h1>Choose a world</h1><p>Each subject is its own world with its own games and rewards. All three worlds are open: Physiotherapy, Rocket Science and AI in Remote Areas.</p></section>
  <section class="wrap"><div class="grid3">${GE.CATEGORIES.map(catCard).join('')}</div></section>`;
}
function category(id){
  const c = GE.CATEGORIES.find(x => x.id === id); if(!c) return notFound();
  if(c.id === 'physio') return physio();
  const g = GE.WORLD_GAMES[c.id];
  if(g){ const wg = GE.state.readWorldGame(c.id), n = Object.keys(g.units).length, st = Object.values(wg.stars).reduce((a, b) => a + b, 0);
    return `<section class="catworld env-${c.env}"><div class="art">${A().cardArt(c.id)}</div><div class="wrap">${crumb(['Explore', '#explore'], [c.short, ''])}${statusPill(c.status)}<h1>${esc(c.name)}</h1><p>${esc(c.blurb)}</p></div></section>
    <section class="wrap"><div class="sechead"><h2>Game</h2></div><div class="grid3"><a class="gcard" href="${g.url}" id="launchWG"><div class="art">${A().cardArt(c.id)}<span class="kind">New game</span></div>
      <div class="body"><span class="subj">${esc(g.subject)}</span><h3>${esc(g.name)}</h3><p>${esc(g.desc)}</p><div class="foot"><span class="status">${wg.count ? `${wg.count}/${n} ${g.unitName}s \u00b7 ${st}\u2605` : 'Free \u00b7 play now'}</span><span class="cta">${wg.count ? 'Continue' : 'Play'} \u2192</span></div></div></a>
      <div class="gcard ghostcard"><div class="body"><span class="subj">What you learn</span><h3>Skills in this game</h3><ul class="ticks">${g.learn.map(l => `<li>${esc(l)}</li>`).join('')}</ul></div></div>
      <div class="gcard advcard"><div class="body"><span class="subj">Advanced</span><h3>${c.id === 'rocket' ? 'Mission Control' : 'Stories & AI Lab'}</h3><ul class="ticks">${g.advanced.map(l => `<li>${esc(l)}</li>`).join('')}</ul><div class="foot"><span class="status">${c.id === 'rocket' ? 'Opens after Explode It' : 'Stories open now \u00b7 AI lab after your first project'}</span></div></div></div></div></section>
    <section class="wrap two"><div><div class="sechead"><h2>Your progress</h2></div><ul class="rewards-list">${Object.entries(g.units).map(([k, name]) => `<li><b>${wg.stars[k] ? starStr(wg.stars[k]) : '\u2606\u2606\u2606'}</b> ${esc(name)}${wg.best[k] != null && c.id === 'ai-remote' && wg.stars[k] ? ` \u00b7 best ${wg.best[k]}/100` : ''}</li>`).join('')}</ul>
      <p class="muted small">Each ${g.unitName} pays ${GE.REWARD.levelSparks} sparks, +${GE.REWARD.starSparks} per star. Sparks go into the same wallet as Physiotherapy.</p></div>
      <div><div class="sechead"><h2>Coming next</h2></div><ul class="planned">${c.planned.map(p => `<li>${lockI}${esc(p)}</li>`).join('')}</ul><p class="muted small">${esc(c.note || '')}</p></div></section>`; }
  return `<section class="catworld env-${c.env}"><div class="art">${A().cardArt(c.id)}</div><div class="wrap">${crumb(['Explore', '#explore'], [c.short, ''])}${statusPill(c.status)}<h1>${esc(c.name)}</h1><p>${esc(c.blurb)}</p></div></section>
  <section class="wrap"><div class="soon"><h2>Coming soon</h2><p>This world is in development and not playable yet.</p>
    <h3>What it could include</h3><ul class="planned">${c.planned.map(p => `<li>${lockI}${esc(p)}</li>`).join('')}</ul><p class="muted small">${esc(c.note || '')}</p>
    <div class="row"><a class="btn gold" href="#cat-physio">Play the Physiotherapy world now</a></div></div></section>`;
}
function physio(){
  const ev = GE.state.evidence();
  return `<section class="catworld env-physio"><div class="art">${A().cardArt('physio')}</div><div class="wrap">${crumb(['Explore', '#explore'], ['Physiotherapy', ''])}${statusPill('available')}<h1>Physiotherapy & Health Sciences</h1><p>Play to learn, earn sparks and skills, and build your own clinic.</p></div></section>
  <section class="wrap"><div class="sechead"><h2>Games</h2></div><div class="grid3">${arCard()}${rcCard()}<div class="gcard ghostcard"><div class="body"><span class="subj">In development</span><h3>More physiotherapy games</h3><p>New games will join this world and feed the same rewards and the same clinic.</p></div></div></div></section>
  <section class="wrap"><div class="sechead"><h2>Rewards: Jo's Clinic</h2><a href="#clinic">Open the clinic →</a></div>${loopDiagram()}
    <div class="grid3 mt">${clinicCard()}<a class="gcard" href="#learning"><div class="body"><span class="subj">Your progress</span><h3>Skill map</h3><p>22 case skills across 4 worlds. ${ev.count} earned so far.</p><div class="foot"><span class="status">${GE.state.stagesComplete(ev)}/4 worlds</span><span class="cta">View →</span></div></div></a>
    <a class="gcard" href="#future"><div class="body"><span class="subj">Ultimate goal</span><h3>Futuristic Smart Clinic</h3><p>Robotics, AI movement analysis, hydrotherapy and research, revealed world by world.</p><div class="foot"><span class="status">${S().buildings.smart ? 'Built' : 'Locked'}</span><span class="cta">Preview →</span></div></div></a></div></section>
  <section class="wrap"><div class="sechead"><h2>Skill areas</h2></div><div class="chips">${GE.PHYSIO_SKILLS.map(s => `<span class="chip">${esc(s)}</span>`).join('')}</div>
    <div class="sechead mt"><h2>How the learning builds</h2></div>${millerLadder()}<p class="muted small">Based on Miller's pyramid of clinical competence. Anatomy Run builds “knows” and “knows how”; Root Raid practises treatment choices (“shows how” in simulation). “Does” only happens in supervised clinical practice.</p></section>`;
}
function millerLadder(){
  return `<ol class="miller">${GE.MILLER.slice().reverse().map((m, i) => `<li class="m-${m.id}" style="--w:${55 + i * 15}%"><b>${esc(m.name)}</b><span>${esc(m.desc)}</span><small>${esc(m.where)}</small></li>`).join('')}</ol>`;
}

/* ---------- GAME PAGE: Anatomy Run ---------- */
function anatomyRun(){
  const ev = GE.state.evidence(), R = GE.REWARD;
  const keep = ['Jo, with two looks','22 levels across 4 worlds','Creator, Student and Pro modes','Clue gems and diagnosis','Flashcards and recap','Its own in-game sparks, clinic and Jo’s story'];
  const nextWorld = GE.STAGES.find(st => !GE.state.stageDone(st.n, ev));
  return `<section class="gamehero"><div class="art">${A().cardArt('anatomy-run')}</div><div class="wrap">${crumb(['Physiotherapy', '#cat-physio'], ['Anatomy Run', ''])}<span class="pill st-available">Live game</span><h1>Anatomy Run</h1>
    <p>Run, collect clinical clue gems and make the diagnosis across Upper Limb Hills, Sports Ground, Spine Canyon and Neuro Nights.</p>
    <div class="row"><a class="btn gold big" href="${GE.ANATOMY_RUN_URL}" target="_blank" rel="noopener noreferrer" id="launchAR">Launch Anatomy Run ↗</a><a class="btn ghost light" href="#clinic">Spend rewards in Jo's Clinic</a></div>
    <p class="note">Opens the real game in its own tab, with its own security and privacy protections. Come back here to collect your rewards.</p></div></section>
  <section class="wrap two"><div><div class="sechead"><h2>Rewards you earn</h2></div>
    <ul class="rewards-list"><li><b>${R.levelSparks}</b> sparks for each level solved</li><li><b>+${R.starSparks}</b> sparks for every star (up to 3)</li><li><b>${GE.STAGES[0].bonus}</b> bonus sparks for each world completed</li><li><b>1 skill</b> for every case solved</li><li><b>New buildings</b> in Jo's Clinic for every world; <b>2★</b> and <b>3★</b> on every case allow upgrades</li></ul>
    <div class="stat-grid mt"><div><b>${ev.realCount}</b><span>levels solved (real)</span></div><div><b>${GE.state.stagesComplete(ev)}/4</b><span>worlds complete</span></div><div><b>${ev.ar.found ? ev.ar.sparks : '–'}</b><span>sparks inside the game</span></div></div>
    <p class="muted small">${ev.ar.found ? 'Read from Anatomy Run on this device. The platform never changes your Anatomy Run save.' : 'No Anatomy Run progress on this device yet. Play in this same browser and it appears here.'} The game's own sparks stay in the game; the platform pays its own rewards for the levels you solve.</p>
    ${nextWorld ? `<div class="simbox"><b>Presenter control</b><p>Simulate completing world ${nextWorld.n} (${esc(nextWorld.name)}) at 2 stars per level, for a walkthrough. It is logged as simulated.</p><button class="btn ghost" type="button" id="simMs">Simulate world ${nextWorld.n}</button></div>` : ''}</div>
    <div><div class="sechead"><h2>In the game</h2></div><ul class="ticks">${keep.map(k => `<li>${esc(k)}</li>`).join('')}</ul></div></section>`;
}

/* ---------- GAME PAGE: Root Raid: Body City ---------- */
function rootCause(){
  const rc = GE.state.readRootCause(), R = GE.REWARD;
  const how = ['Roam a city shaped like a body, on foot or on Jo’s scooter','Meet someone who needs help, then run tests at street kiosks to see which ones come up positive','One local needs a hospital, not a clinic: spot the red flag and call the ambulance','Pick the right hideout and raid it: each symptom only gives way to the treatment that fits','Symptoms respawn until the root cause is gone, then you get the full case file'];
  return `<section class="gamehero"><div class="art">${A().cardArt('root-cause')}</div><div class="wrap">${crumb(['Physiotherapy', '#cat-physio'], ['Root Raid: Body City', ''])}<span class="pill st-available">New game</span><h1>Root Raid: Body City</h1>
    <p>A whole city built inside the human body. Ten districts, ten common painful conditions. No quiz screens: you learn by roaming, testing, referring and raiding.</p>
    <div class="row"><a class="btn gold big" href="${GE.ROOT_CAUSE_URL}" id="launchRC">Enter Body City</a><a class="btn ghost light" href="#clinic">Spend rewards in Jo's Clinic</a></div>
    <p class="note">Clinical content adapted from the Learn Anywhere library (CC BY-NC-SA 4.0). Draft, pending clinical panel review.</p></div></section>
  <section class="wrap two"><div><div class="sechead"><h2>Rewards you earn</h2></div>
    <ul class="rewards-list"><li><b>${R.levelSparks}</b> sparks for each case solved</li><li><b>+${R.starSparks}</b> sparks for every star (up to 3)</li><li><b>1 treatment skill</b> for every case</li><li>Stars: close the case, make no wrong test, referral or hideout call, keep Jo's energy at 3 or more</li></ul>
    <div class="stat-grid mt"><div><b>${rc.count}/10</b><span>cases solved</span></div><div><b>${Object.values(rc.stars).filter(x => x === 3).length}</b><span>perfect cases</span></div></div>
    <div class="sechead mt"><h2>Treatment skills</h2></div><div class="chips">${GE.state.treatmentSkills().map(x => `<span class="chip ${x.stars ? 'got' : ''}">${esc(x.name)}${x.stars ? ` <small>${starStr(x.stars)}</small>` : ''}</span>`).join('')}</div></div>
    <div><div class="sechead"><h2>How it plays</h2></div><ul class="ticks">${how.map(k => `<li>${esc(k)}</li>`).join('')}</ul><p class="muted small">Educational only, not medical advice.</p></div></section>`;
}

/* ---------- LIBRARY ---------- */
function library(){
  return `<section class="wrap pagehead"><span class="eyebrow">My library</span><h1>Your games</h1><p>Everything you can play now, and what's coming.</p></section><section class="wrap"><div class="grid3">${arCard()}${rcCard()}${Object.entries(GE.WORLD_GAMES).map(([cat, g]) => `<a class="gcard" href="${g.url}"><div class="art">${A().cardArt(cat)}<span class="kind">New game</span></div><div class="body"><span class="subj">${esc(GE.CATEGORIES.find(c => c.id === cat).short)}</span><h3>${esc(g.name)}</h3><p>${esc(g.desc)}</p><div class="foot"><span class="status">Free \u00b7 play now</span><span class="cta">Play \u2192</span></div></div></a>`).join('')}</div></section>
  <section class="wrap"><div class="sechead"><h2>Coming to your library</h2></div><ul class="planned"><li>${lockI}<b>More physiotherapy games</b> · in development</li><li>${lockI}<b>More Rocket Science games</b> · Orbit Golf, Moon Shot</li><li>${lockI}<b>More AI in Remote Areas games</b> · Signal Hunt, Voice First</li></ul></section>`;
}

/* ---------- SKILL MAP ---------- */
function learning(){
  const ev = GE.state.evidence();
  const rows = GE.STAGES.map(st => {
    const done = GE.state.stageDone(st.n, ev), pr = GE.state.stageProgress(st.n, ev);
    const prevDone = st.n === 1 || GE.state.stageDone(st.n - 1, ev);
    const state = done ? 'done' : pr > 0 || prevDone ? 'active' : 'next';
    const unlocks = GE.BUILDINGS.filter(b => b.need.stage === st.n).map(b => b.name).join(' and ');
    return `<li class="stage ${state}"><div class="node"><span>${done ? '✓' : st.n}</span></div><div class="card">
      <div class="top"><div><span class="eyebrow">World ${st.n} · Anatomy Run levels ${st.from}–${st.to}</span><h3>${esc(st.name)}</h3><p class="muted small">${esc(st.theme)}</p></div><div class="ring" style="--p:${Math.round(pr * 100)}"><b>${Math.round(pr * 100)}%</b></div></div>
      <div class="frame"><span class="mtag m-knows">Knows</span><span class="mtag m-knowshow">Knows how</span></div>
      <ul class="skills">${st.levels.map(n => { const stars = ev.stars[n] || 0; return `<li class="${stars ? 'got' : ''}"><span class="dot"></span>${esc(GE.CASES[n])}<small>${stars ? `Level ${n} · ${starStr(stars)}${ev.src[n] === 'sim' ? ' · simulated' : ''}` : `Solve level ${n}`}</small></li>`; }).join('')}</ul>
      <div class="unlock"><b>Unlocks in Jo's Clinic:</b> ${esc(unlocks)} · +${st.bonus} sparks. <b>Upgrades:</b> 2★ on every case allows level 2, 3★ allows level 3.</div>
    </div></li>`;
  }).join('');
  const smart = S().buildings.smart, tsk = GE.state.treatmentSkills();
  return `<section class="wrap pagehead">${crumb(['Physiotherapy', '#cat-physio'], ['Skill map', ''])}<h1>Skill map</h1><p>Every Anatomy Run case and every Root Cause case you solve becomes a skill. Completing a world unlocks new buildings in Jo's Clinic. Sparks build; they never buy a skill.</p></section>
  <section class="wrap"><ol class="stages">${rows}
    <li class="stage ${tsk.some(x => x.stars) ? 'active' : 'next'}"><div class="node"><span>RC</span></div><div class="card"><span class="eyebrow">Root Raid: Body City · 10 cases</span><h3>Treatment skills</h3><p class="muted small">Earned in the open world: test, refer, find the root cause, treat it.</p>
      <div class="frame"><span class="mtag m-knowshow">Knows how</span><span class="mtag m-showshow">Shows how</span></div>
      <ul class="skills">${tsk.map(x => `<li class="${x.stars ? 'got' : ''}"><span class="dot"></span>${esc(x.name)}<small>${x.stars ? starStr(x.stars) : 'Solve in Body City'}</small></li>`).join('')}</ul>
      <div class="row"><a class="btn ghost" href="#game-root-cause">Play Root Raid</a></div></div></li>
    <li class="stage ${smart ? 'done' : 'goal'}"><div class="node"><span>★</span></div><div class="card"><span class="eyebrow">Ultimate goal</span><h3>Futuristic Smart Clinic</h3><p>Complete all four worlds, build every other building in Jo's Clinic, then build the Smart Clinic.</p><div class="row"><a class="btn gold" href="#clinic">Go to Jo's Clinic</a><a class="btn ghost" href="#future">Preview it</a></div></div></li>
    <li class="stage future"><div class="node"><span>+</span></div><div class="card"><span class="eyebrow">Coming next</span><h3>More physiotherapy games</h3><p>New games will add more skills, including hands-on “shows how” practice, and feed the same clinic.</p></div></li></ol>
  <p class="muted small disclaimer">Game skills show learning progress. They are not professional qualifications or clinical certification.</p></section>`;
}

/* ---------- JO'S CLINIC (rewards, inside Physiotherapy) ---------- */
function clinic(){
  const s = S(), built = Object.values(s.buildings).filter(Boolean).length;
  return `<section class="clinic-page"><div class="clinic-top wrap"><div>${crumb(['Physiotherapy', '#cat-physio'], ["Jo's Clinic", ''])}<h1>Build your own clinic</h1><p>Your rewards from Anatomy Run. Sparks pay for buildings, but what you have learned sets how far each one can grow: complete a world to build, 2★ every case to upgrade, 3★ for mastery. The ultimate goal is the Futuristic Smart Clinic.</p></div>
    <div class="clinic-stats"><div><b>${built}</b><span>of 12 buildings</span></div><div><b>${GE.state.setupScore()}/36</b><span>setup level</span></div><div><b>${s.sparks}</b><span>sparks</span></div><a class="btn gold" href="#future">Smart Clinic →</a></div></div>
    <div class="mapwrap" id="mapWrap">${A().clinicMap()}</div>
    <aside class="bpanel" id="bPanel" hidden></aside>
    <div class="wrap legend"><span><i class="lg built"></i>Built (tap to upgrade)</span><span><i class="lg plot"></i>Ready to build</span><span><i class="lg locked"></i>Locked: complete a world</span><a href="#game-anatomy-run" class="earnlink">Earn more sparks →</a><span class="sim">All spark transactions are simulated demo progress.</span></div></section>`;
}
function buildingPanel(id){
  const b = GE.BUILDINGS.find(x => x.id === id), st = GE.state.buildingState(b);
  const lvDesc = ['The core building', 'Second floor, extra wing, solar roof', 'Glass dome, roof garden, lit windows'];
  const lv = [1, 2, 3].map(l => { const have = st.lvl >= l, ok = st.have[l - 1];
    return `<li class="${have ? 'have' : ok ? 'ready' : 'gated'}"><b>Level ${l}</b><span>${lvDesc[l - 1]}<small>${have ? 'Built' : ok ? 'Skill met' : 'Skill needed: ' + esc(st.reqs[l - 1])}</small></span><em>${b.cost[l - 1] ? b.cost[l - 1] + ' sparks' : 'Free'}</em></li>`; }).join('');
  let action;
  if(st.nextCost == null) action = `<div class="req ok"><b>Fully upgraded</b><span>Mastery reached for this building.</span></div>`;
  else if(!st.nextAllowed) action = `<div class="req">${lockI}<div><b>${st.lvl ? 'Upgrade limited by skill' : 'Locked'}</b><span>To ${st.lvl ? 'reach level ' + (st.lvl + 1) : 'build it'}: ${esc(st.nextReq)}.</span></div></div><div class="row"><a class="btn gold" href="#game-anatomy-run">Learn in Anatomy Run</a><a class="btn ghost" href="#learning">Skill map</a></div>`;
  else action = `<button class="btn gold big" id="buyB" data-b="${b.id}" type="button" ${st.canAfford ? '' : 'disabled'}>${st.lvl ? 'Upgrade to level ' + (st.lvl + 1) : 'Build'} · ${sparkI}${st.nextCost}</button>${st.canAfford ? '' : `<p class="muted small">Skill met. You need ${st.nextCost - S().sparks} more sparks: solve or replay Anatomy Run levels.</p>`}`;
  return `<button class="pclose" id="pClose" type="button" aria-label="Close">×</button><span class="eyebrow">${st.lvl ? 'Level ' + st.lvl + ' of 3 · skill allows level ' + st.cap : st.unlocked ? 'Ready to build' : 'Locked'}</span><h2>${esc(b.name)}</h2><p>${esc(b.desc)}</p>
    <dl><dt>Function</dt><dd>${esc(b.fn)}</dd></dl>
    <p class="rule"><b>How it grows:</b> sparks pay for each level, but your skills set the limit.</p>
    <ol class="levels">${lv}</ol>${action}`;
}
/* ---------- FUTURISTIC SMART CLINIC ---------- */
function future(preview){
  const ev = GE.state.evidence(), worlds = GE.state.stagesComplete(ev), reveal = worlds + (S().buildings.smart ? 1 : 0);
  const parts = A().FUTURE_PARTS.map(p => { const on = preview || reveal >= p.stage; return `<li class="${on ? 'on' : ''}"><span>${on ? '✓' : p.stage > 4 ? 'Goal' : 'World ' + p.stage}</span>${esc(p.name)}</li>`; }).join('');
  return `<section class="future-page"><div class="wrap clinic-top"><div>${crumb(['Physiotherapy', '#cat-physio'], ["Jo's Clinic", '#clinic'], ['Smart Clinic', ''])}<h1>Futuristic Smart Clinic</h1><p>${preview ? 'Vision preview: everything Jo is working towards. Not yet unlocked.' : `${worlds} of 4 worlds complete. Each world brings more of the clinic to life; the rest shows as blueprints.`}</p></div>
    <div class="row"><button class="btn ${preview ? 'ghost' : 'gold'}" id="toggleVision" type="button">${preview ? 'Back to my progress' : 'Preview the full vision'}</button><a class="btn ghost" href="#clinic">← Jo's Clinic</a></div></div>
    ${preview ? '<div class="wrap"><div class="vision-banner">VISION PREVIEW · NOT YET UNLOCKED · CONCEPT ART</div></div>' : ''}
    <div class="mapwrap future">${A().futureClinic(reveal, preview)}</div>
    <div class="wrap two"><div><div class="sechead"><h2>What's inside</h2></div><ul class="parts">${parts}</ul></div>
    <div><div class="sechead"><h2>The vision</h2></div><p>Robotic gait training, AI movement analysis, sensor-based assessment, wearables, hydrotherapy and neurological rehabilitation, in sustainable glass architecture in a green valley.</p><p class="muted small">Technology serves the clinician; the clinician serves the patient.</p></div></div></section>`;
}

/* ---------- PROFILE ---------- */
function profile(){
  const s = S(), ev = GE.state.evidence(), L = GE.state.levelInfo();
  const pct = L.to ? Math.round((s.xp - L.from) / (L.to - L.from) * 100) : 100;
  const got = GE.state.skills(ev).filter(x => x.stars);
  const upcoming = GE.BUILDINGS.filter(b => !GE.state.buildingState(b, ev).unlocked).slice(0, 3);
  return `<section class="wrap profile"><div class="pcard"><div class="avatar" id="profAv"></div><div class="who"><span class="eyebrow">Player</span><h1>Jo</h1><p class="rank">Level ${L.level} · ${esc(L.title)}</p>
      <div class="xpbar"><i style="--p:${pct}%"></i></div><small>${s.xp} XP${L.to ? ` · ${L.to - s.xp} XP to ${esc(L.nextTitle)}` : ''}</small>
      <div class="looks" role="radiogroup" aria-label="Jo's look"><button type="button" class="look ${s.look === 0 ? 'on' : ''}" data-l="0" role="radio" aria-checked="${s.look === 0}">Look 1</button><button type="button" class="look ${s.look === 1 ? 'on' : ''}" data-l="1" role="radio" aria-checked="${s.look === 1}">Look 2</button></div></div>
    <div class="stat-grid"><div><b>${s.xp}</b><span>Platform XP</span></div><div><b>${s.sparks}</b><span>Sparks</span></div><div><b>${got.length}/22</b><span>Case skills</span></div><div><b>${GE.state.readRootCause().count}/10</b><span>Treatment skills</span></div><div><b>${GE.state.setupScore()}/36</b><span>Clinic setup</span></div></div></div>
  </section>
  <section class="wrap two"><div><div class="sechead"><h2>Skills earned</h2></div>${got.length ? `<div class="chips">${got.map(x => `<span class="chip got">${esc(x.name)} <small>${starStr(x.stars)}</small></span>`).join('')}</div>` : '<p class="muted">No skills yet. Solve your first Anatomy Run level.</p>'}
    <div class="sechead mt"><h2>Achievement badges</h2></div><ul class="badges">${GE.BADGES.map(b => `<li class="${s.badges[b.id] ? 'on' : ''}"><span class="medal">${s.badges[b.id] ? sparkI : lockI}</span><b>${esc(b.name)}</b><small>${esc(b.desc)}</small></li>`).join('')}</ul></div>
    <div><div class="sechead"><h2>Progress map</h2></div>${journeyStrip()}
    <div class="sechead mt"><h2>Upcoming unlocks</h2></div><ul class="planned">${upcoming.length ? upcoming.map(b => `<li>${lockI}<b>${esc(b.name)}</b> · ${esc(GE.state.buildingState(b, ev).req)}</li>`).join('') : '<li>Everything unlocked. Build the Smart Clinic!</li>'}</ul></div></section>
  <section class="wrap"><div class="sechead"><h2>Activity ledger</h2><span class="pill st-soon">Simulated demo progress</span></div><div class="ledger"><table><thead><tr><th>Activity</th><th>Sparks</th><th>XP</th><th></th></tr></thead><tbody>
    ${s.tx.slice().reverse().slice(0, 16).map(t => `<tr><td>${esc(t.label)}</td><td class="${t.sparks < 0 ? 'neg' : 'pos'}">${t.sparks > 0 ? '+' : ''}${t.sparks || '–'}</td><td>${t.xp ? '+' + t.xp : '–'}</td><td>${t.sim ? '<span class="simtag">simulated</span>' : '<span class="realtag">from game</span>'}</td></tr>`).join('')}</tbody></table></div></section>
  <section class="wrap"><div class="danger"><div><b>Reset demo progress</b><span>Clears the platform's demo state on this device. The Anatomy Run and Root Cause saves are not touched.</span></div><button class="btn ghost" id="resetAsk" type="button">Reset demo</button><div id="resetConfirm" hidden><span>Reset everything?</span><button class="btn danger-btn" id="resetYes" type="button">Yes, reset</button><button class="btn ghost" id="resetNo" type="button">Cancel</button></div></div>
  <p class="muted small">No account, no name, no payments and no tracking. Progress is stored only in this browser.</p></section>`;
}
function notFound(){ return `<section class="wrap pagehead"><h1>Page not found</h1><p><a href="#home">Back home</a></p></section>`; }

GE.views = {home, explore, category, anatomyRun, rootCause, library, learning, clinic, buildingPanel, future, profile, notFound};
})();
