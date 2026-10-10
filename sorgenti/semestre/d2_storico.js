/* ================= STORICO DELLE PROVE, OBIETTIVO DI STUDIO DAGLI ERRORI, RIPASSO GUIDATO =================
   - Ogni prova (test d'ingresso, serie di esercizi, esercizi di un argomento, simulazione) crea una voce in S.hist
     con data e ora e tutte le risposte date: si riapre quando si vuole, anche dopo mesi.
   - Dagli errori nasce in automatico un obiettivo di studio (S.goal) con gli argomenti su cui lavorare.
   - Il ripasso guidato ripercorre per ogni argomento sbagliato i concetti chiave, la trappola e la spiegazione di ogni errore.
   Tutto si salva da solo sul dispositivo, senza nessuna richiesta. */
const HMAX=300;let TPS=null,HID=null;
const ansTxt=(q,v)=>v==null||v===""?null:q.k==="m"?q.o[v]:String(v);
const fmtTS=ts=>{const d=new Date(ts);return d.toLocaleDateString("it-IT",{weekday:"short",day:"numeric",month:"short",year:"numeric"})+", ore "+d.toLocaleTimeString("it-IT",{hour:"2-digit",minute:"2-digit"});};
function hNew(type,lab,extra){const h=Object.assign({id:Date.now().toString(36)+Math.random().toString(36).slice(2,6),ts:new Date().toISOString(),type,lab,items:[],done:false},extra||{});
  S.hist.push(h);if(S.hist.length>HMAX)S.hist.splice(0,S.hist.length-HMAX);return h;}
const hGet=id=>S.hist.find(x=>x.id===id);
/* ogni risposta data negli esercizi finisce subito nello storico */
function logAns(ctx,q,val,ok){let h=null;
  if(ctx==="pr"&&PR){h=PR.h&&hGet(PR.h);if(!h){h=hNew("es",PR.lab,{n:PR.list.length});PR.h=h.id;}}
  else if(ctx==="tp"){if(!TPS||TPS.t!==curT||!hGet(TPS.h)){const x=hNew("arg","Esercizi dell'argomento: "+TP[q.t].t,{t:q.t});TPS={t:curT,h:x.id};}h=hGet(TPS.h);}
  if(!h)return;h.items.push({id:q.id,a:ansTxt(q,val),ok:!!ok});if(ctx==="pr"&&PR&&h.items.length>=PR.list.length)h.done=true;}
function logSim(r,g){hNew("sim","Simulazione d'esame",{done:true,pts:g.pts,sim:S.sims.length-1,min:Math.round((Date.now()-r.start)/60e3),
  items:r.q.map((id,i)=>{const q=QI[id],v=r.a[i];return {id,a:q?ansTxt(q,v):null,ok:!!(q&&v!=null&&v!==""&&(q.k==="m"?v===q.a:cpOK(q,v)))};})});}
function logPT(sc,lev){hNew("pt","Test d'ingresso",{done:true,score:sc,n:PT.length,lev,items:PT.map((q,i)=>({k:i,a:PTA.a[i]==null?null:q.o[PTA.a[i]],ok:PTA.a[i]===q.a}))});}
/* le prove fatte prima di questa versione entrano nello storico (simulazioni e ultimo test d'ingresso) */
function histMigrate(){EXORD.forEach(k=>withExam(k,()=>{if(S.hist.length||(!S.sims.length&&!(S.pt&&S.pt.ans)))return;
  S.sims.forEach((s,si)=>S.hist.push({id:"s"+si+"-"+Date.parse(s.date).toString(36),ts:s.date,type:"sim",lab:"Simulazione d'esame",done:true,pts:s.pts,sim:si,min:s.min,
    items:(s.q||[]).map((id,i)=>{const q=QI[id],v=s.a?s.a[i]:null;return {id,a:q?ansTxt(q,v):null,ok:!!(q&&v!=null&&v!==""&&(q.k==="m"?v===q.a:cpOK(q,v)))};})}));
  if(S.pt&&S.pt.ans)S.hist.push({id:"pt-"+S.pt.date,ts:S.pt.date+"T12:00:00",type:"pt",lab:"Test d'ingresso",done:true,score:S.pt.score,n:PT.length,lev:S.pt.lev,items:PT.map((q,i)=>({k:i,a:S.pt.ans[i],ok:S.pt.ans[i]===q.o[q.a]}))});
  S.hist.sort((a,b)=>a.ts<b.ts?-1:1);}));}

