/**
 * Pure collision helpers: AABB overlap and tilemap movement with solid and
 * one-way tiles. No DOM, no allocation in the hot path.
 */
export const TILE = 16;

export const Kind = {
  Empty: 0,
  Solid: 1,
  /** Can be stood on from above and jumped through from below. */
  OneWay: 2,
  /** Hurts (spikes, deep water, nettles). Not solid. */
  Hazard: 3,
} as const;
export type TileKind = (typeof Kind)[keyof typeof Kind];

export interface TileGrid {
  /** Width / height in tiles. */
  w: number;
  h: number;
  /** Collision kind for every cell (row-major). */
  kinds: Uint8Array;
  /** When true, the left and right map edges behave as walls. */
  wallLeft: boolean;
  wallRight: boolean;
}

export interface Body {
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  vy: number;
  onGround: boolean;
}

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export function overlaps(a: Rect, b: Rect): boolean {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

export function kindAt(grid: TileGrid, tx: number, ty: number): TileKind {
  if (tx < 0) return grid.wallLeft ? Kind.Solid : Kind.Empty;
  if (tx >= grid.w) return grid.wallRight ? Kind.Solid : Kind.Empty;
  if (ty < 0 || ty >= grid.h) return Kind.Empty;
  return grid.kinds[ty * grid.w + tx] as TileKind;
}

export function isSolidAt(grid: TileGrid, px: number, py: number): boolean {
  return kindAt(grid, Math.floor(px / TILE), Math.floor(py / TILE)) === Kind.Solid;
}

export interface MoveResult {
  hitWall: boolean;
  hitCeiling: boolean;
  landed: boolean;
}

const result: MoveResult = { hitWall: false, hitCeiling: false, landed: false };
const EPS = 0.001;

/**
 * Moves a body by its velocity (pixels per step) and resolves collisions,
 * X first, then Y. `dropThrough` lets the body fall through one-way tiles.
 * The returned object is reused between calls – copy it if you keep it.
 */
export function moveBody(grid: TileGrid, b: Body, dropThrough = false): MoveResult {
  result.hitWall = false;
  result.hitCeiling = false;
  result.landed = false;

  // --- X axis ---
  if (b.vx !== 0) {
    let nx = b.x + b.vx;
    const top = Math.floor(b.y / TILE);
    const bottom = Math.floor((b.y + b.h - EPS) / TILE);
    if (b.vx > 0) {
      const tx = Math.floor((nx + b.w - EPS) / TILE);
      for (let ty = top; ty <= bottom; ty++) {
        if (kindAt(grid, tx, ty) === Kind.Solid) {
          nx = tx * TILE - b.w;
          result.hitWall = true;
          break;
        }
      }
    } else {
      const tx = Math.floor(nx / TILE);
      for (let ty = top; ty <= bottom; ty++) {
        if (kindAt(grid, tx, ty) === Kind.Solid) {
          nx = (tx + 1) * TILE;
          result.hitWall = true;
          break;
        }
      }
    }
    b.x = nx;
    if (result.hitWall) b.vx = 0;
  }

  // --- Y axis ---
  const wasOnGround = b.onGround;
  b.onGround = false;
  let ny = b.y + b.vy;
  const left = Math.floor(b.x / TILE);
  const right = Math.floor((b.x + b.w - EPS) / TILE);
  if (b.vy > 0) {
    const prevBottom = b.y + b.h;
    const ty = Math.floor((ny + b.h - EPS) / TILE);
    for (let tx = left; tx <= right; tx++) {
      const k = kindAt(grid, tx, ty);
      const tileTop = ty * TILE;
      if (k === Kind.Solid || (k === Kind.OneWay && !dropThrough && prevBottom <= tileTop + EPS)) {
        ny = tileTop - b.h;
        b.vy = 0;
        b.onGround = true;
        result.landed = !wasOnGround;
        break;
      }
    }
  } else if (b.vy < 0) {
    const ty = Math.floor(ny / TILE);
    for (let tx = left; tx <= right; tx++) {
      if (kindAt(grid, tx, ty) === Kind.Solid) {
        ny = (ty + 1) * TILE;
        b.vy = 0;
        result.hitCeiling = true;
        break;
      }
    }
  }
  b.y = ny;

  // Standing still on the ground: probe one pixel below so onGround stays true.
  if (!b.onGround && b.vy === 0) {
    b.onGround = groundBelow(grid, b, dropThrough);
  }
  return result;
}

/**
 * Pushes a body sideways by dx (wind, conveyor), stopping at walls.
 * Does not touch vertical state. Returns true if a wall stopped it.
 */
export function pushX(grid: TileGrid, b: Rect, dx: number): boolean {
  // Step at most 8 px at a time so a strong push never tunnels through a wall.
  let left = dx;
  while (left !== 0) {
    const step = Math.max(-8, Math.min(8, left));
    left -= step;
    if (pushStep(grid, b, step)) return true;
  }
  return false;
}

function pushStep(grid: TileGrid, b: Rect, dx: number): boolean {
  const top = Math.floor(b.y / TILE);
  const bottom = Math.floor((b.y + b.h - EPS) / TILE);
  const nx = b.x + dx;
  if (dx > 0) {
    const tx = Math.floor((nx + b.w - EPS) / TILE);
    for (let ty = top; ty <= bottom; ty++) {
      if (kindAt(grid, tx, ty) === Kind.Solid) {
        b.x = tx * TILE - b.w;
        return true;
      }
    }
  } else {
    const tx = Math.floor(nx / TILE);
    for (let ty = top; ty <= bottom; ty++) {
      if (kindAt(grid, tx, ty) === Kind.Solid) {
        b.x = (tx + 1) * TILE;
        return true;
      }
    }
  }
  b.x = nx;
  return false;
}

/** True if there is something to stand on directly below the body. */
export function groundBelow(grid: TileGrid, b: Rect, dropThrough = false): boolean {
  const footY = b.y + b.h;
  const ty = Math.floor((footY + 0.5) / TILE);
  if (Math.abs(ty * TILE - footY) > 0.5) return false;
  const left = Math.floor(b.x / TILE);
  const right = Math.floor((b.x + b.w - EPS) / TILE);
  for (let tx = left; tx <= right; tx++) {
    const k = kindAt(grid, tx, ty);
    if (k === Kind.Solid || (k === Kind.OneWay && !dropThrough)) return true;
  }
  return false;
}

/** True if any tile overlapped by the rect is of the given kind. */
export function touchesKind(grid: TileGrid, r: Rect, kind: TileKind): boolean {
  const x0 = Math.floor(r.x / TILE);
  const x1 = Math.floor((r.x + r.w - EPS) / TILE);
  const y0 = Math.floor(r.y / TILE);
  const y1 = Math.floor((r.y + r.h - EPS) / TILE);
  for (let ty = y0; ty <= y1; ty++) for (let tx = x0; tx <= x1; tx++) if (kindAt(grid, tx, ty) === kind) return true;
  return false;
}

/** True if a rectangle at this position would overlap a solid tile. */
export function rectHitsSolid(grid: TileGrid, r: Rect): boolean {
  return touchesKind(grid, r, Kind.Solid);
}
