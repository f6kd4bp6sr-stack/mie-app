/* ================= IO E IL MIO CORPO: «Come mi vesto» e «Perché mi lavo» =================
   - 👗 L'armadio del meteo: scegli che cosa mettere per il tempo e per quello che farai
   - 🧼 Timer delle mani (40 secondi, i passaggi dell'OMS) e 🪥 timer dei denti (2 minuti, 4 zone)
   I contenuti seguono le schede verificate (data/verifiche/rev6). */
const WARDROBE = [
  { id: 'pioggia', ic: '🌧️', t: 'Piove, 12 °C: vai a scuola a piedi', slots: [
    ['Sopra', [['🧥', 'Felpa e giacca impermeabile', 1, 'La giacca impermeabile non fa passare l’acqua: bagnati si sente più freddo.'], ['👕', 'Solo maglietta', 0, 'Con 12 °C e pioggia una maglietta da sola non basta.'], ['👙', 'Costume', 0, 'Il costume è per la piscina!']]],
    ['Sotto', [['👖', 'Pantaloni lunghi', 1, 'Le gambe coperte restano più calde e asciutte.'], ['🩳', 'Pantaloncini', 0, 'Con il freddo e la pioggia le gambe si bagnano e si raffreddano.'], ['🩱', 'Body da ginnastica', 0, 'Il body è per l’allenamento, non per la strada.']]],
    ['Piedi', [['👢', 'Stivali di gomma', 1, 'Gli stivali tengono i piedi asciutti nelle pozzanghere.'], ['🩴', 'Infradito', 0, 'Piedi bagnati e freddi: meglio scarpe chiuse.'], ['🩰', 'Scarpette da danza', 0, 'Si rovinerebbero e i piedi si bagnerebbero.']]],
    ['In più', [['☂️', 'Ombrello', 1, 'L’ombrello ti ripara dalla pioggia.'], ['🕶️', 'Occhiali da sole', 0, 'Con le nuvole e la pioggia non servono.'], ['🏊', 'Cuffia da piscina', 0, 'La cuffia serve in piscina, non per la pioggia.']]]] },
  { id: 'sole', ic: '☀️', t: 'Sole forte, 30 °C: pomeriggio al parco', slots: [
    ['Sopra', [['👕', 'Maglietta leggera e chiara', 1, 'Col caldo i vestiti chiari e larghi aiutano a stare più fresca.'], ['🧶', 'Maglione di lana', 0, 'Con 30 °C la lana tiene troppo caldo.'], ['🧥', 'Giaccone', 0, 'Il giaccone è per l’inverno.']]],
    ['Sotto', [['🩳', 'Pantaloncini o gonna leggera', 1, 'Leggeri e comodi per il caldo.'], ['👖', 'Pantaloni pesanti', 0, 'Con questo caldo faresti fatica.'], ['🧦', 'Calzamaglia di lana', 0, 'Troppo calda per l’estate.']]],
    ['Piedi', [['👟', 'Scarpe da ginnastica', 1, 'Comode per correre e giocare al parco.'], ['👢', 'Stivali di gomma', 0, 'Senza pioggia i piedi sudano tantissimo.'], ['🥾', 'Scarponi da neve', 0, 'Sono per la neve, non per l’estate.']]],
    ['In più', [['👒', 'Cappello e occhiali da sole', 1, 'Il cappello ripara viso e collo, gli occhiali proteggono gli occhi dai raggi UV. E ricordati la crema!'], ['🧣', 'Sciarpa di lana', 0, 'Col caldo la sciarpa non serve.'], ['🧤', 'Guanti', 0, 'Le mani non hanno freddo a 30 °C.']]]] },
  { id: 'neve', ic: '❄️', t: 'Nevica, −2 °C: gita in montagna', slots: [
    ['Sopra', [['🧥', 'A strati: maglia, pile e giacca', 1, 'Tra uno strato e l’altro resta aria ferma che tiene il caldo.'], ['👕', 'Una maglietta sola', 0, 'Con −2 °C servono più strati.'], ['🩱', 'Costume', 0, 'Il costume in montagna d’inverno? Brrr!']]],
    ['Sotto', [['👖', 'Pantaloni imbottiti', 1, 'Le gambe restano calde e asciutte nella neve.'], ['🩳', 'Pantaloncini', 0, 'Nella neve le gambe gelerebbero.'], ['👗', 'Gonna leggera', 0, 'Troppo leggera per la neve.']]],
    ['Piedi', [['🥾', 'Scarponcini da neve', 1, 'Tengono i piedi caldi e non scivolano.'], ['🩴', 'Infradito', 0, 'Mai sulla neve!'], ['🩰', 'Ballerine', 0, 'Si bagnano subito e scivolano.']]],
    ['In più', [['🧤', 'Berretto e guanti', 1, 'Coprono testa e mani, che sentono molto il freddo.'], ['🕶️', 'Niente, basta la giacca', 0, 'Mani e orecchie restano scoperte al freddo.'], ['🏊', 'Cuffia da piscina', 0, 'Non scalda: serve in piscina.']]]] },
  { id: 'ghiaccio', ic: '⛸️', t: 'Allenamento sulla pista di ghiaccio', slots: [
    ['Sopra', [['🧥', 'Maglia sottile e felpa leggera', 1, 'Strati leggeri: quando ti scaldi puoi togliere la felpa.'], ['🧥', 'Giaccone pesantissimo', 0, 'Ti muoveresti male e suderesti tanto.'], ['👙', 'Costume da mare', 0, 'Sul ghiaccio fa freddo!']]],
    ['Sotto', [['🩱', 'Leggings o pantaloni elastici', 1, 'Comodi per piegare le gambe e saltare.'], ['👖', 'Jeans rigidi', 0, 'I jeans stringono e non lasciano muovere bene le gambe.'], ['🩳', 'Pantaloncini corti', 0, 'Le gambe sentirebbero troppo freddo.']]],
    ['Piedi', [['🧦', 'Calze sottili nei pattini', 1, 'Calze sottili: il piede sente bene la scarpa del pattino.'], ['🧦', 'Tre paia di calzettoni', 0, 'Troppe calze stringono il piede nel pattino.'], ['🩴', 'Infradito', 0, 'Nei pattini servono calze, non ciabatte!']]],
    ['In più', [['🧤', 'Guanti', 1, 'I guanti scaldano e proteggono le mani se cadi.'], ['💍', 'Braccialetti e collane', 0, 'I gioielli possono impigliarsi o farti male.'], ['☂️', 'Ombrello', 0, 'Sulla pista non piove!']]]] },
  { id: 'aerea', ic: '🎪', t: 'Lezione di tessuti aerei', slots: [
    ['Sopra', [['👕', 'Maglietta aderente senza cerniere', 1, 'Niente cerniere o bottoni che si impigliano o rovinano il tessuto.'], ['🧥', 'Felpa con cerniera e cappuccio', 0, 'Cerniere e cappucci si possono impigliare nel tessuto.'], ['👗', 'Vestito largo', 0, 'Si arrotolerebbe nel tessuto.']]],
    ['Sotto', [['🩱', 'Leggings che coprono le gambe', 1, 'Coprono la pelle e la proteggono dallo sfregamento del tessuto.'], ['🩳', 'Pantaloncini cortissimi', 0, 'La pelle scoperta sfrega contro il tessuto.'], ['👖', 'Jeans con borchie', 0, 'Le borchie rovinano il tessuto e non ti lasciano muovere.']]],
    ['Capelli', [['🎀', 'Capelli raccolti', 1, 'Raccolti non si impigliano mentre giri e ti avvolgi.'], ['💇‍♀️', 'Capelli sciolti al vento', 0, 'Sciolti possono impigliarsi nel tessuto.'], ['👑', 'Fermagli appuntiti', 0, 'Possono farti male o rovinare il tessuto.']]],
    ['In più', [['🚫', 'Niente gioielli', 1, 'Anelli e braccialetti si impigliano: meglio toglierli.'], ['💍', 'Anelli e orologio', 0, 'Si impigliano e graffiano il tessuto.'], ['🧴', 'Tanta crema sulle mani', 0, 'Le mani scivolerebbero sul tessuto.']]]] },
  { id: 'piscina', ic: '🏊', t: 'Corso di nuoto in piscina', slots: [
    ['Addosso', [['🩱', 'Costume intero', 1, 'Comodo per nuotare.'], ['👕', 'Maglietta di cotone', 0, 'Il cotone bagnato diventa pesante.'], ['👖', 'Tuta', 0, 'Con la tuta non si nuota!']]],
    ['Testa', [['🏊', 'Cuffia', 1, 'In piscina la cuffia è obbligatoria: tiene i capelli fuori dall’acqua.'], ['🧢', 'Cappellino da sole', 0, 'In acqua serve la cuffia, non il cappellino.'], ['🎀', 'Nastro tra i capelli', 0, 'Non basta: serve la cuffia.']]],
    ['Piedi', [['🩴', 'Ciabatte da piscina', 1, 'Proteggono i piedi da verruche e funghi e non scivolano.'], ['👟', 'Scarpe da ginnastica', 0, 'Le scarpe di fuori portano sporco in piscina.'], ['🦶', 'Piedi nudi ovunque', 0, 'Sul pavimento bagnato si scivola e si prendono verruche.']]],
    ['In più', [['🧖‍♀️', 'Accappatoio e doccia prima', 1, 'La doccia prima pulisce la pelle; l’accappatoio ti asciuga e ti tiene calda.'], ['☂️', 'Ombrello', 0, 'In piscina non serve!'], ['🧣', 'Sciarpa di lana', 0, 'Si bagnerebbe subito.']]]] }
];
const VITA_DAY = () => { const v = store.get('vita', { d: '', g: 0 }); if (v.d !== todayIso()) { v.d = todayIso(); v.g = 0; } return v; };
function vitaGems(n, why) { const v = VITA_DAY(); const can = Math.max(0, Math.min(n, 15 - v.g)); if (can) { Gems.add(can); v.g += can; store.set('vita', v); } return can; }

