/* ================= COME MI VESTO: 🎨 colori e 📏 taglie (3/11/2026, scelta del genitore) =================
   - 🎨 La ruota dei colori (cerchio di Itten, 12 colori): opposti, vicini, caldi e freddi, neutri
   - 👗 Componi il look: maglia, pantaloni o gonna, scarpe; l'app descrive l'effetto, non dice mai «sbagliato»
   - ❤️ I miei colori: fino a 3 preferiti e gli abbinamenti che stanno bene
   - 📏 La mia taglia: misure con un adulto (mai il peso), taglia dei vestiti, numero di scarpe, sport e prova della taglia
   Dati verificati in data/domande/vesto2.js (VESTO2). Le misure restano sull'iPad e vanno anche in Progressi del genitore.
   Chiavi: misure [{d,h,p,pe,vi}], looks [{d,c:[maglia,sotto,scarpe],g}], col-fav [indici], vesto-prova {sport:{voce:1}} */
const RUOTA = [['giallo', '#FFE135'], ['giallo arancio', '#FFB627'], ['arancione', '#FF8C1A'], ['rosso arancio', '#F2542D'], ['rosso', '#E02B2B'], ['rosso viola', '#B8236B'],
  ['viola', '#7B2D9B'], ['blu viola', '#4B3BA8'], ['blu', '#2456C9'], ['blu verde', '#1B8A8F'], ['verde', '#2EA84A'], ['giallo verde', '#9BCB2E']];
const NEUTRI = [['bianco', '#FFFFFF'], ['grigio', '#9AA0A6'], ['nero', '#222222'], ['beige', '#E8D9BC'], ['blu jeans', '#3B5B8C']];
const PALETTE = RUOTA.map((c, i) => ({ n: c[0], h: c[1], i })).concat(NEUTRI.map(c => ({ n: c[0], h: c[1], i: -1 })));
const rDist = (a, b) => { const d = Math.abs(a - b) % 12; return Math.min(d, 12 - d); };
const rCaldo = i => i <= 5;
const art = n => /^[aeiou]/i.test(n) ? 'l’' : 'il ';
const V2OK = () => typeof VESTO2 !== 'undefined';
const openModalW = (h, c) => { openModal(h, c); const b = $('modal-box'); if (b) b.classList.add('wide'); };

/* ---------- menu: in evidenza nella Casa e in «Io e il mio corpo» ---------- */
function vestoMisDue() { const M = store.get('misure', []); if (!M.length) return true; return (Date.now() - new Date(M[M.length - 1].d).getTime()) / 864e5 > 90; }
function openVesto2() {
  const due = vestoMisDue();
  openModal('<div class="big" style="font-size:28px">👗 Come mi vesto</div><p class="vd-sub">Colori che stanno bene insieme e la taglia giusta per ogni cosa che fai.</p>' +
    '<div class="v2-grid">' +
    (typeof SCOPI !== 'undefined' ? '<button type="button" class="v2-tile" id="vv-sc"><span class="v2-ti">🎯</span><b>Che cosa voglio ottenere?</b><small>10 esempi con uno scopo</small></button>' : '') +
    '<button type="button" class="v2-tile" id="vv-ruota"><span class="v2-ti">🎨</span><b>La ruota dei colori</b><small>Opposti, vicini, caldi e freddi</small></button>' +
    '<button type="button" class="v2-tile" id="vv-look"><span class="v2-ti">👗</span><b>Componi il look</b><small>Scegli i colori, scopri l’effetto</small></button>' +
    '<button type="button" class="v2-tile" id="vv-fav"><span class="v2-ti">❤️</span><b>I miei colori</b><small>E gli abbinamenti giusti</small></button>' +
    '<button type="button" class="v2-tile" id="vv-tg"><span class="v2-ti">📏</span><b>La mia taglia</b><small>' + (due ? '⏰ È ora di misurarti!' : 'Vestiti, scarpe e sport') + '</small></button>' +
    '<button type="button" class="v2-tile" id="vv-arm"><span class="v2-ti">🌦️</span><b>L’armadio del meteo</b><small>Che cosa metto oggi?</small></button>' +
    '<button type="button" class="v2-tile" id="vv-cur"><span class="v2-ti">💡</span><b>Curiosità sui colori</b><small>Lo sapevi che…</small></button>' +
    '</div><div class="row center"><button type="button" class="btn ghost" id="vv-x">Chiudi</button></div>');
  if ($('vv-sc')) $('vv-sc').onclick = () => openScopi('vesto');
  $('vv-ruota').onclick = () => openRuota();
  $('vv-look').onclick = () => openLook();
  $('vv-fav').onclick = () => openFav();
  $('vv-tg').onclick = () => openTaglia();
  $('vv-arm').onclick = () => openWardrobe();
  $('vv-cur').onclick = () => openColFacts(0);
  $('vv-x').onclick = closeModal;
}

