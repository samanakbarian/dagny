import { describe, expect, it } from 'vitest';
import { AREAS } from '../src/data/areas';
import { DIALOG } from '../src/data/dialog';
import { OVERWORLD } from '../src/data/overworld';
import { reachableTiles } from '../src/game/reach';
import { TEMPLES, VILLAGES } from '../src/data/temples';

const t = OVERWORLD.tiles;
const at = (x: number, y: number): string | undefined => t[y]?.[x];

/** Tiles Dagny can walk to from the start carrying these items. */
function reach(items: Iterable<string>): Set<string> {
  const have = new Set(items);
  const seen = new Set<string>();
  const stack: Array<[number, number]> = [[OVERWORLD.start.x, OVERWORLD.start.y]];
  while (stack.length) {
    const [x, y] = stack.pop()!;
    const k = `${x},${y}`;
    const ch = at(x, y);
    if (!ch || seen.has(k) || OVERWORLD.blocked.includes(ch)) continue;
    const need = OVERWORLD.needs[ch];
    if (need && !have.has(need)) continue;
    seen.add(k);
    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }
  return seen;
}

const placeOfArea = (area: string) => OVERWORLD.places.find((p) => p.area === area)!;

describe('the overworld', () => {
  it('is 96 × 72 tiles, ringed by mountains', () => {
    expect(t.length).toBe(72);
    for (const r of t) expect(r.length).toBe(96);
    expect(t[0]).toMatch(/^\^+$/);
    expect(t[71]).toMatch(/^\^+$/);
  });

  it('each temple needs the treasure of the one before it, in order', () => {
    const order = TEMPLES.filter((x) => x.id !== 'trollberget');
    const carried: string[] = [];
    for (const temple of order) {
      const p = placeOfArea(temple.entryArea!);
      const withAll = reach(carried);
      expect(withAll.has(`${p.x},${p.y}`), `${temple.name} with ${carried.join(', ') || 'nothing'}`).toBe(true);
      if (carried.length) {
        const withoutLast = reach(carried.slice(0, -1));
        expect(withoutLast.has(`${p.x},${p.y}`), `${temple.name} without ${carried.at(-1)}`).toBe(false);
      }
      if (temple.treasure) carried.push(temple.treasure);
    }
    // Trollberget is on the road from the last region, and waits for the six flags.
    const troll = placeOfArea('troll_1');
    expect(reach(carried).has(`${troll.x},${troll.y}`)).toBe(true);
    expect(reach(carried.filter((i) => i !== 'radio')).has(`${troll.x},${troll.y}`), 'Trollberget without the radio').toBe(false);
    expect(troll.requires).toHaveLength(6);
  });

  it('every place is reachable with all treasures, and every gate has a hint', () => {
    const all = reach(TEMPLES.flatMap((x) => (x.treasure ? [x.treasure] : [])));
    for (const p of OVERWORLD.places) {
      expect(all.has(`${p.x},${p.y}`), p.name).toBe(true);
      if (p.area) expect(AREAS[p.area], p.area).toBeDefined();
    }
    for (const item of Object.values(OVERWORLD.needs)) expect(DIALOG[`behover_${item}`], item).toBeDefined();
  });

  it('every village has a free tile below it (where old saves are put)', () => {
    for (const v of VILLAGES) {
      const p = placeOfArea(v.area!);
      const ch = at(p.x, p.y + 1)!;
      expect('^~'.includes(ch), `${v.name}: '${ch}'`).toBe(false);
    }
  });

  it('every way back to the overworld lands on a walkable tile next to its place', () => {
    for (const a of Object.values(AREAS)) {
      const exits = [a.left, a.right, ...Object.values(a.doors ?? {})].filter((e) => e?.to === 'overworld' && e.ow);
      for (const e of exits) {
        const ch = at(e!.ow!.x, e!.ow!.y)!;
        expect('^~'.includes(ch), `${a.id} → ${e!.ow!.x},${e!.ow!.y} '${ch}'`).toBe(false);
        const near = OVERWORLD.places.some((p) => Math.abs(p.x - e!.ow!.x) + Math.abs(p.y - e!.ow!.y) <= 2);
        expect(near, a.id).toBe(true);
      }
    }
  });
});

