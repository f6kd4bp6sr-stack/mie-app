/* ================= CORE ================= */
let NAME = 'campionessa';  /* il nome vero è salvato SOLO sull'iPad (impostazioni), mai nel codice pubblico */
const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = a => a[Math.floor(Math.random() * a.length)];
const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
/* ---------- Memoria: copia locale + salvataggio nel tuo account Claude (quando disponibile) ---------- */
const store = (() => {
  const P = 'mm2-', OLD = atob('dmFsZTIt'), mem = {}, stamp = {};  /* OLD: prefisso dei salvataggi fino al 24/10/2026 */
  let ls = null;
  try { const k = P + '__probe'; localStorage.setItem(k, '1'); localStorage.removeItem(k); ls = localStorage; } catch (e) { ls = null; }
  /* prefisso neutro (24/10/2026): le chiavi vecchie si spostano una alla volta, senza perdere niente */
  if (ls) { try { const ks = []; for (let i = 0; i < ls.length; i++) { const k = ls.key(i); if (k && k.startsWith(OLD)) ks.push(k); }
    ks.forEach(k => { const nk = P + k.slice(OLD.length), v = ls.getItem(k); if (v != null && ls.getItem(nk) == null) ls.setItem(nk, v); if (ls.getItem(nk) === v || ls.getItem(nk) != null) ls.removeItem(k); }); } catch (e) {} }
  if (ls) {
    for (let i = 0; i < ls.length; i++) { const k = ls.key(i); if (k && k.startsWith(P) && k !== P + '__t') { try { mem[k.slice(P.length)] = JSON.parse(ls.getItem(k)); } catch (e) {} } }
    try { Object.assign(stamp, JSON.parse(ls.getItem(P + '__t') || '{}')); } catch (e) {}
  }
  const api = {
    local: !!ls, cloud: null, onCloud: null,
    fresh: Object.keys(mem).length === 0,   // memoria del browser vuota all'avvio (prima volta o svuotata dall'iPad)
    get(k, d) { return Object.prototype.hasOwnProperty.call(mem, k) ? JSON.parse(JSON.stringify(mem[k])) : d; },
    set(k, v, fromCloud, t) {
      mem[k] = JSON.parse(JSON.stringify(v)); stamp[k] = t || Date.now();
      if (ls) { try { ls.setItem(P + k, JSON.stringify(v)); ls.setItem(P + '__t', JSON.stringify(stamp)); } catch (e) {} }
      if (!fromCloud && api._push) api._push(k);
    },
    all() { return { data: JSON.parse(JSON.stringify(mem)), t: Object.assign({}, stamp) }; },
    _mem: mem, _stamp: stamp
  };
  return api;
})();
/* ---------- Dati personali della bambina: restano solo su questo iPad ---------- */
let CHILD = (() => { const c = store.get('child', null); return c && typeof c === 'object' ? c : {}; })();
const childName = () => String(CHILD.name || '').trim();
let CHI = 'Giulia';   /* protagonista dei problemi */
function applyChild() {
  NAME = childName() || 'campionessa'; CHI = childName() || 'Giulia';
  try { document.title = childName() ? 'Il mondo di ' + childName() : 'Il mio mondo'; } catch (e) {}
  if (typeof applySportDays === 'function') applySportDays();
}
const MESI = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];
applyChild();
const bdayMD = () => CHILD.bd && CHILD.bd.m && CHILD.bd.d ? String(CHILD.bd.m).padStart(2, '0') + '-' + String(CHILD.bd.d).padStart(2, '0') : '';
const todayKey = () => { const d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); };
const CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 6"/></svg>';
const PAL = [
  ['var(--c1)', 'var(--c1-soft)'], ['var(--c2)', 'var(--c2-soft)'], ['var(--c3)', 'var(--c3-soft)'],
  ['var(--c4)', 'var(--c4-soft)'], ['var(--c5)', 'var(--c5-soft)'], ['var(--c6)', 'var(--c6-soft)']
];

/* ---------- Voce ----------
   Italiano con la voce italiana, inglese con una voce inglese britannica (come a scuola).
   Voice.say(testo, en): «en» è l'elenco delle parti inglesi del testo (dalle schede delle domande, campo «en»).
   Senza elenco: le parti tra «» fatte solo di parole inglesi conosciute (EN_LEX, generato al build) vanno in inglese. */
const IT_SHORT = new Set(['a', 'e', 'i', 'o', 'in', 'con', 'per', 'non', 'la', 'le', 'il', 'lo', 'di', 'da', 'se', 'me', 'te', 'so', 'no', 'ho', 'ha', 'hai', 'come', 'una', 'un', 'tu', 'mi', 'ti', 'si', 'ci', 'va', 'fa', 'su', 'tra', 'ma', 'più', 'che', 'chi', 'dove', 'era', 'sono', 'ora', 'pane', 'cane', 'base']);
const Voice = {
  ok: typeof window.speechSynthesis !== 'undefined' && typeof window.SpeechSynthesisUtterance !== 'undefined',
  v: null, ve: null,
  itOpts() { return { rate: 0.95, pitch: 1.1 }; },
  pickIt() { const vs = speechSynthesis.getVoices(); this.v = vs.find(v => /^it/i.test(v.lang) && /Alice|Federica|Emma|Paola|Elsa/i.test(v.name)) || vs.find(v => /^it/i.test(v.lang)) || null; },
  pickVoice() {
    try { this.pickIt(); } catch (e) { this.v = null; }
    try {
      const vs = speechSynthesis.getVoices();
      const gb = vs.filter(v => /^en[-_]GB/i.test(v.lang));
      this.ve = gb.find(v => /Daniel|Kate|Serena|Arthur|Martha|Stephanie|Oliver|Jamie/i.test(v.name) && /enhanced|premium|avanzat|migliorat/i.test(v.name + ' ' + (v.voiceURI || ''))) ||
        gb.find(v => /Daniel|Kate|Serena|Arthur|Martha|Stephanie|Oliver|Jamie/i.test(v.name)) || gb[0] || vs.find(v => /^en/i.test(v.lang)) || null;
    } catch (e) { this.ve = null; }
  },
  /* divide il testo in pezzi italiano/inglese; «en» = stringhe inglesi esatte (parola intera, maiuscole comprese) */
  parts(t, en) {
    const s = String(t), mark = new Array(s.length).fill(0), isL = ch => !!ch && /[\p{L}\p{N}'’]/u.test(ch);
    const list = (Array.isArray(en) ? en : []).filter(Boolean).slice().sort((a, b) => b.length - a.length);
    list.forEach(w => {
      let i = 0;
      while ((i = s.indexOf(w, i)) >= 0) {
        const j = i + w.length, okB = !isL(s[i - 1]) || !isL(w[0]), okA = !isL(s[j]) || !isL(w[w.length - 1]);
        if (okB && okA && !mark.slice(i, j).some(Boolean)) for (let k = i; k < j; k++) mark[k] = 1;
        i = j;
      }
    });
    if (!list.length && typeof EN_LEX !== 'undefined') {   // senza elenco: solo le parti tra «» tutte inglesi
      s.replace(/«([^»]{1,80})»/g, (m, inner, off) => {
        const ws = inner.toLowerCase().replace(/’/g, "'").match(/[a-z']+/g) || [];
        if (ws.length && ws.every(w => EN_LEX.has(w)) && ws.some(w => !IT_SHORT.has(w))) for (let k = off + 1; k < off + 1 + inner.length; k++) mark[k] = 1;
        return m;
      });
    }
    const out = []; let cur = null;
    for (let k = 0; k < s.length; k++) { const l = mark[k] ? 'en' : 'it'; if (!cur || cur.l !== l) { cur = { l, t: '' }; out.push(cur); } cur.t += s[k]; }
    return out.map(p => ({ l: p.l, t: p.t.replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}]/gu, '').replace(/«|»|\*/g, '').replace(/\s+/g, ' ') })).filter(p => /[\p{L}\p{N}]/u.test(p.t));
  },
  say(t, en, opt) {
    if (!this.ok) { floatText(document.body, 'La voce non è disponibile qui'); return; }
    try {
      speechSynthesis.cancel();
      if (!this.v && !this.ve) this.pickVoice();
      const slow = opt && opt.slow;
      const ps = this.parts(t, en); if (!ps.length && opt && opt.onend) setTimeout(opt.onend, 50);
      ps.forEach((p, i) => {
        const u = new SpeechSynthesisUtterance(p.t.trim());
        if (p.l === 'en') { u.lang = 'en-GB'; if (this.ve) u.voice = this.ve; u.rate = slow ? 0.6 : 0.85; u.pitch = 1.05; }
        else { const o = this.itOpts(); u.lang = 'it-IT'; if (this.v) u.voice = this.v; u.rate = o.rate; u.pitch = o.pitch; }
        if (opt && opt.onend && i === ps.length - 1) u.onend = opt.onend;   // fine dell'ultima parte
        speechSynthesis.speak(u);
      });
    } catch (e) {}
  },
  /* frase tutta in inglese (es. il drago di «Parlo inglese») */
  sayEn(t, opt) { this.say(t, [String(t)], opt); },
  hasEnglish() { if (!this.ve) this.pickVoice(); return !!this.ve; }
};
if (Voice.ok) { try { speechSynthesis.onvoiceschanged = () => Voice.pickVoice(); Voice.pickVoice(); } catch (e) {} }
const sayBtn = (t, en) => '<button type="button" class="say" data-say="' + esc(t) + '"' + (en && en.length ? ' data-en="' + esc(JSON.stringify(en)) + '"' : '') + ' aria-label="Ascolta ad alta voce">🔊</button>';
document.addEventListener('click', e => {
  const b = e.target.closest('[data-say]');
  if (b) { e.preventDefault(); e.stopPropagation(); let en = null; try { en = b.dataset.en ? JSON.parse(b.dataset.en) : null; } catch (x) {} Voice.say(b.getAttribute('data-say'), en); }
}, true);

