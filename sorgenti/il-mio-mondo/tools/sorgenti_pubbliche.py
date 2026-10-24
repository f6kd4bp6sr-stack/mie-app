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
GUARD = [[1, 9, 1, "cc2818bd0e2f6b13", "4:c4785a1339db913d"], [1, 4, 1, "cee06d995a56a537", ""], [1, 9, 0, "114db3c7cd1b4074", ""], [3, 21, 0, "1d2c1ad5207a93ee", ""]]  # impronte con chiave segreta (tools/guardia.py)
files = []
for root, dirs, fs in os.walk(src):
    dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
    for f in fs:
        if f.endswith(('.orig', '.pyc', '.zip')): continue
        files.append(os.path.relpath(os.path.join(root, f), src))
for pat in KEEP: files += [os.path.relpath(f, src) for f in glob.glob(os.path.join(src, pat))]
# controllo: nessun dato personale (elenco codificato, così non compare in chiaro), nessun termine vietato
bad = []
for f in files:
    p = os.path.join(src, f)
    try: t = open(p, encoding='utf-8').read()
    except Exception: continue
    if guarda(t, GUARD): bad.append(f)
if bad: sys.exit('DATI PERSONALI nelle sorgenti, non pubblico: ' + ', '.join(bad))
if os.path.isdir(dst): shutil.rmtree(dst)
for f in files:
    os.makedirs(os.path.dirname(os.path.join(dst, f)), exist_ok=True); shutil.copy2(os.path.join(src, f), os.path.join(dst, f))
print('sorgenti', name, len(files), 'file')
