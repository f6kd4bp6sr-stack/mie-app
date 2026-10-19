/* ================= VERSIONE DEI SALVATAGGI =================
   Ogni volta che cambia il modo di salvare, DATA_VER sale di 1 e qui si aggiunge la conversione.
   Prima di convertire, l'app tiene una copia completa dei dati (mondo-pre-migra, fuori dalle copie). */
const DATA_VER = 2;
(function migrate() {
  let v = store.get('data-ver', 1);
  if (v >= DATA_VER) return;
  try {
    const dump = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.startsWith('vale2-') && true) dump[k] = localStorage.getItem(k); }
    localStorage.setItem('mondo-pre-migra', JSON.stringify({ from: v, at: new Date().toISOString(), data: dump }));
  } catch (e) {}
  /* v1 → v2: le domande hanno un codice fisso uguale al vecchio, nessuna conversione necessaria */
  if (v < 2) v = 2;
  store.set('data-ver', v);
})();
