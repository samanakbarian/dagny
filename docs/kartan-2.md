# Kartan 2.0 – specifikation

*Status: steg 1 påbörjat. Beslut 15 oktober 2026 (se §10).*
*Ersätter överblickskartan från oktober 2026 (80 × 56, sju regioner).*

## 1. Problemet

I dag är kartan sju "fyrkanter" i rad. Varje skatt öppnar nästa fyrkant, och
varje fyrkant innehåller samma sak: en by, ett tempel, en liten plats och en
hemlighet. Mellan dem finns bara gräs, skog och slumpmöten. Resultatet:

- **Ingen resa.** Gränserna är en ruta man går över, inte ett äventyr.
- **Samma rytm sex gånger.** Ny skatt → ny fyrkant → by → tempel → skatt.
- **Skatterna öppnar bara dörrar.** De ändrar inte hur man rör sig eller ser världen.
- **Ingen anledning att gå tillbaka.** Gamla fyrkanter är färdiga och tomma.
- **Inget okänt som lockar.** Man ser inga mål i fjärran och hör inga rykten.

## 2. Målet

Kartan ska kännas som Zelda II: en farlig, levande värld där **vägen mellan
platserna är halva äventyret**.

### Sex pelare

1. **Resan är äventyret.** Varje gräns korsas genom en egen bana eller en egen utmaning, inte en ruta.
2. **Varje skatt är ett nytt sätt att röra sig eller se.** Inte bara en nyckel.
3. **Världen hänger ihop.** Varje ny skatt öppnar också något i gamla områden: genvägar, grottor, öar.
4. **Det okända lockar.** Trollberget syns överallt. Rykten, vägskyltar och utsiktspunkter visar på saker man ännu inte når.
5. **Varje kapitel har egen karaktär.** Egna faror, eget ljus, eget väder, egen musik och eget tempo.
6. **Framsteg syns.** Ett förlikat tempel får området att blomma upp, och byarna förändras.

### Storyns tråd: Dagmars spår

Resan följer Dagmar, den sista Väktaren. Varje skatt var hennes: ekan bar
henne över sjön (Grimmen), lampan har initialerna H.D., stövlarna lämnade hon
vid forsen, radion lyssnade hon på mellan stationerna, och näverfilten vävde
hon på vallen. Därför ska äventyret på kartan drivas av hennes spår, inte bara
av nästa lås:

- **Varje resa (§4) bär ett spår av Dagmar:** en ristning, ett föremål eller en plats hon stod på. Dagny följer en människa, inte en lista.
- **Signalen över sjön.** Dagmar blinkade varje kväll med sin lampa från en strand (tre korta, tre långa, tre korta), och Hulda svarade från vinden i klockstapeln i Kyrkbyn. Kartan ska därför ha **fri sikt över sjön mellan Kyrkbyn och Signalstranden** på andra sidan. Signalstranden blir en liten plats som nås med ekan, och med ficklampan (kapitel 6) kan Dagny blinka signalen själv. Det blir en återkomst med en stark scen.
- **Vägen till Trollberget.** Tyra såg Dagmar gå från klockstapeln mot Trollberget. Bergsstigen nås därför norrifrån via höglandet, inte genom gruvbygden.
- **Hulda berättar i takt med resan** (`hulda_efter_*`). Rykten och nya platser får inte avslöja mer än hon gjort.

### Det som ligger fast

- **Templens ordning är fast, 1 → 7** (beslut A). Friheten finns i sidoplatserna och i hur man tar sig fram.
- Dagny säger aldrig något. Inga riktiga varumärken. Svensk folktro, 1964.
- Mobil först: allt ska gå att spela med pekkontrollerna.

## 3. Strukturen: åtta kapitel

Spelet delas in i kapitel i stället för fyrkanter. Varje kapitel har en
**resa** (hur man tar sig dit), ett **område** (by, platser, hemligheter), ett
**tempel**, och en **återkomst** (vad skatten öppnar i gamla områden).

