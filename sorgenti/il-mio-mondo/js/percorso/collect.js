/* ================= COLLEZIONI: figurine della curiosità, tesori nascosti, trova le differenze, salvadanaio =================
   Tutto serve a far venire voglia di cercare, leggere con attenzione e ricordare. */

const COLL = {
  get() { return Object.assign({ f: {}, pend: {}, h: {}, o: {}, done: {} }, store.get('coll', {})); },
  set(c) { store.set('coll', c); }
};

/* ---------- 📒 figurine della curiosità ---------- */
const figUnits = () => Object.keys(typeof CURIOSITA !== 'undefined' ? CURIOSITA : {});
const figTotal = () => figUnits().reduce((a, k) => a + CURIOSITA[k].length, 0);
const figOwned = () => { const c = COLL.get(); return Object.keys(c.f).reduce((a, k) => a + c.f[k].length, 0); };
function figUnlock(uid) {
  if (typeof CURIOSITA === 'undefined') return null;
  const c = COLL.get();
  let pool = uid && CURIOSITA[uid] ? [uid] : figUnits();
  pool = pool.filter(k => CURIOSITA[k].some((_, i) => !(c.f[k] || []).includes(i) && !(c.pend[k] || []).includes(i)));
  if (!pool.length) return null;
  const k = pick(pool), free = CURIOSITA[k].map((_, i) => i).filter(i => !(c.f[k] || []).includes(i) && !(c.pend[k] || []).includes(i));
  const i = pick(free);
  (c.pend[k] = c.pend[k] || []).push(i); COLL.set(c);
  return { k, i };
}
function figCard(k, i, back) {
  const f = CURIOSITA[k][i], u = (typeof unitById === 'function' && unitById(k)) || { ic: '📒', name: '', c: 'var(--c6)', s: 'var(--c6-soft)' };
  return '<div class="fig' + (back ? ' back' : '') + '" style="--fc:' + u.c + ';--fs:' + u.s + '"><div class="fig-in">' +
    '<div class="fig-top"><span>' + esc(u.ic + ' ' + u.name) + '</span><span>n. ' + (i + 1) + '</span></div>' +
    '<div class="fig-ic">' + f.ic + '</div><div class="fig-t">' + esc(f.t) + '</div><div class="fig-x">' + esc(f.x) + '</div></div></div>';
}
/* la figurina si «incolla» nell'album solo dopo aver risposto alla sua domanda: così si legge con attenzione */
function figShow(box, fig, onDone) {
  if (!box || !fig) { if (onDone) onDone(); return; }
  const f = CURIOSITA[fig.k][fig.i];
  const opts = shuffle([f.ok].concat(f.wrong));
  box.innerHTML = '<div class="fig-new"><div class="fig-badge">✨ Nuova figurina!</div>' + figCard(fig.k, fig.i) +
    '<div class="fig-q"><b>Per incollarla nell’album:</b> ' + esc(f.q) + ' ' + sayBtn(f.t + '. ' + f.x + '. ' + f.q) + '</div>' +
    '<div class="fig-opts">' + opts.map(o => '<button type="button" class="ls-opt" data-o="' + esc(o) + '">' + esc(o) + '</button>').join('') + '</div><div class="fig-fb" id="fig-fb"></div></div>';
  let tries = 0;
  box.querySelectorAll('.fig-opts .ls-opt').forEach(b => b.addEventListener('click', () => {
    tries++;
    if (b.dataset.o === f.ok) {
      b.classList.add('right'); box.querySelectorAll('.fig-opts .ls-opt').forEach(x => x.disabled = true);
      const c = COLL.get(); c.pend[fig.k] = (c.pend[fig.k] || []).filter(x => x !== fig.i); (c.f[fig.k] = c.f[fig.k] || []).push(fig.i); COLL.set(c);
      const g = tries === 1 ? 3 : 1; Gems.add(g, b); ding(); if (typeof questEv === 'function') questEv('fig', 1);
      $('fig-fb').innerHTML = '<div class="ls-sheet ok"><b>Incollata! 📒 +' + g + ' 💎</b>' + figAlbumMsg(fig.k) + '</div>';
      if (onDone) onDone();
    } else { b.classList.add('wrong'); b.disabled = true; oops(); $('fig-fb').innerHTML = '<div class="ls-sheet try"><b>💭 Rileggi la figurina!</b>La risposta è scritta lì dentro.</div>'; }
  }));
}
function figAlbumMsg(k) {
  const c = COLL.get(), have = (c.f[k] || []).length, tot = CURIOSITA[k].length;
  if (have >= tot && !c.done['alb-' + k]) { c.done['alb-' + k] = 1; COLL.set(c); Gems.add(30); fanfare(); return '<div>🏅 Pagina dell’album completata! +30 💎</div>'; }
  return '<div>Album: ' + have + '/' + tot + ' in questa materia · ' + figOwned() + '/' + figTotal() + ' in tutto</div>';
}
let albumSel = null;
function openAlbum() {
  const units = figUnits(); if (!units.length) return;
  if (!albumSel || !units.includes(albumSel)) albumSel = units[0];
  const c = COLL.get(), have = c.f[albumSel] || [], pend = c.pend[albumSel] || [];
  const u = (typeof unitById === 'function' && unitById(albumSel)) || { name: albumSel, ic: '📒' };
  openModal('<div class="big" style="font-size:28px">📒 L’album delle curiosità</div>' +
    '<p style="font-weight:700;color:var(--ink-soft)">' + figOwned() + ' figurine su ' + figTotal() + '. Ogni lezione finita ne regala una: rispondi alla sua domanda per incollarla!</p>' +
    '<div class="path-units alb-units">' + units.map(k => { const uu = (typeof unitById === 'function' && unitById(k)) || { ic: '📒', name: k, c: 'var(--c6)', s: 'var(--c6-soft)' }; const n = (c.f[k] || []).length; return '<button type="button" class="pu' + (k === albumSel ? ' on' : '') + '" data-a="' + k + '" style="--uc:' + uu.c + ';--us:' + uu.s + '"><span class="pu-ic">' + uu.ic + '</span><span class="pu-n">' + esc(uu.name) + '</span><span class="pu-n" style="min-height:0">' + n + '/' + CURIOSITA[k].length + (c.done['alb-' + k] ? ' 🏅' : '') + '</span></button>'; }).join('') + '</div>' +
    '<div class="alb-grid">' + CURIOSITA[albumSel].map((f, i) => have.includes(i)
      ? '<button type="button" class="alb-s have" data-i="' + i + '"><span class="alb-ic">' + f.ic + '</span><span class="alb-t">' + esc(f.t) + '</span></button>'
      : '<div class="alb-s' + (pend.includes(i) ? ' pend' : '') + '"><span class="alb-ic">' + (pend.includes(i) ? '✉️' : '❔') + '</span><span class="alb-t">' + (pend.includes(i) ? 'Da incollare' : 'n. ' + (i + 1)) + '</span></div>').join('') + '</div>' +
    '<div id="alb-view"></div>' +
    (pend.length ? '<div class="row center"><button type="button" class="btn" id="alb-pend">✉️ Incolla le figurine che aspettano (' + pend.length + ')</button></div>' : '') +
    '<div class="row center" style="margin-top:10px"><button type="button" class="btn ghost" id="alb-x" data-focus>Chiudi</button></div>', [u.c || 'var(--c6)', u.s || 'var(--c6-soft)']);
  $('modal-box').classList.add('wide');
  $('alb-x').addEventListener('click', () => { closeModal(); if (current === 'home') go('home'); });
  $('modal-box').querySelectorAll('[data-a]').forEach(b => b.addEventListener('click', () => { albumSel = b.dataset.a; openAlbum(); }));
  $('modal-box').querySelectorAll('.alb-s.have').forEach(b => b.addEventListener('click', () => { const i = +b.dataset.i, f = CURIOSITA[albumSel][i]; $('alb-view').innerHTML = figCard(albumSel, i) + '<div class="row center">' + sayBtn(f.t + '. ' + f.x) + '</div>'; $('alb-view').scrollIntoView({ block: 'nearest' }); }));
  if ($('alb-pend')) $('alb-pend').addEventListener('click', () => { $('alb-view').innerHTML = '<div id="alb-fig"></div>'; figShow($('alb-fig'), { k: albumSel, i: pend[0] }, () => setTimeout(openAlbum, 1600)); });
}

