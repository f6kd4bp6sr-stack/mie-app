"""Controllo dei contenuti di 🤖 Cultura digitale.
- sezioni/cultura_dati.json: le schede a livelli. Il controllo parte da solo a ogni build e, con un errore, il build si ferma.
- statici/cultura-novita.json: le novità del mese, aggiornate dall'attività programmata.
Uso a mano:
  python3 strumenti/verifica_cultura.py sezioni/cultura_dati.json
  python3 strumenti/verifica_cultura.py --novita statici/cultura-novita.json [licenze/cultura-novita.json]"""
import json, re, sys
from datetime import date

TEMI = ('basi', 'usi', 'prudenza', 'bimba')
# parole che non devono comparire nei testi pubblici
VIETATE = re.compile(r'finanzier|guardia di finanza|\bgdf\b|caserm|codice fiscale:\s*\w|iban:\s*\w', re.I)
# nelle richieste da copiare i dati veri non ci vanno: solo segnaposto tra [parentesi quadre]
DATI = re.compile(r'\b[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]\b|\bIT\d{2}[A-Z]\d{10}|\b\d{3}[ .]?\d{3}[ .]?\d{4}\b|@[a-z0-9-]+\.[a-z]{2,}')


def parole(s):
    return len(re.findall(r"\S+", s or ''))


def _fonti(fo, w, err, serve):
    if serve and not fo:
        err.append(w + ': servono le fonti')
    for f in fo or []:
        if not f.get('c'):
            err.append(w + ': fonte senza nome')
        if not re.search(r'\(\d{4}\)|\(s\.d\.\)', f.get('c', '')):
            err.append(w + ': fonte senza anno: ' + f.get('c', '')[:50])
        if not str(f.get('url', '')).startswith('https://'):
            err.append(w + ': fonte senza link https: ' + f.get('c', '')[:50])


def controlla(path):
    err = []
    try:
        d = json.load(open(path, encoding='utf-8'))
    except Exception as e:
        return ['file non leggibile: %s' % e]
    if tuple(sorted(d.get('temi', {}))) != tuple(sorted(TEMI)):
        err.append('temi: servono esattamente ' + ', '.join(TEMI))
    S = d.get('schede') or []
    ids, qids = set(), set()
    per = {1: 0, 2: 0, 3: 0}
    for s in S:
        w = 'scheda ' + str(s.get('id'))
        if not re.fullmatch(r'[a-z0-9-]{3,30}', str(s.get('id', ''))):
            err.append(w + ': id non valido')
        if s.get('id') in ids:
            err.append(w + ': id doppio')
        ids.add(s.get('id'))
        if s.get('liv') not in (1, 2, 3):
            err.append(w + ': «liv» deve essere 1, 2 o 3')
        else:
            per[s['liv']] += 1
        if s.get('tema') not in TEMI:
            err.append(w + ': tema sconosciuto')
        if not s.get('ic') or not s.get('t'):
            err.append(w + ': mancano icona o titolo')
        if parole(s.get('t')) > 9:
            err.append(w + ': titolo troppo lungo')
        T = s.get('testo') or []
        if not 2 <= len(T) <= 4:
            err.append(w + ': «testo» deve avere da 2 a 4 paragrafi')
        for p in T:
            if parole(p) > 50:
                err.append('%s: paragrafo troppo lungo (%d parole, massimo 50)' % (w, parole(p)))
        P = s.get('punti') or []
        if not 2 <= len(P) <= 5:
            err.append(w + ': «punti» deve avere da 2 a 5 righe')
        for p in P:
            if parole(p) > 20:
                err.append(w + ': un punto è troppo lungo (massimo 20 parole)')
        pr = s.get('prova')
        if pr is not None:
            if not pr.get('t') or not pr.get('prompt') or not pr.get('guarda'):
                err.append(w + ': «prova» deve avere t, prompt e guarda')
            if parole(pr.get('prompt')) > 130:
                err.append(w + ': prompt troppo lungo (massimo 130 parole)')
            if parole(pr.get('guarda')) > 40:
                err.append(w + ': «guarda» troppo lungo')
            if DATI.search(pr.get('prompt', '')):
                err.append(w + ': nel prompt sembra esserci un dato personale vero: usa un [segnaposto]')
        Q = s.get('quiz') or []
        if len(Q) != 3:
            err.append(w + ': servono 3 domande di quiz')
        for q in Q:
            qw = w + ' quiz ' + str(q.get('id'))
            if not q.get('id') or q.get('id') in qids:
                err.append(qw + ': id mancante o doppio')
            qids.add(q.get('id'))
            if not q.get('q') or not q.get('ok') or len(q.get('wrong') or []) != 2:
                err.append(qw + ': servono q, ok e 2 sbagliate')
            if q.get('ok') in (q.get('wrong') or []):
                err.append(qw + ': la giusta è anche tra le sbagliate')
            if not q.get('e') or parole(q.get('e')) > 40:
                err.append(qw + ': spiegazione mancante o troppo lunga (massimo 40 parole)')
        serve = s.get('tema') in ('prudenza', 'bimba') or s.get('liv') == 3 or bool(re.search(r'\b(19|20)\d{2}\b|legge|regolamento|art\.', ' '.join(T + P), re.I))
        _fonti(s.get('fonti'), w, err, serve)
        tutto = json.dumps(s, ensure_ascii=False)
        if VIETATE.search(tutto):
            err.append(w + ': contiene una parola da non pubblicare')
    if per[1] < 6 or per[2] < 5 or per[3] < 4:
        err.append('servono almeno 6 schede di livello 1, 5 di livello 2 e 4 di livello 3 (ora %s)' % per)
    return err


