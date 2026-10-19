/* ================= 🎨 DISEGNO: tela libera, impara a disegnare, il mio museo =================
   - Tela: matita, pennarello, pastello, acquerello, sfumino, gomma, secchiello, forme (linea, rettangolo, ovale),
     righello (linee dritte), simmetria a specchio, livelli (fino a 5), foglio di ricalco (una foto o un modello sotto),
     annulla/ripeti. Con l'Apple Pencil il tratto segue la pressione; «solo Pencil» ignora il palmo sullo schermo.
   - Impara: il percorso di data/domande/disegno.js (5 fasi, progetti a livelli). Ogni progetto: passi con la guida
     tratteggiata da ricalcare («Guarda» mostra il tratto animato), poi «Ora da sola» senza guida.
   - Il mio museo: ogni disegno salvato diventa un quadro; il museo cresce (sale, cornici, arredi, visitatori).
   Dati: store 'disegno' (progressi, elenco dei quadri con anteprima piccola: entra nelle copie);
   immagini grandi e livelli nel database dell'iPad 'mondo-disegni' (restano sull'iPad: per tenerle altrove, «Condividi»). */
const DS_KEY = 'disegno', DS_W = 1200, DS_H = 900, DS_S = 1.25, DS_MAXL = 5;
const dsState = () => { const s = Object.assign({ done: {}, museo: [], opts: {}, visti: {} }, store.get(DS_KEY, {})); if (!Array.isArray(s.museo)) s.museo = []; return s; };
const dsSave = s => store.set(DS_KEY, s);
const DSDB = {
  db() { return new Promise((res, rej) => { try { const r = indexedDB.open('mondo-disegni', 1); r.onupgradeneeded = () => r.result.createObjectStore('f'); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); } catch (e) { rej(e); } }); },
  async op(mode, fn) { const db = await this.db(); return new Promise((res, rej) => { const tx = db.transaction('f', mode), st = tx.objectStore('f'), q = fn(st); tx.oncomplete = () => res(q && q.result); tx.onerror = () => rej(tx.error); }); },
  get(k) { return this.op('readonly', s => s.get(k)).catch(() => null); },
  put(k, v) { return this.op('readwrite', s => s.put(v, k)).catch(() => null); },
  del(k) { return this.op('readwrite', s => s.delete(k)).catch(() => null); }
};
const dsCol = k => DIS_COL[k] || k || '#222222';
const dsFase = id => DIS_FASI.find(f => f.id === id);
const dsProj = id => DIS_PROG.find(p => p.id === id);
/* sblocco progressivo: la prima fase è aperta; ogni fase si apre con 3 progetti finiti della precedente; dentro la fase, un progetto alla volta */
function dsFaseOpen(i, s) { if (i === 0) return true; const prev = DIS_PROG.filter(p => p.f === DIS_FASI[i - 1].id); return prev.filter(p => s.done[p.id]).length >= Math.min(3, prev.length); }
function dsProjOpen(p, s) { const i = DIS_FASI.findIndex(f => f.id === p.f); if (!dsFaseOpen(i, s)) return false; const L = DIS_PROG.filter(q => q.f === p.f), k = L.indexOf(p); return k === 0 || !!s.done[L[k - 1].id] || !!s.done[p.id]; }
const dsNext = s => DIS_PROG.find(p => !s.done[p.id] && dsProjOpen(p, s));

/* ================= 🏛️ il museo che cresce ================= */
const DS_LIV = [[0, 'La mia piccola galleria'], [3, 'La mia galleria'], [8, 'Il mio museo'], [15, 'Il grande museo'], [30, 'Il museo nazionale'], [50, 'Il museo dei capolavori']];
const DS_ARR = [[2, '🪑', 'una panchina per i visitatori'], [4, '🪴', 'le piante all’ingresso'], [6, '💡', 'le luci per i quadri'], [9, '🗿', 'una statua'], [12, '🟥', 'il tappeto rosso'], [16, '⛲', 'la fontana'], [20, '🎻', 'la musica nelle sale'], [25, '🎟️', 'la biglietteria'], [35, '🌟', 'la sala dei capolavori illuminata'], [50, '🏛️', 'la facciata con le colonne']];
const dsLiv = n => DS_LIV.filter(x => n >= x[0]).pop()[1];
const dsCornice = n => n >= 15 ? 'oro' : n >= 5 ? 'argento' : 'legno';
const dsSale = s => { const R = [{ id: 'libera', ic: '🖌️', n: 'Sala della fantasia' }].concat(DIS_FASI.map(f => ({ id: f.id, ic: f.ic, n: f.sala }))); if (s.museo.some(q => q.top)) R.push({ id: 'top', ic: '⭐', n: 'Sala dei capolavori' }); return R; };
const dsInSala = (s, id) => id === 'top' ? s.museo.filter(q => q.top) : s.museo.filter(q => (q.sala || 'libera') === id);
const dsVisit = n => n ? Math.round(n * 37 + Math.sqrt(n) * 113) : 0;

/* ================= pagina ================= */
let dsView = 'home', dsSala = null;
PAGES.disegno = el => {
  const s = dsState(), n = s.museo.length, nx = dsNext(s), ndone = Object.keys(s.done).length;
  if (dsView === 'impara') return dsImpara(el, s);
  if (dsView === 'museo') return dsMuseo(el, s);
  const idea = DIS_IDEE[(new Date().getDate() + new Date().getMonth() * 31) % DIS_IDEE.length];
  el.innerHTML = '<h1 class="v2-h1">🎨 Disegno</h1><p class="v2-sub">Disegna quello che vuoi, impara le basi un passo alla volta e riempi il tuo museo.</p>' +
    '<div class="v2-grid">' +
    '<button type="button" class="v2-tile" id="ds-libera"><span class="v2-ti">🖌️</span><b>Tela libera</b><small>Matita, pennarelli, pastelli, acquerello, livelli e ricalco</small></button>' +
    '<button type="button" class="v2-tile" id="ds-impara"><span class="v2-ti">📚</span><b>Impara a disegnare</b><small>' + ndone + ' progetti su ' + DIS_PROG.length + (nx ? ' · prossimo: ' + esc(nx.n) : ' · tutti finiti!') + '</small></button>' +
    '<button type="button" class="v2-tile" id="ds-museo"><span class="v2-ti">🏛️</span><b>' + esc(dsLiv(n)) + '</b><small>' + n + (n === 1 ? ' quadro' : ' quadri') + (n ? ' · ' + dsVisit(n) + ' visitatori' : ' · il primo disegno salvato apre il museo') + '</small></button></div>' +
    '<div class="card ds-idea"><b>💡 Idea di oggi</b><p>Disegna ' + esc(idea) + '.</p><button type="button" class="btn small" id="ds-idea">Comincia</button></div>';
  $('ds-libera').onclick = () => dsFree();
  $('ds-impara').onclick = () => { dsView = 'impara'; PAGES.disegno(el); window.scrollTo(0, 0); };
  $('ds-museo').onclick = () => { dsView = 'museo'; dsSala = null; PAGES.disegno(el); window.scrollTo(0, 0); };
  $('ds-idea').onclick = () => dsEditor({ title: 'Idea: ' + idea });
};
function dsBack(el, html) { return '<button type="button" class="btn small ghost ds-back" id="ds-back">← Disegno</button>' + html; }
function dsWireBack(el) { const b = $('ds-back'); if (b) b.onclick = () => { if (dsView === 'museo' && dsSala) { dsSala = null; } else dsView = 'home'; PAGES.disegno(el); window.scrollTo(0, 0); }; }

