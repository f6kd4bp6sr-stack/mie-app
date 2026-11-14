/* ================= COME MI TRUCCO (3/11/2026, scelta del genitore) =================
   Primi passi adatti a 10 anni: pelle, sicurezza, trucco per giocare, primi passi leggeri con un adulto, «Bella così».
   - 📖 Schede di nozioni (niente quiz) da data/domande/trucco.js (TRUCCO, verificato: autore + revisore)
   - 🎨 Truccabimbi: un disegno da viso con i colori scelti, si salva (chiave trucchi [{d,dis,c,s}])
   - ✅ Prima e dopo: checklist (chiave trucco-check {data: {p:[..], d:[..]}})
   - 🔎 Detective delle etichette
   Le chiavi trucchi e trucco-check vanno anche in Pianificazione → Progressi. */
const TR_OK = () => typeof TRUCCO !== 'undefined';
const TR_PELLE = ['#F6D7C3', '#E5B48F', '#C68A5E', '#8D5A3B'];
const TR_COL = ['#E02B2B', '#FF8C1A', '#FFE135', '#2EA84A', '#2456C9', '#7B2D9B', '#FF7A9C', '#FFFFFF', '#222222', '#C9A227'];
const TR_DIS = [
  ['farfalla', '🦋', 'Farfalla'], ['stella', '⭐', 'Stelline'], ['arcobaleno', '🌈', 'Arcobaleno'], ['gatto', '🐱', 'Gattino'], ['cuore', '💛', 'Cuori'], ['fiori', '🌸', 'Fiori']
];
/* disegni sul viso: restano su guance e fronte, lontani dagli occhi (sicurezza) */
function trDisegno(id, c) {
  const C = c[0], D = c[1] || c[0];
  const star = (x, y, r, f) => { let p = ''; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .45 : r; p += (x + rr * Math.cos(a)).toFixed(1) + ',' + (y + rr * Math.sin(a)).toFixed(1) + ' '; } return '<polygon points="' + p + '" fill="' + f + '" stroke="#1d2433" stroke-width="1.5"/>'; };
  const heart = (x, y, s, f) => '<path d="M' + x + ' ' + (y + s * .9) + ' C' + (x - s * 1.4) + ' ' + (y - s * .1) + ' ' + (x - s * .6) + ' ' + (y - s * 1.1) + ' ' + x + ' ' + (y - s * .3) + ' C' + (x + s * .6) + ' ' + (y - s * 1.1) + ' ' + (x + s * 1.4) + ' ' + (y - s * .1) + ' ' + x + ' ' + (y + s * .9) + 'Z" fill="' + f + '" stroke="#1d2433" stroke-width="1.5"/>';
  const flower = (x, y, s, f, m) => [0, 72, 144, 216, 288].map(a => '<circle cx="' + (x + s * Math.cos(a * Math.PI / 180)).toFixed(1) + '" cy="' + (y + s * Math.sin(a * Math.PI / 180)).toFixed(1) + '" r="' + (s * .7).toFixed(1) + '" fill="' + f + '" stroke="#1d2433" stroke-width="1.2"/>').join('') + '<circle cx="' + x + '" cy="' + y + '" r="' + (s * .55).toFixed(1) + '" fill="' + m + '"/>';
  if (id === 'farfalla') return '<g transform="translate(150 114) scale(.62) translate(-150 -76)"><path d="M150 70 C120 40 100 60 112 82 C100 92 112 110 150 92 C188 110 200 92 188 82 C200 60 180 40 150 70Z" fill="' + C + '" stroke="#1d2433" stroke-width="2" opacity=".9"/><path d="M150 66 L150 96" stroke="' + D + '" stroke-width="5" stroke-linecap="round"/></g>';
  if (id === 'stella') return star(92, 178, 16, C) + star(116, 196, 9, D) + star(208, 178, 16, C) + star(184, 196, 9, D);
  if (id === 'arcobaleno') return ['#E02B2B', '#FF8C1A', '#FFE135', '#2EA84A', '#2456C9'].map((k, i) => '<path d="M' + (76 + i * 5) + ' 205 A' + (28 - i * 5) + ' ' + (28 - i * 5) + ' 0 0 1 ' + (132 - i * 5) + ' 205" fill="none" stroke="' + k + '" stroke-width="5"/>').join('') + '<circle cx="80" cy="207" r="7" fill="#fff"/><circle cx="128" cy="207" r="7" fill="#fff"/>';
  if (id === 'gatto') return '<circle cx="150" cy="186" r="9" fill="' + C + '" stroke="#1d2433" stroke-width="1.5"/>' + [-1, 1].map(s => [-10, 0, 10].map(dy => '<path d="M' + (150 + s * 18) + ' ' + (196 + dy / 2) + ' L' + (150 + s * 62) + ' ' + (190 + dy) + '" stroke="' + D + '" stroke-width="3" stroke-linecap="round"/>').join('')).join('');
  if (id === 'cuore') return heart(96, 186, 13, C) + heart(204, 186, 13, C) + heart(150, 112, 8, D);
  if (id === 'fiori') return flower(94, 186, 9, C, D) + flower(206, 186, 9, C, D) + flower(134, 112, 5, D, C) + flower(166, 112, 5, D, C);
  return '';
}
function trFaccia(dis, c, s) {
  const pel = TR_PELLE[s || 0];
  return '<svg viewBox="0 0 300 300" class="tr-face" role="img" aria-label="Il viso con il truccabimbi">' +
    '<ellipse cx="150" cy="96" rx="104" ry="70" fill="#5b3a29"/>' +
    '<ellipse cx="150" cy="160" rx="98" ry="118" fill="' + pel + '" stroke="#1d2433" stroke-width="3"/>' +
    '<path d="M52 140 C56 70 100 46 150 46 C200 46 244 70 248 140 C226 104 190 88 150 92 C110 88 74 104 52 140Z" fill="#5b3a29"/>' +
    '<ellipse cx="112" cy="150" rx="11" ry="13" fill="#fff" stroke="#1d2433" stroke-width="2"/><ellipse cx="188" cy="150" rx="11" ry="13" fill="#fff" stroke="#1d2433" stroke-width="2"/>' +
    '<circle cx="114" cy="152" r="6" fill="#1d2433"/><circle cx="190" cy="152" r="6" fill="#1d2433"/>' +
    '<path d="M144 172 Q150 184 156 172" fill="none" stroke="#1d2433" stroke-width="2.5" stroke-linecap="round"/>' +
    '<path d="M124 214 Q150 236 176 214" fill="none" stroke="#c0392b" stroke-width="4" stroke-linecap="round"/>' +
    (dis ? trDisegno(dis, c) : '') + '</svg>';
}

