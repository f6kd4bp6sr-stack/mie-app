/* ================= 🗺️ CAPIRE PRIMA DI RISPONDERE =================
   Ogni argomento con una spiegazione (data/spiegazioni/<materia>.json → SPIEGA) diventa un percorso in 4 tempi:
   1 🐉 il drago racconta (voce + testo) mentre la mappa concettuale si costruisce un nodo alla volta
   2 🧩 ritrova: un nodo si spegne e lei sceglie la parola giusta (ricordare invece di rileggere)
   3 ❓ le domande di sempre: ogni risposta giusta accende il suo nodo
   4 🗣️ lo racconto io: guardando la mappa lo spiega a voce e si riascolta (la registrazione non si salva)
   La prima volta si parte sempre dal racconto; dopo è a scelta (🗺️ accanto all'argomento).
   Chiave: materia:argomento; per la matematica materia:numero della tappa. */
const spKeyOf = (u, nd) => !u || !nd ? null : nd.t === 'arg' ? u.id + ':' + u.topics[nd.i].id : (u.math && nd.t === 'lez') ? u.id + ':' + nd.i : null;
const spData = key => { if (!key || typeof SPIEGA === 'undefined') return null; const i = key.indexOf(':'); return (SPIEGA[key.slice(0, i)] || {})[key.slice(i + 1)] || null; };
const spState = () => { const s = store.get('spiega', null) || {}; s.visto = s.visto || {}; s.acceso = s.acceso || {}; return s; };
const spSave = s => store.set('spiega', s);
function spLit(key) { return new Set(spState().acceso[key] || []); }
function spAddLit(key, ids) { const s = spState(), cur = new Set(s.acceso[key] || []); ids.forEach(i => cur.add(i)); s.acceso[key] = [...cur]; spSave(s); return cur; }
/* titolo dell'argomento per una chiave */
function spTitle(key) {
  const i = key.indexOf(':'), u = unitById(key.slice(0, i)), t = key.slice(i + 1); if (!u) return { u: null, n: key, ic: '' };
  if (u.math) { const m = MATH_TAPPE[+t]; return { u, n: m ? m.n : t, ic: m ? m.ic : '🔢' }; }
  const tp = (u.topics || []).find(x => x.id === t); return { u, n: tp ? tp.n : t, ic: tp ? tp.ic : '' };
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
  const tp = T.u && T.u.topics ? T.u.topics.find(x => key === T.u.id + ':' + x.id) : null;
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
    side = '<div class="sp-card"><h3>🐉 Il drago racconta · ' + (S.i + 1) + ' di ' + d.racconto.length + '</h3><p class="sp-text">' + esc(sl.t) + '</p>' +
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
function mpNew(center, words) {
  const m = { id: Date.now().toString(36), t: center || 'La mia mappa', d: todayIso(), n: [{ id: 'c', x: 600, y: 400, t: center || 'La mia idea', c: 1 }], l: [], words: (words || []).slice(0, 8) };
  const L = mpAll(); if (L.length >= 60) { openModal('<div style="font-size:44px">🗺️</div><p style="font-weight:800">Hai già 60 mappe! Per farne una nuova, cancellane prima una vecchia in Le mie mappe.</p><button type="button" class="btn" id="mp-full" data-focus>Ok</button>'); $('mp-full').addEventListener('click', closeModal); return; }
  L.unshift(m); mpSaveAll(L);
  mpOpen(m.id);
}
function mpOpen(id) {
  const m = mpAll().find(x => x.id === id); if (!m) return;
  MP = { m, sel: null, mode: 'muovi', from: null };
  let ov = $('mp-ed'); if (!ov) { ov = document.createElement('div'); ov.id = 'mp-ed'; ov.className = 'mp-ed'; document.body.appendChild(ov); }
  ov.hidden = false; document.body.classList.add('in-lesson'); mpPaint();
}
function mpStore() { const L = mpAll(), i = L.findIndex(x => x.id === MP.m.id); MP.m.d = todayIso(); if (i >= 0) L[i] = MP.m; else L.unshift(MP.m); mpSaveAll(L); }
function mpClose() { const ov = $('mp-ed'); if (ov) ov.hidden = true; document.body.classList.remove('in-lesson'); MP = null; if (current === 'mappe') go('mappe'); }
const mpW = t => Math.max(120, Math.min(300, String(t).length * 11 + 40));
function mpSVG(m, sel, from, small) {
  const N = {}; m.n.forEach(n => N[n.id] = n);
  const cut = (p, q) => { const dx = q.x - p.x, dy = q.y - p.y, w = mpW(p.t) / 2 + 8, h = 34, t = Math.min(w / Math.abs(dx || 1e-6), h / Math.abs(dy || 1e-6)); return [p.x + dx * t, p.y + dy * t]; };
  const L = m.l.map((l, i) => { const a = N[l.a], b = N[l.b]; if (!a || !b) return ''; const p = cut(a, b), q = cut(b, a), mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2, w = String(l.w || '').length * 8.5 + 20;
    return '<g class="mp-l" data-l="' + i + '"><path d="M' + p[0].toFixed(0) + ' ' + p[1].toFixed(0) + ' L' + q[0].toFixed(0) + ' ' + q[1].toFixed(0) + '"/>' + (l.w ? '<rect x="' + (mx - w / 2) + '" y="' + (my - 15) + '" width="' + w + '" height="30" rx="15"/><text x="' + mx + '" y="' + (my + 6) + '">' + esc(l.w) + '</text>' : '') + '</g>'; }).join('');
  const B = m.n.map(n => { const w = mpW(n.t), c = MP_COL[(n.c || 0) % MP_COL.length];
    return '<g class="mp-n' + (sel === n.id ? ' sel' : '') + (from === n.id ? ' from' : '') + '" data-n="' + n.id + '" transform="translate(' + n.x + ' ' + n.y + ')"><rect x="' + (-w / 2) + '" y="-30" width="' + w + '" height="60" rx="18" fill="#fff" stroke="' + c + '"/><text y="8">' + esc(n.t) + '</text></g>'; }).join('');
  return '<svg class="mp-svg' + (small ? ' small' : '') + '" viewBox="0 0 1200 800"><defs><marker id="mp-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#7d8697"/></marker></defs>' + L + B + '</svg>';
}
function mpAsk(title, val, cb) {
  openModal('<div class="big" style="font-size:22px">' + esc(title) + '</div><input type="text" id="mp-in" class="mp-in" maxlength="40" value="' + esc(val || '') + '" autocomplete="off"><div class="row center" style="margin-top:12px"><button type="button" class="btn" id="mp-ok">Ok</button><button type="button" class="btn ghost" id="mp-no">Annulla</button></div>');
  const ok = () => { const v = $('mp-in').value.trim(); closeModal(); cb(v); };
  $('mp-ok').addEventListener('click', ok); $('mp-no').addEventListener('click', closeModal);
  $('mp-in').addEventListener('keydown', e => { if (e.key === 'Enter') ok(); });
  setTimeout(() => { try { $('mp-in').focus(); $('mp-in').select(); } catch (e) {} }, 60);
}
function mpPaint() {
  const S = MP, m = S.m, ov = $('mp-ed');
  const hint = { muovi: 'Trascina le idee per metterle dove vuoi. Tocca un’idea per sceglierla.', collega: S.from ? 'Ora tocca l’idea da collegare.' : 'Tocca la prima idea, poi la seconda: nasce una freccia.', togli: 'Tocca un’idea o una freccia per toglierla.' }[S.mode];
  ov.innerHTML = '<div class="sp-top"><button type="button" class="ls-x" id="mp-x" aria-label="Chiudi">✕</button><button type="button" class="mp-title" id="mp-t">✏️ ' + esc(m.t) + '</button>' +
    '<div class="mp-tools"><button type="button" class="btn small" id="mp-add">➕ Idea</button><button type="button" class="btn small ghost' + (S.mode === 'collega' ? ' on' : '') + '" id="mp-link">🔗 Collega</button>' +
    '<button type="button" class="btn small ghost" id="mp-edit"' + (S.sel ? '' : ' disabled') + '>✏️ Scrivi</button><button type="button" class="btn small ghost" id="mp-col"' + (S.sel ? '' : ' disabled') + '>🎨</button><button type="button" class="btn small ghost' + (S.mode === 'togli' ? ' on' : '') + '" id="mp-del">🗑️ Togli</button></div></div>' +
    '<p class="mp-hint">' + hint + '</p>' +
    (m.words && m.words.length ? '<div class="mp-words"><span>Parole del racconto:</span>' + m.words.map((w, i) => '<button type="button" class="mp-w" data-w="' + i + '">' + esc(w) + '</button>').join('') + '</div>' : '') +
    '<div class="mp-stage" id="mp-stage">' + mpSVG(m, S.sel, S.from) + '</div>';
  const svg = ov.querySelector('svg'), pt = e => { const r = svg.getBoundingClientRect(); return { x: (e.clientX - r.left) / r.width * 1200, y: (e.clientY - r.top) / r.height * 800 }; };
  const add = (t, x, y) => { const c0 = m.n[0] || { x: 600, y: 400 }, k = m.n.length - 1, a = -Math.PI / 2 + k * 1.05, r = 280 + 40 * Math.floor(k / 6);
    const n = { id: 'n' + Date.now().toString(36) + Math.floor(Math.random() * 99), x: x || Math.max(110, Math.min(1090, c0.x + Math.cos(a) * r * 1.3)), y: y || Math.max(50, Math.min(750, c0.y + Math.sin(a) * r)), t, c: m.n.length % MP_COL.length }; m.n.push(n); S.sel = n.id; mpStore(); mpPaint(); };
  $('mp-x').addEventListener('click', mpClose);
  $('mp-t').addEventListener('click', () => mpAsk('Titolo della mappa', m.t, v => { if (v) { m.t = v; mpStore(); } mpPaint(); }));
  $('mp-add').addEventListener('click', () => mpAsk('Scrivi un’idea', '', v => { if (v) add(v); }));
  $('mp-link').addEventListener('click', () => { S.mode = S.mode === 'collega' ? 'muovi' : 'collega'; S.from = null; mpPaint(); });
  $('mp-del').addEventListener('click', () => { S.mode = S.mode === 'togli' ? 'muovi' : 'togli'; S.from = null; mpPaint(); });
  $('mp-edit').addEventListener('click', () => { const n = m.n.find(x => x.id === S.sel); if (n) mpAsk('Cambia la scritta', n.t, v => { if (v) { n.t = v; mpStore(); } mpPaint(); }); });
  $('mp-col').addEventListener('click', () => { const n = m.n.find(x => x.id === S.sel); if (n) { n.c = ((n.c || 0) + 1) % MP_COL.length; mpStore(); mpPaint(); } });
  ov.querySelectorAll('.mp-w').forEach(b => b.addEventListener('click', () => { const w = m.words.splice(+b.dataset.w, 1)[0]; add(w); }));
  ov.querySelectorAll('.mp-l').forEach(g => g.addEventListener('click', () => { if (S.mode === 'togli') { m.l.splice(+g.dataset.l, 1); mpStore(); mpPaint(); } }));
  let drag = null;
  ov.querySelectorAll('.mp-n').forEach(g => {
    g.addEventListener('pointerdown', e => {
      const id = g.dataset.n, n = m.n.find(x => x.id === id); e.preventDefault();
      if (S.mode === 'togli') { if (id === 'c' && m.n.length > 1) { floatText(g, 'L’idea centrale resta'); return; } m.n = m.n.filter(x => x.id !== id); m.l = m.l.filter(l => l.a !== id && l.b !== id); S.sel = null; mpStore(); mpPaint(); return; }
      if (S.mode === 'collega') {
        if (!S.from) { S.from = id; mpPaint(); return; }
        if (S.from === id) { S.from = null; mpPaint(); return; }
        const a = S.from; S.from = null;
        mpAsk('Parole sulla freccia (puoi lasciare vuoto)', '', v => { m.l.push({ a, b: id, w: v }); mpStore(); mpPaint(); }); return;
      }
      S.sel = id; const p = pt(e); drag = { n, dx: n.x - p.x, dy: n.y - p.y, moved: false, g };
      try { g.setPointerCapture(e.pointerId); } catch (x) {}
      ov.querySelectorAll('.mp-n').forEach(x => x.classList.toggle('sel', x === g)); $('mp-edit').disabled = false; $('mp-col').disabled = false;
    });
    g.addEventListener('pointermove', e => { if (!drag || drag.g !== g) return; const p = pt(e); drag.n.x = Math.max(70, Math.min(1130, p.x + drag.dx)); drag.n.y = Math.max(40, Math.min(760, p.y + drag.dy)); drag.moved = true; g.setAttribute('transform', 'translate(' + drag.n.x + ' ' + drag.n.y + ')'); });
    const up = () => { if (drag && drag.g === g) { const mv = drag.moved; drag = null; if (mv) { mpStore(); $('mp-stage').innerHTML = mpSVG(m, S.sel, S.from); mpPaint(); } } };
    g.addEventListener('pointerup', up); g.addEventListener('pointercancel', up);
  });
}
['mappe'].forEach(id => { if (!$('p-' + id)) { const s = document.createElement('section'); s.id = 'p-' + id; s.dataset.page = ''; s.hidden = true; $('main').appendChild(s); } });
PAGES.mappe = el => {
  const L = mpAll();
  el.innerHTML = '<h1 class="v2-h1">🗺️ Le mie mappe</h1><p class="v2-sub">Le mappe concettuali che costruisci tu: un’idea al centro, le altre intorno, e le frecce con le parole che le collegano.</p>' +
    '<button type="button" class="v2-btn" id="mp-new" style="max-width:420px">➕ Nuova mappa</button>' +
    (L.length ? '<div class="mp-grid">' + L.map(m => '<div class="mp-card"><button type="button" class="mp-open" data-id="' + m.id + '">' + mpSVG(m, null, null, true) + '<b>' + esc(m.t) + '</b><small>' + esc(typeof fmtShort === 'function' ? fmtShort(m.d) : m.d) + ' · ' + m.n.length + (m.n.length === 1 ? ' idea' : ' idee') + '</small></button><button type="button" class="mp-x" data-del="' + m.id + '" aria-label="Togli la mappa">🗑️</button></div>').join('') + '</div>'
      : '<p class="v2-sub" style="margin-top:16px">Ancora nessuna mappa. Puoi farne una qui, oppure alla fine di un argomento con la 🗺️.</p>');
  $('mp-new').addEventListener('click', () => mpAsk('Di che cosa parla la tua mappa?', '', v => { if (v) mpNew(v, []); }));
  el.querySelectorAll('.mp-open').forEach(b => b.addEventListener('click', () => mpOpen(b.dataset.id)));
  el.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => {
    openModal('<div class="big" style="font-size:22px">Togliere questa mappa?</div><div class="row center" style="margin-top:12px"><button type="button" class="btn" id="mx-ok">Sì, toglila</button><button type="button" class="btn ghost" id="mx-no" data-focus>No</button></div>');
    $('mx-no').addEventListener('click', closeModal); $('mx-ok').addEventListener('click', () => { mpSaveAll(mpAll().filter(x => x.id !== b.dataset.del)); closeModal(); go('mappe'); });
  }));
};
