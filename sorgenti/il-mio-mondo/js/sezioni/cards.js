/* ---------- Schede «Lo sapevi?» ricavate dalle domande verificate: ogni settore arriva a 60+ schede ---------- */
(function () {
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const card = (q, ans, e) => [q, cap(ans) + (/[.!?»]$/.test(ans) ? ' ' : '. ') + e];
  const fill = (facts, items) => {
    const seen = new Set(facts.map(f => f[0]));
    items.forEach(([q, ans, e]) => { if (!e) return; const t = seen.has(q) ? q.replace(/[?…]$/, '') + ': «' + ans + '»' : q; if (!seen.has(t)) { facts.push(card(t, ans, e)); seen.add(t); } });
  };
  [...SCI, ...SPORTS].forEach(t => fill(t.facts, t.quiz.map(x => [x.q, x.o[x.a], x.e])));
  SCOPRI.forEach(s => fill(s.facts, s.quiz.map(x => [x[0], x[1][x[2]], x[3]])));
})();
