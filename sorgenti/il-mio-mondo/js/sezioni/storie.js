/* ================= 🌙 RACCONTAMI UNA STORIA =================
   Una libreria di racconti brevi, da leggere («Leggo io») o da ascoltare («Ascolto», con la solita voce dell'app).
   Il libro lo sceglie lei; ogni sera uno è «consigliato» (quello del giorno della settimana). Ogni storia ha il suo
   disegno animato (data/domande/storie-disegni.js): copertina nella libreria e scena nel lettore. I testi stanno in data/storie/raccolta-N.json (STORIE, generato dal build):
   per aggiungere una raccolta basta un file nuovo, senza toccare questo codice.
   La protagonista ha il nome scelto dalla bambina ({N} nei testi): resta solo sull'iPad, nella chiave «storie».
   Sul finale l'avatar sbadiglia, si addormenta e russa; poi la domanda «E tu?», che si può portare nel 📅 Diario.
   Niente stelle, gemme o coriandoli: è il momento calmo della sera.
   Dati sul dispositivo: storie = { n: nome della protagonista, visti: { id: ultimo giorno }, modo, nq: { k: giorno, q: domanda } } */
if (!$('p-storie')) { const sec = document.createElement('section'); sec.id = 'p-storie'; sec.dataset.page = ''; sec.hidden = true; $('main').appendChild(sec); }
HOME_DO.unshift(['storie', '🌙', 'Raccontami una storia']);
const ST_NOMI = ['Bea', 'Nina', 'Luna', 'Mia', 'Zoe', 'Emma'];
const ST_GIORNI = ['', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato', 'domenica'];
let ST = null;             /* storia aperta: { x, mode, P, i, j, play, solo, timer, wd, snore } */
const stState = () => Object.assign({ n: '', visti: {}, modo: 'ascolta' }, store.get('storie', {}));
const stSave = s => store.set('storie', s);
const stTutte = () => (typeof STORIE !== 'undefined' ? STORIE : []).reduce((a, r) => a.concat(r.storie.map(x => Object.assign({ r: r.id }, x))), []);
const stNome = () => stState().n || ST_NOMI[0];
const stTxt = t => String(t).replace(/\{N\}/g, stNome());
const stGiorno = d => ((d || new Date()).getDay() + 6) % 7 + 1;   /* 1 lunedì … 7 domenica */
const stMin = x => Math.max(2, Math.round(x.p.join(' ').split(/\s+/).length / 115));
const stSera = () => { const h = new Date().getHours(); return h >= 18 || h < 5; };
/* la storia consigliata oggi: quella del giorno della settimana. Con più raccolte: prima quella mai sentita, poi a rotazione */
function stOggi() {
  const s = stState(), L = stTutte().filter(x => x.g === stGiorno());
  if (!L.length) return null;
  return L.find(x => s.visti[x.id] === todayIso()) || L.find(x => !s.visti[x.id]) || L[Math.floor(Date.now() / 604800000) % L.length];
}
/* 📝 la domanda «E tu?» dell'ultima storia diventa, per oggi, la domanda di «La mia nota» nel diario (js/sezioni/diario.js) */
function stNotaQ(key) { const q = stState().nq; return q && q.k === key ? q.q : ''; }
const stPet = cls => '<div class="st-pet ' + (cls || '') + '">' + avatarSVG(levelOf(D.energy), D.color) + '<span class="st-zz" aria-hidden="true"><i>z</i><i>z</i><i>Z</i></span></div>';

/* cielo di stelline (posizioni fisse, calcolate una volta): sfondo del lettore, del finale e della testata */
const stCielo = (n, cls) => '<div class="st-sky ' + (cls || '') + '" aria-hidden="true">' + Array.from({ length: n }, (_, k) => { const a = (k * 73 + 11) % 100, b = (k * 37 + 7) % 100, z = 2 + (k * 13) % 4; return '<i style="left:' + a + '%;top:' + b + '%;width:' + z + 'px;height:' + z + 'px;animation-delay:' + ((k * 0.41) % 3).toFixed(2) + 's"></i>'; }).join('') + '<b class="st-cometa"></b></div>';
const stLucciole = n => '<div class="st-lucciole" aria-hidden="true">' + Array.from({ length: n }, (_, k) => '<i style="left:' + ((k * 29 + 9) % 92) + '%;animation-delay:-' + (k * 1.7).toFixed(1) + 's;animation-duration:' + (9 + (k * 3) % 7) + 's"></i>').join('') + '</div>';
/* le raccolte, ognuna con il suo scaffale */
const stRaccolte = () => (typeof STORIE !== 'undefined' ? STORIE : []).map(r => ({ id: r.id, titolo: r.titolo || 'Storie', storie: r.storie.map(x => Object.assign({ r: r.id }, x)) }));
const ST_RIC = { r1: '🌱', r2: '🌍', r3: '✨' };

/* ---------- la pagina: la libreria, dove sceglie lei il racconto ---------- */
const stScena = (id, cls) => { const d = typeof ST_DISEGNI !== 'undefined' && ST_DISEGNI[id]; return d ? '<svg class="sd ' + (cls || '') + '" viewBox="0 0 400 240" aria-hidden="true">' + d.svg + '</svg>' : ''; };
PAGES.storie = el => {
  if (!D) { el.innerHTML = ''; return; }
  const s = stState();
  if (!s.n) return stScegliNome(el);
  const x = stOggi(), T = stTutte(), oggi = todayIso(), n = T.filter(y => s.visti[y.id]).length, asc = s.modo !== 'leggo';
  let kk = 0;
  const libro = y => '<button type="button" class="st-book' + (x && y.id === x.id ? ' oggi' : '') + (s.visti[y.id] ? ' letto' : '') + (y.vera ? ' vera' : '') + '" data-st="' + y.id + '" style="--k:' + (kk++) + '">' +
      '<span class="st-cover">' + (stScena(y.id) || '<span class="st-ci">' + y.ic + '</span>') + '<i class="st-lucido" aria-hidden="true"></i>' + (x && y.id === x.id ? '<i class="st-nastro">' + (s.visti[y.id] === oggi ? '✅ letta oggi' : stSera() ? '⭐ per stasera' : '⭐ per oggi') + '</i>' : s.visti[y.id] ? '<i class="st-nastro ok">✅</i>' : '') + (y.vera ? '<i class="st-vera">storia vera</i>' : '') + '</span>' +
      '<b>' + y.ic + ' ' + esc(stTxt(y.t)) + '</b><small>' + (y.da ? '<span class="st-da">' + esc(y.da) + '</span> · ' : '') + esc(y.tema) + ' · ' + stMin(y) + ' min</small></button>';
  el.innerHTML = '<div class="st-hero">' + stCielo(26, 'hero') + '<span class="st-luna" aria-hidden="true"></span>' + stPet('sveglio') + '<div class="st-hi"><div class="st-kick">🌙 Raccontami una storia</div>' +
    '<h1 class="st-title">La libreria di ' + esc(s.n) + '</h1><p class="st-meta">Scegli un libro: ogni storia dura circa 3 minuti. ' + (n ? 'Ne hai già ' + (n === 1 ? 'aperto 1' : 'aperti ' + n) + ' su ' + T.length + '.' : 'Quale apri per primo?') + '</p>' +
    '<div class="st-modo" role="group" aria-label="Come vuoi la storia"><button type="button" data-m="ascolta" aria-pressed="' + asc + '">🔊 Ascolto</button><button type="button" data-m="leggo" aria-pressed="' + !asc + '">📖 Leggo io</button></div>' +
    '<div class="st-prog" role="img" aria-label="Storie aperte: ' + n + ' su ' + T.length + '">' + T.map(y => '<i class="' + (s.visti[y.id] ? 'on' : '') + '">★</i>').join('') + '</div></div></div>' +
    stRaccolte().map(r => { const m = r.storie.filter(y => s.visti[y.id]).length; return '<section class="st-racc"><h2 class="st-rh"><span>' + (ST_RIC[r.id] || '📚') + ' ' + esc(r.titolo) + '</span><small>' + (m === r.storie.length ? '✅ lette tutte' : m + ' di ' + r.storie.length) + '</small></h2><div class="st-shelf">' + r.storie.map(libro).join('') + '</div></section>'; }).join('') +
    '<p class="st-who">La bambina delle storie si chiama <b>' + esc(s.n) + '</b>. <button type="button" class="btn small ghost" id="st-ren">✏️ Cambia nome</button></p>';
  el.querySelectorAll('[data-st]').forEach(b => b.addEventListener('click', () => { b.classList.add('apre'); setTimeout(() => stOpen(b.dataset.st, stState().modo), reduce ? 0 : 420); }));
  el.querySelectorAll('.st-modo button').forEach(b => b.addEventListener('click', () => { const t = stState(); t.modo = b.dataset.m; stSave(t); el.querySelectorAll('.st-modo button').forEach(c => c.setAttribute('aria-pressed', c === b)); }));
  $('st-ren').addEventListener('click', () => stScegliNome(el, true));
};
/* il nome della protagonista: lo sceglie lei (uno proposto, il suo, oppure inventato) */
function stScegliNome(el, cambia) {
  const s = stState(), mio = childName(), nomi = (mio ? [mio] : []).concat(ST_NOMI.filter(n => n.toLowerCase() !== mio.toLowerCase()));
  el.innerHTML = '<div class="st-hero st-nome">' + stPet('sveglio') + '<div class="st-hi"><div class="st-kick">🌙 Raccontami una storia</div><h1 class="st-title">Come si chiama la bambina delle storie?</h1>' +
    '<p class="st-meta">Ha dieci anni, come te. Il nome sceglilo tu: puoi anche inventarlo.</p><div class="st-nomi">' + nomi.map(n => '<button type="button" class="st-chip" data-n="' + esc(n) + '">' + esc(n) + '</button>').join('') + '</div>' +
    '<div class="st-row"><input type="text" id="st-nin" maxlength="14" placeholder="Un altro nome…" autocomplete="off" autocapitalize="words" value="' + esc(cambia ? s.n : '') + '"><button type="button" class="btn st-b1" id="st-nok">Va bene</button></div></div></div>';
  const ok = n => { n = String(n || '').replace(/[{}<>]/g, '').trim().slice(0, 14); if (!n) { floatText($('st-nok'), 'Scrivi o scegli un nome'); return; } const t = stState(); t.n = n; stSave(t); PAGES.storie(el); };
  el.querySelectorAll('.st-chip').forEach(b => b.addEventListener('click', () => ok(b.dataset.n)));
  $('st-nok').addEventListener('click', () => ok($('st-nin').value));
  $('st-nin').addEventListener('keydown', e => { if (e.key === 'Enter') ok($('st-nin').value); });
}

/* ---------- il lettore ---------- */
/* un paragrafo → frasi (per la voce e per illuminare la frase letta); i pezzetti corti restano attaccati al vicino */
function stSplit(par) {
  const raw = (stTxt(par).match(/[^.!?…]+[.!?…]+[»”"]*\s*|[^.!?…]+$/g) || [stTxt(par)]).filter(x => x.trim()), out = [];
  raw.forEach(x => { if (out.length && out[out.length - 1].trim().length < 45) out[out.length - 1] += x; else out.push(x); });
  if (out.length > 1 && out[out.length - 1].trim().length < 25) { const l = out.pop(); out[out.length - 1] += l; }
  return out;
}
function stOpen(id, mode) {
  const x = stTutte().find(y => y.id === id); if (!x || !D) return;
  stClose(true);
  const s = stState(); s.modo = mode === 'leggo' ? 'leggo' : 'ascolta'; stSave(s);
  ST = { x, mode: s.modo, P: x.p.map(stSplit), i: 0, j: 0, play: s.modo === 'ascolta', solo: false, timer: null, wd: null, snore: null };
  let ov = $('st-ov'); if (!ov) { ov = document.createElement('div'); ov.id = 'st-ov'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-label', 'La storia'); document.body.appendChild(ov); }
  ov.hidden = false; ov.classList.remove('fine'); document.body.classList.add('in-lesson');
  ov.innerHTML = stCielo(40) + '<span class="st-luna" aria-hidden="true"></span>' + stLucciole(6) + '<div class="st-top"><span class="st-epn">' + x.ic + '</span><b>' + esc(stTxt(x.t)) + (x.da ? '<small class="st-da">' + esc(x.da) + '</small>' : '') + '</b><button type="button" class="st-sw" id="st-sw"></button><button type="button" class="st-x" id="st-x" aria-label="Chiudi">✕</button></div>' +
    '<div class="st-stage" id="st-stage"><div class="st-scene" id="st-scene">' + (stScena(x.id) || '<span class="st-ci">' + x.ic + '</span>') + stPet('sveglio') + '</div><div class="st-text" id="st-text" aria-live="off"></div></div>' +
    '<div class="st-dots" id="st-dots">' + x.p.map(() => '<i></i>').join('') + '</div><div class="st-ctl" id="st-ctl"></div>';
  $('st-x').onclick = () => stClose();
  $('st-sw').onclick = () => { ST.mode = ST.mode === 'ascolta' ? 'leggo' : 'ascolta'; ST.play = ST.mode === 'ascolta'; ST.solo = false; const t = stState(); t.modo = ST.mode; stSave(t); stGo(ST.i, 0); };
  stCtl(); stGo(0, 0);
}
function stCtl() {
  if (!ST) return; const c = $('st-ctl'), asc = ST.mode === 'ascolta', last = ST.i >= ST.P.length - 1;
  $('st-sw').textContent = asc ? '📖 Leggo io' : '🔊 Ascolto';
  $('st-ov').classList.toggle('leggo', !asc);
  c.innerHTML = asc ? '<button type="button" id="st-prev" aria-label="Rileggi questo pezzo">⏮</button><button type="button" id="st-pp" aria-label="' + (ST.play ? 'Pausa' : 'Riprendi') + '">' + (ST.play ? '⏸' : '▶️') + '</button><button type="button" id="st-next" aria-label="Avanti">⏭</button>'
    : '<button type="button" id="st-prev" aria-label="Indietro"' + (ST.i ? '' : ' disabled') + '>◀</button><button type="button" id="st-pp" aria-label="Leggimi questo pezzo">' + (ST.play ? '⏸' : '🔊') + '</button><button type="button" class="wide" id="st-next">' + (last ? 'Fine 🌙' : 'Avanti ▶') + '</button>';
  $('st-prev').onclick = () => { ST.solo = false; if (asc) stGo(ST.j > 0 ? ST.i : ST.i - 1, 0); else { ST.play = false; stGo(ST.i - 1, 0); } };
  $('st-next').onclick = () => { ST.solo = false; if (!asc) ST.play = false; stGo(ST.i + 1, 0); };
  $('st-pp').onclick = () => {
    if (ST.play) { ST.play = false; ST.solo = false; stStop(); stHi(); }
    else { ST.play = true; ST.solo = !asc; if (!asc) ST.j = 0; stSay(); }
    stCtl();
  };
}
function stStop() { if (!ST) return; clearTimeout(ST.timer); clearTimeout(ST.wd); try { speechSynthesis.cancel(); } catch (e) {} }
function stHi() {   /* illumina la frase che la voce sta leggendo */
  const on = ST && ST.play; document.querySelectorAll('#st-text span').forEach((e, k) => { e.className = on ? (k === ST.j ? 'cur' : k < ST.j ? 'old' : 'next') : ''; });
}
function stGo(i, j) {
  if (!ST) return; stStop();
  if (i >= ST.P.length) return stFine();
  if (i < 0) i = 0; const prima = ST.i; ST.i = i; ST.j = j || 0;
  const box = $('st-text'), indietro = i < prima; box.classList.remove('in', 'back'); void box.offsetWidth;
  $('st-ov').style.setProperty('--pg', ST.P.length > 1 ? (i / (ST.P.length - 1)).toFixed(3) : '0');   /* la luna sale mentre la storia va avanti */
  const scn = $('st-scene'); if (scn && i !== prima) { scn.classList.remove('cambia'); void scn.offsetWidth; scn.classList.add('cambia'); }
  box.innerHTML = '<p>' + ST.P[i].map(t => '<span>' + esc(t) + '</span>').join('') + '</p>'; box.classList.add('in'); if (indietro) box.classList.add('back'); box.scrollTop = 0;
  $('st-dots').querySelectorAll('i').forEach((e, k) => { e.className = k < i ? 'on' : k === i ? 'cur' : ''; });
  const sc = document.querySelector('#st-scene .sd'), dd = typeof ST_DISEGNI !== 'undefined' && ST_DISEGNI[ST.x.id]; if (sc && dd) sc.classList.toggle('fase2', i >= dd.f2);   /* il disegno cambia a metà storia */
  stCtl(); stHi();
  if (ST.play) stSay();
}
function stSay() {
  if (!ST || !ST.play) return;
  const me = ST, i = ST.i, j = ST.j, t = ST.P[i][j], w = t.split(/\s+/).length; let done = false;
  clearTimeout(ST.timer); clearTimeout(ST.wd); stHi();
  const cur = document.querySelector('#st-text span.cur'); if (cur && cur.scrollIntoView) { try { cur.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' }); } catch (e) {} }
  const pet = document.querySelector('#st-ov .st-pet'); if (pet) { pet.classList.remove('parla'); void pet.offsetWidth; pet.classList.add('parla'); }
  const next = () => {
    if (done) return; done = true;
    if (ST !== me || !ST.play || ST.i !== i || ST.j !== j) return;
    clearTimeout(ST.wd);
    if (j + 1 < ST.P[i].length) { ST.j = j + 1; ST.timer = setTimeout(stSay, 160); }
    else if (ST.solo) { ST.play = false; ST.solo = false; stCtl(); stHi(); }
    else ST.timer = setTimeout(() => { if (ST === me) stGo(i + 1, 0); }, 850);
  };
  /* rete di sicurezza: se la voce dell'iPad non avvisa la fine della frase, si va avanti lo stesso */
  if (Voice.ok) { ST.wd = setTimeout(next, 4000 + 520 * w); Voice.say(t, null, { onend: next }); }
  else ST.timer = setTimeout(next, 900 + 380 * w);
}

/* ---------- il finale: l'avatar sbadiglia, si addormenta e russa; poi «E tu?» ---------- */
function stRussa(n, vol) {
  const a = audio(); if (!a) return;
  for (let k = 0; k < n; k++) {
    try {
      const t = a.currentTime + 0.05 + k * 2.4;
      /* inspiro: un suono grave che vibra */
      const o = a.createOscillator(), f = a.createBiquadFilter(), tr = a.createGain(), lfo = a.createOscillator(), ld = a.createGain(), g = a.createGain();
      o.type = 'sawtooth'; o.frequency.setValueAtTime(60, t); o.frequency.linearRampToValueAtTime(76, t + 1.05);
      f.type = 'lowpass'; f.frequency.value = 430;
      lfo.type = 'sine'; lfo.frequency.value = 23; ld.gain.value = 0.45; tr.gain.value = 0.55; lfo.connect(ld); ld.connect(tr.gain);
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + 0.5); g.gain.linearRampToValueAtTime(0.0001, t + 1.15);
      o.connect(f); f.connect(tr); tr.connect(g); g.connect(a.destination); o.start(t); lfo.start(t); o.stop(t + 1.2); lfo.stop(t + 1.2);
      /* espiro: un fischietto leggero */
      const o2 = a.createOscillator(), g2 = a.createGain();
      o2.type = 'sine'; o2.frequency.setValueAtTime(640, t + 1.3); o2.frequency.exponentialRampToValueAtTime(430, t + 2.0);
      g2.gain.setValueAtTime(0.0001, t + 1.3); g2.gain.linearRampToValueAtTime(vol * 0.22, t + 1.5); g2.gain.linearRampToValueAtTime(0.0001, t + 2.05);
      o2.connect(g2); g2.connect(a.destination); o2.start(t + 1.3); o2.stop(t + 2.1);
    } catch (e) {}
  }
}
function stFine() {
  if (!ST) return; stStop();
  const me = ST, x = ST.x, asc = ST.mode === 'ascolta', s = stState(), q = stTxt(x.d);
  s.visti[x.id] = todayIso(); stSave(s);
  ST.play = false; ST.fine = true;
  ['st-dots', 'st-ctl', 'st-sw'].forEach(k => { const e = $(k); if (e) e.style.display = 'none'; });
  $('st-ov').classList.add('fine');
  $('st-stage').innerHTML = '<div class="st-end"><svg class="st-notte sd" viewBox="0 0 400 60" preserveAspectRatio="xMidYMin slice" aria-hidden="true">' + SD_STELLE + '<circle cx="340" cy="34" r="15" fill="#fff5cf"/><circle cx="333" cy="29" r="14" fill="#1c1e4c"/></svg>' + stPet('sbadiglio') + '<div class="st-card-end" id="st-ce" hidden><div class="st-fine">Fine</div><div class="st-etu">E tu?</div><p>' + esc(q) + '</p>' +
    '<div class="st-acts">' + (typeof dayForm === 'function' ? '<button type="button" class="btn st-b2" id="st-dia">📝 Lo scrivo nel diario</button>' : '') + '<button type="button" class="btn st-b1" id="st-notte">🌙 Buonanotte</button></div>' +
    '<button type="button" class="st-again" id="st-again">🔁 Da capo</button></div></div>';
  const later = (ms, fn) => setTimeout(() => { if (ST === me) fn(); }, ms);
  later(reduce ? 200 : 1500, () => { const p = document.querySelector('#st-ov .st-pet'); if (p) { p.classList.remove('sbadiglio'); p.classList.add('dorme'); } stRussa(2, 0.11); });
  later(2800, () => {
    const c = $('st-ce'); if (!c) return; c.hidden = false;
    if ($('st-dia')) $('st-dia').onclick = () => {
      const t = stState(), k = todayIso(); t.nq = { k, q }; stSave(t); stClose(true); go('diario');
      openModal('<div class="big" style="font-size:26px">📝 Il mio diario</div><div id="m-form"></div><div class="row center" style="margin-top:8px"><button type="button" class="btn small ghost" id="m-close">Chiudi</button></div>', ['var(--c1)', 'var(--c1-soft)']);
      $('m-close').addEventListener('click', closeModal);
      dayForm($('m-form'), k, () => { closeModal(); go('diario'); });
    };
    $('st-notte').onclick = () => stClose();
    $('st-again').onclick = () => stOpen(x.id, me.mode);
  });
  if (asc) later(6200, () => { if (Voice.ok) Voice.say('E tu? ' + q); });
  /* poi continua a russare piano, ogni tanto */
  let n = 0; ST.snore = setInterval(() => { let sp = false; try { sp = speechSynthesis.speaking; } catch (e) {} if (ST !== me || ++n > 8) { clearInterval(me.snore); return; } if (!sp) stRussa(1, 0.05); }, 7000);
}
function stClose(silent) {
  if (ST) { clearTimeout(ST.timer); clearTimeout(ST.wd); clearInterval(ST.snore); }
  const was = ST; ST = null;
  try { speechSynthesis.cancel(); } catch (e) {}
  const ov = $('st-ov'); if (ov) { ov.hidden = true; ov.innerHTML = ''; }
  if (was) document.body.classList.remove('in-lesson');
  if (!silent && was && typeof current !== 'undefined' && current === 'storie') go('storie');
}
document.addEventListener('keydown', e => { if (e.key === 'Escape' && ST) stClose(); });
document.addEventListener('visibilitychange', () => { if (document.visibilityState !== 'visible' && ST && ST.play) { ST.play = false; ST.solo = false; stStop(); if (!ST.fine) { stCtl(); stHi(); } } });

/* ---------- in 🏠 Casa, la sera: il richiamo alla storia di stasera (finché non l'ha sentita) ---------- */
(function stHome() {
  const h0 = PAGES.home;
  PAGES.home = el => {
    h0(el);
    try {
      if (!D || !stSera() || el.querySelector('.st-home')) return;
      const x = stOggi(), s = stState(); if (!x || s.visti[x.id] === todayIso()) return;
      const hello = el.querySelector('.v2-hello'); if (!hello) return;
      hello.insertAdjacentHTML('afterend', '<button type="button" class="st-home"><span aria-hidden="true">🌙</span><b>La storia di stasera</b><small>' + (s.n ? 'Consigliata: ' + esc(stTxt(x.t)) + ' · ' : '') + 'scegli tu dalla libreria</small></button>');
      el.querySelector('.st-home').addEventListener('click', () => go('storie'));
    } catch (e) {}
  };
})();
