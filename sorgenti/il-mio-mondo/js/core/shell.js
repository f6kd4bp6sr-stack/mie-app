/* ================= IL MIO MONDO · versione 2 (ispirata a Duolingo) =================
   Interfaccia semplice: una sola 🏠 Casa con tutte le sezioni, tutte aperte da subito
   (niente percorso a tappe bloccate, niente missioni). Da ogni sezione «← Casa» riporta qui. */
document.body.classList.add('v2');
/* iPad: in alto a sinistra ci sono i tre pallini della finestra (chiudi, riduci, schermo intero): lì non mettiamo tasti */
if (navigator.maxTouchPoints > 1 && /iPad|Macintosh/.test(navigator.userAgent)) document.documentElement.classList.add('ipad-win');
Object.keys(BANNERS).forEach(k => delete BANNERS[k]);   // niente strisce di decorazioni: più pulito

/* ---------- conoscenza e sblocchi ---------- */
const UNLOCK = { start: 3, per: 20, esplora: 40 };
function knowTotal() {
  const s = pState(); let n = 0;
  Object.keys(s.srs || {}).forEach(k => { if ((s.srs[k] || {}).b > 0) n++; });
  const mu = (s.u || {}).mate || {}; n += Object.keys(mu.best || {}).filter(k => mu.best[k] >= 5).length * 5;
  return n;
}
function lessonsDone() { const s = pState(); let n = 0; Object.values(s.u || {}).forEach(u => Object.values(u.done || {}).forEach(c => n += c)); return n; }
/* materie di scuola: 3 subito, poi una ogni 20 nozioni. Extra (sport, Roblox): premio per l'obiettivo del giorno
   (il primo al primo obiettivo raggiunto, poi uno ogni 2 obiettivi) */
/* sezioni della vita di tutti i giorni: aperte da subito (scelta del genitore) */
const ALWAYS_OPEN = ['lavo', 'vesto', 'parlo'];   // «Parlo inglese»: materia del percorso aperta da subito (scelta del genitore)
const schoolUnits = () => pathUnits().filter(u => !EXTRA_UNITS.includes(u.id) && !ALWAYS_OPEN.includes(u.id));
const extraUnits = () => pathUnits().filter(u => EXTRA_UNITS.includes(u.id));
const goalDays = () => store.get('goal-days', []).length;
const extrasOpen = () => { const g = goalDays(); return g ? 1 + Math.floor((g - 1) / 2) : 0; };
/* tutte le materie sono aperte da subito (scelta del genitore) */
function unitUnlockedIds() { return new Set(pathUnits().map(u => u.id)); }
const nextUnitNeed = () => null;
const nextExtra = () => null;
const oldUser = () => !!(Object.keys(store.get('math-done', {})).length || Object.keys(store.get('sci-done', {})).length);
function tabsOpen() { return { giochi: true, esplora: true }; }
function streakDays() {
  const set = new Set(store.get('days', []).map(isoDay)); let n = 0, d = new Date();
  if (!set.has(iso(d))) d = addDays(d, -1);
  while (set.has(iso(d))) { n++; d = addDays(d, -1); }
  return n;
}
function isoDay(x) { const m = String(x).match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/); return m ? m[1] + '-' + m[2].padStart(2, '0') + '-' + m[3].padStart(2, '0') : String(x); }
/* i giorni d'uso si salvano nel formato AAAA-MM-GG (lo legge anche la sezione Progressi) */
(function fixDays() { try { const d = store.get('days', []); const n = [...new Set(d.map(isoDay))].sort(); if (JSON.stringify(n) !== JSON.stringify(d)) store.set('days', n); } catch (e) {} })();
const todayKeyOld = todayKey;
(function patchGainDays() {
  const g = gain;
  gain = function (n, el) { g(n, el); try { const d = store.get('days', []); const n2 = [...new Set(d.map(isoDay))].sort(); if (JSON.stringify(n2) !== JSON.stringify(d)) store.set('days', n2); } catch (e) {} };
})();

