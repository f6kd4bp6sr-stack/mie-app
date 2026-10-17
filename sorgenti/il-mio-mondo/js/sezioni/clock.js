/* ================= L'OROLOGIO: lancette, trucchi e giochi ================= */
MATH.push({ id: 'ore', ic: '🕐', name: 'L’orologio', sk: 'Lancette e ore', c: 'var(--c5)', s: 'var(--c5-soft)' });

/* ---------- numeri e frasi in italiano ---------- */
const NUM_IT = (() => {
  const u = ['', 'uno', 'due', 'tre', 'quattro', 'cinque', 'sei', 'sette', 'otto', 'nove', 'dieci', 'undici', 'dodici', 'tredici', 'quattordici', 'quindici', 'sedici', 'diciassette', 'diciotto', 'diciannove'];
  const t = ['', '', 'venti', 'trenta', 'quaranta', 'cinquanta'];
  return n => {
    if (n < 20) return u[n];
    const d = Math.floor(n / 10), r = n % 10;
    let w = t[d];
    if (r === 1 || r === 8) w = w.slice(0, -1);
    return w + (r === 3 ? 'tré' : u[r]);
  };
})();
const ORA_IT = h => h === 1 ? 'l’una' : 'le ' + NUM_IT(h);
function clockWords(h24, m, withDay) {
  const h = h24 % 12 || 12, next = h % 12 + 1;
  const isUna = x => x === 1;
  const sono = x => isUna(x) ? 'È ' : 'Sono ';
  const day = !withDay ? '' : h24 === 12 && m === 0 ? '' : h24 === 0 && m === 0 ? '' : h24 < 5 ? ' di notte' : h24 < 12 ? ' di mattina' : h24 < 18 ? ' del pomeriggio' : h24 < 22 ? ' di sera' : ' di notte';
  if (withDay && (h24 === 12 || h24 === 0) && m < 45) {
    const base = 'È ' + (h24 === 12 ? 'mezzogiorno' : 'mezzanotte');
    return { main: base + (m === 0 ? '' : m === 15 ? ' e un quarto' : m === 30 ? ' e mezza' : ' e ' + NUM_IT(m)), alt: m >= 35 ? 'oppure l’una meno ' + NUM_IT(60 - m) : '' };
  }
  if (m === 0) return { main: sono(h) + ORA_IT(h) + ' in punto' + day, alt: '' };
  if (m === 15) return { main: sono(h) + ORA_IT(h) + ' e un quarto' + day, alt: '' };
  if (m === 30) return { main: sono(h) + ORA_IT(h) + ' e mezza' + day, alt: '' };
  if (m === 45) return { main: sono(next) + ORA_IT(next) + ' meno un quarto' + day, alt: 'oppure ' + ORA_IT(h) + ' e quarantacinque' };
  const main = sono(h) + ORA_IT(h) + ' e ' + NUM_IT(m) + day;
  return { main, alt: m >= 35 ? 'oppure ' + ORA_IT(next) + ' meno ' + NUM_IT(60 - m) : '' };
}
const pad2 = n => (n < 10 ? '0' : '') + n;
const digital = (h, m) => h + ':' + pad2(m);