describe('a new game', () => {
  it('starts on the overworld start tile, in the home valley', async () => {
    const { newGame } = await import('../src/game/state');
    expect(newGame().ow).toEqual(OVERWORLD.start);
    const mormor = placeOfArea('mormors_by');
    expect(Math.abs(mormor.x - OVERWORLD.start.x) + Math.abs(mormor.y - OVERWORLD.start.y)).toBeLessThanOrEqual(2);
  });
});

describe('the story on the map', () => {
  it('Kyrkbyn and Signalstranden face each other across open water (Dagmar’s lamp, Hulda’s answer)', () => {
    const k = placeOfArea('kyrkbyn');
    const s = placeOfArea('signalstranden');
    expect(Math.abs(k.y - s.y)).toBeLessThanOrEqual(1);
    const between = t[s.y].slice(k.x + 1, s.x);
    // Water, shore and low ground in between: no forest or rock hides the one light from the other.
    expect(between).not.toMatch(/[f^FXaNW]/);
    expect(between.replace(/[^~znR]/g, '').length).toBeGreaterThan(20);
  });

  it('Signalstranden and the islands are reached by boat, not on foot', () => {
    const onFoot = reachableTiles([]);
    const byBoat = reachableTiles(['eka']);
    for (const area of ['signalstranden', 'eremitholmen', 'masskaret']) {
      const p = placeOfArea(area);
      expect(onFoot.has(`${p.x},${p.y}`), area).toBe(false);
      expect(byBoat.has(`${p.x},${p.y}`), area).toBe(true);
    }
  });
});

describe('the marsh maze (chapter 5)', () => {
  const ALL = ['eka', 'karbidlampa', 'stovlar', 'ficklampa', 'radio'];
  /** Steps from a to b over walkable ground, never onto quagmire (-1 if there is no way). */
  const steps = (a: { x: number; y: number }, b: { x: number; y: number }): number => {
    const ok = reachableTiles(ALL);
    const dist = new Map<string, number>([[`${a.x},${a.y}`, 0]]);
    const queue = [a];
    while (queue.length) {
      const p = queue.shift()!;
      const d = dist.get(`${p.x},${p.y}`)!;
      if (p.x === b.x && p.y === b.y) return d;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const k = `${p.x + dx},${p.y + dy}`;
        if (ok.has(k) && !dist.has(k)) {
          dist.set(k, d + 1);
          queue.push({ x: p.x + dx, y: p.y + dy });
        }
      }
    }
    return -1;
  };

  it('winds: the way through is much longer than the straight line', () => {
    const north = { x: 67, y: 28 };
    const cave = OVERWORLD.places.find((p) => p.name === 'Tjuvgrottan')!;
    const coast = { x: 70, y: 47 };
    const d1 = steps(north, cave);
    const d2 = steps(cave, coast);
    expect(d1).toBeGreaterThan(0);
    expect(d2).toBeGreaterThan(0);
    expect(d1).toBeGreaterThan(1.2 * (Math.abs(cave.x - north.x) + Math.abs(cave.y - north.y)));
    expect(d2).toBeGreaterThan(1.2 * (Math.abs(cave.x - coast.x) + Math.abs(cave.y - coast.y)));
  });

  it('has quagmire and the three landmarks to steer by', () => {
    const all = t.join('');
    expect(all.split('v').length - 1).toBeGreaterThan(200);
    for (const ch of 'pIJ') expect(all.includes(ch), ch).toBe(true);
  });

  it('the quagmire is the marsh’s own: without the boots nothing of it is in reach', () => {
    const noBoots = reachableTiles(['eka', 'karbidlampa']);
    for (const k of noBoots) {
      const [x, y] = k.split(',').map(Number);
      expect('svpIJ'.includes(at(x, y)!), k).toBe(false);
    }
  });
});
