/* ================= 🗺️ CAPIRE PRIMA DI RISPONDERE =================
   Ogni argomento con una spiegazione (data/spiegazioni/<materia>.json → SPIEGA) diventa un percorso in 4 tempi:
   1 🐉 il drago racconta (voce + testo) mentre la mappa concettuale si costruisce un nodo alla volta
   2 🧩 ritrova: un nodo si spegne e lei sceglie la parola giusta (ricordare invece di rileggere)
   3 ❓ le domande di sempre: ogni risposta giusta accende il suo nodo
   4 🗣️ lo racconto io: guardando la mappa lo spiega a voce e si riascolta (la registrazione non si salva)
   La prima volta si parte sempre dal racconto; dopo è a scelta (🗺️ accanto all'argomento).
   Chiave: materia:argomento; per la matematica materia:numero della tappa. */
const spKeyOf = (u, nd) => !u || !nd ? null : nd.t === 'arg' ? (u.topics[nd.i].sk || u.id + ':' + u.topics[nd.i].id) : (u.math && nd.t === 'lez') ? u.id + ':' + nd.i : null;
const spData = key => { if (!key || typeof SPIEGA === 'undefined') return null; const i = key.indexOf(':'); return (SPIEGA[key.slice(0, i)] || {})[key.slice(i + 1)] || null; };
const spState = () => { const s = store.get('spiega', null) || {}; s.visto = s.visto || {}; s.acceso = s.acceso || {}; return s; };
const spSave = s => store.set('spiega', s);
function spLit(key) { return new Set(spState().acceso[key] || []); }
function spAddLit(key, ids) { const s = spState(), cur = new Set(s.acceso[key] || []); ids.forEach(i => cur.add(i)); s.acceso[key] = [...cur]; spSave(s); return cur; }
/* titolo dell'argomento per una chiave */
function spTitle(key) {
  const i = key.indexOf(':'), u = unitById(key.slice(0, i)), t = key.slice(i + 1); if (!u) return { u: null, n: key, ic: '' };
  if (u.math) { const m = MATH_TAPPE[+t]; return { u, n: m ? m.n : t, ic: m ? m.ic : '🔢' }; }
  const tp = (u.topics || []).find(x => (x.sk || u.id + ':' + x.id) === key); return { u, n: tp ? tp.n : t, ic: tp ? tp.ic : '' };
}
/* posizione della lezione (indice del nodo) di una chiave */
function spNodeIndex(key) { const { u } = spTitle(key); if (!u) return -1; const nodes = unitNodes(u); return nodes.findIndex(nd => spKeyOf(u, nd) === key); }

/* ---------- disegno della mappa (SVG) ---------- */
function spWrap(t, max) { const w = String(t).split(' '), out = []; let cur = ''; w.forEach(x => { if ((cur + ' ' + x).trim().length > max && cur) { out.push(cur); cur = x; } else cur = (cur + ' ' + x).trim(); }); if (cur) out.push(cur); return out.slice(0, 3); }
const SP_COL = [['#e3f1ff', '#3fa9f5', '#24527a'], ['#fff4d6', '#e0b100', '#6b5a1c'], ['#f1e8ff', '#a879ff', '#4f3d75'], ['#e9f8ec', '#58c46b', '#2f6b3b'], ['#fde9e9', '#ff6b6b', '#7a3b3b'], ['#e6f7f6', '#2bb3a8', '#1f5f5a']];
function spLayout(d) {
  const N = d.nodi.length, P = [];
  if (d.tipo === 'ciclo') { const H6 = [[400, 62], [680, 200], [680, 400], [400, 538], [120, 400], [120, 200]], H5 = [[400, 62], [675, 250], [560, 520], [240, 520], [125, 250]], H4 = [[400, 62], [680, 300], [400, 538], [120, 300]];
    (N === 6 ? H6 : N === 5 ? H5 : H4).slice(0, N).forEach(p => P.push(p)); }
  else { const top = Math.ceil(N / 2), bot = N - top, row = (n, y) => { const xs = n === 3 ? [135, 400, 665] : n === 2 ? [215, 585] : n === 1 ? [400] : [110, 300, 500, 690]; xs.slice(0, n).forEach(x => P.push([x, y])); }; row(top, 84); row(bot, 516); }
  return P;
}
/* linea del tempo: gli avvenimenti («anno») sopra la freccia, i periodi («periodo»: [inizio, fine]) come fasce sotto; anni negativi = a.C. */
function spLineSVG(d, opts) {
  const vis = n => !opts.shown || opts.shown.has(n.id);
  const ys = []; d.nodi.forEach(n => { if (n.anno != null) ys.push(n.anno); if (n.periodo) ys.push(...n.periodo); });
  const y0 = Math.min(...ys), y1 = Math.max(...ys), X = y => 70 + (y - y0) / Math.max(1, y1 - y0) * 660, AX = 300, W = 190, H = 92;
  const yr = y => (y < 0 ? -y + ' a.C.' : y + ' d.C.');
  const box = (n, i, cx, cy) => { const c = SP_COL[i % SP_COL.length], hid = opts.hide === n.id, lit = opts.lit && opts.lit.has(n.id);
    const name = hid ? ['❓ …'] : spWrap((n.ic ? n.ic + ' ' : '') + n.n, 17), sub = hid ? ['scegli la parola giusta'] : spWrap(n.sotto || '', 26), t0 = cy - (name.length + sub.length - 1) * 9.5 + 4;
    return '<g class="sp-node' + (hid ? ' hid' : '') + (lit ? ' lit' : '') + (opts.focus === n.id ? ' foc' : '') + '"><rect x="' + (cx - W / 2) + '" y="' + (cy - H / 2) + '" width="' + W + '" height="' + H + '" rx="18" fill="' + (hid ? '#f2f2f2' : c[0]) + '" stroke="' + (hid ? '#9aa3b2' : c[1]) + '"/>' +
      name.map((t, k) => '<text class="nn" x="' + cx + '" y="' + (t0 + k * 21).toFixed(0) + '" fill="#2b2f3a">' + esc(t) + '</text>').join('') +
      sub.map((t, k) => '<text class="ns" x="' + cx + '" y="' + (t0 + name.length * 21 + k * 16 - 2).toFixed(0) + '" fill="' + (hid ? '#5b6475' : c[2]) + '">' + esc(t) + '</text>').join('') +
      (lit ? '<text class="nl" x="' + (cx + W / 2 - 8) + '" y="' + (cy - H / 2 + 6) + '">💡</text>' : '') + '</g>'; };
  let bands = '', marks = '', boxes = '', lastX = -999, row = 0; const ticks = new Set(), tlab = {};
  d.nodi.forEach((n, i) => {
    if (!vis(n)) return;
    const c = SP_COL[i % SP_COL.length];
    if (n.periodo) {
      const a = X(n.periodo[0]), b = X(n.periodo[1]), cx = Math.max(W / 2 + 6, Math.min(800 - W / 2 - 6, (a + b) / 2)), cy = row++ % 2 ? 515 : 410;
      bands += '<rect class="sp-band" x="' + a.toFixed(0) + '" y="' + (AX - 13) + '" width="' + (b - a).toFixed(0) + '" height="26" rx="6" fill="' + c[1] + '" opacity=".75"/>';
      marks += '<path class="sp-conn" d="M' + ((a + b) / 2).toFixed(0) + ' ' + (AX + 13) + ' L' + cx.toFixed(0) + ' ' + (cy - H / 2) + '"/>';
      ticks.add(n.periodo[0]); ticks.add(n.periodo[1]); boxes += box(n, i, cx, cy);
    } else if (n.anno != null) {
      let cx = Math.max(W / 2 + 6, Math.min(800 - W / 2 - 6, X(n.anno))); if (cx - lastX < W + 8) cx = Math.min(800 - W / 2 - 6, lastX + W + 8); lastX = cx;
      marks += '<path class="sp-conn" d="M' + X(n.anno).toFixed(0) + ' ' + (AX - 16) + ' L' + cx.toFixed(0) + ' ' + (190 + H / 2) + '"/><circle cx="' + X(n.anno).toFixed(0) + '" cy="' + AX + '" r="9" fill="' + c[1] + '" stroke="#fff" stroke-width="3"/>';
      ticks.add(n.anno); if (n.tacca) tlab[n.anno] = n.tacca; boxes += box(n, i, cx, 190);
    }
  });
  const tk = [...ticks].sort((a, b) => a - b).map((y, k) => '<text class="sp-yr" x="' + X(y).toFixed(0) + '" y="' + (AX + (k % 2 ? 50 : 34)) + '">' + esc(tlab[y] || yr(y)) + '</text>').join('');
  return '<svg class="sp-map" viewBox="0 0 800 600" role="img" aria-label="Linea del tempo: ' + esc(d.centro.n) + '"><defs><marker id="sp-ar2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="#2b2f3a"/></marker></defs>' +
    '<text class="sp-lt" x="400" y="52">' + esc((d.centro.ic ? d.centro.ic + ' ' : '') + d.centro.n) + '</text>' + (d.centro.sotto ? '<text class="sp-ls" x="400" y="80">' + esc(d.centro.sotto) + '</text>' : '') +
    '<path d="M30 ' + AX + ' L780 ' + AX + '" stroke="#2b2f3a" stroke-width="4" marker-end="url(#sp-ar2)"/>' + bands + marks + tk + boxes + '</svg>';
}
/* scala delle grandezze («scala»): i nodi in fila dal più piccolo al più grande, un riquadro sopra e uno sotto la freccia;
   «tacca» è la misura scritta sulla freccia (per esempio 10⁻¹⁰ m) */
