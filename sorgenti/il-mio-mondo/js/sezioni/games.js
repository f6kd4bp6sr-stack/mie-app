/* ================= GIOCHI ================= */
const JOKES = [
  ['Qual è il colmo per una pattinatrice?', 'Rompere il ghiaccio con tutti! ⛸️'],
  ['Perché il libro di matematica è sempre triste?', 'Perché ha troppi problemi! 📘'],
  ['Qual è il colmo per un pianista?', 'Avere una scala e non riuscire a salirci! 🎹'],
  ['Che cosa dice un muro a un altro muro?', 'Ci vediamo all’angolo! 🧱'],
  ['Perché i pesci sono così bravi a scuola?', 'Perché stanno sempre in banco! 🐟'],
  ['Qual è il colmo per un sarto?', 'Perdere il filo del discorso! 🧵'],
  ['Maestra: «Pierino, perché sei in ritardo?»', '«Perché c’era un cartello: Scuola, rallentare!» 🚸'],
  ['Perché lo scheletro non litiga mai con nessuno?', 'Perché non ha il fegato! 💀'],
  ['Qual è il colmo per un fornaio?', 'Avere una figlia che è un pezzo di pane! 🍞'],
  ['Qual è il colmo per un giardiniere?', 'Piantare in asso gli amici! 🌱'],
  ['Qual è il colmo per un drago?', 'Avere un fuoco di paglia! Il tuo invece è un fuoco che dura, perché ti alleni ogni giorno 🐉'],
  ['Qual è il colmo per un orologiaio?', 'Non avere mai tempo per niente! ⏰'],
  ['Qual è il colmo per una cuoca?', 'Non avere sale in zucca! 🧂'],
  ['Qual è il colmo per un astronauta?', 'Avere sempre la testa fra le nuvole! 🚀'],
  ['Qual è il colmo per un matematico?', 'Avere i giorni contati! 🔢'],
  ['Qual è il colmo per un elettricista?', 'Non essere al corrente! 💡'],
  ['Qual è il colmo per un idraulico?', 'Non capire un tubo! 🔧'],
  ['Qual è il colmo per un pittore?', 'Passare una notte in bianco! 🎨'],
  ['Qual è il colmo per un\u2019acrobata?', 'Essere sempre appesa a un filo! 🎪'],
  ['Qual è il colmo per una nuotatrice?', 'Fare un tuffo nel passato! 🏊\u200d♀️'],
  ['Qual è il colmo per un musicista?', 'Prendere una nota… dalla maestra! 🎼'],
  ['Qual è il colmo per un dentista?', 'Avere il dente avvelenato! 🦷']
];
function jokeReward(game, detail, el) {
  const unlocked = store.get('jokes', []);
  let idx = JOKES.findIndex((_, i) => !unlocked.includes(i));
  if (idx === -1) idx = drawDeck('jokes', JOKES.length, 1)[0]; else { unlocked.push(idx); store.set('jokes', unlocked); }
  const done = store.get('games-done', {}); done[game] = (done[game] || 0) + 1; store.set('games-done', done);
  markDay('giochi', el);
  const j = JOKES[idx];
  openModal('<div class="big">' + pick(['Bravissima, ' + NAME + '!', 'Che campionessa!', 'Evviva, ' + NAME + '!', 'Grandissima!']) + '</div>' +
    '<p>' + esc(detail) + '</p><p style="font-size:22px">+5 🔥 per ' + esc(D.name) + '</p>' +
    '<div class="jk"><div class="jk-label">Barzelletta sbloccata</div><div class="jk-q"><span>' + esc(j[0]) + '</span>' + sayBtn(j[0]) + '</div><div class="jk-a" id="jk-a" hidden>' + esc(j[1]) + '</div>' + (j[2] ? '<div id="jk-w" hidden style="margin-top:10px;font-weight:700">💡 ' + esc(j[2]) + '</div>' : '') + '</div>' +
    '<div class="row"><button type="button" class="btn" id="jk-show" data-focus style="--bc:var(--c5);--bs:var(--c5-soft)">Scopri la risposta</button><button type="button" class="btn ghost" id="jk-x">Chiudi</button></div>');
  $('jk-show').addEventListener('click', () => { if (!$('jk-a').hidden && $('jk-w')) { $('jk-w').hidden = false; $('jk-show').hidden = true; Voice.ok && Voice.say(j[2]); return; } $('jk-a').hidden = false; if ($('jk-w')) $('jk-show').textContent = 'Perché fa ridere? 🤔'; else $('jk-show').hidden = true; tone(523.25, .2); tone(659.25, .3, .12); Voice.ok && Voice.say(j[1]); });
  $('jk-x').addEventListener('click', () => { closeModal(); if (current === 'giochi') renderBook(); });
  confetti(window.innerWidth / 2, window.innerHeight / 3, 30); fanfare();
  gain(5, el); activityDone();
}
function renderBook() {
  const ul = $('g-jokes'); if (!ul) return;
  const unlocked = store.get('jokes', []);
  ul.innerHTML = '';
  unlocked.forEach(i => {
    const li = document.createElement('li'); li.className = 'joke';
    li.innerHTML = '<div class="jt"><div class="q">' + esc(JOKES[i][0]) + '</div><div class="a">' + esc(JOKES[i][1]) + '</div>' + (JOKES[i][2] ? '<details style="margin-top:6px"><summary style="font-weight:800;cursor:pointer">Perché fa ridere? 🤔</summary><div style="font-weight:700;margin-top:4px">' + esc(JOKES[i][2]) + '</div></details>' : '') + '</div>' + sayBtn(JOKES[i][0] + ' ' + JOKES[i][1]);
    ul.appendChild(li);
  });
  const left = JOKES.length - unlocked.length;
  if (left > 0) {
    const li = document.createElement('li'); li.className = 'joke locked';
    li.textContent = '🔒 Ancora ' + left + (left === 1 ? ' barzelletta nascosta' : ' barzellette nascoste') + ': finisci un gioco per scoprirne una!';
    ul.appendChild(li);
  }
}

