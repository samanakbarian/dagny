import type { DialogDef } from '../types';

/** Stationssamhället: the station, telegrafisten Oskar (Åska) and the stationmaster's whistle. */
export const STATIONSSAMHALLET: Record<string, DialogDef> = {
  lind_vila: {
    speaker: 'Fru Lind på järnvägshotellet',
    pages: ['Tågen går inte, så det är tyst på hotellet. Vill du vila?'],
    choices: [
      { text: 'Vila på hotellet', next: 'lind_vilat', actions: [{ type: 'rest' }] },
      { text: 'Inte nu', next: 'lind_hej' },
    ],
  },

  lind_vilat: {
    speaker: 'Fru Lind på järnvägshotellet',
    pages: ['God morgon! Det finns kaffe på kannan.'],
  },

  lind_hej: {
    speaker: 'Fru Lind på järnvägshotellet',
    pages: ['Inte ett enda tåg i går. Inte i förrgår heller.'],
  },

  oskar_uppdrag: {
    speaker: 'Telegrafisten Oskar',
    pages: [
      'Mottagaren knastrar fortfarande, fast tråden är död.',
      'Åskan kan man inte bara be om. Man behöver något som åskan har rört vid. En åskvigg.',
      'Vid gamla kyrkogården finns det en, har jag hört.',
    ],
    actions: [{ type: 'flag', flag: 'askvigg_uppdrag' }],
  },

  /** Asked for it, but Dagny has it already: straight on to the lesson. */
  oskar_uppdrag_har: {
    speaker: 'Telegrafisten Oskar',
    pages: [
      'Mottagaren knastrar fortfarande, fast tråden är död.',
      'Åskan kan man inte bara be om. Man behöver något som åskan har rört vid. En åskvigg.',
      'Vänta. Vad är det du har där?',
    ],
    actions: [{ type: 'flag', flag: 'askvigg_uppdrag' }],
    next: 'oskar_lar',
  },

  oskar_vantar: {
    speaker: 'Telegrafisten Oskar',
    pages: ['Åskviggen ska finnas vid gamla kyrkogården. Leta högt, inte i jorden.'],
  },

  oskar_lar: {
    speaker: 'Telegrafisten Oskar',
    pages: [
      'En åskvigg! Den har varit i åskan, det känns.',
      '"Åska i tråd och åska i sten, slå alla onda, skona var en." Använd den sparsamt.',
      'Ljusslingorna i folkparken dog samtidigt som telegrafen. Åskan bor i trådar.',
    ],
    actions: [{ type: 'takeItem', item: 'askvigg' }, { type: 'flag', flag: 'askvigg_klar' }, { type: 'learnSpell', spell: 'aska' }],
    next: 'lart_aska',
  },

  lart_aska: {
    pages: ['Dagny lärde sig läsningen ÅSKA!\nTräffar alla väsen på skärmen. Kostar mycket magi.'],
  },

  oskar_igen: {
    speaker: 'Telegrafisten Oskar',
    pages: ['Döda trådar vaknar av åska.'],
  },

  berg_uppdrag: {
    speaker: 'Stinsen Berg',
    pages: [
      'En pojke lånade min visselpipa och sprang till folkparken. Han kom hem utan.',
      'Utan visselpipa går inga tåg. Det står i reglementet.',
    ],
    actions: [{ type: 'flag', flag: 'visselpipa_uppdrag' }],
  },

  berg_vantar: {
    speaker: 'Stinsen Berg',
    pages: ['Pojken tappade den vid karusellen i folkparken. Han red på den svarta hästen.'],
  },

  berg_tack: {
    speaker: 'Stinsen Berg',
    pages: [
      'Där är den!',
      'Priiip! Nu går tågen igen. Ta det här.',
    ],
    actions: [{ type: 'takeItem', item: 'visselpipa' }, { type: 'flag', flag: 'visselpipa_klar' }, { type: 'xp', amount: 250 }, { type: 'heal' }],
    next: 'berg_xp',
  },

  berg_xp: {
    pages: ['Dagny fick 250 XP och känner sig utvilad.'],
  },

  berg_glad: {
    speaker: 'Stinsen Berg',
    pages: ['Tågen går till Kyrkbyn, Gruvsamhället och Fiskeläget. Vart ska fröken?'],
    next: 'tag_resa',
  },

  // --- The train: fast travel between the stations, once the whistle is back ---
  tag_resa: {
    pages: ['Tåget puffar vid perrongen.'],
    choices: [
      { text: 'Kyrkbyn', actions: [{ type: 'travel', area: 'kyrkbyn' }] },
      { text: 'Gruvsamhället', actions: [{ type: 'travel', area: 'gruvsamhallet' }] },
      { text: 'Stationssamhället', actions: [{ type: 'travel', area: 'stationssamhallet' }] },
      { text: 'Fiskeläget', actions: [{ type: 'travel', area: 'fiskelaget' }] },
      { text: 'Stanna här' },
    ],
  },

  banvakt_vantar: {
    speaker: 'Banvakten',
    pages: ['Inga tåg i sommar. Stinsen i Stationssamhället har tappat sin visselpipa.'],
  },

  banvakt_resa: {
    speaker: 'Banvakten',
    pages: ['Tåget visslar igen! Hoppa på, fröken.'],
    next: 'tag_resa',
  },

  hittade_visselpipa: {
    pages: ['Dagny hittade en VISSELPIPA i nysilver. Den är nog stinsens.'],
  },

  resenaren: {
    speaker: 'Resenären',
    pages: ['Jag har väntat på tåget i tre dagar. En mycket lugn semester.'],
  },

  kalle: {
    speaker: 'Kalle',
    pages: ['Jag tappade stinsens visselpipa. Säg inget till honom!'],
  },

  kalle_efter: {
    speaker: 'Kalle',
    pages: ['Lyktorna i folkparken lyser igen! Jag får gå dit på lördag.'],
  },
};
