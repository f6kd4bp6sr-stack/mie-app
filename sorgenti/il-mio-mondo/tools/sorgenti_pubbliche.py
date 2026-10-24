"""Copia le sorgenti di un'app in mie-app/sorgenti/<nome>/ (memoria dell'app nel repository).
Uso: python3 sorgenti_pubbliche.py <cartella-sorgenti> <nome>
Esclude ciò che non serve o che non deve essere pubblico; si ferma se trova dati personali."""
import os, re, shutil, sys, glob, base64
src, name = os.path.abspath(sys.argv[1]), sys.argv[2]
dst = '/home/claude/mie-app/sorgenti/' + name
assert name in ('il-mio-mondo', 'pianificazione'), 'solo le mie app: «semestre» ha le sue sorgenti'
SKIP_DIRS = {'.git', '__pycache__', 'out', 'archivio', '_gen', 'verifiche'}
KEEP = ['data/verifiche/rev2/fix_jokes.json', 'data/verifiche/rev3/fix_jokes.json', 'data/verifiche/rev3/factfix_*.json', 'data/verifiche/rev4/cur_*.json']
# nei file di revisione pubblici restano solo i campi che servono al build: niente note dei revisori né testi vecchi
TOGLI = ('why', 'nota', 'note')  # q_old e title_old servono a fixes_apply.js per ritrovare la voce
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(_os.path.abspath(__file__)))
from guardia import guarda  # impronte con chiave segreta: tools/guardia.py
REGOLE = [[1, 13, 1, "6d447f7d108d4bdd", ""], [3, 6, 0, "1ce5e16f45a457d7", ""], [1, 20, 0, "2028b16a66b9d923", ""], [1, 4, 1, "cee06d995a56a537", ""], [3, 19, 1, "3105637fdc3e5a3b", ""], [2, 10, 0, "4262a7a005e493d4", ""], [3, 17, 1, "1cc9a8a9af76d027", "3:c94d3d1fd28f2db2"], [3, 21, 0, "1d2c1ad5207a93ee", ""], [1, 15, 0, "02a4c4ab346473f5", ""], [1, 9, 1, "cc2818bd0e2f6b13", "4:c4785a1339db913d"], [3, 9, 0, "ef6f7875d7650e99", "4:a88d5394a7590c41"], [1, 12, 1, "f42ed2d0665f218f", "5:797d6e30f0cb4a85"], [3, 6, 0, "92341d7e068a9d86", "6:1c0f846220d592a1"], [1, 23, 0, "d622afb75ebd127c", ""], [1, 16, 0, "21d1d9ed939f7c71", "3:ac8ec7feac0611be"], [3, 12, 0, "dbf0c170f6eea9bd", "3:c9fa25adcd40d048"], [2, 6, 0, "99504f97f6a26ad7", ""], [2, 15, 0, "1660e8fe3dd1a039", ""], [1, 20, 0, "688d3115b1c229de", "6:bb6cce2c72d16530"], [1, 24, 1, "67c570b2f47d90c3", ""], [2, 24, 1, "d15b8ce6ad0b5775", ""], [3, 14, 1, "828738e6f6fb3c2f", ""], [1, 6, 1, "cdfb270920ff99f7", "4:5d4cba74589d7725"], [3, 12, 1, "1464da3785a49215", ""], [1, 20, 1, "d07a3e0846980bf2", ""], [2, 25, 1, "80f88e963319908d", "3:cb2c853a74554294"], [3, 17, 1, "36492adf062f33bf", ""], [3, 15, 0, "eb18ca2294e513f3", ""], [3, 21, 0, "e176ec82e84cfb76", ""], [2, 14, 1, "a62cd8496fc8730b", "5:51ce09b62efca49a"], [2, 6, 0, "cf7fd8c88ad38d22", "6:07018d67bb16e62d"], [2, 23, 1, "daf5a2da356c1486", ""], [1, 20, 0, "fb8163b98a60a46c", ""], [1, 9, 0, "114db3c7cd1b4074", ""], [1, 11, 0, "c65c21d4544aaef0", "6:406dd8576bbe1e69"], [1, 26, 1, "4a3476796a62eb20", ""], [1, 13, 0, "6e8c53ffc2b2dc99", "5:5451e1872dfe2840"], [2, 19, 0, "da531015d695b756", "6:d256aab1ba191a6a"], [2, 22, 1, "9d0799d758136464", "5:410e00d55af034fa"], [1, 17, 1, "836736ed001bb05d", "5:9e014e8c887ad0b0"]]  # impronte con chiave segreta, mescolate a impronte casuali (tools/guardia.py)
PRIVATI = set()
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
    os.makedirs(os.path.dirname(os.path.join(dst, f)), exist_ok=True)
    if f.startswith('data/verifiche/') and f.endswith('.json'):
        import json as _js
        L = _js.load(open(os.path.join(src, f), encoding='utf-8'))
        if isinstance(L, list): L = [{k: v for k, v in x.items() if k not in TOGLI} if isinstance(x, dict) else x for x in L]
        open(os.path.join(dst, f), 'w', encoding='utf-8').write(_js.dumps(L, ensure_ascii=False, indent=1))
    else: shutil.copy2(os.path.join(src, f), os.path.join(dst, f))
print('sorgenti', name, len(files), 'file')
