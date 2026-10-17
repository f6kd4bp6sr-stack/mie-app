# Pianificazione — memoria dell'app

App per iPad del genitore: calendario di casa e di lavoro, licenze fino al congedo, pratiche, Tai Chi e progressi di «Il mio mondo».

| | |
|---|---|
| Indirizzo | https://f6kd4bp6sr-stack.github.io/mie-app/licenze/ (non cambia: icona e dati restano) |
| Cartella pubblicata | `/licenze/` del repository (la scrive solo `deploy.sh` di questa app) |
| Sorgenti | `/sorgenti/pianificazione/` (questa cartella) |
| Copia senza internet | cache `licenze-<versione>` (il service worker cancella solo le proprie cache) |

## Le pagine
- 🏠 **Pianificazione** (`pagine/index.html`): 📆 Calendario (Giorno · Settimana · Mese · Anno · Scadenze; il giorno contiene benessere e Tai Chi, oggi anche il riepilogo), 🎖️ Pensione (`sezioni/pensione.js`: adempimenti, leve, cifre e incassi, cassa, documenti; dati solo dal file privato «scheda pensione», mai nel codice; 📰 Novità dal file pubblico `news-pensione.json`, aggiornato alle 13, alle 17 e alle 23 da un'attività programmata con le regole di `strumenti/NOVITA.md`; ricalcolo, cedolino, contatti e testi, linea del tempo; 🔄 la scheda si aggiorna da sola dal file pubblico **cifrato** `scheda-pensione.cifrata.json`, chiave solo sull'iPad e nell'attività programmata, strumento `strumenti/scheda_cifrata.py`), 🗂️ Pratiche, ⚙️ Impostazioni (blocco con Face ID, Calendario dell'iPad, copie).
- 📅 **Licenze** (`pagine/licenze.html`), 🧘 **Tai Chi** (`pagine/taichi.html`), 🐉 **Progressi** di «Il mio mondo» (`pagine/progressi.html`).
- 💶 **Conti** (`sezioni/conti.js`): **nascosta** ma conservata. In `pagine/index.html` basta `const CONTI_ON=true` per farla tornare (menu, pagamenti nel Calendario, riquadro di oggi, file per il Calendario dell'iPad). I dati dei Conti restano nelle copie.

## Dati sul dispositivo (solo di questa app)
| Dove | Chiavi |
|---|---|
| localStorage | `pn-v1` (Calendario, Scadenze, Pensione, Pratiche, Famiglia, Benessere, Conti), `pn-calv`, `pn-icsnag`, `pn-lock`, `pn-lastSnap`, `pn-lastBackup`, `pn-copia-cloud`, `pn-news`, `pn-scheda-chiave` (chiave della scheda cifrata, fuori dalle copie), `pn-scheda-meta`; Licenze `licenze-marco-v1`; Tai Chi `tc_*`; Progressi `prog-*` |
| IndexedDB | `licenze-marco` → `kv`: `stato`, `pianifica`, `taichi`, `progressi`, `progressi-link`, `snap-<data>` (copie giornaliere, 30 giorni), `pf-<id>` (file di Pratiche e Pensione) |
| OPFS | `licenze-stato.json` |

Le chiavi `mie-app-lastSnap`, `mie-app-lastBackup`, `mie-app-copia-cloud` (nome condiviso con il sito) vengono spostate da sole nelle nuove `pn-…` alla prima apertura (`comune/blocco.html`).

Da «Il mio mondo» Pianificazione **legge soltanto**: l'invio cifrato dell'iPad della bimba (gist `mie-app-mondo <tag>`) e, sullo stesso iPad, le chiavi `vale2-…`. Il file `statici/mondo-sync.js` (pubblicato in `/licenze/`) è caricato da «Il mio mondo» per l'invio: non va spostato.

## Copie
- Copia giornaliera completa nel database del dispositivo, copia su File / iCloud (`pianificazione-copia-<data>.json`).
- ☁️ Copia automatica cifrata (AES-GCM, chiave dalla «parola della copia» con PBKDF2 310000 × SHA-256) in un gist privato `Pianificazione · copia cifrata (non modificare)`, in parti da 900 000 caratteri. La chiave GitHub resta solo sull'iPad (`prog-gh-v1`).

## Costruire e pubblicare
`python3 build.py` → `out/licenze/`; `sh deploy.sh "messaggio"` pubblica `/licenze/` e copia queste sorgenti in `/sorgenti/pianificazione/`. Non tocca «Il mio mondo» (cartella principale) né «Semestre filtro» (`/semestre/`, `/sorgenti/semestre/`, i rimandi `licenze/fisica.html` e `licenze/semestre.html`).

Dettagli dei file e dei segnaposto: `STRUTTURA.md`.

## Regole
- Nessun dato personale nel codice: il sito è pubblico. La scheda pensione entra nel repository solo cifrata; la chiave e la scheda in chiaro mai.
- Prima di variazioni all'app si propongono sezioni nuove o varianti strutturali.
- I contenuti sui soldi sono fatti e strategie, non consigli.
