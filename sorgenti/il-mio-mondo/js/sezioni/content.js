/* ================= CONTENUTI IN PIÙ (verificati) =================
   Si aggiungono alle liste già esistenti. Ogni curiosità e domanda è stata controllata. */

/* ---------- Mazzi: ogni elemento torna solo dopo che sono usciti tutti gli altri ---------- */
function drawDeck(key, total, n) {
  n = Math.min(n, total);
  let d = store.get('deck-' + key, null);
  if (!d || d.total !== total || !Array.isArray(d.q)) d = { total: total, q: [], last: [] };
  const out = [];
  let guard = 0;
  while (out.length < n && guard++ < 1000) {
    if (!d.q.length) {
      // nuovo giro: gli ultimi usciti vanno in fondo, così non si ripetono subito
      const recent = new Set(d.last.concat(out));
      const fresh = shuffle([...Array(total).keys()]);
      d.q = fresh.filter(x => !recent.has(x)).concat(fresh.filter(x => recent.has(x)));
    }
    const x = d.q.shift();
    if (!out.includes(x)) out.push(x);
  }
  d.last = out.slice(-Math.max(1, Math.floor(total / 3)));
  store.set('deck-' + key, d);
  return out;
}

/* ---------- Frasi della forza in più ---------- */
FORZA.push(
  'Ogni campionessa è stata prima una principiante.',
  'Prova, sbaglia, riprova: così si impara a pattinare e anche a studiare.',
  'Non devi essere perfetta: devi solo provarci con il cuore.',
  'Un errore è solo un passo verso la risposta giusta.',
  'Il tuo impegno di oggi è il tuo superpotere di domani.',
  'Anche la montagna più alta si scala un passo alla volta.',
  'Quando cadi sul ghiaccio ti rialzi: fai lo stesso con i compiti!',
  'La pazienza è la forza segreta dei campioni.',
  'Chiedere aiuto è una cosa da persone coraggiose.',
  'Se ti sembra difficile, vuol dire che stai crescendo.',
  'Il drago più forte è quello che non si arrende.',
  'Respira, concentrati e riparti.',
  'Sei capace di molto più di quanto pensi.',
  'Una cosa alla volta, fatta bene, vale più di tante fatte di corsa.',
  'Ogni giorno impari qualcosa di nuovo: anche oggi!',
  'Il coraggio cresce ogni volta che lo usi.'
);

