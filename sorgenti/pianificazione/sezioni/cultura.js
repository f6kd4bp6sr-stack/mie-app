/* ---------- 🤖 CULTURA DIGITALE: che cos'è l'intelligenza artificiale e come usarla bene ----------
   Percorso a livelli (1 Base solo per 💻 Programmare app, dall'8/11/2026 · 2 Intermedio · 3 Avanzato; il Base generale è stato tolto il 27/10/2026, completato): l'Avanzato si apre con 4 schede fatte dell'Intermedio.
   📚 Letture: libri e risorse ufficiali con riassunto e idee chiave (P.cd.lib: voglio / letto).
   Ogni scheda: testo breve, «da ricordare», 🧪 Prova adesso (richiesta pronta da copiare, con [segnaposto] al posto dei dati),
   3 domande; quando sono giuste tutte e tre la scheda è fatta e le domande entrano nel 🔁 ripasso a intervalli (1, 3, 7, 14, 30, 60 giorni).
   📰 Novità del mese: file pubblico cultura-novita.json, aggiornato dall'attività programmata (fonti ufficiali).
   Contenuti: sezioni/cultura_dati.json (autore + revisore indipendente, controllo strumenti/verifica_cultura.py). Progressi in P.cd. */
const CD_V=[["perc","🧭 Percorso"],["let","📚 Letture"],["rip","🔁 Ripasso"],["nov","📰 Novità"]],CD_STEP=[1,3,7,14,30,60],CD_SBLOCCO=4,CD_NKEY="pn-cd-novita";
let cdV="perc",cdSel=null,cdAns={},cdRip=null,cdTema="";
/* 11/11/2026 (scelta del proprietario): il tema «bimba» è nascosto, non cancellato. I dati e i progressi restano: per farlo tornare basta svuotare questo elenco. */
const CD_NASCOSTI=["bimba"],cdVis=x=>!CD_NASCOSTI.includes(x.tema);
function CD(){if(!P.cd||typeof P.cd!=="object")P.cd={};const c=P.cd;["fatte","srs","lette"].forEach(k=>{if(!c[k]||typeof c[k]!=="object")c[k]={};});return c;}
const cdScheda=id=>CD_D.schede.find(s=>s.id===id);
const cdDel=l=>CD_D.schede.filter(s=>s.liv===l&&cdVis(s));
const cdFatteL=l=>cdDel(l).filter(s=>CD().fatte[s.id]).length;
/* per aprire il livello dopo contano anche le schede fatte dei temi nascosti: un livello già aperto non si richiude */
const cdFatteU=l=>CD_D.schede.filter(s=>s.liv===l&&CD().fatte[s.id]).length;
/* il livello 1 (Base) è stato tolto il 27/10/2026, dopo che il proprietario l'ha completato: si parte dal primo livello rimasto */
let CD_LIV=[];
/* i dati arrivano da cultura-dati.js, caricato alla prima richiesta (apertura più veloce, 4/11/2026) */
function cdPronto(){if(CD_D){if(!CD_LIV.length)CD_LIV=Object.keys(CD_D.livelli).map(Number).sort();return true;}lazyJS("cultura-dati.js",()=>{cdPronto();softRender();});return false;}
/* 8/11/2026: il livello 1 torna solo per 💻 Programmare app; i livelli 1 e 2 sono sempre aperti, il 3 dopo 4 schede del 2 */
const cdAperto=l=>l<=2||cdFatteU(l-1)>=CD_SBLOCCO;
const cdQ=qid=>{for(const s of CD_D.schede)for(const q of s.quiz)if(q.id===qid)return{q,s};return null;};
function cdDue(){if(!cdPronto())return[];const t=today(),S=CD().srs;return Object.keys(S).filter(k=>{const x=S[k].due<=t&&cdQ(k);return x&&cdVis(x.s);}).sort((a,b)=>S[a].due<S[b].due?-1:1);}
function cdMix(q,seed){const o=[q.ok].concat(q.wrong);let h=7;for(const ch of seed)h=(h*31+ch.charCodeAt(0))|0;for(let i=o.length-1;i>0;i--){h=(h*1103515245+12345)|0;const j=Math.abs(h)%(i+1);[o[i],o[j]]=[o[j],o[i]];}return o;}
async function cdCopy(t){try{await navigator.clipboard.writeText(t);return true;}catch(e){}try{const x=document.createElement("textarea");x.value=t;x.style.cssText="position:fixed;opacity:0";document.body.appendChild(x);x.select();const ok=document.execCommand("copy");x.remove();return ok;}catch(e){return false;}}
/* novità: copia sull'iPad per quando manca internet */
const cdNov=()=>lsJ(CD_NKEY)||{voci:[]};
let cdNBusy=false;
async function cdNovFetch(){const N=cdNov();if(cdNBusy||navigator.onLine===false)return;if(N.checked&&Date.now()-new Date(N.checked).getTime()<60*60e3)return;cdNBusy=true;
  try{const r=await fetch("cultura-novita.json?t="+Date.now(),{cache:"no-store"});if(!r.ok)throw 0;const o=await r.json();if(o.app!=="cultura-digitale"||!Array.isArray(o.voci))throw 0;
    const before=N.updated;o.checked=new Date().toISOString();try{localStorage.setItem(CD_NKEY,JSON.stringify(o));}catch(e){}if(o.updated!==before&&(cur==="cd"||cur==="cal"))softRender();}
  catch(e){try{N.checked=new Date().toISOString();localStorage.setItem(CD_NKEY,JSON.stringify(N));}catch(x){}}finally{cdNBusy=false;}}