/* ---------- 📚 impara ---------- */
function dsImpara(el, s) {
  const nx = dsNext(s);
  el.innerHTML = dsBack(el, '<h1 class="v2-h1">📚 Impara a disegnare</h1><p class="v2-sub">Cinque tappe, dal più semplice al più difficile. In ogni progetto ricalchi la guida passo passo, poi lo rifai da sola.</p>' +
    DIS_FASI.map((f, i) => {
      const L = DIS_PROG.filter(p => p.f === f.id), dn = L.filter(p => s.done[p.id]).length, open = dsFaseOpen(i, s);
      return '<div class="card ds-fase' + (open ? '' : ' chiusa') + '"><div class="ds-fh"><span class="ds-fi">' + f.ic + '</span><div><b>' + (i + 1) + '. ' + esc(f.n) + '</b><small>' + (open ? dn + ' su ' + L.length + ' fatti' : '🔒 si apre con 3 progetti della tappa prima') + '</small></div></div>' +
        '<p class="ds-ft">' + esc(f.t) + '</p>' + (open ? '<div class="ds-plist">' + L.map(p => {
          const ok = !!s.done[p.id], av = dsProjOpen(p, s), me = nx && nx.id === p.id;
          return '<button type="button" class="ds-proj' + (ok ? ' ok' : '') + (me ? ' me' : '') + '" data-dp="' + p.id + '"' + (av ? '' : ' disabled') + '><span class="ds-pi">' + (av ? p.ic : '🔒') + '</span><span class="ds-pt"><b>' + esc(p.n) + '</b><small>' + '★'.repeat(p.lv) + '☆'.repeat(3 - p.lv) + ' · impari ' + esc(p.impara) + '</small></span><span class="ds-ps">' + (ok ? '✓' : me ? '▶' : '') + '</span></button>';
        }).join('') + '</div>' : '') + '</div>';
    }).join(''));
  dsWireBack(el);
  el.querySelectorAll('[data-dp]').forEach(b => b.onclick = async () => {
    const pid = b.dataset.dp, bz = await DSDB.get('bozza');
    if (bz && bz.pid === pid && bz.layers && bz.layers.length) {
      openModal('<div style="font-size:46px">' + dsProj(pid).ic + '</div><div class="big" style="font-size:22px">Avevi cominciato questo progetto</div><button type="button" class="btn" id="dsb-c" data-focus>Continua da dove eri</button> <button type="button" class="btn ghost" id="dsb-n">Ricomincia</button>', ['#c2410c', '#ffedd5']);
      $('dsb-c').onclick = () => { closeModal(); dsEditor({ pid, cont: bz }); };
      $('dsb-n').onclick = () => { closeModal(); DSDB.del('bozza'); dsEditor({ pid }); };
    } else dsEditor({ pid });
  });
}

/* ---------- 🏛️ museo ---------- */
function dsMuseo(el, s) {
  const n = s.museo.length, sale = dsSale(s), arr = DS_ARR.filter(a => n >= a[0]), nextA = DS_ARR.find(a => n < a[0]);
  if (dsSala) {
    const sa = sale.find(x => x.id === dsSala) || sale[0], Q = dsInSala(s, sa.id).slice().reverse();
    el.innerHTML = dsBack(el, '<h1 class="v2-h1">' + sa.ic + ' ' + esc(sa.n) + '</h1><p class="v2-sub">' + Q.length + (Q.length === 1 ? ' quadro' : ' quadri') + ' · cornici ' + dsCornice(n) + '</p>' +
      (Q.length ? '<div class="ds-wall">' + Q.map(q => '<button type="button" class="ds-frame ' + (q.top ? 'oro top' : dsCornice(n)) + '" data-dq="' + q.id + '"><img alt="" src="' + q.th + '"><span class="ds-tag"><b>' + esc(q.t || 'Senza titolo') + '</b><small>' + esc(fmtShort(q.d)) + (q.tec ? ' · ' + esc(q.tec) : '') + '</small></span></button>').join('') + '</div>'
        : '<div class="card"><p>Questa sala è ancora vuota: ' + (sa.id === 'libera' ? 'salva un disegno della tela libera.' : sa.id === 'top' ? 'segna un quadro come capolavoro ⭐.' : 'salva un progetto di questa tappa.') + '</p></div>'));
    dsWireBack(el);
    el.querySelectorAll('[data-dq]').forEach(b => b.onclick = () => dsQuadro(b.dataset.dq, el));
    return;
  }
  el.innerHTML = dsBack(el, '<h1 class="v2-h1">🏛️ ' + esc(dsLiv(n)) + '</h1><p class="v2-sub">' + n + (n === 1 ? ' quadro' : ' quadri') + (n ? ' · ' + dsVisit(n) + ' visitatori immaginari · cornici ' + dsCornice(n) : '') + '</p>' +
    '<div class="card ds-hall"><div class="ds-arr">' + (arr.length ? arr.map(a => '<span title="' + esc(a[2]) + '">' + a[1] + '</span>').join('') : '<small>L’ingresso è ancora vuoto.</small>') + '</div>' +
    (nextA ? '<small>Con ' + nextA[0] + ' quadri arriva ' + esc(nextA[2]) + ' ' + nextA[1] + '.</small>' : '<small>Il museo è completo: continua a riempire le sale!</small>') + '</div>' +
    '<div class="ds-sale">' + sale.map(sa => { const Q = dsInSala(s, sa.id), open = Q.length || sa.id === 'libera'; return '<button type="button" class="ds-sala' + (open ? '' : ' chiusa') + '" data-ds="' + sa.id + '"' + (open ? '' : ' disabled') + '><span class="ds-si">' + (open ? sa.ic : '🚧') + '</span><b>' + esc(sa.n) + '</b><small>' + (open ? Q.length + (Q.length === 1 ? ' quadro' : ' quadri') : 'si apre con il primo quadro') + '</small>' + (Q.length ? '<span class="ds-mini">' + Q.slice(-3).map(q => '<img alt="" src="' + q.th + '">').join('') + '</span>' : '') + '</button>'; }).join('') + '</div>');
  dsWireBack(el);
  el.querySelectorAll('[data-ds]').forEach(b => b.onclick = () => { dsSala = b.dataset.ds; PAGES.disegno(el); window.scrollTo(0, 0); });
}
async function dsQuadro(id, el) {
  const s = dsState(), q = s.museo.find(x => x.id === id); if (!q) return;
  const blob = await DSDB.get('img-' + id), url = blob ? URL.createObjectURL(blob) : q.th, lay = await DSDB.get('lay-' + id);
  openModal('<div class="ds-qbig"><img alt="" src="' + url + '"></div><div class="big" style="font-size:22px">' + esc(q.t || 'Senza titolo') + '</div><p style="margin:4px 0 10px;font-weight:700">' + esc(fmtDay(q.d)) + (q.tec ? ' · ' + esc(q.tec) : '') + (blob ? '' : ' · anteprima (l’originale non è su questo iPad)') + '</p>' +
    '<div class="ds-qbtn">' + (lay ? '<button type="button" class="btn small" id="dq-cont">✏️ Continua</button>' : '') + '<button type="button" class="btn small" id="dq-top">' + (q.top ? '☆ Non più capolavoro' : '⭐ Capolavoro') + '</button><button type="button" class="btn small" id="dq-nome">✍️ Titolo</button>' + (blob ? '<button type="button" class="btn small" id="dq-sh">📤 Condividi o salva</button>' : '') + '<button type="button" class="btn small ghost" id="dq-del">🗑️ Togli</button><button type="button" class="btn small ghost" id="dq-ok" data-focus>Chiudi</button></div>', ['#c2410c', '#ffedd5']);
  const done = () => { closeModal(); if (blob) URL.revokeObjectURL(url); PAGES.disegno(el); };
  $('dq-ok').onclick = done;
  if ($('dq-cont')) $('dq-cont').onclick = () => { done(); dsEditor({ qid: id, title: q.t, sala: q.sala, pid: q.pid, cont: lay }); };
  $('dq-top').onclick = () => { q.top = !q.top; dsSave(s); toastV2(q.top ? '⭐ Nella sala dei capolavori' : 'Tolto dai capolavori'); done(); };
  $('dq-nome').onclick = () => { const t = prompt('Titolo del quadro:', q.t || ''); if (t == null) return; q.t = t.trim().slice(0, 60); dsSave(s); done(); };
  if ($('dq-sh')) $('dq-sh').onclick = async () => { try { const f = new File([blob], (q.t || 'disegno').replace(/[^\wàèéìòù -]/gi, '').slice(0, 40) + '.jpg', { type: 'image/jpeg' }); if (navigator.canShare && navigator.canShare({ files: [f] })) await navigator.share({ files: [f], title: q.t || 'Il mio disegno' }); else { const a = document.createElement('a'); a.href = url; a.download = f.name; a.click(); } } catch (e) {} };
  $('dq-del').onclick = async () => { if (!confirm('Togliere questo quadro dal museo? Non si potrà recuperare.')) return; s.museo = s.museo.filter(x => x.id !== id); dsSave(s); await DSDB.del('img-' + id); await DSDB.del('lay-' + id); toastV2('Quadro tolto'); done(); };
}

