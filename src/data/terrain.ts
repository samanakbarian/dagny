/**
 * Every kind of ground on the overworld, in one table: what it is called,
 * how it is drawn, its colour on the pause-menu map, whether Dagny can walk
 * on it (and what she needs for it), and which kind of meeting happens there.
 * The overworld map (data/overworld.ts) is written with these characters.
 */

/** Kinds of meeting on the map – each has its own table in data/encounters.ts. */
export type TerrainType = 'ang' | 'aker' | 'hed' | 'skog' | 'myr' | 'strand' | 'fjall' | 'odetorp';

export interface TerrainDef {
  /** Swedish name (design docs, debugging). */
  name: string;
  sprite: string;
  /** Palette key for the small map in the pause menu. */
  map: string;
  /** Never walkable. */
  blocked?: boolean;
  /** Walkable only while carrying this item. */
  needs?: string;
  /** Meetings here use this table (every walkable ground has one). */
  encounter?: TerrainType;
  /** A landmark: something to look at on the way. */
  landmark?: boolean;
  /**
   * Looks like somewhere to go (a croft, a cross, a stone): on the map only
   * as a small place Dagny can visit. Walls, gates and overgrown paths are
   * plain scenery.
   */
  visitable?: boolean;
}

export const TERRAIN: Readonly<Record<string, TerrainDef>> = {
  // --- Open ground -------------------------------------------------------------------
  '.': { name: 'gräsmark', sprite: 'owGrass', map: 'M', encounter: 'ang' },
  ':': { name: 'rågåker', sprite: 'owField', map: 'y', encounter: 'aker' },
  m: { name: 'slåtteräng', sprite: 'owMeadow', map: 'l', encounter: 'ang' },
  l: { name: 'ljunghed', sprite: 'owHeather', map: 'P', encounter: 'hed' },
  h: { name: 'hygge', sprite: 'owClearcut', map: 'B', encounter: 'hed' },
  g: { name: 'slaggvarp', sprite: 'owSlag', map: 'K', encounter: 'hed' },
  d: { name: 'sandtag', sprite: 'owSandpit', map: 't', encounter: 'hed' },
  k: { name: 'kalfjäll', sprite: 'owFell', map: 'w', encounter: 'fjall' },
  f: { name: 'skog', sprite: 'owForest', map: 'm', encounter: 'skog' },
  _: { name: 'strand', sprite: 'owSand', map: 't', encounter: 'strand' },
  r: { name: 'vass', sprite: 'owReeds', map: 'e', encounter: 'strand' },
  j: { name: 'brygga', sprite: 'owDock', map: 'B', encounter: 'strand' },
  '|': { name: 'väg', sprite: 'owRoad', map: 't', encounter: 'ang' },
  '-': { name: 'väg', sprite: 'owRoadH', map: 't', encounter: 'ang' },
  '+': { name: 'vägkorsning', sprite: 'owRoad', map: 't', encounter: 'ang' },
  '=': { name: 'bro', sprite: 'owBridge', map: 't', encounter: 'ang' },

  // --- Ground that needs a treasure ---------------------------------------------------
  '~': { name: 'vatten', sprite: 'owWater', map: 'v', needs: 'eka', encounter: 'strand' },
  s: { name: 'myr', sprite: 'owSwamp', map: 'p', needs: 'stovlar', encounter: 'myr' },
  D: { name: 'gruvort', sprite: 'owTunnel', map: 'k', needs: 'karbidlampa', encounter: 'skog' },
  N: { name: 'nattskog', sprite: 'owNightForest', map: 'n', needs: 'ficklampa', encounter: 'skog' },
  // The hidden path through the dense spruce: looks like the rest of the
  // thicket until the radio's static gives it away (then drawn as owHiddenPath).
  H: { name: 'dold stig', sprite: 'owDenseForest', map: 'K', needs: 'radio', encounter: 'skog' },
  // A door in the cliff, also found with the radio (then drawn as owCliffDoor).
  E: { name: 'dold bergsdörr', sprite: 'owCliff', map: 'k', needs: 'radio', encounter: 'fjall' },

  // --- Borders that never open ---------------------------------------------------------
  '^': { name: 'berg', sprite: 'owMountain', map: 'G', blocked: true },
  F: { name: 'tät granskog', sprite: 'owDenseForest', map: 'K', blocked: true },
  w: { name: 'fors', sprite: 'owRapids', map: 'c', blocked: true },
  b: { name: 'bortspolad bro', sprite: 'owBrokenBridge', map: 'B', blocked: true },
  X: { name: 'stup', sprite: 'owCliff', map: 'k', blocked: true },
  a: { name: 'igenrasad gruvort', sprite: 'owAdit', map: 'k', blocked: true },
  W: { name: 'stengärdsgård', sprite: 'owWall', map: 'G', blocked: true, landmark: true },

  // --- Landmarks: forgotten things along the way --------------------------------------
  u: { name: 'riven gärdsgård', sprite: 'owWallBroken', map: 'G', encounter: 'ang', landmark: true },
  o: { name: 'offerkälla', sprite: 'owSpring', map: 'U', encounter: 'ang', landmark: true, visitable: true },
  t: { name: 'ödetorp', sprite: 'owCroft', map: 'r', encounter: 'odetorp', landmark: true, visitable: true },
  c: { name: 'jordkällare', sprite: 'owCellar', map: 'B', encounter: 'ang', landmark: true, visitable: true },
  L: { name: 'lada', sprite: 'owBarn', map: 'r', encounter: 'ang', landmark: true, visitable: true },
  O: { name: 'bautasten', sprite: 'owStones', map: 'W', encounter: 'ang', landmark: true, visitable: true },
  i: { name: 'milstolpe', sprite: 'owMilestone', map: 'W', encounter: 'ang', landmark: true, visitable: true },
  x: { name: 'vägkors', sprite: 'owCross', map: 'W', encounter: 'ang', landmark: true, visitable: true },
  y: { name: 'grind', sprite: 'owGate', map: 'B', encounter: 'ang', landmark: true },
  e: { name: 'övervuxen stig', sprite: 'owOvergrown', map: 'l', encounter: 'skog', landmark: true },
  q: { name: 'gamla kyrkogården', sprite: 'owChurchyard', map: 'W', encounter: 'ang', landmark: true, visitable: true },
  // A waterfall with a cave behind it, seen only when standing beside it.
  A: { name: 'vattenfall', sprite: 'owWaterfall', map: 'c', encounter: 'skog', landmark: true },

  // --- Places (villages, temples, caves) – drawn on grass ------------------------------
  V: { name: 'Mormors by', sprite: 'owVillage', map: 'r', encounter: 'ang' },
  B: { name: 'by på kartan', sprite: 'owVillage', map: 'R', encounter: 'ang' },
  K: { name: 'Stenkyrkan', sprite: 'owChurch', map: 'W', encounter: 'ang' },
  G: { name: 'Björkhagen', sprite: 'owGlade', map: 'l', encounter: 'skog' },
  M: { name: 'gruvan', sprite: 'owMine', map: 'y', encounter: 'skog' },
  Q: { name: 'kvarnen', sprite: 'owMill', map: 'r', encounter: 'skog' },
  Y: { name: 'fyren', sprite: 'owLighthouse', map: 'W', encounter: 'strand' },
  P: { name: 'folkparken', sprite: 'owPark', map: 'i', encounter: 'aker' },
  Z: { name: 'fäboden i skogen', sprite: 'owFabod', map: 'M', encounter: 'skog' },
  T: { name: 'Trollberget', sprite: 'owTroll', map: 'W', encounter: 'fjall' },
  C: { name: 'grotta', sprite: 'owCave', map: 'k', encounter: 'skog' },
};

/** Place characters, drawn on top of grass. */
export const PLACE_CHARS = 'VBKGMQYPZTC';

/** Characters that can never be walked on. */
export const BLOCKED_CHARS = Object.keys(TERRAIN).filter((c) => TERRAIN[c].blocked).join('');

/** Ground that needs a treasure: character → item. */
export const NEEDS: Readonly<Record<string, string>> = Object.fromEntries(
  Object.entries(TERRAIN).flatMap(([c, d]) => (d.needs ? [[c, d.needs]] : [])),
);
