/* ================= 🎯 CHE COSA VOGLIO OTTENERE? (14/11/2026, richiesta del proprietario) =================
   In «Come mi vesto» e in «Come mi trucco»: 10 esempi con uno scopo ciascuno. Ogni esempio ha le stesse parti:
   lo scopo · come si fa · perché funziona · (nota) · un disegno · «Prova tu» dove ha senso.
   Testi in data/domande/scopi.js (SCOPI: autore + revisore indipendente, fonti in SCOPI.fonti); qui ci sono solo i disegni e la finestra.
   Scelte che restano valide: mai scopi sul corpo, mai «sbagliato»; trucco solo per gioco, spettacoli e occasioni speciali con un adulto,
   nessun passo pratico per gli occhi (t07 è sola conoscenza, «per quando sarai più grande»); nessuna gemma per il trucco. */
const SC_OK = () => typeof SCOPI !== 'undefined';
const SC_P = '#F2C9A8', SC_H = '#5b3a29', SC_I = '#1d2433';
const scHex = n => { const k = String(n || '').toLowerCase(); const r = RUOTA.find(c => c[0] === k) || NEUTRI.find(c => c[0] === k); return r ? r[1] : (/^#/.test(k) ? k : '#cccccc'); };
const scIdx = n => { const k = String(n || '').toLowerCase(), a = RUOTA.findIndex(c => c[0] === k); if (a >= 0) return a; const b = NEUTRI.findIndex(c => c[0] === k); return b >= 0 ? -(b + 1) : null; };

/* ---------- una figurina vestita, a parametri ----------
   t maglia · tw 1 = larga · tl 0 corta, 1 normale, 2 lunga · b sotto · bt 'p' pantaloni, 'g' gonna · bw 1 = largo · s scarpe
   e colore degli occhi · pat {on:'t'|'b', k:'righe'|'pois', c} · acc [['sciarpa'|'cerchietto'|'giacca'|'rifl'|'zaino'|'collana'|'felpa', colore]] · notte · l etichetta */
function scFig(o) {
  const tw = o.tw ? 12 : 0, tb = o.tl === 0 ? 92 : o.tl === 2 ? 128 : 108, bw = o.bw ? 10 : 0, st = 'stroke="' + SC_I + '" stroke-width="2.4" stroke-linejoin="round"';
  const acc = k => (o.acc || []).find(a => a[0] === k), pid = 'scp' + Math.random().toString(36).slice(2, 8);
  const patDef = o.pat ? '<defs><pattern id="' + pid + '" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="' + scHex(o.pat.on === 't' ? o.t : o.b) + '"/>' + (o.pat.k === 'righe' ? '<rect width="10" height="4" fill="' + scHex(o.pat.c) + '"/>' : '<circle cx="5" cy="5" r="2.4" fill="' + scHex(o.pat.c) + '"/>') + '</pattern></defs>' : '';
  const fill = on => o.pat && o.pat.on === on ? 'url(#' + pid + ')' : scHex(on === 't' ? o.t : o.b);
  const top = '<path d="M' + (42 - tw) + ' 50 L' + (78 + tw) + ' 50 L' + (96 + tw) + ' 72 L' + (86 + tw) + ' 80 L' + (80 + tw) + ' 72 L' + (80 + tw) + ' ' + tb + ' L' + (40 - tw) + ' ' + tb + ' L' + (40 - tw) + ' 72 L' + (34 - tw) + ' 80 L' + (24 - tw) + ' 72 Z" fill="' + fill('t') + '" ' + st + '/>';
  const bot = o.bt === 'g' ? '<path d="M42 104 L78 104 L' + (90 + bw) + ' 146 L' + (30 - bw) + ' 146 Z" fill="' + fill('b') + '" ' + st + '/><path d="M50 146 V164 M70 146 V164" stroke="' + SC_P + '" stroke-width="7" stroke-linecap="round"/>'
    : '<path d="M' + (42 - bw) + ' 104 L' + (78 + bw) + ' 104 L' + (78 + bw) + ' 164 L' + (63) + ' 164 L60 122 L57 164 L' + (42 - bw) + ' 164 Z" fill="' + fill('b') + '" ' + st + '/>';
  return '<span class="sc-f"><svg class="sc-fig' + (o.notte ? ' notte' : '') + '" viewBox="0 0 120 180" role="img" aria-label="' + esc(o.l || 'esempio') + '">' + patDef +
    (o.notte ? '<rect x="2" y="2" width="116" height="176" rx="12" fill="#17203a"/><circle cx="98" cy="20" r="8" fill="#ffe9a3"/>' : '') +
    '<path d="M38 26 C38 6 82 6 82 26 L82 40 L38 40 Z" fill="' + SC_H + '"/><circle cx="60" cy="30" r="17" fill="' + SC_P + '" ' + st + '/><path d="M43 24 C48 12 72 12 77 24 C68 18 52 18 43 24Z" fill="' + SC_H + '"/>' +
    '<circle cx="54" cy="31" r="2.6" fill="' + (o.e ? scHex(o.e) : SC_I) + '"/><circle cx="66" cy="31" r="2.6" fill="' + (o.e ? scHex(o.e) : SC_I) + '"/><path d="M55 38 Q60 42 65 38" fill="none" stroke="' + SC_I + '" stroke-width="1.6" stroke-linecap="round"/>' +
    (acc('cerchietto') ? '<path d="M43 22 C48 8 72 8 77 22" fill="none" stroke="' + scHex(acc('cerchietto')[1]) + '" stroke-width="4.5" stroke-linecap="round"/>' : '') +
    bot + top +
    (acc('felpa') ? '<path d="M38 98 L82 98 L84 110 L36 110 Z" fill="' + scHex(acc('felpa')[1]) + '" ' + st + '/>' : '') +
    (acc('giacca') ? '<path d="M' + (40 - tw) + ' 50 L55 50 L52 96 L' + (38 - tw) + ' 96 L' + (38 - tw) + ' 72 L' + (32 - tw) + ' 80 L' + (22 - tw) + ' 72 Z M' + (80 + tw) + ' 50 L65 50 L68 96 L' + (82 + tw) + ' 96 L' + (82 + tw) + ' 72 L' + (88 + tw) + ' 80 L' + (98 + tw) + ' 72 Z" fill="' + scHex(acc('giacca')[1]) + '" ' + st + '/>' : '') +
    (acc('rifl') ? '<path d="M40 66 H80 M40 84 H80" stroke="#e9ff4d" stroke-width="5"/><path d="M40 66 H80 M40 84 H80" stroke="#fff" stroke-width="1.5" stroke-dasharray="3 3"/>' : '') +
    (acc('sciarpa') ? '<path d="M44 46 Q60 58 76 46 L78 54 Q60 66 42 54 Z" fill="' + scHex(acc('sciarpa')[1]) + '" ' + st + '/><path d="M70 56 L74 78 L64 78 L64 58 Z" fill="' + scHex(acc('sciarpa')[1]) + '" ' + st + '/>' : '') +
    (acc('collana') ? '<path d="M50 50 Q60 64 70 50" fill="none" stroke="' + scHex(acc('collana')[1]) + '" stroke-width="3" stroke-dasharray="1 5" stroke-linecap="round"/>' : '') +
    (acc('zaino') ? '<path d="M' + (80 + tw) + ' 56 q16 2 14 26 q-2 12 -14 12 Z" fill="' + scHex(acc('zaino')[1]) + '" ' + st + '/>' : '') +
    '<path d="M' + (o.bt === 'g' ? '42 164 h16 v9 h-22 q0 -7 6 -9 Z M62 164 h16 q6 2 6 9 h-22 Z' : (42 - bw) + ' 164 h16 v9 h-22 q0 -7 6 -9 Z M' + (62 + bw) + ' 164 h16 q6 2 6 9 h-22 Z') + '" fill="' + scHex(o.s || 'bianco') + '" ' + st + '/>' +
    (o.notte && !acc('rifl') ? '<rect x="2" y="2" width="116" height="176" rx="12" fill="#17203a" opacity=".62"/>' : '') +
    '</svg>' + scCap(o.l);
}
/* ---------- un viso, a parametri ----------
   cap 'sciolti' | 'coda' | 'treccia' | 'cerchietto' · sopr sopracciglia in ordine · lab labbra lucide · m colore della maglia
   scena trucco di scena (solo colore sulle guance: lontano da occhi e bocca) · dis disegno del truccabimbi · brill brillantini su un accessorio, lontano dal viso · pad dischetto per struccarsi · sole protezione · l etichetta */
function scViso(o) {
  const st = 'stroke="' + SC_I + '" stroke-width="2.4"', oc = o.e ? scHex(o.e) : '#3b6ea5';
  return '<span class="sc-f"><svg class="sc-fig" viewBox="0 0 120 134" role="img" aria-label="' + esc(o.l || 'esempio') + '">' +
    (o.sole ? '<circle cx="100" cy="18" r="9" fill="#ffd23f"/><g stroke="#ffd23f" stroke-width="2.5" stroke-linecap="round"><path d="M100 3v4M100 29v4M85 18h4M111 18h4"/></g>' : '') +
    (o.scena ? '<path d="M6 4 L30 60 M114 4 L90 60" stroke="#ffd23f" stroke-width="12" opacity=".5" stroke-linecap="round"/>' : '') +
    (o.cap === 'treccia' ? '<path d="M88 60 q14 14 6 30 q-8 12 2 24" fill="none" stroke="' + SC_H + '" stroke-width="9" stroke-linecap="round" stroke-dasharray="9 3"/>' : '') +
    (o.cap === 'coda' ? '<path d="M84 34 q22 4 20 34 q-2 10 -8 14" fill="none" stroke="' + SC_H + '" stroke-width="11" stroke-linecap="round"/>' : '') +
    (o.m ? '<path d="M22 134 Q24 114 46 108 L74 108 Q96 114 98 134 Z" fill="' + scHex(o.m) + '" ' + st + '/>' : '') +
    '<path d="M24 62 C22 22 98 22 96 62 L96 ' + (o.cap === 'sciolti' || !o.cap ? 108 : 70) + ' L24 ' + (o.cap === 'sciolti' || !o.cap ? 108 : 70) + ' Z" fill="' + SC_H + '"/>' +
    '<ellipse cx="60" cy="70" rx="33" ry="40" fill="' + SC_P + '" ' + st + '/>' +
    (o.cap === 'sciolti' || !o.cap ? '<path d="M27 66 C28 34 62 28 74 36 C56 40 40 52 36 84 C30 82 27 76 27 66Z M93 66 C92 44 82 36 74 36 C84 44 86 60 86 84 C91 80 93 74 93 66Z" fill="' + SC_H + '"/>' : '<path d="M28 60 C30 30 90 30 92 60 C80 44 40 44 28 60Z" fill="' + SC_H + '"/>') +
    (o.cap === 'cerchietto' ? '<path d="M29 54 C36 26 84 26 91 54" fill="none" stroke="#ff5c8a" stroke-width="5" stroke-linecap="round"/>' : '') +
    '<ellipse cx="47" cy="68" rx="6.5" ry="' + 6.5 + '" fill="#fff" stroke="' + SC_I + '" stroke-width="' + 1.6 + '"/><ellipse cx="73" cy="68" rx="6.5" ry="' + 6.5 + '" fill="#fff" stroke="' + SC_I + '" stroke-width="' + 1.6 + '"/>' +
    '<circle cx="47" cy="69" r="3.6" fill="' + oc + '"/><circle cx="73" cy="69" r="3.6" fill="' + oc + '"/><circle cx="47" cy="69" r="1.5" fill="' + SC_I + '"/><circle cx="73" cy="69" r="1.5" fill="' + SC_I + '"/>' +
    '<path d="M39 ' + (o.sopr ? 57 : 58) + ' Q47 ' + (o.sopr ? 52 : 55) + ' 55 ' + (o.sopr ? 57 : 58) + ' M65 ' + (o.sopr ? 57 : 58) + ' Q73 ' + (o.sopr ? 52 : 55) + ' 81 ' + (o.sopr ? 57 : 58) + '" fill="none" stroke="' + SC_H + '" stroke-width="' + (o.sopr ? 2.8 : 2) + '" stroke-linecap="round"' + (o.sopr ? '' : ' stroke-dasharray="3 2"') + '/>' +
    (o.scena ? '<ellipse cx="38" cy="84" rx="7" ry="4.5" fill="#ff8fa3" opacity=".9"/><ellipse cx="82" cy="84" rx="7" ry="4.5" fill="#ff8fa3" opacity=".9"/>' : '') +
    '<path d="M57 80 Q60 85 63 80" fill="none" stroke="' + SC_I + '" stroke-width="1.6" stroke-linecap="round"/>' +
    '<path d="M50 94 Q60 103 70 94" fill="' + (o.lab ? '#f5869b' : 'none') + '" stroke="' + (o.lab ? '#d6456a' : '#c0392b') + '" stroke-width="' + (o.lab ? 2 : 2.6) + '" stroke-linecap="round"/>' + (o.lab ? '<path d="M56 96 q4 2 8 0" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round"/>' : '') +
    (o.dis === 'farfalla' ? '<g transform="translate(60 44)"><path d="M0 0 C-14 -12 -24 0 -10 6 C-20 12 -8 18 0 6 C8 18 20 12 10 6 C24 0 14 -12 0 0Z" fill="#7B2D9B" stroke="' + SC_I + '" stroke-width="1.2"/><circle cx="-10" cy="1" r="2.4" fill="#FFE135"/><circle cx="10" cy="1" r="2.4" fill="#FFE135"/></g>' : '') +
    (o.dis === 'gatto' ? '<path d="M56 80 l4 4 l4 -4z" fill="#222"/><path d="M34 84 h14 M34 90 h14 M72 84 h14 M72 90 h14" stroke="#222" stroke-width="1.6" stroke-linecap="round"/>' : '') +
    (o.brill ? [[35, 42], [47, 32], [60, 28], [73, 32], [85, 42]].map((p, k) => '<path transform="translate(' + p[0] + ' ' + p[1] + ')" d="M0 -5.5 L1.5 -1.5 L5.5 0 L1.5 1.5 L0 5.5 L-1.5 1.5 L-5.5 0 L-1.5 -1.5Z" stroke="#1d2433" stroke-width=".6" fill="' + (k % 2 ? '#ffd23f' : '#7ad7f0') + '"/>').join('') : '') +
    (o.pad ? '<circle cx="92" cy="96" r="13" fill="#fff" ' + st + '/><path d="M84 96 q8 -6 16 0" fill="none" stroke="#cfd6e4" stroke-width="2"/>' : '') +
    (o.sole ? '<path d="M4 100 q14 -10 28 0 v20 q-14 14 -28 0Z" fill="#7ad7f0" ' + st + '/><text x="18" y="118" text-anchor="middle" font-size="11" font-weight="900" fill="' + SC_I + '">30+</text>' : '') +
    '</svg>' + scCap(o.l);
}
/* un occhio schematico per «come funziona» (t07): k = 'niente' | 'matita' | 'mascara' | 'ombretto' */
function scOcchio(k, l) {
  return '<span class="sc-f"><svg class="sc-fig" viewBox="0 0 120 80" role="img" aria-label="' + esc(l) + '">' +
    (k === 'ombretto' ? '<path d="M18 46 Q60 2 102 46 Q60 22 18 46Z" fill="#c9a8e6"/><path d="M30 38 Q60 14 90 38 Q60 26 30 38Z" fill="#f3e6ff"/>' : '') +
    '<path d="M18 48 Q60 18 102 48 Q60 76 18 48Z" fill="#fff" stroke="' + SC_I + '" stroke-width="' + (k === 'matita' ? 4.5 : 2) + '"/>' +
    '<circle cx="60" cy="47" r="13" fill="#3b6ea5"/><circle cx="60" cy="47" r="6" fill="' + SC_I + '"/><circle cx="56" cy="43" r="2.4" fill="#fff"/>' +
    (k === 'mascara' ? [26, 36, 46, 56, 66, 76, 86, 94].map((x, i) => '<path d="M' + x + ' ' + (42 - Math.sin((x - 18) / 84 * Math.PI) * 13).toFixed(1) + ' l' + ((x - 60) / 9).toFixed(1) + ' -13" stroke="' + SC_I + '" stroke-width="2.6" stroke-linecap="round"/>').join('')
      : [30, 44, 60, 76, 90].map(x => '<path d="M' + x + ' ' + (42 - Math.sin((x - 18) / 84 * Math.PI) * 13).toFixed(1) + ' l' + ((x - 60) / 14).toFixed(1) + ' -6" stroke="' + SC_I + '" stroke-width="1.3" stroke-linecap="round"/>').join('')) +
    '</svg>' + scCap(l);
}
function scMano(smalto, l) {
  const d = [[30, 44, 20], [46, 30, 24], [62, 26, 26], [78, 32, 24]];
  return '<span class="sc-f"><svg class="sc-fig" viewBox="0 0 120 116" role="img" aria-label="' + esc(l) + '"><path d="M22 112 Q18 74 24 60 L96 60 Q102 80 94 112 Z" fill="' + SC_P + '" stroke="' + SC_I + '" stroke-width="2.4"/>' +
    d.map(f => '<rect x="' + (f[0] - 7) + '" y="' + f[1] + '" width="14" height="' + (62 - f[1] + 8) + '" rx="7" fill="' + SC_P + '" stroke="' + SC_I + '" stroke-width="2.4"/><path d="M' + (f[0] - 4.5) + ' ' + (f[1] + 3) + ' q4.5 -4 9 0 v7 h-9Z" fill="' + (smalto ? '#ff8fb8' : '#ffe9e0') + '" stroke="' + SC_I + '" stroke-width="1.2"/>').join('') +
    '<path d="M96 74 q16 -8 16 6 q-2 8 -16 10" fill="' + SC_P + '" stroke="' + SC_I + '" stroke-width="2.4"/></svg>' + scCap(l);
}
const scCap = l => (l ? '<small>' + esc(l) + '</small>' : '') + '</span>';
const scFr = '<span class="sc-fr" aria-hidden="true">→</span>';
/* i disegni di ogni esempio */
const SC_DIS = {
  v01: () => scFig({ t: 'grigio', b: 'blu jeans', e: 'blu', l: 'occhi azzurri' }) + scFr + scFig({ t: 'grigio', b: 'blu jeans', e: 'blu', acc: [['sciarpa', 'arancione']], l: 'colore opposto' }) + scFig({ t: 'blu', b: 'blu jeans', e: 'blu', l: 'colore simile' }),
  v02: () => scFig({ t: 'beige', b: 'blu jeans', s: 'bianco', l: 'tutto neutro' }) + scFr + scFig({ t: 'beige', b: 'blu jeans', s: 'bianco', acc: [['sciarpa', 'giallo arancio']], l: 'un punto forte' }),
  v03: () => scFig({ t: 'blu verde', b: 'bianco', bt: 'g', s: 'beige', l: 'un colore protagonista, due neutri' }),
  v04: () => scFig({ t: 'bianco', b: 'blu jeans', bw: 1, s: 'grigio', acc: [['giacca', 'verde'], ['zaino', 'arancione']], l: 'a strati, comoda' }),
  v05: () => scFig({ t: 'nero', b: 'blu jeans', s: 'nero', notte: 1, l: 'scuro: si vede poco' }) + scFr + scFig({ t: 'bianco', b: 'beige', s: 'bianco', notte: 1, acc: [['rifl']], l: 'chiaro e riflettente' }),
  v06: () => scFig({ t: 'bianco', b: 'rosso', bt: 'g', pat: { on: 't', k: 'righe', c: 'blu' }, s: 'bianco', l: 'una fantasia…' }) + scFr + scFig({ t: 'bianco', b: 'blu', bt: 'g', pat: { on: 't', k: 'righe', c: 'blu' }, s: 'bianco', l: '…e il suo colore' }),
  v07: () => scFig({ t: 'giallo arancio', tw: 1, tl: 2, b: 'nero', s: 'bianco', l: 'largo sopra' }) + scFig({ t: 'bianco', b: 'blu viola', bt: 'g', bw: 1, s: 'bianco', l: 'largo sotto' }),
  v08: () => scFig({ t: 'beige', tl: 2, b: 'blu jeans', s: 'bianco', acc: [['giacca', 'rosso arancio']], l: 'lungo sotto, corto sopra' }),
  v09: () => scFig({ t: 'bianco', b: 'rosso viola', bt: 'g', bw: 1, s: 'grigio', acc: [['collana', 'giallo']], l: 'gonna e scarpe sportive' }),
  v10: () => scFig({ t: 'bianco', b: 'blu jeans', s: 'grigio', l: 'tutti i giorni' }) + scFig({ t: 'bianco', tl: 0, b: 'rosso', bt: 'g', bw: 1, s: 'nero', acc: [['collana', 'giallo']], l: 'a una festa' }) + scFig({ t: 'bianco', b: 'verde', bw: 1, s: 'grigio', acc: [['felpa', 'blu'], ['zaino', 'arancione']], l: 'in gita' }),
  t01: () => scViso({ cap: 'sciolti', l: 'prima' }) + scFr + scViso({ cap: 'cerchietto', sopr: 1, m: 'arancione', l: 'viso libero' }),
  t02: () => scViso({ cap: 'coda', sopr: 1, l: 'da vicino' }) + scFr + scViso({ cap: 'cerchietto', sopr: 1, scena: 1, l: 'sul palco, con un adulto' }),
  t03: () => scViso({ cap: 'cerchietto', sopr: 1, sole: 1, l: 'pelle pulita e protetta' }),
  t04: () => scViso({ cap: 'coda', sopr: 1, lab: 1, l: 'labbra morbide' }),
  t05: () => scViso({ cap: 'coda', sopr: 1, dis: 'farfalla', l: 'due metà uguali' }) + scViso({ cap: 'cerchietto', sopr: 1, dis: 'gatto', l: 'lontano dagli occhi' }),
  t06: () => scViso({ cap: 'coda', sopr: 1, dis: 'farfalla', l: 'dopo la festa' }) + scFr + scViso({ cap: 'coda', sopr: 1, pad: 1, l: 'pulita prima di dormire' }),
  t07: () => scOcchio('niente', 'occhio') + scOcchio('matita', 'matita: il contorno') + scOcchio('mascara', 'mascara: le ciglia') + scOcchio('ombretto', 'ombretto: luce e ombra'),
  t08: () => scMano(false, 'corte e pulite') + scFr + scMano(true, 'un po’ di colore'),
  t09: () => scViso({ cap: 'coda', sopr: 1, l: 'coda' }) + scViso({ cap: 'treccia', sopr: 1, l: 'treccia' }) + scViso({ cap: 'cerchietto', sopr: 1, l: 'cerchietto' }),
  t10: () => scViso({ cap: 'cerchietto', sopr: 1, brill: 1, l: 'pochi, su un accessorio' })
};
/* «Prova tu»: gli esempi di trucco che si possono provare nel Truccabimbi */
const SC_TRUCCA = { t05: 'farfalla' };

function openScopi(kind, apri) {
  if (!SC_OK()) return;
  const L = SCOPI[kind] || [], visti = store.get('scopi-visti', {}), tr = kind === 'trucco';
  openModal('<div class="big" style="font-size:26px">🎯 Che cosa voglio ottenere?</div><p class="vd-sub">' + (tr ? 'Dieci esempi: ognuno parte da uno scopo. Il trucco è un gioco per le occasioni speciali, sempre con un adulto.' : 'Dieci esempi: ognuno parte da uno scopo. Non c’è un modo giusto solo: conta anche il tuo gusto.') + '</p>' +
    '<div class="sc-grid">' + L.map(x => '<details class="sc-c" data-sc="' + x.id + '"' + (apri === x.id ? ' open' : '') + '><summary><span class="sc-ic">' + x.ic + '</span><b>' + esc(x.t) + '</b>' + (visti[x.id] ? '<i class="sc-ok" aria-label="già visto">✓</i>' : '') + '<span class="sc-fz" aria-hidden="true">▾</span></summary>' +
      '<div class="sc-dis">' + (SC_DIS[x.id] ? SC_DIS[x.id]() : '') + '</div>' +
      '<p class="sc-p"><span class="sc-e sc-e1">🎯 Lo scopo</span> ' + esc(x.scopo) + '</p>' +
      '<div class="sc-p"><span class="sc-e sc-e2">👣 Come si fa</span><ol>' + x.come.map(c => '<li>' + esc(c) + '</li>').join('') + '</ol></div>' +
      '<p class="sc-p"><span class="sc-e sc-e3">💡 Perché funziona</span> ' + esc(x.perche) + '</p>' +
      (x.nota ? '<p class="sc-nota">' + esc(x.nota) + '</p>' : '') +
      '<div class="row" style="gap:8px;margin-top:8px">' + sayBtn(x.t + '. ' + x.scopo + ' ' + x.come.join('. ') + '. ' + x.perche + (x.nota ? ' ' + x.nota : '')) +
        (!tr && x.look && x.look.map(scIdx).every(v => v != null) ? '<button type="button" class="btn small" data-prova="' + x.id + '" style="--bc:var(--v2-green)">▶️ Prova tu nel look</button>' : '') +
        (tr && SC_TRUCCA[x.id] ? '<button type="button" class="btn small" data-trucca="' + x.id + '" style="--bc:var(--v2-green)">▶️ Prova tu nel Truccabimbi</button>' : '') + '</div></details>').join('') + '</div>' +
    '<div class="row center" style="margin-top:10px"><button type="button" class="btn ghost" id="sc-b">← Indietro</button></div>');
  const box = $('modal-box'); if (box) box.classList.add('wide', 'xwide');
  document.querySelectorAll('.sc-c').forEach(d => d.addEventListener('toggle', () => { if (!d.open) return; const v = store.get('scopi-visti', {}); if (!v[d.dataset.sc]) { v[d.dataset.sc] = todayIso(); store.set('scopi-visti', v); } }));
  document.querySelectorAll('[data-prova]').forEach(b => b.onclick = () => { const x = L.find(y => y.id === b.dataset.prova); box && box.classList.remove('xwide'); openLook(x.look.map(scIdx)); });
  document.querySelectorAll('[data-trucca]').forEach(b => b.onclick = () => { box && box.classList.remove('xwide'); openTrFace(SC_TRUCCA[b.dataset.trucca]); });
  $('sc-b').onclick = () => { const bx = $('modal-box'); if (bx) bx.classList.remove('xwide'); tr ? openTrucco() : openVesto2(); };
}