function openTrucco() {
  openModal('<div class="big" style="font-size:28px">💄✨ Come mi trucco</div><p class="vd-sub">Prima la pelle, poi il gioco. Sempre con un adulto!</p>' +
    '<div class="v2-grid">' +
    (typeof SCOPI !== 'undefined' ? '<button type="button" class="v2-tile" id="tr-sc"><span class="v2-ti">🎯</span><b>Che cosa voglio ottenere?</b><small>10 esempi con uno scopo</small></button>' : '') +
    (TR_OK() ? TRUCCO.schede.map(s => '<button type="button" class="v2-tile" data-sk="' + s.id + '"><span class="v2-ti">' + s.ic + '</span><b>' + esc(s.t) + '</b><small>' + s.facts.length + ' schede</small></button>').join('') : '') +
    '<button type="button" class="v2-tile" id="tr-face"><span class="v2-ti">🎨</span><b>Truccabimbi</b><small>Disegna sul viso</small></button>' +
    '<button type="button" class="v2-tile" id="tr-chk"><span class="v2-ti">✅</span><b>Prima e dopo</b><small>Le regole d’oro</small></button>' +
    '<button type="button" class="v2-tile" id="tr-et"><span class="v2-ti">🔎</span><b>Detective delle etichette</b><small>Che cosa vogliono dire i simboli</small></button>' +
    '</div><div class="row center"><button type="button" class="btn ghost" id="tr-x">Chiudi</button></div>');
  document.querySelectorAll('[data-sk]').forEach(b => b.onclick = () => openTrScheda(b.dataset.sk, 0));
  if ($('tr-sc')) $('tr-sc').onclick = () => openScopi('trucco');
  $('tr-face').onclick = () => openTrFace();
  $('tr-chk').onclick = () => openTrCheck();
  $('tr-et').onclick = () => openTrEtichette();
  $('tr-x').onclick = closeModal;
}
function openTrScheda(id, k) {
  if (!TR_OK()) return;
  const S = TRUCCO.schede.find(s => s.id === id); if (!S) return;
  const n = S.facts.length, f = S.facts[(k + n) % n];
  openModal('<div style="font-size:46px">' + S.ic + '</div><div class="vd-sub" style="font-weight:800">' + esc(S.t) + ' · ' + ((k + n) % n + 1) + '/' + n + '</div><div class="big" style="font-size:24px">' + esc(f[0]) + '</div><p style="font-weight:700;font-size:19px">' + esc(f[1]) + '</p>' +
    '<div class="row center" style="gap:8px"><button type="button" class="btn ghost" id="tr-b">← Indietro</button>' + sayBtn(f[0] + '. ' + f[1]) + '<button type="button" class="btn" id="tr-n" style="--bc:var(--v2-green)">Avanti →</button></div>');
  $('tr-b').onclick = () => openTrucco(); $('tr-n').onclick = () => openTrScheda(id, k + 1);
  const seen = store.get('trucco-visti', {}); if (!seen[id + k]) { seen[id + k] = 1; store.set('trucco-visti', seen); }
}
function openTrFace(pre) {
  const st = { dis: pre || null, c: [TR_COL[6], TR_COL[5]], s: store.get('trucco-pelle', 0), i: 0 };
  const paint = () => {
    openModal('<div class="big" style="font-size:26px">🎨 Truccabimbi</div>' +
      '<div class="vv-look"><div>' + trFaccia(st.dis, st.c, st.s) + '</div><div>' +
      '<b>1. Il disegno</b><div class="tr-dis">' + TR_DIS.map(d => '<button type="button" class="chip' + (st.dis === d[0] ? ' on' : '') + '" data-d="' + d[0] + '">' + d[1] + ' ' + d[2] + '</button>').join('') + '</div>' +
      '<b>2. I colori</b><div class="vv-parts" style="margin-top:6px">' + [0, 1].map(i => '<button type="button" class="chip' + (st.i === i ? ' on' : '') + '" data-ci="' + i + '"><span class="vv-dot" style="background:' + st.c[i] + '"></span>' + (i ? 'Secondo colore' : 'Colore principale') + '</button>').join('') + '</div>' +
      '<div class="vv-pal">' + TR_COL.map(h => '<button type="button" aria-label="colore" data-h="' + h + '" style="background:' + h + '"></button>').join('') + '</div>' +
      '<b style="display:block;margin-top:10px">3. La pelle</b><div class="tr-pel">' + TR_PELLE.map((h, i) => '<button type="button" aria-label="tono di pelle" data-s="' + i + '" class="' + (i === st.s ? 'on' : '') + '" style="background:' + h + '"></button>').join('') + '</div>' +
      '<p class="vv-note">🎭 Nella realtà si usano solo colori per truccabimbi, fatti per il viso, lontano dagli occhi, con un adulto. E alla fine ci si strucca!</p>' +
      '</div></div>' +
      '<div class="row center" style="gap:8px"><button type="button" class="btn ghost" id="tr-b">← Indietro</button>' + (st.dis ? '<button type="button" class="btn" id="tr-s" style="--bc:var(--v2-green)">💾 Salva il mio trucco</button>' : '') + '</div>' + trSaved());
    const box = $('modal-box'); if (box) box.classList.add('wide');
    document.querySelectorAll('[data-d]').forEach(b => b.onclick = () => { st.dis = b.dataset.d; paint(); });
    document.querySelectorAll('[data-ci]').forEach(b => b.onclick = () => { st.i = +b.dataset.ci; paint(); });
    document.querySelectorAll('.vv-pal [data-h]').forEach(b => b.onclick = () => { st.c[st.i] = b.dataset.h; paint(); });
    document.querySelectorAll('.tr-pel [data-s]').forEach(b => b.onclick = () => { st.s = +b.dataset.s; store.set('trucco-pelle', st.s); paint(); });
    $('tr-b').onclick = () => openTrucco();
    if ($('tr-s')) $('tr-s').onclick = () => {
      const L = store.get('trucchi', []); L.push({ d: todayIso(), dis: st.dis, c: st.c.slice(), s: st.s }); store.set('trucchi', L.slice(-30));
      const g = vitaGems(2); try { fanfare(); } catch (e) {} floatText($('tr-s'), g ? '+' + g + ' 💎' : 'Salvato!'); setTimeout(paint, 700);
    };
    document.querySelectorAll('[data-tk]').forEach(b => b.onclick = () => { const t = store.get('trucchi', [])[+b.dataset.tk]; if (t) { st.dis = t.dis; st.c = t.c.slice(); st.s = t.s || 0; paint(); } });
  };
  paint();
}
function trSaved() {
  const L = store.get('trucchi', []); if (!L.length) return '';
  return '<div class="vv-saved"><b>💄 I miei trucchi (' + L.length + ')</b><div>' + L.slice(-8).map((t, k) => { const d = TR_DIS.find(x => x[0] === t.dis); return '<button type="button" data-tk="' + (L.length - Math.min(8, L.length) + k) + '" aria-label="Trucco salvato" style="font-size:22px">' + (d ? d[1] : '🎨') + '<i style="background:' + t.c[0] + '"></i></button>'; }).join('') + '</div></div>';
}
function openTrCheck() {
  if (!TR_OK()) return;
  const day = todayIso(), C = store.get('trucco-check', {}), T = C[day] || { p: [], d: [] };
  const list = (k, arr) => '<ul class="vv-check">' + arr.map((x, j) => '<li><label><input type="checkbox" data-k="' + k + '" data-j="' + j + '"' + (T[k].includes(j) ? ' checked' : '') + '> ' + esc(x) + '</label></li>').join('') + '</ul>';
  openModal('<div class="big" style="font-size:26px">✅ Prima e dopo</div><p class="vd-sub">Le regole d’oro, ogni volta che ti trucchi (anche per gioco).</p>' +
    '<div class="tr-cols"><div><b>👐 Prima</b>' + list('p', TRUCCO.prima) + '</div><div><b>🌙 Dopo</b>' + list('d', TRUCCO.dopo) + '</div></div>' +
    '<div class="row center"><button type="button" class="btn ghost" id="tr-b">← Indietro</button></div>');
  const box = $('modal-box'); if (box) box.classList.add('wide');
  $('tr-b').onclick = () => openTrucco();
  document.querySelectorAll('input[data-k]').forEach(c => c.onchange = () => {
    const A = store.get('trucco-check', {}), t = A[day] || { p: [], d: [] }, k = c.dataset.k, j = +c.dataset.j;
    t[k] = c.checked ? [...new Set(t[k].concat(j))] : t[k].filter(x => x !== j); A[day] = t;
    const keys = Object.keys(A).sort().slice(-60), B = {}; keys.forEach(x => B[x] = A[x]); store.set('trucco-check', B);
    if (t.p.length === TRUCCO.prima.length && t.d.length === TRUCCO.dopo.length && !t.ok) { t.ok = 1; store.set('trucco-check', B); try { fanfare(); } catch (e) {} floatText(c, 'Bravissima!'); }
  });
}
function openTrEtichette() {
  if (!TR_OK()) return;
  openModal('<div class="big" style="font-size:26px">🔎 Detective delle etichette</div><div class="tr-et">' +
    TRUCCO.etichette.map(e => '<div><span>' + e.ic + '</span><div><b>' + esc(e.t) + '</b><p>' + esc(e.x) + '</p></div>' + sayBtn(e.t + '. ' + e.x) + '</div>').join('') +
    '</div><div class="row center"><button type="button" class="btn ghost" id="tr-b">← Indietro</button></div>');
  const box = $('modal-box'); if (box) box.classList.add('wide');
  $('tr-b').onclick = () => openTrucco();
}