/* ---------- Suoni ---------- */
let actx = null;
function audio() {
  if (!actx) { try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { actx = null; } }
  if (actx && actx.state === 'suspended') actx.resume();
  return actx;
}
function tone(freq, dur, delay, type) {
  const a = audio(); if (!a) return;
  const t = a.currentTime + (delay || 0);
  const o = a.createOscillator(), g = a.createGain();
  o.type = type || 'triangle'; o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.22, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(a.destination); o.start(t); o.stop(t + dur + 0.05);
}
const ding = () => { tone(659.25, .14); tone(783.99, .2, .09); };
const oops = () => tone(220, .25, 0, 'sine');
const fanfare = () => { [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, .22, i * .12)); };

/* ---------- Brava! e coriandoli ---------- */
const PRAISE = ['Brava!', 'Bravissima!', 'Che brava!', 'Sei forte!', 'Evviva!', 'Grande!', 'Super!', 'Fantastica!'];
const TRY = ['Ci hai provato: il drago è più forte!', 'Errore = allenamento!', 'Ogni tentativo conta!', 'Coraggio, ci sei quasi!', 'Sbagliando si impara!'];
function praise() { let m = pick(PRAISE); if (Math.random() < 0.5) m = m.replace(/!$/, ', ' + NAME + '!'); return m; }
function cheer(el, text, soft) {
  const r = el.getBoundingClientRect();
  const b = document.createElement('div');
  b.textContent = text || praise();
  b.style.cssText = 'position:fixed;top:' + (r.top + r.height / 2) + 'px;left:0;transform:translate(-50%,-50%);z-index:95;pointer-events:none;' +
    'font-family:var(--font-display),sans-serif;font-weight:800;font-size:24px;color:#fff;' +
    'background:' + (soft ? 'linear-gradient(90deg,#5aa9ff,#4bc0a8)' : 'linear-gradient(90deg,#ff7a9c,#a879ff)') +
    ';padding:7px 18px;border-radius:999px;box-shadow:0 6px 18px rgba(0,0,0,.18);white-space:nowrap;max-width:94vw;overflow:hidden;text-overflow:ellipsis';
  document.body.appendChild(b);
  const half = b.offsetWidth / 2 + 10;
  b.style.left = Math.min(Math.max(r.left + r.width / 2, half), window.innerWidth - half) + 'px';
  if (reduce) { setTimeout(() => b.remove(), 1000); return; }
  b.animate([
    { transform: 'translate(-50%,-50%) scale(.6)', opacity: 0 },
    { transform: 'translate(-50%,-120%) scale(1)', opacity: 1, offset: .22 },
    { transform: 'translate(-50%,-150%) scale(1)', opacity: 1, offset: .78 },
    { transform: 'translate(-50%,-210%) scale(.9)', opacity: 0 }
  ], { duration: 1200, easing: 'cubic-bezier(.2,.8,.2,1)' }).onfinish = () => b.remove();
  if (!soft) confetti(r.left + r.width / 2, r.top + r.height / 2, 12);
}
function confetti(x, y, n) {
  if (reduce) return;
  const colors = ['#ff7a9c', '#ff9f43', '#ffd23f', '#4bc0a8', '#5aa9ff', '#a879ff'];
  for (let i = 0; i < n; i++) {
    const p = document.createElement('span');
    p.style.cssText = 'position:fixed;left:' + x + 'px;top:' + y + 'px;width:10px;height:10px;border-radius:2px;pointer-events:none;z-index:94;background:' + colors[i % 6];
    document.body.appendChild(p);
    const ang = Math.random() * Math.PI * 2, dist = 50 + Math.random() * (n > 20 ? 160 : 60);
    p.animate([
      { transform: 'translate(0,0) rotate(0)', opacity: 1 },
      { transform: 'translate(' + Math.cos(ang) * dist + 'px,' + (Math.sin(ang) * dist + 50) + 'px) rotate(' + rnd(0, 360) + 'deg)', opacity: 0 }
    ], { duration: 800 + Math.random() * 500, easing: 'cubic-bezier(.2,.7,.3,1)' }).onfinish = () => p.remove();
  }
}
function floatText(el, text) {
  const r = el.getBoundingClientRect();
  const t = document.createElement('div');
  t.className = 'toast-e'; t.textContent = text;
  document.body.appendChild(t);
  const x = Math.min(Math.max(r.left + r.width / 2, 80), window.innerWidth - 80);
  const y = el === document.body ? window.innerHeight / 2 : r.top;
  t.style.left = (x - t.offsetWidth / 2) + 'px'; t.style.top = y + 'px';
  if (reduce) { setTimeout(() => t.remove(), 1000); return; }
  t.animate([{ transform: 'translateY(0)', opacity: 1 }, { transform: 'translateY(-50px)', opacity: 0 }], { duration: 1100, easing: 'ease-out' }).onfinish = () => t.remove();
}

/* ---------- Finestra ---------- */
function openModal(html, color) {
  const box = $('modal-box');
  box.classList.remove('wide');
  box.style.setProperty('--mc', color ? color[0] : 'var(--c3)');
  box.style.setProperty('--ms', color ? color[1] : 'var(--c3-soft)');
  box.innerHTML = html;
  $('modal').hidden = false;
  const f = box.querySelector('[data-focus]') || box.querySelector('button, input');
  if (f) setTimeout(() => f.focus(), 30);
}
function closeModal() { $('modal').hidden = true; try { speechSynthesis.cancel(); } catch (e) {} }
$('modal').addEventListener('click', e => { if (e.target.id === 'modal' && !$('modal').dataset.lock) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('modal').hidden && !$('modal').dataset.lock) closeModal(); });

