import { describe, expect, it } from 'vitest';
import { beatIndex, squareActive, stepsToSwap } from '../src/game/beat';

describe('dance floor beat', () => {
  it('the two groups are never active at the same time', () => {
    for (let f = 0; f < 400; f += 7) {
      expect(squareActive('%', f, 75)).not.toBe(squareActive('&', f, 75));
    }
  });

  it('swaps every period', () => {
    expect(squareActive('%', 0, 75)).toBe(true);
    expect(squareActive('%', 74, 75)).toBe(true);
    expect(squareActive('%', 75, 75)).toBe(false);
    expect(squareActive('&', 75, 75)).toBe(true);
    expect(beatIndex(150, 75)).toBe(2);
  });

  it('counts down to the next swap', () => {
    expect(stepsToSwap(0, 75)).toBe(75);
    expect(stepsToSwap(74, 75)).toBe(1);
  });
});
