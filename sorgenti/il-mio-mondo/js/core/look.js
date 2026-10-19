/* ================= PERSONALIZZA: la bambina somigliante alla bambina e la voce del drago ================= */
const LOOK_OPT = {
  skin: [['#fde3cf', 'Molto chiara'], ['#f6c9a6', 'Chiara'], ['#e8b48a', 'Dorata'], ['#c98e63', 'Olivastra'], ['#9a6440', 'Bruna'], ['#6b4128', 'Scura']],
  hair: [['#7a4a2a', 'Castani'], ['#4e2d18', 'Castano scuro'], ['#a26c43', 'Castano chiaro'], ['#2a1f1a', 'Neri'], ['#e2bd6b', 'Biondi'], ['#b5532c', 'Rossi']],
  feet: [['auto', '✨ Automatico: pattini sul ghiaccio'], ['scarpe', '👟 Scarpe da ginnastica'], ['pattini', '⛸️ Pattini da ghiaccio bianchi']],
  style: [['sciolti', 'Lunghi sciolti'], ['coda', 'Coda di cavallo'], ['treccia', 'Treccia'], ['chignon', 'Chignon'], ['caschetto', 'Corti']],
  eye: [['#5a3a22', 'Castani'], ['#3b2416', 'Scuri'], ['#3f7fbf', 'Azzurri'], ['#4f8a4f', 'Verdi'], ['#8a7a3f', 'Nocciola']],
  shirt: [['auto', 'Colore dell’esercizio'], ['#ff7a9c', 'Rosa'], ['#a879ff', 'Viola'], ['#5aa9ff', 'Azzurro'], ['#4bc0a8', 'Verde acqua'], ['#ff9f43', 'Arancione'], ['#ffd23f', 'Giallo'], ['#e5484d', 'Rosso'], ['#ffffff', 'Bianco']],
  leg: [['#4b3f72', 'Blu notte'], ['#2b2b33', 'Neri'], ['#c2185b', 'Fucsia'], ['#7e57c2', 'Lilla'], ['#5b8def', 'Jeans'], ['#9e9e9e', 'Grigi']],
  shoe: [['#ffffff', 'Bianche'], ['#ff7a9c', 'Rosa'], ['#5aa9ff', 'Azzurre'], ['#2b2b33', 'Nere']]
};
const LOOK_DEF = { skin: '#f6c9a6', hair: '#7a4a2a', style: 'sciolti', eye: '#5a3a22', shirt: 'auto', leg: '#4b3f72', shoe: '#ffffff', feet: 'auto', glasses: false, band: true };
const getLook = () => Object.assign({}, LOOK_DEF, store.get('girl-look', {}));
Girl.look(getLook());

/* ---------- Voce ---------- */
const F_NAMES = /alice|federica|emma|paola|elsa|silvia|chiara|isabella|giulia|elena|anna|sofia|francesca|bianca|martina|grandma|flo|sandy|shelley|female|donna|woman/i;
const M_NAMES = /luca|diego|cosimo|giorgio|roberto|paolo|andrea|giuseppe|marco|matteo|lorenzo|alessandro|davide|grandpa|eddy|reed|rocko|\bmale|uomo|\bman\b/i;
const QUALITY = /premium|enhanced|avanzat|migliorat|neural|natural|online|google/i;
function itVoices() {
  let vs = []; try { vs = speechSynthesis.getVoices().filter(v => /^it/i.test(v.lang)); } catch (e) {}
  return vs.map(v => ({ v, name: v.name, g: F_NAMES.test(v.name) ? 'f' : M_NAMES.test(v.name) ? 'm' : '?', q: QUALITY.test(v.name) }))
    .sort((a, b) => (b.q - a.q) || a.name.localeCompare(b.name));
}
const voicePref = () => Object.assign({ name: '', g: 'f', rate: 0.92 }, store.get('voice', {}));
/* la voce italiana scelta in «Personalizza»; l'inglese resta con la voce britannica (Voice.ve) */
Voice.pickIt = function () {
  const p = voicePref(), list = itVoices();
  const byName = list.find(x => x.name === p.name);
  const byG = list.find(x => x.g === p.g);
  this.v = (byName || byG || list[0] || {}).v || null;
};
// tono naturale: niente tono alzato (rende la voce metallica), velocità scelta
Voice.itOpts = () => ({ rate: voicePref().rate, pitch: 1 });
Voice.pickVoice();

