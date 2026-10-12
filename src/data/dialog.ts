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

  // --- Temple 2: Den gamla gruvan ----------------------------------------------------
  gruvan_skylt1: {
    pages: ['En emaljskylt, rostig i kanterna:\n"STOLL NR 3 – STÄNGD 1951. OBEHÖRIGA ÄGA EJ TILLTRÄDE."'],
  },
  gruvan_skylt2: {
    pages: ['Någon har ristat i en stötta: "Hälsa på rået när du går in, tacka henne när du går ut."'],
  },
  gruvan_skylt3: {
    pages: ['En gammal karbidlampa hänger på en spik. Den är kall. Initialerna H.D. är inristade i mässingen.'],
  },
  gruvra_vaknar: {
    speaker: 'Gruvrået',
    pages: ['Ingen hälsar längre. Ingen tackar. De tar malmen och släcker lyktorna... Så låt mörkret ta dem.'],
  },
  gruvra_forlikad: {
    speaker: 'Gruvrået',
    pages: [
      '...Du slog inte för att döda. Du slog som en Väktare.',
      'Den förra kom hit med sin lampa varje vår och hälsade. Hon lämnade den här när hon gick för sista gången.',
      'Ta den, barn. Mörkret ska inte skrämma dig mer.',
    ],
  },
  fick_karbidlampa: {
    pages: [
      'Dagny fick KARBIDLAMPAN!\nNu ser hon dubbelt så långt i mörka gruvor och grottor.',
      'Lyktorna längs orten tänds en efter en. En bit till av sommarljuset har kommit tillbaka.',
    ],
    actions: [{ type: 'flag', flag: 'gruvan_klar' }],
  },
  hulda_efter_gruvan: {
    speaker: 'Mormor Hulda',
    pages: [
      'Lampan... låt mig se den. H.D. Jag har inte sett de bokstäverna på arton år.',
      'Jag lovar att berätta, Dagny. Men inte än. Först måste du se mer själv.',
      'Vila nu. Kaffet är varmt.',
    ],
    actions: [{ type: 'flag', flag: 'hulda_efter_gruvan' }, { type: 'rest' }],
  },
  boss_vaknar: {
    pages: ['Marken skälver. Något mycket gammalt vaknar.'],
  },

  // --- Temple 3: Kvarnen vid forsen -------------------------------------------------
  kvarnen_skylt1: {
    pages: ['En skylt vid bäcken:\n"BADA EJ I FORSEN. FÖLJ EJ EFTER VITA HÄSTAR."\nNågon har strukit under sista raden.'],
  },
  kvarnen_skylt2: {
    pages: ['Inristat i kvarnstenen: en sol, och under den ett namn som någon har försökt skrapa bort.'],
  },
  backahast_vaknar: {
    speaker: 'Bäckahästen',
    pages: ['Sitt upp, lilla tös. Rid med mig ner i forsen. Ingen har sagt mitt namn på länge... ingen kan tvinga mig att gå.'],
  },
  backahast_forlikad: {
    speaker: 'Bäckahästen',
    pages: [
      'Den förra Väktaren sa mitt namn högt, och jag blev fri från vreden. Du säger ingenting...',
      '...men jag hör det ändå. Hur du andas. Hur du står kvar. Det är samma sak.',
      'Hon lämnade sina stövlar på stranden den sista sommaren. Ta dem. Myren bär dig nu.',
    ],
  },
  fick_stovlar: {
    pages: [
      'Dagny fick GUMMISTÖVLARNA!\nNu kan hon gå över myren på kartan.',
      'Regnet tunnas ut över forsen. Kvarnhjulet börjar snurra igen, och en bit till av sommarljuset kommer tillbaka.',
    ],
    actions: [{ type: 'flag', flag: 'kvarnen_klar' }],
  },
  hulda_efter_kvarnen: {
    speaker: 'Mormor Hulda',
    pages: [
      'Stövlar... gröna stövlar, storlek trettioåtta. Jag köpte dem på lanthandeln i Kyrkbyn 1945.',
      'Ja, Dagny. Jag kände henne. Mer än så säger jag inte förrän du har varit på Trollberget.',
      'Sov nu. Tre platser har vaknat i godo. Det känns i luften.',
    ],
    actions: [{ type: 'flag', flag: 'hulda_efter_kvarnen' }, { type: 'rest' }],
  },

  // --- Temple 4: Fyren i skären --------------------------------------------------------
  fyren_skylt1: {
    pages: ['En mässingsskylt vid fyrens fot:\n"FYREN TÄNDES 1887. SLÄCKT I VÄNTAN PÅ AUTOMATISERING."'],
  },
  fyren_skylt2: {
    pages: ['Fyrvaktarens loggbok ligger uppslagen. Sista raden: "Midsommarnatten 1946. Ett ljus gick ner över Kyrkbyn. Signalen från stranden tystnade."'],
  },
  havsfru_vaknar: {
    speaker: 'Havsfrun',
    pages: ['Fyren är släckt, båtarna seglar på radar och ingen lägger längre en slant i vattnet åt mig. Låt stormen påminna dem.'],
  },
  havsfru_forlikad: {
    speaker: 'Havsfrun',
    pages: [
      'Stormen har bedarrat... Du stod kvar på galleriet fast vinden slet i dig. Precis som hon.',
      'Varje kväll blinkade hon med sin lampa från stranden. Tre korta, tre långa, tre korta. Och någon i Kyrkbyn svarade.',
      'Ta lampan. Kanske finns det någon som fortfarande väntar på signalen.',
    ],
  },
  fick_ficklampa: {
    pages: [
      'Dagny fick FICKLAMPAN!\nI mörker lyser den upp vägen framför henne.',
      'Fyren tänds igen och sveper över skären. En bit till av sommarljuset har kommit tillbaka.',
    ],
    actions: [{ type: 'flag', flag: 'fyren_klar' }],
  },
  hulda_efter_fyren: {
    speaker: 'Mormor Hulda',
    pages: [
      'Den där lampan... Tre korta, tre långa, tre korta. Varje kväll i åtta år.',
      'Det var jag som svarade, Dagny. Från vinden i klockstapeln, med fotogenlyktan.',
      'Nu vet du lite till. Fyra platser har vaknat. Vila nu.',
    ],
    actions: [{ type: 'flag', flag: 'hulda_efter_fyren' }, { type: 'rest' }],
  },

  // --- Gruvsamhället ----------------------------------------------------------------
  maj_vila: {
    speaker: 'Maj på pensionatet',
    pages: ['Välkommen till pensionatet! Ett rum med utsikt över lavtornet och frukost klockan sju. Vill du vila?'],
    choices: [
      { text: 'Vila på pensionatet', next: 'maj_vilat', actions: [{ type: 'rest' }] },
      { text: 'Inte nu', next: 'maj_hej' },
    ],
  },
  maj_vilat: {
    speaker: 'Maj på pensionatet',
    pages: ['God morgon! Kaffet står på spisen. Jag har skrivit in dig i gästboken, så du hittar alltid tillbaka hit.'],
  },
  maj_hej: {
    speaker: 'Maj på pensionatet',
    pages: ['Dörren står alltid öppen. Gruvfolk sover dåligt ändå, så någon är alltid vaken.'],
  },
  elin_lar: {
    speaker: 'Gamla Elin',
    pages: [
      'Du har kommit långt för att vara så ung. Gruvan är mörk nu, mörkare än den varit på hundra år.',
      'Min mor lärde mig en läsning när jag skulle ner i schaktet första gången. Den har lyst för mig i sextio år.',
      '"Lyse i natt, lyse i berg, lyse för den som går utan färg..." Så. Nu bär du ljuset själv.',
    ],
    actions: [{ type: 'learnSpell', spell: 'lyse' }],
    next: 'lart_lyse',
  },
  lart_lyse: {
    pages: ['Dagny lärde sig läsningen LYSE!\nDen lyser upp mörka gruvor och valv en lång stund.'],
  },
  elin_igen: {
    speaker: 'Gamla Elin',
    pages: ['Glöm inte att hälsa på rået när du går ner. Och tacka henne när du kommer upp.'],
  },
  elin_efter: {
    speaker: 'Gamla Elin',
    pages: ['Jag hörde lyktorna tändas där nere, en efter en, som förr. Hon har förlåtit oss, tror jag.'],
  },
  anders_uppdrag: {
    speaker: 'Gruvarbetaren Anders',
    pages: [
      'Mitt fickur! Jag tappade det nere i Orten när lyktorna slocknade och vi fick springa.',
      'Det var farfars. Jag vågar inte gå ner igen. Om du ändå ska dit... håll utkik.',
    ],
    actions: [{ type: 'flag', flag: 'fickur_uppdrag' }],
  },
  anders_vantar: {
    speaker: 'Gruvarbetaren Anders',
    pages: ['Orten ligger efter hisschaktet. Uret måste ligga någonstans längst in, nära lyktan vid valvet.'],
  },
  anders_tack: {
    speaker: 'Gruvarbetaren Anders',
    pages: [
      'Det tickar fortfarande! Farfar sa alltid att det här uret stannar den dag gruvan dör.',
      'Ta det här, jag har sparat det till en regnig dag. Och kom till pensionatet i kväll, Maj bjuder.',
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
    pages: ['Jag lyssnar på uret varje kväll innan jag somnar. Tack, Dagny.'],
  },
  hittade_fickur: {
    pages: ['Dagny hittade ett FICKUR i mässing. Det tickar fortfarande. Det är nog Anders.'],
  },
  lisa: {
    speaker: 'Lisa',
    pages: [
      'Pappa säger att gruvan stängde när jag var liten. Men om nätterna hör jag hackor där nere.',
      'Och ibland står en grå tant vid lavtornet med en lykta. Hon vinkar aldrig tillbaka.',
    ],
  },
  lisa_efter: {
    speaker: 'Lisa',
    pages: ['I går vinkade den grå tanten tillbaka! Ingen tror mig.'],
  },
  nils: {
    speaker: 'Gruvarbetaren Nils',
    pages: ['Bolaget vill riva lavtornet och bygga en bilväg. Men ingen vågar gå nära schaktet längre. Lyktorna har slocknat.'],
  },
  nils_efter: {
    speaker: 'Gruvarbetaren Nils',
    pages: ['Lavtornet får stå kvar, sa bolaget i dag. Konstigt nog var det ingen som ville riva det längre.'],
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
