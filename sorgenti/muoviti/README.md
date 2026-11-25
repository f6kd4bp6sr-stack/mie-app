# 🚋 Muoviti — sorgenti

Web app per iPhone: tram 10 GTT Piazza Statuto ↔ Corso IV Novembre 40 (Torino), orari indicativi, schema del percorso, alternative per l'ufficio, paline preferite e pulsanti per i passaggi live GTT/Moovit.

- **Indirizzo:** https://f6kd4bp6sr-stack.github.io/mie-app/muoviti/
- **Installarla:** Safari → Condividi → «Aggiungi alla schermata Home».
- **Piattaforma leggera:** un solo file `index.html`, nessuna libreria e nessun passo di compilazione oltre a `pubblica.py`.

## Aggiornare
1. Modificare `sorgenti/muoviti/index.html`.
2. `python3 sorgenti/muoviti/pubblica.py` (scrive `muoviti/`: index, sw.js, version.json, manifest).
3. Commit e push su `main`: GitHub Pages pubblica e l'app sull'iPhone si ricarica da sola alla prossima apertura (controlla `version.json` all'apertura, al ritorno sull'app e ogni 30 minuti).

Le preferenze (ora di uscita, minuti a piedi, palina di ritorno, paline aggiunte) restano solo sull'iPhone.
