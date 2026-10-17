/* ================= DIARIO: calendario scolastico, presenze ed emozioni =================
   Calendario scolastico Regione Piemonte 2026/27 (DGR 2541/2026): inizio 14/9/2026, fine 10/6/2027. */
const SCHOOL = { start: '2026-09-14', end: '2027-06-10' };
const HOLS = [
  { n: 'San Francesco, patrono d’Italia', s: '2026-10-04', e: '2026-10-04', ic: '🇮🇹', fest: 1 },
  { n: 'Ognissanti', s: '2026-11-01', e: '2026-11-01', ic: '🍂', fest: 1 },
  { n: 'Ponte dell’Immacolata', s: '2026-12-07', e: '2026-12-08', ic: '⛄' },
  { n: 'Vacanze di Natale', s: '2026-12-23', e: '2027-01-06', ic: '🎄' },
  { n: 'Vacanze di Carnevale', s: '2027-02-06', e: '2027-02-10', ic: '🎭' },
  { n: 'Vacanze di Pasqua', s: '2027-03-25', e: '2027-03-30', ic: '🐣' },
  { n: 'Festa della Liberazione', s: '2027-04-25', e: '2027-04-25', ic: '🇮🇹', fest: 1 },
  { n: 'Festa dei lavoratori', s: '2027-05-01', e: '2027-05-01', ic: '🌷', fest: 1 },
  { n: 'Festa della Repubblica', s: '2027-06-02', e: '2027-06-02', ic: '🇮🇹', fest: 1 },
  { n: 'Vacanze estive', s: '2027-06-11', e: '2027-09-12', ic: '🏖️', summer: 1 }
];
const MOODS = [
  { id: 'felice', ic: '😄', n: 'Felice', k: 'up', ask: 'Che cosa ti ha resa felice? Scrivilo: così te lo ricorderai anche domani.' },
  { id: 'serena', ic: '😊', n: 'Serena', k: 'up', ask: 'Che cosa ti ha fatto stare tranquilla oggi?' },
  { id: 'orgogliosa', ic: '🤩', n: 'Orgogliosa', k: 'up', ask: 'Di che cosa sei orgogliosa? Che cosa hai fatto di bello?' },
  { id: 'carica', ic: '💪', n: 'Carica', k: 'up', ask: 'Da dove arriva tutta questa energia?' },
  { id: 'cosi', ic: '😐', n: 'Così così', k: 'mid', ask: 'Che cosa è andato bene oggi, e che cosa meno?' },
  { id: 'stanca', ic: '😴', n: 'Stanca', k: 'tired', ask: 'Che cosa ti ha stancata? Hai dormito bene stanotte?' },
  { id: 'triste', ic: '😢', n: 'Triste', k: 'down', ask: 'Che cosa ti ha resa triste? Scriverlo aiuta a farlo uscire.' },
  { id: 'arrabbiata', ic: '😠', n: 'Arrabbiata', k: 'down', ask: 'Che cosa ti ha fatto arrabbiare? Che cosa vorresti dire a chi c’era?' },
  { id: 'preoccupata', ic: '😟', n: 'Preoccupata', k: 'down', ask: 'Che cosa ti preoccupa? A chi potresti raccontarlo?' }
];
const FEEL_FACTS = [
  ['Che cosa sono le emozioni?', 'Sono reazioni naturali del cervello e del corpo a quello che ci succede. Si sentono nel corpo: il cuore che batte forte, la pancia che si stringe, le lacrime, il sorriso. Sono normali come la fame e il sonno.'],
  ['Le emozioni «brutte» sono sbagliate?', 'No! Tutte le emozioni servono: la paura ci protegge dai pericoli, la rabbia ci dice che qualcosa ci sembra ingiusto, la tristezza ci spinge a cercare conforto, la gioia ci fa stare bene insieme agli altri.'],
  ['Perché è utile dire come mi sento?', 'Dare un nome a un’emozione aiuta il cervello a calmarla. E quando la racconti, chi ti vuole bene può capirti e aiutarti: le emozioni fanno parte della vita con gli altri.'],
  ['Anche i grandi hanno giorni no?', 'Sì, tutti: mamma, papà, le maestre e anche i campioni olimpici. Le emozioni cambiano come il tempo: dopo la pioggia torna il sole.'],
  ['Perché scrivere le cose belle?', 'Quando scrivi un momento felice lo rivivi una seconda volta, e rileggerlo nei giorni grigi ti aiuta a ricordare che le cose belle tornano.'],
  ['Che cosa fa il corpo quando sono arrabbiata?', 'Il cuore accelera e i muscoli si tendono: il corpo si prepara all’azione. Tre respiri lenti del drago (dentro col naso, fuori piano con la bocca) aiutano a farlo calmare.']
];
const pad = n => (n < 10 ? '0' : '') + n;
const iso = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
const fromIso = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const todayIso = () => iso(new Date());
const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const daysBetween = (a, b) => Math.round((fromIso(b) - fromIso(a)) / 86400000);
const GIORNI_L = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
const fmtDay = s => { const d = fromIso(s); return GIORNI_L[d.getDay()] + ' ' + d.getDate() + ' ' + MESI[d.getMonth()]; };
const fmtShort = s => { const d = fromIso(s); return d.getDate() + ' ' + MESI[d.getMonth()]; };
const alDay = s => { const n = fromIso(s).getDate(); return (n === 8 || n === 11 ? 'all\u2019' : 'al ') + fmtShort(s); };
const alDayL = s => { const d = fromIso(s); return 'al ' + GIORNI_L[d.getDay()] + ' ' + d.getDate() + ' ' + MESI[d.getMonth()]; };
const holOf = s => HOLS.find(h => s >= h.s && s <= h.e);
const saturdaySchool = () => store.get('sat-school', false);
function isSchoolDay(s) {
  if (s < SCHOOL.start || s > SCHOOL.end) return false;
  const w = fromIso(s).getDay();
  if (w === 0 || (w === 6 && !saturdaySchool())) return false;
  return !holOf(s);
}
// una vacanza «conta» per il conto alla rovescia solo se toglie almeno un giorno di scuola
function holSkipsSchool(h) {
  for (let d = fromIso(h.s); iso(d) <= h.e; d = addDays(d, 1)) {
    const w = d.getDay(), s = iso(d);
    if (h.summer) return true;
    if (s >= SCHOOL.start && s <= SCHOOL.end && w !== 0 && (w !== 6 || saturdaySchool())) return true;
  }
  return false;
}
function nextHoliday(t) {
  const cur = HOLS.find(h => t >= h.s && t <= h.e && holSkipsSchool(h));
  const next = HOLS.find(h => h.s > t && holSkipsSchool(h));
  return { cur, next };
}
function schoolDaysBetween(a, b) { // a escluso, b incluso
  let n = 0;
  for (let d = addDays(fromIso(a), 1); iso(d) <= b; d = addDays(d, 1)) if (isSchoolDay(iso(d))) n++;
  return n;
}
function firstSchoolDayAfter(s) {
  for (let d = addDays(fromIso(s), 1), k = 0; k < 400; d = addDays(d, 1), k++) if (isSchoolDay(iso(d))) return iso(d);
  return null;
}
const diary = () => store.get('diary', {});
const moodOf = id => MOODS.find(m => m.id === id);
function downStreak() {
  const dd = diary(), t = todayIso();
  const keys = Object.keys(dd).filter(k => k <= t && dd[k].m).sort().reverse();
  let n = 0, prev = null;
  for (const k of keys) {
    if (prev && daysBetween(k, prev) > 2) break;
    const m = moodOf(dd[k].m);
    if (!m || m.k !== 'down') break;
    n++; prev = k;
  }
  return n;
}

