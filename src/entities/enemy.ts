import { Kind, groundBelow, isSolidAt, moveBody, type Body, type Rect } from '../engine/collision';
import { drawSprite } from '../engine/sprites';
import type { BossDef, EnemyDef } from '../data/types';
import type { WorldApi } from './types';

let nextId = 1;

export type HitHeight = 'high' | 'low' | 'down' | 'up' | 'magic';
export type HitResult = 'hit' | 'blocked' | 'dead' | 'none';

/**
 * A väsen. Behaviour is chosen by EnemyDef.behavior, so new creatures can be
 * added purely in data/enemies.ts by reusing behaviours with new numbers.
 */
export class Enemy implements Body {
  readonly id = nextId++;
  x: number;
  y: number;
  w: number;
  h: number;
  vx = 0;
  vy = 0;
  onGround = false;
  hp: number;
  maxHp: number;
  facing: 1 | -1 = -1;
  dead = false;
  /** Flash timer after being hit. */
  flash = 0;
  /** Invulnerable frames after a hit. */
  iframes = 0;
  t = 0;
  private timer = 0;
  private mode = 0;
  private baseY: number;
  /** Nisse guard height. */
  guard: 'high' | 'low' = 'high';
  private guardDelay = 0;
  private shotHigh = true;
  /** Boss: active once the fight started. */
  awake = false;
  phase = 0;
  stun = 0;
  /** Opacity (Gruvrået fades in and out). */
  alpha = 1;
  /** Cannot be hit or hurt anyone (e.g. while faded out). */
  untouchable = false;
  private homeY = 0;
  sprite: string;
  frame = 0;
  readonly boss: BossDef | null;

  constructor(readonly def: EnemyDef, px: number, py: number) {
    this.boss = 'phases' in def ? (def as BossDef) : null;
    this.w = def.box.w;
    this.h = def.box.h;
    // px/py is the tile's bottom-centre; stand on it.
    this.x = px - this.w / 2;
    this.y = py - this.h;
    this.baseY = this.y;
    this.hp = def.hp;
    this.maxHp = def.hp;
    this.sprite = def.sprite;
    this.timer = 30 + ((this.id * 37) % 60);
  }

  get flying(): boolean {
    return !!this.def.flying || (this.boss !== null && this.phase === 1);
  }

  get damage(): number {
    return this.def.damage;
  }

  /** Whether touching the player hurts right now. */
  get harmful(): boolean {
    if (this.dead) return false;
    if (this.boss && !this.awake) return false;
    return !this.untouchable;
  }

  takeHit(dmg: number, fromX: number, height: HitHeight, world: WorldApi): HitResult {
    if (this.dead || this.iframes > 0) return 'none';
    if (this.boss && !this.awake) return 'none';
    if (this.untouchable) return 'none';
    // Tomtenisse-krigare parries strikes at the height he guards.
    if (this.def.behavior === 'parrier' && this.mode !== 2 && (height === 'high' || height === 'low') && height === this.guard) {
      world.sparks(this.x + (fromX < this.x ? 0 : this.w), this.guard === 'high' ? this.y + 8 : this.y + 18);
      world.sfx('block');
      this.vx = fromX < this.x + this.w / 2 ? 1.2 : -1.2;
      this.iframes = 10;
      return 'blocked';
    }
    let d = dmg;
    if (this.boss && this.stun > 0) d = Math.ceil(d * 1.5);
    this.hp -= d;
    this.flash = 10;
    this.iframes = this.boss ? 24 : 12;
    if (!this.def.heavy) {
      this.vx = fromX < this.x + this.w / 2 ? 2 : -2;
      if (!this.flying) this.vy = -1.5;
    }
    if (this.hp <= 0) {
      this.dead = true;
      return 'dead';
    }
    world.sfx('hit');
    return 'hit';
  }

  box(out: Rect): Rect {
    out.x = this.x;
    out.y = this.y;
    out.w = this.w;
    out.h = this.h;
    return out;
  }

