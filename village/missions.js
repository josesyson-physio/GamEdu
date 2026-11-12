/* Village Lab missions. Each mission: a real village problem, the people it hurts, and how a junior scientist's design is judged.
   pts: 0-4 for each choice. why: what a field test shows. Costs are rough, for learning budgets only. */
'use strict';
window.VL_PARTS = {
  sense:{label:'SENSE', ask:'How does it find out what is happening?', items:{
    soil:{name:'Soil moisture sensor', cost:350}, cam:{name:'Phone camera', cost:0}, nightcam:{name:'Night camera trap', cost:2800}, water:{name:'Water quality sensor', cost:1200},
    lid:{name:'Pill-box lid switch', cost:150}, mic:{name:'Microphone (ask by voice)', cost:200}, keypad:{name:'Person types it in', cost:0}, sat:{name:'Satellite photos online', cost:0}, motion:{name:'Simple motion sensor', cost:250}}},
  think:{label:'THINK', ask:'What is the brain that decides?', items:{
    rule:{name:'Simple rule (if this, then alert)', cost:0}, edge:{name:'Small AI model on the device (offline)', cost:900}, cloud:{name:'Big AI in the cloud (needs internet)', cost:0}, human:{name:'Send it to an expert in the city', cost:0}}},
  tell:{label:'TELL', ask:'How does it talk to people?', items:{
    app:{name:'Smartphone app in English', cost:0}, sms:{name:'SMS text in Kannada', cost:0}, voice:{name:'Voice message in Kannada', cost:100}, light:{name:'Big light + buzzer on the device', cost:300},
    siren:{name:'Village loudspeaker alert', cost:1500}, screen:{name:'Pictures + Kannada voice on screen', cost:0}}},
  power:{label:'POWER', ask:'What keeps it running?', items:{
    grid:{name:'Plug into the house socket', cost:0}, aa:{name:'AA batteries', cost:200}, solar:{name:'Small solar panel + battery', cost:1200}, phone:{name:'The phone’s own battery', cost:0}}},
  connect:{label:'CONNECT', ask:'How does the message travel?', items:{
    data:{name:'Mobile internet', cost:200}, gsm:{name:'Basic network (SMS and calls)', cost:100}, lora:{name:'Long-range radio (LoRa)', cost:1000}, offline:{name:'Works offline, syncs later', cost:0}, local:{name:'Only on the device itself', cost:0}}}
};
window.VL_COMMON = {
  maintain:[{t:'Train two young people from the village to fix and look after it', pts:7, why:'Local people who can repair it keep it alive long after you leave.'},
    {t:'I will come back every month to fix it', pts:3, why:'Kind, but it stops working whenever you can’t come.'},
    {t:'Send it to a company in the city when it breaks', pts:1, why:'Weeks without it, every time something breaks.'}],
  feedback:[{t:'Test it with {name} for two weeks and change what doesn’t work', pts:7, why:'Real users find problems no lab ever will.'},
    {t:'Ask my teacher if it looks good', pts:3, why:'Teachers help, but the person who uses it every day knows best.'},
    {t:'It’s finished. Ship it to every village!', pts:0, why:'Every village is different. Untested ideas fail quietly.'}]
};
window.VL_MISSIONS = [
 {id:'farm', title:'Thirsty Fields', map:[.22,.62], who:{name:'Lakshmi', age:45, role:'ragi farmer', look:{skin:'#b97a52', hair:'#1d1416', top:'#2f9e5b', acc:'bindi'}},
  story:'Every summer my ragi field dries out, but some days I flood it and the water just runs away. The borewell pump works only when power comes. Last year I lost half my crop.',
  questions:[
   {q:'When does the field dry out the most?', good:true, a:'April and May. I can only tell by touching the soil in the morning.', note:'Checks the soil by hand once a day'},
   {q:'What kind of phone do you have?', good:true, a:'This one. Calls and SMS only.', note:'Basic phone: calls and SMS, no apps'},
   {q:'When is there electricity at the field?', good:true, a:'Power comes at night, maybe six hours. It cuts often.', note:'Field power only a few hours, often cut'},
   {q:'How much could you spend on a fix?', good:true, a:'Maybe ₹2,500, if it really saves water.', note:'Budget about ₹2,500', budget:true},
   {q:'Do you want an app for farming?', good:false, a:'App? My daughter knows those things. I just want my crop to live.'},
   {q:'Why don’t you just use more water?', good:false, a:'Water is not free, beta. The borewell goes deeper every year.'}],
  define:[
   {t:'Lakshmi can’t tell when her ragi field really needs water, so she waters too much or too late, wasting water and losing crop.', kind:'sharp'},
   {t:'Lakshmi needs a farming app.', kind:'surface'},
   {t:'India has a water crisis.', kind:'broad'}],
  budget:2500,
  slots:{
   sense:[{id:'soil', pts:4, why:'Measures how wet the soil is: exactly what Lakshmi needs to know.'}, {id:'sat', pts:1, why:'Needs internet and shows big areas, not her one small field.'}, {id:'keypad', pts:1, why:'She would have to type readings in. That adds work instead of saving it.'}, {id:'cam', pts:1, why:'A photo can’t see how wet the soil is underneath, and she has no smartphone.'}],
   think:[{id:'rule', pts:4, why:'“If the soil is dry, alert her.” Simple, cheap, easy to fix. AI isn’t needed here.'}, {id:'edge', pts:3, why:'Works offline and could learn weather patterns, but costs more than this job needs.'}, {id:'cloud', pts:1, why:'Needs internet at the field, and there isn’t any.'}, {id:'human', pts:1, why:'An expert in the city can’t answer every day in time.'}],
   tell:[{id:'voice', pts:4, why:'A Kannada voice message reaches her basic phone even while she works.'}, {id:'sms', pts:3, why:'Works on her basic phone, and she can read Kannada.'}, {id:'app', pts:0, why:'She has no smartphone, and the app is in English.'}, {id:'light', pts:2, why:'A light at the field only helps if she is standing there.'}],
   power:[{id:'solar', pts:4, why:'Sun all day at the field; the battery covers the night.'}, {id:'grid', pts:1, why:'Field power comes only a few hours and often cuts.'}, {id:'aa', pts:2, why:'Works, but needs new batteries every few weeks.'}, {id:'phone', pts:0, why:'A sensor in the field can’t run on her phone’s battery.'}],
   connect:[{id:'gsm', pts:4, why:'SMS and calls work on the basic network she already has.'}, {id:'data', pts:1, why:'No mobile internet out at the field.'}, {id:'lora', pts:2, why:'Works, but needs a receiver at home that then calls her. More cost.'}, {id:'local', pts:1, why:'Nothing reaches her unless she walks to the field.'}]},
  impact:[{t:'Lakshmi waters only when the soil is dry: less water wasted and a healthier ragi crop.', pts:6}, {t:'It will make farming better.', pts:2}, {t:'It will end drought for every farmer in India.', pts:0}],
  thanks:['I am not sure I can use this, beta. Can you come and see my field again?', 'It is a good start. If it keeps working when the power cuts, I will trust it.', 'Now my phone tells me when the field is thirsty. My daughter laughed that the soil can talk!'],
  real:'Soil moisture sensors linked to simple alerts are a real, low-cost idea used in farming.'},

 {id:'ajji', title:'Pill Panic', map:[.5,.5], who:{name:'Kamala Ajji', age:72, role:'lives alone', look:{skin:'#c08a63', hair:'#d9d4cc', top:'#8a3f9e', acc:'glasses'}},
  story:'I take tablets every morning and night. Some days I forget, some days I take them twice by mistake. My son calls from Bengaluru every night to check, and I feel like a burden.',
  questions:[
   {q:'Can you read the medicine strips?', good:true, a:'No, kanda. I never went to school. I know them by colour.', note:'Can’t read; knows tablets by colour'},
   {q:'What happens on the days you forget?', good:true, a:'I feel dizzy. Once I fell in the kitchen.', note:'Missed doses make her unwell'},
   {q:'Is there power at home?', good:true, a:'Yes, mostly. Sometimes it goes for an hour.', note:'Power mostly there, short cuts'},
   {q:'Who do you talk to every day?', good:true, a:'My son on the phone, and Divya, the girl next door.', note:'Son and neighbour could be alerted'},
   {q:'Why not set an alarm on a smartphone?', good:false, a:'I have this old phone. I only know the green and red buttons.'},
   {q:'Do you trust technology?', good:false, a:'What is that? I trust my son.'}],
  define:[
   {t:'Kamala Ajji can’t read and lives alone, so she forgets or doubles her doses, and her son worries every night.', kind:'sharp'},
   {t:'Ajji needs a smartphone.', kind:'surface'},
   {t:'Old people are bad with medicines.', kind:'broad'}],
  budget:1500,
  slots:{
   sense:[{id:'lid', pts:4, why:'Knows if the morning or night box was opened. No reading needed.'}, {id:'mic', pts:2, why:'She could say “I took it”, but may forget to say it.'}, {id:'keypad', pts:0, why:'She can’t read or type.'}, {id:'cam', pts:1, why:'A camera watching her at home feels intrusive, and needs a smartphone.'}],
   think:[{id:'rule', pts:4, why:'“If the box isn’t opened by 9 am, remind her.” Simple and reliable.'}, {id:'edge', pts:2, why:'Works, but there is nothing to learn here. A clock rule does the job.'}, {id:'cloud', pts:1, why:'Needs internet she doesn’t have, for a job a clock can do.'}, {id:'human', pts:2, why:'Her son could check, but that is the worry we want to ease.'}],
   tell:[{id:'voice', pts:4, why:'A voice in Kannada, even her son’s recorded voice: “Amma, time for your tablet.”'}, {id:'light', pts:3, why:'A light and soft sound on the right box helps her pick the right one.'}, {id:'sms', pts:1, why:'She can’t read SMS. (An SMS to her son if she misses one would work.)'}, {id:'app', pts:0, why:'No smartphone, and English text.'}],
   power:[{id:'grid', pts:3, why:'Power is mostly there. A small backup battery covers cuts.'}, {id:'aa', pts:3, why:'A few batteries last weeks in a small box.'}, {id:'solar', pts:2, why:'Works, but a lot of kit for a box indoors.'}, {id:'phone', pts:0, why:'The box can’t use her phone’s battery.'}],
   connect:[{id:'gsm', pts:4, why:'Sends an SMS to her son and Divya if a dose is missed.'}, {id:'local', pts:3, why:'Reminds her at home, but her son still won’t know.'}, {id:'data', pts:1, why:'No internet at home.'}, {id:'lora', pts:1, why:'Too much: her son is in Bengaluru, not in the village.'}]},
  impact:[{t:'Ajji takes the right tablet at the right time, and her son can stop worrying every night.', pts:6}, {t:'Old people will be healthier.', pts:2}, {t:'No one will ever need a doctor again.', pts:0}],
  thanks:['I could not understand what it wanted from me, kanda.', 'It reminds me, good. Can it be louder? My ears are not so sharp now.', 'The box speaks in my son’s voice! Now he calls me just to talk, not to check on me.'],
  real:'Simple reminder boxes with lights and recorded voices are a well-known, low-cost idea.'},

 {id:'leaf', title:'Leaf Spot Mystery', map:[.78,.66], who:{name:'Raju', age:38, role:'tomato farmer', look:{skin:'#a8693f', hair:'#1d1416', top:'#e07a3a', acc:'towel'}},
  story:'Brown spots came on my tomato leaves. The agriculture officer comes once a month; by then half the plants are gone. The shop sells me whatever spray they have.',
  questions:[
   {q:'How do you know which disease it is?', good:true, a:'I don’t. I show the leaf at the shop and they sell me a spray.', note:'Guessing sprays; no expert nearby'},
   {q:'What phone does your family have?', good:true, a:'My daughter Pooja has a smartphone. She helps me.', note:'Family smartphone (Pooja)'},
   {q:'Is there internet at the farm?', good:true, a:'Only near the bus stand. In the field, nothing.', note:'No internet in the field'},
   {q:'How often does the officer come?', good:true, a:'Once a month, if we are lucky.', note:'Expert visits monthly'},
   {q:'Why don’t you just spray more?', good:false, a:'I already spend too much on sprays. Some make my hands burn.'},
   {q:'Do you know about machine learning?', good:false, a:'Machine? I rent a tractor sometimes.'}],
  define:[
   {t:'Raju can’t tell which disease is on his tomato leaves, so he wastes money on wrong sprays while it spreads.', kind:'sharp'},
   {t:'Raju needs better sprays.', kind:'surface'},
   {t:'Farming in India needs modernising.', kind:'broad'}],
  budget:3000,
  slots:{
   sense:[{id:'cam', pts:4, why:'A photo of the leaf is exactly what’s needed, and Pooja’s phone has a camera.'}, {id:'keypad', pts:1, why:'Typing symptoms is slow and hard to describe.'}, {id:'sat', pts:1, why:'Satellite photos can’t see spots on one leaf, and need internet.'}, {id:'soil', pts:1, why:'The soil isn’t the problem here; the leaves are.'}],
   think:[{id:'edge', pts:4, why:'This is where AI shines: a small model trained on many local tomato-leaf photos can spot the disease right on the phone, no internet.'}, {id:'cloud', pts:2, why:'Accurate, but works only near the bus stand, not in the field.'}, {id:'rule', pts:1, why:'A simple rule can’t recognise a disease from a photo.'}, {id:'human', pts:2, why:'Photos to an expert work, but wait for internet and a reply.'}],
   tell:[{id:'screen', pts:4, why:'Shows the result with pictures and Kannada voice, what to do, and when to call the officer.'}, {id:'sms', pts:2, why:'A text works, but pictures explain a leaf disease better.'}, {id:'app', pts:2, why:'Pooja reads English; Raju doesn’t. Kannada and voice work for both.'}, {id:'siren', pts:0, why:'A loudspeaker doesn’t fit a leaf problem.'}],
   power:[{id:'phone', pts:4, why:'Runs on Pooja’s phone. Nothing extra to buy.'}, {id:'solar', pts:2, why:'Not needed when the phone does the work.'}, {id:'grid', pts:2, why:'Only for charging the phone at home.'}, {id:'aa', pts:1, why:'Nothing here needs batteries.'}],
   connect:[{id:'offline', pts:4, why:'Works offline in the field, and sends a report to the officer when it finds signal.'}, {id:'data', pts:1, why:'There is no internet in the field.'}, {id:'gsm', pts:2, why:'SMS can’t carry the photo, but could send the result.'}, {id:'lora', pts:1, why:'Radio isn’t needed for a phone app.'}]},
  impact:[{t:'Raju finds the disease early, uses the right treatment and spends less on sprays.', pts:6}, {t:'Farmers will use AI.', pts:2}, {t:'No crop will ever get sick again.', pts:0}],
  thanks:['It asked for internet in the middle of my field. Maybe next time?', 'It works near the bus stand. In the field, it keeps spinning.', 'Pooja and I check the plants together every evening now. It said early blight, and the officer agreed!'],
  real:'An AI model is only as good as its photos: train it on local leaves and let an expert confirm.'},

 {id:'jumbo', title:'Night Jumbo Alert', map:[.86,.26], who:{name:'Shivanna', age:55, role:'farmer by the forest', look:{skin:'#8d5a3a', hair:'#3a2a2a', top:'#f2f2f2', acc:'turban'}},
  story:'Elephants come out of the forest at night and eat our paddy. Last month they broke my neighbour’s hut. We stay up all night with torches. We are tired, and we are scared.',
  questions:[
   {q:'When and where do the elephants come?', good:true, a:'After 10 at night, always along the old path by the stream.', note:'Same path, late at night'},
   {q:'Is there mobile signal at the forest edge?', good:true, a:'No signal there at all. Only in the village, 2 km away.', note:'No signal at the forest edge'},
   {q:'How do people warn each other now?', good:true, a:'We shout and bang plates. The temple has a loudspeaker.', note:'Temple loudspeaker exists'},
   {q:'Can the farmers share the cost?', good:true, a:'Ten families could give ₹800 each.', note:'Budget about ₹8,000, shared', budget:true},
   {q:'Can we scare them away with fire?', good:false, a:'That can hurt the elephants, and us. The forest officers told us never to.'},
   {q:'Why do you farm near the forest?', good:false, a:'This is my father’s land, beta. Where else would I go?'}],
  define:[
   {t:'Shivanna’s village gets no warning when elephants come at night, so families stay awake in fear and still lose crops and homes.', kind:'sharp'},
   {t:'The village needs a bigger fence.', kind:'surface'},
   {t:'Animals and humans can’t live together.', kind:'broad'}],
  budget:8000,
  slots:{
   sense:[{id:'nightcam', pts:4, why:'Sees in the dark, right on the elephants’ path.'}, {id:'motion', pts:2, why:'Cheap, but cows, dogs and wind all set it off. People stop trusting it.'}, {id:'sat', pts:0, why:'Satellites can’t spot an elephant at night in time.'}, {id:'mic', pts:1, why:'Hears something, but can’t tell an elephant from a tractor.'}],
   think:[{id:'edge', pts:4, why:'A small AI model on the camera tells an elephant from a cow, in the dark, with no internet. Far fewer false alarms.'}, {id:'rule', pts:1, why:'“If something moves, alarm” would ring all night for dogs and cows.'}, {id:'cloud', pts:0, why:'No signal at the forest edge to send photos.'}, {id:'human', pts:1, why:'Nobody can watch a camera all night.'}],
   tell:[{id:'siren', pts:4, why:'The temple loudspeaker wakes the whole village in time.'}, {id:'voice', pts:3, why:'Calls to each family work once the alert reaches the village.'}, {id:'sms', pts:2, why:'People are asleep. A text may not wake them.'}, {id:'app', pts:1, why:'Most families don’t have smartphones.'}],
   power:[{id:'solar', pts:4, why:'No power at the forest edge. Solar charges the battery for the night.'}, {id:'grid', pts:0, why:'There is no power line at the forest edge.'}, {id:'aa', pts:1, why:'A camera at night drains batteries in days.'}, {id:'phone', pts:0, why:'A camera trap can’t run on a phone.'}],
   connect:[{id:'lora', pts:4, why:'Long-range radio reaches the village 2 km away, no mobile signal needed.'}, {id:'gsm', pts:1, why:'No signal at the forest edge.'}, {id:'data', pts:0, why:'No internet there.'}, {id:'local', pts:1, why:'An alarm only at the forest edge doesn’t reach the village.'}]},
  impact:[{t:'Families get a warning in time to stay safe, and the elephants are guided back without harm.', pts:6}, {t:'It will stop elephants.', pts:2}, {t:'Elephants will never come again.', pts:0}],
  thanks:['We are still awake every night, beta.', 'It rings for dogs sometimes too. Still, better than before.', 'Last night the speaker woke us in time. Nobody was hurt, not us and not the elephants. I slept after a month.'],
  real:'Good ideas protect people and animals both. Early-warning systems help villages without hurting wildlife.'},

 {id:'school', title:'Teacher-less Tuesday', map:[.36,.3], who:{name:'Kavya', age:10, role:'class 5 student', look:{skin:'#c58c5c', hair:'#1d1416', top:'#3f6fd6', acc:'plaits'}},
  story:'Our maths and English teacher left months ago. One teacher handles all the classes now. I want to be a doctor, but there is nobody to ask my doubts.',
  questions:[
   {q:'Which language do you think in?', good:true, a:'Kannada. English words I can read, slowly.', note:'Learns best in Kannada'},
   {q:'Is there internet at school?', good:true, a:'Only on Sir’s phone, sometimes.', note:'No reliable internet'},
   {q:'Is there electricity at school?', good:true, a:'Power cuts every afternoon.', note:'Afternoon power cuts'},
   {q:'How many children would share it?', good:true, a:'We are 30 in my class.', note:'30 children share'},
   {q:'Why don’t you watch videos online?', good:false, a:'No internet, akka. And no phone.'},
   {q:'Are you good at studies?', good:false, a:'I try my best. Why do you ask?'}],
  define:[
   {t:'Kavya’s school has no maths or English teacher, so 30 children can’t get their doubts answered, and there is no internet to look things up.', kind:'sharp'},
   {t:'The school needs tablets.', kind:'surface'},
   {t:'Education in India is bad.', kind:'broad'}],
  budget:8000,
  slots:{
   sense:[{id:'mic', pts:4, why:'Children ask doubts by speaking Kannada; no typing needed.'}, {id:'cam', pts:3, why:'A photo of the maths problem from the textbook works well too.'}, {id:'keypad', pts:2, why:'Typing works for older children, but is slow.'}, {id:'sat', pts:0, why:'Satellite photos don’t answer maths doubts.'}],
   think:[{id:'edge', pts:4, why:'A small AI tutor that runs offline, in Kannada, explains step by step without internet.'}, {id:'cloud', pts:1, why:'Great answers, but there’s no internet at school.'}, {id:'rule', pts:1, why:'A fixed list of answers can’t handle every doubt.'}, {id:'human', pts:2, why:'A teacher on a call helps, when signal and time allow.'}],
   tell:[{id:'screen', pts:4, why:'Pictures, steps and a Kannada voice help everyone follow.'}, {id:'voice', pts:3, why:'Kannada voice helps, but maths needs pictures too.'}, {id:'app', pts:2, why:'An English-only app leaves many children behind.'}, {id:'siren', pts:0, why:'A loudspeaker isn’t a tutor.'}],
   power:[{id:'solar', pts:4, why:'Solar charging keeps the tablet going through afternoon cuts.'}, {id:'grid', pts:2, why:'Works until the afternoon power cut.'}, {id:'phone', pts:2, why:'One battery runs out over a school day of 30 children.'}, {id:'aa', pts:0, why:'A tablet can’t run on AA batteries.'}],
   connect:[{id:'offline', pts:4, why:'Works offline. New lessons arrive on a pen drive, or when a teacher finds signal.'}, {id:'data', pts:1, why:'No internet at school.'}, {id:'gsm', pts:1, why:'SMS can’t carry lessons.'}, {id:'lora', pts:0, why:'A radio link doesn’t carry tutoring.'}]},
  impact:[{t:'30 children get their doubts answered in Kannada every day, while the school waits for a teacher.', pts:6}, {t:'Children will learn more.', pts:2}, {t:'Schools won’t need teachers any more.', pts:0}],
  thanks:['It talks English too fast. I stopped using it.', 'It helps, akka, but only until the power goes.', 'I asked it about fractions three times and it never got angry! I still want to be a doctor.'],
  real:'AI tutors can help children learn, but they support teachers, they don’t replace them.'},

 {id:'well', title:'Well, Well, Well', map:[.6,.82], who:{name:'Gowramma', age:41, role:'ASHA health worker', look:{skin:'#b47a54', hair:'#1d1416', top:'#e8457a', acc:'bindi'}},
  story:'After every monsoon, children here get loose motions and fever. The lab that tests the well water is 40 km away. By the time results come, the children are already sick.',
  questions:[
   {q:'When do people fall sick?', good:true, a:'After the first heavy rains, every year.', note:'Risk spikes after heavy rain'},
   {q:'Who checks the water now?', good:true, a:'Nobody. Once a year an officer takes a bottle to the lab.', note:'Lab test once a year, 40 km away'},
   {q:'Can people read warnings?', good:true, a:'Many elders can’t read. Everyone knows red and green.', note:'Many can’t read; colours work'},
   {q:'Who should know first if the water turns bad?', good:true, a:'Me. I can tell every house to boil water.', note:'ASHA worker is the trusted messenger'},
   {q:'Why not buy bottled water?', good:false, a:'With what money, beta? Families can’t buy bottles every day.'},
   {q:'Shall we just close the well?', good:false, a:'Then where will eighty families drink from?'}],
  define:[
   {t:'Nobody knows when the village well turns unsafe after rain, so children get sick before anyone can warn families to boil water.', kind:'sharp'},
   {t:'The village needs a water filter.', kind:'surface'},
   {t:'All water in India is dirty.', kind:'broad'}],
  budget:4000,
  slots:{
   sense:[{id:'water', pts:4, why:'Tracks cloudiness and pH, which change when rain washes dirt in. It flags risk; a test kit confirms germs.'}, {id:'cam', pts:1, why:'A photo can’t see germs. Water can look clean and still be unsafe.'}, {id:'keypad', pts:1, why:'Someone would have to test and type every day.'}, {id:'sat', pts:1, why:'Shows rainfall, not what is in this well.'}],
   think:[{id:'rule', pts:4, why:'“If cloudiness jumps after rain, warn.” Clear, cheap and easy to explain.'}, {id:'edge', pts:3, why:'Could learn the well’s patterns over months, but a clear rule is easier to trust first.'}, {id:'cloud', pts:1, why:'Needs internet the well doesn’t have.'}, {id:'human', pts:2, why:'The lab is 40 km away; results come too late.'}],
   tell:[{id:'light', pts:4, why:'A big green or red light on the well. Everyone understands it, reading or not.'}, {id:'voice', pts:3, why:'A Kannada voice call to Gowramma so she can tell every family.'}, {id:'sms', pts:2, why:'Many elders can’t read. Gowramma can, though.'}, {id:'app', pts:0, why:'Few smartphones, and English text.'}],
   power:[{id:'solar', pts:4, why:'The well is outdoors. Solar keeps it running every day.'}, {id:'grid', pts:1, why:'No power line at the well.'}, {id:'aa', pts:2, why:'Batteries need changing often.'}, {id:'phone', pts:0, why:'The sensor can’t run on a phone.'}],
   connect:[{id:'gsm', pts:4, why:'Texts Gowramma and the health centre as soon as the water turns risky.'}, {id:'local', pts:3, why:'The light warns people at the well, but the health centre won’t know.'}, {id:'data', pts:1, why:'Internet is patchy here.'}, {id:'lora', pts:2, why:'Works inside the village, but the health centre is far away.'}]},
  impact:[{t:'Families know the day the well turns risky and boil their water before children fall sick.', pts:6}, {t:'Water will be cleaner.', pts:2}, {t:'No one will ever get sick again.', pts:0}],
  thanks:['People don’t understand what the machine is saying.', 'The light helps. I wish it would also call me.', 'The light went red after the rain, and I told every house to boil water. Not one child fell sick this time.'],
  real:'Sensors can show warning signs like cloudiness; only a lab or test kit confirms germs. Saying what your idea can’t do is good science.'}
];

