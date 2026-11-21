/* ---------- 🧭 PIANO (21/11/2026, analisi da pianificatore: proposte 5, 1, 6, 7, 8, 9) ----------
   Una sezione sola per tenere le fila:
   🗓️ Settimana  – la revisione della domenica (10 minuti): che cosa ho fatto, che cosa slitta, 3 priorità, come sto.
   ✅ Da fare    – un'unica lista che raccoglie le Scadenze del Calendario, gli adempimenti e le leve della Pensione
                   e le cose aggiunte qui; filtri per oggi, settimana, mese.
   🛣️ La strada  – le tappe vere fino al 2029 (congedo, pensione, incassi della scheda, conguaglio) con le cose da preparare.
   💶 Soldi      – mese per mese dal congedo, preso dalla Cassa della Pensione (nessun conto nuovo, nessun consiglio).
   🌱 Primo anno – 3–5 obiettivi personali e la settimana tipo da provare dopo il congedo.
   Dati in P.piano, solo sull'iPad e nelle copie: nel codice non c'è nessun dato personale. */
const PI_V=[["sett","🗓️ Settimana"],["fare","✅ Da fare"],["strada","🛣️ La strada"],["soldi","💶 Soldi"],["anno","🌱 Primo anno"]];
const PI_AREE=[["salute","🧘","Salute e movimento","taichi.html"],["vol","🤲","Volontariato","taichi.html#ikigai"],["fam","👨‍👩‍👧","Famiglia e amici",""],["imp","📚","Imparare","#cd"],["casa","🏠","Casa e cose pratiche",""],["altro","✨","Altro",""]];
const PI_LIV=[["","—"],["1","🌱 iniziato"],["2","🌿 in cammino"],["3","🌳 fatto mio"]];
const PI_GG=["Lunedì","Martedì","Mercoledì","Giovedì","Venerdì","Sabato","Domenica"],PI_FAS=[["m","mattina"],["p","pomeriggio"],["s","sera"]];
let piV=(()=>{try{const v=sessionStorage.getItem("pn-piano-v");return PI_V.some(x=>x[0]===v)?v:"sett";}catch(e){return "sett";}})(),piF="sett";
function PI(){if(!P.piano||typeof P.piano!=="object")P.piano={};const p=P.piano;
  p.todo=Array.isArray(p.todo)?p.todo:[];p.rev=p.rev&&typeof p.rev==="object"?p.rev:{};p.tappe=Array.isArray(p.tappe)?p.tappe:[];
  p.obi=Array.isArray(p.obi)?p.obi:[];p.sett=p.sett&&typeof p.sett==="object"?p.sett:{};return p;}
const piFd=(d,o)=>d?fmt(d,o||{weekday:"short",day:"numeric",month:"short"}):"";
/* settimana: la revisione di W (lunedì) fissa le priorità della settimana dopo */
const piW=()=>monday(today());
function piRevW(){const t=today(),w=piW(),dw=(parse(t).getDay()+6)%7;   /* sab-dom: la settimana in corso; lunedì: quella appena finita, se non fatta */
  if(dw===0&&!(PI().rev[add(w,-7)]||{}).at)return add(w,-7);return w;}
const piPrio=()=>((PI().rev[add(piW(),-7)]||{}).prio||[]).filter(x=>x&&x.trim());
const piRevDue=()=>{const dw=(parse(today()).getDay()+6)%7,w=piRevW();return (dw>=5||w!==piW())&&!(PI().rev[w]||{}).at;};

