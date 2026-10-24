/* ================= SALVATAGGIO: account Claude (remoto) + browser (locale) + copia di sicurezza =================
   SYNC.phase: 'start' | 'no-claude' | 'no-db' | 'no-user' | 'denied' | 'error' | 'ok'  */
const SYNC = { phase: 'start', detail: '', lastOk: null, uid: null, opens: 0, localPersist: null };
const docId = k => 'k_' + k.replace(/[^A-Za-z0-9_\-.~:@+]/g, '_');
let CLOUD = null; // { col }

// prova di memoria locale: conta le aperture. Se dopo una riapertura il conto riparte da 1, il browser non conserva i dati.
(function localCheck() {
  const n = (store.get('__opens', 0) || 0) + 1;
  SYNC.opens = n; SYNC.localPersist = store.local ? (n > 1 ? true : null) : false;
  store.set('__opens', n, true);
})();

const sleep = ms => new Promise(r => setTimeout(r, ms));
async function withRetry(fn, tries) {
  let last;
  for (let i = 0; i < (tries || 3); i++) {
    try { return await fn(); } catch (e) { last = e; if (!e || (e.code !== 'unavailable' && e.code !== 'resource_exhausted')) break; await sleep(600 + Math.random() * 900 * (i + 1)); }
  }
  throw last;
}
function syncFail(phase, detail) { SYNC.phase = phase; SYNC.detail = detail || ''; store.cloud = false; cloudBadge(); }

async function cloudConnect(fromButton) {
  if (!window.claude || typeof window.claude.use !== 'function') return syncFail('no-claude');
  SYNC.phase = 'start'; cloudBadge();
  let db = null, user = null, perms = null;
  try { [db, user, perms] = await Promise.all([window.claude.use('db'), window.claude.use('user'), window.claude.use('permissions')]); } catch (e) {}
  if (!db) return syncFail('no-db');
  if (!user) return syncFail('no-user');
  if (perms && fromButton) { try { const st = await perms.request(['db', 'user']); if (st.db === 'denied') return syncFail('denied'); } catch (e) {} }
  let uid = null; try { uid = await user.id(); } catch (e) {}
  if (!uid) return syncFail('no-user');
  SYNC.uid = uid;
  const col = db.collection('data/users/' + uid);
  let snap;
  try { snap = await withRetry(() => col.limit(1000).get()); }
  catch (e) { return syncFail(e && e.code === 'not_granted' ? 'denied' : 'error', (e && e.code) || String(e)); }
  CLOUD = { col };
  // unisci: per ogni voce vince la più recente
  const cloudT = {}; let changed = false;
  snap.docs.forEach(d => {
    const b = d.data(); if (!b || typeof b.k !== 'string') return;
    if (b.k === '__snap') { CLOUD_SNAPS.push({ d: b.d, t: b.t, v: b.v }); return; }
    if (b.k.startsWith('__') || b.k === 'link-cfg') return;
    cloudT[b.k] = b.t || 0;
    if ((b.t || 0) > (store._stamp[b.k] || 0)) { try { store.set(b.k, JSON.parse(b.v), true, b.t); changed = true; } catch (e) {} }
  });
  /* il collegamento con i genitori (chiave GitHub e chiave di cifratura) non va mai nel database dell'account */
  store._push = k => { if (k.startsWith('__') || k === 'link-cfg') return; pending.add(k); schedule(250); };
  try { col.doc(docId('link-cfg')).delete().catch(() => {}); } catch (e) {}
  Object.keys(store._mem).forEach(k => { if (!k.startsWith('__') && k !== 'link-cfg' && (store._stamp[k] || 1) > (cloudT[k] || 0)) pending.add(k); });
  // prova di scrittura e rilettura: il cloud è «ok» solo se quello che scrivo torna indietro uguale
  const probe = { k: '__probe', t: Date.now(), v: JSON.stringify(Date.now()) };
  try {
    await withRetry(() => col.doc('k___probe').set(probe));
    const back = await withRetry(() => col.doc('k___probe').get());
    if (!back.exists || back.data().v !== probe.v) return syncFail('error', 'rilettura diversa');
  } catch (e) { return syncFail(e && e.code === 'invalid_argument' ? 'denied' : 'error', (e && e.code) || String(e)); }
  SYNC.phase = 'ok'; SYNC.lastOk = new Date(); store.cloud = true;
  if (pending.size) schedule(300);
  cloudSnapshot();
  if (changed) {
    D = store.get('dragon', null); CHILD = store.get('child', null) || {}; applyChild();
    if (D) { closeModal(); updateBar(); const t = store.get('tab', 'home'); go(TABS.some(x => x[0] === t) ? t : 'home'); }
  }
  cloudBadge();
}
const pending = new Set(); let syncTimer = null, syncBusy = false;
function schedule(ms) { if (!syncTimer) syncTimer = setTimeout(flush, ms); }
async function flush() {
  syncTimer = null;
  if (!CLOUD || !pending.size) return;
  if (syncBusy) { schedule(700); return; }
  syncBusy = true;
  const keys = [...pending]; pending.clear();
  for (const k of keys) {
    const body = { k: k, t: store._stamp[k] || Date.now(), v: JSON.stringify(store._mem[k]) };
    if (body.v.length > 240000) continue;
    try { await withRetry(() => CLOUD.col.doc(docId(k)).set(body), 2); SYNC.lastOk = new Date(); }
    catch (e) { pending.add(k); if (e && (e.code === 'invalid_argument' || e.code === 'revoked' || e.code === 'not_granted' || e.code === 'quota_exceeded')) { syncBusy = false; return syncFail('error', e.code); } }
  }
  syncBusy = false;
  if (SYNC.phase !== 'ok' && !pending.size) { SYNC.phase = 'ok'; store.cloud = true; }
  cloudBadge();
  if (pending.size) schedule(4000);
}
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && pending.size) { clearTimeout(syncTimer); syncTimer = null; flush(); } });
window.addEventListener('pagehide', () => { if (pending.size) flush(); });
cloudConnect(false);

