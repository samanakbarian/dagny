/**
 * Data model shared by all data files. The engine only reads these
 * structures, so temples, creatures, dialog and maps can be changed
 * without touching engine code.
 */

export type StatId = 'styrka' | 'magi' | 'liv';

export type SpellId = 'lakning' | 'skydd' | 'hopp' | 'lyse' | 'eld' | 'hamn' | 'aska';

export type SkillId = 'nedatstot' | 'uppatstot';

export interface SpellDef {
  id: SpellId;
  name: string;
  description: string;
  /** Magic points per cast, indexed by Magi level − 1. */
  cost: number[];
  /** Effect duration in seconds (0 = instant). */
  duration: number;
  /** Village whose elder teaches it (for the in-game hint text). */
  village: string;
}

export interface SkillDef {
  id: SkillId;
  name: string;
  description: string;
  village: string;
}

export interface ItemDef {
  id: string;
  name: string;
  description: string;
  sprite: string;
  /** Key treasures are found in temples and open new parts of the map. */
  treasure?: boolean;
}

export type Behavior =
  | 'walker'
  | 'floater'
  | 'parrier'
  | 'hopper'
  | 'diver'
  | 'tank'
  | 'shooter'
  | 'wolf'
  | 'boss_grim'
  | 'boss_gruvra'
  | 'boss_backahast'
  | 'boss_havsfru'
  | 'boss_spelman'
  | 'boss_placeholder';

export type PuffKind = 'moss' | 'leaf' | 'mist';

export interface EnemyDef {
  id: string;
  name: string;
  sprite: string;
  behavior: Behavior;
  hp: number;
  damage: number;
  xp: number;
  /** Pixels per step. */
  speed: number;
  /** Hitbox (relative to the sprite's top-left). */
  box: { x: number; y: number; w: number; h: number };
  puff: PuffKind;
  /** Drop chances 0–1. */
  drops?: { bulle?: number; termos?: number; lingon?: number };
  /** Takes no knockback. */
  heavy?: boolean;
  /** Ignores gravity. */
  flying?: boolean;
  /** Becomes friendly after being defeated (flavour text shown). */
  befriend?: string;
}

export interface BossPhase {
  /** Phase starts when hp falls to this fraction of max. */
  atHpFraction: number;
  sprite: string;
  speed: number;
  /** Seconds between attacks. */
  attackEvery: number;
}

export interface BossDef extends EnemyDef {
  title: string;
  phases: [BossPhase, BossPhase];
  /** Dialog shown when the boss wakes up. */
  introDialog: string;
  /** Dialog shown when the boss is reconciled ("förlikad"). */
  defeatDialog: string;
}

export interface TempleDef {
  id: string;
  number: number;
  name: string;
  /** Environment / mechanic description (design notes, shown nowhere). */
  mechanic: string;
  tone: string;
  music: string;
  bossMusic: string;
  treasure: string | null;
  boss: string;
  /** First side-view area; null while the temple is not built yet. */
  entryArea: string | null;
  /** Lore found inside – the story of the last Väktare, piece by piece. */
  lore: string;
}

export interface VillageDef {
  id: string;
  name: string;
  /** Side-view area; null while not built. */
  area: string | null;
  /** Entry point in that area used when waking up after a defeat. */
  wakeEntry: string;
  teaches: SpellId | SkillId | null;
}

// --- Dialog -----------------------------------------------------------------

export type Condition =
  | { flag: string }
  | { notFlag: string }
  | { item: string }
  | { notItem: string }
  | { spell: SpellId }
  | { notSpell: SpellId };

export type DialogAction =
  | { type: 'flag'; flag: string }
  | { type: 'learnSpell'; spell: SpellId }
  | { type: 'learnSkill'; skill: SkillId }
  | { type: 'rest' }
  | { type: 'xp'; amount: number }
  | { type: 'giveItem'; item: string }
  | { type: 'takeItem'; item: string }
  | { type: 'heal' };

export interface DialogChoice {
  text: string;
  /** Dialog to continue with. */
  next?: string;
  actions?: DialogAction[];
}

export interface DialogDef {
  /** Name shown on the postcard frame (never Dagny – she is silent). */
  speaker?: string;
  pages: string[];
  choices?: DialogChoice[];
  /** Run after the last page (or before choices). */
  actions?: DialogAction[];
  /** Dialog that follows automatically. */
  next?: string;
}

/** An NPC picks the first dialog whose conditions all hold. */
export interface NpcTalk {
  if?: Condition[];
  dialog: string;
}

export interface NpcDef {
  id: string;
  sprite: string;
  /** Idle animation: frames and seconds per frame. */
  idle: { frames: number[]; every: number };
  talk: NpcTalk[];
  /** Only present when all conditions hold. */
  if?: Condition[];
  /** Follows Dagny around slowly (e.g. the cat when found). */
  wander?: number;
}

// --- Areas --------------------------------------------------------------------

export interface Exit {
  /** 'overworld' or an area id. */
  to: string;
  /** Entry marker in the target area (a character in its tile map). */
  entry?: string;
  /** Overworld tile to appear on when going to the overworld. */
  ow?: { x: number; y: number };
  /** Flag required to use this exit, and the dialog shown when missing. */
  requires?: { flag?: string; item?: string; dialog: string };
}

