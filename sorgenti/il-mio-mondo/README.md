# Il mio mondo — memoria dell'app

App di studio per bambini (5ª elementare), con il drago, il percorso, i giochi, il diario e la festa di compleanno.

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

Nome, compleanno, aspetto, copione del teatro e capsula del tempo restano solo sull'iPad e nelle sue copie: **non vanno mai nel repository**.

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