/* ---------- Stato visibile e controlli ---------- */
const SYNC_TXT = {
  start: ['💾 Salvato su questo iPad', 'ok'],
  ok: ['☁️ Salvato su questo iPad e nel tuo account', 'ok'],
  'no-claude': ['💾 Salvato su questo iPad', 'ok'],
  'no-db': ['💾 Salvato su questo iPad', 'ok'],
  'no-user': ['💾 Salvato su questo iPad', 'ok'],
  denied: ['💾 Salvato su questo iPad', 'ok'],
  error: ['💾 Salvato su questo iPad', 'ok']
};
function cloudBadge() {
  const el = document.getElementById('save-state'); if (!el) return;
  let [t, c] = SYNC_TXT[SYNC.phase] || SYNC_TXT.error;
  if (typeof VOLATILE !== 'undefined' && VOLATILE && SYNC.phase !== 'ok') { t = '⚠️ Qui Safari cancella i progressi quando lo chiudi: tocca 🔧 Verifica'; c = 'warn'; }
  el.textContent = t + (LOCAL2.lastSave && c !== 'warn' ? ' · ultimo salvataggio ' + LOCAL2.lastSave.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }) : '') + (LOCAL2.snapCount && c !== 'warn' ? ' · ' + LOCAL2.snapCount + (LOCAL2.snapCount === 1 ? ' copia giornaliera' : ' copie giornaliere') : '');
  el.className = 'save-state ' + c;
}
function diagLines() {
  const L = [];
  const yes = (ok, txt) => L.push((ok === true ? '✅ ' : ok === false ? '❌ ' : '❔ ') + txt);
  if (VOLATILE && SYNC.phase !== 'ok') L.push('❌ Aperta dentro la pagina di Claude in Safari: qui l\u2019iPad tiene i dati solo finché Safari resta aperto');
  else if (window.claude && window.claude.use) yes(true, 'Aperta dentro Claude'); else L.push('📱 Versione indipendente, fuori da Claude: salva sul dispositivo');
  if (window.claude && SYNC.phase === 'ok') {
    yes(SYNC.phase !== 'no-db', 'Salvataggio nell’account disponibile in questa app');
    yes(SYNC.phase === 'no-user' ? false : SYNC.uid ? true : null, 'Accesso a Claude riconosciuto');
    yes(SYNC.phase === 'ok', 'Prova di scrittura e rilettura nell’account' + (SYNC.detail ? ' (' + SYNC.detail + ')' : ''));
    if (SYNC.lastOk) L.push('🕒 Ultimo salvataggio riuscito: ' + SYNC.lastOk.toLocaleTimeString('it-IT'));
  }
  yes(store.local, 'Memoria del browser utilizzabile');
  yes(!!LOCAL2.idb, 'Seconda memoria locale (IndexedDB) attiva');
  yes(LOCAL2.snapCount > 0, 'Copie giornaliere automatiche: ' + LOCAL2.snapCount + ' sull\u2019iPad' + (CLOUD_SNAPS.length ? ', ' + CLOUD_SNAPS.length + ' nell\u2019account' : ''));
  L.push('⚡ Salvataggio immediato a ogni azione' + (LOCAL2.lastSave ? ' (ultimo: ' + LOCAL2.lastSave.toLocaleTimeString('it-IT') + ')' : ''));
  yes(LOCAL2.persisted, 'Memoria protetta dalla cancellazione automatica' + (LOCAL2.persisted ? '' : LOCAL2.standalone ? '' : ' (diventa possibile installando l\u2019app sulla schermata Home)'));
  if (!window.claude) yes(LOCAL2.standalone, 'App installata sulla schermata Home');
  yes(SYNC.localPersist, 'Il browser ricorda le aperture precedenti (aperture contate: ' + SYNC.opens + ')' + (SYNC.opens === 1 ? ' — chiudi e riapri, poi verifica di nuovo' : ''));
  return L;
}
function diagAdvice() {
  if (VOLATILE && SYNC.phase !== 'ok') return 'Per salvare davvero su questo iPad serve la versione installata (Netlify o GitHub Pages, aggiunta alla schermata Home). Nel frattempo, prima di chiudere, tocca 💾 Copia di sicurezza e salvala su iCloud: alla prossima apertura usa 📂 Ripristina.';
  if (SYNC.phase === 'ok') return 'Tutto a posto: i progressi restano nel tuo account Claude, su qualsiasi dispositivo in cui accedi con lo stesso account.';
  if (SYNC.phase === 'no-claude' && location.protocol.startsWith('http') && LOCAL2.standalone) return 'Versione installata: i dati restano su questo iPad, in due memorie separate. Ogni giorno l\u2019app ti chiede un tocco per salvare la copia su iCloud Drive.';
  if (SYNC.phase === 'no-claude' && location.protocol.startsWith('http')) return 'Ottimo indirizzo! Ora tocca Condividi → «Aggiungi alla schermata Home» e apri l\u2019app dall\u2019icona: così l\u2019iPad protegge i dati.';
  if (SYNC.phase === 'no-claude') return 'Stai usando il file. Sull’iPad un file aperto da «File» non conserva i dati: apri invece il link dell’app in Safari, accedendo a Claude.';
  return 'I progressi sono salvati su questo iPad, subito a ogni azione, con una copia automatica ogni giorno.';
}
function openDiag() {
  openModal('<div class="big" style="font-size:28px">🔧 Verifica salvataggio</div><ul class="diag">' + diagLines().map(l => '<li>' + esc(l) + '</li>').join('') + '</ul>' +
    '<p style="font-weight:800;text-align:left">' + esc(diagAdvice()) + '</p>' +
    '<div class="row center" style="gap:8px;flex-wrap:wrap">' + '' +
    '<button type="button" class="btn small ghost" id="dg-close" data-focus>Chiudi</button></div>', ['var(--c4)', 'var(--c4-soft)']);
  $('dg-close').addEventListener('click', closeModal);
  if ($('dg-retry')) $('dg-retry').addEventListener('click', async () => { $('dg-retry').disabled = true; $('dg-retry').textContent = '⏳ Provo…'; await cloudConnect(true); openDiag(); });
}

