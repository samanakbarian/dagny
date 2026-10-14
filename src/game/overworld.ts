import { Act } from '../engine/input';
import { VIEW_W, VIEW_H } from '../engine/screen';
import { drawSprite } from '../engine/sprites';
import { drawText, measure } from '../engine/text';
import { OVERWORLD } from '../data/overworld';
import { PALETTE } from '../data/palettes';
import { STR } from '../data/strings';
import type { EncounterDef, OverworldPlace } from '../data/types';
import { DialogOverlay } from './dialog';
import type { Game, Scene } from './game';
import { drawHud } from './hud';
import { hasFlag, hasItem, type GameState } from './state';
import * as flow from './flow';
import { ENCOUNTER_TABLES, TERRAIN_TYPE } from '../data/encounters';
import { pickEncounter } from './encounters';

const T = 16;
const STEP_FRAMES = 9;

export const TILE_SPRITE: Readonly<Record<string, string>> = {
  '.': 'owGrass',
  f: 'owForest',
  '~': 'owWater',
  s: 'owSwamp',
  '^': 'owMountain',
  '|': 'owRoad',
  '-': 'owRoadH',
  '+': 'owRoad',
  ':': 'owField',
  _: 'owSand',
  '=': 'owBridge',
  V: 'owVillage',
  K: 'owChurch',
  G: 'owGlade',
  B: 'owVillage',
  O: 'owStones',
  M: 'owMine',
  Q: 'owMill',
  Y: 'owLighthouse',
  P: 'owPark',
  T: 'owTroll',
  C: 'owCave',
  D: 'owTunnel',
  N: 'owNightForest',
  // The hidden pass looks like the rest of the mountain until the radio finds it.
  H: 'owMountain',
  Z: 'owFabod',
};

interface Walker {
  x: number;
  y: number;
  /** Previous tile while moving. */
  fx: number;
  fy: number;
  t: number;
}

interface EncounterRuntime extends Walker {
  def: EncounterDef;
  /** Play time (s) when it may come back. */
  respawnAt: number;
  wait: number;
}

/** The last meeting, so the same one never comes twice in a row. */
let lastEncounter: string | null = null;

/** Wandering creatures keep their positions between visits (per session). */
const encounterMemory = new Map<number, EncounterRuntime>();

let staticMap: HTMLCanvasElement | null = null;

function buildStatic(): HTMLCanvasElement {
  const tiles = OVERWORLD.tiles;
  const c = document.createElement('canvas');
  c.width = tiles[0].length * T;
  c.height = tiles.length * T;
  const ctx = c.getContext('2d') as CanvasRenderingContext2D;
  for (let y = 0; y < tiles.length; y++) {
    for (let x = 0; x < tiles[y].length; x++) {
      const ch = tiles[y][x];
      if (ch === '~') continue;
      // Places sit on grass.
      if ('VKGBOMQYPZTC'.includes(ch)) drawSprite(ctx, 'owGrass', 0, x * T, y * T);
      drawSprite(ctx, TILE_SPRITE[ch] ?? 'owGrass', 0, x * T, y * T);
    }
  }
  return c;
}

export class OverworldScene implements Scene {
  private me: Walker;
  private facing: 'down' | 'up' | 'side' = 'down';
  private flip = false;
  private frame = 0;
  private grace = 90;
  private blockedMsgT = 0;
  private encounters: EncounterRuntime[] = [];
  private camX = 0;
  private camY = 0;
  private leaving = false;
  private water: Array<{ x: number; y: number }> = [];
  private passes: Array<{ x: number; y: number }> = [];

  constructor(private readonly game: Game) {
    const s = this.s;
    this.me = { x: s.ow.x, y: s.ow.y, fx: s.ow.x, fy: s.ow.y, t: 1 };
    staticMap ??= buildStatic();
    OVERWORLD.encounters.forEach((def, i) => {
      let e = encounterMemory.get(i);
      if (!e) {
        e = { def, x: def.x, y: def.y, fx: def.x, fy: def.y, t: 1, respawnAt: 0, wait: 20 + i * 7 };
        encounterMemory.set(i, e);
      }
      this.encounters.push(e);
    });
    const tiles = OVERWORLD.tiles;
    for (let y = 0; y < tiles.length; y++) {
      for (let x = 0; x < tiles[y].length; x++) {
        if (tiles[y][x] === '~') this.water.push({ x, y });
        else if (tiles[y][x] === 'H') this.passes.push({ x, y });
      }
    }
    this.updateCamera(true);
  }

  private get s(): GameState {
    return this.game.state as GameState;
  }

  music(): string | null {
    return OVERWORLD.music;
  }

  enter(): void {
    this.game.save();
  }

  capture(state: GameState): void {
    state.ow = { x: this.me.x, y: this.me.y };
    state.loc = { area: 'overworld', x: this.me.x, y: this.me.y };
  }

  private tile(x: number, y: number): string {
    return OVERWORLD.tiles[y]?.[x] ?? '^';
  }

