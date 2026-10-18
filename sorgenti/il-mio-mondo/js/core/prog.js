/* ================= PROGRESSI PER MATERIA =================
   In store 'prog': { mate: {ok, ko}, scienze: {ok, ko}, sport: {ok, ko}, storia: {ok, ko}, geo: …, ita: …, eng: … }
   Si aggiorna a ogni risposta. Resta sull'iPad, entra nelle copie di sicurezza e si può condividere. */
let __progLast = 0;
function progSubject() {
  if (current === 'scopri') return typeof scopriSel === 'string' ? scopriSel : 'scopri';
  return ['mate', 'scienze', 'sport'].includes(current) ? current : null;
}
function progMark(ok, subj) {
  const now = Date.now(); if (now - __progLast < 400) return; __progLast = now;  // una sola volta per risposta
  const s = subj || progSubject(); if (!s) return;
  const p = store.get('prog', {}); const r = p[s] || { ok: 0, ko: 0 };
  if (ok) r.ok++; else r.ko++;
  p[s] = r; store.set('prog', p);
  // storico giorno per giorno (ultimi 180 giorni), per vedere i progressi nel tempo
  const day = todayIso(), h = store.get('prog-days', {});
  const dd = h[day] || {}, dr = dd[s] || { ok: 0, ko: 0 };
  if (ok) dr.ok++; else dr.ko++;
  dd[s] = dr; h[day] = dd;
  Object.keys(h).sort().slice(0, Math.max(0, Object.keys(h).length - 180)).forEach(k => delete h[k]);
  store.set('prog-days', h);
  progAutoSave();
}
/* Salvataggio automatico: la bambina non deve fare nulla.
   Ogni risposta è già scritta subito nella memoria dell'iPad; pochi secondi dopo
   viene aggiornata anche la copia di sicurezza del giorno (IndexedDB, ultime 30 giornate). */
let __progTimer = null;
function progAutoSave() {
  clearTimeout(__progTimer);
  __progTimer = setTimeout(() => { __progTimer = null; if (typeof saveAllNow === 'function') saveAllNow().then(r => { if (r && r.ok) store.set('__progSaved', Date.now(), true); }).catch(() => {}); }, 3000);
}
function progFlush() { if (__progTimer) { clearTimeout(__progTimer); __progTimer = null; try { dailySnapshot(); store.set('__progSaved', Date.now(), true); } catch (e) {} } }
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') progFlush(); });
window.addEventListener('pagehide', progFlush);
function progName(id) {
  if (id === 'mate') return '🔢 Matematica';
  if (id === 'scienze') return '🔬 Scienze';
  if (id === 'sport') return '🤸‍♀️ Sport';
  const s = (typeof SCOPRI !== 'undefined') && SCOPRI.find(x => x.id === id);
  return s ? s.ic + ' ' + s.name : id;
}
function progRows() {
  const p = store.get('prog', {});
  const order = ['mate', 'scienze'].concat((typeof SCOPRI !== 'undefined' ? SCOPRI.map(s => s.id) : []), ['sport']);
  Object.keys(p).forEach(k => { if (!order.includes(k)) order.push(k); });
  return order.filter(k => p[k] && (p[k].ok + p[k].ko) > 0).map(k => { const t = p[k].ok + p[k].ko; return { id: k, name: progName(k), ok: p[k].ok, ko: p[k].ko, tot: t, pc: Math.round(p[k].ok / t * 100) }; });
}
function progText() {
  const rows = progRows(), d = new Date();
  const tot = rows.reduce((a, r) => ({ ok: a.ok + r.ok, ko: a.ko + r.ko }), { ok: 0, ko: 0 });
  const n = tot.ok + tot.ko;
  return '📊 Progressi di ' + (childName() || 'studio') + ' — ' + d.toLocaleDateString('it-IT') + '\n\n' +
    (rows.length ? rows.map(r => r.name + ': ✅ ' + r.ok + (r.ok === 1 ? ' giusta' : ' giuste') + ' · ❌ ' + r.ko + (r.ko === 1 ? ' sbagliata' : ' sbagliate') + ' (' + r.pc + '%)').join('\n') : 'Ancora nessuna risposta.') +
    (n ? '\n\nTotale: ✅ ' + tot.ok + ' · ❌ ' + tot.ko + ' · ' + Math.round(tot.ok / n * 100) + '% giuste' : '');
}
function progCSV() {
  const h = store.get('prog-days', {});
  const days = Object.keys(h).sort().map(d => Object.keys(h[d]).map(k => [d, progName(k).replace(/^\S+\s/, ''), k, h[d][k].ok, h[d][k].ko].join(';')).join('\n')).filter(Boolean).join('\n');
  return 'materia;id;giuste;sbagliate;totale;percentuale_giuste\n' + progRows().map(r => [r.name.replace(/^\S+\s/, ''), r.id, r.ok, r.ko, r.tot, r.pc].join(';')).join('\n') + '\n' +
    (days ? '\ngiorno;materia;id;giuste;sbagliate\n' + days + '\n' : '');
}
async function progShare(btn) {
  const text = progText(), d = new Date(), fn = 'progressi-' + d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0') + '.csv';
  const csv = '﻿' + progCSV();
  try {
    const f = new File([csv], fn, { type: 'text/csv' });
    if (navigator.canShare && navigator.canShare({ files: [f] })) { await navigator.share({ title: 'Progressi', text: text, files: [f] }); return; }
    if (navigator.share) { await navigator.share({ title: 'Progressi', text: text }); return; }
  } catch (e) { if (e && e.name === 'AbortError') return; }
  let dl = null; try { dl = window.claude && window.claude.use ? await window.claude.use('downloads') : null; } catch (e) {}
  if (dl) { try { await dl.save({ filename: fn, data: csv }); return; } catch (e) { if (e && e.code === 'cancelled') return; } }
  try { await navigator.clipboard.writeText(text); if (btn) floatText(btn, 'Copiato! 📋'); return; } catch (e) {}
  try { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = fn; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500); } catch (e) {}
}
function openProg() {
  const rows = progRows();
  const bar = r => '<div style="height:10px;border-radius:6px;background:var(--bad-soft);overflow:hidden;margin-top:4px"><i style="display:block;height:100%;width:' + r.pc + '%;background:var(--c4)"></i></div>';
  openModal('<div class="big" style="font-size:26px">📊 I miei progressi</div>' +
    '<p style="font-weight:700;color:var(--ink-soft)">Risposte giuste e sbagliate in ogni materia. Sbagliare fa parte dell’imparare!</p>' + progWeek() +
    (rows.length ? '<div style="text-align:left;max-height:50vh;overflow:auto">' + rows.map(r => '<div style="padding:8px 0;border-bottom:1px solid var(--line)"><div class="row between" style="font-weight:800"><span>' + esc(r.name) + '</span><span>✅ ' + r.ok + ' · ❌ ' + r.ko + '</span></div>' + bar(r) + '</div>').join('') + '</div>'
      : '<p style="font-weight:800">Ancora nessuna risposta: prova un quiz!</p>') +
    '<p style="font-weight:700;font-size:14px;color:var(--ink-soft);margin-top:10px">' + progSavedTxt() + '</p>' +
    '<div class="row center" style="margin-top:14px"><button type="button" class="btn" id="pg-share">📤 Condividi</button><button type="button" class="btn ghost" id="pg-ok" data-focus>Chiudi</button></div>');
  $('pg-ok').addEventListener('click', closeModal);
  $('pg-share').addEventListener('click', () => progShare($('pg-share')));
}