/* ----- errori aperti e obiettivo di studio ----- */
function lastGiven(qid){for(let i=S.hist.length-1;i>=0;i--){const it=S.hist[i].items.find(x=>x.id===qid);if(it)return it;}return null;}
function errTopics(){const m={};const add=(t,k,n)=>{if(!TP[t])return;m[t]=m[t]||{t,open:[],pt:[],ko:(S.tp[t]||{}).ko||0};m[t][k].push(n);};
  QB.forEach(q=>{const s=S.qs[q.id];if(s&&s.last===0)add(q.t,"open",q.id);});
  if(S.pt&&S.pt.ans)PT.forEach((q,i)=>{if(q.t&&S.pt.ans[i]!==q.o[q.a]&&tScore(q.t)<60)add(q.t,"pt",i);});
  return Object.values(m).map(x=>Object.assign(x,{w:x.open.length*3+x.pt.length*2+x.ko,sc:tScore(x.t)})).sort((a,b)=>b.w-a.w||a.sc-b.sc);}
const GOAL_SC=60;
const goalOK=t=>{const s=S.qs,open=QB.some(q=>q.t===t&&s[q.id]&&s[q.id].last===0);return !open&&tScore(t)>=GOAL_SC;};
function ensureGoal(){if(!E.ready)return;const g=S.goal;
  if(g&&g.t.every(goalOK)){S.goalsDone=(S.goalsDone||[]).concat([{ts:g.ts,end:new Date().toISOString(),t:g.t}]).slice(-50);S.goal=null;}
  if(!S.goal){const et=errTopics().slice(0,5).map(x=>x.t).filter(t=>!goalOK(t));if(!et.length)return;
    const dl=new Date();dl.setDate(dl.getDate()+7);const lim=dOf(EXAM1);lim.setDate(lim.getDate()-3);const end=dl<lim?dl:(new Date()<lim?lim:dl);
    S.goal={ts:new Date().toISOString(),deadline:iso(end),t:et};}
  let ch=S.goal!==g;
  /* gli errori nuovi entrano nell'obiettivo in corso (fino a 6 argomenti) */
  if(S.goal&&S.goal.t.length<6){const add=errTopics().filter(x=>x.open.length&&!S.goal.t.includes(x.t)).map(x=>x.t).slice(0,6-S.goal.t.length);if(add.length){S.goal.t=S.goal.t.concat(add);ch=true;}}
  if(ch)setTimeout(save,0);}
function goalHTML(mini){ensureGoal();const g=S.goal,ndone=(S.goalsDone||[]).length;
  if(!g)return mini?"":`<div class="card goal"><h3>🎯 Obiettivo di studio</h3><p style="margin:0">${S.hist.length?"Nessun errore aperto: ottimo! Continua con una simulazione o con gli argomenti che non hai ancora affrontato.":"L'obiettivo nasce dagli errori: fai il test d'ingresso o una serie di esercizi e l'app costruirà qui il tuo obiettivo."}${ndone?` Obiettivi già raggiunti: <b>${ndone}</b>.`:""}</p></div>`;
  const ok=g.t.filter(goalOK).length,first=g.t.find(t=>!goalOK(t)),dd=daysTo(g.deadline);
  const rows=g.t.map(t=>{const sc=tScore(t),open=QB.filter(q=>q.t===t&&S.qs[q.id]&&S.qs[q.id].last===0).length,d=goalOK(t);
    return `<div class="grow-row${d?" done":""}"><div class="grow"><b>${d?"✅ ":""}${esc(TP[t].t)}</b><small>${UN[TP[t].u].ic} ${esc(UN[TP[t].u].t)} · ${open?`${open} ${open===1?"errore aperto":"errori aperti"}`:"nessun errore aperto"} · ${sc}% (obiettivo ${GOAL_SC}%)</small><div class="bar sm"><i style="width:${Math.min(100,sc/GOAL_SC*100)}%"></i></div></div>${mini||d?"":`<div class="btns" style="margin:0"><button class="btn sm" data-go="${EX}/t/${t}">📖 Spiegazione</button>${open?`<button class="btn sm pri" data-pr="et:${t}">🎯 Rifai gli errori</button>`:`<button class="btn sm pri" data-pr="t:${t}">✏️ Esercizi</button>`}</div>`}</div>`;}).join("");
  return `<div class="card goal"><h3>🎯 Obiettivo di studio <span class="pill">${ok}/${g.t.length} raggiunti</span></h3><p style="margin:0 0 8px">Creato dai tuoi errori il ${fmtD(g.ts.slice(0,10),{day:"numeric",month:"long"})}. <b>Entro ${fmtD(g.deadline,{weekday:"long",day:"numeric",month:"long"})}</b>${dd>=0?` (${dd===0?"oggi":dd===1?"domani":"tra "+dd+" giorni"})`:""}: risolvi gli errori aperti e porta ogni argomento almeno al ${GOAL_SC}%. Quando li completi tutti, l'app crea da sola il prossimo obiettivo.</p>
   ${first?`<p class="lbl" style="margin:0 0 8px">👉 Oggi: <b>${esc(TP[first].t)}</b> — rileggi la spiegazione, poi rifai gli errori.</p>`:""}${rows}
   ${mini?`<div class="btns"><button class="btn pri" data-go="${EX}/storico">Apri il ripasso degli errori ›</button></div>`:""}</div>`;}

