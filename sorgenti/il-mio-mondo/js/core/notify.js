/* ================= NOTIFICHE: «il drago ti aspetta» =================
   - all'apertura del giorno il drago saluta e racconta le novità (gioco del giorno, ripassi, missioni…)
   - 🔔 in alto con il numero delle novità da vedere
   - pallino sul simbolo dell'app nella schermata Home (se l'iPad lo permette)
   Le notifiche ad app chiusa richiederebbero un server: qui tutto resta sull'iPad. */

/* ---------- gioco del giorno: ogni giorno il drago ne propone uno, con un premio ---------- */
const GOTD_EXTRA = { diff: ['🦊 livello medio', '🦅 livello difficile', '🐣 livello facile'], cuoca: ['con 4 ingredienti', 'con 5 ingredienti'], simon: ['prova a battere il record'], gone: ['occhi aperti!'], colors: ['più veloce che puoi'] };
function gameOfDay() {
  let g = store.get('gotd', null);
  if (!g || g.d !== todayIso()) {
    const seed = parseInt(hashQ('g' + todayIso()), 36), list = GAMES.map(x => x.id), id = list[seed % list.length], ex = GOTD_EXTRA[id] || [''];
    g = { d: todayIso(), id, ex: ex[seed % ex.length], done: false }; store.set('gotd', g);
  }
  return g;
}
(function hookGames() {
  const md = markDay;
  markDay = function (kind, el) {
    md(kind, el);
    if (kind !== 'giochi') return;
    const g = gameOfDay();
    if (!g.done && typeof gameSel !== 'undefined' && gameSel === g.id) { g.done = true; store.set('gotd', g); Gems.add(8); setTimeout(() => toastV2('🎮 Gioco del giorno completato: +8 💎!'), 900); notifyPaint(); }
  };
})();

/* ---------- le novità ---------- */
function newsItems() {
  if (!D) return [];
  const N = [], open = typeof tabsOpen === 'function' ? tabsOpen() : { giochi: true };
  const g = gameOfDay(), gm = GAMES.find(x => x.id === g.id);
  if (open.giochi && gm && !g.done) N.push({ k: 'gotd', ic: gm.ic, t: 'Nuovo gioco del giorno: ' + gm.name, s: (g.ex ? g.ex + ' · ' : '') + 'premio +8 💎', go: () => { gameSel = g.id; go('giochi'); } });
  const due = dueKeys(pState()).length;
  if (due) N.push({ k: 'rip', ic: '💪', t: due + (due === 1 ? ' ricordo da rafforzare' : ' ricordi da rafforzare'), s: 'Il ripasso al momento giusto li fissa per sempre', go: () => startLesson(null, 0, { daily: true }) });
  const q = questsToday(), left = 0; /* niente missioni nell'interfaccia semplice */
  if (left) N.push({ k: 'quest', ic: '📜', t: left === 3 ? 'Tre missioni nuove ti aspettano' : 'Ancora ' + left + (left === 1 ? ' missione' : ' missioni') + ' per il forziere', s: '🎁 Forziere da +10 💎', go: () => go('home') });
  const dg = dayGoal();
  if (false && !dg.done) N.push({ k: 'goal', ic: '🎯', t: 'Obiettivo di oggi: ' + Math.min(dg.nuove, GOAL.nuove) + ' nozioni su ' + GOAL.nuove, s: 'Una lezione e ci sei quasi', go: () => go('home') });
  const tes = TESORI && COLL.get(), foundToday = Object.keys((tes && tes.h) || {}).filter(k => k.startsWith(todayIso())).length;
  if (foundToday < 2) N.push({ k: 'tes', ic: '🔍', t: 'Oggi ci sono tesori nascosti nell’app', s: 'Aguzza la vista in ogni sezione', go: null });
  const pg = Piggy.get(); if (pg.hist && pg.hist[0] && pg.hist[0].d === todayIso()) N.push({ k: 'pig', ic: '🐷', t: 'Il salvadanaio è cresciuto di ' + pg.hist[0].it + ' 💎', s: 'È l’interesse di chi risparmia', go: () => openShop() });
  const nx = nextUnitNeed && nextUnitNeed(); if (nx && nx.need <= 5) N.push({ k: 'unit', ic: '🔓', t: 'Quasi aperta: ' + nx.u.ic + ' ' + nx.u.name, s: 'Mancano ' + nx.need + (nx.need === 1 ? ' nozione' : ' nozioni'), go: () => go('home') });
  if (typeof vidOpen === 'function' && vidOpen()) { const v = vidState(); if (v.tickets > 0 && v.today < VID_MAX_DAY) N.push({ k: 'vid', ic: '🎬', t: v.tickets === 1 ? 'Hai un biglietto per un video' : 'Hai ' + v.tickets + ' biglietti per i video', s: 'Un premio per le tue lezioni', go: () => openVideos() }); }
  const b = birthday(); if (b && b.days <= 1) N.push({ k: 'bday', ic: '🎂', t: b.days === 0 ? 'Oggi è il tuo compleanno! Auguri!' : 'Domani è il tuo compleanno!', s: D.name + ' ha preparato una festa', go: b.days === 0 && typeof festaOpen === 'function' ? () => festaOpen() : null });
  return N;
}
/* letto/non letto: ogni novità ha una «firma» (cambia se cambia il numero: 5 ricordi → 4 ricordi = di nuovo novità)
   e dopo REAPPEAR minuti il drago torna a farsi vedere, così il pallino ricompare spesso durante la giornata */
