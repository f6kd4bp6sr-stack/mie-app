/* 🖼️ disegni di Cultura digitale (8/11/2026): uno per scheda e uno per l'introduzione, stile dei disegni Ikigai.
   Mostrano solo il senso della scheda (nessun fatto nuovo); testi italiani ≥14 nel disegno, colori a opacità media, currentColor per il testo.
   Caricati insieme a cultura-dati.js (solo quando si apre la sezione). */
(()=>{
const T=(x,y,s,t,o)=>{o=o||{};return `<text x="${x}" y="${y}" font-size="${s}" text-anchor="${o.a||"middle"}" font-weight="${o.b||700}" fill="${o.c||"currentColor"}"${o.op?` opacity="${o.op}"`:""}>${t}</text>`;},
E=(x,y,s,e)=>`<text x="${x}" y="${y}" font-size="${s}" text-anchor="middle">${e}</text>`,
B=(x,y,w,h,c,r)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r==null?12:r}" fill="${c}" fill-opacity=".13" stroke="${c}" stroke-opacity=".6" stroke-width="2"/>`,
A=(x1,y,x2,c)=>`<line x1="${x1}" y1="${y}" x2="${x2-9}" y2="${y}" stroke="${c||"currentColor"}" stroke-width="2.5" opacity=".65"/><polygon points="${x2-10},${y-6} ${x2},${y} ${x2-10},${y+6}" fill="${c||"currentColor"}" opacity=".65"/>`,
Ln=(x,y,w,o)=>`<rect x="${x}" y="${y}" width="${w}" height="5" rx="2.5" fill="currentColor" opacity="${o||.25}"/>`,
S=(l,b,h)=>`<svg viewBox="0 0 520 ${h||200}" role="img" aria-label="${l}" class="cd-svg">${b}</svg>`,
C={b:"#0e7490",u:"#2563eb",p:"#dc2626",w:"#d97706",k:"#db2777",g:"#16a34a",v:"#7c3aed",s:"#64748b"};
const tok=()=>{const W=["Ci","ao",",","mi","aiut","i","con","la","gita","di","dom","ani","?"];let x=22,o="",x5=0,xe=0;W.forEach((t,i)=>{const w=t.length*8+14;if(i===5)x5=x;const f=i<5;o+=`<rect x="${x}" y="64" width="${w}" height="32" rx="7" fill="${C.b}" fill-opacity="${f?".08":".2"}" stroke="${C.b}" stroke-opacity="${f?".3":".7"}" stroke-width="1.5"/>`+T(x+w/2,86,15,t,{op:f?".45":""});x+=w+5;xe=x;});
  return o+`<rect x="${x5-7}" y="52" width="${xe-x5+9}" height="56" rx="12" fill="none" stroke="${C.b}" stroke-width="3.5"/>`+T((x5+xe)/2,132,14,"🪟 ciò che il modello vede ora")+T(80,132,14,"← esce o si riassume",{op:".75"});};
CD_INTRO=`<svg viewBox="0 0 900 236" role="img" aria-label="Come funziona il percorso: leggi la scheda, fai la prova, rispondi a tre domande; la scheda è fatta e le domande tornano nel ripasso dopo 1, 3, 7, 14, 30 e 60 giorni; con 4 schede del livello 2 si apre il livello 3" class="cd-svg cd-intro-svg">${T(450,26,16,"una scheda alla volta: leggi, prova, rispondi, poi il ripasso",{b:800})}
<path d="M75,96 L675,96" stroke="${C.b}" stroke-width="26" stroke-linecap="round" opacity=".14"/>
${[[75,"📄","la scheda","leggi e ricorda",C.b],[225,"🧪","la prova","una richiesta",C.u],[375,"❓","tre domande","tutte giuste…",C.v],[525,"✅","fatta!","la scheda è tua",C.g],[675,"🔁","il ripasso","a intervalli",C.w]].map(([x,e,t,u,c],i)=>`<circle cx="${x}" cy="96" r="36" fill="${c}" fill-opacity=".18" stroke="${c}" stroke-opacity=".7" stroke-width="2.5"/>${E(x,107,32,e)}${T(x,154,15,t,{b:800})}${T(x,173,14,u,{b:600})}${i<4?A(x+42,96,x+118,c):""}`).join("")}
${[1,3,7,14,30,60].map((n,i)=>{const y=56+i*24;return `<rect x="772" y="${y-15}" width="122" height="20" rx="10" fill="${C.w}" fill-opacity="${.12+i*.05}"/>`+T(833,y,14,n===1?"dopo 1 giorno":"dopo "+n+" giorni",{b:700});}).join("")}
<rect x="30" y="192" width="740" height="36" rx="18" fill="${C.g}" fill-opacity=".12"/>${T(60,216,15,"🌿 livello 2 · Intermedio",{a:"start",b:800})}${A(300,210,350,C.g)}${T(362,216,15,"4 schede fatte  🔓",{a:"start",b:800})}${A(540,210,590,C.g)}${T(600,216,15,"🌳 livello 3 · Avanzato",{a:"start",b:800})}${T(838,216,14,"📚 letture",{b:700})}${T(838,234,14,"📰 novità",{b:700})}</svg>`;
CD_IMG={
"b2-inventa":S("Una risposta scritta con sicurezza, controllata con la lente: la fonte non esiste; e la linea del tempo che si ferma alla data di aggiornamento",
 T(260,22,15,"scritto con sicurezza non vuol dire vero",{b:800})+E(46,98,40,"🤖")+B(84,38,196,74,C.u,16)+T(182,68,15,"«Certo! Ecco il libro",{b:700})+T(182,90,15,"che cercavi…»",{b:700})+A(290,76,340)+E(368,88,34,"🔎")+B(398,38,108,74,C.p)+T(452,68,15,"la fonte?",{b:800})+T(452,92,15,"non esiste ✗",{c:C.p,b:800})
 +`<line x1="30" y1="150" x2="300" y2="150" stroke="${C.b}" stroke-width="5" stroke-linecap="round" opacity=".6"/><line x1="300" y1="150" x2="490" y2="150" stroke="${C.b}" stroke-width="3" stroke-dasharray="6 7" opacity=".45"/>`+E(300,140,24,"📅")+T(130,176,14,"i fatti che conosce",{b:600})+T(300,176,14,"data di aggiornamento",{b:800})+T(456,140,18,"?",{op:".7",b:900})+T(456,176,14,"dopo: non sa",{b:600})+T(260,196,14,"apri i link e leggi tu la fonte",{op:".85",b:600})),
"u2-circolare":S("Un documento di molte pagine diventa una piccola mappa con i riferimenti agli articoli; le decisioni si prendono sul testo originale",
 T(260,22,15,"ogni punto con il suo articolo o paragrafo",{b:800})+[0,1,2].map(i=>`<rect x="${30+i*10}" y="${40+i*8}" width="96" height="118" rx="6" fill="${C.s}" fill-opacity="${.10+i*.06}" stroke="currentColor" stroke-opacity=".45" stroke-width="1.5"/>`).join("")+[0,1,2,3,4,5,6].map(i=>Ln(62,74+i*12,i%3===2?44:62)).join("")+T(100,186,14,"molte pagine",{b:700})
 +A(160,104,206)+B(214,44,130,116,C.u)+[[240,76,"art. 3"],[300,104,"§ 2"],[250,136,"scadenze"]].map(([x,y,t])=>E(x,y,18,"📍")+T(x+14,y,14,t,{a:"start",b:800})).join("")+T(279,186,14,"il riassunto: una mappa",{b:700})
 +A(352,104,396)+E(446,98,38,"📜")+T(446,132,14,"si decide sul",{b:700})+T(446,150,14,"testo originale ✓",{b:800,c:C.g})),
"u2-organizza":S("Una settimana organizzata a tappe e una lezione che finisce con tre domande; orari e prezzi si controllano sui siti ufficiali",
 T(260,22,15,"un piano a tappe, con tempi realistici",{b:800})+[["lunedì","🛒","la spesa"],["mercoledì","🚆","la gita"],["venerdì","🍝","la cena"]].map(([d,e,t],i)=>{const x=22+i*100;return B(x,38,92,112,C.u)+`<rect x="${x}" y="38" width="92" height="26" rx="12" fill="${C.u}" fill-opacity=".25"/>`+T(x+46,57,14,d,{b:800})+E(x+46,104,30,e)+T(x+46,136,14,t,{b:700});}).join("")
 +B(326,38,182,80,C.v)+E(368,80,28,"📖")+T(368,106,14,"lezione",{b:700})+A(392,78,428,C.v)+E(462,80,28,"❓")+T(462,106,14,"3 domande",{b:700})
 +T(417,142,14,"orari e prezzi:",{b:700})+T(417,160,14,"sito ufficiale ✓",{b:800,c:C.g})+T(170,182,14,"dieta e sport: per i dubbi, il medico 🩺",{b:600})),
"p2-truffe":S("Una telefonata con una voce clonata chiede soldi subito; le difese: parola d'ordine di famiglia, riattaccare e richiamare, niente fretta",
 T(260,22,15,"la voce sembra vera: fermati e richiama tu",{b:800})+E(62,128,70,"📱")+B(118,38,186,64,C.p,16)+T(211,64,15,"«Ciao papà, servono",{b:700})+T(211,86,15,"soldi, subito!»",{b:700})
 +`<path d="M130,128 q10,-14 20,0 t20,0 t20,0 t20,0 t20,0" stroke="${C.p}" stroke-width="3" fill="none" opacity=".6"/>`+E(250,134,26,"🎭")+T(214,160,14,"voce clonata",{b:800,c:C.p})
 +B(320,38,186,124,C.g)+T(413,62,15,"le difese",{b:800})+T(336,92,14,"🔑 parola d'ordine",{a:"start"})+T(336,118,14,"📞 riattacca e richiama",{a:"start"})+T(336,144,14,"⏳ niente fretta",{a:"start"})+T(260,190,14,"chi mette fretta, di solito, truffa",{b:800,c:C.p})),
"p2-privacy":S("Il pannello delle impostazioni con gli interruttori: uso delle chat per l'addestramento, chat temporanea, cronologia; da ricontrollare una volta l'anno",
 T(260,22,15,"le impostazioni della privacy: dai un'occhiata",{b:800})+B(24,38,306,140,C.b)+T(44,62,14,"⚙️ impostazioni",{a:"start",b:800})+[["chat usate per addestrare",0],["chat temporanea",1],["cronologia salvata",0]].map(([t,on],i)=>{const y=96+i*30;return T(44,y,14,t,{a:"start",b:600})+`<rect x="262" y="${y-16}" width="46" height="22" rx="11" fill="${on?C.g:C.s}" fill-opacity="${on?".75":".35"}"/><circle cx="${on?297:273}" cy="${y-5}" r="8" fill="#fff"/>`;}).join("")
 +E(424,82,40,"📅")+T(424,116,14,"una volta l'anno",{b:800})+T(424,134,14,"ricontrolla i menù",{b:600})+T(424,166,14,"sempre: niente",{b:800,c:C.p})+T(424,184,14,"dati personali",{b:800,c:C.p})),
"k2-insieme":S("Tre tappe: prima provi tu, poi lo usate insieme, poi controllate sul libro; mai nome, scuola, indirizzo o foto nella chat",
 T(260,22,15,"l'IA si usa insieme, seduti vicini",{b:800})+[["🧑","1 · prima","provo io"],["👨‍👧","2 · la usiamo","insieme"],["📖","3 · si controlla","sul libro"]].map(([e,a,b],i)=>{const x=20+i*170;return B(x,38,140,108,C.k)+E(x+70,84,34,e)+T(x+70,114,14,a,{b:800})+T(x+70,134,14,b,{b:700})+(i<2?A(x+144,92,x+168,C.k):"");}).join("")
 +T(260,174,14,"mai nella chat: nome · scuola · indirizzo · foto 🚫",{b:800,c:C.p})+T(260,194,14,"e parlate insieme di foto e video falsi",{b:600,op:".85"})),
"b3-tecniche":S("Tre tecniche: ragionare per tappe e controllare, farsi fare le domande prima, scrivere una volta le istruzioni fisse",
 T(260,22,15,"tre tecniche per richieste esperte",{b:800})+[["🪜","ragiona","per tappe","e controlla",C.b],["🙋","fammi tu","le domande","prima",C.u],["📌","istruzioni","fisse","per ogni chat",C.v]].map(([e,a,b,c,k],i)=>{const x=20+i*170;return B(x,38,140,150,k)+`<circle cx="${x+22}" cy="60" r="13" fill="${k}" fill-opacity=".8"/>`+T(x+22,65,14,i+1,{b:900,c:"#fff"})+E(x+70,96,32,e)+T(x+70,130,15,a,{b:800})+T(x+70,150,15,b,{b:800})+T(x+70,170,14,c,{b:600});}).join("")),
"u3-foto-tradurre":S("Una foto inquadra un cartello in un'altra lingua e diventa una traduzione; sì a cartelli, menù e istruzioni, no a moduli compilati, documenti e volti",
 T(260,22,15,"fotografa, poi chiedi: traduci o spiega",{b:800})+B(40,46,150,92,C.s,8)+[0,1,2].map(i=>`<path d="M58,${72+i*22} q12,-8 24,0 t24,0 t24,0 t24,0 t24,0" stroke="currentColor" stroke-width="3" fill="none" opacity=".5"/>`).join("")
 +`<path d="M28,58 V36 H50 M180,36 H202 V58 M202,128 V150 H180 M50,150 H28 V128" stroke="${C.u}" stroke-width="4" fill="none" stroke-linecap="round"/>`+E(115,178,22,"📷")
 +A(212,92,248)+B(254,62,104,58,C.u,16)+T(306,88,15,"traduzione",{b:800})+T(306,108,14,"e spiegazione",{b:600})
 +T(374,56,14,"✓ cartelli, menù",{a:"start",c:C.g,b:800})+T(374,78,14,"✓ istruzioni",{a:"start",c:C.g,b:800})+T(374,112,14,"✗ moduli compilati",{a:"start",c:C.p,b:800})+T(374,134,14,"✗ documenti, volti",{a:"start",c:C.p,b:800})+T(374,178,14,"numeri piccoli?",{a:"start",b:600})+T(374,196,14,"ricontrolla",{a:"start",b:600})),
"p3-aiact":S("Le stelle europee e la linea del tempo dell'AI Act: in vigore nel 2024, i divieti dal 2025, la trasparenza dal 2026, alcune regole spostate al 2027 e 2028",
 T(260,22,15,"AI Act: le regole europee arrivano a tappe",{b:800})+`<circle cx="66" cy="104" r="48" fill="#1d4ed8" fill-opacity=".75"/>`+Array.from({length:12},(_,i)=>{const a=i*Math.PI/6;return `<text x="${(66+34*Math.sin(a)).toFixed(1)}" y="${(109-34*Math.cos(a)).toFixed(1)}" font-size="14" text-anchor="middle" fill="#facc15">★</text>`;}).join("")
 +`<line x1="132" y1="104" x2="506" y2="104" stroke="currentColor" stroke-width="2.5" opacity=".45"/>`+[[170,"2024","in vigore"],[260,"2025","divieti"],[350,"2026","trasparenza"],[452,"2027-28","alcune regole","slittano"]].map(([x,y,a,b])=>`<circle cx="${x}" cy="104" r="8" fill="${C.u}"/>`+T(x,88,15,y,{b:900})+T(x,130,14,a,{b:700})+(b?T(x,148,14,b,{b:700}):"")).join("")
 +T(320,188,14,"💬 «sono un'IA» · 🏷️ deepfake dichiarati",{b:800})),
"p3-segnalare":S("Cinque passi in fila: fermati, salva le prove, chiama la banca se hai dato i dati, segnala alla Polizia Postale, il Garante per volto o voce usati senza consenso",
 T(260,22,15,"se succede: un passo alla volta",{b:800})+`<path d="M55,92 H455" stroke="currentColor" stroke-width="3" stroke-dasharray="8 7" opacity=".4"/>`+[["✋","fermati","niente clic",C.p],["📸","salva prove","schermate",C.w],["🏦","banca","carta data?",C.u],["👮","Polizia Postale","anche online",C.b],["⚖️","Garante","volto, voce",C.v]].map(([e,a,b,c],i)=>{const x=55+i*100;return `<circle cx="${x}" cy="92" r="32" fill="${c}" fill-opacity=".18" stroke="${c}" stroke-opacity=".7" stroke-width="2.5"/>`+E(x,102,28,e)+T(x,146,14,a,{b:800})+T(x,166,14,b,{b:600,op:".85"});}).join("")
 +T(260,194,14,"prima ci si ferma, poi si segnala",{b:700,op:".85"})),
"k3-segnali":S("Quattro segnali da notare e una chiacchierata tranquilla tra un adulto e una bambina: che cosa ti piace dell'IA?",
 T(260,22,15,"segnali da notare, poi parlarne con calma",{b:800})+["compiti fatti dall'IA","risposte copiate","segreti sullo schermo","chatbot confidente"].map((t,i)=>T(26,66+i*32,14,"⚠️ "+t,{a:"start",b:700})).join("")
 +B(258,38,166,52,C.k,16)+T(341,60,14,"«Che cosa ti piace",{b:700})+T(341,80,14,"dell'IA?»",{b:700})+E(316,148,46,"🧑")+E(462,152,42,"👧")+E(392,128,24,"💬")+T(392,190,14,"curiosità e calma, non paura",{b:800,c:C.g})),
"b3-token":S("Una fila di pezzetti di testo, i token, dentro una finestra che scorre: i primi escono dalla finestra di contesto",
 T(260,22,15,"il testo a pezzetti (token) dentro una finestra che scorre",{b:800})+tok()+T(260,170,14,"chat lunghissima? riassunto dei punti fermi e chat nuova",{b:700})+T(260,192,14,"durante la chat il modello non impara per sempre",{b:600,op:".85"})),
"b3-verifica":S("Due fonti a confronto su una bilancia, con tre controlli: il link si apre, il libro è nel catalogo, la frase citata c'è davvero",
 T(260,22,15,"verifica incrociata: due fonti a confronto",{b:800})+B(26,40,130,96,C.u)+E(66,84,28,"📄")+T(116,80,15,"fonte",{b:800})+T(116,98,15,"A",{b:900})+[0,1].map(i=>Ln(46,108+i*12,90)).join("")
 +B(364,40,130,96,C.v)+E(404,84,28,"📄")+T(454,80,15,"fonte",{b:800})+T(454,98,15,"B",{b:900})+[0,1].map(i=>Ln(384,108+i*12,90)).join("")
 +A(162,88,214)+`<line x1="358" y1="88" x2="315" y2="88" stroke="currentColor" stroke-width="2.5" opacity=".65"/><polygon points="316,82 306,88 316,94" fill="currentColor" opacity=".65"/>`+E(260,104,46,"⚖️")+T(260,134,14,"apri e leggi tu",{b:700})
 +[[92,"🔗 il link si apre?"],[260,"📚 è nel catalogo?"],[428,"❝ la frase c'è?"]].map(([x,t])=>T(x,176,14,t,{b:700})).join("")+T(260,196,14,"due risposte d'accordo non sono una prova",{b:600,op:".85"})),
"b3-bias":S("I testi scritti da persone passano nel modello come in uno specchio e tornano con gli stereotipi; si chiedono esempi vari ed equilibrati",
 T(260,22,15,"il modello impara dai testi, anche i pregiudizi",{b:800})+E(60,98,44,"📚")+T(60,134,14,"testi di persone",{b:700})+A(108,84,152)+E(196,98,44,"🪞")+T(196,134,14,"li ripete",{b:700})+A(236,84,270)
 +B(276,44,112,58,C.k)+T(332,79,14,"lei → casa",{b:800})+B(396,44,116,58,C.u)+T(454,79,14,"lui → carriera",{b:800})+`<line x1="276" y1="44" x2="512" y2="102" stroke="${C.p}" stroke-width="4" opacity=".45" stroke-linecap="round"/>`
 +E(394,140,28,"⚖️")+T(394,170,14,"chiedi esempi vari",{b:800,c:C.g})+T(394,188,14,"ed equilibrati",{b:800,c:C.g})+T(130,178,14,"il giudizio resta tuo",{b:700})),
"u3-agenti":S("Un agente apre una pagina dove è nascosto un biglietto con istruzioni non tue; le decisioni importanti le confermi tu",
 T(260,22,15,"l'agente agisce: attento ai biglietti nascosti",{b:800})+E(44,104,40,"🤖")+A(70,92,104)+B(108,38,206,128,C.u,10)+`<rect x="108" y="38" width="206" height="22" rx="10" fill="${C.u}" fill-opacity=".25"/>`+[0,1,2,3].map(i=>Ln(124,74+i*14,i%2?130:170)).join("")
 +`<g transform="rotate(-6 250 128)"><rect x="196" y="104" width="112" height="50" rx="4" fill="#facc15" fill-opacity=".45" stroke="${C.w}" stroke-opacity=".7"/>`+T(252,124,14,"«manda i dati",{b:700,op:".8"})+T(252,144,14,"a estranei»",{b:700,op:".8"})+`</g>`+E(174,150,24,"🕵️")+T(211,190,14,"istruzioni nascoste nella pagina",{b:800,c:C.p})
 +B(328,38,180,128,C.g)+T(418,62,15,"decidi tu",{b:800})+T(342,90,14,"✓ ricerche e bozze",{a:"start"})+T(342,114,14,"✋ pagamenti: tu",{a:"start"})+T(342,138,14,"🔑 password: tu",{a:"start"})+T(342,160,14,"⏹️ strano? fermalo",{a:"start"})),
"u3-su-misura":S("Una cartella progetto con chat, documenti e istruzioni; la memoria con i ricordi da leggere, correggere o cancellare; la chat temporanea",
 T(260,22,15,"progetti e memoria: controlli tu che cosa ricorda",{b:800})+`<path d="M24,52 h70 l10,-12 h-80 z" fill="${C.u}" fill-opacity=".3"/>`+B(24,50,204,116,C.u,8)+T(40,76,15,"🗂️ progetto: un viaggio",{a:"start",b:800})+T(44,104,14,"💬 le chat",{a:"start"})+T(44,128,14,"📄 i documenti",{a:"start"})+T(44,152,14,"📌 le istruzioni",{a:"start"})
 +B(244,40,170,126,C.v)+T(329,66,15,"🧠 la memoria",{b:800})+`<rect x="260" y="78" width="138" height="30" rx="6" fill="#facc15" fill-opacity=".35"/>`+T(329,99,14,"«risposte brevi»",{b:700})+E(329,146,22,"👁️ ✏️ 🗑️ ⏸️")+T(329,188,14,"leggi, correggi, cancella",{b:700})
 +E(468,98,36,"🕶️")+T(468,134,14,"chat",{b:800})+T(468,152,14,"temporanea",{b:800})),
"p3-autore":S("Tre riquadri: l'opera umana protetta anche se fatta con l'aiuto dell'IA, il deepfake da dichiarare, i volti e le voci di altri solo con il permesso",
 T(260,22,15,"opere, volti e voci: rispetto e permesso",{b:800})+[["🎨","opera umana","anche con l'IA: ©",C.g],["🎭","deepfake:","va dichiarato 🏷️",C.w],["🚫","volti e voci","senza permesso",C.p]].map(([e,a,b,c],i)=>{const x=22+i*162;return B(x,40,150,118,c)+E(x+75,88,36,e)+T(x+75,124,15,a,{b:800})+T(x+75,144,14,b,{b:700});}).join("")
 +T(260,186,14,"diffondere falsi dannosi senza consenso è reato",{b:800,c:C.p})),
"u3-salute":S("Un referto senza nome con una parola difficile, l'assistente che spiega e prepara le domande, il medico che decide",
 T(260,22,15,"capire le parole, poi decide il medico",{b:800})+B(24,38,150,130,C.u,8)+T(99,62,14,"REFERTO",{b:900})+`<rect x="40" y="72" width="118" height="14" rx="3" fill="currentColor" opacity=".75"/><rect x="34" y="96" width="130" height="24" rx="5" fill="#facc15" fill-opacity=".5"/>`+T(99,114,14,"parola difficile",{b:700})+[0,1,2].map(i=>Ln(40,130+i*11,i===2?70:118)).join("")+T(99,190,14,"senza nome né dati",{b:700})
 +A(180,96,212)+E(258,90,36,"💬")+T(258,126,14,"spiega parole,",{b:700})+T(258,144,14,"prepara domande",{b:700})+A(318,96,350)+E(420,90,40,"🩺")+T(420,126,14,"la decisione",{b:800})+T(420,144,14,"resta al medico",{b:800,c:C.g})+T(420,180,14,"✗ diagnosi, cure, dosi",{b:800,c:C.p})),
"p3-disinfo":S("Una notizia esaminata con la lente e tre controlli: chi la pubblica, la data, l'immagine con la ricerca inversa; se fa arrabbiare, fermati",
 T(260,22,15,"notizia sospetta? tre controlli con la lente",{b:800})+B(22,38,200,140,C.s,6)+T(122,64,16,"ULTIM'ORA!",{b:900})+`<rect x="38" y="76" width="70" height="52" rx="4" fill="${C.s}" fill-opacity=".3"/>`+E(73,110,22,"🖼️")+[0,1,2].map(i=>Ln(118,82+i*14,88)).join("")+[0,1,2].map(i=>Ln(38,140+i*12,i===2?100:168)).join("")
 +`<circle cx="182" cy="130" r="34" fill="#fff" fill-opacity=".12" stroke="currentColor" stroke-width="5"/><line x1="206" y1="154" x2="232" y2="182" stroke="currentColor" stroke-width="8" stroke-linecap="round"/>`
 +T(250,62,14,"🏷️ fonte: chi pubblica?",{a:"start",b:700})+T(250,92,14,"📅 data: è vecchia?",{a:"start",b:700})+T(250,122,14,"🖼️ immagine: ricerca inversa",{a:"start",b:700})+T(250,160,14,"😠 ti fa arrabbiare? fermati",{a:"start",b:800,c:C.p})+T(250,186,14,"nel dubbio, non inoltrare",{a:"start",b:800})),
"k3-compagni":S("Un chatbot che imita l'affetto, le persone vere che vogliono bene e i controlli per la famiglia sull'iPad: tempo, app approvate, filtri",
 T(260,22,15,"un chatbot «amico» imita l'affetto: le persone vere no",{b:800})+B(22,38,150,128,C.k)+E(97,80,30,"🤖")+T(97,112,14,"«sempre",{b:700})+T(97,130,14,"d'accordo»",{b:700})+T(97,154,14,"imita l'affetto",{b:800,c:C.p})
 +B(184,38,150,128,C.g)+E(259,84,36,"👨‍👧")+T(259,120,15,"persone vere:",{b:800})+T(259,142,14,"genitori, amici",{b:700})
 +B(346,38,152,128,C.u)+T(422,62,15,"controlli",{b:800})+T(360,92,14,"⏱️ tempo",{a:"start"})+T(360,118,14,"✅ app approvate",{a:"start"})+T(360,144,14,"🧰 filtri",{a:"start"})
 +T(260,190,14,"sotto i 14 anni: consenso dei genitori",{b:800})),
/* 8/11/2026: 💻 Programmare app (livello Base) e 3 schede nuove di livello 3 */
"a1-web":S("Tre ingredienti di una web app: HTML la struttura, CSS l'aspetto, JavaScript il comportamento; sotto, la memoria del browser dove restano i dati",
 T(260,22,15,"tre ingredienti e una memoria",{b:800})
 +[["🧱","HTML","la struttura",C.u],["🎨","CSS","l'aspetto",C.k],["⚙️","JavaScript","il comportamento",C.w]].map(([e,a,b,c],i)=>{const x=22+i*162;return B(x,36,150,100,c)+E(x+75,70,30,e)+T(x+75,102,16,a,{b:800})+T(x+75,124,14,b,{b:600});}).join("")
 +B(22,148,476,40,C.g)+T(260,173,14,"💾 la memoria del browser: i dati restano sul dispositivo",{b:700})),
"a1-richiesta":S("Tre tappe: una richiesta chiara con cosa, per chi e un esempio; poi un piano da correggere; solo dopo il via, il codice",
 T(260,22,15,"una richiesta chiara, poi il piano",{b:800})
 +[["📝","la richiesta","cosa e per chi",C.u],["🗺️","il piano","da correggere",C.v],["💻","il codice","dopo il tuo via",C.g]].map(([e,a,b,c],i)=>{const x=22+i*168;return B(x,38,140,112,c)+E(x+70,74,30,e)+T(x+70,104,15,a,{b:800})+T(x+70,126,14,b,{b:600});}).join("")
 +A(166,94,190,"currentColor")+A(334,94,358,"currentColor")
 +T(260,184,14,"prima il piano, poi il codice",{b:800})),
"a1-passi":S("Un ciclo corto: una modifica, salva e ricarica, prova con il dito sull'iPad vero; solo se funziona si passa alla modifica successiva",
 T(260,22,15,"un cambiamento alla volta, poi la prova",{b:800})
 +[["✏️","una modifica",C.u],["💾","salva e ricarica",C.w],["👆","prova sull'iPad",C.g]].map(([e,a,c],i)=>{const x=22+i*168;return B(x,38,140,84,c)+E(x+70,76,30,e)+T(x+70,108,14,a,{b:800});}).join("")
 +A(166,80,190,"currentColor")+A(334,80,358,"currentColor")
 +`<path d="M432,128 Q260,186 92,134" fill="none" stroke="currentColor" stroke-width="2.5" opacity=".55"/><polygon points="92,134 104,126 104,140" fill="currentColor" opacity=".55"/>`
 +T(260,194,14,"funziona? solo allora passa alla prossima",{b:700})),
"a1-versioni":S("Una linea del tempo di versioni salvate: primo passo, aggiunta della lista, una modifica rotta; si torna all'ultima versione che funzionava",
 T(260,22,15,"ogni commit è un punto sicuro",{b:800})
 +`<line x1="40" y1="78" x2="480" y2="78" stroke="currentColor" stroke-width="3" opacity=".35"/>`
 +[[90,"commit 1","primo passo",C.g],[230,"commit 2","aggiunta lista",C.g],[370,"commit 3","modifica rotta ✗",C.p]].map(([x,a,b,c])=>T(x,54,14,a,{b:800})+`<circle cx="${x}" cy="78" r="13" fill="${c}" fill-opacity=".3" stroke="${c}" stroke-width="3"/>`+T(x,112,14,b,{b:600})).join("")
 +`<path d="M370,124 Q300,176 236,126" fill="none" stroke="${C.g}" stroke-width="3" opacity=".8"/><polygon points="232,122 246,124 238,136" fill="${C.g}" opacity=".8"/>`
 +T(300,194,14,"torni all'ultima versione che funzionava",{b:800,c:C.g})),
"a1-segreti":S("A sinistra una chiave scritta nel codice di un progetto pubblico, che chiunque può leggere; a destra la chiave tenuta fuori dal codice e dati inventati per le prove",
 T(260,22,15,"password e dati veri restano fuori dal codice",{b:800})
 +B(22,38,232,114,C.p)+E(70,88,34,"🔑")+T(166,80,14,"chiave nel codice",{b:800})+T(166,102,14,"progetto pubblico:",{b:600})+T(138,126,14,"la legge chiunque",{b:800,c:C.p})
 +B(268,38,230,114,C.g)+E(316,88,34,"🔒")+T(412,80,14,"fuori dal codice",{b:800})+T(412,102,14,"dati inventati",{b:600})+T(412,126,14,"nelle prove",{b:600})
 +T(260,184,14,"finita online? revocala subito e creane una nuova",{b:800,c:C.p})),
"a1-errori":S("Un messaggio d'errore da leggere, poi una descrizione chiara all'assistente con cosa volevi, cosa è successo, errore e codice, infine una spiegazione riga per riga",
 T(260,22,15,"leggi l'errore, descrivilo, chiedi di capire",{b:800})
 +B(22,38,150,110,C.p)+E(97,76,30,"⚠️")+T(97,108,14,"messaggio",{b:800})+T(97,128,14,"d'errore",{b:800})
 +A(174,93,194,"currentColor")
 +B(198,38,158,110,C.u)+T(210,64,14,"📝 descrivi:",{a:"start",b:800})+T(210,88,14,"cosa volevi",{a:"start"})+T(210,108,14,"cosa è successo",{a:"start"})+T(210,128,14,"errore e codice",{a:"start"})
 +A(358,93,378,"currentColor")
 +B(382,38,116,110,C.g)+E(440,76,30,"🤖")+T(440,108,14,"spiega ogni",{b:800})+T(440,128,14,"riga",{b:800})
 +T(260,180,14,"codice che non capisci? non incollarlo",{b:800,c:C.p})),
"b3-alfabetizza":S("Tre competenze dell'alfabetizzazione sull'IA: capire come funziona, conoscere limiti e rischi, controllare ogni volta; non serve un attestato",
 T(260,22,15,"capire per usare bene",{b:800})
 +[["🧠","come","funziona",C.b],["⚠️","limiti","e rischi",C.w],["✅","controlli","ogni volta",C.g]].map(([e,a,b,c],i)=>{const x=22+i*162;return B(x,36,150,112,c)+E(x+75,72,32,e)+T(x+75,106,15,a,{b:800})+T(x+75,128,15,b,{b:800});}).join("")
 +T(260,184,14,"nessun attestato: contano contesto e rischio",{b:700})),
"p3-diritti":S("Una persona manda una richiesta al servizio che tratta i dati, che risponde di regola entro un mese; i diritti principali sono accesso, cancellazione e opposizione",
 T(260,22,15,"scrivi al titolare: accesso, cancellazione, opposizione",{b:800})
 +E(52,80,36,"🙋")+T(52,110,14,"tu",{b:800})+A(82,72,170)+T(126,62,14,"richiesta",{b:600})
 +B(176,40,150,94,C.u)+T(251,70,15,"il servizio",{b:800})+T(251,92,14,"(titolare)",{b:600})+T(251,116,14,"risponde",{b:600})
 +A(328,88,346)
 +[["👁️","accesso"],["🗑️","cancellazione"],["✋","opposizione"]].map(([e,t],i)=>`<rect x="350" y="${42+i*32}" width="148" height="28" rx="9" fill="${C.g}" fill-opacity=".15" stroke="${C.g}" stroke-opacity=".6" stroke-width="1.5"/>`+T(362,62+i*32,14,e+" "+t,{a:"start",b:700})).join("")
 +B(22,150,476,34,C.w)+T(260,172,14,"risposta di regola entro un mese · di regola gratuita",{b:700})),
"k3-foto":S("Prima di pubblicare una foto dei figli: volto coperto, visibile solo a persone fidate, niente inoltro senza consenso; chiediti se a lui da grande piacerà",
 T(260,22,15,"prima di pubblicare, pensaci",{b:800})
 +B(22,36,150,112,C.k)+`<rect x="62" y="48" width="70" height="52" rx="6" fill="${C.s}" fill-opacity=".3"/>`+E(97,86,34,"🧒")+`<rect x="80" y="58" width="34" height="34" rx="9" fill="${C.s}" fill-opacity=".8"/>`+T(97,124,14,"volto coperto",{b:800})
 +B(184,36,150,112,C.g)+E(259,82,34,"👨‍👩‍👧")+T(259,114,14,"solo persone",{b:800})+T(259,134,14,"fidate",{b:800})
 +B(346,36,152,112,C.p)+E(422,82,34,"🚫")+T(422,114,14,"niente inoltro",{b:800})+T(422,134,14,"senza consenso",{b:800})
 +T(260,182,14,"a lui, da grande, piacerà?",{b:800}))
};})();
