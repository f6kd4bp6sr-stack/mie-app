/* ---------- 🤖 CULTURA DIGITALE: che cos'è l'intelligenza artificiale e come usarla bene ----------
   Percorso a livelli (1 Base · 2 Intermedio · 3 Avanzato): il livello dopo si apre con 4 schede fatte del livello prima.
   Ogni scheda: testo breve, «da ricordare», 🧪 Prova adesso (richiesta pronta da copiare, con [segnaposto] al posto dei dati),
   3 domande; quando sono giuste tutte e tre la scheda è fatta e le domande entrano nel 🔁 ripasso a intervalli (1, 3, 7, 14, 30, 60 giorni).
   📰 Novità del mese: file pubblico cultura-novita.json, aggiornato dall'attività programmata (fonti ufficiali).
   Contenuti: sezioni/cultura_dati.json (autore + revisore indipendente, controllo strumenti/verifica_cultura.py). Progressi in P.cd. */
const CD_V=[["perc","🧭 Percorso"],["rip","🔁 Ripasso"],["nov","📰 Novità"]],CD_STEP=[1,3,7,14,30,60],CD_SBLOCCO=4,CD_NKEY="pn-cd-novita";
let cdV="perc",cdSel=null,cdAns={},cdRip=null,cdTema="";
function CD(){if(!P.cd||typeof P.cd!=="object")P.cd={};const c=P.cd;["fatte","srs","lette"].forEach(k=>{if(!c[k]||typeof c[k]!=="object")c[k]={};});return c;}
const cdScheda=id=>CD_D.schede.find(s=>s.id===id);
const cdDel=l=>CD_D.schede.filter(s=>s.liv===l);
const cdFatteL=l=>cdDel(l).filter(s=>CD().fatte[s.id]).length;
const cdAperto=l=>l===1||cdFatteL(l-1)>=CD_SBLOCCO;
const cdQ=qid=>{for(const s of CD_D.schede)for(const q of s.quiz)if(q.id===qid)return{q,s};return null;};
function cdDue(){const t=today(),S=CD().srs;return Object.keys(S).filter(k=>S[k].due<=t&&cdQ(k)).sort((a,b)=>S[a].due<S[b].due?-1:1);}
function cdMix(q,seed){const o=[q.ok].concat(q.wrong);let h=7;for(const ch of seed)h=(h*31+ch.charCodeAt(0))|0;for(let i=o.length-1;i>0;i--){h=(h*1103515245+12345)|0;const j=Math.abs(h)%(i+1);[o[i],o[j]]=[o[j],o[i]];}return o;}
async function cdCopy(t){try{await navigator.clipboard.writeText(t);return true;}catch(e){}try{const x=document.createElement("textarea");x.value=t;x.style.cssText="position:fixed;opacity:0";document.body.appendChild(x);x.select();const ok=document.execCommand("copy");x.remove();return ok;}catch(e){return false;}}
/* novità: copia sull'iPad per quando manca internet */
const cdNov=()=>lsJ(CD_NKEY)||{voci:[]};
let cdNBusy=false;
async function cdNovFetch(){const N=cdNov();if(cdNBusy||navigator.onLine===false)return;if(N.checked&&Date.now()-new Date(N.checked).getTime()<60*60e3)return;cdNBusy=true;
  try{const r=await fetch("cultura-novita.json?t="+Date.now(),{cache:"no-store"});if(!r.ok)throw 0;const o=await r.json();if(o.app!=="cultura-digitale"||!Array.isArray(o.voci))throw 0;
    const before=N.updated;o.checked=new Date().toISOString();try{localStorage.setItem(CD_NKEY,JSON.stringify(o));}catch(e){}if(o.updated!==before&&(cur==="cd"||cur==="cal"))softRender();}
  catch(e){try{N.checked=new Date().toISOString();localStorage.setItem(CD_NKEY,JSON.stringify(N));}catch(x){}}finally{cdNBusy=false;}}
const cdNovNew=()=>{const N=cdNov(),seen=CD().novVisto||"";return (N.voci||[]).filter(v=>(v.d||"")>seen).length;};
setTimeout(cdNovFetch,2500);

