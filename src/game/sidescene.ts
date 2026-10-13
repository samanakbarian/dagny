import { Kind, firmlySupported, moveBody, overlaps, touchesKind, isSolidAt, rectHitsSolid, pushX, TILE, type Rect, type TileGrid } from '../engine/collision';
import { Act } from '../engine/input';
import { VIEW_W, VIEW_H } from '../engine/screen';
import { drawSprite, frameCount, spriteSize } from '../engine/sprites';
import { ring } from '../engine/draw';
import { drawText, measure } from '../engine/text';
import { AREAS } from '../data/areas';
import { BOSSES, ENEMIES } from '../data/enemies';
import { ENEMY_CHARS, PICKUP_CHARS, THEMES, DECO, FRONT, kindOf } from '../data/legend';
import { NPCS } from '../data/npcs';
import { PALETTE } from '../data/palettes';
import { SPELLS } from '../data/spells';
import { STR } from '../data/strings';
import { ITEMS } from '../data/items';
import { templeById } from '../data/temples';
import type { AreaDef, Exit, PuffKind, SpellId } from '../data/types';
import { Player, STAND_H, type PlayerControls } from '../entities/player';
import { Enemy, type HitHeight } from '../entities/enemy';
import { Npc, Particles, Pickup, Projectile } from '../entities/misc';
import { MovingPlatform } from '../entities/platform';
import type { ProjectileInit, WorldApi } from '../entities/types';
import { drawBackdrop } from './backdrop';
import { DialogOverlay } from './dialog';
import type { Game, Scene } from './game';
import { drawHud } from './hud';
import { canLevelUp, damageTaken, maxHp, maxMp, swordDamage } from './progression';
import { hasFlag, hasItem, setFlag, type GameState } from './state';
import * as flow from './flow';
import { beatIndex, squareActive, stepsToSwap } from './beat';
import { LevelUpOverlay, GameOverOverlay } from './menus';

export interface Spawn {
  entry?: string;
  /** Dialog shown right after arriving. */
  dialog?: string;
  x?: number;
  y?: number;
  facing?: 1 | -1;
}

interface Marker {
  tx: number;
  ty: number;
}

interface Checkpoint extends Marker {
  lit: boolean;
  pid: string;
}

type SpellTimers = Record<'skydd' | 'hopp' | 'lyse' | 'eld' | 'hamn', number>;

const tmpA: Rect = { x: 0, y: 0, w: 0, h: 0 };
const tmpB: Rect = { x: 0, y: 0, w: 0, h: 0 };

/** Side view: villages, paths, encounters and temples. */
export class SideScene implements Scene, WorldApi {
  readonly area: AreaDef;
  readonly grid: TileGrid;
  private tileSprite: (string | null)[] = [];
  private anim: Array<{ x: number; y: number; sprite: string; offset: number }> = [];
  private staticLayer: HTMLCanvasElement;
  private entries = new Map<string, Marker>();
  private doors: Array<Marker & { exit: Exit; ch: string }> = [];
  private signs: Array<Marker & { dialog: string }> = [];
  private checkpoints: Checkpoint[] = [];
  private altar: Marker | null = null;
  readonly player = new Player();
  private enemies: Enemy[] = [];
  private npcs: Npc[] = [];
  private pickups: Pickup[] = [];
  private projectiles: Projectile[] = [];
  private platforms: MovingPlatform[] = [];
  private frontLayer: HTMLCanvasElement | null = null;
  /** Näverluren: a befriended vätte that fights alongside Dagny. */
  private helpers: Array<{ x: number; y: number; vx: number; vy: number; onGround: boolean; w: number; h: number; life: number; cd: number; facing: 1 | -1 }> = [];
  private lurCooldown = 0;
  private beatCells: Array<{ i: number; tx: number; ty: number; group: '%' | '&' }> = [];
  private lastBeat = -1;
  private riding: MovingPlatform | null = null;
  /** A boss gust pushing Dagny: dx per step and steps left. */
  private gustDx = 0;
  private gustT = 0;
  private particles = new Particles();
  private ambient = new Particles();
  private camX = 0;
  private camY = 0;
  private shakeT = 0;
  private shakeS = 0;
  frame = 0;
  private boss: Enemy | null = null;
  private bossOutro = 0;
  /** Steps after a hazard respawn during which hazards don't hurt again. */
  private hazardGrace = 0;
  private nameT = 0;
  private flashT = 0;
  private lockMsgT = 0;
  private deadT = 0;
  private spell: SpellTimers = { skydd: 0, hopp: 0, lyse: 0, eld: 0, hamn: 0 };
  private dark: HTMLCanvasElement | null = null;
  private exiting = false;
  private prompt: { x: number; y: number } | null = null;

  constructor(private readonly game: Game, areaId: string, private readonly spawn: Spawn) {
    const area = AREAS[areaId];
    if (!area) throw new Error(`Okänt område: ${areaId}`);
    this.area = area;
    const h = area.tiles.length;
    const w = area.tiles[0].length;
    this.grid = {
      w,
      h,
      kinds: new Uint8Array(w * h),
      wallLeft: !area.left,
      wallRight: !area.right,
    };
    this.build();
    this.staticLayer = this.renderStatic();
    this.frontLayer = this.renderFront();
    this.placePlayer();
    const px = this.player.x;
    this.platforms = (area.platforms ?? []).flatMap((d) => MovingPlatform.create(d, px));
    this.player.landOn = (pl, prevBottom) => this.landOnPlatform(pl, prevBottom);
    if (area.dark) {
      this.dark = document.createElement('canvas');
      this.dark.width = VIEW_W;
      this.dark.height = VIEW_H;
    }
  }

  private get s(): GameState {
    return this.game.state as GameState;
  }

  private pid(tx: number, ty: number): string {
    return `${this.area.id}:${tx},${ty}`;
  }

  // --- Building the area from data ----------------------------------------------------

