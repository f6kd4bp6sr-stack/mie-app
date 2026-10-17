/* ================= 🎙️ VOCE IN INGRESSO (microfono) =================
   Oggi: «registra e riascolta». La bambina registra la sua voce e la confronta con quella del drago.
   La registrazione resta solo in memoria, non si salva da nessuna parte e si cancella appena si chiude l'esercizio.

   Architettura pronta per il futuro:
   - Mic.mode() sceglie il «fornitore»: 'self' (registra e riascolta, il confronto lo fa lei) oppure
     'riconosci' (riconoscimento vocale dell'iPad: l'app capirebbe se la frase è giusta).
   - 'riconosci' è SPENTO (MIC_RICONOSCI_ATTIVO = false): l'audio passerebbe dai server di Apple,
     quindi si accende solo dopo una scelta del genitore. Per accenderlo in futuro: mettere true qui,
     aggiungere la scelta nell'angolo del genitore (store 'mic-mode' = 'riconosci') e provarlo sull'iPad.
   - Ogni fornitore ha la stessa forma: available() → vero/falso; listen(frase, lingua) → Promise<{heard, score}>.
   - Mic.score(sentito, atteso) dà un punteggio da 0 a 1 (parole giuste nello stesso ordine), uguale per tutti i fornitori. */
