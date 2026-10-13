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
  /** A bird about to dive (drawn with a warning mark). */
  warn = false;
  /** Centre of a waltz, and how far round it has turned. */
  private cx = 0;
  private ang = 0;
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
    // Skogsrået: lovely from the front – only her hollow back can be hurt.
    if (this.def.backOnly && height !== 'magic') {
      const fromRight = fromX > this.x + this.w / 2;
      if (fromRight === (this.facing === 1)) {
        world.sparks(this.x + (fromRight ? this.w : 0), this.y + 10);
        world.sfx('block');
        this.iframes = 8;
        return 'blocked';
      }
    }
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
        // mode 0 hover, 3 wind-up (the warning), 1 dive, 4 dazed, 2 climb back.
        if (this.mode === 0) {
          this.facing = dx > 0 ? 1 : -1;
          this.x += Math.sign(dx) * 0.4 * (dist > 10 ? 1 : 0);
          this.y = this.baseY + Math.sin(this.t / 12) * 3;
          this.frame = Math.floor(this.t / 7) % 2;
          if (--this.timer <= 0 && dist < 90 && p.y > cy) {
            // Stop, rise a little and shriek: the dive comes in half a second.
            this.mode = 3;
            this.timer = 30;
            world.sfx('screech');
          }
        } else if (this.mode === 3) {
          this.facing = dx > 0 ? 1 : -1;
          this.y -= 0.35;
          this.x += Math.sin(this.t * 1.7) * 0.8;
          this.frame = Math.floor(this.t / 3) % 2;
          this.warn = true;
          if (--this.timer <= 0) {
            // The aim is locked now: step aside, or turn the shield to it.
            this.warn = false;
            this.mode = 1;
            const ang = Math.atan2(p.y - cy, dx);
            this.vx = Math.cos(ang) * sp * 1.6;
            this.vy = Math.sin(ang) * sp * 1.6;
          }
        } else if (this.mode === 1) {
          this.frame = 2;
          this.x += this.vx;
          this.y += this.vy;
          if (isSolidAt(world.grid, cx, this.y + this.h)) {
            // Crashed into the ground: dazed for a moment.
            this.mode = 4;
            this.stun = 55;
          } else if (this.y > this.baseY + 90 || this.t % 200 === 0) this.mode = 2;
        } else if (this.mode === 4) {
          this.frame = 0;
          this.y += Math.sin(this.t / 4) * 0.3;
          if (--this.stun <= 0) this.mode = 2;
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
              sprite: this.def.shot ?? 'droplet',
              damage: this.def.damage,
              fromPlayer: false,
              life: 180,
              ghost: !!this.def.shot,
            });
            world.sfx(this.def.shot ? 'magic' : 'water');
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
      case 'waltzer': {
        // Dansgasten: waltzes in a figure of eight, drifting towards Dagny.
        if (this.t === 1) this.cx = this.x;
        this.cx += Math.sign(dx) * sp * (dist > 24 ? 0.35 : 0);
        this.ang += 0.045;
        this.x = this.cx + Math.cos(this.ang) * 22;
        this.y = this.baseY - 6 + Math.sin(this.ang * 2) * 10;
        this.facing = Math.cos(this.ang + Math.PI / 2) > 0 ? 1 : -1;
        this.alpha = 0.75 + Math.sin(this.t / 15) * 0.15;
        this.frame = Math.floor(this.t / 12) % 2;
        break;
      }
      case 'blinker': {
        // Dimvätten: drifts close, fades into the fog and shows up beside Dagny.
        this.facing = dx > 0 ? 1 : -1;
        this.frame = Math.floor(this.t / 10) % 2;
        if (this.mode === 0) {
          this.x += Math.sign(dx) * sp * 0.5;
          this.y += (p.y - 8 - (this.y + this.h / 2)) * 0.01;
          if (--this.timer <= 0) this.mode = 1;
        } else if (this.mode === 1) {
          this.alpha = Math.max(0, this.alpha - 0.04);
          this.untouchable = this.alpha < 0.35;
          if (this.alpha <= 0) {
            const side = this.t % 2 === 0 ? 1 : -1;
            this.x = p.x + side * 44 - this.w / 2;
            this.y = p.y - 18;
            this.clampX(world);
            this.mode = 2;
          }
        } else {
          this.alpha = Math.min(1, this.alpha + 0.05);
          this.untouchable = this.alpha < 0.35;
          if (this.alpha >= 1) {
            this.mode = 0;
            this.timer = 120 + ((this.id * 31) % 60);
          }
        }
        break;
      }
      case 'boss_bergakung':
        this.updateBergakung(world, dx, p);
        break;
      case 'boss_skogsra':
        this.updateSkogsra(world, dx, p);
        break;
      case 'boss_spelman':
        this.updateSpelman(world, dx, p);
        break;
      case 'boss_havsfru':
        this.updateHavsfru(world, dx, p);
        break;
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

  // --- Bergakungen ----------------------------------------------------------------------
  // A slow giant. Stomps (stones fall from the roof and a shock wave runs along the
  // floor – after a stomp he stands panting, the moment to strike), rolls boulders that
  // no shield can stop (jump them) and throws rocks. Phase two: the bond weakens, light
  // shines through the cracks, he calls up skuggvargar and rolls boulders in pairs.

  private updateBergakung(world: WorldApi, dx: number, p: { x: number; y: number }): void {
    const b = this.boss!;
    if (!this.awake) {
      this.homeY = this.y;
      this.frame = 0;
      return;
    }
    const gw = world.grid.w * 16;
    const floorY = this.homeY + this.h;
    const minX = 20;
    const maxX = gw - 20 - this.w;
    const summon = (): void => {
      world.spawnEnemy('skuggvarg', 40, floorY);
      world.spawnEnemy('skuggvarg', gw - 40, floorY);
      world.sfx('roar');
    };
    if (this.phase === 0 && this.hp <= this.maxHp * b.phases[1].atHpFraction) {
      this.phase = 1;
      this.sprite = b.phases[1].sprite;
      this.stun = 0;
      this.mode = 0;
      this.timer = 50;
      world.shake(30, 3);
      summon();
    }
    const ph = b.phases[this.phase];
    this.y = this.homeY;
    if (this.stun > 0) {
      // Panting after a stomp.
      this.stun--;
      this.frame = 0;
      return;
    }
    const rest = (): void => {
      this.mode = 0;
      this.timer = Math.round(ph.attackEvery * 60);
    };
    const boulder = (dir: number, speed: number, delay = 0): void =>
      world.spawnProjectile({
        x: dir === 1 ? this.x + this.w - 4 : this.x - 10, y: floorY - 14, vx: dir * speed, vy: 0,
        w: 14, h: 14, sprite: 'boulder', damage: 3, fromPlayer: false, life: 420, delay,
      });
    switch (this.mode) {
      case 0: { // lumber towards Dagny
        this.facing = dx > 0 ? 1 : -1;
        this.frame = Math.floor(this.t / 20) % 2 === 0 ? 0 : 2;
        if (Math.abs(dx) > 44) this.x = Math.max(minX, Math.min(maxX, this.x + this.facing * ph.speed * 0.3));
        if (this.t % 40 === 0) world.shake(3, 1);
        if (--this.timer <= 0) {
          const order = this.phase === 0 ? [1, 2, 1, 3] : [1, 2, 4, 1, 3, 2];
          this.mode = order[this.cycle++ % order.length];
          this.timer = this.mode === 1 ? 40 : 30;
          if (this.mode === 4 && world.minions() >= 2) this.mode = 3;
        }
        break;
      }
      case 1: // stomp: arms up, then the ground shakes
        this.frame = 1;
        if (--this.timer <= 0) {
          this.frame = 0;
          world.shake(24, 3);
          world.sfx('door');
          const n = this.phase === 1 ? 5 : 3;
          for (let i = 0; i < n; i++) {
            const x = Math.max(20, Math.min(gw - 28, p.x - 4 + (i - (n - 1) / 2) * 34));
            world.spawnProjectile({
              x, y: 18, vx: 0, vy: 0.4, w: 8, h: 8, sprite: 'stone',
              damage: 2, fromPlayer: false, life: 200, gravity: 0.13, delay: 10 + i * 9, ghost: true,
            });
          }
          for (const dir of [-1, 1]) {
            world.spawnProjectile({
              x: dir === 1 ? this.x + this.w : this.x - 14, y: floorY - 8, vx: dir * 2, vy: 0,
              w: 14, h: 8, sprite: 'wave', damage: 2, fromPlayer: false, life: 140, ghost: true,
            });
          }
          this.stun = this.phase === 1 ? 50 : 70;
          rest();
        }
        break;
      case 2: // roll a boulder (two in phase two)
        this.frame = 2;
        if (--this.timer <= 0) {
          boulder(this.facing, this.phase === 1 ? 2 : 1.6);
          if (this.phase === 1) boulder(this.facing, 2, 50);
          world.sfx('door');
          rest();
        }
        break;
      case 3: // throw rocks in arcs
        this.frame = 1;
        if (this.timer === 12) {
          const n = this.phase === 1 ? 4 : 3;
          for (let i = 0; i < n; i++) {
            const tx = p.x + (i - (n - 1) / 2) * 22;
            const flight = 55;
            const sx = this.x + this.w / 2;
            world.spawnProjectile({
              x: sx, y: this.y, vx: (tx - sx) / flight, vy: -3.8 - i * 0.25,
              w: 8, h: 8, sprite: 'stone', damage: 2, fromPlayer: false, life: 160, gravity: 0.14,
            });
          }
          world.sfx('sword');
        }
        if (--this.timer <= 0) rest();
        break;
      case 4: // call the skuggvargar
        this.frame = 1;
        if (--this.timer <= 0) {
          summon();
          rest();
        }
        break;
    }
  }

  // --- Skogsrået ------------------------------------------------------------------------
  // Walks towards Dagny with her lovely face turned to her. Dashes past and stands
  // with her hollow back turned for a moment – the only time she can be hurt.
  // Calls roots up from the ground (dirt sprays first) and throws pine cones.

  private updateSkogsra(world: WorldApi, dx: number, p: { x: number; y: number }): void {
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
      world.shake(24, 2);
    }
    const ph = b.phases[this.phase];
    const gw = world.grid.w * 16;
    const minX = 18;
    const maxX = gw - 18 - this.w;
    const floorY = this.homeY + this.h;
    switch (this.mode) {
      case 0: // stroll towards Dagny, face first
        this.facing = dx > 0 ? 1 : -1;
        this.frame = 0;
        if (Math.abs(dx) > 30) this.x = Math.max(minX, Math.min(maxX, this.x + this.facing * ph.speed * 0.35));
        if (--this.timer <= 0) {
          const c = this.cycle++ % 3;
          this.mode = c === 0 ? 1 : c === 1 ? 3 : 4;
          this.timer = c === 0 ? 24 : 40;
        }
        break;
      case 1: // wind up, then dash past Dagny
        this.frame = 1;
        if (--this.timer <= 0) {
          this.mode = 5;
          this.vx = this.facing * ph.speed * 2.2;
          world.sfx('roar');
        }
        break;
      case 5: // dashing
        this.frame = 2;
        this.x += this.vx;
        if (this.x <= minX || this.x >= maxX) {
          this.x = Math.max(minX, Math.min(maxX, this.x));
          // Stop with her back to the room.
          this.facing = this.x <= minX ? -1 : 1;
          this.mode = 2;
          this.timer = this.phase === 1 ? 55 : 75;
          world.shake(6, 1);
        }
        break;
      case 2: // recovering, back turned – strike now
        this.frame = 0;
        if (--this.timer <= 0) {
          this.mode = 0;
          this.timer = Math.round(ph.attackEvery * 60);
        }
        break;
      case 3: // roots burst up where the dirt sprays
        this.facing = dx > 0 ? 1 : -1;
        this.frame = 1;
        if (this.timer === 30) {
          const n = this.phase === 1 ? 5 : 3;
          for (let i = 0; i < n; i++) {
            const x = Math.max(8, Math.min(gw - 18, p.x - 5 + (i - (n - 1) / 2) * 30));
            world.spawnProjectile({
              x, y: floorY - 24, vx: 0, vy: 0, w: 10, h: 24, sprite: 'root',
              damage: 2, fromPlayer: false, life: 36, ghost: true, delay: 40 + i * 8,
            });
          }
          world.sfx('magic');
        }
        if (--this.timer <= 0) {
          this.mode = 0;
          this.timer = Math.round(ph.attackEvery * 60);
        }
        break;
      case 4: // pine cones in arcs
        this.facing = dx > 0 ? 1 : -1;
        this.frame = 1;
        if (this.timer === 20) {
          for (let i = 0; i < 3; i++) {
            const tx = p.x + (i - 1) * 20;
            const flight = 50;
            world.spawnProjectile({
              x: this.x + this.w / 2, y: this.y + 6, vx: (tx - this.x - this.w / 2) / flight, vy: -3.6 - i * 0.3,
              w: 6, h: 8, sprite: 'kotte', damage: 2, fromPlayer: false, life: 150, gravity: 0.14,
            });
          }
          world.sfx('sword');
        }
        if (--this.timer <= 0) {
          this.mode = 0;
          this.timer = Math.round(ph.attackEvery * 60);
        }
        break;
    }
  }

  // --- Spelmannen ----------------------------------------------------------------------
  // Plays on the stage and sends notes across the floor (duck, jump or block them),
  // then leaps down and dances across the floor – the moment to strike.
  // Phase two: he is Näcken; faster tunes, notes that rain down, hopping dances.

  private updateSpelman(world: WorldApi, dx: number, p: { x: number; y: number }): void {
    const b = this.boss!;
    if (!this.awake) {
      this.homeY = this.y;
      this.baseY = this.x;
      this.frame = 0;
      return;
    }
    if (this.phase === 0 && this.hp <= this.maxHp * b.phases[1].atHpFraction) {
      this.phase = 1;
      this.sprite = b.phases[1].sprite;
      world.sfx('roar');
      world.shake(24, 2);
    }
    const ph = b.phases[this.phase];
    const gw = world.grid.w * 16;
    const floorY = (world.grid.h - 2) * 16;
    const stageX = this.baseY;
    const note = (x: number, y: number, vx: number, vy: number, gravity = 0): void =>
      world.spawnProjectile({ x, y, vx, vy, w: 8, h: 8, sprite: 'noteShot', damage: 2, fromPlayer: false, life: 220, gravity, ghost: true });
    switch (this.mode) {
      case 0: { // play on the stage
        this.facing = -1;
        this.frame = Math.floor(this.t / 12) % 2;
        if (--this.timer <= 0) {
          this.cycle++;
          const lo = floorY - 7;
          const hi = floorY - 21;
          const sx = this.x - 6;
          if (this.cycle % 3 === 1) {
            // A phrase along the floor, alternating high and low.
            for (let i = 0; i < (this.phase === 1 ? 6 : 4); i++) {
              const high = i % 2 === 0;
              world.spawnProjectile({
                x: sx + i * 18, y: high ? hi : lo, vx: -1.7, vy: 0, w: 8, h: 8,
                sprite: 'noteShot', damage: 2, fromPlayer: false, life: 260, ghost: true, delay: i * 14,
              });
            }
          } else if (this.cycle % 3 === 2) {
            // Notes tossed in arcs that fall where Dagny stands.
            const n = this.phase === 1 ? 5 : 3;
            for (let i = 0; i < n; i++) {
              const tx = p.x + (i - (n - 1) / 2) * 26;
              const flight = 60;
              note(this.x, this.y + 6, (tx - this.x) / flight, -3.6 - i * 0.2, 0.12);
            }
          } else {
            // Leap down and dance.
            this.mode = 1;
            this.vx = (Math.max(32, Math.min(gw - 64, p.x)) - this.x) / 40;
            this.vy = -6;
            world.sfx('roar');
            break;
          }
          world.sfx('magic');
          this.timer = Math.round(ph.attackEvery * 60);
        }
        break;
      }
      case 1: // leap to the floor
      case 3: // leap back to the stage
        this.frame = 2;
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.3;
        if (this.vy > 0) {
          const target = this.mode === 1 ? floorY - this.h : this.homeY;
          if (this.y >= target) {
            this.y = target;
            if (this.mode === 1) {
              this.mode = 2;
              this.timer = this.phase === 1 ? 170 : 140;
              this.facing = dx > 0 ? 1 : -1;
              world.shake(6, 1);
            } else {
              this.mode = 0;
              this.x = stageX;
              this.timer = 40;
            }
          }
        }
        break;
      case 2: { // dance across the floor
        this.frame = Math.floor(this.t / 8) % 2 === 0 ? 2 : 0;
        this.x += this.facing * ph.speed;
        if (this.x < 20) { this.x = 20; this.facing = 1; }
        if (this.x > stageX - 30) { this.x = stageX - 30; this.facing = -1; }
        if (this.phase === 1 && this.t % 50 === 0 && this.y >= floorY - this.h) this.vy = -3.6;
        if (this.vy !== 0 || this.y < floorY - this.h) {
          this.y += this.vy;
          this.vy += 0.3;
          if (this.y >= floorY - this.h) { this.y = floorY - this.h; this.vy = 0; }
        }
        if (this.t % 30 === 0) world.sfx('step');
        if (--this.timer <= 0) {
          this.mode = 3;
          this.vx = (stageX - this.x) / 40;
          this.vy = -6.5;
        }
        break;
      }
    }
  }

  // --- Havsfrun ------------------------------------------------------------------------
  // Hovers above the gallery. Spits sea water, calls gusts that push Dagny towards
  // the edge, and swoops down. Phase two adds lightning that strikes where it warns.

  private cycle = 0;

  private updateHavsfru(world: WorldApi, dx: number, p: { x: number; y: number }): void {
    const b = this.boss!;
    if (!this.awake) {
      this.homeY = this.y;
      this.baseY = this.y - 64;
      this.frame = 0;
      return;
    }
    if (this.phase === 0 && this.hp <= this.maxHp * b.phases[1].atHpFraction) {
      this.phase = 1;
      this.sprite = b.phases[1].sprite;
      world.sfx('thunder');
      world.shake(30, 3);
      this.mode = 2;
      this.timer = 40;
    }
    const ph = b.phases[this.phase];
    const gw = world.grid.w * 16;
    const minX = 20;
    const maxX = gw - 20 - this.w;
    const floorY = this.homeY + this.h;
    this.facing = dx > 0 ? 1 : -1;
    const drift = (): void => {
      const want = Math.max(minX, Math.min(maxX, p.x - this.w / 2 + Math.sin(this.t / 50) * 60));
      this.x += Math.max(-ph.speed, Math.min(ph.speed, (want - this.x) * 0.05));
      this.y += (this.baseY + Math.sin(this.t / 20) * 6 - this.y) * 0.1;
    };
    switch (this.mode) {
      case 0: // drift and choose
        this.frame = 0;
        drift();
        if (--this.timer <= 0) {
          const c = this.cycle++ % 4;
          if (c === 0) { this.mode = 1; this.timer = 34; }
          else if (c === 1) { this.mode = this.phase === 1 ? 4 : 2; this.timer = 40; }
          else if (c === 2) { this.mode = 3; this.timer = 70; this.vx = Math.sign(dx) * ph.speed * 1.4; }
          else { this.mode = this.phase === 1 ? 2 : 1; this.timer = 40; }
        }
        break;
      case 1: // spit a fan of sea water
        this.frame = 1;
        drift();
        if (this.timer === 18) {
          const cx = this.x + this.w / 2;
          const cy = this.y + 12;
          const base = Math.atan2(p.y - cy, p.x - cx);
          for (const off of [-0.25, 0, 0.25]) {
            world.spawnProjectile({
              x: cx - 3, y: cy, vx: Math.cos(base + off) * 2, vy: Math.sin(base + off) * 2,
              w: 6, h: 6, sprite: 'droplet', damage: 2, fromPlayer: false, life: 160, ghost: true,
            });
          }
          world.sfx('water');
        }
        if (--this.timer <= 0) { this.mode = 0; this.timer = Math.round(ph.attackEvery * 60); }
        break;
      case 2: // call the storm: a gust towards the nearest edge
        this.frame = 1;
        drift();
        if (this.timer === 30) {
          const out = p.x > gw / 2 ? 1 : -1;
          world.gust(out * (this.phase === 1 ? 1.3 : 0.95), 80);
        }
        if (--this.timer <= 0) { this.mode = 0; this.timer = Math.round(ph.attackEvery * 60); }
        break;
      case 3: // swoop down at Dagny
        this.frame = 2;
        this.x = Math.max(minX, Math.min(maxX, this.x + this.vx));
        if (this.timer > 35) this.y += (floorY - this.h - 2 - this.y) * 0.12;
        else this.y += (this.baseY - this.y) * 0.08;
        if (--this.timer <= 0) { this.mode = 0; this.timer = Math.round(ph.attackEvery * 60); }
        break;
      case 4: // lightning where it warns
        this.frame = 1;
        drift();
        if (this.timer === 38) {
          for (const [k, off] of [[0, -36], [1, 0], [2, 36]] as const) {
            const x = Math.max(8, Math.min(gw - 16, p.x + off - 4));
            world.spawnProjectile({
              x, y: 0, vx: 0, vy: 0, w: 8, h: floorY,
              sprite: 'bolt', damage: 3, fromPlayer: false, life: 14, ghost: true, delay: 46 + k * 10,
            });
          }
          world.sfx('magic');
        }
        if (this.timer === 1) world.sfx('thunder');
        if (--this.timer <= 0) { this.mode = 0; this.timer = Math.round(ph.attackEvery * 60) + 20; }
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

  /** True while a bird is diving (the shield can turn it away). */
  get diving(): boolean {
    return this.def.behavior === 'diver' && this.mode === 1;
  }

  /** The shield caught a diving bird: it tumbles back, dazed. */
  parry(fromX: number): void {
    this.mode = 4;
    this.stun = 70;
    this.vx = 0;
    this.vy = 0;
    this.x += this.x + this.w / 2 < fromX ? -6 : 6;
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
    if (this.warn && Math.floor(this.t / 4) % 2 === 0) {
      // "!" over a bird about to dive.
      ctx.fillStyle = '#f0d27a';
      const wx = Math.round(sx + this.def.box.x + this.w / 2 - 1);
      const wy = Math.round(sy + this.def.box.y - 9);
      ctx.fillRect(wx, wy, 2, 5);
      ctx.fillRect(wx, wy + 6, 2, 2);
    }
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
