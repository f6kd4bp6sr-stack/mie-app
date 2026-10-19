/* ================= SCIENZE ================= */
const SCI = [
  { id: 'corpo', ic: '🫀', name: 'Il corpo umano', sk: 'Organi e apparati', c: 'var(--c1)', s: 'var(--c1-soft)',
    motto: 'Il tuo corpo è una macchina fantastica: ogni parte ha un lavoro speciale.',
    act: { kind: 'order', title: 'Il viaggio del panino', how: 'Dove va il cibo dopo che lo mangi? Metti le tappe in ordine, dalla prima all’ultima.',
      items: [{ e: '👄', t: 'Bocca' }, { e: '🧵', t: 'Esofago' }, { e: '🫃', t: 'Stomaco' }, { e: '🌀', t: 'Intestino tenue' }, { e: '🪱', t: 'Intestino crasso' }],
      explain: 'Questo è l’apparato digerente. In bocca mastichi, l’esofago porta il cibo allo stomaco che lo frulla, e nell’intestino il corpo prende le sostanze che gli servono.',
      hint: 'Pensa: da dove entra il cibo? Poi dove scende?' },
    facts: [
      ['Quante volte batte il cuore in un giorno?', 'Circa 100.000 volte! Anche adesso, mentre leggi, lavora senza fermarsi mai.'],
      ['Qual è l’organo più grande del corpo?', 'La pelle! Ti copre tutta e ti protegge come una tuta da supereroe.'],
      ['Quanto è lungo l’intestino?', 'L’intestino tenue di un adulto è lungo diversi metri, più di un’automobile, ma sta tutto ripiegato nella pancia!'],
      ['Qual è l’osso più piccolo?', 'La staffa, dentro l’orecchio: è lunga circa 3 millimetri, più piccola di un chicco di riso!']
    ],
    quiz: [
      { q: 'Quale organo pompa il sangue in tutto il corpo?', o: ['Il cuore', 'I polmoni', 'Lo stomaco'], a: 0, e: 'Il cuore è un muscolo che spinge il sangue in tutto il corpo.' },
      { q: 'Dove passa l’ossigeno dall’aria al sangue?', o: ['Nei polmoni', 'Nel fegato', 'Nei reni'], a: 0, e: 'Quando respiri, nei polmoni l’ossigeno entra nel sangue.' },
      { q: 'Quante ossa ha un adulto?', o: ['206', '50', '1000'], a: 0, e: 'Un adulto ha 206 ossa. I neonati ne hanno di più, poi alcune si saldano insieme.' },
      { q: 'Quale organo comanda tutto il corpo?', o: ['Il cervello', 'Il cuore', 'La pelle'], a: 0, e: 'Il cervello manda messaggi a tutto il corpo attraverso i nervi.' },
      { q: 'Dove comincia la digestione?', o: ['In bocca', 'Nello stomaco', 'Nell’intestino'], a: 0, e: 'Già in bocca: i denti masticano e la saliva comincia a sciogliere il cibo.' },
      { q: 'Cosa trasportano i globuli rossi?', o: ['L’ossigeno', 'Il cibo', 'I pensieri'], a: 0, e: 'I globuli rossi portano l’ossigeno a tutte le parti del corpo.' },
      { q: 'A cosa servono i muscoli?', o: ['A muovere il corpo', 'A digerire', 'A vedere'], a: 0, e: 'I muscoli tirano le ossa e ci fanno muovere, correre e ballare!' },
      { q: 'Con quale senso senti i sapori?', o: ['Il gusto', 'L’udito', 'La vista'], a: 0, e: 'Con la lingua senti dolce, salato, amaro, aspro e anche l’umami, il gusto «saporito» del parmigiano. E il naso aiuta tantissimo!' }
    ],
    exp: [
      ['Detective del battito', 'Conta i battiti al polso per 15 secondi e moltiplica per 4. Poi fai 30 salti e ricontali: cosa è cambiato?'],
      ['Il test del naso', 'A occhi chiusi e naso tappato, assaggia un pezzetto di mela e uno di pera. Riesci a capire quale è quale?'],
      ['Lo scheletro di carta', 'Sdraiati su un rotolo di carta e fatti ricalcare il contorno. Poi disegna dentro le ossa che conosci!']
    ] },
  { id: 'spazio', ic: '🪐', name: 'Sistema solare', sk: 'Pianeti e stelle', c: 'var(--c5)', s: 'var(--c5-soft)',
    motto: 'Viviamo su un pianeta che viaggia intorno a una stella. Che avventura!',
    act: { kind: 'order', title: 'Metti in fila i pianeti', how: 'Parti dal più vicino al Sole e arriva al più lontano. Aiutino: «Mia Vecchia Tata Mi Gioca Sempre Un Numero».',
      items: [{ e: '🪨', t: 'Mercurio' }, { e: '🌕', t: 'Venere' }, { e: '🌍', t: 'Terra' }, { e: '🔴', t: 'Marte' }, { e: '🟠', t: 'Giove' }, { e: '🪐', t: 'Saturno' }, { e: '🔵', t: 'Urano' }, { e: '🌀', t: 'Nettuno' }],
      explain: 'Mercurio, Venere, Terra e Marte sono pianeti rocciosi e piccoli. Giove, Saturno, Urano e Nettuno sono giganti fatti soprattutto di gas e ghiaccio.',
      hint: 'Usa la frase magica: Mia Vecchia Tata Mi Gioca Sempre Un Numero!' },
    facts: [
      ['Quanto è grande il Sole?', 'Tantissimo: dentro ci starebbero più di un milione di pianeti Terra!'],
      ['Quanto ci mette la luce del Sole ad arrivare da noi?', 'Circa 8 minuti. Quindi il Sole che vedi è quello di 8 minuti fa!'],
      ['Su quale pianeta il giorno dura più di un anno?', 'Su Venere! Gira su se stesso così piano che un giorno dura più del suo giro intorno al Sole.'],
      ['Plutone è un pianeta?', 'Non più: dal 2006 è un pianeta nano. È piccolo e intorno alla sua orbita ci sono tanti altri corpi ghiacciati che non ha «spazzato via», come invece fanno i pianeti veri.']
    ],
    quiz: [
      { q: 'Qual è il pianeta più vicino al Sole?', o: ['Mercurio', 'Marte', 'Nettuno'], a: 0, e: 'Mercurio è il primo e il più piccolo dei pianeti.' },
      { q: 'Qual è il pianeta più grande?', o: ['Giove', 'La Terra', 'Venere'], a: 0, e: 'Giove è così grande che ci starebbero dentro più di 1000 Terre.' },
      { q: 'Quanti sono i pianeti del sistema solare?', o: ['8', '5', '12'], a: 0, e: 'Sono 8: Mercurio, Venere, Terra, Marte, Giove, Saturno, Urano e Nettuno.' },
      { q: 'Il Sole è…', o: ['una stella', 'un pianeta', 'un satellite'], a: 0, e: 'Il Sole è una stella: una enorme palla di gas caldissimo che fa luce.' },
      { q: 'Quanto tempo ci mette la Terra a fare il giro intorno al Sole?', o: ['Un anno', 'Un giorno', 'Un mese'], a: 0, e: 'Circa 365 giorni: un anno intero!' },
      { q: 'Perché c’è il giorno e la notte?', o: ['Perché la Terra gira su se stessa', 'Perché il Sole si spegne', 'Perché la Luna copre il Sole'], a: 0, e: 'La Terra gira su se stessa in 24 ore: la parte verso il Sole ha il giorno, l’altra la notte.' },
      { q: 'Quale pianeta è chiamato «pianeta rosso»?', o: ['Marte', 'Giove', 'Mercurio'], a: 0, e: 'Marte è rosso perché le sue rocce contengono tanta ruggine!' },
      { q: 'Cos’è la Luna?', o: ['Il satellite della Terra', 'Una stella', 'Un pianeta'], a: 0, e: 'La Luna gira intorno alla Terra: è il nostro satellite naturale.' }
    ],
    exp: [
      ['Il diario della Luna', 'Per una settimana guarda la Luna ogni sera e disegnane la forma. Sta crescendo o calando?'],
      ['Giorno e notte in camera', 'Al buio, una torcia è il Sole e un’arancia è la Terra. Falla girare piano: dove è giorno? Dove è notte?'],
      ['Caccia alle stelle', 'In una sera limpida cerca il Grande Carro con mamma o papà: sembra un grande mestolo!']
    ] },
  { id: 'energia', ic: '⚡', name: 'Energia e materia', sk: 'Acqua, calore, luce', c: 'var(--c2)', s: 'var(--c2-soft)',
    motto: 'Tutto intorno a te è materia, e l’energia la fa cambiare. Scopri come!',
    act: { kind: 'water', title: 'L’acqua magica', how: 'Sposta il termometro e guarda cosa succede all’acqua. Trova tutti e tre gli stati!' },
    facts: [
      ['Perché il ghiaccio galleggia?', 'Perché quando l’acqua gela si allarga e diventa più leggera dell’acqua liquida.'],
      ['Cosa è più caldo, un fulmine o il Sole?', 'Il fulmine! Per un attimo diventa più caldo della superficie del Sole.'],
      ['L’acqua che bevi è nuova?', 'No! L’acqua gira sempre: evapora, fa le nuvole, piove. Forse l’ha bevuta anche un dinosauro!'],
      ['Come funziona un pannello solare?', 'Trasforma la luce del Sole in elettricità. È energia pulita e rinnovabile: il Sole brillerà ancora per miliardi di anni.']
    ],
    quiz: [
      { q: 'A quanti gradi l’acqua diventa ghiaccio?', o: ['0 °C', '100 °C', '50 °C'], a: 0, e: 'A 0 gradi l’acqua solidifica e diventa ghiaccio.' },
      { q: 'A quanti gradi l’acqua bolle?', o: ['100 °C', '0 °C', '30 °C'], a: 0, e: 'A 100 gradi (al livello del mare) l’acqua bolle e diventa vapore.' },
      { q: 'Il vapore è acqua allo stato…', o: ['gassoso', 'solido', 'liquido'], a: 0, e: 'Solido = ghiaccio, liquido = acqua, gassoso = vapore.' },
      { q: 'Quale di queste è un’energia rinnovabile, che si rinnova sempre?', o: ['Il Sole', 'Il petrolio', 'Il carbone'], a: 0, e: 'Sole, vento e acqua che scorre sono energie rinnovabili.' },
      { q: 'Quale materiale fa passare bene l’elettricità?', o: ['Il metallo', 'La plastica', 'Il legno'], a: 0, e: 'I metalli come il rame sono conduttori. Per questo i fili hanno il rame dentro e la plastica fuori.' },
      { q: 'Come si chiama il ghiaccio che diventa acqua?', o: ['Fusione', 'Evaporazione', 'Congelamento'], a: 0, e: 'La fusione è il passaggio da solido a liquido.' },
      { q: 'Come si chiama l’acqua che diventa vapore?', o: ['Evaporazione', 'Fusione', 'Solidificazione'], a: 0, e: 'Quando l’acqua si scalda, evapora e diventa vapore.' },
      { q: 'Cosa serve al fuoco per bruciare?', o: ['L’ossigeno', 'L’acqua', 'Il ghiaccio'], a: 0, e: 'Il fuoco ha bisogno di ossigeno: per questo coprire una candela la spegne.' }
    ],
    exp: [
      ['Ghiaccioli di succo', 'Metti del succo nel freezer e il giorno dopo guarda il ghiacciolo sciogliersi al sole: è la fusione!'],
      ['Il cucchiaio caldo', 'Con un adulto, metti un cucchiaio di metallo e uno di legno in una tazza di acqua calda. Dopo un minuto, quale è più caldo?'],
      ['Nuvola in un barattolo', 'Con un adulto, metti acqua calda in un barattolo e un piatto con il ghiaccio sopra. Guarda le goccioline: è il ciclo dell’acqua!']
    ] },
  { id: 'animali', ic: '🦊', name: 'Animali e ambienti', sk: 'Catene ed ecosistemi', c: 'var(--c4)', s: 'var(--c4-soft)',
    motto: 'In natura tutti hanno bisogno di tutti: è una grande squadra.',
    act: { kind: 'order', title: 'La catena alimentare', how: 'Chi mangia chi? Parti da chi dà energia a tutti e arriva all’ultimo cacciatore.',
      items: [{ e: '☀️', t: 'Sole' }, { e: '🌿', t: 'Erba' }, { e: '🦗', t: 'Cavalletta' }, { e: '🐸', t: 'Rana' }, { e: '🦅', t: 'Airone' }],
      explain: 'Il Sole dà energia all’erba (produttore). La cavalletta mangia l’erba, la rana mangia la cavalletta, l’airone mangia la rana (consumatori). E alla fine i decompositori trasformano tutto in terra buona!',
      hint: 'Chi dà energia a tutti? E chi mangia l’erba?' },
    facts: [
      ['Quanti cuori ha un polpo?', 'Tre! E il suo sangue è blu.'],
      ['Quante volte batte le ali un colibrì?', 'Alcuni colibrì arrivano a più di 50 battiti al secondo! Per questo sembrano fermi nell’aria.'],
      ['A cosa servono i lombrichi?', 'Scavano gallerie e mangiano foglie secche: rendono la terra morbida e fertile.'],
      ['La balena è un pesce?', 'No! È un mammifero: respira aria e allatta i suoi piccoli, proprio come noi.']
    ],
    quiz: [
      { q: 'Come si chiamano gli animali che mangiano solo piante?', o: ['Erbivori', 'Carnivori', 'Onnivori'], a: 0, e: 'Erbivori, come la mucca e il coniglio.' },
      { q: 'Il leone è…', o: ['carnivoro', 'erbivoro', 'onnivoro'], a: 0, e: 'Il leone mangia altri animali: è un carnivoro.' },
      { q: 'Un animale che mangia sia piante che animali è…', o: ['onnivoro', 'erbivoro', 'carnivoro'], a: 0, e: 'Onnivoro vuol dire che mangia di tutto, come l’orso. E anche noi!' },
      { q: 'Le piante producono il loro cibo con…', o: ['la luce del Sole', 'la sabbia', 'il buio'], a: 0, e: 'Con la fotosintesi le piante usano luce, acqua e aria per fare il cibo.' },
      { q: 'Chi trasforma foglie e resti in terra buona?', o: ['I decompositori', 'I carnivori', 'I pesci'], a: 0, e: 'Funghi e batteri sono i decompositori, gli spazzini della natura. I lombrichi e altri piccoli animali li aiutano sminuzzando i resti.' },
      { q: 'Cos’è un ecosistema?', o: ['Un ambiente con esseri viventi e non viventi', 'Un tipo di pianta', 'Un animale grande'], a: 0, e: 'Un bosco, uno stagno, un prato: esseri viventi, acqua, terra e aria che stanno insieme.' },
      { q: 'La balena è un…', o: ['mammifero', 'pesce', 'rettile'], a: 0, e: 'La balena respira aria con i polmoni e allatta i piccoli.' },
      { q: 'Nella catena alimentare, l’erba è…', o: ['un produttore', 'un consumatore', 'un decompositore'], a: 0, e: 'L’erba produce il suo cibo con la luce del Sole: è un produttore.' }
    ],
    exp: [
      ['Caccia agli insetti', 'In giardino o al parco cerca 3 insetti diversi e disegnali. Quante zampe hanno?'],
      ['Il fagiolo magico', 'Metti un fagiolo nel cotone bagnato vicino alla finestra. Ogni giorno guarda come cresce!'],
      ['La catena del parco', 'Al parco trova un esempio di catena: una pianta, chi la mangia, e chi mangia lui.']
    ] }
];
let sciSel = 'corpo';
PAGES.scienze = el => {
  el.innerHTML = '<h1 class="page-title rainbow">Il laboratorio di ' + esc(CHI) + '</h1>' +
    '<p class="page-sub">Fare domande è da scienziate. Chi chiede «perché?» impara il doppio!</p>' +
    '<div class="sec"><div id="s-tiles"></div></div><div id="s-panel"></div>';
  const done = store.get('sci-done', {});
  renderTiles($('s-tiles'), SCI.map(s => ({ ...s, ok: done[s.id] ? '✓ esplorato' : '' })), sciSel, id => { sciSel = id; PAGES.scienze(el); });
  const t = SCI.find(x => x.id === sciSel);
  const p = $('s-panel');
  p.className = 'panel'; p.style.setProperty('--gc', t.c); p.style.setProperty('--gs', t.s);
  p.innerHTML = '<div class="row between"><h3>' + t.ic + ' ' + esc(t.name) + '</h3>' + sayBtn(t.motto) + '</div><p class="how">' + esc(t.motto) + '</p>' +
    '<h4>🧪 ' + esc(t.act.title) + '</h4><p class="how" style="margin-top:0">' + esc(t.act.how) + '</p><div id="s-act"></div>' +
    '<h4>👀 Lo sapevi?</h4><div id="s-facts"></div>' +
    '<h4>🎯 Quiz dello scienziato <span style="font-family:var(--font-body);font-size:14px;color:var(--ink-soft)">5 domande</span></h4><div id="s-quiz"></div>' +
    '<h4>🔬 Esperimenti a casa</h4><ul class="missions" id="s-exp"></ul>';
  const mark = () => { const d = store.get('sci-done', {}); d[t.id] = 1; store.set('sci-done', d); markDay('scienze', p); };
  if (t.act.kind === 'order') runOrder($('s-act'), t.act.items, { explain: t.act.explain, hint: t.act.hint, onDone: mark });
  else waterLab($('s-act'), mark);
  renderFacts($('s-facts'), t.facts, 'sci-' + t.id);
  const startQuiz = () => runQuiz($('s-quiz'), drawDeck('q-sci-' + t.id, t.quiz.length, 5).map(i => t.quiz[i]), { color: t.c, onDone: mark, restart: startQuiz });
  startQuiz();
  renderMissions($('s-exp'), t.exp, 'sci-' + t.id, mark);
};

