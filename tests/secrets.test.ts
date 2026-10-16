import { describe, expect, it } from 'vitest';
import { AREAS } from '../src/data/areas';
import { DIALOG } from '../src/data/dialog';
import { ITEMS } from '../src/data/items';
import { OVERWORLD } from '../src/data/overworld';
import { TEMPLES } from '../src/data/temples';
import type { AreaDef, DialogAction } from '../src/data/types';
import { CONTAINER_HP, CONTAINER_MP } from '../src/data/progression';
import { addContainer, containerCount, hpMax, mpMax, newGame } from '../src/game/state';
import { deserialize, serialize } from '../src/game/save';

const TREASURES = new Set(TEMPLES.flatMap((t) => (t.treasure ? [t.treasure] : [])));
const allActions: DialogAction[] = Object.values(DIALOG).flatMap((d) => [...(d.actions ?? []), ...(d.choices ?? []).flatMap((c) => c.actions ?? [])]);

/** Cells reachable from the area's entries (a coarse, physics-free connectivity check). */
function reachable(a: AreaDef, withRadio: boolean): Set<string> {
  const t = a.tiles;
  const solid = (ch: string): boolean => ch === '#' || ch === 'L' || (ch === '?' && !withRadio);
  const seen = new Set<string>();
  const stack: Array<[number, number]> = [];
  t.forEach((row, y) => [...row].forEach((ch, x) => {
    if (/[A-Z@]/.test(ch) && ch !== 'L' && ch !== 'X' && ch !== 'B' && ch !== 'M' && ch !== 'T') stack.push([x, y]);
  }));
  // Walking in from the left or right edge counts too.
  for (let y = 0; y < t.length; y++) {
    if (!solid(t[y][0])) stack.push([0, y]);
    if (!solid(t[y][t[y].length - 1])) stack.push([t[y].length - 1, y]);
  }
  while (stack.length) {
    const [x, y] = stack.pop()!;
    const k = `${x},${y}`;
    const ch = t[y]?.[x];
    if (ch === undefined || seen.has(k) || solid(ch)) continue;
    seen.add(k);
    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }
  return seen;
}

/** Locked doors are passable once a key is found; a locked door counts as reached when a cell beside it is. */
function cellsOf(a: AreaDef, chars: string): Array<[number, number]> {
  const out: Array<[number, number]> = [];
  a.tiles.forEach((row, y) => [...row].forEach((ch, x) => { if (chars.includes(ch)) out.push([x, y]); }));
  return out;
}

function containersPlaced(): Array<{ area: string; kind: 'liv' | 'magi'; via: string }> {
  const out: Array<{ area: string; kind: 'liv' | 'magi'; via: string }> = [];
  for (const a of Object.values(AREAS)) {
    for (const [x, y] of cellsOf(a, 'hp')) out.push({ area: a.id, kind: a.tiles[y][x] === 'h' ? 'liv' : 'magi', via: 'tile' });
    for (const ls of a.lampSecrets ?? []) if (ls.container) out.push({ area: a.id, kind: ls.container, via: ls.item });
    for (const r of a.rewards ?? []) out.push({ area: a.id, kind: r.kind, via: r.flag });
  }
  for (const act of allActions) if (act.type === 'container') out.push({ area: 'dialog', kind: act.kind, via: act.id });
  return out;
}

