/* ================= 📊 STATISTICHE e 💡 RISPARMIO =================
   Calcoli fatti sui movimenti importati (giroconti tra i propri conti esclusi). Nessun consiglio di investimento:
   numeri e strategie generali di gestione del bilancio, le decisioni restano dell'utente. */
let SP=12; // periodo in mesi
const STOP=/^(sepa|direct|debit|addebito|sdd|fattura|fattur|a|vs|carico|da|per|mand|srl|spa|s|p|a|sa|rl|sarl|et|ci|cie|carta|pagamento|visa|presso|it|lt|torino|bonifico|istantaneo|italia|estero|beneficiario|ord|ben|di|del|della|e|il|la|in|su|the)$/;
function merchKey(t){let s=String(t||"").toLowerCase();if(s.includes(" · "))s=s.split(" · ").slice(1).join(" ");
  const w=s.replace(/[^a-zàèéìòù ]/g," ").split(/\s+/).filter(x=>x.length>2&&!STOP.test(x));return w.slice(0,2).map(x=>x[0].toUpperCase()+x.slice(1)).join(" ")||"Altro";}
function periodMonths(n){return lastMonths(n+1).slice(0,n);} // mesi completi (escluso il mese in corso)
function outMov(ms){const set=new Set(ms);return C().mov.filter(m=>m.tipo==="u"&&!isTransfer(m)&&set.has(m.d.slice(0,7)));}
function stats(n){const ms=periodMonths(n),A=ms.map(ym=>Object.assign({ym},monthActual(ym))).filter(x=>x.e||x.u);
  const k=A.length||1,E=A.reduce((s,x)=>s+x.e,0)/k,U=A.reduce((s,x)=>s+x.u,0)/k;
  const per={};A.forEach(x=>Object.entries(x.per).forEach(([c,v])=>per[c]=(per[c]||0)+v));
  const half=Math.floor(A.length/2),rec=A.slice(-Math.min(3,half)),pre=A.slice(-2*Math.min(3,half),-Math.min(3,half));
  const trend={};Object.keys(per).forEach(c=>{const r=rec.reduce((s,x)=>s+(x.per[c]||0),0)/(rec.length||1),p=pre.reduce((s,x)=>s+(x.per[c]||0),0)/(pre.length||1);trend[c]=p>0?(r-p)/p:null;});
  const mv=outMov(ms),small=mv.filter(m=>m.imp<10);
  const giro=C().mov.filter(m=>m.cat==="giro"&&m.tipo==="u"&&ms.includes(m.d.slice(0,7))).reduce((s,m)=>s+m.imp,0)/k;
  const best=A.slice().sort((a,b)=>(b.e-b.u)-(a.e-a.u));
  const merch={};mv.forEach(m=>{const key=merchKey(m.t);merch[key]=(merch[key]||0)+m.imp;});
  return{ms,A,k,E,U,per,trend,small:{n:small.length,tot:small.reduce((s,m)=>s+m.imp,0)},giro,best:best[0],worst:best[best.length-1],merch:Object.entries(merch).sort((a,b)=>b[1]-a[1]).slice(0,10)};}
