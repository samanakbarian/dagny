import { AREAS } from '../data/areas';
import { STR } from '../data/strings';
import { VILLAGES } from '../data/temples';
import type { Game } from './game';
import { newGame, setFlag } from './state';
import { maxHp, maxMp } from './progression';
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
  st.hp = maxHp(st.levels.liv);
  st.mp = maxMp(st.levels.magi);
  const v = VILLAGES.find((x) => x.area === st.lastVillage) ?? VILLAGES[0];
  goToArea(game, v.area ?? 'mormors_by', { entry: v.wakeEntry });
}

/** After a defeat in a temple: retry at the last lit candle. */
export function retryCheckpoint(game: Game): void {
  const st = game.state;
  if (!st || !st.checkpoint) {
    wakeAtVillage(game);
    return;
  }
  st.hp = maxHp(st.levels.liv);
  st.mp = Math.max(st.mp, Math.ceil(maxMp(st.levels.magi) / 2));
  goToArea(game, st.checkpoint.area, { x: st.checkpoint.x, y: st.checkpoint.y });
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
