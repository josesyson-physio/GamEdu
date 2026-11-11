/* Gamified Edu demo: static catalogue (categories, games, skill stages, clinic buildings) */
'use strict';
window.GE = window.GE || {};
GE.ANATOMY_RUN_URL = 'https://josesyson-physio.github.io/anatomy_run/';

GE.CATEGORIES = [
  {id:'physio', name:'Physiotherapy & Health Sciences', short:'Physiotherapy', status:'available', env:'physio',
   blurb:'Anatomy, assessment, clinical reasoning and rehabilitation, learned by playing.',
   planned:['Anatomy Run (live)','Assessment Lab (live demo)','Clinical Reasoning (planned)','Rehab Planner (planned)']},
  {id:'school', name:'School Education', short:'School', status:'soon', env:'school',
   blurb:'Core school subjects as short story-driven adventures.',
   planned:['Language quests','History expeditions','Geography explorer']},
  {id:'science', name:'Science & Discovery', short:'Science', status:'soon', env:'science',
   blurb:'Experiments, ecosystems and the universe, explored hands-on.',
   planned:['Virtual lab bench','Ecosystem builder','Space mission']},
  {id:'maths', name:'Mathematics', short:'Maths', status:'soon', env:'maths',
   blurb:'Number sense, geometry and logic as puzzle worlds.',
   planned:['Puzzle towers','Geometry builder','Logic circuits']},
  {id:'medical', name:'Medical Education', short:'Medical', status:'future', env:'medical',
   blurb:'Case-based learning for medical students, built with clinical educators.',
   planned:['Case wards','Pharmacology lab','Emergency simulator']},
  {id:'engineering', name:'Engineering & Technology', short:'Engineering', status:'future', env:'engineering',
   blurb:'Design, build and test machines, circuits and code.',
   planned:['Bridge builder','Robot workshop','Circuit city']}
];
GE.STATUS_LABEL = {available:'Available', soon:'Coming soon', future:'Future expansion'};

GE.PHYSIO_SKILLS = ['Anatomy','Physiology','Biomechanics','Assessment','Clinical Reasoning','Diagnosis','Rehabilitation','Patient Management'];

GE.GAMES = [
  {id:'anatomy-run', name:'Anatomy Run', cat:'physio', subject:'Anatomy · Clinical reasoning', kind:'real',
   desc:'A platformer where Jo runs through 22 levels and 4 worlds, collects clue gems and makes the diagnosis.'},
  {id:'assessment-lab', name:'Assessment Lab', cat:'physio', subject:'Assessment', kind:'demo',
   desc:'Take a history, choose the right special test and spot the red flag. A short clinical mission.'},
  {id:'clinic', name:"Jo's Clinic", cat:'physio', subject:'Progression · Clinic building', kind:'demo',
   desc:'Spend the sparks you earn to grow a small practice into a futuristic smart rehabilitation centre.'}
];

/* Skill stages. Unlocks come from learning evidence only, never from sparks. */
GE.STAGES = [
  {n:1, name:'Anatomical Foundations', game:'Anatomy Run', gameId:'anatomy-run', live:true,
   evidence:'Solve Anatomy Run levels (6 levels completes the stage)',
   skills:[['Regional anatomy',1],['Muscles',2],['Nerves',3],['Joint structures',4],['Anatomical relationships',6]],
   unlocks:['assessmentLab'], unlockText:'Assessment Lab (game and clinic building)'},
  {n:2, name:'Assessment Skills', game:'Assessment Lab', gameId:'assessment-lab', live:true,
   evidence:'Complete the Assessment Lab mission: 3 challenges correct and the practical goniometry task passed',
   skills:['Patient history','Special tests','Red-flag recognition','Observation','Range of motion','Muscle strength testing'],
   unlocks:['diagnostic'], unlockText:'Diagnostic Wing'},
  {n:3, name:'Clinical Reasoning', game:'Future game module', live:false,
   skills:['Differential diagnosis','Pattern recognition','Clinical reasoning','Identifying mimics','Decision-making'],
   unlocks:['gym','neuro'], unlockText:'Rehabilitation Gym and Neuro Rehabilitation Centre'},
  {n:4, name:'Rehabilitation Planning', game:'Future game module', live:false,
   skills:['Exercise prescription','Goal setting','Outcome measures','Progression','Patient education'],
   unlocks:['sports','paeds','hydro'], unlockText:'Advanced rehabilitation: Sports Lab, Paediatric Unit, Hydrotherapy'},
  {n:5, name:'Clinical Practice & Management', game:'Future game module', live:false,
   skills:['Patient communication','Professional ethics','Treatment planning','Clinical documentation','Clinic operations','Team management'],
   unlocks:['research'], unlockText:'Smart clinic development: Research Laboratory'},
  {n:6, name:'Future Technology', game:'Future game modules', live:false,
   skills:['Robotic rehabilitation','AI-assisted analysis','Wearable technologies','Gait analysis','Advanced biofeedback','Research and innovation'],
   unlocks:['robotics','smart'], unlockText:'Robotics & AI Centre and the Futuristic Smart Clinic'}
];