  update(world: WorldApi): void {
    if (this.dead) return;
    this.t++;
    if (this.flash > 0) this.flash--;
    if (this.iframes > 0) this.iframes--;
    const p = world.playerCenter();
    const cx = this.x + this.w / 2;
    const cy = this.y + this.h / 2;
    const dx = p.x - cx;
    const dist = Math.abs(dx);
    const sp = this.def.speed;

    switch (this.def.behavior) {
      case 'walker': {
        if (this.onGround) {
          if (Math.abs(this.vx) > sp + 0.1) this.vx *= 0.85;
          else this.vx = this.facing * sp;
          // Turn at walls and ledges.
          const aheadX = this.facing === 1 ? this.x + this.w + 1 : this.x - 1;
          if (isSolidAt(world.grid, aheadX, this.y + this.h / 2) || !isSolidOrPlatformBelow(world, aheadX, this.y + this.h + 2)) {
            this.facing = this.facing === 1 ? -1 : 1;
            this.vx = 0;
          }
        }
        this.frame = Math.floor(this.t / 10) % 2;
        this.fall(world);
        break;
      }
      case 'floater': {
        this.facing = dx > 0 ? 1 : -1;
        if (dist < 160) this.vx += (Math.sign(dx) * sp - this.vx) * 0.02;
        else this.vx *= 0.95;
        this.y = this.baseY + Math.sin(this.t / 22) * 14;
        this.x += this.vx;
        this.frame = Math.floor(this.t / 8) % 2;
        break;
      }
      case 'parrier': {
        this.facing = dx > 0 ? 1 : -1;
        // Match the player's stance after a short reaction time.
        const want: 'high' | 'low' = world.playerDucking() ? 'low' : 'high';
        if (want !== this.guard) {
          if (++this.guardDelay > 22) {
            this.guard = want;
            this.guardDelay = 0;
          }
        } else this.guardDelay = 0;
        if (this.mode === 2) {
          // Lunge: open guard, vulnerable.
          if (--this.timer <= 0) {
            this.mode = 0;
            this.timer = 70 + ((this.t * 13) % 50);
          }
          this.frame = 2;
        } else {
          this.frame = this.guard === 'high' ? 0 : 1;
          if (this.onGround) {
            if (dist > 30 && dist < 150) this.vx = Math.sign(dx) * sp;
            else if (dist < 22) this.vx = -Math.sign(dx) * sp * 0.6;
            else this.vx *= 0.8;
          }
          if (--this.timer <= 0 && dist < 60) {
            this.mode = 2;
            this.timer = 34;
            this.vx = Math.sign(dx) * 2.2;
          }
        }
        this.fall(world);
        break;
      }
      case 'hopper': {
        if (this.onGround) {
          this.vx *= 0.8;
          this.frame = 0;
          if (--this.timer <= 0 && dist < 110) {
            this.facing = dx > 0 ? 1 : -1;
            this.vx = this.facing * sp * 1.3;
            this.vy = -4.2;
            this.timer = 50 + ((this.t * 7) % 40);
          }
        } else this.frame = 1;
        this.fall(world);
        break;
      }
      case 'diver': {
        // mode 0 hover, 1 dive, 2 climb back.
        if (this.mode === 0) {
          this.facing = dx > 0 ? 1 : -1;
          this.x += Math.sign(dx) * 0.4 * (dist > 10 ? 1 : 0);
          this.y = this.baseY + Math.sin(this.t / 12) * 3;
          this.frame = Math.floor(this.t / 7) % 2;
          if (--this.timer <= 0 && dist < 90 && p.y > cy) {
            this.mode = 1;
            const ang = Math.atan2(p.y - cy, dx);
            this.vx = Math.cos(ang) * sp * 1.6;
            this.vy = Math.sin(ang) * sp * 1.6;
          }
        } else if (this.mode === 1) {
          this.frame = 2;
          this.x += this.vx;
          this.y += this.vy;
          if (this.y > this.baseY + 90 || isSolidAt(world.grid, cx, this.y + this.h) || this.t % 200 === 0) this.mode = 2;
        } else {
          this.frame = Math.floor(this.t / 5) % 2;
          this.y -= 1.2;
          this.x += this.vx * 0.3;
          if (this.y <= this.baseY) {
            this.y = this.baseY;
            this.mode = 0;
            this.timer = 60;
          }
        }
        break;
      }
      case 'tank': {
        this.facing = dx > 0 ? 1 : -1;
        if (this.onGround) this.vx = dist > 6 && dist < 200 ? Math.sign(dx) * sp : 0;
        this.frame = Math.floor(this.t / 18) % 2;
        this.fall(world);
        break;
      }
      case 'shooter': {
        this.facing = dx > 0 ? 1 : -1;
        this.frame = this.timer < 12 ? 1 : 0;
        if (--this.timer <= 0) {
          if (dist < 200) {
            const high = this.shotHigh;
            this.shotHigh = !this.shotHigh;
            world.spawnProjectile({
              x: this.facing === 1 ? this.x + this.w : this.x - 6,
              y: high ? this.y + 1 : this.y + this.h - 7,
              vx: this.facing * 1.6,
              vy: 0,
              w: 6,
              h: 6,
              sprite: 'droplet',
              damage: this.def.damage,
              fromPlayer: false,
              life: 180,
            });
            world.sfx('water');
          }
          this.timer = 95;
        }
        this.fall(world);
        break;
      }
      case 'wolf': {
        if (this.onGround) {
          const want = Math.sign(dx) || this.facing;
          this.vx += want * 0.12;
          if (Math.abs(this.vx) > sp) this.vx = Math.sign(this.vx) * sp;
          this.facing = this.vx > 0 ? 1 : -1;
          if (--this.timer <= 0 && dist < 70) {
            this.vy = -3.8;
            this.timer = 80;
          }
        }
        this.frame = Math.floor(this.t / 5) % 2;
        this.fall(world);
        break;
      }
      case 'boss_backahast':
        this.updateBackahast(world, dx, p);
        break;
      case 'boss_gruvra':
        this.updateGruvra(world, dx, p);
        break;
      case 'boss_grim':
      case 'boss_placeholder':
        this.updateBoss(world, dx, dist, p);
        break;
    }
  }

