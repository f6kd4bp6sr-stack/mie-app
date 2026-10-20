/* ================= 🗺️ CARTINE INTERATTIVE (data/cartine/<id>.json → CARTINE) =================
   Coste di Natural Earth (pubblico dominio) semplificate; posizioni delle città approssimative.
   Due modi: 🔎 Esplora (tocca un luogo e leggi che cosa era) e 🎯 Trova il luogo (il gioco: «Tocca Sparta»). */
const CT_TIPI = { polis: ['polis', '#e5484d'], santuario: ['santuario', '#8e5cf7'], antica: ['città più antica', '#a0662a'], monte: ['monte', '#5b6475'] };
let CT = null;
function ctOpen(id) {
  const m = typeof CARTINE !== 'undefined' && CARTINE[id]; if (!m) return;
  CT = { id, m, modo: 'esplora', sel: null, g: null, zoom: false };
  let ov = $('ct-ov'); if (!ov) { ov = document.createElement('div'); ov.id = 'ct-ov'; ov.className = 'ct-ov'; document.body.appendChild(ov); }
  ov.hidden = false; document.body.classList.add('in-lesson'); ctPaint();
}
function ctClose() { const ov = $('ct-ov'); if (ov) ov.hidden = true; CT = null; if (!(($('sp-ov') && !$('sp-ov').hidden) || ($('lesson') && !$('lesson').hidden))) document.body.classList.remove('in-lesson'); }
function ctSVG() {
  const S = CT, m = S.m, gioco = S.modo === 'gioco', G = S.g;
  const Z = S.zoom && m.zona, b = Z ? m.zona.box : [0, 0, m.w, m.h], k = b[2] / m.w;
  const dentro = l => l.xy[0] >= b[0] && l.xy[0] <= b[0] + b[2] && l.xy[1] >= b[1] && l.xy[1] <= b[1] + b[3];
  const vis = l => Z ? dentro(l) : !l.z;
  const mk = l => { const [x, y] = [0, 0], c = (CT_TIPI[l.tipo] || CT_TIPI.polis)[1];
    const st = gioco ? (G.ok[l.id] ? ' ok' : G.no[l.id] ? ' no' : G.hint === l.id ? ' hint' : '') : S.sel === l.id ? ' sel' : '';
    const shape = l.tipo === 'monte' ? '<path d="M' + x + ' ' + (y - 12) + ' L' + (x + 11) + ' ' + (y + 8) + ' L' + (x - 11) + ' ' + (y + 8) + 'Z" fill="' + c + '" stroke="#fff" stroke-width="3"/>' :
      l.tipo === 'antica' ? '<rect x="' + (x - 8) + '" y="' + (y - 8) + '" width="16" height="16" rx="3" fill="' + c + '" stroke="#fff" stroke-width="3"/>' :
      '<circle cx="' + x + '" cy="' + y + '" r="' + (l.tipo === 'santuario' ? 8 : 9) + '" fill="' + c + '" stroke="#fff" stroke-width="3"/>' + (l.tipo === 'santuario' ? '<circle cx="' + x + '" cy="' + y + '" r="3" fill="#fff"/>' : '');
    const lb = Z && l.zlab ? l.zlab : l.lab, an = Z && l.zanc ? l.zanc : l.anc;
    const lab = !gioco || G.ok[l.id] || G.no[l.id] ? '<text class="ct-lab" x="' + lb[0] + '" y="' + (lb[1] + 5) + '" text-anchor="' + an + '">' + esc(l.n) + '</text>' : '';
    return '<g class="ct-pt' + st + '" data-id="' + l.id + '" transform="translate(' + l.xy[0] + ' ' + l.xy[1] + ') scale(' + k + ')"><circle class="ct-hit" r="' + (Z ? 22 : 18) + '"/>' + shape + lab + '</g>'; };
  const et = e => '<text class="ct-et ' + e.k + '" transform="translate(' + e.xy[0] + ' ' + e.xy[1] + ') scale(' + k + ')">' + esc(e.n) + '</text>';
  const zb = m.zona && m.zona.box, zbox = !Z && zb ? '<g class="ct-zr" id="ct-zr"><rect x="' + zb[0] + '" y="' + zb[1] + '" width="' + zb[2] + '" height="' + zb[3] + '" rx="10"/><text class="ct-zt" x="' + (zb[0] + zb[2] - 8) + '" y="' + (zb[1] + 24) + '">🔍 Ingrandisci</text></g>' : '';
  return '<svg class="ct-map" viewBox="' + b.join(' ') + '" role="img" aria-label="' + esc(m.n) + '">' +
    '<rect x="' + b[0] + '" y="' + b[1] + '" width="' + b[2] + '" height="' + b[3] + '" fill="#bfe3f7"/><path d="' + (Z ? m.zona.terra : m.terra) + '" fill="#f2e6c9"/>' +
    (Z ? (m.zona.etichette || []) : m.etichette).map(et).join('') + zbox +
    m.luoghi.filter(vis).map(mk).join('') + '</svg>';
}
function ctPaint() {
  const S = CT, m = S.m, ov = $('ct-ov'); if (!S) return;
  let side = '';
  if (S.modo === 'esplora') {
    const l = m.luoghi.find(x => x.id === S.sel);
    side = l ? '<div class="sp-card"><h3>' + esc(l.n) + ' <span class="ct-badge" style="--c:' + CT_TIPI[l.tipo][1] + '">' + CT_TIPI[l.tipo][0] + '</span></h3><p class="sp-text">' + esc(l.info) + '</p><button type="button" class="btn ghost small" id="ct-say">🔊 Ascolta</button></div>'
      : '<div class="sp-card"><h3>🔎 Esplora</h3><p class="sp-text">Tocca un punto sulla cartina: scopri che cosa c’era lì.</p></div>';
    side += '<div class="sp-card"><h3>Legenda</h3>' + Object.keys(CT_TIPI).filter(t => m.luoghi.some(l => l.tipo === t)).map(t => '<div class="ct-leg"><i style="--c:' + CT_TIPI[t][1] + '" class="' + t + '"></i>' + CT_TIPI[t][0] + '</div>').join('') + '<p class="sp-mini">' + esc(m.fonte || '') + '</p></div>' +
      ctZbtn() + '<button type="button" class="btn" id="ct-play">🎯 Gioca: trova il luogo</button>';
  } else {
    const G = S.g;
    if (G.i >= G.list.length) side = '<div class="sp-card"><h3>🏁 Fine del gioco</h3><p class="sp-text">Ne hai trovati ' + G.score + ' su ' + G.list.length + (G.score === G.list.length ? '. Perfetto! 🌟' : '. Rigioca: ogni volta ricordi meglio dove sono.') + '</p><div class="sp-row"><button type="button" class="btn" id="ct-again">🔁 Rigioca</button><button type="button" class="btn ghost" id="ct-esp">🔎 Esplora</button></div></div>';
    else { const t = m.luoghi.find(x => x.id === G.list[G.i]);
      side = '<div class="sp-card"><h3>🎯 Trova il luogo · ' + (G.i + 1) + ' di ' + G.list.length + '</h3><p class="sp-text">Tocca sulla cartina: <b>' + esc(t.n) + '</b></p><p class="sp-mini" id="ct-fb">' + esc(G.msg || (CT_TIPI[t.tipo][0] === 'polis' ? 'È una polis.' : 'È un ' + CT_TIPI[t.tipo][0] + '.')) + '</p></div>' + ctZbtn() + '<button type="button" class="btn ghost" id="ct-esp">🔎 Torna a esplorare</button>'; }
  }
  ov.innerHTML = '<div class="sp-top"><button type="button" class="ls-x" id="ct-x" aria-label="Chiudi">✕</button><b class="sp-ttl">🗺️ ' + esc(m.n) + '</b><div class="sp-steps"><span class="' + (S.modo === 'esplora' ? 'on' : '') + '">🔎 Esplora</span><span class="' + (S.modo === 'gioco' ? 'on' : '') + '">🎯 Gioco</span></div></div>' +
    '<div class="sp-body"><div class="sp-mapbox ct-box">' + ctSVG() + '</div><div class="sp-side">' + side + '</div></div>';
  $('ct-x').addEventListener('click', ctClose);
  if ($('ct-say')) $('ct-say').addEventListener('click', () => { const l = m.luoghi.find(x => x.id === S.sel); try { Voice.say(l.n + '. ' + l.info); } catch (e) {} });
  if ($('ct-play')) $('ct-play').addEventListener('click', ctGame);
  if ($('ct-z')) $('ct-z').addEventListener('click', () => { S.zoom = !S.zoom; ctPaint(); });
  if ($('ct-zr')) $('ct-zr').addEventListener('click', () => { S.zoom = true; ctPaint(); });
  if ($('ct-again')) $('ct-again').addEventListener('click', ctGame);
  if ($('ct-esp')) $('ct-esp').addEventListener('click', () => { S.modo = 'esplora'; S.sel = null; ctPaint(); });
  ov.querySelectorAll('.ct-pt').forEach(g => g.addEventListener('click', () => ctTap(g.dataset.id, g)));
}
function ctZbtn() { const z = CT.m.zona; return z ? '<button type="button" class="btn ghost" id="ct-z">' + (CT.zoom ? '↩️ Tutta la Grecia' : '🔍 Ingrandisci: ' + esc(z.n)) + '</button>' : ''; }
// nel gioco la cartina si mette da sola alla scala giusta per il luogo da trovare
function ctFit() { const S = CT, G = S.g, z = S.m.zona; if (!z || !G || G.i >= G.list.length) return; const t = S.m.luoghi.find(x => x.id === G.list[G.i]), b = z.box;
  const dentro = t.xy[0] >= b[0] && t.xy[0] <= b[0] + b[2] && t.xy[1] >= b[1] && t.xy[1] <= b[1] + b[3];
  if (t.z && !S.zoom) { S.zoom = true; G.msg = G.msg || 'Ho ingrandito ' + z.n + '.'; } else if (!dentro && S.zoom) S.zoom = false; }
