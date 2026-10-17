# Semestre filtro — file sorgente (versione finale, 11 ottobre 2026)

App per iPad per preparare i tre esami del semestre filtro di Medicina 2026/27 (Università del Piemonte Orientale): **Fisica, Chimica e propedeutica biochimica, Biologia**. Segue i syllabus ufficiali MUR 2026/27 e il formato d'esame 2026: 21 domande a risposta multipla + 10 a completamento, 50 minuti, +1 / −0,1 / 0.

## Provarla
- **Indirizzo:** https://f6kd4bp6sr-stack.github.io/mie-app/semestre/
- **Installarla su iPad:** aprire l'indirizzo con **Safari** → pulsante Condividi → «Aggiungi alla schermata Home» → Aggiungi.
- Dopo il primo avvio funziona anche senza internet. Si aggiorna da sola quando viene pubblicata una nuova versione, ma mai durante una simulazione.
- I progressi restano solo su quel dispositivo; per passarli a un altro iPad: «Salva copia su File / iCloud» → sull'altro iPad «Progressi e copie» → «Ripristina da una copia».

## Che cosa contiene
| | Fisica | Chimica | Biologia |
|---|---|---|---|
| Argomenti (dal syllabus ufficiale) | 34 | 21 | 29 |
| Domande (multipla + completamento) | 763 | 551 | 739 |
| di cui delle prove reali 2025 (📌) | 62 | 58 | 62 |
| Calcoli a numeri sempre nuovi (🎲) | 49 tipi | 34 tipi | 19 tipi |
| Esempi svolti | almeno 4 per argomento | almeno 3 | almeno 3 |
| Animazioni interattive | 34 (una per argomento) | 21 (una per argomento) | 29 (una per argomento) |
| Test d'ingresso | 14 domande scelte ogni volta tra 42 | 14 tra 42 | 14 tra 42 |

Ogni argomento contiene:
- **In breve**;
- **Spiegazione**;
- **Animazione**;
- **Esempi svolti** passo per passo (in Fisica almeno 3, tra cui un problema guidato);
- **Formule** (in Biologia: schemi da ricordare);
- **Trappola d'esame**;
- **In medicina**;
- **Esercizi** con correzione e spiegazione.

Ogni sezione dell'argomento è una **tendina** che si apre e si chiude toccando il titolo (l'app ricorda quali hai lasciato aperte); lo stesso vale per le unità, per le materie nel menu e per le tabelle dei progressi.

**Domande sempre diverse.** Il test d'ingresso sceglie 2 domande per unità tra 6, preferendo quelle viste meno e senza mai ripetere un test già fatto. Esercizi e simulazioni propongono prima le domande mai viste, evitano quelle delle ultime prove e inseriscono **calcoli con numeri nuovi a ogni uso** (🎲). Le domande uscite davvero nelle prove nazionali 2025 sono segnate con **📌 Prova reale · appello, numero**; le due prove si possono rifare complete.

Per ogni esame ci sono anche:
- **Percorso**: piano di studio e consiglio del giorno;
- **Test d'ingresso** per partire dal livello giusto, con l'analisi degli errori: risposta data, perché è sbagliata, risposta giusta, perché, e argomento da ripassare;
- **Esercizi**: serie da 10, punti deboli, ripasso errori;
- **Simulazione** 21 + 10 in 50 minuti, con timer che continua anche chiudendo l'app;
- **Errori e storico**: obiettivo di studio dagli errori, ripasso guidato, storico di tutte le prove con data e ora;
- **Formulario** o schemi;
- **Storia e syllabus**: cosa è uscito nel 2025, novità 2026 e fonti. In Fisica c'è anche la mappa del syllabus voce per voce.

Pagine comuni:
- **📰 Novità del giorno**: in evidenza all'apertura; notizie con data e fonte dalle fonti indicizzate (MUR, Universitaly, UPO…), aggiornate ogni mattina da un agente di ricerca e scaricate in background (restano salvate anche senza rete);
- **🔎 Cerca** in argomenti, spiegazioni e domande delle tre materie;
- **Regole e UPO**: date, graduatoria, recuperi, aggiornamenti datati;
- **Fonti**: 44 link;
- **Progressi e copie**, con **🎨 Aspetto** (sfondo disegnato a tema con la materia, oppure scelto a mano; intensità; densità);
- l'**autodiagnosi** giornaliera lavora in silenzio (controllo e correzione automatica dei dati, registro interno): non compare allo studente;
- **Installa su un altro iPad**, con codice QR.

