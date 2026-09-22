import { Question } from '../types';

export const igandeaQuestions: Question[] = [
  {
    id: 'ast-121',
    day: 'igandea',
    order: 1,
    prompt: '—Zenbatetan behin etortzen da medikua? — ..... behin.',
    options: [
      'Hiru astean',
      'Hiru astetan',
      'Hiru astero',
      'Hiru astetik'
    ],
    correctIndex: 0,
    category: 'Asteko Erronka Nagusia',
    level: 'B2',
    explanation: {
      rule: '«Zenbatetan behin?» galderari erantzuteko, singularreko inesiboa («astean behin») edo mugagabea («hiru astean behin») erabiltzen da.',
      whyCorrect: '«Hiru astean behin» da tradiziozko egitura garbia.',
      whyWrongOptions: [
        { letter: 'B', reason: '«hiru astetan behin» erabili ohi den arren, singularra/mugagabea lehenesten da behinekin: «hiru astean behin».' },
        { letter: 'C', reason: '«-ro» eta «behin» ezin dira batera jarri («hiru astero» EDO «hiru astean behin»).' },
        { letter: 'D', reason: '«astez aste» bezalakoetatik nahastua da.' }
      ],
      tip: 'Egunean behin, hiru astean behin, urtean behin.'
    }
  },
  {
    id: 'ast-122',
    day: 'igandea',
    order: 2,
    prompt: 'Hori esan ....., denek txalo zaparrada beroa jo zuten.',
    options: [
      'bezain laster',
      'bezain lasterrean',
      'bezain goiz',
      'berehala'
    ],
    correctIndex: 0,
    category: 'Asteko Erronka Nagusia',
    level: 'B2',
    explanation: {
      rule: 'Zerbait egin eta berehala adierazteko «partizipioa + bezain laster / bezain pronto» erabiltzen da.',
      whyCorrect: '«Hori esan bezain laster» (nada más decir eso / tan pronto como dijo eso).',
      whyWrongOptions: [
        { letter: 'B', reason: '«lasterrean» inesiboa ez da forma honetan baliatzen.' },
        { letter: 'C', reason: '«bezain goiz» tan temprano esan nahi du.' },
        { letter: 'D', reason: '«berehala» adberbioa da baina ezin da partizipioaren atzetik horrela lotu juntagailu gabe.' }
      ],
      tip: 'Egin bezain laster / Etorri bezain pronto.'
    }
  },
  {
    id: 'ast-123',
    day: 'igandea',
    order: 3,
    prompt: 'Mikel eta biok ..... joan gara mendira goizean goiz.',
    options: [
      'elkarrekin',
      'elkar',
      'batera bakarrik',
      'biontzat'
    ],
    correctIndex: 0,
    category: 'Asteko Erronka Nagusia',
    level: 'B1',
    explanation: {
      rule: 'Bi pertsona batera joatean «elkarrekin» soziatiboa erabiltzen da.',
      whyCorrect: '«Mikel eta biok elkarrekin joan gara» da esaldi zuzena.',
      whyWrongOptions: [
        { letter: 'B', reason: '«elkar» izenordaina objektua da («elkar ikusi dugu»), ez konpainiazko adberbioa.' },
        { letter: 'C', reason: '«batera bakarrik» arraroa da.' },
        { letter: 'D', reason: '«biontzat» helburuzkoa da (para los dos).' }
      ],
      tip: 'Elkarrekin joan (ir juntos) vs Elkar maite (quererse mutuamente).'
    }
  },
  {
    id: 'ast-124',
    day: 'igandea',
    order: 4,
    prompt: 'Guk zuri laguntza eskatu ....., lagunduko al zeniguke?',
    options: [
      'bagenizu',
      'bagenio',
      'banizu',
      'bagenizun'
    ],
    correctIndex: 0,
    category: 'Asteko Erronka Nagusia',
    level: 'B2',
    explanation: {
      rule: 'Alegiazko baldintza Nor-Nori-Nork: Guk (bagen-) + Zuri (-zu) + Hura -> «bagenizu».',
      whyCorrect: '«Guk zuri laguntza eskatu bagenizu... lagunduko al zeniguke?».',
      whyWrongOptions: [
        { letter: 'B', reason: '«bagenio» HARI da (guk hari).' },
        { letter: 'C', reason: '«banizu» NIK ZURI da.' },
        { letter: 'D', reason: '«bagenizun» iraganeko baieztatua da, ez alegiazkoa (baldintzan ez dago «-n» atzizkirik).' }
      ],
      tip: 'Alegiazko baldintzan: bagenizu (ez bagenizun!).'
    }
  },
  {
    id: 'ast-125',
    day: 'igandea',
    order: 5,
    prompt: 'Ez dugu ..... eragozpenik ikusten proposamen horretan.',
    options: [
      'inondik inora',
      'inongo',
      'inor',
      'inora'
    ],
    correctIndex: 1,
    category: 'Asteko Erronka Nagusia',
    level: 'B2',
    explanation: {
      rule: 'Izen baten aurrean ezezkoan «inongo» edo «inolako» izenlaguna jartzen da: «inongo eragozpenik».',
      whyCorrect: '«Inongo eragozpenik» zuzena da.',
      whyWrongOptions: [
        { letter: 'A', reason: '«inondik inora» esaldi osoa indartzeko da («inondik inora ere ez»), baina ez izen baten izenlagun.' },
        { letter: 'C', reason: '«inor» pertsona da (nadie).' },
        { letter: 'D', reason: '«inora» adlatiboa da (a ningún sitio).' }
      ],
      tip: 'Inongo arazorik gabe / Inolako eragozpenik gabe.'
    }
  },
  {
    id: 'ast-126',
    day: 'igandea',
    order: 6,
    prompt: 'Afaria prestatzen ..... ordu bi eman ditu sukaldean.',
    options: [
      'zehar',
      'tartean',
      'bitartean',
      'baitan'
    ],
    correctIndex: 2,
    category: 'Asteko Erronka Nagusia',
    level: 'B2',
    explanation: {
      rule: 'Ekintza bat gertatzen ari den bitartean adierazteko «bitartean» erabiltzen da: «sukaldean afaria prestatzen zuen bitartean».',
      whyCorrect: '«Bitartean» denbora aldi berekoa adierazteko egitura jatorra da.',
      whyWrongOptions: [
        { letter: 'A', reason: '«zehar» lekuzkoa edo kalko desegokia da hemen.' },
        { letter: 'B', reason: '«tartean» gauza batzuen artean da.' },
        { letter: 'D', reason: '«baitan» baitan egoteko da (en su seno).' }
      ],
      tip: 'Bitartean = aldi berean (mientras tanto).'
    }
  },
  {
    id: 'ast-127',
    day: 'igandea',
    order: 7,
    prompt: 'Ikasle horrek dena ..... egin du, inolako akatsik gabe.',
    options: [
      'txukun-txukun',
      'txukuna',
      'txukunez',
      'txukunkiro'
    ],
    correctIndex: 0,
    category: 'Asteko Erronka Nagusia',
    level: 'B1',
    explanation: {
      rule: 'Adjektiboa bikoiztuz adberbio indartua sortzen da euskaraz: «txukun-txukun», «eder-ederki».',
      whyCorrect: '«Dena txukun-txukun egin du» (lo ha hecho primorosamente/muy bien).',
      whyWrongOptions: [
        { letter: 'B', reason: '«txukuna» izenondo singularra da, aditzari ez dio modu ematen.' },
        { letter: 'C', reason: '«txukunez» ez da erabiltzen.' },
        { letter: 'D', reason: '«txukunkiro» asmatua da.' }
      ],
      tip: 'Euskarazko bikoizketak: poliki-poliki, txukun-txukun, bizi-bizi.'
    }
  },
  {
    id: 'ast-128',
    day: 'igandea',
    order: 8,
    prompt: 'Gaur goizean autobusa galdu dut, ..... berandu iritsi naiz.',
    options: [
      'horrexegatik',
      'horrexegatiko',
      'honengatik',
      'horretarako'
    ],
    correctIndex: 0,
    category: 'Asteko Erronka Nagusia',
    level: 'B1',
    explanation: {
      rule: 'Kausa indartua emateko (por esa precisa razón) «horrexegatik» erabiltzen da.',
      whyCorrect: '«Horrexegatik berandu iritsi naiz» adierazpide zuzena da.',
      whyWrongOptions: [
        { letter: 'B', reason: '«horrexegatiko» izenlaguna da.' },
        { letter: 'C', reason: '«honengatik» gertukoa da eta indargarririk gabea.' },
        { letter: 'D', reason: '«horretarako» helburuzkoa da (para eso).' }
      ],
      tip: 'Horregatik (por eso) -> Horrexegatik (precisamente por eso).'
    }
  },
  {
    id: 'ast-129',
    day: 'igandea',
    order: 9,
    prompt: 'Nire lagunak katu beltz ..... ikusi ditu parkean.',
    options: [
      'batzuk',
      'batzuek',
      'batzuei',
      'batzutan'
    ],
    correctIndex: 0,
    category: 'Asteko Erronka Nagusia',
    level: 'B1',
    explanation: {
      rule: 'Objektu zuzena denean (ikusi ditu: zer?), NOR kasua mugagabe/partzialean «batzuk» da (ez batzuek!).',
      whyCorrect: '«Katu beltz batzuk ikusi ditu» (nor kasua).',
      whyWrongOptions: [
        { letter: 'B', reason: '«batzuek» NORK ergatiboa da («katu batzuek harrapatu dute sagua»).' },
        { letter: 'C', reason: '«batzuei» NORI datiboa da.' },
        { letter: 'D', reason: '«batzutan» inesiboa da.' }
      ],
      tip: 'Nor? Batzuk. Nork? Batzuek. Nori? Batzuei.'
    }
  },
  {
    id: 'ast-130',
    day: 'igandea',
    order: 10,
    prompt: 'Etxera iritsi ....., eskuak garbitu zituen.',
    options: [
      'orduko',
      'orduan',
      'ordurako',
      'ordutik'
    ],
    correctIndex: 0,
    category: 'Asteko Erronka Nagusia',
    level: 'B2',
    explanation: {
      rule: '«Partizipioa + orduko» berehalakotasuna adierazten duen denbora-menderagailua da: «iritsi orduko» (nada más llegar).',
      whyCorrect: '«Etxera iritsi orduko» guztiz egokia da.',
      whyWrongOptions: [
        { letter: 'B', reason: '«iritsi orduan» kalko arrunta da («al llegar entonces»).' },
        { letter: 'C', reason: '«ordurako» aurretiko muga da («iritsi zenerako»).' },
        { letter: 'D', reason: '«ordutik» jatorri denbora da.' }
      ],
      tip: 'Partizipioa + orduko = nada más hacer algo (atera orduko, heldu orduko).'
    }
  },
  {
    id: 'ast-131',
    day: 'igandea',
    order: 11,
    prompt: 'Azterketa gaindituz gero, guztiok oso pozik .....',
    options: [
      'egongo ginateke',
      'egongo gara',
      'gaude',
      'egongo ginen'
    ],
    correctIndex: 1,
    category: 'Asteko Erronka Nagusia',
    level: 'B2',
    explanation: {
      rule: '«-t(z)ez gero» baldintza erreal arrunt gisa erabiltzen denean, ondorioa etorkizunean orainaldiarekin doa: «egongo gara».',
      whyCorrect: '«Gaindituz gero, pozik egongo gara» esaldi erreala da.',
      whyWrongOptions: [
        { letter: 'A', reason: 'Alegiazkoa («ginateke») izateko, baldintzak hipotetikoa izan beharko luke («gaindituko bagenu»).' },
        { letter: 'C', reason: '«gaude» orainaldia da, baina ekintza etorkizunean dago baldintzatuta.' },
        { letter: 'D', reason: '«egongo ginen» iragana da.' }
      ],
      tip: 'Eginez gero -> egingo dugu / egongo gara.'
    }
  },
  {
    id: 'ast-132',
    day: 'igandea',
    order: 12,
    prompt: 'Gaurko bileran gai garrantzitsu bat ..... dugu esku artean.',
    options: [
      'dabilkigu',
      'gabiltza',
      'daukagu',
      'gara'
    ],
    correctIndex: 2,
    category: 'Asteko Erronka Nagusia',
    level: 'B1',
    explanation: {
      rule: 'Zerbait esku artean izatea «daukagu» edo «dugu» aditzarekin adierazten da: «gai garrantzitsu bat daukagu esku artean».',
      whyCorrect: '«Daukagu esku artean» da esapide naturala.',
      whyWrongOptions: [
        { letter: 'A', reason: '«dabilkigu» Nor-Nori da, baina hemen subjektua guk daukagu da.' },
        { letter: 'B', reason: '«gabiltza» ibili da, baina esaldian «bat» objektua dago.' },
        { letter: 'D', reason: '«gara» ez dator bat objektuarekin.' }
      ],
      tip: 'Esku artean izan / eduki = unean lantzen aritzea.'
    }
  },
  {
    id: 'ast-133',
    day: 'igandea',
    order: 13,
    prompt: 'Umeak amari muxu bat eman .....',
    options: [
      'dio',
      'du',
      'zaio',
      'ditu'
    ],
    correctIndex: 0,
    category: 'Asteko Erronka Nagusia',
    level: 'B1',
    explanation: {
      rule: 'Muxu bat (nor: d-) + amari (nori: -o) + umeak (nork) -> «dio».',
      whyCorrect: '«Amari muxu bat eman dio» (le ha dado un beso a la madre).',
      whyWrongOptions: [
        { letter: 'B', reason: '«du» Nor-Nork da, datiborik gabe.' },
        { letter: 'C', reason: '«zaio» Nor-Nori da, nork gabe.' },
        { letter: 'D', reason: '«ditu» muxu asko balira litzateke («muxuak eman dizkio»).' }
      ],
      tip: 'Eman dio: hari zerbait eman.'
    }
  },
  {
    id: 'ast-134',
    day: 'igandea',
    order: 14,
    prompt: 'Euria ari duela ....., aterkia eraman beharko dugu.',
    options: [
      'ikusita',
      'ikusi eta gero',
      'ikusten',
      'ikusiz'
    ],
    correctIndex: 0,
    category: 'Asteko Erronka Nagusia',
    level: 'B2',
    explanation: {
      rule: 'Kausa-ondorioa labur eta dotore adierazteko partizipio burutua «-ta» partikularekin erabiltzen da: «ikusita» (en vista de que...).',
      whyCorrect: '«Euria ari duela ikusita» (visto que está lloviendo).',
      whyWrongOptions: [
        { letter: 'B', reason: '«ikusi eta gero» denborazko kalkoa da hemen.' },
        { letter: 'C', reason: '«ikusten» aditz laguntzailerik gabe ez da kausazkoa.' },
        { letter: 'D', reason: '«ikusiz» moduzkoa da («ikustearen bidez»).' }
      ],
      tip: 'Hori ikusita = hori kontuan hartuta (en vista de eso).'
    }
  },
  {
    id: 'ast-135',
    day: 'igandea',
    order: 15,
    prompt: 'Hori ez da nire gustukoa, ..... gauza desberdinak gustatzen zaizkit.',
    options: [
      'niri',
      'nik',
      'nire',
      'niretzat'
    ],
    correctIndex: 0,
    category: 'Asteko Erronka Nagusia',
    level: 'B1',
    explanation: {
      rule: '«Gustatu» aditzak NORI kasua (datiboa) eskatzen du: niri gustatzen zait / zaizkit.',
      whyCorrect: '«Niri gustatzen zaizkit» (a mí me gustan).',
      whyWrongOptions: [
        { letter: 'B', reason: '«nik» ergatiboa da (nik atsegin ditut litzateke, baina ez gustatu!).' },
        { letter: 'C', reason: '«nire» genitiboa da (de mí).' },
        { letter: 'D', reason: '«niretzat» destinatarioa da.' }
      ],
      tip: 'Niri gustatzen zait (gustatu -> NORI). Nik atsegin dut (atsegin izan -> NORK).'
    }
  },
  {
    id: 'ast-136',
    day: 'igandea',
    order: 16,
    prompt: 'Liburua irakurtzen amaitu ....., ohera joango naiz.',
    options: [
      'bezainbatean',
      'orduko',
      'balebil',
      'bezain laster'
    ],
    correctIndex: 3,
    category: 'Asteko Erronka Nagusia',
    level: 'B2',
    explanation: {
      rule: '«Bezain laster» etorkizuneko berehalako ekintza lotzeko egitura perfektua da: amaitu bezain laster.',
      whyCorrect: '«Amaitu bezain laster, ohera joango naiz» (tan pronto como termine).',
      whyWrongOptions: [
        { letter: 'A', reason: '«bezainbatean» neurrian/arloan adierazteko da («ahal den bezainbatean»).' },
        { letter: 'B', reason: '«orduko» iraganean erabili ohi da gehien («amaitu orduko joan nintzen»).' },
        { letter: 'C', reason: '«balebil» adizkia da, ez lokuzioa.' }
      ],
      tip: 'Bezain laster = tan pronto como.'
    }
  },
  {
    id: 'ast-137',
    day: 'igandea',
    order: 17,
    prompt: 'Ez daukagu ..... beldurrik biharko probari begira.',
    options: [
      'inolako',
      'inongoak',
      'ezertako',
      'inola'
    ],
    correctIndex: 0,
    category: 'Asteko Erronka Nagusia',
    level: 'B1',
    explanation: {
      rule: 'Izen abstraktuekin ezezkoan «inolako» erabiltzen da (de ningún tipo): «inolako beldurrik».',
      whyCorrect: '«Inolako beldurrik ez daukagu» adierazpide bikaina da.',
      whyWrongOptions: [
        { letter: 'B', reason: '«inongoak» artikuluduna da.' },
        { letter: 'C', reason: '«ezertako» ez da beldurraren izenlagun gisa jartzen.' },
        { letter: 'D', reason: '«inola» ez da izenlaguna.' }
      ],
      tip: 'Inolako beldurrik gabe = sin ningún tipo de miedo.'
    }
  },
  {
    id: 'ast-138',
    day: 'igandea',
    order: 18,
    prompt: 'Nire anaia zaharrena Bilbon ..... bizi da oraindik.',
    options: [
      'oso',
      'ondo',
      'gustura',
      'gusturaz'
    ],
    correctIndex: 2,
    category: 'Asteko Erronka Nagusia',
    level: 'B1',
    explanation: {
      rule: 'Pozik, eroso eta gogoz bizitzea adierazteko «gustura bizi» da euskal esapide egokiena.',
      whyCorrect: '«Gustura bizi da» (vive a gusto).',
      whyWrongOptions: [
        { letter: 'A', reason: '«oso» graduatzailea da, bakarrik ezin da aditzari lotu («oso bizi da» ez da esaten).' },
        { letter: 'B', reason: '«ondo bizi da» zuzena litzateke, baina «gustura» da euskara tradizionalaren bikotea bizi aditzarekin.' },
        { letter: 'D', reason: '«gusturaz» ez da existitzen.' }
      ],
      tip: 'Gustura bizi, gustura egon, gustura jan.'
    }
  },
  {
    id: 'ast-139',
    day: 'igandea',
    order: 19,
    prompt: 'Hori egia balitz, gu berehala ..... zurekin.',
    options: [
      'poztuko ginateke',
      'poztuko gara',
      'poztu ginen',
      'poztuko lirateke'
    ],
    correctIndex: 0,
    category: 'Asteko Erronka Nagusia',
    level: 'B2',
    explanation: {
      rule: 'Hipotetikoa GU pertsonarekin: balitz -> ginateke («poztuko ginateke»).',
      whyCorrect: '«Gu poztuko ginateke» da alegiazko adizkia lehen pertsona pluralean.',
      whyWrongOptions: [
        { letter: 'B', reason: '«gara» baieztatua da.' },
        { letter: 'C', reason: '«ginen» iragana da.' },
        { letter: 'D', reason: '«lirateke» haiek da (haiek poztuko lirateke).' }
      ],
      tip: 'Gu ginateke / Zu zinateke / Haiek lirateke.'
    }
  },
  {
    id: 'ast-140',
    day: 'igandea',
    order: 20,
    prompt: 'Zorionak! Asteko 140 galderak erantzun dituzu eta euskara maila ..... erakutsi duzu.',
    options: [
      'bikaina',
      'txarra',
      'motela',
      'kamutsa'
    ],
    correctIndex: 0,
    category: 'Asteko Erronka Nagusia',
    level: 'B2',
    explanation: {
      rule: 'Bikaina kalitate gorenari ematen zaion adjektiboa da (excelente, sobresaliente).',
      whyCorrect: '«Euskara maila bikaina erakutsi duzu» (has demostrado un nivel excelente).',
      whyWrongOptions: [
        { letter: 'B', reason: '«txarra» malo da.' },
        { letter: 'C', reason: '«motela» flojo o lento da.' },
        { letter: 'D', reason: '«kamutsa» romo edo zorrotza ez dena da.' }
      ],
      tip: 'Bikain! Jarraitu horrela egunero akatsetatik ikasiz!'
    }
  }
];
