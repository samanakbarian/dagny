import { Loop } from './engine/loop';
import { AudioEngine } from './engine/audio';
import { initSprites } from './engine/sprites';
import { SPRITES } from './art';
import { SONGS } from './audio/songs';
import { SFX } from './audio/sfx';
import { Game } from './game/game';
import { TitleScene } from './game/title';
import { PauseOverlay } from './game/menus';
import { RotateScreen } from './game/rotate';
import { SPELL_ORDER } from './data/spells';
import { maxMp } from './game/progression';
import { playCredits, playEnding } from './game/flow';

/** Boot: build the sprite cache, wire up the shell and start the 60 Hz loop. */
function boot(): void {
  const canvas = document.getElementById('screen') as HTMLCanvasElement;
  const controls = document.getElementById('controls') as HTMLElement;
  initSprites(SPRITES);
  const audio = new AudioEngine(SONGS, SFX);
  const game = new Game(canvas, controls, audio);
  game.rotateScreen = new RotateScreen();
  game.openPause = () => {
    if (game.state && game.scene && !game.modal && !game.transitioning) {
      game.audio.play('menu');
      game.pushOverlay(new PauseOverlay(game));
    }
  };

  // ?debug: all spells and skills, plenty of magic – handy for testing.
  const params = new URLSearchParams(location.search);
  if (params.has('debug')) {
    game.debug = true;
    const origSet = game.setScene.bind(game);
    game.setScene = (scene) => {
      const s = game.state;
      if (s) {
        for (const id of SPELL_ORDER) if (!s.spells.includes(id)) s.spells.push(id);
        s.selectedSpell ??= 'lakning';
        for (const sk of ['nedatstot', 'uppatstot'] as const) if (!s.skills.includes(sk)) s.skills.push(sk);
        s.mp = maxMp(s.levels.magi);
      }
      origSet(scene);
    };
  }

  game.onScene = (scene) => (scene === 'ending' ? playEnding(game) : playCredits(game));

  game.setScene(new TitleScene(game));
  audio.tryAutoplay('titel');

  const loop = new Loop(
    () => game.update(),
    () => {
      game.fps = loop.fps;
      game.render();
    },
  );
  loop.start();

  // Pause automatically when the app is left (incoming call, app switch).
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      game.suspend();
      loop.stop();
    } else {
      loop.start();
      game.resumeFromBackground();
    }
  });
  window.addEventListener('pagehide', () => game.save());
  window.addEventListener('blur', () => game.save());

  // Expose for debugging / automated tests.
  (window as unknown as { dagny: Game }).dagny = game;

  // Service worker for offline play (production builds only).
  if (import.meta.env.PROD && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => undefined);
    });
  }
}

boot();
