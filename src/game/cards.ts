import { VIEW_W, VIEW_H } from '../engine/screen';
import { drawSprite } from '../engine/sprites';
import { disc } from '../engine/draw';
import { drawText, wrap, LINE_HEIGHT } from '../engine/text';
import { Act } from '../engine/input';
import { PALETTE } from '../data/palettes';
import type { Game, Scene } from './game';
import { drawPostcard } from './ui';

/**
 * Story cards typed out on postcards (intro and the end of the vertical
 * slice). Tap / any button advances.
 */
export class CardsScene implements Scene {
  private i = 0;
  private shown = 0;
  private t = 0;
  private done = false;

  constructor(
    private readonly game: Game,
    private readonly cards: string[],
    private readonly song: string,
    private readonly onDone: () => void,
    private readonly mood: 'natt' | 'soluppgang' = 'natt',
  ) {}

  music(): string | null {
    return this.song;
  }

  update(): void {
    this.t++;
    const input = this.game.input;
    const text = this.cards[this.i] ?? '';
    const advance = input.confirm() || input.pressed(Act.Sword) || input.taps.length > 0;
    if (this.shown < text.length) {
      this.shown += input.held(Act.Jump) ? 3 : 0.7;
      if (Math.floor(this.shown) % 4 === 0) this.game.audio.play('dialog');
      if (advance && this.shown > 3) this.shown = text.length;
    } else if (advance && !this.done) {
      this.i++;
      this.shown = 0;
      if (this.i >= this.cards.length) {
        this.done = true;
        this.onDone();
      }
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    const sun = this.mood === 'soluppgang';
    const g = ctx.createLinearGradient(0, 0, 0, VIEW_H);
    if (sun) {
      const rise = Math.min(1, this.t / 600);
      g.addColorStop(0, '#6f93ad');
      g.addColorStop(0.6, '#f2a07a');
      g.addColorStop(1, '#fbe8c2');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, VIEW_W, VIEW_H);
      ctx.fillStyle = '#fbe8c2';
      disc(ctx, VIEW_W / 2, VIEW_H - 20 - rise * 40, 22);
      ctx.fillStyle = PALETTE.m;
      ctx.fillRect(0, VIEW_H - 24, VIEW_W, 24);
    } else {
      g.addColorStop(0, '#232a40');
      g.addColorStop(1, '#4a4560');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, VIEW_W, VIEW_H);
      // Stars and the bell tower silhouette.
      ctx.fillStyle = PALETTE.W;
      for (let k = 0; k < 30; k++) {
        if ((k * 7 + Math.floor(this.t / 20)) % 9 === 0) continue;
        ctx.fillRect((k * 97) % VIEW_W, (k * 53) % 90, 1, 1);
      }
      ctx.fillStyle = PALETTE.k;
      ctx.fillRect(250, 70, 24, 110);
      ctx.beginPath();
      ctx.moveTo(244, 72);
      ctx.lineTo(262, 40);
      ctx.lineTo(280, 72);
      ctx.fill();
      ctx.fillStyle = PALETTE.y;
      if (Math.floor(this.t / 30) % 2 === 0) ctx.fillRect(259, 84, 6, 8);
    }
    const text = this.cards[this.i] ?? '';
    const lines = wrap(text, 236);
    const h = lines.length * LINE_HEIGHT + 18;
    const y = Math.round((VIEW_H - h) / 2) - 10;
    drawPostcard(ctx, 32, y, 256, h);
    let left = Math.floor(this.shown);
    lines.forEach((l, k) => {
      drawText(ctx, l, 42, y + 8 + k * LINE_HEIGHT, 'k', { limit: Math.max(0, left) });
      left -= l.length + 1;
    });
    if (this.shown >= text.length && Math.floor(this.t / 20) % 2 === 0) drawText(ctx, '▶', 274, y + h - 13, 'r');
    if (sun) drawSprite(ctx, 'dagny', 0, VIEW_W / 2 - 40, VIEW_H - 48);
  }
}
