/* ================= 🖼️ DISEGNI DELLE SEZIONI =================
   Una striscia disegnata (SVG, 1100×150; 720×150 nelle finestre) sotto il titolo di ogni sezione:
   fa capire a colpo d'occhio di che cosa parla la sezione. Solo il senso della sezione, niente nozioni nuove.
   Chiavi: nome della pagina (go), «u-<materia>» per le materie (pagina materia), «m-<nome>» per le finestre.
   Un solo aggancio: dopo ogni go() e quando una pagina si ridisegna, la striscia va subito sotto l'h1. */
const SEZ_IMG = (() => {
  const T = (x, y, s, t, o) => { o = o || {}; return '<text x="' + x + '" y="' + y + '" font-size="' + s + '" text-anchor="' + (o.a || 'middle') + '"' + (o.b ? ' font-weight="' + o.b + '"' : '') + ' fill="' + (o.c || 'currentColor') + '"' + (o.op ? ' opacity="' + o.op + '"' : '') + '>' + t + '</text>'; };
  const E = (x, y, s, e) => '<text x="' + x + '" y="' + y + '" font-size="' + s + '" text-anchor="middle">' + e + '</text>';
  const R = (x, y, w, h, c, o) => { o = o || {}; return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (o.rx === undefined ? 14 : o.rx) + '" fill="' + c + '" fill-opacity="' + (o.f || .14) + '" stroke="' + c + '" stroke-opacity="' + (o.s || .7) + '" stroke-width="2"' + (o.d ? ' stroke-dasharray="7 5"' : '') + '/>'; };
  const S = (a, b, W) => '<svg viewBox="0 0 ' + (W || 1100) + ' 150" role="img" aria-label="' + a + '">' + b + '</svg>';
  const H = (t, W, x) => T(x || (W || 1100) / 2, 22, 16, t, { b: 800 });
  const PAL = ['#e85d75', '#f59e0b', '#16a34a', '#2563eb', '#8b5cf6', '#0d9488', '#db2777', '#ea580c'];
  const col = (it, i) => it[3] || PAL[i % PAL.length];
  /* K: riquadri in fila (emoji, nome, riga piccola), con un grande emoji a sinistra se serve */
  const K = (a, title, items, o) => {
    o = o || {}; const W = o.W || 1100, x0 = o.big ? 150 : 20, gap = o.arrows ? 30 : 14, n = items.length, w = (W - 20 - x0 - gap * (n - 1)) / n;
    let b = H(title, W, o.big ? (x0 + W - 20) / 2 : 0);
    if (o.big) b += E(76, 100, 60, o.big[0]) + T(76, 140, 14, o.big[1], { b: 800 });
    items.forEach((it, i) => { const x = x0 + i * (w + gap), c = col(it, i);
      b += R(x.toFixed(1), 36, w.toFixed(1), 106, c) + E((x + w / 2).toFixed(1), 76, 30, it[0]) + T((x + w / 2).toFixed(1), 106, 15, it[1], { b: 800 }) + (it[2] ? T((x + w / 2).toFixed(1), 127, 14, it[2], { op: '.85' }) : '');
      if (o.arrows && i < n - 1) b += T((x + w + gap / 2).toFixed(1), 96, 24, '›', { b: 800, op: '.6' }); });
    return S(a, (o.pre || '') + b + (o.post || ''), W);
  };
  /* P: un cammino a tappe (emoji sopra, pallino, nome e riga piccola sotto) */
  const P = (a, title, steps, o) => {
    o = o || {}; const W = o.W || 1100, n = steps.length, x0 = o.x0 || 90, x1 = W - (o.x1 || 90), y = 74, c0 = o.c || '#8b5cf6';
    const xs = steps.map((_, i) => x0 + (n === 1 ? 0 : i * (x1 - x0) / (n - 1)));
    let b = H(title, W) + '<path d="M' + (x0 - 50) + ',' + y + ' C' + (W * .3) + ',' + (y - 14) + ' ' + (W * .6) + ',' + (y + 14) + ' ' + (x1 + 50) + ',' + y + '" stroke="' + c0 + '" stroke-width="22" stroke-linecap="round" fill="none" opacity=".18"/>' +
      '<path d="M' + (x0 - 50) + ',' + y + ' C' + (W * .3) + ',' + (y - 14) + ' ' + (W * .6) + ',' + (y + 14) + ' ' + (x1 + 50) + ',' + y + '" stroke="' + c0 + '" stroke-width="2.5" stroke-dasharray="9 7" fill="none" opacity=".7"/>';
    steps.forEach((s, i) => { const x = xs[i].toFixed(1), c = col(s, i);
      b += '<circle cx="' + x + '" cy="' + y + '" r="23" fill="' + c + '" fill-opacity=".25" stroke="' + c + '" stroke-width="2.5"/>' + E(x, y + 10, 27, s[0]) + T(x, y + 42, 15, s[1], { b: 800 }) + (s[2] ? T(x, y + 62, 14, s[2], { op: '.85' }) : ''); });
    return S(a, (o.pre || '') + b + (o.post || ''), W);
  };
  /* B: bolle rotonde con l'emoji dentro e il nome sotto */
  const B = (a, title, items, o) => {
    o = o || {}; const W = o.W || 1100, n = items.length, x0 = o.x0 || 70, x1 = W - (o.x1 || 70), r = o.r || 34;
    let b = H(title, W);
    items.forEach((it, i) => { const x = (x0 + (n === 1 ? 0 : i * (x1 - x0) / (n - 1))).toFixed(1), c = col(it, i);
      b += '<circle cx="' + x + '" cy="78" r="' + r + '" fill="' + c + '" fill-opacity=".2" stroke="' + c + '" stroke-opacity=".75" stroke-width="2.5"/>' + E(x, 89, 30, it[0]) + T(x, 133, 15, it[1], { b: 800 }) + (it[2] ? T(x, 149, 13.5, it[2], { op: '.85' }) : ''); });
    return S(a, (o.pre || '') + b + (o.post || ''), W);
  };
  /* G: gradini che salgono */
  const G = (a, title, steps, o) => {
    o = o || {}; const W = o.W || 1100, n = steps.length, x0 = o.x0 || 30, w = o.w || 200, dh = n > 1 ? 48 / (n - 1) : 0;
    let b = T(x0, 22, 16, title, { a: 'start', b: 800 });
    steps.forEach((s, i) => { const x = x0 + i * w, y = Math.round(56 + (n - 1 - i) * dh), c = col(s, i);
      b += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + (150 - y) + '" fill="' + c + '" fill-opacity="' + (.12 + i * .06).toFixed(2) + '" stroke="' + c + '" stroke-opacity=".6" stroke-width="2"/>' + E(x + w / 2, y - 6, 26, s[0]) + T(x + w / 2, y + 22, 15, s[1], { b: 800 }) + (s[2] ? T(x + w / 2, y + 41, 14, s[2], { op: '.85' }) : ''); });
    return S(a, (o.pre || '') + b + (o.post || ''), W);
  };
  const waves = (y, c) => '<path d="M0,' + y + ' Q55,' + (y - 12) + ' 110,' + y + ' T220,' + y + ' T330,' + y + ' T440,' + y + ' T550,' + y + ' T660,' + y + ' T770,' + y + ' T880,' + y + ' T990,' + y + ' T1100,' + y + ' V150 H0Z" fill="' + c + '" opacity=".18"/>';
  const blocks = (x, y) => [[0, 40, '#ef4444'], [40, 40, '#3b82f6'], [20, 0, '#f59e0b'], [80, 40, '#22c55e']].map(([dx, dy, c]) => '<rect x="' + (x + dx) + '" y="' + (y + dy) + '" width="38" height="38" rx="5" fill="' + c + '" fill-opacity=".55" stroke="' + c + '" stroke-width="2"/>').join('');

  return {
    /* ---------- 🏫 La mia scuola: le materie ---------- */
    'u-mate': K('Matematica: numeri, misure, figure, problemi e dati, un passo alla volta', 'la matematica è un allenamento: si impara un passo alla volta', [['🔢', 'i numeri', 'contare e calcolare'], ['📏', 'le misure', 'lungo, pesante, quanto'], ['📐', 'le figure', 'forme e spazio'], ['🧩', 'i problemi', 'ragionare con calma'], ['📊', 'i dati', 'tabelle e grafici']], { big: ['🧠', 'ci penso io'] }),
    'u-ita': K('Italiano: leggere, scrivere, le regole delle parole e raccontare', 'le parole sono attrezzi: per leggere, scrivere e raccontare', [['📖', 'leggere', 'storie e testi'], ['✏️', 'scrivere', 'pensieri e racconti'], ['🔤', 'le regole', 'parole e frasi giuste'], ['💬', 'parlare', 'raccontare e spiegare'], ['📜', 'le poesie', 'suoni e immagini']], { big: ['📚', 'la mia lingua'] }),
    'u-eng': B('Inglese: ascoltare, ripetere e parlare, con le parole di tutti i giorni', 'l’inglese si impara a voce: ascolto, ripeto, parlo', [['👂', 'ascolto'], ['🗣️', 'ripeto'], ['👋', 'saluti'], ['🔢', 'numeri'], ['🎨', 'colori'], ['🐶', 'animali'], ['👨‍👩‍👧', 'famiglia']], { x0: 300, x1: 60, r: 30,
      pre: '<rect x="20" y="38" width="210" height="62" rx="20" fill="#2563eb" fill-opacity=".14" stroke="#2563eb" stroke-opacity=".7" stroke-width="2"/><polygon points="60,99 88,99 62,120" fill="#2563eb" fill-opacity=".35"/>' + T(125, 78, 22, 'Hello!', { b: 900 }) + E(44, 134, 24, '🇬🇧') + E(80, 134, 24, '🇮🇹') + T(160, 131, 14, 'due lingue', { b: 800 }) }),
    'u-storia': P('Storia: un viaggio nel tempo, dalle fonti alla preistoria, alle prime civiltà, ai Greci e ai Romani', 'un viaggio nel tempo: le fonti raccontano il passato', [['🔍', 'le fonti', 'indizi del passato', '#64748b'], ['🦴', 'la preistoria', 'i primi esseri umani', '#a16207'], ['🏺', 'le civiltà', 'fiumi e città', '#ea580c'], ['🏛️', 'i Greci', 'polis e pensatori', '#2563eb'], ['🛡️', 'i Romani', 'strade e leggi', '#dc2626'], ['⏳', 'e poi…', 'fino a oggi', '#8b5cf6']], { c: '#a16207' }),
    'u-geo': K('Geografia: orientarsi, montagne, acque, città e regioni', 'la geografia guarda il mondo dall’alto: dove sono le cose?', [['🧭', 'orientarsi', 'carte e punti cardinali', '#0d9488'], ['🏔️', 'il rilievo', 'monti e colline', '#a16207'], ['🌊', 'le acque', 'mari, fiumi e laghi', '#2563eb'], ['🏙️', 'le regioni', 'città e capoluoghi', '#ea580c'], ['🌍', 'il mondo', 'continenti e Paesi', '#16a34a']], { big: ['🗺️', 'una carta'] }),
    'u-sci-corpo': B('Il corpo umano: tante parti che lavorano in squadra', 'il corpo è una squadra: ogni parte ha il suo lavoro', [['🦴', 'le ossa'], ['💪', 'i muscoli'], ['🫀', 'il cuore'], ['🫁', 'il respiro'], ['🍎', 'la digestione'], ['🧠', 'il cervello'], ['👀', 'i sensi']], { x0: 90, x1: 90 }),
    'u-sci-spazio': (() => { const it = [['☀️', 'il Sole', '#f59e0b'], ['🌍', 'la Terra', '#2563eb'], ['🌙', 'la Luna', '#64748b'], ['🪐', 'i pianeti', '#8b5cf6'], ['✨', 'le stelle', '#db2777'], ['🔭', 'osservare', '#0d9488']];
      return S('Il sistema solare: il Sole, la Terra, la Luna, i pianeti e le stelle da osservare', '<circle cx="-40" cy="96" r="120" fill="#f59e0b" opacity=".22"/>' + [150, 195].map(r => '<circle cx="-40" cy="96" r="' + r + '" fill="none" stroke="currentColor" stroke-opacity=".22" stroke-width="2" stroke-dasharray="5 6"/>').join('') + E(36, 110, 46, '☀️') +
        H('guardare il cielo: che cosa c’è lassù?', 1100, 640) + it.map((x, i) => { const cx = 250 + i * 140; return '<circle cx="' + cx + '" cy="78" r="30" fill="' + x[2] + '" fill-opacity=".2" stroke="' + x[2] + '" stroke-opacity=".75" stroke-width="2.5"/>' + E(cx, 89, 28, x[0]) + T(cx, 133, 15, x[1], { b: 800 }); }).join('') + ['⭐', '✨', '⭐'].map((s, i) => E(1030 + i * 28, 50 + (i % 2) * 50, 16, s)).join('')); })(),
    'u-civica': B('Cittadinanza attiva: rispetto, regole, diritti, Comune, Italia ed Europa', 'vivere insieme: rispetto, regole e diritti per tutti', [['🤝', 'rispetto'], ['📜', 'le regole'], ['🧒', 'i diritti'], ['🏛️', 'il Comune'], ['🇮🇹', 'l’Italia'], ['🇪🇺', 'l’Europa'], ['🌍', 'il mondo']], { x0: 90, x1: 90 }),
    'u-tecno': K('Tecnologia: computer, coding, internet con prudenza, robot ed elettricità', 'capire come funzionano le macchine e usarle con giudizio', [['💻', 'il computer', 'come è fatto'], ['🧩', 'il coding', 'istruzioni in fila'], ['🌐', 'internet', 'con prudenza'], ['🤖', 'i robot', 'macchine che aiutano'], ['💡', 'l’elettricità', 'circuiti e energia']], { big: ['⚙️', 'come funziona?'] }),
    'u-media': G('Verso la prima media: una scala di gradini, dalla quinta alla prima media', 'un gradino alla volta verso la scuola media', [['🎒', 'la 5ª', 'quello che sai già', '#16a34a'], ['🔢', 'numeri nuovi', 'per allenarsi', '#2563eb'], ['📐', 'figure e misure', 'un po’ più in là', '#8b5cf6'], ['🧠', 'il metodo', 'studiare da grandi', '#ea580c'], ['🏫', 'la 1ª media', 'pronta a partire', '#db2777']], { w: 208 }),
    'u-arte': K('Arte: guardare e creare con colori, linee, forme e tante tecniche', 'guardare e creare: ogni artista ha i suoi strumenti', [['🎨', 'i colori', 'mescolare e scegliere'], ['🖼️', 'i quadri', 'ritratti e paesaggi'], ['✏️', 'linee e forme', 'luce e ombra'], ['🗿', 'la scultura', 'creta e ceramica'], ['📷', 'foto e fumetti', 'immagini che raccontano']], { big: ['🖌️', 'creare'] }),
    'u-musica': K('Musica: leggere la musica, il ritmo, il suono, gli strumenti e la voce', 'la musica si ascolta, si legge e si suona', [['🎼', 'leggere', 'le note sul rigo'], ['🥁', 'il ritmo', 'veloce, lento, forte'], ['🔊', 'il suono', 'come nasce'], ['🎻', 'gli strumenti', 'e l’orchestra'], ['🎤', 'la voce', 'cantare insieme']], { big: ['🎶', 'ascoltare'] }),
    'u-motoria': K('Motoria: movimento, coordinazione, gioco di squadra e lealtà', 'muoversi insieme: coordinazione, squadra e lealtà', [['🤸‍♀️', 'il movimento', 'equilibrio e agilità'], ['🏐', 'la pallavolo', 'bagher e palleggio'], ['🏀', 'il basket', 'passare e tirare'], ['🤝', 'la squadra', 'giocare lealmente'], ['💧', 'la pausa', 'acqua e respiro']], { big: ['🏅', 'in palestra'] }),
    'u-religione': B('Religione: le feste e le grandi religioni del mondo, conosciute con rispetto', 'conoscere le feste e le religioni del mondo, con rispetto', [['🕊️', 'la pace'], ['🎄', 'il Natale'], ['🌍', 'tante religioni'], ['🕯️', 'feste e luci'], ['🤝', 'il rispetto'], ['💬', 'ascoltare']], { x0: 110, x1: 110 }),
    /* ---------- 🌟 Fuori scuola ---------- */
    'u-sp-aerea': K('Ginnastica aerea: attrezzi in alto, forza, flessibilità e sicurezza', 'in alto con forza, equilibrio e sicurezza', [['🎪', 'gli attrezzi', 'tessuti, cerchio, trapezio'], ['🛡️', 'la sicurezza', 'sempre con chi insegna'], ['💪', 'la forza', 'braccia e pancia'], ['🧘‍♀️', 'la flessibilità', 'allungarsi piano'], ['✨', 'le figure', 'una alla volta']], { big: ['🤸‍♀️', 'in volo'] }),
    'u-sp-patt': P('Pattinaggio: un passo dopo l’altro sul ghiaccio, dai primi passi alle figure', 'sul ghiaccio: un passo dopo l’altro', [['⛸️', 'i pattini', 'lame e lacci', '#0ea5e9'], ['👣', 'i primi passi', 'equilibrio', '#2563eb'], ['〰️', 'le curve', 'i fili della lama', '#0d9488'], ['🌀', 'le trottole', 'girare su sé', '#8b5cf6'], ['✨', 'i salti', 'con calma', '#db2777']], { c: '#0ea5e9', pre: '<ellipse cx="550" cy="108" rx="560" ry="46" fill="#7dd3fc" opacity=".2"/>' }),
    'u-sp-nuoto': B('Nuoto: galleggiare, respirare e i quattro stili', 'in acqua: galleggiare, respirare, nuotare', [['🛟', 'galleggiare'], ['🫧', 'respirare'], ['🏊‍♀️', 'lo stile libero'], ['🔙', 'il dorso'], ['🐸', 'la rana'], ['🐬', 'il delfino']], { x0: 110, x1: 110, pre: waves(110, '#0ea5e9') }),
    'u-sp-corpo': K('Corpo in movimento: forza, resistenza, agilità, acqua e riposo', 'muoversi fa bene: allenamento, acqua e riposo', [['💪', 'la forza', 'muscoli e ossa'], ['🏃‍♀️', 'il fiato', 'il cuore lavora'], ['🤸‍♀️', 'l’agilità', 'equilibrio e salti'], ['💧', 'bere', 'prima e dopo'], ['😴', 'riposare', 'sonno e pause']], { big: ['❤️', 'sto bene'] }),
    'u-roblox': K('Giochi a blocchi online: costruire, giocare, restare sicuri e rispettosi', 'giochi a blocchi: costruire, giocare e restare al sicuro', [['🧱', 'costruire', 'mondi a blocchi'], ['🎮', 'giocare', 'tanti tipi di gioco'], ['🔒', 'la sicurezza', 'i miei dati restano miei'], ['🤝', 'il rispetto', 'gentili con tutti'], ['🙋', 'gli acquisti', 'prima chiedo a un adulto']], { big: ['', ''], pre: blocks(18, 50) }),
    'u-soldi': K('Soldi e risparmio: monete, banconote, risparmio, spesa e sconti', 'i soldi si contano, si risparmiano e si spendono con giudizio', [['🪙', 'le monete', 'euro e centesimi'], ['💶', 'le banconote', 'vere e false'], ['🐷', 'risparmiare', 'poco alla volta'], ['🛒', 'la spesa', 'pagare e il resto'], ['🏷️', 'gli sconti', 'leggere i cartellini']], { big: ['👛', 'il mio borsellino'] }),
    'u-lavo': B('Perché mi lavo: mani, denti, doccia, capelli, piscina e microbi', 'puliti per stare bene: piccoli gesti ogni giorno', [['🦠', 'i microbi'], ['🧼', 'le mani'], ['🪥', 'i denti'], ['🚿', 'la doccia'], ['💇‍♀️', 'i capelli'], ['🏊‍♀️', 'la piscina']], { x0: 110, x1: 110, pre: '<circle cx="1040" cy="40" r="10" fill="#7dd3fc" opacity=".5"/><circle cx="1066" cy="62" r="6" fill="#7dd3fc" opacity=".5"/><circle cx="40" cy="46" r="8" fill="#7dd3fc" opacity=".5"/>' }),
    'u-vesto': K('Come mi vesto: vestiti giusti per il tempo, il sole, lo sport, con tessuti ed etichette', 'vestirsi giusti per il tempo e per quello che fai', [['🧣', 'a strati', 'quando fa freddo', '#2563eb'], ['🧢', 'il sole', 'cappello e crema', '#f59e0b'], ['👟', 'lo sport', 'comodi e sicuri', '#16a34a'], ['🧵', 'i tessuti', 'di che cosa sono', '#8b5cf6'], ['🏷️', 'le etichette', 'come si lavano', '#db2777'], ['♻️', 'scegliere bene', 'per il pianeta', '#0d9488']]),
    /* ---------- 🎨 Fare e scoprire e altre pagine ---------- */
    disegno: P('Disegno: dalla tela libera alle tappe, fino al mio museo', 'disegnare: libera, poi un passo alla volta, fino al mio museo', [['🖌️', 'la tela libera', 'disegno quello che voglio', '#db2777'], ['✏️', 'le basi', 'linee e forme', '#2563eb'], ['🎨', 'i colori', 'matite e acquerello', '#f59e0b'], ['🪜', 'le tappe', 'una alla volta', '#16a34a'], ['🖼️', 'il mio museo', 'i miei disegni', '#8b5cf6']], { c: '#db2777' }),
    mappe: (() => { const sat = [[230, 52], [230, 118], [870, 52], [870, 118]];
      return S('Una mappa concettuale: un’idea al centro, le altre intorno, collegate da frecce con le parole', H('un’idea al centro, le altre intorno, unite da frecce che parlano') +
        sat.map(([x, y], i) => { const l = x < 550, x1 = l ? 452 : 648, y1 = y < 90 ? 80 : 100, x2 = l ? x + 85 : x - 85; return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y + '" stroke="' + PAL[i + 2] + '" stroke-width="2.5" stroke-opacity=".75"/><circle cx="' + x2 + '" cy="' + y + '" r="4" fill="' + PAL[i + 2] + '"/>'; }).join('') +
        '<rect x="450" y="62" width="200" height="56" rx="28" fill="#8b5cf6" fill-opacity=".28" stroke="#8b5cf6" stroke-width="2.5"/>' + E(488, 100, 26, '💡') + T(574, 97, 16, 'l’idea', { b: 900 }) +
        sat.map(([x, y], i) => R(x - 85, y - 20, 170, 40, PAL[i + 2], { rx: 20, f: .2 }) + T(x, y + 6, 15, 'un’altra idea', { b: 800 })).join('') +
        T(372, 58, 14, 'perché', { op: '.9', b: 700 }) + T(384, 132, 14, 'serve a', { op: '.9', b: 700 }) + T(728, 58, 14, 'come', { op: '.9', b: 700 }) + T(716, 132, 14, 'è fatta di', { op: '.9', b: 700 }) +
        E(60, 104, 40, '🗺️') + T(60, 138, 14, 'la mia mappa', { b: 800 }) + E(1040, 104, 40, '✍️') + T(1040, 138, 14, 'la creo io', { b: 800 })); })(),
    giochi: K('La palestra del cervello: giochi brevi per memoria, attenzione e velocità', 'giochi brevi per allenare il cervello: alla fine, una barzelletta!', [['🧠', 'la memoria', 'ricordare'], ['🎯', 'l’attenzione', 'concentrarsi'], ['⚡', 'la velocità', 'pronti, via!'], ['🧩', 'la logica', 'trovare la strada'], ['😂', 'la barzelletta', 'il premio finale']], { big: ['🏋️‍♀️', 'la palestra'], arrows: false }),
    diario: (() => { const d = [['lun', '😊'], ['mar', '😐'], ['mer', '🤩'], ['gio', '😴'], ['ven', '😊'], ['sab', '🏖️'], ['dom', '🌈']];
      return S('Il diario: il calendario della scuola, le vacanze e le emozioni giorno per giorno', H('il calendario dei giorni e, ogni giorno, come mi sento', 1100, 560) +
        E(62, 98, 54, '📓') + T(62, 138, 14, 'il mio diario', { b: 800 }) +
        d.map(([g, e], i) => { const x = 140 + i * 116; return R(x, 38, 104, 104, i > 4 ? '#f59e0b' : '#2563eb', { f: i > 4 ? .18 : .1 }) + T(x + 52, 62, 15, g, { b: 800 }) + E(x + 52, 112, 36, e); }).join('') +
        R(970, 38, 112, 104, '#db2777', { f: .16 }) + E(1026, 84, 30, '💬') + T(1026, 112, 15, 'come mi', { b: 800 }) + T(1026, 130, 15, 'sento?', { b: 800 })); })(),
    mate: G('Matematica da campionessa: ogni esercizio è un gradino, anche quando si sbaglia', 'ogni esercizio è un gradino, anche quando sbagli', [['✏️', 'provo', 'un esercizio', '#2563eb'], ['🤔', 'sbaglio?', 'va bene così', '#f59e0b'], ['💡', 'capisco', 'il perché', '#16a34a'], ['💪', 'riprovo', 'più forte', '#8b5cf6'], ['🏆', 'campionessa', 'un passo alla volta', '#db2777']], { w: 208 }),
    scienze: P('Il laboratorio: fare domande, osservare, provare e capire', 'fare domande è da scienziate: chi chiede «perché?» impara il doppio', [['❓', 'mi chiedo', 'perché?', '#f59e0b'], ['👀', 'osservo', 'guardo bene', '#2563eb'], ['🧪', 'provo', 'un esperimento', '#16a34a'], ['📝', 'annoto', 'che cosa succede', '#8b5cf6'], ['💡', 'capisco', 'e ne so di più', '#db2777']], { c: '#16a34a' }),
    scopri: B('Scopri il mondo: tante materie, tante curiosità da esplorare', 'esploratrice: tante materie, tante curiosità', [['🏛️', 'storia'], ['🗺️', 'geografia'], ['📖', 'italiano'], ['🎤', 'inglese'], ['🎨', 'arte'], ['🎼', 'musica'], ['🤝', 'civica'], ['🤖', 'tecnologia']], { x0: 180, x1: 60, r: 30, pre: E(66, 104, 52, '🧭') + T(66, 140, 14, 'si parte!', { b: 800 }) }),
    teatro: S('Il teatro: un palco con le tende, la mia parte da provare a voce e i segreti del palco',
      '<path d="M0,0 H170 Q120,70 150,150 H0Z" fill="#dc2626" opacity=".45"/><path d="M1100,0 H930 Q980,70 950,150 H1100Z" fill="#dc2626" opacity=".45"/><rect x="0" y="0" width="1100" height="6" fill="#dc2626" opacity=".55"/><ellipse cx="550" cy="150" rx="420" ry="26" fill="#f59e0b" opacity=".22"/>' +
      H('la mia parte e i segreti del palco') + [['📜', 'la mia parte', 'il copione'], ['🗣️', 'provare a voce', 'una battuta alla volta'], ['🎭', 'le emozioni', 'farle vedere'], ['🌟', 'in scena', 'con calma e coraggio']].map((x, i) => { const cx = 295 + i * 170; return E(cx, 82, 36, x[0]) + T(cx, 112, 15, x[1], { b: 800 }) + T(cx, 131, 14, x[2], { op: '.85' }); }).join('')),
    sport: P('Pausa movimento: si studia, ci si muove, si beve e si torna concentrate', 'tra un esercizio e l’altro: una pausa per muoversi', [['📚', 'studio', 'un pezzo alla volta', '#2563eb'], ['⏰', 'è ora!', 'la pausa', '#f59e0b'], ['🤸‍♀️', 'mi muovo', 'qualche minuto', '#16a34a'], ['💧', 'bevo', 'un po’ d’acqua', '#0ea5e9'], ['🎯', 'riparto', 'più concentrata', '#8b5cf6']], { c: '#16a34a' }),
    routine: P('Le routine: le tappe della giornata, dal mattino alla sera, con una spunta quando sono fatte', 'le tappe della giornata: tocca ✅ quando l’hai fatta', [['🌅', 'il mattino', 'pronta per uscire', '#f59e0b'], ['🎒', 'lo zaino', 'tutto al suo posto', '#ea580c'], ['📚', 'i compiti', 'con le pause', '#2563eb'], ['🛁', 'la sera', 'lavarsi e preparare', '#8b5cf6'], ['🌙', 'la nanna', 'riposare bene', '#4338ca']], { c: '#f59e0b' }),
    metodo: K('Il mio metodo: i trucchi per far restare le cose in testa', 'i trucchi per far restare le cose in testa', [['🔁', 'ripassare', 'un po’ ogni tanto'], ['🙈', 'mettermi alla prova', 'senza guardare'], ['🗣️', 'spiegare', 'come una maestra'], ['🖼️', 'immaginare', 'una scena in testa'], ['😴', 'riposare', 'il sonno aiuta']], { big: ['🧠', 'il mio cervello'] }),
    io: B('Il mio spazio: aspetto, negozio, album, tesori, progressi e impostazioni', 'il mio spazio: chi sono, che cosa ho raccolto, come sto andando', [['✨', 'il mio aspetto'], ['🛍️', 'il negozio'], ['📒', 'l’album'], ['🔍', 'i tesori'], ['📊', 'i progressi'], ['⚙️', 'le impostazioni']], { x0: 110, x1: 110 }),
    classe: K('La mia classe: progetti, uscite e date dell’anno, che restano solo su questo iPad', 'la mia classe: progetti, uscite e date dell’anno', [['📁', 'i progetti', 'che cosa facciamo'], ['🚌', 'le uscite', 'dove andiamo'], ['📌', 'le date', 'quando succede'], ['🔒', 'solo qui', 'restano su questo iPad']], { big: ['🗓️', 'l’anno'] }),
    serie: (() => { const f = [['🎬', 'guardo', 'il cartone'], ['💡', 'scopro', 'le pillole'], ['🏆', 'provo', 'la sfida'], ['⏭️', 'continuo', 'l’episodio dopo']];
      return S('La serie di Storia: episodi in fila come una pellicola, si guarda, si scopre, si prova', H('la Storia a episodi: guardo, scopro, provo') + '<rect x="30" y="34" width="1040" height="112" rx="10" fill="#1e293b" fill-opacity=".22" stroke="currentColor" stroke-opacity=".35" stroke-width="2"/>' +
        Array.from({ length: 26 }, (_, i) => '<rect x="' + (44 + i * 40) + '" y="40" width="22" height="10" rx="3" fill="currentColor" opacity=".3"/><rect x="' + (44 + i * 40) + '" y="130" width="22" height="10" rx="3" fill="currentColor" opacity=".3"/>').join('') +
        f.map((x, i) => { const cx = 160 + i * 260; return R(cx - 115, 56, 230, 68, PAL[i + 3], { rx: 8, f: .22 }) + E(cx - 78, 101, 30, x[0]) + T(cx + 20, 86, 15, x[1], { b: 800 }) + T(cx + 20, 108, 14, x[2]); }).join('')); })(),
    /* ---------- finestre (720 di larghezza) ---------- */
    'm-vesto2': S('Come mi vesto: la ruota dei colori, il look, i miei colori e la taglia giusta', H('colori che stanno bene insieme e la taglia giusta', 720) +
      ['#ef4444', '#f97316', '#facc15', '#22c55e', '#3b82f6', '#8b5cf6'].map((c, i) => { const a = i * Math.PI / 3; return '<circle cx="' + (66 + 34 * Math.cos(a)).toFixed(1) + '" cy="' + (90 + 34 * Math.sin(a)).toFixed(1) + '" r="16" fill="' + c + '" fill-opacity=".7"/>'; }).join('') +
      [['👗', 'il look'], ['❤️', 'i miei colori'], ['📏', 'la mia taglia'], ['🌦️', 'il meteo']].map((x, i) => { const cx = 205 + i * 140; return R(cx - 62, 38, 124, 104, PAL[i], {}) + E(cx, 80, 30, x[0]) + T(cx, 116, 15, x[1], { b: 800 }); }).join(''), 720),
    'm-trucco': P('Come mi trucco: prima la pelle, poi la sicurezza, poi il gioco, sempre con un adulto', 'prima la pelle, poi il gioco: sempre con un adulto', [['🧴', 'la pelle', '', '#0d9488'], ['🔍', 'la sicurezza', '', '#2563eb'], ['🎨', 'il gioco', '', '#db2777'], ['💖', 'bella così', '', '#e85d75']], { W: 720, x0: 80, x1: 80, c: '#db2777', post: '<rect x="160" y="128" width="400" height="20" rx="10" fill="#f59e0b" fill-opacity=".18"/>' + T(360, 143, 13.5, '👩 con un adulto accanto, a ogni tappa', { b: 800 }) }),
    'm-vita': K('Io e il mio corpo: buone abitudini per vestirsi, lavarsi le mani e i denti', 'le buone abitudini e il loro perché', [['🌦️', 'il meteo', 'che cosa metto'], ['🧼', 'le mani', 'pulite bene'], ['🪥', 'i denti', 'ogni giorno'], ['📚', 'le lezioni', 'il perché']], { W: 720 }),
    'm-shop': P('Il negozio: le gemme si guadagnano imparando, si mettono nel salvadanaio o si spendono', 'le gemme si guadagnano imparando', [['📚', 'imparo', '', '#2563eb'], ['💎', 'le gemme', '', '#0ea5e9'], ['🐷', 'risparmio', '', '#db2777'], ['🛍️', 'scelgo', '', '#8b5cf6']], { W: 720, x0: 80, x1: 80, c: '#0ea5e9' })
  };
})();