/* ---------- Drago ---------- */
const DCOLORS = {
  verde: ['#4bc0a8', '#bff0e2', 'var(--c4)', 'var(--c4-soft)', 'Verde smeraldo'],
  viola: ['#a879ff', '#e4d6ff', 'var(--c6)', 'var(--c6-soft)', 'Viola magico'],
  rosa: ['#ff7a9c', '#ffd3de', 'var(--c1)', 'var(--c1-soft)', 'Rosa fenice'],
  azzurro: ['#5aa9ff', '#cfe5ff', 'var(--c5)', 'var(--c5-soft)', 'Azzurro cielo'],
  arancio: ['#ff9f43', '#ffdcb8', 'var(--c2)', 'var(--c2-soft)', 'Arancio fuoco'],
  oro: ['#e8b923', '#fff1bf', 'var(--c3)', 'var(--c3-soft)', 'Oro del tesoro', 1],
  notte: ['#5b62b3', '#d9dcff', 'var(--c5)', 'var(--c5-soft)', 'Blu notte stellata', 1],
  menta: ['#6fd6b0', '#e0fff2', 'var(--c4)', 'var(--c4-soft)', 'Menta fresca', 1]
};
/* colori e accessori del negozio: si usano solo se comprati con le gemme */
const ownedShop = () => store.get('shop-owned', []);
const colorUsable = k => DCOLORS[k] && (!DCOLORS[k][5] || ownedShop().includes('dcol-' + k));
function dragonAcc(a) {
  const ink = '#33304a';
  if (a === 'mago') return '<path d="M76 46 L100 -4 L124 46 Z" fill="#7e57c2" stroke="' + ink + '" stroke-width="3" stroke-linejoin="round"/><ellipse cx="100" cy="46" rx="32" ry="7" fill="#6a46b0" stroke="' + ink + '" stroke-width="3"/><path d="M96 20 l2 4 l4 1 l-3 3 l1 4 l-4 -2 l-4 2 l1 -4 l-3 -3 l4 -1 z M108 34 l1.5 3 l3 .5 l-2 2 l.5 3 l-3 -1.5 l-3 1.5 l.5 -3 l-2 -2 l3 -.5 z" fill="#ffd23f"/>';
  if (a === 'fiocco') return '<g transform="translate(130 44) rotate(15)"><path d="M0 0 L-16 -11 L-16 11 Z M0 0 L16 -11 L16 11 Z" fill="#ff5c8a" stroke="' + ink + '" stroke-width="3" stroke-linejoin="round"/><circle r="5" fill="#ff5c8a" stroke="' + ink + '" stroke-width="3"/></g>';
  if (a === 'sciarpa') return '<path d="M62 112 Q100 130 138 112 L140 124 Q100 142 60 124 Z" fill="#ff7a5c" stroke="' + ink + '" stroke-width="3" stroke-linejoin="round"/><path d="M118 126 L124 160 L110 160 L106 128 Z" fill="#ff7a5c" stroke="' + ink + '" stroke-width="3" stroke-linejoin="round"/><path d="M112 156 l0 8 M118 156 l0 8" stroke="' + ink + '" stroke-width="2.5"/>';
  if (a === 'occhiali') return '<rect x="66" y="64" width="32" height="22" rx="9" fill="#2b2b33" stroke="' + ink + '" stroke-width="2.5"/><rect x="102" y="64" width="32" height="22" rx="9" fill="#2b2b33" stroke="' + ink + '" stroke-width="2.5"/><path d="M98 72 L102 72" stroke="' + ink + '" stroke-width="3"/><path d="M71 69 l8 0" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".7"/><path d="M107 69 l8 0" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".7"/>';
  if (a === 'cuffie') return '<path d="M58 84 Q56 30 100 30 Q144 30 142 84" fill="none" stroke="#5aa9ff" stroke-width="7" stroke-linecap="round"/><rect x="48" y="70" width="16" height="26" rx="7" fill="#5aa9ff" stroke="' + ink + '" stroke-width="3"/><rect x="136" y="70" width="16" height="26" rx="7" fill="#5aa9ff" stroke="' + ink + '" stroke-width="3"/>';
  if (a === 'pirata') return '<path d="M60 48 Q100 0 140 48 Q100 36 60 48 Z" fill="#2b2b33" stroke="' + ink + '" stroke-width="3" stroke-linejoin="round"/><circle cx="100" cy="30" r="6" fill="#fff"/><path d="M96 28 l8 6 M104 28 l-8 6" stroke="#2b2b33" stroke-width="2"/>';
  if (a === 'fiore') return '<g transform="translate(136 50)"><circle r="7" cx="0" cy="-9" fill="#ff7a9c"/><circle r="7" cx="9" cy="0" fill="#ff7a9c"/><circle r="7" cx="0" cy="9" fill="#ff7a9c"/><circle r="7" cx="-9" cy="0" fill="#ff7a9c"/><circle r="6" fill="#ffd23f" stroke="' + ink + '" stroke-width="2"/></g>';
  if (a === 'lente') return '<g transform="translate(150 118) rotate(-30)"><circle r="14" fill="#cfe5ff" fill-opacity=".6" stroke="' + ink + '" stroke-width="4"/><path d="M0 14 L0 36" stroke="#8d5a2b" stroke-width="7" stroke-linecap="round"/></g>';
  if (a === 'festa') return '<g transform="rotate(-10 100 46)"><path d="M78 48 L100 0 L122 48 Z" fill="#ff7a9c" stroke="' + ink + '" stroke-width="3" stroke-linejoin="round"/><circle cx="95" cy="38" r="3.5" fill="#ffd23f"/><circle cx="106" cy="28" r="3.5" fill="#5aa9ff"/><circle cx="98" cy="18" r="3" fill="#fff"/><circle cx="110" cy="42" r="3" fill="#4bc0a8"/><circle cx="100" cy="0" r="7" fill="#ffd23f" stroke="' + ink + '" stroke-width="3"/><path d="M76 48 Q100 56 124 48" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/></g>';
  { const m = /^bday(\d*)$/.exec(a || ''); if (m) return '<path d="M72 46 L78 14 L91 31 L100 6 L109 31 L122 14 L128 46 Z" fill="#ffd23f" stroke="' + ink + '" stroke-width="3" stroke-linejoin="round"/><rect x="72" y="40" width="56" height="9" rx="4" fill="#f2b705" stroke="' + ink + '" stroke-width="3"/><circle cx="78" cy="14" r="4.5" fill="#ff5c8a" stroke="' + ink + '" stroke-width="2"/><circle cx="100" cy="6" r="5" fill="#5aa9ff" stroke="' + ink + '" stroke-width="2"/><circle cx="122" cy="14" r="4.5" fill="#4bc0a8" stroke="' + ink + '" stroke-width="2"/>' + (m[1] ? '<circle cx="100" cy="31" r="10.5" fill="#fff" stroke="' + ink + '" stroke-width="2.5"/><text x="100" y="35.5" text-anchor="middle" font-size="' + (m[1].length > 1 ? 12 : 14) + '" font-weight="900" font-family="system-ui,sans-serif" fill="#ff3d7f">' + m[1] + '</text>' : '<circle cx="100" cy="31" r="5" fill="#ff5c8a" stroke="' + ink + '" stroke-width="2"/>'); }
  if (a === 'corona') return '<path d="M80 40 L86 18 L95 32 L100 12 L105 32 L114 18 L120 40 Z" fill="#ffd23f" stroke="' + ink + '" stroke-width="3" stroke-linejoin="round"/><circle cx="100" cy="30" r="3.5" fill="#ff5c8a"/>';
  return '';
}
const LEVELS = [
  { n: 'Uovo magico', min: 0 },
  { n: 'Cucciolo curioso', min: 15 },
  { n: 'Draghetto coraggioso', min: 50 },
  { n: 'Drago tenace', min: 120 },
  { n: 'Drago volante', min: 250 },
  { n: 'Drago leggendario', min: 450 }
];
let D = store.get('dragon', null);
function levelOf(e) { let i = 0; LEVELS.forEach((l, k) => { if (e >= l.min) i = k; }); return i; }
function dcol() { return DCOLORS[(D && D.color) || 'verde']; }

