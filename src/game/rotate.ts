import { VIEW_W, VIEW_H } from '../engine/screen';
import { drawSprite } from '../engine/sprites';
import { drawText } from '../engine/text';
import { PALETTE } from '../data/palettes';
import { STR } from '../data/strings';

/**
 * Shown in portrait orientation: Dagny tuning a transistor radio while a
 * little phone turns sideways.
 */
export class RotateScreen {
  private t = 0;

  update(): void {
    this.t++;
  }

  render(ctx: CanvasRenderingContext2D): void {
    const t = this.t;
    const g = ctx.createLinearGradient(0, 0, 0, VIEW_H);
    g.addColorStop(0, '#3f5f7a');
    g.addColorStop(1, '#d3a4b3');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);
    // Rug and the radio on a little table.
    ctx.fillStyle = PALETTE.r;
    ctx.fillRect(60, 140, 200, 8);
    ctx.fillStyle = PALETTE.R;
    for (let x = 64; x < 256; x += 8) ctx.fillRect(x, 142, 4, 4);
    drawSprite(ctx, 'dagny', Math.floor(t / 40) % 2 === 0 ? 7 : 0, 120, 116);
    drawSprite(ctx, 'radio', Math.floor(t / 10) % 2, 140, 130);
    for (let k = 0; k < 3; k++) {
      const p = ((t + k * 40) % 120) / 120;
      ctx.globalAlpha = 1 - p;
      drawSprite(ctx, 'note', 0, 150 + k * 6 + Math.sin(p * 6 + k) * 4, 124 - p * 50);
      ctx.globalAlpha = 1;
    }
    // A phone turning sideways.
    const ang = (Math.min(1, ((t % 150) / 60)) * Math.PI) / 2;
    ctx.save();
    ctx.translate(218, 92);
    ctx.rotate(-ang);
    ctx.fillStyle = PALETTE.k;
    ctx.fillRect(-11, -19, 22, 38);
    ctx.fillStyle = PALETTE.c;
    ctx.fillRect(-8, -15, 16, 28);
    ctx.fillStyle = PALETTE.W;
    ctx.fillRect(-2, 15, 4, 2);
    ctx.restore();
    drawText(ctx, STR.rotate, VIEW_W / 2, 26, 'W', { align: 'center', outline: 'k' });
    drawText(ctx, STR.rotateSub, VIEW_W / 2, 42, 'Y', { align: 'center', outline: 'k' });
  }
}
