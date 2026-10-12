import { Question } from '../types';

export const ostiralaQuestions: Question[] = [
  {
    id: 'ast-81',
    day: 'ostirala',
    order: 1,
    prompt: 'Sekulako hanka sartzea egin duzu, benetan .....',
    options: [
      'hanka sartu duzu',
      'hanka hautsi duzu',
      'eskua sartu duzu',
      'burua galdu duzu'
    ],
    correctIndex: 0,
    category: 'Esapideak eta Lokuzioak',
    level: 'B1',
    explanation: {
      rule: 'Akats nabarmen bat egitean «hanka sartu» lokuzioa erabiltzen da (meter la pata).',
      whyCorrect: '«Hanka sartu duzu» da akats larria egitea adierazten duen esapide ezaguna.',
      whyWrongOptions: [
        { letter: 'B', reason: '«hanka hautsi» lesio fisikoa da.' },
        { letter: 'C', reason: '«eskua sartu» ez da akatsa adierazteko euskal lokuzioa.' },
        { letter: 'D', reason: '«burua galdu» zoratzea edo zentzua galtzea da.' }
      ],
      tip: 'Hanka sartu = akats handia egin.'
    }
  },
  {
    id: 'ast-82',
    day: 'ostirala',
    order: 2,
    prompt: 'Ez iezaiozu jaramonik egin, ..... ari zaizu eta!',
    options: [
      'adarra jotzen',
      'adarra mozten',
      'adarra ematen',
      'adarra hartzen'
    ],
    correctIndex: 0,
    category: 'Esapideak eta Lokuzioak',
    level: 'B1',
    explanation: {
      rule: 'Norbaiti adarra jotzea (tomar el pelo) adierazteko «adarra jo» erabiltzen da (nori adarra jo).',
      whyCorrect: '«Adarra jotzen ari zaizu» da adierazpide zuzena.',
      whyWrongOptions: [
        { letter: 'B', reason: '«adarra moztu» ez da txantxetan aritzea.' },
        { letter: 'C', reason: '«adarra eman» ez da existitzen zentzu honetan.' },
        { letter: 'D', reason: '«adarra hartu» gaztelaniazko «tomar el pelo» kalkatutako nahastea da.' }
      ],
      tip: 'Nori adarra jo = norbaiti ziria sartu, norbaitekin txantxetan ibili.'
    }
  },
  {
    id: 'ast-83',
    day: 'ostirala',
    order: 3,
    prompt: 'Ikasketetan ..... dabil azterketak gainditzeko.',
    options: [
      'buru-belarri',
      'hanka-lepo',
      'begi-bistako',
      'aho-zabalik'
    ],
    correctIndex: 0,
    category: 'Esapideak eta Lokuzioak',
    level: 'B2',
    explanation: {
      rule: 'Eginkizun batean arreta eta ahalegin osoz aritzea adierazteko «buru-belarri ibili / aritu» esaten da.',
      whyCorrect: '«Buru-belarri dabil» (está volcado/a en los estudios).',
      whyWrongOptions: [
        { letter: 'B', reason: '«hanka-lepo» erortzearekin lotzen da (erori, irauli).' },
        { letter: 'C', reason: '«begi-bistako» agerikoa esan nahi du (evidente).' },
        { letter: 'D', reason: '«aho-zabalik» harrituta geratzea da (boquiabierto).' }
      ],
      tip: 'Buru-belarri aritu = buru-bihotzez, gogor lan eginez.'
    }
  },
  {
    id: 'ast-84',
    day: 'ostirala',
    order: 4,
    prompt: 'Bizilagunak ..... hartu nau eta ez dit agurtu ere egiten.',
    options: [
      'begitan',
      'begian',
      'begiz',
      'begietan'
    ],
    correctIndex: 0,
    category: 'Esapideak eta Lokuzioak',
    level: 'B2',
    explanation: {
      rule: 'Norbaitekin ezinikusia edo herra izatean «begitan hartu» lokuzioa erabiltzen da (coger manía a alguien).',
      whyCorrect: '«Begitan hartu nau» (me ha tomado manía).',
      whyWrongOptions: [
        { letter: 'B', reason: '«begian» anatomikoa litzateke.' },
        { letter: 'C', reason: '«begiz» begiz ikusi edo begiz jo da.' },
        { letter: 'D', reason: '«begietan» ez da erabiltzen esapide honetan.' }
      ],
      tip: 'Norbait begitan hartu = norbaiti higuina edo gorrotoa hartu.'
    }
  },
  {
    id: 'ast-85',
    day: 'ostirala',
    order: 5,
    prompt: 'Aspaldiko lagunak kafetegian elkartu eta ..... aritu ziren ordu luzez.',
    options: [
      'hitz eta pitz',
      'hitzetik hortzera',
      'hitz lauetan',
      'hitz erdika'
    ],
    correctIndex: 0,
    category: 'Esapideak eta Lokuzioak',
    level: 'B2',
    explanation: {
      rule: 'Gogoz, etengabe eta atseginez hizketan aritzea adierazteko «hitz eta pitz» bikotea erabiltzen da.',
      whyCorrect: '«Hitz eta pitz aritu ziren» (estuvieron dándole a la lengua animadamente).',
      whyWrongOptions: [
        { letter: 'B', reason: '«hitzetik hortzera» berehala, uneoro edo bat-batean esan nahi du («hitzetik hortzera erantzun zuen»).' },
        { letter: 'C', reason: '«hitz lauetan» argi eta garbi esan nahi du (en pocas palabras).' },
        { letter: 'D', reason: '«hitz erdika» sekretupean edo osatu gabe mintzatzea da.' }
      ],
      tip: 'Hitz eta pitz = berriketan gustura aritzea.'
    }
  },
  {
    id: 'ast-86',
    day: 'ostirala',
    order: 6,
    prompt: 'Albiste txarra entzun zuenean, guztiz ..... geratu zen.',
    options: [
      'aho zabalik',
      'begi onez',
      'eskutik eskura',
      'hitz bitan'
    ],
    correctIndex: 0,
    category: 'Esapideak eta Lokuzioak',
    level: 'B1',
    explanation: {
      rule: 'Harrituta eta txundituta geratzea adierazteko «aho zabalik geratu» esaten da.',
      whyCorrect: '«Aho zabalik geratu zen» (se quedó boquiabierto/a).',
      whyWrongOptions: [
        { letter: 'B', reason: '«begi onez» oniritziarekin ikustea da («begi onez ikusi dute egitasmoa»).' },
        { letter: 'C', reason: '«eskutik eskura» pertsona batetik bestera pasatzea da.' },
        { letter: 'D', reason: '«hitz bitan» laburki esatea da.' }
      ],
      tip: 'Aho zabalik = harrituta, txundituta.'
    }
  },
  {
    id: 'ast-87',
    day: 'ostirala',
    order: 7,
    prompt: 'Ezkutuko sekretua kontatu duzu eta azkenean .....',
    options: [
      'katua zakutik atera da',
      'zakua hautsi da',
      'hanka sartu da',
      'haria galdu da'
    ],
    correctIndex: 0,
    category: 'Esapideak eta Lokuzioak',
    level: 'B2',
    explanation: {
      rule: 'Ezkutuan zegoen zerbait agerian geratzean «katua zakutik atera» (descubrirse el pastel) esapidea erabiltzen da.',
      whyCorrect: '«Katua zakutik atera da» (se ha descubierto todo el misterio).',
      whyWrongOptions: [
        { letter: 'B', reason: '«zakua hautsi da» ez da sekretuarekin lotzen.' },
        { letter: 'C', reason: 'Gramatikalki osatugabea da.' },
        { letter: 'D', reason: '«haria galdu» diskurtsoaren ardatza ahaztea da.' }
      ],
      tip: 'Katua zakutik atera = sekretua argitara eman.'
    }
  },
  {
    id: 'ast-88',
    day: 'ostirala',
    order: 8,
    prompt: 'Ez du ezer ulertu nahi, ..... sartu zaio eta ez dago aldatzerik.',
    options: [
      'buruan',
      'buru gabe',
      'begi artean',
      'esku artean'
    ],
    correctIndex: 0,
    category: 'Esapideak eta Lokuzioak',
    level: 'B1',
    explanation: {
      rule: 'Ideia edo kasketaldi bat temati hartzean «buruan sartu zaio» esaten da (se le ha metido en la cabeza).',
      whyCorrect: '«Buruan sartu zaio» da adierazpide zuzena.',
      whyWrongOptions: [
        { letter: 'B', reason: '«buru gabe» arrapaladan aritzea da.' },
        { letter: 'C', reason: '«begi artean» begitan hartzearekin nahas daiteke.' },
        { letter: 'D', reason: '«esku artean» unean lantzen ari garen zerbait da.' }
      ],
      tip: 'Buruan sartu = tema hartu, ekin eta ekin pentsatu.'
    }
  },
  {
    id: 'ast-89',
    day: 'ostirala',
    order: 9,
    prompt: 'Goazen lehenbailehen, trena ..... dugu eta!',
    options: [
      'galtzear',
      'galduz',
      'galdukoan',
      'galzorian'
    ],
    correctIndex: 0,
    category: 'Esapideak eta Lokuzioak',
    level: 'B2',
    explanation: {
      rule: 'Ekintza bat gertatzeko zorian dagoela adierazteko «aditzoina + -ZEAR» lokuzioa erabiltzen da: «galtzear dugu», «irtetear da».',
      whyCorrect: '«Galtzear dugu» (a punto de perderlo).',
      whyWrongOptions: [
        { letter: 'B', reason: '«galduz» instrumentala da.' },
        { letter: 'C', reason: '«galdukoan» denborazkoa litzateke.' },
        { letter: 'D', reason: '«galzorian» arriskuan egotea da (en peligro de extinción/desaparición).' }
      ],
      tip: 'Aditzoina + -zear = zerbait gertatzear dagoenean (a punto de).'
    }
  },
  {
    id: 'ast-90',
    day: 'ostirala',
    order: 10,
    prompt: 'Nire aitona beti ..... aritzen da, ezin da geldirik egon.',
    options: [
      'hona eta hara',
      'honaino eta haraino',
      'hemendik eta handik',
      'hona hemen'
    ],
    correctIndex: 0,
    category: 'Esapideak eta Lokuzioak',
    level: 'B1',
    explanation: {
      rule: 'Leku batetik bestera etengabe mugitzen aritzea adierazteko «hona eta hara» (de aquí para allá) erabiltzen da.',
      whyCorrect: '«Hona eta hara aritzen da» da bikote adberbial ohikoena.',
      whyWrongOptions: [
        { letter: 'B', reason: 'Mugak adierazten ditu, ez etengabeko mugimendua.' },
        { letter: 'C', reason: '«hemendik eta handik» jatorria da («hartu du materiala»).' },
        { letter: 'D', reason: '«hona hemen» he aquí esan nahi du.' }
      ],
      tip: 'Hona eta hara = alde batera eta bestera mugituz.'
    }
  },
  {
    id: 'ast-91',
    day: 'ostirala',
    order: 11,
    prompt: 'Berak esandako guztiak ..... zituen, ez zuen gezurrik esan.',
    options: [
      'oinarri sendoak',
      'oinarri arinak',
      'oinarri gabekoak',
      'oinarri hutsak'
    ],
    correctIndex: 0,
    category: 'Esapideak eta Lokuzioak',
    level: 'B2',
    explanation: {
      rule: 'Zerbait ondo funtsatuta eta arrazoituta dagoenean «oinarri sendoak izan» esaten da.',
      whyCorrect: '«Oinarri sendoak zituen» (tenía fundamentos sólidos).',
      whyWrongOptions: [
        { letter: 'B', reason: '«oinarri arinak» esanahia ahultzen du.' },
        { letter: 'C', reason: '«oinarri gabekoak» funtsik gabekoak litzateke (kontrakoa).' },
        { letter: 'D', reason: '«oinarri hutsak» oinarri faltsuak litzateke.' }
      ],
      tip: 'Oinarri sendoak = funtsa, arrazoi sendoak.'
    }
  },
  {
    id: 'ast-92',
    day: 'ostirala',
    order: 12,
    prompt: 'Ez izan hain kexatia, ..... arazo bat sortzen duzu eta.',
    options: [
      'ezerezetik',
      'inondik ere',
      'besterik gabe',
      'inor gabe'
    ],
    correctIndex: 0,
    category: 'Esapideak eta Lokuzioak',
    level: 'B2',
    explanation: {
      rule: 'Arrazoirik gabe edo gauza hutsal batetik zerbait sortzea adierazteko «ezerezetik» esaten da (de la nada).',
      whyCorrect: '«Ezerezetik arazo bat sortzen duzu» esaldi naturala da.',
      whyWrongOptions: [
        { letter: 'B', reason: '«inondik ere» ezezko indargarria da («inondik ere ez»).' },
        { letter: 'C', reason: '«besterik gabe» sin más esan nahi du.' },
        { letter: 'D', reason: '«inor gabe» pertsonekin da (sin nadie).' }
      ],
      tip: 'Ezerezetik atera = ezerezetik sortu.'
    }
  },
  {
    id: 'ast-93',
    day: 'ostirala',
    order: 13,
    prompt: 'Nahi duzun bezala egin, niri .....',
    options: [
      'bost axola zait',
      'sei axola zait',
      'bost inporta zait',
      'axola gutxi dut'
    ],
    correctIndex: 0,
    category: 'Esapideak eta Lokuzioak',
    level: 'B1',
    explanation: {
      rule: 'Guztiz axolagabea zaizunean «bost axola zait / bost axola zait niri» esapide adierazkorra erabiltzen da (me importa un comino).',
      whyCorrect: '«Bost axola zait» euskal lokuzio oso erabilia eta jatorra da.',
      whyWrongOptions: [
        { letter: 'B', reason: '«sei axola» ez da erabiltzen (zenbakia bost da tradizioan).' },
        { letter: 'C', reason: '«inporta» ordez «axola izan» hobesten da euskara garbian.' },
        { letter: 'D', reason: 'Aditzaren egitura okerra da (axola izan NOR-NORI da: niri axola zait).' }
      ],
      tip: 'Bost axola zait! (Me da igual / No me importa en absoluto).'
    }
  },
  {
    id: 'ast-94',
    day: 'ostirala',
    order: 14,
    prompt: 'Etsita zegoenean, lagunaren hitzek berriro ..... eman zioten.',
    options: [
      'arnasa',
      'begia',
      'eskua',
      'oina'
    ],
    correctIndex: 0,
    category: 'Esapideak eta Lokuzioak',
    level: 'B2',
    explanation: {
      rule: 'Norbaitean itxaropena, lasaitasuna edo suspertzea eragiteko «arnasa eman» erabiltzen da (dar un respiro / dar ánimos).',
      whyCorrect: '«Berriro arnasa eman zioten» esapide metaforiko ederra da.',
      whyWrongOptions: [
        { letter: 'B', reason: '«begia eman» ez da zentzu honetan existitzen.' },
        { letter: 'C', reason: '«eskua eman» agurtzea edo ezkontzea litzateke.' },
        { letter: 'D', reason: '«oina eman» ez da erabiltzen.' }
      ],
      tip: 'Arnasa hartu (descansar), arnasa eman (aliviar/animar).'
    }
  },
  {
    id: 'ast-95',
    day: 'ostirala',
    order: 15,
    prompt: 'Gauzak lasai hartu behar dira, ..... ez baita ezer lortzen.',
    options: [
      'itolarrian',
      'lasaitasunean',
      'bidean zehar',
      'begi-bistan'
    ],
    correctIndex: 0,
    category: 'Esapideak eta Lokuzioak',
    level: 'B2',
    explanation: {
      rule: 'Estuasun, larritasun eta presa itogarrian egotea adierazteko «itolarrian» erabiltzen da.',
      whyCorrect: '«Itolarrian ez baita ezer lortzen» (en el agobio / con prisas agobiantes).',
      whyWrongOptions: [
        { letter: 'B', reason: '«lasaitasunean» kontrakoa da.' },
        { letter: 'C', reason: 'Ez du adierazten larritasun egoera.' },
        { letter: 'D', reason: '«begi-bistan» ikusgai dagoena da.' }
      ],
      tip: 'Itolarrian ibili = larri, itota eta estu ibili.'
    }
  },
  {
    id: 'ast-96',
    day: 'ostirala',
    order: 16,
    prompt: 'Dena ondo prestatuta daukagu, ..... da kontua.',
    options: [
      'hastea besterik ez',
      'hasi bakarrik',
      'hasteko bakarrik',
      'hasi ezean'
    ],
    correctIndex: 0,
    category: 'Esapideak eta Lokuzioak',
    level: 'B1',
    explanation: {
      rule: 'Gauza bakarra falta dela adierazteko «aditz-izena + besterik ez» formula erabiltzen da: «hastea besterik ez».',
      whyCorrect: '«Hastea besterik ez da kontua» (solo es cuestión de empezar).',
      whyWrongOptions: [
        { letter: 'B', reason: '«hasi bakarrik» baldarra da.' },
        { letter: 'C', reason: '«hasteko bakarrik» para empezar solamemte da.' },
        { letter: 'D', reason: '«hasi ezean» baldintza negatiboa da (si no se empieza).' }
      ],
      tip: 'Zerbait egin besterik ez = sólo queda hacer algo.'
    }
  },
  {
    id: 'ast-97',
    day: 'ostirala',
    order: 17,
    prompt: 'Ume horrek bere ..... ateratzen du beti gurasoekin.',
    options: [
      'nahia',
      'gogoa gabe',
      'nahi izana',
      'nahikaria'
    ],
    correctIndex: 0,
    category: 'Esapideak eta Lokuzioak',
    level: 'B1',
    explanation: {
      rule: 'Norberak nahi duena lortzea adierazteko «norbere nahia atera» esaten da (salirse con la suya).',
      whyCorrect: '«Bere nahia ateratzen du beti» da euskal esapide zuzena.',
      whyWrongOptions: [
        { letter: 'B', reason: '«gogoa gabe» sin ganas esan nahi du.' },
        { letter: 'C', reason: '«nahi izana» ez da esaera honetako hitza.' },
        { letter: 'D', reason: '«nahikaria» kapritxoa da, baina esaera nagusia «nahia atera» da.' }
      ],
      tip: 'Nahia atera = norbere guraria lortu.'
    }
  },
  {
    id: 'ast-98',
    day: 'ostirala',
    order: 18,
    prompt: 'Norbait behin eta berriz gogoratzen dugunean, ..... dugu.',
    options: [
      'gogoan',
      'gogoarekin',
      'gogotik',
      'gogoz'
    ],
    correctIndex: 0,
    category: 'Esapideak eta Lokuzioak',
    level: 'B1',
    explanation: {
      rule: 'Oroitzapenean mantentzea «gogoan izan / gogoan hartu» da.',
      whyCorrect: '«Gogoan dugu» (lo tenemos en mente / lo recordamos).',
      whyWrongOptions: [
        { letter: 'B', reason: '«gogoarekin» con ganas da.' },
        { letter: 'C', reason: '«gogotik» gogor esan nahi du («gogotik lan egin»).' },
        { letter: 'D', reason: '«gogoz» gustura da («gogoz jan»).' }
      ],
      tip: 'Gogoan izan = oroitu. Gogoz egin = gogo handiz egin.'
    }
  },
  {
    id: 'ast-99',
    day: 'ostirala',
    order: 19,
    prompt: 'Lanpostu berrian ..... hasi da eta berehala nabarmendu da.',
    options: [
      'indar betean',
      'indarka',
      'indarrez bakarrik',
      'indarretik'
    ],
    correctIndex: 0,
    category: 'Esapideak eta Lokuzioak',
    level: 'B2',
    explanation: {
      rule: 'Guztizko energiaz eta gaitasun gorenarekin egotea adierazteko «indar betean» erabiltzen da (en plenitud de fuerzas).',
      whyCorrect: '«Indar betean hasi da» esapide egokia da.',
      whyWrongOptions: [
        { letter: 'B', reason: '«indarka» indarrez borrokatzea litzateke.' },
        { letter: 'C', reason: '«indarrez bakarrik» bortxaz litzateke.' },
        { letter: 'D', reason: '«indarretik» ez da existitzen.' }
      ],
      tip: 'Indar betean = indar guztiarekin.'
    }
  },
  {
    id: 'ast-100',
    day: 'ostirala',
    order: 20,
    prompt: 'Euskal esaera zaharra: «Goiz gorri, arrats .....; arrats gorri, goiz .....»',
    options: [
      'euri / garbi',
      'garbi / euri',
      'haize / elur',
      'hotz / bero'
    ],
    correctIndex: 0,
    category: 'Esapideak eta Lokuzioak',
    level: 'B2',
    explanation: {
      rule: 'Euskal eguraldi-atsotitz ezagunena: «Goiz gorri, arrats euri; arrats gorri, goiz garbi».',
      whyCorrect: '«Goiz gorri, arrats euri; arrats gorri, goiz garbi» da esaera zahar osoa eta benetakoa.',
      whyWrongOptions: [
        { letter: 'B', reason: 'Ordena alderantziz jarrita dago.' },
        { letter: 'C', reason: 'Ez dator bat herri esaerarekin.' },
        { letter: 'D', reason: 'Asmatutako hitzak dira.' }
      ],
      tip: 'Goiz gorri -> arrats euri! (Zerua goizean gorritzen bada, arratsaldean euria ekarriko du).'
    }
  }
];
