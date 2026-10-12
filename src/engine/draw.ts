/** Crisp pixel shapes (canvas arcs are anti-aliased, which breaks the pixel look). */

export function disc(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
  cx = Math.round(cx);
  cy = Math.round(cy);
  r = Math.round(r);
  for (let y = -r; y <= r; y++) {
    const half = Math.round(Math.sqrt(r * r - y * y));
    ctx.fillRect(cx - half, cy + y, half * 2 + 1, 1);
  }
}

export function ring(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
  cx = Math.round(cx);
  cy = Math.round(cy);
  r = Math.round(r);
  let x = r;
  let y = 0;
  let err = 1 - r;
  while (x >= y) {
    for (const [dx, dy] of [[x, y], [y, x], [-y, x], [-x, y], [-x, -y], [-y, -x], [y, -x], [x, -y]]) {
      ctx.fillRect(cx + dx, cy + dy, 1, 1);
    }
    y++;
    if (err < 0) err += 2 * y + 1;
    else {
      x--;
      err += 2 * (y - x) + 1;
    }
  }
}
