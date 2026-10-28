import type { DialogDef } from '../types';

/** Shared by every temple and creature. */
export const ALLMANT: Record<string, DialogDef> = {
  dorr_last: {
    pages: ['Uppgången är stängd. Något väntar fortfarande vid altaret.'],
  },

  nyckel_saknas: {
    pages: ['Dörren är låst.'],
  },

  boss_vaknar: {
    pages: ['Marken skälver. Något gammalt vaknar.'],
  },

  boss_forlikad: {
    pages: ['Väsendet suckar, som efter en lång dröm, och sjunker ner i marken.'],
  },
};
