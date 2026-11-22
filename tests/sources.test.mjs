import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {CARDS,CONTENT_VERSION} from '../docs/data/catalog.mjs';
import {WAITE_MEANINGS} from '../docs/data/waite-meanings.mjs';

const root=new URL('../docs/',import.meta.url);
const images=JSON.parse(readFileSync(new URL('data/rws-images.json',root),'utf8')).cards;
test('all 78 base records point to an identifiable edition and both orientation references',()=>{
 assert.equal(Object.keys(WAITE_MEANINGS).length,78);
 for(const c of CARDS){
  assert.equal(c.source.id,'waite-pictorial-key-1922');
  assert.equal(c.source.kind,'modernised-summary');
  for(const orientation of ['upright','reversed']){
   assert.ok(c.source[orientation].length>0,c.id);
   for(const page of c.source[orientation]){assert.match(page.printed,/^\d+$/);assert.ok(page.scan>0);assert.match(page.url,/^https:\/\/en\.wikisource\.org\/wiki\/Page:The_Pictorial_Key_to_the_Tarot\.pdf\/\d+$/);}
  }
 }
 assert.equal(CONTENT_VERSION,'rws-waite-1922-0.2');
});
test('every selected historical image is public-domain labelled, present and unchanged locally',()=>{
 assert.equal(Object.keys(images).length,78);const hashes=new Set();
 for(const c of CARDS){
  const meta=images[c.id];assert.ok(meta,c.id);assert.equal(meta.license,'Public domain');assert.equal(meta.author,'Pamela Colman Smith');
  assert.equal(c.image.path,meta.path);assert.equal(c.artSource,meta.source_page);
  assert.ok(meta.width<=360&&meta.height<=640);
  const file=new URL(meta.path,root);assert.ok(existsSync(file),c.id);
  const bytes=readFileSync(file);assert.equal(bytes.toString('ascii',8,12),'WEBP');
  assert.equal(createHash('sha256').update(bytes).digest('hex'),meta.sha256,c.id);hashes.add(meta.sha256);
 }
 assert.equal(hashes.size,78);
});
test('the RWS ordering and the supplementary Two of Cups exception remain explicit',()=>{
 assert.equal(CARDS.find(c=>c.id==='major-strength').rank,8);
 assert.equal(CARDS.find(c=>c.id==='major-justice').rank,11);
 const two=CARDS.find(c=>c.id==='cups-2');assert.equal(two.source.reversedSection,4);assert.equal(two.source.reversed[0].printed,'290');assert.equal(two.source.reversed[0].scan,303);
 assert.ok(two.source.note.ru&&two.source.note.en);
});
