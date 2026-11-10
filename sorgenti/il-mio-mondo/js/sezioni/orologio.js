/* ================= 🕐 OROLOGIO: sezione autonoma =================
   Che cos'è · Come si legge (6 passi) · Domande (scritte e a voce) · Gioca con le lancette.
   Riusa il quadrante e i generatori di js/sezioni/clock.js. «L'orologio» non sta più dentro Matematica.
   Risposta a voce: «registra e riascolta» (js/core/mic.js). La voce resta sull'iPad e si cancella da sola:
   è la bambina a dire se aveva detto giusto, dopo aver sentito e letto la risposta. */
(() => { const i = MATH.findIndex(x => x.id === 'ore'); if (i >= 0) MATH.splice(i, 1); })();
if (!$('p-orologio')) { const s = document.createElement('section'); s.id = 'p-orologio'; s.dataset.page = ''; s.hidden = true; $('main').appendChild(s); }
HOME_DO.unshift(['orologio', '🕐', 'Orologio']);

let oroTab = 'cosa';
const oroVoce = () => store.get('oro-voce', true);
const oroDi = t => { if (oroVoce() && Voice.ok) Voice.say(t); };
const oroTxt = h => String(h).replace(/<[^>]+>/g, '');
const oroDig = (h, m) => '<span class="oro-dig">' + pad2(h) + '<i>:</i>' + pad2(m) + '</span>';
/* ora a 24 ore detta a parole: «le diciassette e venti» */
const oro24 = (h, m) => 'le ' + NUM_IT(h) + (m ? ' e ' + NUM_IT(m) : ' in punto');

/* ---------- disegni ---------- */
const ORO_ANTICHI = '<svg viewBox="0 0 300 130" class="oro-svg" role="img" aria-label="Una meridiana con l’ombra e una clessidra con la sabbia">' +
  '<circle cx="40" cy="26" r="15" fill="var(--c3)"/><g stroke="var(--c3)" stroke-width="3" stroke-linecap="round"><path d="M40 3v6M17 26h6M57 26h6M24 10l4 4M56 10l-4 4"/></g>' +
  '<ellipse cx="100" cy="100" rx="78" ry="20" fill="var(--c3-soft)" stroke="var(--ink)" stroke-width="3"/>' +
  '<path d="M100 100 L100 52 L122 100 Z" fill="var(--c5)" stroke="var(--ink)" stroke-width="3" stroke-linejoin="round"/>' +
  '<path d="M100 100 L158 108" stroke="var(--ink)" stroke-width="7" stroke-linecap="round" opacity=".45"/>' +
  '<text x="100" y="128" text-anchor="middle" font-size="13" font-weight="800" fill="var(--ink)">meridiana</text>' +
  '<g transform="translate(235 62)"><path d="M-26 -50h52M-26 50h52" stroke="var(--ink)" stroke-width="6" stroke-linecap="round"/>' +
  '<path d="M-20 -47 C-20 -15 -3 -8 -3 0 C-3 8 -20 15 -20 47 H20 C20 15 3 8 3 0 C3 -8 20 -15 20 -47 Z" fill="var(--surface)" stroke="var(--ink)" stroke-width="3"/>' +
  '<path d="M-13 -28 C-9 -14 -2 -8 0 -3 C2 -8 9 -14 13 -28 Z" fill="var(--c3)"/><path d="M-18 46 C-16 30 -6 26 0 24 C6 26 16 30 18 46 Z" fill="var(--c3)"/>' +
  '<path d="M0 -2v24" stroke="var(--c3)" stroke-width="2.5" stroke-dasharray="3 3"/></g>' +
  '<text x="235" y="128" text-anchor="middle" font-size="13" font-weight="800" fill="var(--ink)">clessidra</text></svg>';
const oroLegenda = '<div class="oro-leg"><span><i style="background:var(--c1)"></i>corta = <b>ore</b></span><span><i style="background:var(--c5)"></i>lunga = <b>minuti</b></span><span><i style="background:var(--c2)"></i>sottile = <b>secondi</b></span></div>';
const oroCatena = '<div class="oro-cat"><b>1 giorno</b><span>= 24 ore</span><b>1 ora</b><span>= 60 minuti</span><b>1 minuto</b><span>= 60 secondi</span></div>';

