# The overworld

Drawn straight from `src/data/overworld.ts` with the game's own sprites.

## World map

![The world map](varldskarta.png)

80 × 56 tiles.
- Temples are marked in yellow with their number, villages and caves in white.
- **START** is where a new game begins, just below Mormors by.
- The hidden pass is drawn open, as Dagny sees it once she carries the radio.

## Regions

![The regions, coloured by the treasure that opens them](regioner.png)

Each colour shows where Dagny can first walk once she has the treasure
(computed with `reachableTiles` in `src/game/reach.ts`, the same logic the
game uses to check saves):

```mermaid
flowchart LR
  S([Start: Mormors by]) --> K[1. Stenkyrkans krypta]
  K -- ekan --> G[2. Den gamla gruvan]
  G -- karbidlampan --> Q[3. Kvarnen vid forsen]
  Q -- stövlarna --> F[4. Fyren i skären]
  F -- ficklampan --> P[5. Folkparken]
  P -- radion --> Z[6. Fäbodskogen]
  Z -- alla sex förlikade --> T[7. Trollberget]
```

## Drawing them again

The pictures are made by a development tool. When the map changes:

1. Start the dev server: `npm run dev`.
2. Open <http://localhost:5173/tools/kartor.html>.
3. Click a picture's heading to save it, and replace the file here.

The same page also draws every side-view room, temple by temple, for
whoever wants a map of the rooms too. Code: `src/tools/maps.ts`.
