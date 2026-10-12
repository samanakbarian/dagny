import type { NpcDef } from './types';

/** Villagers. Each picks the first dialog whose conditions hold. */
export const NPCS: Readonly<Record<string, NpcDef>> = {
  hulda: {
    id: 'hulda',
    sprite: 'hulda',
    idle: { frames: [0, 0, 0, 2, 0, 1, 1, 0], every: 0.7 },
    talk: [
      { if: [{ flag: 'krypta_klar' }, { notFlag: 'hulda_efter_krypta' }], dialog: 'hulda_efter_krypta' },
      { if: [{ notFlag: 'intro_done' }], dialog: 'intro_hulda' },
      { dialog: 'hulda_vila' },
    ],
  },
  sven: {
    id: 'sven',
    sprite: 'man',
    idle: { frames: [0, 0, 2, 0, 0, 1, 0], every: 0.8 },
    talk: [
      { if: [{ notSpell: 'lakning' }], dialog: 'sven_lar' },
      { if: [{ flag: 'krypta_klar' }], dialog: 'sven_efter' },
      { dialog: 'sven_igen' },
    ],
  },
  algot: {
    id: 'algot',
    sprite: 'shopkeeper',
    idle: { frames: [0, 2, 0, 0], every: 0.9 },
    talk: [
      { if: [{ flag: 'algot_lart' }], dialog: 'algot_igen' },
      { dialog: 'algot_lar' },
    ],
  },
  karin: {
    id: 'karin',
    sprite: 'woman',
    idle: { frames: [0, 0, 2, 0], every: 0.8 },
    talk: [
      { if: [{ item: 'murre' }, { notFlag: 'murre_hemma' }], dialog: 'karin_tack' },
      { if: [{ flag: 'murre_hemma' }], dialog: 'karin_glad' },
      { if: [{ flag: 'murre_uppdrag' }], dialog: 'karin_vantar' },
      { dialog: 'karin_uppdrag' },
    ],
  },
  murre: {
    id: 'murre',
    sprite: 'cat',
    idle: { frames: [0, 0, 1, 0, 1], every: 0.5 },
    if: [{ flag: 'murre_hemma' }],
    talk: [{ dialog: 'murre_spinner' }],
  },
  handlarn: {
    id: 'handlarn',
    sprite: 'shopkeeper',
    idle: { frames: [0, 0, 1, 0], every: 1 },
    talk: [
      { if: [{ flag: 'krypta_klar' }], dialog: 'handlarn_efter' },
      { dialog: 'handlarn' },
    ],
  },
  olle: {
    id: 'olle',
    sprite: 'kid',
    idle: { frames: [0, 0, 1, 0, 1, 0, 0, 0], every: 0.35 },
    talk: [
      { if: [{ flag: 'krypta_klar' }], dialog: 'olle_efter' },
      { dialog: 'olle' },
    ],
  },
  greta: {
    id: 'greta',
    sprite: 'woman2',
    idle: { frames: [0, 0, 1, 0, 0, 2], every: 0.8 },
    talk: [{ dialog: 'greta' }],
  },
};
