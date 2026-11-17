/* ================= 🌸 IL MIO CORPO CHE CRESCE (17/11/2026, richiesta del genitore) =================
   Prepara alle mestruazioni prima che arrivino e riorganizza «Perché mi lavo» con uno scopo: prendersi cura del corpo che cresce.
   Schede: 🌱 Cresco · 🩸 Le mestruazioni (8) · 🎒 Il mio kit e «E se arriva a scuola?» · 📅 Il mio calendario · 🧼 Mi lavo e mi prendo cura.
   Testi in data/domande/corpo.js (CORPO: autore + revisore indipendente, fonti in CORPO.fonti).
   PRIVACY (scelta del genitore): il calendario del ciclo («corpo-cal») resta SOLO su questo iPad: non è nella lista dei dati inviati a
   Progressi (statici/mondo-sync.js) né nel QR. In Progressi arrivano solo le schede lette, il kit e la storia a scelte. */
if (!$('p-corpo')) { const s = document.createElement('section'); s.id = 'p-corpo'; s.dataset.page = ''; s.hidden = true; $('main').appendChild(s); }
const CR_OK = () => typeof CORPO !== 'undefined';
let crTab = 'cresco';
const crLetto = id => { const v = store.get('corpo-letto', {}); if (!v[id]) { v[id] = todayIso(); store.set('corpo-letto', v); } };
const crLAVO = () => { const s = typeof SCOPRI !== 'undefined' && SCOPRI.find(x => x.id === 'lavo'); return s || { facts: [], missions: [] }; };