/* ---------- Copia di sicurezza (file) ---------- */
function backupCard() {
  const web = !window.claude && location.protocol.startsWith('http');
  return '<div class="card backup"><div class="bk-head"><b>💾 Salvataggi</b><small>Tutto si salva da solo, a ogni risposta, e ogni giorno c’è una copia completa.</small></div>' +
    '<div id="save-state" class="save-state"></div>' +
    '<div class="row" style="gap:8px;flex-wrap:wrap;margin-top:10px">' +
      (window.APP_VERSION ? '<button type="button" class="btn small ghost" id="bk-upd">🔄 Aggiorna l’app</button>' : '') +
      '<button type="button" class="btn small ghost" id="bk-snap">📅 Copie giornaliere</button><button type="button" class="btn small ghost" id="bk-save">💾 Copia su iCloud</button><button type="button" class="btn small ghost" id="bk-load">📂 Ripristina</button><button type="button" class="btn small ghost" id="bk-diag">🔧 Verifica</button>' +
      (web ? '<button type="button" class="btn small ghost" id="bk-share">📲 Altro iPad</button>' : '') + '</div>' +
    (web ? '<div class="bk-link" id="bk-link"></div><div class="bk-cloud" id="bk-cloud"></div>' : '') +
    (window.APP_VERSION ? '<div class="bk-ver">Versione ' + esc(String(window.APP_VERSION).slice(0, 6)) + '</div>' : '') +
    '<input type="file" id="bk-file" accept=".json,application/json,text/plain" hidden></div>';
}
/* ---------- 🔗 collegamento con i genitori, dentro il riquadro dei salvataggi ---------- */
window.MONDO_INLINE_LINK = true;
/* il collegamento con i genitori è conservato anche nella memoria dell'app (e nelle copie): non si perde con gli aggiornamenti */
function keepLink() {
  try {
    const ls = localStorage.getItem('msync-cfg'), st = store.get('link-cfg', null);
    if (ls) { const o = JSON.parse(ls); if (JSON.stringify(o) !== JSON.stringify(st)) store.set('link-cfg', o); }
    else if (st && st.gist) localStorage.setItem('msync-cfg', JSON.stringify(st));
  } catch (e) {}
}
keepLink();
function linkLoad() {
  return new Promise(res => {
    if (window.__mondoSyncApi) return res(true);
    let sc = document.querySelector('script[data-msync]');
    if (!sc) { sc = document.createElement('script'); sc.dataset.msync = 1; sc.src = 'licenze/mondo-sync.js?t=' + Date.now(); document.head.appendChild(sc); }
    const t0 = Date.now(), wait = () => window.__mondoSyncApi ? res(true) : Date.now() - t0 > 8000 ? res(false) : setTimeout(wait, 200); wait();
  });
}
async function linkPaint() {
  const el = $('bk-link'); if (!el) return;
  const qrRow = '<div class="bk-lk"><span>📱 <b>Mostra i progressi ai genitori</b>: si apre un QR da inquadrare con la sezione Progressi. Niente internet, niente chiavi.</span><button type="button" class="btn small" id="lk-qr">📱 Mostra il QR</button></div>';
  el.innerHTML = qrRow + '<div id="lk-gh"></div>';
  $('lk-qr').addEventListener('click', openQR);
  const ok = await linkLoad(); const gh = $('lk-gh'); if (!gh) return;
  if (!ok) return;
  const A = window.__mondoSyncApi, c0 = A.cfg(), c = c0 && c0.gist && c0.v === 2 && !c0.need ? c0 : null;
  if (c0 && A.isOld && A.isOld(c0)) A.push(false).then(() => setTimeout(linkPaint, 400));
  const el2 = gh;
  const when = t => !t ? 'mai' : new Date(t).toLocaleString('it-IT', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  if (c) {
    el2.innerHTML = '<div class="bk-lk" style="margin-top:8px"><span>🔗 <b>Invio automatico attivo</b> · 🔒 spazio privato · ' + (c.err ? '<b class="lk-err">⚠️ ' + esc(c.err) + '</b> · ultimo invio riuscito ' + when(c.last) : 'ultimo invio ' + when(c.last)) + '</span>' +
      '<button type="button" class="btn small ghost" id="lk-now">Invia ora</button><button type="button" class="btn small ghost" id="lk-qr2">📷 Nuovo QR</button><button type="button" class="btn small ghost" id="lk-key">🔑 Nuova chiave</button><button type="button" class="btn small ghost" id="lk-off">Scollega</button></div>' +
      '<div class="bk-lk-set" id="lk-keybox"' + (window.__lkKey || c.err ? '' : ' hidden') + '><small>La chiave GitHub è scaduta o non funziona? Creane una nuova (permesso <b>gist</b>, scadenza <b>1 anno</b> (l’app avvisa prima che scada)) e incollala qui: codice e collegamento restano gli stessi, i genitori non devono rifare niente.</small>' +
      '<input type="password" id="lk-newtok" placeholder="Nuova chiave GitHub (inizia con ghp_)" autocomplete="off"><button type="button" class="btn small" id="lk-savetok">Salva la chiave</button><div id="lk-msg2" class="bk-lk-msg"></div></div>';
    window.__lkKey = false;
    $('lk-now').addEventListener('click', async () => { $('lk-now').textContent = '⏳'; await A.push(true); linkPaint(); });
    $('lk-qr2').addEventListener('click', linkScan);
    $('lk-key').addEventListener('click', () => { const bx = $('lk-keybox'); bx.hidden = !bx.hidden; if (!bx.hidden) $('lk-newtok').focus(); });
    $('lk-savetok').addEventListener('click', async () => {
      const t = $('lk-newtok').value.trim(), m = $('lk-msg2');
      if (!/^(ghp_|github_pat_|gho_)/.test(t)) { m.textContent = 'Incolla la chiave completa (inizia con ghp_).'; return; }
      m.textContent = '⏳ Provo la chiave…'; $('lk-savetok').disabled = true;
      try { const o = JSON.parse(localStorage.getItem('msync-cfg') || 'null'); o.token = t; o.err = ''; localStorage.setItem('msync-cfg', JSON.stringify(o)); } catch (e) {}
      const ok = await A.push(true); keepLink();
      if (ok) { linkPaint(); refreshLinkWarn(); if (typeof toastV2 === 'function') toastV2('✅ Chiave salvata: i progressi ripartono'); }
      else { m.textContent = 'Non riuscito: ' + ((A.cfg() || {}).err || 'controlla internet') + '.'; $('lk-savetok').disabled = false; }
    });
    $('lk-off').addEventListener('click', async () => { const b = $('lk-off'); if (b.dataset.sure) { b.textContent = '⏳'; await A.off(); store.set('link-cfg', null); linkPaint(); refreshLinkWarn(); } else { b.dataset.sure = 1; b.textContent = 'Tocca ancora'; } });
  } else {
    el2.innerHTML = (c0 && c0.need ? '<div class="bk-lk lk-err" style="margin-top:8px"><span>🔒 <b>Per sicurezza il collegamento va rinnovato.</b> ' + (c0.wiped ? 'Lo spazio vecchio su GitHub è stato cancellato' : 'Lo spazio vecchio su GitHub si cancella appena colleghi il QR nuovo') + ': serve un QR nuovo dal genitore.</span></div>' : '') +
      '<div class="bk-lk" style="margin-top:8px"><span>🔗 <b>Invio automatico ai genitori</b>: in Pianificazione → Progressi un genitore prepara un QR; qui lo inquadri e basta.</span><button type="button" class="btn small" id="lk-scan">📷 Collegati con il QR</button></div>' +
      '<details class="bk-lk-set"><summary>🔗 Oppure collega a mano con la chiave GitHub</summary>' +
      '<input type="password" id="lk-tok" placeholder="Chiave GitHub (permesso gist)" autocomplete="off">' +
      '<button type="button" class="btn small" id="lk-go">Collega</button><div id="lk-msg" class="bk-lk-msg"></div></details>';
    $('lk-scan').addEventListener('click', linkScan);
    $('lk-go').addEventListener('click', async () => {
      const t = $('lk-tok').value.trim(), m = $('lk-msg');
      if (!t) { m.textContent = 'Incolla la chiave GitHub.'; return; }
      m.textContent = 'Collegamento in corso…'; $('lk-go').disabled = true;
      try { await A.connect(t); keepLink(); linkPaint(); refreshLinkWarn(); } catch (e) { m.textContent = 'Non riuscito: ' + e.message + '.'; $('lk-go').disabled = false; }
    });
  }
}
window.onMondoSync = () => { setTimeout(() => mcPush(false), 1500); keepLink(); refreshLinkWarn(); if ($('bk-link') && !document.querySelector('#bk-link details[open]') && !document.querySelector('#lk-keybox:not([hidden])') && $('modal').hidden) linkPaint(); };
/* 📷 collegamento con il QR preparato dal genitore (Pianificazione → Progressi): chiave, spazio e codice in un colpo solo */
function loadJsQRm() { return new Promise((res, rej) => { if (window.jsQR) return res(); const s = document.createElement('script'); s.src = 'licenze/jsqr.js'; s.onload = () => res(); s.onerror = () => rej(new Error('serve internet')); document.head.appendChild(s); }); }
async function linkScan() {
  try { await loadJsQRm(); } catch (e) { openModal('<div class="big" style="font-size:24px">📶 Serve internet</div><p style="font-weight:700">Per leggere il QR la prima volta serve la connessione.</p><button type="button" class="btn" id="qs-ok" data-focus>Ok</button>'); $('qs-ok').addEventListener('click', closeModal); return; }
  const ov = document.createElement('div'); ov.className = 'qs-ov';
  ov.innerHTML = '<video playsinline muted></video><div class="qs-t">Inquadra il QR sull’iPad del genitore<br><small>Pianificazione → Progressi → 📲 Collega con un QR</small></div><div class="row center"><button type="button" class="btn ghost" id="qs-flip">🔄 Altra fotocamera</button><button type="button" class="btn" id="qs-x">Chiudi</button></div>';
  document.body.appendChild(ov);
  const v = ov.querySelector('video'), c = document.createElement('canvas'), x = c.getContext('2d', { willReadFrequently: true });
  let stream = null, done = false, mode = 'environment';
  const stopCam = () => { try { if (stream) stream.getTracks().forEach(t => t.stop()); } catch (e) {} stream = null; };
  const stop = () => { done = true; stopCam(); ov.remove(); };
  const start = async () => { stopCam(); try { stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: mode }, audio: false }); v.srcObject = stream; await v.play().catch(() => {}); } catch (e) { stop(); openModal('<div class="big" style="font-size:24px">📷 Fotocamera non disponibile</div><p style="font-weight:700">Permetti l’uso della fotocamera all’app, oppure collega a mano con la chiave.</p><button type="button" class="btn" id="qs-ok" data-focus>Ok</button>'); $('qs-ok').addEventListener('click', closeModal); } };
  ov.querySelector('#qs-x').addEventListener('click', stop);
  ov.querySelector('#qs-flip').addEventListener('click', () => { mode = mode === 'environment' ? 'user' : 'environment'; start(); });
  await start();
  const tick = () => {
    if (done) return;
    if (v.videoWidth) { const w = Math.min(900, v.videoWidth), h = Math.round(v.videoHeight * w / v.videoWidth); c.width = w; c.height = h; x.drawImage(v, 0, 0, w, h);
      const q = window.jsQR(x.getImageData(0, 0, w, h).data, w, h, { inversionAttempts: 'attemptBoth' });
      if (q && q.data) { if (/^MMQR1\./.test(q.data)) { stop(); linkApply(q.data); return; } } }
    requestAnimationFrame(tick);
  };
  tick();
}
async function linkApply(txt) {
  let j = null;
  try { let b = txt.slice(6).replace(/-/g, '+').replace(/_/g, '/'); while (b.length % 4) b += '='; j = JSON.parse(decodeURIComponent(escape(atob(b)))); } catch (e) {}
  if (!j || !j.t || !j.g || !j.k) { toastV2('QR non riconosciuto'); return; }
  if (j.v !== 2) { openModal('<div style="font-size:50px">🔒</div><div class="big" style="font-size:24px">QR vecchio</div><p style="font-weight:700">Questo QR è della versione vecchia, meno sicura. Chiedi a mamma o papà di prepararne uno nuovo in Pianificazione → Progressi.</p><button type="button" class="btn" id="qs-ok" data-focus>Ok</button>'); $('qs-ok').addEventListener('click', closeModal); return; }
  let old = null; try { old = JSON.parse(localStorage.getItem('msync-cfg') || 'null'); } catch (e) {}
  /* gli spazi vecchi pubblici si cancellano subito con la chiave nuova */
  try { await linkLoad(); const A0 = window.__mondoSyncApi; if (A0 && A0.wipeOld) await A0.wipeOld(j.t, old && old.gist && old.gist !== j.g ? old.gist : (old && old.oldGist) || ''); } catch (e) {}
  try { localStorage.setItem('msync-cfg', JSON.stringify({ token: j.t, gist: j.g, key: j.k, v: 2, owner: '', last: old && old.gist === j.g ? old.last : 0, h: '', err: '' })); } catch (e) {}
  keepLink();
  const fresh = !D || !(D.energy > 0);
  if (fresh) { try { const R = await mcRead(); if (R) { linkPaint(); refreshLinkWarn(); mcOffer(R); return; } } catch (e) {} }
  const ok = await linkLoad(); const A = window.__mondoSyncApi; const sent = ok && A ? await A.push(true) : false;
  linkPaint(); refreshLinkWarn();
  openModal('<div style="font-size:50px">' + (sent ? '✅' : '⏳') + '</div><div class="big" style="font-size:24px">' + (sent ? 'Collegata ai genitori!' : 'Collegamento salvato') + '</div><p style="font-weight:700">' + (sent ? 'I progressi partono da soli ogni volta che apri l’app con internet.' : 'Appena c’è internet i progressi partono da soli.') + '</p><button type="button" class="btn" id="qs-ok" data-focus>Ok</button>');
  $('qs-ok').addEventListener('click', closeModal);
}
/* ⚠️ avviso in 🐉 Io quando i progressi non arrivano ai genitori (chiave scaduta, collegamento rotto) */
function linkWarn() {
  let c = null; try { c = JSON.parse(localStorage.getItem('msync-cfg') || 'null'); } catch (e) {}
  if (c && c.need) return '<button type="button" class="v2-card v2-next lk-warn" id="io-lkw"><span>🔒</span><div><b>Collegamento con i genitori da rinnovare</b><small>Per sicurezza serve un QR nuovo: in Pianificazione → Progressi → 📲 Collega con un QR, poi qui 📷 Collegati con il QR.</small></div></button>';
  if (!c || !c.gist) return '';
  const age = c.last ? (Date.now() - c.last) / 864e5 : 99;
  if (!c.err && (age < 1.5 || navigator.onLine === false)) return '';
  const d = Math.floor(age);
  return '<button type="button" class="v2-card v2-next lk-warn" id="io-lkw"><span>⚠️</span><div><b>I progressi non arrivano ai genitori</b><small>' +
    (d >= 1 && d < 99 ? 'Ultimo invio ' + d + (d === 1 ? ' giorno' : ' giorni') + ' fa' : 'L’invio non è riuscito') + (c.err ? ' · ' + esc(c.err) : '') + '. Fallo vedere a un genitore.</small></div></button>';
}
function refreshLinkWarn() { const w = $('io-lkw'); if (w && !linkWarn()) w.remove(); }
function wireLinkWarn() { const w = $('io-lkw'); if (!w) return; w.addEventListener('click', () => { window.__lkKey = true; linkPaint().then(() => { const b = $('bk-link'); if (b) b.scrollIntoView({ behavior: 'smooth', block: 'center' }); }); }); }
/* ---------- 📱 QR per i genitori: i progressi passano inquadrando lo schermo ---------- */
const QR_BASE = 'https://f6kd4bp6sr-stack.github.io/mie-app/licenze/progressi.html#';
function qrData(days) {
  const P = 'mm2-', KEEP = ['days', 'prog', 'math-done', 'sci-done', 'games-done', 'tab-best', 'simon-best', 'clock-level', 'cuoca-level', 'moves-done', 'path-day', 'gems', 'piggy', 'diff-level'], d = {};
  KEEP.forEach(k => { const v = store.get(k, undefined); if (v !== undefined) d[k] = v; });
  const ref = iso(addDays(new Date(), -days));
  const pd = store.get('prog-days', {}); d['prog-days'] = {}; Object.keys(pd).filter(x => x >= ref).forEach(x => d['prog-days'][x] = pd[x]);
  const vl = store.get('vid-log', {}); d['vid-log'] = {}; Object.keys(vl).filter(x => x >= ref).forEach(x => d['vid-log'][x] = vl[x]);
  const di = store.get('diary', {}); if (di && typeof di === 'object') { d.diary = {}; Object.keys(di).filter(x => x >= ref).forEach(x => { const v = di[x] || {}, o = {}; if (v.m) o.m = v.m; if (v.m && v.f) o.f = v.f; if (v.p) o.p = v.p; d.diary[x] = Object.keys(o).length ? o : 1; }); }   // nel QR solo emozioni e presenze: i testi viaggiano solo nel collegamento cifrato
  if (D) d.dragon = { name: D.name || '', energy: D.energy || 0 };
  try {
    const PA = store.get('path', null), td = todayIso();
    if (PA && PA.srs) { const sum = {}; Object.keys(PA.srs).forEach(k => { const r = PA.srs[k] || {}, b = +r.b || 0; if (b <= 0) return; const e = sum[r.u || '?'] || (sum[r.u || '?'] = { l: 0, s: 0, d: 0 }); e.l++; if (b >= 4) e.s++; if (r.d && r.d <= td) e.d++; });
      let tappe = 0; Object.keys(PA.u || {}).forEach(k => { tappe += Object.keys((PA.u[k] && PA.u[k].done) || {}).length; }); d.path = { sum, tappe, units: Object.keys(PA.u || {}).length, ref: td }; }
    const C = store.get('coll', null); if (C && C.f) { let n = 0; Object.keys(C.f).forEach(k => n += (C.f[k] || []).length); d.coll = { figs: n }; }
  } catch (e) {}
  return d;
}
const b64u = bytes => { let s = ''; for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); };
async function qrText(days) {
  const js = JSON.stringify({ app: APP_ID, saved: new Date().toISOString(), state: { data: qrData(days) } });
  const plain = new TextEncoder().encode(js); let raw = plain, tag = 'mm2j=';
  if (window.CompressionStream) { try { const cs = new Blob([plain]).stream().pipeThrough(new CompressionStream('deflate-raw')); raw = new Uint8Array(await new Response(cs).arrayBuffer()); tag = 'mm2z=' + plain.length + '.'; } catch (e) { raw = plain; } }
  return QR_BASE + tag + b64u(raw);
}
async function openQR() {
  let txt = '', svg = '';
  for (const days of [21, 14, 7, 3, 0]) {
    txt = await qrText(days);
    if (txt.length > 2900) continue;
    try { const q = qrcode(0, 'L'); q.addData(txt, 'Byte'); q.make(); svg = q.createSvgTag({ cellSize: 4, margin: 4, scalable: true }); break; } catch (e) { svg = ''; }
  }
  openModal('<div class="big" style="font-size:26px">📱 Per i genitori</div>' +
    (svg ? '<div class="qr-box">' + svg + '</div><p style="font-weight:700">Apri <b>Progressi</b> sul telefono o sull’iPad del genitore, tocca <b>📷 Leggi il QR</b> e inquadra questo codice. Va bene anche la fotocamera dell’iPhone.</p>'
         : '<p style="font-weight:800">I dati sono troppi per un QR: usa 📤 Condividi in 🐉 Io → 📊 Progressi.</p>') +
    '<p style="font-size:14px;color:var(--ink-soft);font-weight:700">Dentro ci sono i contatori dello studio, le emozioni e le presenze del diario e il nome del drago: niente testi del diario, niente nome della bimba. Non passa da internet.</p>' +
    '<div class="row center"><button type="button" class="btn ghost" id="qr-x" data-focus>Chiudi</button></div>', ['var(--c5)', 'var(--c5-soft)']);
  $('qr-x').addEventListener('click', closeModal);
}
function wireBackup() {
  cloudBadge();
  const sv = $('bk-save'), ld = $('bk-load'), fi = $('bk-file'); if (!sv) return;
  linkPaint();
  $('bk-diag').addEventListener('click', openDiag);
  if ($('bk-upd')) $('bk-upd').addEventListener('click', checkUpdates);
  $('bk-snap').addEventListener('click', openSnapshots);
  mcPaint();
  sv.addEventListener('click', () => shareBackup(sv));
  ld.addEventListener('click', () => fi.click());
  if ($('bk-share')) $('bk-share').addEventListener('click', async () => {
    const url = location.origin + location.pathname.replace(/index\.html$/, '');
    if (navigator.share) { try { await navigator.share({ title: document.title, text: 'Apri in Safari, poi Condividi → «Aggiungi alla schermata Home».', url: url }); return; } catch (e) { if (e && e.name === 'AbortError') return; } }
    openModal('<div class="big" style="font-size:26px">📲 Su un altro iPad</div><p style="font-weight:800">Apri questo indirizzo in Safari:</p><p style="font-weight:800;word-break:break-all;color:var(--c5)">' + esc(url) + '</p><p>Poi Condividi → «Aggiungi alla schermata Home».</p><button type="button" class="btn" id="sh-ok" data-focus>Ok</button>'); $('sh-ok').addEventListener('click', closeModal);
  });
  fi.addEventListener('change', async () => {
    const f = fi.files && fi.files[0]; if (!f) return;
    try {
      const j = JSON.parse(await f.text());
      if (!isAppFile(j) || !j.state || !j.state.data) throw new Error('bad');
      Object.keys(j.state.data).forEach(k => { if (!k.startsWith('__') && k !== 'link-cfg') store.set(k, j.state.data[k], false, Date.now()); });
      D = store.get('dragon', null); CHILD = store.get('child', null) || {}; applyChild(); updateBar(); go('home'); floatText($('p-home'), 'Ripristinato! ✅');
    } catch (e) { openModal('<div class="big">Ops!</div><p style="font-weight:800">Questo file non è una copia di sicurezza dell’app.</p><button type="button" class="btn" id="bk-ok" data-focus>Ok</button>'); $('bk-ok').addEventListener('click', closeModal); }
    fi.value = '';
  });
}

