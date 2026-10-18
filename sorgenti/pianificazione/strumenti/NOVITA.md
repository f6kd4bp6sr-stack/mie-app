# Novità su contratto e pensione — istruzioni per l'agente (13 · 17 · 23)

Pianificazione → 🎖️ Pensione → **Novità** legge il file pubblico `licenze/news-pensione.json`.
Un'attività programmata lo aggiorna **tre volte al giorno: alle 13, alle 17 e alle 23** (ora italiana; parte qualche minuto prima). Il file è **pubblico**: solo notizie generali, mai dati personali.

## Che cosa cercare (dall'ultimo controllo e negli ultimi 7 giorni, personale della Guardia di Finanza e del comparto sicurezza-difesa)
- **contratto**: accordi 2025-2027 (e successivi), DPR di recepimento, Gazzetta Ufficiale, aumenti, arretrati, F.E.S.I., circolari NoiPA o del Comando Generale.
- **previdenza**: previdenza dedicata (tavolo del Governo con la Funzione Pubblica), moltiplicatore art. 3 c. 7 D.Lgs. 165/1997, ausiliaria, coefficienti per chi esce per limiti di età, TFS/TFR.
- **inps**: circolari e messaggi INPS (TFS, termini di pagamento, coefficienti di trasformazione 2027-2028, tasso di capitalizzazione 2026, requisiti), legge di bilancio 2027.
- **fondi**: Fondo di previdenza per ispettori, sovrintendenti, appuntati e finanzieri; F.A.F. (quota annuale, regolamento); C.I.A.N.

## Fonti da controllare ogni mattina
Prima le fonti ufficiali (sono quelle che contano), poi i sindacati (spesso arrivano prima e spiegano le date), poi le testate di settore. Una notizia presa solo da un sindacato o da una testata va scritta come «secondo …».

**Ufficiali**
- Gazzetta Ufficiale — gazzettaufficiale.it (DPR di recepimento, decreti coefficienti, legge di bilancio)
- Governo — governo.it (comunicati del Consiglio dei ministri)
- Funzione Pubblica — funzionepubblica.gov.it (accordi, tavolo sulla previdenza dedicata, rappresentatività)
- MEF — mef.gov.it, NoiPA noipa.mef.gov.it (cedolini, arretrati, comunicazioni ai militari della GdF; elenco associazioni sindacali GdF)
- INPS — inps.it (circolari e messaggi: TFS, termini di pagamento, coefficienti, requisiti, Gestione Dipendenti Pubblici)
- Ministero del Lavoro — lavoro.gov.it (coefficienti di trasformazione)
- ISTAT — istat.it (tasso di capitalizzazione, PIL nominale)
- Guardia di Finanza — gdf.gov.it (comunicati del Comando Generale, Fondo di previdenza, F.A.F.)
- Difesa — difesa.it, Previmil (circolari pensionistiche dei militari)
- Interno / Polizia di Stato — interno.gov.it, poliziadistato.it
- Corte dei conti — corteconti.it (registrazione dei DPR, sentenze su moltiplicatore e pensioni militari)
- Parlamento — camera.it, senato.it (testo e emendamenti della legge di bilancio)
- Agenzia delle Entrate — agenziaentrate.gov.it (interpelli su TFS, F.A.F., indennità)

**Sindacati della Guardia di Finanza**: USIF (usif.it), SILF (silfnazionale.it), SINAFI (sinafi.org), SIM GdF.

**Sindacati di polizia**
- Polizia di Stato: SIULP (siulp.it), SAP, FSP Polizia, COISP (coisp.it), SIAP (siap-polizia.org), UIL Polizia (uilpolizia.com), SILP CGIL (silpcgil.it), MP (mpnazionale.it), CONSAP, UGL Polizia, ANFP (anfp.it, funzionari)
- Polizia Penitenziaria: SAPPE (sappe.it), Al.Si.P.Pe. (alsippe.it), OSAPP, UILPA PP, FNS CISL (fnscisl.it)
- Carabinieri e Forze armate: USMIA, NSC, SIM Carabinieri, USAMI (usami-aeronautica.it), SIULM

**Testate di settore**: Infodifesa, Corriere dei Militari, ForzeArmate.org, poliziapenitenziaria.it, PensioniOggi.


