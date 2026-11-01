/* cartoni della serie: episodi (roma) — scritti da un agente, controllati dal revisore */
(() => {
  const { T, cielo } = CH;
  const A = (d, s) => `<g class="a" style="--d:${d}s">${s}</g>`;
  const B = s => `<g class="b">${s}</g>`;
  const TX = (x, y, s, t, d, f, st) => T(x, y, s, t, d, `text-anchor="middle" font-weight="900" fill="${f || '#1d2433'}" stroke="${st || '#fff'}" stroke-width="3.5" paint-order="stroke" stroke-linejoin="round"`);
  const R = (x, y, w, h, f, e) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}" ${e || ''}/>`;
  const tt = (x, y, s, t) => `<text x="${x}" y="${y}" font-size="${s}" font-weight="900" text-anchor="middle" fill="#1d2433">${t}</text>`;
  const omino = (x, y, c, s, sk, up) => `<g transform="translate(${x},${y}) scale(${s || 1})"><rect x="-6" y="-12" width="5" height="12" fill="#5b3a1e"/><rect x="1" y="-12" width="5" height="12" fill="#5b3a1e"/><path d="M-9,-40h18l4,30h-26z" fill="${c}" stroke="rgba(0,0,0,.25)"/><path d="${up ? 'M-8,-38l-10,-16M8,-38l10,-16' : 'M-8,-38l-7,16M8,-38l7,16'}" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/><circle cy="-46" r="7" fill="${sk || '#f2c9a0'}"/></g>`;
  const corona = (x, y, s) => `<polygon transform="translate(${x},${y}) scale(${s || 1})" points="-8,0 -8,-8 -4,-4 0,-10 4,-4 8,-8 8,0" fill="#f2c94c" stroke="#a07c1a"/>`;
  const scudo = (x, y, w, h, c) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${c}" stroke="#6b3b12" stroke-width="2"/><circle cx="${x + w / 2}" cy="${y + h / 2}" r="4" fill="#f2c94c"/>`;
  const colonna = (x, y, h, c) => R(x - 9, y - 4, 18, 4, c) + R(x - 6, y - h, 12, h - 4, c) + R(x - 9, y - h - 4, 18, 5, c);
  const tempio = (x, y, n, gap, h, c, r) => { const w = (n - 1) * gap + 30, x0 = x - w / 2; let s = ''; for (let k = 0; k < n; k++) s += colonna(x0 + 15 + k * gap, y, h, c); return s + R(x0, y - h - 12, w, 8, c) + `<polygon points="${x0 - 4},${y - h - 12} ${x},${y - h - 34} ${x0 + w + 4},${y - h - 12}" fill="${r}"/>` + R(x0 - 6, y, w + 12, 6, c); };
  const nave = (x, y, s, c, cargo) => `<g transform="translate(${x},${y}) scale(${s})"><path d="M-34,0L34,0L24,14L-24,14z" fill="#8a5a2b"/>${cargo ? R(-26, -8, 14, 8, '#777') + R(-10, -8, 14, 8, '#888') : ''}<line x1="12" y1="0" x2="12" y2="-42" stroke="#5b3a1e" stroke-width="3"/><path d="M12,-40L34,-6L12,-6z" fill="${c}"/></g>`;
  const fiamma = (x, y, s) => `<g transform="translate(${x},${y}) scale(${s})"><path d="M0,0C-10,-6 -8,-18 0,-28C2,-18 10,-14 8,-6C6,0 0,0 0,0z" fill="#ff8a1e"/><path d="M0,0C-5,-3 -4,-9 0,-14C2,-9 5,-7 4,-3z" fill="#ffd54a"/></g>`;
  const cal = (x, y, top, body, d) => A(d, `<rect x="${x}" y="${y}" width="76" height="76" rx="8" fill="#fff" stroke="#8a6a4a" stroke-width="3"/><path d="M${x},${y + 22}V${y + 8}a8,8 0 0 1 8,-8H${x + 68}a8,8 0 0 1 8,8V${y + 22}z" fill="#d6453d"/><text x="${x + 38}" y="${y + 17}" font-size="14" font-weight="900" fill="#fff" text-anchor="middle">${top}</text>${body}`);
  const elefante = (x, y, s) => `<g transform="translate(${x},${y}) scale(${s})">${R(-26, 10, 9, 20, '#7d8896')}${R(-12, 10, 9, 20, '#7d8896')}${R(8, 10, 9, 20, '#7d8896')}${R(22, 10, 9, 20, '#7d8896')}<ellipse rx="36" ry="24" fill="#8d98a6"/><circle cx="38" cy="-8" r="15" fill="#8d98a6"/><ellipse cx="29" cy="-4" rx="9" ry="14" fill="#7d8896"/><path d="M48,0Q62,14 54,32" stroke="#8d98a6" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M44,6Q58,10 62,0" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="43" cy="-12" r="2" fill="#1d2433"/><path d="M-36,-6Q-46,6 -42,18" stroke="#7d8896" stroke-width="3" fill="none"/></g>`;
  const oca = (x, y, s) => `<g transform="translate(${x},${y}) scale(${s})"><line x1="-3" y1="8" x2="-3" y2="16" stroke="#f2a33a" stroke-width="2.5"/><line x1="4" y1="8" x2="4" y2="16" stroke="#f2a33a" stroke-width="2.5"/><ellipse rx="15" ry="9" fill="#fff" stroke="#bbb"/><path d="M10,-4Q19,-10 15,-22" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="15" cy="-23" r="5" fill="#fff" stroke="#bbb"/><polygon points="19,-25 28,-22 19,-20" fill="#f2a33a"/></g>`;
  const cupole = (x, b, s) => `<g transform="translate(${x},${b}) scale(${s})">${R(-40, -30, 80, 30, '#e3d3b0')}<path d="M-30,-30a30,30 0 0 1 60,0z" fill="#4a7fb5"/>${R(-60, -22, 20, 22, '#d8c69c')}${R(-60, -27, 5, 5, '#d8c69c')}${R(-52, -27, 5, 5, '#d8c69c')}${R(-45, -27, 5, 5, '#d8c69c')}${R(40, -22, 20, 22, '#d8c69c')}${R(40, -27, 5, 5, '#d8c69c')}${R(47, -27, 5, 5, '#d8c69c')}${R(55, -27, 5, 5, '#d8c69c')}<path d="M-8,0v-14a8,8 0 0 1 16,0v14z" fill="#5b3a1e"/></g>`;
  const colosseo = (x, b, w, h) => { const x0 = x - w / 2, n = 7, s = w / n, rh = (h - 14) / 3; let o = R(x0, b - h, w, h, '#d9b88a', 'stroke="#a07c4c" stroke-width="2"'); for (let r = 0; r < 3; r++) { const ry = b - h + 8 + r * rh; for (let k = 0; k < n; k++) o += `<path d="M${x0 + k * s + s * .2},${ry + rh - 4}v-${rh - 12}a${s * .3},${s * .3} 0 0 1 ${s * .6},0v${rh - 12}z" fill="#6b4a2a"/>`; } return o; };
  const cavallo = (x, y, c) => `<g transform="translate(${x},${y})"><path d="M-24,2Q-36,8 -32,22" stroke="#3b2a1e" stroke-width="5" fill="none" stroke-linecap="round"/><g stroke="${c}" stroke-width="4"><line x1="-16" y1="8" x2="-18" y2="28"/><line x1="-8" y1="8" x2="-6" y2="28"/><line x1="12" y1="8" x2="14" y2="28"/><line x1="20" y1="8" x2="24" y2="26"/></g><ellipse rx="26" ry="12" fill="${c}"/><path d="M16,-6L26,-26L38,-22L30,0z" fill="${c}"/><ellipse cx="38" cy="-22" rx="10" ry="5" fill="${c}" transform="rotate(25 38 -22)"/></g>`;
  const cipresso = (x, y) => `<ellipse cx="${x}" cy="${y - 20}" rx="7" ry="22" fill="#2f6b3a"/>${R(x - 1.5, y, 3, 9, '#5b3a1e')}`;
  const frecciaD = (x1, x2, y, c) => `<path class="w" d="M${x1},${y}H${x2}m-10,-9l10,9l-10,9" stroke="${c}" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round" pathLength="1000"/>`;
  const meta = (x) => `<path d="M${x},0H382a18,18 0 0 1 18,18V222a18,18 0 0 1-18,18H${x}z"`;

  Object.assign(CARTONI, {
    etruschi: [
      /* 0 · Etruria: Toscana, Lazio, Umbria; Tusci */
      cielo('#bfe3ff', '#fff1cf') + A(.2, '<circle cx="335" cy="62" r="22" fill="#ffd54a"/>') +
      '<path d="M0,150Q90,100 190,140T400,120V240H0z" fill="#9bcf6f"/><path d="M0,185Q110,140 230,180T400,165V240H0z" fill="#7fbf5a"/>' +
      [[60, 160], [112, 172], [300, 152], [352, 160]].map(([x, y], k) => A(.4 + k * .2, cipresso(x, y))).join('') +
      TX(200, 38, 28, 'Etruria', .6) + TX(95, 200, 15, 'Toscana', 1.4) + TX(310, 196, 15, 'Umbria', 1.8) + TX(205, 211, 15, 'Lazio', 2.2) +
      TX(200, 234, 15, 'Romani: Tusci → Toscana', 3),

      /* 1 · dodici città unite nella lega: la dodecapoli */
      cielo('#ffe2a8', '#fff4dc') + R(0, 175, 400, 65, '#b9d98a') +
      '<ellipse class="w" cx="200" cy="128" rx="135" ry="62" fill="none" stroke="#c9a77c" stroke-width="4" pathLength="1000"/>' +
      Array.from({ length: 12 }, (_, k) => { const a = k * Math.PI / 6, x = (200 + 135 * Math.cos(a)).toFixed(0), y = (128 + 62 * Math.sin(a)).toFixed(0); return A(.5 + k * .18, `<g transform="translate(${x},${y})">${R(-10, -8, 20, 15, '#d9a066')}<polygon points="-13,-8 0,-21 13,-8" fill="#b8553a"/></g>`); }).join('') +
      A(2.8, R(188, 134, 24, 12, '#cbb994') + B(fiamma(200, 134, 1))) +
      TX(200, 34, 22, '12 città · dodecapoli', 2.6) + TX(200, 230, 16, 'feste e religione', 3.4),

      /* 2 · artigiani dei metalli; ferro dall'isola d'Elba */
      cielo('#cfe9ff', '#eaf6ff') + R(0, 125, 400, 115, '#4aa3df') +
      '<ellipse cx="85" cy="128" rx="62" ry="32" fill="#8cc56b"/><polygon points="62,118 80,92 98,118" fill="#8b6a52"/><polygon points="95,122 108,104 120,122" fill="#7a5a44"/>' +
      A(.4, '<rect x="300" y="140" width="100" height="100" fill="#e3c88f"/>') +
      A(1, B(nave(200, 165, 1, '#f1e6c9', 1))) +
      A(1.8, `<polygon points="338,196 374,196 366,206 346,206 350,214 362,214 362,222 338,222" fill="#45474f"/><rect x="326" y="208" width="14" height="14" fill="#b8553a"/>`) + A(2.2, B(fiamma(333, 208, .7))) +
      A(2.2, omino(352, 196, '#c2452d', .85)) +
      TX(200, 36, 22, 'abili artigiani', .6) + TX(85, 88, 15, 'isola d\'Elba', 1.4) + TX(200, 112, 15, 'ferro', 2) + TX(346, 128, 15, 'metalli', 2.6) +
      TX(200, 232, 14, 'lavorano i metalli', 3.2),

      /* 3 · alfabeto dai Greci, scritto da destra a sinistra */
      cielo('#f2e6ff', '#fbf7ff') +
      R(50, 66, 240, 100, '#8a5a2b', 'rx="10"') + R(60, 76, 220, 80, '#f3e3c3', 'rx="6"') +
      T(170, 134, 44, 'ΕΔΓΒΑ', 1, 'text-anchor="middle" font-weight="900" fill="#7a4b2a" letter-spacing="6"') +
      frecciaD(285, 80, 196, '#d6453d').replace('stroke-width="6"', 'stroke-width="6"') +
      TX(338, 130, 44, '?', 2.6, '#7a4b2a') + TX(338, 160, 13, 'solo in parte', 3.2) +
      TX(200, 38, 22, 'alfabeto dai Greci', .4) + TX(200, 232, 15, 'da destra a sinistra', 2.2),

      /* 4 · tombe come case, dipinte */
      cielo('#d9e3f2', '#f1f5fb') +
      '<polygon points="70,96 200,46 330,96" fill="#b8553a"/>' + R(90, 96, 220, 110, '#e8c48a', 'stroke="#7a4b2a" stroke-width="3"') +
      R(90, 100, 220, 10, '#c2452d') + R(90, 110, 220, 4, '#3d7fd6') +
      A(.8, omino(130, 205, '#c2452d', .8, '#f2c9a0', 1)) + A(1.4, B(omino(190, 205, '#3d7fd6', .8))) + A(1.6, '<text x="212" y="150" font-size="22">🎶</text>') +
      A(2.2, R(240, 178, 56, 5, '#7a4b2a') + R(244, 183, 4, 22, '#7a4b2a') + R(288, 183, 4, 22, '#7a4b2a') + '<text x="256" y="176" font-size="20">🍇</text>') +
      A(2.8, '<text x="150" y="203" font-size="16">🎲</text>') +
      TX(200, 34, 22, 'tombe come case', .4) + TX(200, 232, 15, 'banchetti, danze, musica e giochi', 3.2),

      /* 5 · Sarcofago degli Sposi */
      cielo('#ffe2c8', '#fff3e6') +
      R(80, 150, 240, 56, '#c9774a', 'rx="6"') + R(92, 160, 216, 36, 'rgba(255,255,255,.18)', 'rx="4"') +
      A(.6, R(96, 124, 208, 28, '#e8b98a', 'rx="12"')) +
      A(1.2, B(R(112, 108, 70, 28, '#3d7fd6', 'rx="14"') + '<circle cx="128" cy="98" r="11" fill="#f2c9a0"/><path d="M117,96a11,11 0 0 1 22,-2v-2a11,11 0 0 0-22,2z" fill="#3b2a1e"/>')) +
      A(1.8, B(R(206, 108, 70, 28, '#d6453d', 'rx="14"') + '<circle cx="222" cy="98" r="11" fill="#f2c9a0"/><path d="M209,100a13,13 0 0 1 26,0v10h-26z" fill="#3b2a1e" opacity=".9"/><circle cx="222" cy="100" r="9" fill="#f2c9a0"/>')) +
      TX(200, 40, 22, 'Sarcofago degli Sposi', .3) + TX(200, 232, 14, 'donne e uomini insieme al banchetto', 3),
    ],

    'roma-re': [
      /* 0 · Romolo e Remo, la lupa, il Tevere */
      cielo('#ffd8a8', '#fff0d6') +
      R(0, 150, 400, 45, '#9bcf6f') + '<path class="w" d="M0,212C90,196 180,226 260,210S360,202 400,208" stroke="#3d8fd6" stroke-width="26" fill="none" pathLength="1000"/>' +
      A(.3, R(76, 92, 8, 60, '#5b3a1e') + '<circle cx="80" cy="84" r="34" fill="#3f8a3a"/>') +
      A(1, `<g transform="translate(200,150)">${R(-30, 8, 7, 18, '#6f6f7a')}${R(-14, 8, 7, 18, '#6f6f7a')}${R(14, 8, 7, 18, '#6f6f7a')}${R(28, 8, 7, 18, '#6f6f7a')}<path d="M-40,-6Q-58,-10 -56,8" stroke="#8c8c96" stroke-width="7" fill="none" stroke-linecap="round"/><ellipse rx="42" ry="17" fill="#8c8c96"/><circle cx="46" cy="-10" r="12" fill="#8c8c96"/><polygon points="52,-14 70,-4 52,0" fill="#8c8c96"/><polygon points="40,-20 44,-34 50,-20" fill="#6f6f7a"/><circle cx="50" cy="-12" r="2" fill="#1d2433"/></g>`) +
      A(2, '<g><circle cx="186" cy="168" r="6" fill="#f2c9a0"/><ellipse cx="186" cy="178" rx="9" ry="5" fill="#fff"/><circle cx="214" cy="168" r="6" fill="#f2c9a0"/><ellipse cx="214" cy="178" rx="9" ry="5" fill="#fff"/></g>') +
      TX(200, 38, 24, 'Romolo e Remo', 2.4) + TX(200, 112, 15, 'la lupa', 2.8) + TX(325, 232, 15, 'Tevere', 3.2),

      /* 1 · Romolo fonda Roma, primo re; 21 aprile 753 a.C. */
      cielo('#ffe9b8', '#fff7e0') + R(0, 190, 400, 50, '#9bcf6f') +
      '<path class="w" d="M118,198V150H282V198" stroke="#8a5a2b" stroke-width="8" fill="none" pathLength="1000"/>' +
      CH.capanna(160, 1.2) + CH.capanna(205, 1.5) + CH.capanna(250, 1.8) +
      A(2.2, omino(66, 205, '#b8322b', 1.1, '#f2c9a0', 1) + corona(66, 148, 1.2)) +
      cal(298, 52, 'aprile', tt(336, 94, 28, '21') + tt(336, 114, 13, '753 a.C.'), 3) +
      TX(150, 40, 22, 'Romolo fonda Roma', .4) + TX(66, 232, 15, 'primo re', 2.8),

      /* 2 · Monarchia: 7 re, gli ultimi tre etruschi */
      cielo('#e3d4f3', '#f7efff') + R(0, 175, 400, 65, '#c9b48a') +
      Array.from({ length: 7 }, (_, k) => A(.4 + k * .4, omino(52 + k * 49, 175, k < 4 ? '#8e5bbf' : '#d9822b', .8) + corona(52 + k * 49, 133, 1))).join('') +
      A(3.4, '<path d="M236,186V192H358V186" stroke="#a85f12" stroke-width="3" fill="none"/>') +
      TX(297, 211, 14, 'ultimi tre:', 3.4) + TX(297, 229, 14, 'origine etrusca', 3.6) + TX(125, 211, 14, 'uno dopo l\'altro', 3.2) +
      TX(200, 46, 26, 'Monarchia · 7 re', .3),

      /* 3 · Tarquinio il Superbo cacciato, 509 a.C. */
      cielo('#e3d4f3', '#f7efff') + R(0, 190, 400, 50, '#9bcf6f') +
      R(0, 108, 70, 82, '#c99a63') + '<path d="M22,190v-26a13,13 0 0 1 26,0v26z" fill="#4a2f1a"/>' +
      A(.8, omino(110, 200, '#f6f1e4', 1, '#f2c9a0', 1)) + A(1.2, omino(150, 200, '#f2e6d0', 1)) + A(1.6, omino(190, 200, '#f6f1e4', 1, '#f2c9a0', 1)) +
      frecciaD(215, 290, 140, '#d6453d') +
      A(2.6, B(omino(335, 200, '#7b4ea3', 1.1) + corona(335, 143, 1.2))) +
      TX(200, 38, 22, 'Tarquinio il Superbo', .3) + TX(150, 228, 15, '509 a.C.', 2) + TX(335, 228, 15, 'prepotente', 3),

      /* 4 · Repubblica: due consoli, ogni anno, fino al 27 a.C. */
      cielo('#d9e8ff', '#f4f8ff') + R(0, 195, 400, 45, '#d8c9a8') +
      A(.6, omino(80, 195, '#f6f1e4', 1.3)) + A(1.2, omino(165, 195, '#f2e6d0', 1.3, '#f2c9a0', 1)) +
      A(1.8, '<circle cx="122" cy="96" r="20" fill="#f2c94c" stroke="#a07c1a" stroke-width="3"/>' + tt(122, 105, 26, '2')) +
      '<circle class="w" style="--d:2.4s" cx="310" cy="118" r="42" fill="none" stroke="#3d7fd6" stroke-width="6" pathLength="1000"/>' +
      TX(310, 124, 15, 'ogni anno', 3.2) +
      TX(200, 38, 26, 'Repubblica', .3) + TX(122, 226, 16, 'due consoli', 2.2) + TX(310, 226, 14, 'fino al 27 a.C.', 3.8),

      /* 5 · tre fasi: Monarchia, Repubblica, Impero; 476 d.C. */
      cielo('#d9e8ff', '#f4f8ff') +
      [['👑', 'Monarchia', '#fff1c4'], ['🏛️', 'Repubblica', '#dcebff'], ['🦅', 'Impero', '#ffdcd6']].map(([e, n, c], k) => A(.5 + k * 1.1, R(20 + k * 126, 66, 107, 104, c, 'rx="14" stroke="#8a6a4a" stroke-width="3"') + `<text x="${73 + k * 126}" y="116" font-size="44" text-anchor="middle">${e}</text>` + tt(73 + k * 126, 152, 16, n))).join('') +
      '<path class="w" style="--d:1.2s" d="M128,118H145" stroke="#1d2433" stroke-width="5" pathLength="1000"/><path class="w" style="--d:2.3s" d="M254,118H271" stroke="#1d2433" stroke-width="5" pathLength="1000"/>' +
      TX(200, 40, 22, 'tre fasi da ricordare', .2) + TX(200, 210, 14, 'in Occidente finisce nel 476 d.C.', 3.8),
    ],

    repubblica: [
      /* 0 · 509 a.C.: consoli, Senato, SPQR */
      cielo('#d9e8ff', '#f4f8ff') + R(0, 190, 400, 50, '#d8c9a8') +
      A(.5, omino(170, 188, '#f6f1e4', .6) + omino(200, 188, '#f2e6d0', .6) + omino(230, 188, '#f6f1e4', .6)) +
      A(.3, tempio(200, 190, 4, 34, 60, '#efe6d2', '#c9774a')) +
      A(1.4, omino(64, 198, '#f6f1e4', 1) + omino(100, 198, '#f2e6d0', 1)) +
      A(2, R(334, 66, 4, 132, '#6b4a2a') + R(308, 72, 56, 44, '#b8322b', 'stroke="#f2c94c" stroke-width="3"') + '<text x="336" y="100" font-size="15" font-weight="900" text-anchor="middle" fill="#f2c94c">SPQR</text>') +
      TX(200, 34, 20, '509 a.C. · nasce la Repubblica', .3) + TX(82, 226, 15, '2 consoli', 1.6) + TX(200, 226, 16, 'Senato', 1.2),

      /* 1 · il dittatore e Cincinnato che torna ad arare */
      cielo('#cfe9ff', '#f1f8ff') + R(0, 190, 400, 50, '#9bcf6f') +
      [0, 1, 2, 3].map(k => `<path d="M170,${200 + k * 10}H400" stroke="#8b6a3e" stroke-width="3"/>`).join('') +
      A(.6, omino(68, 200, '#b8322b', 1.2, '#f2c9a0', 1)) + frecciaD(112, 170, 130, '#d6453d') +
      A(2, `<g>${R(250, 158, 50, 22, '#8b5a3c')}${R(254, 180, 6, 14, '#6b4a2e')}${R(290, 180, 6, 14, '#6b4a2e')}<ellipse cx="306" cy="164" rx="12" ry="9" fill="#8b5a3c"/><path d="M300,155l-6,-9M312,155l6,-9" stroke="#fff" stroke-width="3"/><path d="M300,174L340,194" stroke="#6b4a2e" stroke-width="3"/></g>`) +
      A(2.6, omino(352, 200, '#9c6b3f', 1) + '<path d="M342,194L336,164" stroke="#6b4a2e" stroke-width="4"/>') +
      TX(68, 92, 15, 'pieni poteri', 1) + TX(68, 230, 15, 'dittatore', 1.2) + TX(305, 70, 20, 'Cincinnato', 2.4) + TX(305, 112, 15, 'torna ad arare', 3),

      /* 2 · patrizi e plebei: 494 a.C. */
      cielo('#ffe9d0', '#fff7ec') + R(0, 190, 400, 50, '#9bcf6f') +
      R(0, 104, 112, 86, '#c99a63') + [0, 1, 2, 3].map(k => R(4 + k * 28, 96, 16, 10, '#c99a63')).join('') + '<path d="M44,190v-24a12,12 0 0 1 24,0v24z" fill="#4a2f1a"/>' +
      A(.6, omino(30, 190, '#7b4ea3', .8) + omino(86, 190, '#7b4ea3', .8)) +
      [0, 1, 2].map(k => A(1.4 + k * .4, B(omino(190 + k * 44, 190, '#9c6b3f', .9)))).join('') + frecciaD(135, 340, 112, '#d6453d') +
      A(3, scudo(338, 168, 22, 26, '#b8322b') + scudo(366, 172, 22, 26, '#b8322b')) +
      TX(200, 36, 24, '494 a.C.', .3) + TX(56, 84, 15, 'patrizi', .8) + TX(235, 70, 14, 'i plebei escono da Roma', 2) + TX(232, 212, 15, 'plebei', 1.8) + TX(250, 234, 15, 'rifiutano di combattere', 3.2),

      /* 3 · tribuni, veto, Dodici Tavole */
      cielo('#e8e0ff', '#f7f4ff') + R(0, 200, 400, 40, '#d8c9a8') +
      A(.6, omino(70, 200, '#f6f1e4', 1.2, '#f2c9a0', 1)) +
      A(1.4, '<rect x="24" y="56" width="104" height="54" rx="12" fill="#fff" stroke="#7b4ea3" stroke-width="3"/><polygon points="60,110 72,110 66,124" fill="#fff" stroke="#7b4ea3" stroke-width="3"/>' + tt(76, 84, 20, 'veto!') + tt(76, 102, 13, 'mi oppongo')) +
      A(1.2, R(192, 62, 196, 138, '#b08a52', 'rx="8"')) +
      Array.from({ length: 12 }, (_, k) => { const c = k % 6, r = (k / 6) | 0; return A(2.4 + k * .15, R(200 + c * 30, 70 + r * 62, 26, 54, '#f3e3c3') + `<path d="M${204 + c * 30},${82 + r * 62}h18M${204 + c * 30},${92 + r * 62}h18M${204 + c * 30},${102 + r * 62}h14" stroke="#9b7a4a" stroke-width="2"/>`); }).join('') +
      TX(290, 44, 18, 'Dodici Tavole', 2.2) + TX(85, 232, 14, 'tribuni della plebe', 1.6) + TX(290, 226, 13, 'scritte e mostrate a tutti', 4),

      /* 4 · i Galli di Brenno; le oche del Campidoglio */
      cielo('#3b4a7a', '#a9a6d6') + A(.2, '<circle cx="340" cy="56" r="16" fill="#fff6c8"/>') +
      '<path d="M0,205Q100,195 140,150Q200,100 260,150Q310,195 400,205V240H0z" fill="#7c9a5a"/>' +
      R(164, 100, 72, 26, '#c99a63') + [0, 1, 2, 3].map(k => R(166 + k * 19, 94, 12, 8, '#c99a63')).join('') +
      A(.8, omino(200, 152, '#c0392b', .7, '#f2c9a0', 1) + scudo(212, 124, 14, 18, '#b8322b')) +
      A(1.6, B(oca(150, 158, 1.1) + oca(252, 158, 1.1))) + A(2.2, tt(132, 118, 24, '!') + tt(272, 118, 24, '!')) +
      [0, 1, 2].map(k => A(2.6 + k * .3, omino(44 + k * 36, 224, '#e07b39', .75))).join('') +
      TX(200, 28, 18, 'i Galli guidati da Brenno', .3) + TX(200, 72, 15, 'le oche del Campidoglio', 1.4) + TX(300, 228, 14, 'svegliano i difensori', 3.4),

      /* 5 · guerre puniche: Annibale, Alpi, soldati ed elefanti */
      cielo('#cfe9ff', '#eef6ff') +
      '<polygon points="0,170 70,62 140,170" fill="#7e8fa6"/><polygon points="90,170 190,46 290,170" fill="#8a9bb2"/><polygon points="230,170 320,72 400,170" fill="#7e8fa6"/><polygon points="190,46 168,84 190,76 208,88" fill="#fff"/><polygon points="70,62 54,92 70,84 86,96" fill="#fff"/><polygon points="320,72 304,98 320,92 336,100" fill="#fff"/>' +
      R(0, 168, 400, 72, '#e9eef3') +
      [0, 1, 2].map(k => A(.6 + k * .4, omino(46 + k * 36, 214, '#7b4ea3', .75) + scudo(60 + k * 36, 182, 12, 18, '#b8322b'))).join('') +
      A(2, B(elefante(222, 192, 1.05))) +
      TX(200, 30, 20, 'Annibale attraversa le Alpi', .3) + TX(200, 232, 14, 'guerre puniche: Roma contro Cartagine', 3),

      /* 6 · Spartaco, Cesare, Rubicone, luglio */
      cielo('#ffe9d0', '#fff7ec') +
      [12, 140, 268].map((x, k) => A(.3 + k * .3, R(x, 50, 120, 122, '#fff', 'rx="12" stroke="#8a6a4a" stroke-width="3"'))).join('') +
      A(.9, omino(72, 160, '#9c6b3f', .9, '#f2c9a0', 1) + '<g fill="none" stroke="#6b6f78" stroke-width="3"><ellipse cx="34" cy="166" rx="8" ry="5"/><ellipse cx="46" cy="166" rx="8" ry="5"/><ellipse cx="102" cy="166" rx="8" ry="5"/><ellipse cx="114" cy="166" rx="8" ry="5"/></g>') +
      A(1.8, R(196, 56, 16, 110, '#4aa3df') + omino(166, 162, '#c0392b', .85) + '<path d="M162,112a8,8 0 0 1 16,0" stroke="#3f8a3a" stroke-width="3" fill="none"/>') + '<path class="w" style="--d:2.6s" d="M180,120H240m-9,-8l9,8l-9,8" stroke="#d6453d" stroke-width="5" fill="none" pathLength="1000"/>' +
      cal(290, 72, 'Luglio', '<circle cx="328" cy="124" r="12" fill="#f2c9a0"/><path d="M314,122a14,14 0 0 1 28,0" stroke="#3f8a3a" stroke-width="4" fill="none"/>', 3) +
      TX(200, 32, 20, '73 a.C. → 44 a.C.', .2) +
      TX(72, 194, 15, 'Spartaco', 1.2) + TX(72, 211, 13, 'rivolta degli', 1.4) + TX(72, 227, 13, 'schiavi', 1.4) +
      TX(200, 194, 15, 'Giulio Cesare', 2) + TX(200, 211, 13, 'Gallia · Rubicone', 2.2) +
      TX(328, 194, 15, 'Luglio', 3.2) + TX(328, 211, 13, 'porta il suo nome', 3.4),
    ],

    impero: [
      /* 0 · Augusto, i pretoriani, agosto */
      cielo('#ffe9b8', '#fff6df') + R(0, 200, 400, 40, '#d9c59a') +
      A(.6, omino(70, 200, '#7a1f1f', 1) + scudo(84, 168, 16, 24, '#b8322b') + omino(110, 200, '#7a1f1f', 1) + omino(290, 200, '#7a1f1f', 1) + scudo(262, 168, 16, 24, '#b8322b') + omino(330, 200, '#7a1f1f', 1)) +
      A(1.4, B(omino(200, 200, '#f6f1e4', 1.5) + '<path d="M188,134Q185,119 200,118Q215,119 212,134" fill="none" stroke="#3f8a3a" stroke-width="4"/>')) +
      cal(300, 36, 'agosto', '<text x="338" y="84" font-size="30" text-anchor="middle">☀️</text>', 2.6) +
      TX(150, 34, 20, 'Augusto, primo imperatore', .3) + TX(200, 228, 15, '27 a.C.', 1.8) + TX(80, 228, 14, 'pretoriani', 2.2),

      /* 1 · pax romana, poi l'incendio di Roma sotto Nerone */
      cielo('#cfe9ff', '#eaf6ff') +
      `<path d="M200,0H382a18,18 0 0 1 18,18V222a18,18 0 0 1-18,18H200z" fill="#f5a55a"/>` +
      R(0, 170, 200, 70, '#4aa3df') + A(.4, '<circle cx="40" cy="60" r="20" fill="#ffd54a"/>') +
      A(.8, B(nave(90, 168, 1.1, '#fff', 1))) + A(1.6, '<text x="150" y="110" font-size="36">🕊️</text>') +
      [[214, 120, 40], [260, 96, 64], [304, 130, 30], [340, 108, 52]].map(([x, y, h], k) => A(2 + k * .3, R(x, 200 - h - 20, 38, h + 20, '#6b4a3a') + B(fiamma(x + 19, 200 - h - 20, 1.3)))).join('') +
      A(3, '<ellipse cx="300" cy="72" rx="40" ry="14" fill="#8a8a8a" opacity=".7"/>') +
      TX(100, 36, 20, 'pax romana', .3) + TX(100, 226, 14, 'commerci e viaggi', 1.4) + TX(300, 38, 18, 'grande incendio', 2.4) + TX(300, 226, 14, '64 d.C. · Nerone', 3.4),

      /* 2 · Vesuvio e Pompei; Colosseo */
      cielo('#cfe9ff', '#f4f8ff') + R(0, 200, 400, 40, '#d9c59a') +
      '<polygon points="20,200 108,88 196,200" fill="#7a5a48"/><polygon points="96,100 108,88 120,100 108,108" fill="#ff7a2a"/>' +
      A(.8, B('<ellipse cx="108" cy="62" rx="34" ry="16" fill="#8a8a8a"/><ellipse cx="134" cy="74" rx="26" ry="12" fill="#9a9a9a"/><ellipse cx="84" cy="74" rx="24" ry="11" fill="#9a9a9a"/>')) +
      A(1.6, [0, 1, 2].map(k => R(36 + k * 28, 180, 22, 20, '#bdb2a0')).join('')) +
      A(2.2, colosseo(300, 200, 150, 105)) +
      TX(108, 34, 22, '79 d.C.', .3) + TX(108, 154, 15, 'Vesuvio', 1.2) + TX(70, 226, 15, 'Pompei', 1.8) + TX(300, 66, 18, 'il Colosseo', 2.6) + TX(300, 228, 14, 'Anfiteatro Flavio', 3.2),

      /* 3 · limes e muro di Adriano */
      cielo('#ffe9b8', '#fff6df') + R(0, 100, 400, 140, '#a9cf7a') +
      '<path class="w" d="M0,150Q100,120 200,150T400,130" stroke="#b99a6b" stroke-width="14" fill="none" pathLength="1000"/>' +
      A(1.6, R(92, 117, 16, 32, '#a98a5b') + R(192, 132, 16, 32, '#a98a5b') + R(292, 142, 16, 32, '#a98a5b')) +
      A(2, omino(44, 126, '#8a6a4a', .6, '#f2c9a0', 1) + omino(80, 128, '#8a6a4a', .6)) +
      A(2.6, omino(240, 215, '#b8322b', .9) + scudo(252, 184, 14, 20, '#b8322b') + omino(300, 215, '#b8322b', .9)) +
      TX(200, 32, 20, '117 d.C. · massima estensione', .3) + TX(62, 94, 15, 'barbari', 2) + TX(200, 120, 18, 'il limes', 1.2) + TX(120, 232, 14, 'in Britannia: il lungo muro di Adriano', 3.2).replace('x="120"', 'x="200"'),

      /* 4 · pesce dei cristiani; 313; 380 */
      cielo('#e0f0ff', '#f6fbff') +
      '<g fill="none" stroke="#2a6fb0" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"><path class="w" d="M90,100Q190,28 290,100L322,70M90,100Q190,172 290,100L322,130" pathLength="1000"/></g>' +
      A(1.4, '<circle cx="132" cy="92" r="5" fill="#2a6fb0"/>') +
      A(2, R(16, 164, 176, 60, '#fff', 'rx="12" stroke="#8a6a4a" stroke-width="3"') + tt(104, 190, 17, '313 · Costantino') + tt(104, 212, 14, 'liberi di pregare')) +
      A(3, R(208, 164, 176, 60, '#fff', 'rx="12" stroke="#8a6a4a" stroke-width="3"') + tt(296, 190, 17, '380 · Teodosio') + tt(296, 212, 13, 'religione ufficiale')) +
      TX(200, 34, 22, 'il simbolo del pesce', .3),

      /* 5 · impero diviso: Occidente e Oriente; Visigoti */
      cielo('#fde2c4', '#fff3e6') +
      `<path d="M200,0H382a18,18 0 0 1 18,18V222a18,18 0 0 1-18,18H200z" fill="#d6e8ff"/>` +
      R(0, 190, 400, 50, 'rgba(120,150,90,.35)') +
      A(.8, tempio(100, 180, 3, 24, 40, '#efe6d2', '#c9774a')) + A(1.4, cupole(300, 180, 1.1)) +
      '<line x1="200" y1="50" x2="200" y2="190" stroke="#1d2433" stroke-width="3" stroke-dasharray="7 6"/>' +
      TX(200, 30, 18, '395: impero diviso in due', .3) + TX(100, 72, 22, 'Occidente', 1) +
      TX(300, 72, 22, 'Oriente', 1.8) + TX(300, 196, 15, 'Costantinopoli', 2.2) + TX(300, 213, 13, 'oggi Istanbul', 2.6) + TX(200, 233, 13, '410 · Visigoti di Alarico saccheggiano Roma', 3.6),

      /* 6 · 476: Odoacre depone Romolo Augusto; l'Oriente dura */
      cielo('#e3d4f3', '#f7efff') + R(0, 190, 400, 50, '#c9b48a') +
      A(.8, omino(70, 190, '#7b4ea3', .9, '#f2c9a0')) + A(1.4, omino(150, 190, '#8a6a4a', 1, '#f2c9a0')) + A(2, corona(108, 200, 1.2)) +
      A(2.6, cupole(314, 160, .9)) + frecciaD(256, 376, 178, '#3d7fd6') +
      TX(200, 30, 24, '476 d.C.', .3) + TX(125, 64, 14, 'l\'ultimo imperatore d\'Occidente', 1) +
      TX(62, 216, 13, 'Romolo Augusto', 3) + TX(155, 216, 13, 'Odoacre', 3.2) +
      TX(314, 90, 15, 'Impero d\'Oriente', 3.4) + TX(314, 207, 14, 'quasi mille anni', 4),
    ],

    'vita-romana': [
      /* 0 · latino e lingue neolatine; tavoletta di cera */
      cielo('#fff3d6', '#fffbee') +
      A(.4, R(26, 80, 108, 44, '#b8322b', 'rx="14"') + `<text x="80" y="110" font-size="22" font-weight="900" text-anchor="middle" fill="#fff">latino</text>`) +
      ['italiano', 'francese', 'spagnolo', 'portoghese', 'rumeno'].map((n, k) => `<path class="w" style="--d:${1 + k * .35}s" d="M136,102L228,${48 + k * 28}" stroke="#b8322b" stroke-width="3" fill="none" pathLength="1000"/>` + A(1.4 + k * .35, R(232, 30 + k * 28, 138, 26, '#fff', 'rx="13" stroke="#e0c9a0" stroke-width="2"') + tt(301, 49 + k * 28, 17, n))).join('') +
      TX(301, 196, 15, 'lingue neolatine', 3.2) +
      A(3.4, R(24, 150, 110, 62, '#8a5a2b', 'rx="6"') + R(32, 158, 94, 46, '#d8c27a', 'rx="3"') + '<path d="M40,172h70M40,184h56M40,196h64" stroke="#8a5a2b" stroke-width="2"/>') +
      '<path class="w" style="--d:3.8s" d="M112,176L150,138" stroke="#555" stroke-width="4" pathLength="1000"/>' +
      TX(130, 232, 14, 'tavolette di cera con lo stilo', 4),

      /* 1 · numeri romani */
      cielo('#e8f1ff', '#f7fbff') +
      [['I', 1], ['V', 5], ['X', 10], ['L', 50], ['C', 100]].map(([l, v], k) => A(.4 + k * .4, R(22 + k * 74, 58, 66, 84, '#fff', 'rx="10" stroke="#c9a77c" stroke-width="3"') + tt(55 + k * 74, 106, 40, l) + tt(55 + k * 74, 132, 13, 'vale ' + v))).join('') +
      T(200, 204, 32, 'X + V = XV = 15', 3, 'text-anchor="middle" font-weight="900" fill="#b8322b"') +
      TX(200, 34, 20, 'i numeri con le lettere', .2),

      /* 2 · il foro e le terme */
      cielo('#cfe9ff', '#f4f8ff') + R(0, 190, 400, 50, '#d8c9a8') +
      `<path d="M200,0H382a18,18 0 0 1 18,18V222a18,18 0 0 1-18,18H200z" fill="#e6f4ee"/>` + R(200, 190, 188, 50, '#cfe3d8') +
      A(.5, tempio(100, 180, 3, 26, 44, '#efe6d2', '#c9774a')) +
      A(1.2, R(14, 150, 38, 30, '#c2452d') + R(14, 180, 38, 10, '#8a5a2b') + R(150, 150, 38, 30, '#3d7fd6') + R(150, 180, 38, 10, '#8a5a2b')) +
      A(1.8, R(216, 128, 84, 52, '#7ec8f0', 'stroke="#6b7480" stroke-width="3"') + R(306, 128, 76, 52, '#f6b78a', 'stroke="#6b7480" stroke-width="3"') + tt(258, 160, 14, 'fredda') + tt(344, 160, 14, 'calda')) +
      A(2.4, B('<path d="M330,120q-6,-10 0,-18q6,-8 0,-16M350,120q-6,-10 0,-18q6,-8 0,-16" stroke="#aab" stroke-width="3" fill="none"/>')) + A(2.8, '<text x="236" y="104" font-size="30">🌳</text>') +
      TX(100, 36, 22, 'il foro', .3) + TX(300, 36, 22, 'le terme', .6) + TX(100, 228, 14, 'templi e botteghe', 3) + TX(300, 228, 14, 'palestre e giardini', 3.4),

      /* 3 · insulae e domus */
      cielo('#cfe9ff', '#f4f8ff') + R(0, 200, 400, 40, '#d8c9a8') +
      A(.4, R(40, 56, 110, 144, '#c97a5a', 'stroke="#8a4a32" stroke-width="3"') + [0, 1, 2, 3].map(r => [0, 1, 2].map(c => R(54 + c * 32, 68 + r * 32, 16, 20, '#4a2f1a')).join('')).join('')) +
      A(1.6, B('<circle cx="70" cy="116" r="5" fill="#f2c9a0"/>')) +
      A(1.8, R(214, 120, 172, 80, '#f0dcb4', 'stroke="#a07c4c" stroke-width="3"') + R(214, 120, 70, 80, '#f0dcb4', 'stroke="#a07c4c" stroke-width="3"') + R(316, 120, 70, 80, '#f0dcb4', 'stroke="#a07c4c" stroke-width="3"') + '<polygon points="206,120 249,92 292,120" fill="#c9774a"/><polygon points="308,120 351,92 394,120" fill="#c9774a"/>' + R(284, 150, 32, 50, '#9ad0e6') + '<ellipse cx="300" cy="190" rx="10" ry="5" fill="#4aa3df"/><path d="M300,186v-22M290,170q10,-14 20,0" stroke="#3f8a3a" stroke-width="3" fill="none"/>' + R(235, 168, 14, 32, '#4a2f1a') + R(337, 168, 14, 32, '#4a2f1a')) +
      TX(95, 36, 22, 'le insulae', .3) + TX(95, 226, 14, 'gente comune', 1.2) + TX(300, 36, 22, 'la domus', 1) + TX(300, 226, 14, 'ricchi · casa con cortile', 2),

      /* 4 · acquedotti e via Appia */
      cielo('#cfe9ff', '#eef6ff') +
      '<polygon points="0,120 50,50 100,120" fill="#8aa0b8"/><polygon points="44,62 50,50 56,62 50,66" fill="#fff"/>' +
      R(0, 120, 400, 120, '#9bcf6f') +
      A(.6, R(60, 78, 280, 8, '#b99a6b') + R(60, 92, 280, 28, '#d1b182', 'stroke="#a07c4c" stroke-width="2"') + Array.from({ length: 8 }, (_, k) => `<path d="M${73 + k * 33},120v-14a10,10 0 0 1 20,0v14z" fill="#9bcf6f"/>`).join('') + R(60, 86, 280, 6, '#b99a6b')) +
      '<path class="w" style="--d:1.2s" d="M62,84H338" stroke="#4aa3df" stroke-width="5" pathLength="1000"/>' +
      A(1.6, R(336, 96, 24, 24, '#d9a066') + '<polygon points="332,96 348,80 364,96" fill="#b8553a"/>') +
      R(0, 168, 400, 44, '#a9a9b0') + R(0, 168, 400, 4, '#7a7a82') + R(0, 208, 400, 4, '#7a7a82') +
      TX(32, 196, 14, 'Roma', 2) + TX(200, 196, 15, 'via Appia', 2.4) + TX(358, 196, 14, 'Brindisi', 2.8) +
      TX(200, 34, 18, 'acquedotti: acqua dalle montagne', .3).replace('x="200"', 'x="200"') + TX(200, 232, 15, 'la regina delle strade', 3.4),

      /* 5 · Colosseo e Circo Massimo */
      cielo('#ffe9b8', '#fff6df') +
      `<path d="M200,0H382a18,18 0 0 1 18,18V222a18,18 0 0 1-18,18H200z" fill="#f6d9a0"/>` + R(0, 190, 400, 50, '#d9c59a') +
      A(.4, colosseo(100, 170, 160, 100)) +
      A(1.2, omino(70, 214, '#9a9aa5', .8) + scudo(80, 184, 12, 18, '#b8322b') + omino(130, 214, '#c0392b', .8) + scudo(112, 184, 12, 18, '#3d7fd6')) +
      A(1.8, B(cavallo(300, 166, '#a0825a') + cavallo(284, 168, '#8a6a46'))) +
      A(2.4, '<path d="M236,178L268,170" stroke="#5b3a1e" stroke-width="3"/><rect x="204" y="162" width="34" height="24" rx="4" fill="#b8322b"/><circle cx="214" cy="192" r="9" fill="#5b3a1e"/><circle cx="232" cy="192" r="9" fill="#5b3a1e"/>' + omino(220, 166, '#3d7fd6', .5)) +
      TX(100, 34, 20, 'il Colosseo', .3) + TX(100, 226, 14, 'gladiatori', 1.4) + TX(300, 34, 20, 'Circo Massimo', 1) + TX(300, 226, 14, 'corse dei carri', 2.2) + TX(300, 208, 13, '2 o 4 cavalli', 2.8),

      /* 6 · legioni e Mare Nostrum */
      cielo('#bfe3ff', '#e8f6ff') + R(0, 70, 400, 120, '#3d9bd6') +
      '<path d="M0,0H400V70Q330,92 250,70T100,78T0,66z" fill="#c9b48a"/><path d="M0,240H400V196Q320,176 240,194T90,184T0,198z" fill="#c9b48a"/>' +
      '<path class="w" d="M0,66Q40,84 100,78T250,70T400,70" stroke="#d6453d" stroke-width="5" fill="none" pathLength="1000"/><path class="w" style="--d:1s" d="M0,198Q40,184 90,184T240,194T400,196" stroke="#d6453d" stroke-width="5" fill="none" pathLength="1000"/>' +
      Array.from({ length: 8 }, (_, k) => A(.4 + k * .15, scudo(16 + (k % 4) * 26, 14 + ((k / 4) | 0) * 24, 20, 20, '#b8322b'))).join('') +
      A(2.2, B(`<text x="200" y="146" font-size="36" font-weight="900" text-anchor="middle" fill="#fff" stroke="#1d5a8a" stroke-width="4" paint-order="stroke">Mare Nostrum</text>`)) +
      TX(175, 38, 15, 'legioni', 1.6) + TX(300, 168, 16, 'il nostro mare', 3) + TX(200, 232, 14, 'conquistano tutte le coste', 3.6),
    ]
  });
})();
