import type { DialogDef } from './types';

/**
 * All dialog in the game. Dagny never speaks: choices describe what she
 * does, never what she says. Keep pages short – they are typed out letter by
 * letter on a postcard and must fit four lines.
 */
export const DIALOG: Readonly<Record<string, DialogDef>> = {
  // --- Intro (new game) --------------------------------------------------------
  intro_hulda: {
    speaker: 'Mormor Hulda',
    pages: [
      'Där är du, Dagny. Sätt dig. Kaffet är nyss kokat.',
      'Du har väl också märkt det. Sommaren är så mörk i år. Irrblossen dansar över myren mitt på dagen.',
      'Förr vaktades de sju heliga platserna av Väktarna. De höll fred mellan folket och skogens väsen.',
      'Men folk glömmer. Ledningarna dras fram, ungdomarna flyttar till stan... och platserna vaknar i vrede.',
      'Den sista Väktaren försvann midsommarnatten 1946. Samma natt som jag hittade dig under klockstapeln.',
      'Bredvid dig låg en klinga utan fäste. Jag har smitt ihop den åt dig, med kläppen från kyrkklockan.',
      'Ta den. Inte för att förinta väsendena, mitt barn – utan för att förlika världarna.',
      'Gå först till Stenkyrkan i norr. Kryptan där nere har börjat ringa igen om nätterna.',
      'Och prata med gamle Sven innan du går. Han kan en läsning eller två.',
    ],
    actions: [
      { type: 'giveItem', item: 'svard' },
      { type: 'flag', flag: 'intro_done' },
    ],
    next: 'fick_svard',
  },
  fick_svard: {
    pages: ['Dagny fick KLINGAN!\nSvärd: X / B-knappen. Håll NER för att slå lågt.'],
  },
  hulda_vila: {
    speaker: 'Mormor Hulda',
    pages: ['Du ser trött ut, lilla vän. Vill du vila en stund? Jag håller kaffet varmt.'],
    choices: [
      { text: 'Vila hos mormor', next: 'hulda_vilat', actions: [{ type: 'rest' }] },
      { text: 'Gå vidare', next: 'hulda_hej' },
    ],
  },
  hulda_vilat: {
    speaker: 'Mormor Hulda',
    pages: ['Så där. Nu har du sovit gott. Liv och magi är fyllda, och jag har skrivit upp var du är.'],
  },
  hulda_hej: {
    speaker: 'Mormor Hulda',
    pages: ['Akta dig för myren. Och kom hem till middag.'],
  },
  hulda_efter_krypta: {
    speaker: 'Mormor Hulda',
    pages: [
      'Dagny! Såg du? Solen bröt igenom molnen över Stenkyrkan i morse. Hela byn stod ute och tittade.',
      'Den gamla grimmen har slutit fred... Då är det sant. Du är den vi väntat på.',
      'Sex platser återstår. Vila nu, så pratar vi mer i morgon.',
    ],
    actions: [{ type: 'flag', flag: 'hulda_efter_krypta' }, { type: 'rest' }],
  },

  // --- Sven: the elder who teaches Läkning -------------------------------------
  sven_lar: {
    speaker: 'Gamle Sven',
    pages: [
      'Så Hulda har skickat dig. Hmm. Du har din mors ögon, det har du.',
      'Hör här nu. Det här är en gammal läsning mot värk. Min farmor lärde mig den vid vedspisen.',
      '"Värk ut, värk ner, i jord och sten, läk kött och ben..." Så. Nu kan du den.',
    ],
    actions: [{ type: 'learnSpell', spell: 'lakning' }],
    next: 'lart_lakning',
  },
  lart_lakning: {
    pages: ['Dagny lärde sig läsningen LÄKNING!\nMagi: C / Y-knappen. Byt läsning i pausmenyn.'],
  },
  sven_igen: {
    speaker: 'Gamle Sven',
    pages: ['Läkningen kostar magi. Kaffe hjälper, så klart. Det finns termosar överallt där väsen har varit.'],
  },
  sven_efter: {
    speaker: 'Gamle Sven',
    pages: ['Det har inte varit så här ljust på år och dag. Min farmor hade varit stolt över dig, jäntan.'],
  },

  // --- Algot: the mentor who teaches the downward thrust --------------------------
  algot_lar: {
    speaker: 'Smeden Algot',
    pages: [
      'Så det är du som bär klockans kläpp nu. Den har slagit tolv slag varje midsommar i hundra år.',
      'Ett råd från en gammal smed: när du hoppar, håll NER och låt tyngden göra jobbet.',
    ],
    actions: [
      { type: 'learnSkill', skill: 'nedatstot' },
      { type: 'flag', flag: 'algot_lart' },
    ],
    next: 'lart_nedatstot',
  },
  lart_nedatstot: {
    pages: ['Dagny lärde sig NEDÅTSTÖT!\nHåll NER i luften för att stöta svärdet nedåt.'],
  },
  algot_igen: {
    speaker: 'Smeden Algot',
    pages: ['En stöt nedåt studsar dig upp igen. Bra mot väsen med sköld, och mot stenar som behöver knäckas.'],
  },

  // --- Side quest: Murre the cat ---------------------------------------------------
  karin_uppdrag: {
    speaker: 'Karin',
    pages: [
      'Åh, Dagny! Har du sett Murre? Han smet ut i går kväll och har inte kommit hem.',
      'Han brukar jaga fjärilar i Björkhagen, väster om byn. Men där har det varit så otäckt nu...',
    ],
    actions: [{ type: 'flag', flag: 'murre_uppdrag' }],
  },
  karin_vantar: {
    speaker: 'Karin',
    pages: ['Björkhagen ligger i skogen väster om byn. Snälla, titta efter Murre om du går förbi.'],
  },
  karin_tack: {
    speaker: 'Karin',
    pages: [
      'MURRE! Där är du ju, din lilla rackare! Tack, Dagny, tack!',
      'Här, ta de här kanelbullarna. Mamma bakade i morse. Du förtjänar dem.',
    ],
    actions: [
      { type: 'takeItem', item: 'murre' },
      { type: 'flag', flag: 'murre_hemma' },
      { type: 'xp', amount: 80 },
      { type: 'heal' },
    ],
    next: 'karin_xp',
  },
  karin_xp: {
    pages: ['Dagny fick 80 XP och känner sig utvilad.'],
  },
  karin_glad: {
    speaker: 'Karin',
    pages: ['Murre har inte lämnat spisen sedan han kom hem. Han spinner så fort han ser dig.'],
  },
  murre_spinner: {
    pages: ['Murre spinner och stryker sig mot Dagnys ben.'],
  },
  murre_hittad: {
    pages: ['Dagny hittade MURRE! Han kryper upp i hennes famn och spinner. Dags att gå hem till Karin.'],
  },

  // --- Other villagers -------------------------------------------------------------
  handlarn: {
    speaker: 'Handlarn',
    pages: [
      'Välkommen in! Kaffe, socker, tändstickor... fast leveranserna är försenade. Lastbilen vågar inte köra genom skogen.',
      'Chauffören säger att han såg en skugga med lysande ögon vid vägskälet.',
    ],
  },
  handlarn_efter: {
    speaker: 'Handlarn',
    pages: ['Lastbilen kom i dag! Det första jag gjorde var att ställa undan ett paket kaffe åt Hulda.'],
  },
  olle: {
    speaker: 'Olle',
    pages: [
      'Hej Dagny! Lyssna! Jag har fått en transistorradio av morbror i Stockholm!',
      'Fast den brusar så konstigt på kvällarna. Som om någon sjunger mellan stationerna.',
    ],
  },
  olle_efter: {
    speaker: 'Olle',
    pages: ['Radion spelar bara schlager nu. Inget sjungande brus. Lite tråkigt, faktiskt.'],
  },
  greta: {
    speaker: 'Telefonist-Greta',
    pages: [
      'Telefonkiosken har ringt av sig själv tre nätter i rad. När jag svarar hörs bara kyrkklockor.',
      'Stenkyrkan ligger rakt norrut, förbi rågfälten. Var försiktig, Dagny.',
    ],
  },

  // --- Crypt -----------------------------------------------------------------------
  krypta_skylt1: {
    pages: ['En inskription i stenen:\n"Här vilar grimmen som vaktar kyrkan. Väck honom ej med vrede."'],
  },
  krypta_skylt2: {
    pages: ['En nästan bortnött rad:\n"...da, Väktare. Hon tände ljusen här varje midsommar."'],
  },
  krypta_skylt3: {
    pages: ['Någon har ristat en liten sol i väggen. Under den, med barnslig handstil: "ny dag".'],
  },
  ljus_tant: {
    pages: ['Dagny tände ljusstaken. Hit kommer hon tillbaka om hon somnar.'],
  },
  dorr_last: {
    pages: ['Uppgången är stängd. Något väntar fortfarande vid altaret.'],
  },
  nyckel_saknas: {
    pages: ['Dörren är låst. Det behövs en nyckel.'],
  },
  grim_vaknar: {
    speaker: 'Kyrkogrimmen',
    pages: ['VEM STÖR... KYRKANS VILA... DE HAR GLÖMT OSS... ALLA HAR GLÖMT...'],
  },
  grim_forlikad: {
    speaker: 'Kyrkogrimmen',
    pages: [
      '...Klockans kläpp. Jag känner igen klangen. Du bär den förra Väktarens klinga.',
      'Förlåt mig, barn. Jag har vaktat så länge i mörkret att jag glömde varför.',
      'Ta ekan som vilar på altaret. Den bar henne över sjön en gång. Nu bär den dig.',
    ],
  },
  fick_eka: {
    pages: [
      'Dagny fick EKAN!\nNu kan hon ro över vatten på kartan.',
      'Ett varmt ljus sprider sig genom kryptan. En bit av sommarljuset har kommit tillbaka till bygden.',
    ],
    actions: [{ type: 'flag', flag: 'krypta_klar' }],
  },

  // --- Overworld -------------------------------------------------------------------
  tempel_sover: {
    pages: ['En ring av resta stenar. Det surrar svagt i luften, som från en ledning.\nPlatsen sover ännu.'],
  },
  trollberget_sover: {
    pages: ['Trollberget reser sig svart mot himlen. Vägen upp är stängd så länge de andra platserna sover.'],
  },
  by_avsparrad: {
    pages: ['En skylt vid vägen:\n"VÄGARBETE – AVSTÄNGT TILLS VIDARE"'],
  },
  behover_eka: {
    pages: ['Vattnet är för djupt att vada i. Med en båt skulle det gå.'],
  },
  behover_stovlar: {
    pages: ['Myren suger tag i skorna. Utan stövlar kommer man inte långt.'],
  },

  // --- Generic --------------------------------------------------------------------
  boss_forlikad: {
    pages: ['Väsendet suckar djupt, som efter en lång dröm, och sjunker ner i marken.'],
  },
  befriend: {
    pages: ['...'],
  },
};
