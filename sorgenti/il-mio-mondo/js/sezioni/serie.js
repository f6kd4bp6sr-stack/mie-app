/* ---------- 🎬 LA SERIE DEL DRAGO: «Le avventure del drago nella Storia» (pilota, novembre 2026) ----------
   Gli argomenti di Storia del programma di 5ª diventano episodi di un cartone, in ordine, come in classe.
   Ogni episodio = la spiegazione già verificata (data/spiegazioni/storia.json) recitata dal drago con la voce dell'iPad,
   scena che cambia a ogni frase e nodi della mappa che compaiono; finale «Nel prossimo episodio…».
   Per aprire l'episodio dopo: 🎬 pillole (curiosità brevi dalle domande verificate dell'argomento) + ⚡ sfida da 3 domande (almeno 2 giuste).
   📺 Video scelti per l'episodio (data/domande/serie.js) come extra, senza consumare i biglietti dei video.
   Progressi solo sull'iPad: chiave serie-storia {aperti: n, visti: {id: data}, sfide: {id: data}}. Nessuna percentuale. */
const SR_ERE = { grecia: ['#1d4e89', '#5fa8d3'], roma: ['#7a1f1f', '#d9774f'], italia: ['#5b3a1a', '#c08a4b'] };
const srEra = id => /^(roma|repubblica|impero|vita|torino)/.test(id) ? SR_ERE.roma : /^(italici|etruschi)/.test(id) ? SR_ERE.italia : SR_ERE.grecia;
const srEpisodi = () => (typeof SERIE !== 'undefined' ? SERIE.storia.episodi : []).filter(id => SPIEGA.storia && SPIEGA.storia[id]);
const srState = () => { const s = store.get('serie-storia', null) || {}; s.aperti = Math.max(1, s.aperti || 1); s.visti = s.visti || {}; s.sfide = s.sfide || {}; return s; };
const srSave = s => store.set('serie-storia', s);
const srNome = id => { const a = (ARGOMENTI.storia || []).find(x => x[0] === id); return a ? a[1] : id; };
const srIc = id => { const a = (ARGOMENTI.storia || []).find(x => x[0] === id); return a ? a[2] : '📜'; };
const srItems = id => (QUIZ.storia || []).filter(q => q.arg === id && q.k);
const srMix = a => a.map(x => [Math.random(), x]).sort((p, q) => p[0] - q[0]).map(p => p[1]);
let SR = null;
/* 📺 video proposti per episodio: la bambina vede solo quelli approvati dal genitore. vid-ok = {id: 1 approvato | -1 scartato}, solo sull'iPad */
const srVidOk = () => store.get('vid-ok', {});
/* deciso dal genitore (1/11/2026): per ora tutti i video proposti sono visibili e l'elenco si apre senza PIN; ❌ li nasconde. false = torna l'approvazione con PIN */
const SR_VID_AUTO = true;
const srVidVede = id => SR_VID_AUTO ? srVidOk()[id] !== -1 : srVidOk()[id] === 1;
const srVidAll = () => typeof SERIE === 'undefined' ? [] : Object.entries(SERIE.storia.video).flatMap(([ep, L]) => L.map(v => Object.assign({ ep, u: 'storia' }, v)));
const srVidDa = () => { const ok = srVidOk(); return srVidAll().filter(v => !(v.id in ok)); };
const srDrago = cls => dragonSVG(D ? levelOf(D.energy) : 1, D ? D.color : 'verde', cls);
if (!$('p-serie')) { const sec = document.createElement('section'); sec.id = 'p-serie'; sec.dataset.page = ''; sec.hidden = true; $('main').appendChild(sec); } /* episodio in corso: {id, k, i, play, timer} */