function dragonSVG(stage, colorKey, cls) {
  const c = DCOLORS[colorKey] || DCOLORS.verde;
  const body = c[0], belly = c[1];
  const ink = '#33304a';
  if (stage === 0) {
    const e = D ? D.energy : 0;
    const crack = e >= 8 ? '<path d="M70 110 l12 -10 l10 12 l12 -12 l10 10 l12 -8" fill="none" stroke="' + ink + '" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>' : '';
    return '<svg class="dragon ' + (cls || '') + '" viewBox="0 0 200 200" role="img" aria-label="Un uovo di drago">' +
      '<ellipse cx="100" cy="182" rx="56" ry="9" fill="' + ink + '" opacity=".12"/>' +
      '<ellipse cx="100" cy="112" rx="60" ry="74" fill="' + belly + '" stroke="' + body + '" stroke-width="6"/>' +
      '<circle cx="78" cy="80" r="11" fill="' + body + '" opacity=".75"/><circle cx="122" cy="98" r="15" fill="' + body + '" opacity=".75"/>' +
      '<circle cx="86" cy="140" r="13" fill="' + body + '" opacity=".75"/><circle cx="126" cy="146" r="8" fill="' + body + '" opacity=".75"/>' +
      '<ellipse cx="80" cy="66" rx="10" ry="16" fill="#fff" opacity=".6" transform="rotate(-20 80 66)"/>' + crack + '</svg>';
  }
  const wingS = [0, 0, .7, .85, 1, 1.15][stage];
  const wings = wingS ? (
    '<g transform="translate(100 118) scale(' + wingS + ') translate(-100 -118)">' +
    '<path d="M62 112 C30 70 10 80 14 104 C24 100 30 108 28 118 C38 112 46 120 44 130 C52 124 58 124 64 128 Z" fill="' + body + '" stroke="' + ink + '" stroke-width="3" stroke-linejoin="round"/>' +
    '<path d="M138 112 C170 70 190 80 186 104 C176 100 170 108 172 118 C162 112 154 120 156 130 C148 124 142 124 136 128 Z" fill="' + body + '" stroke="' + ink + '" stroke-width="3" stroke-linejoin="round"/>' +
    '</g>') : '';
  const horns = stage >= 3 ? '<path d="M78 46 L72 22 L90 40 Z M122 46 L128 22 L110 40 Z" fill="' + c[1] + '" stroke="' + ink + '" stroke-width="3" stroke-linejoin="round"/>' : '';
  const spikes = stage >= 2 ? '<path d="M92 36 L100 22 L108 36 Z" fill="' + belly + '" stroke="' + ink + '" stroke-width="3" stroke-linejoin="round"/>' : '';
  const crown = stage >= 5 ? '<path d="M82 26 L88 10 L96 22 L100 6 L104 22 L112 10 L118 26 Z" fill="#ffd23f" stroke="' + ink + '" stroke-width="3" stroke-linejoin="round"/>' : '';
  const sparkle = stage >= 4 ? '<g fill="#ffd23f"><path d="M30 40 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4 l10 -4z"/><path d="M170 150 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3 l8 -3z"/><path d="M168 36 l2.5 6 l6 2.5 l-6 2.5 l-2.5 6 l-2.5 -6 l-6 -2.5 l6 -2.5z"/></g>' : '';
  const flame = stage >= 3 ? '<path d="M150 84 C160 76 170 80 176 72 C176 84 168 90 176 96 C164 98 158 94 150 92 Z" fill="#ff8a3d"/><path d="M152 86 C160 82 166 84 170 80 C170 88 164 90 168 94 C160 94 156 92 152 90 Z" fill="#ffd23f"/>' : '';
  const shell = stage === 1 ? '<path d="M56 168 L64 150 L74 162 L86 148 L98 162 L110 148 L122 162 L134 150 L144 168 C130 186 70 186 56 168 Z" fill="' + belly + '" stroke="' + body + '" stroke-width="4" stroke-linejoin="round"/>' : '';
  const tail = '<path d="M140 150 C168 156 176 140 184 128 C186 144 176 170 142 168 Z" fill="' + body + '" stroke="' + ink + '" stroke-width="3" stroke-linejoin="round"/>';
  return '<svg class="dragon ' + (cls || '') + '" viewBox="0 0 200 200" role="img" aria-label="Il drago, livello ' + esc(LEVELS[stage].n) + '">' +
    '<ellipse cx="100" cy="186" rx="52" ry="8" fill="' + ink + '" opacity=".12"/>' + sparkle + wings + tail +
    '<ellipse cx="100" cy="140" rx="46" ry="42" fill="' + body + '" stroke="' + ink + '" stroke-width="3"/>' +
    '<ellipse cx="100" cy="148" rx="28" ry="28" fill="' + belly + '"/>' +
    '<path d="M86 136 h28 M84 148 h32 M86 160 h28" stroke="' + body + '" stroke-width="3" stroke-linecap="round" opacity=".5"/>' +
    '<ellipse cx="78" cy="180" rx="14" ry="8" fill="' + body + '" stroke="' + ink + '" stroke-width="3"/><ellipse cx="122" cy="180" rx="14" ry="8" fill="' + body + '" stroke="' + ink + '" stroke-width="3"/>' +
    spikes + horns + crown +
    '<circle cx="100" cy="80" r="42" fill="' + body + '" stroke="' + ink + '" stroke-width="3"/>' +
    '<ellipse cx="100" cy="96" rx="22" ry="14" fill="' + belly + '"/>' +
    '<circle cx="93" cy="94" r="2.5" fill="' + ink + '"/><circle cx="107" cy="94" r="2.5" fill="' + ink + '"/>' +
    '<circle cx="82" cy="74" r="12" fill="#fff" stroke="' + ink + '" stroke-width="2.5"/><circle cx="118" cy="74" r="12" fill="#fff" stroke="' + ink + '" stroke-width="2.5"/>' +
    '<circle cx="84" cy="76" r="6.5" fill="' + ink + '"/><circle cx="120" cy="76" r="6.5" fill="' + ink + '"/>' +
    '<circle cx="86.5" cy="73" r="2.2" fill="#fff"/><circle cx="122.5" cy="73" r="2.2" fill="#fff"/>' +
    '<ellipse cx="66" cy="92" rx="7" ry="4.5" fill="#ff7a9c" opacity=".55"/><ellipse cx="134" cy="92" rx="7" ry="4.5" fill="#ff7a9c" opacity=".55"/>' +
    '<path d="M92 104 Q100 111 108 104" fill="none" stroke="' + ink + '" stroke-width="3" stroke-linecap="round"/>' +
    flame + shell + dragonAcc((typeof festaHat === 'function' && festaHat()) || store.get('dragon-acc', '')) + '</svg>';
}

function nextInfo() {
  const e = D.energy, i = levelOf(e);
  if (i >= LEVELS.length - 1) return { pct: 100, text: 'Livello massimo! Sei una leggenda!' };
  const a = LEVELS[i].min, b = LEVELS[i + 1].min;
  return { pct: Math.round((e - a) / (b - a) * 100), text: 'Ancora ' + (b - e) + ' 🔥 per diventare ' + LEVELS[i + 1].n };
}
function updateBar() {
  if (!D) return;
  const c = dcol(), i = levelOf(D.energy);
  $('mini').style.setProperty('--dsoft', c[3]);
  $('mini').innerHTML = dragonSVG(i, D.color);
  $('bar-name').textContent = D.name;
  $('bar-level').textContent = LEVELS[i].n;
  $('bar-e').style.width = nextInfo().pct + '%';
  $('bar-energy').textContent = D.energy;
}

