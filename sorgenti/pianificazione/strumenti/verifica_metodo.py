"""Controllo dei contenuti di 🤝 Metodo (sezioni/metodo_dati.json): parte da solo a ogni build.
Con un errore il build si ferma. Uso a mano: python3 strumenti/verifica_metodo.py sezioni/metodo_dati.json"""
import json, re, sys

LIVELLI = (1, 2, 3)
SITUAZIONI_BASE = ('nuove', 'colleghi', 'famiglia', 'gruppi')
# parole che non devono comparire nei testi pubblici (gruppi esclusi dalla sezione)
VIETATE = re.compile(r'finanzier|guardia di finanza|\bgdf\b|militar|associazion[ei] d.arma|caserm', re.I)


def parole(s):
    return len(re.findall(r"\S+", s or ''))


def controlla_app(ap, w):
    """approfondimento di una scheda: come funziona lo studio, che cosa provare, attenzione, fonti complete"""
    err = []
    if not ap.get('come'): err.append(w + ': manca «come»')
    elif parole(ap['come']) > 85: err.append('%s: «come» troppo lungo (%d parole, massimo 85)' % (w, parole(ap['come'])))
    p = ap.get('prova') or []
    if not 2 <= len(p) <= 4: err.append(w + ': «prova» deve avere da 2 a 4 passi')
    for s in p:
        if parole(s) > 22: err.append(w + ': un passo di «prova» è troppo lungo')
    if not ap.get('att'): err.append(w + ': manca «att» (attenzione)')
    fo = ap.get('fonti') or []
    if not fo: err.append(w + ': mancano le fonti')
    if fo and not any(f.get('t') in ('studio', 'libro') for f in fo): err.append(w + ': serve almeno uno studio originale')
    for f in fo:
        if not re.search(r'\(\d{4}\)', f.get('c', '')) and not (f.get('t') == 'articolo' and '(s.d.)' in f.get('c', '')): err.append(w + ': citazione senza anno: ' + f.get('c', '')[:40])
        if f.get('t') not in ('studio', 'articolo', 'libro'): err.append(w + ': tipo di fonte sconosciuto')
        if f.get('t') != 'libro' and not str(f.get('url', '')).startswith('https://'): err.append(w + ': fonte senza link https: ' + f.get('c', '')[:40])
    return err


def controlla(path):
    err = []
    try:
        d = json.load(open(path, encoding='utf-8'))
    except Exception as e:
        return ['file non leggibile: %s' % e]
    ab = [a.get('id') for a in d.get('abilita', [])]
    if len(ab) != 4 or len(set(ab)) != 4:
        err.append('servono 4 abilità con id diversi')
    for a in d.get('abilita', []):
        for k in ('id', 'ic', 'n', 'sotto'):
            if not a.get(k): err.append('abilità %s: manca %s' % (a.get('id'), k))
    sit = d.get('situazioni', {})
    for s in SITUAZIONI_BASE + ('vol',):
        if s not in sit: err.append('situazione mancante: ' + s)
    for k in ('intro', 'intro_base'):
        if not d.get(k): err.append('manca ' + k)
    ids = set()
    # schede: 3 per abilità, campi completi e brevi
    for x in d.get('schede', []):
        w = 'scheda %s' % x.get('id')
        if x.get('id') in ids: err.append(w + ': id ripetuto')
        ids.add(x.get('id'))
        if x.get('ab') not in ab: err.append(w + ': abilità sconosciuta')
        for k, mx in (('tit', 8), ('princ', 45), ('es', 40), ('frase', 14), ('base', 50)):
            if not x.get(k): err.append(w + ': manca ' + k)
            elif parole(x[k]) > mx: err.append('%s: «%s» troppo lungo (%d parole, massimo %d)' % (w, k, parole(x[k]), mx))
        cu = x.get('curio') or {}
        for k, mx in (('tit', 9), ('fatto', 45), ('trad', 16)):
            if not cu.get(k): err.append('%s: manca curio.%s' % (w, k))
            elif parole(cu[k]) > mx: err.append('%s: curio.%s troppo lungo' % (w, k))
        ap = x.get('app') or {}
        if not ap: err.append(w + ': manca l\'approfondimento (app)')
        else: err += controlla_app(ap, w)
    if not d.get('intro_app'): err.append('manca intro_app')
    else: err += controlla_app(d['intro_app'], 'intro')
    for a in ab:
        n = sum(1 for x in d.get('schede', []) if x.get('ab') == a)
        if n < 3: err.append('abilità %s: servono almeno 3 schede (ce ne sono %d)' % (a, n))
    # sfide: per ogni abilità e livello almeno 3 situazioni diverse (servono 3 proposte al giorno senza ripetere)
    for x in d.get('sfide', []):
        w = 'sfida %s' % x.get('id')
        if x.get('id') in ids: err.append(w + ': id ripetuto')
        ids.add(x.get('id'))
        if x.get('ab') not in ab: err.append(w + ': abilità sconosciuta')
        if x.get('liv') not in LIVELLI: err.append(w + ': livello deve essere 1, 2 o 3')
        if x.get('sit') not in sit: err.append(w + ': situazione sconosciuta')
        if not x.get('t'): err.append(w + ': manca il testo')
        if not x.get('nome'): err.append(w + ': manca il nome in codice')
        if not x.get('bonus'): err.append(w + ': manca il bonus')
        elif parole(x['bonus']) > 22: err.append(w + ': bonus troppo lungo')
        elif parole(x['t']) > 28: err.append('%s: troppo lunga (%d parole, massimo 28)' % (w, parole(x['t'])))
    for a in ab:
        for l in LIVELLI:
            s = {x['sit'] for x in d.get('sfide', []) if x.get('ab') == a and x.get('liv') == l}
            if len(s) < 3: err.append('abilità %s, livello %d: servono sfide in almeno 3 situazioni (ce ne sono %d)' % (a, l, len(s)))
    sch = {x.get('id') for x in d.get('schede', [])} | {'intro'}
    if not d.get('intro_curio'): err.append('manca intro_curio')
    qi = set()
    for q in d.get('quiz', []):
        w = 'quiz %s' % q.get('id')
        if q.get('id') in qi: err.append(w + ': id ripetuto')
        qi.add(q.get('id'))
        op = q.get('op') or []
        if len(op) != 3: err.append(w + ': servono 3 risposte')
        if sum(1 for o in op if o.get('ok')) != 1: err.append(w + ': serve una e una sola risposta giusta')
        if any(not o.get('t') or not o.get('r') for o in op): err.append(w + ': ogni risposta vuole testo e commento')
        if q.get('sch') not in sch: err.append(w + ': scheda collegata sconosciuta')
    for c in d.get('frasi', []):
        if len(c.get('f', [])) < 4: err.append('frasi «%s»: servono almeno 4 frasi' % c.get('n'))
    if len(d.get('frasi', [])) < 4: err.append('servono almeno 4 gruppi di frasi di scorta')
    q = d.get('domande_idee', [])
    if len(q) < 5: err.append('servono almeno 5 idee di domande')
    testo = json.dumps(d, ensure_ascii=False)
    if VIETATE.search(testo): err.append('termine escluso dalla sezione: «%s»' % VIETATE.search(testo).group(0))
    return err


if __name__ == '__main__':
    e = controlla(sys.argv[1] if len(sys.argv) > 1 else 'sezioni/metodo_dati.json')
    print('✅ Metodo: contenuti in ordine' if not e else '❌\n- ' + '\n- '.join(e))
    sys.exit(1 if e else 0)
