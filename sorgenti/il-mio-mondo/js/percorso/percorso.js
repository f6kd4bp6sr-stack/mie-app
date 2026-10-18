/* ================= IL PERCORSO (stile Duolingo) =================
   Ogni materia è un sentiero di tappe: lezioni brevi da 6 domande.
   - Nessuna vita: chi sbaglia riprova e impara dalla spiegazione.
   - Le gemme 💎 premiano la risposta giusta, e di più chi ci pensa con calma (bonus 🧠).
   - Obiettivo di conoscenza del giorno: nozioni nuove + rafforzamento (ripasso a intervalli crescenti),
     circa 20 minuti. Tutto si salva da solo sull'iPad. */

/* ---------- gemme ---------- */
const Gems = {
  get() { return store.get('gems', { n: 0, tot: 0 }); },
  add(n, el, why) {
    if (!n) return; const g = Gems.get(); g.n += n; g.tot += n; store.set('gems', g); Gems.paint();
    if (el) floatText(el, '+' + n + ' 💎' + (why ? ' ' + why : ''));
  },
  spend(n) { const g = Gems.get(); if (g.n < n) return false; g.n -= n; store.set('gems', g); Gems.paint(); return true; },
  paint() { const b = $('bar-gems'); if (b) b.textContent = Gems.get().n; }
};

/* ---------- unità del percorso ---------- */
const PATH_DECO = { base: ['🌳', '🌼', '🍄', '🌷', '🦋', '🌲'], bosco: ['🌲', '🦊', '🍄', '🌳', '🦔', '🐿️'], mare: ['🐚', '🐠', '🌊', '🦀', '🐬', '⛵'], spazio: ['🪐', '⭐', '🚀', '🌙', '☄️', '👽'], ghiaccio: ['❄️', '⛄', '🐧', '⛸️', '🏔️', '🦭'] };
/* prima le materie di scuola (programma di 5ª), poi gli extra che si aprono come premio */
const PATH_ORDER = ['mate', 'ita', 'eng', 'parlo', 'storia', 'geo', 'sci-corpo', 'sci-energia', 'sci-spazio', 'sci-animali', 'civica', 'lavo', 'vesto', 'soldi', 'tecno', 'media', 'arte', 'musica', 'sp-patt', 'sp-aerea', 'sp-nuoto', 'sp-corpo', 'roblox'];
const EXTRA_UNITS = ['sp-patt', 'sp-aerea', 'sp-nuoto', 'sp-corpo', 'roblox'];
let __units = null;
function pathUnits() {
  if (__units) return __units;
  const u = [{ id: 'mate', prog: 'mate', name: 'Matematica', ic: '🔢', c: 'var(--c1)', s: 'var(--c1-soft)', math: true }];
  SCOPRI.forEach(t => u.push({ id: t.id, prog: t.id, name: t.name, ic: t.ic, c: t.c, s: t.s, items: t.quiz.map(q => ({ q: q[0], o: q[1], a: q[2], e: q[3] })) }));
  SCI.forEach(t => u.push({ id: 'sci-' + t.id, prog: 'scienze', name: t.name, ic: t.ic, c: t.c, s: t.s, items: t.quiz.map(q => ({ q: q.q, o: q.o, a: q.a, e: q.e })) }));
  SPORTS.forEach(t => u.push({ id: 'sp-' + t.id, prog: 'sport', name: t.name, ic: t.ic, c: t.c, s: t.s, items: t.quiz.map(q => ({ q: q.q, o: q.o, a: q.a, e: q.e })) }));
  /* 🇬🇧 Parlo inglese: ascoltare e parlare (data/domande/quiz/parlo.json); le risposte contano per Inglese */
  if (typeof QUIZ !== 'undefined' && QUIZ.parlo) u.push({ id: 'parlo', prog: 'eng', name: 'Parlo inglese', ic: '🇬🇧', c: 'var(--c3)', s: 'var(--c3-soft)', speak: true, items: [] });
  u.sort((a, b) => { const ia = PATH_ORDER.indexOf(a.id), ib = PATH_ORDER.indexOf(b.id); return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib); });
  u.forEach(x => { if (x.items) x.items = x.items.filter(it => it.q && Array.isArray(it.o) && it.o.length >= 2); });
  /* domande dalla fonte unica, con il loro codice fisso (data/domande/quiz/*.json) */
  if (typeof QUIZ !== 'undefined') u.forEach(x => { if (x.items && QUIZ[x.id]) x.items = QUIZ[x.id].map(z => ({ id: z.id, q: z.q, o: [z.ok].concat(z.wrong), a: 0, e: z.e || '', k: z.k || '', enl: z.en || null, kind: z.kind || '', say: z.say || '', it: z.it || '' })); else if (x.items) x.items = rev5Items(x.id, x.items); });
  else u.forEach(x => { if (x.items) x.items = rev5Items(x.id, x.items); });
  return (__units = u);
}
/* righe chiave brevi (la spiegazione lunga resta dietro «Perché?»), correzioni e domande nuove di 5ª */
function rev5Items(uid, items) {
  const F = (typeof FIX5 !== 'undefined' && FIX5[uid]) || {}, K = (typeof KEYS !== 'undefined' && KEYS[uid]) || {};
  items.forEach(it => {
    const h = hashQ(it.q), f = F[h];
    if (f) { if (f.e) it.e = f.e; if (f.ok) { it.o = it.o.slice(); it.o[it.a] = f.ok; } }
    it.k = (typeof KEYS_OK !== 'undefined' && KEYS_OK[hashQ(it.q + '|' + it.o[it.a])]) || K[h] || '';
  });
  const N = (typeof NEWQ !== 'undefined' && NEWQ[uid]) || [];
  if (!N.length) return items;
  /* le nuove si alternano alle vecchie (una ogni 3), così compaiono subito nel percorso */
  const out = [], have = new Set(items.map(it => it.q)); let j = 0;
  items.forEach((it, i) => { out.push(it); if (i % 3 === 2 && j < N.length) { while (j < N.length && have.has(N[j].q)) j++; if (j < N.length) out.push(Object.assign({}, N[j++])); } });
  while (j < N.length) { if (!have.has(N[j].q)) out.push(Object.assign({}, N[j])); j++; }
  return out;
}
/* riga chiave: quella scritta apposta, altrimenti la prima frase della spiegazione */
function splitExpl(q) {
  const e = String(q.e || '').trim();
  if (q.k) return { k: q.k, more: e && e !== q.k ? e : '' };
  const m = e.match(/^(.+?[.!?])(\s+|$)(.*)$/s);
  return m ? { k: m[1], more: m[3].trim() } : { k: e, more: '' };
}
/* le risposte si mescolano ogni volta: la giusta non sta sempre nello stesso posto */
function mixOpts(it) { const ok = it.o[it.a], o = shuffle(it.o.slice()); return { o, a: o.indexOf(ok) }; }
const unitById = id => pathUnits().find(u => u.id === id);
const hashQ = s => { let h = 5381; s = String(s); for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return (h >>> 0).toString(36); };
const itemKey = (u, it) => u.id + ':' + (it.id || hashQ(it.q));

