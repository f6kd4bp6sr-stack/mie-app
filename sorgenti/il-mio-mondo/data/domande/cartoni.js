/* 🎨 cartoni della serie: una scena disegnata per ogni frase del racconto (le parole restano quelle verificate in SPIEGA).
   Classi: a = compare (--d ritardo), w = si disegna il tratto, b = respira, m = cammina. Pilota: Torino romana. */
var CH; /* aiutanti di disegno condivisi: CH.T testo, CH.cielo, CH.capanna, CH.torre, CH.porta */
const CARTONI = (() => {
  const T = (x, y, s, t, d, extra) => '<text class="a" style="--d:' + d + 's" x="' + x + '" y="' + y + '" font-size="' + s + '" ' + (extra || '') + '>' + t + '</text>';
  const cielo = (a, b) => '<defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + a + '"/><stop offset="1" stop-color="' + b + '"/></linearGradient></defs><rect width="400" height="240" rx="18" fill="url(#cg)"/>';
  const capanna = (x, d) => '<g class="a" style="--d:' + d + 's"><rect x="' + (x - 14) + '" y="168" width="28" height="22" fill="#a7743f"/><polygon points="' + (x - 20) + ',170 ' + x + ',140 ' + (x + 20) + ',170" fill="#d9b25c"/><rect x="' + (x - 4) + '" y="176" width="8" height="14" fill="#5b3a1e"/></g>';
  const torre = (x, y, h, c) => '<rect x="' + x + '" y="' + y + '" width="34" height="' + h + '" fill="' + c + '"/>' + [7, 15, 23].map(k => '<line x1="' + (x + k + 2) + '" y1="' + y + '" x2="' + (x + k + 2) + '" y2="' + (y + h) + '" stroke="rgba(0,0,0,.18)"/>').join('') + '<rect x="' + (x + 12) + '" y="' + (y + 18) + '" width="10" height="14" rx="5" fill="#3b2a1e"/><rect x="' + (x + 12) + '" y="' + (y + 50) + '" width="10" height="14" rx="5" fill="#3b2a1e"/>';
  const porta = (x, y, c, cls) => '<g class="' + cls + '">' + torre(x, y, 110, c) + torre(x + 156, y, 110, c) +
    '<rect x="' + (x + 34) + '" y="' + (y + 22) + '" width="122" height="88" fill="' + c + '"/>' +
    [[x + 40, 18, 30], [x + 62, 30, 46], [x + 98, 30, 46], [x + 132, 18, 30]].map(([ax, w, h]) => '<path d="M' + ax + ',' + (y + 110) + 'v-' + (h - w / 2) + 'a' + w / 2 + ',' + w / 2 + ' 0 0 1 ' + w + ',0v' + (h - w / 2) + 'z" fill="#2b1d14"/>').join('') +
    [0, 1, 2, 3, 4, 5].map(k => '<rect x="' + (x + 44 + k * 18) + '" y="' + (y + 32) + '" width="10" height="14" rx="5" fill="#2b1d14"/>').join('') + '</g>';
  const pianta = '<rect class="w" x="110" y="40" width="180" height="170" fill="#f3e3c3" stroke="#7a4b2a" stroke-width="6" pathLength="1000"/>';
  CH = { T, cielo, capanna, torre, porta };
  return {
    torino: [
      /* 0 · Taurini: villaggio tra le montagne e i fiumi */
      cielo('#bfe3ff', '#e9f6ff') +
      '<polygon points="0,150 60,70 110,130 170,50 240,140 300,60 360,120 400,90 400,170 0,170" fill="#8aa0b8"/><polygon points="52,80 60,70 68,80 60,84" fill="#fff"/><polygon points="160,62 170,50 180,62 170,66" fill="#fff"/><polygon points="290,72 300,60 310,72 300,76" fill="#fff"/>' +
      '<rect y="168" width="400" height="72" fill="#8cc56b"/>' +
      '<path class="w" d="M0,214 C90,200 180,226 260,208 S360,200 400,206" stroke="#3d8fd6" stroke-width="9" fill="none" pathLength="1000"/>' +
      capanna(120, .6) + capanna(170, 1) + capanna(220, 1.4) + capanna(270, 1.8) +
      '<g class="b"><circle cx="170" cy="132" r="5" fill="#ddd"/><circle cx="176" cy="122" r="7" fill="#e8e8e8"/></g>' +
      T(200, 36, 24, 'i Taurini', 2.2, 'text-anchor="middle" font-weight="900" fill="#1d2433"') +
      T(200, 232, 14, 'Taurini → Torino', 3.2, 'text-anchor="middle" font-weight="800" fill="#1d2433"'),

      /* 1 · Augusta Taurinorum: i Romani tracciano la città quadrata */
      cielo('#ffe2a8', '#fff4dc') + '<rect y="150" width="400" height="90" fill="#b9d98a"/>' +
      '<path class="w" d="M120,190 L120,90 L280,90 L280,190 Z" fill="rgba(255,255,255,.25)" stroke="#9b5b34" stroke-width="8" pathLength="1000"/>' +
      [[120, 90], [280, 90], [120, 190], [280, 190]].map(([x, y], k) => '<rect class="a" style="--d:' + (1.6 + k * .2) + 's" x="' + (x - 10) + '" y="' + (y - 14) + '" width="20" height="24" fill="#9b5b34"/>').join('') +
      '<g class="a" style="--d:.3s"><g class="b"><line x1="60" y1="210" x2="60" y2="120" stroke="#6b4a2a" stroke-width="5"/><text x="60" y="122" font-size="34" text-anchor="middle">🦅</text></g></g>' +
      T(200, 40, 22, 'Augusta Taurinorum', 2.4, 'text-anchor="middle" font-weight="900" fill="#1d2433"') +
      T(200, 222, 15, 'circa 2000 anni fa · al tempo di Augusto', 3, 'text-anchor="middle" font-weight="800" fill="#1d2433"'),

      /* 2 · la scacchiera: cardo nord-sud, decumano est-ovest (oggi via Garibaldi) */
      cielo('#dff1e4', '#f6fbf7') + pianta +
      [1, 2, 3, 4, 5].map(k => '<line class="a" style="--d:' + (.8 + k * .1) + 's" x1="' + (110 + k * 30) + '" y1="40" x2="' + (110 + k * 30) + '" y2="210" stroke="#c9a77c" stroke-width="2"/>').join('') +
      [1, 2, 3, 4].map(k => '<line class="a" style="--d:' + (1.3 + k * .1) + 's" x1="110" y1="' + (40 + k * 34) + '" x2="290" y2="' + (40 + k * 34) + '" stroke="#c9a77c" stroke-width="2"/>').join('') +
      '<line class="w" style="--d:2s" x1="200" y1="40" x2="200" y2="210" stroke="#d6453d" stroke-width="7" pathLength="1000"/>' +
      '<line class="w" style="--d:3.2s" x1="110" y1="125" x2="290" y2="125" stroke="#e8a317" stroke-width="7" pathLength="1000"/>' +
      T(208, 58, 14, 'cardo ↕', 2.6, 'font-weight="900" fill="#b8322b"') +
      T(298, 120, 14, 'decumano ↔', 3.8, 'font-weight="900" fill="#a86f00"') +
      T(200, 230, 14, 'decumano = oggi via Garibaldi', 4.6, 'text-anchor="middle" font-weight="800" fill="#1d2433"') +
      '<g class="a" style="--d:.4s" font-weight="900" font-size="13" text-anchor="middle" fill="#1d2433"><text x="50" y="62">N</text><text x="50" y="118">S</text><text x="22" y="92">O</text><text x="78" y="92">E</text><line x1="50" y1="68" x2="50" y2="106" stroke="#1d2433" stroke-width="2"/><line x1="30" y1="88" x2="70" y2="88" stroke="#1d2433" stroke-width="2"/></g>',

      /* 3 · la Porta Palatina con le due torri a sedici lati */
      cielo('#cfe6ff', '#eef6ff') + '<rect y="200" width="400" height="40" fill="#cdbb9c"/>' +
      porta(60, 90, '#c0623a', 'a') +
      '<g class="a" style="--d:1.6s"><polygon points="361.4,64.2 356.6,75.8 347.8,84.6 336.2,89.4 323.8,89.4 312.2,84.6 303.4,75.8 298.6,64.2 298.6,51.8 303.4,40.2 312.2,31.4 323.8,26.6 336.2,26.6 347.8,31.4 356.6,40.2 361.4,51.8" fill="#f0c2a8" stroke="#7a3a1e" stroke-width="2.5" stroke-linejoin="miter"/>' +
      '<text x="330" y="108" font-size="12" text-anchor="middle" font-weight="800" fill="#1d2433">dall\'alto:</text><text x="330" y="124" font-size="13" text-anchor="middle" font-weight="900" fill="#1d2433">16 lati</text>' +
      '<path d="M310,128 Q270,140 252,108" stroke="#1d2433" stroke-width="2" fill="none" stroke-dasharray="4 4"/></g>' +
      T(155, 40, 22, 'Porta Palatina', 2.4, 'text-anchor="middle" font-weight="900" fill="#1d2433"'),

      /* 4 · Palazzo Madama nasconde la porta romana a est */
      cielo('#ffe9d6', '#fff7ef') + '<rect y="196" width="400" height="44" fill="#d9cdb6"/>' +
      '<g class="pm"><rect x="70" y="80" width="230" height="116" fill="#f2ecdf" stroke="#b9ab90" stroke-width="2"/>' +
      [0, 1, 2, 3, 4, 5, 6].map(k => '<rect x="' + (84 + k * 30) + '" y="96" width="14" height="80" fill="#e2d8c4"/>').join('') +
      '<rect x="62" y="70" width="246" height="12" fill="#e6dccb" stroke="#b9ab90" stroke-width="2"/></g>' +
      porta(90, 86, 'none', 'a ghost') +
      T(185, 36, 22, 'Palazzo Madama', .4, 'text-anchor="middle" font-weight="900" fill="#1d2433"') +
      T(312, 150, 13, '← porta est', 3.4, 'font-weight="900" fill="#b8322b"') + T(312, 166, 13, 'della città', 3.4, 'font-weight="900" fill="#b8322b"') +
      T(185, 228, 14, 'piazza Castello · dentro: una porta romana', 3.8, 'text-anchor="middle" font-weight="800" fill="#1d2433"')
    ]
  };
})();
