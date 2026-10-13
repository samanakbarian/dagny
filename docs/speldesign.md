# Speldesign – Dagnys äventyr

How the game is meant to play: progression, lives, the temples and what
every reward costs. The story itself is in the story document; balance
values live in `src/data/progression.ts`.

## Ground rule: nothing for free

Every skill, reading and treasure costs Dagny something: a task, a temple
or a hidden place. At the start she has only the blade Mormor gives her.

## Readings and techniques

| What | Who | Where | What it costs |
|---|---|---|---|
| Läkning | Gamle Sven | Mormors by | Fetch **johannesört** from the high ledges in Björkhagen (nettles, crows, jumps) |
| Nedåtstöt | Smeden Algot | Mormors by | Clear the **crypt** (temple 1) first |
| Lyse | Gamla Elin | Gruvsamhället | The village is reached by boat (treasure of temple 1) |
| Eld | Prosten | Kyrkbyn | After the crypt |
| Skydd | Smeden Holm | Bruksorten | Region gated by the karbidlampa |
| Uppåtstöt | Förman Karlsson | Bruksorten | As above |
| Hopp | Viola | Fiskeläget | Region gated by the stövlar |
| Hamn | Gammelmor Karna | Fäboden | After the mine |
| Åska | Telegrafisten Oskar | Stationssamhället | Region gated by the ficklampa |

The NPC dialog conditions are in `src/data/npcs.ts`; `tests/start.test.ts`
checks that Läkning and Nedåtstöt cannot be had for free.

## Levels and strength

- Three stats, **Styrka, Magi, Liv**, each 1–12, raised with XP (`COSTS` in `src/data/progression.ts`).
- **Containers:** life (+2) and magic (+1), hidden in temples and caves, each taken once.
- **Sword upgrades:** smith Holm tempers the blade with ore and hones it with the thunderstone. A silver fitting lies hidden in Tjuvgrottan and only shows in the light of the karbidlampa. Each upgrade gives +1 damage.

## Lives and Game Over (Zelda II style)

- Dagny has **3 lives** (`START_LIVES`), at most 9. Lives show in the HUD as little doll heads.
- **Defeat with lives left:** one life is lost. In a temple she tries again at the last lit candle, or at the temple door if none is lit. Outside temples she wakes in the last village she rested in.
- **The last life lost = Game Over:** she starts over at **Mormor's** with 3 lives. Unspent XP is lost; levels, items and containers are kept.
- **Trollberget is the exception:** Game Over there sends her back to the **foot of the mountain**, and every candle on the mountain goes out (as in the Great Palace).
- **Näverdockor** (birch-bark dolls, tile `+`) give one extra life each and are taken once. There are eight: Björkhagen (early, on a high ledge), Tjuvgrottan, Jättegrytan, Kvarnen, the crypt and Fyren (behind radio walls), Fäbodskogen and Trollgrottan.

Code: `GameOverOverlay` (`src/game/menus.ts`), `retryCheckpoint` and
`gameOver` (`src/game/flow.ts`). Tests: `tests/lives.test.ts`.

## The world and the order of the temples

The map (80 × 56) is split into regions. Each temple's treasure opens the way to the next:

1. **Stenkyrkans krypta** → the boat (the lake)
2. **The old mine** → the karbidlampa (the dark mine passage)
3. **The mill by the rapids** → the stövlar (the tidal marsh)
4. **The lighthouse** → the ficklampa (the night forest)
5. **The folk park** → the radio (the hidden pass, hidden walls)
6. **Fäbodskogen** → the näverlur
7. **Trollberget** opens when the six others are reconciled

`src/data/overworld.ts` holds the gating (`needs`, `requires`); `tests/world.test.ts`
checks the order. Saves are checked on load (`repairReach`), so Dagny is never stuck.

## Trollberget – the last temple

It should be really hard, like the last palace in Zelda II:

- **Every room is "hard":** creatures have 50 % more health and hit 1 harder (`hard: true` on the area).
- **More creatures** than in earlier temples.
- **Trollgångarna:** a maze of two rooms with three passages each. Wrong passages lead back to the start. The riddles are carved in the rock ("Den mittersta bär", "Solen går ner i väster").
- **Skuggsalen:** Dagny meets her own shadow (behaviour `shadow`). It mirrors her guard and parries where she parries. It throws cuts along the floor or at her head (the stance gives away which), lunges up close and jumps when she jumps. It stands open after each attack, and a thrust from above always gets through. The hall is shut until the shadow is beaten (`sealed` on the area).
- **Bergakungen** in the last hall.

Order: Bergsfoten → Trollgrottan → Trollgångarna → Djupa gångarna → Bergshjärtat → Skuggsalen → Bergakungens sal.

## Music

See [soundtrack.md](soundtrack.md).
