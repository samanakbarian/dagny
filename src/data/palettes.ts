/**
 * Master palette (~32 colours) – warm, slightly faded tones like an old
 * colour photograph from the sixties. There is deliberately no pure black.
 *
 * Every sprite grid in src/art uses these single-character keys.
 * '.' (and ' ') always means transparent.
 */
export const PALETTE: Readonly<Record<string, string>> = {
  k: '#2b2233', // darkest ink (plum brown – our "black")
  K: '#3d3140',
  g: '#5b5160',
  G: '#8a8088',
  w: '#c9bba5',
  W: '#f3e6c8', // cream white
  r: '#a8442f', // falu red
  R: '#cf6a4c',
  d: '#6e2c2a',
  o: '#d98a3d',
  y: '#d6a046', // mustard
  Y: '#f0d27a',
  b: '#5a3d2b',
  B: '#8a5f3c',
  t: '#c39a6b',
  s: '#e8b796', // skin
  S: '#c98a6e',
  m: '#3f5a3a', // moss dark
  M: '#5f7f45', // moss
  l: '#93a95a',
  e: '#c4c98c',
  u: '#3f5f7a',
  U: '#6f93ad', // sky blue
  c: '#a9c6cf',
  C: '#d7e4dc',
  n: '#2f3b55',
  p: '#6b4a6e',
  P: '#a07fa0',
  i: '#e0a0a0',
  v: '#4f8a8b',
  V: '#84b8b0',
  h: '#b5703a', // Dagny's copper hair
};

export type PaletteKey = keyof typeof PALETTE;

export function color(key: string): string {
  const c = PALETTE[key];
  if (!c) throw new Error(`Okänd palettfärg: ${key}`);
  return c;
}

/**
 * Tone filters: each area gets its own photographic mood. They are applied as
 * a full-screen overlay after the scene is drawn (cheap at 320×180).
 */
export interface ToneFilter {
  /** Overlay colour (any CSS colour). */
  tint: string;
  /** Overlay strength 0–1. */
  alpha: number;
  /** Canvas composite operation used for the tint. */
  mode: GlobalCompositeOperation;
  /** Extra warm "faded photo" wash on top, 0–1. */
  fade: number;
  /** Vignette strength 0–1. */
  vignette: number;
  /** Sky gradient (top → bottom) for side views. */
  sky: [string, string, string];
  /** Colours of the parallax silhouettes, far → near. */
  hills: [string, string, string];
}

export const TONES: Readonly<Record<string, ToneFilter>> = {
  /** Golden summer evening – the default village mood. */
  sommarkvall: {
    tint: '#f0b060', alpha: 0.16, mode: 'soft-light', fade: 0.06, vignette: 0.35,
    sky: ['#e9b47a', '#f1cf98', '#f6e2b8'],
    hills: ['#c9a58f', '#8f8a6a', '#5f7f45'],
  },
  /** Rainy grey August. */
  gra_augusti: {
    tint: '#7d8a95', alpha: 0.22, mode: 'multiply', fade: 0.04, vignette: 0.4,
    sky: ['#8a9399', '#a7aeae', '#c4c6bd'],
    hills: ['#8a8f8c', '#6c7466', '#4d5c45'],
  },
  /** The midnight sun – pale, pink and blue. */
  midnattssol: {
    tint: '#e6a6b0', alpha: 0.14, mode: 'soft-light', fade: 0.07, vignette: 0.3,
    sky: ['#7f8fb5', '#d3a4b3', '#f4d6b0'],
    hills: ['#9b8aa6', '#6d6f88', '#475a55'],
  },
  /** Lantern light – deep night with warm pools. */
  lyktsken: {
    tint: '#2f3b55', alpha: 0.35, mode: 'multiply', fade: 0.03, vignette: 0.55,
    sky: ['#232a40', '#2f3b55', '#4a4560'],
    hills: ['#3b3f58', '#2f3747', '#253030'],
  },
  /** The crypt under the stone church. */
  krypta: {
    tint: '#8a6f9a', alpha: 0.2, mode: 'multiply', fade: 0.03, vignette: 0.6,
    sky: ['#2b2233', '#3d3140', '#4a3c4a'],
    hills: ['#4a3f4d', '#3d3140', '#33293a'],
  },
  /** The old mine – amber lamplight on wet rock. */
  gruva: {
    tint: '#c08a50', alpha: 0.22, mode: 'multiply', fade: 0.02, vignette: 0.6,
    sky: ['#1f1a24', '#2b2233', '#3a2f36'],
    hills: ['#3a3038', '#30282f', '#262027'],
  },
  /** Inside the mill – dusty brown light through small windows. */
  kvarn: {
    tint: '#b08a60', alpha: 0.18, mode: 'soft-light', fade: 0.05, vignette: 0.5,
    sky: ['#2f2620', '#3a2e26', '#45372d'],
    hills: ['#4a3a30', '#41332b', '#2f2620'],
  },
  /** Overworld map – soft daylight. */
  karta: {
    tint: '#f0c890', alpha: 0.1, mode: 'soft-light', fade: 0.05, vignette: 0.25,
    sky: ['#a9c6cf', '#d7e4dc', '#f3e6c8'],
    hills: ['#a9b5a0', '#7f8f6a', '#5f7f45'],
  },
  /** Sunrise on midsummer morning – the light comes back. */
  soluppgang: {
    tint: '#ffd38a', alpha: 0.18, mode: 'soft-light', fade: 0.08, vignette: 0.2,
    sky: ['#f2a07a', '#f6c98e', '#fbe8c2'],
    hills: ['#d4a28c', '#a08a6a', '#6f8a4f'],
  },
};

export type ToneId = keyof typeof TONES;