/* ---------- Barzellette: spiegazioni per quelle con un modo di dire ---------- */
const JOKE_WHY = {
  'Qual è il colmo per una pattinatrice?': '«Rompere il ghiaccio» vuol dire cominciare a parlare con qualcuno e fare amicizia. Ma il ghiaccio è anche quello della pista!',
  'Perché il libro di matematica è sempre triste?': 'I problemi sono gli esercizi di matematica, ma «avere tanti problemi» vuol dire anche essere preoccupati.',
  'Qual è il colmo per un pianista?': 'La scala musicale è do-re-mi-fa-sol-la-si, ma la scala è anche quella con i gradini!',
  'Perché i pesci sono così bravi a scuola?': 'Un gruppo di pesci che nuotano insieme si chiama «banco», proprio come il banco di scuola.',
  'Qual è il colmo per un sarto?': '«Perdere il filo del discorso» vuol dire dimenticare cosa si stava dicendo. E il sarto lavora con ago e filo!',
  'Maestra: «Pierino, perché sei in ritardo?»': 'Il cartello «Scuola, rallentare» è per le automobili, non per gli studenti!',
  'Perché lo scheletro non litiga mai con nessuno?': '«Non avere il fegato» vuol dire non avere coraggio. E lo scheletro ha solo le ossa!',
  'Qual è il colmo per un fornaio?': '«Essere un pezzo di pane» vuol dire essere una persona buonissima.',
  'Qual è il colmo per un giardiniere?': '«Piantare in asso» vuol dire lasciare qualcuno da solo all’improvviso. E il giardiniere pianta i fiori!',
  'Qual è il colmo per un drago?': 'Un «fuoco di paglia» è una voglia che dura pochissimo, come la paglia che brucia in un attimo.',
  'Qual è il colmo per una cuoca?': '«Avere sale in zucca» vuol dire essere giudiziosi. E la cuoca usa sempre il sale!',
  'Qual è il colmo per un astronauta?': '«Avere la testa fra le nuvole» vuol dire essere distratti. E l’astronauta vola anche più su delle nuvole!',
  'Qual è il colmo per un matematico?': '«Avere i giorni contati» vuol dire che manca poco alla fine. E il matematico passa la vita a contare!',
  'Qual è il colmo per un elettricista?': '«Essere al corrente» vuol dire conoscere le notizie. Ma la corrente è anche quella elettrica!',
  'Qual è il colmo per un idraulico?': '«Non capire un tubo» vuol dire non capire niente. E l’idraulico lavora con i tubi!',
  'Qual è il colmo per un pittore?': '«Passare la notte in bianco» vuol dire non dormire. E il pittore usa i colori, anche il bianco!',
  'Qual è il colmo per un’acrobata?': '«Essere appesi a un filo» vuol dire essere in una situazione incerta. E l’acrobata sta davvero appesa!',
  'Qual è il colmo per una nuotatrice?': '«Fare un tuffo nel passato» vuol dire ricordare cose di tanto tempo fa.',
  'Qual è il colmo per un musicista?': 'La nota è sia quella musicale sia quella che la maestra scrive sul diario!',
  'Qual è il colmo per un dentista?': '«Avere il dente avvelenato» vuol dire essere arrabbiati con qualcuno.'
};
JOKES.push(
  ['Qual è il colmo per un falegname?', 'Fare un buco nell’acqua! 🪚', '«Fare un buco nell’acqua» vuol dire provarci senza riuscirci. E il falegname fa i buchi nel legno!'],
  ['Qual è il colmo per un vetraio?', 'Non vederci chiaro! 🪟', '«Non vederci chiaro» vuol dire non capire bene una cosa. E il vetro è trasparente!'],
  ['Qual è il colmo per un contadino?', 'Seminare il panico! 🌾', '«Seminare il panico» vuol dire spaventare tutti. E il contadino semina i campi!'],
  ['Qual è il colmo per un sub?', 'Avere l’acqua alla gola! 🤿', '«Avere l’acqua alla gola» vuol dire essere in difficoltà, avere poco tempo.'],
  ['Qual è il colmo per un pescatore?', 'Prendere un granchio! 🦀', '«Prendere un granchio» vuol dire sbagliarsi. E il pescatore cerca i pesci, non i granchi!'],
  ['Qual è il colmo per un attore?', 'Fare scena muta! 🎭', '«Fare scena muta» vuol dire restare senza parole, per esempio durante un’interrogazione.'],
  ['Qual è il colmo per un’insegnante?', 'Non avere classe! 🏫', '«Avere classe» vuol dire essere eleganti. E l’insegnante ha sempre una classe di alunni!'],
  ['Qual è il colmo per un barbiere?', 'Fare il pelo e il contropelo a tutti! 💈', '«Fare il pelo e il contropelo» vuol dire criticare ogni piccolo dettaglio.'],
  ['Qual è il colmo per un medico?', 'Perdere la pazienza… con i pazienti! 🩺', 'I pazienti sono le persone che va a curare: e lui dovrebbe essere paziente!'],
  ['Qual è il colmo per un cartolaio?', 'Fare carte false! 📝', '«Fare carte false» vuol dire fare di tutto per ottenere qualcosa.'],
  ['Qual è il colmo per un vulcano?', 'Avere un carattere esplosivo! 🌋', 'Una persona «esplosiva» si arrabbia all’improvviso, come un vulcano che erutta.'],
  ['Qual è il colmo per una ginnasta?', 'Fare i salti mortali per finire i compiti! 🤸‍♀️', '«Fare i salti mortali» vuol dire fare di tutto, impegnarsi tantissimo.'],
  ['Qual è il colmo per un calciatore?', 'Non riuscire a scartare i regali! ⚽', 'Nel calcio «scartare» vuol dire superare un avversario; con i regali vuol dire aprirli!'],
  ['Qual è il colmo per un’acrobata dei tessuti?', 'Non avere la stoffa! 🎪', '«Avere la stoffa» vuol dire avere talento. E i tessuti aerei sono proprio di stoffa!'],
  ['Qual è il colmo per un fantasma?', 'Avere paura del buio! 👻', ''],
  ['Perché la pattinatrice non si arrabbia mai?', 'Perché ha sempre il sangue freddo! ⛸️', '«Avere sangue freddo» vuol dire restare calmi. E sul ghiaccio fa freddo davvero!'],
  ['Perché la nuotatrice non presta mai i soldi?', 'Perché non vuole restare a secco! 🏊‍♀️', '«Restare a secco» vuol dire restare senza soldi. E una nuotatrice sta sempre in acqua!'],
  ['Perché il pomodoro non riesce a dormire?', 'Perché l’insalata… russa! 🍅', 'L’insalata russa è un piatto, ma «russa» vuol dire anche che fa rumore dormendo!'],
  ['Che cosa dice una mucca a un’altra mucca?', 'Muuuuoviti! 🐄', ''],
  ['Perché i fantasmi non dicono bugie?', 'Perché gli si vede attraverso! 👻', 'I fantasmi sono trasparenti: si vede attraverso di loro, e anche attraverso le loro bugie!'],
  ['Che cosa fa un’ape in palestra?', 'Zumba! 🐝', 'La zumba è un ballo da palestra, e le api fanno «zzz»!'],
  ['Che cosa dice lo 0 all’8?', 'Che bella cintura! 0️⃣', 'L’8 sembra proprio uno 0 con una cintura stretta in vita!'],
  ['Maestra: «Pierino, dimmi una parola con tante O».', '«Gooool!» ⚽', ''],
  ['Maestra: «Pierino, coniuga il verbo camminare, più veloce!»', '«Io corro, tu corri, egli corre!» 🏃', 'La maestra voleva che parlasse più veloce, ma lui ha cominciato a correre!'],
  ['Perché il computer va dal dottore?', 'Perché ha preso un virus! 💻', 'Anche i computer possono prendere un «virus»: un programma cattivo che li fa funzionare male.'],
  ['Che cosa dice un semaforo a un altro semaforo?', 'Non guardarmi, mi sto cambiando! 🚦', 'Il semaforo cambia colore… e le persone si cambiano i vestiti!'],
  ['Che cosa fa un tovagliolo sul tavolo?', 'Si piega dalle risate! 😂', '«Piegarsi dalle risate» vuol dire ridere tantissimo. E il tovagliolo si piega davvero!'],
  ['Perché la pera è sempre ottimista?', 'Perché… s-pera! 🍐', '«Spera» contiene la parola «pera». Chi spera è fiducioso!'],
  ['Quale animale salta più in alto di una casa?', 'Tutti: le case non saltano! 🏠', ''],
  ['Che cosa ha il collo ma non ha la testa?', 'La bottiglia! 🍾', ''],
  ['Più è grande e meno si vede. Che cos’è?', 'Il buio! 🌑', ''],
  ['Che cosa si rompe appena dici il suo nome?', 'Il silenzio! 🤫', ''],
  ['Ha i denti ma non morde mai. Che cos’è?', 'Il pettine! 🪮', ''],
  ['Più si bagna e più asciuga. Che cos’è?', 'L’asciugamano! 🧺', ''],
  ['Ha il letto ma non dorme mai. Che cos’è?', 'Il fiume! 🏞️', 'Il «letto» del fiume è il fondo dove scorre l’acqua.'],
  ['Qual è il pesce più divertente?', 'Il pesce pagliaccio! 🐠', 'Esiste davvero: è arancione a strisce bianche e vive tra gli anemoni di mare.'],
  ['Perché il polpo è bravissimo a contare?', 'Perché ha otto braccia! 🐙', 'Il polpo ha davvero otto braccia, e su ognuna ci sono tante ventose.']
);
JOKES.forEach(j => { if (j.length < 3) j.push(JOKE_WHY[j[0]] || ''); });

