"""Uniforma la marcatura delle domande delle prove reali 2025 di Chimica e Biologia (PREDISPOSTO, NON ANCORA APPLICATO).

Oggi Fisica usa R("A1",n,{...}) direttamente sulle domande (FIS_REAL in b8_prove_reali.js), mentre Chimica e Biologia
riconoscono le domande reali tramite l'elenco REAL_TAGS (inizio del testo → appello, numero). Funziona, ma se qualcuno
cambia l'inizio di un testo la marcatura si perde senza errori visibili.

Questo script:
  - senza opzioni (prova a secco): trova per ogni voce di REAL_TAGS la domanda nel file sorgente, segnala voci non
    trovate o ambigue e stampa le modifiche che farebbe. Non scrive nulla.
  - con --applica: aggiunge  r:"A1",rn:N  dentro l'oggetto della domanda nel suo file sorgente e svuota REAL_TAGS
    (lasciando il codice che lo applica, così resta compatibile). Prima salva una copia .bak di ogni file toccato.

Dopo --applica: python3 sorgenti/semestre/build.py, node sorgenti/semestre/strumenti/verifica_contenuti.js
(i conteggi «delle prove reali» devono restare Fisica 62, Chimica 58, Biologia 62) e verifica_app.py.
"""
import os, re, sys, json, subprocess, shutil

D = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
APPLICA = "--applica" in sys.argv
FILES = {"chi": ["b4_chimica.js", "b9_chimica_plus.js", "b13_chimica_plus2.js"],
         "bio": ["b5_biologia.js", "b10_biologia_plus_a.js", "b11_biologia_plus_b.js", "b14_biologia_plus2a.js", "b15_biologia_plus2b.js"]}

b8 = open(os.path.join(D, "b8_prove_reali.js"), encoding="utf-8").read()
m = re.search(r"const REAL_TAGS=(\{.*?\});\s*\n", b8, re.S)
if not m:
    sys.exit("REAL_TAGS non trovato in b8_prove_reali.js (forse è già stato uniformato)")
tags = json.loads(subprocess.run(["node", "-e", "console.log(JSON.stringify(" + m.group(1) + "))"], capture_output=True, text=True).stdout)

piano, problemi = [], []
for ex, lst in tags.items():
    for pre, r, n in lst:
        trovate = []
        for f in FILES[ex]:
            src = open(os.path.join(D, f), encoding="utf-8").read()
            for mm in re.finditer(r'\{t:"[a-z0-9]+",k:"[mc]",q:"' + re.escape(pre), src):
                trovate.append((f, mm.start()))
        if len(trovate) != 1:
            problemi.append(f"{ex} {r} n.{n} «{pre}»: {len(trovate)} corrispondenze")
            continue
        piano.append((ex, r, n, pre, *trovate[0]))

print(f"Voci REAL_TAGS: {sum(len(v) for v in tags.values())} · applicabili: {len(piano)} · problemi: {len(problemi)}")
for p in problemi:
    print("  ⚠️ ", p)
for ex, r, n, pre, f, pos in piano:
    print(f"  {ex} {r} n.{n:>2}  {f}  «{pre[:50]}»  → aggiunge r:\"{r}\",rn:{n}")

if not APPLICA:
    print("\nProva a secco: nessun file modificato. Per applicare: python3 uniforma_prove_reali.py --applica")
    sys.exit(0)
if problemi:
    sys.exit("Ci sono voci non univoche: correggerle prima di applicare.")
toccati = {}
for ex, r, n, pre, f, pos in sorted(piano, key=lambda x: (x[4], -x[5])):
    if f not in toccati:
        shutil.copyfile(os.path.join(D, f), os.path.join(D, f) + ".bak")
        toccati[f] = open(os.path.join(D, f), encoding="utf-8").read()
    s = toccati[f]
    toccati[f] = s[:pos + 1] + f'r:"{r}",rn:{n},' + s[pos + 1:]
for f, s in toccati.items():
    open(os.path.join(D, f), "w", encoding="utf-8").write(s)
shutil.copyfile(os.path.join(D, "b8_prove_reali.js"), os.path.join(D, "b8_prove_reali.js.bak"))
open(os.path.join(D, "b8_prove_reali.js"), "w", encoding="utf-8").write(b8.replace(m.group(0), "const REAL_TAGS={chi:[],bio:[]};   /* uniformato: r/rn ora sono nelle domande */"))
print("Applicato. File modificati:", ", ".join(list(toccati) + ["b8_prove_reali.js"]))
