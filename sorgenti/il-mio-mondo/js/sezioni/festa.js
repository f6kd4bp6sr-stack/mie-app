/* ================= 🎂 LA FESTA DI COMPLEANNO =================
   La data è quella che la bambina ha scritto nelle ⚙️ Impostazioni (resta sull'iPad, mai nel codice).
   - Vigilia (prima apertura del giorno): il pacco chiuso, «si apre domani».
   - Giorno del compleanno: ogni volta che apre l'app riparte la festa (pulsante «Entra» dopo pochi secondi):
     pacco → «Tanti auguri a te» (melodia tradizionale, libera da diritti, suonata dal vivo) → candeline da soffiare →
     palloncini con messaggi → regalo del drago → il tuo anno → capsula del tempo.
   - Giorno dopo: la festa c'è anche il giorno dopo, se nel giorno del compleanno l'app non è stata aperta.
   - Dopo la festa: 10 sorprese, una per ogni giorno in cui apre l'app.
   Microfono (candeline): misura solo quanto forte soffia; non registra e non salva nulla. */
const F_KEY = 'festa', CAP_KEY = 'capsula';
const fIso = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
const fDay0 = () => { const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()); };
const fBdIn = y => new Date(y, CHILD.bd.m - 1, CHILD.bd.d);
const fLabel = d => d.getDate() + ' ' + MESI[d.getMonth()] + ' ' + d.getFullYear();
const fNm = () => childName();
const fDei = n => (n === 8 || n === 11 || n === 18 || (n >= 80 && n < 90)) ? 'degli' : 'dei';
const fRec = () => store.get(F_KEY, {}) || {};
const fCaps = () => store.get(CAP_KEY, {}) || {};

/* che giorno è oggi per la festa? { kind: 'day' | 'after' | 'eve' | 'sorp', year, age, n } */
function festaInfo() {
  const bd = CHILD.bd; if (!D || !bd || !bd.d || !bd.m) return null;
  const t = fDay0(), y = t.getFullYear(), rec = fRec(), today = fIso(t);
  const dd = d => Math.round((t - d) / 864e5);
  const mk = (kind, yy, x) => { const a = bd.y ? yy - bd.y : 0; return Object.assign({ kind, year: yy, age: a > 0 && a < 120 ? a : 0 }, x || {}); };
  for (const yy of [y, y - 1]) {
    const k = dd(fBdIn(yy));
    if (k === 0) return mk('day', yy);
    if (k === 1) { const r = rec[yy]; if (!r || r.first === today) return mk('after', yy); }
  }
  for (const yy of [y, y + 1]) if (dd(fBdIn(yy)) === -1) return mk('eve', yy);
  for (const yy of [y, y - 1]) {
    const r = rec[yy]; if (!r || !r.first) continue;
    const since = dd(new Date(+r.first.slice(0, 4), +r.first.slice(5, 7) - 1, +r.first.slice(8, 10)));
    if (since < 1 || since > 60) continue;
    const s = rec.sorp && rec.sorp.y === yy ? rec.sorp : { y: yy, n: 0, last: '' };
    if (s.n < 10 && s.last !== today) return mk('sorp', yy, { n: s.n + 1 });
  }
  return null;
}
let __fMemo = { k: '', v: null };
function festaActive() {
  const k = todayKey() + '|' + JSON.stringify(CHILD.bd || {}) + '|' + (fRec()[new Date().getFullYear()] ? 1 : 0);
  if (__fMemo.k !== k) __fMemo = { k, v: festaInfo() };
  const v = __fMemo.v; return v && (v.kind === 'day' || v.kind === 'after') ? v : null;
}
/* il drago porta il cappellino della festa per tutto il giorno (la corona del compleanno ha la precedenza) */
let __fAccPreview = '';
function festaHat() { if (__fAccPreview) return __fAccPreview; const a = store.get('dragon-acc', ''); return festaActive() && !/^bday/.test(a) ? 'festa' : ''; }
const fRecSet = (yy, patch) => { const r = fRec(); r[yy] = Object.assign({}, r[yy] || {}, patch); store.set(F_KEY, r); __fMemo.k = ''; return r[yy]; };

/* ---------- i regali nel negozio ---------- */
const fCrownId = I => I.age ? 'd-bday' + I.age : 'd-bday-' + I.year;
function festaShop() {
  if (typeof SHOP === 'undefined') return;
  for (let i = SHOP.length - 1; i >= 0; i--) if (SHOP[i].fs) SHOP.splice(i, 1);
  const own = ownedShop(), add = it => SHOP.push(Object.assign({ who: 'd', kind: 'dacc', p: 0, fs: 1 }, it));
  own.filter(id => /^d-bday/.test(id)).forEach(id => { const n = (id.match(/^d-bday(\d+)$/) || [])[1]; add({ id, v: n ? 'bday' + n : 'bday', ic: '👑', n: n ? 'Corona ' + fDei(+n) + ' ' + n + ' anni' : 'Corona del compleanno', req: ['fs', id], rq: 'Regalo del compleanno' }); });
  add({ id: 'd-festa', v: 'festa', ic: '🥳', n: 'Cappellino della festa', req: ['fs', 'd-festa'], rq: 'Sorpresa del compleanno' });
  const bd = CHILD.bd; if (bd && bd.y && bd.m && bd.d) {
    const t = fDay0(); let yy = t.getFullYear(); if (fBdIn(yy) < t || own.includes('d-bday' + (yy - bd.y))) yy++;
    const id = 'd-bday' + (yy - bd.y);
    if (!own.includes(id) && yy - bd.y > 0) add({ id, v: 'bday' + (yy - bd.y), ic: '👑', n: 'Corona ' + fDei(yy - bd.y) + ' ' + (yy - bd.y) + ' anni', req: ['fs', id], rq: 'Arriva al prossimo compleanno 🎂' });
  }
}
const fOwn = id => { const o = ownedShop(); if (!o.includes(id)) { o.push(id); store.set('shop-owned', o); } festaShop(); };

/* ---------- suoni della festa (generati dal vivo, senza file) ---------- */
let FSND = null, fNoiseBuf = null;
const fMuted = () => !!store.get('festa-mute', false);
const fMidi = m => 440 * Math.pow(2, (m - 69) / 12);
function fOut() {
  const a = audio(); if (!a) return null;
  if (!FSND || FSND.ctx !== a) {
    const g = a.createGain(); g.gain.value = fMuted() ? 0 : 0.9;
    const c = a.createDynamicsCompressor(); c.threshold.value = -18; c.ratio.value = 3;
    g.connect(c); c.connect(a.destination); FSND = { ctx: a, g, nodes: [] };
  }
  return FSND;
}
function fNote(f, t, dur, vol, type, att) {
  const S = fOut(); if (!S) return; const a = S.ctx;
  const o = a.createOscillator(), g = a.createGain(); o.type = type || 'triangle'; o.frequency.value = f;
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(Math.max(0.0002, vol), t + (att || 0.015)); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(S.g); o.start(t); o.stop(t + dur + 0.05);
  S.nodes.push(o); o.onended = () => { const i = S.nodes.indexOf(o); if (i >= 0) S.nodes.splice(i, 1); };
}
function fNoise(t, dur, vol, freq, q, type) {
  const S = fOut(); if (!S) return; const a = S.ctx;
  if (!fNoiseBuf || fNoiseBuf.sampleRate !== a.sampleRate) { fNoiseBuf = a.createBuffer(1, a.sampleRate, a.sampleRate); const d = fNoiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; }
  const s = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
  s.buffer = fNoiseBuf; f.type = type || 'bandpass'; f.frequency.value = freq || 1500; f.Q.value = q || 1;
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  s.connect(f); f.connect(g); g.connect(S.g); s.start(t, Math.random() * 0.5); s.stop(t + dur + 0.02);
  S.nodes.push(s); s.onended = () => { const i = S.nodes.indexOf(s); if (i >= 0) S.nodes.splice(i, 1); };
}
const fNow = () => { const S = fOut(); return S ? S.ctx.currentTime : 0; };
const fPop = () => { const t = fNow(); fNoise(t, 0.1, 0.7, 1600, 0.7); fNote(1200, t, 0.06, 0.12, 'square'); fNote(500, t + 0.02, 0.08, 0.08, 'sine'); };
const fWhoosh = () => { const S = fOut(); if (!S) return; const a = S.ctx, t = a.currentTime, s = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain(); fNoise(t, 0.01, 0.0001); s.buffer = fNoiseBuf; f.type = 'bandpass'; f.Q.value = 2; f.frequency.setValueAtTime(400, t); f.frequency.exponentialRampToValueAtTime(3500, t + 0.5); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.5, t + 0.15); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.6); s.connect(f); f.connect(g); g.connect(S.g); s.start(t); s.stop(t + 0.65); };
const fPuff = () => { const t = fNow(); fNoise(t, 0.18, 0.25, 900, 0.6, 'lowpass'); };
function fClap(dur) { const t0 = fNow(); if (!t0 && !fOut()) return; const n = Math.round(dur * 26); for (let i = 0; i < n; i++) { const x = Math.random() * dur, env = 1 - x / dur * 0.7; fNoise(t0 + x, 0.025 + Math.random() * 0.03, 0.5 * env, 1100 + Math.random() * 1600, 1.4); } }
function fTada() { const t = fNow(); [60, 64, 67, 72, 76, 79, 84].forEach((m, i) => { fNote(fMidi(m), t + i * 0.07, 0.6, 0.12, 'triangle'); fNote(fMidi(m + 12), t + i * 0.07, 0.3, 0.04, 'sine'); }); }
function fLock() { const t = fNow(); fNote(330, t, 0.12, 0.12, 'square'); fNote(247, t + 0.1, 0.18, 0.1, 'square'); }