/* ---------- Finestra «Personalizza» ---------- */
let custTab = 'bimba';
function openCustomize(tab) {
  if (tab) custTab = tab;
  const l = getLook();
  const sw = (key, label) => '<div class="cu-row"><div class="cu-l">' + label + '</div><div class="cu-sw">' + LOOK_OPT[key].map(([v, n]) =>
    key === 'style' || key === 'feet' || (key === 'shirt' && v === 'auto')
      ? '<button type="button" class="cu-chip" data-k="' + key + '" data-v="' + v + '" aria-pressed="' + (l[key] === v) + '">' + esc(n) + '</button>'
      : '<button type="button" class="cu-dot" data-k="' + key + '" data-v="' + v + '" aria-pressed="' + (l[key] === v) + '" aria-label="' + esc(n) + '" title="' + esc(n) + '" style="background:' + v + '"></button>').join('') + '</div></div>';
  let body;
  if (custTab === 'bimba') {
    body = '<div class="cu-grid"><div class="cu-prev" id="cu-prev"></div><div class="cu-opts">' +
      sw('skin', 'Pelle') + sw('hair', 'Colore dei capelli') + sw('style', 'Pettinatura') + sw('eye', 'Occhi') + sw('shirt', 'Maglietta') + sw('leg', 'Leggings') + sw('feet', 'Ai piedi') + sw('shoe', 'Colore delle scarpe') +
      '<div class="cu-row"><div class="cu-l">Dettagli</div><div class="cu-sw"><button type="button" class="cu-chip" data-t="glasses" aria-pressed="' + l.glasses + '">👓 Occhiali</button><button type="button" class="cu-chip" data-t="band" aria-pressed="' + l.band + '">🎀 Cerchietto</button></div></div>' +
      '<div class="row" style="gap:8px;margin-top:10px"><button type="button" class="btn small ghost" id="cu-reset">↺ Come all’inizio</button></div></div></div>';
  } else {
    const p = voicePref(), list = itVoices();
    const grp = (g, title) => { const xs = list.filter(x => x.g === g); return xs.length ? '<div class="cu-l" style="margin-top:10px">' + title + '</div><div class="vo-list">' + xs.map(x =>
      '<div class="vo' + (Voice.v && Voice.v.name === x.name ? ' sel' : '') + '"><button type="button" class="vo-pick" data-vn="' + esc(x.name) + '" data-vg="' + x.g + '"><b>' + esc(x.name.replace(/\s*\(.*$/, '').trim()) + '</b>' + (x.q ? '<small>⭐ qualità alta</small>' : '') + '</button><button type="button" class="btn small ghost vo-try" data-vt="' + esc(x.name) + '" aria-label="Prova">▶</button></div>').join('') + '</div>' : ''; };
    body = '<div class="row center" style="gap:8px;flex-wrap:wrap"><button type="button" class="cu-chip" data-g="f" aria-pressed="' + (p.g === 'f') + '">👩 Voce femminile</button><button type="button" class="cu-chip" data-g="m" aria-pressed="' + (p.g === 'm') + '">👨 Voce maschile</button></div>' +
      (list.length ? grp('f', 'Voci femminili') + grp('m', 'Voci maschili') + grp('?', 'Altre voci') : '<p style="font-weight:800">Su questo dispositivo non trovo voci italiane.</p>') +
      '<div class="cu-row" style="margin-top:12px"><div class="cu-l">Velocità</div><div class="cu-sw">' + [[0.82, '🐢 Lenta'], [0.92, '🙂 Normale'], [1.02, '🐇 Svelta']].map(([r, n]) => '<button type="button" class="cu-chip" data-r="' + r + '" aria-pressed="' + (Math.abs(p.rate - r) < .01) + '">' + n + '</button>').join('') + '</div></div>' +
      '<div class="explain" style="background:var(--c5-soft);text-align:left;margin-top:12px"><b>Voce più naturale sull’iPad:</b> Impostazioni → Accessibilità → Contenuti letti → Voci → Italiano, e scarica una voce <b>«avanzata»</b> o <b>«premium»</b> (per esempio Federica, Alice o Luca). Poi riapri l’app e sceglila qui: avrà la ⭐.<br><b>Per l’inglese</b> l’app usa da sola una voce britannica: nello stesso posto scegli <b>Inglese → Inglese (Regno Unito)</b> e scarica una voce «avanzata» (per esempio Daniel o Kate).' + (Voice.hasEnglish() ? '' : ' <b>Ora sull’iPad non c’è nessuna voce inglese.</b>') + '</div>';
  }
  openModal('<div class="big" style="font-size:28px">✨ Personalizza</div>' +
    '<div class="row center" style="gap:8px;margin:8px 0 12px"><button type="button" class="cu-tab" data-tab="bimba" aria-pressed="' + (custTab === 'bimba') + '">👧 La bambina</button><button type="button" class="cu-tab" data-tab="voce" aria-pressed="' + (custTab === 'voce') + '">🗣️ La voce</button></div>' +
    body + '<div class="row center" style="margin-top:14px"><button type="button" class="btn" id="cu-ok" data-focus style="--bc:var(--c6)">Fatto</button></div>', ['var(--c6)', 'var(--c6-soft)']);
  $('modal-box').classList.add('wide');
  $('cu-ok').addEventListener('click', () => { $('modal-box').classList.remove('wide'); closeModal(); if (current === 'sport' || current === 'home') go(current); });
  $('modal-box').querySelectorAll('.cu-tab').forEach(b => b.addEventListener('click', () => openCustomize(b.dataset.tab)));
  const save = nl => { store.set('girl-look', nl); Girl.look(nl); openCustomize(); };
  $('modal-box').querySelectorAll('[data-k]').forEach(b => b.addEventListener('click', () => { const nl = getLook(); nl[b.dataset.k] = b.dataset.v; save(nl); }));
  $('modal-box').querySelectorAll('[data-t]').forEach(b => b.addEventListener('click', () => { const nl = getLook(); nl[b.dataset.t] = !nl[b.dataset.t]; save(nl); }));
  if ($('cu-reset')) $('cu-reset').addEventListener('click', () => save(Object.assign({}, LOOK_DEF)));
  if ($('cu-prev')) {
    let t0 = performance.now(), raf = 0;
    const anim = now => { const el = $('cu-prev'); if (!el || $('modal').hidden) return; el.innerHTML = Girl.at('wave', now - t0, 'var(--c1)'); raf = requestAnimationFrame(anim); };
    anim(t0);
  }
  const setV = o => { store.set('voice', Object.assign(voicePref(), o)); Voice.v = null; Voice.pickVoice(); };
  $('modal-box').querySelectorAll('[data-g]').forEach(b => b.addEventListener('click', () => { setV({ g: b.dataset.g, name: '' }); Voice.say('Ciao ' + NAME + '! Sono ' + D.name + ', il tuo drago.'); openCustomize(); }));
  $('modal-box').querySelectorAll('[data-vn]').forEach(b => b.addEventListener('click', () => { setV({ name: b.dataset.vn, g: b.dataset.vg === '?' ? voicePref().g : b.dataset.vg }); Voice.say('Ciao ' + NAME + '! Sono ' + D.name + '. Ti piace questa voce?'); openCustomize(); }));
  $('modal-box').querySelectorAll('[data-vt]').forEach(b => b.addEventListener('click', () => { const keep = Voice.v; const x = itVoices().find(y => y.name === b.dataset.vt); if (x) { Voice.v = x.v; Voice.say('Ciao ' + NAME + '! Oggi impariamo insieme.'); Voice.v = keep; } }));
  $('modal-box').querySelectorAll('[data-r]').forEach(b => b.addEventListener('click', () => { setV({ rate: +b.dataset.r }); Voice.say('Ecco la nuova velocità.'); openCustomize(); }));
}
try { speechSynthesis.addEventListener && speechSynthesis.addEventListener('voiceschanged', () => { Voice.pickVoice(); }); } catch (e) {}
