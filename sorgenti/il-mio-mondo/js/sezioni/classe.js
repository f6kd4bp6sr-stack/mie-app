/* ================= 🗓️ LA MIA CLASSE =================
   Progetti, uscite e date della classe: restano SOLO su questo iPad (chiave «classe»), mai nel codice pubblico.
   Si caricano una volta con il link speciale preparato per mamma o papà: …/#classe=<dati in base64url>
   (la parte dopo # non arriva mai al server); poi si possono aggiungere e togliere appuntamenti a mano.
   Forma dei dati: { v: 1, anno, eventi: [{ id, t, d: 'AAAA-MM-GG', ic, note, vai }], uscite: [{ t, ic, note, vai }],
   progetti: [{ g, ic, voci: [{ t, note, vai }] }], motto: { t, voci: [] } }
   «vai» apre un argomento dell'app collegato (materia:argomento).
   Autonomia: è lei a completare le uscite («🕵️ da scoprire»: chiede alla maestra quando e dove, e lo scrive), ad aggiungere
   verifiche e appuntamenti e, dopo, a raccontare nel 📅 Diario com'è andata (openTripNote). Campi scritti da lei:
   d (quando), dove, porta (che cosa portare), mio (voce aggiunta da lei). Un link nuovo non cancella quello che ha scritto. */
