# Il mio mondo — memoria dell'app

App di studio per bambini (5ª elementare), con il drago, le lezioni delle materie, i giochi, il diario, il disegno e la festa di compleanno.

Interfaccia semplice (scelta del genitore, ottobre 2026): una sola 🏠 Casa con tutte le sezioni e tutte le materie aperte da subito; niente percorso a tappe bloccate, niente linguette in basso, niente missioni né contatore dei giorni di fila. I dati di prima (lezioni fatte, ricordi, gemme) restano tutti.

Argomenti: ogni domanda di `data/domande/quiz/*.json` ha il campo `arg`; i nomi degli argomenti di ogni materia sono in `data/domande/argomenti.json` ([id, nome, icona]). Le lezioni sono gli argomenti (scelta libera, non più in fila); in Casa c'è la ricerca per parola in tutte le materie con la lezione mista. Ogni domanda nuova deve avere il suo `arg`: il controllo automatico lo verifica.

Progetto pilota «Seguendo la classe» (riunione di classe, ottobre 2026): la 🏠 Casa ha due parti, **🏫 La mia scuola** (le materie del programma di 5ª, come in classe, compresi 🏐 Motoria e 🕊️ Religione; poi 🗓️ La mia classe e 🎒 Verso la 1ª media) e **🌟 Fuori scuola** (sport, Roblox, soldi, igiene, vestiti e «Fare e scoprire»). I contenuti nuovi seguono il programma reale della classe: Cittadinanza attiva (cura di sé e dell'altro, Costituzione, pace, inclusione, 27 gennaio, 21 marzo, internet sicuro), Motoria (coordinazione, pallavolo, basket; poi corpo umano e giochi dei Romani), Zagazoo, Bruno Munari, Infinitamente grande e infinitamente piccolo. Gli argomenti delicati sono «👀 da guardare insieme»: solo racconto e mappa, niente domande (campo `"solo": true`).

🗓️ La mia classe (`js/sezioni/classe.js`): progetti, uscite e date della classe in `vale2-classe`, **solo sull'iPad** (e nelle sue copie). Si caricano una volta con un link speciale `…/mie-app/#classe=<dati>` preparato per il genitore (aperto in Safari, oppure incollato nell'app con «🔗 incolla il link della classe», perché l'app della Home non vede i dati di Safari) (la parte dopo # non arriva al server e l'app la toglie subito dall'indirizzo); poi si aggiungono e tolgono appuntamenti a mano. Nomi di insegnanti e scuola, date delle uscite e indirizzi non vanno mai nel codice. Autonomia (scelta del genitore): è la bimba a completare quando, dove e che cosa portare (🕵️ Da scoprire, +3 💎 una volta per uscita), ad aggiungere verifiche e appuntamenti e a raccontare nel 📅 Diario com'è andata (`diary[giorno].ev[id]`); ogni giorno il diario propone 📝 La mia nota con una domanda per riflettere (`nq`, `nx`). Il drago lo chiede tra le novità (`clNews` in `js/core/notify.js`).

Spiegazioni con racconto e mappa concettuale (22 argomenti): `data/spiegazioni/<materia>.json`, motore in `js/sezioni/spiega.js`, progetto in `docs/PROGETTO-SPIEGAZIONI.md`. Cartine interattive: `data/cartine/<id>.json` (coste Natural Earth, pubblico dominio, semplificate; luoghi con posizione e testo), motore `js/sezioni/cartina.js`; una spiegazione la apre con il campo `"cartina"`. Dati sul dispositivo: `vale2-spiega` (argomenti già visti e nodi accesi), `vale2-mappe` (le mappe costruite da lei, solo testo).

| | |
|---|---|
| Indirizzo | https://f6kd4bp6sr-stack.github.io/mie-app/ (non cambia: icona sulla Home e dati restano) |
| File pubblicati | nella cartella principale del repository: `index.html`, `sw.js`, `manifest.webmanifest`, `version.json`, `check.txt`, icone, `LEGGIMI.html`, `robots.txt` |
| Sorgenti | `/sorgenti/il-mio-mondo/` (questa cartella) |
| Copia senza internet | cache `mondo-<versione>` (il service worker cancella solo le proprie cache e non serve le sottocartelle del sito) |

## Dati sul dispositivo (solo di questa app)
| Dove | Chiavi |
|---|---|
| localStorage | `vale2-…` (tutto lo stato: drago, percorso, diario, festa, capsula, teatro, disegno: progetti fatti e quadri del museo con anteprima piccola…), `msync-cfg` (collegamento con i genitori), `mondo-copia` (stato della copia automatica), `mondo-pre-migra` |
| IndexedDB | `il-mio-mondo` (copie), `mondo-sfondo` (sfondo scelto), `mondo-disegni` (disegni a grandezza piena, livelli per continuare, bozza della tela: restano solo sull'iPad, nella copia vanno le anteprime) |

Nome, compleanno, aspetto, copione del teatro, capsula del tempo e dati della classe (🗓️ La mia classe) restano solo sull'iPad e nelle sue copie: **non vanno mai nel repository**.

## Collegamento con Pianificazione
L'app carica `licenze/mondo-sync.js` (pubblicato da Pianificazione) e invia ai genitori, cifrati, contatori dello studio, percorso e diario. Permessi di rete: solo `https://api.github.com` (`connect-src`). La copia completa automatica è cifrata in un gist privato (`copia.json` + `copia-N.part`).

## Costruire e pubblicare
`python3 build.py` (con il controllo automatico `tools/controlla.py`) → cartella `mondo-out`; `sh deploy.sh "messaggio"` pubblica i file della cartella principale e copia queste sorgenti in `/sorgenti/il-mio-mondo/`. Non tocca `/licenze/`, `/semestre/` né `/sorgenti/semestre/`.

Le revisioni di lavoro dei contenuti (`data/verifiche/`) non sono pubblicate: nel repository ci sono solo le correzioni che il build usa (`fix_*`, `factfix_*`, `cur_*`).

Dettagli dei file: `STRUTTURA.md`.

## Regole
- Non insegnare cose errate: ogni contenuto nuovo passa da autore → revisore indipendente → controllo automatico.
- Nessun dato personale della bambina nel codice: il sito è pubblico.
- Per sezioni nuove si chiede prima come procedere.
