import type { StatId } from './types';

/** Highest level for Styrka, Magi and Liv. */
export const MAX_LEVEL = 8;

/**
 * Rising XP curve: the XP needed to raise a stat from level n to n+1 is
 * COSTS[stat][n − 1]. Spending XP on a level deducts the cost.
 */
export const COSTS: Readonly<Record<StatId, readonly number[]>> = {
  styrka: [60, 140, 260, 420, 650, 950, 1400],
  magi: [45, 110, 210, 350, 550, 820, 1200],
  liv: [45, 110, 210, 350, 550, 820, 1200],
};

/** Sword damage per Styrka level. */
export const SWORD_DAMAGE = [2, 3, 4, 5, 6, 8, 10, 12];
/** Max health per Liv level (one point = half a heart segment on the HUD). */
export const MAX_HP = [8, 10, 12, 14, 16, 18, 20, 24];
/** Max magic per Magi level. */
export const MAX_MP = [4, 5, 6, 7, 8, 9, 10, 12];

export const STAT_NAMES: Readonly<Record<StatId, string>> = {
  styrka: 'Styrka',
  magi: 'Magi',
  liv: 'Liv',
};
