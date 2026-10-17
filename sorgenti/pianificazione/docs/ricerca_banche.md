# Formati di esportazione movimenti: Fineco, BNL, N26, BBVA Italia

Ricerca del 4/10/2026. Legenda: **[verificato]** = visto in un file d'esempio reale o in una fonte ufficiale; **[da fonte terza]** = riportato da forum o guide; **[non verificato]** = nessuna fonte trovata, da controllare su un file vero.

---

## 1. Fineco (FinecoBank)

**Dove si scarica** [da fonte terza, guida Mida4]: sito, menu "Movimenti conto e carte", si imposta il periodo col filtro e in fondo alla pagina si clicca **"Esporta in excel"**. Dall'app non risulta un export.

### Conto corrente: file Excel (.xlsx; le versioni vecchie erano .xls) [verificato]
Fonte: file d'esempio `tests/movements.xlsx` del progetto open source ofxstatement-fineco (2024).

Righe iniziali prima dell'intestazione (righe 1-6):
```
Conto Corrente: 0000000
Intestazione Conto Corrente: NOME COGNOME
Periodo Dal: 01/01/2024 Al: 31/12/2024
(vuota)
Risultati Ricerca
(vuota)
```
Intestazione alla riga 7:
`Data | Entrate | Uscite | Descrizione | Descrizione_Completa | Stato`
- In alcuni file c'è una 7ª colonna, **`Moneymap`** (la categoria). Il plugin la gestisce come facoltativa.
- Il profilo Firefly III (`it/fineco`, giugno 2026) prevede 8 colonne: data, **data valuta**, entrate, uscite, descrizione, descrizione completa, una colonna ignorata (Stato) e la categoria. Quindi i file recenti hanno probabilmente anche una colonna **data valuta** dopo `Data`. Il nome esatto di quella colonna non è documentato.
- **Data**: testo `gg/mm/aaaa`, per esempio `31/12/2024`. In alcuni file è invece una data Excel in formato numerico (issue #3/#5 del plugin).
- **Importi**: due colonne separate, Entrate e Uscite. In Excel sono numeri, non testo. **Le Uscite sono negative** (`-9.99`).
- **Stato**: `Autorizzato` oppure `Contabilizzato`.
- Esempi di `Descrizione`: `VISA DEBIT`, `Bonifico SEPA Italia`, `Prelievo Bancomat` (dal plugin).
- Il profilo Firefly usa il separatore `;` perché parte da un CSV ricavato dall'xlsx. La banca non fornisce un CSV.
- Righe di chiusura: il plugin salta le righe che iniziano con `Totale`.

### Carte (credito/debito): file Excel (.xls) [verificato]
Fonte: `tests/my-cards.xls` di ofxstatement-fineco, foglio "movimenti carta". Si scarica da Conto e Carte > Carte > My Cards, scegliendo carta e mese.
- La colonna A è vuota. Ci sono 2 righe vuote, poi l'intestazione alla riga 3:
`Intestatario carta | Numero carta | Data operazione | Data registrazione | Descrizione | Stato operazione | Tipo operazione | Circuito | Tipo rimborso | Importo`
- Su alcune carte mancano le colonne `Tipo spesa` / `Tipo rimborso` (issue #2 del plugin).
- Riga d'esempio: `NOME COGNOME | 0000 **** **** 0000 | 31/12/2024 | 31/12/2024 | … | contabilizzato | pagamento | VISA | a saldo | -50`
- **Importo**: una colonna sola, con segno (spese negative). `Data registrazione` è vuota se l'operazione è solo autorizzata.
- In fondo c'è una riga `Totale movimenti`.

### Addebito mensile della carta di credito sul conto
- [da fonte terza, forum FinanzaOnline] Per la VISA Credit l'addebito avviene il **10 del mese successivo**.
- **Testo della descrizione: [non verificato]**. Non ho trovato un esempio reale. Conviene riconoscerlo dall'importo che coincide con il totale del mese della carta, oppure cercando parole come "carta"/"addebito" in un file vero.

---

## 2. BNL (BNL BNP Paribas)

- **Formato e dove si scarica** [da fonte terza + sito BNL]: i documenti ufficiali (estratto conto e documenti di sintesi delle carte di credito, debito e prepagate) sono disponibili **solo in PDF**. Sul sito: Area Clienti > GESTISCO > DOCUMENTI ONLINE. Nell'app: sezione DOC. Restano consultabili per 14 mesi.
- **Export Excel/CSV dei movimenti per i privati: [non verificato]**. Né le pagine BNL né le guide trovate parlano di un export della lista movimenti in Excel o CSV. Il portale imprese "myhub" ha una funzione di "estrazione report", ma riguarda le aziende.
- **Colonne**: nessun file reale trovato. Una guida di terzi (convertitoreestratticonto.com) dice che dal PDF si ricavano "data contabile, data valuta, descrizione, importi". I nomi esatti delle colonne e la scelta tra importo con segno e colonne Dare/Avere sono **[non verificati]**.
- **Addebito della carta di credito: [non verificato]**.
- **Consiglio**: chiedere all'utente un file d'esempio (PDF o un eventuale xls) prima di scrivere il parser.

---

## 3. N26 (app/web, Italia)

**Dove si scarica** [verificato, support.n26.com/it-it]:
- App: Finanze > conto > icona ingranaggio > "Estratti conto". Gli estratti mensili sono **solo PDF**.
- Web (app.n26.com): Home > conto o spazio > "Download". Si scelgono data di inizio e fine e il formato **PDF o CSV**. Il CSV si ottiene dal web.

**CSV** [verificato, beancount-n26 aggiornato a settembre 2026]:
- Separatore `,`, campi tra virgolette `"`, UTF-8, **nessuna riga prima dell'intestazione**.
- **Formato attuale** (inglese):
`"Booking Date","Value Date","Partner Name","Partner Iban",Type,"Payment Reference","Account Name","Amount (EUR)","Original Amount","Original Currency","Exchange Rate"`
- **Formato precedente**:
`"Date","Payee","Account number","Transaction type","Payment reference","Category","Amount (EUR)","Amount (Foreign Currency)","Type Foreign Currency","Exchange Rate"` (la colonna `Category` è facoltativa)
- **Date**: ISO `aaaa-mm-gg`, per esempio `2019-10-10`.
- **Importo**: colonna unica `Amount (EUR)` con segno e punto decimale (`-12.34`), già convertito in EUR.
- **Intestazioni in lingua**: il CSV usa la lingua dell'account. Esistono versioni tedesca (`Datum, Empfänger, Kontonummer, Transaktionstyp, Verwendungszweck, Kategorie, Betrag (EUR), …`) e francese. **Una versione italiana delle intestazioni non è documentata [non verificato]**. Conviene riconoscere il file dalla posizione delle colonne o accettare più alias.
- **Carta**: in Italia le carte N26 sono di debito e ogni pagamento compare come riga separata sul conto. Non c'è un addebito mensile cumulativo da riconoscere. Che N26 non offra in Italia una carta di credito con saldo mensile è **[non verificato]**.

---

## 4. BBVA Italia (conto online)

- **Dove si scarica e formato** [verificato, blog ufficiale bbva.it]:
  - Sito bbva.it: **Conto > Movimenti recenti**. In alto a destra si sceglie **PDF o Excel**, con filtri per data e/o importo.
  - App: Notifiche > Conti, con gli estratti periodici in PDF.
  - Non si parla di CSV.
- [da fonte terza, FinanzaOnline] Alcuni utenti segnalano periodi in cui il pulsante "xls" non funzionava. Il formato del file è quindi **xls** (non so se vecchio .xls o .xlsx).
- **Colonne, righe iniziali, formato di date e importi: [non verificati]**. Non ho trovato file d'esempio né profili open source (Firefly III non ha un profilo BBVA, né italiano né spagnolo). Il file spagnolo di BBVA non va preso come modello senza un esempio.
- **Carta di credito** [verificato, bbva.it]: l'estratto conto della carta si chiude l'ultimo giorno del mese e l'importo viene **addebitato il giorno 5 del mese successivo**. Anche le rate si addebitano il 5. **Testo della descrizione sul conto: [non verificato]**.

---

## Riepilogo per il parser

| Banca | File | Riga intestazione | Date | Importi |
|---|---|---|---|---|
| Fineco conto | xlsx (dal web) | 7ª riga, `Data;Entrate;Uscite;Descrizione;Descrizione_Completa;Stato[;Moneymap]` (+ forse data valuta) | gg/mm/aaaa testo, oppure data Excel | Entrate/Uscite separate, uscite negative |
| Fineco carte | xls | 3ª riga, colonna A vuota | gg/mm/aaaa | `Importo` con segno |
| BNL | PDF (export Excel non confermato) | ? | ? | ? |
| N26 | CSV (dal web) | 1ª riga | aaaa-mm-gg | `Amount (EUR)` con segno, punto decimale |
| BBVA IT | xls/PDF (dal web) | ? | ? | ? |

Per BNL, BBVA e per il testo degli addebiti delle carte serve un file reale fornito dall'utente.

## Fonti
- ofxstatement-fineco (file d'esempio e template): https://github.com/frankIT/ofxstatement-fineco
- Profilo Firefly III Fineco: https://github.com/firefly-iii/import-configurations/blob/main/it/fineco/default.json
- Guida Mida4, download estratti conto (Fineco "Esporta in excel"): https://specifiche.mida4.it/GuidaDownloadEstrattiContoBancari.pdf
- FinanzaOnline, carte di credito Fineco (addebito il 10): https://forum.finanzaonline.com/threads/carte-di-credito-mono-e-multifunzione-del-conto-fineco-cap-iv.2036829/
- Fineco FAQ Credit: https://help.finecobank.com/it/FAQ/FAQ-Credit.html
- N26 supporto, scaricare l'estratto conto: https://support.n26.com/it-it/pagamenti-prelievi-e-bonifici/saldo-e-limiti-di-spesa/come-scaricare-estratto-conto
- beancount-n26 (intestazioni CSV en/de/fr e test): https://github.com/siddhantgoel/beancount-n26
- BNL Documenti online: https://bnl.it/it/Individui-e-Famiglie/Internet-e-Mobile/Documenti-online
- Guida terzi BNL: https://convertitoreestratticonto.com/blog/come-scaricare-estratto-conto-bnl
- BBVA, blog sull'estratto conto: https://www.bbva.it/blog/banca-in-pillole/estratto-conto-bancario.html
- BBVA, carta di credito: https://www.bbva.it/persone/prodotti/carte/carta-di-credito.html
- FinanzaOnline, thread BBVA (problemi xls): https://forum.finanzaonline.com/threads/conto-corrente-online-di-bbva-cap-xvi-info-post-1.2068985/page-80