function spScalaSVG(d, opts) {
  const vis = n => !opts.shown || opts.shown.has(n.id), N = d.nodi.length, AX = 300, W = 200, H = 92;
  const X = i => 80 + i * 640 / Math.max(1, N - 1);
  let marks = '', boxes = '', tk = '';
  d.nodi.forEach((n, i) => {
    if (!vis(n)) return;
    const c = SP_COL[i % SP_COL.length], hid = opts.hide === n.id, lit = opts.lit && opts.lit.has(n.id), up = i % 2 === 0;
    const x = X(i), cx = Math.max(W / 2 + 6, Math.min(800 - W / 2 - 6, x)), cy = up ? 150 : 450;
    marks += '<path class="sp-conn" d="M' + x.toFixed(0) + ' ' + (up ? AX - 12 : AX + 12) + ' L' + cx.toFixed(0) + ' ' + (up ? cy + H / 2 : cy - H / 2) + '"/><circle cx="' + x.toFixed(0) + '" cy="' + AX + '" r="9" fill="' + c[1] + '" stroke="#fff" stroke-width="3"/>';
    if (n.tacca) tk += '<text class="sp-yr" x="' + x.toFixed(0) + '" y="' + (up ? AX + 34 : AX - 22) + '">' + esc(n.tacca) + '</text>';
    const name = hid ? ['❓ …'] : spWrap((n.ic ? n.ic + ' ' : '') + n.n, 18), sub = hid ? ['scegli la parola giusta'] : spWrap(n.sotto || '', 27), t0 = cy - (name.length + sub.length - 1) * 9.5 + 4;
    boxes += '<g class="sp-node' + (hid ? ' hid' : '') + (lit ? ' lit' : '') + (opts.focus === n.id ? ' foc' : '') + '" data-n="' + esc(n.id) + '"><rect x="' + (cx - W / 2) + '" y="' + (cy - H / 2) + '" width="' + W + '" height="' + H + '" rx="18" fill="' + (hid ? '#f2f2f2' : c[0]) + '" stroke="' + (hid ? '#9aa3b2' : c[1]) + '"/>' +
      name.map((t, k) => '<text class="nn" x="' + cx + '" y="' + (t0 + k * 21).toFixed(0) + '" fill="' + (hid ? '#5b6475' : '#2b2f3a') + '">' + esc(t) + '</text>').join('') +
      sub.map((t, k) => '<text class="ns" x="' + cx + '" y="' + (t0 + name.length * 21 + k * 16 - 2).toFixed(0) + '" fill="' + (hid ? '#5b6475' : c[2]) + '">' + esc(t) + '</text>').join('') +
      (lit ? '<text class="nl" x="' + (cx + W / 2 - 8) + '" y="' + (cy - H / 2 + 6) + '">💡</text>' : '') + '</g>';
  });
  return '<svg class="sp-map" viewBox="0 0 800 600" role="img" aria-label="Scala delle grandezze: ' + esc(d.centro.n) + '"><defs><marker id="sp-ar3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="#2b2f3a"/></marker></defs>' +
    '<text class="sp-lt" x="400" y="44">' + esc((d.centro.ic ? d.centro.ic + ' ' : '') + d.centro.n) + '</text>' + (d.centro.sotto ? '<text class="sp-ls" x="400" y="70">' + esc(d.centro.sotto) + '</text>' : '') +
    '<path d="M30 ' + AX + ' L780 ' + AX + '" stroke="#2b2f3a" stroke-width="4" marker-end="url(#sp-ar3)"/>' + marks + tk + boxes +
    '<text class="sp-ls" x="40" y="580" style="text-anchor:start">◀ più piccolo</text><text class="sp-ls" x="760" y="580" style="text-anchor:end">più grande ▶</text></svg>';
}
/* opts: shown (Set di id visibili, null = tutti), lit (Set accesi), hide (id con ❓), focus (id evidenziato) */
function spMapSVG(d, opts) {
  opts = opts || {};
  if (d.tipo === 'linea') return spLineSVG(d, opts);
  if (d.tipo === 'scala') return spScalaSVG(d, opts);
  const P = spLayout(d), C = [400, 300], cyc = d.tipo === 'ciclo', W = cyc ? 210 : 228, H = 92;
  const vis = n => !opts.shown || opts.shown.has(n.id);
  const edge = (a, b, wa, ha, wb, hb) => { // segmento tra i bordi di due rettangoli
    const cut = (p, q, w, h) => { const dx = q[0] - p[0], dy = q[1] - p[1], t = Math.min(w / 2 / Math.abs(dx || 1e-6), h / 2 / Math.abs(dy || 1e-6)); return [p[0] + dx * t, p[1] + dy * t]; };
    const m = cyc ? 4 : 14; return [cut(a, b, wa + m, ha + m), cut(b, a, wb + m, hb + m)];
  };
  let lines = '', labels = '', boxes = '';
  d.nodi.forEach((n, i) => {
    if (!vis(n)) return;
    const p = P[i]; let a, b, word = n.da;
    if (cyc) { const j = (i - 1 + d.nodi.length) % d.nodi.length; if (!vis(d.nodi[j])) return; [a, b] = edge(P[j], p, W, H, W, H); if (i === 0) word = 'e il giro ricomincia'; }
    else[a, b] = edge(C, p, 250, 92, W, H);
    lines += '<path d="M' + a[0].toFixed(0) + ' ' + a[1].toFixed(0) + ' L' + b[0].toFixed(0) + ' ' + b[1].toFixed(0) + '" />';
    const f = cyc ? 0.5 : Math.abs(p[0] - 400) < 10 ? 0.45 : 0.62, w = Math.min(230, String(word).length * 7.6 + 18);
    let lx = a[0] + (b[0] - a[0]) * f, ly = a[1] + (b[1] - a[1]) * f;
    if (cyc) { const vx = lx - 400, vy = ly - 300, L0 = Math.hypot(vx, vy) || 1, vertical = Math.abs(b[0] - a[0]) < 8; if (vertical) lx += (vx > 0 ? 1 : -1) * (w / 2 + 10); else { lx += vx / L0 * 30; ly += vy / L0 * 30; } }
    if (word) labels += '<g class="sp-lab"><rect x="' + (lx - w / 2).toFixed(0) + '" y="' + (ly - 13).toFixed(0) + '" width="' + w.toFixed(0) + '" height="26" rx="13"/><text x="' + lx.toFixed(0) + '" y="' + (ly + 5).toFixed(0) + '">' + esc(word) + '</text></g>';
  });
  d.nodi.forEach((n, i) => {
    if (!vis(n)) return;
    const p = P[i], c = SP_COL[i % SP_COL.length], hid = opts.hide === n.id, lit = opts.lit && opts.lit.has(n.id);
    const name = hid ? ['❓ …'] : spWrap((n.ic ? n.ic + ' ' : '') + n.n, 20), sub = hid ? ['scegli la parola giusta'] : spWrap(n.sotto || '', 31);
    const y0 = p[1] - (name.length + sub.length - 1) * 9.5 + 4;
    boxes += '<g class="sp-node' + (hid ? ' hid' : '') + (lit ? ' lit' : '') + (opts.focus === n.id ? ' foc' : '') + '" data-n="' + esc(n.id) + '">' +
      '<rect x="' + (p[0] - W / 2) + '" y="' + (p[1] - H / 2) + '" width="' + W + '" height="' + H + '" rx="18" fill="' + (hid ? '#f2f2f2' : c[0]) + '" stroke="' + (hid ? '#9aa3b2' : c[1]) + '"/>' +
      name.map((t, k) => '<text class="nn" x="' + p[0] + '" y="' + (y0 + k * 21).toFixed(0) + '" fill="' + (hid ? '#5b6475' : '#2b2f3a') + '">' + esc(t) + '</text>').join('') +
      sub.map((t, k) => '<text class="ns" x="' + p[0] + '" y="' + (y0 + name.length * 21 + k * 16 - 2).toFixed(0) + '" fill="' + (hid ? '#5b6475' : c[2]) + '">' + esc(t) + '</text>').join('') +
      (lit ? '<text class="nl" x="' + (p[0] + W / 2 - 8) + '" y="' + (p[1] - H / 2 + 6) + '">💡</text>' : '') + '</g>';
  });
  const cl = spWrap((d.centro.ic ? d.centro.ic + ' ' : '') + d.centro.n, 18);
  const center = '<g class="sp-center"><rect x="282" y="252" width="236" height="96" rx="48"/>' + cl.map((t, k) => '<text class="cn" x="400" y="' + (294 - (cl.length - 1) * 12 + k * 24) + '">' + esc(t) + '</text>').join('') + (d.centro.sotto ? '<text class="cs" x="400" y="' + (318 + (cl.length - 1) * 10) + '">' + esc(d.centro.sotto) + '</text>' : '') + '</g>';
  return '<svg class="sp-map" viewBox="0 0 800 600" role="img" aria-label="Mappa concettuale: ' + esc(d.centro.n) + '"><defs><marker id="sp-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#9aa3b2"/></marker></defs>' +
    '<g class="sp-lines" marker-end="url(#sp-ar)">' + lines + '</g>' + center + labels + boxes + '</svg>';
}

