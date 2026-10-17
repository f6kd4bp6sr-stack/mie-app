/* ================= 🎬 VIDEO: premio extra =================
   - si apre come premio (primo obiettivo del giorno raggiunto, oppure 3 lezioni finite)
   - ogni lezione finita regala un 🎟️ biglietto (massimo 3 in tasca); un video = un biglietto; al massimo 3 video al giorno
   - lettore YouTube senza cookie, senza video suggeriti di altri canali; a fine video si chiude da solo
   - il genitore (PIN scelto sull'iPad) può nascondere i video che non gli piacciono */
const VID_MAX_DAY = 3, VID_MAX_TICKETS = 3;
const vidState = () => { const v = store.get('vid', { tickets: 0, day: '', today: 0, seen: {}, lessons: 0, gift: false }); if (v.day !== todayIso()) { v.day = todayIso(); v.today = 0; } return v; };
const vidSave = v => store.set('vid', v);
const vidHidden = () => store.get('vid-hide', []);
const vidOpen = () => { const v = vidState(); return (typeof goalDays === 'function' && goalDays() >= 1) || v.lessons >= 3; };
function vidList() {
  const hide = vidHidden(), open = typeof unitUnlockedIds === 'function' ? unitUnlockedIds() : new Set();
  return VIDEOS.filter(x => !hide.includes(x.id)).sort((a, b) => (open.has(b.u) ? 1 : 0) - (open.has(a.u) ? 1 : 0));
}
/* ogni lezione finita: un biglietto */
(function hookVid() {
  const prev = window.afterLessonV2;
  window.afterLessonV2 = L => {
    if (prev) prev(L);
    const v = vidState(), was = vidOpen(); v.lessons = (v.lessons || 0) + 1;
    if (v.tickets < VID_MAX_TICKETS) v.tickets++;
    vidSave(v);
    if (vidOpen()) setTimeout(() => toastV2(!was ? '🎬 Si è aperta la sezione Video! Hai un 🎟️ biglietto' : '🎟️ Hai vinto un biglietto per un video'), 1600);
    if (typeof notifPaint === 'function') setTimeout(notifPaint, 1700);
  };
})();
const unitLabel = id => { const u = typeof unitById === 'function' && unitById(id); return u ? u.ic + ' ' + u.name : ''; };
function openVideos() {
  const v = vidState();
  if (!vidOpen()) {
    openModal('<div style="font-size:60px">🎬</div><div class="big" style="font-size:26px">Video: un premio da conquistare</div><p style="font-weight:800">Si apre quando raggiungi l’obiettivo del giorno o finisci 3 lezioni. Ogni lezione ti regala un 🎟️ biglietto.</p><div class="row center"><button type="button" class="btn" id="vd-x" data-focus>Ok</button></div>');
    $('vd-x').addEventListener('click', closeModal); return;
  }
  const L = vidList(), left = Math.max(0, VID_MAX_DAY - v.today), can = v.tickets > 0 && left > 0;
  openModal('<div class="row between" style="align-items:center;gap:8px;flex-wrap:wrap"><div class="big" style="font-size:28px">🎬 Video</div><span class="pill vd-tk">🎟️ ' + v.tickets + '</span></div>' +
    '<p class="vd-sub">' + (can ? 'Scegli un video: costa un biglietto.' : v.tickets ? 'Per oggi hai visto ' + VID_MAX_DAY + ' video: domani ancora!' : 'Finisci una lezione per vincere un biglietto 🎟️') + '</p>' +
    '<div class="vd-grid">' + L.map(x => '<button type="button" class="vd-it' + (v.seen[x.id] ? ' seen' : '') + '" data-v="' + x.id + '"' + (can ? '' : ' disabled') + '>' +
      '<span class="vd-th"><img src="https://i.ytimg.com/vi/' + x.id + '/mqdefault.jpg" alt="" loading="lazy" referrerpolicy="no-referrer"><i>▶</i><em>' + (unitById(x.u) ? unitById(x.u).ic : '🎬') + '</em></span>' +
      '<b>' + esc(x.t) + '</b><small class="vd-why">' + esc(x.why) + '</small><small class="vd-ch">' + esc(unitLabel(x.u)) + ' · ' + esc(x.ch) + (v.seen[x.id] ? ' · ✓ visto' : '') + '</small></button>').join('') + '</div>' +
    '<div class="row center" style="margin-top:12px;gap:8px"><button type="button" class="btn ghost" id="vd-x" data-focus>Chiudi</button><button type="button" class="btn ghost vd-par" id="vd-par">👨‍👧 Genitore</button></div>');
  $('modal-box').classList.add('wide');
  $('vd-x').addEventListener('click', closeModal);
  $('vd-par').addEventListener('click', parentGate);
  /* un video che non esiste più mostra la miniatura grigia piccola: lo nascondo */
  $('modal-box').querySelectorAll('.vd-th img').forEach(im => {
    const bad = () => { const b = im.closest('.vd-it'); if (b) b.remove(); };
    im.addEventListener('error', () => { im.remove(); }); im.addEventListener('load', () => { if (im.naturalWidth <= 120) bad(); });
  });
  $('modal-box').querySelectorAll('.vd-it').forEach(b => b.addEventListener('click', () => playVideo(b.dataset.v)));
}
function playVideo(id) {
  const x = VIDEOS.find(y => y.id === id); if (!x) return;
  const v = vidState(); if (v.tickets <= 0 || v.today >= VID_MAX_DAY) return;
  v.tickets--; v.today++; v.seen[id] = todayIso(); vidSave(v);
  /* registro per la pagina Progressi del genitore: solo titolo, materia e se l'ha finito */
  const lk = todayIso() + '|' + id, vlog = store.get('vid-log', {}); vlog[lk] = { t: x.t, u: x.u, f: 0 };
  const cut = iso(addDays(new Date(), -60)); Object.keys(vlog).forEach(k => { if (k < cut) delete vlog[k]; }); store.set('vid-log', vlog);
  const src = 'https://www.youtube-nocookie.com/embed/' + id + '?rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&fs=1&enablejsapi=1&origin=' + encodeURIComponent(location.origin);
  closeModal();
  openModal('<div class="vd-play"><div class="row between" style="align-items:center;gap:8px"><b class="vd-pt">' + esc(x.t) + '</b><button type="button" class="btn ghost" id="vd-close">✕ Chiudi</button></div>' +
    '<div class="vd-frame"><iframe id="vd-if" src="' + src + '" title="' + esc(x.t) + '" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>' +
    '<p class="vd-sub">💡 ' + esc(x.why) + '</p></div>');
  $('modal-box').classList.add('wide');
  let done = false, dur = 0, cur = 0;
  const fin = full => {
    if (done) return; done = true; window.removeEventListener('message', onMsg);
    if (full) { const vl = store.get('vid-log', {}); if (vl[lk]) { vl[lk].f = 1; store.set('vid-log', vl); } try { window.__mondoSyncPush && window.__mondoSyncPush(true); } catch (e) {}
      Gems.add(3); try { questEv && questEv('vid', 1); } catch (e) {} }
    closeModal();
    setTimeout(() => toastV2(full ? '🎬 Bravissima! Video finito: +3 💎' : '🎬 Alla prossima!'), 300);
  };
  const onMsg = e => {
    if (!/^https:\/\/www\.youtube(-nocookie)?\.com$/.test(e.origin)) return;
    let d; try { d = typeof e.data === 'string' ? JSON.parse(e.data) : e.data; } catch (err) { return; }
    const info = d && d.info; if (!info) return;
    if (typeof info.duration === 'number' && info.duration) dur = info.duration;
    if (typeof info.currentTime === 'number') cur = info.currentTime;
    if (info.playerState === 0) fin(true);
  };
  window.addEventListener('message', onMsg);
  const fr = $('vd-if');
  fr.addEventListener('load', () => { try { fr.contentWindow.postMessage(JSON.stringify({ event: 'listening', id: 1, channel: 'widget' }), '*'); } catch (e) {} });
  $('vd-close').addEventListener('click', () => fin(dur > 0 && cur / dur >= .85));
}
/* ---------- angolo del genitore: PIN scelto sull'iPad, per nascondere/mostrare i video ---------- */
async function pinHash(p) { const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('mondo-pin:' + p)); return [...new Uint8Array(b)].slice(0, 12).map(x => x.toString(16).padStart(2, '0')).join(''); }
function parentGate() {
  const has = !!store.get('par-pin', '');
  openModal('<div class="big" style="font-size:24px">👨‍👧 Per il genitore</div><p style="font-weight:700">' + (has ? 'Scrivi il PIN.' : 'Scegli un PIN di 4–8 cifre (solo per i grandi). Resta su questo iPad.') + '</p>' +
    '<input id="pp-in" type="password" inputmode="numeric" autocomplete="off" maxlength="8" style="font-size:24px;padding:10px;border-radius:12px;border:2px solid var(--line);width:100%;box-sizing:border-box;text-align:center">' +
    '<p id="pp-err" style="color:var(--v2-red);font-weight:800;min-height:1.2em"></p><div class="row center" style="gap:8px"><button type="button" class="btn ghost" id="pp-x">Annulla</button><button type="button" class="btn" id="pp-ok">Entra</button></div>');
  $('pp-x').addEventListener('click', () => { closeModal(); openVideos(); });
  $('pp-ok').addEventListener('click', async () => {
    const p = $('pp-in').value.trim(); if (!/^\d{4,8}$/.test(p)) { $('pp-err').textContent = 'Servono da 4 a 8 cifre'; return; }
    const h = await pinHash(p);
    if (!has) store.set('par-pin', h); else if (store.get('par-pin', '') !== h) { $('pp-err').textContent = 'PIN sbagliato'; return; }
    parentList();
  });
  setTimeout(() => $('pp-in') && $('pp-in').focus(), 100);
}
function parentList() {
  const hide = vidHidden();
  openModal('<div class="big" style="font-size:24px">👨‍👧 Video visibili</div><p style="font-weight:700;color:var(--ink-soft)">Tocca per nascondere o mostrare. Il link apre il video su YouTube per guardarlo prima.</p>' +
    '<div class="vd-par-list">' + VIDEOS.map(x => '<div class="vd-pr"><button type="button" class="vd-tg' + (hide.includes(x.id) ? ' off' : '') + '" data-v="' + x.id + '">' + (hide.includes(x.id) ? '🚫' : '✅') + '</button><span><b>' + esc(x.t) + '</b><small>' + esc(unitLabel(x.u)) + ' · ' + esc(x.ch) + '</small></span><a href="https://www.youtube.com/watch?v=' + x.id + '" target="_blank" rel="noopener noreferrer">▶ YouTube</a></div>').join('') + '</div>' +
    '<div class="row center" style="margin-top:12px"><button type="button" class="btn" id="pl-x" data-focus>Fatto</button></div>');
  $('modal-box').classList.add('wide');
  $('pl-x').addEventListener('click', () => { closeModal(); openVideos(); });
  $('modal-box').querySelectorAll('.vd-tg').forEach(b => b.addEventListener('click', () => {
    const h = vidHidden(), id = b.dataset.v, i = h.indexOf(id); if (i >= 0) h.splice(i, 1); else h.push(id); store.set('vid-hide', h);
    const off = h.includes(id); b.classList.toggle('off', off); b.textContent = off ? '🚫' : '✅';
  }));
}