  private fall(world: WorldApi): void {
    if (this.flying) {
      this.x += this.vx;
      this.y += this.vy;
      return;
    }
    this.vy = Math.min(5, this.vy + 0.35);
    const res = moveBody(world.grid, this);
    if (res.hitWall && this.def.behavior === 'walker') this.facing = this.facing === 1 ? -1 : 1;
  }

  // --- Kyrkogrimmen (and placeholder bosses) --------------------------------------

  private updateBoss(world: WorldApi, dx: number, dist: number, p: { x: number; y: number }): void {
    const b = this.boss!;
    if (!this.awake) {
      this.frame = 0;
      this.fall(world);
      return;
    }
    // Phase change.
    if (this.phase === 0 && this.hp <= this.maxHp * b.phases[1].atHpFraction) {
      this.phase = 1;
      this.sprite = b.phases[1].sprite;
      this.mode = 10;
      this.timer = 50;
      this.vx = 0;
      this.vy = 0;
      world.sfx('roar');
      world.shake(30, 2);
      world.puff(this.x + this.w / 2, this.y + this.h / 2, 'mist');
      this.baseY = this.y - 30;
    }
    const ph = b.phases[this.phase];
    if (this.stun > 0) {
      this.stun--;
      this.frame = 0;
      this.vx *= 0.85;
      this.fall(world);
      return;
    }
    if (this.phase === 0) {
      // mode 0 walk/think, 1 wind-up, 2 charge, 3 leap, 4 bell
      switch (this.mode) {
        case 0:
          this.facing = dx > 0 ? 1 : -1;
          if (this.onGround) this.vx = Math.sign(dx) * 0.5;
          this.frame = 0;
          if (--this.timer <= 0) {
            const r = (this.t * 31) % 3;
            if (r === 0 || dist > 120) {
              this.mode = 1;
              this.timer = 30;
              world.sfx('roar');
            } else if (r === 1) {
              this.mode = 3;
              this.vy = -6;
              this.vx = Math.max(-2.5, Math.min(2.5, dx / 40));
              this.onGround = false;
            } else {
              this.mode = 4;
              this.timer = 40;
              world.sfx('bell');
            }
          }
          break;
        case 1:
          this.vx = 0;
          this.frame = 1;
          if (--this.timer <= 0) {
            this.mode = 2;
            this.vx = this.facing * ph.speed * 1.7;
          }
          break;
        case 2: {
          this.frame = 1;
          const res = moveBodyPreview(this, world);
          if (res) {
            // Crashed into the wall: stunned – the moment to strike.
            this.vx = -this.facing * 1.5;
            this.vy = -2;
            this.stun = 70;
            this.mode = 0;
            this.timer = Math.round(ph.attackEvery * 60);
            world.shake(16, 3);
            world.sfx('door');
            // Loose stones / bells fall from the vault.
            for (let i = 0; i < 3; i++) {
              world.spawnProjectile({
                x: 32 + ((this.t * (i + 3) * 53) % (world.grid.w * 16 - 64)),
                y: 34,
                vx: 0,
                vy: 0.5,
                w: 8,
                h: 8,
                sprite: 'bell',
                damage: 2,
                fromPlayer: false,
                life: 160,
                gravity: 0.12,
              });
            }
          }
          break;
        }
        case 3:
          this.frame = 2;
          if (this.onGround && this.vy >= 0) {
            world.shake(10, 2);
            world.sfx('land');
            this.mode = 0;
            this.timer = Math.round(ph.attackEvery * 60);
            this.vx = 0;
          }
          break;
        case 4:
          this.vx = 0;
          this.frame = 0;
          if (this.timer % 12 === 0) {
            world.spawnProjectile({
              x: p.x - 4 + ((this.timer * 7) % 40) - 20,
              y: 34,
              vx: 0,
              vy: 0.4,
              w: 8,
              h: 8,
              sprite: 'bell',
              damage: 2,
              fromPlayer: false,
              life: 160,
              gravity: 0.12,
            });
          }
          if (--this.timer <= 0) {
            this.mode = 0;
            this.timer = Math.round(ph.attackEvery * 60);
          }
          break;
      }
      if (this.mode !== 2) this.fall(world);
      return;
    }

    // Phase 2: a floating spirit that throws bells at shield height.
    this.frame = this.mode === 12 ? 1 : 0;
    switch (this.mode) {
      case 10: // rise
        this.y += (this.baseY - this.y) * 0.05;
        if (--this.timer <= 0) {
          this.mode = 11;
          this.timer = 40;
        }
        break;
      case 11: // drift and throw
        this.facing = dx > 0 ? 1 : -1;
        this.vx += (Math.sign(dx) * ph.speed - this.vx) * 0.03;
        if (dist < 50) this.vx -= Math.sign(dx) * 0.08;
        this.x += this.vx;
        this.y = this.baseY + Math.sin(this.t / 20) * 10;
        this.clampX(world);
        if (--this.timer <= 0) {
          const high = (this.t >> 4) % 2 === 0;
          const py = high ? p.y - 6 : p.y + 4;
          world.spawnProjectile({
            x: this.facing === 1 ? this.x + this.w : this.x - 8,
            y: this.y + this.h / 2,
            vx: this.facing * 1.8,
            vy: (py - (this.y + this.h / 2)) / 55,
            w: 8,
            h: 8,
            sprite: 'bell',
            damage: this.def.damage,
            fromPlayer: false,
            life: 140,
            ghost: true,
          });
          world.sfx('bell');
          this.shotHigh = !this.shotHigh;
          this.timer = Math.round(ph.attackEvery * 60);
          if ((this.t * 17) % 4 === 0) {
            this.mode = 12;
            this.timer = 40;
          }
        }
        break;
      case 12: {
        // Swoop down at the player, then back up.
        this.facing = dx > 0 ? 1 : -1;
        this.x += Math.sign(dx) * ph.speed * 1.3;
        const groundY = (world.grid.h - 2) * 16 - this.h;
        this.y += (groundY - this.y) * 0.08;
        this.clampX(world);
        if (--this.timer <= 0) {
          this.mode = 13;
          this.timer = 50;
        }
        break;
      }
      case 13:
        this.y += (this.baseY - this.y) * 0.06;
        if (--this.timer <= 0) {
          this.mode = 11;
          this.timer = 30;
        }
        break;
    }
  }