/* ---------- 🔍 aguzza la vista: un tesoro nascosto in ogni pagina, ogni giorno ---------- */
const TESORI = [
  ['🐞', 'Coccinella'], ['🍀', 'Quadrifoglio'], ['🐚', 'Conchiglia'], ['🦋', 'Farfalla'], ['🌟', 'Stellina'], ['🍄', 'Funghetto'],
  ['🐸', 'Ranocchia'], ['🪶', 'Piuma'], ['🗝️', 'Chiave antica'], ['🧩', 'Tassello'], ['🪙', 'Moneta antica'], ['🐌', 'Lumachina'],
  ['🦔', 'Riccio'], ['🌰', 'Castagna'], ['🎈', 'Palloncino'], ['🧸', 'Orsetto'], ['🪁', 'Aquilone'], ['🐝', 'Ape'],
  ['🦉', 'Gufetto'], ['🐢', 'Tartaruga'], ['⛸️', 'Pattino d’argento'], ['🎀', 'Fiocco'], ['💎', 'Gemma rara'], ['🦄', 'Unicorno']
];
const tesoriFound = () => Object.keys(COLL.get().o).length;
function hideTreasure(id) {
  const el = $('p-' + id); if (!el || !D) return;
  const c = COLL.get(), dk = todayIso() + ':' + id; if (c.h[dk]) return;
  const seed = parseInt(hashQ(dk), 36), t = TESORI[seed % TESORI.length];
  const spots = [...el.querySelectorAll('.page-banner, .card, .sec, .today, .tile')].filter(x => x.offsetParent !== null && x.offsetHeight > 60);
  const host = spots.length ? spots[seed % spots.length] : el;
  if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
  const b = document.createElement('button'); b.type = 'button'; b.className = 'tesoro'; b.textContent = t[0];
  b.setAttribute('aria-label', 'Un tesoro nascosto!');
  b.style.left = (8 + (seed >> 3) % 80) + '%'; b.style.top = (10 + (seed >> 7) % 70) + '%';
  host.appendChild(b);
  b.addEventListener('click', e => {
    e.stopPropagation(); const cc = COLL.get(); if (cc.h[dk]) return;
    cc.h[dk] = 1; const first = !cc.o[t[0]]; cc.o[t[0]] = (cc.o[t[0]] || 0) + 1;
    Object.keys(cc.h).forEach(k => { if (k.slice(0, 10) < iso(addDays(new Date(), -40))) delete cc.h[k]; });
    COLL.set(cc); b.classList.add('got'); ding(); Gems.add(first ? 5 : 2, b); if (typeof questEv === 'function') questEv('tes', 1);
    cheer(b, (first ? 'Nuovo tesoro: ' : 'Ritrovato: ') + t[1] + '! (' + tesoriFound() + '/' + TESORI.length + ')');
    setTimeout(() => b.remove(), 900);
  });
}