/* ---------- Scheda per scrivere un giorno nel diario ---------- */
function dayForm(box, key, onSaved) {
  const dd = diary();
  const e = Object.assign({ p: null, m: null, f: 3, w: '' }, dd[key] || {});
  const school = isSchoolDay(key), h = holOf(key), isToday = key === todayIso();
  const streak = downStreak();
  const render = () => {
    const m = moodOf(e.m);
    const strong = m && m.k === 'down' && (streak >= 2 || e.f >= 4);
    box.innerHTML =
      (school ? '<div class="df-sec"><div class="df-l">A scuola ' + (isToday ? 'oggi' : 'quel giorno') + ' ero…</div><div class="chips" style="justify-content:center">' +
        '<button type="button" class="chip" data-p="P" aria-pressed="' + (e.p === 'P') + '" style="--gc:var(--leaf)">✅ Presente</button>' +
        '<button type="button" class="chip" data-p="A" aria-pressed="' + (e.p === 'A') + '" style="--gc:var(--c2)">🏠 Assente</button></div></div>'
        : '<div class="df-sec df-l">' + (h ? h.ic + ' ' + esc(h.n) : '🛋️ Niente scuola: si riposa!') + '</div>') +
      '<div class="df-sec"><div class="df-l">Come ti senti?</div><div class="moods">' +
        MOODS.map(x => '<button type="button" class="mood" data-m="' + x.id + '" aria-pressed="' + (e.m === x.id) + '"><span aria-hidden="true">' + x.ic + '</span>' + esc(x.n) + '</button>').join('') + '</div></div>' +
      (m ? '<div class="df-sec"><div class="df-l">Quanto forte? <span class="df-hint">' + ['', 'pochissimo', 'un po’', 'abbastanza', 'tanto', 'tantissimo'][e.f] + '</span></div><div class="therm" role="group" aria-label="Quanto forte">' +
        [1, 2, 3, 4, 5].map(k => '<button type="button" data-f="' + k + '" aria-pressed="' + (k <= e.f) + '" aria-label="' + k + ' su 5">' + m.ic + '</button>').join('') + '</div></div>' +
        '<div class="df-sec"><label class="df-l" for="df-why">Perché? ' + sayBtn(m.ask) + '</label><p class="df-ask">' + esc(m.ask) + '</p>' +
        (strong ? '<div class="explain" style="background:var(--c6-soft);text-align:left"><b>Dillo forte! 💜</b> Prova a scrivere tre cose: <b>che cosa è successo</b>, <b>che cosa senti nel corpo</b> (pancia stretta? lacrime? cuore veloce?) e <b>che cosa ti farebbe stare meglio</b>. Poi leggilo ad alta voce a mamma o papà.</div>' : '') +
        '<textarea id="df-why" maxlength="500" rows="' + (strong ? 6 : 3) + '" placeholder="' + (strong ? 'Oggi mi sento… perché… Nel corpo sento… Mi aiuterebbe…' : 'Scrivi qui con parole tue…') + '">' + esc(e.w) + '</textarea></div>' : '') +
      '<div class="row center" style="margin-top:14px"><button type="button" class="btn" id="df-save" style="--bc:var(--c1)"' + (e.m || e.p ? '' : ' disabled') + '>Salva nel diario</button></div>';
    box.querySelectorAll('[data-p]').forEach(b => b.addEventListener('click', () => { e.p = e.p === b.dataset.p ? null : b.dataset.p; keep(); render(); }));
    box.querySelectorAll('[data-m]').forEach(b => b.addEventListener('click', () => { keep(); e.m = b.dataset.m; render(); }));
    box.querySelectorAll('[data-f]').forEach(b => b.addEventListener('click', () => { keep(); e.f = +b.dataset.f; render(); }));
    box.querySelector('#df-save').addEventListener('click', save);
  };
  const keep = () => { const t = box.querySelector('#df-why'); if (t) e.w = t.value; };
  function save() {
    keep(); e.w = e.w.trim().slice(0, 500);
    const all = diary();
    const words = e.w.split(/\s+/).filter(Boolean).length;
    let bonus = 0;
    if (e.m && !e.r) { bonus += 2; e.r = 1; }
    if (words >= 4 && !e.rw) { bonus += 3; e.rw = 1; }
    all[key] = e; store.set('diary', all);
    const btn = box.querySelector('#df-save');
    if (bonus) gain(bonus, btn);
    ding();
    if (onSaved) onSaved(e, bonus);
  }
  render();
}
function dragonReply(e) {
  const m = moodOf(e.m), nm = D.name;
  if (!m) return 'Segnato! Grazie, ' + NAME + '.';
  if (m.k === 'up') return 'Evviva! ' + nm + ' fa una capriola di gioia. Quando racconti le cose belle, le vivi due volte!';
  if (m.k === 'mid') return 'Grazie di avermelo detto. Anche le giornate normali sono importanti: domani sarà una pagina nuova.';
  if (m.k === 'tired') return 'Anche i draghi si stancano! Stasera nanna presto: il sonno ricarica il corpo e il cervello.';
  const st = downStreak();
  if (st >= 3) return 'Sono ' + st + ' giorni che ti senti giù. ' + nm + ' ti è vicino e ti chiede una cosa coraggiosa: racconta oggi a mamma o papà quello che hai scritto. Dirlo forte è il primo passo per stare meglio. 💜';
  return 'Grazie per avermelo detto: ci vuole coraggio. Le emozioni difficili passano, come le nuvole. Raccontalo anche a mamma o papà: un abbraccio aiuta.';
}

