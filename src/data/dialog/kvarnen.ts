import type { DialogDef } from '../types';

/** Temple 3: Kvarnen vid forsen and Bäckahästen. */
export const KVARNEN: Record<string, DialogDef> = {
  kvarnen_lucka: {
    pages: [
      'Högt ovanför sitter en fastrostad lucka i taket. Händerna når inte.',
      'Ristat i bjälken: "SLÅ UPP DEN UNDERIFRÅN SOM VI GÖR PÅ BRUKET."',
    ],
  },

  kvarnen_skylt1: {
    pages: ['En skylt vid bäcken:\n"BADA EJ I FORSEN. FÖLJ EJ EFTER VITA HÄSTAR."\nSista raden är understruken.'],
  },

  kvarnen_skylt2: {
    pages: ['I kvarnstenen är det ristat en sol. Under den ett namn som någon har skrapat bort.'],
  },

  backahast_vaknar: {
    speaker: 'Bäckahästen',
    pages: ['Sitt upp, lilla tös. Rid med mig ner i forsen. Ingen har sagt mitt namn på länge.'],
  },

  backahast_forlikad: {
    speaker: 'Bäckahästen',
    pages: [
      'Den förra Väktaren sa mitt namn högt. Du säger ingenting.',
      'Men du stod kvar. Det räcker.',
      'Hon lämnade sina stövlar på stranden den sista sommaren. Ta dem. Myren bär dig nu.',
    ],
  },

  fick_stovlar: {
    pages: [
      'Dagny fick GUMMISTÖVLARNA!\nNu kan hon gå över myren på kartan.',
      'Regnet tunnas ut. Kvarnhjulet börjar snurra igen.',
      'Söder om Bruksorten ligger tidvattenkärret. Bortom det står fyren vid kusten.',
    ],
    actions: [{ type: 'flag', flag: 'kvarnen_klar' }],
  },
};
