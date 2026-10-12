import type { BossDef, EnemyDef } from './types';

/** Väsen are defined here and reused with variations. */
export const ENEMIES: Readonly<Record<string, EnemyDef>> = {
  vatte: {
    id: 'vatte', name: 'Vätte', sprite: 'vatte', behavior: 'walker',
    hp: 4, damage: 1, xp: 5, speed: 0.45,
    box: { x: 3, y: 4, w: 10, h: 12 }, puff: 'moss',
    drops: { bulle: 0.25, lingon: 0.1 },
    befriend: 'Vätten nyser, skakar på huvudet och travar hem till sin tuva.',
  },
  vatteGra: {
    id: 'vatteGra', name: 'Gravvätte', sprite: 'vatteGra', behavior: 'walker',
    hp: 6, damage: 2, xp: 8, speed: 0.55,
    box: { x: 3, y: 4, w: 10, h: 12 }, puff: 'mist',
    drops: { bulle: 0.3, termos: 0.1 },
  },
  lyktgubbe: {
    id: 'lyktgubbe', name: 'Lyktgubbe', sprite: 'lyktgubbe', behavior: 'floater',
    hp: 2, damage: 1, xp: 6, speed: 0.6,
    box: { x: 2, y: 2, w: 8, h: 8 }, puff: 'mist', flying: true,
    drops: { termos: 0.3 },
  },
  nisse: {
    id: 'nisse', name: 'Tomtenisse-krigare', sprite: 'nisse', behavior: 'parrier',
    hp: 8, damage: 2, xp: 20, speed: 0.5,
    box: { x: 3, y: 4, w: 10, h: 20 }, puff: 'leaf',
    drops: { bulle: 0.4, lingon: 0.25 },
    befriend: 'Nissen bugar djupt. Han ska vakta gården igen, som förr.',
  },
  myrkatt: {
    id: 'myrkatt', name: 'Myrkatt', sprite: 'myrkatt', behavior: 'hopper',
    hp: 5, damage: 2, xp: 12, speed: 1.2,
    box: { x: 2, y: 4, w: 12, h: 8 }, puff: 'moss',
    drops: { bulle: 0.3 },
  },
  kraka: {
    id: 'kraka', name: 'Kråka', sprite: 'kraka', behavior: 'diver',
    hp: 3, damage: 1, xp: 8, speed: 1.4,
    box: { x: 2, y: 2, w: 12, h: 8 }, puff: 'leaf', flying: true,
    drops: { bulle: 0.2 },
  },
  stenknekt: {
    id: 'stenknekt', name: 'Stenknekt', sprite: 'stenknekt', behavior: 'tank',
    hp: 18, damage: 3, xp: 30, speed: 0.25,
    box: { x: 1, y: 1, w: 13, h: 23 }, puff: 'moss', heavy: true,
    drops: { lingon: 0.4, termos: 0.3 },
  },
  sjora: {
    id: 'sjora', name: 'Sjörå-skott', sprite: 'sjora', behavior: 'shooter',
    hp: 5, damage: 2, xp: 15, speed: 0,
    box: { x: 3, y: 2, w: 10, h: 14 }, puff: 'mist', heavy: true,
    drops: { termos: 0.35 },
  },
  skuggvarg: {
    id: 'skuggvarg', name: 'Skuggvarg', sprite: 'skuggvarg', behavior: 'wolf',
    hp: 6, damage: 3, xp: 25, speed: 1.8,
    box: { x: 2, y: 3, w: 20, h: 10 }, puff: 'mist',
    drops: { lingon: 0.3 },
  },
};