describe('secrets', () => {
  it('has seven life and seven magic containers (hidden caves and the small places on the map)', () => {
    const c = containersPlaced();
    expect(c.filter((x) => x.kind === 'liv')).toHaveLength(7);
    expect(c.filter((x) => x.kind === 'magi')).toHaveLength(7);
  });

  it('temples 1–4 each hide a radio room with a container', () => {
    for (const temple of ['krypta', 'gruvan', 'kvarnen', 'fyren']) {
      const rooms = Object.values(AREAS).filter((a) => a.temple === temple);
      const hidden = rooms.filter((a) => {
        const without = reachable(a, false);
        const withRadio = reachable(a, true);
        return cellsOf(a, 'hp').some(([x, y]) => !without.has(`${x},${y}`) && withRadio.has(`${x},${y}`));
      });
      expect(hidden.length, temple).toBeGreaterThanOrEqual(1);
    }
  });

  it('every container can be reached with the treasures in the game', () => {
    expect(TREASURES.has('radio')).toBe(true);
    for (const a of Object.values(AREAS)) {
      const all = reachable(a, true);
      for (const [x, y] of cellsOf(a, 'hp')) expect(all.has(`${x},${y}`), `${a.id} ${x},${y}`).toBe(true);
      for (const ls of a.lampSecrets ?? []) {
        expect(TREASURES.has(ls.item), ls.item).toBe(true);
        expect(ITEMS[ls.item]).toBeDefined();
        expect(all.has(`${ls.tx},${ls.ty}`), `${a.id} lamp secret ${ls.tx},${ls.ty}`).toBe(true);
        if (ls.dialog) expect(DIALOG[ls.dialog], ls.dialog).toBeDefined();
      }
    }
  });

  it('no secret is needed to finish the game: keys, doors, altars and bosses never hide behind a radio wall', () => {
    for (const a of Object.values(AREAS)) {
      // Trollberget comes after all six temples, so the radio is guaranteed there.
      if (a.temple === 'trollberget') continue;
      const without = reachable(a, false);
      const near = (x: number, y: number): boolean =>
        [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => without.has(`${x + dx},${y + dy}`));
      for (const [x, y] of cellsOf(a, 'kXBL')) expect(near(x, y), `${a.id} ${a.tiles[y][x]} at ${x},${y}`).toBe(true);
      for (const id of Object.keys(a.doors ?? {})) {
        for (const [x, y] of cellsOf(a, id)) expect(without.has(`${x},${y}`), `${a.id} door ${id}`).toBe(true);
      }
    }
  });

  it('the caves on the map need a treasure to reach (eka or stövlar)', () => {
    const t = OVERWORLD.tiles;
    const flood = (items: Set<string>): Set<string> => {
      const seen = new Set<string>();
      const stack = [[OVERWORLD.start.x, OVERWORLD.start.y]];
      while (stack.length) {
        const [x, y] = stack.pop()!;
        const k = `${x},${y}`;
        const ch = t[y]?.[x];
        if (!ch || seen.has(k) || ch === '^') continue;
        const need = OVERWORLD.needs[ch];
        if (need && !items.has(need)) continue;
        seen.add(k);
        stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
      }
      return seen;
    };
    const caves = OVERWORLD.places.filter((p) => t[p.y][p.x] === 'C');
    expect(caves.length).toBeGreaterThanOrEqual(1);
    const bare = flood(new Set());
    const all = flood(TREASURES);
    for (const c of caves) {
      expect(AREAS[c.area!], c.name).toBeDefined();
      expect(bare.has(`${c.x},${c.y}`), `${c.name} without treasures`).toBe(false);
      expect(all.has(`${c.x},${c.y}`), `${c.name} with treasures`).toBe(true);
    }
  });
});

describe('containers', () => {
  it('each container counts once and raises the max', () => {
    const s = newGame();
    const hp0 = hpMax(s);
    const mp0 = mpMax(s);
    expect(addContainer(s, 'liv', 'krypta_1:2,4')).toBe(true);
    expect(addContainer(s, 'liv', 'krypta_1:2,4')).toBe(false);
    expect(addContainer(s, 'magi', 'krypta_1:2,4')).toBe(true);
    expect(containerCount(s, 'liv')).toBe(1);
    expect(hpMax(s)).toBe(hp0 + CONTAINER_HP);
    expect(mpMax(s)).toBe(mp0 + CONTAINER_MP);
    expect(s.hp).toBe(hpMax(s));
  });

  it('are saved and loaded, ignoring junk and duplicates', () => {
    const s = newGame();
    addContainer(s, 'liv', 'a');
    addContainer(s, 'liv', 'b');
    s.hp = hpMax(s);
    const back = deserialize(serialize(s))!.state;
    expect(back.containers).toEqual(['liv:a', 'liv:b']);
    expect(back.hp).toBe(hpMax(s));
    const raw = JSON.parse(serialize(s));
    raw.state.containers = ['liv:a', 'liv:a', 'nonsense', 3, 'magi:x'];
    const fixed = deserialize(JSON.stringify(raw))!.state;
    expect(fixed.containers).toEqual(['liv:a', 'magi:x']);
  });

  it('an old save without containers still loads', () => {
    const raw = JSON.parse(serialize(newGame()));
    delete raw.state.containers;
    expect(deserialize(JSON.stringify(raw))!.state.containers).toEqual([]);
  });
});