| # | Kapitel | Resan dit | Ny förmåga på kartan | Tempel → skatt |
|---|---|---|---|---|
| 1 | **Hemdalen** | – (start) | Gå, slåss | Stenkyrkans krypta → Ekan |
| 2 | **Sjön** | Segla fritt | Ekan: vatten, öar, strömmar | – (sjön är resan) |
| 3 | **Gruvbygden** | I land vid Gruvbryggan | – | Gamla gruvan → Karbidlampan |
| 4 | **Stollen och kvarndalen** | **Gamla stollen**, sidovybana genom fjället | Karbidlampan: mörka banor | Kvarnen → Stövlarna |
| 5 | **Myren och kusten** | **Myrlabyrinten**: dimma, landmärken, irrbloss | Stövlarna: myr, vadställen | Fyren → Ficklampan |
| 6 | **Natten** | **Nattskogen**: mörk karta, ljuskägla | Ficklampan: ljus på kartan | Folkparken → Radion |
| 7 | **Bruset** | Den dolda stigen | Radion: knaster nära hemligheter, överallt | Fäbodskogen → Näverluren |
| 8 | **Uppstigningen** | **Bergsstigen**: labyrint av stigar och grottor | Näverluren: kallar vättar | Trollberget |

Kapitel 2 och 3 skiljs åt för att sjön ska bli ett eget äventyr och inte bara
en väg till gruvan.

## 4. Kapitlen i detalj

### Kapitel 1 – Hemdalen (lära sig)

- **Känsla:** trygg sommarkväll, men Trollberget hänger svart i norr, alltid synligt.
- **Innehåll:** Mormors by, Kyrkbyn, Björkhagen, Gamla kyrkogården, Stenkyrkan. Läkning från Sven, Nedåtstöt från Algot.
- **Nytt:** en **utsiktspunkt** (Kyrkbacken) som visar sjön, öarna och fjället på pausmenyns karta som "sedda på avstånd". Det sår frön.
- **Rykten:** Telefonist-Greta har hört om ljus på en ö mitt i sjön.
- **Gränsen:** sjön. Ekan är Dagmars båt. Grimmen ger den när kryptan är förlikad ("Den bar henne över sjön en gång"), och den väntar vid bryggan.

### Kapitel 2 – Sjön (frihet)

- **Känsla:** första gången världen öppnar sig. Vind, vågor, måsar, en ny låt (sjöfärd).
- **Segling:** ekan är ett fordon på kartan. Man ror fritt över vattnet och kliver i land bara vid bryggor.
- **Strömmar** nära forsen drar ekan nedströms, så man måste ro emot. **Dimbankar** döljer kartan runt ekan.
- **Öar att välja mellan** (valfri ordning):
  - **Jättegrytan** (finns i dag): grotta på holmen.
  - **Eremitholmen** (ny): en gubbe som byter ett ryktesminne mot en fisk och berättar om gruvan.
  - **Måsskäret** (nytt, hemligt): ett litet skär som eremiten berättar om. Där ligger en näverdocka.
  - **Signalstranden** (ny, på andra sidan sjön, mitt emot Kyrkbyn): stenen där Dagmar stod och blinkade. Ristat i stenen: tre streck, tre ringar, tre streck.
- **Gruvbryggan** i norr leder till kapitel 3.
- **Återkomst:** en vik vid Mormors by blir en genväg hem.

### Kapitel 3 – Gruvbygden (arbete och berg)

- **Känsla:** gruvsamhälle, slaggvarp, damm, sirener från gruvan.
- **Innehåll:** Gruvsamhället (Lyse från Elin), Kolartorpet, Gamla gruvan.
- **Byn ger nyckeln till templet:** gruvan behöver något från Gruvsamhället, till exempel Anders gruvnyckel efter fickursuppdraget eller ljuset från Lyse i en mörk sal.

### Kapitel 4 – Stollen och kvarndalen (mörker under jord)

