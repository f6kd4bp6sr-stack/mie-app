"""Controllo dei contenuti di 🤝 Metodo (sezioni/metodo_dati.json): parte da solo a ogni build.
Con un errore il build si ferma. Uso a mano: python3 strumenti/verifica_metodo.py sezioni/metodo_dati.json"""
import json, re, sys

LIVELLI = (1, 2, 3)
SITUAZIONI_BASE = ('nuove', 'colleghi', 'famiglia', 'gruppi')
# parole che non devono comparire nei testi pubblici (gruppi esclusi dalla sezione)
VIETATE = re.compile(r'finanzier|guardia di finanza|\bgdf\b|militar|associazion[ei] d.arma|caserm', re.I)


def parole(s):
    return len(re.findall(r"\S+", s or ''))


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
        elif parole(x['t']) > 28: err.append('%s: troppo lunga (%d parole, massimo 28)' % (w, parole(x['t'])))
    for a in ab:
        for l in LIVELLI:
            s = {x['sit'] for x in d.get('sfide', []) if x.get('ab') == a and x.get('liv') == l}
            if len(s) < 3: err.append('abilità %s, livello %d: servono sfide in almeno 3 situazioni (ce ne sono %d)' % (a, l, len(s)))
    q = d.get('domande_idee', [])
    if len(q) < 5: err.append('servono almeno 5 idee di domande')
    testo = json.dumps(d, ensure_ascii=False)
    if VIETATE.search(testo): err.append('termine escluso dalla sezione: «%s»' % VIETATE.search(testo).group(0))
    return err


if __name__ == '__main__':
    e = controlla(sys.argv[1] if len(sys.argv) > 1 else 'sezioni/metodo_dati.json')
    print('✅ Metodo: contenuti in ordine' if not e else '❌\n- ' + '\n- '.join(e))
    sys.exit(1 if e else 0)
