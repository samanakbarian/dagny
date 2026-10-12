import { Kind, type TileKind } from '../engine/collision';

/**
 * Characters used in side-view tile maps (AreaDef.tiles).
 *
 *  .  empty              #  ground (theme: grass/dirt, cobbles, brick)
 *  =  one-way platform   ^  spikes (hazard)       ~  water (hazard)
 *  n  nettles (hazard)   L  locked door (needs a key)
 *  k  key                c  checkpoint candle (unlit until touched)
 *  X  altar with the area's treasure
 *  @  default start      A–Z (except L, X)  doors / entry markers
 *  1–9  NPCs (AreaDef.npcs)
 *  v vätte  V gravvätte  l lyktgubbe  t tomtenisse  m myrkatt  r kråka
 *  s stenknekt  j sjörå-skott  w skuggvarg  f fladdermus  u gruvvätte  B boss
 *  b bulle  T termos  g lingon  M Murre the cat (side quest)
 */
export const ENEMY_CHARS: Readonly<Record<string, string>> = {
  v: 'vatte',
  V: 'vatteGra',
  l: 'lyktgubbe',
  t: 'nisse',
  m: 'myrkatt',
  r: 'kraka',
  s: 'stenknekt',
  j: 'sjora',
  w: 'skuggvarg',
  f: 'fladdermus',
  u: 'gruvvatte',
};

export const PICKUP_CHARS: Readonly<Record<string, 'bulle' | 'termos' | 'lingon'>> = {
  b: 'bulle',
  T: 'termos',
  g: 'lingon',
};

export interface Theme {
  top: string;
  fill: string;
  platform: string;
}

export const THEMES: Readonly<Record<string, Theme>> = {
  meadow: { top: 'grass', fill: 'dirt', platform: 'log' },
  village: { top: 'road', fill: 'dirt', platform: 'plank' },
  crypt: { top: 'brickTop', fill: 'brick', platform: 'ledge' },
  mine: { top: 'rockTop', fill: 'rock', platform: 'beam' },
};

/** Collision kind for a tile-layer character. */
export function kindOf(ch: string): TileKind {
  switch (ch) {
    case '#':
    case 'L':
      return Kind.Solid;
    case '=':
      return Kind.OneWay;
    case '^':
    case '~':
    case 'n':
      return Kind.Hazard;
    default:
      return Kind.Empty;
  }
}

/** Background decor characters (AreaDef.deco) → sprite id. */
export const DECO: Readonly<Record<string, string>> = {
  w: 'wall',
  '[': 'corner',
  ']': 'cornerR',
  o: 'window',
  d: 'doorTop',
  D: 'doorBottom',
  '/': 'roofL',
  '-': 'roof',
  '\\': 'roofR',
  h: 'chimney',
  f: 'fence',
  '*': 'flowers',
  b: 'bgBrick',
  p: 'pillar',
  '(': 'archL',
  ')': 'archR',
  C: 'candle',
  s: 'stainedGlass',
  c: 'coffin',
  x: 'web',
  r: 'bgRock',
  '|': 'support',
  T: 'supportTop',
  _: 'rail',
  a: 'ore',
  O: 'lantern',
};
