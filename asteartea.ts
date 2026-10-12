import { Question } from '../types';

export const astearteaQuestions: Question[] = [
  {
    id: 'ast-21',
    day: 'asteartea',
    order: 1,
    prompt: 'Mendira joan diren ..... hotz handia pasatu dute.',
    options: [
      'lagunek',
      'lagunak',
      'lagunei',
      'lagunentzako'
    ],
    correctIndex: 0,
    category: 'Deklinabidea eta Kasuak',
    level: 'B1',
    explanation: {
      rule: 'Aditz iragankorrek («pasatu dute») NORK kasua eskatzen dute subjektuan.',
      whyCorrect: '«Lagunek» da ergatibo plurala (NORK), ekintza burutu dutenak haiek baitira.',
      whyWrongOptions: [
        { letter: 'B', reason: '«lagunak» absolutiboa da (NOR), ez ergatiboa.' },
        { letter: 'C', reason: '«lagunei» datiboa da (NORI).' },
        { letter: 'D', reason: '«lagunentzako» helburuzkoa da (destinatario).' }
      ],
      tip: 'Galde iezaiozu aditzari: Nork pasatu du hotza? -> Lagunek!'
    }
  },
  {
    id: 'ast-22',
    day: 'asteartea',
    order: 2,
    prompt: 'Ez dut inolako ..... entzun gaur goizean.',
    options: [
      'zaratarik',
      'zaratari',
      'zaratak',
      'zarata'
    ],
    correctIndex: 0,
    category: 'Deklinabidea eta Kasuak',
    level: 'B1',
    explanation: {
      rule: 'Ezezko esaldietan eta «inolako», «ezer», «inon» bezalako hitzekin partitiboa («-(r)ik») erabiltzen da.',
      whyCorrect: '«Inolako zaratarik» ezezko sintagma partitibo perfektua da.',
      whyWrongOptions: [
        { letter: 'B', reason: '«zaratari» datiboa da.' },
        { letter: 'C', reason: '«zaratak» ergatibo edo plural absolutiboa da.' },
        { letter: 'D', reason: '«zarata» mugagabea edo singularra da, baina «inolako»-k partitiboa eskatzen du ezezkoan.' }
      ],
      tip: 'Ez dut ... -(r)ik (partitiboa ezezkoetan eta galderetan).'
    }
  },
  {
    id: 'ast-23',
    day: 'asteartea',
    order: 3,
    prompt: 'Giltzak ..... utzi ditut despiste baten ondorioz.',
    options: [
      'mahaian gainean',
      'mahaiaren gainean',
      'mahai gainean',
      'mahaiean'
    ],
    correctIndex: 2,
    category: 'Deklinabidea eta Kasuak',
    level: 'B2',
    explanation: {
      rule: 'Leku-posizio postposizioetan (gainean, azpian, ondoan...), izenak forma hutsa (mugagabea) hartu ohi du hitz-elkarketan: «mahai gainean».',
      whyCorrect: '«Mahai gainean» da forma natural eta jatorrena.',
      whyWrongOptions: [
        { letter: 'A', reason: '«mahaian gainean» pleonasmo/oker deklinatua da (bi kasu-marka kateatuta).' },
        { letter: 'B', reason: '«mahaiaren gainean» gramatikala bada ere, tradizioan forma elkartua («mahai gainean») lehenesten da.' },
        { letter: 'D', reason: '«mahaiean» akats ortografikoa da, «mahaian» litzateke.' }
      ],
      tip: 'Mahai gainean, etxe azpian, ate ondoan.'
    }
  },
  {
    id: 'ast-24',
    day: 'asteartea',
    order: 4,
    prompt: 'Guraso..... gutun luze bat bidali diegu.',
    options: [
      'ei',
      'ari',
      'ekin',
      'entzat'
    ],
    correctIndex: 0,
    category: 'Deklinabidea eta Kasuak',
    level: 'B1',
    explanation: {
      rule: 'Datibo plurala «-ei» da («diegu» adizkian ageri denez, haiei).',
      whyCorrect: '«Gurasoei» da datibo plural zuzena.',
      whyWrongOptions: [
        { letter: 'B', reason: '«gurasoari» singularra da, baina aditzak «diegu» dio (pluralean).' },
        { letter: 'C', reason: '«gurasoekin» komitatiboa da (norekin).' },
        { letter: 'D', reason: '«gurasoentzat» helburuzkoa da (norentzat), baina bidali aditzak datiboa eskatzen du («diegu»).' }
      ],
      tip: 'Nori? Singularrean: -ari. Pluralean: -ei. Mugagabean: -i.'
    }
  },
  {
    id: 'ast-25',
    day: 'asteartea',
    order: 5,
    prompt: 'Mediku..... joan behar dut eztarriko minagatik.',
    options: [
      'rengana',
      'ra',
      'rantz',
      'gatik'
    ],
    correctIndex: 0,
    category: 'Deklinabidea eta Kasuak',
    level: 'B2',
    explanation: {
      rule: 'Pertsona izenekin edo izen bizidunekin lekuzko kasuak «-ren-» artizkiarekin egiten dira: «-rengana», «-rengandik», «-rengan».',
      whyCorrect: '«Medikuarengana» da pertsona baten lekura joateko adlatibo zuzena.',
      whyWrongOptions: [
        { letter: 'B', reason: '«medikura» gauza ez-bizidunekin erabiltzen da (anbulatoriora bai, baina medikuarengana).' },
        { letter: 'C', reason: '«medikurantz» ez-bizidunena da.' },
        { letter: 'D', reason: '«medikuagatik» kausazkoa da.' }
      ],
      tip: 'Bizidunek «-ga-» edo «-ren-» hartzen dute: «lagunarengana», «amak/amarengandik».'
    }
  },
  {
    id: 'ast-26',
    day: 'asteartea',
    order: 6,
    prompt: 'Kafesnea ..... nahiago duzu?',
    options: [
      'azukrearekin ala gabe',
      'azukrearekin ala sakarinarekin',
      'azukrez ala gabe',
      'azukrerekin ala ez'
    ],
    correctIndex: 1,
    category: 'Deklinabidea eta Kasuak',
    level: 'B1',
    explanation: {
      rule: 'Soziatiboa «-arekin» da mugatu singularrean: «azukrearekin».',
      whyCorrect: '«Azukrearekin ala sakarinarekin» bi ataletan modu paralelo eta zuzenean deklinatuta dago.',
      whyWrongOptions: [
        { letter: 'A', reason: '«gabe» hitzak partitiboa edo forma hutsa eskatzen du («azukrerik gabe»).' },
        { letter: 'C', reason: '«azukrez» instrumentala da, ez soziatiboa.' },
        { letter: 'D', reason: '«azukrerekin» ortografia akatsa da («azukrearekin»).' }
      ],
      tip: 'Norekin? Azukrearekin. Zer gabe? Azukrerik gabe.'
    }
  },
  {
    id: 'ast-27',
    day: 'asteartea',
    order: 7,
    prompt: 'Opari hau zure ahizpa..... da.',
    options: [
      'rentzat',
      'rentzako',
      'rako',
      'ra'
    ],
    correctIndex: 0,
    category: 'Deklinabidea eta Kasuak',
    level: 'B1',
    explanation: {
      rule: 'Hartzailea adierazteko NORENTZAT kasua erabiltzen da («-rentzat»). «-rentzako» ez da hobesten izenlagun ez denean.',
      whyCorrect: '«Zure ahizparentzat da» predikatibo zuzena da.',
      whyWrongOptions: [
        { letter: 'B', reason: '«-rentzako» izenlagunetan erabiltzen da («ahizparentzako oparia»), baina predikatuan «ahizparentzat da».' },
        { letter: 'C', reason: '«-rako» gauza ez-bizidunen helburua da («afaltzeko/afariarako»).' },
        { letter: 'D', reason: '«ahizpara» lekuzkoa da (adlatiboa).' }
      ],
      tip: 'Opari hau zuretzat da. (Baina: Zuretzako oparia ekarri dut).'
    }
  },
  {
    id: 'ast-28',
    day: 'asteartea',
    order: 8,
    prompt: 'Aita-amek seme-alaba..... heziketa zaindu behar dute.',
    options: [
      'en',
      'eneko',
      'etako',
      'etan'
    ],
    correctIndex: 0,
    category: 'Deklinabidea eta Kasuak',
    level: 'B1',
    explanation: {
      rule: 'Genitibo plurala (Noren?) «-en» atzizkiaz osatzen da.',
      whyCorrect: '«Seme-alaben heziketa» (la educación de los hijos).',
      whyWrongOptions: [
        { letter: 'B', reason: '«eneko» ez da existitzen hemen.' },
        { letter: 'C', reason: '«etako» leku-genitiboa da (nongo?), ez jabetzakoa.' },
        { letter: 'D', reason: '«etan» inesibo plurala da (non).' }
      ],
      tip: 'Noren? Singularrean: -aren. Pluralean: -en. Mugagabean: -(r)en.'
    }
  },
  {
    id: 'ast-29',
    day: 'asteartea',
    order: 9,
    prompt: 'Bost ..... ikusi ditugu plazan jolasean.',
    options: [
      'ume',
      'umeak',
      'umeei',
      'umetan'
    ],
    correctIndex: 0,
    category: 'Deklinabidea eta Kasuak',
    level: 'B1',
    explanation: {
      rule: 'Bi baino zenbatzaile handiagoekin, izena MUGAGABEAN jartzen da normalki: «bost ume».',
      whyCorrect: '«Bost ume ikusi ditugu» forma arautua da.',
      whyWrongOptions: [
        { letter: 'B', reason: '«bost umeak» bakarrik erabiltzen da aurretik aipatutako bost ume zehatz direnean («los cinco niños»).' },
        { letter: 'C', reason: '«umeei» datiboa da, baina ikusi aditzak nor eskatzen du.' },
        { letter: 'D', reason: '«umetan» inesiboa da (de niños).' }
      ],
      tip: 'Zenbatzailea + izen mugagabea: «hiru liburu», «zazpi lagun».'
    }
  },
  {
    id: 'ast-30',
    day: 'asteartea',
    order: 10,
    prompt: 'Harri..... jo du kristala eta hautsi egin du.',
    options: [
      'z',
      'az',
      'ekin',
      'agatik'
    ],
    correctIndex: 0,
    category: 'Deklinabidea eta Kasuak',
    level: 'B2',
    explanation: {
      rule: 'Tresna edo materiala adierazteko ZEREZ instrumentala («-z / -ez») erabiltzen da mugagabean.',
      whyCorrect: '«Harriz jo du» (le ha dado con una piedra).',
      whyWrongOptions: [
        { letter: 'B', reason: '«harriaz» singular mugatua da, baina instrumentalean mugagabea da ohikoena tresneriarako.' },
        { letter: 'C', reason: '«harriekin» laguntza da, ez instrumentala («con una piedra» zentzuan «harriz» da).' },
        { letter: 'D', reason: '«harriagatik» kausa da (por la piedra).' }
      ],
      tip: 'Harriz jo, eskuz egin, oinez joan.'
    }
  },
  {
    id: 'ast-31',
    day: 'asteartea',
    order: 11,
    prompt: 'Mikel ..... bizi da Donostian.',
    options: [
      'izebaren etxean',
      'izebako etxean',
      'izebarentzako etxean',
      'izebakoan'
    ],
    correctIndex: 0,
    category: 'Deklinabidea eta Kasuak',
    level: 'B1',
    explanation: {
      rule: 'Pertsona baten jabegoa adierazteko NOREN kasua («-aren») erabiltzen da: «izebaren etxean».',
      whyCorrect: '«Izebaren etxean» guztiz zuzena da.',
      whyWrongOptions: [
        { letter: 'B', reason: '«-ko» leku-izenekin erabiltzen da, ez pertsonekin («Bilboko», baina «Mikelenen»).' },
        { letter: 'C', reason: '«izebarentzako» hartzailea da.' },
        { letter: 'D', reason: '«izebakoan» ez da zuzena.' }
      ],
      tip: 'Lagunaren etxean, amaren autoan.'
    }
  },
  {
    id: 'ast-32',
    day: 'asteartea',
    order: 12,
    prompt: 'Zenbat diru geratzen ..... zorroan?',
    options: [
      'zaizu',
      'zaitu',
      'zara',
      'dizu'
    ],
    correctIndex: 0,
    category: 'Deklinabidea eta Kasuak',
    level: 'B1',
    explanation: {
      rule: '«Geratu» aditzak NOR-NORI eskatzen du pertsona bati zerbait geratzen zaionean.',
      whyCorrect: '«Geratzen zaizu» (NOR-NORI: dirua zuri).',
      whyWrongOptions: [
        { letter: 'B', reason: '«zaitu» NOR-NORK da (hark zu).' },
        { letter: 'C', reason: '«zara» NOR da (zu).' },
        { letter: 'D', reason: '«dizu» NOR-NORI-NORK da (hark zuri hura).' }
      ],
      tip: 'Zerbait geratu zait / zaizu / zaio.'
    }
  },
  {
    id: 'ast-33',
    day: 'asteartea',
    order: 13,
    prompt: 'Hau ez da nire errua, Mikel..... baizik.',
    options: [
      'ena',
      'rena',
      'rena da',
      'ri'
    ],
    correctIndex: 0,
    category: 'Deklinabidea eta Kasuak',
    level: 'B2',
    explanation: {
      rule: 'Izen berezi kontsonantedunek «-en» hartzen dute genitiboan (Mikel -> Mikelen) eta substantibatzean «-a» -> «Mikelena».',
      whyCorrect: '«Mikelena» (Mikel + -en + -a).',
      whyWrongOptions: [
        { letter: 'B', reason: '«Mikelrena» okerra da: kontsonantez amaitzen diren izenek ez dute «-r-» epentetikorik hartzen («Mikelen», ez «Mikelren»).' },
        { letter: 'C', reason: '«baizik» ondoren ez da aditza errepikatzen («Mikelena baizik»).' },
        { letter: 'D', reason: '«Mikeli» datiboa da.' }
      ],
      tip: 'Bokalez: Jonen -> Jonena. Kontsonantez: Aitorren -> Aitorrena; Mikelen -> Mikelena.'
    }
  },
  {
    id: 'ast-34',
    day: 'asteartea',
    order: 14,
    prompt: 'Ez dugu ..... informazio berririk jaso.',
    options: [
      'inongo',
      'inon',
      'inondik',
      'inora'
    ],
    correctIndex: 0,
    category: 'Deklinabidea eta Kasuak',
    level: 'B2',
    explanation: {
      rule: 'Izen baten aurrean «inongo» (ez-bizidun/orokorra) edo «inolako» izenlaguna erabiltzen da.',
      whyCorrect: '«Inongo informazio berririk» zuzena da.',
      whyWrongOptions: [
        { letter: 'B', reason: '«inon» adberbioa da (non: en ningún sitio).' },
        { letter: 'C', reason: '«inondik» nondik da.' },
        { letter: 'D', reason: '«inora» nora da.' }
      ],
      tip: 'Inongo zalantzarik gabe = Inolako zalantzarik gabe.'
    }
  },
  {
    id: 'ast-35',
    day: 'asteartea',
    order: 15,
    prompt: 'Herri txiki ..... bizi dira mendi kaxkoan.',
    options: [
      'batean',
      'batetan',
      'baten',
      'bateko'
    ],
    correctIndex: 0,
    category: 'Deklinabidea eta Kasuak',
    level: 'B1',
    explanation: {
      rule: '«Bat» zenbatzailearen inesiboa «batean» da euskara batuan.',
      whyCorrect: '«Herri txiki batean» da forma zuzena.',
      whyWrongOptions: [
        { letter: 'B', reason: '«batetan» mendebaldeko aldaera da, baina batuan «batean» hobesten da.' },
        { letter: 'C', reason: '«baten» genitiboa da (de uno).' },
        { letter: 'D', reason: '«bateko» izenlaguna da.' }
      ],
      tip: 'Non? Batean. Nondik? Batetik. Nora? Batera.'
    }
  },
  {
    id: 'ast-36',
    day: 'asteartea',
    order: 16,
    prompt: 'Nire lagun ..... auto berria erosi du.',
    options: [
      'batek',
      'batean',
      'bati',
      'bata'
    ],
    correctIndex: 0,
    category: 'Deklinabidea eta Kasuak',
    level: 'B1',
    explanation: {
      rule: 'Erosi du aditzak NORK eskatzen du, eta «bat»-en ergatiboa «batek» da.',
      whyCorrect: '«Nire lagun batek erosi du» da esaldi zuzena.',
      whyWrongOptions: [
        { letter: 'B', reason: '«batean» inesiboa da.' },
        { letter: 'C', reason: '«bati» datiboa da.' },
        { letter: 'D', reason: '«bata» absolutiboa da.' }
      ],
      tip: 'Nork? Batek, lagun batek, irakasle batek.'
    }
  },
  {
    id: 'ast-37',
    day: 'asteartea',
    order: 17,
    prompt: 'Ume horiek ez dute batere .....',
    options: [
      'lotsarik',
      'lotsa',
      'lotsari',
      'lotsak'
    ],
    correctIndex: 0,
    category: 'Deklinabidea eta Kasuak',
    level: 'B1',
    explanation: {
      rule: '«Batere» kuantifikatzaileak partitiboa («-(r)ik») eskatzen du beti ezezko testuinguruetan.',
      whyCorrect: '«Batere lotsarik ez dute» (no tienen nada de vergüenza).',
      whyWrongOptions: [
        { letter: 'B', reason: '«lotsa» partitiborik gabe okerra da hemen.' },
        { letter: 'C', reason: '«lotsari» datiboa da.' },
        { letter: 'D', reason: '«lotsak» ergatiboa da.' }
      ],
      tip: 'Batere + [partitiboa] + ez: «batere gogorik ez», «batere dirurik ez».'
    }
  },
  {
    id: 'ast-38',
    day: 'asteartea',
    order: 18,
    prompt: 'Paris..... trenez joan gara asteburuan.',
    options: [
      'era',
      'ra',
      'tik',
      'ko'
    ],
    correctIndex: 0,
    category: 'Deklinabidea eta Kasuak',
    level: 'B1',
    explanation: {
      rule: 'Kontsonantez amaitutako leku-izenek «-era» hartzen dute adlatiboan: Paris -> Parisera.',
      whyCorrect: '«Parisera trenez joan gara».',
      whyWrongOptions: [
        { letter: 'B', reason: '«-ra» bokalez amaitzen direnekin erabiltzen da (Donostia -> Donostiara).' },
        { letter: 'C', reason: '«Paristik» abiapuntua da (nondik), ez helmuga.' },
        { letter: 'D', reason: '«Parisko» nongo da.' }
      ],
      tip: 'Bokalez: Bilbora. Kontsonantez: Madrilera, Parisera, Iruñera.'
    }
  },
  {
    id: 'ast-39',
    day: 'asteartea',
    order: 19,
    prompt: 'Txakurrak zaunka egin dio kalean zebilen .....',
    options: [
      'gizonari',
      'gizona',
      'gizonek',
      'gizonarekin'
    ],
    correctIndex: 0,
    category: 'Deklinabidea eta Kasuak',
    level: 'B1',
    explanation: {
      rule: '«Zaunka egin dio» aditzak NORI kasua (datiboa) eskatzen du: nori egin dio zaunka?',
      whyCorrect: '«Gizonari» da datibo singularra.',
      whyWrongOptions: [
        { letter: 'B', reason: '«gizona» absolutiboa da.' },
        { letter: 'C', reason: '«gizonek» ergatiboa da.' },
        { letter: 'D', reason: '«gizonarekin» soziatiboa da.' }
      ],
      tip: 'Zaunka egin dio -> NORI? Gizonari.'
    }
  },
  {
    id: 'ast-40',
    day: 'asteartea',
    order: 20,
    prompt: 'Zuhaitz ..... hostoak erortzen hasi dira.',
    options: [
      'etako',
      'etakoak',
      'etatik',
      'etara'
    ],
    correctIndex: 0,
    category: 'Deklinabidea eta Kasuak',
    level: 'B2',
    explanation: {
      rule: 'NONGO kasua leku bati dagokion izenlaguna osatzeko erabiltzen da: «zuhaitzetako hostoak».',
      whyCorrect: '«Zuhaitzetako hostoak» (las hojas de los árboles).',
      whyWrongOptions: [
        { letter: 'B', reason: '«etakoak» substantibatua da, baina hemen «hostoak» izena ageri da.' },
        { letter: 'C', reason: '«etatik» nondik da (aditzarekin joateko).' },
        { letter: 'D', reason: '«etara» adlatiboa da.' }
      ],
      tip: 'Nongo? Mendiko bidea, basoko animaliak, zuhaitzetako hostoak.'
    }
  }
];
