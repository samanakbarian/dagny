import type { DialogDef } from '../types';

/** The small places on the map, each with a little task: the churchyard, the charcoal croft, the plague cross, the stone ship, the milestone, the summer-farm croft. */
export const SMAPLATSER: Record<string, DialogDef> = {
  // --- Gamla kyrkogården: read the stones, move the right one ------------------------------
  kyrkogarden_grind: {
    pages: [
      'En bleck skylt på grinden, i kyrkvaktarens krumelurer:',
      '"MIN PLÅTASK LIGGER UNDER STENEN HOS DEN SOM SOMNADE PÅ MIDSOMMARDAGEN. DEN SOM LÄSER STENARNA HITTAR DEN."',
    ],
  },
  sten_anna: {
    pages: ['"ANNA LARSDOTTER 1801–1866.\nSOMNADE PÅ MIKAELIDAGEN."'],
    choices: [
      { text: 'Rucka på stenen', next: 'sten_fast' },
      { text: 'Låt den stå' },
    ],
  },
  sten_per: {
    pages: ['"PER ERSSON, GRUVFOGDE 1820–1871.\nGICK NER I GRUVAN PÅ KYNDELSMÄSSODAGEN OCH KOM ALDRIG UPP."'],
    choices: [
      { text: 'Rucka på stenen', next: 'sten_fast' },
      { text: 'Låt den stå' },
    ],
  },
  sten_johan: {
    pages: ['"JOHAN SVENSSON 1838–1902.\nSOMNADE PÅ JULAFTON."'],
    choices: [
      { text: 'Rucka på stenen', next: 'sten_fast' },
      { text: 'Låt den stå' },
    ],
  },
  sten_fast: {
    pages: ['Stenen sitter fast.'],
  },
  sten_karin: {
    pages: ['"KARIN NILSDOTTER 1840–1888.\nSOMNADE PÅ MIDSOMMARDAGEN."\nStenen lutar lite.'],
    choices: [
      { text: 'Rucka på stenen', next: 'sten_karin_ask' },
      { text: 'Låt den stå' },
    ],
  },
  sten_karin_ask: {
    pages: [
      'Stenen glider åt sidan. I gropen ligger en rostig plåtask.',
      'I asken ligger en lapp, och under den blänker något.\n"Till den som läser stenarna. /Kyrkvaktaren, 1946"',
    ],
    actions: [
      { type: 'flag', flag: 'karins_sten_rubbad' },
      { type: 'xp', amount: 40 },
    ],
  },
  sten_karin_tom: {
    pages: ['Stenen står snett. Gropen är tom.'],
  },

  // --- Kolartorpet: light the dead charcoal stack with Eld ----------------------------------
  kolartorpet_skylt: {
    pages: ['Ett ödetorp vid hygget. Marken är svart efter kolmilan. När det regnar luktar det rök.'],
  },
  kolmila_kall: {
    pages: [
      'Kolmilan har slocknat. Veden därinne är kall.',
      'Det behövs riktig eld. Prosten i Kyrkbyn ska kunna en läsning.',
    ],
  },
  kolmila_eld: {
    pages: ['Kolmilan har slocknat. Den väntar på eld.'],
  },
  kolmila_tand: {
    pages: [
      'Lågan kryper in under torven. Röken stiger, rak och blå.',
      'I röken lyfter en gammal man på mössan. Där han stod blänker något i askan.',
    ],
    actions: [{ type: 'xp', amount: 60 }],
  },

  // --- Pestkorset: flowers for the dead ---------------------------------------------------
  pestkorset_skylt: {
    pages: ['Ett vägkors av ek:\n"TILL MINNE AV DEM SOM DOG I FARSOTEN 1711."'],
  },
  grafru_ber: {
    speaker: 'Den grå frun',
    pages: [
      'Du ser mig? Det var länge sedan någon gjorde det.',
      'De som vilar här fick aldrig några blommor. Ingen vågade komma nära, det året.',
      'Uppe på klippan växer prästkragar. Plocka en bukett åt dem.',
    ],
    actions: [{ type: 'flag', flag: 'grafru_bad' }],
  },
  grafru_vantar: {
    speaker: 'Den grå frun',
    pages: ['Prästkragarna växer högt uppe på klippan. Jag väntar.'],
  },
  grafru_tack: {
    speaker: 'Den grå frun',
    pages: [
      'Prästkragar. Som på ängen hemma.',
      'Ta den här näverdockan. Jag flätade den åt min dotter. Den håller ett liv åt dig.',
      'Den grå frun bleknar bort i solen.',
    ],
    actions: [
      { type: 'takeItem', item: 'prastkragar' },
      { type: 'flag', flag: 'prastkragar_klar' },
      { type: 'flag', flag: 'grafru_frid' },
      { type: 'life', id: 'pestkorset' },
      { type: 'xp', amount: 40 },
    ],
  },
  hittade_prastkragar: {
    pages: ['Dagny plockade en bukett PRÄSTKRAGAR.'],
  },

  // --- Skeppssättningen: the missing piece of the rune stone --------------------------------
  skeppssattningen_skylt: {
    pages: ['Stenar ställda som ett skepp, med stäven mot havet. Fiskarna säger att en hövding seglar ut i det när det stormar.'],
  },
  runsten_trasig: {
    pages: ['En runsten vid aktern. En bit är bortslagen. Den ligger någonstans i sanden.'],
  },
  runsten_laga: {
    pages: [
      'Biten passar. Runorna lyser upp, en efter en.',
      'Det susar i stenskeppet, som av ett segel. Vid stenens fot ligger en bärnstensamulett. Den håller ett liv åt den som bär den.',
    ],
    actions: [
      { type: 'takeItem', item: 'runbit' },
      { type: 'flag', flag: 'runbit_klar' },
      { type: 'flag', flag: 'runstenen_hel' },
      { type: 'life', id: 'skeppssattningen' },
      { type: 'xp', amount: 50 },
    ],
  },
  runsten_hel: {
    pages: ['"HÖVDINGEN SEGLAR VIDARE, SÅ LÄNGE NÅGON MINNS HONOM."'],
  },
  hittade_runbit: {
    pages: ['Dagny hittade en RUNSTENSBIT i sanden.'],
  },

  // --- Milstolpen: the drowned postman's horn ------------------------------------------------
  milstolpen_skylt: {
    pages: ['En milstolpe: "TILL STADEN 2 MIL".\nVägen finns inte kvar. Vårfloden tog bron.'],
  },
  postiljon_ber: {
    speaker: 'Postiljonen',
    pages: [
      'Postiljon Lindgren. Jag var på bron med söndagsposten när floden kom.',
      'Posten kom fram. Men hornet for i forsen. Utan horn kan jag inte blåsa att posten är här.',
      'Det ligger nog på stenarna nedanför. Akta strömmen.',
    ],
    actions: [{ type: 'flag', flag: 'postiljon_bad' }],
  },
  postiljon_vantar: {
    speaker: 'Postiljonen',
    pages: ['Hornet ligger på stenarna nere vid forsen.'],
  },
  postiljon_tack: {
    speaker: 'Postiljonen',
    pages: [
      'Mitt horn!',
      'Postiljonen blåser en lång ton över forsen. Långt borta svarar en annan.',
      'Det här brevet har aldrig kunnat delas ut. Adressaten är borta. Ta det.\nI kuvertet ligger en MAGIBEHÅLLARE.',
    ],
    actions: [
      { type: 'takeItem', item: 'posthorn' },
      { type: 'flag', flag: 'posthorn_klar' },
      { type: 'container', kind: 'magi', id: 'milstolpen' },
      { type: 'xp', amount: 80 },
    ],
  },
  postiljon_frid: {
    speaker: 'Postiljonen',
    pages: ['Sista turen går vid solnedgången. Hälsa er mormor.'],
  },
  hittade_posthorn: {
    pages: ['Dagny hittade POSTHORNET. Det är bucklat men glänser.'],
  },

  // --- Fäbodtorpet: clear the healing spring ------------------------------------------------
  fabodtorpet_skylt: {
    pages: ['Fäbodtorpet. Spisen står kvar. På hyllan en näverask med torkade örter.'],
  },
  kalla_igensatt: {
    pages: ['Trefaldighetskällan. Förr drack folk här för att bli friska. Nu är den igensatt av löv och kvistar.'],
    choices: [
      { text: 'Rensa källan', next: 'kalla_rensa' },
      { text: 'Låt den vara' },
    ],
  },
  kalla_rensa: {
    pages: [
      'Dagny rensar bort löven. Vattnet porlar, kallt och klart.',
      'Vid kanten blänker något som någon offrade här en gång.',
    ],
    actions: [
      { type: 'flag', flag: 'kallan_rensad' },
      { type: 'heal' },
      { type: 'magic' },
    ],
  },
  kalla_drick: {
    pages: ['Vattnet är iskallt och smakar järn. Liv och magi är fyllda.'],
    actions: [{ type: 'heal' }, { type: 'magic' }],
  },
};
