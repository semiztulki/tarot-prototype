import test from 'node:test';
import assert from 'node:assert/strict';
import {CARDS,TOPICS,INTENTS,SPREADS} from '../docs/data/catalog.mjs';
import {UI} from '../docs/i18n.mjs';
import {drawCards,randomInt,interpretReading,validateReading,loadJournal} from '../docs/engine.mjs';
const reading=(cards,extra={})=>({id:'sample',created:'2026-11-22T12:00:00Z',spread:cards.length===1?'one':cards.length===3?'three':cards.length===5?'situation':'choice',topic:'general',intent:'reflection',mode:'physical',cards,...extra});
test('the full deck has 78 stable unique IDs and both orientations in both languages',()=>{
 assert.equal(CARDS.length,78);assert.equal(new Set(CARDS.map(c=>c.id)).size,78);
 assert.equal(CARDS.filter(c=>c.suit==='major').length,22);
 for(const c of CARDS)for(const lang of ['ru','en'])for(const field of ['name','upright','reversed'])assert.ok(c[field][lang]?.length>2,`${c.id}.${field}.${lang}`);
});
test('every card, orientation, theme and intention produces complete bilingual content',()=>{
 for(const c of CARDS)for(const reversed of [false,true])for(const topic of TOPICS)for(const intent of INTENTS)for(const lang of ['ru','en']){
  const r=interpretReading(reading([{id:c.id,reversed}],{topic:topic.id,intent:intent.id}),lang);
  assert.equal(r.positions.length,1);for(const key of ['base','theme','role'])assert.ok(r.positions[0][key]?.length>15,`${c.id}.${topic.id}.${key}`);
  assert.equal(r.positions[0].base,c[reversed?'reversed':'upright'][lang]);
 }
});
test('spreads assign the right number of distinct position roles',()=>{
 for(const s of SPREADS){assert.equal(s.roles.length,s.count);assert.equal(new Set(s.roles.map(p=>p.id)).size,s.count);const r=reading(CARDS.slice(0,s.count).map(c=>({id:c.id,reversed:false})),{spread:s.id});assert.equal(validateReading(r),null);assert.equal(interpretReading(r).positions.length,s.count);}
});
test('shuffling never repeats a card and only includes reversals when enabled',()=>{
 for(let i=0;i<150;i++){for(const enabled of [false,true]){const c=drawCards(78,enabled);assert.equal(new Set(c.map(x=>x.id)).size,78);if(!enabled)assert.ok(c.every(x=>!x.reversed));}}
 assert.throws(()=>drawCards(79),RangeError);
});
test('random integer rejection avoids modulo bias at the boundary',()=>{
 let calls=0;const source={getRandomValues(buffer){buffer[0]=calls++===0?0xffffffff:7;return buffer;}};
 assert.equal(randomInt(10,source),7);assert.equal(calls,2);
});
test('invalid or duplicated manually selected cards are rejected',()=>{
 assert.equal(validateReading(reading([{id:'major-sun',reversed:false},{id:'major-sun',reversed:false},{id:'major-star',reversed:false}])),'duplicate');
 assert.equal(validateReading(reading([{id:'not-a-card',reversed:false}])),'card');
 assert.equal(validateReading(reading([{id:'major-sun',reversed:'false'}])),'card');
 assert.equal(validateReading(reading([{id:'major-sun',reversed:false}],{topic:'arbitrary'})),'context');
 assert.throws(()=>interpretReading(reading([{id:'not-a-card',reversed:false}])));
});
test('a language switch keeps the same cards and orientation',()=>{
 const r=reading([{id:'major-moon',reversed:true},{id:'cups-2',reversed:false},{id:'major-sun',reversed:false}],{topic:'love'}),before=JSON.stringify(r);
 const ru=interpretReading(r,'ru'),en=interpretReading(r,'en');assert.equal(JSON.stringify(r),before);assert.equal(ru.positions[0].card.id,en.positions[0].card.id);assert.notEqual(ru.positions[0].base,en.positions[0].base);
});
test('special pair rules do not silently apply an upright message to a reversed pair',()=>{
 const cards=[{id:'major-moon',reversed:false},{id:'major-sun',reversed:false},{id:'cups-2',reversed:false}];
 assert.match(interpretReading(reading(cards),'en').connections.join(' '),/Moon and the Sun/);
 cards[0].reversed=true;assert.doesNotMatch(interpretReading(reading(cards),'en').connections.join(' '),/Moon and the Sun/);
});
test('corrupted storage cannot crash the journal and invalid records are excluded',()=>{
 assert.deepEqual(loadJournal('{broken'),[]);assert.deepEqual(loadJournal('{}'),[]);assert.deepEqual(loadJournal('null'),[]);
 const good=reading([{id:'major-sun',reversed:false}],{question:'x'.repeat(900),note:'n'.repeat(4000),unexpected:'discard me'});
 const loaded=loadJournal(JSON.stringify([null,{cards:[]},good]));assert.equal(loaded.length,1);assert.equal(loaded[0].question.length,500);assert.equal(loaded[0].note.length,3000);assert.equal(loaded[0].unexpected,undefined);
});
test('Russian and English interfaces have the same translation keys',()=>{
 assert.deepEqual(Object.keys(UI.ru).sort(),Object.keys(UI.en).sort());
 for(const value of Object.values(UI.en))assert.equal(typeof value,'string');
});
