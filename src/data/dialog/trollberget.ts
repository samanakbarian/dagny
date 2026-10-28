import type { DialogDef } from '../types';

/** Temple 7: Trollberget – the maze, Skuggan, Bergakungen and Dagmar. */
export const TROLLBERGET: Record<string, DialogDef> = {
  troll_gangar_skylt1: {
    pages: ['Djupt ristat i berget:\n"TRE GÅNGAR. TVÅ GÅR I RING.\nDEN MITTERSTA BÄR."'],
  },

  troll_gangar_skylt2: {
    pages: ['Samma hand:\n"SOLEN GÅR NER I VÄSTER.\nGÅ DIT HON GÅR."'],
  },

  troll_villse: {
    pages: ['Gången slingrar sig i mörkret...\n...och Dagny kommer ut där hon började.'],
  },

  troll_villse2: {
    pages: ['Gången vrider sig om och om igen.\nDagny står vid ingången till Trollgångarna igen.'],
  },

  skuggan_moter: {
    pages: [
      'Ur mörkret kliver en gestalt. Dagnys flätor, Dagnys sjal. Röda ögon.',
      'Den lyfter svärdet som hon. Den parerar där hon parerar.\nVägen ut stängs.',
    ],
  },

  troll_skylt1: {
    pages: ['Ristat i berget:\n"D. GICK HÄR MIDSOMMARNATT 1946. GLÖM OSS INTE."'],
  },

  bergakung_vaknar: {
    speaker: 'Bergakungen',
    pages: [
      'SÅ. NÅGON KOMMER UPP FÖR BERGET IGEN.',
      'DE GÄRDSGÅRDAR NI RIVER. DE KÄLLOR NI FYLLER IGEN. DE NAMN NI GLÖMMER. ALLT DET BÄR JAG.',
      'HON SOM BAND MIG ÄR SVAG NU. ÄR DU STARKARE, LILLA VÄKTARE?',
    ],
  },

  bergakung_forlikad: {
    speaker: 'Bergakungen',
    pages: [
      'Sex platser har vaknat i godo. Människorna minns oss igen.',
      'Vreden får vila.',
      'Hon som har hållit mig i arton år väntar därinne. Gå till henne.',
    ],
  },

  dagmar_avsked: {
    speaker: 'Dagmar',
    pages: [
      'Dagny. Du har blivit så stor.',
      'Jag höll honom stilla i arton år. Nu har du väckt platserna. Han behöver inte mig längre.',
      'Men jag kan inte stanna. Inte än.',
    ],
    choices: [{ text: 'Krama henne', next: 'dagmar_ljus' }],
  },

  dagmar_ljus: {
    speaker: 'Dagmar',
    pages: [
      'Där. Det räckte gott.',
      'Berget släpper mig inte på en gång. Men en dag kommer jag hem. Det lovar jag.',
      'Hälsa mamma. Säg att det aldrig var hennes fel. Och att hon höll sitt löfte.',
      'Se. Solen går upp.',
    ],
    actions: [{ type: 'flag', flag: 'trollberget_klar' }, { type: 'scene', scene: 'ending' }],
  },
};
