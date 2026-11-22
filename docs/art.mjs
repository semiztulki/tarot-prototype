// Original geometric artwork; no external deck images or fonts are requested.
const stars='<path d="M100 60v18m-9-9h18M49 109v10m-5-5h10M154 100v12m-6-6h12"/>';
const sun='<circle cx="100" cy="135" r="35"/><circle cx="100" cy="135" r="26"/><path d="M100 82v-14m0 120v14m-53-67H33m134 0h-14M62 97l-10-10m96 96-10-10m0-76 10-10m-96 96 10-10"/><path d="M88 137q12 13 24 0"/><path d="M86 125h3m22 0h3"/>';
const moon='<path d="M115 88a49 49 0 1 0 27 84 46 46 0 0 1-27-84Z"/><path d="m57 205 23-27 21 27 22-19 25 19"/>';
const star='<path d="m100 92 11 29 32 2-25 20 8 31-26-18-26 18 8-31-25-20 32-2Z"/><path d="M54 205q24-20 46 0t46 0M61 216q20-14 39 0t39 0"/>';
const leaf='<path d="M100 200V98m0 35q-36 0-32-28 30 0 32 28Zm0 26q36 0 32-28-30 0-32 28Zm0 26q-36 0-32-28 30 0 32 28Z"/>';
const eye='<path d="M49 142q51-56 102 0-51 56-102 0Z"/><circle cx="100" cy="142" r="18"/><circle cx="100" cy="142" r="6"/><path d="M100 94V81m-34 29-10-10m78 10 10-10M100 190v13"/>';
const door='<path d="M64 211V127a36 36 0 0 1 72 0v84M77 211v-83a23 23 0 0 1 46 0v83M51 211h98M63 198h74M65 185h70"/><circle cx="100" cy="146" r="8"/>';
const cup='<path d="M75 115h50q0 35-25 35-25 0-25-35Zm25 35v32m-16 0h32M75 121H63q0 20 19 20m43-20h12q0 20-19 20"/>';
const sword='<path d="m100 99 9 17-9 48-9-48 9-17Zm-23 67h46m-23-2v28m-9 0h18"/>';
const wand='<path d="M100 194V105m0 31q-22-3-22-21 22 0 22 21Zm0 24q22-3 22-21-22 0-22 21Z"/><circle cx="100" cy="99" r="6"/>';
const coin='<circle cx="100" cy="145" r="31"/><circle cx="100" cy="145" r="25"/><path d="m100 123 6 16 17 1-13 11 4 17-14-10-14 10 4-17-13-11 17-1Z"/>';
const scales='<path d="M100 106v90m-20 0h40M63 121h74M71 121l-18 35h36l-18-35Zm58 0-18 35h36l-18-35Z"/><circle cx="100" cy="102" r="6"/>';
const mountain='<path d="m43 204 42-78 23 43 16-28 36 63H43Zm28-51 14 10 14-10"/><circle cx="116" cy="100" r="17"/>';
const wheel='<circle cx="100" cy="145" r="43"/><circle cx="100" cy="145" r="27"/><path d="M100 102v86m-43-43h86m-73-30 60 60m0-60-60 60"/>';
const heart='<path d="M100 180 65 146q-24-29 4-38 18-6 31 12 13-18 31-12 28 9 4 38l-35 34Z"/>';
const artById={fool:mountain,magician:wand,priestess:moon,empress:leaf,emperor:door,hierophant:door,lovers:heart,chariot:mountain,strength:leaf,hermit:star,wheel,justice:scales,hanged:eye,death:leaf,temperance:cup,devil:eye,tower:door,star,moon,sun,judgement:sun,world:wheel};
export function art(card){
 const body=card.suit==='major'?artById[card.id.replace('major-','')]:({wands:wand,cups:cup,swords:sword,pentacles:coin})[card.suit];
 const rank=card.suit==='major'?['0','I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV','XVI','XVII','XVIII','XIX','XX','XXI'][card.rank]:String(card.rank);
 return `<svg class="card-art suit-${card.suit}" viewBox="0 0 200 290" aria-hidden="true" focusable="false"><rect class="card-paper" x="2" y="2" width="196" height="286" rx="14"/><g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="12" y="12" width="176" height="266" rx="9"/><path d="M27 88V41h32m82 0h32v47M27 208v39h32m82 0h32v-39"/>${stars}${body}<path d="m93 241 7-7 7 7-7 7-7-7Z"/></g><text x="100" y="43" text-anchor="middle" fill="currentColor" font-family="Georgia,serif" font-size="14">${rank}</text></svg>`;
}
export function cardBack(){return `<svg class="card-back" viewBox="0 0 200 290" aria-hidden="true" focusable="false"><rect x="2" y="2" width="196" height="286" rx="14" fill="currentColor"/><g fill="none" stroke="#d9bc91" stroke-width="1.2"><rect x="12" y="12" width="176" height="266" rx="9"/><rect x="23" y="23" width="154" height="244" rx="5"/><ellipse cx="100" cy="145" rx="52" ry="88"/><ellipse cx="100" cy="145" rx="31" ry="88"/><circle cx="100" cy="145" r="52"/><path d="m100 104 10 30 31 11-31 10-10 31-10-31-31-10 31-11 10-30ZM100 37v28m0 160v28M43 70l18 18m78 114 18 18M43 220l18-18m78-114 18-18"/><circle cx="100" cy="145" r="8"/></g></svg>`;}