const GAMES = [
  { id: 'cuoca', ic: '👩‍🍳', name: 'La cuoca pasticciona', sk: 'Memoria · ordine', c: 'var(--c2)', s: 'var(--c2-soft)' },
  { id: 'simon', ic: '🎵', name: 'Segui la musica', sk: 'Memoria · ascolto', c: 'var(--c6)', s: 'var(--c6-soft)' },
  { id: 'gone', ic: '🔍', name: 'Cosa è sparito?', sk: 'Osservazione', c: 'var(--c4)', s: 'var(--c4-soft)' },
  { id: 'colors', ic: '🎨', name: 'Colori pazzi', sk: 'Concentrazione', c: 'var(--c1)', s: 'var(--c1-soft)' },
  { id: 'diff', ic: '👀', name: 'Aguzza la vista', sk: 'Trova le differenze', c: 'var(--c5)', s: 'var(--c5-soft)' }
];
let gameSel = 'cuoca';
let gameTimers = [];
const later = (fn, ms) => { const t = setTimeout(fn, ms); gameTimers.push(t); return t; };
function clearGameTimers() { gameTimers.forEach(clearTimeout); gameTimers = []; }

PAGES.giochi = el => {
  clearGameTimers();
  const done = store.get('games-done', {});
  el.innerHTML = '<h1 class="page-title rainbow">La palestra del cervello</h1>' +
    '<p class="page-sub">Giochi brevi per allenare memoria e concentrazione. Ogni gioco finito sblocca una barzelletta!</p>' +
    '<div class="sec"><div id="g-tiles"></div></div><div id="g-panel"></div>' +
    '<div class="sec">' + secHead('😂', 'Il libro delle barzellette di ' + CHI, 'Raccontale a mamma e papà!', 'var(--c5-soft)') + '<ul class="jokes" id="g-jokes"></ul></div>';
  renderTiles($('g-tiles'), GAMES.map(g => ({ ...g, ok: done[g.id] ? '✓ fatto ' + done[g.id] + (done[g.id] === 1 ? ' volta' : ' volte') : '' })), gameSel, id => { gameSel = id; PAGES.giochi(el); });
  const g = GAMES.find(x => x.id === gameSel);
  const p = $('g-panel');
  p.className = 'panel'; p.style.setProperty('--gc', g.c); p.style.setProperty('--gs', g.s);
  ({ cuoca: gameCuoca, simon: gameSimon, gone: gameGone, colors: gameColors, diff: gameDiff })[gameSel](p, g);
  renderBook();
};