- **Resan:** **Gamla stollen** är en kort sidovybana i 2–3 rum genom fjället, mörk och bara upplyst av karbidlampan. Den har gruvvagnar, ett eget litet hot (ett ras som jagar) och ett vägval där ena grenen leder till ett gömt rum.
- **Område:** Bruksorten, Kvarnen vid forsen, Pestkorset, Fallgrottan bakom vattenfallet.
- **Byn drar in:** kvarnen kräver **Uppåtstöt** från förman Karlsson i Bruksorten. En lucka i kvarnen kan bara slås upp underifrån. Bruksorten ligger på vägen från stollen till kvarnen.
- **Återkomst:** stollen har en sidogång som leder tillbaka till Gruvsamhället, en genväg.

### Kapitel 5 – Myren och kusten (vilse)

- **Resan:** **Myrlabyrinten**. Dimma döljer allt utom några rutor runt Dagny, och pausmenyns karta visar bara det hon sett.
  - Man hittar via **landmärken:** en död tall, ett vägkors, en övergiven pråm.
  - **Irrbloss** vandrar på myren och lockar mot gungfly som sänker Dagny tillbaka till kanten.
  - Tjuvgrottan ligger mitt i myren.
- **Område:** Fiskeläget (Hopp från Viola), Skeppssättningen, Fyren i skären.
- **Byn drar in:** fyren behöver något från Fiskeläget, till exempel att Johan ror Dagny ut till fyrskäret när kompassen är hittad, eller att Viola lär ut Hopp som behövs i fyren.
- **Återkomst:** stövlarna gör att man kan vada över forsen hem, en genväg från kusten till Hemdalen.

### Kapitel 6 – Natten (rädsla)

- **Resan:** **Nattskogen**. Kartan blir mörk och bara **ficklampans ljuskägla** framför Dagny syns.
  - Vargar syns bara som ögon i mörkret.
  - Det finns ljud att följa: en fiol från Folkparken, ett tåg som visslar.
- **Område:** Stationssamhället, Folkparken, Milstolpen.
- **Tåget:** när stinsens uppdrag är klart kan Dagny åka tåg mellan stationerna. Det blir **snabbresa** mellan Hemdalen, Gruvbygden och kusten, och belöningen känns stor.
- **Byn drar in:** Oskar lär ut Åska, som behövs i Folkparken.
- **Återkomst:** ficklampan visar grottor och tecken i gamla områden, och en grotta i Björkhagen öppnas.

### Kapitel 7 – Bruset (det dolda)

- **Radion knastrar** starkare ju närmare en hemlighet man är, på hela kartan. Det blir en jakt bakåt genom alla tidigare kapitel: dolda stigar, en bergsdörr, gömda rum i templen (finns i dag) och nya hemligheter på kartan.
- **Resan:** den dolda stigen genom granskogen till höglandet.
- **Område:** Fäboden (Hamn från Karna), Fäbodtorpet, Fäbodskogen.
- **Byn drar in:** Lill-Pers koskälla, eller Karna, ger något som behövs i Fäbodskogen.

### Kapitel 8 – Uppstigningen (finalen)

- **Resan:** **Bergsstigen**, en labyrint av stigar, stup och grottor uppför Trollberget, som dödsberget i Zelda II.
  - Flera korta sidovygrottor binder ihop fickor på kartan.
  - Fel väg leder tillbaka ner.
  - Det stormar: vinden knuffar Dagny på kartan.
  - Väktarkammaren ligger på vägen.
- **Näverluren** kallar en vätte som visar vägen i en av grottorna.
- **Templet:** Trollberget, som i dag.

## 5. System som behöver byggas

### 5.1 Passager (sidovybanor mellan områden)

En **passage** är en kort sidovybana med en ingång på kartan i ena änden och
en utgång i den andra. Den är inte ett tempel: inga nycklar och ingen boss, men
fiender, ett hot och gärna ett vägval eller en hemlighet.

