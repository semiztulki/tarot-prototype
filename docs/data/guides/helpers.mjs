// Original bilingual commentary. A Waite label is used only for an explanation
// actually made in the cited book; visual readings remain explicitly editorial.
export const bilingual=(ru,en)=>({ru,en});
export const symbol=(icon,ruTitle,enTitle,ruText,enText,basis='interpretation',sourceSection=2)=>({icon,title:bilingual(ruTitle,enTitle),text:bilingual(ruText,enText),basis,sourceSection});
export const entry=(ruScene,enScene,ruUpright,enUpright,ruReversed,enReversed,symbols)=>({scene:bilingual(ruScene,enScene),upright:bilingual(ruUpright,enUpright),reversed:bilingual(ruReversed,enReversed),symbols});
