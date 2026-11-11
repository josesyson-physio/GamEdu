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
