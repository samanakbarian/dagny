import type { TempleDef, VillageDef } from './types';

/**
 * The seven holy places. The engine supports all of them; temples without an
 * `entryArea` are shown on the map as sleeping stone circles until built.
 */
export const TEMPLES: readonly TempleDef[] = [
  {
    id: 'krypta', number: 1, name: 'Stenkyrkans krypta',
    mechanic: 'Valv, ljusstakar, enkla dörrar och nycklar.',
    tone: 'krypta', music: 'krypta', bossMusic: 'boss',
    treasure: 'eka', boss: 'grim', entryArea: 'krypta_1',
    lore: 'I kryptan står ett namn inristat i stenen, nästan bortnött: "...da, Väktare 1921–1946".',
  },
  {
    id: 'gruvan', number: 2, name: 'Den gamla gruvan',
    mechanic: 'Gruvvagnar, hissar, mörker.',
    tone: 'gruva', music: 'gruvan', bossMusic: 'boss',
    treasure: 'karbidlampa', boss: 'gruvraet', entryArea: 'gruvan_1',
    lore: 'En lampa med initialerna H.D. hänger kvar på en spik.',
  },
  {
    id: 'kvarnen', number: 3, name: 'Kvarnen vid forsen',
    mechanic: 'Vattenhjul, rörliga plattformar.',
    tone: 'gra_augusti', music: 'kvarnen', bossMusic: 'boss',
    treasure: 'stovlar', boss: 'backahasten', entryArea: 'kvarnen_1',
    lore: 'Någon har ristat en sol i kvarnstenen.',
  },
  {
    id: 'fyren', number: 4, name: 'Fyren i skären',
    mechanic: 'Vind som knuffar, uppåt i torn.',
    tone: 'storm', music: 'fyren', bossMusic: 'boss',
    treasure: 'ficklampa', boss: 'havsfrun', entryArea: 'fyren_1',
    lore: 'Fyrvaktarens loggbok, midsommarnatten 1946: "Ett ljus gick ner över Kyrkbyn."',
  },
  {
    id: 'folkparken', number: 5, name: 'Folkparken om natten',
    mechanic: 'Karusell, dansbana, ljusslingor.',
    tone: 'folkpark', music: 'folkparken', bossMusic: 'spelman',
    treasure: 'radio', boss: 'spelmannen', entryArea: 'folkparken_1',
    lore: 'Ett gammalt fotografi: en kvinna med kopparfärgat hår dansar med ett irrbloss.',
  },
  {
    id: 'fabodskogen', number: 6, name: 'Fäbodskogen',
    mechanic: 'Täta träd, irrbloss, vilseledande stigar.',
    tone: 'skog', music: 'fabodskogen', bossMusic: 'skogsraboss',
    treasure: 'naverlur', boss: 'skogsraet', entryArea: 'fabod_1',
    lore: 'En vävd näverfilt, hälften färdig, ligger kvar i fäbodstugan.',
  },
  {
    id: 'trollberget', number: 7, name: 'Trollberget',
    mechanic: 'Allt kombinerat, högt och farligt.',
    tone: 'lyktsken', music: 'trollberget', bossMusic: 'boss',
    treasure: null, boss: 'bergakungen', entryArea: null,
    lore: 'Svaret väntar på toppen.',
  },
];

export function templeById(id: string): TempleDef | undefined {
  return TEMPLES.find((t) => t.id === id);
}

export const VILLAGES: readonly VillageDef[] = [
  { id: 'mormors_by', name: 'Mormors by', area: 'mormors_by', wakeEntry: 'H', teaches: 'lakning' },
  { id: 'bruksorten', name: 'Bruksorten', area: null, wakeEntry: 'H', teaches: 'skydd' },
  { id: 'fiskelaget', name: 'Fiskeläget', area: null, wakeEntry: 'H', teaches: 'hopp' },
  { id: 'gruvsamhallet', name: 'Gruvsamhället', area: 'gruvsamhallet', wakeEntry: 'H', teaches: 'lyse' },
  { id: 'kyrkbyn', name: 'Kyrkbyn', area: null, wakeEntry: 'H', teaches: 'eld' },
  { id: 'faboden', name: 'Fäboden', area: null, wakeEntry: 'H', teaches: 'hamn' },
  { id: 'stationssamhallet', name: 'Stationssamhället', area: null, wakeEntry: 'H', teaches: 'aska' },
];
