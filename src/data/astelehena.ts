import { Question } from '../types';

export const astelehenaQuestions: Question[] = [
  {
    id: 'ast-01',
    day: 'astelehena',
    order: 1,
    prompt: '—Zein ordutatik zein ordutara egingo duzu lan? — .....',
    options: [
      'Hiru eta laurdenetik zazpietara.',
      'Zortziak eta hogeitatik bederatzietara.',
      'Hamaikak eta laurdenetatik ordu batera.',
      'Zazpitatik zortziretara.'
    ],
    correctIndex: 1,
    category: 'Denbora eta Orduak',
    level: 'B2',
    explanation: {
      rule: 'Orduak adieraztean, pluraleko deklinabide markak erabili behar dira ordu eta minutuekin: «-etatik» eta «-etara».',
      whyCorrect: '«Zortziak eta hogeitatik bederatzietara» zuzena da, hogei + -tatik -> hogeitatik eta bederatziak + -tara -> bederatzietara ondo deklinatuta baitaude.',
      whyWrongOptions: [
        { letter: 'A', reason: '«Hiru eta laurdenetik» okerra da: mugatu pluralean «laurdenetatik» behar du.' },
        { letter: 'C', reason: 'Ordua adierazteko hitz bakarrean idatzi ohi da («ordubata arte» edo «ordubaterantz»), ez «ordu batera».' },
        { letter: 'D', reason: '«Zazpitatik» ez da existitzen, «zazpietatik» da; eta «zortziretara» okerra da, «zortzietara» behar du.' }
      ],
      tip: 'Gogoratu: orduak pluralean doaz beti (ordu bat salbu): «bietatik bostetara», «zazpietatik zortzietara».'
    }
  },
  {
    id: 'ast-02',
    day: 'astelehena',
    order: 2,
    prompt: 'Bilkura goizeko ..... izango da.',
    options: [
      'hamarretan',
      'hamarretara',
      'hamarretatik',
      'hamarretarako'
    ],
    correctIndex: 0,
    category: 'Denbora eta Orduak',
    level: 'B1',
    explanation: {
      rule: 'Noiz? galderari erantzuteko NON kasua («-etan») erabiltzen da orduetan.',
      whyCorrect: '«Hamarretan» da ekintza gertatuko den momentu zehatza adierazteko era zuzena (noiz?).',
      whyWrongOptions: [
        { letter: 'B', reason: '«-etara» NORA da (norantz/bukaera ordua adierazteko).' },
        { letter: 'C', reason: '«-etatik» NONDIK da (hasiera ordua adierazteko).' },
        { letter: 'D', reason: '«-etarako» muga edo epea adierazteko da («hamarretarako eginda egon behar du»).' }
      ],
      tip: 'Noiz? -> «Hiruetan», «bostetan», «ordubatean».'
    }
  },
  {
    id: 'ast-03',
    day: 'astelehena',
    order: 3,
    prompt: 'Trena ..... helduko da Donostiara.',
    options: [
      'laurak hogei gutxitan',
      'laurak hogei gutxiagotan',
      'laurak eta hogei gutxian',
      'lauretan hogei gutxitan'
    ],
    correctIndex: 0,
    category: 'Denbora eta Orduak',
    level: 'B2',
    explanation: {
      rule: '«Gutxi» duten orduetan, egitura zuzena «ordua + minutuak + gutxitan» da (adibidez: laurak hogei gutxitan).',
      whyCorrect: '«Laurak hogei gutxitan» egitura normatiboa eta naturala da.',
      whyWrongOptions: [
        { letter: 'B', reason: '«gutxiagotan» konparatiboa da, ez orduen esapidea.' },
        { letter: 'C', reason: '«eta» ez da erabiltzen «gutxi» dagoenean («laurak hogei gutxitan»).' },
        { letter: 'D', reason: 'Ordua ez da deklinatzen hasieran («laurak», ez «lauretan»).' }
      ],
      tip: 'Formula: [Ordua mugagabe/artikuluz] + [minutuak] + «gutxitan» (adib. «Bostak hamar gutxitan»).'
    }
  },
  {
    id: 'ast-04',
    day: 'astelehena',
    order: 4,
    prompt: 'Datorren ..... joango gara oporretara.',
    options: [
      'astelehenean',
      'astelehenean zehar',
      'astelehenerakoan',
      'astelehenari'
    ],
    correctIndex: 0,
    category: 'Denbora eta Orduak',
    level: 'B1',
    explanation: {
      rule: 'Asteko egunak noiz adierazteko «-an» atzizkiaz deklinatzen dira.',
      whyCorrect: '«Datorren astelehenean» da forma estandarra.',
      whyWrongOptions: [
        { letter: 'B', reason: '«zehar» gaztelaniazko kalkoa da hemen («a lo largo del lunes» kalkatuz).' },
        { letter: 'C', reason: '«astelehenerakoan» ez da egokia denbora puntu zehatza emateko.' },
        { letter: 'D', reason: '«astelehenari» nori kasua da, ez noiz.' }
      ],
      tip: 'Asteko egunak: astelehenean, asteartean, asteazkenean, ostegunean, ostiralean, larunbatean, igandean.'
    }
  },
  {
    id: 'ast-05',
    day: 'astelehena',
    order: 5,
    prompt: 'Hiru urte ..... itzuli zen bere sorterrira.',
    options: [
      'barruan',
      'buruan',
      'pasa eta gero',
      'ondorenak'
    ],
    correctIndex: 1,
    category: 'Denbora eta Orduak',
    level: 'B2',
    explanation: {
      rule: 'Iraganean igarotako denbora adierazteko «buruan» erabiltzen da; «barru» etorkizunerako da.',
      whyCorrect: '«Hiru urteren buruan» edo «hiru urte buruan» iraganean gertatutako epe baten ondoren adierazteko modu jatorra da.',
      whyWrongOptions: [
        { letter: 'A', reason: '«barru» etorkizunerako da («hiru urte barru itzuliko da»).' },
        { letter: 'C', reason: '«pasa eta gero» kalko arrunta da («tres años después»), euskara jatorrean «hiru urteren buruan».' },
        { letter: 'D', reason: '«ondorenak» ez da hemen erabiltzen.' }
      ],
      tip: 'Etorkizunean: «bi egun barru». Iraganean: «bi egunen buruan».'
    }
  },
  {
    id: 'ast-06',
    day: 'astelehena',
    order: 6,
    prompt: '—Zenbat denbora beharko duzu? — ..... amaituko dut.',
    options: [
      'Ordubete barru',
      'Ordubetean barru',
      'Ordubetekoan',
      'Ordubetetan barru'
    ],
    correctIndex: 0,
    category: 'Denbora eta Orduak',
    level: 'B1',
    explanation: {
      rule: '«Barru» postposizioak izenondo/izen sintagma hutsa hartzen du: «ordubete barru».',
      whyCorrect: '«Ordubete barru» forma zuzena eta arrunta da.',
      whyWrongOptions: [
        { letter: 'B', reason: '«barru»-k ez du inesiborik onartzen («ordubetean barru» okerra da).' },
        { letter: 'C', reason: '«ordubetekoan» ez da denbora epe bat adierazteko egitura.' },
        { letter: 'D', reason: '«ordubetetan» ez da erabiltzen «barru»-rekin.' }
      ],
      tip: '«Ordubete barru», «bi egun barru», «astebete barru».'
    }
  },
  {
    id: 'ast-07',
    day: 'astelehena',
    order: 7,
    prompt: 'Lan hau ..... egin dut, ez dut gehiago behar izan.',
    options: [
      'bi ordutan',
      'bi ordutan zehar',
      'bi orduekin',
      'bi ordura'
    ],
    correctIndex: 0,
    category: 'Denbora eta Orduak',
    level: 'B2',
    explanation: {
      rule: 'Ekintza batek zenbat denbora behar izan duen (iraupena) adierazteko mugagabeko inesiboa erabiltzen da: «bi ordutan».',
      whyCorrect: '«Bi ordutan» da iraupen muga adierazteko forma zuzena (en dos horas).',
      whyWrongOptions: [
        { letter: 'B', reason: '«zehar» alferrikako kalkoa da.' },
        { letter: 'C', reason: '«bi orduekin» soziatiboa da («con dos horas»).' },
        { letter: 'D', reason: '«bi ordura» noiz adierazteko da («bi ordura etorri zen»).' }
      ],
      tip: 'Zenbat denboran? -> «Bi ordutan», «hiru egunetan», «bost minutuan».'
    }
  },
  {
    id: 'ast-08',
    day: 'astelehena',
    order: 8,
    prompt: 'Autobusa goizeko ..... ateratzen da geltokitik.',
    options: [
      'zazpi t\'erdietan',
      'zazpi eta erdietan',
      'zazpi erdietan',
      'zazpiak erdietan'
    ],
    correctIndex: 1,
    category: 'Denbora eta Orduak',
    level: 'B1',
    explanation: {
      rule: 'Euskaltzaindiaren arabera, forma estandarra «[ordua] eta erdietan» idaztea da, apostroforik gabe.',
      whyCorrect: '«Zazpi eta erdietan» arau akademikoaren araberako idazkera egokia da.',
      whyWrongOptions: [
        { letter: 'A', reason: 'Apostrofoa («t\'erdietan») ez da gomendatzen idazkera zainduan.' },
        { letter: 'C', reason: '«eta» juntagailua beharrezkoa da («zazpi eta erdietan»).' },
        { letter: 'D', reason: 'Ordua ez da artikuluz janzten «erdi» aurretik hemen.' }
      ],
      tip: 'Idatzi beti osorik: «hiru eta erdietan», «sei eta erdietan».'
    }
  },
  {
    id: 'ast-09',
    day: 'astelehena',
    order: 9,
    prompt: 'Liburua ..... argitaratu zuten lehen aldiz.',
    options: [
      '1998an',
      '1998 urtean',
      '1998. urtean',
      '1998 urtekoan'
    ],
    correctIndex: 2,
    category: 'Denbora eta Orduak',
    level: 'B1',
    explanation: {
      rule: 'Zenbaki baten atzetik «urtean» hitza badoa, zenbakiari puntua jarri behar zaio (ordinala delako: 1998. urtean).',
      whyCorrect: '«1998. urtean» da idazkera zuzena puntudun zenbakiarekin.',
      whyWrongOptions: [
        { letter: 'A', reason: '«1998an» zuzena litzateke punturik gabe, baina aukeren artean «1998. urtean» dago proposatuta araua ikasteko.' },
        { letter: 'B', reason: 'Puntua falta zaio: «1998 urtean» okerra da, «1998. urtean» behar du.' },
        { letter: 'D', reason: '«1998 urtekoan» ez da data jartzeko forma naturala.' }
      ],
      tip: '«1998an» (punturik gabe) EDO «1998. urtean» (puntuarekin).'
    }
  },
  {
    id: 'ast-10',
    day: 'astelehena',
    order: 10,
    prompt: 'Gaur ..... 15a da, ezta?',
    options: [
      'maiatzak',
      'maiatzaren',
      'maiatzean',
      'maiatzari'
    ],
    correctIndex: 0,
    category: 'Denbora eta Orduak',
    level: 'B1',
    explanation: {
      rule: 'Egutegiko datetan «Gaur [hilabetea]-k [zenbakia] ditu / da» forman, hilabeteak absolutiboa/ergatiboa hartzen du: «Gaur maiatzak 15 ditu / da».',
      whyCorrect: '«Maiatzak 15a da / ditu» da egitura tradizional eta zuzena.',
      whyWrongOptions: [
        { letter: 'B', reason: '«maiatzaren 15a» gaztelaniazko egituraren eragina da («15 de mayo»), euskara zainduan «maiatzak 15».' },
        { letter: 'C', reason: '«maiatzean» inesiboa da (noiz?).' },
        { letter: 'D', reason: '«maiatzari» datiboa da.' }
      ],
      tip: 'Gaur apirilak 4 ditu / da. Gaur urriak 22 da.'
    }
  },
  {
    id: 'ast-11',
    day: 'astelehena',
    order: 11,
    prompt: 'Hitzordua ..... dugu.',
    options: [
      'urriaren 12an',
      'urriak 12an',
      'urriaren 12rako',
      'urriak 12'
    ],
    correctIndex: 0,
    category: 'Denbora eta Orduak',
    level: 'B2',
    explanation: {
      rule: 'Noiz? galderari erantzutean, datetan genitiboa erabiltzen da: «urriaren 12an».',
      whyCorrect: '«Urriaren 12an» noiz galderari dagokio zehazki.',
      whyWrongOptions: [
        { letter: 'B', reason: '«urriak 12an» ezin da nahastu: edo «urriak 12» (zein data da) edo «urriaren 12an» (noiz).' },
        { letter: 'C', reason: '«urriaren 12rako» epe muga da (para el 12), ez hitzorduaren unea.' },
        { letter: 'D', reason: '«urriak 12» data bera da, baina esaldiak NOIZ behar du («hitzordua dugu»).' }
      ],
      tip: 'Zein data da? -> Maiatzak 3. Noiz? -> Maiatzaren 3an.'
    }
  },
  {
    id: 'ast-12',
    day: 'astelehena',
    order: 12,
    prompt: 'Klasea ..... arte luzatu zen.',
    options: [
      'ordubatak',
      'ordubata',
      'ordubatak arte',
      'ordu bata'
    ],
    correctIndex: 1,
    category: 'Denbora eta Orduak',
    level: 'B2',
    explanation: {
      rule: '«Arte» postposizioak izen sintagma mugatu singularrean hartzen du ordu bat denean: «ordubata arte».',
      whyCorrect: '«Ordubata arte» (hitz bakarrean eta artikuluduna) da forma zuzena.',
      whyWrongOptions: [
        { letter: 'A', reason: '«ordubatak» plurala dirudi, baina ordu bat singularra da.' },
        { letter: 'C', reason: '«ordubatak arte» okerra da artikulu pluralarekin.' },
        { letter: 'D', reason: '«ordu bata» bereizita idaztea ez da gomendagarria ordua denean.' }
      ],
      tip: '«Ordubata arte», baina «biak arte», «hirurak arte».'
    }
  },
  {
    id: 'ast-13',
    day: 'astelehena',
    order: 13,
    prompt: 'Azterketa ..... hasiko da.',
    options: [
      'hamabiak laurden gutxitan',
      'hamabietan laurden gutxitan',
      'hamabiak eta laurden gutxitan',
      'hamabietan laurden gutxiago'
    ],
    correctIndex: 0,
    category: 'Denbora eta Orduak',
    level: 'B1',
    explanation: {
      rule: '«Laurden gutxitan» egituran, orduak nominatibo/absolutibo plurala hartzen du («hamabiak»).',
      whyCorrect: '«Hamabiak laurden gutxitan» egitura zuzena da.',
      whyWrongOptions: [
        { letter: 'B', reason: 'Hasierako orduak ez du inesiborik hartzen («hamabiak», ez «hamabietan»).' },
        { letter: 'C', reason: '«eta» ez da erabiltzen «gutxitan» dagoenean.' },
        { letter: 'D', reason: '«gutxiago» ez da erabiltzen orduetan.' }
      ],
      tip: '«Bostak laurden gutxitan», «zortziak hogei gutxitan».'
    }
  },
  {
    id: 'ast-14',
    day: 'astelehena',
    order: 14,
    prompt: 'Duela bi urte ..... bizi nintzen.',
    options: [
      'Gasteizen',
      'Gasteizen zehar',
      'Gasteizetik',
      'Gasteizko'
    ],
    correctIndex: 0,
    category: 'Denbora eta Orduak',
    level: 'B1',
    explanation: {
      rule: '«Duela bi urte» (hace dos años) denbora adierazpidea da, eta ondoren leku inesiboa doa: «Gasteizen».',
      whyCorrect: '«Duela bi urte Gasteizen bizi nintzen» esaldi natural eta zuzena da.',
      whyWrongOptions: [
        { letter: 'B', reason: '«zehar» lekuzkoa hemen ez du zentzurik.' },
        { letter: 'C', reason: '«Gasteizetik» jatorria da, ez egoitza.' },
        { letter: 'D', reason: '«Gasteizko» izenlaguna da.' }
      ],
      tip: '«Duela [denbora]» = «Orain dela [denbora]».'
    }
  },
  {
    id: 'ast-15',
    day: 'astelehena',
    order: 15,
    prompt: 'Nire anaia ..... jaio zen.',
    options: [
      'abenduaren 24an',
      'abenduan 24an',
      'abenduak 24ean',
      'abenduaren 24ean'
    ],
    correctIndex: 0,
    category: 'Denbora eta Orduak',
    level: 'B1',
    explanation: {
      rule: '24 kontsonantez amaitzen denez (lau), «-an» gehitzen zaio: «24an» (hogeita lauan).',
      whyCorrect: '«Abenduaren 24an» guztiz zuzena da fonetikoki eta ortografikoki.',
      whyWrongOptions: [
        { letter: 'B', reason: '«abenduan» inesiboa da, eta ez genitiboa.' },
        { letter: 'C', reason: '«24ean» okerra da, 4 bokalez ez delako amaitzen («hogeita lau» -> «hogeita lauan»).' },
        { letter: 'D', reason: '«24ean» ortografia okerra da.' }
      ],
      tip: '«Lau» -> «lauan» (24an, 14an). «Bat» -> «batean» (31n edo 21ean okerrak saihesteko).'
    }
  },
  {
    id: 'ast-16',
    day: 'astelehena',
    order: 16,
    prompt: 'Biltegia ..... zabaltzen dute.',
    options: [
      'goizeko bederatzietatik aurrera',
      'goizeko bederatzitik aurrera',
      'goizetako bederatzietatik',
      'goizez bederatziak arte'
    ],
    correctIndex: 0,
    category: 'Denbora eta Orduak',
    level: 'B2',
    explanation: {
      rule: 'Bederatziak plurala denez, «bederatzietatik» behar du; «aurrera» postposizioarekin batera.',
      whyCorrect: '«Goizeko bederatzietatik aurrera» da adierazpide egokia.',
      whyWrongOptions: [
        { letter: 'B', reason: '«bederatzitik» singularra da, baina orduak pluralak dira.' },
        { letter: 'C', reason: '«goizetako» ez da naturala hemen.' },
        { letter: 'D', reason: 'Esanahia kontrakoa litzateke («bederatziak arte»).' }
      ],
      tip: '«-etatik aurrera» hasiera une batetik aurrerakoa adierazteko.'
    }
  },
  {
    id: 'ast-17',
    day: 'astelehena',
    order: 17,
    prompt: 'Urtean ..... joaten gara oporretan atzerrira.',
    options: [
      'behin',
      'bat aldiz',
      'bakarrik behin',
      'behin bat'
    ],
    correctIndex: 0,
    category: 'Denbora eta Orduak',
    level: 'B1',
    explanation: {
      rule: 'Maiztasuna adierazteko «behin», «bitan», «hirutan» erabiltzen dira, ez «bat aldiz».',
      whyCorrect: '«Urtean behin» da euskara jatorreko esapidea (una vez al año).',
      whyWrongOptions: [
        { letter: 'B', reason: '«bat aldiz» gaztelaniazko «una vez» kalko desegokia da.' },
        { letter: 'C', reason: 'Hitz ordena ez da egokia.' },
        { letter: 'D', reason: '«behin bat» ez da euskaraz erabiltzen.' }
      ],
      tip: 'Behin, bitan, hirutan, lautan... (ez «bi aldiz»).'
    }
  },
  {
    id: 'ast-18',
    day: 'astelehena',
    order: 18,
    prompt: 'Txangoa ..... atzeratu dute eguraldi txarragatik.',
    options: [
      'hurrengo astera arte',
      'hurrengo asterako',
      'hurrengo astera',
      'hurrengo asteari'
    ],
    correctIndex: 0,
    category: 'Denbora eta Orduak',
    level: 'B2',
    explanation: {
      rule: 'Ekintza bat noiz arte atzeratzen den adierazteko adlatibo mugatua + arte erabiltzen da: «astera arte».',
      whyCorrect: '«Hurrengo astera arte atzeratu dute» esaldi oso eta zuzena da.',
      whyWrongOptions: [
        { letter: 'B', reason: '«asterako» helburua edo epea da, ez atzerapenaren muga.' },
        { letter: 'C', reason: '«astera» bakarrik osatugabe gelditzen da atzeratu aditzarekin.' },
        { letter: 'D', reason: '«asteari» datiboa da.' }
      ],
      tip: '«Noiz arte?» -> «Biharko egunera arte», «hurrengo astera arte».'
    }
  },
  {
    id: 'ast-19',
    day: 'astelehena',
    order: 19,
    prompt: 'Museoa ..... zabalik egoten da astegunetan.',
    options: [
      'goizez eta arratsaldez',
      'goizean eta arratsaldean zehar',
      'goizezko eta arratsaldezko',
      'goizerako eta arratsalderako'
    ],
    correctIndex: 0,
    category: 'Denbora eta Orduak',
    level: 'B1',
    explanation: {
      rule: 'Eguneko zatietan zehar gertatzen diren ohiturak adierazteko moduzko partitiboa/instrumentala («-ez») erabiltzen da: «goizez», «arratsaldez», «gauez».',
      whyCorrect: '«Goizez eta arratsaldez» da ordutegi ohiturak emateko formula klasikoena.',
      whyWrongOptions: [
        { letter: 'B', reason: '«zehar» alferrikako luzapena da.' },
        { letter: 'C', reason: '«goizezko» izenlaguna da, ez adberbioa.' },
        { letter: 'D', reason: '«-erako» etorkizuneko epea da.' }
      ],
      tip: 'Goizez, arratsaldez, gauez (por la mañana, por la tarde, por la noche).'
    }
  },
  {
    id: 'ast-20',
    day: 'astelehena',
    order: 20,
    prompt: 'Auto-ilarak direla eta, ..... heldu gara bilerara.',
    options: [
      'berandu',
      'beranduan',
      'beranduki',
      'beranduz'
    ],
    correctIndex: 0,
    category: 'Denbora eta Orduak',
    level: 'B1',
    explanation: {
      rule: '«Berandu» adberbioa da eta bere horretan erabiltzen da, atzizkirik gabe.',
      whyCorrect: '«Berandu heldu gara» da forma egokia («tarde hemos llegado»).',
      whyWrongOptions: [
        { letter: 'B', reason: '«beranduan» ez da existitzen.' },
        { letter: 'C', reason: '«beranduki» zaharkitua edo dialektala da, ez estandarra.' },
        { letter: 'D', reason: '«beranduz» okerra da.' }
      ],
      tip: 'Goiz vs Berandu (temprano vs tarde).'
    }
  }
];
