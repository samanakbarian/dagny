import type { DialogDef } from '../types';

/** Bruksorten: the iron works, smeden Holm (Skydd, the sword), förman Karlsson (Uppåtstöt) and Rosa's locket. */
export const BRUKSORTEN: Record<string, DialogDef> = {
  rut_vila: {
    speaker: 'Rut på värdshuset',
    pages: ['Här frågar ingen varifrån man kommer. Vill du vila?'],
    choices: [
      { text: 'Vila på värdshuset', next: 'rut_vilat', actions: [{ type: 'rest' }] },
      { text: 'Inte nu', next: 'rut_hej' },
    ],
  },

  rut_vilat: {
    speaker: 'Rut på värdshuset',
    pages: ['Gröten står framme.'],
  },

  rut_hej: {
    speaker: 'Rut på värdshuset',
    pages: ['Snart är det skiftbyte. Då blir det trångt här inne.'],
  },

  holm_uppdrag: {
    speaker: 'Smeden Holm',
    pages: [
      'Upp på loftet, du? Här är det varmt. Ässjan står rakt under.',
      'Jag kan en läsning som skyddar. Men den ska sägas med rönn i handen.',
      'Kolarna vid torpet i söder har rönn vid milan. Bryt en kvist åt mig.',
    ],
    actions: [{ type: 'flag', flag: 'ronnkvist_uppdrag' }],
  },

  /** Asked for it, but Dagny has it already: straight on to the lesson. */
  holm_uppdrag_har: {
    speaker: 'Smeden Holm',
    pages: [
      'Upp på loftet, du? Här är det varmt. Ässjan står rakt under.',
      'Jag kan en läsning som skyddar. Men den ska sägas med rönn i handen.',
      'Vänta. Vad är det du har där?',
    ],
    actions: [{ type: 'flag', flag: 'ronnkvist_uppdrag' }],
    next: 'holm_lar',
  },

  holm_vantar: {
    speaker: 'Smeden Holm',
    pages: ['Rönnen växer vid kolartorpet i söder.'],
  },

  holm_lar: {
    speaker: 'Smeden Holm',
    pages: [
      'Rönn, med bären kvar. Bra.',
      'Klingan din är gott smide. Men en klockkläpp som fäste har jag aldrig sett.',
      '"Rönn för bröstet, järn för hand, inget ont går över min rand."',
    ],
    actions: [{ type: 'takeItem', item: 'ronnkvist' }, { type: 'flag', flag: 'ronnkvist_klar' }, { type: 'learnSpell', spell: 'skydd' }],
    next: 'lart_skydd',
  },

  lart_skydd: {
    pages: ['Dagny lärde sig läsningen SKYDD!\nHalverar skadan Dagny tar en stund.'],
  },

  holm_igen: {
    speaker: 'Smeden Holm',
    pages: ['Skyddet håller en stund. Skölden håller längre.'],
  },

  karlsson_uppdrag: {
    speaker: 'Förman Karlsson',
    pages: [
      'Kom du genom Gamla stollen? Då hade du tur. Jag var med när taket gick 1931.',
      'Min hacka blev kvar i sidoorten. Hämta den, så lär jag dig något.',
      'Den som har slagit upp så många luckor i taket som jag vet hur man hugger uppåt.',
    ],
    actions: [{ type: 'flag', flag: 'hacka_uppdrag' }],
  },

  karlsson_vantar: {
    speaker: 'Förman Karlsson',
    pages: ['Sidoorten går in från Rasgången, mitt i stollen. Hackan ligger högt upp.'],
  },

  karlsson_lar: {
    speaker: 'Förman Karlsson',
    pages: [
      'Min hacka! Där sitter mitt K. Trettiotre år i berget.',
      'Håll UPP och slå. Bra mot fladdermöss och sådant som hänger i taket.',
      'I kvarnen vid forsen sitter en lucka i taket. Slå upp den underifrån.',
    ],
    actions: [{ type: 'takeItem', item: 'hacka' }, { type: 'flag', flag: 'hacka_klar' }, { type: 'learnSkill', skill: 'uppatstot' }, { type: 'flag', flag: 'karlsson_lart' }],
    next: 'lart_uppatstot',
  },

  lart_uppatstot: {
    pages: ['Dagny lärde sig UPPÅTSTÖT!\nHåll UPP och slå för att stöta svärdet uppåt.'],
  },

  karlsson_igen: {
    speaker: 'Förman Karlsson',
    pages: ['Upp och ner. Som hissen i gruvan.'],
  },

  rosa_uppdrag: {
    speaker: 'Rosa',
    pages: [
      'Jag hade en medaljong med Gunnars kort i. Han var flottare. Forsen tog honom.',
      'Jag tappade den vid kvarnen när Bäckahästen skrämde mig.',
    ],
    actions: [{ type: 'flag', flag: 'medaljong_uppdrag' }],
  },

  rosa_vantar: {
    speaker: 'Rosa',
    pages: ['Medaljongen föll nog vid vattenfallet bakom kvarnen. Det är halt där.'],
  },

  rosa_tack: {
    speaker: 'Rosa',
    pages: [
      'Gunnar... Där är du.',
      'Ta det här. Han hade tyckt om dig.',
    ],
    actions: [{ type: 'takeItem', item: 'medaljong' }, { type: 'flag', flag: 'medaljong_klar' }, { type: 'xp', amount: 200 }, { type: 'heal' }],
    next: 'rosa_xp',
  },

  rosa_xp: {
    pages: ['Dagny fick 200 XP och känner sig utvilad.'],
  },

  rosa_glad: {
    speaker: 'Rosa',
    pages: ['Medaljongen sitter på en ny kedja nu. Jag tar aldrig av den.'],
  },

  hittade_medaljong: {
    pages: ['Dagny hittade en MEDALJONG. Inuti sitter ett fotografi av en ung man med keps.'],
  },

  sigge: {
    speaker: 'Sigge',
    pages: ['Pappa säger att hammaren i bruket stannade när kvarnen slutade mala.'],
  },

  sigge_efter: {
    speaker: 'Sigge',
    pages: [
      'Hammaren går igen! Dunk, dunk, dunk hela dagen.',
      'Ska du över myren? Pappa har en ramsa: "Till döda tallen, sen österut där stigen slingrar. Korset visar söderut, och pråmen visar havet."',
      'Och där det bubblar bär det inte. Gå aldrig efter irrbloss!',
    ],
  },
};