/* ---------- disegno del quadrante ---------- */
function clockSVG(h24, m, o) {
  o = o || {};
  const cx = 110, cy = 110, R = 100;
  const pt = (deg, r) => [cx + r * Math.sin(deg * Math.PI / 180), cy - r * Math.cos(deg * Math.PI / 180)];
  let s = '<svg viewBox="0 0 220 220" class="clk' + (o.cls ? ' ' + o.cls : '') + '" role="img" aria-label="Orologio che segna ' + digital(h24 % 12 || 12, m) + '">';
  s += '<circle cx="110" cy="110" r="104" fill="var(--c5-soft)"/><circle cx="110" cy="110" r="' + R + '" fill="var(--surface)" stroke="var(--ink)" stroke-width="4"/>';
  if (o.slices) {
    const cols = ['var(--c3-soft)', 'var(--c4-soft)', 'var(--c1-soft)', 'var(--c6-soft)'];
    for (let q = 0; q < 4; q++) {
      const a = pt(q * 90, R - 3), b = pt(q * 90 + 90, R - 3);
      s += '<path d="M110 110 L' + a[0].toFixed(1) + ' ' + a[1].toFixed(1) + ' A' + (R - 3) + ' ' + (R - 3) + ' 0 0 1 ' + b[0].toFixed(1) + ' ' + b[1].toFixed(1) + ' Z" fill="' + cols[q] + '"/>';
    }
  }
  for (let i = 0; i < 60; i++) {
    const big = i % 5 === 0, a = pt(i * 6, R - 3), b = pt(i * 6, R - (big ? 13 : 7));
    s += '<line x1="' + a[0].toFixed(1) + '" y1="' + a[1].toFixed(1) + '" x2="' + b[0].toFixed(1) + '" y2="' + b[1].toFixed(1) + '" stroke="var(--ink)" stroke-width="' + (big ? 3 : 1.4) + '" stroke-linecap="round"/>';
  }
  for (let n = 1; n <= 12; n++) {
    const p = pt(n * 30, R - 30);
    s += '<text x="' + p[0].toFixed(1) + '" y="' + (p[1] + 8).toFixed(1) + '" text-anchor="middle" font-size="22" font-weight="800" fill="var(--ink)" font-family="var(--font-display)">' + n + '</text>';
  }
  if (o.mins) for (let n = 1; n <= 12; n++) {
    const p = pt(n * 30, R - 52);
    s += '<text x="' + p[0].toFixed(1) + '" y="' + (p[1] + 4).toFixed(1) + '" text-anchor="middle" font-size="11" font-weight="800" fill="var(--c5)">' + pad2((n * 5) % 60) + '</text>';
  }
  const ha = ((h24 % 12) + m / 60) * 30, ma = m * 6;
  const hp = pt(ha, 52), mp = pt(ma, 82);
  s += '<line x1="110" y1="110" x2="' + hp[0].toFixed(1) + '" y2="' + hp[1].toFixed(1) + '" stroke="var(--c1)" stroke-width="10" stroke-linecap="round" class="h-hour"/>';
  s += '<line x1="110" y1="110" x2="' + mp[0].toFixed(1) + '" y2="' + mp[1].toFixed(1) + '" stroke="var(--c5)" stroke-width="6" stroke-linecap="round" class="h-min"/>';
  if (o.sec !== undefined) { const sp = pt(o.sec * 6, 88); s += '<line x1="110" y1="110" x2="' + sp[0].toFixed(1) + '" y2="' + sp[1].toFixed(1) + '" stroke="var(--c2)" stroke-width="2" stroke-linecap="round"/>'; }
  s += '<circle cx="110" cy="110" r="7" fill="var(--ink)"/><circle cx="110" cy="110" r="3" fill="var(--surface)"/></svg>';
  return s;
}

const CLOCK_TIPS = [
  ['🩷 Corta = ore, lunga = minuti', 'La lancetta <b>corta</b> (rosa) segna le <b>ore</b>: «ore» è una parola corta! La lancetta <b>lunga</b> (azzurra) segna i <b>minuti</b>: «minuti» è una parola lunga.'],
  ['🖐️ La tabellina del 5', 'Ogni numero vale <b>5 minuti</b> per la lancetta lunga. Lunga sul 4? 4 × 5 = <b>20 minuti</b>. Sul 9? 9 × 5 = <b>45</b>. Conosci la tabellina del 5: conosci già i minuti!'],
  ['🍕 La pizza dell’orologio', 'Dividi il quadrante in 4 fette: lunga sul <b>12</b> = in punto, sul <b>3</b> = e un quarto (15), sul <b>6</b> = e mezza (30), sul <b>9</b> = meno un quarto (45).'],
  ['↻ Si gira sempre verso destra', 'Le lancette girano in <b>senso orario</b>: dal 12 verso l’1, il 2, il 3… come quando leggi una pagina da sinistra a destra in alto.'],
  ['👣 La corta è lenta', 'Se la lancetta corta è <b>tra due numeri</b>, l’ora è quella del numero che ha <b>appena superato</b>. Tra il 4 e il 5? Sono le 4 e qualcosa. Tra il 12 e l’1? Sono le 12 e qualcosa.'],
  ['🏃 La lunga è veloce', 'In un’ora la lunga fa un <b>giro intero</b> (60 minuti) e la corta avanza di <b>un solo numero</b>. Una gara tra una lepre e una tartaruga!'],
  ['➖ Il trucco del «meno»', 'Dopo la mezza puoi contare <b>quanto manca</b> all’ora dopo. Lunga sull’8 = 40 minuti: mancano 20 alle 5 → «le 4 e 40» oppure «le 5 meno 20».'],
  ['📏 Le tacchette', 'Tra un numero e l’altro ci sono <b>5 tacchette</b>: ognuna è <b>1 minuto</b>. Lunga due tacchette dopo il 3? 15 + 2 = <b>17 minuti</b>.'],
  ['🌞🌙 Le 24 ore', 'Il giorno ha <b>24 ore</b> e la corta fa <b>2 giri</b>: uno di mattina e uno dal pomeriggio alla notte. Dopo mezzogiorno <b>aggiungi 12</b>: le 3 del pomeriggio sono le <b>15</b>.'],
  ['⏱️ Quanto dura?', '<b>60 secondi</b> = 1 minuto · <b>60 minuti</b> = 1 ora · <b>mezz’ora</b> = 30 minuti · <b>un quarto d’ora</b> = 15 minuti.']
];

