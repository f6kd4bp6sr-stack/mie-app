/* ================= 🎨 DISEGNO: il percorso delle basi del disegno artistico =================
   5 fasi, dal più semplice al più difficile; ogni fase ha piccoli progetti a livelli (1 facile → 3 più impegnativo).
   Ogni progetto: passi con una guida tratteggiata (coordinate su un foglio di 1200 × 900) che la bambina ricalca,
   poi l'app aggiunge da sola il passo finale «Ora da sola» (senza guida, con il suo disegno guidato piccolo accanto).
   Primitive della guida:
     ["l",x1,y1,x2,y2] linea · ["c",cx,cy,r] cerchio · ["e",cx,cy,rx,ry] ovale · ["r",x,y,w,h] rettangolo
     ["p","d"] tracciato SVG · ["dot",x,y,"#colore","etichetta"] dove colorare · ["txt",x,y,"testo"] scritta · ["sun",x,y] da dove viene la luce
   Contenuti: autore → revisore indipendente → controllo automatico (regola dell'app). Gli id non si cambiano mai. */
const DIS_COL = {
  nero: '#222222', grigio: '#8a8a8a', bianco: '#ffffff', marrone: '#8b5a2b', rosa: '#f4a6c1',
  giallo: '#f6d000', arancione: '#f28c1b', rosso: '#d62828', viola: '#7b3fa0', blu: '#1f5fbf', verde: '#2e9e44',
  azzurro: '#7cc4f2', verdechiaro: '#9bd770', celestino: '#cfe8fb',
  blu1: '#dbe7fb', blu2: '#a9c4f2', blu3: '#5f8fe0', blu4: '#2a5cb8', blu5: '#16336b',
  g1: '#f2f2f2', g2: '#c8c8c8', g3: '#9a9a9a', g4: '#5e5e5e', g5: '#262626'
};
const DIS_FASI = [
  { id: 'linee', ic: '✏️', n: 'Linee e forme', sala: 'Sala delle linee',
    t: 'Ogni disegno è fatto di linee e di forme semplici: cerchi, ovali, quadrati e triangoli. Se impari a vederle, puoi disegnare tutto.' },
  { id: 'colore', ic: '🎨', n: 'Il colore', sala: 'Sala dei colori',
    t: 'I colori si possono mescolare, schiarire e scurire. Alcuni sembrano caldi, altri freddi; alcuni si fanno risaltare a vicenda.' },
  { id: 'ombra', ic: '🌗', n: 'Luce, ombra e volume', sala: 'Sala delle ombre',
    t: 'La luce arriva da una parte: dove batte è chiaro, dall’altra parte c’è l’ombra. Così un cerchio diventa una palla.' },
  { id: 'spazio', ic: '🏞️', n: 'Prospettiva e paesaggio', sala: 'Sala dei paesaggi',
    t: 'Le cose lontane sembrano più piccole, più vicine alla linea dell’orizzonte e più chiare. Con questi trucchi un foglio piatto diventa profondo.' },
  { id: 'figura', ic: '🙂', n: 'Il viso e la figura', sala: 'Sala dei ritratti',
    t: 'Il viso e il corpo hanno misure che si ripetono: gli occhi stanno a metà della testa, il gomito all’altezza della vita.' },
  /* 14/11/2026: palestra sempre aperta (libera: true), non blocca e non è bloccata dalle altre tappe */
  { id: 'mano', ic: '✋', n: 'Forme a mano libera', sala: 'Sala della mano libera', libera: true,
    t: 'Una palestra per la mano: cerchi, ovali e linee fatti con un gesto solo, poi animali e oggetti costruiti con forme semplici. Più la mano si scalda, più le forme vengono bene.' }
];
const DIS_PROG = [
  /* ---------- ✏️ FASE 1: linee e forme ---------- */
  { id: 'd101', f: 'linee', lv: 1, ic: '〰️', n: 'Le linee', tool: 'matita', col: 'nero', impara: 'i tipi di linea e il gesto sciolto',
    passi: [
      { t: 'La linea dritta orizzontale: parti da sinistra e vai a destra con un solo movimento, senza fermarti. Muovi tutto il braccio, non solo le dita.', g: [['l', 150, 130, 1050, 130]] },
      { t: 'La linea verticale, dall’alto in basso, e la linea obliqua, inclinata.', g: [['l', 200, 220, 200, 520], ['l', 320, 520, 520, 220]] },
      { t: 'La linea curva: come un arco o un sorriso.', g: [['p', 'M620 480 Q760 220 900 480']] },
      { t: 'La linea ondulata: su e giù morbido, come le onde del mare.', g: [['p', 'M150 640 Q225 580 300 640 T450 640 T600 640 T750 640 T900 640 T1050 640']] },
      { t: 'La linea a zig-zag: su e giù a punta, come i denti di una sega.', g: [['p', 'M150 780 L225 720 L300 780 L375 720 L450 780 L525 720 L600 780']] },
      { t: 'La spirale: parti dal centro e gira allargandoti piano piano.', g: [['p', 'M900 760 m0 0 a10 10 0 1 1 20 0 a25 25 0 1 1 -45 0 a40 40 0 1 1 75 0 a55 55 0 1 1 -105 0']] }
    ] },
  { id: 'd102', f: 'linee', lv: 1, ic: '🔺', n: 'Le forme base', tool: 'matita', col: 'nero', impara: 'cerchio, quadrato, triangolo, ovale e rettangolo',
    passi: [
      { t: 'Il cerchio: fai qualche giro leggero, poi ripassa quello che ti sembra più tondo. Va bene se non è perfetto!', g: [['c', 230, 230, 130]] },
      { t: 'Il quadrato: quattro lati uguali e quattro angoli retti, come gli angoli di un foglio.', g: [['r', 460, 100, 260, 260]] },
      { t: 'Il triangolo: tre lati e tre punte.', g: [['p', 'M940 100 L1080 360 L800 360 Z']] },
      { t: 'L’ovale: un cerchio un po’ schiacciato, come un uovo sdraiato.', g: [['e', 300, 640, 190, 110]] },
      { t: 'Il rettangolo: come il quadrato, ma con due lati più lunghi.', g: [['r', 640, 540, 420, 200]] }
    ] },
  { id: 'd103', f: 'linee', lv: 1, ic: '🐱', n: 'Il gattino fatto di forme', tool: 'matita', col: 'nero', impara: 'costruire un animale con cerchi, ovali e triangoli',
    passi: [
      { t: 'La testa è un cerchio.', g: [['c', 600, 300, 150]] },
      { t: 'Le orecchie sono due triangoli sopra la testa.', g: [['p', 'M490 200 L470 90 L570 160'], ['p', 'M630 160 L730 90 L710 200']] },
      { t: 'Il corpo è un ovale grande sotto la testa.', g: [['e', 600, 615, 200, 170]] },
      { t: 'La coda è una linea curva che parte dal corpo.', g: [['p', 'M785 680 Q950 690 930 520 Q920 450 980 430']] },
      { t: 'Gli occhi sono due ovali, il naso un triangolino, la bocca due curve; poi i baffi, tre per lato.', g: [['e', 545, 280, 22, 32], ['e', 655, 280, 22, 32], ['p', 'M585 340 L615 340 L600 360 Z'], ['p', 'M600 360 Q580 390 560 375'], ['p', 'M600 360 Q620 390 640 375'], ['l', 530, 350, 420, 330], ['l', 530, 365, 420, 370], ['l', 530, 380, 425, 410], ['l', 670, 350, 780, 330], ['l', 670, 365, 780, 370], ['l', 670, 380, 775, 410]] },
      { t: 'Ora coloralo come vuoi con il secchiello o con i pastelli.', g: [['dot', 600, 640, '#f28c1b', 'colora']] , tool: 'secchiello', col: 'arancione' }
    ] },
  { id: 'd104', f: 'linee', lv: 2, ic: '🐟', n: 'Il pesce', tool: 'matita', col: 'nero', impara: 'ovali e triangoli, e un motivo che si ripete',
    passi: [
      { t: 'Il corpo è un ovale sdraiato.', g: [['e', 540, 450, 280, 160]] },
      { t: 'La coda è un triangolo attaccato a destra, con la punta verso il corpo.', g: [['p', 'M810 450 L1040 300 L1040 600 Z']] },
      { t: 'Le pinne: un triangolo sopra e uno sotto.', g: [['p', 'M450 300 L560 170 L640 300'], ['p', 'M500 600 L560 700 L620 600']] },
      { t: 'L’occhio è un cerchio con un puntino; la bocca una piccola curva.', g: [['c', 380, 410, 30], ['c', 385, 410, 8], ['p', 'M275 470 Q300 490 325 470']] },
      { t: 'Le scaglie sono tanti archetti che si ripetono, in file.', g: [['p', 'M520 380 q30 40 60 0 q30 40 60 0 q30 40 60 0'], ['p', 'M490 450 q30 40 60 0 q30 40 60 0 q30 40 60 0 q30 40 60 0'], ['p', 'M520 520 q30 40 60 0 q30 40 60 0 q30 40 60 0']] },
      { t: 'Colora il pesce e il mare intorno.', g: [['dot', 560, 330, '#f6d000', 'pesce'], ['dot', 1100, 150, '#7cc4f2', 'mare']], tool: 'secchiello', col: 'giallo' }
    ] },
  { id: 'd105', f: 'linee', lv: 2, ic: '🏠', n: 'La casa', tool: 'matita', col: 'nero', impara: 'quadrati, rettangoli e triangoli insieme',
    passi: [
      { t: 'La casa è un grande quadrato, appoggiato sulla linea del terreno.', g: [['r', 400, 380, 400, 400], ['l', 0, 780, 1200, 780]] },
      { t: 'Il tetto è un triangolo appoggiato sopra, un po’ più largo della casa.', g: [['p', 'M360 380 L600 150 L840 380 Z']] },
      { t: 'La porta è un rettangolo in basso, con la maniglia.', g: [['r', 550, 600, 110, 180], ['c', 640, 690, 7]] },
      { t: 'Due finestre quadrate con la croce in mezzo.', g: [['r', 440, 440, 90, 90], ['l', 485, 440, 485, 530], ['l', 440, 485, 530, 485], ['r', 670, 440, 90, 90], ['l', 715, 440, 715, 530], ['l', 670, 485, 760, 485]] },
      { t: 'Il comignolo è un rettangolo sul tetto; il fumo una linea ondulata.', g: [['p', 'M700 246 L700 190 L760 190 L760 303'], ['p', 'M730 180 Q700 150 730 120 Q760 90 730 60']] },
      { t: 'Colora: muri, tetto, porta e un prato sotto la casa.', g: [['dot', 470, 650, '#f6d000', 'muri'], ['dot', 600, 280, '#d62828', 'tetto'], ['dot', 600, 690, '#8b5a2b', 'porta'], ['dot', 600, 850, '#2e9e44', 'prato']], tool: 'secchiello', col: 'giallo' }
    ] },
  { id: 'd106', f: 'linee', lv: 3, ic: '🐉', n: 'Il drago di forme', tool: 'matita', col: 'nero', impara: 'un soggetto più grande, costruito un pezzo alla volta',
    passi: [
      { t: 'Prima le forme grandi e leggere: il corpo è un ovale grande.', g: [['e', 560, 560, 230, 150]] },
      { t: 'Il collo è fatto di due curve che salgono; la testa un cerchio con un ovale per il muso.', g: [['p', 'M700 470 Q780 380 800 290'], ['p', 'M760 520 Q850 420 870 320'], ['c', 850, 260, 80], ['e', 950, 290, 70, 45]] },
      { t: 'Le ali sono triangoli con il lato ondulato, attaccati alla schiena.', g: [['p', 'M520 420 L380 140 Q440 250 470 230 Q500 330 560 300 Z'], ['p', 'M620 420 L600 150 Q640 250 670 240 Q690 330 720 330 Z']] },
      { t: 'La coda è una curva lunga che finisce a punta.', g: [['p', 'M340 600 Q180 640 160 760 Q150 820 230 800'], ['p', 'M224 776 L236 824 L279 788 Z']] },
      { t: 'Le zampe sono ovali piccoli sotto il corpo.', g: [['e', 470, 710, 45, 60], ['e', 660, 710, 45, 60]] },
      { t: 'Ultimi dettagli: occhio, narice e una fila di spine a triangolo sulla schiena.', g: [['c', 860, 245, 14], ['c', 1000, 280, 6], ['p', 'M349 498 L332 459 L373 471 M381 465 L376 422 L415 443 M424 438 L431 394 L466 422 M545 411 L565 371 L585 411']] },
      { t: 'Colora il drago con i colori che preferisci.', g: [['dot', 560, 580, '#2e9e44', 'drago']], tool: 'secchiello', col: 'verde' }
    ] },
  /* 🌳 dal libro «Disegnare un albero» di Bruno Munari (Arte → Bruno Munari) */
  { id: 'd107', f: 'linee', lv: 2, ic: '🌳', n: 'L’albero di Munari', tool: 'matita', col: 'nero', impara: 'la regola di Munari: ogni ramo è più sottile del ramo da cui nasce',
    passi: [
      { t: 'Disegna il tronco: largo in basso, un po’ più stretto in alto.', g: [['p', 'M640 880 L625 600 L575 600 L560 880 Z'], ['txt', 720, 760, 'tronco']] },
      { t: 'Il tronco si divide in due rami. Regola di Munari: ogni ramo è più sottile del ramo da cui nasce.', g: [['p', 'M620 588 L486 389 L460 404 L580 612 Z'], ['p', 'M620 612 L740 404 L714 389 L580 588 Z']] },
      { t: 'Ogni ramo si divide ancora in due, e i nuovi rami sono ancora più sottili.', g: [['p', 'M479 385 L331 311 L323 327 L467 408 Z'], ['p', 'M486 396 L476 231 L458 232 L460 397 Z'], ['p', 'M740 397 L742 232 L724 231 L714 396 Z'], ['p', 'M733 408 L877 327 L869 311 L721 385 Z']] },
      { t: 'Ancora una volta: due rametti sottili da ogni ramo.', g: [['p', 'M327 312 L217 315 L217 324 L327 327 Z'], ['p', 'M333 315 L269 225 L262 230 L321 323 Z'], ['p', 'M474 228 L416 134 L408 139 L461 235 Z'], ['p', 'M474 235 L519 135 L511 131 L460 228 Z'], ['p', 'M740 228 L689 131 L681 135 L726 235 Z'], ['p', 'M739 235 L792 139 L784 134 L726 228 Z'], ['p', 'M879 323 L938 230 L931 225 L867 315 Z'], ['p', 'M873 327 L983 324 L983 315 L873 312 Z']] },
      { t: 'Continua tu: rametti sempre più sottili, anche un po’ storti, come nella natura. Nessun albero è uguale a un altro!', g: [['txt', 600, 70, 'sempre più sottili…']] },
      { t: 'Colora: il tronco marrone e, sulle punte, tante foglie piccole.', g: [['dot', 600, 760, '#8b5a2b', 'tronco'], ['dot', 412, 136, '#2e9e44', 'foglie'], ['dot', 788, 136, '#9bd770', 'foglie']], tool: 'pastello', col: 'verde' }
    ] },
  /* 14/11/2026: lo spessore della linea (autore + revisore) */
  {"id": "d108", "f": "linee", "lv": 2, "ic": "🍎", "n": "La mela che si stacca dal foglio", "tool": "pennarello", "col": "nero", "impara": "contorno spesso e dettagli sottili", "passi": [
      {"t": "Disegna il contorno della mela con una linea spessa: lo Spessore è già alto e, con l’Apple Pencil, premi bene. Il contorno spesso rende la forma forte e la fa staccare dal foglio.", "w": 18, "g": [["p", "M600 330 C520 270 380 310 380 500 C380 680 500 780 600 740 C700 780 820 680 820 500 C820 310 680 270 600 330 Z"]]},
      {"t": "Ora il gambo e la foglia, con una linea sottile: lo Spessore è già basso e, con la Pencil, appoggi appena. I particolari piccoli vogliono un tratto fine, altrimenti si impastano.", "w": 4, "g": [["p", "M600 335 Q592 270 625 215"], ["p", "M609 249 Q690 170 780 215 Q705 300 609 249 Z"]]},
      {"t": "Dentro la mela aggiungi due segni sottili: un riflesso curvo a sinistra e una piccola curva in basso. Contorno spesso fuori e linee sottili dentro: così si capisce subito qual è la forma e quali sono i particolari.", "w": 4, "g": [["p", "M455 430 Q440 500 470 575"], ["p", "M545 705 Q600 725 655 705"]]},
      {"t": "Colora la mela di rosso e la foglia di verde. Guarda come il contorno spesso tiene ferma la forma anche con i colori.", "tool": "secchiello", "col": "rosso", "g": [["dot", 600, 540, "#d62828", "mela"], ["dot", 705, 232, "#2e9e44", "foglia"]]}
    ] },
  {"id": "d109", "f": "linee", "lv": 2, "ic": "🌳", "n": "Tre alberi: vicino, di mezzo, lontano", "tool": "pennarello", "col": "nero", "impara": "linea spessa per ciò che è vicino, sottile per ciò che è lontano", "passi": [
      {"t": "Comincia dal più lontano: un alberello piccolo e la linea dell’orizzonte, con linea sottile. Lascia due spazi vuoti dove passeranno i tronchi. Una linea fine aiuta a far sembrare le cose lontane.", "w": 4, "g": [["p", "M80 540 L282 540 M378 540 L684 540 M716 540 L1120 540"], ["c", 980, 470, 40], ["p", "M975 509 L975 545 M985 509 L985 545"]]},
      {"t": "Poi l’albero di mezzo, più grande, con una linea media. Più è vicino, più lo fai grande e più la linea diventa robusta.", "w": 10, "g": [["c", 700, 400, 85], ["p", "M686 484 L678 590 M714 484 L722 590"]]},
      {"t": "Infine l’albero vicino: grandissimo, con la linea spessa (lo Spessore è già alto; con la Pencil premi bene). La linea grossa lo fa venire avanti, verso chi guarda.", "w": 20, "g": [["c", 330, 330, 160], ["p", "M295 485 C305 600 285 700 262 780 M365 485 C355 600 380 700 398 780 M240 782 Q330 765 420 782"]]},
      {"t": "Colora le chiome: verde per l’albero vicino e verde chiaro per gli altri due. I colori più chiari aiutano a far sembrare le cose lontane. Poi colora di marrone il tronco dell’albero vicino.", "tool": "secchiello", "col": "verde", "g": [["dot", 330, 330, "#2e9e44", "verde"], ["dot", 700, 400, "#9bd770", "verde chiaro"], ["dot", 980, 470, "#9bd770", ""], ["dot", 330, 650, "#8b5a2b", "tronco"]]}
    ] },
  {"id": "d110", "f": "linee", "lv": 3, "ic": "🌿", "n": "Premere e alleggerire", "tool": "matita", "col": "nero", "w": 16, "impara": "una linea che parte sottile, si allarga e torna sottile", "passi": [
      {"t": "Ecco la forma da imparare: sottile, larga al centro, di nuovo sottile. Ricalca il contorno con la linea sottile e poi riempilo con il secchiello. Così la ottieni anche senza Pencil.", "tool": "pennarello", "w": 4, "g": [["p", "M200 130 Q600 30 1000 130 Q600 230 200 130 Z"]]},
      {"t": "Ora la stessa forma con un tratto solo. Con l’Apple Pencil parti leggera, premi a metà e alleggerisci alla fine. Col dito lo spessore non cambia dentro la linea: ripassa due o tre volte la parte di mezzo.", "w": 16, "g": [["l", 200, 270, 1000, 270]]},
      {"t": "Tre fili d’erba, ognuno con un tratto solo: premi vicino a terra e alleggerisci salendo, così la punta resta sottile. Col dito: ripassa ancora la parte bassa, che deve essere più larga.", "g": [["p", "M300 620 Q310 480 220 360"], ["p", "M420 620 Q430 460 430 340"], ["p", "M540 620 Q540 480 640 370"]]},
      {"t": "Un ciuffo di foglie lunghe che partono tutte dallo stesso punto, come un piccolo ramo. Ogni linea parte sottile, si allarga a metà e finisce a punta. Col dito: ripassa la parte di mezzo.", "g": [["p", "M850 620 Q780 520 760 400"], ["p", "M850 620 Q850 480 880 360"], ["p", "M850 620 Q930 500 1000 420"]]},
      {"t": "Le ciocche di capelli sono linee lunghe e ondulate: premi e alleggerisci più volte, con calma. Col dito: ripassa le parti che vuoi più larghe. Le ciocche affusolate sembrano morbide e leggere.", "g": [["p", "M150 700 C300 650 400 750 550 700 S800 660 950 720"], ["p", "M150 760 C300 710 400 810 550 760 S800 720 950 780"], ["p", "M150 820 C300 770 400 870 550 820 S800 780 950 840"]]}
    ] },
  {"id": "d111", "f": "linee", "lv": 2, "ic": "☕", "n": "Prima leggero, poi deciso", "tool": "matita", "col": "grigio", "impara": "schizzo leggero e poi ripasso deciso", "passi": [
      {"t": "Fai uno schizzo leggero del corpo della tazza: lo Spessore è già sottile e, con l’Apple Pencil, appoggi appena. Se una linea non ti convince, rifalla accanto, come mostra la guida a sinistra: nello schizzo si prova più volte.", "w": 3, "g": [["p", "M360 330 L388 700 Q560 790 732 700 L760 330"], ["p", "M374 336 L366 704 Q560 764 746 690"]]},
      {"t": "Aggiungi l’ovale della bocca e il manico, sempre leggeri. Le linee leggere si correggono con facilità e, quando poi ripassi, quasi non si notano.", "w": 3, "g": [["e", 560, 330, 200, 55], ["p", "M755 400 C900 400 900 640 735 640"]]},
      {"t": "Ora scegli le linee che ti piacciono e ripassa il corpo con una linea nera e decisa: lo Spessore è già medio e, con la Pencil, premi di più. Ripassi solo le linee scelte: le altre restano chiare.", "tool": "matita", "col": "nero", "w": 10, "g": [["p", "M360 330 L388 700 Q560 790 732 700 L760 330"]]},
      {"t": "Ripassa decisa anche la bocca e il manico. Prima le forme grandi leggere, poi le linee forti: il disegno resta pulito.", "tool": "matita", "col": "nero", "w": 10, "g": [["e", 560, 330, 200, 55], ["p", "M755 400 C900 400 900 640 735 640"]]},
      {"t": "Per ultimo il vapore, con una linea sottile: sono tre ondine che salgono dalla tazza. I particolari leggeri si aggiungono alla fine.", "tool": "matita", "col": "nero", "w": 4, "g": [["p", "M480 270 Q460 220 480 170 Q500 120 480 80"], ["p", "M560 270 Q540 220 560 170 Q580 120 560 80"], ["p", "M640 270 Q620 220 640 170 Q660 120 640 80"]]}
    ] },
  /* ---------- 🎨 FASE 2: il colore ---------- */
  { id: 'd201', f: 'colore', lv: 1, ic: '🎡', n: 'La ruota dei colori', tool: 'secchiello', col: 'giallo', impara: 'colori primari e secondari',
    base: [['c', 600, 450, 330], ['l', 600, 450, 600, 120], ['l', 600, 450, 886, 285], ['l', 600, 450, 886, 615], ['l', 600, 450, 600, 780], ['l', 600, 450, 314, 615], ['l', 600, 450, 314, 285]],
    passi: [
      { t: 'Ricalca la ruota: un cerchio diviso in 6 spicchi.', g: [['c', 600, 450, 330], ['l', 600, 450, 600, 120], ['l', 600, 450, 886, 285], ['l', 600, 450, 886, 615], ['l', 600, 450, 600, 780], ['l', 600, 450, 314, 615], ['l', 600, 450, 314, 285]], tool: 'pennarello', col: 'nero' },
      { t: 'Nella pittura i colori primari sono giallo, rosso e blu: non si ottengono mescolando altri colori. Colora uno spicchio sì e uno no: giallo, rosso, blu.', g: [['dot', 720, 250, '#f6d000', 'giallo'], ['dot', 720, 650, '#d62828', 'rosso'], ['dot', 360, 450, '#1f5fbf', 'blu']], tool: 'secchiello', col: 'giallo' },
      { t: 'I secondari si ottengono mescolando due primari: giallo + rosso = arancione, rosso + blu = viola, blu + giallo = verde. Mettili nello spicchio tra i due colori che li formano.', g: [['dot', 830, 450, '#f28c1b', 'arancione'], ['dot', 480, 650, '#7b3fa0', 'viola'], ['dot', 480, 250, '#2e9e44', 'verde']], tool: 'secchiello', col: 'arancione' }
    ] },
  { id: 'd202', f: 'colore', lv: 1, ic: '🔥', n: 'Colori caldi e colori freddi', tool: 'pastello', col: 'arancione', impara: 'come i colori cambiano la sensazione di un disegno',
    passi: [
      { t: 'Dividi il foglio a metà con una linea dritta, dall’alto fino in fondo. A sinistra un sole, a destra una luna.', g: [['l', 600, 0, 600, 900], ['c', 300, 300, 110], ['p', 'M960 200 A120 120 0 1 0 960 440 A150 150 0 0 1 960 200']], tool: 'matita', col: 'nero' },
      { t: 'I colori caldi (giallo, arancione, rosso) ricordano il sole e il fuoco. Colora la parte del sole solo con colori caldi.', g: [['dot', 300, 300, '#f6d000', 'giallo'], ['dot', 300, 600, '#f28c1b', 'arancione'], ['dot', 150, 780, '#d62828', 'rosso']], tool: 'pastello', col: 'arancione' },
      { t: 'I colori freddi (blu, azzurro, verde, viola) ricordano l’acqua, il ghiaccio e la notte. Colora la parte della luna solo con colori freddi.', g: [['dot', 900, 650, '#1f5fbf', 'blu'], ['dot', 1050, 780, '#7b3fa0', 'viola'], ['dot', 760, 780, '#2e9e44', 'verde']], tool: 'pastello', col: 'blu' },
      { t: 'Guarda i due lati: i colori caldi sembrano venire verso di te, quelli freddi sembrano più lontani e calmi. I pittori lo usano per dare emozione e profondità.', g: [] }
    ] },
  { id: 'd203', f: 'colore', lv: 2, ic: '🌈', n: 'Dal chiaro allo scuro', tool: 'secchiello', col: 'blu1', impara: 'le sfumature di un colore',
    passi: [
      { t: 'Ricalca cinque quadrati in fila.', g: [['r', 90, 330, 190, 190], ['r', 300, 330, 190, 190], ['r', 510, 330, 190, 190], ['r', 720, 330, 190, 190], ['r', 930, 330, 190, 190]], tool: 'pennarello', col: 'nero' },
      { t: 'Ogni colore ha tante sfumature. Per schiarirlo i pittori aggiungono bianco (con l’acquerello, più acqua); per scurirlo un po’ di nero o un colore più scuro. Colora dal più chiaro al più scuro.', g: [['dot', 185, 425, '#dbe7fb', '1'], ['dot', 395, 425, '#a9c4f2', '2'], ['dot', 605, 425, '#5f8fe0', '3'], ['dot', 815, 425, '#2a5cb8', '4'], ['dot', 1025, 425, '#16336b', '5']], tool: 'secchiello', col: 'blu1' },
      { t: 'Ora prova con un altro colore che ti piace, sotto: usa il pastello premendo poco per il chiaro e di più per lo scuro.', g: [['r', 90, 600, 1030, 160]], tool: 'pastello', col: 'rosso' }
    ] },
  { id: 'd204', f: 'colore', lv: 2, ic: '🍎', n: 'I colori complementari', tool: 'secchiello', col: 'rosso', impara: 'coppie di colori che si fanno risaltare',
    passi: [
      { t: 'Nella ruota dei colori i complementari stanno uno di fronte all’altro: rosso e verde, giallo e viola, blu e arancione. Disegna una mela con la foglia.', g: [['p', 'M600 260 C470 170 300 260 330 470 C350 640 480 760 600 690 C720 760 850 640 870 470 C900 260 730 170 600 260 Z'], ['p', 'M600 260 Q590 190 610 140'], ['p', 'M600 180 Q690 110 780 150 Q690 210 600 180 Z']], tool: 'matita', col: 'nero' },
      { t: 'Mela rossa e foglia verde: messi vicini, i complementari si accendono a vicenda.', g: [['dot', 600, 480, '#d62828', 'rosso'], ['dot', 700, 160, '#2e9e44', 'verde']], tool: 'secchiello', col: 'rosso' },
      { t: 'Ora prova un’altra coppia: disegna in alto un sole giallo e colora lo sfondo di viola, il suo complementare.', g: [['c', 1000, 160, 90], ['dot', 1000, 160, '#f6d000', 'giallo'], ['dot', 150, 800, '#7b3fa0', 'viola']], tool: 'secchiello', col: 'viola' }
    ] },
  { id: 'd205', f: 'colore', lv: 3, ic: '🌅', n: 'Il tramonto sfumato', tool: 'acquerello', col: 'giallo', impara: 'sfumare un colore nell’altro',
    passi: [
      { t: 'Con l’acquerello fai delle strisce larghe da sinistra a destra: in basso giallo.', g: [['r', 0, 560, 1200, 200]], tool: 'acquerello', col: 'giallo' },
      { t: 'Sopra l’arancione, che tocca un po’ il giallo.', g: [['r', 0, 360, 1200, 220]], tool: 'acquerello', col: 'arancione' },
      { t: 'In alto il rosa e il viola.', g: [['r', 0, 80, 1200, 300]], tool: 'acquerello', col: 'viola' },
      { t: 'Con lo sfumino passa dove i colori si toccano, avanti e indietro: il confine sparisce e il cielo diventa morbido (con l’acquerello vero si fa passando il pennello bagnato quando il colore è ancora umido).', g: [['l', 0, 570, 1200, 570], ['l', 0, 370, 1200, 370]], tool: 'sfumino', col: 'giallo' },
      { t: 'Per finire, una collina scura in basso: sembrerà davanti al tramonto.', g: [['p', 'M0 770 Q350 620 650 720 Q900 800 1200 680 L1200 900 L0 900 Z']], tool: 'pennarello', col: 'viola' }
    ] },
  /* 14/11/2026: perché questo colore (autore + revisore) */
  {"id": "d206", "f": "colore", "lv": 2, "ic": "☂️", "n": "Un colore per attirare lo sguardo", "tool": "matita", "col": "nero", "w": 5, "impara": "un solo colore acceso tra tanti colori tenui", "passi": [
      {"t": "Disegna quattro ombrelli piccoli, uno per angolo: la cupola con tre spicchi e il manico che scende da sotto. Saranno lo sfondo: avranno tutti colori delicati.", "g": [["p", "M110 330 C110 277.2 164 234 230 234 C296 234 350 277.2 350 330 Q310 363.6 270 330 Q230 363.6 190 330 Q150 363.6 110 330"], ["p", "M230 234 Q176 291.6 190 330"], ["p", "M230 234 Q284 291.6 270 330"], ["p", "M230 346.8 L230 486 Q230 528 182 510"], ["p", "M870 300 C870 251.6 919.5 212 980 212 C1040.5 212 1090 251.6 1090 300 Q1053.3333333333333 330.8 1016.6666666666666 300 Q980 330.8 943.3333333333333 300 Q906.6666666666667 330.8 870 300"], ["p", "M980 212 Q930.5 264.8 943.3333333333334 300"], ["p", "M980 212 Q1029.5 264.8 1016.6666666666666 300"], ["p", "M980 315.4 L980 443 Q980 481.5 936 465"], ["p", "M150 680 C150 636 195 600 250 600 C305 600 350 636 350 680 Q316.66666666666663 708 283.3333333333333 680 Q249.99999999999997 708 216.66666666666663 680 Q183.33333333333331 708 150 680"], ["p", "M250 600 Q205 648 216.66666666666666 680"], ["p", "M250 600 Q295 648 283.3333333333333 680"], ["p", "M250 694 L250 810 Q250 845 210 830"], ["p", "M860 660 C860 616 905 580 960 580 C1015 580 1060 616 1060 660 Q1026.6666666666667 688 993.3333333333334 660 Q960 688 926.6666666666667 660 Q893.3333333333333 688 860 660"], ["p", "M960 580 Q915 628 926.6666666666666 660"], ["p", "M960 580 Q1005 628 993.3333333333334 660"], ["p", "M960 674 L960 790 Q960 825 920 810"]]},
      {"t": "Al centro disegna un ombrello molto più grande, sempre con tre spicchi e il manico. Sarà lui il protagonista del disegno.", "g": [["p", "M400 440 C400 352 490 280 600 280 C710 280 800 352 800 440 Q733.3333333333333 496 666.6666666666666 440 Q600 496 533.3333333333333 440 Q466.6666666666666 496 399.9999999999999 440"], ["p", "M600 280 Q510 376 533.3333333333334 440"], ["p", "M600 280 Q690 376 666.6666666666666 440"], ["p", "M600 468 L600 700 Q600 770 520 740"]]},
      {"t": "Con linee sottili e leggere disegna la pioggia: tanti tratti obliqui, tutti nella stessa direzione.", "col": "grigio", "w": 3, "g": [["l", 140, 120, 115, 180], ["l", 360, 100, 335, 160], ["l", 520, 150, 495, 210], ["l", 740, 110, 715, 170], ["l", 1060, 110, 1035, 170], ["l", 130, 500, 105, 560], ["l", 1090, 500, 1065, 560], ["l", 440, 780, 415, 840], ["l", 780, 770, 755, 830], ["l", 600, 800, 575, 860], ["l", 110, 800, 85, 860], ["l", 1090, 800, 1065, 860], ["l", 420, 600, 395, 660], ["l", 820, 560, 795, 620]]},
      {"t": "Colora i quattro ombrelli piccoli con colori tenui, grigio chiaro e celestino: ogni spicchio è una zona da riempire. I colori pallidi e delicati restano in secondo piano.", "tool": "secchiello", "col": "g2", "g": [["dot", 158, 305, "#c8c8c8", ""], ["dot", 230, 298, "#c8c8c8", "grigio chiaro"], ["dot", 302, 305, "#c8c8c8", ""], ["dot", 914, 275, "#cfe8fb", ""], ["dot", 980, 268, "#cfe8fb", "celestino"], ["dot", 1046, 275, "#cfe8fb", ""], ["dot", 190, 655, "#c8c8c8", ""], ["dot", 250, 648, "#c8c8c8", "grigio chiaro"], ["dot", 310, 655, "#c8c8c8", ""], ["dot", 900, 635, "#cfe8fb", ""], ["dot", 960, 628, "#cfe8fb", "celestino"], ["dot", 1020, 635, "#cfe8fb", ""]]},
      {"t": "Ora l’ombrello grande: colora di rosso acceso i suoi tre spicchi. Tra tanti colori tenui l’occhio va subito sull’unico colore forte, perché è diverso da tutti gli altri.", "tool": "secchiello", "col": "rosso", "g": [["dot", 475, 410, "#d62828", ""], ["dot", 600, 400, "#d62828", "rosso"], ["dot", 725, 410, "#d62828", ""]]}
    ] },
  {"id": "d207", "f": "colore", "lv": 2, "ic": "⛵", "n": "Tre colori che stanno bene insieme", "tool": "matita", "col": "nero", "impara": "scegliere una piccola tavolozza e ripeterla", "passi": [
      {"t": "Per tutto il disegno userai solo tre colori: blu, azzurro e giallo. In alto disegna tre quadratini, uno accanto all’altro: saranno la tua tavolozza.", "g": [["r", 80, 50, 140, 110], ["r", 260, 50, 140, 110], ["r", 440, 50, 140, 110]]},
      {"t": "Colora i tre quadratini: blu, azzurro e giallo. Blu e azzurro sono vicini tra loro; il giallo è molto diverso e accanto al blu si nota subito.", "tool": "secchiello", "col": "blu", "g": [["dot", 150, 88, "#1f5fbf", "blu"], ["dot", 330, 88, "#7cc4f2", "azzurro"], ["dot", 510, 88, "#f6d000", "giallo"]]},
      {"t": "Disegna il riquadro del paesaggio e il sole, che è un cerchio. Poi la linea dell’orizzonte, in due pezzi: lascia vuoto lo spazio in mezzo, dove andrà la barca.", "g": [["r", 100, 200, 1000, 640], ["c", 920, 300, 60], ["p", "M100 560 L420 560 M700 560 L1100 560"]]},
      {"t": "Nello spazio vuoto disegna la barca a vela: lo scafo è un trapezio con il lato lungo in alto, sulla linea dell’orizzonte. Poi l’albero dritto e due vele a triangolo, una grande e una piccola.", "g": [["p", "M420 560 L700 560 L640 650 L480 650 Z"], ["l", 560, 560, 560, 330], ["p", "M572 345 L572 560 L700 560 Z"], ["p", "M548 400 L548 560 L450 560 Z"]]},
      {"t": "Colora usando solo la tavolozza: cielo azzurro, mare blu, sole e vele gialli, scafo azzurro. Gli stessi colori tornano in punti diversi: pochi colori ripetuti tengono unito il disegno.", "tool": "secchiello", "col": "azzurro", "g": [["dot", 300, 320, "#7cc4f2", "cielo"], ["dot", 230, 740, "#1f5fbf", "mare"], ["dot", 920, 300, "#f6d000", "sole"], ["dot", 615, 495, "#f6d000", "vela"], ["dot", 515, 525, "#f6d000", ""], ["dot", 560, 592, "#7cc4f2", "scafo"]]},
      {"t": "Per finire, disegna tre onde azzurre sul mare blu. Con tre colori il disegno sembra ordinato, perché tutto usa gli stessi colori.", "tool": "pastello", "col": "azzurro", "w": 8, "g": [["p", "M170 700 Q220 670 270 700 T370 700"], ["p", "M720 720 Q770 690 820 720 T920 720"], ["p", "M330 790 Q380 760 430 790 T530 790"]]}
    ] },
  {"id": "d208", "f": "colore", "lv": 3, "ic": "🏡", "n": "Caldi e freddi: la stessa casetta", "tool": "matita", "col": "nero", "impara": "come i colori caldi e freddi cambiano l’atmosfera", "passi": [
      {"t": "Nel riquadro di sinistra disegna una casetta: muri, tetto a triangolo, la porta e due finestre. Poi la linea del terreno.", "g": [["r", 70, 150, 510, 640], ["r", 175, 378, 300, 262], ["p", "M150 378 L325 203 L500 378 Z"], ["r", 294, 490, 63, 150], ["r", 200, 428, 69, 69], ["r", 381, 428, 69, 69], ["l", 70, 640, 580, 640]]},
      {"t": "Nel riquadro di destra rifai la stessa casetta, con le stesse forme e le stesse misure. Cambieranno solo i colori.", "g": [["r", 620, 150, 510, 640], ["r", 725, 378, 300, 262], ["p", "M700 378 L875 203 L1050 378 Z"], ["r", 844, 490, 63, 150], ["r", 750, 428, 69, 69], ["r", 931, 428, 69, 69], ["l", 620, 640, 1130, 640]]},
      {"t": "A sinistra usa colori caldi: giallo, arancione, rosso, marrone. Molti li trovano accoglienti, come un pomeriggio di sole.", "tool": "secchiello", "col": "arancione", "g": [["dot", 130, 200, "#f6d000", "cielo"], ["dot", 230, 545, "#f28c1b", "muro"], ["dot", 325, 310, "#d62828", "tetto"], ["dot", 325.5, 545, "#8b5a2b", "porta"], ["dot", 234.5, 462.5, "#f6d000", "finestra"], ["dot", 415.5, 462.5, "#f6d000", ""], ["dot", 325, 720, "#8b5a2b", "terreno"], ["txt", 325, 115, "colori caldi"]]},
      {"t": "A destra usa colori freddi: celestino, azzurro, blu, viola. A molti sembrano più calmi e freschi, come una sera d’inverno. La casetta è la stessa, ma l’atmosfera cambia.", "tool": "secchiello", "col": "azzurro", "g": [["dot", 680, 200, "#cfe8fb", "cielo"], ["dot", 780, 545, "#7cc4f2", "muro"], ["dot", 875, 310, "#2a5cb8", "tetto"], ["dot", 875.5, 545, "#7b3fa0", "porta"], ["dot", 784.5, 462.5, "#dbe7fb", "finestra"], ["dot", 965.5, 462.5, "#dbe7fb", ""], ["dot", 875, 720, "#5f8fe0", "terreno"], ["txt", 875, 115, "colori freddi"]]}
    ] },
  /* ---------- 🌗 FASE 3: luce, ombra e volume ---------- */
  { id: 'd301', f: 'ombra', lv: 1, ic: '⬛', n: 'La scala dei grigi', tool: 'matita', col: 'nero', impara: 'chiaro e scuro con la pressione della matita',
    passi: [
      { t: 'Ricalca cinque rettangoli in fila.', g: [['r', 90, 330, 190, 240], ['r', 300, 330, 190, 240], ['r', 510, 330, 190, 240], ['r', 720, 330, 190, 240], ['r', 930, 330, 190, 240]] },
      { t: 'Lascia il primo bianco. Nel secondo passa la matita premendo pochissimo, poi sempre di più: l’ultimo deve essere quasi nero. Premere di più fa il tratto più scuro.', g: [['txt', 185, 620, 'bianco'], ['txt', 395, 620, 'chiaro'], ['txt', 605, 620, 'medio'], ['txt', 815, 620, 'scuro'], ['txt', 1025, 620, 'nero']] }
    ] },
  { id: 'd302', f: 'ombra', lv: 1, ic: '⚪', n: 'Da cerchio a palla', tool: 'matita', col: 'nero', impara: 'luce, ombra propria e ombra portata',
    passi: [
      { t: 'Disegna un cerchio e decidi da dove arriva la luce: qui arriva dall’alto a sinistra.', g: [['c', 560, 420, 230], ['sun', 160, 120]] },
      { t: 'Dove la luce batte più forte resta una piccola zona bianca: il punto di luce.', g: [['e', 470, 330, 45, 35], ['txt', 470, 260, 'luce']] },
      { t: 'Dalla parte opposta alla luce c’è l’ombra propria: colora con la matita una mezzaluna in basso a destra. Comincia leggera dove finisce la luce e diventa più scura verso il centro della mezzaluna.', g: [['p', 'M760 300 A230 230 0 0 1 440 615 Q700 590 760 300 Z'], ['txt', 700, 560, 'ombra propria']] },
      { t: 'Sul tavolo, dalla parte opposta alla luce, la palla fa l’ombra portata: un ovale scuro appoggiato sotto.', g: [['e', 720, 675, 200, 30], ['txt', 900, 740, 'ombra portata']] },
      { t: 'Proprio sul bordo in basso lascia una sottile striscia un po’ più chiara: è il riflesso della luce che rimbalza dal tavolo.', g: [['p', 'M430 600 Q560 680 720 590'], ['txt', 560, 730, 'riflesso']] }
    ] },
  { id: 'd303', f: 'ombra', lv: 2, ic: '▦', n: 'Il tratteggio', tool: 'matita', col: 'nero', impara: 'fare l’ombra con le linee',
    passi: [
      { t: 'Ricalca tre quadrati.', g: [['r', 120, 300, 260, 260], ['r', 470, 300, 260, 260], ['r', 820, 300, 260, 260]] },
      { t: 'Nel primo, linee parallele lontane tra loro: è un’ombra leggera. Riempi tutto il quadrato in questo modo.', g: [['l', 140, 540, 360, 320], ['l', 180, 540, 360, 360], ['l', 220, 540, 360, 400], ['l', 140, 500, 320, 320], ['l', 140, 460, 280, 320]] },
      { t: 'Nel secondo, linee parallele vicine, in tutto il quadrato: l’ombra è più scura.', g: [['l', 490, 540, 710, 320], ['l', 510, 540, 710, 340], ['l', 530, 540, 710, 360], ['l', 490, 520, 690, 320], ['l', 490, 500, 670, 320]] },
      { t: 'Nel terzo, il tratteggio incrociato: linee in una direzione e poi nell’altra. Riempi tutto il quadrato: è l’ombra più scura.', g: [['l', 840, 540, 1060, 320], ['l', 860, 540, 1060, 340], ['l', 840, 520, 1040, 320], ['l', 840, 320, 1060, 540], ['l', 860, 320, 1060, 520], ['l', 840, 340, 1040, 540]] }
    ] },
  { id: 'd304', f: 'ombra', lv: 2, ic: '🧊', n: 'Il cubo con la luce', tool: 'matita', col: 'nero', impara: 'tre facce, tre toni',
    passi: [
      { t: 'Disegna il cubo: la faccia davanti è un quadrato, quella sopra e quella di lato sono inclinate.', g: [['r', 420, 380, 300, 300], ['p', 'M420 380 L560 260 L860 260 L720 380'], ['p', 'M720 680 L860 560 L860 260']] },
      { t: 'La luce arriva dall’alto a sinistra. La faccia sopra è la più chiara: lasciala quasi bianca.', g: [['sun', 200, 120], ['txt', 640, 330, 'chiaro']] },
      { t: 'La faccia davanti è un po’ in ombra: grigio medio, con tratti leggeri.', g: [['txt', 570, 530, 'medio']] },
      { t: 'La faccia di lato è la più lontana dalla luce: la più scura.', g: [['txt', 790, 480, 'scuro']] },
      { t: 'A terra, dalla parte opposta alla luce, l’ombra portata del cubo.', g: [['p', 'M720 680 L860 560 L1060 600 L960 700 Z']] }
    ] },
  { id: 'd305', f: 'ombra', lv: 3, ic: '🍐', n: 'La pera dal vero', tool: 'pastello', col: 'verdechiaro', impara: 'colore con luce e ombra',
    passi: [
      { t: 'Disegna la pera: un cerchio grande in basso e uno più piccolo sopra, uniti da due curve; poi il picciolo. Cancella le linee dei cerchi che restano dentro la pera. Se puoi, metti una pera vera davanti a te e guardala.', g: [['c', 600, 580, 210], ['c', 600, 300, 120], ['p', 'M480 320 Q470 430 400 520'], ['p', 'M720 320 Q730 430 800 520'], ['p', 'M600 180 Q610 130 640 100']], tool: 'matita', col: 'nero' },
      { t: 'Colora tutta la pera di verde chiaro con il pastello, leggero.', g: [['dot', 600, 580, '#9bd770', 'verde chiaro']], tool: 'pastello', col: 'verdechiaro' },
      { t: 'La luce viene da sinistra: sul lato destro passa un verde più scuro. Lascia chiara una macchia a sinistra.', g: [['sun', 150, 300], ['p', 'M743 420 Q830 600 700 760']], tool: 'pastello', col: 'verde' },
      { t: 'Sfuma con lo sfumino tra il chiaro e lo scuro, e aggiungi l’ombra portata a destra sul tavolo.', g: [['e', 800, 800, 200, 40]], tool: 'sfumino', col: 'verde' }
    ] },
  /* ---------- 🏞️ FASE 4: prospettiva e paesaggio ---------- */
  { id: 'd401', f: 'spazio', lv: 1, ic: '🌳', n: 'Vicino e lontano', tool: 'matita', col: 'nero', impara: 'le cose lontane sembrano piccole e più vicine all’orizzonte',
    passi: [
      { t: 'Traccia la linea dell’orizzonte, dove il cielo tocca la terra, da un bordo all’altro.', g: [['l', 0, 380, 1200, 380]] },
      { t: 'Un albero grande vicino a te, in basso: tronco e chioma.', g: [['r', 230, 560, 50, 260], ['c', 255, 470, 140]] },
      { t: 'Un albero medio più indietro: più piccolo e più vicino all’orizzonte.', g: [['r', 600, 470, 30, 140], ['c', 615, 420, 75]] },
      { t: 'Un albero piccolissimo lontano, vicino all’orizzonte.', g: [['r', 900, 395, 14, 50], ['c', 907, 375, 30]] },
      { t: 'Colora: le cose lontane si vedono più chiare e un po’ azzurrine, perché c’è tanta aria in mezzo.', g: [['dot', 255, 470, '#2e9e44', 'verde'], ['dot', 615, 420, '#9bd770', 'più chiaro'], ['dot', 907, 375, '#cfe8fb', 'chiarissimo']], tool: 'pastello', col: 'verde' }
    ] },
  { id: 'd402', f: 'spazio', lv: 1, ic: '⛰️', n: 'Le colline una dietro l’altra', tool: 'matita', col: 'nero', impara: 'la sovrapposizione',
    passi: [
      { t: 'Una collina lontana, in alto.', g: [['p', 'M0 430 Q350 220 650 400 Q900 260 1200 370']] },
      { t: 'Una collina davanti, che copre il fondo della prima: quello che sta davanti nasconde quello che sta dietro.', g: [['p', 'M0 580 Q400 380 800 560 Q1000 480 1200 520']] },
      { t: 'La collina più vicina, in basso.', g: [['p', 'M0 730 Q500 560 1200 700']] },
      { t: 'Colora dalla più lontana (azzurrina e chiara) alla più vicina (verde scuro).', g: [['dot', 900, 420, '#cfe8fb', 'lontana'], ['dot', 500, 520, '#9bd770', 'in mezzo'], ['dot', 600, 800, '#2e9e44', 'vicina']], tool: 'secchiello', col: 'celestino' }
    ] },
  { id: 'd403', f: 'spazio', lv: 2, ic: '⛵', n: 'Il mare e l’orizzonte', tool: 'matita', col: 'nero', impara: 'la linea dell’orizzonte all’altezza dei tuoi occhi',
    passi: [
      { t: 'L’orizzonte sul mare è una linea dritta da un bordo all’altro del foglio: sta all’altezza dei tuoi occhi.', g: [['l', 0, 420, 1200, 420]] },
      { t: 'Una barca vicina, grande e in basso.', g: [['p', 'M230 700 L570 700 L510 770 L290 770 Z'], ['l', 400, 700, 400, 470], ['p', 'M400 480 L400 680 L560 680 Z']] },
      { t: 'Una barca lontana: piccola e vicina all’orizzonte.', g: [['p', 'M850 450 L930 450 L915 466 L865 466 Z'], ['l', 890, 450, 890, 400], ['p', 'M890 402 L890 445 L925 445 Z']] },
      { t: 'Qualche onda: grande davanti, piccola lontano.', g: [['p', 'M120 820 q40 -30 80 0 q40 -30 80 0'], ['p', 'M700 600 q25 -18 50 0 q25 -18 50 0'], ['p', 'M980 480 q12 -9 24 0 q12 -9 24 0']] },
      { t: 'Colora il cielo e il mare.', g: [['dot', 600, 200, '#cfe8fb', 'cielo'], ['dot', 700, 700, '#1f5fbf', 'mare']], tool: 'secchiello', col: 'celestino' }
    ] },
  { id: 'd404', f: 'spazio', lv: 2, ic: '🛣️', n: 'La strada che va lontano', tool: 'matita', col: 'nero', impara: 'il punto di fuga',
    passi: [
      { t: 'L’orizzonte e, al centro, un punto: è il punto di fuga, dove sembrano incontrarsi le linee che vanno lontano.', g: [['l', 0, 360, 1200, 360], ['c', 600, 360, 8]] },
      { t: 'I bordi della strada partono larghi in basso e vanno tutti verso il punto di fuga.', g: [['l', 168, 900, 600, 360], ['l', 1032, 900, 600, 360]] },
      { t: 'La riga di mezzo: trattini sempre più corti e più vicini verso il punto.', g: [['l', 600, 840, 600, 760], ['l', 600, 680, 600, 620], ['l', 600, 560, 600, 520], ['l', 600, 480, 600, 455], ['l', 600, 425, 600, 410]] },
      { t: 'I pali della luce lungo la strada: alti vicino a te, sempre più bassi verso il punto di fuga. I piedi e le punte dei pali stanno su due linee che vanno al punto di fuga.', g: [['l', 150, 800, 150, 420], ['l', 283, 670, 283, 402], ['l', 395, 560, 395, 387], ['l', 477, 480, 477, 376], ['l', 528, 430, 528, 370]] },
      { t: 'Colora la strada grigia e il prato verde.', g: [['dot', 450, 760, '#8a8a8a', 'strada'], ['dot', 100, 600, '#2e9e44', 'prato'], ['dot', 1100, 600, '#2e9e44', 'prato']], tool: 'secchiello', col: 'grigio' }
    ] },
  { id: 'd405', f: 'spazio', lv: 3, ic: '🏡', n: 'Il paesaggio in tre piani', tool: 'matita', col: 'nero', impara: 'primo piano, piano medio e sfondo',
    passi: [
      { t: 'Lo sfondo: montagne lontane, in alto, contro il cielo.', g: [['p', 'M0 400 L250 200 L420 360 L620 160 L860 370 L1000 250 L1200 330']] },
      { t: 'Il piano medio: un prato con una casetta e due alberi, di grandezza media.', g: [['l', 0, 520, 1200, 520], ['p', 'M0 640 Q600 580 1200 640'], ['r', 700, 420, 120, 100], ['p', 'M690 420 L760 360 L830 420'], ['c', 320, 440, 50], ['l', 320, 490, 320, 520], ['c', 450, 450, 40], ['l', 450, 490, 450, 520]] },
      { t: 'Il primo piano: in basso, grandi e con i dettagli, dei fiori e dell’erba.', g: [['c', 200, 760, 40], ['l', 200, 800, 200, 880], ['c', 980, 720, 50], ['l', 980, 770, 980, 880], ['p', 'M80 880 l15 -60 l15 60 l15 -50 l15 50 M500 880 l15 -60 l15 60 l15 -50 l15 50']] },
      { t: 'Colora: lo sfondo chiaro e azzurrino, il piano medio con colori normali, il primo piano con i colori più vivi.', g: [['dot', 620, 250, '#cfe8fb', 'sfondo'], ['dot', 600, 570, '#9bd770', 'medio'], ['dot', 600, 780, '#2e9e44', 'primo piano']], tool: 'pastello', col: 'verde' }
    ] },
  /* ---------- 🙂 FASE 5: il viso e la figura ---------- */
  { id: 'd501', f: 'figura', lv: 1, ic: '🙂', n: 'Le misure del viso', tool: 'matita', col: 'nero', impara: 'dove stanno occhi, naso, bocca e orecchie',
    passi: [
      { t: 'Il viso è un ovale. Traccia leggera una linea verticale al centro.', g: [['e', 600, 460, 230, 320], ['l', 600, 140, 600, 780]] },
      { t: 'Gli occhi stanno a metà altezza della testa: traccia lì una linea orizzontale. (Sembra basso, ma è proprio così!)', g: [['l', 370, 460, 830, 460]] },
      { t: 'Due occhi a forma di mandorla sulla linea; tra un occhio e l’altro c’è lo spazio di un altro occhio.', g: [['p', 'M440 460 Q490 425 540 460 Q490 490 440 460 Z'], ['p', 'M660 460 Q710 425 760 460 Q710 490 660 460 Z']] },
      { t: 'Il naso finisce più o meno a metà tra gli occhi e il mento.', g: [['l', 520, 620, 680, 620], ['p', 'M575 615 Q600 640 625 615']] },
      { t: 'La bocca sta più vicina al naso che al mento, circa a un terzo della distanza.', g: [['p', 'M530 680 Q600 715 670 680']] },
      { t: 'Le orecchie stanno tra la linea degli occhi e la fine del naso; sopra, i capelli.', g: [['p', 'M372 460 Q322 540 401 620'], ['p', 'M828 460 Q878 540 799 620'], ['p', 'M370 400 Q380 120 600 135 Q820 120 830 400']] }
    ] },
  { id: 'd502', f: 'figura', lv: 2, ic: '😮', n: 'Le espressioni', tool: 'matita', col: 'nero', impara: 'come sopracciglia e bocca cambiano l’emozione',
    passi: [
      { t: 'Quattro cerchi per quattro facce.', g: [['c', 200, 450, 130], ['c', 470, 450, 130], ['c', 740, 450, 130], ['c', 1010, 450, 130]] },
      { t: 'Felice: occhi a puntino e bocca a sorriso.', g: [['c', 160, 420, 8], ['c', 240, 420, 8], ['p', 'M140 480 Q200 540 260 480']] },
      { t: 'Triste: sopracciglia che scendono verso l’esterno e bocca all’ingiù.', g: [['l', 405, 395, 445, 380], ['l', 495, 380, 535, 395], ['c', 430, 420, 8], ['c', 510, 420, 8], ['p', 'M420 520 Q470 480 520 520']] },
      { t: 'Sorpresa: sopracciglia alte e curve, bocca a cerchio.', g: [['p', 'M680 380 Q700 360 720 380'], ['p', 'M760 380 Q780 360 800 380'], ['c', 700, 420, 10], ['c', 780, 420, 10], ['c', 740, 500, 25]] },
      { t: 'Arrabbiata: sopracciglia che scendono verso il centro e bocca dritta stretta.', g: [['l', 945, 380, 990, 400], ['l', 1030, 400, 1075, 380], ['c', 970, 425, 8], ['c', 1050, 425, 8], ['l', 965, 505, 1055, 505]] }
    ] },
  { id: 'd503', f: 'figura', lv: 2, ic: '🧍', n: 'Il manichino di forme', tool: 'matita', col: 'nero', impara: 'le proporzioni del corpo',
    passi: [
      { t: 'Un corpo si misura in «teste». Un adulto è alto circa 7–8 teste; un bambino della tua età circa 6 e mezzo. Disegna la testa, un ovale piccolo in alto.', g: [['e', 600, 130, 50, 62]] },
      { t: 'Il collo corto e il busto, una forma più larga in alto per le spalle.', g: [['l', 600, 192, 600, 220], ['p', 'M510 220 L690 220 L660 420 L540 420 Z']] },
      { t: 'Il bacino è un ovale sotto il busto.', g: [['e', 600, 450, 75, 40]] },
      { t: 'Le braccia: il gomito arriva all’altezza della vita, la mano a metà della coscia.', g: [['l', 515, 225, 470, 410], ['l', 470, 410, 452, 530], ['c', 450, 548, 18], ['l', 685, 225, 730, 410], ['l', 730, 410, 748, 530], ['c', 750, 548, 18]] },
      { t: 'Le gambe sono lunghe circa metà di tutto il corpo; il ginocchio sta a metà della gamba.', g: [['l', 565, 480, 545, 640], ['l', 545, 640, 540, 800], ['l', 635, 480, 655, 640], ['l', 655, 640, 660, 800], ['e', 525, 812, 35, 14], ['e', 675, 812, 35, 14]] }
    ] },
  { id: 'd504', f: 'figura', lv: 3, ic: '🏃‍♀️', n: 'La figura in movimento', tool: 'matita', col: 'nero', impara: 'la linea del movimento',
    passi: [
      { t: 'Ogni figura in movimento ha una «linea di azione»: una curva che segue la spinta del corpo. Disegnala inclinata, come chi corre.', g: [['p', 'M500 820 Q560 500 700 170']] },
      { t: 'Sopra la linea metti la testa e il busto inclinati in avanti.', g: [['c', 710, 150, 50], ['p', 'M640 210 L740 230 L640 450 L570 420 Z']] },
      { t: 'Una gamba spinge indietro, l’altra si piega in avanti.', g: [['l', 600, 440, 470, 600], ['l', 470, 600, 380, 720], ['l', 620, 440, 740, 590], ['l', 740, 590, 700, 760]] },
      { t: 'Le braccia si muovono al contrario delle gambe: un braccio avanti, l’altro indietro.', g: [['l', 700, 240, 800, 360], ['l', 800, 360, 880, 320], ['l', 660, 240, 560, 330], ['l', 560, 330, 540, 420]] },
      { t: 'Ora vesti il manichino: maglietta, pantaloncini, scarpe e capelli che volano all’indietro.', g: [] }
    ] },
  /* ---------- ✋ FORME A MANO LIBERA (14/11/2026): 4 esercizi per scaldare la mano e 8 soggetti fatti di forme semplici; palestra sempre aperta ---------- */
  {"id": "d601", "f": "mano", "lv": 1, "ic": "⭕", "n": "Il cerchio in un colpo solo", "tool": "pennarello", "col": "blu", "w": 9, "impara": "fare un cerchio con un solo gesto del braccio", "passi": [
      {"t": "Prima fai girare la mano in aria sopra il foglio, senza toccarlo, tre o quattro volte. Poi scendi e ricalca il cerchio con un giro solo, muovendo tutto il braccio: così il gesto è morbido e il cerchio viene più tondo.", "g": [["c", 600, 200, 150]]},
      {"t": "Altri due cerchi grandi accanto al primo, ognuno con un giro solo, senza fermarti a metà. Non è un problema se non si chiude perfetto: la mano impara ripetendo il gesto.", "g": [["c", 250, 200, 150], ["c", 950, 200, 150]]},
      {"t": "Ora i cerchi medi: stesso gesto, ma più piccolo. Respira piano e fai un giro solo per ogni cerchio. Prima di scendere sul foglio, gira ancora un momento in aria.", "g": [["c", 200, 540, 90], ["c", 450, 540, 90], ["c", 700, 540, 90], ["c", 950, 540, 90]]},
      {"t": "Per finire, una fila di cerchi piccoli. Qui lavorano di più il polso e le dita. Se un cerchio non si chiude bene, passa al prossimo: ogni cerchio è un nuovo tentativo.", "g": [["c", 150, 780, 45], ["c", 330, 780, 45], ["c", 510, 780, 45], ["c", 690, 780, 45], ["c", 870, 780, 45], ["c", 1050, 780, 45]]}
    ] },
  {"id": "d602", "f": "mano", "lv": 1, "ic": "🥚", "n": "L’ovale", "tool": "pennarello", "col": "blu", "w": 9, "impara": "disegnare ovali sdraiati e in piedi", "passi": [
      {"t": "Gli ovali sdraiati sono larghi. Fanne tre in fila, con un giro solo per ciascuno. L’ovale è la forma del corpo di tanti animali, come il gatto o il pesce.", "g": [["e", 220, 150, 150, 80], ["e", 600, 150, 150, 80], ["e", 980, 150, 150, 80]]},
      {"t": "Ora gli ovali in piedi, che sono alti e stretti. Il gesto è lo stesso, ma la mano sale e scende. Ricorda che l’ovale è un cerchio un po’ allungato.", "g": [["e", 200, 440, 80, 140], ["e", 450, 440, 80, 140], ["e", 700, 440, 80, 140], ["e", 950, 440, 80, 140]]},
      {"t": "Una fila di ovali sempre più piccoli, uno vicino all’altro. Prima di cominciare ognuno guarda quanto spazio c’è: così impari a decidere la grandezza di una forma.", "g": [["e", 256, 730, 100, 60], ["e", 486, 730, 85, 52], ["e", 676, 730, 70, 43], ["e", 826, 730, 55, 34], ["e", 936, 730, 40, 25], ["e", 1016, 730, 28, 18]]}
    ] },
  {"id": "d603", "f": "mano", "lv": 1, "ic": "📏", "n": "Le linee parallele", "tool": "pennarello", "col": "blu", "w": 8, "impara": "tracciare linee che restano alla stessa distanza", "passi": [
      {"t": "Linee orizzontali, una sotto l’altra, tutte alla stessa distanza. Lascia spento «Dritto»: qui si allena la mano. Guarda il punto dove vuoi arrivare, non la punta che disegna: la linea viene più dritta.", "g": [["l", 100, 80, 1100, 80], ["l", 100, 130, 1100, 130], ["l", 100, 180, 1100, 180], ["l", 100, 230, 1100, 230], ["l", 100, 280, 1100, 280], ["l", 100, 330, 1100, 330]]},
      {"t": "Ora le linee verticali, dall’alto in basso. Parti da un punto, guarda subito il punto d’arrivo e tira la linea in un gesto solo. Le linee parallele non si incontrano mai.", "g": [["l", 100, 430, 100, 850], ["l", 150, 430, 150, 850], ["l", 200, 430, 200, 850], ["l", 250, 430, 250, 850], ["l", 300, 430, 300, 850], ["l", 350, 430, 350, 850], ["l", 400, 430, 400, 850]]},
      {"t": "Per finire le linee oblique, tutte inclinate allo stesso modo. Tieni la stessa distanza tra una linea e l’altra. Se una esce storta, la prossima la rifai con calma.", "g": [["l", 650, 850, 800, 430], ["l", 710, 850, 860, 430], ["l", 770, 850, 920, 430], ["l", 830, 850, 980, 430], ["l", 890, 850, 1040, 430], ["l", 950, 850, 1100, 430]]}
    ] },
  {"id": "d604", "f": "mano", "lv": 1, "ic": "🔲", "n": "Il quadrato che diventa cerchio", "tool": "pennarello", "col": "blu", "w": 9, "impara": "passare dal quadrato al cerchio", "passi": [
      {"t": "Comincia con un quadrato: quattro lati uguali e quattro angoli. Disegnalo con calma. Nei prossimi passi gli angoli diventeranno sempre più rotondi.", "g": [["r", 60, 340, 220, 220]]},
      {"t": "Secondo quadrato, con gli angoli appena arrotondati. Gli angoli diventano curve piccole e i lati restano quasi dritti.", "g": [["p", "M380 340 L520 340 Q560 340 560 380 L560 520 Q560 560 520 560 L380 560 Q340 560 340 520 L340 380 Q340 340 380 340 Z"]]},
      {"t": "Terzo: gli angoli sono molto rotondi e i pezzi dritti sono ormai corti. La forma sta diventando un cerchio.", "g": [["p", "M705 340 L755 340 Q840 340 840 425 L840 475 Q840 560 755 560 L705 560 Q620 560 620 475 L620 425 Q620 340 705 340 Z"]]},
      {"t": "Infine un quadrato leggero con un cerchio dentro, che tocca i quattro lati. Il quadrato ti aiuta: dentro quei confini è più facile fare un cerchio tondo.", "g": [["r", 900, 340, 220, 220], ["c", 1010, 450, 110]]}
    ] },
  {"id": "d605", "f": "mano", "lv": 1, "ic": "🐰", "n": "Il coniglio", "tool": "matita", "col": "nero", "w": 6, "impara": "costruire un coniglio con ovali e cerchi", "passi": [
      {"t": "Il coniglio è fatto di forme semplici: un ovale grande per il corpo, un cerchio per la testa, due ovali lunghi per le orecchie. Prima il corpo e la testa: le forme grandi fissano le proporzioni.", "g": [["e", 600, 640, 185, 190], ["c", 600, 330, 120]]},
      {"t": "Aggiungi le orecchie: due ovali lunghi sopra la testa, che la toccano. Le orecchie lunghe sono la caratteristica che rende subito riconoscibile il coniglio.", "g": [["e", 545, 133, 42, 90], ["e", 655, 133, 42, 90]]},
      {"t": "Ora le forme medie: due ovali piatti per i piedi, in basso ai lati, e due ovali stretti per le zampe davanti, dentro il corpo. Così il coniglio sta seduto bene.", "g": [["e", 470, 831, 70, 28], ["e", 730, 831, 70, 28], ["e", 550, 735, 32, 62], ["e", 650, 735, 32, 62]]},
      {"t": "Per ultimi i dettagli: due occhi, un naso piccolo, la bocca (una lineetta e due curve), i baffi e l’ovale dentro le orecchie. I dettagli vanno alla fine, quando le forme grandi sono a posto.", "g": [["c", 555, 315, 13], ["c", 645, 315, 13], ["e", 600, 360, 16, 10], ["p", "M600 370 L600 385 Q580 402 562 390 M600 385 Q620 402 638 390"], ["l", 470, 360, 540, 370], ["l", 470, 397, 540, 385], ["l", 730, 360, 660, 370], ["l", 730, 397, 660, 385], ["e", 545, 145, 17, 50], ["e", 655, 145, 17, 50]]},
      {"t": "Ora colora: scegli il secchiello e tocca le zone. Il grigio chiaro va bene per il corpo, la testa e le orecchie. Le forme chiuse si riempiono senza uscire.", "g": [["dot", 600, 560, "#c8c8c8", "corpo"], ["dot", 600, 255, "#c8c8c8", "testa"], ["dot", 545, 70, "#c8c8c8", "orecchie"], ["dot", 655, 70, "#c8c8c8", ""]], "tool": "secchiello", "col": "g2"}
    ] },
  {"id": "d606", "f": "mano", "lv": 1, "ic": "🦉", "n": "Il gufo", "tool": "matita", "col": "nero", "w": 6, "impara": "costruire un gufo con un ovale e due cerchi", "passi": [
      {"t": "Il gufo è un ovale grande con due cerchi per gli occhi. Disegna prima l’ovale del corpo, poi i due cerchi grandi uno accanto all’altro, che si toccano al centro. Le forme grandi vengono per prime.", "g": [["e", 600, 487.5, 218.5, 313.5], ["c", 514.5, 373.5, 85.5], ["c", 685.5, 373.5, 85.5]]},
      {"t": "Aggiungi le forme medie: due ciuffi a triangolo sopra la testa, il becco (un triangolo piccolo sotto gli occhi) e le ali, due forme a foglia ai lati del corpo.", "g": [["p", "M438.5 278.5 L424.3 155 L524 194.9"], ["p", "M676 194.9 L775.8 155 L761.5 278.5"], ["p", "M580 447 L620 447 L600 505 Z"], ["p", "M424.3 468.5 Q376.8 582.5 467 706 Q486 582.5 424.3 468.5"], ["p", "M775.8 468.5 Q823.3 582.5 733 706 Q714 582.5 775.8 468.5"]]},
      {"t": "Ora i dettagli: una pupilla in ogni occhio, le piume della pancia con piccole curve, due zampette e un ramo dove si posa. Metti le pupille nello stesso punto dei due occhi: così lo sguardo è deciso.", "g": [["c", 514.5, 378.3, 33.3], ["c", 685.5, 378.3, 33.3], ["p", "M524 582.5 Q552.5 615.8 581 582.5 M619 582.5 Q647.5 615.8 676 582.5 M547.8 658.5 Q576.3 691.8 604.8 658.5 Q633.3 691.8 661.8 658.5"], ["e", 560, 811, 30, 15], ["e", 640, 811, 30, 15], ["r", 280, 826, 640, 26]]},
      {"t": "Colora il corpo e i ciuffi di marrone con il secchiello. Occhi e ali sono zone chiuse a parte: restano chiari. Se il colore esce, c’è un buco nel contorno da chiudere.", "g": [["dot", 600, 728, "#8b5a2b", "corpo"], ["dot", 465, 205, "#8b5a2b", "ciuffo"], ["dot", 735, 205, "#8b5a2b", "ciuffo"]], "tool": "secchiello", "col": "marrone"}
    ] },
  {"id": "d607", "f": "mano", "lv": 2, "ic": "🦋", "n": "La farfalla", "tool": "matita", "col": "nero", "w": 6, "impara": "disegnare una forma simmetrica con l’asse a metà", "passi": [
      {"t": "La farfalla è un ovale stretto per il corpo, un cerchio per la testa e quattro grandi forme tonde per le ali. Prima il corpo al centro: è l’asse, da cui le ali partono uguali a destra e a sinistra.", "g": [["e", 600, 470, 24, 160], ["c", 600, 280, 30]]},
      {"t": "Le ali di sopra sono grandi e arrotondate. Puoi accendere «Specchio»: ricalca solo l’ala di sinistra e quella di destra compare da sola, uguale e rovesciata, come piegando il foglio a metà.", "g": [["p", "M624 400 C720 200 920 120 1050 190 C1140 250 1060 400 960 430 C860 460 720 450 624 440"], ["p", "M576 400 C480 200 280 120 150 190 C60 250 140 400 240 430 C340 460 480 450 576 440"]]},
      {"t": "Ora le ali di sotto, più piccole, attaccate al corpo appena sotto quelle di sopra. Con «Specchio» acceso basta ricalcare di nuovo solo il lato sinistro.", "g": [["p", "M624 450 C760 450 900 480 930 580 C960 700 800 780 720 700 C660 640 630 560 624 530"], ["p", "M576 450 C440 450 300 480 270 580 C240 700 400 780 480 700 C540 640 570 560 576 530"]]},
      {"t": "Per finire le due antenne, con una pallina in cima, e un cerchio decorato su ogni ala. Con «Specchio» fai un lato solo; se è spento, metti le stesse cose dalle due parti.", "g": [["p", "M592 251 Q575 190 540 150"], ["p", "M608 251 Q625 190 660 150"], ["c", 534.5, 143.5, 8], ["c", 665.5, 143.5, 8], ["c", 900, 300, 55], ["c", 300, 300, 55], ["c", 810, 620, 38], ["c", 390, 620, 38]]},
      {"t": "Colora le ali di arancione con il secchiello. Il secchiello non usa lo Specchio: tocca tutte e quattro le ali, una alla volta. Lo stesso colore dalle due parti conserva la simmetria.", "g": [["dot", 790, 340, "#f28c1b", "ala"], ["dot", 410, 340, "#f28c1b", "ala"], ["dot", 720, 540, "#f28c1b", "ala"], ["dot", 480, 540, "#f28c1b", "ala"]], "tool": "secchiello", "col": "arancione"}
    ] },
  {"id": "d608", "f": "mano", "lv": 1, "ic": "🌸", "n": "Il fiore", "tool": "matita", "col": "nero", "w": 6, "impara": "costruire un fiore con cerchi tutti uguali", "passi": [
      {"t": "Il fiore è fatto di cerchi: uno al centro e sei cerchi uguali intorno, per i petali. Disegna prima quello centrale, poi i petali uno vicino all’altro. Ogni petalo tocca il centro: così il fiore resta ben ordinato.", "g": [["c", 600, 310, 60], ["c", 722, 310, 62], ["c", 661, 415.7, 62], ["c", 539, 415.7, 62], ["c", 478, 310, 62], ["c", 539, 204.3, 62], ["c", 661, 204.3, 62]]},
      {"t": "Aggiungi lo stelo, una linea dritta che parte da sotto i petali, e due foglie. Una foglia è una forma a goccia che parte dallo stelo, una da una parte e una dall’altra.", "g": [["l", 600, 425, 600, 850], ["p", "M600 730 Q470 610 380 670 Q480 780 600 730"], ["p", "M600 660 Q730 550 820 610 Q720 720 600 660"]]},
      {"t": "Ora i dettagli: tre cerchietti nel centro, una linea per il terreno e qualche filo d’erba. I dettagli piccoli vanno per ultimi, così non cambiano le proporzioni.", "g": [["c", 580, 300, 9], ["c", 620, 300, 9], ["c", 600, 335, 9], ["l", 300, 850, 900, 850], ["p", "M360 850 L350 805 M385 850 L395 810 M815 850 L805 805 M840 850 L850 810"]]},
      {"t": "Colora i petali di rosa con il secchiello. Ogni petalo è una zona chiusa: toccali tutti e sei, uno alla volta.", "g": [["dot", 722, 310, "#f4a6c1", "petalo"], ["dot", 661, 415.7, "#f4a6c1", ""], ["dot", 539, 415.7, "#f4a6c1", ""], ["dot", 478, 310, "#f4a6c1", ""], ["dot", 539, 204.3, "#f4a6c1", ""], ["dot", 661, 204.3, "#f4a6c1", ""]], "tool": "secchiello", "col": "rosa"},
      {"t": "Ora colora le due foglie di verde con il secchiello. Il centro del fiore puoi lasciarlo chiaro o farlo giallo, come preferisci.", "g": [["dot", 490, 700, "#2e9e44", "foglia"], ["dot", 720, 632, "#2e9e44", "foglia"]], "tool": "secchiello", "col": "verde"}
    ] },
  {"id": "d609", "f": "mano", "lv": 2, "ic": "🐢", "n": "La tartaruga", "tool": "matita", "col": "nero", "w": 6, "impara": "costruire una tartaruga con una mezza ellisse e cerchi", "passi": [
      {"t": "La tartaruga ha un guscio a cupola, come mezza ellisse, con una linea piatta sotto. Fallo grande: è la forma principale e tutto il resto si attacca al guscio. La testa e le zampe arrivano dopo.", "g": [["p", "M238.8 619 A360 312 0 0 1 958.8 619 Z"]]},
      {"t": "Ora le forme medie: la testa, rotonda, a destra; la coda a triangolo piccolo a sinistra; quattro zampe corte e tonde sotto il guscio. Tutte partono dal bordo del guscio.", "g": [["p", "M914.4 469 C958.8 427 1066.8 439 1076.4 511 C1083.6 577 1006.8 595 950.4 553"], ["p", "M238.8 585.4 Q184.8 595 148.8 633.4 Q200.4 640.6 238.8 619"], ["p", "M292.8 619 C280.8 697 388.8 697 382.8 619"], ["p", "M424.8 619 C415.2 691 514.8 691 508.8 619"], ["p", "M688.8 619 C679.2 691 778.8 691 772.8 619"], ["p", "M808.8 619 C799.2 697 904.8 697 898.8 619"]]},
      {"t": "Dividi il guscio in placche: un esagono grande al centro e sei linee che vanno dall’esagono fino al bordo del guscio. Così il guscio sembra fatto a pezzi, come quello vero.", "g": [["p", "M532.8 403 L664.8 403 L718.8 475 L664.8 547 L532.8 547 L478.8 475 Z"], ["l", 532.8, 403, 460.7, 330.9], ["l", 664.8, 403, 732.4, 329.3], ["l", 718.8, 475, 918.2, 475], ["l", 478.8, 475, 279.4, 475], ["l", 664.8, 547, 742.8, 619], ["l", 532.8, 547, 454.8, 619]]},
      {"t": "Aggiungi i dettagli sul viso: un occhio e un sorriso piccolo. Un dettaglio piccolo e preciso rende subito la testa viva.", "g": [["c", 1024.8, 495.4, 9.6], ["p", "M994.8 547 Q1028.4 565 1060.8 535"]]},
      {"t": "Colora il guscio di verde con il secchiello: tocca ogni placca, sono sette. Testa e zampe le colori nel prossimo passo.", "g": [["dot", 598.8, 475, "#2e9e44", "placca"], ["dot", 598.8, 367, "#2e9e44", "placca"], ["dot", 418.8, 415, "#2e9e44", "placca"], ["dot", 814.8, 415, "#2e9e44", "placca"], ["dot", 814.8, 559, "#2e9e44", "placca"], ["dot", 598.8, 589, "#2e9e44", "placca"], ["dot", 382.8, 559, "#2e9e44", "placca"]], "tool": "secchiello", "col": "verde"},
      {"t": "Per finire colora la testa e le quattro zampe di verde chiaro. Un colore più chiaro del guscio le distingue bene.", "g": [["dot", 985, 468, "#9bd770", "testa"], ["dot", 338.4, 649, "#9bd770", "zampa"], ["dot", 466.8, 649, "#9bd770", "zampa"], ["dot", 730.8, 649, "#9bd770", "zampa"], ["dot", 853.2, 649, "#9bd770", "zampa"]], "tool": "secchiello", "col": "verdechiaro"}
    ] },
  {"id": "d610", "f": "mano", "lv": 1, "ic": "⛵", "n": "La barca", "tool": "matita", "col": "nero", "w": 6, "impara": "costruire una barca a vela con triangoli e un trapezio", "passi": [
      {"t": "La barca a vela ha uno scafo largo sopra e stretto sotto, con il fondo arrotondato, e una linea dritta per l’albero. Disegna prima lo scafo e l’albero: sono le forme grandi che tengono tutto il resto.", "g": [["p", "M250 620 L950 620 Q880 780 760 780 L440 780 Q320 780 250 620 Z"], ["l", 600, 190, 600, 620]]},
      {"t": "Ora le vele, due triangoli che hanno un lato lungo sull’albero: uno grande a destra, uno più piccolo a sinistra. Tieni un po’ di spazio tra le vele e lo scafo.", "g": [["p", "M600 260 L600 590 L860 590 Z"], ["p", "M600 300 L600 590 L380 590 Z"]]},
      {"t": "Aggiungi i dettagli: una bandierina in cima all’albero, un oblò rotondo sullo scafo e le onde sotto la barca. Le onde mostrano che la barca sta sull’acqua.", "g": [["p", "M600 190 L680 215 L600 240 Z"], ["c", 600, 690, 28], ["p", "M120 805 Q160 777 200 805 Q240 833 280 805 Q320 777 360 805 Q400 833 440 805 Q480 777 520 805 Q560 833 600 805 Q640 777 680 805 Q720 833 760 805 Q800 777 840 805 Q880 833 920 805 Q960 777 1000 805 Q1040 833 1080 805"]]},
      {"t": "Colora lo scafo di marrone con il secchiello. Molte barche di legno sono marroni.", "g": [["dot", 420, 700, "#8b5a2b", "scafo"]], "tool": "secchiello", "col": "marrone"},
      {"t": "Colora le vele di giallo: puoi fare quella grande e quella piccola dello stesso colore, oppure di due colori diversi.", "g": [["dot", 690, 500, "#f6d000", "vela"], ["dot", 530, 500, "#f6d000", "vela"]], "tool": "secchiello", "col": "giallo"}
    ] },
  {"id": "d611", "f": "mano", "lv": 2, "ic": "🚀", "n": "Il razzo", "tool": "matita", "col": "nero", "w": 6, "impara": "costruire un razzo con rettangoli, un arco e triangoli", "passi": [
      {"t": "Il razzo è un rettangolo alto con una punta ad arco in cima, due alette e un cerchio per il finestrino. Prima il corpo: un rettangolo e l’arco sopra. Il corpo è la forma grande da cui tutto parte.", "g": [["r", 470, 360, 260, 300], ["p", "M470 360 Q470 200 600 100 Q730 200 730 360"]]},
      {"t": "Aggiungi le alette: due forme a trapezio ai lati, attaccate in basso. Quando sono uguali dalle due parti il razzo sta in equilibrio nel disegno. Sotto, un piccolo rettangolo per l’ugello.", "g": [["p", "M470 500 L360 650 L360 730 L470 660 Z"], ["p", "M730 500 L840 650 L840 730 L730 660 Z"], ["r", 520, 660, 160, 35]]},
      {"t": "Ora il finestrino, un cerchio in alto nel corpo, e una linea dritta per la fascia. Poi la fiamma sotto: una goccia a punta che parte dall’ugello, dove finisce il razzo.", "g": [["c", 600, 445, 55], ["l", 470, 570, 730, 570], ["p", "M530 695 Q540 790 600 860 Q660 790 670 695"]]},
      {"t": "Per finire alcune stelle: piccoli cerchi, o una croce di due linee, nel cielo intorno al razzo. Mettile a distanze diverse tra loro: il cielo sembra più vero.", "g": [["c", 200, 200, 8], ["c", 1000, 250, 8], ["c", 250, 500, 6], ["c", 950, 480, 6], ["c", 1050, 700, 8], ["c", 150, 780, 6]]},
      {"t": "Colora la punta e le alette di rosso con il secchiello. Il resto del razzo rimane chiaro, così si vede il contrasto.", "g": [["dot", 600, 250, "#d62828", "punta"], ["dot", 400, 660, "#d62828", "aletta"], ["dot", 800, 660, "#d62828", "aletta"]], "tool": "secchiello", "col": "rosso"},
      {"t": "Ora la fiamma, di arancione. Tocca dentro la goccia sotto il razzo.", "g": [["dot", 600, 780, "#f28c1b", "fiamma"]], "tool": "secchiello", "col": "arancione"}
    ] },
  {"id": "d612", "f": "mano", "lv": 2, "ic": "☕", "n": "La tazza", "tool": "matita", "col": "nero", "w": 6, "impara": "disegnare un oggetto con l’ovale dell’apertura", "passi": [
      {"t": "La tazza è un ovale per l’apertura, un corpo che scende ad arco e un manico. Comincia dall’ovale in alto: è il cerchio del bordo visto un po’ dall’alto, perciò appare schiacciato.", "g": [["e", 600, 380, 230, 70]]},
      {"t": "Aggiungi il corpo: dai due estremi dell’ovale scendono due linee curve che si uniscono con un fondo piatto. Cerca di fare i due lati uguali e guardali bene dopo averli disegnati.", "g": [["p", "M370 380 C375 570 400 750 520 780 L680 780 C800 750 825 570 830 380"]]},
      {"t": "Il manico è un anello sul lato destro: due curve, una grande fuori e una piccola dentro, che partono dal corpo e tornano al corpo. Così lo spessore resta uguale.", "g": [["p", "M825 440 C990 410 1000 650 788 668"], ["p", "M820 500 C920 490 925 600 806 612"]]},
      {"t": "Dettagli: un secondo ovale dentro il primo, per il bordo e il caffè, e due righe ondulate di vapore sopra. Il vapore sale più sottile e libero.", "g": [["e", 600, 390, 205, 52], ["p", "M540 290 Q510 250 540 210 Q570 170 540 130"], ["p", "M660 290 Q630 250 660 210 Q690 170 660 130"]]},
      {"t": "Colora il corpo della tazza e il manico di azzurro con il secchiello.", "g": [["dot", 600, 610, "#7cc4f2", "tazza"], ["dot", 921, 542, "#7cc4f2", "manico"]], "tool": "secchiello", "col": "azzurro"},
      {"t": "Ora il caffè, di marrone: tocca dentro l’ovale piccolo.", "g": [["dot", 600, 375, "#8b5a2b", "caffè"]], "tool": "secchiello", "col": "marrone"}
    ] }
];
/* idee per la tela libera */
const DIS_IDEE = ['un drago che vola sopra la città', 'la tua colazione preferita', 'un animale che non esiste, metà gatto e metà pesce', 'la vista dalla tua finestra', 'un albero nelle quattro stagioni', 'il tuo zaino e quello che c’è dentro', 'una casa sull’albero', 'un mostriciattolo simpatico', 'un paesaggio con un tramonto', 'il ritratto di qualcuno che ti vuole bene', 'una pianta del giardino, guardandola dal vero', 'una città nel futuro', 'il fondo del mare', 'la tua mano, guardandola mentre la disegni', 'tre frutti su un tavolo con le loro ombre'];