/* «Tanti auguri a te»: melodia tradizionale (pubblico dominio), in 3/4 */
const F_SONG = [
  [[67, .75], [67, .25], [69, 1], [67, 1], [72, 1], [71, 2]],
  [[67, .75], [67, .25], [69, 1], [67, 1], [74, 1], [72, 2]],
  [[67, .75], [67, .25], [79, 1], [76, 1], [72, 1], [71, 1], [69, 2]],
  [[77, .75], [77, .25], [76, 1], [72, 1], [74, 1], [72, 3]]
];
const F_CH = { C: [48, 52, 55], G: [43, 50, 55], F: [41, 48, 53] };
const F_HARM = [[['C', 3], ['G', 2]], [['G', 3], ['C', 2]], [['C', 3], ['F', 3]], [['C', 2], ['G', 1], ['C', 3]]];
const F_WORDS = [[0, 2, 4, 5], [0, 2, 4, 5], [0, 2, 4, 5], [0, 2, 4, 5]];
function fSong(onNote) {
  const S = fOut(); if (!S) return 0;
  const beat = 0.56, t0 = S.ctx.currentTime + 0.35; let t = t0;
  F_SONG.forEach((line, li) => {
    const ls = t; let tt = t;
    line.forEach(([m, b], ni) => {
      fNote(fMidi(m), tt, b * beat * 0.95, 0.2, 'triangle', 0.02);
      fNote(fMidi(m + 12), tt, Math.min(0.5, b * beat), 0.05, 'sine');
      if (onNote) { const ms = (tt - S.ctx.currentTime) * 1000; FS && FS.t(() => onNote(li, ni), Math.max(0, ms)); }
      tt += b * beat;
    });
    // accompagnamento a valzer: basso sul primo tempo, accordo sul secondo e sul terzo
    let ht = ls + beat;
    F_HARM[li].forEach(([c, n]) => { for (let k = 0; k < n; k++) { const ch = F_CH[c], bt = ht + k * beat; if (k % 3 === 0) fNote(fMidi(ch[0] - 12), bt, beat * 0.9, 0.12, 'sine'); else ch.forEach(x => fNote(fMidi(x + 12), bt, beat * 0.45, 0.025, 'triangle')); } ht += n * beat; });
    t = tt;
  });
  return (t - S.ctx.currentTime) * 1000;
}
/* musica allegra di sottofondo (palloncini, il tuo anno, capsula) */
function fLoopStart() {
  if (!FS || FS.loop || fMuted()) return;
  const S = fOut(); if (!S) return;
  const a = S.ctx, sp = 60 / 112 / 2, prog = [[60, 64, 67], [55, 59, 62], [57, 60, 64], [53, 57, 60]], arp = [0, 1, 2, 1, 0, 2, 1, 2];
  let next = a.currentTime + 0.1, step = 0;
  FS.loop = setInterval(() => {
    while (next < a.currentTime + 0.4) {
      const ch = prog[Math.floor(step / 8) % 4], s = step % 8;
      if (s === 0 || s === 4) fNote(fMidi(ch[0] - 12), next, 0.32, 0.09, 'sine');
      fNote(fMidi(ch[arp[s]] + 12), next, 0.16, 0.035, 'triangle');
      if (s % 2 === 1) fNoise(next, 0.025, 0.035, 7000, 0.7, 'highpass');
      next += sp; step++;
    }
  }, 120);
}
function fLoopStop() { if (FS && FS.loop) { clearInterval(FS.loop); FS.loop = null; } }
function fSilence() { fLoopStop(); if (FSND) { FSND.nodes.slice().forEach(n => { try { n.stop(); } catch (e) {} }); FSND.nodes = []; } }

