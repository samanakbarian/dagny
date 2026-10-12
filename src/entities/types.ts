import type { Rect, TileGrid } from '../engine/collision';
import type { PuffKind } from '../data/types';

/** What entities may ask of the side-view world they live in. */
export interface WorldApi {
  readonly grid: TileGrid;
  readonly frame: number;
  /** Player hitbox centre & state, for AI. */
  playerCenter(): { x: number; y: number };
  playerBox(): Rect;
  playerDucking(): boolean;
  spawnProjectile(p: ProjectileInit): void;
  puff(x: number, y: number, kind: PuffKind): void;
  sparks(x: number, y: number): void;
  sfx(id: string): void;
  shake(frames: number, strength?: number): void;
}

export interface ProjectileInit {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  sprite: string;
  damage: number;
  fromPlayer: boolean;
  /** Frames to live. */
  life: number;
  gravity?: number;
  /** Passes through walls. */
  ghost?: boolean;
}
