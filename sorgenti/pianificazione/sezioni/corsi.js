/* ---------- 🎓 Corsi online (3/11/2026, richiesta del proprietario) ----------
   Corsi gratuiti di università italiane e straniere che si seguono in italiano. La lista è in sezioni/corsi_dati.json
   (CO_D, controllata da strumenti/verifica_corsi.py a ogni build). Sull'iPad resta solo lo stato dei corsi (P.corsi). */
const CO_AREE={ia:["🤖","IA e digitale"],pens:["🌿","Pensione e tempo libero"]};
const CO_ST={da:["⭐","Da seguire"],in:["▶️","In corso"],ok:["✅","Finito"]};
function coD(){P.corsi=P.corsi||{};const C=P.corsi;C.st=C.st||{};C.f=C.f||{};return C;}
function coFiltra(C){const f=C.f;return CO_D.corsi.filter(c=>(!f.a||c.area===f.a)&&(!f.t||c.tipo===f.t)&&(!f.it||c.lingua!=="Sottotitoli in italiano")&&(!f.at||c.attestato==="Gratis")&&(!f.st||C.st[c.id]));}
function coCard(c,C){const s=C.st[c.id];
  return `<div class="co-c${s?" co-"+s:""}"><b>${esc(c.titolo)}</b><div class="co-e">${c.tipo==='Università popolare'?'🏛️ ':''}${esc(c.ente)}${c.paese!=="Italia"?" · "+esc(c.paese):""} · ${esc(c.piattaforma)}</div>`+
    `<div class="co-t"><span>${c.lingua==="Sottotitoli in italiano"?"💬":"🇮🇹"} ${esc(c.lingua)}</span><span>${c.modalita==='Online'?'💻 Online':'📍 '+esc(c.modalita)+(c.citta?' · '+esc(c.citta):'')}</span><span>${esc(c.livello)}</span><span>⏱️ ${esc(c.durata)}</span><span>${esc(c.formato)}</span><span>🎓 attestato: ${esc(c.attestato)}</span></div>`+
    `<p>${esc(c.sintesi)}</p><div class="co-b"><a class="btn sm" href="${esc(c.url)}" target="_blank" rel="noopener">Apri il corso ›</a>`+
    Object.keys(CO_ST).map(k=>`<button class="btn sm${s===k?" on":""}" data-cos="${esc(c.id)}" data-v="${k}" title="${CO_ST[k][1]}">${CO_ST[k][0]}</button>`).join("")+
    `</div><div class="lbl">Controllato il ${new Date(c.verificato+"T12:00").toLocaleDateString("it-IT")}</div></div>`;}
function vCorsi(){
  const C=coD(),f=C.f,L=CO_D.corsi,R=coFiltra(C);
  let o=`<h1>🎓 Corsi online</h1><p class="sub">Corsi gratuiti e aperti a tutti, senza essere studenti universitari: università italiane e straniere e università popolari, in italiano. Tocca ⭐ ▶️ ✅ per segnare i tuoi: lo stato resta su questo iPad.</p>`;
  if(!L.length)return o+`<div class="card k-corsi nofold"><h2>📚 La lista è in preparazione</h2><p>${esc(CO_D.criteri)}</p><p class="empty">I corsi arrivano dopo la ricerca e il controllo: ogni corso viene aperto sulla pagina ufficiale prima di entrare nella lista.</p></div>`;
  const mie=L.filter(c=>C.st[c.id]),nn=k=>mie.filter(c=>C.st[c.id]===k).length;
  o+=`<div class="card k-corsi nofold co-f"><div class="co-fr">`+
    `<button class="og-p${!f.a?" on":""}" data-cof="a" data-v="">Tutti · ${L.length}</button>`+
    Object.keys(CO_AREE).map(a=>`<button class="og-p${f.a===a?" on":""}" data-cof="a" data-v="${a}">${CO_AREE[a][0]} ${CO_AREE[a][1]} · ${L.filter(c=>c.area===a).length}</button>`).join("")+
    [['','Tutti gli enti'],['Università','🎓 Università'],['Università popolare','🏛️ Università popolari']].map(([v,t])=>`<button class="og-p${(f.t||'')===v?' on':''}" data-cof="t" data-v="${v}">${t}</button>`).join('')+
    `<label class="co-ck"><input type="checkbox" data-cok="it"${f.it?" checked":""}> solo in italiano (senza sottotitoli)</label>`+
    `<label class="co-ck"><input type="checkbox" data-cok="at"${f.at?" checked":""}> attestato gratis</label>`+
    `<label class="co-ck"><input type="checkbox" data-cok="st"${f.st?" checked":""}> solo i miei (${mie.length})</label></div>`+
    (mie.length?`<div class="lbl">I miei corsi: ⭐ ${nn("da")} da seguire · ▶️ ${nn("in")} in corso · ✅ ${nn("ok")} finiti</div>`:"")+
    `<div class="lbl">${esc(CO_D.criteri)}${CO_D.updated?" Lista aggiornata il "+new Date(CO_D.updated+"T12:00").toLocaleDateString("it-IT")+".":""}</div></div>`;
  if(!R.length)return o+`<p class="empty">Nessun corso con questi filtri.</p>`;
  const temi=[].concat(...Object.keys(CO_AREE).map(a=>CO_D.temi[a]));
  o+=`<div class="cols4">`+temi.map(t=>{const g=R.filter(c=>c.tema===t);if(!g.length)return "";
    return `<div class="card k-corsi"><h3>${esc(t)} <span class="pill">${g.length}</span></h3>${g.map(c=>coCard(c,C)).join("")}</div>`;}).join("")+`</div>`;
  return o;
}
function bindCorsi(){
  const C=coD();
  document.querySelectorAll("[data-cof]").forEach(b=>b.onclick=()=>{C.f[b.dataset.cof]=b.dataset.v;save();render();});
  document.querySelectorAll("[data-cok]").forEach(c=>c.onchange=()=>{C.f[c.dataset.cok]=c.checked?1:0;save();render();});
  document.querySelectorAll("[data-cos]").forEach(b=>b.onclick=()=>{const id=b.dataset.cos,v=b.dataset.v;if(C.st[id]===v)delete C.st[id];else C.st[id]=v;save();render();toast(C.st[id]?CO_ST[v][0]+" "+CO_ST[v][1]:"Tolto dai tuoi corsi");});
}
