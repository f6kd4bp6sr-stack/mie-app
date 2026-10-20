/* ================= 🗺️ CARTINE INTERATTIVE (data/cartine/<id>.json → CARTINE) =================
   Coste di Natural Earth (pubblico dominio) semplificate; posizioni delle città approssimative.
   Due modi: 🔎 Esplora (tocca un luogo e leggi che cosa era) e 🎯 Trova il luogo (il gioco: «Tocca Sparta»). */
const CT_TIPI = { polis: ['polis', '#e5484d'], santuario: ['santuario', '#8e5cf7'], antica: ['città più antica', '#a0662a'], monte: ['monte', '#5b6475'] };
let CT = null;
function ctOpen(id) {
  const m = typeof CARTINE !== 'undefined' && CARTINE[id]; if (!m) return;
  CT = { id, m, modo: 'esplora', sel: null, g: null };
  let ov = $('ct-ov'); if (!ov) { ov = document.createElement('div'); ov.id = 'ct-ov'; ov.className = 'ct-ov'; document.body.appendChild(ov); }
  ov.hidden = false; document.body.classList.add('in-lesson'); ctPaint();
}
function ctClose() { const ov = $('ct-ov'); if (ov) ov.hidden = true; CT = null; if (!(($('sp-ov') && !$('sp-ov').hidden) || ($('lesson') && !$('lesson').hidden))) document.body.classList.remove('in-lesson'); }
function ctSVG() {
  const S = CT, m = S.m, gioco = S.modo === 'gioco', G = S.g;
  const mk = l => { const [x, y] = l.xy, c = (CT_TIPI[l.tipo] || CT_TIPI.polis)[1];
    const st = gioco ? (G.ok[l.id] ? ' ok' : G.no[l.id] ? ' no' : G.hint === l.id ? ' hint' : '') : S.sel === l.id ? ' sel' : '';
    const shape = l.tipo === 'monte' ? '<path d="M' + x + ' ' + (y - 12) + ' L' + (x + 11) + ' ' + (y + 8) + ' L' + (x - 11) + ' ' + (y + 8) + 'Z" fill="' + c + '" stroke="#fff" stroke-width="3"/>' :
      l.tipo === 'antica' ? '<rect x="' + (x - 8) + '" y="' + (y - 8) + '" width="16" height="16" rx="3" fill="' + c + '" stroke="#fff" stroke-width="3"/>' :
      '<circle cx="' + x + '" cy="' + y + '" r="' + (l.tipo === 'santuario' ? 8 : 9) + '" fill="' + c + '" stroke="#fff" stroke-width="3"/>' + (l.tipo === 'santuario' ? '<circle cx="' + x + '" cy="' + y + '" r="3" fill="#fff"/>' : '');
    const lab = !gioco || G.ok[l.id] || G.no[l.id] ? '<text class="ct-lab" x="' + (x + l.lab[0]) + '" y="' + (y + l.lab[1] + 5) + '" text-anchor="' + l.anc + '">' + esc(l.n) + '</text>' : '';
    return '<g class="ct-pt' + st + '" data-id="' + l.id + '"><circle class="ct-hit" cx="' + x + '" cy="' + y + '" r="18"/>' + shape + lab + '</g>'; };
  return '<svg class="ct-map" viewBox="0 0 ' + m.w + ' ' + m.h + '" role="img" aria-label="' + esc(m.n) + '">' +
    '<rect width="' + m.w + '" height="' + m.h + '" fill="#bfe3f7"/><path d="' + m.terra + '" fill="#f2e6c9"/>' +
    m.etichette.map(e => '<text class="ct-et ' + e.k + '" x="' + e.xy[0] + '" y="' + e.xy[1] + '">' + esc(e.n) + '</text>').join('') +
    m.luoghi.map(mk).join('') + '</svg>';
}
function ctPaint() {
  const S = CT, m = S.m, ov = $('ct-ov'); if (!S) return;
  let side = '';
  if (S.modo === 'esplora') {
    const l = m.luoghi.find(x => x.id === S.sel);
    side = l ? '<div class="sp-card"><h3>' + esc(l.n) + ' <span class="ct-badge" style="--c:' + CT_TIPI[l.tipo][1] + '">' + CT_TIPI[l.tipo][0] + '</span></h3><p class="sp-text">' + esc(l.info) + '</p><button type="button" class="btn ghost small" id="ct-say">🔊 Ascolta</button></div>'
      : '<div class="sp-card"><h3>🔎 Esplora</h3><p class="sp-text">Tocca un punto sulla cartina: scopri che cosa c’era lì.</p></div>';
    side += '<div class="sp-card"><h3>Legenda</h3>' + Object.keys(CT_TIPI).filter(t => m.luoghi.some(l => l.tipo === t)).map(t => '<div class="ct-leg"><i style="--c:' + CT_TIPI[t][1] + '" class="' + t + '"></i>' + CT_TIPI[t][0] + '</div>').join('') + '<p class="sp-mini">' + esc(m.fonte || '') + '</p></div>' +
      '<button type="button" class="btn" id="ct-play">🎯 Gioca: trova il luogo</button>';
  } else {
    const G = S.g;
    if (G.i >= G.list.length) side = '<div class="sp-card"><h3>🏁 Fine del gioco</h3><p class="sp-text">Ne hai trovati ' + G.score + ' su ' + G.list.length + (G.score === G.list.length ? '. Perfetto! 🌟' : '. Rigioca: ogni volta ricordi meglio dove sono.') + '</p><div class="sp-row"><button type="button" class="btn" id="ct-again">🔁 Rigioca</button><button type="button" class="btn ghost" id="ct-esp">🔎 Esplora</button></div></div>';
    else { const t = m.luoghi.find(x => x.id === G.list[G.i]);
      side = '<div class="sp-card"><h3>🎯 Trova il luogo · ' + (G.i + 1) + ' di ' + G.list.length + '</h3><p class="sp-text">Tocca sulla cartina: <b>' + esc(t.n) + '</b></p><p class="sp-mini" id="ct-fb">' + esc(G.msg || (CT_TIPI[t.tipo][0] === 'polis' ? 'È una polis.' : 'È un ' + CT_TIPI[t.tipo][0] + '.')) + '</p></div><button type="button" class="btn ghost" id="ct-esp">🔎 Torna a esplorare</button>'; }
  }
  ov.innerHTML = '<div class="sp-top"><button type="button" class="ls-x" id="ct-x" aria-label="Chiudi">✕</button><b class="sp-ttl">🗺️ ' + esc(m.n) + '</b><div class="sp-steps"><span class="' + (S.modo === 'esplora' ? 'on' : '') + '">🔎 Esplora</span><span class="' + (S.modo === 'gioco' ? 'on' : '') + '">🎯 Gioco</span></div></div>' +
    '<div class="sp-body"><div class="sp-mapbox ct-box">' + ctSVG() + '</div><div class="sp-side">' + side + '</div></div>';
  $('ct-x').addEventListener('click', ctClose);
  if ($('ct-say')) $('ct-say').addEventListener('click', () => { const l = m.luoghi.find(x => x.id === S.sel); try { Voice.say(l.n + '. ' + l.info); } catch (e) {} });
  if ($('ct-play')) $('ct-play').addEventListener('click', ctGame);
  if ($('ct-again')) $('ct-again').addEventListener('click', ctGame);
  if ($('ct-esp')) $('ct-esp').addEventListener('click', () => { S.modo = 'esplora'; S.sel = null; ctPaint(); });
  ov.querySelectorAll('.ct-pt').forEach(g => g.addEventListener('click', () => ctTap(g.dataset.id, g)));
}
function ctGame() { const S = CT; S.modo = 'gioco'; S.g = { list: shuffle(S.m.luoghi.map(l => l.id)).slice(0, 6), i: 0, score: 0, ok: {}, no: {}, tries: 0, msg: '', hint: null }; ctPaint(); }
function ctTap(id, g) {
  const S = CT; if (!S) return;
  if (S.modo === 'esplora') { S.sel = id; ctPaint(); return; }
  const G = S.g; if (G.i >= G.list.length || G.busy) return;
  const want = G.list[G.i], l = S.m.luoghi.find(x => x.id === id);
  if (id === want) {
    if (!G.tries) G.score++;
    G.ok[id] = 1; G.msg = ''; G.busy = true; try { ding(); cheer(g); } catch (e) {} ctPaint();
    setTimeout(() => { G.busy = false; G.i++; G.tries = 0; G.hint = null; G.no = {}; ctPaint(); }, 900);
  } else {
    G.tries++; try { oops(); } catch (e) {}
    G.no[id] = 1; G.msg = 'Questo è ' + l.n + '. ' + (G.tries >= 2 ? 'Guarda il punto che lampeggia!' : 'Riprova!'); if (G.tries >= 2) G.hint = want; ctPaint();
  }
}