/* ================= MEMORIA LOCALE DOPPIA: localStorage + IndexedDB, con richiesta di memoria persistente =================
   Se una delle due memorie viene svuotata, l'altra la ricostruisce. */
/* nome tecnico dell'app nei file di copia e nei QR. I file fatti prima (app «mondo-…») si leggono lo stesso. */
const APP_ID = 'il-mio-mondo', isAppFile = j => !!j && (j.app === APP_ID || /^mondo-[a-z]+$/.test(String(j.app || '')));
const LOCAL2 = { idb: null, persisted: null, standalone: false, lastSave: null, snapCount: 0 };
const CLOUD_SNAPS = [];
(function idbMirror() {
  LOCAL2.standalone = !!(window.navigator.standalone || (window.matchMedia && matchMedia('(display-mode: standalone)').matches));
  try { if (navigator.storage && navigator.storage.persisted) navigator.storage.persisted().then(p => { LOCAL2.persisted = p; if (!p && navigator.storage.persist) navigator.storage.persist().then(r => { LOCAL2.persisted = r; }).catch(() => {}); }).catch(() => {}); } catch (e) {}
  if (!window.indexedDB) return;
  let req; try { req = indexedDB.open(APP_ID, 2); } catch (e) { return; }
  req.onupgradeneeded = () => { const d = req.result; try { if (!d.objectStoreNames.contains('kv')) d.createObjectStore('kv'); if (!d.objectStoreNames.contains('snap')) d.createObjectStore('snap'); } catch (e) {} };
  req.onerror = () => {};
  req.onsuccess = () => {
    const idb = req.result; LOCAL2.idb = idb;
    let tx; try { tx = idb.transaction('kv', 'readonly'); } catch (e) { return; }
    const all = {}; const cur = tx.objectStore('kv').openCursor();
    cur.onsuccess = () => {
      const c = cur.result;
      if (c) { all[c.key] = c.value; c.continue(); return; }
      if (!Object.keys(all).length) idbLegacy(idb).then(old => { Object.assign(all, old); proceed(); }); else proceed();
    };
    function proceed() {
      // confronto: vince la voce più recente
      let changed = false;
      // se la memoria del browser era vuota all'avvio, i dati salvati nel database vincono sempre
      // (all'avvio l'app scrive valori iniziali più «nuovi», che altrimenti coprirebbero quelli veri)
      const rescue = store.fresh && Object.keys(all).length > 0;
      Object.keys(all).forEach(k => { const r = all[k]; if (r && (rescue || (r.t || 0) > (store._stamp[k] || 0))) { store.set(k, r.v, true, r.t); changed = true; } });
      const missing = Object.keys(store._mem).filter(k => !all[k] || (all[k].t || 0) < (store._stamp[k] || 0));
      missing.forEach(idbPut);
      dailySnapshot();
      if (changed) {
        D = store.get('dragon', null); CHILD = store.get('child', null) || {}; applyChild();
        if (D) { closeModal(); updateBar(); const t = store.get('tab', 'home'); go(TABS.some(x => x[0] === t) ? t : 'home'); }
      }
    }
  };
})();
/* database di prima (nome «mondo-…», non «mondo-sfondo»): si copiano dati e copie giornaliere nel nuovo, una volta sola */
function idbLegacy(idb) {
  return new Promise(res => {
    const done = o => res(o || {});
    try {
      if (!indexedDB.databases) return done();
      indexedDB.databases().then(list => {
        const old = (list || []).map(x => x.name).find(n => /^mondo-[a-z]+$/.test(n || '') && n !== 'mondo-sfondo' && n !== APP_ID);
        if (!old) return done();
        const r = indexedDB.open(old);
        r.onerror = () => done();
        r.onsuccess = () => {
          const o = r.result, kv = {}, snaps = [];
          if (!o.objectStoreNames.contains('kv')) { o.close(); return done(); }
          const names = ['kv'].concat(o.objectStoreNames.contains('snap') ? ['snap'] : []);
          const tx = o.transaction(names, 'readonly');
          const c1 = tx.objectStore('kv').openCursor(); c1.onsuccess = () => { const c = c1.result; if (c) { kv[c.key] = c.value; c.continue(); } };
          if (names.includes('snap')) { const c2 = tx.objectStore('snap').openCursor(); c2.onsuccess = () => { const c = c2.result; if (c) { snaps.push([c.key, c.value]); c.continue(); } }; }
          tx.oncomplete = () => {
            o.close();
            try { const w = idb.transaction(['kv', 'snap'], 'readwrite'); Object.keys(kv).forEach(k => w.objectStore('kv').put(kv[k], k)); snaps.forEach(([k, v]) => w.objectStore('snap').put(v, k)); w.oncomplete = () => done(kv); w.onerror = () => done(kv); } catch (e) { done(kv); }
          };
          tx.onerror = () => { o.close(); done(); };
        };
      }).catch(() => done());
    } catch (e) { done(); }
  });
}
function idbPut(k) {
  if (!LOCAL2.idb) return;
  try { LOCAL2.idb.transaction('kv', 'readwrite').objectStore('kv').put({ v: store._mem[k], t: store._stamp[k] || Date.now() }, k); } catch (e) {}
}
// ogni salvataggio va anche in IndexedDB
(function hookStore() {
  const orig = store.set;
  store.set = function (k, v, fromCloud, t) { orig.call(store, k, v, fromCloud, t); idbPut(k); if (!k.startsWith('__')) { LOCAL2.lastSave = new Date(); if (LOCAL2.snapDay && LOCAL2.snapDay !== todayIso()) dailySnapshot(); } };
})();


