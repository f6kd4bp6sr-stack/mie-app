/* ================= 🌸 IL MIO CORPO CHE CRESCE (17/11/2026, richiesta del genitore) =================
   Prepara alle mestruazioni prima che arrivino e riorganizza «Perché mi lavo» con uno scopo: prendersi cura del corpo che cresce.
   17/11/2026 pomeriggio (commento della mamma: «più umana… meglio parlare»): la sezione è uno SPUNTO per parlarne con la mamma.
   Linguette: 💬 Ne parliamo insieme (6 chiacchierate con «Chiedi alla mamma» e 🎙️ la voce della mamma) · ❓ Le mie domande · 🎒 Kit e scuola · 📅 Il mio calendario · 🧼 Mi lavo e mi prendo cura.
   Disegni simbolici (niente organi). Niente lettura ad alta voce: la legge lei.
   Testi in data/domande/corpo.js (CORPO: autore + revisore indipendente, fonti in CORPO.fonti).
   PRIVACY (scelta del genitore): il calendario del ciclo («corpo-cal»), le domande («corpo-domande») e i messaggi registrati della mamma (IndexedDB «mondo-voce-mamma») restano SOLO su questo iPad: non è nella lista dei dati inviati a
   Progressi (statici/mondo-sync.js) né nel QR. In Progressi arrivano solo le schede lette, il kit e la storia a scelte. */
if (!$('p-corpo')) { const s = document.createElement('section'); s.id = 'p-corpo'; s.dataset.page = ''; s.hidden = true; $('main').appendChild(s); }
const CR_OK = () => typeof CORPO !== 'undefined';
let crTab = 'insieme';
/* 17/11/2026: niente lettura ad alta voce in questa sezione, la legge lei (scelta del genitore) */
const crSay = () => '';
const crLetto = id => { const v = store.get('corpo-letto', {}); if (!v[id]) { v[id] = todayIso(); store.set('corpo-letto', v); } };
const crLAVO = () => { const s = typeof SCOPRI !== 'undefined' && SCOPRI.find(x => x.id === 'lavo'); return s || { facts: [], missions: [] }; };

