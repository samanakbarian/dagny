import { VIEW_W, VIEW_H } from '../engine/screen';
import { drawSprite } from '../engine/sprites';
import { drawText, measure, wrap, LINE_HEIGHT } from '../engine/text';
import { Act } from '../engine/input';
import { AREAS } from '../data/areas';
import { ITEMS, ITEM_ORDER } from '../data/items';
import { OVERWORLD } from '../data/overworld';
import { PALETTE } from '../data/palettes';
import { MAX_LEVEL, STAT_NAMES } from '../data/progression';
import { SKILLS, SPELLS, SPELL_ORDER } from '../data/spells';
import { STR } from '../data/strings';
import { TEMPLES } from '../data/temples';
import type { StatId } from '../data/types';
import type { Game, Overlay } from './game';
import { nextCost, raise, maxHp, maxMp } from './progression';
import { hasFlag } from './state';
import { ListMenu, drawPanel, drawPostcard, P } from './ui';
import * as flow from './flow';

function dim(ctx: CanvasRenderingContext2D, a = 0.55): void {
  ctx.globalAlpha = a;
  ctx.fillStyle = PALETTE.k;
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  ctx.globalAlpha = 1;
}

/** Pause menu: Fortsätt, Läsningar, Föremål, Karta, Inställningar, Spara och avsluta. */
export class PauseOverlay implements Overlay {
  hideHud = false;
  private menu: ListMenu;
  private open = true;

  constructor(private readonly game: Game, private readonly onOverworld = false) {
    const g = game;
    this.menu = new ListMenu(
      [
        { label: STR.resume, onSelect: () => (this.open = false) },
        { label: STR.spells, onSelect: () => g.pushOverlay(new SpellsOverlay(g)) },
        { label: STR.items, onSelect: () => g.pushOverlay(new ItemsOverlay(g)) },
        { label: STR.map, onSelect: () => g.pushOverlay(new MapOverlay(g)) },
        { label: STR.settings, onSelect: () => g.pushOverlay(new SettingsOverlay(g)) },
        {
          label: STR.saveQuit,
          onSelect: () => {
            g.save(true);
            flow.toTitle(g);
            this.open = false;
          },
        },
      ],
      game.audio,
    );
    void this.onOverworld;
  }

  update(): boolean {
    if (!this.open) return false;
    if (this.menu.update(this.game.input) === 'back') {
      this.game.audio.play('cancel');
      return false;
    }
    return this.open;
  }

  render(ctx: CanvasRenderingContext2D): void {
    dim(ctx);
    const w = 150;
    const h = this.menu.items.length * 13 + 30;
    const x = Math.round((VIEW_W - w) / 2);
    const y = Math.round((VIEW_H - h) / 2) + 6;
    drawPanel(ctx, x, y, w, h);
    drawText(ctx, STR.paused, VIEW_W / 2, y + 6, 'Y', { align: 'center' });
    this.menu.render(ctx, x + 12, y + 22, w - 24);
    const s = this.game.state;
    if (s) {
      const t = Math.floor(s.playTime);
      const txt = `${Math.floor(t / 3600)}:${String(Math.floor((t % 3600) / 60)).padStart(2, '0')}`;
      drawText(ctx, txt, x + w - 8, y + 6, 'G', { align: 'right' });
    }
  }
}

/** Generic paged info overlay with a "back" behaviour. */
abstract class SubOverlay implements Overlay {
  hideHud = true;
  protected closed = false;
  constructor(protected readonly game: Game) {}
  protected abstract tick(): void;
  abstract render(ctx: CanvasRenderingContext2D): void;
  update(): boolean {
    const i = this.game.input;
    if (i.back() || i.pressed(Act.Pause)) {
      this.game.audio.play('cancel');
      return false;
    }
    this.tick();
    return !this.closed;
  }
  protected frame(ctx: CanvasRenderingContext2D, title: string): { x: number; y: number; w: number; h: number } {
    dim(ctx, 0.7);
    const x = 16, y = 12, w = VIEW_W - 32, h = VIEW_H - 24;
    drawPanel(ctx, x, y, w, h);
    drawText(ctx, title, x + 10, y + 6, 'Y');
    drawText(ctx, `${STR.back}: X / B`, x + w - 8, y + 6, 'G', { align: 'right' });
    return { x, y, w, h };
  }
}

