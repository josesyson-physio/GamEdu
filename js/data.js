/* Gamified Edu demo: static catalogue (categories, games, skill stages, clinic buildings) */
'use strict';
window.GE = window.GE || {};
GE.ANATOMY_RUN_URL = 'https://josesyson-physio.github.io/anatomy_run/';
GE.ROOT_CAUSE_URL = 'root-cause/';

GE.CATEGORIES = [
  {id:'physio', name:'Physiotherapy & Health Sciences', short:'Physiotherapy', status:'available', env:'physio',
   blurb:'Learn the body through play, earn skills and build your own clinic.',
   planned:['Anatomy Run (live now)','More physiotherapy games (in development)']},
  {id:'rocket', name:'Basics of Rocket Science', short:'Rocket Science', status:'soon', env:'rocket',
   blurb:'How rockets fly, from thrust and gravity to stages and orbit, learned by building and launching.',
   planned:['Thrust, gravity and drag','Fuel, stages and staging','Reaching orbit'], note:'Early ideas; the final games may change.'},
  {id:'ai-remote', name:'AI in Remote Areas', short:'AI in Remote Areas', status:'soon', env:'ai',
   blurb:'How AI can bring healthcare, learning and support to places far from cities.',
   planned:['AI health screening in villages','Telehealth with low connectivity','AI for farming and daily life'], note:'Early ideas; the final games may change.'}
];
GE.STATUS_LABEL = {available:'Available', soon:'Coming soon', future:'Future expansion'};

GE.PHYSIO_SKILLS = ['Anatomy','Clinical reasoning','Special tests','Red flags','Diagnosis','Rehabilitation'];

GE.GAMES = [
  {id:'anatomy-run', name:'Anatomy Run', cat:'physio', subject:'Anatomy · Clinical reasoning', kind:'real',
   desc:'Run through 22 levels and 4 worlds, collect clue gems and make the diagnosis. Every case you solve earns sparks and a skill.'},
  {id:'root-cause', name:'Root Cause: Body City', cat:'physio', subject:'Assessment · Treatment planning', kind:'real',
   desc:'Investigate 10 common painful conditions, clear the symptoms with the right treatment, then take down the root cause.'}
];
/* Root Cause: Body City cases (ids match root-cause/cases.js). Each solved case = one treatment skill. */
GE.RC_CASES = {'tennis-elbow':'Tennis elbow','carpal-tunnel':'Carpal tunnel syndrome','subacromial-pain':'Subacromial shoulder pain','frozen-shoulder':'Frozen shoulder',
  'cervical-radiculopathy':'Cervical radiculopathy','lbp':'Non-specific low back pain','lumbar-disc':'Lumbar disc herniation','knee-oa':'Knee osteoarthritis',
  'ankle-sprain':'Lateral ankle sprain','plantar-heel-pain':'Plantar heel pain'};
GE.CLINIC_CARD = {id:'clinic', name:"Jo's Clinic", subject:'Build your own setup',
  desc:'Spend the sparks and skills you earn in Anatomy Run to grow one room into a futuristic smart clinic.'};

/* Anatomy Run's real cases: each solved level = one case skill. Each world = one stage. */
GE.CASES = {1:'Tennis elbow',2:'Golfer’s elbow',3:'Carpal tunnel syndrome',4:'De Quervain’s tenosynovitis',5:'Rotator cuff shoulder pain',6:'Frozen shoulder',
  7:'ACL rupture',8:'Meniscus tear',9:'Patellofemoral pain',10:'Lateral ankle sprain',11:'Achilles tendinopathy',12:'Plantar heel pain',
  13:'Sciatica (lumbar radiculopathy)',14:'Cervical radiculopathy',15:'Non-specific low back pain',16:'Axial spondyloarthritis',17:'Cauda equina syndrome',
  18:'BPPV (positional vertigo)',19:'Stroke',20:'Parkinson’s disease',21:'Bell’s palsy',22:'Deep vein thrombosis'};
GE.STAGES = [
  {n:1, name:'Upper Limb Hills', theme:'Shoulder, elbow, wrist and hand', from:1, to:6, bonus:300},
  {n:2, name:'Sports Ground', theme:'Knee, ankle and foot injuries', from:7, to:12, bonus:300},
  {n:3, name:'Spine Canyon', theme:'Spine, nerves and red flags', from:13, to:17, bonus:300},
  {n:4, name:'Neuro Nights', theme:'Neurology, vestibular and vascular', from:18, to:22, bonus:300}
];
GE.STAGES.forEach(st => { st.levels = []; for(let n = st.from; n <= st.to; n++) st.levels.push(n); });

/* Rewards for real Anatomy Run progress (paid once; better stars on a replay pay the difference) */
GE.REWARD = {levelSparks:40, starSparks:20, levelXp:40, starXp:10, stageXp:150};

