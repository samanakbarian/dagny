import type { SpriteDef } from '../engine/sprites';
import { dagnySprites } from './dagny';
import { npcSprites } from './npcs';
import { enemySprites } from './enemies';
import { tileSprites } from './tiles';
import { itemSprites } from './items';
import { overworldSprites } from './overworld';
import { mineSprites } from './mine';

/** Every sprite in the game, keyed by id. */
export const SPRITES: Record<string, SpriteDef> = {
  ...dagnySprites,
  ...npcSprites,
  ...enemySprites,
  ...tileSprites,
  ...itemSprites,
  ...overworldSprites,
  ...mineSprites,
};
