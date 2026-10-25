"""Pianificazione: costruisce la cartella pubblicata (out/licenze/) dalle sorgenti.
- pagine/*.html: le sezioni; il segnaposto <!--@BARRA--> riceve la barra comune (comune/barra.html)
- statici/: file copiati così come sono
L'indirizzo pubblicato resta /mie-app/licenze/ (icona sulla Home e dati salvati non cambiano)."""
import os, shutil, sys, hashlib, re, glob, base64, json
D = os.path.dirname(os.path.abspath(__file__)) + '/'
OUT = D + 'out/licenze/'
KEEP_VERSION = '--stessa-versione' in sys.argv
os.makedirs(OUT, exist_ok=True)
for _f in os.listdir(OUT): os.remove(OUT + _f)
barra = open(D + 'comune/barra.html', encoding='utf-8').read()
blocco = open(D + 'comune/blocco.html', encoding='utf-8').read()
tema = open(D + 'comune/tema.css', encoding='utf-8').read()
NAV = [('index.html', '🏠 Pianificazione', 'pian'), ('licenze.html', '📅 Licenze', 'lic'), ('taichi.html', '🧘 Tai Chi', 'tc'), ('metodo.html', '🤝 Metodo', 'met'), ('progressi.html', '🐉 Progressi', 'prog')]
pages = {}
for p in sorted(glob.glob(D + 'pagine/*.html')):
    s = open(p, encoding='utf-8').read()
    assert s.count('<!--@BARRA-->') <= 1
    name = os.path.basename(p)
    app = [a for f, t, a in NAV if f == name][0]
    nav = ('<style id="tema">' + tema + '</style><script>document.body.setAttribute("data-app","%s")</script>' % app +
           '<nav class="appsw" aria-label="App">' + ''.join('<a data-a="%s"%s href="%s"%s>%s</a>' % (a, ' class="on"' if f == name else '', './' if f == 'index.html' else f, ' aria-current="page"' if f == name else '', t) for f, t, a in NAV) + '</nav>')
    assert s.count('<!--@NAV-->') == 1, name
    MIG = '<script>/* chiavi neutre dal 24/10/2026: spostamento una volta sola */try{[["v1","v1"],["hist-v1","hist-v1"],["in","in"]].forEach(function(x){var o=atob("cHJvZy12YWxlLQ==")+x[0],n="prog-mm-"+x[1],v=localStorage.getItem(o);if(v!=null){if(localStorage.getItem(n)==null)localStorage.setItem(n,v);if(localStorage.getItem(n)!=null)localStorage.removeItem(o);}});}catch(e){}</script>'
    pages[name] = s.replace('<!--@BARRA-->', barra).replace('<!--@NAV-->', MIG + blocco + nav)
    # sicurezza della pagina: niente risorse o invii verso altri siti (solo GitHub per le copie e i progressi), niente indicizzazione
    _csp = ('<meta http-equiv="Content-Security-Policy" content="default-src \'self\'; script-src \'self\' \'unsafe-inline\'; style-src \'self\' \'unsafe-inline\'; '
            'img-src \'self\' data: blob:; font-src \'self\' data:; media-src \'self\' data: blob:; connect-src \'self\' https://api.github.com https://gist.githubusercontent.com; '
            'worker-src \'self\'; object-src \'none\'; frame-src \'none\'; base-uri \'none\'; form-action \'none\'">'
            '<meta name="referrer" content="no-referrer">' + ('' if 'name="robots"' in pages[name] else '<meta name="robots" content="noindex, nofollow">'))
    assert pages[name].count('<meta charset="utf-8">') >= 1, name
    pages[name] = pages[name].replace('<meta charset="utf-8">', '<meta charset="utf-8">' + _csp, 1)