/* Clinic buildings. cost[i] = sparks for level i+1. Unlocks come from skills (solved levels / completed worlds). */
GE.BUILDINGS = [
  {id:'reception', name:'Reception', need:{start:true}, cost:[0,150,300], col:['#f4e3c3','#d8b98a'], roof:'#c8452f', sign:'WELCOME', icon:'plus',
   desc:'Where every patient journey starts.', fn:'Booking, first impressions and patient flow.'},
  {id:'library', name:'Anatomy Library', need:{levels:1}, cost:[100,180,300], col:['#e9dcc4','#c9b48f'], roof:'#235A40', sign:'LIBRARY', icon:'book',
   desc:'Atlases, models and a skeleton called Stan.', fn:'Holds every case Jo solves in Anatomy Run.'},
  {id:'assessment', name:'Assessment Room', need:{stage:1}, cost:[150,250,380], col:['#e3f0ef','#b9d6d3'], roof:'#2f7f86', sign:'ASSESSMENT', icon:'lens',
   desc:'Couches, goniometers and reflex hammers.', fn:'History, examination and special tests.'},
  {id:'gym', name:'Rehabilitation Gym', need:{stage:1}, cost:[200,320,480], col:['#fbe2d9','#efb9a6'], roof:'#c25e49', sign:'REHAB GYM', icon:'dumbbell',
   desc:'Parallel bars, weights and a lot of encouragement.', fn:'Exercise therapy for the upper limb and beyond.'},
  {id:'sports', name:'Sports Performance Lab', need:{stage:2}, cost:[250,380,560], col:['#e2f2dd','#b7dcab'], roof:'#3f8a3a', sign:'SPORTS LAB', icon:'bolt',
   desc:'Force plates, sprint track and a recovery zone.', fn:'Return-to-sport testing after knee and ankle injuries.'},
  {id:'hydro', name:'Hydrotherapy Centre', need:{stage:2}, cost:[250,380,560], col:['#dff1fa','#a9d8ef'], roof:'#2f86c0', sign:'HYDRO', icon:'wave',
   desc:'A warm pool with lifts and an underwater treadmill.', fn:'Low-load exercise in water.'},
  {id:'diagnostic', name:'Diagnostic Wing', need:{stage:3}, cost:[300,450,650], col:['#e7e9f6','#c2c7e6'], roof:'#4a4f9a', sign:'DIAGNOSTICS', icon:'scan',
   desc:'Ultrasound, scans and a reporting room.', fn:'Bringing findings together, and knowing when to refer.'},
  {id:'spine', name:'Spine & Posture Studio', need:{stage:3}, cost:[300,450,650], col:['#fff1c9','#f5d98a'], roof:'#e07a3a', sign:'SPINE', icon:'spine',
   desc:'Posture analysis, traction and movement retraining.', fn:'Back and neck pain care.'},
  {id:'neuro', name:'Neuro Rehabilitation Centre', need:{stage:4}, cost:[350,520,750], col:['#ece2f6','#cdb8e6'], roof:'#6b4a9a', sign:'NEURO', icon:'brain',
   desc:'Balance systems and task-specific training.', fn:'Stroke, Parkinson’s and vestibular rehabilitation.'},
  {id:'robotics', name:'Robotics & AI Centre', need:{stage:4}, cost:[350,520,750], col:['#e4eef7','#b8cde3'], roof:'#2b5d8f', sign:'ROBOTICS · AI', icon:'chip',
   desc:'Robotic gait trainers and AI movement analysis.', fn:'Technology that gives clinicians better information.'},
  {id:'research', name:'Research Laboratory', need:{allStages:true}, cost:[300,480,700], col:['#eef0f2','#cfd5db'], roof:'#3b4a5a', sign:'RESEARCH', icon:'flask',
   desc:'Where clinic data becomes new evidence.', fn:'Outcome tracking and innovation.'},
  {id:'smart', name:'Futuristic Smart Clinic', need:{allStages:true, allBuilt:true}, cost:[400,700,1000], col:['#e6f5f3','#a7ddd6'], roof:'#173F31', sign:'SMART CLINIC', icon:'spark',
   desc:'The ultimate goal: every service, every sensor, one patient journey.', fn:'Unlocks when all four worlds are complete and every other building is built.'}
];
GE.PLOTS = {reception:[6,7], library:[2,7], assessment:[10,7], gym:[14,7], sports:[2,3], hydro:[14,3], diagnostic:[6,3], spine:[10,3], neuro:[2,11], robotics:[14,11], research:[10,11], smart:[6,11]};

GE.LEVEL_TITLES = [[0,'Intern'],[300,'Junior Physio'],[800,'Physio'],[1500,'Senior Physio'],[2300,'Clinic Lead'],[3200,'Visionary']];
GE.BADGES = [
  {id:'welcome', name:'First steps', desc:'Opened the Gamified Edu universe'},
  {id:'firstLevel', name:'First diagnosis', desc:'Solved an Anatomy Run level'},
  {id:'stage1', name:'Upper Limb Hills', desc:'Completed world 1'},
  {id:'stage2', name:'Sports Ground', desc:'Completed world 2'},
  {id:'stage3', name:'Spine Canyon', desc:'Completed world 3'},
  {id:'stage4', name:'Neuro Nights', desc:'Completed world 4'},
  {id:'stars', name:'Three-star clinician', desc:'Earned 3 stars on 5 levels'},
  {id:'build', name:'First build', desc:'Built a new clinic building'},
  {id:'upgrade', name:'Upgrader', desc:'Upgraded a building to level 2'},
  {id:'smart', name:'Futuristic clinic', desc:'Built the Futuristic Smart Clinic'},
  {id:'rootFirst', name:'Root cause hunter', desc:'Solved a Root Cause: Body City case'},
  {id:'rootAll', name:'Body City hero', desc:'Solved all 10 Root Cause cases'}
];
/* Learning frame: Miller's pyramid. Anatomy Run builds "knows" and "knows how". */
GE.MILLER = [
  {id:'knows', name:'Knows', desc:'Facts and concepts', where:'Clue gems and flashcards in Anatomy Run'},
  {id:'knowshow', name:'Knows how', desc:'Applies knowledge to a case', where:'Diagnosis and reasoning checks in Anatomy Run'},
  {id:'showshow', name:'Shows how', desc:'Performs a skill in simulation', where:'Treatment choices in Root Cause; more future games'},
  {id:'does', name:'Does', desc:'Performs with real patients', where:'Supervised clinical placement only, never in a game'}
];
