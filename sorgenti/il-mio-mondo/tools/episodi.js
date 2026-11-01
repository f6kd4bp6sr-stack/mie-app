/* 🔗 Pagine d'invito della serie del drago, da mandare su WhatsApp (docs/episodi/ → /episodi/ sul sito).
   Uso: con l'app costruita e servita su http://localhost:8765 →  node tools/episodi.js
   Crea index.html (la serie), 1.html … N.html (un episodio ciascuno) e le immagini img/*.png per l'anteprima di WhatsApp.
   Solo testi già pubblici dell'app (titoli e prima frase della spiegazione): nessun dato personale. */
const { chromium } = require('playwright'), fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', 'docs', 'episodi'), BASE = 'https://f6kd4bp6sr-stack.github.io/mie-app/episodi/';
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const FONT = '@font-face{font-family:"Baloo 2";src:url(f/baloo.woff) format("woff");font-weight:600 800}@font-face{font-family:"Nunito";src:url(f/nunito.woff) format("woff");font-weight:600 800}';

function pagina(e, all) {
  const serie = !e.n, titolo = serie ? '🎬 La serie del drago' : '🎬 Episodio ' + e.n + ': ' + e.nome;
  const desc = serie ? all.length + ' episodi di Storia, dalla Grecia antica a Torino romana. Scegli l’episodio che vuoi: guarda il cartone, scopri le pillole e prova la sfida!' : e.teaser;
  const voce = serie ? 'Ciao! Sono il tuo drago. Ti aspetta una serie tutta nuova: ' + all.length + ' episodi di Storia, dalla Grecia antica a Torino romana. Il primo episodio è: ' + all[0].nome + '. Ti aspetto!'
    : 'Episodio ' + e.n + '. ' + e.nome + '. ' + e.teaser + ' Ti aspetto nella serie del drago!';
  const link = '../#serie' + (serie ? '' : '=' + e.n);
  return `<!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex, nofollow"><meta name="referrer" content="no-referrer"><meta name="theme-color" content="${e.a}">
<title>${esc(titolo)}</title><meta name="description" content="${esc(desc)}">
<meta property="og:type" content="website"><meta property="og:title" content="${esc(titolo)}"><meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${BASE}img/${serie ? 'serie' : e.n}.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<style>${FONT}
*{box-sizing:border-box}html,body{margin:0;min-height:100%}
body{font-family:"Nunito",ui-rounded,system-ui,sans-serif;font-weight:700;color:#fff;background:linear-gradient(160deg,${e.a},${e.b});min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px 16px}
.c{width:min(880px,100%);display:grid;gap:18px}
.k{font-weight:800;opacity:.9;font-size:17px}
h1{font-family:"Baloo 2",ui-rounded,system-ui,sans-serif;font-size:clamp(30px,5vw,48px);line-height:1.1;margin:0}
.ic{font-size:clamp(56px,10vw,96px);line-height:1}
.s{display:flex;gap:16px;align-items:flex-end}.s svg{width:clamp(110px,18vw,170px);height:auto;flex:0 0 auto}
.b{background:#fff;color:#1d2433;border-radius:22px;padding:16px 20px;font-size:clamp(18px,2.4vw,22px);line-height:1.4;box-shadow:0 6px 18px rgba(0,0,0,.25)}
button{font:inherit;font-weight:800;font-size:20px;border:0;border-radius:18px;padding:16px 22px;background:#ffd76a;color:#1d2433;cursor:pointer;box-shadow:0 4px 0 rgba(0,0,0,.2)}
.h{background:rgba(0,0,0,.18);border-radius:20px;padding:16px 20px;font-size:18px;line-height:1.5}.h b{display:block;font-size:19px;margin-bottom:4px}.h ol{margin:0;padding-left:22px}
.l{display:flex;flex-wrap:wrap;gap:8px}.l span{background:rgba(255,255,255,.18);border-radius:12px;padding:6px 10px;font-size:15px}
a{color:#fff;opacity:.85;font-size:15px}
</style></head><body><main class="c">
<div class="k">🎬 La serie del drago${serie ? ' · Storia' : ' · Episodio ' + e.n + ' di ' + all.length}</div>
<div class="ic">${serie ? '🐉' : e.ic}</div><h1>${esc(serie ? 'Le avventure del drago nella Storia' : e.nome)}</h1>
<div class="s">${e.drago}<div class="b">${esc(serie ? 'Ti aspetta una serie tutta nuova! Scegli l’episodio che vuoi: guarda il cartone, scopri le pillole e prova la sfida per vincere le gemme!' : e.teaser)}</div></div>
<div><button type="button" id="v">🔊 Ascolta il trailer</button></div>
${serie ? '<div class="l">' + all.map(x => '<span>' + x.n + '. ' + esc(x.nome) + '</span>').join('') + '</div>' : ''}
<div class="h"><b>Come guardarlo</b><ol><li>Apri <b style="display:inline;font-size:inherit">🐉 Il mio mondo</b> dalla schermata Home</li><li>Tocca 🎬 La serie del drago</li>${serie ? '' : '<li>Tocca l’episodio: sono tutti aperti!</li>'}</ol></div>
<a href="${link}">Usi Il mio mondo dentro Safari e non dalla schermata Home? Apri qui</a>
</main><script>
document.getElementById('v').onclick=function(){try{var u=new SpeechSynthesisUtterance(${JSON.stringify(voce)});u.lang='it-IT';var v=speechSynthesis.getVoices().filter(function(x){return /^it/i.test(x.lang)})[0];if(v)u.voice=v;speechSynthesis.cancel();speechSynthesis.speak(u);}catch(e){}};
</script></body></html>`;
}