/* ---------- 📖 Che cos'è: sei schede ---------- */
const ORO_COSA = [
  { t: '⏰ Che cos’è e a che cosa serve', img: () => ORO_ANTICHI,
    d: 'L’<b>orologio</b> è uno strumento che <b>misura il tempo</b>. Ci dice che ora è: così sappiamo quando comincia una cosa, quanto dura e quanto manca.<br>Tanto tempo fa si usava la <b>meridiana</b>: l’ombra di un’asta si sposta mentre il Sole sembra muoversi nel cielo (in realtà è la Terra che gira). Con la <b>clessidra</b> si misurava un tempo breve: finisce quando tutta la sabbia è scesa. Gli orologi <b>meccanici</b>, con le ruote dentate, sono nati nel Medioevo.' },
  { t: '🔍 Le parti dell’orologio', img: () => clockSVG(10, 10, { sec: 35, cls: 'sm' }) + oroLegenda,
    d: 'Il cerchio con i numeri da <b>1 a 12</b> si chiama <b>quadrante</b>. La lancetta <b>corta</b> segna le <b>ore</b>. La lancetta <b>lunga</b> segna i <b>minuti</b>. Su molti orologi c’è una terza lancetta, sottile e veloce: segna i <b>secondi</b>.<br>Intorno al quadrante ci sono <b>60 tacchette</b>: una per ogni minuto.' },
  { t: '🧮 Giorno, ore, minuti, secondi', img: () => oroCatena,
    d: 'Un <b>giorno</b> intero dura <b>24 ore</b>. Un’<b>ora</b> dura <b>60 minuti</b>. Un <b>minuto</b> dura <b>60 secondi</b>.<br>Attenzione: il tempo non si conta a 100! Dopo 59 minuti viene l’ora nuova, e i minuti ripartono da 0.' },
  { t: '🔢 Lancette oppure numeri', img: () => '<div class="oro-due">' + clockSVG(15, 15, { cls: 'sm' }) + '<span>=</span>' + oroDig(15, 15) + '</div>',
    d: 'L’orologio <b>con le lancette</b> si chiama <b>analogico</b>. L’orologio <b>digitale</b> mostra solo numeri: prima dei due punti ci sono le <b>ore</b>, dopo i due punti i <b>minuti</b>.<br><b>15:15</b> si legge «quindici e quindici»: sono le tre e un quarto del pomeriggio.' },
  { t: '🌞🌙 Mattina e pomeriggio: le 24 ore', img: () => '<div class="oro-due"><div>' + clockSVG(3, 0, { cls: 'sm' }) + '</div><div class="oro-col"><b>🌙 di notte</b>' + oroDig(3, 0) + '<b>🌞 di pomeriggio</b>' + oroDig(15, 0) + '</div></div>',
    d: 'In un giorno la lancetta corta fa <b>due giri</b>: 12 ore + 12 ore = 24 ore. Per questo la corta sul 3 e la lunga sul 12 possono voler dire due cose: le 3 di notte oppure le 3 del pomeriggio.<br>Dopo mezzogiorno <b>aggiungi 12</b>: 3 + 12 = <b>15</b>. A metà giornata è <b>mezzogiorno</b> (12:00). A metà della notte è <b>mezzanotte</b> (00:00).' },
  { t: '🍕 Mezza, un quarto, meno un quarto', img: () => clockSVG(3, 15, { slices: true, cls: 'sm' }),
    d: 'Pensa al quadrante come a una pizza tagliata in <b>4 fette</b>. Ogni fetta vale <b>15 minuti</b>: un <b>quarto d’ora</b>.<br>Lunga sul <b>3</b>: «e un quarto» (15 minuti). Lunga sul <b>6</b>: «e mezza» (30 minuti). Lunga sul <b>9</b>: «meno un quarto» (45 minuti: manca un quarto all’ora dopo). Lunga sul <b>12</b>: «in punto».' }
];

/* ---------- 👀 Come si legge: sei passi ---------- */
const ORO_PASSI = [
  { ic: '1️⃣', n: 'Le ore in punto', es: [4, 0],
    sp: 'Guarda prima la lancetta <b>lunga</b>: se è sul <b>12</b>, l’ora è <b>in punto</b>. Poi guarda la <b>corta</b>: il numero che indica è l’ora.' },
  { ic: '2️⃣', n: 'La mezza', es: [4, 30],
    sp: 'Lunga sul <b>6</b>: ha fatto mezzo giro, cioè <b>30 minuti</b>. Si dice «<b>e mezza</b>». La corta è a metà strada tra due numeri: l’ora è il numero che ha <b>già superato</b>.' },
  { ic: '3️⃣', n: 'Un quarto e meno un quarto', es: [4, 45],
    sp: 'Lunga sul <b>3</b>: «<b>e un quarto</b>» (15 minuti). Lunga sul <b>9</b>: sono passati 45 minuti e manca un quarto all’ora dopo, così si dice «<b>meno un quarto</b>» con l’ora che sta per arrivare.' },
  { ic: '4️⃣', n: 'I minuti di 5 in 5', es: [7, 20],
    sp: 'Per la lancetta lunga ogni numero vale <b>5 minuti</b>: usa la <b>tabellina del 5</b>. Lunga sul 4? 4 × 5 = <b>20 minuti</b>. Lunga sull’8? 8 × 5 = <b>40 minuti</b>.' },
  { ic: '5️⃣', n: 'Tutti i minuti', es: [7, 23],
    sp: 'Tra un numero e l’altro ci sono le <b>tacchette</b>: ognuna vale <b>1 minuto</b>. Conta di 5 in 5 fino all’ultimo numero superato, poi aggiungi le tacchette una alla volta.' },
  { ic: '6️⃣', n: 'Le 24 ore e l’orologio digitale', es: [17, 20],
    sp: 'Sull’orologio digitale, dopo mezzogiorno le ore continuano: 13, 14, 15… fino a 23. Per capire che ora è, <b>togli 12</b>: 17 − 12 = <b>5</b>. Al contrario, per scriverla <b>aggiungi 12</b>: 5 + 12 = 17.' }
];