/* L'energia premia l'impegno: anche un tentativo sbagliato fa crescere il drago */
function gain(n, el) {
  if (!D) return;
  const before = levelOf(D.energy);
  D.energy += n; store.set('dragon', D);
  const days = store.get('days', []);
  const t = todayKey();
  if (!days.includes(t)) { days.push(t); store.set('days', days); }
  updateBar();
  floatText(el || $('bar-energy'), '+' + n + ' 🔥');
  const after = levelOf(D.energy);
  if (after > before) setTimeout(() => levelUp(after), 900);
}
function levelUp(i) {
  fanfare();
  const txt = D.name + ' è diventato ' + LEVELS[i].n + '! Tutto grazie alla tua forza di volontà, ' + NAME + '!';
  openModal('<div>' + dragonSVG(i, D.color, 'bob') + '</div><div class="big">Evviva!</div><p>' + esc(txt) + '</p>' +
    '<div class="row"><button type="button" class="btn" data-focus id="lv-ok">Che forza!</button>' + sayBtn(txt) + '</div>', [dcol()[2], dcol()[3]]);
  $('lv-ok').addEventListener('click', closeModal);
  confetti(window.innerWidth / 2, window.innerHeight / 3, 40);
  if (current === 'home') PAGES.home($('p-home'));
}

/* ---------- Missioni del giorno ---------- */
const TODAY = [
  ['routine', '☀️', 'Completa una routine', 'Mattino, compiti o sera', 'var(--c3)', 'var(--c3-soft)'],
  ['mate', '🔢', 'Allena la matematica', 'Un allenamento a scelta', 'var(--c1)', 'var(--c1-soft)'],
  ['scienze', '🔬', 'Scopri le scienze', 'Un’attività o un quiz', 'var(--c5)', 'var(--c5-soft)'],
  ['giochi', '🎮', 'Fai un gioco', 'Memoria e concentrazione', 'var(--c6)', 'var(--c6-soft)'],
  ['sport', '🤸\u200d♀️', 'Fai una pausa movimento', 'Pattinatrice, acrobata o nuotatrice', 'var(--c2)', 'var(--c2-soft)']
];
function dayState() {
  let s = store.get('today', null);
  if (!s || s.date !== todayKey()) { s = { date: todayKey(), done: [], bonus: false }; store.set('today', s); }
  return s;
}
function markDay(kind, el) {
  const s = dayState();
  if (s.done.includes(kind)) return;
  s.done.push(kind); store.set('today', s);
  if (s.done.length === TODAY.length && !s.bonus) {
    s.bonus = true; store.set('today', s);
    setTimeout(() => {
      gain(10, el);
      cheer(el || $('bar-energy'), 'Tutte le missioni di oggi! +10 🔥');
    }, 1300);
  }
}

/* ---------- Frasi della forza ---------- */
const FORZA = [
  'La forza non è non cadere mai: è rialzarsi ogni volta.',
  'Il mio fuoco cresce ogni volta che ci provi, anche quando sbagli.',
  'Il cervello è come un muscolo: più lo alleni, più diventa forte.',
  'I campioni non nascono campioni: si allenano un giorno alla volta.',
  'Una cosa difficile è solo una cosa che ancora non conosci.',
  'Volere è già metà del lavoro. L’altra metà la facciamo insieme!',
  'Sbagliare è il modo in cui il cervello impara.',
  'Piano piano si arriva lontano. Un passo alla volta vale più di una corsa.',
  'Quando pensi «non ci riesco», aggiungi: «non ancora!».',
  'Il coraggio non è non avere paura: è provarci lo stesso.',
  'Ogni esercizio che fai mi dà una scintilla di energia.',
  'Oggi puoi essere un po’ più brava di ieri. Basta questo.',
  'Se una cosa non entra, prova a cantarla o a disegnarla!',
  'Le cose nuove all’inizio sembrano montagne. Poi diventano colline.'
];

/* ---------- Componenti riutilizzabili ---------- */
// Quiz a scelta multipla: domande {q, o:[...], a, e}
function runQuiz(box, questions, opts) {
  opts = opts || {};
  let i = 0, score = 0;
  const qs = questions.map(q => {
    const order = shuffle(q.o.map((_, k) => k));
    return { q: q.q, o: order.map(k => q.o[k]), a: order.indexOf(q.a), e: q.e, en: q.en || null };
  });
  function show() {
    if (i >= qs.length) {
      const txt = score === qs.length ? 'Tutte giuste, ' + NAME + '!' : score + ' su ' + qs.length + ': che impegno, ' + NAME + '!';
      box.innerHTML = '<div class="quiz" style="text-align:center"><div class="big-q" style="font-size:clamp(28px,5vw,40px)">' + esc(txt) + '</div>' +
        '<p style="font-weight:800">' + (score === qs.length ? '🏆' : '💪') + ' Il tuo drago ha preso energia a ogni risposta.</p>' +
        '<div class="row center"><button type="button" class="btn" style="--bc:' + (opts.color || 'var(--c6)') + '">Rifai la sfida</button></div></div>';
      box.querySelector('.btn').addEventListener('click', () => { if (opts.restart) opts.restart(); else runQuiz(box, questions, opts); });
      if (score >= Math.ceil(qs.length / 2)) { fanfare(); confetti(window.innerWidth / 2, window.innerHeight / 3, 30); }
      gain(3, box); activityDone();
      if (opts.onDone) opts.onDone(score, qs.length);
      return;
    }
    const q = qs[i];
    box.innerHTML = '<div class="quiz"><div class="qn">Domanda ' + (i + 1) + ' di ' + qs.length + '</div>' +
      '<div class="qt"><span>' + esc(q.q) + '</span>' + sayBtn(q.q, q.en) + '</div>' +
      '<div class="progress" style="--gc:' + (opts.color || 'var(--c6)') + '"><i style="width:' + (i / qs.length * 100) + '%"></i></div>' +
      '<div class="opts"></div><div class="fb"></div></div>';
    const wrap = box.querySelector('.opts');
    q.o.forEach((o, k) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'opt'; b.textContent = o;
      b.addEventListener('click', () => {
        wrap.querySelectorAll('.opt').forEach((x, j) => { x.disabled = true; if (j === q.a) x.classList.add('right'); });
        const ok = k === q.a; if (typeof progMark === 'function') progMark(ok);
        if (ok) { score++; ding(); cheer(b); gain(2, b); }
        else { b.classList.add('wrong'); oops(); cheer(b, pick(TRY), true); gain(1, b); }
        const fb = box.querySelector('.fb');
        fb.innerHTML = '<div class="explain"><b>' + (ok ? 'Giusto! ' : 'La risposta è: ' + esc(q.o[q.a]) + '. ') + '</b>' + (q.e ? esc(q.e) : '') +
          '<div class="row" style="margin-top:10px">' + (q.e ? sayBtn(q.e, q.en) : '') + '<button type="button" class="btn small" style="--bc:' + (opts.color || 'var(--c6)') + '">Avanti →</button></div></div>';
        fb.querySelector('.btn').addEventListener('click', () => { i++; show(); });
        fb.querySelector('.btn').focus();
      });
      wrap.appendChild(b);
    });
  }
  show();
}

// Carte curiosità
function renderFacts(box, facts, key) {
  box.innerHTML = '';
  box.className = 'facts';
  const shown = key && facts.length > 4 ? drawDeck('f-' + key, facts.length, 4).map(i => facts[i]) : facts;
  shown.forEach(f => {
    const d = document.createElement('div');
    d.className = 'fact'; d.setAttribute('aria-expanded', 'false');
    const draw = open => {
      d.setAttribute('aria-expanded', open ? 'true' : 'false');
      d.innerHTML = '<button type="button" class="fact-t" aria-expanded="' + open + '"><span class="q">' + esc(f[0]) + '</span>' +
        (open ? '<span class="a">' + esc(f[1]) + '</span>' : '<span class="hint">Scopri 👀</span>') + '</button>' +
        (open ? '<div class="row" style="margin-top:8px">' + sayBtn(f[0] + ' ' + f[1]) + '</div>' : '');
      d.querySelector('.fact-t').addEventListener('click', () => {
        const willOpen = !open; draw(willOpen);
        if (willOpen) { const k = 'fact-' + f[0]; const seen = store.get('seen', []); if (!seen.includes(k)) { seen.push(k); store.set('seen', seen); gain(1, d); } }
      });
    };
    draw(false);
    box.appendChild(d);
  });
  if (key && facts.length > 4) {
    const more = document.createElement('div');
    more.style.gridColumn = '1 / -1';
    more.innerHTML = '<button type="button" class="btn small ghost">🔄 Altre curiosità (' + facts.length + ' in tutto)</button>';
    more.querySelector('button').addEventListener('click', () => renderFacts(box, facts, key));
    box.appendChild(more);
  }
}