/* addebiti che si ripetono quasi ogni mese con importi simili: spese fisse */
function recurring(n){const ms=periodMonths(Math.max(n,6)),g={};outMov(ms).forEach(m=>{const k=merchKey(m.t);(g[k]=g[k]||[]).push(m);});
  const out=[];Object.entries(g).forEach(([k,L])=>{const months=new Set(L.map(m=>m.d.slice(0,7)));if(months.size<Math.max(3,ms.length*.55))return;
    const perM={};L.forEach(m=>perM[m.d.slice(0,7)]=(perM[m.d.slice(0,7)]||0)+m.imp);const vals=Object.values(perM),mean=vals.reduce((a,b)=>a+b,0)/vals.length,sd=Math.sqrt(vals.reduce((a,b)=>a+(b-mean)**2,0)/vals.length);
    const sorted=L.slice().sort((a,b)=>a.d<b.d?-1:1),last=sorted[sorted.length-1],lastM=perM[last.d.slice(0,7)],prevVals=Object.entries(perM).filter(([m])=>m<last.d.slice(0,7)).map(x=>x[1]),prevMed=prevVals.length?prevVals.slice().sort((a,b)=>a-b)[Math.floor(prevVals.length/2)]:lastM;
    out.push({k,cat:last.cat,mens:mean*months.size/ms.length,last:lastM,lastD:last.d,stable:sd/mean<.35,up:prevMed&&lastM>prevMed*1.1?prevMed:null,stopped:diff(last.d,today())>45,n:L.length});});
  return out.sort((a,b)=>b.mens-a.mens);}
const pct=x=>(x>0?"+":"")+Math.round(x*100)+"%";
function cStat(){const S=stats(SP),tot=Object.values(S.per).reduce((a,b)=>a+b,0)||1,sav=S.E-S.U;
  if(!S.A.length)return `<div class="card"><p class="empty">Servono movimenti importati di almeno un mese completo.</p></div>`;
  const sel=`<div class="btns" style="margin:0 0 10px">${[3,6,12,24].map(n=>`<button class="btn sm${n===SP?" pri":""}" data-sp="${n}">${n} mesi</button>`).join("")}</div>`;
  return sel+`<div class="kpi"><div><b class="amt e">${euro(S.E)}</b><span>entrate medie al mese</span></div><div><b class="amt u">${euro(S.U)}</b><span>uscite medie al mese</span></div>
    <div><b class="amt ${sav>=0?"e":"u"}">${euro(sav)}</b><span>avanzo medio al mese</span></div><div><b>${S.E?Math.round(sav/S.E*100):0}%</b><span>quota delle entrate che resta</span></div>
    <div><b class="amt">${euro(S.giro)}</b><span>spostati ogni mese verso altri tuoi conti</span></div></div>
  ${S.giro>50?`<p class="lbl">I soldi spostati verso altri tuoi conti non sono contati come spese: importa anche quei conti per vedere dove finiscono.</p>`:""}
  <h2>Mese per mese</h2><div class="card">${S.A.map(x=>`<div class="row"><div class="grow"><b>${MESE(x.ym)}</b></div><span class="amt e">+${euro(x.e)}</span><span class="amt u">−${euro(x.u)}</span><span class="amt ${x.e-x.u>=0?"e":"u"}" style="min-width:100px;text-align:right">${euro(x.e-x.u)}</span></div>`).join("")}
    <p class="lbl">Mese migliore: ${MESE(S.best.ym)} (${euro(S.best.e-S.best.u)}) · mese più pesante: ${MESE(S.worst.ym)} (${euro(S.worst.e-S.worst.u)})</p></div>
  <h2>Categorie</h2><div class="card">${Object.entries(S.per).sort((a,b)=>b[1]-a[1]).map(([c,v])=>{const tr=S.trend[c];return `<div class="row"><div class="grow"><b>${catName(c)}</b><div style="height:7px;border-radius:5px;background:var(--seg);margin-top:5px"><div style="height:7px;border-radius:5px;width:${Math.round(v/tot*100)}%;background:var(--accent)"></div></div></div><span class="lbl" style="min-width:44px;text-align:right">${Math.round(v/tot*100)}%</span><span class="amt" style="min-width:96px;text-align:right">${euro(v/S.k)}/mese</span><span class="pill ${tr==null?"":tr>.1?"warn":tr<-.1?"ok":""}" title="ultimi 3 mesi rispetto ai 3 precedenti">${tr==null?"—":pct(tr)}</span></div>`;}).join("")}
    <p class="lbl">Percentuale = quota sul totale delle uscite. Etichetta a destra: ultimi 3 mesi rispetto ai 3 precedenti.</p></div>
  <h2>Dove spendi di più</h2><div class="card">${S.merch.map(([k,v])=>`<div class="row"><div class="grow">${esc(k)}</div><span class="amt">${euro(v/S.k)}/mese</span><span class="lbl">${euro(v)} in ${S.k} mesi</span></div>`).join("")}</div>
  <div class="kpi"><div><b>${S.small.n}</b><span>spese sotto 10 € nel periodo</span></div><div><b class="amt">${euro(S.small.tot)}</b><span>totale delle spese piccole</span></div></div>`;}