/* ---------- generatori delle domande ---------- */
/* leggere il quadrante: tre risposte, la prima è quella giusta */
function oroLeggi(h, m, mins) {
  const seen = new Set([digital(h, m)]), opts = [[h, m]], cands = [];
  const swapH = m % 5 === 0 ? (m / 5 || 12) : null;
  if (swapH && swapH !== h) cands.push([swapH, (h % 12) * 5]);          // lancette scambiate
  cands.push([h % 12 + 1, m], [(h + 10) % 12 + 1, m], [h, (60 - m) % 60], [h, (m + 30) % 60]);
  for (const x of cands) { const s = digital(x[0], x[1]); if (!seen.has(s)) { seen.add(s); opts.push(x); } if (opts.length === 3) break; }
  const w = clockWords(h, m, false);
  return { vis: clockSVG(h, m, { mins: mins }), q: 'Che ore sono?', o: opts.map(x => tlabel(x[0], x[1])), e: explainRead(h, m),
    say: w.main, scr: '<b>' + esc(w.main) + '</b> · ' + digital(h, m) + (w.alt ? '<small>' + esc(w.alt) + '</small>' : '') };
}
function oroOraPasso(k) {
  const h = rndi(1, 12);
  if (k === 0) return [h, 0];
  if (k === 1) return [h, Math.random() < 0.75 ? 30 : 0];
  if (k === 2) return [h, pick([15, 45, 15, 45, 30])];
  if (k === 3) return [h, pick([5, 10, 20, 25, 35, 40, 50, 55])];
  let m = rndi(1, 59); while (m % 5 === 0) m = rndi(1, 59);
  return [h, m];
}
const oroParte = h => h < 18 ? 'del pomeriggio' : h < 22 ? 'di sera' : 'di notte';
/* passo 6: dal digitale alle parole e ritorno */
function oro24Q() {
  const h = rndi(13, 21), m = pick([0, 5, 10, 15, 20, 25, 30]);   // fino alle 21: «di sera» senza dubbi
  const altri = [h + 2, h + 1, h - 1, h - 2].filter(x => x >= 13 && x <= 21).slice(0, 2);
  const w = x => clockWords(x, m, true).main;
  const e = h + ' − 12 = ' + (h - 12) + ': dopo mezzogiorno si toglie 12. ' + w(h) + '.';
  if (Math.random() < 0.5) return { vis: '<div class="oro-big">' + oroDig(h, m) + '</div>', q: 'Sull’orologio digitale c’è scritto così. Come si dice?', o: [w(h), w(altri[0]), w(altri[1])], e: e,
    say: w(h), scr: '<b>' + esc(w(h)) + '</b> · ' + pad2(h) + ':' + pad2(m) };
  const parole = w(h).replace(/^(Sono|È) /, '');
  return { vis: '', q: 'Come scrive l’orologio digitale «' + parole + '»?', o: [h + ':' + pad2(m), (h - 12) + ':' + pad2(m), (h === 14 ? 16 : h - 2) + ':' + pad2(m)],
    e: (h - 12) + ' + 12 = ' + h + ': dopo mezzogiorno si aggiunge 12. Senza aggiungere 12 sarebbe ' + (h - 12 < 5 ? 'notte' : 'mattina') + '.',
    say: 'Sono ' + oro24(h, m), scr: '<b>' + h + ':' + pad2(m) + '</b> · si legge «' + NUM_IT(h) + (m ? ' e ' + NUM_IT(m) : '') + '»' };
}
const oroDurata = x => x < 60 ? x + ' minuti' : (x % 60 === 0 ? (x === 60 ? '1 ora' : x / 60 + ' ore') : (x < 120 ? '1 ora' : Math.floor(x / 60) + ' ore') + ' e ' + (x % 60) + ' minuti');
const oroDurV = x => oroDurata(x).replace(/^1 ora/, 'un’ora');   // per la voce
const oroHM = t => Math.floor(t / 60) + ':' + pad2(t % 60);
const ORO_COSE = [['La lezione di nuoto', 'f'], ['Il film', 'm'], ['L’allenamento', 'm'], ['La festa', 'f'], ['Il cartone', 'm'], ['La gita in bici', 'f'], ['La lezione di disegno', 'f'], ['Lo spettacolo', 'm']];
/* la giornata: inizio, durata e fine di una cosa da fare (orari a 24 ore, dalle 14 alle 20) */
function oroGiornata(lvl) {
  if (Math.random() < 0.3) { const q = qDay(lvl); return { vis: '', q: q.q, o: q.o, e: q.e, say: oroTxt(q.o[0]), scr: '<b>' + esc(q.o[0]) + '</b>' }; }
  const passo = lvl <= 1 ? 30 : lvl === 2 ? 15 : 5;
  const dur = pick(lvl <= 1 ? [30, 60, 90, 120] : lvl === 2 ? [15, 30, 45, 60, 75, 90] : [20, 25, 35, 40, 50, 65, 80, 100]);
  const ini = 14 * 60 + rndi(0, (4 * 60) / passo) * passo, fin = ini + dur, cosa = pick(ORO_COSE);
  const oreI = Math.floor(dur / 60), minI = dur % 60, tappa = ini + oreI * 60;
  const conto = oroHM(ini) + (oreI ? ' + ' + oroDurata(oreI * 60) + ' = ' + oroHM(tappa) : '') + (minI ? (oreI ? ', poi ' + oroHM(tappa) : '') + ' + ' + minI + ' minuti = ' + oroHM(fin) : '') + '.';
  const k = rndi(0, 2);
  if (k === 0) return { vis: '', q: cosa[0] + ' comincia alle ' + oroHM(ini) + ' e dura ' + oroDurata(dur) + '. A che ora finisce?',
    o: [oroHM(fin), oroHM(fin + (dur >= 60 ? -30 : 30)), oroHM(fin + 60)], e: conto,
    say: 'Finisce alle ' + NUM_IT(Math.floor(fin / 60)) + (fin % 60 ? ' e ' + NUM_IT(fin % 60) : ' in punto'), scr: '<b>' + oroHM(fin) + '</b>' };
  const sbagli = [dur + 30, dur > 30 ? dur - 15 : dur + 15].map(oroDurata);
  if (k === 1) return { vis: '', q: cosa[0] + ' comincia alle ' + oroHM(ini) + ' e finisce alle ' + oroHM(fin) + '. Quanto dura?',
    o: [oroDurata(dur), sbagli[0], sbagli[1]], e: 'Parti dall’inizio e arriva alla fine: ' + conto, say: 'Dura ' + oroDurV(dur), scr: '<b>' + oroDurata(dur) + '</b>' };
  return { vis: '<div class="oro-big">' + oroDig(Math.floor(ini / 60), ini % 60) + '</div>', q: 'Adesso l’orologio segna quest’ora. ' + cosa[0] + ' comincia alle ' + oroHM(fin) + '. Quanto manca?',
    o: [oroDurata(dur), sbagli[0], sbagli[1]], e: 'Conta in avanti da adesso fino all’inizio: ' + conto, say: (dur >= 60 && dur < 120 ? 'Manca ' : 'Mancano ') + oroDurV(dur), scr: '<b>' + oroDurata(dur) + '</b>' };
}
function oroDurQ(lvl) { const q = qDur(lvl); return { vis: q.svg, q: q.q, o: q.o, e: q.e, say: (/^1 ora/.test(q.o[0]) ? 'È passata ' : 'Sono passati ') + q.o[0].replace(/^1 ora/, 'un’ora'), scr: '<b>' + esc(q.o[0]) + '</b>' }; }

