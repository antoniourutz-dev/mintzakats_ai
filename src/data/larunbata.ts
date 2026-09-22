import { Question } from '../types';

export const larunbataQuestions: Question[] = [
  {
    id: 'ast-101',
    day: 'larunbata',
    order: 1,
    prompt: 'Egitasmo honen helburu nagusia edo ..... gazteei laguntzea da.',
    options: [
      'xedea',
      'xehetasuna',
      'xelebrekeria',
      'xurgapena'
    ],
    correctIndex: 0,
    category: 'Hiztegia eta Sinonimoak',
    level: 'B2',
    explanation: {
      rule: '«Helburu» hitzaren sinonimo jator eta aberatsena «xede» da (objetivo, meta).',
      whyCorrect: '«Xedea» helburuaren baliokide zuzena da.',
      whyWrongOptions: [
        { letter: 'B', reason: '«xehetasuna» detalle esan nahi du.' },
        { letter: 'C', reason: '«xelebrekeria» bitxikeria edo txorakeria da.' },
        { letter: 'D', reason: '«xurgapena» absortzioa da.' }
      ],
      tip: 'Helburua = Xedea (helburu nagusia = xede nagusia).'
    }
  },
  {
    id: 'ast-102',
    day: 'larunbata',
    order: 2,
    prompt: 'Gelan dena garbi eta txukun zegoen; oso giro ..... zegoen bertan.',
    options: [
      'atsegina',
      'lotsagarria',
      'zalantzagarria',
      'arriskutsua'
    ],
    correctIndex: 0,
    category: 'Hiztegia eta Sinonimoak',
    level: 'B1',
    explanation: {
      rule: 'Giro goxo eta lasaia adierazteko «atsegina» adjektiboa erabiltzen da (agradable).',
      whyCorrect: '«Giro atsegina» oso adierazpide arrunta eta positiboa da.',
      whyWrongOptions: [
        { letter: 'B', reason: '«lotsagarria» vergonzoso esan nahi du.' },
        { letter: 'C', reason: '«zalantzagarria» dudoso da.' },
        { letter: 'D', reason: '«arriskutsua» peligroso da.' }
      ],
      tip: 'Atsegina = goxoa, erosoa, gustukoa.'
    }
  },
  {
    id: 'ast-103',
    day: 'larunbata',
    order: 3,
    prompt: 'Laino itxiak mendiko tontorra ..... egin zuen.',
    options: [
      'lausotu',
      'argitu',
      'sakontu',
      'berotu'
    ],
    correctIndex: 0,
    category: 'Hiztegia eta Sinonimoak',
    level: 'B2',
    explanation: {
      rule: 'Ikusmena lauso, ilun edo ez-garbi bihurtzea «lausotu» da (nublar, difuminar).',
      whyCorrect: '«Lausotu egin zuen» da testuinguru honetan aditz zehatzena.',
      whyWrongOptions: [
        { letter: 'B', reason: '«argitu» kontrakoa da (aclarar).' },
        { letter: 'C', reason: '«sakontu» profundizar da.' },
        { letter: 'D', reason: '«berotu» calentar da.' }
      ],
      tip: 'Lausoa -> Lausotu (difuminarse, nublarse).'
    }
  },
  {
    id: 'ast-104',
    day: 'larunbata',
    order: 4,
    prompt: 'Gobernuak neurri berriak ..... ditu segurtasuna bermatzeko.',
    options: [
      'hitzartu',
      'hautsi',
      'ezabatu',
      'galdu'
    ],
    correctIndex: 0,
    category: 'Hiztegia eta Sinonimoak',
    level: 'C1',
    explanation: {
      rule: 'Akordio bidez adostea edo finkatzea «hitzartu» da (acordar, pactar).',
      whyCorrect: '«Hitzartu ditu» (ha pactado / acordado).',
      whyWrongOptions: [
        { letter: 'B', reason: '«hautsi» romper da.' },
        { letter: 'C', reason: '«ezabatu» borrar da.' },
        { letter: 'D', reason: '«galdu» perder da.' }
      ],
      tip: 'Hitza eman -> Hitzartu (acordar mediante pacto).'
    }
  },
  {
    id: 'ast-105',
    day: 'larunbata',
    order: 5,
    prompt: 'Idazlearen azken eleberria oso ..... da, erraz irakurtzen da.',
    options: [
      'ulerterraza',
      'ulertezina',
      'ulergaiztoa',
      'ulergabea'
    ],
    correctIndex: 0,
    category: 'Hiztegia eta Sinonimoak',
    level: 'B2',
    explanation: {
      rule: '«-erraz» atzizkiak erraz egiten den zerbait sortzen du: «ulerterraza» (fácil de entender).',
      whyCorrect: '«Ulerterraza» da forma egokia (erraz irakurtzen delako).',
      whyWrongOptions: [
        { letter: 'B', reason: '«ulertezina» incomprensible da (ezinezkoa ulertzea).' },
        { letter: 'C', reason: '«ulergaiztoa» difícil de comprender da.' },
        { letter: 'D', reason: '«ulergabea» ez da existitzen.' }
      ],
      tip: 'Irakuterraza, ulerterraza, eramangarria.'
    }
  },
  {
    id: 'ast-106',
    day: 'larunbata',
    order: 6,
    prompt: 'Epaileak auzipetuaren jokabidea gogor ..... zuen.',
    options: [
      'gaitzetsi',
      'onetsi',
      'saritu',
      'goretsi'
    ],
    correctIndex: 0,
    category: 'Hiztegia eta Sinonimoak',
    level: 'C1',
    explanation: {
      rule: 'Zerbait gaizkitzat jo edo kondenatzea «gaitzetsi» da (condenar, reprobar, rechazar).',
      whyCorrect: '«Gaitzetsi zuen» (reprobó o condenó su conducta).',
      whyWrongOptions: [
        { letter: 'B', reason: '«onetsi» aprobar edo ontzat ematea da (kontrakoa).' },
        { letter: 'C', reason: '«saritu» premiar da.' },
        { letter: 'D', reason: '«goretsi» alabar o elogiar da.' }
      ],
      tip: 'Gaitzetsi (rechazar/condenar) vs Onetsi (aprobar).'
    }
  },
  {
    id: 'ast-107',
    day: 'larunbata',
    order: 7,
    prompt: 'Autoak abiadura handia hartu zuen eta ..... geratu zen.',
    options: [
      'galgatu ezinik',
      'galgatu nahian',
      'galgatzean',
      'galgatu gabean'
    ],
    correctIndex: 0,
    category: 'Hiztegia eta Sinonimoak',
    level: 'B2',
    explanation: {
      rule: 'Frenatzea «galgatu» da (balaztatu / frenatu). Zerbait egin ezin denean «-tu ezinik» erabiltzen da.',
      whyCorrect: '«Galgatu ezinik geratu zen» (sin poder frenar).',
      whyWrongOptions: [
        { letter: 'B', reason: '«galgatu nahian» frenatu nahian esan nahi du, baina ez du adierazten ezintasuna.' },
        { letter: 'C', reason: '«galgatzean» al frenar da.' },
        { letter: 'D', reason: 'Forma ez-arautua da.' }
      ],
      tip: 'Galga = frena. Galgatu = frenatu.'
    }
  },
  {
    id: 'ast-108',
    day: 'larunbata',
    order: 8,
    prompt: 'Eztabaidan ez zuen ezer berririk esan, argudio ..... erabili zituen.',
    options: [
      'hutsalak',
      'zorrotzak',
      'sinesgarriak',
      'eraginkorrak'
    ],
    correctIndex: 0,
    category: 'Hiztegia eta Sinonimoak',
    level: 'B2',
    explanation: {
      rule: 'Garrantzirik gabekoak, azalekoak edo balio gabeak «hutsalak» dira (triviales, vanos).',
      whyCorrect: '«Argudio hutsalak» (argumentos vanos / sin sustancia).',
      whyWrongOptions: [
        { letter: 'B', reason: '«zorrotzak» afilados o rigurosos da.' },
        { letter: 'C', reason: '«sinesgarriak» creíbles da.' },
        { letter: 'D', reason: '«eraginkorrak» eficaces da.' }
      ],
      tip: 'Hutsala = ezdeusa, mamirik gabea.'
    }
  },
  {
    id: 'ast-109',
    day: 'larunbata',
    order: 9,
    prompt: 'Ezagutza horiek praktikan jartzeko gaitasuna edo ..... behar da.',
    options: [
      'trebetasuna',
      'alferkeria',
      'ezintasuna',
      'moteltasuna'
    ],
    correctIndex: 0,
    category: 'Hiztegia eta Sinonimoak',
    level: 'B1',
    explanation: {
      rule: 'Zerbait ongi eta maisuki egiteko abileziari «trebetasuna» deritzo (habilidad, destreza).',
      whyCorrect: '«Trebetasuna» gaitasunaren sinonimo hurbila da.',
      whyWrongOptions: [
        { letter: 'B', reason: '«alferkeria» pereza da.' },
        { letter: 'C', reason: '«ezintasuna» incapacidad da.' },
        { letter: 'D', reason: '«moteltasuna» lentitud da.' }
      ],
      tip: 'Trebea = trebetasuna duena (habilidoso).'
    }
  },
  {
    id: 'ast-110',
    day: 'larunbata',
    order: 10,
    prompt: 'Arazoa konpontzeko proposamen ..... egin zuten.',
    options: [
      'bideragarria',
      'bidegabea',
      'bidezkoa',
      'bidegorria'
    ],
    correctIndex: 0,
    category: 'Hiztegia eta Sinonimoak',
    level: 'B2',
    explanation: {
      rule: 'Burutu edo gauzatu daitekeenari «bideragarria» deritzo (viable, factible).',
      whyCorrect: '«Proposamen bideragarria» (propuesta viable).',
      whyWrongOptions: [
        { letter: 'B', reason: '«bidegabea» injustoa da.' },
        { letter: 'C', reason: '«bidezkoa» justo o legítimo da.' },
        { letter: 'D', reason: '«bidegorria» bidegorri fisikoa da (carril bici).' }
      ],
      tip: 'Bideragarria = egin daitekeena (viable).'
    }
  },
  {
    id: 'ast-111',
    day: 'larunbata',
    order: 11,
    prompt: 'Haurrak begirada ..... eta adimentsua zuen.',
    options: [
      'zolia',
      'motela',
      'herrena',
      'itsu'
    ],
    correctIndex: 0,
    category: 'Hiztegia eta Sinonimoak',
    level: 'C1',
    explanation: {
      rule: 'Zolia zorrotza, erne eta argia dena da (agudo, despierto, perspicaz).',
      whyCorrect: '«Begirada zolia» (mirada aguda y despierta).',
      whyWrongOptions: [
        { letter: 'B', reason: '«motela» motela edo geldia da.' },
        { letter: 'C', reason: '«herrena» cojo da.' },
        { letter: 'D', reason: '«itsu» ciego da.' }
      ],
      tip: 'Zolia = erne, argi eta bizkorra.'
    }
  },
  {
    id: 'ast-112',
    day: 'larunbata',
    order: 12,
    prompt: 'Bi herrialdeen arteko mugak ..... egin ziren itun berriaren ostean.',
    options: [
      'zehaztu',
      'desagertu',
      'galdu',
      'nahasi'
    ],
    correctIndex: 0,
    category: 'Hiztegia eta Sinonimoak',
    level: 'B2',
    explanation: {
      rule: 'Zerbait argi mugatzea edo finkatzea «zehaztu» da (precisar, concretar, delimitar).',
      whyCorrect: '«Mugak zehaztu egin ziren» (se delimitaron las fronteras).',
      whyWrongOptions: [
        { letter: 'B', reason: '«desagertu» desaparecer da.' },
        { letter: 'C', reason: '«galdu» perder da.' },
        { letter: 'D', reason: '«nahasi» confundir da.' }
      ],
      tip: 'Zehaztu = argi eta garbi finkatu.'
    }
  },
  {
    id: 'ast-113',
    day: 'larunbata',
    order: 13,
    prompt: 'Lan handia egin ostean, atseden hartzeko saria ..... zuen.',
    options: [
      'merezi',
      'behar',
      'nahi',
      'gorde'
    ],
    correctIndex: 0,
    category: 'Hiztegia eta Sinonimoak',
    level: 'B1',
    explanation: {
      rule: 'Eginiko ahaleginagatik zerbait dagokizunean «merezi izan» erabiltzen da (merecer).',
      whyCorrect: '«Saria merezi zuen» da esaldi zuzena.',
      whyWrongOptions: [
        { letter: 'B', reason: '«behar» necesitar da.' },
        { letter: 'C', reason: '«nahi» querer da.' },
        { letter: 'D', reason: '«gorde» guardar da.' }
      ],
      tip: 'Merezi du = balio du / merezimendua du.'
    }
  },
  {
    id: 'ast-114',
    day: 'larunbata',
    order: 14,
    prompt: 'Gurasoek beti eman diete askatasun ..... beren seme-alabei.',
    options: [
      'zabala',
      'estua',
      'motza',
      'gogorra'
    ],
    correctIndex: 0,
    category: 'Hiztegia eta Sinonimoak',
    level: 'B1',
    explanation: {
      rule: 'Mugarik gabeko edo muga handirik gabeko askatasuna «askatasun zabala» da.',
      whyCorrect: '«Askatasun zabala» esapide egokia da.',
      whyWrongOptions: [
        { letter: 'B', reason: '«estua» estrecho da (muga asko dituena).' },
        { letter: 'C', reason: '«motza» corto da.' },
        { letter: 'D', reason: '«gogorra» duro da.' }
      ],
      tip: 'Zabala = handia, irekia.'
    }
  },
  {
    id: 'ast-115',
    day: 'larunbata',
    order: 15,
    prompt: 'Informazio hori ez da ofiziala, zurrumurru ..... besterik ez da.',
    options: [
      'hutsa',
      'garbia',
      'ziurra',
      'finko'
    ],
    correctIndex: 0,
    category: 'Hiztegia eta Sinonimoak',
    level: 'B2',
    explanation: {
      rule: 'Zerbait besterik ez dela adierazteko «huts» atzeratua erabiltzen da izenaren ondoan: «zurrumurru hutsa» (mero rumor).',
      whyCorrect: '«Zurrumurru hutsa da» (es un mero rumor).',
      whyWrongOptions: [
        { letter: 'B', reason: '«garbia» limpia da.' },
        { letter: 'C', reason: '«ziurra» seguro da (kontrakoa litzateke).' },
        { letter: 'D', reason: '«finko» fijo da.' }
      ],
      tip: 'Izen + hutsa = mero/puro (gezur hutsa, zurrumurru hutsa).'
    }
  },
  {
    id: 'ast-116',
    day: 'larunbata',
    order: 16,
    prompt: 'Arazoa konpontzeko erabili duten bidea guztiz ..... izan da.',
    options: [
      'egokia',
      'oker',
      'txar',
      'motel'
    ],
    correctIndex: 0,
    category: 'Hiztegia eta Sinonimoak',
    level: 'B1',
    explanation: {
      rule: 'Helbururako komenigarria eta behar bezalakoa dena «egokia» da (adecuado, oportuno).',
      whyCorrect: '«Guztiz egokia izan da» (ha sido totalmente adecuado).',
      whyWrongOptions: [
        { letter: 'B', reason: '«oker» artikulurik gabe osatugabe dago hemen («okerra» beharko luke).' },
        { letter: 'C', reason: '«txar» deklinatu gabe dago.' },
        { letter: 'D', reason: '«motel» lento da.' }
      ],
      tip: 'Egokia = aproposa, komenigarria.'
    }
  },
  {
    id: 'ast-117',
    day: 'larunbata',
    order: 17,
    prompt: 'Lanpostu berriaren baldintzak ezin hobeak dira, benetan .....',
    options: [
      'pagotxa',
      'ezbeharra',
      'zoritxarra',
      'burukomina'
    ],
    correctIndex: 0,
    category: 'Hiztegia eta Sinonimoak',
    level: 'B2',
    explanation: {
      rule: 'Sekulako abantaila edo pagotxa denari (chollo, ganga) «pagotxa» deritzo euskaraz.',
      whyCorrect: '«Benetan pagotxa!» (¡menudo chollo!).',
      whyWrongOptions: [
        { letter: 'B', reason: '«ezbeharra» desgracia da.' },
        { letter: 'C', reason: '«zoritxarra» infortunio da.' },
        { letter: 'D', reason: '«burukomina» dolor de cabeza / preocupación da.' }
      ],
      tip: 'Pagotxa = pagotxa bikaina, abantaila handia (ganga).'
    }
  },
  {
    id: 'ast-118',
    day: 'larunbata',
    order: 18,
    prompt: 'Idatzi duen txostena oso ..... da, datu zehatz guztiak biltzen baititu.',
    options: [
      'xehea',
      'arintxoa',
      'gainbegirakoa',
      'ulertezina'
    ],
    correctIndex: 0,
    category: 'Hiztegia eta Sinonimoak',
    level: 'B2',
    explanation: {
      rule: 'Puntuz puntu eta xehetasunez osatutakoari «xehea» deritzo (detallado, minucioso).',
      whyCorrect: '«Txosten oso xehea» (informe muy detallado).',
      whyWrongOptions: [
        { letter: 'B', reason: '«arintxoa» azalekoa edo arina da.' },
        { letter: 'C', reason: '«gainbegirakoa» por encima egindakoa da.' },
        { letter: 'D', reason: '«ulertezina» incomprensible da.' }
      ],
      tip: 'Xehea = xehetasunez betea (detallado).'
    }
  },
  {
    id: 'ast-119',
    day: 'larunbata',
    order: 19,
    prompt: 'Gazteak herriko kultur ekintzak ..... ditu bere proposamen berriekin.',
    options: [
      'biziberritu',
      'hil',
      'zahartu',
      'itxi'
    ],
    correctIndex: 0,
    category: 'Hiztegia eta Sinonimoak',
    level: 'B2',
    explanation: {
      rule: 'Bizitasun berria ematea edo suspertzea «biziberritu» da (revitalizar).',
      whyCorrect: '«Kultur ekintzak biziberritu ditu» esapide aproposa da.',
      whyWrongOptions: [
        { letter: 'B', reason: '«hil» matar da.' },
        { letter: 'C', reason: '«zahartu» envejecer da.' },
        { letter: 'D', reason: '«itxi» cerrar da.' }
      ],
      tip: 'Biziberritu = bizitasun berria eman.'
    }
  },
  {
    id: 'ast-120',
    day: 'larunbata',
    order: 20,
    prompt: 'Bere erabakiarekin ..... handia sortu zuen lankideen artean.',
    options: [
      'harridura',
      'lasaitasun',
      'hotz',
      'lo'
    ],
    correctIndex: 0,
    category: 'Hiztegia eta Sinonimoak',
    level: 'B1',
    explanation: {
      rule: 'Harritzeko sentimenduari «harridura» deritzo (asombro, sorpresa).',
      whyCorrect: '«Harridura handia sortu zuen» da esaldi zuzena.',
      whyWrongOptions: [
        { letter: 'B', reason: '«lasaitasun» artikulua falta zaio («lasaitasuna»).' },
        { letter: 'C', reason: '«hotz» ez da hemen erabiltzen.' },
        { letter: 'D', reason: '«lo» sueño da.' }
      ],
      tip: 'Harridura = sorpresaz beteriko harridura egoera.'
    }
  }
];
