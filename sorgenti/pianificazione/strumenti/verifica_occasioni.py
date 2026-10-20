"""Controllo del file pubblico occasioni-torino.json (🤝 Metodo → 🤲 Volontariato).
Lo usa l'attività programmata prima di pubblicare: python3 verifica_occasioni.py FILE [FILE2]
(con due file controlla anche che siano identici). Deve dire ✅."""
import json, re, sys, datetime

VIETATE = re.compile(r'finanzier|guardia di finanza|\bgdf\b|militar|associazion[ei] d.arma|carabinier|caserm', re.I)
CAMPI = ('id', 'n', 'tipo', 'contatto', 'cosa', 'impegno', 'requisiti', 'primo', 'fonte', 'url', 'ctrl')
ABILITA = {'aprire', 'viva', 'vivo', 'calore'}


def controlla(path):
    err = []
    try:
        o = json.load(open(path, encoding='utf-8'))
    except Exception as e:
        return ['file non leggibile: %s' % e]
    oggi = datetime.date.today().isoformat()
    if o.get('app') != 'pianificazione-occasioni': err.append('campo app sbagliato')
    if not re.match(r'\d{4}-\d\d-\d\dT\d\d:\d\d', o.get('updated', '')): err.append('updated mancante o non in formato ISO')
    V = o.get('voci')
    if not isinstance(V, list) or not V: err.append('voci mancanti')
    V = V or []
    if len(V) > 20: err.append('troppe voci (massimo 20)')
    ids = set()
    for v in V:
        w = 'voce %s' % v.get('id')
        for k in CAMPI:
            if not v.get(k): err.append('%s: manca %s' % (w, k))
        if v.get('id') in ids: err.append(w + ': id ripetuto')
        ids.add(v.get('id'))
        if not str(v.get('url', '')).startswith('https://'): err.append(w + ': url deve essere https')
        if v.get('contatto') not in ('alto', 'medio'): err.append(w + ': contatto deve essere «alto» o «medio»')
        if not set(v.get('ab') or []) <= ABILITA: err.append(w + ': abilità sconosciuta')
        if str(v.get('ctrl', '')) > oggi: err.append(w + ': data del controllo nel futuro')
        if len(v.get('cosa', '')) > 400 or len(v.get('primo', '')) > 400: err.append(w + ': testo troppo lungo (massimo 400 caratteri)')
    A = o.get('annunci', [])
    if not isinstance(A, list): err.append('annunci deve essere un elenco')
    for a in (A if isinstance(A, list) else []):
        w = 'annuncio %s' % a.get('id')
        for k in ('id', 'n', 'cosa', 'fonte', 'url'):
            if not a.get(k): err.append('%s: manca %s' % (w, k))
        if not str(a.get('url', '')).startswith('https://'): err.append(w + ': url deve essere https')
    if isinstance(A, list) and len(A) > 15: err.append('troppi annunci (massimo 15)')
    t = json.dumps(o, ensure_ascii=False)
    m = VIETATE.search(t)
    if m: err.append('gruppi esclusi dalla sezione: «%s»' % m.group(0))
    if re.search(r'\b[A-Z]{6}\d\d[A-Z]\d\d[A-Z]\d{3}[A-Z]\b', t): err.append('sembra esserci un codice fiscale')
    return err


if __name__ == '__main__':
    fs = sys.argv[1:] or ['statici/occasioni-torino.json']
    e = []
    for f in fs: e += ['%s: %s' % (f, x) for x in controlla(f)]
    if len(fs) == 2 and open(fs[0], 'rb').read() != open(fs[1], 'rb').read(): e.append('i due file non sono identici')
    print('✅ Occasioni: file in ordine' if not e else '❌\n- ' + '\n- '.join(e))
    sys.exit(1 if e else 0)