/* ================= 🖌️ la tela ================= */
const DS_TOOLS = [['matita', '✏️', 'Matita'], ['pennarello', '🖊️', 'Pennarello'], ['pastello', '🖍️', 'Pastello'], ['acquerello', '💧', 'Acquerello'], ['sfumino', '👆', 'Sfumino'], ['gomma', '🧽', 'Gomma'], ['secchiello', '🪣', 'Secchiello'], ['linea', '📏', 'Linea'], ['rett', '▭', 'Rettangolo'], ['ovale', '◯', 'Ovale']];
const DS_PAL = ['nero', 'grigio', 'bianco', 'marrone', 'rosa', 'rosso', 'arancione', 'giallo', 'verdechiaro', 'verde', 'azzurro', 'blu', 'viola', 'celestino'];
let DS = null;
function dsFree() {
  DSDB.get('bozza').then(b => {
    if (b && b.layers && b.layers.length && !b.pid) {
      openModal('<div style="font-size:46px">🖌️</div><div class="big" style="font-size:22px">Hai un disegno lasciato a metà</div><p style="font-weight:700">' + esc(b.title || 'Senza titolo') + '</p><button type="button" class="btn" id="dsb-c" data-focus>Continua</button> <button type="button" class="btn ghost" id="dsb-n">Foglio nuovo</button>', ['#c2410c', '#ffedd5']);
      $('dsb-c').onclick = () => { closeModal(); dsEditor({ title: b.title, cont: b, bozza: 1 }); };
      $('dsb-n').onclick = () => { closeModal(); DSDB.del('bozza'); dsEditor({}); };
    } else dsEditor({});
  });
}
function dsCanvas() { const c = document.createElement('canvas'); c.width = Math.round(DS_W * DS_S); c.height = Math.round(DS_H * DS_S); return c; }
function dsGrain(col, coarse) {
  const c = document.createElement('canvas'); c.width = c.height = 96; const x = c.getContext('2d'), im = x.createImageData(96, 96), h = col.replace('#', ''), r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < im.data.length; i += 4) { const v = rnd(); im.data[i] = r; im.data[i + 1] = g; im.data[i + 2] = b; im.data[i + 3] = coarse ? (v < 0.28 ? 0 : 150 + v * 105) : (v < 0.12 ? 40 : 170 + v * 85); }
  x.putImageData(im, 0, 0); return c;
}
async function dsEditor(o) {
  const s = dsState(), proj = o.pid ? dsProj(o.pid) : null;
  const ov = document.createElement('div'); ov.className = 'ds-ed'; ov.id = 'ds-ed';
  ov.innerHTML = '<div class="ds-top"><button type="button" class="btn small ghost" id="de-x" aria-label="Chiudi">✕</button><b class="ds-ttl" id="de-ttl"></b>' +
    '<button type="button" class="btn small ghost" id="de-un" aria-label="Annulla">↶</button><button type="button" class="btn small ghost" id="de-re" aria-label="Ripeti">↷</button><button type="button" class="btn small" id="de-sv">💾 Nel museo</button></div>' +
    '<div class="ds-body"><div class="ds-tools" id="de-tools"></div><div class="ds-stage" id="de-stage"><div class="ds-stack" id="de-stack"></div></div><div class="ds-side" id="de-side"></div></div>' +
    '<div class="ds-lez" id="de-lez" hidden></div>';
  document.body.appendChild(ov); document.body.classList.add('ds-open');
  DS = { o, proj, step: 0, solo: false, layers: [], act: 0, tool: 'matita', col: '#222222', w: 8, alpha: 1, sym: false, ruler: false, pen: !!s.opts.pen, sawPen: false, undo: [], redo: [], guide: true, ric: null, ricOp: 0.35, ricVis: true, tec: new Set(), title: o.title || (proj ? proj.n : ''), dirty: false, guided: null };
  const stack = $('de-stack');
  DS.bg = document.createElement('div'); DS.bg.className = 'ds-paper'; stack.appendChild(DS.bg);
  DS.ricImg = document.createElement('img'); DS.ricImg.className = 'ds-ric'; DS.ricImg.alt = ''; DS.ricImg.hidden = true; stack.appendChild(DS.ricImg);
  DS.tmp = dsCanvas(); DS.tmp.className = 'ds-tmp';
  DS.guideEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); DS.guideEl.setAttribute('viewBox', '0 0 ' + DS_W + ' ' + DS_H); DS.guideEl.setAttribute('class', 'ds-guide');
  if (o.cont && o.cont.layers) { for (const L of o.cont.layers) await dsAddLayer(L.n, L.blob, L.vis !== false, L.op); DS.act = Math.min(o.cont.act || 0, DS.layers.length - 1); }
  else { dsAddLayer('Colore'); dsAddLayer('Linee'); DS.act = 1; }
  dsRestack();
  if (proj) { DS.tool = proj.tool; DS.col = dsCol(proj.col); DS.step = o.cont && o.cont.step != null ? Math.min(o.cont.step, proj.passi.length - 1) : 0; if (o.cont && o.cont.solo) DS.solo = true; }
  dsTools(); dsSide(); dsTitle(); dsFit(); dsLesson();
  window.addEventListener('resize', dsFit);
  dsPointer(stack);
  $('de-x').onclick = () => dsClose();
  $('de-un').onclick = () => dsUndo(); $('de-re').onclick = () => dsRedo();
  $('de-sv').onclick = () => dsSaveAsk();
}
async function dsAddLayer(n, blob, vis, op) {
  if (DS.layers.length >= DS_MAXL) { toastV2('Al massimo ' + DS_MAXL + ' livelli'); return; }
  const c = dsCanvas(), L = { id: 'L' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), n: n || 'Livello ' + (DS.layers.length + 1), c, x: c.getContext('2d'), vis: vis !== false, op: op == null ? 1 : op };
  if (blob) { try { const bm = await createImageBitmap(blob); L.x.drawImage(bm, 0, 0, c.width, c.height); } catch (e) {} }
  c.className = 'ds-layer'; DS.layers.push(L); return L;
}
function dsRestack() {
  const st = $('de-stack'); if (!st) return;
  DS.layers.forEach(L => L.c.remove()); DS.tmp.remove(); DS.guideEl.remove();
  DS.layers.forEach((L, i) => { L.c.style.opacity = L.vis ? L.op : 0; st.appendChild(L.c); if (i === DS.act) st.appendChild(DS.tmp); });
  if (!DS.layers.length) st.appendChild(DS.tmp);
  st.appendChild(DS.guideEl);
}
function dsFit() {
  const st = $('de-stage'), k = $('de-stack'); if (!st || !k) return;
  const r = st.getBoundingClientRect(), sc = Math.min(r.width / DS_W, r.height / DS_H);
  k.style.width = DS_W * sc + 'px'; k.style.height = DS_H * sc + 'px'; DS.sc = sc;
}
function dsTitle() { const t = $('de-ttl'); if (t) t.textContent = DS.proj ? DS.proj.ic + ' ' + DS.proj.n + (DS.solo ? ' · da sola' : ' · passo ' + (DS.step + 1) + ' di ' + DS.proj.passi.length) : (DS.title || 'Tela libera'); }
function dsTools() {
  const box = $('de-tools');
  box.innerHTML = DS_TOOLS.map(t => '<button type="button" class="ds-tb' + (DS.tool === t[0] ? ' on' : '') + '" data-dt="' + t[0] + '" title="' + t[2] + '"><span>' + t[1] + '</span><small>' + t[2] + '</small></button>').join('') +
    '<button type="button" class="ds-tb' + (DS.ruler ? ' on' : '') + '" id="de-rul" title="Righello: linee dritte"><span>📐</span><small>Dritto</small></button>' +
    '<button type="button" class="ds-tb' + (DS.sym ? ' on' : '') + '" id="de-sym" title="Simmetria a specchio"><span>🦋</span><small>Specchio</small></button>';
  box.querySelectorAll('[data-dt]').forEach(b => b.onclick = () => { DS.tool = b.dataset.dt; dsTools(); dsSide(); });
  $('de-rul').onclick = () => { DS.ruler = !DS.ruler; dsTools(); toastV2(DS.ruler ? '📐 Righello: ogni tratto viene dritto' : 'Righello spento'); };
  $('de-sym').onclick = () => { DS.sym = !DS.sym; dsTools(); dsGuide(); toastV2(DS.sym ? '🦋 Specchio: disegni anche dall’altra parte' : 'Specchio spento'); };
}
function dsSide() {
  const box = $('de-side'), shape = ['linea', 'rett', 'ovale'].includes(DS.tool);
  box.innerHTML = '<div class="ds-pal">' + DS_PAL.map(k => '<button type="button" class="ds-sw' + (DS.col === dsCol(k) ? ' on' : '') + '" style="background:' + dsCol(k) + '" data-dc="' + k + '" aria-label="' + k + '"></button>').join('') + '<label class="ds-sw ds-pick" title="Altro colore"><input type="color" id="de-pick" value="' + DS.col + '"></label></div>' +
    (DS.tool !== 'secchiello' ? '<label class="ds-rng">Spessore<input type="range" id="de-w" min="1" max="60" value="' + DS.w + '"></label>' : '') +
    (shape ? '<label class="ds-chk"><input type="checkbox" id="de-fill"' + (DS.fill ? ' checked' : '') + '> forma piena</label>' : '') +
    '<div class="ds-lay"><b>Livelli</b>' + DS.layers.map((L, i) => '<div class="ds-li' + (i === DS.act ? ' on' : '') + '"><button type="button" class="ds-ln" data-la="' + i + '">' + esc(L.n) + '</button><button type="button" class="ds-lv" data-lv="' + i + '" aria-label="Mostra o nascondi">' + (L.vis ? '👁️' : '🚫') + '</button>' + (i ? '<button type="button" class="ds-lv" data-ld="' + i + '" aria-label="Giù">⬇️</button>' : '') + '</div>').reverse().join('') +
    '<div class="ds-lrow"><button type="button" class="btn small ghost" id="de-ladd">➕</button><button type="button" class="btn small ghost" id="de-ldel">🗑️</button><label class="ds-op">trasparenza<input type="range" id="de-lop" min="10" max="100" value="' + Math.round((DS.layers[DS.act] || { op: 1 }).op * 100) + '"></label></div></div>' +
    '<div class="ds-lay"><b>Foglio di ricalco</b><div class="ds-lrow"><label class="btn small ghost" style="cursor:pointer">🖼️ Foto<input type="file" accept="image/*" id="de-ricf" hidden></label>' + (DS.ric ? '<button type="button" class="btn small ghost" id="de-ricv">' + (DS.ricVis ? '🙈 Nascondi' : '👁️ Mostra') + '</button><button type="button" class="btn small ghost" id="de-ricx">✕</button>' : '') + '</div>' + (DS.ric ? '<label class="ds-op">visibile<input type="range" id="de-rico" min="10" max="80" value="' + Math.round(DS.ricOp * 100) + '"></label>' : '<small>Metti sotto una foto o un disegno da ricalcare: non finisce nel quadro.</small>') + '</div>' +
    '<label class="ds-chk"><input type="checkbox" id="de-pen"' + (DS.pen ? ' checked' : '') + '> ✍️ Solo Apple Pencil (il palmo non disegna)</label>' +
    '<button type="button" class="btn small ghost" id="de-clr">🧹 Pulisci il livello</button>';
  box.querySelectorAll('[data-dc]').forEach(b => b.onclick = () => { DS.col = dsCol(b.dataset.dc); dsSide(); });
  const pk = $('de-pick'); if (pk) pk.oninput = () => { DS.col = pk.value; };
  const w = $('de-w'); if (w) w.oninput = () => { DS.w = +w.value; };
  const fi = $('de-fill'); if (fi) fi.onchange = () => { DS.fill = fi.checked; };
  box.querySelectorAll('[data-la]').forEach(b => b.onclick = () => { DS.act = +b.dataset.la; dsRestack(); dsSide(); });
  box.querySelectorAll('[data-lv]').forEach(b => b.onclick = () => { const L = DS.layers[+b.dataset.lv]; L.vis = !L.vis; dsRestack(); dsSide(); });
  box.querySelectorAll('[data-ld]').forEach(b => b.onclick = () => { const i = +b.dataset.ld, L = DS.layers.splice(i, 1)[0]; DS.layers.splice(i - 1, 0, L); if (DS.act === i) DS.act = i - 1; else if (DS.act === i - 1) DS.act = i; dsRestack(); dsSide(); dsDirty(); });
  $('de-ladd').onclick = async () => { const L = await dsAddLayer(); if (L) { DS.act = DS.layers.length - 1; dsRestack(); dsSide(); } };
  $('de-ldel').onclick = () => { if (DS.layers.length < 2) return toastV2('Serve almeno un livello'); if (!confirm('Togliere il livello «' + DS.layers[DS.act].n + '» con quello che c’è disegnato?')) return; const L = DS.layers.splice(DS.act, 1)[0]; L.c.remove(); DS.act = Math.max(0, DS.act - 1); DS.undo = DS.undo.filter(u => u.L !== L); dsRestack(); dsSide(); dsDirty(); };
  const lo = $('de-lop'); if (lo) lo.oninput = () => { const L = DS.layers[DS.act]; L.op = lo.value / 100; dsRestack(); };
  $('de-ricf').onchange = e => { const f = e.target.files && e.target.files[0]; if (!f) return; const u = URL.createObjectURL(f); DS.ric = u; DS.ricImg.src = u; DS.ricImg.hidden = false; DS.ricVis = true; DS.ricImg.style.opacity = DS.ricOp; dsSide(); };
  if ($('de-ricv')) $('de-ricv').onclick = () => { DS.ricVis = !DS.ricVis; DS.ricImg.hidden = !DS.ricVis; dsSide(); };
  if ($('de-ricx')) $('de-ricx').onclick = () => { DS.ric = null; DS.ricImg.hidden = true; DS.ricImg.removeAttribute('src'); dsSide(); };
  const ro = $('de-rico'); if (ro) ro.oninput = () => { DS.ricOp = ro.value / 100; DS.ricImg.style.opacity = DS.ricOp; };
  $('de-pen').onchange = e => { DS.pen = e.target.checked; const s = dsState(); s.opts.pen = DS.pen ? 1 : 0; dsSave(s); };
  $('de-clr').onclick = () => { const L = DS.layers[DS.act]; if (!confirm('Cancellare tutto il livello «' + L.n + '»?')) return; const u = dsSnapBefore(L); L.x.clearRect(0, 0, L.c.width, L.c.height); dsPushUndo(u, L, 0, 0, L.c.width, L.c.height); };
}