/* ================= COPIE GIORNALIERE =================
   Ogni giorno in cui l'app si usa viene tenuta una fotografia completa dei progressi:
   ultimi 30 giorni sull'iPad (IndexedDB) e ultimi 14 nell'account Claude, se disponibile. */

const snapData = () => { const st = store.all(); Object.keys(st.data).forEach(k => { if (k.startsWith('__')) { delete st.data[k]; delete st.t[k]; } }); return st; };
function dailySnapshot() {
  if (!LOCAL2.idb) return Promise.resolve(false);
  const day = todayIso(); LOCAL2.snapDay = day;
  try {
    const tx = LOCAL2.idb.transaction('snap', 'readwrite'), os = tx.objectStore('snap');
    const done = new Promise(r => { tx.oncomplete = () => r(true); tx.onerror = tx.onabort = () => r(false); setTimeout(() => r(false), 4000); });
    os.put({ d: day, t: Date.now(), st: snapData() }, day);
    const keys = os.getAllKeys();
    keys.onsuccess = () => {
      const all = keys.result.sort();
      LOCAL2.snapCount = Math.min(all.length, 30);
      all.slice(0, Math.max(0, all.length - 30)).forEach(k => { try { LOCAL2.idb.transaction('snap', 'readwrite').objectStore('snap').delete(k); } catch (e) {} });
      cloudBadge();
    };
    return done;
  } catch (e) { return Promise.resolve(false); }
}
/* Salva TUTTO adesso: memoria dell'iPad (localStorage + IndexedDB) e copia del giorno */
async function saveAllNow() {
  let ok = false;
  try { const st = snapData(); Object.keys(st.data).forEach(k => store.set(k, st.data[k], true, st.t[k])); ok = store.local; } catch (e) {}
  const snap = await dailySnapshot();
  const t = new Date(); store.set('__lastSave', t.getTime(), true);
  return { ok: ok || snap, snap: snap, time: String(t.getHours()).padStart(2, '0') + ':' + String(t.getMinutes()).padStart(2, '0') };
}
function listSnapshots() {
  return new Promise(res => {
    const out = CLOUD_SNAPS.map(s => ({ d: s.d, t: s.t, where: 'account', get: () => JSON.parse(s.v) }));
    if (!LOCAL2.idb) return res(out);
    try {
      const r = LOCAL2.idb.transaction('snap', 'readonly').objectStore('snap').getAll();
      r.onsuccess = () => { r.result.forEach(x => out.push({ d: x.d, t: x.t, where: 'iPad', get: () => x.st })); res(out.sort((a, b) => b.t - a.t)); };
      r.onerror = () => res(out);
    } catch (e) { res(out); }
  });
}
async function cloudSnapshot() {
  if (!CLOUD) return;
  const day = todayIso();
  if (store.get('__cloudSnapDay', '') === day) return;
  const sd = snapData(); if (sd && sd.data) { delete sd.data['link-cfg']; if (sd.t) delete sd.t['link-cfg']; }
  const v = JSON.stringify(sd);
  if (v.length > 240000) return;
  try {
    await withRetry(() => CLOUD.col.doc('snap_' + day).set({ k: '__snap', d: day, t: Date.now(), v: v }), 2);
    store.set('__cloudSnapDay', day, true);
    const old = CLOUD_SNAPS.map(s => s.d).filter(d => d && d < iso(addDays(fromIso(day), -14)));
    for (const d of old) { try { await CLOUD.col.doc('snap_' + d).delete(); } catch (e) {} }
  } catch (e) {}
}
// a fine giornata (quando l'app va in pausa) aggiorno la copia di oggi con l'ultimo stato
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') dailySnapshot(); });
async function openSnapshots() {
  const list = await listSnapshots();
  const seen = new Set(), rows = list.filter(x => { const k = x.d + x.where; if (seen.has(k)) return false; seen.add(k); return true; }).slice(0, 30);
  openModal('<div class="big" style="font-size:26px">📅 Copie giornaliere</div><p style="font-weight:700">Ogni giorno l\u2019app salva da sola una fotografia di tutti i progressi. Se qualcosa va storto, puoi tornare a un giorno precedente.</p>' +
    (rows.length ? '<div class="snap-list">' + rows.map((x, i) => '<div class="snap"><span><b>' + esc(fmtDay(x.d)) + '</b><small>' + (x.where === 'iPad' ? '📱 su questo iPad' : '☁️ nell\u2019account') + ' · ore ' + new Date(x.t).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }) + '</small></span><button type="button" class="btn small ghost" data-snap="' + i + '">Ripristina</button></div>').join('') + '</div>' : '<p>Ancora nessuna copia: la prima si crea oggi.</p>') +
    '<div class="row center" style="margin-top:12px"><button type="button" class="btn small ghost" id="sn-close" data-focus>Chiudi</button></div>', ['var(--c5)', 'var(--c5-soft)']);
  $('sn-close').addEventListener('click', closeModal);
  document.querySelectorAll('[data-snap]').forEach(b => b.addEventListener('click', () => {
    const x = rows[+b.dataset.snap];
    openModal('<div class="big" style="font-size:24px">Tornare a ' + esc(fmtDay(x.d)) + '?</div><p style="font-weight:700">I progressi di oggi verranno sostituiti da quelli di quel giorno. Prima ne faccio comunque una copia.</p><div class="row center" style="gap:8px"><button type="button" class="btn small" id="sn-yes" style="--bc:var(--c1)">Sì, ripristina</button><button type="button" class="btn small ghost" id="sn-no" data-focus>No</button></div>');
    $('sn-no').addEventListener('click', openSnapshots);
    $('sn-yes').addEventListener('click', () => {
      dailySnapshot();
      const st = x.get(); const now = Date.now();
      Object.keys(st.data).forEach(k => { if (!k.startsWith('__') && k !== 'link-cfg') store.set(k, st.data[k], false, now); });
      closeModal(); D = store.get('dragon', null); CHILD = store.get('child', null) || {}; applyChild(); updateBar(); go('home'); floatText($('p-home'), 'Ripristinato! ✅');
    });
  }));
}