/* Data Detective labs: train a small AI the fair way. A = what it must tell apart, B = the conditions it will meet in real life.
   pool = how many example cards of each A×B kind are easy to find (real data is lopsided). The learner picks `take` of them. */
window.VL_LABS = [
 {id:'leafai', title:'Leaf Doctor', icon:'🍃', who:'Raju', need:'Raju wants his phone to tell a sick tomato leaf from a healthy one, out in the field.',
  A:[{k:'sick', n:'Sick leaf', e:'🍂'}, {k:'well', n:'Healthy leaf', e:'🍃'}], B:[{k:'sun', n:'Bright sun', c:'#fff1c2'}, {k:'shade', n:'Evening shade', c:'#d9d2e6'}, {k:'wet', n:'Wet after rain', c:'#cfe8f7'}],
  pool:{'well|sun':5, 'sick|sun':3, 'well|shade':2, 'sick|shade':2, 'well|wet':2, 'sick|wet':2}, take:12,
  trap:'Most photos people take are of healthy leaves on sunny days. An AI fed only those calls every leaf healthy.',
  alert:{q:'When should it warn Raju?', o:[
    {t:'Only when it is almost certain the leaf is sick', pts:10, why:'It will miss early disease, and by the time it is certain the whole row is infected.'},
    {t:'When it is fairly sure, and show how sure it is', pts:25, why:'Catches disease early without crying wolf every day. Raju sees the confidence and can decide.'},
    {t:'At the smallest doubt', pts:12, why:'Daily false alarms mean wasted spray money, and soon Raju stops listening.'}]},
  honest:{q:'What do you tell Raju about it?', o:[
    {t:'“It can be wrong. If it says sick, show the leaf to the agriculture officer before you spray.”', pts:25, why:'Honest about limits, and a person makes the final call.'},
    {t:'“The AI is always right. Do what it says.”', pts:0, why:'No AI is always right. One wrong call and he loses money and trust.'},
    {t:'Nothing. He doesn’t need to know how it works.', pts:5, why:'People can only trust a tool they understand the limits of.'}]},
  real:'Plant-disease apps trained mostly on clean lab photos have been found to do much worse on real, messy field photos.'},
 {id:'jumboai', title:'Jumbo Watch', icon:'🐘', who:'Shivanna', need:'A night camera at the forest edge must tell an elephant from a cow, a person or a waving bush.',
  A:[{k:'ele', n:'Elephant', e:'🐘'}, {k:'not', n:'Not an elephant', e:'🐄'}], B:[{k:'moon', n:'Moonlit night', c:'#e3e6f5'}, {k:'dark', n:'Pitch dark', c:'#b9bdd1'}, {k:'fog', n:'Fog and rain', c:'#d5e2e0'}],
  pool:{'not|moon':5, 'ele|moon':3, 'not|dark':2, 'ele|dark':2, 'not|fog':2, 'ele|fog':2}, take:12,
  trap:'Elephants are rare in the photos, and they come on the darkest, foggiest nights. That is exactly the data that is hardest to collect.',
  alert:{q:'When should the siren go off?', o:[
    {t:'Only when it is almost certain it is an elephant', pts:6, why:'A missed elephant can cost a crop, a house or a life. Being “sure” is too late.'},
    {t:'When it is fairly sure', pts:17, why:'Reasonable, but on a foggy night “fairly sure” may still miss the one that matters.'},
    {t:'Even at a small chance, with a softer first warning', pts:25, why:'When a miss is dangerous, lean towards warning. A gentle first alert keeps false alarms bearable.'}]},
  honest:{q:'What do you tell the village?', o:[
    {t:'“It will sometimes ring for a cow, and may miss in thick fog. Keep the night watch going, and tell us every wrong alarm.”', pts:25, why:'Honest, keeps people in the loop, and their reports become new training data.'},
    {t:'“You are safe now. No need for the night watch.”', pts:0, why:'Dangerous. The first miss could be deadly.'},
    {t:'“Trust the machine, it is very advanced.”', pts:3, why:'Sounds impressive, explains nothing, and breaks trust at the first false alarm.'}]},
  real:'Early-warning systems for elephants in India combine cameras and sensors with people: forest staff and village volunteers still confirm and respond.'},
 {id:'voiceai', title:'Voice Helper', icon:'🗣️', who:'Kamala Ajji', need:'A voice helper must understand Kannada spoken by everyone in the village, not only the people who built it.',
  A:[{k:'kid', n:'Child', e:'🧒'}, {k:'woman', n:'Woman', e:'👩'}, {k:'elder', n:'Elder', e:'👵'}], B:[{k:'quiet', n:'Quiet room', c:'#eef3e2'}, {k:'noisy', n:'Windy field', c:'#f3e3cf'}],
  pool:{'kid|quiet':4, 'woman|quiet':4, 'elder|quiet':2, 'kid|noisy':2, 'woman|noisy':2, 'elder|noisy':2}, take:12,
  trap:'Recordings are easiest to get from schoolchildren in a quiet classroom. An AI trained on those cannot understand a grandmother in a windy field.',
  alert:{q:'What should it do when it is not sure what it heard?', o:[
    {t:'Guess and carry on', pts:5, why:'A wrong guess about medicine or money can do real harm.'},
    {t:'Say it back and ask: “Did you say…?”', pts:25, why:'Checking takes two seconds and prevents mistakes, and it is how polite people talk too.'},
    {t:'Stay silent', pts:8, why:'The person is left wondering whether it is broken.'}]},
  honest:{q:'Who do you test it with before you share it?', o:[
    {t:'Elders, women and children from this village, indoors and outdoors', pts:25, why:'The people who will use it, in the places they will use it.'},
    {t:'My classmates', pts:6, why:'They sound like the training data. You will not find the real problems.'},
    {t:'No need: it scored 95% on my laptop', pts:0, why:'A score on your own data says little about people the AI has never heard.'}]},
  real:'Speech tools often work worst for older speakers and local accents, because those voices are rare in the recordings they learned from.'}
];