/* ---- pagina della serie ---- */
PAGES.serie = el => {
  const E = srEpisodi(), s = srState();
  el.innerHTML = '<div class="sr-hero" style="--a:' + srEra('grecia')[0] + ';--b:' + srEra('roma')[0] + '"><div class="sr-hd">' + srDrago('sr-hd-dr') + '</div><div><div class="sr-kick">🎬 La serie</div><h1 class="sr-title">Le avventure del drago nella Storia</h1><p>Un episodio alla volta, come in classe. Guarda, scopri le pillole e supera la sfida per aprire il prossimo!</p></div></div>' +
    '<div class="sr-list">' + E.map((id, k) => {
      const open = k < s.aperti, seen = s.visti[id], done = s.sfide[id];
      return '<button type="button" class="sr-ep' + (open ? '' : ' lock') + (done ? ' done' : '') + '" data-ep="' + k + '"' + (open ? '' : ' disabled') + ' style="--a:' + srEra(id)[0] + ';--b:' + srEra(id)[1] + '">' +
        '<span class="sr-n">' + (k + 1) + '</span><span class="sr-ic">' + (open ? srIc(id) : '🔒') + '</span><span class="sr-t"><b>' + esc(srNome(id)) + '</b><small>' +
        (done ? '✅ visto e superato' : seen ? (k === E.length - 1 ? '⚡ manca la sfida finale' : '⚡ manca la sfida per aprire il prossimo') : open ? '▶️ da guardare' : 'si apre con la sfida dell\'episodio prima') + '</small></span></button>';
    }).join('') + '</div>';
  el.querySelectorAll('.sr-ep:not(.lock)').forEach(b => b.addEventListener('click', () => srPlay(+b.dataset.ep)));
  if (srVidAll().length) { const pb = document.createElement('button'); pb.type = 'button'; pb.className = 'btn ghost sr-par'; pb.textContent = SR_VID_AUTO ? '👨‍👧 Genitore: video della serie' : '👨‍👧 Genitore: video' + (srVidDa().length ? ' da vedere (' + srVidDa().length + ')' : '');
  pb.addEventListener('click', () => SR_VID_AUTO ? srParent() : parentGate(srParent)); el.appendChild(pb); }
};

