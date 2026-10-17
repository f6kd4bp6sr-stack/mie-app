/* ================= ROUTINE ================= */
const ROUTINES = [
  { id: 'mattino', ic: '☀️', name: 'Il mattino', sk: 'Una tappa alla volta', c: 'var(--c2)', s: 'var(--c2-soft)', steps: [
    ['😺', 'Mi sveglio e mi stiracchio come un gatto'],
    ['👗', 'Mi vesto con la mia canzone preferita'],
    ['🥣', 'Faccio colazione'],
    ['🪥', 'Lavo i denti e la faccia'],
    ['🎒', 'Controllo lo zaino'],
    ['👟', 'Scarpe e giacca: pronta!']
  ] },
  { id: 'compiti', ic: '📚', name: 'I compiti', sk: 'Preparo, lavoro, controllo', c: 'var(--c6)', s: 'var(--c6-soft)', steps: [
    ['📒', 'Guardo il diario: cosa c’è da fare?'],
    ['✏️', 'Preparo tutto sul tavolo'],
    ['💧', 'Acqua vicino, telefono lontano'],
    ['1️⃣', 'Faccio un compito alla volta'],
    ['💃', 'Dopo 20 minuti: pausa, ballo o salto!'],
    ['✅', 'Controllo e rimetto tutto nello zaino']
  ] },
  { id: 'sera', ic: '🌙', name: 'La sera', sk: 'Mi preparo a dormire bene', c: 'var(--c5)', s: 'var(--c5-soft)', steps: [
    ['🛁', 'Bagnetto o doccia'],
    ['🧸', 'Metto il pigiama'],
    ['🎒', 'Preparo lo zaino per domani'],
    ['🪥', 'Lavo i denti'],
    ['📖', 'Una storia con mamma o papà'],
    ['🌟', 'Luce spenta, buonanotte']
  ] },
  { id: 'zaino', ic: '🎒', name: 'Zaino pronto', sk: 'Controllo la sera prima', c: 'var(--c4)', s: 'var(--c4-soft)', steps: [
    ['📚', 'Libri e quaderni di domani'],
    ['📒', 'Diario firmato'],
    ['✏️', 'Astuccio pieno'],
    ['🍎', 'Merenda e borraccia'],
    ['👕', 'Vestiti pronti sulla sedia'],
    ['👟', 'Scarpe pronte alla porta']
  ] },
  { id: 'borsa-patt', day: null, sport: 'Pattinaggio sul ghiaccio', ic: '⛸️', name: 'Borsa del pattinaggio', sk: 'Prima del pattinaggio', c: 'var(--c5)', s: 'var(--c5-soft)', steps: [
    ['⛸️', 'Pattini con i copri-lama'],
    ['🧤', 'Guanti'],
    ['🧥', 'Felpa o giacchetta calda (sul ghiaccio fa freddo!)'],
    ['🧦', 'Calzini sottili e leggings o tuta'],
    ['🧻', 'Panno per asciugare le lame'],
    ['🎀', 'Elastici per i capelli'],
    ['🍎', 'Merenda e borraccia']
  ] },
  { id: 'borsa-aerea', day: null, sport: 'Ginnastica aerea', ic: '🎪', name: 'Borsa della ginnastica aerea', sk: 'Prima dell’aerea', c: 'var(--c6)', s: 'var(--c6-soft)', steps: [
    ['🩱', 'Body o leggings e maglietta aderente, senza cerniere'],
    ['🎀', 'Elastici: capelli ben legati'],
    ['💍', 'Niente orecchini, braccialetti o anelli'],
    ['🧥', 'Felpa per dopo la lezione'],
    ['🩴', 'Ciabatte o scarpe comode'],
    ['🍎', 'Merenda e borraccia']
  ] }
];
const GIORNI = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
/* I giorni dello sport arrivano dalle impostazioni salvate sull'iPad, non dal codice */
function applySportDays() {
  try {
    [['borsa-patt', 'patt', 'Prima del pattinaggio'], ['borsa-aerea', 'aerea', 'Prima dell’aerea']].forEach(([id, k, def]) => {
      const r = ROUTINES.find(x => x.id === id); if (!r) return;
      const d = CHILD[k]; r.day = (d === 0 || d) ? +d : null;
      r.sk = r.day === null ? def : (r.day === 0 ? 'La ' : 'Il ') + GIORNI[r.day];
    });
  } catch (e) {}
}
applySportDays();
function sportToday() {
  const d = new Date().getDay(), h = new Date().getHours();
  const today = ROUTINES.find(r => r.day === d);
  const tomorrow = ROUTINES.find(r => r.day === (d + 1) % 7);
  if (today) return { r: today, when: 'oggi' };
  if (tomorrow && h >= 16) return { r: tomorrow, when: 'domani' };
  return null;
}
function routineState() {
  let s = store.get('routine', null);
  if (!s || s.date !== todayKey()) { s = { date: todayKey(), done: {}, rew: {}, complete: [] }; store.set('routine', s); }
  return s;
}
let routineSel = null;
PAGES.routine = el => {
  if (!routineSel) { const h = new Date().getHours(); routineSel = h < 11 ? 'mattino' : h < 18 ? 'compiti' : 'sera'; const sp = sportToday(); if (sp && ((sp.when === 'oggi' && h >= 11 && h < 18) || sp.when === 'domani')) routineSel = sp.r.id; }
  const st = routineState();
  el.innerHTML = '<h1 class="page-title rainbow">Le routine di ' + esc(CHI) + '</h1>' +
    '<p class="page-sub">Tocca ogni tappa quando l’hai fatta. Ogni tappa dà energia a ' + esc(D.name) + '! Le spunte ripartono da zero ogni giorno.</p>' +
    '<div class="sec"><div id="r-tiles"></div></div><div id="r-panel"></div>';
  const sp = sportToday();
  const list = ROUTINES.map(r => ({ ...r, sk: r.day !== undefined && sp && sp.r.id === r.id ? '⭐ Serve ' + sp.when + '!' : r.sk, ok: (st.done[r.id] || []).length === r.steps.length ? '✓ fatta oggi' : (st.done[r.id] || []).length + '/' + r.steps.length + ' oggi' }));
  renderTiles($('r-tiles'), list, routineSel, id => { routineSel = id; PAGES.routine(el); });
  const r = ROUTINES.find(x => x.id === routineSel);
  const p = $('r-panel');
  p.className = 'panel'; p.style.setProperty('--gc', r.c); p.style.setProperty('--gs', r.s);
  p.innerHTML = '<div class="row between"><h3>' + r.ic + ' ' + esc(r.name) + '</h3>' + sayBtn(r.name + '. ' + r.steps.map((s, i) => (i + 1) + ': ' + s[1]).join('. ')) + '</div>' +
    '<p class="how">' + esc(r.sk) + '. Parti dall’alto e scendi.</p><ul class="steps" id="r-steps" style="margin-top:14px"></ul>';
  const ul = $('r-steps');
  r.steps.forEach((s, i) => {
    const [col, soft] = PAL[i % 6];
    const on = (st.done[r.id] || []).includes(i);
    const li = document.createElement('li');
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'step';
    b.style.setProperty('--sc', col); b.style.setProperty('--ss', soft);
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
    b.innerHTML = '<span class="num">' + (i + 1) + '</span><span class="pic" aria-hidden="true">' + s[0] + '</span><span class="tx"><span class="nm">' + esc(s[1]) + '</span></span><span class="tick" aria-hidden="true">' + CHECK + '</span>';
    b.addEventListener('click', () => {
      const S = routineState();
      const set = new Set(S.done[r.id] || []);
      const now = !set.has(i);
      now ? set.add(i) : set.delete(i);
      S.done[r.id] = [...set];
      b.setAttribute('aria-pressed', now ? 'true' : 'false');
      if (now) {
        ding();
        const rew = new Set(S.rew[r.id] || []);
        if (!rew.has(i)) { rew.add(i); S.rew[r.id] = [...rew]; gain(1, b); }
        if (set.size === r.steps.length && !S.complete.includes(r.id)) {
          S.complete.push(r.id);
          store.set('routine', S);
          cheer(b, r.name + ': completata!'); fanfare(); gain(3, b); markDay('routine', b);
        } else cheer(b);
      }
      store.set('routine', S);
    });
    li.appendChild(b); ul.appendChild(li);
  });
};