/* ---------- banner illustrati delle sezioni ---------- */
const BANNERS = {
  home: ['🌈', '☁️', '🏡', '🌳', '🌻', '🦋', '☀️', '🌷'], diario: ['📅', '✏️', '📚', '🎒', '🍎', '⭐', '📝', '🌤️'],
  routine: ['☀️', '🪥', '🥣', '🎒', '🛏️', '🌙', '⏰', '🧦'], giochi: ['🎮', '🧩', '🎲', '🃏', '🎯', '🎨', '🔍', '🎵'],
  mate: ['🔢', '➕', '📐', '🍕', '🕐', '🧮', '✖️', '📏'], scienze: ['🔬', '🧪', '🪐', '🦊', '⚡', '🌱', '🧲', '🌍'],
  scopri: ['🌍', '🏛️', '🎨', '🎼', '📖', '🗺️', '🐷', '🧱'], sport: ['⛸️', '🤸‍♀️', '🏊‍♀️', '🎪', '🥇', '❄️', '💧', '🏅'],
  metodo: ['🧠', '💡', '📒', '⏱️', '🎧', '✅', '🌟', '📌']
};
function pageBanner(id) {
  const el = $('p-' + id), ems = BANNERS[id]; if (!el || !ems || el.querySelector('.page-banner')) return;
  const d = document.createElement('div'); d.className = 'page-banner b-' + id; d.setAttribute('aria-hidden', 'true');
  d.innerHTML = ems.map((e, i) => '<span style="left:' + (4 + i * 12) + '%;top:' + (i % 2 ? 46 : 14) + '%;animation-delay:-' + (i * 0.7).toFixed(1) + 's">' + e + '</span>').join('') +
    '<svg viewBox="0 0 400 40" preserveAspectRatio="none"><path d="M0 22 C60 6 120 36 200 20 C280 6 340 34 400 18 L400 40 L0 40 Z" fill="var(--bg)"/></svg>';
  el.insertBefore(d, el.firstChild);
}
(function hookGo() {
  const orig = go;
  go = function (id) { orig(id); try { pageBanner(id); setTimeout(() => hideTreasure(id), 50); } catch (e) {} };
})();