export class SpellsOverlay extends SubOverlay {
  private menu: ListMenu;
  constructor(game: Game) {
    super(game);
    const s = game.state!;
    this.menu = new ListMenu(
      SPELL_ORDER.map((id) => ({
        label: () => (s.spells.includes(id) ? SPELLS[id].name : '? ? ?'),
        value: () => {
          if (!s.spells.includes(id)) return '';
          const c = SPELLS[id].cost[s.levels.magi - 1] ?? SPELLS[id].cost[0];
          return `${s.selectedSpell === id ? '★ ' : ''}${c}`;
        },
        disabled: () => !s.spells.includes(id),
        onSelect: () => {
          s.selectedSpell = id;
        },
      })),
      game.audio,
    );
    const first = SPELL_ORDER.findIndex((id) => id === s.selectedSpell);
    this.menu.cursor = Math.max(0, first);
  }
  protected tick(): void {
    this.menu.update(this.game.input);
  }
  render(ctx: CanvasRenderingContext2D): void {
    const f = this.frame(ctx, STR.spells);
    const s = this.game.state!;
    this.menu.render(ctx, f.x + 10, f.y + 22, 110);
    const id = SPELL_ORDER[this.menu.cursor];
    const def = SPELLS[id];
    const tx = f.x + 140;
    if (!s.spells.length) {
      wrap(STR.noSpells, f.w - 150).forEach((l, i) => drawText(ctx, l, tx, f.y + 22 + i * LINE_HEIGHT, 'W'));
    } else if (s.spells.includes(id)) {
      drawText(ctx, def.name, tx, f.y + 22, 'Y');
      wrap(def.description, f.w - 150).forEach((l, i) => drawText(ctx, l, tx, f.y + 36 + i * LINE_HEIGHT, 'W'));
      drawText(ctx, `${STR.costMp} ${def.cost[s.levels.magi - 1]} magi`, tx, f.y + 80, 'c');
    } else {
      wrap(`Lärs ut i ${def.village}.`, f.w - 150).forEach((l, i) => drawText(ctx, l, tx, f.y + 22 + i * LINE_HEIGHT, 'G'));
    }
    // Skills
    let y = f.y + 22 + 8 * 13;
    drawText(ctx, STR.skillsHeading, f.x + 10, y, 'Y');
    y += 12;
    for (const sk of Object.values(SKILLS)) {
      const known = s.skills.includes(sk.id);
      drawText(ctx, known ? sk.name : '? ? ?', f.x + 18, y, known ? 'W' : 'G');
      if (known) drawText(ctx, sk.description, f.x + 90, y, 'w');
      y += 11;
    }
  }
}

export class ItemsOverlay extends SubOverlay {
  private cursor = 0;
  protected tick(): void {
    const i = this.game.input;
    const owned = this.owned();
    if (!owned.length) return;
    if (i.pressed(Act.Right) || i.pressed(Act.Down)) this.cursor = (this.cursor + 1) % owned.length;
    if (i.pressed(Act.Left) || i.pressed(Act.Up)) this.cursor = (this.cursor - 1 + owned.length) % owned.length;
    for (const t of i.taps) {
      const idx = Math.floor((t.x - 34) / 34);
      if (t.y > 36 && t.y < 70 && idx >= 0 && idx < owned.length) this.cursor = idx;
    }
  }
  private owned(): string[] {
    const s = this.game.state!;
    return ITEM_ORDER.filter((id) => s.items.includes(id));
  }
  render(ctx: CanvasRenderingContext2D): void {
    const f = this.frame(ctx, STR.items);
    const owned = this.owned();
    const s = this.game.state!;
    if (!owned.length) {
      drawText(ctx, STR.noItems, f.x + 12, f.y + 30, 'G');
    }
    owned.forEach((id, k) => {
      const x = f.x + 18 + k * 34;
      const y = f.y + 26;
      ctx.fillStyle = k === this.cursor ? P.y : P.k;
      ctx.fillRect(x - 2, y - 2, 30, 26);
      ctx.fillStyle = P.K;
      ctx.fillRect(x, y, 26, 22);
      const it = ITEMS[id];
      drawSprite(ctx, it.sprite, 0, x + 13 - 8, y + 3);
    });
    const sel = owned[this.cursor];
    if (sel) {
      const it = ITEMS[sel];
      drawText(ctx, it.name, f.x + 14, f.y + 62, 'Y');
      wrap(it.description, f.w - 28).forEach((l, i) => drawText(ctx, l, f.x + 14, f.y + 76 + i * LINE_HEIGHT, 'W'));
    }
    // Stats summary.
    const y = f.y + f.h - 36;
    drawText(ctx, `${STAT_NAMES.styrka} ${s.levels.styrka}   ${STAT_NAMES.magi} ${s.levels.magi}   ${STAT_NAMES.liv} ${s.levels.liv}`, f.x + 14, y, 'c');
    drawText(ctx, `Liv ${s.hp}/${maxHp(s.levels.liv)}   Magi ${s.mp}/${maxMp(s.levels.magi)}   XP ${s.xp}`, f.x + 14, y + 12, 'w');
  }
}