/* ---------- La cuoca pasticciona ---------- */
const INGR = [['🍅', 'pomodoro'], ['🧀', 'mozzarella'], ['🍄', 'funghi'], ['🥓', 'prosciutto'], ['🌿', 'basilico'], ['🫒', 'olive'], ['🥚', 'uovo'], ['🌭', 'würstel']];
const CUSTOMERS = [['🧒', 'Luca'], ['👵', 'Nonna Pina'], ['🐶', 'Il cane Birillo'], ['🤖', 'Il robot Bip'], ['🧙‍♀️', 'La maga Ortensia'], ['👨‍🚀', 'L’astronauta Leo'], ['🦁', 'Il leone Tito'], ['👸', 'La principessa Mela'], ['🐉', null]];
function gameCuoca(p, g) {
  let level = store.get('cuoca-level', 3);
  let served = 0, starsTot = 0, order = [], pos = 0, errs = 0, slotErr = 0, phase = 'idle', replayed = false, cust = null, queue = [];
  const SERVICE = 5;
  p.innerHTML = '<div class="row between"><h3>👩‍🍳 La cuoca pasticciona</h3>' + sayBtn('La cuoca pasticciona. Il cliente ti dice gli ingredienti della sua pizza, uno alla volta. Ricordali e mettili sulla pizza nello stesso ordine!') + '</div>' +
    '<p class="how">Ogni cliente ordina una pizza speciale: guarda bene gli ingredienti, uno alla volta. Poi mettili sulla pizza <b>nello stesso ordine</b>!</p>' +
    '<div class="row" style="margin-top:12px"><span style="font-weight:800">Livello:</span><div class="chips" id="ck-lv" style="margin:0"></div></div>' +
    '<div class="row between" style="margin-top:12px"><span class="pill">Cliente <span id="ck-n">0</span>/' + SERVICE + '</span><span class="pill">⭐ <span id="ck-s">0</span></span>' +
    '<button type="button" class="btn" id="ck-start">Apri il ristorante!</button></div>' +
    '<div class="kitchen"><div class="customer"><div class="face" id="ck-face">👩‍🍳</div><div class="cname" id="ck-name">Pizzeria di ' + esc(CHI) + '</div>' +
    '<div class="order-bubble" id="ck-bubble"><span class="dish">Tocca «Apri il ristorante!»</span></div>' +
    '<button type="button" class="btn small ghost" id="ck-replay" style="margin-top:10px" hidden>👀 Riguarda l’ordine (1 volta)</button></div>' +
    '<div><div class="pantry" id="ck-pantry"></div><div class="plate" id="ck-plate" aria-live="polite"><span style="font-size:15px;font-weight:800;color:var(--ink-soft)">La pizza è qui 🍕</span></div>' +
    '<p class="msg" id="ck-msg" aria-live="polite"></p></div></div>';
  const lv = $('ck-lv');
  [[3, 'Facile'], [4, 'Media'], [5, 'Chef']].forEach(([n, t]) => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'chip'; b.textContent = t + ' (' + n + ')';
    b.setAttribute('aria-pressed', n === level ? 'true' : 'false');
    b.addEventListener('click', () => { if (phase !== 'idle' && phase !== 'end') return; level = n; store.set('cuoca-level', n); lv.querySelectorAll('.chip').forEach(x => x.setAttribute('aria-pressed', x === b ? 'true' : 'false')); });
    lv.appendChild(b);
  });
  const pantry = $('ck-pantry');
  INGR.forEach((it, k) => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'ingr'; b.disabled = true;
    b.innerHTML = '<span aria-hidden="true">' + it[0] + '</span><small>' + it[1] + '</small>'; b.dataset.k = k;
    b.setAttribute('aria-label', it[1]);
    b.addEventListener('click', () => tap(k, b));
    pantry.appendChild(b);
  });
  const setPantry = on => pantry.querySelectorAll('.ingr').forEach(b => { b.disabled = !on; b.style.boxShadow = ''; });
  function start() {
    audio(); clearGameTimers();
    served = 0; starsTot = 0; $('ck-n').textContent = 0; $('ck-s').textContent = 0;
    queue = shuffle(CUSTOMERS.slice(0, 8));
    $('ck-start').textContent = 'Ricomincia';
    nextCustomer();
  }
  function nextCustomer() {
    served++; $('ck-n').textContent = served;
    cust = queue[(served - 1) % queue.length];
    const count = Math.min(7, level + Math.floor((served - 1) / 2));
    order = []; while (order.length < count) { const k = rnd(0, INGR.length - 1); if (order[order.length - 1] !== k) order.push(k); }
    pos = 0; errs = 0; slotErr = 0; replayed = false;
    $('ck-face').textContent = cust[0]; $('ck-name').textContent = cust[1];
    $('ck-plate').innerHTML = '<span style="font-size:15px;font-weight:800;color:var(--ink-soft)">La pizza è qui 🍕</span>';
    $('ck-msg').textContent = 'Guarda bene l’ordine!';
    $('ck-replay').hidden = true;
    showOrder();
  }
  function showOrder() {
    phase = 'show'; setPantry(false);
    const bub = $('ck-bubble');
    bub.innerHTML = '<span class="dish">«Vorrei una pizza con…»</span>';
    const step = 1100;
    order.forEach((k, i) => later(() => {
      bub.innerHTML = '<div><div class="show">' + INGR[k][0] + '</div><div class="dish">' + (i + 1) + '. ' + INGR[k][1] + '</div></div>';
      tone(392 + i * 60, .18);
    }, 700 + i * step));
    later(() => {
      bub.innerHTML = '<span class="dish">«…grazie, cuoca!» 🤫<br>Ora tocca a te!</span>';
      phase = 'cook'; setPantry(true);
      $('ck-msg').textContent = 'Metti ' + order.length + ' ingredienti nell’ordine giusto.';
      if (!replayed) $('ck-replay').hidden = false;
    }, 700 + order.length * step);
  }
  function tap(k, b) {
    if (phase !== 'cook') return;
    if (k === order[pos]) {
      pos++; slotErr = 0; tone(523 + pos * 40, .1);
      const plate = $('ck-plate');
      if (pos === 1) plate.innerHTML = '';
      const s = document.createElement('span'); s.textContent = INGR[k][0]; plate.appendChild(s);
      pantry.querySelectorAll('.ingr').forEach(x => x.style.boxShadow = '');
      if (pos === order.length) serve();
    } else {
      errs++; slotErr++; oops();
      b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake');
      if (slotErr >= 2) {
        const good = pantry.querySelector('[data-k="' + order[pos] + '"]');
        good.style.boxShadow = '0 0 0 5px var(--c3)';
        $('ck-msg').textContent = 'Aiutino: ora ci va quello che brilla! ✨';
      } else $('ck-msg').textContent = pick(['Mmm… non era quello. Riprova!', 'Quasi! Ripensa all’ordine.', 'Ops, pasticcio! Riprova!']);
    }
  }
  function serve() {
    phase = 'wait'; setPantry(false); $('ck-replay').hidden = true;
    const st = errs === 0 ? 3 : errs <= 2 ? 2 : 1;
    starsTot += st; $('ck-s').textContent = starsTot;
    const react = st === 3 ? ['😋', 'Squisita! Proprio come la volevo!'] : st === 2 ? ['😊', 'Buonissima, grazie!'] : ['😄', 'Un po’ pasticciata, ma buona!'];
    $('ck-face').textContent = react[0];
    $('ck-bubble').innerHTML = '<div><div class="stars5">' + '⭐'.repeat(st) + '</div><div class="dish">«' + react[1] + '»</div></div>';
    $('ck-msg').textContent = '';
    cheer($('ck-plate'), st === 3 ? praise() : pick(TRY), st < 3); ding();
    gain(st === 3 ? 3 : 2, $('ck-plate'));
    later(() => {
      if (served < SERVICE) nextCustomer();
      else {
        phase = 'end';
        $('ck-face').textContent = '👩‍🍳'; $('ck-name').textContent = 'Pizzeria di ' + CHI;
        $('ck-bubble').innerHTML = '<span class="dish">Servizio finito! ' + starsTot + ' ⭐ su ' + (SERVICE * 3) + '</span>';
        if (starsTot >= 13 && level < 5) { $('ck-msg').textContent = 'Sei pronta per il livello successivo!'; }
        jokeReward('cuoca', 'Hai servito ' + SERVICE + ' clienti e guadagnato ' + starsTot + ' stelle!', $('ck-plate'));
      }
    }, 2200);
  }
  $('ck-start').addEventListener('click', start);
  $('ck-replay').addEventListener('click', () => { if (phase !== 'cook' || replayed) return; replayed = true; $('ck-replay').hidden = true; pos = 0; $('ck-plate').innerHTML = ''; showOrder(); });
}

