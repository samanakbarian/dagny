# Dagny på Google Play

Android-appen är en **Trusted Web Activity (TWA)**: ett litet skal som öppnar spelet från
`https://samanakbarian.github.io/dagny/` i helskärm. All spelkod finns i webbversionen, så en
uppdatering av `master` når appen direkt. Ny `.aab` behövs bara när själva skalet ändras
(namn, ikon, färger, version).

Projektet genererades med Bubblewrap (`twa-manifest.json`) och byggs av GitHub Actions
(`.github/workflows/android.yml`).

| | |
|---|---|
| Paketnamn | `io.github.samanakbarian.dagny` |
| Startadress | `https://samanakbarian.github.io/dagny/` |
| Orientering | liggande, helskärm |
| Min. Android | 7.0 (API 24), target API 36 |

## 1. Slå på GitHub Pages (en gång)

Repo → **Settings → Pages → Build and deployment → Source: GitHub Actions**.
Därefter publiceras spelet vid varje push till `master`
(`.github/workflows/pages.yml`). Kontrollera att
`https://samanakbarian.github.io/dagny/` fungerar innan du går vidare.

## 2. Skapa uppladdningsnyckeln (en gång, på din egen dator)

```bash
keytool -genkeypair -v -keystore upload-keystore.jks -alias upload \
  -keyalg RSA -keysize 2048 -validity 10000
```

Spara filen och lösenorden säkert, till exempel i en lösenordshanterare. Lägg dem **aldrig** i repot
(`.gitignore` stoppar `*.jks`). Med Play App Signing håller Google den riktiga
signeringsnyckeln. Tappar du uppladdningsnyckeln kan du be Google om en ny, men det tar tid.

## 3. Lägg in nyckeln som GitHub-secrets

Repo → **Settings → Secrets and variables → Actions → New repository secret**:

| Secret | Värde |
|---|---|
| `ANDROID_KEYSTORE_BASE64` | `base64 -w0 upload-keystore.jks` (macOS: `base64 -i upload-keystore.jks`) |
| `ANDROID_KEYSTORE_PASSWORD` | lösenordet för keystore-filen |
| `ANDROID_KEY_PASSWORD` | lösenordet för nyckeln (ofta samma) |
| `ANDROID_KEY_ALIAS` | `upload` |

## 4. Bygg appen

**Actions → Bygg Android-app → Run workflow.** När körningen är klar finns
`dagny-<nr>-aab` under *Artifacts*. Körningsnumret blir `versionCode`, så varje
bygge kan laddas upp. En tagg `v*` (t.ex. `v0.1.0`) bygger också automatiskt.

Lokalt (kräver JDK 17 och Android SDK):

```bash
cd android
DAGNY_KEYSTORE_PATH=../upload-keystore.jks DAGNY_KEYSTORE_PASSWORD=... DAGNY_KEY_PASSWORD=... \
  ./gradlew bundleRelease -PversionCode=1
```

## 5. Play Console

1. Skapa appen i [Play Console](https://play.google.com/console). Välj spel, gratis och svenska som standardspråk.
2. **Testa och släpp → Testning → Stängd testning:** skapa ett spår, ladda upp `.aab` och godkänn Play App Signing.
3. Fyll i **Appens innehåll**:
   - Integritetspolicy: `https://samanakbarian.github.io/dagny/integritet.html`
   - Datasäkerhet: inga uppgifter samlas in eller delas.
   - Annonser: nej.
   - Innehållsklassning: frågeformuläret. Spelet har tecknad fantasyvåld utan blod.
   - Målgrupp: välj åldrar. Väljer du under 13 gäller Familjeprogrammets regler.
4. Bjud in testare (e-postlista eller Google-grupp). Nya personliga konton måste köra ett
   stängt test med ett visst antal testare i ett visst antal dagar innan produktionsrelease.
   Kontrollera aktuella krav i Play Console.

## 6. Koppla appen till webbplatsen (Digital Asset Links)

Utan den här kopplingen visar Android en webbläsarlist med adressen överst i appen.

1. Play Console → **Testa och släpp → Appintegritet → App-signering**: kopiera
   SHA-256 för *App signing key certificate* (och gärna *Upload key certificate*).
2. Skapa filen:
   ```bash
   node scripts/assetlinks.mjs AA:BB:...  CC:DD:... > assetlinks.json
   ```
3. Filen måste ligga i **domänens rot**: `https://samanakbarian.github.io/.well-known/assetlinks.json`.
   Ett projekt-repo (`/dagny/`) kan inte lägga filer där, så det finns två vägar:
   - **Enklast:** skapa repot `samanakbarian/samanakbarian.github.io`, lägg filen i
     `.well-known/assetlinks.json`, lägg till en tom `.nojekyll` i roten och slå på Pages för det repot.
   - **Egen domän** (t.ex. `dagnysaventyr.se`): peka den mot Pages och lägg filen i
     `public/.well-known/` här. Då måste `host` i `twa-manifest.json` och `app/build.gradle` ändras.
4. Verifiera med [Statement List Tester](https://developers.google.com/digital-asset-links/tools/generator).

## Ändra appen senare

Uppdatera `twa-manifest.json` **och** motsvarande värden i `app/build.gradle` (namn,
färger, `versionName`). Ny ikon: byt bilderna i `app/src/main/res/mipmap-*` (genererade från
`public/icons/`). Alternativt kan du köra `npx @bubblewrap/cli update` här i mappen.