/* ---------- ✅ raccolta delle cose da fare ---------- */
function piItems(){const t=today(),L=[];
  (P.scad||[]).filter(s=>!s.done&&s.d).forEach(s=>L.push({k:"s:"+s.id,t:s.t,d:s.d,src:"📆 Scadenze",go:"cal",ok:1}));
  try{if(typeof pensHas==="function"&&pensHas())pensOpen().forEach(a=>L.push({k:(a.leva?"l:":"a:")+a.id,t:a.t,d:a.d,src:"🎖️ Pensione",go:"pens",ok:!a.leva}));}catch(e){}
  /* 21/11/2026: la riconsegna dell'auto sta nella sezione Auto (P.auto.scad) anche se non è stata messa nel Calendario */
  {const A=P.auto||{};if(A.scad&&A.scad>=t&&!(P.scad||[]).some(x=>x.id==="auto-riconsegna"))L.push({k:"u:auto",t:"Riconsegna dell'auto a noleggio",d:A.scad,src:"🚗 Auto",go:"auto",ok:0});}
  PI().todo.filter(x=>!x.done).forEach(x=>L.push({k:"t:"+x.id,t:x.t,d:x.d||"",src:"🧭 Piano",ok:1,mio:1}));
  return L.sort((a,b)=>((a.d||"9")<(b.d||"9")?-1:(a.d||"9")>(b.d||"9")?1:0));}
function piBucket(d){const t=today();if(!d)return "nd";if(d<t)return "rit";if(d===t)return "oggi";if(d<=add(piW(),6))return "sett";if(d<=add(t,31))return "mese";return "poi";}
function piDone(k){const[s,id]=[k.slice(0,1),k.slice(2)];
  if(s==="s"){const x=(P.scad||[]).find(z=>z.id===id);if(x)x.done=true;}
  else if(s==="a"){const x=PENS().adem.find(z=>z.id===id);if(x)x.fatto=today();}
  else if(s==="t"){const x=PI().todo.find(z=>z.id===id);if(x){x.done=today();}}
  save();}
function piRow(x,btn){const b=piBucket(x.d);
  return `<div class="row pi-it"><div class="grow"><b>${esc(x.t)}</b><small>${x.d?`<span class="${b==="rit"?"pi-rit":""}">${b==="rit"?"⚠️ ":""}${piFd(x.d)}</span> · `:""}${x.src}</small></div>${btn!==false&&x.ok?`<button class="btn sm" data-pidone="${esc(x.k)}">✓</button>`:""}${x.go?`<button class="lnk" data-pigo="${x.go}">Apri ›</button>`:""}</div>`;}
function piFare(){const I=piItems(),F=[["oggi","Fino a oggi"],["sett","Questa settimana"],["mese","Prossimi 30 giorni"],["tutto","Tutto"]];
  const lim={oggi:["rit","oggi"],sett:["rit","oggi","sett"],mese:["rit","oggi","sett","mese"],tutto:["rit","oggi","sett","mese","poi","nd"]}[piF];
  const V=I.filter(x=>lim.includes(piBucket(x.d))),pr=piPrio();
  let o=`<div class="cols2">`;
  o+=`<div class="card k-piano"><h3>✅ Da fare <span class="pill">${V.length}</span></h3>
    <div class="chips" style="margin:0 0 8px">${F.map(([k,n])=>`<button class="chip${piF===k?" on":""}" data-pif="${k}">${n}</button>`).join("")}</div>
    ${V.length?V.map(x=>piRow(x)).join(""):`<p class="lbl">Niente in questo periodo. 👍</p>`}
    <div class="pi-add"><input id="piNew" placeholder="aggiungi una cosa da fare…" enterkeyhint="done"><input id="piNewD" type="date" aria-label="Entro il"><button class="btn sm pri" data-pi="add">➕</button></div>
    <p class="lbl" style="margin:8px 0 0">Qui arrivano da sole le Scadenze del Calendario e gli adempimenti della Pensione: con ✓ le segni fatte anche là.</p></div>`;
  o+=`<div class="card k-piano"><h3>🎯 Le 3 priorità della settimana</h3>${pr.length?`<ol class="pi-pr">${pr.map(p=>`<li>${esc(p)}</li>`).join("")}</ol>`:`<p class="lbl">Le scegli nella revisione della domenica (🗓️ Settimana).</p>`}
    <button class="btn sm" data-piv="sett">🗓️ Vai alla revisione</button></div>`;
  const fatti=PI().todo.filter(x=>x.done).slice(-8).reverse();
  if(fatti.length)o+=`<div class="card k-piano"><h3>✓ Fatte di recente</h3>${fatti.map(x=>`<div class="row"><div class="grow">${esc(x.t)}<small>fatto il ${piFd(x.done)}</small></div><button class="lnk" data-piundo="${esc(x.id)}">riapri</button></div>`).join("")}</div>`;
  return o+`</div>`;}

