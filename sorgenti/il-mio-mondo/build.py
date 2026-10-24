import re, base64, sys, os
D=os.path.dirname(os.path.abspath(__file__))+'/'
os.makedirs(D+'data/_gen', exist_ok=True)
# ---------- controllo automatico dei contenuti: con errori non si pubblica niente ----------
sys.path.insert(0, D+'tools'); import controlla
_e, _w, _g, _n = controlla.run()
if _e:
    print('CONTROLLO FALLITO:'); [print(' ', x) for x in _e[:50]]; sys.exit(1)
print('controllo ok:', _n, 'domande,', len(_w), 'avvisi,', len(_g), 'temi da rinforzare (data/_gen/rapporto.md)')

# ---------- correzioni dei revisori (rev2/fix_*.json) ----------
import glob, json as _json
_fx = {}
for _f in sorted(glob.glob(D+'data/verifiche/rev2/fix_*.json')) + sorted(glob.glob(D+'data/verifiche/rev3/fix_*.json')):
    _fx.setdefault(_f.split('fix_')[1][:-5], []).extend(_json.load(open(_f, encoding='utf-8')))
_ff = {}
for _f in sorted(glob.glob(D+'data/verifiche/rev3/factfix_*.json')):
    _l = _json.load(open(_f, encoding='utf-8'))
    if _l: _ff[_f.split('factfix_')[1][:-5]] = _l
# le correzioni delle domande sono già dentro data/domande/quiz/*.json: restano solo barzellette e curiosità
_fx = {k: v for k, v in _fx.items() if k == 'jokes'}
open(D+'data/_gen/fixes.js','w',encoding='utf-8').write('const FIXES = ' + _json.dumps(_fx, ensure_ascii=False) + ';\nconst FACTFIXES = ' + _json.dumps(_ff, ensure_ascii=False) + ';\n' + open(D+'js/core/fixes_apply.js',encoding='utf-8').read())
_cur = {}
for _f in sorted(glob.glob(D+'data/verifiche/rev4/cur_*.json')):
    _cur[_f.split('cur_')[1][:-5]] = _json.load(open(_f, encoding='utf-8'))
open(D+'data/_gen/cur.js','w',encoding='utf-8').write('/* figurine della curiosità (verificate, fonti in rev4) */\nconst CURIOSITA = ' + _json.dumps(_cur, ensure_ascii=False) + ';\n')
_quiz = {}
for _f in sorted(glob.glob(D+'data/domande/quiz/*.json')):
    _quiz[_f.split('/')[-1][:-5]] = _json.load(open(_f, encoding='utf-8'))