/* Broader frame: Miller's pyramid levels and recognised competency areas (see docs/ARCHITECTURE.md for sources) */
GE.MILLER = [
  {id:'knows', name:'Knows', desc:'Facts and concepts', where:'Anatomy Run clue gems, flashcards'},
  {id:'knowshow', name:'Knows how', desc:'Applies knowledge to a case', where:'Diagnosis and reasoning checks'},
  {id:'showshow', name:'Shows how', desc:'Performs a skill in simulation', where:'Assessment Lab practical tasks'},
  {id:'does', name:'Does', desc:'Performs with real patients', where:'Supervised clinical placement only, never in a game'}
];
GE.DOMAINS = ['Clinical knowledge','Practical skills','Clinical reasoning','Communication','Ethics & professionalism','Teamwork','Lifelong learning'];
GE.STAGE_FRAME = {1:{miller:['knows','knowshow'], domains:['Clinical knowledge','Clinical reasoning']},
  2:{miller:['knowshow','showshow'], domains:['Practical skills','Clinical reasoning','Communication']},
  3:{miller:['knowshow'], domains:['Clinical reasoning','Lifelong learning']},
  4:{miller:['showshow'], domains:['Practical skills','Communication']},
  5:{miller:['knowshow','showshow'], domains:['Communication','Ethics & professionalism','Teamwork']},
  6:{miller:['knows','showshow'], domains:['Lifelong learning','Practical skills']}};

