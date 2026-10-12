import { PALETTE } from '../data/palettes';
import { drawText, measure, LINE_HEIGHT } from '../engine/text';
import { Act, type Input } from '../engine/input';
import type { AudioEngine } from '../engine/audio';

export const P = PALETTE;

/** Typewriter paper with a red/blue airmail border – the dialog style. */
export function drawPostcard(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
  x = Math.round(x);
  y = Math.round(y);
  ctx.fillStyle = P.k;
  ctx.fillRect(x - 1, y - 1, w + 2, h + 2);
  // Airmail stripes.
  for (let i = 0; i < w + h; i += 4) {
    ctx.fillStyle = (i / 4) % 2 === 0 ? P.r : P.u;
    if (i < w) {
      ctx.fillRect(x + i, y, Math.min(4, w - i), 3);
      ctx.fillRect(x + w - i - Math.min(4, w - i), y + h - 3, Math.min(4, w - i), 3);
    }
    if (i < h) {
      ctx.fillRect(x, y + i, 3, Math.min(4, h - i));
      ctx.fillRect(x + w - 3, y + h - i - Math.min(4, h - i), 3, Math.min(4, h - i));
    }
  }
  ctx.fillStyle = P.W;
  ctx.fillRect(x + 3, y + 3, w - 6, h - 6);
  // Faint ruled lines like writing paper.
  ctx.fillStyle = '#ece0c2';
  for (let ly = y + 15; ly < y + h - 5; ly += LINE_HEIGHT) ctx.fillRect(x + 6, ly, w - 12, 1);
}

/** Plain dark panel used by menus. */
export function drawPanel(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
  x = Math.round(x);
  y = Math.round(y);
  ctx.fillStyle = P.W;
  ctx.fillRect(x - 1, y - 1, w + 2, h + 2);
  ctx.fillStyle = P.k;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = P.K;
  ctx.fillRect(x + 2, y + 2, w - 4, h - 4);
  ctx.fillStyle = P.y;
  ctx.fillRect(x + 2, y + 2, w - 4, 1);
}

/** A little stamp with the speaker's name on the postcard. */
export function drawStamp(ctx: CanvasRenderingContext2D, text: string, x: number, y: number): void {
  const w = measure(text) + 8;
  ctx.fillStyle = P.k;
  ctx.fillRect(x - 1, y - 1, w + 2, 14);
  ctx.fillStyle = P.y;
  ctx.fillRect(x, y, w, 12);
  ctx.fillStyle = P.Y;
  for (let i = 0; i < w; i += 3) {
    ctx.fillRect(x + i, y, 1, 1);
    ctx.fillRect(x + i, y + 11, 1, 1);
  }
  drawText(ctx, text, x + 4, y + 1, 'k');
}

export function drawBar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  value: number,
  max: number,
  fill: string,
  empty: string,
  segment = 2,
): number {
  const segs = Math.ceil(max / segment);
  const w = segs * 4 + 1;
  ctx.fillStyle = P.k;
  ctx.fillRect(x - 1, y - 1, w + 1, 7);
  for (let i = 0; i < segs; i++) {
    const v = Math.max(0, Math.min(segment, value - i * segment));
    ctx.fillStyle = empty;
    ctx.fillRect(x + i * 4, y, 3, 5);
    if (v > 0) {
      ctx.fillStyle = fill;
      const h = Math.round((v / segment) * 5);
      ctx.fillRect(x + i * 4, y + 5 - h, 3, h);
    }
  }
  return w;
}

export interface MenuItem {
  label: string | (() => string);
  /** Right-hand value text (e.g. "På", "7"). */
  value?: () => string;
  onSelect?: () => void;
  /** For sliders / toggles: -1 or +1. */
  onAdjust?: (dir: -1 | 1) => void;
  disabled?: () => boolean;
}

/**
 * A vertical list menu that works with keyboard, gamepad, d-pad and taps.
 * Tapping an item selects it; tapping the value of an adjustable item steps it.
 */
export class ListMenu {
  cursor = 0;
  private rects: Array<{ x: number; y: number; w: number; h: number }> = [];
  private repeat = 0;
  rowHeight = 13;

  constructor(public items: MenuItem[], private readonly audio?: AudioEngine) {}

  private label(i: MenuItem): string {
    return typeof i.label === 'function' ? i.label() : i.label;
  }

  private move(d: number): void {
    const n = this.items.length;
    for (let k = 0; k < n; k++) {
      this.cursor = (this.cursor + d + n) % n;
      if (!this.items[this.cursor].disabled?.()) break;
    }
    this.audio?.play('menu');
  }

  /** Returns true if the menu consumed a "back" press. */
  update(input: Input): 'back' | null {
    if (this.items[this.cursor]?.disabled?.()) this.move(1);
    const vert = input.held(Act.Down) ? 1 : input.held(Act.Up) ? -1 : 0;
    if (vert !== 0) {
      if (input.pressed(Act.Down) || input.pressed(Act.Up)) {
        this.move(vert);
        this.repeat = 18;
      } else if (--this.repeat <= 0) {
        this.move(vert);
        this.repeat = 6;
      }
    }
    const item = this.items[this.cursor];
    if (item?.onAdjust) {
      if (input.pressed(Act.Left)) {
        item.onAdjust(-1);
        this.audio?.play('menu');
      }
      if (input.pressed(Act.Right)) {
        item.onAdjust(1);
        this.audio?.play('menu');
      }
    }
    if (input.confirm() && item && !item.disabled?.()) {
      if (item.onSelect) {
        this.audio?.play('select');
        item.onSelect();
      } else if (item.onAdjust) {
        item.onAdjust(1);
        this.audio?.play('menu');
      }
      return null;
    }
    for (const t of input.taps) {
      for (let i = 0; i < this.rects.length; i++) {
        const r = this.rects[i];
        if (t.x >= r.x && t.x < r.x + r.w && t.y >= r.y && t.y < r.y + r.h) {
          const it = this.items[i];
          if (it.disabled?.()) continue;
          this.cursor = i;
          if (it.onAdjust && !it.onSelect) {
            // Left half steps down, right half steps up.
            it.onAdjust(t.x < r.x + r.w * 0.6 ? -1 : 1);
            this.audio?.play('menu');
          } else if (it.onSelect) {
            this.audio?.play('select');
            it.onSelect();
          }
          return null;
        }
      }
    }
    if (input.back() || input.pressed(Act.Pause)) return 'back';
    return null;
  }

  /** Width needed for labels + values. */
  width(): number {
    let w = 0;
    for (const i of this.items) {
      const v = i.value ? measure(i.value()) + 16 : 0;
      w = Math.max(w, measure(this.label(i)) + v);
    }
    return w + 14;
  }

  render(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, colors = { text: 'W', dim: 'G', hi: 'Y' }): void {
    this.rects = [];
    this.items.forEach((item, i) => {
      const iy = y + i * this.rowHeight;
      const dis = item.disabled?.() ?? false;
      const sel = i === this.cursor;
      const col = dis ? colors.dim : sel ? colors.hi : colors.text;
      if (sel) drawText(ctx, '▶', x, iy, colors.hi);
      drawText(ctx, this.label(item), x + 9, iy, col);
      if (item.value) {
        const v = item.value();
        const vx = x + w - measure(v) - 2;
        drawText(ctx, v, vx, iy, col);
        if (sel && item.onAdjust) {
          drawText(ctx, '<', vx - 8, iy, colors.hi);
          drawText(ctx, '>', x + w + 2, iy, colors.hi);
        }
      }
      this.rects.push({ x: x - 4, y: iy - 2, w: w + 12, h: this.rowHeight });
    });
  }
}