  // --- Gruvrået -----------------------------------------------------------------------
  // Appears out of the dark, throws stones, fades away and appears elsewhere.
  // Phase two: faster, dashes along the floor and brings down the roof.

  private updateGruvra(world: WorldApi, dx: number, p: { x: number; y: number }): void {
    const b = this.boss!;
    if (!this.awake) {
      this.homeY = this.y;
      this.frame = 0;
      return;
    }
    if (this.phase === 0 && this.hp <= this.maxHp * b.phases[1].atHpFraction) {
      this.phase = 1;
      this.sprite = b.phases[1].sprite;
      world.sfx('roar');
      world.shake(30, 3);
      this.mode = 3;
      this.timer = 20;
    }
    const ph = b.phases[this.phase];
    const minX = 24;
    const maxX = world.grid.w * 16 - 24 - this.w;
    // Phase two: the roof comes down now and then.
    if (this.phase === 1 && this.t % 80 === 0) {
      world.spawnProjectile({
        x: Math.max(minX, Math.min(maxX, p.x - 4 + ((this.t * 37) % 60) - 30)),
        y: 34, vx: 0, vy: 0.6, w: 8, h: 8, sprite: 'stone',
        damage: 2, fromPlayer: false, life: 160, gravity: 0.14,
      });
      world.sfx('land');
    }
    switch (this.mode) {
      case 0: // hidden
        this.alpha = 0;
        this.untouchable = true;
        if (--this.timer <= 0) {
          // Appear away from Dagny.
          let x = minX + ((this.t * 53) % (maxX - minX));
          if (Math.abs(x + this.w / 2 - p.x) < 70) x = p.x < (minX + maxX) / 2 ? maxX - 10 : minX + 10;
          this.x = x;
          this.y = this.homeY;
          this.mode = 1;
          this.timer = 24;
          world.sfx('magic');
        }
        break;
      case 1: // fade in
        this.facing = dx > 0 ? 1 : -1;
        this.alpha = 1 - this.timer / 24;
        this.untouchable = this.alpha < 0.6;
        if (--this.timer <= 0) {
          this.mode = 2;
          this.timer = Math.round(ph.attackEvery * 60) + 30;
          this.alpha = 1;
          this.untouchable = false;
        }
        break;
      case 2: { // visible: throw stones in arcs
        this.facing = dx > 0 ? 1 : -1;
        const total = Math.round(ph.attackEvery * 60) + 30;
        const elapsed = total - this.timer;
        this.frame = elapsed % 30 > 18 ? 1 : 0;
        if (elapsed % 30 === 24) {
          const fx = this.facing === 1 ? this.x + this.w : this.x - 8;
          const flight = 46;
          world.spawnProjectile({
            x: fx, y: this.y + 4,
            vx: Math.max(-3, Math.min(3, (p.x - fx) / flight)),
            vy: -3.4, w: 8, h: 8, sprite: 'stone',
            damage: this.def.damage, fromPlayer: false, life: 140, gravity: 0.15,
          });
          world.sfx('sword');
        }
        if (--this.timer <= 0) {
          if (this.phase === 1 && (this.t >> 3) % 2 === 0) {
            this.mode = 4;
            this.vx = (p.x < this.x + this.w / 2 ? -1 : 1) * ph.speed;
            this.facing = this.vx > 0 ? 1 : -1;
            world.sfx('roar');
          } else {
            this.mode = 3;
            this.timer = 24;
          }
        }
        break;
      }
      case 3: // fade out
        this.frame = 0;
        this.alpha = Math.max(0, this.timer / 24);
        this.untouchable = this.alpha < 0.6;
        if (--this.timer <= 0) {
          this.mode = 0;
          this.timer = this.phase === 1 ? 30 : 45;
        }
        break;
      case 4: // dash along the floor
        this.frame = 2;
        this.x += this.vx;
        if (this.x <= minX || this.x >= maxX) {
          this.x = Math.max(minX, Math.min(maxX, this.x));
          world.shake(10, 2);
          world.sfx('door');
          this.mode = 3;
          this.timer = 24;
        }
        break;
    }
  }