/* ---------- pannello ---------- */
let clockLive = 0;
function mathOre(p, m) {
  const lvl = store.get('clock-level', 1);
  p.innerHTML = '<div class="row between"><h3>🕐 L’orologio</h3>' + sayBtn('L’orologio. La lancetta corta segna le ore, quella lunga i minuti. Ogni numero vale cinque minuti per la lancetta lunga.') + '</div>' +
    '<p class="how">Impara a leggere le lancette con i trucchi, gioca a spostarle e mettiti alla prova. Livello attuale: <b id="ck-lvl">' + lvl + '</b> di 4.</p>' +
    '<div class="clk-grid"><div class="card clk-live"><div class="cu-l">⏰ Adesso</div><div id="ck-now"></div><div id="ck-now-t" class="ck-say"></div></div>' +
    '<div class="card"><div class="cu-l">🤹 Gioca con le lancette</div><div class="ck-hint">Trascina la lancetta lunga (o la corta) con il dito.</div><div id="ck-play"></div><div id="ck-play-t" class="ck-say"></div>' +
      '<div class="row center ck-btns"><button type="button" class="btn small ghost" data-ck="-60">−1 ora</button><button type="button" class="btn small ghost" data-ck="-5">−5 min</button><button type="button" class="btn small ghost" data-ck="5">+5 min</button><button type="button" class="btn small ghost" data-ck="60">+1 ora</button></div>' +
      '<div class="row center ck-btns"><button type="button" class="cu-chip" id="ck-mins" aria-pressed="true">Mostra i minuti</button><button type="button" class="cu-chip" id="ck-slices" aria-pressed="false">🍕 Mostra le fette</button></div></div></div>' +
    '<h4>💡 I trucchi per leggere l’ora a prima vista</h4><div class="tips" id="ck-tips"></div>' +
    '<h4>🎮 Giochi dell’orologio</h4><div id="ck-games"></div><div class="m-stage" id="ck-stage"></div>';
  // trucchi
  $('ck-tips').innerHTML = CLOCK_TIPS.map(t => '<div class="tip"><div class="tip-t">' + t[0] + '</div><div>' + t[1] + '</div><div style="margin-top:6px">' + sayBtn(t[0].replace(/^\S+\s/, '') + '. ' + t[1].replace(/<[^>]+>/g, '')) + '</div></div>').join('');
  // orologio vero
  const tick = () => { const el = $('ck-now'); if (!el) { clearInterval(clockLive); return; } const d = new Date(); el.innerHTML = clockSVG(d.getHours(), d.getMinutes(), { sec: d.getSeconds(), cls: 'big' }); const w = clockWords(d.getHours(), d.getMinutes(), true); $('ck-now-t').innerHTML = '<b>' + esc(w.main) + '</b><div class="ck-dig">' + pad2(d.getHours()) + ':' + pad2(d.getMinutes()) + '</div>'; };
  clearInterval(clockLive); tick(); clockLive = setInterval(tick, 1000);
  // orologio da manipolare
  let T = 3 * 60 + 15, opt = { mins: true, slices: false };
  const draw = () => {
    T = ((T % 720) + 720) % 720;
    const h = Math.floor(T / 60) || 12, mm = T % 60;
    $('ck-play').innerHTML = clockSVG(h, mm, Object.assign({ cls: 'big drag' }, opt));
    const w = clockWords(h, mm, false);
    $('ck-play-t').innerHTML = '<b>' + esc(w.main) + '</b>' + (w.alt ? '<div class="ck-alt">' + esc(w.alt) + '</div>' : '') + '<div class="ck-dig">' + digital(h, mm) + '</div>';
  };
  draw();
  p.querySelectorAll('[data-ck]').forEach(b => b.addEventListener('click', () => { T += +b.dataset.ck; draw(); tock(); }));
  $('ck-mins').addEventListener('click', e => { opt.mins = !opt.mins; e.target.setAttribute('aria-pressed', opt.mins); draw(); });
  $('ck-slices').addEventListener('click', e => { opt.slices = !opt.slices; e.target.setAttribute('aria-pressed', opt.slices); draw(); });
  dragClock($('ck-play'), () => T, v => { T = v; draw(); }, 1);
  // giochi
  const GAMES = [
    { id: 'read', ic: '🕵️', name: 'Che ore sono?', sk: 'Leggi le lancette', c: 'var(--c5)', s: 'var(--c5-soft)' },
    { id: 'set', ic: '🎯', name: 'Sposta le lancette', sk: 'Metti l’ora giusta', c: 'var(--c1)', s: 'var(--c1-soft)' },
    { id: 'dur', ic: '⏳', name: 'Quanto tempo passa?', sk: 'Dall’inizio alla fine', c: 'var(--c4)', s: 'var(--c4-soft)' },
    { id: 'day', ic: '🌙', name: 'Mattina o pomeriggio?', sk: 'Le 24 ore', c: 'var(--c6)', s: 'var(--c6-soft)' }
  ];
  renderTiles($('ck-games'), GAMES, null, id => clockGame(id, $('ck-stage'), m));
}
function tock() { try { tone(1400, 0.03, 0, 'square'); } catch (e) {} }

