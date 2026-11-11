/* ---------- 🎓 Corsi online (3/11/2026, richiesta del proprietario) ----------
   Corsi gratuiti di università italiane e straniere che si seguono in italiano. La lista è in sezioni/corsi_dati.json
   (CO_D, controllata da strumenti/verifica_corsi.py a ogni build). Sull'iPad resta solo lo stato dei corsi (P.corsi). */
const CO_AREE={ia:["🤖","IA e digitale"],pens:["🌿","Pensione e tempo libero"]};
const CO_ST={da:["⭐","Da seguire"],in:["▶️","In corso"],ok:["✅","Finito"]};
function coD(){P.corsi=P.corsi||{};const C=P.corsi;C.st=C.st||{};C.f=C.f||{};C.fine=C.fine||{};return C;}
/* 8/11/2026 (richiesta del proprietario): i corsi finiti ✅ vanno nell'🗄️ Archivio in fondo, fuori dalla lista; C.fine = data in cui sono stati segnati finiti */
const coFinito=(c,C)=>C.st[c.id]==="ok";
/* 4/11/2026 (scelta del proprietario): la ricerca arriva a lotti di 10; i corsi dei lotti precedenti che non hai segnato (⭐ ▶️ ✅) spariscono e non vengono più proposti */
const coLotto=()=>Math.max(1,...CO_D.corsi.map(c=>c.lotto||1));
const coVisibile=(c,C)=>(c.lotto||1)>=coLotto()||!!C.st[c.id];
/* 11/11/2026 (richiesta del proprietario): i corsi segnati ⭐ o ▶️ stanno nella sezione «I miei corsi» in alto e non compaiono più nella scelta generale */
function coMiei(C){const o={in:0,da:1};return CO_D.corsi.filter(c=>C.st[c.id]==='da'||C.st[c.id]==='in').sort((a,b)=>o[C.st[a.id]]-o[C.st[b.id]]);}
function coMieiH(C){const M=coMiei(C);if(!M.length)return '';const n=k=>M.filter(c=>C.st[c.id]===k).length;
  return `<div class="card k-corsi nofold co-miei"><h2>⭐ I miei corsi <span class="pill">${M.length}</span></h2><p class="lbl">I corsi che hai scelto: ▶️ ${n('in')} in corso · ⭐ ${n('da')} da seguire. Tocca di nuovo ⭐ o ▶️ per rimetterne uno nella scelta generale; con ✅ va nell'archivio.</p><div class="co-mie">${M.map(c=>coCard(c,C)).join('')}</div></div>`;}
function coFiltra(C){const f=C.f;return CO_D.corsi.filter(c=>coVisibile(c,C)&&!C.st[c.id]&&(!f.a||c.area===f.a)&&(!f.t||c.tipo===f.t)&&(!f.it||c.lingua!=="Sottotitoli in italiano")&&(!f.at||c.attestato==="Gratis"));}
function coCard(c,C){const s=C.st[c.id];
  return `<div class="co-c${s?" co-"+s:""}"><b>${esc(c.titolo)}</b><div class="co-e">${c.tipo==='Università popolare'?'🏛️ ':''}${esc(c.ente)}${c.paese!=="Italia"?" · "+esc(c.paese):""} · ${esc(c.piattaforma)}</div>`+
    `<div class="co-t"><span>${c.lingua==="Sottotitoli in italiano"?"💬":"🇮🇹"} ${esc(c.lingua)}</span><span>${c.modalita==='Online'?'💻 Online':'📍 '+esc(c.modalita)+(c.citta?' · '+esc(c.citta):'')}</span><span>${esc(c.livello)}</span><span>⏱️ ${esc(c.durata)}</span><span>${esc(c.formato)}</span><span>🎓 attestato: ${esc(c.attestato)}</span></div>`+
    `<p>${esc(c.sintesi)}</p>`+(c.perche?`<p class="co-pq">👉 <b>Perché te lo proponiamo:</b> ${esc(c.perche)}</p>`:"")+(c.programma&&c.programma.length?`<div class="co-pg"><b>📋 Programma</b><ul>${c.programma.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div>`:"")+`<div class="co-b"><a class="btn sm" href="${esc(c.url)}" target="_blank" rel="noopener">Apri il corso ›</a>`+
    Object.keys(CO_ST).map(k=>`<button class="btn sm${s===k?" on":""}" data-cos="${esc(c.id)}" data-v="${k}" title="${CO_ST[k][1]}">${CO_ST[k][0]}</button>`).join("")+
    `</div><div class="lbl">Controllato il ${new Date(c.verificato+"T12:00").toLocaleDateString("it-IT")}</div></div>`;}