function ctGame() { const S = CT; S.modo = 'gioco'; S.g = { list: shuffle(S.m.luoghi.map(l => l.id)).slice(0, 6), i: 0, score: 0, ok: {}, no: {}, tries: 0, msg: '', hint: null }; ctFit(); ctPaint(); }
function ctTap(id, g) {
  const S = CT; if (!S) return;
  if (S.modo === 'esplora') { S.sel = id; ctPaint(); return; }
  const G = S.g; if (G.i >= G.list.length || G.busy) return;
  const want = G.list[G.i], l = S.m.luoghi.find(x => x.id === id);
  if (id === want) {
    if (!G.tries) G.score++;
    G.ok[id] = 1; G.msg = ''; G.busy = true; try { ding(); cheer(g); } catch (e) {} ctPaint();
    setTimeout(() => { G.busy = false; G.i++; G.tries = 0; G.hint = null; G.no = {}; G.msg = ''; ctFit(); ctPaint(); }, 900);
  } else {
    G.tries++; try { oops(); } catch (e) {}
    G.no[id] = 1; G.msg = 'Questo è ' + l.n + '. ' + (G.tries >= 2 ? 'Guarda il punto che lampeggia!' : 'Riprova!'); if (G.tries >= 2) G.hint = want; ctPaint();
  }
}