/* ---------- disegni ---------- */
const F_INK = '#33304a';
function fGiftSVG(cls, col) {
  const c = col || ['#ff7a9c', '#ff5c8a'];
  return '<svg class="fs-gift ' + (cls || '') + '" viewBox="0 0 200 200" role="img" aria-label="Un pacco regalo">' +
    '<g class="fs-rays" fill="#ffe680" opacity=".75">' + [0, 45, 90, 135, 180, 225, 270, 315].map(r => '<path d="M100 92 L92 10 L108 10 Z" transform="rotate(' + r + ' 100 92)"/>').join('') + '</g>' +
    '<ellipse cx="100" cy="188" rx="70" ry="7" fill="#000" opacity=".15"/>' +
    '<g><rect x="34" y="92" width="132" height="92" rx="10" fill="' + c[0] + '" stroke="' + F_INK + '" stroke-width="4"/>' +
    '<circle cx="58" cy="118" r="7" fill="#fff" opacity=".55"/><circle cx="140" cy="156" r="8" fill="#fff" opacity=".55"/><circle cx="64" cy="164" r="5" fill="#fff" opacity=".55"/><circle cx="142" cy="116" r="5" fill="#fff" opacity=".55"/>' +
    '<rect x="88" y="92" width="24" height="92" fill="#ffd23f" stroke="' + F_INK + '" stroke-width="4"/></g>' +
    '<g class="fs-glid"><path d="M100 68 C78 34 52 44 66 68 Z" fill="#ffd23f" stroke="' + F_INK + '" stroke-width="4" stroke-linejoin="round"/><path d="M100 68 C122 34 148 44 134 68 Z" fill="#ffd23f" stroke="' + F_INK + '" stroke-width="4" stroke-linejoin="round"/>' +
    '<rect x="26" y="66" width="148" height="30" rx="8" fill="' + c[1] + '" stroke="' + F_INK + '" stroke-width="4"/><rect x="88" y="66" width="24" height="30" fill="#ffd23f" stroke="' + F_INK + '" stroke-width="4"/></g></svg>';
}
function fCakeSVG(n) {
  const x0 = 92, x1 = 228, cs = [];
  for (let i = 0; i < n; i++) {
    const x = n === 1 ? 160 : x0 + i * (x1 - x0) / (n - 1), col = ['#5aa9ff', '#ff7a9c', '#4bc0a8', '#a879ff', '#ff9f43'][i % 5];
    cs.push('<g><rect x="' + (x - 4.5) + '" y="62" width="9" height="46" rx="3" fill="#fff" stroke="' + F_INK + '" stroke-width="2"/>' +
      '<path d="M' + (x - 4.5) + ' 72 l9 -6 M' + (x - 4.5) + ' 84 l9 -6 M' + (x - 4.5) + ' 96 l9 -6" stroke="' + col + '" stroke-width="3"/>' +
      '<path d="M' + x + ' 62 v-6" stroke="' + F_INK + '" stroke-width="2"/>' +
      '<g class="fs-smoke" data-s="' + i + '"><circle cx="' + x + '" cy="44" r="5" fill="#ddd"/><circle cx="' + (x + 4) + '" cy="36" r="4" fill="#e8e8e8"/></g>' +
      '<g class="fs-fl" data-f="' + i + '" role="button" aria-label="Fiammella ' + (i + 1) + '"><circle cx="' + x + '" cy="46" r="13" fill="#ffd23f" opacity=".28"/>' +
      '<path d="M' + x + ' 30 C' + (x + 8) + ' 40 ' + (x + 7) + ' 52 ' + x + ' 56 C' + (x - 7) + ' 52 ' + (x - 8) + ' 40 ' + x + ' 30 Z" fill="#ff9f43"/>' +
      '<path d="M' + x + ' 39 C' + (x + 4) + ' 45 ' + (x + 4) + ' 51 ' + x + ' 54 C' + (x - 4) + ' 51 ' + (x - 4) + ' 45 ' + x + ' 39 Z" fill="#fff3a0"/></g></g>');
  }
  const spr = []; for (let i = 0; i < 26; i++) { const x = 52 + (i * 37) % 216, y = 196 + (i * 23) % 56; spr.push('<rect x="' + x + '" y="' + y + '" width="9" height="4" rx="2" fill="' + ['#ffd23f', '#5aa9ff', '#4bc0a8', '#a879ff', '#fff'][i % 5] + '" transform="rotate(' + ((i * 47) % 180) + ' ' + x + ' ' + y + ')"/>'); }
  return '<svg viewBox="0 0 320 290" role="img" aria-label="Una torta con ' + n + ' candeline">' +
    '<ellipse cx="160" cy="276" rx="146" ry="14" fill="#e9e4f5" stroke="' + F_INK + '" stroke-width="3"/>' +
    '<rect x="38" y="170" width="244" height="100" rx="18" fill="#ff9fbf" stroke="' + F_INK + '" stroke-width="4"/>' + spr.join('') +
    '<path d="M40 186 Q40 170 58 170 L262 170 Q280 170 280 186 L280 194 Q268 208 256 194 Q244 214 230 194 Q214 210 200 194 Q186 214 170 194 Q156 208 142 194 Q126 214 112 194 Q98 208 84 194 Q70 212 56 194 Q48 204 40 194 Z" fill="#fff" stroke="' + F_INK + '" stroke-width="3" stroke-linejoin="round"/>' +
    '<rect x="72" y="104" width="176" height="72" rx="14" fill="#fff1bf" stroke="' + F_INK + '" stroke-width="4"/>' +
    '<path d="M74 118 Q74 104 88 104 L232 104 Q246 104 246 118 L246 124 Q236 136 226 124 Q214 140 202 124 Q190 136 178 124 Q166 140 154 124 Q142 136 130 124 Q118 140 106 124 Q94 136 84 124 Q78 132 74 124 Z" fill="#ff7a9c" stroke="' + F_INK + '" stroke-width="3" stroke-linejoin="round"/>' +
    '<g fill="#ff5c8a"><circle cx="100" cy="152" r="5"/><circle cx="140" cy="158" r="5"/><circle cx="180" cy="152" r="5"/><circle cx="220" cy="158" r="5"/></g>' +
    cs.join('') + '</svg>';
}
function fCapSVG(cls) {
  return '<svg class="fs-cap ' + (cls || '') + '" viewBox="0 0 200 200" role="img" aria-label="La capsula del tempo">' +
    '<ellipse cx="100" cy="186" rx="60" ry="7" fill="#000" opacity=".15"/>' +
    '<rect x="52" y="86" width="96" height="94" rx="20" fill="#5aa9ff" stroke="' + F_INK + '" stroke-width="4"/>' +
    '<rect x="64" y="100" width="72" height="12" rx="6" fill="#cfe5ff"/><circle cx="100" cy="146" r="18" fill="#ffd23f" stroke="' + F_INK + '" stroke-width="4"/><path d="M100 134 v12 l8 6" stroke="' + F_INK + '" stroke-width="4" stroke-linecap="round" fill="none"/>' +
    '<g class="fs-caplid"><path d="M48 90 Q100 30 152 90 Z" fill="#a879ff" stroke="' + F_INK + '" stroke-width="4" stroke-linejoin="round"/><circle cx="100" cy="52" r="7" fill="#ffd23f" stroke="' + F_INK + '" stroke-width="3"/></g>' +
    '<g class="fs-caplock"><rect x="86" y="74" width="28" height="22" rx="5" fill="#ffd23f" stroke="' + F_INK + '" stroke-width="3"/><path d="M92 74 v-6 a8 8 0 0 1 16 0 v6" fill="none" stroke="' + F_INK + '" stroke-width="3"/></g></svg>';
}

/* ---------- la finestra della festa ---------- */
let FS = null;
const festaBusy = () => !!FS;
function fsShell(cls) {
  fsClose(true);
  const o = document.createElement('div'); o.id = 'festa'; o.className = 'fs ' + (cls || '');
  o.setAttribute('role', 'dialog'); o.setAttribute('aria-modal', 'true'); o.setAttribute('aria-label', 'La festa di compleanno');
  const bulbs = Array.from({ length: 16 }, (_, i) => '<i style="--b:' + ['#ff7a9c', '#ffd23f', '#4bc0a8', '#5aa9ff', '#a879ff', '#ff9f43'][i % 6] + ';animation-delay:' + (i % 4) * 0.4 + 's"></i>').join('');
  o.innerHTML = '<div class="fs-lights" aria-hidden="true">' + bulbs + '</div><div class="fs-field" aria-hidden="false"></div>' +
    '<div class="fs-top"><button type="button" class="fs-tb" id="fs-snd" aria-label="Suono della festa">' + (fMuted() ? '🔇' : '🔊') + '</button><button type="button" class="fs-tb fs-enter" id="fs-enter" hidden>Entra ➜</button></div>' +
    '<div class="fs-stage" id="fs-stage"></div>';
  document.body.appendChild(o); document.body.classList.add('fs-lock');
  FS = { o, st: o.querySelector('#fs-stage'), field: o.querySelector('.fs-field'), timers: [], raf: 0, loop: null, blow: null, music: false };
  FS.t = (fn, ms) => { const id = setTimeout(() => { if (FS && FS.o === o) fn(); }, ms); FS.timers.push(id); return id; };
  o.querySelector('#fs-snd').addEventListener('click', e => {
    const m = !fMuted(); store.set('festa-mute', m); e.currentTarget.textContent = m ? '🔇' : '🔊';
    const S = fOut(); if (S) S.g.gain.setTargetAtTime(m ? 0 : 0.9, S.ctx.currentTime, 0.05);
    if (m) fLoopStop(); else if (FS.wantLoop) fLoopStart();
  });
  o.querySelector('#fs-enter').addEventListener('click', () => fsClose());
  try { if (typeof Music !== 'undefined' && Music.playing) { Music.stop(true); FS.music = true; } } catch (e) {}
  return FS;
}
function fsEnterLater(ms) { if (FS) FS.t(() => { const b = $('fs-enter'); if (b) b.hidden = false; }, ms); }
function fsClose(silent) {
  if (!FS) return;
  const o = FS.o; FS.timers.forEach(clearTimeout); cancelAnimationFrame(FS.raf); fBlowStop(); fSilence();
  try { speechSynthesis.cancel(); } catch (e) {}
  const wasMusic = FS.music; FS = null; o.remove(); document.body.classList.remove('fs-lock');
  if (__fPrev && !silent) { festaPreviewEnd(); return; }
  if (silent) return;
  festaPaint();
  try { if (typeof Music !== 'undefined' && (wasMusic || Music.pref().on) && !Music.playing) Music.start(); } catch (e) {}
  if (typeof go === 'function' && typeof current !== 'undefined' && (current === 'home' || current === 'io')) go(current);
  if (typeof greetIfNew === 'function') setTimeout(greetIfNew, 600);
}
function fsScene(html, cls) { if (!FS) return null; FS.st.innerHTML = '<div class="fs-scene ' + (cls || '') + '">' + html + '</div>'; FS.st.classList.toggle('top', cls === 'fs-balsc'); FS.st.scrollTop = 0; FS.o.scrollTop = 0; return FS.st.firstChild; }
const fsRain = n => { if (!FS || reduce) return; for (let i = 0; i < n; i++) { const p = document.createElement('i'); p.className = 'fs-cf'; p.style.cssText = 'left:' + Math.random() * 100 + '%;background:' + ['#ff7a9c', '#ffd23f', '#4bc0a8', '#5aa9ff', '#a879ff', '#ff9f43', '#fff'][i % 7] + ';animation-duration:' + (2.2 + Math.random() * 2.2) + 's;animation-delay:' + Math.random() * 1.2 + 's;width:' + (7 + Math.random() * 7) + 'px'; FS.field.appendChild(p); setTimeout(() => p.remove(), 6000); } };
const fBurst = (el, n) => { try { const r = el.getBoundingClientRect(); confetti(r.left + r.width / 2, r.top + r.height / 2, n || 30); } catch (e) {} };
function fDecoBalloons(n) {
  if (!FS || reduce) return;
  for (let i = 0; i < n; i++) {
    const b = document.createElement('span'); b.className = 'fs-bal deco';
    b.style.cssText = '--x:' + (4 + Math.random() * 88) + '%;--c:' + ['#ff7a9c', '#ffd23f', '#4bc0a8', '#5aa9ff', '#a879ff', '#ff9f43'][i % 6] + ';--d:' + (9 + Math.random() * 6) + 's;--dl:-' + (Math.random() * 9) + 's';
    FS.field.appendChild(b);
  }
}
function fSay(t) { try { Voice.say(t); } catch (e) {} }

