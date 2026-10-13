import type { OverworldDef } from './types';

/**
 * The overworld, seen from above. One character per 16×16 tile (80 × 56).
 *
 *  .  grass        f  forest       ~  water (needs the eka)
 *  s  bog / tidal marsh (needs the rubber boots)    ^  mountains (impassable)
 *  |  road (N–S)   -  road (E–W)   +  crossroads    =  bridge
 *  :  rye field    _  sand / shore
 *  D  the dark tunnel through the ridge (needs the carbide lamp)
 *  N  the night forest, pitch black (needs the flashlight)
 *  H  the hidden pass in the northern ridge (the transistor radio finds it)
 *  V  Mormors by   K  the stone church (temple 1)   G  Björkhagen
 *  M  the old mine (temple 2)       Q  the mill by the rapids (temple 3)
 *  Y  the lighthouse on the skerry (temple 4)
 *  P  the folk park (temple 5)       Z  the summer farm in the forest (temple 6)
 *  T  Trollberget (temple 7, opens when the six others are restored)
 *  C  caves (Jättegrytan on an islet in the lake, Tjuvgrottan in the marsh)
 *  B  other villages
 *
 * Seven regions, each opened by the treasure of the temple before it:
 *  the home valley → (ekan) the mine country → (karbidlampan) the mill valley →
 *  (stövlarna) the coast → (ficklampan) the park plain → (radion) the
 *  summer-farm highlands → the road to Trollberget.
 */
