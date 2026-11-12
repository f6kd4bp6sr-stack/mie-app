/* ---------- 🏢 Condominio (12/11/2026, richiesta del proprietario) ----------
   Spese correnti, spese straordinarie, analisi del rendiconto e storico degli anni.
   Nel codice NON c'è nessun dato: importi, unità e nome del condominio arrivano da un file «pianificazione-condominio»
   preparato a parte dai documenti dell'amministratore e caricato qui. Restano solo su questo iPad (P.condo, nelle copie
   come il resto). Nel file non entrano mai i nomi degli altri condòmini.
   La sezione fa solo i conti con i numeri del file: nessun consiglio.
   Formato del file: { app:"pianificazione-condominio", v:1, info:{nome,unita,amm}, anni:{ "2026":{ prev:{…}, cons:{…}, str:[…], rateStr:[…], docs:[…] } } }
   - voce: { n:"nome", q:quota dell'unità, tot:totale del condominio, crit:"millesimi"|"persone"|…, num, den }  (q ≈ tot × num / den)
   - prev: { voci, tot, saldoPrec, daVersare, totCond, rate:[{d:"AAAA-MM-GG", i:importo}] }
   - cons: { voci, tot, saldoPrec, acconti, saldo, totCond, dett:[{g:"gruppo", tot, righe:[{n, i}]}] }
   - str:  [{ n, q, tot, crit, num, den }]   rateStr: [{ d, i, n }]   docs: [{ t, d }] */
const CN_IMG=`<svg viewBox="0 0 1100 150" role="img" aria-label="Il condominio in quattro passi: il preventivo dell'anno, le rate da pagare, le spese straordinarie e il consuntivo con il saldo"><g fill="currentColor" font-family="inherit"><text x="70" y="98" font-size="56" text-anchor="middle">🏢</text><text x="70" y="132" font-size="14" font-weight="800" text-anchor="middle">il condominio</text>${[["📋","1 · preventivo","le spese previste"],["📅","2 · rate","quando si paga"],["🛠️","3 · straordinarie","i lavori decisi"],["🧾","4 · consuntivo","spese vere e saldo"]].map((x,i)=>`<rect x="${170+i*232}" y="24" width="208" height="104" rx="16" fill="currentColor" opacity=".08"/><text x="${274+i*232}" y="66" font-size="30" text-anchor="middle">${x[0]}</text><text x="${274+i*232}" y="94" font-size="15" font-weight="800" text-anchor="middle">${x[1]}</text><text x="${274+i*232}" y="114" font-size="13" text-anchor="middle">${x[2]}</text>${i<3?`<path d="M${382+i*232} 76h14m-6-6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`:""}`).join("")}</g></svg>`;
let coY=null;
function cnD(){P.condo=P.condo||{};const C=P.condo;C.info=C.info||{};C.anni=C.anni||{};C.pag=C.pag||{};C.files=C.files||[];return C;}
const cnHas=()=>Object.keys(cnD().anni).length>0;
const cnAnni=()=>Object.keys(cnD().anni).sort();
const cnN=v=>+v||0;
const cnGiorni=d=>Math.round((new Date(d+"T12:00")-new Date(today()+"T12:00"))/864e5);
/* tutte le rate di un anno (ordinarie e straordinarie), con la chiave per la spunta «pagata» */
function cnRate(y){const A=cnD().anni[y]||{},R=[];
  ((A.prev&&A.prev.rate)||[]).forEach((r,i)=>R.push({k:y+"-o"+i,d:r.d,i:cnN(r.i),n:(i+1)+"ª rata ordinaria",t:"o"}));
  (A.rateStr||[]).forEach((r,i)=>R.push({k:y+"-s"+i,d:r.d,i:cnN(r.i),n:r.n||((i+1)+"ª rata straordinaria"),t:"s"}));
  return R.sort((a,b)=>a.d<b.d?-1:a.d>b.d?1:0);}
