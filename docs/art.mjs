// Historical RWS (Pamela-A, 1910) scans, cached locally.
// The per-file public-domain records and hashes are in data/rws-images.json.
export function art(card){
 return `<img class="card-art rws-card suit-${card.suit}" src="${card.image.path}" alt="" width="${card.image.width}" height="${card.image.height}" loading="lazy" decoding="async">`;
}
export function cardBack(){return `<svg preserveAspectRatio="none" class="card-back" viewBox="0 0 200 290" aria-hidden="true" focusable="false"><rect x="2" y="2" width="196" height="286" rx="14" fill="currentColor"/><g fill="none" stroke="#d9bc91" stroke-width="1.2"><rect x="12" y="12" width="176" height="266" rx="9"/><rect x="23" y="23" width="154" height="244" rx="5"/><ellipse cx="100" cy="145" rx="52" ry="88"/><ellipse cx="100" cy="145" rx="31" ry="88"/><circle cx="100" cy="145" r="52"/><path d="m100 104 10 30 31 11-31 10-10 31-10-31-31-10 31-11 10-30ZM100 37v28m0 160v28M43 70l18 18m78 114 18 18M43 220l18-18m78-114 18-18"/><circle cx="100" cy="145" r="8"/></g></svg>`;}
