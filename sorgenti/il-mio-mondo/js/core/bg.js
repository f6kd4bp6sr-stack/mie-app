/* ================= SFONDI RILASSANTI: li sceglie lei (o una sua foto) ================= */
const svgUrl = s => 'url("data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s) + '")';
const SVGW = (body, bg) => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMax slice">' + (bg || '') + body + '</svg>';
const BGS = [
  { id: '', n: 'Bianco', ic: '⬜', css: 'none' },
  { id: 'alba', n: 'Alba pastello', ic: '🌅', css: 'linear-gradient(180deg,#fde8e4 0%,#fff3e6 45%,#e9f3ff 100%)' },
  { id: 'mare', n: 'Mare calmo', ic: '🌊', css: svgUrl(SVGW('<path d="M0 640 C200 610 400 670 600 640 S1000 610 1200 640 S1500 670 1600 640 V1000 H0Z" fill="#cfe7f5"/><path d="M0 720 C250 690 450 750 700 720 S1150 690 1400 720 S1550 740 1600 720 V1000 H0Z" fill="#b9dcf0"/><path d="M0 820 C300 790 500 850 800 820 S1250 790 1600 820 V1000 H0Z" fill="#a6d1ea"/><circle cx="1250" cy="300" r="70" fill="#fff4d6"/>', '<rect width="1600" height="1000" fill="#eef7fc"/>')) },
  { id: 'prato', n: 'Prato tranquillo', ic: '🌿', css: svgUrl(SVGW('<ellipse cx="300" cy="1000" rx="900" ry="330" fill="#d8eed2"/><ellipse cx="1300" cy="1020" rx="900" ry="300" fill="#cbe7c3"/><ellipse cx="800" cy="1080" rx="1100" ry="250" fill="#bfe0b6"/><circle cx="1300" cy="230" r="60" fill="#fff1c9"/><g fill="#ffffff" opacity=".8"><ellipse cx="380" cy="230" rx="90" ry="28"/><ellipse cx="440" cy="210" rx="60" ry="30"/><ellipse cx="900" cy="300" rx="110" ry="26"/></g>', '<rect width="1600" height="1000" fill="#f2f9fd"/>')) },
  { id: 'monti', n: 'Montagne all’alba', ic: '🏔️', css: svgUrl(SVGW('<path d="M0 760 L260 520 L460 690 L700 430 L980 700 L1200 520 L1600 760 V1000 H0Z" fill="#dcd6ee"/><path d="M0 850 L300 640 L560 820 L860 600 L1150 840 L1400 680 L1600 820 V1000 H0Z" fill="#cbc4e6"/><path d="M700 430 L760 500 L740 505 L700 470 L660 505 L640 500Z" fill="#fff"/><rect y="900" width="1600" height="100" fill="#bdb5dd"/>', '<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbe3e8"/><stop offset="1" stop-color="#eef0fb"/></linearGradient></defs><rect width="1600" height="1000" fill="url(#g)"/>')) },
  { id: 'nuvole', n: 'Nuvole soffici', ic: '☁️', css: svgUrl(SVGW('<g fill="#ffffff"><ellipse cx="260" cy="260" rx="160" ry="55"/><ellipse cx="340" cy="230" rx="110" ry="60"/><ellipse cx="1180" cy="180" rx="190" ry="60"/><ellipse cx="1270" cy="150" rx="120" ry="62"/><ellipse cx="760" cy="520" rx="210" ry="58"/><ellipse cx="840" cy="490" rx="120" ry="60"/><ellipse cx="300" cy="800" rx="170" ry="50"/><ellipse cx="1300" cy="760" rx="190" ry="55"/></g>', '<rect width="1600" height="1000" fill="#e6f1fb"/>')) },
  { id: 'ghiaccio', n: 'Pista di ghiaccio', ic: '⛸️', css: svgUrl(SVGW('<rect y="700" width="1600" height="300" fill="#e3f1fb"/><path d="M0 700 H1600" stroke="#cfe3f3" stroke-width="6"/><g fill="#ffffff" opacity=".9">' + Array.from({ length: 40 }, (_, k) => '<circle cx="' + ((k * 397) % 1600) + '" cy="' + ((k * 223) % 680) + '" r="' + (3 + k % 4) + '"/>').join('') + '</g>', '<rect width="1600" height="1000" fill="#f1f8fd"/>')) },
  { id: 'notte', n: 'Cielo stellato', ic: '🌙', css: svgUrl(SVGW('<g fill="#ffffff">' + Array.from({ length: 70 }, (_, k) => '<circle cx="' + ((k * 251) % 1600) + '" cy="' + ((k * 137) % 1000) + '" r="' + (k % 5 === 0 ? 2.6 : 1.3) + '" opacity="' + (k % 3 ? .6 : .95) + '"/>').join('') + '</g><circle cx="1280" cy="200" r="55" fill="#f4f1dc"/><circle cx="1300" cy="188" r="50" fill="#2f3566"/>', '<defs><linearGradient id="n" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b3160"/><stop offset="1" stop-color="#4a4f86"/></linearGradient></defs><rect width="1600" height="1000" fill="url(#n)"/>')), dark: true },
  { id: 'sabbia', n: 'Sabbia e conchiglie', ic: '🐚', css: svgUrl(SVGW('<path d="M0 760 C400 720 800 800 1200 760 S1500 740 1600 760 V1000 H0Z" fill="#f3e3c8"/><path d="M0 840 C400 810 900 880 1600 830 V1000 H0Z" fill="#ecd7b6"/>', '<rect width="1600" height="1000" fill="#fbf4ea"/>')) },
  { id: 'lavanda', n: 'Campo di lavanda', ic: '💜', css: 'linear-gradient(180deg,#f1ecfb 0%,#efe8fa 55%,#e2d6f5 100%)' }
];
/* foto scelta da lei: resta sull'iPad, in una memoria a parte (non entra nelle copie né nei Progressi) */
const BgPhoto = {
  db() { return new Promise((res, rej) => { try { const r = indexedDB.open('mondo-sfondo', 1); r.onupgradeneeded = () => r.result.createObjectStore('f'); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); } catch (e) { rej(e); } }); },
  async get() { try { const d = await BgPhoto.db(); return await new Promise(r => { const q = d.transaction('f').objectStore('f').get('foto'); q.onsuccess = () => r(q.result || null); q.onerror = () => r(null); }); } catch (e) { return null; } },
  async set(v) { try { const d = await BgPhoto.db(); await new Promise(r => { const t = d.transaction('f', 'readwrite'); t.objectStore('f').put(v, 'foto'); t.oncomplete = r; t.onerror = r; }); } catch (e) {} }
};
async function applyBg() {
  let el = $('app-bg'); if (!el) { el = document.createElement('div'); el.id = 'app-bg'; el.setAttribute('aria-hidden', 'true'); document.body.prepend(el); }
  const id = store.get('app-bg', ''); let css = 'none', dark = false;
  if (id === 'foto') { const f = await BgPhoto.get(); if (f) css = 'url("' + f + '")'; }
  else { const b = BGS.find(x => x.id === id); if (b) { css = b.css; dark = !!b.dark; } }
  el.style.backgroundImage = css === 'none' ? '' : css;
  document.body.classList.toggle('has-bg', css !== 'none');
  document.body.classList.toggle('bg-dark', dark || id === 'foto');
}
function fileToJpeg(file, max) {
  return new Promise((res, rej) => {
    const url = URL.createObjectURL(file), img = new Image();
    img.onload = () => { const sc = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight)), c = document.createElement('canvas'); c.width = Math.round(img.naturalWidth * sc); c.height = Math.round(img.naturalHeight * sc); c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url); res(c.toDataURL('image/jpeg', .8)); };
    img.onerror = () => { URL.revokeObjectURL(url); rej(new Error('foto non leggibile')); };
    img.src = url;
  });
}
function openBg() {
  const cur = store.get('app-bg', '');
  openModal('<div class="big" style="font-size:28px">🖼️ Il tuo sfondo</div><p style="font-weight:700;color:var(--ink-soft)">Scegli quello che ti fa sentire tranquilla. Puoi cambiarlo quando vuoi.</p>' +
    '<div class="bg-grid">' + BGS.map(b => '<button type="button" class="bg-it' + (b.id === cur ? ' on' : '') + '" data-bg="' + b.id + '"><span class="bg-th" style="background-image:' + (b.css === 'none' ? 'none' : b.css.replace(/"/g, '&quot;')) + '"></span><b>' + b.ic + ' ' + esc(b.n) + '</b></button>').join('') +
      '<label class="bg-it' + (cur === 'foto' ? ' on' : '') + '" style="cursor:pointer"><span class="bg-th bg-photo">📷</span><b>Una tua foto</b><input type="file" id="bg-file" accept="image/*" hidden></label></div>' +
    '<div class="row center" style="margin-top:12px"><button type="button" class="btn ghost" id="bg-x" data-focus>Chiudi</button></div>');
  $('modal-box').classList.add('wide');
  $('bg-x').addEventListener('click', closeModal);
  $('modal-box').querySelectorAll('[data-bg]').forEach(b => b.addEventListener('click', async () => { store.set('app-bg', b.dataset.bg); await applyBg(); openBg(); }));
  $('bg-file').addEventListener('change', async e => {
    const f = e.target.files && e.target.files[0]; if (!f) return;
    try { const d = await fileToJpeg(f, 1600); await BgPhoto.set(d); store.set('app-bg', 'foto'); await applyBg(); openBg(); } catch (err) { toastV2('Non riesco a usare questa foto'); }
  });
}
applyBg();