## File (in ordine di caricamento)
| File | Contenuto |
|---|---|
| `a_head.html` | Intestazione della pagina e stile grafico (temi chiaro e scuro, adatto a iPad e telefono). |
| `b_data.js` | Date d'esame, link `SRC` e **tutte le fonti** `SOURCES`. Fisica: unità e CFU, 34 argomenti (in breve, formule, trappole), domande di base, test d'ingresso. |
| `b3_spiegazioni_fis.js` | Fisica: spiegazioni, esempi svolti, collegamenti medici (`FIS_EXPL`), domande aggiuntive, mappa del syllabus (`FIS_MAP`). |
| `b6_fis_esercizi.js` | Fisica, approfondimento: un problema guidato per argomento (`FIS_PROB`) e 132 esercizi significativi. |
| `b2_other.js` | Chimica e Biologia: unità, CFU, argomenti e voci del syllabus. Registro `EXAMS` dei tre esami. |
| `b4_chimica.js` | Chimica: contenuti (`CHI_EXPL`), domande `CHI_QB`, test d'ingresso `CHI_PT`, animazioni collegate, sintesi delle prove 2025. |
| `b5_biologia.js` | Biologia: contenuti (`BIO_EXPL`), domande `BIO_QB`, test d'ingresso `BIO_PT`, animazioni collegate, sintesi delle prove 2025. |
| `b8_prove_reali.js` | Domande delle prove nazionali 2025 (📌, con appello e numero) e domande in più del test d'ingresso. |
| `b9_chimica_plus.js`, `b10_biologia_plus_a.js`, `b11_biologia_plus_b.js`, `b12_fisica_plus.js` | Ampliamento 2026: domande nuove su tutte le voci del syllabus, test d'ingresso (6 domande per unità), paragrafi ed esempi. |
| `b13_chimica_plus2.js`, `b14_biologia_plus2a.js`, `b15_biologia_plus2b.js`, `b16_fisica_plus2.js` | Terza tornata: domande sui tipi più frequenti nelle prove 2025, esempi svolti e paragrafo «Come si ragiona negli esercizi» per ogni argomento. |
| `b17_spiegazioni_estese.js` | Spiegazioni riscritte (ragionamento con i numeri, perché è giusta, errore tipico del distrattore) per tutte le domande delle prove reali e per quelle che avevano una spiegazione troppo corta: 968 domande. |
| `b7_pt_spiegazioni.js` | Test d'ingresso: per ogni domanda l'argomento da ripassare, perché la risposta giusta è giusta e, per ogni opzione sbagliata, il ragionamento che porta all'errore (`PT_EXPL`). |
| `c_anim.js` | Motore delle animazioni (`mountAnim`) e 25 animazioni di Fisica. |
| `c2_anim_chi_bio.js` | 19 animazioni di Chimica e Biologia. |
| `c3_anim_fis_extra.js` | 9 animazioni di Fisica aggiuntive. |
| `c4_anim_chimica_plus.js`, `c5_anim_bio_plus_a.js`, `c6_anim_bio_plus_b.js` | 31 animazioni nuove: ora ogni argomento di Chimica e Biologia ha la sua. |
| `f_gen.js`, `f2_gen_plus.js` | Calcoli a numeri sempre nuovi (`GEN`, 102 tipi): ogni variante si ricostruisce dal suo identificativo `g~esame~tipo~seme`. |
| `d4_extra.js` | Emoji degli argomenti, tendine, sfondi a tema, novità del giorno, ricerca, autodiagnosi. |
| `ufficiale.json` | Materiali ufficiali pubblicati (esercitazioni per materia e unità didattica, simulazioni, piattaforma) con data, fonte e dati della doppia verifica; l'app li mostra solo con la loro data in «Storia e syllabus», «Regole e UPO» e nelle unità. |
| `news.json`, `diagnosi.json` | Novità del giorno e esito della verifica serale: li aggiornano ogni giorno gli agenti automatici. |
| `strumenti/` | `verifica_contenuti.js`, `verifica_app.py`, `verifica_ufficiale.py` (controllo di `ufficiale.json`), `uniforma_prove_reali.py` (predisposto: sposta la marcatura 📌 di Chimica e Biologia dentro le domande; si lancia a secco, con `--applica` modifica i file) e `AGENTI.md` (istruzioni dei due agenti giornalieri). |
| `d2_storico.js` | **Storico delle prove** (ogni test, serie di esercizi e simulazione salvati con data, ora e risposte, sempre riapribili), **obiettivo di studio** creato in automatico dagli errori e **ripasso guidato** degli errori (concetti chiave, trappola, spiegazione di ogni errore, «Rifai gli errori»). |
| `d_app.js` | Motore dell'app: navigazione, test, esercizi, simulazione, piano di studio, progressi, copie, installazione. |
| `e_barra_sf.js` | Aggiornamento automatico, copia giornaliera sul dispositivo, copia su File / iCloud. |
| `qrcode.js` | Libreria per il codice QR della pagina «Installa» (licenza MIT, vedi `LICENSE-qrcode.txt`). |
| `icone/` | Icone dell'app (180, 192, 512 px). |
| `build.py` | Costruisce l'app pubblicata nella cartella `semestre/`. |