/* ---------- celebrazione quando si apre qualcosa di nuovo ---------- */
function checkUnlocks() { return; /* tutto è già aperto: niente più annunci di sblocco */ }
function checkUnlocksOld() {
  const seen = store.get('v2-seen', null), now = { units: [...unitUnlockedIds()], tabs: tabsOpen() };
  if (!seen) { store.set('v2-seen', now); return; }
  const newU = now.units.filter(x => !seen.units.includes(x)), newT = Object.keys(now.tabs).filter(k => now.tabs[k] && !seen.tabs[k]);
  if (!newU.length && !newT.length) { store.set('v2-seen', now); return; }
  if (!$('modal').hidden || $('lesson') && !$('lesson').hidden || (typeof festaBusy === 'function' && festaBusy())) { clearTimeout(checkUnlocks._t); checkUnlocks._t = setTimeout(checkUnlocks, 1500); return; }
  store.set('v2-seen', now);
  const names = newU.map(id => { const u = unitById(id); return u ? u.ic + ' ' + u.name : id; }).concat(newT.map(t => t === 'giochi' ? '🎮 la sezione Giochi' : '🔭 la sezione Esplora'));
  setTimeout(() => {
    fanfare(); try { confetti(window.innerWidth / 2, window.innerHeight / 3, 60); } catch (e) {}
    openModal('<div style="font-size:64px">🔓</div><div class="big" style="font-size:28px">Si è aperto qualcosa di nuovo!</div><p style="font-weight:800;font-size:19px">' + names.map(esc).join('<br>') + '</p><p style="font-weight:700;color:var(--ink-soft)">Più impari, più il tuo mondo si allarga.</p><button type="button" class="btn" id="ul-ok" data-focus style="--bc:var(--c4)">Evviva!</button>');
    $('ul-ok').addEventListener('click', () => { closeModal(); renderTabs(); });
  }, 600);
}

/* ---------- missioni del giorno ---------- */
const QUESTS = [
  ['lez', 2, '📘', 'Completa 2 lezioni'], ['gem', 20, '💎', 'Guadagna 20 gemme'], ['think', 3, '🧠', 'Ottieni 3 bonus «ci hai pensato»'],
  ['combo', 5, '🔥', 'Fai 5 risposte giuste di fila'], ['rip', 5, '💪', 'Rafforza 5 ricordi'], ['tes', 1, '🔍', 'Trova un tesoro nascosto'], ['fig', 1, '📒', 'Incolla una figurina']
];
function questsToday() {
  let q = store.get('quests', null);
  if (!q || q.d !== todayIso()) {
    const due = dueKeys(pState()).length, pool = QUESTS.filter(x => x[0] !== 'rip' || due >= 5);
    const seed = parseInt(hashQ(todayIso()), 36), list = [];
    let k = seed; while (list.length < 3) { const c = pool[k % pool.length]; if (!list.find(x => x.id === c[0])) list.push({ id: c[0], g: c[1], p: 0, done: false }); k = Math.floor(k / 7) + 13; }
    q = { d: todayIso(), list, chest: false }; store.set('quests', q);
  }
  return q;
}
let __questLock = false;
function questEv(id, n, max) {
  return; /* interfaccia semplice: niente missioni del giorno */
  const q = questsToday(); let changed = false;
  q.list.forEach(x => { if (x.id !== id || x.done) return; x.p = max ? Math.max(x.p, n) : x.p + n; changed = true;
    if (x.p >= x.g) { x.done = true; __questLock = true; Gems.add(5); __questLock = false; setTimeout(() => toastV2('✅ Missione completata: ' + QUESTS.find(z => z[0] === x.id)[3] + ' · +5 💎'), 300); } });
  if (changed && !q.chest && q.list.every(x => x.done)) { q.chest = true; __questLock = true; Gems.add(10); __questLock = false; setTimeout(() => { fanfare(); toastV2('🎁 Forziere del giorno aperto: +10 💎!'); }, 1200); }
  if (changed) store.set('quests', q);
}
(function hookGems() { const add = Gems.add; Gems.add = function (n, el, why) { add.call(Gems, n, el, why); if (n > 0 && !__questLock) questEv('gem', n); }; })();
function toastV2(t) { let el = $('v2-toast'); if (!el) { el = document.createElement('div'); el.id = 'v2-toast'; el.className = 'v2-toast'; document.body.appendChild(el); } el.textContent = t; el.classList.add('show'); clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('show'), 2600); }

