"""Copia le sorgenti di un'app in mie-app/sorgenti/<nome>/ (memoria dell'app nel repository).
Uso: python3 sorgenti_pubbliche.py <cartella-sorgenti> <nome>
Esclude ciò che non serve o che non deve essere pubblico; si ferma se trova dati personali."""
import os, re, shutil, sys, glob, base64
src, name = os.path.abspath(sys.argv[1]), sys.argv[2]
dst = '/home/claude/mie-app/sorgenti/' + name
assert name in ('il-mio-mondo', 'pianificazione'), 'solo le mie app: «semestre» ha le sue sorgenti'
SKIP_DIRS = {'.git', '__pycache__', 'out', 'archivio', '_gen', 'verifiche'}
KEEP = ['data/verifiche/rev2/fix_*.json', 'data/verifiche/rev3/fix_*.json', 'data/verifiche/rev3/factfix_*.json', 'data/verifiche/rev4/cur_*.json']
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