- Data: `OverworldPlace` får `kind: 'passage'` och `to: { x, y }`. Banans `right` leder ut på kartan vid `to`, och `left` tillbaka.
- Passager: Gamla stollen (kap 4), grottorna i Bergsstigen (kap 8). Kanske även en bro över forsen som bana.

### 5.2 Sikt på kartan: dimma och mörker

- Kartan kan ritas med **begränsad sikt:** en radie runt Dagny (dimma) eller en kägla framåt (ficklampan).
- Terrängtabellen (`TERRAIN`) får `sight?: 'fog' | 'dark'`. Sikten gäller medan Dagny står på sådan mark.
- Det som är utanför sikten ritas inte, och slumpmöten syns inte förrän de är nära.

### 5.3 Fordon: ekan

- Står Dagny vid en brygga med ekan byter hon till ekan och ror fritt över `~`.
- I land kan hon bara stiga vid bryggor (`j`). Ekan ligger kvar vid bryggan där hon klev av.
- **Strömmar** (ny terräng `≈` eller en riktningstabell) knuffar ekan.
- Sjöfärden har egen musik.

### 5.4 Dygnet – struket

Beslut: inga tider på dygnet som styr hemligheter. Gryningsskäret heter nu Måsskäret och hittas i
stället med ett rykte från eremiten och syns från en utsiktspunkt. Natten i
kapitel 6 är platsens egenskap (nattskogen), inte en klocka.

<details><summary>Det ursprungliga förslaget</summary>


- Tiden går med stegen på kartan: **dag, kväll, natt, gryning**. En hel cykel tar ungefär fem minuters vandring.
- Att vila i en by sätter tiden till morgon.
- Kartan tonas efter tid på dygnet. Mötestabellerna har redan nattvarianter.
- Vissa saker finns bara vid vissa tider: Gryningsskäret, fiolen i Folkparken på natten, ett irrbloss på kyrkogården vid midnatt.

</details>

### 5.5 Rykten, utsikter och skyltar

- **Rykten:** vissa repliker sätter en flagga `rykte_<plats>`. Pausmenyns karta visar då ett **?** vid platsen, även om den är osedd.
- **Utsiktspunkter:** några platser (Kyrkbacken, gruvlavens tak, fyren) avslöjar ett större område på pausmenyns karta som "sett på avstånd" (ljusare dimma).
- **Vägskyltar** vid korsningar pekar mot byar man ännu inte varit i.

### 5.6 Återkomst

- Varje skatt öppnar 1–2 saker i tidigare kapitel. Listan står i §4, och en tabell i `speldesign.md` hålls uppdaterad.
- Genomspelningslösaren kontrollerar att varje återkomst är nåbar med rätt skatt och inte före.

### 5.7 Förvandling när ett tempel förlikas

- Regionens marktoning går från grå till sommar.
- Antalet skuggmöten på kartan halveras.
- Byns musik får en ljusare variant.
- Bybor får nya repliker (finns delvis i dag via `hulda_efter_*`).
- På kartan syns folk ute på vägarna, ett par vandrande figurer per förlikat område.

### 5.8 Byn ger nyckeln

Varje tempel kräver något från närmaste by, en läsning, en teknik eller ett
föremål, som Zelda II:s byar. Tabell:

| Tempel | Kräver | Från |
|---|---|---|
| Kryptan | Läkning (rekommenderas), Nedåtstöt efteråt | Mormors by (som i dag) |
| Gruvan | Lyse i en mörk sal | Gruvsamhället |
| Kvarnen | Uppåtstöt (lucka underifrån) | Bruksorten |
| Fyren | Hopp (hög avsats i fyrtornet) | Fiskeläget |
| Folkparken | Åska (väcker ljusslingorna) | Stationssamhället |
| Fäbodskogen | Hamn (fågel över ett stup) | Fäboden |

## 6. Kartan: ny form

