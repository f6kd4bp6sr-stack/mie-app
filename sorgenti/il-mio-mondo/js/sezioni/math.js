/* ================= MATEMATICA ================= */
const MATH = [
  { id: 'tab', ic: '⚡', name: 'Tabelline turbo', sk: 'Calcolo veloce', c: 'var(--c1)', s: 'var(--c1-soft)' },
  { id: 'fraz', ic: '🍕', name: 'Pizze e sconti', sk: 'Frazioni, decimali, %', c: 'var(--c2)', s: 'var(--c2-soft)' },
  { id: 'prob', ic: '🕵️‍♀️', name: 'Problemi detective', sk: 'Storie da risolvere', c: 'var(--c6)', s: 'var(--c6-soft)' },
  { id: 'geo', ic: '📐', name: 'Costruisci figure', sk: 'Aree e perimetri', c: 'var(--c4)', s: 'var(--c4-soft)' }
];
let mathSel = 'tab';
PAGES.mate = el => {
  el.innerHTML = '<h1 class="page-title rainbow">Matematica da campionessa</h1>' +
    '<p class="page-sub">La matematica è un allenamento: ogni esercizio, anche sbagliato, rende il tuo cervello più forte e ' + esc(D.name) + ' più grande.</p>' +
    '<div class="sec"><div id="m-tiles"></div></div><div id="m-panel"></div>';
  const done = store.get('math-done', {});
  renderTiles($('m-tiles'), MATH.map(m => ({ ...m, ok: done[m.id] ? '✓ fatto ' + done[m.id] + (done[m.id] === 1 ? ' volta' : ' volte') : '' })), mathSel, id => { mathSel = id; PAGES.mate(el); });
  const m = MATH.find(x => x.id === mathSel);
  const p = $('m-panel');
  p.className = 'panel'; p.style.setProperty('--gc', m.c); p.style.setProperty('--gs', m.s);
  ({ tab: mathTab, fraz: mathFraz, prob: mathProb, geo: mathGeo, media: mathMedia, ore: mathOre })[mathSel](p, m);
};
function mathFinished(id, el, bonus) {
  const done = store.get('math-done', {}); done[id] = (done[id] || 0) + 1; store.set('math-done', done);
  markDay('mate', el); gain(bonus, el); activityDone(); fanfare(); confetti(window.innerWidth / 2, window.innerHeight / 3, 30);
}
function endCard(p, title, lines, again, color) {
  p.querySelector('.m-stage').innerHTML = '<div class="quiz" style="text-align:center"><div class="big-q" style="font-size:clamp(28px,5vw,42px)">' + esc(title) + '</div>' +
    lines.map(l => '<p style="font-weight:800;margin:6px 0 0">' + esc(l) + '</p>').join('') +
    '<div class="row center" style="margin-top:14px"><button type="button" class="btn" style="--bc:' + color + '">Ancora!</button></div></div>';
  p.querySelector('.m-stage .btn').addEventListener('click', again);
}
function nextBtn(color, fn) {
  const b = document.createElement('button'); b.type = 'button'; b.className = 'btn small'; b.style.setProperty('--bc', color);
  b.textContent = 'Avanti →'; b.addEventListener('click', fn); return b;
}

