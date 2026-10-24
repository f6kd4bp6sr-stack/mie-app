"""Guardia dei dati da non pubblicare: confronto per impronte con una CHIAVE SEGRETA.
L'elenco delle impronte può stare nel codice pubblico: senza la chiave non si può risalire alle parole.
La chiave non è nel repository: arriva dalla variabile d'ambiente GUARDIA_CHIAVE oppure dal file ~/.mie-guardia-chiave.
Senza chiave il controllo si ferma (meglio non pubblicare che pubblicare senza controllo).
Regola: [parole, lettere, esatta, impronta, eccezione]; eccezione = "" oppure "lettere:impronta" della parola che segue
(se la parola dopo corrisponde, non è un dato da fermare)."""
import hashlib, os, re

_K = None


def chiave(obbligatoria=True):
    global _K
    if _K is None:
        k = os.environ.get('GUARDIA_CHIAVE', '').strip()
        f = os.path.expanduser('~/.mie-guardia-chiave')
        if not k and os.path.exists(f): k = open(f).read().strip()
        if not k:
            if not obbligatoria: return None
            raise SystemExit('Manca la chiave della guardia (GUARDIA_CHIAVE): il controllo dei dati da non pubblicare non può partire.')
        _K = k.encode()
    return _K


def impronta(s):
    a = hashlib.blake2b(s.encode(), digest_size=8, key=b'mie-app-guardia').hexdigest()
    return hashlib.blake2b(a.encode(), digest_size=8, key=chiave()).hexdigest()


def guarda(testo, regole, obbligatoria=True):
    """Vero se il testo contiene un termine da non pubblicare. Con obbligatoria=False, senza chiave
    il controllo si salta con un avviso (lo rifà comunque la pubblicazione a mano, che la chiave la vuole)."""
    if chiave(obbligatoria) is None:
        import sys
        print('⚠️ controllo dei dati personali saltato: manca GUARDIA_CHIAVE (lo ripete la prossima pubblicazione a mano)', file=sys.stderr)
        return False
    w = re.findall(r"[0-9a-zà-ÿ]+", str(testo).lower())
    H = {tuple(r[:4]): r[4] for r in regole}
    C = {tuple(r[:3]) for r in regole}
    for i in range(len(w)):
        for n, L, e in C:
            if i + n > len(w): continue
            s = ' '.join(w[i:i + n])
            if len(s) < L or (e and len(s) != L): continue
            k = (n, L, e, impronta(s[:L]))
            if k not in H: continue
            ex = H[k]
            if ex and i + n < len(w):
                el, eh = ex.split(':')
                if impronta(w[i + n][:int(el)]) == eh: continue
            return True
    return False