/* ---------- la finestra della spiegazione ---------- */
let SP = null;
function spMute() { return !!store.get('spiega-muto', false); }
function spSay(t) { if (spMute()) return; try { Voice.say(t); } catch (e) {} }
const spVoice = sl => sl.v || sl.t;  /* «v»: come leggerlo a voce (per esempio «tre quarti» invece di 3/4) */
function spOpen(key, ret) {
  const d = spData(key); if (!d) return;
  const T = spTitle(key);
  const tp = T.u && T.u.topics ? T.u.topics.find(x => key === (x.sk || T.u.id + ':' + x.id)) : null;
  SP = { key, d, ret, T, ph: 'racconto', i: 0, j: 0, shown: new Set(), lit: spLit(key), solo: !!(d.solo || (tp && tp.solo)) };
  let ov = $('sp-ov'); if (!ov) { ov = document.createElement('div'); ov.id = 'sp-ov'; ov.className = 'sp-ov'; document.body.appendChild(ov); }
  ov.hidden = false; document.body.classList.add('in-lesson');
  spPaint();
}
function spClose() { try { speechSynthesis.cancel(); } catch (e) {} try { Mic.clear(); } catch (e) {} const ov = $('sp-ov'); if (ov) ov.hidden = true; document.body.classList.remove('in-lesson'); SP = null; }
function spSteps(on, solo) { if (solo) return '<div class="sp-steps">' + [['racconto', '1 Racconto'], ['insieme', '2 Ne parliamo insieme']].map(s => '<span class="' + (s[0] === on ? 'on' : '') + '">' + s[1] + '</span>').join('') + '</div>'; return '<div class="sp-steps">' + [['racconto', '1 Racconto'], ['ritrova', '2 Mappa'], ['domande', '3 Domande'], ['io', '4 Lo racconto io']].map(s => '<span class="' + (s[0] === on ? 'on' : '') + '">' + s[1] + '</span>').join('') + '</div>'; }
function spCta(d) { const p = d.disegno && typeof dsProj === 'function' ? dsProj(d.disegno) : null; return (d.cartina ? '<button type="button" class="sp-cta" data-ct="' + esc(d.cartina) + '">🗺️ Guarda dove: la cartina interattiva <span style="margin-left:auto">→</span></button>' : '') + (p ? '<button type="button" class="sp-cta" data-ds="' + esc(p.id) + '">🎨 Disegna tu: ' + esc(p.n) + ' <span style="margin-left:auto">→</span></button>' : ''); }
function spLinks(d) {
  const L = (d.collegamenti || []).map(r => { const t = spTitle(r); return t.u ? '<button type="button" class="sp-link" data-go="' + esc(r) + '">' + esc(t.u.ic + ' ' + t.u.name + ' · ' + (t.ic ? t.ic + ' ' : '') + t.n) + ' <span>→</span></button>' : ''; }).join('');
  return L ? '<div class="sp-card"><h3>🔗 Collegamenti</h3><p class="sp-mini">Argomenti collegati, anche da altre materie.</p>' + L + '</div>' : '';
}
function spPaint() {
  const S = SP, d = S.d, ov = $('sp-ov'); if (!S) return;
  let side = '', map = '', step = S.ph;
  if (S.ph === 'racconto') {
    const sl = d.racconto[S.i]; (sl.nodi || []).forEach(n => S.shown.add(n));
    const last = S.i === d.racconto.length - 1;
    map = spMapSVG(d, { shown: S.shown, focus: (sl.nodi || [])[0], lit: S.lit });
    side = '<div class="sp-card"><h3>🎙️ Il racconto · ' + (S.i + 1) + ' di ' + d.racconto.length + '</h3><p class="sp-text">' + esc(sl.t) + '</p>' +
      '<div class="sp-row"><button type="button" class="btn ghost small" id="sp-say">🔊 Ascolta</button><button type="button" class="btn ghost small" id="sp-mute">' + (spMute() ? '🔇 Voce spenta' : '🔈 Voce accesa') + '</button></div>' +
      '<div class="sp-row">' + (S.i ? '<button type="button" class="btn ghost" id="sp-prev">◀</button>' : '') + '<button type="button" class="btn" id="sp-next" data-focus>' + (last ? 'Ora tocca a te ▶' : 'Avanti ▶') + '</button></div></div>';
  } else if (S.ph === 'ritrova') {
    const r = d.ritrova[S.j], n = d.nodi.find(x => x.id === r.nodo);
    map = spMapSVG(d, { hide: r.nodo, lit: S.lit });
    const phrase = d.tipo === 'ciclo' || d.tipo === 'linea' || d.tipo === 'scala' ? (n.da || '') : d.centro.n + ' · ' + (n.da || '');
    side = '<div class="sp-card"><h3>🧩 Ritrova la parola che manca · ' + (S.j + 1) + ' di ' + d.ritrova.length + '</h3><p class="sp-text">' + esc(phrase) + ' <b>…?</b></p><div class="sp-choices">' +
      shuffle(r.scelte.map((t, k) => ({ t, ok: k === 0 }))).map(c => '<button type="button" class="btn ghost sp-ch" data-ok="' + (c.ok ? 1 : 0) + '">' + esc(c.t) + '</button>').join('') + '</div><p class="sp-mini" id="sp-fb">Ripensa al racconto: che cosa c’era qui?</p></div>';
  } else if (S.ph === 'pronta' && S.solo) {
    step = 'insieme';
    map = spMapSVG(d, { lit: S.lit });
    side = '<div class="sp-card"><h3>👀 Da guardare insieme</h3><p class="sp-text">' + esc(d.insieme || 'Questo argomento non ha domande. Guarda la mappa con mamma o papà e raccontatevi che cosa ne pensate.') + '</p>' +
      (d.chiedi && d.chiedi.length ? '<p class="sp-mini">Per parlarne insieme:</p><ul class="sp-chiedi">' + d.chiedi.map(q => '<li>' + esc(q) + '</li>').join('') + '</ul>' : '') +
      '<div class="sp-row"><button type="button" class="btn ghost" id="sp-rid">↺ Riascolta</button><button type="button" class="btn" id="sp-end" data-focus>Fine</button></div></div>' + spCta(d) + spLinks(d);
  } else if (S.ph === 'pronta') {
    step = 'domande';
    map = spMapSVG(d, { lit: S.lit });
    side = '<div class="sp-card"><h3>🌟 Bravissima!</h3><p class="sp-text">Ora qualche domanda per fissare i ricordi. Ogni risposta giusta accende un pezzo della mappa 💡.</p><button type="button" class="btn" id="sp-go" data-focus>▶ Alle domande</button></div>' + spCta(d) + spLinks(d);
  } else if (S.ph === 'fine') {
    step = 'io';
    map = spMapSVG(d, { lit: S.lit });
    const nw = (S.nuovi || []).map(id => (d.nodi.find(x => x.id === id) || {}).n).filter(Boolean);
    side = '<div class="sp-card"><h3>💡 La tua mappa si accende</h3><p class="sp-text">' + (nw.length ? 'Si ' + (nw.length === 1 ? 'è acceso: ' : 'sono accesi: ') + esc(nw.join(', ')) + '.' : 'Ogni volta che rispondi giusto, la mappa si accende un po’ di più.') + '</p></div>' +
      '<div class="sp-card" id="sp-rec"></div>' +
      '<div class="sp-row"><button type="button" class="btn ghost" id="sp-mia">✏️ Fai la tua mappa</button><button type="button" class="btn" id="sp-end" data-focus>Fine</button></div>' + spCta(d) + spLinks(d);
  }
  ov.innerHTML = '<div class="sp-top"><button type="button" class="ls-x" id="sp-x" aria-label="Chiudi">✕</button><b class="sp-ttl">' + esc((S.T.u ? S.T.u.ic + ' ' + S.T.u.name + ' · ' : '') + (S.T.ic ? S.T.ic + ' ' : '') + S.T.n) + '</b>' + (d.cartina ? '<button type="button" class="btn small ghost" id="sp-ct">🗺️ Cartina</button>' : '') + spSteps(step, S.solo) + '</div>' +
    '<div class="sp-body"><div class="sp-mapbox">' + map + '</div><div class="sp-side">' + side + '</div></div>';
  $('sp-x').addEventListener('click', spClose);
  if ($('sp-ct')) $('sp-ct').addEventListener('click', () => ctOpen(d.cartina));
  ov.querySelectorAll('[data-ct]').forEach(b => b.addEventListener('click', () => ctOpen(b.dataset.ct)));
  ov.querySelectorAll('[data-ds]').forEach(b => b.addEventListener('click', () => { const id = b.dataset.ds; const st = spState(); if (SP && !st.visto[SP.key]) { st.visto[SP.key] = todayIso(); spSave(st); } spClose(); go('disegno'); dsEditor({ pid: id }); }));
  ov.querySelectorAll('.sp-link').forEach(b => b.addEventListener('click', () => { const r = b.dataset.go; spClose(); spGoTopic(r); }));
  if (S.ph === 'racconto') {
    const sl = d.racconto[S.i];
    $('sp-say').addEventListener('click', () => { try { Voice.say(spVoice(sl)); } catch (e) {} });
    $('sp-mute').addEventListener('click', () => { store.set('spiega-muto', !spMute()); if (spMute()) try { speechSynthesis.cancel(); } catch (e) {} spPaint(); });
    if ($('sp-prev')) $('sp-prev').addEventListener('click', () => { S.i--; spPaint(); spSay(spVoice(d.racconto[S.i])); });
    $('sp-next').addEventListener('click', () => {
      if (S.i < d.racconto.length - 1) { S.i++; spPaint(); spSay(spVoice(d.racconto[S.i])); }
      else { try { speechSynthesis.cancel(); } catch (e) {} d.nodi.forEach(n => S.shown.add(n.id)); S.ph = d.ritrova && d.ritrova.length ? 'ritrova' : 'pronta'; S.j = 0; spPaint(); }
    });
  } else if (S.ph === 'ritrova') {
    const r = d.ritrova[S.j];
    ov.querySelectorAll('.sp-ch').forEach(b => b.addEventListener('click', () => {
      if (b.dataset.ok === '1') {
        b.classList.add('right'); try { ding(); cheer(b); } catch (e) {}
        S.lit = spAddLit(S.key, [r.nodo]);
        ov.querySelectorAll('.sp-ch').forEach(x => x.disabled = true);
        setTimeout(() => { S.j++; if (S.j >= d.ritrova.length) S.ph = 'pronta'; spPaint(); }, 900);
      } else { b.classList.add('wrong'); b.disabled = true; try { oops(); } catch (e) {} $('sp-fb').textContent = 'Non ancora: ripensa al racconto e riprova.'; }
    }));
  } else if (S.ph === 'pronta' && S.solo) {
    const st = spState(); st.visto[S.key] = todayIso(); spSave(st);
    $('sp-end').addEventListener('click', spClose);
    $('sp-rid').addEventListener('click', () => { S.ph = 'racconto'; S.i = 0; S.shown = new Set(); spPaint(); spSay(spVoice(d.racconto[0])); });
  } else if (S.ph === 'pronta') {
    $('sp-go').addEventListener('click', () => { const ret = S.ret, key = S.key; const st = spState(); st.visto[key] = todayIso(); spSave(st); spClose(); startLesson(ret.uid, ret.k, { spOk: true }); });
  } else if (S.ph === 'fine') {
    spRecPanel($('sp-rec'));
    $('sp-end').addEventListener('click', spClose);
    $('sp-mia').addEventListener('click', () => { const d0 = S.d; spClose(); mpNew(d0.centro.n, d0.nodi.map(n => n.n)); });
  }
}
/* 🗣️ lo racconto io: registra e riascolta (la registrazione resta solo in memoria e si cancella chiudendo) */
function spRecPanel(el) {
  if (!el) return;
  const can = typeof Mic !== 'undefined' && Mic.canRecord();
  let st = 'idle';
  const paint = () => {
    el.innerHTML = '<h3>🗣️ Lo racconto io</h3><p class="sp-mini">Guarda la mappa e racconta l’argomento con parole tue, come se fossi la maestra.' + (can ? '' : ' Raccontalo a mamma o papà!') + '</p>' +
      (can ? '<div class="sp-row">' + (st === 'rec' ? '<button type="button" class="btn" id="sr-stop">⏹️ Ho finito</button>' : '<button type="button" class="btn ghost" id="sr-go">⏺️ ' + (st === 'have' ? 'Rifai' : 'Registra') + '</button>') + (st === 'have' ? '<button type="button" class="btn ghost" id="sr-play">▶️ Riascoltati</button>' : '') + '</div>' : '');
    if ($('sr-go')) $('sr-go').addEventListener('click', async () => { st = 'rec'; paint(); try { await Mic.start(120000); st = Mic.blobUrl() ? 'have' : 'idle'; } catch (e) { st = 'idle'; floatText(el, 'Microfono non disponibile'); } paint(); });
    if ($('sr-stop')) $('sr-stop').addEventListener('click', () => Mic.stop());
    if ($('sr-play')) $('sr-play').addEventListener('click', () => Mic.play());
  };
  paint();
}
/* dopo le domande: la mappa si accende con le risposte giuste */
function spDopo(L) {
  const d = spData(L.spKey); if (!d) return;
  const ids = new Set();
  if (d.domande) (L.spOk || []).forEach(k => { const q = k.slice(k.indexOf(':') + 1), n = d.domande[q]; if (n) ids.add(n); });
  if (d.tutte && L.firstOk > 0) ids.add(d.tutte);
  const before = spLit(L.spKey), lit = spAddLit(L.spKey, [...ids]);
  spOpen(L.spKey, { uid: L.u.id, k: L.k });
  SP.ph = 'fine'; SP.lit = lit; SP.nuovi = [...ids].filter(i => !before.has(i)); spPaint();
}
/* apre un argomento collegato: la sua materia, con la riga evidenziata */
function spGoTopic(ref) {
  const { u } = spTitle(ref); if (!u) return;
  openMateria(u.id);
  const k = spNodeIndex(ref);
  setTimeout(() => { const b = document.querySelector('#m-list .m-row[data-k="' + k + '"]'); if (b) { b.classList.add('m-flash'); b.scrollIntoView({ block: 'center', behavior: 'smooth' }); } }, 120);
}