/* ---------- Tabelline turbo ---------- */
function dotsSVG(a, b) {
  const s = 18, W = b * s + 6, H = a * s + 6;
  let c = '';
  for (let r = 0; r < a; r++) for (let k = 0; k < b; k++) c += '<circle cx="' + (k * s + s / 2 + 3) + '" cy="' + (r * s + s / 2 + 3) + '" r="6.5" fill="' + (r % 2 ? 'var(--c1)' : 'var(--c6)') + '"/>';
  return '<svg viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" height="' + H + '" role="img" aria-label="' + a + ' file da ' + b + ' pallini">' + c + '</svg>';
}
const TAB_TIPS = {
  2: 'La tabellina del 2 è il doppio: 7 × 2 è 7 + 7.',
  3: 'Per il 3 fai il doppio e aggiungi ancora una volta il numero.',
  4: 'Il 4 è il doppio del doppio: 6 × 4 → 12 → 24.',
  5: 'Nel 5 i risultati finiscono sempre con 0 o 5.',
  6: 'Il 6 è il 5 più una volta: 7 × 6 = 35 + 7.',
  7: 'Il 7 è il 5 più il 2: 7 × 8 = 40 + 16.',
  8: 'L’8 è il doppio del 4: fai il 4 e raddoppia.',
  9: 'Nel 9 le cifre del risultato sommate fanno sempre 9: 9 × 7 = 63 → 6 + 3 = 9.',
  10: 'Per il 10 aggiungi uno zero: 7 × 10 = 70.'
};
function mathTab(p, m) {
  let table = store.get('tab-last', 0), timed = false;
  const best = store.get('tab-best', {});
  const chips = [0, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => '<button type="button" class="chip" data-t="' + n + '" aria-pressed="' + (n === table) + '">' + (n ? n + (best[n] ? ' ' + (best[n] >= 10 ? '🏆' : '⭐') : '') : 'Tutte 🎲') + '</button>').join('');
  p.innerHTML = '<div class="row between"><h3>⚡ Tabelline turbo</h3>' + sayBtn('Tabelline turbo. Scegli una tabellina e rispondi con il tastierino. Se sbagli ti mostro un trucco, e la rifacciamo più tardi.') + '</div>' +
    '<p class="how">Scegli una tabellina e rispondi con il tastierino. Se sbagli ti mostro un trucco e la ripetiamo più tardi. 🏆 = tutte giuste!</p>' +
    '<div class="chips" id="t-chips">' + chips + '</div>' +
    '<div class="row" style="margin-top:12px"><button type="button" class="chip" id="t-timer" aria-pressed="false">⏱️ Con il cronometro</button><button type="button" class="btn" id="t-go">Via!</button></div>' +
    '<div class="m-stage"></div>';
  p.querySelectorAll('#t-chips .chip').forEach(c => c.addEventListener('click', () => {
    table = +c.dataset.t; store.set('tab-last', table);
    p.querySelectorAll('#t-chips .chip').forEach(x => x.setAttribute('aria-pressed', x === c ? 'true' : 'false'));
  }));
  $('t-timer').addEventListener('click', e => { timed = !timed; e.currentTarget.setAttribute('aria-pressed', timed ? 'true' : 'false'); });
  $('t-go').addEventListener('click', start);
  function start() {
    audio();
    const facts = [];
    const used = new Set();
    while (facts.length < 10) {
      const a = table || rnd(2, 10), b = rnd(1, 10), key = a + 'x' + b;
      if (used.has(key) && used.size < 9) continue;
      used.add(key); facts.push({ a, b, again: false });
    }
    let i = 0, score = 0, firstTry = 0, t0 = Date.now(), total = facts.length;
    const stage = p.querySelector('.m-stage');
    function show() {
      if (i >= facts.length) return finish();
      const f = facts[i];
      stage.innerHTML = '<div class="quiz" style="margin-top:14px"><div class="row between"><span class="qn">Conto ' + (i + 1) + ' di ' + facts.length + '</span>' + (timed ? '<span class="pill" id="t-clock">0 s</span>' : '') + '</div>' +
        '<div class="progress" style="--gc:' + m.c + '"><i style="width:' + (i / facts.length * 100) + '%"></i></div>' +
        '<div class="big-q">' + f.a + ' × ' + f.b + ' = <span id="t-ans" style="color:var(--c1)">?</span></div><div id="t-kp"></div><div id="t-fb"></div></div>';
      if (timed) { const tick = () => { const c = $('t-clock'); if (!c) return; c.textContent = Math.round((Date.now() - t0) / 1000) + ' s'; later(tick, 1000); }; tick(); }
      const kp = makeKeypad($('t-kp'), (v, api) => {
        api.lock();
        $('t-ans').textContent = v;
        if (typeof tabStat === 'function' && !f.again) tabStat(table || f.a, v === f.a * f.b);
        if (v === f.a * f.b) {
          api.mark(true); ding(); score++; if (!f.again) firstTry++;
          if ((i + 1) % 3 === 0) cheer($('t-ans'));
          later(() => { i++; show(); }, 650);
        } else {
          api.mark(false); oops();
          $('t-ans').textContent = f.a * f.b; $('t-ans').style.color = 'var(--leaf)';
          const fb = $('t-fb');
          fb.innerHTML = '<div class="explain"><b>' + f.a + ' × ' + f.b + ' = ' + (f.a * f.b) + '</b> (tu avevi scritto ' + v + '). ' + esc(pick(TRY)) +
            '<div class="viz">' + dotsSVG(Math.min(f.a, f.b), Math.max(f.a, f.b)) + '</div>' +
            '<div style="margin-top:6px">💡 ' + esc(TAB_TIPS[f.a] || TAB_TIPS[f.b] || '') + '</div>' +
            (!f.again ? '<div style="margin-top:6px;color:var(--ink-soft)">Questo conto torna tra poco: vedrai che lo ricordi!</div>' : '') + '</div>';
          if (!f.again) facts.splice(Math.min(facts.length, i + 3), 0, { a: f.a, b: f.b, again: true });
          const nb = nextBtn(m.c, () => { i++; show(); }); fb.firstChild.appendChild(nb); nb.focus();
        }
      });
    }
    function finish() {
      const secs = Math.round((Date.now() - t0) / 1000);
      const key = table || 'mix';
      if (table) { best[table] = Math.max(best[table] || 0, firstTry); store.set('tab-best', best); }
      endCard(p, firstTry === total ? 'Tutte giuste, ' + NAME + '! 🏆' : firstTry + ' su ' + total + ' al primo colpo!',
        ['Hai ripassato anche i conti più difficili: così la memoria li fissa. 💪', timed ? '⏱️ Tempo: ' + secs + ' secondi' : '', '+' + (4 + Math.floor(firstTry / 2)) + ' 🔥 per ' + D.name].filter(Boolean),
        () => mathTab(p, m), m.c);
      mathFinished('tab', stage, 4 + Math.floor(firstTry / 2));
    }
    show();
  }
}

