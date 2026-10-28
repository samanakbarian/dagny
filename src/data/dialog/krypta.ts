import type { DialogDef } from '../types';

/** Temple 1: Stenkyrkans krypta and Kyrkogrimmen. */
export const KRYPTA: Record<string, DialogDef> = {
  krypta_skylt1: {
    pages: ['Inhugget i stenen:\n"HÄR VILAR GRIMMEN SOM VAKTAR KYRKAN. VÄCK HONOM EJ MED VREDE."'],
  },

  krypta_skylt2: {
    pages: ['En nästan bortnött rad:\n"...da, Väktare. Hon tände ljusen här varje midsommar."'],
  },

  krypta_skylt3: {
    pages: ['En liten sol är ristad i väggen. Under den, med barnhandstil: "ny dag".'],
  },

  grim_vaknar: {
    speaker: 'Kyrkogrimmen',
    pages: ['VEM STÖR... KYRKANS VILA... ALLA HAR GLÖMT OSS...'],
  },

  grim_forlikad: {
    speaker: 'Kyrkogrimmen',
    pages: [
      '...Klockans kläpp. Den klangen känner jag. Du bär den förra Väktarens klinga.',
      'Jag har vaktat så länge i mörkret att jag glömde varför.',
      'Ta ekan vid altaret. Den bar henne över sjön en gång.',
    ],
  },

  fick_eka: {
    pages: [
      'Dagny fick EKAN!\nNu kan hon ro över vatten på kartan.',
      'Ett varmt ljus fyller kryptan.',
      'Över sjön öster om byn, på norra stranden, ligger gruvsamhället. Bortom det den gamla gruvan.',
    ],
    actions: [{ type: 'flag', flag: 'krypta_klar' }],
  },
};
