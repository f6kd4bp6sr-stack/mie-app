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
    '<g class="f1"><path class="sd-twinkle" d="M232 98 l3 7 l7 3 l-7 3 l-3 7 l-3 -7 l-7 -3 l7 -3z" fill="#ffd23f"/></g>' },

  /* ===== raccolta 2 · Storie dal mondo (13/11/2026) ===== */
  /* 🍲 La zuppa di pietra: il paiolo sul fuoco in piazza; poi la zuppa si riempie e si accendono le lanterne */
  s09: { f2: 4, svg:
    '<rect width="400" height="240" fill="#3b4a86"/>' + SD_STELLE + '<rect y="192" width="400" height="48" fill="#8a6a50"/>' +
    '<rect x="12" y="112" width="92" height="82" fill="#e0a76a" ' + SD_I + '/><path d="M4 116 L58 72 L112 116Z" fill="#b5523f" ' + SD_I + '/><rect class="sd-glow" x="38" y="132" width="30" height="30" fill="#ffe08a" ' + SD_I + '/>' +
    '<rect x="296" y="112" width="92" height="82" fill="#e0a76a" ' + SD_I + '/><path d="M288 116 L342 72 L396 116Z" fill="#7a5ca8" ' + SD_I + '/><rect class="sd-glow" style="animation-delay:.8s" x="330" y="132" width="30" height="30" fill="#ffe08a" ' + SD_I + '/>' +
    '<g class="f2"><path d="M58 76 Q200 112 342 76" fill="none" stroke="#33304a" stroke-width="2.5"/>' + [[104, 92, '#ff7a9c'], [152, 100, '#ffd23f'], [200, 102, '#4bc0a8'], [248, 100, '#a879ff'], [296, 92, '#ff9a3c']].map((l, k) => '<circle class="sd-glow" style="animation-delay:' + (k * 0.4).toFixed(1) + 's" cx="' + l[0] + '" cy="' + (l[1] + 6) + '" r="9" fill="' + l[2] + '" ' + SD_I + '/>').join('') + '</g>' +
    '<path d="M168 214 L232 196 M168 196 L232 214" stroke="#6b4a2e" stroke-width="9" stroke-linecap="round"/>' +
    '<path class="sd-sway" d="M178 202 q-12 -28 8 -44 q2 14 12 8 q4 -12 2 -18 q26 22 6 54z" fill="#ff9a3c"/><path class="sd-sway" style="animation-delay:.5s" d="M190 202 q-4 -16 8 -24 q8 10 8 24z" fill="#ffd23f"/>' +
    '<path d="M150 124 h100 q12 34 -10 56 q-40 14 -80 0 q-22 -22 -10 -56z" fill="#3a3a4a" ' + SD_I + '/><path d="M146 126 h-10 M254 126 h10" stroke="#33304a" stroke-width="5" stroke-linecap="round"/>' +
    '<ellipse cx="200" cy="124" rx="50" ry="10" fill="#7fd0e8" ' + SD_I + '/>' +
    '<g class="f1"><ellipse cx="200" cy="124" rx="15" ry="7" fill="#b7bcc6" ' + SD_I + '/><ellipse cx="196" cy="122" rx="5" ry="2.5" fill="#e6e9ef"/></g>' +
    '<g class="f2"><ellipse cx="200" cy="124" rx="48" ry="9" fill="#f2b95c"/><rect x="170" y="116" width="22" height="9" rx="4" transform="rotate(-18 181 120)" fill="#ff8a3c" ' + SD_I + '/><ellipse class="sd-float" cx="214" cy="121" rx="10" ry="6" fill="#c9905f" ' + SD_I + '/><circle class="sd-float" style="animation-delay:.6s" cx="198" cy="124" r="7" fill="#fff1d6" ' + SD_I + '/><path d="M226 124 q8 -8 14 0" fill="none" stroke="#4bc05a" stroke-width="4" stroke-linecap="round"/></g>' +
    [[176, 0], [200, .9], [224, 1.8]].map(q => '<ellipse class="sd-puff" style="animation-delay:' + q[1] + 's" cx="' + q[0] + '" cy="112" rx="10" ry="7" fill="#fff"/>').join('') },

  /* 🕊️ La gru riconoscente: la gru nella neve davanti alla casetta; poi vola nel cielo con la stoffa luminosa */
  s10: { f2: 5, svg: (() => {
    const gru = (vola) => (vola ? '<path d="M34 24 Q20 -22 -14 -34 Q8 2 22 28Z" fill="#fff" ' + SD_I + '/>' : '<path d="M36 44 v28 M48 44 v28 M30 72 h12 M42 72 h12" stroke="#33304a" stroke-width="3" fill="none" stroke-linecap="round"/>') +
      '<ellipse cx="42" cy="32" rx="30" ry="16" fill="#fff" ' + SD_I + '/><path d="M16 30 l-16 8 l18 4z" fill="#33304a"/>' +
      '<path d="M64 24 Q80 14 78 -12" fill="none" stroke="#33304a" stroke-width="11" stroke-linecap="round"/><path d="M64 24 Q80 14 78 -12" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>' +
      '<circle cx="79" cy="-16" r="8" fill="#fff" ' + SD_I + '/><path d="M86 -16 l20 4 l-20 4z" fill="#ffb347" ' + SD_I + '/><circle cx="78" cy="-23" r="3.5" fill="#e5484d"/><circle cx="81" cy="-17" r="1.8" fill="#33304a"/>' +
      (vola ? '<path d="M30 28 Q4 6 -20 8 Q4 26 26 38Z" fill="#f3f6ff" ' + SD_I + '/>' : '');
    return '<rect width="400" height="240" fill="#a9bfe8"/><path d="M0 150 L70 70 L130 140 L200 60 L280 150 L340 90 L400 150 V240 H0Z" fill="#dfe8fb"/><rect y="176" width="400" height="64" fill="#fff"/><path d="M0 176 Q100 160 200 176 T400 176" fill="#fff" ' + SD_I + '/>' +
      '<g class="f2"><circle class="sd-glow" cx="316" cy="46" r="26" fill="#fff5cf"/></g>' +
      '<g class="f1">' + [[40, 30], [90, 70], [150, 40], [210, 90], [270, 30], [340, 80], [370, 40], [60, 120], [330, 130]].map((p, k) => '<circle class="sd-float" style="animation-delay:' + (k * 0.3).toFixed(1) + 's" cx="' + p[0] + '" cy="' + p[1] + '" r="3.5" fill="#fff"/>').join('') + '</g>' +
      '<rect x="256" y="120" width="104" height="70" fill="#d9a066" ' + SD_I + '/><path d="M246 124 L308 78 L370 124Z" fill="#f3f6ff" ' + SD_I + '/><rect class="sd-glow" x="276" y="140" width="28" height="28" fill="#ffe08a" ' + SD_I + '/><rect x="324" y="146" width="22" height="44" fill="#8a5a3a" ' + SD_I + '/><ellipse class="sd-puff" cx="336" cy="74" rx="8" ry="6" fill="#fff"/>' +
      '<g class="f1"><g transform="translate(70 100)">' + gru(false) + '</g></g>' +
      '<g class="f2 sd-float"><g transform="translate(60 70) rotate(-8) scale(.9)">' + gru(true) + '</g><path d="M-6 100 q30 24 60 4 q30 -22 60 -2" transform="translate(6 -6)" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" opacity=".9"/></g>' +
      '<g class="f2">' + [[160, 60], [200, 30], [236, 70]].map((p, k) => '<path class="sd-twinkle" style="animation-delay:' + (k * 0.5).toFixed(1) + 's" d="M' + p[0] + ' ' + p[1] + ' l3 7 l7 3 l-7 3 l-3 7 l-3 -7 l-7 -3 l7 -3z" fill="#ffd23f"/>').join('') + '</g>';
  })() },

  /* 🐦 L'usignolo dell'imperatore: l'usignolo canta sul ramo; poi accanto c'è l'uccello d'oro, muto, e quello vero torna a cantare */
  s11: { f2: 4, svg: (() => {
    const nota = (x, y, k) => '<g class="sd-float" style="animation-delay:' + (k * 0.5).toFixed(1) + 's"><ellipse cx="' + x + '" cy="' + y + '" rx="7" ry="5" fill="#ffd23f" ' + SD_I + '/><path d="M' + (x + 6) + ' ' + y + ' v-22 l10 6" fill="none" stroke="#ffd23f" stroke-width="3.5" stroke-linecap="round"/></g>';
    const usi = '<ellipse cx="0" cy="0" rx="26" ry="18" fill="#b89b7a" ' + SD_I + '/><path d="M-22 -2 l-24 8 l6 -14z" fill="#9a7d5c" ' + SD_I + '/><circle cx="22" cy="-12" r="12" fill="#c9ad8c" ' + SD_I + '/><path d="M32 -16 l16 5 l-16 6z" fill="#ffb347" ' + SD_I + '/><circle cx="25" cy="-14" r="2.5" fill="#33304a"/><ellipse cx="-4" cy="4" rx="14" ry="9" fill="#e7d3b6"/>';
    return '<rect width="400" height="240" fill="#2a3f6b"/>' + SD_STELLE + '<circle class="sd-glow" cx="320" cy="62" r="34" fill="#fff5cf"/><circle cx="332" cy="54" r="30" fill="#2a3f6b"/>' +
      '<rect y="196" width="400" height="44" fill="#1f4a50"/><rect x="90" y="150" width="120" height="48" fill="#c9553f" ' + SD_I + '/><path d="M74 152 L150 118 L226 152Z" fill="#e5484d" ' + SD_I + '/><path d="M110 118 L150 92 L190 118Z" fill="#ffb347" ' + SD_I + '/><rect class="sd-glow" x="136" y="164" width="28" height="34" fill="#ffe08a" ' + SD_I + '/>' +
      '<path d="M400 128 Q330 130 270 150 Q230 160 210 150" fill="none" stroke="#5b3d2a" stroke-width="9" stroke-linecap="round"/><path d="M340 134 q-8 10 0 22 M300 142 q-8 12 -2 24 M368 130 q8 12 0 22" fill="none" stroke="#4bc05a" stroke-width="5" stroke-linecap="round"/>' +
      '<g transform="translate(300 118)">' + usi + '</g>' +
      '<g class="f1">' + nota(250, 90, 0) + nota(280, 56, 1) + nota(210, 66, 2) + '</g>' +
      '<g class="f2"><path d="M30 190 h96 v10 h-96z" fill="#a879ff" ' + SD_I + '/><g transform="translate(78 160)"><ellipse rx="26" ry="18" fill="#ffd23f" ' + SD_I + '/><circle cx="22" cy="-12" r="12" fill="#ffd23f" ' + SD_I + '/><path d="M32 -16 l16 5 l-16 6z" fill="#ff9a3c" ' + SD_I + '/><circle cx="25" cy="-14" r="2.5" fill="#33304a"/><path d="M-20 -4 l-26 -4 l8 14z" fill="#e5484d" ' + SD_I + '/><circle cx="-4" cy="2" r="4" fill="#4bc0a8" stroke="#33304a" stroke-width="2"/><circle cx="8" cy="8" r="3" fill="#e5484d" stroke="#33304a" stroke-width="2"/></g><path d="M62 130 q16 -8 32 0" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".0"/>' + nota(262, 76, 0) + nota(236, 44, 1) + nota(290, 40, 2) + '</g>';
  })() },

  /* 🌹 Biancaneve e Rosarossa: l'orso alla porta nella neve d'inverno; poi l'estate, con i rosai bianco e rosso e le gemme sull'erba */
  s12: { f2: 4, svg: (() => {
    const rosaio = (x, c) => '<g transform="translate(' + x + ' 190)"><path d="M0 0 V-40" stroke="#33304a" stroke-width="3"/><circle cx="0" cy="-48" r="26" fill="#3fa84a" ' + SD_I + '/>' + [[-10, -54], [10, -44], [0, -36], [-6, -42], [12, -58]].map(p => '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="6" fill="' + c + '" ' + SD_I + '/>').join('') + '</g>';
    return '<rect width="400" height="240" fill="#8a99b8"/>' +
      '<g class="f1"><rect width="400" height="240" fill="#6e7fae"/><rect y="188" width="400" height="52" fill="#f4f7ff"/><path d="M0 188 Q100 170 200 188 T400 188" fill="#f4f7ff"/></g>' +
      '<g class="f2"><rect width="400" height="240" fill="#9fdcff"/><circle class="sd-spinslow" cx="344" cy="40" r="20" fill="#ffd23f" ' + SD_I + '/><rect y="188" width="400" height="52" fill="#6cc24a"/><path d="M0 188 Q100 176 200 188 T400 188" fill="#6cc24a"/></g>' +
      '<rect x="30" y="104" width="150" height="88" fill="#e0a76a" ' + SD_I + '/><path d="M20 108 L105 54 L190 108Z" fill="#b5523f" ' + SD_I + '/><rect x="140" y="62" width="20" height="30" fill="#8a5a3a" ' + SD_I + '/><ellipse class="sd-puff" cx="150" cy="54" rx="8" ry="6" fill="#fff"/><rect class="sd-glow" x="46" y="126" width="34" height="32" fill="#ffe08a" ' + SD_I + '/><rect x="116" y="142" width="34" height="50" fill="#8a5a3a" ' + SD_I + '/>' +
      '<g class="f1">' + [[210, 40], [250, 90], [300, 30], [340, 80], [380, 40], [230, 130], [360, 120], [60, 40]].map((p, k) => '<circle class="sd-float" style="animation-delay:' + (k * 0.25).toFixed(2) + 's" cx="' + p[0] + '" cy="' + p[1] + '" r="3.5" fill="#fff"/>').join('') +
      '<g class="sd-sway" style="transform-origin:50% 100%"><ellipse cx="290" cy="170" rx="42" ry="40" fill="#8a5a3a" ' + SD_I + '/><circle cx="290" cy="116" r="30" fill="#9b6a3c" ' + SD_I + '/><circle cx="268" cy="92" r="11" fill="#9b6a3c" ' + SD_I + '/><circle cx="312" cy="92" r="11" fill="#9b6a3c" ' + SD_I + '/><ellipse cx="290" cy="126" rx="14" ry="10" fill="#e8c9a0" ' + SD_I + '/><circle cx="290" cy="122" r="4" fill="#33304a"/><circle cx="278" cy="108" r="3" fill="#33304a"/><circle cx="302" cy="108" r="3" fill="#33304a"/><path d="M283 132 q7 6 14 0" fill="none" stroke="#33304a" stroke-width="2.5" stroke-linecap="round"/></g></g>' +
      '<g class="f2">' + rosaio(224, '#fff') + rosaio(282, '#e5484d') + '<g class="sd-float"><path d="M340 120 q-14 -10 -6 -20 q8 6 6 20 q14 -10 6 -20 q-8 6 -6 20z" fill="#ff9a3c" ' + SD_I + '/></g>' + [[320, 204, '#5aa9ff'], [352, 212, '#ff7a9c'], [376, 200, '#4bc0a8']].map((g, k) => '<path class="sd-twinkle" style="animation-delay:' + (k * 0.5).toFixed(1) + 's" d="M' + g[0] + ' ' + (g[1] - 9) + ' l8 9 l-8 9 l-8 -9z" fill="' + g[2] + '" ' + SD_I + '/>').join('') + '</g>';
  })() },

  /* 👑 Il segreto del re con le orecchie di cavallo: il re con il cappuccio; poi il salice, l'arpa che canta e il re a testa scoperta */
  s13: { f2: 5, svg: (() => {
    const re = (cap) => '<path d="M-26 0 q-4 -34 26 -34 q30 0 26 34" fill="none"/>' +
      (cap ? '' : '<path d="M-22 -16 L-34 -52 L-10 -30Z M22 -16 L34 -52 L10 -30Z" fill="#ffd9b8" ' + SD_I + '/><path d="M-22 -22 L-29 -42 L-16 -30Z M22 -22 L29 -42 L16 -30Z" fill="#ff9aa8"/>') +
      '<path d="M-34 74 Q-34 30 0 30 Q34 30 34 74Z" fill="#a879ff" ' + SD_I + '/><circle r="28" fill="#ffd9b8" ' + SD_I + '/><path d="M-22 14 Q0 46 22 14 Q22 36 0 44 Q-22 36 -22 14Z" fill="#e8e1d6" ' + SD_I + '/><circle cx="-10" cy="-4" r="3" fill="#33304a"/><circle cx="10" cy="-4" r="3" fill="#33304a"/><path d="M-9 10 q9 7 18 0" fill="none" stroke="#33304a" stroke-width="2.5" stroke-linecap="round"/>' +
      (cap ? '<path d="M-34 6 Q-36 -40 0 -40 Q36 -40 34 6 Q28 -14 0 -16 Q-28 -14 -34 6Z" fill="#7a5ca8" ' + SD_I + '/>' : '') +
      '<path d="M-26 -26 l-6 -16 l12 8 l14 -14 l14 14 l12 -8 l-6 16z" fill="#ffd23f" ' + SD_I + '/>';
    return '<rect width="400" height="240" fill="#6b2f4f"/><rect y="190" width="400" height="50" fill="#4a1f38"/>' +
      '<g class="f1"><path d="M0 0 Q60 70 40 240 H0Z M400 0 Q340 70 360 240 H400Z" fill="#b53a55" ' + SD_I + '/><g transform="translate(200 110) scale(1.5)"><g class="sd-pop">' + re(true) + '</g></g><g class="sd-twinkle"><path d="M100 60 l3 7 l7 3 l-7 3 l-3 7 l-3 -7 l-7 -3 l7 -3z" fill="#ffd23f"/></g><g class="sd-twinkle" style="animation-delay:.9s"><path d="M310 50 l3 7 l7 3 l-7 3 l-3 7 l-3 -7 l-7 -3 l7 -3z" fill="#ffd23f"/></g></g>' +
      '<g class="f2"><rect width="400" height="240" fill="#2a3f6b"/>' + SD_STELLE + '<rect y="196" width="400" height="44" fill="#1f4a50"/>' +
      '<g class="sd-sway" style="transform-origin:50% 0%"><rect x="60" y="80" width="22" height="116" fill="#6b4a2e" ' + SD_I + '/><path d="M70 90 Q10 60 8 110" fill="none" stroke="#4bc05a" stroke-width="5" stroke-linecap="round"/>' + [8, 26, 46, 94, 112, 130].map((x, k) => '<path d="M' + (71) + ' 84 Q' + (x - 10) + ' 100 ' + x + ' ' + (150 + (k % 3) * 14) + '" fill="none" stroke="#4bc05a" stroke-width="5" stroke-linecap="round"/>').join('') + '</g>' +
      '<g transform="translate(236 194)"><path d="M-40 -90 Q10 -130 60 -126 L60 0 Z" fill="#ffd23f" ' + SD_I + '/><path d="M-40 -90 L-40 -86 L60 0" fill="none" stroke="#33304a" stroke-width="3"/>' + [-28, -14, 0, 14, 28, 42].map(x => '<path d="M' + x + ' ' + (-96 - (x + 40) * 0.0 + 10 - (x + 40) * 0.12) + ' V' + (-86 + (x + 40) * 0.9) + '" stroke="#33304a" stroke-width="2" fill="none"/>').join('') + '</g>' +
      [[220, 96, 0], [290, 70, 1], [320, 120, 2]].map(q => '<g class="sd-float" style="animation-delay:' + (q[2] * 0.5).toFixed(1) + 's"><ellipse cx="' + q[0] + '" cy="' + q[1] + '" rx="7" ry="5" fill="#ffd23f" ' + SD_I + '/><path d="M' + (q[0] + 6) + ' ' + q[1] + ' v-22 l10 6" fill="none" stroke="#ffd23f" stroke-width="3.5" stroke-linecap="round"/></g>').join('') +
      '<g transform="translate(350 76) scale(.7)">' + re(false) + '</g></g>';
  })() },

  /* 🐸 Tiddalik: la rana gonfia sulla terra secca; poi ride e l'acqua torna, con l'anguilla che si annoda */
  s14: { f2: 4, svg: (() => {
    const rana = (ride) => '<ellipse cy="40" rx="' + (ride ? 62 : 84) + '" ry="' + (ride ? 38 : 56) + '" fill="#6cc24a" ' + SD_I + '/><ellipse cy="52" rx="' + (ride ? 40 : 56) + '" ry="' + (ride ? 24 : 36) + '" fill="#d9f2a8"/><circle cx="-26" cy="-16" r="16" fill="#6cc24a" ' + SD_I + '/><circle cx="26" cy="-16" r="16" fill="#6cc24a" ' + SD_I + '/><circle cx="-26" cy="-17" r="7" fill="#fff"/><circle cx="26" cy="-17" r="7" fill="#fff"/><circle cx="-25" cy="-16" r="3.5" fill="#33304a"/><circle cx="27" cy="-16" r="3.5" fill="#33304a"/>' +
      (ride ? '<path d="M-34 10 Q0 50 34 10 Q0 26 -34 10Z" fill="#e5484d" ' + SD_I + '/><path d="M-28 14 Q0 30 28 14" fill="none" stroke="#fff" stroke-width="3"/>' : '<path d="M-26 12 Q0 22 26 12" fill="none" stroke="#33304a" stroke-width="3.5" stroke-linecap="round"/>');
    return '<rect width="400" height="240" fill="#ffd9a0"/>' +
      '<g class="f1"><circle class="sd-spinslow" cx="340" cy="44" r="26" fill="#ffb347" ' + SD_I + '/><rect y="150" width="400" height="90" fill="#d9a066"/><path d="M20 170 l30 14 l-10 22 M110 200 l26 -10 l16 18 M290 176 l34 10 l8 24 M360 214 l-26 -8 M60 224 l20 -16" fill="none" stroke="#8a5a3a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><g transform="translate(200 76)">' + rana(false) + '</g></g>' +
      '<g class="f2"><rect width="400" height="240" fill="#bfe8ff"/><rect y="130" width="400" height="110" fill="#5aa9ff"/><path class="sd-wave" d="M-40 140 q8 -8 16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/>' +
      '<path class="sd-wave" d="M-40 190 q8 -8 16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0" fill="none" stroke="#dcedff" stroke-width="3" stroke-linecap="round"/>' +
      '<g class="sd-sway"><path d="M270 214 q-30 -16 -10 -34 q22 -16 6 -36 q-14 -16 20 -26" fill="none" stroke="#33304a" stroke-width="15" stroke-linecap="round"/><path d="M270 214 q-30 -16 -10 -34 q22 -16 6 -36 q-14 -16 20 -26" fill="none" stroke="#8d97a8" stroke-width="9" stroke-linecap="round"/><circle cx="286" cy="118" r="5" fill="#fff" ' + SD_I + '/></g>' +
      '<g transform="translate(130 72)">' + rana(true) + '</g>' + [[60, 40], [220, 38], [60, 100]].map((h, k) => '<path class="sd-heart" style="animation-delay:' + (k * 0.8).toFixed(1) + 's" d="M' + h[0] + ' ' + h[1] + ' q-10 -12 -16 -2 q-4 10 16 22 q20 -12 16 -22 q-6 -10 -16 2z" fill="#ff7a9c"/>').join('') + '</g>';
  })() },

  /* 🌸 Il gigante egoista: il muro e l'inverno nel giardino; poi la primavera, i bambini e il gigante che gioca */
  s15: { f2: 5, svg: (() => {
    const albero = (x, fiori) => '<g transform="translate(' + x + ' 190)"><path d="M0 0 V-70 M0 -40 L-24 -66 M0 -52 L22 -80" stroke="#6b4a2e" stroke-width="9" stroke-linecap="round" fill="none"/>' +
      (fiori ? [[-24, -70], [22, -84], [0, -86], [-10, -56], [14, -60], [-34, -52]].map((p, k) => '<circle class="sd-pop" style="animation-delay:' + (k * 0.3).toFixed(1) + 's" cx="' + p[0] + '" cy="' + p[1] + '" r="14" fill="#ffb3c7" ' + SD_I + '/>').join('') : '<path d="M-24 -66 q-10 -6 -14 0 M22 -80 q10 -6 14 0" stroke="#fff" stroke-width="6" stroke-linecap="round" fill="none"/>') + '</g>';
    const bimbo = (x, y, c, k) => '<g class="sd-float" style="animation-delay:' + (k * 0.35).toFixed(2) + 's"><circle cx="' + x + '" cy="' + (y - 16) + '" r="9" fill="#ffd9b8" ' + SD_I + '/><path d="M' + (x - 10) + ' ' + (y + 20) + ' L' + x + ' ' + (y - 6) + ' L' + (x + 10) + ' ' + (y + 20) + 'Z" fill="' + c + '" ' + SD_I + '/></g>';
    return '<rect width="400" height="240" fill="#a9bfe8"/>' +
      '<g class="f1"><rect y="176" width="400" height="64" fill="#f4f7ff"/>' + albero(90, false) + albero(220, false) + '<g class="sd-drift"><path d="M270 60 h70 M284 76 h80 M262 92 h60" stroke="#fff" stroke-width="4" stroke-linecap="round"/></g>' + [[40, 50], [140, 40], [190, 90], [250, 120], [60, 120], [330, 140]].map((p, k) => '<circle class="sd-float" style="animation-delay:' + (k * 0.3).toFixed(1) + 's" cx="' + p[0] + '" cy="' + p[1] + '" r="3.5" fill="#fff"/>').join('') + '</g>' +
      '<g class="f2"><rect width="400" height="240" fill="#bfe8ff"/><circle class="sd-spinslow" cx="160" cy="34" r="18" fill="#ffd23f" ' + SD_I + '/><rect y="176" width="400" height="64" fill="#6cc24a"/>' + albero(70, true) + albero(190, true) +
      '<rect x="300" y="170" width="26" height="18" rx="6" fill="#6b4a2e" ' + SD_I + '/><rect x="344" y="170" width="26" height="18" rx="6" fill="#6b4a2e" ' + SD_I + '/><path d="M296 100 Q250 120 232 150" stroke="#33304a" stroke-width="22" stroke-linecap="round" fill="none"/><path d="M296 100 Q250 120 232 150" stroke="#5b7fd0" stroke-width="16" stroke-linecap="round" fill="none"/><circle cx="230" cy="152" r="9" fill="#ffd9b8" ' + SD_I + '/><rect x="288" y="82" width="86" height="96" rx="12" fill="#5b7fd0" ' + SD_I + '/><circle cx="331" cy="62" r="26" fill="#ffd9b8" ' + SD_I + '/><path d="M306 54 Q331 24 356 54 Q346 44 331 44 Q316 44 306 54Z" fill="#8a5a3a" ' + SD_I + '/><circle cx="321" cy="62" r="3" fill="#33304a"/><circle cx="341" cy="62" r="3" fill="#33304a"/><path d="M319 74 q12 10 24 0" fill="none" stroke="#33304a" stroke-width="3" stroke-linecap="round"/>' +
      bimbo(120, 200, '#ff7a9c', 0) + bimbo(178, 210, '#ffd23f', 1) + bimbo(150, 196, '#4bc0a8', 2) + bimbo(214, 206, '#a879ff', 3) + '</g>' +
      '<g class="f1"><rect x="262" y="60" width="130" height="130" fill="#c9905f" ' + SD_I + '/><path d="M262 94 h130 M262 128 h130 M262 160 h130 M304 60 v34 M348 94 v34 M304 128 v32" stroke="#33304a" stroke-width="2.5" fill="none"/><rect x="296" y="30" width="62" height="34" rx="4" fill="#fff8ec" ' + SD_I + '/><path d="M308 47 h38" stroke="#e5484d" stroke-width="5" stroke-linecap="round"/></g>';
  })() },

  /* 🧮 Ada e la macchina dei numeri: gli ingranaggi e le schede forate; poi dalla macchina escono note musicali e simboli */
  s16: { f2: 4, svg: (() => {
    const ing = (cx, cy, r, n, col, cl, k) => { const pts = []; for (let i = 0; i < n * 2; i++) { const a = Math.PI * i / n, rr = i % 2 ? r : r + 7; pts.push((cx + rr * Math.cos(a - Math.PI / (2 * n) * 0)).toFixed(1) + ' ' + (cy + rr * Math.sin(a)).toFixed(1)); } return '<g class="' + cl + '" style="animation-delay:' + k + 's"><path d="M' + pts.join(' L') + 'Z" fill="' + col + '" ' + SD_I + '/><circle cx="' + cx + '" cy="' + cy + '" r="' + (r * 0.35).toFixed(1) + '" fill="#3a2a55" ' + SD_I + '/></g>'; };
    return '<rect width="400" height="240" fill="#40336e"/>' + SD_STELLE + '<rect y="196" width="400" height="44" fill="#2c2250"/>' +
      '<rect x="70" y="56" width="260" height="140" rx="14" fill="#d9a441" ' + SD_I + '/><rect x="86" y="72" width="228" height="108" rx="8" fill="#6b4a2e" ' + SD_I + '/>' +
      ing(130, 124, 26, 10, '#ffd966', 'sd-spin', 0) + ing(186, 100, 18, 8, '#f2b95c', 'sd-spin', 0) + ing(234, 132, 22, 9, '#ffd966', 'sd-spin', 0) + ing(284, 98, 14, 7, '#f2b95c', 'sd-spin', 0) +
      '<g class="f1"><rect x="28" y="206" width="344" height="22" fill="#fff8ec" ' + SD_I + '/>' + [48, 78, 108, 138, 168, 198, 228, 258, 288, 318, 348].map((x, k) => '<circle cx="' + x + '" cy="217" r="4.5" fill="' + (k % 3 ? '#33304a' : '#fff8ec') + '"/>').join('') + '</g>' +
      '<g class="f2">' + [[110, 44, 0], [210, 38, 1], [300, 46, 2]].map(q => '<g class="sd-float" style="animation-delay:' + (q[2] * 0.5).toFixed(1) + 's"><ellipse cx="' + q[0] + '" cy="' + q[1] + '" rx="8" ry="6" fill="#ffd23f" ' + SD_I + '/><path d="M' + (q[0] + 7) + ' ' + q[1] + ' v-24 l11 6" fill="none" stroke="#ffd23f" stroke-width="4" stroke-linecap="round"/></g>').join('') +
      '<g class="sd-float" style="animation-delay:.3s"><path d="M156 40 l6 -14 l6 14z" fill="#4bc0a8" ' + SD_I + '/></g><g class="sd-pop"><circle cx="256" cy="34" r="8" fill="#ff7a9c" ' + SD_I + '/></g><g class="sd-pop" style="animation-delay:.7s"><rect x="340" y="28" width="14" height="14" fill="#5aa9ff" ' + SD_I + '/></g>' +
      '<path class="sd-twinkle" d="M50 80 l3 7 l7 3 l-7 3 l-3 7 l-3 -7 l-7 -3 l7 -3z" fill="#ffd23f"/><path class="sd-twinkle" style="animation-delay:.8s" d="M356 90 l3 7 l7 3 l-7 3 l-3 7 l-3 -7 l-7 -3 l7 -3z" fill="#ffd23f"/></g>';
  })() },

  /* ===== raccolta 3 · Fiabe e meraviglie (13/11/2026) ===== */
  /* 🎺 I musicanti di Brema: la torre di animali davanti alla casetta illuminata; poi la casa tranquilla, con il fumo dal camino */
  s17: { f2: 5, svg:
    '<rect width="400" height="240" fill="#2f3a78"/>' + SD_STELLE +
    '<rect y="190" width="400" height="50" fill="#4a7a5a"/>' +
    [[30, 120], [372, 130]].map(t => '<path d="M' + (t[0] - 30) + ' 196 L' + t[0] + ' ' + t[1] + ' L' + (t[0] + 30) + ' 196Z" fill="#2f6b4f" ' + SD_I + '/><rect x="' + (t[0] - 5) + '" y="196" width="10" height="14" fill="#7a4a2a"/>').join('') +
    '<path d="M246 124 L300 80 L354 124Z" fill="#b0563f" ' + SD_I + '/><rect x="256" y="124" width="88" height="68" fill="#e0ad72" ' + SD_I + '/><rect x="324" y="82" width="12" height="26" fill="#8a6248" ' + SD_I + '/>' +
    '<rect class="sd-glow" x="268" y="140" width="34" height="28" rx="3" fill="#ffd23f" ' + SD_I + '/><path d="M285 140 v28 M268 154 h34" ' + SD_I + ' fill="none"/><rect x="314" y="150" width="22" height="42" rx="3" fill="#6b4a36" ' + SD_I + '/>' +
    /* f1: la torre di animali */
    '<g class="f1"><g class="sd-sway" style="transform-origin:50% 100%">' +
    '<path d="M96 192 v-16 M140 192 v-16" stroke="#7d838e" stroke-width="7" stroke-linecap="round"/><ellipse cx="118" cy="168" rx="34" ry="19" fill="#9aa0aa" ' + SD_I + '/><ellipse cx="150" cy="150" rx="13" ry="16" fill="#9aa0aa" ' + SD_I + '/><path d="M144 138 l-4 -20 l10 14z M156 138 l6 -18 l4 20z" fill="#9aa0aa" ' + SD_I + '/><circle cx="154" cy="148" r="2.5" fill="#33304a"/><ellipse cx="156" cy="158" rx="6" ry="4" fill="#d9d2c5"/>' +
    '<ellipse cx="116" cy="136" rx="22" ry="12" fill="#c58b52" ' + SD_I + '/><circle cx="136" cy="128" r="10" fill="#c58b52" ' + SD_I + '/><path d="M130 122 q-6 10 0 16z" fill="#8a5a2d" ' + SD_I + '/><circle cx="140" cy="127" r="2" fill="#33304a"/><circle cx="146" cy="131" r="3" fill="#33304a"/>' +
    '<ellipse cx="114" cy="112" rx="15" ry="10" fill="#ff9f43" ' + SD_I + '/><circle cx="126" cy="104" r="8" fill="#ff9f43" ' + SD_I + '/><path d="M120 98 l0 -9 l6 6z M128 97 l4 -8 l3 9z" fill="#ff9f43" ' + SD_I + '/><circle cx="129" cy="104" r="1.8" fill="#33304a"/>' +
    '<ellipse cx="112" cy="92" rx="11" ry="9" fill="#fff" ' + SD_I + '/><circle cx="121" cy="82" r="7" fill="#fff" ' + SD_I + '/><path d="M118 74 q3 -9 7 0z" fill="#e5484d" ' + SD_I + '/><path d="M127 83 l7 2 l-7 3z" fill="#ffd23f" ' + SD_I + '/><circle cx="121" cy="81" r="1.6" fill="#33304a"/></g>' +
    [[60, 90, 0], [190, 104, .7], [176, 60, 1.3]].map(n => '<g class="sd-float" style="animation-delay:' + n[2] + 's"><ellipse cx="' + n[0] + '" cy="' + n[1] + '" rx="7" ry="5" fill="#ffd23f" ' + SD_I + '/><path d="M' + (n[0] + 6) + ' ' + n[1] + ' v-24 l9 6" fill="none" stroke="#ffd23f" stroke-width="3" stroke-linecap="round"/></g>').join('') + '</g>' +
    /* f2: la casa tranquilla */
    '<g class="f2"><circle cx="60" cy="52" r="20" fill="#fff5cf"/><circle cx="52" cy="46" r="18" fill="#2f3a78"/>' +
    [0, 1, 2].map(k => '<circle class="sd-puff" style="animation-delay:' + (k * 0.9) + 's" cx="330" cy="76" r="8" fill="#dfe6f5"/>').join('') +
    '<ellipse cx="170" cy="194" rx="30" ry="14" fill="#9aa0aa" ' + SD_I + '/><circle cx="194" cy="188" r="10" fill="#9aa0aa" ' + SD_I + '/><path d="M190 180 l-3 -12 l8 8z" fill="#9aa0aa" ' + SD_I + '/><path d="M192 187 q3 2 6 0" fill="none" stroke="#33304a" stroke-width="2"/>' +
    '<ellipse cx="226" cy="200" rx="14" ry="9" fill="#ff9f43" ' + SD_I + '/><circle cx="238" cy="198" r="6" fill="#ff9f43" ' + SD_I + '/>' +
    '<path d="M104 196 q10 -14 22 0 q-4 -12 -22 0z" fill="#c58b52" ' + SD_I + '/></g>' },

  /* 👑 Il vestito nuovo dell'imperatore: il telaio vuoto dei due tessitori; poi la sfilata, il bambino e l'imperatore con il mantello che non c'è */
  s18: { f2: 5, svg:
    '<rect width="400" height="240" fill="#ffe6b8"/><rect y="196" width="400" height="44" fill="#d8b98a"/>' +
    '<g class="f1"><rect x="26" y="40" width="130" height="150" rx="6" fill="#d9a066" ' + SD_I + '/><rect x="42" y="56" width="98" height="108" fill="#fff8ec" ' + SD_I + '/>' +
    [58, 74, 90, 106, 122].map(x => '<path d="M' + x + ' 56 V164" stroke="#ffd23f" stroke-width="2.5"/>').join('') +
    '<path class="sd-dash" d="M42 110 H140" stroke="#a879ff" stroke-width="4" stroke-dasharray="7 7" fill="none"/>' +
    '<path class="sd-twinkle" d="M130 70 l3 7 l7 3 l-7 3 l-3 7 l-3 -7 l-7 -3 l7 -3z" fill="#ffd23f"/><path class="sd-twinkle" style="animation-delay:.8s" d="M64 138 l3 7 l7 3 l-7 3 l-3 7 l-3 -7 l-7 -3 l7 -3z" fill="#ffd23f"/></g>' +
    '<g class="f2">' + [30, 78, 126, 174].map((x, k) => '<path d="M' + x + ' 20 l24 0 l-12 22z" fill="' + ['#ff7a9c', '#ffd23f', '#4bc0a8', '#a879ff'][k] + '"/>').join('') + '<path d="M20 20 H200" stroke="#33304a" stroke-width="2"/>' +
    [[30, 188], [66, 196], [112, 190]].map((h, k) => '<circle cx="' + h[0] + '" cy="' + h[1] + '" r="12" fill="#ffd9b8" ' + SD_I + '/><path d="M' + (h[0] - 12) + ' 240 q0 -26 12 -26 q12 0 12 26z" fill="' + ['#4bc0a8', '#ff9f43', '#a879ff'][k] + '" ' + SD_I + '/>').join('') +
    '<g class="sd-tap" style="transform-origin:100% 100%"><circle cx="162" cy="160" r="12" fill="#ffd9b8" ' + SD_I + '/><path d="M148 212 q0 -34 14 -34 q14 0 14 34z" fill="#ff7a9c" ' + SD_I + '/><path d="M174 190 L206 150" stroke="#ffd9b8" stroke-width="7" stroke-linecap="round"/></g>' +
    '<text class="sd-pop" x="226" y="140" font-size="40" font-weight="900" font-family="system-ui,sans-serif" fill="#e5484d" stroke="#33304a" stroke-width="1.5">!</text></g>' +
    '<g transform="translate(300 0)"><path class="sd-dash" d="M-40 104 Q-52 170 -46 206 L40 206 Q50 170 40 104Z" fill="none" stroke="#a879ff" stroke-width="4" stroke-dasharray="7 7"/>' +
    '<rect x="-17" y="106" width="34" height="62" rx="12" fill="#fff8ec" ' + SD_I + '/><path d="M-12 168 v34 M12 168 v34" stroke="#33304a" stroke-width="3" stroke-linecap="round"/>' +
    '<circle cx="0" cy="84" r="20" fill="#ffd9b8" ' + SD_I + '/><path d="M-20 70 l6 -22 l10 12 l8 -16 l8 16 l10 -12 l6 22z" fill="#ffd23f" ' + SD_I + '/><circle cx="-7" cy="86" r="2.5" fill="#33304a"/><circle cx="7" cy="86" r="2.5" fill="#33304a"/><path d="M-6 95 q6 5 12 0" fill="none" stroke="#33304a" stroke-width="2.5" stroke-linecap="round"/></g>' },

  /* 🕷️ Anansi e le storie del cielo: il ragno sul suo filo con le quattro prove; poi Nyame nel cielo e le storie che scendono */
  s19: { f2: 6, svg:
    '<rect width="400" height="240" fill="#3a2f6b"/>' + SD_STELLE + '<rect y="204" width="400" height="36" fill="#5b8a5a"/>' +
    '<g class="f1"><path d="M60 204 q-10 -26 14 -34 q20 -6 18 -28 q22 14 4 34 q14 10 -2 28z" fill="#4bc0a8" ' + SD_I + '/><circle cx="84" cy="136" r="3" fill="#33304a"/>' +
    '<circle cx="330" cy="190" r="20" fill="#e0b24a" ' + SD_I + '/><path d="M326 168 q4 -10 12 -2" fill="none" stroke="#7a4a2a" stroke-width="4"/><circle class="sd-float" cx="316" cy="150" r="4" fill="#ffd23f"/><circle class="sd-float" style="animation-delay:.6s" cx="332" cy="146" r="4" fill="#ffd23f"/>' +
    '<circle cx="258" cy="190" r="16" fill="#ff9f43" ' + SD_I + '/><circle cx="252" cy="186" r="3" fill="#7a4a2a"/><circle cx="266" cy="192" r="3" fill="#7a4a2a"/><circle cx="256" cy="198" r="2.5" fill="#7a4a2a"/><path d="M246 178 l-4 -8 l9 3z M270 178 l4 -8 l-9 3z" fill="#ff9f43" ' + SD_I + '/>' +
    '<circle cx="170" cy="176" r="7" fill="#ffd9b8" ' + SD_I + '/><path d="M158 202 q0 -20 12 -20 q12 0 12 20z" fill="#ff7a9c" ' + SD_I + '/><path d="M158 186 q-12 -10 -14 2 q8 6 14 -2z M182 186 q12 -10 14 2 q-8 6 -14 -2z" fill="#dff6ff" ' + SD_I + '/></g>' +
    '<g class="f2"><circle class="sd-glow" cx="200" cy="34" r="40" fill="#ffe08a" opacity=".4"/><circle cx="200" cy="34" r="24" fill="#ffd23f" ' + SD_I + '/><g class="sd-spinslow">' + [0, 45, 90, 135, 180, 225, 270, 315].map(a => '<path d="M200 -8 v12" stroke="#ffd23f" stroke-width="5" stroke-linecap="round" transform="rotate(' + a + ' 200 34)"/>').join('') + '</g>' +
    [[120, 120, '#ff7a9c', 0], [276, 130, '#4bc0a8', .6], [330, 190, '#a879ff', 1.2]].map(b => '<g class="sd-float" style="animation-delay:' + b[3] + 's"><rect x="' + (b[0] - 22) + '" y="' + (b[1] - 14) + '" width="44" height="28" rx="10" fill="' + b[2] + '" ' + SD_I + '/><path d="M' + (b[0] - 6) + ' ' + (b[1] + 14) + ' l-4 10 l14 -10z" fill="' + b[2] + '" ' + SD_I + '/><path d="M' + (b[0] - 12) + ' ' + b[1] + ' h24" stroke="#fff" stroke-width="3" stroke-linecap="round"/></g>').join('') + '</g>' +
    '<g class="f1"><path d="M200 60 V104" stroke="#fff" stroke-width="2.5"/></g>' +
    '<g class="sd-sway" style="transform-origin:50% 0%"><path d="M200 60 V110" stroke="#fff" stroke-width="2.5"/>' +
    '<g stroke="#33304a" stroke-width="3.5" stroke-linecap="round" fill="none"><path d="M184 118 q-18 -8 -26 6 M186 126 q-22 0 -28 14 M214 118 q18 -8 26 6 M214 126 q22 0 28 14 M188 134 q-14 12 -12 24 M212 134 q14 12 12 24 M190 112 q-10 -10 -22 -6 M210 112 q10 -10 22 -6"/></g>' +
    '<ellipse cx="200" cy="130" rx="18" ry="22" fill="#7a4a2a" ' + SD_I + '/><circle cx="200" cy="108" r="13" fill="#9b6a3c" ' + SD_I + '/><circle cx="195" cy="106" r="4" fill="#fff"/><circle cx="205" cy="106" r="4" fill="#fff"/><circle cx="196" cy="107" r="2" fill="#33304a"/><circle cx="206" cy="107" r="2" fill="#33304a"/><path d="M195 114 q5 4 10 0" fill="none" stroke="#33304a" stroke-width="2.5" stroke-linecap="round"/></g>' },

  /* 👠 Le dodici principesse danzanti: le scarpe consumate e la botola, il soldato con il mantello; poi i boschi d argento, d oro e di diamanti e il lago con le barche */
  s20: { f2: 4, svg:
    '<rect width="400" height="240" fill="#3b2f6b"/>' + SD_STELLE +
    '<g class="f1"><rect y="170" width="400" height="70" fill="#9b6a8a"/><rect x="40" y="46" width="90" height="96" rx="8" fill="#2a2458" ' + SD_I + '/><circle cx="96" cy="86" r="16" fill="#fff5cf"/><circle cx="90" cy="82" r="15" fill="#2a2458"/><path d="M85 46 v96 M40 94 h90" ' + SD_I + ' fill="none"/>' +
    '<rect x="196" y="186" width="90" height="40" rx="4" fill="#6b4a36" ' + SD_I + '/><circle cx="270" cy="206" r="5" fill="#ffd23f" ' + SD_I + '/>' +
    [0, 1, 2, 3, 4, 5].map(k => '<g transform="translate(' + (24 + k * 30) + ' 200)"><path d="M0 16 q0 -14 14 -14 q6 0 6 8 l8 6 v6z" fill="' + ['#ff7a9c', '#ffd23f', '#4bc0a8', '#a879ff', '#ff9f43', '#7fb2ff'][k] + '" ' + SD_I + '/>' + (k % 2 ? '<circle cx="10" cy="14" r="3" fill="#33304a"/>' : '') + '</g>').join('') +
    '<g class="sd-glow"><path d="M330 110 Q326 150 322 200 L372 200 Q368 150 364 110 Q347 100 330 110z" fill="none" stroke="#fff5cf" stroke-width="4" stroke-dasharray="7 7"/><circle cx="347" cy="94" r="14" fill="none" stroke="#fff5cf" stroke-width="4" stroke-dasharray="6 6"/></g></g>' +
    '<g class="f2"><rect y="150" width="400" height="90" fill="#2d6f9a"/><path class="sd-wave" d="M-40 170 q20 -10 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 v70 h-520z" fill="#4a95c8"/>' +
    [[50, '#dfe6f0'], [130, '#ffd23f'], [210, '#9fe8ff']].map((t, k) => '<g class="sd-sway" style="animation-delay:' + (k * .5) + 's;transform-origin:50% 100%"><rect x="' + (t[0] - 5) + '" y="84" width="10" height="64" fill="#7a4a2a" ' + SD_I + '/><circle cx="' + t[0] + '" cy="70" r="30" fill="' + t[1] + '" ' + SD_I + '/><path d="M' + (t[0] - 10) + ' 66 l8 -8 M' + (t[0] + 6) + ' 76 l8 -8" stroke="#fff" stroke-width="3" stroke-linecap="round"/></g>').join('') +
    '<path d="M264 140 q40 -26 80 0 l-12 26 h-56z" fill="#a5523f" ' + SD_I + '/><path d="M300 90 v50 M300 94 h-28 q10 20 28 26z" stroke="#33304a" stroke-width="3" fill="#fff"/>' +
    [[300, 126], [340, 112], [376, 126]].map((p, k) => '<g class="sd-float" style="animation-delay:' + (k * .5) + 's"><circle cx="' + p[0] + '" cy="' + (p[1] - 18) + '" r="9" fill="#ffd9b8" ' + SD_I + '/><path d="M' + (p[0] - 14) + ' ' + (p[1] + 18) + ' L' + p[0] + ' ' + (p[1] - 8) + ' L' + (p[0] + 14) + ' ' + (p[1] + 18) + 'z" fill="' + ['#ff7a9c', '#a879ff', '#4bc0a8'][k] + '" ' + SD_I + '/></g>').join('') + '</g>' },

  /* 🐭 Il marito della signorina Talpa: il sole, la nuvola e il vento; poi la statua di pietra e le due talpe */
  s21: { f2: 5, svg:
    '<rect width="400" height="240" fill="#bfe3ff"/>' +
    '<path d="M0 170 Q100 130 200 160 T400 150 V240 H0Z" fill="#7bc47f" ' + SD_I + '/><rect y="206" width="400" height="34" fill="#8a6248"/>' +
    '<g class="f1"><g class="sd-spinslow">' + [0, 40, 80, 120, 160, 200, 240, 280, 320].map(a => '<path d="M70 20 v12" stroke="#ffd23f" stroke-width="5" stroke-linecap="round" transform="rotate(' + a + ' 70 60)"/>').join('') + '</g><circle cx="70" cy="60" r="26" fill="#ffd23f" ' + SD_I + '/>' +
    '<g class="sd-drift"><ellipse cx="190" cy="60" rx="40" ry="20" fill="#fff" ' + SD_I + '/><ellipse cx="226" cy="52" rx="30" ry="18" fill="#fff" ' + SD_I + '/><ellipse cx="160" cy="68" rx="24" ry="14" fill="#fff" ' + SD_I + '/></g>' +
    '<g class="sd-wave"><path d="M270 104 h90 q18 0 18 -12 q0 -12 -14 -8 M280 124 h60 q14 0 14 10 q0 10 -12 8" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/></g></g>' +
    '<g class="f2"><path d="M60 170 q-6 -64 14 -90 q8 -12 22 0 q20 26 14 90z" fill="#aab2bd" ' + SD_I + '/><circle cx="85" cy="76" r="22" fill="#b9c0ca" ' + SD_I + '/><path d="M76 74 q4 -3 8 0 M88 74 q4 -3 8 0 M80 86 q6 4 12 0" fill="none" stroke="#33304a" stroke-width="2.5" stroke-linecap="round"/>' +
    [0, 1, 2].map(k => '<path class="sd-heart" style="animation-delay:' + (k * .8) + 's" d="M' + (330 + k * 14) + ' 168 c-6 -8 -16 0 -8 8 l8 7 l8 -7 c8 -8 -2 -16 -8 -8z" fill="#ff5c8a"/>').join('') +
    '<g><path d="M284 206 q-6 -22 16 -24 q22 2 16 24z" fill="#6b5b6e" ' + SD_I + '/><circle cx="318" cy="196" r="3" fill="#ff9fb5"/><circle cx="302" cy="192" r="2" fill="#fff"/></g></g>' +
    '<ellipse cx="236" cy="206" rx="54" ry="20" fill="#6b4a36" ' + SD_I + '/>' +
    '<g class="sd-pop"><ellipse cx="226" cy="192" rx="22" ry="17" fill="#6b5b6e" ' + SD_I + '/><ellipse cx="206" cy="188" rx="10" ry="8" fill="#ff9fb5" ' + SD_I + '/><path d="M218 184 q4 -3 8 0" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/><path d="M226 186 q4 -3 8 0" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/><circle cx="240" cy="177" r="5" fill="#ff7a9c"/><circle cx="246" cy="181" r="4" fill="#ffd23f"/><ellipse cx="212" cy="204" rx="8" ry="5" fill="#ffd9b8" ' + SD_I + '/></g>' },

  /* 🌌 Come nacquero la luna e le stelle: il cielo di corallo vicinissimo, la donna che pesta il riso; poi il cielo alto, la luna e le stelle */
  s22: { f2: 5, svg:
    '<rect width="400" height="240" fill="#8fd0e8"/>' +
    '<g class="f1"><path d="M0 0 H400 V86 q-20 16 -40 0 q-20 14 -40 0 q-20 16 -40 0 q-20 14 -40 0 q-20 16 -40 0 q-20 14 -40 0 q-20 16 -40 0 q-20 14 -40 0 q-20 16 -40 0z" fill="#f4cdb8" ' + SD_I + '/>' +
    [[40, 30], [120, 50], [200, 24], [290, 54], [360, 30]].map(c => '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="9" fill="#e8b49a"/>').join('') +
    '<g class="sd-sway" style="transform-origin:50% 0%"><path d="M118 86 q-6 30 4 42 q10 -12 4 -42" fill="none" stroke="#33304a" stroke-width="2"/>' + ['#ff7a9c', '#ffd23f', '#4bc0a8', '#a879ff'].map((c, k) => '<circle cx="' + (112 + k * 4) + '" cy="' + (96 + k * 9) + '" r="5" fill="' + c + '" ' + SD_I + '/>').join('') + '</g>' +
    '<g class="sd-sway" style="transform-origin:50% 0%;animation-delay:.5s"><path d="M168 86 v8" stroke="#33304a" stroke-width="2"/><rect x="156" y="94" width="26" height="12" rx="2" fill="#e8b24a" ' + SD_I + '/>' + [0, 1, 2, 3, 4].map(k => '<path d="M' + (160 + k * 5) + ' 106 v8" stroke="#33304a" stroke-width="2" stroke-linecap="round"/>').join('') + '</g></g>' +
    '<g class="f2"><rect width="400" height="240" fill="#26306b"/>' + SD_STELLE + [[60, 90], [140, 50], [240, 90], [330, 60], [96, 130], [300, 120]].map((p, k) => '<circle class="sd-twinkle" style="animation-delay:' + (k * .4) + 's" cx="' + p[0] + '" cy="' + p[1] + '" r="4" fill="#ffd23f"/>').join('') +
    '<path d="M196 30 q-26 20 -6 52 q-34 -4 -34 -34 q4 -28 40 -18z" fill="#fff5cf" transform="translate(70 0)"/>' + '</g>' +
    '<rect y="196" width="400" height="44" fill="#6a9a5a"/><path d="M0 196 q40 -14 80 0 t80 0 t80 0 t80 0 t80 0 V240 H0z" fill="#6a9a5a" ' + SD_I + '/>' +
    '<path d="M240 160 h70 l-8 40 h-54z" fill="#a5703f" ' + SD_I + '/><ellipse cx="275" cy="160" rx="35" ry="7" fill="#7a4a2a" ' + SD_I + '/>' +
    '<g class="f1"><g class="sd-tap" style="transform-origin:50% 100%"><path d="M262 54 L270 164" stroke="#8a6248" stroke-width="9" stroke-linecap="round"/><path d="M262 54 L270 164" stroke="#33304a" stroke-width="2" stroke-linecap="round" fill="none"/></g></g>' +
    '<g><circle cx="190" cy="148" r="14" fill="#ffd9b8" ' + SD_I + '/><path d="M176 146 q0 -20 14 -18 q16 0 14 20 q-6 -10 -14 -10 q-8 0 -14 8z" fill="#33304a" ' + SD_I + '/><path d="M172 208 q0 -40 18 -40 q18 0 18 40z" fill="#ff7a9c" ' + SD_I + '/><path d="M206 176 L250 150" stroke="#ffd9b8" stroke-width="7" stroke-linecap="round"/></g>' +
    '<g class="f2"><path d="M262 120 L300 190" stroke="#8a6248" stroke-width="9" stroke-linecap="round"/></g>' },

  /* 🪕 L'arpa delle fate: la casetta, l'arpa magica e le note; poi le montagne e le lucine delle fate */
  s23: { f2: 6, svg:
    '<rect width="400" height="240" fill="#2a3a7a"/>' + SD_STELLE +
    '<circle cx="332" cy="52" r="20" fill="#fff5cf"/><circle cx="324" cy="46" r="18" fill="#2a3a7a"/>' +
    '<path d="M-10 196 L90 100 L170 170 L250 90 L330 160 L410 120 V240 H-10Z" fill="#4a5f9a" ' + SD_I + '/><path d="M-10 214 Q100 170 200 196 T410 190 V240 H-10Z" fill="#4f9a6a" ' + SD_I + '/>' +
    '<g class="f1"><rect x="40" y="152" width="80" height="58" fill="#e0ad72" ' + SD_I + '/><path d="M30 154 L80 112 L130 154Z" fill="#a5523f" ' + SD_I + '/><rect class="sd-glow" x="68" y="170" width="24" height="40" rx="3" fill="#ffd23f" ' + SD_I + '/>' +
    '<g class="sd-sway" style="transform-origin:50% 100%"><path d="M300 214 V66 Q262 50 246 104 L258 214 Z" fill="#ffd23f" ' + SD_I + '/>' + [0, 1, 2, 3, 4, 5].map(k => '<path d="M' + (292 - k * 7) + ' ' + (72 + k * 5) + ' L' + (292 - k * 5.5) + ' 206" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>').join('') + '<path d="M244 214 h64" ' + SD_I + '/></g>' +
    [[196, 120, 0], [320, 120, .7], [300, 70, 1.3]].map(n => '<g class="sd-float" style="animation-delay:' + n[2] + 's"><ellipse cx="' + n[0] + '" cy="' + n[1] + '" rx="7" ry="5" fill="#ff9fb5" ' + SD_I + '/><path d="M' + (n[0] + 6) + ' ' + n[1] + ' v-22 l9 6" fill="none" stroke="#ff9fb5" stroke-width="3" stroke-linecap="round"/></g>').join('') + '</g>' +
    '<g class="f2">' + [[70, 120, '#9fffb8'], [130, 80, '#ffe08a'], [200, 120, '#9fffb8'], [260, 60, '#ffe08a'], [320, 110, '#9fffb8'], [370, 160, '#ffe08a'], [110, 170, '#ffe08a']].map((p, k) => '<g class="sd-float" style="animation-delay:' + (k * .45) + 's"><circle class="sd-glow" cx="' + p[0] + '" cy="' + p[1] + '" r="9" fill="' + p[2] + '" opacity=".35"/><circle cx="' + p[0] + '" cy="' + p[1] + '" r="4" fill="' + p[2] + '"/><path d="M' + (p[0] - 3) + ' ' + p[1] + ' q-9 -8 -12 0 q8 2 12 0z M' + (p[0] + 3) + ' ' + p[1] + ' q9 -8 12 0 q-8 2 -12 0z" fill="#fff" opacity=".8"/></g>').join('') + '<path class="sd-twinkle" d="M200 40 q8 -10 16 0" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/></g>' },

  /* 🦋 La bambina dei bruchi: la foglia con il bruco e la bambina con la lente; poi la farfalla e il quaderno dei disegni */
  s24: { f2: 4, svg:
    '<rect width="400" height="240" fill="#fbf1da"/><rect y="204" width="400" height="36" fill="#a5d6a0"/>' +
    '<path d="M180 220 Q196 120 210 60" stroke="#4f9a5a" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M200 130 q70 -40 130 8 q-60 44 -130 -8z" fill="#7bc47f" ' + SD_I + '/><path d="M200 130 q60 -8 120 8" fill="none" stroke="#4f9a5a" stroke-width="3"/>' +
    '<path d="M204 90 q-60 -30 -100 14 q54 30 100 -14z" fill="#7bc47f" ' + SD_I + '/>' +
    '<g class="f1"><g class="sd-sway" style="transform-origin:0% 100%">' + [0, 1, 2, 3, 4].map(k => '<circle cx="' + (234 + k * 16) + '" cy="' + (118 - Math.sin(k * 1.2) * 3 - k * 2) + '" r="' + (k == 4 ? 10 : 9) + '" fill="' + (k == 4 ? '#ffd23f' : '#9fd45a') + '" ' + SD_I + '/>').join('') + '<circle cx="302" cy="106" r="2" fill="#33304a"/></g></g>' +
    '<g class="f2"><path d="M118 40 v22" stroke="#33304a" stroke-width="2.5"/><ellipse cx="118" cy="76" rx="8" ry="16" fill="#c9a66b" ' + SD_I + '/>' +
    '<g class="sd-pop"><path d="M300 90 q-40 -50 -50 -10 q4 30 50 10z" fill="#ff9f43" ' + SD_I + '/><path d="M300 90 q40 -50 50 -10 q-4 30 -50 10z" fill="#ff9f43" ' + SD_I + '/><path d="M300 98 q-30 36 -44 12 q4 -14 44 -12z" fill="#ffd23f" ' + SD_I + '/><path d="M300 98 q30 36 44 12 q-4 -14 -44 -12z" fill="#ffd23f" ' + SD_I + '/><circle cx="270" cy="84" r="5" fill="#fff"/><circle cx="330" cy="84" r="5" fill="#fff"/><rect x="296" y="80" width="8" height="30" rx="4" fill="#33304a"/></g>' +
    '<g transform="rotate(-6 70 190)"><rect x="24" y="168" width="90" height="48" rx="4" fill="#fff" ' + SD_I + '/><path d="M69 168 v48" ' + SD_I + '/><path d="M36 196 q10 -18 24 -4" fill="none" stroke="#7bc47f" stroke-width="3"/><circle cx="90" cy="190" r="5" fill="#ff9f43"/><circle cx="100" cy="196" r="4" fill="#ffd23f"/></g></g>' +
    '<g><circle cx="64" cy="140" r="18" fill="#ffd9b8" ' + SD_I + '/><path d="M46 138 q0 -22 18 -20 q18 -2 18 20 q-8 -8 -18 -8 q-10 0 -18 8z" fill="#7a4a2a" ' + SD_I + '/><path d="M48 142 q-6 16 0 30 M80 142 q6 16 0 30" fill="none" stroke="#7a4a2a" stroke-width="5" stroke-linecap="round"/><circle cx="58" cy="143" r="2" fill="#33304a"/><circle cx="70" cy="143" r="2" fill="#33304a"/><path d="M59 150 q5 4 10 0" fill="none" stroke="#33304a" stroke-width="2" stroke-linecap="round"/>' +
    '<path d="M44 220 q0 -44 20 -44 q20 0 20 44z" fill="#ff7a9c" ' + SD_I + '/>' +
    '<g class="sd-tap" style="transform-origin:0% 100%"><path d="M82 188 L120 156" stroke="#ffd9b8" stroke-width="6" stroke-linecap="round"/><circle cx="136" cy="140" r="16" fill="#dcedff" fill-opacity=".7" ' + SD_I + '/><path d="M124 152 L116 160" stroke="#7a4a2a" stroke-width="5" stroke-linecap="round"/></g></g>' }
};