/* ---------- 🎨 la ruota ---------- */
function ruotaSVG(sel, id) {
  const R = 120, r = 52, cx = 140, cy = 140, P = (a, rad) => [cx + rad * Math.cos(a), cy + rad * Math.sin(a)];
  let s = '<svg viewBox="0 0 280 280" class="vv-ruota" id="' + id + '" role="img" aria-label="Cerchio dei colori">';
  RUOTA.forEach((c, i) => {
    const a0 = (i * 30 - 105) * Math.PI / 180, a1 = ((i + 1) * 30 - 105) * Math.PI / 180;
    const [x0, y0] = P(a0, R), [x1, y1] = P(a1, R), [x2, y2] = P(a1, r), [x3, y3] = P(a0, r);
    const on = sel != null && (i === sel), op = sel != null && rDist(i, sel) === 6, vi = sel != null && rDist(i, sel) === 1;
    s += '<path data-i="' + i + '" d="M' + x0 + ',' + y0 + ' A' + R + ',' + R + ' 0 0 1 ' + x1 + ',' + y1 + ' L' + x2 + ',' + y2 + ' A' + r + ',' + r + ' 0 0 0 ' + x3 + ',' + y3 + 'Z" fill="' + c[1] + '" stroke="' + (on || op || vi ? '#1d2433' : '#fff') + '" stroke-width="' + (on ? 6 : op || vi ? 4 : 2) + '" style="cursor:pointer"/>';
  });
  s += '<circle cx="140" cy="140" r="46" fill="#fff"/>';
  if (sel != null) s += '<circle cx="140" cy="140" r="30" fill="' + RUOTA[sel][1] + '" stroke="#1d2433" stroke-width="2"/>';
  else s += '<text x="140" y="146" text-anchor="middle" font-size="16" font-weight="800" fill="#1d2433">tocca!</text>';
  return s + '</svg>';
}
function openRuota(sel) {
  const has = sel != null, op = has ? (sel + 6) % 12 : 0, v1 = has ? (sel + 11) % 12 : 0, v2 = has ? (sel + 1) % 12 : 0;
  const txt = has ? 'Hai scelto ' + art(RUOTA[sel][0]) + RUOTA[sel][0] + ', un colore ' + (rCaldo(sel) ? 'caldo ☀️' : 'freddo ❄️') + '. Il suo opposto è ' + art(RUOTA[op][0]) + RUOTA[op][0] + ': insieme fanno un contrasto forte e vivace. I suoi vicini sono ' + RUOTA[v1][0] + ' e ' + RUOTA[v2][0] + ': insieme danno armonia e calma. E con i neutri sta quasi sempre bene.' : 'È il cerchio dei colori che usi anche in Arte. Tocca un colore: ti mostro il suo opposto e i suoi vicini.';
  openModalW('<div class="big" style="font-size:26px">🎨 La ruota dei colori</div>' + ruotaSVG(sel, 'vv-r') +
    (has ? '<div class="vv-pair"><span style="background:' + RUOTA[sel][1] + '"></span><span style="background:' + RUOTA[op][1] + '"></span><b>opposti</b><span style="background:' + RUOTA[v1][1] + '"></span><span style="background:' + RUOTA[sel][1] + '"></span><span style="background:' + RUOTA[v2][1] + '"></span><b>vicini</b></div>' : '') +
    '<p style="font-weight:700">' + esc(txt) + '</p>' +
    '<div class="vv-neu">' + NEUTRI.map(n => '<span title="' + n[0] + '" style="background:' + n[1] + '"></span>').join('') + '<b>I neutri: stanno con quasi tutto (in moda anche il blu jeans)</b></div>' +
    '<div class="row center" style="gap:8px">' + sayBtn(txt) + '<button type="button" class="btn ghost" id="vv-b">← Indietro</button><button type="button" class="btn" id="vv-l" style="--bc:var(--v2-green)">👗 Prova in un look</button></div>');
  $('vv-r').querySelectorAll('path').forEach(p => p.addEventListener('click', () => openRuota(+p.dataset.i)));
  $('vv-b').onclick = () => openVesto2();
  $('vv-l').onclick = () => openLook(has ? [sel, -1, -1] : null);
  if (has && Voice.ok) Voice.say(txt);
}

