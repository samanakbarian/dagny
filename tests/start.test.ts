import { describe, expect, it } from 'vitest';
import { AREAS } from '../src/data/areas';
import { DIALOG } from '../src/data/dialog';
import { NPCS } from '../src/data/npcs';
import type { Condition, NpcDef } from '../src/data/types';

/** The dialog an NPC would pick, given the flags, items and spells Dagny has. */
function talk(npc: NpcDef, has: { flags?: string[]; items?: string[]; spells?: string[] }): string {
  const ok = (c: Condition): boolean => {
    if ('flag' in c) return (has.flags ?? []).includes(c.flag);
    if ('notFlag' in c) return !(has.flags ?? []).includes(c.notFlag);
    if ('item' in c) return (has.items ?? []).includes(c.item);
    if ('notItem' in c) return !(has.items ?? []).includes(c.notItem);
    if ('spell' in c) return (has.spells ?? []).includes(c.spell);
    return !(has.spells ?? []).includes(c.notSpell);
  };
  return npc.talk.find((t) => (t.if ?? []).every(ok))!.dialog;
}

const teaches = (dialog: string, what: string): boolean =>
  (DIALOG[dialog].actions ?? []).some((a) => (a.type === 'learnSpell' && a.spell === what) || (a.type === 'learnSkill' && a.skill === what));

describe('nothing is handed out for free at the start', () => {
  it('Sven teaches Läkning only once Dagny brings johannesört', () => {
    expect(teaches(talk(NPCS.sven, {}), 'lakning')).toBe(false);
    expect(teaches(talk(NPCS.sven, { flags: ['sven_uppdrag'] }), 'lakning')).toBe(false);
    const d = talk(NPCS.sven, { flags: ['sven_uppdrag'], items: ['johannesort'] });
    expect(teaches(d, 'lakning')).toBe(true);
    expect(DIALOG[d].actions).toContainEqual({ type: 'takeItem', item: 'johannesort' });
  });

  it('the johannesört grows in Björkhagen', () => {
    expect(AREAS.bjorkhagen.questItem).toBe('johannesort');
    expect(AREAS.bjorkhagen.tiles.join('')).toContain('q');
  });

  it('Algot teaches Nedåtstöt only after the crypt', () => {
    expect(teaches(talk(NPCS.algot, {}), 'nedatstot')).toBe(false);
    expect(teaches(talk(NPCS.algot, { flags: ['krypta_klar'] }), 'nedatstot')).toBe(true);
  });
});