function coQuota(){const Q=CO_D.a_quota||[];if(!Q.length)return "";
  return `<div class="card k-corsi"><h2>💶 Università popolari a quota <span class="pill">${Q.length}</span></h2><p class="lbl">${esc(CO_D.a_quota_nota||"")}</p>`+Q.map(q=>`<div class="co-c"><b>🏛️ ${esc(q.nome)}</b><div class="co-e">📍 ${esc(q.citta)} · ${esc(q.modalita)}</div><div class="co-t"><span>💶 ${esc(q.quota)}</span><span>controllato il ${new Date(q.verificato+"T12:00").toLocaleDateString("it-IT")}</span></div><p>${esc(q.comprende)}</p><p>${esc(q.iscrizione)}</p><div class="co-b"><a class="btn sm" href="${esc(q.url)}" target="_blank" rel="noopener">Apri il sito ›</a></div></div>`).join("")+`</div>`;}
function coArchivio(C){const A=CO_D.corsi.filter(c=>coFinito(c,C)).sort((a,b)=>(C.fine[b.id]||"").localeCompare(C.fine[a.id]||""));if(!A.length)return "";
  return `<details class="card k-corsi fold co-arch" data-fk="co|arch"${foldSt["co|arch"]===true?" open":""}><summary><h2>🗄️ Archivio · corsi finiti <span class="pill">${A.length}</span></h2></summary>`+
    `<p class="lbl">I corsi segnati ✅ finiscono qui. Le nuove ricerche partono da questi per proporre il passo successivo.</p><div class="co-al">`+
    A.map(c=>`<div class="row"><div class="grow"><b>✅ ${esc(c.titolo)}</b><small>${esc(c.ente)} · ${esc(c.livello)}${C.fine[c.id]?" · finito il "+new Date(C.fine[c.id]+"T12:00").toLocaleDateString("it-IT"):""}</small></div><a class="btn sm" href="${esc(c.url)}" target="_blank" rel="noopener">Apri ›</a><button class="btn sm" data-cos="${esc(c.id)}" data-v="in" title="Rimetti in corso">↩️</button></div>`).join("")+`</div></details>`;}