/* ---------- annulla / ripeti: solo il rettangolo toccato ---------- */
function dsSnapBefore(L) { const c = document.createElement('canvas'); c.width = L.c.width; c.height = L.c.height; c.getContext('2d').drawImage(L.c, 0, 0); return c; }
function dsPushUndo(before, L, x, y, w, h) {
  x = Math.max(0, Math.floor(x)); y = Math.max(0, Math.floor(y)); w = Math.min(L.c.width - x, Math.ceil(w)); h = Math.min(L.c.height - y, Math.ceil(h)); if (w <= 0 || h <= 0) return;
  const b = before.getContext('2d').getImageData(x, y, w, h), a = L.x.getImageData(x, y, w, h);
  DS.undo.push({ L, x, y, b, a }); if (DS.undo.length > 30) DS.undo.shift(); DS.redo = []; dsDirty();
}
function dsUndo() { const u = DS.undo.pop(); if (!u) return toastV2('Niente da annullare'); u.L.x.putImageData(u.b, u.x, u.y); DS.redo.push(u); dsDirty(); }
function dsRedo() { const u = DS.redo.pop(); if (!u) return; u.L.x.putImageData(u.a, u.x, u.y); DS.undo.push(u); dsDirty(); }
function dsDirty() { DS.dirty = true; clearTimeout(DS.bt); DS.bt = setTimeout(dsBozza, 1500); }
async function dsLayersData() { const out = []; for (const L of DS.layers) { const b = await new Promise(r => L.c.toBlob(r, 'image/png')); out.push({ n: L.n, vis: L.vis, op: L.op, blob: b }); } return out; }
async function dsBozza() { if (!DS || DS.saving) return; try { await DSDB.put('bozza', { title: DS.title, pid: DS.proj ? DS.proj.id : '', step: DS.step, solo: DS.solo ? 1 : 0, act: DS.act, layers: await dsLayersData(), at: Date.now() }); } catch (e) {} }

