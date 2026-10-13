# Dagnys äventyr

Ett mysigt 2D-actionäventyr för webbläsaren, mobile first. Sommaren 1964, svensk folktro, en tyst hjältinna med en gammal klinga och kyrkklockans kläpp som fäste.

Det här är **Leverans 1 (vertical slice)**: Mormors by → överblickskartan → Stenkyrkans krypta (tempel 1) → Kyrkogrimmen → tillbaka till byn. Motorn och datamodellen är byggda för alla sju tempel.

**Spela:** https://samanakbarian.github.io/dagny/ (publiceras automatiskt från `master`)

**Sätta upp publicering och Google Play:** se [`SETUP.md`](SETUP.md).

## Kom igång

Kräver Node 20 eller senare (22 rekommenderas).

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # Vitest: kollision, XP-kurva, sparformat, rörelse och dataintegritet
npm run build      # statisk mapp i dist/ (typkontroll + Vite)
npm run preview    # servera dist/ lokalt (med service worker)
```

`dist/` kan läggas på vilken statisk värd som helst (GitHub Pages, Netlify, Azure Static Web Apps). Sökvägarna är relativa, så en undermapp fungerar också. PWA och offline kräver HTTPS (eller `localhost`).

## Testa på mobil

1. Kör `npm run host` (det är `vite --host`). Vite skriver ut en nätverksadress, t.ex. `http://192.168.1.23:5173`.
2. Öppna adressen på telefonen (samma wifi) och vrid telefonen till liggande läge.
3. Service worker och installation på hemskärmen kräver HTTPS. Testa PWA:n genom att driftsätta `dist/` på en HTTPS-värd, eller kör `npm run build && npm run preview` och öppna via en HTTPS-tunnel.
   - **iOS Safari:** Dela → "Lägg till på hemskärmen". Startar i helskärm och fungerar offline.
   - **Android Chrome:** meny → "Installera app".

Lägg till `?debug` i adressen för att få alla läsningar och tekniker direkt, vilket är praktiskt när man testar. `window.dagny` exponerar spelobjektet i konsolen.

## Kontroller

| Handling | Tangentbord | Handkontroll | Pekskärm |
|---|---|---|---|
| Rörelse / ducka | Pilar / WASD | Styrkors / spak | Styrspak eller styrkors (vänster) |
| Hoppa (håll = högre) | Z / Mellanslag | A | HOPPA |
| Svärd (håll NER = lågt) | X | B | SVÄRD |
| Magi (vald läsning) | C | Y | MAGI |
| Prata / gå in genom dörr | Upp | Upp | Upp, eller tryck på personen |
| Paus | Esc / P | Start | ❚❚ |

Pekkontrollerna visas automatiskt vid beröring och döljs när tangentbord eller handkontroll används. Storlek, placering, genomskinlighet, styrspak/styrkors och vibration ställs in under **Inställningar**.

## Android / Google Play

Mappen `android/` innehåller en Trusted Web Activity som paketerar webbversionen som Android-app,
och `.github/workflows/android.yml` bygger en signerad `.aab`. Steg för steg (Pages, signeringsnyckel,
Play Console, Digital Asset Links) finns i [`android/README.md`](android/README.md).

## Var ligger vad?

```
src/
  engine/      loop (fast 60 Hz), skärm/skalning, input (tangentbord, handkontroll, touch),
               kollision, sprites, bitmappsteckensnitt, ljudsynt + sequencer, lagring
  game/        scener (titel, sidovy, överblickskarta, berättelsekort), dialog, menyer,
               HUD, sparformat, XP-logik, parallax
  entities/    Dagny, väsen och bossar, NPC:er, projektiler, föremål, partiklar
  data/        ALL speldata – se nedan
  art/         sprites som teckenrutnät + bitmappsteckensnittet
  audio/       låtar (noter) och ljudeffekter (syntparametrar)
public/        manifest, ikoner (service worker genereras vid build från src/sw-template.js)
scripts/       gen-icons.mjs – ritar PWA-ikonerna från spritedata (`npm run icons`)
tests/         Vitest
```