## Regole
1. **Doppia verifica**: due letture della pagina (WebFetch con domande diverse) che coincidono, più una seconda fonte quando esiste (`fonti2`). Se non coincidono, la notizia non entra.
2. Ogni notizia: `id` (`nAAAAMMGG-parola`), `d` (data di pubblicazione, mai futura), `titolo` (≤ 120 caratteri), `sintesi` (≤ 700, fatti con date e numeri, niente opinioni), `fonte`, `url` esatto (https, mai inventato), `fonti2`, `temi` (contratto, previdenza, inps, fondi), `tocca` (argomenti: dpr, aumenti, arretrati, fesi, moltiplicatore, ausiliaria, coefficienti, tasso, tfs, scatti, faf, premio, fiscale, requisiti, quotaA), `effetto` (≤ 300: che cosa cambia in generale per chi va in pensione; «per ora non cambia nulla» quando è così).
3. Massimo 80 notizie, dalla più recente; niente doppioni (stessa notizia da più fonti = una voce con `fonti2`).
4. `attesa`: i parametri che servono al ricalcolo. Quando escono ufficialmente: `stato` "uscito", `valore` (coefficiente a 60 anni in percentuale, per esempio 4.512; tasso 2026 come fattore, per esempio 1.0634), `fonte`, `url`. Le stime restano in `stima`, mai in `valore`.
5. Niente consigli, niente dati personali, niente nomi di persone private. Solo informazioni con data e fonte.
6. Aggiorna `updated` (ora italiana, ISO) anche quando non ci sono notizie nuove.
7. **Fonti** (`fonti`): a ogni giro controlla almeno tutte le fonti ufficiali e i sindacati GdF, poi a rotazione gli altri; per ognuna aggiorna `ultimo` (ora del controllo) ed `esito` ("ok", oppure "non raggiungibile" / "spostata" con il nuovo indirizzo). Puoi aggiungere una fonte nuova autorevole (ufficiale, sindacato, testata di settore) con `n`, `url` https, `tipo` (ufficiale, sindacato GdF, sindacato polizia, sindacato militari, testata). Non togliere le fonti ufficiali.
8. **Dati** (`attesa` e notizie già presenti): a ogni giro ricontrolla i parametri in attesa alla fonte ufficiale (Gazzetta per il DPR, ISTAT per il tasso 2026, decreto per i coefficienti 2027-2028, F.A.F. per la quota) e correggi le notizie già pubblicate se una fonte ha cambiato date o numeri (scrivilo nella sintesi: «aggiornato il …»).
9. **Registro** (`controlli`): aggiungi in fondo `{"at": ora, "notizie": quante nuove, "note": "…"}`; tieni gli ultimi 60.
10. **Accesso ai siti**: Marco ha autorizzato una volta per tutte la lettura di tutti i siti pubblici di ricerca (fonti ufficiali, sindacati, testate, siti di banche e tassi). Non fermarti a chiedere il permesso e non aspettare risposte: il giro va avanti da solo. Apri con WebFetch gli indirizzi dell'elenco qui sopra, di licenze/news-pensione.json o dei risultati di WebSearch; un indirizzo nuovo lo trovi prima con WebSearch. Se uno strumento rifiuta un sito (per motivi legali o di rete), non aggirarlo (niente curl, copie in cache o siti specchio): passa alla fonte successiva e segna in `fonti` l'esito «non raggiungibile».

## 📊 Tassi di mercato (`mercati`, per la sezione 🌱 Investimenti)
A ogni giro aggiorna i 14 valori di `mercati` (stessi `id`, numeri in percentuale, `d` = data del dato, `fonte`, `url` https esatto, `nota` facoltativa):
- `infl` inflazione NIC su un anno: ultimo comunicato ISTAT (provvisorio a fine mese, definitivo a metà mese successivo) — istat.it;
- `bce` tasso BCE sui depositi: ultima decisione — ecb.europa.eu;
- `btp2`, `btp5`, `btp10` rendimenti lordi dei BTP a 2, 5 e 10 anni: ultima chiusura (Trading Economics, Borsa Italiana, rendimentibtp.it; due fonti che coincidono entro 0,05 punti);
- `btpv` emissione retail del MEF in corso o più recente (BTP Valore, BTP Italia, BTP Più…): rendimento lordo a scadenza e, nella `nota`, nome, date di collocamento e cedole minime — dt.mef.gov.it o una testata che lo riporta;
- `cdl`, `cd12`, `cd24`, `cd36` miglior tasso lordo dei conti deposito libero e vincolati 12/24/36 mesi di banche italiane aderenti al Fondo Interbancario (siti di confronto come conti-deposito.net, facile.it; nella `nota` «promozionale» quando lo è);
- `bbva0`, `bbva10`, `bbva50`, `bbvac` tassi lordi del conto corrente BBVA per i clienti già aperti (base = 25% del tasso BCE, saldo medio da 10.000 € e da 50.000 €, con una condizione mensile): pagina ufficiale bbva.it «conto corrente con remunerazione», cambiano a inizio trimestre; nella `nota` di `bbvac` l’eventuale promozione per i nuovi clienti.
Doppia verifica come per le notizie; se un valore non si può verificare, lascia quello di prima (con la sua data). Niente consigli: sono solo numeri con data e fonte.