/* ---------- 👗 componi il look ---------- */
const LOOK_PARTS = [['maglia', 'Maglia'], ['sotto', 'Pantaloni o gonna'], ['scarpe', 'Scarpe']];
function lookHex(v) { return v == null ? '#eeeeee' : v >= 0 ? RUOTA[v][1] : NEUTRI[-v - 1][1]; }
function lookName(v) { return v >= 0 ? RUOTA[v][0] : NEUTRI[-v - 1][0]; }
/* l'effetto del look: descrive, non giudica (il gusto personale conta) */
function lookEffect(c) {
  const hues = [...new Set(c.filter(v => v >= 0))], n = hues.length;
  if (!n) return ['🤍', 'Tutto neutro', 'Elegante e semplice: i neutri stanno bene con quasi tutto.'];
  if (n === 1) return c.filter(v => v >= 0).length > 1 ? ['🎚️', 'Lo stesso colore', 'Lo stesso colore ripetuto: un look ordinato. Con un tono più chiaro o più scuro diventa un vero tono su tono!'] : ['⭐', 'Un colore protagonista', (art(RUOTA[hues[0]][0]) === 'il ' ? 'Il ' : 'L’') + RUOTA[hues[0]][0] + ' risalta e i neutri lo accompagnano: un abbinamento facile e sempre bello.'];
  if (n === 2) { const d = rDist(hues[0], hues[1]);
    if (d <= 2) return ['🌿', 'Colori vicini', RUOTA[hues[0]][0] + ' e ' + RUOTA[hues[1]][0] + ' sono vicini sulla ruota: insieme danno armonia e calma.'];
    if (d === 6) return ['⚡', 'Colori opposti', RUOTA[hues[0]][0] + ' e ' + RUOTA[hues[1]][0] + ' sono opposti sulla ruota: un contrasto forte, che si fa notare!'];
    return ['🎈', 'Contrasto allegro', 'Due colori lontani sulla ruota: un look allegro e vivace.' + (rCaldo(hues[0]) !== rCaldo(hues[1]) ? ' Uno caldo e uno freddo: si bilanciano.' : '')]; }
  if (hues.every(a => hues.every(b => rDist(a, b) <= 2))) return ['🌿', 'Tutti vicini', 'Tre colori vicini sulla ruota: insieme danno armonia e calma.'];
  if (hues.every(a => hues.every(b => a === b || rDist(a, b) === 4))) return ['🔺', 'Il triangolo', 'Tre colori alla stessa distanza sulla ruota: vivace ed equilibrato, come un quadro.'];
  return ['🌈', 'Tanti colori', 'Un look coraggioso e pieno di energia! Se vuoi più calma, cambia un pezzo con un neutro.'];
}
function lookSVG(c, skirt) {
  const av = typeof AV === 'function' ? AV() : '🙂';
  return '<svg viewBox="0 0 200 300" class="vv-fig" role="img" aria-label="Il tuo look">' +
    '<text x="100" y="62" font-size="58" text-anchor="middle">' + av + '</text>' +
    '<path data-p="0" d="M62 78 L138 78 L170 112 L152 128 L140 116 L140 172 L60 172 L60 116 L48 128 L30 112 Z" fill="' + lookHex(c[0]) + '" stroke="#1d2433" stroke-width="3" stroke-linejoin="round"/>' +
    (skirt ? '<path data-p="1" d="M60 172 L140 172 L160 236 L40 236 Z" fill="' + lookHex(c[1]) + '" stroke="#1d2433" stroke-width="3" stroke-linejoin="round"/><path d="M78 236 L78 262 M122 236 L122 262" stroke="#e8b48a" stroke-width="10" stroke-linecap="round"/>'
      : '<path data-p="1" d="M60 172 L140 172 L136 262 L106 262 L100 196 L94 262 L64 262 Z" fill="' + lookHex(c[1]) + '" stroke="#1d2433" stroke-width="3" stroke-linejoin="round"/>') +
    '<path data-p="2" d="M58 262 L98 262 L98 282 L46 282 Q46 268 58 262 Z M102 262 L142 262 Q154 268 154 282 L102 282 Z" fill="' + lookHex(c[2]) + '" stroke="#1d2433" stroke-width="3" stroke-linejoin="round"/></svg>';
}
function openLook(start) {
  const st = { c: start || [null, null, null], part: 0, skirt: store.get('look-skirt', false) };
  const paint = () => {
    const full = st.c.every(v => v != null), ef = full ? lookEffect(st.c) : null;
    openModalW('<div class="big" style="font-size:26px">👗 Componi il look</div>' +
      '<div class="vv-look"><div>' + lookSVG(st.c, st.skirt) + '</div><div>' +
      '<div class="vv-parts">' + LOOK_PARTS.map((p, i) => '<button type="button" class="chip' + (i === st.part ? ' on' : '') + '" data-pt="' + i + '"><span class="vv-dot" style="background:' + lookHex(st.c[i]) + '"></span>' + esc(p[1]) + '</button>').join('') + '</div>' +
      '<div class="vv-pal">' + PALETTE.map(p => '<button type="button" aria-label="' + p.n + '" data-v="' + (p.i >= 0 ? p.i : -(NEUTRI.findIndex(n => n[0] === p.n) + 1)) + '" style="background:' + p.h + '"></button>').join('') + '</div>' +
      '<label class="vv-sk"><input type="checkbox" id="vv-sk"' + (st.skirt ? ' checked' : '') + '> Gonna invece dei pantaloni</label>' +
      (ef ? '<div class="vv-ef"><b>' + ef[0] + ' ' + esc(ef[1]) + '</b><p>' + esc(ef[2]) + '</p><small>Ti piace? Conta il tuo gusto!</small></div>' : '<p class="vd-sub">Scegli un pezzo e poi un colore.</p>') +
      '</div></div>' +
      '<div class="row center" style="gap:8px"><button type="button" class="btn ghost" id="vv-b">← Indietro</button>' + (ef ? sayBtn(ef[1] + '. ' + ef[2]) + '<button type="button" class="btn" id="vv-s" style="--bc:var(--v2-green)">💾 Salva nel mio armadio</button>' : '') + '</div>' +
      lookSaved());
    document.querySelectorAll('[data-pt]').forEach(b => b.onclick = () => { st.part = +b.dataset.pt; paint(); });
    document.querySelectorAll('.vv-fig [data-p]').forEach(b => b.onclick = () => { st.part = +b.dataset.p; paint(); });
    document.querySelectorAll('.vv-pal button').forEach(b => b.onclick = () => { st.c[st.part] = +b.dataset.v; if (st.part < 2 && st.c[st.part + 1] == null) st.part++; paint(); });
    $('vv-sk').onchange = () => { st.skirt = $('vv-sk').checked; store.set('look-skirt', st.skirt); paint(); };
    $('vv-b').onclick = () => openVesto2();
    if ($('vv-s')) $('vv-s').onclick = () => {
      const L = store.get('looks', []); L.push({ d: todayIso(), c: st.c.slice(), g: st.skirt ? 1 : 0 }); store.set('looks', L.slice(-30));
      const g = vitaGems(2); try { fanfare(); } catch (e) {} floatText($('vv-s'), g ? '+' + g + ' 💎' : 'Salvato!');
      setTimeout(paint, 700);
    };
    document.querySelectorAll('[data-lk]').forEach(b => b.onclick = () => { const l = store.get('looks', [])[+b.dataset.lk]; if (l) { st.c = l.c.slice(); st.skirt = !!l.g; paint(); } });
  };
  paint();
}
function lookSaved() {
  const L = store.get('looks', []); if (!L.length) return '';
  return '<div class="vv-saved"><b>👚 Il mio armadio (' + L.length + ')</b><div>' + L.slice(-8).map((l, k) => '<button type="button" data-lk="' + (L.length - Math.min(8, L.length) + k) + '" aria-label="Look salvato">' + l.c.map(v => '<i style="background:' + lookHex(v) + '"></i>').join('') + '</button>').join('') + '</div></div>';
}