/* ---------- 1. il pacco ---------- */
function festaOpen() {
  const I = festaActive(); if (!I || !D) return false;
  const today = fIso(fDay0()), r = fRec()[I.year] || {};
  fRecSet(I.year, { first: r.first || today, n: (r.n || 0) + 1 });
  fsShell('night'); fsEnterLater(5000);
  const nm = fNm();
  const s = fsScene('<p class="fs-kick">' + (I.kind === 'after' ? 'Ieri era un giorno speciale…' : 'Oggi è un giorno speciale…') + '</p>' +
    '<button type="button" class="fs-giftbtn" id="fs-gift" aria-label="Apri il pacco">' + fGiftSVG('wiggle') + '</button>' +
    '<h2 class="fs-h">🎁 C’è un regalo per te' + (nm ? ', ' + esc(nm) : '') + '!</h2><p class="fs-p">Tocca il pacco per aprirlo</p>', 'fs-pacco');
  $('fs-gift').addEventListener('click', e => {
    const g = e.currentTarget; if (g.dataset.open) return; g.dataset.open = 1;
    fOut(); setTimeout(() => { try { if (Music.playing) { Music.stop(true); FS.music = true; } } catch (x) {} }, 60);
    g.querySelector('.fs-gift').classList.remove('wiggle'); g.querySelector('.fs-gift').classList.add('open'); fWhoosh();
    FS.t(() => { FS.o.classList.remove('night'); FS.o.classList.add('party'); fBurst(g, 70); fsRain(70); fDecoBalloons(8); fTada(); }, 450);
    FS.t(() => fsSong(I), 1500);
  });
  return s;
}

/* ---------- 2. Tanti auguri ---------- */
function fsSong(I) {
  const nm = fNm(), i = Math.max(1, levelOf(D.energy));
  const head = I.age ? (I.kind === 'after' ? 'Ieri hai compiuto ' + I.age + ' anni!' : 'Oggi compi ' + I.age + ' anni!') : 'Buon compleanno!';
  const lines = ['Tanti auguri a te', 'Tanti auguri a te', 'Tanti auguri a ' + (nm || 'te'), 'Tanti auguri a te!'];
  fsScene((I.age ? '<div class="fs-age">' + I.age + '</div>' : '<div class="fs-age emo">🎂</div>') + '<h2 class="fs-h">' + esc(head) + '</h2>' +
    '<div class="fs-dance"><div class="fs-girl" id="fs-girl"></div><div class="fs-drg">' + dragonSVG(i, D.color, 'fs-dancing') + '</div></div>' +
    '<div class="fs-lyr" id="fs-lyr">' + lines.map((l, k) => { const w = l.split(' '), ws = [w[0], w[1], w[2], w.slice(3).join(' ')]; return '<p class="fs-l" data-l="' + k + '">' + ws.map((x, j) => '<span data-w="' + j + '">' + esc(x) + '</span>').join(' ') + '</p>'; }).join('') + '</div>' +
    '<div id="fs-bub"></div><div class="fs-act" id="fs-act"></div>', 'fs-song');
  // la bambina balla accanto al drago
  if (typeof Girl !== 'undefined' && !reduce) {
    const poses = ['jump', 'hop', 'spin', 'wave'], t0 = performance.now();
    const anim = now => { const el = $('fs-girl'); if (!FS || !el) return; const ms = now - t0, p = poses[Math.floor(ms / 2600) % poses.length]; try { el.innerHTML = Girl.at(p, ms % 2600, 'var(--c1)'); } catch (e) {} FS.raf = requestAnimationFrame(anim); };
    FS.raf = requestAnimationFrame(anim);
  } else if (typeof Girl !== 'undefined') { try { $('fs-girl').innerHTML = Girl.at('wave', 0, 'var(--c1)'); } catch (e) {} }
  const lyr = $('fs-lyr');
  const dur = fSong((li, ni) => {
    lyr.querySelectorAll('.fs-l').forEach(p => p.classList.toggle('on', +p.dataset.l === li));
    const wi = F_WORDS[li].filter(x => x <= ni).length - 1;
    lyr.querySelectorAll('.fs-l[data-l="' + li + '"] span').forEach(s => s.classList.toggle('on', +s.dataset.w <= wi));
  });
  const after = () => {
    if (!FS) return;
    lyr.querySelectorAll('.fs-l').forEach(p => p.classList.add('on'));
    fClap(2.6); fTada(); fsRain(50);
    const msg = (I.kind === 'after' ? 'Ieri era il tuo compleanno e la festa ti ha aspettata! ' : '') + 'Tanti auguri' + (nm ? ', ' + nm : '') + '! ' +
      (I.age === 10 ? 'Dieci anni: oggi entri nel club delle due cifre!' : I.age ? I.age + ' anni: sono felicissimo di festeggiarli con te!' : 'Sono felicissimo di festeggiare con te!');
    $('fs-bub').innerHTML = '<div class="fs-say">🐉 ' + esc(msg) + '</div>';
    FS.t(() => fSay(msg), 700);
    $('fs-act').innerHTML = '<button type="button" class="fs-btn" id="fs-go-cake">🕯️ Spegni le candeline</button>';
    $('fs-go-cake').addEventListener('click', () => fsCake(I));
  };
  if (dur > 0) FS.t(after, dur + 300); else FS.t(after, 600);
}

/* ---------- 3. le candeline ---------- */
async function fBlowStart(onLevel) {
  const st = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
  if (!FS) { st.getTracks().forEach(t => t.stop()); return; }
  const a = audio(), src = a.createMediaStreamSource(st), an = a.createAnalyser(), z = a.createGain();
  an.fftSize = 512; z.gain.value = 0; src.connect(an); an.connect(z); z.connect(a.destination);
  const buf = new Uint8Array(an.fftSize), t0 = performance.now(); let base = 0, nb = 0;
  const B = { st, src, an, z, raf: 0 };
  const loop = () => {
    if (!FS || FS.blow !== B) return;
    an.getByteTimeDomainData(buf); let s = 0; for (let i = 0; i < buf.length; i++) { const v = (buf[i] - 128) / 128; s += v * v; }
    const r = Math.sqrt(s / buf.length);
    if (performance.now() - t0 < 500) { base += r; nb++; } else onLevel(r, nb ? base / nb : 0);
    B.raf = requestAnimationFrame(loop);
  };
  FS.blow = B; B.raf = requestAnimationFrame(loop);
}
function fBlowStop() {
  const B = FS && FS.blow; if (!B) return; FS.blow = null;
  cancelAnimationFrame(B.raf); try { B.src.disconnect(); B.an.disconnect(); B.z.disconnect(); } catch (e) {}
  try { B.st.getTracks().forEach(t => t.stop()); } catch (e) {}
}
function fsCake(I) {
  fLoopStop(); FS.wantLoop = false;
  const n = I.age >= 1 && I.age <= 12 ? I.age : I.age > 12 ? 12 : 6;
  fsScene('<h2 class="fs-h" id="fs-ch">🌠 Prima, esprimi un desiderio</h2><p class="fs-p" id="fs-cp">Chiudi gli occhi e pensalo forte. È un segreto: non dirlo a nessuno!</p>' +
    '<div class="fs-cakebox" id="fs-cake">' + fCakeSVG(n) + '</div><div class="fs-wind" id="fs-wind" hidden><i></i></div>' +
    '<div class="fs-act" id="fs-cact"><button type="button" class="fs-btn" id="fs-wish">✨ Fatto, l’ho pensato!</button></div><p class="fs-priv" id="fs-cpriv" hidden></p>', 'fs-cakesc');
  FS.t(() => fSay('Prima esprimi un desiderio. Chiudi gli occhi e pensalo forte.'), 400);
  const cake = $('fs-cake'); let lit = n, done = false, acc = 0;
  const out = i => {
    const f = cake.querySelector('.fs-fl[data-f="' + i + '"]'); if (!f || f.classList.contains('out')) return;
    f.classList.add('out'); const s = cake.querySelector('.fs-smoke[data-s="' + i + '"]'); if (s) s.classList.add('on'); fPuff(); lit--;
    if (!lit && !done) { done = true; finish(); }
  };
  const finish = () => {
    fBlowStop(); cake.style.setProperty('--wind', 0); $('fs-wind').hidden = true; $('fs-cpriv').hidden = true;
    const r = fRec()[I.year] || {}; fRecSet(I.year, { wish: (r.wish || 0) + 1 });
    FS.t(() => { fClap(3); fTada(); fsRain(90); fBurst(cake, 60); }, 250);
    $('fs-ch').textContent = '🎉 Evviva! Tutte spente!'; $('fs-cp').textContent = 'Il tuo desiderio sta volando verso le stelle. 🌠';
    const star = document.createElement('i'); star.className = 'fs-star'; star.textContent = '🌠'; FS.field.appendChild(star);
    $('fs-cact').innerHTML = '';
    FS.t(() => {
      const old = fCaps()[I.year - 1];
      $('fs-cact').innerHTML = old && !old.opened ? '<button type="button" class="fs-btn" id="fs-next">📜 Un messaggio dal passato!</button>' : '<button type="button" class="fs-btn" id="fs-next">🎈 Ai palloncini!</button>';
      $('fs-next').addEventListener('click', () => old && !old.opened ? fsCapOpen(I) : fsBalloons(I));
    }, 2200);
  };
  cake.addEventListener('click', e => { const f = e.target.closest('.fs-fl'); if (f) out(+f.dataset.f); });
  $('fs-wish').addEventListener('click', () => {
    try { speechSynthesis.cancel(); } catch (e) {}
    $('fs-ch').textContent = '🌬️ Soffia forte sulle candeline!';
    const can = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    $('fs-cp').textContent = can ? 'Soffia verso l’iPad, vicino al microfono. Oppure tocca le fiammelle.' : 'Tocca le fiammelle per spegnerle!';
    $('fs-cact').innerHTML = '';
    if (!can) return;
    const pv = $('fs-cpriv'); pv.hidden = false; pv.textContent = '🔒 Il microfono sente solo quanto forte soffi: non registra niente.';
    fBlowStart((r, base) => {
      if (done) return;
      const thr = Math.max(0.1, base * 3.5), w = Math.min(1, r / thr);
      cake.style.setProperty('--wind', w.toFixed(2)); const wb = $('fs-wind'); if (wb) { wb.hidden = false; wb.firstChild.style.width = Math.round(Math.min(1, r / (thr * 1.6)) * 100) + '%'; }
      if (r > thr) { acc++; if (acc >= 7) { acc = 0; const on = [...cake.querySelectorAll('.fs-fl:not(.out)')]; if (on.length) out(+on[Math.floor(Math.random() * on.length)].dataset.f); } }
      else acc = Math.max(0, acc - 1);
    }).catch(() => { if (FS && !done) { $('fs-cp').textContent = 'Il microfono non è disponibile: spegni le fiammelle con il dito! 👆'; $('fs-cpriv').hidden = true; } });
  });
}

