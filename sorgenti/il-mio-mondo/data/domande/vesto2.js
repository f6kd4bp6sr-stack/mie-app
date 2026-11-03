/* «Come mi vesto»: colori e taglie — fonti in VESTO2.fonti (verificato: autore + revisore) */
/* Nota taglie: l'etichetta è l'altezza in cm (EN 13402). Se l'altezza cade proprio su un confine tra due taglie, conviene la taglia più grande. */
const VESTO2 = {
  colFacts: [
    ['I tre colori primari', 'Nel cerchio dei colori di Itten i colori primari sono tre: rosso, giallo e blu. Con la pittura non si ottengono mescolando altri colori, e mescolandoli, con l\'aiuto del bianco e del nero, nascono tantissimi altri colori. Pensa a quanti ne puoi inventare con tre soli tubetti!'],
    ['I colori secondari', 'Mescolando due primari nascono i colori secondari: giallo e blu danno il verde, giallo e rosso l\'arancione, rosso e blu il viola. Nel cerchio dei colori stanno tra i due primari che li formano.'],
    ['Colori complementari', 'Sono i colori che stanno uno di fronte all\'altro sul cerchio, come blu e arancione. Vicini si fanno risaltare a vicenda e danno un effetto vivace. Se ti piace un look che si nota, puoi provarli!'],
    ['Colori analoghi', 'Sono i colori vicini sul cerchio, per esempio giallo, giallo arancio e arancione. Messi insieme danno un effetto morbido e armonioso, perché si somigliano. Sono un\'idea facile per un abbinamento che sta bene insieme.'],
    ['Caldi e freddi', 'I colori caldi, come rosso, arancione e giallo, ricordano il fuoco e la luce del sole. I colori freddi, come azzurro, blu e viola, ricordano acqua, cielo e ghiaccio. Ognuno ci dà un\'impressione diversa, ma non c\'è un colore giusto per tutte.'],
    ['Neutri e tono su tono', 'Bianco, nero, grigio e beige sono colori neutri: stanno bene con quasi tutto. Tono su tono vuol dire usare lo stesso colore in versioni più chiare e più scure, per esempio un azzurro chiaro con un blu scuro.'],
    ['La luce bianca è fatta di colori', 'La luce del sole sembra bianca, ma contiene tutti i colori. Dopo un temporale le gocce d\'acqua nell\'aria la separano nei colori dell\'arcobaleno. Con un prisma di vetro puoi vedere la stessa magia in classe o a casa.'],
    ['Il tuo gusto conta', 'Il cerchio dei colori è un aiuto, non una regola da rispettare. Tanti artisti rompono le regole e creano cose bellissime. Prova gli abbinamenti, guarda allo specchio come ti senti e scegli quello che ti fa stare bene.']
  ],

  taglie: [
    { t: '92',  h: [86, 92],   eta: '1,5-2 anni' },
    { t: '98',  h: [92, 98],   eta: '2-3 anni' },
    { t: '104', h: [98, 104],  eta: '3-4 anni' },
    { t: '110', h: [104, 110], eta: '4-5 anni' },
    { t: '116', h: [110, 116], eta: '5-6 anni' },
    { t: '122', h: [116, 122], eta: '6-7 anni' },
    { t: '128', h: [122, 128], eta: '7-8 anni' },
    { t: '134', h: [128, 134], eta: '8-9 anni' },
    { t: '140', h: [134, 140], eta: '9-10 anni' },
    { t: '146', h: [140, 146], eta: '10-11 anni' },
    { t: '152', h: [146, 152], eta: '11-12 anni' },
    { t: '158', h: [152, 158], eta: '12-13 anni' },
    { t: '164', h: [158, 164], eta: '13-14 anni' },
    { t: '170', h: [164, 170], eta: '14-15 anni' },
    { t: '176', h: [170, 176], eta: '15-16 anni' }
  ],

  scarpe: [
    { eu: 28, piede: [17.0, 17.7] },
    { eu: 29, piede: [17.7, 18.3] },
    { eu: 30, piede: [18.3, 19.0] },
    { eu: 31, piede: [19.0, 19.7] },
    { eu: 32, piede: [19.7, 20.3] },
    { eu: 33, piede: [20.3, 21.0] },
    { eu: 34, piede: [21.0, 21.7] },
    { eu: 35, piede: [21.7, 22.3] },
    { eu: 36, piede: [22.3, 23.0] },
    { eu: 37, piede: [23.0, 23.7] },
    { eu: 38, piede: [23.7, 24.3] },
    { eu: 39, piede: [24.3, 25.0] },
    { eu: 40, piede: [25.0, 25.7] },
    { eu: 41, piede: [25.7, 26.3] }
  ],

  margineScarpe: 'Lascia circa 1 cm tra la punta del dito più lungo e la scarpa: il piede si allunga un po\' quando cammini e cresce, e una scarpa troppo piccola può far male. Nella tabella il margine è già compreso: scrivi la misura vera del piede. Se il piede sta tra due numeri, scegli quello più grande. I numeri sono indicativi: ogni marca è un po\' diversa, quindi prova sempre le scarpe, nel pomeriggio e con le calze che userai.',

  sport: [
    { id: 'pattini', ic: '⛸️', n: 'Pattini da ghiaccio',
      come: 'Di solito i pattini da ghiaccio sono un po\' più piccoli delle scarpe di tutti i giorni, ma dipende dalla marca: ogni marca ha la sua tabella delle misure. Non scegliere solo dal numero di scarpa: misura il piede e guarda la tabella della marca, oppure fatti consigliare da chi vende i pattini o dalla tua istruttrice. Se stai crescendo, non comprarli troppo grandi: un pattino largo non tiene il piede e non è sicuro.',
      prova: [
        'Provali con calze sottili, non con calze grosse: cambiano il modo in cui il pattino calza.',
        'In piedi, le dita devono toccare appena la punta, senza piegarsi.',
        'Il tallone deve restare fermo al suo posto, senza sollevarsi quando ti pieghi sulle ginocchia.',
        'Devono essere ben aderenti, ma non devono fare male né far formicolare i piedi. Se fanno male, dillo subito.'
      ] },
    { id: 'aerea', ic: '🎪', n: 'Body per i tessuti aerei',
      come: 'Il body (o l\'abbigliamento) per i tessuti aerei si sceglie sull\'altezza e sulla comodità, e conta più la forma che il numero: dipende dalla marca, quindi provalo. Di solito si indossa un capo aderente al corpo, con le gambe coperte, perché il tessuto non deve incastrarsi e la pelle non deve sfregare. Chiedi alla tua insegnante come vuole che ti vesta per la lezione.',
      prova: [
        'Capelli ben raccolti, senza fermagli rigidi: non devono impigliarsi nel tessuto.',
        'Fai un grande piegamento in avanti e uno all\'indietro: il body non deve tirare né scoprirti.',
        'Alza le gambe e fai uno squat: ginocchia e dietro delle ginocchia coperti, e tutto deve restare al suo posto.',
        'Niente cerniere, bottoni o decorazioni che possono impigliarsi nel tessuto, e niente gioielli.',
        'Le spalline e l\'orlo non devono segnare o dare fastidio sotto le braccia.'
      ] },
    { id: 'nuoto', ic: '🏊', n: 'Costume e cuffia',
      come: 'Per il costume da piscina scegli la taglia dall\'altezza, ma dipende dalla marca: leggi la tabella e provalo. Deve stare aderente e comodo, senza stringere e senza ballare. Vale anche per la cuffia: deve coprire bene i capelli e restare ferma, senza tirare. In caso di dubbio chiedi a chi ti insegna nuoto.',
      prova: [
        'Alza le braccia e fai finta di nuotare: il costume non deve tirare sulle spalle né scivolare.',
        'Accovacciati e piegati in avanti: deve restare al suo posto.',
        'Le spalline non devono segnare la pelle e l\'elastico delle gambe non deve stringere.',
        'Metti la cuffia: deve restare ferma quando muovi la testa, senza fare male alle orecchie.'
      ] },
    { id: 'ginnastica', ic: '👟', n: 'Scarpe e tuta per la ginnastica',
      come: 'Per le scarpe da ginnastica vale la regola di tutte le scarpe: lascia un po\' di spazio davanti alle dita, ma non troppo, perché con una scarpa troppo grande il piede scivola quando corri e salti. La tuta si sceglie sull\'altezza, comoda e senza parti penzolanti. Prova sempre tutto con le calze che userai in palestra.',
      prova: [
        'La suola deve piegarsi con il piede ma non afflosciarsi, e non deve scivolare sul pavimento liscio.',
        'Il tallone deve restare fermo a ogni passo, senza uscire dalla scarpa quando corri o salti.',
        'Allaccia bene la scarpa e fai due saltelli: il piede non deve scivolare in avanti.',
        'La tuta non deve tirare quando ti pieghi, corri o alzi le braccia, né coprirti i piedi o le mani.'
      ] }
  ],

  prova: [
    'Alza le braccia sopra la testa: la maglia non deve tirare né salire troppo sulla pancia.',
    'Accovacciati e rialzati: i pantaloni non devono stringere né scendere.',
    'Le maniche devono arrivare al polso (o poco sotto) quando stendi le braccia.',
    'Il collo deve far passare la testa senza strappi e non deve stringere quando giri la testa.',
    'Il girovita deve stare comodo anche quando ti siedi, senza segnare la pelle.',
    'Cammina e fai due passi di corsa: l\'orlo e i pantaloni non devono impicciarti e le scarpe non devono dare fastidio.',
    'Siediti e piegati in avanti: niente deve tirare dietro la schiena né scoprirti.',
    'Controlla l\'etichetta e leggi cosa dice sul lavaggio: dopo il bucato può restringersi un po\'.'
  ],

  fonti: [
    { t: 'Nostro Figlio: guida alle taglie per bambini (la taglia è l\'altezza in cm; età indicative 98-140)', u: 'https://www.nostrofiglio.it/famiglia/moda-e-bellezza/guida-alle-taglie-per-bambini' },
    { t: 'Size.ly: tabella taglie bambini (intervalli di altezza 92-152 cm con età)', u: 'https://www.size.ly/de/grossentabellen/grossen-umrechnungstabelle-fur-kinder' },
    { t: 'Fred Perry: guida taglie bambini (altezze 134-176 cm per età; conferma 158-176)', u: 'https://www.fredperry.com/size-guides/kids' },
    { t: 'Wikipedia: Joint European standard for size labelling of clothes (EN 13402, altezza in cm come dato principale per i bambini)', u: 'https://en.wikipedia.org/wiki/Joint_European_standard_for_size_labelling_of_clothes' },
    { t: 'Wikipedia: Shoe size (punto Parigi = 2/3 cm; numero ≈ 1,5 × lunghezza del piede + 2). La tabella scarpe è calcolata con questa formula; Nostro Figlio dà valori di circa 0,3 cm più alti: gli intervalli sono prudenti e indicativi', u: 'https://en.wikipedia.org/wiki/Shoe_size' },
    { t: 'Nostro Figlio: lunghezza del piede e numero di scarpa (confronto per i numeri 28-34; margine di 1 cm)', u: 'https://www.nostrofiglio.it/bambino/lunghezza-piede-bambino-e-numero-scarpa' },
    { t: 'Birkenstock: tabella misure EU in mm (confronto)', u: 'https://www.birkenstock.com/it/fit-guide-size-chart.html' },
    { t: 'GreenMe: numero di scarpe del bambino (almeno 1 cm davanti alle dita, le misure non sono uguali tra le marche)', u: 'https://www.greenme.it/lifestyle/bambini/scarpe-bambini-misura-giusta/' },
    { t: 'Pianeta Mamma: scarpe per bambini (comprare nel pomeriggio, controllo con il pollice)', u: 'https://www.pianetamamma.it/il-bambino/shopping/scarpe-per-bambini-come-scegliere-tipo-e-misura.html' },
    { t: 'Riedell: come scegliere la misura dei pattini artistici (calze sottili, tallone fermo, dita che toccano appena, tabella di ogni marca)', u: 'https://ice-blog.riedellskates.com/figure-skate-boot-sizing-fitting/' },
    { t: 'Nostro Figlio: sport su ghiaccio per bambini (imparare a cadere, consiglio dell\'istruttore)', u: 'https://www.nostrofiglio.it/bambino/sport/sport-su-ghiaccio-per-bambini' },
    { t: 'Dragonfly: tessuti aerei, cosa indossare (capo aderente, gambe coperte, niente cerniere né gioielli)', u: 'https://dragonflybrand.com/blogs/blog/aerial-silks-for-beginners-what-to-wear-how-to-start-and-how-to-stay-safe' },
    { t: 'Nostro Figlio: scarpe da ginnastica per bambini (suola flessibile e antiscivolo, tallone fermo, spazio davanti alle dita)', u: 'https://www.nostrofiglio.it/shopping/sneakers-e-scarpe-da-ginnastica-ammortizzati' },
    { t: 'Studentville: cerchio cromatico di Itten (primari rosso-giallo-blu, secondari, complementari)', u: 'https://www.studentville.it/appunti/cerchio-cromatico-di-itten-cose-e-come-si-disegna/' },
    { t: 'Eroica Fenice: cerchio di Itten (colori analoghi, caldi e freddi, complementari)', u: 'https://www.eroicafenice.com/salotto-culturale/cerchio-di-itten/' },
    { t: 'Studenti.it: colori e arcobaleno (la luce bianca si scompone nei colori dello spettro)', u: 'https://www.studenti.it/colori.html' }
  ]
};