if (!$('p-classe')) { const s = document.createElement('section'); s.id = 'p-classe'; s.dataset.page = ''; s.hidden = true; $('main').appendChild(s); }
const clData = () => { const c = store.get('classe', null); return c && typeof c === 'object' ? c : null; };
const clSlug = t => 'u-' + String(t).toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
const clId = (x, kind) => x.id || (kind === 'u' ? clSlug(x.t) : 'e-' + clSlug(x.t).slice(2));
/* tutte le voci con una data (appuntamenti + uscite di cui ha scoperto la data), con il loro posto nei dati */
function clDated(C) {
  const L = [];
  (C.eventi || []).forEach((e, i) => { const d = clDay(e.d); if (d) L.push(Object.assign({}, e, { day: d, id: clId(e, 'e'), k: 'eventi', i })); });
  (C.uscite || []).forEach((u, i) => { const d = clDay(u.d); if (d) L.push(Object.assign({ ic: '🚌' }, u, { day: d, id: clId(u, 'u'), k: 'uscite', i })); });
  return L.sort((a, b) => a.day - b.day);
}
/* il racconto «Com’è andata?» si chiede per uscite, spettacoli e sport, non per verifiche e compiti */
const clRacconta = x => x.k === 'uscite' || !['📝', '📚'].includes(x.ic);
const clIsoOf = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
/* per il Diario: uscite e appuntamenti passati da poco (oggi e ultimi 14 giorni) senza ancora il racconto */
function clPending() {
  const C = clData(); if (!C) return [];
  const t = clDay(todayIso());
  return clDated(C).filter(x => clRacconta(x) && x.day <= t && Math.round((t - x.day) / 86400000) <= 14 && !x.noNote && !tripNote(clIsoOf(x.day), x.id)).map(x => ({ day: clIsoOf(x.day), id: x.id, t: x.t, ic: x.ic })).reverse();
}
/* per le novità del drago: il drago chiede a lei */
function clNews() {
  const C = clData(); if (!C) return [];
  const N = [], t = clDay(todayIso()), D2 = clDated(C);
  const tom = D2.find(x => Math.round((x.day - t) / 86400000) === 1);
  if (tom) N.push({ k: 'cl-dom', ic: '🎒', t: 'Domani: ' + tom.t, s: tom.porta ? 'Da portare: ' + tom.porta : 'Preparalo stasera!', go: () => go('classe') });
  const P = clPending(); if (P.length) N.push({ k: 'cl-note', ic: '📝', t: 'Com’è andata «' + P[0].t + '»?', s: 'Raccontalo nel diario', go: () => openTripNote(P[0].day, P[0].id, P[0].t) });
  const U = (C.uscite || []).filter(u => !clDay(u.d));
  if (U.length) { const u = U[Math.floor(clDay(todayIso()) / 86400000) % U.length]; N.push({ k: 'cl-det', ic: '🕵️', t: 'Missione detective: quando sarà «' + u.t + '»?', s: 'Chiedilo alla maestra e scrivilo tu (+3 💎)', go: () => go('classe') }); }
  return N;
}
const clDay = s => { const m = String(s || '').match(/^(\d{4})-(\d\d)-(\d\d)$/); return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null; };
function clDecode(b64) {
  const s = b64.replace(/-/g, '+').replace(/_/g, '/'), bin = atob(s + '==='.slice((s.length + 3) % 4));
  const bytes = Uint8Array.from(bin, c => c.charCodeAt(0));
  const o = JSON.parse(new TextDecoder().decode(bytes));
  if (!o || typeof o !== 'object' || o.v !== 1) throw new Error('formato');
  return o;
}
/* un link nuovo tiene quello che ha scritto lei: le sue voci e quando, dove e che cosa portare delle uscite */
function clMerge(o, old) {
  if (!old) return o;
  const mine = (old.eventi || []).filter(e => e.mio), ids = new Set((o.eventi || []).map(e => clId(e, 'e')));
  o.eventi = (o.eventi || []).concat(mine.filter(e => !ids.has(clId(e, 'e'))));
  (o.eventi || []).forEach(e => { const p = (old.eventi || []).find(x => clId(x, 'e') === clId(e, 'e')); if (p) ['dove', 'porta'].forEach(k => { if (p[k] && !e[k]) e[k] = p[k]; }); });
  (o.uscite || []).forEach(u => { const p = (old.uscite || []).find(x => clId(x, 'u') === clId(u, 'u')); if (p) ['d', 'dove', 'porta', 'gem'].forEach(k => { if (p[k] && !u[k]) u[k] = p[k]; }); });
  return o;
}
/* link speciale: chiede conferma, salva sull'iPad e toglie i dati dall'indirizzo */
function clImport(code) {
  const m = code ? [0, code] : String(location.hash || '').match(/^#classe=([A-Za-z0-9_-]+)$/); if (!m) return;
  if (!code) try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
  let o; try { o = clDecode(m[1]); } catch (e) { setTimeout(() => { openModal('<div style="font-size:44px">⚠️</div><p style="font-weight:800">Il link della classe non si legge: chiedi a papà di rimandarlo.</p><button type="button" class="btn" id="cl-ko" data-focus>Ok</button>'); $('cl-ko').addEventListener('click', closeModal); }, 600); return; }
  setTimeout(() => {
    closeModal();
    const n = (o.eventi || []).length + (o.uscite || []).length + (o.progetti || []).reduce((a, g) => a + (g.voci || []).length, 0);
    openModal('<div style="font-size:50px">🗓️</div><div class="big" style="font-size:24px">La mia classe</div><p style="font-weight:700">Salvo su questo iPad ' + n + ' voci: progetti, uscite e date' + (o.anno ? ' dell’anno ' + esc(o.anno) : '') + '.' + (clData() ? ' Le voci di prima vengono sostituite.' : '') + '</p><div class="sp-row"><button type="button" class="btn ghost" id="cl-no">Annulla</button><button type="button" class="btn" id="cl-si" data-focus>✅ Salva</button></div>');
    $('cl-no').addEventListener('click', closeModal);
    $('cl-si').addEventListener('click', () => { store.set('classe', clMerge(o, clData())); closeModal(); go('classe'); });
  }, 700);
}
clImport(); window.addEventListener('hashchange', () => clImport());
/* 🔗 per il genitore: sull'iPad l'app sulla Home non vede i dati di Safari, quindi il link si può anche incollare qui */
function clPaste() {
  openModal('<div class="big" style="font-size:22px">🔗 Link della classe</div><p style="font-weight:700">Per il genitore: incolla qui il link speciale della classe (tieni premuto → Incolla).</p><textarea id="cl-lk" rows="4" style="width:100%;font:inherit;font-size:15px;border-radius:12px;border:2px solid var(--line);padding:10px" placeholder="https://…#classe=…"></textarea><div class="sp-row"><button type="button" class="btn ghost" id="cl-x">Annulla</button><button type="button" class="btn" id="cl-ok">Carica</button></div>');
  $('cl-x').addEventListener('click', closeModal);
  $('cl-ok').addEventListener('click', () => { const m = $('cl-lk').value.replace(/\s+/g, '').match(/classe=([A-Za-z0-9_-]+)/); if (!m) { floatText($('cl-ok'), 'Non trovo il link'); return; } clImport(m[1]); });
}
function clVai(ref) { if (!ref || typeof spGoTopic !== 'function') return ''; const t = spTitle(ref); return t.u ? '<button type="button" class="cl-vai" data-vai="' + esc(ref) + '">' + esc((t.ic || t.u.ic) + ' ' + t.n) + ' →</button>' : ''; }
PAGES.classe = el => {
  const C = clData(), today = clDay(todayIso()), clFoot = '<p class="cl-foot"><button type="button" class="btn ghost small" id="cl-paste">🔗 Per il genitore: incolla il link della classe</button></p>';
  const head = '<h1 class="v2-h1">🗓️ La mia classe</h1><p class="v2-sub">Progetti, uscite e date dell’anno' + (C && C.anno ? ' ' + esc(C.anno) : '') + '. Restano solo su questo iPad.</p>';
  if (!C) {
    el.innerHTML = head + '<div class="cl-card"><p>Qui mamma o papà possono mettere i progetti e le uscite della classe, con le date importanti.</p><p class="cl-mini">Si caricano con il link speciale che papà apre su questo iPad. Puoi anche cominciare da sola.</p><button type="button" class="v2-btn" id="cl-add" style="max-width:420px">➕ Aggiungi un appuntamento</button></div>' + clFoot;
    $('cl-add').addEventListener('click', () => clAddForm()); $('cl-paste').addEventListener('click', clPaste); return;
  }
  const ev = clDated(C), todo = (C.uscite || []).map((u, i) => ({ u, i })).filter(x => !clDay(x.u.d));
  const next = ev.filter(e => e.day >= today), past = ev.filter(e => e.day < today);
  const when = e => { const n = Math.round((e.day - today) / 86400000); return n === 0 ? 'oggi!' : n === 1 ? 'domani' : n > 0 ? 'tra ' + n + ' giorni' : ''; };
  const date = e => e.day.getDate() + ' ' + MESI[e.day.getMonth()];
  const evRow = (e, old) => { const day = clIsoOf(e.day), canTn = clRacconta(e) && (old || (e.day - today) === 0), tn = canTn ? tripNote(day, e.id) : null;
    return '<div class="cl-ev' + (old ? ' old' : '') + '"><span class="cl-ic">' + esc(e.ic || '📌') + '</span><div class="cl-tx"><b>' + esc(e.t) + '</b><small>' + date(e) + (old ? '' : ' · <em>' + when(e) + '</em>') + (e.note ? ' · ' + esc(e.note) : '') + '</small>' +
      (e.dove ? '<small>📍 ' + esc(e.dove) + '</small>' : '') + (e.porta ? '<small>🎒 Da portare: ' + esc(e.porta) + '</small>' : '') + clVai(e.vai) +
      (canTn ? '<button type="button" class="cl-vai cl-nota" data-tn="' + day + '|' + esc(e.id) + '" data-tt="' + esc(e.t) + '">' + (tn ? '📝 Il mio racconto ✓' : '📝 Com’è andata? Scrivilo nel diario') + '</button>' : '') + '</div>' +
      '<button type="button" class="cl-del" data-ed="' + e.k + '|' + e.i + '" aria-label="Modifica">✏️</button>' + (e.mio && e.k === 'eventi' ? '<button type="button" class="cl-del" data-del="' + esc(e.id) + '" aria-label="Togli">✕</button>' : '') + '</div>'; };
  el.innerHTML = head +
    (next[0] ? '<div class="cl-hero"><span>' + esc(next[0].ic || '📌') + '</span><div><small>Il prossimo appuntamento</small><b>' + esc(next[0].t) + '</b><em>' + date(next[0]) + ' · ' + when(next[0]) + '</em></div></div>' : '') +
    '<div class="cl-card"><h2>📆 Le date</h2>' + (next.length ? next.map(e => evRow(e)).join('') : '<p class="cl-mini">Nessuna data in arrivo.</p>') +
      '<button type="button" class="btn ghost small" id="cl-add">➕ Aggiungi un appuntamento</button>' +
      (past.length ? '<details class="cl-past"><summary>Già fatti (' + past.length + ')</summary>' + past.reverse().map(e => evRow(e, true)).join('') + '</details>' : '') + '</div>' +
    (todo.length ? '<div class="cl-card cl-det"><h2>🕵️ Da scoprire</h2><p class="cl-mini">Sei tu la detective della classe: chiedi alla maestra <b>quando</b> e <b>dove</b> andrete, poi scrivilo qui. Ogni scoperta vale +3 💎.</p>' + todo.map(x => '<div class="cl-ev"><span class="cl-ic">' + esc(x.u.ic || '🚌') + '</span><div class="cl-tx"><b>' + esc(x.u.t) + '</b>' + (x.u.note ? '<small>' + esc(x.u.note) + '</small>' : '') + clVai(x.u.vai) + '<button type="button" class="cl-vai cl-scopri" data-ed="uscite|' + x.i + '">✏️ Ho scoperto quando!</button></div></div>').join('') + '</div>' : '') +
    ((C.progetti || []).length ? '<div class="cl-card"><h2>🧩 I progetti</h2>' + C.progetti.map(g => '<h3>' + esc((g.ic ? g.ic + ' ' : '') + g.g) + '</h3>' + (g.voci || []).map(v => '<div class="cl-pr"><b>' + esc(v.t) + '</b>' + (v.note ? '<small>' + esc(v.note) + '</small>' : '') + clVai(v.vai) + '</div>').join('')).join('') + '</div>' : '') +
    (C.motto ? '<div class="cl-card cl-motto"><h2>🧭 ' + esc(C.motto.t || 'Tutto funziona se…') + '</h2>' + (C.motto.sotto ? '<p>' + esc(C.motto.sotto) + '</p>' : '') + '<div class="cl-chips">' + (C.motto.voci || []).map(v => '<span>' + esc(v) + '</span>').join('') + '</div></div>' : '') + clFoot;
  $('cl-add').addEventListener('click', () => clAddForm()); $('cl-paste').addEventListener('click', clPaste);
  el.querySelectorAll('[data-vai]').forEach(b => b.addEventListener('click', () => spGoTopic(b.dataset.vai)));
  el.querySelectorAll('[data-ed]').forEach(b => b.addEventListener('click', () => { const [k, i] = b.dataset.ed.split('|'); clAddForm(k, +i); }));
  el.querySelectorAll('[data-tn]').forEach(b => b.addEventListener('click', () => { const [d, id] = b.dataset.tn.split('|'); openTripNote(d, id, b.dataset.tt, () => PAGES.classe(el)); }));
  el.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => { const c = clData(); c.eventi = (c.eventi || []).filter(e => e.id !== b.dataset.del); store.set('classe', c); PAGES.classe(el); }));
};
/* ➕ nuovo appuntamento o ✏️ completa una voce (k = 'eventi' | 'uscite', i = posizione): lo scrive lei */
const CL_TIPI = [['📝', 'verifica'], ['📚', 'compiti'], ['🚌', 'uscita'], ['🎭', 'spettacolo'], ['🏐', 'sport'], ['📌', 'altro']];
function clAddForm(k, i) {
  const C0 = clData(), x = k && C0 && C0[k] ? C0[k][i] : null, isU = k === 'uscite', disc = isU && x && !clDay(x.d);
  let ic = x ? x.ic || (isU ? '🚌' : '📌') : '📝';
  openModal('<div class="big" style="font-size:22px">' + (disc ? '🕵️ Hai scoperto quando?' : x ? '✏️ ' + esc(x.t) : '➕ Nuovo appuntamento') + '</div>' +
    (disc ? '<p style="font-weight:700;margin:4px 0">' + esc(x.ic || '🚌') + ' ' + esc(x.t) + '</p>' : '') +
    (x && isU ? '' : '<label class="cl-lab">✏️ Che cosa?<input id="cl-t" maxlength="60" placeholder="es. Verifica di storia" value="' + esc(x ? x.t : '') + '"></label>' +
      '<div class="cl-tipi">' + CL_TIPI.map(t => '<button type="button" class="chip" data-ic="' + t[0] + '" aria-pressed="' + (t[0] === ic) + '">' + t[0] + ' ' + t[1] + '</button>').join('') + '</div>') +
    '<label class="cl-lab">📅 Quando?<input id="cl-d" type="date" value="' + esc(x && x.d ? x.d : '') + '"></label>' +
    '<label class="cl-lab">📍 Dove? <small>(se lo sai)</small><input id="cl-w" maxlength="60" placeholder="es. al museo, in palestra" value="' + esc(x && x.dove ? x.dove : '') + '"></label>' +
    '<label class="cl-lab">🎒 Che cosa porto? <small>(se serve)</small><input id="cl-p" maxlength="80" placeholder="es. pranzo al sacco, quaderno" value="' + esc(x && x.porta ? x.porta : '') + '"></label>' +
    (x && isU ? '' : '<label class="cl-lab">Una nota (se vuoi)<input id="cl-n" maxlength="80" value="' + esc(x && x.note ? x.note : '') + '"></label>') +
    '<div class="sp-row"><button type="button" class="btn ghost" id="cl-x">Annulla</button><button type="button" class="btn" id="cl-ok">Salva</button></div>');
  document.querySelectorAll('.cl-tipi [data-ic]').forEach(b => b.addEventListener('click', () => { ic = b.dataset.ic; document.querySelectorAll('.cl-tipi [data-ic]').forEach(c => c.setAttribute('aria-pressed', c === b)); }));
  $('cl-x').addEventListener('click', closeModal);
  $('cl-ok').addEventListener('click', () => {
    const t = $('cl-t') ? $('cl-t').value.trim() : x.t, d = $('cl-d').value, dove = $('cl-w').value.trim(), porta = $('cl-p').value.trim();
    if (!t || (!clDay(d) && !(x && isU))) { floatText($('cl-ok'), 'Scrivi che cosa e quando'); return; }
    const c = clData() || { v: 1, eventi: [] }; c.eventi = c.eventi || [];
    if (x) { const y = c[k][i]; if (!isU) { y.t = t; y.ic = ic; y.note = $('cl-n').value.trim(); } if (clDay(d)) y.d = d; else delete y.d; y.dove = dove; y.porta = porta; if (isU && !y.id) y.id = clSlug(y.t); }
    else c.eventi.push({ id: 'm' + Date.now().toString(36), t, d, ic, note: $('cl-n').value.trim(), dove, porta, mio: true });
    store.set('classe', c);
    const btn = $('cl-ok');
    const prize = disc && clDay(d) && !x.gem; if (prize) { c[k][i].gem = 1; store.set('classe', c); Gems.add(3); try { cheer(btn, 'Brava detective!'); } catch (e) {} }
    ding(); closeModal(); go('classe');
    if (prize) toastV2('🕵️ Scoperta! +3 💎 — ' + D.name + ' la mette tra le date della classe.');
  });
}