/** Overworld map with the places and the temples' state. */
export class MapOverlay extends SubOverlay {
  private t = 0;
  protected tick(): void {
    this.t++;
  }
  render(ctx: CanvasRenderingContext2D): void {
    const f = this.frame(ctx, STR.map);
    const tiles = OVERWORLD.tiles;
    const cell = 3;
    const mw = tiles[0].length * cell;
    const ox = f.x + 10;
    const oy = f.y + 22;
    const col: Record<string, string> = {
      '.': P.M, f: P.m, '~': P.v, s: P.p, '^': P.G, '|': P.t, '-': P.t, '+': P.t, ':': P.y, _: P.t,
      V: P.r, K: P.W, G: P.l, B: P.R, O: P.Y, M: P.y, Q: P.r, Y: P.W, P: P.i,
    };
    for (let y = 0; y < tiles.length; y++) {
      for (let x = 0; x < tiles[y].length; x++) {
        ctx.fillStyle = col[tiles[y][x]] ?? P.M;
        ctx.fillRect(ox + x * cell, oy + y * cell, cell, cell);
      }
    }
    const s = this.game.state!;
    if (Math.floor(this.t / 15) % 2 === 0) {
      ctx.fillStyle = P.W;
      ctx.fillRect(ox + s.ow.x * cell - 1, oy + s.ow.y * cell - 1, cell + 2, cell + 2);
      ctx.fillStyle = P.r;
      ctx.fillRect(ox + s.ow.x * cell, oy + s.ow.y * cell, cell, cell);
    }
    // Legend: temples.
    let y = oy;
    const lx = ox + mw + 10;
    drawText(ctx, STR.templesHeading, lx, y, 'Y');
    y += 13;
    for (const t of TEMPLES) {
      const done = hasFlag(s, `${t.id}_klar`);
      drawText(ctx, `${t.number}. ${t.name}`, lx, y, done ? 'Y' : t.entryArea ? 'W' : 'G');
      if (done) drawText(ctx, '★', lx + measure(`${t.number}. ${t.name}`) + 3, y, 'Y');
      y += 11;
    }
  }
}

export class SettingsOverlay extends SubOverlay {
  private menu: ListMenu;
  constructor(game: Game) {
    super(game);
    const st = game.settings;
    const apply = (): void => game.applySettings();
    const onOff = (b: boolean): string => (b ? STR.on : STR.off);
    const step = (v: number, d: number, lo: number, hi: number, by: number): number =>
      Math.round(Math.max(lo, Math.min(hi, v + d * by)) * 100) / 100;
    this.menu = new ListMenu(
      [
        { label: STR.music, value: () => `${st.music}`, onAdjust: (d) => { st.music = step(st.music, d, 0, 10, 1); apply(); } },
        { label: STR.sfx, value: () => `${st.sfx}`, onAdjust: (d) => { st.sfx = step(st.sfx, d, 0, 10, 1); apply(); game.audio.play('sword'); } },
        { label: STR.calmMode, value: () => onOff(st.calm), onAdjust: () => { st.calm = !st.calm; apply(); } },
        { label: STR.stickMode, value: () => (st.stickMode === 'stick' ? STR.stick : STR.dpad), onAdjust: () => { st.stickMode = st.stickMode === 'stick' ? 'dpad' : 'stick'; apply(); } },
        { label: STR.controlSize, value: () => `${Math.round(st.controlScale * 100)}%`, onAdjust: (d) => { st.controlScale = step(st.controlScale, d, 0.75, 1.6, 0.15); apply(); } },
        { label: STR.controlOpacity, value: () => `${Math.round((1 - st.controlOpacity) * 100)}%`, onAdjust: (d) => { st.controlOpacity = step(st.controlOpacity, -d, 0.15, 0.9, 0.15); apply(); } },
        { label: STR.controlPlacement, value: () => STR.placementNames[st.placement], onAdjust: (d) => { st.placement = (st.placement + d + 3) % 3; apply(); } },
        { label: STR.vibration, value: () => onOff(st.vibration), onAdjust: () => { st.vibration = !st.vibration; apply(); if (st.vibration) game.vibrate(30); } },
        { label: STR.showFps, value: () => onOff(st.showFps), onAdjust: () => { st.showFps = !st.showFps; apply(); } },
        { label: STR.back, onSelect: () => (this.closed = true) },
      ],
      game.audio,
    );
    this.menu.rowHeight = 12;
  }
  protected tick(): void {
    this.menu.update(this.game.input);
  }
  render(ctx: CanvasRenderingContext2D): void {
    const f = this.frame(ctx, STR.settings);
    this.menu.render(ctx, f.x + 14, f.y + 22, 200);
    const cur = this.menu.cursor;
    if (cur === 2) drawText(ctx, STR.calmHelp, f.x + 14, f.y + f.h - 14, 'G');
    else drawText(ctx, '< > ändrar', f.x + 14, f.y + f.h - 14, 'G');
  }
}