const MIC_RICONOSCI_ATTIVO = false;
const Mic = {
  rec: null, chunks: [], stream: null, url: null, audio: null, timer: null,
  /* registrazione possibile su questo dispositivo? */
  canRecord() { return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && typeof window.MediaRecorder !== 'undefined'); },
  mime() {
    const c = ['audio/mp4', 'audio/webm;codecs=opus', 'audio/webm', 'audio/aac'];
    try { return c.find(t => MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(t)) || ''; } catch (e) { return ''; }
  },
  async start(maxMs) {
    this.clear();
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
    const m = this.mime();
    this.rec = m ? new MediaRecorder(this.stream, { mimeType: m }) : new MediaRecorder(this.stream);
    this.chunks = [];
    this.rec.ondataavailable = e => { if (e.data && e.data.size) this.chunks.push(e.data); };
    const done = new Promise(res => { this.rec.onstop = () => res(); });
    this.rec.start();
    this.timer = setTimeout(() => this.stop(), maxMs || 6000);
    return done;
  },
  stop() {
    clearTimeout(this.timer); this.timer = null;
    try { if (this.rec && this.rec.state !== 'inactive') this.rec.stop(); } catch (e) {}
    this.releaseMic();
  },
  /* spegne subito il microfono (sparisce il pallino arancione dell'iPad) */
  releaseMic() { try { if (this.stream) this.stream.getTracks().forEach(t => t.stop()); } catch (e) {} this.stream = null; },
  blobUrl() {
    if (this.url) return this.url;
    if (!this.chunks.length) return null;
    this.url = URL.createObjectURL(new Blob(this.chunks, { type: (this.rec && this.rec.mimeType) || 'audio/mp4' }));
    return this.url;
  },
  play(onend) {
    const u = this.blobUrl(); if (!u) return false;
    try { if (this.audio) this.audio.pause(); this.audio = new Audio(u); this.audio.onended = onend || null; this.audio.play().catch(() => {}); return true; } catch (e) { return false; }
  },
  /* cancella tutto: nessuna traccia della voce resta nell'app */
  clear() {
    this.stop();
    try { if (this.audio) this.audio.pause(); } catch (e) {}
    if (this.url) { try { URL.revokeObjectURL(this.url); } catch (e) {} }
    this.url = null; this.chunks = []; this.rec = null; this.audio = null;
  },
  /* ---------- fornitori del confronto ---------- */
  mode() { const m = store.get('mic-mode', 'self'); return m === 'riconosci' && this.PROV.riconosci.available() ? 'riconosci' : 'self'; },
  PROV: {
    self: { available: () => true, listen: () => Promise.resolve(null) },
    riconosci: {
      available: () => MIC_RICONOSCI_ATTIVO && !!(window.SpeechRecognition || window.webkitSpeechRecognition),
      listen(expected, lang) {
        return new Promise(res => {
          try {
            const R = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            R.lang = lang || 'en-GB'; R.interimResults = false; R.maxAlternatives = 3;
            let best = null;
            R.onresult = e => { const alts = [...e.results[0]].map(a => a.transcript); alts.forEach(h => { const sc = Mic.score(h, expected); if (!best || sc > best.score) best = { heard: h, score: sc }; }); };
            R.onend = () => res(best); R.onerror = () => res(null);
            R.start(); setTimeout(() => { try { R.stop(); } catch (x) {} }, 7000);
          } catch (e) { res(null); }
        });
      }
    }
  },
  /* punteggio 0–1: quante parole attese sono state dette, nell'ordine giusto */
  score(heard, expected) {
    const w = s => String(s || '').toLowerCase().replace(/[’']/g, "'").replace(/[^a-z0-9' ]+/g, ' ').split(/\s+/).filter(Boolean);
    const a = w(expected), b = w(heard); if (!a.length) return 0;
    const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
    for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
    return dp[a.length][b.length] / a.length;
  }
};
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') Mic.clear(); });

/* ---------- 🎙️ «Dillo tu»: pannello riutilizzabile ----------
   el: dove disegnarlo · phrase: frase inglese · opts.onDone(): chiamata la prima volta che completa il confronto */
function dilloTu(el, phrase, opts) {
  opts = opts || {};
  const can = Mic.canRecord();
  let state = 'idle', doneOnce = false;
  const paint = () => {
    el.innerHTML = '<div class="dt"><div class="dt-h">🎙️ <b>Dillo tu!</b> <span>Ascolta il drago, poi registra la tua voce e confrontale.</span></div>' +
      (opts.noPhrase ? '' : '<div class="dt-phrase">' + esc(phrase) + '</div>') +
      '<div class="dt-row">' +
        '<button type="button" class="btn small ghost" data-dt="drago">🐉 Drago</button>' +
        '<button type="button" class="btn small ghost" data-dt="piano">🐢 Piano</button>' +
        (can ? (state === 'rec' ? '<button type="button" class="btn small dt-rec on" data-dt="stop">⏹️ Fine</button>'
          : '<button type="button" class="btn small dt-rec" data-dt="rec">' + (state === 'have' ? '🔁 Di nuovo' : '🎙️ Registra') + '</button>') : '') +
        (can && state === 'have' ? '<button type="button" class="btn small" data-dt="me">▶️ Io</button><button type="button" class="btn small ghost" data-dt="both">🐉 + ▶️</button>' : '') +
      '</div>' +
      (state === 'rec' ? '<div class="dt-live">🔴 Sto ascoltando… di’ la frase, poi tocca Fine</div>' : '') +
      (state === 'have' ? '<div class="dt-ask">Assomiglia a quella del drago? <button type="button" class="btn small" data-dt="si">👍 Sì!</button><button type="button" class="btn small ghost" data-dt="rec">🔁 Riprovo</button></div>' : '') +
      (state === 'nomic' ? '<div class="dt-note">Il microfono non è disponibile: ripeti la frase ad alta voce insieme al drago. 🗣️</div>' : '') +
      (!can ? '<div class="dt-note">Ripeti la frase ad alta voce insieme al drago. 🗣️</div>' : '') +
      (state === 'ok' ? '<div class="dt-ok">🌟 Bravissima! Ripeterla ad alta voce la fa ricordare meglio.</div>' : '') +
      '<div class="dt-priv">🔒 La registrazione resta su questo iPad e si cancella da sola.</div></div>';
  };
  const act = async k => {
    if (k === 'drago') Voice.sayEn(phrase);
    else if (k === 'piano') Voice.sayEn(phrase, { slow: true });
    else if (k === 'rec') {
      try { speechSynthesis.cancel(); } catch (e) {}
      state = 'rec'; paint();
      try { await Mic.start(7000); state = Mic.blobUrl() ? 'have' : 'idle'; }
      catch (e) { state = 'nomic'; }
      paint(); if (state === 'have') Mic.play();
    }
    else if (k === 'stop') Mic.stop();
    else if (k === 'me') Mic.play();
    else if (k === 'both') { Voice.sayEn(phrase, { onend: () => setTimeout(() => Mic.play(), 350) }); }
    else if (k === 'si') { state = 'ok'; paint(); if (!doneOnce) { doneOnce = true; if (opts.onDone) opts.onDone(); } }
  };
  el.addEventListener('click', e => { const b = e.target.closest('[data-dt]'); if (!b) return; e.preventDefault(); act(b.dataset.dt); });
  paint();
  return { close: () => Mic.clear() };
}