def controlla_novita(path):
    err = []
    try:
        d = json.load(open(path, encoding='utf-8'))
    except Exception as e:
        return ['file non leggibile: %s' % e]
    if d.get('app') != 'cultura-digitale':
        err.append('«app» deve essere «cultura-digitale»')
    if not re.match(r'\d{4}-\d{2}-\d{2}T\d{2}:\d{2}', str(d.get('updated', ''))):
        err.append('«updated» mancante')
    V = d.get('voci') or []
    if len(V) > 24:
        err.append('massimo 24 voci')
    ids = set()
    oggi = date.today().isoformat()
    for v in V:
        w = 'novità ' + str(v.get('id'))
        if not v.get('id') or v['id'] in ids:
            err.append(w + ': id mancante o doppio')
        ids.add(v.get('id'))
        if not re.fullmatch(r'\d{4}-\d{2}-\d{2}', str(v.get('d', ''))) or v.get('d', '') > oggi:
            err.append(w + ': data mancante o nel futuro')
        if v.get('tema') not in TEMI:
            err.append(w + ': tema sconosciuto')
        if not v.get('t') or parole(v.get('t')) > 16:
            err.append(w + ': titolo mancante o troppo lungo')
        if not v.get('s') or parole(v.get('s')) > 55:
            err.append(w + ': sintesi mancante o troppo lunga (massimo 55 parole)')
        if not v.get('perche') or parole(v.get('perche')) > 35:
            err.append(w + ': «perche» mancante o troppo lungo')
        if not v.get('fonte') or not str(v.get('url', '')).startswith('https://'):
            err.append(w + ': fonte o link https mancante')
        if VIETATE.search(json.dumps(v, ensure_ascii=False)):
            err.append(w + ': contiene una parola da non pubblicare')
    if not isinstance(d.get('controlli'), list) or not d['controlli']:
        err.append('«controlli» mancante')
    return err


if __name__ == '__main__':
    a = sys.argv[1:]
    if a and a[0] == '--novita':
        files = a[1:]
        E = [f + ': ' + e for f in files for e in controlla_novita(f)]
        if len(files) == 2 and not E and open(files[0], encoding='utf-8').read() != open(files[1], encoding='utf-8').read():
            E.append('le due copie non sono uguali')
    else:
        E = controlla(a[0] if a else 'sezioni/cultura_dati.json')
    print('\n'.join('❌ ' + e for e in E) if E else '✅ tutto a posto')
    sys.exit(1 if E else 0)
