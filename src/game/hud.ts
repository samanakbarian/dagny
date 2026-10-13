import { drawSprite } from '../engine/sprites';
import { drawText } from '../engine/text';
import { SPELLS } from '../data/spells';
import { STR } from '../data/strings';
import { hpMax, mpMax, type GameState } from './state';
import { nextTarget } from './progression';
import { P, drawBar } from './ui';

/**
 * HUD: life, magic, levels (S/M/L) and XP along the top edge, clear of the
 * touch controls (which live in the bottom corners and the top-right corner).
 */
export function drawHud(ctx: CanvasRenderingContext2D, s: GameState, opts: { keys?: number; frame: number; lowHpBlink?: boolean }): void {
  const mh = hpMax(s);
  const mm = mpMax(s);
  // Life
  drawSprite(ctx, 'hudHeart', 0, 5, 5);
  const blink = s.hp <= 2 && Math.floor(opts.frame / 15) % 2 === 0;
  drawBar(ctx, 14, 6, s.hp, mh, blink ? P.Y : P.R, P.d, 2);
  // Magic
  drawSprite(ctx, 'hudCup', 0, 5, 14);
  drawBar(ctx, 14, 15, s.mp, mm, P.U, P.n, 1);
  if (s.selectedSpell) {
    drawText(ctx, SPELLS[s.selectedSpell].name, 14, 22, 'W', { shadow: 'k' });
  }
  // Levels and XP
  const lx = 120;
  const L = STR.levelShort;
  let x = lx;
  x += drawText(ctx, `${L.styrka}${s.levels.styrka}`, x, 4, 'Y', { shadow: 'k' }) + 5;
  x += drawText(ctx, `${L.magi}${s.levels.magi}`, x, 4, 'c', { shadow: 'k' }) + 5;
  x += drawText(ctx, `${L.liv}${s.levels.liv}`, x, 4, 'i', { shadow: 'k' }) + 8;
  const target = nextTarget(s.levels);
  const xpText = target === null ? `${STR.xp} ${s.xp}` : `${STR.xp} ${s.xp}/${target}`;
  drawText(ctx, xpText, x, 4, target !== null && s.xp >= target ? 'Y' : 'W', { shadow: 'k' });
  if (opts.keys !== undefined && opts.keys > 0) {
    drawSprite(ctx, 'key', 0, lx, 16);
    drawText(ctx, `×${opts.keys}`, lx + 10, 15, 'W', { shadow: 'k' });
  }
}