_lex = sorted({w for _L in _quiz.values() for _x in _L for _p in _x.get('en', []) for w in re.findall(r"[a-z']+", _p.lower().replace('’', "'"))})
open(D+'data/_gen/quiz.js','w',encoding='utf-8').write('/* domande: generato da data/domande/quiz/*.json */\nconst QUIZ = ' + _json.dumps(_quiz, ensure_ascii=False, separators=(',', ':')) + ';\n/* argomenti di ogni materia (data/domande/argomenti.json): [id, nome, icona] */\nconst ARGOMENTI = ' + _json.dumps(_json.load(open(D+'data/domande/argomenti.json', encoding='utf-8')), ensure_ascii=False, separators=(',', ':')) + ';\n/* cartine interattive (data/cartine/<id>.json) */\nconst CARTINE = ' + _json.dumps({_f.split('/')[-1][:-5]: _json.load(open(_f, encoding='utf-8')) for _f in sorted(glob.glob(D+'data/cartine/*.json'))}, ensure_ascii=False, separators=(',', ':')) + ';\n/* spiegazioni con racconto e mappa (data/spiegazioni/<materia>.json) */\nconst SPIEGA = ' + _json.dumps({_f.split('/')[-1][:-5]: _json.load(open(_f, encoding='utf-8')) for _f in sorted(glob.glob(D+'data/spiegazioni/*.json'))}, ensure_ascii=False, separators=(',', ':')) + ';\n/* parole inglesi conosciute (dai campi «en»): per leggere in inglese le parti tra «» */\nconst EN_LEX = new Set(' + _json.dumps(_lex) + ');\n')
css=''.join(open(D+'css/'+f+'.css',encoding='utf-8').read() for f in ['base','components','pages','themes','festa','disegno','spiega'])
body=open(D+'body.html',encoding='utf-8').read()
# ordine di caricamento: librerie, base, sezioni, contenuti, percorso, guscio dell'app
js=''.join(open(D+f,encoding='utf-8').read()+'\n' for f in 
  ['js/lib/qrcode.js',
  'js/core/core.js',
  'js/core/migra.js',
  'js/sezioni/routine.js',
  'js/sezioni/games.js',
  'js/sezioni/math.js',
  'js/sezioni/science.js',
  'js/sezioni/girl.js',
  'js/sezioni/sport.js',
  'js/sezioni/scopri.js',
  'js/sezioni/content.js',
  'data/domande/helpers.js',
  'data/domande/bank4.js',
  'data/domande/gen/i_media_jokes.js',
  'data/domande/gen/j_jokes2.js',
  'data/domande/roblox.js',
  'data/domande/roblox2.js',
  'data/domande/soldi.js',
  'data/domande/vesto.js',
  'data/domande/lavo.js',
  'data/domande/motoria.js',
  'data/domande/religione.js',
  'data/_gen/fixes.js',
  'data/domande/explain.js',
  'data/_gen/quiz.js',
  'js/core/quiz_load.js',
  'js/sezioni/cards.js',
  'js/sezioni/clock.js',
  'js/sezioni/diario.js',
  'js/sezioni/vita.js',
  'data/domande/teatro.js',
  'js/sezioni/teatro.js',
  'data/domande/disegno.js',
  'js/sezioni/disegno.js',
  'js/core/cloud.js',
  'js/core/look.js',
  'js/core/mic.js',
  'js/core/music.js',
  'js/core/prog.js',
  'js/percorso/percorso.js',
  'js/percorso/mate5.js',
  'js/percorso/shop.js',
  'data/_gen/cur.js',
  'js/percorso/collect.js',
  'js/core/shell.js',
  'js/sezioni/spiega.js',
  'js/sezioni/cartina.js',
  'js/sezioni/classe.js',
  'js/core/notify.js',
  'js/sezioni/festa.js',
  'data/domande/vids.js',
  'js/percorso/video.js',
  'js/core/bg.js',
  'js/core/boot.js']
)
js=js.replace('/*SUBJECTS*/',open(D+'data/testi/_subjects.txt',encoding='utf-8').read())
js=js.replace('/*STEPS*/',open(D+'data/testi/_steps.txt',encoding='utf-8').read())
js=js.replace('/*POWERS*/',open(D+'data/testi/_powers.txt',encoding='utf-8').read())
# caratteri incorporati (licenza OFL, nessuna richiesta a server esterni)
_ff=lambda fam,fn: '@font-face{font-family:"%s";src:url(data:font/woff;base64,%s) format("woff");font-weight:600 800;font-style:normal;font-display:swap}' % (fam, base64.b64encode(open(D+'assets/fonts/'+fn,'rb').read()).decode())
font='<style>'+_ff('Baloo 2','baloo.woff')+_ff('Nunito','nunito.woff')+'</style>'
title='<title>Il mio mondo</title>'
# protezione: nessuna connessione verso altri siti, niente indicizzazione nei motori di ricerca
csp=('<meta http-equiv="Content-Security-Policy" content="default-src \'self\'; script-src \'self\' \'unsafe-inline\' https://f6kd4bp6sr-stack.github.io; style-src \'self\' \'unsafe-inline\'; '
     'img-src \'self\' data: blob: https://i.ytimg.com; font-src \'self\' data:; media-src \'self\' data: blob:; connect-src \'self\' https://api.github.com; worker-src \'self\'; manifest-src \'self\'; '
     'object-src \'none\'; base-uri \'none\'; form-action \'none\'; frame-src https://www.youtube-nocookie.com">\n'
     '<meta name="robots" content="noindex, nofollow, noarchive">\n<meta name="referrer" content="no-referrer">\n')