/* ---------- 👀 trova le differenze (gioco) ---------- */
const DIFF_PAIRS = [['🍎', '🍏'], ['🐟', '🐠'], ['🌼', '🌸'], ['⭐', '🌟'], ['🐱', '🐯'], ['🌲', '🌳'], ['🚗', '🚕'], ['🐶', '🐺'], ['🍋', '🍊'], ['☀️', '🌤️'], ['🐤', '🐥'], ['🎈', '🎀'], ['🍓', '🍒'], ['🦋', '🐛'], ['🐻', '🐼'], ['⛵', '🚤'], ['🌙', '⭐'], ['🍩', '🍪'], ['🦊', '🐱'], ['🐬', '🐳']];
const DIFF_BASE = ['🌳', '🏠', '☁️', '🐟', '🌼', '🐞', '🍎', '🚲', '⛸️', '🐶', '🎈', '🦋', '🐢', '🌙', '🍄', '🐝', '🍓', '⭐', '🐠', '🎀', '🐤', '🍋', '🧸', '🐚'];
function gameDiff(p, g) {
  let lvl = store.get('diff-level', 1);
  const cols = lvl === 1 ? 4 : 5, rows = lvl === 1 ? 4 : lvl === 2 ? 5 : 6, nd = lvl === 1 ? 3 : lvl === 2 ? 4 : 5;
  const N = cols * rows, left = [];
  for (let i = 0; i < N; i++) left.push(pick(DIFF_BASE));
  const right = left.map(x => ({ e: x, t: '' })), diffs = shuffle([...Array(N).keys()]).slice(0, nd);
  diffs.forEach(i => {
    const kinds = lvl === 1 ? ['swap', 'swap', 'gone'] : ['swap', 'mirror', 'gone', 'big'];
    const k = pick(kinds);
    if (k === 'swap') { const pr = DIFF_PAIRS.find(pp => pp[0] === left[i]) || DIFF_PAIRS.find(pp => pp[1] === left[i]); right[i].e = pr ? (pr[0] === left[i] ? pr[1] : pr[0]) : pick(DIFF_BASE.filter(x => x !== left[i])); }
    else if (k === 'gone') right[i].e = '';
    else if (k === 'mirror') right[i].t = 'scaleX(-1) rotate(25deg)';
    else right[i].t = 'scale(1.45)';
    if (right[i].e === left[i] && !right[i].t) right[i].e = '';
  });
  const found = new Set(); let miss = 0, hint = false;
  const grid = (arr, side) => '<div class="df-grid" style="--cols:' + cols + '" data-side="' + side + '">' + arr.map((x, i) => '<button type="button" class="df-c" data-i="' + i + '"><span' + (x.t ? ' style="transform:' + x.t + '"' : '') + '>' + (x.e || '&nbsp;') + '</span></button>').join('') + '</div>';
  p.innerHTML = '<div class="row between"><h3>👀 Aguzza la vista</h3>' + sayBtn('Aguzza la vista. Le due immagini sembrano uguali, ma ci sono ' + nd + ' differenze. Guarda con calma e tocca quelle che trovi.') + '</div>' +
    '<p class="how">Ci sono <b>' + nd + ' differenze</b>. Osserva con calma: chi trova tutto senza tocchi a vuoto ha il bonus 🦅 Occhio di falco!</p>' +
    '<div class="chips">' + [1, 2, 3].map(n => '<button type="button" class="chip" data-l="' + n + '" aria-pressed="' + (n === lvl) + '">' + ['', '🐣 Facile', '🦊 Medio', '🦅 Difficile'][n] + '</button>').join('') + '</div>' +
    '<div class="df-wrap">' + grid(left.map(e => ({ e, t: '' })), 'a') + grid(right, 'b') + '</div>' +
    '<div class="row between" style="margin-top:10px"><b id="df-st">Trovate: 0/' + nd + '</b><button type="button" class="btn small ghost" id="df-h">🔦 Aiutino</button></div><div id="df-fb"></div>';
  p.querySelectorAll('[data-l]').forEach(b => b.addEventListener('click', () => { store.set('diff-level', +b.dataset.l); gameDiff(p, g); }));
  const tap = i => {
    if (found.size >= nd) return;
    const cells = [...p.querySelectorAll('.df-c[data-i="' + i + '"]')];
    if (diffs.includes(i) && !found.has(i)) {
      found.add(i); cells.forEach(c => c.classList.add('found')); ding(); cheer(cells[1] || cells[0]);
      $('df-st').textContent = 'Trovate: ' + found.size + '/' + nd;
      if (found.size === nd) {
        const eagle = miss === 0 && !hint, gems = nd + (eagle ? 4 : 0);
        Gems.add(gems, $('df-st')); gain(3, $('df-st')); fanfare(); markDay('giochi', p);
        const d = store.get('games-done', {}); d.diff = (d.diff || 0) + 1; store.set('games-done', d);
        $('df-fb').innerHTML = '<div class="explain"><b>' + (eagle ? '🦅 Occhio di falco! ' : 'Tutte trovate! ') + '+' + gems + ' 💎</b> ' + (eagle ? 'Nessun tocco a vuoto: hai osservato prima di toccare.' : 'Prova la prossima senza tocchi a vuoto per il bonus 🦅.') + '<div class="row" style="margin-top:10px"><button type="button" class="btn small" id="df-again">Un’altra immagine →</button></div></div>';
        $('df-again').addEventListener('click', () => gameDiff(p, g));
      }
    } else if (!found.has(i)) { miss++; cells.forEach(c => { c.classList.add('miss'); setTimeout(() => c.classList.remove('miss'), 500); }); }
  };
  p.querySelectorAll('.df-c').forEach(b => b.addEventListener('click', () => tap(+b.dataset.i)));
  $('df-h').addEventListener('click', () => { const i = diffs.find(x => !found.has(x)); if (i === undefined) return; hint = true; p.querySelectorAll('.df-grid[data-side="b"] .df-c[data-i="' + i + '"]').forEach(c => { c.classList.add('hint'); setTimeout(() => c.classList.remove('hint'), 1400); }); });
}