function vCorsi(){
  const C=coD(),f=C.f,L=CO_D.corsi.filter(c=>coVisibile(c,C)&&!C.st[c.id]),nMiei=coMiei(C).length,nArch=CO_D.corsi.filter(c=>coFinito(c,C)).length,R=coFiltra(C),LN=coLotto(),nuovi=L.filter(c=>(c.lotto||1)===LN&&!C.st[c.id]).length;
  let o=`<h1>🎓 Corsi online</h1><p class="sub">Corsi gratuiti e aperti a tutti, senza essere studenti universitari: università italiane e straniere e università popolari, in italiano. Tocca ⭐ ▶️ ✅ per segnare i tuoi: lo stato resta su questo iPad.</p>`;
  if(!L.length&&nMiei)return o+coMieiH(C)+`<div class="card k-corsi nofold"><p class="empty">Nella scelta generale non resta nessun corso: li hai scelti tutti. La prossima tappa porta corsi nuovi.</p></div>`+coArchivio(C)+coQuota();
  if(!L.length&&nArch)return o+`<div class="card k-corsi nofold"><h2>🎉 Hai finito tutti i corsi proposti</h2><p>La prossima tappa porta corsi nuovi, scelti come passo successivo di quelli finiti.</p></div>`+coArchivio(C);
  if(!L.length)return o+`<div class="card k-corsi nofold"><h2>📚 La lista è in preparazione</h2><p>${esc(CO_D.criteri)}</p><p class="empty">I corsi arrivano dopo la ricerca e il controllo: ogni corso viene aperto sulla pagina ufficiale prima di entrare nella lista.</p></div>`;
  const nn=k=>CO_D.corsi.filter(c=>C.st[c.id]===k).length;
  o+=coMieiH(C)+`<div class="card k-corsi nofold co-f"><div class="co-fr">`+
    `<button class="og-p${!f.a?" on":""}" data-cof="a" data-v="">Da scegliere · ${L.length}</button>`+
    Object.keys(CO_AREE).map(a=>`<button class="og-p${f.a===a?" on":""}" data-cof="a" data-v="${a}">${CO_AREE[a][0]} ${CO_AREE[a][1]} · ${L.filter(c=>c.area===a).length}</button>`).join("")+
    [['','Tutti gli enti'],['Università','🎓 Università'],['Università popolare','🏛️ Università popolari']].map(([v,t])=>`<button class="og-p${(f.t||'')===v?' on':''}" data-cof="t" data-v="${v}">${t}</button>`).join('')+
    `<label class="co-ck"><input type="checkbox" data-cok="it"${f.it?" checked":""}> solo in italiano (senza sottotitoli)</label>`+
    `<label class="co-ck"><input type="checkbox" data-cok="at"${f.at?" checked":""}> attestato gratis</label>`+
    `</div>`+
    (nuovi?`<div class="lbl">🆕 <b>${nuovi} corsi da scegliere</b>: segna con ⭐ quelli che ti interessano: passano in «I miei corsi». Alla prossima ricerca gli altri spariscono e non verranno più proposti.</div>`:"")+
    (nMiei||nArch?`<div class="lbl">I miei corsi: ⭐ ${nn("da")} da seguire · ▶️ ${nn("in")} in corso · ✅ ${nn("ok")} finiti</div>`:"")+
    `<div class="lbl">${esc(CO_D.criteri)}${CO_D.updated?" Lista aggiornata il "+new Date(CO_D.updated+"T12:00").toLocaleDateString("it-IT")+".":""}</div></div>`;
  if(!R.length)return o+`<p class="empty">Nessun corso con questi filtri.</p>`+coArchivio(C)+coQuota();
  const temi=[].concat(...Object.keys(CO_AREE).map(a=>CO_D.temi[a]));
  o+=`<div class="cols4 co-cols">`+temi.map(t=>{const g=R.filter(c=>c.tema===t);if(!g.length)return "";
    return `<div class="card k-corsi"><h3>${esc(t)} <span class="pill">${g.length}</span></h3>${g.map(c=>coCard(c,C)).join("")}</div>`;}).join("")+`</div>`+coArchivio(C)+coQuota();
  return o;
}
function bindCorsi(){
  const C=coD();
  document.querySelectorAll("[data-cof]").forEach(b=>b.onclick=()=>{C.f[b.dataset.cof]=b.dataset.v;save();render();});
  document.querySelectorAll("[data-cok]").forEach(c=>c.onchange=()=>{C.f[c.dataset.cok]=c.checked?1:0;save();render();});
  document.querySelectorAll("[data-cos]").forEach(b=>b.onclick=()=>{const id=b.dataset.cos,v=b.dataset.v;if(C.st[id]===v)delete C.st[id];else C.st[id]=v;if(C.st[id]==="ok")C.fine[id]=today();else delete C.fine[id];save();render();toast(C.st[id]==="ok"?"✅ Finito: spostato nell'archivio":C.st[id]?CO_ST[v][0]+" "+CO_ST[v][1]+": è in «I miei corsi»":"Tolto dai tuoi corsi: torna nella scelta generale");});
}
