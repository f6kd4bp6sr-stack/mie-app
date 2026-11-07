/* ---------- 🗂️ PRATICHE: l'interfaccia è stata tolta il 7/11/2026 (era spenta dal 25/10/2026) ----------
   Resta solo il visore dei file, usato dalla Pensione (sezioni/pensione.js, file «pf-…»).
   I dati restano: pn-v1 → prat e i file «pf-…» nel database del dispositivo («licenze-marco») entrano ancora
   nelle copie (File/iCloud e copia automatica, comune/barra.html) e nel ripristino. */
/* visore dentro l'app: nell'app sulla schermata Home non c'è il tasto «indietro», quindi il file non si apre in una pagina nuova */
function pratView(blob,meta){const u=URL.createObjectURL(blob),ov=document.createElement("div"),img=/image/.test(meta.type||blob.type);
  ov.className="pview";ov.innerHTML=`<div class="pvbar"><b>${esc(meta.n)}</b><span style="flex:1"></span>${navigator.share?'<button class="btn sm" id="pvSh">📤 Condividi / Salva</button>':`<a class="btn sm" href="${u}" download="${esc(meta.n)}">⬇️ Scarica</a>`}<button class="btn sm pri" id="pvX">Chiudi</button></div>`+
    (img?`<div class="pvbody"><img src="${u}" alt="${esc(meta.n)}"></div>`:`<iframe class="pvbody" src="${u}" title="${esc(meta.n)}"></iframe>`);
  document.body.appendChild(ov);const close=()=>{ov.remove();URL.revokeObjectURL(u);};
  ov.querySelector("#pvX").onclick=close;
  const sh=ov.querySelector("#pvSh");if(sh)sh.onclick=async()=>{try{const f=new File([blob],meta.n||"file",{type:meta.type||blob.type});await navigator.share({files:[f],title:meta.n});}catch(e){if(!e||e.name!=="AbortError")toast("Condivisione non riuscita");}};}
