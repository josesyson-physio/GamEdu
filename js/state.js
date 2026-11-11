/* Gamified Edu demo: state, Anatomy Run bridge (read-only), rewards and unlock rules */
'use strict';
(function(){
const KEY = 'gamified-edu-demo';
const AR_KEY = 'physio-quest';               // Anatomy Run's own save. READ ONLY: never written here.
const SEED_SPARKS = 300;

function fresh(){
  return {v:1, look:0, sparks:SEED_SPARKS, xp:0,
    buildings:{reception:1}, badges:{}, missions:{},
    credited:{}, simMilestone:false,
    lab:{done:false, attempts:0, best:0, correct:{}},
    seenVision:false,
    tx:[{t:Date.now(), kind:'seed', label:'Demo starting balance', sparks:SEED_SPARKS, xp:0, sim:true}]};
}
function load(){
  try{
    const raw = JSON.parse(localStorage.getItem(KEY));
    if(raw && raw.v === 1 && typeof raw === 'object') return sanitize(Object.assign(fresh(), raw));
  }catch(e){}
  return fresh();
}
function num(v, max){ v = +v; return Number.isFinite(v) && v >= 0 ? Math.min(Math.floor(v), max) : 0; }
function obj(v){ return v && typeof v === 'object' && !Array.isArray(v); }
function sanitize(s){
  s.sparks = num(s.sparks, 1e6); s.xp = num(s.xp, 1e6); s.look = s.look === 1 ? 1 : 0;
  ['buildings','badges','missions','credited'].forEach(k => { if(!obj(s[k])) s[k] = {}; });
  const ids = new Set(GE.BUILDINGS.map(b => b.id));
  for(const k of Object.keys(s.buildings)){ if(!ids.has(k)) delete s.buildings[k]; else s.buildings[k] = Math.min(3, num(s.buildings[k], 3)); }
  if(!s.buildings.reception) s.buildings.reception = 1;
  if(!obj(s.lab)) s.lab = {done:false, attempts:0, best:0, correct:{}};
  if(!obj(s.lab.correct)) s.lab.correct = {};
  if(!Array.isArray(s.tx)) s.tx = [];
  s.tx = s.tx.slice(-60);
  s.simMilestone = !!s.simMilestone; s.seenVision = !!s.seenVision;
  return s;
}
let S = load();
const listeners = [];
function save(){ try{ localStorage.setItem(KEY, JSON.stringify(S)); }catch(e){} listeners.forEach(f => { try{ f(); }catch(e){} }); }

/* ---------- Anatomy Run bridge: reads the real game's progress on this same site, never writes ---------- */
function readAnatomyRun(){
  try{
    const ar = JSON.parse(localStorage.getItem(AR_KEY));
    if(!obj(ar) || !obj(ar.done)) return {found:false, levels:[], sparks:0};
    const levels = Object.keys(ar.done).map(Number).filter(n => Number.isInteger(n) && n >= 1 && n <= 22).sort((a,b) => a-b);
    return {found:true, levels, sparks:num(ar.sparks, 1e6), look: ar.av === 1 ? 1 : 0};
  }catch(e){ return {found:false, levels:[], sparks:0}; }
}

/* ---------- learning evidence ---------- */
function evidence(){
  const ar = readAnatomyRun();
  const real = ar.levels.length;
  const sim = S.simMilestone ? 6 : 0;
  return {ar, arLevels: Math.max(real, sim), arReal: real, simulated: sim > real, labDone: !!S.lab.done};
}
function stageDone(n, ev){
  ev = ev || evidence();
  if(n === 1) return ev.arLevels >= 6;
  if(n === 2) return stageDone(1, ev) && ev.labDone;
  return false;                                   // stages 3-6 are future modules
}
function stageProgress(n, ev){
  ev = ev || evidence();
  if(n === 1) return Math.min(1, ev.arLevels / 6);
  if(n === 2){ if(!stageDone(1, ev)) return 0; return ev.labDone ? 1 : (Object.keys(S.lab.correct).length + (S.lab.practical ? 1 : 0)) / 4; }
  return 0;
}
function skillsOf(n, ev){
  ev = ev || evidence();
  const st = GE.STAGES[n-1];
  if(n === 1) return st.skills.map(([name, lv]) => ({name, got: ev.arLevels >= lv, need:`${lv} Anatomy Run level${lv > 1 ? 's' : ''}`}));
  if(n === 2){
    const core = {'Patient history':0, 'Special tests':1, 'Red-flag recognition':2};
    return st.skills.map(name => name in core
      ? {name, got: !!S.lab.correct[core[name]], need:'Assessment Lab challenge'}
      : name === 'Range of motion' ? {name, got: !!S.lab.practical, need:'Assessment Lab practical: goniometry'}
      : {name, got:false, need:'Future Assessment Lab mission'});
  }
  return st.skills.map(name => ({name, got:false, need:'Future game module'}));
}
function stagesComplete(ev){ let c = 0; for(let n = 1; n <= 6; n++) if(stageDone(n, ev)) c++; return c; }

/* ---------- clinic rules ---------- */
function buildingState(b, ev){
  ev = ev || evidence();
  const lvl = S.buildings[b.id] || 0;
  let unlocked;
  if(b.need === 0) unlocked = true;
  else if(b.needSkill) unlocked = ev.arLevels >= 1;
  else if(b.needAll) unlocked = stagesComplete(ev) >= 6;
  else unlocked = stageDone(b.need, ev);
  const nextCost = lvl < 3 ? b.cost[lvl] : null;
  return {lvl, unlocked, nextCost, canAfford: nextCost != null && S.sparks >= nextCost,
    req: b.need === 0 ? 'Available from the start'
      : b.needSkill ? `Learning evidence: ${b.needSkill} (solve 1 Anatomy Run level)`
      : b.needAll ? 'Complete all six learning stages'
      : `Complete Stage ${b.need}: ${GE.STAGES[b.need-1].name}`};
}
function buyBuilding(id){
  const b = GE.BUILDINGS.find(x => x.id === id); if(!b) return {ok:false, msg:'Unknown building'};
  const st = buildingState(b);
  if(!st.unlocked) return {ok:false, msg:'Locked: ' + st.req};
  if(st.nextCost == null) return {ok:false, msg:'Already at the highest level'};
  if(S.sparks < st.nextCost) return {ok:false, msg:`You need ${st.nextCost - S.sparks} more sparks`};
  S.sparks -= st.nextCost; S.buildings[id] = st.lvl + 1;
  const xp = st.lvl === 0 ? 40 : 25; S.xp += xp;
  S.tx.push({t:Date.now(), kind:'spend', label:`${st.lvl === 0 ? 'Built' : 'Upgraded'} ${b.name} to level ${st.lvl + 1}`, sparks:-st.nextCost, xp, sim:true});
  if(st.lvl === 0 && id !== 'reception') badge('build');
  if(st.lvl + 1 >= 2) badge('upgrade');
  save();
  return {ok:true, lvl: st.lvl + 1, cost: st.nextCost, xp};
}

/* ---------- rewards ---------- */
function badge(id){ if(!S.badges[id]){ S.badges[id] = Date.now(); return true; } return false; }
function grant(label, sparks, xp, sim){
  S.sparks += sparks; S.xp += xp;
  S.tx.push({t:Date.now(), kind:'earn', label, sparks, xp, sim:!!sim});
}
/* credit new Anatomy Run evidence once per level, and the Stage 1 milestone once */
function syncEvidence(){
  const ev = evidence(); const events = [];
  for(const n of ev.ar.levels){
    if(!S.credited['ar' + n]){ S.credited['ar' + n] = 1; grant(`Anatomy Run level ${n} solved`, 20, 40, false); events.push({kind:'level', n}); }
  }
  if(ev.arLevels >= 1) badge('firstLevel');
  if(stageDone(1, ev) && !S.missions.stage1){
    S.missions.stage1 = Date.now(); grant('Stage 1 milestone: Anatomical Foundations', 150, 100, ev.simulated);
    badge('stage1'); events.push({kind:'stage', n:1});
  }
  if(stageDone(2, ev) && !S.missions.stage2){
    S.missions.stage2 = Date.now(); grant('Stage 2 milestone: Assessment Skills', 200, 150, false);
    events.push({kind:'stage', n:2});
  }
  if(events.length) save();
  return events;
}
function simulateMilestone(){
  if(S.simMilestone) return false;
  S.simMilestone = true;
  S.tx.push({t:Date.now(), kind:'sim', label:'Simulated: 6 Anatomy Run levels (presenter control)', sparks:0, xp:0, sim:true});
  save(); return true;
}
function recordLab(results, practical){ // results: booleans per question; practical: {pass, error}
  S.lab.attempts++;
  if(practical && practical.pass && !S.lab.practical){ S.lab.practical = 1; grant('Assessment Lab practical: elbow goniometry passed', 50, 70, true); }
  const score = results.filter(Boolean).length;
  results.forEach((ok, i) => { if(ok && !S.lab.correct[i]){ S.lab.correct[i] = 1; grant(`Assessment Lab: ${(window.LAB_CONTENT.challenges[i] || {}).skill || 'challenge'} correct`, 40, 50, window.LAB_CONTENT.status !== 'reviewed'); } });
  S.lab.best = Math.max(S.lab.best, score);
  const firstClear = score === results.length && !!S.lab.practical && !S.lab.done;
  if(firstClear){ S.lab.done = true; grant('Assessment Lab mission complete', 80, 120, window.LAB_CONTENT.status !== 'reviewed'); badge('lab'); }
  save();
  return {score, firstClear};
}
function markVision(){ if(!S.seenVision){ S.seenVision = true; badge('vision'); save(); } }
function setLook(l){ S.look = l === 1 ? 1 : 0; save(); }
function reset(){ S = fresh(); try{ localStorage.removeItem(KEY); }catch(e){} save(); }
function levelInfo(){
  let cur = GE.LEVEL_TITLES[0], next = null, idx = 0;
  GE.LEVEL_TITLES.forEach((t, i) => { if(S.xp >= t[0]){ cur = t; idx = i; } });
  next = GE.LEVEL_TITLES[idx + 1] || null;
  return {level: idx + 1, title: cur[1], from: cur[0], to: next ? next[0] : null, nextTitle: next ? next[1] : null};
}

GE.state = {get:() => S, save, on:f => listeners.push(f), readAnatomyRun, evidence, stageDone, stageProgress, skillsOf, stagesComplete,
  buildingState, buyBuilding, syncEvidence, simulateMilestone, recordLab, markVision, setLook, reset, levelInfo, badge,
  KEY, AR_KEY};
})();
