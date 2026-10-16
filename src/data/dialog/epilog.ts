import type { DialogDef } from '../types';

/** The epilogue: midsummer eve in Mormors by, a year later. */
export const EPILOG: Record<string, DialogDef> = {
  epilog_intro: {
    pages: ['Midsommarafton, ett år senare. Hela byn har kommit ut på vägen. Någon har rest en majstång mitt i byn.'],
  },

  hulda_epilog: {
    speaker: 'Mormor Hulda',
    pages: [
      'Där är du ju! Kom hit med dig. Jag hälsade på vid klockstapeln i morse. Det låg färska blommor där.',
      'Dagmar vävde aldrig klart filten. Så jag gjorde det i vintras, med din hjälp. Den hänger över din säng nu.',
      'Varje midsommar ska vi tända ljusen på de sju platserna. Så glömmer ingen igen.',
      'Du är Väktare nu, Dagny. Den första på arton år. Din mamma skulle ha varit så stolt. Hon kommer att bli det.',
      'Gå nu och dansa. Det är midsommar, och sommaren är ljus igen.',
    ],
    choices: [
      { text: 'Dansa runt stången', actions: [{ type: 'scene', scene: 'credits' }] },
      { text: 'Inte än', next: 'hulda_epilog_vanta' },
    ],
  },

  hulda_epilog_vanta: {
    speaker: 'Mormor Hulda',
    pages: ['Gå runt och hälsa på gästerna du, så väntar jag här. Dansen börjar när du vill.'],
  },

  sven_epilog: {
    speaker: 'Sven',
    pages: ['Jag har sett många midsomrar, Dagny. Men ingen där solen kändes som den gör i år.'],
  },

  karin_epilog: {
    speaker: 'Karin',
    pages: ['Murre har inte smitit en enda gång sedan i fjol. Han vet var han har det bra. Det vet vi alla nu.'],
  },

  maj_epilog: {
    speaker: 'Maj',
    pages: ['Vi tog bussen från Gruvsamhället hela vägen hit! Elin hälsar. Hon säger att lampan i gruvan lyser av sig själv om nätterna.'],
  },

  anders_epilog: {
    speaker: 'Anders',
    pages: ['Fickuret går fortfarande. Jag ställde det på midsommar, så det alltid ska påminna mig om dig.'],
  },

  olle_epilog: {
    speaker: 'Olle',
    pages: ['Radion spelar bara dansband nu! Inget brus alls. Ibland hör jag en fiol långt bakom musiken, men den låter glad.'],
  },

  greta_epilog: {
    speaker: 'Greta',
    pages: ['Jag har bakat sju sorters kakor, en för varje plats. Ta en med kanel, det är den för Trollberget.'],
    actions: [{ type: 'heal' }],
  },

  murre_epilog: {
    pages: ['Murre har en blomkrans runt halsen. Han ser inte glad ut över den. Men han spinner ändå.'],
  },

  vatte_epilog: {
    speaker: 'Vätten',
    pages: ['Blås inte i luren i dag, Väktare. I dag kommer vi ändå. Vi har aldrig sett en majstång så nära förut!'],
  },
};
