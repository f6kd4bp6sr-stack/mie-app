/* 🌙 Raccontami una storia: i disegni animati (uno per storia, tela 400×240).
   Fanno da copertina del libro nella libreria e da scena nel lettore.
   Ogni disegno ha due momenti: gli elementi «f1» si vedono all'inizio, gli «f2» da metà storia (paragrafo «f2», da 0).
   Animazioni in css/storie.css (classi sd-…). Solo forme disegnate qui: nessuna immagine esterna. */
const SD_I = 'stroke="#33304a" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"';
const SD_STELLE = [[30, 26], [92, 14], [150, 40], [214, 18], [262, 44], [318, 20], [372, 38]].map((p, k) => '<circle class="sd-twinkle" style="animation-delay:' + (k * 0.37).toFixed(2) + 's" cx="' + p[0] + '" cy="' + p[1] + '" r="2.2" fill="#fff"/>').join('');
const ST_DISEGNI = {
  /* 💬 Il gruppo senza di me: pioggia alla finestra, il tablet che si accende; poi smette di piovere e arrivano i palloncini */
  s01: { f2: 4, svg:
    '<rect width="400" height="240" fill="#4a4a86"/><rect y="176" width="400" height="64" fill="#c9905f"/>' +
    '<rect x="34" y="26" width="132" height="112" rx="8" fill="#7f95c9" ' + SD_I + '/>' +
    '<g class="f1">' + [48, 70, 92, 114, 136, 152].map((x, k) => '<path class="sd-rain" style="animation-delay:' + (k * 0.21).toFixed(2) + 's" d="M' + x + ' 34 l-6 18" stroke="#dcedff" stroke-width="3" stroke-linecap="round"/>').join('') + '</g>' +
    '<g class="f2"><rect x="36" y="28" width="128" height="108" rx="6" fill="#2f3a78"/><circle cx="118" cy="66" r="20" fill="#fff5cf"/><circle cx="110" cy="60" r="18" fill="#2f3a78"/>' + '<circle class="sd-twinkle" cx="64" cy="54" r="2.5" fill="#fff"/><circle class="sd-twinkle" style="animation-delay:.6s" cx="84" cy="104" r="2.5" fill="#fff"/><circle class="sd-twinkle" style="animation-delay:1.1s" cx="142" cy="108" r="2.5" fill="#fff"/></g>' +
    '<path d="M100 26 v112 M34 82 h132" ' + SD_I + ' fill="none"/>' +
    '<ellipse cx="236" cy="204" rx="150" ry="24" fill="#ff7a9c" ' + SD_I + '/><ellipse cx="236" cy="204" rx="112" ry="15" fill="none" stroke="#ffd3de" stroke-width="4" stroke-dasharray="6 9"/>' +
    '<ellipse cx="150" cy="186" rx="34" ry="14" fill="#ffd23f" ' + SD_I + '/>' +
    '<g transform="rotate(-10 250 150)"><rect x="196" y="108" width="112" height="78" rx="10" fill="#33304a"/><rect class="sd-glow" x="204" y="116" width="96" height="62" rx="5" fill="#dcedff"/>' +
    '<g class="f1"><rect x="212" y="124" width="62" height="9" rx="4" fill="#a879ff"/><rect x="212" y="139" width="44" height="9" rx="4" fill="#b9c6e6"/><rect x="212" y="154" width="54" height="9" rx="4" fill="#b9c6e6"/></g>' +
    '<g class="f2"><circle cx="228" cy="146" r="11" fill="#ff7a9c"/><circle cx="252" cy="140" r="11" fill="#ffd23f"/><circle cx="276" cy="148" r="11" fill="#4bc0a8"/></g></g>' +
    '<g class="f1 sd-pop"><circle cx="322" cy="88" r="24" fill="#ff5c8a" ' + SD_I + '/><text x="322" y="97" text-anchor="middle" font-size="24" font-weight="900" font-family="system-ui,sans-serif" fill="#fff">14</text></g>' +
    '<g class="f2">' + [[300, 92, '#ff7a9c', 0], [334, 72, '#ffd23f', .5], [362, 100, '#4bc0a8', 1]].map(b => '<g class="sd-float" style="animation-delay:' + b[3] + 's"><path d="M' + b[0] + ' ' + (b[1] + 20) + ' q6 22 -4 46" fill="none" stroke="#fff" stroke-width="2"/><ellipse cx="' + b[0] + '" cy="' + b[1] + '" rx="16" ry="20" fill="' + b[2] + '" ' + SD_I + '/></g>').join('') + '</g>' },

  /* 🎮 L'amico di Roblox: la casa sull'albero a cubetti e il tappeto volante; poi lo scudo che blocca le domande */
  s02: { f2: 5, svg:
    '<rect width="400" height="240" fill="#8fd3ff"/><rect y="186" width="400" height="54" fill="#6cc24a"/><rect y="186" width="400" height="10" fill="#57a83a"/>' +
    '<g class="sd-drift"><rect x="40" y="30" width="56" height="18" fill="#fff"/><rect x="56" y="18" width="30" height="14" fill="#fff"/></g><g class="sd-drift" style="animation-delay:-6s"><rect x="290" y="44" width="64" height="18" fill="#fff"/><rect x="306" y="32" width="28" height="14" fill="#fff"/></g>' +
    '<rect x="150" y="120" width="40" height="70" fill="#9b6a3c" ' + SD_I + '/><rect x="92" y="34" width="156" height="50" fill="#3fa84a" ' + SD_I + '/><rect x="116" y="14" width="108" height="30" fill="#4bc05a" ' + SD_I + '/>' +
    '<rect x="112" y="78" width="116" height="52" fill="#ffb347" ' + SD_I + '/><path d="M104 80 L170 50 L236 80 Z" fill="#e5484d" ' + SD_I + '/><rect x="128" y="94" width="24" height="24" fill="#dcedff" ' + SD_I + '/><rect x="176" y="98" width="24" height="32" fill="#9b6a3c" ' + SD_I + '/>' +
    '<path d="M228 112 L300 184 L276 184 L228 136 Z" fill="#ffd23f" ' + SD_I + '/><rect x="286" y="182" width="92" height="30" rx="6" fill="#5aa9ff" ' + SD_I + '/><path class="sd-wave" d="M296 194 q8 -6 16 0 t16 0 t16 0 t16 0" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>' +
    '<g transform="translate(0 20)"><g class="sd-float"><rect x="250" y="40" width="74" height="16" rx="3" fill="#a879ff" ' + SD_I + '/><path d="M258 48 h58" stroke="#ffd23f" stroke-width="3" stroke-dasharray="5 6"/><path d="M252 56 v8 M262 56 v8 M312 56 v8 M322 56 v8" stroke="#33304a" stroke-width="2.5" stroke-linecap="round"/>' +
    '<rect x="276" y="14" width="22" height="26" fill="#ff7a9c" ' + SD_I + '/><rect x="274" y="-8" width="26" height="24" fill="#ffd9b8" ' + SD_I + '/><rect x="280" y="0" width="4" height="5" fill="#33304a"/><rect x="290" y="0" width="4" height="5" fill="#33304a"/><path d="M281 9 h12" stroke="#33304a" stroke-width="2.5" stroke-linecap="round"/></g></g>' +
    '<g class="f1"><rect x="34" y="150" width="26" height="38" fill="#3b7ff6" ' + SD_I + '/><rect x="30" y="122" width="34" height="30" fill="#5aa9ff" ' + SD_I + '/><path d="M30 122 l6 -12 l8 12 M50 122 l8 -12 l6 12" fill="#5aa9ff" ' + SD_I + '/><rect x="38" y="132" width="5" height="6" fill="#33304a"/><rect x="51" y="132" width="5" height="6" fill="#33304a"/>' +
    '<g class="sd-pop"><path d="M70 96 h46 a8 8 0 0 1 8 8 v20 a8 8 0 0 1 -8 8 h-30 l-12 12 v-12 h-4 a8 8 0 0 1 -8 -8 v-20 a8 8 0 0 1 8 -8z" fill="#fff" ' + SD_I + '/><text x="90" y="124" text-anchor="middle" font-size="26" font-weight="900" font-family="system-ui,sans-serif" fill="#e5484d">?</text></g></g>' +
    '<g class="f2 sd-pop"><path d="M48 104 l34 12 v28 q0 26 -34 40 q-34 -14 -34 -40 v-28 z" fill="#4bc0a8" ' + SD_I + '/><path d="M32 144 l12 12 l22 -24" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></g>' },

  /* 👟 La scarpa che non entrava più: la scarpa rossa e i segni sulla porta; poi la scarpa sul ripiano alto */
  s03: { f2: 6, svg:
    '<rect width="400" height="240" fill="#ffe9d6"/><rect y="190" width="400" height="50" fill="#d9a773"/>' +
    '<rect x="26" y="20" width="74" height="172" fill="#fff8ec" ' + SD_I + '/><circle cx="88" cy="112" r="4" fill="#33304a"/>' +
    [168, 150, 134, 116, 96].map((y, k) => '<path d="M100 ' + y + ' h' + (16 + k * 2) + '" stroke="#ff7a9c" stroke-width="4" stroke-linecap="round"/>').join('') +
    '<path class="sd-pop" d="M100 74 h30" stroke="#e5484d" stroke-width="5" stroke-linecap="round"/><path class="sd-float" d="M144 88 v-22 m-7 8 l7 -8 l7 8" fill="none" stroke="#e5484d" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<rect x="252" y="24" width="124" height="168" fill="#b98352" ' + SD_I + '/><rect x="262" y="34" width="104" height="40" fill="#fff5cf"/><rect x="262" y="86" width="104" height="40" fill="#fff5cf"/><rect x="262" y="138" width="104" height="44" fill="#fff5cf"/>' +
    [[268, 98, '#5aa9ff', 26], [282, 94, '#4bc0a8', 30], [296, 100, '#a879ff', 24], [312, 96, '#ff9f43', 28]].map(b => '<rect x="' + b[0] + '" y="' + b[1] + '" width="12" height="' + b[3] + '" fill="' + b[2] + '" stroke="#33304a" stroke-width="2"/>').join('') +
    [[270, 150, '#ff7a9c', 30], [286, 146, '#ffd23f', 34], [302, 152, '#5aa9ff', 28]].map(b => '<rect x="' + b[0] + '" y="' + b[1] + '" width="13" height="' + b[3] + '" fill="' + b[2] + '" stroke="#33304a" stroke-width="2"/>').join('') +
    '<g class="f1 sd-sway"><g transform="translate(150 150)"><path d="M0 34 Q-2 8 22 6 L44 6 Q52 22 78 26 Q96 28 96 40 L0 40 Z" fill="#e5484d" ' + SD_I + '/><rect x="-2" y="38" width="100" height="9" rx="4" fill="#fff" ' + SD_I + '/><path d="M40 12 l10 8 M32 14 l10 8 M48 10 l10 8" stroke="#fff" stroke-width="3" stroke-linecap="round"/></g></g>' +
    '<g class="f2"><g transform="translate(280 36) scale(.72)"><path d="M0 34 Q-2 8 22 6 L44 6 Q52 22 78 26 Q96 28 96 40 L0 40 Z" fill="#e5484d" ' + SD_I + '/><rect x="-2" y="38" width="100" height="9" rx="4" fill="#fff" ' + SD_I + '/><path d="M40 12 l10 8 M32 14 l10 8 M48 10 l10 8" stroke="#fff" stroke-width="3" stroke-linecap="round"/></g>' +
    '<path class="sd-twinkle" d="M356 30 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3 l8 -3 z" fill="#ffd23f"/><path class="sd-twinkle" style="animation-delay:.7s" d="M270 30 l2 6 l6 2 l-6 2 l-2 6 l-2 -6 l-6 -2 l6 -2 z" fill="#ffd23f"/>' +
    '<g transform="translate(176 172) scale(.34)"><path d="M0 34 Q-2 8 22 6 L44 6 Q52 22 78 26 Q96 28 96 40 L0 40 Z" fill="#fff" stroke="#33304a" stroke-width="7" stroke-linejoin="round"/></g></g>' },

  /* 🌋 Il vulcano nello zaino: il vulcano che sbuffa e le cose che volano; poi i tre segnali, uno dopo l'altro */
  s04: { f2: 4, svg:
    '<rect width="400" height="240" fill="#ffb37a"/><rect width="400" height="110" fill="#ff8f6b" opacity=".55"/><circle cx="330" cy="62" r="26" fill="#fff5cf" opacity=".9"/>' +
    '<path d="M0 240 L70 150 L120 190 L160 240 Z" fill="#b5764d"/><path d="M60 240 L170 70 L196 62 L226 70 L340 240 Z" fill="#8a5a3c" ' + SD_I + '/><path d="M170 70 L196 62 L226 70 L212 96 L200 82 L186 100 Z" fill="#ff5c3a" ' + SD_I + '/>' +
    '<path class="sd-glow" d="M186 100 q-10 36 -22 60 M212 96 q8 30 26 52" fill="none" stroke="#ffd23f" stroke-width="6" stroke-linecap="round"/>' +
    [[188, 0], [204, .9], [196, 1.8]].map(p => '<circle class="sd-puff" style="animation-delay:' + p[1] + 's" cx="' + p[0] + '" cy="54" r="15" fill="#fff8ec" opacity=".9"/>').join('') +
    '<g class="f1"><g class="sd-spin" ><rect x="62" y="68" width="48" height="10" rx="3" fill="#ffd23f" ' + SD_I + '/><path d="M110 68 l12 5 l-12 5z" fill="#33304a"/></g>' +
    '<g class="sd-spin" style="animation-duration:2.6s"><rect x="300" y="108" width="32" height="20" rx="5" fill="#ff7a9c" ' + SD_I + '/></g>' +
    '<g class="sd-spin" style="animation-duration:3.4s"><rect x="34" y="146" width="36" height="12" rx="6" fill="#5aa9ff" ' + SD_I + '/></g>' +
    '<path class="sd-pop" d="M270 40 l8 16 l18 2 l-13 12 l4 18 l-17 -9 l-17 9 l4 -18 l-13 -12 l18 -2z" fill="#e5484d" ' + SD_I + '/></g>' +
    '<g class="f2">' + [[70, 86, '#ff7a9c', '1', 0], [330, 110, '#ffd23f', '2', .5], [86, 176, '#5aa9ff', '3', 1]].map(c => '<g class="sd-pop" style="animation-delay:' + c[4] + 's"><circle cx="' + c[0] + '" cy="' + c[1] + '" r="24" fill="' + c[2] + '" ' + SD_I + '/><text x="' + c[0] + '" y="' + (c[1] + 10) + '" text-anchor="middle" font-size="28" font-weight="900" font-family="system-ui,sans-serif" fill="#33304a">' + c[3] + '</text></g>').join('') +
    '<path class="sd-rain" d="M318 170 q-10 14 0 20 q10 -6 0 -20z" fill="#5aa9ff" stroke="#33304a" stroke-width="2.5"/></g>' },

  /* 📸 La foto perfetta: la foto sul frigorifero e il telefono con i cuori; poi dalla foto «si sente» la risata */
  s05: { f2: 5, svg:
    '<rect width="400" height="240" fill="#d8f5ee"/><rect y="200" width="400" height="40" fill="#b9dfd5"/>' +
    '<rect x="40" y="14" width="200" height="214" rx="16" fill="#eef3f8" ' + SD_I + '/><path d="M40 84 h200" ' + SD_I + '/><rect x="56" y="38" width="8" height="30" rx="4" fill="#9aa7b8"/><rect x="56" y="100" width="8" height="46" rx="4" fill="#9aa7b8"/>' +
    '<g class="sd-sway" style="transform-origin:50% 0%"><rect x="98" y="100" width="104" height="112" fill="#fff" ' + SD_I + '/><rect x="106" y="108" width="88" height="80" fill="#8fd3ff"/><path d="M106 170 q22 -10 44 0 t44 0 v18 h-88z" fill="#5aa9ff"/>' +
    '<circle cx="150" cy="146" r="26" fill="#ffd9b8" ' + SD_I + '/><path d="M126 138 q-6 -30 16 -22 M138 122 q4 -22 14 -2 M152 120 q14 -20 12 4 M166 126 q18 -8 8 14" fill="none" stroke="#7a4a2a" stroke-width="5" stroke-linecap="round"/>' +
    '<path d="M139 140 q4 -5 8 0 M155 140 q4 -5 8 0" fill="none" stroke="#33304a" stroke-width="3" stroke-linecap="round"/><path d="M136 150 q14 22 28 0 z" fill="#7a2f3a" ' + SD_I + '/><rect x="141" y="150" width="5" height="5" fill="#fff"/><rect x="155" y="150" width="5" height="5" fill="#fff"/></g>' +
    '<ellipse cx="150" cy="100" rx="15" ry="10" fill="#ffd23f" ' + SD_I + '/><path d="M162 96 q5 -4 7 2" fill="none" stroke="#3fa84a" stroke-width="3" stroke-linecap="round"/>' +
    '<g class="f1"><rect x="290" y="70" width="70" height="128" rx="12" fill="#33304a"/><rect x="297" y="82" width="56" height="96" rx="4" fill="#ffe3ea"/><circle cx="325" cy="122" r="17" fill="#ffe9d6"/><circle cx="319" cy="120" r="3.5" fill="#33304a"/><circle cx="331" cy="120" r="3.5" fill="#33304a"/><path d="M319 129 q6 4 12 0" fill="none" stroke="#33304a" stroke-width="2.5" stroke-linecap="round"/>' +
    '<path class="sd-twinkle" d="M300 62 l4 12 l12 4 l-12 4 l-4 12 l-4 -12 l-12 -4 l12 -4z" fill="#fff"/>' +
    [[282, 150, 0], [368, 130, .8], [346, 60, 1.6]].map(h => '<g transform="translate(' + h[0] + ' ' + h[1] + ')"><path class="sd-heart" style="animation-delay:' + h[2] + 's" d="M0 6 q-10 -12 -10 -18 a5 5 0 0 1 10 -2 a5 5 0 0 1 10 2 q0 6 -10 18z" fill="#ff5c8a"/></g>').join('') + '</g>' +
    '<g class="f2">' + [0, 1, 2].map(k => '<path class="sd-ring" style="animation-delay:' + (k * 0.5) + 's" d="M' + (228 + k * 22) + ' ' + (110 - k * 12) + ' q' + (18 + k * 6) + ' ' + (40 + k * 12) + ' 0 ' + (80 + k * 24) + '" fill="none" stroke="#ff9f43" stroke-width="6" stroke-linecap="round"/>').join('') +
    '<text class="sd-pop" x="330" y="80" text-anchor="middle" font-size="30" font-weight="900" font-family="system-ui,sans-serif" fill="#ff5c8a">ah ah!</text><text class="sd-pop" style="animation-delay:.6s" x="340" y="204" text-anchor="middle" font-size="24" font-weight="900" font-family="system-ui,sans-serif" fill="#a879ff">ah ah ah</text></g>' },

  /* ⏳ Ancora cinque minuti: lo schermo acceso e l'orologio di gomma; poi lo schermo spento, la gallina che suona e la porta d'uscita */
  s06: { f2: 6, svg:
    '<rect width="400" height="240" fill="#2f2a55"/><rect y="196" width="400" height="44" fill="#4a3f7a"/>' +
    '<rect x="36" y="42" width="200" height="124" rx="12" fill="#33304a" stroke="#5b5890" stroke-width="4"/><rect x="118" y="166" width="36" height="20" fill="#5b5890"/><rect x="90" y="184" width="92" height="10" rx="5" fill="#5b5890"/>' +
    '<g class="f1"><rect class="sd-glow" x="46" y="52" width="180" height="104" rx="6" fill="#5aa9ff"/><path d="M60 138 l28 -30 l22 18 l30 -40 l34 30 l28 -22 v42 h-142z" fill="#3fa84a" opacity=".85"/><circle class="sd-float" cx="134" cy="92" r="12" fill="#ffd23f" ' + SD_I + '/>' +
    '<rect x="60" y="62" width="110" height="12" rx="6" fill="#1f2a5a"/><rect class="sd-bar" x="62" y="64" width="100" height="8" rx="4" fill="#ffd23f"/><text x="200" y="74" text-anchor="middle" font-size="13" font-weight="900" font-family="system-ui,sans-serif" fill="#fff">2 min</text>' +
    '<g class="sd-gomma"><circle cx="316" cy="96" r="44" fill="#fff8ec" ' + SD_I + '/><path d="M316 96 v-28 M316 96 l20 12" fill="none" stroke="#33304a" stroke-width="5" stroke-linecap="round"/><circle cx="316" cy="96" r="5" fill="#e5484d"/>' + [0, 90, 180, 270].map(a => '<path transform="rotate(' + a + ' 316 96)" d="M316 58 v8" stroke="#33304a" stroke-width="3" stroke-linecap="round"/>').join('') + '</g></g>' +
    '<g class="f2"><rect x="46" y="52" width="180" height="104" rx="6" fill="#16142a"/><rect class="sd-glow" x="112" y="72" width="48" height="84" rx="4" fill="#fff5cf"/><rect x="118" y="78" width="36" height="78" fill="#ffd23f"/><circle cx="147" cy="118" r="3.5" fill="#33304a"/>' +
    '<g class="sd-shake" style="transform-origin:50% 100%"><ellipse cx="316" cy="140" rx="42" ry="36" fill="#fff" ' + SD_I + '/><circle cx="330" cy="100" r="22" fill="#fff" ' + SD_I + '/><path d="M320 80 q4 -14 10 -2 q6 -12 10 2" fill="#e5484d" ' + SD_I + '/><path d="M350 100 l16 6 l-16 6z" fill="#ff9f43" ' + SD_I + '/><circle cx="336" cy="96" r="3.5" fill="#33304a"/><path d="M344 112 q2 12 -4 14" fill="none" stroke="#e5484d" stroke-width="5" stroke-linecap="round"/>' +
    '<circle cx="306" cy="144" r="17" fill="#dcedff" stroke="#33304a" stroke-width="2.5"/><path d="M306 144 v-10 M306 144 l7 4" stroke="#33304a" stroke-width="2.5" stroke-linecap="round"/><path d="M300 176 v12 M326 176 v12" stroke="#ff9f43" stroke-width="5" stroke-linecap="round"/></g>' +
    '<path class="sd-twinkle" d="M262 78 q-10 8 -4 20 M374 82 q10 8 4 20" fill="none" stroke="#ffd23f" stroke-width="5" stroke-linecap="round"/></g>' },

  /* 🚪 La porta della scuola grande: il portone chiuso e le domande; poi la porta aperta e la strada sulla piantina */
  s07: { f2: 4, svg:
    '<rect width="400" height="240" fill="#bfe3ff"/><rect y="204" width="400" height="36" fill="#c9c2b4"/>' +
    '<rect x="60" y="18" width="280" height="190" fill="#f4c58a" ' + SD_I + '/><path d="M48 22 L200 -6 L352 22 Z" fill="#c9764d" ' + SD_I + '/>' +
    [[82, 44], [280, 44], [82, 116], [280, 116]].map(w => '<rect x="' + w[0] + '" y="' + w[1] + '" width="38" height="46" rx="4" fill="#dcedff" ' + SD_I + '/><path d="M' + (w[0] + 19) + ' ' + w[1] + ' v46 M' + w[0] + ' ' + (w[1] + 23) + ' h38" stroke="#33304a" stroke-width="2"/>').join('') +
    '<path d="M150 208 V96 Q150 44 200 44 Q250 44 250 96 V208 Z" fill="#6b4a36" ' + SD_I + '/>' +
    '<g class="f1"><path d="M200 44 V208" ' + SD_I + '/><circle cx="190" cy="134" r="5" fill="#ffd23f" stroke="#33304a" stroke-width="2"/><circle cx="210" cy="134" r="5" fill="#ffd23f" stroke="#33304a" stroke-width="2"/>' +
    [[118, 150, 0, 30], [286, 176, .7, 24], [304, 96, 1.3, 20]].map(q => '<text class="sd-float" style="animation-delay:' + q[2] + 's" x="' + q[0] + '" y="' + q[1] + '" text-anchor="middle" font-size="' + q[3] + '" font-weight="900" font-family="system-ui,sans-serif" fill="#8b5cf6">?</text>').join('') + '</g>' +
    '<g class="f2"><path class="sd-glow" d="M158 208 V98 Q158 52 200 52 Q242 52 242 98 V208 Z" fill="#fff5cf"/><path d="M150 208 V96 Q150 60 168 50 L168 208 Z M250 208 V96 Q250 60 232 50 L232 208 Z" fill="#8a6248" ' + SD_I + '/><path d="M176 208 L128 240 H272 L224 208 Z" fill="#fff5cf" opacity=".8"/>' +
    '<g transform="rotate(8 320 170)"><rect x="278" y="128" width="96" height="78" rx="4" fill="#fff" ' + SD_I + '/><path class="sd-dash" d="M290 194 h30 v-26 h24 v-24 h16" fill="none" stroke="#e5484d" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="7 7"/><circle cx="290" cy="194" r="5" fill="#33304a"/><path class="sd-pop" d="M360 136 l3 7 l7 1 l-5 5 l1 7 l-6 -4 l-6 4 l1 -7 l-5 -5 l7 -1z" fill="#ffd23f" stroke="#33304a" stroke-width="2"/></g></g>' +
    '<g class="sd-sway" style="transform-origin:50% 100%"><circle cx="200" cy="174" r="11" fill="#ffd9b8" ' + SD_I + '/><path d="M189 172 q0 -16 11 -14 q11 -2 11 14" fill="#7a4a2a" ' + SD_I + '/><path d="M186 214 q0 -28 14 -28 q14 0 14 28z" fill="#ff7a9c" ' + SD_I + '/><rect x="191" y="188" width="18" height="20" rx="5" fill="#a879ff" ' + SD_I + '/></g>' },

  /* 🦴 Mary e il mostro nella roccia: la tempesta e il cranio nella scogliera; poi il sole e lo scheletro intero */
  s08: { f2: 3, svg:
    '<rect width="400" height="240" fill="#9fc6d8"/><g class="f2"><rect width="400" height="240" fill="#bfe8ff"/><circle class="sd-glow" cx="52" cy="46" r="24" fill="#ffd23f"/></g>' +
    '<g class="f1"><g class="sd-drift"><ellipse cx="60" cy="38" rx="44" ry="20" fill="#6f8796"/><ellipse cx="100" cy="30" rx="34" ry="18" fill="#6f8796"/></g>' + [30, 56, 82, 108].map((x, k) => '<path class="sd-rain" style="animation-delay:' + (k * 0.27).toFixed(2) + 's" d="M' + x + ' 62 l-6 16" stroke="#e8f4ff" stroke-width="3" stroke-linecap="round"/>').join('') + '</g>' +
    '<rect y="188" width="400" height="52" fill="#3b7ff6"/><path class="sd-wave" d="M-40 196 q20 -12 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 v20 h-440z" fill="#5aa9ff"/><path d="M0 214 q60 -14 150 4 l-150 22z" fill="#e8d7a8"/>' +
    '<path d="M130 240 L150 60 L210 30 L400 22 V240 Z" fill="#8d97a8" ' + SD_I + '/><path d="M146 98 q120 -22 254 -10 M140 146 q130 -20 260 -8 M136 192 q130 -16 264 -6" fill="none" stroke="#6f788a" stroke-width="3"/>' +
    '<path class="sd-spinslow" d="M352 62 m0 -16 a16 16 0 1 1 -16 16 a11 11 0 1 1 11 11 a6 6 0 1 1 6 -6" fill="none" stroke="#fff8ec" stroke-width="4" stroke-linecap="round"/>' +
    '<g><path d="M176 132 L244 112 Q270 108 276 128 Q272 150 244 148 Z" fill="#fff8ec" ' + SD_I + '/><circle cx="254" cy="128" r="9" fill="#8d97a8" stroke="#33304a" stroke-width="3"/><path d="M188 132 l4 6 l4 -7 l4 7 l4 -8 l4 8 l4 -9 l4 9 l4 -10 l4 10 l4 -10" fill="none" stroke="#33304a" stroke-width="2.5" stroke-linejoin="round"/></g>' +
    '<g class="f2"><path d="M276 130 q40 -4 70 14 q18 12 34 34" fill="none" stroke="#fff8ec" stroke-width="7" stroke-linecap="round"/>' + [0, 1, 2, 3, 4, 5].map(k => '<path class="sd-pop" style="animation-delay:' + (k * 0.18).toFixed(2) + 's" d="M' + (288 + k * 13) + ' ' + (132 + k * 4) + ' q-8 16 -2 ' + (30 - k * 2) + '" fill="none" stroke="#fff8ec" stroke-width="4" stroke-linecap="round"/>').join('') +
    '<path d="M290 150 q-14 18 -30 20 q10 -14 14 -26z M372 166 l22 -14 l-8 22 l10 16z" fill="#fff8ec" ' + SD_I + '/></g>' +
    '<g class="f1 sd-tap" style="transform-origin:0% 100%"><path d="M170 196 L206 150" stroke="#9b6a3c" stroke-width="7" stroke-linecap="round"/><rect x="196" y="136" width="30" height="16" rx="3" transform="rotate(38 211 144)" fill="#5b6270" ' + SD_I + '/></g>' +
    '<g class="f1"><path class="sd-twinkle" d="M232 98 l3 7 l7 3 l-7 3 l-3 7 l-3 -7 l-7 -3 l7 -3z" fill="#ffd23f"/></g>' }
};