(function sezImgHook() {
  const keyOf = id => id === 'materia' ? 'u-' + ((typeof pathSel !== 'undefined' && pathSel) || store.get('path-sel', '')) : id;
  const put = (sec, k) => {
    if (!sec || sec.hidden) return;
    const old = sec.querySelector('.sez-img');
    if (old && old.dataset.k === k && old.isConnected) return;
    const svg = SEZ_IMG[k], h = sec.querySelector('h1');
    if (old && (!svg || old.dataset.k !== k)) old.remove();
    if (!svg || !h) return;
    const t = h.parentElement === sec ? h : (h.closest('#' + sec.id + ' > *') || h);
    t.insertAdjacentHTML('afterend', '<div class="sez-img" data-k="' + k + '">' + svg + '</div>');
  };
  const fill = () => document.querySelectorAll('[data-page]').forEach(s => { if (!s.hidden) put(s, keyOf(s.id.slice(2))); });
  const orig = go;
  go = function (id) { orig.apply(this, arguments); try { put($('p-' + id), keyOf(id)); } catch (e) {} };
  /* quando una pagina si ridisegna da sola (per esempio Mappa/Elenco di una materia) */
  try { const mo = new MutationObserver(() => { try { fill(); } catch (e) {} }); document.querySelectorAll('[data-page]').forEach(s => mo.observe(s, { childList: true })); } catch (e) {}
  /* finestre: subito sotto il titolo grande */
  [['openVesto2', 'm-vesto2'], ['openTrucco', 'm-trucco'], ['openVita', 'm-vita'], ['openShop', 'm-shop']].forEach(([fn, k]) => {
    const f = window[fn]; if (typeof f !== 'function') return;
    window[fn] = function () { const r = f.apply(this, arguments); try { const box = $('modal-box'), big = box && box.querySelector('.big');
      if (big && !box.querySelector('.sez-img') && SEZ_IMG[k]) { box.classList.add('wide'); big.insertAdjacentHTML('afterend', '<div class="sez-img sez-m" data-k="' + k + '">' + SEZ_IMG[k] + '</div>'); setTimeout(() => { box.scrollTop = 0; }, 80); } } catch (e) {} return r; };
  });
})();
