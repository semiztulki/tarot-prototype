import {CARDS,CARD_BY_ID,SPREADS,TOPICS,INTENTS,SUITS,CONTENT_VERSION} from './data/catalog.mjs';
import {drawCards,interpretReading,validateReading,loadJournal,spreadById,local} from './engine.mjs';
import {UI} from './i18n.mjs';
import {art,cardBack} from './art.mjs';

const $=s=>document.querySelector(s),app=$('#app'),modal=$('#modal');
const STORAGE='arcana.tarot-prototype.journal.v1',LANGUAGE='arcana.tarot-prototype.language';
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icon=(name)=>{const paths={star:'<path d="m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z"/><circle cx="12" cy="12" r="2"/>',book:'<path d="M5 3h14v18H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm0 14h14M8 7h7m-7 4h5"/>',save:'<path d="M5 3h14v18l-7-4-7 4V3Z"/>',download:'<path d="M12 3v12m-4-4 4 4 4-4M4 16v5h16v-5"/>',lock:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2"/>',trash:'<path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14M10 11v6m4-6v6"/>'};return `<svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]||paths.star}</svg>`;};
let language;
try{language=localStorage.getItem(LANGUAGE);}catch{}
const urlLanguage=new URL(location.href).searchParams.get('lang');
language=['ru','en'].includes(urlLanguage)?urlLanguage:['ru','en'].includes(language)?language:(navigator.language.toLowerCase().startsWith('ru')?'ru':'en');
let journal=[];try{journal=loadJournal(localStorage.getItem(STORAGE));}catch{}
const state={lang:language,page:['journal','library'].includes(location.hash.slice(1))?location.hash.slice(1):'reading',spread:'three',topic:'general',intent:'reflection',mode:'digital',question:'',reversals:false,manual:[],reading:null,revealed:new Set(),error:'',journal,query:'',suit:'all',pickerIndex:0,pickerQuery:'',deleted:null};
const t=key=>UI[state.lang][key];
const motion=()=>matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth';
const selectedSpread=()=>spreadById(state.spread);
const date=value=>new Intl.DateTimeFormat(t('dateLocale'),{day:'numeric',month:'short',year:'numeric'}).format(new Date(value));
const topicLabel=id=>TOPICS.find(v=>v.id===id)?.[state.lang]||'';
const cardCount=s=>t(({1:'oneCard',3:'threeCards',5:'fiveCards',6:'sixCards'})[s.count]);
const isSaved=()=>!!state.reading&&state.journal.some(r=>r.id===state.reading.id);

function header(){return `<a class="skip" href="#main">${t('skip')}</a><header class="site-header"><div class="wrap header-inner"><a class="brand" href="#reading" aria-label="Arcana">${icon('star').replace('btn-icon','brand-mark')}<span class="brand-name">ARCANA</span></a><span class="prototype-label">${t('prototype')}</span><nav class="header-nav" aria-label="${state.lang==='ru'?'Основная навигация':'Main navigation'}">${[['reading','readings'],['journal','journal'],['library','library']].map(([page,label])=>`<a class="nav-link" href="#${page}" ${state.page===page?'aria-current="page"':''}>${t(label)}</a>`).join('')}</nav><div class="language" role="group" aria-label="${t('language')}">${['ru','en'].map(lang=>`<button data-action="language" data-lang="${lang}" aria-label="${lang==='ru'?'Русский':'English'}" aria-pressed="${state.lang===lang}" lang="${lang}">${lang.toUpperCase()}</button>`).join('')}</div></div></header>`;}
function footer(){return `<footer class="site-footer"><div class="wrap footer-inner"><div><div class="footer-brand">ARCANA</div><p class="footer-copy">${t('footer')}</p></div><p class="footer-note">${t('footerNote')}</p><button class="text-button" data-action="about">${t('about')}</button></div></footer>`;}
function hero(){return `<section class="hero" aria-labelledby="hero-title"><div class="hero-copy"><p class="eyebrow">${t('eyebrow')}</p><h1 id="hero-title">${t('hero')}</h1><p>${t('heroText')}</p><div class="hero-actions"><button class="primary" data-action="start">${icon('star')}${t('heroButton')}</button><span class="hero-note">${t('heroNote')}</span></div></div><div class="hero-art" aria-hidden="true"><span class="hero-star">✧</span><div class="hero-card left">${art(CARD_BY_ID['major-moon'])}</div><div class="hero-card middle">${art(CARD_BY_ID['major-sun'])}</div><div class="hero-card right">${art(CARD_BY_ID['major-star'])}</div><span class="hero-star small">✧</span></div></section>`;}
function spreads(){return `<section class="spreads-section" id="spreads" aria-labelledby="spread-title"><div class="section-heading"><div><h2 id="spread-title">${t('spreadTitle')}</h2><p>${t('spreadText')}</p></div><div class="section-meta"><span>✧</span>${t('heroNote')}</div></div><div class="spread-grid" role="group" aria-label="${t('readings')}">${SPREADS.map(s=>`<button class="spread-option" data-action="spread" data-spread="${s.id}" aria-pressed="${s.id===state.spread}"><span class="spread-icon" aria-hidden="true">${'<span></span>'.repeat(s.count)}</span><span class="spread-badge ${s.demo?'demo':''}">${t(s.demo?'demo':'free')}</span><h3>${s[state.lang]}</h3><p>${local(s.hint,state.lang)}</p><div class="spread-count">${cardCount(s)}</div></button>`).join('')}</div></section>`;}
function setup(){return `<aside class="setup" aria-label="${state.lang==='ru'?'Настройки расклада':'Reading settings'}"><div class="segmented" role="group" aria-label="${t('modeLabel')}">${['digital','physical'].map(mode=>`<button data-action="mode" data-mode="${mode}" aria-pressed="${mode===state.mode}">${t(mode)}</button>`).join('')}</div><div class="field"><label for="topic">${t('topic')}</label><select id="topic" name="topic">${TOPICS.map(o=>`<option value="${o.id}" ${o.id===state.topic?'selected':''}>${o[state.lang]}</option>`).join('')}</select></div><div class="field"><label for="intent">${t('intent')}</label><select id="intent" name="intent">${INTENTS.map(o=>`<option value="${o.id}" ${o.id===state.intent?'selected':''}>${o[state.lang]}</option>`).join('')}</select></div><div class="field question-field"><label for="question">${t('question')}<span class="optional">${t('optional')}</span></label><textarea id="question" maxlength="500" placeholder="${t('questionPlaceholder')}" aria-describedby="question-privacy">${esc(state.question)}</textarea><p class="field-hint" id="question-privacy">${t('questionPrivacy')}</p></div>${state.mode==='digital'?`<label class="check"><input type="checkbox" id="reversals" ${state.reversals?'checked':''}>${t('reversals')}</label><button class="primary full" data-action="draw">${icon('star')}${t(state.reading?'newReading':'draw')}</button>`:`<p class="field-hint">${t('physicalText')}</p>`}<p class="setup-caption">${t('heroNote')}</p></aside>`;}
function cardVisual(chosen){return `<div class="card-visual ${chosen.reversed?'reversed':''}">${art(CARD_BY_ID[chosen.id])}</div>`;}
function stage(){
 const s=selectedSpread(),reading=state.reading;
 const classes=`reading-stage ${s.count>3?'many-cards':''} ${state.mode==='physical'&&!reading?'manual-stage':''}`;
 let body;
 if(reading){
  const all=state.revealed.size===reading.cards.length;
  body=`<h2 class="stage-heading">${t('resultTitle')}</h2><p class="stage-text">${all?`${s[state.lang]} · ${topicLabel(reading.topic)}`:t('revealHint')}</p><div class="stage-cards ${s.count===1?'single':''}">${reading.cards.map((c,i)=>{const open=state.revealed.has(i);return `<div class="card-slot"><span class="card-position">${s.roles[i][state.lang]}</span><button class="card-button ${open?'revealed':''}" data-action="reveal" data-index="${i}" ${open?'disabled':''} aria-label="${open?esc(local(CARD_BY_ID[c.id].name,state.lang)):t('reveal')+' · '+s.roles[i][state.lang]}">${open?cardVisual(c):cardBack()}</button>${open?`<span class="card-name">${local(CARD_BY_ID[c.id].name,state.lang)}</span><div class="orientation">${t(c.reversed?'reversed':'upright')}</div>`:''}</div>`;}).join('')}</div>${all?'':`<div class="reveal-actions"><button class="text-button" data-action="reveal-all">${t('revealAll')}</button><p class="progress">${t('revealed')}: ${state.revealed.size} ${t('of')} ${reading.cards.length}</p></div>`}`;
 }else if(state.mode==='physical'){
  body=`<h2 class="stage-heading">${t('physicalTitle')}</h2><p class="stage-text">${t('physicalText')}</p><div class="stage-cards ${s.count===1?'single':''}">${s.roles.map((role,i)=>{const c=state.manual[i];return `<div class="card-slot"><span class="card-position">${role[state.lang]}</span><button class="card-button" data-action="pick" data-index="${i}" aria-label="${t(c?'changeCard':'pickCard')} · ${role[state.lang]}">${c?cardVisual(c):`<span class="empty-card"><span>✧</span>${t('pickCard')}</span>`}</button>${c?`<span class="card-name">${local(CARD_BY_ID[c.id].name,state.lang)}</span><button class="orientation-button" data-action="flip" data-index="${i}" aria-label="${t('turnCard')} · ${role[state.lang]}" aria-pressed="${c.reversed}">${t(c.reversed?'reversed':'upright')}</button>`:''}</div>`;}).join('')}</div><button class="primary manual-submit" data-action="read-manual">${icon('book')}${t('manualRead')}</button>`;
 }else{
  body=`<div class="stage-decor" aria-hidden="true">✧</div><h2 class="stage-heading">${t('waitingTitle')}</h2><p class="stage-text">${t('waitingText')}</p><div class="stage-cards ${s.count===1?'single':''}">${s.roles.map(role=>`<div class="card-slot"><span class="card-position">${role[state.lang]}</span>${cardBack()}</div>`).join('')}</div>`;
 }
 return `<section class="${classes}" aria-label="${t('resultTitle')}">${s.demo?`<div class="demo-strip">✧ ${t('demoNote')}</div>`:''}${body}${state.error?`<p class="inline-error" role="alert">${t(state.error)}</p>`:''}</section>`;
}
function interpretation(){
 const r=state.reading;if(!r||state.revealed.size!==r.cards.length)return '';
 const result=interpretReading(r,state.lang);
 return `<section class="interpretation" id="result" aria-labelledby="result-title"><div class="result-heading"><div><h2 id="result-title">${t('resultTitle')}</h2><p class="result-meta">${date(r.created)} · ${topicLabel(r.topic)} · ${t(r.mode==='physical'?'physicalBadge':'digitalBadge')}</p></div>${icon('star')}</div>${r.question?`<p class="question-quote">${esc(r.question)}</p>`:''}${result.positions.map((p,i)=>`<article class="position-reading"><div class="position-kicker"><span>${esc(p.position)}</span><span>·</span><span>${t(p.chosen.reversed?'reversed':'upright')}</span></div><h3>${local(p.card.name,state.lang)}</h3><p>${esc(p.base)}</p><p class="theme-question">${esc(p.theme)}</p><details><summary>${t('details')}</summary><p>${esc(p.role)}</p></details></article>`).join('')}${result.connections.length?`<div class="connections"><h3>${t('connection')}</h3>${result.connections.map(c=>`<p>${esc(c)}</p>`).join('')}</div>`:''}<div class="reflection"><h3>${t('nextStep')}</h3><p>${esc(result.intent)}</p></div><div class="note-field"><label class="note-label" for="note">${t('note')}</label><textarea id="note" maxlength="3000" placeholder="${t('notePlaceholder')}">${esc(r.note||'')}</textarea></div><div class="result-actions"><button class="primary" data-action="save">${icon('save')}${t(isSaved()?'saveChanges':'save')}</button><button class="secondary" data-action="export-reading">${icon('download')}${t('download')}</button></div><p class="privacy-note">${icon('lock')}<span>${t('privateJournal')}</span></p><p class="draft-note">${t('draftNotice')}</p></section>`;
}
function readingPage(){return `${hero()}${spreads()}<div class="workspace">${setup()}<div class="reading-area">${stage()}${interpretation()}</div></div>`;}
function filteredCards(query,suit='all'){
 const q=query.trim().toLocaleLowerCase().replaceAll('ё','е');
 return CARDS.filter(c=>(suit==='all'||c.suit===suit)&&`${c.name.ru} ${c.name.en}`.toLocaleLowerCase().replaceAll('ё','е').includes(q));
}
function catalogueGrid(){const cards=filteredCards(state.query,state.suit);return cards.length?cards.map(c=>`<button class="catalogue-card" data-action="card-detail" data-card="${c.id}" aria-label="${local(c.name,state.lang)}">${art(c)}<strong>${local(c.name,state.lang)}</strong><small>${local(SUITS[c.suit],state.lang)}</small></button>`).join(''):`<p class="empty-results full-width">${t('noCards')}</p>`;}
function libraryPage(){return `<section class="page-intro"><p class="eyebrow">ARCANA · ${t('library').toUpperCase()}</p><h1>${t('libraryTitle')}</h1><p>${t('libraryText')}</p></section><div class="tools-row"><input type="search" id="library-search" aria-label="${t('search')}" placeholder="${t('searchPlaceholder')}" value="${esc(state.query)}"><select id="suit-filter" aria-label="${t('suitFilter')}"><option value="all">${t('allSuits')}</option>${Object.entries(SUITS).map(([id,s])=>`<option value="${id}" ${state.suit===id?'selected':''}>${s[state.lang]}</option>`).join('')}</select></div><div class="catalogue" id="catalogue-grid">${catalogueGrid()}</div>`;}
function journalPage(){return `<section class="page-intro"><p class="eyebrow">ARCANA · ${t('journal').toUpperCase()}</p><h1>${t('journalTitle')}</h1><p>${t('journalText')}</p></section>${state.journal.length?`<div class="journal-tools"><button class="secondary" data-action="export-journal">${icon('download')}${t('exportJournal')}</button><button class="text-button danger" data-action="clear-journal">${t('clearJournal')}</button></div><p class="privacy-note">${icon('lock')}<span>${t('privateJournal')}</span></p><div class="journal-grid">${state.journal.map(r=>`<article class="journal-entry"><div class="entry-top"><time datetime="${esc(r.created)}">${date(r.created)}</time><span>${topicLabel(r.topic)} · ${t(r.mode==='physical'?'physicalBadge':'digitalBadge')}</span></div><h2>${spreadById(r.spread)[state.lang]}</h2>${r.question?`<p class="entry-question">${esc(r.question)}</p>`:''}<div class="mini-cards" aria-label="${r.cards.map(c=>local(CARD_BY_ID[c.id].name,state.lang)).join(', ')}">${r.cards.map(c=>`<div class="${c.reversed?'card-visual reversed':''}">${art(CARD_BY_ID[c.id])}</div>`).join('')}</div>${r.note?`<p class="entry-note">${esc(r.note)}</p>`:''}<div class="entry-actions"><button class="text-button" data-action="open-reading" data-id="${esc(r.id)}">${t('openReading')}</button><button class="delete-button" data-action="delete-reading" data-id="${esc(r.id)}" aria-label="${t('delete')} · ${date(r.created)}">${icon('trash')}</button></div></article>`).join('')}</div>`:`<div class="empty"><span aria-hidden="true">✧</span><h2>${t('journalEmpty')}</h2><p>${t('journalEmptyText')}</p><a class="primary" href="#reading">${t('heroButton')}</a></div>`}`;}
function render(){
 document.documentElement.lang=state.lang;document.title=t('title');
 app.innerHTML=`${header()}<main id="main" class="wrap">${state.page==='library'?libraryPage():state.page==='journal'?journalPage():readingPage()}</main>${footer()}`;
}
function resetReading(){state.reading=null;state.revealed=new Set();state.error='';}
function notify(message,undo=false){
 const box=$('#toast');clearTimeout(notify.timer);box.innerHTML=`<span>${esc(message)}</span>${undo?`<button data-action="undo">${t('undo')}</button>`:''}`;box.classList.add('visible');notify.timer=setTimeout(()=>box.classList.remove('visible'),undo?12000:5500);
}
function persist(entries){try{localStorage.setItem(STORAGE,JSON.stringify(entries));state.journal=entries;return true;}catch{notify(t('storageError'));return false;}}
function makeReading(cards){return {id:globalThis.crypto.randomUUID(),created:new Date().toISOString(),spread:state.spread,topic:state.topic,intent:state.intent,mode:state.mode,question:state.question.trim(),note:'',cards:cards.map(c=>({...c})),version:CONTENT_VERSION};}
function showResult(){render();$('#result')?.scrollIntoView({behavior:motion(),block:'start'});}
function showModal(content){modal.innerHTML=`<div class="modal-inner"><button class="close-modal" data-action="close-modal" aria-label="${t('back')}">×</button>${content}</div>`;if(!modal.open)modal.showModal();}
function pickerGrid(){const chosen=new Set(state.manual.filter((c,i)=>c&&i!==state.pickerIndex).map(c=>c.id));const cards=filteredCards(state.pickerQuery);return cards.length?cards.map(c=>`<button class="picker-card" data-action="choose-card" data-card="${c.id}" ${chosen.has(c.id)?'disabled':''} aria-label="${esc(local(c.name,state.lang))}${chosen.has(c.id)?' · '+t('alreadyChosen'):''}">${art(c)}<span>${local(c.name,state.lang)}</span></button>`).join(''):`<p class="empty-results">${t('noCards')}</p>`;}
function openPicker(index){state.pickerIndex=index;state.pickerQuery='';showModal(`<h2 id="modal-title">${t('pickerTitle')}</h2><p>${t('pickerText')}</p><input class="picker-input" type="search" id="picker-search" aria-label="${t('search')}" placeholder="${t('searchPlaceholder')}"><div class="picker-grid" id="picker-grid">${pickerGrid()}</div>`);$('#picker-search').focus();}
function about(){showModal(`<div class="modal-symbol" aria-hidden="true">✧</div><h2 id="modal-title">${t('aboutTitle')}</h2><p>${t('aboutText')}</p><p>${t('aboutContent')}</p><p>${t('aboutPrivacy')}</p>`);}
function showCard(id){const c=CARD_BY_ID[id];if(!c)return;showModal(`<h2 id="modal-title">${local(c.name,state.lang)}</h2><div class="detail-layout"><div>${art(c)}</div><div class="detail-copy"><div class="detail-keywords">${local(c.keywords,state.lang)}</div><h3>${t('upright')}</h3><p>${local(c.upright,state.lang)}</p><h3>${t('reversed')}</h3><p>${local(c.reversed,state.lang)}</p></div></div><p class="draft-note">${t('draftNotice')}</p>`);}
function download(filename,text,type='text/plain;charset=utf-8'){const url=URL.createObjectURL(new Blob([text],{type}));const a=document.createElement('a');a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function readingText(r){const result=interpretReading(r,state.lang);return ['ARCANA',spreadById(r.spread)[state.lang],date(r.created),`${t('topic')}: ${topicLabel(r.topic)}`,r.question?`${t('question')}: ${r.question}`:'','',...result.positions.flatMap(p=>[`${p.position}: ${local(p.card.name,state.lang)} (${t(p.chosen.reversed?'reversed':'upright')})`,p.base,p.role,p.theme,'']),...result.connections,'',result.intent,'',r.note?`${t('note')}: ${r.note}`:'','',t('draftNotice')].filter(v=>v!==undefined).join('\n');}

document.addEventListener('click',event=>{
 const control=event.target.closest('[data-action]');if(!control||control.disabled)return;
 const action=control.dataset.action;
 if(action==='language'){
  state.lang=control.dataset.lang;try{localStorage.setItem(LANGUAGE,state.lang);}catch{}
  const u=new URL(location.href);u.searchParams.set('lang',state.lang);history.replaceState(null,'',u);
  if(modal.open)modal.close();render();return;
 }
 if(action==='start'){$('#spreads')?.scrollIntoView({behavior:motion(),block:'start'});return;}
 if(action==='spread'){
  const s=spreadById(control.dataset.spread);if(!s)return;
  if(s.demo){showModal(`<div class="modal-symbol" aria-hidden="true">✧</div><h2 id="modal-title">${t('demoTitle')}</h2><p>${t('demoText')}</p><div class="modal-actions"><button class="primary" data-action="try-demo" data-spread="${s.id}">${t('tryDemo')}</button><button class="secondary" data-action="close-modal">${t('cancel')}</button></div>`);return;}
  state.spread=s.id;state.manual=[];resetReading();render();return;
 }
 if(action==='try-demo'){state.spread=control.dataset.spread;state.manual=[];resetReading();modal.close();render();$('.workspace').scrollIntoView({behavior:motion(),block:'start'});return;}
 if(action==='mode'){if(state.mode===control.dataset.mode)return;state.mode=control.dataset.mode;state.manual=[];resetReading();render();return;}
 if(action==='draw'){
  try{state.reading=makeReading(drawCards(selectedSpread().count,state.reversals));state.revealed=new Set();state.error='';render();$('.reading-stage').scrollIntoView({behavior:motion(),block:'start'});}catch{state.error='randomError';render();}return;
 }
 if(action==='reveal'||action==='reveal-all'){
  if(!state.reading)return;
  if(action==='reveal-all')state.reading.cards.forEach((_,i)=>state.revealed.add(i));else state.revealed.add(Number(control.dataset.index));
  if(state.revealed.size===state.reading.cards.length)showResult();else{render();$(`button[data-action="reveal"][data-index="${state.revealed.size}"]`)?.focus({preventScroll:true});}return;
 }
 if(action==='pick'){openPicker(Number(control.dataset.index));return;}
 if(action==='choose-card'){
  if(!CARD_BY_ID[control.dataset.card]||state.manual.some((c,i)=>c?.id===control.dataset.card&&i!==state.pickerIndex))return;
  state.manual[state.pickerIndex]={id:control.dataset.card,reversed:state.manual[state.pickerIndex]?.reversed||false};state.error='';modal.close();render();$(`button[data-action="pick"][data-index="${state.pickerIndex}"]`)?.focus({preventScroll:true});return;
 }
 if(action==='flip'){const c=state.manual[Number(control.dataset.index)];if(c)c.reversed=!c.reversed;render();return;}
 if(action==='read-manual'){
  if(state.manual.filter(Boolean).length!==selectedSpread().count){state.error='missing';render();return;}
  const r=makeReading(state.manual),error=validateReading(r);if(error){state.error=error==='duplicate'?'duplicate':'missing';render();return;}
  state.reading=r;state.revealed=new Set(r.cards.map((_,i)=>i));state.error='';showResult();return;
 }
 if(action==='save'){
  if(!state.reading)return;const exists=isSaved();if(!exists&&state.journal.length>=100){notify(t('limitReached'));return;}
  const entries=exists?state.journal.map(r=>r.id===state.reading.id?structuredClone(state.reading):r):[structuredClone(state.reading),...state.journal];
  if(persist(entries)){notify(t('saved'));render();}return;
 }
 if(action==='open-reading'){
  const r=state.journal.find(v=>v.id===control.dataset.id);if(!r)return;
  state.reading=structuredClone(r);state.spread=r.spread;state.topic=r.topic;state.intent=r.intent;state.mode=r.mode;state.question=r.question;state.manual=r.cards.map(c=>({...c}));state.revealed=new Set(r.cards.map((_,i)=>i));state.error='';state.page='reading';
  if(location.hash!=='#reading')location.hash='reading';render();$('#result').scrollIntoView({behavior:motion(),block:'start'});return;
 }
 if(action==='delete-reading'){
  const id=control.dataset.id,r=state.journal.find(v=>v.id===id);if(!r)return;
  const index=state.journal.findIndex(v=>v.id===id);if(persist(state.journal.filter(v=>v.id!==id))){state.deleted={reading:r,index};render();notify(t('deleted'),true);}return;
 }
 if(action==='undo'){
  if(!state.deleted)return;const entries=[...state.journal];entries.splice(state.deleted.index,0,state.deleted.reading);if(persist(entries)){state.deleted=null;$('#toast').classList.remove('visible');render();}return;
 }
 if(action==='export-reading'){if(state.reading)download(`arcana-${state.reading.created.slice(0,10)}.txt`,readingText(state.reading));return;}
 if(action==='export-journal'){download(`arcana-journal-${new Date().toISOString().slice(0,10)}.json`,JSON.stringify({format:'arcana-journal',version:1,exported:new Date().toISOString(),readings:state.journal},null,2),'application/json;charset=utf-8');return;}
 if(action==='clear-journal'){showModal(`<h2 id="modal-title">${t('clearTitle')}</h2><p>${t('clearText')}</p><div class="modal-actions"><button class="primary" data-action="confirm-clear">${t('confirmClear')}</button><button class="secondary" data-action="close-modal">${t('cancel')}</button></div>`);return;}
 if(action==='confirm-clear'){if(persist([])){state.deleted=null;modal.close();render();}return;}
 if(action==='card-detail'){showCard(control.dataset.card);return;}
 if(action==='about'){about();return;}
 if(action==='close-modal'){modal.close();return;}
});
document.addEventListener('input',event=>{
 const e=event.target;
 if(e.id==='question')state.question=e.value;
 if(e.id==='note'&&state.reading)state.reading.note=e.value;
 if(e.id==='library-search'){state.query=e.value;$('#catalogue-grid').innerHTML=catalogueGrid();}
 if(e.id==='picker-search'){state.pickerQuery=e.value;$('#picker-grid').innerHTML=pickerGrid();}
});
document.addEventListener('change',event=>{
 const e=event.target;
 if(['topic','intent'].includes(e.id)){state[e.id]=e.value;resetReading();render();$(`#${e.id}`)?.focus({preventScroll:true});}
 if(e.id==='reversals')state.reversals=e.checked;
 if(e.id==='suit-filter'){state.suit=e.value;$('#catalogue-grid').innerHTML=catalogueGrid();}
});
window.addEventListener('hashchange',()=>{const next=['journal','library'].includes(location.hash.slice(1))?location.hash.slice(1):'reading';if(next!==state.page){state.page=next;render();window.scrollTo({top:0,behavior:'instant'});}});
modal.addEventListener('click',event=>{if(event.target===modal){const r=modal.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)modal.close();}});
render();
