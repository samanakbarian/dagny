import { VIEW_W, VIEW_H } from '../engine/screen';
import { TONES } from '../data/palettes';
import { disc } from '../engine/draw';
import type { Backdrop } from '../data/types';

/**
 * Procedural parallax backgrounds (3–4 layers), drawn once per backdrop and
 * tone onto offscreen canvases and then scrolled.
 */
interface Layer {
  canvas: HTMLCanvasElement;
  factor: number;
  /** Vertical parallax factor. */
  yf: number;
}

const LAYER_W = 640;
const cache = new Map<string, { sky: HTMLCanvasElement; layers: Layer[] }>();

function rng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function canvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return [c, c.getContext('2d') as CanvasRenderingContext2D];
}

function spruce(ctx: CanvasRenderingContext2D, x: number, base: number, h: number, color: string): void {
  ctx.fillStyle = color;
  const w = Math.max(6, Math.round(h * 0.42));
  for (let y = 0; y < h; y++) {
    // Layered, jagged branches.
    const t = y / h;
    const tier = (y % 6) / 6;
    const half = Math.round((w / 2) * t * (0.75 + tier * 0.35));
    ctx.fillRect(Math.round(x - half), base - h + y, half * 2 + 1, 1);
  }
  ctx.fillRect(Math.round(x), base, 1, 3);
}

function hills(ctx: CanvasRenderingContext2D, base: number, amp: number, color: string, seed: number): void {
  const r = rng(seed);
  const p1 = r() * 6, p2 = r() * 6;
  ctx.fillStyle = color;
  for (let x = 0; x < LAYER_W; x++) {
    const a = (x / LAYER_W) * Math.PI * 2;
    const y = base - amp * (0.55 + 0.3 * Math.sin(a * 2 + p1) + 0.15 * Math.sin(a * 5 + p2));
    ctx.fillRect(x, Math.round(y), 1, VIEW_H - Math.round(y));
  }
}

