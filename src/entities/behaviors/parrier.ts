import type { Enemy, HitHeight } from '../enemy';
import type { WorldApi } from '../types';
import type { Behavior, Sense } from './types';

/** Tomtenisse-krigare: copies Dagny’s stance and parries strikes at that height, lunging now and then (open while lunging). */
export const parrier: Behavior = {
  update(e: Enemy, world: WorldApi, s: Sense): void {
    const { dx, dist, sp } = s;
    e.facing = dx > 0 ? 1 : -1;
    // Match the player's stance after a short reaction time.
    const want: 'high' | 'low' = world.playerDucking() ? 'low' : 'high';
    if (want !== e.guard) {
      if (++e.guardDelay > 22) {
        e.guard = want;
        e.guardDelay = 0;
      }
    } else e.guardDelay = 0;
    if (e.mode === 2) {
      // Lunge: open guard, vulnerable.
      if (--e.timer <= 0) {
        e.mode = 0;
        e.timer = 70 + ((e.t * 13) % 50);
      }
      e.frame = 2;
    } else {
      e.frame = e.guard === 'high' ? 0 : 1;
      if (e.onGround) {
        if (dist > 30 && dist < 150) e.vx = Math.sign(dx) * sp;
        else if (dist < 22) e.vx = -Math.sign(dx) * sp * 0.6;
        else e.vx *= 0.8;
      }
      if (--e.timer <= 0 && dist < 60) {
        e.mode = 2;
        e.timer = 34;
        e.vx = Math.sign(dx) * 2.2;
      }
    }
    e.fall(world);
  },
  /** Parries strikes at the height it guards, except while lunging. */
  blocks(e: Enemy, height: HitHeight) {
    return e.mode !== 2 && (height === 'high' || height === 'low') && height === e.guard ? { push: 1.2, iframes: 10 } : null;
  },
};
