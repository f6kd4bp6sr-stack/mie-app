// Il mio mondo: funziona anche senza internet. Versione e8ec5a7b90
const CACHE = 'mondo-e8ec5a7b90';
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
  if (e.request.mode === 'navigate') { if (rel !== '' && rel !== 'index.html') return; e.respondWith(fetch(e.request, { cache: 'no-store' }).then(r => { if (r.ok) { const cp = r.clone(); caches.open(CACHE).then(c => c.put('./index.html', cp)); return r; } return caches.match('./index.html').then(h => h || r); }).catch(() => caches.match('./index.html'))); return; }
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(r => { if (r.ok || r.type === 'opaque') { const cp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); } return r; })));
});
