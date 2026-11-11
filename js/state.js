/* Gamified Edu demo: state, Anatomy Run bridge (read-only), rewards and Jo's Clinic rules */
'use strict';
(function(){
const KEY = 'gamified-edu-demo';
const AR_KEY = 'physio-quest';               // Anatomy Run's own save. READ ONLY: never written here.
const RC_KEY = 'root-cause';                 // Root Raid: Body City's own save. READ ONLY here too.
const SEED_SPARKS = 300;
const VERSION = 2;

function fresh(){
  return {v:VERSION, look:0, sparks:SEED_SPARKS, xp:0, buildings:{reception:1}, badges:{}, credited:{}, rcCredited:{}, stagePaid:{}, sim:{}, seenVision:false,
    tx:[{t:Date.now(), label:'Demo starting balance', sparks:SEED_SPARKS, xp:0, sim:true}]};
}
const num = (v, max) => { v = +v; return Number.isFinite(v) && v >= 0 ? Math.min(Math.floor(v), max) : 0; };
const obj = v => v && typeof v === 'object' && !Array.isArray(v);
function sanitize(s){
  s.sparks = num(s.sparks, 1e6); s.xp = num(s.xp, 1e6); s.look = s.look === 1 ? 1 : 0;
  ['buildings','badges','credited','rcCredited','stagePaid','sim'].forEach(k => { if(!obj(s[k])) s[k] = {}; });
  const ids = new Set(GE.BUILDINGS.map(b => b.id));
  for(const k of Object.keys(s.buildings)){ if(!ids.has(k)) delete s.buildings[k]; else s.buildings[k] = Math.min(3, num(s.buildings[k], 3)); }
  if(!s.buildings.reception) s.buildings.reception = 1;
  for(const k of Object.keys(s.credited)) s.credited[k] = Math.min(3, num(s.credited[k], 3));
  for(const k of Object.keys(s.sim)) s.sim[k] = Math.min(3, num(s.sim[k], 3));
  for(const k of Object.keys(s.rcCredited)){ if(!(k in GE.RC_CASES)) delete s.rcCredited[k]; else s.rcCredited[k] = Math.min(3, num(s.rcCredited[k], 3)); }
  if(!Array.isArray(s.tx)) s.tx = []; s.tx = s.tx.slice(-80);
  s.seenVision = !!s.seenVision;
  return s;
}
function load(){
  try{ const raw = JSON.parse(localStorage.getItem(KEY)); if(obj(raw) && raw.v === VERSION) return sanitize(Object.assign(fresh(), raw)); }catch(e){}
  return fresh();
}
let S = load();
const listeners = [];
function save(){ try{ localStorage.setItem(KEY, JSON.stringify(S)); }catch(e){} listeners.forEach(f => { try{ f(); }catch(e){} }); }

/* ---------- Anatomy Run bridge: reads the real game's progress on this same site, never writes ---------- */
function readAnatomyRun(){
  try{
    const ar = JSON.parse(localStorage.getItem(AR_KEY));
    if(!obj(ar) || !obj(ar.done)) return {found:false, stars:{}, count:0, sparks:0};
    const stars = {};
    for(const [k, v] of Object.entries(ar.done)){ const n = +k; if(Number.isInteger(n) && n >= 1 && n <= 22) stars[n] = Math.max(1, Math.min(3, num(v, 3))); }
    return {found:true, stars, count:Object.keys(stars).length, sparks:num(ar.sparks, 1e6)};
  }catch(e){ return {found:false, stars:{}, count:0, sparks:0}; }
}

/* ---------- Root Cause bridge: same site, read only ---------- */
function readRootCause(){
  try{
    const rc = JSON.parse(localStorage.getItem(RC_KEY));
    if(!obj(rc) || !obj(rc.done)) return {found:false, stars:{}, count:0};
    const stars = {};
    for(const [k, v] of Object.entries(rc.done)) if(Object.prototype.hasOwnProperty.call(GE.RC_CASES, k)) stars[k] = Math.max(1, Math.min(3, num(v, 3)));
    return {found:true, stars, count:Object.keys(stars).length};
  }catch(e){ return {found:false, stars:{}, count:0}; }
}
function treatmentSkills(){ const rc = readRootCause(); return Object.keys(GE.RC_CASES).map(id => ({id, name:GE.RC_CASES[id], stars:rc.stars[id] || 0})); }

/* ---------- learning evidence: real solved levels, plus clearly labelled presenter simulation ---------- */
function evidence(){
  const ar = readAnatomyRun(), stars = {}, src = {};
  for(const [n, st] of Object.entries(ar.stars)){ stars[n] = st; src[n] = 'real'; }
  for(const [n, st] of Object.entries(S.sim)){ if(!stars[n]){ stars[n] = st; src[n] = 'sim'; } }
  return {ar, stars, src, count:Object.keys(stars).length, realCount:ar.count};
}
function stageDone(n, ev){ ev = ev || evidence(); const st = GE.STAGES[n - 1]; return !!st && st.levels.every(l => ev.stars[l]); }
function stageProgress(n, ev){ ev = ev || evidence(); const st = GE.STAGES[n - 1]; return st.levels.filter(l => ev.stars[l]).length / st.levels.length; }
function stagesComplete(ev){ ev = ev || evidence(); return GE.STAGES.filter(st => stageDone(st.n, ev)).length; }
function skills(ev){ ev = ev || evidence(); return Object.keys(GE.CASES).map(Number).map(n => ({n, name:GE.CASES[n], stars:ev.stars[n] || 0, src:ev.src[n] || null})); }

/* ---------- Jo's Clinic rules ---------- */
/* Upgrade caps come from skills, not sparks. Sparks pay; learning decides how high a building may go. */
function minStars(levels, ev){ return levels.length ? Math.min(...levels.map(l => ev.stars[l] || 0)) : 0; }
function countAtLeast(k, ev){ return Object.values(ev.stars).filter(x => x >= k).length; }
function capOf(b, ev){            // -> {cap: 0..3, reqs:[text for level 1,2,3], have:[bool,bool,bool]}
  const n = b.need, all = Object.keys(GE.CASES).map(Number);
  if(n.start){ const h = [true, ev.count >= 6, ev.count >= 14];
    return {have:h, reqs:['Open from the start', 'Earn 6 case skills', 'Earn 14 case skills']}; }
  if(n.levels){ const h = [ev.count >= 1, ev.count >= 11, ev.count >= 22];
    return {have:h, reqs:['Earn your first case skill', 'Earn 11 case skills', 'Earn all 22 case skills']}; }
  if(n.stage){ const st = GE.STAGES[n.stage - 1], m = minStars(st.levels, ev), w = `world ${st.n} (${st.name}, levels ${st.from}–${st.to})`;
    return {have:[m >= 1, m >= 2, m >= 3], reqs:[`Complete ${w}`, `Every case in ${w} at 2★ or more`, `Every case in ${w} at 3★ (mastery)`]}; }
  const m = minStars(all, ev), others = GE.BUILDINGS.filter(x => x.id !== b.id && x.id !== 'smart' && x.id !== 'research');
  const allBuilt = GE.BUILDINGS.filter(x => x.id !== b.id && x.id !== 'smart').every(x => (S.buildings[x.id] || 0) >= 1);
  const base = m >= 1 && (!n.allBuilt || allBuilt);
  return {have:[base, base && countAtLeast(2, ev) >= 22, base && countAtLeast(3, ev) >= 22],
    reqs:[n.allBuilt ? 'Complete all 4 worlds and build every other building' : 'Complete all 4 Anatomy Run worlds', 'All 22 cases at 2★ or more', 'All 22 cases at 3★ (mastery)']};
}
function buildingState(b, ev){
  ev = ev || evidence();
  const lvl = S.buildings[b.id] || 0, c = capOf(b, ev);
  let cap = 0; while(cap < 3 && c.have[cap]) cap++;
  const unlocked = cap >= 1 || lvl >= 1;
  const nextCost = lvl < 3 ? b.cost[lvl] : null;
  const nextAllowed = lvl < cap;
  return {lvl, cap, unlocked, req:c.reqs[0], reqs:c.reqs, have:c.have, nextCost, nextAllowed, nextReq: lvl < 3 ? c.reqs[lvl] : null,
    canAfford: nextCost != null && nextAllowed && S.sparks >= nextCost};
}
function buyBuilding(id){
  const b = GE.BUILDINGS.find(x => x.id === id); if(!b) return {ok:false, msg:'Unknown building'};
  const st = buildingState(b);
  if(st.nextCost == null) return {ok:false, msg:'Already at the highest level'};
  if(!st.nextAllowed) return {ok:false, msg:'Skill needed first: ' + st.nextReq};
  if(S.sparks < st.nextCost) return {ok:false, msg:`You need ${st.nextCost - S.sparks} more sparks`};
  S.sparks -= st.nextCost; S.buildings[id] = st.lvl + 1;
  const xp = st.lvl === 0 ? 40 : 25; S.xp += xp;
  S.tx.push({t:Date.now(), label:`${st.lvl === 0 ? 'Built' : 'Upgraded'} ${b.name} (level ${st.lvl + 1})`, sparks:-st.nextCost, xp, sim:true});
  if(st.lvl === 0 && id !== 'reception') badge('build');
  if(st.lvl + 1 >= 2) badge('upgrade');
  if(id === 'smart') badge('smart');
  save();
  return {ok:true, lvl:st.lvl + 1, cost:st.nextCost, xp};
}
function setupScore(){ return GE.BUILDINGS.reduce((a, b) => a + (S.buildings[b.id] || 0), 0); }   // out of 36

/* ---------- rewards: paid once per level; better stars on a replay pay the difference ---------- */
function badge(id){ if(!S.badges[id]){ S.badges[id] = Date.now(); return true; } return false; }
function grant(label, sparks, xp, sim){ S.sparks += sparks; S.xp += xp; S.tx.push({t:Date.now(), label, sparks, xp, sim:!!sim}); }
function syncEvidence(){
  const ev = evidence(), R = GE.REWARD, events = [];
  for(const [k, stars] of Object.entries(ev.stars)){
    const n = +k, had = S.credited[n] || 0;
    if(stars > had){
      const sim = ev.src[n] === 'sim';
      const sp = (had ? 0 : R.levelSparks) + (stars - had) * R.starSparks, xp = (had ? 0 : R.levelXp) + (stars - had) * R.starXp;
      S.credited[n] = stars;
      grant(had ? `Level ${n} improved to ${stars}★: ${GE.CASES[n]}` : `Level ${n} solved (${stars}★): ${GE.CASES[n]}`, sp, xp, sim);
      events.push({kind:'level', n, sp, xp});
    }
  }
  const rc = readRootCause();
  for(const [id, stars] of Object.entries(rc.stars)){
    const had = S.rcCredited[id] || 0;
    if(stars > had){
      const sp = (had ? 0 : R.levelSparks) + (stars - had) * R.starSparks, xp = (had ? 0 : R.levelXp) + (stars - had) * R.starXp;
      S.rcCredited[id] = stars;
      grant(had ? `Root Raid improved to ${stars}★: ${GE.RC_CASES[id]}` : `Root Raid closed (${stars}★): ${GE.RC_CASES[id]}`, sp, xp, false);
      events.push({kind:'rc', id, sp, xp});
    }
  }
  if(rc.count >= 1) badge('rootFirst');
  if(rc.count >= 10) badge('rootAll');
  if(ev.count >= 1) badge('firstLevel');
  if(Object.values(ev.stars).filter(x => x === 3).length >= 5) badge('stars');
  for(const st of GE.STAGES){
    if(stageDone(st.n, ev) && !S.stagePaid[st.n]){
      S.stagePaid[st.n] = Date.now(); const sim = st.levels.some(l => ev.src[l] === 'sim');
      grant(`World ${st.n} complete: ${st.name}`, st.bonus, R.stageXp, sim); badge('stage' + st.n);
      events.push({kind:'stage', n:st.n});
    }
  }
  if(events.length) save();
  return events;
}
/* presenter control: simulate the next incomplete world (2 stars per level), always labelled as simulated */
function simulateWorld(){
  const ev = evidence(), st = GE.STAGES.find(x => !stageDone(x.n, ev)); if(!st) return null;
  st.levels.forEach(l => { if(!ev.stars[l]) S.sim[l] = 2; });
  S.tx.push({t:Date.now(), label:`Simulated: world ${st.n} (${st.name}) for the presentation`, sparks:0, xp:0, sim:true});
  save(); return st;
}
function markVision(){ if(!S.seenVision){ S.seenVision = true; save(); } }
function setLook(l){ S.look = l === 1 ? 1 : 0; save(); }
function reset(){ S = fresh(); try{ localStorage.removeItem(KEY); }catch(e){} save(); }
function levelInfo(){
  let idx = 0; GE.LEVEL_TITLES.forEach((t, i) => { if(S.xp >= t[0]) idx = i; });
  const cur = GE.LEVEL_TITLES[idx], next = GE.LEVEL_TITLES[idx + 1] || null;
  return {level:idx + 1, title:cur[1], from:cur[0], to:next ? next[0] : null, nextTitle:next ? next[1] : null};
}

GE.state = {get:() => S, save, on:f => listeners.push(f), readAnatomyRun, evidence, stageDone, stageProgress, stagesComplete, skills,
  buildingState, buyBuilding, setupScore, syncEvidence, simulateWorld, markVision, setLook, reset, levelInfo, badge, readRootCause, treatmentSkills, KEY, AR_KEY, RC_KEY};
})();
