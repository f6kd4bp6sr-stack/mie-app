/* ================= SPORT E MOVIMENTO ================= */
/* Pause movimento: tutorial guidati sul posto, sicuri per una bambina di quasi 10 anni.
   a = animazione dell'icona: march, side, spin, balance, jump, reach, swim, breathe, shake */
const MOVES = [
  { id: 'ghiaccio', ic: '⛸️', name: 'La pattinatrice', sk: 'Equilibrio ed eleganza · 2 min', c: 'var(--c5)', s: 'var(--c5-soft)',
    intro: 'Oggi sei sul ghiaccio! Movimenti morbidi ed eleganti, come in una gara di pattinaggio artistico.',
    steps: [
      { e: '🚶‍♀️', n: 'Marcia sul ghiaccio', t: 'Marcia sul posto sollevando bene le ginocchia e muovendo le braccia.', tip: 'Schiena dritta e mento alto, come una campionessa!', d: 20, a: 'march' },
      { e: '⛸️', n: 'Scivolata laterale', t: 'Fai un passo largo a destra piegando un po’ le ginocchia, poi a sinistra. Come se pattinassi!', tip: 'Le braccia accompagnano il movimento, morbide.', d: 25, a: 'side' },
      { e: '🦢', n: 'La spirale', t: 'Su un piede solo, apri le braccia e porta l’altra gamba indietro, tesa. Resta ferma come un cigno.', tip: 'Guarda un punto fisso davanti a te: ti aiuta a non cadere. Dopo 10 secondi cambia gamba.', d: 20, a: 'arabesque' },
      { e: '🌀', n: 'La trottola lenta', t: 'Braccia in alto, gira piano su te stessa: 2 giri a destra, poi 2 giri a sinistra.', tip: 'Piano piano! Se ti gira la testa fermati e guarda un punto fisso.', d: 20, a: 'spin' },
      { e: '🙇‍♀️', n: 'Inchino al pubblico', t: 'Fai un bell’inchino e respira: inspira dal naso, espira dalla bocca, per 3 volte.', tip: 'Il pubblico applaude: bravissima!', d: 15, a: 'bow' }
    ] },
  { id: 'aerea', ic: '🎪', name: 'L’acrobata dei tessuti', sk: 'Forza e allungamento · 2 min', c: 'var(--c6)', s: 'var(--c6-soft)',
    intro: 'Sei un’acrobata del circo! Diventa forte e leggera, ma sempre con i piedi per terra.',
    steps: [
      { e: '🧗‍♀️', n: 'Arrampicata sul tessuto', t: 'Allunga un braccio in alto e poi l’altro, come se ti arrampicassi su un tessuto. Sali sulle punte!', tip: 'Afferra il tessuto immaginario con tutta la mano.', d: 20, a: 'reach' },
      { e: '⭐', n: 'Stella marina', t: 'Salta aprendo braccia e gambe a stella, poi richiudi. Salti leggeri!', tip: 'Atterra morbida come una piuma: prima le punte, poi tutto il piede, con le ginocchia piegate.', d: 20, a: 'jump' },
      { e: '🦩', n: 'Il fenicottero', t: 'Stai su un piede solo. Appoggia la pianta dell’altro piede sul polpaccio o sulla coscia (mai sul ginocchio) e unisci le mani sopra la testa.', tip: 'Pancia stretta: è il segreto delle acrobate! Dopo 10 secondi cambia piede.', d: 20, a: 'tree' },
      { e: '🧘‍♀️', n: 'La goccia che scende', t: 'Piedi un po’ larghi, scendi piano con la schiena verso il pavimento e poi risali una vertebra alla volta.', tip: 'Ginocchia morbide, non serve toccare terra.', d: 20, a: 'fold' },
      { e: '🎈', n: 'Il respiro del palloncino', t: 'Inspira gonfiando la pancia come un palloncino, poi sgonfiala piano. Per 4 volte.', tip: 'Le acrobate respirano sempre con calma prima di salire.', d: 20, a: 'belly' }
    ] },
  { id: 'nuoto', ic: '🏊‍♀️', name: 'Nuotatrice a secco', sk: 'Braccia e respiro · 2 min', c: 'var(--c4)', s: 'var(--c4-soft)',
    intro: 'Tuffati nella piscina immaginaria! Proviamo tutti e quattro gli stili, in piedi sul posto.',
    steps: [
      { e: '🏊‍♀️', n: 'Stile libero', t: 'Braccia che girano in avanti, una dopo l’altra, come una girandola.', tip: 'Gira la testa di lato ogni tre bracciate per «respirare».', d: 20, a: 'crawl' },
      { e: '🔙', n: 'Dorso', t: 'Ora le braccia girano all’indietro, una alla volta. Guarda il soffitto!', tip: 'Braccia ben tese, vicino alle orecchie.', d: 20, a: 'back' },
      { e: '🐸', n: 'Rana', t: 'Mani unite davanti al petto: spingile in avanti, apri le braccia a cerchio e riportale al petto. Quando le mani tornano al petto piega un po’ le ginocchia, poi distendile.', tip: 'Come una rana che apre la strada nell’acqua.', d: 20, a: 'breast' },
      { e: '🐬', n: 'Delfino', t: 'Entrambe le braccia girano insieme in avanti e il corpo ondeggia come un delfino.', tip: 'È lo stile più faticoso: vai con calma!', d: 15, a: 'fly' },
      { e: '🫧', n: 'Bolle sott’acqua', t: 'Prendi aria dalla bocca, come quando giri la testa fuori dall’acqua, poi soffia piano dal naso e dalla bocca, come per fare le bolle. Per 4 volte.', tip: 'In acqua i nuotatori prendono aria con la bocca e la soffiano fuori sott’acqua.', d: 20, a: 'belly' }
    ] },
  { id: 'scossa', ic: '⚡', name: 'Scossa di energia', sk: 'Velocissima · 1 min', c: 'var(--c2)', s: 'var(--c2-soft)',
    intro: 'Un minuto per svegliare tutto il corpo e tornare a studiare con il cervello pieno di ossigeno!',
    steps: [
      { e: '🫨', n: 'Scuoti tutto', t: 'Scuoti le mani, poi le braccia, poi una gamba e l’altra. Come un cane bagnato!', tip: 'Scuoti via la stanchezza!', d: 15, a: 'shake' },
      { e: '🦘', n: 'Saltelli del canguro', t: 'Piccoli saltelli sul posto a piedi uniti.', tip: 'Atterra morbida: prima le punte, poi tutto il piede, ginocchia piegate.', d: 15, a: 'hop' },
      { e: '🙆‍♀️', n: 'Allunga al cielo', t: 'Intreccia le dita e spingi le mani verso il soffitto. Poi piegati un po’ a destra e a sinistra.', tip: 'Senti la schiena che si allunga.', d: 15, a: 'stretch' },
      { e: '😮‍💨', n: 'Respiro del drago', t: 'Inspira forte dal naso, poi butta fuori l’aria come un drago che sputa fuoco. Per 3 volte.', tip: 'Il tuo drago respira con te!', d: 15, a: 'belly' }
    ] }
];