function vCd(){const c=CD(),due=cdDue().length,tot=CD_D.schede.length,fatte=CD_D.schede.filter(s=>c.fatte[s.id]).length,nn=cdNovNew();
  let o=`<h1>🤖 Cultura digitale</h1><p class="sub">Che cos'è l'intelligenza artificiale, come chiederle le cose e come usarla senza rischi. Un passo alla volta: ogni scheda ha una prova pratica e tre domande.</p>`;
  o+=`<div class="kpi" style="margin-bottom:12px"><div><b>${fatte}/${tot}</b><span>schede fatte</span></div>${[1,2,3].map(l=>`<div><b>${cdAperto(l)?cdFatteL(l)+"/"+cdDel(l).length:"🔒"}</b><span>${l} · ${esc(CD_D.livelli[l])}</span></div>`).join("")}<div><b>${due}</b><span>domande da ripassare oggi</span></div></div>`;
  o+=`<div class="seg" role="tablist" style="margin:0 0 14px;width:max-content;max-width:100%">${CD_V.map(([k,n])=>`<button role="tab" data-cv2="${k}" class="${cdV===k?"on":""}" aria-selected="${cdV===k}">${n}${k==="rip"&&due?`<span class="n">${due}</span>`:""}${k==="nov"&&nn?`<span class="n">${nn}</span>`:""}</button>`).join("")}</div>`;
  if(cdV==="perc")o+=cdSel?cdSchedaV(cdScheda(cdSel)):cdPercorso();else if(cdV==="rip")o+=cdRipasso();else o+=cdNovita();
  return o;}

function cdPercorso(){const c=CD();let o="";
  [1,2,3].forEach(l=>{const ap=cdAperto(l),L=cdDel(l);
    o+=`<div class="card k-cd${ap?"":" cd-lock"}"><h3>${["","🌱","🌿","🌳"][l]} Livello ${l} · ${esc(CD_D.livelli[l])} <span class="lbl">${ap?cdFatteL(l)+" di "+L.length+" fatte":"si apre dopo "+CD_SBLOCCO+" schede del livello "+(l-1)+" (ne hai fatte "+cdFatteL(l-1)+")"}</span></h3>
      ${L.map(s=>{const T=CD_D.temi[s.tema],f=c.fatte[s.id];return `<div class="row"><span class="cd-ic">${s.ic}</span><div class="grow"><b>${esc(s.t)}</b><small>${T[0]} ${esc(T[1])}${f?" · ✓ fatta il "+fmt(f,{day:"numeric",month:"short"}):c.lette[s.id]?" · letta, mancano le domande":""}</small></div>${ap?`<button class="btn sm${f?"":" pri"}" data-cdopen="${s.id}">${f?"Rivedi":"Apri"}</button>`:`<span class="pill">🔒</span>`}</div>`;}).join("")}</div>`;});
  return o;}

function cdSchedaV(s){if(!s)return cdPercorso();const c=CD(),T=CD_D.temi[s.tema],L=cdDel(s.liv),i=L.indexOf(s),prev=L[i-1],next=L[i+1];
  if(!c.lette[s.id]){c.lette[s.id]=today();save();}
  let o=`<button class="btn sm" data-cdback="1">← Percorso</button><div class="card k-cd nofold cd-sch" style="margin-top:10px"><div class="lbl">${["","🌱","🌿","🌳"][s.liv]} Livello ${s.liv} · ${T[0]} ${esc(T[1])}</div><h2 class="cd-t">${s.ic} ${esc(s.t)}</h2>${s.testo.map(p=>`<p>${esc(p)}</p>`).join("")}
    <div class="cd-punti"><b>📌 Da ricordare</b><ul>${s.punti.map(p=>`<li>${esc(p)}</li>`).join("")}</ul></div></div>`;
  if(s.prova)o+=`<div class="card k-cd nofold"><h3>🧪 Prova adesso</h3><p style="margin-top:0">${esc(s.prova.t)}</p><pre class="cd-prompt" id="cdPrompt">${esc(s.prova.prompt)}</pre><div class="dia-bar"><button class="btn pri" data-cdcopy="1">📋 Copia la richiesta</button><span class="lbl">poi incollala in un assistente (Claude, ChatGPT, Gemini o Copilot) e sostituisci i [segnaposto]</span></div><p class="lbl" style="margin:8px 0 0">👀 ${esc(s.prova.guarda)}</p></div>`;
  /* quiz */
  const A=cdAns[s.id]||{};
  o+=`<div class="card k-cd nofold"><h3>❓ Tre domande</h3>${s.quiz.map((q,k)=>{const a=A[q.id],opts=cdMix(q,q.id);return `<div class="cd-q"><b>${k+1}. ${esc(q.q)}</b><div class="cd-opts">${opts.map(x=>`<button class="cd-opt${a?(x===q.ok?" ok":x===a?" no":""):""}" data-cdq="${q.id}" data-cds="${s.id}" data-cdx="${esc(x)}"${a===q.ok?" disabled":""}>${esc(x)}</button>`).join("")}</div>${a?`<p class="cd-e">${a===q.ok?"✅ Giusto.":"❌ Non è questa: riprova."} ${a===q.ok?esc(q.e):""}</p>`:""}</div>`;}).join("")}
    ${c.fatte[s.id]?`<p class="cd-done">✓ Scheda fatta il ${fmt(c.fatte[s.id],{day:"numeric",month:"long"})}: le domande tornano nel ripasso.</p>`:""}</div>`;
  if(s.fonti&&s.fonti.length)o+=`<details class="more"><summary>🔎 Fonti</summary><div class="card k-cd nofold">${s.fonti.map(f=>`<div class="row"><div class="grow">${esc(f.c)}</div><a href="${esc(f.url)}" target="_blank" rel="noopener noreferrer">Apri ›</a></div>`).join("")}</div></details>`;
  o+=`<div class="dia-bar" style="margin-top:12px">${prev?`<button class="btn" data-cdopen="${prev.id}">← ${esc(prev.t)}</button>`:""}${next?`<button class="btn" data-cdopen="${next.id}">${esc(next.t)} →</button>`:""}</div>`;
  return o;}