/* ---------- disegni (SVG in linea, leggibili in tema chiaro e scuro: sfondo chiaro fisso dentro il disegno) ---------- */
const CR_INK = '#1d2433';
const crSvg = (w, h, inner, l) => '<svg class="cr-svg" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + esc(l) + '"><rect width="' + w + '" height="' + h + '" rx="14" fill="#fff8fb"/>' + inner + '</svg>';
const crT = (x, y, t, o) => '<text x="' + x + '" y="' + y + '" text-anchor="' + ((o && o.a) || 'middle') + '" font-size="' + ((o && o.s) || 14) + '" font-weight="800" fill="' + ((o && o.c) || CR_INK) + '">' + esc(t) + '</text>';
const crE = (x, y, e, s) => '<text x="' + x + '" y="' + y + '" text-anchor="middle" font-size="' + (s || 34) + '">' + e + '</text>';
/* ---------- disegni SIMBOLICI (17/11/2026: niente organi né corpi, scelta dei genitori) ---------- */
const CR_P = '#e58aa6', CR_L = '#c9a8e6';
const CR_DIS = {
  /* c1 il corpo che cambia: un bocciolo che si apre */
  c1: () => crSvg(340, 150, '<path d="M60 130 Q60 100 64 80" stroke="#6aa86a" stroke-width="4" fill="none"/><ellipse cx="64" cy="72" rx="10" ry="16" fill="' + CR_P + '"/>' +
    '<path d="M170 130 Q170 96 170 76" stroke="#6aa86a" stroke-width="4" fill="none"/><path d="M152 106 q-14 -6 -18 4 q12 6 18 -4Z" fill="#8cc68c"/><path d="M170 76 q-16 -18 -6 -34 q6 8 6 18 q0 -10 6 -18 q10 16 -6 34Z" fill="' + CR_P + '"/>' +
    '<path d="M276 130 Q276 96 276 78" stroke="#6aa86a" stroke-width="4" fill="none"/><path d="M258 108 q-14 -6 -18 4 q12 6 18 -4Z M294 104 q14 -6 18 4 q-12 6 -18 -4Z" fill="#8cc68c"/>' +
    [0, 72, 144, 216, 288].map(a => '<ellipse cx="276" cy="56" rx="11" ry="20" fill="' + CR_P + '" transform="rotate(' + a + ' 276 72)"/>').join('') + '<circle cx="276" cy="72" r="9" fill="#ffd36e"/>' +
    '<path d="M96 96 H126 M214 96 H242" stroke="' + CR_L + '" stroke-width="3" stroke-dasharray="4 5" stroke-linecap="round"/>', 'Un bocciolo che si apre piano piano'),
  /* c2 che cosa sono: la luna che cresce e cala, come un ciclo */
  c2: () => crSvg(340, 150, [[50, 0], [110, .35], [170, 1], [230, .35], [290, 0]].map(([x, f], i) => {
    const r = 22; return '<circle cx="' + x + '" cy="70" r="' + r + '" fill="#efe3f8" stroke="' + CR_L + '" stroke-width="2"/>' +
      (f ? '<path d="M' + x + ' ' + (70 - r) + ' A' + r + ' ' + r + ' 0 0 ' + (i < 2 ? 1 : 0) + ' ' + x + ' ' + (70 + r) + ' A' + (r * (1 - f)) + ' ' + r + ' 0 0 ' + (i < 2 ? 0 : 1) + ' ' + x + ' ' + (70 - r) + 'Z" fill="#f7c6d4"/>' : '') +
      (f === 1 ? '<circle cx="' + x + '" cy="70" r="' + r + '" fill="#f7c6d4"/>' : ''); }).join('') +
    '<path d="M50 112 Q170 140 290 112" stroke="' + CR_P + '" stroke-width="3" fill="none" stroke-dasharray="5 6" stroke-linecap="round"/>' + crT(170, 138, 'un ciclo che si ripete', { s: 13, c: '#b23a62' }), 'La luna che cresce e cala, come un ciclo'),
  /* c3 quando arrivano: un piccolo calendario con un cuore */
  c3: () => crSvg(340, 150, '<rect x="110" y="26" width="120" height="104" rx="12" fill="#fff" stroke="' + CR_L + '" stroke-width="3"/><rect x="110" y="26" width="120" height="24" rx="12" fill="' + CR_L + '"/>' +
    Array.from({ length: 12 }, (_, i) => '<circle cx="' + (128 + (i % 4) * 28) + '" cy="' + (66 + Math.floor(i / 4) * 22) + '" r="6" fill="' + (i === 6 ? CR_P : '#efe3f8') + '"/>').join('') +
    '<path d="M266 70 c0 -12 18 -12 18 0 c0 -12 18 -12 18 0 c0 14 -18 24 -18 30 c0 -6 -18 -16 -18 -30Z" fill="' + CR_P + '"/><path d="M52 64 a26 26 0 1 0 22 40 a20 20 0 1 1 -22 -40Z" fill="#efe3f8"/>', 'Un calendario e un cuore'),
  /* c4 che cosa si usa: la pochette */
  c4: () => crSvg(340, 150, '<path d="M110 60 H230 Q240 60 240 72 V118 Q240 130 228 130 H112 Q100 130 100 118 V72 Q100 60 110 60Z" fill="#f7c6d4" stroke="' + CR_P + '" stroke-width="3"/>' +
    '<path d="M100 74 Q170 104 240 74" fill="none" stroke="' + CR_P + '" stroke-width="3"/><circle cx="170" cy="92" r="7" fill="#ffd36e"/><path d="M150 60 Q170 36 190 60" fill="none" stroke="' + CR_L + '" stroke-width="5" stroke-linecap="round"/>' +
    [[60, 52], [280, 48], [70, 112], [276, 112]].map(([x, y]) => '<path transform="translate(' + x + ' ' + y + ')" d="M0 -8 L2 -2 L8 0 L2 2 L0 8 L-2 2 L-8 0 L-2 -2Z" fill="' + CR_L + '"/>').join(''), 'Una pochette preparata con cura'),
  /* c5 fuori casa: una casa, un cuore e una mano tesa */
  c5: () => crSvg(340, 150, '<path d="M60 76 L100 44 L140 76 V122 H60Z" fill="#efe3f8" stroke="' + CR_L + '" stroke-width="3"/><rect x="90" y="96" width="20" height="26" fill="' + CR_P + '"/>' +
    '<path d="M150 84 H190" stroke="' + CR_P + '" stroke-width="3" stroke-dasharray="4 5" stroke-linecap="round"/>' +
    '<path d="M202 80 c0 -14 20 -14 20 0 c0 -14 20 -14 20 0 c0 16 -20 28 -20 34 c0 -6 -20 -18 -20 -34Z" fill="' + CR_P + '"/>' +
    '<path d="M262 96 q14 -18 30 -6 q10 8 2 18 l-18 14 q-8 4 -12 -4Z" fill="#ffd8b8" stroke="' + CR_P + '" stroke-width="2"/>' + crT(170, 140, 'c’è sempre qualcuno che ti aiuta', { s: 13, c: '#b23a62' }), 'Una casa, un cuore e una mano tesa'),
  /* c6 come mi sento: una tazza calda e un cuscino */
  c6: () => crSvg(340, 150, '<path d="M80 70 H140 V112 Q140 128 124 128 H96 Q80 128 80 112Z" fill="#f7c6d4" stroke="' + CR_P + '" stroke-width="3"/><path d="M140 82 q18 0 18 14 q0 14 -18 14" fill="none" stroke="' + CR_P + '" stroke-width="3"/>' +
    '<path d="M96 58 q-6 -10 2 -18 M112 58 q-6 -10 2 -18 M128 58 q-6 -10 2 -18" stroke="' + CR_L + '" stroke-width="3" fill="none" stroke-linecap="round"/>' +
    '<rect x="196" y="78" width="104" height="48" rx="22" fill="#efe3f8" stroke="' + CR_L + '" stroke-width="3"/><path d="M228 66 a14 14 0 1 0 12 22 a11 11 0 1 1 -12 -22Z" fill="#ffd36e"/>', 'Una tazza calda e un cuscino')
};

