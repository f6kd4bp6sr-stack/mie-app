/* «Come mi trucco»: nozioni verificate (autore + revisore) — fonti in TRUCCO.fonti */
const TRUCCO = {
  schede: [
    { id: 'pelle', ic: '🧴', t: 'Prima la pelle', facts: [
      ['Pulita con dolcezza', 'La tua pelle è delicata. Per lavarla basta un detergente delicato. Strofinare forte o usare prodotti aggressivi può irritarla. Con acqua e mano leggera fai già benissimo.'],
      ['Crema senza profumo', 'Se usi una crema idratante, meglio una senza profumo aggiunto: i profumi possono dare fastidio alla pelle. Chiedi a un adulto di aiutarti a scegliere guardando l\'etichetta.'],
      ['Proteggiti dal sole', 'I dermatologi consigliano ogni giorno una protezione solare ad ampio spettro, resistente all\'acqua, con fattore 30 o più. Metterla è un gesto di cura per la tua pelle, a un adulto puoi chiedere quale scegliere.'],
      ['Meno è meglio', 'Non servono tanti prodotti. Contano di più pochi gesti fatti con costanza che una lunga lista di cose da mettere. Più prodotti non vuol dire pelle più sana.'],
      ['Uno alla volta', 'Se provi un prodotto nuovo, provane uno per volta. Così, se la pelle si arrossa o ti prude, sai subito qual è stato. Prima prova una piccola quantità su un pezzetto di pelle, mai subito su tutto il viso.']
    ] },
    /* NUOVO (7/11/2026) — fonti lette: AAD «Face washing 101» https://www.aad.org/skin-care-basics/face-washing-101 ;
       AAD «Practice safe sun» https://www.aad.org/public/everyday-care/sun-protection/shade-clothing-sunscreen/practice-safe-sun ;
       FDA «Novelty Makeup» https://www.fda.gov/cosmetics/cosmetic-products/novelty-makeup ;
       FDA «Using Cosmetics Safely» https://www.fda.gov/cosmetics/resources-consumers-cosmetics/using-cosmetics-safely ;
       protezione solare (fonte italiana: fattore alto per i bambini, almeno ogni 2 ore e dopo il bagno): Altroconsumo https://www.altroconsumo.it/salute/creme-solari/consigli/creme-solari-bambini
       Revisione 7/11: protezione solare resa prudente (scelta con un adulto, come dice la confezione o il pediatra). */
    { id: 'routine', ic: '🚿', t: 'La routine della pelle', facts: [
      ['1. Acqua tiepida', 'Il primo passo è bagnare il viso con acqua tiepida, né calda né fredda. Lavare il viso va bene la mattina e la sera, e anche dopo aver sudato tanto, per esempio dopo lo sport.'],
      ['2. Detergente delicato', 'Scegli con un adulto un detergente delicato, senza alcol. Strofinalo piano con la punta delle dita, senza spugne dure o prodotti ruvidi. Poi sciacqua bene con acqua tiepida.'],
      ['3. Asciuga tamponando', 'Asciuga il viso con un asciugamano morbido e pulito, premendo piano senza strofinare. Strofinare forte può irritare la pelle.'],
      ['4. Crema idratante', 'Se la pelle è secca o tira, puoi mettere un po\' di crema idratante. Ne basta poca, stesa con delicatezza. Se la pelle è a posto, può non servire. Scegli la crema con un adulto.'],
      ['5. Protezione solare', 'Quando stai all\'aperto di giorno, la protezione solare è un gesto molto importante. Per i bambini si consiglia una protezione alta: sceglila con un adulto. Va rimessa spesso, come dice la confezione o il pediatra (di solito almeno ogni 2 ore), e sempre dopo il bagno o se hai sudato tanto.'],
      ['Ombra, cappello e vestiti', 'Oltre alla crema aiutano ombra, cappellino e magliette leggere. Nelle ore centrali della giornata il sole è più forte: se la tua ombra è più corta di te, è il momento di cercare un posto all\'ombra.'],
      ['Se la pelle si irrita', 'Se la pelle brucia, prude o diventa rossa, smetti di usare il prodotto e dillo subito a un adulto. Sarà l\'adulto a chiedere aiuto al medico: tu non devi curarti da sola.']
    ] },
    { id: 'sicura', ic: '🔍', t: 'Truccarsi in sicurezza', facts: [
      ['Prodotti fatti per la pelle', 'In Europa i cosmetici devono essere sicuri per la salute, se usati nel modo giusto: lo dice il Regolamento (CE) 1223/2009. I prodotti comprati in posti poco affidabili, come bancarelle o siti sconosciuti, possono non rispettare queste regole. Compra con un adulto.'],
      ['Solo cosmetici sul viso', 'Sul viso vanno solo prodotti fatti per la pelle. Mai usare colori da disegno, pennarelli, tempere o glitter da lavoretti: non sono pensati per la pelle e possono farle male.'],
      ['Prima la prova', 'Prima di usare un prodotto mai provato, mettine pochissimo su un pezzetto di pelle, per esempio dietro l\'orecchio o sul braccio, e aspetta qualche giorno. Se brucia, prude o arrossa, toglilo subito e dillo a un adulto.'],
      ['Occhi e labbra non si prestano', 'Non prestare e non farti prestare i prodotti per occhi e labbra: si passano fastidi e infezioni.'],
      ['Mani pulite, prodotti in ordine', 'Prima di truccarti lavati le mani. Tieni i prodotti lontano da caldo e umidità. Se un prodotto ha un cattivo odore, buttalo. Una volta aperto, ogni prodotto si usa solo per il tempo scritto sul vasetto aperto. Il trucco per gli occhi non fa parte dei primi passi: gli occhi sono delicati.'],
      ['Struccarsi prima di dormire', 'Non andare a letto truccata: il trucco può irritare la pelle e sbriciolarsi negli occhi. Toglilo con delicatezza, seguendo quello che dice l\'etichetta. La pelle intorno agli occhi è sottilissima.'],
      /* NUOVO — fonti: FDA «Using Cosmetics Safely», HealthyChildren.org «Face Paints & Makeup» https://www.healthychildren.org/English/safety-prevention/at-home/Pages/Face-Paints-Makeup-Toxic-Ingredients.aspx */
      ['Come ci si strucca, passo passo', 'Primo: lavati le mani. Secondo: togli il trucco con lo struccante o il metodo scritto sull\'etichetta, con un dischetto o un panno pulito, piano e senza strofinare. Terzo: lava il viso con acqua tiepida e un detergente delicato. Quarto: asciuga tamponando. Se serve, un po\' di crema idratante.'],
      ['La prova sulla pelle, come si fa', 'Con un adulto, metti una piccolissima goccia del prodotto nuovo sull\'interno del braccio e controlla quel pezzetto di pelle per un paio di giorni. Se non succede niente, puoi usarlo. Se brucia, prude o arrossa, lavalo via con delicatezza, non lo usare più e dillo a un adulto. È meglio scoprire un problema con una goccia che su tutto il viso.'],
      ['Non si scambiano i prodotti', 'Ognuno usa il proprio trucco: non si presta e non si prende in prestito, nemmeno tra migliori amiche. Così i germi non passano da una persona all\'altra.'],
      ['Pennelli e spugnette puliti', 'Pennelli e spugnette devono essere puliti, perché lo sporco porta germi. Come e quando lavarli lo decide un adulto, seguendo le istruzioni. I dischetti di cotone si usano una volta e si buttano.'],
      ['Saliva no, mani pulite', 'Usa ogni prodotto solo come dicono le istruzioni: non aggiungere niente di tuo, mai la saliva, e non toccarlo con le dita sporche, perché i germi ci entrano. Tieni i prodotti ben chiusi, in un posto non caldo e non umido.'],
      ['Quando buttare un prodotto', 'Butta un prodotto se cambia odore, colore o consistenza, anche se la data non è passata. Un prodotto scaduto o vecchio può far venire problemi alla pelle.']
    ] },
    { id: 'gioco', ic: '🎭', t: 'Trucco per giocare', facts: [
      ['Il truccabimbi', 'Il truccabimbi è un gioco: farfalle, gattini, supereroi. Usa solo prodotti pensati per la pelle e segui le istruzioni scritte sulla confezione. Prima di cominciare fai la prova su un pezzetto di pelle, qualche giorno prima.'],
      ['Lontano da occhi e bocca', 'Non mettere colore vicino agli occhi e alla bocca: potrebbe irritarli o finire in bocca. Per gli occhi esistono regole speciali sui colori, quindi lasciali al naturale e disegna più in là, anche se sulla confezione c\'è un bambino truccato vicino agli occhi.'],
      ['Carnevale e saggi', 'Per Carnevale, una recita o un saggio scegli cosmetici sicuri, non scaduti e adatti all\'età, con un adulto. Prima di truccarti la pelle deve essere ben pulita. Controlla scadenza e simbolo del vasetto aperto.'],
      /* NUOVO — fonti: FDA «Novelty Makeup» (prova sul braccio per un paio di giorni; «not for use near the eyes» anche se in foto; togliere come dice l'etichetta, non dormire truccati); HealthyChildren.org (ognuno il suo trucco; buttare se odora male) */
      ['Prodotti adatti ai bambini', 'Per il truccabimbi scegli prodotti fatti per essere usati sulla pelle, con la lista degli ingredienti scritta in modo chiaro sulla confezione. Sono da evitare colori da disegno, vernici o prodotti senza etichetta. Se non sai se un prodotto va bene, chiedi a un adulto e non usarlo.'],
      ['La prova prima della festa', 'Qualche giorno prima della festa metti una goccia del colore sull\'interno del braccio e aspetta un paio di giorni. Meglio scoprire un fastidio con una goccia, che con un disegno su tutta la faccia. Se compare rossore, prurito o bruciore, quel colore non si usa.'],
      ['Ognuno il suo colore', 'A casa ognuno usa i suoi colori, il suo pennello e la sua spugnetta. Se a una festa c\'è un truccatore, un adulto può chiedergli di usare pennelli e spugnette puliti per ogni bambino. I germi passano facilmente da un viso all\'altro.'],
      ['Come si toglie', 'A fine festa togli il trucco con uno struccante delicato oppure come indica l\'etichetta, poi sciacqua il viso con tanta acqua. Se hai usato colla per il viso, per esempio per una barba finta, la mette e la toglie un adulto, con il prodotto indicato sulla confezione.']
    ] },
    { id: 'primi', ic: '✨', t: 'Primi passi', facts: [
      ['Solo per occasioni speciali', 'Un burrocacao colorato o un lucidalabbra leggero possono essere un gioco per una festa o un\'occasione speciale. Decidi sempre insieme a un adulto, che sceglie il prodotto con te e ti guarda mentre lo provi.'],
      ['Leggi gli ingredienti', 'Insieme a un adulto leggi la lista degli ingredienti e la scadenza prima di usare un prodotto nuovo. Se qualcosa non si capisce, chiedi. Fai sempre la prova su un pezzetto di pelle e non condividerlo con altre persone.'],
      ['Lo smalto', 'Lo smalto per bambini, all\'acqua o da staccare, si usa come dice l\'etichetta, con un adulto vicino. Non mettere le dita in bocca finché è bagnato. Il solvente per unghie lo usa solo un adulto. Prima di usare un prodotto nuovo fai la prova e leggi le istruzioni con calma.'],
      /* NUOVO — fonte: Quotidiano Sanità «Leggi l'etichetta» https://www.quotidianosanita.it/insights/leggi-l-etichetta/ ; Reg. CE 1223/2009 art. 19 https://www.legislation.gov.uk/eur/2009/1223/article/19/data.pdf */
      ['Il percorso di un prodotto nuovo', 'Prima di usare un prodotto nuovo fai sempre questi passi, con un adulto: 1) leggi l\'etichetta e gli ingredienti; 2) guarda la data o il vasetto aperto; 3) fai la prova su un pezzetto di pelle; 4) se va tutto bene, usalo poco e per giocare. Se qualcosa non ti convince, non si usa.'],
      ['Poi si toglie', 'Alla fine della giornata il trucco si toglie, anche se è leggero. Pelle pulita e mani lavate: è la regola di sempre. Se la pelle si irrita, smetti di usare il prodotto e avvisa un adulto.']
    ] },
    { id: 'bella', ic: '💛', t: 'Bella così', facts: [
      ['Il trucco è un gioco', 'Il trucco serve per divertirsi, inventare personaggi e giocare con i colori. Non serve per essere belle o per piacere agli altri. Puoi truccarti per gioco e puoi anche non farlo mai: va bene tutto.'],
      ['Foto e filtri non sono la realtà', 'Molte foto sui social sono ritoccate con filtri e app. Sembrano perfette ma non sono vere. Paragonarsi a immagini così può far venire ansia e tristezza, mentre il tuo viso vero è quello giusto.'],
      ['Ognuna ha il suo viso', 'Ogni viso è diverso e nessuno è uguale a un altro: è questo che lo rende tuo. Se ti senti triste o a disagio guardando certe immagini, parlane con un adulto di cui ti fidi: parlarne aiuta.']
    ] }
  ],
  prima: [
    'Chiedi a un adulto di stare con te e di scegliere il prodotto insieme a te.',
    'Lavati le mani e controlla che la pelle del viso sia ben pulita.',
    'Leggi l\'etichetta: scadenza, simbolo del vasetto aperto e istruzioni.',
    'Se il prodotto è nuovo, fai la prova su un pezzetto di pelle qualche giorno prima: una goccia sull\'interno del braccio.',
    'Controlla che pennelli e spugnette siano puliti e che i prodotti siano solo tuoi, non prestati.'
  ],
  dopo: [
    'Togli il trucco con uno struccante delicato o come dice l\'etichetta, poi sciacqua con acqua.',
    'Non andare a dormire truccata, nemmeno un po\'.',
    'Lava il viso con acqua tiepida e un detergente delicato, asciuga tamponando e, se la pelle tira, metti un po\' di crema idratante.',
    'Se pennelli e spugnette sono sporchi, falli lavare a un adulto come dicono le istruzioni; i dischetti usati si buttano.',
    'Chiudi bene i prodotti e conservali lontano da caldo e umidità; butta quelli che hanno cambiato odore, colore o consistenza.',
    'Se la pelle brucia, prude o si arrossa, smetti e dillo subito a un adulto.'
  ],
  /* NUOVO etichette — fonti: Reg. CE 1223/2009 art. 19(1)(c) (periodo dopo l'apertura in mesi/anni; solo se durata minima oltre 30 mesi) https://www.legislation.gov.uk/eur/2009/1223/article/19/data.pdf ; Quotidiano Sanità https://www.quotidianosanita.it/insights/leggi-l-etichetta/ (ripubblica la guida «Belli e in salute» del Ministero della Salute) ; ECC-Net Italia, leaflet cosmetici 2026 (PAO per durata oltre 30 mesi) ; prova sulla pelle: FDA https://www.fda.gov/cosmetics/cosmetic-products/novelty-makeup e HealthyChildren.org */
  etichette: [
    { ic: '🫙', t: 'Il vasetto aperto (PAO)', x: 'È un disegno di un vasetto aperto con un numero e una M, per esempio 12M. Dice per quanto tempo il prodotto si può usare dopo averlo aperto senza problemi. Passato quel tempo, meglio buttarlo. 12M = 12 mesi, 6M = 6 mesi. Conta dal giorno in cui lo apri.' },
    { ic: '🧾', t: 'PAO o data: quale c\'è?', x: 'Su alcuni prodotti c\'è il vasetto aperto, su altri la clessidra o la scritta «Usare preferibilmente entro» con la data. Il vasetto aperto compare sui prodotti che durano a lungo (più di 30 mesi); gli altri hanno la data. Se non vedi né l\'uno né l\'altro, o la confezione non ha etichetta, chiedi a un adulto.' },
    { ic: '🧪', t: 'La prova su un pezzetto di pelle', x: 'Non è un simbolo, ma è la cosa più importante da fare con un prodotto nuovo: una goccia sull\'interno del braccio per un paio di giorni. Se non succede niente, va bene provarlo. Se arrossa, prude o brucia, si lava via con delicatezza e si dice a un adulto.' },
    { ic: '⏳', t: 'La clessidra e «usare entro»', x: 'La clessidra, oppure la scritta «Usare preferibilmente entro», indica fino a quando il prodotto, se conservato bene e ancora chiuso, mantiene le sue caratteristiche. Per sicurezza, quando la data è passata non si usa più.' },
    { ic: '📋', t: 'La lista degli ingredienti (INCI)', x: 'Sulla confezione c\'è l\'elenco degli ingredienti, con nomi uguali in tutta Europa. Il profumo si legge «parfum» o «aroma». Serve per scoprire cosa c\'è dentro, soprattutto se qualcosa ti ha già dato fastidio.' },
    { ic: '🩺', t: '«Dermatologicamente testato»', x: 'Vuol dire che il prodotto è stato provato sotto la supervisione di un dermatologo. Ma la scritta non dice quale prova è stata fatta e non assicura che vada bene per ogni pelle: per questo si fa sempre la prova sulla pelle.' },
    { ic: '📖', t: 'Il libro con la mano', x: 'Questo simbolo vuol dire: leggi le istruzioni. Le informazioni e le avvertenze sono scritte su un foglietto, un\'etichetta o una linguetta, perché sulla confezione non c\'era posto. Leggile prima di usarlo.' }
  ],
  fonti: [
    { t: 'AAD: Face washing 101 (lavare il viso)', u: 'https://www.aad.org/skin-care-basics/face-washing-101' },
    { t: 'AAD: Practice safe sun (protezione solare)', u: 'https://www.aad.org/public/everyday-care/sun-protection/shade-clothing-sunscreen/practice-safe-sun' },
    { t: 'FDA: Using Cosmetics Safely (non condividere, igiene, conservazione)', u: 'https://www.fda.gov/cosmetics/resources-consumers-cosmetics/using-cosmetics-safely' },
    { t: 'Regolamento (CE) 1223/2009, articolo 19: Etichettatura (PAO)', u: 'https://www.legislation.gov.uk/eur/2009/1223/article/19/data.pdf' },
    { t: 'FDA (autorità USA sui cosmetici): Novelty Makeup, il trucco per feste e Carnevale', u: 'https://www.fda.gov/cosmetics/cosmetic-products/novelty-makeup' },
    { t: 'American Academy of Pediatrics (HealthyChildren.org): Face Paints and Makeup', u: 'https://www.healthychildren.org/English/safety-prevention/at-home/Pages/Face-Paints-Makeup-Toxic-Ingredients.aspx' },
    { t: 'American Academy of Dermatology: A dermatologist\'s guide to skin care', u: 'https://www.aad.org/news/dermatologist-guide-skincare' },
    { t: 'American Academy of Ophthalmology (via HealthDay): Using Eye Makeup', u: 'https://www.healthday.com/health-news/general-health/health-tip-using-eye-makeup-742545.html' },
    { t: 'Ministero della Salute (decalogo Carnevale, via Quotidiano Sanità): trucchi e cosmetici', u: 'https://www.quotidianosanita.it/?p=22413' },
    { t: 'Altroconsumo: creme solari per bambini (protezione alta, rimetterla almeno ogni 2 ore e dopo il bagno)', u: 'https://www.altroconsumo.it/salute/creme-solari/consigli/creme-solari-bambini' },
    { t: 'ECC-Net Italia (Centro europeo consumatori): prodotti cosmetici, leaflet 2026 (data di durata minima e PAO)', u: 'https://www.provincia.tn.it/po/ocmultibinary/download/82281/6055393/3/820df81bd528daf86fa87c27fa81ca5c.pdf/file/Leaflet_prodotti-cosmetici-2026.pdf' },
    { t: 'Ministero della Salute, guida «Belli e in salute» (via Quotidiano Sanità): Leggi l\'etichetta, simboli dei cosmetici', u: 'https://www.quotidianosanita.it/insights/leggi-l-etichetta/' },
    { t: 'Regolamento (CE) n. 1223/2009, articolo 3: Sicurezza', u: 'https://eur-lex.europa.eu/legal-content/IT/TXT/?uri=CELEX:32009R1223' },
    { t: 'Commissione europea: portale di notifica dei prodotti cosmetici (CPNP)', u: 'https://single-market-economy.ec.europa.eu/sectors/cosmetics/cosmetic-product-notification-portal_it' },
    { t: 'Teknoscienze: Dermatologicamente testato, ipoallergenico o clinicamente testato?', u: 'https://www.teknoscienze.com/?p=21482' },
    { t: 'American Academy of Pediatrics (HealthyChildren.org): Social media, body image and self-esteem', u: 'https://healthychildren.org/English/family-life/Media/Pages/social-media-body-image-and-self-esteem-whats-the-connection.aspx' }
  ]
};