/* ----- ripasso guidato: per ogni argomento sbagliato i concetti, la trappola e la spiegazione di ogni errore ----- */
function itemHTML(q,given,ok,extra){return `<div class="ptr${ok?" ok":""}"><div class="qh"><div class="qt">${esc(q.q)}</div></div>
  ${ok?`<p class="ptl si">✓ Risposta data: <b>${esc(given)}</b></p>`:given==null?`<p class="ptl no">➖ Non risposta</p>`:`<p class="ptl no">✗ Risposta data: <b>${esc(given)}</b></p>`}
  ${extra||""}${ok?"":`<p class="ptl si">✓ Risposta giusta: <b>${esc(q.k==="m"?q.o[q.a]:(Array.isArray(q.a)?q.a[0]:q.o[q.a]))}</b></p>`}${q.s?`<p class="ptw"><b>Perché:</b> ${esc(q.s)}</p>`:""}</div>`;}
function reviewHTML(){const et=errTopics().filter(x=>x.open.length||x.pt.length);if(!et.length)return `<div class="card"><h3>🔁 Ripasso guidato degli errori</h3><p style="margin:0">Non ci sono errori aperti da ripassare.</p></div>`;
  return `<h2>🔁 Ripasso guidato degli errori</h2><p class="sub" style="margin-top:-4px">Per ogni argomento: i concetti chiave, la trappola d'esame e la spiegazione di ogni errore. Poi rifai le domande sbagliate: quando rispondi bene l'errore si chiude.</p>`+
   et.slice(0,8).map(x=>{const t=TP[x.t];return `<details class="card rv"${x===et[0]?" open":""}><summary><b>${UN[t.u].ic} ${esc(t.t)}</b> <span class="pill">${x.open.length+x.pt.length} da rivedere</span></summary>
    ${t.breve?`<div class="rvk"><b>💡 Concetti chiave</b><ul class="breve">${t.breve.map(b=>`<li>${esc(b)}</li>`).join("")}</ul></div>`:""}
    ${t.trap?`<div class="trap">⚠️ <b>Trappola d'esame:</b> ${esc(t.trap)}</div>`:""}
    ${x.pt.map(i=>{const q=PT[i],c=S.pt.ans[i],ci=c==null?-1:q.o.indexOf(c);return itemHTML(q,c,false,`<p class="lbl" style="margin:4px 0 0">dal test d'ingresso</p>${q.e&&q.e[ci]?`<p class="ptw"><b>Perché è sbagliata:</b> ${esc(q.e[ci])}</p>`:""}`);}).join("")}
    ${x.open.map(id=>{const q=QI[id],lg=lastGiven(id);return itemHTML(q,lg?lg.a:null,false);}).join("")}
    <div class="btns"><button class="btn" data-go="${EX}/t/${x.t}">📖 Ripercorri la spiegazione completa</button>${x.open.length?`<button class="btn pri" data-pr="et:${x.t}">🎯 Rifai gli errori (${x.open.length})</button>`:`<button class="btn pri" data-pr="t:${x.t}">✏️ Esercizi sull'argomento</button>`}</div></details>`;}).join("");}

/* ----- storico ----- */
const HT={pt:["🧭","Test d'ingresso"],es:["✏️","Serie di esercizi"],arg:["📚","Esercizi di un argomento"],sim:["⏱️","Simulazione"]};
const hRes=h=>{const n=h.items.length,ok=h.items.filter(x=>x.ok).length;return h.type==="sim"?`${F2(h.pts,1)}/31 · ${h.pts>=18?"superata":"non superata"}`:h.type==="pt"?`${h.score}/${h.n} · livello ${h.lev}`:`${ok}/${n} giuste${h.type==="es"&&!h.done?" · interrotta":""}`;};
function vStorico(){const h=exHead();if(HID){const x=hGet(HID);if(x)return h+vHistDetail(x);HID=null;}
  let o=h+`<h1>🗂️ Errori e storico · ${esc(ename(EX))}</h1><p class="sub">Ogni prova viene salvata da sola, con data e ora, insieme a tutte le risposte date: puoi riaprirla e ripercorrere le spiegazioni quando vuoi. Gli errori diventano il tuo obiettivo di studio.</p>`;
  o+=goalHTML(false)+reviewHTML();
  const L=S.hist.slice().reverse();
  o+=`<h2>📒 Storico delle prove (${L.length})</h2>`+(L.length?`<div class="card">${L.map(x=>{const n=x.items.length,ko=x.items.filter(i=>!i.ok).length;return `<button class="trow" data-go="${EX}/storico/${x.id}"><span class="ubadge">${HT[x.type][0]}</span><div class="grow"><b>${esc(x.lab)}</b><small>${fmtTS(x.ts)} · ${n} domande${ko?` · ${ko} ${ko===1?"errore":"errori"}`:""}</small></div><b>${hRes(x)}</b></button>`;}).join("")}</div>`:`<div class="card"><p style="margin:0">Ancora nessuna prova: inizia dal test d'ingresso o da una serie di esercizi.</p></div>`);
  return o;}
function vHistDetail(x){const n=x.items.length,ko=x.items.filter(i=>!i.ok);
  let o=`<p class="crumb"><button class="btn sm" data-go="${EX}/storico">‹ Errori e storico</button></p><h1>${HT[x.type][0]} ${esc(x.lab)}</h1><p class="sub">${fmtTS(x.ts)}${x.min?` · durata ${x.min} min`:""} · ${hRes(x)}</p>`;
  o+=`<div class="kpi"><div><b>${n-ko.length}</b><span>giuste</span></div><div><b>${ko.filter(i=>i.a!=null).length}</b><span>sbagliate</span></div><div><b>${ko.filter(i=>i.a==null).length}</b><span>senza risposta</span></div></div>`;
  const tps=[...new Set(ko.map(i=>i.k!=null?PT[i.k]&&PT[i.k].t:QI[i.id]&&QI[i.id].t).filter(t=>t&&TP[t]))];
  if(tps.length)o+=`<div class="card"><h3>📚 Argomenti da ripercorrere</h3><div class="btns">${tps.map(t=>`<button class="btn sm" data-go="${EX}/t/${t}">${esc(TP[t].t)}</button>`).join("")}</div></div>`;
  const card=it=>{if(it.k!=null){const q=PT[it.k];if(!q)return"";const ci=it.a==null?-1:q.o.indexOf(it.a);return itemHTML(q,it.a,it.ok,!it.ok&&q.e&&q.e[ci]?`<p class="ptw"><b>Perché è sbagliata:</b> ${esc(q.e[ci])}</p>`:"")+(q.t&&TP[q.t]&&!it.ok?`<div class="btns" style="margin:-4px 0 8px"><button class="btn sm" data-go="${EX}/t/${q.t}">📖 ${esc(TP[q.t].t)}</button></div>`:"");}
    const q=QI[it.id];if(!q)return `<div class="ptr"><p class="lbl" style="margin:0">Domanda non più presente in questa versione dell'app.</p></div>`;
    return itemHTML(q,it.a,it.ok)+(!it.ok?`<div class="btns" style="margin:-4px 0 8px"><button class="btn sm" data-go="${EX}/t/${q.t}">📖 ${esc(TP[q.t].t)}</button></div>`:"");};
  o+=ko.length?`<h2>Errori (${ko.length})</h2><div class="card">${ko.map(card).join("")}</div>`:`<div class="card"><p style="margin:0">Nessun errore in questa prova. 👏</p></div>`;
  const ok=x.items.filter(i=>i.ok);if(ok.length)o+=`<details class="card ptgood"><summary>✓ Risposte giuste (${ok.length}): rivedi le spiegazioni</summary>${ok.map(card).join("")}</details>`;
  if(x.type==="sim"&&x.sim!=null&&S.sims[x.sim])o+=`<div class="btns"><button class="btn" data-hsim="${x.sim}">Apri la correzione della simulazione</button></div>`;
  return o;}