/* ================= COPIA SU iCLOUD DRIVE =================
   Safari non permette a un sito di scrivere file senza un tocco: l'app prepara tutto e chiede un solo tocco al giorno.
   Nel foglio di condivisione si sceglie «Salva su File» → iCloud Drive (l'iPad ricorda la cartella). */
function backupFile() {
  /* la copia su file non contiene mai il collegamento con i genitori (chiave GitHub e chiave di cifratura) */
  const st = snapData(); if (st && st.data) { delete st.data['link-cfg']; if (st.t) delete st.t['link-cfg']; }
  const data = JSON.stringify({ app: APP_ID, saved: new Date().toISOString(), state: st });
  const d = new Date(), fn = 'drago-progressi-' + d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + '.json';
  return { data, fn };
}
const canShareFiles = () => { try { return !!(navigator.share && navigator.canShare && navigator.canShare({ files: [new File(['x'], 'x.json', { type: 'application/json' })] })); } catch (e) { return false; } };
async function shareBackup(btn) {
  const { data, fn } = backupFile();
  const done = () => { store.set('__lastBackup', Date.now(), true); store.set('__backupDay', todayIso(), true); keeperReward(btn); };
  if (canShareFiles()) {
    try { await navigator.share({ files: [new File([data], fn, { type: 'application/json' })], title: 'Progressi del drago' }); done(); return true; }
    catch (e) { if (e && e.name === 'AbortError') return false; }
  }
  let dl = null; try { dl = window.claude && window.claude.use ? await window.claude.use('downloads') : null; } catch (e) {}
  if (dl) { try { await dl.save({ filename: fn, data: data }); done(); return true; } catch (e) { if (e && e.code === 'cancelled') return false; } }
  try {
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([data], { type: 'application/json' })); a.download = fn;
    document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500); done(); return true;
  } catch (e) { return false; }
}
function backupDue() {
  if (SYNC.phase === 'ok') return false;
  return store.get('__backupDay', '') !== todayIso() && Object.keys(store._mem).filter(k => !k.startsWith('__')).length > 3;
}
// promemoria giornaliero: alla prima apertura del giorno, se non c'è già una finestra aperta
/* (la richiesta giornaliera non apre più finestre: è un pulsante nel riquadro del Drago custode, in Casa) */

/* ================= IL DRAGO CUSTODE: ogni giorno di salvataggio fa crescere il drago =================
   Primo salvataggio del giorno: +3 🔥, più 1 per ogni giorno di fila (fino a +10).
   I giorni totali di salvataggio fanno salire di grado il Custode, che compare sul drago. */