/* ---------- 🗓️ revisione della settimana ---------- */
function piSett(){const w=piRevW(),R=PI().rev[w]||{},pr=R.prio||["","",""],we=add(w,6),I=piItems();
  const fatte=PI().todo.filter(x=>x.done&&x.done>=w&&x.done<=we).map(x=>x.t)
    .concat((typeof pensHas==="function"&&pensHas()?PENS().adem:[]).filter(a=>a.fatto&&a.fatto>=w&&a.fatto<=we).map(a=>a.t));
  const slitta=I.filter(x=>x.d&&x.d<=we&&x.d>=add(w,-14)),prossime=I.filter(x=>x.d>we&&x.d<=add(we,7));
  const old=Object.keys(PI().rev).filter(k=>k<w&&PI().rev[k].at).sort().reverse().slice(0,8);
  let o=`<div class="cols2">`;
  o+=`<div class="card k-piano"><h3>🗓️ Revisione della settimana <span class="pill">${piFd(w,{day:"numeric",month:"short"})} – ${piFd(we,{day:"numeric",month:"short"})}</span>${R.at?` <span class="pill okp">fatta ✓</span>`:""}</h3>
    <p class="lbl" style="margin-top:0">Dieci minuti, di solito la domenica: guardi indietro, scegli 3 priorità per la settimana dopo, e via.</p>
    <h4>1. Che cosa ho fatto</h4>${fatte.length?`<ul class="pi-ul">${fatte.map(t=>`<li>✓ ${esc(t)}</li>`).join("")}</ul>`:`<p class="lbl">Nessuna cosa segnata fatta qui o nella Pensione: scrivila sotto, se vuoi.</p>`}
    <textarea id="piRf" rows="2" placeholder="altro che ho fatto o che è andato bene…">${esc(R.fatto||"")}</textarea>
    <h4>2. Che cosa slitta</h4>${slitta.length?slitta.map(x=>piRow(x)).join(""):`<p class="lbl">Niente in ritardo. 👍</p>`}
    <textarea id="piRs" rows="2" placeholder="che cosa sposto, e a quando…">${esc(R.slitta||"")}</textarea>
    <h4>3. Le 3 priorità della settimana dopo</h4>${prossime.length?`<p class="lbl" style="margin:0 0 4px">In arrivo: ${prossime.slice(0,5).map(x=>esc(x.t)).join(" · ")}</p>`:""}
    ${[0,1,2].map(i=>`<input class="pi-in" data-pip="${i}" value="${esc(pr[i]||"")}" placeholder="priorità ${i+1}">`).join("")}
    <h4>4. Come sto</h4><div class="chips">${["😣","😕","😐","🙂","😄"].map((e,i)=>`<button class="chip${R.um===i+1?" on":""}" data-pium="${i+1}">${e}</button>`).join("")}</div>
    <textarea id="piRn" rows="2" placeholder="una riga su come è andata (corpo, umore, persone)…">${esc(R.nota||"")}</textarea>
    <div class="btns"><button class="btn pri" data-pi="rev">✓ Revisione fatta</button></div></div>`;
  o+=`<div class="card k-piano"><h3>📜 Le settimane passate</h3>${old.length?old.map(k=>{const r=PI().rev[k];return piSub("pi-r-"+k,`${piFd(k,{day:"numeric",month:"short"})} ${r.um?["😣","😕","😐","🙂","😄"][r.um-1]:""}`,`${(r.prio||[]).filter(Boolean).length?`<b>Priorità scelte</b><ol class="pi-pr">${r.prio.filter(Boolean).map(p=>`<li>${esc(p)}</li>`).join("")}</ol>`:""}${r.fatto?`<p><b>Fatto:</b> ${esc(r.fatto)}</p>`:""}${r.slitta?`<p><b>Slitta:</b> ${esc(r.slitta)}</p>`:""}${r.nota?`<p><b>Come sto:</b> ${esc(r.nota)}</p>`:""}`);}).join(""):`<p class="lbl">Qui restano le revisioni fatte, una per settimana.</p>`}</div>`;
  return o+`</div>`;}
