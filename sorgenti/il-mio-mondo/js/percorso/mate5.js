/* ================= TAPPE DI MATEMATICA DEL PROGRAMMA DI 5ª =================
   Domande generate (sempre nuove), conti fatti in numeri interi per non avere errori di arrotondamento.
   La prima frase della spiegazione è la regola da ricordare (riga chiave), il resto va dietro «Perché?». */
const fmtN = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
/* v in centesimi (o millesimi con d=1000) → «3,5» */
const fmtD = (v, d) => { const t = (v / (d || 100)).toFixed(6).replace(/\.?0+$/, '').split('.'); return fmtN(t[0]) + (t[1] ? ',' + t[1] : ''); };
const MATE5 = [
  { n: 'Numeri grandi', ic: '🔟', g: () => {
    let digits, pos;
    do { digits = [rnd(1, 9)]; for (let k = 0; k < 6; k++) digits.push(rnd(0, 9)); pos = rnd(0, 5); } while (digits[pos] === 0 || digits.filter(x => x === digits[pos]).length > 1);
    const n = +digits.join(''), place = Math.pow(10, 6 - pos), val = digits[pos] * place;
    const NOMI = { 1000000: 'unità di milione', 100000: 'centinaia di migliaia', 10000: 'decine di migliaia', 1000: 'unità di migliaia', 100: 'centinaia', 10: 'decine' };
    return mk('Nel numero ' + fmtN(n) + ', quanto vale la cifra ' + digits[pos] + '?', fmtN(val), [fmtN(val * 10), fmtN(val / 10)],
      'Il valore dipende dalla posizione: qui il ' + digits[pos] + ' sta nelle ' + NOMI[place] + ' e vale ' + fmtN(val) + '. Conta da destra: unità, decine, centinaia, migliaia…');
  } },
  { n: 'Numeri decimali', ic: '🔢', g: () => {
    const s = Math.random() < .5; let a = rnd(110, 980), b = rnd(15, 450);
    if (Math.random() < .5) a = Math.round(a / 10) * 10; /* a volte un solo decimale */
    if (s && b >= a) b = Math.max(5, a - rnd(5, 60));
    const r = s ? a - b : a + b;
    return mk('Quanto fa ' + fmtD(a) + (s ? ' − ' : ' + ') + fmtD(b) + '?', fmtD(r), [fmtD(r + 10), fmtD(r + 100), fmtD(r + 1)],
      'Metti in colonna la virgola sotto la virgola. ' + fmtD(a) + (s ? ' − ' : ' + ') + fmtD(b) + ' = ' + fmtD(r) + ': unità sotto unità, decimi sotto decimi.');
  } },
  { n: '× e : per 10, 100, 1000', ic: '✨', g: () => {
    const p = pick([10, 100, 1000]), z = String(p).length - 1, mul = Math.random() < .5, v = rnd(12, 999); /* v in centesimi */
    const r = mul ? fmtD(v * p) : fmtD(v, 100 * p);
    const w1 = mul ? fmtD(v * p / 10) : fmtD(v, 10 * p), w2 = mul ? fmtD(v * p * 10) : fmtD(v, 1000 * p);
    return mk('Quanto fa ' + fmtD(v) + (mul ? ' × ' : ' : ') + p + '?', r, [w1, w2],
      (mul ? 'Per × ' + p + ' sposta la virgola di ' + z + (z === 1 ? ' posto' : ' posti') + ' a destra.' : 'Per : ' + p + ' sposta la virgola di ' + z + (z === 1 ? ' posto' : ' posti') + ' a sinistra.') + ' ' + fmtD(v) + (mul ? ' × ' : ' : ') + p + ' = ' + r + '.');
  } },
  { n: 'Percentuali', ic: '💯', g: () => {
    const pc = pick([10, 20, 25, 50, 75]), base = pc === 25 || pc === 75 ? 4 * rnd(3, 30) : pc === 50 ? 2 * rnd(5, 60) : 10 * rnd(2, 30), r = base * pc / 100;
    const shop = Math.random() < .4;
    const q = shop ? 'Uno zaino costa ' + base + ' €. Con lo sconto del ' + pc + '%, quanti euro risparmi?' : 'Quanto è il ' + pc + '% di ' + base + '?';
    const how = pc === 50 ? 'la metà' : pc === 25 ? 'un quarto' : pc === 75 ? 'tre quarti' : pc === 10 ? 'dividi per 10' : 'dividi per 10 e moltiplica per 2';
    return mk(q, r, [r * 2, base - r, r + 10, r + 5].filter(x => Number.isInteger(x) && x > 0),
      'Il ' + pc + '% di ' + base + ' è ' + r + ': ' + how + '. Per cento vuol dire «su 100»: ' + pc + '% = ' + pc + '/100.');
  } },
  { n: 'Equivalenze', ic: '📏', g: () => {
    const T = [['m', 'cm', 100], ['m', 'mm', 1000], ['km', 'm', 1000], ['cm', 'mm', 10], ['kg', 'g', 1000], ['l', 'ml', 1000], ['l', 'cl', 100], ['dm', 'cm', 10]];
    const [big, small, f] = pick(T), down = Math.random() < .6;
    if (down) { const v = rnd(2, 95) * (f === 10 || Math.random() < .5 ? 10 : 1); /* decimi o centesimi */ const r = v * f / 100;
      return mk(fmtD(v) + ' ' + big + ' = quanti ' + small + '?', fmtN(r), [fmtN(r * 10), Number.isInteger(r / 10) ? fmtN(r / 10) : fmtN(r * 100)],
        'Da ' + big + ' a ' + small + ' moltiplichi per ' + fmtN(f) + '. ' + fmtD(v) + ' × ' + fmtN(f) + ' = ' + fmtN(r) + ' ' + small + '.'); }
    const v = rnd(2, 99) * (f >= 100 ? 10 : 1), r = fmtD(v, f);
    return mk(fmtN(v) + ' ' + small + ' = quanti ' + big + '?', r, [fmtD(v * 10, f), fmtD(v, f * 10)],
      'Da ' + small + ' a ' + big + ' dividi per ' + fmtN(f) + '. ' + fmtN(v) + ' : ' + fmtN(f) + ' = ' + r + ' ' + big + '.');
  } },
  { n: 'Angoli e triangoli', ic: '📐', g: () => {
    if (Math.random() < .5) { const a = rnd(3, 13) * 5, b = rnd(3, 13) * 5, c = 180 - a - b;
      return mk('In un triangolo due angoli misurano ' + a + '° e ' + b + '°. Quanto misura il terzo?', c + '°', [(360 - a - b) + '°', (c + 10) + '°'],
        'Gli angoli di un triangolo sommano sempre 180°. 180 − ' + a + ' − ' + b + ' = ' + c + '.'); }
    const A = [[rnd(1, 17) * 5, 'Acuto'], [90, 'Retto'], [rnd(19, 35) * 5, 'Ottuso'], [180, 'Piatto']], [m, ok] = pick(A);
    return mk('Un angolo di ' + m + '° è…', ok, ['Acuto', 'Retto', 'Ottuso', 'Piatto'].filter(x => x !== ok).slice(0, 2),
      'Acuto meno di 90°, retto 90°, ottuso tra 90° e 180°, piatto 180°. ' + m + '° è ' + ok.toLowerCase() + '.');
  } },
  { n: 'Aree dei poligoni', ic: '🔷', g: () => {
    const t = rnd(0, 3);
    if (t === 0) { const b = rnd(2, 12) * 2, h = rnd(2, 12), r = b * h / 2; return mk('Triangolo: base ' + b + ' cm, altezza ' + h + ' cm. Quanto misura l’area?', r + ' cm²', [b * h + ' cm²', (b + h) + ' cm²', 2 * (b + h) + ' cm²', (r + b) + ' cm²'], 'Area del triangolo = base × altezza : 2. ' + b + ' × ' + h + ' : 2 = ' + r + ' cm².'); }
    if (t === 1) { const b = rnd(3, 15), h = rnd(2, 10), r = b * h; return mk('Parallelogramma: base ' + b + ' cm, altezza ' + h + ' cm. Area?', r + ' cm²', [(r % 2 ? r * 2 : r / 2) + ' cm²', 2 * (b + h) + ' cm²', (b + h) + ' cm²', (r + h) + ' cm²'], 'Area del parallelogramma = base × altezza. ' + b + ' × ' + h + ' = ' + r + ' cm².'); }
    if (t === 2) { const D = rnd(6, 12) * 2, d = rnd(2, 10), r = D * d / 2; return mk('Rombo: diagonali di ' + D + ' cm e ' + d + ' cm. Area?', r + ' cm²', [D * d + ' cm²', (D + d) * 2 + ' cm²', (D + d) + ' cm²', (r + d) + ' cm²'], 'Area del rombo = diagonale maggiore × diagonale minore : 2. ' + D + ' × ' + d + ' : 2 = ' + r + ' cm².'); }
    const B = rnd(6, 14), b = rnd(2, B - 2), h = rnd(1, 6) * 2, r = (B + b) * h / 2;
    return mk('Trapezio: basi ' + B + ' cm e ' + b + ' cm, altezza ' + h + ' cm. Area?', r + ' cm²', [(B + b) * h + ' cm²', B * h + ' cm²', (B + b + h) + ' cm²', (r + h) + ' cm²'], 'Area del trapezio = (base maggiore + base minore) × altezza : 2. (' + B + ' + ' + b + ') × ' + h + ' : 2 = ' + r + ' cm².');
  } },
  { n: 'Il cerchio', ic: '⭕', g: () => {
    const r = rnd(1, 10), useD = Math.random() < .5, d = 2 * r, c = d * 314; /* centesimi */
    return mk('Un cerchio ha ' + (useD ? 'il diametro di ' + d : 'il raggio di ' + r) + ' cm. Quanto misura la circonferenza, usando 3,14?', fmtD(c) + ' cm', [fmtD(r * 314) + ' cm', fmtD(c * 2) + ' cm'],
      'Circonferenza = diametro × 3,14 (pi greco vale circa 3,14, quindi il risultato è approssimato). ' + (useD ? '' : 'Il diametro è il doppio del raggio: ' + d + ' cm. ') + d + ' × 3,14 = ' + fmtD(c) + ' cm.');
  } },
  { n: 'Media e moda', ic: '📊', g: () => {
    if (Math.random() < .5) { const m = rnd(5, 9); let v; do { v = [rnd(3, 10), rnd(3, 10), rnd(3, 10)]; v.push(4 * m - v[0] - v[1] - v[2]); } while (v[3] < 1 || v[3] > 10);
      return mk('Voti di 4 prove: ' + v.join(', ') + '. Qual è la media?', m, [m + 1, m - 1], 'Media = somma dei valori : quanti sono. (' + v.join(' + ') + ') : 4 = ' + (m * 4) + ' : 4 = ' + m + '.'); }
    const mo = rnd(2, 9), v = [mo, mo, mo]; while (v.length < 7) { const x = rnd(1, 10); if (x !== mo && v.filter(y => y === x).length < 2) v.push(x); }
    const sh = shuffle(v), oth = sh.find(x => x !== mo);
    return mk('Nei numeri ' + sh.join(', ') + ', qual è la moda?', mo, [oth, Math.max(...v) === mo ? Math.min(...v) : Math.max(...v)], 'La moda è il valore che compare più volte. Qui il ' + mo + ' compare 3 volte.');
  } },
  { n: 'Numeri relativi', ic: '🌡️', g: () => {
    let a = rnd(-8, 3); if (a === 0) a = -1; const d = rnd(2, 9), up = Math.random() < .5, r = up ? a + d : a - d, f = x => (x > 0 ? '+' : x < 0 ? '−' : '') + Math.abs(x) + ' °C';
    return mk('Il termometro segna ' + f(a) + '. La temperatura ' + (up ? 'sale' : 'scende') + ' di ' + d + ' gradi. Quanto segna ora?', f(r), [f(up ? a - d : a + d), f(-r), f(r + 2), f(r - 2)],
      'Sotto lo zero i numeri hanno il segno meno. Da ' + f(a) + (up ? ' sali' : ' scendi') + ' di ' + d + ' e arrivi a ' + f(r) + ': pensa a una scala con lo zero a metà.');
  } }
];
MATH_TAPPE.splice(MATH_TAPPE.length - 1, 0, ...MATE5);