/* ---------- 🐷 il salvadanaio delle gemme: il risparmio cresce ogni settimana ---------- */
const Piggy = {
  get() { return Object.assign({ n: 0, wk: '', goal: '', hist: [] }, store.get('piggy', {})); },
  week(d) { const x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return iso(x); },
  tick() {
    const p = Piggy.get(), w = Piggy.week(new Date());
    if (!p.wk) { p.wk = w; store.set('piggy', p); return 0; }
    let weeks = Math.round((fromIso(w) - fromIso(p.wk)) / (7 * 86400000)); if (weeks <= 0) return 0;
    let got = 0; for (let k = 0; k < Math.min(weeks, 3); k++) { const it = p.n >= 10 ? Math.max(1, Math.floor(p.n * 0.1)) : 0; p.n += it; got += it; }
    p.wk = w; if (got) p.hist.unshift({ d: todayIso(), it: got }); p.hist = p.hist.slice(0, 12); store.set('piggy', p); return got;
  },
  put(n) { if (!Gems.spend(n)) return false; const p = Piggy.get(); if (!p.wk) p.wk = Piggy.week(new Date()); p.n += n; store.set('piggy', p); return true; },
  take() { const p = Piggy.get(); const n = p.n; if (!n) return 0; p.n = 0; store.set('piggy', p); Gems.add(n); return n; }
};
function piggyCard() {
  const p = Piggy.get(), g = Gems.get().n, goal = p.goal && typeof SHOP !== 'undefined' ? SHOP.find(x => x.id === p.goal) : null;
  const tot = g + p.n, pct = goal ? Math.min(100, Math.round(tot / goal.p * 100)) : 0;
  return '<div class="piggy"><div class="pg-ic">🐷</div><div style="flex:1;min-width:0"><b>Salvadanaio: ' + p.n + ' 💎</b>' +
    '<small>Ogni lunedì il salvadanaio cresce del 10% (se ci sono almeno 10 gemme): è l’<b>interesse</b>, il premio di chi risparmia!</small>' +
    (goal ? '<div class="pg-goal">🎯 Obiettivo: ' + esc(goal.ic + ' ' + goal.n) + ' (' + goal.p + ' 💎)<div class="ebig"><i style="width:' + pct + '%"></i></div></div>' : '<small>Scegli un obiettivo con 🎯 su un oggetto del negozio.</small>') +
    '<div class="row" style="gap:6px;margin-top:6px;flex-wrap:wrap"><button type="button" class="btn small" id="pg-10"' + (g < 10 ? ' disabled' : '') + ' style="--bc:var(--c3);color:var(--ink)">Metti 10 💎</button><button type="button" class="btn small ghost" id="pg-all"' + (g < 1 ? ' disabled' : '') + '>Metti tutto</button><button type="button" class="btn small ghost" id="pg-take"' + (!p.n ? ' disabled' : '') + '>Rompi il salvadanaio</button></div></div></div>';
}
function piggyBind(reopen) {
  if ($('pg-10')) $('pg-10').addEventListener('click', () => { if (Piggy.put(10)) { tone(880, .08); reopen(); } });
  if ($('pg-all')) $('pg-all').addEventListener('click', () => { const g = Gems.get().n; if (g && Piggy.put(g)) { tone(880, .08); reopen(); } });
  if ($('pg-take')) $('pg-take').addEventListener('click', () => { Piggy.take(); fanfare(); reopen(); });
}
(function piggyBoot() {
  try { const got = Piggy.tick(); if (got) setTimeout(() => { if ($('modal').hidden) { openModal('<div style="font-size:60px">🐷</div><div class="big" style="font-size:26px">Il salvadanaio è cresciuto!</div><p style="font-weight:700">Hai risparmiato e ora ci sono <b>' + got + ' gemme in più</b>: si chiama interesse. Chi aspetta e risparmia, poi può comprare cose più grandi!</p><button type="button" class="btn" id="pgk" data-focus>Evviva!</button>'); $('pgk').addEventListener('click', closeModal); } }, 1500); } catch (e) {}
})();
function openTesori() {
  const c = COLL.get();
  openModal('<div class="big" style="font-size:28px">🔍 I tesori nascosti</div>' +
    '<p style="font-weight:700;color:var(--ink-soft)">Ogni giorno in ogni sezione dell’app è nascosto un piccolo tesoro. Aguzza la vista e toccalo! Ne hai trovati ' + tesoriFound() + ' su ' + TESORI.length + '.</p>' +
    '<div class="alb-grid">' + TESORI.map(t => c.o[t[0]] ? '<div class="alb-s have"><span class="alb-ic">' + t[0] + '</span><span class="alb-t">' + esc(t[1]) + (c.o[t[0]] > 1 ? ' ×' + c.o[t[0]] : '') + '</span></div>' : '<div class="alb-s"><span class="alb-ic" style="filter:grayscale(1) brightness(.2);opacity:.35">' + t[0] + '</span><span class="alb-t">???</span></div>').join('') + '</div>' +
    '<p style="font-weight:700">Premi speciali: 🔍 la lente per il drago (12 tesori) e ❄️ il percorso sul ghiaccio (tutti i 24)!</p>' +
    '<div class="row center"><button type="button" class="btn ghost" id="ts-x" data-focus>Chiudi</button></div>');
  $('ts-x').addEventListener('click', closeModal);
}
