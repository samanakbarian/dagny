import type { DialogDef } from '../types';

/** Temple 6: Fäbodskogen, Skogsrået and the näverlur. */
export const FABODSKOGEN: Record<string, DialogDef> = {
  fabod_skylt1: {
    pages: ['En handmålad skylt på en gärdesgård:\n"TILL FÄBODEN. FÖLJ DET RÖDA BANDET. LITA INTE PÅ LJUSEN."'],
  },

  villse: {
    pages: ['Stigen slingrar sig... och leder tillbaka dit Dagny började. Det fnissar mellan granarna.'],
  },

  villse2: {
    pages: ['Irrblosset slocknar. Dagny står vid ljusstaken igen.'],
  },

  skogsra_vaknar: {
    speaker: 'Skogsrået',
    pages: ['Ingen vallar korna här längre. Fäbodarna ruttnar, som min rygg. Kom närmare.'],
  },

  skogsra_forlikad: {
    speaker: 'Skogsrået',
    pages: [
      'Du såg min rygg och vände inte om.',
      'Hon satt här på vallen den sista sommaren och vävde en näverfilt. Den blev aldrig klar.',
      'Ta luren. Blås, så kommer de du har förlikat.',
    ],
  },

  fick_naverlur: {
    pages: [
      'Dagny fick NÄVERLUREN!\nHåll NER och tryck MAGI, så kommer en vätte och hjälper dig en stund.',
      'Någon kular på vallen. Dimman lättar.',
      'En gammal stig går österut från vallen, upp mot Trollberget. Berget öppnar sig när alla sex platser har vaknat.',
    ],
    actions: [{ type: 'flag', flag: 'fabodskogen_klar' }],
  },

  lur_blast: {
    pages: ['Näverluren ljuder! En vätte kommer springande.'],
  },

  lur_vila: {
    pages: ['Vättarna vilar. Vänta en stund.'],
  },
};
