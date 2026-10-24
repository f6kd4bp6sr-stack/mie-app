"""Copia le sorgenti di un'app in mie-app/sorgenti/<nome>/ (memoria dell'app nel repository).
Uso: python3 sorgenti_pubbliche.py <cartella-sorgenti> <nome>
Esclude ciò che non serve o che non deve essere pubblico; si ferma se trova dati personali."""
import os, re, shutil, sys, glob, base64
src, name = os.path.abspath(sys.argv[1]), sys.argv[2]
dst = '/home/claude/mie-app/sorgenti/' + name
assert name in ('il-mio-mondo', 'pianificazione'), 'solo le mie app: «semestre» ha le sue sorgenti'
SKIP_DIRS = {'.git', '__pycache__', 'out', 'archivio', '_gen', 'verifiche'}
KEEP = ['data/verifiche/rev2/fix_*.json', 'data/verifiche/rev3/fix_*.json', 'data/verifiche/rev3/factfix_*.json', 'data/verifiche/rev4/cur_*.json']
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(_os.path.abspath(__file__)))
from guardia import guarda  # impronte con chiave segreta: tools/guardia.py
REGOLE = [[1, 5, 1, "955c1ac3a0091fca", ""], [1, 5, 1, "0233900121cc0328", ""], [3, 12, 0, "cc6e97eb35abdcca", ""], [3, 26, 1, "78fa8b33b5922bb8", "6:874574cb01df91d9"], [2, 10, 1, "e925780c36636482", "3:ada5c176d2a2a445"], [2, 5, 1, "f2b3eccaa494e6ce", ""], [4, 8, 1, "32891f88dd4c9697", ""], [1, 21, 1, "a960b1942f4410da", ""], [2, 11, 0, "870cb08c1e274354", "6:5e6c66fd6b5e0f76"], [2, 18, 1, "0ea28eec14312bdf", "4:1e22adcabf473988"], [3, 8, 0, "1cffa6dd25a3e6aa", ""], [1, 22, 0, "fc3a60f5773a83b3", ""], [2, 8, 0, "eabed3def7563238", "4:a080a695d296eaea"], [3, 7, 1, "63796de814a3b918", "6:24e99d556193a29e"], [1, 7, 1, "82460a55f9b142a4", ""], [1, 15, 1, "7df0b4942a3d9f96", ""], [3, 5, 1, "f5de2e874af9051d", "6:f29d3246cc16a584"], [2, 22, 1, "b8b11c699318d423", ""], [1, 24, 1, "a8962fa7acac8539", ""], [2, 15, 0, "cc643d0578e956bb", ""], [2, 11, 1, "8507e8045572a94d", ""], [2, 6, 0, "81411a318be8637d", ""], [1, 8, 0, "204314455db29de6", ""], [1, 6, 0, "cccb32f3de63be98", "4:8fc6b81cd763c2c2"], [1, 6, 0, "921c1ef4ff595230", ""], [3, 12, 1, "1d98a723ab33348c", ""], [1, 9, 0, "114db3c7cd1b4074", ""], [1, 21, 1, "f023bec0bc39f724", ""], [3, 13, 0, "95922d2bad691e1b", "5:7b65bceb0903f4de"], [3, 25, 0, "9e1b322164d7ae6c", ""], [3, 21, 0, "1d2c1ad5207a93ee", ""], [3, 6, 0, "441962bd7db97578", ""], [2, 24, 1, "4c2903867a8544aa", "3:50abdce67f8af8ce"], [1, 9, 1, "cc2818bd0e2f6b13", "4:c4785a1339db913d"], [1, 6, 0, "fa19f4c42e2070fb", ""], [3, 24, 1, "34117e7323455cca", "4:c20e3c0f017d4268"], [3, 6, 1, "d818c9b999bb099d", ""], [2, 24, 1, "4e916f96a880cfd4", ""], [1, 7, 1, "011d6f16608445c5", ""], [2, 20, 1, "ed6597b5889da9f2", ""], [1, 4, 1, "cee06d995a56a537", ""], [1, 7, 1, "a3a2f0a68650b540", ""], [1, 10, 1, "923574ee30d374ce", ""], [2, 4, 1, "72ace2efc1442222", ""], [2, 18, 1, "d6751829e5105c81", ""], [1, 25, 0, "1248d60c55a7f3e0", "6:9728d42f3aee97ad"], [1, 23, 1, "5eada1fce33e57f2", ""], [1, 5, 0, "8d738b1f3248865f", "4:e28d822c4d717b99"]]  # impronte con chiave segreta, mescolate a impronte casuali (tools/guardia.py)
PRIVATI = {'docs/ricerca_banche.md'}
files = []
for root, dirs, fs in os.walk(src):
    dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
    for f in fs:
        if f.endswith(('.orig', '.pyc', '.zip', '.bak', '.log')): continue
        r = os.path.relpath(os.path.join(root, f), src)
        if r in PRIVATI: continue  # note private: stanno nel progetto, non nel repository
        files.append(r)
for pat in KEEP: files += [os.path.relpath(f, src) for f in glob.glob(os.path.join(src, pat))]
# controllo: nessun dato personale (elenco codificato, così non compare in chiaro), nessun termine vietato
bad = []
for f in files:
    p = os.path.join(src, f)
    try: t = open(p, encoding='utf-8').read()
    except Exception: continue
    if guarda(t, REGOLE): bad.append(f)
    # niente chiavi GitHub, niente scheda pensione in chiaro
    if re.search(r'\b(ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|gho_[A-Za-z0-9]{20,})', t) or '"pianificazione-pensione"' in t and 'scheda' in f and 'cifrata' not in f: bad.append(f)
if bad: sys.exit('DATI PERSONALI nelle sorgenti, non pubblico: ' + ', '.join(bad))
if os.path.isdir(dst): shutil.rmtree(dst)
for f in files:
    os.makedirs(os.path.dirname(os.path.join(dst, f)), exist_ok=True); shutil.copy2(os.path.join(src, f), os.path.join(dst, f))
print('sorgenti', name, len(files), 'file')
