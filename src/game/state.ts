import type { SkillId, SpellId } from '../data/types';
import type { Levels } from './progression';
import { maxHp, maxMp } from './progression';

/** Where Dagny is: a side-view area or the overworld. */
export interface Location {
  area: string; // area id or 'overworld'
  x: number;
  y: number;
}

export interface GameState {
  hp: number;
  mp: number;
  xp: number;
  levels: Levels;
  spells: SpellId[];
  selectedSpell: SpellId | null;
  skills: SkillId[];
  items: string[];
  /** Unused keys per temple id. */
  keys: Record<string, number>;
  flags: string[];
  /** Persisted world changes: opened doors, picked keys, lit candles ("area:x,y"). */
  opened: string[];
  /** Current position (saved exactly so "Fortsätt" returns here). */
  loc: Location;
  /** Overworld tile (where to return to). */
  ow: { x: number; y: number };
  /** Village to wake up in after a defeat. */
  lastVillage: string;
  /** Latest temple checkpoint (lit candle). */
  checkpoint: Location | null;
  playTime: number;
}

export function newGame(): GameState {
  const levels: Levels = { styrka: 1, magi: 1, liv: 1 };
  return {
    hp: maxHp(1),
    mp: maxMp(1),
    xp: 0,
    levels,
    spells: [],
    selectedSpell: null,
    skills: [],
    items: [],
    keys: {},
    flags: [],
    opened: [],
    loc: { area: 'mormors_by', x: 9 * 16 - 8, y: 10 * 16 - 24 },
    ow: { x: 10, y: 22 },
    lastVillage: 'mormors_by',
    checkpoint: null,
    playTime: 0,
  };
}

export function hasFlag(s: GameState, f: string): boolean {
  return s.flags.includes(f);
}

export function setFlag(s: GameState, f: string): void {
  if (!s.flags.includes(f)) s.flags.push(f);
}

export function hasItem(s: GameState, id: string): boolean {
  return s.items.includes(id);
}
