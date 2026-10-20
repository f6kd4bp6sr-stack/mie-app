"""Controllo automatico dei contenuti di «Il mio mondo».
Si esegue da solo a ogni build (build.py). Se trova ERRORI il build si ferma: niente viene pubblicato.
- ogni domanda: codice (id) unico, 3 risposte diverse e non vuote, riga chiave fino a 12 parole, spiegazione presente
- i codici non spariscono mai (registro data/domande/quiz/_codici.txt): una domanda tolta va scritta in _ritirati.txt
- nessun termine vietato (diagnosi o bisogni speciali di chi studia non vanno mai nominati)
- rapporto: data/_gen/rapporto.md con il conteggio per materia e la copertura del programma (data/programma/*.json)
"""
import glob, json, os, re, sys

D = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) + '/'
QDIR = D + 'data/domande/quiz/'
import json as _j
_A = _j.load(open(D + 'data/domande/argomenti.json', encoding='utf-8')) if os.path.exists(D + 'data/domande/argomenti.json') else {}
ARG_IDS = {u: {t[0] for t in L} for u, L in _A.items()}
# termini che non devono comparire nei contenuti: solo impronte, le parole non sono nel codice pubblico
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
GUARD_SALUTE = [[1, 4, 1, "0965105e44659ce2", ""], [1, 9, 0, "1232ff47c6f9ef8f", ""], [3, 21, 0, "8ca88b76e83f722f", ""], [1, 3, 1, "b81787cefac3e952", ""], [1, 3, 1, "e181db99c5742a9e", ""], [2, 13, 0, "de4d39d7e6fd8695", ""], [2, 13, 0, "f44cfd342de4d587", ""], [1, 7, 0, "9bec2f147bccf70b", ""], [1, 13, 0, "ebf625af53f6b6d7", ""], [2, 19, 0, "f6944af4606cf312", ""]]
words = lambda s: len(str(s).split())


