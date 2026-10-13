import type { ItemDef } from './types';

export const ITEMS: Readonly<Record<string, ItemDef>> = {
  svard: {
    id: 'svard',
    name: 'Klingan',
    description: 'Den gamla klingan från klockstapeln, med kyrkklockans kläpp som fäste.',
    sprite: 'sword',
  },
  eka: {
    id: 'eka',
    name: 'Ekan',
    description: 'En liten roddbåt av ek. Tar dig över vatten på kartan.',
    sprite: 'eka',
    treasure: true,
  },
  karbidlampa: {
    id: 'karbidlampa',
    name: 'Karbidlampan',
    description: 'Gruvarbetarnas lampa med initialerna H.D. Dagny ser dubbelt så långt i mörker.',
    sprite: 'karbidlampa',
    treasure: true,
  },
  stovlar: {
    id: 'stovlar',
    name: 'Gummistövlarna',
    description: 'Gröna stövlar. Nu kan du gå över myren.',
    sprite: 'stovlar',
    treasure: true,
  },
  ficklampa: {
    id: 'ficklampa',
    name: 'Ficklampan',
    description: 'Den förra Väktarens signallampa. Kastar en ljuskägla framför Dagny i mörker.',
    sprite: 'ficklampa',
    treasure: true,
  },
  radio: {
    id: 'radio',
    name: 'Transistorradion',
    description: 'Bruset mellan stationerna avslöjar dolda gångar. Väggar som surrar går att gå igenom.',
    sprite: 'radio',
    treasure: true,
  },
  naverlur: {
    id: 'naverlur',
    name: 'Näverluren',
    description: 'Håll NER och tryck MAGI: en vätte du förlikat kommer och slåss vid din sida en stund.',
    sprite: 'naverlur',
    treasure: true,
  },
  fickur: {
    id: 'fickur',
    name: 'Fickuret',
    description: 'Anders lyckofickur i mässing. Det tickar fortfarande.',
    sprite: 'fickur',
  },
  murre: {
    id: 'murre',
    name: 'Murre',
    description: 'Karins katt. Spinner i famnen.',
    sprite: 'cat',
  },
};

/** Order shown in the items menu. */
export const ITEM_ORDER = ['svard', 'eka', 'karbidlampa', 'stovlar', 'ficklampa', 'radio', 'naverlur', 'murre', 'fickur'];