/* ---------- tappe della matematica (domande generate, sempre nuove) ---------- */
const mk = (q, ok, wrong, e, viz) => {
  const w = []; wrong.forEach(x => { if (String(x) !== String(ok) && !w.map(String).includes(String(x))) w.push(x); });
  let k = 1; while (w.length < 2) { const c = typeof ok === 'number' ? ok + k * (k % 2 ? 1 : -1) * 2 : ok + ' ?'; if (String(c) !== String(ok) && !w.map(String).includes(String(c)) && !(typeof c === 'number' && c < 0)) w.push(c); k++; }
  const o = shuffle([ok, w[0], w[1]]); return { q, o: o.map(String), a: o.indexOf(ok), e, viz };
};
const MATH_TAPPE = [
  { n: 'Tabelline del 2, 3, 4, 5', ic: '✖️', g: () => { const a = rnd(2, 5), b = rnd(2, 10), r = a * b; return mk('Quanto fa ' + a + ' × ' + b + '?', r, [r + a, r - a, (a + 1) * b], a + ' × ' + b + ' = ' + r + '. Trucco: ' + a + ' × ' + (b - 1) + ' = ' + (r - a) + ', poi aggiungi ancora ' + a + '.'); } },
  { n: 'Tabelline del 6, 7, 8, 9', ic: '✖️', g: () => { const a = rnd(6, 9), b = rnd(2, 10), r = a * b; return mk('Quanto fa ' + a + ' × ' + b + '?', r, [r + a, r - a, r + 1], a + ' × ' + b + ' = ' + r + '. Trucco: ' + a + ' × ' + b + ' è come ' + b + ' × ' + a + ': scegli la tabellina che conosci meglio!'); } },
  { n: 'Addizioni e sottrazioni', ic: '➕', g: () => { const s = Math.random() < .5, a = rnd(120, 899), b = rnd(15, s ? 99 : 300); const r = s ? a - b : a + b; return mk('Quanto fa ' + a + (s ? ' − ' : ' + ') + b + '?', r, [r + 10, r - 10, r + 1], (s ? 'Togli prima le decine, poi le unità: ' : 'Somma prima le centinaia, poi decine e unità: ') + a + (s ? ' − ' : ' + ') + b + ' = ' + r + '. Controllo: ' + (s ? r + ' + ' + b + ' = ' + a : r + ' − ' + b + ' = ' + a) + '.'); } },
  { n: 'Moltiplicazioni grandi', ic: '🧮', g: () => { const a = rnd(12, 48), b = rnd(3, 9), r = a * b, d = Math.floor(a / 10) * 10; return mk('Quanto fa ' + a + ' × ' + b + '?', r, [r + b, r - 10, (a + 1) * b + 10], 'Dividi il numero: ' + d + ' × ' + b + ' = ' + d * b + ' e ' + (a - d) + ' × ' + b + ' = ' + (a - d) * b + '. Insieme: ' + r + '.'); } },
  { n: 'Divisioni', ic: '➗', g: () => { const b = rnd(2, 9), r = rnd(3, 12), a = b * r; return mk('Quanto fa ' + a + ' : ' + b + '?', r, [r + 1, r - 1, r + 2], a + ' : ' + b + ' = ' + r + ', perché ' + r + ' × ' + b + ' = ' + a + '. La divisione è la moltiplicazione al contrario!'); } },
  { n: 'Frazioni di un numero', ic: '🍕', g: () => { const d = pick([2, 3, 4, 5, 10]), n = rnd(1, d - 1) || 1, tot = d * rnd(2, 9), r = tot / d * n; return mk('Quanto è ' + n + '/' + d + ' di ' + tot + '?', r, [tot / d, r + tot / d, tot - r === r ? r + 1 : tot - r], 'Prima dividi per il denominatore: ' + tot + ' : ' + d + ' = ' + tot / d + '. Poi moltiplica per il numeratore: ' + tot / d + ' × ' + n + ' = ' + r + '.'); } },
  { n: 'Frazioni: confronta', ic: '🍕', g: () => { const d = pick([3, 4, 5, 6, 8]), a = rnd(1, d - 1); let b = rnd(1, d - 1); if (b === a) b = a === 1 ? 2 : a - 1; const big = Math.max(a, b); return mk('Quale frazione è più grande?', big + '/' + d, [Math.min(a, b) + '/' + d, 'Sono uguali'], 'Con lo stesso denominatore la torta è tagliata in ' + d + ' fette uguali: vince chi ha più fette, cioè ' + big + '/' + d + '.'); } },
  { n: 'Leggere l’orologio', ic: '🕐', g: () => { const h = rnd(1, 12), m = pick([0, 15, 30, 45, 5, 10, 20, 40, 50]); const ok = h + ':' + pad2(m); const sw = (m / 5 || 12) + ':' + pad2(h % 12 * 5); return mk('Che ore segna l’orologio?', ok, [sw === ok ? h + ':' + pad2((m + 15) % 60) : sw, (h % 12 + 1) + ':' + pad2(m)], 'La lancetta corta indica l’ora: ' + h + '. La lunga indica i minuti: ogni numero vale 5 minuti, quindi ' + m + ' minuti. ' + clockWords(h, m).main + '.', clockSVG(h, m, { mins: true })); } },
  { n: 'Quanto dura?', ic: '⏱️', g: () => { const h = rnd(8, 17), m = pick([0, 10, 15, 20, 30, 40]), d = pick([15, 20, 30, 45, 50, 75]), t = h * 60 + m + d, fh = Math.floor(t / 60), fm = t % 60; return mk('Inizio alle ' + h + ':' + pad2(m) + ' e dura ' + d + ' minuti. A che ora finisce?', fh + ':' + pad2(fm), [fh + ':' + pad2((fm + 15) % 60), (fh + 1) + ':' + pad2(fm)], 'Conta in avanti a salti: ' + h + ':' + pad2(m) + ' + ' + d + ' minuti = ' + fh + ':' + pad2(fm) + '. Ricorda: 60 minuti fanno un’ora.'); } },
  { n: 'Perimetro e area', ic: '📐', g: () => { const b = rnd(3, 12), hh = rnd(2, 9), ar = Math.random() < .5; const r = ar ? b * hh : 2 * (b + hh); return mk('Un rettangolo è lungo ' + b + ' cm e alto ' + hh + ' cm. Quanto misura ' + (ar ? 'la sua area' : 'il suo perimetro') + '?', r + (ar ? ' cm²' : ' cm'), [(ar ? 2 * (b + hh) : b * hh) + (ar ? ' cm²' : ' cm'), (b + hh) + (ar ? ' cm²' : ' cm')], ar ? 'Area = base × altezza = ' + b + ' × ' + hh + ' = ' + r + ' cm²: i quadretti dentro.' : 'Perimetro = il giro intorno: ' + b + ' + ' + hh + ' + ' + b + ' + ' + hh + ' = ' + r + ' cm.'); } },
  { n: 'Problemi', ic: '🧩', g: () => { const k = rnd(3, 6), n = rnd(4, 9), mm = rnd(2, n * k - 3), r = n * k - mm; return mk('Ci sono ' + k + ' scatole da ' + n + ' pastelli. Ne regali ' + mm + '. Quanti pastelli restano?', r, [n * k, r + n, r - 1], 'Prima la moltiplicazione: ' + k + ' × ' + n + ' = ' + n * k + ' pastelli. Poi la sottrazione: ' + n * k + ' − ' + mm + ' = ' + r + '.'); } },
  { n: 'Contare gli euro', ic: '🪙', g: () => { const V = [[200, '2 €'], [100, '1 €'], [50, '50 cent'], [20, '20 cent'], [10, '10 cent'], [5, '5 cent']]; const n = rnd(3, 5), cs = []; for (let k = 0; k < n; k++) cs.push(pick(V)); cs.sort((a, b) => b[0] - a[0]); const tot = cs.reduce((a, c) => a + c[0], 0); const fmt = v => (v / 100).toFixed(2).replace('.', ',') + ' €'; return mk('Quanti soldi ci sono in tutto?', fmt(tot), [fmt(tot + 10), fmt(tot - (tot > 50 ? 20 : -20))], 'Conta partendo dalla moneta più grande: ' + cs.map(c => c[1]).join(' + ') + ' = ' + fmt(tot) + '. Ricorda: 100 centesimi fanno 1 euro!', '<div class="coins">' + cs.map(c => '<span class="coin c' + c[0] + '">' + c[1].replace(' cent', '<small>cent</small>') + '</span>').join('') + '</div>'); } },
  { n: 'Il resto', ic: '🧾', g: () => { const prezzo = rnd(3, 18) * 50 + pick([0, 20, 40, 70]), paga = prezzo <= 500 ? 500 : prezzo <= 1000 ? 1000 : 2000, r = paga - prezzo; const fmt = v => (v / 100).toFixed(2).replace('.', ',') + ' €'; return mk('Compri una cosa che costa ' + fmt(prezzo) + ' e paghi con ' + (paga / 100) + ' €. Quanto resto ricevi?', fmt(r), [fmt(r + 100), fmt(Math.abs(r - 50) || 10)], 'Trucco del negoziante: parti dal prezzo e conta in avanti fino a ' + (paga / 100) + ' €: ' + fmt(prezzo) + ' + ' + fmt(r) + ' = ' + fmt(paga) + '.'); } },
  { n: 'Verso la prima media', ic: '🎒', g: null }
];
function mathLesson(i) {
  const t = MATH_TAPPE[i];
  if (!t.g) { try { return mediaQuestions().slice(0, 6).map(q => ({ q: q.q, o: q.o, a: q.a, e: q.e })); } catch (e) { return []; } }
  const out = [], seen = new Set();
  for (let k = 0; k < 30 && out.length < 6; k++) { const q = t.g(); const kk = q.q + q.o.join('|'); if (!seen.has(kk)) { seen.add(kk); out.push(q); } }
  return out;
}

