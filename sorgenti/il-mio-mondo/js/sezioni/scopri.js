/* ================= SCOPRI (storia, geografia, italiano, inglese) ================= */
const ALL_SUBJECTS = [
/*SUBJECTS*/
];
const SCOPRI = ALL_SUBJECTS.filter(s => ['storia', 'geo', 'ita', 'eng'].includes(s.id)).concat(EXTRA_SUBJECTS);
let scopriSel = 'storia';
PAGES.scopri = el => {
  el.innerHTML = '<h1 class="page-title rainbow">' + esc(CHI) + ' esploratrice</h1>' +
    '<p class="page-sub">Storia, geografia, italiano, inglese, arte, musica, educazione civica, tecnologia e un assaggio di prima media: curiosità da scoprire, missioni fuori dal quaderno e mini-sfide.</p>' +
    '<div class="sec"><div id="sc-tiles"></div></div><div id="sc-panel"></div>';
  renderTiles($('sc-tiles'), SCOPRI.map(s => ({ id: s.id, ic: s.ic, name: s.name, sk: s.topic, c: s.c, s: s.s })), scopriSel, id => { scopriSel = id; PAGES.scopri(el); });
  const s = SCOPRI.find(x => x.id === scopriSel);
  const p = $('sc-panel');
  p.className = 'panel'; p.style.setProperty('--gc', s.c); p.style.setProperty('--gs', s.s);
  p.innerHTML = '<div class="row between"><h3>' + s.ic + ' ' + esc(s.name) + '</h3>' + sayBtn(s.motto) + '</div>' +
    '<p class="how">' + (s.id === 'media' ? 'Per il prossimo anno: ' : s.id === 'roblox' ? 'Per giocare: ' : 'In quinta: ') + esc(s.topic) + '</p>' +
    '<div class="explain" style="background:var(--gs);font-size:18px">' + esc(s.motto) + '</div>' +
    '<h4>👀 Lo sapevi?</h4><div id="sc-facts"></div>' +
    '<h4>🧭 Missioni da esploratrice <span style="font-family:var(--font-body);font-size:14px;color:var(--ink-soft)">da fare fuori dal quaderno</span></h4><ul class="missions" id="sc-mis"></ul>' +
    '<h4>🎯 Mini-sfida</h4><div id="sc-quiz"></div>';
  renderFacts($('sc-facts'), s.facts, 'sc-' + s.id);
  renderMissions($('sc-mis'), s.missions, 'scopri-' + s.id);
  const qs = s.quiz.map(q => ({ q: q[0], o: q[1], a: q[2], e: q[3] || '', en: q[4] || null }));
  const startQuiz = () => runQuiz($('sc-quiz'), drawDeck('q-sc-' + s.id, qs.length, 5).map(i => qs[i]), { color: s.c, restart: startQuiz });
  startQuiz();
};

