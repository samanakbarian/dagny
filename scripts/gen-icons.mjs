// Generates the PWA icons from the sprite data (run: npm run icons).
// Uses Node's built-in TypeScript type stripping to read src/art/dagny.ts.
import { writeFileSync, mkdirSync } from 'node:fs';
import { deflateSync } from 'node:zlib';
import { dagnySprites } from '../src/art/dagny.ts';
import { PALETTE } from '../src/data/palettes.ts';

const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];

function crc32(buf) {
  let c, crc = 0xffffffff;
  for (let n = 0; n < buf.length; n++) {
    c = (crc ^ buf[n]) & 0xff;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    crc = (crc >>> 8) ^ c;
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function png(w, h, rgba) {
  const chunk = (type, data) => {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const td = Buffer.concat([Buffer.from(type), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(td));
    return Buffer.concat([len, td, crc]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) {
    raw[y * (w * 4 + 1)] = 0;
    rgba.copy(raw, y * (w * 4 + 1) + 1, y * w * 4, (y + 1) * w * 4);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// --- Compose the 64×64 logical icon ---
const N = 64;
const px = Array.from({ length: N * N }, () => null);
const set = (x, y, key) => { if (x >= 0 && y >= 0 && x < N && y < N) px[y * N + x] = key; };

function background() {
  const sky = ['#e9b47a', '#f1cf98', '#f6e2b8'];
  const out = [];
  for (let y = 0; y < N; y++) {
    const t = y / (N - 1);
    const a = t < 0.55 ? hex(sky[0]) : hex(sky[1]);
    const b = t < 0.55 ? hex(sky[1]) : hex(sky[2]);
    const k = t < 0.55 ? t / 0.55 : (t - 0.55) / 0.45;
    out.push(a.map((v, i) => Math.round(v + (b[i] - v) * k)));
  }
  return out;
}

const d = dagnySprites.dagny;
const frame = d.frames[0];
const sprite = Array.from({ length: 24 }, () => Array(16).fill(null));
for (const [name, dx, dy] of frame.parts) {
  d.parts[name].forEach((row, y) => [...row].forEach((ch, x) => {
    if (ch !== '.' && y + dy >= 0 && y + dy < 24) sprite[y + dy][x + dx] = ch;
  }));
}
const shield = dagnySprites.shield.frames[0];
shield.forEach((row, y) => [...row].forEach((ch, x) => { if (ch !== '.') sprite[9 + y][11 + x] = ch; }));

function compose(maskable) {
  px.fill(null);
  // Sun.
  const cx = 32, cy = 26, r = maskable ? 15 : 19;
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if ((x - cx) ** 2 + (y - cy) ** 2 <= r * r) set(x, y, 'Y');
  // Hill.
  for (let x = 0; x < N; x++) {
    const top = Math.round(48 + Math.sin(x / 9) * 2);
    for (let y = top; y < N; y++) set(x, y, y === top ? 'M' : 'm');
  }
  // Dagny, scaled ×2 (×1.5 for the maskable safe zone).
  const s = maskable ? 1.5 : 2;
  const ox = Math.round(32 - 8 * s), oy = Math.round((maskable ? 50 : 52) - 24 * s);
  const scaled = new Map();
  for (let y = 0; y < 24; y++) for (let x = 0; x < 16; x++) {
    const ch = sprite[y][x];
    if (!ch) continue;
    for (let yy = Math.floor(y * s); yy < Math.floor((y + 1) * s); yy++)
      for (let xx = Math.floor(x * s); xx < Math.floor((x + 1) * s); xx++) scaled.set(`${xx},${yy}`, ch);
  }
  // Outline.
  for (const key of scaled.keys()) {
    const [x, y] = key.split(',').map(Number);
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (!scaled.has(`${x + dx},${y + dy}`)) set(ox + x + dx, oy + y + dy, 'k');
  }
  for (const [key, ch] of scaled) {
    const [x, y] = key.split(',').map(Number);
    set(ox + x, oy + y, ch);
  }
}

function render(size, maskable) {
  compose(maskable);
  const bg = background();
  const buf = Buffer.alloc(size * size * 4);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const lx = Math.floor((x * N) / size), ly = Math.floor((y * N) / size);
    const key = px[ly * N + lx];
    const c = key ? hex(PALETTE[key]) : bg[ly];
    const i = (y * size + x) * 4;
    buf[i] = c[0]; buf[i + 1] = c[1]; buf[i + 2] = c[2]; buf[i + 3] = 255;
  }
  return png(size, size, buf);
}

mkdirSync('public/icons', { recursive: true });
writeFileSync('public/icons/icon-192.png', render(192, false));
writeFileSync('public/icons/icon-512.png', render(512, false));
writeFileSync('public/icons/icon-maskable-512.png', render(512, true));
writeFileSync('public/icons/apple-touch-icon.png', render(180, false));
console.log('Ikoner skrivna till public/icons/');
