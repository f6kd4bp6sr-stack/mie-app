#!/usr/bin/env python3
"""Muoviti — pubblicazione leggera (nessuna dipendenza).
Uso: python3 sorgenti/muoviti/pubblica.py
Legge sorgenti/muoviti/index.html, calcola la versione dal contenuto e scrive
muoviti/index.html, muoviti/sw.js, muoviti/version.json, muoviti/manifest.webmanifest.
Dopo il push su main, GitHub Pages pubblica e l'app sull'iPhone si aggiorna da sola."""
import hashlib, json, pathlib
R = pathlib.Path(__file__).resolve().parents[2]
SRC, OUT = R/"sorgenti/muoviti", R/"muoviti"
html = (SRC/"index.html").read_text(encoding="utf-8")
icons = b"".join((OUT/f"icon-{n}.png").read_bytes() for n in (180, 192, 512))
ver = hashlib.sha1(html.encode() + icons).hexdigest()[:10]
(OUT/"index.html").write_text(html.replace("__VER__", ver), encoding="utf-8")
(OUT/"version.json").write_text(json.dumps({"v": ver}), encoding="utf-8")
(OUT/"manifest.webmanifest").write_text(json.dumps({
  "name": "Muoviti", "short_name": "Muoviti",
  "description": "Tram 10 GTT: Piazza Statuto ↔ Corso IV Novembre 40, orari e passaggi live",
  "start_url": "./", "scope": "./", "display": "standalone",
  "background_color": "#000000", "theme_color": "#000000", "lang": "it",
  "icons": [{"src": "icon-192.png", "sizes": "192x192", "type": "image/png"},
            {"src": "icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable"}]
}, ensure_ascii=False, indent=1), encoding="utf-8")
(OUT/"sw.js").write_text(f"""// Muoviti: funziona anche senza internet. Versione {ver}
const CACHE = 'muoviti-{ver}';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon-180.png', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => {{ e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(f => new Request(f, {{ cache: 'reload' }})))).then(() => self.skipWaiting())); }});
self.addEventListener('activate', e => {{ e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('muoviti-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); }});
self.addEventListener('fetch', e => {{
  if (e.request.method !== 'GET') return;
  const u = new URL(e.request.url);
  if (u.origin !== self.location.origin || !u.pathname.includes('/muoviti/')) return; // altri siti e altre app: sempre dalla rete
  if (u.pathname.endsWith('version.json') || u.pathname.endsWith('avvisi.json')) return;
  if (e.request.mode === 'navigate') {{ e.respondWith(fetch(e.request, {{ cache: 'no-store' }}).then(r => {{ if (r.ok) {{ const cp = r.clone(); caches.open(CACHE).then(c => c.put('./index.html', cp)); return r; }} return caches.match('./index.html').then(h => h || r); }}).catch(() => caches.match('./index.html'))); return; }}
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(r => {{ if (r.ok) {{ const cp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); }} return r; }})));
}});
""", encoding="utf-8")
print("Muoviti pubblicata, versione", ver)
