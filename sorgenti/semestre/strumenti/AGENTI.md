# Agenti automatici dell'app «Semestre filtro»

Due attività pianificate lavorano ogni giorno su questo repository (`f6kd4bp6sr-stack/mie-app`, ramo `main`). Le pagine pubblicate stanno in `semestre/`, i sorgenti in `sorgenti/semestre/`. Si modificano solo i sorgenti, poi si ricostruisce con `python3 sorgenti/semestre/build.py`.

Regole comuni:
- Non inserire dati personali: il repository è pubblico.
- Fare commit e push su `main` con un messaggio in italiano.
- Se lo stesso giorno non c'è niente da cambiare, non fare commit vuoti.

## 1. Ricerca delle novità (ogni mattina)

Scopo: aggiornare `sorgenti/semestre/news.json`. L'app lo scarica in background a ogni apertura e lo mostra nella pagina «📰 Novità del giorno».

1. Leggere `sorgenti/semestre/news.json`. L'elenco `sources` contiene le fonti indicizzate: MUR, Universitaly, UPO, piattaforme ufficiali e testate affidabili.
2. Cercare sul web (WebSearch, poi WebFetch per verificare) le notizie dell'ultima settimana sul semestre filtro / semestre aperto di Medicina 2026/27. Gli argomenti da cercare sono:
   - date e regole;
   - avvisi UPO;
   - decreti;
   - ricorsi e sentenze;
   - simulazioni ufficiali;
   - esiti;
   - graduatorie;
   - scorrimenti.
3. Aggiungere in testa a `items` solo le notizie verificate aprendo la pagina. Ogni notizia ha questa forma:
   `{"date":"AAAA-MM-GG","title":"…","summary":"1-2 frasi con il fatto concreto","source":"nome","url":"pagina esatta","tag":"Date|Regole|UPO|Iscrizioni|Graduatoria|Materiali|Ricorsi|Statistiche|Storico","scope":"nazionale|UPO"}`
   - `date` è la data di pubblicazione.
   - Non inserire due notizie con lo stesso URL.
   - Tenere al massimo 120 notizie.
   - Ordinarle dalla più recente.
4. Aggiornare `updated` con data e ora (fuso Europe/Rome). Aggiungere a `sources` le nuove fonti ufficiali trovate.
5. Controllare che il file sia JSON valido: `python3 -c "import json;json.load(open('sorgenti/semestre/news.json'))"`.
6. Eseguire `python3 sorgenti/semestre/build.py`, che copia il file in `semestre/news.json`. Poi commit «Semestre filtro: novità del AAAA-MM-GG» e push.
7. Se una notizia cambia regole o date già scritte nell'app, correggere anche i testi:
   - in `d_app.js`, funzioni `vRegole` e `vHub`;
   - in `b_data.js`, date `EXAM1` ed `EXAM2`.
   Dopo la correzione, rieseguire la verifica (sezione 2).

## 3. Materiali ufficiali UPO e piattaforma (ogni mattina, insieme alla sezione 1)

Scopo: tenere `sorgenti/semestre/ufficiale.json` sempre allineato a quello che UPO e MUR pubblicano su test, esercitazioni, simulazioni e unità didattiche. L'app mostra queste voci solo come informazioni con la loro data, senza nessuna evidenza particolare per lo studente:
- in «Storia e syllabus» di ogni materia;
- in «Regole e UPO»;
- dentro ogni unità degli «Argomenti», con la riga «Esercitazioni ufficiali su questa unità: sulla piattaforma dal …».

Le fonti da controllare **ogni giorno** sono:
- la pagina UPO «Modalità di accesso a Medicina e Chirurgia 2026/27»;
- le notizie MUR sul semestre aperto;
- la piattaforma semestreaperto-medodovet.it, se leggibile;
- Universitaly.

Cerca: nuove esercitazioni (per materia e unità didattica), simulazioni ufficiali (annunciate o disponibili), test di ingresso, MOOC, iscrizione agli esami, convocazioni e aule, cambi di modalità delle lezioni.

