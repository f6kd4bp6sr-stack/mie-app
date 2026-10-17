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

## Pubblicazione
1. Scrivi lo stesso file in `sorgenti/pianificazione/statici/news-pensione.json` e in `licenze/news-pensione.json`.
2. `python3 sorgenti/pianificazione/strumenti/verifica_novita.py licenze/news-pensione.json sorgenti/pianificazione/statici/news-pensione.json` deve dire ✅.
3. Commit «Pianificazione: novità contratto e pensione AAAA-MM-GG HH:MM» (solo i due file), push su main (se rifiutato: git pull --rebase e riprova). Non toccare altri file.
