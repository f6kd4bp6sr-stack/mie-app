# Pianificazione — com'è organizzato il progetto

Pubblicato in `https://f6kd4bp6sr-stack.github.io/mie-app/licenze/` (indirizzo invariato: icona e dati restano).

```
pian/
├── build.py        costruisce out/licenze/ (barra comune, menu in alto, dati Licenze condivisi, versione)
├── deploy.sh       pubblica solo la cartella /licenze/ del sito
├── pagine/
│   ├── index.html     🏠 Pianificazione: 📆 Calendario (pagina iniziale: Giorno/Settimana/Mese/Anno/Scadenze, con famiglia
│   │                  e benessere), 🗂️ Pratiche, ⚙️ Impostazioni (blocco, Calendario dell'iPad, copie); 💶 Conti nascosta (CONTI_ON)
│   ├── licenze.html   📅 Licenze (prima era index.html)
│   ├── taichi.html    🧘 Tai Chi
│   └── progressi.html 🐉 Progressi di «Il mio mondo»
├── comune/blocco.html blocco con Face ID (passkey WebAuthn) inserito in testa a ogni pagina; sposta le vecchie chiavi mie-app-… in pn-…
├── comune/tema.css   tema comune: colore di ogni app nel menu in alto, riquadri morbidi di Licenze e Progressi
├── comune/fogli.js   lettura dei file della banca (CSV, XLSX, XLS, HTML) sull'iPad
├── sezioni/conti.js  Conti (NASCOSTA, codice conservato): banche e carte, importazione, categorie, budget, rate, proiezione
├── sezioni/conti_stat.js  statistiche e risparmio dei Conti
├── sezioni/calendario.js 📆 Calendario: viste Giorno/Settimana/Mese/Anno; un giorno si modifica da qui e la modifica
│                     va nella sezione di origine (Licenze `licenze-marco-v1` + database `stato`, Scadenze, Conti,
│                     Famiglia, Benessere, Tai Chi `tc_sessions`); istruzioni del Calendario iPad dietro un pulsante;
│                     attività fisse della famiglia (ogni 1 o 2 settimane, fino a, pause)
├── sezioni/pensione.js 🎖️ Pensione (`pn-v1` → `pens`): adempimenti (nel Calendario e nel file .ics), leve, cifre stimate/reali,
│                     incassi, 💶 cassa da oggi a giugno 2029 (`pens.mov` entrate e uscite una tantum o ricorrenti, anche nel Calendario e nel file .ics; `pens.cassa`: `ini` partenza, `saldi` saldo vero di fine mese, `spunte`, `sposta`), documenti (`pf-…`); si carica dal file privato «scheda pensione»
├── strumenti/         NOVITA.md (istruzioni dell'agente delle 13 · 17 · 23), verifica_novita.py (controllo delle novità),
│                     scheda_cifrata.py (apre, chiude e verifica la scheda cifrata; chiave solo in SCHEDA_CHIAVE)
├── statici/news-pensione.json  novità pubbliche su contratto e pensione GdF (aggiornate alle 13, 17 e 23 con fonti e registro dei controlli; non cambiano la versione)
├── statici/scheda-pensione.cifrata.json  scheda pensione CIFRATA (AES-256-GCM, chiave casuale mai nel repository): l'iPad la scarica,
│                     la apre con la chiave `pn-scheda-chiave` e la unisce da sola (spunte, note, importi reali restano); non cambia la versione
├── sezioni/pratiche.js 🗂️ Pratiche (`pn-v1` → `prat`): stato, prossimo passo, documenti, contatti, diario, note;
│                     file allegati nel database `licenze-marco`, chiavi `pf-…` (non vanno nella copia su iCloud)
├── docs/             ricerca sui formati di esportazione delle banche
├── comune/barra.html  riga in fondo a ogni pagina (si apre al tocco): aggiornamenti, copie giornaliere, copia su File/iCloud, copia automatica
├── tools/sorgenti_pubbliche.py  copia queste sorgenti in /sorgenti/pianificazione/ del repository (con controllo dei dati personali)
└── statici/           icone, manifest, service worker, jsQR, mondo-sync.js (usato da «Il mio mondo»), guida
```
Segnaposto nelle pagine: `<!--@NAV-->` (menu), `<!--@BARRA-->` (barra comune), `/*@LICENZE_DATI*/` (festivi e valori iniziali presi dalla pagina Licenze), `/*@FOGLI*/` (comune/fogli.js), `/*@CONTI*/` (sezioni/conti.js + conti_stat.js + calendario.js + pratiche.js + pensione.js), `/*@VCENA*/` in progressi (domande per la cena, prese da index.html).

Dati sul dispositivo: Licenze `licenze-marco-v1`, Tai Chi `tc_*`, Progressi `prog-*` (con il diario di «Il mio mondo»), Pianificazione `pn-v1` (note dei giorni in `dn`), vista del calendario `pn-calv`, copie `pn-lastSnap`, `pn-lastBackup`, `pn-copia-cloud`, blocco `pn-lock`; copia nel database `licenze-marco` (kv). Tutte le sezioni entrano nelle copie giornaliere e nel file su iCloud.
Regola: nessun dato personale nel codice (il sito è pubblico).

Collegamento della scheda: `#sk=<chiave>` salva la chiave della scheda cifrata su questo iPad, la toglie subito dall'indirizzo e apre Pensione → Documenti.

Vecchi indirizzi: `#oggi` e `#ben` aprono il Calendario sul giorno di oggi, `#fam` la vista Settimana, `#scad` la vista Scadenze, `#sic` le Impostazioni, `#conti` (nascosta) il Calendario.

Colori delle sezioni (variabili in `pagine/index.html`): `--cal` blu, `--scad` rosso, `--prat` arancio, `--fam` viola, `--ben` verde acqua, `--lic` terracotta, `--mondo` rosa, `--ipad` ardesia, `--set` grigio. Un riquadro prende il colore con la classe `k-<sezione>`.

Sito condiviso: `statici/fisica.html` e `statici/semestre.html` sono i rimandi alla app separata Semestre filtro (`/semestre/`): vanno lasciati. La copia senza internet usa solo cache `licenze-…`.