/* ---------- ❤️ i miei colori ---------- */
function openFav() {
  const F = store.get('col-fav', []);
  const sug = F.map(i => '<div class="vv-sug"><span style="background:' + RUOTA[i][1] + '"></span><div><b>' + esc(RUOTA[i][0]) + '</b><small>Con l’opposto ' + esc(RUOTA[(i + 6) % 12][0]) + ': contrasto. Con i vicini ' + esc(RUOTA[(i + 11) % 12][0]) + ' e ' + esc(RUOTA[(i + 1) % 12][0]) + ': armonia. Con i neutri: sempre!</small></div>' +
    '<i style="background:' + RUOTA[(i + 6) % 12][1] + '"></i><i style="background:' + RUOTA[(i + 11) % 12][1] + '"></i><i style="background:' + RUOTA[(i + 1) % 12][1] + '"></i></div>').join('');
  openModalW('<div class="big" style="font-size:26px">❤️ I miei colori</div><p class="vd-sub">Tocca fino a 3 colori che ami di più.</p>' + ruotaSVG(null, 'vv-fr') +
    (sug ? '<div class="vv-sugs">' + sug + '</div>' : '') +
    '<div class="row center" style="gap:8px"><button type="button" class="btn ghost" id="vv-b">← Indietro</button>' + (F.length ? '<button type="button" class="btn" id="vv-l" style="--bc:var(--v2-green)">👗 Un look con i miei colori</button>' : '') + '</div>');
  $('vv-fr').querySelectorAll('path').forEach(p => { const i = +p.dataset.i; if (F.includes(i)) { p.setAttribute('stroke', '#1d2433'); p.setAttribute('stroke-width', '6'); }
    p.addEventListener('click', () => { let G = store.get('col-fav', []); G = G.includes(i) ? G.filter(x => x !== i) : G.concat(i).slice(-3); store.set('col-fav', G); openFav(); }); });
  $('vv-b').onclick = () => openVesto2();
  if ($('vv-l')) $('vv-l').onclick = () => openLook([F[0], F[1] != null ? F[1] : -1, -3]);
}

