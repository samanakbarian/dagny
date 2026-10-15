import type { AreaDef } from '../types';

/**
 * Passages: short side-view stretches that take Dagny from one part of the
 * map to the next, instead of a single tile. Each has its own danger, and a
 * little something to come back for.
 */
export const PASSAGER: Record<string, AreaDef> = {
  /**
   * Gamla stollen: the old adit through the fell between the mine country and
   * the mill valley. Pitch dark – the karbidlampa is what gets Dagny in. A cart
   * over a spike channel, a fallen rock, and a gallery up under the roof where
   * the radio's static gives away a hollow.
   */
  stollen: {
    id: 'stollen',
    name: 'Gamla stollen',
    kind: 'path',
    tone: 'gruva',
    music: 'grotta',
    backdrop: 'mine',
    theme: 'mine',
    dark: true,
    ambience: ['dust'],
    showName: true,
    signs: { I: 'stollen_skylt' },
    left: { to: 'overworld', ow: { x: 59, y: 9 } },
    right: { to: 'overworld', ow: { x: 62, y: 9 } },
    platforms: [{ kind: 'cart', tx: 13, ty: 9, toTx: 27, toTy: 9, mode: 'ride' }],
    tiles: [
      "################################################################",
      "################################################################",
      "#####################################.........?.......##########",
      "#####################################...b.....?...+...##########",
      "......................................################..#####...",
      "....................f...................................#####...",
      "............................................f...................",
      "..............................g...===...........................",
      "..............................##................................",
      "..A.I...u...T.................##.........u...............u...E..",
      "##############^^^^^^^^^^^^^^####################################",
      "################################################################",
    ],
    deco: [
      "................................................................",
      "................................................................",
      "......................................rrrrrrrrrrrrrrrr..........",
      "......................................rrrrrrrrrrrrrrrr..........",
      "rrrOrrrrrrrrOrrrrrrrrOrrrrrrrrOrrrrrrr................rr.....rrr",
      "|rrrrrrrr|rrrrrrrr|rrrrrrrr|rrrrrrrr|rrrrrrrr|rrrrrrrr|r.....rr|",
      "|rrrrrrrr|rrrrrrrr|rrrrrrrr|rrrrrrrr|rrrrrrrr|rrrrrrrr|rrrrrrrr|",
      "|rrrrrrrr|rrrrrrrr|rrrrrrrr|rrrrrrrr|rrrrrrrr|rrrrrrrr|rrrrrrrr|",
      "|rrrrrrrr|rrrrrrrr|rrrrrrrr|rr..rrrr|rrrrrrrr|rrrrrrrr|rrrrrrrr|",
      "|rrrrrrrr|rrrrrrrr|rrrrrrrr|rr..rrrr|rrrrrrrr|rrrrrrrr|rrrrrrrr|",
      "................................................................",
      "................................................................",
    ],
  },
};
