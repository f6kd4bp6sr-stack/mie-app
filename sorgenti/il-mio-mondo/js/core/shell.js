/* ================= IL MIO MONDO · versione 2 (ispirata a Duolingo) =================
   Poche sezioni, chiare: 🏠 Impara · 🎮 Giochi · 📅 Diario · 🔭 Esplora · 🐉 Io.
   Le materie e le sezioni compaiono man mano che cresce la conoscenza. */
document.body.classList.add('v2');
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
function unitUnlockedIds() {
  const k = UNLOCK.start + Math.floor(knowTotal() / UNLOCK.per), s = pState();
  const ids = new Set(schoolUnits().slice(0, k).map(u => u.id));
  extraUnits().slice(0, extrasOpen()).forEach(u => ids.add(u.id));
  ALWAYS_OPEN.forEach(id => ids.add(id));
  pathUnits().forEach(u => { const us = (s.u || {})[u.id]; if (us && Object.keys(us.done || {}).length) ids.add(u.id); });
  return ids;
}
const nextUnitNeed = () => { const k = UNLOCK.start + Math.floor(knowTotal() / UNLOCK.per), units = schoolUnits(); if (k >= units.length) return null; return { u: units[k], need: (k - UNLOCK.start + 1) * UNLOCK.per - knowTotal() }; };
const nextExtra = () => { const n = extrasOpen(), x = extraUnits()[n]; if (!x) return null; const g = goalDays(); return { u: x, need: n === 0 ? 1 : 1 + 2 * n - g }; };
const oldUser = () => !!(Object.keys(store.get('math-done', {})).length || Object.keys(store.get('sci-done', {})).length);
function tabsOpen() {
  return { giochi: lessonsDone() >= 1 || oldUser(), esplora: knowTotal() >= UNLOCK.esplora || oldUser() };
}
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
function checkUnlocks() {
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
  const bar = document.querySelector('.appbar-in'); if (!bar) return;
  let st = $('bar-streak');
  if (!st) { st = document.createElement('button'); st.type = 'button'; st.id = 'bar-streak'; st.className = 'energy-pill v2-streak'; st.title = 'Giorni di fila'; bar.insertBefore(st, bar.querySelector('.gem-pill') || bar.querySelector('.energy-pill')); st.addEventListener('click', () => go('io')); }
  const n = streakDays(); st.innerHTML = '<span aria-hidden="true">' + (n ? '🔥' : '🌱') + '</span><b>' + n + '</b>'; st.setAttribute('aria-label', n + ' giorni di fila');
}