const cnTutte=()=>cnAnni().flatMap(cnRate);
/* le rate degli anni passati sono storia: non contano come «scadute» e non vanno nel Calendario */
const cnVive=()=>{const y=today().slice(0,4);return cnTutte().filter(r=>r.d.slice(0,4)>=y);};
/* la prossima rata non pagata (serve anche alla pagina Oggi) */
function cnProssima(){const C=cnD();return cnVive().filter(r=>!C.pag[r.k]).sort((a,b)=>a.d<b.d?-1:1)[0]||null;}
function cnUnisci(o){const C=cnD();if(o.info)C.info=Object.assign({},C.info,o.info);
  Object.keys(o.anni||{}).forEach(y=>{if(!/^\d{4}$/.test(y))return;const s=o.anni[y]||{},d=C.anni[y]=C.anni[y]||{};
    ["prev","cons","str","rateStr","docs"].forEach(k=>{if(s[k]!=null)d[k]=s[k];});});
  C.rev=+o.v||C.rev||1;C.at=new Date().toISOString();}
/* controllo di una quota: tot × num / den deve dare la quota scritta (tolleranza di 2 centesimi) */
function cnCheck(v){if(v.tot==null||v.num==null||!v.den)return null;const att=Math.round(cnN(v.tot)*cnN(v.num)/cnN(v.den)*100)/100;return {att,ok:Math.abs(att-cnN(v.q))<=0.02};}
const cnCrit=v=>v.crit?esc(v.crit)+(v.num!=null&&v.den?` <span class="cn-dim">(${String(v.num).replace(".",",")} su ${String(v.den).replace(".",",")})</span>`:""):"";
function cnTabVoci(V,conTot){
  return `<div class="cn-tw"><table class="cn-t"><thead><tr><th>Voce</th><th>Come si divide</th>${conTot?"<th class=\"r\">Totale condominio</th>":""}<th class="r">La tua quota</th></tr></thead><tbody>`+
    V.map(v=>`<tr><td>${esc(v.n)}</td><td>${cnCrit(v)}</td>${conTot?`<td class="r">${v.tot!=null?euro(v.tot):"—"}</td>`:""}<td class="r"><b>${euro(v.q)}</b></td></tr>`).join("")+`</tbody></table></div>`;}
function cnRigaRata(r,C){const g=cnGiorni(r.d),ok=C.pag[r.k],old=r.d.slice(0,4)<today().slice(0,4);
  return `<div class="row cn-r${ok?" cn-ok":!ok&&g<0&&!old?" cn-late":""}"><button class="cn-ck" data-cnp="${r.k}" aria-pressed="${ok?"true":"false"}" aria-label="${ok?"Segna come non pagata":"Segna come pagata"}">${ok?"✅":"⬜"}</button><div class="grow"><b>${esc(r.n)}</b> · ${fmt(r.d,{weekday:"short",day:"numeric",month:"long",year:"numeric"})}<div class="cn-dim">${ok?"pagata il "+fmt(ok,{day:"numeric",month:"long",year:"numeric"}):old?"anno passato":g>0?"tra "+g+(g===1?" giorno":" giorni"):g===0?"scade oggi":"scaduta da "+(-g)+(g===-1?" giorno":" giorni")}</div></div><b class="cn-i">${euro(r.i)}</b></div>`;}
function cnCarica(primo){
  return `<p class="lbl">Per preparare il file, manda in chat a Claude i documenti dell'amministratore (convocazione, consuntivo, preventivo, riparti dei lavori): ricevi un file «condominio-….json» da caricare qui. Ogni file nuovo si aggiunge agli anni già presenti, senza toccare le tue spunte.</p>
  <div class="btns"><label class="btn${primo?" pri":" sm"}" style="cursor:pointer">📥 Carica il file dei dati<input type="file" id="cnIn" accept="application/json,.json" hidden></label></div>`;}