const REAPPEAR = 90;
const newsSig = n => n.k + '|' + n.t;
const notifRead = () => { const r = store.get('notif-read2', {}); return r.d === todayIso() && r.m ? r : { d: todayIso(), m: {} }; };
const notifUnread = () => { const r = notifRead(), now = Date.now(); return newsItems().filter(n => { const t = r.m[newsSig(n)]; return !t || now - t > REAPPEAR * 6e4; }); };
function notifMarkAll() { const r = notifRead(), now = Date.now(); newsItems().forEach(n => { r.m[newsSig(n)] = now; }); store.set('notif-read2', r); notifPaint(); }

/* ---------- il pallino è un draghetto, del colore del suo drago ---------- */
function dotDragon(n, cls) {
  /* la testa del SUO drago (stesso colore, stessa età, stessi accessori), ritagliata in un medaglione */
  const st = D ? Math.max(1, levelOf(D.energy)) : 1, c = (D && DCOLORS[D.color]) || DCOLORS.verde;
  let svg = dragonSVG(st, D ? D.color : 'verde', '');
  svg = svg.replace(/viewBox="0 0 200 200"/, 'viewBox="' + (st >= 5 ? '44 8 112 112' : st >= 3 ? '48 22 104 104' : '52 32 96 96') + '"').replace(/ role="img" aria-label="[^"]*"/, ' aria-hidden="true" focusable="false"');
  return '<i class="dd ' + (cls || '') + '" aria-hidden="true" style="--dd-b:' + c[0] + ';--dd-l:' + c[1] + '"><span class="dd-h">' + svg + '</span>' +
    (n ? '<b>' + (n > 9 ? '9+' : n) + '</b>' : '') + '<span class="dd-sp">✦</span></i>';
}
/* quale sezione chiama: la novità accende il draghetto anche sulla linguetta in basso */
const NEWS_TAB = { gotd: 'giochi', rip: 'home', quest: 'home', goal: 'home', unit: 'home', pig: 'io', tes: 'esplora', bday: 'io', vid: 'io' };