/* ---------- tabelline del percorso → risultati per tabellina (li legge anche la sezione Progressi) ---------- */
function tabStat(a, ok) {
  const st = store.get('tab-acc', {}); const r = st[a] || []; r.push(ok ? 1 : 0); while (r.length > 10) r.shift(); st[a] = r; store.set('tab-acc', st);
  if (r.length >= 3) { const tb = store.get('tab-best', {}); tb[a] = Math.max(tb[a] || 0, Math.round(r.reduce((x, y) => x + y, 0) / r.length * 10)); store.set('tab-best', tb); }
}

/* ---------- barra in alto ---------- */
function topbar() {
  return; /* interfaccia semplice: niente contatore dei giorni di fila */
  const bar = document.querySelector('.appbar-in'); if (!bar) return;
  let st = $('bar-streak');
  if (!st) { st = document.createElement('button'); st.type = 'button'; st.id = 'bar-streak'; st.className = 'energy-pill v2-streak'; st.title = 'Giorni di fila'; bar.insertBefore(st, bar.querySelector('.gem-pill') || bar.querySelector('.energy-pill')); st.addEventListener('click', () => go('io')); }
  const n = streakDays(); st.innerHTML = '<span aria-hidden="true">' + (n ? '🔥' : '🌱') + '</span><b>' + n + '</b>'; st.setAttribute('aria-label', n + ' giorni di fila');
}

/* ---------- schede in basso ---------- */
renderTabs = function () {
  const box = $('tabs'); box.innerHTML = ''; TABS.length = 0; TABS.push(['home', '🏠', 'Casa', 'var(--c4-soft)']); return;
  const open = tabsOpen();
  const T = [['home', '🏠', 'Impara'], open.giochi && ['giochi', '🎮', 'Giochi'], ['diario', '📅', 'Diario'], open.esplora && ['esplora', '🔭', 'Esplora'], ['io', '🐉', 'Io']].filter(Boolean);
  TABS.length = 0; T.forEach(t => TABS.push([t[0], t[1], t[2], 'var(--c4-soft)']));
  const sub = { mate: 'esplora', scienze: 'esplora', scopri: 'esplora', sport: 'esplora', routine: 'esplora', metodo: 'esplora', teatro: 'esplora', disegno: 'esplora' };
  TABS.forEach(t => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'tab'; b.dataset.t = t[0];
    if (t[0] === current || sub[current] === t[0]) b.setAttribute('aria-current', 'page');
    b.innerHTML = '<span class="e" aria-hidden="true">' + t[1] + '</span>' + t[2];
    b.addEventListener('click', () => go(t[0])); box.appendChild(b);
  });
  topbar();
};
['esplora', 'io', 'teatro', 'materia'].forEach(id => { if (!$('p-' + id)) { const s = document.createElement('section'); s.id = 'p-' + id; s.dataset.page = ''; s.hidden = true; $('main').appendChild(s); } });