## Costruire e pubblicare
Dalla cartella principale del repository (servono Python 3 e Node.js):
```
python3 sorgenti/semestre/build.py
git add -A && git commit -m "Semestre filtro: …" && git push
```
`build.py` produce `semestre/index.html` (un'unica pagina con tutto dentro), `sw.js` (funzionamento offline), `manifest.webmanifest`, `version.json` e copia le icone. Il numero di versione nasce dal contenuto: se cambia qualcosa, gli iPad trovano la nuova versione al prossimo avvio. GitHub Pages pubblica in pochi minuti.

Le pagine pubblicate **non si modificano a mano**: si modificano questi sorgenti e si rilancia la costruzione.

## Aggiungere contenuti
- **Domanda a risposta multipla:** `{t:"<argomento>",k:"m",q:"testo",o:[5 opzioni],a:<indice della giusta>,s:"spiegazione"}`.
- **Domanda a completamento:** `{t:…,k:"c",q:"… ____ …",a:["RISPOSTA","VARIANTE"],s:…}`. Maiuscole, accenti e spazi non contano.
- **Argomento:** `{id,u,t,breve:[…],form:[["formula","nota"]],trap:"…",anim:"<nome>",sp:[paragrafi],es:[{q,p:[passaggi],r}],med:"…"}`.
- Le opzioni vengono rimescolate in modo stabile: la risposta giusta può stare in qualsiasi posizione. Ogni testo di domanda deve essere unico, perché da esso nasce l'identificativo che salva i progressi.
- Per ogni unità, `q` è il numero di domande in simulazione (in tutto 31) e `cp` quante sono a completamento (in tutto 10).
- Animazione nuova: `AN.<nome> = {h, c:[controlli], init(st,p), f(g,p,st,dt,W,H)}`. `f` disegna e restituisce il testo da mostrare sotto.

## Agenti automatici
- **Ogni mattina** un agente cerca le novità sulle fonti indicizzate e aggiorna `news.json`; controlla anche la pagina UPO, il MUR e la piattaforma ufficiale e registra in `ufficiale.json` esercitazioni, simulazioni e unità didattiche pubblicate, solo dopo doppia verifica (due letture indipendenti + seconda fonte).
- **Ogni sera** un agente ricostruisce l'app, lancia le verifiche di `strumenti/` (con una terza verifica delle voci ufficiali nuove), corregge gli errori trovati, scrive `diagnosi.json` e pubblica.
Dettagli in `strumenti/AGENTI.md`.

## Salvataggio
Tutto si salva da solo, a ogni risposta, senza nessuna richiesta:
- nella memoria del browser (`localStorage`) e in IndexedDB;
- con una copia del giorno conservata per 30 giorni;
- con la richiesta silenziosa di memoria persistente.

Anche un test d'ingresso lasciato a metà e la simulazione in corso restano salvati se si chiude l'app. Le azioni che cancellano o consegnano non aprono finestre di conferma: si conferma toccando due volte lo stesso pulsante.

## Fonti e privacy
- L'elenco completo con i link è in `SOURCES` e nella pagina «🔗 Fonti» dell'app.
- Dove le analisi non ufficiali e i testi ufficiali (syllabus MUR, pagina UPO) non coincidono, l'app segue i testi ufficiali.
- Spiegazioni ed esercizi sono scritti apposta per l'app.
- Il codice non contiene dati personali: test, risposte e progressi restano solo sul dispositivo.
