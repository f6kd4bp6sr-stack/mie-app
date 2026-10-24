# Le mie app

Tre app separate pubblicate con GitHub Pages dallo stesso repository. Ognuna ha la sua cartella pubblicata, le sue sorgenti, i suoi dati sul dispositivo e la sua copia senza internet; nessuna scrive nei file delle altre.

| App | Indirizzo | Cartella pubblicata | Sorgenti e memoria | Dati sul dispositivo | Cache |
|---|---|---|---|---|---|
| 🐉 **Il mio mondo** | [/mie-app/](https://f6kd4bp6sr-stack.github.io/mie-app/) | cartella principale (`index.html`, `sw.js`…) | [`sorgenti/il-mio-mondo/`](sorgenti/il-mio-mondo/README.md) | `mm2-…`, `msync-cfg`, `mondo-…`; IndexedDB `il-mio-mondo`, `mondo-sfondo`, `mondo-disegni` | `mondo-…` |
| 🏠 **Pianificazione** | [/mie-app/licenze/](https://f6kd4bp6sr-stack.github.io/mie-app/licenze/) | `licenze/` | [`sorgenti/pianificazione/`](sorgenti/pianificazione/README.md) | `pn-…`, `licenze-…`, `tc_…`, `prog-…`; IndexedDB `licenze-…` | `licenze-…` |
| 🩺 **Semestre filtro** | [/mie-app/semestre/](https://f6kd4bp6sr-stack.github.io/mie-app/semestre/) | `semestre/` (più i rimandi `licenze/fisica.html`, `licenze/semestre.html`) | [`sorgenti/semestre/`](sorgenti/semestre/README.md) | `semestre-…`, `sf-…`; IndexedDB `semestre-filtro` | `semestre-…` |

Gli indirizzi non cambiano: le icone sulla schermata Home e i dati salvati restano.

Unico punto di contatto voluto: Pianificazione pubblica `licenze/mondo-sync.js`, che «Il mio mondo» usa per mandare ai genitori i progressi cifrati.

Il codice non contiene dati personali: nomi, date, diario, progressi e copie restano sui dispositivi (o cifrati, con la parola scelta dal proprietario).