describe('sword upgrades', () => {
  it('each upgrade adds one point of damage', async () => {
    const { swordDamage, SWORD_UPGRADES } = await import('../src/game/progression');
    expect(swordDamage(1)).toBe(2);
    expect(swordDamage(1, ['klingaHardad'])).toBe(3);
    expect(swordDamage(1, [...SWORD_UPGRADES])).toBe(5);
    for (const u of SWORD_UPGRADES) expect(ITEMS[u], u).toBeDefined();
  });

  it('the materials lie in reachable spots and the smith turns them into upgrades', () => {
    const places = Object.values(AREAS).flatMap((a) => [
      ...(a.finds ?? []).map((f) => ({ a, item: f.item, tx: f.tx, ty: f.ty })),
      ...(a.lampSecrets ?? []).filter((l) => l.gives).map((l) => ({ a, item: l.gives!, tx: l.tx, ty: l.ty })),
    ]);
    for (const item of ['malm', 'askstenen', 'silverbeslag']) {
      const at = places.filter((p) => p.item === item);
      expect(at, item).toHaveLength(1);
      const p = at[0];
      expect(reachable(p.a, true).has(`${p.tx},${p.ty}`), `${item} in ${p.a.id}`).toBe(true);
      expect(DIALOG[`hittade_${item}`], item).toBeDefined();
    }
    for (const [mat, up] of [['malm', 'klingaHardad'], ['askstenen', 'klingaBlank']]) {
      expect(allActions).toContainEqual({ type: 'takeItem', item: mat });
      expect(allActions).toContainEqual({ type: 'flag', flag: `${mat}_klar` });
      expect(allActions).toContainEqual({ type: 'giveItem', item: up });
    }
  });
});

/**
 * Where moving platforms carry Dagny: for each platform, the cells she can
 * stand in while riding it (a lift's whole column, a cart's or log's whole
 * run, every cell a wheel's paddles pass). Riding joins them all.
 */
function rides(a: AreaDef): Array<Set<string>> {
  return (a.platforms ?? []).map((p) => {
    const cells = new Set<string>();
    const add = (x: number, surface: number): void => void cells.add(`${x},${surface - 1}`);
    if (p.kind === 'lift') {
      for (let r = Math.min(p.ty, p.toTy); r <= Math.max(p.ty, p.toTy); r++) for (const x of [p.tx, p.tx + 1]) add(x, r);
    } else if (p.kind === 'cart' || p.kind === 'log') {
      const surface = p.kind === 'log' ? p.ty + 1 : p.ty;
      for (let x = Math.min(p.tx, p.toTx); x <= Math.max(p.tx, p.toTx) + 1; x++) add(x, surface);
    } else {
      const rx = p.radius ?? 2;
      const ry = p.radiusY ?? rx;
      for (let i = 0; i < 32; i++) add(Math.round(p.tx + Math.cos((i / 32) * Math.PI * 2) * rx), Math.round(p.ty + Math.sin((i / 32) * Math.PI * 2) * ry));
    }
    return cells;
  });
}

/**
 * Coarse platformer reachability: Dagny stands on a cell with floor under it,
 * walks, falls, and jumps up to 3 tiles high and 3 tiles across (a running jump
 * carries her 3.1 tiles), and rides
 * moving platforms anywhere along their way. Rooms with wind or dance
 * squares are left out (they need timing).
 */
