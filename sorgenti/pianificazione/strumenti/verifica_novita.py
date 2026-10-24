"""Controlla news-pensione.json (novità su contratto e pensione GdF) prima di pubblicarlo.
Uso: python3 strumenti/verifica_novita.py <file.json> [<seconda copia>]
Esce con errore se: formato sbagliato, date non valide o nel futuro, URL mancanti o non https, doppioni,
più di 80 notizie, testi troppo lunghi, termini personali, o se le due copie non sono identiche."""
import json, re, sys, datetime, base64
TEMI = {'contratto', 'previdenza', 'inps', 'fondi'}
TAG = {'dpr', 'aumenti', 'arretrati', 'fesi', 'moltiplicatore', 'ausiliaria', 'coefficienti', 'tasso', 'tfs', 'scatti', 'faf', 'premio', 'fiscale', 'requisiti', 'quotaA'}
# niente dati personali in un file pubblico: solo impronte, le parole non sono nel codice
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.join(_os.path.dirname(_os.path.dirname(_os.path.abspath(__file__))), 'tools'))
from guardia import guarda  # impronte con chiave segreta: tools/guardia.py
REGOLE = [[1, 13, 0, "d44071bd805c7b06", ""], [3, 21, 0, "1d2c1ad5207a93ee", ""], [1, 16, 0, "d2f0b6d6fa6474b3", ""], [2, 18, 0, "1dca7268d91c1c95", "6:2e413ac5dd3ecd92"], [3, 5, 1, "530082ea07922a5d", ""], [1, 4, 1, "cee06d995a56a537", ""], [1, 9, 0, "114db3c7cd1b4074", ""], [1, 7, 1, "011d6f16608445c5", ""], [2, 25, 0, "37e4af437a02c810", ""], [1, 14, 1, "148469144da6dc58", "5:b75e6b9daa4bf6a6"], [2, 13, 1, "94e626a3fb9e6f6b", ""], [1, 6, 0, "fa19f4c42e2070fb", ""], [1, 9, 1, "00d35bdf3e8deeec", ""], [1, 18, 1, "da2cb2309d20ba0b", ""], [1, 23, 0, "2c600da8b86967e3", ""], [3, 10, 0, "6113a14d05199590", ""], [1, 23, 0, "12ab794b2c088aa3", ""], [1, 23, 0, "358743d903a1b8f2", ""], [3, 8, 1, "cff3c8988e87dd5f", ""], [1, 6, 0, "921c1ef4ff595230", ""], [2, 20, 0, "d93f7fcd88c5a5f1", ""], [2, 10, 0, "e57b67b317096f5f", ""], [1, 7, 1, "a3a2f0a68650b540", ""], [1, 21, 0, "c2ccb7d4a45cb296", "3:89dbff3527c083ca"], [1, 7, 1, "82460a55f9b142a4", ""], [1, 11, 1, "a598d921ebee476c", "3:1ecb80b9537060c5"], [3, 21, 1, "862928a4dda08181", ""], [1, 13, 0, "8869e05d109bb302", "4:c9535bcddd65b59b"], [2, 21, 1, "8cd7410d03db308d", ""], [3, 5, 0, "1bed9f2bbbe68815", "3:37f1845ea5c9dd2a"], [4, 8, 1, "32891f88dd4c9697", ""], [3, 7, 0, "c0b9c86b5ec063ba", "6:9f0549d517eed12e"], [1, 23, 1, "b3a4b18e21b8488e", ""], [1, 26, 0, "f1819a81610e001d", ""], [1, 12, 0, "d64171e01d82a01b", "5:bfc5580e021bda96"], [1, 12, 0, "3d56d8eea71310db", ""], [2, 21, 0, "1fff7952f7313f42", ""], [1, 11, 1, "4cdd2d5056db85b4", ""], [1, 5, 1, "955c1ac3a0091fca", ""], [1, 15, 1, "484689ad7554c13d", "4:e9fe665f6d251022"], [3, 4, 0, "afd223dd78e09b6d", "4:5022ecd1cd2e0117"], [1, 12, 0, "40721d2c48594e3c", ""], [1, 9, 1, "cc2818bd0e2f6b13", "4:c4785a1339db913d"], [2, 14, 0, "1f4f1109c66bc5ed", "6:c98ede1b895ab7c8"], [1, 25, 1, "dfd7586f2da6cd1e", ""], [1, 21, 0, "3a0aabd0509e4688", "6:4e857d6bfc9277cf"], [1, 5, 1, "0233900121cc0328", ""], [2, 6, 1, "7070d0117f2ca8dc", "5:63f130c99e9cf6b2"]]  # impronte con chiave segreta, mescolate a impronte casuali (tools/guardia.py)
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
MK = {'infl', 'bce', 'btp2', 'btp5', 'btp10', 'btpv', 'cdl', 'cd12', 'cd24', 'cd36', 'bbva0', 'bbva10', 'bbva50', 'bbvac'}
for x in o.get('mercati', []):
    for k in ('id', 't', 'valore', 'd', 'fonte', 'url'):
        if k not in x: err('mercati: manca %s in %s' % (k, x.get('id')))
    if x['id'] not in MK: err('mercati: id sconosciuto ' + x['id'])
    if not isinstance(x['valore'], (int, float)) or not -5 <= x['valore'] <= 25: err('mercati: valore fuori scala ' + x['id'])
    if not re.match(r'^\d{4}-\d{2}-\d{2}$', x['d']) or x['d'] > today: err('mercati: data ' + x['id'])
    if not x['url'].startswith('https://'): err('mercati: url ' + x['id'])
