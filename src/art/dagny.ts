import type { SpriteDef } from '../engine/sprites';

/**
 * Dagny – 16×24, facing right. Frames are composed from parts so that
 * breathing, walking and ducking share the same head and torso.
 *
 * h/B hair & braid, s/S skin, k eyes, y scarf, M/m moss-green jacket,
 * b trousers & belt, K boots.
 */
const head = [
  '......hhhh......',
  '.....hhhhhh.....',
  '....hhhhhhhh....',
  '...hhhhhsssss...',
  '..BhhhhssskSs...',
  '..BhhhhsssssS...',
  '..Bhhhh.sss.....',
  '..BBhh..ss......',
];

const headBlink = [
  '......hhhh......',
  '.....hhhhhh.....',
  '....hhhhhhhh....',
  '...hhhhhsssss...',
  '..BhhhhsssSSs...',
  '..BhhhhsssssS...',
  '..Bhhhh.sss.....',
  '..BBhh..ss......',
];

const torso = [
  '..BB.yyyyyy.....',
  '...B.MMMMMMM....',
  '....MMmMMMMM....',
  '....MMmMMMMM....',
  '....MMmMMMMs....',
  '....bbbbbbbb....',
  '....MMMMMMMM....',
  '....MmMMMMmM....',
];

const torsoAttack = [
  '..BB.yyyyyy.....',
  '...B.MMMMMMM....',
  '....MMMMMMMMMMss',
  '....MMmMMMM..Mss',
  '....MMmMMMM.....',
  '....bbbbbbbb....',
  '....MMMMMMMM....',
  '....MmMMMMmM....',
];

const torsoUp = [
  '..BB.yyyyyyss...',
  '...B.MMMMMMMM...',
  '....MMmMMMMMM...',
  '....MMmMMMM.....',
  '....MMmMMMM.....',
  '....bbbbbbbb....',
  '....MMMMMMMM....',
  '....MmMMMMmM....',
];

const torsoHurt = [
  '..BB.yyyyyy.....',
  '..sMMMMMMMMMs...',
  '...MMMmMMMMMM...',
  '....MMmMMMMM....',
  '....MMmMMMMM....',
  '....bbbbbbbb....',
  '....MMMMMMMM....',
  '....MmMMMMmM....',
];

const legsStand = [
  '.....bbbbbb.....',
  '.....bb..bb.....',
  '.....bb..bb.....',
  '.....bb..bb.....',
  '.....bb..bb.....',
  '.....KK..KK.....',
  '.....KK..KKK....',
  '....KKK..KKK....',
];

const legsWalk0 = [
  '.....bbbbbb.....',
  '....bbb..bb.....',
  '....bb....bb....',
  '...bb.....bb....',
  '...bb......bb...',
  '..KK.......KK...',
  '..KK.......KKK..',
  '.KKK........KK..',
];

const legsWalk1 = [
  '.....bbbbbb.....',
  '......bbbb......',
  '......bbbb......',
  '......bb.bb.....',
  '......bb.bb.....',
  '......KK.KK.....',
  '......KK.KKK....',
  '.....KKK.KKK....',
];

const legsWalk2 = [
  '.....bbbbbb.....',
  '.....bb..bbb....',
  '....bb....bb....',
  '....bb.....bb...',
  '...bb......bb...',
  '...KK.......KK..',
  '..KKK.......KKK.',
  '..KK.........KK.',
];

const legsJump = [
  '.....bbbbbb.....',
  '.....bbbbbbb....',
  '......bb..bbb...',
  '......bb...KK...',
  '.....KKK...KKK..',
];

const torsoDuck = [
  '..BB.yyyyyy.....',
  '...B.MMMMMMM....',
  '....MMmMMMMs....',
  '....bbbbbbbb....',
  '....MMMMMMMM....',
];

const torsoDuckAttack = [
  '..BB.yyyyyy.....',
  '...B.MMMMMMMMMss',
  '....MMmMMMM..Mss',
  '....bbbbbbbb....',
  '....MMMMMMMM....',
];

const legsDuck = [
  '...bbbbbbbbb....',
  '..bb......bbb...',
  '..KKK.....bKK...',
];

