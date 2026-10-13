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

  // --- Temple 5: Folkparken om natten -----------------------------------------------
  park_skylt1: {
    pages: ['En affisch på planket, blekt av sol:\n"DANS I FOLKPARKEN VARJE LÖRDAG. ORKESTERN SPELAR TILL GRYNINGEN."'],
  },
  park_skylt2: {
    pages: ['Ett gammalt fotografi är fastnubbat vid dansbanan. En kvinna med kopparfärgat hår dansar med ett irrbloss. Hon skrattar.'],
  },
  spelman_vaknar: {
    speaker: 'Spelmannen',
    pages: ['Förr dansade de till min fiol tills solen gick upp. Nu sitter de hemma framför sina apparater. Kom, lilla vän. Dansa!'],
  },
  spelman_forlikad: {
    speaker: 'Spelmannen',
    pages: [
      'Du dansade inte när jag spelade... men du gick i takt ändå. Hon gjorde också så.',
      'Hon brukade lyssna efter mig mellan stationerna på sin radio. När ingen annan hörde, så hörde hon.',
      'Ta den. Där bruset är som starkast finns det vägar som andra har glömt.',
    ],
  },
  fick_radio: {
    pages: [
      'Dagny fick TRANSISTORRADION!\nVäggar som surrar i bruset går nu att gå igenom.',
      'Ljusslingorna tänds över dansbanan, en efter en. En bit till av sommarljuset har kommit tillbaka.',
    ],
    actions: [{ type: 'flag', flag: 'folkparken_klar' }],
  },
  hulda_efter_folkparken: {
    speaker: 'Mormor Hulda',
    pages: [
      'Fotografiet från dansbanan... Jag tog det själv, midsommar 1945. Det var sista gången jag såg henne skratta.',
      'Hon hette Dagmar. Mer säger jag inte än. Två platser kvar, och sedan Trollberget.',
      'Vila nu, vännen.',
    ],
    actions: [{ type: 'flag', flag: 'hulda_efter_folkparken' }, { type: 'rest' }],
  },
  olle_radio: {
    speaker: 'Olle',
    pages: ['Har du också fått en radio! Lyssna... det brusar annorlunda nära Björkhagen. Som om berget hade en dörr.'],
  },

  // --- Temple 6: Fäbodskogen --------------------------------------------------------
  fabod_skylt1: {
    pages: ['En handmålad skylt på en gärdesgård:\n"TILL FÄBODEN. FÖLJ DET RÖDA BANDET. LITA INTE PÅ LJUSEN."'],
  },
  villse: {
    pages: ['Stigen slingrar sig ... och leder rakt tillbaka till där du började. Skogen fnissar mellan granarna.'],
  },
  villse2: {
    pages: ['Irrblosset slocknar så fort du kommer fram. Du står vid ljusstaken igen.'],
  },
  skogsra_vaknar: {
    speaker: 'Skogsrået',
    pages: ['Ingen vallar korna här längre. Ingen sjunger på vallen. Fäbodarna står och ruttnar... som min rygg. Kom närmare, lilla vän.'],
  },
  skogsra_forlikad: {
    speaker: 'Skogsrået',
    pages: [
      'Du såg min rygg och vände inte om. Det är det som skiljer en Väktare från en jägare.',
      'Hon satt här på vallen och vävde en näverfilt den sista sommaren. Den blev aldrig klar... Den låg i en korg under klockstapeln.',
      'Ta luren. Blås, så kommer de du förlikat. Du är inte ensam längre.',
    ],
  },
  fick_naverlur: {
    pages: [
      'Dagny fick NÄVERLUREN!\nHåll NER och tryck MAGI, så kommer en vätte och hjälper dig en stund.',
      'Någon kular långt borta på vallen, och dimman lättar. En bit till av sommarljuset har kommit tillbaka.',
    ],
    actions: [{ type: 'flag', flag: 'fabodskogen_klar' }],
  },
  hulda_efter_fabodskogen: {
    speaker: 'Mormor Hulda',
    pages: [
      'Näverfilten... den du låg i när jag hittade dig. Dagmar vävde den åt dig, fast hon aldrig hann bli klar.',
      'Sex platser har vaknat i godo. Nu återstår bara Trollberget. Där får du hela sanningen, det lovar jag.',
      'Men först vilar du. Kom hit.',
    ],
    actions: [{ type: 'flag', flag: 'hulda_efter_fabodskogen' }, { type: 'rest' }],
  },
  lur_blast: {
    pages: ['Näverluren ljuder över skogen! En vätte kommer springande för att hjälpa.'],
  },
  lur_vila: {
    pages: ['Vättarna vilar. Vänta en stund innan du blåser igen.'],
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
  // --- Friendly meetings on the overworld ---------------------------------------------
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
    pages: ['En skogsarbetare vilar på en stubbe. "Ska du till fäboden? Då behöver du stövlar, myren tar annars den som går dit. Kvarnen vid forsen säljer inga, men något säger mig att du hittar ett par där."'],
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
  // --- The sword upgrades -----------------------------------------------------------
  holm_tips_malm: {
    speaker: 'Smeden Holm',
    pages: ['Klingan är bra, men den är mjuk efter alla år i en korg. Hitta mig en klump järnmalm i gamla gruvan, så härdar jag den åt dig.'],
  },
  holm_hardar: {
    speaker: 'Smeden Holm',
    pages: [
      'Där har vi malmen! Ge mig klingan en stund.',
      'Rött i ässjan, svart i vattnet... Så. Känn hur den biter nu.',
    ],
    actions: [{ type: 'takeItem', item: 'malm' }, { type: 'flag', flag: 'malm_klar' }, { type: 'giveItem', item: 'klingaHardad' }],
    next: 'fick_klingaHardad',
  },
  fick_klingaHardad: {
    pages: ['Klingan är HÄRDAD!\nSvärdet gör 1 mer i skada.'],
  },
  holm_tips_askstenen: {
    speaker: 'Smeden Holm',
    pages: ['Vill du ha en egg som ingen annan? Det sägs att blixten slår ner i fyren ute i skären. Där den slår blir stenen till glas. En sådan åsksten skulle jag kunna slipa med.'],
  },
  holm_slipar: {
    speaker: 'Smeden Holm',
    pages: [
      'En åsksten! Den är ju fortfarande varm.',
      'Hör hur det knastrar när jag drar den mot eggen... Där. Akta fingrarna, den här skär i ljus.',
    ],
    actions: [{ type: 'takeItem', item: 'askstenen' }, { type: 'flag', flag: 'askstenen_klar' }, { type: 'giveItem', item: 'klingaBlank' }],
    next: 'fick_klingaBlank',
  },
  fick_klingaBlank: {
    pages: ['Klingan är ÅSKSLIPAD!\nSvärdet gör 1 mer i skada.'],
  },
  hittade_malm: {
    pages: ['Dagny hittade en klump JÄRNMALM. Smeden Holm i Bruksorten kan nog använda den.'],
  },
  hittade_askstenen: {
    pages: ['Dagny hittade ÅSKSTENEN, en glaserad sten där blixten har slagit ner. Den är fortfarande varm.'],
  },
  hittade_silverbeslag: {
    pages: ['I lampans sken blänker något bakom en sten: Grå-Pelles silver! Det är smitt till ett beslag som passar precis runt kläppen.', 'Dagny fäster SILVERBESLAGET på klingan.\nSvärdet gör 1 mer i skada. Väsen ryggar för silver.'],
  },
  fick_livbehallare: {
    pages: ['Dagny hittade en LIVBEHÅLLARE!\nHennes liv räcker lite längre nu.'],
  },
  fick_magibehallare: {
    pages: ['Dagny hittade en MAGIBEHÅLLARE!\nHon orkar läsa lite fler läsningar nu.'],
  },
  tjuvgrottan_skylt: {
    pages: ['Någon har ristat i berget med en kniv:\n"HÄR GÖMDE GRÅ-PELLE SITT SILVER 1899. DET SYNS BARA I RÄTT LJUS."'],
  },
  jattegrytan_ristning: {
    pages: ['I lampans sken syns två bokstäver ristade i berget, nästan utplånade av vattnet: D. och H. Under dem en liten sol.'],
  },
  bjorkhagen_nasslor: {
    pages: ['En lapp på en pinne, skriven med barnhandstil:\n"AKTA BRÄNNÄSSLORNA I GROPEN! HOPPA ÖVER! /OLLE"'],
  },
  trollberget_sover: {
    pages: ['Trollberget reser sig svart mot himlen. Vägen upp är stängd så länge de andra platserna sover.'],
  },

  // --- The other villages ---------------------------------------------------------
  signe_vila: {
    speaker: 'Signe i prästgården',
    pages: ['Kom in, kom in. Prästgården har fler rum än präster. Vill du vila en stund?'],
    choices: [
      { text: 'Vila i prästgården', next: 'signe_vilat', actions: [{ type: 'rest' }] },
      { text: 'Inte nu', next: 'signe_hej' },
    ],
  },
  signe_vilat: {
    speaker: 'Signe i prästgården',
    pages: ['Sovit gott? Det gör alla under kyrkklockan. Du är alltid välkommen tillbaka hit.'],
  },
  signe_hej: {
    speaker: 'Signe i prästgården',
    pages: ['Dörren är olåst. Det har den varit sedan 1700-talet.'],
  },
  prosten_lar: {
    speaker: 'Prosten',
    pages: [
      'Så du är flickan från klockstapeln. Jag döpte dig, vet du. Du skrek så att det ekade i valvet.',
      'Kryptan sover lugnt nu. Då kan jag lära dig det min företrädare lärde sig av den förra Väktaren.',
      '"Eld i järn, eld i sol, eld som midsommarnatten stal..." Så. Nu brinner det i klingan när du ber den.',
    ],
    actions: [{ type: 'learnSpell', spell: 'eld' }],
    next: 'lart_eld',
  },
  lart_eld: {
    pages: ['Dagny lärde sig läsningen ELD!\nSvärdet skjuter eldbollar en stund.'],
  },
  prosten_igen: {
    speaker: 'Prosten',
    pages: ['Eld är inte till för att förstöra. Den är till för att lysa upp och värma. Glöm aldrig det.'],
  },
  prosten_vanta: {
    speaker: 'Prosten',
    pages: [
      'Det är något som rör sig under kyrkan. Jag hör det på nätterna, som stenar som skaver mot varandra.',
      'Gå ner i kryptan och se vad som är fel. Kom sedan tillbaka, så har jag något åt dig.',
    ],
  },
  prosten_efter: {
    speaker: 'Prosten',
    pages: ['I morse ringde klockan av sig själv igen. Men den här gången lät den glad. Jag vet inte hur jag ska förklara det.'],
  },
  ingrid_uppdrag: {
    speaker: 'Ingrid',
    pages: [
      'Min psalmbok! Jag tappade den i kryptan när ljusen slocknade och alla sprang ut.',
      'Mor fick den på sin konfirmation. Det ligger pressade blommor från varje midsommar i den. Om du ser den...',
    ],
    actions: [{ type: 'flag', flag: 'psalmbok_uppdrag' }],
  },
  ingrid_vantar: {
    speaker: 'Ingrid',
    pages: ['Den måste ligga i kryptan, i rummet med de tre valven. Jag satt alltid längst upp.'],
  },
  ingrid_tack: {
    speaker: 'Ingrid',
    pages: [
      'Där är den! Och blommorna ligger kvar, varenda en.',
      'Här, ta det här. Och nästa midsommar pressar vi en blomma åt dig också.',
    ],
    actions: [{ type: 'takeItem', item: 'psalmbok' }, { type: 'flag', flag: 'psalmbok_klar' }, { type: 'xp', amount: 150 }, { type: 'heal' }],
    next: 'ingrid_xp',
  },
  ingrid_xp: {
    pages: ['Dagny fick 150 XP och känner sig utvilad.'],
  },
  ingrid_glad: {
    speaker: 'Ingrid',
    pages: ['Jag har pressat en prästkrage åt dig. Den ligger på sidan för midsommarpsalmen.'],
  },
  hittade_psalmbok: {
    pages: ['Dagny hittade en PSALMBOK. Det sticker ut torkade blommor mellan bladen. Den är nog Ingrids.'],
  },
  bosse: {
    speaker: 'Bosse',
    pages: ['Jag har klättrat upp i klockstapeln! Nästan. Halvvägs. Prosten blev arg.'],
  },
  bosse_efter: {
    speaker: 'Bosse',
    pages: ['Det spökar inte i kryptan längre, säger prosten. Då vågar jag gå ner. Kanske. Om du följer med.'],
  },
  kyrkby_klockstapel: {
    pages: [
      'Den gamla klockstapeln. Klockan har hängt här i trehundra år.',
      'En liten mässingsskylt på stolpen:\n"MIDSOMMARNATTEN 1946 RINGDE JAG AV MIG SJÄLV."',
    ],
  },
  tyra: {
    speaker: 'Gamla Tyra',
    pages: [
      'Jag var vaken den natten, 1946. Jag såg en kvinna med kopparhår gå förbi med en korg.',
      'Hon stannade vid klockstapeln och grät. Sedan gick hon mot Trollberget, utan korgen.',
      'Du har hennes hår, lilla vän. Och hennes sätt att lyssna utan att säga något.',
    ],
  },
  tyra_efter: {
    speaker: 'Gamla Tyra',
    pages: ['Jag såg ljuset över Trollberget i morse. Jag förstod att hon fick komma hem till slut.'],
  },
  rut_vila: {
    speaker: 'Rut på värdshuset',
    pages: ['Värdshuset har mat och sängar, och ingen frågar varifrån man kommer. Vill du vila?'],
    choices: [
      { text: 'Vila på värdshuset', next: 'rut_vilat', actions: [{ type: 'rest' }] },
      { text: 'Inte nu', next: 'rut_hej' },
    ],
  },
  rut_vilat: {
    speaker: 'Rut på värdshuset',
    pages: ['Där är du ju. Gröten står framme. Kom tillbaka när du vill, så har vi en säng åt dig.'],
  },
  rut_hej: {
    speaker: 'Rut på värdshuset',
    pages: ['Det är skiftbyte snart. Då blir det trångt här inne, så passa på medan det är lugnt.'],
  },
  holm_lar: {
    speaker: 'Smeden Holm',
    pages: [
      'Du bär en gammal klinga. Bra smide, fast fästet är en klockkläpp. Det har jag aldrig sett förut.',
      'Min far lärde mig en sak i hyttan, när gnistorna flög. Ett kors av rönn över bröstet, och en läsning.',
      '"Rönn för bröstet, järn för hand, inget ont går över min rand." Så. Nu tar du bara halva smällen.',
    ],
    actions: [{ type: 'learnSpell', spell: 'skydd' }],
    next: 'lart_skydd',
  },
  lart_skydd: {
    pages: ['Dagny lärde sig läsningen SKYDD!\nHalverar skadan Dagny tar en stund.'],
  },
  holm_igen: {
    speaker: 'Smeden Holm',
    pages: ['Skyddet håller en stund. Men en bra sköld och ett bra öga håller längre.'],
  },
  karlsson_lar: {
    speaker: 'Förman Karlsson',
    pages: [
      'Jaså, du har lärt dig stöta nedåt hos Algot? Då ska du få lära dig åt andra hållet också.',
      'Håll UPP och slå, så går klingan rakt upp. Bra mot fladdermöss och sådant som hänger i taket.',
    ],
    actions: [{ type: 'learnSkill', skill: 'uppatstot' }, { type: 'flag', flag: 'karlsson_lart' }],
    next: 'lart_uppatstot',
  },
  lart_uppatstot: {
    pages: ['Dagny lärde sig UPPÅTSTÖT!\nHåll UPP och slå för att stöta svärdet uppåt.'],
  },
  karlsson_igen: {
    speaker: 'Förman Karlsson',
    pages: ['Upp och ner, upp och ner. Precis som hissen i gruvan, fast med svärd.'],
  },
  rosa_uppdrag: {
    speaker: 'Rosa',
    pages: [
      'Jag hade en medaljong med Gunnars kort i. Han var flottare och drunknade i forsen för länge sedan.',
      'Jag tappade den vid kvarnen när jag satt och tittade på vattnet. Bäckahästen skrämde mig så jag sprang.',
    ],
    actions: [{ type: 'flag', flag: 'medaljong_uppdrag' }],
  },
  rosa_vantar: {
    speaker: 'Rosa',
    pages: ['Medaljongen föll nog ner någonstans vid vattenfallet bakom kvarnen. Var försiktig, det är halt.'],
  },
  rosa_tack: {
    speaker: 'Rosa',
    pages: [
      'Gunnar... Där är du ju. Jag trodde att jag aldrig skulle få se dig igen.',
      'Ta det här, lilla vän. Han skulle ha tyckt om dig.',
    ],
    actions: [{ type: 'takeItem', item: 'medaljong' }, { type: 'flag', flag: 'medaljong_klar' }, { type: 'xp', amount: 200 }, { type: 'heal' }],
    next: 'rosa_xp',
  },
  rosa_xp: {
    pages: ['Dagny fick 200 XP och känner sig utvilad.'],
  },
  rosa_glad: {
    speaker: 'Rosa',
    pages: ['Jag har satt medaljongen på en ny kedja. Nu tar jag aldrig av den igen.'],
  },
  hittade_medaljong: {
    pages: ['Dagny hittade en MEDALJONG. Inuti sitter ett fotografi av en ung man med keps.'],
  },
  sigge: {
    speaker: 'Sigge',
    pages: ['Pappa säger att hammaren i bruket stannade när kvarnen slutade mala. Allt hänger ihop, säger han.'],
  },
  sigge_efter: {
    speaker: 'Sigge',
    pages: ['Hammaren går igen! Dunk, dunk, dunk hela dagen. Jag har aldrig tyckt att det låtit så fint.'],
  },
  hilma_vila: {
    speaker: 'Hilma i sjöboden',
    pages: ['Sjöboden luktar tjära och strömming, men sängarna är torra. Vill du vila?'],
    choices: [
      { text: 'Vila i sjöboden', next: 'hilma_vilat', actions: [{ type: 'rest' }] },
      { text: 'Inte nu', next: 'hilma_hej' },
    ],
  },
  hilma_vilat: {
    speaker: 'Hilma i sjöboden',
    pages: ['God morgon! Du sov som en säl. Kom tillbaka när du vill, nyckeln ligger under stenen.'],
  },
  hilma_hej: {
    speaker: 'Hilma i sjöboden',
    pages: ['Havet ger och havet tar, brukar vi säga. Men just nu tar det mest.'],
  },
  viola_lar: {
    speaker: 'Nätlagerskan Viola',
    pages: [
      'Du hoppar bra, men du hoppar som en människa. Jag ska lära dig hoppa som en sädesärla.',
      'Min mormor sa läsningen varje vår när fåglarna kom tillbaka. Hon påstod att hon kunde hoppa över båtarna.',
      '"Fjäder i fot och vind under häl, lätt som en ärla, lätt som en själ." Så. Nu ska du se.',
    ],
    actions: [{ type: 'learnSpell', spell: 'hopp' }],
    next: 'lart_hopp',
  },
  lart_hopp: {
    pages: ['Dagny lärde sig läsningen HOPP!\nDagny hoppar högre en stund.'],
  },
  viola_igen: {
    speaker: 'Nätlagerskan Viola',
    pages: ['Akta så att du inte hoppar ner i sjön. Nät har jag gott om, men håvar har jag inga.'],
  },
  johan_uppdrag: {
    speaker: 'Fiskaren Johan',
    pages: [
      'Min kompass är borta! Jag rodde ut till fyren när stormen kom och tappade den i tornet.',
      'Utan den hittar jag inte hem i dimman. Den sitter i en mässingsdosa med en röd nål.',
    ],
    actions: [{ type: 'flag', flag: 'kompass_uppdrag' }],
  },
  johan_vantar: {
    speaker: 'Fiskaren Johan',
    pages: ['Den ligger nog uppe i fyren, i rummet med de stora linserna. Jag sprang därifrån så fort jag kunde.'],
  },
  johan_tack: {
    speaker: 'Fiskaren Johan',
    pages: [
      'Där är den! Och nålen pekar mot norr igen. Då har stormen lagt sig på riktigt.',
      'Ta det här. Och kom ut med båten en morgon, så ska jag visa dig var gäddorna står.',
    ],
    actions: [{ type: 'takeItem', item: 'kompass' }, { type: 'flag', flag: 'kompass_klar' }, { type: 'xp', amount: 250 }, { type: 'heal' }, { type: 'container', kind: 'liv', id: 'kompass' }],
    next: 'johan_xp',
  },
  johan_xp: {
    pages: ['Dagny fick 250 XP och en LIVBEHÅLLARE av Johan.'],
  },
  johan_glad: {
    speaker: 'Fiskaren Johan',
    pages: ['Nålen har inte darrat en enda gång sedan du kom med den. Havet är lugnt igen.'],
  },
  hittade_kompass: {
    pages: ['Dagny hittade en KOMPASS i en mässingsdosa. Nålen darrar och pekar mot norr. Den är nog Johans.'],
  },
  fiske_skylt: {
    pages: ['En skylt på bryggan:\n"FISKELÄGETS BRYGGA. HOPPA EJ I. VATTNET ÄR KALLT, ÄVEN I JULI."'],
  },
  stina: {
    speaker: 'Stina',
    pages: ['Fyren har inte lyst på hela sommaren. Pappa säger att Havsfrun har blåst ut den.'],
  },
  stina_efter: {
    speaker: 'Stina',
    pages: ['Fyren lyser igen! Jag räknar blinkarna innan jag somnar. Jag kommer alltid till tjugo.'],
  },
  ture: {
    speaker: 'Gamle Ture',
    pages: [
      'Jag var fyrvaktare en gång, innan de gjorde fyren automatisk. Ensamt, men vackert.',
      'Midsommarnatten 1946 såg jag ett ljus gå ner över Kyrkbyn. Jag skrev det i loggboken. Ingen trodde mig.',
    ],
  },
  ture_efter: {
    speaker: 'Gamle Ture',
    pages: ['Har du läst min loggbok? Då vet du att jag inte ljög. Tack för att du tände fyren igen.'],
  },
  anna_vila: {
    speaker: 'Budejan Anna',
    pages: ['Du ser trött ut. Det finns mjölk i kallkällan och en bädd i stugan. Vill du vila?'],
    choices: [
      { text: 'Vila i stugan', next: 'anna_vilat', actions: [{ type: 'rest' }] },
      { text: 'Inte nu', next: 'anna_hej' },
    ],
  },
  anna_vilat: {
    speaker: 'Budejan Anna',
    pages: ['Korna har redan gått ut. Du sov så gott att jag inte nändes väcka dig. Kom tillbaka när du vill.'],
  },
  anna_hej: {
    speaker: 'Budejan Anna',
    pages: ['Gå inte för långt in i skogen. Det är lätt att gå vilse i Fäbodskogen, även för oss som bor här.'],
  },
  karna_lar: {
    speaker: 'Gammelmor Karna',
    pages: [
      'Jaså, det är du. Skogen har viskat om dig ett tag nu. Om flickan som förlikar.',
      'Jag kan en läsning som få kan. Man byter hamn, blir en liten fågel som kommer in där ingen annan kommer in.',
      '"Hamn av fjäder, hamn av vind, byt mig om och ta mig in." Så. Men flyg inte för länge, då glömmer du vem du är.',
    ],
    actions: [{ type: 'learnSpell', spell: 'hamn' }],
    next: 'lart_hamn',
  },
  lart_hamn: {
    pages: ['Dagny lärde sig läsningen HAMN!\nDagny blir en liten fågel en stund och kan flyga genom trånga passager.'],
  },
  karna_igen: {
    speaker: 'Gammelmor Karna',
    pages: ['En fågel ser världen uppifrån. Det är nyttigt för en Väktare. Man ser vad som hänger ihop.'],
  },
  karna_vanta: {
    speaker: 'Gammelmor Karna',
    pages: [
      'Du är inte redo än, lilla vän. Att byta hamn är farligt för den som inte vet vem hon är.',
      'Gå ner i gruvan först. Den som har varit i mörkret vet var ljuset finns. Kom tillbaka sedan.',
    ],
  },
  lillper_uppdrag: {
    speaker: 'Lill-Per',
    pages: [
      'Stjärna har tappat sin skälla! Nu hittar jag henne inte när hon går in i skogen.',
      'Jag tror att den ramlade av vid de tre stigarna. Där vågar jag inte gå. Det fnissar mellan granarna.',
    ],
    actions: [{ type: 'flag', flag: 'skalla_uppdrag' }],
  },
  lillper_vantar: {
    speaker: 'Lill-Per',
    pages: ['Skällan ligger nog vid Villvägarna i skogen, där stigen delar sig i tre. Lyssna efter klangen!'],
  },
  lillper_tack: {
    speaker: 'Lill-Per',
    pages: [
      'Den klingar! Stjärna, hör du? Nu kan du gå vart du vill igen.',
      'Ta det här. Mamma säger att man ska betala sina skulder. Och jag har inget annat.',
    ],
    actions: [{ type: 'takeItem', item: 'skalla' }, { type: 'flag', flag: 'skalla_klar' }, { type: 'xp', amount: 150 }, { type: 'heal' }],
    next: 'lillper_xp',
  },
  lillper_xp: {
    pages: ['Dagny fick 150 XP och känner sig utvilad.'],
  },
  lillper_glad: {
    speaker: 'Lill-Per',
    pages: ['Stjärna går aldrig vilse längre. Jag hör skällan ända från stugan.'],
  },
  hittade_skalla: {
    pages: ['Dagny hittade en KOSKÄLLA. Den klingar klart när hon skakar den. Den är nog Stjärnas.'],
  },
  stjarna: {
    pages: ['Kon tittar på Dagny med stora, fuktiga ögon. Hon saknar sin skälla.'],
  },
  stjarna_glad: {
    pages: ['Stjärna råmar nöjt. Skällan klingar när hon vänder på huvudet.'],
  },
  rosen: {
    pages: ['En kraftig fjällko med stora horn. Hon tuggar och tuggar och bryr sig inte om någonting annat.'],
  },
  britta: {
    speaker: 'Britta',
    pages: ['Mormor Karna säger att hon kan bli en uggla. Jag har aldrig sett det. Men hon vet saker hon inte borde veta.'],
  },
  britta_efter: {
    speaker: 'Britta',
    pages: ['Skogsrået sjunger om nätterna nu! Inte läskigt, mest vackert. Mormor sjunger med.'],
  },
  lind_vila: {
    speaker: 'Fru Lind på järnvägshotellet',
    pages: ['Järnvägshotellet har rum med utsikt över spåren. Tågen går inte just nu, så det är tyst. Vill du vila?'],
    choices: [
      { text: 'Vila på hotellet', next: 'lind_vilat', actions: [{ type: 'rest' }] },
      { text: 'Inte nu', next: 'lind_hej' },
    ],
  },
  lind_vilat: {
    speaker: 'Fru Lind på järnvägshotellet',
    pages: ['God morgon! Frukosten är serverad, och det är kaffe på kannan. Ditt rum står alltid redo.'],
  },
  lind_hej: {
    speaker: 'Fru Lind på järnvägshotellet',
    pages: ['Det kom inte ett enda tåg i går. Inte i förrgår heller. Gästerna blir färre och färre.'],
  },
  oskar_lar: {
    speaker: 'Telegrafisten Oskar',
    pages: [
      'Telegrafen tystnade i maj, men trådarna sjunger fortfarande. Hör du? Det är åskan som bor i dem.',
      'Min farfar var rallare. Han lärde mig en läsning som han fick av en gammal man vid Torsåsen. Tors vrede.',
      '"Åska i tråd och åska i sten, slå alla onda, skona var en." Så. Använd den sparsamt. Den tar mycket kraft.',
    ],
    actions: [{ type: 'learnSpell', spell: 'aska' }],
    next: 'lart_aska',
  },
  lart_aska: {
    pages: ['Dagny lärde sig läsningen ÅSKA!\nTräffar alla väsen på skärmen. Kostar mycket magi.'],
  },
  oskar_igen: {
    speaker: 'Telegrafisten Oskar',
    pages: ['Åskan är inte arg. Den är bara stark. Det är skillnad.'],
  },
  berg_uppdrag: {
    speaker: 'Stinsen Berg',
    pages: [
      'Min visselpipa! En pojke lånade den och sprang till folkparken. Sedan kom han hem utan.',
      'Utan visselpipan kan jag inte släppa iväg några tåg. Det står i reglementet.',
    ],
    actions: [{ type: 'flag', flag: 'visselpipa_uppdrag' }],
  },
  berg_vantar: {
    speaker: 'Stinsen Berg',
    pages: ['Pojken sa att han tappade den vid karusellen i folkparken. Han red på den svarta hästen.'],
  },
  berg_tack: {
    speaker: 'Stinsen Berg',
    pages: [
      'Där är den! Nu ska vi se...',
      'Priiip! Hör du? Nu kan tågen gå igen. Här, ta det här för besväret.',
    ],
    actions: [{ type: 'takeItem', item: 'visselpipa' }, { type: 'flag', flag: 'visselpipa_klar' }, { type: 'xp', amount: 250 }, { type: 'heal' }],
    next: 'berg_xp',
  },
  berg_xp: {
    pages: ['Dagny fick 250 XP och känner sig utvilad.'],
  },
  berg_glad: {
    speaker: 'Stinsen Berg',
    pages: ['Tåget till Kyrkbyn går klockan tolv. Det är det första på hela sommaren.'],
  },
  hittade_visselpipa: {
    pages: ['Dagny hittade en VISSELPIPA i nysilver. Den är nog stinsens.'],
  },
  resenaren: {
    speaker: 'Resenären',
    pages: ['Jag har väntat på tåget i tre dagar. Det har varit en mycket lugn semester, måste jag säga.'],
  },
  kalle: {
    speaker: 'Kalle',
    pages: ['Jag lånade stinsens visselpipa och tappade den. Säg inget till honom. Snälla.'],
  },
  kalle_efter: {
    speaker: 'Kalle',
    pages: ['Lyktorna i folkparken lyser igen! Mamma säger att jag får gå dit på lördag. Om jag inte tappar något.'],
  },

  // --- Trollberget ------------------------------------------------------------
  troll_skylt1: {
    pages: ['Någon har ristat i berget, för länge sedan:\n"D. GICK HÄR MIDSOMMARNATT 1946. GLÖM OSS INTE."'],
  },
  bergakung_vaknar: {
    speaker: 'Bergakungen',
    pages: [
      'SÅ. ÄNTLIGEN KOMMER NÅGON UPP FÖR BERGET IGEN.',
      'DE STENGÄRDSGÅRDAR NI RIVER. DE KÄLLOR NI FYLLER IGEN. DE NAMN NI GLÖMMER. ALLT DET BÄR JAG.',
      'HON SOM BAND MIG ÄR SVAG NU. VISA MIG OM DU ÄR STARKARE, LILLA VÄKTARE.',
    ],
  },
  bergakung_forlikad: {
    speaker: 'Bergakungen',
    pages: [
      'Du slog... men inte för att döda. Och du gick upp hela vägen, genom sex platser som alla har vaknat i godo.',
      'Då minns människorna oss igen. Vreden får vila.',
      'Hon som väntar här har hållit mig i arton år. Gå till henne nu. Hon har väntat längre på dig än på mig.',
    ],
  },
  dagmar_avsked: {
    speaker: 'Dagmar',
    pages: [
      'Dagny. Du har blivit så stor.',
      'Midsommarnatten 1946 sov alla platserna in, och Bergakungen vaknade i vrede. Det fanns ingen annan Väktare än jag.',
      'Så jag lade dig i näverfilten under klockstapeln, där Hulda skulle hitta dig. Och så gick jag upp i berget.',
      'Jag band mig vid honom, så länge människorna mindes de heliga platserna. Men de glömde. Bandet blev svagare för varje sommar.',
      'Nu har du väckt dem igen, en efter en. Bandet behövs inte längre. Och jag... jag kan inte stanna, älskling.',
    ],
    choices: [{ text: 'Krama henne', next: 'dagmar_ljus' }],
  },
  dagmar_ljus: {
    speaker: 'Dagmar',
    pages: [
      'Där. Nu vet jag hur det känns. Det räckte gott.',
      'Du behöver inte säga något. Det har du aldrig behövt. Ditt namn säger allt: ny dag.',
      'Hälsa Hulda. Tacka henne från mig, för allt hon har gjort.',
      'Se. Solen går upp.',
    ],
    actions: [{ type: 'flag', flag: 'trollberget_klar' }, { type: 'scene', scene: 'ending' }],
  },

  // --- Epilogue -----------------------------------------------------------------
  epilog_intro: {
    pages: ['Midsommarafton, ett år senare. Hela byn har kommit ut på vägen. Någon har rest en majstång mitt i byn.'],
  },
  hulda_epilog: {
    speaker: 'Mormor Hulda',
    pages: [
      'Där är du ju! Kom hit med dig. Jag hälsade på vid klockstapeln i morse. Det låg färska blommor där.',
      'Dagmar vävde aldrig klart filten. Så jag gjorde det i vintras, med din hjälp. Den hänger över din säng nu.',
      'Varje midsommar ska vi tända ljusen på de sju platserna. Så glömmer ingen igen.',
      'Gå nu och dansa. Det är midsommar, och sommaren är ljus igen.',
    ],
    choices: [
      { text: 'Dansa runt stången', actions: [{ type: 'scene', scene: 'credits' }] },
      { text: 'Inte än', next: 'hulda_epilog_vanta' },
    ],
  },
  hulda_epilog_vanta: {
    speaker: 'Mormor Hulda',
    pages: ['Gå runt och hälsa på gästerna du, så väntar jag här. Dansen börjar när du vill.'],
  },
  sven_epilog: {
    speaker: 'Sven',
    pages: ['Jag har sett många midsomrar, Dagny. Men ingen där solen kändes som den gör i år.'],
  },
  karin_epilog: {
    speaker: 'Karin',
    pages: ['Murre har inte smitit en enda gång sedan i fjol. Han vet var han har det bra. Det vet vi alla nu.'],
  },
  maj_epilog: {
    speaker: 'Maj',
    pages: ['Vi tog bussen från Gruvsamhället hela vägen hit! Elin hälsar. Hon säger att lampan i gruvan lyser av sig själv om nätterna.'],
  },
  anders_epilog: {
    speaker: 'Anders',
    pages: ['Fickuret går fortfarande. Jag ställde det på midsommar, så det alltid ska påminna mig om dig.'],
  },
  olle_epilog: {
    speaker: 'Olle',
    pages: ['Radion spelar bara dansband nu! Inget brus alls. Ibland hör jag en fiol långt bakom musiken, men den låter glad.'],
  },
  greta_epilog: {
    speaker: 'Greta',
    pages: ['Jag har bakat sju sorters kakor, en för varje plats. Ta en med kanel, det är den för Trollberget.'],
    actions: [{ type: 'heal' }],
  },
  murre_epilog: {
    pages: ['Murre har en blomkrans runt halsen. Han ser inte glad ut över den. Men han spinner ändå.'],
  },
  vatte_epilog: {
    speaker: 'Vätten',
    pages: ['Blås inte i luren i dag, Väktare. I dag kommer vi ändå. Vi har aldrig sett en majstång så nära förut!'],
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