  private placeAt(x: number, y: number): OverworldPlace | undefined {
    return OVERWORLD.places.find((p) => p.x === x && p.y === y);
  }

  /** Can Dagny step onto this tile? Returns the missing item's id if blocked by one. */
  private passable(x: number, y: number): true | string | false {
    const ch = this.tile(x, y);
    if (OVERWORLD.blocked.includes(ch)) return false;
    const need = OVERWORLD.needs[ch];
    if (need && !hasItem(this.s, need)) return need;
    return true;
  }

  update(): void {
    this.frame++;
    if (this.grace > 0) this.grace--;
    if (this.blockedMsgT > 0) this.blockedMsgT--;
    if (this.leaving) return;
    const input = this.game.input;
    const me = this.me;

    if (me.t < 1) {
      me.t = Math.min(1, me.t + 1 / STEP_FRAMES);
      if (me.t >= 1) this.arrive();
    } else {
      let dx = 0;
      let dy = 0;
      if (input.held(Act.Left)) dx = -1;
      else if (input.held(Act.Right)) dx = 1;
      else if (input.held(Act.Up)) dy = -1;
      else if (input.held(Act.Down)) dy = 1;
      // Taps: walk toward the tapped spot.
      if (!dx && !dy && input.taps.length) {
        const t = input.taps[0];
        const wx = (t.x + this.camX) / T - (me.x + 0.5);
        const wy = (t.y + this.camY) / T - (me.y + 0.5);
        if (Math.abs(wx) > Math.abs(wy)) dx = Math.sign(wx);
        else dy = Math.sign(wy);
      }
      if (dx || dy) {
        this.facing = dy < 0 ? 'up' : dy > 0 ? 'down' : 'side';
        if (dx) this.flip = dx < 0;
        const nx = me.x + dx;
        const ny = me.y + dy;
        const ok = this.passable(nx, ny);
        if (ok === true) {
          me.fx = me.x;
          me.fy = me.y;
          me.x = nx;
          me.y = ny;
          me.t = 0;
          if (this.tile(nx, ny) === '~' && this.tile(me.fx, me.fy) !== '~') this.game.audio.play('water');
        } else if (typeof ok === 'string' && this.blockedMsgT === 0) {
          this.blockedMsgT = 90;
          this.game.pushOverlay(new DialogOverlay(this.game, `behover_${ok}`));
        }
      }
    }

    this.updateEncounters();
    this.updateCamera(false);
  }

  private arrive(): void {
    const me = this.me;
    this.s.ow = { x: me.x, y: me.y };
    if (this.frame % 2 === 0) this.game.audio.play('step');
    const place = this.placeAt(me.x, me.y);
    if (place) {
      const locked = place.requires && !place.requires.every((f) => hasFlag(this.s, f));
      if (place.area && !locked) {
        this.leaving = true;
        this.game.audio.play('door');
        flow.goToArea(this.game, place.area, { entry: place.entry });
      } else if (place.dialog) {
        this.game.pushOverlay(new DialogOverlay(this.game, place.dialog));
      }
    }
  }

  private pos(w: Walker): { x: number; y: number } {
    const k = w.t;
    return { x: (w.fx + (w.x - w.fx) * k) * T, y: (w.fy + (w.y - w.fy) * k) * T };
  }

  private updateEncounters(): void {
    const s = this.s;
    const me = this.me;
    const mp = this.pos(me);
    for (const e of this.encounters) {
      if (e.def.goneFlag && s.flags.includes(e.def.goneFlag)) continue;
      if (s.playTime < e.respawnAt) continue;
      if (e.t < 1) {
        e.t = Math.min(1, e.t + 1 / 22);
      } else if (--e.wait <= 0) {
        e.wait = 25 + Math.floor(Math.random() * 35);
        const dist = Math.abs(e.x - me.x) + Math.abs(e.y - me.y);
        const dirs: Array<[number, number]> = [[1, 0], [-1, 0], [0, 1], [0, -1]];
        let choice: [number, number];
        if (dist < 7 && Math.random() < 0.75) {
          // Drift toward Dagny.
          const sx = Math.sign(me.x - e.x);
          const sy = Math.sign(me.y - e.y);
          choice = Math.abs(me.x - e.x) > Math.abs(me.y - e.y) ? [sx, 0] : [0, sy];
        } else {
          choice = dirs[Math.floor(Math.random() * 4)];
        }
        const nx = e.x + choice[0];
        const ny = e.y + choice[1];
        const ch = this.tile(nx, ny);
        const homeDist = Math.abs(nx - e.def.x) + Math.abs(ny - e.def.y);
        if (e.def.terrain.includes(ch) && !this.placeAt(nx, ny) && homeDist <= 6) {
          e.fx = e.x;
          e.fy = e.y;
          e.x = nx;
          e.y = ny;
          e.t = 0;
        }
      }
      // Collision → short side-view encounter.
      const ep = this.pos(e);
      if (this.grace === 0 && Math.abs(ep.x - mp.x) < 11 && Math.abs(ep.y - mp.y) < 11) {
        e.respawnAt = s.playTime + 45;
        e.x = e.fx = e.def.x;
        e.y = e.fy = e.def.y;
        e.t = 1;
        const terrain = this.tile(me.t < 1 ? me.fx : me.x, me.t < 1 ? me.fy : me.y);
        const table = ENCOUNTER_TABLES[e.def.table ?? TERRAIN_TYPE[terrain] ?? 'ang'];
        const pick = pickEncounter(table, Math.random(), lastEncounter);
        lastEncounter = pick.id;
        this.s.ow = { x: me.t < 1 ? me.fx : me.x, y: me.t < 1 ? me.fy : me.y };
        if ('dialog' in pick) {
          // A friendly meeting instead of a fight.
          this.grace = 60;
          this.game.audio.play('magic');
          this.game.pushOverlay(new DialogOverlay(this.game, pick.dialog));
          return;
        }
        this.leaving = true;
        this.game.audio.play('roar');
        this.game.vibrate(30);
        flow.goToArea(this.game, pick.area, { entry: 'W', facing: 1 });
        return;
      }
    }
  }

