import type { DialogDef } from '../types';

/** The lake: the hermit on his island, Måsskäret in the fog, and the signal stone on the far shore. */
export const SJON: Record<string, DialogDef> = {
  // --- Eremitholmen --------------------------------------------------------------------------
  eremit_skylt: {
    pages: ['En båtlänning av gamla plankor. I en stolpe är det ristat streck, ett för varje vinter. Det är många streck.'],
  },
  eremit_forsta: {
    speaker: 'Eremiten',
    pages: [
      'En båt på sjön igen. Den ekan känner jag igen.',
      'Förr rodde en kvinna hit om kvällarna. Kopparhår, som ditt. Hon satt där du står och såg mot Kyrkbyn.',
      'Sedan rodde hon till sanden på andra stranden och blinkade med sin lampa. Varje kväll.',
      'I dimman i söder ligger ett skär som bara måsarna hittar till. Där brukade hon vila.',
      'Akta strömmen i sydväst. Där rinner sjön ut i forsen.',
    ],
    actions: [{ type: 'flag', flag: 'eremit_traffad' }, { type: 'flag', flag: 'rykte_masskaret' }, { type: 'flag', flag: 'rykte_signalstranden' }],
  },
  eremit_igen: {
    speaker: 'Eremiten',
    pages: ['Gruvan i norr har stått tyst länge. Men när sjön är stilla hör jag hackor därinne.'],
  },

  // --- Måsskäret -----------------------------------------------------------------------------
  masskaret_ristning: {
    pages: [
      'I berghällen är det ristat en liten sol. Under den ett D.',
      'Bredvid, med en annan hand, ett H.',
    ],
  },

  // --- Signalstranden ------------------------------------------------------------------------
  signalsten_las: {
    pages: [
      'En stor sten vid vattnet. I den är det ristat tre streck, tre ringar, tre streck.',
      'Långt borta över sjön syns klockstapeln i Kyrkbyn.',
    ],
  },
  signalsten_ficklampa: {
    pages: [
      'Tre streck, tre ringar, tre streck. Över sjön står klockstapeln i Kyrkbyn.',
      'Dagny tar fram ficklampan.',
    ],
    choices: [
      { text: 'Blinka: tre korta, tre långa, tre korta', actions: [{ type: 'signal', then: 'signalen_besvaras' }] },
      { text: 'Låt bli' },
    ],
  },
  signalen_besvaras: {
    pages: ['Ljuset i klockstapeln lyser en stund. Sedan slocknar det.'],
    actions: [{ type: 'flag', flag: 'signalen_besvarad' }, { type: 'life', id: 'signalen' }, { type: 'xp', amount: 100 }],
  },
  signalsten_besvarad: {
    pages: ['Stenen är sval. Klockstapeln på andra sidan är mörk.'],
  },
  hulda_signal: {
    speaker: 'Mormor Hulda',
    pages: [
      'Jag såg ditt ljus i går kväll. Tre korta, tre långa, tre korta.',
      'Jag gick upp i klockstapeln och svarade. Arton år har jag stått där och tittat ut över sjön.',
      'Nu har någon blinkat tillbaka.',
    ],
    actions: [{ type: 'flag', flag: 'hulda_signal' }],
  },
};
