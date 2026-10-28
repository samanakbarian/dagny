import type { DialogDef } from '../types';

/** Kyrkbyn: the church, the bell tower where Dagny was found, Prosten (Eld) and Ingrid's hymn book. */
export const KYRKBYN: Record<string, DialogDef> = {
  signe_vila: {
    speaker: 'Signe i prästgården',
    pages: ['Prästgården har fler rum än präster. Vill du vila?'],
    choices: [
      { text: 'Vila i prästgården', next: 'signe_vilat', actions: [{ type: 'rest' }] },
      { text: 'Inte nu', next: 'signe_hej' },
    ],
  },

  signe_vilat: {
    speaker: 'Signe i prästgården',
    pages: ['Alla sover gott under kyrkklockan.'],
  },

  signe_hej: {
    speaker: 'Signe i prästgården',
    pages: ['Dörren är olåst. Det har den varit sedan 1700-talet.'],
  },

  prosten_lar: {
    speaker: 'Prosten',
    pages: [
      'Flickan från klockstapeln. Jag döpte dig. Du skrek så att det ekade i valvet.',
      'Kryptan sover lugnt nu. Då ska du få det som den förra Väktaren lärde ut här.',
      '"Eld i järn, eld i sol, eld som midsommarnatten stal."',
    ],
    actions: [{ type: 'learnSpell', spell: 'eld' }],
    next: 'lart_eld',
  },

  lart_eld: {
    pages: ['Dagny lärde sig läsningen ELD!\nSvärdet skjuter eldbollar en stund.'],
  },

  prosten_igen: {
    speaker: 'Prosten',
    pages: ['Det som inte går att hugga går ibland att bränna.'],
  },

  prosten_vanta: {
    speaker: 'Prosten',
    pages: [
      'Något rör sig under kyrkan. Om nätterna skaver det som sten mot sten.',
      'Gå ner i kryptan. Kom tillbaka sedan, så har jag något åt dig.',
    ],
  },

  prosten_efter: {
    speaker: 'Prosten',
    pages: ['I morse ringde klockan av sig själv igen. Men den här gången lät den glad.'],
  },

  ingrid_uppdrag: {
    speaker: 'Ingrid',
    pages: [
      'Jag tappade min psalmbok i kryptan när ljusen slocknade.',
      'Mor fick den när hon konfirmerades. Det ligger pressade blommor i den.',
    ],
    actions: [{ type: 'flag', flag: 'psalmbok_uppdrag' }],
  },

  ingrid_vantar: {
    speaker: 'Ingrid',
    pages: ['Den ligger i kryptan, i rummet med de tre valven. Jag satt längst upp.'],
  },

  ingrid_tack: {
    speaker: 'Ingrid',
    pages: [
      'Där är den! Och blommorna ligger kvar.',
      'Här, ta det här.',
    ],
    actions: [{ type: 'takeItem', item: 'psalmbok' }, { type: 'flag', flag: 'psalmbok_klar' }, { type: 'xp', amount: 150 }, { type: 'heal' }],
    next: 'ingrid_xp',
  },

  ingrid_xp: {
    pages: ['Dagny fick 150 XP och känner sig utvilad.'],
  },

  ingrid_glad: {
    speaker: 'Ingrid',
    pages: ['Jag har pressat en prästkrage åt dig. Den ligger vid midsommarpsalmen.'],
  },

  hittade_psalmbok: {
    pages: ['Dagny hittade en PSALMBOK med torkade blommor mellan bladen. Den är nog Ingrids.'],
  },

  bosse: {
    speaker: 'Bosse',
    pages: ['Jag har klättrat halvvägs upp i klockstapeln! Prosten blev arg.'],
  },

  bosse_efter: {
    speaker: 'Bosse',
    pages: ['Prosten säger att det inte spökar i kryptan längre. Jag går nog ner i morgon.'],
  },

  kyrkby_klockstapel: {
    pages: [
      'Den gamla klockstapeln.',
      'En mässingsskylt på stolpen:\n"MIDSOMMARNATTEN 1946 RINGDE JAG AV MIG SJÄLV."',
    ],
  },

  tyra: {
    speaker: 'Gamla Tyra',
    pages: [
      'Den natten 1946 var jag vaken. En kvinna med kopparhår kom förbi med en korg.',
      'Hon stannade vid klockstapeln och grät. Sedan gick hon mot Trollberget. Utan korgen.',
      'Folk sa att Väktaren gick in i berget och höll det stilla med sina egna händer. Nu mullrar det igen.',
      'Kopparhår. Som ditt. ...Nej. Det är inte min sak att säga. Fråga Hulda.',
    ],
  },

  tyra_efter: {
    speaker: 'Gamla Tyra',
    pages: ['Jag såg ljuset över Trollberget i morse. Hon är fri nu. Och den som är fri hittar hem, förr eller senare.'],
  },
};