const KEEPER = [
  { min: 1, ic: '🌱', n: 'Custode in prova' },
  { min: 3, ic: '🛡️', n: 'Custode dei ricordi' },
  { min: 7, ic: '☁️', n: 'Guardiano delle nuvole' },
  { min: 15, ic: '💎', n: 'Drago dello scrigno' },
  { min: 30, ic: '👑', n: 'Re dei ricordi' },
  { min: 60, ic: '🌟', n: 'Leggenda dei ricordi' }
];
function keeperState() {
  const k = store.get('keeper', { days: [], streak: 0, best: 0 });
  const n = k.days.length, i = KEEPER.reduce((a, l, j) => n >= l.min ? j : a, -1);
  const nx = KEEPER[i + 1];
  return { k, n, lv: i >= 0 ? KEEPER[i] : null, next: nx ? { ...nx, left: nx.min - n } : null };
}
function keeperReward(btn) {
  const k = store.get('keeper', { days: [], streak: 0, best: 0 }), t = todayIso();
  if (k.days.includes(t)) { if (btn) floatText(btn, 'Salvata! ✅'); return; }
  const before = keeperState().lv;
  const yest = iso(addDays(fromIso(t), -1));
  k.streak = k.days.includes(yest) ? k.streak + 1 : 1;
  k.best = Math.max(k.best || 0, k.streak);
  k.days.push(t); if (k.days.length > 400) k.days = k.days.slice(-400);
  store.set('keeper', k);
  const bonus = Math.min(10, 2 + k.streak);
  const el = btn || $('bar-energy') || document.body;
  const after = keeperState().lv;
  setTimeout(() => {
    gain(bonus, el);
    if (after && (!before || after.min !== before.min)) {
      openModal('<div style="font-size:70px">' + after.ic + '</div><div class="big">' + esc(D.name) + ' è cresciuto!</div>' +
        '<p style="font-weight:800">Nuovo grado: <b>' + esc(after.n) + '</b>. Proteggendo i tuoi ricordi ogni giorno, il tuo drago diventa più forte.</p>' +
        '<button type="button" class="btn" id="kp-ok" data-focus style="--bc:var(--c5)">Evviva!</button>', ['var(--c5)', 'var(--c5-soft)']);
      $('kp-ok').addEventListener('click', () => { closeModal(); go(current); });
      try { fanfare(); confetti(window.innerWidth / 2, window.innerHeight / 3, 40); } catch (e) {}
    } else {
      cheer(el, 'Ricordi al sicuro! +' + bonus + ' 🔥' + (k.streak > 1 ? ' · ' + k.streak + ' giorni di fila' : ''));
      if (current === 'home') setTimeout(() => go('home'), 1200);
    }
  }, 300);
}
function keeperHome() {
  const s = keeperState();
  const alive = s.k.days.includes(todayIso()) || s.k.days.includes(iso(addDays(fromIso(todayIso()), -1)));
  const streak = alive ? s.k.streak : 0;
  return '<div class="keeper">' + (s.lv ? '<span class="kp-ic" aria-hidden="true">' + s.lv.ic + '</span><span><b>' + esc(s.lv.n) + '</b>' : '<span class="kp-ic" aria-hidden="true">☁️</span><span><b>Salva i ricordi per far crescere ' + esc(D.name) + '</b>') +
    '<small>' + s.n + (s.n === 1 ? ' giorno salvato' : ' giorni salvati') + (streak > 1 ? ' · 🔥 ' + streak + ' di fila' : '') + (s.next ? ' · ancora ' + s.next.left + ' per ' + s.next.ic + ' ' + esc(s.next.n) : '') + '</small>' +
    (backupDue() && canShareFiles() ? '<button type="button" class="btn small" id="kp-save" style="--bc:var(--c5);margin-top:6px">☁️ Salva i ricordi di oggi</button>' : (s.k.days.includes(todayIso()) ? '<small>✅ Ricordi di oggi al sicuro su iCloud</small>' : '')) + '</span></div>';
}
document.addEventListener('click', e => { if (e.target && e.target.id === 'kp-save') shareBackup(e.target); });
function keeperBadge() { const s = keeperState(); return s.lv ? '<span class="kp-badge" title="' + esc(s.lv.n) + '" aria-label="' + esc(s.lv.n) + '">' + s.lv.ic + '</span>' : ''; }

/* ---------- Ripristino da file (anche dal primo avvio) ---------- */
function restoreFromFile() {
  let fi = document.getElementById('bk-file-boot');
  if (!fi) { fi = document.createElement('input'); fi.type = 'file'; fi.id = 'bk-file-boot'; fi.accept = '.json,application/json,text/plain'; fi.hidden = true; document.body.appendChild(fi);
    fi.addEventListener('change', async () => {
      const f = fi.files && fi.files[0]; if (!f) return;
      try {
        const j = JSON.parse(await f.text());
        if (!isAppFile(j) || !j.state || !j.state.data) throw new Error('bad');
        Object.keys(j.state.data).forEach(k => { if (!k.startsWith('__') && k !== 'link-cfg') store.set(k, j.state.data[k], false, Date.now()); });
        D = store.get('dragon', null); CHILD = store.get('child', null) || {}; applyChild(); closeModal(); updateBar(); go('home'); floatText($('p-home'), 'Bentornata! ✅');
      } catch (e) { alert('Questo file non è una copia dei progressi dell\u2019app.'); }
      fi.value = '';
    });
  }
  fi.click();
}
/* ---------- Aperta dentro la pagina di Claude in Safari: lì l'iPad non conserva i dati ---------- */
const EMBED = (() => { try { return window.self !== window.top; } catch (e) { return true; } })();
const IOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const VOLATILE = EMBED && IOS;

/* In Safari dentro Claude: dopo un po' di lavoro, al ritorno in Casa propone di salvare la copia su iCloud */
if (false && VOLATILE) {
  let e0 = null, asked = false;
  const origGo = go;
  go = function (id) {
    origGo(id);
    if (!D) return;
    if (e0 === null) e0 = D.energy;
    if (id === 'home' && !asked && D.energy - e0 >= 5 && canShareFiles() && $('modal').hidden) {
      asked = true;
      openModal('<div style="font-size:54px">☁️</div><div class="big" style="font-size:26px">Mettiamo al sicuro i progressi?</div>' +
        '<p style="font-weight:700">In questa pagina Safari cancella i progressi quando lo chiudi. Un tocco e li salvi su <b>iCloud Drive</b>: la prossima volta usa «📂 Ripristina».</p>' +
        '<div class="row center" style="gap:8px;flex-wrap:wrap"><button type="button" class="btn" id="vo-go" style="--bc:var(--c5)" data-focus>☁️ Salva su iCloud</button><button type="button" class="btn small ghost" id="vo-later">Più tardi</button></div>', ['var(--c5)', 'var(--c5-soft)']);
      $('vo-later').addEventListener('click', () => { closeModal(); setTimeout(() => { asked = false; e0 = D.energy; }, 600000); });
      $('vo-go').addEventListener('click', async () => { closeModal(); const ok = await shareBackup(null); if (ok) e0 = D.energy; asked = false; });
    }
  };
}

/* ---------- Aggiornamenti a richiesta ---------- */
async function checkUpdates() {
  const btns = [$('bk-upd'), $('upd-btn')].filter(Boolean);
  btns.forEach(b => { b.disabled = true; b.dataset.t = b.dataset.t || b.textContent; b.textContent = '⏳'; });
  const sv = await saveAllNow();
  const saved = sv.ok ? '💾 Dati salvati alle ' + sv.time + '.' : '⚠️ Salvataggio non riuscito: fai una 💾 Copia su iCloud.';
  let v = null;
  try { v = await (await fetch('version.json?t=' + Date.now(), { cache: 'no-store' })).json(); } catch (e) {}
  if (!v || !v.v) { btns.forEach(b => { b.disabled = false; b.textContent = b.dataset.t; }); openModal('<div style="font-size:50px">📶</div><div class="big" style="font-size:26px">Niente internet</div><p style="font-weight:700">' + saved + '<br><br>Per aggiornare serve la connessione. L’app intanto funziona lo stesso.</p><button type="button" class="btn" id="up-ok" data-focus>Ok</button>'); $('up-ok').addEventListener('click', closeModal); return; }
  // aggiornamento completo: rinnova il motore offline e ricarica tutto dalla rete (i dati restano sull'iPad)
  openModal('<div style="font-size:50px">✨</div><div class="big" style="font-size:26px">Aggiorno l’app…</div><p style="font-weight:700">' + saved + '<br><br>' + (v.v === window.APP_VERSION ? 'Ricarico tutto dalla rete per sicurezza.' : 'C’è una versione nuova!') + ' I progressi restano al loro posto.</p>');
  store.set('__updAt', Date.now(), true);
  /* solo il motore e le copie di questa app: Pianificazione e Semestre filtro non si toccano */
  const root = new URL('./', location.href).href;
  try { const regs = navigator.serviceWorker ? await navigator.serviceWorker.getRegistrations() : []; for (const r of regs) { if (String(r.scope) === root) await r.unregister(); } } catch (e) {}
  try { const ks = await caches.keys(); await Promise.all(ks.filter(k => k.startsWith('mondo-')).map(k => caches.delete(k))); } catch (e) {}
  setTimeout(() => location.replace(location.pathname + '?agg=' + Date.now()), 900);
}
/* tasto 🔄 Aggiorna sempre a portata di mano, in alto */
(function updBoot() {
  if (!window.APP_VERSION) return;
  const bar = document.querySelector('.appbar-in'); if (!bar) return;
  const b = document.createElement('button');
  b.type = 'button'; b.id = 'upd-btn'; b.className = 'music-btn'; b.setAttribute('aria-label', 'Salva e aggiorna'); b.title = 'Salva e aggiorna'; b.textContent = '🔄';
  bar.insertBefore(b, bar.querySelector('.energy-pill'));
  b.addEventListener('click', checkUpdates);
})();