/* ---------- 🏠 CASA: tutte le sezioni, subito ---------- */
const HOME_DO = [['disegno', '🎨', 'Disegno'], ['giochi', '🎮', 'Giochi'], ['diario', '📅', 'Diario'], ['mate', '🔢', 'Officina dei numeri'], ['scienze', '🔬', 'Laboratorio'], ['scopri', '🌍', 'Scopri il mondo'], ['teatro', '🎭', 'Teatro'], ['sport', '🤸‍♀️', 'Pausa movimento'], ['vita', '🧼', 'Io e il mio corpo'], ['routine', '☀️', 'Le mie routine'], ['metodo', '🧠', 'Il mio metodo'], ['io', '🐉', 'Io e il mio drago']];
/* materie non di scuola: in fondo alla Casa */
const HOME_VITA = ['media', 'soldi', 'lavo', 'vesto', 'sp-patt', 'sp-aerea', 'sp-nuoto', 'sp-corpo', 'roblox'];
PAGES.home = el => {
  if (!D) { el.innerHTML = ''; return; }
  if (!store.get('gems-welcome', false)) { store.set('gems-welcome', true); Gems.add(20); }
  const due = dueKeys(pState()).length, last = unitById(store.get('path-sel', '')) || null;
  const tile = (go, ic, n, sm, c) => '<button type="button" class="v2-tile h-tile" data-go="' + go + '"' + (c ? ' style="--uc:' + c + '"' : '') + '><span class="v2-ti">' + ic + '</span><b>' + esc(n) + '</b>' + (sm ? '<small>' + esc(sm) + '</small>' : '') + '</button>';
  const ut = u => tile('u:' + u.id, u.ic, u.name, '', u.c);
  el.innerHTML = '<h1 class="v2-h1">' + (childName() ? 'Ciao ' + esc(childName()) + '!' : 'Ciao!') + '</h1><p class="v2-sub">Che cosa facciamo?</p>' +
    (last || due ? '<div class="h-quick">' + (last ? '<button type="button" class="v2-btn" id="h-cont" style="--uc:' + last.c + '">▶ Continua: ' + esc(last.ic + ' ' + last.name) + '</button>' : '') + (due ? '<button type="button" class="v2-btn blue" id="h-rip">💪 Ripasso (' + due + ')</button>' : '') + '</div>' : '') +
    '<input type="search" class="h-find" id="h-find" placeholder="🔎 Cerca un argomento in tutte le materie (es. acqua, Romani, frazioni)" autocomplete="off" enterkeyhint="search"><div id="h-res" hidden></div><div id="h-rest">' +
    '<h2 class="h-h2">📚 Materie di scuola</h2><div class="v2-grid h-grid">' + pathUnits().filter(u => !HOME_VITA.includes(u.id)).map(ut).join('') + '</div>' +
    '<h2 class="h-h2">🎨 Fare e scoprire</h2><div class="v2-grid h-grid">' + HOME_DO.map(x => tile(x[0], x[1], x[2])).join('') + '</div>' +
    '<h2 class="h-h2">🌟 Per la vita e per passione</h2><div class="v2-grid h-grid">' + HOME_VITA.map(unitById).filter(Boolean).map(ut).join('') + '</div></div>';
  el.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', () => { const g = b.dataset.go; if (g.startsWith('u:')) openMateria(g.slice(2)); else if (g === 'vita') openVita(); else go(g); }));
  if ($('h-cont')) $('h-cont').addEventListener('click', () => startLesson(last.id, nextNode(last)));
  if ($('h-rip')) $('h-rip').addEventListener('click', () => startLesson(null, 0, { daily: true }));
  homeSearchWire(el);
};
/* una materia: «Studia» riprende dalla prima lezione non fatta; tutte le lezioni si possono aprire */
function openMateria(id) { pathSel = id; store.set('path-sel', id); go('materia'); }
PAGES.materia = el => {
  const u = unitById(pathSel || store.get('path-sel', '')) || pathUnits()[0]; pathSel = u.id;
  const nodes = unitNodes(u), info = unitInfo(u), nk = nextNode(u), nx = nodes[nk];
  const name = nd => nd.t === 'arg' ? u.topics[nd.i].ic + ' ' + u.topics[nd.i].n : nd.t === 'rip' ? (nd.last ? '🏆 Ripasso di tutta la materia' : '🎁 Ripasso') : u.math ? MATH_TAPPE[nd.i].ic + ' ' + MATH_TAPPE[nd.i].n : '📘 Lezione ' + (nd.i + 1);
  const count = nd => nd.t === 'arg' ? topicLearned(u, u.topics[nd.i]) + '/' + u.topics[nd.i].items.length : '';
  el.innerHTML = '<h1 class="v2-h1">' + esc(u.ic + ' ' + u.name) + '</h1><p class="v2-sub">' + info.learned + ' nozioni imparate su ' + info.total + (u.topics ? ' · ' + u.topics.length + ' argomenti: scegli tu da dove partire' : '') + '</p>' +
    '<button type="button" class="v2-btn" id="m-go" style="max-width:520px">▶ ' + (nx && nx.t !== 'rip' ? 'Impara: ' + esc(name(nx).replace(/^\S+\s/, '')) : 'Ripassa') + '</button>' +
    (u.topics && u.topics.length > 6 ? '<input type="search" class="m-find" id="m-find" placeholder="🔎 Cerca un argomento di ' + esc(u.name) + '" autocomplete="off">' : '') +
    '<div class="m-list" id="m-list">' + nodes.map((nd, k) => { const st = nodeState(u, nodes, k);
      return '<button type="button" class="m-row' + (st.done ? ' done' : '') + (k === nk ? ' cur' : '') + '" data-k="' + k + '" data-n="' + esc(normQ(name(nd))) + '"><span>' + esc(name(nd)) + '</span><small>' + count(nd) + '</small><b>' + (st.conquered ? '👑' : st.done ? '⭐' : '') + '</b></button>'; }).join('') + '</div>';
  $('m-go').addEventListener('click', () => startLesson(u.id, nk));
  el.querySelectorAll('.m-row').forEach(b => b.addEventListener('click', () => startLesson(u.id, +b.dataset.k)));
  if ($('m-find')) $('m-find').addEventListener('input', e => { const w = qWords(e.target.value); el.querySelectorAll('.m-row').forEach(b => { b.hidden = w.length > 0 && !qHas(b.dataset.n, w); }); });
};