function openVita() {
  openModal('<div class="big" style="font-size:28px">🧼👗 Io e il mio corpo</div><p class="vd-sub">Scopri il perché delle buone abitudini.</p>' +
    '<div class="v2-grid">' +
    '<button type="button" class="v2-tile" id="vi-arm"><span class="v2-ti">👗</span><b>L’armadio del meteo</b><small>Che cosa metto oggi?</small></button>' +
    '<button type="button" class="v2-tile" id="vi-mani"><span class="v2-ti">🧼</span><b>Timer delle mani</b><small>40 secondi, passo per passo</small></button>' +
    '<button type="button" class="v2-tile" id="vi-denti"><span class="v2-ti">🪥</span><b>Timer dei denti</b><small>2 minuti, 4 zone</small></button>' +
    '<button type="button" class="v2-tile" id="vi-u"><span class="v2-ti">📚</span><b>Le lezioni</b><small>Come mi vesto · Perché mi lavo</small></button>' +
    '</div><div class="row center" style="margin-top:12px"><button type="button" class="btn ghost" id="vi-x" data-focus>Chiudi</button></div>');
  $('modal-box').classList.add('wide');
  $('vi-x').addEventListener('click', closeModal);
  $('vi-arm').addEventListener('click', () => openWardrobe());
  $('vi-mani').addEventListener('click', () => openTimer('mani'));
  $('vi-denti').addEventListener('click', () => openTimer('denti'));
  $('vi-u').addEventListener('click', () => { closeModal(); const ids = typeof unitUnlockedIds === 'function' ? unitUnlockedIds() : new Set(); pathSel = ids.has('lavo') ? 'lavo' : ids.has('vesto') ? 'vesto' : pathSel; store.set('path-sel', pathSel); go('home'); });
}

