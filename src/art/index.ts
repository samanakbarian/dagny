import type { SpriteDef } from '../engine/sprites';
import { dagnySprites } from './dagny';
import { npcSprites } from './npcs';
import { enemySprites } from './enemies';
import { tileSprites } from './tiles';
import { itemSprites } from './items';
import { overworldSprites } from './overworld';
import { mineSprites } from './mine';
import { gruvbySprites } from './gruvby';
import { millSprites } from './mill';
import { lighthouseSprites } from './lighthouse';
import { parkSprites } from './park';
import { forestSprites } from './forest';

/** Every sprite in the game, keyed by id. */
export const SPRITES: Record<string, SpriteDef> = {
  ...dagnySprites,
  ...npcSprites,
  ...enemySprites,
  ...tileSprites,
  ...itemSprites,
  ...overworldSprites,
  ...mineSprites,
  ...gruvbySprites,
  ...millSprites,
  ...lighthouseSprites,
  ...parkSprites,
  ...forestSprites,
};