/* Story Trails: walk through a story, collect clues, name the real problem (who + what + why), then choose how AI should help.
   In each scene one choice gives a real clue; the others give a rumour. First option in who/what/why/fix/safe lists is the best one (they are shuffled on screen). */
window.VL_STORIES = [
 {id:'roadst', theme:'Safety', icon:'🚸', title:'The Blind Curve', hero:'Anjali, 11',
  intro:'Rain is coming. Anjali waits at the edge of the highway with her little brother, school bag over her head. A truck horn screams round the bend. Last month her friend Deepa was hit right here. The whole village is angry, and everybody blames somebody different.',
  scenes:[
   {e:'🛣️🌧️🚛', t:'At the tea stall by the road, people are arguing. “Children today never look before they cross!” says one man. An old truck driver sits quietly in the corner, stirring his tea.', q:'Who do you talk to?', o:[
     {t:'The quiet truck driver', clue:'why', r:'“I have driven this road for twenty years,” he says. “Coming round that bend, I cannot see the crossing until I am almost on top of it. At dusk it is worse. Nobody is careless. We just cannot see each other.”', note:'Drivers cannot see the crossing until the last second'},
     {t:'The man blaming the children', r:'“Careless, all of them!” he says. But he has never stood at the crossing himself. It is an opinion, not a clue.'},
     {t:'The stall owner', r:'“Bad luck, that curve,” he shrugs, and goes back to his kettle.'}]},
   {e:'🏫🕔🎒', t:'You walk to the school. The bell rings at five. Sixty children pour out, and the only way home for half of them is across the highway.', q:'What do you look at?', o:[
     {t:'Stand at the crossing and count for one evening', clue:'who', r:'In thirty minutes, 34 children cross, most of them under twelve, in small groups. No adult is with them. These are the people in danger.', note:'About 34 schoolchildren cross alone every evening'},
     {t:'The school notice board', r:'A poster says “Road Safety Week”. It is from two years ago.'},
     {t:'Ask the head teacher for a new rule', r:'“We already tell them to be careful,” she says. Rules have not stopped the trucks.'}]},
   {e:'🌆🚛💨', t:'The sun is going down. You sit on the wall above the bend with a notebook, the way a scientist would.', q:'What do you measure?', o:[
     {t:'How fast vehicles come round the bend, and when', clue:'what', r:'Between five and six, most trucks take the bend fast, exactly when the children cross. Twice, a truck brakes hard with a child already on the road.', note:'Fast traffic and crossing children meet at the same time, 5 to 6 pm'},
     {t:'How many potholes there are', r:'There are eleven. They are a nuisance, but nobody was hit because of a pothole.'},
     {t:'What colour the trucks are', r:'Mostly orange. That does not help anyone.'}]}],
  who:['Schoolchildren who cross the highway alone each evening', 'Truck drivers', 'The whole village'],
  what:['are nearly hit at the crossing between 5 and 6 pm', 'do not follow rules', 'have bad luck on that road'],
  why:['drivers coming round the bend cannot see them in time', 'children are careless', 'the road has potholes'],
  fix:{q:'How should AI help?', o:[
    {t:'A solar camera before the bend that spots people near the crossing and flashes a big warning light to drivers', pts:25, why:'It fixes the real cause: drivers get the warning before they can see the children. It works offline on solar power.'},
    {t:'A chatbot that teaches children road rules', pts:8, why:'The children already know the rules. The drivers still cannot see them.'},
    {t:'An app that lets parents track their children on a map', pts:5, why:'Knowing where a child is does not stop the truck, and most parents have basic phones.'}]},
  safe:{q:'What makes it safe and fair?', o:[
    {t:'It only counts shapes and never saves faces, and a teacher still walks the children across', pts:15, why:'Privacy is protected, and a person stays in charge when the AI misses.'},
    {t:'Save video of everyone so the police can check later', pts:4, why:'Filming children all day creates a new risk to solve an old one.'},
    {t:'Once it is installed, nobody needs to watch the crossing', pts:0, why:'Every AI misses sometimes. Here a miss can cost a life.'}]},
  ends:['The warning light went up, but the village never agreed what it was for. Within a month people stopped noticing it. Anjali still runs across with her bag over her head.',
   'The light helps on most evenings. Some drivers slow down. But the village is still arguing about what the real problem is, so the fix is only half trusted.',
   'Three weeks later a truck comes round the bend in the rain. The amber light is already flashing. The driver slows to a crawl, and Anjali, her brother and a teacher cross in front of him. He lifts one hand from the wheel and waves.'],
  real:'Blind-spot warning systems that detect people and alert drivers are used at dangerous crossings in many countries. They work best alongside people, signs and speed breakers.'},
 {id:'mandist', theme:'Agriculture', icon:'🍅', title:'The Long Road to Market', hero:'Raju, 38',
  intro:'Three in the morning. Raju loads forty crates of tomatoes onto a hired tempo and drives three hours to the big market. By nine the price has crashed. He sells for less than the tempo cost him. On the way home he passes his neighbours, driving to the same market with the same tomatoes.',
  scenes:[
   {e:'🚚🍅🌄', t:'Back in the village, Raju’s friends have ideas. “Grow something else!” “The traders are all cheats!” His wife Savitri is quietly looking through old receipts.', q:'Who do you sit with?', o:[
     {t:'Savitri and her box of receipts', clue:'what', r:'She spreads them out. “Look. Some days ₹4 a kilo, some days ₹22. It is not always bad. We just never know which day it will be until we are already there.”', note:'Prices swing from ₹4 to ₹22, and they find out only on arrival'},
     {t:'The friend who blames traders', r:'“All cheats!” he says. He has no receipts and no numbers. It is anger, not evidence.'},
     {t:'The friend who says grow something else', r:'“Try chillies.” Maybe. But chilli growers have the same problem.'}]},
   {e:'📻🏪📉', t:'You visit the market. Inside the office, a clerk writes today’s prices on a board. Outside, forty tempos from forty villages are already unloading.', q:'What do you find out?', o:[
     {t:'Ask where else tomatoes are sold, and at what price today', clue:'why', r:'“Two smaller markets, each an hour away,” says the clerk. “Today they paid ₹9 more than here. But farmers cannot know that before they leave home. Everyone comes here because everyone comes here.”', note:'Other markets pay more, but farmers cannot compare before leaving home'},
     {t:'Count how many crates there are', r:'A lot. That tells you the market is full, but not why.'},
     {t:'Ask for a better price for Raju', r:'The trader laughs. “Supply is supply.”'}]},
   {e:'👨‍🌾👩‍🌾📱', t:'Evening. Twelve farmers sit under the banyan tree. You ask to see their phones.', q:'What do you check?', o:[
     {t:'What kind of phones they have and how they get news', clue:'who', r:'Nine of twelve have basic phones. All grow tomatoes on small plots and hire the same two tempos. They hear prices by word of mouth, a day late.', note:'Small tomato farmers with basic phones, hearing prices a day late'},
     {t:'Whether they like tomatoes', r:'They do. This does not help.'},
     {t:'Who has the biggest farm', r:'One large farmer has his own truck and a smartphone. He is not the one losing money.'}]}],
  who:['Small tomato farmers with basic phones', 'Traders at the big market', 'All farmers in India'],
  what:['sell at a loss on days when the big market is flooded', 'grow the wrong crop', 'are cheated by everyone'],
  why:['they cannot compare prices at different markets before the long trip', 'they do not work hard enough', 'tomatoes are a bad crop'],
  fix:{q:'How should AI help?', o:[
    {t:'Each evening, a Kannada voice call with tomorrow’s likely price at three markets, predicted from past prices and arrivals', pts:25, why:'It gives the missing information, before the trip, on the phone they already own.'},
    {t:'A robot that picks tomatoes faster', pts:4, why:'Picking was never the problem. More tomatoes on a bad day means a bigger loss.'},
    {t:'A smartphone app with price charts in English', pts:9, why:'Right idea, wrong form: most have basic phones and prefer to listen in Kannada.'}]},
  safe:{q:'What makes it honest and fair?', o:[
    {t:'It says “this is a forecast, and this is how sure I am”, and each farmer decides for himself', pts:15, why:'A forecast can be wrong. People who know that make better choices and keep trusting it.'},
    {t:'It tells every farmer to go to the single best market', pts:5, why:'Then everyone floods that market instead, and the price crashes there.'},
    {t:'It promises the price', pts:0, why:'No one can promise tomorrow’s price. The first wrong promise ends all trust.'}]},
  ends:['A machine arrived, but it answered a question nobody had asked. Raju still leaves at three in the morning and hopes.',
   'Some evenings the price call helps. Some mornings half the village still turns up at the same market. Better, but the real problem was only half named.',
   'Nine at night. Raju’s old phone rings. “Tomorrow: big market low, quite sure. Hosadurga market higher, fairly sure.” He and two neighbours share one tempo to Hosadurga. They are home by noon, and Savitri adds a new receipt to the box: ₹19 a kilo.'],
  real:'Price information and forecasts sent by voice and SMS are used by farmer services in India and Africa. Studies find they help most when farmers can actually reach more than one market.'},
 {id:'shopst', theme:'Small business', icon:'🧵', title:'Meena’s Shop', hero:'Meena, 29',
  intro:'Meena runs the only shop for six kilometres: soap, rice, school notebooks, phone recharges. She works from six to nine. Yet the week before the festival she ran out of oil and jaggery by Tuesday, while forty packets of biscuits nobody wanted went stale. “I am always busy,” she says, “so why am I always short of money?”',
  scenes:[
   {e:'🏪📒🪔', t:'People have advice. Her uncle says, “Raise your prices.” A salesman says, “Buy my biscuits in bulk, cheaper!” On the counter sits a fat, worn notebook.', q:'What do you look at?', o:[
     {t:'The notebook', clue:'why', r:'Every sale on credit is here, in order, for three years. But sales for cash are not written anywhere. To know what sold last festival, Meena would have to remember. “It is all in my head,” she says, “and my head is full.”', note:'Sales live only in her memory, so she cannot see what sells when'},
     {t:'The salesman’s offer', r:'Cheaper per packet, yes. But she already has forty packets going stale.'},
     {t:'The uncle’s advice', r:'Higher prices would send her customers six kilometres down the road.'}]},
   {e:'🧺🫙📦', t:'You spend a Saturday behind the counter with her, making a mark on paper for every single thing sold.', q:'What do you count?', o:[
     {t:'What sells out, and what sits', clue:'what', r:'By evening: oil gone at noon, jaggery gone at two, eleven people sent away. Biscuits sold: one. Her money is sitting on the shelf as things nobody buys, while what people want runs out.', note:'What sells runs out; money is stuck in stock that does not sell'},
     {t:'How many people say hello', r:'Everybody. She is well loved. That is not the problem.'},
     {t:'How tidy the shelves are', r:'Very tidy. Tidy shelves of the wrong things.'}]},
   {e:'👩‍👧📱🕘', t:'Nine at night. Meena pulls the shutter down. Her daughter is asleep on a rice sack. You ask how she decides what to order.', q:'What do you ask about?', o:[
     {t:'Her day: when she orders, and what she uses to do it', clue:'who', r:'“The supplier’s van comes on Monday. I order from memory in five minutes with a child on my hip. I have a smartphone, but I only use it for recharges and voice messages. I have no time to type.”', note:'A one-woman shop owner, no time to type, comfortable with voice messages'},
     {t:'Whether she wants a bigger shop', r:'“One day,” she smiles. A bigger shop with the same problem would lose more money.'},
     {t:'Why she does not hire an accountant', r:'She laughs. “With what money?”'}]}],
  who:['Meena, who runs a village shop alone', 'Her customers', 'Every shop in the district'],
  what:['runs out of what sells while her money is stuck in what does not', 'charges too little', 'is not working hard enough'],
  why:['her sales are kept only in memory, so she cannot see what sells when', 'her customers are unfair', 'the shop is too small'],
  fix:{q:'How should AI help?', o:[
    {t:'She says each sale aloud in Kannada; the AI keeps the book and, every Sunday, suggests what to order before the van comes', pts:25, why:'It fits her life: voice, no typing. It turns her memory into a pattern she can see, exactly when she orders.'},
    {t:'A website so people can order from her online', pts:6, why:'Her customers walk in. More orders do not help when the oil has already run out.'},
    {t:'An AI that sets prices automatically', pts:5, why:'Price was never the problem. Stock was.'}]},
  safe:{q:'What keeps Meena in charge?', o:[
    {t:'Her sales stay on her own phone, and the AI only suggests: she checks and changes the order list', pts:15, why:'Her business data is hers, and she knows things the AI does not, like a wedding next week.'},
    {t:'The AI sends the order to the supplier by itself', pts:5, why:'Fast, until it orders forty packets of biscuits because of one odd week.'},
    {t:'Share her sales data with the supplier so they can decide', pts:0, why:'The supplier wants to sell more, not what is best for Meena.'}]},
  ends:['A clever tool arrived that solved somebody else’s problem. The biscuits are still on the shelf. Meena is still tired.',
   'The new tool helps a little. Some weeks the oil lasts until Friday. But the real problem was only half understood, so the fix only half fits.',
   'Sunday evening. Meena’s phone speaks: “Last Deepavali week you sold nineteen litres of oil. You have six. Biscuits: order none.” She changes one line, because there is a wedding on Thursday, and sends it. That festival week, nobody is sent away, and on Saturday she closes the shutter at eight.'],
  real:'Voice-first bookkeeping in local languages helps very small shops track sales. The owner’s own knowledge of local events still beats any forecast, so good tools suggest and let her decide.'}
];