/* ---------- 👗 l'armadio del meteo ---------- */
function openWardrobe(sc) {
  const done = store.get('armadio', {});
  sc = sc || WARDROBE.find(w => !done[w.id]) || pick(WARDROBE);
  const st = { slot: 0, first: 0, picks: [] };
  const paint = () => {
    if (st.slot >= sc.slots.length) {
      const g = vitaGems(st.first * 2); done[sc.id] = (done[sc.id] || 0) + 1; store.set('armadio', done);
      try { fanfare(); confetti(window.innerWidth / 2, window.innerHeight / 3, 40); } catch (e) {}
      openModal('<div style="font-size:60px">' + sc.ic + '</div><div class="big" style="font-size:24px">Pronta!</div><div class="arm-out">' + st.picks.map(p => '<span>' + p + '</span>').join('') + '</div>' +
        '<p style="font-weight:800">' + st.first + ' scelte giuste al primo colpo' + (g ? ' · +' + g + ' 💎' : '') + '</p>' +
        '<div class="row center" style="gap:8px"><button type="button" class="btn ghost" id="ar-x">Fine</button><button type="button" class="btn" id="ar-n" data-focus style="--bc:var(--v2-green)">Un altro tempo →</button></div>');
      $('ar-x').addEventListener('click', closeModal);
      $('ar-n').addEventListener('click', () => { const o = WARDROBE.filter(w => w.id !== sc.id); openWardrobe(o.find(w => !done[w.id]) || pick(o)); });
      return;
    }
    const [lab, opts] = sc.slots[st.slot], ord = shuffle(opts.map((o, i) => i));
    let tries = 0;
    openModal('<div class="arm-sc"><span class="arm-ic">' + sc.ic + '</span><b>' + esc(sc.t) + '</b></div>' +
      '<div class="arm-prog">' + sc.slots.map((s, i) => '<i class="' + (i < st.slot ? 'ok' : i === st.slot ? 'on' : '') + '">' + esc(s[0]) + '</i>').join('') + '</div>' +
      '<p class="vd-sub">' + esc(lab) + ': che cosa scegli?</p><div class="arm-opts">' + ord.map(i => '<button type="button" class="arm-o" data-i="' + i + '"><span>' + opts[i][0] + '</span><b>' + esc(opts[i][1]) + '</b></button>').join('') + '</div>' +
      '<p class="arm-fb" id="ar-fb" aria-live="polite"></p><div class="row center"><button type="button" class="btn ghost" id="ar-q">Esci</button></div>');
    $('modal-box').classList.add('wide');
    $('ar-q').addEventListener('click', closeModal);
    $('modal-box').querySelectorAll('.arm-o').forEach(b => b.addEventListener('click', () => {
      const o = opts[+b.dataset.i]; tries++;
      if (o[2]) {
        if (tries === 1) st.first++;
        st.picks.push(o[0] + ' ' + o[1]);
        b.classList.add('ok'); $('ar-fb').textContent = '✅ ' + o[3];
        $('modal-box').querySelectorAll('.arm-o').forEach(x => x.disabled = true);
        setTimeout(() => { st.slot++; paint(); }, 1700);
      } else { b.classList.add('no'); b.disabled = true; $('ar-fb').textContent = '🤔 ' + o[3] + ' Prova ancora!'; }
    }));
  };
  paint();
}