/* ---------- Scienze: più curiosità e più domande ---------- */
const SCI_MORE = {
  corpo: {
    facts: [
      ['Quanto è grande il tuo cuore?', 'Più o meno come il tuo pugno chiuso. E cresce insieme a te!'],
      ['Qual è l’osso più lungo del corpo?', 'Il femore, nella coscia. È anche uno dei più robusti.'],
      ['Quante volte respiri in un giorno?', 'Più di 15.000 volte, senza nemmeno pensarci!'],
      ['Crescono più veloci le unghie delle mani o dei piedi?', 'Quelle delle mani: crescono più in fretta di quelle dei piedi.'],
      ['Quanti denti da latte hanno i bambini?', '20. Poi cadono e arrivano quelli definitivi, che negli adulti sono fino a 32.'],
      ['Qual è il muscolo più grande del corpo?', 'Il grande gluteo, nel sedere: ti aiuta a stare in piedi, camminare, saltare e pattinare!']
    ],
    quiz: [
      { q: 'Quale organo pulisce il sangue e produce la pipì?', o: ['I reni', 'Il cuore', 'I polmoni'], a: 0, e: 'I reni filtrano il sangue e buttano fuori gli scarti con la pipì.' },
      { q: 'Che cosa protegge il cervello?', o: ['Il cranio', 'Le costole', 'La rotula'], a: 0, e: 'Il cranio è come un casco di osso intorno al cervello.' },
      { q: 'Che cosa protegge cuore e polmoni?', o: ['Le costole', 'Il cranio', 'Il femore'], a: 0, e: 'Le costole formano la gabbia toracica, una specie di cassaforte per cuore e polmoni.' },
      { q: 'Come si chiamano i punti in cui due ossa si incontrano e si piegano?', o: ['Articolazioni', 'Muscoli', 'Nervi'], a: 0, e: 'Ginocchio, gomito e caviglia sono articolazioni: senza di loro non potresti pattinare!' },
      { q: 'Quanti sono i denti da latte?', o: ['20', '32', '10'], a: 0, e: 'I bambini hanno 20 denti da latte, poi arrivano quelli definitivi.' },
      { q: 'Qual è l’osso più lungo del corpo?', o: ['Il femore', 'La staffa', 'La costola'], a: 0, e: 'Il femore, nella coscia.' },
      { q: 'A cosa serve l’apparato respiratorio?', o: ['A respirare', 'A digerire', 'A pensare'], a: 0, e: 'Naso, trachea e polmoni portano l’aria dentro e fuori dal corpo.' }
    ]
  },
  spazio: {
    facts: [
      ['Chi è stata la prima donna nello spazio?', 'Valentina Tereškova, nel 1963. Il suo nome in codice era «Gabbiano»!'],
      ['Chi è la prima astronauta italiana?', 'Samantha Cristoforetti: è andata nello spazio nel 2014 ed è stata a lungo sulla Stazione Spaziale Internazionale.'],
      ['Perché la Luna cambia forma?', 'La Luna non fa luce da sola: riflette la luce del Sole. Mentre gira intorno alla Terra ne vediamo illuminate parti diverse: sono le fasi lunari.'],
      ['Dove si trova il vulcano più alto del sistema solare?', 'Su Marte: si chiama Monte Olimpo ed è alto più di due volte l’Everest.'],
      ['Perché le impronte sulla Luna sono ancora lì?', 'Sulla Luna non c’è vento né pioggia che possano cancellarle.'],
      ['Le stelle sono piccole?', 'No! Sembrano puntini perché sono lontanissime. Tante sono anche più grandi del Sole.']
    ],
    quiz: [
      { q: 'Quale pianeta ha gli anelli più famosi e più facili da vedere?', o: ['Saturno', 'Marte', 'Mercurio'], a: 0, e: 'Saturno: i suoi anelli sono fatti di pezzi di ghiaccio e roccia.' },
      { q: 'Quanto ci mette la Luna a fare un giro intorno alla Terra?', o: ['Circa un mese', 'Un giorno', 'Un anno'], a: 0, e: 'Circa 27 giorni: più o meno un mese.' },
      { q: 'Come si chiama la nostra galassia?', o: ['La Via Lattea', 'Il Grande Carro', 'La Via Appia'], a: 0, e: 'La Via Lattea: il Sole è una delle sue miliardi di stelle.' },
      { q: 'Chi è stato il primo uomo a camminare sulla Luna?', o: ['Neil Armstrong', 'Galileo Galilei', 'Cristoforo Colombo'], a: 0, e: 'Neil Armstrong, nel 1969.' },
      { q: 'Chi è stata la prima donna nello spazio?', o: ['Valentina Tereškova', 'Marie Curie', 'Federica Pellegrini'], a: 0, e: 'Valentina Tereškova, nel 1963. Il suo nome in codice era «Gabbiano»!' },
      { q: 'Qual è il pianeta più caldo?', o: ['Venere', 'Mercurio', 'Marte'], a: 0, e: 'Venere, anche se Mercurio è più vicino al Sole: la sua atmosfera spessa intrappola il calore.' },
      { q: 'Perché vediamo la Luna cambiare forma?', o: ['Vediamo illuminate parti diverse', 'La Luna si rompe', 'Le nuvole la mangiano'], a: 0, e: 'La Luna riflette la luce del Sole: sono le fasi lunari.' }
    ]
  },
  energia: {
    facts: [
      ['Di che colore è la luce del Sole?', 'Sembra bianca, ma dentro ci sono tutti i colori: l’arcobaleno li separa.'],
      ['Il suono va più veloce nell’aria o nell’acqua?', 'Nell’acqua: circa quattro volte più veloce che nell’aria.'],
      ['Da dove viene il tuono?', 'Il fulmine scalda l’aria all’improvviso: l’aria si allarga di colpo e fa quel gran rumore.'],
      ['Come resta ghiacciata la pista di pattinaggio?', 'Sotto il ghiaccio ci sono tanti tubi in cui scorre un liquido freddissimo, come in un enorme frigorifero.'],
      ['Il cappotto ci scalda?', 'Non da solo! Tiene dentro il calore che produce il tuo corpo e non lo fa scappare.']
    ],
    quiz: [
      { q: 'Che cosa attira una calamita?', o: ['Alcuni metalli, come il ferro', 'La plastica', 'Il legno'], a: 0, e: 'La calamita attira il ferro e pochi altri metalli.' },
      { q: 'Come si chiama l’energia del vento?', o: ['Energia eolica', 'Energia solare', 'Energia elettrica'], a: 0, e: 'Le pale eoliche girano con il vento e producono elettricità.' },
      { q: 'Come si chiama l’acqua che diventa ghiaccio?', o: ['Solidificazione', 'Fusione', 'Evaporazione'], a: 0, e: 'Da liquido a solido: solidificazione.' },
      { q: 'Come si chiama il vapore che torna goccioline?', o: ['Condensazione', 'Fusione', 'Solidificazione'], a: 0, e: 'La condensazione: la vedi sullo specchio dopo la doccia.' },
      { q: 'Quale materiale NON fa passare l’elettricità?', o: ['La plastica', 'Il rame', 'Il ferro'], a: 0, e: 'La plastica è un isolante: per questo copre i fili elettrici.' },
      { q: 'Perché d’inverno mettiamo il cappotto?', o: ['Per tenere dentro il calore del corpo', 'Perché il cappotto produce calore', 'Per far entrare il freddo'], a: 0, e: 'Il cappotto non scalda da solo: tiene dentro il tuo calore.' },
      { q: 'Che cosa serve per vedere l’arcobaleno?', o: ['Il Sole e le goccioline d’acqua', 'Il buio', 'La neve'], a: 0, e: 'La luce del Sole attraversa le goccioline e si divide in tutti i colori.' }
    ]
  },
  animali: {
    facts: [
      ['Qual è l’animale più grande?', 'La balenottera azzurra: è il più grande animale mai vissuto, più grande anche dei dinosauri.'],
      ['Quale animale è il simbolo del Gran Paradiso?', 'Lo stambecco! Il Parco Nazionale del Gran Paradiso è tra Piemonte e Valle d’Aosta.'],
      ['Come si dicono le api dove sono i fiori?', 'Con una danza! Muovendosi in un certo modo indicano direzione e distanza.'],
      ['Qual è l’animale di terra più veloce?', 'Il ghepardo: in una corsa breve supera i 100 chilometri all’ora.'],
      ['Il ragno è un insetto?', 'No! Gli insetti hanno 6 zampe, il ragno ne ha 8: è un aracnide.']
    ],
    quiz: [
      { q: 'Quante zampe ha un insetto?', o: ['6', '8', '4'], a: 0, e: 'Tutti gli insetti hanno 6 zampe.' },
      { q: 'Quante zampe ha un ragno?', o: ['8', '6', '10'], a: 0, e: 'Il ragno ha 8 zampe: non è un insetto, è un aracnide.' },
      { q: 'Come si chiamano gli animali con la colonna vertebrale?', o: ['Vertebrati', 'Invertebrati', 'Erbivori'], a: 0, e: 'Pesci, anfibi, rettili, uccelli e mammiferi sono vertebrati.' },
      { q: 'Qual è l’animale più grande del mondo?', o: ['La balenottera azzurra', 'L’elefante', 'La giraffa'], a: 0, e: 'Può essere lunga più di 25 metri!' },
      { q: 'Con che cosa respirano i pesci?', o: ['Con le branchie', 'Con i polmoni', 'Con le pinne'], a: 0, e: 'Le branchie prendono l’ossigeno sciolto nell’acqua.' },
      { q: 'Che cosa diventa il girino quando cresce?', o: ['Una rana', 'Un pesce', 'Una lucertola'], a: 0, e: 'È la metamorfosi: il girino perde la coda e diventa rana.' },
      { q: 'Come si chiama il lungo sonno invernale di alcuni animali?', o: ['Letargo', 'Migrazione', 'Muta'], a: 0, e: 'La marmotta, che vive anche sulle Alpi del Piemonte, va in letargo.' }
    ]
  }
};
SCI.forEach(t => { const m = SCI_MORE[t.id]; if (m) { t.facts.push(...m.facts); t.quiz.push(...m.quiz); } });

