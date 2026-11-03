"""Controllo della scheda 🌸 Ikigai di Metodo (sezioni/metodo_dati.json → ikigai; illustrazioni IKI_IMG in pagine/metodo.html).
Parte da solo a ogni build: con un errore il build si ferma.
Uso a mano: python3 strumenti/verifica_ikigai.py sezioni/metodo_dati.json pagine/metodo.html"""
import json, re, sys

parole = lambda s: len(str(s).split())


def controlla(path, html=None):
    e = []
    I = json.load(open(path, encoding='utf-8')).get('ikigai')
    if not I:
        return ['manca la chiave «ikigai»']
    for k in ('intro', 'nota'):
        if not I.get(k):
            e.append('ikigai: manca «%s»' % k)
    C = I.get('capitoli') or []
    if len(C) < 6:
        e.append('ikigai: servono almeno 6 capitoli')
    ids = [c.get('id') for c in C]
    if len(set(ids)) != len(ids):
        e.append('ikigai: id dei capitoli ripetuti')
    img = set(re.findall(r'\n (\w+):`<svg', open(html, encoding='utf-8').read())) if html else None
    for c in C:
        w = 'capitolo «%s»' % c.get('id')
        for k in ('id', 'ic', 'tit', 'sotto'):
            if not c.get(k):
                e.append('%s: manca «%s»' % (w, k))
        if not c.get('pronto'):
            continue
        P, R, S, X, F = c.get('princ') or [], c.get('regole') or [], c.get('spiega', ''), c.get('es') or {}, c.get('fonti') or []
        if not 2 <= len(P) <= 8: e.append(w + ': «princ» da 2 a 8 voci')
        if any(parole(p) > 55 for p in P): e.append(w + ': una voce di «princ» supera 55 parole')
        if not 1 <= len(R) <= 5: e.append(w + ': «regole» da 1 a 5 voci')
        if any(parole(r) > 30 for r in R): e.append(w + ': una regola supera 30 parole')
        if not 15 <= parole(S) <= 220: e.append('%s: «spiega» deve avere 15-220 parole (ora %d)' % (w, parole(S)))
        if not X.get('t') or not 1 <= int(X.get('min') or 0) <= 20 or not 2 <= len(X.get('passi') or []) <= 6:
            e.append(w + ': esercizio incompleto (titolo, 1-20 minuti, 2-6 passi)')
        if not F: e.append(w + ': serve almeno una fonte')
        for f in F:
            if isinstance(f, str):
                if not re.search(r'\b(19|20)\d{2}\b', f): e.append(w + ': fonte senza anno: ' + f[:40])
                continue
            if not re.search(r'\b(19|20)\d{2}\b', f.get('c', '')): e.append(w + ': fonte senza anno: ' + f.get('c', '')[:40])
            if f.get('t') not in ('libro', 'studio', 'articolo'): e.append(w + ': tipo di fonte sconosciuto')
            if f.get('t') in ('studio', 'articolo') and not str(f.get('url', '')).startswith('https://'): e.append(w + ': studio o articolo senza link https')
            if f.get('url') and not str(f['url']).startswith('https://'): e.append(w + ': link non https')
        if img is not None and c.get('id') not in img:
            e.append(w + ': manca l\'illustrazione in IKI_IMG')
    return e


if __name__ == '__main__':
    a = sys.argv[1:] or ['sezioni/metodo_dati.json', 'pagine/metodo.html']
    err = controlla(a[0], a[1] if len(a) > 1 else None)
    print('❌ da sistemare:\n- ' + '\n- '.join(err) if err else '✅ tutto a posto')
    sys.exit(1 if err else 0)
