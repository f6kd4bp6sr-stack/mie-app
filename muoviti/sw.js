// Muoviti: funziona anche senza internet. Versione f734c0a51b
const CACHE = 'muoviti-f734c0a51b';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon-180.png', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(f => new Request(f, { cache: 'reload' })))).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('muoviti-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const u = new URL(e.request.url);
  if (u.origin !== self.location.origin || !u.pathname.includes('/muoviti/')) return; // altri siti e altre app: sempre dalla rete
  if (u.pathname.endsWith('version.json') || u.pathname.endsWith('avvisi.json')) return;
  if (e.request.mode === 'navigate') { // rete con limite di 3 s, poi copia salvata
    const rete = fetch(e.request, { cache: 'no-store' }).then(r => { if (r.ok) { const cp = r.clone(); caches.open(CACHE).then(c => c.put('./index.html', cp)); } return r; });
    const limite = new Promise(ok => setTimeout(ok, 3000)).then(() => caches.match('./index.html'));
    e.respondWith(Promise.race([rete.catch(() => caches.match('./index.html')), limite.then(h => h || rete)]).then(r => r || rete));
    return; }
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(r => { if (r.ok) { const cp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); } return r; })));
});