/* ---------- memoria: ripasso a intervalli crescenti ---------- */
const BOX_DAYS = [0, 1, 3, 7, 14, 30];
const pState = () => store.get('path', { u: {}, srs: {} });
const pSave = s => store.set('path', s);
function srsUpdate(s, key, uid, okFirst) {
  const r = s.srs[key] || { b: 0, d: '', u: uid };
  const isNew = !r.b && okFirst;
  if (okFirst) r.b = Math.min(5, (r.b || 0) + 1); else r.b = Math.max(0, (r.b || 0) - 2);
  r.d = iso(addDays(new Date(), BOX_DAYS[r.b] || 1)); r.u = uid;
  s.srs[key] = r; return isNew;
}
const dueKeys = (s, uid) => Object.keys(s.srs).filter(k => s.srs[k].b > 0 && s.srs[k].d <= todayIso() && (!uid || s.srs[k].u === uid));

/* ---------- obiettivo del giorno ---------- */
const GOAL = { nuove: 12, ripasso: 8, minuti: 20 };
function dayGoal() {
  const s = pState(); let g = store.get('path-day', null);
  if (!g || g.d !== todayIso()) { g = { d: todayIso(), nuove: 0, rip: 0, ms: 0, ripGoal: Math.min(GOAL.ripasso, dueKeys(s).length), done: false, pausa: false }; store.set('path-day', g); }
  return g;
}
const goalReached = g => g.nuove >= GOAL.nuove && g.rip >= g.ripGoal;