**Doppia verifica dell'acquisizione (obbligatoria).** Una voce entra in `voci` solo se passa tutti questi controlli:
1. **Prima lettura:** WebFetch della pagina con una richiesta che estrae data, testo essenziale, materie e unità.
2. **Seconda lettura indipendente:** un secondo WebFetch della stessa pagina con una richiesta diversa (per esempio «riporta testualmente la frase su…»). I dati estratti devono coincidere con la prima lettura: data, materie, unità, numeri.
3. **Seconda fonte**, quando esiste (MUR, Universitaly, la piattaforma stessa): i fatti devono essere coerenti. Va annotata in `verifica.seconda_fonte` e `verifica.url2`. Se una seconda fonte non esiste, scrivere «nessuna seconda fonte disponibile».
4. Se le due letture o le due fonti non coincidono, la voce **non** va in `voci`: va in `in_verifica`, con il campo `motivo`, e l'app non la mostra. Si ricontrolla il giorno dopo.
5. Le unità vanno indicate con gli id dell'app:
   - Fisica: u1…u7;
   - Chimica: c1…c7;
   - Biologia: b1…b7.
   Vanno dedotte dal testo ufficiale e confrontate con i titoli delle unità del syllabus.
6. Aggiornare `updated` (fuso Europe/Rome) e `verifica.controllato` delle voci ricontrollate. Le voci vanno ordinate dalla più recente.
7. Lanciare `python3 sorgenti/semestre/strumenti/verifica_ufficiale.py` finché dà «✅».
8. Aggiungere la stessa notizia anche a `news.json` (sezione 1), con la stessa data e lo stesso testo.
9. Eseguire `python3 sorgenti/semestre/build.py`, fare commit «Semestre filtro: materiali ufficiali AAAA-MM-GG» e push.

Se una pubblicazione ufficiale cambia ciò che l'app insegna (per esempio nuove regole d'esame o date), correggere anche i testi dell'app (sezione 1, punto 7).

## 2. Verifica e correzione (ogni sera, «in chiusura»)

Scopo: trovare gli errori dell'app, correggerli e pubblicare l'esito in `sorgenti/semestre/diagnosi.json`. L'app lo scarica e lo conserva nel registro interno (non è mostrato allo studente).

1. Eseguire `git pull`, poi `python3 sorgenti/semestre/build.py`.
2. Lanciare `node sorgenti/semestre/strumenti/verifica_contenuti.js`. Controlla domande, test d'ingresso, argomenti, animazioni collegate e calcoli a numeri variabili.
3. Lanciare `PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers python3 sorgenti/semestre/strumenti/verifica_app.py`. Controlla:
   - tutti gli argomenti, i pulsanti e i percorsi;
   - le tendine;
   - i test d'ingresso sempre diversi;
   - le simulazioni;
   - la prova reale;
   - il salvataggio;
   - novità, ricerca e autodiagnosi;
   - la larghezza del telefono.
4. Controllare la versione online: aprire `https://f6kd4bp6sr-stack.github.io/mie-app/semestre/version.json` e confrontarla con `semestre/version.json`.
5. Lanciare `python3 sorgenti/semestre/strumenti/verifica_ufficiale.py` e **ricontrollare (terza verifica)** con WebFetch le voci di `ufficiale.json` aggiunte o cambiate nelle ultime 24 ore: se una non è più confermata dalla fonte, va spostata in `in_verifica` con il motivo.
6. Controllare a campione 10 link di `SOURCES` (in `b_data.js`) e di `news.json`.
   Se WebFetch rifiuta un indirizzo copiato dai file, cercarlo prima con WebSearch (titolo della pagina) e poi aprirlo dal risultato della ricerca.
7. Se c'è un problema:
   - Correggerlo nei sorgenti con la modifica più piccola e sicura. Esempi: un dato sbagliato, un link rotto da sostituire con la pagina ufficiale aggiornata, una domanda malformata o doppia, un errore JavaScript.
   - Ricostruire e rilanciare le verifiche finché sono verdi.
   - Non togliere funzioni.
   - Non cambiare il formato dei dati salvati sugli iPad (chiave `semestre-v1`).
8. Scrivere `sorgenti/semestre/diagnosi.json` così:
   `{"at":"AAAA-MM-GGTHH:MM+02:00","ok":true|false,"sintesi":"una frase","corretti":["…"],"problemi":["… rimasti aperti"]}`
9. Eseguire `python3 sorgenti/semestre/build.py`, poi commit «Semestre filtro: verifica giornaliera AAAA-MM-GG» e push.

Lo stesso controllo dei dati gira anche dentro l'app, senza chiedere nulla:
- ogni giorno all'apertura e a ogni chiusura (funzione `diagnosi` in `d4_extra.js`);
- corregge da sola i dati salvati sul dispositivo;
- tiene il registro dei controlli.