/* ---------- agganci alle lezioni ---------- */
(function spHooks() {
  const st0 = startLesson;
  startLesson = function (uid, k, opts) {
    opts = opts || {};
    const u = uid ? unitById(uid) : null, nodes = u ? unitNodes(u) : null, key = spKeyOf(u, nodes ? nodes[k] : null);
    const tp = u && nodes ? topicOf(u, nodes[k]) : null;
    if (key && spData(key) && tp && tp.solo) return spOpen(key, { uid, k });
    if (key && spData(key) && !opts.spOk && !opts.mix && !opts.daily && !spState().visto[key]) return spOpen(key, { uid, k });
    st0(uid, k, opts);
    if (LESSON && key && spData(key) && LESSON.u === u && LESSON.k === k) { LESSON.spKey = key; LESSON.spOk = []; }
  };
  const su0 = srsUpdate;
  srsUpdate = function (s, key, uid, okFirst) { const r = su0.apply(this, arguments); try { if (okFirst && LESSON && LESSON.spKey && key) LESSON.spOk.push(key); } catch (e) {} return r; };
})();

/* ---------- nella pagina della materia: 🗺️ spiegazione accanto all'argomento + mappa della materia ---------- */
(function spMateria() {
  const m0 = PAGES.materia;
  PAGES.materia = el => {
    m0(el);
    const u = unitById(pathSel || store.get('path-sel', '')); if (!u) return;
    const nodes = unitNodes(u);
    el.querySelectorAll('#m-list .m-row').forEach(b => {
      const key = spKeyOf(u, nodes[+b.dataset.k]); if (!key || !spData(key)) return;
      const w = document.createElement('div'); w.className = 'm-pair'; b.parentNode.insertBefore(w, b); w.appendChild(b);
      const s = document.createElement('button'); s.type = 'button'; s.className = 'm-sp'; s.innerHTML = '🗺️<small>Spiegazione</small>'; s.setAttribute('aria-label', 'Spiegazione con la mappa');
      s.addEventListener('click', () => spOpen(key, { uid: u.id, k: +b.dataset.k })); w.appendChild(s);
    });
    /* 🗺️ mappa della materia: gli argomenti come isole */
    const list = $('m-list'); if (!list) return;
    const vista = store.get('m-vista', 'mappa');
    const sw = document.createElement('div'); sw.className = 'm-vista';
    sw.innerHTML = '<button type="button" data-v="mappa">🗺️ Mappa della materia</button><button type="button" data-v="elenco">📋 Elenco</button>';
    list.parentNode.insertBefore(sw, list);
    const isl = document.createElement('div'); isl.className = 'isl-sea'; isl.id = 'm-isole';
    isl.innerHTML = nodes.map((nd, k) => {
      if (nd.t === 'rip' && !nd.last) return '';
      const st = nodeState(u, nodes, k), tp = nd.t === 'arg' ? u.topics[nd.i] : null, key = spKeyOf(u, nd);
      const started = tp ? topicLearned(u, tp) > 0 : st.done;
      const name = tp ? tp.n : nd.t === 'rip' ? 'Ripasso di tutta la materia' : u.math ? MATH_TAPPE[nd.i].n : 'Lezione ' + (nd.i + 1);
      const ic = tp ? tp.ic : nd.t === 'rip' ? '🏆' : u.math ? MATH_TAPPE[nd.i].ic : '📘';
      return '<button type="button" class="isl' + (st.conquered ? ' gold' : started ? ' on' : '') + '" data-k="' + k + '"><span class="isl-ic">' + ic + '</span><b>' + esc(name) + '</b>' + (st.conquered ? '<i>👑</i>' : '') + (key && spData(key) ? '<em>🗺️ con la mappa</em>' : '') + '</button>';
    }).join('');
    list.parentNode.insertBefore(isl, list.nextSibling);
    isl.querySelectorAll('.isl').forEach(b => b.addEventListener('click', () => startLesson(u.id, +b.dataset.k)));
    const set = v => { store.set('m-vista', v); isl.hidden = v !== 'mappa'; list.hidden = v === 'mappa'; if ($('m-find')) $('m-find').hidden = v === 'mappa'; sw.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.v === v)); };
    sw.querySelectorAll('button').forEach(b => b.addEventListener('click', () => set(b.dataset.v)));
    set(vista);
  };
})();

