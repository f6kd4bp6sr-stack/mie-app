"""Pianificazione: costruisce la cartella pubblicata (out/licenze/) dalle sorgenti.
- pagine/*.html: le sezioni; il segnaposto <!--@BARRA--> riceve la barra comune (comune/barra.html)
- statici/: file copiati così come sono
L'indirizzo pubblicato resta /mie-app/licenze/ (icona sulla Home e dati salvati non cambiano)."""
import os, shutil, sys, hashlib, re, glob, base64
D = os.path.dirname(os.path.abspath(__file__)) + '/'
OUT = D + 'out/licenze/'
KEEP_VERSION = '--stessa-versione' in sys.argv
os.makedirs(OUT, exist_ok=True)
for _f in os.listdir(OUT): os.remove(OUT + _f)
barra = open(D + 'comune/barra.html', encoding='utf-8').read()
blocco = open(D + 'comune/blocco.html', encoding='utf-8').read()
tema = open(D + 'comune/tema.css', encoding='utf-8').read()
NAV = [('index.html', '🏠 Pianificazione', 'pian'), ('licenze.html', '📅 Licenze', 'lic'), ('taichi.html', '🧘 Tai Chi', 'tc'), ('progressi.html', '🐉 Progressi', 'prog')]
pages = {}
for p in sorted(glob.glob(D + 'pagine/*.html')):
    s = open(p, encoding='utf-8').read()
    assert s.count('<!--@BARRA-->') <= 1
    name = os.path.basename(p)
    app = [a for f, t, a in NAV if f == name][0]
    nav = ('<style id="tema">' + tema + '</style><script>document.body.setAttribute("data-app","%s")</script>' % app +
           '<nav class="appsw" aria-label="App">' + ''.join('<a data-a="%s"%s href="%s"%s>%s</a>' % (a, ' class="on"' if f == name else '', './' if f == 'index.html' else f, ' aria-current="page"' if f == name else '', t) for f, t, a in NAV) + '</nav>')
    assert s.count('<!--@NAV-->') == 1, name
    pages[name] = s.replace('<!--@BARRA-->', barra).replace('<!--@NAV-->', blocco + nav)
# dati delle Licenze (festivi, valori iniziali, rientro provvisorio): un'unica fonte, la pagina Licenze
_lic = pages['licenze.html']
_dati = '\n'.join(re.search(r'const %s=.*?;(?=\s*(?:const|let|function|/\*|\n))' % n, _lic, re.S).group(0) for n in ('HOL', 'DEF', 'PROV_START'))
_cena = re.search(r'const VCENA=\{.*?\]\]\};', pages['index.html'], re.S).group(0)
pages['progressi.html'] = pages['progressi.html'].replace('/*@VCENA*/', _cena)
pages['index.html'] = pages['index.html'].replace('/*@LICENZE_DATI*/', _dati).replace('/*@FOGLI*/', open(D + 'comune/fogli.js', encoding='utf-8').read()).replace('/*@CONTI*/', open(D + 'sezioni/conti.js', encoding='utf-8').read() + '\n' + open(D + 'sezioni/conti_stat.js', encoding='utf-8').read() + '\n' + open(D + 'sezioni/calendario.js', encoding='utf-8').read() + '\n' + open(D + 'sezioni/pratiche.js', encoding='utf-8').read() + '\n' + open(D + 'sezioni/pensione.js', encoding='utf-8').read())
for f in os.listdir(D + 'statici'):
    shutil.copy(D + 'statici/' + f, OUT + f)
# versione: impronta di tutte le pagine (stessa in tutte, letta da version.json)
if KEEP_VERSION:
    ver = open(D + 'statici/version.json').read().split('"')[3]
else:
    h = hashlib.md5()
    for k in sorted(pages): h.update(re.sub(r'window\.APP_VERSION="[^"]*";window\.APP_BUILD="[^"]*";', '', pages[k]).encode())
    for f in sorted(os.listdir(D + 'statici')):
        if f not in ('version.json', 'sw.js', 'news-pensione.json', 'scheda-pensione.cifrata.json'): h.update(open(D + 'statici/' + f, 'rb').read())  # le novità cambiano ogni giorno senza cambiare versione
    ver = h.hexdigest()[:10]
    import datetime
    built = datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=2))).strftime('%Y-%m-%dT%H:%M+02:00')
    for k in pages: pages[k] = re.sub(r'window\.APP_VERSION="[^"]*";window\.APP_BUILD="[^"]*";', 'window.APP_VERSION="%s";window.APP_BUILD="%s";' % (ver, built), pages[k])
    open(OUT + 'version.json', 'w').write('{"v": "%s"}' % ver)
    sw = open(D + 'statici/sw.js').read()
    sw = re.sub(r'Versione [0-9a-f]+', 'Versione ' + ver, sw); sw = re.sub(r"const CACHE = 'licenze-[0-9a-f]+'", "const CACHE = 'licenze-%s'" % ver, sw)
    open(OUT + 'sw.js', 'w').write(sw)
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
GUARD_SALUTE = [[1, 4, 1, "0965105e44659ce2", ""], [1, 9, 0, "1232ff47c6f9ef8f", ""], [3, 21, 0, "8ca88b76e83f722f", ""]]  # i tre termini controllati da sempre nel file pubblicato
for k, s in pages.items():
    if guarda(s, GUARD_SALUTE): sys.exit('termine vietato in ' + k)
    open(OUT + k, 'w', encoding='utf-8').write(s)
# la scheda pensione entra nel sito solo cifrata: nessun file in chiaro fra gli statici
for f in os.listdir(OUT):
    if f.endswith('.json') and '"pianificazione-pensione"' in open(OUT + f, encoding='utf-8', errors='ignore').read(): sys.exit('scheda pensione in chiaro: ' + f)
print('ok', ver, sorted(pages))
