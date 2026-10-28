import type { DialogDef } from '../types';

/** Mormors by: Mormor Hulda, gamle Sven, smeden Algot, Karin and Murre, the other villagers – and Björkhagen. */
export const HEM: Record<string, DialogDef> = {
  intro_hulda: {
    speaker: 'Mormor Hulda',
    pages: [
      'Där är du, Dagny. Sätt dig.',
      'Sommaren är mörk i år. Irrblossen dansar över myren mitt på dagen.',
      'Förr vårdade Väktarna de sju heliga platserna. Nu är vägarna igenvuxna och ingen säger väsendenas namn. Platserna har vaknat i vrede.',
      'Den sista Väktaren försvann midsommarnatten 1946. Samma natt hittade jag dig under klockstapeln.',
      'Det finns saker om den natten som jag har lovat att inte säga. Inte än.',
      'Bredvid dig låg en klinga. Jag har satt kläppen från kyrkklockan som fäste. Ta den. Den är till för att förlika, inte för att döda.',
      'Gå till Stenkyrkan i norr. Kryptan har börjat ringa om nätterna.',
      'Tala med gamle Sven och smeden Algot först.',
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
    pages: ['Du ser trött ut. Vill du vila?'],
    choices: [
      { text: 'Vila hos mormor', next: 'hulda_vilat', actions: [{ type: 'rest' }] },
      { text: 'Gå vidare', next: 'hulda_hej' },
    ],
  },

  hulda_vilat: {
    speaker: 'Mormor Hulda',
    pages: ['Liv och magi är fyllda. Jag har skrivit upp var du är.'],
  },

  hulda_hej: {
    speaker: 'Mormor Hulda',
    pages: ['Akta dig för myren. Och kom hem till middag.'],
  },

  hulda_efter_krypta: {
    speaker: 'Mormor Hulda',
    pages: [
      'Solen bröt igenom över Stenkyrkan i morse.',
      'Grimmen har slutit fred. Då är det sant. Du är den vi väntat på.',
      'Sex platser återstår. Vila nu.',
    ],
    actions: [{ type: 'flag', flag: 'hulda_efter_krypta' }, { type: 'rest' }],
  },

  sven_uppdrag: {
    speaker: 'Gamle Sven',
    pages: [
      'Så Hulda har skickat dig. Du har ögon som... nej. Glöm det.',
      'Jag kan en läsning mot värk. Men den biter inte utan johannesört, och mina knän bär mig inte till skogen.',
      'Den växer högt uppe i Björkhagen, sydost om byn. Hämta en kvist, så lär jag dig.',
    ],
    actions: [{ type: 'flag', flag: 'sven_uppdrag' }],
  },

  sven_vantar: {
    speaker: 'Gamle Sven',
    pages: ['Johannesörten växer högt uppe i Björkhagen. Hoppa på hyllorna. Akta nässlorna.'],
  },

  sven_lar: {
    speaker: 'Gamle Sven',
    pages: [
      'Johannesört! Och med rötterna kvar i jorden. Du är din mormors barnbarn.',
      '"Värk ut, värk ner, i jord och sten, läk kött och ben."',
    ],
    actions: [
      { type: 'takeItem', item: 'johannesort' },
      { type: 'flag', flag: 'johannesort_klar' },
      { type: 'learnSpell', spell: 'lakning' },
    ],
    next: 'lart_lakning',
  },

  lart_lakning: {
    pages: ['Dagny lärde sig läsningen LÄKNING!\nMagi: C / Y-knappen. Byt läsning i pausmenyn.'],
  },

  sven_igen: {
    speaker: 'Gamle Sven',
    pages: ['Läkningen kostar magi. Där väsen har varit hittar du termosar med kaffe.'],
  },

  sven_efter: {
    speaker: 'Gamle Sven',
    pages: ['Så här ljust har det inte varit på år och dag.'],
  },

  algot_uppdrag: {
    speaker: 'Smeden Algot',
    pages: [
      'Ska du ner i kryptan? Inte utan att kunna stöta nedåt.',
      'Grimmen svävar högt. Den som inte slår neråt i luften kommer inte åt honom.',
      'Jag lär dig. Men först vill jag ha min tång. Den ligger i gamla smedjan, öster om byn.',
    ],
    actions: [{ type: 'flag', flag: 'tang_uppdrag' }],
  },

  algot_tack: {
    speaker: 'Smeden Algot',
    pages: [
      'Min tång! Tack, jäntan.',
      'Hoppa, håll NER och låt tyngden göra jobbet.',
    ],
    actions: [
      { type: 'takeItem', item: 'tang' },
      { type: 'flag', flag: 'tang_klar' },
      { type: 'learnSkill', skill: 'nedatstot' },
      { type: 'flag', flag: 'algot_lart' },
    ],
    next: 'lart_nedatstot',
  },

  algot_vantar: {
    speaker: 'Smeden Algot',
    pages: [
      'Tången ligger i gamla smedjan, öster om byn. Gå inte ner i kryptan utan att kunna stöta nedåt.',
    ],
  },

  lart_nedatstot: {
    pages: ['Dagny lärde sig NEDÅTSTÖT!\nHåll NER i luften för att stöta svärdet nedåt.'],
  },

  algot_igen: {
    speaker: 'Smeden Algot',
    pages: [
      'Stöten nedåt studsar dig upp igen. Bra mot väsen med sköld, och mot sten som ska knäckas.',
      'Kråkor och fladdermöss skriker innan de dyker. Håll skölden mot dem då, så blir de yra. Sedan slår du.',
    ],
  },

  karin_uppdrag: {
    speaker: 'Karin',
    pages: [
      'Dagny! Har du sett Murre? Han smet ut i går kväll.',
      'Han brukar springa till Kyrkbyn och tigga strömming.',
    ],
    actions: [{ type: 'flag', flag: 'murre_uppdrag' }],
  },

  karin_vantar: {
    speaker: 'Karin',
    pages: ['Kyrkbyn ligger nordost om byn, vid sjön. Titta efter Murre där.'],
  },

  karin_tack: {
    speaker: 'Karin',
    pages: [
      'MURRE! Din lilla rackare! Tack, Dagny!',
      'Ta en kanelbulle. Mamma bakade i morse.',
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
    pages: ['Murre har inte gått från spisen sedan han kom hem.'],
  },

  murre_spinner: {
    pages: ['Murre spinner och stryker sig mot Dagnys ben.'],
  },

  murre_hittad: {
    pages: ['Dagny hittade MURRE! Han kryper upp i hennes famn. Karin väntar hemma.'],
  },

  handlarn: {
    speaker: 'Handlarn',
    pages: [
      'Leveranserna är försenade. Chauffören vågar inte köra genom skogen.',
      'Han säger att han såg en skugga med lysande ögon vid vägskälet.',
    ],
  },

  handlarn_efter: {
    speaker: 'Handlarn',
    pages: ['Lastbilen kom i dag! Jag har ställt undan ett paket kaffe åt Hulda.'],
  },

  olle: {
    speaker: 'Olle',
    pages: [
      'Jag har fått en transistorradio av morbror i Stockholm!',
      'Fast den brusar konstigt på kvällarna. Som om någon sjunger mellan stationerna.',
    ],
  },

  olle_efter: {
    speaker: 'Olle',
    pages: ['Radion spelar bara schlager nu. Inget brus. Lite tråkigt.'],
  },

  greta: {
    speaker: 'Telefonist-Greta',
    pages: [
      'Telefonkiosken har ringt av sig själv tre nätter i rad. När jag svarar hörs bara kyrkklockor.',
      'Stenkyrkan ligger rakt norrut, förbi rågfälten.',
      'Om kvällarna lyser det ute på en holme i sjön. Någon bor där. Ingen vet vem.',
    ],
    actions: [{ type: 'flag', flag: 'rykte_eremitholmen' }],
  },

  hulda_efter_gruvan: {
    speaker: 'Mormor Hulda',
    pages: [
      'Lampan... låt mig se. H.D. De bokstäverna har jag inte sett på arton år.',
      'Jag lovar att berätta, Dagny. Men inte än.',
      'Vila nu.',
    ],
    actions: [{ type: 'flag', flag: 'hulda_efter_gruvan' }, { type: 'rest' }],
  },

  hulda_efter_kvarnen: {
    speaker: 'Mormor Hulda',
    pages: [
      'Gröna stövlar, storlek trettioåtta. Jag köpte dem i Kyrkbyn 1945.',
      'Ja. Jag kände henne. Bättre än någon. Mer säger jag inte förrän du har sett alla platserna.',
      'Tre platser har vaknat. Sov nu.',
    ],
    actions: [{ type: 'flag', flag: 'hulda_efter_kvarnen' }, { type: 'rest' }],
  },

  hulda_efter_fyren: {
    speaker: 'Mormor Hulda',
    pages: [
      'Tre korta, tre långa, tre korta. Varje kväll i åtta år.',
      'Det var jag som svarade. Från vinden i klockstapeln, med fotogenlyktan.',
      'Fyra platser har vaknat. Vila nu.',
    ],
    actions: [{ type: 'flag', flag: 'hulda_efter_fyren' }, { type: 'rest' }],
  },

  hulda_efter_folkparken: {
    speaker: 'Mormor Hulda',
    pages: [
      'Det fotografiet tog jag själv, midsommar 1945. Sista gången jag såg henne skratta.',
      'Hon hette Dagmar.',
      'Två platser kvar. Sedan Trollberget. Vila nu.',
    ],
    actions: [{ type: 'flag', flag: 'hulda_efter_folkparken' }, { type: 'rest' }],
  },

  olle_radio: {
    speaker: 'Olle',
    pages: ['Har du också en radio? Nära Björkhagen brusar den annorlunda. Som om berget hade en dörr.'],
  },

  hulda_efter_fabodskogen: {
    speaker: 'Mormor Hulda',
    pages: [
      'Näverfilten. Den du låg i när jag hittade dig. Dagmar hann aldrig väva den klar.',
      'Hon var din mamma, Dagny. Och hon var min dotter.',
      'Namnet i kryptan är mitt. H.D. på lampan är jag, Hulda Dahl. Jag var Väktare före henne.',
      'Det var jag som slutade gå. Under kriget förlöste jag halva bygden. En sommar till, tänkte jag. Och så en till.',
      'Midsommarnatten 1946 vaknade berget. Gåvan hade lämnat mig, och jag var ute på en förlossning. Dagmar gick i stället.',
      'Hon lade dig under klockstapeln. I korgen låg en lapp: "Berätta inget för henne förrän hon har sett platserna själv."',
      'Hade du vetat, hade du sprungit rakt upp i berget. Och berget släpper ingen som inte väckt de andra platserna först.',
      'Jag fick aldrig säga ja. Men jag har hållit det. Förlåt att jag lät dig gå ensam, som jag lät henne.',
      'Nu återstår bara Trollberget. Där är hon. Men först vilar du.',
    ],
    actions: [{ type: 'flag', flag: 'hulda_efter_fabodskogen' }, { type: 'rest' }],
  },

  bjorkhagen_nasslor: {
    pages: ['En lapp på en pinne:\n"AKTA BRÄNNÄSSLORNA I GROPEN! HOPPA ÖVER! /OLLE"'],
  },

  hittade_hacka: {
    pages: ['Dagny hittade BERGHACKAN! Någon har bränt in ett K i skaftet.'],
  },

  hittade_tang: {
    pages: ['Dagny hittade SMEDTÅNGEN! Smeden Algot väntar på den.'],
  },

  smedjan_skylt: {
    pages: ['Gamla smedjan. Ässjan är kall sedan länge.'],
  },

  hittade_johannesort: {
    pages: ['Dagny hittade JOHANNESÖRT! Gamle Sven väntar på den.'],
  },
};