function cdRipasso(){const due=cdDue();
  if(!due.length&&!(cdRip&&cdRip.a)){const S=CD().srs,nx=Object.values(S).map(x=>x.due).sort()[0];return `<div class="card k-cd nofold"><p class="empty">Niente da ripassare oggi. 👍${nx?" Il prossimo ripasso è "+rel(nx)+".":" Le domande entrano nel ripasso quando finisci una scheda."}</p></div>`;}
  if(!cdRip||(!cdRip.a&&!due.includes(cdRip.id)))cdRip={id:due[0],a:null};const {q,s}=cdQ(cdRip.id),a=cdRip.a,opts=cdMix(q,q.id+"r");
  return `<div class="card k-cd nofold"><div class="lbl">🔁 ${due.length||"ultima"} da ripassare · dalla scheda «${esc(s.t)}»</div><div class="cd-q"><b>${esc(q.q)}</b><div class="cd-opts">${opts.map(x=>`<button class="cd-opt${a?(x===q.ok?" ok":x===a?" no":""):""}" data-cdr="${esc(x)}"${a?" disabled":""}>${esc(x)}</button>`).join("")}</div>${a?`<p class="cd-e">${a===q.ok?"✅ Giusto.":"❌ La risposta giusta è quella in verde."} ${esc(q.e)}</p><button class="btn pri" data-cdrnext="1">Avanti</button>`:""}</div></div>`;}

function cdNovita(){const N=cdNov(),V=(N.voci||[]).slice().sort((a,b)=>a.d<b.d?1:-1).filter(v=>!cdTema||v.tema===cdTema),seen=CD().novVisto||"";
  let o=`<div class="seg" role="tablist" style="margin:0 0 12px;width:max-content;max-width:100%"><button data-cdt="" class="${cdTema?"":"on"}">Tutte</button>${Object.keys(CD_D.temi).map(k=>`<button data-cdt="${k}" class="${cdTema===k?"on":""}">${CD_D.temi[k][0]} ${esc(CD_D.temi[k][1])}</button>`).join("")}</div>`;
  if(!V.length)return o+`<p class="empty">${N.updated?"Nessuna novità su questo tema.":"Le novità arrivano da internet: riapri la pagina quando sei collegato."}</p>`;
  o+=`<div class="card k-cd nofold">${V.map(v=>`<div class="row cd-nov"><span class="pill${v.d>seen?" cd-new":""}">${fmt(v.d,{day:"numeric",month:"short",year:"numeric"})}</span><div class="grow"><b>${CD_D.temi[v.tema]?CD_D.temi[v.tema][0]+" ":""}${esc(v.t)}</b><p>${esc(v.s)}</p><small>👉 ${esc(v.perche)}</small><small><a href="${esc(v.url)}" target="_blank" rel="noopener noreferrer">${esc(v.fonte)} ›</a></small></div></div>`).join("")}</div>`;
  o+=`<p class="lbl">Aggiornate ${N.updated?fmt(N.updated.slice(0,10),{day:"numeric",month:"long",year:"numeric"}):"—"} dall'attività programmata, una volta al mese, solo da fonti verificate. Non sono consigli.</p>`;
  return o;}

