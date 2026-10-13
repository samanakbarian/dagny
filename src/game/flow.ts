import { AREAS } from '../data/areas';
import { STR } from '../data/strings';
import { VILLAGES, templeById } from '../data/temples';
import type { Game } from './game';
import { START_LIVES, hpMax, mpMax, newGame, setFlag } from './state';
import { SideScene, type Spawn } from './sidescene';
import { OverworldScene } from './overworld';
import { TitleScene } from './title';
import { CardsScene } from './cards';

/** Scene changes in one place, so scenes don't need to know about each other. */

export function goToArea(game: Game, areaId: string, spawn: Spawn): void {
  game.transition(() => {
    if (game.state) game.state.loc = { area: areaId, x: spawn.x ?? -1, y: spawn.y ?? -1 };
    game.setScene(new SideScene(game, areaId, spawn));
  });
}

export function goToOverworld(game: Game): void {
  game.transition(() => {
    if (game.state) game.state.loc = { area: 'overworld', x: game.state.ow.x, y: game.state.ow.y };
    game.setScene(new OverworldScene(game));
  });
}

/** Resume exactly where the last save was made. */
export function continueGame(game: Game): void {
  const st = game.loadSave();
  if (!st) {
    startNewGame(game);
    return;
  }
  game.state = st;
  const loc = st.loc;
  if (loc.area === 'overworld') {
    st.ow = { x: loc.x, y: loc.y };
    goToOverworld(game);
  } else if (AREAS[loc.area]) {
    goToArea(game, loc.area, loc.x >= 0 ? { x: loc.x, y: loc.y } : {});
  } else {
    goToArea(game, st.lastVillage, { entry: 'H' });
  }
}

export function startNewGame(game: Game): void {
  game.state = newGame();
  game.transition(() => {
    game.setScene(
      new CardsScene(game, STR.intro, 'titel', () => {
        const st = game.state!;
        goToArea(game, 'mormors_by', { x: st.loc.x, y: st.loc.y, facing: 1 });
      }),
    );
  });
}

export function toTitle(game: Game): void {
  game.overlays = [];
  game.transition(() => {
    game.state = null;
    game.setScene(new TitleScene(game));
  });
}

/** After a defeat: wake up in the latest village with full health. XP is kept. */
export function wakeAtVillage(game: Game): void {
  const st = game.state;
  if (!st) return;
  st.hp = hpMax(st);
  st.mp = mpMax(st);
  const v = VILLAGES.find((x) => x.area === st.lastVillage) ?? VILLAGES[0];
  goToArea(game, v.area ?? 'mormors_by', { entry: v.wakeEntry });
}

/**
 * After a defeat in a temple: retry at the last lit candle in this temple,
 * or at the temple's door when no candle there is lit yet.
 */
export function retryCheckpoint(game: Game, temple?: string | null): void {
  const st = game.state;
  if (!st) return;
  const cp = st.checkpoint;
  const inTemple = !!cp && (!temple || AREAS[cp.area]?.temple === temple);
  const entry = temple ? templeById(temple)?.entryArea : null;
  if (!inTemple && !entry) {
    wakeAtVillage(game);
    return;
  }
  st.hp = hpMax(st);
  st.mp = Math.max(st.mp, Math.ceil(mpMax(st) / 2));
  if (inTemple && cp) goToArea(game, cp.area, { x: cp.x, y: cp.y });
  else goToArea(game, entry!, { entry: 'A', facing: 1 });
}

/** The temple whose Game Over starts over at its own foot instead of at Mormor's. */
export const LAST_TEMPLE = 'trollberget';

/**
 * Game Over: every life is spent. Dagny starts over at Mormor's with a full
 * set of lives – and, as in the old games, the XP not yet spent on a level is
 * lost. In Trollberget she starts over at the foot of the mountain instead,
 * with every candle on the mountain put out.
 */
export function gameOver(game: Game, temple: string | null): void {
  const st = game.state;
  if (!st) return;
  st.lives = START_LIVES;
  st.xp = 0;
  st.hp = hpMax(st);
  st.mp = mpMax(st);
  if (temple === LAST_TEMPLE) {
    const entry = templeById(LAST_TEMPLE)?.entryArea ?? 'troll_1';
    st.opened = st.opened.filter((o) => !(o.startsWith('cp:') && AREAS[o.slice(3).split(':')[0]]?.temple === LAST_TEMPLE));
    if (st.checkpoint && AREAS[st.checkpoint.area]?.temple === LAST_TEMPLE) st.checkpoint = null;
    goToArea(game, entry, { entry: 'A', facing: 1 });
  } else {
    st.checkpoint = null;
    goToArea(game, 'mormors_by', { entry: VILLAGES[0].wakeEntry });
  }
  game.save();
}

/** End of the vertical slice: sunrise cards, then back to the village. */
export function showSliceEnd(game: Game): void {
  const st = game.state;
  if (!st) return;
  game.transition(() => {
    game.setScene(
      new CardsScene(game, STR.sliceEnd, 'soluppgang', () => {
        goToArea(game, st.lastVillage, { entry: 'H' });
      }, 'soluppgang'),
    );
  });
}

/** Trollberget is reconciled: sunrise on midsummer morning, then the epilogue. */
export function playEnding(game: Game): void {
  const st = game.state;
  if (!st) return;
  game.transition(() => {
    game.overlays = [];
    game.setScene(
      new CardsScene(game, STR.ending, 'soluppgang', () => goToArea(game, 'epilog', { entry: 'W', facing: 1 }), 'soluppgang'),
    );
    // Quitting during the cards resumes in the epilogue.
    st.loc = { area: 'epilog', x: -1, y: -1 };
    game.save();
  });
}

/** The end: credits, a glimpse of part two, and back to the title screen. */
export function playCredits(game: Game): void {
  const st = game.state;
  if (!st) return;
  setFlag(st, 'spelet_klart');
  st.lastVillage = 'mormors_by';
  // Continuing later starts where Dagny stood, among the midsummer guests.
  game.save();
  game.transition(() => {
    game.overlays = [];
    game.setScene(new CardsScene(game, [...STR.credits, ...STR.teaser], 'midsommar', () => toTitle(game), 'soluppgang'));
  });
}