/* trascinare le lancette: la lunga muove i minuti (e la corta la segue), la corta muove le ore */
function dragClock(box, getT, setT, step) {
  let mode = null, last = null;
  const ang = ev => {
    const svg = box.querySelector('svg'); const r = svg.getBoundingClientRect();
    const x = (ev.clientX - r.left) / r.width * 220 - 110, y = (ev.clientY - r.top) / r.height * 220 - 110;
    return { a: (Math.atan2(x, -y) * 180 / Math.PI + 360) % 360, d: Math.hypot(x, y) };
  };
  box.addEventListener('pointerdown', ev => {
    const g = ang(ev), T = getT(), ha = ((Math.floor(T / 60) % 12) + (T % 60) / 60) * 30, ma = (T % 60) * 6;
    const diff = (a, b) => Math.min(Math.abs(a - b), 360 - Math.abs(a - b));
    mode = g.d < 62 && diff(g.a, ha) < diff(g.a, ma) ? 'h' : 'm';
    last = T % 60; box.setPointerCapture(ev.pointerId); move(ev); ev.preventDefault();
  });
  const move = ev => {
    if (!mode) return;
    const g = ang(ev); let T = getT();
    if (mode === 'm') {
      let mm = Math.round(g.a / 6 / step) * step % 60;
      let h = Math.floor(T / 60);
      if (last > 45 && mm < 15) h++; else if (last < 15 && mm > 45) h--;
      if (mm !== last) tock();
      last = mm; setT(h * 60 + mm);
    } else {
      const h = Math.floor(g.a / 30) % 12;
      if (h !== Math.floor(T / 60) % 12) tock();
      setT(h * 60 + (T % 60));
    }
  };
  box.addEventListener('pointermove', move);
  const end = () => { mode = null; };
  box.addEventListener('pointerup', end); box.addEventListener('pointercancel', end);
}