/* ---------- Segui la musica ---------- */
function gameSimon(p) {
  const NOTES = [261.63, 329.63, 392.00, 523.25];
  p.innerHTML = '<div class="row between"><h3>🎵 Segui la musica</h3>' + sayBtn('Segui la musica. Ascolta le note che si accendono e ripetile nello stesso ordine. Arriva al livello 5!') + '</div>' +
    '<p class="how">Ascolta e guarda le note che si accendono, poi ripetile nello stesso ordine. A ogni giro se ne aggiunge una. Arriva al livello 5!</p>' +
    '<div class="row between" style="margin-top:12px"><span class="pill">Livello <span id="s-level">0</span></span><span class="pill">Record <span id="s-best">0</span></span><button type="button" class="btn" id="s-start">Inizia</button></div>' +
    '<div class="sgrid">' + [['var(--c1)', 'var(--c1-soft)', '♪', 'rosa, Do'], ['var(--c3)', 'var(--c3-soft)', '♫', 'gialla, Mi'], ['var(--c4)', 'var(--c4-soft)', '♩', 'verde, Sol'], ['var(--c5)', 'var(--c5-soft)', '♬', 'azzurra, Do alto']]
      .map((x, i) => '<button type="button" class="pad" data-i="' + i + '" aria-label="Nota ' + x[3] + '" style="--pad:' + x[0] + ';--pad-soft:' + x[1] + '" disabled>' + x[2] + '</button>').join('') + '</div>' +
    '<p class="msg" id="s-msg" aria-live="polite">Alza il volume e tocca Inizia!</p>';
  const pads = Array.from(p.querySelectorAll('.pad'));
  let seq = [], posi = 0, busy = false, rewarded = false, cont = false, best = store.get('simon-best', 0);
  $('s-best').textContent = best;
  const light = (i, ms) => { pads[i].classList.add('lit'); tone(NOTES[i], ms / 1000); later(() => pads[i].classList.remove('lit'), ms); };
  function play() {
    busy = true; pads.forEach(x => x.disabled = true); $('s-msg').textContent = 'Ascolta bene…';
    const gap = Math.max(380, 650 - seq.length * 30);
    seq.forEach((n, k) => later(() => light(n, gap - 150), 600 + k * gap));
    later(() => { busy = false; posi = 0; pads.forEach(x => x.disabled = false); $('s-msg').textContent = 'Tocca a te!'; }, 600 + seq.length * gap);
  }
  function next() { seq.push(rnd(0, 3)); $('s-level').textContent = seq.length; play(); }
  $('s-start').addEventListener('click', () => {
    audio();
    if (cont) { cont = false; $('s-start').textContent = 'Ricomincia'; next(); return; }
    clearGameTimers(); seq = []; rewarded = false; $('s-start').textContent = 'Ricomincia'; next();
  });
  pads.forEach(pd => pd.addEventListener('click', () => {
    if (busy || !seq.length) return;
    const i = +pd.dataset.i; light(i, 260);
    if (i !== seq[posi]) {
      pads.forEach(x => x.disabled = true);
      const reached = seq.length - 1;
      $('s-msg').textContent = 'Oops! Sei arrivata al livello ' + reached + '. Ogni tentativo allena la memoria: riprova!';
      oops(); if (reached > 0) gain(1, pd);
      seq = []; cont = false; $('s-start').textContent = 'Ricomincia';
      return;
    }
    posi++;
    if (posi === seq.length) {
      if (seq.length > best) { best = seq.length; store.set('simon-best', best); $('s-best').textContent = best; }
      pads.forEach(x => x.disabled = true); cheer(pd); gain(1, pd);
      if (seq.length === 5 && !rewarded) {
        rewarded = true; cont = true; $('s-start').textContent = 'Continua';
        $('s-msg').textContent = 'Livello 5! Tocca Continua per battere il tuo record.';
        later(() => jokeReward('simon', 'Hai ricordato 5 note di fila!', pd), 700);
      } else later(next, 900);
    }
  }));
}

