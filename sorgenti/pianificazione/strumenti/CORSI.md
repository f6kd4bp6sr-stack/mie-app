# 🎓 Corsi online — istruzioni per la ricerca e il controllo

La sezione «🎓 Corsi» di Pianificazione mostra corsi online **gratuiti** di università italiane e straniere che si possono **seguire in italiano**. I dati stanno in `sezioni/corsi_dati.json`. Il controllo `strumenti/verifica_corsi.py` parte da solo a ogni build, e il build si ferma se trova un errore.

## Criteri (tutti obbligatori)
- **Gratuito:** tutto il contenuto del corso si segue senza pagare. L'attestato può essere a pagamento, e va indicato. Restano fuori:
  - i corsi Coursera in cui la versione gratuita apre solo il primo modulo;
  - i corsi su abbonamento.
- **Disponibile:** l'iscrizione è aperta il giorno del controllo, oppure il corso si segue al proprio ritmo. Restano fuori i corsi chiusi o archiviati senza accesso.
- **Aperto a tutti** (scelta del proprietario, 3/11/2026): non serve essere iscritti all'università né avere credenziali d'ateneo; basta una registrazione libera (email, SPID o account). `aperto`: true. Restano fuori i corsi riservati a studenti, dipendenti o professionisti di un ente.
- **In italiano:** il corso è in italiano (`Italiano`, `Italiano e inglese`), oppure ha sottotitoli **ufficiali** in italiano dichiarati sulla pagina del corso (`Sottotitoli in italiano`). La traduzione automatica del browser non conta.
- **Università o ente universitario:** sono ammessi università, politecnici e i loro portali, cioè:
  - Federica (Federico II), EduOpen, POK (Polimi);
  - le piattaforme d'ateneo (IDEA Sapienza, UniTo, UniPd…);
  - Elements of AI (Università di Helsinki), USI (Svizzera italiana);
  - i corsi di università straniere su edX, Coursera o FutureLearn con versione italiana.
- **Fonti:** prima WebSearch con allowed_domains sul sito, poi WebFetch solo sugli URL usciti dalla ricerca. Mai URL scritti a mano. I dati vanno letti sulla pagina ufficiale del corso.

## Università popolari e della terza età
Oltre alle università (italiane, Svizzera italiana USI, Helsinki - Elements of AI, …) cerca le **università popolari** e le università della terza età di Torino (es. Università Popolare di Torino, UNITRE Torino) e di altre città italiane, solo per le proposte **gratuite e aperte a tutti** (lezioni online, conferenze o cicli gratuiti). Campo `tipo`: «Università» o «Università popolare». Annota a parte, senza inserirle, le università popolari di Torino con corsi a quota (nome, quota di iscrizione indicata, URL): il proprietario deciderà se aggiungerle.

## Aree e temi
- `ia`, «IA e digitale»: Intelligenza artificiale; Informatica e programmazione; Dati e statistica; Sicurezza e privacy; Competenze digitali.
- `pens`, «Pensione e tempo libero»: Finanza personale ed economia; Salute e benessere; Storia; Arte e musica; Letteratura e scrittura; Lingue; Scienze e natura; Filosofia e psicologia; Diritto e cittadinanza.

Obiettivo:
- almeno 30 corsi in tutto e almeno 12 per area;
- almeno 5 di università non italiane;
- livello soprattutto Principiante o Intermedio, con pochi corsi avanzati segnati come tali.

## Campi di ogni corso
`id` (`c-…`), `area`, `tema`, `titolo` (quello ufficiale), `ente`, `paese` («Italia», «Finlandia», «Svizzera»…), `piattaforma`, `lingua` (Italiano | Sottotitoli in italiano | Italiano e inglese), `livello` (Principiante | Intermedio | Avanzato), `formato` (Al proprio ritmo | Con date), `durata` (come indicata sulla pagina), `attestato` (Gratis | A pagamento (il corso è gratis) | No), `sintesi` (massimo 45 parole, scritta con parole tue, in tono neutro), `url` (la pagina ufficiale del corso), `verificato` (AAAA-MM-GG), `gratuito`: true, `aperto`: true, `tipo` (Università | Università popolare), `modalita` (Online | In presenza | Online e in presenza) e, per i corsi in presenza, `citta`.

Quando la lista è completa:
- metti `"pronto": true`;
- metti `updated` uguale alla data di oggi.

Niente dati personali: il repository è pubblico.

## Revisione
Un revisore indipendente riapre ogni URL e controlla gratuità, disponibilità, lingua o sottotitoli in italiano, durata e attestato. Se un dato non è verificabile, il revisore corregge il corso o lo toglie.

## Aggiornamento
Una volta al mese, insieme alle novità:
- si ricontrollano tutti gli URL;
- si tolgono i corsi chiusi o non più gratuiti;
- si aggiungono i corsi nuovi.
