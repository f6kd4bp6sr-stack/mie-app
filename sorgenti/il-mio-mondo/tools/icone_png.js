// Crea le icone PNG di «Il mio mondo» da mondo-out/icona-c2.svg (chiamato da deploy.sh dopo il build).
// 8/11/2026: i file hanno un nome nuovo (icona-c2-…) perché Safari tiene in cache l'icona con il nome vecchio.
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const O='/home/claude/mondo-out/';const svg=fs.readFileSync(O+'icona-c2.svg','utf8');const b=await chromium.launch();
for(const n of [180,192,512]){const p=await b.newPage({viewport:{width:n,height:n}});
await p.setContent('<html><body style="margin:0">'+svg.replace('<svg ','<svg width="'+n+'" height="'+n+'" ')+'</body></html>');
await p.screenshot({path:O+'icona-c2-'+n+'.png'});await p.close();}
await b.close();})();
