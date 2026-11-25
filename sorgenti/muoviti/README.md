# 🚋 Muoviti — sorgenti

Web app per iPhone: tram 10 GTT casa (Corso Umbria 14) → Statuto → Caserma Monte Grappa → ufficio (Corso IV Novembre 40) e ritorno, con bus 60 facoltativo sotto casa.

- **Indirizzo:** https://f6kd4bp6sr-stack.github.io/mie-app/muoviti/ — Safari → Condividi → «Aggiungi alla schermata Home».
- **Piattaforma leggera:** un solo `index.html` (HTML+CSS+JS), nessuna libreria, caratteri di sistema iOS, nessuna richiesta a terzi tranne il meteo Open-Meteo.

## Cosa mostra
- Piano del giorno (uscita 07:00 / 14:00, modificabili), prossimi passaggi, schema del percorso, «Esci adesso».
- **Gli orari sono STIME** dalla frequenza (feriale ~7′ andata / ~8′ ritorno 06:30–20:30, 15′ fuori fascia; festivi 12′/20′; servizio 05:00–24:00). I passaggi veri sono sul link «Live GTT» della palina.
- Festivi: domenica, feste nazionali, 24 giugno (San Giovanni), Pasquetta.
- Popup nei giorni scelti (default lun/mer/ven), da 15′ prima a 15′ dopo l'ora di uscita; niente popup nei festivi e in vacanza.
- Avvisi da `muoviti/avvisi.json`, scritto lun/mer/ven alle 06:15 e 13:15 da un'attività programmata. Campi: `agg` (GG/MM HH:MM), `iso` (data ISO), `linee` [{linee:[…], titolo, quando, url}]. Oltre 72 h senza aggiornamento la fascia diventa arancio.

## Aggiornare
1. Modificare `sorgenti/muoviti/index.html`.
2. `python3 sorgenti/muoviti/pubblica.py` → scrive `muoviti/` (index, sw.js, version.json, manifest) e controlla la sintassi JS con node.
3. Commit e push su `main`. L'app ricarica la nuova versione una sola volta per sessione (niente ricariche a ripetizione) e mai con popup o conto alla rovescia aperti.

## Dati da verificare sulla palina
Tempi tra fermate del 10 (Transit), palina 385 e linee a Caserma Monte Grappa (Moovit/OSM), fermate del 60 (findit/OSM), tempi del bus 60 (stime nel codice, `B60`).

## Memoria sul telefono
Chiavi `mv-…` in localStorage (lette sempre con controllo dei dati): `casa`, `out3`, `walk`, `home2`, `stop`, `casaMode`, `giorni`, `vac`, `mine`, `avv`, `meteo`, `pop-A/R`.