/* ================= ✏️ LE MIE MAPPE: mappe concettuali costruite da lei =================
   store 'mappe': [{ id, t, d, n: [{ id, x, y, t, c }], l: [{ a, b, w }] }]  (solo testo: entra nella copia) */
const mpAll = () => store.get('mappe', []);
const mpSaveAll = L => store.set('mappe', L);
const MP_COL = ['#3fa9f5', '#ff9a3c', '#58c46b', '#a879ff', '#ff6b6b', '#e0b100'];
let MP = null;
/* center: idea centrale · words: parole proposte come etichette da toccare · q: la domanda (diventa il titolo) · metti: parole già messe intorno al centro */
function mpNew(center, words, q, metti) {
  const m = { id: Date.now().toString(36), t: q || center || 'La mia mappa', d: todayIso(), n: [{ id: 'c', x: 600, y: 400, t: center || 'La mia idea', c: 1 }], l: [], words: (words || []).slice(0, 8) };
  (metti || []).slice(0, 8).forEach((w, k) => { const p = mpPosto(m, k); m.n.push({ id: 'n' + k + Date.now().toString(36), x: p.x, y: p.y, t: w, c: (k + 2) % MP_COL.length }); });
  const L = mpAll(); if (L.length >= 60) { openModal('<div style="font-size:44px">🗺️</div><p style="font-weight:800">Hai già 60 mappe! Per farne una nuova, cancellane prima una vecchia in Le mie mappe.</p><button type="button" class="btn" id="mp-full" data-focus>Ok</button>'); $('mp-full').addEventListener('click', closeModal); return; }
  L.unshift(m); mpSaveAll(L);
  mpOpen(m.id);
}
function mpOpen(id) {
  const m = mpAll().find(x => x.id === id); if (!m) return;
  MP = { m, sel: null, selL: null, from: null }; MPD = null;
  let ov = $('mp-ed'); if (!ov) { ov = document.createElement('div'); ov.id = 'mp-ed'; ov.className = 'mp-ed'; document.body.appendChild(ov); }
  ov.hidden = false; document.body.classList.add('in-lesson'); mpPaint();
}
function mpStore() { const L = mpAll(), i = L.findIndex(x => x.id === MP.m.id); MP.m.d = todayIso(); if (i >= 0) L[i] = MP.m; else L.unshift(MP.m); mpSaveAll(L); }
function mpClose() { try { speechSynthesis.cancel(); } catch (e) {} const ov = $('mp-ed'); if (ov) ov.hidden = true; document.body.classList.remove('in-lesson'); MP = null; if (current === 'mappe') go('mappe'); }
const mpW = t => Math.max(120, Math.min(330, String(t).length * 11 + 40));
/* la frase di una freccia: «il Sole» + «scalda» + «l'acqua» */
const mpFrase = (m, l) => { const a = m.n.find(n => n.id === l.a), b = m.n.find(n => n.id === l.b); if (!a || !b) return ''; const s = (a.t + ' ' + (l.w || 'è collegato a') + ' ' + b.t).replace(/\s+/g, ' ').trim(); return s.charAt(0).toUpperCase() + s.slice(1) + '.'; };
/* o: { selL: freccia scelta, rd: freccia che la voce sta leggendo, nn: quante idee mostrare, nl: quante frecce mostrare (per l'esempio animato) } */
function mpSVG(m, sel, from, small, o) {
  o = o || {}; const N = {}; m.n.forEach(n => N[n.id] = n);
  const nodi = o.nn == null ? m.n : m.n.slice(0, o.nn), frecce = o.nl == null ? m.l : m.l.slice(0, o.nl);
  const cut = (p, q) => { const dx = q.x - p.x, dy = q.y - p.y, w = mpW(p.t) / 2 + 8, h = 34, t = Math.min(w / Math.abs(dx || 1e-6), h / Math.abs(dy || 1e-6)); return [p.x + dx * t, p.y + dy * t]; };
  const L = frecce.map((l, i) => { const a = N[l.a], b = N[l.b]; if (!a || !b) return ''; const p = cut(a, b), q = cut(b, a), mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2, w = String(l.w || '?').length * 8.5 + 22;
    return '<g class="mp-l' + (o.selL === i ? ' sel' : '') + (o.rd === i ? ' rd' : '') + (l.w ? '' : ' vuota') + (o.nl != null && i === o.nl - 1 ? ' nuova' : '') + '" data-l="' + i + '"><path class="mp-hit" d="M' + p[0].toFixed(0) + ' ' + p[1].toFixed(0) + ' L' + q[0].toFixed(0) + ' ' + q[1].toFixed(0) + '"/><path class="mp-lp" marker-end="url(#mp-ar)" d="M' + p[0].toFixed(0) + ' ' + p[1].toFixed(0) + ' L' + q[0].toFixed(0) + ' ' + q[1].toFixed(0) + '"/>' +
      '<rect x="' + (mx - w / 2) + '" y="' + (my - 16) + '" width="' + w + '" height="32" rx="16"/><text x="' + mx + '" y="' + (my + 6) + '">' + esc(l.w || '?') + '</text></g>'; }).join('');
  const B = nodi.map((n, k) => { const w = mpW(n.t), c = MP_COL[(n.c || 0) % MP_COL.length];
    return '<g class="mp-n' + (sel === n.id ? ' sel' : '') + (from === n.id ? ' from' : '') + (n.id === 'c' ? ' centro' : '') + (o.nn != null && k === o.nn - 1 && k > 0 ? ' nuova' : '') + '" data-n="' + n.id + '" transform="translate(' + n.x + ' ' + n.y + ')"><g class="mp-nb"><rect x="' + (-w / 2) + '" y="-30" width="' + w + '" height="60" rx="18" fill="' + (n.id === 'c' ? '#fff7d6' : '#fff') + '" stroke="' + c + '"/><text y="8">' + esc(n.t) + '</text></g></g>'; }).join('');
  return '<svg class="mp-svg' + (small ? ' small' : '') + '" viewBox="0 0 1200 800"><defs><marker id="mp-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#7d8697"/></marker></defs>' + L + B + '</svg>';
}
function mpAsk(title, val, cb, sub) {
  openModal('<div class="big" style="font-size:22px">' + esc(title) + '</div>' + (sub ? '<p class="mp-sub">' + esc(sub) + '</p>' : '') + '<input type="text" id="mp-in" class="mp-in" maxlength="40" value="' + esc(val || '') + '" autocomplete="off"><div class="row center" style="margin-top:12px"><button type="button" class="btn" id="mp-ok">Ok</button><button type="button" class="btn ghost" id="mp-no">Annulla</button></div>');
  const ok = () => { const v = $('mp-in').value.trim(); closeModal(); cb(v); };
  $('mp-ok').addEventListener('click', ok); $('mp-no').addEventListener('click', closeModal);
  $('mp-in').addEventListener('keydown', e => { if (e.key === 'Enter') ok(); });
  setTimeout(() => { try { $('mp-in').focus(); $('mp-in').select(); } catch (e) {} }, 60);
}
/* le parole della freccia: etichette pronte (quasi sempre verbi) oppure scritte da lei */
const MP_LEGAMI = ['è', 'ha', 'fa', 'serve a', 'diventa', 'è fatto di', 'vive in', 'viene da', 'perché', 'per esempio'];
function mpAskLink(m, a, b, val, cb) {
  const A = m.n.find(n => n.id === a), B = m.n.find(n => n.id === b);
  openModal('<div class="big" style="font-size:22px">Che cosa c’è scritto sulla freccia?</div><p class="mp-sub">Scegli o scrivi le parole che uniscono le due idee: insieme devono fare una frase.</p>' +
    '<div class="mp-prova"><b>' + esc(A.t) + '</b> <span id="mp-pw">…</span> <b>' + esc(B.t) + '</b></div>' +
    '<div class="mp-chips">' + MP_LEGAMI.map(w => '<button type="button" class="mp-w" data-lw="' + esc(w) + '">' + esc(w) + '</button>').join('') + '</div>' +
    '<input type="text" id="mp-in" class="mp-in" maxlength="28" placeholder="oppure scrivi tu…" value="' + esc(val || '') + '" autocomplete="off"><div class="row center" style="margin-top:12px"><button type="button" class="btn" id="mp-ok">Ok</button><button type="button" class="btn ghost" id="mp-no">Annulla</button></div>');
  const inp = $('mp-in'), upd = () => { $('mp-pw').textContent = inp.value.trim() || '…'; }; upd();
  const ok = () => { const v = inp.value.trim(); closeModal(); cb(v); };
  inp.addEventListener('input', upd); inp.addEventListener('keydown', e => { if (e.key === 'Enter') ok(); });
  document.querySelectorAll('[data-lw]').forEach(c => c.addEventListener('click', () => { inp.value = c.dataset.lw; upd(); }));
  $('mp-ok').addEventListener('click', ok); $('mp-no').addEventListener('click', closeModal);
}
/* posto libero intorno al centro per la k-esima idea */
function mpPosto(m, k) { const c0 = m.n[0] || { x: 600, y: 400 }, a = -Math.PI / 2 + k * (Math.PI * 2 / 6) + Math.floor(k / 6) * 0.5, r = 1 + 0.16 * Math.floor(k / 6); return { x: Math.round(Math.max(120, Math.min(1080, c0.x + Math.cos(a) * 400 * r))), y: Math.round(Math.max(50, Math.min(750, c0.y + Math.sin(a) * 270 * r))) }; }
/* che cosa manca alla mappa: il prossimo passo, detto con gentilezza */
function mpStato(m) {
  const usate = new Set(); m.l.forEach(l => { usate.add(l.a); usate.add(l.b); });
  const sole = m.n.filter(n => n.id !== 'c' && !usate.has(n.id)).length, vuote = m.l.filter(l => !l.w).length;
  const passo = m.n.length < 4 ? '① Aggiungi le parole chiave con «➕ Idea»: ne bastano da 4 a 8.' : !m.l.length ? '② Collega: tocca un’idea, poi «🔗 Collega», poi un’altra idea.' : sole ? '② Ci sono ' + (sole === 1 ? '1 idea ancora da sola' : sole + ' idee ancora da sole') + ': collegale alle altre.' : vuote ? '③ ' + (vuote === 1 ? 'Una freccia è senza parole' : vuote + ' frecce sono senza parole') + ': toccala e scrivi le parole.' : '④ Ora tocca «📖 Leggi la mappa»: se le frasi suonano bene, è fatta!';
  return { sole, vuote, passo };
}
function mpPaint() {
  const S = MP, m = S.m, ov = $('mp-ed'), st = mpStato(m), nSel = m.n.find(x => x.id === S.sel), lSel = S.selL != null ? m.l[S.selL] : null;
  const hint = S.from ? 'Ora tocca l’idea a cui vuoi arrivare con la freccia.' : nSel ? 'Hai scelto «' + nSel.t + '»: puoi spostarla, cambiarla, colorarla o collegarla.' : lSel ? 'Hai scelto una freccia: puoi cambiare le parole o toglierla.' : st.passo;
  ov.innerHTML = '<div class="sp-top"><button type="button" class="ls-x" id="mp-x" aria-label="Chiudi">✕</button><button type="button" class="mp-title" id="mp-t">✏️ ' + esc(m.t) + '</button>' +
    '<div class="mp-tools"><button type="button" class="btn small" id="mp-add">➕ Idea</button><button type="button" class="btn small ghost" id="mp-read"' + (m.l.length ? '' : ' disabled') + '>📖 Leggi la mappa</button><button type="button" class="btn small ghost" id="mp-help">💡 Come si fa</button></div></div>' +
    '<p class="mp-hint">' + esc(hint) + '</p>' +
    (m.words && m.words.length ? '<div class="mp-words"><span>Parole da mettere (toccale):</span>' + m.words.map((w, i) => '<button type="button" class="mp-w" data-w="' + i + '">' + esc(w) + '</button>').join('') + '</div>' : '') +
    '<div class="mp-stage" id="mp-stage">' + mpSVG(m, S.sel, S.from, false, { selL: S.selL }) +
    (nSel && !S.from ? '<div class="mp-pop" style="left:' + (nSel.x / 12).toFixed(1) + '%;top:' + ((nSel.y + (nSel.y > 620 ? -96 : 44)) / 8).toFixed(1) + '%"><button type="button" data-a="scrivi">✏️ Scrivi</button><button type="button" data-a="collega">🔗 Collega</button><button type="button" data-a="colore" aria-label="Cambia colore">🎨</button>' + (nSel.id === 'c' ? '' : '<button type="button" data-a="togli" aria-label="Togli">🗑️</button>') + '</div>' : '') +
    (lSel ? (() => { const a = m.n.find(n => n.id === lSel.a), b = m.n.find(n => n.id === lSel.b); return a && b ? '<div class="mp-pop" style="left:' + ((a.x + b.x) / 24).toFixed(1) + '%;top:' + (((a.y + b.y) / 2 + 26) / 8).toFixed(1) + '%"><button type="button" data-a="parole">✏️ Parole</button><button type="button" data-a="gira" aria-label="Gira la freccia">🔄 Gira</button><button type="button" data-a="toglil" aria-label="Togli">🗑️</button></div>' : ''; })() : '') + '</div>';
  const svg = ov.querySelector('svg'), pt = e => { const r = svg.getBoundingClientRect(); return { x: (e.clientX - r.left) / r.width * 1200, y: (e.clientY - r.top) / r.height * 800 }; };
  const add = t => { const p = mpPosto(m, m.n.length - 1), n = { id: 'n' + Date.now().toString(36) + Math.floor(Math.random() * 99), x: p.x, y: p.y, t, c: m.n.length % MP_COL.length }; m.n.push(n); S.sel = n.id; S.selL = null; mpStore(); mpPaint(); };
  $('mp-x').addEventListener('click', mpClose);
  $('mp-t').addEventListener('click', () => mpAsk('Titolo della mappa', m.t, v => { if (v) { m.t = v; mpStore(); } mpPaint(); }));
  $('mp-add').addEventListener('click', () => mpAsk('Scrivi un’idea', '', v => { if (v) add(v); }, 'Una parola chiave o poche parole, non una frase intera.'));
  $('mp-help').addEventListener('click', () => { openModal('<div class="big" style="font-size:24px">💡 Come si fa una buona mappa</div>' + mpRegole() + '<div class="row center" style="margin-top:10px"><button type="button" class="btn" id="mp-hk" data-focus>Ho capito</button></div>'); $('mp-hk').addEventListener('click', closeModal); });
  $('mp-read').addEventListener('click', () => mpLeggi());
  ov.querySelectorAll('.mp-w').forEach(b => b.addEventListener('click', () => { const w = m.words.splice(+b.dataset.w, 1)[0]; add(w); }));
  ov.querySelectorAll('.mp-pop [data-a]').forEach(b => b.addEventListener('click', e => {
    e.stopPropagation(); const a = b.dataset.a;
    if (a === 'scrivi') mpAsk('Cambia la scritta', nSel.t, v => { if (v) { nSel.t = v; if (nSel.id === 'c' && (m.t === 'La mia mappa' || !m.t)) m.t = v; mpStore(); } mpPaint(); });
    else if (a === 'collega') { S.from = nSel.id; mpPaint(); }
    else if (a === 'colore') { nSel.c = ((nSel.c || 0) + 1) % MP_COL.length; mpStore(); mpPaint(); }
    else if (a === 'togli') { m.n = m.n.filter(x => x.id !== nSel.id); m.l = m.l.filter(l => l.a !== nSel.id && l.b !== nSel.id); S.sel = null; mpStore(); mpPaint(); }
    else if (a === 'parole') mpAskLink(m, lSel.a, lSel.b, lSel.w, v => { lSel.w = v; mpStore(); mpPaint(); });
    else if (a === 'gira') { const t = lSel.a; lSel.a = lSel.b; lSel.b = t; mpStore(); mpPaint(); }
    else if (a === 'toglil') { m.l.splice(S.selL, 1); S.selL = null; mpStore(); mpPaint(); }
  }));
  ov.querySelectorAll('.mp-l').forEach(g => g.addEventListener('pointerdown', e => { e.stopPropagation(); S.selL = +g.dataset.l; S.sel = null; S.from = null; mpPaint(); }));
  $('mp-stage').addEventListener('pointerdown', e => { if (e.target.closest('.mp-n,.mp-l,.mp-pop')) return; if (S.sel || S.selL != null || S.from) { S.sel = null; S.selL = null; S.from = null; mpPaint(); } });
  let drag = null;
  ov.querySelectorAll('.mp-n').forEach(g => {
    g.addEventListener('pointerdown', e => {
      const id = g.dataset.n, n = m.n.find(x => x.id === id); e.preventDefault(); e.stopPropagation();
      if (S.from) {
        if (S.from === id) { S.from = null; mpPaint(); return; }
        const a = S.from; S.from = null;
        if (m.l.some(l => (l.a === a && l.b === id) || (l.a === id && l.b === a))) { S.sel = id; mpPaint(); floatText($('mp-stage'), 'Queste due idee sono già collegate'); return; }
        mpAskLink(m, a, id, '', v => { m.l.push({ a, b: id, w: v }); S.sel = null; S.selL = m.l.length - 1; mpStore(); mpPaint(); }); return;
      }
      const era = S.sel === id; S.sel = id; S.selL = null; const p = pt(e); drag = { n, dx: n.x - p.x, dy: n.y - p.y, moved: false, g, era };
      try { g.setPointerCapture(e.pointerId); } catch (x) {}
      ov.querySelectorAll('.mp-n').forEach(x => x.classList.toggle('sel', x === g)); const pop = ov.querySelector('.mp-pop'); if (pop) pop.remove();
    });
    g.addEventListener('pointermove', e => { if (!drag || drag.g !== g) return; const p = pt(e), nx = Math.max(70, Math.min(1130, p.x + drag.dx)), ny = Math.max(40, Math.min(760, p.y + drag.dy)); if (!drag.moved && Math.abs(nx - drag.n.x) + Math.abs(ny - drag.n.y) < 6) return; drag.n.x = nx; drag.n.y = ny; drag.moved = true; g.setAttribute('transform', 'translate(' + nx + ' ' + ny + ')'); });
    const up = () => { if (drag && drag.g === g) { const mv = drag.moved; drag = null; if (mv) mpStore(); mpPaint(); } };
    g.addEventListener('pointerup', up); g.addEventListener('pointercancel', up);
  });
}
/* 📖 la voce legge le frasi della mappa, una freccia alla volta: se suonano bene, la mappa è giusta */
function mpLeggi() {
  const S = MP; if (!S) return; const m = S.m; let i = 0; S.sel = null; S.selL = null; S.from = null;
  const fine = () => { if (MP !== S) return; mpPaint(); const v = m.l.filter(l => !l.w).length; floatText($('mp-stage'), v ? 'Alcune frecce non hanno ancora le parole' : '🌟 Tutte le frasi sono complete!'); };
  const step = () => {
    if (MP !== S) return; if (i >= m.l.length) return fine();
    const k = i++, f = mpFrase(m, m.l[k]);
    $('mp-stage').innerHTML = mpSVG(m, null, null, false, { rd: k }) + '<div class="mp-letta">' + esc(f) + '</div>';
    let done = false; const next = () => { if (done) return; done = true; setTimeout(step, 350); };
    if (Voice.ok) { setTimeout(next, 2500 + 420 * f.split(/\s+/).length); Voice.say(f, null, { onend: next }); } else setTimeout(next, 1600 + 260 * f.split(/\s+/).length);
  };
  step();
}
const mpRegole = () => '<ol class="mp-regole"><li><b>Parti da una domanda.</b> «Come fa l’acqua a tornare nel mare?» aiuta più di un titolo.</li><li><b>Poche parole chiave</b>, da 4 a 8: nomi o poche parole, non frasi intere.</li><li><b>Metti in ordine:</b> al centro l’idea più importante, vicino le più grandi, lontano i dettagli.</li><li><b>Su ogni freccia poche parole, di solito un verbo:</b> idea + parole della freccia + idea devono fare una frase, come «il Sole scalda l’acqua».</li><li><b>Rileggi ad alta voce.</b> Se una frase non ha senso, cambia la freccia o le parole.</li></ol><p class="mp-perche"><b>Perché funziona?</b> Per scegliere il verbo di una freccia devi aver capito come sono legate due idee. Così la mappa ti aiuta a vedere che cosa hai capito e che cosa no. Prova a farla a libro chiuso, poi controlla sul libro e correggi: di solito si ricorda meglio che copiandola.</p>';

