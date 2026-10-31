"""Controlla stampa-oggi.json (🗞️ Stampa di oggi: notizie principali, generali e di Torino) prima di pubblicarlo.
Uso: python3 strumenti/verifica_stampa.py <file.json> [<seconda copia>]
Esce con errore se: formato sbagliato, edizione o date non valide, notizie senza fonte o senza link https,
testi troppo lunghi (i testi sono SINTESI con parole nostre, mai articoli copiati), doppioni, termini personali,
o se le due copie non sono identiche."""
import json, os, re, sys, datetime
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'tools'))
from guardia import guarda  # impronte dei dati da non pubblicare, con chiave segreta (tools/guardia.py)

SEZ = {'italia': (3, 8), 'mondo': (3, 8), 'estero': (0, 6), 'economia': (1, 5), 'torino': (3, 8), 'cultura': (0, 4), 'sport': (0, 4)}
# lingua dell'articolo originale (per le testate estere): l'app offre «leggi tradotto»
LINGUE = {'it', 'en', 'fr', 'es', 'de', 'pt', 'nl', 'ar', 'zh', 'ja', 'ru', 'uk', 'pl'}
# stesse impronte usate per le novità della Pensione
_src = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'verifica_novita.py'), encoding='utf-8').read()
REGOLE = json.loads(re.search(r'^REGOLE = (\[.*?\])\s*#', _src, re.M).group(1))


def parole(s):
    return len(re.findall(r'\S+', s or ''))


def controlla(o):
    E = []
    if o.get('app') != 'stampa-oggi':
        E.append('«app» deve essere «stampa-oggi»')
    if o.get('edizione') not in ('mattina', 'sera'):
        E.append('«edizione» deve essere «mattina» o «sera»')
    up = str(o.get('updated', ''))
    if not re.match(r'^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}', up):
        E.append('«updated» mancante')
    elif up[:10] > (datetime.date.today() + datetime.timedelta(days=1)).isoformat():
        E.append('«updated» nel futuro')
    S = o.get('sezioni')
    if not isinstance(S, dict) or set(S) - set(SEZ):
        E.append('«sezioni» mancante o con nomi sconosciuti (ammessi: %s)' % ', '.join(SEZ))
        return E
    ids, urls = set(), set()
    for k, (mn, mx) in SEZ.items():
        L = S.get(k) or []
        if not mn <= len(L) <= mx:
            E.append('%s: servono da %d a %d notizie (ora %d)' % (k, mn, mx, len(L)))
        for n in L:
            w = k + ' ' + str(n.get('id'))
            if not n.get('id') or n['id'] in ids:
                E.append(w + ': id mancante o doppio')
            ids.add(n.get('id'))
            if not n.get('t') or parole(n['t']) > 16:
                E.append(w + ': titolo mancante o troppo lungo (massimo 16 parole)')
            if not n.get('s') or parole(n['s']) > 60:
                E.append(w + ': sintesi mancante o troppo lunga (massimo 60 parole)')
            if n.get('d') and (not re.match(r'^\d{4}-\d{2}-\d{2}$', n['d']) or n['d'] > up[:10]):
                E.append(w + ': data non valida')
            F = n.get('fonti') or []
            if not F:
                E.append(w + ': serve almeno una fonte')
            for f in F + (n.get('link') or []):
                if not f.get('n') or not str(f.get('url', '')).startswith('https://'):
                    E.append(w + ': fonte o link senza nome o senza https')
            for f in F:
                if f.get('l', 'it') not in LINGUE:
                    E.append(w + ': lingua della fonte sconosciuta: ' + str(f.get('l')))
                if f.get('url') in urls:
                    E.append(w + ': stesso articolo usato per due notizie')
                urls.add(f.get('url'))
            if len(n.get('link') or []) > 3:
                E.append(w + ': massimo 3 link di approfondimento')
            # niente citazioni lunghe: le sintesi sono scritte con parole nostre
            if any(len(a or b) > 120 for a, b in re.findall(r'«([^»]*)»|"([^"]*)"', n.get('s', ''))):
                E.append(w + ': citazione troppo lunga nella sintesi')
    est = S.get('estero') or []
    if est and any(all(f.get('l', 'it') == 'it' for f in n.get('fonti') or []) for n in est):
        E.append('estero: ogni notizia deve avere almeno una fonte estera (campo «l» diverso da «it»)')
    if not isinstance(o.get('controlli'), list) or not o['controlli']:
        E.append('«controlli» mancante')
    if guarda(json.dumps(o, ensure_ascii=False), REGOLE, obbligatoria=False):
        E.append('contiene un dato da non pubblicare')
    return E


if __name__ == '__main__':
    files = sys.argv[1:] or ['statici/stampa-oggi.json']
    E = []
    for f in files:
        try:
            E += [f + ': ' + e for e in controlla(json.load(open(f, encoding='utf-8')))]
        except Exception as e:
            E.append(f + ': file non leggibile (%s)' % e)
    if len(files) == 2 and not E and open(files[0], encoding='utf-8').read() != open(files[1], encoding='utf-8').read():
        E.append('le due copie non sono uguali')
    print('\n'.join('❌ ' + e for e in E) if E else '✅ tutto a posto')
    sys.exit(1 if E else 0)