// Missioni da spuntare
function renderMissions(box, list, key, onFirst) {
  box.innerHTML = '';
  const done = new Set(store.get('mis-' + key, []));
  list.forEach((m, i) => {
    const li = document.createElement('li');
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'mission'; b.setAttribute('aria-pressed', done.has(i) ? 'true' : 'false');
    b.innerHTML = '<span class="box" aria-hidden="true">' + CHECK + '</span><span class="mt"><span class="mn">' + esc(m[0]) + '</span><span class="md">' + esc(m[1]) + '</span></span>';
    b.addEventListener('click', () => {
      const now = b.getAttribute('aria-pressed') !== 'true';
      b.setAttribute('aria-pressed', now ? 'true' : 'false');
      const set = new Set(store.get('mis-' + key, []));
      const rewarded = new Set(store.get('mis-rew-' + key, []));
      if (now) {
        set.add(i); cheer(b, 'Missione compiuta!'); ding();
        if (!rewarded.has(i)) { rewarded.add(i); store.set('mis-rew-' + key, [...rewarded]); gain(4, b); }
        if (onFirst) onFirst(b);
      } else set.delete(i);
      store.set('mis-' + key, [...set]);
    });
    li.appendChild(b); box.appendChild(li);
  });
}

// Tastierino numerico
function makeKeypad(box, onSubmit, opts) {
  opts = opts || {};
  let val = '';
  box.innerHTML = '<div class="answer-row"><div class="display empty" aria-live="polite">?</div>' + (opts.unit ? '<span class="pill">' + esc(opts.unit) + '</span>' : '') + '</div>' +
    '<div class="keypad">' + [1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => '<button type="button" class="key" data-k="' + n + '">' + n + '</button>').join('') +
    '<button type="button" class="key del" data-k="del" aria-label="Cancella">⌫</button><button type="button" class="key" data-k="0">0</button>' +
    '<button type="button" class="key go" data-k="ok" aria-label="Conferma">OK</button></div>';
  const disp = box.querySelector('.display');
  const draw = () => { disp.textContent = val === '' ? '?' : val; disp.classList.toggle('empty', val === ''); disp.classList.remove('ok', 'no'); };
  const press = k => {
    if (box.dataset.locked) return;
    if (k === 'del') val = val.slice(0, -1);
    else if (k === 'ok') { if (val !== '') onSubmit(parseInt(val, 10), api); return; }
    else if (val.length < 5) val = (val === '0' ? '' : val) + k;
    tone(520, .05); draw();
  };
  box.querySelectorAll('.key').forEach(b => b.addEventListener('click', () => press(b.dataset.k)));
  const onKey = e => {
    if (!document.body.contains(box)) { document.removeEventListener('keydown', onKey); return; }
    if (box.closest('[hidden]') || !$('modal').hidden) return;
    if (/^[0-9]$/.test(e.key)) press(e.key);
    else if (e.key === 'Backspace') press('del');
    else if (e.key === 'Enter') press('ok');
  };
  document.addEventListener('keydown', onKey);
  const api = {
    clear() { val = ''; delete box.dataset.locked; draw(); },
    mark(ok) { disp.classList.add(ok ? 'ok' : 'no'); if (typeof progMark === 'function') progMark(ok); },
    lock() { box.dataset.locked = '1'; }
  };
  return api;
}

// Mettere in ordine: items [{e, t}] nell'ordine giusto
function runOrder(box, items, opts) {
  opts = opts || {};
  let pos = 0, errors = 0;
  box.innerHTML = '<div class="seq" aria-live="polite"><span class="ph">' + esc(opts.placeholder || 'Tocca le carte nell’ordine giusto…') + '</span></div><div class="pool"></div><div class="fb"></div>';
  const seq = box.querySelector('.seq'), pool = box.querySelector('.pool');
  shuffle(items.map((it, k) => ({ ...it, k }))).forEach(it => {
    const b = document.createElement('button');
    b.type = 'button'; b.innerHTML = '<span class="e" aria-hidden="true">' + it.e + '</span>' + esc(it.t);
    b.addEventListener('click', () => {
      if (it.k === pos) {
        if (pos === 0) seq.innerHTML = '';
        const s = document.createElement('span'); s.className = 'slot';
        s.innerHTML = '<span class="e" aria-hidden="true">' + it.e + '</span>' + esc(it.t);
        seq.appendChild(s); b.remove(); pos++; ding();
        if (pos === items.length) {
          const fb = box.querySelector('.fb');
          fb.innerHTML = '<div class="explain"><b>' + (errors === 0 ? 'Perfetto al primo colpo! ' : 'Ce l’hai fatta! ') + '</b>' + esc(opts.explain || '') +
            '<div class="row" style="margin-top:10px">' + (opts.explain ? sayBtn(opts.explain) : '') + '<button type="button" class="btn small">Rifai</button></div></div>';
          fb.querySelector('.btn').addEventListener('click', () => runOrder(box, items, opts));
          cheer(seq, errors === 0 ? 'Perfetto, ' + NAME + '!' : null); fanfare();
          gain(errors === 0 ? 5 : 4, seq); activityDone();
          if (opts.onDone) opts.onDone(errors);
        }
      } else {
        errors++; oops();
        b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake');
        const fb = box.querySelector('.fb');
        fb.innerHTML = '<div class="explain">' + esc(opts.hint || 'Pensa: cosa viene prima?') + '</div>';
      }
    });
    pool.appendChild(b);
  });
}

// Scelta a piastrelle
function renderTiles(box, list, active, onPick) {
  box.innerHTML = ''; box.className = 'tiles';
  list.forEach(t => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'tile';
    b.style.setProperty('--tc', t.c); b.style.setProperty('--ts', t.s);
    b.setAttribute('aria-pressed', t.id === active ? 'true' : 'false');
    b.innerHTML = '<span class="ic" aria-hidden="true">' + t.ic + '</span><span class="tx"><span class="nm">' + esc(t.name) + '</span><span class="sk">' + esc(t.sk || '') + '</span>' + (t.ok ? '<span class="ok">' + esc(t.ok) + '</span>' : '') + '</span>';
    b.addEventListener('click', () => onPick(t.id));
    box.appendChild(b);
  });
}
function secHead(ic, title, sub, soft) {
  return '<div class="sec-head"><span class="badge" style="--hsoft:' + (soft || 'var(--c3-soft)') + '" aria-hidden="true">' + ic + '</span><div><h2>' + esc(title) + '</h2>' + (sub ? '<p class="sub">' + esc(sub) + '</p>' : '') + '</div></div>';
}

/* ---------- Navigazione ---------- */
const TABS = [
  ['home', '🏠', 'Casa', 'var(--c4-soft)'],
  ['diario', '📅', 'Diario', 'var(--c1-soft)'],
  ['routine', '☀️', 'Routine', 'var(--c3-soft)'],
  ['giochi', '🎮', 'Giochi', 'var(--c6-soft)'],
  ['mate', '🔢', 'Mate', 'var(--c1-soft)'],
  ['scienze', '🔬', 'Scienze', 'var(--c5-soft)'],
  ['scopri', '🌍', 'Scopri', 'var(--c2-soft)'],
  ['sport', '🤸\u200d♀️', 'Sport', 'var(--c5-soft)'],
  ['metodo', '🧠', 'Metodo', 'var(--c6-soft)']
];
const PAGES = {};
let current = 'home';
function renderTabs() {
  const box = $('tabs'); box.innerHTML = '';
  TABS.forEach(t => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'tab'; b.style.setProperty('--tsoft', t[3]);
    if (t[0] === current) b.setAttribute('aria-current', 'page');
    b.innerHTML = '<span class="e" aria-hidden="true">' + t[1] + '</span>' + t[2];
    b.addEventListener('click', () => go(t[0]));
    box.appendChild(b);
  });
}
function go(id) {
  current = id; store.set('tab', id);
  document.querySelectorAll('[data-page]').forEach(s => { s.hidden = s.id !== 'p-' + id; });
  renderTabs();
  try { speechSynthesis.cancel(); } catch (e) {}
  if (typeof clearGameTimers === 'function') clearGameTimers();
  if (PAGES[id]) PAGES[id]($('p-' + id));
  window.scrollTo({ top: 0, behavior: 'auto' });
}
$('mini').addEventListener('click', () => go('home'));

