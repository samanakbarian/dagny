import type { DialogDef } from '../types';

/** Gruvsamhället: Maj at the boarding house, gamla Elin (Lyse) and Anders' pocket watch. */
export const GRUVSAMHALLET: Record<string, DialogDef> = {
  maj_vila: {
    speaker: 'Maj på pensionatet',
    pages: ['Rum med utsikt över lavtornet, frukost klockan sju. Vill du vila?'],
    choices: [
      { text: 'Vila på pensionatet', next: 'maj_vilat', actions: [{ type: 'rest' }] },
      { text: 'Inte nu', next: 'maj_hej' },
    ],
  },

  maj_vilat: {
    speaker: 'Maj på pensionatet',
    pages: ['God morgon! Jag har skrivit in dig i gästboken.'],
  },

  maj_hej: {
    speaker: 'Maj på pensionatet',
    pages: ['Gruvfolk sover dåligt. Någon är alltid vaken här.'],
  },

  elin_uppdrag: {
    speaker: 'Gamla Elin',
    pages: [
      'Det är inte många som hittar upp hit.',
      'Jag kan en läsning för ljus. Men den behöver en solsten att tändas av.',
      'Dagmar hade en. Den ligger kvar på ett skär där dimman är som tätast. Hämta den.',
    ],
    actions: [{ type: 'flag', flag: 'solsten_uppdrag' }],
  },

  /** Asked for it, but Dagny has it already: straight on to the lesson. */
  elin_uppdrag_har: {
    speaker: 'Gamla Elin',
    pages: [
      'Det är inte många som hittar upp hit.',
      'Jag kan en läsning för ljus. Men den behöver en solsten att tändas av.',
      'Vänta. Vad är det du har där?',
    ],
    actions: [{ type: 'flag', flag: 'solsten_uppdrag' }],
    next: 'elin_lar',
  },

  elin_vantar: {
    speaker: 'Gamla Elin',
    pages: ['Solstenen ligger på ett skär i dimman. Där måsarna håller till.'],
  },

  elin_lar: {
    speaker: 'Gamla Elin',
    pages: [
      'Solstenen! Det är hennes. Den lyser fortfarande.',
      'Gruvan är mörkare nu än på hundra år. Du behöver det här.',
      '"Lyse i natt, lyse i berg, lyse för den som går utan färg."',
      'Det som gömmer sig i dimma tål inte ljus.',
    ],
    actions: [{ type: 'takeItem', item: 'solsten' }, { type: 'flag', flag: 'solsten_klar' }, { type: 'learnSpell', spell: 'lyse' }],
    next: 'lart_lyse',
  },

  lart_lyse: {
    pages: ['Dagny lärde sig läsningen LYSE!\nDen lyser upp mörka gruvor och valv en lång stund.'],
  },

  elin_igen: {
    speaker: 'Gamla Elin',
    pages: ['Hälsa på rået när du går ner. Tacka henne när du kommer upp.'],
  },

  elin_efter: {
    speaker: 'Gamla Elin',
    pages: ['Jag hörde lyktorna tändas där nere, en efter en. Hon har förlåtit oss.'],
  },

  anders_uppdrag: {
    speaker: 'Gruvarbetaren Anders',
    pages: [
      'Jag tappade mitt fickur nere i Orten när lyktorna slocknade.',
      'Det var farfars. Jag vågar inte gå ner igen.',
    ],
    actions: [{ type: 'flag', flag: 'fickur_uppdrag' }],
  },

  anders_vantar: {
    speaker: 'Gruvarbetaren Anders',
    pages: ['Orten ligger efter hisschaktet. Uret är nog längst in, vid lyktan under valvet.'],
  },

  anders_tack: {
    speaker: 'Gruvarbetaren Anders',
    pages: [
      'Det tickar fortfarande! Farfar sa att det stannar den dag gruvan dör.',
      'Ta det här.',
    ],
    actions: [
      { type: 'takeItem', item: 'fickur' },
      { type: 'flag', flag: 'fickur_klar' },
      { type: 'xp', amount: 120 },
      { type: 'heal' },
    ],
    next: 'anders_xp',
  },

  anders_xp: {
    pages: ['Dagny fick 120 XP och känner sig utvilad.'],
  },

  anders_glad: {
    speaker: 'Gruvarbetaren Anders',
    pages: ['Jag lyssnar på uret varje kväll innan jag somnar.'],
  },

  hittade_fickur: {
    pages: ['Dagny hittade ett FICKUR i mässing. Det tickar. Det är nog Anders.'],
  },

  lisa: {
    speaker: 'Lisa',
    pages: [
      'Gruvan stängde när jag var liten. Men om nätterna hör jag hackor där nere.',
      'Ibland står en grå tant vid lavtornet med en lykta. Hon vinkar aldrig tillbaka.',
    ],
  },

  lisa_efter: {
    speaker: 'Lisa',
    pages: ['I går vinkade den grå tanten tillbaka! Ingen tror mig.'],
  },

  nils: {
    speaker: 'Gruvarbetaren Nils',
    pages: ['Bolaget vill riva lavtornet. Men ingen vågar gå nära schaktet sedan lyktorna slocknade.'],
  },

  nils_efter: {
    speaker: 'Gruvarbetaren Nils',
    pages: ['Lavtornet får stå kvar, sa bolaget i dag. Ingen ville riva det längre.'],
  },
};
