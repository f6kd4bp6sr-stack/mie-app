/* ================= IL NEGOZIO: si compra con le gemme 💎 =================
   Solo cose nuove: tutto quello che c'era già resta gratis. */
const SHOP = [
  // per la bambina
  { id: 'g-corona', who: 'g', kind: 'acc', v: 'corona', ic: '👑', n: 'Coroncina d’oro', p: 120 },
  { id: 'g-fiori', who: 'g', kind: 'acc', v: 'fiori', ic: '🌸', n: 'Ghirlanda di fiori', p: 60 },
  { id: 'g-fiocco', who: 'g', kind: 'acc', v: 'fiocco', ic: '🎀', n: 'Fiocco rosa', p: 50 },
  { id: 'g-stella', who: 'g', kind: 'acc', v: 'stella', ic: '⭐', n: 'Fermaglio stella', p: 40 },
  { id: 'g-berretto', who: 'g', kind: 'acc', v: 'berretto', ic: '🧢', n: 'Berretto col pon pon', p: 80 },
  { id: 'g-gatto', who: 'g', kind: 'acc', v: 'gatto', ic: '🐱', n: 'Orecchie da gatto', p: 90 },
  { id: 'g-cuffie', who: 'g', kind: 'acc', v: 'cuffie', ic: '🎧', n: 'Cuffie musicali', p: 100 },
  { id: 'g-pat-oro', who: 'g', kind: 'skate', v: '#f2c14e', ic: '⛸️', n: 'Pattini d’oro', p: 150 },
  { id: 'g-pat-rosa', who: 'g', kind: 'skate', v: '#ffb3c7', ic: '⛸️', n: 'Pattini rosa', p: 100 },
  { id: 'g-pat-azz', who: 'g', kind: 'skate', v: '#9fd0ff', ic: '⛸️', n: 'Pattini azzurro ghiaccio', p: 100 },
  // per il drago
  { id: 'd-mago', who: 'd', kind: 'dacc', v: 'mago', ic: '🧙', n: 'Cappello da mago', p: 120 },
  { id: 'd-fiocco', who: 'd', kind: 'dacc', v: 'fiocco', ic: '🎀', n: 'Fiocco', p: 50 },
  { id: 'd-sciarpa', who: 'd', kind: 'dacc', v: 'sciarpa', ic: '🧣', n: 'Sciarpa', p: 80 },
  { id: 'd-occhiali', who: 'd', kind: 'dacc', v: 'occhiali', ic: '🕶️', n: 'Occhiali da sole', p: 90 },
  { id: 'd-cuffie', who: 'd', kind: 'dacc', v: 'cuffie', ic: '🎧', n: 'Cuffie', p: 100 },
  { id: 'd-corona', who: 'd', kind: 'dacc', v: 'corona', ic: '👑', n: 'Corona reale', p: 150 },
  { id: 'dcol-menta', who: 'd', kind: 'dcol', v: 'menta', ic: '🟢', n: 'Colore menta fresca', p: 120 },
  { id: 'dcol-notte', who: 'd', kind: 'dcol', v: 'notte', ic: '🌌', n: 'Colore blu notte', p: 150 },
  { id: 'dcol-oro', who: 'd', kind: 'dcol', v: 'oro', ic: '🌟', n: 'Colore oro del tesoro', p: 200 },
  { id: 'd-pirata', who: 'd', kind: 'dacc', v: 'pirata', ic: '🏴‍☠️', n: 'Cappello da pirata', p: 110 },
  { id: 'd-fiore', who: 'd', kind: 'dacc', v: 'fiore', ic: '🌺', n: 'Fiore all’orecchio', p: 60 },
  { id: 'd-lente', who: 'd', kind: 'dacc', v: 'lente', ic: '🔍', n: 'Lente da detective', p: 0, req: ['tes', 12], rq: 'Trova 12 tesori nascosti' },
  { id: 'g-diadema', who: 'g', kind: 'acc', v: 'diadema', ic: '💎', n: 'Diadema di cristallo', p: 0, req: ['fig', 40], rq: 'Incolla 40 figurine' },
  { id: 'g-pirata', who: 'g', kind: 'acc', v: 'pirata', ic: '🏴‍☠️', n: 'Bandana da pirata', p: 70 },
  { id: 'g-cuori', who: 'g', kind: 'acc', v: 'cuori', ic: '💖', n: 'Occhiali a cuore', p: 90 },
  // temi del percorso
  { id: 't-bosco', who: 't', kind: 'theme', v: 'bosco', ic: '🌲', n: 'Percorso nel bosco', p: 80 },
  { id: 't-mare', who: 't', kind: 'theme', v: 'mare', ic: '🌊', n: 'Percorso in fondo al mare', p: 100 },
  { id: 't-spazio', who: 't', kind: 'theme', v: 'spazio', ic: '🪐', n: 'Percorso nello spazio', p: 150 },
  { id: 't-ghiaccio', who: 't', kind: 'theme', v: 'ghiaccio', ic: '❄️', n: 'Percorso sul ghiaccio', p: 0, req: ['tes', 24], rq: 'Trova tutti i 24 tesori' }
];
function shopReqOk(it) {
  if (!it.req) return true;
  const [k, n] = it.req;
  if (k === 'tes') return typeof tesoriFound === 'function' && tesoriFound() >= n;
  if (k === 'fig') return typeof figOwned === 'function' && figOwned() >= n;
  return false;
}
function shopEquipped(it) {
  const l = getLook();
  if (it.kind === 'acc') return l.acc === it.v;
  if (it.kind === 'skate') return l.skate === it.v;
  if (it.kind === 'dacc') return store.get('dragon-acc', '') === it.v;
  if (it.kind === 'dcol') return D && D.color === it.v;
  if (it.kind === 'theme') return store.get('path-theme', '') === it.v;
  return false;
}
function shopEquip(it, on) {
  if (it.kind === 'acc' || it.kind === 'skate') {
    const l = Object.assign({}, store.get('girl-look', {}));
    if (it.kind === 'acc') l.acc = on ? it.v : '';
    else { l.skate = on ? it.v : ''; if (on) l.feet = 'pattini'; }
    store.set('girl-look', l); Girl.look(getLook());
  } else if (it.kind === 'dacc') store.set('dragon-acc', on ? it.v : '');
  else if (it.kind === 'dcol') { D.color = on ? it.v : 'verde'; store.set('dragon', D); if (typeof notifPaint === 'function') setTimeout(notifPaint, 50); }
  else if (it.kind === 'theme') store.set('path-theme', on ? it.v : '');
  updateBar();
}
let shopTab = 'g', shopRaf = null;
function openShop() {
  const owned = ownedShop(), g = Gems.get().n;
  const items = SHOP.filter(x => x.who === shopTab);
  openModal('<div class="big" style="font-size:28px">🛍️ Il negozio</div>' +
    '<p style="font-weight:700;color:var(--ink-soft)">Hai <b style="color:var(--c6)">💎 ' + g + ' gemme</b>. Si guadagnano nel percorso: di più quando ci pensi con calma! 🧠</p>' +
    (typeof piggyCard === 'function' ? piggyCard() : '') +
    '<div class="row center" style="gap:8px;margin-top:10px"><button type="button" class="chip" data-st="g" aria-pressed="' + (shopTab === 'g') + '">👧 Per te</button><button type="button" class="chip" data-st="d" aria-pressed="' + (shopTab === 'd') + '">🐉 Per il drago</button><button type="button" class="chip" data-st="t" aria-pressed="' + (shopTab === 't') + '">🗺️ Percorsi</button></div>' +
    '<div class="shop-wrap"><div class="shop-prev" id="shop-prev"></div><div class="shop-grid">' + items.map(it => {
      const have = owned.includes(it.id), eq = have && shopEquipped(it), ok = shopReqOk(it), isGoal = Piggy.get().goal === it.id;
      return '<div class="shop-it' + (eq ? ' eq' : '') + (it.req ? ' special' : '') + '"><div class="si-ic">' + it.ic + '</div><div class="si-n">' + esc(it.n) + '</div>' +
        (have ? '<button type="button" class="btn small' + (eq ? ' ghost' : '') + '" data-eq="' + it.id + '">' + (eq ? 'Togli' : 'Usa') + '</button>'
              : it.req ? (ok ? '<button type="button" class="btn small" data-buy="' + it.id + '" style="--bc:var(--c4)">🎁 Ritira</button>' : '<div class="si-req">🔒 ' + esc(it.rq) + '</div>')
              : '<button type="button" class="btn small" data-buy="' + it.id + '"' + (g < it.p ? ' disabled' : '') + ' style="--bc:var(--c6)">💎 ' + it.p + '</button>' +
                '<button type="button" class="si-goal' + (isGoal ? ' on' : '') + '" data-goal="' + it.id + '" title="Obiettivo di risparmio" aria-label="Scegli come obiettivo di risparmio">🎯</button>') + '</div>';
    }).join('') + '</div></div>' +
    '<div class="row center" style="margin-top:12px"><button type="button" class="btn ghost" id="shop-x" data-focus>Chiudi</button></div>', ['var(--c6)', 'var(--c6-soft)']);
  $('modal-box').classList.add('wide');
  const prev = () => {
    const el = $('shop-prev'); if (!el) return;
    if (shopTab === 'd') { el.innerHTML = dragonSVG(Math.max(1, levelOf(D.energy)), D.color); return; }
    if (shopTab === 't') { const th = store.get('path-theme', '') || 'base'; el.innerHTML = '<div class="path theme-' + th + ' mini-path">' + PATH_DECO[th].map(e => '<span>' + e + '</span>').join('') + '</div>'; return; }
    const t0 = performance.now(); cancelAnimationFrame(shopRaf);
    const anim = now => { const e = $('shop-prev'); if (!e || $('modal').hidden || shopTab !== 'g') return; e.innerHTML = Girl.at('wave', now - t0, 'var(--c1)'); shopRaf = requestAnimationFrame(anim); };
    shopRaf = requestAnimationFrame(anim);
  };
  prev();
  $('shop-x').addEventListener('click', () => { cancelAnimationFrame(shopRaf); closeModal(); if (current === 'home') go('home'); });
  $('modal-box').querySelectorAll('[data-st]').forEach(b => b.addEventListener('click', () => { shopTab = b.dataset.st; openShop(); }));
  $('modal-box').querySelectorAll('[data-buy]').forEach(b => b.addEventListener('click', () => {
    const it = SHOP.find(x => x.id === b.dataset.buy); if (!it || !shopReqOk(it) || (it.p && !Gems.spend(it.p))) return;
    const pg = Piggy.get(); if (pg.goal === it.id) { pg.goal = ''; store.set('piggy', pg); }
    const o = ownedShop(); o.push(it.id); store.set('shop-owned', o);
    shopEquip(it, true); fanfare(); cheer(b, 'Tuo! ✨'); setTimeout(openShop, 500);
  }));
  if (typeof piggyBind === 'function') piggyBind(openShop);
  $('modal-box').querySelectorAll('[data-goal]').forEach(b => b.addEventListener('click', () => { const p = Piggy.get(); p.goal = p.goal === b.dataset.goal ? '' : b.dataset.goal; store.set('piggy', p); openShop(); }));
  $('modal-box').querySelectorAll('[data-eq]').forEach(b => b.addEventListener('click', () => {
    const it = SHOP.find(x => x.id === b.dataset.eq); if (!it) return; shopEquip(it, !shopEquipped(it)); openShop();
  }));
}