/* ---------- 3b. la capsula dell'anno scorso ---------- */
const F_CAPQ = [['piace', '😍 Che cosa mi piace di più adesso'], ['impara', '🎯 Una cosa che voglio imparare quest’anno'], ['fiera', '🏅 Una cosa di cui sono fiera'], ['futuro', '🔮 Come mi immagino tra un anno'], ['msg', '💌 Un messaggio per me']];
function fsCapOpen(I) {
  const caps = fCaps(), c = caps[I.year - 1]; if (!c) { fsBalloons(I); return; }
  fsScene(fCapSVG('') + '<h2 class="fs-h">📜 Un messaggio dal passato!</h2><p class="fs-p">' + (c.age ? 'Un anno fa, la ' + esc(fNm() || 'bambina') + ' di ' + c.age + ' anni' : 'Un anno fa, tu') + ' ha chiuso questa capsula per te.</p>' +
    '<div class="fs-act" id="fs-coa"><button type="button" class="fs-btn" id="fs-co">⏳ Apri la capsula</button></div><div id="fs-cot"></div>');
  $('fs-co').addEventListener('click', () => {
    FS.st.querySelector('.fs-cap').classList.add('open'); fTada(); fsRain(40);
    $('fs-coa').innerHTML = '';
    $('fs-cot').innerHTML = '<div class="fs-letter read">' + F_CAPQ.filter(q => c.r && c.r[q[0]]).map(q => '<div class="fs-lq"><b>' + esc(q[1]) + '</b><p>' + esc(c.r[q[0]]) + '</p></div>').join('') +
      '<p class="fs-lsig">Scritto il ' + esc(c.at ? fLabel(new Date(+c.at.slice(0, 4), +c.at.slice(5, 7) - 1, +c.at.slice(8, 10))) : '') + '</p></div>' +
      '<p class="fs-p">Che cosa è cambiato? Che cosa è rimasto uguale? 💭</p><div class="fs-act"><button type="button" class="fs-btn" id="fs-cob">🎈 Ai palloncini!</button></div>';
    caps[I.year - 1] = Object.assign({}, c, { opened: fIso(fDay0()) }); store.set(CAP_KEY, caps);
    $('fs-cob').addEventListener('click', () => fsBalloons(I));
  });
}

/* ---------- 4. i palloncini ---------- */
function fBalMsgs(I) {
  const nm = fNm(), age = I.age, m = [
    '🐉 Tanti auguri dal tuo drago ' + D.name + '!', '😄 Che quest’anno sia pieno di risate!', '🌟 Sei unica: nessuno al mondo è come te.',
    '💪 Ogni volta che ci hai provato, sei diventata più forte.', '🤗 Un abbraccio grande come un drago!', '🍰 Oggi la fetta più grande è per te!',
    '🌈 Il tuo coraggio colora il mondo.', '🎶 Questa musica è tutta per te!', '🦋 Crescere è un’avventura, e tu la vivi alla grande.',
    '🚀 Chissà quante cose nuove scoprirai' + (age ? ' a ' + age + ' anni' : ' quest’anno') + '!', '🥳 ' + (nm ? nm + ', sei' : 'Sei') + ' la festeggiata più importante del mondo… almeno per me!'];
  if (age === 10) m.push('🔟 Benvenuta nel club delle due cifre!');
  const days = store.get('days', []).length; if (days > 1) m.push('📅 ' + days + ' giorni di allenamento insieme!');
  try { const k = knowTotal(); if (k > 0) m.push('🧠 Hai già imparato ' + k + ' nozioni!'); } catch (e) {}
  try { const f = figOwned(); if (f > 0) m.push('🃏 ' + f + (f === 1 ? ' figurina' : ' figurine') + ' nel tuo album!'); } catch (e) {}
  if (D.energy > 0) m.push('🔥 Hai dato a ' + D.name + ' ' + D.energy + ' di energia!');
  return shuffle(m);
}
function fsBalloons(I) {
  FS.wantLoop = true; fLoopStart();
  fsScene('<h2 class="fs-h">🎈 Scoppia i palloncini!</h2><p class="fs-p">Ognuno nasconde una sorpresa.</p><div class="fs-msg" id="fs-msg" aria-live="polite"></div><div class="fs-act" id="fs-bact"></div>', 'fs-balsc');
  FS.field.querySelectorAll('.fs-bal').forEach(b => b.remove());
  const msgs = fBalMsgs(I); let k = 0, pops = 0;
  const gifted = () => ownedShop().includes(fCrownId(I));
  const showActs = () => {
    const r = fRec()[I.year] || {}, cap = fCaps()[I.year];
    $('fs-bact').innerHTML = '<button type="button" class="fs-btn" id="fs-anno">📖 Il tuo anno con ' + esc(D.name) + '</button>' +
      (!cap ? '<button type="button" class="fs-btn" id="fs-capb">⏳ Capsula del tempo</button>' : '') +
      '<button type="button" class="fs-btn ghost" id="fs-in">Entra nella festa 🎉</button>';
    $('fs-anno').addEventListener('click', () => fsAnno(I));
    if ($('fs-capb')) $('fs-capb').addEventListener('click', () => fsCapsule(I));
    $('fs-in').addEventListener('click', () => fsClose());
    void r;
  };
  const spawn = gold => {
    if (!FS) return;
    const b = document.createElement('button'); b.type = 'button'; b.className = 'fs-bal' + (gold ? ' gold' : '');
    b.setAttribute('aria-label', gold ? 'Palloncino d’oro con il regalo' : 'Palloncino');
    const x = 4 + Math.random() * 82, d = reduce ? 0 : 10 + Math.random() * 6;
    b.style.cssText = '--x:' + x + '%;--y:' + (12 + Math.random() * 60) + '%;--c:' + (gold ? 'linear-gradient(160deg,#fff1a8,#f2b705)' : ['#ff7a9c', '#ffd23f', '#4bc0a8', '#5aa9ff', '#a879ff', '#ff9f43'][Math.floor(Math.random() * 6)]) + ';--d:' + d + 's;--dl:-' + (gold ? 2 : Math.random() * d * 0.7) + 's';
    if (gold) b.textContent = '🎁';
    b.addEventListener('animationiteration', () => { b.style.setProperty('--x', (4 + Math.random() * 82) + '%'); });
    b.addEventListener('click', () => {
      fPop(); fBurst(b, gold ? 60 : 24); b.style.visibility = 'hidden'; setTimeout(() => b.remove(), 50);
      if (gold) { FS.t(() => fsGift(I), 500); return; }
      pops++;
      const el = $('fs-msg'); if (el) { el.classList.remove('in'); void el.offsetWidth; el.textContent = msgs[k++ % msgs.length]; el.classList.add('in'); }
      const r = fRec()[I.year] || {}, today = fIso(fDay0()), pd = r.popd === today ? (r.pops || 0) : 0;
      if (pd < 10) { Gems.add(1, el); fRecSet(I.year, { popd: today, pops: pd + 1 }); }
      if (pops === 4 && !gifted()) FS.t(() => spawn(true), 400);
      if (pops === 3) showActs();
      FS.t(() => spawn(false), 900);
    });
    FS.field.appendChild(b);
  };
  for (let i = 0; i < 9; i++) spawn(false);
  if (fRec()[I.year] && fRec()[I.year].gift && !gifted()) spawn(true);
}