function waterLab(box, onDone) {
  let T = 20;
  const found = new Set();
  box.innerHTML = '<div class="water"><div class="scene" id="w-scene" aria-hidden="true"></div><div>' +
    '<div class="temp" id="w-t">20 °C</div><div class="state" id="w-s"></div><p id="w-d" style="font-weight:700;margin:6px 0 0"></p>' +
    '<label for="w-r" style="display:block;font-weight:800;margin-top:10px">🌡️ Temperatura</label>' +
    '<input type="range" id="w-r" min="-20" max="120" step="1" value="20">' +
    '<div class="row" style="margin-top:8px"><span class="pill" id="w-f">Stati trovati: 0/3</span></div></div></div>';
  const draw = () => {
    let st, e, d, key;
    if (T <= 0) { key = 'solido'; st = 'Solido: ghiaccio'; e = '🧊'; d = 'Sotto 0 °C l’acqua gela. Le sue particelle stanno strette strette e ferme.'; }
    else if (T < 100) { key = 'liquido'; st = 'Liquido: acqua'; e = '💧'; d = 'Tra 0 e 100 °C l’acqua è liquida: le particelle si muovono e scivolano.'; }
    else { key = 'gassoso'; st = 'Gassoso: vapore'; e = '☁️'; d = 'A 100 °C l’acqua bolle e diventa vapore: le particelle volano via veloci!'; }
    $('w-t').textContent = T + ' °C';
    $('w-s').textContent = st; $('w-d').textContent = d;
    $('w-scene').textContent = e;
    $('w-scene').style.background = T <= 0 ? 'var(--c5-soft)' : T < 100 ? 'var(--c4-soft)' : 'var(--c2-soft)';
    if (!found.has(key)) {
      found.add(key); $('w-f').textContent = 'Stati trovati: ' + found.size + '/3';
      if (found.size > 1) { ding(); cheer($('w-s'), 'Scoperta: ' + key + '!'); gain(1, $('w-s')); }
      if (found.size === 3) { fanfare(); gain(3, $('w-s')); onDone && onDone(); }
    }
  };
  $('w-r').addEventListener('input', e => { T = +e.target.value; draw(); });
  draw();
}
