# Il mio mondo — com'è organizzato il progetto

Il sito pubblica **un solo file** (`index.html`): `build.py` riunisce tutti i pezzi qui sotto, nell'ordine scritto in `build.py`.

```
app/
├── build.py            costruisce index.html, la versione iPad e il pacchetto installabile
├── deploy.sh           costruisce e pubblica su GitHub Pages (non tocca /licenze/)
├── body.html           lo scheletro della pagina
├── css/
│   ├── base.css        impaginazione, testata, contenuto
│   ├── components.css  piastrelle, quiz, missioni, tastierino, barra schede, finestre
│   ├── pages.css       giochi, diario, movimento, percorso, lezioni, negozio, collezioni
│   ├── themes.css      aspetto «versione 2», sfondi, video
│   └── festa.css       la festa di compleanno
├── js/
│   ├── lib/            librerie esterne (generatore QR, licenza)
│   ├── core/           base: salvataggi e drago (core, cloud), progressi, notifiche, sfondi,
│   │                   musica, microfono (mic: registra e riascolta), guscio dell'app (shell), avvio (boot),
│   │                   applicatore delle correzioni
│   ├── sezioni/        routine, giochi, matematica, scienze, sport, scopri, diario, orologio, schede,
│   │                   teatro (la mia parte), festa (compleanno: vigilia, festa, 10 sorprese, capsula),
│   │                   disegno (tela libera, percorso in 5 tappe, Il mio museo)
│   └── percorso/       percorso e lezioni, tappe di matematica di 5ª, negozio, collezioni, video
├── tools/controlla.py  controllo automatico (parte da solo a ogni build; con errori non si pubblica)
├── tools/sorgenti_pubbliche.py  copia le sorgenti in /sorgenti/il-mio-mondo/ del repository (senza revisioni di lavoro, con controllo dei dati personali)
├── README.md           memoria dell'app: indirizzo, dati sul dispositivo, collegamenti, regole
├── data/
│   ├── spiegazioni/    racconto + mappa concettuale per argomento (pilota: 6), controllati da tools/controlla.py
│   ├── domande/argomenti.json  nomi e icone degli argomenti di ogni materia (ogni domanda ha il campo «arg»)
│   ├── domande/quiz/   ★ FONTE UNICA delle domande: un file per materia, una scheda per domanda
│   │                   _codici.txt = registro dei codici (non modificare), _ritirati.txt = codici tolti apposta
│   ├── domande/        altri contenuti (curiosità, missioni, barzellette, Roblox, soldi, video, aiuti, teatro,
│   │                   disegno: 25 progetti guidati con le guide da ricalcare)
│   ├── programma/      mappa del programma per anno (5a.json; poi 1m.json, 2m.json, 3m.json)
│   ├── testi/          testi lunghi delle materie (inseriti al build)
│   ├── verifiche/      revisioni indipendenti (rev2…rev6): correzioni, figurine, istruzioni ai revisori (nel repository solo fix_, factfix_, cur_)
│   └── _gen/           file generati dal build (non modificare)
├── assets/fonts/       caratteri incorporati (licenza OFL)
├── docs/LEGGIMI.html    guida per il genitore (copiata nel sito)
└── (le versioni vecchie sono state cancellate il 17 ottobre 2026)
```

Regole: niente dati personali della bambina nel codice (nome, compleanno e copione del teatro restano solo sull'iPad); ogni contenuto nuovo passa da autore → revisore indipendente → controllo automatico.

## Una domanda (data/domande/quiz/<materia>.json)
```
{"id":"7h1fp","q":"Qual è il plurale di «uovo»?","ok":"uova","wrong":["uovi","uove"],"k":"riga chiave (max 12 parole)","e":"spiegazione per «Perché?»"}
```
- `id` è il codice fisso: **non si cambia mai**, nemmeno se si corregge il testo (i ricordi della bambina sono legati a lui).
- Una domanda nuova riceve un codice nuovo, mai usato prima. Le risposte vengono mescolate dall'app.
- Per togliere una domanda: si toglie la scheda e si scrive `materia:codice` in `_ritirati.txt`.

## Salvataggi
`js/core/migra.js`: numero di versione dei salvataggi (`DATA_VER`). Se cambia il formato si aggiunge lì la conversione; prima di convertire l'app copia tutti i dati in `mondo-pre-migra`.

## Rapporto
Dopo ogni build: `data/_gen/rapporto.md` (domande per materia, copertura del programma, temi con meno di 5 domande).

## Dati che vanno ai genitori
Il collegamento automatico (cifrato) usa `licenze/mondo-sync.js`, pubblicato da Pianificazione: invia contatori dello studio, percorso e diario (emozioni, presenze, testi). Il QR porta solo numeri, emozioni e presenze (non è cifrato). Nome, aspetto, copione e capsula del tempo non vanno ai genitori (restano sull'iPad e nelle sue copie di sicurezza).

## Anteprime per il genitore
`?festa=prova` in fondo all'indirizzo: mostra la festa di compleanno senza salvare niente.

## Sito condiviso
Nello stesso sito ci sono anche Pianificazione (`/licenze/`) e Semestre filtro (`/semestre/`, sorgenti in `/sorgenti/`). La copia senza internet di Il mio mondo usa solo cache `mondo-…` e non intercetta le sottocartelle: non toccare le copie delle altre app. `deploy.sh` copia solo i file di Il mio mondo nella cartella principale.
