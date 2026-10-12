/** All user-interface text, kept in data so the game can be translated later. */
export const STR = {
  title: 'Dagnys äventyr',
  subtitle: 'Sommaren 1964',
  newGame: 'Nytt spel',
  continue: 'Fortsätt',
  settings: 'Inställningar',
  tapToStart: 'Tryck för att börja',
  pressToStart: 'Tryck på valfri knapp',
  confirmNew: 'Börja om? Ditt sparade spel skrivs över.',
  yes: 'Ja',
  no: 'Nej',
  version: 'Leverans 1',

  // Pause menu
  paused: 'Paus',
  resume: 'Fortsätt',
  spells: 'Läsningar',
  items: 'Föremål',
  map: 'Karta',
  saveQuit: 'Spara och avsluta',
  back: 'Tillbaka',
  noSpells: 'Du kan inga läsningar ännu. Byarnas äldre lär ut dem.',
  noItems: 'Inga föremål ännu.',
  selected: 'Vald',
  costMp: 'Kostar',
  skillsHeading: 'Tekniker',
  keysHeading: 'Nycklar',
  templesHeading: 'Platser',
  youAreHere: 'Du är här',
  restored: 'återställd',

  // Settings
  music: 'Musik',
  sfx: 'Ljudeffekter',
  calmMode: 'Lugnt läge',
  calmHelp: 'Halverar skadan Dagny tar',
  stickMode: 'Styrning',
  stick: 'Styrspak',
  dpad: 'Styrkors',
  controlSize: 'Knappstorlek',
  controlOpacity: 'Genomskinlighet',
  controlPlacement: 'Placering',
  placementNames: ['Nära kanten', 'Mitten', 'Längre in'],
  vibration: 'Vibration',
  showFps: 'Visa FPS',
  on: 'På',
  off: 'Av',

  // HUD & gameplay
  levelShort: { styrka: 'S', magi: 'M', liv: 'L' },
  xp: 'XP',
  key: 'Nyckel',
  levelUpTitle: 'Nivå upp!',
  levelUpHelp: 'Välj vad Dagny ska bli bättre på:',
  levelUpLater: 'Spara till senare',
  levelMax: 'MAX',
  needXp: 'XP',
  notEnoughMp: 'Inte nog med magi',
  checkpoint: 'Ljusstaken brinner',
  saved: 'Sparat',
  autosaved: 'Sparat',
  gotKey: 'En nyckel!',
  bossDefeated: 'Förlikad',

  // Game over
  gameOverTitle: 'Dagny somnar...',
  gameOverText: 'Men XP och minnen finns kvar.',
  retryCheckpoint: 'Försök igen vid ljusstaken',
  wakeHome: 'Vakna hos mormor',

  // Rotate screen
  rotate: 'Vänd telefonen',
  rotateSub: 'Dagny spelar bäst på bredden',

  // Storage
  noStorage: 'Obs: sparning fungerar inte i den här webbläsaren.',

  // Intro cards (new game)
  intro: [
    'Midsommarnatten 1946 började klockan i Kyrkbyns klockstapel ringa av sig själv.',
    'Hulda, byns barnmorska, gick dit med sin fotogenlykta. Under klockstapeln låg ett spädbarn i en vävd näverfilt.',
    'Bredvid barnet låg en sliten svärdsklinga utan fäste. Solen gick upp när Hulda bar hem henne. Hon kallades Dagny – "ny dag".',
    'Nu är det sommaren 1964, och sommaren är ovanligt mörk.',
  ],
  // Shown after the first temple – end of the vertical slice.
  sliceEnd: [
    'Ljuset kommer tillbaka.',
    'En av sju platser är förlikad. Sex sover ännu.',
    'Tack för att du spelade första delen av Dagnys äventyr!',
  ],
};

export type Strings = typeof STR;
