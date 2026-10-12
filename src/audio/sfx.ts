import type { SfxStep } from '../engine/audio';

/** Sound effects as synth parameters. */
export const SFX: Record<string, SfxStep[]> = {
  jump: [{ wave: 'square', from: 260, to: 520, dur: 0.12, vol: 0.35 }],
  sword: [
    { wave: 'noise', from: 3000, to: 900, dur: 0.09, vol: 0.5 },
    { wave: 'triangle', from: 900, to: 500, dur: 0.06, vol: 0.2 },
  ],
  hit: [
    { wave: 'square', from: 220, to: 90, dur: 0.1, vol: 0.45 },
    { wave: 'noise', from: 1500, to: 400, dur: 0.08, vol: 0.4 },
  ],
  block: [
    { wave: 'triangle', from: 1400, to: 1300, dur: 0.12, vol: 0.4 },
    { wave: 'square', from: 2100, to: 2000, dur: 0.05, vol: 0.15 },
  ],
  hurt: [
    { wave: 'sawtooth', from: 380, to: 120, dur: 0.22, vol: 0.4 },
    { wave: 'noise', from: 800, to: 200, dur: 0.15, vol: 0.3 },
  ],
  puff: [{ wave: 'noise', from: 1200, to: 200, dur: 0.35, vol: 0.4 }],
  xp: [
    { wave: 'square', from: 880, dur: 0.06, vol: 0.25 },
    { wave: 'square', from: 1320, dur: 0.08, vol: 0.25, at: 0.06 },
  ],
  pickup: [
    { wave: 'triangle', from: 660, dur: 0.07, vol: 0.4 },
    { wave: 'triangle', from: 990, dur: 0.1, vol: 0.4, at: 0.07 },
  ],
  key: [
    { wave: 'triangle', from: 990, dur: 0.08, vol: 0.4 },
    { wave: 'triangle', from: 1320, dur: 0.08, vol: 0.4, at: 0.08 },
    { wave: 'triangle', from: 1760, dur: 0.15, vol: 0.4, at: 0.16 },
  ],
  levelup: [
    { wave: 'square', from: 523, dur: 0.1, vol: 0.3 },
    { wave: 'square', from: 659, dur: 0.1, vol: 0.3, at: 0.1 },
    { wave: 'square', from: 784, dur: 0.1, vol: 0.3, at: 0.2 },
    { wave: 'square', from: 1047, dur: 0.3, vol: 0.3, at: 0.3 },
  ],
  dialog: [{ wave: 'square', from: 700, dur: 0.025, vol: 0.12 }],
  door: [
    { wave: 'noise', from: 400, to: 150, dur: 0.25, vol: 0.5 },
    { wave: 'triangle', from: 110, to: 70, dur: 0.25, vol: 0.4 },
  ],
  unlock: [
    { wave: 'triangle', from: 1500, dur: 0.05, vol: 0.4 },
    { wave: 'noise', from: 600, to: 200, dur: 0.2, vol: 0.4, at: 0.05 },
  ],
  water: [
    { wave: 'noise', from: 900, to: 300, dur: 0.3, vol: 0.5 },
    { wave: 'sine', from: 600, to: 200, dur: 0.15, vol: 0.3 },
  ],
  magic: [
    { wave: 'triangle', from: 400, to: 1600, dur: 0.3, vol: 0.35 },
    { wave: 'sine', from: 800, to: 2400, dur: 0.3, vol: 0.2, at: 0.05 },
  ],
  heal: [
    { wave: 'sine', from: 523, dur: 0.12, vol: 0.4 },
    { wave: 'sine', from: 659, dur: 0.12, vol: 0.4, at: 0.1 },
    { wave: 'sine', from: 880, dur: 0.25, vol: 0.4, at: 0.2 },
  ],
  thunder: [
    { wave: 'noise', from: 2000, to: 60, dur: 0.9, vol: 0.8 },
    { wave: 'sawtooth', from: 80, to: 30, dur: 0.7, vol: 0.4 },
  ],
  fire: [{ wave: 'noise', from: 2500, to: 600, dur: 0.18, vol: 0.4 }],
  menu: [{ wave: 'square', from: 520, dur: 0.04, vol: 0.2 }],
  select: [
    { wave: 'square', from: 660, dur: 0.05, vol: 0.25 },
    { wave: 'square', from: 990, dur: 0.07, vol: 0.25, at: 0.05 },
  ],
  cancel: [{ wave: 'square', from: 440, to: 300, dur: 0.08, vol: 0.2 }],
  checkpoint: [
    { wave: 'triangle', from: 392, dur: 0.15, vol: 0.4 },
    { wave: 'triangle', from: 587, dur: 0.15, vol: 0.4, at: 0.12 },
    { wave: 'triangle', from: 784, dur: 0.3, vol: 0.4, at: 0.24 },
  ],
  roar: [
    { wave: 'sawtooth', from: 140, to: 60, dur: 0.8, vol: 0.5 },
    { wave: 'noise', from: 500, to: 120, dur: 0.8, vol: 0.4 },
  ],
  bell: [
    { wave: 'sine', from: 440, dur: 1.2, vol: 0.4 },
    { wave: 'sine', from: 1056, dur: 0.8, vol: 0.2 },
  ],
  land: [{ wave: 'noise', from: 300, to: 100, dur: 0.06, vol: 0.25 }],
  step: [{ wave: 'noise', from: 200, to: 120, dur: 0.03, vol: 0.12 }],
};