/* ---------- schede in basso ---------- */
renderTabs = function () {
  const open = tabsOpen(), box = $('tabs'); box.innerHTML = '';
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
['esplora', 'io', 'teatro'].forEach(id => { if (!$('p-' + id)) { const s = document.createElement('section'); s.id = 'p-' + id; s.dataset.page = ''; s.hidden = true; $('main').appendChild(s); } });

/* ---------- 🏠 IMPARA ---------- */
PAGES.home = el => {
  if (!D) { el.innerHTML = ''; return; }
  if (!store.get('gems-welcome', false)) { store.set('gems-welcome', true); Gems.add(20); }
  const ids = unitUnlockedIds();
  if (!pathSel) pathSel = store.get('path-sel', 'mate');
  if (!ids.has(pathSel)) pathSel = [...ids][0];
  const u = unitById(pathSel) || pathUnits()[0];
  const nodes = unitNodes(u), info = unitInfo(u), nk = nextNode(u), dg = dayGoal(), q = questsToday(), due = dueKeys(pState()).length;
  const bar = (v, max, c) => '<div class="v2-bar"><i style="width:' + Math.min(100, Math.round(v / Math.max(1, max) * 100)) + '%;background:' + c + '"></i></div>';
  const nx = nextUnitNeed(), mood = (store.get('diary', {}) || {})[todayIso()];
  const side =
    '<div class="v2-card"><div class="v2-ct">🎯 Obiettivo di oggi' + (dg.done ? ' <span class="v2-ok">✓</span>' : '') + '</div>' +
      '<div class="v2-row"><span>🌱 Nozioni nuove</span><b>' + Math.min(dg.nuove, GOAL.nuove) + '/' + GOAL.nuove + '</b></div>' + bar(dg.nuove, GOAL.nuove, 'var(--v2-green)') +
      (dg.ripGoal ? '<div class="v2-row"><span>💪 Ricordi rafforzati</span><b>' + Math.min(dg.rip, dg.ripGoal) + '/' + dg.ripGoal + '</b></div>' + bar(dg.rip, dg.ripGoal, 'var(--v2-blue)') : '') +
      '<div class="v2-row"><span>⏱️ Minuti</span><b>' + Math.round(dg.ms / 60000) + '/' + GOAL.minuti + '</b></div>' + bar(dg.ms / 60000, GOAL.minuti, 'var(--v2-orange)') +
      (due ? '<button type="button" class="v2-btn blue" id="v2-rip" style="margin-top:12px">💪 Rafforza i ricordi (' + due + ')</button>' : '') + '</div>' +
    '<div class="v2-card"><div class="v2-ct">📜 Missioni del giorno</div>' + q.list.map(x => { const d = QUESTS.find(z => z[0] === x.id); return '<div class="v2-q' + (x.done ? ' done' : '') + '"><span class="v2-qi">' + d[2] + '</span><div style="flex:1;min-width:0"><div class="v2-qt">' + esc(d[3]) + '</div>' + bar(x.p, x.g, 'var(--v2-yellow)') + '</div><b>' + (x.done ? '✓' : Math.min(x.p, x.g) + '/' + x.g) + '</b></div>'; }).join('') +
      '<div class="v2-chest">' + (q.chest ? '🎁 Forziere aperto: +10 💎' : '🎁 Completa le tre missioni per aprire il forziere') + '</div></div>' +
    (!mood ? '<button type="button" class="v2-card v2-mood" id="v2-mood"><span>💬</span><div><b>Come ti senti oggi?</b><small>Scrivilo nel diario</small></div></button>' : '') +
    (nx ? '<div class="v2-card v2-next"><span>🔒</span><div><b>Prossima materia: ' + esc(nx.u.ic + ' ' + nx.u.name) + '</b><small>Si apre con ancora ' + nx.need + (nx.need === 1 ? ' nozione imparata' : ' nozioni imparate') + '</small></div></div>' : '');
  const deco = PATH_DECO[store.get('path-theme', '') || 'base'];
  el.innerHTML =
    '<div class="v2-learn"><div class="v2-main">' +
      '<button type="button" class="v2-unit" id="v2-unit" style="--uc:' + u.c + '"><div><small>MATERIA · ' + info.learned + '/' + info.total + ' nozioni</small><b>' + esc(u.ic + ' ' + u.name) + '</b></div><span class="v2-switch">📚 Cambia</span></button>' +
      '<div class="v2-path path theme-' + (store.get('path-theme', '') || 'base') + '" style="--uc:' + u.c + '">' + nodes.map((nd, k) => {
        const st = nodeState(u, nodes, k), cur = k === nk, x = Math.round(Math.sin(k * 0.85) * 80);
        const ic = !st.open ? '🔒' : nd.t === 'rip' ? (nd.last ? '🏆' : '🎁') : st.conquered ? '👑' : st.done ? '⭐' : '★';
        const lab = nd.t === 'rip' ? (nd.last ? 'Grande ripasso' : 'Ripasso') : (u.math ? MATH_TAPPE[nd.i].n : 'Tappa ' + (nd.i + 1));
        return '<div class="pn-wrap" style="transform:translateX(' + x + 'px)">' + (k % 3 === 1 ? '<span class="pn-deco" style="' + (x > 0 ? 'right' : 'left') + ':-120px" aria-hidden="true">' + deco[k % deco.length] + '</span>' : '') + (cur ? '<div class="pn-bub">INIZIA</div>' : '') +
          '<button type="button" class="pn ' + (st.open ? 'open' : 'lock') + (st.done ? ' done' : '') + (st.conquered ? ' gold' : '') + (cur ? ' cur' : '') + (nd.t === 'rip' ? ' rip' : '') + '" data-k="' + k + '" ' + (st.open ? '' : 'disabled') + ' aria-label="' + esc(lab) + '">' + ic + '</button>' +
          (cur || st.done ? '<div class="pn-lab">' + esc(lab) + '</div>' : '') + '</div>';
      }).join('') + '</div></div>' +
      '<aside class="v2-side">' + side + '</aside></div>';
  $('v2-unit').addEventListener('click', openUnits);
  el.querySelectorAll('.pn.open').forEach(b => b.addEventListener('click', () => startLesson(u.id, +b.dataset.k)));
  if ($('v2-rip')) $('v2-rip').addEventListener('click', () => startLesson(null, 0, { daily: true }));
  if ($('v2-mood')) $('v2-mood').addEventListener('click', () => go('diario'));
  topbar(); checkUnlocks();
  setTimeout(() => { const c = el.querySelector('.pn.cur'); if (c && c.getBoundingClientRect().top > window.innerHeight * 0.75) c.scrollIntoView({ block: 'center' }); }, 60);
};
function openUnits() {
  const ids = unitUnlockedIds(), nx = nextUnitNeed(), ne = nextExtra();
  openModal('<div class="big" style="font-size:28px">📚 Le tue materie</div><p style="font-weight:700;color:var(--ink-soft)">Ogni ' + UNLOCK.per + ' nozioni si apre una materia. 🎁 Sport e Roblox sono premi per l’obiettivo del giorno.</p>' +
    '<div class="v2-units">' + pathUnits().map(x => { const on = ids.has(x.id), inf = unitInfo(x);
      return '<button type="button" class="v2-u' + (on ? '' : ' lock') + (x.id === pathSel ? ' sel' : '') + '" data-u="' + x.id + '" style="--uc:' + x.c + '"' + (on ? '' : ' disabled') + '><span class="v2-ui">' + (on ? x.ic : '🔒') + '</span><b>' + esc(x.name) + '</b><small>' + (on ? inf.pct + '%' : nx && nx.u.id === x.id ? 'ancora ' + nx.need : ne && ne.u.id === x.id ? '🎁 ' + ne.need + ' obiettiv' + (ne.need === 1 ? 'o' : 'i') : EXTRA_UNITS.includes(x.id) ? '🎁 premio' : '') + '</small></button>'; }).join('') + '</div>' +
    '<div class="row center" style="margin-top:12px"><button type="button" class="btn ghost" id="un-x" data-focus>Chiudi</button></div>');
  $('modal-box').classList.add('wide');
  $('un-x').addEventListener('click', closeModal);
  $('modal-box').querySelectorAll('.v2-u:not(.lock)').forEach(b => b.addEventListener('click', () => { pathSel = b.dataset.u; store.set('path-sel', pathSel); closeModal(); go('home'); }));
}

/* ---------- 🔭 ESPLORA: gli strumenti di prima, tutti insieme ---------- */
const EXPLORE = [['mate', '🔢', 'Officina dei numeri', 'Tabelline turbo, frazioni, orologio, problemi'], ['scienze', '🔬', 'Laboratorio', 'Esperimenti e quiz di scienze'], ['scopri', '🌍', 'Scopri il mondo', 'Storia, geografia, arte, lingue e curiosità'], ['sport', '🤸‍♀️', 'Pausa movimento', 'Pattinaggio, aerea, nuoto: muoviti!'], ['vita', '🧼', 'Io e il mio corpo', 'Armadio del meteo, timer di mani e denti'], ['teatro', '🎭', 'Teatro', 'La mia parte e i segreti del palco'], ['disegno', '🎨', 'Disegno', 'Tela libera, impara a disegnare, il mio museo'], ['routine', '☀️', 'Le mie routine', 'Mattino, compiti, sera e borse dello sport'], ['metodo', '🧠', 'Il mio metodo', 'Trucchi per studiare e concentrarsi']];
PAGES.esplora = el => {
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
    if (EXPLORE.some(e => e[0] === id)) { const el = $('p-' + id); if (el && !el.querySelector('.v2-back')) { const b = document.createElement('button'); b.type = 'button'; b.className = 'v2-back'; b.textContent = '← Esplora'; b.addEventListener('click', () => go('esplora')); el.insertBefore(b, el.firstChild); } }
    if (!TABS.some(t => t[0] === id) && !EXPLORE.some(e => e[0] === id)) { /* sezione non più visibile: nessun problema */ }
  };
})();
/* dopo ogni lezione: sblocchi, missioni e invio immediato ai genitori se collegato */
window.afterLessonV2 = L => {
  questEv('lez', 1); questEv('think', L.think || 0); questEv('combo', L.maxCombo || 0, true); questEv('rip', L.rip || 0);
  try { if (window.__mondoSyncPush) window.__mondoSyncPush(true); } catch (e) {}
};