/* ---------- Pizze e sconti: frazioni, decimali, percentuali ---------- */
function pizzaSVG(n, colored, opts) {
  opts = opts || {};
  const R = 90, cx = 100, cy = 100;
  let paths = '';
  for (let i = 0; i < n; i++) {
    const a1 = -Math.PI / 2 + i * 2 * Math.PI / n, a2 = a1 + 2 * Math.PI / n;
    const x1 = cx + R * Math.cos(a1), y1 = cy + R * Math.sin(a1), x2 = cx + R * Math.cos(a2), y2 = cy + R * Math.sin(a2);
    const on = colored.has ? colored.has(i) : i < colored;
    const d = n === 1 ? 'M' + cx + ' ' + (cy - R) + ' A' + R + ' ' + R + ' 0 1 1 ' + (cx - 0.01) + ' ' + (cy - R) + ' Z' : 'M' + cx + ' ' + cy + ' L' + x1.toFixed(2) + ' ' + y1.toFixed(2) + ' A' + R + ' ' + R + ' 0 0 1 ' + x2.toFixed(2) + ' ' + y2.toFixed(2) + ' Z';
    paths += '<path d="' + d + '" data-i="' + i + '" fill="' + (on ? 'var(--sauce)' : 'var(--crust)') + '" stroke="var(--crust-line)" stroke-width="4"' +
      (opts.tap ? ' style="cursor:pointer" tabindex="0" role="button" aria-label="Fetta ' + (i + 1) + (on ? ', con pomodoro' : '') + '"' : '') + '/>';
    if (on) {
      const am = (a1 + a2) / 2;
      paths += '<circle cx="' + (cx + R * .6 * Math.cos(am)).toFixed(1) + '" cy="' + (cy + R * .6 * Math.sin(am)).toFixed(1) + '" r="' + Math.max(5, 14 - n) + '" fill="#fff8e6" pointer-events="none"/>';
    }
  }
  return '<svg viewBox="0 0 200 200" width="' + (opts.size || 220) + '" height="' + (opts.size || 220) + '" role="img" aria-label="Pizza divisa in ' + n + ' fette">' +
    '<circle cx="100" cy="100" r="96" fill="var(--crust-line)"/>' + paths + '</svg>';
}
const gcd = (a, b) => b ? gcd(b, a % b) : a;
function fracQuestions() {
  const qs = [];
  // 1. riconosci la frazione
  const idq = () => {
    const n = pick([3, 4, 5, 6, 8]), k = rnd(1, n - 1);
    const right = k + '/' + n;
    const wrong = new Set([(n - k) + '/' + n, k + '/' + (n + 2), (k + 1 <= n ? (k + 1) + '/' + n : '1/' + n)]);
    wrong.delete(right);
    return { type: 'opts', q: 'Che frazione della pizza ha il pomodoro?', viz: pizzaSVG(n, k), o: [right].concat([...wrong].slice(0, 2)), a: 0,
      e: 'La pizza è divisa in ' + n + ' fette (il denominatore, sotto) e ' + k + ' hanno il pomodoro (il numeratore, sopra): ' + right + '.' };
  };
  qs.push(idq());
  // 2. colora
  { const n = pick([4, 6, 8]), k = rnd(1, n - 1); qs.push({ type: 'color', n, k, q: 'Metti il pomodoro su ' + k + '/' + n + ' della pizza: tocca le fette!', e: k + '/' + n + ' vuol dire ' + k + ' fette su ' + n + '.' }); }
  // 3. frazione di un numero
  { const n = pick([2, 3, 4, 5, 10]), k = n === 2 ? 1 : rnd(1, n - 1), T = n * rnd(2, 9), ans = k * T / n;
    qs.push({ type: 'key', q: 'Quanto fa ' + k + '/' + n + ' di ' + T + '?', ans, unit: '', e: 'Prima dividi per ' + n + ': ' + T + ' : ' + n + ' = ' + (T / n) + '. Poi moltiplica per ' + k + ': ' + (T / n) + ' × ' + k + ' = ' + ans + '.', viz: '' }); }
  // 4. percentuale
  { const p = pick([10, 25, 50, 50, 100]); const base = p === 25 ? 4 : p === 10 ? 10 : 2; const T = base * rnd(2, 12); const ans = T * p / 100;
    const tip = { 10: 'Il 10% si trova dividendo per 10', 25: 'Il 25% è un quarto: dividi per 4', 50: 'Il 50% è la metà: dividi per 2', 100: 'Il 100% è tutto quanto' }[p];
    qs.push({ type: 'key', q: '🏷️ Un gioco costa ' + T + ' €. Quanto è il ' + p + '% di ' + T + ' €?', ans, unit: '€', e: tip + ': ' + T + ' → ' + ans + ' €.' }); }
  // 5. decimali
  { const D2 = [['0,5', '1/2', 'metà'], ['0,25', '1/4', 'un quarto'], ['0,75', '3/4', 'tre quarti'], ['0,1', '1/10', 'un decimo'], ['0,2', '1/5', 'un quinto']];
    const r = pick(D2), others = shuffle(D2.filter(x => x !== r)).slice(0, 2).map(x => x[1]);
    qs.push({ type: 'opts', q: 'Il numero ' + r[0] + ' è uguale a quale frazione?', viz: '', o: [r[1]].concat(others), a: 0, e: r[0] + ' è ' + r[2] + ', cioè ' + r[1] + '.' }); }
  // 6. confronto
  { const same = Math.random() < .5; let a, b;
    if (same) { const n = pick([5, 6, 8]); const k1 = rnd(1, n - 2), k2 = rnd(k1 + 1, n - 1); a = [k1, n]; b = [k2, n]; }
    else { const k = pick([1, 2]); const n1 = pick([3, 4]), n2 = pick([6, 8]); a = [k, n1]; b = [k, n2]; }
    const va = a[0] / a[1], vb = b[0] / b[1];
    const big = va > vb ? a : b;
    qs.push({ type: 'opts', q: 'Quale frazione è più grande?', viz: '<div class="row center" style="gap:16px">' + pizzaSVG(a[1], a[0], { size: 150 }) + pizzaSVG(b[1], b[0], { size: 150 }) + '</div>',
      o: [big[0] + '/' + big[1], (big === a ? b : a)[0] + '/' + (big === a ? b : a)[1]], a: 0,
      e: same ? 'Le fette sono grandi uguali: vince chi ne ha di più.' : 'Con lo stesso numero di fette colorate, vince la pizza divisa in meno parti: le fette sono più grandi!' }); }
  qs.push(idq());
  { const n = pick([4, 5, 10]), T = n * rnd(3, 9); qs.push({ type: 'key', q: '🍬 Hai ' + T + ' caramelle e ne mangi 1/' + n + '. Quante ne mangi?', ans: T / n, unit: '', e: '1/' + n + ' di ' + T + ' si trova dividendo: ' + T + ' : ' + n + ' = ' + (T / n) + '.' }); }
  return qs;
}
function mathFraz(p, m) {
  p.innerHTML = '<div class="row between"><h3>🍕 Pizze e sconti</h3>' + sayBtn('Pizze e sconti. Frazioni, numeri con la virgola e percentuali, con pizze e cartellini dei saldi.') + '</div>' +
    '<p class="how">Frazioni, numeri con la virgola e percentuali, con pizze da colorare e cartellini dei saldi. 8 domande.</p>' +
    '<div class="row" style="margin-top:12px"><button type="button" class="btn" id="f-go" style="--bc:' + m.c + '">Inforna la prima pizza!</button></div><div class="m-stage"></div>';
  $('f-go').addEventListener('click', () => { $('f-go').closest('.row').hidden = true; run(); });
  function run() {
    const qs = fracQuestions(); let i = 0, right = 0;
    const stage = p.querySelector('.m-stage');
    function show() {
      if (i >= qs.length) {
        endCard(p, right === qs.length ? 'Tutte giuste, ' + NAME + '! 🍕' : right + ' su ' + qs.length + '!', ['Sei una vera pizzaiola delle frazioni. 💪', '+6 🔥 per ' + D.name], () => mathFraz(p, m), m.c);
        mathFinished('fraz', stage, 6); return;
      }
      const q = qs[i]; let tried = false;
      stage.innerHTML = '<div class="quiz" style="margin-top:14px"><div class="qn">Domanda ' + (i + 1) + ' di ' + qs.length + '</div>' +
        '<div class="qt"><span>' + esc(q.q) + '</span>' + sayBtn(q.q) + '</div><div class="progress" style="--gc:' + m.c + '"><i style="width:' + (i / qs.length * 100) + '%"></i></div>' +
        '<div class="viz" id="f-viz">' + (q.viz || '') + '</div><div id="f-in"></div><div id="f-fb"></div></div>';
      const fb = $('f-fb');
      const result = (ok, el) => { progMark(ok);
        if (ok) { right++; ding(); cheer(el); gain(2, el); }
        else { oops(); cheer(el, pick(TRY), true); if (!tried) gain(1, el); }
        tried = true;
        fb.innerHTML = '<div class="explain"><b>' + (ok ? 'Giusto! ' : 'Guarda: ') + '</b>' + esc(q.e) + '<div class="row" style="margin-top:10px">' + sayBtn(q.e) + '</div></div>';
        const nb = nextBtn(m.c, () => { i++; show(); }); fb.querySelector('.row').appendChild(nb); nb.focus();
      };
      if (q.type === 'opts') {
        const box = $('f-in'); box.className = 'opts';
        shuffle(q.o.map((o, k) => [o, k])).forEach(([o, k]) => {
          const b = document.createElement('button'); b.type = 'button'; b.className = 'opt'; b.textContent = o; b.style.textAlign = 'center'; b.style.fontSize = '24px';
          b.addEventListener('click', () => { box.querySelectorAll('.opt').forEach(x => { x.disabled = true; if (x.textContent === q.o[q.a]) x.classList.add('right'); }); if (k !== q.a) b.classList.add('wrong'); result(k === q.a, b); });
          box.appendChild(b);
        });
      } else if (q.type === 'key') {
        makeKeypad($('f-in'), (v, api) => { api.lock(); const ok = v === q.ans; api.mark(ok); if (!ok) q.e = 'La risposta è ' + q.ans + (q.unit ? ' ' + q.unit : '') + '. ' + q.e; result(ok, $('f-in').querySelector('.display')); }, { unit: q.unit });
      } else if (q.type === 'color') {
        const sel = new Set();
        const viz = $('f-viz');
        const draw = () => {
          viz.innerHTML = pizzaSVG(q.n, sel, { tap: true, size: 260 });
          viz.querySelectorAll('path[data-i]').forEach(pth => {
            const t = () => { const k = +pth.dataset.i; sel.has(k) ? sel.delete(k) : sel.add(k); tone(500 + sel.size * 40, .06); draw(); $('f-count').textContent = sel.size + '/' + q.n; };
            pth.addEventListener('click', t);
            pth.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); t(); } });
          });
        };
        draw();
        $('f-in').innerHTML = '<div class="row center" style="margin-top:10px"><span class="pill">Con pomodoro: <span id="f-count">0/' + q.n + '</span></span><button type="button" class="btn" id="f-check" style="--bc:' + m.c + '">Controlla</button></div>';
        $('f-check').addEventListener('click', () => {
          const ok = sel.size === q.k;
          if (!ok && !tried) { tried = true; oops(); gain(1, $('f-check')); fb.innerHTML = '<div class="explain">Hai messo il pomodoro su ' + sel.size + ' fette. Ne servono ' + q.k + ' su ' + q.n + '. Riprova!</div>'; return; }
          $('f-check').disabled = true; viz.querySelectorAll('path').forEach(pth => pth.style.pointerEvents = 'none');
          result(ok, $('f-check'));
        });
      }
    }
    show();
  }
}