/* ---- il cartone ---- */
function srPlay(k) {
  const id = srEpisodi()[k], d = SPIEGA.storia[id]; if (!d) return;
  SR = { id, k, i: 0, play: true, timer: null };
  let ov = $('sr-ov'); if (!ov) { ov = document.createElement('div'); ov.id = 'sr-ov'; document.body.appendChild(ov); }
  ov.hidden = false; ov.style.setProperty('--a', srEra(id)[0]); ov.style.setProperty('--b', srEra(id)[1]);
  ov.innerHTML = '<div class="sr-top"><span class="sr-epn">Episodio ' + (k + 1) + '</span><b>' + esc(srNome(id)) + '</b><button type="button" class="sr-x" aria-label="Chiudi">✕</button></div>' +
    '<div class="sr-stage"><div class="sr-chips" id="sr-chips"></div><div class="sr-scene" id="sr-scene">' + srIc(id) + '</div><div class="sr-drago">' + srDrago('sr-dr') + '</div><div class="sr-bubble" id="sr-bub"></div></div>' +
    '<div class="sr-dots" id="sr-dots">' + d.racconto.map((_, i) => '<i data-i="' + i + '"></i>').join('') + '</div>' +
    '<div class="sr-ctl"><button type="button" id="sr-prev" aria-label="Indietro">⏮</button><button type="button" id="sr-pp" aria-label="Pausa">⏸</button><button type="button" id="sr-next" aria-label="Avanti">⏭</button></div>';
  ov.querySelector('.sr-x').onclick = srClose;
  $('sr-prev').onclick = () => srGo(SR.i - 1);
  $('sr-next').onclick = () => srGo(SR.i + 1);
  $('sr-pp').onclick = () => { SR.play = !SR.play; $('sr-pp').textContent = SR.play ? '⏸' : '▶️'; if (SR.play) srGo(SR.i); else { clearTimeout(SR.timer); clearTimeout(SR.wd); try { speechSynthesis.cancel(); } catch (e) {} } };
  srGo(0);
}
function srGo(i) {
  if (!SR) return; const d = SPIEGA.storia[SR.id], R = d.racconto;
  clearTimeout(SR.timer); clearTimeout(SR.wd); try { speechSynthesis.cancel(); } catch (e) {}
  if (i < 0) i = 0; if (i >= R.length) return srFine();
  SR.i = i; const sl = R[i], N = {}; (d.nodi || []).forEach(n => N[n.id] = n);
  const bub = $('sr-bub'); bub.classList.remove('in'); void bub.offsetWidth; bub.textContent = sl.t; bub.classList.add('in');
  const shown = new Set(); R.slice(0, i + 1).forEach(x => (x.nodi || []).forEach(n => shown.add(n)));
  $('sr-chips').innerHTML = [...shown].map(n => N[n] ? '<span class="sr-chip' + ((sl.nodi || []).includes(n) ? ' new' : '') + '">' + (N[n].ic || '') + ' ' + esc(N[n].n) + (N[n].anno != null ? '<small>' + (N[n].anno < 0 ? -N[n].anno + ' a.C.' : N[n].anno + ' d.C.') + '</small>' : '') + '</span>' : '').join('');
  const nn = (sl.nodi || []).map(n => N[n]).filter(Boolean)[0], sc = $('sr-scene'); if (sc) { sc.classList.remove('in'); void sc.offsetWidth; const cart = typeof CARTONI !== 'undefined' && CARTONI[SR.id] && CARTONI[SR.id][i]; sc.classList.toggle('cart', !!cart); if (cart) sc.innerHTML = '<svg viewBox="0 0 400 240" role="img" aria-hidden="true">' + cart + '</svg>'; else sc.textContent = nn && nn.ic ? nn.ic : srIc(SR.id); sc.classList.add('in'); }
  $('sr-dots').querySelectorAll('i').forEach((e, k) => e.className = k < i ? 'on' : k === i ? 'cur' : '');
  const dr = document.querySelector('#sr-ov .sr-drago'); if (dr) { dr.classList.remove('talk'); void dr.offsetWidth; dr.classList.add('talk'); }
  if (!SR.play) return;
  const next = () => { if (SR && SR.play) SR.timer = setTimeout(() => srGo(SR.i + 1), 900); };
  /* rete di sicurezza: se la voce dell'iPad non avvisa la fine della frase, si va avanti lo stesso */
  if (Voice.ok) { const me = i; SR.wd = setTimeout(() => { if (SR && SR.play && SR.i === me) srGo(me + 1); }, 4000 + 520 * sl.t.split(/\s+/).length); Voice.say(sl.v || sl.t, null, { onend: () => { if (SR) clearTimeout(SR.wd); next(); } }); }
  else SR.timer = setTimeout(() => srGo(SR.i + 1), 900 + 380 * (sl.t.split(/\s+/).length));
}
function srFine() {
  const s = srState(), id = SR.id, k = SR.k, E = srEpisodi(), nx = E[k + 1];
  if (!s.visti[id]) { s.visti[id] = todayIso(); srSave(s); }
  const teaser = nx && SPIEGA.storia[nx] ? SPIEGA.storia[nx].racconto[0].t : '';
  const V = ((typeof SERIE !== 'undefined' && SERIE.storia.video[id]) || []).filter(v => srVidVede(v.id));
  const stage = document.querySelector('#sr-ov .sr-stage');
  stage.innerHTML = '<div class="sr-end"><div class="sr-endt">🎬 Fine dell\'episodio ' + (k + 1) + '</div>' +
    (nx ? '<div class="sr-next"><small>Nel prossimo episodio…</small><b>' + srIc(nx) + ' ' + esc(srNome(nx)) + '</b><p>' + esc(teaser) + '</p></div>' : '<div class="sr-next"><b>🏆 Hai visto tutta la serie!</b></div>') +
    '<div class="sr-acts">' + (s.sfide[id] ? '' : '<button type="button" class="btn" id="sr-pil">🎬 Pillole e ⚡ sfida' + (nx ? ' per aprirlo' : '') + '</button>') +
    (s.sfide[id] && nx && k + 1 < s.aperti ? '<button type="button" class="btn" id="sr-go">▶️ Episodio ' + (k + 2) + '</button>' : '') +
    '<button type="button" class="btn ghost" id="sr-rew">🔁 Rivedi</button></div>' +
    (V.length ? '<div class="sr-vid"><small>📺 Guarda anche</small>' + V.map(v => '<button type="button" class="sr-vb" data-v="' + esc(v.id) + '">▶ ' + esc(v.t) + '<small>' + esc(v.ch) + (v.min ? ' · ' + v.min + ' min' : '') + '</small></button>').join('') + '</div>' : '') + '</div>';
  ['sr-dots', 'sr-prev', 'sr-pp', 'sr-next'].forEach(x => { const e = $(x); if (e) e.style.visibility = 'hidden'; });
  if ($('sr-pil')) $('sr-pil').onclick = () => srPillole(k);
  if ($('sr-go')) $('sr-go').onclick = () => srPlay(k + 1);
  $('sr-rew').onclick = () => srPlay(k);
  stage.querySelectorAll('.sr-vb').forEach(b => b.onclick = () => { srClose(); playVideo(b.dataset.v, true); });
  if (Voice.ok && nx) Voice.say('Nel prossimo episodio: ' + srNome(nx) + '.');
}

