"""Controlla news-pensione.json (novità su contratto e pensione GdF) prima di pubblicarlo.
Uso: python3 strumenti/verifica_novita.py <file.json> [<seconda copia>]
Esce con errore se: formato sbagliato, date non valide o nel futuro, URL mancanti o non https, doppioni,
più di 80 notizie, testi troppo lunghi, termini personali, o se le due copie non sono identiche."""
import json, re, sys, datetime, base64
TEMI = {'contratto', 'previdenza', 'inps', 'fondi'}
TAG = {'dpr', 'aumenti', 'arretrati', 'fesi', 'moltiplicatore', 'ausiliaria', 'coefficienti', 'tasso', 'tfs', 'scatti', 'faf', 'premio', 'fiscale', 'requisiti', 'quotaA'}
# niente dati personali in un file pubblico: solo impronte, le parole non sono nel codice
import hashlib as _hl, re as _re
def guarda(testo, regole):
    """Vero se il testo contiene un termine da non pubblicare. Il confronto è per impronte (hash):
    le parole stesse non compaiono nel codice pubblico."""
    w = _re.findall(r"[0-9a-zà-ÿ]+", str(testo).lower()); H = {tuple(r[:4]): r[4] for r in regole}; C = {tuple(r[:3]) for r in regole}
    for i in range(len(w)):
        for n, L, e in C:
            if i + n > len(w): continue
            s = ' '.join(w[i:i + n])
            if len(s) < L or (e and len(s) != L): continue
            k = (n, L, e, _hl.blake2b(s[:L].encode(), digest_size=8, key=b'mie-app-guardia').hexdigest())
            if k in H and not (H[k] and i + n < len(w) and w[i + n].startswith(H[k])): return True
    return False
GUARD = [[1, 9, 1, "80ae5209ad7a7456", "tere"], [1, 7, 1, "c0123f8c83a83527", ""], [1, 6, 0, "fe5ed81eead6c480", ""], [1, 7, 1, "6ecf1ca9e5c13710", ""], [1, 5, 1, "debdc10cec49b50b", ""], [4, 8, 1, "e682bab68f1748f1", ""], [1, 5, 1, "485bc6dc5359cd9e", ""], [1, 6, 0, "cf916918a4e53fb5", ""], [1, 7, 1, "50e6ad855d6f693e", ""], [1, 4, 1, "0965105e44659ce2", ""], [1, 9, 0, "1232ff47c6f9ef8f", ""], [3, 21, 0, "8ca88b76e83f722f", ""]]
def err(m): sys.exit('ERRORE: ' + m)
f = sys.argv[1]; raw = open(f, encoding='utf-8').read(); o = json.loads(raw)
if o.get('app') != 'pianificazione-novita': err('campo app')
today = datetime.date.today().isoformat()
ids = set(); V = o.get('voci')
if not isinstance(V, list) or len(V) > 80: err('voci: elenco mancante o più di 80')
for n in V:
    for k in ('id', 'd', 'titolo', 'sintesi', 'fonte', 'url', 'temi', 'tocca'):
        if k not in n: err('manca %s in %s' % (k, n.get('id')))
    if n['id'] in ids: err('doppione ' + n['id'])
    ids.add(n['id'])
    if not re.match(r'^\d{4}-\d{2}-\d{2}$', n['d']) or n['d'] > today: err('data ' + n['id'])
    if not n['url'].startswith('https://'): err('url ' + n['id'])
    if len(n['titolo']) > 120 or len(n['sintesi']) > 700 or len(n.get('effetto', '')) > 300: err('testo troppo lungo ' + n['id'])
    if not set(n['temi']) <= TEMI or not n['temi']: err('temi ' + n['id'])
    if not set(n['tocca']) <= TAG: err('tocca ' + n['id'] + ': ' + str(set(n['tocca']) - TAG))
for a in o.get('attesa', []):
    for k in ('id', 't', 'stato'):
        if k not in a: err('attesa: manca ' + k)
    if a['stato'] not in ('atteso', 'uscito'): err('attesa stato ' + a['id'])
    if a['stato'] == 'uscito' and a.get('valore') in (None, ''): err('attesa uscito senza valore ' + a['id'])
if guarda(raw, GUARD): err('termine personale nel file pubblico')
if len(sys.argv) > 2 and open(sys.argv[2], encoding='utf-8').read() != raw: err('le due copie sono diverse')
print('✅ novità ok:', len(V), 'notizie,', len(o.get('attesa', [])), 'parametri in attesa')