- **Storlek:** cirka 96 × 72 rutor (i dag 80 × 56). Kartan blir större men fylls inte jämnt: täta platser varvas med tomma vidder och vatten.
- **Siktlinjer:** Trollberget i norr syns från nästan överallt. Sjön i mitten syns från alla tidiga områden.
- **Skiss** (norr upp; inte skalenlig):

```
  ┌──────────────────────────────────────────────────────────────┐
  │ Fäbodskogen   Bergsstigen ▲ TROLLBERGET ▲      Kvarnen ≋ forsen│
  │   Fäboden     (labyrint)    Väktarkammaren   Fallgrottan      │
  │  ⋯ dolda stigen ⋯                         Bruksorten           │
  │ ███ granskog ███   Gruvan ⛏   ═══ Gamla stollen ═══  Pestkorset│
  │                 Gruvsamhället  Kolartorpet                     │
  │ Kyrkbacken☆      Gruvbryggan                ░░ MYREN ░░        │
  │ Kyrkbyn  Stenkyrkan   ~~~~~~~ SJÖN ~~~~~~~  ░ Tjuvgrottan ░    │
  │ Kyrkogården        ~ Eremitholmen ~ Jättegrytan ~   Fiskeläget │
  │ Mormors by ⌂ brygga ~~~ Måsskäret     ~~~       Skeppssättn.  │
  │ Björkhagen      ▓▓ NATTSKOGEN ▓▓   Stationen ═ räls ═  Fyren ⌂ │
  │                  Milstolpen   Folkparken ✦                     │
  └──────────────────────────────────────────────────────────────┘
```

- **Gränser:** varje gräns är en passage, ett vatten, en dimma, ett mörker eller en labyrint (§4). Inga raka murar av berg.
- Kartan genereras som i dag med verktygen i `scratchpad` (ow_gen, ow_check), men från en ny handritad mall.

## 7. Vad som påverkas i koden

| Del | Ändring |
|---|---|
| `src/data/overworld.ts` | Ny karta, platser, passager, bryggor, strömmar |
| `src/data/terrain.ts` | `sight`, strömmar, nya landmärken (död tall, pråm, utsikt) |
| `src/data/types.ts` | `OverworldPlace.kind/to`, rykten, tidsvillkor |
| `src/game/overworld.ts` | Fordon, sikt, dygn, rykten, vandrande folk, förvandling |
| `src/game/menus.ts` | Pausmenyns karta: rykten (?), "sett på avstånd" |
| `src/data/areas/` | Nya passager: Gamla stollen, Bergsstigens grottor, nya småplatser |
| `src/data/npcs.ts`, `dialog/` | Rykten, "byn ger nyckeln", eremiten, tåget |
| `src/audio/songs.ts` | Sjöfärd, natt, dimma, storm (enligt soundtrackets linje) |
| `src/game/save.ts` | Migrering: gamla sparfiler placeras på motsvarande plats på nya kartan |
| `src/tools/playthrough.ts` | Fordon, passager, återkomst, dygnsvillkor |

## 8. Klart när (acceptanskriterier)

- [ ] Genomspelningslösaren klarar spelet, och templen faller i ordning 1 → 7.
- [ ] Varje kapitel 2–8 har en resa som inte är en ruta: segling, passage, dimma, mörker eller labyrint.
- [ ] Varje skatt öppnar minst en sak i ett tidigare kapitel (återkomst), och inte innan skatten finns.
- [ ] Varje tempel kräver något från sin by (tabellen i §5.8), och lösaren visar att templet inte går utan det.
- [ ] Trollberget syns på skärmen från minst hälften av alla gångbara rutor.
- [ ] Inga raka gränser längre än sex rutor (som i dag), och något nytt i sikte på varje skärm (som i dag).
- [ ] Gamla sparfiler fungerar och hamnar på rätt plats.
- [ ] Inga gropar att fastna i, i passager eller nya rum (grop-testet, med plattformar).
- [ ] Provspelat på telefon: varje kapitel känns annorlunda (din bedömning).