export const OVERWORLD: OverworldDef = {
  tiles: [
    '^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^',
    '^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^',
    '^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^',
    '^^^^^.^..^^^^^^^.^^^^.......^^....^^^^^^^^.^..^^^^^ffff...^^^^^..^.^^.^..^.^..^^',
    '^^^^^.^....^.^^..^^.:::::.......T.^^..ff^ff.....^f^ffffff^^^^^^^....fffff..^..^^',
    '^^^................:::::::..^^....^^^fffffff...ffffffMffff.^^^^...fffffffff...^^',
    '^^^....sssss.......:::::::..^^....^^.fffffff..fffffffffffff^^^^..fffffffQfff..^^',
    '^^^..sssssssss.....:::::::..^^^^^^^^.fffffff..ffffffffffff^^^^^..fffffffffff..^^',
    '^^^.sssssssssss.....:::::...^^^^^^^^..fffff...fffffffffffff^^^^..fffffffffff^^^^',
    '^^^sssssssssssss...........^^^^^^^^^^.......+--------------DDDD-------+ffff..^^^',
    '^^^sssssssssssss...........^^^^^^^^^^^......B...fffffffff..^^^^.....ff|ff...^^^^',
    '^^^ssssssZssssss...........^^^^^^^^^........|::::.fffff...^^^^^.......|.......^^',
    '^^^sssssssssssss..........^^^^^^^^^^^.....::|::::::.......^^^^^~~~~~~~|=~~~~~~^^',
    '^^^sssssssssssss...........^^^^^^^^^^.....::|::::::........^^^^.......|..:::..^^',
    '^^^.sssssssssss...fffff....^^^^^^^^^......::|::::::........^^^^^......|.:::::^^^',
    '^^^..sssssssss..fffffffff...^^^^^^^^........|::::......^...^^^^^......|::::::^^^',
    '^^^^...sssss....fffffffff.^^^^^^^^^^........|........^^^^^.^^^^^.fff..|::::::^^^',
    '^^^............ffffBffffff.^^^^^^^^^_______________^^^^^^^^^^^^.fffff.|::::::^^^',
    '^^^...........+-----ffffff..^^^~~~~~~~~~~~~~~~~~~~~^^^^^^^^^^^^fffffffB.:::::.^^',
    '^^^...fffff...|fffffffffff..^^^~~~~~~~~~~~~~~~~~~~~^^^^^^^^^^^^^ffffff...:::.^^^',
    '^^^^.fffffff..|.fffffffff..^^^^~~~~~~~~~~~~~~~~~~~~^^^^^^^^^^^^^^fffff.......^^^',
    '^^^.fffffffff.|.fffffffff..^^^^~~~~~~~~~~~~~~~~~~~~^^^^^^^^^^^^^fffff........^^^',
    '^^^^^ffffffff.|...fffff.....^^^~~~~~~~~~~~~~~~~~~~~^^^^^^^^^^^^^.fff..........^^',
    '^^^.fffffffff.|............^^^^~~~~~~~~~~~~~~~~~~~~^^^^^^^^^^^^^.........^.^^^^^',
    '^^^^.fffffff..|...........^^^^^~~~~~~~~~~~~~~~~~~~~^^^^^^^^^^^^^^^^sssss^^^^^^^^',
    '^^^...fffff...|.....^......^^^^~~~~~~~~~~~~~~~~~~~~^^^^^^^^^^^^^^^^sssss^^^^^^^^',
    '^^^.^^..^^^.^.|.^^^.^^...^..^^^~~~~~~~~~~~~~~~~~~~~^^^^^^^^^^^^^^^^sssss^^^^^^^^',
    '^^^^^^^^^^^^^^H^^^^^^^^^^^^^^^^~~~~~~~~~~~~~~~~~~~~^^^^^^^^^^^^^^^^sssss^^^^^^^^',
    '^^^^^^^^^^^^^^H^^^^^^^^^^^^^^^^~~~~~~~~~~~~~~~~~~~~^^^^^^^^^^^^^^^^sssss^^^^^^^^',
    '^^^^^^^^^^^^^^H^^^^^^^^^^^^^^^^~~~~~~~~~___~~~~~~~~^^^^^^^^^^^^^^^^ssCss^^^^^^^^',
    '^^^^^^^^^^^^^^H^^^^^^^^^^^^^^^^~~~~~~~~__C__~~~~~~~^^^^^^^^^^^^^^^^sssss^^^^^^^^',
    '^^^.........^...^^^^^^^...^^^^^~~~~~~~~~___~~~~~~~~^^^^^^^^^^^^^^^^sssss^^^^^^^^',
    '^^^^..........................^~~~~~~~~~~~~~~~~~~~~^^^^^^^^^^^^^^^^sssss^^^^^^^^',
    '^^^^....K...........:::::....._~~~~~~~~~~~~~~~~~~~~^^^^^^^^^^^^^^^^sssss^^^^^^^^',
    '^^^^^.............::B::::::..._~~~~~~~~~~~~~~~~~~~~^^^^^...^.^^..^.........^..^^',
    '^^^^.fff.........:::|:::::::.._~~~~~~~~~~~~~~~~~~~~^^^^^^..................^..^^',
    '^^^^fffff........:::|:::::::.._~~~~~~~~~~~~~~~~~~~~^^^^^..fffff.....:::::.....^^',
    '^^^^^fffff.......:::|:::::::.._~~~~~~~~~~~~~~~~~~~~^^^^^^fffffff..:::::::::..^^^',
    '^^^fffffff........::|::::::..._~~~~~~~~~~~~~~~~~~~~^^^^^.fffffff..:::::::::.^^^^',
    '^^^fffffff..........|::::....._~~~~~~~~~~~~~~~~~~~~^^^^^.fffffff..:::::::::..^^^',
    '^^^^f-------+-------+---------_~~~~~~~~~~~~~~~~~~~~^^^^^..ff-----------::....^^^',
    '^^^^.fff....|.................^^^^^^^^^^^^^^^^^^^^^^^^^^....B................^^^',
    '^^^.........|.................^^^^^^^^^^^^^^^^^^^^^^^^^^.....................^^^',
    '^^^.........|................^^^^^^^^^^^^^^^^^^^^^^^^^^^....................^^^^',
    '^^^^..fffff.V...:::::........^^^^^^^^^^^^^^^^^^^^^^^NNNN......................^^',
    '^^^^^fffffff|..:::::::........^^^^.....^^^.^^.^^^^^.NNNN......................^^',
    '^^^.fffffffff..:::::::.......^^^^...................^^^^______________________^^',
    '^^^fffffffffff.:::::::........^^^...................^^^^~~~~~~~~~~~~~~~~~~~~~~^^',
    '^^^^ffffffffff..:::::.........^^^^..::::---------B..^^^^~~~~~~~~~~~~~~~~~~~~~~^^',
    '^^^^^fffffffff.........fffff..^^^.::::::P::.........^^^^~~~~~~~~~~~~~~~___~~~~^^',
    '^^^.fffffffff........fffGfffff^^^^:::::::::.........^^^^~~~~~~~~~~~~~~~_Y_~~~~^^',
    '^^^^fffffffff........fffffffff^^^^:::::::::.fffff...^^^^~~~~~~~~~~~~~~~___~~~~^^',
    '^^^...f^fff...^......fffffffff^^^^.^:::::.^fffffff..^^^^~~~~~~~~~~~~~~~~~~~~~~^^',
    '^^^^...^^^^^^.^^^^^^^..^ff^f..^^^.^^^.^^..^.^fff^^^.^^^^~~~~~~~~~~~~~~~~~~~~~~^^',
    '^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^',
    '^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^',
  ],
  start: { x: 12, y: 45 },
  music: 'karta',
  tone: 'karta',
  needs: { '~': 'eka', s: 'stovlar', D: 'karbidlampa', N: 'ficklampa', H: 'radio' },
  blocked: '^',
  places: [
    { x: 12, y: 44, name: 'Mormors by', area: 'mormors_by', entry: 'W' },
    { x: 20, y: 34, name: 'Kyrkbyn', area: 'kyrkbyn', entry: 'W' },
    { x: 8, y: 33, name: 'Stenkyrkan', area: 'krypta_1', entry: 'A' },
    { x: 24, y: 50, name: 'Björkhagen', area: 'bjorkhagen', entry: 'W' },
    { x: 44, y: 10, name: 'Gruvsamhället', area: 'gruvsamhallet', entry: 'W' },
    { x: 53, y: 5, name: 'Den gamla gruvan', area: 'gruvan_1', entry: 'A' },
    { x: 41, y: 30, name: 'Jättegrytan', area: 'jattegrytan', entry: 'A' },
    { x: 70, y: 18, name: 'Bruksorten', area: 'bruksorten', entry: 'W' },
    { x: 72, y: 6, name: 'Kvarnen vid forsen', area: 'kvarnen_1', entry: 'A' },
    { x: 69, y: 29, name: 'Tjuvgrottan', area: 'tjuvgrottan', entry: 'A' },
    { x: 60, y: 41, name: 'Fiskeläget', area: 'fiskelaget', entry: 'W' },
    { x: 72, y: 50, name: 'Fyren i skären', area: 'fyren_1', entry: 'A' },
    { x: 40, y: 49, name: 'Folkparken', area: 'folkparken_1', entry: 'A' },
    { x: 49, y: 48, name: 'Stationssamhället', area: 'stationssamhallet', entry: 'W' },
    { x: 19, y: 17, name: 'Fäboden', area: 'faboden', entry: 'W' },
    { x: 9, y: 11, name: 'Fäbodskogen', area: 'fabod_1', entry: 'A' },
    {
      x: 32, y: 4, name: 'Trollberget', area: 'troll_1', entry: 'A', dialog: 'trollberget_sover',
      requires: ['krypta_klar', 'gruvan_klar', 'kvarnen_klar', 'fyren_klar', 'folkparken_klar', 'fabodskogen_klar'],
    },
  ],
  encounters: [
    { sprite: 'owShadow', terrain: '.:', x: 22, y: 37 },
    { sprite: 'owShadow', terrain: 'f', x: 8, y: 48 },
    { sprite: 'owShadow', terrain: '.', x: 26, y: 45 },
    { sprite: 'owShadow', terrain: 'f', x: 52, y: 7 },
    { sprite: 'owShadow', terrain: '.:', x: 47, y: 13 },
    { sprite: 'owShadow', terrain: 'f', x: 70, y: 6 },
    { sprite: 'owShadow', terrain: '.', x: 74, y: 20 },
    { sprite: 'owWisp', terrain: 's', x: 69, y: 26, table: 'myr' },
    { sprite: 'owShadow', terrain: '.:', x: 66, y: 37 },
    { sprite: 'owShadow', terrain: '_', x: 64, y: 46 },
    { sprite: 'owShadow', terrain: '.:', x: 38, y: 51 },
    { sprite: 'owShadow', terrain: '.f', x: 46, y: 52 },
    { sprite: 'owWisp', terrain: 's', x: 8, y: 9, table: 'myr' },
    { sprite: 'owShadow', terrain: 'f', x: 20, y: 18 },
    { sprite: 'owShadow', terrain: '.', x: 24, y: 23 },
  ],
};