function piSub(k,t,b){return `<details class="subw"><summary>${t}</summary><div>${b}</div></details>`;}

/* ---------- 🛣️ la strada fino al 2029 ---------- */
function piTappe(){const T=[],t=today();
  try{const S=licS();if(S){const L=licCalc(S);T.push({d:L.end,t:"Ultimo giorno in servizio",ic:"🎖️",src:"Licenze",go:"licenze.html"});}}catch(e){}
  try{const dec=((PENS().dati||{}).decor||"").slice(0,7);if(dec)T.push({d:dec+"-01",t:"Decorrenza della pensione",ic:"🌅",src:"Pensione"});}catch(e){}
  try{const K=cassaCalc();const seen={};(K.items||[]).forEach(x=>{
      if(x.k.startsWith("inc:"))T.push({d:x.d,t:x.t,ic:"💶",src:"Pensione · scheda",imp:x.imp});
      else if(x.k.startsWith("pen:")&&!seen.pen){seen.pen=1;T.push({d:x.d,t:"Primo accredito della pensione",ic:"💶",src:"Pensione · cassa",imp:x.imp});}
      else if(x.k==="tax:dich")T.push({d:x.d,t:x.t,ic:"🧾",src:"Pensione · tasse",imp:x.imp,u:1});});}catch(e){}
  PI().tappe.forEach(x=>T.push({d:x.d,t:x.t,ic:"📍",src:"mia",id:x.id}));
  return T.filter(x=>x.d).sort((a,b)=>a.d<b.d?-1:a.d>b.d?1:0);}
function piStrada(){const T=piTappe(),t=today(),A=(typeof pensHas==="function"&&pensHas())?PENS().adem.filter(a=>a.d):[];
  const nx=T.find(x=>x.d>=t);let prev="0000-00-00",o="";
  o+=`<div class="card k-piano"><h3>🛣️ La strada <span class="lbl" style="margin-left:auto">${nx?`prossima tappa: ${esc(nx.t)} · tra ${diff(t,nx.d)} giorni`:""}</span></h3>
    <p class="lbl" style="margin-top:0">Le tappe arrivano da Licenze e Pensione (scheda e cassa); sotto ogni tappa gli adempimenti da preparare prima. Puoi aggiungere le tue.</p>
    <div class="pi-tl">`;
  let y="";
  T.forEach(x=>{const prep=A.filter(a=>a.d>prev&&a.d<=x.d),done=x.d<t;
    if(x.d.slice(0,4)!==y){y=x.d.slice(0,4);o+=`<div class="pi-y">${y}</div>`;}
    o+=`<div class="pi-tp${done?" done":""}${x===nx?" nx":""}"><div class="pi-dot">${x.ic}</div><div class="grow"><b>${esc(x.t)}</b><small>${piFd(x.d,{weekday:"short",day:"numeric",month:"long",year:"numeric"})} · ${x.src}${x.imp?` · ${x.u?"−":""}${eur0(x.imp)}`:""}${!done?` · tra ${diff(t,x.d)} giorni`:""}</small>
      ${prep.length?`<div class="pi-prep">${prep.map(a=>`<div>${a.fatto?"✓":"○"} ${esc(a.t)} <span class="lbl">${piFd(a.d)}</span></div>`).join("")}</div>`:""}</div>${x.id?`<button class="lnk" data-pitdel="${esc(x.id)}">togli</button>`:""}</div>`;
    prev=x.d;});
  if(!T.length)o+=`<p class="lbl">Nessuna tappa: imposta l'ultimo giorno in Licenze e carica la scheda in Pensione.</p>`;
  o+=`</div><div class="pi-add"><input id="piTt" placeholder="aggiungi una tappa…"><input id="piTd" type="date" aria-label="Data"><button class="btn sm pri" data-pi="tappa">➕</button></div></div>`;
  return o;}