/* ---------- 🔔 in alto ---------- */
let notifLastN = 0;
function notifPaint() {
  const bar = document.querySelector('.appbar-in'); if (!bar || !D) return;
  let b = $('bar-bell');
  if (!b) { b = document.createElement('button'); b.type = 'button'; b.id = 'bar-bell'; b.className = 'energy-pill v2-bell'; b.setAttribute('aria-label', 'Novità del drago'); bar.insertBefore(b, $('bar-streak') || bar.querySelector('.gem-pill')); b.addEventListener('click', () => openNews(false)); }
  const un = notifUnread(), n = un.length, col = (DCOLORS[D.color] || DCOLORS.verde)[0];
  b.style.setProperty('--dd', col);
  b.classList.toggle('has-news', !!n);
  b.setAttribute('aria-label', n ? D.name + ' ti aspetta: ' + n + (n === 1 ? ' novità' : ' novità') : 'Novità del drago');
  b.innerHTML = '<span aria-hidden="true">🔔</span>' + (n ? dotDragon(n, n > notifLastN ? 'pop' : '') : '');
  notifLastN = n;
  appBadge();
  /* linguette in basso */
  const tabs = {}; un.forEach(x => { const t = NEWS_TAB[x.k]; if (t) tabs[t] = 1; });
  document.querySelectorAll('#tabs .tab[data-t]').forEach(t => {
    const want = tabs[t.dataset.t] && t.getAttribute('aria-current') !== 'page', has = t.querySelector('.dd');
    if (want && !has) t.insertAdjacentHTML('beforeend', dotDragon(0, 'tab-dd'));
    else if (!want && has) has.remove();
    else if (want && has) has.outerHTML = dotDragon(0, 'tab-dd');
  });
}
/* ogni minuto ricontrolla: le novità tornano dopo un po' e il colore segue il drago */
setInterval(() => { if (document.visibilityState === 'visible') notifPaint(); }, 60000);
const notifyPaint = notifPaint;

/* ---------- il saluto del drago ---------- */
function greetLine() {
  const last = store.get('last-open', null), days = last ? Math.round((fromIso(todayIso()) - fromIso(last)) / 864e5) : 0, h = new Date().getHours();
  const nm = childName() || NAME;
  if (days >= 3) return 'Ciao ' + nm + '! Sono passati ' + days + ' giorni: mi sei mancata tantissimo! Ho preparato un sacco di novità.';
  if (days === 2) return 'Eccoti, ' + nm + '! Ieri ti ho aspettata: oggi recuperiamo insieme?';
  return pick(h < 12 ? ['Buongiorno ' + nm + '! Ti aspettavo con delle novità!', 'Che bello vederti, ' + nm + '! Oggi ho un gioco nuovo per te.'] : h < 18 ? ['Ciao ' + nm + '! Ti stavo aspettando!', 'Eccoti, ' + nm + '! Guarda cosa ti ho preparato.'] : ['Buonasera ' + nm + '! Due minuti insieme prima di riposare?', 'Ciao ' + nm + '! Ho conservato una sorpresa per te.']);
}
function openNews(greet) {
  const N = newsItems(), unread = notifUnread().map(n => n.k), i = levelOf(D.energy);
  openModal('<div class="v2-greet"><div class="v2-gd">' + dragonSVG(Math.max(1, i), D.color, 'bob') + '</div><div class="v2-gb">' + esc(greet ? greetLine() : D.name + ' ti racconta le novità di oggi:') + '</div></div>' +
    '<div class="v2-news">' + (N.length ? N.map((n, k) => '<button type="button" class="v2-nw' + (unread.includes(n.k) ? ' new' : '') + '" data-n="' + k + '"' + (n.go ? '' : ' data-nogo="1"') + '><span class="v2-ni">' + n.ic + '</span><span style="flex:1;min-width:0"><b>' + esc(n.t) + '</b><small>' + esc(n.s) + '</small></span>' + (n.go ? '<span class="v2-na">›</span>' : '') + '</button>').join('') : '<p style="font-weight:800">Hai fatto tutto per oggi! Sono fiero di te. 🌟</p>') + '</div>' +
    '<div class="row center" style="margin-top:12px"><button type="button" class="btn" id="nw-ok" data-focus style="--bc:var(--v2-green)">' + (greet ? 'Andiamo!' : 'Ok') + '</button></div>');
  notifMarkAll();
  $('nw-ok').addEventListener('click', closeModal);
  $('modal-box').querySelectorAll('.v2-nw:not([data-nogo])').forEach(b => b.addEventListener('click', () => { const n = N[+b.dataset.n]; closeModal(); if (n && n.go) n.go(); }));
}

