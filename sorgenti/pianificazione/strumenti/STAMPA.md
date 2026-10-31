# 🗞️ Stampa di oggi — istruzioni per l'agente (alle 6 e alle 22)

L'app «Pianificazione», sezione 🗞️ Stampa di oggi, mostra le notizie principali della giornata: generali (Italia, mondo, economia) e di Torino. Il file è **pubblico** (`licenze/stampa-oggi.json`), quindi:
- solo fatti;
- nessun dato personale;
- nessuna opinione dell'agente.

## Edizioni
- **mattina**: il giro delle 6. Le notizie della notte e quelle che segneranno la giornata.
- **sera**: il giro delle 22. Che cosa è successo durante la giornata.

Ogni giro **sostituisce** le notizie dell'edizione precedente, e quindi del file intero. In `controlli` resta traccia degli ultimi giri.

## Dove cercare
Usa la regola «prima cerca, poi leggi»: fai una WebSearch limitata al sito (allowed_domains) e poi un WebFetch solo sugli URL che la ricerca ha restituito. Se un sito blocca la lettura, passa al successivo e annotalo nella nota del controllo.

- **Agenzie e servizio pubblico**:
  - ansa.it (comprese le pagine «Torino» e «Piemonte»)
  - rainews.it (comprese le pagine «TGR Piemonte»)
  - agi.it
- **Quotidiani nazionali**, a rotazione e di orientamento diverso: corriere.it, repubblica.it, ilsole24ore.com, lastampa.it, ilpost.it, avvenire.it, ilgiornale.it, ilfattoquotidiano.it.
- **Se una testata blocca la ricerca o la lettura**, il 31/10/2026 è successo con lastampa.it, repubblica.it, corriere.it e rainews.it. In quel caso usa anche skytg24.it, tgcom24.mediaset.it, adnkronos.com, avvenire.it, ilgiornale.it e ilfattoquotidiano.it, così le fonti restano varie. Le notizie di Torino si possono cercare anche su ansa.it/piemonte, torinoggi.it e lagendanews.com.
- **Torino**:
  - lastampa.it/torino
  - torino.corriere.it
  - torino.repubblica.it
  - torinotoday.it
  - comune.torino.it (Torinoclick e le notizie del Comune)
  - regione.piemonte.it

## Che cosa scegliere
- **italia**: da 3 a 6 notizie. Politica, cronaca di rilievo nazionale, scuola, sanità, giustizia, lavoro.
- **mondo**: da 3 a 6 notizie.
- **economia**: da 1 a 4 notizie. Prezzi, mercati, pensioni e fisco solo quando la notizia riguarda tutti.
- **torino**: da 3 a 6 notizie. Città e area metropolitana: trasporti, lavori, servizi, eventi, cronaca di rilievo.
- **cultura** e **sport** (facoltative): da 0 a 3 notizie ciascuna.

Per decidere l'ordine, conta quanto spazio danno alla notizia più testate. Le notizie più importanti vanno per prime.

Lascia fuori:
- pettegolezzi;
- notizie solo «acchiappa-clic»;
- dettagli macabri;
- nomi di vittime minorenni.

## Come scrivere ogni notizia
```json
{"id": "it-manovra", "t": "titolo scritto da te, massimo 16 parole", "s": "sintesi con parole tue, 2-3 frasi, massimo 60 parole",
 "d": "AAAA-MM-GG", "fonti": [{"n": "ANSA", "url": "https://…"}, {"n": "Corriere della Sera", "url": "https://…"}],
 "link": [{"n": "approfondimento facoltativo: scheda, spiegone, documento ufficiale", "url": "https://…"}]}
```

**Regole per il testo**
- Il **titolo** e la **sintesi** li scrivi tu, con parole tue. Non copiare i titoli dei giornali, non copiare frasi degli articoli, niente citazioni lunghe (massimo una breve tra «»).
- Usa un **tono neutro**: fatti, numeri, chi ha fatto che cosa. Quando su una questione politica ci sono posizioni diverse, scrivi le principali in modo equilibrato («il Governo sostiene…, l'opposizione…»).

**Fonti e verifica**
- Le **fonti** sono almeno una e, quando esiste, meglio due di testate diverse. I numeri e le date devono coincidere tra le fonti. Se una notizia non è confermata («secondo indiscrezioni»), dillo nella sintesi oppure lasciala fuori.
- Indica la fonte **anche quando l'articolo è a pagamento**: il link resta utile.
- I **link di approfondimento** sono facoltativi, al massimo 3. Usali quando aiutano a capire: un documento ufficiale, una pagina del Comune, una scheda che spiega.
- Gli URL vanno copiati **esatti**, mai inventati.

**Date**
- `d` è la data della notizia. Solo notizie delle ultime 24 ore, oppure fatti che sono ancora al centro della giornata.

## Il file
```json
{"app": "stampa-oggi", "edizione": "mattina", "updated": "AAAA-MM-GGTHH:MM+01:00", "nota": "facoltativa",
 "sezioni": {"italia": […], "mondo": […], "economia": […], "torino": […], "cultura": […], "sport": […]},
 "controlli": [{"at": "…", "edizione": "mattina", "notizie": 18, "note": "fonti lette, siti non raggiungibili"}]}
```
In `controlli` tieni le ultime 20 righe. Gli `id` sono brevi, unici e preceduti dalla sezione (`it-…`, `mo-…`, `ec-…`, `to-…`, `cu-…`, `sp-…`).

## Pubblicazione
1. `git pull`.
2. Scrivi lo stesso file in `licenze/stampa-oggi.json` e in `sorgenti/pianificazione/statici/stampa-oggi.json`.
3. `python3 sorgenti/pianificazione/strumenti/verifica_stampa.py licenze/stampa-oggi.json sorgenti/pianificazione/statici/stampa-oggi.json` deve dire ✅.
4. Commit dei soli due file, con il messaggio «Pianificazione: stampa di oggi AAAA-MM-GG mattina|sera». Push su main; se viene rifiutato, `git pull --rebase` e riprova.
5. Non toccare nessun altro file.