const SPORTS = [
  { id: 'patt', ic: '⛸️', name: 'Pattinaggio', sk: 'Sul ghiaccio', c: 'var(--c5)', s: 'var(--c5-soft)',
    facts: [
      ['Quanto è veloce la trottola più veloce del mondo?', 'Nel 2006 la pattinatrice russa Natalia Kanounnikova ha girato a 308 giri al minuto: più di 5 giri ogni secondo! È nel Guinness dei primati.'],
      ['Perché nella trottola si gira più veloce chiudendo le braccia?', 'Quando stringi braccia e gambe vicino al corpo, giri più veloce; quando le apri, rallenti. È una legge della fisica!'],
      ['Da dove viene il nome del salto Axel?', 'Dal pattinatore norvegese Axel Paulsen, che lo inventò più di 140 anni fa. È l’unico salto che parte andando in avanti.'],
      ['Torino e il pattinaggio?', 'Nel 2006 Torino ha ospitato le Olimpiadi invernali e le gare di pattinaggio artistico si sono fatte al Palavela, in riva al Po!'],
      ['A cosa servono i dentini davanti alla lama?', 'Si chiamano puntale: servono a darsi la spinta in alcuni salti, come il toe loop, il flip e il lutz. Non si usano per frenare né per spingere quando si pattina!'],
      ['Perché sul ghiaccio si scivola?', 'Sulla superficie del ghiaccio c’è uno strato sottilissimo e quasi liquido che fa scivolare la lama.']
    ],
    quiz: [
      { q: 'Quale salto del pattinaggio parte andando in avanti?', o: ['L’Axel', 'Il Lutz', 'Il Salchow'], a: 0, e: 'L’Axel è l’unico salto che stacca in avanti: per questo ha mezzo giro in più.' },
      { q: 'Come si chiamano i dentini davanti alla lama?', o: ['Il puntale', 'Il tacco', 'La suola'], a: 0, e: 'Il puntale aiuta a spingere in alcuni salti.' },
      { q: 'In una trottola, come si gira più veloce?', o: ['Chiudendo le braccia', 'Aprendo le braccia', 'Chiudendo gli occhi'], a: 0, e: 'Braccia strette = più veloce. Braccia aperte = più lenta.' },
      { q: 'Quale città italiana ha ospitato le Olimpiadi invernali del 2006?', o: ['Torino', 'Roma', 'Napoli'], a: 0, e: 'Proprio Torino! Il pattinaggio si è fatto al Palavela.' },
      { q: 'Come si chiama la posizione su una gamba sola con l’altra tesa indietro?', o: ['La spirale', 'La trottola', 'Il salto'], a: 0, e: 'Nella spirale la pattinatrice scivola su un piede con l’altra gamba alta e tesa dietro.' }
    ],
    mis: [
      ['La mia coreografia', 'Scegli una canzone e inventa una piccola coreografia di 4 movimenti. Dagli dei nomi buffi!'],
      ['Gara di equilibrio', 'Quanti secondi riesci a stare su un piede come nella spirale? Segna il tuo record e prova a batterlo.'],
      ['Telecronista', 'Guarda un video di pattinaggio con papà o mamma e conta quanti salti fa la pattinatrice.']
    ] },
  { id: 'aerea', ic: '🎪', name: 'Ginnastica aerea', sk: 'Tessuti, cerchio, trapezio', c: 'var(--c6)', s: 'var(--c6-soft)',
    facts: [
      ['Perché il body da ginnastica in inglese si chiama «leotard»?', 'Viene da Jules Léotard, un acrobata francese che nel 1859 a Parigi fece il primo numero di trapezio volante. Indossava proprio una tuta aderente!'],
      ['Come si chiama anche il cerchio aereo?', 'Lyra! È un grande cerchio di metallo appeso in alto, dove le acrobate fanno figure e pose.'],
      ['Di cosa sono fatti i tessuti aerei?', 'Di un tessuto lungo e un po’ elastico, molto resistente: può reggere il peso di una persona e anche di più.'],
      ['Qual è il muscolo segreto delle acrobate?', 'La pancia! Addominali e schiena forti, il «core», tengono il corpo stabile in aria.'],
      ['Da dove arriva la ginnastica aerea?', 'Dal circo! Oggi grandi compagnie come il Cirque du Soleil fanno spettacoli in tutto il mondo.']
    ],
    quiz: [
      { q: 'Il body in inglese si chiama «leotard» grazie a…', o: ['un acrobata del trapezio', 'una regina', 'un pattinatore'], a: 0, e: 'Jules Léotard, l’acrobata che inventò il trapezio volante nel 1859.' },
      { q: 'Come si chiama anche il cerchio aereo?', o: ['Lyra', 'Ruota', 'Anello magico'], a: 0, e: 'Si chiama lyra, come l’antico strumento musicale.' },
      { q: 'Quali muscoli tengono stabile il corpo in aria?', o: ['Addominali e schiena', 'Solo i piedi', 'Le orecchie'], a: 0, e: 'Il «core» (pancia e schiena) è il centro della forza.' },
      { q: 'Dove è nata la ginnastica aerea?', o: ['Nel circo', 'In piscina', 'Sul ghiaccio'], a: 0, e: 'Trapezio e tessuti sono nati negli spettacoli del circo.' }
    ],
    mis: [
      ['Disegna la tua figura', 'Disegna una posa che vorresti fare sui tessuti o sul cerchio e dalle un nome.'],
      ['La sfida della pancia forte', 'Sdraiata a pancia in su, solleva un po’ le gambe piegate e conta fino a 10. Riposa e ripeti 3 volte.'],
      ['Racconta la lezione', 'Dopo la lezione di ginnastica aerea, spiega a casa una figura nuova che hai imparato: fai la maestra!']
    ] },
  { id: 'nuoto', ic: '🏊‍♀️', name: 'Nuoto', sk: 'In piscina', c: 'var(--c4)', s: 'var(--c4-soft)',
    facts: [
      ['Quanti sono gli stili del nuoto?', 'Quattro: stile libero, dorso, rana e delfino (si chiama anche farfalla).'],
      ['Quale stile è il più giovane?', 'Il delfino! È nato dalla rana e negli anni ’50 è diventato uno stile tutto suo.'],
      ['Chi ha vinto più ori olimpici di tutti?', 'Il nuotatore americano Michael Phelps: 23 medaglie d’oro alle Olimpiadi!'],
      ['Quanto è lunga una piscina olimpionica?', '50 metri. Una vasca è più lunga di 4 autobus messi in fila!'],
      ['Perché in acqua ci si sente leggeri?', 'L’acqua spinge verso l’alto tutto quello che ci entra: si chiama spinta di Archimede.'],
      ['Una campionessa italiana?', 'Federica Pellegrini ha vinto l’oro olimpico nei 200 metri stile libero a Pechino nel 2008.']
    ],
    quiz: [
      { q: 'Quanti sono gli stili del nuoto?', o: ['4', '2', '6'], a: 0, e: 'Stile libero, dorso, rana e delfino.' },
      { q: 'Quanto è lunga una piscina olimpionica?', o: ['50 metri', '10 metri', '100 metri'], a: 0, e: '50 metri: le gare si fanno con una o più vasche.' },
      { q: 'Quale stile si nuota a pancia in su?', o: ['Il dorso', 'La rana', 'Il delfino'], a: 0, e: 'Nel dorso si guarda il cielo, o il soffitto della piscina!' },
      { q: 'Cosa ci fa galleggiare?', o: ['La spinta dell’acqua verso l’alto', 'Il costume', 'Il vento'], a: 0, e: 'È la spinta di Archimede: l’acqua ci spinge su.' },
      { q: 'Chi ha vinto più ori olimpici nella storia?', o: ['Michael Phelps', 'Federica Pellegrini', 'Usain Bolt'], a: 0, e: 'Michael Phelps, con 23 ori.' }
    ],
    mis: [
      ['Le bolle in vasca', 'Nella vasca da bagno o in piscina: soffia bolle con il naso sott’acqua contando fino a 5.'],
      ['Galleggia o affonda?', 'Metti in una bacinella oggetti diversi (tappo, cucchiaio, mela, sasso). Prima indovina, poi controlla!'],
      ['Il mio stile preferito', 'Disegna te stessa mentre nuoti nel tuo stile preferito e scrivi perché ti piace.']
    ] },
  { id: 'corpo', ic: '💪', name: 'Corpo in movimento', sk: 'Perché lo sport fa bene', c: 'var(--c1)', s: 'var(--c1-soft)',
    facts: [
      ['Muoversi aiuta a studiare?', 'Sì! Dopo un po’ di movimento arriva più ossigeno al cervello, e concentrarsi è più facile. Per questo l’app ti propone le pause.'],
      ['Saltare fa bene alle ossa?', 'Sì: saltare e correre rende le ossa più forti, proprio negli anni in cui stai crescendo.'],
      ['Perché dopo la corsa respiri forte?', 'I muscoli che lavorano chiedono più ossigeno: polmoni e cuore accelerano per portarglielo.'],
      ['Cosa bere quando fai sport?', 'Acqua! Bevi un po’ prima, durante le pause e dopo l’allenamento.'],
      ['Perché lo sport mette di buon umore?', 'Quando ti muovi il cervello produce sostanze che ti fanno sentire contenta e piena di energia.']
    ],
    quiz: [
      { q: 'Dopo un po’ di movimento, al cervello arriva…', o: ['più ossigeno', 'più sonno', 'più rumore'], a: 0, e: 'Più ossigeno = più concentrazione.' },
      { q: 'Cosa rende le ossa più forti?', o: ['Saltare e correre', 'Stare sempre seduti', 'Mangiare caramelle'], a: 0, e: 'Il movimento rinforza le ossa che stanno crescendo.' },
      { q: 'Cosa è meglio bere quando fai sport?', o: ['Acqua', 'Bibite gassate', 'Niente'], a: 0, e: 'L’acqua è la migliore amica degli sportivi.' },
      { q: 'Perché durante la corsa il cuore batte più forte?', o: ['Per portare più ossigeno ai muscoli', 'Perché ha paura', 'Per fare rumore'], a: 0, e: 'Il cuore pompa più sangue verso i muscoli che lavorano.' }
    ],
    mis: [
      ['Il cuore dopo lo sport', 'Conta i battiti prima e dopo l’allenamento di pattinaggio o di nuoto. Quanto sono cambiati?'],
      ['Settimana in movimento', 'Per una settimana segna ogni giorno che sport o movimento hai fatto. Quanti giorni attivi?'],
      ['La borraccia campionessa', 'Porta sempre la borraccia agli allenamenti e controlla di averla finita quando torni a casa.']
    ] }
];

