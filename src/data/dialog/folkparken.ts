import type { DialogDef } from '../types';

/** Temple 5: Folkparken om natten and Spelmannen. */
export const FOLKPARKEN: Record<string, DialogDef> = {
  park_skylt1: {
    pages: ['En blekt affisch på planket:\n"DANS I FOLKPARKEN VARJE LÖRDAG. ORKESTERN SPELAR TILL GRYNINGEN."'],
  },

  park_slingor: {
    pages: ['Ljusslingorna över dansbanan är döda. En lapp:\n"STRÖMMEN GICK I MAJ. ELEKTRIKERN KOMMER I HÖST."'],
  },
  park_skylt2: {
    pages: ['Ett fotografi vid dansbanan. En kvinna med kopparhår dansar med ett irrbloss. Hon skrattar.'],
  },

  spelman_vaknar: {
    speaker: 'Spelmannen',
    pages: ['Förr dansade de till min fiol tills solen gick upp. Nu sitter de hemma vid sina apparater. Dansa!'],
  },

  spelman_forlikad: {
    speaker: 'Spelmannen',
    pages: [
      'Du dansade inte. Men du gick i takt.',
      'Hon lyssnade efter mig mellan stationerna på sin radio. Hon hörde mig när ingen annan gjorde det.',
      'Ta den. Där det brusar finns vägar som andra har glömt.',
    ],
  },

  fick_radio: {
    pages: [
      'Dagny fick TRANSISTORRADION!\nVäggar som surrar i bruset går nu att gå igenom.',
      'Ljusslingorna tänds över dansbanan.',
      'I berget norr om Mormors by finns ett dolt pass. Radion brusar när man kommer nära. Där uppe ligger fäbodarna.',
    ],
    actions: [{ type: 'flag', flag: 'folkparken_klar' }],
  },
};