### Data (ändras utan att röra motorn)

| Fil | Innehåll |
|---|---|
| `src/data/palettes.ts` | **Paletten** (~32 färger, ingen ren svart) och **tonfiltren** per område (sommarkväll, grå augusti, midnattssol, lyktsken, krypta …) |
| `src/data/areas.ts` | Sidovyområden: tilemap + dekorlager, utgångar, NPC:er, rekvisita, mörker. Tecknen förklaras i `src/data/legend.ts` |
| `src/data/overworld.ts` | Överblickskartan, platser, synliga möten, vad som kräver eka/stövlar |
| `src/data/temples.ts` | De sju templen och byarna |
| `src/data/enemies.ts` | Väsen (beteende, liv, skada, XP, drops) och bossar med två faser |
| `src/data/dialog.ts` | All dialog. Dagny säger aldrig något – val beskriver vad hon gör |
| `src/data/npcs.ts` | Bybor och vilken dialog de väljer beroende på flaggor |
| `src/data/spells.ts` | De sju läsningarna och teknikerna (nedåtstöt, uppåtstöt) |
| `src/data/items.ts` | Föremål och nyckelskatter |
| `src/data/progression.ts` | XP-kurvan och värden per nivå (Styrka, Magi, Liv, 1–8) |
| `src/data/strings.ts` | All gränssnittstext (förberett för översättning) |
| `src/art/*.ts` | Sprites som rutnät av tecken mot paletten. `getSprite(id, frame)` i `src/engine/sprites.ts` är det enda gränssnittet, så handritade PNG-ark kan ersätta datat senare |
| `src/audio/songs.ts` | Musiken som noter (`"e5:4 f#5:2 r:2"`, längd i sextondelar) |

`tests/data.test.ts` kontrollerar att kartorna är rektangulära, att alla utgångar, dialoger och sprites finns, att varje tecken i texterna finns i teckensnittet, att dialogsidorna får plats och att låtarnas stämmor loopar i takt.

## Tekniska val

- **Rendering:** Canvas 2D i 320×180. Heltalsskalning när den fyller minst ~85 % av skärmen, annars den största skalan som får plats. `image-rendering: pixelated`. Statiska tiles förrenderas per område och sprites cachas på offscreen-canvas vid uppstart.
- **Spelloop:** fast tidssteg 60 Hz, rendering på `requestAnimationFrame`. Vid `visibilitychange` pausas och sparas spelet, ljudet stängs av och pausmenyn öppnas när man kommer tillbaka.
- **Sparning:** `localStorage` bakom en wrapper som aldrig kastar fel och faller tillbaka på minnet. Spelet autosparar vid varje områdesbyte, vila, ljusstake (checkpoint), nyckel och när appen tappar fokus. Sparfilen är versionerad och valideras fält för fält.
- **Ljud:** Web Audio-synt med dragspels-, nyckelharps-, flöjt-, kyrkklocke- och orgelklanger. Låses upp vid första tryck (krav på iOS).
- **Förlåtande styrning:** coyote time, hoppbuffert, variabel hopphöjd, stora träffytor och "lugnt läge" som halverar skadan.

## Status och nästa steg

**Leverans 1:** hela loopen by → karta → krypta (4 rum, nycklar, låsta dörrar, ljusstakar som checkpoints, mörkt benhus) → Kyrkogrimmen (två faser) → ekan → tillbaka till Hulda. Dessutom sidouppgiften med katten Murre, mentorn som lär ut nedåtstöt, nivåmeny, alla sju läsningar i motorn (Läkning lärs ut i spelet), synliga möten, PWA och offline.