  // --- Bäckahästen ------------------------------------------------------------------
  // Lives in the pond. Leaps onto the bank on Dagny's side, gallops, leaps back.
  // Phase two: spits water from the surface and sends waves along the ground.

  private pool: [number, number] | null = null;

  private findPool(world: WorldApi): [number, number] {
    const g = world.grid;
    const row = g.h - 2;
    let x0 = -1;
    let x1 = -1;
    for (let x = 0; x < g.w; x++) {
      if (g.kinds[row * g.w + x] === Kind.Hazard) {
        if (x0 < 0) x0 = x;
        x1 = x;
      }
    }
    return x0 < 0 ? [g.w * 8 - 32, g.w * 8 + 32] : [x0 * 16, (x1 + 1) * 16];
  }

  private leapTo(targetX: number): void {
    const frames = 44;
    this.vx = (targetX - this.x) / frames;
    this.vy = -0.3 * frames / 2;
    this.mode = this.mode === 2 ? 3 : 1;
    this.untouchable = false;
    this.alpha = 1;
  }

  private updateBackahast(world: WorldApi, dx: number, p: { x: number; y: number }): void {
    const b = this.boss!;
    if (!this.awake) {
      this.homeY = this.y;
      this.alpha = 0;
      this.untouchable = true;
      return;
    }
    if (!this.pool) {
      this.pool = this.findPool(world);
      this.mode = 0;
      this.timer = 30;
    }
    const [px0, px1] = this.pool;
    const poolMid = (px0 + px1) / 2 - this.w / 2;
    const gw = world.grid.w * 16;
    if (this.phase === 0 && this.hp <= this.maxHp * b.phases[1].atHpFraction) {
      this.phase = 1;
      this.sprite = b.phases[1].sprite;
      world.sfx('roar');
      world.shake(30, 3);
    }
    const ph = b.phases[this.phase];
    const splash = (): void => {
      world.puff(this.x + this.w / 2, this.homeY + this.h, 'mist');
      world.sfx('water');
    };
    switch (this.mode) {
      case 0: // under water
        this.alpha = 0;
        this.untouchable = true;
        this.x = poolMid;
        this.y = this.homeY + 20;
        if (--this.timer <= 0) {
          if (this.phase === 1 && this.t % 2 === 0) {
            this.mode = 4;
            this.timer = 90;
            this.y = this.homeY + 8;
            splash();
          } else {
            this.y = this.homeY;
            splash();
            const leftSide = p.x < (px0 + px1) / 2;
            const target = leftSide ? Math.max(20, px0 - this.w - 12) : Math.min(gw - 20 - this.w, px1 + 12);
            this.leapTo(target);
            world.sfx('roar');
          }
        }
        break;
      case 4: { // phase two: spit water from the surface
        this.alpha = 1;
        this.untouchable = true;
        this.frame = 0;
        this.facing = dx > 0 ? 1 : -1;
        if (this.timer % 30 === 0) {
          const high = (this.timer / 30) % 2 === 1;
          const sx = this.facing === 1 ? this.x + this.w : this.x - 6;
          world.spawnProjectile({
            x: sx, y: this.y + 2,
            vx: this.facing * 2, vy: ((high ? p.y - 8 : p.y + 6) - (this.y + 2)) / 60,
            w: 6, h: 6, sprite: 'droplet', damage: 2, fromPlayer: false, life: 150,
          });
          world.sfx('water');
        }
        if (--this.timer <= 0) {
          this.mode = 0;
          this.timer = 10;
        }
        break;
      }
      case 1: // leap out onto a bank
      case 3: // leap back into the pond
        this.frame = 2;
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.3;
        this.facing = this.vx >= 0 ? 1 : -1;
        if (this.vy > 0 && this.y >= this.homeY) {
          this.y = this.homeY;
          const cx = this.x + this.w / 2;
          if (cx > px0 && cx < px1) {
            splash();
            this.mode = 0;
            this.timer = this.phase === 1 ? 40 : 60;
          } else {
            world.shake(8, 2);
            world.sfx('land');
            this.mode = 2;
            this.timer = Math.round(ph.attackEvery * 60) + 40;
            if (this.phase === 1) {
              // A wave rolls along the ground towards Dagny.
              const dir = dx > 0 ? 1 : -1;
              world.spawnProjectile({
                x: dir === 1 ? this.x + this.w : this.x - 14, y: this.homeY + this.h - 8,
                vx: dir * 2.2, vy: 0, w: 14, h: 8, sprite: 'wave',
                damage: 2, fromPlayer: false, life: 120, ghost: true,
              });
            }
          }
        }
        break;
      case 2: { // gallop on the bank
        const onLeft = this.x + this.w / 2 < (px0 + px1) / 2;
        const lo = onLeft ? 16 : px1;
        const hi = onLeft ? px0 - this.w : gw - 16 - this.w;
        this.facing = dx > 0 ? 1 : -1;
        this.x += this.facing * ph.speed * 0.6;
        if (this.x < lo) this.x = lo;
        if (this.x > hi) this.x = hi;
        this.frame = Math.floor(this.t / 6) % 2;
        if (--this.timer <= 0) this.leapTo(poolMid);
        break;
      }
    }
  }