art=title+'\n<style>\n'+css+'\n</style>\n'+font+'\n'+body+'\n<script>\n'+js+'\n</script>\n'
open('/home/claude/mondo-artifact.html','w',encoding='utf-8').write(art)
# versione iPad
icon='''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4bc0a8"/><stop offset=".5" stop-color="#5aa9ff"/><stop offset="1" stop-color="#a879ff"/></linearGradient></defs><rect width="180" height="180" rx="40" fill="url(#g)"/><circle cx="90" cy="84" r="46" fill="#4bc0a8" stroke="#33304a" stroke-width="5"/><ellipse cx="90" cy="102" rx="24" ry="15" fill="#bff0e2"/><circle cx="72" cy="76" r="12" fill="#fff" stroke="#33304a" stroke-width="3"/><circle cx="108" cy="76" r="12" fill="#fff" stroke="#33304a" stroke-width="3"/><circle cx="74" cy="78" r="6" fill="#33304a"/><circle cx="110" cy="78" r="6" fill="#33304a"/><path d="M80 112 Q90 120 100 112" fill="none" stroke="#33304a" stroke-width="4" stroke-linecap="round"/><path d="M66 44 L60 20 L80 38 Z M114 44 L120 20 L100 38 Z" fill="#bff0e2" stroke="#33304a" stroke-width="4" stroke-linejoin="round"/><path d="M130 150 l6 14 l14 6 l-14 6 l-6 14 l-6 -14 l-14 -6 l14 -6z" fill="#ffd23f" transform="translate(-8 -40) scale(.9)"/></svg>'''
uri='data:image/svg+xml;base64,'+base64.b64encode(icon.encode()).decode()
head=('<!doctype html>\n<html lang="it">\n<head>\n<meta charset="utf-8">\n'
 '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'+csp+title+'\n'
 '<meta name="apple-mobile-web-app-capable" content="yes">\n<meta name="mobile-web-app-capable" content="yes">\n'
 '<meta name="apple-mobile-web-app-status-bar-style" content="default">\n<meta name="apple-mobile-web-app-title" content="Il mio mondo">\n'
 '<meta name="theme-color" content="#fff8ec">\n<link rel="apple-touch-icon" href="'+uri+'">\n<link rel="icon" href="'+uri+'">\n'
 '<style>*,*::before,*::after{box-sizing:border-box}html{color-scheme:light}:root{padding-top:env(safe-area-inset-top,0px)}html,body{margin:0}body{-webkit-text-size-adjust:100%}img{max-width:100%}</style>\n')
full=head+'<style>\n'+css+'\n</style>\n'+font+'\n</head>\n<body>\n'+body+'\n<script>\n'+js+'\n</script>\n</body>\n</html>\n'
open('/home/claude/mondo-ipad.html','w',encoding='utf-8').write(full)
open(D+'data/_gen/_all.js','w',encoding='utf-8').write(js)
print(len(art), len(full))

# ---------- Pacchetto app installabile (PWA) ----------
import os, json
P='/home/claude/mondo-out/'
os.makedirs(P, exist_ok=True)
open(P+'icon.svg','w').write(icon)
pwa_head = ('<link rel="manifest" href="manifest.webmanifest">\n<link rel="apple-touch-icon" href="icon-180.png">\n')
pwa_sw = ("<script>/* aggiornamento automatico e silenzioso */\n"
 "if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {\n"
 "  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').then(reg => {\n"
 "    const check = () => { reg.update().catch(() => {}); fetch('version.json', { cache: 'no-store' }).then(r => r.json()).then(v => {\n"
 "      if (v && v.v && v.v !== window.APP_VERSION && document.getElementById('modal').hidden && !document.querySelector('#move:not([hidden])') && !document.querySelector('#lesson:not([hidden])')) (typeof saveAllNow === 'function' ? saveAllNow() : Promise.resolve()).catch(() => {}).then(() => location.reload());\n"
 "    }).catch(() => {}); };\n"
 "    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') check(); });\n"
 "    setInterval(check, 30 * 60 * 1000);\n"
 "  }).catch(() => {}));\n"
 "}</script>\n")
