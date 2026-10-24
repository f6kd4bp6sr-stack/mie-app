/* ================= 🗓️ LA MIA CLASSE =================
   Progetti, uscite e date della classe: restano SOLO su questo iPad (chiave «classe»), mai nel codice pubblico.
   Si caricano una volta con il link speciale preparato per mamma o papà: …/#classe=<dati in base64url>
   (la parte dopo # non arriva mai al server); poi si possono aggiungere e togliere appuntamenti a mano.
   Forma dei dati: { v: 1, anno, eventi: [{ id, t, d: 'AAAA-MM-GG', ic, note, vai }], uscite: [{ t, ic, note, vai }],
   progetti: [{ g, ic, voci: [{ t, note, vai }] }], motto: { t, voci: [] } }
   «vai» apre un argomento dell'app collegato (materia:argomento). */
if (!$('p-classe')) { const s = document.createElement('section'); s.id = 'p-classe'; s.dataset.page = ''; s.hidden = true; $('main').appendChild(s); }
const clData = () => { const c = store.get('classe', null); return c && typeof c === 'object' ? c : null; };
const clDay = s => { const m = String(s || '').match(/^(\d{4})-(\d\d)-(\d\d)$/); return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null; };
function clDecode(b64) {
  const s = b64.replace(/-/g, '+').replace(/_/g, '/'), bin = atob(s + '==='.slice((s.length + 3) % 4));
  const bytes = Uint8Array.from(bin, c => c.charCodeAt(0));
  const o = JSON.parse(new TextDecoder().decode(bytes));
  if (!o || typeof o !== 'object' || o.v !== 1) throw new Error('formato');
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
    $('cl-si').addEventListener('click', () => { store.set('classe', o); closeModal(); go('classe'); });
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
  const ev = (C.eventi || []).map(e => Object.assign({}, e, { day: clDay(e.d) })).filter(e => e.day).sort((a, b) => a.day - b.day);
  const next = ev.filter(e => e.day >= today), past = ev.filter(e => e.day < today);
  const when = e => { const n = Math.round((e.day - today) / 86400000); return n === 0 ? 'oggi!' : n === 1 ? 'domani' : n > 0 ? 'tra ' + n + ' giorni' : ''; };
  const date = e => e.day.getDate() + ' ' + MESI[e.day.getMonth()];
  const evRow = (e, old) => '<div class="cl-ev' + (old ? ' old' : '') + '"><span class="cl-ic">' + esc(e.ic || '📌') + '</span><div class="cl-tx"><b>' + esc(e.t) + '</b><small>' + date(e) + (old ? '' : ' · <em>' + when(e) + '</em>') + (e.note ? ' · ' + esc(e.note) : '') + '</small>' + clVai(e.vai) + '</div>' + (e.mio ? '<button type="button" class="cl-del" data-del="' + esc(e.id) + '" aria-label="Togli">✕</button>' : '') + '</div>';
  el.innerHTML = head +
    (next[0] ? '<div class="cl-hero"><span>' + esc(next[0].ic || '📌') + '</span><div><small>Il prossimo appuntamento</small><b>' + esc(next[0].t) + '</b><em>' + date(next[0]) + ' · ' + when(next[0]) + '</em></div></div>' : '') +
    '<div class="cl-card"><h2>📆 Le date</h2>' + (next.length ? next.map(e => evRow(e)).join('') : '<p class="cl-mini">Nessuna data in arrivo.</p>') +
      '<button type="button" class="btn ghost small" id="cl-add">➕ Aggiungi un appuntamento</button>' +
      (past.length ? '<details class="cl-past"><summary>Già fatti (' + past.length + ')</summary>' + past.reverse().map(e => evRow(e, true)).join('') + '</details>' : '') + '</div>' +
    ((C.uscite || []).length ? '<div class="cl-card"><h2>🚌 Le uscite dell’anno</h2><p class="cl-mini">Le date arrivano durante l’anno.</p>' + C.uscite.map(u => '<div class="cl-ev"><span class="cl-ic">' + esc(u.ic || '🚌') + '</span><div class="cl-tx"><b>' + esc(u.t) + '</b>' + (u.note ? '<small>' + esc(u.note) + '</small>' : '') + clVai(u.vai) + '</div></div>').join('') + '</div>' : '') +
    ((C.progetti || []).length ? '<div class="cl-card"><h2>🧩 I progetti</h2>' + C.progetti.map(g => '<h3>' + esc((g.ic ? g.ic + ' ' : '') + g.g) + '</h3>' + (g.voci || []).map(v => '<div class="cl-pr"><b>' + esc(v.t) + '</b>' + (v.note ? '<small>' + esc(v.note) + '</small>' : '') + clVai(v.vai) + '</div>').join('')).join('') + '</div>' : '') +
    (C.motto ? '<div class="cl-card cl-motto"><h2>🧭 ' + esc(C.motto.t || 'Tutto funziona se…') + '</h2>' + (C.motto.sotto ? '<p>' + esc(C.motto.sotto) + '</p>' : '') + '<div class="cl-chips">' + (C.motto.voci || []).map(v => '<span>' + esc(v) + '</span>').join('') + '</div></div>' : '') + clFoot;
  $('cl-add').addEventListener('click', () => clAddForm()); $('cl-paste').addEventListener('click', clPaste);
  el.querySelectorAll('[data-vai]').forEach(b => b.addEventListener('click', () => spGoTopic(b.dataset.vai)));
  el.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => { const c = clData(); c.eventi = (c.eventi || []).filter(e => e.id !== b.dataset.del); store.set('classe', c); PAGES.classe(el); }));
};
function clAddForm() {
  openModal('<div class="big" style="font-size:22px">➕ Nuovo appuntamento</div><label class="cl-lab">Che cosa?<input id="cl-t" maxlength="60" placeholder="es. Verifica di storia"></label><label class="cl-lab">Quando?<input id="cl-d" type="date"></label><label class="cl-lab">Una nota (se vuoi)<input id="cl-n" maxlength="80" placeholder="es. portare il quaderno"></label><div class="sp-row"><button type="button" class="btn ghost" id="cl-x">Annulla</button><button type="button" class="btn" id="cl-ok">Salva</button></div>');
  $('cl-x').addEventListener('click', closeModal);
  $('cl-ok').addEventListener('click', () => {
    const t = $('cl-t').value.trim(), d = $('cl-d').value; if (!t || !clDay(d)) { floatText($('cl-ok'), 'Scrivi che cosa e quando'); return; }
    const c = clData() || { v: 1, eventi: [] }; c.eventi = c.eventi || [];
    c.eventi.push({ id: 'm' + Date.now().toString(36), t, d, ic: '📌', note: $('cl-n').value.trim(), mio: true });
    store.set('classe', c); closeModal(); go('classe');
  });
}