/* ---------- pagina ---------- */
PAGES.orologio = el => {
  Mic.clear();
  const tabs = [['cosa', '📖 Che cos’è'], ['leggi', '👀 Come si legge'], ['domande', '❓ Domande'], ['gioca', '🤹 Gioca con le lancette'], ['esame', '🎓 Interrogazione']];
  el.innerHTML = '<div class="oro-top"><div><h1 class="v2-h1">🕐 Orologio</h1><p class="v2-sub">Che cos’è, come si legge e tante domande: rispondi scrivendo oppure a voce.</p></div>' +
    '<button type="button" class="cu-chip" id="oro-voce" aria-pressed="' + oroVoce() + '">🔊 Legge ad alta voce</button></div>' +
    '<div class="oro-tabs">' + tabs.map(t => '<button type="button" class="cu-chip" data-ot="' + t[0] + '" aria-pressed="' + (t[0] === oroTab) + '">' + t[1] + '</button>').join('') + '</div><div id="oro-body"></div>';
  $('oro-voce').addEventListener('click', e => { const v = !oroVoce(); store.set('oro-voce', v); e.currentTarget.setAttribute('aria-pressed', v); if (!v) { try { speechSynthesis.cancel(); } catch (x) {} } else Voice.say('Adesso leggo io ad alta voce.'); });
  el.querySelectorAll('[data-ot]').forEach(b => b.addEventListener('click', () => { oroTab = b.dataset.ot; try { speechSynthesis.cancel(); } catch (x) {} PAGES.orologio(el); }));
  ({ cosa: oroCosa, leggi: oroLeggiTab, domande: oroDomande, gioca: oroGioca, esame: oroEsame })[oroTab]($('oro-body'));
};

function oroCosa(box) {
  box.innerHTML = '<div class="oro-grid">' + ORO_COSA.map((c, i) => '<details class="card oro-c"' + (i === 0 ? ' open' : '') + '><summary><b>' + esc(c.t) + '</b><span aria-hidden="true">▾</span></summary>' +
    '<div class="oro-img">' + c.img() + '</div><p>' + c.d + '</p>' + sayBtn(oroTxt(c.t.replace(/^\S+\s/, '') + '. ' + c.d.replace(/<br>/g, ' '))) + '</details>').join('') + '</div>' +
    '<div class="row center" style="margin-top:14px"><button type="button" class="btn" id="oro-vai" style="--bc:var(--c5)">Ora impara a leggerlo →</button></div>';
  $('oro-vai').addEventListener('click', () => { oroTab = 'leggi'; PAGES.orologio($('p-orologio')); });
}