/* ---------- tratti ---------- */
function dsPointer(stack) {
  let cur = null;
  const pt = e => { const r = stack.getBoundingClientRect(); return { x: (e.clientX - r.left) / r.width * DS_W * DS_S, y: (e.clientY - r.top) / r.height * DS_H * DS_S, p: e.pointerType === 'pen' ? (e.pressure || 0.5) : 0.5 }; };
  stack.addEventListener('pointerdown', e => {
    if (e.pointerType === 'pen') DS.sawPen = true;
    if (DS.pen && DS.sawPen && e.pointerType === 'touch') return;
    const L = DS.layers[DS.act]; if (!L) return; if (!L.vis) return toastV2('Questo livello è nascosto: toccalo con 👁️ per vederlo');
    e.preventDefault(); try { stack.setPointerCapture(e.pointerId); } catch (x) {}
    const P = pt(e);
    if (DS.tool === 'secchiello') { dsFill(L, P.x, P.y); DS.tec.add('secchiello'); return; }
    cur = { id: e.pointerId, L, pts: [P], before: dsSnapBefore(L), box: [P.x, P.y, P.x, P.y], last: P };
    DS.tec.add(DS.tool);
    dsStrokeStart(cur);
  });
  stack.addEventListener('pointermove', e => {
    if (!cur || e.pointerId !== cur.id) return; e.preventDefault();
    const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
    for (const ev of (evs.length ? evs : [e])) { const P = pt(ev); dsStrokeMove(cur, P); }
  });
  const end = e => { if (!cur || e.pointerId !== cur.id) return; dsStrokeEnd(cur); cur = null; };
  stack.addEventListener('pointerup', end); stack.addEventListener('pointercancel', end);
  stack.addEventListener('touchmove', e => { if (cur) e.preventDefault(); }, { passive: false });
}
const dsShape = () => ['linea', 'rett', 'ovale'].includes(DS.tool) || (DS.ruler && ['matita', 'pennarello', 'pastello', 'acquerello', 'gomma'].includes(DS.tool));
function dsStyle(ctx, P) {
  const t = DS.tool, w = DS.w * DS_S, p = P ? P.p : 0.5;
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (t === 'matita') { ctx.lineWidth = Math.max(1, w * 0.45 * (0.3 + 1.4 * p)); }
  else if (t === 'pastello') { ctx.lineWidth = w * (0.8 + 0.4 * p); }
  else if (t === 'acquerello') { ctx.strokeStyle = DS.col; ctx.lineWidth = w * 1.6 * (0.6 + 0.6 * p); }
  else if (t === 'gomma') { ctx.strokeStyle = '#000'; ctx.lineWidth = w * 1.4; }
  else { ctx.strokeStyle = DS.col; ctx.lineWidth = w * (0.45 + 1.0 * p); }
  if (t === 'matita' || t === 'pastello') { const key = DS.col + t; if (!DS.pat || DS.patK !== key) { DS.pat = ctx.createPattern(dsGrain(DS.col, t === 'pastello'), 'repeat'); DS.patK = key; } ctx.strokeStyle = DS.pat; }
  if (['linea', 'rett', 'ovale'].includes(t)) { ctx.strokeStyle = DS.col; ctx.fillStyle = DS.col; ctx.lineWidth = w * 0.8; }
}
const DS_BUF = { matita: 0.85, pastello: 0.92, acquerello: 0.35, pennarello: 1, linea: 1, rett: 1, ovale: 1 };
function dsStrokeStart(c) {
  const t = DS.tool, T = DS.tmp, x = T.getContext('2d'); x.clearRect(0, 0, T.width, T.height);
  T.style.opacity = DS_BUF[t] != null ? DS_BUF[t] : 1; T.style.mixBlendMode = t === 'acquerello' ? 'multiply' : 'normal';
  c.buf = DS_BUF[t] != null && t !== 'gomma';
  if (t === 'sfumino') { c.br = Math.max(6, DS.w * DS_S); return; }
  if (!dsShape()) { const ctx = c.buf ? x : c.L.x; ctx.save(); if (t === 'gomma') ctx.globalCompositeOperation = 'destination-out'; dsStyle(ctx, c.last); dsDot(ctx, c.last); ctx.restore(); }
}
function dsDot(ctx, P) { ctx.beginPath(); ctx.moveTo(P.x, P.y); ctx.lineTo(P.x + 0.1, P.y); ctx.stroke(); if (DS.sym) { const m = DS_W * DS_S; ctx.beginPath(); ctx.moveTo(m - P.x, P.y); ctx.lineTo(m - P.x - 0.1, P.y); ctx.stroke(); } }
function dsGrow(c, P, r) { const b = c.box; b[0] = Math.min(b[0], P.x - r); b[1] = Math.min(b[1], P.y - r); b[2] = Math.max(b[2], P.x + r); b[3] = Math.max(b[3], P.y + r); if (DS.sym) { const m = DS_W * DS_S; b[0] = Math.min(b[0], m - P.x - r); b[2] = Math.max(b[2], m - P.x + r); } }
function dsStrokeMove(c, P) {
  const t = DS.tool, r = DS.w * DS_S * 2 + 4;
  dsGrow(c, P, r);
  if (t === 'sfumino') { dsSmudge(c, c.last, P); c.last = P; return; }
  if (dsShape()) { c.end = P; dsShapeDraw(c, DS.tmp.getContext('2d'), true); return; }
  const ctx = c.buf ? DS.tmp.getContext('2d') : c.L.x; ctx.save(); if (t === 'gomma') ctx.globalCompositeOperation = 'destination-out'; dsStyle(ctx, P);
  const a = c.last, mx = (a.x + P.x) / 2, my = (a.y + P.y) / 2;
  ctx.beginPath(); ctx.moveTo(c.mid ? c.mid.x : a.x, c.mid ? c.mid.y : a.y); ctx.quadraticCurveTo(a.x, a.y, mx, my); ctx.stroke();
  if (DS.sym) { const m = DS_W * DS_S; ctx.beginPath(); ctx.moveTo(m - (c.mid ? c.mid.x : a.x), c.mid ? c.mid.y : a.y); ctx.quadraticCurveTo(m - a.x, a.y, m - mx, my); ctx.stroke(); }
  ctx.restore(); c.mid = { x: mx, y: my }; c.last = P; c.pts.push(P);
}
function dsShapeDraw(c, ctx, preview) {
  const T = DS.tmp; if (preview) ctx.clearRect(0, 0, T.width, T.height);
  const a = c.pts[0], b = c.end || a, t = DS.tool; ctx.save(); if (t === 'gomma' && !preview) ctx.globalCompositeOperation = 'destination-out'; dsStyle(ctx, b);
  const one = (ax, bx) => { ctx.beginPath();
    if (t === 'rett') { ctx.rect(Math.min(ax, bx), Math.min(a.y, b.y), Math.abs(bx - ax), Math.abs(b.y - a.y)); }
    else if (t === 'ovale') { ctx.ellipse((ax + bx) / 2, (a.y + b.y) / 2, Math.abs(bx - ax) / 2 || 1, Math.abs(b.y - a.y) / 2 || 1, 0, 0, Math.PI * 2); }
    else { ctx.moveTo(ax, a.y); ctx.lineTo(bx, b.y); }
    if (DS.fill && (t === 'rett' || t === 'ovale')) ctx.fill(); else ctx.stroke(); };
  one(a.x, b.x); if (DS.sym) { const m = DS_W * DS_S; one(m - a.x, m - b.x); }
  ctx.restore();
}
function dsSmudge(c, a, b) {
  const L = c.L, r = c.br, d = Math.hypot(b.x - a.x, b.y - a.y), n = Math.max(1, Math.ceil(d / (r / 3)));
  const B = DS.smB || (DS.smB = document.createElement('canvas')); B.width = B.height = Math.ceil(r * 2); const bx = B.getContext('2d');
  for (let i = 1; i <= n; i++) {
    const px = a.x + (b.x - a.x) * (i - 1) / n, py = a.y + (b.y - a.y) * (i - 1) / n, qx = a.x + (b.x - a.x) * i / n, qy = a.y + (b.y - a.y) * i / n;
    bx.clearRect(0, 0, B.width, B.height); bx.save(); bx.beginPath(); bx.arc(r, r, r, 0, Math.PI * 2); bx.clip(); bx.drawImage(L.c, px - r, py - r, r * 2, r * 2, 0, 0, r * 2, r * 2); bx.restore();
    const g = bx.createRadialGradient(r, r, r * 0.2, r, r, r); g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0)'); bx.globalCompositeOperation = 'destination-in'; bx.fillStyle = g; bx.fillRect(0, 0, B.width, B.height); bx.globalCompositeOperation = 'source-over';
    L.x.save(); L.x.globalAlpha = 0.55; L.x.drawImage(B, qx - r, qy - r); L.x.restore();
  }
}
function dsStrokeEnd(c) {
  const t = DS.tool, T = DS.tmp, L = c.L;
  if (dsShape()) { T.getContext('2d').clearRect(0, 0, T.width, T.height); if (c.end) { if (t === 'gomma') dsShapeDraw(c, L.x, false); else if (c.buf || ['linea', 'rett', 'ovale'].includes(t)) { const X = T.getContext('2d'); dsShapeDraw(c, X, false); dsCommitBuf(L, t); } } }
  else if (c.buf) dsCommitBuf(L, t);
  const b = c.box, pad = DS.w * DS_S * 3 + 6; dsPushUndo(c.before, L, b[0] - pad, b[1] - pad, b[2] - b[0] + pad * 2, b[3] - b[1] + pad * 2);
}
function dsCommitBuf(L, t) { const T = DS.tmp; L.x.save(); L.x.globalAlpha = DS_BUF[t] != null ? DS_BUF[t] : 1; if (t === 'acquerello') L.x.globalCompositeOperation = 'multiply'; L.x.drawImage(T, 0, 0); L.x.restore(); T.getContext('2d').clearRect(0, 0, T.width, T.height); }

