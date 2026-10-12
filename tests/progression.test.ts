import { describe, expect, it } from 'vitest';
import { COSTS, MAX_HP, MAX_LEVEL, MAX_MP, SWORD_DAMAGE } from '../src/data/progression';
import { affordable, canLevelUp, damageTaken, nextCost, nextTarget, raise, type Levels } from '../src/game/progression';

describe('XP curve', () => {
  it('has a cost for every level step and rises strictly', () => {
    for (const costs of Object.values(COSTS)) {
      expect(costs.length).toBe(MAX_LEVEL - 1);
      for (let i = 1; i < costs.length; i++) expect(costs[i]).toBeGreaterThan(costs[i - 1]);
    }
  });

  it('per-level tables cover all eight levels', () => {
    expect(SWORD_DAMAGE.length).toBe(MAX_LEVEL);
    expect(MAX_HP.length).toBe(MAX_LEVEL);
    expect(MAX_MP.length).toBe(MAX_LEVEL);
  });

  it('nextCost is null at max level', () => {
    expect(nextCost('styrka', 1)).toBe(COSTS.styrka[0]);
    expect(nextCost('liv', MAX_LEVEL)).toBeNull();
  });
});

describe('raising stats', () => {
  it('spends XP and raises the level', () => {
    const lv: Levels = { styrka: 1, magi: 1, liv: 1 };
    const xp = raise(100, lv, 'magi');
    expect(lv.magi).toBe(2);
    expect(xp).toBe(100 - COSTS.magi[0]);
  });

  it('refuses when there is not enough XP', () => {
    const lv: Levels = { styrka: 1, magi: 1, liv: 1 };
    expect(raise(10, lv, 'styrka')).toBe(10);
    expect(lv.styrka).toBe(1);
  });

  it('never goes past level 8', () => {
    const lv: Levels = { styrka: MAX_LEVEL, magi: 1, liv: 1 };
    expect(raise(99999, lv, 'styrka')).toBe(99999);
    expect(lv.styrka).toBe(MAX_LEVEL);
  });

  it('reports what is affordable', () => {
    const lv: Levels = { styrka: 1, magi: 1, liv: 1 };
    expect(canLevelUp(0, lv)).toBe(false);
    expect(affordable(COSTS.magi[0], lv).sort()).toEqual(['liv', 'magi']);
    expect(nextTarget(lv)).toBe(Math.min(COSTS.styrka[0], COSTS.magi[0], COSTS.liv[0]));
    expect(nextTarget({ styrka: 8, magi: 8, liv: 8 })).toBeNull();
  });
});

describe('damage', () => {
  it('calm mode and Skydd each halve damage, never below 1', () => {
    expect(damageTaken(4, false, false)).toBe(4);
    expect(damageTaken(4, true, false)).toBe(2);
    expect(damageTaken(4, true, true)).toBe(1);
    expect(damageTaken(1, true, true)).toBe(1);
  });
});