function cRisp(){const S=stats(12),R=recurring(12),act=R.filter(r=>!r.stopped),fix=act.reduce((s,r)=>s+r.mens,0),varM=Math.max(0,S.U-fix);
  const debts=act.filter(r=>r.cat==="rate"||/cofidis|unicredit|findomestic|agos|compass|prestito|finanz/.test(r.k)),debtM=debts.reduce((s,r)=>s+r.mens,0);
  const cashM=(S.per.contanti||0)/S.k,sav=S.E-S.U,ef=fix*3,ef6=fix*6;
  const ideas=[];
  if(debtM)ideas.push(["📑","Rate e finanziamenti",`Pesano ${euro(debtM)} al mese (${S.E?Math.round(debtM/S.E*100):0}% delle entrate). Quando una rata finisce, sposta la stessa cifra nel risparmio con un bonifico automatico: il bilancio non cambia e il risparmio cresce da solo. Se ne hai più di una, chiudere prima quella col tasso più alto (TAEG) fa pagare meno interessi in tutto.`]);
  act.filter(r=>r.up).forEach(r=>ideas.push(["📈",r.k,`L'ultimo addebito (${euro(r.last)}) è più alto del solito (${euro(r.up)}). Vale la pena controllare se è cambiato il contratto o il premio.`]));
  if(cashM>40)ideas.push(["💵","Prelievi e ricariche",`${euro(cashM)} al mese escono come contanti o ricariche (es. Satispay): da qui non si vede come vengono spesi. Un tetto mensile in Budget aiuta a tenerli d'occhio.`]);
  const contr=act.filter(r=>["casa","auto","abbonamenti"].includes(r.cat));if(contr.length)ideas.push(["🔎","Contratti da rivedere una volta all'anno",`${contr.map(r=>esc(r.k)).join(", ")}: insieme ${euro(contr.reduce((s,r)=>s+r.mens,0))} al mese. Per luce e gas il confronto ufficiale delle offerte è il Portale Offerte di ARERA (ilportaleofferte.it); per assicurazione e telefono conviene chiedere un preventivo prima del rinnovo.`]);
  if(S.small.n>20)ideas.push(["☕","Spese piccole",`${S.small.n} spese sotto 10 € in un anno, per ${euro(S.small.tot)}: prese una per una sembrano niente, sommate fanno ${euro(S.small.tot/12)} al mese.`]);
  ideas.push(["🏦","Pagati per primi",`Il giorno in cui arriva lo stipendio, un bonifico automatico verso un conto separato mette da parte una cifra fissa prima di spendere. Con l'avanzo medio attuale (${euro(sav)} al mese) puoi partire da una parte di quella cifra.`]);
  ideas.push(["🛟","Fondo per le emergenze",`Una regola diffusa è avere da parte 3–6 mesi di spese fisse: per te tra ${euro(ef)} e ${euro(ef6)}. Saldo attuale sui conti: ${euro(totBal())}.`]);
  const cats=Object.entries(S.per).filter(([c])=>!["rate","banca","tasse","contanti"].includes(c)).sort((a,b)=>b[1]-a[1]).slice(0,6);
  return `<div class="kpi"><div><b class="amt">${euro(fix)}</b><span>spese fisse al mese (addebiti che tornano ogni mese)</span></div><div><b class="amt">${euro(varM)}</b><span>spese variabili al mese</span></div><div><b class="amt ${sav>=0?"e":"u"}">${euro(sav)}</b><span>avanzo medio (ultimi 12 mesi)</span></div><div><b class="amt">${euro(sav*12)}</b><span>avanzo in un anno, a questo ritmo</span></div></div>
  ${S.giro>100?`<div class="card" style="border-color:var(--soon)"><b>⚠️ Avanzo da leggere con attenzione</b><p style="margin:4px 0 0">Ogni mese in media ${euro(S.giro)} vanno verso altri tuoi conti (giroconti) e qui non sono contati come spese. Se su quei conti vengono spesi, l'avanzo reale è più basso: importa anche quei conti (es. N26) per avere il quadro completo.</p></div>`:""}
  <h2>Spese fisse trovate</h2><div class="card">${R.length?R.map(r=>`<div class="row"><div class="grow"><b>${esc(r.k)}</b><small>${catName(r.cat)} · ultimo ${fmt(r.lastD,{day:"numeric",month:"short",year:"numeric"})}${r.stopped?" · <b>sembra terminato</b>":""}${r.up?' · <b style="color:var(--warn)">aumentato</b>':""}</small></div><span class="amt u">${euro(r.mens)}/mese</span><span class="lbl">${euro(r.mens*12)}/anno</span></div>`).join(""):'<p class="empty">Servono almeno 3 mesi di movimenti.</p>'}</div>
  <h2>💡 Dove si può risparmiare</h2>${ideas.map(([i,t,x])=>`<div class="card"><h3>${i} ${esc(t)}</h3><p style="margin:0">${x}</p></div>`).join("")}
  <h2>🎚️ Prova a ridurre</h2><div class="card"><p class="lbl">Sposta i cursori: vedi quanto risparmieresti al mese e in un anno, e in quanto tempo arrivi a un obiettivo.</p>
    ${cats.map(([c,v])=>`<div class="row"><div class="grow"><b>${catName(c)}</b><small>${euro(v/S.k)} al mese</small></div><input type="range" min="0" max="50" step="5" value="0" data-cut="${c}" data-v="${(v/S.k).toFixed(2)}" style="width:160px"><span class="lbl" data-cutl="${c}" style="min-width:44px">0%</span></div>`).join("")}
    <div class="form" style="margin-top:8px"><label>Obiettivo da mettere da parte €<input id="goalA" type="text" inputmode="decimal" value="${Math.round(ef/100)*100||""}"></label></div>
    <div class="kpi" style="margin-top:10px"><div><b class="amt e" id="cutM">0,00 €</b><span>risparmio in più al mese</span></div><div><b class="amt e" id="cutY">0,00 €</b><span>in un anno</span></div><div><b id="goalT">—</b><span>mesi per l'obiettivo (avanzo attuale + tagli)</span></div></div></div>
  <p class="lbl">Sono calcoli sui tuoi movimenti, non consigli finanziari: per scelte su prestiti, investimenti o pensione conviene sentire la banca o un consulente.</p>`;}
function bindStat(){document.querySelectorAll("[data-sp]").forEach(b=>b.onclick=()=>{SP=+b.dataset.sp;render();});
  const upd=()=>{let m=0;document.querySelectorAll("[data-cut]").forEach(r=>{m+=(+r.dataset.v)*(+r.value)/100;const l=document.querySelector('[data-cutl="'+r.dataset.cut+'"]');if(l)l.textContent=r.value+"%";});
    if(!$("cutM"))return;$("cutM").textContent=euro(m);$("cutY").textContent=euro(m*12);const S=stats(12),g=parseAmt($("goalA").value),per=S.E-S.U+m;$("goalT").textContent=g>0?(per>0?Math.ceil(g/per)+" mesi":"—"):"—";};
  document.querySelectorAll("[data-cut]").forEach(r=>r.oninput=upd);if($("goalA"))$("goalA").oninput=upd;upd();}
