import {MAJOR_GUIDES} from './guides/major.mjs';
import {WANDS_GUIDES} from './guides/wands.mjs';
import {CUPS_GUIDES} from './guides/cups.mjs';
import {SWORDS_GUIDES} from './guides/swords.mjs';
import {PENTACLES_GUIDES} from './guides/pentacles.mjs';

// Versioned independently: these guides do not replace the reading engine's
// historical meanings or alter saved readings and their content revision.
export const GUIDE_VERSION='rws-illustrated-guide-1.0';
const raw={...MAJOR_GUIDES,...WANDS_GUIDES,...CUPS_GUIDES,...SWORDS_GUIDES,...PENTACLES_GUIDES};
export const CARD_GUIDES=Object.fromEntries(Object.entries(raw).map(([id,guide])=>{
 const part=id.startsWith('major-')?2:3;
 return [id,{...guide,source:{id:'waite-pictorial-key-1922',part,section:2,url:`https://en.wikisource.org/wiki/The_Pictorial_Key_to_the_Tarot/Part_${part}`}}];
}));

const normalize=text=>String(text??'').normalize('NFKC').toLocaleLowerCase().replaceAll('ё','е');
const guideText=Object.fromEntries(Object.entries(CARD_GUIDES).map(([id,g])=>[id,normalize([
 ...Object.values(g.scene),...Object.values(g.upright),...Object.values(g.reversed),
 ...g.symbols.flatMap(s=>[...Object.values(s.title),...Object.values(s.text)])
].join(' '))]));

// Search is bilingual regardless of the interface language. The physical-deck
// picker continues to search names only, so long commentary cannot obscure it.
export function searchLibraryCards(cards,query='',suit='all'){
 const terms=normalize(query).trim().split(/\s+/).filter(Boolean);
 return cards.filter(c=>{
  if(suit!=='all'&&c.suit!==suit)return false;
  const haystack=normalize(`${c.name.ru} ${c.name.en} ${c.keywords.ru} ${c.keywords.en}`)+' '+(guideText[c.id]||'');
  return terms.every(term=>haystack.includes(term));
 });
}
