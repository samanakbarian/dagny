import { GLYPHS, FONT_HEIGHT, LETTER_SPACING, LINE_HEIGHT, parseGlyph, type Glyph } from '../art/font';
import { PALETTE } from '../data/palettes';

const parsed = new Map<string, Glyph>();
function glyph(ch: string): Glyph {
  let g = parsed.get(ch);
  if (!g) {
    const src = GLYPHS[ch] ?? GLYPHS['?'];
    g = parseGlyph(src);
    parsed.set(ch, g);
  }
  return g;
}

/** Width in pixels of a single-line string. */
export function measure(text: string): number {
  let w = 0;
  for (const ch of text) w += glyph(ch).w + LETTER_SPACING;
  return w > 0 ? w - LETTER_SPACING : 0;
}

/** Greedy word wrap. Explicit '\n' always breaks. */
export function wrap(text: string, maxWidth: number): string[] {
  const out: string[] = [];
  for (const para of text.split('\n')) {
    const words = para.split(' ');
    let line = '';
    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word;
      if (measure(candidate) <= maxWidth || !line) {
        line = candidate;
      } else {
        out.push(line);
        line = word;
      }
    }
    out.push(line);
  }
  return out;
}

// --- Drawing (lazy, so the pure helpers above work in tests without a DOM) ---

interface Atlas {
  canvas: HTMLCanvasElement;
  index: Map<string, number>;
}
let layout: { chars: string[]; x: number[]; width: number } | null = null;
const atlases = new Map<string, Atlas>();

function buildLayout(): { chars: string[]; x: number[]; width: number } {
  const chars = Object.keys(GLYPHS);
  const x: number[] = [];
  let cx = 0;
  for (const ch of chars) {
    x.push(cx);
    cx += glyph(ch).w + 1;
  }
  return { chars, x, width: cx };
}

function atlasFor(colorKey: string): Atlas {
  let a = atlases.get(colorKey);
  if (a) return a;
  layout ??= buildLayout();
  const canvas = document.createElement('canvas');
  canvas.width = layout.width;
  canvas.height = FONT_HEIGHT;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  ctx.fillStyle = PALETTE[colorKey] ?? colorKey;
  const index = new Map<string, number>();
  layout.chars.forEach((ch, i) => {
    const g = glyph(ch);
    const ox = layout!.x[i];
    index.set(ch, ox);
    g.rows.forEach((row, ry) => {
      for (let rx = 0; rx < row.length; rx++) if (row[rx] === '#') ctx.fillRect(ox + rx, g.top + ry, 1, 1);
    });
  });
  a = { canvas, index };
  atlases.set(colorKey, a);
  return a;
}

export interface TextOptions {
  /** Palette key or CSS colour of the shadow (drawn 1px down/right). */
  shadow?: string;
  /** Draw a full 1px outline in this colour. */
  outline?: string;
  align?: 'left' | 'center' | 'right';
  /** Only draw the first n characters (typewriter effect). */
  limit?: number;
}

function drawRun(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, colorKey: string, limit: number): void {
  const a = atlasFor(colorKey);
  let cx = Math.round(x);
  const cy = Math.round(y);
  let n = 0;
  for (const ch of text) {
    if (n++ >= limit) break;
    const g = glyph(ch);
    const sx = a.index.get(ch) ?? a.index.get('?') ?? 0;
    if (ch !== ' ') ctx.drawImage(a.canvas, sx, 0, g.w, FONT_HEIGHT, cx, cy, g.w, FONT_HEIGHT);
    cx += g.w + LETTER_SPACING;
  }
}

/** Draws text with the top of the glyph cell at y. Returns the width drawn. */
export function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  colorKey = 'W',
  opts: TextOptions = {},
): number {
  const w = measure(text);
  if (opts.align === 'center') x -= w / 2;
  else if (opts.align === 'right') x -= w;
  const limit = opts.limit ?? Infinity;
  if (opts.outline) {
    for (const [dx, dy] of OUTLINE) drawRun(ctx, text, x + dx, y + dy, opts.outline, limit);
  } else if (opts.shadow) {
    drawRun(ctx, text, x + 1, y + 1, opts.shadow, limit);
  }
  drawRun(ctx, text, x, y, colorKey, limit);
  return w;
}

const OUTLINE: ReadonlyArray<[number, number]> = [
  [-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, -1], [-1, 1], [1, 1],
];

export { LINE_HEIGHT, FONT_HEIGHT };