/* ================= ☁️ COPIA COMPLETA AUTOMATICA E CIFRATA =================
   Nello stesso spazio privato del collegamento con i genitori, una volta al giorno (e dopo le novità, al massimo ogni 4 ore),
   va tutta l'app (drago, percorso, diario, teatro, festa…) cifrata con la chiave del collegamento.
   Su un iPad nuovo: si collega con il QR e l'app propone subito di ripristinare. Il collegamento stesso non entra nella copia. */
const MC_KEY = 'mondo-copia', MC_PART = 900000;
const mcU8b = a => { let s = ''; for (let i = 0; i < a.length; i += 32768) s += String.fromCharCode.apply(null, a.subarray(i, i + 32768)); return btoa(s); };
const mcBu8 = s => { s = String(s).replace(/-/g, '+').replace(/_/g, '/'); while (s.length % 4) s += '='; const b = atob(s), a = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) a[i] = b.charCodeAt(i); return a; };
const mcCfg = () => { try { return JSON.parse(localStorage.getItem('msync-cfg') || 'null'); } catch (e) { return null; } };
const mcState = () => { try { return JSON.parse(localStorage.getItem(MC_KEY) || '{}') || {}; } catch (e) { return {}; } };
const mcSave = st => { try { localStorage.setItem(MC_KEY, JSON.stringify(st)); } catch (e) {} };
const mcHash = t => { let h = 0; for (let i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) | 0; return h + ':' + t.length; };
const mcHdr = c => ({ Authorization: 'Bearer ' + c.token, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json' });
function mcData() { const st = snapData(); delete st.data['link-cfg']; delete st.t['link-cfg']; return JSON.stringify({ app: APP_ID, saved: new Date().toISOString(), state: st }); }
let mcBusy = false;
async function mcPush(force) {
  const c = mcCfg(); if (!c || c.v !== 2 || c.need || !c.gist || !c.key || !c.token || mcBusy || navigator.onLine === false || !D) return false;
  const st = mcState(), data = mcData(), h = mcHash(data.replace(/"saved":"[^"]*"/, '')), age = Date.now() - (st.last || 0);
  if (!force && ((st.h === h && age < 20 * 36e5) || (st.h !== h && st.last && age < 4 * 36e5))) return true;
  if (data.length > 8.5e6) { st.err = 'copia troppo grande'; mcSave(st); mcPaint(); return false; }
  mcBusy = true;
  try {
    const key = await crypto.subtle.importKey('raw', mcBu8(c.key), 'AES-GCM', false, ['encrypt']), iv = crypto.getRandomValues(new Uint8Array(12));
    const ct = mcU8b(new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(data))));
    const n = Math.max(1, Math.ceil(ct.length / MC_PART)), F = {};
    for (let i = 0; i < n; i++) F['copia-' + (i + 1) + '.part'] = { content: ct.slice(i * MC_PART, (i + 1) * MC_PART) };
    for (let j = n + 1; j <= (st.parts || 0); j++) F['copia-' + j + '.part'] = null;
    const saved = new Date().toISOString();
    F['copia.json'] = { content: JSON.stringify({ app: 'mondo-copia', v: 1, saved, iv: mcU8b(iv), parts: n }) };
    const r = await fetch('https://api.github.com/gists/' + c.gist, { method: 'PATCH', headers: mcHdr(c), body: JSON.stringify({ files: F }), cache: 'no-store' });
    if (!r.ok) { st.err = r.status === 401 ? 'chiave GitHub non valida o scaduta' : 'errore ' + r.status; mcSave(st); mcPaint(); return false; }
    Object.assign(st, { last: Date.now(), h, parts: n, size: ct.length, err: '' }); mcSave(st); mcPaint(); return true;
  } catch (e) { st.err = 'copia non riuscita'; mcSave(st); mcPaint(); return false; }
  finally { mcBusy = false; }
}
async function mcRead() {
  const c = mcCfg(); if (!c || c.v !== 2 || !c.gist || !c.key) return null;
  const r = await fetch('https://api.github.com/gists/' + c.gist, { headers: c.token ? mcHdr(c) : { Accept: 'application/vnd.github+json' }, cache: 'no-store' });
  if (!r.ok) throw new Error('errore ' + r.status);
  const f = (await r.json()).files || {}; if (!f['copia.json']) return null;
  const H = JSON.parse(f['copia.json'].content); if (!H.parts) return null;
  let ct = ''; for (let i = 1; i <= H.parts; i++) { const x = f['copia-' + i + '.part']; if (!x || x.truncated) throw new Error('copia incompleta'); ct += x.content; }
  const key = await crypto.subtle.importKey('raw', mcBu8(c.key), 'AES-GCM', false, ['decrypt']);
  const j = JSON.parse(new TextDecoder().decode(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: mcBu8(H.iv) }, key, mcBu8(ct))));
  if (!isAppFile(j) || !j.state || !j.state.data) throw new Error('copia non valida');
  return { saved: H.saved, j };
}
function mcRestore(R) {
  dailySnapshot();
  const now = Date.now(); Object.keys(R.j.state.data).forEach(k => { if (!k.startsWith('__') && k !== 'link-cfg') store.set(k, R.j.state.data[k], false, now); });
  keepLink(); D = store.get('dragon', null); CHILD = store.get('child', null) || {}; applyChild(); updateBar(); go('home'); floatText($('p-home'), 'Ripristinato! ✅');
}
function mcOffer(R) {
  const when = new Date(R.saved).toLocaleString('it-IT', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
  openModal('<div style="font-size:50px">☁️</div><div class="big" style="font-size:24px">C’è una copia completa!</div><p style="font-weight:700">Copia del ' + esc(when) + ': drago, percorso, diario e tutto il resto. La rimetto su questo iPad?</p>' +
    '<div class="row center" style="gap:10px"><button type="button" class="btn ghost" id="mc-no">No</button><button type="button" class="btn" id="mc-yes" data-focus>Sì, ripristina</button></div>');
  $('mc-no').addEventListener('click', closeModal);
  $('mc-yes').addEventListener('click', () => { closeModal(); mcRestore(R); });
}
function mcPaint() {
  const el = $('bk-cloud'), c = mcCfg(); if (!el) return;
  if (!c || !c.gist) { el.innerHTML = ''; return; }
  const st = mcState(), when = st.last ? new Date(st.last).toLocaleString('it-IT', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'non ancora';
  el.innerHTML = '<div class="mc-row"><span>☁️ <b>Copia completa automatica</b>: ' + esc(when) + (st.err ? ' · ⚠️ ' + esc(st.err) : '') + '</span><button type="button" class="btn small ghost" id="mc-res">Ripristina dalla copia</button></div>';
  $('mc-res').addEventListener('click', async () => {
    toastV2('Cerco la copia…');
    try { const R = await mcRead(); if (!R) { toastV2('Non c’è ancora una copia completa'); return; } mcOffer(R); } catch (e) { toastV2('Copia non raggiungibile: ' + e.message); }
  });
}
setTimeout(() => mcPush(false), 9000);
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') setTimeout(() => mcPush(false), 6000); });