  private build(): void {
    const a = this.area;
    const theme = THEMES[a.theme];
    const s = this.s;
    const { w, h } = this.grid;
    const at = (x: number, y: number): string => (y < 0 || y >= h || x < 0 || x >= w ? '.' : a.tiles[y][x]);
    this.tileSprite = new Array(w * h).fill(null);
    for (let ty = 0; ty < h; ty++) {
      for (let tx = 0; tx < w; tx++) {
        const ch = a.tiles[ty][tx];
        const i = ty * w + tx;
        const px = tx * TILE + TILE / 2;
        const py = (ty + 1) * TILE;
        let kind = kindOf(ch);
        switch (ch) {
          case '#': {
            const above = at(tx, ty - 1);
            this.tileSprite[i] = above === '#' || above === 'L' || above === '?' ? theme.fill : theme.top;
            break;
          }
          case '?': {
            // Hidden passage: the transistor radio's static gives it away.
            if (hasItem(s, 'radio')) {
              kind = Kind.Empty;
              this.tileSprite[i] = 'secretOpen';
            } else {
              const above = at(tx, ty - 1);
              this.tileSprite[i] = above === '#' || above === 'L' || above === '?' ? theme.fill : theme.top;
            }
            break;
          }
          case '%':
          case '&':
            this.beatCells.push({ i, tx, ty, group: ch });
            kind = ch === '%' ? Kind.OneWay : Kind.Empty;
            break;
          case '=':
            this.tileSprite[i] = theme.platform;
            break;
          case '^':
            this.tileSprite[i] = 'spikes';
            break;
          case 'n':
            this.tileSprite[i] = 'nettles';
            // Nettle tops stick up above the ground so the patch reads as a hazard.
            if (at(tx, ty - 1) !== 'n') this.anim.push({ x: tx * TILE, y: (ty - 1) * TILE, sprite: 'nettleTops', offset: tx });
            break;
          case '~':
            if (at(tx, ty - 1) === '~') this.tileSprite[i] = 'waterDeep';
            else this.anim.push({ x: tx * TILE, y: ty * TILE, sprite: 'water', offset: tx });
            break;
          case 'L':
            if (s.opened.includes(this.pid(tx, ty))) kind = Kind.Empty;
            else this.tileSprite[i] = 'lockedDoor';
            break;
          case 'k':
            if (!s.opened.includes(this.pid(tx, ty))) {
              this.pickups.push(new Pickup('key', px - 4, py - 12, 'key', false, this.pid(tx, ty)));
            }
            break;
          case 'c': {
            const pid = `cp:${this.pid(tx, ty)}`;
            this.checkpoints.push({ tx, ty, lit: s.opened.includes(pid), pid });
            break;
          }
          case 'X':
            this.altar = { tx, ty };
            this.tileSprite[i] = 'altar';
            break;
          case 'q': {
            const item = a.questItem;
            if (item && ITEMS[item] && !hasItem(s, item) && !hasFlag(s, `${item}_klar`)) {
              this.pickups.push(new Pickup('quest', px - 4, py - 10, ITEMS[item].sprite, false, item));
            }
            break;
          }
          case 'M':
            if (!hasItem(s, 'murre') && !hasFlag(s, 'murre_hemma')) {
              this.pickups.push(new Pickup('cat', px - 7, py - 10, 'cat', false));
            }
            break;
          case 'B': {
            const temple = a.temple ? templeById(a.temple) : undefined;
            const bossId = temple?.boss ?? 'grim';
            if (!hasFlag(s, `${a.temple}_boss`)) {
              const def = BOSSES[bossId];
              if (def) {
                this.boss = new Enemy(def, px, py);
                this.enemies.push(this.boss);
              }
            }
            break;
          }
          default: {
            if (ENEMY_CHARS[ch]) {
              const def = ENEMIES[ENEMY_CHARS[ch]];
              if (def) this.enemies.push(new Enemy(def, px, py));
            } else if (PICKUP_CHARS[ch]) {
              const k = PICKUP_CHARS[ch];
              const sz = spriteSize(k);
              this.pickups.push(new Pickup(k, px - sz.w / 2, py - sz.h - 2, k, false));
            } else if (ch >= '1' && ch <= '9') {
              const npcId = a.npcs?.[ch];
              const def = npcId ? NPCS[npcId] : undefined;
              if (def && this.game.check(def.if)) this.npcs.push(new Npc(def, px, py));
            } else if (ch >= 'A' && ch <= 'Z' || ch === '@') {
              this.entries.set(ch, { tx, ty });
              if (a.doors?.[ch]) this.doors.push({ tx, ty, exit: a.doors[ch], ch });
              if (a.signs?.[ch]) this.signs.push({ tx, ty, dialog: a.signs[ch] });
            }
          }
        }
        this.grid.kinds[i] = kind;
      }
    }
    // The treasure appears on the altar once the guardian is reconciled.
    if (this.altar && a.treasure && !hasItem(s, a.treasure) && (!this.boss)) this.spawnTreasure();
    if (a.afterBoss && a.temple && hasFlag(s, `${a.temple}_boss`)) this.spawnAfterBoss();
    // Animated decor (candles).
    if (a.deco) {
      for (let ty = 0; ty < h; ty++) {
        for (let tx = 0; tx < w; tx++) {
          const id = DECO[a.deco[ty][tx]];
          if (id && frameCount(id) > 1) this.anim.push({ x: tx * TILE, y: ty * TILE, sprite: id, offset: tx * 3 + ty });
        }
      }
    }
  }

  /** Someone who was waiting behind the guardian (Dagmar in Trollberget). */
  private spawnAfterBoss(): void {
    const ab = this.area.afterBoss;
    const def = ab ? NPCS[ab.npc] : undefined;
    if (!ab || !def || this.npcs.some((n) => n.def.id === def.id)) return;
    const n = new Npc(def, ab.tx * TILE + 8, (ab.ty + 1) * TILE);
    this.npcs.push(n);
    this.puff(n.x + n.w / 2, n.y + n.h / 2, 'mist');
  }

  private spawnTreasure(): void {
    if (!this.altar || !this.area.treasure) return;
    const item = ITEMS[this.area.treasure];
    if (!item) return;
    const x = this.altar.tx * TILE;
    const y = this.altar.ty * TILE + 8 - 12;
    this.pickups.push(new Pickup('treasure', x, y - 4, item.sprite, false, item.id));
  }

  private renderStatic(): HTMLCanvasElement {
    const { w, h } = this.grid;
    const c = document.createElement('canvas');
    c.width = w * TILE;
    c.height = h * TILE;
    const ctx = c.getContext('2d') as CanvasRenderingContext2D;
    const deco = this.area.deco;
    if (deco) {
      for (let ty = 0; ty < h; ty++) {
        for (let tx = 0; tx < w; tx++) {
          const id = DECO[deco[ty][tx]];
          if (!id) continue;
          if (frameCount(id) === 1) {
            drawSprite(ctx, id, 0, tx * TILE, ty * TILE);
          } else {
            // Animated decor is drawn each frame; fill the wall behind it from a neighbour.
            const n = [deco[ty][tx - 1], deco[ty][tx + 1], deco[ty - 1]?.[tx], deco[ty + 1]?.[tx]]
              .map((ch) => (ch ? DECO[ch] : undefined))
              .find((nid) => nid && frameCount(nid) === 1 && nid.startsWith('bg'));
            if (n) drawSprite(ctx, n, 0, tx * TILE, ty * TILE);
          }
        }
      }
    }
    for (let ty = 0; ty < h; ty++) {
      for (let tx = 0; tx < w; tx++) {
        const id = this.tileSprite[ty * w + tx];
        if (id) drawSprite(ctx, id, 0, tx * TILE, ty * TILE);
      }
    }
    return c;
  }

  private renderFront(): HTMLCanvasElement | null {
    const front = this.area.front;
    if (!front) return null;
    const { w, h } = this.grid;
    const c = document.createElement('canvas');
    c.width = w * TILE;
    c.height = h * TILE;
    const ctx = c.getContext('2d') as CanvasRenderingContext2D;
    for (let ty = 0; ty < h; ty++) {
      for (let tx = 0; tx < w; tx++) {
        const id = FRONT[front[ty]?.[tx] ?? '.'];
        if (id) drawSprite(ctx, id, 0, tx * TILE, ty * TILE);
      }
    }
    return c;
  }

  private placePlayer(): void {
    const sp = this.spawn;
    const p = this.player;
    if (sp.x !== undefined && sp.y !== undefined) {
      p.place(sp.x, sp.y);
    } else {
      const m = (sp.entry && this.entries.get(sp.entry)) || this.entries.get('@') || this.entries.get('A') || this.entries.get('W') || { tx: 2, ty: this.grid.h - 3 };
      p.place(m.tx * TILE + TILE / 2 - p.w / 2, (m.ty + 1) * TILE - STAND_H);
    }
    if (sp.facing) p.facing = sp.facing;
    else if (sp.entry === 'E') p.facing = -1;
    this.applySkills();
    this.snapCamera();
  }

  private applySkills(): void {
    const s = this.s;
    this.player.canDownThrust = s.skills.includes('nedatstot');
    this.player.canUpThrust = s.skills.includes('uppatstot');
  }

  // --- Scene interface ------------------------------------------------------------------

  music(): string | null {
    if (this.boss && this.boss.awake && !this.boss.dead) {
      return templeById(this.area.temple ?? '')?.bossMusic ?? 'boss';
    }
    return this.area.music;
  }

  enter(): void {
    const a = this.area;
    if (a.showName) this.nameT = 150;
    if (a.kind === 'village') this.s.lastVillage = a.id;
    // Autosave on every area change (encounters save the overworld spot instead).
    this.game.save();
    if (this.spawn.dialog) this.game.pushOverlay(new DialogOverlay(this.game, this.spawn.dialog));
    if (a.onEnter && !hasFlag(this.s, a.onEnter.unlessFlag)) {
      setFlag(this.s, a.onEnter.setFlag);
      this.game.pushOverlay(new DialogOverlay(this.game, a.onEnter.dialog));
    }
  }

  capture(state: GameState): void {
    if (this.player.state === 'dead') return;
    if (this.area.kind === 'encounter') {
      state.loc = { area: 'overworld', x: state.ow.x, y: state.ow.y };
      return;
    }
    const p = this.player;
    // Store a standing position even if Dagny is ducking or a bird.
    const y = p.y + p.h - STAND_H;
    const solid = p.onGround && !p.onPlatform;
    state.loc = { area: this.area.id, x: Math.round(solid ? p.x : p.safeX), y: Math.round(solid ? y : p.safeY) };
  }

  // --- WorldApi ---------------------------------------------------------------------------

  playerCenter(): { x: number; y: number } {
    const p = this.player;
    return { x: p.x + p.w / 2, y: p.y + p.h / 2 };
  }