/* Materie in più per Scopri */
const EXTRA_SUBJECTS = [
  { id: 'arte', name: 'Arte', ic: '🎨', c: 'var(--c1)', s: 'var(--c1-soft)', topic: 'Colori, forme e grandi artisti',
    motto: 'Ogni artista ha cominciato facendo scarabocchi. L’importante è provarci con fantasia!',
    facts: [
      ['Quali sono i colori primari?', 'A scuola si dice rosso, giallo e blu: mescolandoli nascono tanti altri colori. Giallo + blu = verde! Le stampanti usano un trio simile: magenta, giallo e ciano.'],
      ['Dove si trova la Gioconda?', 'Al museo del Louvre, a Parigi. L’ha dipinta Leonardo da Vinci più di 500 anni fa.'],
      ['Cosa c’è di speciale a Torino?', 'Il Museo Egizio, uno dei più importanti al mondo: ci sono statue, papiri e mummie di più di 3000 anni fa.'],
      ['Van Gogh era famoso da vivo?', 'No! Dipinse centinaia di quadri, ma ne vendette pochissimi. Oggi sono tra i più famosi del mondo.']
    ],
    missions: [
      ['Caccia ai colori caldi e freddi', 'Cerca in casa 3 oggetti di colori caldi (rosso, arancione, giallo) e 3 di colori freddi (blu, verde, viola).'],
      ['Autoritratto allo specchio', 'Guardati allo specchio e disegna il tuo viso. Poi colora con i tuoi colori preferiti.'],
      ['Il quadro di foglie', 'Raccogli foglie di colori diversi al parco e incollale per creare un animale.']
    ],
    quiz: [
      ['Quali sono i colori primari?', ['Rosso, giallo e blu', 'Verde, viola e arancione', 'Nero, bianco e grigio'], 0],
      ['Giallo + blu fanno…', ['Verde', 'Rosso', 'Rosa'], 0],
      ['Chi ha dipinto la Gioconda?', ['Leonardo da Vinci', 'Michelangelo', 'Van Gogh'], 0]
    ] },
  { id: 'musica', name: 'Musica', ic: '🎼', c: 'var(--c6)', s: 'var(--c6-soft)', topic: 'Note, ritmo e strumenti',
    motto: 'La musica è il tuo superpotere: ti aiuta a ricordare, a muoverti e a pattinare!',
    facts: [
      ['Da dove vengono i nomi delle note?', 'Da un antico canto latino: un monaco italiano, Guido d’Arezzo, usò le prime sillabe dei versi. Così sono nate ut, re, mi, fa, sol e la; più tardi «ut» è diventato «do» ed è arrivato il si.'],
      ['Quanti tasti ha un pianoforte?', '88! 52 bianchi e 36 neri.'],
      ['Quanti anni aveva Mozart quando compose i primi brani?', 'Circa 5 anni! Da bambino suonava già in giro per l’Europa.'],
      ['Musica e pattinaggio?', 'Nel pattinaggio artistico ogni esercizio si fa sulla musica: i movimenti seguono il ritmo, come in un balletto sul ghiaccio.']
    ],
    missions: [
      ['Percussioni col corpo', 'Inventa un ritmo con mani, cosce e piedi: clap-clap-pat-pat-stomp! Insegnalo a mamma o papà.'],
      ['Maracas fai da te', 'Metti un po’ di riso in una bottiglietta chiusa bene e suona sulla tua canzone preferita.'],
      ['Conta i tempi', 'Ascolta la musica di una gara di pattinaggio e batti le mani contando 1-2-3-4.']
    ],
    quiz: [
      ['Quante linee ha il pentagramma?', ['5', '7', '3'], 0],
      ['Quante sono le note musicali?', ['7', '5', '10'], 0],
      ['Quale di questi è uno strumento a corde?', ['Il violino', 'Il flauto', 'Il tamburo'], 0]
    ] },
  { id: 'civica', name: 'Cittadinanza attiva', ic: '🤝', c: 'var(--c4)', s: 'var(--c4-soft)', topic: 'Regole, diritti e ambiente',
    motto: 'Vivere insieme è come una squadra: ognuno ha diritti, doveri e un ruolo importante.',
    facts: [
      ['Quando è nata la Costituzione italiana?', 'È entrata in vigore il 1° gennaio 1948. È la legge più importante del nostro Paese.'],
      ['Perché si festeggia il 2 giugno?', 'È la Festa della Repubblica: il 2 giugno 1946 gli italiani votarono per scegliere la Repubblica. In un voto per tutta l\u2019Italia, per la prima volta votarono anche le donne!'],
      ['Anche i bambini hanno diritti?', 'Sì! Nel 1989 il mondo ha scritto la Convenzione sui diritti dell’infanzia: diritto a giocare, a studiare, a essere protetti.'],
      ['Riciclare serve davvero?', 'Sì: per esempio, rifare una lattina dall’alluminio riciclato usa molta meno energia che costruirla nuova.']
    ],
    missions: [
      ['Detective della differenziata', 'Per un giorno controlla la raccolta differenziata a casa: plastica, carta, vetro, umido. Trovi errori?'],
      ['Le regole della squadra', 'Scrivi 3 regole che renderebbero più bella la tua classe o la tua squadra di pattinaggio.'],
      ['Caccia allo spreco', 'Per un giorno spegni le luci accese nelle stanze vuote. Quante ne hai spente?']
    ],
    quiz: [
      ['Quando si festeggia la Festa della Repubblica?', ['Il 2 giugno', 'Il 25 dicembre', 'Il 1° maggio'], 0],
      ['Quali sono i colori della bandiera italiana?', ['Verde, bianco e rosso', 'Blu, bianco e rosso', 'Giallo e rosso'], 0],
      ['Dove si butta una bottiglia di plastica vuota?', ['Nella plastica', 'Nell’umido', 'Nella carta'], 0]
    ] },
  { id: 'tecno', name: 'Tecnologia', ic: '🤖', c: 'var(--c5)', s: 'var(--c5-soft)', topic: 'Macchine, invenzioni e computer',
    motto: 'Ogni invenzione è nata da una domanda: «E se provassi così?». Anche tu puoi inventare!',
    facts: [
      ['Quanto era grande il primo computer?', 'Enorme! Uno dei primi computer, nel 1946, occupava una stanza intera e pesava come 5 elefanti.'],
      ['Come «parlano» i computer?', 'Con il codice binario: usano solo due cifre, 0 e 1. Con queste fanno foto, musica e giochi!'],
      ['Quale grande azienda è nata a Torino?', 'La FIAT, nel 1899. Nella fabbrica del Lingotto c’era perfino una pista per provare le auto sul tetto!'],
      ['Quanto è vecchia la ruota?', 'È stata inventata più di 5000 anni fa, ed è ancora una delle invenzioni più utili di sempre.']
    ],
    missions: [
      ['Il telefono a bicchieri', 'Unisci due bicchieri di carta con uno spago lungo e ben teso. Parla in uno e fai ascoltare dall’altro!'],
      ['Il robot dei miei sogni', 'Disegna un robot che ti aiuta nelle routine. Cosa sa fare? Come si chiama?'],
      ['Maestra di tecnologia', 'Insegna a un nonno o una nonna a fare una foto o una videochiamata con il tablet.']
    ],
    quiz: [
      ['Quali cifre usa il codice binario dei computer?', ['0 e 1', '1 e 2', 'Tutte da 0 a 9'], 0],
      ['In quale città è nata la FIAT?', ['Torino', 'Milano', 'Roma'], 0],
      ['Perché il telefono a bicchieri funziona?', ['Il filo teso trasporta le vibrazioni del suono', 'C’è una pila nascosta', 'Per magia'], 0]
    ] }
];

