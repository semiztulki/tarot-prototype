import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {CARDS} from '../docs/data/catalog.mjs';
import {CARD_GUIDES,GUIDE_VERSION,searchLibraryCards} from '../docs/data/card-guides.mjs';
import {SYMBOL_ICON_NAMES,symbolIcon} from '../docs/symbol-icons.mjs';

const ids=cards=>cards.map(c=>c.id);
test('the illustrated library covers the complete deck in both languages without fallback text',()=>{
 assert.deepEqual(Object.keys(CARD_GUIDES).sort(),ids(CARDS).sort());
 for(const lang of ['ru','en']){
  const scenes=new Set();
  for(const card of CARDS){
   const g=CARD_GUIDES[card.id];
   for(const field of ['scene','upright','reversed']){
    assert.equal(typeof g[field][lang],'string',`${card.id}.${field}.${lang}`);
    assert.ok(g[field][lang].trim().length>55,`${card.id}.${field}.${lang}`);
    assert.doesNotMatch(g[field][lang],/TODO|TBD|undefined|lorem ipsum/i);
   }
   scenes.add(g.scene[lang]);
  }
  assert.equal(scenes.size,78,`individual scenes in ${lang}`);
 }
});
test('every symbol has bilingual text, a real local icon and an explicit attribution',()=>{
 const bases=new Set();let count=0;
 for(const [id,g] of Object.entries(CARD_GUIDES)){
  assert.ok(g.symbols.length>=3,id);
  for(const lang of ['ru','en'])assert.equal(new Set(g.symbols.map(s=>s.title[lang])).size,g.symbols.length,id);
  for(const s of g.symbols){
   count++;bases.add(s.basis);
   assert.ok(['waite','interpretation'].includes(s.basis),id);
   assert.ok(SYMBOL_ICON_NAMES.includes(s.icon),`${id}.${s.icon}`);
   for(const lang of ['ru','en']){assert.ok(s.title[lang]?.length>2,id);assert.ok(s.text[lang]?.length>35,id);}
  }
 }
 assert.equal(count,236);assert.deepEqual([...bases].sort(),['interpretation','waite']);
 for(const name of SYMBOL_ICON_NAMES){const svg=symbolIcon(name);assert.match(svg,/aria-hidden="true"/);assert.match(svg,/<(?:path|circle|ellipse|rect) /);assert.doesNotMatch(svg,/<script|https?:|<image|<use/i);}
});
test('the symbol sources identify the correct book part and the Fool’s additional section',()=>{
 const registry=JSON.parse(readFileSync(new URL('../docs/data/sources.json',import.meta.url),'utf8'));
 assert.equal(registry.library_revision,GUIDE_VERSION);
 for(const [id,g] of Object.entries(CARD_GUIDES)){
  assert.equal(g.source.id,'waite-pictorial-key-1922');
  assert.equal(g.source.part,id.startsWith('major-')?2:3);
  assert.equal(g.source.section,2);
  assert.equal(g.source.url,`https://en.wikisource.org/wiki/The_Pictorial_Key_to_the_Tarot/Part_${g.source.part}`);
 }
 assert.equal(CARD_GUIDES['major-fool'].symbols.find(s=>s.icon==='bag').sourceSection,3);
});
test('symbol search finds a card without its name and applies suit and combined-term filters',()=>{
 assert.ok(ids(searchLibraryCards(CARDS,'гранат')).includes('major-priestess'));
 assert.ok(ids(searchLibraryCards(CARDS,'рыба')).includes('cups-11'));
 assert.ok(ids(searchLibraryCards(CARDS,'scales')).includes('pentacles-6'));
 assert.ok(ids(searchLibraryCards(CARDS,'весы')).includes('major-justice'));
 assert.equal(searchLibraryCards(CARDS,'весы','cups').length,0);
 assert.ok(ids(searchLibraryCards(CARDS,'white rose')).includes('major-fool'));
 assert.equal(searchLibraryCards(CARDS,'white rose','swords').length,0);
 assert.equal(searchLibraryCards(CARDS,'нет-такого-символа-92847').length,0);
 assert.equal(searchLibraryCards(CARDS,'','wands').length,14);
 assert.equal(searchLibraryCards(CARDS,'   ').length,78);
});
test('library search keeps bilingual names and normalizes case, spacing and Russian ё',()=>{
 assert.ok(ids(searchLibraryCards(CARDS,'The High Priestess')).includes('major-priestess'));
 assert.deepEqual(ids(searchLibraryCards(CARDS,'  РЫБА  ')),ids(searchLibraryCards(CARDS,'рыба')));
 assert.deepEqual(ids(searchLibraryCards(CARDS,'Четвёрка Жезлов')),ids(searchLibraryCards(CARDS,'четверка жезлов')));
 assert.ok(ids(searchLibraryCards(CARDS,'Верховная Жрица')).includes('major-priestess'));
});