/* ---------- Problemi detective ---------- */
function makeProblem() {
  const T = [
    () => { const t = 3 * rnd(4, 12), x = t / 3; return { ic: '🃏', text: CHI + ' ha ' + t + ' figurine. Ne regala un terzo alla sua amica. Quante figurine le restano?', ans: t - x, unit: 'figurine',
      steps: ['Cosa sai? Ha ' + t + ' figurine e ne regala 1/3.', 'Un terzo di ' + t + ' è ' + t + ' : 3 = ' + x + '.', 'Le restano ' + t + ' − ' + x + ' = ' + (t - x) + '.'] }; },
    () => { const k = rnd(2, 5), n = rnd(4, 8), mm = rnd(1, n - 1); return { ic: '🍪', text: 'Mamma compra ' + k + ' pacchetti da ' + n + ' biscotti. A merenda ' + CHI + ' ne mangia ' + mm + '. Quanti biscotti restano?', ans: k * n - mm, unit: 'biscotti',
      steps: ['Prima trova quanti biscotti ci sono in tutto.', k + ' × ' + n + ' = ' + (k * n) + ' biscotti.', 'Poi togli quelli mangiati: ' + (k * n) + ' − ' + mm + ' = ' + (k * n - mm) + '.'] }; },
    () => { const a = rnd(3, 15), b = rnd(2, 5), w = rnd(3, 6); return { ic: '🐷', text: 'Nel salvadanaio ' + CHI + ' ha ' + a + ' €. Ogni settimana aggiunge ' + b + ' €. Quanti euro avrà dopo ' + w + ' settimane?', ans: a + b * w, unit: '€',
      steps: ['Quanto aggiunge in tutto? ' + b + ' € per ' + w + ' settimane.', b + ' × ' + w + ' = ' + (b * w) + ' €.', 'Aggiungi quelli che aveva già: ' + a + ' + ' + (b * w) + ' = ' + (a + b * w) + ' €.'] }; },
    () => { let g = rnd(12, 30); if (g % 8 === 0) g++; const q = Math.floor(g / 8), r = g % 8; return { ic: '🎂', text: 'Alla festa di compleanno di ' + CHI + ' vengono ' + g + ' persone. Ogni torta ha 8 fette. Quante torte servono perché tutti abbiano una fetta?', ans: q + 1, unit: 'torte',
      steps: ['Dividi le persone per le fette di una torta: ' + g + ' : 8.', g + ' : 8 = ' + q + ' con il resto di ' + r + '.', 'Avanzano ' + r + ' persone senza torta: serve un’altra torta! ' + q + ' + 1 = ' + (q + 1) + '.'] }; },
    () => { const giro = rnd(2, 4), n = rnd(2, 5); return { ic: '🚲', text: 'Al Parco del Valentino, a Torino, un giro in bici è lungo ' + giro + ' km. ' + CHI + ' fa ' + n + ' giri. Quanti km percorre?', ans: giro * n, unit: 'km',
      steps: ['Ogni giro è ' + giro + ' km e i giri sono ' + n + '.', 'Quando una cosa si ripete, si moltiplica.', giro + ' × ' + n + ' = ' + (giro * n) + ' km.'] }; },
    () => { const l = rnd(3, 9), w = rnd(2, 6); return { ic: '🥕', text: 'L’orto dei nonni è un rettangolo lungo ' + l + ' m e largo ' + w + ' m. Quanti metri di rete servono per recintarlo tutto intorno?', ans: 2 * (l + w), unit: 'm',
      steps: ['Tutto intorno vuol dire il perimetro: la somma di tutti i lati.', 'Il rettangolo ha 2 lati da ' + l + ' m e 2 lati da ' + w + ' m.', l + ' + ' + w + ' + ' + l + ' + ' + w + ' = ' + (2 * (l + w)) + ' m.'] }; },
    () => { const pz = 10 * rnd(2, 8); return { ic: '🏷️', text: 'Un gioco costa ' + pz + ' €. Oggi c’è lo sconto del 50%. Quanto costa il gioco scontato?', ans: pz / 2, unit: '€',
      steps: ['Sconto del 50% vuol dire che togli metà del prezzo.', 'Metà di ' + pz + ' è ' + pz + ' : 2 = ' + (pz / 2) + '.', 'Il gioco costa ' + pz + ' − ' + (pz / 2) + ' = ' + (pz / 2) + ' €.'] }; },
    () => { const f = rnd(3, 6), each = rnd(3, 9), t = f * each; return { ic: '🍬', text: CHI + ' ha ' + t + ' caramelle e le divide in parti uguali tra ' + f + ' amiche. Quante caramelle riceve ognuna?', ans: each, unit: 'caramelle',
      steps: ['In parti uguali vuol dire dividere.', t + ' : ' + f + ' = ?', 'Pensa alla tabellina del ' + f + ': ' + f + ' × ' + each + ' = ' + t + ', quindi ' + each + '.'] }; },
    () => { const tot = 50, done = 5 * rnd(3, 8); return { ic: '⛸️', text: 'La lezione di pattinaggio dura ' + tot + ' minuti. ' + CHI + ' ha già pattinato per ' + done + ' minuti. Quanti minuti mancano alla fine?', ans: tot - done, unit: 'minuti',
      steps: ['Quanto dura tutta la lezione? ' + tot + ' minuti.', 'Quanti minuti sono già passati? ' + done + '.', 'Mancano ' + tot + ' − ' + done + ' = ' + (tot - done) + ' minuti.'] }; },
    () => { const n = rnd(2, 8); return { ic: '🏊‍♀️', text: 'In una piscina lunga 25 metri ' + CHI + ' nuota ' + n + ' vasche. Quanti metri nuota in tutto?', ans: 25 * n, unit: 'm',
      steps: ['Ogni vasca è lunga 25 metri.', 'Le vasche sono ' + n + ': si moltiplica.', '25 × ' + n + ' = ' + (25 * n) + ' metri.'] }; },
    () => { const t = rnd(2, 4), k = rnd(2, 4), g = t * k; return { ic: '🎪', text: 'Alla lezione di ginnastica aerea ci sono ' + g + ' bambine e ' + t + ' tessuti. Se si dividono in gruppi uguali, quante bambine ci sono per ogni tessuto?', ans: k, unit: 'bambine',
      steps: ['Gruppi uguali: si divide.', g + ' : ' + t + ' = ?', 'Perché ' + t + ' × ' + k + ' = ' + g + ': ' + k + ' bambine per tessuto.'] }; },
    () => { const x = rnd(1, 3), q = rnd(2, 3); return { ic: '🧃', text: CHI + ' compra ' + q + ' succhi di frutta da ' + x + ' € l’uno e paga con una banconota da 10 €. Quanto resto riceve?', ans: 10 - q * x, unit: '€',
      steps: ['Prima trova quanto spende: ' + q + ' × ' + x + ' = ' + (q * x) + ' €.', 'Il resto è quello che avanza da 10 €.', '10 − ' + (q * x) + ' = ' + (10 - q * x) + ' €.'] }; },
    () => { const x = rnd(4, 9), d = rnd(3, 7); return { ic: '📖', text: 'Il libro della sera ha ' + (x * d) + ' pagine. ' + CHI + ' ne legge ' + x + ' ogni sera. In quante sere finisce il libro?', ans: d, unit: 'sere',
      steps: ['Quante volte ' + x + ' pagine stanno in ' + (x * d) + ' pagine?', (x * d) + ' : ' + x + ' = ?', 'Perché ' + x + ' × ' + d + ' = ' + (x * d) + ': ' + d + ' sere.'] }; }
  ];
  return T;
}
function mathProb(p, m) {
  p.innerHTML = '<div class="row between"><h3>🕵️‍♀️ Problemi detective</h3>' + sayBtn('Problemi detective. Leggi la storia, trova gli indizi e scrivi il risultato. Se ti blocchi, chiedi un aiutino!') + '</div>' +
    '<p class="how">Leggi la storia come una detective: cosa sai? cosa ti chiede? Se ti blocchi, chiedi un aiutino. 5 casi da risolvere.</p>' +
    '<div class="row" style="margin-top:12px"><button type="button" class="btn" id="p-go" style="--bc:' + m.c + '">Apri il primo caso!</button></div><div class="m-stage"></div>';
  $('p-go').addEventListener('click', () => { $('p-go').closest('.row').hidden = true; run(); });
  function run() {
    const all = makeProblem();
    const gens = drawDeck('prob', all.length, 5).map(i => all[i]());
    let i = 0, solved = 0;
    const stage = p.querySelector('.m-stage');
    function show() {
      if (i >= gens.length) {
        endCard(p, 'Casi risolti: ' + solved + ' su ' + gens.length + '! 🕵️‍♀️', ['Una detective vera non si arrende mai. 💪', '+6 🔥 per ' + D.name], () => mathProb(p, m), m.c);
        mathFinished('prob', stage, 6); return;
      }
      const q = gens[i]; let hints = 0, tries = 0;
      stage.innerHTML = '<div class="quiz" style="margin-top:14px"><div class="qn">Caso ' + (i + 1) + ' di ' + gens.length + '</div>' +
        '<div class="progress" style="--gc:' + m.c + '"><i style="width:' + (i / gens.length * 100) + '%"></i></div>' +
        '<div class="qt" style="margin-top:12px"><span style="font-size:44px;flex:none" aria-hidden="true">' + q.ic + '</span><span>' + esc(q.text) + '</span>' + sayBtn(q.text) + '</div>' +
        '<div class="row" style="margin-top:12px"><button type="button" class="btn small" id="p-hint" style="--bc:var(--c3);--bs:var(--c3-soft);color:#33304a">💡 Aiutino (' + q.steps.length + ')</button></div>' +
        '<div class="hintbox" id="p-hints" hidden><ol></ol></div><div id="p-kp"></div><div id="p-fb"></div></div>';
      const addHint = () => {
        if (hints >= q.steps.length) return;
        $('p-hints').hidden = false;
        const li = document.createElement('li'); li.textContent = q.steps[hints]; $('p-hints').querySelector('ol').appendChild(li);
        hints++; $('p-hint').textContent = hints < q.steps.length ? '💡 Un altro aiutino (' + (q.steps.length - hints) + ')' : '💡 Aiutini finiti';
        if (hints >= q.steps.length) $('p-hint').disabled = true;
      };
      $('p-hint').addEventListener('click', addHint);
      const kp = makeKeypad($('p-kp'), (v, api) => {
        const fb = $('p-fb');
        if (v === q.ans) {
          api.lock(); api.mark(true); solved++; ding(); cheer($('p-kp').querySelector('.display'), hints ? 'Caso risolto!' : 'Detective geniale!'); gain(3, $('p-kp'));
          fb.innerHTML = '<div class="explain"><b>Giusto: ' + q.ans + ' ' + esc(q.unit) + '!</b> ' + esc(q.steps[q.steps.length - 1]) + '<div class="row" style="margin-top:10px"></div></div>';
          const nb = nextBtn(m.c, () => { i++; show(); }); fb.querySelector('.row').appendChild(nb); nb.focus();
        } else {
          tries++; api.mark(false); oops();
          if (tries === 1) { gain(1, $('p-kp')); fb.innerHTML = '<div class="explain"><b>Non ancora!</b> Rileggi la storia con calma. Prova con un aiutino 💡</div>'; later(() => api.clear(), 900); addHint(); }
          else {
            api.lock();
            while (hints < q.steps.length) addHint();
            fb.innerHTML = '<div class="explain"><b>La soluzione è ' + q.ans + ' ' + esc(q.unit) + '.</b> Leggi gli aiutini: ora sai come si fa! ' + esc(pick(TRY)) + '<div class="row" style="margin-top:10px"></div></div>';
            const nb = nextBtn(m.c, () => { i++; show(); }); fb.querySelector('.row').appendChild(nb); nb.focus();
          }
        }
      }, { unit: q.unit });
    }
    show();
  }
}