/* ---------- struttura delle tappe di un'unità ---------- */
const CHUNK = 10;
function unitNodes(u) {
  const n = u.math ? MATH_TAPPE.length : Math.ceil(u.items.length / CHUNK);
  const nodes = [];
  for (let i = 0; i < n; i++) {
    nodes.push({ t: 'lez', i });
    if ((i + 1) % 3 === 0 && i < n - 1) nodes.push({ t: 'rip', i });
  }
  nodes.push({ t: 'rip', i: n - 1, last: true });
  return nodes;
}
function unitInfo(u) {
  const s = pState(), us = s.u[u.id] || { done: {}, best: {} };
  const learned = u.math ? Object.keys(us.best).filter(k => us.best[k] >= 5).length * CHUNK : u.items.filter(it => (s.srs[itemKey(u, it)] || {}).b > 0).length;
  const total = u.math ? MATH_TAPPE.length * CHUNK : u.items.length;
  return { us, learned, total, pct: Math.round(learned / Math.max(1, total) * 100) };
}
function chunkLearned(u, i) {
  const s = pState();
  if (u.math) return ((s.u[u.id] || {}).best || {})[i] >= 5 ? CHUNK : 0;
  return u.items.slice(i * CHUNK, i * CHUNK + CHUNK).filter(it => (s.srs[itemKey(u, it)] || {}).b > 0).length;
}
function nodeState(u, nodes, k) {
  const us = (pState().u[u.id] || { done: {} });
  const node = nodes[k], id = node.t + node.i;
  const done = !!us.done[id];
  const conquered = node.t === 'lez' && chunkLearned(u, node.i) >= (u.math ? CHUNK : Math.min(8, u.items.slice(node.i * CHUNK, node.i * CHUNK + CHUNK).length));
  const open = true; /* tutte le lezioni aperte da subito (scelta del genitore) */
  return { done, conquered, open, id };
}
function nextNode(u) { const nodes = unitNodes(u); for (let k = 0; k < nodes.length; k++) { const st = nodeState(u, nodes, k); if (st.open && !st.done) return k; } return nodes.length - 1; }

/* ---------- composizione di una lezione ---------- */
function buildLesson(u, node) {
  const s = pState();
  if (u.math) {
    if (node.t === 'lez') return mathLesson(node.i).map(q => Object.assign(q, { key: null }));
    const upTo = node.i; const out = [];
    for (let k = 0; k < 6; k++) { const qs = mathLesson(rnd(0, upTo)); if (qs[0]) out.push(Object.assign(qs[0], { key: null })); }
    return out;
  }
  const wrap = it => Object.assign(mixOpts(it), { q: it.q, e: it.e, k: it.k, key: itemKey(u, it), enl: it.enl, kind: it.kind, say: it.say, it: it.it });
  if (node.t === 'lez') {
    const ch = u.items.slice(node.i * CHUNK, node.i * CHUNK + CHUNK);
    const fresh = shuffle(ch.filter(it => !((s.srs[itemKey(u, it)] || {}).b > 0)));
    const known = shuffle(ch.filter(it => (s.srs[itemKey(u, it)] || {}).b > 0));
    const due = shuffle(u.items.slice(0, node.i * CHUNK).filter(it => { const r = s.srs[itemKey(u, it)]; return r && r.b > 0 && r.d <= todayIso(); }));
    /* domande aggiunte dopo in tappe già fatte: ne entrano fino a 2 nuove, così nessuna resta indietro */
    const missed = shuffle(u.items.slice(0, node.i * CHUNK).filter(it => !((s.srs[itemKey(u, it)] || {}).b > 0)));
    const pickd = missed.slice(0, 2).concat(fresh.slice(0, 5 - Math.min(2, missed.length))); if (due[0]) pickd.push(due[0]);
    known.concat(fresh).forEach(it => { if (pickd.length < 6 && !pickd.includes(it)) pickd.push(it); });
    return shuffle(pickd).map(wrap);
  }
  // ripasso: prima le nozioni in scadenza, poi quelle meno sicure delle tappe fatte
  const upto = u.items.slice(0, (node.i + 1) * CHUNK);
  const scored = upto.map(it => ({ it, r: s.srs[itemKey(u, it)] })).filter(x => x.r);
  scored.sort((a, b) => (a.r.d <= todayIso() ? 0 : 1) - (b.r.d <= todayIso() ? 0 : 1) || a.r.b - b.r.b);
  let list = scored.slice(0, 8).map(x => x.it);
  if (list.length < 6) shuffle(upto).forEach(it => { if (list.length < 8 && !list.includes(it)) list.push(it); });
  return shuffle(list).map(wrap);
}
function buildDailyReview() {
  const s = pState(), keys = dueKeys(s).sort((a, b) => s.srs[a].b - s.srs[b].b).slice(0, 8), out = [];
  keys.forEach(k => { const u = unitById(s.srs[k].u); if (!u || !u.items) return; const it = u.items.find(x => itemKey(u, x) === k); if (it) out.push(Object.assign(mixOpts(it), { q: it.q, e: it.e, k: it.k, key: k, uid: u.id, enl: it.enl, kind: it.kind, say: it.say, it: it.it })); });
  return shuffle(out);
}

