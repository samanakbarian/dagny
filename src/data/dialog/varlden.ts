import type { DialogDef } from '../types';

/** The overworld: the sleeping mountain, what each border needs, friendly meetings and the caves. */
export const VARLDEN: Record<string, DialogDef> = {
  stollen_ras_skylt: {
    pages: ['Ett kors av två bjälkar, och en lapp på en spik:\n"HÄR GICK TAKET 1931. TRE KOM UT. LYSSNA PÅ BERGET OCH SPRING."'],
  },
  stollen_ost_stangd: {
    pages: ['Ortmynningen är igenspikad. Bakom plankorna ligger sten.'],
  },
  sidoorten_stangd: {
    pages: ['Ett igenrasat hål. Det drar kallt mellan stenarna. Därinne går det vidare.'],
  },
  stollen_skylt: {
    pages: ['Ett murket plank:\n"GAMLA STOLLEN. STÄNGD 1931 EFTER RASET. TRÄD EJ IN."', 'Ristat under, med kniv: "Lampan visar vägen. Håll dig från taket."'],
  },

  mote_vatte_liv: {
    speaker: 'Vätten',
    pages: ['En vätte kliver fram ur gräset med en kopp kaffe. "Drick, Väktare."', 'Livet är fyllt.'],
    actions: [{ type: 'heal' }],
  },

  mote_vatte_magi: {
    speaker: 'Vätten',
    pages: ['En vätte ger Dagny en näve hjortron. "Bra för läsningarna."', 'Magin är fylld.'],
    actions: [{ type: 'magic' }],
  },

  mote_vandrare_lore: {
    speaker: 'Vandraren',
    pages: ['En gesäll med ränsel stannar. "En gumma i Kyrkbyn såg en kvinna med kopparhår gå mot Trollberget, natten då klockan ringde av sig själv."'],
  },

  mote_vandrare_vag: {
    speaker: 'Vandraren',
    pages: ['En skogsarbetare på en stubbe. "Ska du mot kusten? Akta tidvattenkärret. Det tar skorna av folk."'],
  },

  mote_vandrare_fyr: {
    speaker: 'Vandraren',
    pages: ['En fiskare med håv nickar. "Gamle Ture i Fiskeläget var fyrvaktare. Han skrev upp allt i en loggbok. Även natten 1946."'],
  },

  mote_irrbloss_radio: {
    pages: ['Ett irrbloss dansar runt Dagny och surrar som en radio mellan stationerna. I templen finns väggar som surrar likadant.'],
  },

  mote_irrbloss_holmen: {
    pages: ['Ett irrbloss svävar ut över sjön och slocknar vid en mörk grottöppning på en liten holme.'],
  },

  mote_irrbloss_grottan: {
    pages: ['Ett irrbloss leder Dagny söderut över myren. Bakom ljungen gapar en grotta. Irrblosset fnissar och är borta.'],
  },

  tjuvgrottan_skylt: {
    pages: ['Ristat med kniv:\n"HÄR GÖMDE GRÅ-PELLE SITT SILVER 1899. DET SYNS BARA I RÄTT LJUS."'],
  },

  jattegrytan_skylt: {
    pages: ['En jättegryta i berget. Längre in är det beckmörkt. Något skymtar på väggarna.'],
  },

  jattegrytan_ristning: {
    pages: ['I lampans sken syns två nästan utplånade bokstäver: D. och H. Under dem en liten sol.'],
  },

  trollberget_sover: {
    pages: ['Trollberget reser sig svart mot himlen. Vägen upp är stängd så länge de andra platserna sover.'],
  },

  behover_eka: {
    pages: ['Vattnet är svart och djupt.'],
  },

  behover_karbidlampa: {
    pages: ['En gammal gruvgång leder in i berget. Där inne är det kolsvart.'],
  },

  behover_ficklampa: {
    pages: ['Granarna står så tätt att det är natt mitt på dagen.'],
  },

  behover_radio: {
    pages: ['Berget ser massivt ut. Men det susar konstigt i vinden.'],
  },

  behover_stovlar: {
    pages: ['Myren suger tag i skorna.'],
  },

  // --- The hidden caves -----------------------------------------------------------------
  fallgrottan_ristning: {
    pages: ['Ristat bakom vattenridån:\n"DEN SOM GÖMMER SIG BAKOM FALLET HÖRS INTE AV BERGET. /D."'],
  },
  // --- Bruset: Dagmar's voice in the radio's static (chapter 7) ---
  bruset_1: {
    pages: [
      'Radion sprakar. Långt inne i bruset, en kvinnoröst:',
      '"...mamma... om någon hör det här... berget är så tyst om nätterna..."',
    ],
    actions: [{ type: 'flag', flag: 'bruset_1' }, { type: 'xp', amount: 100 }],
  },
  bruset_2: {
    pages: [
      'Radion sprakar. Rösten igen, längre bort:',
      '"...jag räknar somrarna. Tre korta, tre långa, tre korta. Ingen svarar härinne..."',
    ],
    actions: [{ type: 'flag', flag: 'bruset_2' }, { type: 'xp', amount: 100 }],
  },
  bruset_3: {
    pages: [
      'Radion sprakar. Rösten är nästan glad:',
      '"...hon har väl fått ett namn nu. Jag hoppas att det är ett ljust namn..."',
    ],
    actions: [{ type: 'flag', flag: 'bruset_3' }, { type: 'xp', amount: 100 }],
  },
  bruset_4: {
    pages: [
      'Radion sprakar. Rösten är alldeles nära:',
      '"...någon går på stigarna igen. Jag hör det genom berget..."',
    ],
    actions: [{ type: 'flag', flag: 'bruset_4' }, { type: 'xp', amount: 100 }],
  },
  bruset_klart: {
    pages: [
      'Bruset tystnar.',
      'Sedan, tydligt: tre korta, tre långa, tre korta.',
    ],
    actions: [{ type: 'flag', flag: 'bruset_klart' }, { type: 'life', id: 'bruset' }, { type: 'xp', amount: 300 }],
  },
  kyrkbacken_utsikt: {
    pages: [
      'Från stenröset på Kyrkbacken ser Dagny ut över hela sjön.',
      'Kyrkbyn nedanför, holmarna i sjön, och långt bort en strand med en ensam sten.',
      'Allt hon ser härifrån ritas in på kartan i pausmenyn.',
    ],
    actions: [{ type: 'flag', flag: 'kyrkbacken_sedd' }],
  },
  // --- Bergsstigen (chapter 8) ---
  vattegang_skylt: {
    pages: ['Ristat i berget, bredvid en liten vättehand:\n"TRE GÅNGAR. EN BÄR UPP. VÄTTARNA VET VILKEN."'],
  },
  berg_villse: {
    pages: ['Gången vänder i mörkret... och Dagny står där hon började. Någonstans fnissar en vätte.'],
  },
  rasbranten_skylt: {
    pages: ['Skrivet med kol på en sten: "HIT BLÅSER STORMEN DEN SOM STÅR STILLA. VÄGEN GÅR BARA NER."'],
  },
  stollen_gomd_ristning: {
    pages: [
      'I en gammal stolpe: ett stort H och ett litet, vingligt D.',
      'Under dem, med det stora H:ets hand:\n"Här lärde jag henne lyssna på berget. H.D. 1934"',
    ],
  },
  vaktarkammaren_bord: {
    pages: [
      'Ett stenbord, en ljusstump och en anteckningsbok med fuktiga blad.',
      '"Midsommarafton 1946. Hon ligger under klockstapeln. Klockan ringer. Mamma hör den, var hon än är."',
      '"I natt går jag in i berget." /Dagmar',
      'På sista sidan, med darrigare hand:\n"Mamma. Det var inte ditt fel."',
      'Dagny stoppar anteckningsboken innanför jackan.',
    ],
    actions: [{ type: 'flag', flag: 'anteckningsboken' }],
  },
  vaktarkammaren_vagg: {
    pages: ['Namn huggna i berget, Väktare efter Väktare. Näst sist står HULDA. Sist står DAGMAR. Under det finns plats för ett till.'],
  },
};