/* ---------- disegni (SVG in linea, leggibili in tema chiaro e scuro: sfondo chiaro fisso dentro il disegno) ---------- */
const CR_INK = '#1d2433';
const crSvg = (w, h, inner, l) => '<svg class="cr-svg" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + esc(l) + '"><rect width="' + w + '" height="' + h + '" rx="14" fill="#fff8fb"/>' + inner + '</svg>';
const crT = (x, y, t, o) => '<text x="' + x + '" y="' + y + '" text-anchor="' + ((o && o.a) || 'middle') + '" font-size="' + ((o && o.s) || 14) + '" font-weight="800" fill="' + ((o && o.c) || CR_INK) + '">' + esc(t) + '</text>';
const crE = (x, y, e, s) => '<text x="' + x + '" y="' + y + '" text-anchor="middle" font-size="' + (s || 34) + '">' + e + '</text>';
const CR_DIS = {
  /* schema semplice di utero, tube, ovaie e vagina, con il «nido» (endometrio) in rosa */
  m1: () => crSvg(340, 230,
    '<path d="M170 196 L170 150" stroke="#e58aa6" stroke-width="16" stroke-linecap="round"/>' +
    '<path d="M126 60 Q170 46 214 60 Q232 108 196 150 Q170 168 144 150 Q108 108 126 60Z" fill="#f7b6c8" stroke="' + CR_INK + '" stroke-width="2.5"/>' +
    '<path d="M138 70 Q170 60 202 70 Q214 106 190 136 Q170 150 150 136 Q126 106 138 70Z" fill="#e05a7e"/>' +
    '<path d="M150 78 Q170 72 190 78 Q198 104 182 126 Q170 134 158 126 Q142 104 150 78Z" fill="#fff8fb"/>' +
    '<path d="M126 62 Q96 40 70 58" fill="none" stroke="#e58aa6" stroke-width="7" stroke-linecap="round"/><path d="M214 62 Q244 40 270 58" fill="none" stroke="#e58aa6" stroke-width="7" stroke-linecap="round"/>' +
    '<path d="M70 58 q-14 4 -16 14 M70 58 q-12 -6 -22 -2" stroke="#e58aa6" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M270 58 q14 4 16 14 M270 58 q12 -6 22 -2" stroke="#e58aa6" stroke-width="4" fill="none" stroke-linecap="round"/>' +
    '<ellipse cx="66" cy="88" rx="17" ry="12" fill="#ffd7a8" stroke="' + CR_INK + '" stroke-width="2"/><ellipse cx="274" cy="88" rx="17" ry="12" fill="#ffd7a8" stroke="' + CR_INK + '" stroke-width="2"/>' +
    crT(66, 120, 'ovaia', { s: 13 }) + crT(274, 120, 'ovaia', { s: 13 }) + crT(96, 34, 'tuba', { s: 13 }) + crT(244, 34, 'tuba', { s: 13 }) +
    '<path d="M222 104 L262 150" stroke="' + CR_INK + '" stroke-width="1.5"/>' + crT(282, 166, 'utero', { s: 13 }) +
    '<path d="M186 96 L244 196" stroke="' + CR_INK + '" stroke-width="1.5"/>' + crT(262, 212, 'lo strato «nido»', { s: 13 }) +
    '<path d="M164 186 L96 196" stroke="' + CR_INK + '" stroke-width="1.5"/>' + crT(70, 212, 'vagina', { s: 13 }), 'Schema semplice: utero con lo strato morbido, tube, ovaie e vagina'),
  /* linea del tempo delle età */
  m2: () => crSvg(340, 150,
    '<path d="M30 80 H310" stroke="' + CR_INK + '" stroke-width="3" stroke-linecap="round"/>' +
    '<rect x="96" y="66" width="200" height="28" rx="14" fill="#f7b6c8"/>' +
    [8, 10, 12, 14, 16].map((a, i) => '<path d="M' + (40 + i * 66) + ' 74 V86" stroke="' + CR_INK + '" stroke-width="2"/>' + crT(40 + i * 66, 112, a + ' anni', { s: 12 })).join('') +
    crT(196, 58, 'di solito arrivano qui', { s: 13 }) + crE(64, 52, '🌱', 26) + crT(64, 136, 'inizia il seno', { s: 12 }) +
    crT(196, 136, 'ognuna ha i suoi tempi', { s: 12, c: '#b23a62' }), 'Linea del tempo: di solito il ciclo arriva tra i 10 e i 15 anni'),
  m3: () => crSvg(340, 140, crE(60, 72, '🩲', 50) + crE(170, 72, '💭', 44) + crE(280, 72, '🌙', 44) +
    crT(60, 108, 'perdite', { s: 13 }) + crT(60, 124, 'bianche', { s: 13 }) + crT(170, 108, 'umore', { s: 13 }) + crT(170, 124, 'che cambia', { s: 13 }) + crT(280, 108, 'pancia', { s: 13 }) + crT(280, 124, 'un po’ tesa', { s: 13 }), 'I segnali che possono arrivare prima'),
  m4: () => crSvg(400, 140, crE(50, 86, '🎒', 56) + '<path d="M90 70 H104" stroke="' + CR_INK + '" stroke-width="3"/>' + crE(140, 70, '🧻', 28) + crE(210, 70, '🩲', 28) + crE(280, 70, '🧴', 28) + crE(350, 70, '🛍️', 28) +
    crT(140, 104, 'assorbenti', { s: 12 }) + crT(210, 104, 'mutandine', { s: 12 }) + crT(280, 104, 'salviette', { s: 12 }) + crT(350, 104, 'sacchetto', { s: 12 }) + crT(245, 130, 'una pochette sempre nello zaino', { s: 13, c: '#b23a62' }), 'Il kit nello zaino'),
  m5: () => crSvg(340, 140,
    '<rect x="26" y="40" width="80" height="44" rx="22" fill="#fff" stroke="' + CR_INK + '" stroke-width="2.5"/><rect x="46" y="52" width="40" height="20" rx="10" fill="#fde2ea"/>' +
    '<rect x="132" y="48" width="76" height="28" rx="14" fill="#fff" stroke="' + CR_INK + '" stroke-width="2.5"/>' +
    '<path d="M238 40 H314 L302 84 Q276 94 250 84 Z" fill="#c9a8e6" stroke="' + CR_INK + '" stroke-width="2.5"/>' +
    crT(66, 108, 'assorbente', { s: 13 }) + crT(170, 108, 'salvaslip', { s: 13 }) + crT(276, 108, 'mutandine assorbenti', { s: 12 }) + crT(170, 130, 'cambiali spesso durante il giorno', { s: 13, c: '#b23a62' }), 'Assorbente, salvaslip e mutandine assorbenti'),
  m6: () => crSvg(340, 130, crE(60, 80, '🏫', 48) + crE(150, 80, '🙋‍♀️', 46) + crE(240, 80, '🧑‍🏫', 46) + '<path d="M180 70 H206" stroke="' + CR_INK + '" stroke-width="3" marker-end="url(#crf)"/><defs><marker id="crf" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8Z" fill="' + CR_INK + '"/></marker></defs>' + crE(300, 80, '👍', 40) +
    crT(170, 120, 'c’è sempre un adulto a cui chiedere', { s: 13, c: '#b23a62' }), 'A scuola si chiede aiuto a un adulto'),
  m7: () => crSvg(340, 130, crE(64, 80, '♨️', 46) + crE(150, 80, '🚶‍♀️', 46) + crE(236, 80, '🛌', 46) + crE(300, 80, '💧', 40) +
    crT(64, 118, 'caldo', { s: 13 }) + crT(150, 118, 'movimento', { s: 13 }) + crT(236, 118, 'riposo', { s: 13 }) + crT(300, 118, 'acqua', { s: 13 }), 'Caldo sulla pancia, movimento, riposo e acqua'),
  m8: () => crSvg(340, 130, crE(84, 80, '🩺', 50) + crE(170, 80, '💬', 46) + crE(256, 80, '👩‍⚕️', 50) + crT(170, 120, 'chiedere al pediatra è normale', { s: 13, c: '#b23a62' }), 'Parlarne con il pediatra')
};