/* ---------- 💶 soldi mese per mese (dalla Cassa della Pensione) ---------- */
function piSoldi(){let K=null;try{K=cassaCalc();}catch(e){}
  if(!K||!K.ini)return `<div class="card k-piano"><h3>💶 Soldi mese per mese</h3><p>I conti si fanno nella <b>Cassa</b> della sezione Pensione: scrivi da quanto parti e la cassa mette in fila stipendi, pensione, rate del TFS e uscite fino al 2029. Qui ne vedi il riassunto dal congedo in poi.</p><button class="btn sm pri" data-pigocassa="1">Apri la Cassa ›</button></div>`;
  let dec="";try{dec=((PENS().dati||{}).decor||"").slice(0,7);}catch(e){}
  const R=K.rows.filter(r=>!dec||r.ym>=dec),c=v=>`<span class="amt ${v<0?"u":""}">${eur0(Math.round(v))}</span>`;
  const reg=R.filter(r=>!r.L.some(x=>x.k&&x.k.startsWith("inc:"))),me=reg.length?reg.reduce((a,r)=>a+r.e,0)/reg.length:0,mu=reg.length?reg.reduce((a,r)=>a+r.u,0)/reg.length:0;
  let o=`<div class="card k-piano"><h3>💶 Soldi dal congedo in poi <button class="lnk" data-pigocassa="1" style="margin-left:auto">Cassa ›</button></h3>
    <p class="lbl" style="margin-top:0">Presi dalla Cassa della Pensione (stesse cifre, solo riassunte). Nessun consiglio: sono le entrate e le uscite che hai inserito o che arrivano dalla scheda.</p>
    <div class="kpi"><div><b>${c(me)}</b><span>entrate di un mese normale</span></div><div><b>${c(mu)}</b><span>uscite di un mese normale</span></div><div><b>${c(me-mu)}</b><span>differenza al mese</span></div><div><b>${c(K.min)}</b><span>punto più basso (${ymLab(K.minM)})</span></div></div>
    <div class="tw"><table class="pi-tab"><thead><tr><th>Mese</th><th>Entrate</th><th>Uscite</th><th>Saldo a fine mese</th><th>Voci grandi</th></tr></thead><tbody>
    ${R.map(r=>{const big=r.L.filter(x=>Math.abs(x.imp)>=2000).map(x=>esc(x.t)).join(" · ");return `<tr${r.fin<0?' class="neg"':""}><td>${ymLab(r.ym,1)}</td><td>${c(r.e)}</td><td>${c(-r.u)}</td><td>${c(r.fin)}</td><td class="lbl">${big}</td></tr>`;}).join("")}</tbody></table></div></div>`;
  return o;}

