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
- **Defeat with lives left:** one life is lost, and Dagny tries again at the door of the **same room** she fell in. This holds everywhere: in temples, on paths, in caves and in meetings on the map. In a guardian's hall that means straight back to the guardian, at full health. She can also choose to wake in the last village she rested in.
  - In Zelda II a lost life also sent you back to the start of the area outside palaces. Inside palaces it sent you to the palace entrance. Same-room restart in temples is a deliberate, kinder choice for a phone game.
  - Lit candles are save points: they save the game, and "Fortsätt" from the title screen starts there.
- **The last life lost = Game Over:** she starts over at **Mormor's** with 3 lives. Unspent XP is lost; levels, items and containers are kept.
- **Trollberget is the exception:** Game Over there sends her back to the **foot of the mountain**, and every candle on the mountain goes out (as in the Great Palace).
- **Näverdockor** (birch-bark dolls, tile `+`) give one extra life each and are taken once. There are eight: Björkhagen (early, on a high ledge), Tjuvgrottan, Jättegrytan, Kvarnen, the crypt and Fyren (behind radio walls), Fäbodskogen and Trollgrottan.

Code: `GameOverOverlay` (`src/game/menus.ts`), `retryRoom` and
`gameOver` (`src/game/flow.ts`). Tests: `tests/lives.test.ts`.

## The order of the temples (decided: fixed)

The order is **fixed: 1 → 2 → 3 → 4 → 5 → 6 → 7**. Each region needs the
treasure of the temple before it, so there is only one way through, as in
Zelda II. (Decision A, October 2026: the order stays locked. An earlier text
said "roughly this order", which was not true.)

1. **Stenkyrkans krypta** → the boat
2. **The old mine** → the karbidlampa
3. **The mill by the rapids** → the stövlar
4. **The lighthouse** → the ficklampa
5. **The folk park** → the radio
6. **Fäbodskogen** → the näverlur
7. **Trollberget**, which opens when the six others are reconciled

## The overworld

80 × 56 tiles, seven regions, the lake in the middle, the start in the
south-west and Trollberget in the north. Every kind of ground is described in
`src/data/terrain.ts`: its name, what it needs, its colour on the small map and
which meetings happen there. Pictures: [kartor/](kartor/README.md).

### Borders: every border made of its own stuff

| Border | What Dagny sees | What opens it |
|---|---|---|
| Home valley ↔ lake | Shore and reeds; the boat waits at a jetty | The boat |
| Mine country ↔ mill valley | A steep fell with dark adits and boarded-up old ones | The karbidlampa |
| Mill valley ↔ coast | A wide marsh (Tjuvgrottan lies out in it) | The stövlar |
| Coast ↔ park plain | The night forest, black at noon | The ficklampa |
| Home valley ↔ park plain | Rapids, and the bridge the spring flood took | Never: the park is reached the long way round |
| Home valley ↔ highlands | A spruce thicket; a hidden path runs through it | The radio |
| Round Trollberget | Dark cliffs and bare fell | The six reconciled places |

Mountains are only the outer frame and a few massifs: about 935 tiles, against
1,660 on the old box-shaped map. Borders and shores bend: no straight edge is
longer than six tiles. The ground's colour shifts from region to region and
blends over a couple of tiles where two meet.

### Fields

| Ground | Where |
|---|---|
| Rye field (`:`) | Round Kyrkbyn, Mormors by and the folk park |
| Hay meadow (`m`) | The home valley, the coast, the park plain |
| Heather moor (`l`) | The highlands |
| Clear-cut (`h`) | The mine country and the mill valley |
| Slag heaps (`g`) | By the iron works in Bruksorten |
| Sand pit (`d`) | By Gruvsamhället |
| Bare fell (`k`) | Up towards Trollberget |

### Meetings by ground

| Table | Ground | Fights |
|---|---|---|
| `ang` | Grass, roads, landmarks | Meadow, rye field, meadow at night |
| `aker` | Rye fields | Rye field, heath, at night – birds from above |
| `hed` | Heather, clear-cut, slag, sand pit | Heath, rye field, storm |
| `skog` | Forest, the night forest, the hidden path | Forest path, spruce moor, storm |
| `myr` | Marsh | Marsh, fen, marsh at night |
| `strand` | Shore, reeds, jetty, water | Shore, reeds, shingle beach, storm |
| `fjall` | Bare fell below Trollberget | **Kalfjället** (the hardest), heath, storm |
| `odetorp` | Round the deserted crofts | **Ödetorpet** (vättar indoors), forest path, night |

About 10–15 % of each table is a friendly meeting instead of a fight. Every
region has its own creatures wandering the map, each tied to its ground, so the
same meeting doesn't turn up everywhere.

### Landmarks: forgotten things

At least two per region: stone walls (whole and fallen), springs, deserted
crofts, earth cellars, barns, standing stones, milestones, wayside crosses,
gates, overgrown paths. On a phone screen (20 × 11 tiles) there is always at
least one in sight. One per region says something, and gives a little XP the
first time (`sights` in `src/data/overworld.ts`):

| Region | Landmark | What it tells |
|---|---|---|
| Home valley | Offerkällan, Lill-Gärdet, Domarringen | Offerings nobody makes now; a croft left for America; the old thing-stead |
| Mine country | Gruvfogdens sten, Kolartorpet | A mine bailiff from 1871; a charcoal burner's croft |
| Mill valley | Pestkorset | The plague of 1711 – and fresh flowers, though nobody lives there |
| Coast | Skeppssättningen | A stone ship that sails in every storm |
| Park plain | Milstolpen | A milestone pointing at a road the flood took |
| Highlands | Fäbodtorpet, Trefaldighetskällan | The milkmaids' summer home; a healing spring |
| Towards Trollberget | Väktarstenen | The sign from Dagny's blade: "Väktarna vakade så länge människorna mindes" |

### Hidden places

| Place | Where | How it is found | What is in it |
|---|---|---|---|
| **Björkhagen** | Beside Mormors by | Open from the start | Murre the cat, johannesört for Sven, a näverdocka, and behind the radio wall a hidden nook |
| **Tjuvgrottan** | Out in the marsh (stövlar) | On the map | Grå-Pelle's stolen silver: the silver fitting and a magic container show in the karbidlampa's light; a life container and a näverdocka |
| **Jättegrytan** | On the islet in the lake (boat) | On the map | Initials "D. och H." under a little sun (Dagmar and Hulda) in the ficklampa's light, a magic container and a näverdocka |
| **Fallgrottan** | Behind the waterfall on the mill valley's northern cliff | Seen only from right beside it | A life container on a ledge, a näverdocka, and Dagmar's carving: "Den som gömmer sig bakom fallet hörs inte av berget" |
| **Väktarkammaren** | A door in the cliffs below Trollberget | Only with the radio | Dagmar's notebook from midsummer eve 1946, the Väktare's names on the wall – with room for one more – and a magic container |

`tests/landscape.test.ts` checks that each hidden place can be reached with the
treasures Dagny has in its region, that the cliff door stays shut without the
radio, and that every cave leads back out beside where it lies.

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
