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
    left: { to: 'overworld', ow: { x: 61, y: 18 } },
    right: { to: 'stollen_2', entry: 'A' },
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

  /**
   * Gamla stollen, the deep part: where the roof came down in 1931. It comes
   * down again behind Dagny – run.
   */
  stollen_2: {
    id: 'stollen_2',
    name: 'Rasgången',
    kind: 'path',
    tone: 'gruva',
    music: 'grotta',
    backdrop: 'mine',
    theme: 'mine',
    dark: true,
    ambience: ['dust'],
    showName: true,
    signs: { I: 'stollen_ras_skylt' },
    cavein: { at: 6, speed: 1.15, flag: 'stollen_rasat' },
    left: { to: 'stollen', entry: 'E' },
    right: { to: 'overworld', ow: { x: 64, y: 18 } },
    // A side gallery off the cave-in: Hulda's old pocket, and a way out by the mine.
    doors: { U: { to: 'stollen_gomd', entry: 'A' } },
    tiles: [
      "########################################################################",
      "########################################################################",
      "########################################################################",
      "########################################################################",
      "......................................########..........................",
      "..........................f...........########..........................",
      "................................................f.......................",
      "................................................................##......",
      "..............##..............##..........................##....##......",
      "..A.I.........##..............##..g.........U.............##....##...E..",
      "######################^^###########################^^###################",
      "########################################################################",
    ],
    deco: [
      "........................................................................",
      "........................................................................",
      "........................................................................",
      "........................................................................",
      "rrrrrOrrrrrrrrrrOrrrrrrrrrrOrrrrrrrrrr........rrrOrrrrrrrrrrOrrrrrrrrrrO",
      "|rrrrrrrrrr|rrrrrrrrrr|rrrrrrrrrr|rrrr........rrrrrrrrr|rrrrrrrrrr|rrrrr",
      "|rrrrrrrrrr|rrrrrrrrrr|rrrrrrrrrr|rrrrrrrrrr|rrrrrrrrrr|rrrrrrrrrr|rrrrr",
      "|rrrrrrrrrr|rrrrrrrrrr|rrrrrrrrrr|rrrrrrrrr...rrrrrrrrr|rrrrrrrr..|rrrrr",
      "|rrrrrrrrrr|rr..rrrrrr|rrrrrrr..r|rrrrrrrrr...rrrrrrrrr|rr..rrrr..|rrrrr",
      "|rrrrrrrrrr|rr..rrrrrr|rrrrrrr..r|rrrrrrrrr...rrrrrrrrr|rr..rrrr..|rrrrr",
      "........................................................................",
      "........................................................................",
    ],
  },

  /**
   * The side gallery: where Hulda, the Väktare before Dagmar, brought her
   * daughter to listen to the fell. Comes out by the caved-in adit above the
   * old mine – a way back to Gruvsamhället.
   */
  stollen_gomd: {
    id: 'stollen_gomd',
    name: 'Sidoorten',
    kind: 'path',
    tone: 'gruva',
    music: 'grotta',
    backdrop: 'mine',
    theme: 'mine',
    dark: true,
    darkness: 0.85,
    ambience: ['dust'],
    showName: true,
    signs: { I: 'stollen_gomd_ristning' },
    left: { to: 'stollen_2', entry: 'U' },
    right: { to: 'overworld', ow: { x: 58, y: 15 } },
    tiles: [
      "##################################",
      "##################################",
      "##################################",
      "##########.....##########.........",
      "##########..T..##########.........",
      "...........===..........f.........",
      "..................................",
      "........===..........===..........",
      "..................................",
      "..A....I.......b.........u.....E..",
      "##################################",
      "##################################",
    ],
  },
};
