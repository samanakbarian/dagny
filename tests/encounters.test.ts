import { describe, expect, it } from 'vitest';
import { AREAS } from '../src/data/areas';
import { DIALOG } from '../src/data/dialog';
import { ENCOUNTER_TABLES, TERRAIN_TYPE, type TerrainType } from '../src/data/encounters';
import { OVERWORLD } from '../src/data/overworld';
import { pickEncounter } from '../src/game/encounters';

const tables = Object.entries(ENCOUNTER_TABLES) as Array<[TerrainType, (typeof ENCOUNTER_TABLES)[TerrainType]]>;

describe('overworld encounters', () => {
  it('every option points to a real area or dialog, and areas hold creatures', () => {
    for (const [, options] of tables) {
      for (const o of options) {
        if ('area' in o) {
          const a = AREAS[o.area];
          expect(a, o.area).toBeDefined();
          expect(a.kind).toBe('encounter');
          expect(a.tiles.join(''), `${o.area} has W and E`).toMatch(/W[\s\S]*E/);
        } else {
          expect(DIALOG[o.dialog], o.dialog).toBeDefined();
        }
      }
    }
  });

  it('weights add up to 1, with 10–15 % friendly meetings and at least 3 fights per terrain', () => {
    for (const [type, options] of tables) {
      const total = options.reduce((s, o) => s + o.weight, 0);
      expect(total, type).toBeCloseTo(1, 9);
      const friendly = options.filter((o) => 'dialog' in o).reduce((s, o) => s + o.weight, 0);
      expect(friendly, type).toBeGreaterThanOrEqual(0.1);
      expect(friendly, type).toBeLessThanOrEqual(0.15);
      expect(options.filter((o) => 'area' in o).length, type).toBeGreaterThanOrEqual(3);
      expect(new Set(options.map((o) => o.id)).size, `${type} ids unique`).toBe(options.length);
    }
  });

  it('every walkable terrain on the map has a table', () => {
    const places = new Set(OVERWORLD.places.map((p) => OVERWORLD.tiles[p.y][p.x]));
    for (const row of OVERWORLD.tiles) {
      for (const ch of row) {
        if (ch === '^' || ch === '~' || places.has(ch)) continue;
        expect(TERRAIN_TYPE[ch], `terrain '${ch}'`).toBeDefined();
      }
    }
    for (const e of OVERWORLD.encounters) if (e.table) expect(ENCOUNTER_TABLES[e.table]).toBeDefined();
  });

  it('never picks the same meeting twice in a row', () => {
    for (const [, options] of tables) {
      let last: string | null = null;
      for (let i = 0; i < 400; i++) {
        const o = pickEncounter(options, (i * 0.6180339) % 1, last);
        expect(o.id).not.toBe(last);
        last = o.id;
      }
    }
  });

  it('picks by weight', () => {
    const options = ENCOUNTER_TABLES.ang;
    const counts = new Map<string, number>();
    const n = 10000;
    for (let i = 0; i < n; i++) {
      const o = pickEncounter(options, (i + 0.5) / n, null);
      counts.set(o.id, (counts.get(o.id) ?? 0) + 1);
    }
    for (const o of options) expect((counts.get(o.id) ?? 0) / n).toBeCloseTo(o.weight, 2);
  });
});