const cdNovNew=()=>{const N=cdNov(),seen=CD().novVisto||"";return (N.voci||[]).filter(v=>(v.d||"")>seen&&cdVis(v)).length;};
setTimeout(cdNovFetch,2500);

function vCd(){if(!cdPronto())return lazyAtt();const c=CD(),due=cdDue().length,tot=CD_D.schede.filter(cdVis).length,fatte=CD_D.schede.filter(s=>cdVis(s)&&c.fatte[s.id]).length,nn=cdNovNew();
  let o=`<h1>🤖 Cultura digitale</h1><p class="sub">Che cos'è l'intelligenza artificiale, come chiederle le cose e come usarla senza rischi. Un passo alla volta: ogni scheda ha una prova pratica e tre domande.</p>`;
  o+=`<div class="kpi" style="margin-bottom:12px"><div><b>${fatte}/${tot}</b><span>schede fatte</span></div>${CD_LIV.map(l=>`<div><b>${cdAperto(l)?cdFatteL(l)+"/"+cdDel(l).length:"🔒"}</b><span>${l} · ${esc(CD_D.livelli[l])}</span></div>`).join("")}<div><b>${due}</b><span>domande da ripassare oggi</span></div></div>`;
  o+=`<div class="seg" role="tablist" style="margin:0 0 14px;width:max-content;max-width:100%">${CD_V.map(([k,n])=>`<button role="tab" data-cv2="${k}" class="${cdV===k?"on":""}" aria-selected="${cdV===k}">${n}${k==="rip"&&due?`<span class="n">${due}</span>`:""}${k==="nov"&&nn?`<span class="n">${nn}</span>`:""}</button>`).join("")}</div>`;
  if(cdV==="perc")o+=cdSel?cdSchedaV(cdScheda(cdSel)):cdPercorso();else if(cdV==="let")o+=cdLetture();else if(cdV==="rip")o+=cdRipasso();else o+=cdNovita();
  return o;}

/* 8/11/2026: schede, letture e novità sono riquadri che si aprono e chiudono, su due colonne (come l'Ikigai nel Metodo);
   chiusi all'inizio, lo stato resta su questo iPad (pn-fold, chiavi «cd|s:…», «cd|l:…», «cd|n:…»). Disegni in sezioni/cultura_img.js (caricato con i dati). */