/* ---------- Compleanno ---------- */
function birthday() {
  const bd = CHILD.bd; if (!bd || !bd.d || !bd.m) return null;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let year = today.getFullYear();
  let next = new Date(year, bd.m - 1, bd.d);
  if (next < today) { year++; next = new Date(year, bd.m - 1, bd.d); }
  return { days: Math.round((next - today) / 86400000), age: bd.y ? year - bd.y : 0, label: bd.d + ' ' + MESI[bd.m - 1] };
}

/* ---------- Casa ---------- */
function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Buongiorno ' + NAME + '! ☀️' : h < 18 ? 'Buon pomeriggio ' + NAME + '! 🌈' : 'Buonasera ' + NAME + '! 🌙';
}
let forzaI = null;
PAGES.home = el => {
  const c = dcol(), i = levelOf(D.energy), ni = nextInfo(), s = dayState(), b = birthday();
  if (forzaI === null) { const fd = store.get('forza-day', null); if (fd && fd.date === todayKey() && fd.i < FORZA.length) forzaI = fd.i; else { forzaI = drawDeck('forza', FORZA.length, 1)[0]; store.set('forza-day', { date: todayKey(), i: forzaI }); } }
  const phrase = FORZA[forzaI];
  const days = store.get('days', []).length;
  const bdayTxt = !b ? '' : !b.age ? (b.days === 0 ? 'Oggi è il tuo compleanno! Auguri! 🎉' : b.days === 1 ? 'Domani è il tuo compleanno! 🎉' : 'al tuo compleanno 🎉') : b.days === 0 ? 'Oggi compi ' + b.age + ' anni! Auguri! 🎉' : b.days === 1 ? 'Domani compi ' + b.age + ' anni! 🎉' : 'al tuo ' + b.age + '° compleanno 🎉';
  el.innerHTML =
    '<p class="hello">' + greeting() + '</p>' +
    '<h1 class="page-title rainbow">Forza, ' + esc(NAME) + '!</h1>' +
    '<p class="page-sub">Ogni volta che ci provi, anche quando sbagli, ' + esc(D.name) + ' prende energia e diventa più forte.</p>' +
    '<div id="h-path"></div>' +
    '<div class="home-top">' +
      '<div class="den" style="--dcol:' + c[2] + ';--dsoft:' + c[3] + '">' +
        '<div class="bubble"><span>' + esc(D.name) + ' dice: «' + esc(phrase) + '»</span>' + sayBtn(D.name + ' dice: ' + phrase) + '</div>' +
        '<div class="kp-wrap">' + dragonSVG(i, D.color, 'bob') + (typeof keeperBadge === 'function' ? keeperBadge() : '') + '</div>' +
        '<div class="dname">' + esc(D.name) + '</div><div class="dlevel">' + esc(LEVELS[i].n) + ' · ' + D.energy + ' 🔥</div>' +
        (typeof keeperHome === 'function' ? keeperHome() : '') + '<div class="ebig" aria-hidden="true"><i style="width:' + ni.pct + '%"></i></div><div class="enext">' + esc(ni.text) + '</div>' +
        '<div class="row center" style="margin-top:12px"><button type="button" class="btn small ghost" id="h-next">Un’altra frase</button><button type="button" class="btn small ghost" id="h-edit">⚙️ Impostazioni</button><button type="button" class="btn small ghost" id="h-cust">✨ Personalizza</button><button type="button" class="btn small ghost" id="h-prog">📊 Progressi</button></div>' +
      '</div>' +
      '<div style="display:grid;gap:16px;align-content:start;min-width:0">' +
        (typeof homeMoodCard === 'function' ? homeMoodCard() : '') +
        '<div class="card">' + secHead('🎯', 'Le missioni di oggi', s.done.length + ' su ' + TODAY.length + ' · tutte insieme valgono +10 🔥', 'var(--c3-soft)') +
          '<div class="today-list" id="h-today"></div></div>' +
        (typeof homeDiaryCard === 'function' ? homeDiaryCard() : '') +
        '<button type="button" class="today" id="h-clock" style="--ts:var(--c5-soft);border-color:var(--c5)"><span class="ic" aria-hidden="true">🕐</span><span class="tx">Impara l’orologio<small>Lancette, trucchi e giochi</small></span><span class="st" aria-hidden="true">→</span></button>' +
        (typeof sportToday === 'function' && sportToday() ? (() => { const sp = sportToday(); return '<button type="button" class="today" id="h-sport" style="--ts:' + sp.r.s + ';border-color:' + sp.r.c + '"><span class="ic" aria-hidden="true">' + sp.r.ic + '</span><span class="tx">' + (sp.when === 'oggi' ? 'Oggi c\u2019è ' : 'Domani c\u2019è ') + esc(sp.r.sport.toLowerCase()) + '!<small>Prepara la borsa con la checklist</small></span><span class="st" aria-hidden="true">→</span></button>'; })() : '') +
        (b ? '<div class="card" style="--kc:var(--c1);--ks:var(--c1-soft)"><div class="bday"><span class="cake" aria-hidden="true">🎂</span><div>' +
          (b.days > 1 ? '<b>' + b.days + ' giorni</b>' : '') + '<div style="font-weight:800;font-size:18px">' + esc(bdayTxt) + '</div>' +
          '<div style="color:var(--ink-soft);font-weight:700;font-size:14px">' + esc(b.label) + '</div></div></div></div>' : '<button type="button" class="today" id="h-setbd" style="--ts:var(--c1-soft);border-color:var(--c1)"><span class="ic" aria-hidden="true">🎂</span><span class="tx">' + (childName() ? 'Quando è il tuo compleanno?' : 'Come ti chiami? Quando compi gli anni?') + '<small>Scrivilo nelle ⚙️ Impostazioni: resta solo su questo iPad 🔒</small></span><span class="st" aria-hidden="true">→</span></button>') +
      '</div>' +
    '</div>' +
    '<div class="sec">' + secHead('🌱', 'Come cresce ' + D.name, 'L’energia arriva da ogni cosa che fai: routine, esercizi, giochi, missioni. Anche dagli errori!', c[3]) +
      '<div class="grid3" id="h-levels"></div>' +
      '<div class="stat-row"><span class="pill">📅 ' + days + (days === 1 ? ' giorno' : ' giorni') + ' di allenamento</span><span class="pill">🔥 ' + D.energy + ' energia totale</span></div>' +
    '</div>' +
    (typeof backupCard === 'function' ? backupCard() : '') +
    '<footer class="note">' + esc(D.name) + ' ti aspetta ogni giorno!</footer>';

  const tl = $('h-today');
  TODAY.forEach(t => {
    const done = s.done.includes(t[0]);
    const b2 = document.createElement('button');
    b2.type = 'button'; b2.className = 'today' + (done ? ' done' : '');
    b2.style.setProperty('--ts', t[5]);
    b2.innerHTML = '<span class="ic" aria-hidden="true">' + t[1] + '</span><span class="tx">' + esc(t[2]) + '<small>' + esc(t[3]) + '</small></span><span class="st" aria-hidden="true">' + (done ? '✅' : '→') + '</span>';
    b2.setAttribute('aria-label', t[2] + (done ? ', fatto' : ''));
    b2.addEventListener('click', () => go(t[0]));
    tl.appendChild(b2);
  });
  const lv = $('h-levels');
  LEVELS.forEach((l, k) => {
    const reached = D.energy >= l.min;
    const d = document.createElement('div');
    d.className = 'card';
    d.style.cssText = 'padding:12px;text-align:center;' + (k === i ? '--kc:' + c[2] + ';--ks:' + c[3] : '') + (reached ? '' : ';opacity:.55');
    d.innerHTML = '<div style="width:90px;margin:0 auto">' + (reached ? dragonSVG(k, D.color) : '<div style="font-size:54px;line-height:90px">❔</div>') + '</div>' +
      '<div style="font-family:var(--font-display);font-weight:800;font-size:17px;line-height:1.1">' + esc(l.n) + '</div>' +
      '<div style="font-size:13px;font-weight:800;color:var(--ink-soft)">' + (k === 0 ? 'si parte!' : 'da ' + l.min + ' 🔥') + '</div>';
    lv.appendChild(d);
  });
  $('h-next').addEventListener('click', () => { forzaI = drawDeck('forza', FORZA.length, 1)[0]; PAGES.home(el); });
  $('h-edit').addEventListener('click', () => onboarding(true));
  if (typeof pathHome === 'function') pathHome($('h-path'));
  if ($('h-prog')) $('h-prog').addEventListener('click', () => openProg());
  if ($('h-setbd')) $('h-setbd').addEventListener('click', () => onboarding(true));
  if ($('h-cust')) $('h-cust').addEventListener('click', () => openCustomize('bimba'));
  if (typeof wireBackup === 'function') wireBackup();
  if ($('h-mood')) $('h-mood').addEventListener('click', () => go('diario'));
  if ($('h-clock')) $('h-clock').addEventListener('click', () => { mathSel = 'ore'; go('mate'); });
  if ($('h-diary')) $('h-diary').addEventListener('click', () => go('diario'));
  if ($('h-sport')) $('h-sport').addEventListener('click', () => { routineSel = sportToday().r.id; go('routine'); });
};

