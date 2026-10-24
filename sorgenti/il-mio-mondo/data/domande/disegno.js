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
    t: 'Il viso e il corpo hanno misure che si ripetono: gli occhi stanno a metà della testa, il gomito all’altezza della vita.' }
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
      { t: 'Colora il tuo drago con i colori che preferisci.', g: [['dot', 560, 580, '#2e9e44', 'drago']], tool: 'secchiello', col: 'verde' }
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
    ] }
];
/* idee per la tela libera */
const DIS_IDEE = ['il tuo drago che vola sopra la città', 'la tua colazione preferita', 'un animale che non esiste, metà gatto e metà pesce', 'la vista dalla tua finestra', 'un albero nelle quattro stagioni', 'il tuo zaino e quello che c’è dentro', 'una casa sull’albero', 'un mostriciattolo simpatico', 'un paesaggio con un tramonto', 'il ritratto di qualcuno che ti vuole bene', 'una pianta del giardino, guardandola dal vero', 'una città nel futuro', 'il fondo del mare', 'la tua mano, guardandola mentre la disegni', 'tre frutti su un tavolo con le loro ombre'];