import hashlib
ver = hashlib.md5(full.encode()).hexdigest()[:10]
idx = full.replace('<link rel="apple-touch-icon" href="'+uri+'">\n', pwa_head).replace('</body>', pwa_sw+'<script>/* collegamento genitori: sempre la versione più recente */(function(){if(document.querySelector("script[data-msync]"))return;var s=document.createElement("script");s.dataset.msync=1;s.src="licenze/mondo-sync.js?t="+Date.now();s.defer=true;document.head.appendChild(s);})();</script>\n</body>').replace('<meta charset="utf-8">', '<meta charset="utf-8">\n<script>window.APP_VERSION="'+ver+'";</script>', 1)
import shutil; shutil.copyfile(D+'docs/LEGGIMI.html', P+'LEGGIMI.html')  # guida: la fonte è docs/LEGGIMI.html
open(P+'version.json','w').write('{"v": "'+ver+'"}')
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.join(_os.path.dirname(_os.path.abspath(__file__)), 'tools'))
from guardia import guarda  # impronte con chiave segreta: tools/guardia.py
# tutte le regole: quelle del controllo dei contenuti (tools/controlla.py) e quelle delle sorgenti pubbliche (tools/sorgenti_pubbliche.py)
_g = lambda f, n: eval(re.search('^' + n + r' = (\[\[.*?\]\])', open(D + 'tools/' + f, encoding='utf-8').read(), re.M).group(1))
REGOLE = _g('controlla.py', 'REGOLE') + _g('sorgenti_pubbliche.py', 'REGOLE')
if guarda(idx, REGOLE): print('TERMINE VIETATO nel file pubblicato: stop'); sys.exit(1)
open(P+'index.html','w',encoding='utf-8').write(idx)
open(P+'manifest.webmanifest','w').write(json.dumps({
  "name": "Il mio mondo", "short_name": "Il mio mondo", "start_url": "./", "scope": "./",
  "display": "standalone", "background_color": "#fff8ec", "theme_color": "#fff8ec", "lang": "it",
  "icons": [{"src": "icon-192.png", "sizes": "192x192", "type": "image/png"}, {"src": "icon-512.png", "sizes": "512x512", "type": "image/png"}, {"src": "icon.svg", "sizes": "any", "type": "image/svg+xml"}]
}, ensure_ascii=False, indent=1))
import hashlib
open(P+'sw.js','w').write('''// Il mio mondo: funziona anche senza internet. Versione %s
const CACHE = 'mondo-%s';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon-180.png', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
const SCOPE = new URL(self.registration.scope).pathname;
// tiene solo la copia attuale di questa app: le copie delle altre app dello stesso sito (Pianificazione, Semestre filtro…) non si toccano
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE && k.startsWith('mondo-')).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const u = new URL(e.request.url);
  if (u.origin !== self.location.origin) return; // GitHub e altri siti: sempre dalla rete
  if (!u.pathname.startsWith(SCOPE)) return;
  const rel = u.pathname.slice(SCOPE.length);
  if (rel.includes('/')) return; // altre app nelle sottocartelle (licenze, semestre, sorgenti…): non toccarle
  if (rel.endsWith('version.json')) return; // sempre dalla rete
  // pagina dell'app: prima la rete (per gli aggiornamenti), se manca internet la copia salvata; le altre pagine (guida) dalla rete
  if (e.request.mode === 'navigate') { if (rel !== '' && rel !== 'index.html') return; e.respondWith(fetch(e.request, { cache: 'no-store' }).then(r => { if (r.ok) { const cp = r.clone(); caches.open(CACHE).then(c => c.put('./index.html', cp)); return r; } return caches.open(CACHE).then(c => c.match('./index.html')).then(h => h || r); }).catch(() => caches.open(CACHE).then(c => c.match('./index.html')))); return; }
  e.respondWith(caches.open(CACHE).then(c => c.match(e.request)).then(hit => hit || fetch(e.request).then(r => { if (r.ok || r.type === 'opaque') { const cp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); } return r; })));
});
''' % (ver, ver))
print('pwa ok', ver)
open(P+'robots.txt','w').write('User-agent: *\nDisallow: /\n')
open(P+'check.txt','w').write('versione '+ver+'\n')
