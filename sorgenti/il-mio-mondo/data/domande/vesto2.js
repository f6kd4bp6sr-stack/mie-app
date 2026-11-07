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
    ['Il tuo gusto conta', 'Il cerchio dei colori è un aiuto, non una regola da rispettare. Tanti artisti rompono le regole e creano cose bellissime. Prova gli abbinamenti, guarda allo specchio come ti senti e scegli quello che ti fa stare bene.'],

    /* ===== NUOVI (7/11/2026, richiesta del papà: sezioni più ricche). Fonti, tutte lette:
       - misure (altezza a muro, metro morbido, vita, «tra due taglie scegli la più grande»): https://www.nostrofiglio.it/famiglia/moda-e-bellezza/guida-alle-taglie-per-bambini
       - piede (foglio, tallone e dito più lungo, piede più lungo, pomeriggio): testi già verificati sopra in VESTO2.fonti (Nostro Figlio, Pianeta Mamma)
       - etichetta di composizione (ordine decrescente, percentuali, 100%/puro, nomi per esteso): https://fe.camcom.it/regmercato/sicurezza-prodotti/folder-mise/guida-tessile
       - simboli di lavaggio (catino, temperature, barrette, mano, triangolo, quadrato, ferro, cerchio): GINETEX (ISO 3758) https://www.ginetex.net/GB/labelling/care-symbols.asp
         e controllo incrociato con Altroconsumo https://www.altroconsumo.it/elettrodomestici/lavatrici/speciali/simboli-etichette-lavaggio
       - vestirsi a strati, sudore, cappello e guanti, sport: https://www.nostrofiglio.it/bambino/come-vestire-bambini-inverno-freddo
       - colori caldi e freddi: https://www.cosedicasa.com/arredamento/abbinamenti-stili-colori/colori-caldi-e-freddi-quali-sono-e-come-abbinarli-47097
       - revisione 7/11: ferro con un pallino reso «poco caldo» senza gradi (GINETEX indica 120 °C, la tabella ISO/camcom 110 °C);
         colori caldi/freddi riscritti come teoria generale del cerchio di Itten (vedi fonti Studentville ed Eroica Fenice);
         tolto il mito «la testa perde calore più in fretta»; «vestiti sottili» spiegato con il perché (buon senso).
       - «Che cosa metto?»: consigli di buon senso scritti dall'autore, con i punti sul freddo/uscire dalla fonte Nostro Figlio sopra ===== */
    ['Come si misura l\'altezza', 'Chiedi aiuto a un adulto. Primo: togli le scarpe e mettiti con la schiena dritta contro un muro libero, guardando davanti a te. Secondo: l\'adulto appoggia un libro piatto sulla tua testa, contro il muro, e fa un piccolo segno con la matita. Terzo: con un metro rigido misura dal pavimento fino al segno. Scrivi il numero in centimetri. Su molti vestiti per bambini la taglia è proprio l\'altezza in centimetri, per questo è la misura più utile!'],
    ['Come si misura il piede', 'Anche qui serve un adulto. Stai in piedi con il piede appoggiato su un foglio. L\'adulto segna con la matita dove finisce il tallone e dove arriva la punta del dito più lungo (non sempre è l\'alluce!). Poi misura la distanza tra i due segni, in centimetri. Misura tutti e due i piedi: possono essere un po\' diversi, e vale il più lungo. Il pomeriggio è il momento migliore, perché il piede si è un po\' allargato durante la giornata.'],
    ['Giro petto e giro vita', 'Servono un metro morbido da sarta e un adulto. Meglio avere addosso vestiti sottili: quelli pesanti rendono la misura più grande del vero. Il giro petto si prende nel punto più largo del petto, il giro vita più o meno all\'altezza dell\'ombelico. Il metro deve stare appoggiato in piano e morbido: aderente, ma senza stringere. Queste misure servono solo a scegliere vestiti comodi, come pantaloni e gonne. Sono numeri come l\'altezza, niente di più. Se le misure stanno tra due taglie della tabella, scegli la più grande.'],
    ['Leggere l\'etichetta: di che cosa è fatto?', 'Dentro al vestito c\'è un\'etichetta cucita con i nomi dei materiali, che si chiamano fibre, e le percentuali. Il primo nome è il materiale che ce n\'è di più, poi gli altri in ordine. «70% cotone, 30% poliestere» vuol dire 70 parti su 100 di cotone e 30 di poliestere. «100%» o «puro» vuol dire una fibra sola. Cotone e lino vengono dalle piante, lana e seta dagli animali, poliestere ed elastan sono fatti in fabbrica (l\'elastan rende il tessuto elastico). Se un vestito ti pizzica sulla pelle, guarda l\'etichetta e dillo a un adulto: ci sono tanti tessuti e puoi sceglierne uno che ti sta comodo.'],
    ['I simboli di lavaggio: il catino', 'Accanto alla composizione ci sono dei disegnini, usati in tanti Paesi, anche in Italia (li ha inventati un\'associazione chiamata GINETEX). Ogni forma ha un lavoro: catino = lavare, triangolo = sbiancare, quadrato = asciugare, ferro = stirare, cerchio = lavanderia. Nel catino, il numero è la temperatura massima dell\'acqua in gradi: con 30 non si va oltre 30. Una mano nel catino vuol dire lavare a mano, con acqua al massimo a 40 gradi, con delicatezza. Una barretta sotto il catino vuol dire programma delicato, due barrette molto delicato. Una croce sopra un simbolo vuol dire sempre «no, non farlo»: sul catino, non lavare in acqua.'],
    ['I simboli: triangolo e quadrato', 'Il triangolo parla dei prodotti sbiancanti. Triangolo vuoto: si possono usare. Triangolo con due righe oblique: solo quelli senza cloro. Triangolo con la croce: nessuno sbiancante. Il quadrato parla dell\'asciugatura. Quadrato con un cerchio dentro: si può usare l\'asciugatrice, e i pallini dicono quanto calore (uno è poco, due è normale). Se il cerchio ha la croce, niente asciugatrice. Un quadrato con delle righe dentro dice come asciugare all\'aria: riga orizzontale = stendi il capo in piano, righe verticali = appendilo, riga obliqua = all\'ombra.'],
    ['I simboli: ferro e lavanderia', 'Il ferro da stiro ha dei pallini che dicono quanto può essere caldo: uno è poco caldo, due è medio, tre è molto caldo (di solito per cotone e lino). Ferro con la croce: non si stira. Attenzione, il ferro scotta: stirare lo fa sempre un adulto! Il cerchio vuol dire pulizia in lavanderia: è un lavaggio fatto da professionisti con macchine speciali, spesso con liquidi al posto dell\'acqua (per questo si chiama «a secco»). Le lettere dentro al cerchio servono a chi lavora in lavanderia. Cerchio con la croce: non va portato in lavanderia a secco.'],
    ['Vestirsi a strati', 'Quando fa freddo, tanti strati leggeri sono meglio di uno solo molto pesante: se hai caldo, per esempio in classe, ne togli uno, e se ti raffreddi lo rimetti. Si chiama «vestirsi a cipolla». Vicino alla pelle metti una maglia leggera e traspirante, di cotone o di tessuto tecnico. Sopra una felpa o un pile. Per giocare fuori, una giacca leggera da mettere quando ti raffreddi. Cappello, sciarpa e guanti proteggono testa, collo e mani, che altrimenti resterebbero scoperti al freddo. Col caldo vale la stessa idea al contrario: vestiti leggeri e che lasciano passare l\'aria.'],
    ['Ho caldo o freddo? Ascolta il tuo corpo', 'Il modo più facile per capirlo è toccarti la schiena o il collo: se sei sudata anche senza correre, forse sei troppo coperta, quindi togli uno strato. Il sudore non è dannoso, anzi, aiuta il corpo a raffreddarsi. Ognuno sente la temperatura a modo suo: un adulto fermo può avere freddo mentre tu, che giochi, stai benissimo. Se non sai che cosa fare, parlane con un adulto. Quando fai sport il corpo si scalda, quindi alleggerisciti pian piano. Anche quando fa freddo si può giocare fuori: basta vestirsi bene.'],
    ['Caldi e freddi: come abbinarli', 'Nel cerchio dei colori, da una parte ci sono i colori caldi: rosso, arancione, giallo e le loro sfumature, come terracotta e senape. Dall\'altra i colori freddi: azzurro, blu, tanti verdi e viola. A molte persone i caldi fanno pensare all\'energia, i freddi alla calma. Mettere insieme un po\' di caldo e un po\' di freddo dà ritmo e contrasto, per esempio una maglia gialla con pantaloni blu. Bianco, grigio e beige fanno da sfondo e legano tutto. Anche i neutri possono essere un po\' caldi o un po\' freddi: un bianco panna è più caldo, un grigio azzurrato più freddo. Guarda i colori alla luce del giorno, perché la luce cambia il loro aspetto.'],
    ['Che cosa metto oggi?', 'Prova a farti tre domande. Che cosa farò? Se corri e giochi servono vestiti comodi che si muovono con te e scarpe ben allacciate. Se vai a una festa, scegli ciò che ti piace e in cui ti senti comoda. Per scuola e sport segui le indicazioni di scuola e insegnanti. Che tempo fa? Guarda il cielo e la temperatura e, se il tempo cambia, porta uno strato in più nello zaino. Come mi sento? Se un vestito pizzica, stringe o ti fa stare scomoda, scegline un altro: ti devi sentire bene in quello che indossi.']
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
    'Controlla l\'etichetta e leggi cosa dice sul lavaggio: dopo il bucato può restringersi un po\'.',
    'Leggi sull\'etichetta di che cosa è fatto il vestito: se ti pizzica sulla pelle, dillo a un adulto e provane un altro.',
    'Se è un vestito per il freddo, provalo con la maglia che metterai sotto: devi muoverti bene, anche con gli strati.'
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
    { t: 'GINETEX: simboli di manutenzione (ISO 3758): catino, temperature, barrette, mano, triangolo, quadrato, ferro, cerchio', u: 'https://www.ginetex.net/GB/labelling/care-symbols.asp' },
    { t: 'Altroconsumo: simboli delle etichette di lavaggio (controllo incrociato dei significati)', u: 'https://www.altroconsumo.it/elettrodomestici/lavatrici/speciali/simboli-etichette-lavaggio' },
    { t: 'Camera di Commercio di Ferrara: guida tessile (come leggere la composizione: ordine decrescente, percentuali, 100% o puro)', u: 'https://fe.camcom.it/regmercato/sicurezza-prodotti/folder-mise/guida-tessile' },
    { t: 'Nostro Figlio: come vestire i bambini col freddo (strati, sudore, cappello e guanti, sport)', u: 'https://www.nostrofiglio.it/bambino/come-vestire-bambini-inverno-freddo' },
    { t: 'Cose di Casa: colori caldi e freddi e come abbinarli (esempi presi dall\'arredamento; la regola generale è quella del cerchio dei colori)', u: 'https://www.cosedicasa.com/arredamento/abbinamenti-stili-colori/colori-caldi-e-freddi-quali-sono-e-come-abbinarli-47097' },
    { t: 'Studenti.it: colori e arcobaleno (la luce bianca si scompone nei colori dello spettro)', u: 'https://www.studenti.it/colori.html' }
  ]
};