function vCondo(){
  const C=cnD();let o=`<h1>🏢 Condominio</h1><p class="sub">Spese correnti, spese straordinarie, analisi del rendiconto e storico. I dati restano solo su questo iPad.</p>`;
  if(!cnHas())return o+`<div class="card k-condo"><h3>📥 Per cominciare: carica il file dei dati</h3><p class="empty">Qui non c'è ancora nessun dato del condominio.</p>${cnCarica(true)}</div>`+cnDocs(C);
  const Y=cnAnni();if(!coY||!C.anni[coY])coY=Y.filter(y=>C.anni[y].prev||C.anni[y].str).pop()||Y[Y.length-1];
  const A=C.anni[coY],R=cnRate(coY),pag=R.filter(r=>C.pag[r.k]).reduce((s,r)=>s+r.i,0),tot=R.reduce((s,r)=>s+r.i,0),nx=cnProssima();
  o+=`<div class="cn-anni">${Y.map(y=>`<button class="chip${y===coY?" on":""}" data-cny="${y}">${y}</button>`).join("")}</div>`;
  /* in breve */
  o+=`<div class="card k-condo"><h3>📌 In breve${C.info.nome?" · "+esc(C.info.nome):""}</h3>`+
    (nx?`<p class="au-big">${(g=>g>0?`Prossima rata tra <b>${g}</b> ${g===1?"giorno":"giorni"}`:g===0?"<b>Una rata scade oggi</b>":`<span class="cn-warn">Una rata è scaduta da ${-g} ${g===-1?"giorno":"giorni"}</span>`)(cnGiorni(nx.d))}: ${esc(nx.n)}, <b>${euro(nx.i)}</b> · ${fmt(nx.d,{weekday:"long",day:"numeric",month:"long"})}</p>`:`<p class="au-big">✅ Tutte le rate caricate risultano pagate.</p>`)+
    `<div class="kpi cn-kpi"><div class="k"><div class="n">${euro(tot)}</div><div class="l">da versare nel ${coY}</div></div><div class="k"><div class="n">${euro(pag)}</div><div class="l">segnato come pagato</div></div><div class="k"><div class="n">${euro(tot-pag)}</div><div class="l">ancora da pagare</div></div></div>`+
    (tot?`<div class="cn-bar" role="img" aria-label="Pagato ${Math.round(pag/tot*100)} per cento"><i style="width:${Math.min(100,pag/tot*100)}%"></i></div>`:"")+
    `<p class="lbl">${[C.info.unita?"Unità "+esc(C.info.unita):"",C.info.amm?"Amministratore: "+esc(C.info.amm):""].filter(Boolean).join(" · ")}</p>`+
    (R.length?`<div class="btns"><button class="btn sm" id="cnCal">📌 ${P.scad.some(x=>String(x.id).startsWith("condo-"))?"Aggiorna le rate nel":"Metti le rate nel"} Calendario</button></div>`:"")+`</div>`;
  /* spese correnti */
  const pv=A.prev,RO=R.filter(r=>r.t==="o"),RS=R.filter(r=>r.t==="s");
  o+=`<div class="cols2">`;
  o+=`<div class="card k-condo"><h3>🧾 Spese correnti ${coY} <span class="pill">${pv?euro(pv.daVersare!=null?pv.daVersare:pv.tot):"—"}</span></h3>`+
    (pv?`<p class="lbl">Preventivo della gestione ordinaria${pv.totCond!=null?": tutto il condominio prevede "+euro(pv.totCond):""}.</p>`+cnTabVoci(pv.voci||[],true)+
      `<div class="row"><span class="grow">Totale del preventivo</span><b>${euro(pv.tot)}</b></div>`+
      (pv.saldoPrec!=null&&cnN(pv.saldoPrec)!==0?`<div class="row"><span class="grow">${cnN(pv.saldoPrec)<0?"Debito":"Credito"} dell'anno prima</span><b>${cnN(pv.saldoPrec)<0?"+ ":"− "}${euro(Math.abs(cnN(pv.saldoPrec)))}</b></div>`:"")+
      (pv.daVersare!=null?`<div class="row"><span class="grow"><b>Totale da versare</b></span><b>${euro(pv.daVersare)}</b></div>`:"")+
      (RO.length?`<h4 class="cn-h4">📅 Rate ordinarie</h4>`+RO.map(r=>cnRigaRata(r,C)).join(""):"")
    :`<p class="empty">Per il ${coY} non c'è ancora il preventivo.</p>`)+`</div>`;
  /* spese straordinarie */
  const ST=A.str||[],stT=ST.reduce((s,v)=>s+cnN(v.q),0);
  o+=`<div class="card k-condo"><h3>🛠️ Spese straordinarie ${coY} <span class="pill">${ST.length?euro(stT):"nessuna"}</span></h3>`+
    (ST.length?`<p class="lbl">Lavori decisi dall'assemblea, fuori dalla gestione ordinaria.</p>`+cnTabVoci(ST,true)+`<div class="row"><span class="grow"><b>Totale a tuo carico</b></span><b>${euro(stT)}</b></div>`+
      (RS.length?`<h4 class="cn-h4">📅 Rate straordinarie</h4>`+RS.map(r=>cnRigaRata(r,C)).join(""):"")
    :`<p class="empty">Per il ${coY} non risultano spese straordinarie.</p>`)+`</div>`;
  o+=`</div>`+cnAnalisi(C)+cnStorico(C)+cnDocs(C)+
    `<div class="card k-condo"><h3>⚙️ Dati e privacy</h3><p class="lbl">I numeri del condominio sono salvati solo su questo iPad e nelle tue copie di sicurezza. Nel codice dell'app, che è pubblico, non c'è nessun importo e nessun nome. Nel file dei dati entrano solo le quote della tua unità e i totali del condominio, mai i nomi degli altri condòmini.${C.at?" Ultimo file caricato: "+fmt(C.at.slice(0,10),{day:"numeric",month:"long",year:"numeric"})+".":""}</p>${cnCarica(false)}<div class="btns"><button class="btn sm" id="cnDel">🗑️ Cancella i dati del condominio</button></div></div>`;
  return o;}