/* ---------- 🪣 secchiello: riempie l'area chiusa guardando tutti i livelli visibili ---------- */
function dsFill(L, x0, y0) {
  const W = L.c.width, H = L.c.height, comp = document.createElement('canvas'); comp.width = W; comp.height = H; const cx = comp.getContext('2d');
  cx.fillStyle = '#fff'; cx.fillRect(0, 0, W, H); DS.layers.forEach(Q => { if (Q.vis) { cx.globalAlpha = Q.op; cx.drawImage(Q.c, 0, 0); } }); cx.globalAlpha = 1;
  const src = cx.getImageData(0, 0, W, H).data, sx = Math.floor(x0), sy = Math.floor(y0); if (sx < 0 || sy < 0 || sx >= W || sy >= H) return;
  const i0 = (sy * W + sx) * 4, R = src[i0], G = src[i0 + 1], Bc = src[i0 + 2], tol = 60, mask = new Uint8Array(W * H);
  const same = i => { const k = i * 4; return Math.abs(src[k] - R) + Math.abs(src[k + 1] - G) + Math.abs(src[k + 2] - Bc) <= tol; };
  const stack = [sx, sy]; let minx = sx, maxx = sx, miny = sy, maxy = sy, cnt = 0;
  while (stack.length) {
    let y = stack.pop(), x = stack.pop(), i = y * W + x;
    while (x >= 0 && !mask[i] && same(i)) { x--; i--; } x++; i++;
    let up = false, dn = false;
    while (x < W && !mask[i] && same(i)) {
      mask[i] = 1; cnt++; if (x < minx) minx = x; if (x > maxx) maxx = x; if (y < miny) miny = y; if (y > maxy) maxy = y;
      if (y > 0) { const j = i - W; if (!mask[j] && same(j)) { if (!up) { stack.push(x, y - 1); up = true; } } else up = false; }
      if (y < H - 1) { const j = i + W; if (!mask[j] && same(j)) { if (!dn) { stack.push(x, y + 1); dn = true; } } else dn = false; }
      x++; i++;
    }
  }
  if (!cnt) return;
  const before = dsSnapBefore(L), x1 = Math.max(0, minx - 2), y1 = Math.max(0, miny - 2), w = Math.min(W, maxx + 3) - x1, h = Math.min(H, maxy + 3) - y1;
  const im = L.x.getImageData(x1, y1, w, h), d = im.data, hx = DS.col.replace('#', ''), r = parseInt(hx.slice(0, 2), 16), g = parseInt(hx.slice(2, 4), 16), b = parseInt(hx.slice(4, 6), 16);
  for (let yy = 0; yy < h; yy++) for (let xx = 0; xx < w; xx++) {
    const X = x1 + xx, Y = y1 + yy, m = mask[Y * W + X] || (X > 0 && mask[Y * W + X - 1]) || (X < W - 1 && mask[Y * W + X + 1]) || (Y > 0 && mask[(Y - 1) * W + X]) || (Y < H - 1 && mask[(Y + 1) * W + X]);
    if (m) { const k = (yy * w + xx) * 4; d[k] = r; d[k + 1] = g; d[k + 2] = b; d[k + 3] = 255; }
  }
  L.x.putImageData(im, x1, y1); dsPushUndo(before, L, x1, y1, w, h);
  if (cnt > W * H * 0.6) toastV2('Hai colorato quasi tutto il foglio: per colorare una parte, chiudi bene i contorni');
}