/* ---------- Pause movimento: invito automatico durante lo studio ---------- */
const BREAK_EVERY = 2;          // ogni 2 attività completate…
const BREAK_MIN_GAP = 8 * 60e3; // …se sono passati almeno 8 minuti dall'ultima pausa
let breakPending = false;
function activityDone() {
  const s = store.get('brk', { n: 0, last: 0 });
  s.n++; store.set('brk', s);
  if (s.n >= BREAK_EVERY && Date.now() - s.last > BREAK_MIN_GAP) { breakPending = true; setTimeout(tryBreak, 2600); }
}
function tryBreak() {
  if (!breakPending) return;
  if (!$('modal').hidden || !$('move').hidden) { setTimeout(tryBreak, 1500); return; }
  breakPending = false;
  const m = pick(MOVES);
  const txt = 'Pausa del drago! Hai studiato tanto: 2 minuti di movimento sul posto e poi riprendiamo con il cervello pieno di energia.';
  openModal('<div>' + dragonSVG(levelOf(D.energy), D.color, 'bob') + '</div><div class="big">Pausa del drago!</div>' +
    '<p>' + esc(txt) + '</p><p style="font-size:20px">' + m.ic + ' ' + esc(m.name) + '</p>' +
    '<div class="row"><button type="button" class="btn" id="brk-go" data-focus style="--bc:' + m.c + ';--bs:' + m.s + '">Muoviamoci! 🤸‍♀️</button>' +
    '<button type="button" class="btn ghost" id="brk-later">Tra 5 minuti</button>' + sayBtn(txt) + '</div>', [m.c, m.s]);
  $('brk-go').addEventListener('click', () => { closeModal(); startMove(m.id, true); });
  $('brk-later').addEventListener('click', () => {
    const s = store.get('brk', { n: 0, last: 0 }); s.last = Date.now() - BREAK_MIN_GAP + 5 * 60e3; s.n = BREAK_EVERY - 1; store.set('brk', s); closeModal();
  });
}

/* ---------- Lettore del tutorial di movimento ---------- */
let moveTimer = null;
function startMove(id, fromBreak) {
  if (typeof Girl !== 'undefined' && Girl.ice) Girl.ice(id === 'ghiaccio');
  const m = MOVES.find(x => x.id === id);
  const ov = $('move');
  let i = -1, left = 0, paused = false;
  ov.hidden = false;
  ov.style.setProperty('--mvc', m.c); ov.style.setProperty('--mvs', m.s);
  const total = m.steps.reduce((a, s) => a + s.d, 0);
  function stop() { clearInterval(moveTimer); moveTimer = null; }
  function render() {
    const s = m.steps[i];
    const done = m.steps.slice(0, i).reduce((a, x) => a + x.d, 0) + (s.d - left);
    $('move-box').innerHTML =
      '<div class="mv-top"><span class="pill">' + m.ic + ' ' + esc(m.name) + ' · ' + (i + 1) + '/' + m.steps.length + '</span>' +
      '<button type="button" class="btn small ghost" id="mv-x">Esci</button></div>' +
      '<div class="mv-bar"><i style="width:' + Math.round(done / total * 100) + '%"></i></div>' +
      '<div class="mv-fig" id="mv-fig"></div>' +
      '<div class="mv-name"><span aria-hidden="true">' + s.e + '</span> ' + esc(s.n) + '</div>' +
      '<div class="mv-ring"><svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="52" fill="none" stroke="var(--surface-2)" stroke-width="12"/>' +
      '<circle cx="60" cy="60" r="52" fill="none" stroke="var(--mvc)" stroke-width="12" stroke-linecap="round" stroke-dasharray="326.7" stroke-dashoffset="' + (326.7 * (1 - left / s.d)).toFixed(1) + '" transform="rotate(-90 60 60)"/></svg>' +
      '<b aria-live="off">' + left + '</b></div>' +
      '<p class="mv-text">' + esc(s.t) + '</p><p class="mv-tip">💡 ' + esc(s.tip) + '</p>' +
      '<div class="row center"><button type="button" class="btn ghost" id="mv-p">' + (paused ? '▶️ Riprendi' : '⏸️ Pausa') + '</button>' +
      sayBtn(s.n + '. ' + s.t + ' ' + s.tip) + '<button type="button" class="btn" id="mv-n" style="--bc:var(--mvc);--bs:var(--mvs)">Avanti ⏭️</button></div>';
    $('mv-x').addEventListener('click', () => { stop(); ov.hidden = true; try { speechSynthesis.cancel(); } catch (e) {} });
    $('mv-p').addEventListener('click', () => { paused = !paused; render(); });
    $('mv-n').addEventListener('click', next);
    Girl.set(s.a, paused, m.c);
  }
  function next() {
    i++;
    if (i >= m.steps.length) return finish();
    left = m.steps[i].d; paused = false;
    tone(659.25, .12); render();
    Voice.ok && Voice.say(m.steps[i].n + '. ' + m.steps[i].t);
  }
  function finish() {
    stop();
    const s = store.get('brk', { n: 0, last: 0 }); s.n = 0; s.last = Date.now(); store.set('brk', s);
    const cnt = store.get('moves-done', 0) + 1; store.set('moves-done', cnt);
    $('move-box').innerHTML = '<div class="mv-fig" id="mv-fig"></div><div class="mv-name">🏅 Che energia, ' + NAME + '!</div>' +
      '<p class="mv-text">Il corpo si è svegliato e il cervello è pieno di ossigeno. ' + esc(D.name) + ' ha preso +5 🔥!</p>' +
      '<p class="mv-tip">Pause movimento fatte: ' + cnt + '</p>' +
      '<div class="row center"><button type="button" class="btn" id="mv-end" style="--bc:var(--mvc);--bs:var(--mvs)">' + (fromBreak ? 'Riprendo a studiare! 📚' : 'Fatto!') + '</button></div>';
    Girl.set('jump', false, m.c);
    fanfare(); confetti(window.innerWidth / 2, window.innerHeight / 3, 30);
    gain(5, $('move-box')); markDay('sport', $('move-box'));
    Voice.ok && Voice.say('Che energia, ' + NAME + '! Ora il cervello è pronto per ripartire.');
    $('mv-end').addEventListener('click', () => { ov.hidden = true; if (current === 'home' || current === 'sport') go(current); });
    $('mv-end').focus();
  }
  // Schermata iniziale: il tutorial completo prima di partire
  $('move-box').innerHTML =
    '<div class="mv-top"><span class="pill">' + m.ic + ' ' + esc(m.name) + '</span><button type="button" class="btn small ghost" id="mv-x0">Esci</button></div>' +
    '<div class="mv-fig" id="mv-fig"></div><div class="mv-name">' + m.ic + ' ' + esc(m.name) + '</div>' +
    '<p class="mv-text">' + esc(m.intro) + '</p>' +
    '<ol class="mv-list">' + m.steps.map(s => '<li><span aria-hidden="true">' + s.e + '</span> <b>' + esc(s.n) + '</b> · ' + s.d + ' s</li>').join('') + '</ol>' +
    '<p class="mv-tip">🦶 Fai spazio intorno a te. Scalza o con le scarpe da ginnastica, mai solo con le calze: si scivola!</p>' +
    '<div class="row center">' + sayBtn(m.intro) + '<button type="button" class="btn" id="mv-go" style="--bc:var(--mvc);--bs:var(--mvs)">Pronta, via! 🚀</button></div>';
  Girl.set('wave', false, m.c);
  $('mv-x0').addEventListener('click', () => { ov.hidden = true; });
  $('mv-go').addEventListener('click', () => {
    audio(); next();
    stop();
    moveTimer = setInterval(() => {
      if (paused || i < 0 || i >= m.steps.length || ov.hidden) { if (ov.hidden) stop(); return; }
      left--;
      if (left <= 3 && left > 0) tone(880, .07);
      if (left <= 0) next(); else render();
    }, 1000);
  });
  $('mv-go').focus();
}