/* ---------- Cosa è sparito? ---------- */
function gameGone(p) {
  const POOL = ['🍎', '🚲', '⚽', '🎈', '🐶', '🌟', '🍦', '🚀', '🎸', '🐸', '🌻', '🍕', '🧸', '🎩', '🐠', '🍪', '⛸️', '🦋', '🐢', '🍓', '🎁', '🦄', '🐧', '🍉', '🎨', '🪁', '🦊', '🍩', '🐞', '🎺', '🌈', '🐬'];
  p.innerHTML = '<div class="row between"><h3>🔍 Cosa è sparito?</h3>' + sayBtn('Cosa è sparito? Guarda bene gli oggetti finché la barra finisce. Poi uno sparisce: indovina quale!') + '</div>' +
    '<p class="how">Guarda bene gli oggetti finché la barra finisce. Poi uno sparisce: indovina quale!</p>' +
    '<div class="row between" style="margin-top:12px"><span class="pill">Giro <span id="go-r">0</span>/3</span><span class="pill">Indovinati <span id="go-s">0</span></span><button type="button" class="btn" id="go-start">Inizia</button></div>' +
    '<div class="timer" id="go-t" hidden><i id="go-bar"></i></div><div class="obgrid" id="go-ob"></div><div class="choices" id="go-ch"></div><p class="msg" id="go-msg" aria-live="polite"></p>';
  let round = 0, score = 0, shown = [], missing = null, busy = false;
  function next() {
    round++; $('go-r').textContent = round; $('go-msg').textContent = 'Guarda bene e ricorda!'; $('go-ch').innerHTML = '';
    shown = shuffle(POOL).slice(0, 4 + round);
    $('go-ob').innerHTML = shown.map(o => '<div class="ob">' + o + '</div>').join('');
    const secs = 6; $('go-t').hidden = false;
    const bar = $('go-bar'); bar.style.transition = 'none'; bar.style.width = '100%'; void bar.offsetWidth;
    bar.style.transition = 'width ' + secs + 's linear'; bar.style.width = '0%';
    busy = true; later(hide, secs * 1000);
  }
  function hide() {
    $('go-t').hidden = true;
    const k = rnd(0, shown.length - 1); missing = shown[k];
    $('go-ob').innerHTML = shuffle(shown.filter((_, i) => i !== k)).map(o => '<div class="ob">' + o + '</div>').join('') + '<div class="ob gone">?</div>';
    $('go-msg').textContent = 'Quale oggetto è sparito?';
    const ch = $('go-ch'); ch.innerHTML = '';
    shuffle(shuffle(POOL.filter(o => !shown.includes(o))).slice(0, 3).concat([missing])).forEach(o => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'choice'; b.textContent = o;
      b.addEventListener('click', () => choose(b, o)); ch.appendChild(b);
    });
    busy = false;
  }
  function choose(b, o) {
    if (busy) return; busy = true;
    $('go-ch').querySelectorAll('.choice').forEach(x => { x.disabled = true; if (x.textContent === missing) x.classList.add('right'); });
    if (o === missing) { score++; $('go-s').textContent = score; cheer(b); ding(); gain(2, b); $('go-msg').textContent = 'Esatto, era proprio ' + missing + '!'; }
    else { b.classList.add('wrong'); oops(); gain(1, b); $('go-msg').textContent = 'Quasi! Era ' + missing + '. Al prossimo giro!'; }
    later(() => {
      if (round < 3) next();
      else { $('go-msg').textContent = 'Hai indovinato ' + score + ' su 3. Tocca Ricomincia per giocare ancora!'; jokeReward('gone', 'Hai indovinato ' + score + ' oggetti su 3!', b); }
    }, 1600);
  }
  $('go-start').addEventListener('click', () => { audio(); clearGameTimers(); round = 0; score = 0; $('go-s').textContent = 0; $('go-start').textContent = 'Ricomincia'; next(); });
}