/* ---------- Sport: più curiosità e più domande ---------- */
const SPORT_MORE = {
  patt: {
    facts: [
      ['Una campionessa italiana del pattinaggio?', 'Carolina Kostner, della Val Gardena: nel 2012 è diventata campionessa del mondo.'],
      ['Dove si sono fatte le gare olimpiche di pattinaggio nel 2026?', 'A Milano! Nel 2026 le Olimpiadi invernali sono tornate in Italia, a Milano e Cortina.'],
      ['Da dove viene il nome del salto Salchow?', 'Dal pattinatore svedese Ulrich Salchow, che vinse ben dieci titoli mondiali.'],
      ['Le lame vanno affilate?', 'Sì! Un esperto le affila lasciando sotto il piccolo canale che crea i due fili.']
    ],
    quiz: [
      { q: 'Da quale pattinatore prende il nome il salto Salchow?', o: ['Ulrich Salchow', 'Axel Paulsen', 'Alois Lutz'], a: 0, e: 'Ulrich Salchow era svedese.' },
      { q: 'Nel pattinaggio di coppia quante persone pattinano insieme?', o: ['2', '4', '1'], a: 0, e: 'Due pattinatori, che fanno anche prese e lanci.' },
      { q: 'Quale sport sul ghiaccio si gioca con un disco e i bastoni?', o: ['L’hockey su ghiaccio', 'Il curling', 'Il pattinaggio artistico'], a: 0, e: 'Il disco si chiama puck.' },
      { q: 'Cosa protegge le lame quando cammini fuori dalla pista?', o: ['I copri-lama', 'I guanti', 'Il casco'], a: 0, e: 'Ma ricordati di toglierli prima di entrare sul ghiaccio!' },
      { q: 'Dove va il peso sulla lama?', o: ['Al centro, appena dietro l’avampiede', 'Sul puntale', 'Solo sul tallone'], a: 0, e: 'Al centro della lama: così sei in equilibrio.' },
      { q: 'Con quale parte della lama si spinge?', o: ['Il filo interno', 'Il puntale', 'Il tallone'], a: 0, e: 'Si spinge di lato con il filo interno, mai con il puntale.' },
      { q: 'Come si allaccia lo scarponcino sulla caviglia?', o: ['Più stretto', 'Lentissimo', 'Non si allaccia'], a: 0, e: 'Stretto sulla caviglia, comodo sulle dita, medio sui ganci.' }
    ]
  },
  aerea: {
    facts: [
      ['Che cosa faceva Jules Léotard?', 'Volava da un trapezio all’altro, sopra la testa del pubblico: fu il primo trapezio volante della storia.'],
      ['Cosa c’è sotto i tessuti durante la lezione?', 'Un materasso morbido: in palestra la sicurezza viene prima di tutto.'],
      ['Che cosa serve nella ginnastica aerea?', 'Forza, flessibilità e coraggio. Si impara un passo alla volta, sempre con l’insegnante.']
    ],
    quiz: [
      { q: 'Prima di salire sui tessuti è importante…', o: ['fare riscaldamento', 'mangiare tantissimo', 'mettere gli orecchini'], a: 0, e: 'Il riscaldamento prepara muscoli e articolazioni.' },
      { q: 'Perché si tolgono orecchini e braccialetti?', o: ['Per non impigliarsi e non farsi male', 'Perché pesano troppo', 'Per moda'], a: 0, e: 'Si possono impigliare nel tessuto.' },
      { q: 'Che cosa c’è sotto i tessuti durante la lezione?', o: ['Un materasso morbido', 'Una piscina', 'Niente'], a: 0, e: 'Il materasso protegge se si scivola.' }
    ]
  },
  nuoto: {
    facts: [
      ['Quanto è lunga una piscina «corta»?', '25 metri: metà di una piscina olimpionica.'],
      ['Come si chiama il cambio di direzione alla fine della vasca?', 'La virata: si tocca o si spinge sul muro e si riparte.'],
      ['A cosa servono gli occhialini?', 'A vedere bene sott’acqua e a proteggere gli occhi dal cloro.']
    ],
    quiz: [
      { q: 'Quale stile si chiama anche «farfalla»?', o: ['Il delfino', 'La rana', 'Il dorso'], a: 0, e: 'Il delfino, con le braccia che girano insieme.' },
      { q: 'Come si chiama il cambio di direzione alla fine della vasca?', o: ['La virata', 'Il tuffo', 'La bracciata'], a: 0, e: 'Nella virata si spinge sul muro con i piedi.' },
      { q: 'Perché si usano gli occhialini?', o: ['Per vedere bene e proteggere gli occhi', 'Per stare al caldo', 'Per galleggiare'], a: 0, e: 'Proteggono dal cloro e fanno vedere bene.' },
      { q: 'Quanti metri sono 4 vasche in una piscina da 25 metri?', o: ['100', '50', '25'], a: 0, e: '25 × 4 = 100 metri.' }
    ]
  },
  corpo: {
    facts: [
      ['Quanto movimento serve ai bambini?', 'I medici consigliano almeno 60 minuti al giorno di movimento: giochi, sport, camminate.'],
      ['Quanto dovrebbe dormire una bambina di 10 anni?', 'Tra 9 e 12 ore a notte: il sonno aiuta a crescere e a ricordare.'],
      ['Perché si fa il riscaldamento?', 'Scalda muscoli e articolazioni e aiuta a non farsi male.']
    ],
    quiz: [
      { q: 'Quanto movimento al giorno consigliano i medici ai bambini?', o: ['Almeno 60 minuti', '5 minuti', 'Nessuno'], a: 0, e: 'Almeno un’ora al giorno, anche divisa in tanti momenti.' },
      { q: 'Quante ore dovrebbe dormire una bambina di 10 anni?', o: ['Tra 9 e 12', 'Solo 5', 'Più di 18'], a: 0, e: 'Il sonno fa crescere e fissa i ricordi.' },
      { q: 'Prima di fare sport è utile…', o: ['fare riscaldamento', 'stare fermi al freddo', 'mangiare un dolce enorme'], a: 0, e: 'Il riscaldamento prepara il corpo.' }
    ]
  }
};
SPORTS.forEach(t => { const m = SPORT_MORE[t.id]; if (m) { t.facts.push(...m.facts); t.quiz.push(...m.quiz); } });