function oroLeggiTab(box) {
  const fatti = store.get('oro-passi', {});
  box.innerHTML = '<p class="how">Sei passi, dal più facile al più difficile. Scegli un passo: leggi la spiegazione, guarda l’esempio e poi prova tu.</p>' +
    '<div class="oro-passi">' + ORO_PASSI.map((p, k) => '<button type="button" class="m-row' + (fatti[k] ? ' done' : '') + '" data-p="' + k + '"><span>' + p.ic + ' ' + esc(p.n) + '</span><small></small><b>' + (fatti[k] ? '⭐' : '') + '</b></button>').join('') + '</div><div id="oro-passo"></div>';
  const apri = k => {
    const p = ORO_PASSI[k], h = p.es[0], m = p.es[1], st = $('oro-passo');
    box.querySelectorAll('[data-p]').forEach(b => b.classList.toggle('cur', +b.dataset.p === k));
    const es = k === 5 ? '<div class="oro-due">' + oroDig(h, m) + '<span>=</span>' + clockSVG(h, m, { mins: true, cls: 'sm' }) + '</div><div class="ck-say"><b>' + esc(clockWords(h, m, true).main) + '</b></div><p class="oro-es">17 − 12 = 5: sono le cinque. Dopo i due punti ci sono i minuti: 20.</p>'
      : clockSVG(h, m, { mins: k >= 3, slices: k === 2, cls: 'big' }) + '<div class="ck-say"><b>' + esc(clockWords(h, m, false).main) + '</b><div class="ck-dig">' + digital(h, m) + '</div></div><p class="oro-es">' + esc(explainRead(h, m)) + '</p>';
    st.innerHTML = '<div class="panel" style="--gc:var(--c5);--gs:var(--c5-soft)"><div class="row between"><h3>' + p.ic + ' ' + esc(p.n) + '</h3>' + sayBtn(oroTxt(p.n + '. ' + p.sp)) + '</div>' +
      '<div class="clk-grid"><div class="card"><div class="cu-l">💡 Come si fa</div><p class="oro-sp">' + p.sp + '</p></div><div class="card"><div class="cu-l">👀 Un esempio</div>' + es + '</div></div>' +
      '<div class="row center oro-modi"><button type="button" class="btn" data-m="s" style="--bc:var(--c5)">✍️ Provo scrivendo</button><button type="button" class="btn" data-m="v" style="--bc:var(--c1)">🎙️ Provo a voce</button></div><div class="m-stage" id="oro-stage"></div></div>';
    st.querySelectorAll('[data-m]').forEach(b => b.addEventListener('click', () => oroGiro({ stage: $('oro-stage'), voce: b.dataset.m === 'v', N: 5, titolo: p.ic + ' ' + p.n,
      gen: () => k === 5 ? oro24Q() : oroLeggi(...oroOraPasso(k), k <= 3),
      fine: (right, N) => { if (right >= N - 1) { const f = store.get('oro-passi', {}); f[k] = 1; store.set('oro-passi', f); const r = box.querySelector('[data-p="' + k + '"]'); if (r) { r.classList.add('done'); r.querySelector('b').textContent = '⭐'; } } } })));
    oroDi(oroTxt(p.sp));
    st.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  box.querySelectorAll('[data-p]').forEach(b => b.addEventListener('click', () => apri(+b.dataset.p)));
}

function oroDomande(box) {
  let voce = store.get('oro-modo', 's') === 'v';
  const lvl = store.get('clock-level', 1);
  const G = [
    { id: 'read', ic: '🕵️', name: 'Che ore sono?', sk: 'Leggi le lancette', c: 'var(--c5)', s: 'var(--c5-soft)' },
    { id: 'set', ic: '🎯', name: 'Metti le lancette', sk: 'Trascina sull’ora giusta', c: 'var(--c1)', s: 'var(--c1-soft)' },
    { id: 'dur', ic: '⏳', name: 'Quanto tempo passa?', sk: 'Dall’inizio alla fine', c: 'var(--c4)', s: 'var(--c4-soft)' },
    { id: 'day', ic: '🗓️', name: 'Nella mia giornata', sk: 'Inizio, durata e fine', c: 'var(--c6)', s: 'var(--c6-soft)' }
  ];
  box.innerHTML = '<p class="how">Livello <b id="oro-lvl">' + lvl + '</b> di 4: sale da solo quando fai quasi tutto giusto. Scegli come rispondere e poi un gioco.</p>' +
    '<div class="oro-modi"><button type="button" class="cu-chip" data-md="s" aria-pressed="' + !voce + '">✍️ Rispondo scrivendo</button><button type="button" class="cu-chip" data-md="v" aria-pressed="' + voce + '">🎙️ Rispondo a voce</button></div>' +
    '<p class="oro-nota" id="oro-nota"></p><div id="oro-giochi"></div><div class="m-stage" id="oro-stage"></div>';
  const nota = () => { $('oro-nota').textContent = voce ? (Mic.canRecord() ? '🎙️ Dici la risposta, la registri e la riascolti. Poi l’app dice e scrive quella giusta e tu le confronti. 🔒 La voce resta su questo iPad e si cancella da sola.' : '🗣️ Qui il microfono non c’è: di’ la risposta ad alta voce, poi tocca «Scopri la risposta».') : '✍️ Tocchi la risposta giusta. Poi l’app la scrive in due modi e la dice ad alta voce.'; };
  nota();
  box.querySelectorAll('[data-md]').forEach(b => b.addEventListener('click', () => { voce = b.dataset.md === 'v'; store.set('oro-modo', voce ? 'v' : 's'); box.querySelectorAll('[data-md]').forEach(x => x.setAttribute('aria-pressed', x === b)); nota(); }));
  renderTiles($('oro-giochi'), G, null, id => {
    const L = store.get('clock-level', 1), g = G.find(x => x.id === id);
    oroGiro({ stage: $('oro-stage'), voce: voce, N: 6, titolo: g.ic + ' ' + g.name + ' · livello ' + L, set: id === 'set', lvl: L,
      gen: () => id === 'read' ? oroLeggi(...randTime(L), L <= 2) : id === 'dur' ? oroDurQ(L) : oroGiornata(L),
      fine: (right, N) => { if (right >= N - 1 && L < 4) { store.set('clock-level', L + 1); const e = $('oro-lvl'); if (e) e.textContent = L + 1; return '🏆 Sei salita al livello ' + (L + 1) + '!'; } } });
  });
}

function oroGioca(box) {
  box.innerHTML = '<div class="panel" style="--gc:var(--c5);--gs:var(--c5-soft)" id="oro-play"></div>';
  mathOre($('oro-play'), {});
  const p = $('oro-play');
  [p.querySelector('.row.between'), p.querySelector('.how'), $('ck-games'), $('ck-stage')].forEach(x => { if (x) x.remove(); });
  p.querySelectorAll('h4').forEach(h => { if (/Giochi/.test(h.textContent)) h.remove(); });
}

/* ---------- 🎓 Interrogazione finale: 10 domande, una per ogni cosa imparata, dalla più facile alla più difficile ---------- */
const ORO_ESAME = [
  ['Le ore in punto', () => oroLeggi(...oroOraPasso(0), false)], ['La mezza', () => oroLeggi(...oroOraPasso(1), false)],
  ['Un quarto e meno un quarto', () => oroLeggi(...oroOraPasso(2), false)], ['I minuti di 5 in 5', () => oroLeggi(...oroOraPasso(3), false)],
  ['Tutti i minuti', () => oroLeggi(...oroOraPasso(4), false)], ['Metti le lancette', null],
  ['Le 24 ore', () => oro24Q()], ['Quanto tempo passa', () => oroDurQ(3)],
  ['Nella giornata', () => { let q = oroGiornata(2); while (!/comincia/.test(q.q)) q = oroGiornata(2); return q; }],
  ['Nella giornata', () => { let q = oroGiornata(3); while (!/comincia/.test(q.q)) q = oroGiornata(3); return q; }]
];
const oroMedaglia = r => r >= 10 ? '🥇' : r >= 8 ? '🥈' : r >= 6 ? '🥉' : '';
function oroEsame(box) {
  let voce = store.get('oro-modo', 's') === 'v';
  const E = store.get('oro-esame', null);
  box.innerHTML = '<div class="panel" style="--gc:var(--c6);--gs:var(--c6-soft)"><h3>🎓 Interrogazione</h3>' +
    '<p class="oro-sp">Mettiti alla prova: <b>10 domande</b>, una per ogni cosa che hai imparato. Qui gli aiuti sono spenti: sull’orologio restano solo i numeri delle ore, da 1 a 12, come su un orologio vero. I numeri piccoli dei minuti (05, 10, 15…) non ci sono: i minuti li conti tu. Alla fine ricevi il risultato e, se va bene, una medaglia.</p>' +
    '<div class="oro-leg oro-med"><span>🥇 10 su 10</span><span>🥈 8 o 9</span><span>🥉 6 o 7</span></div>' +
    '<p class="oro-nota" id="oro-rec">' + (E ? 'Il tuo risultato migliore: <b>' + E.best + ' su 10</b> ' + oroMedaglia(E.best) + ' · ultima volta: ' + E.last + ' su 10 · interrogazioni fatte: ' + E.n : 'Non l’hai ancora fatta: la prima è per allenarsi!') + '</p>' +
    '<div class="oro-modi"><button type="button" class="cu-chip" data-md="s" aria-pressed="' + !voce + '">✍️ Rispondo scrivendo</button><button type="button" class="cu-chip" data-md="v" aria-pressed="' + voce + '">🎙️ Rispondo a voce</button></div>' +
    '<div class="row center"><button type="button" class="btn" id="oro-via" style="--bc:var(--c6)">Comincia l’interrogazione →</button></div><div class="m-stage" id="oro-stage"></div></div>';
  box.querySelectorAll('[data-md]').forEach(b => b.addEventListener('click', () => { voce = b.dataset.md === 'v'; store.set('oro-modo', voce ? 'v' : 's'); box.querySelectorAll('[data-md]').forEach(x => x.setAttribute('aria-pressed', x === b)); }));
  $('oro-via').addEventListener('click', () => oroGiro({ stage: $('oro-stage'), get voce() { return voce; }, N: ORO_ESAME.length, titolo: '🎓 Interrogazione', lvl: 3,
    set: i => !ORO_ESAME[i][1], gen: i => ORO_ESAME[i][1](),
    fine: right => { const e = store.get('oro-esame', { best: 0, n: 0, last: 0 }); e.n++; e.last = right; e.best = Math.max(e.best, right); store.set('oro-esame', e);
      const r = $('oro-rec'); if (r) r.innerHTML = 'Il tuo risultato migliore: <b>' + e.best + ' su 10</b> ' + oroMedaglia(e.best) + ' · ultima volta: ' + e.last + ' su 10 · interrogazioni fatte: ' + e.n;
      const m = oroMedaglia(right);
      return m ? m + (right >= 10 ? ' Perfetto! Sai leggere l’orologio.' : right >= 8 ? ' Bravissima! Ti manca pochissimo.' : ' Brava! Ripassa i passi dove hai sbagliato e riprova.') : '💪 Ripassa «Come si legge» e riprova: ogni volta va meglio.'; } }));
}

/* ---------- un giro di domande: scritte oppure a voce ----------
   o.gen() → { vis, q, o:[giusta, sbagliata, sbagliata], e, say, scr } · o.set: gioco «metti le lancette» */
function oroGiro(o) {
  const stage = o.stage, N = o.N; let i = 0, right = 0;
  const isSet = () => typeof o.set === 'function' ? o.set(i) : o.set;
  Mic.clear();
  stage.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const testa = () => '<div class="quiz"><div class="qn">' + esc(o.titolo) + ' · ' + (i + 1) + ' di ' + N + (o.voce && !isSet() ? ' · 🎙️ a voce' : '') + '</div><div class="progress" style="--gc:var(--c5)"><i style="width:' + (i / N * 100) + '%"></i></div>';
  function finish() {
    Mic.clear();
    const good = right >= N - 1, extra = o.fine ? o.fine(right, N) : '';
    stage.innerHTML = '<div class="quiz" style="text-align:center"><div class="big-q" style="font-size:clamp(28px,5vw,40px)">' + right + ' su ' + N + '!</div>' +
      '<p style="font-weight:800">' + (extra || (good ? '🏆 Bravissima!' : '💪 Ogni giro di lancette ti rende più veloce. Riprova!')) + '</p>' +
      '<div class="row center"><button type="button" class="btn" id="oro-again" style="--bc:var(--c5)">Ancora!</button></div></div>';
    $('oro-again').addEventListener('click', () => oroGiro(o));
    mathFinished('ore', stage, 4 + (good ? 2 : 0));
  }
  function next(ok, q, el) {
    progMark(ok, 'mate');
    if (ok) { right++; ding(); cheer(el); gain(2, el); } else { oops(); cheer(el, pick(TRY), true); gain(1, el); }
    const fb = stage.querySelector('.fb');
    fb.innerHTML = '<div class="explain"><b>' + (ok ? 'Giusto! ' : 'La risposta giusta: ') + '</b><div class="oro-risp">' + q.scr + '</div><div>' + esc(q.e) + '</div>' +
      '<div class="row" style="margin-top:10px">' + sayBtn(q.say + '. ' + q.e) + '<button type="button" class="btn small" data-av style="--bc:var(--c5)">Avanti →</button></div></div>';
    fb.querySelector('[data-av]').addEventListener('click', () => { Mic.clear(); try { speechSynthesis.cancel(); } catch (x) {} i++; show(); });
  }
  function show() {
    if (i >= N) return finish();
    if (isSet()) return showSet();
    const q = o.gen(i);
    stage.innerHTML = testa() + '<div class="qt"><span>' + esc(q.q) + '</span>' + sayBtn(q.q) + '</div>' + (q.vis ? '<div class="clk-q">' + q.vis + '</div>' : '') + '<div class="oro-ans"></div><div class="fb"></div></div>';
    oroDi(q.q);
    const wrap = stage.querySelector('.oro-ans');
    if (o.voce) return aVoce(q, wrap);
    wrap.className = 'opts oro-ans';
    shuffle([0, 1, 2]).forEach(k => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'opt'; b.textContent = q.o[k];
      b.addEventListener('click', () => {
        wrap.querySelectorAll('.opt').forEach(x => { x.disabled = true; if (x.textContent === q.o[0]) x.classList.add('right'); });
        if (k !== 0) b.classList.add('wrong');
        next(k === 0, q, b); oroDi(q.say);
      });
      wrap.appendChild(b);
    });
  }
  /* risposta a voce: registra → l'app dice e scrive quella giusta → riascolta → «avevi detto giusto?» */
  function aVoce(q, wrap) {
    const can = Mic.canRecord(); let st = 'idle';
    const paint = () => {
      wrap.innerHTML = '<div class="dt oro-v">' +
        (st === 'idle' || st === 'nomic' ? '<div class="dt-h">🎙️ <b>Dillo tu!</b> <span>' + (can && st !== 'nomic' ? 'Tocca «Registra», di’ la risposta e poi tocca «Fine».' : 'Di’ la risposta ad alta voce, poi tocca «Scopri la risposta».') + '</span></div>' +
          '<div class="dt-row">' + (can && st !== 'nomic' ? '<button type="button" class="btn small dt-rec" data-v="rec">🎙️ Registra</button>' : '') + '<button type="button" class="btn small ghost" data-v="scopri">👀 Scopri la risposta</button></div>' : '') +
        (st === 'rec' ? '<div class="dt-live">🔴 Sto ascoltando… di’ la risposta, poi tocca Fine</div><div class="dt-row"><button type="button" class="btn small dt-rec on" data-v="stop">⏹️ Fine</button></div>' : '') +
        (st === 'have' ? '<div class="dt-h">✅ <b>La risposta giusta</b></div><div class="oro-risp">' + q.scr + '</div>' +
          '<div class="dt-row"><button type="button" class="btn small ghost" data-v="giusta">🔊 Risposta giusta</button>' + (Mic.blobUrl() ? '<button type="button" class="btn small" data-v="io">▶️ La mia voce</button>' : '') + '</div>' +
          '<div class="dt-ask">Avevi detto giusto? <button type="button" class="btn small" data-v="si">👍 Sì</button><button type="button" class="btn small ghost" data-v="no">🤔 Non ancora</button></div>' : '') +
        (st === 'nomic' ? '<div class="dt-note">Il microfono non è disponibile adesso.</div>' : '') +
        (can && st !== 'nomic' ? '<div class="dt-priv">🔒 La registrazione resta su questo iPad e si cancella da sola.</div>' : '') + '</div>';
    };
    const rivela = () => { st = 'have'; paint(); if (Voice.ok) Voice.say(q.say); };
    wrap.addEventListener('click', async e => {
      const b = e.target.closest('[data-v]'); if (!b) return; const k = b.dataset.v;
      if (k === 'rec') { try { speechSynthesis.cancel(); } catch (x) {} st = 'rec'; paint(); try { await Mic.start(7000); rivela(); } catch (x) { st = 'nomic'; paint(); } }
      else if (k === 'stop') Mic.stop();
      else if (k === 'scopri') rivela();
      else if (k === 'giusta') Voice.say(q.say);
      else if (k === 'io') { try { speechSynthesis.cancel(); } catch (x) {} Mic.play(); }
      else if (k === 'si' || k === 'no') { wrap.querySelectorAll('.dt-ask .btn').forEach(x => x.disabled = true); next(k === 'si', q, b); }
    });
    paint();
  }
  function showSet() {
    const t = randTime(Math.min(o.lvl || 1, 3)), th = t[0], tm = t[1];
    const w = clockWords(th, tm, false).main.replace(/^(Sono|È) /, '');
    let T = 12 * 60;
    stage.innerHTML = testa() + '<div class="qt"><span>Metti le lancette su: <b>' + esc(w) + '</b> (' + digital(th, tm) + ')</span>' + sayBtn('Metti le lancette su ' + w) + '</div>' +
      '<div class="clk-q" id="oro-set"></div><div class="ck-say" id="oro-set-t"></div>' +
      '<div class="row center ck-btns"><button type="button" class="btn small ghost" data-s="-60">−1 ora</button><button type="button" class="btn small ghost" data-s="-5">−5</button><button type="button" class="btn small ghost" data-s="5">+5</button><button type="button" class="btn small ghost" data-s="60">+1 ora</button></div>' +
      '<div class="row center" style="margin-top:8px"><button type="button" class="btn" id="oro-check" style="--bc:var(--c1)">Controlla ✓</button></div><div class="fb"></div></div>';
    oroDi('Metti le lancette su ' + w);
    const draw = () => { T = ((T % 720) + 720) % 720; const h = Math.floor(T / 60) || 12, mm = T % 60; $('oro-set').innerHTML = clockSVG(h, mm, { mins: (o.lvl || 1) <= 2, cls: 'big drag' }); $('oro-set-t').innerHTML = '<span class="ck-dig">' + digital(h, mm) + '</span>'; };
    draw();
    dragClock($('oro-set'), () => T, v => { T = v; draw(); }, (o.lvl || 1) >= 4 ? 1 : 5);
    stage.querySelectorAll('[data-s]').forEach(b => b.addEventListener('click', () => { T += +b.dataset.s; draw(); tock(); }));
    $('oro-check').addEventListener('click', () => {
      const h = Math.floor(T / 60) || 12, mm = T % 60, ok = h === th && mm === tm;
      $('oro-check').disabled = true; stage.querySelectorAll('[data-s]').forEach(b => b.disabled = true);
      if (!ok) { $('oro-set').innerHTML = clockSVG(th, tm, { mins: true, cls: 'big' }); $('oro-set-t').innerHTML = '<span class="ck-dig">' + digital(th, tm) + '</span>'; }
      const cw = clockWords(th, tm, false);
      next(ok, { e: (ok ? '' : 'Guarda l’orologio: ') + explainRead(th, tm), say: cw.main, scr: '<b>' + esc(cw.main) + '</b> · ' + digital(th, tm) }, $('oro-check'));
      oroDi(cw.main);
    });
  }
  show();
}