/* ---------- Scheda Sport ---------- */
let sportSel = 'patt';
PAGES.sport = el => {
  const cnt = store.get('moves-done', 0);
  el.innerHTML = '<h1 class="page-title rainbow">' + esc(CHI) + ' sportiva</h1>' +
    '<p class="page-sub">Pattinaggio, ginnastica aerea e nuoto: muoviti, scopri curiosità da campionessa e fai le pause movimento tra un esercizio e l’altro.</p>' +
    '<div class="sec">' + secHead('📅', 'La mia settimana sportiva', 'Le borse da preparare sono nella scheda Routine', 'var(--c3-soft)') +
    '<div class="grid2">' + ROUTINES.filter(r => r.day !== undefined).map(r => '<div class="card" style="--kc:' + r.c + ';--ks:' + r.s + ';display:flex;gap:14px;align-items:center' + (new Date().getDay() === r.day ? ';background:' + r.s : '') + '"><span style="font-size:46px" aria-hidden="true">' + r.ic + '</span><div style="min-width:0"><div style="font-family:var(--font-display);font-weight:800;font-size:22px;text-transform:capitalize">' + GIORNI[r.day] + (new Date().getDay() === r.day ? ' · oggi!' : '') + '</div><div style="font-weight:800">' + esc(r.sport) + '</div></div></div>').join('') + '</div></div>' +
    '<div class="sec">' + secHead('🤸‍♀️', 'Pause movimento', 'Tutorial sul posto di 1–2 minuti. Pause fatte: ' + cnt, 'var(--c2-soft)') + '<div class="row" style="margin:4px 0 12px"><button type="button" class="btn small" id="sp-cust" style="--bc:var(--c6)">👧 Rendi la bambina simile a te</button></div>' + '<div id="sp-moves"></div>' +
    '<p style="font-weight:700;color:var(--ink-soft);margin:12px 0 0">Mentre studi, il drago ti proporrà una pausa da solo ogni tanto. Ogni pausa vale +5 🔥.</p></div>' +
    '<div class="sec">' + secHead('🏅', 'Curiosità da campionessa', 'Scegli uno sport', 'var(--c5-soft)') + '<div id="sp-tiles"></div><div id="sp-panel"></div></div>';
  renderTiles($('sp-moves'), MOVES.map(m => ({ id: m.id, ic: m.ic, name: m.name, sk: m.sk, c: m.c, s: m.s })), null, id => startMove(id, false));
  if ($('sp-cust')) $('sp-cust').addEventListener('click', () => openCustomize('bimba'));
  renderTiles($('sp-tiles'), SPORTS, sportSel, id => { sportSel = id; PAGES.sport(el); });
  const t = SPORTS.find(x => x.id === sportSel);
  const p = $('sp-panel');
  p.className = 'panel'; p.style.setProperty('--gc', t.c); p.style.setProperty('--gs', t.s);
  p.innerHTML = '<h3>' + t.ic + ' ' + esc(t.name) + '</h3>' +
    (t.id === 'patt' ? '<h4>⛸️ Sicura sulle lame</h4><div id="sp-skate"></div>' : '') +
    '<h4>👀 Lo sapevi?</h4><div id="sp-facts"></div>' +
    '<h4>🎯 Quiz da campionessa</h4><div id="sp-quiz"></div>' +
    '<h4>🏆 Missioni sportive</h4><ul class="missions" id="sp-mis"></ul>';
  if (t.id === 'patt') skateGuide($('sp-skate'));
  renderFacts($('sp-facts'), t.facts, 'sp-' + t.id);
  const startQuiz = () => runQuiz($('sp-quiz'), drawDeck('q-sp-' + t.id, t.quiz.length, 5).map(i => t.quiz[i]), { color: t.c, restart: startQuiz });
  startQuiz();
  renderMissions($('sp-mis'), t.mis, 'sport-' + t.id);
};

/* ================= SICURA SULLE LAME (guida tecnica per principianti) =================
   Fonti: mobilesport.ch (Ufficio federale dello sport svizzero), Wikibooks «Recreational Ice Figure Skating»,
   Learn to Skate USA. Da ripassare sempre con la maestra. */
