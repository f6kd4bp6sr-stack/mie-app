/* ================= DOMANDE: fonte unica =================
   Tutte le domande stanno in data/domande/quiz/<materia>.json (una scheda per domanda, con un codice fisso «id»).
   Il codice non cambia mai, anche se si corregge il testo: così i ricordi di ogni nozione non si perdono.
   Qui riempio le liste delle sezioni (Scopri, Laboratorio, Sport) con le stesse domande del percorso. */
(function loadQuiz() {
  if (typeof QUIZ === 'undefined') return;
  const opts = x => [x.ok].concat(x.wrong);
  const put = (t, uid, fmt) => { const L = QUIZ[uid]; if (!t || !L) return; t.quiz.length = 0; L.forEach(x => t.quiz.push(fmt(x))); };
  SCOPRI.forEach(t => put(t, t.id, x => [x.q, opts(x), 0, x.e, x.en || null]));
  SCI.forEach(t => put(t, 'sci-' + t.id, x => ({ q: x.q, o: opts(x), a: 0, e: x.e })));
  SPORTS.forEach(t => put(t, 'sp-' + t.id, x => ({ q: x.q, o: opts(x), a: 0, e: x.e })));
})();
