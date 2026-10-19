/* 🎭 Teatro: «Dietro le quinte» (autore + revisore indipendente, ottobre 2026) */
const TEATRO = {
 "schede": [
  {
   "ic": "🎬",
   "t": "Chi fa che cosa",
   "k": "Uno spettacolo è un lavoro di squadra: ognuno ha il suo compito.",
   "testo": "Il regista guida tutti e decide come si muovono gli attori: a scuola spesso è la maestra. Gli attori danno vita ai personaggi. Il suggeritore, nascosto, sussurra le parole a chi le dimentica. Scenografi, costumisti e tecnici di luci e suono preparano tutto il resto, e il pubblico guarda e applaude!",
   "sfida": {
    "q": "Chi sussurra le parole a un attore che le ha dimenticate?",
    "ok": "Il suggeritore",
    "wrong": [
     "Il costumista",
     "Il pubblico"
    ],
    "e": "Il suggeritore segue il copione e, senza farsi vedere, aiuta chi perde una battuta."
   }
  },
  {
   "ic": "📜",
   "t": "Le parole del copione",
   "k": "Il copione è il testo dello spettacolo: contiene tutte le battute.",
   "testo": "Ogni frase che dice un personaggio è una battuta. Le didascalie, spesso tra parentesi, spiegano cosa succede o cosa fare: «entra», «ride», «esce». Spesso lo spettacolo è diviso in atti, e ogni atto in scene. Il personaggio è chi interpreti.",
   "sfida": {
    "q": "Nel copione, che cos'è una didascalia?",
    "ok": "Un'indicazione su cosa fare, come «entra» o «ride»",
    "wrong": [
     "Una battuta da dire forte al pubblico",
     "Il titolo dello spettacolo"
    ],
    "e": "La didascalia non si recita: spiega all'attore cosa succede e come muoversi."
   }
  },
  {
   "ic": "🏛️",
   "t": "Le parti del teatro",
   "k": "Sul palcoscenico si recita; in platea, la sala, siede il pubblico.",
   "testo": "Ai lati del palco ci sono le quinte: dietro di loro gli attori aspettano senza farsi vedere. Il proscenio è la parte del palco più vicina al pubblico, davanti al sipario. Il sipario è la grande tenda che si apre e si chiude. Nei camerini ci si cambia e ci si trucca.",
   "sfida": {
    "q": "Dove aspetti, senza farti vedere, prima di entrare in scena?",
    "ok": "Dietro le quinte",
    "wrong": [
     "In platea",
     "Sul proscenio"
    ],
    "e": "Le quinte sono ai lati del palco: dietro di loro il pubblico non ti vede. Da lì si entra e si esce."
   }
  },
  {
   "ic": "🔔",
   "t": "La battuta prima della tua",
   "k": "È l'ultima battuta del compagno prima della tua: è il tuo segnale.",
   "testo": "Non basta imparare le tue battute: impara anche l'ultima frase che dice il compagno prima di te. È il tuo segnale: quando la senti, sai che tocca a te. Ascolta bene e parti al momento giusto.",
   "sfida": {
    "q": "A cosa serve conoscere la battuta che viene prima della tua?",
    "ok": "A capire quando tocca a me parlare",
    "wrong": [
     "A sapere quando si chiude il sipario",
     "A ricordare dove sono i camerini"
    ],
    "e": "È il tuo segnale: quando il compagno la dice, arriva il momento della tua battuta."
   }
  },
  {
   "ic": "🗣️",
   "t": "Voce e corpo sul palco",
   "k": "Parla a voce alta e senza fretta: ti deve sentire anche l'ultima fila.",
   "testo": "Pronuncia bene ogni parola, aprendo la bocca, senza urlare. Tieni il viso verso il pubblico e cerca di non dargli le spalle. Fai piccole pause: aiutano chi ascolta. Se il pubblico ride o applaude, aspetta un attimo che si calmi, poi continua.",
   "sfida": {
    "q": "Il pubblico ride dopo una tua battuta. Cosa fai?",
    "ok": "Aspetto un attimo che le risate calino, poi continuo",
    "wrong": [
     "Continuo subito a parlare sopra le risate",
     "Esco di scena"
    ],
    "e": "Se parli mentre il pubblico ride, le parole si perdono: una piccola attesa le fa sentire a tutti."
   }
  },
  {
   "ic": "🎭",
   "t": "Restare nel personaggio",
   "k": "Sei il tuo personaggio anche quando non parli.",
   "testo": "Mentre gli altri recitano, ascolta e guarda chi parla, come se sentissi tutto per la prima volta. Reagisci con il viso e con il corpo, come avete provato: sorpresa, paura, gioia. Anche se vedi la tua famiglia in platea, niente saluti: li farai dopo l'inchino!",
   "sfida": {
    "q": "Vedi i tuoi genitori in platea mentre sei in scena. Cosa fai?",
    "ok": "Resto nel personaggio e li saluto dopo lo spettacolo",
    "wrong": [
     "Li saluto con la mano dal palco",
     "Li chiamo per farmi vedere"
    ],
    "e": "Sul palco sei il personaggio: salutare distrae te e il pubblico. Gli abbracci arrivano a fine spettacolo."
   }
  },
  {
   "ic": "🧩",
   "t": "Se dimentico una battuta",
   "k": "Niente panico: respira e di' il senso con parole tue.",
   "testo": "Capita a tutti, anche agli attori bravi. Fai un respiro, pensa a cosa deve dire il tuo personaggio e dillo a modo tuo. Puoi guardare il compagno o ascoltare il suggeritore, se c'è. Si va avanti insieme: di solito il pubblico non se ne accorge.",
   "sfida": {
    "q": "Hai dimenticato una battuta. Qual è la cosa migliore da fare?",
    "ok": "Respirare e dire il senso con parole mie",
    "wrong": [
     "Fermarmi e uscire dal palco",
     "Chiedere scusa al pubblico"
    ],
    "e": "Lo spettacolo continua: dire il senso con parole tue aiuta te e i compagni ad andare avanti."
   }
  },
  {
   "ic": "🦋",
   "t": "La paura del palco",
   "k": "Un po' di paura è normale: la provano anche gli attori esperti.",
   "testo": "Prima di entrare, respira piano: conta fino a 4 mentre l'aria entra e fino a 4 mentre esce. Ripeti qualche volta. Pensa solo alla tua prima battuta. Quando cominci a recitare, di solito la paura cala. Se hai tanta paura, parlane con la maestra.",
   "sfida": {
    "q": "Quale respiro aiuta a calmarsi prima di entrare in scena?",
    "ok": "Lento: conto 4 dentro e 4 fuori",
    "wrong": [
     "Trattengo il fiato più a lungo possibile",
     "Respiro velocissimo per caricarmi"
    ],
    "e": "Il respiro lento calma il corpo e aiuta la mente a pensare alla prima battuta."
   }
  },
  {
   "ic": "🙇",
   "t": "Prove, prova generale, inchino",
   "k": "Ogni prova rende lo spettacolo più sicuro e più facile.",
   "testo": "Si prova tante volte per ricordare parole, movimenti ed entrate. La prova generale è l'ultima prima dello spettacolo e si fa come quella vera, di solito con costumi e luci. Alla fine c'è l'inchino, come lo avete provato, per ringraziare il pubblico.",
   "sfida": {
    "q": "Che cos'è la prova generale?",
    "ok": "L'ultima prova, fatta come lo spettacolo vero",
    "wrong": [
     "La prima lettura del copione",
     "Una prova che fa solo il regista"
    ],
    "e": "Nella prova generale si recita tutto dall'inizio alla fine, proprio come davanti al pubblico."
   }
  }
 ],
 "capire": [
  {
   "q": "Chi sono?",
   "aiuto": "Com'è il mio personaggio: età, carattere, modo di fare?"
  },
  {
   "q": "Che cosa voglio?",
   "aiuto": "Che cosa desidera il mio personaggio in questa scena?"
  },
  {
   "q": "Che cosa succede?",
   "aiuto": "Racconta la scena in tre frasi, con parole tue."
  },
  {
   "q": "Come mi sento?",
   "aiuto": "Gioia, tristezza, rabbia, paura? Cambia qualcosa durante la scena?"
  }
 ],
 "missioni": [
  {
   "t": "Leggi tutta la storia",
   "x": "Leggi il copione intero, non solo le tue battute: così capisci cosa succede prima e dopo di te."
  },
  {
   "t": "Caccia ai segnali",
   "x": "Su una copia del copione, sottolinea le tue battute con un colore e, con un altro, la battuta che viene subito prima."
  },
  {
   "t": "Prova con un aiutante",
   "x": "Chiedi a qualcuno di casa di leggere le battute degli altri personaggi, mentre tu rispondi con le tue."
  },
  {
   "t": "Voce fino in fondo",
   "x": "Recita da un lato della stanza, senza urlare: chi sta dall'altro lato deve capire ogni parola."
  },
  {
   "t": "Allo specchio",
   "x": "Di' una battuta davanti allo specchio e prova la faccia giusta per gioia, sorpresa o paura."
  }
 ],
 "palco": [
  "Parla a voce alta, senza fretta e verso il pubblico.",
  "Ascolta i compagni anche quando non parli.",
  "Aspetta il tuo turno in silenzio dietro le quinte.",
  "Niente saluti dal palco: resta nel personaggio.",
  "Se sbagli, continua: si va avanti insieme.",
  "Alla fine, inchino come alle prove e grazie al pubblico."
 ]
};
