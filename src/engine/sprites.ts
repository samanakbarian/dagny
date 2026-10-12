import { PALETTE } from '../data/palettes';

/**
 * Sprites are defined as data: grids of characters mapped to palette keys.
 * At start-up every sprite is rasterised once onto an offscreen canvas
 * (normal row + horizontally mirrored row). The rest of the game only talks
 * to `getSprite(id, frame)` / `drawSprite(...)`, so the source can later be
 * swapped for hand-drawn PNG sheets without touching game code.
 */

/** A frame is either a raw grid or a composition of named parts. */
export type FrameDef = string[] | { parts: Array<[part: string, dx: number, dy: number]> };

export interface SpriteDef {
  w: number;
  h: number;
  frames: FrameDef[];
  /** Named sub-grids used by composed frames. */
  parts?: Record<string, string[]>;
  /** Palette key remapping (e.g. for colour variants). */
  recolor?: Record<string, string>;
  /** Base sprite to copy frames/parts from (used together with recolor). */
  base?: string;
  /** Palette key for an automatic 1px outline around opaque pixels. */
  outline?: string;
}

export interface SpriteFrame {
  image: CanvasImageSource;
  sx: number;
  sy: number;
  w: number;
  h: number;
}

interface Sheet {
  canvas: HTMLCanvasElement;
  w: number;
  h: number;
  count: number;
  frames: SpriteFrame[];
  flipped: SpriteFrame[];
}

const sheets = new Map<string, Sheet>();
let defs: Record<string, SpriteDef> = {};

function resolve(id: string): SpriteDef {
  const d = defs[id];
  if (!d) throw new Error(`Okänd sprite: ${id}`);
  if (!d.base) return d;
  const b = resolve(d.base);
  return {
    w: d.w || b.w,
    h: d.h || b.h,
    frames: d.frames.length ? d.frames : b.frames,
    parts: d.parts ?? b.parts,
    recolor: { ...(b.recolor ?? {}), ...(d.recolor ?? {}) },
    outline: d.outline ?? b.outline,
  };
}

function paint(
  ctx: CanvasRenderingContext2D,
  grid: string[],
  ox: number,
  oy: number,
  recolor: Record<string, string> | undefined,
  clipW: number,
  clipH: number,
  baseX: number,
): void {
  for (let y = 0; y < grid.length; y++) {
    const row = grid[y];
    for (let x = 0; x < row.length; x++) {
      let ch = row[x];
      if (ch === '.' || ch === ' ') continue;
      if (recolor && recolor[ch]) ch = recolor[ch];
      if (ch === '.') continue;
      const px = ox + x;
      const py = oy + y;
      if (px < 0 || py < 0 || px >= clipW || py >= clipH) continue;
      const c = PALETTE[ch];
      if (!c) continue;
      ctx.fillStyle = c;
      ctx.fillRect(baseX + px, py, 1, 1);
    }
  }
}

function outlineFrame(ctx: CanvasRenderingContext2D, bx: number, w: number, h: number, key: string): void {
  const img = ctx.getImageData(bx, 0, w, h);
  const a = img.data;
  const solid = (x: number, y: number): boolean => x >= 0 && y >= 0 && x < w && y < h && a[(y * w + x) * 4 + 3] > 0;
  ctx.fillStyle = PALETTE[key] ?? key;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (solid(x, y)) continue;
      if (solid(x - 1, y) || solid(x + 1, y) || solid(x, y - 1) || solid(x, y + 1)) ctx.fillRect(bx + x, y, 1, 1);
    }
  }
}

function build(id: string): Sheet {
  const d = resolve(id);
  const count = d.frames.length;
  // Paint on a CPU-friendly scratch canvas (outlines read pixels back) ...
  const work = document.createElement('canvas');
  work.width = d.w * count;
  work.height = d.h;
  const wctx = work.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D;
  d.frames.forEach((f, i) => {
    const bx = i * d.w;
    if (Array.isArray(f)) {
      paint(wctx, f, 0, 0, d.recolor, d.w, d.h, bx);
    } else {
      for (const [name, dx, dy] of f.parts) {
        const part = d.parts?.[name];
        if (!part) throw new Error(`Sprite ${id}: saknar del ${name}`);
        paint(wctx, part, dx, dy, d.recolor, d.w, d.h, bx);
      }
    }
    if (d.outline) outlineFrame(wctx, bx, d.w, d.h, d.outline);
  });
  // ... then copy to a GPU-friendly sheet: normal row + mirrored row.
  const canvas = document.createElement('canvas');
  canvas.width = d.w * count;
  canvas.height = d.h * 2;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  ctx.drawImage(work, 0, 0);
  ctx.save();
  ctx.scale(-1, 1);
  for (let i = 0; i < count; i++) {
    ctx.drawImage(work, i * d.w, 0, d.w, d.h, -(i * d.w) - d.w, d.h, d.w, d.h);
  }
  ctx.restore();
  const frames: SpriteFrame[] = [];
  const flipped: SpriteFrame[] = [];
  for (let i = 0; i < count; i++) {
    frames.push({ image: canvas, sx: i * d.w, sy: 0, w: d.w, h: d.h });
    flipped.push({ image: canvas, sx: i * d.w, sy: d.h, w: d.w, h: d.h });
  }
  return { canvas, w: d.w, h: d.h, count, frames, flipped };
}

/** Registers sprite definitions and builds the offscreen cache. */
export function initSprites(all: Record<string, SpriteDef>): void {
  defs = all;
  sheets.clear();
  for (const id of Object.keys(all)) sheets.set(id, build(id));
}

function sheet(id: string): Sheet {
  let s = sheets.get(id);
  if (!s) {
    s = build(id);
    sheets.set(id, s);
  }
  return s;
}

export function getSprite(id: string, frame = 0, flip = false): SpriteFrame {
  const s = sheet(id);
  const f = ((frame % s.count) + s.count) % s.count;
  return flip ? s.flipped[f] : s.frames[f];
}

export function frameCount(id: string): number {
  return sheet(id).count;
}

export function spriteSize(id: string): { w: number; h: number } {
  const s = sheet(id);
  return { w: s.w, h: s.h };
}

export function drawSprite(
  ctx: CanvasRenderingContext2D,
  id: string,
  frame: number,
  x: number,
  y: number,
  flip = false,
): void {
  const f = getSprite(id, frame, flip);
  ctx.drawImage(f.image, f.sx, f.sy, f.w, f.h, Math.round(x), Math.round(y), f.w, f.h);
}