/* ---------- 🧼 🪥 timer ---------- */
const TIMERS = {
  mani: { ic: '🧼', t: 'Lavo le mani', sec: 40, fin: 'Mani pulite! Hai lavato per 40 secondi, come consiglia l’OMS.',
    steps: [['💧', 'Bagna le mani e metti il sapone'], ['🤲', 'Strofina palmo contro palmo'], ['✋', 'Il dorso di ogni mano'], ['🖐️', 'Tra le dita, intrecciate'], ['👍', 'I pollici, girando'], ['💅', 'Le punte delle dita sul palmo'], ['🚿', 'Risciacqua bene'], ['🧻', 'Asciuga con il tuo asciugamano']] },
  denti: { ic: '🪥', t: 'Lavo i denti', sec: 120, fin: 'Denti puliti! 2 minuti, tutte le zone. Sputa il dentifricio.',
    steps: [['↗️', 'In alto a destra: fuori, dentro e sopra'], ['↖️', 'In alto a sinistra: fuori, dentro e sopra'], ['↙️', 'In basso a sinistra: fuori, dentro e sopra'], ['↘️', 'In basso a destra: fuori, dentro e sopra']] }
};
let vitaTimer = null;
function openTimer(kind) {
  const T = TIMERS[kind]; clearInterval(vitaTimer);
  openModal('<div class="big" style="font-size:26px">' + T.ic + ' ' + esc(T.t) + '</div>' +
    '<div class="tm-ring" id="tm-ring" style="--p:0"><span id="tm-s">' + T.sec + '</span><small>secondi</small></div>' +
    '<div class="tm-step" id="tm-step" aria-live="polite">' + T.steps[0][0] + ' ' + esc(T.steps[0][1]) + '</div>' +
    '<div class="row center" style="gap:8px;margin-top:10px"><button type="button" class="btn ghost" id="tm-x">Chiudi</button><button type="button" class="btn" id="tm-go" data-focus style="--bc:var(--v2-green)">▶ Via!</button></div>');
  $('tm-x').addEventListener('click', () => { clearInterval(vitaTimer); closeModal(); });
  $('tm-go').addEventListener('click', () => {
    $('tm-go').hidden = true; const t0 = Date.now(), per = T.sec / T.steps.length; let last = -1;
    vitaTimer = setInterval(() => {
      if (!$('tm-ring')) { clearInterval(vitaTimer); return; }
      const el = (Date.now() - t0) / 1000, left = Math.max(0, Math.ceil(T.sec - el)), si = Math.min(T.steps.length - 1, Math.floor(el / per));
      $('tm-s').textContent = left; $('tm-ring').style.setProperty('--p', Math.min(1, el / T.sec));
      if (si !== last) { last = si; $('tm-step').textContent = T.steps[si][0] + ' ' + T.steps[si][1]; try { if (si > 0) tone(660, .12); } catch (e) {} }
      if (el >= T.sec) {
        clearInterval(vitaTimer);
        const k = 'tm-' + kind, d = store.get(k, {}); d[todayIso()] = (d[todayIso()] || 0) + 1; store.set(k, d);
        const g = d[todayIso()] <= 2 ? vitaGems(3) : 0;
        try { fanfare(); } catch (e) {}
        $('tm-step').textContent = '🌟 ' + T.fin + (g ? ' +' + g + ' 💎' : '');
        $('tm-x').textContent = 'Fatto!';
      }
    }, 250);
  });
}