let CD_IMG={},CD_INTRO="";const cdScr={},CD_LV=["","🌱","🌿","🌳"];
const cdW=(k,h3,body,cls,at)=>`<details class="card k-cd fold cd-w${cls?" "+cls:""}" data-k="${k}" data-fk="cd|${k}"${at||""}${foldSt["cd|"+k]===true?" open":""}><summary><h3>${h3}</h3></summary><div class="cd-wb" data-k2="${k}">${body}</div></details>`;
const cdTesto=s=>`${s.testo.map(p=>`<p>${esc(p)}</p>`).join("")}<div class="cd-punti"><b>📌 Da ricordare</b><ul>${s.punti.map(p=>`<li>${esc(p)}</li>`).join("")}</ul></div>`;
const cdProvaH=(s,full)=>`<p style="margin-top:0">${esc(s.prova.t)}</p><pre class="cd-prompt"${full?' id="cdPrompt"':""}>${esc(s.prova.prompt)}</pre><div class="dia-bar"><button class="btn pri" data-cdcopy="${s.id}">📋 Copia la richiesta</button><span class="lbl">poi incollala in un assistente (Claude, ChatGPT, Gemini o Copilot) e sostituisci i [segnaposto]</span></div><p class="lbl" style="margin:8px 0 0">👀 ${esc(s.prova.guarda)}</p>`;
function cdQuizH(s){const c=CD(),A=cdAns[s.id]||{};
  return `${s.quiz.map((q,k)=>{const a=A[q.id],opts=cdMix(q,q.id);return `<div class="cd-q"><b>${k+1}. ${esc(q.q)}</b><div class="cd-opts">${opts.map(x=>`<button class="cd-opt${a?(x===q.ok?" ok":x===a?" no":""):""}" data-cdq="${q.id}" data-cds="${s.id}" data-cdx="${esc(x)}"${a===q.ok?" disabled":""}>${esc(x)}</button>`).join("")}</div>${a?`<p class="cd-e">${a===q.ok?"✅ Giusto.":"❌ Non è questa: riprova."} ${a===q.ok?esc(q.e):""}</p>`:""}</div>`;}).join("")}
    ${c.fatte[s.id]?`<p class="cd-done">✓ Scheda fatta il ${fmt(c.fatte[s.id],{day:"numeric",month:"long"})}: le domande tornano nel ripasso.</p>`:""}`;}
const cdFonti=(s,k)=>s.fonti&&s.fonti.length?`<details class="more" data-k="${k}"><summary>🔎 Fonti</summary><div class="card k-cd nofold">${s.fonti.map(f=>`<div class="row"><div class="grow">${esc(f.c)}</div><a href="${esc(f.url)}" target="_blank" rel="noopener noreferrer">Apri ›</a></div>`).join("")}</div></details>`:"";

