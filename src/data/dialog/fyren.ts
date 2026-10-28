import type { DialogDef } from '../types';

/** Temple 4: Fyren i skären and Havsfrun. */
export const FYREN: Record<string, DialogDef> = {
  fyren_skylt1: {
    pages: ['En mässingsskylt vid fyrens fot:\n"FYREN TÄNDES 1887. SLÄCKT I VÄNTAN PÅ AUTOMATISERING."'],
  },

  fyren_skylt2: {
    pages: ['Fyrvaktarens loggbok. Sista raden: "Midsommarnatten 1946. Ett ljus gick ner över Kyrkbyn. Signalen från stranden tystnade."'],
  },

  havsfru_vaknar: {
    speaker: 'Havsfrun',
    pages: ['Fyren är släckt, och ingen lägger en slant i vattnet åt mig längre. Låt stormen påminna dem.'],
  },

  havsfru_forlikad: {
    speaker: 'Havsfrun',
    pages: [
      'Stormen har bedarrat. Du stod kvar på galleriet fast vinden slet i dig.',
      'Varje kväll blinkade hon med sin lampa från stranden. Tre korta, tre långa, tre korta. Någon i Kyrkbyn svarade.',
      'Ta lampan.',
    ],
  },

  fick_ficklampa: {
    pages: [
      'Dagny fick FICKLAMPAN!\nI mörker lyser den upp vägen framför henne.',
      'Fyren tänds igen och sveper över skären.',
      'Väster om Fiskeläget står Nattskogen, mörk mitt på dagen. Bortom den ligger slätten med folkparken.',
    ],
    actions: [{ type: 'flag', flag: 'fyren_klar' }],
  },
};