/* ---------- ▶️ gli esempi: una mappa che nasce un passo alla volta ---------- */
const MP_ESEMPI = [
  { id: 'acqua', ic: '💧', mat: 'Scienze', t: 'Il viaggio dell’acqua', q: 'Come fa l’acqua a tornare nel mare?',
    n: [['c', 600, 400, 'l’acqua', 0], ['a', 600, 110, 'il Sole', 1], ['b', 990, 250, 'il vapore', 3], ['d', 1000, 560, 'le nuvole', 5], ['e', 600, 700, 'la pioggia', 0], ['f', 200, 540, 'i fiumi e il mare', 2]],
    l: [['a', 'c', 'scalda'], ['c', 'b', 'evaporando forma'], ['b', 'd', 'sale, si raffredda e forma'], ['d', 'e', 'fanno cadere'], ['e', 'f', 'riempie'], ['f', 'c', 'raccolgono']],
    fine: 'Vedi? Seguendo le frecce fai tutto il giro: è il ciclo dell’acqua.' },
  { id: 'nome', ic: '🔤', mat: 'Grammatica', t: 'Che cos’è un nome', q: 'Che cos’è un nome e come può essere?',
    n: [['c', 600, 400, 'il nome', 1], ['a', 600, 110, 'persone, animali, cose e luoghi', 0], ['b', 230, 400, 'un nome comune', 2], ['d', 970, 400, 'un nome proprio', 3], ['e', 230, 680, 'cane', 2], ['f', 800, 680, 'Roma', 3], ['g', 1050, 620, 'la maiuscola', 4]],
    l: [['c', 'a', 'indica'], ['c', 'b', 'può essere'], ['c', 'd', 'può essere'], ['b', 'e', 'è per esempio'], ['d', 'f', 'è per esempio'], ['d', 'g', 'si scrive con']],
    fine: 'Le idee più grandi stanno vicino al centro, gli esempi più lontano.' },
  { id: 'strade', ic: '🏛️', mat: 'Storia', t: 'Le strade dei Romani', q: 'A che cosa servivano le strade dei Romani?',
    n: [['c', 600, 400, 'le strade romane', 1], ['a', 260, 180, 'Roma e le province', 4], ['b', 940, 180, 'strati di pietre', 5], ['d', 240, 620, 'i soldati', 0], ['e', 960, 620, 'le merci', 2]],
    l: [['c', 'a', 'collegavano'], ['c', 'b', 'erano fatte di'], ['c', 'd', 'facevano viaggiare veloci'], ['c', 'e', 'servivano a trasportare']],
    fine: 'Una mappa può essere anche piccola: quattro frecce chiare bastano.' },
  { id: 'festa', ic: '🎈', mat: 'Per organizzarsi', t: 'La mia festa', q: 'Che cosa serve per la mia festa?',
    n: [['c', 600, 400, 'la mia festa', 3], ['a', 600, 110, 'una data', 0], ['b', 220, 300, 'gli inviti', 1], ['d', 230, 640, 'amiche e amici', 2], ['e', 980, 300, 'la torta', 4], ['f', 960, 640, 'i giochi', 5]],
    l: [['a', 'c', 'serve per'], ['b', 'c', 'servono per'], ['b', 'd', 'sono per'], ['e', 'c', 'rende dolce'], ['f', 'd', 'fanno divertire']],
    fine: 'Le mappe non servono solo per studiare: aiutano anche a organizzare le idee.' }
].map(e => Object.assign(e, { n: e.n.map(x => ({ id: x[0], x: x[1], y: x[2], t: x[3], c: x[4] })), l: e.l.map(x => ({ a: x[0], b: x[1], w: x[2] })) }));
let MPD = null;
function mpDemo(id) {
  const e = MP_ESEMPI.find(x => x.id === id); if (!e) return;
  /* passi: 0 la domanda · 1 le parole chiave · 2… una freccia per passo · ultimo: rileggo */
  MPD = { e, i: 0, tot: 2 + e.l.length + 1, t: [] };
  let ov = $('mp-ed'); if (!ov) { ov = document.createElement('div'); ov.id = 'mp-ed'; ov.className = 'mp-ed'; document.body.appendChild(ov); }
  ov.hidden = false; document.body.classList.add('in-lesson'); mpDemoPaint();
}
function mpDemoStop() { if (MPD) { MPD.t.forEach(clearTimeout); MPD.t = []; } try { speechSynthesis.cancel(); } catch (x) {} }
function mpDemoClose() { mpDemoStop(); MPD = null; const ov = $('mp-ed'); if (ov) ov.hidden = true; document.body.classList.remove('in-lesson'); if (current === 'mappe') go('mappe'); }
function mpDemoPaint() {
  const S = MPD; if (!S) return; mpDemoStop(); const e = S.e, i = S.i, ov = $('mp-ed'), ult = i === S.tot - 1, nl = i < 2 ? 0 : Math.min(e.l.length, i - 1);
  const tit = i === 0 ? '① Parto da una domanda' : i === 1 ? '② Scrivo poche parole chiave' : ult ? '④ Rileggo le frasi' : '③ Collego con una freccia e le sue parole';
  const txt = i === 0 ? '«' + e.q + '» Al centro metto l’idea più importante: ' + e.n[0].t + '.' : i === 1 ? 'Intorno metto le parole che mi servono per rispondere: ' + e.n.slice(1).map(n => n.t).join(', ') + '.' : ult ? 'Leggo ogni freccia come una frase. ' + e.fine : mpFrase(e, e.l[nl - 1]) + (nl === 1 ? ' Idea, parole della freccia, idea: insieme fanno una frase.' : '');
  ov.innerHTML = '<div class="sp-top"><button type="button" class="ls-x" id="mp-x" aria-label="Chiudi">✕</button><b class="mp-title">' + e.ic + ' ' + esc(e.t) + ' · esempio</b><span class="mp-passo">passo ' + (i + 1) + ' di ' + S.tot + '</span></div>' +
    '<div class="mp-demo"><div class="mp-dt">' + tit + '</div><p>' + esc(txt) + '</p></div>' +
    '<div class="mp-stage demo" id="mp-stage">' + mpSVG(e, null, null, false, { nn: i === 0 ? 1 : i === 1 ? 1 : e.n.length, nl: nl, rd: !ult && nl ? nl - 1 : undefined }) + '</div>' +
    '<div class="mp-dctl"><button type="button" class="btn ghost" id="mp-dp"' + (i ? '' : ' disabled') + '>◀ Indietro</button>' + (ult ? '<button type="button" class="btn ghost" id="mp-dr">🔁 Da capo</button><button type="button" class="btn" id="mp-dc">✏️ Continua tu questa mappa</button>' : '<button type="button" class="btn" id="mp-dn">Avanti ▶</button>') + '</div>';
  $('mp-x').addEventListener('click', mpDemoClose);
  $('mp-dp').addEventListener('click', () => { S.i = Math.max(0, S.i - 1); mpDemoPaint(); });
  if ($('mp-dn')) $('mp-dn').addEventListener('click', () => { S.i++; mpDemoPaint(); });
  if ($('mp-dr')) $('mp-dr').addEventListener('click', () => { S.i = 0; mpDemoPaint(); });
  if ($('mp-dc')) $('mp-dc').addEventListener('click', () => { const c = JSON.parse(JSON.stringify(e)); mpDemoStop(); MPD = null; const m = { id: Date.now().toString(36), t: e.t, d: todayIso(), n: c.n, l: c.l, words: [] }; const L = mpAll(); L.unshift(m); mpSaveAll(L); mpOpen(m.id); });
  if (Voice.ok) Voice.say(txt);
  /* al passo 2 le parole chiave compaiono una alla volta; nell'ultimo le frecce si accendono in fila */
  if (i === 1) e.n.slice(1).forEach((n, k) => S.t.push(setTimeout(() => { if (MPD === S && S.i === 1) $('mp-stage').innerHTML = mpSVG(e, null, null, false, { nn: k + 2, nl: 0 }); }, 500 + k * (reduce ? 0 : 650))));
  if (ult && !reduce) e.l.forEach((l, k) => S.t.push(setTimeout(() => { if (MPD === S && S.i === S.tot - 1) $('mp-stage').innerHTML = mpSVG(e, null, null, false, { rd: k }); }, 2600 + k * 1500)));
}
/* ---------- ➕ mappa nuova, guidata: domanda → parole chiave → poi si sposta e si collega ---------- */
function mpGuida() {
  mpAsk('① Qual è la tua domanda?', '', q => {
    if (!q) return;
    mpAsk('Qual è l’idea più importante?', '', c => {
      if (!c) return; const W = [];
      const passo = () => {
        openModal('<div class="big" style="font-size:22px">② Le parole chiave</div><p class="mp-sub">«' + esc(q) + '» Scrivi le parole che ti servono per rispondere, una alla volta (da 4 a 8).</p>' +
          '<div class="mp-chips" id="mp-gw">' + (W.length ? W.map((w, k) => '<button type="button" class="mp-w" data-gx="' + k + '">' + esc(w) + ' ✕</button>').join('') : '<span class="mp-sub">Ancora nessuna.</span>') + '</div>' +
          '<div class="mp-riga"><input type="text" id="mp-in" class="mp-in" maxlength="40" placeholder="una parola chiave…" autocomplete="off"><button type="button" class="btn" id="mp-gadd">➕</button></div>' +
          '<div class="row center" style="margin-top:12px"><button type="button" class="btn" id="mp-gok">' + (W.length ? 'Avanti: le metto sulla mappa ▶' : 'Le aggiungo dopo ▶') + '</button></div>');
        const agg = () => { const v = $('mp-in').value.trim(); if (v && W.length < 8 && !W.includes(v)) W.push(v); passo(); };
        $('mp-gadd').addEventListener('click', agg); $('mp-in').addEventListener('keydown', e => { if (e.key === 'Enter') agg(); });
        document.querySelectorAll('[data-gx]').forEach(b => b.addEventListener('click', () => { W.splice(+b.dataset.gx, 1); passo(); }));
        $('mp-gok').addEventListener('click', () => { const v = $('mp-in').value.trim(); if (v && W.length < 8 && !W.includes(v)) W.push(v); closeModal(); mpNew(c, [], q, W); });
        setTimeout(() => { try { $('mp-in').focus(); } catch (e) {} }, 60);
      };
      passo();
    }, 'Va al centro della mappa: una parola o poche parole.');
  }, 'Per esempio: «Come fanno le piante a nutrirsi?»');
}
/* ---------- 📚 parto da un argomento studiato: l'idea centrale e le sue parole chiave arrivano dall'app ---------- */
function mpDaArgomento() {
  const visti = Object.keys(spState().visto || {}).filter(k => spData(k)), tutti = [];
  if (typeof SPIEGA !== 'undefined') Object.keys(SPIEGA).forEach(u => Object.keys(SPIEGA[u]).forEach(t => { const k = u + ':' + t; if (spData(k) && spData(k).centro && spData(k).nodi) tutti.push(k); }));
  const L = (visti.length ? visti : tutti).filter(k => spData(k).centro && spData(k).nodi).slice(0, 60);
  openModal('<div class="big" style="font-size:22px">📚 Da quale argomento parti?</div><p class="mp-sub">' + (visti.length ? 'Argomenti che hai già ascoltato.' : 'Scegli un argomento.') + ' Ricevi l’idea centrale e le parole chiave: le frecce le metti tu, a libro chiuso.</p>' +
    (L.length ? '<div class="mp-args">' + L.map(k => { const t = spTitle(k); return '<button type="button" class="mp-arg" data-ak="' + esc(k) + '">' + (t.ic || '🗺️') + ' ' + esc(t.n) + '</button>'; }).join('') + '</div>' : '<p class="mp-sub">Non ci sono ancora argomenti con la spiegazione.</p>') +
    '<div class="row center" style="margin-top:12px"><button type="button" class="btn ghost" id="mp-ano">Annulla</button></div>');
  $('mp-ano').addEventListener('click', closeModal);
  document.querySelectorAll('[data-ak]').forEach(b => b.addEventListener('click', () => { const d = spData(b.dataset.ak); closeModal(); mpNew(d.centro.n, d.nodi.map(n => n.n)); }));
}