/* ---------- 🎙️ la voce della mamma: registrazioni solo su questo iPad (IndexedDB «mondo-voce-mamma»), mai inviate ---------- */
const CrVoce = {
  db() { return new Promise((res, rej) => { try { const r = indexedDB.open('mondo-voce-mamma', 1); r.onupgradeneeded = () => r.result.createObjectStore('msg'); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); } catch (e) { rej(e); } }); },
  async get(id) { try { const d = await this.db(); return await new Promise(r => { const q = d.transaction('msg').objectStore('msg').get(id); q.onsuccess = () => r(q.result || null); q.onerror = () => r(null); }); } catch (e) { return null; } },
  async put(id, blob) { const d = await this.db(); return new Promise((r, j) => { const t = d.transaction('msg', 'readwrite'); t.objectStore('msg').put(blob, id); t.oncomplete = r; t.onerror = () => j(t.error); }); },
  async del(id) { const d = await this.db(); return new Promise(r => { const t = d.transaction('msg', 'readwrite'); t.objectStore('msg').delete(id); t.oncomplete = r; t.onerror = r; }); },
  can() { return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder); }
};
let crRec = null;
async function crVoceBox(box, id) {
  const V = CORPO.voce_mamma || {}, blob = await CrVoce.get(id);
  if (!box.isConnected) return;
  const url = blob ? URL.createObjectURL(blob) : '';
  box.innerHTML = '<p class="cr-vt">🎙️ <b>La voce della mamma</b></p>' + (blob ? '<audio controls preload="none" src="' + url + '"></audio>' : '<p class="cr-nota">' + esc(V.vuoto || '') + '</p>') +
    (CrVoce.can() ? '<div class="cr-strip"><button type="button" class="btn small ghost" data-rec>' + (blob ? '🎙️ Registra di nuovo (per la mamma)' : '🎙️ Registra (per la mamma)') + '</button>' + (blob ? '<button type="button" class="btn small ghost" data-del>🗑️ Cancella</button>' : '') + '</div><p class="cr-nota">' + esc(V.invito || '') + ' Resta solo su questo iPad.</p>' : '');
  const rb = box.querySelector('[data-rec]'), db = box.querySelector('[data-del]');
  if (db) db.addEventListener('click', async () => { if (confirm('Cancellare il messaggio della mamma?')) { await CrVoce.del(id); crVoceBox(box, id); } });
  if (rb) rb.addEventListener('click', async () => {
    if (crRec) { crRec.stop(); return; }
    let st; try { st = await navigator.mediaDevices.getUserMedia({ audio: true }); } catch (e) { toast('Il microfono non è disponibile'); return; }
    const ch = [], r = new MediaRecorder(st); crRec = r;
    r.ondataavailable = e => { if (e.data && e.data.size) ch.push(e.data); };
    r.onstop = async () => { clearTimeout(r._t); st.getTracks().forEach(t => t.stop()); crRec = null; if (ch.length) { await CrVoce.put(id, new Blob(ch, { type: r.mimeType || 'audio/mp4' })); } crVoceBox(box, id); };
    r.start(); r._t = setTimeout(() => { try { r.stop(); } catch (e) {} }, 120000);
    rb.textContent = '⏹️ Ferma (massimo 2 minuti)'; rb.classList.add('cr-recon');
  });
}