function footTop(x, y, ang, color, label) {
  // Pattino visto dall'alto: punta in alto quando ang = 0; lama grigia sotto lo scarponcino
  return '<g transform="translate(' + x + ' ' + y + ') rotate(' + ang + ')">' +
    '<rect x="-2" y="-40" width="4" height="80" rx="2" fill="#9aa3b5"/>' +
    '<path d="M-13 30 Q-15 -10 -10 -26 Q0 -40 10 -26 Q15 -10 13 30 Q0 38 -13 30 Z" fill="' + color + '" stroke="#33304a" stroke-width="2.5"/>' +
    '<path d="M-6 -14 h12 M-7 -4 h14 M-7 6 h14" stroke="#fff" stroke-width="2" stroke-linecap="round"/>' +
    (label ? '<text x="0" y="56" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="800" font-size="13" fill="currentColor" transform="rotate(' + (-ang) + ' 0 56)">' + label + '</text>' : '') + '</g>';
}
const arrowDef = '<defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="currentColor"/></marker></defs>';
const SKATE_GUIDE = [
  { t: 'La lama: dove mettere il peso', svg:
    '<svg viewBox="0 0 320 170" role="img" aria-label="Pattino visto di lato: il peso va al centro della lama, non sul puntale">' +
    '<path d="M70 20 h70 q20 0 24 20 l10 50 q60 4 70 18 q4 12 -8 14 H70 q-8 0 -8 -10 V30 q0 -10 8 -10z" fill="#ffffff" stroke="#33304a" stroke-width="3"/>' +
    '<path d="M80 30 h50" stroke="#c9c2b4" stroke-width="3"/>' +
    '<rect x="90" y="122" width="12" height="16" fill="#9aa3b5"/><rect x="220" y="122" width="12" height="16" fill="#9aa3b5"/>' +
    '<path d="M48 138 Q60 150 160 152 Q260 150 268 136" fill="none" stroke="#6b7487" stroke-width="7" stroke-linecap="round"/>' +
    '<path d="M268 136 l8 -4 l-2 8 l8 -2 l-4 8" fill="none" stroke="#e5484d" stroke-width="3" stroke-linejoin="round"/>' +
    '<ellipse cx="185" cy="152" rx="40" ry="9" fill="#3fb27a" opacity=".35"/>' +
    '<path d="M185 108 V140" stroke="#3fb27a" stroke-width="4" marker-end="url(#ar)" color="#3fb27a"/>' + arrowDef.replace('currentColor', '#3fb27a') +
    '<text x="185" y="100" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="800" font-size="13" fill="#1f9d63">peso qui</text>' +
    '<text x="276" y="160" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="800" font-size="12" fill="#e5484d">puntale</text>' +
    '<text x="290" y="30" text-anchor="end" font-family="Nunito,sans-serif" font-weight="800" font-size="12" fill="currentColor">punta →</text>' +
    '<text x="12" y="30" font-family="Nunito,sans-serif" font-weight="800" font-size="12" fill="currentColor">← tallone</text></svg>',
    txt: 'La lama non è piatta: è un po’ curva, come una barchetta. Il peso va al centro della lama, appena dietro l’avampiede (la parte larga del piede, sotto le dita). Se ti sbilanci in avanti finisci sul puntale, i dentini davanti: lì ci si inciampa e si cade in avanti. Se ti sbilanci indietro, sul tallone, cadi all’indietro.' },
  { t: 'I due fili della lama', svg:
    '<svg viewBox="0 0 320 170" role="img" aria-label="Lama vista da dietro: filo interno, piatto, filo esterno">' +
    [[60, -14, 'filo interno'], [160, 0, 'piatto'], [260, 14, 'filo esterno']].map(([x, a, l]) =>
      '<g transform="translate(' + x + ' 120) rotate(' + a + ')"><rect x="-14" y="-90" width="28" height="70" rx="10" fill="#4b3f72"/><rect x="-16" y="-24" width="32" height="18" rx="5" fill="#ffffff" stroke="#33304a" stroke-width="2.5"/>' +
      '<path d="M-6 -6 V10 H-2 V4 Q0 1 2 4 V10 H6 V-6 Z" fill="#6b7487"/></g>' +
      '<line x1="' + (x - 40) + '" y1="131" x2="' + (x + 40) + '" y2="131" stroke="#5aa9ff" stroke-width="4"/>' +
      '<text x="' + x + '" y="158" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="800" font-size="13" fill="currentColor">' + l + '</text>').join('') +
    '<text x="160" y="20" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="800" font-size="12" fill="currentColor">gamba destra vista da dietro</text></svg>',
    txt: 'Sotto la lama c’è un piccolo canale: così la lama ha due spigoli, che si chiamano fili. Il filo interno è dalla parte dell’alluce, il filo esterno dalla parte del mignolo. Quando la caviglia è dritta scivoli sul «piatto», su tutti e due i fili. Per spingere si usa il filo interno. Attenzione: la caviglia non deve cadere verso l’interno da ferma. Se succede, i lacci sono troppo lenti: chiedi alla maestra.' },
  { t: 'Posizione di base', svg:
    '<svg viewBox="0 0 320 170" role="img" aria-label="Posizione di base vista dall’alto: piedi a V, talloni vicini">' + arrowDef +
    '<path d="M160 70 V22" stroke="currentColor" stroke-width="3" marker-end="url(#ar)"/><text x="172" y="30" font-family="Nunito,sans-serif" font-weight="800" font-size="12" fill="currentColor">avanti</text>' +
    footTop(140, 110, -22, '#ffffff', '') + footTop(180, 110, 22, '#ffffff', '') +
    '<text x="160" y="165" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="800" font-size="13" fill="currentColor">talloni vicini, punte aperte: la «V»</text></svg>',
    txt: 'Ginocchia piegate, come se stessi per sederti su uno sgabello alto. Busto dritto, non piegato in avanti dalla vita. Braccia aperte di lato, un po’ in avanti, all’altezza della pancia, come se appoggiassi le mani su un tavolo. Sguardo avanti, non sui piedi. Il peso è diviso a metà sui due piedi. Per partire, i piedi stanno a V: talloni vicini e punte aperte.' },
  { t: 'Camminare come un pinguino', svg:
    '<svg viewBox="0 0 320 170" role="img" aria-label="Passi a V alternati, come un pinguino">' + arrowDef +
    footTop(120, 120, -22, '#ffffff', '1') + footTop(175, 80, 22, '#dcedff', '2') + footTop(130, 40, -22, '#ffffff', '3') +
    '<path d="M240 140 V30" stroke="currentColor" stroke-width="3" marker-end="url(#ar)"/><text x="250" y="90" font-family="Nunito,sans-serif" font-weight="800" font-size="12" fill="currentColor">avanti</text></svg>',
    txt: 'Dalla V fai piccoli passi, appoggiando ogni volta tutta la lama sul ghiaccio, piatta, e non solo la punta. Un piede, poi l’altro, con le ginocchia sempre piegate: proprio come un pinguino! Quando ti senti sicura, i passi diventano piccole scivolate.' },
  { t: 'La spinta e la scivolata', svg:
    '<svg viewBox="0 0 320 170" role="img" aria-label="Spinta: un piede scivola avanti, l’altro spinge di lato e indietro col filo interno">' + arrowDef +
    footTop(120, 85, 0, '#dcedff', '') + footTop(195, 105, 48, '#ffffff', '') +
    '<text x="80" y="95" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="800" font-size="13" fill="#1f9d63">scivola</text>' +
    '<text x="160" y="150" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="800" font-size="13" fill="#d9771f">spinge</text>' +
    '<path d="M120 40 V10" stroke="#3fb27a" stroke-width="4" marker-end="url(#ar)" color="#3fb27a"/>' +
    '<path d="M215 120 L262 150" stroke="#ff9f43" stroke-width="4" marker-end="url(#ar)" color="#ff9f43"/>' +
    '<text x="240" y="114" font-family="Nunito,sans-serif" font-weight="800" font-size="12" fill="#d9771f">di lato e indietro</text></svg>',
    txt: 'Piega le ginocchia. Il peso va sul piede che scivola in avanti. L’altro piede, girato un po’ verso l’esterno, spinge sul ghiaccio con il filo interno, di lato e un po’ all’indietro, e mai dritto indietro con il puntale. Poi riporta il piede che ha spinto vicino all’altro e cambia: spinta, scivolata, spinta, scivolata.' },
  { t: 'Frenare: il mezzo spazzaneve', svg:
    '<svg viewBox="0 0 320 170" role="img" aria-label="Mezzo spazzaneve: un piede dritto, l’altro girato con la punta verso l’interno che raschia il ghiaccio">' + arrowDef +
    footTop(135, 90, 0, '#ffffff', 'dritto') + footTop(185, 80, -28, '#ffe3ea', 'frena') +
    '<path d="M205 50 l10 -3 M208 62 l12 -3 M210 74 l12 -3" stroke="#9aa3b5" stroke-width="3" stroke-linecap="round"/>' +
    '<path d="M60 140 V40" stroke="currentColor" stroke-width="3" marker-end="url(#ar)"/><text x="70" y="90" font-family="Nunito,sans-serif" font-weight="800" font-size="12" fill="currentColor">avanti</text></svg>',
    txt: 'È il modo più facile per fermarsi, simile allo spazzaneve dello sci. Mentre scivoli con i piedi paralleli, sposta il peso su un piede. Gira l’altro con la punta un po’ verso l’interno, portalo leggermente avanti e premi piano sul filo interno: la lama raschia il ghiaccio e rallenti. Ginocchia piegate e busto dritto, se no si cade in avanti. Quando sarai più brava, girerai tutti e due i piedi: lo spazzaneve completo.' },
  { t: 'Cadere bene e rialzarsi', svg:
    '<svg viewBox="0 0 320 170" role="img" aria-label="Tre passaggi per rialzarsi: in ginocchio, un piede tra le mani, in piedi">' +
    '<text x="55" y="70" text-anchor="middle" font-size="44">🧎‍♀️</text><text x="160" y="70" text-anchor="middle" font-size="44">🦵</text><text x="265" y="70" text-anchor="middle" font-size="44">🧍‍♀️</text>' +
    '<text x="55" y="110" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="800" font-size="13" fill="currentColor">1. in ginocchio</text>' +
    '<text x="160" y="110" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="800" font-size="13" fill="currentColor">2. un piede tra</text><text x="160" y="126" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="800" font-size="13" fill="currentColor">le mani</text>' +
    '<text x="265" y="110" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="800" font-size="13" fill="currentColor">3. spingi e alzati</text></svg>',
    txt: 'Cadere capita a tutti, anche alle campionesse! Se perdi l’equilibrio, piega le ginocchia e lasciati andare di lato, non all’indietro sulla testa e non in avanti sulle mani tese. Tieni le mani vicine al corpo, così nessuno le pesta. Per rialzarti: girati in ginocchio, appoggia le mani sul ghiaccio, porta un piede tra le mani, poi l’altro, e spingi per alzarti. Fallo subito: stare seduti sul ghiaccio è pericoloso perché gli altri pattinano.' }
];
const SKATE_ERRORS = [
  ['🦵', 'Gambe dritte', 'Con le gambe tese si perde l’equilibrio. Ginocchia sempre morbide e piegate!'],
  ['🙇‍♀️', 'Busto piegato in avanti', 'Se ti pieghi dalla vita il peso va sul puntale e inciampi. Schiena dritta, piega le ginocchia.'],
  ['👀', 'Guardare i piedi', 'Lo sguardo va avanti, dove vuoi andare. I piedi sanno cosa fare!'],
  ['🦶', 'Caviglie che cadono verso l’interno', 'Spesso i lacci sono troppo lenti sulla caviglia: rileggi «allacciare bene lo scarponcino» qui sopra. Se succede ancora, dillo alla maestra.'],
  ['⛸️', 'Spingere con il puntale', 'La spinta si fa con il filo interno, di lato. Il puntale serve solo per alcuni salti.']
];
const SKATE_CHECK = [
  ['🎀', 'Lacci allacciati come nella guida: dita comode, caviglia stretta, prova delle 2 dita'],
  ['🧤', 'Guanti e vestiti caldi (e il casco, se la maestra lo chiede)'],
  ['🛡️', 'Togli i copri-lama prima di entrare sul ghiaccio: con quelli si scivola!'],
  ['🔁', 'Rimetti i copri-lama appena esci dalla pista'],
  ['🧻', 'Alla fine asciuga bene le lame con il panno, così non arrugginiscono']
];
const DRY = [
  ['🪑', 'Lo sgabello invisibile', 'Scalza, piedi un po’ aperti: piega le ginocchia come per sederti, busto dritto, braccia avanti. Resta 10 secondi. Questa è la posizione del pattinaggio!'],
  ['🐧', 'Il pinguino in salotto', 'Talloni vicini e punte aperte a V: fai 10 piccoli passi da pinguino con le ginocchia piegate.'],
  ['🦩', 'Equilibrio su un piede', 'Su un piede, ginocchio morbido, braccia aperte: conta fino a 10, poi cambia piede. Sul ghiaccio ti serve per scivolare!'],
  ['🧎‍♀️', 'Prova a rialzarti', 'Sul tappeto: mettiti in ginocchio, porta un piede avanti tra le mani e alzati, come sul ghiaccio. Rifallo 3 volte.']
];
function skateGuide(box) {
  box.innerHTML = '<div class="explain" style="background:var(--c5-soft);margin:0 0 12px">⛸️ Una guida passo passo per sentirti più sicura sulle lame. Ripassala con la maestra: lei sa cosa serve proprio a te!</div>' +
    laceCard() +
    '<div class="grid2" id="sk-cards"></div>' +
    '<h4>🚫 Gli errori più comuni</h4><div class="grid2" id="sk-err"></div>' +
    '<h4>✅ Prima di entrare in pista</h4><ul class="missions" id="sk-check"></ul>' +
    '<h4>🏠 Allenati a secco, a casa</h4><ul class="missions" id="sk-dry"></ul>' +
    '<p style="font-weight:700;color:var(--ink-soft);margin-top:12px">Vuoi vedere foto e video degli esercizi? Chiedi a mamma o papà di cercarli insieme a te sul sito <b>mobilesport.ch</b> (pattinaggio artistico: «pattinare in avanti» e «frenare»). 🔒 Su internet si naviga sempre con un adulto.</p>';
  const cards = $('sk-cards');
  SKATE_GUIDE.forEach((g, i) => {
    const d = document.createElement('div');
    d.className = 'card'; d.style.cssText = '--kc:' + PAL[i % 6][0] + ';--ks:' + PAL[i % 6][1] + ';padding:16px';
    d.innerHTML = '<div class="row between" style="flex-wrap:nowrap"><div style="font-family:var(--font-display);font-weight:800;font-size:20px;line-height:1.15"><span style="color:var(--ink-soft)">' + (i + 1) + '.</span> ' + esc(g.t) + '</div>' + sayBtn(g.t + '. ' + g.txt) + '</div>' +
      '<div class="viz" style="color:var(--ink);background:var(--surface-2);border-radius:16px;padding:8px;margin-top:10px">' + g.svg.replace(/id="ar"/g, 'id="ar' + i + '"').replace(/url\(#ar\)/g, 'url(#ar' + i + ')').replace('<svg ', '<svg width="320" style="max-width:100%;height:auto" ') + '</div>' +
      '<p style="margin:10px 0 0;font-weight:700;font-size:16.5px">' + esc(g.txt) + '</p>';
    cards.appendChild(d);
  });
  $('sk-err').innerHTML = SKATE_ERRORS.map(e => '<div class="card" style="padding:12px 14px;display:flex;gap:12px;align-items:flex-start;--kc:var(--bad);--ks:var(--bad-soft)"><span style="font-size:32px" aria-hidden="true">' + e[0] + '</span><div style="min-width:0"><b>' + esc(e[1]) + '</b><div style="font-weight:700;color:var(--ink-soft)">' + esc(e[2]) + '</div></div></div>').join('');
  renderMissions($('sk-check'), SKATE_CHECK.map(c => [c[0] + ' ' + c[1], '']), 'skate-check');
  renderMissions($('sk-dry'), DRY.map(c => [c[0] + ' ' + c[1], c[2]]), 'skate-dry');
}

/* ---------- Allacciare lo scarponcino (fonti: Riedell, NU Skate Club) ---------- */
const LACE_SVG = '<svg viewBox="0 0 330 210" width="330" style="max-width:100%;height:auto" role="img" aria-label="Scarponcino visto di lato con tre zone: dita comode, caviglia stretta, ganci medi">' +
  '<path d="M60 20 h70 q16 0 20 16 l10 70 q70 6 104 26 q14 10 4 26 H60 q-12 0 -12 -12 V32 q0 -12 12 -12z" fill="#ffffff" stroke="#33304a" stroke-width="3"/>' +
  '<path d="M196 120 q40 6 64 20" fill="none" stroke="#5aa9ff" stroke-width="9" stroke-linecap="round" opacity=".75"/>' +
  '<path d="M148 92 L176 116" fill="none" stroke="#e5484d" stroke-width="10" stroke-linecap="round" opacity=".75"/>' +
  '<path d="M140 28 L147 80" fill="none" stroke="#ff9f43" stroke-width="10" stroke-linecap="round" opacity=".75"/>' +
  '<circle cx="141" cy="34" r="4" fill="#33304a"/><circle cx="143" cy="50" r="4" fill="#33304a"/><circle cx="145" cy="66" r="4" fill="#33304a"/>' +
  '<path d="M62 158 Q64 170 160 172 Q262 170 272 156" fill="none" stroke="#6b7487" stroke-width="7" stroke-linecap="round"/>' +
  '<rect x="76" y="158" width="12" height="12" fill="#9aa3b5"/><rect x="226" y="154" width="12" height="14" fill="#9aa3b5"/>' +
  '<text x="276" y="118" font-family="Nunito,sans-serif" font-weight="800" font-size="12" fill="#2f7bd9">dita:</text><text x="276" y="132" font-family="Nunito,sans-serif" font-weight="800" font-size="12" fill="#2f7bd9">comode</text>' +
  '<text x="190" y="86" font-family="Nunito,sans-serif" font-weight="800" font-size="12" fill="#d63a40">caviglia:</text><text x="190" y="100" font-family="Nunito,sans-serif" font-weight="800" font-size="12" fill="#d63a40">più stretta</text>' +
  '<text x="160" y="36" font-family="Nunito,sans-serif" font-weight="800" font-size="12" fill="#d9771f">ganci: medi,</text><text x="160" y="50" font-family="Nunito,sans-serif" font-weight="800" font-size="12" fill="#d9771f">2 dita</text>' +
  '<path d="M66 132 l-14 0 m4 -6 l-6 6 l6 6" fill="none" stroke="#3fb27a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><text x="20" y="150" font-family="Nunito,sans-serif" font-weight="800" font-size="11" fill="#1f9d63">tallone in fondo</text>' +
  '<text x="20" y="200" font-family="Nunito,sans-serif" font-weight="800" font-size="12" fill="currentColor">← tallone</text><text x="310" y="200" text-anchor="end" font-family="Nunito,sans-serif" font-weight="800" font-size="12" fill="currentColor">punta →</text></svg>';
const LACE_STEPS = [
  ['🧦', 'Calza sottile e lacci aperti', 'Una calza sottile, senza pieghe. Allenta bene i lacci prima di infilare il piede, così non rovini lo scarponcino.'],
  ['👟', 'Tallone in fondo', 'Seduta, appoggia il tallone a terra con la punta in su e batti piano il tallone verso il fondo: deve stare tutto dietro, nella sua «coppa».'],
  ['👅', 'Linguetta dritta', 'Tira su la linguetta e mettila bene al centro, senza pieghe.'],
  ['🦶', 'Sulle dita: comodo', 'Dai primi buchi in basso tira i lacci senza stringere troppo: le dita devono potersi muovere un po’.'],
  ['🔒', 'Sulla caviglia: più stretto', 'Salendo verso la piega della caviglia stringi di più, a ogni incrocio. È qui che serve il sostegno: il tallone non deve alzarsi. Prova: con un dito non riesci a tirare fuori un’asola del laccio.'],
  ['🪝', 'Sui ganci: medio', 'Sui ganci in alto stringi un po’ meno. Prova delle 2 dita: devi riuscire a infilare due dita tra laccio e gamba fino al secondo gancio.'],
  ['🎀', 'Doppio fiocco e niente code', 'Chiudi con un doppio fiocco. Non avvolgere i lacci intorno alla caviglia e non lasciarli penzolare: ci si può inciampare.']
];
const LACE_WHY = [
  ['Caviglia stretta', 'tiene la caviglia dritta, così la lama appoggia giusta sul ghiaccio e non cade sul filo interno. È il segreto per sentirsi sicura!'],
  ['Tallone fermo', 'se il tallone si alza dentro lo scarponcino, il pattino non segue il piede e si perde il controllo.'],
  ['Dita comode', 'il sangue circola bene, i piedi restano caldi e non fanno male.'],
  ['Ganci non troppo stretti', 'servono per piegare caviglie e ginocchia in avanti, la posizione base del pattinaggio.']
];
function laceCard() {
  return '<div class="card" style="--kc:var(--c5);--ks:var(--c5-soft);padding:16px;margin-bottom:16px">' +
    '<div class="row between" style="flex-wrap:nowrap"><div style="font-family:var(--font-display);font-weight:800;font-size:22px;line-height:1.15">🎀 Prima di tutto: allacciare bene lo scarponcino</div>' +
    sayBtn('Come allacciare lo scarponcino. ' + LACE_STEPS.map((s, i) => (i + 1) + ': ' + s[1] + '. ' + s[2]).join(' ')) + '</div>' +
    '<p style="font-weight:700;margin:6px 0 0">Spesso, se non ci si sente sicure sulle lame, il problema è proprio l’allacciatura! Le prime volte fatti aiutare da mamma o papà a tirare i lacci.</p>' +
    '<div class="viz" style="color:var(--ink);background:var(--surface-2);border-radius:16px;padding:8px;margin-top:10px">' + LACE_SVG + '</div>' +
    '<ol class="steps" style="margin-top:12px">' + LACE_STEPS.map((s, i) => '<li><div class="step" style="--sc:' + PAL[i % 6][0] + ';--ss:' + PAL[i % 6][1] + ';box-shadow:none;cursor:default"><span class="num">' + (i + 1) + '</span><span class="pic" aria-hidden="true">' + s[0] + '</span><span class="tx"><span class="nm">' + esc(s[1]) + '</span><span class="ds">' + esc(s[2]) + '</span></span></div></li>').join('') + '</ol>' +
    '<h4 style="margin-top:16px">❓ Perché si allaccia così?</h4><div class="grid2">' +
    LACE_WHY.map(w => '<div class="explain" style="margin:0"><b>' + esc(w[0]) + '</b>: ' + esc(w[1]) + '</div>').join('') + '</div>' +
    '<div class="explain" style="background:var(--leaf-soft);margin-top:12px"><b>Prova finale, in piedi:</b> piega le ginocchia in avanti. Il tallone non si alza, le caviglie restano dritte e non senti formicolii. Se una caviglia cade verso l’interno anche con i lacci stretti, dillo alla maestra: forse lo scarponcino va controllato.</div></div>';
}
