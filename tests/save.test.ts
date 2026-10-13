import { describe, expect, it } from 'vitest';
import { MemoryStore, SafeLocalStore } from '../src/engine/storage';
import { SAVE_KEY, SAVE_VERSION, deserialize, readSave, serialize, writeSave } from '../src/game/save';
import { newGame } from '../src/game/state';
import { maxHp } from '../src/game/progression';

describe('save format', () => {
  it('round-trips a game state', () => {
    const s = newGame();
    s.xp = 123;
    s.levels.styrka = 3;
    s.spells.push('lakning');
    s.selectedSpell = 'lakning';
    s.items.push('svard', 'eka');
    s.flags.push('intro_done');
    s.keys.krypta = 2;
    s.opened.push('krypta_1:30,3');
    s.loc = { area: 'krypta_2', x: 100, y: 50 };
    s.checkpoint = { area: 'krypta_1', x: 10, y: 20 };
    const back = deserialize(serialize(s, 42));
    expect(back).not.toBeNull();
    expect(back!.v).toBe(SAVE_VERSION);
    expect(back!.savedAt).toBe(42);
    expect(back!.state).toEqual(s);
  });

  it('rejects garbage', () => {
    expect(deserialize(null)).toBeNull();
    expect(deserialize('')).toBeNull();
    expect(deserialize('not json')).toBeNull();
    expect(deserialize('[]')).toBeNull();
    expect(deserialize('{"v":1}')).toBeNull();
  });

  it('rejects saves from a newer version', () => {
    expect(deserialize(JSON.stringify({ v: SAVE_VERSION + 1, state: newGame() }))).toBeNull();
  });

  it('repairs broken fields instead of crashing', () => {
    const text = JSON.stringify({
      v: 1,
      savedAt: 'x',
      state: {
        hp: 999,
        mp: -5,
        xp: -10,
        levels: { styrka: 42, magi: 'a', liv: 0 },
        spells: ['lakning', 'fake', 7],
        selectedSpell: 'fake',
        skills: ['nedatstot', 'nope'],
        items: ['eka', null],
        keys: { krypta: -3, gruvan: 2.7 },
        flags: 'nope',
        loc: { area: 'krypta_1', x: 'a' },
        checkpoint: 5,
      },
    });
    const f = deserialize(text)!;
    expect(f).not.toBeNull();
    const s = f.state;
    // A version-1 save: the (clamped) old max 8 becomes the new max 12.
    expect(s.levels).toEqual({ styrka: 12, magi: 1, liv: 1 });
    expect(s.hp).toBe(maxHp(1));
    expect(s.mp).toBe(0);
    expect(s.xp).toBe(0);
    expect(s.spells).toEqual(['lakning']);
    expect(s.selectedSpell).toBe('lakning');
    expect(s.skills).toEqual(['nedatstot']);
    expect(s.items).toEqual(['eka']);
    expect(s.keys).toEqual({ krypta: 0, gruvan: 2 });
    expect(s.flags).toEqual([]);
    expect(s.loc.area).toBe('krypta_1');
    expect(typeof s.loc.x).toBe('number');
    expect(s.checkpoint).toEqual(newGame().loc);
  });
});

describe('storage', () => {
  it('writes and reads through a store', () => {
    const store = new MemoryStore();
    const s = newGame();
    s.xp = 7;
    expect(writeSave(store, s)).toBe(true);
    expect(store.get(SAVE_KEY)).toContain('"xp":7');
    expect(readSave(store)!.state.xp).toBe(7);
  });

  it('keeps working without localStorage', () => {
    // In the node test environment localStorage does not exist.
    const store = new SafeLocalStore();
    expect(store.available).toBe(false);
    expect(store.set('a', '1')).toBe(false);
    expect(store.get('a')).toBe('1');
    store.remove('a');
    expect(store.get('a')).toBeNull();
  });

  it('survives a throwing localStorage', () => {
    const g = globalThis as { localStorage?: unknown };
    g.localStorage = {
      getItem: () => { throw new Error('blocked'); },
      setItem: () => { throw new Error('quota'); },
      removeItem: () => { throw new Error('blocked'); },
    };
    try {
      const store = new SafeLocalStore();
      expect(store.available).toBe(false);
      store.set('k', 'v');
      expect(store.get('k')).toBe('v');
    } finally {
      delete g.localStorage;
    }
  });

  it('converts levels from a version-1 save to the 12-step scale', () => {
    const old = { ...newGame(), levels: { styrka: 4, magi: 3, liv: 4 } };
    const f = deserialize(JSON.stringify({ v: 1, savedAt: 0, state: old }))!;
    expect(f.state.levels).toEqual({ styrka: 6, magi: 4, liv: 6 });
    // A current save keeps its levels as they are.
    const now = deserialize(serialize({ ...newGame(), levels: { styrka: 4, magi: 3, liv: 4 } }))!;
    expect(now.state.levels).toEqual({ styrka: 4, magi: 3, liv: 4 });
  });
});
