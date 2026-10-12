import { Question } from '../types';

export const asteazkenaQuestions: Question[] = [
  {
    id: 'ast-41',
    day: 'asteazkena',
    order: 1,
    prompt: 'Zuek atzo mendian lore politak bildu .....',
    options: [
      'zenituzten',
      'zenituen',
      'zenuten',
      'dituzue'
    ],
    correctIndex: 0,
    category: 'Aditzak eta Moduak',
    level: 'B1',
    explanation: {
      rule: 'Iraganeko Nor-Nork adizkia: Nork = Zuek, Nor = Loreak (plurala) -> «zenituzten».',
      whyCorrect: '«Zenituzten» da forma egokia zuek subjektu pluralarekin eta iraganean.',
      whyWrongOptions: [
        { letter: 'B', reason: '«zenituen» ZUK subjektuari dagokio, ez ZUEKi.' },
        { letter: 'C', reason: '«zenuten» objektu singularrarekin erabiltzen da («lore bat bildu zenuten»).' },
        { letter: 'D', reason: '«dituzue» orainaldia da, eta esaldian «atzo» dago.' }
      ],
      tip: 'Iraganean: Zuk zenituen / Zuek zenituzten.'
    }
  },
  {
    id: 'ast-42',
    day: 'asteazkena',
    order: 2,
    prompt: 'Nik zuri egia esan ....., baina zuk ez didazu sinetsi.',
    options: [
      'dizut',
      'diot',
      'dizkidazu',
      'nizun'
    ],
    correctIndex: 0,
    category: 'Aditzak eta Moduak',
    level: 'B1',
    explanation: {
      rule: 'Nor-Nori-Nork orainaldian: Nik (nork: -t) + Zuri (nori: -zu-) + Hura (nor: d-) -> «dizut».',
      whyCorrect: '«Nik zuri egia esan dizut» da adizki zuzena orainaldian.',
      whyWrongOptions: [
        { letter: 'B', reason: '«diot» HARI da (nik hari esan diot).' },
        { letter: 'C', reason: '«dizkidazu» ZUK NIRI da (zuk niri esan dizkidazu).' },
        { letter: 'D', reason: '«nizun» iragana da, baina ondorengo aditzak orainaldia du («ez didazu sinetsi»).' }
      ],
      tip: 'Nik zuri -> dizut. Zuk niri -> didazu.'
    }
  },
  {
    id: 'ast-43',
    day: 'asteazkena',
    order: 3,
    prompt: 'Dirurik balu, auto berria erosiko .....',
    options: [
      'luke',
      'zukeen',
      'zuen',
      'du'
    ],
    correctIndex: 0,
    category: 'Aditzak eta Moduak',
    level: 'B2',
    explanation: {
      rule: 'Hipotesi errealean (orain-etorkizuneko baldintza): BALU (baldintza) -> LUKE (ondorioa).',
      whyCorrect: '«Balute... lukete / Balu... luke» da baldintza hipotetikoaren formula.',
      whyWrongOptions: [
        { letter: 'B', reason: '«zukeen» iraganeko baldintzan erabiltzen da (izan balu... erosiko zukeen).' },
        { letter: 'C', reason: '«zuen» adierazpenezko iragana da («erosi zuen»).' },
        { letter: 'D', reason: '«du» adierazpenezko orainaldia da, ez baldintzazkoa.' }
      ],
      tip: 'Balu -> luke. Bazaio -> zaio. Balu -> erosiko luke.'
    }
  },
  {
    id: 'ast-44',
    day: 'asteazkena',
    order: 4,
    prompt: 'Mesedez, atea itxi .....!',
    options: [
      'ezazu',
      'ezazu ba',
      'itxazu',
      'iezazue'
    ],
    correctIndex: 0,
    category: 'Aditzak eta Moduak',
    level: 'B1',
    explanation: {
      rule: 'Agintera Nor-Nork singularrean (zuk hura): «ezazu».',
      whyCorrect: '«Atea itxi ezazu» edo «itxi ezazu atea» da agintera zuzena.',
      whyWrongOptions: [
        { letter: 'B', reason: '«ba» partikula kolokiala da, ez arauzko adizki hutsa.' },
        { letter: 'C', reason: '«itxazu» pluraleko objektuekin da (ateak itxi itzazu).' },
        { letter: 'D', reason: '«iezazue» nor-nori-nork zuek da.' }
      ],
      tip: 'Objektu bakarra bada: ezazu! Objektu asko badira: itzazu!'
    }
  },
  {
    id: 'ast-45',
    day: 'asteazkena',
    order: 5,
    prompt: 'Gu garaiz iritsi ....., lasaiago ibiliko ginateke.',
    options: [
      'bagina',
      'bagara',
      'baginen',
      'ginateke'
    ],
    correctIndex: 0,
    category: 'Aditzak eta Moduak',
    level: 'B2',
    explanation: {
      rule: 'Ondorioan «ginateke» badago, baldintzan alegiazko «ba-» behar du: «bagina».',
      whyCorrect: '«Bagina... ginateke» bikote hipotetikoa da (Nor motakoa).',
      whyWrongOptions: [
        { letter: 'B', reason: '«bagara» erreala da («bagara... gara/gatzaizkio»).' },
        { letter: 'C', reason: '«baginen» iraganeko baieztatua da («joan baginen bezala»).' },
        { letter: 'D', reason: '«ginateke» ondorioan bakarrik doa, ez baldintzazko aurreko perpausean.' }
      ],
      tip: 'Bainaiz -> naiz. Banintz -> nintzateke. Bagina -> ginateke.'
    }
  },
  {
    id: 'ast-46',
    day: 'asteazkena',
    order: 6,
    prompt: 'Nahi baduzu, guk lagundu ..... zuri etxeko lanetan.',
    options: [
      'diezazukegu',
      'dezakegu',
      'zaitzakegu',
      'genezake'
    ],
    correctIndex: 0,
    category: 'Aditzak eta Moduak',
    level: 'B2',
    explanation: {
      rule: 'Ahalera Nor-Nori-Nork orainaldian: Guk (nork: -gu) + Zuri (nori: -zu-) + Hura (nor) -> «diezazukegu».',
      whyCorrect: '«Lagundu diezazukegu» (podemos ayudarte a ti con eso).',
      whyWrongOptions: [
        { letter: 'B', reason: '«dezakegu» Nor-Nork da («lagun dezakegu», baina hemen «zuri» datiboa dago!).' },
        { letter: 'C', reason: '«zaitzakegu» Nor-Nork da (zu gu: «eraman zaitzakegu»).' },
        { letter: 'D', reason: '«genezake» alegiazkoa da (lagun genezake = podríamos).' }
      ],
      tip: 'Lagundu aditzak NORI eskatzen duenean: diezaioket, diezazuket, diezazukegu.'
    }
  },
  {
    id: 'ast-47',
    day: 'asteazkena',
    order: 7,
    prompt: 'Irakasleak ikasleei ariketak berregiteko agindu .....',
    options: [
      'die',
      'ditu',
      'zaie',
      'diete'
    ],
    correctIndex: 0,
    category: 'Aditzak eta Moduak',
    level: 'B1',
    explanation: {
      rule: 'Agindu aditzak Nor-Nori-Nork eskatzen du: Irakasleak (hark) + ikasleei (haiei) + agindua (hura) -> «die».',
      whyCorrect: '«Hark haiei agindu die» da adizki zuzena.',
      whyWrongOptions: [
        { letter: 'B', reason: '«ditu» Nor-Nork da, datiborik gabe.' },
        { letter: 'C', reason: '«zaie» Nor-Nori da (ez du nork-ik).' },
        { letter: 'D', reason: '«diete» pluraleko nork denean litzateke (haiek haiei).' }
      ],
      tip: 'Hark haiei: die. Haiek haiei: diete.'
    }
  },
  {
    id: 'ast-48',
    day: 'asteazkena',
    order: 8,
    prompt: 'Medikuak lasai egoteko esan ..... niri.',
    options: [
      'dit',
      'ditut',
      'zait',
      'dizkit'
    ],
    correctIndex: 0,
    category: 'Aditzak eta Moduak',
    level: 'B1',
    explanation: {
      rule: 'Hark (medikuak) + niri + hura -> «dit».',
      whyCorrect: '«Medikuak esan dit» (el médico me ha dicho).',
      whyWrongOptions: [
        { letter: 'B', reason: '«ditut» Nik haiek da (nik liburuak erosi ditut).' },
        { letter: 'C', reason: '«zait» Nor-Nori da («etorri zait»).' },
        { letter: 'D', reason: '«dizkit» objektu pluralarekin litzateke (hark niri gauzak eman dizkit).' }
      ],
      tip: 'Hark niri: dit (objektu singularra) / dizkit (objektu pluralak).'
    }
  },
  {
    id: 'ast-49',
    day: 'asteazkena',
    order: 9,
    prompt: 'Autoa matxuratu ..... eta ezin izan gara etorri.',
    options: [
      'zaigu',
      'digu',
      'zaigu guri',
      'gaitu'
    ],
    correctIndex: 0,
    category: 'Aditzak eta Moduak',
    level: 'B1',
    explanation: {
      rule: '«Matxuratu» bezalako kalte-aditzek Nor-Nori hartzen dute normalean: autoa guri matxuratu zaigu.',
      whyCorrect: '«Autoa matxuratu zaigu» (se nos ha averiado el coche).',
      whyWrongOptions: [
        { letter: 'B', reason: '«digu» Nor-Nori-Nork da, baina matxuratu hemen ez da iragankorra.' },
        { letter: 'C', reason: '«zaigu guri» erredundantea da forma arruntean.' },
        { letter: 'D', reason: '«gaitu» Nor-Nork da («hark gu harrapatu gaitu»).' }
      ],
      tip: 'Nor-Nori: gertatu zait, apurtu zait, hondatu zaigu.'
    }
  },
  {
    id: 'ast-50',
    day: 'asteazkena',
    order: 10,
    prompt: 'Lehen guk sarri ..... mendira igandeetan.',
    options: [
      'jotzen genuen',
      'joaten ginen',
      'joan ginen',
      'joango ginen'
    ],
    correctIndex: 1,
    category: 'Aditzak eta Moduak',
    level: 'B1',
    explanation: {
      rule: 'Iraganeko ohitura adierazteko EZ-BURUTUA erabiltzen da: «joaten ginen».',
      whyCorrect: '«Lehen sarri joaten ginen» da ohitura adierazten duen adizki zuzena.',
      whyWrongOptions: [
        { letter: 'A', reason: '«jotzen genuen» instrumentua jotzea litzateke (tocar).' },
        { letter: 'C', reason: '«joan ginen» ekintza puntual burutua da (fuimos), ez ohitura.' },
        { letter: 'D', reason: '«joango ginen» etorkizuna edo ondorioa litzateke.' }
      ],
      tip: 'Ohitura iraganean: ibiltzen nintzen, egiten genuen, joaten ziren.'
    }
  },
  {
    id: 'ast-51',
    day: 'asteazkena',
    order: 11,
    prompt: 'Zer gertatuko litzateke orain argia itzaliko .....?',
    options: [
      'balitz',
      'bada',
      'zen',
      'litzateke'
    ],
    correctIndex: 0,
    category: 'Aditzak eta Moduak',
    level: 'B2',
    explanation: {
      rule: 'Ondorioan «litzateke» dagoenean, baldintzan alegiazkoa («balitz») behar du.',
      whyCorrect: '«Itzaliko balitz... zer gertatuko litzateke?» galdera hipotetiko klasikoa da.',
      whyWrongOptions: [
        { letter: 'B', reason: '«bada» baldintza erreala da («itzaltzen bada, zer gertatuko da?»).' },
        { letter: 'C', reason: '«zen» iragana da.' },
        { letter: 'D', reason: '«litzateke» ezin da baldintzaren barruan erabili.' }
      ],
      tip: 'Balitz... litzateke. Balu... luke.'
    }
  },
  {
    id: 'ast-52',
    day: 'asteazkena',
    order: 12,
    prompt: 'Ikasleek irakasleari zalantza guztiak galdetu .....',
    options: [
      'dizkiote',
      'diote',
      'dituzte',
      'zaizkio'
    ],
    correctIndex: 0,
    category: 'Aditzak eta Moduak',
    level: 'B2',
    explanation: {
      rule: 'Ikasleek (haiek -te) + irakasleari (hari -o-) + zalantzak (plurala: dizki-) -> «dizkiote».',
      whyCorrect: '«Dizkiote» da forma egokia haiek hari gauza asko galdetzean.',
      whyWrongOptions: [
        { letter: 'B', reason: '«diote» objektu singularrarekin litzateke (zalantza bat galdetu diote).' },
        { letter: 'C', reason: '«dituzte» datiborik gabeko Nor-Nork da.' },
        { letter: 'D', reason: '«zaizkio» Nor-Nori da (nork gabe).' }
      ],
      tip: 'Hark hari: dio (1) / dizkio (askotan). Haiek hari: diote (1) / dizkiote (askotan).'
    }
  },
  {
    id: 'ast-53',
    day: 'asteazkena',
    order: 13,
    prompt: 'Guk zuei egia osoa kontatu .....',
    options: [
      'dizuegu',
      'dizuegu guk',
      'diezuegu',
      'dizue'
    ],
    correctIndex: 0,
    category: 'Aditzak eta Moduak',
    level: 'B1',
    explanation: {
      rule: 'Guk (nork: -gu) + zuei (nori: -zue-) + hura (egia: d-) -> «dizuegu».',
      whyCorrect: '«Guk zuei egia osoa kontatu dizuegu».',
      whyWrongOptions: [
        { letter: 'B', reason: 'Pertsona izenordainaren errepikapena desegokia da aditzaren atzean.' },
        { letter: 'C', reason: '«diezuegu» ez da existitzen.' },
        { letter: 'D', reason: '«dizue» hark zuei da (hark zuei kontatu dizue).' }
      ],
      tip: 'Guk zuei: dizuegu. Zuek guri: diguzue.'
    }
  },
  {
    id: 'ast-54',
    day: 'asteazkena',
    order: 14,
    prompt: 'Mesedez, umeak, geldirik .....!',
    options: [
      'egon zaitezte',
      'egon zaitez',
      'zaudete',
      'egon zaie'
    ],
    correctIndex: 0,
    category: 'Aditzak eta Moduak',
    level: 'B1',
    explanation: {
      rule: 'Agintera Nor plurala (zuek): «zaitezte».',
      whyCorrect: '«Geldirik egon zaitezte» zuek pertsonari zuzendutako agindua da.',
      whyWrongOptions: [
        { letter: 'B', reason: '«zaitez» singularra da (zu: egon zaitez!).' },
        { letter: 'C', reason: '«zaudete» adierazpen orainaldia da, ez agintera.' },
        { letter: 'D', reason: '«zaie» ez da aginterako adizkia.' }
      ],
      tip: 'Zu: zaitez! Zuek: zaitezte!'
    }
  },
  {
    id: 'ast-55',
    day: 'asteazkena',
    order: 15,
    prompt: 'Ni zuekin pozik ..... oporretara.',
    options: [
      'joango nintzateke',
      'joango nintzen',
      'joan naiz',
      'joango nintzake'
    ],
    correctIndex: 0,
    category: 'Aditzak eta Moduak',
    level: 'B2',
    explanation: {
      rule: 'Alegiazko ondorioa NOR kasuan lehen pertsonan: «nintzateke» (yo iría).',
      whyCorrect: '«Pozik joango nintzateke» (me iría encantado/a).',
      whyWrongOptions: [
        { letter: 'B', reason: '«nintzen» iragan ziurra da (iba / fui).' },
        { letter: 'C', reason: '«joan naiz» burutua da (he ido).' },
        { letter: 'D', reason: '«nintzake» ahalera hipotetikoa litzateke («joan ahal izango nintzateke»).' }
      ],
      tip: 'Alegiazkoa: Ni nintzateke, Gu ginateke, Zu zinateke.'
    }
  },
  {
    id: 'ast-56',
    day: 'asteazkena',
    order: 16,
    prompt: 'Lagunek ez ..... ezer ekarri afalordurako.',
    options: [
      'dute',
      'dira',
      'zuten',
      'ziren'
    ],
    correctIndex: 0,
    category: 'Aditzak eta Moduak',
    level: 'B1',
    explanation: {
      rule: 'Lagunek (ergatibo plurala: nork) + ekarri (nor-nork) orainaldian -> «dute».',
      whyCorrect: '«Lagunek ez dute ezer ekarri» (los amigos no han traído nada).',
      whyWrongOptions: [
        { letter: 'B', reason: '«dira» nor da (ezin du nork-ik hartu).' },
        { letter: 'C', reason: '«zuten» iragana da, baina afalordurako oraindik ez bada iritsi orainaldia da naturalena hemen.' },
        { letter: 'D', reason: '«ziren» iraganeko intransitiboa da.' }
      ],
      tip: 'Nor-Nork orainaldian: Hark du / Haiek dute.'
    }
  },
  {
    id: 'ast-57',
    day: 'asteazkena',
    order: 17,
    prompt: 'Hori egia balitz, gu guztiz harrituta geratuko .....',
    options: [
      'ginateke',
      'ginen',
      'gara',
      'gintuzten'
    ],
    correctIndex: 0,
    category: 'Aditzak eta Moduak',
    level: 'B2',
    explanation: {
      rule: 'Balitz (alegiazko baldintza) -> ginateke (gu nor alegiazko ondorioa).',
      whyCorrect: '«Balitz... geratuko ginateke» bikote hipotetiko perfektua da.',
      whyWrongOptions: [
        { letter: 'B', reason: '«ginen» iragan erreala da.' },
        { letter: 'C', reason: '«gara» orainaldi erreala da.' },
        { letter: 'D', reason: '«gintuzten» nor-nork da (haiek gu).' }
      ],
      tip: 'Gu geratuko ginateke / Haiek geratuko lirateke.'
    }
  },
  {
    id: 'ast-58',
    day: 'asteazkena',
    order: 18,
    prompt: 'Atzo zuek niri gezur biribila esan .....',
    options: [
      'zenidaten',
      'zenidatenak',
      'zenidan',
      'zeniguten'
    ],
    correctIndex: 0,
    category: 'Aditzak eta Moduak',
    level: 'B2',
    explanation: {
      rule: 'Iraganeko Nor-Nori-Nork: Zuek (zen- -ten) + Niri (-da-) + Hura -> «zenidaten».',
      whyCorrect: '«Atzo zuek niri gezurra esan zenidaten».',
      whyWrongOptions: [
        { letter: 'B', reason: '«zenidatenak» izen erlatiboa da, ez perpauseko aditz nagusia.' },
        { letter: 'C', reason: '«zenidan» ZUK NIRI da (zuk niri esan zenidan).' },
        { letter: 'D', reason: '«zeniguten» ZUEK GURI da (nos dijisteis).' }
      ],
      tip: 'Zuk niri: zenidan. Zuek niri: zenidaten.'
    }
  },
  {
    id: 'ast-59',
    day: 'asteazkena',
    order: 19,
    prompt: 'Nahi baduzue, denok elkarrekin afal ..... gaur gauean.',
    options: [
      'dezakegu',
      'genezake',
      'ditzakegu',
      'dezakezue'
    ],
    correctIndex: 0,
    category: 'Aditzak eta Moduak',
    level: 'B1',
    explanation: {
      rule: 'Guk (ahalera orainaldia): afal dezakegu (podemos cenar).',
      whyCorrect: '«Denok elkarrekin afal dezakegu».',
      whyWrongOptions: [
        { letter: 'B', reason: '«genezake» hipotetikoa da (podríamos), baina aurrean «nahi baduzue» baldintza erreala dago.' },
        { letter: 'C', reason: '«ditzakegu» objektu pluralarekin da (gauza asko).' },
        { letter: 'D', reason: '«dezakezue» ZUEK ahalera da.' }
      ],
      tip: 'Nahi baduzue... dezakegu!'
    }
  },
  {
    id: 'ast-60',
    day: 'asteazkena',
    order: 20,
    prompt: 'Aitak semeari giltzak poltsikoan gordetzeko .....',
    options: [
      'agindu zion',
      'agindu zitzaion',
      'agindu zioten',
      'agindu zuen'
    ],
    correctIndex: 0,
    category: 'Aditzak eta Moduak',
    level: 'B1',
    explanation: {
      rule: 'Iragana: Aitak (hark) + semeari (hari) + agindua (hura) -> «agindu zion».',
      whyCorrect: '«Aitak semeari giltzak gordetzeko agindu zion».',
      whyWrongOptions: [
        { letter: 'B', reason: '«zitzaion» intransitiboa da (nor-nori).' },
        { letter: 'C', reason: '«zioten» haiek hari litzateke.' },
        { letter: 'D', reason: '«zuen» nor-nork da, semeari datiboa baztertuta.' }
      ],
      tip: 'Hark hari: dio (oraina) / zion (iragana).'
    }
  }
];
