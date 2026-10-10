# Semestre filtro — file sorgente (versione finale, 10 ottobre 2026)

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
| Domande (multipla + completamento) | 374 | 149 | 156 |
| Animazioni interattive | 34 (una per argomento) | 11 | 8 |
| Test d'ingresso | 14 domande | 14 | 14 |

Ogni argomento contiene:
- **In breve**;
- **Spiegazione**;
- **Animazione**;
- **Esempi svolti** passo per passo (in Fisica almeno 3, tra cui un problema guidato);
- **Formule** (in Biologia: schemi da ricordare);
- **Trappola d'esame**;
- **In medicina**;
- **Esercizi** con correzione e spiegazione.

Per ogni esame ci sono anche:
- **Percorso**: piano di studio e consiglio del giorno;
- **Test d'ingresso** per partire dal livello giusto, con l'analisi degli errori: risposta data, perché è sbagliata, risposta giusta, perché, e argomento da ripassare;
- **Esercizi**: serie da 10, punti deboli, ripasso errori;
- **Simulazione** 21 + 10 in 50 minuti, con timer che continua anche chiudendo l'app;
- **Formulario** o schemi;
- **Storia e syllabus**: cosa è uscito nel 2025, novità 2026 e fonti. In Fisica c'è anche la mappa del syllabus voce per voce.

Pagine comuni:
- **Regole e UPO**: date, graduatoria, recuperi, aggiornamenti datati;
- **Fonti**: 30 link;
- **Progressi e copie**;
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
| `b7_pt_spiegazioni.js` | Test d'ingresso: per ogni domanda l'argomento da ripassare, perché la risposta giusta è giusta e, per ogni opzione sbagliata, il ragionamento che porta all'errore (`PT_EXPL`). |
| `c_anim.js` | Motore delle animazioni (`mountAnim`) e 25 animazioni di Fisica. |
| `c2_anim_chi_bio.js` | 19 animazioni di Chimica e Biologia. |
| `c3_anim_fis_extra.js` | 9 animazioni di Fisica aggiuntive. |
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

## Fonti e privacy
- L'elenco completo con i link è in `SOURCES` e nella pagina «🔗 Fonti» dell'app.
- Dove le analisi non ufficiali e i testi ufficiali (syllabus MUR, pagina UPO) non coincidono, l'app segue i testi ufficiali.
- Spiegazioni ed esercizi sono scritti apposta per l'app.
- Il codice non contiene dati personali: test, risposte e progressi restano solo sul dispositivo.