/* ---------- Costruisci figure: aree, perimetri, poligoni ---------- */
function gridSVG(w, h, opts) {
  opts = opts || {};
  const s = 30, W = 10 * s + 20, H = Math.max(h, opts.minH || 6) * s + 20;
  let g = '';
  for (let x = 0; x <= 10; x++) g += '<line x1="' + (10 + x * s) + '" y1="10" x2="' + (10 + x * s) + '" y2="' + (H - 10) + '" stroke="var(--line)" stroke-width="1.5"/>';
  for (let y = 0; y <= (H - 20) / s; y++) g += '<line x1="10" y1="' + (10 + y * s) + '" x2="' + (W - 10) + '" y2="' + (10 + y * s) + '" stroke="var(--line)" stroke-width="1.5"/>';
  g += '<rect x="10" y="10" width="' + (w * s) + '" height="' + (h * s) + '" fill="' + (opts.fill || 'var(--c4-soft)') + '" stroke="' + (opts.stroke || 'var(--c4)') + '" stroke-width="5" rx="2"/>';
  if (opts.labels) {
    g += '<text x="' + (10 + w * s / 2) + '" y="' + (10 + h * s + 0) + '" dy="-8" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="800" font-size="16" fill="var(--ink)">' + w + '</text>';
    g += '<text x="' + (10 + 8) + '" y="' + (10 + h * s / 2) + '" dy="5" font-family="Nunito,sans-serif" font-weight="800" font-size="16" fill="var(--ink)">' + h + '</text>';
  }
  return '<svg viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" style="max-width:100%;height:auto" role="img" aria-label="Rettangolo di ' + w + ' per ' + h + ' quadretti">' + g + '</svg>';
}
const SHAPES = [
  ['triangolo', 3, '100,20 180,170 20,170'],
  ['quadrato', 4, '35,35 165,35 165,165 35,165'],
  ['rettangolo', 4, '15,55 185,55 185,145 15,145'],
  ['pentagono', 5, '100,15 185,78 152,178 48,178 15,78'],
  ['esagono', 6, '55,20 145,20 190,100 145,180 55,180 10,100'],
  ['rombo', 4, '100,10 180,100 100,190 20,100']
];
function mathGeo(p, m) {
  p.innerHTML = '<div class="row between"><h3>📐 Costruisci figure</h3>' + sayBtn('Costruisci figure. Conta i quadretti per trovare l’area, gira intorno per il perimetro, e costruisci rettangoli con i tasti più e meno.') + '</div>' +
    '<p class="how">Area = quanti quadretti ci sono dentro. Perimetro = quanto è lungo il contorno. Ogni lato di quadretto vale 1. 6 sfide.</p>' +
    '<div class="row" style="margin-top:12px"><button type="button" class="btn" id="ge-go" style="--bc:' + m.c + '">Prendi il righello!</button></div><div class="m-stage"></div>';
  $('ge-go').addEventListener('click', () => { $('ge-go').closest('.row').hidden = true; run(); });
  function run() {
    const plan = shuffle(['area', 'perim', 'build', 'shape']).concat(shuffle(['area', 'build']));
    let i = 0, right = 0;
    const stage = p.querySelector('.m-stage');
    function show() {
      if (i >= plan.length) {
        endCard(p, right + ' su ' + plan.length + ', architetta ' + NAME + '! 📐', ['Le figure non hanno più segreti. 💪', '+6 🔥 per ' + D.name], () => mathGeo(p, m), m.c);
        mathFinished('geo', stage, 6); return;
      }
      const t = plan[i];
      stage.innerHTML = '<div class="quiz" style="margin-top:14px"><div class="qn">Sfida ' + (i + 1) + ' di ' + plan.length + '</div>' +
        '<div class="progress" style="--gc:' + m.c + '"><i style="width:' + (i / plan.length * 100) + '%"></i></div><div id="ge-q"></div><div id="ge-fb"></div></div>';
      const q = $('ge-q'), fb = $('ge-fb');
      const done = (ok, el, text) => { progMark(ok);
        if (ok) { right++; ding(); cheer(el); gain(2, el); } else { oops(); cheer(el, pick(TRY), true); gain(1, el); }
        fb.innerHTML = '<div class="explain"><b>' + (ok ? 'Giusto! ' : '') + '</b>' + esc(text) + '<div class="row" style="margin-top:10px">' + sayBtn(text) + '</div></div>';
        const nb = nextBtn(m.c, () => { i++; show(); }); fb.querySelector('.row').appendChild(nb); nb.focus();
      };
      if (t === 'area' || t === 'perim') {
        const w = rnd(2, 7), h = rnd(2, 5), ans = t === 'area' ? w * h : 2 * (w + h);
        const txt = t === 'area' ? 'Quanti quadretti ci sono dentro il rettangolo? (Area)' : 'Quanto è lungo il contorno del rettangolo? (Perimetro)';
        q.innerHTML = '<div class="qt"><span>' + esc(txt) + '</span>' + sayBtn(txt) + '</div><div class="viz">' + gridSVG(w, h, { labels: true }) + '</div><div id="ge-kp"></div>';
        makeKeypad($('ge-kp'), (v, api) => {
          api.lock(); const ok = v === ans; api.mark(ok);
          done(ok, $('ge-kp').querySelector('.display'), t === 'area'
            ? 'Area = base × altezza = ' + w + ' × ' + h + ' = ' + ans + ' quadretti.'
            : 'Perimetro = ' + w + ' + ' + h + ' + ' + w + ' + ' + h + ' = ' + ans + '. Trucco: (' + w + ' + ' + h + ') × 2.');
        }, { unit: t === 'area' ? 'quadretti' : 'lati' });
      } else if (t === 'build') {
        const A = pick([6, 8, 10, 12, 15, 16, 18, 20, 24]);
        let w = 1, h = 1;
        const txt = 'Costruisci un rettangolo con area ' + A + ' quadretti!';
        q.innerHTML = '<div class="qt"><span>' + esc(txt) + '</span>' + sayBtn(txt) + '</div><div class="viz" id="ge-viz"></div>' +
          '<div class="row center" style="margin-top:10px;gap:18px">' +
          '<div class="row"><span style="font-weight:800">Base</span><button type="button" class="key" style="width:56px;height:56px" id="w-" aria-label="Base meno uno">−</button><b id="w-v" style="font-size:26px;min-width:28px;text-align:center">1</b><button type="button" class="key" style="width:56px;height:56px" id="w+" aria-label="Base più uno">+</button></div>' +
          '<div class="row"><span style="font-weight:800">Altezza</span><button type="button" class="key" style="width:56px;height:56px" id="h-" aria-label="Altezza meno uno">−</button><b id="h-v" style="font-size:26px;min-width:28px;text-align:center">1</b><button type="button" class="key" style="width:56px;height:56px" id="h+" aria-label="Altezza più uno">+</button></div></div>' +
          '<div class="row center" style="margin-top:12px"><span class="pill" id="ge-now">Area: 1</span><button type="button" class="btn" id="ge-check" style="--bc:' + m.c + '">Controlla</button></div>';
        const draw = () => { $('ge-viz').innerHTML = gridSVG(w, h, { labels: true, minH: 6, fill: w * h === A ? 'var(--leaf-soft)' : 'var(--c4-soft)', stroke: w * h === A ? 'var(--leaf)' : 'var(--c4)' }); $('w-v').textContent = w; $('h-v').textContent = h; $('ge-now').textContent = 'Area: ' + w + ' × ' + h + ' = ' + (w * h); };
        [['w-', () => w = Math.max(1, w - 1)], ['w+', () => w = Math.min(10, w + 1)], ['h-', () => h = Math.max(1, h - 1)], ['h+', () => h = Math.min(6, h + 1)]]
          .forEach(([id, f]) => $(id).addEventListener('click', () => { f(); tone(480, .05); draw(); }));
        draw();
        let tried = false;
        $('ge-check').addEventListener('click', () => {
          const ok = w * h === A;
          if (!ok && !tried) { tried = true; oops(); gain(1, $('ge-check')); fb.innerHTML = '<div class="explain">Il tuo rettangolo ha ' + (w * h) + ' quadretti, ne servono ' + A + '. Pensa alle tabelline: quale conto fa ' + A + '?</div>'; return; }
          $('ge-check').disabled = true;
          const pairs = []; for (let a = 1; a <= 10; a++) if (A % a === 0 && A / a <= 6) pairs.push(a + ' × ' + (A / a));
          done(ok, $('ge-check'), (ok ? 'Hai costruito ' + w + ' × ' + h + ' = ' + A + '. ' : '') + 'Rettangoli con area ' + A + ' che stanno nella griglia: ' + pairs.join(', ') + '.');
        });
      } else {
        const sh = pick(SHAPES);
        const txt = 'Come si chiama questa figura?';
        q.innerHTML = '<div class="qt"><span>' + txt + '</span>' + sayBtn(txt) + '</div><div class="viz"><svg viewBox="0 0 200 200" width="200" height="200" role="img" aria-label="Una figura geometrica"><polygon points="' + sh[2] + '" fill="var(--c6-soft)" stroke="var(--c6)" stroke-width="6" stroke-linejoin="round"/></svg></div><div class="opts" id="ge-o"></div>';
        const others = shuffle(SHAPES.filter(x => x[0] !== sh[0])).slice(0, 2).map(x => x[0]);
        shuffle([sh[0]].concat(others)).forEach(o => {
          const b = document.createElement('button'); b.type = 'button'; b.className = 'opt'; b.textContent = o; b.style.textAlign = 'center';
          b.addEventListener('click', () => {
            $('ge-o').querySelectorAll('.opt').forEach(x => { x.disabled = true; if (x.textContent === sh[0]) x.classList.add('right'); });
            if (o !== sh[0]) b.classList.add('wrong');
            done(o === sh[0], b, 'È un ' + sh[0] + ': ha ' + sh[1] + ' lati.' + (sh[0] === 'quadrato' ? ' Tutti uguali e tutti gli angoli retti!' : sh[0] === 'rombo' ? ' Ha i lati tutti uguali, e in questo rombo gli angoli non sono retti.' : ''));
          });
          $('ge-o').appendChild(b);
        });
      }
    }
    show();
  }
}