/* ---------- 🔎 ricerca libera per argomento, in tutte le materie (interdisciplinare) ---------- */
function normQ(t) { return String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim(); }
/* parole cercate: si confronta l'inizio della parola senza l'ultima lettera (romani → romana, romano; pianeti → pianeta) */
const qWords = q => normQ(q).split(' ').filter(x => x.length >= 2).map(x => x.length >= 6 ? x.slice(0, -1) : x);
const qHas = (nn, w) => w.every(x => (' ' + nn).includes(' ' + x));
let __qIdx = null;
function searchIndex() {
  if (__qIdx) return __qIdx;
  const T = [], Q = [];
  pathUnits().forEach(u => {
    if (u.topics) u.topics.forEach((t, i) => { T.push({ u, i, n: t.n, ic: t.ic, nn: normQ(t.n), size: t.items.length });
      t.items.forEach(it => Q.push({ u, it, ti: i, nn: normQ([it.q, it.o[it.a], it.k].join(' ')) })); });
    else if (u.math) MATH_TAPPE.forEach((m, i) => T.push({ u, math: i, n: m.n, ic: m.ic, nn: normQ(m.n), size: 6 }));
  });
  return (__qIdx = { T, Q });
}
function searchTopics(q) {
  const w = qWords(q); if (!w.length) return null;
  const has = nn => qHas(nn, w);
  const I = searchIndex(), qs = I.Q.filter(x => has(x.nn)), per = {};
  qs.forEach(x => { const k = x.u.id + ':' + x.ti; per[k] = (per[k] || 0) + 1; });
  const topics = I.T.map(t => ({ t, by: has(t.nn), hits: t.math === undefined ? per[t.u.id + ':' + t.i] || 0 : 0 })).filter(r => r.by || r.hits >= 1)
    .sort((a, b) => (b.by - a.by) || (b.hits - a.hits)).slice(0, 30);
  return { qs, topics, units: new Set(qs.map(x => x.u.id)).size };
}
function startMix(q) {
  const r = searchTopics(q); if (!r || !r.qs.length) return;
  const s = pState(), fresh = x => !((s.srs[itemKey(x.u, x.it)] || {}).b > 0);
  /* un po' da ogni materia, prima le nozioni nuove: così si vede lo stesso argomento da punti di vista diversi */
  const groups = {}; shuffle(r.qs.slice()).sort((a, b) => fresh(b) - fresh(a)).forEach(x => (groups[x.u.id] = groups[x.u.id] || []).push(x));
  const G = Object.values(groups), pick = [];
  while (pick.length < 8 && G.some(g => g.length)) G.forEach(g => { if (g.length && pick.length < 8) pick.push(g.shift()); });
  startLesson(null, 0, { mix: shuffle(pick), mixLabel: q.trim() });
}
function homeSearchWire(el) {
  const inp = $('h-find'), out = $('h-res'), rest = $('h-rest'); if (!inp) return;
  const paint = () => {
    const q = inp.value, r = searchTopics(q);
    rest.hidden = !!r; out.hidden = !r; if (!r) { out.innerHTML = ''; return; }
    out.innerHTML = (r.qs.length >= 3 ? '<button type="button" class="v2-btn" id="h-mix">🔀 Lezione mista su «' + esc(q.trim()) + '»' + (r.units > 1 ? ': domande da materie diverse' : '') + '</button><p class="v2-sub" style="margin:0 0 8px">' + r.qs.length + (r.qs.length === 1 ? ' domanda parla' : ' domande parlano') + ' di «' + esc(q.trim()) + '» in ' + r.units + (r.units === 1 ? ' materia' : ' materie') + '. Oppure scegli un argomento:</p>' : '') +
      (r.topics.length ? '<div class="m-list">' + r.topics.map((x, k) => '<button type="button" class="m-row" data-r="' + k + '"><span>' + esc(x.t.ic + ' ' + x.t.n) + '</span><small>' + esc(x.t.u.ic + ' ' + x.t.u.name) + (x.hits ? ' · ' + x.hits + (x.hits === 1 ? ' domanda' : ' domande') + ' su «' + q.trim() + '»' : '') + '</small></button>').join('') + '</div>'
        : '<p class="v2-sub">Nessun argomento trovato. Prova con un’altra parola (per esempio: acqua, Romani, frazioni, cuore).</p>');
    if ($('h-mix')) $('h-mix').addEventListener('click', () => startMix(q));
    out.querySelectorAll('[data-r]').forEach(b => b.addEventListener('click', () => { const x = r.topics[+b.dataset.r].t;
      if (x.math !== undefined) { pathSel = x.u.id; store.set('path-sel', x.u.id); startLesson(x.u.id, unitNodes(x.u).findIndex(nd => nd.t === 'lez' && nd.i === x.math)); }
      else { pathSel = x.u.id; store.set('path-sel', x.u.id); startLesson(x.u.id, x.i); } }));
  };
  let t = null; inp.addEventListener('input', () => { clearTimeout(t); t = setTimeout(paint, 180); });
  const last = store.get('h-find', ''); if (last) { inp.value = last; paint(); }
  inp.addEventListener('change', () => store.set('h-find', inp.value));
}
function openUnits() {
  const ids = unitUnlockedIds(), nx = nextUnitNeed(), ne = nextExtra();
  openModal('<div class="big" style="font-size:28px">📚 Le tue materie</div><p style="font-weight:700;color:var(--ink-soft)">Ogni ' + UNLOCK.per + ' nozioni si apre una materia. 🎁 Sport e Roblox sono premi per l’obiettivo del giorno.</p>' +
    '<div class="v2-units">' + pathUnits().map(x => { const on = ids.has(x.id), inf = unitInfo(x);
      return '<button type="button" class="v2-u' + (on ? '' : ' lock') + (x.id === pathSel ? ' sel' : '') + '" data-u="' + x.id + '" style="--uc:' + x.c + '"' + (on ? '' : ' disabled') + '><span class="v2-ui">' + (on ? x.ic : '🔒') + '</span><b>' + esc(x.name) + '</b><small>' + (on ? '' : nx && nx.u.id === x.id ? 'ancora ' + nx.need : ne && ne.u.id === x.id ? '🎁 ' + ne.need + ' obiettiv' + (ne.need === 1 ? 'o' : 'i') : EXTRA_UNITS.includes(x.id) ? '🎁 premio' : '') + '</small></button>'; }).join('') + '</div>' +
    '<div class="row center" style="margin-top:12px"><button type="button" class="btn ghost" id="un-x" data-focus>Chiudi</button></div>');
  $('modal-box').classList.add('wide');
  $('un-x').addEventListener('click', closeModal);
  $('modal-box').querySelectorAll('.v2-u:not(.lock)').forEach(b => b.addEventListener('click', () => { pathSel = b.dataset.u; store.set('path-sel', pathSel); closeModal(); go('home'); }));
}

