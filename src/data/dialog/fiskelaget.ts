import type { DialogDef } from '../types';

/** Fiskeläget: the fishing huts, Viola (Hopp), Johan's compass and old lighthouse keeper Ture. */
export const FISKELAGET: Record<string, DialogDef> = {
  hilma_vila: {
    speaker: 'Hilma i sjöboden',
    pages: ['Det luktar tjära och strömming, men sängarna är torra. Vill du vila?'],
    choices: [
      { text: 'Vila i sjöboden', next: 'hilma_vilat', actions: [{ type: 'rest' }] },
      { text: 'Inte nu', next: 'hilma_hej' },
    ],
  },

  hilma_vilat: {
    speaker: 'Hilma i sjöboden',
    pages: ['Du sov som en säl.'],
  },

  hilma_hej: {
    speaker: 'Hilma i sjöboden',
    pages: ['Havet ger och havet tar. Just nu tar det mest.'],
  },

  viola_uppdrag: {
    speaker: 'Nätlagerskan Viola',
    pages: [
      'Akta näten.',
      'Vill du hoppa högre? Då behöver jag en fjäder från en sädesärla.',
      'De bygger bo på stranden på andra sidan sjön. Där någon blinkade med en lampa förr.',
    ],
    actions: [{ type: 'flag', flag: 'fjader_uppdrag' }],
  },

  /** Asked for it, but Dagny has it already: straight on to the lesson. */
  viola_uppdrag_har: {
    speaker: 'Nätlagerskan Viola',
    pages: [
      'Akta näten.',
      'Vill du hoppa högre? Då behöver jag en fjäder från en sädesärla.',
      'Vänta. Vad är det du har där?',
    ],
    actions: [{ type: 'flag', flag: 'fjader_uppdrag' }],
    next: 'viola_lar',
  },

  viola_vantar: {
    speaker: 'Nätlagerskan Viola',
    pages: ['Sädesärlorna håller till högt bland stenarna, där signalstenen står.'],
  },

  viola_lar: {
    speaker: 'Nätlagerskan Viola',
    pages: [
      'En ärlefjäder! Känn hur lätt den är.',
      '"Fjäder i fot och vind under häl, lätt som en ärla, lätt som en själ."',
      'Uppe i fyrens linsrum ligger saker dit ingen människa når. Men en sädesärla når.',
    ],
    actions: [{ type: 'takeItem', item: 'fjader' }, { type: 'flag', flag: 'fjader_klar' }, { type: 'learnSpell', spell: 'hopp' }],
    next: 'lart_hopp',
  },

  lart_hopp: {
    pages: ['Dagny lärde sig läsningen HOPP!\nDagny hoppar högre en stund.'],
  },

  viola_igen: {
    speaker: 'Nätlagerskan Viola',
    pages: ['Hoppa inte i sjön. Nät har jag, men inga håvar.'],
  },

  johan_uppdrag: {
    speaker: 'Fiskaren Johan',
    pages: [
      'Min kompass! Jag tappade den i fyren när stormen kom.',
      'Utan den hittar jag inte hem i dimman. Mässingsdosa, röd nål.',
    ],
    actions: [{ type: 'flag', flag: 'kompass_uppdrag' }],
  },

  johan_vantar: {
    speaker: 'Fiskaren Johan',
    pages: ['Den ligger nog uppe i fyren, i rummet med de stora linserna.'],
  },

  johan_tack: {
    speaker: 'Fiskaren Johan',
    pages: [
      'Där är den! Nålen pekar mot norr igen.',
      'Ta det här.',
    ],
    actions: [{ type: 'takeItem', item: 'kompass' }, { type: 'flag', flag: 'kompass_klar' }, { type: 'xp', amount: 250 }, { type: 'heal' }, { type: 'container', kind: 'liv', id: 'kompass' }],
    next: 'johan_xp',
  },

  johan_xp: {
    pages: ['Dagny fick 250 XP och en LIVBEHÅLLARE av Johan.'],
  },

  johan_glad: {
    speaker: 'Fiskaren Johan',
    pages: ['Nålen har inte darrat sedan du kom med den.'],
  },

  hittade_kompass: {
    pages: ['Dagny hittade en KOMPASS i en mässingsdosa. Den är nog Johans.'],
  },

  fiske_skylt: {
    pages: ['En skylt på bryggan:\n"HOPPA EJ I. VATTNET ÄR KALLT, ÄVEN I JULI."'],
  },

  stina: {
    speaker: 'Stina',
    pages: ['Fyren har inte lyst på hela sommaren. Pappa säger att Havsfrun har blåst ut den.'],
  },

  stina_efter: {
    speaker: 'Stina',
    pages: ['Fyren lyser igen! Jag räknar blinkarna innan jag somnar. Jag kommer alltid till tjugo.'],
  },

  ture: {
    speaker: 'Gamle Ture',
    pages: [
      'Jag var fyrvaktare innan de gjorde fyren automatisk.',
      'Midsommarnatten 1946 såg jag ett ljus gå ner över Kyrkbyn. Jag skrev det i loggboken. Ingen trodde mig.',
    ],
  },

  // Return with the radio (chapter 7): the old coast transmitter and a recording of Dagmar.
  ture_sandare: {
    speaker: 'Gamle Ture',
    pages: [
      'En transistorradio? Då ska du få höra något. Jag har kvar fyrens gamla sändare och trådspelaren.',
      'Midsommarafton 1946 ropade någon upp fyren från stranden mitt emot Kyrkbyn. Jag spelade in det.',
      'Bandet knastrar. En kvinnoröst: "Fyren, fyren. Hälsa Hulda att jag inte kommer i kväll. Säg att hon ska se efter klockstapeln."',
      'Jag förstod aldrig vad hon menade. Men du gör det.',
    ],
    actions: [{ type: 'flag', flag: 'ture_sandare' }, { type: 'xp', amount: 150 }],
  },

  ture_efter: {
    speaker: 'Gamle Ture',
    pages: ['Nu vet du att jag inte ljög. Tack för att du tände fyren.'],
  },
};