/* ---------- 5. il regalo del drago ---------- */
function fsGift(I) {
  FS.field.querySelectorAll('.fs-bal').forEach(b => b.remove());
  const id = fCrownId(I), v = I.age ? 'bday' + I.age : 'bday', nmC = I.age ? 'la corona ' + fDei(I.age) + ' ' + I.age + ' anni' : 'la corona del compleanno';
  fsScene('<h2 class="fs-h">🎁 Il regalo di ' + esc(D.name) + '</h2><button type="button" class="fs-giftbtn" id="fs-g2" aria-label="Apri il regalo">' + fGiftSVG('wiggle', ['#5aa9ff', '#4b8fe0']) + '</button><p class="fs-p" id="fs-g2p">Tocca per aprirlo</p><div class="fs-act" id="fs-g2a"></div>');
  $('fs-g2').addEventListener('click', e => {
    const g = e.currentTarget; if (g.dataset.open) return; g.dataset.open = 1;
    g.querySelector('.fs-gift').classList.remove('wiggle'); g.querySelector('.fs-gift').classList.add('open'); fWhoosh();
    const first = !ownedShop().includes(id);
    fOwn(id); store.set('dragon-acc', v); fRecSet(I.year, { gift: 1 }); updateBar();
    FS.t(() => {
      fTada(); fClap(1.6); fsRain(60);
      g.outerHTML = '<div class="fs-drg big">' + dragonSVG(Math.max(1, levelOf(D.energy)), D.color, 'fs-dancing') + '</div>';
      $('fs-g2p').innerHTML = '<b>👑 ' + esc(nmC.charAt(0).toUpperCase() + nmC.slice(1)) + '!</b><br>È tua per sempre: la trovi nel 🛍️ Negozio, «Per il drago».' + (first ? '<br>E in più: +10 💎' : '');
      if (first) Gems.add(10, $('fs-g2p'));
      fSay(D.name + ' ti regala ' + nmC + '. È tua per sempre!');
      $('fs-g2a').innerHTML = '<button type="button" class="fs-btn" id="fs-g2n">📖 Il tuo anno con ' + esc(D.name) + '</button><button type="button" class="fs-btn ghost" id="fs-g2b">🎈 Altri palloncini</button>';
      $('fs-g2n').addEventListener('click', () => fsAnno(I)); $('fs-g2b').addEventListener('click', () => fsBalloons(I));
    }, 600);
  });
}

/* ---------- 6. il tuo anno con il drago ---------- */
function fAnnoSlides(I) {
  const S = [], days = store.get('days', []), i = levelOf(D.energy);
  const fd = days.length ? days[0] : '', fdd = fd ? new Date(+fd.slice(0, 4), +fd.slice(5, 7) - 1, +fd.slice(8, 10)) : null;
  const long = fdd && (fDay0() - fdd) / 864e5 >= 330;
  S.push({ em: '🐉', t: (long ? 'Il tuo anno con ' : 'Il tuo viaggio con ') + D.name, s: fdd ? 'Ci conosciamo dal ' + fLabel(fdd) + '. Guarda quanta strada abbiamo fatto!' : 'Guarda quanta strada abbiamo fatto!' });
  if (days.length) S.push({ em: '📅', n: days.length, t: days.length === 1 ? 'giorno di allenamento' : 'giorni di allenamento', s: 'Ogni giorno in cui ci hai provato conta.' });
  S.push({ dr: 1, t: i > 0 ? D.name + ' è diventato ' + LEVELS[i].n : D.name + ' sta per nascere', s: D.energy + ' 🔥 di energia, tutta grazie alla tua forza di volontà.' });
  try { const k = knowTotal(); if (k > 0) S.push({ em: '🧠', n: k, t: 'nozioni imparate', s: 'Ogni nozione è un mattoncino della tua memoria.' }); } catch (e) {}
  const pr = store.get('prog', {}), ok = Object.keys(pr).reduce((a, x) => a + ((pr[x] || {}).ok || 0), 0);
  if (ok > 0) S.push({ em: '✅', n: ok, t: 'risposte giuste', s: 'E anche gli errori ti hanno aiutata a imparare.' });
  try { const f = figOwned(), te = tesoriFound(); if (f || te) S.push({ em: '🃏', n: f, t: f === 1 ? 'figurina nel tuo album' : 'figurine nel tuo album', s: te ? 'E ' + te + (te === 1 ? ' tesoro nascosto trovato.' : ' tesori nascosti trovati.') : 'Ognuna è una curiosità che sai raccontare.' }); } catch (e) {}
  const gt = (Gems.get() || {}).tot || 0; if (gt > 0) S.push({ em: '💎', n: gt, t: 'gemme guadagnate', s: 'Le hai conquistate una a una.' });
  try { if (typeof tState === 'function' && tState().pers) S.push({ em: '🎭', t: 'Stai preparando la tua parte a teatro', s: D.name + ' farà il tifo per te in prima fila!' }); } catch (e) {}
  S.push({ em: '🌟', t: 'E questo è solo l’inizio!', s: 'Chissà quante cose scopriremo insieme' + (I.age ? ' a ' + I.age + ' anni' : ' quest’anno') + '.' });
  return S;
}
function fsAnno(I) {
  FS.wantLoop = true; fLoopStart(); FS.field.querySelectorAll('.fs-bal:not(.deco)').forEach(b => b.remove());
  const S = fAnnoSlides(I); let k = 0;
  const paint = () => {
    const x = S[k], txt = (x.n !== undefined ? x.n + ' ' : '') + x.t + '. ' + x.s;
    fsScene('<div class="fs-slide">' + (x.dr ? '<div class="fs-drg">' + dragonSVG(Math.max(1, levelOf(D.energy)), D.color, 'bob') + '</div>' : '<div class="fs-em">' + x.em + '</div>') +
      (x.n !== undefined ? '<div class="fs-big">' + x.n + '</div>' : '') + '<b>' + esc(x.t) + '</b><small>' + esc(x.s) + '</small><div style="margin-top:10px">' + sayBtn(txt) + '</div></div>' +
      '<div class="fs-dots">' + S.map((_, j) => '<i class="' + (j === k ? 'on' : '') + '"></i>').join('') + '</div>' +
      '<div class="fs-act">' + (k > 0 ? '<button type="button" class="fs-btn ghost" id="fs-ap">⬅</button>' : '') +
      (k < S.length - 1 ? '<button type="button" class="fs-btn" id="fs-an">Avanti ➜</button>'
        : (fCaps()[I.year] ? '' : '<button type="button" class="fs-btn" id="fs-ac">⏳ Capsula del tempo</button>') + '<button type="button" class="fs-btn' + (fCaps()[I.year] ? '' : ' ghost') + '" id="fs-ae">Entra nella festa 🎉</button>') + '</div>', 'fs-annosc');
    if (k === S.length - 1) { fRecSet(I.year, { anno: 1 }); fsRain(40); }
    if ($('fs-ap')) $('fs-ap').addEventListener('click', () => { k--; paint(); });
    if ($('fs-an')) $('fs-an').addEventListener('click', () => { k++; ding(); paint(); });
    if ($('fs-ac')) $('fs-ac').addEventListener('click', () => fsCapsule(I));
    if ($('fs-ae')) $('fs-ae').addEventListener('click', () => fsClose());
  };
  paint();
}

