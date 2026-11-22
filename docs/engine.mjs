import {CARDS,CARD_BY_ID,SPREADS,TOPICS,INTENTS,CONTENT_VERSION} from './data/catalog.mjs';
export const spreadById = id => SPREADS.find(s=>s.id===id);
export const local = (value,lang) => value[lang==='ru'?'ru':'en'];
export function randomInt(max,cryptoSource=globalThis.crypto) {
 if(!Number.isSafeInteger(max)||max<1||max>0x100000000) throw new RangeError('Invalid random range');
 if(!cryptoSource?.getRandomValues) throw new Error('Secure randomness is unavailable');
 const buffer=new Uint32Array(1),limit=Math.floor(0x100000000/max)*max;
 do { cryptoSource.getRandomValues(buffer); } while(buffer[0]>=limit);
 return buffer[0]%max;
}
export function drawCards(count,reversals=false,cryptoSource=globalThis.crypto) {
 if(!Number.isInteger(count)||count<1||count>CARDS.length) throw new RangeError('Invalid card count');
 const pool=CARDS.map(c=>c.id);
 for(let i=pool.length-1;i>0;i--){const j=randomInt(i+1,cryptoSource);[pool[i],pool[j]]=[pool[j],pool[i]];}
 return pool.slice(0,count).map(id=>({id,reversed:reversals&&randomInt(2,cryptoSource)===1}));
}
export function validateReading(reading) {
 const spread=spreadById(reading?.spread);
 if(!spread||!Array.isArray(reading.cards)||reading.cards.length!==spread.count) return 'count';
 if(reading.cards.some(c=>!c||!CARD_BY_ID[c.id]||typeof c.reversed!=='boolean')) return 'card';
 if(new Set(reading.cards.map(c=>c.id)).size!==reading.cards.length) return 'duplicate';
 if(!TOPICS.some(t=>t.id===reading.topic)||!INTENTS.some(t=>t.id===reading.intent)) return 'context';
 if(!['digital','physical'].includes(reading.mode)) return 'mode';
 return null;
}