/** Bosses – each with two phases. Only Kyrkogrimmen is playable in the vertical slice. */
export const BOSSES: Readonly<Record<string, BossDef>> = {
  grim: {
    id: 'grim', name: 'Kyrkogrimmen', title: 'Kyrkogrimmen – kryptans väktare',
    sprite: 'grim', behavior: 'boss_grim',
    hp: 44, damage: 3, xp: 200, speed: 1.6,
    box: { x: 4, y: 12, w: 26, h: 20 }, puff: 'mist', heavy: true,
    phases: [
      { atHpFraction: 1, sprite: 'grim', speed: 1.7, attackEvery: 2.2 },
      { atHpFraction: 0.5, sprite: 'grimSpirit', speed: 1.1, attackEvery: 1.4 },
    ],
    defeatDialog: 'grim_forlikad',
  },
  gruvraet: {
    id: 'gruvraet', name: 'Gruvrået', title: 'Gruvrået – bergets värdinna',
    sprite: 'grim', behavior: 'boss_placeholder',
    hp: 60, damage: 3, xp: 300, speed: 1.4,
    box: { x: 4, y: 12, w: 26, h: 20 }, puff: 'mist', heavy: true,
    phases: [
      { atHpFraction: 1, sprite: 'grim', speed: 1.4, attackEvery: 2 },
      { atHpFraction: 0.5, sprite: 'grimSpirit', speed: 1.2, attackEvery: 1.3 },
    ],
    defeatDialog: 'boss_forlikad',
  },
  backahasten: {
    id: 'backahasten', name: 'Bäckahästen', title: 'Bäckahästen – den vita hästen i forsen',
    sprite: 'grim', behavior: 'boss_placeholder',
    hp: 70, damage: 4, xp: 400, speed: 1.8,
    box: { x: 4, y: 12, w: 26, h: 20 }, puff: 'mist', heavy: true,
    phases: [
      { atHpFraction: 1, sprite: 'grim', speed: 1.8, attackEvery: 1.8 },
      { atHpFraction: 0.5, sprite: 'grimSpirit', speed: 1.4, attackEvery: 1.2 },
    ],
    defeatDialog: 'boss_forlikad',
  },
  havsfrun: {
    id: 'havsfrun', name: 'Havsfrun', title: 'Havsfrun – stormens dotter',
    sprite: 'grim', behavior: 'boss_placeholder',
    hp: 80, damage: 4, xp: 500, speed: 1.5,
    box: { x: 4, y: 12, w: 26, h: 20 }, puff: 'mist', heavy: true,
    phases: [
      { atHpFraction: 1, sprite: 'grim', speed: 1.5, attackEvery: 1.8 },
      { atHpFraction: 0.5, sprite: 'grimSpirit', speed: 1.3, attackEvery: 1.1 },
    ],
    defeatDialog: 'boss_forlikad',
  },
  spelmannen: {
    id: 'spelmannen', name: 'Spelmannen', title: 'Spelmannen vid dansbanan',
    sprite: 'grim', behavior: 'boss_placeholder',
    hp: 90, damage: 5, xp: 650, speed: 1.6,
    box: { x: 4, y: 12, w: 26, h: 20 }, puff: 'mist', heavy: true,
    phases: [
      { atHpFraction: 1, sprite: 'grim', speed: 1.6, attackEvery: 1.6 },
      { atHpFraction: 0.5, sprite: 'grimSpirit', speed: 1.5, attackEvery: 1 },
    ],
    defeatDialog: 'boss_forlikad',
  },
  skogsraet: {
    id: 'skogsraet', name: 'Skogsrået', title: 'Skogsrået – hon med ihålig rygg',
    sprite: 'grim', behavior: 'boss_placeholder',
    hp: 100, damage: 5, xp: 800, speed: 1.7,
    box: { x: 4, y: 12, w: 26, h: 20 }, puff: 'leaf', heavy: true,
    phases: [
      { atHpFraction: 1, sprite: 'grim', speed: 1.7, attackEvery: 1.5 },
      { atHpFraction: 0.5, sprite: 'grimSpirit', speed: 1.6, attackEvery: 1 },
    ],
    defeatDialog: 'boss_forlikad',
  },
  bergakungen: {
    id: 'bergakungen', name: 'Bergakungen', title: 'Bergakungen – han under Trollberget',
    sprite: 'grim', behavior: 'boss_placeholder',
    hp: 140, damage: 6, xp: 0, speed: 1.5,
    box: { x: 4, y: 12, w: 26, h: 20 }, puff: 'moss', heavy: true,
    phases: [
      { atHpFraction: 1, sprite: 'grim', speed: 1.5, attackEvery: 1.4 },
      { atHpFraction: 0.5, sprite: 'grimSpirit', speed: 1.7, attackEvery: 0.9 },
    ],
    defeatDialog: 'boss_forlikad',
  },
};