/* Clinic buildings. cost[i] = sparks for level i+1; need = learning stage required. */
GE.BUILDINGS = [
  {id:'reception', name:'Reception', need:0, cost:[0,120,260], col:['#f4e3c3','#d8b98a','#b8955f'], roof:'#c8452f', sign:'WELCOME', icon:'plus',
   desc:'Where every patient journey starts.', fn:'Booking, first impressions and patient flow.'},
  {id:'library', name:'Anatomy Library', need:1, needSkill:'Regional anatomy', cost:[120,220,380], col:['#e9dcc4','#c9b48f','#a68c63'], roof:'#235A40', sign:'LIBRARY', icon:'book',
   desc:'Atlases, models and a skeleton called Stan.', fn:'Stores the anatomy knowledge Jo earns in Anatomy Run.'},
  {id:'assessmentLab', name:'Assessment Lab', need:1, cost:[250,380,520], col:['#e3f0ef','#b9d6d3','#8fb6b2'], roof:'#2f7f86', sign:'LAB', icon:'lens',
   desc:'Couches, goniometers and reflex hammers.', fn:'History taking, special tests and red-flag screening.'},
  {id:'diagnostic', name:'Diagnostic Wing', need:2, cost:[350,500,700], col:['#e7e9f6','#c2c7e6','#9aa2d1'], roof:'#4a4f9a', sign:'DIAGNOSTICS', icon:'scan',
   desc:'Ultrasound, scans and a reporting room.', fn:'Bringing findings together into a diagnosis.'},
  {id:'gym', name:'Rehabilitation Gym', need:3, cost:[400,560,760], col:['#fbe2d9','#efb9a6','#d98f76'], roof:'#c25e49', sign:'REHAB GYM', icon:'dumbbell',
   desc:'Parallel bars, weights and a lot of encouragement.', fn:'Exercise therapy and graded return to activity.'},
  {id:'neuro', name:'Neuro Rehabilitation Centre', need:3, cost:[450,620,820], col:['#ece2f6','#cdb8e6','#a98ccf'], roof:'#6b4a9a', sign:'NEURO', icon:'brain',
   desc:'Balance systems and task-specific training.', fn:'Stroke, Parkinson’s and vestibular rehabilitation.'},
  {id:'sports', name:'Sports Performance Lab', need:4, cost:[500,680,900], col:['#e2f2dd','#b7dcab','#8cc07c'], roof:'#3f8a3a', sign:'SPORTS LAB', icon:'bolt',
   desc:'Force plates, sprint track and a recovery zone.', fn:'Return-to-sport testing and performance.'},
  {id:'paeds', name:'Paediatric Therapy Unit', need:4, cost:[450,620,820], col:['#fff1c9','#f5d98a','#e5bd55'], roof:'#e07a3a', sign:'KIDS', icon:'star',
   desc:'Play equipment that is secretly therapy.', fn:'Developmental and neurological care for children.'},
  {id:'hydro', name:'Hydrotherapy Centre', need:4, cost:[550,740,950], col:['#dff1fa','#a9d8ef','#76bbe0'], roof:'#2f86c0', sign:'HYDRO', icon:'wave',
   desc:'A warm pool with lifts and underwater treadmill.', fn:'Low-load exercise in water.'},
  {id:'research', name:'Research Laboratory', need:5, cost:[600,820,1100], col:['#eef0f2','#cfd5db','#aab3bd'], roof:'#3b4a5a', sign:'RESEARCH', icon:'flask',
   desc:'Where clinic data becomes new evidence.', fn:'Outcome tracking, trials and innovation.'},
  {id:'robotics', name:'Robotics & AI Centre', need:6, cost:[800,1050,1400], col:['#e4eef7','#b8cde3','#8aaacd'], roof:'#2b5d8f', sign:'ROBOTICS · AI', icon:'chip',
   desc:'Robotic gait trainers and AI movement analysis.', fn:'Technology that gives clinicians better information.'},
  {id:'smart', name:'Futuristic Smart Clinic', need:6, needAll:true, cost:[1500,2000,2600], col:['#e6f5f3','#a7ddd6','#6cc2b8'], roof:'#173F31', sign:'SMART CLINIC', icon:'spark',
   desc:'The whole vision in one connected building.', fn:'Every service, every sensor, one patient journey.'}
];
/* plot positions on the isometric clinic map (tile units) */
GE.PLOTS = {reception:[6,7], library:[2,7], assessmentLab:[10,7], diagnostic:[6,3], gym:[2,3], neuro:[10,3], sports:[14,7], paeds:[14,3], hydro:[2,11], research:[10,11], robotics:[14,11], smart:[6,11]};

GE.LEVEL_TITLES = [[0,'Curious Learner'],[200,'Explorer'],[500,'Practitioner in Training'],[900,'Skilled Learner'],[1400,'Clinic Builder'],[2000,'Visionary']];
GE.BADGES = [
  {id:'welcome', name:'First steps', desc:'Opened the Gamified Edu universe'},
  {id:'firstLevel', name:'First diagnosis', desc:'Solved an Anatomy Run level'},
  {id:'stage1', name:'Anatomy foundations', desc:'Completed Stage 1 learning evidence'},
  {id:'lab', name:'Assessment mission', desc:'Completed the Assessment Lab mission'},
  {id:'build', name:'First build', desc:'Built a new clinic building'},
  {id:'upgrade', name:'Upgrader', desc:'Upgraded a building to level 2'},
  {id:'vision', name:'Visionary', desc:'Previewed the Futuristic Smart Clinic'}
];
