"""Controllo di sorgenti/semestre/ufficiale.json (materiali ufficiali pubblicati: esercitazioni, simulazioni, unità didattiche).
Uso: python3 sorgenti/semestre/strumenti/verifica_ufficiale.py   → esce con 1 se trova problemi.
È la seconda metà della «doppia verifica»: l'agente legge due volte la fonte e cerca una seconda fonte;
questo script controlla che ogni voce registrata abbia davvero i dati della verifica e sia coerente con l'app."""
import json, re, sys, os, datetime
D = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
P = []
try:
    d = json.load(open(os.path.join(D, "ufficiale.json"), encoding="utf-8"))
except Exception as e:
    print("❌ ufficiale.json non leggibile:", e); sys.exit(1)
UNITA = {"fis": {f"u{i}" for i in range(1, 8)}, "chi": {f"c{i}" for i in range(1, 8)}, "bio": {f"b{i}" for i in range(1, 8)}}
TIPI = {"esercitazioni", "simulazioni", "piattaforma", "mooc", "test", "lezioni", "esami", "avviso"}
oggi = datetime.date.today().isoformat()
if not re.match(r"^\d{4}-\d\d-\d\dT\d\d:\d\d", d.get("updated", "")): P.append("updated mancante o non valido")
voci = d.get("voci", [])
viste = set()
for i, v in enumerate(voci):
    tag = f"voce {i+1} ({v.get('date')} · {v.get('titolo','')[:40]})"
    if not re.match(r"^\d{4}-\d\d-\d\d$", v.get("date", "")): P.append(tag + ": data non valida")
    elif v["date"] > oggi: P.append(tag + ": data nel futuro")
    if v.get("tipo") not in TIPI: P.append(tag + f": tipo «{v.get('tipo')}» non previsto")
    for k in ("titolo", "dettaglio", "fonte", "url"):
        if not v.get(k): P.append(tag + f": manca {k}")
    if not str(v.get("url", "")).startswith("https://"): P.append(tag + ": url non https")
    m = v.get("materie", {})
    for ex, us in m.items():
        if ex not in UNITA: P.append(tag + f": materia «{ex}» sconosciuta")
        else:
            bad = [u for u in us if u not in UNITA[ex]]
            if bad: P.append(tag + f": unità non valide {bad}")
    ver = v.get("verifica", {})
    if ver.get("letture", 0) < 2: P.append(tag + ": servono 2 letture della fonte (verifica.letture)")
    if not ver.get("controllato"): P.append(tag + ": manca la data del controllo")
    if not (ver.get("url2") or ver.get("seconda_fonte")): P.append(tag + ": manca la seconda fonte (o «nessuna seconda fonte disponibile»)")
    key = (v.get("date"), v.get("tipo"), v.get("titolo"))
    if key in viste: P.append(tag + ": voce duplicata")
    viste.add(key)
if [v.get("date") for v in voci] != sorted([v.get("date") for v in voci], reverse=True): P.append("voci non ordinate dalla più recente")
if voci and d.get("updated", "")[:10] < max(v.get("date", "") for v in voci): P.append("updated precedente all'ultima voce")
for x in d.get("in_verifica", []):
    if not x.get("motivo"): P.append("voce in_verifica senza motivo")
print(f"voci registrate: {len(voci)} · in verifica: {len(d.get('in_verifica', []))} · aggiornato: {d.get('updated')}")
if P: print("❌ " + str(len(P)) + " problemi:\n" + "\n".join(P)); sys.exit(1)
print("✅ ufficiale.json in ordine")