## 9. Leveranser – ett kapitel i taget

Varje steg går att provspela innan nästa påbörjas.

1. **Grunden:** passager, sikt (dimma och mörker), fordonet ekan och dygnet, provade på dagens karta.
2. **Ny karta, kapitel 1–3:** Hemdalen, Sjön och Gruvbygden med utsikt, rykten, öar och strömmar.
3. **Kapitel 4:** Gamla stollen och kvarndalen, där Bruksorten drar in.
4. **Kapitel 5:** Myrlabyrinten och kusten.
5. **Kapitel 6:** Nattskogen och tåget.
6. **Kapitel 7–8:** radiojakten och Bergsstigen.
7. **Förvandling och finputs:** blommande områden, vandrande folk, musik, balans.

## 10. Beslut (15 oktober 2026)

1. **Dygnet:** nej – inga tider som styr hemligheter (§5.4 struket).
2. **Snabbresa:** tåget mellan stationerna i Hemdalen, Gruvbygden och vid kusten, öppnat i kapitel 6. Avgörs när kapitel 6 byggs.
3. **Kartans storlek:** 96 × 72.
4. **Ekan:** fri segling bara om den tillför något – provas i steg 2, annars bryggor att hoppa mellan.
5. **Byn ger nyckeln:** tabellen i §5.8 gäller tills vidare.
6. **Nya platser:** börja med grunden och se om det tillför spelkänsla.

### Steg 1 (gjort)

- **Gamla stollen** (`data/areas/passager.ts`): gruvorten är nu en mörk sidovybana genom fjället, inträde från båda håll, med vagn över en taggränna, ett ras att hoppa över och ett galleri under taket där radion avslöjar en näverdocka (återkomst). Gruvorten är markerad `passage` i terrängtabellen.
- **Dimma på myren och mörker i nattskogen** (`sight` i terrängtabellen): bara några rutor runt Dagny syns, i skogen bara ficklampans sken framför henne, och pausmenyns karta fylls bara i nära henne.

### Steg 2 (gjort)

- **Ny karta, 96 × 72** (`scripts/kartan/`): genererad från en grov plan enligt §6 och storyns krav – sjön i mitten, Kyrkbyn och Signalstranden mitt emot varandra, Bergsstigen från höglandet. Alla rum har fått sina utgångar flyttade, och gamla sparfiler (version 4) hamnar vid sin by.
- **Sjön:** strömmar mot forsen drar ekan när Dagny slutar ro, en dimbank döljer Måsskäret, och bryggor på båda stränderna.
- **Kyrkbacken:** ett utsiktsröse – härifrån fylls kartan i långt ut över sjön.
- **Rykten:** Greta har sett ett ljus på en holme; eremiten berättar om Måsskäret och Signalstranden. Det man hört om står som **?** på pausmenyns karta.
- **Eremitholmen, Måsskäret, Signalstranden:** eremiten minns kvinnan med kopparhår, på Måsskäret är ett D och ett H ristade sida vid sida, och vid signalstenen kan Dagny med ficklampan (kapitel 6) blinka tre korta, tre långa, tre korta – och klockstapeln svarar. Hulda berättar efteråt.

## 11. Ursprungliga frågor

1. **Dygnet:** fullt dygn med tidsberoende hemligheter, eller bara fasta tider per kapitel (natt i kapitel 6, gryning vid skäret)?
2. **Tåget som snabbresa:** ja eller nej? Det gör världen mindre men bekvämare.
3. **Kartans storlek:** 96 × 72, eller behålla 80 × 56 och göra den tätare?
4. **Ekan:** fri segling med strömmar, eller enklare (bara bryggor att hoppa mellan)?
5. **Byn ger nyckeln:** stämmer tabellen i §5.8, eller vill du byta något?
6. **Nya platser:** Eremitholmen, Gryningsskäret, Kyrkbacken, Gamla stollen och Bergsstigen. Vill du ha fler, färre eller andra?