/* analisi del rendiconto: l'ultimo consuntivo caricato, con le quote ricalcolate e il confronto con il preventivo dell'anno dopo */
function cnAnalisi(C){
  const yc=coY&&C.anni[coY]&&C.anni[coY].cons?coY:cnAnni().filter(y=>C.anni[y].cons).pop();   // l'anno scelto, se ha il consuntivo; altrimenti l'ultimo
  if(!yc)return `<div class="card k-condo"><h3>🔎 Analisi del rendiconto</h3><p class="empty">Non c'è ancora un consuntivo caricato.</p></div>`;
  const cs=C.anni[yc].cons,V=cs.voci||[],chk=V.map(cnCheck),nOk=chk.filter(x=>x&&x.ok).length,nNo=chk.filter(x=>x&&!x.ok).length;
  let o=`<div class="card k-condo"><h3>🔎 Analisi del rendiconto ${yc} <span class="pill">${euro(cs.tot)}</span></h3><div class="cols2 cn-in">`;
  /* 1 · quote ricalcolate */
  o+=`<div><h4 class="cn-h4">1 · Le tue quote, ricalcolate</h4><p class="lbl">Per ogni voce rifaccio il conto: totale del condominio × la tua parte. ${nNo?`<b class="cn-warn">${nNo} ${nNo===1?"voce non torna":"voci non tornano"}</b>: chiedi all'amministratore.`:nOk?"Tornano tutte al centesimo.":""}</p>
    <div class="cn-tw"><table class="cn-t"><thead><tr><th>Voce</th><th class="r">Scritto</th><th class="r">Ricalcolato</th><th></th></tr></thead><tbody>${V.map((v,i)=>`<tr><td>${esc(v.n)}<div class="cn-dim">${cnCrit(v)}</div></td><td class="r">${euro(v.q)}</td><td class="r">${chk[i]?euro(chk[i].att):"—"}</td><td>${chk[i]?(chk[i].ok?"✅":"⚠️"):""}</td></tr>`).join("")}</tbody></table></div>
    <div class="row"><span class="grow">Totale delle spese ${yc}</span><b>${euro(cs.tot)}</b></div>`+
    (cs.saldoPrec!=null?`<div class="row"><span class="grow">${cnN(cs.saldoPrec)<0?"Debito":"Credito"} dell'anno prima</span><b>${cnN(cs.saldoPrec)<0?"+ ":"− "}${euro(Math.abs(cnN(cs.saldoPrec)))}</b></div>`:"")+
    (cs.acconti!=null?`<div class="row"><span class="grow">Acconti versati nell'anno</span><b>− ${euro(cs.acconti)}</b></div>`:"")+
    (cs.saldo!=null?`<div class="row"><span class="grow"><b>Saldo di fine ${yc}</b></span><b class="${cnN(cs.saldo)<0?"cn-warn":""}">${cnN(cs.saldo)<0?"debito di ":cnN(cs.saldo)>0?"credito di ":""}${euro(Math.abs(cnN(cs.saldo)))}</b></div>`:"")+`</div>`;
  /* 2 · confronto con il preventivo dell'anno dopo */
  const yn=String(+yc+1),pv=C.anni[yn]&&C.anni[yn].prev;
  o+=`<div><h4 class="cn-h4">2 · Consuntivo ${yc} e preventivo ${yn}</h4>`;
  if(pv){const nomi=[...new Set(V.map(v=>v.n).concat((pv.voci||[]).map(v=>v.n)))],f=(L,n)=>{const x=(L||[]).find(v=>v.n===n);return x?cnN(x.q):null;};
    o+=`<div class="cn-tw"><table class="cn-t"><thead><tr><th>Voce</th><th class="r">Speso ${yc}</th><th class="r">Previsto ${yn}</th><th class="r">Differenza</th></tr></thead><tbody>${nomi.map(n=>{const a=f(V,n),b=f(pv.voci,n),d=a!=null&&b!=null?b-a:null;return `<tr><td>${esc(n)}</td><td class="r">${a!=null?euro(a):"—"}</td><td class="r">${b!=null?euro(b):"—"}</td><td class="r">${d!=null?(d>0?"+":d<0?"−":"")+euro(Math.abs(d)):"—"}</td></tr>`;}).join("")}
      <tr class="cn-tot"><td>Totale tua quota</td><td class="r">${euro(cs.tot)}</td><td class="r">${euro(pv.tot)}</td><td class="r">${(d=>(d>0?"+":d<0?"−":"")+euro(Math.abs(d)))(cnN(pv.tot)-cnN(cs.tot))}</td></tr></tbody></table></div>`;
    if(cs.totCond!=null&&pv.totCond!=null){const d=cnN(pv.totCond)-cnN(cs.totCond),pc=Math.round(d/cnN(cs.totCond)*100);
      o+=`<p class="lbl">Tutto il condominio: speso ${euro(cs.totCond)} nel ${yc}, previsto ${euro(pv.totCond)} per il ${yn} (${d>0?"+":d<0?"−":""}${Math.abs(pc)}%).${d<0?" Il preventivo è più basso della spesa dell'anno prima: se le spese restano simili, la differenza si paga a fine anno con il conguaglio.":""}</p>`;}}
  else o+=`<p class="empty">Manca il preventivo ${yn}: caricalo per vedere il confronto.</p>`;
  o+=`</div></div>`;
  /* 3 · dove vanno le spese del condominio */
  const D=cs.dett||[],dt=D.reduce((s,g)=>s+cnN(g.tot),0);
  if(D.length){const top=D.flatMap(g=>(g.righe||[]).map(r=>({n:r.n,i:cnN(r.i),g:g.g}))).sort((a,b)=>b.i-a.i).slice(0,6);
    o+=`<h4 class="cn-h4">3 · Dove vanno le spese di tutto il condominio</h4><div class="cols2 cn-in"><div>${D.map(g=>`<div class="cn-g"><div class="cn-gl"><span>${esc(g.g)}</span><b>${euro(g.tot)} · ${dt?Math.round(cnN(g.tot)/dt*100):0}%</b></div><div class="cn-bar"><i style="width:${dt?cnN(g.tot)/dt*100:0}%"></i></div></div>`).join("")}</div>
      <div><p class="lbl" style="margin-top:0">Le sei spese più grandi:</p>${top.map(r=>`<div class="row"><span class="grow">${esc(r.n)}<div class="cn-dim">${esc(r.g)}</div></span><b>${euro(r.i)}</b></div>`).join("")}</div></div>
      <details class="more"><summary>Tutte le righe del rendiconto</summary>${D.map(g=>`<h4 class="cn-h4">${esc(g.g)} · ${euro(g.tot)}</h4>`+(g.righe||[]).map(r=>`<div class="row"><span class="grow">${esc(r.n)}</span><b>${euro(r.i)}</b></div>`).join("")).join("")}</details>`;}
  return o+`</div>`;}
