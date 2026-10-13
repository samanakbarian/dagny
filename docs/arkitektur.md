# Architecture – Dagnys äventyr

An overview of how the code is built, why, and what can be improved.
For who is meant to read what: start with the README, then this file, then
[speldesign.md](speldesign.md) and [soundtrack.md](soundtrack.md).

## Layers

```
main.ts            start: canvas, input, audio, storage → Game
engine/            no game knowledge: loop, screen, input, collision,
                   sprites, text, audio synth, storage, haptics
game/              the game: Game (shell), scenes, overlays, flow,
                   state, saving, progression, HUD, menus
entities/          things that live in a scene: Player, Enemy, Npc,
                   Projectile, Pickup, particles
data/              ALL content as plain data: areas, dialog, NPCs,
                   creatures, items, spells, temples, map, strings
art/  audio/       sprites as character grids, songs as note strings
```

**Dependency rule:** `engine` knows nothing about the game. `data` is pure
data (types from `data/types.ts`). `entities` talk to the world only through
the `WorldApi` interface (`entities/types.ts`), never directly to
`SideScene`. That keeps creatures testable with a fake world (see `tests/birds.test.ts`, `tests/lives.test.ts`).

## Central patterns

- **Data-driven content.** New rooms, creatures, dialog, songs and items are
  added in `src/data`, `src/art` and `src/audio` without touching the engine.
  The meaning of the map characters is in `data/legend.ts`.
- **Scenes and overlays.** `Game` holds one `Scene` (title, side view, map,
  story cards) and a stack of `Overlay`s (dialog, menus, Game Over). Scene changes go
  through `game/flow.ts`, so scenes don't know about each other.
- **Fixed time step.** Game logic runs at 60 Hz independent of the frame rate.
  Rendering runs on `requestAnimationFrame`.
- **One state object.** `GameState` (`game/state.ts`) is everything that is saved.
  The save format is versioned with migrations (`game/save.ts`), every field is
  validated on load, and `repairReach` makes sure Dagny is never stuck.
- **Sprites are rasterised once** to offscreen canvases. `getSprite(id, frame)` is the
  only interface, so PNG sheets can replace them later.
- **Audio** is a small Web Audio synth with a look-ahead sequencer. Music is note
  strings. Jingles play over the music, which dips meanwhile.

## Quality

- TypeScript in `strict` mode. `npm run build` runs `tsc --noEmit` first.
- **Vitest, 279 tests** covering:
  - data integrity (every exit, dialog, sprite and character in the font)
  - softlocks and pits (a coarse jump model)
  - region gating
  - the save format and migrations
  - lives
  - creature behaviour
  - music sync
  - that rewards cost something
- Playwright scripts (outside the repo) are used for screenshots and to record
  music during development.
- Performance: about 2 ms per frame in the heaviest room.

## Known weaknesses (technical debt)

Honest list of what does not yet follow best practice, ordered by benefit:

1. **`game/sidescene.ts` (~1700 lines) does too much:** building the room, physics,
   combat, pickups, spells, bosses, sealed rooms, camera and rendering.
   *Fix:* break out systems (`CombatSystem`, `PickupSystem`, `SpellSystem`,
   `RoomRenderer`, `BossDirector`) that share the scene's state.
2. **`entities/enemy.ts` (~1450 lines):** all ~20 behaviours in one class with a
   large `switch`. *Fix:* one behaviour module per behaviour (strategy
   pattern: `behaviors/diver.ts`, `behaviors/shadow.ts` …) behind a common interface.
3. **`data/areas.ts` (~2500 lines) and `data/dialog.ts` (~1200 lines):** fine as
   data, but hard to navigate. *Fix:* split per region/temple
   (`data/areas/krypta.ts` …) and merge them in an index file.
4. **No ESLint/Prettier.** Formatting is consistent by hand. *Fix:* add
   ESLint (typescript-eslint) and Prettier, and run them in CI.
5. **No CI.** Tests are run by hand before each push. *Fix:* a GitHub Actions
   workflow running `npm ci && npm test && npm run build`.
6. **`window.dagny`** is exposed for debugging and automated tests even in
   production builds. *Fix:* only in dev mode.

None of these affect the player today. They make the code harder to keep
building on. The tests make it safe to fix them step by step without changing behaviour.