/* ---------- Scopri: più curiosità e più domande ---------- */
const SCOPRI_MORE = {
  storia: {
    facts: [
      ['Le strade romane esistono ancora?', 'Sì! Erano così robuste che alcuni tratti si usano ancora oggi, come quelli della via Appia.'],
      ['Che cos’erano le terme?', 'Grandi bagni pubblici dei Romani, con vasche d’acqua calda, tiepida e fredda.'],
      ['Come crescevano i bambini a Sparta?', 'Venivano allenati fin da piccoli a essere forti e resistenti, per diventare soldati.'],
      ['In che cosa erano bravi gli Etruschi?', 'Erano abilissimi a lavorare i metalli e l’oro, e costruivano città fortificate.']
    ],
    quiz: [
      ['Chi fu il primo re di Roma, secondo la leggenda?', ['Romolo', 'Giulio Cesare', 'Augusto'], 0],
      ['In che anno fu fondata Roma secondo la tradizione?', ['753 a.C.', '1492', '2016'], 0],
      ['Come si chiamavano i combattenti delle arene romane?', ['Gladiatori', 'Cavalieri', 'Samurai'], 0],
      ['Qual è il grande anfiteatro di Roma?', ['Il Colosseo', 'Il Partenone', 'La Torre di Pisa'], 0],
      ['Quale città greca è famosa per la democrazia?', ['Atene', 'Sparta', 'Olimpia'], 0],
      ['Che cosa costruivano i Romani per portare l’acqua in città?', ['Gli acquedotti', 'I grattacieli', 'Le funivie'], 0],
      ['Quale popolo viveva in Toscana prima dei Romani?', ['Gli Etruschi', 'I Vichinghi', 'Gli Aztechi'], 0]
    ]
  },
  geo: {
    facts: [
      ['Qual è il vulcano attivo più alto d’Europa?', 'L’Etna, in Sicilia: è alto più di 3.300 metri.'],
      ['Ci sono altri Stati dentro l’Italia?', 'Sì, due piccolissimi: San Marino e la Città del Vaticano.'],
      ['Con chi confina il Piemonte?', 'Con la Francia e la Svizzera, oltre che con altre regioni italiane.'],
      ['Torino è stata capitale?', 'Sì! È stata la prima capitale dell’Italia unita, dal 1861 al 1865.']
    ],
    quiz: [
      ['Qual è il lago più grande d’Italia?', ['Il lago di Garda', 'Il lago di Como', 'Il lago Maggiore'], 0],
      ['Qual è l’isola più grande d’Italia?', ['La Sicilia', 'La Sardegna', 'L’Elba'], 0],
      ['Quali montagne attraversano l’Italia da nord a sud?', ['Gli Appennini', 'Le Alpi', 'I Pirenei'], 0],
      ['Qual è la capitale d’Italia?', ['Roma', 'Milano', 'Torino'], 0],
      ['Quale vulcano si trova vicino a Napoli?', ['Il Vesuvio', 'L’Etna', 'Lo Stromboli'], 0],
      ['Qual è stata la prima capitale dell’Italia unita?', ['Torino', 'Firenze', 'Venezia'], 0],
      ['Qual è il capoluogo della Lombardia?', ['Milano', 'Bergamo', 'Brescia'], 0]
    ]
  },
  ita: {
    facts: [
      ['Quante lettere ha l’alfabeto italiano?', '21, più 5 lettere «straniere»: j, k, w, x, y.'],
      ['Che cos’è un acrostico?', 'Una poesia in cui le iniziali dei versi, lette in colonna, formano una parola. Come le frasi magiche!'],
      ['Da dove viene l’italiano?', 'In gran parte dal latino parlato dagli antichi Romani.']
    ],
    quiz: [
      ['Che cos’è un aggettivo?', ['Una parola che descrive il nome', 'Un’azione', 'Un segno di punteggiatura'], 0],
      ['Nella frase «Il gatto dorme», «dorme» è…', ['un verbo', 'un nome', 'un articolo'], 0],
      ['Qual è il contrario di «coraggioso»?', ['Pauroso', 'Forte', 'Allegro'], 0],
      ['Quale parola vuol dire quasi lo stesso di «felice»?', ['Contento', 'Triste', 'Stanco'], 0],
      ['Quale articolo va davanti a «zaino»?', ['Lo', 'Il', 'La'], 0]
    ]
  },
  eng: {
    facts: [
      ['Come si scrivono i giorni in inglese?', 'Sempre con la maiuscola: Monday, Tuesday, Wednesday…'],
      ['Come si dice «il mio giorno di pattinaggio»?', 'My skating day! Skating = pattinaggio, day = giorno.']
    ],
    quiz: [
      ['Come si dice «ghiaccio» in inglese?', ['Ice', 'Snow', 'Rain'], 0],
      ['Come si dicono «pattini» in inglese?', ['Skates', 'Shoes', 'Socks'], 0],
      ['Che cosa vuol dire «swimming»?', ['Nuotare', 'Saltare', 'Correre'], 0],
      ['Come si dice «amica» in inglese?', ['Friend', 'Family', 'Teacher'], 0],
      ['Che cosa vuol dire «Good morning»?', ['Buongiorno', 'Buonanotte', 'Arrivederci'], 0]
    ]
  },
  arte: {
    facts: [
      ['Michelangelo dipingeva sdraiato?', 'No! La volta della Cappella Sistina la dipinse in piedi, su alte impalcature, con la testa all’indietro. Ci mise circa quattro anni.'],
      ['Che cosa sono i colori complementari?', 'Coppie di colori «opposti» che stanno benissimo vicini: rosso e verde, giallo e viola, blu e arancione.']
    ],
    quiz: [
      ['Giallo + rosso fanno…', ['Arancione', 'Verde', 'Viola'], 0],
      ['Rosso + blu fanno…', ['Viola', 'Arancione', 'Marrone chiaro'], 0],
      ['Chi ha dipinto la «Notte stellata»?', ['Van Gogh', 'Leonardo da Vinci', 'Michelangelo'], 0],
      ['Che cosa ritrae un autoritratto?', ['Il pittore stesso', 'Un paesaggio', 'Un frutto'], 0]
    ]
  },
  musica: {
    facts: [
      ['Beethoven diventò sordo?', 'Sì, e continuò lo stesso a comporre musica bellissima: un esempio di grande forza di volontà!'],
      ['Come si chiama l’inno d’Italia?', '«Il Canto degli Italiani», scritto da Goffredo Mameli. Molti lo chiamano «Fratelli d’Italia».']
    ],
    quiz: [
      ['Chi ha composto l’«Inno alla gioia»?', ['Beethoven', 'Mozart', 'Verdi'], 0],
      ['Il flauto è uno strumento…', ['a fiato', 'a corde', 'a percussione'], 0],
      ['Quale strumento ha 88 tasti?', ['Il pianoforte', 'Il violino', 'La chitarra'], 0],
      ['Chi guida un’orchestra?', ['Il direttore d’orchestra', 'Il batterista', 'Il pubblico'], 0]
    ]
  },
  civica: {
    facts: [
      ['Quante stelle ha la bandiera europea?', '12 stelle in cerchio: non indicano i paesi, ma l’unione e l’armonia.'],
      ['Quando è la Giornata dei diritti dell’infanzia?', 'Il 20 novembre, il giorno in cui nel 1989 fu approvata la Convenzione.']
    ],
    quiz: [
      ['Chi è il capo dello Stato in Italia?', ['Il Presidente della Repubblica', 'Il sindaco', 'Il re'], 0],
      ['Quante stelle ha la bandiera europea?', ['12', '27', '50'], 0],
      ['Che cosa vuol dire riciclare?', ['Trasformare i rifiuti in materiali nuovi', 'Buttare tutto insieme', 'Andare in bicicletta'], 0]
    ]
  },
  tecno: {
    facts: [
      ['Chi era Guglielmo Marconi?', 'Un inventore italiano, pioniere della radio: nel 1909 vinse il premio Nobel per la fisica.'],
      ['Che cos’è un circuito elettrico?', 'Un percorso chiuso in cui scorre la corrente: se lo apri, la lampadina si spegne.']
    ],
    quiz: [
      ['Quale di questi serve a scrivere al computer?', ['La tastiera', 'Lo schermo', 'Le casse'], 0],
      ['Perché la lampadina si accende, il circuito deve essere…', ['chiuso', 'aperto', 'bagnato'], 0],
      ['Che cosa trasforma un pannello solare?', ['La luce in elettricità', 'L’acqua in ghiaccio', 'Il vento in luce'], 0],
      ['Quale inventore italiano è un pioniere della radio?', ['Guglielmo Marconi', 'Leonardo da Vinci', 'Galileo Galilei'], 0]
    ]
  }
};
SCOPRI.forEach(s => { const m = SCOPRI_MORE[s.id]; if (m) { s.facts.push(...m.facts); s.quiz.push(...m.quiz); } });