  private updateCamera(snap: boolean): void {
    const p = this.pos(this.me);
    const mapW = OVERWORLD.tiles[0].length * T;
    const mapH = OVERWORLD.tiles.length * T;
    const tx = Math.max(0, Math.min(mapW - VIEW_W, p.x + 8 - VIEW_W / 2));
    const ty = Math.max(0, Math.min(mapH - VIEW_H, p.y + 8 - VIEW_H / 2));
    if (snap) {
      this.camX = tx;
      this.camY = ty;
    } else {
      this.camX += (tx - this.camX) * 0.2;
      this.camY += (ty - this.camY) * 0.2;
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    const camX = Math.round(this.camX);
    const camY = Math.round(this.camY);
    ctx.drawImage(staticMap as HTMLCanvasElement, camX, camY, VIEW_W, VIEW_H, 0, 0, VIEW_W, VIEW_H);
    const wf = Math.floor(this.frame / 30);
    for (const w of this.water) {
      const x = w.x * T - camX;
      const y = w.y * T - camY;
      if (x < -T || y < -T || x > VIEW_W || y > VIEW_H) continue;
      drawSprite(ctx, 'owWater', wf + w.x, x, y);
    }
    // With the radio, the hidden pass shows as a crack in the mountain.
    const s = this.s;
    if (hasItem(s, 'radio')) {
      for (const hp of this.passes) {
        const x = hp.x * T - camX;
        const y = hp.y * T - camY;
        if (x < -T || y < -T || x > VIEW_W || y > VIEW_H) continue;
        drawSprite(ctx, 'owPass', 0, x, y);
      }
    }
    // Encounters.
    for (const e of this.encounters) {
      if (s.playTime < e.respawnAt) continue;
      if (e.def.goneFlag && s.flags.includes(e.def.goneFlag)) continue;
      const p = this.pos(e);
      const bob = e.def.sprite === 'owWisp' ? Math.round(Math.sin(this.frame / 10 + e.def.x) * 2) : 0;
      drawSprite(ctx, e.def.sprite, Math.floor(this.frame / 16) % 2, p.x - camX, p.y - camY + bob);
    }
    // Dagny.
    const p = this.pos(this.me);
    const onWater = this.tile(this.me.x, this.me.y) === '~' && this.me.t > 0.5 || (this.tile(this.me.fx, this.me.fy) === '~' && this.me.t <= 0.5);
    const walking = this.me.t < 1;
    const step = walking ? Math.floor(this.frame / 5) % 2 : 0;
    if (onWater) {
      drawSprite(ctx, 'owBoat', Math.floor(this.frame / 12) % 2, p.x - camX, p.y - camY);
    } else {
      const base = this.facing === 'down' ? 0 : this.facing === 'up' ? 2 : 4;
      drawSprite(ctx, 'owDagny', base + step, p.x - camX, p.y - camY, this.facing === 'side' && this.flip);
    }

    this.game.applyTone(ctx, OVERWORLD.tone, true);

    // Place name when standing next to / on a place.
    const near = OVERWORLD.places.find((pl) => Math.abs(pl.x - this.me.x) + Math.abs(pl.y - this.me.y) <= 1);
    if (near) {
      const w = measure(near.name) + 12;
      const x = Math.round((VIEW_W - w) / 2);
      const y = VIEW_H - 22;
      ctx.fillStyle = PALETTE.k;
      ctx.fillRect(x, y, w, 14);
      ctx.fillStyle = PALETTE.y;
      ctx.fillRect(x, y + 13, w, 1);
      drawText(ctx, near.name, VIEW_W / 2, y + 2, 'W', { align: 'center' });
    }
    if (!this.game.hudHidden) drawHud(ctx, s, { frame: this.frame });
    void STR;
  }
}