  playerBox(): Rect {
    const p = this.player;
    return { x: p.x, y: p.y, w: p.w, h: p.h };
  }

  playerDucking(): boolean {
    return this.player.ducking;
  }

  spawnProjectile(p: ProjectileInit): void {
    this.projectiles.push(new Projectile(p));
  }

  puff(x: number, y: number, kind: PuffKind): void {
    this.particles.spawn({ x: x - 8, y: y - 8, sprite: 'puff', frames: 3, life: 27 });
    const colors = kind === 'moss' ? ['M', 'l', 'e'] : kind === 'leaf' ? ['o', 'y', 'R'] : ['W', 'C', 'w'];
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      this.particles.spawn({
        x, y,
        vx: Math.cos(a) * (0.6 + Math.random()),
        vy: Math.sin(a) * (0.6 + Math.random()) - 0.6,
        gravity: kind === 'mist' ? -0.01 : 0.05,
        life: 30 + Math.floor(Math.random() * 20),
        color: PALETTE[colors[i % 3]],
        size: kind === 'leaf' ? 2 : 1,
      });
    }
  }

  sparks(x: number, y: number): void {
    this.particles.spawn({ x: x - 4, y: y - 4, sprite: 'spark', frames: 2, life: 10 });
  }

  sfx(id: string): void {
    this.game.audio.play(id);
  }

  gust(dx: number, frames: number): void {
    this.gustDx = dx;
    this.gustT = frames;
    this.sfx('wind');
  }

  spawnEnemy(id: string, px: number, py: number): boolean {
    const def = ENEMIES[id];
    if (!def || this.minions() >= 2) return false;
    const e = new Enemy(def, px, py);
    e.facing = px < this.player.x ? 1 : -1;
    this.enemies.push(e);
    this.puff(px, py - 8, 'mist');
    return true;
  }

  minions(): number {
    return this.enemies.filter((e) => !e.dead && e !== this.boss).length;
  }

  /** Current push of a wind zone at this step, or null when calm. */
  private windAt(z: import('../data/types').WindZone): { dx: number; up: number } | null {
    const cycle = z.on + z.off;
    const t = (this.frame + (z.offset ?? 0)) % cycle;
    if (t >= z.on) return null;
    if (z.dir === 'up') return { dx: 0, up: z.force };
    let dir = z.dir === 'left' ? -1 : 1;
    if (z.dir === 'alternate') dir = Math.floor((this.frame + (z.offset ?? 0)) / cycle) % 2 === 0 ? 1 : -1;
    // Ease the gust in and out.
    const ease = Math.min(1, t / 20, (z.on - t) / 20);
    return { dx: dir * z.force * ease, up: 0 };
  }

  private applyWind(): void {
    const p = this.player;
    if (p.state === 'dead') return;
    let dx = 0;
    for (const z of this.area.wind ?? []) {
      const tx = (p.x + p.w / 2) / TILE;
      const ty = (p.y + p.h / 2) / TILE;
      if (tx < z.x0 || tx >= z.x1 + 1 || ty < z.y0 || ty >= z.y1 + 1) continue;
      const w = this.windAt(z);
      if (!w) continue;
      dx += w.dx;
      if (w.up > 0) {
        p.vy = Math.max(-2.6, p.vy - w.up);
        p.onGround = false;
      }
    }
    if (this.gustT > 0) {
      this.gustT--;
      dx += this.gustDx;
    }
    if (dx !== 0) pushX(this.grid, p, p.onGround ? dx * 0.6 : dx);
  }

  shake(frames: number, strength = 2): void {
    this.shakeT = Math.max(this.shakeT, frames);
    this.shakeS = strength;
  }

  // --- Update -------------------------------------------------------------------------------

  private controls(): PlayerControls {
    const i = this.game.input;
    return {
      left: i.held(Act.Left),
      right: i.held(Act.Right),
      up: i.held(Act.Up),
      down: i.held(Act.Down),
      jumpHeld: i.held(Act.Jump),
      jumpPressed: i.pressed(Act.Jump),
      swordPressed: i.pressed(Act.Sword),
    };
  }

  update(): void {
    this.frame++;
    const g = this.game;
    const s = this.s;
    const p = this.player;
    if (this.nameT > 0) this.nameT--;
    if (this.flashT > 0) this.flashT--;
    if (this.lockMsgT > 0) this.lockMsgT--;
    if (this.shakeT > 0) this.shakeT--;

    // --- Death ---
    if (p.state === 'dead') {
      p.update(this.controls(), this.grid);
      if (++this.deadT === 100) g.pushOverlay(new GameOverOverlay(g, this.area.temple ?? null));
      this.particles.update();
      return;
    }

    // --- Dance floor ---
    if (this.area.beat && this.beatCells.length) {
      const period = this.area.beat.period;
      const bi = beatIndex(this.frame, period);
      if (bi !== this.lastBeat) {
        this.lastBeat = bi;
        for (const c of this.beatCells) {
          this.grid.kinds[c.i] = squareActive(c.group, this.frame, period) ? Kind.OneWay : Kind.Empty;
        }
        if (this.frame > 1) this.sfx('step');
      }
    }

    // --- Spells ---
    this.tickSpells();
    if (this.lurCooldown > 0) this.lurCooldown--;
    if (g.input.pressed(Act.Magic)) {
      if (g.input.held(Act.Down) && hasItem(s, 'naverlur')) this.blowLur();
      else this.castSpell();
    }
    this.updateHelpers();

    // --- Player ---
    const c = this.controls();
    p.highJump = this.spell.hopp > 0;
    const wasGround = p.onGround;
    // Platforms move first and carry whoever stands on them.
    const rider = this.riding;
    for (const pl of this.platforms) pl.update(pl === rider && p.onGround);
    if (rider && p.onGround) {
      const ox = p.x;
      p.x += rider.dx;
      if (rectHitsSolid(this.grid, p)) p.x = ox;
      p.y += rider.dy;
    }
    this.riding = null;
    const safeX = p.safeX;
    const safeY = p.safeY;
    p.update(c, this.grid);
    // Respawn points must be firm ground: not the very edge of a ledge, not a
    // dance square that comes and goes, not the floor of a nettle or spike pit.
    if (
      p.onGround &&
      ((this.beatCells.length && this.onBeatSquare()) || touchesKind(this.grid, p, Kind.Hazard) || !firmlySupported(this.grid, p))
    ) {
      p.safeX = safeX;
      p.safeY = safeY;
    }
    this.applyWind();
    if (p.jumped) this.sfx('jump');
    if (p.landed && !wasGround) {
      this.sfx('land');
      this.particles.spawn({ x: p.x + 2, y: p.y + p.h - 1, vx: -0.4, vy: -0.2, life: 12, color: PALETTE.w });
      this.particles.spawn({ x: p.x + p.w - 2, y: p.y + p.h - 1, vx: 0.4, vy: -0.2, life: 12, color: PALETTE.w });
    }
    if (c.swordPressed && p.state === 'attack') {
      this.sfx('sword');
      if (this.spell.eld > 0 && !p.lowAttack) this.shootFire();
    }

    if (this.hazardGrace > 0) this.hazardGrace--;
    // Hazards and falling out of the world.
    if (touchesKind(this.grid, p, Kind.Hazard) || p.y > this.grid.h * TILE + 8) {
      const water = touchesKind(this.grid, p, Kind.Hazard) && this.isWaterAt(p);
      this.sfx(water ? 'water' : 'hurt');
      if (water) this.puff(p.x + p.w / 2, p.y + p.h, 'mist');
      // Only one hurt per fall: a held stick can't send Dagny straight back in.
      if (this.hazardGrace === 0) this.damagePlayer(2, p.x + p.w / 2 - p.facing, true);
      this.hazardGrace = 50;
      if (this.s.hp > 0) {
        p.state = 'normal';
        p.place(p.safeX, p.safeY);
      }
    }

    // Locked doors: push against them with a key.
    this.tryDoors();

    // --- Exits ---
    if (!this.exiting) {
      if (p.x + p.w < 2 && this.area.left) this.leave(this.area.left);
      else if (p.x > this.grid.w * TILE - 2 && this.area.right) this.leave(this.area.right);
    }

    // --- Interact (Up or a tap on the NPC/door) ---
    this.updateInteract();

    // --- Enemies ---
    for (const e of this.enemies) e.update(this);
    this.combat();
    this.enemies = this.enemies.filter((e) => !e.dead || e === this.boss);

    // --- Projectiles ---
    const solidAt = (x: number, y: number): boolean => isSolidAt(this.grid, x, y);
    for (const pr of this.projectiles) {
      pr.update(this.grid, solidAt);
      if (pr.dead || pr.delay > 0) continue;
      if (pr.fromPlayer) {
        for (const e of this.enemies) {
          if (e.dead || !overlaps(pr.box, e.box(tmpA))) continue;
          const r = e.takeHit(pr.damage, pr.x, 'magic', this);
          if (r !== 'none') {
            pr.dead = true;
            if (r === 'dead') this.killEnemy(e);
          }
        }
      } else if (overlaps(pr.box, p)) {
        if (pr.sprite !== 'bolt' && pr.sprite !== 'boulder' && this.shieldBlocks(pr)) {
          pr.dead = true;
          this.sparks(pr.x + pr.w / 2, pr.y + pr.h / 2);
          this.sfx('block');
          g.vibrate(15);
        } else if (p.invuln === 0) {
          pr.dead = true;
          this.damagePlayer(pr.damage, pr.x + pr.w / 2);
        }
      }
    }
    this.projectiles = this.projectiles.filter((pr) => !pr.dead);

    // --- Pickups ---
    for (const pk of this.pickups) {
      pk.update(this.grid);
      if (!pk.taken && overlaps(pk.box, p)) this.collect(pk);
    }
    this.pickups = this.pickups.filter((pk) => !pk.taken && pk.life > 0);

    // --- Checkpoints ---
    for (const cp of this.checkpoints) {
      if (cp.lit) continue;
      tmpA.x = cp.tx * TILE;
      tmpA.y = cp.ty * TILE;
      tmpA.w = TILE;
      tmpA.h = TILE;
      if (overlaps(tmpA, p)) {
        cp.lit = true;
        if (!s.opened.includes(cp.pid)) s.opened.push(cp.pid);
        s.checkpoint = { area: this.area.id, x: cp.tx * TILE + 3, y: (cp.ty + 1) * TILE - STAND_H };
        this.sfx('checkpoint');
        g.toast(STR.checkpoint);
        this.game.save();
      }
    }

    // --- Boss ---
    this.updateBoss();

    for (const n of this.npcs) n.update(p.x + p.w / 2);
    this.particles.update();
    this.updateAmbience();
    this.updateCamera();

    if (canLevelUp(s.xp, s.levels) && !g.modal && !this.levelUpShown && this.bossOutro === 0 && !g.transitioning) {
      this.levelUpShown = true;
      g.audio.play('levelup');
      g.pushOverlay(new LevelUpOverlay(g, () => this.applySkills()));
    }
    if (!canLevelUp(s.xp, s.levels)) this.levelUpShown = false;
  }

  private levelUpShown = false;

  private onBeatSquare(): boolean {
    const p = this.player;
    const ty = Math.floor((p.y + p.h + 1) / TILE);
    for (let tx = Math.floor(p.x / TILE); tx <= Math.floor((p.x + p.w - 1) / TILE); tx++) {
      const ch = this.area.tiles[ty]?.[tx];
      if (ch === '%' || ch === '&') return true;
    }
    return false;
  }

  private landOnPlatform(p: Player, prevBottom: number): boolean {
    const bottom = p.y + p.h;
    for (const pl of this.platforms) {
      if (p.x + p.w <= pl.x + 1 || p.x >= pl.x + pl.w - 1) continue;
      if (prevBottom <= pl.y + 3 && bottom >= pl.y) {
        p.y = pl.y - p.h;
        this.riding = pl;
        return true;
      }
    }
    return false;
  }

  private isWaterAt(r: Rect): boolean {
    const tx = Math.floor((r.x + r.w / 2) / TILE);
    const ty = Math.floor((r.y + r.h - 1) / TILE);
    return this.area.tiles[ty]?.[tx] === '~';
  }

  private shieldBlocks(pr: Projectile): boolean {
    const p = this.player;
    if (p.attacking || p.state === 'hurt' || p.state === 'bird' || p.downThrust) return false;
    // Must come from the front...
    const fromRight = pr.x + pr.w / 2 > p.x + p.w / 2;
    if ((fromRight ? 1 : -1) !== p.facing) return false;
    // ...at the height the shield guards.
    const cy = pr.y + pr.h / 2;
    const mid = p.y + p.h / 2;
    const height = cy < mid ? 'high' : 'low';
    if (p.ducking) return true; // ducking covers the whole (lower) body
    return height === p.shieldHeight || cy < p.y + p.h - 4;
  }

  private damagePlayer(base: number, fromX: number, ignoreInvuln = false): void {
    const p = this.player;
    if (!ignoreInvuln && p.invuln > 0) return;
    const s = this.s;
    const dmg = damageTaken(base, this.game.settings.calm, this.spell.skydd > 0);
    s.hp = Math.max(0, s.hp - dmg);
    this.sfx('hurt');
    this.game.vibrate(45);
    this.shake(8, 2);
    if (p.state === 'bird') p.leaveBird(this.grid);
    p.hurt(fromX);
    if (s.hp <= 0) {
      p.state = 'dead';
      p.invuln = 0;
      this.deadT = 0;
      this.game.audio.playMusic('somnar');
    }
  }

  private combat(): void {
    const p = this.player;
    const sword = p.swordActive ? p.swordBox(tmpB) : null;
    const dmg = swordDamage(this.s.levels.styrka);
    for (const e of this.enemies) {
      if (e.dead) continue;
      const eb = e.box(tmpA);
      if (sword && !p.hitIds.has(e.id) && overlaps(sword, eb)) {
        p.hitIds.add(e.id);
        const height: HitHeight = p.downThrust ? 'down' : p.upThrust ? 'up' : p.lowAttack ? 'low' : 'high';
        const r = e.takeHit(dmg, p.x + p.w / 2, height, this);
        if (r === 'blocked') {
          this.game.vibrate(10);
          p.vx = -p.facing * 1.2;
        } else if (r === 'hit' || r === 'dead') {
          this.game.vibrate(20);
          this.sparks(sword.x + sword.w / 2, sword.y + sword.h / 2);
          if (r === 'dead') this.killEnemy(e);
        }
        if (p.downThrust && r !== 'none') p.bounce();
        continue;
      }
      if (e.harmful && overlaps(eb, p) && p.invuln === 0) {
        this.damagePlayer(e.damage, e.x + e.w / 2);
      }
    }
  }

  private killEnemy(e: Enemy): void {
    const s = this.s;
    this.sfx('puff');
    this.puff(e.x + e.w / 2, e.y + e.h / 2, e.def.puff);
    s.xp += e.def.xp;
    this.particles.spawn({ x: e.x + e.w / 2 - 6, y: e.y - 4, vy: -0.5, life: 50, text: `+${e.def.xp}`, color: PALETTE.Y });
    if (e === this.boss) {
      this.bossOutro = 1;
      this.shake(40, 3);
      // Whatever the guardian called up goes with it.
      for (const m of this.enemies) {
        if (m.dead || m === e) continue;
        m.dead = true;
        this.puff(m.x + m.w / 2, m.y + m.h / 2, m.def.puff);
      }
      this.projectiles = this.projectiles.filter((pr) => pr.fromPlayer);
      return;
    }
    const d = e.def.drops ?? {};
    const r = Math.random();
    let kind: 'bulle' | 'termos' | 'lingon' | null = null;
    if (r < (d.termos ?? 0)) kind = 'termos';
    else if (r < (d.termos ?? 0) + (d.lingon ?? 0)) kind = 'lingon';
    else if (r < (d.termos ?? 0) + (d.lingon ?? 0) + (d.bulle ?? 0)) kind = 'bulle';
    if (kind) {
      const sz = spriteSize(kind);
      this.pickups.push(new Pickup(kind, e.x + e.w / 2 - sz.w / 2, e.y + e.h / 2 - sz.h, kind, true));
    }
    if (e.def.befriend && !hasFlag(s, `van_${e.def.id}`)) {
      setFlag(s, `van_${e.def.id}`);
      this.game.toast(e.def.befriend, 3.5);
    }
  }

  private collect(pk: Pickup): void {
    const s = this.s;
    const g = this.game;
    pk.taken = true;
    switch (pk.kind) {
      case 'bulle':
        s.xp += 10;
        this.sfx('xp');
        this.particles.spawn({ x: pk.x - 4, y: pk.y - 6, vy: -0.5, life: 45, text: '+10', color: PALETTE.Y });
        break;
      case 'termos':
        s.mp = Math.min(maxMp(s.levels.magi), s.mp + 4);
        this.sfx('pickup');
        break;
      case 'lingon':
        s.hp = Math.min(maxHp(s.levels.liv), s.hp + 4);
        this.sfx('pickup');
        break;
      case 'key': {
        const t = this.area.temple ?? 'none';
        s.keys[t] = (s.keys[t] ?? 0) + 1;
        if (pk.pid && !s.opened.includes(pk.pid)) s.opened.push(pk.pid);
        this.sfx('key');
        g.toast(STR.gotKey);
        g.save();
        break;
      }
      case 'cat':
        if (!s.items.includes('murre')) s.items.push('murre');
        this.sfx('pickup');
        g.pushOverlay(new DialogOverlay(g, 'murre_hittad'));
        g.save();
        break;
      case 'quest': {
        const id = pk.pid ?? '';
        if (id && !s.items.includes(id)) s.items.push(id);
        this.sfx('key');
        g.pushOverlay(new DialogOverlay(g, `hittade_${id}`));
        g.save();
        break;
      }
      case 'treasure': {
        const id = pk.pid ?? '';
        if (id && !s.items.includes(id)) s.items.push(id);
        this.game.audio.playMusic('seger');
        g.pushOverlay(
          new DialogOverlay(g, `fick_${id}`, () => {
            // The temple is restored: a piece of summer light returns.
            this.flashT = 40;
            g.save();
          }),
        );
        break;
      }
    }
  }

  private tryDoors(): void {
    const p = this.player;
    if (p.state !== 'normal' || !p.onGround) return;
    const probeX = p.facing === 1 ? p.x + p.w + 1 : p.x - 1;
    const tx = Math.floor(probeX / TILE);
    const ty = Math.floor((p.y + p.h / 2) / TILE);
    if (this.area.tiles[ty]?.[tx] !== 'L' || this.grid.kinds[ty * this.grid.w + tx] !== Kind.Solid) return;
    const pushing = this.game.input.held(p.facing === 1 ? Act.Right : Act.Left);
    if (!pushing) return;
    const s = this.s;
    const t = this.area.temple ?? 'none';
    if ((s.keys[t] ?? 0) > 0) {
      s.keys[t]--;
      // Open the whole door column.
      for (let y = 0; y < this.grid.h; y++) {
        if (this.area.tiles[y][tx] === 'L') {
          this.grid.kinds[y * this.grid.w + tx] = Kind.Empty;
          s.opened.push(this.pid(tx, y));
          this.tileSprite[y * this.grid.w + tx] = null;
          this.puff(tx * TILE + 8, y * TILE + 8, 'mist');
        }
      }
      this.staticLayer = this.renderStatic();
      this.sfx('unlock');
      this.game.save();
    } else if (this.lockMsgT === 0) {
      this.lockMsgT = 120;
      this.game.toast(DialogOverlay.get('nyckel_saknas').pages[0]);
    }
  }

  private updateInteract(): void {
    const p = this.player;
    const g = this.game;
    this.prompt = null;
    if (p.state !== 'normal' || !p.onGround) return;
    const pc = p.x + p.w / 2;
    const up = g.input.pressed(Act.Up);
    const taps = g.input.taps;
    const tapped = (r: Rect): boolean =>
      taps.some((t) => t.x + this.camX >= r.x - 6 && t.x + this.camX <= r.x + r.w + 6 && t.y + this.camY >= r.y - 6 && t.y + this.camY <= r.y + r.h + 6);

    // NPCs
    let best: Npc | null = null;
    let bestD = 26;
    for (const n of this.npcs) {
      const d = Math.abs(n.x + n.box.w / 2 - pc);
      if (d < bestD && Math.abs(n.y + n.box.h - (p.y + p.h)) < 12) {
        best = n;
        bestD = d;
      }
    }
    if (best) {
      const b = best.box;
      this.prompt = { x: b.x + b.w / 2, y: b.y - 6 };
      if (up || tapped(b)) {
        const talk = best.def.talk.find((t) => g.check(t.if));
        if (talk) {
          p.facing = b.x + b.w / 2 < pc ? -1 : 1;
          g.pushOverlay(new DialogOverlay(g, talk.dialog, () => this.afterDialog()));
        }
      }
      return;
    }
    // Doors and signs
    for (const d of this.doors) {
      const r = { x: d.tx * TILE - 4, y: d.ty * TILE - 16, w: TILE + 8, h: 32 };
      if (!overlaps(r, p)) continue;
      this.prompt = { x: d.tx * TILE + 8, y: d.ty * TILE - 20 };
      if (up || tapped(r)) {
        const req = d.exit.requires;
        if (req && ((req.flag && !hasFlag(this.s, req.flag)) || (req.item && !hasItem(this.s, req.item)))) {
          g.pushOverlay(new DialogOverlay(g, req.dialog));
        } else {
          this.sfx('door');
          this.leave(d.exit);
        }
      }
      return;
    }
    for (const sgn of this.signs) {
      const r = { x: sgn.tx * TILE - 4, y: sgn.ty * TILE - 16, w: TILE + 8, h: 32 };
      if (!overlaps(r, p)) continue;
      this.prompt = { x: sgn.tx * TILE + 8, y: sgn.ty * TILE - 14 };
      if (up || tapped(r)) g.pushOverlay(new DialogOverlay(g, sgn.dialog));
      return;
    }
  }

  /** NPC talk may have changed flags (e.g. the cat went home). */
  private afterDialog(): void {
    const s = this.s;
    this.applySkills();
    // Spawn Murre when he is home.
    if (hasFlag(s, 'murre_hemma') && !this.npcs.some((n) => n.def.id === 'murre')) {
      const a = this.area;
      for (let ty = 0; ty < this.grid.h; ty++) {
        const tx = a.tiles[ty].indexOf('7');
        if (tx >= 0 && a.npcs?.['7'] === 'murre') this.npcs.push(new Npc(NPCS.murre, tx * TILE + 8, (ty + 1) * TILE));
      }
    }
    if (hasFlag(s, 'hulda_efter_krypta') && !hasFlag(s, 'slice_end_seen')) {
      setFlag(s, 'slice_end_seen');
      this.game.save();
      flow.showSliceEnd(this.game);
    }
  }

  private leave(exit: Exit): void {
    if (this.exiting) return;
    this.exiting = true;
    const g = this.game;
    if (exit.to === 'overworld') {
      if (exit.ow) this.s.ow = { ...exit.ow };
      flow.goToOverworld(g);
    } else {
      flow.goToArea(g, exit.to, { entry: exit.entry, dialog: exit.dialog });
    }
  }

  private updateBoss(): void {
    const b = this.boss;
    if (!b) return;
    const g = this.game;
    if (!b.awake && !b.dead && this.player.x > 5 * TILE) {
      b.awake = true;
      this.grid.wallLeft = true;
      // Block the passage back while the fight lasts.
      for (let y = 0; y < this.grid.h; y++) if (this.grid.kinds[y * this.grid.w] === Kind.Empty) this.grid.kinds[y * this.grid.w] = Kind.Solid;
      this.sfx('roar');
      this.shake(20, 2);
      g.pushOverlay(new DialogOverlay(g, b.boss?.introDialog ?? 'boss_vaknar', () => g.audio.playMusic(this.music())));
    }
    if (this.bossOutro > 0) {
      this.bossOutro++;
      if (this.bossOutro % 8 === 0 && this.bossOutro < 70) {
        this.puff(b.x + Math.random() * b.w, b.y + Math.random() * b.h, 'mist');
        this.sfx('puff');
      }
      if (this.bossOutro === 90) {
        const temple = this.area.temple ?? '';
        setFlag(this.s, `${temple}_boss`);
        // Re-open the way back.
        for (let y = 0; y < this.grid.h; y++) {
          if (this.area.tiles[y][0] !== '#') this.grid.kinds[y * this.grid.w] = Kind.Empty;
        }
        g.audio.playMusic(this.area.music);
        const dlg = (b.boss?.defeatDialog) ?? 'boss_forlikad';
        g.pushOverlay(new DialogOverlay(g, dlg, () => {
          this.spawnTreasure();
          this.spawnAfterBoss();
          g.save();
        }));
        this.boss = null;
        this.bossOutro = 0;
      }
    }
  }

  // --- Spells -----------------------------------------------------------------------------------

  private tickSpells(): void {
    const sp = this.spell;
    for (const k of Object.keys(sp) as Array<keyof SpellTimers>) if (sp[k] > 0) sp[k]--;
    const p = this.player;
    if (p.state === 'bird' && sp.hamn <= 0) {
      if (!p.leaveBird(this.grid)) sp.hamn = 1; // no room yet – stay a bird a little longer
    }
  }

  private castSpell(): void {
    const s = this.s;
    const g = this.game;
    const id: SpellId | null = s.selectedSpell;
    if (!id) {
      g.toast(STR.noSpells, 2.5);
      return;
    }
    const def = SPELLS[id];
    const cost = def.cost[s.levels.magi - 1] ?? def.cost[0];
    if (s.mp < cost) {
      this.sfx('cancel');
      g.toast(STR.notEnoughMp);
      return;
    }
    const p = this.player;
    if (p.state === 'dead' || p.state === 'hurt') return;
    s.mp -= cost;
    this.sfx('magic');
    this.flashT = 8;
    const frames = def.duration * 60;
    const pc = this.playerCenter();
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2;
      this.particles.spawn({ x: pc.x, y: pc.y, vx: Math.cos(a) * 1.4, vy: Math.sin(a) * 1.4, life: 24, color: PALETTE.Y });
    }
    switch (id) {
      case 'lakning':
        s.hp = Math.min(maxHp(s.levels.liv), s.hp + 8);
        this.sfx('heal');
        break;
      case 'skydd':
        this.spell.skydd = frames;
        break;
      case 'hopp':
        this.spell.hopp = frames;
        break;
      case 'lyse':
        this.spell.lyse = frames;
        break;
      case 'eld':
        this.spell.eld = frames;
        break;
      case 'hamn':
        this.spell.hamn = frames;
        if (p.state !== 'bird') p.enterBird();
        break;
      case 'aska': {
        this.sfx('thunder');
        this.flashT = 30;
        this.shake(30, 3);
        for (const e of this.enemies) {
          if (e.dead) continue;
          const onScreen = e.x + e.w > this.camX && e.x < this.camX + VIEW_W && e.y + e.h > this.camY && e.y < this.camY + VIEW_H;
          if (!onScreen) continue;
          const r = e.takeHit(8 + s.levels.magi * 2, e.x, 'magic', this);
          if (r === 'dead') this.killEnemy(e);
        }
        break;
      }
    }
  }

  /** Näverluren calls a befriended vätte to help for a while. */
  private blowLur(): void {
    const g = this.game;
    if (this.lurCooldown > 0) {
      g.toast(DialogOverlay.get('lur_vila').pages[0]);
      return;
    }
    this.lurCooldown = 30 * 60;
    this.sfx('horn');
    const p = this.player;
    this.helpers.push({ x: p.x - p.facing * 20, y: p.y + p.h - 12, vx: 0, vy: -2, onGround: false, w: 10, h: 12, life: 12 * 60, cd: 0, facing: p.facing });
    this.puff(p.x - p.facing * 16, p.y + p.h - 6, 'moss');
    g.toast(DialogOverlay.get('lur_blast').pages[0], 2.5);
  }

  private updateHelpers(): void {
    for (const h of this.helpers) {
      h.life--;
      if (h.cd > 0) h.cd--;
      // Run to the nearest väsen and strike it.
      let target: Enemy | null = null;
      let best = 1e9;
      for (const e of this.enemies) {
        if (e.dead || e.untouchable || (e.boss && !e.awake)) continue;
        const d = Math.abs(e.x + e.w / 2 - (h.x + h.w / 2));
        if (d < best) { best = d; target = e; }
      }
      const goal = target ? target.x + target.w / 2 : this.player.x - this.player.facing * 18;
      const dx = goal - (h.x + h.w / 2);
      h.facing = dx >= 0 ? 1 : -1;
      h.vx = Math.abs(dx) > 6 ? h.facing * 1.4 : 0;
      h.vy = Math.min(5, h.vy + 0.35);
      moveBody(this.grid, h);
      if (target && h.cd === 0 && overlaps(h, target.box(tmpA))) {
        h.cd = 40;
        const r = target.takeHit(2, h.x + h.w / 2, 'magic', this);
        if (r === 'dead') this.killEnemy(target);
        if (r !== 'none') this.sparks(h.x + h.w / 2, h.y + 4);
      }
      if (h.life === 0) this.puff(h.x + h.w / 2, h.y + h.h / 2, 'moss');
    }
    this.helpers = this.helpers.filter((h) => h.life > 0);
  }

  private shootFire(): void {
    const p = this.player;
    this.sfx('fire');
    this.spawnProjectile({
      x: p.facing === 1 ? p.x + p.w + 4 : p.x - 12,
      y: p.y + 6,
      vx: p.facing * 3,
      vy: 0,
      w: 8,
      h: 8,
      sprite: 'fireball',
      damage: swordDamage(this.s.levels.styrka),
      fromPlayer: true,
      life: 70,
    });
  }

  // --- Camera & ambience ----------------------------------------------------------------------

  private snapCamera(): void {
    const t = this.cameraTarget();
    this.camX = t.x;
    this.camY = t.y;
  }

  private cameraTarget(): { x: number; y: number } {
    const p = this.player;
    const mapW = this.grid.w * TILE;
    const mapH = this.grid.h * TILE;
    let x = p.x + p.w / 2 - VIEW_W / 2 + p.facing * 18;
    let y = p.y + p.h - VIEW_H * 0.62;
    x = mapW <= VIEW_W ? (mapW - VIEW_W) / 2 : Math.max(0, Math.min(mapW - VIEW_W, x));
    y = mapH <= VIEW_H ? (mapH - VIEW_H) : Math.max(0, Math.min(mapH - VIEW_H, y));
    return { x, y };
  }

  private updateCamera(): void {
    const t = this.cameraTarget();
    this.camX += (t.x - this.camX) * 0.12;
    this.camY += (t.y - this.camY) * 0.1;
  }

  private updateAmbience(): void {
    const amb = this.area.ambience ?? [];
    const a = this.ambient;
    a.update();
    if (a.list.length > (amb.includes('rain') ? 110 : 40)) return;
    const f = this.frame;
    const cx = this.camX;
    const cy = this.camY;
    for (const kind of amb) {
      if (kind === 'rain') {
        for (let i = 0; i < 2; i++) {
          a.spawn({ x: cx + Math.random() * (VIEW_W + 60), y: cy - 8, vx: -1.2, vy: 4.5, life: 50, color: 'rgba(169,198,207,0.55)', size: 1, frames: 4 });
        }
      } else if (kind === 'fireflies' && f % 25 === 0) {
        a.spawn({ x: cx + Math.random() * VIEW_W, y: cy + 60 + Math.random() * 90, vx: (Math.random() - 0.5) * 0.3, vy: -0.1, life: 160, color: PALETTE.Y, size: 1 });
      } else if (kind === 'mosquitoes' && f % 18 === 0) {
        const pc = this.playerCenter();
        a.spawn({ x: pc.x + (Math.random() - 0.5) * 120, y: pc.y - 10 - Math.random() * 30, vx: (Math.random() - 0.5) * 0.6, vy: (Math.random() - 0.5) * 0.4, life: 70, color: PALETTE.g, size: 1 });
      } else if (kind === 'dust' && f % 14 === 0) {
        a.spawn({ x: cx + Math.random() * VIEW_W, y: cy + Math.random() * VIEW_H, vx: 0.08, vy: 0.05, life: 200, color: 'rgba(243,230,200,0.5)', size: 1 });
      } else if (kind === 'leaves' && f % 40 === 0) {
        a.spawn({ x: cx + Math.random() * VIEW_W, y: cy - 4, vx: -0.3 + Math.random() * 0.2, vy: 0.4, life: 300, color: Math.random() < 0.5 ? PALETTE.o : PALETTE.y, size: 2 });
      } else if (kind === 'mist' && f % 30 === 0) {
        a.spawn({ x: cx - 40 + Math.random() * (VIEW_W + 40), y: cy + 120 + Math.random() * 40, vx: 0.15, vy: 0, life: 260, color: 'rgba(243,230,200,0.10)', size: 24 });
      }
    }
    // Wind: streaks in zones while a gust blows.
    for (const z of this.area.wind ?? []) {
      const w = this.windAt(z);
      if (!w || f % 3 !== 0) continue;
      const x = (z.x0 + Math.random() * (z.x1 - z.x0 + 1)) * TILE;
      const y = (z.y0 + Math.random() * (z.y1 - z.y0 + 1)) * TILE;
      if (x < cx - 20 || x > cx + VIEW_W + 20 || y < cy - 20 || y > cy + VIEW_H + 20) continue;
      if (w.up > 0) a.spawn({ x, y, vx: 0, vy: -2.5, life: 30, color: 'rgba(243,230,200,0.5)', size: 1, frames: 5 });
      else a.spawn({ x, y, vx: w.dx * 2.5, vy: 0, life: 30, color: 'rgba(243,230,200,0.5)', size: 1, frames: -8 });
    }
    if (amb.includes('spray') && f % 6 === 0) {
      a.spawn({ x: cx + Math.random() * VIEW_W, y: cy + VIEW_H - 10, vx: (Math.random() - 0.5) * 0.6, vy: -1.6 - Math.random(), gravity: 0.05, life: 50, color: 'rgba(243,230,200,0.7)', size: 1 });
    }
    // Chimney smoke.
    if (f % 9 === 0) {
      for (const pr of this.area.props ?? []) {
        if (!pr.smoke) continue;
        a.spawn({ x: pr.tx * TILE + 8 + Math.random() * 2, y: (pr.ty + 1) * TILE + 2, vx: 0.15 + Math.random() * 0.1, vy: -0.35, life: 110, color: 'rgba(201,187,165,0.55)', size: 3 });
      }
    }
  }

  // --- Render ------------------------------------------------------------------------------------

  render(ctx: CanvasRenderingContext2D): void {
    let camX = this.camX;
    let camY = this.camY;
    if (this.shakeT > 0) {
      camX += (Math.random() - 0.5) * this.shakeS * 2;
      camY += (Math.random() - 0.5) * this.shakeS * 2;
    }
    camX = Math.round(camX);
    camY = Math.round(camY);
    const f = this.frame;
    drawBackdrop(ctx, this.area.backdrop, this.area.tone, camX, camY);

    // Static tiles and decor.
    ctx.drawImage(this.staticLayer, camX, camY, VIEW_W, VIEW_H, 0, 0, VIEW_W, VIEW_H);
    this.renderGrass(ctx, camX, camY);

    // Animated tiles.
    for (const a of this.anim) {
      if (a.x + TILE < camX || a.x > camX + VIEW_W || a.y + TILE < camY || a.y > camY + VIEW_H) continue;
      drawSprite(ctx, a.sprite, Math.floor((f + a.offset * 7) / 20), a.x - camX, a.y - camY);
    }
    // Dance-floor squares.
    if (this.beatCells.length && this.area.beat) {
      const period = this.area.beat.period;
      const warn = stepsToSwap(this.frame, period) < 24;
      for (const c of this.beatCells) {
        const x = c.tx * TILE - camX;
        const y = c.ty * TILE - camY;
        if (x < -TILE || x > VIEW_W || y < -TILE || y > VIEW_H) continue;
        const on = squareActive(c.group, this.frame, period);
        const id = !on ? 'beatOff' : warn && Math.floor(f / 4) % 2 === 0 ? 'beatWarn' : 'beatOn';
        drawSprite(ctx, id, (c.tx + c.ty) % 2, x, y);
      }
    }
    // Checkpoint candles.
    for (const cp of this.checkpoints) {
      drawSprite(ctx, cp.lit ? 'candle' : 'candleOff', Math.floor((f + cp.tx * 5) / 18), cp.tx * TILE - camX, cp.ty * TILE - camY);
    }

    this.renderProps(ctx, camX, camY, false);
    for (const pl of this.platforms) pl.render(ctx, camX, camY);
    for (const pl of this.platforms) pl.renderHub(ctx, camX, camY);
    for (const pk of this.pickups) pk.render(ctx, camX, camY);
    for (const n of this.npcs) n.render(ctx, camX, camY);
    for (const e of this.enemies) e.render(ctx, camX, camY);
    this.renderPlayerAura(ctx, camX, camY);
    for (const h of this.helpers) {
      if (h.life > 90 || Math.floor(h.life / 4) % 2 === 0) drawSprite(ctx, 'vatte', Math.floor(f / 10) % 2, h.x - 3 - camX, h.y - 4 - camY, h.facing === -1);
    }
    this.player.render(ctx, camX, camY, f);
    for (const pr of this.projectiles) pr.render(ctx, camX, camY);
    this.renderParticles(ctx, this.particles, camX, camY);
    this.renderProps(ctx, camX, camY, true);
    if (this.frontLayer) {
      ctx.globalAlpha = 0.9;
      ctx.drawImage(this.frontLayer, camX, camY, VIEW_W, VIEW_H, 0, 0, VIEW_W, VIEW_H);
      ctx.globalAlpha = 1;
    }

    if (this.dark) this.renderDarkness(ctx, camX, camY);
    this.renderParticles(ctx, this.ambient, camX, camY);

    const outdoor = this.area.backdrop === 'outdoor' || this.area.backdrop === 'forest';
    this.game.applyTone(ctx, this.area.tone, outdoor);

    if (this.flashT > 0) {
      ctx.globalAlpha = Math.min(0.7, this.flashT / 30);
      ctx.fillStyle = PALETTE.W;
      ctx.fillRect(0, 0, VIEW_W, VIEW_H);
      ctx.globalAlpha = 1;
    }

    if (this.prompt && !this.game.modal) {
      const bob = Math.round(Math.sin(f / 8) * 1.5);
      drawText(ctx, '▲', this.prompt.x - camX - 2, this.prompt.y - camY - 8 + bob, 'Y', { outline: 'k' });
    }

    if (!this.game.hudHidden && this.game.state) {
      drawHud(ctx, this.game.state, { keys: this.area.temple ? this.s.keys[this.area.temple] ?? 0 : undefined, frame: f });
      this.renderSpellIcons(ctx);
    }
    this.renderBossBar(ctx);
    if (this.nameT > 0) this.renderName(ctx);
  }

  private renderGrass(ctx: CanvasRenderingContext2D, camX: number, camY: number): void {
    if (this.area.theme !== 'meadow') return;
    const { w } = this.grid;
    const x0 = Math.max(0, Math.floor(camX / TILE));
    const x1 = Math.min(w - 1, Math.floor((camX + VIEW_W) / TILE));
    ctx.fillStyle = PALETTE.l;
    for (let ty = 0; ty < this.grid.h; ty++) {
      for (let tx = x0; tx <= x1; tx++) {
        if (this.tileSprite[ty * w + tx] !== 'grass') continue;
        const by = ty * TILE - camY;
        for (let k = 0; k < 3; k++) {
          const gx = tx * TILE + 3 + k * 5 - camX;
          const sway = Math.round(Math.sin(this.frame / 25 + tx + k) * 1);
          ctx.fillRect(gx + sway, by - 2, 1, 2);
          ctx.fillRect(gx, by - 1, 1, 1);
        }
      }
    }
  }

  private renderProps(ctx: CanvasRenderingContext2D, camX: number, camY: number, front: boolean): void {
    for (const pr of this.area.props ?? []) {
      if (!pr.sprite || !!pr.front !== front) continue;
      const sz = spriteSize(pr.sprite);
      const x = pr.tx * TILE + (pr.dx ?? 0);
      const y = (pr.ty + 1) * TILE - sz.h + (pr.dy ?? 0);
      if (x + sz.w < camX || x > camX + VIEW_W) continue;
      const frame = pr.anim ? Math.floor(this.frame / (pr.anim * 60)) : 0;
      drawSprite(ctx, pr.sprite, frame, x - camX, y - camY);
    }
  }

  private renderParticles(ctx: CanvasRenderingContext2D, ps: Particles, camX: number, camY: number): void {
    for (const p of ps.list) {
      const x = Math.round(p.x - camX);
      const y = Math.round(p.y - camY);
      if (p.sprite) {
        const fr = Math.min(p.frames - 1, Math.floor((1 - p.life / p.max) * p.frames));
        drawSprite(ctx, p.sprite, fr, x, y);
      } else if (p.text) {
        drawText(ctx, p.text, x, y, 'Y', { outline: 'k' });
      } else {
        const a = Math.min(1, p.life / 20);
        ctx.globalAlpha = a;
        ctx.fillStyle = p.color;
        // Fireflies blink.
        if (p.color === PALETTE.Y && p.size === 1 && Math.floor((p.life + p.x) / 20) % 3 === 0) {
          ctx.globalAlpha = 1;
          continue;
        }
        if (p.frames < 0) ctx.fillRect(x, y, -p.frames, 1);
        else if (p.frames > 1) ctx.fillRect(x, y, 1, p.frames);
        else ctx.fillRect(x, y, p.size, p.size > 4 ? Math.max(2, p.size / 4) : p.size);
        ctx.globalAlpha = 1;
      }
    }
  }

  private renderPlayerAura(ctx: CanvasRenderingContext2D, camX: number, camY: number): void {
    const p = this.player;
    if (this.spell.skydd > 0) {
      const t = this.frame;
      ctx.fillStyle = PALETTE.c;
      ctx.globalAlpha = 0.5 + Math.sin(t / 6) * 0.2;
      ring(ctx, p.x + p.w / 2 - camX, p.y + p.h / 2 - camY, 15);
      ctx.globalAlpha = 1;
    }
    if (this.spell.eld > 0 && this.frame % 6 === 0) {
      this.particles.spawn({ x: p.x + (p.facing === 1 ? p.w + 6 : -6), y: p.y + 8, vy: -0.4, life: 14, color: PALETTE.o });
    }
  }

  private renderDarkness(ctx: CanvasRenderingContext2D, camX: number, camY: number): void {
    const d = this.dark as HTMLCanvasElement;
    const dc = d.getContext('2d') as CanvasRenderingContext2D;
    dc.globalCompositeOperation = 'source-over';
    dc.clearRect(0, 0, VIEW_W, VIEW_H);
    dc.fillStyle = `rgba(22,16,30,${this.area.darkness ?? 0.93})`;
    dc.fillRect(0, 0, VIEW_W, VIEW_H);
    dc.globalCompositeOperation = 'destination-out';
    const light = (x: number, y: number, r: number): void => {
      const g = dc.createRadialGradient(x, y, r * 0.2, x, y, r);
      g.addColorStop(0, 'rgba(0,0,0,1)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      dc.fillStyle = g;
      dc.fillRect(x - r, y - r, r * 2, r * 2);
    };
    const pc = this.playerCenter();
    const flicker = Math.sin(this.frame / 7) * 2;
    const base = hasItem(this.s, 'karbidlampa') ? 92 : 46;
    light(pc.x - camX, pc.y - camY, this.spell.lyse > 0 ? 150 : base + flicker);
    // The signal flashlight throws a beam ahead of Dagny.
    if (hasItem(this.s, 'ficklampa')) light(pc.x + this.player.facing * 70 - camX, pc.y - camY, 46);
    for (const pr of this.projectiles) if (pr.sprite === 'bolt' && pr.delay === 0) light(pr.x + 4 - camX, pr.y + pr.h - 10 - camY, 70);
    for (const cp of this.checkpoints) if (cp.lit) light(cp.tx * TILE + 8 - camX, cp.ty * TILE + 4 - camY, 40 + flicker);
    for (const a of this.anim) {
      if (a.x + TILE + 80 < camX || a.x - 80 > camX + VIEW_W || a.y + TILE + 80 < camY || a.y - 80 > camY + VIEW_H) continue;
      if (a.sprite === 'bulbs') light(a.x + 8 - camX, a.y + 5 - camY, 36);
      else if (a.sprite === 'candle') light(a.x + 8 - camX, a.y + 4 - camY, 34 + flicker);
      else if (a.sprite === 'lantern') light(a.x + 8 - camX, a.y + 6 - camY, 44 + flicker);
      else if (a.sprite === 'crystal') light(a.x + 8 - camX, a.y + 7 - camY, 40 + flicker);
      else if (a.sprite === 'lens') light(a.x + 8 - camX, a.y + 8 - camY, 64 + flicker * 2);
    }
    for (const e of this.enemies) {
      if (e.dead) continue;
      if (e.def.id === 'lyktgubbe') light(e.x + e.w / 2 - camX, e.y + e.h / 2 - camY, 26);
      // Gruvrået carries her own carbide lantern.
      else if (e.def.behavior === 'boss_bergakung' && e.phase === 1) light(e.x + e.w / 2 - camX, e.y + 8 - camY, 50);
      else if (e.def.behavior === 'boss_spelman') light(e.x + e.w / 2 - camX, e.y + 10 - camY, 60);
      else if (e.def.behavior === 'boss_gruvra' && e.alpha > 0.05) light(e.x + e.w / 2 - camX, e.y + 6 - camY, 56 * e.alpha);
    }
    // Lit dance-floor squares glow.
    if (this.area.beat) {
      const period = this.area.beat.period;
      for (const c of this.beatCells) {
        if ((c.tx & 1) === 0 || !squareActive(c.group, this.frame, period)) continue;
        const x = c.tx * TILE - camX;
        if (x < -30 || x > VIEW_W + 30) continue;
        light(x, c.ty * TILE + 2 - camY, 22);
      }
    }
    for (const pr of this.area.props ?? []) if (pr.sprite === 'irrbloss') light(pr.tx * TILE + 4 + (pr.dx ?? 0) - camX, (pr.ty + 1) * TILE - 4 + (pr.dy ?? 0) - camY, 34 + flicker);
    for (const pr of this.projectiles) if (pr.sprite === 'noteShot') light(pr.x + 4 - camX, pr.y + 4 - camY, 12);
    for (const n of this.npcs) if (n.def.id === 'dagmar') light(n.x + 8 - camX, n.y + 10 - camY, 60 + flicker);
    for (const pr of this.projectiles) if (pr.sprite === 'stone') light(pr.x + 4 - camX, pr.y + 4 - camY, 12);
    for (const pr of this.projectiles) if (pr.sprite === 'fireball') light(pr.x + 4 - camX, pr.y + 4 - camY, 24);
    dc.globalCompositeOperation = 'source-over';
    ctx.drawImage(d, 0, 0);
    // Warm glow on top of the lights.
    ctx.globalCompositeOperation = 'soft-light';
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = PALETTE.o;
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  private renderSpellIcons(ctx: CanvasRenderingContext2D): void {
    let x = 14;
    const y = 33;
    for (const [k, t] of Object.entries(this.spell)) {
      if (t <= 0) continue;
      const name = SPELLS[k as SpellId].name;
      const secs = Math.ceil(t / 60);
      const txt = `${name} ${secs}`;
      if (t > 120 || Math.floor(t / 8) % 2 === 0) drawText(ctx, txt, x, y, 'c', { shadow: 'k' });
      x += measure(txt) + 6;
    }
  }

  private renderBossBar(ctx: CanvasRenderingContext2D): void {
    const b = this.boss;
    if (!b || !b.awake || b.dead || this.game.hudHidden) return;
    const w = 160;
    const x = (VIEW_W - w) / 2;
    const y = VIEW_H - 16;
    drawText(ctx, b.def.name, VIEW_W / 2, y - 12, 'W', { align: 'center', outline: 'k' });
    ctx.fillStyle = PALETTE.k;
    ctx.fillRect(x - 1, y - 1, w + 2, 6);
    ctx.fillStyle = PALETTE.d;
    ctx.fillRect(x, y, w, 4);
    ctx.fillStyle = b.phase === 0 ? PALETTE.W : PALETTE.P;
    ctx.fillRect(x, y, Math.round((w * Math.max(0, b.hp)) / b.maxHp), 4);
  }

  private renderName(ctx: CanvasRenderingContext2D): void {
    const a = Math.min(1, this.nameT / 30, (150 - this.nameT) / 20);
    ctx.globalAlpha = Math.max(0, a);
    const name = this.area.name;
    const w = measure(name) + 24;
    const x = Math.round((VIEW_W - w) / 2);
    const y = 46;
    ctx.fillStyle = PALETTE.k;
    ctx.fillRect(x, y, w, 17);
    ctx.fillStyle = PALETTE.y;
    ctx.fillRect(x + 2, y + 2, w - 4, 1);
    ctx.fillRect(x + 2, y + 14, w - 4, 1);
    drawText(ctx, name, VIEW_W / 2, y + 4, 'W', { align: 'center' });
    ctx.globalAlpha = 1;
  }
}