/* ---------- Primo avvio: nasce il drago ---------- */
function childFields(cf) {
  const opt = (v, t, sel) => '<option value="' + v + '"' + (String(sel) === String(v) ? ' selected' : '') + '>' + t + '</option>';
  const days = (id, sel) => '<select id="' + id + '" class="cf-sel">' + opt('', '—  nessuno', sel) + ['lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato', 'domenica'].map((g, k) => opt((k + 1) % 7, g, sel)).join('') + '</select>';
  const bd = cf.bd || {}, y0 = new Date().getFullYear();
  let dd = opt('', 'giorno', bd.d); for (let k = 1; k <= 31; k++) dd += opt(k, k, bd.d);
  let yy = opt('', 'anno', bd.y); for (let k = y0 - 4; k >= y0 - 16; k--) yy += opt(k, k, bd.y);
  return '<div class="cf-box"><div style="font-weight:900">🔒 Chi sei? <small style="font-weight:700;color:var(--ink-soft)">Resta solo su questo iPad</small></div>' +
    '<label for="cf-name" class="cf-l">Il tuo nome</label><input type="text" id="cf-name" maxlength="20" autocomplete="off" placeholder="Il tuo nome" value="' + esc(cf.name || '') + '">' +
    '<div class="cf-l">Il tuo compleanno</div><div class="cf-row"><select id="cf-d" class="cf-sel">' + dd + '</select><select id="cf-m" class="cf-sel">' + opt('', 'mese', bd.m) + MESI.map((n, k) => opt(k + 1, n, bd.m)).join('') + '</select><select id="cf-y" class="cf-sel">' + yy + '</select></div>' +
    '<div class="cf-row"><label class="cf-l" for="cf-patt">⛸️ Pattinaggio il</label>' + days('cf-patt', cf.patt) + '</div>' +
    '<div class="cf-row"><label class="cf-l" for="cf-aerea">🎪 Aerea il</label>' + days('cf-aerea', cf.aerea) + '</div></div>';
}
function readChildFields() {
  const v = id => ($(id) ? $(id).value : ''), n = x => x === '' ? null : +x;
  return { name: v('cf-name').trim().slice(0, 20), bd: { d: n(v('cf-d')), m: n(v('cf-m')), y: n(v('cf-y')) }, patt: n(v('cf-patt')), aerea: n(v('cf-aerea')) };
}
function onboarding(edit) {
  let color = (D && D.color) || 'verde';
  let cf = JSON.parse(JSON.stringify(CHILD || {}));
  const draw = () => {
    openModal(
      '<div>' + dragonSVG(0, color) + '</div>' +
      '<div class="big">' + (edit ? 'Il tuo drago' : 'Un uovo per te!') + '</div>' +
      '<p>' + (edit ? 'Puoi cambiare nomi, colore, compleanno e giorni dello sport quando vuoi.' : 'Ciao! Dentro quest’uovo c’è un drago. Crescerà con la tua forza di volontà: ogni volta che ci provi, prende energia.') + '</p>' +
      '<label for="ob-name" style="display:block;font-weight:800;margin-top:14px">Come lo vuoi chiamare?</label>' +
      '<input type="text" id="ob-name" maxlength="16" autocomplete="off" placeholder="Scrivi il suo nome" value="' + esc((D && D.name) || '') + '">' +
      '<p style="margin-top:14px">Di che colore?</p><div class="swatches" id="ob-sw"></div>' + childFields(cf) +
      '<div class="row"><button type="button" class="btn" id="ob-go" style="--bc:' + DCOLORS[color][2] + ';--bs:' + DCOLORS[color][3] + '">' + (edit ? 'Salva' : 'Fai nascere il mio drago!') + '</button>' +
      (edit ? '<button type="button" class="btn ghost" id="ob-x">Annulla</button>' : '') + '</div>' +
      (edit ? '' : '<div class="row center" style="margin-top:10px"><button type="button" class="btn small ghost" id="ob-restore">📂 Ho già un drago: ripristina i miei progressi</button></div>'),
      [DCOLORS[color][2], DCOLORS[color][3]]);
    const sw = $('ob-sw');
    Object.keys(DCOLORS).filter(colorUsable).forEach(k => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'swatch'; b.style.setProperty('--sw', DCOLORS[k][0]);
      b.setAttribute('aria-label', DCOLORS[k][4]); b.setAttribute('aria-pressed', k === color ? 'true' : 'false');
      b.addEventListener('click', () => { const n = $('ob-name').value; cf = readChildFields(); color = k; draw(); $('ob-name').value = n; });
      sw.appendChild(b);
    });
    if ($('ob-restore')) $('ob-restore').addEventListener('click', () => { if (typeof restoreFromFile === 'function') restoreFromFile(); });
    $('ob-go').addEventListener('click', () => {
      const n = $('ob-name').value.trim();
      if (!n) { $('ob-name').focus(); $('ob-name').placeholder = 'Prima scrivi un nome!'; return; }
      const first = !D;
      const old = JSON.stringify(CHILD), nc = Object.assign({}, CHILD, readChildFields(), { asked: 1 });
      CHILD = nc; store.set('child', nc);
      D = { name: n, color: color, energy: D ? D.energy : 0 };
      store.set('dragon', D);
      if (JSON.stringify(nc) !== old) applyChild();
      delete $('modal').dataset.lock;
      closeModal(); updateBar(); go('home');
      if (first) {
        setTimeout(() => { cheer($('mini'), 'Ciao ' + n + '!'); fanfare(); Voice.ok && Voice.say('Ciao ' + (childName() || '') + '! Io sono ' + n + '. Allenati con me e diventerò un drago fortissimo!'); }, 300);
      }
    });
    if (edit) $('ob-x').addEventListener('click', closeModal);
  };
  if (!edit) $('modal').dataset.lock = '1';
  draw();
}
