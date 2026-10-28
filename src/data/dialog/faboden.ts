import type { DialogDef } from '../types';

/** Fäboden: the summer farm, gammelmor Karna (Hamn) and Lill-Per's cow bell. */
export const FABODEN: Record<string, DialogDef> = {
  anna_vila: {
    speaker: 'Budejan Anna',
    pages: ['Det finns mjölk i kallkällan och en bädd i stugan. Vill du vila?'],
    choices: [
      { text: 'Vila i stugan', next: 'anna_vilat', actions: [{ type: 'rest' }] },
      { text: 'Inte nu', next: 'anna_hej' },
    ],
  },

  anna_vilat: {
    speaker: 'Budejan Anna',
    pages: ['Korna har redan gått ut. Jag nändes inte väcka dig.'],
  },

  anna_hej: {
    speaker: 'Budejan Anna',
    pages: ['I Fäbodskogen går man lätt vilse. Även vi som bor här.'],
  },

  karna_lar: {
    speaker: 'Gammelmor Karna',
    pages: [
      'Jaså. Det är du. Skogen har viskat om dig.',
      'Jag kan byta hamn. Bli en liten fågel och komma in där ingen annan kommer in.',
      '"Hamn av fjäder, hamn av vind, byt mig om och ta mig in." Flyg inte för länge. Då glömmer du vem du är.',
    ],
    actions: [{ type: 'learnSpell', spell: 'hamn' }],
    next: 'lart_hamn',
  },

  lart_hamn: {
    pages: ['Dagny lärde sig läsningen HAMN!\nDagny blir en liten fågel en stund och kan flyga genom trånga passager.'],
  },

  karna_igen: {
    speaker: 'Gammelmor Karna',
    pages: ['Uppifrån ser man vad som hänger ihop.'],
  },

  karna_vanta: {
    speaker: 'Gammelmor Karna',
    pages: [
      'Du är inte redo än.',
      'Gå ner i gruvan först. Kom tillbaka sedan.',
    ],
  },

  lillper_uppdrag: {
    speaker: 'Lill-Per',
    pages: [
      'Stjärna har tappat sin skälla! Nu hittar jag henne inte i skogen.',
      'Den ramlade nog av vid de tre stigarna. Där vågar jag inte gå. Det fnissar mellan granarna.',
    ],
    actions: [{ type: 'flag', flag: 'skalla_uppdrag' }],
  },

  lillper_vantar: {
    speaker: 'Lill-Per',
    pages: ['Skällan ligger nog vid Villvägarna, där stigen delar sig i tre.'],
  },

  lillper_tack: {
    speaker: 'Lill-Per',
    pages: [
      'Den klingar! Hör du, Stjärna?',
      'Ta det här. Jag har inget annat.',
    ],
    actions: [{ type: 'takeItem', item: 'skalla' }, { type: 'flag', flag: 'skalla_klar' }, { type: 'xp', amount: 150 }, { type: 'heal' }],
    next: 'lillper_xp',
  },

  lillper_xp: {
    pages: ['Dagny fick 150 XP och känner sig utvilad.'],
  },

  lillper_glad: {
    speaker: 'Lill-Per',
    pages: ['Jag hör skällan ända från stugan.'],
  },

  hittade_skalla: {
    pages: ['Dagny hittade en KOSKÄLLA. Den är nog Stjärnas.'],
  },

  stjarna: {
    pages: ['Kon tittar på Dagny. Hon saknar sin skälla.'],
  },

  stjarna_glad: {
    pages: ['Stjärna råmar. Skällan klingar.'],
  },

  rosen: {
    pages: ['En fjällko med stora horn. Hon tuggar och bryr sig inte om något annat.'],
  },

  britta: {
    speaker: 'Britta',
    pages: ['Mormor Karna säger att hon kan bli en uggla. Jag har aldrig sett det.'],
  },

  britta_efter: {
    speaker: 'Britta',
    pages: ['Skogsrået sjunger om nätterna nu. Mormor sjunger med.'],
  },
};