/* ---------- 🔭 ESPLORA: gli strumenti di prima, tutti insieme ---------- */
const EXPLORE = [['mate', '🔢', 'Officina dei numeri', 'Tabelline turbo, frazioni, orologio, problemi'], ['scienze', '🔬', 'Laboratorio', 'Esperimenti e quiz di scienze'], ['scopri', '🌍', 'Scopri il mondo', 'Storia, geografia, arte, lingue e curiosità'], ['sport', '🤸‍♀️', 'Pausa movimento', 'Pattinaggio, aerea, nuoto: muoviti!'], ['vita', '🧼', 'Io e il mio corpo', 'Armadio del meteo, timer di mani e denti'], ['teatro', '🎭', 'Teatro', 'La mia parte e i segreti del palco'], ['disegno', '🎨', 'Disegno', 'Tela libera, impara a disegnare, il mio museo'], ['routine', '☀️', 'Le mie routine', 'Mattino, compiti, sera e borse dello sport'], ['metodo', '🧠', 'Il mio metodo', 'Trucchi per studiare e concentrarsi']];
PAGES.esplora = el => { setTimeout(() => go('home'), 0); };
PAGES.esploraOld = el => {
  el.innerHTML = '<h1 class="v2-h1">🔭 Esplora</h1><p class="v2-sub">Gli strumenti per allenarti e scoprire di più.</p><div class="v2-grid">' +
    EXPLORE.map(e => '<button type="button" class="v2-tile" data-go="' + e[0] + '"><span class="v2-ti">' + e[1] + '</span><b>' + esc(e[2]) + '</b><small>' + esc(e[3]) + '</small></button>').join('') + '</div>';
  el.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', () => b.dataset.go === 'vita' ? openVita() : go(b.dataset.go)));
};