export interface Prop {
  /** Sprite to draw (omit for pure emitters such as chimney smoke). */
  sprite?: string;
  /** Pixel position (bottom-left anchored on a tile: x in tiles, y = ground row). */
  tx: number;
  ty: number;
  /** Offset in pixels. */
  dx?: number;
  dy?: number;
  /** Animation seconds per frame (0 = static). */
  anim?: number;
  /** Emits chimney smoke from this point. */
  smoke?: boolean;
  front?: boolean;
}

export type AreaKind = 'village' | 'path' | 'temple' | 'encounter';
export type Backdrop = 'outdoor' | 'forest' | 'crypt' | 'mine' | 'mill' | 'sea' | 'park' | 'none';

/**
 * Wind in part of an area (tile rectangle, inclusive). Gusts blow for `on`
 * steps, then pause for `off`. 'alternate' flips direction every gust;
 * 'up' is an updraft that lifts Dagny.
 */
export interface WindZone {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  dir: 'left' | 'right' | 'up' | 'alternate';
  /** Pixels per step (horizontal) or lift per step (updraft). */
  force: number;
  on: number;
  off: number;
  offset?: number;
}

/**
 * A moving platform. Lifts are 32 px wide with their top on the top edge of
 * row `ty`; carts are 24 px wide and run along rails at the bottom of row `ty`.
 * Logs float with their top at the bottom edge of row `ty` (level with the bank).
 * A wheel is a water wheel centred on (tx, ty) with `count` paddles at
 * `radius` tiles that turn by `speed` radians per step (toTx/toTy unused).
 * A carousel is the same, but its horses run on a flat ellipse (`radiusY` tiles).
 * 'loop' moves back and forth by itself; 'ride' moves only while Dagny stands
 * on it, towards the end it is not resting at.
 */
export interface PlatformDef {
  kind: 'lift' | 'cart' | 'log' | 'wheel' | 'carousel';
  radius?: number;
  radiusY?: number;
  count?: number;
  tx: number;
  ty: number;
  toTx: number;
  toTy: number;
  mode: 'loop' | 'ride';
  /** Pixels per step (default 0.6 for lifts, 1.1 for carts). */
  speed?: number;
}

export interface AreaDef {
  id: string;
  name: string;
  kind: AreaKind;
  tone: string;
  music: string;
  backdrop: Backdrop;
  /** Theme for '#' and '=' tiles. */
  theme: 'meadow' | 'village' | 'crypt' | 'mine' | 'mill' | 'skar' | 'fyr' | 'park';
  /** Collision + entity layer. See data/legend.ts. */
  tiles: string[];
  /** Optional non-colliding background decor layer (same size). */
  deco?: string[];
  /** NPCs placed with digits '1'–'9' in the tile layer. */
  npcs?: Record<string, string>;
  /** Doors used with Up, placed with capital letters in the tile layer. */
  doors?: Record<string, Exit>;
  /** Readable stones / signs (used with Up): marker character → dialog id. */
  signs?: Record<string, string>;
  /** Walking off the left / right edge. */
  left?: Exit;
  right?: Exit;
  props?: Prop[];
  platforms?: PlatformDef[];
  wind?: WindZone[];
  /** Dance-floor squares ('%' and '&') swap every `period` steps. */
  beat?: { period: number };
  /** Dark area – only lit around Dagny, candles and spells. */
  dark?: boolean;
  /** How dark a dark area is, 0–1 (default 0.93). */
  darkness?: number;
  /** Temple this area belongs to (for keys and checkpoints). */
  temple?: string;
  /** Side-quest item lying at 'q' (picked up once; dialog `hittade_<item>`). */
  questItem?: string;
  /** Treasure item lying on the altar ('X' in the tile layer). */
  treasure?: string;
  /** Show the area name when entering. */
  showName?: boolean;
  /** Ambient life. */
  ambience?: Array<'fireflies' | 'mosquitoes' | 'dust' | 'mist' | 'leaves' | 'rain' | 'spray'>;
  /** Dialog started automatically the first time (needs flag to not repeat). */
  onEnter?: { dialog: string; unlessFlag: string; setFlag: string };
}

// --- Overworld --------------------------------------------------------------

export interface OverworldPlace {
  /** Character on the overworld map. */
  x: number;
  y: number;
  name: string;
  /** Side-view area and entry when entering this tile. */
  area?: string;
  entry?: string;
  /** Dialog shown instead (e.g. a temple that is not built yet). */
  dialog?: string;
}

export interface EncounterDef {
  sprite: 'owShadow' | 'owWisp';
  /** Terrain characters it may wander on. */
  terrain: string;
  /** Side-view area it leads to; defaults to OverworldDef.areaByTerrain. */
  area?: string;
  /** Start tile. */
  x: number;
  y: number;
  /** Hidden once this flag is set (e.g. region restored). */
  goneFlag?: string;
}

export interface OverworldDef {
  tiles: string[];
  places: OverworldPlace[];
  encounters: EncounterDef[];
  start: { x: number; y: number };
  /** Encounter area by the terrain character the creature stands on. */
  areaByTerrain: Record<string, string>;
  /** Terrain that needs an item to cross: char → item id. */
  needs: Record<string, string>;
  /** Terrain that can never be crossed. */
  blocked: string;
  music: string;
  tone: string;
}