['mappe'].forEach(id => { if (!$('p-' + id)) { const s = document.createElement('section'); s.id = 'p-' + id; s.dataset.page = ''; s.hidden = true; $('main').appendChild(s); } });
PAGES.mappe = el => {
  const L = mpAll();
  el.innerHTML = '<h1 class="v2-h1">🗺️ Le mie mappe</h1><p class="v2-sub">Le mappe concettuali che costruisci tu: un’idea al centro, le altre intorno, e le frecce con le parole che le collegano.</p>' +
    '<details class="card mp-box" open><summary><b>▶️ Guarda come si fa</b><span aria-hidden="true">▾</span></summary><p class="mp-sub">Quattro piccole mappe che nascono un passo alla volta. Alla fine puoi continuarle tu.</p><div class="mp-es">' +
      MP_ESEMPI.map(e => '<button type="button" class="mp-esb" data-es="' + e.id + '"><span>' + e.ic + '</span><b>' + esc(e.t) + '</b><small>' + esc(e.mat) + ' · ' + esc(e.q) + '</small></button>').join('') + '</div></details>' +
    '<details class="card mp-box"><summary><b>💡 Come si fa una buona mappa</b><span aria-hidden="true">▾</span></summary>' + mpRegole() + '</details>' +
    '<div class="mp-azioni"><button type="button" class="v2-btn" id="mp-new">➕ Nuova mappa</button><button type="button" class="v2-btn mp-b2" id="mp-arg">📚 Parto da un argomento studiato</button></div>' +
    (L.length ? '<div class="mp-grid">' + L.map(m => '<div class="mp-card"><button type="button" class="mp-open" data-id="' + m.id + '">' + mpSVG(m, null, null, true) + '<b>' + esc(m.t) + '</b><small>' + esc(typeof fmtShort === 'function' ? fmtShort(m.d) : m.d) + ' · ' + m.n.length + (m.n.length === 1 ? ' idea' : ' idee') + ' · ' + m.l.length + (m.l.length === 1 ? ' freccia' : ' frecce') + '</small></button><button type="button" class="mp-x" data-del="' + m.id + '" aria-label="Togli la mappa">🗑️</button></div>').join('') + '</div>'
      : '<p class="v2-sub" style="margin-top:16px">Ancora nessuna mappa. Guarda un esempio, poi prova con «➕ Nuova mappa».</p>');
  $('mp-new').addEventListener('click', mpGuida);
  $('mp-arg').addEventListener('click', mpDaArgomento);
  el.querySelectorAll('[data-es]').forEach(b => b.addEventListener('click', () => mpDemo(b.dataset.es)));
  el.querySelectorAll('.mp-open').forEach(b => b.addEventListener('click', () => mpOpen(b.dataset.id)));
  el.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => {
    openModal('<div class="big" style="font-size:22px">Togliere questa mappa?</div><div class="row center" style="margin-top:12px"><button type="button" class="btn" id="mx-ok">Sì, toglila</button><button type="button" class="btn ghost" id="mx-no" data-focus>No</button></div>');
    $('mx-no').addEventListener('click', closeModal); $('mx-ok').addEventListener('click', () => { mpSaveAll(mpAll().filter(x => x.id !== b.dataset.del)); closeModal(); go('mappe'); });
  }));
};