/* ---------- 🐉 IO: drago, collezioni, negozio, impostazioni, salvataggi ---------- */
PAGES.io = el => {
  if (!D) { el.innerHTML = ''; return; }
  const i = levelOf(D.energy), ni = nextInfo(), b = birthday(), cnt = (n, t) => '<div class="v2-stat"><b>' + n + '</b><small>' + t + '</small></div>';
  el.innerHTML =
    '<div class="v2-me"><div class="v2-dragon">' + dragonSVG(i, D.color, 'bob') + '</div><div style="flex:1;min-width:0"><h1 class="v2-h1" style="margin:0">' + (childName() ? esc(childName()) + ' e ' : '') + esc(D.name) + '</h1>' +
      '<div class="v2-sub" style="margin:2px 0 8px">' + esc(LEVELS[i].n) + ' · ' + D.energy + ' 🔥 energia</div>' + '<div class="v2-bar big"><i style="width:' + ni.pct + '%;background:var(--v2-orange)"></i></div><small class="v2-sub">' + esc(ni.text) + '</small></div></div>' +
    (typeof linkWarn === 'function' ? linkWarn() : '') +
    '<div class="v2-stats">' + cnt(streakDays(), 'giorni di fila') + cnt(knowTotal(), 'nozioni imparate') + cnt(figOwned() + '/' + figTotal(), 'figurine') + cnt(tesoriFound() + '/' + TESORI.length, 'tesori trovati') + '</div>' +
    '<div class="v2-grid">' +
      '<button type="button" class="v2-tile" id="io-shop"><span class="v2-ti">🛍️</span><b>Negozio</b><small>💎 ' + Gems.get().n + ' gemme · salvadanaio</small></button>' +
      '<button type="button" class="v2-tile" id="io-alb"><span class="v2-ti">📒</span><b>Album</b><small>Le figurine della curiosità</small></button>' +
      '<button type="button" class="v2-tile" id="io-tes"><span class="v2-ti">🔍</span><b>Tesori nascosti</b><small>Uno al giorno in ogni sezione</small></button>' +
      '<button type="button" class="v2-tile" id="io-cust"><span class="v2-ti">✨</span><b>Personalizza</b><small>Il tuo aspetto e la voce del drago</small></button>' +
      '<button type="button" class="v2-tile" id="io-vita"><span class="v2-ti">🧼</span><b>Io e il mio corpo</b><small>Armadio del meteo · mani · denti</small></button>' +
      '<button type="button" class="v2-tile" id="io-teatro"><span class="v2-ti">🎭</span><b>Teatro</b><small>La mia parte e i segreti del palco</small></button>' +
      '<button type="button" class="v2-tile" id="io-vid"><span class="v2-ti">🎬</span><b>Video</b><small>' + (typeof vidOpen === 'function' && vidOpen() ? '🎟️ ' + vidState().tickets + ' biglietti' : '🎁 Premio: si apre con l’obiettivo') + '</small></button>' +
      '<button type="button" class="v2-tile" id="io-mus"><span class="v2-ti">🎵</span><b>Musica</b><small>Sottofondo per studiare</small></button>' +
      '<button type="button" class="v2-tile" id="io-set"><span class="v2-ti">⚙️</span><b>Impostazioni</b><small>Nomi, colore, compleanno, sport</small></button>' +
      '<button type="button" class="v2-tile" id="io-bg"><span class="v2-ti">🖼️</span><b>Sfondo</b><small>Scegli un paesaggio o una tua foto</small></button>' +
      '<button type="button" class="v2-tile" id="io-bell"><span class="v2-ti">🔔</span><b>Avvisi del drago</b><small>Novità di oggi e pallino sull’icona</small></button>' +
      '<button type="button" class="v2-tile" id="io-prog"><span class="v2-ti">📊</span><b>Progressi</b><small>Giuste e sbagliate per materia</small></button>' +
    '</div>' +
    (b ? '<div class="v2-card v2-next" style="margin-top:14px"><span>🎂</span><div><b>' + (b.days === 0 ? 'Oggi è il tuo compleanno! Auguri!' : b.days === 1 ? 'Domani è il tuo compleanno!' : 'Mancano ' + b.days + ' giorni al tuo compleanno') + '</b><small>' + esc(b.label) + '</small></div></div>' : '') +
    (typeof backupCard === 'function' ? backupCard() : '');
  $('io-shop').addEventListener('click', () => openShop());
  $('io-alb').addEventListener('click', () => openAlbum());
  $('io-tes').addEventListener('click', () => openTesori());
  $('io-cust').addEventListener('click', () => openCustomize('bimba'));
  $('io-mus').addEventListener('click', () => Music.panel());
  if ($('io-vita')) $('io-vita').addEventListener('click', () => openVita());
  if ($('io-vid')) $('io-vid').addEventListener('click', () => openVideos());
  if ($('io-teatro')) $('io-teatro').addEventListener('click', () => go('teatro'));
  $('io-set').addEventListener('click', () => onboarding(true));
  if ($('io-bg')) $('io-bg').addEventListener('click', () => openBg());
  if ($('io-prog')) $('io-prog').addEventListener('click', () => openProg());
  if (typeof wireLinkWarn === 'function') wireLinkWarn();
  $('io-bell').addEventListener('click', () => { if (typeof openNews === 'function') { openNews(false); const r = $('modal-box').querySelector('.row'); if (r && 'Notification' in window && Notification.permission !== 'granted') { const x = document.createElement('button'); x.type = 'button'; x.className = 'btn ghost'; x.textContent = '🔴 Attiva il pallino sull’icona'; x.addEventListener('click', askBadge); r.appendChild(x); } } });
  if (typeof wireBackup === 'function') wireBackup();
};

/* ---------- ritorno a Esplora dalle sezioni interne ---------- */
(function hookGoBack() {
  const orig = go;
  go = function (id) {
    orig(id);
    if (id !== 'home') { const el = $('p-' + id); if (el && !el.querySelector('.v2-back')) { const b = document.createElement('button'); b.type = 'button'; b.className = 'v2-back'; b.textContent = '← Casa'; b.addEventListener('click', () => go('home')); el.insertBefore(b, el.firstChild); } }
  };
})();
/* dopo ogni lezione: sblocchi, missioni e invio immediato ai genitori se collegato */
window.afterLessonV2 = L => {
  questEv('lez', 1); questEv('think', L.think || 0); questEv('combo', L.maxCombo || 0, true); questEv('rip', L.rip || 0);
  try { if (window.__mondoSyncPush) window.__mondoSyncPush(true); } catch (e) {}
};