/* ---- pillole: una curiosità per schermata, si scorre in su ---- */
/* se la spiegazione ripete già la frase chiave, la pillola la mostra una volta sola */
const srNorm = t => String(t || '').toLowerCase().replace(/[^a-zà-ù0-9]+/g, ' ').trim();
const srDup = q => !!q.e && srNorm(q.e).startsWith(srNorm(q.k));
function srPillole(k) {
  const id = srEpisodi()[k], P = srMix(srItems(id)).slice(0, 6), stage = document.querySelector('#sr-ov .sr-stage');
  stage.innerHTML = '<div class="sr-pil" id="sr-pil-l">' + P.map((q, i) => '<section class="sr-pc" data-i="' + i + '"><div class="sr-pn">' + srIc(id) + ' ' + (i + 1) + '/' + P.length + '</div>' + (srDup(q) ? '<b>' + esc(q.e) + '</b>' : '<b>' + esc(q.k) + '</b><p>' + esc(q.e || '') + '</p>') + '<small>scorri in su ⬆️</small></section>').join('') +
    '<section class="sr-pc sr-pc-go"><b>⚡ Pronta per la sfida?</b><p>3 domande: con almeno 2 giuste si apre il prossimo episodio.</p><button type="button" class="btn" id="sr-sf">⚡ Via!</button></section></div>';
  const L = $('sr-pil-l'); let last = -1;
  const io = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting || e.intersectionRatio < 0.6) return; const i = +e.target.dataset.i; if (isNaN(i) || i === last) return; last = i; if (Voice.ok) Voice.say(srDup(P[i]) ? P[i].e : P[i].k + '. ' + (P[i].e || '')); }), { root: L, threshold: [0.6] });
  L.querySelectorAll('.sr-pc[data-i]').forEach(c => io.observe(c));
  $('sr-sf').onclick = () => { io.disconnect(); srSfida(k); };
}