/* storico: un anno per riga, con le quote dell'unità */
function cnStorico(C){
  const Y=cnAnni(),riga=y=>{const A=C.anni[y],s=(A.str||[]).reduce((t,v)=>t+cnN(v.q),0);return {y,cons:A.cons?cnN(A.cons.tot):null,prev:A.prev?cnN(A.prev.tot):null,str:(A.str||[]).length?s:null,saldo:A.cons&&A.cons.saldo!=null?cnN(A.cons.saldo):null};},
    L=Y.map(riga),mx=Math.max(1,...L.map(r=>(r.cons!=null?r.cons:r.prev||0)+(r.str||0)));
  let o=`<div class="card k-condo"><h3>📚 Storico <span class="pill">${Y.length} ${Y.length===1?"anno":"anni"}</span></h3><p class="lbl">Un anno per riga, con le quote della tua unità. Per aggiungere gli anni passati manda a Claude i loro documenti: il file che ricevi si carica qui sotto e si aggiunge agli altri.</p>
    <div class="cn-tw"><table class="cn-t"><thead><tr><th>Anno</th><th class="r">Preventivo</th><th class="r">Consuntivo</th><th class="r">Straordinarie</th><th class="r">Saldo di fine anno</th><th>Ordinarie + straordinarie</th></tr></thead><tbody>${L.slice().reverse().map(r=>{const b=r.cons!=null?r.cons:r.prev||0;return `<tr><td><button class="chip${r.y===coY?" on":""}" data-cny="${r.y}">${r.y}</button></td><td class="r">${r.prev!=null?euro(r.prev):"—"}</td><td class="r">${r.cons!=null?euro(r.cons):"—"}</td><td class="r">${r.str!=null?euro(r.str):"—"}</td><td class="r">${r.saldo!=null?(r.saldo<0?"debito ":r.saldo>0?"credito ":"")+euro(Math.abs(r.saldo)):"—"}</td><td><div class="cn-bar cn-b2" role="img" aria-label="${euro(b+(r.str||0))}"><i style="width:${b/mx*100}%"></i><u style="width:${(r.str||0)/mx*100}%"></u></div></td></tr>`;}).join("")}</tbody></table></div>
    <p class="cn-dim">Barra: <span class="cn-k1"></span> ordinarie (consuntivo, oppure preventivo se il consuntivo non c'è ancora) · <span class="cn-k2"></span> straordinarie</p>`;
  const docs=Y.flatMap(y=>(C.anni[y].docs||[]).map(d=>({y,t:d.t,d:d.d})));
  if(docs.length)o+=`<details class="more"><summary>Documenti da cui vengono i dati (${docs.length})</summary>${docs.map(d=>`<div class="row"><span class="pill">${d.y}</span><span class="grow">${esc(d.t)}</span><span class="cn-dim">${d.d?fmt(d.d,{day:"numeric",month:"short",year:"numeric"}):""}</span></div>`).join("")}</details>`;
  return o+`</div>`;}
