import { drawSprite } from '../engine/sprites';
import { PALETTE } from '../data/palettes';
import type { PlatformDef } from '../data/types';

const T = 16;

/**
 * Lifts and mine carts: solid from above, carry whoever stands on them.
 * The scene moves the rider by (dx, dy) each step before the rider's own update.
 */
export class MovingPlatform {
  x: number;
  y: number;
  readonly w: number;
  readonly h: number;
  /** Movement this step. */
  dx = 0;
  dy = 0;
  private readonly ax: number;
  private readonly ay: number;
  private readonly bx: number;
  private readonly by: number;
  private readonly speed: number;
  /** 0 → at A, 1 → at B. */
  private pos: number;
  private dir: 1 | -1 = 1;
  private pause = 0;
  private wheel = 0;

  constructor(readonly def: PlatformDef, nearX: number) {
    const cart = def.kind === 'cart';
    this.w = cart ? 24 : 32;
    this.h = cart ? 10 : 8;
    const off = cart ? 2 : 0;
    this.ax = def.tx * T;
    this.ay = def.ty * T + off;
    this.bx = def.toTx * T;
    this.by = def.toTy * T + off;
    this.speed = def.speed ?? (cart ? 1.1 : 0.6);
    // Ride platforms start at the end nearest to Dagny, so she is never stranded.
    const nearB = def.mode === 'ride' && Math.abs(nearX - this.bx) < Math.abs(nearX - this.ax);
    this.pos = nearB ? 1 : 0;
    this.dir = nearB ? -1 : 1;
    this.x = nearB ? this.bx : this.ax;
    this.y = nearB ? this.by : this.ay;
  }

  private get length(): number {
    return Math.hypot(this.bx - this.ax, this.by - this.ay) || 1;
  }

  update(ridden: boolean): void {
    const ox = this.x;
    const oy = this.y;
    const stepFrac = this.speed / this.length;
    if (this.def.mode === 'loop') {
      if (this.pause > 0) this.pause--;
      else {
        this.pos += this.dir * stepFrac;
        if (this.pos >= 1 || this.pos <= 0) {
          this.pos = Math.max(0, Math.min(1, this.pos));
          this.dir = this.dir === 1 ? -1 : 1;
          this.pause = 45;
        }
      }
    } else if (ridden && this.pause === 0) {
      this.pos += this.dir * stepFrac;
      if (this.pos >= 1 || this.pos <= 0) {
        this.pos = Math.max(0, Math.min(1, this.pos));
        this.dir = this.dir === 1 ? -1 : 1;
        // Rest at the end until Dagny steps off and on again.
        this.pause = -1;
      }
    } else if (!ridden && this.pause === -1) {
      this.pause = 0;
    }
    this.x = this.ax + (this.bx - this.ax) * this.pos;
    this.y = this.ay + (this.by - this.ay) * this.pos;
    this.dx = this.x - ox;
    this.dy = this.y - oy;
    if (this.dx !== 0) this.wheel++;
  }

  render(ctx: CanvasRenderingContext2D, camX: number, camY: number): void {
    const x = Math.round(this.x - camX);
    const y = Math.round(this.y - camY);
    if (this.def.kind === 'lift') {
      // Cables up to the top of the screen.
      ctx.fillStyle = PALETTE.G;
      ctx.fillRect(x + 2, 0, 1, Math.max(0, y));
      ctx.fillRect(x + this.w - 3, 0, 1, Math.max(0, y));
      drawSprite(ctx, 'lift', 0, x, y);
    } else {
      drawSprite(ctx, 'cart', Math.floor(this.wheel / 6) % 2, x, y);
    }
  }
}