/* ---------- pallino sul simbolo dell'app ---------- */
function appBadge() {
  try {
    if (!('setAppBadge' in navigator)) return;
    const n = notifUnread().length;
    n ? navigator.setAppBadge(n).catch(() => {}) : navigator.clearAppBadge().catch(() => {});
  } catch (e) {}
}
/* il pallino rosso sull'icona (come YouTube) richiede il permesso «Notifiche» dell'iPad: lo chiede il drago, una volta sola */
const isInstalled = () => navigator.standalone === true || (window.matchMedia && matchMedia('(display-mode: standalone)').matches);
function badgeInvite() {
  if (!('Notification' in window) || !('setAppBadge' in navigator) || !isInstalled()) return;
  if (Notification.permission !== 'default' || store.get('badge-asked', '') === todayIso() || (store.get('badge-asked-n', 0) >= 3)) return;
  if (!$('modal').hidden || ($('lesson') && !$('lesson').hidden) || (typeof festaBusy === 'function' && festaBusy())) { setTimeout(badgeInvite, 4000); return; }
  store.set('badge-asked', todayIso()); store.set('badge-asked-n', store.get('badge-asked-n', 0) + 1);
  openModal('<div class="v2-greet"><div class="v2-gd">' + dragonSVG(Math.max(1, levelOf(D.energy)), D.color, 'bob') + '</div><div class="v2-gb">Posso mettere un <b style="color:#ff3b30">pallino rosso</b> sulla mia icona quando ho novità per te? Tocca «Sì» e poi «Consenti».</div></div>' +
    '<div class="row center" style="gap:10px;margin-top:12px"><button type="button" class="btn ghost" id="bi-no">Più tardi</button><button type="button" class="btn" id="bi-ok" data-focus style="--bc:var(--v2-green)">Sì! 🔴</button></div>');
  $('bi-no').addEventListener('click', closeModal);
  $('bi-ok').addEventListener('click', async () => { const pr = Notification.requestPermission(); closeModal(); try { const r = await pr; if (r === 'granted') { toastV2('🔴 Fatto! Il drago ti chiamerà con il pallino rosso'); appBadge(); } } catch (e) {} });
}
async function askBadge() {
  if (!('Notification' in window)) { toastV2('Su questo iPad il pallino non è disponibile: serve l’app aggiunta alla schermata Home (iPadOS 16.4 o più)'); return; }
  try { const r = await Notification.requestPermission(); toastV2(r === 'granted' ? '🔔 Fatto! Il drago metterà un pallino sull’icona quando ti aspetta' : 'Permesso non concesso: si può attivare dalle Impostazioni dell’iPad'); } catch (e) {}
}

/* ---------- avvio: saluto una volta al giorno, poi 🔔 ---------- */
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') { store.set('last-open', todayIso()); appBadge(); } else { notifPaint(); greetIfNew(); } });
function greetIfNew() {
  if (!D) return;
  const today = todayIso();
  if (store.get('greet-day', '') === today) return;
  const t0 = Date.now(), tryShow = () => {
    if (!$('modal').hidden || ($('lesson') && !$('lesson').hidden) || (typeof festaBusy === 'function' && festaBusy())) { if (Date.now() - t0 < 20000) setTimeout(tryShow, 1500); return; }
    store.set('greet-day', today); openNews(true); store.set('last-open', today);
  };
  setTimeout(tryShow, 1200);
}
(function notifBoot() {
  const r = renderTabs; renderTabs = function () { r(); notifPaint(); };
  setTimeout(() => { notifPaint(); greetIfNew(); setTimeout(badgeInvite, 6000); }, 800);
})();