/* ---------- pagina ---------- */
PAGES.corpo = el => {
  if (!CR_OK()) { el.innerHTML = '<p>Sezione in arrivo.</p>'; return; }
  if (!['insieme', 'dom', 'kit', 'cal', 'cura'].includes(crTab)) crTab = 'insieme';
  const tabs = [['insieme', '💬 Ne parliamo insieme'], ['dom', '❓ Le mie domande'], ['kit', '🎒 Kit e scuola'], ['cal', '📅 Il mio calendario'], ['cura', '🧼 Mi lavo e mi prendo cura']];
  el.innerHTML = '<div class="oro-top"><div><h1 class="v2-h1">🌸 Il mio corpo che cresce</h1><p class="v2-sub">' + esc(CORPO.invito) + '</p></div></div>' +
    '<div class="oro-tabs">' + tabs.map(t => '<button type="button" class="cu-chip" data-ct="' + t[0] + '" aria-pressed="' + (t[0] === crTab) + '">' + t[1] + '</button>').join('') + '</div><div id="cr-body"></div>';
  el.querySelectorAll('[data-ct]').forEach(b => b.addEventListener('click', () => { if (crRec) { try { crRec.stop(); } catch (e) {} } crTab = b.dataset.ct; PAGES.corpo(el); }));
  ({ insieme: crInsieme, dom: crDomande, kit: crKit, cal: crCal, cura: crCura })[crTab]($('cr-body'));
};
function crFold(box) { box.querySelectorAll('details[data-cr]').forEach(d => d.addEventListener('toggle', () => { if (d.open) crLetto(d.dataset.cr); })); }
const crCard = (x, inner, open) => '<details class="card cr-c" data-cr="' + x.id + '"' + (open ? ' open' : '') + '><summary><span class="cr-ic">' + x.ic + '</span><b>' + esc(x.t) + '</b>' + (store.get('corpo-letto', {})[x.id] ? '<i class="cr-ok" aria-label="già vista">✓</i>' : '') + '<span class="cr-fz" aria-hidden="true">▾</span></summary>' + inner + '</details>';
function crInsieme(box) {
  box.innerHTML = '<div class="cr-grid">' + CORPO.chiacchierate.map((x, i) => crCard(x,
    (CR_DIS[x.id] ? '<div class="cr-dis">' + CR_DIS[x.id]() + '</div>' : '') +
    '<p class="cr-p cr-ap">' + esc(x.apertura) + '</p>' +
    '<p class="cr-p"><span class="cr-e c">💭 Per cominciare</span> ' + esc(x.domanda) + '</p>' +
    '<div class="cr-p"><span class="cr-e a">🙋‍♀️ Chiedi alla mamma</span><ul>' + x.chiedi.map(c => '<li>' + esc(c) + '</li>').join('') + '</ul></div>' +
    '<div class="cr-p"><span class="cr-e b">📌 Da sapere</span><ul>' + x.sapere.map(c => '<li>' + esc(c) + '</li>').join('') + '</ul></div>' +
    (x.nota ? '<p class="cr-nota">' + esc(x.nota) + '</p>' : '') +
    '<div class="cr-voce" data-v="' + x.id + '"></div>', i === 0)).join('') + '</div>';
  crFold(box);
  box.querySelectorAll('[data-v]').forEach(v => crVoceBox(v, v.dataset.v));
}
/* ---------- ❓ le mie domande: solo su questo iPad, mai inviate ---------- */
function crDomande(box) {
  const L = store.get('corpo-domande', []);
  box.innerHTML = '<div class="cr-grid"><div class="card cr-c"><h3 class="cr-h">❓ Le mie domande</h3><p class="cr-p">' + esc(CORPO.domande_intro) + '</p>' +
    '<textarea id="cr-dq" rows="3" class="cr-ta" placeholder="Scrivi qui la tua domanda…"></textarea><button type="button" class="btn small" id="cr-dadd">➕ Aggiungi</button><p class="cr-nota">🔒 Restano solo su questo iPad.</p></div>' +
    '<div class="card cr-c"><h3 class="cr-h">📝 Da chiedere</h3>' + (L.length ? L.map((d, i) => '<label class="cr-chk"><input type="checkbox" data-dq="' + i + '"' + (d.ok ? ' checked' : '') + '><span' + (d.ok ? ' class="cr-fatta"' : '') + '>' + esc(d.t) + '<small>' + (d.ok ? 'già chiesta' : 'scritta il ' + new Date(d.d + 'T12:00').toLocaleDateString('it-IT', { day: 'numeric', month: 'long' })) + '</small></span><button type="button" class="btn small ghost" data-dx="' + i + '" aria-label="Cancella">🗑️</button></label>').join('') : '<p class="cr-p">Ancora nessuna domanda.</p>') + '</div></div>';
  $('cr-dadd').addEventListener('click', () => { const t = $('cr-dq').value.trim(); if (!t) return; const v = store.get('corpo-domande', []); v.push({ t: t.slice(0, 400), d: todayIso(), ok: false }); store.set('corpo-domande', v); crDomande(box); });
  box.querySelectorAll('[data-dq]').forEach(c => c.addEventListener('change', () => { const v = store.get('corpo-domande', []); v[+c.dataset.dq].ok = c.checked; store.set('corpo-domande', v); crDomande(box); }));
  box.querySelectorAll('[data-dx]').forEach(b => b.addEventListener('click', e => { e.preventDefault(); const v = store.get('corpo-domande', []); v.splice(+b.dataset.dx, 1); store.set('corpo-domande', v); crDomande(box); }));
}
function crKit(box) {
  const K = store.get('corpo-kit', {}), S = store.get('corpo-scena', { fatta: 0 });
  box.innerHTML = '<div class="cr-grid"><div class="card cr-c"><h3 class="cr-h">🎒 Il mio kit nello zaino</h3><p class="cr-p">' + esc(CORPO.kit_intro) + '</p>' +
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
  box.innerHTML = '<p class="cr-q"><b>' + (i + 1) + '/' + P.length + '</b> ' + esc(p.domanda) + ' ' + crSay(p.domanda) + '</p><div class="cr-sc">' + p.scelte.map((s, j) => '<button type="button" class="btn ghost cr-sb" data-s="' + j + '">' + esc(s.t) + '</button>').join('') + '</div><div id="cr-fb"></div>';
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
        (mi ? '<p class="cr-nota">🧭 Missione: <b>' + esc(mi[0]) + '</b> — ' + esc(mi[1]) + '</p>' : '') + crSay(x.t + '. ' + x.scopo + ' ' + F.map(f => f[1]).join(' ')));
    }).join('') + '</div>';
  crFold(box);
  $('cr-mani').addEventListener('click', () => openTimer('mani'));
  $('cr-denti').addEventListener('click', () => openTimer('denti'));
  $('cr-lez').addEventListener('click', () => openMateria('lavo'));
}