/* ---------- 7. la capsula del tempo ---------- */
function fsCapsule(I) {
  FS.wantLoop = true; fLoopStart(); FS.field.querySelectorAll('.fs-bal:not(.deco)').forEach(b => b.remove());
  const caps = fCaps(), c = caps[I.year], nm = fNm(), next = fBdIn(I.year + 1), days = Math.round((next - fDay0()) / 864e5);
  if (c) {
    fsScene(fCapSVG('sealed') + '<h2 class="fs-h">⏳ La capsula è chiusa</h2><p class="fs-p">Si aprirà il giorno del tuo prossimo compleanno: ' + esc(fLabel(next)) + '.<br>Mancano ' + days + ' giorni.</p><div class="fs-act"><button type="button" class="fs-btn" id="fs-ce">Entra nella festa 🎉</button></div>');
    $('fs-ce').addEventListener('click', () => fsClose()); return;
  }
  fsScene(fCapSVG('') + '<h2 class="fs-h">⏳ La capsula del tempo</h2>' +
    '<p class="fs-p">Scrivi un messaggio ' + (I.age ? 'alla ' + esc(nm || 'bambina') + ' di ' + (I.age + 1) + ' anni' : 'a te stessa, tra un anno') + '. Lo chiudo nella capsula e lo apriamo insieme al tuo prossimo compleanno.</p>' +
    '<div class="fs-letter">' + F_CAPQ.map(q => '<label for="fs-q-' + q[0] + '">' + esc(q[1]) + '</label><textarea id="fs-q-' + q[0] + '" maxlength="400" rows="2"></textarea>').join('') + '</div>' +
    '<p class="fs-priv">Scrivi solo quello che vuoi: basta anche una risposta. 🔒 La capsula resta chiusa fino al tuo prossimo compleanno.</p>' +
    '<div class="fs-act" id="fs-cpa"><button type="button" class="fs-btn" id="fs-seal">🔒 Chiudi la capsula</button><button type="button" class="fs-btn ghost" id="fs-later">Più tardi</button></div>', 'fs-capsc');
  $('fs-later').addEventListener('click', () => fsClose());
  $('fs-seal').addEventListener('click', () => {
    const r = {}; F_CAPQ.forEach(q => { const v = ($('fs-q-' + q[0]).value || '').trim(); if (v) r[q[0]] = v.slice(0, 400); });
    if (!Object.keys(r).length) { toastV2('Scrivi almeno una risposta ✏️'); return; }
    const all = fCaps(); all[I.year] = { age: I.age, at: fIso(fDay0()), r }; store.set(CAP_KEY, all); fRecSet(I.year, { cap: 1 });
    FS.st.querySelector('.fs-letter').classList.add('fold'); FS.st.querySelector('.fs-cap').classList.add('sealed'); fLock(); FS.t(() => { fTada(); fsRain(50); }, 500);
    Gems.add(5, $('fs-seal'));
    $('fs-cpa').innerHTML = '<p class="fs-p"><b>Chiusa! 🔒</b> Si apre il ' + esc(fLabel(next)) + '. Mancano ' + days + ' giorni: ' + esc(D.name) + ' la custodirà per te.</p><button type="button" class="fs-btn" id="fs-ce">Entra nella festa 🎉</button>';
    $('fs-ce').addEventListener('click', () => fsClose());
  });
}

/* ---------- vigilia: il pacco chiuso ---------- */
function festaEve(I) {
  const r = fRec(); r.eve = fIso(fDay0()); store.set(F_KEY, r);
  fsShell('night');
  fsScene('<p class="fs-kick">Shhh… è una sorpresa</p><button type="button" class="fs-giftbtn" id="fs-eg" aria-label="Il pacco chiuso">' + fGiftSVG('wiggle') + '</button>' +
    '<h2 class="fs-h">' + (I.age ? 'Domani compi ' + I.age + ' anni! 🎉' : 'Domani è il tuo compleanno! 🎉') + '</h2><p class="fs-p" id="fs-ep">Il pacco si apre domani. Torna a trovarmi!</p>' +
    '<div class="fs-act"><button type="button" class="fs-btn" id="fs-eok">Non vedo l’ora! 🤩</button></div>');
  $('fs-eg').addEventListener('click', e => { const s = e.currentTarget.querySelector('.fs-gift'); s.classList.remove('wiggle', 'shake'); void s.offsetWidth; s.classList.add('shake'); fLock(); $('fs-ep').textContent = 'Non ancora! 😉 Si apre domani.'; });
  $('fs-eok').addEventListener('click', () => fsClose());
}

/* ---------- 10 sorprese in 10 giorni ---------- */
const F_SORP = [['gem', 10], ['fig'], ['gem', 12], ['hat'], ['fig'], ['gem', 15], ['fig'], ['gem', 12], ['fig'], ['shop']];
function festaSorp(I) {
  fsShell('party'); fsEnterLater(4000);
  fsScene('<p class="fs-kick">Sorpresa ' + I.n + ' di 10</p><button type="button" class="fs-giftbtn" id="fs-sg" aria-label="Apri la sorpresa">' + fGiftSVG('wiggle', I.n % 2 ? ['#4bc0a8', '#36a28c'] : ['#a879ff', '#8d5fe6']) + '</button>' +
    '<h2 class="fs-h">🎁 Una sorpresa per te!</h2><p class="fs-p" id="fs-sp">' + esc(D.name) + ' ha preparato 10 sorprese' + (I.age ? ' per i tuoi ' + I.age + ' anni' : '') + ': una per ogni giorno in cui vieni a trovarlo.</p><div id="fs-sbox"></div><div class="fs-act" id="fs-sa"></div>');
  $('fs-sg').addEventListener('click', e => {
    const g = e.currentTarget; if (g.dataset.open) return; g.dataset.open = 1;
    g.querySelector('.fs-gift').classList.remove('wiggle'); g.querySelector('.fs-gift').classList.add('open'); fWhoosh();
    const r = fRec(); r.sorp = { y: I.year, n: I.n, last: fIso(fDay0()) }; store.set(F_KEY, r); __fMemo.k = '';
    FS.t(() => { fTada(); fBurst(g, 40); g.remove(); reveal(); }, 550);
  });
  const ends = () => {
    const next = fBdIn(I.year + 1), dd = Math.round((next - fDay0()) / 864e5);
    $('fs-sa').innerHTML = '<p class="fs-p">' + (I.n < 10 ? 'Torna domani: ti aspetta la sorpresa n. ' + (I.n + 1) + '! 🎁' : 'Erano 10 sorprese' + (I.age ? ' per i tuoi ' + I.age + ' anni' : '') + '! Al prossimo compleanno mancano ' + dd + ' giorni' + (fCaps()[I.year] ? ', e la capsula del tempo ti aspetta. ⏳' : '.')) + '</p><button type="button" class="fs-btn" id="fs-sok">Grazie, ' + esc(D.name) + '! 💛</button>';
    $('fs-sok').addEventListener('click', () => fsClose());
  };
  const reveal = () => {
    const [k, v] = F_SORP[I.n - 1] || ['gem', 10], box = $('fs-sbox'), p = $('fs-sp');
    if (k === 'fig' && typeof figUnlock === 'function') {
      const f = figUnlock(); if (f) { p.textContent = '🃏 Una figurina nuova per il tuo album!'; figShow(box, f, ends); return; }
    }
    if (k === 'hat') { fOwn('d-festa'); p.innerHTML = '<b>🥳 Il cappellino della festa per ' + esc(D.name) + '!</b><br>Lo trovi nel 🛍️ Negozio, «Per il drago».'; __fAccPreview = 'festa'; const hsvg = dragonSVG(Math.max(1, levelOf(D.energy)), D.color, 'bob'); __fAccPreview = ''; box.innerHTML = '<div class="fs-drg">' + hsvg + '</div><div class="fs-act"><button type="button" class="fs-btn ghost" id="fs-hat">Mettilo adesso</button></div>'; $('fs-hat').addEventListener('click', e => { store.set('dragon-acc', 'festa'); updateBar(); e.currentTarget.textContent = 'Fatto! 🥳'; e.currentTarget.disabled = true; }); ends(); return; }
    if (k === 'shop' && typeof SHOP !== 'undefined') {
      const own = ownedShop(), opts = SHOP.filter(x => x.who === 'd' && x.p > 0 && x.p <= 200 && !own.includes(x.id)).slice(0, 8);
      if (opts.length) {
        p.innerHTML = '<b>🏆 Gran finale!</b> Scegli un regalo per ' + esc(D.name) + ': è gratis!';
        box.innerHTML = '<div class="fs-pick">' + opts.map(x => '<button type="button" class="fs-pk" data-pk="' + x.id + '"><span>' + x.ic + '</span>' + esc(x.n) + '</button>').join('') + '</div>';
        box.querySelectorAll('[data-pk]').forEach(b => b.addEventListener('click', () => {
          const it = SHOP.find(x => x.id === b.dataset.pk); if (!it) return; fOwn(it.id); try { shopEquip(it, true); } catch (e) {}
          box.innerHTML = '<div class="fs-drg">' + dragonSVG(Math.max(1, levelOf(D.energy)), D.color, 'fs-dancing') + '</div><p class="fs-p"><b>' + it.ic + ' ' + esc(it.n) + ': è tuo!</b></p>'; fTada(); fsRain(60); ends();
        }));
        return;
      }
      Gems.add(40, p); p.innerHTML = '<b>🏆 Gran finale: +40 💎!</b>'; ends(); return;
    }
    const n = k === 'gem' ? v : 10; Gems.add(n, p); p.innerHTML = '<b>💎 +' + n + ' gemme!</b> Usale nel negozio o mettile nel salvadanaio.'; fsRain(30); ends();
  };
}


