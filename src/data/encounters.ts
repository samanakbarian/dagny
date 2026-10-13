/**
 * What happens when Dagny bumps into a creature on the overworld. Each
 * terrain type has its own table: several fights (side-view areas, some at
 * night or in a storm) and a few friendly meetings (a dialog instead of a
 * fight). The weights in a table add up to 1.
 */
export type TerrainType = 'ang' | 'skog' | 'myr' | 'strand';

/** Overworld terrain character → table. */
export const TERRAIN_TYPE: Readonly<Record<string, TerrainType>> = {
  '.': 'ang',
  ':': 'ang',
  '|': 'ang',
  '-': 'ang',
  '+': 'ang',
  f: 'skog',
  s: 'myr',
  _: 'strand',
};

export type EncounterOption =
  | { id: string; weight: number; area: string }
  | { id: string; weight: number; dialog: string };

export const ENCOUNTER_TABLES: Readonly<Record<TerrainType, readonly EncounterOption[]>> = {
  ang: [
    { id: 'ang', weight: 0.4, area: 'mote_ang' },
    { id: 'rag', weight: 0.28, area: 'mote_ang2' },
    { id: 'ang_natt', weight: 0.2, area: 'mote_ang_natt' },
    { id: 'vatte_liv', weight: 0.04, dialog: 'mote_vatte_liv' },
    { id: 'vandrare_lore', weight: 0.05, dialog: 'mote_vandrare_lore' },
    { id: 'irrbloss_radio', weight: 0.03, dialog: 'mote_irrbloss_radio' },
  ],
  skog: [
    { id: 'skog', weight: 0.4, area: 'mote_skog' },
    { id: 'granmo', weight: 0.28, area: 'mote_skog2' },
    { id: 'skog_storm', weight: 0.2, area: 'mote_skog_storm' },
    { id: 'vatte_magi', weight: 0.04, dialog: 'mote_vatte_magi' },
    { id: 'vandrare_vag', weight: 0.05, dialog: 'mote_vandrare_vag' },
    { id: 'irrbloss_holmen', weight: 0.03, dialog: 'mote_irrbloss_holmen' },
  ],
  myr: [
    { id: 'myr', weight: 0.4, area: 'mote_myr' },
    { id: 'karr', weight: 0.28, area: 'mote_myr2' },
    { id: 'myr_natt', weight: 0.2, area: 'mote_myr_natt' },
    { id: 'vatte_liv', weight: 0.04, dialog: 'mote_vatte_liv' },
    { id: 'vandrare_fyr', weight: 0.04, dialog: 'mote_vandrare_fyr' },
    { id: 'irrbloss_grottan', weight: 0.04, dialog: 'mote_irrbloss_grottan' },
  ],
  strand: [
    { id: 'strand', weight: 0.4, area: 'mote_strand' },
    { id: 'klapper', weight: 0.28, area: 'mote_strand2' },
    { id: 'strand_storm', weight: 0.2, area: 'mote_strand_storm' },
    { id: 'vatte_magi', weight: 0.04, dialog: 'mote_vatte_magi' },
    { id: 'vandrare_lore', weight: 0.04, dialog: 'mote_vandrare_lore' },
    { id: 'irrbloss_holmen', weight: 0.04, dialog: 'mote_irrbloss_holmen' },
  ],
};
