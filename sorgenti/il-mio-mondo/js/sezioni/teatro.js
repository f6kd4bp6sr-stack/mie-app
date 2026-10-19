/* ================= 🎭 TEATRO: la mia parte e i segreti del palco =================
   - «La mia parte»: un genitore incolla il copione (righe «NOME: battuta»), sceglie il personaggio e la data.
     Il copione resta solo sull'iPad (non va nei Progressi né al genitore via GitHub).
   - Allenamento in 5 passi: capisco la scena → ascolto → a pezzetti (iniziali) → botta e risposta → prova generale.
   - Ogni battuta ha il suo ripasso a distanza (1, 2, 3, 5 giorni), fino al giorno dello spettacolo.
   - «Dietro le quinte»: schede brevi con una mini-sfida (data/domande/teatro.js, autore + revisore). */
const T_KEY = 'teatro', T_GAP = [0, 1, 2, 3, 5, 8];
const T_ESEMPIO = 'Scena 1 – Nel bosco\n(Il bosco d’autunno. Entra la Lepre di corsa.)\nNARRATORE: Era una mattina d’autunno e le foglie cadevano come pioggia d’oro.\nLEPRE: Presto, presto! Devo trovare un riparo prima del vento!\nGUFO: Calma, piccola Lepre. Il vento arriva solo stasera.\nLEPRE: E tu come fai a saperlo?\nGUFO: Guardo il cielo da cento autunni. Le nuvole me lo dicono.\nLEPRE: Allora insegnami a leggere le nuvole!\nVOLPE: (entra sorridendo) Anch’io voglio imparare!\nLEPRE: Va bene, ma niente scherzi, Volpe.\nNARRATORE: E così, sotto la grande quercia, cominciò la scuola del cielo.';
const tState = () => Object.assign({ txt: '', pers: '', data: '', lettore: 'drago', cap: {}, srs: {}, lvl: {}, steps: {}, g: { d: '', n: 0 } }, store.get(T_KEY, {}));
const tSave = s => store.set(T_KEY, s);
const tTitle = s => String(s || '').toLowerCase().replace(/(^|[\s,'’+])([a-zà-ÿ])/g, (m, a, b) => a + b.toUpperCase());
const tNorm = s => String(s || '').toUpperCase().replace(/[’']/g, "'").replace(/\s+/g, ' ').trim();
const tHash = s => { let h = 0; const t = String(s).toLowerCase().replace(/\s+/g, ' ').trim(); for (let i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) | 0; return 'b' + (h >>> 0).toString(36); };
const tSpeak = s => String(s || '').replace(/\([^)]*\)/g, ' ').replace(/\s+/g, ' ').trim();   // senza le didascalie tra parentesi
/* gemme del teatro: al massimo 15 al giorno */
function tGems(n) { const s = tState(); if (s.g.d !== todayIso()) s.g = { d: todayIso(), n: 0 }; const can = Math.max(0, Math.min(n, 15 - s.g.n)); if (can) { s.g.n += can; tSave(s); Gems.add(can); } return can; }

/* copione → battute. Forme riconosciute:
   «NOME: battuta» · «NOME (come): battuta» · «NOME, NOME: battuta» · «TUTTI [NOME, NOME…] (come): battuta»
   «NOME:» da solo, con le righe sotto (canzoni): le righe restano andando a capo.
   «GRUPPO SQUADRA ROSSA = NOME, NOME…» definisce chi c'è in un gruppo. Righe con # : note, ignorate.
   Righe tra parentesi: didascalie. «Scena…», «Atto…»: titoli (e scena corrente). Le altre righe continuano la battuta di prima. */
function tSpeaker(l, G) {
  const m = l.match(/^([^:\[\]()]{1,70}?)\s*(\[[^\]]*\])?\s*(\([^)]*\))?\s*:\s*(.*)$/); if (!m) return null;
  const label = m[1].trim(), caps = label === label.toUpperCase() && /[A-ZÀ-Ý]/.test(label);
  const parts = label.split(/\s*,\s*|\s+e\s+|\s*\+\s*/i).filter(Boolean);
  if (!caps && !parts.every(x => /^[A-ZÀ-Ý]/.test(x) && x.split(/\s+/).length <= 2)) return null;
  if (caps && parts.some(x => x.split(/\s+/).length > 4)) return null;
  let who = m[2] ? m[2].slice(1, -1).split(',').map(tNorm).filter(Boolean) : (G[tNorm(label)] || parts.map(tNorm));
  return { who, name: label, t: ((m[3] ? m[3] + ' ' : '') + m[4]).trim() };
}
function tParse(txt) {
  const out = [], G = {}; let sc = '';
  String(txt || '').replace(/\r/g, '').split('\n').forEach(raw => {
    const l = raw.trim(); if (!l || /^#/.test(l)) return;
    const g = l.match(/^GRUPPO\s+(.+?)\s*=\s*(.+)$/i); if (g) { G[tNorm(g[1])] = g[2].split(',').map(tNorm).filter(Boolean); return; }
    if (/^[\(\[].*[\)\]]$/.test(l)) { out.push({ did: true, t: l, sc }); return; }
    if (/^(scena|atto|quadro|fine)\b/i.test(l)) { if (!/^fine\b/i.test(l)) sc = l; out.push({ did: true, t: l, sc, title: true }); return; }
    const sp = tSpeaker(l, G);
    if (sp) { sp.sc = sc; out.push(sp); return; }
    const m = l.match(/^([A-ZÀ-Ý][A-ZÀ-Ý'’ .]{1,28})\s+[-–—]\s+(.+)$/);
    if (m) { out.push({ who: [tNorm(m[1])], name: m[1].trim(), t: m[2].trim(), sc }); return; }
    const last = out[out.length - 1];
    if (last && !last.did) last.t += (last.t ? '\n' : '') + l; else out.push({ did: true, t: l, sc });
  });
  return out;
}
/* le persone (non i gruppi), in ordine alfabetico: così l'elenco non suggerisce chi parla di più */
function tPeople(list) { const c = {}; list.forEach(x => { if (!x.did) x.who.forEach(w => { const e = c[w] || (c[w] = { who: w, name: tTitle(w), n: 0 }); e.n++; }); }); return Object.values(c).sort((a, b) => a.who.localeCompare(b.who)); }
const tIsMe = (x, s) => !x.did && x.who.includes(s.pers);
/* le mie battute, ognuna con il suo segnale (la battuta subito prima) e con chi la dice insieme a lei */
function tMine(s) {
  const L = tParse(s.txt), out = [];
  L.forEach((x, i) => {
    if (!tIsMe(x, s)) return;
    let cue = null; for (let j = i - 1; j >= 0; j--) { if (!L[j].did) { cue = L[j]; break; } }
    out.push({ i, t: x.t, id: tHash(x.t + '|' + x.name), sc: x.sc, with: x.who.length > 1 ? tTitle(x.name) : '', cue: cue ? (tIsMe(cue, s) ? { name: 'tu', t: cue.t, me: true } : { name: tTitle(cue.name), t: cue.t }) : null });
  });
  return { all: L, mine: out };
}
const tDue = (s, id) => { const r = s.srs[id]; return !r || !r.d || r.d <= todayIso(); };
function tMark(id, grade) {   // grade: 2 giusta, 1 quasi, 0 da ripassare
  const s = tState(), r = s.srs[id] || { b: 0, d: '' };
  if (grade === 2) r.b = Math.min(T_GAP.length - 1, r.b + 1); else if (grade === 0) r.b = Math.max(0, r.b - 1);
  let gap = grade === 2 ? T_GAP[r.b] : grade === 1 ? 1 : 0;
  if (s.data && s.data > todayIso()) { const left = Math.round((fromIso(s.data) - fromIso(todayIso())) / 864e5); gap = Math.min(gap, Math.max(1, Math.floor(left / 2))); }   // prima dello spettacolo, almeno un ripasso a metà strada
  r.d = iso(addDays(fromIso(todayIso()), gap)); s.srs[id] = r; tSave(s);
}
/* testo con le didascalie tra parentesi in piccolo corsivo */
const tFmt = t => String(t || '').split(/(\([^)]*\))/).map(seg => /^\(/.test(seg) ? '<i class="tt-did">' + esc(seg) + '</i>' : esc(seg)).join('');
const tScName = sc => String(sc || '').split(':').pop().trim();
/* aiuti: 0 tutta · 1 una parola sì e una no · 2 solo le iniziali · 3 niente */
function tMask(t, lvl) {
  if (!lvl) return tFmt(t);
  if (lvl >= 3) return '<span class="tt-hid">🙈 a memoria</span>';
  let k = 0;
  return String(t).split(/(\([^)]*\))/).map(seg => {
    if (/^\(/.test(seg)) return '<i class="tt-did">' + esc(seg) + '</i>';
    return seg.split(/(\s+)/).map(w => {
      if (!/[A-Za-zÀ-ÿ0-9]/.test(w)) return esc(w);
      k++;
      if (lvl === 1 && k % 2) return esc(w);
      const m = w.match(/^([^A-Za-zÀ-ÿ0-9]*)([A-Za-zÀ-ÿ0-9])([A-Za-zÀ-ÿ0-9'’]*)(.*)$/);
      return m ? esc(m[1]) + '<b>' + esc(m[2]) + '</b>' + '<span class="tt-gap">' + '_'.repeat(Math.min(6, m[3].length)) + '</span>' + esc(m[4]) : esc(w);
    }).join('');
  }).join('');
}
const tDays = s => s.data ? Math.round((fromIso(s.data) - fromIso(todayIso())) / 864e5) : null;

/* ---------- pagina ---------- */
PAGES.teatro = el => {
  const s = tState(), M = s.txt && s.pers ? tMine(s) : null, mine = M ? M.mine : [], nopers = s.txt && !s.pers;
  const sure = mine.filter(x => (s.srs[x.id] || {}).b >= 3).length, due = mine.filter(x => tDue(s, x.id)).length, days = tDays(s);
  const st = s.steps || {};
  const step = (k, ic, t, d) => '<button type="button" class="v2-tile tt-step" data-tt="' + k + '"><span class="v2-ti">' + ic + '</span><b>' + t + (st[k] ? ' <span class="v2-ok">✓</span>' : '') + '</b><small>' + d + '</small></button>';
  el.innerHTML = '<h1 class="v2-h1">🎭 Teatro</h1><p class="v2-sub">La tua parte e i segreti del palco.</p>' +
    (days != null ? '<div class="v2-card v2-next tt-count"><span>' + (days > 0 ? '🎟️' : days === 0 ? '🌟' : '👏') + '</span><div><b>' + (days > 1 ? 'Mancano ' + days + ' giorni allo spettacolo' : days === 1 ? 'Domani è il grande giorno!' : days === 0 ? 'Oggi è il grande giorno! In bocca al lupo!' : 'Lo spettacolo è passato: bravissima!') + '</b><small>' + (days >= 0 && mine.length ? (due ? 'Oggi ripassa ' + due + (due === 1 ? ' battuta' : ' battute') + ': bastano 5 minuti.' : 'Oggi le battute sono tutte ripassate. 💪') : '') + '</small></div></div>' : '') +
    (M ? '<div class="v2-card"><div class="v2-ct">🎭 La mia parte: <b>' + esc((tPeople(M.all).find(p => p.who === s.pers) || { name: s.pers }).name) + '</b> <button type="button" class="btn small ghost" id="tt-chg">Non sono io</button></div>' +
        '<div class="v2-row"><span>Scene</span><b>' + esc([...new Set(mine.map(x => x.sc).filter(Boolean))].map(tScName).join(' · ')) + '</b></div>' +
        '<div class="v2-row"><span>Battute</span><b>' + mine.length + '</b></div><div class="v2-row"><span>Già sicure</span><b>' + sure + '/' + mine.length + '</b></div>' +
        '<div class="v2-bar"><i style="width:' + Math.round(sure / Math.max(1, mine.length) * 100) + '%;background:var(--v2-green)"></i></div></div>' +
        '<div class="v2-grid">' + step('capire', '🤔', '1. Capisco la scena', 'Chi sono, che cosa voglio') + step('ascolto', '👂', '2. Ascolto', 'Il drago legge tutta la scena') + step('pezzi', '🧩', '3. A pezzetti', 'Con le iniziali, un aiuto in meno ogni volta') +
        step('botta', '🔁', '4. Botta e risposta', 'Il segnale, poi tocca a te' + (due ? ' · ' + due + ' da ripassare' : '')) + step('prova', '🎬', '5. Prova generale', 'Tutta la scena, in piedi, con i gesti') + '</div>'
      : nopers ? '<div class="v2-card v2-next"><span>📜</span><div><b>Il copione è arrivato!</b><small>Prima leggi tutta la storia, poi trova da sola qual è la tua parte.</small></div></div><div class="v2-grid">' + step('lettura', '📖', '1. Leggo tutta la storia', 'Leggila o ascoltala dal drago') + step('trova', '🔍', '2. Trova la tua parte', 'Chi sei tu in questa storia?') + '</div>'
      : '<div class="v2-card v2-next"><span>📜</span><div><b>La tua parte arriva presto</b><small>Chiedi a mamma o papà di inserire il copione qui sotto, in «Per il genitore». Intanto scopri i segreti del palco!</small></div></div>') +
    '<h2 class="v2-h2" style="margin-top:18px">🎪 Dietro le quinte</h2><div class="tt-cards">' + TEATRO.schede.map((c, i) => '<details class="v2-card tt-card"><summary><span class="tt-ic">' + c.ic + '</span><span><b>' + esc(c.t) + '</b><small>' + esc(c.k) + '</small></span></summary><p>' + esc(c.testo) + ' ' + sayBtn(c.t + '. ' + c.k + ' ' + c.testo) + '</p><div class="tt-sf" data-sf="' + i + '"></div></details>').join('') + '</div>' +
    '<div class="v2-card"><div class="v2-ct">📋 Le regole del palco</div><ol class="tt-rules">' + TEATRO.palco.map(r => '<li>' + esc(r) + '</li>').join('') + '</ol></div>' +
    '<h2 class="v2-h2">🏠 Missioni a casa</h2><ul class="missions" id="tt-mis"></ul>' +
    tParentBox(s, M);
  el.querySelectorAll('[data-tt]').forEach(b => b.addEventListener('click', () => ({ lettura: () => tAscolto(true), trova: tTrova, capire: tCapire, ascolto: () => tAscolto(false), pezzi: tPezzi, botta: tBotta, prova: tProva })[b.dataset.tt]()));
  if ($('tt-chg')) $('tt-chg').addEventListener('click', () => { if (!confirm('Vuoi cercare di nuovo la tua parte?')) return; const n = tState(); n.pers = ''; tSave(n); go('teatro'); });
  el.querySelectorAll('[data-sf]').forEach(box => tSfida(box, +box.dataset.sf));
  renderMissions($('tt-mis'), TEATRO.missioni.map(m => [m.t, m.x]), 'teatro');
  tParentWire(el);
};
function tSfida(box, i) {
  const c = TEATRO.schede[i].sfida, done = store.get('teatro-sfide', {}), opts = shuffle([c.ok].concat(c.wrong));
  box.innerHTML = '<div class="tt-sq">🎯 ' + esc(c.q) + '</div><div class="tt-so">' + opts.map(o => '<button type="button" class="btn small ghost" data-o="' + esc(o) + '">' + esc(o) + '</button>').join('') + '</div><div class="tt-se"></div>';
  box.querySelectorAll('[data-o]').forEach(b => b.addEventListener('click', () => {
    const ok = b.dataset.o === c.ok;
    box.querySelectorAll('[data-o]').forEach(x => { x.disabled = true; if (x.dataset.o === c.ok) x.classList.add('tt-right'); });
    if (!ok) b.classList.add('tt-wrong');
    box.querySelector('.tt-se').innerHTML = '<b>' + (ok ? 'Giusto! 🎉' : 'La risposta è: ' + esc(c.ok)) + '</b> ' + esc(c.e) + ' <button type="button" class="btn small ghost" data-again>Rifai</button>';
    box.querySelector('[data-again]').addEventListener('click', () => tSfida(box, i));
    if (ok) { ding(); if (!done[i]) { done[i] = 1; store.set('teatro-sfide', done); const g = tGems(2); if (g) cheer(b, '+' + g + ' 💎'); } } else oops();
  }));
}

/* ---------- 👨‍👧 per il genitore: copione, personaggio, data, chi legge ---------- */
function tParentBox(s, M) {
  const ppl = s.txt ? tPeople(tParse(s.txt)) : [];
  return '<details class="v2-card tt-par"' + (s.txt && !s.pers ? ' open' : '') + '><summary><b>👨‍👧 Per il genitore: copione, personaggio, data</b></summary>' +
    '<p class="tt-note">Incolla il copione (anche solo le scene della bimba). Ogni battuta su una riga, così: <b>NOME: battuta</b>. Le righe tra parentesi sono didascalie. Copione su carta? Fotografalo, nella foto tieni premuto sul testo → <b>Copia</b>, poi incolla qui. Il copione resta solo su questo iPad.</p>' +
    '<textarea id="tt-txt" rows="8" placeholder="NARRATORE: C’era una volta…\nLEPRE: Presto, presto!">' + esc(s.txt) + '</textarea>' +
    '<div class="row" style="gap:8px;flex-wrap:wrap;margin-top:8px"><button type="button" class="btn small" id="tt-read">📜 Leggi il copione</button><button type="button" class="btn small ghost" id="tt-file">📂 Carica da file (.txt)</button><button type="button" class="btn small ghost" id="tt-ex">Prova con un esempio</button><input type="file" id="tt-fin" accept=".txt,text/plain" hidden></div>' +
    (ppl.length ? '<p class="tt-note">Il personaggio lo trova lei: dopo la lettura tocca «🔍 Trova la tua parte».</p><details class="tt-sub"><summary class="tt-note">Oppure sceglilo tu</summary><div class="tt-ppl">' + ppl.map(p => '<button type="button" class="btn small ' + (p.who === s.pers ? '' : 'ghost') + '" data-pers="' + esc(p.who) + '">' + esc(p.name) + '</button>').join('') + '</div></details>' : '') +
    (M ? '<p class="tt-note">' + M.mine.length + ' battute trovate per questo personaggio, su ' + M.all.filter(x => !x.did).length + ' in tutto.</p>' : '') +
    '<div class="row" style="gap:12px;flex-wrap:wrap;margin-top:8px;align-items:end"><label class="tt-l">Data dello spettacolo<input type="date" id="tt-data" value="' + esc(s.data) + '"></label>' +
    '<label class="tt-l">Le battute degli altri<select id="tt-let"><option value="drago"' + (s.lettore !== 'genitore' ? ' selected' : '') + '>le legge il drago</option><option value="genitore"' + (s.lettore === 'genitore' ? ' selected' : '') + '>le legge un genitore</option></select></label></div>' +
    (s.txt ? '<button type="button" class="btn small ghost" id="tt-del" style="margin-top:10px">Togli il copione</button>' : '') + '</details>';
}
function tParentWire(el) {
  const s = tState();
  const read = txt => { const L = tParse(txt), ppl = tPeople(L); if (!ppl.length) { toastV2('Non trovo battute: scrivi ogni battuta come «NOME: battuta»'); return; } const n = tState(); n.txt = txt; if (!ppl.some(p => p.who === n.pers)) n.pers = ''; tSave(n); go('teatro'); toastV2('📜 ' + L.filter(x => !x.did).length + ' battute, ' + ppl.length + ' personaggi: ora lei legge la storia e trova la sua parte'); };
  $('tt-read').addEventListener('click', () => { const t = $('tt-txt').value.trim(); if (!t) { toastV2('Incolla prima il copione'); return; } read(t); });
  $('tt-file').addEventListener('click', () => $('tt-fin').click());
  $('tt-fin').addEventListener('change', async e => { const f = e.target.files && e.target.files[0]; e.target.value = ''; if (!f) return; if (s.txt && !confirm('Sostituire il copione con quello del file?')) return; try { read((await f.text()).trim()); } catch (x) { toastV2('File non leggibile'); } });
  $('tt-ex').addEventListener('click', () => { if (s.txt && !confirm('Sostituire il copione con l’esempio?')) return; read(T_ESEMPIO); });
  el.querySelectorAll('[data-pers]').forEach(b => b.addEventListener('click', () => { const n = tState(); n.pers = b.dataset.pers; tSave(n); go('teatro'); }));
  $('tt-data').addEventListener('change', e => { const n = tState(); n.data = e.target.value; tSave(n); go('teatro'); });
  $('tt-let').addEventListener('change', e => { const n = tState(); n.lettore = e.target.value; tSave(n); });
  if ($('tt-del')) $('tt-del').addEventListener('click', () => { if (!confirm('Togliere il copione e i ripassi delle battute?')) return; const n = tState(); n.txt = ''; n.pers = ''; n.srs = {}; n.lvl = {}; n.steps = {}; tSave(n); go('teatro'); });
}

/* ---------- finestra a tutto schermo per gli esercizi ---------- */
function tOverlay(title) {
  let ov = $('tt-ov'); if (!ov) { ov = document.createElement('div'); ov.id = 'tt-ov'; ov.className = 'tt-ov'; document.body.appendChild(ov); }
  ov.hidden = false; document.body.classList.add('in-lesson');
  ov.innerHTML = '<div class="tt-top"><button type="button" class="ls-x" id="tt-x" aria-label="Chiudi">✕</button><b>' + title + '</b></div><div class="tt-body" id="tt-body"></div>';
  $('tt-x').addEventListener('click', tClose);
  return $('tt-body');
}
let tDidStep = false;
function tClose() { try { speechSynthesis.cancel(); } catch (e) {} if (typeof Mic !== 'undefined') Mic.clear(); const ov = $('tt-ov'); if (ov) ov.hidden = true; document.body.classList.remove('in-lesson'); go('teatro');
  if (tDidStep) { tDidStep = false; if (typeof activityDone === 'function') try { activityDone(); } catch (e) {} } }   // energia e pause del drago solo a esercizio chiuso
function tDone(k, gems) { const s = tState(); s.steps = s.steps || {}; s.steps[k] = (s.steps[k] || 0) + 1; tSave(s); const g = tGems(gems); if (g) toastV2('🎭 +' + g + ' 💎'); tDidStep = true; }
const tWho = (x, s) => tIsMe(x, s) ? (x.who.length > 1 ? tTitle(x.name) + ' (anche tu)' : 'Tu') : tTitle(x.name);

/* 🔍 trova la tua parte: dopo la lettura sceglie lei il personaggio, poi due domande per esserne sicura */
function tTrova() {
  const s = tState(), L = tParse(s.txt), ppl = tPeople(L), b = tOverlay('🔍 Trova la tua parte');
  b.innerHTML = '<p class="tt-note">Hai letto tutta la storia? Allora tocca il tuo personaggio.</p><div class="tt-names">' + ppl.map(p => '<button type="button" class="btn ghost" data-p="' + esc(p.who) + '">' + esc(p.name) + '</button>').join('') + '</div>' +
    '<button type="button" class="btn small ghost" id="tt-rel" style="margin-top:12px">📖 Rileggo la storia</button>';
  $('tt-rel').addEventListener('click', () => tAscolto(true));
  b.querySelectorAll('[data-p]').forEach(x => x.addEventListener('click', () => tTrovaCheck(x.dataset.p)));
}
function tTrovaCheck(who) {
  const s = tState(), t = Object.assign({}, s, { pers: who }), M = tMine(t), b = $('tt-body'), nm = tTitle(who);
  if (!M.mine.length) { b.innerHTML = '<p class="tt-note">' + esc(nm) + ' non ha battute. Riprova!</p>'; setTimeout(tTrova, 1500); return; }
  const solo = M.mine.filter(x => !x.with), first = solo[0] || M.mine[0];
  const short = x => { const y = tSpeak(x).replace(/\n/g, ' '); return y.length > 80 ? y.slice(0, 78) + '…' : y; };
  const others = shuffle(M.all.filter(x => !x.did && !tIsMe(x, t) && x.who.length === 1 && tSpeak(x.t).length > 8));
  const q1 = { q: 'Qual è la tua prima battuta' + (first.with ? ' (insieme agli altri)' : '') + '?', ok: short(first.t), wrong: others.slice(0, 2).map(x => short(x.t)) };
  const cueN = first.cue && !first.cue.me ? first.cue.name : null;
  const names = shuffle([...new Set(M.all.filter(x => !x.did && !tIsMe(x, t)).map(x => tTitle(x.name)))].filter(n => !cueN || n !== tTitle(cueN)));
  const q2 = cueN ? { q: 'Chi parla subito prima della tua prima battuta?', ok: tTitle(cueN), wrong: names.slice(0, 2) } : null;
  const Q = [q1, q2].filter(x => x && x.wrong.length === 2);
  const scenes = [...new Set(M.mine.map(x => x.sc).filter(Boolean))];
  let qi = 0, ok = 0;
  const ask = () => {
    if (qi >= Q.length) {
      b.innerHTML = '<div class="tt-end"><div style="font-size:52px">🎭</div><b>Sei ' + esc(nm) + '!</b><p>Hai <b>' + M.mine.length + ' battute</b>: ' + solo.length + ' da sola e ' + (M.mine.length - solo.length) + ' insieme ad altri.</p><p class="tt-note">Reciti in: ' + esc(scenes.map(tScName).join(' · ')) + '</p>' +
        '<div class="row center" style="gap:8px;flex-wrap:wrap"><button type="button" class="btn" id="tt-si">Sì, sono io! Comincio</button><button type="button" class="btn ghost" id="tt-no">No, scelgo un altro</button></div></div>';
      $('tt-si').addEventListener('click', () => { const n = tState(); n.pers = who; tSave(n); tDone('trova', 3 + ok); tClose(); });
      $('tt-no').addEventListener('click', tTrova); return;
    }
    const q = Q[qi], opts = shuffle([q.ok].concat(q.wrong));
    b.innerHTML = '<div class="tt-prog">Sei proprio ' + esc(nm) + '? Controlliamo: ' + (qi + 1) + ' di ' + Q.length + '</div><div class="tt-big tt-ask">' + esc(q.q) + '</div><div class="tt-opts">' + opts.map(o => '<button type="button" class="btn ghost" data-o="' + esc(o) + '">' + esc(o) + '</button>').join('') + '</div><div class="tt-se"></div>';
    b.querySelectorAll('[data-o]').forEach(x => x.addEventListener('click', () => {
      const good = x.dataset.o === q.ok; b.querySelectorAll('[data-o]').forEach(y => { y.disabled = true; if (y.dataset.o === q.ok) y.classList.add('tt-right'); });
      if (good) { ok++; ding(); } else { x.classList.add('tt-wrong'); oops(); }
      b.querySelector('.tt-se').innerHTML = '<b>' + (good ? 'Giusto! 🎉' : 'Era quella colorata: rileggila con calma.') + '</b> <button type="button" class="btn small" id="tt-go">Avanti ›</button>';
      $('tt-go').addEventListener('click', () => { qi++; ask(); });
    }));
  };
  ask();
}
/* 1. capisco la scena */
function tCapire() {
  const s = tState(), b = tOverlay('🤔 Capisco la scena');
  b.innerHTML = '<p class="tt-note">Prima di imparare le parole, capisci la storia: le battute si ricordano meglio quando sai <b>perché</b> le dici. Rispondi a voce o scrivi qui.</p>' +
    TEATRO.capire.map((c, i) => '<div class="tt-q"><b>' + esc(c.q) + '</b> ' + sayBtn(c.q + ' ' + c.aiuto) + '<small>' + esc(c.aiuto) + '</small><textarea data-cap="' + i + '" rows="2">' + esc((s.cap || {})[i] || '') + '</textarea></div>').join('') +
    '<button type="button" class="btn" id="tt-ok">Fatto ✓</button>';
  $('tt-ok').addEventListener('click', () => { const n = tState(); n.cap = {}; b.querySelectorAll('[data-cap]').forEach(t => n.cap[t.dataset.cap] = t.value.slice(0, 400)); tSave(n); tDone('capire', 3); tClose(); });
}
/* 2. ascolto: il drago legge tutta la scena, la mia parte è evidenziata */
function tAscolto(first) {
  const s = tState(), M = tMine(s), b = tOverlay(first ? '📖 Leggo tutta la storia' : '👂 Ascolto la scena');
  b.innerHTML = '<div class="row" style="gap:8px"><button type="button" class="btn" id="tt-play">▶️ Ascolta</button><button type="button" class="btn ghost" id="tt-stop">⏸️ Ferma</button></div><p class="tt-note">' + (first ? 'Leggi tutta la storia (o ascoltala dal drago) e cerca: <b>quale personaggio sei tu?</b> Quando l’hai trovato, chiudi e tocca «Trova la tua parte».' : 'Segui con gli occhi: le tue battute sono colorate.') + '</p>' +
    '<div class="tt-script">' + M.all.map((x, i) => x.did ? '<p class="tt-d' + (x.title ? ' tt-title' : '') + '" data-i="' + i + '">' + esc(x.t) + '</p>' : '<p class="tt-line' + (tIsMe(x, s) ? ' me' : '') + '" data-i="' + i + '"><b>' + esc(tWho(x, s)) + ':</b> ' + tFmt(x.t) + '</p>').join('') + '</div>';
  let k = -1, on = false;
  const lines = M.all.map((x, i) => ({ x, i })).filter(o => !o.x.did);
  const next = () => {
    if (!on) return; k++; b.querySelectorAll('.tt-line.now').forEach(e => e.classList.remove('now'));
    if (k >= lines.length) { on = false; tDone(first ? 'lettura' : 'ascolto', 2); toastV2('👏 Storia finita!'); return; }
    const o = lines[k], e = b.querySelector('[data-i="' + o.i + '"]'); if (e) { e.classList.add('now'); e.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
    Voice.say(tSpeak(o.x.t), null, { onend: () => setTimeout(next, 350) });
  };
  $('tt-play').addEventListener('click', () => { try { speechSynthesis.cancel(); } catch (e) {} on = true; k = (k < 0 || k >= lines.length) ? -1 : k - 1; next(); });   // riprende dalla battuta interrotta
  $('tt-stop').addEventListener('click', () => { on = false; try { speechSynthesis.cancel(); } catch (e) {} });
}
/* 3. a pezzetti: una battuta alla volta, un aiuto in meno ogni volta */
function tPezzi() {
  const s0 = tState(), M = tMine(s0), b = tOverlay('🧩 A pezzetti'); let j = 0;
  const paint = () => {
    const s = tState(), x = M.mine[j], lvl = (s.lvl || {})[x.id] || 0;
    b.innerHTML = '<div class="tt-prog">Battuta ' + (j + 1) + ' di ' + M.mine.length + '</div>' +
      (x.cue ? '<div class="tt-cue"><small>Il segnale' + (x.cue.me ? ' (dici tu anche prima)' : ', ' + esc(x.cue.name)) + ':</small> «' + tFmt(x.cue.t) + '»</div>' : '<div class="tt-cue"><small>Cominci tu la scena!</small></div>') +
      (x.with ? '<div class="tt-with">👭 Insieme: ' + esc(x.with) + '</div>' : '') + '<div class="tt-big">' + tMask(x.t, lvl) + '</div>' +
      '<div class="tt-lv">' + ['Tutta', 'Metà parole', 'Iniziali', 'A memoria'].map((n, i) => '<span class="' + (i === lvl ? 'on' : i < lvl ? 'ok' : '') + '">' + n + '</span>').join('') + '</div>' +
      '<p class="tt-note">Leggila, dilla ad alta voce con il gesto giusto, poi togli un aiuto.</p>' +
      '<div class="row" style="gap:8px;flex-wrap:wrap"><button type="button" class="btn ghost" id="tt-say">🔊 Ascolta</button><button type="button" class="btn ghost" id="tt-peek">👀 Sbircia</button>' +
      (lvl < 3 ? '<button type="button" class="btn" id="tt-less">➖ Un aiuto in meno</button>' : '<button type="button" class="btn" id="tt-know">✓ La so!</button>') + '</div>' +
      '<div class="row" style="gap:8px;margin-top:14px"><button type="button" class="btn small ghost" id="tt-prev"' + (j ? '' : ' disabled') + '>‹ Prima</button><button type="button" class="btn small ghost" id="tt-next">' + (j < M.mine.length - 1 ? 'Dopo ›' : 'Finito ✓') + '</button></div>';
    $('tt-say').addEventListener('click', () => Voice.say(tSpeak(x.t)));
    $('tt-peek').addEventListener('click', () => { const e = b.querySelector('.tt-big'); e.innerHTML = tFmt(x.t); setTimeout(() => { if (e.isConnected) e.innerHTML = tMask(x.t, lvl); }, 2500); });
    if ($('tt-less')) $('tt-less').addEventListener('click', () => { const n = tState(); n.lvl = n.lvl || {}; n.lvl[x.id] = lvl + 1; tSave(n); paint(); });
    if ($('tt-know')) $('tt-know').addEventListener('click', () => { tMark(x.id, 2); ding(); if (j < M.mine.length - 1) { j++; paint(); } else { tDone('pezzi', 4); tClose(); } });
    $('tt-prev').addEventListener('click', () => { j = Math.max(0, j - 1); paint(); });
    $('tt-next').addEventListener('click', () => { if (j < M.mine.length - 1) { j++; paint(); } else { tDone('pezzi', 3); tClose(); } });
  };
  paint();
}
/* 4. botta e risposta: il segnale, poi tocca a lei; prima le battute da ripassare */
function tBotta() {
  const s = tState(), M = tMine(s), b = tOverlay('🔁 Botta e risposta');
  const dueL = M.mine.filter(x => tDue(s, x.id)), rest = M.mine.filter(x => !tDue(s, x.id));
  let q = dueL.concat(rest).slice(0, 8), j = 0, good = 0;
  const can = typeof Mic !== 'undefined' && Mic.canRecord();
  const paint = () => {
    if (j >= q.length) { tDone('botta', 3); b.innerHTML = '<div class="tt-end"><div style="font-size:56px">🎉</div><b>Giro finito!</b><p>' + good + ' su ' + q.length + ' giuste al primo colpo.</p><button type="button" class="btn" id="tt-fine">Chiudi</button></div>'; $('tt-fine').addEventListener('click', tClose); return; }
    const x = q[j], par = tState().lettore === 'genitore';
    b.innerHTML = '<div class="tt-prog">' + (j + 1) + ' di ' + q.length + '</div>' +
      (x.cue ? '<div class="tt-cue big"><small>' + (par ? '👨‍👧 Il genitore legge' : '🐉 Il drago dice') + (x.cue.me ? ' (la tua battuta di prima)' : ' (' + esc(x.cue.name) + ')') + ':</small> «' + tFmt(x.cue.t) + '»' + (par ? '' : ' <button type="button" class="say" id="tt-cuesay" aria-label="Riascolta">🔊</button>') + '</div>' : '<div class="tt-cue big"><small>Cominci tu la scena!</small></div>') +
      (x.with ? '<div class="tt-with">👭 Insieme: ' + esc(x.with) + '</div>' : '') + '<div class="tt-big tt-ask">🎤 Tocca a te: dilla ad alta voce!</div>' +
      (can ? '<div class="row" style="gap:8px"><button type="button" class="btn small dt-rec" id="tt-rec">🎙️ Registrami</button><button type="button" class="btn small ghost" id="tt-me" hidden>▶️ Riascoltami</button></div>' : '') +
      '<button type="button" class="btn" id="tt-show" style="margin-top:12px">👀 Guarda la battuta</button><div id="tt-res"></div>';
    if (x.cue && !par) { const say = () => Voice.say(tSpeak(x.cue.t)); setTimeout(say, 300); $('tt-cuesay').addEventListener('click', say); }
    if (can) {
      let rec = false;
      $('tt-rec').addEventListener('click', async () => {
        if (rec) { Mic.stop(); return; }
        try { speechSynthesis.cancel(); } catch (e) {}
        rec = true; $('tt-rec').textContent = '⏹️ Fine'; $('tt-rec').classList.add('on');
        try { await Mic.start(15000); } catch (e) { toastV2('Microfono non disponibile: dilla ad alta voce'); }
        rec = false; if ($('tt-rec')) { $('tt-rec').textContent = '🔁 Di nuovo'; $('tt-rec').classList.remove('on'); }
        if (Mic.blobUrl() && $('tt-me')) { $('tt-me').hidden = false; Mic.play(); }
      });
      $('tt-me').addEventListener('click', () => Mic.play());
    }
    $('tt-show').addEventListener('click', () => {
      $('tt-show').hidden = true;
      $('tt-res').innerHTML = '<div class="tt-big tt-ans">' + tFmt(x.t) + '</div><div class="row" style="gap:8px;flex-wrap:wrap"><button type="button" class="btn" data-g="2">😀 Giusta</button><button type="button" class="btn ghost" data-g="1">🙂 Quasi</button><button type="button" class="btn ghost" data-g="0">😕 Da ripassare</button></div>';
      $('tt-res').querySelectorAll('[data-g]').forEach(g => g.addEventListener('click', () => {
        const v = +g.dataset.g; tMark(x.id, v); if (typeof Mic !== 'undefined') Mic.clear();
        if (v === 2) { good++; ding(); tGems(1); } else if (v === 0 && q.filter(y => y === x).length < 2) q.push(x);   // da ripassare: torna una volta alla fine del giro
        j++; paint();
      }));
    });
  };
  paint();
}
/* 5. prova generale: tutta la scena di fila; quando tocca a lei, la battuta è nascosta */
function tProva() {
  const s = tState(), M = tMine(s), b = tOverlay('🎬 Prova generale'), par = s.lettore === 'genitore';
  const sc0 = M.mine.length ? M.mine[0].sc : '', L0 = M.all;
  const myS = new Set(M.mine.map(x => x.sc)), L = L0.filter(x => myS.has(x.sc) && !x.title); let k = 0, aiuti = 0;   // solo le scene in cui c'è lei
  const paint = () => {
    if (k >= L.length) { tDone('prova', 5); b.innerHTML = '<div class="tt-end"><div style="font-size:56px">👏👏👏</div><b>Applausi! Scena finita.</b><p>' + (aiuti ? 'Aiuti usati: ' + aiuti + '. Alla prossima ne serviranno meno!' : 'Senza nessun aiuto: bravissima!') + '</p><p class="tt-note">E ora l’inchino, come alle prove. 🙇</p><button type="button" class="btn" id="tt-fine">Chiudi</button></div>'; $('tt-fine').addEventListener('click', tClose); return; }
    const x = L[k];
    if (x.did) { b.innerHTML = '<p class="tt-note">Fallo in piedi, con i gesti, come sul palco.</p><div class="tt-d big">' + esc(x.t) + '</div><button type="button" class="btn" id="tt-av">Avanti ›</button>'; $('tt-av').addEventListener('click', () => { k++; paint(); }); return; }
    const me = tIsMe(x, s);
    if (!me) {
      b.innerHTML = '<p class="tt-note">Fallo in piedi, con i gesti, come sul palco.</p><div class="tt-cue big"><small>' + esc(tTitle(x.name)) + (par ? ' · legge il genitore' : '') + '</small> «' + tFmt(x.t) + '»</div><button type="button" class="btn" id="tt-av">Avanti ›</button>';
      $('tt-av').addEventListener('click', () => { try { speechSynthesis.cancel(); } catch (e) {} k++; paint(); });
      if (!par) Voice.say(tSpeak(x.t), null, { onend: () => setTimeout(() => { if (L[k] === x && $('tt-av')) { k++; paint(); } }, 500) });
      return;
    }
    let lvl = 3;
    const show = () => { b.querySelector('.tt-big').innerHTML = tMask(x.t, lvl); };
    b.innerHTML = '<p class="tt-note">🎤 <b>Tocca a te!</b> ' + (x.who.length > 1 ? 'Insieme: ' + esc(tTitle(x.name)) + '. ' : '') + 'Dilla ad alta voce.</p><div class="tt-big me">' + tMask(x.t, 3) + '</div>' +
      '<div class="row" style="gap:8px;flex-wrap:wrap"><button type="button" class="btn ghost" id="tt-help">💡 Aiutino</button><button type="button" class="btn ghost" id="tt-all">👀 Mostra</button><button type="button" class="btn" id="tt-av">Detta! ›</button></div>';
    $('tt-help').addEventListener('click', () => { if (lvl > 1) { lvl--; aiuti++; show(); } });
    $('tt-all').addEventListener('click', () => { if (lvl > 0) { lvl = 0; aiuti++; show(); } });
    $('tt-av').addEventListener('click', () => { tMark(tHash(x.t + '|' + x.name), lvl === 3 ? 2 : 1); k++; paint(); });
  };
  paint();
}