/* ---------- la lezione (schermo intero) ---------- */
let LESSON = null;
function startLesson(uid, k, opts) {
  opts = opts || {};
  const u = uid ? unitById(uid) : null;
  const nodes = u ? unitNodes(u) : null, node = nodes ? nodes[k] : null;
  const qs = opts.daily ? buildDailyReview() : buildLesson(u, node);
  if (!qs.length) { openModal('<div style="font-size:50px">🌟</div><div class="big" style="font-size:26px">Tutto ripassato!</div><p style="font-weight:700">Oggi non ci sono nozioni da rafforzare. Torna domani!</p><button type="button" class="btn" id="ls-ok" data-focus>Ok</button>'); $('ls-ok').addEventListener('click', closeModal); return; }
  const col = u ? u.c : 'var(--c6)';
  LESSON = { u, k, node, qs, i: 0, queue: [], firstOk: 0, think: 0, combo: 0, gems: 0, t0: Date.now(), tq: 0, daily: !!opts.daily, col, newL: 0, rip: 0, firstAns: 0 };
  let box = $('lesson'); if (!box) { box = document.createElement('div'); box.id = 'lesson'; box.className = 'lesson'; document.body.appendChild(box); }
  box.hidden = false; document.body.classList.add('in-lesson');
  showQ();
}
function lessonBar() {
  const L = LESSON, tot = L.qs.length + L.queue.length, pct = Math.round(L.i / Math.max(1, tot) * 100);
  return '<div class="ls-top"><button type="button" class="ls-x" id="ls-x" aria-label="Esci dalla lezione">✕</button><div class="ls-prog" style="--lc:' + L.col + '"><i style="width:' + pct + '%"></i></div><div class="ls-gems">💎 <b>' + Gems.get().n + '</b></div></div>';
}
function showQ() {
  const L = LESSON, box = $('lesson');
  if (L.i >= L.qs.length) { if (L.queue.length) { L.qs = L.qs.concat(L.queue.map(q => Object.assign({}, q, { redo: true }))); L.queue = []; } else return endLesson(); }
  const q = L.qs[L.i];
  q.tries = 0; q.removed = []; q.changed = 0; q.sel = -1; q.hint = false;
  const readMs = q.kind === 'ascolta' ? Math.max(1400, Math.min(3200, 900 + String(q.say).length * 45)) : Math.max(900, Math.min(2600, 600 + String(q.q).length * 22));
  box.innerHTML = lessonBar() +
    '<div class="ls-body">' +
      '<div class="ls-tag" style="--lc:' + L.col + '">' + (q.redo ? '🔁 Riproviamo questa' : L.daily ? '💪 Rafforza i ricordi' : esc(L.u.ic + ' ' + L.u.name + (L.node.t === 'rip' ? ' · Ripasso' : ' · Tappa ' + (L.node.i + 1)))) + '</div>' +
      (q.kind === 'ascolta'
        ? '<div class="ls-q"><span>' + esc(q.q) + '</span></div><div class="pl-listen"><button type="button" class="pl-play" id="pl-play" aria-label="Ascolta di nuovo">🔊</button><button type="button" class="pl-slow" id="pl-slow" aria-label="Ascolta piano">🐢</button></div>'
        : '<div class="ls-q"><span>' + esc(q.q) + '</span>' + sayBtn(q.q + '. ' + q.o.join('; '), q.enl) + '</div>') +
      (q.viz ? '<div class="ls-viz">' + q.viz + '</div>' : '') +
      '<div class="ls-read" id="ls-read">👀 Leggi con calma…</div>' +
      '<div class="ls-opts' + (q.kind === 'ascolta' ? ' pl-pics' : '') + '" id="ls-opts">' + q.o.map((o, j) => '<button type="button" class="ls-opt" data-j="' + j + '" disabled' + (q.kind === 'ascolta' ? ' aria-label="Immagine ' + 'ABC'[j] + '"' : '') + '><span class="ls-k">' + 'ABC'[j] + '</span><span>' + esc(o) + '</span></button>').join('') + '</div>' +
    '</div>' +
    '<div class="ls-foot" id="ls-foot"><button type="button" class="btn ghost small" id="ls-hint">💡 Aiutino</button><button type="button" class="btn ls-check" id="ls-check" disabled style="--bc:' + L.col + '">Controlla</button></div>';
  $('ls-x').addEventListener('click', quitLesson);
  if (q.kind === 'ascolta') {   // il drago dice la frase in inglese: si può riascoltare, anche piano
    $('pl-play').addEventListener('click', () => Voice.sayEn(q.say));
    $('pl-slow').addEventListener('click', () => Voice.sayEn(q.say, { slow: true }));
    setTimeout(() => { if (LESSON === L && L.qs[L.i] === q) Voice.sayEn(q.say); }, 450);
  }
  const opts = [...box.querySelectorAll('.ls-opt')];
  let enabledAt = 0;
  setTimeout(() => { if (LESSON !== L || L.qs[L.i] !== q) return; enabledAt = Date.now(); q.en = enabledAt; opts.forEach(b => { if (!q.removed.includes(+b.dataset.j)) b.disabled = false; }); const r = $('ls-read'); if (r) r.textContent = '🤔 Pensaci, poi scegli e tocca «Controlla»'; }, readMs);
  opts.forEach(b => b.addEventListener('click', () => {
    if (b.disabled) return; const j = +b.dataset.j;
    if (q.sel >= 0 && q.sel !== j) q.changed++;
    q.sel = j; opts.forEach(x => x.classList.toggle('sel', x === b)); $('ls-check').disabled = false;
  }));
  $('ls-hint').addEventListener('click', () => {
    if (q.hint) return; q.hint = true;
    const wrong = q.o.map((_, j) => j).filter(j => j !== q.a && !q.removed.includes(j));
    if (wrong.length > 1) { const j = pick(wrong); q.removed.push(j); const b = opts[j]; b.disabled = true; b.classList.add('gone'); if (q.sel === j) { q.sel = -1; b.classList.remove('sel'); $('ls-check').disabled = true; } }
    $('ls-hint').disabled = true; $('ls-hint').textContent = '💡 Ne ho tolta una';
  });
  $('ls-check').addEventListener('click', () => check(q, opts));
}
function check(q, opts) {
  const L = LESSON; if (q.sel < 0) return;
  const t = Date.now() - (q.en || Date.now());
  const ok = q.sel === q.a; q.tries++;
  const foot = $('ls-foot'), first = q.tries === 1 && !q.redo;
  if (q.tries === 1 && !q.redo) {
    if (typeof progMark === 'function') { __progLast = 0; progMark(ok, L.daily ? (unitById(q.uid) || {}).prog : L.u.prog); }
    L.firstAns++;
    if (L.u && L.u.math && L.node && L.node.t === 'lez' && L.node.i <= 1 && typeof tabStat === 'function') { const mm = String(q.q).match(/(\d+) × (\d+)/); if (mm) tabStat(+mm[1], ok); }
  }
  if (ok) {
    opts.forEach(b => { b.disabled = true; }); opts[q.a].classList.add('right');
    let g = 0, notes = [];
    if (first) {
      L.firstOk++; L.combo++; L.maxCombo = Math.max(L.maxCombo || 0, L.combo); g += 2; notes.push('Giusta al primo colpo +2 💎');
      if (!q.hint && (t >= 2000 || q.changed)) { g += 1; L.think++; notes.push('🧠 Ci hai pensato +1 💎'); }
      if (L.combo > 0 && L.combo % 3 === 0) { g += 2; notes.push('🔥 Tre di fila +2 💎'); }
      gain(2, opts[q.a]);
    } else { g += 1; L.combo = 0; notes.push(q.redo ? 'Recuperata! +1 💎' : 'Ragionando ce l’hai fatta! +1 💎'); gain(1, opts[q.a]); }
    L.gems += g; Gems.add(g);
    ding(); cheer(opts[q.a]);
    if (q.key && first) {
      const s = pState(); const isNew = srsUpdate(s, q.key, L.daily ? q.uid : L.u.id, true); pSave(s);
      const dg = dayGoal(); if (isNew) { dg.nuove++; L.newL++; } if (L.daily || (L.node && L.node.t === 'rip')) { dg.rip++; L.rip++; } store.set('path-day', dg);
    } else if (!q.key && first) { const dg = dayGoal(); dg.nuove++; L.newL++; store.set('path-day', dg); }
    feedback(true, notes, q);
  } else {
    L.combo = 0; oops();
    const b = opts[q.sel]; b.classList.add('wrong'); b.disabled = true; q.removed.push(q.sel); q.sel = -1;
    if (q.key && q.tries === 1 && !q.redo) { const s = pState(); srsUpdate(s, q.key, L.daily ? q.uid : L.u.id, false); pSave(s); }
    const left = q.o.map((_, j) => j).filter(j => !q.removed.includes(j));
    if (q.tries === 1 && left.length > 1) {
      const fast = t < 1200;
      foot.innerHTML = '<div class="ls-sheet try"><b>' + (fast ? '⏳ Un po’ troppo veloce!' : '💭 Non ancora: ripensaci!') + '</b><div>' + (fast ? 'Rileggi la domanda con calma: il bonus 🧠 arriva quando ci pensi un momento.' : 'Ho tolto la risposta sbagliata. Rileggi e prova di nuovo.') + '</div></div><button type="button" class="btn ls-check" id="ls-check" disabled style="--bc:' + L.col + '">Controlla</button>';
      opts.forEach(x => { x.classList.remove('sel'); if (!q.removed.includes(+x.dataset.j)) x.disabled = false; });
      q.en = Date.now();
      $('ls-check').addEventListener('click', () => check(q, opts));
      gain(1, b);
    } else {
      opts.forEach(x => { x.disabled = true; }); opts[q.a].classList.add('right');
      if (!q.redo) L.queue.push(q);
      feedback(false, ['La rifaremo alla fine della lezione 🔁'], q);
    }
  }
}
function feedback(ok, notes, q) {
  const L = LESSON;
  $('ls-foot').innerHTML = '<div class="ls-sheet ' + (ok ? 'ok' : 'no') + '"><b>' + (ok ? pick(['Giusto! 🎉', 'Esatto! ⭐', 'Bravissima! 💪', 'Perfetto! ✨']) : 'La risposta è: ' + esc(q.o[q.a])) + '</b>' +
    (notes.length ? '<div class="ls-notes">' + notes.map(esc).join(' · ') + '</div>' : '') +
    (q.say ? '<div class="pl-said"><b>' + esc(q.say) + '</b> ' + sayBtn(q.say, [q.say]) + '<span>' + esc(q.it) + '</span></div>' : '') +
    (q.kind === 'dillo' && ok ? '<div id="pl-dt"></div>' : '') +
    (q.e ? (() => { const x = splitExpl(q); return '<div class="ls-e"><b class="ls-key">' + esc(x.k) + '</b> ' + sayBtn(x.k, q.enl) + (x.more ? '<button type="button" class="ls-why" id="ls-why" aria-expanded="false">Perché? ›</button><div class="ls-more" id="ls-more" hidden>' + esc(x.more) + ' ' + sayBtn(x.more, q.enl) + '</div>' : '') + '</div>'; })() : '') + '</div>' +
    '<button type="button" class="btn ls-check" id="ls-next" style="--bc:' + (ok ? 'var(--c4)' : 'var(--c2)') + '">Continua →</button>';
  const nb = $('ls-next'); nb.focus();
  if (q.say) setTimeout(() => { if (LESSON === L) Voice.sayEn(q.say); }, 350);   // la frase giusta, detta dal drago
  if ($('pl-dt') && typeof dilloTu === 'function') dilloTu($('pl-dt'), q.say, { noPhrase: true, onDone: () => { L.gems += 1; Gems.add(1); gain(1, $('pl-dt')); } });
  const wb = $('ls-why'); if (wb) wb.addEventListener('click', () => { const m = $('ls-more'), open = m.hidden; m.hidden = !open; wb.setAttribute('aria-expanded', open); wb.textContent = open ? 'Chiudi ‹' : 'Perché? ›'; });
  nb.addEventListener('click', () => { if (typeof Mic !== 'undefined') Mic.clear(); L.i++; showQ(); });
}
function lessonTime() { const L = LESSON; const ms = Math.min(Date.now() - L.t0, 15 * 60000); const dg = dayGoal(); dg.ms += ms; store.set('path-day', dg); L.t0 = Date.now(); return dg; }
function quitLesson() {
  const L = LESSON; if (!L) return;
  if (typeof Mic !== 'undefined') Mic.clear();
  lessonTime(); LESSON = null; $('lesson').hidden = true; document.body.classList.remove('in-lesson');
  if (typeof progAutoSave === 'function') progAutoSave();
  go('home');
}
function endLesson() {
  const L = LESSON, box = $('lesson'), n = L.firstAns || L.qs.length;
  const dg = lessonTime();
  let bonus = [];
  const perfect = L.firstOk === L.qs.filter(q => !q.redo).length && L.firstOk > 0;
  if (perfect) { Gems.add(5); L.gems += 5; bonus.push('⭐ Lezione perfetta +5 💎'); }
  let conqNow = false;
  if (L.u) {
    const s = pState(), us = s.u[L.u.id] || { done: {}, best: {} }; const id = L.node.t + L.node.i;
    const wasConq = L.node.t === 'lez' && nodeState(L.u, unitNodes(L.u), L.k).conquered;
    us.done[id] = (us.done[id] || 0) + 1;
    if (L.u.math && L.node.t === 'lez') us.best[L.node.i] = Math.max(us.best[L.node.i] || 0, L.firstOk);
    s.u[L.u.id] = us; pSave(s);
    const isConq = L.node.t === 'lez' && nodeState(L.u, unitNodes(L.u), L.k).conquered;
    if (isConq && !wasConq) { conqNow = true; Gems.add(10); L.gems += 10; bonus.push('👑 Tappa conquistata +10 💎'); }
    if (L.u.prog === 'mate') markDay('mate', box); if (L.u.prog === 'scienze') markDay('scienze', box);
  }
  gain(3, box);
  let goalTxt = '';
  if (!dg.done && goalReached(dg)) { dg.done = true; store.set('path-day', dg); const gd = store.get('goal-days', []); if (!gd.includes(todayIso())) { gd.push(todayIso()); store.set('goal-days', gd.slice(-400)); } Gems.add(15); L.gems += 15; bonus.push('🏆 Obiettivo di oggi +15 💎'); goalTxt = 'goal'; }
  if (typeof progAutoSave === 'function') progAutoSave();
  if (window.afterLessonV2) try { window.afterLessonV2(L); } catch (e) {}
  fanfare(); try { confetti(window.innerWidth / 2, window.innerHeight / 3, perfect ? 80 : 40); } catch (e) {}
  const c = dcol(), lv = levelOf(D.energy);
  box.innerHTML = '<div class="ls-end">' +
    '<div class="ls-dragon">' + dragonSVG(lv, D.color, 'bob') + '</div>' +
    '<div class="big" style="font-size:30px">' + (perfect ? 'Lezione perfetta!' : conqNow ? 'Tappa conquistata!' : 'Lezione completata!') + '</div>' +
    '<div class="ls-stats">' +
      '<div><b>' + L.firstOk + '/' + n + '</b><small>giuste al primo colpo</small></div>' +
      '<div><b>🧠 ' + L.think + '</b><small>ci hai pensato</small></div>' +
      '<div><b>💎 ' + L.gems + '</b><small>gemme guadagnate</small></div>' +
    '</div>' +
    '<div id="ls-fig" style="width:100%"></div>' + (bonus.length ? '<div class="ls-bonus">' + bonus.map(b => '<span class="pill">' + esc(b) + '</span>').join('') + '</div>' : '') +
    '<p style="font-weight:700;color:var(--ink-soft)">' + (L.think >= Math.ceil(n / 2) ? 'Hai ragionato con calma: è così che i ricordi diventano solidi! 💪' : 'Prima di rispondere, prova a pensarci qualche secondo: arriva il bonus 🧠!') + '</p>' +
    '<button type="button" class="btn" id="ls-end" style="--bc:var(--c4)">Continua</button></div>';
  if (typeof figShow === 'function') figShow($('ls-fig'), figUnlock(L.u ? L.u.id : null));
  $('ls-end').addEventListener('click', () => {
    LESSON = null; box.hidden = true; document.body.classList.remove('in-lesson'); go('home');
    if (goalTxt) setTimeout(goalParty, 400);
    else if (dg.ms >= GOAL.minuti * 60000 && !dg.pausa) { dg.pausa = true; store.set('path-day', dg); setTimeout(pauseTip, 400); }
  });
}
function goalParty() {
  const dg = dayGoal(); const due = dueKeys(pState()).length;
  openModal('<div style="font-size:60px">🏆</div><div class="big" style="font-size:28px">Obiettivo di oggi raggiunto!</div>' +
    '<p style="font-weight:700">' + dg.nuove + ' nozioni nuove e ' + dg.rip + ' ricordi rafforzati. ' + esc(D.name) + ' è fiero di te! +15 💎</p>' +
    '<p style="font-weight:700;color:var(--ink-soft)">' + (due ? 'Se vuoi, puoi ancora rafforzare ' + due + ' ricordi. Oppure fai una pausa: anche il cervello ha bisogno di riposare per ricordare meglio. 🌿' : 'Ora una bella pausa: il cervello mette in ordine i ricordi mentre riposi. 🌿') + '</p>' +
    '<div class="row center">' + (due ? '<button type="button" class="btn" id="gp-rip">💪 Rafforza</button>' : '') + '<button type="button" class="btn ghost" id="gp-ok" data-focus>Pausa</button></div>');
  $('gp-ok').addEventListener('click', closeModal);
  if ($('gp-rip')) $('gp-rip').addEventListener('click', () => { closeModal(); startLesson(null, 0, { daily: true }); });
}
function pauseTip() {
  openModal('<div style="font-size:56px">🌿</div><div class="big" style="font-size:26px">20 minuti di studio!</div><p style="font-weight:700">Bravissima. Che ne dici di una pausa movimento o di un bicchiere d’acqua? Poi, se vuoi, si continua.</p><div class="row center"><button type="button" class="btn" id="pt-move">🤸‍♀️ Pausa movimento</button><button type="button" class="btn ghost" id="pt-ok" data-focus>Ok</button></div>');
  $('pt-ok').addEventListener('click', closeModal); $('pt-move').addEventListener('click', () => { closeModal(); go('sport'); });
}