PT = {'dep', 'conto', 'btp', 'mon', 'obb', 'bil', 'az'}
P = o.get('prodotti', [])
if len(P) > 40: err('prodotti: al massimo 40')
pid = set()
for x in P:
    for k in ('id', 'tipo', 'n', 'em', 'd', 'fonte', 'url'):
        if k not in x: err('prodotti: manca %s in %s' % (k, x.get('id')))
    if x['id'] in pid: err('prodotti: doppione ' + x['id'])
    pid.add(x['id'])
    if x['tipo'] not in PT: err('prodotti: tipo ' + x['id'])
    if x.get('tasso') is not None and (not isinstance(x['tasso'], (int, float)) or not 0 <= x['tasso'] <= 15): err('prodotti: tasso ' + x['id'])
    if x.get('isin') and not re.match(r'^[A-Z]{2}[A-Z0-9]{9}[0-9]$', x['isin']): err('prodotti: ISIN ' + x['id'])
    if not re.match(r'^\d{4}-\d{2}-\d{2}$', x['d']) or x['d'] > today: err('prodotti: data ' + x['id'])
    if not x['url'].startswith('https://'): err('prodotti: url ' + x['id'])
if guarda(raw, REGOLE, obbligatoria=False): err('termine personale nel file pubblico')
TIPI = {'ufficiale', 'sindacato GdF', 'sindacato polizia', 'sindacato militari', 'testata'}
for x in o.get('fonti', []):
    if not x.get('n') or not str(x.get('url', '')).startswith('https://') or x.get('tipo') not in TIPI: err('fonte non valida: ' + str(x.get('n')))
    if x.get('ultimo') and x['ultimo'][:10] > today: err('fonte con data futura: ' + x['n'])
if len(o.get('controlli', [])) > 60: err('controlli: tieni solo gli ultimi 60')
if len(sys.argv) > 2 and open(sys.argv[2], encoding='utf-8').read() != raw: err('le due copie sono diverse')
print('✅ novità ok:', len(V), 'notizie,', len(o.get('attesa', [])), 'parametri in attesa,', len(o.get('mercati', [])), 'tassi di mercato,', len(P), 'prodotti')
