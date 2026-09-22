import { Question } from '../types';

export const ostegunaQuestions: Question[] = [
  {
    id: 'ast-61',
    day: 'osteguna',
    order: 1,
    prompt: 'Aterkia hartu dut, ..... euria hasten badu ere.',
    options: [
      'badaezpada',
      'badaezpadan',
      'por si acaso',
      'badaezpadako'
    ],
    correctIndex: 0,
    category: 'Akats Ohikoenak eta Kalkoak',
    level: 'B1',
    explanation: {
      rule: 'Euskaltzaindiaren Hiztegiaren arabera, forma estandarra «badaezpada» da, bukaerako «-n» gabe.',
      whyCorrect: '«Badaezpada» da forma zuzena (por si acaso).',
      whyWrongOptions: [
        { letter: 'B', reason: '«badaezpadan» oso akats hedatua da, baina bukaerako «-n» hori ez da zuzena.' },
        { letter: 'C', reason: 'Gaztelaniazko esapidea da.' },
        { letter: 'D', reason: '«badaezpadako» izenlaguna da («badaezpadako neurriak»).' }
      ],
      tip: 'Gogoratu beti: BADAEZPADA (bukaeran N-rik gabe!).'
    }
  },
  {
    id: 'ast-62',
    day: 'osteguna',
    order: 2,
    prompt: 'Ez nintzen ..... giltzak etxean ahaztu nituela.',
    options: [
      'ohartu',
      'konturatu gabe',
      'konturatu nintzen',
      'enteratu'
    ],
    correctIndex: 0,
    category: 'Akats Ohikoenak eta Kalkoak',
    level: 'B2',
    explanation: {
      rule: 'Euskaraz «ohartu» edo «konturatu» aditzak erabiltzen dira. Ezezkoan: «ez nintzen ohartu... -la».',
      whyCorrect: '«Ez nintzen ohartu... ahaztu nituela» adierazpide jator eta egokia da.',
      whyWrongOptions: [
        { letter: 'B', reason: '«konturatu gabe» ez da perpaus osagarria sartzeko adizki nagusia hemen.' },
        { letter: 'C', reason: '«ez nintzen konturatu nintzen» aditzaren alferrikako errepikapena da.' },
        { letter: 'D', reason: '«enteratu» erdarazko mailegu desegokia da.' }
      ],
      tip: 'Ohartu / Konturatu: «Ez nintzen ohartu berandu zela».'
    }
  },
  {
    id: 'ast-63',
    day: 'osteguna',
    order: 3,
    prompt: 'Biharko bilerara ..... etorriko da, ez baitu eragozpenik.',
    options: [
      'seguru asko',
      'seguraski',
      'seguramente',
      'seguruki'
    ],
    correctIndex: 0,
    category: 'Akats Ohikoenak eta Kalkoak',
    level: 'B2',
    explanation: {
      rule: 'Euskaraz «seguru asko» (bi hitzetan) edo «seguruenik» erabiltzen da; «seguraski» forma baztertu egin du Euskaltzaindiak.',
      whyCorrect: '«Seguru asko» forma akademiko hobetsia da (probablemente / seguramente).',
      whyWrongOptions: [
        { letter: 'B', reason: '«seguraski» oso akats arrunta da euskara ikasleen artean; baztertua dago.' },
        { letter: 'C', reason: 'Gaztelaniazko hitza da.' },
        { letter: 'D', reason: '«seguruki» ez da erabiltzen probabilitatea adierazteko.' }
      ],
      tip: 'Ez esan «seguraski»! Erabili «SEGURU ASKO» edo «SEGURUENIK».'
    }
  },
  {
    id: 'ast-64',
    day: 'osteguna',
    order: 4,
    prompt: 'Eman didazun laguntza guztia bihotzez .....',
    options: [
      'eskertzen dizut',
      'eskertzen zaitut',
      'eskertzen naiz',
      'eskertzen dut'
    ],
    correctIndex: 0,
    category: 'Akats Ohikoenak eta Kalkoak',
    level: 'B2',
    explanation: {
      rule: '«Eskertu» aditzak Nor-Nori-Nork eskatzen du pertsona bati zerbait eskertzean: nik zuri laguntza eskertzen dizut.',
      whyCorrect: '«Eskertzen dizut» (te lo agradezco: laguntza zuri).',
      whyWrongOptions: [
        { letter: 'B', reason: '«eskertzen zaitut» gaztelaniazko «te agradezco» kalkatzearen akatsa da (Nor-Nork bihurtuz).' },
        { letter: 'C', reason: '«eskertzen naiz» nor da.' },
        { letter: 'D', reason: '«eskertzen dut» datiborik gabe doa («eskertzen dut laguntza», baina hartzailea zuri denean «dizut» behar du).' }
      ],
      tip: 'Zuri eskertzen dizut (NOR-NORI-NORK), ez zaitut eskertzen!'
    }
  },
  {
    id: 'ast-65',
    day: 'osteguna',
    order: 5,
    prompt: '..... ez dago arazorik plan horrekin jarraitzeko.',
    options: [
      'Nire aldetik',
      'Nire partetik',
      'Nire alderantziz',
      'Nire partetikako'
    ],
    correctIndex: 0,
    category: 'Akats Ohikoenak eta Kalkoak',
    level: 'B1',
    explanation: {
      rule: 'Gaztelaniazko «por mi parte» kalkoa saihesteko, euskaraz «nire aldetik» esan behar da.',
      whyCorrect: '«Nire aldetik» adierazpide jator eta garbia da.',
      whyWrongOptions: [
        { letter: 'B', reason: '«nire partetik» erdarazko «por mi parte» kalko zuzena da, saihestekoa.' },
        { letter: 'C', reason: '«alderantziz» al reves esan nahi du.' },
        { letter: 'D', reason: '«partetikako» asmatutako forma da.' }
      ],
      tip: '«Nire aldetik», «zure aldetik» (ez esan «nire partetik»).'
    }
  },
  {
    id: 'ast-66',
    day: 'osteguna',
    order: 6,
    prompt: 'Gaur goizean oso berandu ..... ohetik.',
    options: [
      'jaiki naiz',
      'altxatu naiz',
      'jaiki egin dut',
      'esnatu naiz ohetik'
    ],
    correctIndex: 0,
    category: 'Akats Ohikoenak eta Kalkoak',
    level: 'B1',
    explanation: {
      rule: 'Ohetik zutitzean «jaiki» erabiltzen da; «altxatu» pisu bat edo eskua gorantz igotzea da nagusiki, nahiz eta mendebaldean erabili, «jaiki» da euskara aberatsean hobetsia.',
      whyCorrect: '«Jaiki naiz» da ohetik altxatzea adierazteko euskal aditz egokiena.',
      whyWrongOptions: [
        { letter: 'B', reason: '«altxatu» erabili ohi bada ere, ohetik jaikitzea berez «jaiki» da.' },
        { letter: 'C', reason: '«jaiki» ez da iragankorra (ez da «dut», «naiz» baizik).' },
        { letter: 'D', reason: '«esnatu ohetik» ez dator bat esanahiarekin (esnatu begiak irekitzea da).' }
      ],
      tip: 'Esnatu (begiak ireki), jaiki (ohetik altxatu).'
    }
  },
  {
    id: 'ast-67',
    day: 'osteguna',
    order: 7,
    prompt: 'Gurasoek seme-alabei ..... esan diete.',
    options: [
      'etxera etortzeko',
      'etxera etorri daitezela',
      'etxera etorri zitezela',
      'etxera etor daitezen'
    ],
    correctIndex: 0,
    category: 'Akats Ohikoenak eta Kalkoak',
    level: 'B2',
    explanation: {
      rule: 'Zeharkako agindua emateko biderik arruntena eta jatorrena «-T(Z)EKO» atzizkia da: «etxera etortzeko esan diete».',
      whyCorrect: '«Etortzeko esan diete» da euskara natural eta egokiena.',
      whyWrongOptions: [
        { letter: 'B', reason: 'Subjuntibozko egitura («etor daitezela») ulergarria bada ere, askoz artifizialagoa da «-tzeko» baino.' },
        { letter: 'C', reason: '«zitezela» iraganeko subjuntiboa da, baina aditz nagusia orainaldian dago («esan diete»).' },
        { letter: 'D', reason: 'Zeharkako aginduak «-(e)la» behar du, ez «-(e)n».' }
      ],
      tip: 'Aginduak zeharka emateko: aditzoina + «-tzeko esan».'
    }
  },
  {
    id: 'ast-68',
    day: 'osteguna',
    order: 8,
    prompt: 'Hemen gaude denok, inor ez da falta, ..... prest gaude.',
    options: [
      'denak',
      'guztiak',
      'guzti',
      'oro'
    ],
    correctIndex: 0,
    category: 'Akats Ohikoenak eta Kalkoak',
    level: 'B2',
    explanation: {
      rule: 'Izenordain huts gisa (pertsonei erreferentzia eginez, izenik gabe: «todos» zentzuan) «denak» erabiltzen da; «guztiak» izen baten ondoren doa gehienetan («ikasle guztiak»).',
      whyCorrect: '«Denak prest gaude» edo «denok prest gaude» forma jatorra da bakarrik doanean.',
      whyWrongOptions: [
        { letter: 'B', reason: '«guztiak» izen baten ondoan joan ohi da determinatzaile gisa.' },
        { letter: 'C', reason: '«guzti» mugagabea osatugabe dago hemen.' },
        { letter: 'D', reason: '«oro» literarioa da eta ez da normalean horrela txertatzen.' }
      ],
      tip: 'Bakarrik badago: denak / denok. Izen baten ondoan: lagun guztiak.'
    }
  },
  {
    id: 'ast-69',
    day: 'osteguna',
    order: 9,
    prompt: 'Gaia sakon aztertu ondoren, ..... adierazi zuen.',
    options: [
      'bere iritzia',
      'bere ustetan',
      'beraren partez',
      'bere ustezko'
    ],
    correctIndex: 0,
    category: 'Akats Ohikoenak eta Kalkoak',
    level: 'B2',
    explanation: {
      rule: '«Adierazi» aditzak zerbait (izen sintagma absolutiboa) eskatzen du: «bere iritzia adierazi zuen».',
      whyCorrect: '«Bere iritzia adierazi zuen» (expresó su opinión).',
      whyWrongOptions: [
        { letter: 'B', reason: '«bere ustetan» adberbiala da («a su parecer»), ezin da adierazi aditzaren objektua izan.' },
        { letter: 'C', reason: '«beraren partez» beste pertsona baten ordez esan nahi du.' },
        { letter: 'D', reason: '«bere ustezko» izenlaguna da («su supuesto»).' }
      ],
      tip: 'Iritzia eman / adierazi. Nire ustez / Nire iritzian.'
    }
  },
  {
    id: 'ast-70',
    day: 'osteguna',
    order: 10,
    prompt: 'Kasu honetan, ez dut uste ..... denik.',
    options: [
      'posible',
      'litekeena',
      'posiblea',
      'ahal'
    ],
    correctIndex: 1,
    category: 'Akats Ohikoenak eta Kalkoak',
    level: 'B2',
    explanation: {
      rule: 'Gaztelaniazko «es posible» ordez, euskaraz «litekeena da» edo «bideragarria da» erabiltzea gomendatzen da.',
      whyCorrect: '«Ez dut uste litekeena denik» euskara aberats eta egokia da.',
      whyWrongOptions: [
        { letter: 'A', reason: '«posible» erdipurdiko mailegua da («no creo que sea posible»), euskara jatorrean «litekeena».' },
        { letter: 'C', reason: '«posiblea» artikuludun mailegu baldarra da.' },
        { letter: 'D', reason: '«ahal» aditz laguntzaileekin erabiltzen da («egin ahal da»), ez «denik»-ekin.' }
      ],
      tip: '«Es posible» -> «Litekeena da / Posible da baino askoz hobea».'
    }
  },
  {
    id: 'ast-71',
    day: 'osteguna',
    order: 11,
    prompt: 'Bidaia luzea izan da, baina azkenean .....',
    options: [
      'heldu gara',
      'iritsi egin dugu',
      'heldu dugu',
      'ailegatuta dugu'
    ],
    correctIndex: 0,
    category: 'Akats Ohikoenak eta Kalkoak',
    level: 'B1',
    explanation: {
      rule: '«Heldu» eta «iritsi» aditzak NOR motakoak dira (intransitiboak): gu heldu gara.',
      whyCorrect: '«Heldu gara» da forma zuzena.',
      whyWrongOptions: [
        { letter: 'B', reason: '«iritsi egin dugu» okerra da, «dugu» erabiliz gero (nork eskatzen du).' },
        { letter: 'C', reason: '«heldu dugu» kalko larria da.' },
        { letter: 'D', reason: '«ailegatuta dugu» okerra da.' }
      ],
      tip: 'Gu heldu gara / Gu iritsi gara (beti NOR, inoiz ez NORK!).'
    }
  },
  {
    id: 'ast-72',
    day: 'osteguna',
    order: 12,
    prompt: 'Horri buruz gehiago jakiteko, ..... ikertu behar dugu.',
    options: [
      'sakonki',
      'sakonean',
      'sakon',
      'sakonkiro'
    ],
    correctIndex: 2,
    category: 'Akats Ohikoenak eta Kalkoak',
    level: 'B2',
    explanation: {
      rule: 'Euskaraz adjektibo hutsa adberbio gisa erabili ohi da maiz («sakon ikertu»), gaztelaniazko «-mente» kalkatzen duten «-ki» luzapenak alferrikakoak direnean.',
      whyCorrect: '«Sakon ikertu» euskara jator eta dotorea da.',
      whyWrongOptions: [
        { letter: 'A', reason: '«sakonki» erabilgarria den arren, «sakon» soilik erabiliz askoz estilo garbiagoa lortzen da.' },
        { letter: 'B', reason: '«sakonean» inesiboa da (en el fondo).' },
        { letter: 'D', reason: '«sakonkiro» asmatua da.' }
      ],
      tip: '«Gogor lan egin», «arretaz entzun», «sakon aztertu».'
    }
  },
  {
    id: 'ast-73',
    day: 'osteguna',
    order: 13,
    prompt: 'Ez duzu hori esan behar, ..... oso minduta sentituko da.',
    options: [
      'bestela',
      'kontrakoan',
      'beste aldean',
      'ezbada'
    ],
    correctIndex: 0,
    category: 'Akats Ohikoenak eta Kalkoak',
    level: 'B1',
    explanation: {
      rule: 'Gaztelaniazko «si no / de lo contrario» adierazteko euskal lokuzio estandarra «bestela» da.',
      whyCorrect: '«Bestela» (de lo contrario / si no) da hitz egokiena.',
      whyWrongOptions: [
        { letter: 'B', reason: '«kontrakoan» gaztelaniazko «en caso contrario» kalko artifiziala da.' },
        { letter: 'C', reason: '«beste aldean» leku fisikoa da (en el otro lado).' },
        { letter: 'D', reason: '«ezbada» zaharkitua edo dialektala da testuinguru honetan.' }
      ],
      tip: 'Etorri garaiz, bestela trena galduko dugu!'
    }
  },
  {
    id: 'ast-74',
    day: 'osteguna',
    order: 14,
    prompt: 'Txakur horrek oso jarrera beldurgarria du; nik ..... diot.',
    options: [
      'beldur handia',
      'beldur handia ematen',
      'beldurra edukitzen',
      'beldurtuta'
    ],
    correctIndex: 0,
    category: 'Akats Ohikoenak eta Kalkoak',
    level: 'B2',
    explanation: {
      rule: 'Euskaraz «beldurra izan» (NOR-NORI-NORK) erabiltzen da: nik txakurrari beldurra diot («le tengo miedo»).',
      whyCorrect: '«Nik beldur handia diot» (le tengo mucho miedo al perro).',
      whyWrongOptions: [
        { letter: 'B', reason: 'Txakurrak niri beldurra ematen balit «dit» litzateke, baina subjektua «nik» da eta aditza «diot».' },
        { letter: 'C', reason: '«beldurra eduki» gaztelaniazko «tener miedo» kalko desegokia da.' },
        { letter: 'D', reason: '«beldurtuta» partizipioa da.' }
      ],
      tip: 'Nik hari beldurra diot (tengo miedo de él/ella).'
    }
  },
  {
    id: 'ast-75',
    day: 'osteguna',
    order: 15,
    prompt: 'Kritika gogorrak entzun arren, ..... eutsi zion bere asmoari.',
    options: [
      'tinko',
      'tinkoki',
      'tinkoan',
      'tinkoz'
    ],
    correctIndex: 0,
    category: 'Akats Ohikoenak eta Kalkoak',
    level: 'B2',
    explanation: {
      rule: '«Tinko eutsi» da esapide jatorra (firmemente mantendirse). Adjektiboak adberbio lana egiten du zuzenean.',
      whyCorrect: '«Tinko eutsi zion» da molde egokia.',
      whyWrongOptions: [
        { letter: 'B', reason: '«tinkoki» ez da beharrezkoa «tinko» aski delako.' },
        { letter: 'C', reason: '«tinkoan» ez da existitzen.' },
        { letter: 'D', reason: '«tinkoz» okerra da.' }
      ],
      tip: 'Tinko eutsi (mantenerse firme).'
    }
  },
  {
    id: 'ast-76',
    day: 'osteguna',
    order: 16,
    prompt: 'Hori ez da arazo larria, niretzat ..... hutsa da.',
    options: [
      'txikikeria',
      'txikitasun',
      'txikikeri',
      'txikiro'
    ],
    correctIndex: 0,
    category: 'Akats Ohikoenak eta Kalkoak',
    level: 'B2',
    explanation: {
      rule: 'Garrantzirik gabeko gauzei «txikikeria» (nadería, fruslería) deritze euskaraz.',
      whyCorrect: '«Txikikeria hutsa da» esapide jatorra da.',
      whyWrongOptions: [
        { letter: 'B', reason: '«txikitasun» tamaina txikia izatearen kualitatea da (pequeñez física).' },
        { letter: 'C', reason: 'Artikulua falta zaio («-a»).' },
        { letter: 'D', reason: '«txikiro» ez da existitzen.' }
      ],
      tip: 'Txikikeria = garrantzi gabeko gauza.'
    }
  },
  {
    id: 'ast-77',
    day: 'osteguna',
    order: 17,
    prompt: 'Ikasle guztiek beren lanak garaiz ..... behar dituzte.',
    options: [
      'aurkeztu',
      'aurkezten',
      'aurkeztera',
      'aurkeztuak'
    ],
    correctIndex: 0,
    category: 'Akats Ohikoenak eta Kalkoak',
    level: 'B1',
    explanation: {
      rule: '«Behar izan» aditzak aditzoin partizipioa hartzen du aurretik: «aurkeztu behar dituzte».',
      whyCorrect: '«Aurkeztu behar dituzte» da egitura arautua.',
      whyWrongOptions: [
        { letter: 'B', reason: '«aurkezten behar dituzte» okerra da, ez du ez-buruturik hartzen.' },
        { letter: 'C', reason: '«aurkeztera» ez da behar izanekin lotzen.' },
        { letter: 'D', reason: '«aurkeztuak» partizipio pasiboa da.' }
      ],
      tip: 'Egin behar dut / Erosi behar dugu / Joan behar gara.'
    }
  },
  {
    id: 'ast-78',
    day: 'osteguna',
    order: 18,
    prompt: 'Lanpostu horretarako bi urteko esperientzia .....',
    options: [
      'eskatzen da',
      'eskatzen dute',
      'eskatzen zaio',
      'behar da'
    ],
    correctIndex: 1,
    category: 'Akats Ohikoenak eta Kalkoak',
    level: 'B2',
    explanation: {
      rule: 'Gaztelaniazko pasiba erreflexua («se pide experiencia») euskaraz pertsona pluralaren bidez eman ohi da: «esperientzia eskatzen dute».',
      whyCorrect: '«Esperientzia eskatzen dute» da euskara natural eta gomendatua enpresa/erakunde bati buruz aritzean.',
      whyWrongOptions: [
        { letter: 'A', reason: '«eskatzen da» kalko pasiboa da, euskara tradizioan desegokia.' },
        { letter: 'C', reason: '«eskatzen zaio» datibo singularrarekin ez da testuinguru orokorrerako.' },
        { letter: 'D', reason: '«behar da» ez du adierazten nork eskatzen duen.' }
      ],
      tip: '«Se busca piso» -> «Pisua bilatzen dute / dabil» (saihestu pasiba artifizialak).'
    }
  },
  {
    id: 'ast-79',
    day: 'osteguna',
    order: 19,
    prompt: 'Ez du zentzurik gai horri buruz ..... hastea.',
    options: [
      'eztabaidan',
      'eztabaidatzen',
      'eztabaidarekin',
      'eztabaidaz'
    ],
    correctIndex: 0,
    category: 'Akats Ohikoenak eta Kalkoak',
    level: 'B2',
    explanation: {
      rule: 'Ekintza batean hastea adierazteko «-n hasi» egitura erabiltzen da izenarekin: «eztabaidan hasi», «solasean hasi».',
      whyCorrect: '«Eztabaidan hastea» da esapide jatorra.',
      whyWrongOptions: [
        { letter: 'B', reason: '«eztabaidatzen hastea» baino naturalagoa da «eztabaidan hasi» lokuzioa.' },
        { letter: 'C', reason: '«eztabaidarekin» ez dator bat hasi aditzarekin.' },
        { letter: 'D', reason: '«eztabaidaz» instrumentala da.' }
      ],
      tip: 'Jolasean hasi, dantzan hasi, eztabaidan hasi.'
    }
  },
  {
    id: 'ast-80',
    day: 'osteguna',
    order: 20,
    prompt: 'Istripu larria gertatu zen, baina ..... inor ez zen zauritu.',
    options: [
      'zorionez',
      'zorioarekin',
      'zoriontsuki',
      'zorionaz'
    ],
    correctIndex: 0,
    category: 'Akats Ohikoenak eta Kalkoak',
    level: 'B1',
    explanation: {
      rule: '«Afortunadamente / por suerte» esateko euskal esapide egokia «zorionez» da (instrumentalean).',
      whyCorrect: '«Zorionez» (por fortuna, por suerte).',
      whyWrongOptions: [
        { letter: 'B', reason: '«zorioarekin» ez da existitzen.' },
        { letter: 'C', reason: '«zoriontsuki» zoriontsu bizitzearekin lotuta dago, ez gertaera baten zortearekin.' },
        { letter: 'D', reason: '«zorionaz» ez da erabiltzen adberbio gisa.' }
      ],
      tip: 'Zorionez (por suerte) vs Zoritxarrez (por desgracia).'
    }
  }
];