function cdPercorso(){let o=`<div class="card k-cd cd-intro"><h3>🧭 Come funziona il percorso</h3><div class="wide">${CD_INTRO}</div></div>`;
  CD_LIV.forEach(l=>{const ap=cdAperto(l),L=cdDel(l);
    o+=`<div class="cd-lh${ap?"":" cd-lock"}">${CD_LV[l]} Livello ${l} · ${esc(CD_D.livelli[l])} <span class="lbl">${ap?cdFatteL(l)+" di "+L.length+" fatte":"si apre dopo "+CD_SBLOCCO+" schede del livello "+(l-1)+" (ne hai fatte "+cdFatteU(l-1)+")"}</span></div>
      ${(()=>{const A=L.filter(s=>!CD().fatte[s.id]);return A.length?`<div class="cd-g">${A.map(s=>cdBox(s,ap)).join("")}</div>`:`<p class="lbl cd-tutte">✅ Tutte fatte: le trovi nell'archivio qui sotto.</p>`;})()}`;});
  /* 11/11/2026: le schede fatte passano nell'archivio (un riquadro che si apre e chiude); le loro domande restano nel ripasso */
  const F=CD_D.schede.filter(s=>cdVis(s)&&CD().fatte[s.id]).sort((a,b)=>CD().fatte[a.id]<CD().fatte[b.id]?1:-1);
  if(F.length)o+=`<details class="card k-cd fold cd-arch" data-fk="cd|arch"${foldSt["cd|arch"]===true?" open":""}><summary><h3>✅ Archivio · ${F.length} ${F.length===1?"scheda fatta":"schede fatte"}</h3></summary><p class="lbl" style="margin-top:0">Dalla più recente. Puoi riaprirle quando vuoi; le domande continuano a tornare nel 🔁 Ripasso.</p><div class="cd-g">${F.map(s=>cdBox(s,true)).join("")}</div></details>`;
  return o;}
function cdBox(s,ap){const c=CD(),T=CD_D.temi[s.tema],f=c.fatte[s.id];
  const st=!ap?`<span class="pill">🔒 bloccata</span>`:f?`<span class="pill ok">✓ fatta il ${fmt(f,{day:"numeric",month:"short"})}</span>`:`<span class="pill cd-todo">da fare</span>${c.lette[s.id]?`<span>letta, mancano le domande</span>`:""}`;
  const h=`<span class="cd-wt">${s.ic} ${esc(s.t)}</span><span class="cd-wm"><span>${CD_LV[s.liv]} Livello ${s.liv} · ${T[0]} ${esc(T[1])}</span>${st}</span>`;
  const b=(CD_IMG[s.id]||"")+(!ap?`<p class="lbl">🔒 Si apre dopo ${CD_SBLOCCO} schede del livello ${s.liv-1} (ne hai fatte ${cdFatteU(s.liv-1)}).</p>`:
    cdTesto(s)+(s.prova?`<h4>🧪 Prova adesso</h4>${cdProvaH(s,false)}`:"")+`<h4>❓ Tre domande</h4>${cdQuizH(s)}`+cdFonti(s,"sf:"+s.id)+`<div class="dia-bar"><button class="btn sm" data-cdopen="${s.id}">⤢ Apri la scheda a pagina intera</button></div>`);
  return cdW("s:"+s.id,h,b,f?"cd-fatta":ap?"":"cd-lock",ap?` data-cdw="${s.id}"`:"");}

function cdSchedaV(s){if(!s)return cdPercorso();const c=CD(),T=CD_D.temi[s.tema],L=cdDel(s.liv),i=L.indexOf(s),prev=L[i-1],next=L[i+1];
  if(!c.lette[s.id]){c.lette[s.id]=today();save();}
  let o=`<button class="btn sm" data-cdback="1">← Percorso</button><div class="card k-cd nofold cd-sch" style="margin-top:10px"><div class="lbl">${CD_LV[s.liv]} Livello ${s.liv} · ${T[0]} ${esc(T[1])}</div><h2 class="cd-t">${s.ic} ${esc(s.t)}</h2>${cdTesto(s)}</div>`;
  if(s.prova)o+=`<div class="card k-cd nofold"><h3>🧪 Prova adesso</h3>${cdProvaH(s,true)}</div>`;
  /* quiz */
  o+=`<div class="card k-cd nofold"><h3>❓ Tre domande</h3>${cdQuizH(s)}</div>`;
  o+=cdFonti(s,"sfp:"+s.id);
  o+=`<div class="dia-bar" style="margin-top:12px">${prev?`<button class="btn" data-cdopen="${prev.id}">← ${esc(prev.t)}</button>`:""}${next?`<button class="btn" data-cdopen="${next.id}">${esc(next.t)} →</button>`:""}</div>`;
  return o;}

function cdRipasso(){const due=cdDue();
  if(!due.length&&!(cdRip&&cdRip.a)){const S=CD().srs,nx=Object.values(S).map(x=>x.due).sort()[0];return `<div class="card k-cd nofold"><p class="empty">Niente da ripassare oggi. 👍${nx?" Il prossimo ripasso è "+rel(nx)+".":" Le domande entrano nel ripasso quando finisci una scheda."}</p></div>`;}
  if(!cdRip||(!cdRip.a&&!due.includes(cdRip.id)))cdRip={id:due[0],a:null};const {q,s}=cdQ(cdRip.id),a=cdRip.a,opts=cdMix(q,q.id+"r");
  return `<div class="card k-cd nofold"><div class="lbl">🔁 ${due.length||"ultima"} da ripassare · dalla scheda «${esc(s.t)}»</div><div class="cd-q"><b>${esc(q.q)}</b><div class="cd-opts">${opts.map(x=>`<button class="cd-opt${a?(x===q.ok?" ok":x===a?" no":""):""}" data-cdr="${esc(x)}"${a?" disabled":""}>${esc(x)}</button>`).join("")}</div>${a?`<p class="cd-e">${a===q.ok?"✅ Giusto.":"❌ La risposta giusta è quella in verde."} ${esc(q.e)}</p><button class="btn pri" data-cdrnext="1">Avanti</button>`:""}</div></div>`;}

function cdNovita(){const N=cdNov(),V=(N.voci||[]).slice().sort((a,b)=>a.d<b.d?1:-1),seen=CD().novVisto||"";
  /* 3/11/2026: niente filtro «Tutte»: una colonna per tema, affiancate, che scorrono dentro */
  let o="";
  if(!V.length)return o+`<p class="empty">${N.updated?"Nessuna novità.":"Le novità arrivano da internet: riapri la pagina quando sei collegato."}</p>`;
  const cdRow=v=>`<div class="row cd-nov"><span class="pill${v.d>seen?" cd-new":""}">${fmt(v.d,{day:"numeric",month:"short",year:"numeric"})}</span><div class="grow"><b>${CD_D.temi[v.tema]?CD_D.temi[v.tema][0]+" ":""}${esc(v.t)}</b><p>${esc(v.s)}</p><small>👉 ${esc(v.perche)}</small><small><a href="${esc(v.url)}" target="_blank" rel="noopener noreferrer">${esc(v.fonte)} ›</a></small></div></div>`;
  /* 8/11/2026: un riquadro per tema, su due colonne, chiuso all'inizio */
  o+=`<div class="cd-g">${Object.keys(CD_D.temi).filter(k=>!CD_NASCOSTI.includes(k)).map(k=>{const L=V.filter(v=>v.tema===k),nw=L.filter(v=>v.d>seen).length;if(!L.length&&k==="app")return "";
    return cdW("n:"+k,`<span class="cd-wt">${CD_D.temi[k][0]} ${esc(CD_D.temi[k][1])}</span><span class="cd-wm"><span class="pill">${L.length} ${L.length===1?"notizia":"notizie"}</span>${nw?`<span class="pill cd-new">${nw} ${nw===1?"nuova":"nuove"}</span>`:""}${L[0]?`<span>l'ultima: ${fmt(L[0].d,{day:"numeric",month:"short",year:"numeric"})}</span>`:""}</span>`,L.map(cdRow).join("")||'<p class="empty">Nessuna novità.</p>',"cd-nw");}).join("")}</div>`;
  o+=`<p class="lbl">Aggiornate ${N.updated?fmt(N.updated.slice(0,10),{day:"numeric",month:"long",year:"numeric"}):"—"} dall'attività programmata, una volta al mese, solo da fonti verificate. Non sono consigli.</p>`;
  return o;}


/* ---- 📚 letture consigliate, con riassunto (scritto con parole nostre) e idee chiave ---- */
let cdLF="",cdLOpen=null;
function cdLetture(){const c=CD(),St=c.lib||{},TUT=(CD_D.letture||[]).filter(cdVis),L=TUT.filter(x=>cdLF==="lette"?St[x.id]==="letto":St[x.id]!=="letto"&&(cdLF==="gratis"?x.gratis:true)),LA=cdLF==="lette"?[]:TUT.filter(x=>St[x.id]==="letto"&&(cdLF==="gratis"?x.gratis:true));
  const TIP={libro:"📕 Libro",guida:"📘 Guida",corso:"🎓 Corso",articolo:"📰 Articolo",rapporto:"📊 Rapporto"},n=TUT.filter(x=>St[x.id]==="letto").length;
  let o=`<p class="lbl" style="margin-top:0">Libri e risorse scelti per andare oltre le schede: per ognuno un riassunto e le idee chiave, poi decidi tu se leggerlo. ${n} lette su ${TUT.length}.</p>`;
  o+=`<div class="seg" role="tablist" style="margin:0 0 12px;width:max-content;max-width:100%">${[["","Da leggere"],["gratis","Gratuite"],["lette","Lette"]].map(([k,t])=>`<button data-cdlf="${k}" class="${cdLF===k?"on":""}">${t}</button>`).join("")}</div>`;
  if(!L.length&&!LA.length)return o+`<p class="empty">Nessuna lettura qui.</p>`;
  const cdLBox=x=>{const T=CD_D.temi[x.tema]||["",""],st=St[x.id];
  /* 8/11/2026: ogni lettura è un riquadro (chiuso all'inizio): aprendolo si leggono riassunto e idee chiave */
    return cdW("l:"+x.id,`<span class="cd-wt">${esc(x.t)}</span><span class="cd-wm"><span>${TIP[x.tipo]||""} · ${T[0]} ${esc(T[1])} · livello ${x.liv}${x.gratis?" · gratuita":""}</span>${st==="letto"?`<span class="pill cd-new">✓ letta</span>`:st==="voglio"?`<span class="pill">🔖 da leggere</span>`:""}</span>`,
    `<small class="cd-la">${esc(x.autore)} · ${esc(x.editore)}, ${x.anno}</small><p style="margin:8px 0 0">${esc(x.perche)}</p>
    <div class="cd-ris"><b>📝 Riassunto</b>${x.riassunto.map(p=>`<p>${esc(p)}</p>`).join("")}<b>💡 Idee chiave</b><ul>${x.idee.map(i=>`<li>${esc(i)}</li>`).join("")}</ul><p class="lbl">📍 ${esc(x.dove)} · <a href="${esc(x.url)}" target="_blank" rel="noopener noreferrer">Apri ›</a></p></div>
    <div class="dia-bar">${st!=="voglio"&&st!=="letto"?`<button class="btn sm" data-cdls="${x.id}:voglio">🔖 Da leggere</button>`:""}${st!=="letto"?`<button class="btn sm ok" data-cdls="${x.id}:letto">✓ Letta</button>`:`<button class="btn sm" data-cdls="${x.id}:">↩︎</button>`}</div>`,st==="letto"?"cd-let cd-fatta":"cd-let");};
  o+=L.length?`<div class="cd-g">`+L.map(cdLBox).join("")+`</div>`:`<p class="lbl cd-tutte">✅ Qui le hai lette tutte: sono nell'archivio qui sotto.</p>`;
  if(LA.length)o+=`<details class="card k-cd fold cd-arch" data-fk="cd|archl"${foldSt["cd|archl"]===true?" open":""}><summary><h3>✅ Archivio · ${LA.length} ${LA.length===1?"lettura letta":"letture lette"}</h3></summary><div class="cd-g">${LA.map(cdLBox).join("")}</div></details>`;
  return o+`<p class="lbl">Riassunti scritti per questa app e controllati da un revisore; non sostituiscono la lettura. Molti libri si trovano anche nelle biblioteche civiche.</p>`;}
/* riquadro nel riepilogo di oggi */
function cdCard(){if(!cdPronto())return "";const due=cdDue().length,nn=cdNovNew(),c=CD(),last=Object.values(c.fatte).sort().pop(),nx=CD_LIV.filter(cdAperto).map(cdDel).flat().find(s=>!c.fatte[s.id]),rows=[];
  if(due)rows.push(`<div class="row"><div class="grow"><b>🔁 Ripasso di oggi</b><small>${due} ${due===1?"domanda":"domande"}</small></div><button class="btn sm" data-cdgo="rip">Ripassa</button></div>`);
  if(nn)rows.push(`<div class="row"><div class="grow"><b>📰 Novità sull'IA</b><small>${nn} ${nn===1?"nuova":"nuove"}</small></div><button class="btn sm" data-cdgo="nov">Leggi</button></div>`);
  if(nx&&(!last||diff(last,today())>=7))rows.push(`<div class="row"><div class="grow"><b>${nx.ic} Prossima scheda</b><small>${esc(nx.t)}</small></div><button class="btn sm" data-cdgo="perc" data-cdid="${nx.id}">Apri</button></div>`);
  return rows.length?`<div class="card k-cd"><h3>🤖 Cultura digitale <button class="lnk" data-go="cd">Apri ›</button></h3>${rows.join("")}</div>`:"";}

function bindCd(){const R=()=>render(),qa=s=>document.querySelectorAll(s),c=CD();
  qa("[data-cv2]").forEach(b=>b.onclick=()=>{cdV=b.dataset.cv2;cdSel=null;if(cdV==="nov"){const N=cdNov(),m=(N.voci||[]).map(v=>v.d).sort().pop();if(m&&m>(c.novVisto||"")){R();c.novVisto=m;save();return;}}R();});
  qa("[data-cdt]").forEach(b=>b.onclick=()=>{cdTema=b.dataset.cdt;R();});
  qa("[data-cdlf]").forEach(b=>b.onclick=()=>{cdLF=b.dataset.cdlf;R();});
  qa("[data-cdlo]").forEach(b=>b.onclick=()=>{cdLOpen=cdLOpen===b.dataset.cdlo?null:b.dataset.cdlo;R();});
  qa("[data-cdls]").forEach(b=>b.onclick=()=>{const [id,st]=b.dataset.cdls.split(":");c.lib=c.lib||{};if(st)c.lib[id]=st;else delete c.lib[id];save();toast(st==="letto"?"✓ Segnata come letta":st?"🔖 Nella lista da leggere":"Tolta dalle lette");R();});
  qa("[data-cdopen]").forEach(b=>b.onclick=()=>{cdSel=b.dataset.cdopen;R();window.scrollTo(0,0);});
  qa("[data-cdback]").forEach(b=>b.onclick=()=>{cdSel=null;R();});
  qa("[data-cdcopy]").forEach(b=>b.onclick=async()=>{const s=cdScheda(b.dataset.cdcopy)||cdScheda(cdSel);if(s&&s.prova&&await cdCopy(s.prova.prompt))toast("📋 Richiesta copiata");else toast("Copia non riuscita: seleziona il testo a mano");});
  qa("[data-cdq]").forEach(b=>b.onclick=()=>{const s=cdScheda(b.dataset.cds),qid=b.dataset.cdq,x=b.dataset.cdx,q=s.quiz.find(z=>z.id===qid);
    const A=cdAns[s.id]=cdAns[s.id]||{};A[qid]=x;
    if(s.quiz.every(z=>A[z.id]===z.ok)&&!c.fatte[s.id]){c.fatte[s.id]=today();s.quiz.forEach(z=>{if(!c.srs[z.id])c.srs[z.id]={n:0,due:add(today(),CD_STEP[0])};});save();toast("✓ Scheda fatta");
      const l=s.liv;if(l<3&&cdFatteU(l)===CD_SBLOCCO)setTimeout(()=>toast("🔓 Si è aperto il livello "+(l+1)),1900);}
    R();});
  qa("[data-cdr]").forEach(b=>b.onclick=()=>{if(!cdRip)return;cdRip.a=b.dataset.cdr;const {q}=cdQ(cdRip.id),S=c.srs[cdRip.id]||{n:0};
    if(cdRip.a===q.ok)S.n=Math.min(S.n+1,CD_STEP.length-1);else S.n=0;S.due=add(today(),CD_STEP[S.n]);S.ult=today();c.srs[cdRip.id]=S;save();R();});
  qa("[data-cdrnext]").forEach(b=>b.onclick=()=>{cdRip=null;R();});
  /* aprire il riquadro di una scheda vale come aprirla (come prima a pagina intera): «letta, mancano le domande» */
  qa("details[data-cdw]").forEach(d=>d.addEventListener("toggle",()=>{const id=d.dataset.cdw;if(d.open&&!c.lette[id]){c.lette[id]=today();save();}}));
  /* lo scorrimento dentro i riquadri resta dov'era quando la pagina si ridisegna (per esempio dopo una risposta) */
  qa(".cd-wb").forEach(w=>{const k=w.dataset.k2;if(cdScr[k])w.scrollTop=cdScr[k];w.addEventListener("scroll",()=>{cdScr[k]=w.scrollTop;},{passive:true});});
}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-cdgo]");if(!b)return;cdV=b.dataset.cdgo;cdSel=b.dataset.cdid||null;go("cd");});
