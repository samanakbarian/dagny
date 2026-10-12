import { describe, expect, it } from 'vitest';
import { measure, wrap } from '../src/engine/text';
import { GLYPHS, parseGlyph, FONT_HEIGHT } from '../src/art/font';

describe('bitmap font', () => {
  it('has å, ä and ö in both cases', () => {
    for (const ch of 'åäöÅÄÖ') expect(GLYPHS[ch]).toBeDefined();
  });

  it('every glyph fits the cell and has even rows', () => {
    for (const [ch, src] of Object.entries(GLYPHS)) {
      const g = parseGlyph(src);
      expect(g.top + g.rows.length, `glyph ${ch}`).toBeLessThanOrEqual(FONT_HEIGHT);
      for (const r of g.rows) expect(r.length, `glyph ${ch}`).toBe(g.w);
    }
  });

  it('measures and wraps text', () => {
    expect(measure('')).toBe(0);
    expect(measure('i')).toBe(1);
    expect(measure('ii')).toBe(3);
    const lines = wrap('Dagny går över myren mot Stenkyrkan i norr', 60);
    expect(lines.length).toBeGreaterThan(1);
    for (const l of lines) expect(measure(l)).toBeLessThanOrEqual(60);
    expect(wrap('ett\ntvå', 200)).toEqual(['ett', 'två']);
  });
});
