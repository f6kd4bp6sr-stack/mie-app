"""Scheda pensione cifrata: il file pubblico che l'iPad scarica e unisce da solo.

Il file `scheda-pensione.cifrata.json` sta nel repository pubblico ma è cifrato (AES-256-GCM)
con una chiave casuale di 32 byte che NON è mai nel repository: sta sull'iPad del proprietario
(localStorage «pn-scheda-chiave») e nell'attività programmata. Senza chiave è illeggibile.

La chiave si passa solo con la variabile d'ambiente SCHEDA_CHIAVE (base64url) e non viene mai stampata.

  python3 scheda_cifrata.py apri  FILE.cifrata.json  CHIARO.json      # decifra (CHIARO fuori dal repository)
  python3 scheda_cifrata.py chiudi CHIARO.json FILE.cifrata.json [ALTRA_COPIA ...] --nota "che cosa è cambiato" [--fonte URL]
  python3 scheda_cifrata.py verifica FILE.cifrata.json [ALTRA_COPIA ...]
  python3 scheda_cifrata.py chiave                                     # crea una chiave nuova (solo la prima volta)

«chiudi» aumenta la revisione di 1, aggiunge la nota in pens.modifiche e scrive le copie identiche.
"""
import base64, json, os, subprocess, sys
from datetime import datetime, timezone, timedelta

try:
    from cryptography.hazmat.primitives.ciphers.aead import AESGCM
except ImportError:  # l'attività parte da un ambiente nuovo
    subprocess.run([sys.executable, '-m', 'pip', 'install', '-q', '--break-system-packages', 'cryptography'], check=True)
    from cryptography.hazmat.primitives.ciphers.aead import AESGCM

APP_OUT, APP_IN, AAD = 'pianificazione-scheda-cifrata', 'pianificazione-pensione', b'pianificazione-scheda-v1'
ARRAYS = ('adem', 'leve', 'cifre', 'incassi')
b64e = lambda b: base64.urlsafe_b64encode(b).decode().rstrip('=')
b64d = lambda s: base64.urlsafe_b64decode(s + '=' * (-len(s) % 4))


def ora():
    try:
        from zoneinfo import ZoneInfo
        return datetime.now(ZoneInfo('Europe/Rome')).isoformat(timespec='seconds')
    except Exception:
        return datetime.now(timezone(timedelta(hours=2))).isoformat(timespec='seconds')


def chiave():
    k = os.environ.get('SCHEDA_CHIAVE', '').strip()
    if not k:
        sys.exit('❌ manca la variabile SCHEDA_CHIAVE')
    raw = b64d(k)
    if len(raw) != 32:
        sys.exit('❌ SCHEDA_CHIAVE non è una chiave di 32 byte')
    return raw


def in_repo(path):
    d = os.path.dirname(os.path.abspath(path))
    while d and d != '/':
        if os.path.exists(os.path.join(d, '.git')):
            return True
        d = os.path.dirname(d)
    return False


def controlla(o):
    if o.get('app') != APP_IN or not isinstance(o.get('pens'), dict):
        sys.exit('❌ non è una scheda pensione')
    p = o['pens']
    for k in ARRAYS:
        if not isinstance(p.get(k), list) or not p[k]:
            sys.exit(f'❌ pens.{k} manca o è vuoto')
        ids = [x.get('id') for x in p[k]]
        if None in ids or len(ids) != len(set(ids)):
            sys.exit(f'❌ pens.{k}: id mancanti o doppi')
    for a in p['adem']:
        d = a.get('d', '')
        if d and not (len(d) == 10 and d[4] == '-' and d[7] == '-'):
            sys.exit(f'❌ data non valida in {a.get("id")}: {d}')


def apri(path):
    o = json.load(open(path, encoding='utf-8'))
    if o.get('app') != APP_OUT:
        sys.exit(f'❌ {path} non è la scheda cifrata')
    try:
        txt = AESGCM(chiave()).decrypt(b64d(o['iv']), b64d(o['ct']), AAD)
    except Exception:
        sys.exit('❌ la chiave non apre la scheda')
    s = json.loads(txt.decode('utf-8'))
    if s.get('v') != o.get('rev'):
        sys.exit('❌ la revisione interna non coincide con quella del file')
    return o, s


def main(a):
    if not a:
        sys.exit(__doc__)
    cmd = a[0]
    if cmd == 'chiave':
        print(b64e(os.urandom(32)))
        return
    if cmd == 'apri':
        src, dst = a[1], a[2]
        if in_repo(dst):
            sys.exit('❌ la scheda in chiaro non va mai dentro un repository: scegli una cartella temporanea')
        _, s = apri(src)
        json.dump(s, open(dst, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
        print(f'✅ rev. {s["v"]} aperta in {dst}')
        return
    if cmd == 'chiudi':
        nota, fonte, files, i = '', '', [], 1
        while i < len(a):
            if a[i] == '--nota': nota = a[i + 1]; i += 2
            elif a[i] == '--fonte': fonte = a[i + 1]; i += 2
            else: files.append(a[i]); i += 1
        src, outs = files[0], files[1:]
        if not outs or not nota:
            sys.exit('❌ servono almeno un file cifrato di uscita e --nota')
        s = json.load(open(src, encoding='utf-8'))
        controlla(s)
        rev = int(s.get('v') or 0)
        for f in outs:  # la revisione riparte da quella pubblicata più alta
            if os.path.exists(f):
                try: rev = max(rev, int(json.load(open(f, encoding='utf-8')).get('rev') or 0))
                except Exception: pass
        rev += 1
        t = ora()
        s['v'] = rev
        s['agg'] = t
        p = s['pens']
        m = p.get('modifiche') if isinstance(p.get('modifiche'), list) else []
        m.append({k: v for k, v in (('rev', rev), ('at', t), ('t', nota[:300]), ('fonte', fonte)) if v})
        p['modifiche'] = m[-30:]
        iv = os.urandom(12)
        ct = AESGCM(chiave()).encrypt(iv, json.dumps(s, ensure_ascii=False, separators=(',', ':')).encode('utf-8'), AAD)
        out = {'app': APP_OUT, 'rev': rev, 'updated': t, 'alg': 'AES-256-GCM', 'iv': b64e(iv), 'ct': b64e(ct)}
        txt = json.dumps(out, ensure_ascii=False, indent=1) + '\n'
        for f in outs:
            os.makedirs(os.path.dirname(os.path.abspath(f)), exist_ok=True)
            open(f, 'w', encoding='utf-8').write(txt)
        print(f'✅ scheda cifrata rev. {rev} scritta in {len(outs)} copie')
        return
    if cmd == 'verifica':
        files = a[1:]
        txts = [open(f, encoding='utf-8').read() for f in files]
        if len(set(txts)) != 1:
            sys.exit('❌ le copie della scheda cifrata non sono identiche')
        o, s = apri(files[0])
        controlla(s)
        print(f'✅ scheda cifrata rev. {o["rev"]} ({o["updated"]}): si apre ed è valida')
        return
    sys.exit(__doc__)


if __name__ == '__main__':
    main(sys.argv[1:])