/* ---------- 🌱 primo anno: obiettivi e settimana tipo ---------- */
function piAnno(){const O=PI().obi,ym=today().slice(0,7);
  let o=`<div class="cols2"><div class="card k-piano"><h3>🌱 I miei obiettivi del primo anno <span class="pill">${O.length}/5</span></h3>
    <p class="lbl" style="margin-top:0">Da 3 a 5, uno per area che conta. Ogni mese segni a che punto sei: 🌱 iniziato, 🌿 in cammino, 🌳 fatto mio.</p>`;
  O.forEach(x=>{const a=PI_AREE.find(z=>z[0]===x.area)||PI_AREE[5],m=x.mesi||{},cur=m[ym]||"";
    o+=`<div class="pi-ob"><div class="grow"><b>${a[1]} ${esc(x.t)}</b><small>${a[2]}${x.come?" · come lo misuro: "+esc(x.come):""}</small>
      <div class="pi-mesi">${Object.keys(m).sort().slice(-6).map(k=>`<span title="${ymLab(k,1)}">${["","🌱","🌿","🌳"][+m[k]]||"·"}</span>`).join("")}</div></div>
      <select data-pilv="${esc(x.id)}" aria-label="A che punto sono questo mese">${PI_LIV.map(([v,n])=>`<option value="${v}"${cur===v?" selected":""}>${n}</option>`).join("")}</select>
      ${a[3]?`<a class="lnk" href="${a[3].startsWith("#")?"./"+a[3]:a[3]}">Apri ›</a>`:""}<button class="lnk" data-piodel="${esc(x.id)}">togli</button></div>`;});
  if(O.length<5)o+=`<div class="form"><label>Area<select id="piOa">${PI_AREE.map(([k,ic,n])=>`<option value="${k}">${ic} ${n}</option>`).join("")}</select></label><label>Obiettivo<input id="piOt" placeholder="es. Tai Chi 4 volte a settimana"></label><label>Come lo misuro<input id="piOc" placeholder="es. sessioni segnate nel Tai Chi"></label></div><div class="btns"><button class="btn sm pri" data-pi="obi">➕ Aggiungi obiettivo</button></div>`;
  o+=`</div>`;
  const S=PI().sett;
  o+=`<div class="card k-piano"><h3>🗓️ La mia settimana tipo dopo il congedo</h3>
    <p class="lbl" style="margin-top:0">Uno schema leggero da provare da giugno 2027 e aggiustare: così le giornate hanno un ritmo. Scrivi poche parole per casella.</p>
    <div class="tw"><table class="pi-st"><thead><tr><th></th>${PI_FAS.map(([k,n])=>`<th>${n}</th>`).join("")}</tr></thead><tbody>
    ${PI_GG.map((g,i)=>`<tr><th>${g}</th>${PI_FAS.map(([k])=>`<td><input data-pis="${i}-${k}" value="${esc((S[i]||{})[k]||"")}" placeholder="…"></td>`).join("")}</tr>`).join("")}</tbody></table></div>
    <p class="lbl">Idee: 🧘 Tai Chi · 🤲 volontariato · 📚 studio · 🚶 camminata · 👨‍👩‍👧 famiglia · 🎟️ tempo libero · 🏠 casa.</p></div></div>`;
  return o;}

/* ---------- sezione ---------- */
function vPiano(){const I=piItems(),wk=I.filter(x=>["rit","oggi","sett"].includes(piBucket(x.d))).length,T=piTappe().find(x=>x.d>=today());
  let o=`<h1>🧭 Piano</h1><p class="sub">Tenere le fila: la revisione della settimana, tutte le cose da fare in una lista, la strada fino al 2029, i soldi dal congedo e il primo anno di pensione.</p>`;
  o+=`<div class="kpi" style="margin-bottom:12px"><div><b>${wk}</b><span>da fare questa settimana</span></div><div><b>${piRevDue()?"da fare":(PI().rev[piRevW()]||{}).at?"fatta ✓":"domenica"}</b><span>revisione</span></div><div><b>${T?diff(today(),T.d):"—"}</b><span>${T?"giorni a: "+esc(T.t):"prossima tappa"}</span></div></div>`;
  o+=`<div class="seg" role="tablist" style="margin:0 0 14px;width:max-content;max-width:100%">${PI_V.map(([k,n])=>`<button role="tab" data-piv="${k}" class="${piV===k?"on":""}" aria-selected="${piV===k}">${n}</button>`).join("")}</div>`;
  return o+({sett:piSett,fare:piFare,strada:piStrada,soldi:piSoldi,anno:piAnno}[piV]||piSett)();}
/* riquadro in Oggi */
function piOggiCard(){const pr=piPrio(),I=piItems().filter(x=>["rit","oggi"].includes(piBucket(x.d))),T=piTappe().find(x=>x.d>=today());
  return `<div class="card k-piano"><h3>🧭 Piano <a href="#piano">Apri ›</a></h3>
    ${piRevDue()?`<div class="row"><div class="grow"><b>🗓️ Revisione della settimana</b><small>10 minuti: fatto, slitta, 3 priorità</small></div><button class="btn sm" data-pigo2="sett">Fai</button></div>`:""}
    ${pr.length?`<div class="lbl" style="margin:4px 0 2px">🎯 Priorità della settimana</div><ol class="pi-pr">${pr.map(p=>`<li>${esc(p)}</li>`).join("")}</ol>`:""}
    ${I.length?`<div class="row"><div class="grow"><b>✅ ${I.length} ${I.length===1?"cosa":"cose"} per oggi</b><small>${I.slice(0,2).map(x=>esc(x.t)).join(" · ")}</small></div><button class="btn sm" data-pigo2="fare">Vedi</button></div>`:""}
    ${T?`<div class="row"><div class="grow"><b>🛣️ ${esc(T.t)}</b><small>${piFd(T.d,{day:"numeric",month:"long",year:"numeric"})}</small></div><b>${diff(today(),T.d)} g</b></div>`:""}</div>`;}
function bindPiano(){const qa=s=>document.querySelectorAll(s),R=()=>render(),gv=id=>{const e=$(id);return e?e.value.trim():"";};
  qa("[data-piv]").forEach(b=>b.onclick=()=>{piV=b.dataset.piv;try{sessionStorage.setItem("pn-piano-v",piV);}catch(e){}R();scrollTo({top:0});});
  qa("[data-pif]").forEach(b=>b.onclick=()=>{piF=b.dataset.pif;R();});
  qa("[data-pidone]").forEach(b=>b.onclick=()=>{piDone(b.dataset.pidone);toast("Fatto ✓");R();});
  qa("[data-piundo]").forEach(b=>b.onclick=()=>{const x=PI().todo.find(z=>z.id===b.dataset.piundo);if(x){x.done=false;save();R();}});
  qa("[data-pigo]").forEach(b=>b.onclick=()=>go(b.dataset.pigo));
  qa("[data-pigocassa]").forEach(b=>b.onclick=()=>{try{pensV="cassa";}catch(e){}go("pens");});
  qa("[data-pitdel]").forEach(b=>b.onclick=()=>{const p=PI();p.tappe=p.tappe.filter(x=>x.id!==b.dataset.pitdel);save();R();});
  qa("[data-piodel]").forEach(b=>b.onclick=()=>{if(!confirm("Tolgo questo obiettivo?"))return;const p=PI();p.obi=p.obi.filter(x=>x.id!==b.dataset.piodel);save();R();});
  qa("[data-pilv]").forEach(s=>s.onchange=()=>{const x=PI().obi.find(z=>z.id===s.dataset.pilv);if(!x)return;x.mesi=x.mesi||{};const ym=today().slice(0,7);if(s.value)x.mesi[ym]=s.value;else delete x.mesi[ym];save();toast("Salvato");R();});
  qa("[data-pis]").forEach(i=>i.onchange=()=>{const[g,k]=i.dataset.pis.split("-"),S=PI().sett;S[g]=S[g]||{};S[g][k]=i.value.trim();save();toast("Salvato");});
  qa("[data-pium]").forEach(b=>b.onclick=()=>{const w=piRevW(),r=PI().rev[w]||(PI().rev[w]={});r.um=+b.dataset.pium;piRevKeep();save();R();});
  qa("[data-pi]").forEach(b=>b.onclick=()=>{const a=b.dataset.pi,p=PI();
    if(a==="add"){const t=gv("piNew");if(!t){toast("Scrivi che cosa");return;}p.todo.push({id:uid(),t,d:gv("piNewD"),done:false});save();R();}
    else if(a==="tappa"){const t=gv("piTt"),d=gv("piTd");if(!t||!d){toast("Serve un nome e una data");return;}p.tappe.push({id:uid(),t,d});save();R();}
    else if(a==="obi"){const t=gv("piOt");if(!t){toast("Scrivi l'obiettivo");return;}p.obi.push({id:uid(),area:$("piOa").value,t,come:gv("piOc"),mesi:{}});save();R();}
    else if(a==="rev"){piRevKeep();const r=p.rev[piRevW()];r.at=new Date().toISOString();save();toast("✓ Revisione fatta: buona settimana");R();}});
  ["piRf","piRs","piRn"].forEach(id=>{const e=$(id);if(e)e.onchange=()=>{piRevKeep();save();};});
  qa("[data-pip]").forEach(i=>i.onchange=()=>{piRevKeep();save();});
  const n=$("piNew");if(n)n.onkeydown=e=>{if(e.key==="Enter"){e.preventDefault();document.querySelector('[data-pi="add"]').click();}};}
function piRevKeep(){const w=piRevW(),r=PI().rev[w]||(PI().rev[w]={}),v=id=>{const e=$(id);return e?e.value.trim():undefined;};
  const f=v("piRf"),s=v("piRs"),n=v("piRn");if(f!==undefined)r.fatto=f;if(s!==undefined)r.slitta=s;if(n!==undefined)r.nota=n;
  const P3=[...document.querySelectorAll("[data-pip]")];if(P3.length)r.prio=P3.map(i=>i.value.trim());}