function progSavedTxt() {
  const t = store.get('__progSaved', null) || store.get('__lastSave', null);
  const n = (typeof LOCAL2 !== 'undefined' && LOCAL2.snapCount) || 0;
  return '💾 Salvataggio automatico' + (t ? ': ultimo alle ' + new Date(t).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }) : ' attivo') +
    (n ? ' · ' + n + (n === 1 ? ' copia di sicurezza' : ' copie di sicurezza') + ' sull’iPad' : '') + ' 🔒';
}
function progWeek() {
  const h = store.get('prog-days', {}); let ok = 0, ko = 0, act = 0;
  for (let i = 0; i < 7; i++) { const d = h[iso(addDays(new Date(), -i))]; if (!d) continue; act++; Object.values(d).forEach(r => { ok += r.ok; ko += r.ko; }); }
  if (!ok && !ko) return '';
  return '<div class="pill" style="margin:6px auto 4px;display:inline-block;font-weight:800">Ultimi 7 giorni: ✅ ' + ok + ' · ❌ ' + ko + ' · ' + act + (act === 1 ? ' giorno' : ' giorni') + ' di studio</div>';
}

/* ---------- 🔗 collegamento con i genitori: disponibile da subito, anche senza risposte ---------- */
const SYNC_URL = 'https://f6kd4bp6sr-stack.github.io/mie-app/licenze/mondo-sync.js';
function linkBtnHtml() { const on = window.__mondoSyncLinked && window.__mondoSyncLinked(); return '<button type="button" class="btn ghost" id="pg-link">' + (on ? '🔗 Collegato' : '🔗 Per i genitori') + '</button>'; }
function loadSync() {
  return new Promise(res => {
    if (window.__mondoSyncOpen) return res(true);
    const sc = document.createElement('script');
    sc.src = (location.protocol.startsWith('http') && location.pathname.indexOf('/mie-app/') >= 0 ? 'licenze/mondo-sync.js' : SYNC_URL) + '?t=' + Date.now();
    sc.onload = () => res(!!window.__mondoSyncOpen); sc.onerror = () => res(false);
    document.head.appendChild(sc); setTimeout(() => res(!!window.__mondoSyncOpen), 8000);
  });
}
function bindLinkBtn() {
  const b = $('pg-link'); if (!b || b.dataset.bound) return; b.dataset.bound = 1;
  b.addEventListener('click', async e => {
    e.stopImmediatePropagation();
    b.disabled = true; const t = b.textContent; b.textContent = '⏳';
    const ok = await loadSync(); b.disabled = false; b.textContent = t;
    if (ok) window.__mondoSyncOpen();
    else floatText(b, 'Serve internet: riprova tra poco');
  }, true);
}
