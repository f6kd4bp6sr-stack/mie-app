/* aiuti per scrivere contenuti nei file .js (le domande vere stanno in data/domande/quiz/*.json) */
const Q = (q, a, b, c, e) => ({ q: q, o: [a, b, c], a: 0, e: e || '' });
const addSci = (id, list) => SCI.find(t => t.id === id).quiz.push(...list);
const addSport = (id, list) => SPORTS.find(t => t.id === id).quiz.push(...list);
const S = (q, a, b, c, e) => [q, [a, b, c], 0, e || ''];
const addS = (id, list) => SCOPRI.find(s => s.id === id).quiz.push(...list);
