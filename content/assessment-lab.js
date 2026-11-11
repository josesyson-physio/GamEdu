/* Assessment Lab content.
   STATUS: PLACEHOLDER. Replace each challenge with the reviewed question supplied by the clinical panel,
   set reviewed:true, reviewer and reference, and change LAB_CONTENT.status to 'reviewed'.
   Fields per challenge: skill, title, story, question, options[4], correct (0-3), explanation, reference, reviewer, reviewed */
'use strict';
window.LAB_CONTENT = {
  status: 'placeholder',
  mission: {
    title: 'Mission 1: The first assessment',
    brief: 'A new patient is waiting at the Assessment Lab. Take the history, pick the right test and keep them safe.'
  },
  challenges: [
    {skill:'Patient history', title:'Ask the right question', reviewed:false, reviewer:'', reference:'',
     story:'Challenge slot 1 · Awaiting clinical content from the review panel.',
     question:'Placeholder: the reviewed patient-history question will appear here. To test the flow, choose the option marked “correct in demo”.',
     options:['Option A (correct in demo)','Option B','Option C','Option D'], correct:0,
     explanation:'Placeholder explanation. The reviewed question will explain why the right follow-up question matters.'},
    {skill:'Special tests', title:'Choose the test', reviewed:false, reviewer:'', reference:'',
     story:'Challenge slot 2 · Awaiting clinical content from the review panel.',
     question:'Placeholder: the reviewed special-test question will appear here. To test the flow, choose the option marked “correct in demo”.',
     options:['Option A','Option B (correct in demo)','Option C','Option D'], correct:1,
     explanation:'Placeholder explanation. The reviewed question will describe the test and what a positive result looks like.'},
    {skill:'Red-flag recognition', title:'Spot the red flag', reviewed:false, reviewer:'', reference:'',
     story:'Challenge slot 3 · Awaiting clinical content from the review panel.',
     question:'Placeholder: the reviewed red-flag question will appear here. To test the flow, choose the option marked “correct in demo”.',
     options:['Option A','Option B','Option C (correct in demo)','Option D'], correct:2,
     explanation:'Placeholder explanation. The reviewed question will explain the warning sign and the right action.'}
  ],
  /* Practical task (a "shows how" skill): measure elbow flexion with a virtual goniometer.
     Landmarks follow the standard textbook method; marked as demo content pending clinical review. */
  practical: {skill:'Range of motion', title:'Measure it: elbow flexion', reviewed:false, reviewer:'',
    reference:'Norkin & White, Measurement of Joint Motion: A Guide to Goniometry',
    steps:['Centre the goniometer axis over the lateral epicondyle of the humerus.',
           'Keep the stationary arm along the humerus, pointing to the acromion.',
           'Rotate the moving arm to line up with the radius, pointing to the radial styloid.',
           'Read the angle. Within 5 degrees of the true angle passes.'],
    tolerance:5}
};
