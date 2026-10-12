import type { SpriteDef } from '../engine/sprites';

/** Villagers (16×24, facing right; flipped in code to face Dagny). */

const huldaHead = [
  '......GG........',
  '.....GwwG.......',
  '....wwwwwww.....',
  '...Gwwwssss.....',
  '...GwwsskSs.....',
  '...Gwwsssss.....',
  '....ww.SsS......',
  '.......ss.......',
];
const huldaTop = [
  '.....pppppp.....',
  '....pppppppp....',
  '....pWWWWWpp....',
  '....pWWWWWsp....',
  '....pWWWWWpp....',
  '....pWWWWWpp....',
];
const huldaTopCoffee = [
  '.....ppppppsWW..',
  '....pppppppsWW..',
  '....pWWWWWpp....',
  '....pWWWWWpp....',
  '....pWWWWWpp....',
  '....pWWWWWpp....',
];
const huldaSkirt = [
  '....rWWWWWrr....',
  '....rWWWWWrr....',
  '...rrWWWWWrrr...',
  '...rrWWWWWrrr...',
  '...rrrrrrrrrr...',
  '...rrrrrrrrrr...',
  '...rrrrrrrrrr...',
  '....rrrrrrrr....',
  '.....KK..KK.....',
  '....KKK..KKK....',
];

const manHead = [
  '................',
  '.....nnnnn......',
  '....nnnnnnnnn...',
  '....GsssSss.....',
  '....Gsskss......',
  '....WWsssss.....',
  '....WWWWWW......',
  '.....WWWW.......',
];
const manTop = [
  '.....bWWWb......',
  '....bbbWbbbb....',
  '....bbbWbbbb....',
  '....bbbWbbbs....',
  '....bbbWbbbb....',
];
const manTopWave = [
  '.....bWWWb..ss..',
  '....bbbWbbbbs...',
  '....bbbWbbbb....',
  '....bbbWbbbb....',
  '....bbbWbbbb....',
];
const manLegs = [
  '....nnnnnnnn....',
  '....nnnnnnnn....',
  '....nnn..nnn....',
  '....nnn..nnn....',
  '....nnn..nnn....',
  '....nnn..nnn....',
  '....nnn..nnn....',
  '....nnn..nnn....',
  '....nnn..nnn....',
  '....BBB..BBB....',
  '...BBBB..BBBB...',
];

const womanHead = [
  '......YYYY......',
  '.....YYYYYY.....',
  '....YYYYYYYY....',
  '....YYsssss.....',
  '....YYsskss.....',
  '....YYssssS.....',
  '....YY.sss......',
  '.....Y..s.......',
];
const womanTop = [
  '....rWWWWWr.....',
  '....rrrrrrrr....',
  '....rrrrrrrs....',
  '....rrrrrrrr....',
  '....rrrrrrrr....',
];
const womanTopWave = [
  '....rWWWWWr.ss..',
  '....rrrrrrrrs...',
  '....rrrrrrrr....',
  '....rrrrrrrr....',
  '....rrrrrrrr....',
];
const womanSkirt = [
  '...rrrrrrrrrr...',
  '...rrrrrrrrrr...',
  '...rrrrrrrrrr...',
  '.....ss..ss.....',
  '.....ss..ss.....',
  '.....WW..WW.....',
  '.....WW..WW.....',
  '.....WW..WW.....',
  '.....WW..WW.....',
  '.....KK..KK.....',
  '....KKK..KKK....',
];

const kid = [
  '......UUUU......',
  '.....UUUUUUU....',
  '.....Bsssss.....',
  '.....Bsksss.....',
  '.....Bsssss.....',
  '......sss.......',
  '.....WWWWWW.....',
  '....uuuuuuuu....',
  '....WWWWWWWs....',
  '....uuuuuuuu....',
  '.....bbbbbb.....',
  '.....bb..bb.....',
  '.....ss..ss.....',
  '.....KK..KK.....',
  '....KKK..KKK....',
];

export const npcSprites: Record<string, SpriteDef> = {
  /** Hulda – Dagny's "mormor". Frame 1 drinks coffee. */
  hulda: {
    w: 16,
    h: 24,
    outline: 'k',
    parts: { huldaHead, huldaTop, huldaTopCoffee, huldaSkirt },
    frames: [
      { parts: [['huldaSkirt', 0, 14], ['huldaTop', 0, 8], ['huldaHead', 0, 0]] },
      { parts: [['huldaSkirt', 0, 14], ['huldaTopCoffee', 0, 8], ['huldaHead', 0, 0]] },
      { parts: [['huldaSkirt', 0, 14], ['huldaTop', 0, 8], ['huldaHead', 0, 1]] },
    ],
  },
  /** Old man (elder / mentor). Frame 1 waves. */
  man: {
    w: 16,
    h: 24,
    outline: 'k',
    parts: { manHead, manTop, manTopWave, manLegs },
    frames: [
      { parts: [['manLegs', 0, 13], ['manTop', 0, 8], ['manHead', 0, 0]] },
      { parts: [['manLegs', 0, 13], ['manTopWave', 0, 8], ['manHead', 0, 0]] },
      { parts: [['manLegs', 0, 13], ['manTop', 0, 8], ['manHead', 0, 1]] },
    ],
  },
  /** Variant: the shopkeeper in a grey coat and flat cap. */
  shopkeeper: {
    base: 'man',
    w: 16,
    h: 24,
    frames: [],
    recolor: { b: 'G', n: 'g', W: 'w' },
  },
  woman: {
    w: 16,
    h: 24,
    outline: 'k',
    parts: { womanHead, womanTop, womanTopWave, womanSkirt },
    frames: [
      { parts: [['womanSkirt', 0, 13], ['womanTop', 0, 8], ['womanHead', 0, 0]] },
      { parts: [['womanSkirt', 0, 13], ['womanTopWave', 0, 8], ['womanHead', 0, 0]] },
      { parts: [['womanSkirt', 0, 13], ['womanTop', 0, 8], ['womanHead', 0, 1]] },
    ],
  },
  /** Variant: a woman in a blue summer dress with dark hair. */
  woman2: {
    base: 'woman',
    w: 16,
    h: 24,
    frames: [],
    recolor: { r: 'U', Y: 'b' },
  },
  kid: {
    w: 16,
    h: 24,
    outline: 'k',
    parts: { kid },
    frames: [{ parts: [['kid', 0, 9]] }, { parts: [['kid', 0, 7]] }],
  },
  /** Murre the cat (the side quest). */
  cat: {
    w: 14,
    h: 10,
    outline: 'k',
    frames: [
      [
        '.........g..g.',
        '.........gggg.',
        '.........gYgY.',
        '..g......ggWg.',
        '.g.....gggWW..',
        '.g...gggggWW..',
        '..ggggGgGgg...',
        '...gggggggg...',
        '...gg.g.gg.g..',
      ],
      [
        '.........g..g.',
        '.........gggg.',
        '.g.......gYgY.',
        '.g.......ggWg.',
        '..g....gggWW..',
        '..g..gggggWW..',
        '..ggggGgGgg...',
        '...gggggggg...',
        '...gg.g.gg.g..',
      ],
    ],
  },
};