/** "Nivå upp!" – the player chooses Styrka, Magi or Liv. */
export class LevelUpOverlay implements Overlay {
  hideHud = true;
  private menu: ListMenu;
  private open = true;

  constructor(private readonly game: Game, onChange?: () => void) {
    const s = game.state!;
    const stats: StatId[] = ['styrka', 'magi', 'liv'];
    this.menu = new ListMenu(
      [
        ...stats.map((st) => ({
          label: () => `${STAT_NAMES[st]} ${s.levels[st]}${s.levels[st] < MAX_LEVEL ? ` ▶ ${s.levels[st] + 1}` : ''}`,
          value: () => {
            const c = nextCost(st, s.levels[st]);
            return c === null ? STR.levelMax : `${c} ${STR.needXp}`;
          },
          disabled: () => {
            const c = nextCost(st, s.levels[st]);
            return c === null || s.xp < c;
          },
          onSelect: () => {
            s.xp = raise(s.xp, s.levels, st);
            // Raising Liv / Magi fills the new capacity.
            if (st === 'liv') s.hp = maxHp(s.levels.liv);
            if (st === 'magi') s.mp = maxMp(s.levels.magi);
            game.audio.play('levelup');
            game.vibrate([20, 40, 20]);
            onChange?.();
            game.save();
            this.open = false;
          },
        })),
        { label: STR.levelUpLater, onSelect: () => (this.open = false) },
      ],
      game.audio,
    );
  }

  update(): boolean {
    if (!this.open) return false;
    if (this.menu.update(this.game.input) === 'back') return false;
    return this.open;
  }

  render(ctx: CanvasRenderingContext2D): void {
    dim(ctx, 0.5);
    const w = 220;
    const h = 100;
    const x = Math.round((VIEW_W - w) / 2);
    const y = 36;
    drawPostcard(ctx, x, y, w, h);
    drawText(ctx, STR.levelUpTitle, VIEW_W / 2, y + 7, 'r', { align: 'center' });
    drawText(ctx, STR.levelUpHelp, x + 12, y + 20, 'g');
    this.menu.render(ctx, x + 12, y + 35, w - 34, { text: 'k', dim: 'G', hi: 'r' });
    const s = this.game.state!;
    drawText(ctx, `XP ${s.xp}`, x + w - 12, y + 7, 'u', { align: 'right' });
  }
}

/** Shown when Dagny falls asleep (is defeated). */
export class GameOverOverlay implements Overlay {
  hideHud = true;
  private menu: ListMenu;
  private t = 0;

  constructor(private readonly game: Game, temple: string | null) {
    const s = game.state!;
    const canRetry = !!s.checkpoint && temple !== null && AREAS[s.checkpoint.area]?.temple === temple;
    const items = [];
    if (canRetry) items.push({ label: STR.retryCheckpoint, onSelect: () => flow.retryCheckpoint(game) });
    items.push({ label: STR.wakeHome, onSelect: () => flow.wakeAtVillage(game) });
    this.menu = new ListMenu(items, game.audio);
  }

  update(): boolean {
    this.t++;
    if (this.t < 40) return true;
    const before = this.game.transitioning;
    this.menu.update(this.game.input);
    // Close once a choice started the transition.
    return !(this.game.transitioning && !before);
  }

  render(ctx: CanvasRenderingContext2D): void {
    dim(ctx, Math.min(0.85, this.t / 40));
    if (this.t < 30) return;
    drawText(ctx, STR.gameOverTitle, VIEW_W / 2, 50, 'W', { align: 'center' });
    drawText(ctx, STR.gameOverText, VIEW_W / 2, 66, 'G', { align: 'center' });
    const w = this.menu.width() + 10;
    this.menu.render(ctx, Math.round((VIEW_W - w) / 2), 96, w);
  }
}
