/* Root Cause: Body City. Clinical content adapted from the Learn Anywhere library
   (Learn Anywhere contributors, CC BY-NC-SA 4.0), which summarises standard textbooks in its own words.
   STATUS: draft, pending clinical panel review. */
'use strict';
window.RC_TOOLS = {
"edu": {
"name": "Education & reassurance",
"col": "#F2C75C"
},
"ice": {
"name": "Ice & compression (PEACE & LOVE)",
"col": "#7fd6f0"
},
"mob": {
"name": "Joint mobilisation",
"col": "#b58cff"
},
"load": {
"name": "Progressive loading exercise",
"col": "#ff8f6b"
},
"glide": {
"name": "Nerve gliding",
"col": "#ffe066"
},
"splint": {
"name": "Neutral splint / brace",
"col": "#9be35a"
},
"stretch": {
"name": "Stretching",
"col": "#ff9ed2"
},
"balance": {
"name": "Balance training",
"col": "#5fd3a6"
},
"dnf": {
"name": "Deep neck flexor training",
"col": "#7fb4ff"
},
"dpe": {
"name": "Directional preference exercise",
"col": "#ffb347"
},
"active": {
"name": "Stay active: walking & exercise",
"col": "#77d97c"
},
"tape": {
"name": "Taping & insoles",
"col": "#e0c27a"
},
"scap": {
"name": "Scapular control exercise",
"col": "#c0a6ff"
}
};
window.RC_CASES = [
 {
  "id": "tennis-elbow",
  "title": "Lateral elbow tendinopathy (tennis elbow)",
  "district": "Elbow Bridge",
  "x": 0.8,
  "y": 0.42,
  "region": "Elbow",
  "patient": {
   "name": "Ravi",
   "age": 41,
   "job": "carpenter",
   "says": "Gripping my hammer sends pain down the outside of my elbow. It has been building for two months."
  },
  "simple": "The common extensor tendon on the outer elbow, mainly extensor carpi radialis brevis, becomes painful from repeated gripping and wrist extension. Gripping, lifting a kettle or turning a key hurts. Most people improve within a year with load management and exercise.",
  "flow": [
   "Repetitive gripping and wrist extension",
   "Tendinopathy of ECRB origin (degenerative, not mainly inflammatory)",
   "Lateral elbow pain, weak painful grip",
   "Positive Cozen, Mill and resisted middle-finger extension",
   "Education, activity modification, counterforce brace",
   "Isometric then eccentric-concentric wrist extensor loading"
  ],
  "tests": {
   "right": [
    "Cozen test",
    "Mill test"
   ],
   "wrong": [
    "Phalen test",
    "Hawkins-Kennedy test"
   ]
  },
  "flag": {
   "right": "Elbow pain with neck pain and arm paraesthesia (cervical radiculopathy)",
   "others": [
    "Pain when gripping a hammer",
    "Tenderness just below the outer elbow"
   ]
  },
  "root": {
   "name": "Degenerated wrist-extensor tendon (ECRB origin)",
   "tool": "load",
   "mimics": [
    "Ulnar nerve entrapment",
    "Elbow joint infection"
   ]
  },
  "enemies": [
   {
    "kind": "pain",
    "name": "Pain",
    "shape": "spike",
    "tool": "splint"
   },
   {
    "kind": "habit",
    "name": "Overuse habit",
    "shape": "gear",
    "tool": "edu"
   },
   {
    "kind": "weak",
    "name": "Weakness",
    "shape": "ghost",
    "tool": "load"
   }
  ],
  "tools": [
   "splint",
   "edu",
   "load"
  ],
  "decoy": {
   "name": "Complete rest in a sling",
   "why": "Complete rest de-conditions the tendon. Tendons need graded load to remodel."
  },
  "management": [
   "Education: good natural history, adjust grip and work tasks.",
   "Isometric wrist extension for pain, then slow eccentric-concentric loading (e.g. 3 x 15 with a light dumbbell), progressing over 12 weeks.",
   "Counterforce brace for activities; mobilisation with movement (lateral glide) for immediate pain-free grip.",
   "Ergonomic advice: larger grip handles, forearm in neutral."
  ],
  "flags": [
   "Elbow pain with neck pain and arm paraesthesia (cervical radiculopathy)",
   "Locking or clicking after trauma (loose body)",
   "Swollen, hot joint (infection or inflammatory arthritis)"
  ],
  "refs": [
   "Orthopedic Physical Assessment (Elbow)",
   "Brukner & Khan's Clinical Sports Medicine (Elbow and arm pain)",
   "Therapeutic Exercise for Musculoskeletal Injuries (Elbow and forearm)",
   "Bisset L, et al. Mobilisation with movement and exercise, corticosteroid injection, or wait and see for tennis elbow. BMJ. 2006;333:939."
  ],
  "source": "learn-anywhere:tennis-elbow"
 },
 {
  "id": "carpal-tunnel",
  "title": "Carpal tunnel syndrome",
  "district": "Wrist Tunnel",
  "x": 0.86,
  "y": 0.52,
  "region": "Wrist and hand",
  "patient": {
   "name": "Meera",
   "age": 48,
   "job": "tailor",
   "says": "My thumb and first fingers tingle at night. I shake my hand to get relief."
  },
  "simple": "The median nerve is squeezed in the tunnel at the front of the wrist. The thumb, index and middle fingers tingle and go numb, especially at night. Mild cases improve with a night splint and nerve gliding; severe cases need surgery.",
  "flow": [
   "Raised pressure in the carpal tunnel",
   "Median nerve ischaemia and demyelination",
   "Night tingling in the lateral 3.5 fingers",
   "Positive Phalen, Tinel, carpal compression; nerve conduction study",
   "Neutral wrist night splint, activity change, nerve and tendon glides",
   "Refer for injection or release if weakness or thenar wasting"
  ],
  "tests": {
   "right": [
    "Phalen test",
    "Tinel sign at the wrist"
   ],
   "wrong": [
    "Cozen test",
    "Spurling test"
   ]
  },
  "flag": {
   "right": "Rapid weakness or thenar wasting (urgent surgical referral)",
   "others": [
    "Tingling at night eased by shaking the hand",
    "Symptoms worse after long sewing sessions"
   ]
  },
  "root": {
   "name": "Raised pressure on the median nerve in the carpal tunnel",
   "tool": "splint",
   "mimics": [
    "C6-C7 cervical radiculopathy",
    "Peripheral neuropathy"
   ]
  },
  "enemies": [
   {
    "kind": "night",
    "name": "Night pain",
    "shape": "moon",
    "tool": "splint"
   },
   {
    "kind": "tingle",
    "name": "Tingling",
    "shape": "zap",
    "tool": "glide"
   },
   {
    "kind": "habit",
    "name": "Overuse habit",
    "shape": "gear",
    "tool": "edu"
   }
  ],
  "tools": [
   "splint",
   "glide",
   "edu"
  ],
  "decoy": {
   "name": "Splint the wrist in flexion",
   "why": "Wrist flexion raises carpal tunnel pressure; the splint must hold the wrist in neutral."
  },
  "management": [
   "Night splint with the wrist in neutral.",
   "Median nerve and tendon gliding exercises.",
   "Ergonomic advice: neutral wrist, breaks from repetitive gripping and vibration.",
   "After release surgery: early finger movement, scar care, gradual grip strengthening."
  ],
  "flags": [
   "Rapid weakness or thenar wasting (urgent surgical referral)",
   "Symptoms in both hands and feet (peripheral neuropathy or cervical myelopathy)",
   "Neck pain with dermatomal pattern (C6-C7 radiculopathy)"
  ],
  "refs": [
   "Orthopedic Physical Assessment (Forearm, wrist and hand)",
   "Cash's Textbook of Orthopaedics and Rheumatology for Physiotherapists (Peripheral nerve lesions)",
   "The Sensitive Nervous System (Neurodynamics of the upper limb)"
  ],
  "source": "learn-anywhere:carpal-tunnel"
 },
 {
  "id": "subacromial-pain",
  "title": "Rotator cuff related shoulder pain (subacromial pain / impingement)",
  "district": "Shoulder Port",
  "x": 0.7,
  "y": 0.25,
  "region": "Shoulder",
  "patient": {
   "name": "Arun",
   "age": 38,
   "job": "painter",
   "says": "Lifting my arm halfway up hurts, and I cannot sleep on that side."
  },
  "simple": "The rotator cuff tendons, mostly supraspinatus, become painful and less tolerant of load, often after overuse or a sudden increase in overhead work. Lifting the arm hurts in the middle of the range. Graded loading exercise is the main treatment.",
  "flow": [
   "Overload, age-related tendon change, poor scapular control",
   "Rotator cuff tendinopathy with or without bursitis",
   "Painful arc (about 60-120 degrees), pain lifting and lying on the side",
   "Clinical cluster of tests; exclude full-thickness tear and stiffness",
   "Education and activity modification",
   "Progressive cuff and scapular loading for 12 weeks"
  ],
  "tests": {
   "right": [
    "Painful arc",
    "Hawkins-Kennedy test"
   ],
   "wrong": [
    "Lachman test",
    "Slump test"
   ]
  },
  "flag": {
   "right": "Sudden weakness after trauma, cannot lift arm (full-thickness tear: urgent referral)",
   "others": [
    "Pain in the middle of lifting the arm",
    "Pain lying on that side at night"
   ]
  },
  "root": {
   "name": "Overloaded, load-intolerant rotator cuff tendon",
   "tool": "load",
   "mimics": [
    "Frozen shoulder",
    "Cervical radiculopathy"
   ]
  },
  "enemies": [
   {
    "kind": "pain",
    "name": "Pain",
    "shape": "spike",
    "tool": "edu"
   },
   {
    "kind": "weak",
    "name": "Weakness",
    "shape": "ghost",
    "tool": "load"
   },
   {
    "kind": "habit",
    "name": "Overuse habit",
    "shape": "gear",
    "tool": "scap"
   }
  ],
  "tools": [
   "edu",
   "load",
   "scap"
  ],
  "decoy": {
   "name": "Complete rest from all arm use",
   "why": "Avoid complete rest: the cuff tendon needs progressive loading over about 12 weeks."
  },
  "management": [
   "Education: load the tendon, avoid complete rest, modify provocative overhead work.",
   "Isometrics or low-load exercise for pain relief early.",
   "Progressive resistance: ER and abduction with band, then weights, 3 sets of 8-15, 3 times a week.",
   "Scapular control (serratus anterior, lower trapezius), thoracic mobility, posterior capsule stretch.",
   "Return to overhead and sport-specific tasks; injection only as an adjunct when pain blocks exercise."
  ],
  "flags": [
   "Sudden weakness after trauma, cannot lift arm (full-thickness tear: urgent referral)",
   "Fever, hot joint (infection)",
   "Unexplained mass, weight loss, night pain unrelated to position"
  ],
  "refs": [
   "Orthopedic Physical Assessment (Shoulder)",
   "Brukner & Khan's Clinical Sports Medicine (Shoulder pain)",
   "Therapeutic Exercise: Foundations and Techniques (The shoulder and shoulder girdle)",
   "Beard DJ, et al. Arthroscopic subacromial decompression for subacromial shoulder pain (CSAW). Lancet. 2018;391:329-338."
  ],
  "source": "learn-anywhere:subacromial-pain"
 },
 {
  "id": "frozen-shoulder",
  "title": "Frozen shoulder (adhesive capsulitis)",
  "district": "Capsule Fort",
  "x": 0.3,
  "y": 0.25,
  "region": "Shoulder",
  "patient": {
   "name": "Lakshmi",
   "age": 53,
   "job": "teacher",
   "says": "My shoulder is so stiff I cannot reach behind my back or comb my hair."
  },
  "simple": "The shoulder capsule first becomes inflamed, then thick and tight. The shoulder hurts and slowly loses movement in every direction, most of all turning outwards. It usually recovers over 1 to 3 years, and physiotherapy matched to how irritable the shoulder is speeds this up.",
  "flow": [
   "Synovial inflammation of the glenohumeral capsule",
   "Fibroblast proliferation and capsular contracture (rotator interval, coracohumeral ligament)",
   "Painful, global loss of active and passive ROM",
   "Capsular pattern: ER > ABD > IR",
   "Classify irritability: high, moderate or low",
   "Match treatment dose to irritability; add injection if pain blocks progress"
  ],
  "tests": {
   "right": [
    "Passive external rotation loss",
    "Capsular pattern (ER > ABD > IR)"
   ],
   "wrong": [
    "Painful arc only",
    "Empty can test"
   ]
  },
  "flag": {
   "right": "Trauma with sudden loss of movement (dislocation or fracture)",
   "others": [
    "Gradual stiffness over several months",
    "Reduced external rotation"
   ]
  },
  "root": {
   "name": "Contracted, thickened joint capsule",
   "tool": "mob",
   "mimics": [
    "Rotator cuff related shoulder pain",
    "Shoulder dislocation"
   ]
  },
  "enemies": [
   {
    "kind": "night",
    "name": "Night pain",
    "shape": "moon",
    "tool": "edu"
   },
   {
    "kind": "stiff",
    "name": "Stiffness",
    "shape": "block",
    "tool": "mob"
   },
   {
    "kind": "weak",
    "name": "Weakness",
    "shape": "ghost",
    "tool": "load"
   }
  ],
  "tools": [
   "edu",
   "mob",
   "load"
  ],
  "decoy": {
   "name": "Immobilise in a sling",
   "why": "Immobilising the shoulder worsens stiffness; dose movement to the irritability level."
  },
  "management": [
   "High irritability: education, pain relief, gentle pain-free ROM, grade I-II mobilisation, pendular exercise.",
   "Moderate to low irritability: end-range stretching, grade III-IV mobilisation, posterior and inferior glides, mobilisation with movement.",
   "Scapular control and rotator cuff strengthening as ROM returns.",
   "Home programme: wand, towel, sleeper and cross-body stretches.",
   "Combine with intra-articular corticosteroid when pain limits therapy."
  ],
  "flags": [
   "Trauma with sudden loss of movement (dislocation or fracture)",
   "Night pain, weight loss, history of cancer",
   "Fever or a hot swollen joint (septic arthritis)"
  ],
  "refs": [
   "Kelley MJ, Shaffer MA, Kuhn JE, et al. Shoulder pain and mobility deficits: adhesive capsulitis. Clinical practice guidelines. J Orthop Sports Phys Ther. 2013;43(5):A1-A31.",
   "Rangan A, et al. Management of adults with primary frozen shoulder in secondary care (UK FROST): a multicentre, pragmatic, three-arm, superiority randomised clinical trial. Lancet. 2020;396:977-989.",
   "Physiopedia: Adhesive Capsulitis."
  ],
  "source": "learn-anywhere:frozen-shoulder"
 },
 {
  "id": "cervical-radiculopathy",
  "title": "Cervical spondylosis and cervical radiculopathy",
  "district": "Neck Heights",
  "x": 0.5,
  "y": 0.14,
  "region": "Spine",
  "patient": {
   "name": "Imran",
   "age": 46,
   "job": "software engineer",
   "says": "Pain runs from my neck into my arm, and my thumb tingles."
  },
  "simple": "With age, the discs and joints of the neck wear and can narrow the openings where nerves leave. A pressed nerve root causes arm pain, tingling and sometimes weakness along its path. Most cases settle with time, exercise and posture advice.",
  "flow": [
   "Disc degeneration, osteophytes, foraminal narrowing",
   "Nerve root compression and inflammation",
   "Arm pain beyond the elbow, dermatomal paraesthesia",
   "Spurling, ULTT, distraction; myotomes and reflexes",
   "Screen for myelopathy and red flags",
   "Education, neural mobilisation, traction, deep neck flexor training"
  ],
  "tests": {
   "right": [
    "Spurling test",
    "Upper limb tension test"
   ],
   "wrong": [
    "Phalen test",
    "Lachman test"
   ]
  },
  "flag": {
   "right": "Clumsy hands, unsteady gait, Hoffmann sign (myelopathy: refer)",
   "others": [
    "Arm pain beyond the elbow",
    "Tingling in the thumb"
   ]
  },
  "root": {
   "name": "Narrowed foramen compressing the C6 nerve root",
   "tool": "glide",
   "mimics": [
    "Carpal tunnel syndrome",
    "Rotator cuff related shoulder pain"
   ]
  },
  "enemies": [
   {
    "kind": "tingle",
    "name": "Tingling",
    "shape": "zap",
    "tool": "glide"
   },
   {
    "kind": "pain",
    "name": "Pain",
    "shape": "spike",
    "tool": "dnf"
   },
   {
    "kind": "stiff",
    "name": "Stiffness",
    "shape": "block",
    "tool": "mob"
   }
  ],
  "tools": [
   "glide",
   "dnf",
   "mob"
  ],
  "decoy": {
   "name": "Soft collar for weeks",
   "why": "Prolonged collar use weakens neck muscles; keep moving with neural mobilisation and deep neck flexor training."
  },
  "management": [
   "Education and reassurance; most improve within months.",
   "Deep neck flexor training (craniocervical flexion), scapular strengthening.",
   "Neural mobilisation (sliders before tensioners), cervical and thoracic mobilisation.",
   "Intermittent mechanical traction may help selected patients; postural and workstation advice."
  ],
  "flags": [
   "Clumsy hands, unsteady gait, Hoffmann sign (myelopathy: refer)",
   "Progressive weakness",
   "Fever, weight loss, history of cancer",
   "Drop attacks or dizziness on neck movement (vascular)"
  ],
  "refs": [
   "Orthopedic Physical Assessment (Cervical spine)",
   "Maitland's Vertebral Manipulation (Cervical spine)",
   "The Sensitive Nervous System (Upper limb neurodynamic tests)",
   "Blanpied PR, et al. Neck pain: revision 2017. J Orthop Sports Phys Ther. 2017;47(7):A1-A83."
  ],
  "source": "learn-anywhere:cervical-radiculopathy"
 },
 {
  "id": "lbp",
  "title": "Non-specific low back pain",
  "district": "Lumbar Downtown",
  "x": 0.42,
  "y": 0.5,
  "region": "Spine",
  "patient": {
   "name": "Suresh",
   "age": 35,
   "job": "delivery rider",
   "says": "My lower back has hurt for weeks. I am scared bending will damage it."
  },
  "simple": "Most back pain has no single serious cause. The pain is real and comes from the tissues and nervous system of the back, and it usually gets better. Staying active, exercise and confidence help more than rest or machines.",
  "flow": [
   "Patient with low back pain",
   "Screen red flags (serious pathology)",
   "Check for radicular signs (sciatica)",
   "Stratify risk with STarT Back; note yellow flags",
   "Advice to stay active and reassurance",
   "Exercise, plus manual therapy or psychologically informed care as needed"
  ],
  "tests": {
   "right": [
    "Red flag screen negative",
    "STarT Back risk score"
   ],
   "wrong": [
    "Lachman test",
    "Phalen test"
   ]
  },
  "flag": {
   "right": "Saddle anaesthesia, bladder or bowel change (cauda equina: emergency)",
   "others": [
    "Back pain worse after long rides",
    "Worry that bending will cause damage"
   ]
  },
  "root": {
   "name": "Fear-avoidance and deconditioning cycle",
   "tool": "edu",
   "mimics": [
    "Lumbar disc prolapse with sciatica",
    "Ankylosing spondylitis"
   ]
  },
  "enemies": [
   {
    "kind": "fear",
    "name": "Fear of movement",
    "shape": "eye",
    "tool": "edu"
   },
   {
    "kind": "pain",
    "name": "Pain",
    "shape": "spike",
    "tool": "active"
   },
   {
    "kind": "stiff",
    "name": "Stiffness",
    "shape": "block",
    "tool": "mob"
   }
  ],
  "tools": [
   "edu",
   "active",
   "mob"
  ],
  "decoy": {
   "name": "Traction, ultrasound and a back belt",
   "why": "NICE advises against traction, ultrasound, TENS and belts for low back pain."
  },
  "management": [
   "Reassurance, education and advice to stay active.",
   "Exercise therapy: motor control, general strengthening, McKenzie, walking, yoga or Pilates.",
   "Manual therapy only with exercise.",
   "Cognitive functional therapy or combined physical and psychological programmes for high-risk patients.",
   "Return-to-work planning; NICE advises against traction, ultrasound, TENS, interferential, belts and orthotics."
  ],
  "flags": [
   "Saddle anaesthesia, bladder or bowel change (cauda equina: emergency)",
   "History of cancer, weight loss",
   "Fever, IV drug use (infection)",
   "Major trauma or osteoporosis (fracture)"
  ],
  "refs": [
   "NICE guideline NG59. Low back pain and sciatica in over 16s: assessment and management. 2016, updated 2020.",
   "George SZ, et al. Interventions for the management of acute and chronic low back pain: revision 2021. J Orthop Sports Phys Ther. 2021;51(11):CPG1-CPG60.",
   "Kent P, et al. Cognitive functional therapy with or without movement sensor biofeedback versus usual care for chronic, disabling low back pain (RESTORE). Lancet. 2023;401:1866-1877.",
   "Physiopedia: Low Back Pain."
  ],
  "source": "learn-anywhere:lbp"
 },
 {
  "id": "lumbar-disc",
  "title": "Lumbar disc prolapse with radiculopathy (sciatica)",
  "district": "Disc Avenue",
  "x": 0.58,
  "y": 0.5,
  "region": "Spine",
  "patient": {
   "name": "Neha",
   "age": 32,
   "job": "accountant",
   "says": "Sharp pain shoots down the back of my leg below the knee. Sitting makes it worse."
  },
  "simple": "The soft centre of a lumbar disc pushes out and irritates a nerve root, causing leg pain that is often worse than the back pain. Most disc herniations shrink and improve within weeks to months. Staying active and graded exercise help recovery.",
  "flow": [
   "Annular tear with nucleus herniation (L4-5 or L5-S1)",
   "Mechanical and chemical irritation of the root",
   "Leg pain below the knee, dermatomal numbness",
   "SLR, slump, myotomes, reflexes",
   "Screen for cauda equina",
   "Stay active, directional preference exercise, neural mobilisation"
  ],
  "tests": {
   "right": [
    "Straight leg raise",
    "Slump test"
   ],
   "wrong": [
    "Cozen test",
    "Windlass test"
   ]
  },
  "flag": {
   "right": "Saddle anaesthesia, urinary retention or incontinence (cauda equina: emergency)",
   "others": [
    "Leg pain worse with sitting",
    "Numbness on the top of the foot"
   ]
  },
  "root": {
   "name": "Herniated disc irritating the L5 nerve root",
   "tool": "dpe",
   "mimics": [
    "Non-specific low back pain",
    "Hamstring strain"
   ]
  },
  "enemies": [
   {
    "kind": "pain",
    "name": "Pain",
    "shape": "spike",
    "tool": "dpe"
   },
   {
    "kind": "tingle",
    "name": "Tingling",
    "shape": "zap",
    "tool": "glide"
   },
   {
    "kind": "weak",
    "name": "Weakness",
    "shape": "ghost",
    "tool": "active"
   }
  ],
  "tools": [
   "dpe",
   "glide",
   "active"
  ],
  "decoy": {
   "name": "Strict bed rest",
   "why": "Avoid bed rest: staying active and directional preference exercise help most patients."
  },
  "management": [
   "Reassurance and advice to stay active; avoid bed rest.",
   "Directional preference exercise (often repeated extension, McKenzie) if centralisation occurs.",
   "Neural mobilisation, core and general strengthening, walking programme.",
   "Return to work planning; refer for injection or surgery if severe persistent pain or progressive deficit."
  ],
  "flags": [
   "Saddle anaesthesia, urinary retention or incontinence (cauda equina: emergency)",
   "Progressive foot drop",
   "Fever, weight loss, history of cancer"
  ],
  "refs": [
   "Orthopedic Physical Assessment (Lumbar spine)",
   "Maitland's Vertebral Manipulation (Lumbar spine)",
   "The Sensitive Nervous System (Lower limb neurodynamics)",
   "NICE guideline NG59. Low back pain and sciatica in over 16s. 2016, updated 2020.",
   "Peul WC, et al. Surgery versus prolonged conservative treatment for sciatica. N Engl J Med. 2007;356:2245-2256."
  ],
  "source": "learn-anywhere:lumbar-disc"
 },
 {
  "id": "knee-oa",
  "title": "Knee osteoarthritis",
  "district": "Knee Junction",
  "x": 0.42,
  "y": 0.7,
  "region": "Knee",
  "patient": {
   "name": "Kamala",
   "age": 62,
   "job": "retired nurse",
   "says": "My knee aches after walking, and it is stiff for a few minutes in the morning."
  },
  "simple": "Knee osteoarthritis is a slow change in the whole joint: cartilage, bone, lining and muscles. The knee becomes painful and stiff and walking or stairs get harder. Education, exercise and weight loss help every patient, at every stage.",
  "flow": [
   "Risk factors: age, obesity, previous injury, malalignment, female sex",
   "Whole-joint change: cartilage loss, osteophytes, subchondral sclerosis, synovitis",
   "Quadriceps inhibition and weakness",
   "Activity-related pain, short morning stiffness, crepitus",
   "Clinical diagnosis; X-ray graded by Kellgren-Lawrence if needed",
   "Core care: education, exercise, weight management; then adjuncts or surgery"
  ],
  "tests": {
   "right": [
    "Activity-related pain, short morning stiffness",
    "Crepitus and bony enlargement"
   ],
   "wrong": [
    "Positive Lachman test",
    "Painful arc"
   ]
  },
  "flag": {
   "right": "Hot, swollen, very painful joint with fever (infection)",
   "others": [
    "Pain after walking",
    "Morning stiffness under 30 minutes"
   ]
  },
  "root": {
   "name": "Joint overload with weak quadriceps",
   "tool": "load",
   "mimics": [
    "Meniscus tear",
    "Septic arthritis"
   ]
  },
  "enemies": [
   {
    "kind": "pain",
    "name": "Pain",
    "shape": "spike",
    "tool": "edu"
   },
   {
    "kind": "weak",
    "name": "Weakness",
    "shape": "ghost",
    "tool": "load"
   },
   {
    "kind": "load",
    "name": "Overload",
    "shape": "weight",
    "tool": "active"
   }
  ],
  "tools": [
   "edu",
   "load",
   "active"
  ],
  "decoy": {
   "name": "Stop all activity",
   "why": "Rest makes the quadriceps weaker; strengthening and aerobic exercise are core treatment."
  },
  "management": [
   "Education and self-management.",
   "Strengthening: quadriceps (SLR, sit-to-stand, mini squats), hip abductors.",
   "Aerobic and mind-body exercise: walking, cycling, aquatic exercise, tai chi, yoga.",
   "Weight loss if overweight; walking stick in the opposite hand; footwear advice.",
   "Adjuncts for short-term relief: heat or ice, TENS, manual therapy alongside exercise."
  ],
  "flags": [
   "Hot, swollen, very painful joint with fever (infection)",
   "Locking or giving way after injury (mechanical tear)",
   "Night pain and weight loss (tumour)"
  ],
  "refs": [
   "Bannuru RR, et al. OARSI guidelines for the non-surgical management of knee, hip, and polyarticular osteoarthritis. Osteoarthritis Cartilage. 2019;27(11):1578-1589.",
   "NICE guideline NG226. Osteoarthritis in over 16s: diagnosis and management. 2022.",
   "Skou ST, et al. A randomized, controlled trial of total knee replacement. N Engl J Med. 2015;373:1597-1606.",
   "Physiopedia: Knee Osteoarthritis."
  ],
  "source": "learn-anywhere:knee-oa"
 },
 {
  "id": "ankle-sprain",
  "title": "Lateral ankle sprain",
  "district": "Ankle Ferry",
  "x": 0.58,
  "y": 0.86,
  "region": "Ankle",
  "patient": {
   "name": "Kiran",
   "age": 24,
   "job": "footballer",
   "says": "I rolled my ankle landing on another player. It swelled up straight away."
  },
  "simple": "Rolling the foot inwards stretches or tears the ligaments on the outside of the ankle, usually the ATFL. It swells and hurts to walk. Early weight bearing, exercise and balance training speed recovery and prevent repeat sprains.",
  "flow": [
   "Inversion with plantarflexion",
   "ATFL tear, then CFL; PTFL rarely",
   "Pain, swelling, bruising laterally",
   "Ottawa rules decide if X-ray is needed; grade I-III",
   "Protect, optimise load, ice, compression early",
   "Range, strength, balance and sport-specific training"
  ],
  "tests": {
   "right": [
    "Ottawa ankle rules",
    "Anterior drawer test"
   ],
   "wrong": [
    "Straight leg raise",
    "Spurling test"
   ]
  },
  "flag": {
   "right": "Bone tenderness at malleolus posterior edge or cannot bear weight (Ottawa: X-ray)",
   "others": [
    "Swelling on the outer ankle",
    "Bruising after an inversion injury"
   ]
  },
  "root": {
   "name": "Torn ATFL with lost balance control",
   "tool": "balance",
   "mimics": [
    "Syndesmosis (high ankle) sprain",
    "Ankle fracture"
   ]
  },
  "enemies": [
   {
    "kind": "swell",
    "name": "Swelling",
    "shape": "blob",
    "tool": "ice"
   },
   {
    "kind": "stiff",
    "name": "Stiffness",
    "shape": "block",
    "tool": "mob"
   },
   {
    "kind": "unstable",
    "name": "Instability",
    "shape": "wobble",
    "tool": "balance"
   }
  ],
  "tools": [
   "ice",
   "mob",
   "balance"
  ],
  "decoy": {
   "name": "Immobilise in a cast for weeks",
   "why": "Early protected weight bearing and functional rehab beat prolonged immobilisation."
  },
  "management": [
   "Acute: PEACE then LOVE approach, early protected weight bearing, compression, elevation.",
   "Semi-rigid brace for grade II-III.",
   "ROM, peroneal and calf strengthening, single-leg balance and wobble board.",
   "Agility, hopping and sport drills before return; prevention programme (balance training)."
  ],
  "flags": [
   "Bone tenderness at malleolus posterior edge or cannot bear weight (Ottawa: X-ray)",
   "Pain above the ankle with squeeze test positive (syndesmosis injury)",
   "Numbness or cold foot"
  ],
  "refs": [
   "Brukner & Khan's Clinical Sports Medicine (Acute ankle injuries)",
   "Orthopedic Physical Assessment (Lower leg, ankle and foot)",
   "Therapeutic Exercise for Musculoskeletal Injuries (Ankle and foot)",
   "Vuurberg G, et al. Diagnosis, treatment and prevention of ankle sprains: update of an evidence-based clinical guideline. Br J Sports Med. 2018;52:956."
  ],
  "source": "learn-anywhere:ankle-sprain"
 },
 {
  "id": "plantar-heel-pain",
  "title": "Plantar heel pain (plantar fasciopathy)",
  "district": "Heel Harbour",
  "x": 0.42,
  "y": 0.92,
  "region": "Foot",
  "patient": {
   "name": "Deepa",
   "age": 45,
   "job": "shop owner",
   "says": "My heel stabs with the first steps every morning, then eases a little."
  },
  "simple": "The thick band under the foot becomes painful where it attaches to the heel. The first steps in the morning hurt the most. Stretching, strengthening, footwear changes and time usually fix it.",
  "flow": [
   "Overload: weight gain, prolonged standing, tight calf, change in activity",
   "Degenerative change at the plantar fascia origin",
   "First-step pain in the morning, medial heel tenderness",
   "Windlass test; rule out nerve and stress fracture",
   "Education, calf and plantar fascia stretch, taping, insoles",
   "High-load strengthening (heel raises), weight and footwear advice"
  ],
  "tests": {
   "right": [
    "Windlass test",
    "Medial calcaneal tubercle tenderness"
   ],
   "wrong": [
    "Tinel sign at the wrist",
    "Mill test"
   ]
  },
  "flag": {
   "right": "Night pain, swelling, or pain after a jump (calcaneal stress fracture)",
   "others": [
    "Pain with the first steps in the morning",
    "Tenderness on the inner heel"
   ]
  },
  "root": {
   "name": "Overloaded plantar fascia origin",
   "tool": "load",
   "mimics": [
    "Calcaneal stress fracture",
    "Tarsal tunnel syndrome"
   ]
  },
  "enemies": [
   {
    "kind": "pain",
    "name": "Pain",
    "shape": "spike",
    "tool": "tape"
   },
   {
    "kind": "tight",
    "name": "Tight calf",
    "shape": "knot",
    "tool": "stretch"
   },
   {
    "kind": "load",
    "name": "Overload",
    "shape": "weight",
    "tool": "active"
   }
  ],
  "tools": [
   "tape",
   "stretch",
   "active",
   "load"
  ],
  "decoy": {
   "name": "Complete rest for weeks",
   "why": "Rest alone does not rebuild tolerance; high-load heel-raise strengthening does."
  },
  "management": [
   "Plantar fascia-specific stretch and calf stretching.",
   "Low-dye taping and prefabricated insoles for short-term relief.",
   "High-load strength training: single-leg heel raises with a towel under the toes.",
   "Weight management, supportive footwear; extracorporeal shockwave for persistent cases."
  ],
  "flags": [
   "Night pain, swelling, or pain after a jump (calcaneal stress fracture)",
   "Burning and numbness in the sole (tarsal tunnel)",
   "Both heels with back stiffness (spondyloarthritis)"
  ],
  "refs": [
   "Brukner & Khan's Clinical Sports Medicine (Heel pain)",
   "Orthopedic Physical Assessment (Lower leg, ankle and foot)",
   "Koc TA Jr, et al. Heel pain - plantar fasciitis: revision 2023. J Orthop Sports Phys Ther. 2023;53(12):CPG1-CPG39."
  ],
  "source": "learn-anywhere:plantar-heel-pain"
 }
];