/* documenti originali (PDF o foto) tenuti su questo iPad */
function cnDocs(C){const y0=new Date().getFullYear(),F=C.files.slice().sort((a,b)=>a.y<b.y?1:a.y>b.y?-1:0);
  return `<div class="card k-condo"><h3>📎 Documenti dell'amministratore <span class="pill">${F.length}</span></h3><p class="lbl">Qui puoi tenere i documenti originali, anno per anno. Restano solo su questo iPad e non entrano nelle copie di sicurezza: conserva anche gli originali.</p>`+
    (F.length?F.map(f=>`<div class="row"><span class="pill">${esc(f.y)}</span><span class="grow">${esc(f.n)}</span><button class="btn sm" data-cnfo="${f.id}">Apri</button><button class="btn sm" data-cnfx="${f.id}" aria-label="Togli il documento">✕</button></div>`).join(""):`<p class="empty">Nessun documento allegato.</p>`)+
    `<div class="btns cn-add"><label>Anno <select id="cnFy">${Array.from({length:12},(_,i)=>y0+1-i).map(y=>`<option${y===y0?" selected":""}>${y}</option>`).join("")}</select></label><label class="btn sm" style="cursor:pointer">➕ Aggiungi PDF o foto<input type="file" id="cnFin" accept="application/pdf,image/*" hidden></label></div></div>`;}