/* ---------- Colori pazzi ---------- */
function gameColors(p) {
  const COLORS = [{ n: 'ROSSO', v: 'var(--ink-red)' }, { n: 'BLU', v: 'var(--ink-blue)' }, { n: 'VERDE', v: 'var(--ink-green)' }, { n: 'VIOLA', v: 'var(--ink-purple)' }];
  p.innerHTML = '<div class="row between"><h3>🎨 Colori pazzi</h3>' + sayBtn('Colori pazzi. Attenta al trucco! Tocca il colore con cui è scritta la parola, non quello che dice.') + '</div>' +
    '<p class="how">Attenta al trucco! Tocca il <b>colore</b> con cui è scritta la parola, non quello che dice.</p>' +
    '<div class="row between" style="margin-top:12px"><span class="pill">Parola <span id="cp-r">0</span>/10</span><span class="pill">Giuste <span id="cp-s">0</span></span><button type="button" class="btn" id="cp-start">Inizia</button></div>' +
    '<div class="word" id="cp-w" aria-live="polite"></div><div class="cgrid" id="cp-b"></div><p class="msg" id="cp-msg" aria-live="polite"></p>';
  let r = 0, s = 0, ink = -1, on = false;
  const box = $('cp-b');
  COLORS.forEach((c, i) => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'cbtn'; b.style.setProperty('--sw', c.v);
    b.innerHTML = '<span aria-hidden="true"></span>' + c.n.toLowerCase(); b.setAttribute('aria-label', 'Colore ' + c.n.toLowerCase());
    b.addEventListener('click', () => choose(b, i)); box.appendChild(b);
  });
  function next() {
    r++; $('cp-r').textContent = r;
    const w = rnd(0, 3); let k = rnd(0, 3);
    if (Math.random() < 0.75) while (k === w) k = rnd(0, 3);
    ink = k; const el = $('cp-w'); el.textContent = COLORS[w].n; el.style.color = COLORS[k].v;
    $('cp-msg').textContent = 'Di che colore è scritta?'; on = true;
  }
  function choose(b, i) {
    if (!on) return; on = false;
    if (i === ink) { s++; $('cp-s').textContent = s; b.classList.add('flash-ok'); cheer(b); tone(659.25, .12); gain(1, b); }
    else { b.classList.add('flash-no'); oops(); $('cp-msg').textContent = 'Era ' + COLORS[ink].n.toLowerCase() + '! Guarda il colore, non la parola.'; }
    later(() => {
      b.classList.remove('flash-ok', 'flash-no');
      if (r < 10) next();
      else { $('cp-w').textContent = ''; $('cp-msg').textContent = s + ' giuste su 10! Tocca Ricomincia per riprovare.'; jokeReward('colors', s + ' risposte giuste su 10!', b); }
    }, i === ink ? 700 : 1500);
  }
  $('cp-start').addEventListener('click', () => { audio(); clearGameTimers(); r = 0; s = 0; $('cp-s').textContent = 0; $('cp-start').textContent = 'Ricomincia'; next(); });
}