/* ---------- 📚 lezione: guida, «Guarda», passi, «Ora da sola» ---------- */
function dsLesson() {
  const box = $('de-lez'); if (!DS.proj) { box.hidden = true; dsGuide(); return; }
  const P = DS.proj, st = P.passi[DS.step];
  box.hidden = false;
  if (DS.solo) {
    box.innerHTML = '<div class="ds-lt"><b>🌟 Ora da sola</b><p>Rifai «' + esc(P.n) + '» senza la guida, come ti viene: guarda il tuo disegno piccolo qui accanto se ti serve. Quando hai finito, mettilo nel museo.</p></div>' + (DS.guided ? '<img class="ds-ref" alt="" src="' + DS.guided + '">' : '') +
      '<div class="ds-lb"><button type="button" class="btn small ghost" id="dl-pr">← Torna alla guida</button><button type="button" class="btn small" id="dl-fin">💾 Nel museo</button></div>';
    $('dl-pr').onclick = () => { DS.solo = false; DS.step = P.passi.length - 1; dsTitle(); dsLesson(); };
    $('dl-fin').onclick = () => dsSaveAsk();
    dsGuide(); return;
  }
  const tool = st.tool || P.tool, col = st.col || P.col;
  DS.tool = tool; DS.col = dsCol(col); dsTools(); dsSide();
  box.innerHTML = '<div class="ds-lt"><b>' + P.ic + ' Passo ' + (DS.step + 1) + ' di ' + P.passi.length + '</b><p>' + esc(st.t) + '</p><small>Strumento: ' + esc((DS_TOOLS.find(x => x[0] === tool) || ['', '', tool])[2]) + ' · colore ' + esc(col.replace('verdechiaro', 'verde chiaro').replace(/^(blu|g)(\d)$/, (m, a, n) => (a === 'g' ? 'grigio ' : 'blu ') + n)) + '</small></div>' +
    '<div class="ds-lb"><button type="button" class="btn small ghost" id="dl-pr"' + (DS.step ? '' : ' disabled') + '>←</button>' + (st.g && st.g.some(g => !['dot', 'txt', 'sun'].includes(g[0])) ? '<button type="button" class="btn small ghost" id="dl-see">▶ Guarda</button>' : '') +
    '<button type="button" class="btn small ghost" id="dl-gd">' + (DS.guide ? '🙈 Guida' : '👁️ Guida') + '</button><button type="button" class="btn small" id="dl-nx">' + (DS.step < P.passi.length - 1 ? 'Fatto →' : 'Ora da sola →') + '</button></div>';
  $('dl-pr').onclick = () => { if (DS.step) { DS.step--; dsTitle(); dsLesson(); } };
  if ($('dl-see')) $('dl-see').onclick = () => dsGuide(true);
  $('dl-gd').onclick = () => { DS.guide = !DS.guide; dsLesson(); };
  $('dl-nx').onclick = () => { if (DS.step < P.passi.length - 1) { DS.step++; dsTitle(); dsLesson(); dsDirty(); } else dsToSolo(); };
  dsGuide();
}
function dsGuideHtml(prims, cls, color) {
  const sw = 'stroke="' + color + '"';
  return prims.map(g => {
    const k = g[0];
    if (k === 'l') return '<line class="' + cls + '" ' + sw + ' x1="' + g[1] + '" y1="' + g[2] + '" x2="' + g[3] + '" y2="' + g[4] + '"/>';
    if (k === 'c') return '<circle class="' + cls + '" ' + sw + ' cx="' + g[1] + '" cy="' + g[2] + '" r="' + g[3] + '"/>';
    if (k === 'e') return '<ellipse class="' + cls + '" ' + sw + ' cx="' + g[1] + '" cy="' + g[2] + '" rx="' + g[3] + '" ry="' + g[4] + '"/>';
    if (k === 'r') return '<rect class="' + cls + '" ' + sw + ' x="' + g[1] + '" y="' + g[2] + '" width="' + g[3] + '" height="' + g[4] + '"/>';
    if (k === 'p') return '<path class="' + cls + '" ' + sw + ' d="' + g[1] + '"/>';
    if (cls !== 'ds-g') return '';
    if (k === 'dot') return '<g class="ds-dot"><circle cx="' + g[1] + '" cy="' + g[2] + '" r="22" fill="' + g[3] + '" stroke="#fff" stroke-width="5"/><text x="' + g[1] + '" y="' + (g[2] + 52) + '" text-anchor="middle">' + esc(g[4] || '') + '</text></g>';
    if (k === 'txt') return '<text class="ds-gt" x="' + g[1] + '" y="' + g[2] + '" text-anchor="middle">' + esc(g[3]) + '</text>';
    if (k === 'sun') return '<g class="ds-sun"><circle cx="' + g[1] + '" cy="' + g[2] + '" r="34" fill="#f6d000"/>' + [0, 45, 90, 135, 180, 225, 270, 315].map(a => { const r = a * Math.PI / 180; return '<line x1="' + (g[1] + Math.cos(r) * 46) + '" y1="' + (g[2] + Math.sin(r) * 46) + '" x2="' + (g[1] + Math.cos(r) * 66) + '" y2="' + (g[2] + Math.sin(r) * 66) + '" stroke="#f6a800" stroke-width="7" stroke-linecap="round"/>'; }).join('') + '<text x="' + g[1] + '" y="' + (g[2] + 104) + '" text-anchor="middle">luce</text></g>';
    return '';
  }).join('');
}
function dsGuide(anim) {
  const G = DS.guideEl; let h = '';
  if (DS.sym) h += '<line x1="600" y1="0" x2="600" y2="900" class="ds-axis"/>';
  if (DS.proj && !DS.solo && DS.guide) {
    const P = DS.proj, prev = P.passi.slice(0, DS.step).flatMap(s => s.g || []);
    h += dsGuideHtml(prev, 'ds-gp', '#9aa7b8') + dsGuideHtml(P.passi[DS.step].g || [], 'ds-g', '#2563eb');
  }
  G.innerHTML = h;
  if (anim) G.querySelectorAll('.ds-g').forEach((e, i) => { try { const len = e.getTotalLength(); e.style.strokeDasharray = len; e.style.strokeDashoffset = len; e.getBoundingClientRect(); e.style.transition = 'stroke-dashoffset 1.1s ease ' + (i * 0.9) + 's'; e.style.strokeDashoffset = 0; setTimeout(() => { e.style.transition = ''; e.style.strokeDasharray = ''; e.style.strokeDashoffset = ''; }, 1200 + i * 900); } catch (x) {} });
}
function dsFlatten(maxW) {
  const W = DS.layers[0] ? DS.layers[0].c.width : DS_W * DS_S, H = DS.layers[0] ? DS.layers[0].c.height : DS_H * DS_S, k = maxW ? Math.min(1, maxW / W) : 1;
  const c = document.createElement('canvas'); c.width = Math.round(W * k); c.height = Math.round(H * k); const x = c.getContext('2d');
  x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); DS.layers.forEach(L => { if (L.vis) { x.globalAlpha = L.op; x.drawImage(L.c, 0, 0, c.width, c.height); } }); x.globalAlpha = 1; return c;
}
async function dsToSolo() {
  const guided = dsFlatten(480).toDataURL('image/jpeg', 0.8);
  openModal('<div style="font-size:46px">🌟</div><div class="big" style="font-size:22px">Bravissima, hai finito la guida!</div><p style="font-weight:700">Adesso lo rifai da sola, su un foglio nuovo. Vuoi mettere nel museo anche questo disegno fatto con la guida?</p><button type="button" class="btn" id="dg-si" data-focus>Sì, mettilo nel museo</button> <button type="button" class="btn ghost" id="dg-no">No, vado avanti</button>', ['#c2410c', '#ffedd5']);
  const go = async keep => { closeModal(); if (keep) await dsStore(DS.proj.n + ' (con la guida)'); DS.guided = guided; DS.solo = true; for (const L of DS.layers) { L.x.clearRect(0, 0, L.c.width, L.c.height); } DS.undo = []; DS.redo = []; DS.tec = new Set(); dsTitle(); dsLesson(); dsDirty(); };
  $('dg-si').onclick = () => go(true); $('dg-no').onclick = () => go(false);
}