/* ---- sfida: 3 domande dell'argomento, almeno 2 giuste ---- */
function srSfida(k) {
  const id = srEpisodi()[k], Q = srMix(srItems(id)).slice(0, 3), stage = document.querySelector('#sr-ov .sr-stage');
  let i = 0, ok = 0;
  const show = () => {
    try { speechSynthesis.cancel(); } catch (e) {}
    if (i >= Q.length) return fine();
    const q = Q[i], opts = srMix([q.ok].concat(q.wrong || []).slice(0, 3));
    stage.innerHTML = '<div class="sr-q"><small>⚡ Sfida · ' + (i + 1) + '/' + Q.length + '</small><b>' + esc(q.q) + '</b><div class="sr-opts">' + opts.map(o => '<button type="button" class="sr-o">' + esc(o) + '</button>').join('') + '</div><p class="sr-fb" id="sr-fb"></p></div>';
    if (Voice.ok) Voice.say(q.q);
    stage.querySelectorAll('.sr-o').forEach(b => b.onclick = () => {
      const giusta = b.textContent === q.ok; if (giusta) ok++;
      stage.querySelectorAll('.sr-o').forEach(x => { x.disabled = true; if (x.textContent === q.ok) x.classList.add('ok'); else if (x === b) x.classList.add('no'); });
      $('sr-fb').textContent = (giusta ? '✅ Giusto! ' : '💡 ') + (q.e || q.k);
      setTimeout(() => { i++; show(); }, giusta ? 1600 : 3200);
    });
  };
  const fine = () => {
    const s = srState(), E = srEpisodi(), pass = ok >= 2;
    if (pass && !s.sfide[id]) { s.sfide[id] = todayIso(); s.aperti = Math.max(s.aperti, k + 2); srSave(s); try { Gems.add(5); } catch (e) {} }
    const nx = E[k + 1];
    stage.innerHTML = '<div class="sr-end"><div class="sr-endt">' + (pass ? '🎉 Sfida superata! ' + ok + ' su 3' : '💪 Quasi! ' + ok + ' su 3') + '</div>' +
      (pass ? (nx ? '<div class="sr-next"><small>Si è aperto</small><b>' + srIc(nx) + ' Episodio ' + (k + 2) + ': ' + esc(srNome(nx)) + '</b><p>+5 💎</p></div>' : '<div class="sr-next"><b>🏆 Serie completata!</b></div>') : '<div class="sr-next"><p>Rivedi le pillole e riprova: le domande cambiano.</p></div>') +
      '<div class="sr-acts">' + (pass && nx ? '<button type="button" class="btn" id="sr-go">▶️ Guarda l\'episodio ' + (k + 2) + '</button>' : '') + (pass ? '' : '<button type="button" class="btn" id="sr-again">🎬 Pillole e sfida</button>') + '<button type="button" class="btn ghost" id="sr-list">📋 Tutti gli episodi</button></div></div>';
    if ($('sr-go')) $('sr-go').onclick = () => srPlay(k + 1);
    if ($('sr-again')) $('sr-again').onclick = () => srPillole(k);
    $('sr-list').onclick = () => { srClose(); go('serie'); };
    if (Voice.ok) Voice.say(pass ? 'Sfida superata!' : 'Quasi! Riprova.');
  };
  show();
}
function srClose() { if (SR) { clearTimeout(SR.timer); clearTimeout(SR.wd); } SR = null; try { speechSynthesis.cancel(); } catch (e) {} const ov = $('sr-ov'); if (ov) { ov.hidden = true; ov.innerHTML = ''; } if (typeof current !== 'undefined' && current === 'serie') go('serie'); }

/* ---- ingresso dalla pagina di Storia: banner della serie ---- */
(function srMateria() {
  const m0 = PAGES.materia;
  PAGES.materia = el => {
    m0(el);
    const u = unitById(pathSel || store.get('path-sel', '')); if (!u || u.id !== 'storia' || !srEpisodi().length) return;
    const s = srState(), E = srEpisodi(), cur = Math.min(s.aperti, E.length) - 1, b = document.createElement('button');
    b.type = 'button'; b.className = 'sr-banner'; b.innerHTML = '<span>🎬</span><b>La serie del drago</b><small>Episodio ' + (cur + 1) + ': ' + esc(srNome(E[cur])) + ' ›</small>';
    b.addEventListener('click', () => go('serie'));
    const h = el.querySelector('h1, .m-head'); if (h && h.parentNode) h.parentNode.insertBefore(b, h.nextSibling); else el.prepend(b);
  };
})();

