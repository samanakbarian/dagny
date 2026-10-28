import type { DialogDef } from '../types';

/** Finds: the sword upgrades, life and magic containers and the näverdockor. */
export const FOREMAL: Record<string, DialogDef> = {
  hittade_solsten: { pages: ['Dagny hittade SOLSTENEN! Mot dimman lyser den som om solen satt inuti.'] },
  hittade_ronnkvist: { pages: ['Dagny bröt en RÖNNKVIST! Bären är röda som glöd.'] },
  hittade_fjader: { pages: ['Dagny hittade ÄRLANS FJÄDER! Den väger nästan ingenting.'] },
  hittade_askvigg: { pages: ['Dagny hittade ÅSKVIGGEN! Det pirrar i fingrarna.'] },

  holm_tips_malm: {
    speaker: 'Smeden Holm',
    pages: ['Klingan är mjuk efter alla år i en korg. Ge mig en klump järnmalm från gamla gruvan, så härdar jag den.'],
  },

  holm_hardar: {
    speaker: 'Smeden Holm',
    pages: [
      'Malmen! Ge mig klingan.',
      'Rött i ässjan, svart i vattnet. Så. Känn hur den biter.',
    ],
    actions: [{ type: 'takeItem', item: 'malm' }, { type: 'flag', flag: 'malm_klar' }, { type: 'giveItem', item: 'klingaHardad' }],
    next: 'fick_klingaHardad',
  },

  fick_klingaHardad: {
    pages: ['Klingan är HÄRDAD!\nSvärdet gör 1 mer i skada.'],
  },

  holm_tips_askstenen: {
    speaker: 'Smeden Holm',
    pages: ['Blixten slår ner i fyren ute i skären. Där den slår blir stenen till glas. Med en sådan åsksten kan jag slipa eggen.'],
  },

  holm_slipar: {
    speaker: 'Smeden Holm',
    pages: [
      'En åsksten! Den är fortfarande varm.',
      'Hör hur det knastrar mot eggen. Där. Akta fingrarna.',
    ],
    actions: [{ type: 'takeItem', item: 'askstenen' }, { type: 'flag', flag: 'askstenen_klar' }, { type: 'giveItem', item: 'klingaBlank' }],
    next: 'fick_klingaBlank',
  },

  fick_klingaBlank: {
    pages: ['Klingan är ÅSKSLIPAD!\nSvärdet gör 1 mer i skada.'],
  },

  hittade_malm: {
    pages: ['Dagny hittade en klump JÄRNMALM. Smeden Holm i Bruksorten kan använda den.'],
  },

  hittade_askstenen: {
    pages: ['Dagny hittade ÅSKSTENEN! Där blixten slog är stenen glaserad och varm.'],
  },

  hittade_silverbeslag: {
    pages: ['Bakom en sten blänker Grå-Pelles silver. Ett beslag som passar runt kläppen.', 'Dagny fäster SILVERBESLAGET på klingan.\nSvärdet gör 1 mer i skada. Väsen ryggar för silver.'],
  },

  fick_livbehallare: {
    pages: ['Dagny hittade en LIVBEHÅLLARE!\nHennes liv räcker lite längre nu.'],
  },

  fick_naverdocka: {
    pages: [
      'Dagny hittade en NÄVERDOCKA!\nFlätad av björknäver, med en röd snibb.',
      'En näverdocka håller ett liv åt den som bär den.\n(+1 liv. Fler dockor finns gömda här och där.)',
    ],
  },

  fick_magibehallare: {
    pages: ['Dagny hittade en MAGIBEHÅLLARE!\nHon orkar läsa lite fler läsningar nu.'],
  },
};
