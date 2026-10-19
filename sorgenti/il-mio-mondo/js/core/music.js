/* ================= MUSICA DI SOTTOFONDO (generata dal vivo, senza file e senza internet) =================
   Strumentale, lenta (circa 60 battiti al minuto), volume basso e senza parole. */
const Music = (() => {
  const STYLES = [
    { id: 'piano', ic: '🎹', n: 'Pianoforte calmo' },
    { id: 'stelle', ic: '✨', n: 'Carillon delle stelle' },
    { id: 'pioggia', ic: '🌧️', n: 'Pioggia leggera' },
    { id: 'mare', ic: '🌊', n: 'Onde del mare' },
    { id: 'chitarra', ic: '🎸', n: 'Chitarra dolce' },
    { id: 'arpa', ic: '🪕', n: 'Arpa magica' },
    { id: 'bosco', ic: '🌲', n: 'Bosco con uccellini' },
    { id: 'camino', ic: '🔥', n: 'Camino scoppiettante' },
    { id: 'spazio', ic: '🪐', n: 'Viaggio nello spazio' },
    { id: 'valzer', ic: '🌙', n: 'Valzer della luna' }
  ];
  const pref = () => store.get('music', { on: false, style: 'piano', vol: 0.35 });
  let ctx = null, master = null, duckG = null, verb = null, timer = null, nodes = [], playing = false, beat = 0, styleId = null;
  const SG = { piano: 2, stelle: 3.6, pioggia: 0.55, mare: 1.6, chitarra: 4.4, arpa: 2.5, bosco: 2.8, camino: 0.55, spazio: 1.35, valzer: 3.8 };
  const lvl = v => v * (SG[styleId] || 1);
  const midi = m => 440 * Math.pow(2, (m - 69) / 12);
  // giro di accordi dolce: Do – La minore – Fa – Sol (I–vi–IV–V)
  const CHORDS = [[48, 55, 60, 64], [45, 52, 57, 60], [41, 48, 53, 57], [43, 50, 55, 59]];
  const PENTA = [60, 62, 64, 67, 69, 72, 74, 76, 79];
  function init() {
    if (ctx) return true;
    ctx = audio(); if (!ctx) return false;
    master = ctx.createGain(); master.gain.value = 0;
    duckG = ctx.createGain(); duckG.gain.value = 1;
    const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -24; comp.ratio.value = 4;
    // riverbero: risposta all'impulso generata (rumore che si spegne in 3 secondi)
    verb = ctx.createConvolver();
    const len = ctx.sampleRate * 3, ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3); }
    verb.buffer = ir;
    const wet = ctx.createGain(); wet.gain.value = 0.35;
    verb.connect(wet); wet.connect(master);
    master.connect(duckG); duckG.connect(comp); comp.connect(ctx.destination);
    return true;
  }
  function out(node, dry) { const g = ctx.createGain(); g.gain.value = dry * 3; node.connect(g); g.connect(master); const v = ctx.createGain(); v.gain.value = 3; node.connect(v); v.connect(verb); }
  function note(freq, t, dur, vol, type) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type || 'triangle'; o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); out(g, 0.7); o.start(t); o.stop(t + dur + 0.05);
  }
  function pad(chord, t, dur, vol) {
    chord.forEach((m, i) => {
      const o = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter();
      o.type = 'sine'; o.frequency.value = midi(m); o.detune.value = (i % 2 ? 4 : -4);
      f.type = 'lowpass'; f.frequency.value = 900;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(vol, t + dur * 0.35);
      g.gain.linearRampToValueAtTime(0.0001, t + dur);
      o.connect(f); f.connect(g); out(g, 0.5); o.start(t); o.stop(t + dur + 0.1);
    });
  }
  function pluck(freq, t, vol) {
    const o = ctx.createOscillator(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    o.type = 'sawtooth'; o.frequency.value = freq;
    f.type = 'lowpass'; f.frequency.setValueAtTime(2800, t); f.frequency.exponentialRampToValueAtTime(500, t + 0.6);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.8);
    o.connect(f); f.connect(g); out(g, 0.8); o.start(t); o.stop(t + 1.9);
  }
  function chirp(t) {
    const base = 2400 + Math.random() * 1600, n = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < n; i++) {
      const o = ctx.createOscillator(), g = ctx.createGain(), s = t + i * 0.13;
      o.type = 'sine'; o.frequency.setValueAtTime(base, s); o.frequency.exponentialRampToValueAtTime(base * 1.45, s + 0.07);
      g.gain.setValueAtTime(0.0001, s); g.gain.exponentialRampToValueAtTime(0.025, s + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, s + 0.09);
      o.connect(g); out(g, 0.6); o.start(s); o.stop(s + 0.1);
    }
  }
  let popBuf = null;
  function crackle(t) {
    if (!popBuf) { popBuf = ctx.createBuffer(1, ctx.sampleRate * 0.03, ctx.sampleRate); const d = popBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 4); }
    const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = popBuf; f.type = 'highpass'; f.frequency.value = 900 + Math.random() * 1500; g.gain.value = 0.05 + Math.random() * 0.12;
    s.connect(f); f.connect(g); g.connect(master); s.start(t);
  }
  function noiseBuf(kind) {
    const len = ctx.sampleRate * 4, b = ctx.createBuffer(1, len, ctx.sampleRate), d = b.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) { const w = Math.random() * 2 - 1; if (kind === 'brown') { last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5; } else d[i] = w; }
    return b;
  }
  function loopNoise(kind, ftype, freq, vol) {
    const s = ctx.createBufferSource(); s.buffer = noiseBuf(kind); s.loop = true;
    const f = ctx.createBiquadFilter(); f.type = ftype; f.frequency.value = freq;
    const g = ctx.createGain(); g.gain.value = vol * 2.5;
    s.connect(f); f.connect(g); g.connect(master); s.start();
    nodes.push(s); return g;
  }
  function startBed(id) {
    if (id === 'pioggia') {
      loopNoise('white', 'lowpass', 1800, 0.10);
      loopNoise('brown', 'lowpass', 500, 0.25);
    }
    if (id === 'bosco') {
      const g = loopNoise('brown', 'bandpass', 450, 0.0);
      const lfo = ctx.createOscillator(), lg = ctx.createGain(); lfo.frequency.value = 0.05; lg.gain.value = 0.12; g.gain.value = 0.16;
      lfo.connect(lg); lg.connect(g.gain); lfo.start(); nodes.push(lfo);
    }
    if (id === 'camino') loopNoise('brown', 'lowpass', 260, 0.3);
    if (id === 'mare') {
      const g = loopNoise('brown', 'lowpass', 700, 0.0);
      const lfo = ctx.createOscillator(), lg = ctx.createGain();
      lfo.frequency.value = 0.09; lg.gain.value = 0.5; g.gain.value = 0.6;
      lfo.connect(lg); lg.connect(g.gain); lfo.start(); nodes.push(lfo);
      loopNoise('white', 'highpass', 4000, 0.012);
    }
  }
  function tick() {
    if (!playing) return;
    const t = ctx.currentTime + 0.1, b = beat++, chord = CHORDS[Math.floor(b / 8) % 4];
    if (styleId === 'piano') {
      if (b % 8 === 0) pad(chord, t, 8.5, 0.035);
      if (Math.random() < 0.55) { const pool = PENTA.filter(m => chord.some(c => (m - c) % 12 === 0) || Math.random() < 0.3); note(midi(pool[Math.floor(Math.random() * pool.length)]), t, 2.6, 0.06); }
      if (b % 4 === 0) note(midi(chord[0] - 12), t, 3.5, 0.05, 'sine');
    } else if (styleId === 'stelle') {
      if (b % 8 === 0) pad(chord, t, 8.5, 0.02);
      if (Math.random() < 0.45) note(midi(PENTA[Math.floor(Math.random() * PENTA.length)] + 12), t, 1.8, 0.04, 'sine');
    } else if (styleId === 'pioggia') {
      if (b % 16 === 0) pad(chord.map(m => m - 12).slice(0, 3), t, 16, 0.02);
      if (Math.random() < 0.18) note(midi(PENTA[Math.floor(Math.random() * 5)] + 12), t, 1.2, 0.012, 'sine');
    } else if (styleId === 'mare') {
      if (b % 16 === 0) pad(chord.slice(0, 3), t, 16, 0.018);
    } else if (styleId === 'chitarra') {
      // arpeggio lento: basso, poi le note dell'accordo
      const arp = [chord[0] - 12, chord[1], chord[2], chord[3], chord[2], chord[1], chord[2], chord[3]];
      pluck(midi(arp[b % 8]), t, b % 8 === 0 ? 0.05 : 0.035);
      if (b % 2 === 1 && Math.random() < 0.5) pluck(midi(arp[(b + 3) % 8] + 12), t + 0.5, 0.02);
    } else if (styleId === 'arpa') {
      if (b % 4 === 0) chord.concat(chord.map(x => x + 12)).forEach((m2, k) => note(midi(m2 + 12), t + k * 0.14, 2.4, 0.03, 'triangle'));
      if (b % 8 === 0) pad(chord, t, 8.5, 0.015);
    } else if (styleId === 'bosco') {
      if (Math.random() < 0.28) chirp(t + Math.random() * 0.6);
      if (b % 16 === 0) pad(chord.slice(0, 3), t, 16, 0.012);
    } else if (styleId === 'camino') {
      const n = Math.floor(Math.random() * 4);
      for (let i = 0; i < n; i++) crackle(t + Math.random() * 0.95);
      if (b % 16 === 0) pad(chord.map(x => x - 12).slice(0, 3), t, 16, 0.016);
    } else if (styleId === 'spazio') {
      if (b % 12 === 0) pad(chord.concat([chord[0] + 12]), t, 13, 0.03);
      if (Math.random() < 0.12) note(midi(PENTA[Math.floor(Math.random() * PENTA.length)] + 24), t, 3.5, 0.012, 'sine');
    } else if (styleId === 'valzer') {
      // tempo in 3: basso sul primo battito, accordo sul secondo e terzo, melodia ogni tanto
      const bar = Math.floor(b / 3), ch = CHORDS[Math.floor(bar / 2) % 4], pos = b % 3;
      if (pos === 0) note(midi(ch[0] - 12), t, 2.2, 0.05, 'sine');
      else { note(midi(ch[1]), t, 1.0, 0.022, 'triangle'); note(midi(ch[2]), t, 1.0, 0.022, 'triangle'); }
      if (pos === 0 && Math.random() < 0.8) note(midi(ch[3] + 12 + [0, 2, -3, 4][Math.floor(Math.random() * 4)]), t, 2.6, 0.045, 'triangle');
    }
  }
  function start() {
    const p = pref();
    if (!init()) return false;
    try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) {}
    if (ctx.state === 'suspended') ctx.resume();
    stopNodes(); styleId = p.style; playing = true; beat = 0;
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
    master.gain.linearRampToValueAtTime(lvl(p.vol), ctx.currentTime + 2.5);
    startBed(styleId);
    clearInterval(timer); timer = setInterval(tick, 1000); tick();
    paint(); return true;
  }
  function stopNodes() { nodes.forEach(n => { try { n.stop(); } catch (e) {} }); nodes = []; }
  function stop(keepPref) {
    playing = false; clearInterval(timer);
    if (ctx && master) { master.gain.cancelScheduledValues(ctx.currentTime); master.gain.setValueAtTime(master.gain.value, ctx.currentTime); master.gain.linearRampToValueAtTime(0, ctx.currentTime + 1); }
    setTimeout(() => { if (!playing) stopNodes(); }, 1100);
    if (!keepPref) { const p = pref(); p.on = false; store.set('music', p); }
    paint();
  }
  function setVol(v) { const p = pref(); p.vol = v; store.set('music', p); if (playing && master) master.gain.setTargetAtTime(lvl(v), ctx.currentTime, 0.2); }
  function setStyle(id) { const p = pref(); p.style = id; p.on = true; store.set('music', p); start(); }
  // abbassa la musica quando parla la voce
  function duck() {
    if (!playing || !duckG) return;
    duckG.gain.setTargetAtTime(0.25, ctx.currentTime, 0.1);
    const iv = setInterval(() => { let sp = false; try { sp = speechSynthesis.speaking; } catch (e) {} if (!sp) { clearInterval(iv); duckG.gain.setTargetAtTime(1, ctx.currentTime, 0.4); } }, 400);
  }
  function paint() { const b = document.getElementById('music-btn'); if (b) { b.classList.toggle('on', playing); b.setAttribute('aria-pressed', String(playing)); b.textContent = playing ? '🎵' : '🔇'; } }
  function panel() {
    const p = pref();
    openModal('<div class="big" style="font-size:28px">🎵 Musica per studiare</div>' +
      '<p style="font-weight:700">Musica lenta, senza parole e a volume basso. Aiuta molte persone a concentrarsi: se invece ti distrae, spegnila.</p>' +
      '<div class="mu-list">' + STYLES.map(s => '<button type="button" class="mu" data-mu="' + s.id + '" aria-pressed="' + (playing && styleId === s.id) + '"><span aria-hidden="true">' + s.ic + '</span>' + esc(s.n) + '</button>').join('') + '</div>' +
      '<label class="mu-vol"><span>🔈</span><input type="range" id="mu-vol" min="0.05" max="0.8" step="0.05" value="' + p.vol + '" aria-label="Volume"><span>🔊</span></label>' +
      '<div class="row center" style="gap:8px;margin-top:12px">' + (playing ? '<button type="button" class="btn small" id="mu-stop" style="--bc:var(--c1)">⏹ Spegni</button>' : '') + '<button type="button" class="btn small ghost" id="mu-close" data-focus>Chiudi</button></div>', ['var(--c6)', 'var(--c6-soft)']);
    document.querySelectorAll('[data-mu]').forEach(b => b.addEventListener('click', () => { setStyle(b.dataset.mu); panel(); }));
    $('mu-vol').addEventListener('input', e => setVol(+e.target.value));
    if ($('mu-stop')) $('mu-stop').addEventListener('click', () => { stop(); panel(); });
    $('mu-close').addEventListener('click', closeModal);
  }
  return { start, stop, panel, duck, paint, pref, get playing() { return playing; } };
})();

(function musicBoot() {
  const bar = document.querySelector('.appbar-in'); if (!bar) return;
  const b = document.createElement('button');
  b.type = 'button'; b.id = 'music-btn'; b.className = 'music-btn'; b.setAttribute('aria-label', 'Musica di sottofondo'); b.textContent = '🔇';
  bar.insertBefore(b, bar.querySelector('.energy-pill'));
  b.addEventListener('click', () => Music.panel());
  // la voce abbassa la musica
  const orig = Voice.say.bind(Voice);
  Voice.say = (t, en, opt) => { Music.duck(); orig(t, en, opt); };
  // se la musica era accesa, riparte al primo tocco (l'iPad non permette l'avvio senza un tocco)
  if (Music.pref().on) {
    const go1 = () => { document.removeEventListener('pointerdown', go1, true); if (!Music.playing) Music.start(); };
    document.addEventListener('pointerdown', go1, true);
  }
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && Music.playing) Music.stop(true);
    else if (document.visibilityState === 'visible' && Music.pref().on && !Music.playing) {
      const go2 = () => { document.removeEventListener('pointerdown', go2, true); if (!Music.playing && Music.pref().on) Music.start(); };
      document.addEventListener('pointerdown', go2, true);
    }
  });
})();