/* ---------- Pagina ---------- */
let calMonth = null;
PAGES.diario = el => {
  const t = todayIso(), dd = diary();
  if (!calMonth) { const d = fromIso(t < SCHOOL.start ? SCHOOL.start : t > '2027-09-12' ? '2027-06-01' : t); calMonth = [d.getFullYear(), d.getMonth()]; }
  const { cur, next } = nextHoliday(t);
  const c = dcol(), lv = levelOf(D.energy);
  let hero;
  if (cur) {
    const back = firstSchoolDayAfter(cur.e);
    hero = '<div class="cd-ic" aria-hidden="true">' + cur.ic + '</div><div><div class="cd-big">Sei in vacanza!</div><div class="cd-name">' + esc(cur.n) + '</div>' +
      '<div class="cd-sub">' + (cur.summer ? 'Buona estate, ' + NAME + '! Ti aspetta la prima media.' : 'Si torna a scuola ' + (back ? fmtDay(back) : '') + '.') + '</div></div>';
  } else if (next) {
    const n = daysBetween(t, next.s), sd = schoolDaysBetween(t, next.s);
    hero = '<div class="cd-ic" aria-hidden="true">' + next.ic + '</div><div><div class="cd-big">' + (n === 1 ? 'Domani!' : 'Mancano <b>' + n + '</b> giorni') + '</div>' +
      '<div class="cd-name">' + esc(next.n) + '</div><div class="cd-sub">' + (next.s === next.e ? fmtDay(next.s) : 'dal ' + fmtShort(next.s) + ' ' + alDay(next.e)) +
      ' · ' + (isSchoolDay(t) ? 'oggi più ' : '') + sd + ' giorni di scuola prima</div></div>';
  } else hero = '<div class="cd-ic">📅</div><div><div class="cd-big">Anno finito!</div></div>';
  const st = downStreak();
  el.innerHTML =
    '<h1 class="page-title rainbow">Il mio diario</h1>' +
    '<p class="page-sub">Il calendario della scuola, le vacanze e le tue emozioni giorno per giorno. Ogni volta che dici come ti senti, ' + esc(D.name) + ' prende energia.</p>' +
    '<div class="countdown">' + hero + '</div>' +
    '<div class="grid2" style="margin-top:18px;align-items:start">' +
      '<div class="card" style="--kc:var(--c1);--ks:var(--c1-soft)">' + secHead('✏️', 'Oggi, ' + fmtDay(t), isSchoolDay(t) ? 'Giorno di scuola' : (holOf(t) ? holOf(t).n : 'Niente scuola'), 'var(--c1-soft)') +
        '<div id="d-form"></div><div id="d-reply"></div></div>' +
      '<div style="display:grid;gap:16px;min-width:0">' +
        (st >= 3 ? '<div class="card" style="--kc:var(--c6);--ks:var(--c6-soft)">' + secHead('💜', 'Da ' + st + ' giorni ti senti giù', 'Succede a tutti. Adesso però è il momento di dirlo più forte.', 'var(--c6-soft)') +
          '<ul class="feel-list"><li><b>Dillo ad alta voce</b> a mamma, papà o alla maestra: «Da qualche giorno mi sento… perché…».</li><li><b>Disegna</b> la tua emozione: che colore ha? che forma?</li><li><b>Scrivi una lettera a ' + esc(D.name) + '</b> nel campo «Perché?», più lunga del solito.</li><li><b>Fai 3 respiri del drago</b> e una pausa movimento: il corpo aiuta la testa.</li></ul>' +
          '<p style="font-weight:800;margin:8px 0 0">Non devi tenerti tutto dentro: chi ti vuole bene vuole saperlo. 🤗</p></div>' : '') +
        '<div class="den mini-den" style="--dcol:' + c[2] + ';--dsoft:' + c[3] + '"><div style="width:110px;flex:none">' + dragonSVG(lv, D.color, 'bob') + '</div><div style="min-width:0"><b>' + esc(D.name) + ' ascolta</b><p>Ogni emozione che racconti dà <b>+2 🔥</b>, e se scrivi anche il perché <b>+3 🔥</b> in più. Felice o triste vale uguale: conta il coraggio di dirlo.</p></div></div>' +
        '<div class="card">' + secHead('🧠', 'Le emozioni sono normali', 'Toccane una per scoprire di più', 'var(--c5-soft)') + '<div id="d-facts"></div></div>' +
      '</div>' +
    '</div>' +
    '<div class="sec">' + secHead('📅', 'Il calendario', 'Tocca un giorno per vedere o scrivere il diario', 'var(--c3-soft)') +
      '<div class="card cal-card"><div class="row between cal-nav"><button type="button" class="btn small ghost" id="c-prev" aria-label="Mese precedente">◀</button><h3 id="c-title"></h3><button type="button" class="btn small ghost" id="c-next" aria-label="Mese successivo">▶</button></div>' +
      '<div class="cal" id="c-grid"></div>' +
      '<div class="cal-legend"><span><i class="lg school"></i>scuola</span><span><i class="lg vac"></i>vacanza</span><span><i class="lg fest"></i>festa</span><span>✅ presente</span><span>🏠 assente</span><span>🎂 compleanno</span></div></div>' +
      '<div class="stat-row" id="c-stats"></div>' +
    '</div>' +
    '<div class="sec">' + secHead('🏖️', 'Le vacanze dell’anno', 'Calendario scolastico della Regione Piemonte 2026/27', 'var(--c4-soft)') +
      '<div class="hol-list" id="c-hols"></div>' +
      '<label class="sat"><input type="checkbox" id="c-sat"' + (saturdaySchool() ? ' checked' : '') + '> La mia scuola fa lezione anche il sabato</label>' +
      '<p class="note-s">Inizio lezioni 14 settembre 2026, ultimo giorno 10 giugno 2027. Ogni scuola può spostare qualche giorno (per esempio per la festa del santo patrono): controlla sempre il diario e il sito della tua scuola.</p>' +
    '</div>';

  renderFacts($('d-facts'), FEEL_FACTS, 'feel');
  const reply = r => { $('d-reply').innerHTML = '<div class="explain" style="background:var(--c3-soft);text-align:left;margin-top:12px"><b>' + esc(D.name) + ':</b> ' + esc(r) + ' ' + sayBtn(r) + '</div>'; };
  const startForm = () => dayForm($('d-form'), t, e => { if (e.m && moodOf(e.m).k === 'up') confetti(window.innerWidth / 2, window.innerHeight / 3, 24); drawCal(); stats(); reply(dragonReply(e)); });
  startForm();
  if (dd[t] && dd[t].m) reply(dragonReply(dd[t]));

  function drawCal() {
    const [y, mo] = calMonth, first = new Date(y, mo, 1), all = diary();
    $('c-title').textContent = MESI[mo].charAt(0).toUpperCase() + MESI[mo].slice(1) + ' ' + y;
    $('c-prev').disabled = y * 12 + mo <= 2026 * 12 + 8;
    $('c-next').disabled = y * 12 + mo >= 2027 * 12 + 8;
    let h = ['L', 'M', 'M', 'G', 'V', 'S', 'D'].map(x => '<div class="cal-h">' + x + '</div>').join('');
    const lead = (first.getDay() + 6) % 7;
    for (let k = 0; k < lead; k++) h += '<div></div>';
    for (let d = 1; d <= new Date(y, mo + 1, 0).getDate(); d++) {
      const s = y + '-' + pad(mo + 1) + '-' + pad(d), ho = holOf(s), e = all[s], w = new Date(y, mo, d).getDay();
      const cls = ['cal-d', isSchoolDay(s) ? 'school' : ho ? (ho.fest ? 'fest' : 'vac') : (w === 0 || w === 6) ? 'we' : 'off', s === t ? 'today' : '', s > t ? 'future' : ''].join(' ');
      const mark = (e && e.m ? moodOf(e.m).ic : '') + (e && e.p === 'P' ? '<small>✅</small>' : e && e.p === 'A' ? '<small>🏠</small>' : '');
      const tip = fmtDay(s) + (ho ? ', ' + ho.n : '') + (s === SCHOOL.start ? ', primo giorno di scuola' : '') + (s === SCHOOL.end ? ', ultimo giorno di scuola' : '');
      h += '<button type="button" class="' + cls + '" data-d="' + s + '" aria-label="' + esc(tip) + '"><span class="n">' + d + '</span>' +
        '<span class="mk">' + (mark || (bdayMD() && s.slice(5) === bdayMD() ? '🎂' : s === SCHOOL.start ? '🎒' : s === SCHOOL.end ? '🎉' : ho && s === ho.s ? ho.ic : '')) + '</span></button>';
    }
    $('c-grid').innerHTML = h;
    $('c-grid').querySelectorAll('[data-d]').forEach(b => b.addEventListener('click', () => openDay(b.dataset.d)));
  }
  function openDay(s) {
    const ho = holOf(s);
    const info = (bdayMD() && s.slice(5) === bdayMD() ? '🎂 Il tuo compleanno! ' : '') + (s === SCHOOL.start ? '🎒 Primo giorno di scuola. ' : '') + (s === SCHOOL.end ? '🎉 Ultimo giorno di scuola! ' : '') + (ho ? ho.ic + ' ' + ho.n + '. ' : '');
    if (s > t) {
      const n = daysBetween(t, s);
      openModal('<div class="big">' + esc(fmtDay(s)) + '</div><p style="font-weight:800">' + esc(info || (isSchoolDay(s) ? 'Giorno di scuola.' : 'Niente scuola.')) + '</p><p>Mancano ' + n + (n === 1 ? ' giorno' : ' giorni') + '.</p><button type="button" class="btn" data-focus id="m-ok">Ok</button>');
      $('m-ok').addEventListener('click', closeModal);
      return;
    }
    openModal('<div class="big" style="font-size:28px">' + esc(fmtDay(s)) + '</div>' + (info ? '<p style="font-weight:800;margin:4px 0">' + esc(info) + '</p>' : '') + '<div id="m-form"></div><div class="row center" style="margin-top:8px"><button type="button" class="btn small ghost" id="m-close">Chiudi</button></div>', ['var(--c1)', 'var(--c1-soft)']);
    $('m-close').addEventListener('click', closeModal);
    dayForm($('m-form'), s, e => { closeModal(); drawCal(); stats(); if (s === t) { startForm(); reply(dragonReply(e)); } });
  }
  function stats() {
    const all = diary(), keys = Object.keys(all);
    const pres = keys.filter(k => all[k].p === 'P').length, abs = keys.filter(k => all[k].p === 'A').length;
    const left = t <= SCHOOL.end ? schoolDaysBetween(t, SCHOOL.end) : 0;
    const [y, mo] = calMonth, pre = y + '-' + pad(mo + 1);
    const cnt = {}; keys.filter(k => k.startsWith(pre) && all[k].m).forEach(k => { cnt[all[k].m] = (cnt[all[k].m] || 0) + 1; });
    const moodsTxt = MOODS.filter(m => cnt[m.id]).map(m => m.ic + ' ' + cnt[m.id]).join('  ');
    $('c-stats').innerHTML = '<span class="pill">✅ ' + pres + (pres === 1 ? ' presenza' : ' presenze') + '</span><span class="pill">🏠 ' + abs + (abs === 1 ? ' assenza' : ' assenze') + '</span>' +
      '<span class="pill">🎒 ancora ' + left + (left === 1 ? ' giorno' : ' giorni') + ' di scuola</span>' + (moodsTxt ? '<span class="pill">' + MESI[mo] + ': ' + moodsTxt + '</span>' : '');
  }
  function hols() {
    $('c-hols').innerHTML = HOLS.map(h => {
      const past = h.e < t, now = t >= h.s && t <= h.e, n = daysBetween(t, h.s);
      const wkd = !holSkipsSchool(h) ? ' · cade di ' + GIORNI_L[fromIso(h.s).getDay()] : '';
      return '<div class="hol' + (past ? ' past' : '') + (now ? ' now' : '') + '"><span class="ic" aria-hidden="true">' + h.ic + '</span><div style="min-width:0"><b>' + esc(h.n) + '</b><small>' +
        (h.s === h.e ? fmtDay(h.s) : 'dal ' + fmtDay(h.s) + ' ' + (h.summer ? 'all\u2019inizio del nuovo anno scolastico' : alDayL(h.e))) + wkd + '</small></div>' +
        '<span class="when">' + (past ? '✓' : now ? 'ora!' : n === 1 ? 'domani' : 'tra ' + n + ' g') + '</span></div>';
    }).join('');
  }
  $('c-prev').addEventListener('click', () => { calMonth = calMonth[1] === 0 ? [calMonth[0] - 1, 11] : [calMonth[0], calMonth[1] - 1]; drawCal(); stats(); });
  $('c-next').addEventListener('click', () => { calMonth = calMonth[1] === 11 ? [calMonth[0] + 1, 0] : [calMonth[0], calMonth[1] + 1]; drawCal(); stats(); });
  $('c-sat').addEventListener('change', ev => { store.set('sat-school', ev.target.checked); PAGES.diario(el); });
  drawCal(); stats(); hols();
};