function bindCondo(){
  const C=cnD();
  document.querySelectorAll("[data-cny]").forEach(b=>b.onclick=()=>{coY=b.dataset.cny;render();});
  document.querySelectorAll("[data-cnp]").forEach(b=>b.onclick=()=>{const k=b.dataset.cnp;if(C.pag[k])delete C.pag[k];else C.pag[k]=today();
    const s=P.scad.find(x=>x.id==="condo-"+k);if(s)s.done=!!C.pag[k];save();render();toast(C.pag[k]?"✅ Segnata come pagata":"Spunta tolta");});
  const pin=$("cnIn");if(pin)pin.onchange=async()=>{const f=pin.files&&pin.files[0];pin.value="";if(!f)return;
    try{const o=JSON.parse(await f.text());if(o.app!=="pianificazione-condominio"||!o.anni||typeof o.anni!=="object")throw 0;
      const nuovi=Object.keys(o.anni).filter(y=>/^\d{4}$/.test(y));if(!nuovi.length)throw 0;
      if(cnHas()&&!confirm("Aggiungere i dati del file «"+f.name+"» ("+nuovi.join(", ")+")? Le tue spunte restano."))return;
      cnUnisci(o);save();coY=null;render();toast("🏢 Dati del condominio caricati: "+nuovi.join(", "));}catch(e){toast("Questo file non è un file del condominio");}};
  if($("cnDel"))$("cnDel").onclick=()=>{if(!confirm("Cancellare da questo iPad tutti i dati del condominio (anni, spunte e documenti allegati)?"))return;
    C.files.forEach(f=>kv("readwrite","cf-"+f.id,undefined).catch(()=>{}));P.scad=P.scad.filter(x=>!String(x.id).startsWith("condo-"));P.condo={};coY=null;save();render();toast("Dati del condominio cancellati");};
  if($("cnCal"))$("cnCal").onclick=()=>{let n=0;cnVive().forEach(r=>{const id="condo-"+r.k,s=P.scad.find(x=>x.id===id),t="🏢 Condominio: "+r.n,note=euro(r.i);
    if(s){s.d=r.d;s.t=t;s.note=note;s.done=!!C.pag[r.k];}else{P.scad.push({id,t,d:r.d,cat:"casa",ric:"",av:5,note,done:!!C.pag[r.k]});n++;}});
    save();render();toast(n?"📌 "+n+(n===1?" rata messa":" rate messe")+" nel Calendario":"📌 Rate aggiornate nel Calendario");};
  const fin=$("cnFin");if(fin)fin.onchange=async()=>{const f=fin.files&&fin.files[0];fin.value="";if(!f)return;if(f.size>15*1024*1024)return toast("File troppo grande (massimo 15 MB)");
    const id=uid();try{await kv("readwrite","cf-"+id,f);}catch(e){return toast("Non riesco a salvare il file su questo iPad");}
    C.files.push({id,y:$("cnFy").value,n:f.name||"documento",type:f.type||"",size:f.size,at:new Date().toISOString()});save();render();toast("Documento allegato");};
  document.querySelectorAll("[data-cnfo]").forEach(b=>b.onclick=async()=>{try{const meta=C.files.find(f=>f.id===b.dataset.cnfo),blob=await kv("readonly","cf-"+b.dataset.cnfo);if(!blob)return toast("File non trovato su questo iPad");pratView(blob,meta||{n:"documento",type:blob.type});}catch(e){toast("Non riesco ad aprire il file");}});
  document.querySelectorAll("[data-cnfx]").forEach(b=>b.onclick=()=>{if(!confirm("Togliere questo documento?"))return;kv("readwrite","cf-"+b.dataset.cnfx,undefined).catch(()=>{});C.files=C.files.filter(f=>f.id!==b.dataset.cnfx);save();render();});
}