## 🔎 Prodotti per la ricerca (`prodotti`, sezione 🌱 Investimenti → Ricerca)
Elenco breve (massimo 40) di prodotti **semplici**: conti deposito (`dep`), conti remunerati (`conto`), titoli di Stato e emissioni retail del MEF (`btp`), ETF monetari (`mon`), obbligazionari (`obb`), bilanciati (`bil`), azionari globali (`az`). Campi: `id`, `tipo`, `n` (nome esatto), `em` (emittente o banca), `isin` (solo se verificato), `tasso` (lordo annuo %, solo per depositi, conti e titoli; per gli ETF lascia `null`), `ter` (costi annui %, ETF), `anni` (durata del vincolo o scadenza; 0 = libero), `gar` (garanzia: Fondo Interbancario, rimborso a 100 alla scadenza, «nessuna: il prezzo oscilla»), `d`, `fonte`, `url` https esatto, `nota`, `chiuso` (true per toglierlo, per esempio un’offerta finita).
A ogni giro: aggiorna i tassi dei depositi in elenco e segnali scaduti con `chiuso`; quando il MEF annuncia o chiude un’emissione retail (BTP Valore, BTP Italia, BTP Più…) aggiungila o aggiorna tassi definitivi e date; una volta al mese ricontrolla TER e nome degli ETF. Mai prodotti complessi (certificati, leva, derivati, criptovalute, polizze), mai consigli: solo dati con data e fonte. La verifica controlla schema, ISIN e date.

## 🔄 Scheda pensione cifrata (dopo le novità, a ogni giro)
`licenze/scheda-pensione.cifrata.json` è la scheda personale di Marco **cifrata** (AES-256-GCM). L'iPad la scarica e la unisce da sola: le sue spunte, note, importi reali, esito e documenti restano comunque. La chiave è **solo** nel testo dell'attività programmata: passala con `SCHEDA_CHIAVE`, non scriverla mai in un file, in un commit, in una notizia o nell'output.

1. Apri in una cartella temporanea fuori dal repository: `T=$(mktemp -d); python3 sorgenti/pianificazione/strumenti/scheda_cifrata.py apri licenze/scheda-pensione.cifrata.json $T/s.json`.
2. Cambia la scheda **solo** per un fatto nuovo e verificato (regola 1) da una fonte ufficiale, o da un sindacato quando l'ufficiale non c'è ancora (scrivilo nella nota: «secondo …»). Che cosa si può cambiare:
   - `pens.calc`: `coeffB` (o un coefficiente ufficiale 2027-2028 a 60 anni, in percentuale) quando esce il decreto;
   - `pens.ipotesi[].det`, `entro`: quando una data attesa cambia (per esempio il DPR in Gazzetta);
   - `pens.cedolini[]`: mese e nota degli arretrati quando NoiPA o il Comando Generale li annunciano; importi solo se pubblicati in tabella ufficiale per il grado;
   - `pens.incassi[]` e `pens.adem[]`: data (`d`) e nota quando una norma o una circolare INPS cambia un termine (TFS, premio, pensione); un adempimento nuovo solo se lo impone una norma o circolare nuova, con `id` nuovo (`nAAAAMMGG-…`), `d`, `t`, `det`, `tag`;
   - `pens.contatti[]`: un indirizzo o telefono quando l'ufficio lo cambia sul sito ufficiale;
   - `pens.tappe[]`: date delle tappe collegate a quanto sopra.
   Non cambiare mai `dati`, `esito`, i `testi`, gli id esistenti, le spunte; non togliere voci; non aggiungere dati personali nuovi; niente consigli.
3. Se non c'è niente da cambiare, **non** chiudere la scheda (la revisione resta quella).
4. Se hai cambiato qualcosa: `python3 sorgenti/pianificazione/strumenti/scheda_cifrata.py chiudi $T/s.json licenze/scheda-pensione.cifrata.json sorgenti/pianificazione/statici/scheda-pensione.cifrata.json --nota "che cosa è cambiato, in una riga" --fonte URL`, poi `... verifica licenze/scheda-pensione.cifrata.json sorgenti/pianificazione/statici/scheda-pensione.cifrata.json` deve dire ✅. Annota nel registro (`controlli[].note`) «scheda rev. N: …» senza numeri personali.
5. `rm -rf $T` sempre, anche in caso di errore. La scheda in chiaro non va mai nel repository.

## Pubblicazione
1. Scrivi lo stesso file in `sorgenti/pianificazione/statici/news-pensione.json` e in `licenze/news-pensione.json`.
2. `python3 sorgenti/pianificazione/strumenti/verifica_novita.py licenze/news-pensione.json sorgenti/pianificazione/statici/news-pensione.json` deve dire ✅.
3. Commit «Pianificazione: novità contratto e pensione AAAA-MM-GG HH:MM» (solo i due file delle novità e, se la scheda è cambiata, i due file `scheda-pensione.cifrata.json`), push su main (se rifiutato: git pull --rebase e riprova). Non toccare altri file.
