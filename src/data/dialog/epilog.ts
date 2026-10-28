import type { DialogDef } from '../types';

/** The epilogue: midsummer eve in Mormors by, a year later. */
export const EPILOG: Record<string, DialogDef> = {
  epilog_intro: {
    pages: ['Midsommarafton, ett år senare. Mitt i byn står en majstång.'],
  },

  // Dagmar's greeting reaches Hulda without a word: the notebook, if Dagny found it.
  hulda_halsning_bok: {
    pages: [
      'Dagny lägger anteckningsboken från Väktarkammaren i Huldas händer, uppslagen på sista sidan.',
      'Hulda läser länge. Sedan håller hon boken mot bröstet.',
    ],
    next: 'hulda_halsning_svar',
  },
  hulda_halsning: {
    pages: ['Dagny tar Huldas händer och håller dem länge.'],
    next: 'hulda_halsning_svar',
  },
  hulda_halsning_svar: {
    speaker: 'Mormor Hulda',
    pages: [
      'Hon hälsade. Jag ser det på dig.',
    ],
    actions: [{ type: 'flag', flag: 'hulda_halsad' }],
    next: 'hulda_epilog',
  },

  hulda_epilog: {
    speaker: 'Mormor Hulda',
    pages: [
      'I morse låg det färska blommor vid klockstapeln.',
      'Filten har vi vävt klart. Den hänger över din säng.',
      'Varje midsommar tänder vi ljusen på de sju platserna.',
      'Du är Väktare nu, Dagny. Din mamma är stolt. En dag får hon säga det själv.',
      'Gå och dansa.',
    ],
    choices: [
      { text: 'Dansa runt stången', actions: [{ type: 'scene', scene: 'credits' }] },
      { text: 'Inte än', next: 'hulda_epilog_vanta' },
    ],
  },

  hulda_epilog_vanta: {
    speaker: 'Mormor Hulda',
    pages: ['Hälsa på gästerna. Jag väntar här.'],
  },

  sven_epilog: {
    speaker: 'Sven',
    pages: ['Jag har sett många midsomrar. Ingen så ljus som den här.'],
  },

  karin_epilog: {
    speaker: 'Karin',
    pages: ['Murre har inte smitit en enda gång sedan i fjol.'],
  },

  maj_epilog: {
    speaker: 'Maj',
    pages: ['Vi tog bussen från Gruvsamhället! Elin hälsar. Hon säger att lampan i gruvan lyser av sig själv om nätterna.'],
  },

  anders_epilog: {
    speaker: 'Anders',
    pages: ['Fickuret går fortfarande.'],
  },

  olle_epilog: {
    speaker: 'Olle',
    pages: ['Radion spelar bara dansband nu. Ibland hör jag en fiol långt bakom musiken.'],
  },

  greta_epilog: {
    speaker: 'Greta',
    pages: ['Sju sorters kakor, en för varje plats. Ta en med kanel. Den är för Trollberget.'],
    actions: [{ type: 'heal' }],
  },

  murre_epilog: {
    pages: ['Murre har en blomkrans runt halsen. Han ser inte glad ut. Men han spinner.'],
  },

  vatte_epilog: {
    speaker: 'Vätten',
    pages: ['Blås inte i luren i dag, Väktare. Vi kommer ändå!'],
  },
};