/* 🔗 link d'invito (pagine /episodi/N.html, mandate da papà su WhatsApp): #serie apre la serie, #serie=N l'episodio N se è già aperto */
function srLink() {
  const m = String(location.hash || '').match(/^#serie(?:=(\d+))?$/); if (!m) return;
  try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
  const t = () => { const md = $('modal'); if (!D || (md && !md.hidden)) return setTimeout(t, 1500);
    go('serie'); const k = (+m[1] || 0) - 1; if (k >= 0 && k < srState().aperti && k < srEpisodi().length) srPlay(k); };
  setTimeout(t, 800);
}
srLink(); window.addEventListener('hashchange', srLink);

/* 👨‍👧 angolo del genitore (dopo il PIN): guarda i video proposti e decide ✅ / ❌; finché non decide, la bambina non li vede */
function srParent() {
  const ok = srVidOk(), E = srEpisodi(), da = srVidDa().length;
  const row = v => '<div class="vd-pr sr-pr" data-v="' + v.id + '"><span><b>' + esc(v.t) + '</b><small>' + esc(v.ch || 'canale da controllare') + (v.min ? ' · ' + Math.round(v.min) + ' min' : '') + '</small></span>' +
    '<a href="https://www.youtube.com/watch?v=' + v.id + '" target="_blank" rel="noopener noreferrer">▶ Guarda</a>' +
    '<button type="button" class="sr-ok' + (ok[v.id] === 1 ? ' on' : '') + '" data-a="1" aria-label="Approva">✅</button><button type="button" class="sr-no' + (ok[v.id] === -1 ? ' on' : '') + '" data-a="-1" aria-label="Scarta">❌</button></div>';
  openModal('<div class="big" style="font-size:24px">👨‍👧 Video della serie</div><p style="font-weight:700;color:var(--ink-soft)">' + (SR_VID_AUTO ? 'Per ora tutti i video sono visibili alla fine dell’episodio. Tocca ❌ per nascondere quelli che non vanno bene; ✅ segna quelli che hai già guardato.' : 'Guarda ogni video e decidi: ✅ lo vede alla fine dell’episodio, ❌ non lo vede. Finché non scegli, resta nascosto.' + (da ? ' <b>Da vedere: ' + da + '.</b>' : '')) + '</p>' +
    '<div class="vd-par-list">' + E.map((id, k) => { const L = (SERIE.storia.video[id] || []).map(v => Object.assign({ ep: id }, v)); return L.length ? '<div class="sr-pg">' + (k + 1) + '. ' + srIc(id) + ' ' + esc(srNome(id)) + '</div>' + L.map(row).join('') : ''; }).join('') + '</div>' +
    '<div class="row center" style="margin-top:12px"><button type="button" class="btn" id="srp-x" data-focus>Fatto</button></div>');
  $('modal-box').classList.add('wide');
  $('srp-x').addEventListener('click', () => { closeModal(); if (current === 'serie') go('serie'); });
  $('modal-box').querySelectorAll('.sr-pr button').forEach(b => b.addEventListener('click', () => {
    const r = b.closest('.sr-pr'), o = srVidOk(), a = +b.dataset.a;
    if (o[r.dataset.v] === a) delete o[r.dataset.v]; else o[r.dataset.v] = a; store.set('vid-ok', o);
    try { window.__mondoSyncPush && window.__mondoSyncPush(true); } catch (e) {}
    r.querySelector('.sr-ok').classList.toggle('on', o[r.dataset.v] === 1); r.querySelector('.sr-no').classList.toggle('on', o[r.dataset.v] === -1);
  }));
}