/* ---------- pagina ---------- */
PAGES.corpo = el => {
  if (!CR_OK()) { el.innerHTML = '<p>Sezione in arrivo.</p>'; return; }
  const tabs = [['cresco', '🌱 Cresco'], ['mestr', '🩸 Le mestruazioni'], ['kit', '🎒 Kit e scuola'], ['cal', '📅 Il mio calendario'], ['cura', '🧼 Mi lavo e mi prendo cura']];
  el.innerHTML = '<div class="oro-top"><div><h1 class="v2-h1">🌸 Il mio corpo che cresce</h1><p class="v2-sub">Che cosa cambia, le mestruazioni e come prendersi cura di sé. Se hai domande, parlane con la mamma, con il papà o con il pediatra.</p></div></div>' +
    '<div class="oro-tabs">' + tabs.map(t => '<button type="button" class="cu-chip" data-ct="' + t[0] + '" aria-pressed="' + (t[0] === crTab) + '">' + t[1] + '</button>').join('') + '</div><div id="cr-body"></div>';
  el.querySelectorAll('[data-ct]').forEach(b => b.addEventListener('click', () => { crTab = b.dataset.ct; try { speechSynthesis.cancel(); } catch (x) {} PAGES.corpo(el); }));
  ({ cresco: crCresco, mestr: crMestr, kit: crKit, cal: crCal, cura: crCura })[crTab]($('cr-body'));
};
function crFold(box) { box.querySelectorAll('details[data-cr]').forEach(d => d.addEventListener('toggle', () => { if (d.open) crLetto(d.dataset.cr); })); }
const crCard = (x, inner, open) => '<details class="card cr-c" data-cr="' + x.id + '"' + (open ? ' open' : '') + '><summary><span class="cr-ic">' + x.ic + '</span><b>' + esc(x.t) + '</b>' + (store.get('corpo-letto', {})[x.id] ? '<i class="cr-ok" aria-label="già letta">✓</i>' : '') + '<span class="cr-fz" aria-hidden="true">▾</span></summary>' + inner + '</details>';
function crCresco(box) {
  box.innerHTML = '<div class="cr-grid">' + CORPO.cresco.map(x => crCard(x, '<p class="cr-p">' + esc(x.testo) + '</p><p class="cr-p"><span class="cr-e b">💡 Perché saperlo</span> ' + esc(x.perche) + '</p>' + sayBtn(x.t + '. ' + x.testo + ' ' + x.perche))).join('') + '</div>';
  crFold(box);
}
function crMestr(box) {
  box.innerHTML = '<div class="cr-grid">' + CORPO.mestr.map((x, i) => crCard(x,
    (CR_DIS[x.id] ? '<div class="cr-dis">' + CR_DIS[x.id]() + '</div>' : '') +
    '<p class="cr-p">' + esc(x.testo) + '</p>' +
    (x.come && x.come.length ? '<div class="cr-p"><span class="cr-e a">👣 Come</span><ul>' + x.come.map(c => '<li>' + esc(c) + '</li>').join('') + '</ul></div>' : '') +
    '<p class="cr-p"><span class="cr-e b">💡 Perché</span> ' + esc(x.perche) + '</p>' + (x.nota ? '<p class="cr-nota">' + esc(x.nota) + '</p>' : '') +
    '<div class="row" style="gap:8px">' + sayBtn(x.t + '. ' + x.testo + ' ' + (x.come || []).join('. ') + '. ' + x.perche) +
    (x.id === 'm4' ? '<button type="button" class="btn small" data-vai="kit">🎒 Prepara il kit</button>' : x.id === 'm6' ? '<button type="button" class="btn small" data-vai="kit">▶️ Prova la storia</button>' : x.id === 'm2' ? '<button type="button" class="btn small" data-vai="cal">📅 Il mio calendario</button>' : '') + '</div>', i === 0)).join('') + '</div>';
  crFold(box);
  box.querySelectorAll('[data-vai]').forEach(b => b.addEventListener('click', () => { crTab = b.dataset.vai; PAGES.corpo($('p-corpo')); }));
}
function crKit(box) {
  const K = store.get('corpo-kit', {}), S = store.get('corpo-scena', { fatta: 0 });
  box.innerHTML = '<div class="cr-grid"><div class="card cr-c"><h3 class="cr-h">🎒 Il mio kit nello zaino</h3><p class="cr-p">Prepara una pochette con un adulto e tienila sempre nello zaino: così, se arriva quando sei fuori casa, hai già tutto.</p>' +
    CORPO.kit.map((k, i) => '<label class="cr-chk"><input type="checkbox" data-k="' + i + '"' + (K[i] ? ' checked' : '') + '><span>' + k.ic + ' <b>' + esc(k.t) + '</b><small>' + esc(k.perche) + '</small></span></label>').join('') +
    '<p class="cr-nota" id="cr-kitok">' + (CORPO.kit.every((k, i) => K[i]) ? '✅ Il tuo kit è pronto!' : '') + '</p></div>' +
    '<div class="card cr-c"><h3 class="cr-h">🏫 E se arriva a scuola?</h3><p class="cr-p">Una piccola storia: scegli che cosa faresti. Non ci sono risposte sbagliate, solo modi per stare più tranquilla.</p><div id="cr-scena"></div>' +
    (S.fatta ? '<p class="cr-nota">Storia già fatta ' + S.fatta + (S.fatta === 1 ? ' volta' : ' volte') + '.</p>' : '') + '</div></div>';
  box.querySelectorAll('[data-k]').forEach(c => c.addEventListener('change', () => { const v = store.get('corpo-kit', {}); v[c.dataset.k] = c.checked; store.set('corpo-kit', v); $('cr-kitok').textContent = CORPO.kit.every((k, i) => v[i]) ? '✅ Il tuo kit è pronto!' : ''; }));
  crScena($('cr-scena'), 0);
}
function crScena(box, i) {
  const P = CORPO.scena;
  if (i >= P.length) {
    const S = store.get('corpo-scena', { fatta: 0 }); S.fatta = (S.fatta || 0) + 1; S.d = todayIso(); store.set('corpo-scena', S);
    box.innerHTML = '<p class="cr-p">🌟 Fine della storia. Adesso sai che cosa fare: è una cosa normale e c’è sempre qualcuno che può aiutarti.</p><button type="button" class="btn small" id="cr-ri">↺ Ricomincia</button>';
    $('cr-ri').addEventListener('click', () => crScena(box, 0)); return;
  }
  const p = P[i];
  box.innerHTML = '<p class="cr-q"><b>' + (i + 1) + '/' + P.length + '</b> ' + esc(p.domanda) + ' ' + sayBtn(p.domanda) + '</p><div class="cr-sc">' + p.scelte.map((s, j) => '<button type="button" class="btn ghost cr-sb" data-s="' + j + '">' + esc(s.t) + '</button>').join('') + '</div><div id="cr-fb"></div>';
  box.querySelectorAll('[data-s]').forEach(b => b.addEventListener('click', () => {
    const s = p.scelte[+b.dataset.s];
    box.querySelectorAll('[data-s]').forEach(x => { x.disabled = true; x.classList.toggle('sel', x === b); });
    $('cr-fb').innerHTML = '<p class="cr-fbx">' + esc(s.feedback) + '</p><button type="button" class="btn small" id="cr-av">Avanti ›</button>';
    $('cr-av').addEventListener('click', () => crScena(box, i + 1));
  }));
}
/* ---------- 📅 calendario: solo su questo iPad ---------- */
let crMese = null;
function crCal(box) {
  const L = store.get('corpo-cal', []).slice().sort(), set = new Set(L), oggi = todayIso();
  if (!crMese) crMese = oggi.slice(0, 7);
  const [Y, M] = crMese.split('-').map(Number), first = new Date(Y, M - 1, 1), nd = new Date(Y, M, 0).getDate(), off = (first.getDay() + 6) % 7;
  const iso = d => Y + '-' + String(M).padStart(2, '0') + '-' + String(d).padStart(2, '0');
  /* inizi: un giorno segnato senza il giorno prima segnato */
  const prev = s => { const d = new Date(s + 'T12:00'); d.setDate(d.getDate() - 1); return d.toISOString().slice(0, 10); };
  const inizi = L.filter(s => !set.has(prev(s))), dist = [];
  for (let k = 1; k < inizi.length; k++) dist.push(Math.round((new Date(inizi[k] + 'T12:00') - new Date(inizi[k - 1] + 'T12:00')) / 864e5));
  const dall = inizi.length ? Math.round((new Date(oggi + 'T12:00') - new Date(inizi[inizi.length - 1] + 'T12:00')) / 864e5) : null;
  const nomeM = first.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' });
  let g = '';
  for (let k = 0; k < off; k++) g += '<span></span>';
  for (let d = 1; d <= nd; d++) { const s = iso(d); g += '<button type="button" class="cr-d' + (set.has(s) ? ' on' : '') + (s === oggi ? ' oggi' : '') + '" data-d="' + s + '"' + (s > oggi ? ' disabled' : '') + '>' + d + '</button>'; }
  box.innerHTML = '<div class="cr-grid"><div class="card cr-c"><div class="row between"><button type="button" class="btn small ghost" id="cr-mp">‹</button><b class="cr-h">' + esc(nomeM) + '</b><button type="button" class="btn small ghost" id="cr-mn">›</button></div>' +
    '<div class="cr-cal">' + ['L', 'M', 'M', 'G', 'V', 'S', 'D'].map(x => '<i>' + x + '</i>').join('') + g + '</div><p class="cr-nota">Tocca i giorni in cui hai il ciclo; tocca di nuovo per togliere.</p></div>' +
    '<div class="card cr-c"><h3 class="cr-h">📅 A che cosa serve</h3><p class="cr-p">' + esc(CORPO.calendario.spiega) + '</p>' +
    (inizi.length ? '<p class="cr-p">Ultimo inizio: <b>' + new Date(inizi[inizi.length - 1] + 'T12:00').toLocaleDateString('it-IT', { day: 'numeric', month: 'long' }) + '</b> · ' + dall + (dall === 1 ? ' giorno fa' : ' giorni fa') + '</p>' : '<p class="cr-p">Ancora nessun giorno segnato.</p>') +
    (dist.length ? '<p class="cr-p">Giorni tra un inizio e l’altro: <b>' + dist.join(' · ') + '</b></p>' : '') +
    '<p class="cr-nota">🔒 ' + esc(CORPO.calendario.privacy) + '</p></div></div>';
  box.querySelectorAll('[data-d]').forEach(b => b.addEventListener('click', () => { const v = new Set(store.get('corpo-cal', [])); v.has(b.dataset.d) ? v.delete(b.dataset.d) : v.add(b.dataset.d); store.set('corpo-cal', [...v].sort()); crCal(box); }));
  const mv = n => { const d = new Date(Y, M - 1 + n, 1); crMese = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'); crCal(box); };
  $('cr-mp').addEventListener('click', () => mv(-1)); $('cr-mn').addEventListener('click', () => mv(1));
}
/* ---------- 🧼 Mi lavo e mi prendo cura: «Perché mi lavo» riorganizzato per scopo ---------- */
function crCura(box) {
  const LV = crLAVO();
  box.innerHTML = '<div class="cr-strip"><button type="button" class="btn small" id="cr-mani">🧼 Timer delle mani</button><button type="button" class="btn small" id="cr-denti">🪥 Timer dei denti</button><button type="button" class="btn small ghost" id="cr-lez">📚 Lezioni e quiz di «Perché mi lavo»</button></div>' +
    '<div class="cr-grid">' + CORPO.cura.map(x => {
      const F = (x.fatti || []).map(i => LV.facts[i]).filter(Boolean).map(f => [f[0], f[1]]).concat((x.nuovi || []).map(n => [n.titolo, n.testo]));
      const mi = x.missione != null && LV.missions[x.missione];
      return crCard(x, '<p class="cr-p"><span class="cr-e c">🎯 Perché ora che cresci</span> ' + esc(x.scopo) + '</p>' +
        '<ul class="cr-f">' + F.map(f => '<li><b>' + esc(f[0]) + (/[.?!]$/.test(f[0]) ? '' : '.') + '</b> ' + esc(f[1]) + '</li>').join('') + '</ul>' +
        (x.routine ? '<p class="cr-p"><span class="cr-e a">🔁 Ogni giorno</span> ' + esc(x.routine) + '</p>' : '') +
        (mi ? '<p class="cr-nota">🧭 Missione: <b>' + esc(mi[0]) + '</b> — ' + esc(mi[1]) + '</p>' : '') + sayBtn(x.t + '. ' + x.scopo + ' ' + F.map(f => f[1]).join(' ')));
    }).join('') + '</div>';
  crFold(box);
  $('cr-mani').addEventListener('click', () => openTimer('mani'));
  $('cr-denti').addEventListener('click', () => openTimer('denti'));
  $('cr-lez').addEventListener('click', () => openMateria('lavo'));
}