/* ---------- generatori delle domande ---------- */
const rndi = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
function randTime(lvl) {
  const h = rndi(1, 12);
  const m = lvl === 1 ? [0, 30][rndi(0, 1)] : lvl === 2 ? [0, 15, 30, 45][rndi(0, 3)] : lvl === 3 ? rndi(0, 11) * 5 : rndi(0, 59);
  return [h, m];
}
const tlabel = (h, m) => digital(h, m) + ' · ' + clockWords(h, m, false).main.replace(/^(Sono|È) /, '');
function explainRead(h, m) {
  const corta = m === 0 ? 'La corta è proprio sul ' + h : 'La corta ha appena superato il ' + h;
  const lunga = m === 0 ? 'la lunga è sul 12: in punto' : m % 5 === 0 ? 'la lunga è sul ' + (m / 5) + ': ' + (m / 5) + ' × 5 = ' + m + ' minuti' : 'la lunga è ' + (m % 5) + (m % 5 === 1 ? ' tacchetta' : ' tacchette') + ' dopo il ' + (Math.floor(m / 5) || 12) + ': ' + (Math.floor(m / 5) * 5) + ' + ' + (m % 5) + ' = ' + m + ' minuti';
  return corta + ', ' + lunga + '.';
}
function qRead(lvl) {
  const [h, m] = randTime(lvl);
  const ok = digital(h, m);
  const c = new Set([ok]);
  const swapH = m % 5 === 0 ? (m / 5 || 12) : null, swapM = (h % 12) * 5;
  const cands = [];
  if (swapH && swapH !== h) cands.push([swapH, swapM]);
  cands.push([h % 12 + 1, m], [(h + 10) % 12 + 1, m], [h, (60 - m) % 60], [h, (m + 30) % 60]);
  const opts = [[h, m]];
  for (const x of cands) { const s = digital(x[0], x[1]); if (!c.has(s)) { c.add(s); opts.push(x); } if (opts.length === 3) break; }
  return { svg: clockSVG(h, m, { mins: lvl <= 2 }), q: 'Che ore sono?', o: opts.map(x => tlabel(x[0], x[1])), a: 0, e: explainRead(h, m) };
}
function qDur(lvl) {
  const step = lvl <= 2 ? 15 : 5;
  const h = rndi(1, 10), m = rndi(0, 60 / step - 1) * step;
  const durs = lvl <= 2 ? [15, 30, 45, 60, 90] : [10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 75, 90];
  const d = durs[rndi(0, durs.length - 1)];
  const E = h * 60 + m + d, eh = Math.floor(E / 60) % 12 || 12, em = E % 60;
  const fmt = x => x < 60 ? x + ' minuti' : x === 60 ? '1 ora' : '1 ora e ' + (x - 60) + ' minuti';
  const wrong = [...new Set(durs.filter(x => x !== d).sort(() => Math.random() - .5))].slice(0, 2);
  return { svg: '<div class="clk-pair"><div>' + clockSVG(h, m, { mins: true, cls: 'sm' }) + '<b>Inizio</b></div><div class="arrow">→</div><div>' + clockSVG(eh, em, { mins: true, cls: 'sm' }) + '<b>Fine</b></div></div>',
    q: 'Quanto tempo è passato?', o: [fmt(d), fmt(wrong[0]), fmt(wrong[1])], a: 0,
    e: 'Dalle ' + digital(h, m) + ' alle ' + digital(eh, em) + ': ' + (d >= 60 ? 'un giro intero della lancetta lunga è 1 ora' + (d > 60 ? ', più ' + (d - 60) + ' minuti' : '') : 'la lancetta lunga avanza di ' + d + ' minuti, cioè ' + (d / 5) + ' numeri × 5') + '.' };
}
function qDay(lvl) {
  const kinds = [
    () => { const h = rndi(1, 11); return { q: 'Le ' + NUM_IT(h) + ' del pomeriggio sull’orologio digitale sono…', o: [(h + 12) + ':00', pad2(h) + ':00', (h + 10) + ':00'], e: 'Dopo mezzogiorno aggiungi 12: ' + h + ' + 12 = ' + (h + 12) + '.' }; },
    () => { const h = rndi(13, 23), m = [0, 15, 30, 45][rndi(0, 3)]; const w = clockWords(h, m, true).main; return { q: 'Sull’orologio digitale c’è ' + digital(h, m) + '. Come si dice?', o: [w, clockWords(h - 12, m, false).main + ' di mattina', clockWords((h - 11) % 12 || 12, m, false).main + (h < 18 ? ' del pomeriggio' : ' di sera')], e: h + ' − 12 = ' + (h - 12) + ', e dopo mezzogiorno è ' + (h < 18 ? 'pomeriggio' : 'sera') + '.' }; },
    () => { const h = rndi(7, 11); return { q: 'Le ' + digital(h, 0) + ' sono di mattina o di sera?', o: ['Di mattina', 'Di sera', 'Di notte'], e: 'Prima delle 12 è mattina: alle ' + h + ' di solito sei già sveglia!' }; },
    () => ({ q: 'Quante ore ha un giorno intero?', o: ['24', '12', '60'], e: 'La lancetta corta fa 2 giri da 12 ore: 12 + 12 = 24.' }),
    () => ({ q: 'Che ore sono quando le lancette sono tutte e due sul 12, a metà giornata?', o: ['Mezzogiorno', 'Le sei', 'Mezzanotte e mezza'], e: 'Alle 12:00 di giorno è mezzogiorno; alle 00:00 di notte è mezzanotte.' }),
    () => { const h = rndi(1, 9); return { q: 'Quanti minuti ci sono in ' + (h === 1 ? 'un’ora' : NUM_IT(h) + ' ore') + '?', o: [String(h * 60), String(h * 100), String(h * 30)], e: 'Ogni ora ha 60 minuti: ' + h + ' × 60 = ' + h * 60 + '. Il tempo non va a 100!' }; },
    () => ({ q: 'Quanti minuti sono un quarto d’ora?', o: ['15', '25', '4'], e: 'Un quarto della pizza dell’orologio: dal 12 al 3, cioè 3 × 5 = 15 minuti.' }),
    () => ({ q: 'Quanti secondi ci sono in un minuto?', o: ['60', '100', '10'], e: 'La lancetta dei secondi fa un giro intero in 60 secondi: un minuto!' })
  ];
  const k = kinds[rndi(0, kinds.length - 1)]();
  return Object.assign({ svg: '', a: 0 }, k);
}

