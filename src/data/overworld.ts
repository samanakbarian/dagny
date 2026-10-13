import type { OverworldDef } from './types';

/**
 * The overworld, seen from above. One character per 16×16 tile:
 *
 *  .  grass        f  forest       ~  water (needs the eka)
 *  s  bog (needs the rubber boots) ^  mountains (impassable)
 *  |  road (N–S)   -  road (E–W)   +  crossroads
 *  :  rye field    _  sand / shore
 *  V  Mormors by   K  the stone church (temple 1)   G  Björkhagen
 *  M  the old mine (temple 2)       Q  the mill by the rapids (temple 3)
 *  Y  the lighthouse on the skerry (temple 4)
 *  P  the folk park (temple 5)       Z  the summer farm in the forest (temple 6)
 *  B  other villages   O  standing stones (Trollberget)
 */
export const OVERWORLD: OverworldDef = {
  tiles: [
    '^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^',
    '^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^',
    '^^^^^^^^^^^^^.............^^^^^^^^^^......^^',
    '^^^^^^^^^^^^^..::::::::::.^^^^^^^^^^Offfff^^',
    '^^.............:::::K::::.^^^^^^^^^^ffffff^^',
    '^^.............::B::|::::.._~~~~~~..ffffff^^',
    '^^.............:::::|::::.._~~~~~~..fffMff^^',
    '^^.............:::::|::::.._~~~~~~..ffffff^^',
    '^^..................|......_~~~~~~~~ffffff^^',
    '^^ffffffffffffffff..|.fffff_~~~~~~~~....B.^^',
    '^^ffffffffffffffff..|.ffQff~~~~~~~~~......^^',
    '^^ffffffffffffffff..|.fffff~~~~~~~~~...B..^^',
    '^^ffffffffffffffff..|.fffff~~~~~~~~~.:::::^^',
    '^^ffffffffffffffff..|.fffff~~~~~~~~~.:::::^^',
    '^^ffffffffffffffff..|......~~~___~~~.::P::^^',
    '^^ffffff............|......~~~_Y_~~~.:::::^^',
    '^^ffGfff............|......~~~___~~~.:::::^^',
    '^^fff----|..........|......~~~~~~~~~......^^',
    '^^ffffff.|..........|......~~~~~~~~~......^^',
    '^^ffffff.|..........|......~~~~~~~~~......^^',
    '^^.......-----------+......~~~~~~~~~.B....^^',
    '^^........V................~~~~~~~........^^',
    '^^.........................~~~~~~~..ffffff^^',
    '^^.........................~~~~~~~~~ffffff^^',
    '^^......................B..~~~~~~~~~ffffff^^',
    '^^................sssssssss~~~~~~~~~ffffff^^',
    '^^................sssssssss~~~~~~~~~ffffBf^^',
    '^^................ssssZssss~~~~~~~~~ffffff^^',
    '^^................sssssssss~~~~~~~~~ffffff^^',
    '^^................sssssssss~~~~~~~~~......^^',
    '^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^',
    '^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^',
  ],
  start: { x: 10, y: 22 },
  music: 'karta',
  tone: 'karta',
  areaByTerrain: { '.': 'mote_ang', ':': 'mote_ang', f: 'mote_skog', s: 'mote_myr', _: 'mote_ang', '|': 'mote_ang', '-': 'mote_ang', '+': 'mote_ang' },
  needs: { '~': 'eka', s: 'stovlar' },
  blocked: '^',
  places: [
    { x: 10, y: 21, name: 'Mormors by', area: 'mormors_by', entry: 'W' },
    { x: 20, y: 4, name: 'Stenkyrkan', area: 'krypta_1', entry: 'A' },
    { x: 4, y: 16, name: 'Björkhagen', area: 'bjorkhagen', entry: 'W' },
    // Temples 2–7: sleeping stone circles until they are built.
    { x: 39, y: 6, name: 'Den gamla gruvan', area: 'gruvan_1', entry: 'A' },
    { x: 24, y: 10, name: 'Kvarnen vid forsen', area: 'kvarnen_1', entry: 'A' },
    { x: 31, y: 15, name: 'Fyren i skären', area: 'fyren_1', entry: 'A' },
    { x: 39, y: 14, name: 'Folkparken', area: 'folkparken_1', entry: 'A' },
    { x: 22, y: 27, name: 'Fäbodskogen', area: 'fabod_1', entry: 'A' },
    { x: 36, y: 3, name: 'Trollberget', dialog: 'trollberget_sover' },
    // Villages still to be built.
    { x: 17, y: 5, name: 'Kyrkbyn', dialog: 'by_avsparrad' },
    { x: 39, y: 11, name: 'Bruksorten', dialog: 'by_avsparrad' },
    { x: 37, y: 20, name: 'Fiskeläget', dialog: 'by_avsparrad' },
    { x: 40, y: 9, name: 'Gruvsamhället', area: 'gruvsamhallet', entry: 'W' },
    { x: 24, y: 24, name: 'Fäboden', dialog: 'by_avsparrad' },
    { x: 40, y: 26, name: 'Stationssamhället', dialog: 'by_avsparrad' },
  ],
  encounters: [
    { sprite: 'owShadow', terrain: '.:|', x: 14, y: 7 },
    { sprite: 'owShadow', terrain: '.:', x: 23, y: 6 },
    { sprite: 'owShadow', terrain: 'f', x: 7, y: 11 },
    { sprite: 'owShadow', terrain: 'f', x: 13, y: 13 },
    { sprite: 'owShadow', terrain: '.', x: 16, y: 17 },
    { sprite: 'owWisp', terrain: '.', x: 14, y: 25, area: 'mote_myr' },
    { sprite: 'owWisp', terrain: '.f', x: 4, y: 20, area: 'mote_myr' },
    { sprite: 'owShadow', terrain: '.:', x: 38, y: 13 },
    { sprite: 'owShadow', terrain: 'f', x: 38, y: 24 },
  ],
};