/* scheda sulla Casa */
function homeDiaryCard() {
  const t = todayIso(), { cur, next } = nextHoliday(t), e = diary()[t];
  const line = cur ? cur.ic + ' Sei in vacanza: ' + cur.n + '!' : next ? next.ic + ' ' + (daysBetween(t, next.s) === 1 ? 'Domani: ' + next.n + '!' : 'Mancano ' + daysBetween(t, next.s) + ' giorni a: ' + next.n) : '📅 Diario';
  const sub = e && e.m ? 'Oggi ti senti ' + moodOf(e.m).n.toLowerCase() + ' ' + moodOf(e.m).ic + ' · tocca per il diario' : 'Come ti senti oggi? Raccontalo a ' + D.name + ' 💬';
  return '<button type="button" class="today" id="h-diary" style="--ts:var(--c1-soft);border-color:var(--c1)"><span class="ic" aria-hidden="true">📅</span><span class="tx">' + esc(line) + '<small>' + esc(sub) + '</small></span><span class="st" aria-hidden="true">→</span></button>';
}

/* ---------- Casa: stato d'animo prevalente della settimana + «Dillo forte» ---------- */
function moodWeek() {
  const dd = diary(), t = fromIso(todayIso()), days = [];
  for (let k = 6; k >= 0; k--) { const s = iso(addDays(t, -k)); days.push({ s, m: dd[s] && dd[s].m ? moodOf(dd[s].m) : null }); }
  const cnt = {}; days.forEach((d, i) => { if (d.m) cnt[d.m.id] = { n: (cnt[d.m.id] ? cnt[d.m.id].n : 0) + 1, last: i }; });
  const ids = Object.keys(cnt).sort((a, b) => cnt[b].n - cnt[a].n || cnt[b].last - cnt[a].last);
  const filled = days.filter(d => d.m).length, down = days.filter(d => d.m && d.m.k === 'down').length;
  return { days, top: ids[0] ? moodOf(ids[0]) : null, topN: ids[0] ? cnt[ids[0]].n : 0, filled, down };
}
function homeMoodCard() {
  const w = moodWeek(), st = downStreak();
  const strong = st >= 3 || (w.filled >= 4 && w.down * 2 > w.filled);
  const strip = '<div class="mw-strip">' + w.days.map(d => { const g = fromIso(d.s); return '<div class="mw-d' + (d.m && d.m.k === 'down' ? ' dn' : '') + '"><span>' + (d.m ? d.m.ic : '·') + '</span><small>' + GIORNI_L[g.getDay()].slice(0, 3) + '</small></div>'; }).join('') + '</div>';
  if (strong) {
    const why = st >= 3 ? 'Da ' + st + ' giorni ti senti giù.' : 'Questa settimana ti sei sentita giù ' + w.down + ' giorni su ' + w.filled + '.';
    return '<div class="card mood-home strong" role="status"><div class="mh-top"><span class="mh-ic" aria-hidden="true">💜</span><div style="min-width:0"><div class="mh-title">Dillo forte!</div>' +
      '<div class="mh-sub">' + esc(why) + ' È normale, succede a tutti: ma adesso è il momento di raccontarlo a mamma o papà. Chi ti vuole bene vuole saperlo.</div></div></div>' + strip +
      '<button type="button" class="btn small" id="h-mood" style="--bc:var(--c6);margin-top:10px">Scrivi come ti senti →</button></div>';
  }
  if (!w.top) return '<div class="card mood-home"><div class="mh-top"><span class="mh-ic" aria-hidden="true">💬</span><div style="min-width:0"><div class="mh-title">Come ti senti questa settimana?</div><div class="mh-sub">Scrivilo nel diario: qui vedrai la tua emozione più frequente.</div></div></div>' + strip + '<button type="button" class="btn small ghost" id="h-mood" style="margin-top:10px">Apri il diario →</button></div>';
  const msg = w.top.k === 'up' ? 'Che bella settimana! Ricordati che cosa ti ha fatto stare così.' : w.top.k === 'tired' ? 'Un po’ di stanchezza: sonno e pause movimento ti ricaricano.' : w.top.k === 'down' ? 'Hai avuto qualche giorno difficile: raccontalo a mamma o papà, aiuta.' : 'Una settimana normale: va benissimo così.';
  return '<div class="card mood-home"><div class="mh-top"><span class="mh-ic big" aria-hidden="true">' + w.top.ic + '</span><div style="min-width:0"><div class="mh-sub" style="margin:0">Questa settimana ti senti soprattutto</div>' +
    '<div class="mh-title">' + esc(w.top.n) + ' <span class="mh-n">' + w.topN + (w.topN === 1 ? ' giorno' : ' giorni') + ' su ' + w.filled + '</span></div><div class="mh-sub">' + esc(msg) + '</div></div></div>' + strip +
    '<button type="button" class="btn small ghost" id="h-mood" style="margin-top:10px">Apri il diario →</button></div>';
}
