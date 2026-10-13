/**
 * Dance-floor squares: group '%' is lit on even beats, group '&' on odd beats.
 * Kept pure so it can be tested.
 */
export function beatIndex(frame: number, period: number): number {
  return Math.floor(frame / period);
}

export function squareActive(group: '%' | '&', frame: number, period: number): boolean {
  const even = beatIndex(frame, period) % 2 === 0;
  return group === '%' ? even : !even;
}

/** Steps left until the squares swap. */
export function stepsToSwap(frame: number, period: number): number {
  return period - (frame % period);
}