/* ================= METODO ================= */
const M_STEPS = [
/*STEPS*/
];
const M_POWERS = [
/*POWERS*/
];
PAGES.metodo = el => {
  el.innerHTML = '<h1 class="page-title rainbow">Il metodo di ' + esc(CHI) + '</h1>' +
    '<p class="page-sub">I trucchi segreti per far restare le cose in testa. Li usano scienziati, attori e campioni di memoria!</p>' +
    '<div class="card" style="margin-top:18px;--kc:var(--c5);--ks:var(--c5-soft);display:flex;gap:14px;align-items:flex-start"><span style="font-size:44px" aria-hidden="true">🧠</span><div style="min-width:0">' +
    '<div style="font-family:var(--font-display);font-weight:800;font-size:22px">Il tuo cervello è come un prato</div>' +
    '<p style="margin:4px 0 0;font-weight:700">Ogni volta che ricordi una cosa, calpesti l’erba e fai un sentiero. Più ci passi, più diventa una strada facile. Rileggere serve poco: quello che conta è <b>ripescare</b> dalla memoria.</p></div></div>' +
    '<div class="sec">' + secHead('🗺️', 'Il metodo in 5 tappe', 'Da usare ogni volta che c’è una cosa da studiare', 'var(--c6-soft)') + '<ul class="steps" id="mt-steps"></ul>' +
    '<div class="row" style="margin-top:12px"><button type="button" class="btn small ghost" id="mt-reset">↺ Ricomincia il metodo</button></div></div>' +
    '<div class="sec">' + secHead('⚡', 'Gli 8 superpoteri della memoria', 'Apri ogni superpotere: scopri perché funziona e provalo subito', 'var(--c3-soft)') + '<div class="powers" id="mt-powers"></div></div>' +
    '<div class="sec">' + secHead('🪄', 'Il laboratorio delle frasi magiche', 'Inventa la tua frase per ricordare una lista', 'var(--c1-soft)') +
    '<div class="card" style="--kc:var(--c1);--ks:var(--c1-soft)"><label for="mt-words" style="font-weight:800;display:block">1. Scrivi le cose da ricordare, separate da una virgola</label>' +
    '<div class="row" style="margin-top:8px"><input type="text" class="field" id="mt-words" autocomplete="off" value="Marittime, Cozie, Graie, Pennine, Lepontine, Retiche, Carniche, Giulie"><button type="button" class="btn" id="mt-go" style="--bc:var(--c1);--bs:var(--c1-soft)">Trova le iniziali</button></div>' +
    '<div class="letters" id="mt-letters" aria-live="polite"></div><p id="mt-hint" style="font-weight:700;color:var(--ink-soft)"></p>' +
    '<label for="mt-mine" style="font-weight:800;display:block;margin-top:6px">2. Inventa una frase buffa che parte con queste lettere</label>' +
    '<div class="row" style="margin-top:8px"><input type="text" class="field" id="mt-mine" autocomplete="off" placeholder="Per esempio: Ma Con Gran Pena Le Reca Giù"><button type="button" class="btn" id="mt-save">Salva la mia frase</button></div>' +
    '<ul class="saved" id="mt-saved"></ul></div></div>' +
    '<div class="sec">' + secHead('📅', 'Il calendario del ripasso', 'Ripassare poco ma a salti fa ricordare per mesi', 'var(--c4-soft)') +
    '<div class="card" style="--kc:var(--c4);--ks:var(--c4-soft)"><label for="mt-topic" style="font-weight:800;display:block">Cosa hai studiato oggi?</label>' +
    '<div class="row" style="margin-top:8px"><input type="text" class="field" id="mt-topic" autocomplete="off" placeholder="Per esempio: i sette re di Roma"><button type="button" class="btn" id="mt-cal" style="--bc:var(--c4);--bs:var(--c4-soft)">Crea il calendario</button></div>' +
    '<p id="mt-what" style="font-weight:800" aria-live="polite"></p><div class="days" id="mt-days"></div></div></div>';

  // Tappe
  const stepsDone = new Set(store.get('m-steps', []));
  const ul = $('mt-steps');
  M_STEPS.forEach((s, i) => {
    const [col, soft] = PAL[(i + 3) % 6];
    const li = document.createElement('li');
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'step'; b.style.setProperty('--sc', col); b.style.setProperty('--ss', soft);
    b.setAttribute('aria-pressed', stepsDone.has(i) ? 'true' : 'false');
    b.innerHTML = '<span class="num">' + (i + 1) + '</span><span class="pic" aria-hidden="true">' + s[0] + '</span><span class="tx"><span class="nm">' + esc(s[1]) + '</span><span class="ds">' + esc(s[2]) + '</span></span><span class="tick" aria-hidden="true">' + CHECK + '</span>';
    b.addEventListener('click', () => {
      const now = b.getAttribute('aria-pressed') !== 'true';
      b.setAttribute('aria-pressed', now ? 'true' : 'false');
      now ? stepsDone.add(i) : stepsDone.delete(i);
      store.set('m-steps', [...stepsDone]);
      if (now) {
        /* premio una volta sola per passo (anche dopo «ricomincia») */
        const paid = new Set(store.get('m-steps-paid', [])), first = !paid.has(i); paid.add(i);
        ding(); if (first) gain(1, b);
        if (stepsDone.size === M_STEPS.length) { cheer(b, 'Metodo completato, ' + NAME + '!'); fanfare(); if (!paid.has('all')) { paid.add('all'); gain(3, b); } } else cheer(b);
        store.set('m-steps-paid', [...paid]);
      }
    });
    li.appendChild(b); ul.appendChild(li);
  });
  $('mt-reset').addEventListener('click', () => { store.set('m-steps', []); PAGES.metodo(el); });

  // Superpoteri
  const openP = new Set(store.get('m-open', []));
  const drawPowers = () => {
    const wrap = $('mt-powers'); wrap.innerHTML = '';
    M_POWERS.forEach((p, i) => {
      const [col, soft] = PAL[i % 6];
      const d = document.createElement('article');
      d.className = 'power'; d.style.setProperty('--pc', col); d.style.setProperty('--ps', soft);
      const isOpen = openP.has(i);
      let more = '';
      if (isOpen) {
        more = '<div class="box why"><span class="lb">Perché funziona</span>' + esc(p.why) + '</div>';
        if (p.magic) p.magic.forEach(mg => { more += '<div class="box try"><span class="lb">' + esc(mg[0]) + '</span><div class="magic">' + mg[1] + '</div></div>'; });
        else more += '<div class="box try"><span class="lb">Provalo subito</span>' + esc(p.tryit.replace('qui sotto', 'in fondo a questa pagina')) + '</div>';
      }
      d.innerHTML = '<div class="top"><span class="ic" aria-hidden="true">' + p.ic + '</span><h5>' + esc(p.name) + '</h5>' + sayBtn(p.name + '. ' + p.what + (isOpen ? ' ' + p.why : '')) + '</div>' +
        '<p class="what">' + esc(p.what) + '</p>' + more +
        '<button type="button" class="open" aria-expanded="' + isOpen + '">' + (isOpen ? 'Chiudi' : 'Scopri il segreto ✨') + '</button>';
      d.querySelector('.open').addEventListener('click', () => {
        const willOpen = !openP.has(i);
        willOpen ? openP.add(i) : openP.delete(i);
        const rew = new Set(store.get('m-open-rew', []));
        store.set('m-open', [...openP]);
        drawPowers();
        const card = $('mt-powers').children[i];
        card.querySelector('.open').focus();
        if (willOpen) { cheer(card.querySelector('h5'), 'Nuovo superpotere!'); if (!rew.has(i)) { rew.add(i); store.set('m-open-rew', [...rew]); gain(1, card); } }
      });
      wrap.appendChild(d);
    });
  };
  drawPowers();

  // Laboratorio
  const letters = () => {
    const words = $('mt-words').value.split(',').map(w => w.trim()).filter(Boolean).slice(0, 14);
    $('mt-letters').innerHTML = words.map((w, i) => '<div class="letter" style="--lc:' + PAL[i % 6][0] + ';--ls:' + PAL[i % 6][1] + '"><b>' + esc(w.charAt(0).toUpperCase()) + '</b><small>' + esc(w) + '</small></div>').join('');
    $('mt-hint').textContent = words.length ? 'Le tue lettere magiche: ' + words.map(w => w.charAt(0).toUpperCase()).join(' · ') + '. Più la frase è buffa, meglio si ricorda!' : 'Scrivi almeno una parola.';
  };
  $('mt-go').addEventListener('click', e => { letters(); cheer(e.currentTarget, 'Ecco le lettere!'); });
  let saved = store.get('m-frasi', []);
  const drawSaved = () => {
    const box = $('mt-saved'); box.innerHTML = '';
    saved.forEach((f, i) => {
      const li = document.createElement('li');
      li.innerHTML = '<span>🪄 ' + esc(f) + '</span><button type="button" aria-label="Cancella questa frase">✕</button>';
      li.querySelector('button').addEventListener('click', () => { saved.splice(i, 1); store.set('m-frasi', saved); drawSaved(); });
      box.appendChild(li);
    });
  };
  $('mt-save').addEventListener('click', e => {
    const v = $('mt-mine').value.trim(); if (!v) { $('mt-mine').focus(); return; }
    saved.unshift(v); saved = saved.slice(0, 20); store.set('m-frasi', saved); $('mt-mine').value = '';
    drawSaved(); cheer(e.currentTarget, 'Frase magica salvata!'); gain(2, e.currentTarget);
  });
  letters(); drawSaved();

  // Calendario del ripasso
  const GAPS = [[0, 'Oggi', 'Racconta senza libro'], [1, 'Domani', '5 minuti di domande'], [3, 'Tra 3 giorni', 'Rifai il disegno a memoria'], [7, 'Tra una settimana', 'Spiegalo a qualcuno']];
  const fmt = d => d.toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short' });
  let cal = store.get('m-cal', null);
  const drawCal = () => {
    const box = $('mt-days'); box.innerHTML = '';
    if (!cal) { $('mt-what').textContent = 'Scrivi cosa hai studiato e tocca «Crea il calendario».'; return; }
    $('mt-what').textContent = 'Ripasso di: ' + cal.topic;
    const st = new Date(cal.start);
    GAPS.forEach((g, i) => {
      const d = new Date(st.getFullYear(), st.getMonth(), st.getDate() + g[0]);
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'day'; b.setAttribute('aria-pressed', cal.done.includes(i) ? 'true' : 'false');
      b.innerHTML = '<span class="when">' + g[1] + (cal.done.includes(i) ? ' ✓' : '') + '</span><span class="date">' + esc(fmt(d)) + '</span><span class="hw">' + g[2] + '</span>';
      b.addEventListener('click', () => {
        const k = cal.done.indexOf(i);
        if (k === -1) {
          if (d > new Date()) { floatText(b, 'Questo ripasso è nel futuro: aspetta quel giorno!'); return; }
          cal.done.push(i); cal.paid = cal.paid || []; ding(); if (!cal.paid.includes(i)) { cal.paid.push(i); gain(2, b); } cheer(b, cal.done.length === 4 ? 'Ricordo fissato per sempre!' : null);
        }
        else cal.done.splice(k, 1);
        store.set('m-cal', cal); drawCal();
      });
      box.appendChild(b);
    });
  };
  $('mt-cal').addEventListener('click', e => {
    const t = $('mt-topic').value.trim() || 'il mio argomento';
    const n = new Date();
    cal = { topic: t, start: new Date(n.getFullYear(), n.getMonth(), n.getDate()).toISOString(), done: [] };
    store.set('m-cal', cal); drawCal(); cheer(e.currentTarget, 'Calendario pronto!');
  });
  if (cal) $('mt-topic').value = cal.topic;
  drawCal();
};

