# Il mio mondo — progetto «Capire prima di rispondere» (spiegazioni e mappe concettuali)

Stato: **pilota realizzato il 20 ottobre 2026** (6 argomenti). Motore: `js/sezioni/spiega.js`. Prima di allargare alle altre materie, va provato con la bimba.

## Scelte del genitore
- **Spiegazione**: la prima volta che si apre un argomento si parte dal racconto e dalla mappa; dopo è a scelta, con il tasto «Rivedi la spiegazione».
- **Mappe**: tutte e quattro le forme.
  1. La mappa si costruisce un nodo alla volta mentre il drago racconta.
  2. Completa la mappa: un nodo si spegne e lei ritrova la parola giusta.
  3. La sua mappa: una tela per costruirla da sola, salvata nel quaderno delle mappe.
  4. La mappa della materia: tutti gli argomenti sono isole che si colorano quando li conquista (al posto delle percentuali).
- **Voce**: voce e testo insieme; si può riascoltare.
- **Pilota**: 6 argomenti in materie diverse.
  - Storia · L'antico Egitto
  - Energia e materia · Il ciclo dell'acqua
  - Il corpo umano · Cuore e sangue
  - Geografia · Fiumi e laghi
  - Italiano · Soggetto, predicato e attributo
  - Matematica · le frazioni

## L'argomento in 4 tempi
1. **🐉 Il drago racconta**
   - 4-6 schermate, 2-3 frasi ciascuna, lette a voce.
   - In ogni schermata: un disegno semplice (SVG o emoji) e una parola chiave in grassetto.
   - Una cosa sola per schermata.
2. **🗺️ La mappa**
   - Al centro c'è l'argomento, intorno 4-6 nodi.
   - Sulle frecce ci sono le parole che collegano i nodi.
   - I nodi appaiono insieme alle schermate del racconto.
   - Alla fine, 1-2 nodi da ritrovare: 3 parole tra cui scegliere. Le parole sbagliate non devono mai essere «quasi vere».
3. **❓ Le domande**: quelle che ci sono già. Ogni risposta giusta accende il suo nodo.
4. **🗣️ Lo racconto io**
   - Guardando la mappa, lo spiega a voce e si registra (il microfono c'è già).
   - Facoltativo, senza voto.

## Forme visive per tipo di contenuto
- **Raggiera**: concetti e caratteristiche.
- **Linea del tempo**: storia.
- **Ciclo**: per esempio acqua, piante.
- **Disegno con etichette**: per esempio cuore, fiore, vulcano.
- **Tabella di confronto**: per esempio vertebrati, tipi di testo.
- **Passi in fila**: procedure di matematica.

## Collegamenti tra materie
Sotto la mappa compaiono i «🔗 Collegamenti»: 2-3 argomenti di altre materie, cioè id di argomenti esistenti in `argomenti.json`. Per esempio: Antico Egitto → Geografia «Fiumi e laghi», Arte «L'arte antica», Tecnologia «I materiali».

## Dati (proposta)
Un file per materia: `data/spiegazioni/<materia>.json`. Ogni argomento è una chiave e contiene:

```json
{
 "racconto": [{"t": "frase…", "img": "🌊", "nodo": "nilo"}],
 "mappa": {"tipo": "raggiera", "centro": "Antico Egitto",
   "nodi": [{"id": "nilo", "n": "il Nilo", "ic": "🌊", "sotto": "le piene lasciano fango fertile"}],
   "frecce": [{"da": "centro", "a": "nilo", "parola": "viveva grazie al"}]},
 "ritrova": [{"nodo": "mummificazione", "scelte": ["mummificazione", "lana", "colla"]}],
 "collegamenti": ["geo:acque", "arte:antica", "tecno:materiali"],
 "domande": {"<id domanda>": "nilo"}
}
```

## Regole di qualità
- **Revisione**: ogni contenuto passa da autore → revisore indipendente → controllo automatico.
- **Controllo automatico**, deve verificare che:
  - ogni nodo sia nominato nel racconto;
  - ogni nodo sia coperto da almeno una domanda;
  - le frecce puntino a nodi esistenti;
  - i collegamenti siano argomenti esistenti;
  - le frasi siano brevi (≤ 30 parole per schermata; il campo «v» dà il testo da leggere a voce, per esempio «tre quarti» invece di 3/4);
  - non ci siano termini vietati.
- **Contenuti**: niente dati personali; nessuna percentuale sullo schermo della bimba.
- **Le sue mappe** sono solo testo (idee, frecce, parole): stanno nell'iPad (`vale2-mappe`) e vanno anche nella copia automatica.
- **Formato reale** (realizzato): ogni nodo ha `id`, `n`, `ic`, `sotto` e `da` (la parola sulla freccia dal centro; nel tipo «ciclo» dal nodo precedente). Esempio completo in `data/spiegazioni/storia.json`. La parola `da` non deve finire con un articolo, perché il nome del nodo ce l'ha già.
