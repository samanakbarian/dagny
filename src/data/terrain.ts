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
  /**
   * Palette key for the small map in the pause menu – a few clear colours
   * (ground, forest, field, marsh, water, shore, rock, roads); places are
   * drawn as markers on top.
   */
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
  m: { name: 'slåtteräng', sprite: 'owMeadow', map: 'M', encounter: 'ang' },
  l: { name: 'ljunghed', sprite: 'owHeather', map: 'l', encounter: 'hed' },
  h: { name: 'hygge', sprite: 'owClearcut', map: 'M', encounter: 'hed' },
  g: { name: 'slaggvarp', sprite: 'owSlag', map: 'K', encounter: 'hed' },
  d: { name: 'sandtag', sprite: 'owSandpit', map: 'M', encounter: 'hed' },
  k: { name: 'kalfjäll', sprite: 'owFell', map: 'w', encounter: 'fjall' },
  f: { name: 'skog', sprite: 'owForest', map: 'm', encounter: 'skog' },
  _: { name: 'strand', sprite: 'owSand', map: 't', encounter: 'strand' },
  r: { name: 'vass', sprite: 'owReeds', map: 't', encounter: 'strand' },
  j: { name: 'brygga', sprite: 'owDock', map: 't', encounter: 'strand' },
  '|': { name: 'väg', sprite: 'owRoad', map: 'W', encounter: 'ang' },
  '-': { name: 'väg', sprite: 'owRoadH', map: 'W', encounter: 'ang' },
  '+': { name: 'vägkorsning', sprite: 'owRoad', map: 'W', encounter: 'ang' },
  '=': { name: 'bro', sprite: 'owBridge', map: 'W', encounter: 'ang' },

  // --- Ground that needs a treasure ---------------------------------------------------
  '~': { name: 'vatten', sprite: 'owWater', map: 'U', needs: 'eka', encounter: 'strand' },
  s: { name: 'myr', sprite: 'owSwamp', map: 'v', needs: 'stovlar', encounter: 'myr' },
  D: { name: 'gruvort', sprite: 'owTunnel', map: 'k', needs: 'karbidlampa', encounter: 'skog' },
  N: { name: 'nattskog', sprite: 'owNightForest', map: 'n', needs: 'ficklampa', encounter: 'skog' },
  // The hidden path through the dense spruce: looks like the rest of the
  // thicket until the radio's static gives it away (then drawn as owHiddenPath).
  H: { name: 'dold stig', sprite: 'owDenseForest', map: 'K', needs: 'radio', encounter: 'skog' },
  // A door in the cliff, also found with the radio (then drawn as owCliffDoor).
  E: { name: 'dold bergsdörr', sprite: 'owCliff', map: 'g', needs: 'radio', encounter: 'fjall' },

  // --- Borders that never open ---------------------------------------------------------
  '^': { name: 'berg', sprite: 'owMountain', map: 'G', blocked: true },
  F: { name: 'tät granskog', sprite: 'owDenseForest', map: 'K', blocked: true },
  w: { name: 'fors', sprite: 'owRapids', map: 'c', blocked: true },
  b: { name: 'bortspolad bro', sprite: 'owBrokenBridge', map: 'B', blocked: true },
  X: { name: 'stup', sprite: 'owCliff', map: 'g', blocked: true },
  a: { name: 'igenrasad gruvort', sprite: 'owAdit', map: 'g', blocked: true },
  W: { name: 'stengärdsgård', sprite: 'owWall', map: 'M', blocked: true, landmark: true },

  // --- Landmarks: forgotten things along the way --------------------------------------
  u: { name: 'riven gärdsgård', sprite: 'owWallBroken', map: 'M', encounter: 'ang', landmark: true },
  o: { name: 'offerkälla', sprite: 'owSpring', map: 'M', encounter: 'ang', landmark: true, visitable: true },
  t: { name: 'ödetorp', sprite: 'owCroft', map: 'M', encounter: 'odetorp', landmark: true, visitable: true },
  c: { name: 'jordkällare', sprite: 'owCellar', map: 'M', encounter: 'ang', landmark: true, visitable: true },
  L: { name: 'lada', sprite: 'owBarn', map: 'M', encounter: 'ang', landmark: true, visitable: true },
  O: { name: 'bautasten', sprite: 'owStones', map: 'M', encounter: 'ang', landmark: true, visitable: true },
  i: { name: 'milstolpe', sprite: 'owMilestone', map: 'M', encounter: 'ang', landmark: true, visitable: true },
  x: { name: 'vägkors', sprite: 'owCross', map: 'M', encounter: 'ang', landmark: true, visitable: true },
  y: { name: 'grind', sprite: 'owGate', map: 'M', encounter: 'ang', landmark: true },
  e: { name: 'övervuxen stig', sprite: 'owOvergrown', map: 'M', encounter: 'skog', landmark: true },
  q: { name: 'gamla kyrkogården', sprite: 'owChurchyard', map: 'M', encounter: 'ang', landmark: true, visitable: true },
  // A waterfall with a cave behind it, seen only when standing beside it.
  A: { name: 'vattenfall', sprite: 'owWaterfall', map: 'c', encounter: 'skog', landmark: true },

  // --- Places (villages, temples, caves) – drawn on grass ------------------------------
  V: { name: 'Mormors by', sprite: 'owVillage', map: 'M', encounter: 'ang' },
  B: { name: 'by på kartan', sprite: 'owVillage', map: 'M', encounter: 'ang' },
  K: { name: 'Stenkyrkan', sprite: 'owChurch', map: 'M', encounter: 'ang' },
  G: { name: 'Björkhagen', sprite: 'owGlade', map: 'M', encounter: 'skog' },
  M: { name: 'gruvan', sprite: 'owMine', map: 'M', encounter: 'skog' },
  Q: { name: 'kvarnen', sprite: 'owMill', map: 'M', encounter: 'skog' },
  Y: { name: 'fyren', sprite: 'owLighthouse', map: 't', encounter: 'strand' },
  P: { name: 'folkparken', sprite: 'owPark', map: 'M', encounter: 'aker' },
  Z: { name: 'fäboden i skogen', sprite: 'owFabod', map: 'M', encounter: 'skog' },
  T: { name: 'Trollberget', sprite: 'owTroll', map: 'g', encounter: 'fjall' },
  C: { name: 'grotta', sprite: 'owCave', map: 'M', encounter: 'skog' },
};

/** Place characters, drawn on top of grass. */
export const PLACE_CHARS = 'VBKGMQYPZTC';

/** Characters that can never be walked on. */
export const BLOCKED_CHARS = Object.keys(TERRAIN).filter((c) => TERRAIN[c].blocked).join('');

/** Ground that needs a treasure: character → item. */
export const NEEDS: Readonly<Record<string, string>> = Object.fromEntries(
  Object.entries(TERRAIN).flatMap(([c, d]) => (d.needs ? [[c, d.needs]] : [])),
);
