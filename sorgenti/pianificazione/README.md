# Pianificazione — memoria dell'app

App per iPad del genitore: calendario di casa e di lavoro, licenze fino al congedo, pratiche, Tai Chi, 🤝 Metodo (stare con gli altri) e progressi di «Il mio mondo».

| | |
|---|---|
| Indirizzo | https://f6kd4bp6sr-stack.github.io/mie-app/licenze/ (non cambia: icona e dati restano) |
| Cartella pubblicata | `/licenze/` del repository (la scrive solo `deploy.sh` di questa app) |
| Sorgenti | `/sorgenti/pianificazione/` (questa cartella) |
| Copia senza internet | cache `licenze-<versione>` (il service worker cancella solo le proprie cache) |

## Le pagine
- 🏠 **Pianificazione** (`pagine/index.html`): 📆 Calendario (Giorno · Settimana · Mese · Anno · Scadenze; il giorno contiene benessere e Tai Chi, oggi anche il riepilogo), 🎖️ Pensione (`sezioni/pensione.js`: adempimenti, leve, cifre e incassi, cassa, documenti; dati solo dal file privato «scheda pensione», mai nel codice; 📰 Novità dal file pubblico `news-pensione.json`, aggiornato alle 13, alle 17 e alle 23 da un'attività programmata con le regole di `strumenti/NOVITA.md`; ricalcolo, cedolino, contatti e testi, linea del tempo; 💶 Cassa da oggi a giugno 2029 con stipendi, pensione e incassi automatici, entrate e uscite tue anche ricorrenti (nel Calendario), spunte, saldo vero a qualsiasi data, grafico dell’andamento (storico del conto Fineco dai Conti nascosti + previsione, periodo possibile degli incassi), perequazione della pensione ogni gennaio, tasse da mettere in conto, ritardo degli incassi, movimenti collegati agli investimenti; 🔄 la scheda si aggiorna da sola dal file pubblico **cifrato** `scheda-pensione.cifrata.json`, chiave solo sull'iPad e nell'attività programmata, strumento `strumenti/scheda_cifrata.py`), 🌱 Investimenti (`sezioni/investimenti.js`, dati in `pn-v1` → `inv`: profilo con 7 domande, riserva di sicurezza, somme in arrivo con le strategie a confronto, debiti da estinguere o no, simulatore, tassi di mercato dal blocco `mercati` e catalogo della 🔎 Ricerca dal blocco `prodotti` di `news-pensione.json`; calcoli con ipotesi, non consigli), 🗂️ Pratiche, ⚙️ Impostazioni (blocco con Face ID, Calendario dell'iPad, copie).
- 🤝 **Metodo** (`pagine/metodo.html`): allenamento alla simpatia, in tono ironico, con 4 parti e finestre che si aprono e si chiudono (stato in `pn-metfold`, «Apri tutto / Chiudi tutto»). 🃏 Oggi: abilità della settimana con motto (👋 Aprire, 💬 Tenere viva la chiacchierata, 🔁 Farsi vivo, 😊 Calore; dopo 4 settimane missioni più impegnative), 3 carte coperte da girare tra oltre 100 missioni (nome in codice, bonus, livello Riscaldamento/Si fa sul serio/Da leoni, situazione), curiosità e frase del giorno, la settimana; la missione si vede anche nel Calendario. 🧠 Lo sapevi? (31 curiosità con traduzione pratica; dietro «Da dove viene?» regola, studio, passi pratici, cautele e fonti con DOI verificate da un revisore indipendente). 💬 Frasi di scorta (circa 80 in 12 gruppi, preferite). 🤲 Volontariato a Torino dal file pubblico `occasioni-torino.json`, ricontrollato il lunedì dall'attività programmata (regole in `strumenti/NOVITA.md`, controllo `strumenti/verifica_occasioni.py`). Contenuti in `sezioni/metodo_dati.json`, controllati a ogni build da `strumenti/verifica_metodo.py`; dati personali solo in `pn-v1` → `met` (missioni `g`, preferite `fav`, volontariato `occ`; incontri, quiz e medaglie di prima restano salvati ma non si mostrano più).
- 📅 **Licenze** (`pagine/licenze.html`), 🧘 **Tai Chi** (`pagine/taichi.html`), 🐉 **Progressi** di «Il mio mondo» (`pagine/progressi.html`).
- 💶 **Conti** (`sezioni/conti.js`): **nascosta** ma conservata. In `pagine/index.html` basta `const CONTI_ON=true` per farla tornare (menu, pagamenti nel Calendario, riquadro di oggi, file per il Calendario dell'iPad). I dati dei Conti restano nelle copie.

## Dati sul dispositivo (solo di questa app)
| Dove | Chiavi |
|---|---|
| localStorage | `pn-v1` (Calendario, Scadenze, Pensione, Pratiche, Famiglia, Benessere, Conti, Metodo `met`), `pn-calv`, `pn-metv` (scheda aperta del Metodo), `pn-occ` (copia del volontariato), `pn-icsnag`, `pn-lock`, `pn-lastSnap`, `pn-lastBackup`, `pn-copia-cloud`, `pn-news`, `pn-scheda-chiave` (chiave della scheda cifrata, fuori dalle copie), `pn-scheda-meta`; Licenze `licenze-marco-v1`; Tai Chi `tc_*`; Progressi `prog-*` |
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