/* ---------- motore dei giochi ---------- */
function clockGame(id, stage, m) {
  let lvl = store.get('clock-level', 1), i = 0, right = 0, N = 8;
  const titles = { read: '🕵️ Che ore sono?', set: '🎯 Sposta le lancette', dur: '⏳ Quanto tempo passa?', day: '🌙 Mattina o pomeriggio?' };
  stage.scrollIntoView({ behavior: 'smooth', block: 'start' });
  function finish() {
    const good = right >= 7;
    if (good && lvl < 4) { lvl++; store.set('clock-level', lvl); const el = $('ck-lvl'); if (el) el.textContent = lvl; }
    stage.innerHTML = '<div class="quiz" style="text-align:center"><div class="big-q" style="font-size:clamp(28px,5vw,40px)">' + right + ' su ' + N + '!</div>' +
      '<p style="font-weight:800">' + (good ? (lvl > 1 ? '🏆 Bravissima! Ora sei al livello ' + lvl + '.' : '🏆 Bravissima!') : '💪 Ogni giro di lancette ti rende più veloce. Riprova!') + '</p>' +
      '<div class="row center"><button type="button" class="btn" id="ck-again" style="--bc:var(--c5)">Ancora!</button></div></div>';
    $('ck-again').addEventListener('click', () => clockGame(id, stage, m));
    mathFinished('ore', stage, 4 + (good ? 2 : 0));
  }
  function show() {
    if (i >= N) return finish();
    const head = '<div class="quiz"><div class="qn">' + titles[id] + ' · ' + (i + 1) + ' di ' + N + ' · livello ' + lvl + '</div><div class="progress" style="--gc:var(--c5)"><i style="width:' + (i / N * 100) + '%"></i></div>';
    if (id === 'set') return showSet(head);
    const q = id === 'read' ? qRead(lvl) : id === 'dur' ? qDur(lvl) : qDay(lvl);
    const order = shuffle([0, 1, 2]);
    stage.innerHTML = head + '<div class="qt"><span>' + esc(q.q) + '</span>' + sayBtn(q.q) + '</div>' + (q.svg ? '<div class="clk-q">' + q.svg + '</div>' : '') + '<div class="opts"></div><div class="fb"></div></div>';
    const wrap = stage.querySelector('.opts');
    order.forEach(k => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'opt'; b.textContent = q.o[k];
      b.addEventListener('click', () => {
        wrap.querySelectorAll('.opt').forEach(x => { x.disabled = true; if (x.textContent === q.o[0]) x.classList.add('right'); });
        const ok = k === 0;
        if (ok) { right++; ding(); cheer(b); gain(2, b); } else { b.classList.add('wrong'); oops(); cheer(b, pick(TRY), true); gain(1, b); }
        next(ok, q.e, q.o[0]);
      });
      wrap.appendChild(b);
    });
  }
  function next(ok, e, ans) { progMark(ok, 'mate');
    const fb = stage.querySelector('.fb');
    fb.innerHTML = '<div class="explain"><b>' + (ok ? 'Giusto! ' : 'Era: ' + esc(ans) + '. ') + '</b>' + esc(e) + '<div class="row" style="margin-top:10px">' + sayBtn(e) + '<button type="button" class="btn small" style="--bc:var(--c5)">Avanti →</button></div></div>';
    fb.querySelector('.btn').addEventListener('click', () => { i++; show(); });
    fb.querySelector('.btn').focus();
  }
  function showSet(head) {
    const [th, tm] = randTime(Math.min(lvl, 3));
    const w = clockWords(th, tm, false).main.replace(/^(Sono|È) /, '');
    let T = 12 * 60;
    stage.innerHTML = head + '<div class="qt"><span>Metti le lancette su: <b>' + esc(w) + '</b> (' + digital(th, tm) + ')</span>' + sayBtn('Metti le lancette su ' + w) + '</div>' +
      '<div class="clk-q" id="ck-set"></div><div class="ck-say" id="ck-set-t"></div>' +
      '<div class="row center ck-btns"><button type="button" class="btn small ghost" data-s="-60">−1 ora</button><button type="button" class="btn small ghost" data-s="-5">−5</button><button type="button" class="btn small ghost" data-s="5">+5</button><button type="button" class="btn small ghost" data-s="60">+1 ora</button></div>' +
      '<div class="row center" style="margin-top:8px"><button type="button" class="btn" id="ck-check" style="--bc:var(--c1)">Controlla ✓</button></div><div class="fb"></div></div>';
    const draw = () => { T = ((T % 720) + 720) % 720; const h = Math.floor(T / 60) || 12, mm = T % 60; $('ck-set').innerHTML = clockSVG(h, mm, { mins: lvl <= 2, cls: 'big drag' }); $('ck-set-t').innerHTML = '<span class="ck-dig">' + digital(h, mm) + '</span>'; };
    draw();
    dragClock($('ck-set'), () => T, v => { T = v; draw(); }, lvl >= 4 ? 1 : 5);
    stage.querySelectorAll('[data-s]').forEach(b => b.addEventListener('click', () => { T += +b.dataset.s; draw(); tock(); }));
    $('ck-check').addEventListener('click', () => {
      const h = Math.floor(T / 60) || 12, mm = T % 60, ok = h === th && mm === tm;
      $('ck-check').disabled = true; stage.querySelectorAll('[data-s]').forEach(b => b.disabled = true);
      if (ok) { right++; ding(); cheer($('ck-check')); gain(2, $('ck-check')); } else { oops(); cheer($('ck-check'), pick(TRY), true); gain(1, $('ck-check')); $('ck-set').innerHTML = clockSVG(th, tm, { mins: true, cls: 'big' }); $('ck-set-t').innerHTML = '<span class="ck-dig">' + digital(th, tm) + '</span>'; }
      next(ok, ok ? explainRead(th, tm) : 'Guarda l’orologio: ' + explainRead(th, tm), digital(th, tm));
    });
  }
  show();
}