// Context questions are original prototype editorial blocks. They are selected by
// card + topic, then combined with the orientation and the position's role.
const majorThemeRows=[
 ['fool','Где в отношениях есть место новому знакомству или более открытому разговору?','Where could a connection benefit from a fresh start or a more open conversation?','Какую рабочую идею можно проверить без большого обязательства?','Which work idea could you test without a large commitment?','Какой предмет или навык вызывает живое любопытство?','Which subject or skill sparks your curiosity?','Какой небольшой опыт поможет проверить новый путь?','What small experiment could help you explore a new path?'],
 ['magician','Как вы можете яснее выразить своё желание и услышать ответ?','How could you express a wish more clearly and make room for a response?','Какие инструменты и навыки уже есть в вашем распоряжении?','Which tools and skills are already available to you?','Как применить изученное в одной практической задаче?','How could you use what you have learned in one practical task?','Какой вариант лучше использует ваши реальные возможности?','Which option makes better use of your actual resources?'],
 ['priestess','Что вы чувствуете, а что лишь предполагаете о другом человеке?','What do you feel, and what are you only assuming about another person?','Какой информации недостаёт до рабочего решения?','What information is missing before a work decision?','Что становится понятнее после спокойного самостоятельного размышления?','What becomes clearer through quiet independent reflection?','Какой вариант вызывает спокойный отклик, если убрать внешние ожидания?','Which option feels quietly right when you set outside expectations aside?'],
 ['empress','Какую заботу вы готовы давать и хотели бы получать?','What care are you willing to give, and what would you like to receive?','Какому проекту нужны время, условия и регулярное внимание?','Which project needs time, good conditions and regular attention?','Что поможет сделать обучение комфортным и устойчивым?','What would make learning comfortable and sustainable?','Какой путь оставляет больше пространства для роста?','Which path leaves more room for growth?'],
 ['emperor','Насколько ясны границы и договорённости в вашей связи?','How clear are the boundaries and agreements in this connection?','Какая структура сделает ответственность и сроки понятнее?','What structure would make responsibilities and deadlines clearer?','Какой учебный распорядок действительно выполним?','What study routine is genuinely workable?','Какой вариант даёт нужную опору без чрезмерного контроля?','Which option gives enough stability without excessive control?'],
 ['hierophant','Какие представления о близости принадлежат вам, а какие унаследованы?','Which ideas about closeness are your own, and which have you inherited?','Чей проверенный опыт поможет разобраться с задачей?','Whose established experience could help with this task?','Какой наставник или последовательная программа вам подходят?','Which teacher or structured course would suit you?','Какой выбор согласуется с вашими собственными убеждениями?','Which choice aligns with your own convictions?'],
 ['lovers','Совпадают ли ваши желания, ценности и представления об обязательствах?','Do your desires, values and expectations of commitment align?','Какие рабочие отношения строятся на действительно общих ценностях?','Which working relationships rest on genuinely shared values?','Какое направление соответствует не только интересу, но и вашим приоритетам?','Which direction fits your priorities as well as your interests?','Что для вас настолько важно, что определяет этот выбор?','What matters enough to you to guide this choice?'],
 ['chariot','Движетесь ли вы в согласованном направлении, сохраняя самостоятельность?','Are you moving in an agreed direction while keeping your independence?','Какова конкретная цель ближайшего этапа?','What is the specific aim of the next stage?','Какой небольшой план поможет удержать учебный темп?','What small plan would help maintain your learning momentum?','Какой путь вы готовы поддерживать последовательными действиями?','Which path are you willing to support with consistent action?'],
 ['strength','Где мягкая настойчивость полезнее попытки переубедить?','Where might gentle persistence help more than trying to persuade?','Какая задача требует выдержки, а не дополнительного давления?','Which task needs patience rather than more pressure?','Как сохранить терпение к себе при освоении сложного?','How could you be patient with yourself while learning something difficult?','Какой выбор сохраняет уважение к вашим границам и силам?','Which choice respects your boundaries and energy?'],
 ['hermit','Какая дистанция помогает понять себя, не превращаясь в изоляцию?','What distance helps you understand yourself without becoming isolation?','Что стоит обдумать самостоятельно до общего обсуждения?','What deserves independent thought before a group discussion?','Какое спокойное исследование поможет углубить понимание?','What quiet investigation would deepen your understanding?','Какая часть ответа становится яснее вдали от чужих мнений?','What part of the answer becomes clearer away from others’ opinions?'],
 ['wheel','Какой повторяющийся сценарий вы замечаете в общении?','What recurring pattern do you notice in the way you relate?','К каким изменениям условий можно подготовиться?','Which changing conditions could you prepare for?','Как приспособить учебный ритм к изменившимся обстоятельствам?','How could your learning rhythm adapt to changed circumstances?','Какой вариант остаётся гибким при изменении внешних условий?','Which option remains flexible when outside conditions change?'],
 ['justice','Насколько взаимны договорённости и распределение ответственности?','How reciprocal are the agreements and the division of responsibility?','Какие факты, условия и критерии необходимо сопоставить?','Which facts, terms and criteria need comparing?','Какой честный критерий покажет реальный уровень понимания?','What fair criterion would show your actual understanding?','Каковы известные последствия каждого варианта?','What are the known consequences of each option?'],
 ['hanged','Что изменится, если посмотреть на ситуацию глазами другой стороны?','What changes when you look at the situation from the other side?','Какая пауза позволит пересмотреть неработающий подход?','What pause would help you reconsider an approach that is not working?','Можно ли понять сложную тему через другой пример?','Could a different example help you understand a difficult topic?','Что стоит прояснить до окончательного выбора?','What deserves clarification before a final choice?'],
 ['death','Какая привычная форма общения перестала подходить вам?','Which familiar way of relating no longer fits?','Какой этап или метод пора завершить, сохранив полезный опыт?','Which stage or method can end while its useful lessons remain?','Какой устаревший способ учиться стоит заменить?','Which outdated study habit could you replace?','С чем придётся расстаться в каждом из вариантов?','What would you need to release in each option?'],
 ['temperance','Как согласовать разные потребности без постоянной уступки одной стороны?','How could different needs coexist without one person always yielding?','Какой темп позволит работать без постоянного перегруза?','What pace would let you work without constant overload?','Как сочетать практику, повторение и отдых?','How could practice, revision and rest work together?','Какой вариант допускает постепенную настройку?','Which option allows gradual adjustment?'],
 ['devil','Какая привязанность ограничивает свободу или ясность ваших границ?','Which attachment limits your freedom or blurs your boundaries?','Что удерживает вас в обязательстве, цена которого выросла?','What keeps you in a commitment whose cost has grown?','Какая привычка незаметно отнимает время у обучения?','Which habit quietly takes time away from learning?','Какая выгода делает нежелательное обязательство привлекательным?','What benefit makes an unwanted obligation attractive?'],
 ['tower','Какая обнаруженная несогласованность требует честного обсуждения?','Which newly visible mismatch needs an honest conversation?','Какую слабую часть проекта нужно сначала укрепить?','Which weak part of a project needs support first?','Какой пробел в понимании полезно признать и разобрать?','Which gap in understanding would help to acknowledge and explore?','Какая опора останется доступной при перемене планов?','What support would remain available if plans changed?'],
 ['star','Что помогает восстанавливать доверие без поспешных обещаний?','What helps rebuild trust without rushed promises?','Какой дальний ориентир поддерживает небольшие сегодняшние действия?','Which long-term aim supports small actions today?','Что возвращает интерес и веру в способность научиться?','What renews your interest and confidence in learning?','Какой путь поддерживает надежду и допускает реалистичный темп?','Which path supports hope and a realistic pace?'],
 ['moon','Какие мысли о другом человеке пока остаются предположениями?','Which thoughts about another person are still assumptions?','Какие условия задачи ещё неясны и требуют проверки?','Which conditions of the task are still unclear and need checking?','Что кажется знакомым, но ещё не проверено практикой?','What feels familiar but has not yet been tested in practice?','Какую неизвестную важно назвать до сравнения вариантов?','Which unknown needs naming before comparing the options?'],
 ['sun','Где вам легко быть открытой и замечать взаимную радость?','Where is it easy to be open and notice shared enjoyment?','Какой понятный результат уже можно показать и отметить?','Which clear result can you already share and acknowledge?','Какой небольшой успех подтверждает ваше продвижение?','What small success shows your progress?','Какой вариант позволяет яснее выражать свои желания?','Which option lets you express your wishes more clearly?'],
 ['judgement','Какой опыт отношений вы хотите осмыслить, не обвиняя себя?','What relationship experience would you like to understand without blaming yourself?','Что полезного показывает обратная связь о вашей работе?','What useful insight does feedback on your work offer?','Какая проверка знаний подскажет следующий учебный шаг?','What review of your knowledge would suggest a next step?','Какой прежний опыт действительно относится к нынешнему выбору?','Which past experience is actually relevant to this choice?'],
 ['world','Что создаёт ощущение целостности при сохранении самостоятельности?','What creates a sense of wholeness while preserving independence?','Какой этап можно закрыть и что следует передать дальше?','Which stage can you close, and what needs handing over?','Как собрать отдельные знания в цельную картину?','How could separate pieces of knowledge form a whole picture?','Какой вариант завершает важный для вас этап?','Which option brings an important stage to completion?']
];
const majorThemes=Object.fromEntries(majorThemeRows.map(([id,...texts])=>[`major-${id}`,Object.fromEntries(['love','work','study','choice'].map((topic,i)=>[topic,{ru:texts[i*2],en:texts[i*2+1]}]))]));
const suitThemes={
 wands:{love:{ru:'Как в общении сочетаются инициатива, интерес и уважение к чужому темпу?',en:'How do initiative, interest and respect for another person’s pace fit together?'},work:{ru:'Куда полезнее направить инициативу и творческую энергию?',en:'Where would initiative and creative energy be most useful?'},study:{ru:'Что поможет превратить интерес в регулярную практику?',en:'What would turn interest into regular practice?'},choice:{ru:'Какой вариант вы готовы поддержать действием после первого воодушевления?',en:'Which option would you act on after the first burst of enthusiasm?'}},
 cups:{love:{ru:'Как соотносятся ваши чувства, ожидания и реальная взаимность?',en:'How do your feelings and expectations compare with actual reciprocity?'},work:{ru:'Как эмоциональный климат и отношения влияют на ваше участие в деле?',en:'How do the emotional climate and relationships affect your involvement at work?'},study:{ru:'Что вызывает личный отклик и помогает сохранить интерес к учёбе?',en:'What feels personally meaningful and helps keep learning interesting?'},choice:{ru:'Какое желание стоит за привлекательностью каждого варианта?',en:'What wish lies behind the appeal of each option?'}},
 swords:{love:{ru:'Какой факт или честный разговор поможет отделить переживания от догадок?',en:'What fact or honest conversation would help separate feelings from assumptions?'},work:{ru:'Какие условия и аргументы нужно прояснить до следующего рабочего решения?',en:'Which terms and arguments need clarity before the next work decision?'},study:{ru:'Как проверить понимание темы, а не только ощущение знакомого текста?',en:'How could you test understanding rather than familiarity with the text?'},choice:{ru:'Какие доводы основаны на фактах, а какие — на тревожном предположении?',en:'Which arguments rest on facts, and which rest on an anxious assumption?'}},
 pentacles:{love:{ru:'Как забота проявляется в повседневных поступках и распределении обязательств?',en:'How does care show up in daily actions and shared responsibilities?'},work:{ru:'Каковы реальные ресурсы, обязательства и ближайший измеримый шаг?',en:'What are the actual resources, commitments and next measurable step?'},study:{ru:'Какое конкретное упражнение и доступное время помогут закрепить навык?',en:'What concrete exercise and available time would help build the skill?'},choice:{ru:'Какие время, средства и усилия потребует каждый вариант?',en:'What time, resources and effort would each option require?'}}
};
const roleText={
 focus:{ru:'Рассмотрите этот образ как главный акцент вашего вопроса.',en:'Consider this image as the main focus of your question.'},
 past:{ru:'В этой позиции карта предлагает оглянуться на опыт, который влияет на ваше восприятие сейчас.',en:'In this position, the card invites you to consider an experience that shapes how you see things now.'},
 present:{ru:'В этой позиции образ помогает рассмотреть то, что требует внимания сейчас.',en:'In this position, the image explores what calls for your attention now.'},
 future:{ru:'Это возможное направление при сохранении нынешнего подхода. Ваши действия и обстоятельства могут его изменить.',en:'This is a possible direction if the current approach continues. Your actions and circumstances can change it.'},
 obstacle:{ru:'Спросите, какая сторона этого образа может затруднять продвижение.',en:'Ask which part of this image could be making progress harder.'},
 support:{ru:'Ищите в этом образе качество или ресурс, на который можно опереться.',en:'Look in this image for a quality or resource you could draw on.'},
 advice:{ru:'Переведите этот образ в небольшой шаг, который находится под вашим контролем.',en:'Turn this image into a small step that is within your control.'},
 'a-now':{ru:'Примените образ к отправной точке варианта А.',en:'Apply the image to the starting point of option A.'},
 'b-now':{ru:'Примените образ к отправной точке варианта Б.',en:'Apply the image to the starting point of option B.'},
 'a-challenge':{ru:'Рассмотрите возможную сложность варианта А и доступную подготовку к ней.',en:'Consider a possible challenge in option A and how you could prepare.'},
 'b-challenge':{ru:'Рассмотрите возможную сложность варианта Б и доступную подготовку к ней.',en:'Consider a possible challenge in option B and how you could prepare.'},
 'a-future':{ru:'Это образ возможного развития варианта А, а не оценка его правильности.',en:'This is an image of a possible direction for option A, not a verdict on whether it is right.'},
 'b-future':{ru:'Это образ возможного развития варианта Б, а не оценка его правильности.',en:'This is an image of a possible direction for option B, not a verdict on whether it is right.'}
};
const intentText={
 reflection:{ru:'Отметьте, что в этом описании откликается вашему опыту, и что ему не соответствует.',en:'Notice what resonates with your experience and what does not.'},
 advice:{ru:'Выберите одно небольшое действие, которое можно проверить на практике.',en:'Choose one small action you could test in practice.'},
 obstacle:{ru:'Сравните внешнее ограничение с предположением, которое ещё можно проверить.',en:'Compare an outside constraint with an assumption you could still check.'}
};
const generalQuestions=[
 ['Что вы хотите попробовать, но пока откладываете?','What would you like to try but keep putting off?'],
 ['Какой из уже имеющихся навыков сейчас особенно полезен?','Which skill you already have would be especially useful now?'],
 ['Что вы замечаете, когда перестаёте торопить ответ?','What do you notice when you stop rushing towards an answer?'],
 ['Чему вы хотите дать больше заботы и времени?','What would you like to give more care and time?'],
 ['Какая ясная договорённость поможет почувствовать опору?','What clear agreement would help you feel more grounded?'],
 ['Какие привычные убеждения вы готовы проверить заново?','Which familiar beliefs are you ready to examine again?'],
 ['Что в этом вопросе связано с вашими главными ценностями?','What in this question connects with your core values?'],
 ['Куда вы хотите направить ближайшее конкретное усилие?','Where would you like to direct your next concrete effort?'],
 ['Где вы можете быть настойчивее, оставаясь бережной к себе?','Where could you be more persistent while remaining kind to yourself?'],
 ['Какой мысли нужно немного спокойного пространства?','Which thought needs a little quiet space?'],
 ['Какое небольшое изменение доступно внутри нынешних обстоятельств?','What small change is possible within your present circumstances?'],
 ['Какие факты стоит сопоставить, прежде чем делать вывод?','Which facts deserve comparison before you draw a conclusion?'],
 ['Как изменится картина, если посмотреть с другой стороны?','How does the picture change when you look from another side?'],
 ['Что уже завершилось и что вы хотите сохранить из этого опыта?','What has ended, and what would you like to keep from the experience?'],
 ['Как выглядит подходящий именно вам ритм?','What would a pace that suits you look like?'],
 ['Какая привычка даёт краткую выгоду, но уменьшает свободу?','Which habit gives a short-term benefit while reducing your freedom?'],
 ['Какую устойчивую опору вы можете найти перед переменой?','What stable support could you find before a change?'],
 ['Что поддерживает надежду без обещания мгновенного результата?','What sustains hope without a promise of instant results?'],
 ['Какая часть картины пока остаётся предположением?','Which part of the picture is still an assumption?'],
 ['Какой небольшой успех заслуживает вашего признания?','What small success deserves your acknowledgement?'],
 ['Какой урок прошлого полезен без излишнего самоосуждения?','Which lesson from the past helps without unnecessary self-judgement?'],
 ['Что позволит почувствовать, что важный этап действительно завершён?','What would help an important stage feel truly complete?']
];
const rankQuestions=[
 ['Какой первый шаг сделает возможность ощутимой?','What first step would make an opportunity tangible?'],
 ['Какие две потребности сейчас важно согласовать?','Which two needs would benefit from being brought together?'],
 ['Чей вклад или какая обратная связь помогут увидеть больше?','Whose contribution or feedback would help you see more?'],
 ['Что даёт устойчивость, а что уже стало ограничением?','What gives you stability, and what has become a constraint?'],
 ['Какой сложный момент требует ясности и поддержки?','Which difficult moment needs clarity and support?'],
 ['Какую помощь вы готовы предложить или принять?','What help would you be willing to offer or receive?'],
 ['Какое предположение полезно проверить на практике?','Which assumption would be useful to test in practice?'],
 ['Какое регулярное действие изменит ситуацию со временем?','Which regular action could change the situation over time?'],
 ['Что уже достигнуто и какова цена нынешнего усилия?','What have you already achieved, and what does your current effort cost?'],
 ['Какую часть этапа можно завершить или разделить с другими?','What part of this stage could you complete or share with others?'],
 ['Чему вы готовы учиться без требования немедленного мастерства?','What are you willing to learn without demanding immediate mastery?'],
 ['Как соотнести решительность с вниманием к последствиям?','How could you balance determination with attention to consequences?'],
 ['Как проявить заботу, сохраняя собственные границы?','How could you show care while keeping your boundaries?'],
 ['Какая ответственность действительно находится в ваших руках?','Which responsibility is actually in your hands?']
];
const pairRules=[
 ['major-moon','major-sun',{ru:'Луна и Солнце рядом предлагают сравнить сильное впечатление с тем, что можно ясно проверить и назвать.',en:'The Moon and the Sun together invite you to compare a strong impression with what you can clearly check and name.'}],
 ['major-fool','major-magician',{ru:'Шут и Маг соединяют готовность попробовать с имеющимися средствами. Найдите маленький опыт, для которого у вас уже всё есть.',en:'The Fool and the Magician bring exploration together with available tools. Find a small experiment you already have the means to try.'}],
 ['major-lovers','major-justice',{ru:'Влюблённые и Правосудие связывают личные ценности с ясными договорённостями. Проверьте, одинаково ли стороны понимают свой выбор.',en:'The Lovers and Justice connect personal values with clear agreements. Check whether both sides understand the choice in the same way.'}],
 ['major-death','major-star',{ru:'Смерть и Звезда соединяют символическое завершение с восстановлением. Освобождённое место необязательно заполнять сразу.',en:'Death and the Star connect a symbolic ending with renewal. The space that opens does not have to be filled immediately.'}],
 ['major-chariot','major-temperance',{ru:'Колесница и Умеренность предлагают соотнести движение с устойчивым темпом. Проверьте, как долго вы готовы поддерживать выбранный ритм.',en:'The Chariot and Temperance balance momentum with a sustainable pace. Consider how long you can maintain the chosen rhythm.'}],
 ['major-hermit','major-priestess',{ru:'Отшельник и Жрица подчёркивают спокойное наблюдение. Отделите полезную паузу от бесконечного ожидания полной определённости.',en:'The Hermit and the High Priestess emphasise quiet observation. Separate a helpful pause from an endless wait for certainty.'}]
];
export function interpretReading(reading,lang='ru'){
 const error=validateReading(reading);if(error)throw new Error(`Invalid reading: ${error}`);
 const spread=spreadById(reading.spread),l=lang==='en'?'en':'ru';
 const positions=reading.cards.map((chosen,index)=>{
  const card=CARD_BY_ID[chosen.id];
  const general=card.suit==='major'?generalQuestions[card.rank]:rankQuestions[card.rank-1];
  return {card,chosen,position:spread.roles[index][l],base:local(chosen.reversed?card.reversed:card.upright,l),role:local(roleText[spread.roles[index].id],l),theme:reading.topic==='general'?general[l==='ru'?0:1]:local(card.suit==='major'?majorThemes[card.id][reading.topic]:suitThemes[card.suit][reading.topic],l)};
 });
 const ids=new Set(reading.cards.map(c=>c.id)),connections=[];
 // Special pair text applies only to upright pairs; reverse uses the generic structural layer.
 for(const[a,b,text]of pairRules)if(ids.has(a)&&ids.has(b)&&!reading.cards.some(c=>(c.id===a||c.id===b)&&c.reversed))connections.push(local(text,l));
 if(reading.cards.length>1){
  const counts={};reading.cards.forEach(c=>{const suit=CARD_BY_ID[c.id].suit;counts[suit]=(counts[suit]||0)+1;});
  const dominant=Object.keys(counts).find(s=>counts[s]>=2&&counts[s]>reading.cards.length/2);
  const suitSummary={major:{ru:'Несколько старших арканов предлагают посмотреть на общие ценности и повторяющиеся жизненные темы, сохраняя внимание к конкретным обстоятельствам.',en:'Several Major Arcana invite a look at broad values and recurring life themes while keeping specific circumstances in view.'},wands:{ru:'В раскладе преобладают Жезлы: обратите внимание на инициативу, темп и распределение энергии.',en:'Wands predominate: pay attention to initiative, pace and where your energy goes.'},cups:{ru:'В раскладе преобладают Кубки: сравните переживания, ожидания и то, как они выражаются в общении.',en:'Cups predominate: compare feelings, expectations and how they are expressed in relationships.'},swords:{ru:'В раскладе преобладают Мечи: полезно прояснить мысли, формулировки и проверяемые факты.',en:'Swords predominate: clarify your thoughts, wording and the facts that can be checked.'},pentacles:{ru:'В раскладе преобладают Пентакли: переведите размышление в повседневные действия, время и доступные ресурсы.',en:'Pentacles predominate: connect reflection with daily actions, time and available resources.'}};
  if(dominant)connections.push(local(suitSummary[dominant],l));
  if(!connections.length)connections.push(l==='ru'?'Сопоставьте карты по их позициям: что было фоном, что важно сейчас и какой шаг вы можете выбрать. Разные образы не обязаны давать один однозначный ответ.':'Compare the cards through their positions: the background, what matters now and the step you can choose. Different images do not have to give a single definite answer.');
 }
 return {positions,connections,intent:local(intentText[reading.intent],l),version:CONTENT_VERSION};
}
export function cleanStoredReading(value){
 if(validateReading(value)||typeof value.id!=='string'||value.id.length>100||!Number.isFinite(Date.parse(value.created)))return null;
 return {id:value.id,created:value.created,spread:value.spread,topic:value.topic,intent:value.intent,mode:value.mode,cards:value.cards.map(c=>({id:c.id,reversed:c.reversed})),question:typeof value.question==='string'?value.question.slice(0,500):'',note:typeof value.note==='string'?value.note.slice(0,3000):'',version:typeof value.version==='string'?value.version.slice(0,40):CONTENT_VERSION};
}
export function loadJournal(raw){
 try{const a=JSON.parse(raw);return Array.isArray(a)?a.slice(0,100).map(cleanStoredReading).filter(Boolean):[];}catch{return[];}
}