**Tempel 2 – Den gamla gruvan:** nås med ekan över sjön. Fyra rum: Gruvlaven (gruvvagn över en spikgrop), Hisschaktet (tre hissar i ett vertikalt schakt), Orten (mörk ort med gruvvagn och fladdermöss) och Bergsalen med Gruvrået. Hon tänds och släcks i mörkret, kastar sten och rusar längs golvet i fas två. Nyckelskatten Karbidlampan fördubblar Dagnys ljus i mörka rum. Gruvan har egen musik ("Gruvarbetarvisan").

Motorn har nu rörliga plattformar (`platforms` i områdesdata: hissar och gruvvagnar, `loop` eller `ride`).

**Gruvsamhället:** byn vid gruvan, med gula gruvarbetarlängor och lavtorn. Maj på pensionatet låter Dagny vila, och man vaknar här efter ett nederlag. Gamla Elin lär ut **Lyse**. Sidouppgift: Anders fickur ligger kvar i Orten. Byn har egen musik, "Lavtornsschottis". Sidouppgiftsföremål läggs nu ut med `q` och `questItem` i områdesdata.

**Tempel 3 – Kvarnen vid forsen:** i skogen öster om vägen, nås utan båt. Fyra rum i regn: Kvarnbäcken (flytande stockar och ett vattenhjul upp till nyckeln), Kvarnstugan (stort hjul över kvarnrännan och kvarnnissar som parerar), Forsen (vertikal klättring vid ett vattenfall med två hjul och en hiss) och Kvarndammen med Bäckahästen. Den hoppar upp på stranden och galopperar, och i fas två sprutar den vatten och skickar vågor längs marken (hoppa eller ducka bakom skölden). Nyckelskatten Gummistövlarna öppnar myren på kartan. Egen musik: "Forsens visa".

Motorn har nu vattenhjul, flytande stockar, regn och ett kvarninteriör-tema.

**Tempel 4 – Fyren i skären:** på ön mitt i sjön, nås med ekan. Storm och regn. Skäret (vindbyar som knuffar Dagny över havet, stolpar att hoppa på), Fyrtornet (vertikal klättring med vindbyar genom fönstren och en uppvind i trapphålet), Linsrummet (mörkt, med fyrlinser som ljuskällor och hål i golvet) och Fyrgalleriet med Havsfrun. Hon svävar över galleriet, sprutar havsvatten, kallar vindbyar mot kanten och dyker ner. I fas två slår blixtar ner där det först blinkar en varning. Nyckelskatten Ficklampan kastar en ljuskägla framför Dagny i mörker. Egen musik: "Fyrvaktarens vals".

Motorn har nu vindzoner (`wind` i områdesdata: sidvind, växlande byar och uppvind), fördröjda projektiler med varning och ett havsbakgrundstema.

**Tempel 5 – Folkparken om natten:** på ängarna öster om sjön, nås med ekan. Parkentrén (ljusslingor, en flock skuggvargar och ett biljettkiosktak med nyckeln), Karusellen (rida karusellhästar över en avgrund), Dansbanan (rutor som tänds och släcks i takt med musiken – stå på skarven mellan två rutor) och Scenen med Spelmannen. Han spelar på scenen och skickar noter längs golvet (ducka, hoppa eller blockera) och i bågar, och hoppar sedan ner och dansar över golvet. I fas två visar han sig vara Näcken. Nyckelskatten Transistorradion öppnar dolda gångar (`?` i kartdata) – en finns redan i Björkhagen. Egen musik: "Lördagsfoxen" och bossmusiken "Näckens polska".

Motorn har nu rytmrutor (`%`/`&` + `beat`), karuseller (elliptiska banor), dolda väggar och ljusslingor som ljuskällor. Mörka rum har en justerbar mörkergrad (`darkness`).

Nästa steg: tempel 6–7, sedan resten av byarna och polering.

Öppna frågor från specen, t.ex. den sista Väktarens öde och upplösningen på Trollberget, är medvetet obesvarade. Fynden i kryptan antyder bara.