/* ---------- 💡 curiosità sui colori ---------- */
function openColFacts(k) {
  if (!V2OK()) return;
  const L = VESTO2.colFacts, f = L[(k + L.length) % L.length];
  openModal('<div style="font-size:50px">💡</div><div class="big" style="font-size:24px">' + esc(f[0]) + '</div><p style="font-weight:700;font-size:19px">' + esc(f[1]) + '</p>' +
    '<div class="row center" style="gap:8px"><button type="button" class="btn ghost" id="vv-b">← Indietro</button>' + sayBtn(f[0] + '. ' + f[1]) + '<button type="button" class="btn" id="vv-n" style="--bc:var(--v2-green)">Un’altra →</button></div>');
  $('vv-b').onclick = () => openVesto2(); $('vv-n').onclick = () => openColFacts(k + 1);
}

/* ---------- 📏 la mia taglia ---------- */
function tgVestiti(h) {
  const T = VESTO2.taglie; if (!h) return null;
  return T.find(t => h > t.h[0] && h <= t.h[1]) || T.find(t => t.h[1] >= h) || T[T.length - 1];
}
function tgScarpe(p) {
  const S = VESTO2.scarpe; if (!p) return null;
  return S.find(s => p >= s.piede[0] && p < s.piede[1]) || S.find(s => s.piede[1] >= p) || S[S.length - 1];
}
function openTaglia(tab) {
  if (!V2OK()) return;
  tab = tab || 'mis';
  const M = store.get('misure', []), last = M[M.length - 1] || null, due = vestoMisDue();
  const tabs = [['mis', '📏 Misure'], ['tg', '👕 Le mie taglie'], ['sport', '⛸️ Sport'], ['prova', '✅ Prova']];
  let body = '';
  if (tab === 'mis') {
    body = (due ? '<div class="vv-due">' + (last ? '⏰ Sono passati più di 3 mesi: crescendo le misure cambiano. Misuriamoci!' : 'Con un adulto: scalza, schiena dritta contro il muro.') + '</div>' : '') +
      '<div class="vv-form">' +
      '<label>📐 Altezza (cm)<input type="number" inputmode="decimal" id="tg-h" min="80" max="200" value="' + (last ? last.h || '' : '') + '"></label>' +
      '<label>🦶 Lunghezza del piede (cm)<input type="number" inputmode="decimal" step="0.1" id="tg-p" min="12" max="32" value="' + (last ? last.p || '' : '') + '"></label>' +
      '<label>Giro petto (cm) <small>se vuoi</small><input type="number" inputmode="decimal" id="tg-pe" value="' + (last ? last.pe || '' : '') + '"></label>' +
      '<label>Giro vita (cm) <small>se vuoi</small><input type="number" inputmode="decimal" id="tg-vi" value="' + (last ? last.vi || '' : '') + '"></label></div>' +
      '<details class="vv-how"><summary>Come si misura?</summary><p>📐 <b>Altezza:</b> scalza, talloni contro il muro, un libro piatto sulla testa: l’adulto segna e misura dal pavimento.</p><p>🦶 <b>Piede:</b> in piedi su un foglio, l’adulto segna il tallone e la punta del dito più lungo. Misura tutti e due i piedi e usa il più lungo.</p><p>Metro morbido per petto e vita, appoggiato senza stringere.</p></details>' +
      '<div class="row center" style="gap:8px"><button type="button" class="btn" id="tg-save" style="--bc:var(--v2-green)">💾 Salva le misure</button></div>' +
      (M.length ? '<div class="vv-hist"><b>📅 Le mie misure</b>' + M.slice(-6).reverse().map(m => '<div>' + new Date(m.d).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' }) + ': ' + [m.h ? m.h + ' cm' : '', m.p ? 'piede ' + m.p + ' cm' : ''].filter(Boolean).join(' · ') + '</div>').join('') + '</div>' : '');
  } else if (tab === 'tg') {
    const tv = last && tgVestiti(last.h), ts = last && tgScarpe(last.p);
    body = !last ? '<p class="vd-sub">Prima salva le misure in 📏 Misure.</p>' :
      '<div class="vv-res"><div><span>👕</span><b>Vestiti: taglia ' + esc(tv ? tv.t : '–') + '</b><small>' + (tv ? 'per altezza da ' + (tv.h[0] + 1) + ' a ' + tv.h[1] + ' cm. Se sei vicina al limite, prova anche la taglia dopo.' : 'manca l’altezza') + '</small></div>' +
      '<div><span>👟</span><b>Scarpe: numero ' + esc(ts ? String(ts.eu) : '–') + '</b><small>' + (ts ? 'per un piede di ' + ts.piede[0] + '–' + ts.piede[1] + ' cm' : 'manca il piede') + '</small></div></div>' +
      '<p class="vv-note">💡 Spesso la taglia sull’etichetta dei vestiti per bambini è l’altezza in centimetri (a volte invece c’è l’età, per esempio «10 anni»). Conta l’altezza, non l’età: ogni corpo cresce con il suo ritmo. Ogni marca veste un po’ diversa: prova sempre! ' + esc(VESTO2.margineScarpe || '') + '</p>';
  } else if (tab === 'sport') {
    const P = store.get('vesto-prova', {});
    body = '<div class="vv-sport">' + VESTO2.sport.map(s => '<details><summary>' + s.ic + ' <b>' + esc(s.n) + '</b></summary><p>' + esc(s.come) + '</p><ul>' + s.prova.map((x, j) => '<li><label><input type="checkbox" data-sp="' + s.id + '" data-j="' + j + '"' + (P[s.id] && P[s.id][j] ? ' checked' : '') + '> ' + esc(x) + '</label></li>').join('') + '</ul></details>').join('') + '</div>';
  } else {
    const P = store.get('vesto-prova', {});
    body = '<p class="vd-sub">Prima di comprare o quando un vestito ti sembra piccolo:</p><ul class="vv-check">' + VESTO2.prova.map((x, j) => '<li><label><input type="checkbox" data-sp="vestito" data-j="' + j + '"' + (P.vestito && P.vestito[j] ? ' checked' : '') + '> ' + esc(x) + '</label></li>').join('') + '</ul>' +
      '<p class="vv-note">Se un vestito è diventato piccolo ma è ancora bello: missione «Scambio e riuso»! ♻️</p>';
  }
  openModalW('<div class="big" style="font-size:26px">📏 La mia taglia</div><div class="vv-tabs">' + tabs.map(t => '<button type="button" class="chip' + (t[0] === tab ? ' on' : '') + '" data-tb="' + t[0] + '">' + t[1] + '</button>').join('') + '</div>' + body +
    '<div class="row center" style="margin-top:10px"><button type="button" class="btn ghost" id="vv-b">← Indietro</button></div>');
  document.querySelectorAll('[data-tb]').forEach(b => b.onclick = () => openTaglia(b.dataset.tb));
  $('vv-b').onclick = () => openVesto2();
  document.querySelectorAll('input[data-sp]').forEach(c => c.onchange = () => {
    const P = store.get('vesto-prova', {}), k = c.dataset.sp; P[k] = P[k] || {}; P[k][c.dataset.j] = c.checked ? 1 : 0; store.set('vesto-prova', P);
    const box = c.closest('ul'); if (box && [...box.querySelectorAll('input')].every(x => x.checked)) { const g = vitaGems(3); if (g) floatText(box, '+' + g + ' 💎'); }
  });
  if ($('tg-save')) $('tg-save').onclick = () => {
    const n = id => { const v = parseFloat(String($(id).value).replace(',', '.')); return isFinite(v) && v > 0 ? Math.round(v * 10) / 10 : null; };
    const m = { d: new Date().toISOString(), h: n('tg-h'), p: n('tg-p'), pe: n('tg-pe'), vi: n('tg-vi') };
    if (!m.h && !m.p) { (typeof toastV2 === 'function' ? toastV2 : alert)('Scrivi almeno l’altezza o il piede'); return; }
    if ((m.h && (m.h < 80 || m.h > 200)) || (m.p && (m.p < 12 || m.p > 32))) { (typeof toastV2 === 'function' ? toastV2 : alert)('Controlla i numeri: sono in centimetri?'); return; }
    const M2 = store.get('misure', []); M2.push(m); store.set('misure', M2.slice(-24));
    const g = vitaGems(3); try { fanfare(); } catch (e) {}
    if (typeof __mondoSyncPush === 'function') try { __mondoSyncPush(true); } catch (e) {}
    floatText($('tg-save'), g ? '+' + g + ' 💎' : 'Salvato!'); setTimeout(() => openTaglia('tg'), 700);
  };
}

/* colori: le curiosità entrano anche nella lezione «Come mi vesto» */
(function () { try { if (V2OK() && typeof SCOPRI !== 'undefined') { const u = SCOPRI.find(x => x.id === 'vesto'); if (u && !u._v2) { u._v2 = 1; VESTO2.colFacts.forEach(f => u.facts.push(f)); } } } catch (e) {} })();