/* ---------- anteprima per il genitore: indirizzo con ?festa=prova ----------
   Mostra la festa com'è il giorno del compleanno, senza salvare nulla (regalo, capsula, gemme restano come prima). */
let __fPrev = null;
function festaPreview() {
  if (__fPrev) return;
  const tmp = {}, g0 = store.get, s0 = store.set, D0 = D, C0 = CHILD;
  __fPrev = { g0, s0, D0, C0 };
  store.get = (k, d) => Object.prototype.hasOwnProperty.call(tmp, k) ? JSON.parse(JSON.stringify(tmp[k])) : g0.call(store, k, d);
  store.set = (k, v) => { tmp[k] = JSON.parse(JSON.stringify(v)); };
  if (!D) D = { name: 'il tuo drago', color: 'verde', energy: 60 };
  const t = fDay0(), bd = CHILD.bd || {};
  let age = 10;
  if (bd.y && bd.m && bd.d) { const ny = fBdIn(t.getFullYear()) < t ? t.getFullYear() + 1 : t.getFullYear(); age = ny - bd.y; }
  CHILD = Object.assign({}, CHILD, { bd: { d: t.getDate(), m: t.getMonth() + 1, y: t.getFullYear() - age } });
  __fMemo.k = ''; festaOpen();
  const b = $('fs-enter'); if (b) b.insertAdjacentHTML('beforebegin', '<span class="fs-tb" style="pointer-events:none">👀 Anteprima</span>');
}
function festaPreviewEnd() {
  const P = __fPrev; if (!P) return; __fPrev = null;
  store.get = P.g0; store.set = P.s0; D = P.D0; CHILD = P.C0; __fMemo.k = '';
  try { history.replaceState(null, '', location.pathname); } catch (e) {}
  festaShop(); try { Gems.paint(); } catch (e) {} if (D) updateBar(); festaPaint(); if (typeof go === 'function' && D) go(current);
}

/* ---------- casa in festa ---------- */
function festaPaint() {
  const on = !!festaActive(); document.body.classList.toggle('festa-on', on);
  let deco = $('fs-homebal');
  if (on && !deco && !reduce) {
    deco = document.createElement('div'); deco.id = 'fs-homebal'; deco.setAttribute('aria-hidden', 'true');
    deco.innerHTML = [2, 92, 6, 88].map((x, i) => '<span class="fs-bal deco" style="--x:' + x + '%;--c:' + ['#ff7a9c', '#ffd23f', '#5aa9ff', '#a879ff'][i] + ';--d:' + (22 + i * 4) + 's;--dl:-' + (i * 6) + 's"></span>').join('');
    document.body.appendChild(deco);
  } else if (!on && deco) deco.remove();
}
function festaCard() {
  const I = festaInfo(); if (!I) return '';
  if (I.kind === 'eve') return '<div class="v2-card fs-card"><div class="v2-ct"><span class="fs-wig">🎁</span> ' + (I.age ? 'Domani compi ' + I.age + ' anni!' : 'Domani è il tuo compleanno!') + '</div><small>Il pacco si apre domani. ' + esc(D.name) + ' sta preparando la festa…</small></div>';
  if (I.kind !== 'day' && I.kind !== 'after') return '';
  const r = fRec()[I.year] || {}, cap = fCaps()[I.year];
  return '<div class="v2-card fs-card"><div class="v2-ct">🎉 ' + (I.kind === 'after' ? 'La tua festa di compleanno!' : 'Oggi è la tua festa!') + '</div>' +
    '<div class="fs-cbtns"><button type="button" class="v2-btn" id="fs-again">🎂 Rivedi la festa</button>' +
    (!ownedShop().includes(fCrownId(I)) ? '<button type="button" class="v2-btn blue" id="fs-cg">🎁 Il regalo ti aspetta</button>' : '') +
    (!cap ? '<button type="button" class="v2-btn blue" id="fs-cc">⏳ Capsula del tempo</button>' : '') + '</div>' + (r.wish ? '' : '<small>Le candeline aspettano il tuo soffio! 🕯️</small>') + '</div>';
}
function festaCardBind(el) {
  const I = festaActive();
  const b = el.querySelector('#fs-again'); if (b) b.addEventListener('click', () => festaOpen());
  const g = el.querySelector('#fs-cg'); if (g && I) g.addEventListener('click', () => { const r = fRec()[I.year] || {}; fsShell('party'); fsEnterLater(4000); fRecSet(I.year, { first: r.first || fIso(fDay0()) }); fsGift(I); });
  const c = el.querySelector('#fs-cc'); if (c && I) c.addEventListener('click', () => { fsShell('party'); fsEnterLater(4000); fsCapsule(I); });
}
function capsulaCard() {
  const caps = fCaps(), ys = Object.keys(caps).filter(y => !caps[y].opened).map(Number).sort(); if (!ys.length || !CHILD.bd || !CHILD.bd.m) return '';
  const y = ys[ys.length - 1], next = fBdIn(y + 1), dd = Math.round((next - fDay0()) / 864e5);
  if (dd < 0) return '';
  return '<div class="v2-card v2-next fs-capcard" style="margin-top:14px"><span>⏳</span><div><b>Capsula del tempo</b><small>' + (dd === 0 ? 'Si apre oggi, alla festa!' : 'Si apre tra ' + dd + (dd === 1 ? ' giorno' : ' giorni') + ', il ' + esc(fLabel(next))) + '</small></div></div>';
}

(function festaBoot() {
  festaShop();
  if (typeof shopReqOk === 'function') { const o = shopReqOk; shopReqOk = it => it && it.req && it.req[0] === 'fs' ? ownedShop().includes(it.req[1]) : o(it); }
  const h0 = PAGES.home; PAGES.home = el => { h0(el); try { const c = festaCard(); if (c) { el.insertAdjacentHTML('afterbegin', '<div class="fs-hometop">' + c + '</div>'); festaCardBind(el); } } catch (e) {} festaPaint(); };
  const i0 = PAGES.io; PAGES.io = el => { i0(el); try { const c = festaCard(), k = capsulaCard(), g = el.querySelector('.v2-grid'); if (g && (c || k)) { g.insertAdjacentHTML('afterend', (c ? '<div style="margin-top:14px">' + c + '</div>' : '') + k); festaCardBind(el); } } catch (e) {} };
  let hid = 0;
  const maybe = () => {
    if (FS) return;
    if (/[?&]festa=prova\b/.test(location.search)) { festaPreview(); return; }
    if (!D) return;
    if ($('lesson') && !$('lesson').hidden) return;
    const I = festaInfo(); if (!I) { festaPaint(); return; }
    if (I.kind === 'day' || I.kind === 'after') festaOpen();
    else if (I.kind === 'eve') { if (fRec().eve !== fIso(fDay0())) festaEve(I); }
    else if (I.kind === 'sorp') festaSorp(I);
    festaPaint();
  };
  window.festaMaybe = maybe;
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') { hid = Date.now(); fBlowStop(); return; }
    if (hid && Date.now() - hid > 45000) { if (FS) fsClose(true); setTimeout(maybe, 400); }
    else festaPaint();
  });
  setTimeout(maybe, 350);
})();