function anteprima(e, all) {
  const serie = !e.n;
  return `<!doctype html><html><head><meta charset="utf-8"><style>${FONT}*{box-sizing:border-box}body{margin:0;width:1200px;height:630px;overflow:hidden;font-family:"Nunito";font-weight:800;color:#fff;background:linear-gradient(135deg,${e.a},${e.b});display:flex;align-items:center;gap:40px;padding:50px 64px}
.d svg{width:330px;height:auto}.t{flex:1;display:grid;gap:14px}.k{display:inline-block;background:#ffd76a;color:#1d2433;border-radius:999px;padding:8px 20px;font-size:30px;justify-self:start}
.n{font-size:34px;opacity:.9}h1{font-family:"Baloo 2";font-size:${serie ? 68 : (e.nome.length > 28 ? 60 : 72)}px;line-height:1.05;margin:0}.i{font-size:96px;line-height:1}</style></head>
<body><div class="d">${e.drago}</div><div class="t"><span class="k">${serie ? '🎬 Serie nuova!' : '🎬 Nuovo episodio!'}</span><div class="i">${serie ? '🏛️🏺' : e.ic}</div>
<h1>${esc(serie ? 'Le avventure del drago nella Storia' : e.nome)}</h1><div class="n">${serie ? all.length + ' episodi · dalla Grecia a Torino romana' : 'La serie del drago · Episodio ' + e.n}</div></div></body></html>`;
}

(async () => {
  const b = await chromium.launch(), p = await b.newPage();
  await p.goto('http://localhost:8765/index.html'); await p.waitForTimeout(1200);
  const E = await p.evaluate(() => srEpisodi().map((id, k) => ({ n: k + 1, id, nome: srNome(id), ic: srIc(id), a: srEra(id)[0], b: srEra(id)[1],
    teaser: SPIEGA.storia[id].racconto[0].t, drago: dragonSVG(3, 'verde', '') })));
  const S = { a: E[0].a, b: E[E.length - 1].a, drago: E[0].drago };
  fs.writeFileSync(path.join(OUT, 'index.html'), pagina(S, E));
  E.forEach(e => fs.writeFileSync(path.join(OUT, e.n + '.html'), pagina(e, E)));
  const q = await b.newPage({ viewport: { width: 1200, height: 630 } });
  for (const e of [S, ...E]) {
    const f = path.join(OUT, '_tmp.html'); fs.writeFileSync(f, anteprima(e, E));
    await q.goto('file://' + f); await q.waitForTimeout(250);
    await q.screenshot({ path: path.join(OUT, 'img', (e.n || 'serie') + '.jpg'), type: 'jpeg', quality: 80 });
  }
  fs.unlinkSync(path.join(OUT, '_tmp.html'));
  fs.writeFileSync(path.join(OUT, '_link.json'), JSON.stringify(E.map(e => ({ n: e.n, nome: e.nome, ic: e.ic })), null, 1));
  console.log('pagine', E.length + 1); await b.close();
})();