function softlocks(a: AreaDef, radio: boolean): string[] {
  const t = a.tiles;
  const h = t.length;
  const w = t[0].length;
  const groups = rides(a);
  const onRide = (x: number, y: number): boolean => groups.some((g) => g.has(`${x},${y}`));
  const solid = (x: number, y: number): boolean => y >= h || (x >= 0 && x < w && y >= 0 && (t[y][x] === '#' || t[y][x] === 'L' || t[y][x] === '!' || (t[y][x] === '?' && !radio)));
  const free = (x: number, y: number): boolean => x >= 0 && x < w && y < h && (y < 0 || (!solid(x, y) && !'^~n'.includes(t[y][x])));
  const floor = (x: number, y: number): boolean => y + 1 < h && y + 1 >= 0 && (solid(x, y + 1) || '=%&'.includes(t[y + 1][x] ?? '') || onRide(x, y));
  const stand = (x: number, y: number): boolean => free(x, y) && free(x, y - 1) && floor(x, y);
  const land = (x: number, y: number): [number, number] | null => {
    let yy = y;
    while (yy < h && free(x, yy) && !floor(x, yy)) yy++;
    return yy < h && stand(x, yy) ? [x, yy] : null;
  };
  const moves = (x: number, y: number): Array<[number, number]> => {
    const out: Array<[number, number]> = [];
    for (const dx of [-1, 1]) {
      if (free(x + dx, y) && free(x + dx, y - 1)) {
        const l = land(x + dx, y);
        if (l) out.push(l);
      }
    }
    for (let up = 1; up <= 3 && free(x, y - up); up++) {
      for (let dx = -3; dx <= 3; dx++) {
        let ok = true;
        for (let cx = x; cx !== x + dx + Math.sign(dx || 1) && ok; cx += Math.sign(dx || 1)) if (!free(cx, y - up)) ok = false;
        const l = ok ? land(x + dx, y - up) : null;
        if (l) out.push(l);
        if (dx === 0) continue;
      }
    }
    for (const g of groups) {
      if (!g.has(`${x},${y}`)) continue;
      for (const k of g) {
        const [gx, gy] = k.split(',').map(Number);
        if (free(gx, gy) && free(gx, gy - 1)) out.push([gx, gy]);
      }
    }
    return out;
  };
  const exits = new Set<string>();
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const ch = t[y][x];
      if (((x === 0 || x === w - 1) && free(x, y)) || (/[A-Z]/.test(ch) && !'LXBMT'.includes(ch))) exits.add(`${x},${y}`);
    }
  }
  const key = (c: [number, number]): string => `${c[0]},${c[1]}`;
  const starts = [...exits].map((k) => k.split(',').map(Number) as [number, number]).map(([x, y]) => land(x, y)).filter((c): c is [number, number] => !!c);
  const seen = new Map<string, [number, number]>();
  const stack = [...starts];
  while (stack.length) {
    const c = stack.pop()!;
    if (seen.has(key(c))) continue;
    seen.set(key(c), c);
    for (const n of moves(...c)) if (!seen.has(key(n))) stack.push(n);
  }
  const good = new Set<string>([...seen.keys()].filter((k) => {
    const [x, y] = k.split(',').map(Number);
    return exits.has(k) || exits.has(`${x - 1},${y}`) || exits.has(`${x + 1},${y}`) || x === 0 || x === w - 1;
  }));
  for (let changed = true; changed;) {
    changed = false;
    for (const [k, c] of seen) {
      if (!good.has(k) && moves(...c).some((n) => good.has(key(n)))) {
        good.add(k);
        changed = true;
      }
    }
  }
  return [...seen.keys()].filter((k) => !good.has(k));
}

describe('no pits to get stuck in', () => {
  it('from every place Dagny can stand she can get back to an exit (without keys, with or without the radio)', () => {
    const bad: string[] = [];
    for (const a of Object.values(AREAS)) {
      if (a.wind || a.beat) continue;
      for (const radio of [false, true]) {
        const stuck = softlocks(a, radio);
        if (stuck.length) bad.push(`${a.id} radio=${radio}: ${stuck.join(' ')}`);
      }
    }
    expect(bad).toEqual([]);
  });
});
