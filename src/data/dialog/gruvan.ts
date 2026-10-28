import type { DialogDef } from '../types';

/** Temple 2: Den gamla gruvan and Gruvrået. */
export const GRUVAN: Record<string, DialogDef> = {
  gruvan_skylt1: {
    pages: ['En rostig emaljskylt:\n"STOLL NR 3 – STÄNGD 1951. OBEHÖRIGA ÄGA EJ TILLTRÄDE."'],
  },

  gruvan_skylt2: {
    pages: ['Ristat i en stötta: "Hälsa på rået när du går in, tacka henne när du går ut."'],
  },

  gruvan_skylt3: {
    pages: ['En kall karbidlampa hänger på en spik. I mässingen är det ristat H.D.'],
  },

  gruvra_vaknar: {
    speaker: 'Gruvrået',
    pages: ['Ingen hälsar. Ingen tackar. De tar malmen och släcker lyktorna. Låt mörkret ta dem.'],
  },

  gruvra_forlikad: {
    speaker: 'Gruvrået',
    pages: [
      '...Du slogs som en Väktare.',
      'Den förra kom hit varje vår med sin lampa och hälsade. Hon lämnade den här sista gången.',
      'Ta den.',
    ],
  },

  fick_karbidlampa: {
    pages: [
      'Dagny fick KARBIDLAMPAN!\nNu ser hon dubbelt så långt i mörka gruvor och grottor.',
      'Lyktorna längs orten tänds en efter en.',
      'Med lampan går det att ta sig genom gruvgången öster om gruvan. På andra sidan ligger kvarnen vid forsen.',
    ],
    actions: [{ type: 'flag', flag: 'gruvan_klar' }],
  },
};