  private clampX(world: WorldApi): void {
    const maxX = world.grid.w * 16 - 16 - this.w;
    if (this.x < 16) {
      this.x = 16;
      this.vx = Math.abs(this.vx);
    }
    if (this.x > maxX) {
      this.x = maxX;
      this.vx = -Math.abs(this.vx);
    }
  }

  render(ctx: CanvasRenderingContext2D, camX: number, camY: number): void {
    if (this.dead) return;
    const flip = this.facing === -1;
    const sx = this.x - this.def.box.x - camX;
    const sy = this.y - this.def.box.y - camY;
    if (this.flash > 0 && Math.floor(this.flash / 2) % 2 === 0) {
      ctx.globalAlpha = 0.5 * this.alpha;
      drawSprite(ctx, this.sprite, this.frame, sx, sy, flip);
      ctx.globalAlpha = 1;
      return;
    }
    const ghostly = this.boss && this.phase === 1 && this.def.behavior === 'boss_grim';
    ctx.globalAlpha = this.alpha * (ghostly ? 0.85 : 1);
    if (ctx.globalAlpha <= 0.01) {
      ctx.globalAlpha = 1;
      return;
    }
    drawSprite(ctx, this.sprite, this.frame, sx, sy, flip);
    ctx.globalAlpha = 1;
    if (this.stun > 0 && Math.floor(this.t / 6) % 2 === 0) {
      drawSprite(ctx, 'spark', 0, sx + this.def.box.x + this.w / 2 - 4, sy + this.def.box.y - 8, false);
    }
  }
}

function isSolidOrPlatformBelow(world: WorldApi, x: number, y: number): boolean {
  return groundBelow(world.grid, { x: x - 0.5, y: y - 3, w: 1, h: 1 }) || isSolidAt(world.grid, x, y);
}

/** Moves the charging boss and reports whether it hit a wall. */
function moveBodyPreview(e: Enemy, world: WorldApi): boolean {
  e.vy = Math.min(5, e.vy + 0.35);
  const res = moveBody(world.grid, e);
  return res.hitWall;
}