/* ---------- 💾 salvare nel museo ---------- */
function dsSaveAsk() {
  const def = DS.proj ? DS.proj.n : (DS.title || ''), s = dsState();
  const sale = [['libera', '🖌️ Sala della fantasia']].concat(DIS_FASI.map(f => [f.id, f.ic + ' ' + f.sala])), defS = DS.o.sala || (DS.proj ? DS.proj.f : 'libera');
  openModal('<div style="font-size:46px">🏛️</div><div class="big" style="font-size:22px">Nel museo</div><label class="ds-fl">Titolo del quadro<input id="dsv-t" maxlength="60" value="' + esc(def) + '"></label><label class="ds-fl">In quale sala<select id="dsv-s">' + sale.map(x => '<option value="' + x[0] + '"' + (x[0] === defS ? ' selected' : '') + '>' + esc(x[1]) + '</option>').join('') + '</select></label>' +
    '<button type="button" class="btn" id="dsv-ok" data-focus>Appendi il quadro</button> <button type="button" class="btn ghost" id="dsv-no">Non ancora</button>', ['#c2410c', '#ffedd5']);
  $('dsv-no').onclick = closeModal;
  $('dsv-ok').onclick = async () => { const t = $('dsv-t').value.trim() || 'Senza titolo', sa = $('dsv-s').value; closeModal(); const before = s.museo.length; await dsStore(t, sa); if (DS.proj && DS.solo) { const s2 = dsState(); s2.done[DS.proj.id] = todayIso(); dsSave(s2); DSDB.del('bozza'); DS.dirty = false; } dsCelebrate(before); };
}
const DS_TEC = { matita: 'matita', pennarello: 'pennarelli', pastello: 'pastelli', acquerello: 'acquerello', sfumino: 'sfumino', secchiello: 'colori pieni', linea: 'righello', rett: 'forme', ovale: 'forme', gomma: '' };
async function dsStore(t, sala) {
  DS.saving = true;
  const s = dsState(), id = DS.o.qid && !/con la guida/.test(t) ? DS.o.qid : 'q' + Date.now().toString(36);
  const big = dsFlatten(), th = dsFlatten(320).toDataURL('image/jpeg', 0.72), blob = await new Promise(r => big.toBlob(r, 'image/jpeg', 0.9));
  await DSDB.put('img-' + id, blob); await DSDB.put('lay-' + id, { layers: await dsLayersData(), act: DS.act, step: DS.step });
  const tec = [...new Set([...DS.tec].map(k => DS_TEC[k]).filter(Boolean))].join(', ');
  const old = s.museo.find(q => q.id === id), q = { id, t, d: todayIso(), sala: sala || (DS.proj ? DS.proj.f : 'libera'), tec, th, pid: DS.proj ? DS.proj.id : '' };
  if (old) Object.assign(old, q, { top: old.top }); else s.museo.push(q);
  dsSave(s); DS.o.qid = id; DS.saving = false; DS.dirty = false;
  if (!DS.proj) DSDB.del('bozza');
  return q;
}
function dsCelebrate(before) {
  const s = dsState(), n = s.museo.length, arr = DS_ARR.find(a => a[0] > before && a[0] <= n), liv = dsLiv(before) !== dsLiv(n) ? dsLiv(n) : '';
  const extra = (liv ? '<p style="font-weight:800">🎉 Ora è «' + esc(liv) + '»!</p>' : '') + (arr ? '<p style="font-weight:800">' + arr[1] + ' Nel museo arriva ' + esc(arr[2]) + '!</p>' : '');
  openModal('<div style="font-size:52px">🖼️</div><div class="big" style="font-size:22px">Quadro appeso!</div><p style="font-weight:700">Il museo ha ' + n + (n === 1 ? ' quadro' : ' quadri') + '.</p>' + extra + '<button type="button" class="btn" id="dc-m" data-focus>Vai al museo</button> <button type="button" class="btn ghost" id="dc-c">Continua a disegnare</button>', ['#c2410c', '#ffedd5']);
  $('dc-m').onclick = () => { closeModal(); dsClose(true); dsView = 'museo'; dsSala = null; go('disegno'); };
  $('dc-c').onclick = closeModal;
}
async function dsClose(force) {
  if (!DS) return;
  if (!force && DS.dirty && !DS.proj) { await dsBozza(); toastV2('Disegno conservato: lo ritrovi in «Tela libera»'); }
  else if (!force && DS.dirty && DS.proj) await dsBozza();
  window.removeEventListener('resize', dsFit);
  const ov = $('ds-ed'); if (ov) ov.remove(); document.body.classList.remove('ds-open');
  if (DS.ric) try { URL.revokeObjectURL(DS.ric); } catch (e) {}
  DS = null; if (current === 'disegno') PAGES.disegno($('p-disegno'));
}
if (!$('p-disegno')) { const s = document.createElement('section'); s.id = 'p-disegno'; s.dataset.page = ''; s.hidden = true; $('main').appendChild(s); }
