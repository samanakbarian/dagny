import type { SongDef } from '../engine/audio';

/**
 * All music is original and stored as notes. Lengths are in sixteenth notes
 * ("e5:4" = a quarter note E5). "r" is a rest; drums use k (kick), s (snare)
 * and h (hi-hat). Bars are separated by "|" for readability only.
 */
export const SONGS: Record<string, SongDef> = {
  /** "Ny dag" – a slow visa in A minor for the title screen. */
  titel: {
    bpm: 84,
    loop: true,
    tracks: [
      {
        inst: 'harp', vol: 0.9,
        notes: `a4:4 c5:4 e5:4 | d5:6 c5:2 b4:4 | a4:4 b4:4 c5:4 | e5:12 |
                f5:4 e5:4 d5:4 | c5:6 b4:2 a4:4 | g#4:4 a4:4 b4:4 | a4:12 |
                c5:4 e5:4 a5:4 | g5:6 f5:2 e5:4 | f5:4 e5:4 d5:4 | e5:12 |
                d5:4 c5:4 b4:4 | c5:6 b4:2 a4:4 | e4:4 g#4:4 b4:4 | a4:12`,
      },
      {
        inst: 'accordion', vol: 0.45,
        notes: `r:4 c4:4 e4:4 | r:4 b3:4 d4:4 | r:4 c4:4 e4:4 | r:4 g#3:4 b3:4 |
                r:4 a3:4 d4:4 | r:4 c4:4 e4:4 | r:4 g#3:4 d4:4 | r:4 c4:4 e4:4 |
                r:4 c4:4 e4:4 | r:4 c4:4 e4:4 | r:4 a3:4 d4:4 | r:4 g#3:4 b3:4 |
                r:4 b3:4 d4:4 | r:4 c4:4 e4:4 | r:4 g#3:4 b3:4 | r:4 c4:4 e4:4`,
      },
      {
        inst: 'bass', vol: 0.8,
        notes: `a2:12 | g2:12 | a2:12 | e2:12 | d2:12 | a2:12 | e2:12 | a2:12 |
                a2:12 | c3:12 | d3:12 | e2:12 | g2:12 | a2:12 | e2:12 | a2:12`,
      },
    ],
  },

  /** "Mormors polska" – D minor, for the village. */
  by: {
    bpm: 100,
    loop: true,
    tracks: [
      {
        inst: 'harp', vol: 0.85,
        notes: `d5:3 e5:1 f5:2 e5:2 d5:2 a4:2 | bb4:2 a4:2 g4:2 a4:2 bb4:2 c5:2 |
                d5:3 e5:1 f5:2 g5:2 a5:2 f5:2 | e5:4 c5:4 a4:4 |
                g5:3 f5:1 e5:2 f5:2 g5:2 e5:2 | f5:3 e5:1 d5:2 e5:2 f5:2 d5:2 |
                e5:2 c#5:2 a4:2 b4:2 c#5:2 e5:2 | d5:8 r:4 |
                f5:2 a5:2 c6:2 a5:2 f5:2 a5:2 | g5:3 a5:1 bb5:2 a5:2 g5:2 f5:2 |
                e5:2 g5:2 bb5:2 g5:2 e5:2 g5:2 | f5:4 c5:4 a4:4 |
                d5:2 f5:2 a5:2 f5:2 d5:2 f5:2 | e5:3 f5:1 g5:2 f5:2 e5:2 d5:2 |
                c#5:2 e5:2 a5:2 g5:2 e5:2 c#5:2 | d5:8 r:4`,
      },
      {
        inst: 'accordion', vol: 0.5,
        notes: `r:4 f4:4 a4:4 | r:4 g4:4 bb4:4 | r:4 f4:4 a4:4 | r:4 e4:4 a4:4 |
                r:4 e4:4 g4:4 | r:4 f4:4 a4:4 | r:4 e4:4 g4:4 | r:4 f4:4 a4:4 |
                r:4 a4:4 c5:4 | r:4 g4:4 bb4:4 | r:4 g4:4 bb4:4 | r:4 a4:4 c5:4 |
                r:4 f4:4 a4:4 | r:4 g4:4 bb4:4 | r:4 e4:4 g4:4 | r:4 f4:4 a4:4`,
      },
      {
        inst: 'bass', vol: 0.8,
        notes: `d3:4 a2:4 d3:4 | g2:4 d3:4 g2:4 | d3:4 a2:4 d3:4 | a2:4 e3:4 a2:4 |
                c3:4 g2:4 c3:4 | d3:4 a2:4 d3:4 | a2:4 e3:4 a2:4 | d3:4 a2:4 d3:4 |
                f2:4 c3:4 f2:4 | c3:4 g2:4 c3:4 | c3:4 g2:4 c3:4 | f2:4 c3:4 f2:4 |
                d3:4 a2:4 d3:4 | g2:4 d3:4 g2:4 | a2:4 e3:4 a2:4 | d3:4 a2:4 d3:4`,
      },
      { inst: 'drum', vol: 0.4, notes: 'k:4 h:4 h:4 '.repeat(16) },
    ],
  },

  /** "Vandringsvisa" – G major, for the overworld. */
  karta: {
    bpm: 116,
    loop: true,
    tracks: [
      {
        inst: 'flute', vol: 0.9,
        notes: `g4:4 b4:4 d5:4 b4:4 | c5:4 e5:4 d5:8 | b4:4 g4:4 a4:4 b4:4 | a4:12 r:4 |
                g4:4 b4:4 d5:4 g5:4 | f#5:4 e5:4 d5:8 | c5:4 a4:4 b4:4 a4:4 | g4:12 r:4 |
                e5:4 e5:4 d5:4 b4:4 | c5:4 c5:4 b4:8 | a4:4 b4:4 c5:4 d5:4 | e5:4 d5:4 b4:8 |
                g4:4 b4:4 d5:4 g5:4 | f#5:4 a5:4 g5:8 | d5:4 b4:4 a4:4 f#4:4 | g4:12 r:4`,
      },
      {
        inst: 'accordion', vol: 0.35,
        notes: `r:4 b3:4 r:4 b3:4 | r:4 c4:4 r:4 b3:4 | r:4 b3:4 r:4 b3:4 | r:4 a3:4 r:4 c4:4 |
                r:4 b3:4 r:4 b3:4 | r:4 a3:4 r:4 a3:4 | r:4 c4:4 r:4 c4:4 | r:4 b3:4 r:4 b3:4 |
                r:4 g3:4 r:4 g3:4 | r:4 e4:4 r:4 d4:4 | r:4 a3:4 r:4 a3:4 | r:4 g3:4 r:4 g3:4 |
                r:4 b3:4 r:4 b3:4 | r:4 a3:4 r:4 b3:4 | r:4 c4:4 r:4 c4:4 | r:4 b3:4 r:4 b3:4`,
      },
      {
        inst: 'bass', vol: 0.8,
        notes: `g2:8 d3:8 | c3:8 g2:8 | g2:8 d3:8 | d3:8 a2:8 | g2:8 d3:8 | d3:8 a2:8 | c3:8 d3:8 | g2:8 d2:8 |
                e2:8 b2:8 | c3:8 g2:8 | d3:8 a2:8 | e3:8 b2:8 | g2:8 d3:8 | d3:8 g2:8 | d3:8 d2:8 | g2:8 d3:8`,
      },
      { inst: 'drum', vol: 0.3, notes: 'k:4 h:4 s:4 h:4 '.repeat(16) },
    ],
  },

  /** "Skogsstigen" – E minor, short side-view paths and encounters. */
  stig: {
    bpm: 132,
    loop: true,
    tracks: [
      {
        inst: 'harp', vol: 0.8,
        notes: `e5:2 b4:2 g4:2 b4:2 e5:2 f#5:2 | g5:4 f#5:2 e5:4 b4:2 |
                d5:2 a4:2 f#4:2 a4:2 d5:2 e5:2 | f#5:4 e5:2 d5:4 r:2 |
                c5:2 e5:2 g5:2 e5:2 c5:2 e5:2 | b4:2 d5:2 g5:2 d5:2 b4:2 d5:2 |
                a4:2 c5:2 e5:2 d#5:2 f#5:2 a5:2 | g5:4 f#5:2 e5:6`,
      },
      {
        inst: 'bass', vol: 0.8,
        notes: 'e2:6 b2:6 | e2:6 b2:6 | d2:6 a2:6 | d2:6 a2:6 | c3:6 g2:6 | g2:6 d3:6 | a2:6 b2:6 | e2:12',
      },
      { inst: 'drum', vol: 0.35, notes: 'k:2 h:2 h:2 s:2 h:2 h:2 '.repeat(8) },
    ],
  },

  /** "Kryptan" – slow bells and organ drone in A minor. */
  krypta: {
    bpm: 70,
    loop: true,
    tracks: [
      { inst: 'bell', vol: 0.8, notes: 'a4:8 c5:8 | b4:8 e4:8 | f4:8 a4:8 | g#4:16 | a4:8 e5:8 | d5:8 c5:4 b4:4 | c5:8 a4:8 | e5:16' },
      { inst: 'organ', vol: 0.7, notes: 'a2:16 | e2:16 | f2:16 | e2:16 | a2:16 | g2:16 | f2:16 | e2:16' },
      {
        inst: 'harp', vol: 0.3,
        notes: `a3:2 e4:2 a4:2 c5:2 a4:2 e4:2 a3:2 e4:2 | g#3:2 e4:2 b4:2 e4:2 g#3:2 e4:2 b4:2 e4:2 |
                f3:2 c4:2 a4:2 c4:2 f3:2 c4:2 a4:2 c4:2 | e3:2 b3:2 g#4:2 b3:2 e3:2 b3:2 g#4:2 b3:2 |
                a3:2 e4:2 a4:2 c5:2 a4:2 e4:2 a3:2 e4:2 | g3:2 d4:2 b4:2 d4:2 g3:2 d4:2 b4:2 d4:2 |
                f3:2 c4:2 a4:2 c4:2 f3:2 c4:2 a4:2 c4:2 | e3:2 b3:2 g#4:2 b3:2 e3:2 b3:2 g#4:2 b3:2`,
      },
    ],
  },

  /** "Grimmens polska" – fast E minor boss polska. */
  boss: {
    bpm: 150,
    loop: true,
    tracks: [
      {
        inst: 'harp', vol: 0.9,
        notes: `e5:2 f#5:2 g5:2 f#5:2 e5:2 b4:2 | c5:2 b4:2 a4:2 b4:2 c5:2 d5:2 |
                e5:2 g5:2 b5:2 a5:2 g5:2 f#5:2 | g5:4 e5:4 b4:4 |
                a5:2 g5:2 f#5:2 g5:2 a5:2 f#5:2 | g5:2 f#5:2 e5:2 f#5:2 g5:2 e5:2 |
                f#5:2 d#5:2 b4:2 c#5:2 d#5:2 f#5:2 | e5:8 r:4`,
      },
      {
        inst: 'accordion', vol: 0.45,
        notes: `e4:4 g4:4 b4:4 | a4:4 c5:4 a4:4 | e4:4 g4:4 b4:4 | e4:4 g4:4 b4:4 |
                d4:4 f#4:4 a4:4 | e4:4 g4:4 b4:4 | d#4:4 f#4:4 b4:4 | e4:4 g4:4 b4:4`,
      },
      {
        inst: 'bass', vol: 0.9,
        notes: `e2:4 b2:4 e3:4 | a2:4 e3:4 a2:4 | e2:4 b2:4 e3:4 | e2:4 b2:4 e2:4 |
                d3:4 a2:4 d3:4 | e2:4 b2:4 e3:4 | b2:4 f#2:4 b2:4 | e2:4 b2:4 e2:4`,
      },
      { inst: 'drum', vol: 0.55, notes: 'k:4 h:2 h:2 s:4 '.repeat(8) },
    ],
  },

  /** Short fanfare when a temple is restored. */
  seger: {
    bpm: 120,
    loop: false,
    tracks: [
      { inst: 'harp', vol: 1, notes: 'c5:2 e5:2 g5:2 c6:6 r:2 a5:2 b5:2 c6:12' },
      { inst: 'accordion', vol: 0.5, notes: 'e4:2 g4:2 c5:2 e5:6 r:2 f5:2 g5:2 g5:12' },
      { inst: 'bass', vol: 0.8, notes: 'c3:6 g2:6 f2:4 g2:4 c3:12' },
    ],
  },

  /** Falling asleep. */
  somnar: {
    bpm: 72,
    loop: false,
    tracks: [
      { inst: 'harp', vol: 0.8, notes: 'a4:4 g4:4 e4:4 d4:4 c4:8 b3:4 a3:16' },
      { inst: 'bass', vol: 0.6, notes: 'a2:8 f2:8 e2:8 a2:16' },
    ],
  },

  /** Ending card – sunrise. */
  soluppgang: {
    bpm: 80,
    loop: true,
    tracks: [
      { inst: 'flute', vol: 0.8, notes: 'c5:4 e5:4 g5:4 | a5:8 g5:4 | f5:4 e5:4 d5:4 | e5:12 | c5:4 e5:4 g5:4 | c6:8 b5:4 | a5:4 g5:4 f5:4 | g5:12' },
      { inst: 'accordion', vol: 0.4, notes: 'r:4 e4:4 g4:4 | r:4 f4:4 a4:4 | r:4 f4:4 a4:4 | r:4 e4:4 g4:4 | r:4 e4:4 g4:4 | r:4 e4:4 a4:4 | r:4 f4:4 a4:4 | r:4 f4:4 b4:4' },
      { inst: 'bass', vol: 0.7, notes: 'c3:12 | f2:12 | d3:12 | c3:12 | c3:12 | a2:12 | f2:12 | g2:12' },
    ],
  },

  /** "Lavtornsschottis" – a G major schottis for Gruvsamhället. */
  gruvby: {
    bpm: 108,
    loop: true,
    tracks: [
      {
        inst: 'accordion', vol: 0.55,
        notes: `g4:3 b4:1 d5:4 b4:4 g4:4 | a4:3 c5:1 e5:4 c5:4 a4:4 | b4:3 d5:1 g5:4 f#5:4 e5:4 | d5:12 r:4 |
                e5:3 d5:1 c5:4 e5:4 c5:4 | d5:3 c5:1 b4:4 d5:4 b4:4 | c5:4 a4:4 f#4:4 a4:4 | g4:12 r:4`,
      },
      {
        inst: 'flute', vol: 0.4,
        notes: `r:16 | r:16 | r:8 d6:4 c6:4 | b5:8 a5:8 |
                g5:8 e5:8 | f#5:8 d5:8 | e5:4 d5:4 c5:4 a4:4 | b4:12 r:4`,
      },
      { inst: 'bass', vol: 0.8, notes: 'g2:8 d3:8 | a2:8 e3:8 | g2:8 b2:8 | d3:8 a2:8 | c3:8 g2:8 | g2:8 d3:8 | d3:8 d2:8 | g2:8 d3:8' },
      { inst: 'drum', vol: 0.35, notes: 'k:4 h:4 s:4 h:4 '.repeat(8) },
    ],
  },

  // Temples 2–7 have their own themes once built; until then they derive
  // variations of existing tunes so the data model is complete.
  /** "Gruvarbetarvisan" – D minor work song with pickaxe strokes, for the old mine. */
  gruvan: {
    bpm: 88,
    loop: true,
    tracks: [
      {
        inst: 'harp', vol: 0.75,
        notes: `d4:4 f4:2 a4:4 g4:2 | f4:4 e4:2 d4:6 | a4:4 c5:2 bb4:4 a4:2 | g4:12 |
                f4:4 g4:2 a4:4 bb4:2 | a4:4 g4:2 f4:6 | e4:4 f4:2 g4:4 e4:2 | d4:12`,
      },
      { inst: 'organ', vol: 0.5, notes: 'd3:24 c3:24 bb2:24 a2:24' },
      { inst: 'bass', vol: 0.8, notes: 'd2:6 a2:6 | d2:6 a2:6 | f2:6 c3:6 | g2:6 d3:6 | bb2:6 f2:6 | f2:6 c3:6 | a2:6 e2:6 | d2:12' },
      { inst: 'drum', vol: 0.35, notes: 'k:6 h:3 h:3 '.repeat(8) },
    ],
  },
  /** "Forsens visa" – rippling arpeggios in E minor for the mill by the rapids. */
  kvarnen: {
    bpm: 96,
    loop: true,
    tracks: [
      {
        inst: 'flute', vol: 0.8,
        notes: `e5:6 g5:2 f#5:4 | e5:4 b4:8 | c5:6 d5:2 e5:4 | d5:12 |
                g5:6 a5:2 g5:4 | f#5:4 d5:8 | e5:4 d5:4 b4:4 | e5:12`,
      },
      {
        inst: 'harp', vol: 0.4,
        notes: `e4:2 g4:2 b4:2 e5:2 b4:2 g4:2 | e4:2 g4:2 b4:2 e5:2 b4:2 g4:2 |
                c4:2 e4:2 g4:2 c5:2 g4:2 e4:2 | d4:2 f#4:2 a4:2 d5:2 a4:2 f#4:2 |
                g4:2 b4:2 d5:2 g5:2 d5:2 b4:2 | d4:2 f#4:2 a4:2 d5:2 a4:2 f#4:2 |
                c4:2 e4:2 g4:2 c5:2 b4:2 a4:2 | e4:2 g4:2 b4:2 e5:2 b4:2 g4:2`,
      },
      { inst: 'bass', vol: 0.75, notes: 'e2:12 | e2:12 | c3:12 | d3:12 | g2:12 | d3:12 | c3:6 b2:6 | e2:12' },
    ],
  },
  /** "Fyrvaktarens vals" – an A minor waltz for the lighthouse in the storm. */
  fyren: {
    bpm: 112,
    loop: true,
    tracks: [
      {
        inst: 'accordion', vol: 0.55,
        notes: `a4:8 c5:4 | e5:8 d5:4 | c5:4 b4:4 a4:4 | b4:12 |
                g4:8 b4:4 | d5:8 c5:4 | b4:4 a4:4 g#4:4 | a4:12 |
                c5:8 e5:4 | a5:8 g5:4 | f5:4 e5:4 d5:4 | e5:12 |
                f5:8 e5:4 | d5:8 c5:4 | b4:4 c5:4 b4:4 | a4:12`,
      },
      {
        inst: 'harp', vol: 0.35,
        notes: `r:4 c4:4 e4:4 | r:4 c4:4 e4:4 | r:4 c4:4 f4:4 | r:4 b3:4 e4:4 |
                r:4 b3:4 d4:4 | r:4 c4:4 e4:4 | r:4 d4:4 e4:4 | r:4 c4:4 e4:4 |
                r:4 e4:4 a4:4 | r:4 e4:4 a4:4 | r:4 d4:4 f4:4 | r:4 e4:4 g#4:4 |
                r:4 d4:4 f4:4 | r:4 e4:4 a4:4 | r:4 d4:4 g#4:4 | r:4 c4:4 e4:4`,
      },
      {
        inst: 'bass', vol: 0.8,
        notes: `a2:12 | a2:12 | f2:12 | e2:12 | g2:12 | a2:12 | e2:12 | a2:12 |
                a2:12 | c3:12 | d3:12 | e2:12 | d3:12 | a2:12 | e2:12 | a2:12`,
      },
    ],
  },
  /** "Lördagsfoxen" – a dance-band foxtrot in F for the folk park at night. */
  folkparken: {
    bpm: 126,
    loop: true,
    tracks: [
      {
        inst: 'accordion', vol: 0.55,
        notes: `c5:4 a4:2 c5:2 f5:4 e5:4 | d5:4 bb4:2 d5:2 g5:8 | e5:4 c5:2 e5:2 a5:4 g5:4 | f5:12 r:4 |
                a5:4 g5:2 f5:2 e5:4 d5:4 | g5:4 f5:2 e5:2 d5:4 c5:4 | bb4:4 a4:4 g4:4 e5:4 | f5:12 r:4`,
      },
      { inst: 'flute', vol: 0.35, notes: 'r:16 | r:8 d6:4 bb5:4 | r:16 | a5:4 c6:4 f6:8 | r:16 | r:8 bb5:4 g5:4 | r:16 | a5:16' },
      {
        inst: 'bass', vol: 0.8,
        notes: `f2:4 c3:4 f2:4 c3:4 | bb2:4 f2:4 bb2:4 f2:4 | c3:4 g2:4 c3:4 g2:4 | f2:4 c3:4 f2:4 c3:4 |
                d3:4 a2:4 d3:4 a2:4 | g2:4 d3:4 c3:4 g2:4 | c3:4 g2:4 c3:4 c2:4 | f2:4 c3:4 f2:8`,
      },
      { inst: 'drum', vol: 0.4, notes: 'k:4 h:2 h:2 s:4 h:2 h:2 '.repeat(8) },
    ],
  },
  /** "Näckens polska" – Spelmannen's fast D minor polska. */
  spelman: {
    bpm: 160,
    loop: true,
    tracks: [
      {
        inst: 'harp', vol: 0.95,
        notes: `d5:2 e5:1 f5:1 a5:2 f5:2 e5:2 d5:2 | c#5:2 d5:1 e5:1 g5:2 e5:2 c#5:2 a4:2 |
                d5:2 f5:2 a5:2 d6:2 c6:2 a5:2 | bb5:3 a5:1 g5:4 f5:4 |
                e5:2 g5:2 bb5:2 a5:2 g5:2 e5:2 | f5:2 a5:2 d6:2 c6:2 a5:2 f5:2 |
                e5:2 c#5:2 a4:2 b4:2 c#5:2 e5:2 | d5:8 r:4`,
      },
      { inst: 'accordion', vol: 0.45, notes: 'd4:4 f4:4 a4:4 | e4:4 g4:4 a4:4 | d4:4 f4:4 a4:4 | g4:4 bb4:4 d5:4 | e4:4 g4:4 bb4:4 | f4:4 a4:4 d5:4 | e4:4 g4:4 c#5:4 | d4:4 f4:4 a4:4' },
      { inst: 'bass', vol: 0.9, notes: 'd2:4 a2:4 d3:4 | a2:4 e3:4 a2:4 | d2:4 a2:4 d3:4 | g2:4 d3:4 g2:4 | c3:4 g2:4 c3:4 | d3:4 a2:4 d3:4 | a2:4 e3:4 a2:4 | d2:4 a2:4 d2:4' },
      { inst: 'drum', vol: 0.55, notes: 'k:4 h:2 h:2 s:4 '.repeat(8) },
    ],
  },
  /** "Vallåt" – a herding call over a drone, for Fäbodskogen. */
  fabodskogen: {
    bpm: 76,
    loop: true,
    tracks: [
      {
        inst: 'flute', vol: 0.85,
        notes: `a5:8 g5:2 e5:2 d5:4 | e5:12 r:4 | g5:6 a5:2 g5:4 e5:4 | d5:16 |
                c5:4 d5:4 e5:4 g5:4 | a5:12 g5:4 | e5:4 d5:2 c5:2 a4:8 | a4:16`,
      },
      { inst: 'organ', vol: 0.4, notes: 'a2:32 d3:32 c3:32 a2:32' },
      { inst: 'harp', vol: 0.25, notes: 'r:8 e4:4 a4:4 '.repeat(8) },
    ],
  },
  /** Skogsrået's dance – the boss polska, lower and darker. */
  skogsraboss: { base: 'boss', bpm: 140, loop: true, tracks: [], transpose: -3 },
  trollberget: { base: 'boss', bpm: 132, loop: true, tracks: [], transpose: -2 },
};