# dati delle Licenze (festivi, valori iniziali, rientro provvisorio): un'unica fonte, la pagina Licenze
_lic = pages['licenze.html']
_dati = '\n'.join(re.search(r'const %s=.*?;(?=\s*(?:const|let|function|/\*|\n))' % n, _lic, re.S).group(0) for n in ('HOL', 'DEF', 'PROV_START'))
_cena = re.search(r'const VCENA=\{.*?\]\]\};', pages['index.html'], re.S).group(0)
pages['progressi.html'] = pages['progressi.html'].replace('/*@VCENA*/', _cena)
# 🤝 Metodo: schede e sfide da sezioni/metodo_dati.json, controllate prima di pubblicare
sys.path.insert(0, D + 'strumenti'); import verifica_metodo
_err = verifica_metodo.controlla(D + 'sezioni/metodo_dati.json')
if _err: sys.exit('Metodo, contenuti da sistemare:\n- ' + '\n- '.join(_err))
_md = json.dumps(json.load(open(D + 'sezioni/metodo_dati.json', encoding='utf-8')), ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
assert pages['metodo.html'].count('/*@METODO_DATI*/null') == 1
pages['metodo.html'] = pages['metodo.html'].replace('/*@METODO_DATI*/null', _md)
pages['index.html'] = pages['index.html'].replace('/*@LICENZE_DATI*/', _dati).replace('/*@FOGLI*/', open(D + 'comune/fogli.js', encoding='utf-8').read()).replace('/*@CONTI*/', open(D + 'sezioni/conti.js', encoding='utf-8').read() + '\n' + open(D + 'sezioni/conti_stat.js', encoding='utf-8').read() + '\n' + open(D + 'sezioni/calendario.js', encoding='utf-8').read() + '\n' + open(D + 'sezioni/pratiche.js', encoding='utf-8').read() + '\n' + open(D + 'sezioni/pensione.js', encoding='utf-8').read() + '\n' + open(D + 'sezioni/investimenti.js', encoding='utf-8').read() + '\n/* domande del Diario del passaggio (sezioni/diario_domande.json) */\nconst DIA_D = ' + json.dumps(json.load(open(D + 'sezioni/diario_domande.json', encoding='utf-8')), ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/') + ';\n' + open(D + 'sezioni/diario.js', encoding='utf-8').read())
for f in os.listdir(D + 'statici'):
    shutil.copy(D + 'statici/' + f, OUT + f)
# versione: impronta di tutte le pagine (stessa in tutte, letta da version.json)
if KEEP_VERSION:
    ver = open(D + 'statici/version.json').read().split('"')[3]
else:
    h = hashlib.md5()
    for k in sorted(pages): h.update(re.sub(r'window\.APP_VERSION="[^"]*";window\.APP_BUILD="[^"]*";', '', pages[k]).encode())
    for f in sorted(os.listdir(D + 'statici')):
        if f not in ('version.json', 'sw.js', 'news-pensione.json', 'scheda-pensione.cifrata.json', 'occasioni-torino.json'): h.update(open(D + 'statici/' + f, 'rb').read())  # le novità cambiano ogni giorno senza cambiare versione
    ver = h.hexdigest()[:10]
    import datetime
    built = datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=2))).strftime('%Y-%m-%dT%H:%M+02:00')
    for k in pages: pages[k] = re.sub(r'window\.APP_VERSION="[^"]*";window\.APP_BUILD="[^"]*";', 'window.APP_VERSION="%s";window.APP_BUILD="%s";' % (ver, built), pages[k])
    open(OUT + 'version.json', 'w').write('{"v": "%s"}' % ver)
    sw = open(D + 'statici/sw.js').read()
    sw = re.sub(r'Versione [0-9a-f]+', 'Versione ' + ver, sw); sw = re.sub(r"const CACHE = 'licenze-[0-9a-f]+'", "const CACHE = 'licenze-%s'" % ver, sw)
    open(OUT + 'sw.js', 'w').write(sw)
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.join(_os.path.dirname(_os.path.abspath(__file__)), 'tools'))
from guardia import guarda  # impronte con chiave segreta: tools/guardia.py
REGOLE = [[1, 25, 0, "7a440b19774761cc", ""], [3, 18, 0, "0e9c77fc3ab2ff88", ""], [1, 20, 0, "50444ce7bde345f7", ""], [3, 8, 1, "ad4c034b05700f98", ""], [2, 16, 0, "f41f8aae3959f187", ""], [2, 11, 0, "36031939b7981b22", "5:0aac0c9185d356b4"], [1, 18, 1, "018b41f4b494f097", ""], [1, 17, 0, "a5718b2011b7a8e3", ""], [1, 9, 0, "25fb7f27c75d4966", ""], [1, 15, 0, "e4e60b703ba82745", "5:9bc587d2e6c9db47"], [1, 6, 1, "6bcfdddafdab492e", ""], [1, 26, 1, "46fca2cf0a7f9d6e", ""], [2, 23, 0, "2166ecc780095ce4", "5:9848fe10b0e4be6e"], [1, 8, 1, "8614ea5183e6f0ab", ""], [1, 13, 1, "eb79b0f71fe0332a", "3:eb68cfbfd0d40637"], [1, 24, 0, "57930224975c06e5", ""], [2, 10, 1, "9897127b60a9bf21", ""], [3, 21, 0, "1d2c1ad5207a93ee", ""], [2, 26, 0, "e12a21bfdf913ac2", ""], [1, 26, 0, "9c5a70ff67b10e4d", "4:4aafab3c4cc19941"], [2, 21, 1, "a60833659455f78b", ""], [3, 5, 0, "67affbf67e06a15f", ""], [2, 12, 0, "74beb0f0af1af84c", ""], [1, 4, 1, "6dbfc62546322ac6", ""], [2, 17, 0, "706b96c77388a905", "5:b4005abedb18cc31"], [1, 7, 0, "ef3adc62ab67e728", ""], [1, 20, 1, "8f4a33f5ce71240e", "5:a3491cde38157915"], [1, 16, 1, "4aebe1d9057fad1d", ""], [3, 15, 0, "f7722b3c6fdc9dec", ""], [2, 9, 1, "76a42889909c2c60", ""], [3, 12, 1, "310729a512a6e4e2", ""], [1, 26, 1, "0488d22334ba4ae3", ""], [1, 4, 1, "74a4a041e256319d", ""], [1, 4, 1, "f85c7d0bba1d9015", ""], [2, 13, 1, "1da03b654cdf8115", ""], [1, 4, 1, "cee06d995a56a537", ""], [1, 9, 0, "114db3c7cd1b4074", ""], [3, 20, 0, "97614423c4788744", ""], [1, 18, 1, "71b5a5191293b1b6", ""]]  # impronte con chiave segreta, mescolate a impronte casuali (tools/guardia.py)
for k, s in pages.items():
    if guarda(s, REGOLE): sys.exit('termine vietato in ' + k)
    open(OUT + k, 'w', encoding='utf-8').write(s)
# la scheda pensione entra nel sito solo cifrata: nessun file in chiaro fra gli statici
for f in os.listdir(OUT):
    if f.endswith('.json') and '"pianificazione-pensione"' in open(OUT + f, encoding='utf-8', errors='ignore').read(): sys.exit('scheda pensione in chiaro: ' + f)
print('ok', ver, sorted(pages))
