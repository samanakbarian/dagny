import { drawSprite } from '../engine/sprites';
import { PALETTE } from '../data/palettes';
import type { PlatformDef } from '../data/types';

const T = 16;

/**
 * Lifts, mine carts, floating logs and water-wheel paddles: solid from above,
 * they carry whoever stands on them. The scene moves the rider by (dx, dy)
 * each step before the rider's own update.
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
  private pos = 0;
  private dir: 1 | -1 = 1;
  private pause = 0;
  private wheel = 0;
  /** Water wheels: centre, radius and current angle. */
  private readonly cx: number;
  private readonly cy: number;
  private readonly radius: number;
  private angle: number;
  /** The first paddle of a wheel draws the hub. */
  readonly hub: boolean;

  constructor(readonly def: PlatformDef, nearX: number, index = 0) {
    const k = def.kind;
    this.w = k === 'cart' || k === 'wheel' ? 24 : 32;
    this.h = k === 'cart' ? 10 : k === 'wheel' ? 6 : 8;
    const off = k === 'cart' ? 2 : k === 'log' ? T : 0;
    this.ax = def.tx * T;
    this.ay = def.ty * T + off;
    this.bx = def.toTx * T;
    this.by = def.toTy * T + off;
    this.speed = def.speed ?? (k === 'cart' ? 1.1 : k === 'wheel' ? 0.012 : 0.6);
    this.cx = def.tx * T + T / 2;
    this.cy = def.ty * T + T / 2;
    this.radius = (def.radius ?? 3) * T;
    const count = def.count ?? 4;
    this.angle = (index / count) * Math.PI * 2;
    this.hub = k === 'wheel' && index === 0;
    // Ride platforms start at the end nearest to Dagny, so she is never stranded.
    const nearB = def.mode === 'ride' && Math.abs(nearX - this.bx) < Math.abs(nearX - this.ax);
    if (nearB) {
      this.pos = 1;
      this.dir = -1;
    }
    this.x = 0;
    this.y = 0;
    this.place();
  }

  /** All platforms described by one definition (a wheel has several paddles). */
  static create(def: PlatformDef, nearX: number): MovingPlatform[] {
    if (def.kind !== 'wheel') return [new MovingPlatform(def, nearX)];
    return Array.from({ length: def.count ?? 4 }, (_, i) => new MovingPlatform(def, nearX, i));
  }

  private place(): void {
    if (this.def.kind === 'wheel') {
      this.x = this.cx + Math.cos(this.angle) * this.radius - this.w / 2;
      this.y = this.cy + Math.sin(this.angle) * this.radius - this.h / 2;
    } else {
      this.x = this.ax + (this.bx - this.ax) * this.pos;
      this.y = this.ay + (this.by - this.ay) * this.pos;
    }
  }

  private get length(): number {
    return Math.hypot(this.bx - this.ax, this.by - this.ay) || 1;
  }

  update(ridden: boolean): void {
    const ox = this.x;
    const oy = this.y;
    if (this.def.kind === 'wheel') {
      this.angle += this.speed;
    } else {
      const stepFrac = this.speed / this.length;
      if (this.def.mode === 'loop') {
        if (this.pause > 0) this.pause--;
        else {
          this.pos += this.dir * stepFrac;
          if (this.pos >= 1 || this.pos <= 0) {
            this.pos = Math.max(0, Math.min(1, this.pos));
            this.dir = this.dir === 1 ? -1 : 1;
            this.pause = this.def.kind === 'log' ? 20 : 45;
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
    }
    this.place();
    this.dx = this.x - ox;
    this.dy = this.y - oy;
    if (this.dx !== 0) this.wheel++;
  }

  render(ctx: CanvasRenderingContext2D, camX: number, camY: number): void {
    const x = Math.round(this.x - camX);
    const y = Math.round(this.y - camY);
    switch (this.def.kind) {
      case 'lift':
        // Cables up to the top of the screen.
        ctx.fillStyle = PALETTE.G;
        ctx.fillRect(x + 2, 0, 1, Math.max(0, y));
        ctx.fillRect(x + this.w - 3, 0, 1, Math.max(0, y));
        drawSprite(ctx, 'lift', 0, x, y);
        break;
      case 'cart':
        drawSprite(ctx, 'cart', Math.floor(this.wheel / 6) % 2, x, y);
        break;
      case 'log': {
        const bob = Math.round(Math.sin(this.wheel / 12) * 0.6);
        drawSprite(ctx, 'log', 0, x, y + bob);
        break;
      }
      case 'wheel': {
        // Spoke from the hub to this paddle.
        const hx = this.cx - camX;
        const hy = this.cy - camY;
        const px = x + this.w / 2;
        const py = y + this.h / 2;
        const steps = Math.ceil(this.radius / 2);
        for (const [col, size] of [[PALETTE.k, 4], [PALETTE.t, 2]] as const) {
          ctx.fillStyle = col;
          for (let i = 0; i <= steps; i++) {
            const k = i / steps;
            ctx.fillRect(Math.round(hx + (px - hx) * k) - size / 2, Math.round(hy + (py - hy) * k) - size / 2, size, size);
          }
        }
        drawSprite(ctx, 'paddle', 0, x, y);
        break;
      }
    }
  }

  renderHub(ctx: CanvasRenderingContext2D, camX: number, camY: number): void {
    if (this.hub) drawSprite(ctx, 'hub', 0, this.cx - 6 - camX, this.cy - 6 - camY);
  }
}