const legsStab = [
  '.....bbbbbb.....',
  '......bbbb......',
  '......bb.bb.....',
  '......KK.KK.....',
  '.....KKK.KKK....',
];

/** Frame indices into the Dagny sheet. */
export const DAGNY_FRAMES = {
  idle: 0,
  breathe: 1,
  walk0: 2,
  walk1: 3,
  walk2: 4,
  jump: 5,
  duck: 6,
  attack: 7,
  duckAttack: 8,
  up: 9,
  hurt: 10,
  downStab: 11,
  blink: 12,
} as const;

export const dagnySprites: Record<string, SpriteDef> = {
  dagny: {
    w: 16,
    h: 24,
    outline: 'k',
    parts: {
      head, headBlink, torso, torsoAttack, torsoUp, torsoHurt,
      legsStand, legsWalk0, legsWalk1, legsWalk2, legsJump,
      torsoDuck, torsoDuckAttack, legsDuck, legsStab,
    },
    frames: [
      { parts: [['legsStand', 0, 16], ['torso', 0, 8], ['head', 0, 0]] },
      { parts: [['legsStand', 0, 16], ['torso', 0, 8], ['head', 0, 1]] },
      { parts: [['legsWalk0', 0, 16], ['torso', 0, 8], ['head', 0, 0]] },
      { parts: [['legsWalk1', 0, 15], ['torso', 0, 7], ['head', 0, -1]] },
      { parts: [['legsWalk2', 0, 16], ['torso', 0, 8], ['head', 0, 0]] },
      { parts: [['legsJump', 0, 15], ['torso', 0, 7], ['head', 0, -1]] },
      { parts: [['legsDuck', 0, 21], ['torsoDuck', 0, 16], ['head', 0, 8]] },
      { parts: [['legsStand', 0, 16], ['torsoAttack', 0, 8], ['head', 0, 0]] },
      { parts: [['legsDuck', 0, 21], ['torsoDuckAttack', 0, 16], ['head', 0, 8]] },
      { parts: [['legsStand', 0, 16], ['torsoUp', 0, 8], ['head', 0, 0]] },
      { parts: [['legsJump', 0, 15], ['torsoHurt', 0, 7], ['head', -1, -1]] },
      { parts: [['legsStab', 0, 17], ['torso', 0, 8], ['head', 0, 0]] },
      { parts: [['legsStand', 0, 16], ['torso', 0, 8], ['headBlink', 0, 0]] },
    ],
  },

  /** Round wooden shield with a falu-red rim, carried in front. */
  shield: {
    w: 6,
    h: 9,
    outline: 'k',
    frames: [
      [
        '.rrr..',
        'rtttr.',
        'rtBtr.',
        'rtytr.',
        'rtBtr.',
        'rtttr.',
        '.rrr..',
      ],
    ],
  },

  /** The old blade with the church-bell clapper as hilt. Points right. */
  sword: {
    w: 14,
    h: 5,
    outline: 'k',
    frames: [
      [
        '..............',
        'yB...........',
        'yBBwwwwwwwwWW.',
        'yB...........',
        '..............',
      ],
    ],
  },

  /** Vertical blade for the up and down thrusts (points up, flip in code). */
  swordUp: {
    w: 5,
    h: 14,
    outline: 'k',
    frames: [
      [
        '.....',
        '..W..',
        '..W..',
        '..w..',
        '..w..',
        '..w..',
        '..w..',
        '..w..',
        '..w..',
        '..w..',
        '.BBB.',
        '..y..',
        '..y..',
        '.....',
      ],
    ],
  },

  swordDown: {
    w: 5,
    h: 14,
    outline: 'k',
    frames: [
      [
        '.....',
        '..y..',
        '..y..',
        '.BBB.',
        '..w..',
        '..w..',
        '..w..',
        '..w..',
        '..w..',
        '..w..',
        '..w..',
        '..W..',
        '..W..',
        '.....',
      ],
    ],
  },

  /** Hamn: Dagny as a little bird. 10×8, two flaps. */
  bird: {
    w: 10,
    h: 8,
    outline: 'k',
    frames: [
      [
        '..........',
        '...hh.....',
        '..hhhhhk..',
        '.hhhhhhhyy',
        '..hhhhhh..',
        '...BB.....',
        '..........',
        '..........',
      ],
      [
        '..........',
        '..........',
        '..hhhhhk..',
        '.hhhhhhhyy',
        '..hhhhhh..',
        '..hhhB....',
        '..hh......',
        '..........',
      ],
    ],
  },

  /** Overworld Dagny, 16×16 top-down. down0 down1 up0 up1 side0 side1 */
  owDagny: {
    w: 16,
    h: 16,
    outline: 'k',
    frames: [
      [
        '......hhhh......',
        '.....hhhhhh.....',
        '.....hsssssh....',
        '.....skssks.....',
        '......ssss......',
        '.....yyyyyy.....',
        '....MMMMMMMM....',
        '....sMMMMMMs....',
        '.....bbbbbb.....',
        '.....MMMMMM.....',
        '.....bb..bb.....',
        '.....bb..KK.....',
        '.....KK.........',
        '................',
        '................',
        '................',
      ],
      [
        '......hhhh......',
        '.....hhhhhh.....',
        '.....hsssssh....',
        '.....skssks.....',
        '......ssss......',
        '.....yyyyyy.....',
        '....MMMMMMMM....',
        '....sMMMMMMs....',
        '.....bbbbbb.....',
        '.....MMMMMM.....',
        '.....bb..bb.....',
        '.....KK..bb.....',
        '.........KK.....',
        '................',
        '................',
        '................',
      ],
      [
        '......hhhh......',
        '.....hhhhhh.....',
        '.....hhhhhh.....',
        '.....hhhhhh.....',
        '......hBBh......',
        '.....yyBByy.....',
        '....MMMMMMMM....',
        '....sMMMMMMs....',
        '.....bbbbbb.....',
        '.....MMMMMM.....',
        '.....bb..bb.....',
        '.....bb..KK.....',
        '.....KK.........',
        '................',
        '................',
        '................',
      ],
      [
        '......hhhh......',
        '.....hhhhhh.....',
        '.....hhhhhh.....',
        '.....hhhhhh.....',
        '......hBBh......',
        '.....yyBByy.....',
        '....MMMMMMMM....',
        '....sMMMMMMs....',
        '.....bbbbbb.....',
        '.....MMMMMM.....',
        '.....bb..bb.....',
        '.....KK..bb.....',
        '.........KK.....',
        '................',
        '................',
        '................',
      ],
      [
        '......hhhh......',
        '.....hhhhhh.....',
        '....hhhhssss....',
        '....Bhhhsks.....',
        '....B..sss......',
        '......yyyy......',
        '.....MMMMMM.....',
        '.....MMMMMs.....',
        '.....bbbbbb.....',
        '.....MMMMMM.....',
        '.....bb.bb......',
        '....KK...bb.....',
        '.........KK.....',
        '................',
        '................',
        '................',
      ],
      [
        '......hhhh......',
        '.....hhhhhh.....',
        '....hhhhssss....',
        '....Bhhhsks.....',
        '....B..sss......',
        '......yyyy......',
        '.....MMMMMM.....',
        '.....MMMMMs.....',
        '.....bbbbbb.....',
        '.....MMMMMM.....',
        '......bbb.......',
        '......bKK.......',
        '......KK........',
        '................',
        '................',
        '................',
      ],
    ],
  },

  /** Dagny rowing the eka on the overworld water. */
  owBoat: {
    w: 16,
    h: 16,
    outline: 'k',
    frames: [
      [
        '................',
        '................',
        '......hhhh......',
        '.....hhhhhh.....',
        '.....hsssssh....',
        '.....skssks.....',
        '......ssss......',
        '...t.yyyyyy.t...',
        '....tMMMMMMt....',
        '..BBBBBBBBBBBB..',
        '..BttttttttttB..',
        '...BBBBBBBBBB...',
        '....VVVVVVVV....',
        '................',
        '................',
        '................',
      ],
      [
        '................',
        '................',
        '......hhhh......',
        '.....hhhhhh.....',
        '.....hsssssh....',
        '.....skssks.....',
        '......ssss......',
        '.....yyyyyy.....',
        '..ttsMMMMMMstt..',
        '..BBBBBBBBBBBB..',
        '..BttttttttttB..',
        '...BBBBBBBBBB...',
        '...VV......VV...',
        '................',
        '................',
        '................',
      ],
    ],
  },
};