/* ---------- Altre domande, per le materie che ne avevano meno ---------- */
SPORTS.find(t => t.id === 'aerea').quiz.push(
  { q: 'Come si chiama il trapezio con cui si vola da una barra all’altra?', o: ['Trapezio volante', 'Trapezio fisso', 'Altalena'], a: 0, e: 'Il trapezio volante, inventato da Jules Léotard.' },
  { q: 'Per salire sui tessuti si usano soprattutto…', o: ['braccia, pancia e piedi', 'solo la testa', 'solo le dita'], a: 0, e: 'Le braccia tirano, la pancia tiene stabile e i piedi bloccano il tessuto.' },
  { q: 'Qual è la regola più importante in palestra?', o: ['Ascoltare l’insegnante', 'Provare da sola le figure difficili', 'Correre sui materassi'], a: 0, e: 'L’insegnante sa quando sei pronta per una figura nuova.' }
);
SPORTS.find(t => t.id === 'corpo').quiz.push(
  { q: 'Dopo lo sport, che cosa aiuta i muscoli?', o: ['Bere acqua e riposare', 'Saltare la cena', 'Non dormire'], a: 0, e: 'Acqua, cibo e sonno aiutano i muscoli a recuperare.' },
  { q: 'Lo sport fa bene anche…', o: ['all’umore', 'solo ai piedi', 'a niente'], a: 0, e: 'Muoversi ti fa sentire più contenta e piena di energia.' },
  { q: 'Quale di questi è un buon spuntino prima dell’allenamento?', o: ['Un frutto', 'Un sacchetto di patatine', 'Una bibita gassata'], a: 0, e: 'La frutta dà energia ed è leggera.' }
);
const addQ = (id, list) => SCOPRI.find(s => s.id === id).quiz.push(...list);
addQ('civica', [
  ['Chi guida il Comune?', ['Il sindaco', 'Il Presidente della Repubblica', 'Il preside'], 0],
  ['Quando si festeggia la Festa della Liberazione?', ['Il 25 aprile', 'Il 2 giugno', 'Il 1° maggio'], 0],
  ['Dove si butta un foglio di carta?', ['Nella carta', 'Nel vetro', 'Nell’umido'], 0],
  ['Come si attraversa la strada?', ['Sulle strisce, guardando a destra e a sinistra', 'Correndo tra le auto', 'Con gli occhi chiusi'], 0]
]);
addQ('arte', [
  ['In quale città si trova il Museo Egizio?', ['Torino', 'Roma', 'Venezia'], 0],
  ['Quali sono colori caldi?', ['Rosso, arancione e giallo', 'Blu, verde e viola', 'Nero e grigio'], 0],
  ['Chi ha dipinto la volta della Cappella Sistina?', ['Michelangelo', 'Van Gogh', 'Leonardo da Vinci'], 0]
]);
addQ('musica', [
  ['Chi ha scritto le parole dell’inno d’Italia?', ['Goffredo Mameli', 'Giuseppe Verdi', 'Dante Alighieri'], 0],
  ['Come si chiamano le 5 linee su cui si scrive la musica?', ['Pentagramma', 'Pentagono', 'Quadretti'], 0],
  ['Quale compositore diventò sordo ma continuò a scrivere musica?', ['Beethoven', 'Mozart', 'Vivaldi'], 0]
]);
addQ('tecno', [
  ['In che anno Guglielmo Marconi vinse il premio Nobel?', ['1909', '1492', '2016'], 0],
  ['Che cosa fa girare le pale eoliche?', ['Il vento', 'La pioggia', 'La luna'], 0],
  ['Quale cifra NON usa il codice binario?', ['2', '0', '1'], 0]
]);
addQ('eng', [
  ['Come si dice «compleanno» in inglese?', ['Birthday', 'Holiday', 'Monday'], 0],
  ['Come si dice «drago» in inglese?', ['Dragon', 'Dog', 'Duck'], 0]
]);
addQ('ita', [
  ['Qual è il plurale di «uomo»?', ['Uomini', 'Uomi', 'Uomoni'], 0],
  ['Quale parola è scritta giusta?', ['Quadro', 'Cuadro', 'Qadro'], 0]
]);
SPORTS.find(t => t.id === 'nuoto').quiz.push(
  { q: 'Qual è di solito lo stile più veloce?', o: ['Lo stile libero', 'La rana', 'Il dorso'], a: 0, e: 'Nelle gare di stile libero quasi tutti nuotano il crawl, lo stile più veloce.' }
);