function build(kind: Backdrop, toneId: string): { sky: HTMLCanvasElement; layers: Layer[] } {
  const tone = TONES[toneId] ?? TONES.sommarkvall;
  const [sky, s] = canvas(VIEW_W, VIEW_H);
  const g = s.createLinearGradient(0, 0, 0, VIEW_H);
  g.addColorStop(0, tone.sky[0]);
  g.addColorStop(0.55, tone.sky[1]);
  g.addColorStop(1, tone.sky[2]);
  s.fillStyle = g;
  s.fillRect(0, 0, VIEW_W, VIEW_H);
  const layers: Layer[] = [];
  const r = rng(kind.length * 97 + toneId.length * 13);

  if (kind === 'park') {
    // Stars, a dark tree line, and the park's pavilion and wheel far away.
    for (let i = 0; i < 70; i++) {
      s.fillStyle = r() < 0.2 ? '#f0d27a' : '#d7e4dc';
      s.fillRect(Math.floor(r() * VIEW_W), Math.floor(r() * 90), 1, 1);
    }
    const [far, f] = canvas(LAYER_W, VIEW_H);
    for (let x = 0; x < LAYER_W; x += 9) spruce(f, Math.round(x + r() * 5), 128, Math.round(18 + r() * 22), tone.hills[0]);
    f.fillStyle = tone.hills[0];
    f.fillRect(0, 128, LAYER_W, VIEW_H - 128);
    layers.push({ canvas: far, factor: 0.08, yf: 0.05 });
    const [mid, m] = canvas(LAYER_W, VIEW_H);
    m.fillStyle = tone.hills[1];
    for (let x = 60; x < LAYER_W; x += 320) {
      // Pavilion roof and posts.
      for (let row = 0; row < 18; row++) m.fillRect(x - row * 2, 92 + row, 40 + row * 4, 1);
      m.fillRect(x - 30, 110, 4, 30);
      m.fillRect(x + 66, 110, 4, 30);
      // Big wheel outline.
      for (let a = 0; a < 64; a++) {
        const ang = (a / 64) * Math.PI * 2;
        m.fillRect(Math.round(x + 180 + Math.cos(ang) * 30), Math.round(100 + Math.sin(ang) * 30), 2, 2);
      }
      m.fillRect(x + 179, 100, 2, 40);
    }
    // Bulb strings far away.
    for (let x = 0; x < LAYER_W; x += 6) {
      m.fillStyle = ['#cf6a4c', '#f0d27a', '#6f93ad', '#e0a0a0'][(x / 6) % 4];
      m.fillRect(x, Math.round(84 + Math.sin(x / 30) * 6), 1, 1);
    }
    m.fillStyle = tone.hills[1];
    m.fillRect(0, 140, LAYER_W, VIEW_H - 140);
    layers.push({ canvas: mid, factor: 0.22, yf: 0.12 });
    return { sky, layers };
  }

  if (kind === 'sea') {
    // Storm clouds, far skerries and rolling sea bands.
    s.fillStyle = 'rgba(43,34,51,0.25)';
    for (let i = 0; i < 7; i++) {
      const cx = Math.round(r() * VIEW_W);
      const cy = Math.round(10 + r() * 40);
      for (let k = 0; k < 6; k++) disc(s, cx + k * 9 - 24, cy + (k % 2) * 3, 8);
    }
    const [far, f] = canvas(LAYER_W, VIEW_H);
    f.fillStyle = tone.hills[0];
    for (let x = 0; x < LAYER_W; x += 90 + Math.floor(r() * 60)) {
      const w = 30 + Math.floor(r() * 50);
      for (let i = 0; i < w; i++) {
        const h = Math.round(Math.sin((i / w) * Math.PI) * (6 + r() * 2));
        f.fillRect(x + i, 112 - h, 1, h);
      }
    }
    f.fillStyle = tone.hills[2];
    f.fillRect(0, 112, LAYER_W, VIEW_H - 112);
    layers.push({ canvas: far, factor: 0.06, yf: 0.04 });
    const [mid, m] = canvas(LAYER_W, VIEW_H);
    for (let y = 120; y < VIEW_H; y += 7) {
      m.fillStyle = (y / 7) % 2 === 0 ? 'rgba(132,184,176,0.35)' : 'rgba(47,59,85,0.35)';
      for (let x = 0; x < LAYER_W; x += 2) m.fillRect(x, y + Math.round(Math.sin(x / 11 + y) * 2), 2, 2);
    }
    layers.push({ canvas: mid, factor: 0.2, yf: 0.1 });
    return { sky, layers };
  }

  if (kind === 'mill') {
    const [far, f] = canvas(LAYER_W, VIEW_H);
    // Plank wall with cross beams, seen through the dust of the mill.
    for (let x = 0; x < LAYER_W; x += 6) {
      f.fillStyle = (x / 6) % 2 === 0 ? tone.hills[0] : tone.hills[1];
      f.fillRect(x, 0, 6, VIEW_H);
    }
    f.fillStyle = tone.hills[2];
    for (let y = 30; y < VIEW_H; y += 56) f.fillRect(0, y, LAYER_W, 5);
    for (let x = 40; x < LAYER_W; x += 160) {
      f.fillStyle = 'rgba(215,228,220,0.18)';
      f.fillRect(x, 60, 18, 26);
    }
    layers.push({ canvas: far, factor: 0.15, yf: 0.1 });
    const [mid, m] = canvas(LAYER_W, VIEW_H);
    m.fillStyle = tone.hills[2];
    for (let x = 0; x < LAYER_W; x += 120) {
      m.fillRect(x + 20, 0, 10, VIEW_H);
      m.fillRect(x, 12, 60, 6);
    }
    layers.push({ canvas: mid, factor: 0.35, yf: 0.2 });
    return { sky, layers };
  }

  if (kind === 'mine') {
    const [far, f] = canvas(LAYER_W, VIEW_H);
    // Jagged cave walls with far-off lamps.
    f.fillStyle = tone.hills[0];
    for (let x = 0; x < LAYER_W; x++) {
      const top = Math.round(30 + Math.sin(x / 23) * 10 + Math.sin(x / 7) * 3);
      const bot = Math.round(140 + Math.sin(x / 31 + 1) * 12 + Math.sin(x / 9) * 3);
      f.fillRect(x, 0, 1, top);
      f.fillRect(x, bot, 1, VIEW_H - bot);
    }
    for (let i = 0; i < 9; i++) {
      const x = Math.floor(r() * LAYER_W);
      const y = 70 + Math.floor(r() * 50);
      f.fillStyle = 'rgba(240,210,122,0.25)';
      disc(f, x, y, 3);
      f.fillStyle = '#f0d27a';
      f.fillRect(x, y, 1, 1);
    }
    layers.push({ canvas: far, factor: 0.12, yf: 0.08 });
    const [mid, m] = canvas(LAYER_W, VIEW_H);
    m.fillStyle = tone.hills[1];
    for (let x = 0; x < LAYER_W; x += 96) {
      // Timber frames receding into the dark.
      m.fillRect(x + 8, 20, 6, VIEW_H - 20);
      m.fillRect(x + 62, 20, 6, VIEW_H - 20);
      m.fillRect(x + 2, 16, 72, 6);
    }
    layers.push({ canvas: mid, factor: 0.32, yf: 0.18 });
    return { sky, layers };
  }

  if (kind === 'crypt') {
    // Dust specks in the dark.
    s.fillStyle = 'rgba(243,230,200,0.06)';
    for (let i = 0; i < 40; i++) s.fillRect(Math.floor(r() * VIEW_W), Math.floor(r() * VIEW_H), 1, 1);
    const [far, f] = canvas(LAYER_W, VIEW_H);
    f.fillStyle = tone.hills[0];
    for (let x = 0; x < LAYER_W; x += 80) {
      // Gothic arch windows.
      f.fillRect(x + 20, 40, 40, 120);
      f.clearRect(x + 28, 56, 24, 70);
      for (let y = -12; y <= 0; y++) {
        const half = Math.round(Math.sqrt(144 - y * y));
        f.fillRect(x + 40 - half, 56 + y, half * 2, 1);
      }
      f.fillStyle = 'rgba(169,198,207,0.12)';
      f.fillRect(x + 28, 56, 24, 70);
      f.fillStyle = tone.hills[0];
    }
    layers.push({ canvas: far, factor: 0.15, yf: 0.1 });
    const [mid, m] = canvas(LAYER_W, VIEW_H);
    m.fillStyle = tone.hills[1];
    for (let x = 0; x < LAYER_W; x += 128) {
      m.fillRect(x + 10, 0, 18, VIEW_H);
      m.fillRect(x + 6, 0, 26, 8);
      m.fillRect(x + 6, VIEW_H - 30, 26, 30);
    }
    layers.push({ canvas: mid, factor: 0.35, yf: 0.2 });
    return { sky, layers };
  }

  // Outdoor & forest: soft sun and clouds.
  s.globalAlpha = 0.5;
  s.fillStyle = '#fbe8c2';
  disc(s, VIEW_W * 0.72, 46, 16);
  s.globalAlpha = 0.25;
  disc(s, VIEW_W * 0.72, 46, 24);
  s.globalAlpha = 0.35;
  s.fillStyle = '#ffffff';
  for (let i = 0; i < 5; i++) {
    const cx = Math.round(r() * VIEW_W);
    const cy = Math.round(14 + r() * 40);
    for (let k = 0; k < 5; k++) s.fillRect(Math.round(cx + k * 6 - 12), Math.round(cy - (k % 2) * 2), 16, 4);
  }
  s.globalAlpha = 1;

  const [far, f] = canvas(LAYER_W, VIEW_H);
  hills(f, 118, 34, tone.hills[0], 7);
  layers.push({ canvas: far, factor: 0.08, yf: 0.05 });

  const [mid, m] = canvas(LAYER_W, VIEW_H);
  const dense = kind === 'forest';
  for (let x = 0; x < LAYER_W; x += dense ? 7 : 11) {
    const h = 20 + r() * (dense ? 34 : 24);
    spruce(m, Math.round(x + r() * 6), 138, Math.round(h), tone.hills[1]);
  }
  m.fillStyle = tone.hills[1];
  m.fillRect(0, 138, LAYER_W, VIEW_H - 138);
  layers.push({ canvas: mid, factor: 0.25, yf: 0.12 });

  const [near, n] = canvas(LAYER_W, VIEW_H);
  if (dense) {
    for (let x = 0; x < LAYER_W; x += 16) spruce(n, Math.round(x + r() * 10), 160, Math.round(40 + r() * 40), tone.hills[2]);
  } else {
    // Birch trunks and meadow.
    for (let x = 0; x < LAYER_W; x += 60 + Math.floor(r() * 40)) {
      n.fillStyle = '#e8e0cc';
      n.fillRect(x, 96, 3, 64);
      n.fillStyle = tone.hills[2];
      disc(n, x + 1, 92, 12);
      disc(n, x - 6, 100, 8);
      disc(n, x + 8, 101, 8);
    }
  }
  n.fillStyle = tone.hills[2];
  hills(n, 162, 8, tone.hills[2], 3);
  layers.push({ canvas: near, factor: 0.5, yf: 0.25 });
  return { sky, layers };
}

export function drawBackdrop(ctx: CanvasRenderingContext2D, kind: Backdrop, toneId: string, camX: number, camY: number): void {
  if (kind === 'none') return;
  const key = `${kind}:${toneId}`;
  let b = cache.get(key);
  if (!b) {
    b = build(kind, toneId);
    cache.set(key, b);
  }
  ctx.drawImage(b.sky, 0, 0);
  for (const l of b.layers) {
    const ox = -Math.floor((camX * l.factor) % LAYER_W);
    const oy = -Math.round(camY * l.yf);
    ctx.drawImage(l.canvas, ox, oy);
    if (ox + LAYER_W < VIEW_W) ctx.drawImage(l.canvas, ox + LAYER_W, oy);
  }
}
