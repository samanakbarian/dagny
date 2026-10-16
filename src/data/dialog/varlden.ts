import type { DialogDef } from '../types';

/** The overworld: the sleeping mountain, what each border needs, friendly meetings and the caves. */
export const VARLDEN: Record<string, DialogDef> = {
  stollen_ras_skylt: {
    pages: ['Ett kors av två bjälkar, och en lapp i en spik:\n"HÄR GICK TAKET 1931. TRE KOM UT. LYSSNA PÅ BERGET – OCH SPRING."'],
  },
  stollen_skylt: {
    pages: ['Ett murket plank vid ortmynningen:\n"GAMLA STOLLEN. STÄNGD 1931 EFTER RASET. TRÄD EJ IN."', 'Någon har ristat under, med kniv: "Lampan visar vägen. Håll dig från taket."'],
  },

  mote_vatte_liv: {
    speaker: 'Vätten',
    pages: ['En vätte kliver fram ur gräset med en kopp kaffe. "Du förlikade min släkt i templen. Drick nu, Väktare."', 'Dagny känner sig starkare. Livet är fyllt.'],
    actions: [{ type: 'heal' }],
  },

  mote_vatte_magi: {
    speaker: 'Vätten',
    pages: ['En vätte sticker åt Dagny en näve hjortron. "Mormor sa att de är bra för läsningarna."', 'Dagny känner hur magin kommer tillbaka.'],
    actions: [{ type: 'magic' }],
  },

  mote_vandrare_lore: {
    speaker: 'Vandraren',
    pages: ['En gesäll med ränsel stannar och hälsar. "Jag hörde en gammal gumma i Kyrkbyn berätta om natten då klockan ringde av sig själv. Hon såg en kvinna med kopparhår gå mot Trollberget."'],
  },

  mote_vandrare_vag: {
    speaker: 'Vandraren',
    pages: ['En skogsarbetare vilar på en stubbe. "Ska du ner till kusten? Då behöver du stövlar, tidvattenkärret tar annars den som går dit. Kvarnen vid forsen säljer inga, men något säger mig att du hittar ett par där."'],
  },

  mote_vandrare_fyr: {
    speaker: 'Vandraren',
    pages: ['En fiskare med håv över axeln nickar. "Gamle Ture i Fiskeläget var fyrvaktare förr. Han skrev upp allt i en loggbok, till och med natten 1946."'],
  },

  mote_irrbloss_radio: {
    pages: ['Ett vänligt irrbloss dansar runt Dagny och surrar som en radio mellan stationerna. Det känns som om det vill säga: i templen finns väggar som surrar på samma sätt.'],
  },

  mote_irrbloss_holmen: {
    pages: ['Ett irrbloss svävar ut över sjön och stannar vid en liten holme mitt i vattnet. Där slocknar det, precis vid en mörk grottöppning.'],
  },

  mote_irrbloss_grottan: {
    pages: ['Ett irrbloss leder Dagny en bit söderut över myren och lyser upp en klippa. Bakom ljungen gapar en grotta. Det fnissar och försvinner.'],
  },

  tjuvgrottan_skylt: {
    pages: ['Någon har ristat i berget med en kniv:\n"HÄR GÖMDE GRÅ-PELLE SITT SILVER 1899. DET SYNS BARA I RÄTT LJUS."'],
  },

  jattegrytan_skylt: {
    pages: ['Vattnet har svarvat ut en jättegryta i berget. Längre in är det beckmörkt. Med en riktigt stark lampa skulle man kanske se vad som döljer sig på väggarna.'],
  },

  jattegrytan_ristning: {
    pages: ['I lampans sken syns två bokstäver ristade i berget, nästan utplånade av vattnet: D. och H. Under dem en liten sol.'],
  },

  trollberget_sover: {
    pages: ['Trollberget reser sig svart mot himlen. Vägen upp är stängd så länge de andra platserna sover.'],
  },

  behover_eka: {
    pages: ['Vattnet är för djupt att vada i. Med en båt skulle det gå.'],
  },

  behover_karbidlampa: {
    pages: ['En gammal gruvgång leder rakt in i berget. Det är beckmörkt där inne. Utan en riktig lampa skulle man gå vilse direkt.'],
  },

  behover_ficklampa: {
    pages: ['Granarna står så tätt att det är natt här mitt på dagen. Man ser inte handen framför sig. Med en stark lampa kanske man hittar stigen.'],
  },

  behover_radio: {
    pages: ['Berget ser ut att vara massivt här. Men det susar konstigt i vinden, som brus mellan två radiostationer.'],
  },

  behover_stovlar: {
    pages: ['Myren suger tag i skorna. Utan stövlar kommer man inte långt.'],
  },

  // --- The hidden caves -----------------------------------------------------------------
  fallgrottan_ristning: {
    pages: ['Inristat i berget bakom vattenridån:\n"DEN SOM GÖMMER SIG BAKOM FALLET HÖRS INTE AV BERGET. – D."'],
  },
  vaktarkammaren_bord: {
    pages: [
      'Ett bord av sten, en ljusstump och en anteckningsbok med fuktiga blad. Handstilen är prydlig.',
      '"Midsommarafton 1946. Jag har lagt henne under klockstapeln och låtit klockan ringa. Mamma är ute på en förlossning, men klockan hör hon. Klingan ligger bredvid, och en lapp."',
      '"I natt går jag in i berget. Någon gång kommer hon att förstå varför." – Dagmar',
      'På sista sidan, med darrigare handstil:\n"Mamma. Det var inte ditt fel. Säg det till dig själv tills du tror på det."',
      'Dagny stoppar anteckningsboken innanför jackan.',
    ],
    actions: [{ type: 'flag', flag: 'anteckningsboken' }],
  },
  vaktarkammaren_vagg: {
    pages: ['På väggen står namn huggna i berget, ett under det andra – Väktare efter Väktare. Näst sist står HULDA. Det sista namnet är DAGMAR. Under det finns plats för ett till.'],
  },
};
