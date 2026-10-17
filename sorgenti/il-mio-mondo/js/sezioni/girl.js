/* ================= LA BAMBINA ANIMATA DELLE PAUSE MOVIMENTO =================
   Manichino snodato (busto, testa, braccia e gambe a due segmenti) disegnato in SVG:
   una bambina di 10 anni con capelli lunghi castani, maglietta e leggings.
   Due viste: di fronte (prof 0) e di profilo, rivolta a sinistra (prof 1).
   Angoli in gradi: 0 = verso il basso, positivo = verso destra dello schermo, 180 = in alto.
   Di profilo «destra dello schermo» = dietro la schiena, «sinistra» = davanti.
   Le braccia sono misurate rispetto al busto, le gambe rispetto al pavimento. */
const Girl = (() => {
  const C = { skin: '#f6c9a6', skinFar: '#e4ae88', skinLine: '#c98d67', hair: '#7a4a2a', hairDark: '#4e2d18', hairLight: '#a26c43',
    leg: '#4b3f72', legFar: '#3a3060', legLine: '#2f2750', shoe: '#ffffff', ink: '#33304a', cheek: '#ff8fa3', lips: '#c94f5f', eye: '#5a3a22' };
  const shade = (hex, k) => { const n = parseInt(hex.slice(1), 16); const c = [n >> 16, (n >> 8) & 255, n & 255].map(v => Math.max(0, Math.min(255, Math.round(k < 1 ? v * k : v + (255 - v) * (k - 1))))); return '#' + c.map(v => v.toString(16).padStart(2, '0')).join(''); };
  let LOOK = { style: 'sciolti', glasses: false, shirt: 'auto', band: true, feet: 'auto' };
  let ON_ICE = false;
  function applyLook(l) {
    LOOK = Object.assign({ style: 'sciolti', glasses: false, shirt: 'auto', band: true, feet: 'auto' }, l || {});
    if (l && l.skin) { C.skin = l.skin; C.skinFar = shade(l.skin, .92); C.skinLine = shade(l.skin, .8); }
    if (l && l.hair) { C.hair = l.hair; C.hairDark = shade(l.hair, .64); C.hairLight = shade(l.hair, 1.28); }
    if (l && l.leg) { C.leg = l.leg; C.legFar = shade(l.leg, .8); C.legLine = shade(l.leg, .65); }
    if (l && l.eye) C.eye = l.eye;
    if (l && l.shoe) C.shoe = l.shoe;
  }
  /* accessori del negozio, disegnati sulla testa (coordinate della testa: centro 0,0, raggio ~21) */
  function headAcc(a) {
    const ink = C.ink;
    if (a === 'corona') return '<path d="M-12 -23 L-9 -36 L-4 -27 L0 -38 L4 -27 L9 -36 L12 -23 Z" fill="#ffd23f" stroke="' + ink + '" stroke-width="1.8" stroke-linejoin="round"/><circle cx="0" cy="-30" r="2" fill="#ff7a9c"/>';
    if (a === 'fiori') return [[-14, -19, '#ff7a9c'], [-5, -25, '#ffd23f'], [5, -25, '#a879ff'], [14, -19, '#5aa9ff']].map(([x, y, c]) => '<circle cx="' + x + '" cy="' + y + '" r="4.5" fill="' + c + '" stroke="' + ink + '" stroke-width="1.2"/><circle cx="' + x + '" cy="' + y + '" r="1.6" fill="#fff6c2"/>').join('');
    if (a === 'fiocco') return '<g transform="translate(13 -21) rotate(20)"><path d="M0 0 L-10 -7 L-10 7 Z M0 0 L10 -7 L10 7 Z" fill="#ff5c8a" stroke="' + ink + '" stroke-width="1.6" stroke-linejoin="round"/><circle r="3" fill="#ff5c8a" stroke="' + ink + '" stroke-width="1.6"/></g>';
    if (a === 'berretto') return '<path d="M-22 -10 Q-22 -34 0 -34 Q22 -34 22 -10 Z" fill="#5aa9ff" stroke="' + ink + '" stroke-width="1.8"/><path d="M-23 -10 L23 -10" stroke="#3d7fd1" stroke-width="5" stroke-linecap="round"/><circle cx="0" cy="-36" r="4" fill="#fff" stroke="' + ink + '" stroke-width="1.4"/>';
    if (a === 'gatto') return '<path d="M-17 -18 L-13 -35 L-4 -24 Z M17 -18 L13 -35 L4 -24 Z" fill="' + C.hair + '" stroke="' + ink + '" stroke-width="1.8" stroke-linejoin="round"/><path d="M-13 -21 L-12 -29 L-8 -24 Z M13 -21 L12 -29 L8 -24 Z" fill="#ffb3c7"/>';
    if (a === 'cuffie') return '<path d="M-22 0 Q-24 -34 0 -34 Q24 -34 22 0" fill="none" stroke="#a879ff" stroke-width="4.5" stroke-linecap="round"/><rect x="-27" y="-6" width="9" height="14" rx="4" fill="#a879ff" stroke="' + ink + '" stroke-width="1.6"/><rect x="18" y="-6" width="9" height="14" rx="4" fill="#a879ff" stroke="' + ink + '" stroke-width="1.6"/>';
    if (a === 'diadema') return '<path d="M-15 -21 Q0 -33 15 -21" fill="none" stroke="#cfd8ff" stroke-width="3"/><path d="M-6 -27 L0 -37 L6 -27 Z" fill="#9fd0ff" stroke="' + ink + '" stroke-width="1.4"/><circle cx="-10" cy="-25" r="2.2" fill="#ff9fd0"/><circle cx="10" cy="-25" r="2.2" fill="#ff9fd0"/>';
    if (a === 'pirata') return '<path d="M-22 -8 Q-20 -30 0 -30 Q20 -30 22 -8 Z" fill="#e53935" stroke="' + ink + '" stroke-width="1.8"/><circle cx="-8" cy="-20" r="2" fill="#fff"/><circle cx="6" cy="-23" r="2" fill="#fff"/><circle cx="12" cy="-15" r="2" fill="#fff"/><path d="M20 -10 l8 6 l-2 -8 z" fill="#e53935" stroke="' + ink + '" stroke-width="1.4"/>';
    if (a === 'cuori') return '<path d="M-10 4 c-6 -7 -12 -1 -6 4 l6 5 l6 -5 c6 -5 0 -11 -6 -4z M10 4 c-6 -7 -12 -1 -6 4 l6 5 l6 -5 c6 -5 0 -11 -6 -4z" fill="#ff5c8a" opacity=".85" stroke="' + ink + '" stroke-width="1.2"/>';
    if (a === 'stella') return '<path d="M14 -30 l2.5 5.5 l6 .6 l-4.5 4 l1.3 6 l-5.3 -3 l-5.3 3 l1.3 -6 l-4.5 -4 l6 -.6 z" fill="#ffd23f" stroke="' + ink + '" stroke-width="1.4" stroke-linejoin="round"/>';
    return '';
  }
  const L = { torso: 58, neck: 8, head: 21, ua: 29, fa: 27, th: 40, sh: 40 };
  const BASE = { px: 100, py: 150, t: 0, h: 0, sx: 1, hair: 0, prof: 0, smile: 1,
    al: [-10, 0, 1, 1], ar: [10, 0, 1, 1], ll: [-5, 0, 1, 1], lr: [5, 0, 1, 1] };
  const P = o => Object.assign({}, BASE, o);
  const S = o => P(Object.assign({ prof: 1, al: [6, 0, 1, 1], ar: [-6, 0, 1, 1], ll: [2, 0, 1, 1], lr: [-2, 0, 1, 1] }, o));
  const dir = d => { const r = d * Math.PI / 180; return [Math.sin(r), Math.cos(r)]; };
  const add = (a, b, k) => [a[0] + b[0] * k, a[1] + b[1] * k];
  const f = n => n.toFixed(1);

  /* Pose chiave. [A, B, ms] = avanti e indietro tra A e B; { f: [...], ms } = ciclo di più pose. */
  const KEY = {
    // Marcia: ginocchio alto (coscia vista di scorcio) e braccio opposto in avanti
    march: [P({ py: 148, ll: [-14, 10, .32, .72], lr: [6, 0, 1, 1], al: [-18, 150, .8, .9], ar: [16, -10, 1, 1] }),
            P({ py: 148, lr: [14, -10, .32, .72], ll: [-6, 0, 1, 1], ar: [18, -150, .8, .9], al: [-16, 10, 1, 1] }), 1100],
    // Scivolata laterale: peso su una gamba piegata, l'altra tesa di lato, braccia che oscillano
    side: [P({ px: 76, py: 160, t: 8, ll: [-18, 34, 1, 1], lr: [42, 0, 1, 1.02], al: [-75, -10, 1, 1], ar: [-25, -45, 1, 1], hair: 10 }),
           P({ px: 124, py: 160, t: -8, lr: [18, -34, 1, 1], ll: [-42, 0, 1, 1.02], ar: [75, 10, 1, 1], al: [25, 45, 1, 1], hair: -10 }), 1800],
    // Spirale (di profilo): busto inclinato in avanti, gamba libera tesa indietro, braccia aperte avanti e dietro
    arabesque: [S({ px: 96, t: 32, h: -26, lr: [-3, 0, 1, 1], ll: [96, 0, 1, 1], ar: [-122, 0, 1, 1], al: [58, 0, 1, 1] }),
                S({ px: 96, t: 36, h: -28, lr: [-3, 0, 1, 1], ll: [101, 0, 1, 1], ar: [-126, 0, 1, 1], al: [54, 0, 1, 1] }), 2600],
    // Fenicottero: pianta del piede appoggiata all'interno dell'altra gamba, mani unite sopra la testa
    tree: [P({ t: -2, ll: [-3, 0, 1, 1], lr: [75, -147, .8, 1.13], al: [-176, -29, 1.05, 1.05], ar: [176, 29, 1.05, 1.05] }),
           P({ t: 2, ll: [-3, 0, 1, 1], lr: [75, -147, .8, 1.13], al: [-176, -29, 1.05, 1.05], ar: [176, 29, 1.05, 1.05] }), 2600],
    // Stella marina: piccolo piegamento, poi salto con braccia e gambe aperte
    jump: [P({ py: 157, ll: [-14, 30, .95, 1], lr: [14, -30, .95, 1], al: [-18, 0, 1, 1], ar: [18, 0, 1, 1] }),
           P({ py: 126, ll: [-26, 0, 1, 1], lr: [26, 0, 1, 1], al: [-142, 0, 1, 1], ar: [142, 0, 1, 1], hair: -6, smile: 1.6 }), 900],
    // Canguro: saltelli a piedi uniti, «zampette» davanti al petto
    hop: [P({ py: 156, ll: [-8, 24, .95, 1], lr: [8, -24, .95, 1], al: [-14, 155, .85, .85], ar: [14, -155, .85, .85] }),
          P({ py: 137, ll: [-4, 0, 1, 1], lr: [4, 0, 1, 1], al: [-14, 155, .85, .85], ar: [14, -155, .85, .85], smile: 1.5, hair: -4 }), 650],
    // Arrampicata: un braccio alla volta verso l'alto, sulle punte
    reach: [P({ py: 145, ar: [176, 0, 1, 1], al: [-40, -75, 1, 1], ll: [-4, 0, 1, 1], lr: [4, 0, 1, 1], h: -6 }),
            P({ py: 145, al: [-176, 0, 1, 1], ar: [40, 75, 1, 1], ll: [-4, 0, 1, 1], lr: [4, 0, 1, 1], h: 6 }), 1800],
    // Allunga al cielo: mani unite in alto, poi piegamento a destra e a sinistra
    stretch: { f: [P({ py: 147, al: [-174, 0, 1, 1], ar: [174, 0, 1, 1] }),
                   P({ py: 147, t: 16, h: 4, al: [-174, 0, 1, 1], ar: [174, 0, 1, 1], hair: 8 }),
                   P({ py: 147, al: [-174, 0, 1, 1], ar: [174, 0, 1, 1] }),
                   P({ py: 147, t: -16, h: -4, al: [-174, 0, 1, 1], ar: [174, 0, 1, 1], hair: -8 })], ms: 4800 },
    // Goccia (di profilo): ci si arrotola in avanti con le ginocchia morbide, braccia a penzoloni
    fold: [S({ px: 104, lr: [-4, 6, 1, 1], ll: [-2, 4, 1, 1], ar: [-4, 0, 1, 1], al: [4, 0, 1, 1] }),
           S({ px: 120, py: 152, t: 108, h: 18, lr: [-14, 24, 1, 1], ll: [-12, 22, 1, 1], ar: [-108, 0, 1, 1], al: [-104, 0, 1, 1] }), 4200],
    // Inchino (di profilo)
    bow: [S({ px: 100 }), S({ px: 104, t: 38, h: 12, ar: [-30, -40, 1, 1], al: [-42, 0, 1, 1] }), 2600],
    // Respiro con le mani sulla pancia: la pancia si gonfia e si sgonfia
    belly: [P({ al: [-15, 85, 1, 1], ar: [15, -85, 1, 1] }), P({ py: 148, h: -5, al: [-19, 85, 1, 1], ar: [19, -85, 1, 1], smile: 1.3 }), 4000],
    // Rana (di profilo): mani al petto → braccia in avanti → apertura e ritorno; gambe piegate e poi distese
    breast: { f: [S({ ar: [38, -150, 1, 1], al: [44, -150, 1, 1], lr: [-14, 26, 1, 1], ll: [-12, 24, 1, 1], py: 154 }),
                  S({ ar: [-96, 0, 1, 1], al: [-92, 0, 1, 1], lr: [-2, 0, 1, 1], ll: [2, 0, 1, 1], h: -8 }),
                  S({ ar: [-40, -10, 1, 1], al: [-34, -10, 1, 1], lr: [-2, 0, 1, 1], ll: [2, 0, 1, 1] })], ms: 2100 },
    wave: [P({ ar: [150, 20, 1, 1] }), P({ ar: [150, -30, 1, 1], smile: 1.5 }), 700]
  };
  const ease = x => 0.5 - 0.5 * Math.cos(Math.PI * x);
  function lerp(a, b, k) {
    const o = {};
    for (const key in a) {
      if (Array.isArray(a[key])) o[key] = a[key].map((v, i) => v + (b[key][i] - v) * k);
      else o[key] = a[key] + (b[key] - a[key]) * k;
    }
    return o;
  }
  function poseAt(type, ms) {
    if (type === 'spin') { // trottola: gira su se stessa, a metà giro si vede la schiena
      const ph = (ms % 2600) / 2600, s = Math.cos(ph * Math.PI * 2);
      return P({ py: 146, sx: Math.abs(s) < .3 ? (s < 0 ? -.3 : .3) : s, al: [-166, -12, 1, 1], ar: [166, 12, 1, 1], ll: [-3, 0, 1, 1], lr: [3, 0, 1, 1], hair: Math.sin(ph * Math.PI * 2) * 16 });
    }
    if (type === 'crawl' || type === 'back') { // stile libero (avanti) e dorso (indietro), di profilo, braccia alternate
      const ph = (ms % 1500) / 1500, a = (type === 'crawl' ? 1 : -1) * ph * 360;
      return S({ ar: [a, 0, 1, 1], al: [a + 180, 0, 1, 1], h: type === 'back' ? -16 : 0, hair: Math.sin(ph * Math.PI * 2) * 4 });
    }
    if (type === 'fly') { // delfino: braccia insieme e corpo che ondeggia
      const ph = (ms % 1600) / 1600, a = ph * 360, w = Math.sin(ph * Math.PI * 2);
      return S({ ar: [a, 0, 1, 1], al: [a + 6, 0, 1, 1], t: w * 7, h: -w * 6, py: 152 + w * 3,
        lr: [-8 - w * 6, 14 + w * 12, 1, 1], ll: [-6 - w * 6, 12 + w * 12, 1, 1], hair: w * 5 });
    }
    if (type === 'shake') {
      const k = ms / 90;
      return P({ t: Math.sin(k) * 4, py: 150 + Math.sin(k * 1.7) * 2, al: [-20 + Math.sin(k * 2.1) * 18, Math.sin(k * 2.9) * 30, 1, 1], ar: [20 + Math.sin(k * 2.3) * 18, Math.sin(k * 3.1) * 30, 1, 1],
        ll: [-6 + Math.sin(k * 1.3) * 5, 0, 1, 1], lr: [6 + Math.sin(k * 1.5) * 5, 0, 1, 1], hair: Math.sin(k * 2) * 10 });
    }
    const K = KEY[type] || KEY.belly;
    if (K.f) {
      const n = K.f.length, x = (ms % K.ms) / K.ms * n, i = Math.floor(x);
      return lerp(K.f[i], K.f[(i + 1) % n], ease(x - i));
    }
    const ph = (ms % K[2]) / K[2];
    return lerp(K[0], K[1], ph < .5 ? ease(ph * 2) : ease((1 - ph) * 2));
  }

  function draw(p, shirt) {
    const prof = p.prof > .5;
    if (LOOK.shirt && LOOK.shirt !== 'auto') shirt = LOOK.shirt;
    const pel = [p.px, p.py];
    const up = dir(p.t + 180), perp = [-up[1], up[0]];
    const sc = add(pel, up, L.torso);
    const sw = prof ? 3 : 18, hw = prof ? 3 : 10;
    const shL = add(sc, perp, -sw), shR = add(sc, perp, sw);
    const hipL = add(pel, perp, -hw), hipR = add(pel, perp, hw);
    const neckTop = add(sc, up, L.neck);
    const hc = add(neckTop, dir(p.t + p.h + 180), L.head * .92);
    const limb = (start, ang, lens, rel) => {
      const j = add(start, dir(ang[0] + rel), lens[0] * ang[2]);
      const e = add(j, dir(ang[0] + ang[1] + rel), lens[1] * ang[3]);
      return [start, j, e];
    };
    const armL = limb(shL, p.al, [L.ua, L.fa], p.t), armR = limb(shR, p.ar, [L.ua, L.fa], p.t);
    const legL = limb(hipL, p.ll, [L.th, L.sh], 0), legR = limb(hipR, p.lr, [L.th, L.sh], 0);
    const front = p.sx > 0;
    const swg = p.hair;
    const pathOf = pts => 'M' + pts.map(q => f(q[0]) + ' ' + f(q[1])).join(' L');
    const hx = hc[0], hy = hc[1];
    const rot = p.t + p.h;

    const leg = (l, far) => '<path d="' + pathOf(l) + '" fill="none" stroke="' + C.legLine + '" stroke-width="17" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="' + pathOf(l) + '" fill="none" stroke="' + (far ? C.legFar : C.leg) + '" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>';
    const shoe = (l, side) => {
      const fx = l[2][0] + side * 4, fy = l[2][1] + 3;
      if (LOOK.feet === 'pattini' || (LOOK.feet === 'auto' && ON_ICE)) {
        const dx = l[2][0] - l[1][0], dy = l[2][1] - l[1][1], dl = Math.hypot(dx, dy) || 1, ux = dx / dl, uy = dy / dl;
        const tx = l[2][0] - ux * 14, ty = l[2][1] - uy * 14;
        const W = LOOK.skate || '#ffffff', st = C.ink;
        const boot = '<path d="M' + f(tx) + ' ' + f(ty) + ' L' + f(l[2][0]) + ' ' + f(l[2][1]) + '" stroke="' + st + '" stroke-width="17" stroke-linecap="round"/>' +
          '<path d="M' + f(tx) + ' ' + f(ty) + ' L' + f(l[2][0]) + ' ' + f(l[2][1]) + '" stroke="' + W + '" stroke-width="12.5" stroke-linecap="round"/>' +
          '<ellipse cx="' + f(fx) + '" cy="' + f(fy) + '" rx="10.5" ry="6.5" fill="' + W + '" stroke="' + st + '" stroke-width="2.5"/>' +
          '<path d="M' + f(tx - 3) + ' ' + f(ty + 3) + ' l6 0 M' + f(tx - 3) + ' ' + f(ty + 7) + ' l6 0" stroke="#c9c4d6" stroke-width="1.6" stroke-linecap="round"/>';
        const by = fy + 10;
        const blade = prof
          ? '<path d="M' + f(fx - 6) + ' ' + f(fy + 5) + ' L' + f(fx - 6) + ' ' + f(by) + ' M' + f(fx + 6) + ' ' + f(fy + 5) + ' L' + f(fx + 6) + ' ' + f(by) + '" stroke="#8e97a6" stroke-width="2.2"/>' +
            '<path d="M' + f(fx - 15) + ' ' + f(by - 2) + ' Q' + f(fx - 14) + ' ' + f(by + 1) + ' ' + f(fx - 10) + ' ' + f(by + 1) + ' L' + f(fx + 12) + ' ' + f(by + 1) + '" fill="none" stroke="#b8c0cc" stroke-width="3" stroke-linecap="round"/>' +
            '<path d="M' + f(fx - 15) + ' ' + f(by - 2) + ' l-2 2 l2 1" fill="none" stroke="#8e97a6" stroke-width="1.6"/>'
          : '<path d="M' + f(fx) + ' ' + f(fy + 4) + ' L' + f(fx) + ' ' + f(by + 3) + '" stroke="#7d8696" stroke-width="4" stroke-linecap="round"/><path d="M' + f(fx - 3) + ' ' + f(by + 3) + ' L' + f(fx + 3) + ' ' + f(by + 3) + '" stroke="#7d8696" stroke-width="2.5" stroke-linecap="round"/>';
        return blade + boot;
      }
      return '<ellipse cx="' + f(fx) + '" cy="' + f(fy) + '" rx="10" ry="6" fill="' + C.shoe + '" stroke="' + C.ink + '" stroke-width="2.5"/>' +
        '<path d="M' + f(fx - 6) + ' ' + f(fy + 3) + ' h12" stroke="var(--mvc, #5aa9ff)" stroke-width="2.5" stroke-linecap="round"/>';
    };
    const arm = (a, far) => '<path d="' + pathOf(a) + '" fill="none" stroke="' + C.skinLine + '" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="' + pathOf(a) + '" fill="none" stroke="' + (far ? C.skinFar : C.skin) + '" stroke-width="9.5" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<circle cx="' + f(a[2][0]) + '" cy="' + f(a[2][1]) + '" r="6" fill="' + (far ? C.skinFar : C.skin) + '" stroke="' + C.skinLine + '" stroke-width="2"/>' +
      '<path d="M' + f(a[0][0]) + ' ' + f(a[0][1]) + ' L' + f(a[0][0] + (a[1][0] - a[0][0]) * .38) + ' ' + f(a[0][1] + (a[1][1] - a[0][1]) * .38) + '" style="stroke:' + shirt + '" stroke-width="15" stroke-linecap="round"' + (far ? ' opacity=".8"' : '') + '/>';
    const tw = prof ? 12 : 0;
    const torso = '<path d="M' + f(sc[0] + perp[0] * -(sw + tw)) + ' ' + f(sc[1] + perp[1] * -(sw + tw)) + ' L' + f(sc[0] + perp[0] * (sw + tw)) + ' ' + f(sc[1] + perp[1] * (sw + tw)) +
      ' L' + f(pel[0] + perp[0] * (hw + 6 + tw * .7)) + ' ' + f(pel[1] + perp[1] * (hw + 6 + tw * .7)) + ' L' + f(pel[0] - perp[0] * (hw + 6 + tw * .7)) + ' ' + f(pel[1] - perp[1] * (hw + 6 + tw * .7)) +
      ' Z" style="fill:' + shirt + '" stroke="' + C.ink + '" stroke-width="2.5" stroke-linejoin="round"/>' +
      '<path d="M' + f(pel[0] - perp[0] * (hw + 6 + tw * .7)) + ' ' + f(pel[1] - perp[1] * (hw + 6 + tw * .7)) + ' L' + f(pel[0] + perp[0] * (hw + 6 + tw * .7)) + ' ' + f(pel[1] + perp[1] * (hw + 6 + tw * .7)) + '" stroke="' + C.leg + '" stroke-width="7" stroke-linecap="round"/>' +
      (!prof && front ? '<path d="M' + f(sc[0] - up[0] * 22 - 5) + ' ' + f(sc[1] - up[1] * 22) + ' l5 -8 l5 8 l-5 -3 z" fill="#fff" opacity=".85"/>' : '');
    const neck = '<path d="M' + f(sc[0]) + ' ' + f(sc[1]) + ' L' + f(neckTop[0]) + ' ' + f(neckTop[1]) + '" stroke="' + C.skin + '" stroke-width="10" stroke-linecap="round"/>';
    const sm = p.smile;
    const band = (LOOK.band ? '<path d="M-19 -13 Q0 -30 19 -13" fill="none" style="stroke:' + shirt + '" stroke-width="4" stroke-linecap="round"/>' : '') + headAcc(LOOK.acc);
    const st = LOOK.style;
    const braid = (x0, y0, x1, y1, n) => { let o = ''; for (let i = 0; i < n; i++) { const t = i / (n - 1), x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t; o += '<ellipse cx="' + f(x) + '" cy="' + f(y) + '" rx="' + f(6 - t * 1.5) + '" ry="6" fill="' + C.hair + '" stroke="' + C.hairDark + '" stroke-width="1.8"/>'; } return o + '<circle cx="' + f(x1) + '" cy="' + f(y1 + 6) + '" r="3" style="fill:' + shirt + '"/>'; };
    let frontHair = '', bun = '';
    if (st === 'chignon') bun = (prof ? '<circle cx="12" cy="-18" r="11"' : '<circle cx="0" cy="-24" r="11"') + ' fill="' + C.hair + '" stroke="' + C.hairDark + '" stroke-width="2"/>';

    let backHair, face;
    if (prof) {
      // Di profilo i capelli scendono verso il pavimento dalla nuca (anche quando si piega in avanti)
      const k = dir(rot + 180), pp = [-k[1], k[0]];
      const at = (x, y) => [hx + pp[0] * x + k[0] * -y, hy + pp[1] * x + k[1] * -y];
      const a1 = at(16, -14), a2 = at(22, 6), a3 = at(10, 18);
      const g1 = [a2[0] + 4 + swg, a2[1] + 58], g2 = [a3[0] - 4 + swg, a3[1] + 52];
      if (st === 'caschetto') { g1[1] -= 32; g2[1] -= 30; }
      if (st === 'coda') backHair = '<path d="M' + f(a1[0]) + ' ' + f(a1[1]) + ' Q' + f(a1[0] + 12) + ' ' + f(a1[1] + 10) + ' ' + f(a1[0] + 6 + swg) + ' ' + f(a1[1] + 48) + ' L' + f(a1[0] - 1 + swg) + ' ' + f(a1[1] + 46) + ' Q' + f(a1[0] + 3) + ' ' + f(a1[1] + 14) + ' ' + f(a1[0] - 4) + ' ' + f(a1[1] + 2) + ' Z" fill="' + C.hair + '" stroke="' + C.hairDark + '" stroke-width="2.2" stroke-linejoin="round"/><circle cx="' + f(a1[0] + 1) + '" cy="' + f(a1[1] + 3) + '" r="3.5" style="fill:' + shirt + '"/>';
      else if (st === 'treccia') backHair = braid(a2[0], a2[1], a2[0] + 2 + swg, a2[1] + 50, 7);
      else if (st === 'chignon') backHair = '';
      else backHair = '<path d="M' + f(a1[0]) + ' ' + f(a1[1]) + ' Q' + f(a2[0] + 10) + ' ' + f(a2[1]) + ' ' + f(g1[0]) + ' ' + f(g1[1]) + ' L' + f(g2[0]) + ' ' + f(g2[1]) +
        ' Q' + f(a3[0]) + ' ' + f(a3[1] + 20) + ' ' + f(a3[0]) + ' ' + f(a3[1]) + ' Z" fill="' + C.hair + '" stroke="' + C.hairDark + '" stroke-width="2.5" stroke-linejoin="round"/>' +
        '<path d="M' + f(a2[0]) + ' ' + f(a2[1] + 8) + ' Q' + f(a2[0] + 4) + ' ' + f(a2[1] + 30) + ' ' + f(g1[0] - 4) + ' ' + f(g1[1] - 4) + '" fill="none" stroke="' + C.hairLight + '" stroke-width="2.5" stroke-linecap="round" opacity=".7"/>';
      face = '<ellipse cx="-10" cy="1" rx="2.8" ry="3.6" fill="' + C.eye + '"/><circle cx="-10.4" cy="1.3" r="1.5" fill="' + C.ink + '"/><circle cx="-9.2" cy="-0.4" r="1.1" fill="#fff"/>' +
        (LOOK.glasses ? '<circle cx="-10" cy="1" r="6" fill="none" stroke="' + C.ink + '" stroke-width="1.6"/><path d="M-4 0 L10 -2" stroke="' + C.ink + '" stroke-width="1.6"/>' : '') +
        '<path d="M-15 -5 q4 -3 8 -1" fill="none" stroke="' + C.hairDark + '" stroke-width="1.8" stroke-linecap="round"/>' +
        '<path d="M-20.5 1 Q-25.5 7 -20 8.5" fill="' + C.skin + '" stroke="' + C.skinLine + '" stroke-width="1.8" stroke-linejoin="round"/>' +
        '<path d="M-19 12 Q-15 ' + f(12 + 3 * sm) + ' -11 12" fill="none" stroke="' + C.lips + '" stroke-width="2.2" stroke-linecap="round"/>' +
        '<ellipse cx="-8" cy="8" rx="4.5" ry="3" fill="' + C.cheek + '" opacity=".45"/>' +
        '<path d="M-21 -6 Q-20 -24 2 -24 Q20 -23 22 -4 Q24 10 14 18 Q10 6 6 2 Q2 -6 -6 -8 Q-12 -14 -21 -6 Z" fill="' + C.hair + '" stroke="' + C.hairDark + '" stroke-width="2" stroke-linejoin="round"/>' +
        '<ellipse cx="3" cy="4" rx="4" ry="5.5" fill="' + C.skin + '" stroke="' + C.skinLine + '" stroke-width="1.5"/>' + band;
    } else {
      if (st === 'caschetto') backHair = '<path d="M' + f(hx - 23) + ' ' + f(hy - 4) + ' Q' + f(hx - 29) + ' ' + f(hy + 16) + ' ' + f(hx - 21 + swg * .4) + ' ' + f(hy + 28) + ' Q' + f(hx) + ' ' + f(hy + 33) + ' ' + f(hx + 21 + swg * .4) + ' ' + f(hy + 28) + ' Q' + f(hx + 29) + ' ' + f(hy + 16) + ' ' + f(hx + 23) + ' ' + f(hy - 4) + ' Z" fill="' + C.hair + '" stroke="' + C.hairDark + '" stroke-width="2.5" stroke-linejoin="round"/>';
      else if (st === 'coda') backHair = front ? '' : '<path d="M' + f(hx - 5) + ' ' + f(hy - 8) + ' Q' + f(hx - 10 + swg * .5) + ' ' + f(hy + 22) + ' ' + f(hx - 3 + swg) + ' ' + f(hy + 48) + ' Q' + f(hx + swg) + ' ' + f(hy + 52) + ' ' + f(hx + 3 + swg) + ' ' + f(hy + 48) + ' Q' + f(hx + 10 + swg * .5) + ' ' + f(hy + 22) + ' ' + f(hx + 5) + ' ' + f(hy - 8) + ' Z" fill="' + C.hair + '" stroke="' + C.hairDark + '" stroke-width="2.2"/><circle cx="' + f(hx) + '" cy="' + f(hy - 6) + '" r="4" style="fill:' + shirt + '"/>';
      else if (st === 'treccia') { backHair = front ? '' : braid(hx, hy + 12, hx + swg, hy + 64, 8); if (front) frontHair = braid(hx - 19, hy + 14, hx - 22 + swg * .6, hy + 58, 7); }
      else if (st === 'chignon') backHair = '';
      else backHair = '<path d="M' + f(hx - 23) + ' ' + f(hy - 4) + ' Q' + f(hx - 31) + ' ' + f(hy + 34) + ' ' + f(hx - 22 + swg) + ' ' + f(hy + 66) +
        ' Q' + f(hx + swg) + ' ' + f(hy + 74) + ' ' + f(hx + 22 + swg) + ' ' + f(hy + 66) + ' Q' + f(hx + 31) + ' ' + f(hy + 34) + ' ' + f(hx + 23) + ' ' + f(hy - 4) + ' Z" fill="' + C.hair + '" stroke="' + C.hairDark + '" stroke-width="2.5" stroke-linejoin="round"/>' +
        '<path d="M' + f(hx - 14) + ' ' + f(hy + 20) + ' Q' + f(hx - 16 + swg * .6) + ' ' + f(hy + 46) + ' ' + f(hx - 12 + swg) + ' ' + f(hy + 62) + '" fill="none" stroke="' + C.hairLight + '" stroke-width="2.5" stroke-linecap="round" opacity=".7"/>' +
        '<path d="M' + f(hx + 14) + ' ' + f(hy + 20) + ' Q' + f(hx + 16 + swg * .6) + ' ' + f(hy + 46) + ' ' + f(hx + 12 + swg) + ' ' + f(hy + 62) + '" fill="none" stroke="' + C.hairLight + '" stroke-width="2.5" stroke-linecap="round" opacity=".7"/>';
      face = front ?
        '<ellipse cx="-8" cy="2" rx="3" ry="3.8" fill="' + C.eye + '"/><ellipse cx="8" cy="2" rx="3" ry="3.8" fill="' + C.eye + '"/><circle cx="-8" cy="2.4" r="1.6" fill="' + C.ink + '"/><circle cx="8" cy="2.4" r="1.6" fill="' + C.ink + '"/>' +
        (LOOK.glasses ? '<circle cx="-8.5" cy="2" r="6.5" fill="none" stroke="' + C.ink + '" stroke-width="1.6"/><circle cx="8.5" cy="2" r="6.5" fill="none" stroke="' + C.ink + '" stroke-width="1.6"/><path d="M-2 1 Q0 -1 2 1" fill="none" stroke="' + C.ink + '" stroke-width="1.6"/>' : '') +
        '<circle cx="-7" cy="0.6" r="1.2" fill="#fff"/><circle cx="9" cy="0.6" r="1.2" fill="#fff"/>' +
        '<path d="M-12 -5.5 q4 -3 8 -0.5 M4 -6 q4 -2.5 8 0.5" fill="none" stroke="' + C.hairDark + '" stroke-width="1.8" stroke-linecap="round"/>' +
        '<path d="M-1 6 q1 1.5 2 0" fill="none" stroke="' + C.skinLine + '" stroke-width="1.6" stroke-linecap="round"/>' +
        '<path d="M-6 10 Q0 ' + f(10 + 4 * sm) + ' 6 10" fill="' + (sm > 1.3 ? C.lips : 'none') + '" stroke="' + C.lips + '" stroke-width="2.2" stroke-linecap="round"/>' +
        '<ellipse cx="-13" cy="8" rx="4.5" ry="3" fill="' + C.cheek + '" opacity=".45"/><ellipse cx="13" cy="8" rx="4.5" ry="3" fill="' + C.cheek + '" opacity=".45"/>' +
        '<path d="M-21 -4 Q-19 -22 -2 -19 Q-8 -12 -6 -6 Q2 -14 6 -19 Q19 -21 21 -4 Q22 -26 0 -25 Q-22 -26 -21 -4 Z" fill="' + C.hair + '" stroke="' + C.hairDark + '" stroke-width="2" stroke-linejoin="round"/>' + band
        : '<circle cx="0" cy="-2" r="23" fill="' + C.hair + '" stroke="' + C.hairDark + '" stroke-width="2.5"/>' +
          '<path d="M-10 -14 Q-4 2 -8 18 M6 -16 Q10 0 6 18" fill="none" stroke="' + C.hairLight + '" stroke-width="2.5" stroke-linecap="round" opacity=".7"/>' + band;
    }
    const ears = !prof && front ? '<ellipse cx="-21" cy="3" rx="4" ry="5.5" fill="' + C.skin + '" stroke="' + C.skinLine + '" stroke-width="1.5"/><ellipse cx="21" cy="3" rx="4" ry="5.5" fill="' + C.skin + '" stroke="' + C.skinLine + '" stroke-width="1.5"/>' : '';
    const head = '<g transform="translate(' + f(hx) + ' ' + f(hy) + ') rotate(' + f(-rot) + ')">' + ears +
      bun + '<circle cx="0" cy="0" r="' + L.head + '" fill="' + C.skin + '" stroke="' + C.skinLine + '" stroke-width="2.2"/>' + face + '</g>';

    const ground = Math.max(legL[2][1], legR[2][1]);
    const shadow = '<ellipse cx="' + f(p.px) + '" cy="236" rx="' + f(Math.max(22, 46 - (236 - ground - 6) * .5)) + '" ry="7" fill="' + C.ink + '" opacity=".13"/>';
    let body;
    if (prof) body = arm(armL, 1) + leg(legL, 1) + shoe(legL, -1) + backHair + leg(legR) + shoe(legR, -1) + torso + neck + head + arm(armR);
    else body = (front ? backHair : '') + leg(legL) + leg(legR) + shoe(legL, -1) + shoe(legR, 1) + torso + neck +
      (front ? frontHair + arm(armL) + arm(armR) + head : head + arm(armL) + arm(armR) + backHair);
    return shadow + '<g transform="translate(' + f(p.px) + ' 0) scale(' + f(p.sx) + ' 1) translate(' + f(-p.px) + ' 0)">' + body + '</g>';
  }

  let type = 'belly', paused = false, shirt = 'var(--c5)', raf = 0, t0 = performance.now(), frozenAt = 0;
  const reduceM = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const STILL = { march: 0, side: 0, arabesque: 0, tree: 0, jump: 450, hop: 325, reach: 0, stretch: 1200, fold: 2100, bow: 1300, belly: 2000, breast: 700, crawl: 375, back: 375, fly: 400, spin: 0, shake: 0, wave: 350 };
  const svg = p => '<svg viewBox="0 0 200 250" role="img" aria-label="Una bambina che fa l’esercizio">' + draw(p, shirt) + '</svg>';
  function frame(now) {
    raf = 0;
    const el = document.getElementById('mv-fig');
    if (!el || el.closest('[hidden]')) return;
    const ms = paused ? frozenAt : now - t0;
    if (!paused) frozenAt = ms;
    el.innerHTML = svg(poseAt(type, reduceM ? (STILL[type] || 0) : ms));
    if (!paused && !reduceM) raf = requestAnimationFrame(frame);
  }
  return {
    set(newType, isPaused, color) {
      if (newType !== type) { type = newType; t0 = performance.now(); frozenAt = 0; }
      if (isPaused && !paused) frozenAt = performance.now() - t0;
      if (!isPaused && paused) t0 = performance.now() - frozenAt;
      paused = !!isPaused; if (color) shirt = color;
      if (raf) cancelAnimationFrame(raf);
      frame(performance.now());
    },
    at(tp, ms, color) { return '<svg viewBox="0 0 200 250">' + draw(poseAt(tp, ms), color || shirt) + '</svg>'; },
    look(l) { applyLook(l); },
    ice(v) { ON_ICE = !!v; },
    get LOOK() { return LOOK; }
  };
})();