/* ---------- il percorso in Casa ---------- */
let pathSel = null;
function pathHome(el) {
  if (!el || !D) return;
  if (!store.get('gems-welcome', false)) { store.set('gems-welcome', true); Gems.add(20); }
  const units = pathUnits();
  if (!pathSel) pathSel = store.get('path-sel', 'mate');
  let u = unitById(pathSel) || units[0];
  const dg = dayGoal(), nodes = unitNodes(u), info = unitInfo(u), nk = nextNode(u), due = dueKeys(pState()).length;
  const ring = (v, max, ic, lab) => { const p = Math.min(1, v / Math.max(1, max)); return '<div class="g-ring" style="--p:' + Math.round(p * 100) + '"><div class="g-in"><span>' + ic + '</span><b>' + Math.min(v, max) + '/' + max + '</b></div><small>' + lab + '</small></div>'; };
  el.innerHTML =
    '<div class="path-head">' +
      '<div class="path-goal card"><div class="row between" style="align-items:center"><h3 style="margin:0">🎯 Obiettivo di oggi</h3>' + (dg.done ? '<span class="pill" style="background:var(--leaf-soft)">🏆 Raggiunto!</span>' : '') + '</div>' +
        '<div class="g-rings">' + ring(dg.nuove, GOAL.nuove, '🌱', 'nozioni nuove') + ring(dg.rip, dg.ripGoal || 0, '💪', dg.ripGoal ? 'ricordi rafforzati' : 'niente da ripassare') + ring(Math.round(dg.ms / 60000), GOAL.minuti, '⏱️', 'minuti') + '</div>' +
        '<div class="row" style="gap:8px;flex-wrap:wrap;margin-top:8px"><button type="button" class="btn" id="pa-go" style="--bc:' + u.c + '">▶ Continua: ' + esc(u.ic + ' ' + u.name) + '</button>' + (due ? '<button type="button" class="btn ghost" id="pa-rip">💪 Rafforza (' + due + ')</button>' : '') + '<button type="button" class="btn ghost" id="pa-shop">🛍️ Negozio · 💎 ' + Gems.get().n + '</button>' + (typeof openAlbum === 'function' ? '<button type="button" class="btn ghost" id="pa-alb">📒 Album ' + figOwned() + '/' + figTotal() + '</button><button type="button" class="btn ghost" id="pa-tes">🔍 Tesori ' + tesoriFound() + '/' + TESORI.length + '</button>' : '') + '</div></div>' +
    '</div>' +
    '<div class="path-units" id="pa-units" role="tablist" aria-label="Materie">' + units.map(x => { const inf = unitInfo(x); return '<button type="button" class="pu' + (x.id === u.id ? ' on' : '') + '" data-u="' + x.id + '" style="--uc:' + x.c + ';--us:' + x.s + '" role="tab" aria-selected="' + (x.id === u.id) + '"><span class="pu-ic">' + x.ic + '</span><span class="pu-n">' + esc(x.name) + '</span><span class="pu-b"><i style="width:' + inf.pct + '%"></i></span></button>'; }).join('') + '</div>' +
    '<div class="path-banner" style="--uc:' + u.c + ';--us:' + u.s + '"><div><b>' + esc(u.ic + ' ' + u.name) + '</b><small>' + info.learned + ' nozioni imparate su ' + info.total + '</small></div><div class="pb-pct">' + info.pct + '%</div></div>' +
    '<div class="path theme-' + (store.get('path-theme', '') || 'base') + '" style="--uc:' + u.c + ';--us:' + u.s + '">' + nodes.map((nd, k) => {
      const st = nodeState(u, nodes, k), cur = k === nk;
      const ic = !st.open ? '🔒' : nd.t === 'rip' ? (nd.last ? '🏆' : '🎁') : st.conquered ? '👑' : st.done ? '⭐' : (u.math ? MATH_TAPPE[nd.i].ic : '📘');
      const lab = nd.t === 'rip' ? (nd.last ? 'Grande ripasso' : 'Ripasso') : (u.math ? MATH_TAPPE[nd.i].n : 'Tappa ' + (nd.i + 1));
      const x = Math.round(Math.sin(k * 0.9) * 70), deco = PATH_DECO[store.get('path-theme', '') || 'base'];
      return '<div class="pn-wrap" style="transform:translateX(' + x + 'px)">' + (k % 2 ? '<span class="pn-deco" style="' + (x > 0 ? 'right' : 'left') + ':' + (x > 0 ? '-150px' : '-150px') + '" aria-hidden="true">' + deco[k % deco.length] + '</span>' : '') + (cur ? '<div class="pn-bub">Inizia!</div>' : '') +
        '<button type="button" class="pn ' + (st.open ? 'open' : 'lock') + (st.done ? ' done' : '') + (st.conquered ? ' gold' : '') + (cur ? ' cur' : '') + (nd.t === 'rip' ? ' rip' : '') + '" data-k="' + k + '" ' + (st.open ? '' : 'disabled') + ' aria-label="' + esc(lab) + (st.open ? '' : ', bloccata') + '">' + ic + '</button>' +
        '<div class="pn-lab">' + esc(lab) + (nd.t === 'lez' && !u.math ? ' · ' + chunkLearned(u, nd.i) + '/' + Math.min(CHUNK, u.items.length - nd.i * CHUNK) : '') + '</div></div>';
    }).join('') + '</div>';
  el.querySelectorAll('.pu').forEach(b => b.addEventListener('click', () => { pathSel = b.dataset.u; store.set('path-sel', pathSel); pathHome(el); const on = el.querySelector('.pu.on'); if (on && on.scrollIntoView) on.scrollIntoView({ inline: 'center', block: 'nearest' }); }));
  el.querySelectorAll('.pn.open').forEach(b => b.addEventListener('click', () => startLesson(u.id, +b.dataset.k)));
  $('pa-go').addEventListener('click', () => startLesson(u.id, nk));
  if ($('pa-rip')) $('pa-rip').addEventListener('click', () => startLesson(null, 0, { daily: true }));
  $('pa-shop').addEventListener('click', () => openShop());
  if ($('pa-alb')) $('pa-alb').addEventListener('click', () => openAlbum());
  if ($('pa-tes')) $('pa-tes').addEventListener('click', () => openTesori());
}

/* ---------- gemme in alto ---------- */
(function gemsBoot() {
  const bar = document.querySelector('.appbar-in'), ep = bar && bar.querySelector('.energy-pill'); if (!ep) return;
  const b = document.createElement('button'); b.type = 'button'; b.className = 'energy-pill gem-pill'; b.title = 'Gemme: aprono il negozio';
  b.innerHTML = '<span aria-hidden="true">💎</span><b id="bar-gems">0</b>';
  bar.insertBefore(b, ep); b.addEventListener('click', () => openShop()); Gems.paint();
})();
