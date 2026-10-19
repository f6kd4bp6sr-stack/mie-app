/* ================= Applica le correzioni dei revisori indipendenti ================= */
(function applyFixes() {
  const norm = s => String(s || '').replace(/[’‘]/g, "'").trim();
  const report = { ok: 0, miss: [] };
  const sec = key => {
    if (key === 'jokes') return { list: JOKES, get: x => ({ q: x[0], ok: x[1], e: x[2] }), put: (x, s) => { if (s.q) x[0] = s.q; if (s.ok) x[1] = s.ok; if (s.e) x[2] = s.e; } };
    const [kind, id] = key.split('-');
    if (kind === 'sc') { const t = SCOPRI.find(s => s.id === id); return t && { list: t.quiz, get: x => ({ q: x[0] }), put: (x, s) => { const ok = s.ok || x[1][x[2]]; const wr = s.wrong || x[1].filter((_, i) => i !== x[2]); if (s.q) x[0] = s.q; x[1] = [ok, wr[0], wr[1]]; x[2] = 0; if (s.e) x[3] = s.e; } }; }
    const t = (kind === 'sci' ? SCI : SPORTS).find(s => s.id === id);
    return t && { list: t.quiz, get: x => ({ q: x.q }), put: (x, s) => { const ok = s.ok || x.o[x.a]; const wr = s.wrong || x.o.filter((_, i) => i !== x.a); if (s.q) x.q = s.q; x.o = [ok, wr[0], wr[1]]; x.a = 0; if (s.e) x.e = s.e; } };
  };
  Object.keys(FIXES).forEach(key => {
    const S = sec(key); if (!S) { report.miss.push(key); return; }
    FIXES[key].forEach(fx => {
      let it = S.list[fx.id];
      if (!it || norm(S.get(it).q) !== norm(fx.q_old)) it = S.list.find(x => norm(S.get(x).q) === norm(fx.q_old));
      if (!it) { report.miss.push(key + ' #' + fx.id); return; }
      S.put(it, fx.set || {}); report.ok++;
    });
  });
  // correzioni delle curiosità (facts)
  Object.keys(typeof FACTFIXES !== 'undefined' ? FACTFIXES : {}).forEach(key => {
    const [kind, id] = key.split('-');
    const t = (kind === 'sc' ? SCOPRI : kind === 'sci' ? SCI : SPORTS).find(s => s.id === id);
    if (!t) { report.miss.push(key); return; }
    FACTFIXES[key].forEach(fx => {
      const f = t.facts.find(x => norm(x[0]) === norm(fx.title_old));
      if (!f || !fx.set || !fx.set[0]) { report.miss.push(key + ' fact ' + fx.id); return; }
      f[0] = fx.set[0]; f[1] = fx.set[1] || f[1]; report.ok++;
    });
  });
  window.__fixReport = report;
})();
// le spiegazioni delle barzellette non ripetono il titolo «Perché fa ridere»
JOKES.forEach(j => { if (j[2]) j[2] = j[2].replace(/^\s*perch[eé] fa ridere\s*[:?!.]\s*/i, ''); j[2] = j[2] && j[2].charAt(0).toUpperCase() + j[2].slice(1); });
