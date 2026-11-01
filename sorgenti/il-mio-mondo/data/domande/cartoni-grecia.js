/* cartoni della serie: episodi (grecia) — scritti da un agente, controllati dal revisore */
(() => {
  const { T, cielo, capanna } = CH;
  const K = '#1d2433', SK = '#f0c29a';
  const L = (x, y, s, t, d, col) => T(x, y, s, t, d, 'text-anchor="middle" font-weight="900" fill="' + (col || K) + '"');
  const G = (d, inner) => '<g class="a" style="--d:' + d + 's">' + inner + '</g>';
  const mare = (y, c1, c2) => '<rect y="' + y + '" width="400" height="' + (240 - y) + '" fill="' + c1 + '"/>' + [0, 1, 2].map(k => '<path d="M0,' + (y + 14 + k * 18) + ' q25,-8 50,0 t50,0 t50,0 t50,0 t50,0 t50,0 t50,0 t50,0" stroke="' + c2 + '" stroke-width="3" fill="none" opacity=".7"/>').join('');
  /* tempio dorico: x sinistra, y base, w larghezza, n colonne */
  const tI = (x, y, w, n, c) => {
    c = c || '#f4ead6';
    const h = w * .3 + 6, e = Math.max(3, h * .13), p = h * .42, top = y - h, cw = Math.min(8, (w - 10) / (n - 1) * .55) / 2;
    let s = '<rect x="' + (x - 10) + '" y="' + (y + 5) + '" width="' + (w + 20) + '" height="5" fill="#c4b390"/><rect x="' + (x - 6) + '" y="' + y + '" width="' + (w + 12) + '" height="5" fill="#d4c4a2"/>';
    s += '<rect x="' + (x + 3) + '" y="' + top + '" width="' + (w - 6) + '" height="' + h + '" fill="#8a7a5e" opacity=".6"/>';
    for (let i = 0; i < n; i++) {
      const cx = x + 5 + i * (w - 10) / (n - 1);
      s += '<polygon points="' + (cx - cw) + ',' + (top + 3) + ' ' + (cx + cw) + ',' + (top + 3) + ' ' + (cx + cw * .85) + ',' + y + ' ' + (cx - cw * .85) + ',' + y + '" fill="' + c + '"/><rect x="' + (cx - cw - 1.5) + '" y="' + top + '" width="' + (cw * 2 + 3) + '" height="3" fill="' + c + '"/>';
    }
    s += '<rect x="' + (x - 3) + '" y="' + (top - e) + '" width="' + (w + 6) + '" height="' + e + '" fill="' + c + '" stroke="#b9a889" stroke-width=".6"/>';
    s += '<polygon points="' + (x - 5) + ',' + (top - e) + ' ' + (x + w / 2) + ',' + (top - e - p) + ' ' + (x + w + 5) + ',' + (top - e) + '" fill="' + c + '" stroke="#b9a889" stroke-width=".6"/>';
    s += '<polygon points="' + (x + w * .12) + ',' + (top - e - 1.5) + ' ' + (x + w / 2) + ',' + (top - e - p + 4) + ' ' + (x + w * .88) + ',' + (top - e - 1.5) + '" fill="#e0cfae"/>';
    return s;
  };
  const tempio = (x, y, w, n, d) => G(d, tI(x, y, w, n));
  /* persona semplice; o: b barba, c corona, h elmo, l veste lunga, w alloro */
  const uo = (x, y, c, s, d, o) => {
    o = o || '';
    let g = '<g transform="translate(' + x + ',' + y + ') scale(' + s + ')">';
    g += '<g stroke="' + SK + '" stroke-width="3.2" stroke-linecap="round"><line x1="-3" y1="-9" x2="-3" y2="0"/><line x1="3" y1="-9" x2="3" y2="0"/><line x1="-7" y1="-27" x2="-12" y2="-15"/><line x1="7" y1="-27" x2="12" y2="-15"/></g>';
    g += o.includes('l') ? '<polygon points="-7,-30 7,-30 10,-1 -10,-1" fill="' + c + '"/>' : '<polygon points="-7,-30 7,-30 9,-9 -9,-9" fill="' + c + '"/>';
    g += '<polygon points="-7,-30 7,-30 7,-26 -7,-26" fill="rgba(0,0,0,.12)"/><circle cy="-36" r="6.5" fill="' + SK + '"/>';
    if (!o.includes('h')) g += '<path d="M-6.5,-37 a6.5,6.5 0 0 1 13,0 z" fill="' + (o.includes('b') ? '#bdbdbd' : '#5b3a1e') + '"/>';
    g += '<circle cx="-2.2" cy="-36" r=".9" fill="#333"/><circle cx="2.2" cy="-36" r=".9" fill="#333"/>';
    if (o.includes('b')) g += '<path d="M-5,-34 q5,15 10,0 z" fill="#d6d6d6"/>';
    if (o.includes('c')) g += '<polygon points="-6,-41 -6,-48 -3,-44 0,-49 3,-44 6,-48 6,-41" fill="#f2c230"/>';
    if (o.includes('h')) g += '<path d="M-7,-36 a7,7 0 0 1 14,0 z" fill="#b87333"/><path d="M-4,-43 q4,-9 8,0 z" fill="#c0392b"/>';
    if (o.includes('w')) g += '<path d="M-6,-41 q6,-5 12,0" stroke="#3a8a3a" stroke-width="2" fill="none"/>';
    return G(d, g + '</g>');
  };
  const scI = (x, y, r, c) => '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + c + '" stroke="#7a5a1e" stroke-width="2"/><circle cx="' + x + '" cy="' + y + '" r="' + (r * .55) + '" fill="none" stroke="rgba(255,255,255,.7)" stroke-width="2"/><circle cx="' + x + '" cy="' + y + '" r="' + (r * .15) + '" fill="#7a5a1e"/>';
  const nvI = (x, y, s) => '<g transform="translate(' + x + ',' + y + ') scale(' + s + ')"><g class="b">' +
    [-30, -18, -6, 6, 18, 30].map(k => '<line x1="' + k + '" y1="2" x2="' + (k - 10) + '" y2="22" stroke="#6b4a2a" stroke-width="2.5"/>').join('') +
    '<line x1="0" y1="-4" x2="0" y2="-46" stroke="#6b4a2a" stroke-width="3"/><path d="M-20,-44 L20,-44 L18,-12 L-18,-12 z" fill="#f7f0de" stroke="#c9b98f"/><rect x="-18" y="-30" width="36" height="6" fill="#c0392b"/>' +
    '<path d="M-48,-8 Q-46,12 -26,12 L32,12 Q50,10 54,-10 Z" fill="#8a5a2e"/><polygon points="52,6 68,8 52,11" fill="#5b3a1e"/><path d="M-44,-2 Q0,6 52,-4" stroke="#f2c230" stroke-width="3" fill="none"/></g></g>';
  /* polis: collina, mura, case, tempio; fl = colore bandiera */
  const citta = (x, y, s, d, fl) => G(d, '<g transform="translate(' + x + ',' + y + ') scale(' + s + ')"><path d="M-62,0 Q-52,-30 -32,-34 L32,-34 Q52,-30 62,0 Z" fill="#c8b27f"/>' +
    '<rect x="-56" y="-12" width="112" height="12" fill="#b59a68"/>' + [-50, -36, -22, 8, 22, 36].map(k => '<rect x="' + k + '" y="-14" width="8" height="4" fill="#b59a68"/>').join('') +
    '<rect x="-46" y="-24" width="16" height="12" fill="#e8d3a0"/><rect x="26" y="-24" width="16" height="12" fill="#e8d3a0"/><rect x="-28" y="-26" width="14" height="14" fill="#f0dfb4"/><rect x="12" y="-26" width="14" height="14" fill="#f0dfb4"/>' +
    tI(-24, -34, 48, 4) + (fl ? '<line x1="50" y1="-12" x2="50" y2="-54" stroke="#6b4a2a" stroke-width="2.5"/><polygon points="50,-54 70,-48 50,-42" fill="' + fl + '"/>' : '') + '</g>');
  const ar = (x1, x2, y, c, d, w) => { const s = x2 > x1 ? 1 : -1; return '<path class="w" style="--d:' + d + 's" d="M' + x1 + ',' + y + ' L' + (x2 - s * 8) + ',' + y + '" stroke="' + c + '" stroke-width="' + (w || 6) + '" stroke-linecap="round" fill="none" pathLength="1000"/>' + G(d + .9, '<polygon points="' + x2 + ',' + y + ' ' + (x2 - s * 14) + ',' + (y - 9) + ' ' + (x2 - s * 14) + ',' + (y + 9) + '" fill="' + c + '"/>'); };
  const pin = (x, y, t, d) => G(d, '<circle cx="' + x + '" cy="' + y + '" r="6" fill="#d6453d" stroke="#fff" stroke-width="2"/>') + L(x, y - 12, 14, t, d + .2);
  const cav = (x, y, s, c, wood, d) => {
    const yy = wood ? y - 17 * s : y;
    let g = '<g transform="translate(' + x + ',' + yy + ') scale(' + s + ')">';
    g += '<path d="M-30,-40 q-16,6 -12,30" stroke="' + c + '" stroke-width="4" fill="none" stroke-linecap="round"/>';
    g += '<g stroke="' + c + '" stroke-width="5" stroke-linecap="round"><line x1="-24" y1="-26" x2="-26" y2="0"/><line x1="-14" y1="-26" x2="-12" y2="0"/><line x1="14" y1="-26" x2="12" y2="0"/><line x1="24" y1="-26" x2="27" y2="0"/></g>';
    g += '<ellipse cy="-34" rx="32" ry="15" fill="' + c + '"/><polygon points="16,-42 30,-72 44,-66 34,-34" fill="' + c + '"/><polygon points="32,-74 52,-70 64,-52 58,-48 46,-56 38,-62" fill="' + c + '"/><polygon points="34,-74 36,-84 41,-73" fill="' + c + '"/>';
    g += '<path d="M30,-74 q-10,10 -14,32" stroke="rgba(0,0,0,.35)" stroke-width="4" fill="none"/><circle cx="46" cy="-65" r="1.8" fill="#fff"/>';
    if (wood) g += '<path d="M-30,-40 h60 M-26,-30 h54 M22,-62 l-8,26" stroke="rgba(0,0,0,.28)" stroke-width="1.5" fill="none"/><rect x="-36" y="0" width="76" height="5" fill="#6b4a2a"/><circle cx="-22" cy="11" r="7" fill="#6b4a2a" stroke="#3b2a1e" stroke-width="2"/><circle cx="24" cy="11" r="7" fill="#6b4a2a" stroke="#3b2a1e" stroke-width="2"/>';
    return G(d, g + '</g>');
  };
  const scroll = (x, y, w, t, d) => G(d, '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="20" rx="8" fill="#f3e3c3" stroke="#a7743f" stroke-width="2"/>') + L(x + w / 2, y + 15, 14, t, d + .1);
  const ground = (y, c) => '<rect y="' + y + '" width="400" height="' + (240 - y) + '" fill="' + c + '"/>';
  const PAL = ['#c0392b', '#2f7fc8', '#e8a317', '#4a9d4a', '#8e5bb8', '#d9692b'];

  Object.assign(CARTONI, {
    grecia: [
      /* 0 · coste e isole del mar Egeo */
      cielo('#bfe8ff', '#f4fcff') + '<circle cx="345" cy="50" r="20" fill="#ffd54a"/>' + mare(112, '#8fd0f5', '#ffffff') +
      '<path d="M0,96 L38,92 L66,104 L88,118 L60,128 L0,134 Z" fill="#8cc56b"/><path d="M400,90 L352,96 L328,112 L338,126 L400,132 Z" fill="#c9b27c"/>' +
      '<ellipse cx="150" cy="122" rx="20" ry="8" fill="#8cc56b"/><ellipse cx="214" cy="130" rx="14" ry="6" fill="#8cc56b"/><ellipse cx="274" cy="118" rx="18" ry="7" fill="#8cc56b"/>' +
      G(1.2, nvI(205, 168, 1.1)) + L(200, 34, 22, 'mar Egeo', .3) + L(200, 58, 14, 'dal 1000 a.C. circa', .8) + L(42, 86, 14, 'coste', 1.6) + L(214, 112, 14, 'isole', 1.8) + L(200, 230, 15, 'il mare è la loro strada', 2.8),

      /* 1 · le polis nascono: Atene e Sparta */
      cielo('#cfe9ff', '#f4faff') + ground(172, '#b9d98a') + citta(100, 186, 1.25, .5, '#d6453d') + citta(300, 186, 1.25, 1.2, '#2f7fc8') +
      L(200, 34, 22, 'le polis', .2) + L(200, 58, 14, 'verso il 700 a.C. · città-stato', .6) + L(100, 216, 17, 'Atene', 1.8) + L(300, 216, 17, 'Sparta', 2.4),

      /* 2 · 3 periodi, il primo è l'arcaico */
      cielo('#f6e7c1', '#fff6e0') + L(200, 34, 22, '3 periodi', .2) +
      G(.8, '<g transform="translate(78,100)"><path d="M-10,-30 q-18,0 -16,14" stroke="#c0623a" stroke-width="4" fill="none"/><path d="M10,-30 q18,0 16,14" stroke="#c0623a" stroke-width="4" fill="none"/><path d="M-8,-30 h16 l-2,6 q16,8 16,26 q0,22 -14,28 h-14 q-14,-6 -14,-28 q0,-18 16,-26 z" fill="#c0623a"/><path d="M-15,-6 h30 M-14,22 h28" stroke="#2b1d14" stroke-width="3"/><circle cy="2" r="3" fill="#2b1d14"/><path d="M0,5 v10 m-5,-6 h10 m-5,6 l-4,8 m4,-8 l4,8" stroke="#2b1d14" stroke-width="2" fill="none"/></g>') +
      G(.4, '<rect x="24" y="150" width="108" height="36" rx="10" fill="#d6453d"/>') + G(.8, '<rect x="146" y="150" width="108" height="36" rx="10" fill="#d9d9d9"/><rect x="268" y="150" width="108" height="36" rx="10" fill="#d9d9d9"/>') +
      L(78, 177, 22, '1', .6, '#fff') + L(200, 177, 22, '2', 1, '#8a8a8a') + L(322, 177, 22, '3', 1.2, '#8a8a8a') +
      L(200, 214, 15, 'il primo è il periodo arcaico', 2) + L(200, 232, 14, 'dalle origini fino al 480 a.C.', 3),

      /* 3 · periodo classico: Partenone e filosofi */
      cielo('#cfe6ff', '#f1f8ff') + ground(200, '#b9d98a') + '<path d="M20,200 L60,178 L260,178 L300,200 Z" fill="#b8a27a"/>' + tempio(75, 178, 170, 8, .5) +
      uo(335, 205, '#f5f0e6', 1.1, 2, 'bl') + uo(368, 205, '#e8d8b0', 1.1, 2.4, 'bl') +
      L(200, 34, 22, 'periodo classico', .2) + L(200, 58, 14, 'dal 480 al 323 a.C.', .7) + L(160, 226, 15, 'Partenone', 1.4) + L(350, 226, 15, 'filosofi', 2.6),

      /* 4 · Alessandro Magno e il periodo ellenistico */
      cielo('#fbe6b8', '#fff6df') + '<rect y="90" width="400" height="150" fill="#7cc4ec"/><path d="M72,100 Q200,86 400,96 L400,240 L72,240 Z" fill="#e8d3a0"/>' +
      ar(120, 352, 165, '#d6453d', 1.2, 6) + tempio(158, 150, 30, 3, 1.4) + tempio(235, 150, 30, 3, 2.2) + tempio(310, 150, 30, 3, 3) +
      '<circle cx="110" cy="165" r="7" fill="#2f7fc8" stroke="#fff" stroke-width="2"/>' +
      L(200, 34, 21, 'Alessandro Magno', .2) + T(300, 36, 24, '👑', .3) + L(200, 58, 14, 'muore nel 323 a.C.', .6) + L(110, 196, 14, 'Grecia', 1) + L(352, 196, 14, 'India', 3.4) + L(236, 196, 14, 'Oriente', 2.4) + L(200, 226, 14, 'la cultura greca si diffonde in Oriente', 3.8),

      /* 5 · 146 a.C.: i Romani, la cultura greca continua */
      cielo('#ffd9c9', '#fff2ea') + ground(190, '#cdbb9c') + tempio(30, 190, 170, 6, .3) +
      '<g class="a" style="--d:1.4s"><g class="b"><line x1="262" y1="190" x2="262" y2="96" stroke="#6b4a2a" stroke-width="4"/><text x="262" y="96" font-size="34" text-anchor="middle">🦅</text></g></g>' +
      uo(300, 190, '#f5f0e6', 1.2, 1.8, 'l') + G(1.8, '<rect x="292" y="148" width="14" height="26" rx="3" fill="#c0392b" stroke="#7a1f16" stroke-width="2" transform="rotate(8 299 160)"/>') +
      G(3.2, '<g opacity=".95">' + tI(345, 190, 40, 3) + '</g>') +
      L(200, 34, 24, '146 a.C.', .2) + L(200, 56, 14, 'conquistata dai Romani', 1.2) + L(115, 212, 14, 'Grecia', 1) + L(280, 212, 14, 'Romani', 2) + L(366, 212, 13, 'imitano', 3.4) + L(200, 232, 14, 'la cultura greca continua a vivere', 3.8)
    ],

    polis: [
      /* 0 · nasce la polis */
      cielo('#d9efff', '#f4faff') + ground(190, '#b9d98a') + citta(200, 190, 1.5, .4) +
      [70, 112, 288, 330].map((x, k) => uo(x, 222, PAL[k], 1, 1.4 + k * .3)).join('') +
      L(200, 34, 22, 'la polis', .2) + L(200, 58, 14, 'in Grecia, verso il 700 a.C.', .6) + L(200, 234, 14, 'un modo nuovo di vivere insieme', 2.8),

      /* 1 · città-stato, non un unico regno */
      cielo('#cfe9ff', '#f4faff') + ground(172, '#b9d98a') + citta(72, 188, .85, .5, '#d6453d') + citta(200, 188, .85, 1, '#e8a317') + citta(328, 188, .85, 1.5, '#2f7fc8') +
      L(200, 34, 22, 'città-stato', .2) + L(200, 58, 14, 'ogni città è come un piccolo Stato', 3) +
      L(72, 214, 15, 'Atene', 1.8) + L(200, 214, 15, 'Sparta', 2.2) + L(328, 214, 15, 'Corinto', 2.6) + L(200, 234, 14, 'non un unico regno', 3.6),

      /* 2 · stessa lingua e stessa religione */
      cielo('#dfe9ff', '#f7faff') + ground(198, '#b9d98a') +
      G(.4, '<g fill="#fff"><ellipse cx="200" cy="50" rx="72" ry="18"/><ellipse cx="156" cy="58" rx="36" ry="14"/><ellipse cx="246" cy="58" rx="36" ry="14"/></g><g fill="#ffe08a" stroke="#e8a317" stroke-width="2"><circle cx="168" cy="46" r="9"/><circle cx="200" cy="40" r="9"/><circle cx="232" cy="46" r="9"/></g>') +
      L(200, 94, 15, 'la religione: gli stessi dei', 1) +
      [70, 200, 330].map((x, k) => G(1.6 + k * .4, '<ellipse cx="' + x + '" cy="124" rx="34" ry="17" fill="#fff" stroke="#8a9bb8" stroke-width="2"/><polygon points="' + (x - 6) + ',139 ' + (x + 6) + ',139 ' + x + ',150" fill="#fff" stroke="#8a9bb8" stroke-width="2"/><rect x="' + (x - 8) + '" y="137" width="16" height="3" fill="#fff"/>') + L(x, 130, 15, 'Α Β Γ', 1.8 + k * .4, '#b8322b')).join('') +
      citta(70, 226, .55, 2.2) + citta(200, 226, .55, 2.6) + citta(330, 226, .55, 3) + L(200, 172, 14, 'la lingua greca', 3.4),

      /* 3 · una comunità di cittadini */
      cielo('#fff1d6', '#fffaf0') + ground(190, '#d9c59a') +
      '<rect class="w" style="--d:.4s" x="118" y="82" width="262" height="108" fill="none" stroke="#9b8a6a" stroke-width="3" pathLength="1000" opacity=".7"/>' + L(250, 78, 13, 'strade e mura', .6, '#7a6a4a') +
      L(200, 32, 19, '«una comunità di cittadini»', .3) +
      [170, 205, 240, 275, 310].map((x, k) => uo(x, 188, PAL[k], 1.05, 1.4 + k * .25)).join('') + uo(62, 196, '#f5f0e6', 1.5, .8, 'bl') +
      L(62, 220, 15, 'Aristotele', 1) + L(240, 214, 15, 'cittadini', 2.8),

      /* 4 · autonomia: leggi, organizzazione, moneta */
      cielo('#e5f0ff', '#f8fbff') + L(200, 38, 24, 'autonomia', .2) + L(200, 62, 14, 'ogni polis ha', .6) +
      [0, 1, 2].map(k => G(.8 + k * .8, '<rect x="' + (22 + k * 124) + '" y="78" width="112" height="108" rx="14" fill="#fff" stroke="#c9d6ea" stroke-width="2"/>')).join('') +
      G(1.2, '<g transform="translate(78,124)"><rect x="-32" y="-22" width="64" height="44" rx="5" fill="#f3e3c3" stroke="#a7743f" stroke-width="2"/><path d="M-22,-10 h44 M-22,0 h44 M-22,10 h30" stroke="#a7743f" stroke-width="2.5"/></g>') +
      '<text class="a" style="--d:2s" x="202" y="140" font-size="46" text-anchor="middle">🏛️</text>' +
      G(2.8, '<g transform="translate(326,124)"><circle r="26" fill="#f2c230" stroke="#b8860b" stroke-width="3"/><circle r="18" fill="none" stroke="#b8860b" stroke-width="2"/><rect x="-2.5" y="-11" width="5" height="22" fill="#b8860b"/><rect x="-9" y="-12" width="18" height="4" fill="#b8860b"/></g>') +
      L(78, 174, 14, 'leggi', 1.5) + L(202, 174, 14, 'organizzazione', 2.3) + L(326, 174, 14, 'moneta', 3.1) + L(200, 218, 16, 'La prima è l\'autonomia', 3.8),

      /* 5 · il territorio: città e campi */
      cielo('#bfe08f', '#d9eeb0') +
      [[16, 74, 70, 112], [314, 74, 70, 112], [100, 54, 200, 20], [100, 196, 200, 12]].map((f, k) => G(.3 + k * .15, '<rect x="' + f[0] + '" y="' + f[1] + '" width="' + f[2] + '" height="' + f[3] + '" fill="#e8d27a" stroke="#c9ac4a" stroke-width="2"/>' + (f[2] > f[3] ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19].map(i => i * 10 < f[2] ? '<line x1="' + (f[0] + i * 10) + '" y1="' + f[1] + '" x2="' + (f[0] + i * 10) + '" y2="' + (f[1] + f[3]) + '" stroke="#c9ac4a" stroke-width="2"/>' : '').join('') : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => '<line x1="' + f[0] + '" y1="' + (f[1] + i * 11) + '" x2="' + (f[0] + f[2]) + '" y2="' + (f[1] + i * 11) + '" stroke="#c9ac4a" stroke-width="2"/>').join('')))).join('') +
      G(.9, '<circle cx="200" cy="136" r="58" fill="#d9c9a6" stroke="#8a7a5e" stroke-width="5"/><rect x="176" y="118" width="48" height="36" fill="#f6efe0" stroke="#b9a889" stroke-width="2"/>' +
        [[214, 92], [230, 108], [150, 128], [152, 146], [170, 166], [188, 172], [212, 170], [232, 160]].map(h => '<rect x="' + h[0] + '" y="' + h[1] + '" width="14" height="12" fill="#c0623a"/>').join('') + tI(162, 106, 34, 3)) +
      L(200, 140, 13, 'agorà', 2) + L(51, 204, 14, 'campi', 2.4, '#5b4a1e') + L(349, 204, 14, 'campi', 2.4, '#5b4a1e') +
      '<rect class="w" style="--d:2.8s" x="8" y="46" width="384" height="172" rx="34" fill="none" stroke="#d6453d" stroke-width="4" pathLength="1000"/>' +
      L(200, 34, 20, 'il territorio', .3) + L(200, 234, 14, 'la città, con case e templi, e intorno i campi', 3.4),

      /* 6 · la comunità: riti e tradizioni */
      cielo('#ffe8c2', '#fff6e5') + ground(150, '#d9c59a') + tempio(150, 150, 100, 4, .3) +
      [90, 125, 160, 240, 275, 310].map((x, k) => uo(x, 214, PAL[k], 1.1, 1 + k * .2)).join('') +
      G(.8, '<rect x="186" y="168" width="28" height="22" fill="#cbbb99" stroke="#a89878" stroke-width="2"/>') +
      '<g class="a" style="--d:1.2s"><g class="b"><path d="M200,168 q-12,-14 0,-32 q12,18 0,32 z" fill="#f08a24"/><path d="M200,168 q-5,-8 0,-16 q5,8 0,16 z" fill="#ffd54a"/></g></g>' +
      L(200, 32, 22, 'la comunità', .2) + L(200, 56, 14, 'i cittadini si sentono parte della loro polis', 1.6) + L(200, 234, 14, 'cultura · tradizioni · riti religiosi', 2.8)
    ],

    greci: [
      /* 0 · Atena, Acropoli, Partenone, democrazia */
      cielo('#cfe6ff', '#f1f8ff') + ground(200, '#b9d98a') + '<path d="M170,200 L190,128 L368,128 L388,200 Z" fill="#b8a27a"/>' + tempio(198, 128, 160, 6, .5) +
      uo(70, 196, '#f7f7f7', 1.7, 1.2, 'hl') + G(1.4, '<line x1="100" y1="198" x2="100" y2="100" stroke="#6b4a2a" stroke-width="3"/><polygon points="100,92 95,106 105,106" fill="#b8b8b8"/>') +
      L(70, 218, 15, 'Atena', 1.6) + L(278, 26, 15, 'Partenone', 1.8) + L(279, 186, 14, 'Acropoli', 2.2) + L(225, 233, 14, 'democrazia: il governo del popolo', 3.2),

      /* 1 · voto riservato; Sparta guerrieri */
      cielo('#e3f0ff', '#fafcff') + ground(170, '#e8dcc0') + '<line x1="200" y1="20" x2="200" y2="230" stroke="#9aa6bb" stroke-width="2" stroke-dasharray="6 6"/>' +
      [50, 100, 150].map((x, k) => uo(x, 176, PAL[k], 1.1, .6 + k * .3, 'l') + T(x, 112, 24, '✓', 1.2 + k * .3, 'text-anchor="middle" font-weight="900" fill="#2e9d4a"')).join('') +
      L(100, 34, 18, 'votano solo', .3) + L(100, 206, 14, 'maschi · adulti · liberi', 2) +
      L(300, 34, 20, 'Sparta', 2) + L(300, 54, 14, 'guerrieri', 2.4) +
      uo(268, 176, '#c0392b', 1.4, 2.4, 'h') + G(2.6, '<line x1="300" y1="178" x2="300" y2="96" stroke="#6b4a2a" stroke-width="3"/><polygon points="300,88 295,102 305,102" fill="#b8b8b8"/>' + scI(248, 150, 14, '#d9a13a')) +
      uo(340, 176, '#c0392b', .75, 3, 'h') + G(3.2, scI(358, 156, 8, '#d9a13a')) + L(300, 206, 14, 'allenati fin da bambini', 3.4),

      /* 2 · Maratona, Termopili, Salamina */
      cielo('#c9e6fb', '#eef8ff') + L(200, 32, 18, 'i Greci vincono i Persiani', .2) +
      [0, 1, 2].map(k => G(.6 + k * .6, '<rect x="' + (14 + k * 130) + '" y="48" width="112" height="132" rx="14" fill="' + (k == 2 ? '#8fd0f5' : '#fff') + '" stroke="#9fb2cc" stroke-width="2"/>')).join('') +
      G(.9, scI(56, 96, 20, '#c0392b') + scI(86, 96, 20, '#d9a13a')) + G(1.5, scI(172, 84, 15, '#c0392b') + scI(200, 84, 15, '#c0392b') + scI(228, 84, 15, '#c0392b') + scI(186, 110, 15, '#d9a13a') + scI(214, 110, 15, '#d9a13a')) + G(2.1, nvI(330, 104, .72)) +
      L(70, 150, 15, 'Maratona', 1.2) + L(70, 169, 14, '490 a.C.', 1.4) + L(200, 150, 15, 'Termopili', 1.8) + L(200, 169, 14, '480 a.C.', 2) + L(330, 150, 15, 'Salamina', 2.4) + L(330, 169, 14, '480 a.C.', 2.6) +
      L(70, 202, 13, 'i Greci', 1.6) + L(70, 218, 13, 'vincono', 1.6) + L(200, 202, 13, 'Leonida e', 2.2) + L(200, 218, 13, '300 Spartani', 2.2) + L(330, 202, 13, 'la flotta', 2.8) + L(330, 218, 13, 'greca vince', 2.8),

      /* 3 · Zeus sul monte Olimpo */
      cielo('#4d5f94', '#b9c6ea') + '<polygon points="60,238 200,100 340,238" fill="#5f7a5a"/><polygon points="170,130 200,100 230,130 216,124 200,134 184,124" fill="#fff"/>' +
      G(.4, '<ellipse cx="200" cy="96" rx="52" ry="12" fill="#fff"/><ellipse cx="160" cy="100" rx="28" ry="9" fill="#fff"/><ellipse cx="244" cy="100" rx="28" ry="9" fill="#fff"/>') + uo(200, 96, '#fff', 1.4, .8, 'bl') +
      '<g class="a" style="--d:1.6s"><polygon points="218,54 210,76 216,75 211,90 224,66 218,67 224,54" fill="#ffd23f" stroke="#f0a000"/></g>' +
      '<g class="a" style="--d:2.2s"><g class="b"><polygon points="320,60 304,110 316,108 302,160 334,98 320,100 336,60" fill="#ffd23f" stroke="#f0a000" stroke-width="2"/></g></g>' +
      L(76, 52, 22, 'Zeus', .4, '#fff') + L(76, 74, 14, 're degli dei', 1, '#fff') + L(352, 150, 14, 'fulmini', 2.4, '#fff') + L(200, 200, 17, 'monte Olimpo', 2.8, '#fff') + L(200, 222, 13, 'il più alto della Grecia', 3.4, '#fff'),

      /* 4 · Omero, Iliade, Odissea, cavallo di legno */
      cielo('#ffe6c4', '#fff5e4') + ground(190, '#d9c59a') +
      G(.3, '<rect x="290" y="120" width="96" height="70" fill="#c9b79a" stroke="#a89878" stroke-width="2"/>' + [0, 1, 2, 3, 4, 5].map(k => '<rect x="' + (290 + k * 17) + '" y="112" width="11" height="9" fill="#c9b79a" stroke="#a89878" stroke-width="1.5"/>').join('') + '<path d="M322,190 v-22 q16,-14 32,0 v22 z" fill="#4a3a2a"/>') +
      L(338, 100, 14, 'Troia', .6) + uo(55, 190, '#e8e0cc', 1.4, .6, 'bl') + scroll(15, 62, 80, 'Iliade', 1.2) + scroll(15, 88, 80, 'Odissea', 1.8) +
      cav(185, 190, 1.5, '#b7794a', true, 2.6) + L(55, 212, 15, 'Omero', .9) + L(215, 232, 14, 'nel mito: un cavallo di legno', 3.2),

      /* 5 · Olimpiadi e teatro */
      cielo('#d8efff', '#f7fcff') + ground(172, '#b9d98a') + '<rect x="10" y="172" width="184" height="44" fill="#e3c08a"/>' + [1, 2].map(k => '<line x1="10" y1="' + (172 + k * 14.6) + '" x2="194" y2="' + (172 + k * 14.6) + '" stroke="#fff" stroke-width="2"/>').join('') +
      uo(60, 194, '#c0392b', 1.2, .8, 'w') + uo(110, 210, '#2f7fc8', 1.2, 1.2, 'w') + uo(160, 194, '#e8a317', 1.2, 1.6, 'w') +
      L(100, 34, 18, 'Olimpiadi', .3) + L(100, 56, 13, 'dal 776 a.C. a Olimpia', .8) + L(100, 74, 13, 'ogni 4 anni', 1.2) + L(100, 234, 13, 'in onore di Zeus', 2.2) +
      G(2.4, '<path d="M220,172 a80,80 0 0 1 160,0 z" fill="#c9b27c"/><path d="M238,172 a62,62 0 0 1 124,0 z" fill="#d9c59a"/><path d="M256,172 a44,44 0 0 1 88,0 z" fill="#e6d7b0"/><path d="M274,172 a26,26 0 0 1 52,0 z" fill="#f3e8c8"/>') +
      '<text class="a" style="--d:3s" x="300" y="170" font-size="26" text-anchor="middle">🎭</text>' + L(300, 34, 18, 'teatro', 2.6) + L(300, 56, 13, 'tragedie e commedie', 3.2) + L(300, 200, 13, 'si recitano', 3.6),

      /* 6 · alfabeto e Magna Grecia */
      cielo('#cde9f7', '#e9f5fb') + L(100, 34, 18, 'alfa e beta', .3) +
      G(.5, '<rect x="16" y="52" width="170" height="116" rx="14" fill="#fff6dc" stroke="#c9a77c" stroke-width="3"/>') + L(66, 116, 60, 'Α', 1, '#b8322b') + L(136, 116, 60, 'Β', 1.4, '#b8322b') + L(66, 150, 15, 'alfa', 1.6) + L(136, 150, 15, 'beta', 2) + L(100, 206, 22, 'alfabeto', 2.4) +
      G(.4, '<polygon points="240,12 256,30 263,47 279,59 292,68 304,88 314,110 322,132 313,156 323,160 338,150 349,125 335,98 353,73 377,95 381,85 367,66 343,51 328,24 326,12" fill="#c9d98a" stroke="#6b8a3a" stroke-width="2"/><polygon points="306,150 300,173 304,188 300,201 279,190 258,180 239,168 236,160 245,153 257,152 273,154 290,151" fill="#c9d98a" stroke="#6b8a3a" stroke-width="2"/>') +
      [[279, 59], [353, 73], [349, 125], [304, 186]].map((p, k) => G(3 + k * .3, '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="6" fill="#d6453d" stroke="#fff" stroke-width="2"/>')).join('') +
      L(330, 214, 14, 'Italia del sud', 3.2) + L(330, 233, 16, 'Magna Grecia', 3.8)
    ],

    pensatori: [
      /* 0 · filosofia: perché? */
      cielo('#efe3ff', '#fbf7ff') + ground(200, '#e6dcf5') + uo(70, 200, '#ffffff', 1.7, .3, 'bl') + L(70, 222, 14, 'i filosofi', .6) +
      G(1, '<circle cx="116" cy="136" r="6" fill="#fff" stroke="#b7a3e0" stroke-width="2"/><circle cx="130" cy="124" r="9" fill="#fff" stroke="#b7a3e0" stroke-width="2"/><ellipse cx="256" cy="98" rx="124" ry="52" fill="#fff" stroke="#b7a3e0" stroke-width="3"/>') +
      L(200, 28, 15, 'filosofia = amore per la sapienza', .3) + L(256, 90, 26, 'perché?', 1.4, '#6b3fb0') + L(256, 112, 14, 'come è fatto il mondo?', 2.4) + L(256, 132, 14, 'come si vive bene?', 3.2),

      /* 1 · Pitagora e la tavola pitagorica */
      cielo('#d9f0ff', '#f5fbff') + ground(200, '#cfe3a1') + uo(80, 198, '#ffffff', 1.6, .4, 'bl') + L(200, 32, 22, 'Pitagora', .2) + L(200, 54, 14, 'matematico e filosofo', .8) +
      [0, 1, 2].map(r => [0, 1, 2].map(c => G(1.2 + (r * 3 + c) * .2, '<rect x="' + (220 + c * 40) + '" y="' + (70 + r * 40) + '" width="40" height="40" fill="' + ((r + c) % 2 ? '#e6f0ff' : '#fff') + '" stroke="#7a9bd0" stroke-width="2"/>') + L(240 + c * 40, 97 + r * 40, 20, String((r + 1) * (c + 1)), 1.3 + (r * 3 + c) * .2)).join('')).join('') +
      L(280, 212, 13, 'tavola pitagorica', 3.4) + L(100, 232, 14, 'a Crotone, in Calabria', 2.6),

      /* 2 · Socrate, Platone, Aristotele */
      cielo('#e6f7e1', '#fafff7') + ground(176, '#d5e8b8') +
      uo(70, 178, '#e8e0cc', 1.5, .5, 'bl') + uo(200, 178, '#cfe0ff', 1.5, 1.2, 'bl') + uo(330, 178, '#ffe0cf', 1.5, 1.9, 'bl') +
      G(1.4, '<ellipse cx="100" cy="76" rx="26" ry="18" fill="#fff" stroke="#8a9bb8" stroke-width="2"/><polygon points="88,90 98,90 82,104" fill="#fff" stroke="#8a9bb8" stroke-width="2"/><rect x="87" y="88" width="12" height="3" fill="#fff"/>') + L(100, 86, 24, '?', 1.6, '#b8322b') +
      ar(166, 116, 142, '#8a6a3a', 2.4, 5) + ar(234, 284, 142, '#8a6a3a', 3, 5) + L(141, 130, 13, 'allievo di', 2.6) + L(259, 130, 13, 'maestro di', 3.2) +
      L(70, 202, 16, 'Socrate', .8) + L(200, 202, 16, 'Platone', 1.4) + L(330, 202, 16, 'Aristotele', 2) + L(200, 232, 14, 'Socrate fa domande a tutti, ma non scrive libri', 3.8),

      /* 3 · Archimede: Eureka! */
      cielo('#d8f0ff', '#f3fbff') + ground(176, '#e9dcc0') +
      '<path d="M110,132 h180 q0,56 -40,64 h-100 q-40,-8 -40,-64 z" fill="#d9b98a" stroke="#a7743f" stroke-width="3"/>' +
      '<rect x="182" y="120" width="36" height="42" rx="6" fill="' + SK + '"/><circle cx="200" cy="104" r="15" fill="' + SK + '"/><path d="M185,102 a15,15 0 0 1 30,0 q-15,-8 -30,0 z" fill="#5b3a1e"/><circle cx="195" cy="104" r="1.5" fill="#333"/><circle cx="205" cy="104" r="1.5" fill="#333"/><path d="M194,111 q6,5 12,0" stroke="#333" stroke-width="1.5" fill="none"/>' +
      '<path d="M118,152 h164 q0,36 -34,42 h-96 q-34,-6 -34,-42 z" fill="#6fc0ee" opacity=".9"/>' + G(1.6, '<path d="M114,138 h172 q0,48 -38,56 h-96 q-38,-8 -38,-56 z" fill="#6fc0ee" opacity=".95"/><path d="M122,138 q16,-6 32,0 t32,0 t32,0 t32,0 t24,0" stroke="#fff" stroke-width="3" fill="none"/>') +
      T(92, 130, 26, '↑', 1.6, 'text-anchor="middle" font-weight="900" fill="#2f7fc8"') + T(308, 130, 26, '↑', 1.8, 'text-anchor="middle" font-weight="900" fill="#2f7fc8"') +
      L(100, 40, 20, 'Archimede', .2) + L(100, 62, 14, 'a Siracusa', .5) +
      G(2.6, '<ellipse cx="306" cy="70" rx="78" ry="34" fill="#fff" stroke="#e8a317" stroke-width="3"/><polygon points="262,92 276,96 238,108" fill="#fff" stroke="#e8a317" stroke-width="3"/><rect x="262" y="88" width="16" height="10" fill="#fff"/>') + L(306, 70, 26, 'Eureka!', 2.8, '#b8322b') + L(306, 90, 14, 'ho trovato!', 3.2) + L(200, 226, 15, 'l\'acqua sale!', 2.2),

      /* 4 · Ippocrate: osservare e giuramento */
      cielo('#fff0e0', '#fffaf3') + ground(190, '#e0cfae') +
      '<rect x="40" y="154" width="150" height="14" fill="#a7743f"/><rect x="44" y="168" width="8" height="22" fill="#a7743f"/><rect x="178" y="168" width="8" height="22" fill="#a7743f"/><rect x="40" y="142" width="150" height="14" rx="6" fill="#f3e3c3"/>' +
      '<circle cx="62" cy="136" r="11" fill="' + SK + '"/><rect x="72" y="132" width="112" height="16" rx="8" fill="#9fc5e8"/>' +
      uo(214, 190, '#ffffff', 1.5, .8, 'bl') + T(214, 88, 22, '👁️', 1.8, 'text-anchor="middle"') +
      uo(332, 190, '#cfe0ff', 1.4, 2.2) + G(2.4, '<line x1="341" y1="152" x2="352" y2="124" stroke="' + SK + '" stroke-width="4" stroke-linecap="round"/>') +
      G(2.8, '<ellipse cx="332" cy="70" rx="56" ry="22" fill="#fff" stroke="#e8a317" stroke-width="2"/><polygon points="332,92 344,92 336,104" fill="#fff" stroke="#e8a317" stroke-width="2"/><rect x="331" y="90" width="14" height="3" fill="#fff"/>') + L(332, 76, 15, 'giuramento', 3) +
      L(110, 34, 20, 'Ippocrate', .2) + L(110, 56, 13, 'padre della medicina', .8) + L(115, 222, 14, 'osserva con cura il malato', 2.4) + L(332, 222, 14, 'nuovi medici', 3.4)
    ],

    alessandro: [
      /* 0 · Alessandro, Filippo II, Aristotele */
      cielo('#ffe9c9', '#fff7e8') + ground(188, '#d9c59a') +
      uo(80, 192, '#6b3fa0', 1.5, .5, 'bc') + uo(200, 192, '#c0392b', 1, 1.2) + uo(325, 192, '#f2efe6', 1.5, 1.9, 'bl') +
      L(200, 34, 22, 'Alessandro', .2) + L(80, 212, 15, 'Filippo II', .8) + L(80, 228, 13, 're della Macedonia', .9) + L(200, 212, 15, 'Alessandro', 1.4) + L(200, 228, 13, 'figlio', 1.5) + L(325, 212, 15, 'Aristotele', 2) + L(325, 228, 13, 'il suo maestro', 2.1),

      /* 1 · Bucefalo e il sole */
      cielo('#ffd9a8', '#fff0d6') + ground(190, '#c9b27c') +
      '<g class="b"><circle cx="345" cy="70" r="30" fill="#ffd54a"/>' + [0, 45, 90, 135, 180, 225, 270, 315].map(a => '<line x1="345" y1="70" x2="' + (345 + 46 * Math.cos(a * Math.PI / 180)) + '" y2="' + (70 + 46 * Math.sin(a * Math.PI / 180)) + '" stroke="#ffd54a" stroke-width="4" stroke-linecap="round"/>').join('') + '<circle cx="345" cy="70" r="30" fill="#ffd54a"/></g>' +
      G(2.8, '<ellipse cx="100" cy="196" rx="74" ry="8" fill="rgba(0,0,0,.28)"/>') + cav(190, 190, 1.5, '#3a2a22', false, .5) +
      uo(290, 190, '#c0392b', 1.1, 1.2) + G(1.6, '<path d="M276,158 Q250,150 262,118" stroke="#6b4a2a" stroke-width="2.5" fill="none"/>') +
      L(200, 34, 22, 'Bucefalo', .2) + L(200, 56, 14, 'lo gira verso il sole', 1.8) + L(200, 230, 14, 'così non vede la sua ombra', 3.2),

      /* 2 · 336 a.C.: re a 20 anni, parte con l'esercito */
      cielo('#d9ecff', '#f7fbff') + ground(190, '#d9c59a') +
      [34, 58, 82].map((x, k) => uo(x, 192, '#8a6a3a', 1, .8 + k * .2, 'h') + G(.9 + k * .2, '<line x1="' + (x + 14) + '" y1="194" x2="' + (x + 14) + '" y2="136" stroke="#6b4a2a" stroke-width="2.5"/>' + scI(x - 8, 172, 9, '#d9a13a'))).join('') +
      uo(130, 192, '#c0392b', 1.5, 1.4, 'c') + ar(168, 290, 150, '#d6453d', 2.4, 6) +
      G(1.6, '<rect x="300" y="122" width="70" height="68" fill="#c9b79a" stroke="#a89878" stroke-width="2"/>' + [0, 1, 2, 3].map(k => '<rect x="' + (300 + k * 20) + '" y="114" width="12" height="9" fill="#c9b79a" stroke="#a89878" stroke-width="1.5"/>').join('') + '<path d="M322,190 v-24 q13,-12 26,0 v24 z" fill="#4a3a2a"/><line x1="335" y1="114" x2="335" y2="92" stroke="#6b4a2a" stroke-width="2.5"/><polygon points="335,92 355,98 335,104" fill="#8e5bb8"/>') +
      L(200, 32, 22, '336 a.C.', .2) + L(200, 54, 14, 're, a soli 20 anni', .8) + L(58, 212, 13, 'esercito', 1.2) + L(130, 226, 14, 'Alessandro', 1.6) + L(335, 212, 13, 'impero persiano', 3.2),

      /* 3 · Dario III, un impero immenso */
      cielo('#bfe3f5', '#e9f6fb') +
      '<path d="M20,120 Q60,92 120,98 L200,92 Q300,88 392,104 L392,178 Q300,200 220,190 L130,196 Q60,190 24,170 Z" fill="#e8d3a0" stroke="#c9b27c" stroke-width="2"/>' +
      '<path class="a" style="--d:1s" d="M46,114 L150,98 L300,102 L380,114 L380,176 L300,190 L150,186 L50,168 Z" fill="rgba(214,69,61,.3)" stroke="#d6453d" stroke-width="3"/>' +
      pin(86, 142, 'Grecia', 1.4) + pin(150, 168, 'Egitto', 1.9) + pin(352, 140, 'India', 2.4) +
      L(250, 150, 15, 'impero immenso', 2.8, '#8b1e18') + L(200, 34, 20, 'sconfigge Dario III', .3) + T(342, 70, 28, '👑', .6) + L(200, 226, 16, 'Magno, cioè grande', 3.6),

      /* 4 · Alessandria: Faro e Biblioteca */
      cielo('#ffe3b0', '#fff6e0') + mare(150, '#7cc4ec', '#fff') + '<path d="M0,150 L200,150 L176,240 L0,240 Z" fill="#e8d3a0"/>' +
      tempio(20, 180, 120, 6, .6) + L(80, 232, 15, 'Biblioteca', 1.2) +
      '<ellipse cx="300" cy="198" rx="52" ry="12" fill="#e8d3a0"/>' +
      G(1.6, '<polygon points="282,198 318,198 314,150 286,150" fill="#f1e6d0" stroke="#b9a889" stroke-width="1.5"/><polygon points="288,150 312,150 309,112 291,112" fill="#f6edd8" stroke="#b9a889" stroke-width="1.5"/><polygon points="293,112 307,112 305,88 295,88" fill="#f1e6d0" stroke="#b9a889" stroke-width="1.5"/><rect x="294" y="76" width="12" height="12" fill="#ffd54a"/><polygon points="291,76 300,66 309,76" fill="#a7743f"/>') +
      '<g class="a" style="--d:2.4s"><g class="b"><polygon points="294,82 230,62 230,102" fill="rgba(255,213,74,.45)"/><polygon points="306,82 370,62 370,102" fill="rgba(255,213,74,.45)"/></g></g>' +
      L(290, 218, 15, 'il Faro', 2) + L(290, 234, 13, 'una delle sette meraviglie', 3) + L(200, 34, 22, 'Alessandria', .2),

      /* 5 · 323 a.C.: l'impero diviso tra i generali */
      cielo('#f0e4ff', '#fbf7ff') +
      [['#e8a317', 40], ['#3d8fd6', 122], ['#6bbf59', 204], ['#c05fb0', 286]].map((p, k) => G(.5 + k * .35, '<rect x="' + p[1] + '" y="74" width="74" height="66" rx="6" fill="' + p[0] + '" stroke="#fff" stroke-width="2"/>')).join('') +
      L(77, 112, 15, 'Egitto', 1.2) + [77, 159, 241, 323].map((x, k) => uo(x, 198, PAL[k], 1, 1.6 + k * .3, 'h')).join('') + L(77, 218, 14, 'Tolomeo', 3) +
      L(200, 34, 22, '323 a.C.', .2) + L(200, 56, 14, 'Alessandro muore a soli 32 anni', .6) + L(262, 231, 14, 'l\'impero va ai suoi generali', 2.8),

      /* 6 · età ellenistica: Pergamo e la pergamena */
      cielo('#e8f1ff', '#fafcff') + ground(192, '#cfe3a1') + '<path d="M20,200 L60,172 L200,172 L240,200 Z" fill="#b8a27a"/>' + tempio(75, 172, 110, 5, .5) +
      ar(250, 292, 140, '#d6453d', 2, 5) + L(268, 124, 13, 'il nome', 2) +
      G(2.6, '<rect x="302" y="104" width="76" height="92" fill="#f3e3c3" stroke="#a7743f" stroke-width="2"/><ellipse cx="340" cy="104" rx="44" ry="8" fill="#e6d3a8" stroke="#a7743f" stroke-width="2"/><ellipse cx="340" cy="196" rx="44" ry="8" fill="#e6d3a8" stroke="#a7743f" stroke-width="2"/><path d="M314,124 h52 M314,140 h52 M314,156 h52 M314,172 h36" stroke="#a7743f" stroke-width="2.5"/>') +
      L(200, 34, 22, 'età ellenistica', .2) + L(200, 56, 13, 'a Pergamo c\'è una grande biblioteca', .8) + L(130, 226, 16, 'Pergamo', 1.4) + L(340, 226, 16, 'pergamena', 3)
    ],

    italici: [
      /* 0 · tanti popoli: Veneti, Umbri */
      cielo('#d9efff', '#f5fbff') + ground(128, '#b9d98a') + L(200, 34, 22, 'tanti popoli diversi', .2) +
      [0, 1, 2, 3, 4, 5, 6, 7, 8].map(k => uo(40 + k * 40, 116, PAL[k % 6], .85, .6 + k * .15, k % 2 ? 'l' : '')).join('') +
      G(2.2, '<rect x="20" y="146" width="170" height="70" rx="14" fill="rgba(255,255,255,.85)" stroke="#8aa57a" stroke-width="2"/>') + G(2.8, '<rect x="210" y="146" width="170" height="70" rx="14" fill="rgba(255,255,255,.85)" stroke="#8aa57a" stroke-width="2"/>') +
      L(105, 174, 17, 'i Veneti', 2.4) + L(105, 202, 17, '→ il Veneto', 2.6, '#b8322b') + L(295, 174, 17, 'gli Umbri', 3) + L(295, 202, 17, '→ l\'Umbria', 3.2, '#b8322b'),

      /* 1 · Umbri a est del Tevere, Etruschi a ovest */
      cielo('#dff1ff', '#f6fbff') + '<rect y="96" width="200" height="144" fill="#cfe3a1"/><rect x="200" y="96" width="200" height="144" fill="#b9d98a"/>' +
      '<path class="w" style="--d:.3s" d="M200,96 C176,130 226,160 196,196 S214,230 200,244" stroke="#3d8fd6" stroke-width="32" fill="none" pathLength="1000"/>' +
      L(200, 34, 18, 'il fiume Tevere', .6) + L(95, 76, 16, 'a ovest', 1.2) + L(305, 76, 16, 'a est', 1.4) +
      uo(66, 204, '#a02c2c', 1.3, 1.6) + uo(124, 204, '#a02c2c', 1.3, 1.9, 'l') + uo(280, 204, '#2c7a3a', 1.3, 2.4) + uo(338, 204, '#2c7a3a', 1.3, 2.7, 'l') +
      L(95, 228, 15, 'gli Etruschi', 2.2) + L(309, 228, 15, 'gli Umbri', 3),

      /* 2 · Latini nel Lazio, nasce Roma sul Tevere */
      cielo('#ffeccc', '#fff8ea') + ground(168, '#b9d98a') + '<rect y="192" width="400" height="48" fill="#9fd3f2"/>' +
      '<path class="w" style="--d:.5s" d="M0,204 q25,-7 50,0 t50,0 t50,0 t50,0 t50,0 t50,0 t50,0 t50,0" stroke="#fff" stroke-width="3" fill="none" pathLength="1000"/>' +
      capanna(270, 1.6) + capanna(310, 2) + capanna(350, 2.4) +
      uo(70, 190, '#d9b25c', 1.3, .5) + uo(122, 190, '#c0392b', 1.3, .8, 'l') +
      G(1.4, '<ellipse cx="96" cy="86" rx="40" ry="18" fill="#fff" stroke="#8a9bb8" stroke-width="2"/><polygon points="90,102 102,102 106,116" fill="#fff" stroke="#8a9bb8" stroke-width="2"/><rect x="89" y="100" width="14" height="3" fill="#fff"/>') + L(96, 92, 16, 'latino', 1.6, '#b8322b') +
      L(200, 34, 22, 'i Latini nel Lazio', .2) + L(96, 222, 14, 'i Latini', 1) + L(300, 222, 14, 'nasce Roma sul Tevere', 2.8),

      /* 3 · Sanniti: tre guerre contro Roma */
      cielo('#cfe2f5', '#eef6fc') + '<polygon points="0,170 70,90 130,150 200,70 270,150 330,100 400,160 400,196 0,196" fill="#8aa0b8"/><polygon points="62,98 70,90 78,98 70,102" fill="#fff"/><polygon points="190,82 200,70 210,82 200,86" fill="#fff"/><polygon points="322,108 330,100 338,108 330,112" fill="#fff"/>' + ground(190, '#8cc56b') +
      L(200, 32, 22, 'i Sanniti', .2) + L(200, 54, 13, 'guerrieri forti e coraggiosi', .6) + L(215, 184, 14, 'montagne del Sannio', 1) +
      uo(60, 216, '#8a4b2a', 1.3, 1.4, 'h') + G(1.6, scI(40, 194, 13, '#d9a13a')) + uo(108, 216, '#8a4b2a', 1.3, 1.8, 'h') + G(2, scI(130, 194, 13, '#d9a13a')) +
      [1, 2, 3].map((n, k) => G(2.6 + k * .5, '<circle cx="' + (190 + k * 36) + '" cy="208" r="15" fill="#d6453d" stroke="#fff" stroke-width="2"/>') + L(190 + k * 36, 214, 16, String(n), 2.7 + k * .5, '#fff')).join('') +
      '<g class="a" style="--d:3.6s"><g class="b"><line x1="340" y1="218" x2="340" y2="132" stroke="#6b4a2a" stroke-width="4"/><text x="340" y="134" font-size="34" text-anchor="middle">🦅</text></g></g>' + L(340, 234, 13, 'Roma', 3.8) + L(180, 234, 13, 'tre guerre contro Roma', 3.4),

      /* 4 · Camuni: disegni sulle rocce */
      cielo('#cfe2f5', '#eef6fc') + ground(196, '#8cc56b') +
      '<path d="M30,62 Q40,44 90,48 L320,44 Q372,48 372,94 L368,172 Q360,192 310,190 L90,194 Q38,192 34,160 Z" fill="#a39f95" stroke="#7d7a70" stroke-width="3"/>' +
      '<g stroke="#4b4944" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none">' +
      '<path class="w" style="--d:.6s" d="M88,84 m-13,0 a13,13 0 1 0 26,0 a13,13 0 1 0 -26,0 M88,64 v-8 M88,104 v8 M68,84 h-8 M108,84 h8"/>' +
      '<path class="w" style="--d:1.2s" d="M152,96 m-6,0 a6,6 0 1 0 12,0 a6,6 0 1 0 -12,0 M152,102 v26 m-13,-20 l13,8 l13,-8 m-13,18 l-9,22 m9,-22 l9,22"/>' +
      '<path class="w" style="--d:1.8s" d="M200,108 m-5,0 a5,5 0 1 0 10,0 a5,5 0 1 0 -10,0 M200,113 v20 m-10,-15 l10,6 l10,-6 m-10,14 l-7,18 m7,-18 l7,18"/>' +
      '<path class="w" style="--d:2.4s" d="M256,126 h46 M258,126 v24 M266,126 v24 M294,126 v24 M302,126 v24 M256,126 l-7,-6 M302,126 l10,-18 l12,4 M312,108 l-3,-16 l-6,-3 M309,92 l5,-5 M314,108 l6,-14 l7,-2 M320,94 l-1,-8"/>' +
      '<path class="w" style="--d:3s" d="M306,168 l22,-18 l22,18 z M318,168 v-12 h12 v12"/></g>' +
      L(200, 32, 22, 'i Camuni', .2) + L(70, 26, 13, 'Val Camonica', .5) + L(340, 26, 13, 'Lombardia', .6) +
      L(200, 216, 14, 'migliaia di disegni sulle rocce', 3.2) + L(200, 233, 13, 'il primo sito italiano Patrimonio UNESCO', 3.8),

      /* 5 · nuraghi: torri di pietra senza malta */
      cielo('#bfe3ff', '#eaf6ff') + ground(190, '#c9b27c') + G(.4, '<ellipse cx="60" cy="192" rx="32" ry="9" fill="#8cc56b"/><ellipse cx="344" cy="192" rx="36" ry="9" fill="#8cc56b"/>') +
      G(.6, '<polygon points="110,190 290,190 250,92 150,92" fill="#8d8579" stroke="#6b645a" stroke-width="2"/><rect x="144" y="80" width="112" height="14" rx="3" fill="#7d766b" stroke="#6b645a" stroke-width="2"/>' +
        [0, 1, 2, 3, 4, 5, 6].map(r => {
          const y = 106 + r * 12, hw = 50 + (y - 92) * .4, o = (r % 2) * 14;
          let s = '<line x1="' + (200 - hw) + '" y1="' + y + '" x2="' + (200 + hw) + '" y2="' + y + '" stroke="rgba(0,0,0,.3)" stroke-width="2"/>';
          for (let x = 200 - hw + 10 + o; x < 200 + hw - 6; x += 28) s += '<line x1="' + x + '" y1="' + (y - 12) + '" x2="' + x + '" y2="' + y + '" stroke="rgba(0,0,0,.3)" stroke-width="2"/>';
          return s;
        }).join('') + '<path d="M188,190 v-28 q12,-10 24,0 v28 z" fill="#2b241d"/>') +
      L(200, 32, 22, 'i nuraghi', .2) + L(200, 56, 14, 'in Sardegna', .6) + L(200, 214, 14, 'torri di pietra a forma di cono tagliato', 2.4) + L(200, 233, 14, 'grandi pietre, senza malta', 3.4)
    ]
  });
})();