/* riquadro nel riepilogo di oggi */
function cdCard(){const due=cdDue().length,nn=cdNovNew(),c=CD(),last=Object.values(c.fatte).sort().pop(),nx=[1,2,3].filter(cdAperto).map(cdDel).flat().find(s=>!c.fatte[s.id]),rows=[];
  if(due)rows.push(`<div class="row"><div class="grow"><b>🔁 Ripasso di oggi</b><small>${due} ${due===1?"domanda":"domande"}</small></div><button class="btn sm" data-cdgo="rip">Ripassa</button></div>`);
  if(nn)rows.push(`<div class="row"><div class="grow"><b>📰 Novità sull'IA</b><small>${nn} ${nn===1?"nuova":"nuove"}</small></div><button class="btn sm" data-cdgo="nov">Leggi</button></div>`);
  if(nx&&(!last||diff(last,today())>=7))rows.push(`<div class="row"><div class="grow"><b>${nx.ic} Prossima scheda</b><small>${esc(nx.t)}</small></div><button class="btn sm" data-cdgo="perc" data-cdid="${nx.id}">Apri</button></div>`);
  return rows.length?`<div class="card k-cd"><h3>🤖 Cultura digitale <button class="lnk" data-go="cd">Apri ›</button></h3>${rows.join("")}</div>`:"";}

function bindCd(){const R=()=>render(),qa=s=>document.querySelectorAll(s),c=CD();
  qa("[data-cv2]").forEach(b=>b.onclick=()=>{cdV=b.dataset.cv2;cdSel=null;if(cdV==="nov"){const N=cdNov(),m=(N.voci||[]).map(v=>v.d).sort().pop();if(m&&m>(c.novVisto||"")){R();c.novVisto=m;save();return;}}R();});
  qa("[data-cdt]").forEach(b=>b.onclick=()=>{cdTema=b.dataset.cdt;R();});
  qa("[data-cdopen]").forEach(b=>b.onclick=()=>{cdSel=b.dataset.cdopen;R();window.scrollTo(0,0);});
  qa("[data-cdback]").forEach(b=>b.onclick=()=>{cdSel=null;R();});
  qa("[data-cdcopy]").forEach(b=>b.onclick=async()=>{const s=cdScheda(cdSel);if(s&&s.prova&&await cdCopy(s.prova.prompt))toast("📋 Richiesta copiata");else toast("Copia non riuscita: seleziona il testo a mano");});
  qa("[data-cdq]").forEach(b=>b.onclick=()=>{const s=cdScheda(b.dataset.cds),qid=b.dataset.cdq,x=b.dataset.cdx,q=s.quiz.find(z=>z.id===qid);
    const A=cdAns[s.id]=cdAns[s.id]||{};A[qid]=x;
    if(s.quiz.every(z=>A[z.id]===z.ok)&&!c.fatte[s.id]){c.fatte[s.id]=today();s.quiz.forEach(z=>{if(!c.srs[z.id])c.srs[z.id]={n:0,due:add(today(),CD_STEP[0])};});save();toast("✓ Scheda fatta");
      const l=s.liv;if(l<3&&cdFatteL(l)===CD_SBLOCCO)setTimeout(()=>toast("🔓 Si è aperto il livello "+(l+1)),1900);}
    R();});
  qa("[data-cdr]").forEach(b=>b.onclick=()=>{if(!cdRip)return;cdRip.a=b.dataset.cdr;const {q}=cdQ(cdRip.id),S=c.srs[cdRip.id]||{n:0};
    if(cdRip.a===q.ok)S.n=Math.min(S.n+1,CD_STEP.length-1);else S.n=0;S.due=add(today(),CD_STEP[S.n]);S.ult=today();c.srs[cdRip.id]=S;save();R();});
  qa("[data-cdrnext]").forEach(b=>b.onclick=()=>{cdRip=null;R();});
}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-cdgo]");if(!b)return;cdV=b.dataset.cdgo;cdSel=b.dataset.cdid||null;go("cd");});
