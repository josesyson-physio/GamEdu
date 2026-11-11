/* Assessment Lab content.
   STATUS: DRAFT (written content awaiting clinical panel review). Replace each challenge with the reviewed question supplied by the clinical panel,
   set reviewed:true, reviewer and reference, and change LAB_CONTENT.status to 'reviewed'.
   Fields per challenge: skill, title, story, question, options[4], correct (0-3), explanation, reference, reviewer, reviewed */
'use strict';
window.LAB_CONTENT = {
  status: 'draft',   // 'placeholder' | 'draft' (written, awaiting panel review) | 'reviewed'
  mission: {
    title: 'Mission 1: The first assessment',
    brief: 'A young footballer limps into the Assessment Lab after a knee injury, and a second patient is waiting with back pain. Take the history, choose the right test and keep everyone safe.'
  },
  challenges: [
    {skill:'Patient history', title:'Ask the right question', reviewed:false, reviewer:'',
     reference:"Brukner & Khan's Clinical Sports Medicine (knee injuries chapter)",
     story:'Arjun, 22, footballer: “I landed from a header, my knee twisted and gave way. I had to come off.” The injury happened yesterday.',
     question:'Which follow-up question gives you the most useful information right now?',
     options:['“Did you hear or feel a pop, and did the knee swell within the first few hours?”',
              '“Does anyone in your family have arthritis in their knees?”',
              '“What kind of football boots do you usually play in?”',
              '“Has your weight changed in the last six months?”'],
     correct:0,
     explanation:'A pop with rapid swelling (within about 2 hours) suggests bleeding into the joint, which commonly follows an ACL rupture, so this one question sharpens your whole assessment. Family history, footwear and weight can matter for long-term knee problems, but they do not help you assess an acute twisting injury.'},
    {skill:'Special tests', title:'Choose the test', reviewed:false, reviewer:'',
     reference:'Magee & Manske, Orthopedic Physical Assessment (knee chapter)',
     story:'Arjun’s history points to an anterior cruciate ligament (ACL) injury. The knee is swollen but he can lie relaxed on the couch.',
     question:'Which test is most useful, and what does a positive result look like?',
     options:['Lachman test: more forward glide of the tibia than the other knee, with a soft or absent end-feel',
              'McMurray test: a painful click when the knee is rotated and extended',
              'Valgus stress test at 30°: gapping and pain on the inner side of the knee',
              'Patellar apprehension test: the patient tenses up when the kneecap is pushed outward'],
     correct:0,
     explanation:'The Lachman test, done at about 20–30° of knee flexion, is the most sensitive clinical test for an ACL tear, and it is comfortable enough to use soon after injury. McMurray is mainly a meniscus test, so it is tempting because meniscus tears often come with ACL injuries, but it does not test the ACL. The valgus test checks the medial collateral ligament; apprehension checks patellar instability.'},
    {skill:'Red-flag recognition', title:'Spot the red flag', reviewed:false, reviewer:'',
     reference:'GIRFT National Suspected Cauda Equina Syndrome Pathway (NHS England, 2023)',
     story:'Meena, 52, has had low back pain with pain down both legs for a week. Today she mentions it has become hard to pass urine and the area between her legs feels numb.',
     question:'What is the right action?',
     options:['Stop and refer her to emergency care the same day for suspected cauda equina syndrome',
              'Continue with exercises and review her again next week',
              'Give a home exercise programme and ask her to monitor her symptoms',
              'Send a routine referral letter to her GP'],
     correct:0,
     explanation:'New bladder difficulty with saddle numbness, alongside back pain and leg pain on both sides, can mean the cauda equina nerves are compressed. This needs same-day emergency assessment and usually an urgent MRI, because delay can cause permanent bladder, bowel and sexual dysfunction. Continuing treatment, monitoring at home or a routine GP letter all delay care that cannot wait.'}
  ],
  practical: {skill:'Range of motion', title:'Measure it: elbow flexion', reviewed:false, reviewer:'',
    reference:'Norkin & White, Measurement of Joint Motion: A Guide to Goniometry',
    steps:['Centre the goniometer axis over the lateral epicondyle of the humerus.',
           'Keep the stationary arm along the humerus, pointing to the acromion.',
           'Rotate the moving arm to line up with the radius, pointing to the radial styloid.',
           'Read the angle. Within 5 degrees of the true angle passes.'],
    tolerance:5}
};