def run(write=True):
    err, warn, units = [], [], {}
    for f in sorted(glob.glob(QDIR + '*.json')):
        u = os.path.basename(f)[:-5]
        try:
            L = json.load(open(f, encoding='utf-8'))
        except Exception as e:
            err.append(f'{u}: JSON non valido ({e})'); continue
        units[u] = L
        ids = set()
        for i, x in enumerate(L):
            where = f'{u} #{i} [{x.get("id", "?")}]'
            for k in ('id', 'q', 'ok', 'wrong', 'e'):
                if k not in x: err.append(f'{where}: manca «{k}»')
            if not isinstance(x.get('wrong'), list) or len(x.get('wrong', [])) != 2: err.append(f'{where}: servono esattamente 2 risposte sbagliate'); continue
            if x['id'] in ids: err.append(f'{where}: codice ripetuto')
            ids.add(x['id'])
            opts = [str(x['ok']).strip()] + [str(w).strip() for w in x['wrong']]
            if any(not o for o in opts): err.append(f'{where}: una risposta è vuota')
            if len(set(o.lower() for o in opts)) != 3: err.append(f'{where}: risposte uguali tra loro')
            if any(re.search(r'\b(tutte|nessuna) le (precedenti|risposte)\b', o.lower()) for o in opts): err.append(f'{where}: risposta «tutte/nessuna»')
            if x.get('k') and words(x['k']) > 12: err.append(f'{where}: riga chiave oltre 12 parole')
            if not x.get('k'): warn.append(f'{where}: manca la riga chiave (si usa la prima frase della spiegazione)')
            if not str(x.get('e', '')).strip(): warn.append(f'{where}: manca la spiegazione')
            if words(x.get('e', '')) > 60: warn.append(f'{where}: spiegazione lunga ({words(x["e"])} parole)')
            # parti inglesi lette con la voce britannica: ogni stringa deve stare davvero nel testo
            if 'en' in x:
                src = ' '.join([str(x.get('q', '')), *opts, str(x.get('k', '')), str(x.get('e', '')), str(x.get('say', ''))])
                if not isinstance(x['en'], list) or not all(isinstance(w, str) and w for w in x['en']): err.append(f'{where}: «en» deve essere un elenco di frasi')
                else:
                    for w in x['en']:
                        if w not in src: err.append(f'{where}: «{w}» (en) non compare nel testo')
            elif u in ('eng', 'parlo'): (err if u == 'parlo' else warn).append(f'{where}: manca «en» (parti inglesi per la voce britannica)')
            if u == 'parlo':
                if x.get('kind') not in ('ascolta', 'dillo'): err.append(f'{where}: «kind» deve essere ascolta o dillo')
                for k in ('say', 'it', 't'):
                    if not str(x.get(k, '')).strip(): err.append(f'{where}: manca «{k}»')
                if x.get('kind') == 'dillo' and x.get('ok') != x.get('say'): err.append(f'{where}: in «dillo» la risposta giusta deve essere la frase da dire (say)')
                if x.get('kind') == 'ascolta' and any(re.search(r'[A-Za-zÀ-ÿ0-9]', o) for o in opts): err.append(f'{where}: in «ascolta» le risposte sono solo immagini (emoji)')
                if words(x.get('e', '')) > 35: err.append(f'{where}: spiegazione oltre 35 parole')
            # argomento: ogni domanda ne ha uno, scritto in data/domande/argomenti.json
            if x.get('arg') not in ARG_IDS.get(u, set()): err.append(f'{where}: argomento «{x.get("arg", "")}» mancante o sconosciuto (data/domande/argomenti.json)')
            txt = ' '.join([x.get('q', ''), *opts, x.get('k', ''), x.get('e', '')]).lower()
            if guarda(txt, GUARD_SALUTE): err.append(f'{where}: termine vietato')
    # spiegazioni con racconto e mappa (data/domande/../spiegazioni/<materia>.json)
    SPD = D + 'data/spiegazioni/'
    qids = {u: {x['id'] for x in L if 'id' in x} for u, L in units.items()}
    qarg = {u: {x['id']: x.get('arg') for x in L if 'id' in x} for u, L in units.items()}
    for f in sorted(glob.glob(SPD + '*.json')):
        u = f.split('/')[-1][:-5]
        try: S = json.load(open(f, encoding='utf-8'))
        except Exception as e: err.append(f'spiegazioni/{u}: JSON non valido ({e})'); continue
        for t, d in S.items():
            w = f'spiegazioni {u}:{t}'
            if u == 'mate':
                if not t.isdigit(): err.append(f'{w}: per la matematica la chiave è il numero della tappa')
            elif t not in ARG_IDS.get(u, set()): err.append(f'{w}: argomento inesistente')
            nodi = d.get('nodi', []); ids = [n.get('id') for n in nodi]
            if not (4 <= len(nodi) <= 6): err.append(f'{w}: servono da 4 a 6 nodi')
            if len(set(ids)) != len(ids): err.append(f'{w}: nodi con lo stesso id')
            for n in nodi:
                if not n.get('n') or not n.get('da'): err.append(f'{w}: nodo «{n.get("id")}» senza nome o senza parola sulla freccia')
            if not d.get('centro', {}).get('n'): err.append(f'{w}: manca il centro')
            rac = d.get('racconto', [])
            if not (4 <= len(rac) <= 7): err.append(f'{w}: il racconto deve avere da 4 a 7 schermate')
            nel = set()
            for k, sl in enumerate(rac):
                if words(sl.get('t', '')) > 30: err.append(f'{w}: schermata {k + 1} oltre 30 parole')
                for n in sl.get('nodi', []):
                    if n not in ids: err.append(f'{w}: schermata {k + 1} cita il nodo inesistente «{n}»')
                    nel.add(n)
                if guarda(sl.get('t', '').lower(), GUARD_SALUTE): err.append(f'{w}: termine vietato')
            for n in ids:
                if n not in nel: err.append(f'{w}: il nodo «{n}» non compare nel racconto')
            cov = set()
            for r in d.get('ritrova', []):
                if r.get('nodo') not in ids: err.append(f'{w}: ritrova su un nodo inesistente')
                sc = [str(x).strip().lower() for x in r.get('scelte', [])]
                if len(sc) != 3 or len(set(sc)) != 3: err.append(f'{w}: ritrova vuole 3 scelte diverse')
                cov.add(r.get('nodo'))
            for q, n in (d.get('domande') or {}).items():
                if q not in qids.get(u, set()): err.append(f'{w}: domanda «{q}» inesistente')
                elif qarg[u][q] != t: err.append(f'{w}: la domanda «{q}» è di un altro argomento')
                if n not in ids: err.append(f'{w}: la domanda «{q}» punta al nodo inesistente «{n}»')
                cov.add(n)
            if d.get('tutte'):
                if d['tutte'] not in ids: err.append(f'{w}: «tutte» punta a un nodo inesistente')
                cov.add(d['tutte'])
            for n in ids:
                if n not in cov: warn.append(f'{w}: il nodo «{n}» non ha né domande né ritrova')
            for c in d.get('collegamenti', []):
                cu, _, ct = str(c).partition(':')
                if cu == 'mate': ok = ct.isdigit()
                else: ok = ct in ARG_IDS.get(cu, set())
                if not ok: err.append(f'{w}: collegamento «{c}» inesistente')
                if cu == u and ct == t: err.append(f'{w}: collegamento a se stesso')
    # registro dei codici: un codice registrato non può sparire
    reg_f, rit_f = QDIR + '_codici.txt', QDIR + '_ritirati.txt'
    reg = set(open(reg_f).read().split()) if os.path.exists(reg_f) else set()
    rit = set(open(rit_f).read().split()) if os.path.exists(rit_f) else set()
    now = {u + ':' + x['id'] for u, L in units.items() for x in L if 'id' in x}
    lost = sorted(reg - now - rit)
    for k in lost: err.append(f'codice sparito: {k} (se la domanda è stata tolta apposta, scrivilo in _ritirati.txt)')
    if write and not err:
        open(reg_f, 'w').write('\n'.join(sorted(reg | now)) + '\n')
    # copertura del programma
    rep = ['# Rapporto contenuti', '', '| Materia | Domande | Con riga chiave |', '|---|---|---|']
    for u, L in units.items(): rep.append(f'| {u} | {len(L)} | {sum(1 for x in L if x.get("k"))} |')
    gaps = []
    for pf in sorted(glob.glob(D + 'data/programma/*.json')):
        P = json.load(open(pf, encoding='utf-8')); cls = os.path.basename(pf)[:-5]
        rep += ['', f'## Programma {cls}', P.get('_info', ''), '']
        for u, temi in P.items():
            if u.startswith('_'): continue
            L = units.get(u, []); T = [' '.join([x.get('q', ''), x.get('ok', ''), x.get('e', '')]).lower() for x in L]
            rep.append(f'**{u}**')
            for tema, kw in temi.items():
                n = sum(1 for t in T if any(k in t for k in kw))
                rep.append(f'- {tema}: {n}' + (' ⚠️ poco' if n < 5 else ''))
                if n < 5: gaps.append(f'{cls} {u}: {tema} ({n})')
    if write:
        os.makedirs(D + 'data/_gen', exist_ok=True)
        open(D + 'data/_gen/rapporto.md', 'w', encoding='utf-8').write('\n'.join(rep + ['', '## Avvisi', *warn[:300]]) + '\n')
    return err, warn, gaps, sum(len(L) for L in units.values())


if __name__ == '__main__':
    e, w, g, n = run()
    print(f'domande {n} · errori {len(e)} · avvisi {len(w)} · temi scoperti {len(g)}')
    for x in e[:40]: print('ERRORE', x)
    for x in g: print('POCO', x)
    sys.exit(1 if e else 0)
