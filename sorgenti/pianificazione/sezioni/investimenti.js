/* ================= 🌱 INVESTIMENTI =================
   Strategie per le somme in arrivo (premio, TFS, F.A.F.), riserva di sicurezza, debiti da estinguere o no,
   simulatore, profilo di rischio (questionario breve), tassi di mercato (dal file pubblico news-pensione.json → «mercati»,
   aggiornato alle 13 · 17 · 23). Dati in P.inv. Sono calcoli con ipotesi dichiarate: fatti e strategie, non consigli. */
const IV=[["pan","Panoramica"],["prof","Profilo"],["ris","Riserva"],["som","Somme in arrivo"],["deb","Debiti"],["sim","Simulatore"],["tas","Tassi"]];
let invV=(()=>{try{const v=sessionStorage.getItem("pn-invv");return IV.some(x=>x[0]===v)?v:"pan";}catch(e){return "pan";}})(),invQ=null;
function INV(){if(!P.inv||typeof P.inv!=="object")P.inv={};const v=P.inv;["prof","ris","deb","sim","ipo","som"].forEach(k=>{if(!v[k]||typeof v[k]!=="object")v[k]={};});return v;}
/* tassi: valori pubblicati (con data e fonte) e, se scritti, i tuoi */
const MK_BASE=[
  {id:"infl",t:"Inflazione in Italia (NIC, su un anno)",valore:4.2,d:"2026-10-16",fonte:"ISTAT, settembre 2026 (definitivo)",url:"https://www.istat.it/wp-content/uploads/2026/10/Prezzi-al-consumo-def-Set2026-1.pdf"},
  {id:"bce",t:"Tasso BCE sui depositi",valore:2.5,d:"2026-09-16",fonte:"BCE, decisione del 10 settembre 2026",url:"https://www.ecb.europa.eu/press/pr/date/2026/html/ecb.mp260910~314e508016.it.html"},
  {id:"btp2",t:"BTP a 2 anni (rendimento lordo)",valore:3.45,d:"2026-10-16",fonte:"Trading Economics",url:"https://it.tradingeconomics.com/italy/government-bond-yield"},
  {id:"btp5",t:"BTP a 5 anni (rendimento lordo)",valore:3.92,d:"2026-10-16",fonte:"Trading Economics",url:"https://it.tradingeconomics.com/italy/government-bond-yield"},
  {id:"btp10",t:"BTP a 10 anni (rendimento lordo)",valore:4.48,d:"2026-10-16",fonte:"Trading Economics",url:"https://it.tradingeconomics.com/italy/government-bond-yield"},
  {id:"btpv",t:"BTP Valore ottobre 2026, 5 anni (rendimento lordo a scadenza, circa)",valore:4.1,d:"2026-10-16",fonte:"Milano Finanza",url:"https://www.milanofinanza.it/news/btp-valore-ottobre-2026-ai-raggi-x-quanto-rendono-davvero-i-rischi-e-come-usarli-in-portafoglio-202610161506541622",nota:"collocamento 19–23 ottobre 2026; cedole minime 3,7% (anni 1–2), 4,1% (3–4), 4,7% (5)"},
  {id:"cdl",t:"Conto deposito libero, miglior tasso lordo",valore:3.0,d:"2026-10-18",fonte:"conti-deposito.net",url:"https://www.conti-deposito.net/confronto-conti-deposito.php",nota:"tasso promozionale"},
  {id:"cd12",t:"Conto deposito vincolato 12 mesi, miglior tasso lordo",valore:4.0,d:"2026-10-18",fonte:"conti-deposito.net",url:"https://www.conti-deposito.net/confronto-conti-deposito.php"},
  {id:"cd24",t:"Conto deposito vincolato 24 mesi, miglior tasso lordo",valore:4.0,d:"2026-10-18",fonte:"conti-deposito.net",url:"https://www.conti-deposito.net/confronto-conti-deposito.php"},
  {id:"cd36",t:"Conto deposito vincolato 36 mesi, miglior tasso lordo",valore:3.75,d:"2026-10-18",fonte:"conti-deposito.net",url:"https://www.conti-deposito.net/confronto-conti-deposito.php"}];
function mkList(){const pub=(newsData().mercati||[]),I=INV().ipo;return MK_BASE.map(b=>{const p=pub.find(x=>x.id===b.id&&isFinite(+x.valore));const o=Object.assign({},b,p||{});o.pub=+o.valore;if(I[b.id]!=null&&I[b.id]!==""){o.valore=+I[b.id];o.mio=1;}else o.valore=+o.valore;return o;});}
const mk=id=>{const x=mkList().find(y=>y.id===id);return x?x.valore:0;};
const ipct=v=>(Math.round(v*100)/100).toLocaleString("it-IT",{minimumFractionDigits:v%1?1:0,maximumFractionDigits:2})+"%";
const eurI=n=>n==null||!isFinite(n)?"—":Math.round(n).toLocaleString("it-IT")+" €";
/* ---- strategie: rendimenti lordi annui (prudente / medio / ottimista), tasse sul guadagno, bollo, costi, perdita in un anno cattivo ---- */
function btpRate(y){const a=mk("btp2"),b=mk("btp5"),c=mk("btp10");return y<=2?a:y<=5?a+(b-a)*(y-2)/3:y<=10?b+(c-b)*(y-5)/5:c;}
function cdRate(y){return y<=1?mk("cd12"):y<=2?mk("cd24"):mk("cd36");}
function STRAT(y){return [
  {id:"cc",ic:"🏦",n:"Lasciarli sul conto corrente",r:[0,0,0],tax:26,boll:0,fix:34.2,ter:0,peg:0,risk:1,liq:"subito",
    pro:"sempre disponibili",con:"l’inflazione ne mangia il valore; bollo di 34,20 € l’anno sopra 5.000 € di giacenza media"},
  {id:"cdl",ic:"🐖",n:"Conto deposito libero",r:[Math.max(0,mk("cdl")-1.5),mk("cdl")-0.5,mk("cdl")],tax:26,boll:0.2,ter:0,peg:0,risk:1,liq:"in pochi giorni",
    pro:"capitale garantito dal Fondo Interbancario fino a 100.000 € per banca; disponibile",con:"il tasso migliore spesso è promozionale e scende dopo qualche mese"},
  {id:"cdv",ic:"🔒",n:"Conto deposito vincolato "+(y<=1?"12":y<=2?"24":"36")+" mesi",r:[cdRate(y)-(y>3?1:0),cdRate(y)-(y>3?0.5:0),cdRate(y)],tax:26,boll:0.2,ter:0,peg:0,risk:1,liq:"alla scadenza del vincolo",
    pro:"tasso fisso noto in anticipo; Fondo Interbancario fino a 100.000 € per banca",con:"svincolare prima di solito fa perdere gli interessi; oltre i 36 mesi il tasso di rinnovo non è noto"},
  {id:"btp",ic:"🇮🇹",n:"Titoli di Stato tenuti fino alla scadenza (BTP)",r:[btpRate(y)-0.3,btpRate(y),btpRate(y)],tax:12.5,boll:0.2,ter:0,peg:y<=5?0.06:0.12,risk:2,liq:"vendibili ogni giorno, ma il prezzo cambia",
    pro:"tasse al 12,5% invece del 26%; fuori dall’ISEE fino a 50.000 €; alla scadenza rimborsati a 100",con:"se li vendi prima della scadenza e i tassi sono saliti, perdi sul prezzo; rischio legato all’Italia"},
  {id:"eob",ic:"📄",n:"ETF obbligazionario globale (coperto in euro)",r:[1.5,3,4],tax:26,boll:0.2,ter:0.15,peg:0.13,risk:3,liq:"vendibile ogni giorno",
    pro:"tante obbligazioni di paesi e società diverse",con:"nel 2022 questi ETF hanno perso circa il 13% in un anno; nessuna scadenza fissa"},
  {id:"bil",ic:"⚖️",n:"Portafoglio bilanciato: 60% azioni, 40% obbligazioni (ETF)",r:[2,4.5,6.5],tax:26,boll:0.2,ter:0.2,peg:0.22,risk:4,liq:"vendibile ogni giorno",
    pro:"crescita più alta nel lungo periodo, oscillazioni più contenute delle sole azioni",con:"in un anno cattivo può perdere un quinto; serve un orizzonte di almeno 5 anni"},
  {id:"azi",ic:"🌍",n:"ETF azionario mondiale",r:[3,6,8],tax:26,boll:0.2,ter:0.2,peg:0.37,risk:5,liq:"vendibile ogni giorno",
    pro:"storicamente il rendimento più alto su periodi lunghi",con:"nel 2008 ha perso circa il 37% in un anno e ci ha messo anni a recuperare; adatto a orizzonti di 10 anni e più"},
  {id:"pac",ic:"🪜",n:"Ingresso graduale (PAC): dal conto deposito al bilanciato in 24 mesi",r:null,tax:26,boll:0.2,ter:0.2,peg:0.15,risk:4,liq:"vendibile ogni giorno",
    pro:"entri un po’ alla volta: riduce il rischio di comprare tutto nel momento sbagliato",con:"nei primi due anni rende come il conto deposito; poi oscilla come il bilanciato"}];}
const MIN_Y={cc:0,cdl:0,cdv:1,btp:1,eob:3,bil:5,azi:10,pac:5};
/* crescita mese per mese: rendimento netto dei costi, bollo ogni anno, tasse sul guadagno alla fine */
function grow(cap,mens,anni,r,s,mesiPac){let v=cap,vers=cap,tassaCed=0;const n=Math.round(anni*12),pts=[{m:0,v}];
  for(let m=1;m<=n;m++){let rr;if(s.id==="pac"){const inB=Math.min(1,m/(mesiPac||24));rr=(1-inB)*(mk("cdl")-0.5)+inB*r;}else rr=r;
    const g=v*((rr-(s.ter||0))/100)/12;v+=g;if(s.id==="btp")tassaCed+=Math.max(0,g)*s.tax/100;v+=mens;vers+=mens;
    if(m%12===0||m===n){const fr=m%12===0?1:(m%12)/12;v-=(s.fix?(v>5000?s.fix*fr:0):v*(s.boll||0)/100*fr);}
    if(m%12===0||m===n)pts.push({m,v});}
  const gain=v-vers,tax=s.id==="btp"?tassaCed:Math.max(0,gain)*s.tax/100,net=v-(s.id==="btp"?tassaCed:tax);return{lordo:v,net,vers,gain:net-vers,tax,pts};}
function stratCalc(s,cap,anni,mens){const sp=s.r||[2,4.5,6.5];
  const res=sp.map(r=>grow(cap,mens||0,anni,r,s,24)),infl=INV().ipo.inflF!=null&&INV().ipo.inflF!==""?+INV().ipo.inflF:3;
  const real=v=>v/Math.pow(1+infl/100,anni);return{s,p:res[0],m:res[1],o:res[2],real:real(res[1].net),infl,worst:cap*(s.peg||0)};}
/* ---- profilo: 7 domande ---- */
const QZ=[["Fra quanto tempo potresti avere bisogno di questi soldi?",["entro 2 anni","fra 2 e 5 anni","fra 5 e 10 anni","oltre 10 anni"]],
  ["Se in un anno il tuo investimento perdesse il 20%, che cosa faresti?",["venderei tutto","venderei una parte","aspetterei","ne comprerei altro"]],
  ["Che esperienza hai con gli investimenti?",["nessuna","conti deposito, buoni o titoli di Stato","fondi o ETF","azioni"]],
  ["Che cosa conta di più per te?",["non perdere nulla","non perdere contro l’inflazione","una crescita moderata","la crescita più alta possibile"]],
  ["Che parte dei tuoi risparmi sono queste somme?",["quasi tutti","più della metà","meno della metà","una piccola parte"]],
  ["Con la pensione, le entrate sicure coprono le spese di ogni mese?",["no","appena","sì, con un margine","ampiamente"]],
  ["Fra queste possibilità, quale preferisci?",["2% l’anno sicuro","probabile 4%, al peggio −5% in un anno","probabile 6%, al peggio −15%","probabile 8%, al peggio −30%"]]];
const PROF=[[0,6,"Prudente",2,"Capitale al sicuro prima di tutto: conti deposito e titoli di Stato tenuti fino alla scadenza."],[7,11,"Moderato",3,"Soprattutto strumenti sicuri, una piccola parte che può oscillare."],[12,16,"Equilibrato",4,"Una parte importante può oscillare per crescere di più, con un orizzonte di almeno 5 anni."],[17,21,"Dinamico",5,"Accetti grandi oscillazioni per la crescita più alta, con un orizzonte lungo."]];
function profilo(){const a=INV().prof.r||[];if(a.length<QZ.length||a.some(x=>x==null))return null;const s=a.reduce((x,y)=>x+(+y),0),p=PROF.find(z=>s>=z[0]&&s<=z[1]);return{s,n:p[2],max:p[3],t:p[4],anni:[1,3,7,10][+a[0]]};}
/* ---- dati dalla Pensione e dalla Cassa ---- */
function invCassa(){try{if(!P.pens||!P.pens.cassa||!P.pens.cassa.ini)return null;return cassaCalc();}catch(e){return null;}}
function spesaMese(){const v=INV().ris.spese;if(v!=null&&v!=="")return +v;const K=invCassa();if(!K)return 0;const T=K.T,L=(PENS().mov||[]).filter(x=>x.tipo==="u");
  return L.reduce((a,x)=>a+movDates(x,T+"-01",T+"-31").length*(+x.imp||0),0);}
const riserva=()=>spesaMese()*(+(INV().ris.mesi||6));
function somme(){const K=invCassa();if(!K)return[];return K.items.filter(i=>i.src==="Scheda"&&i.imp>=1000&&i.d>K.t).map(i=>({k:i.k,t:i.t,d:i.d,imp:i.imp}));}
function investibile(d){const K=invCassa();if(!K)return null;const ym=d.slice(0,7),fut=K.rows.filter(r=>r.ym>=ym).map(r=>r.fin);if(!fut.length)return null;return Math.max(0,Math.min(...fut)-riserva());}
function debiti(){const t=today(),D=INV().deb;return (P.pens&&P.pens.mov||[]).filter(x=>x.tipo==="u"&&x.freq==="m"&&x.a&&x.a>t).map(x=>{const o=D[x.id]||{},n=Math.max(0,(+x.a.slice(0,4)-+t.slice(0,4))*12+(+x.a.slice(5,7)-+t.slice(5,7))+(x.a.slice(8)>=t.slice(8)?1:0));
  const mutuo=/mutu/i.test(x.t),tipo=o.tipo||(mutuo?"mutuo":"consumo");return{x,o,n,tipo,tan:o.tan!=null&&o.tan!==""?+o.tan:null,res:o.res!=null&&o.res!==""?+o.res:null};});}
const annuityPV=(rata,i,n)=>i>0?rata*(1-Math.pow(1+i,-n))/i:rata*n;
function debCalc(d,quando){const t=today(),q=quando||t,rata=+d.x.imp||0;if(d.tan==null)return null;const i=d.tan/1200;
  const nq=Math.max(0,d.n-Math.max(0,(+q.slice(0,4)-+t.slice(0,4))*12+(+q.slice(5,7)-+t.slice(5,7))));
  const resQ=d.res!=null&&q===t?d.res:annuityPV(rata,i,nq),interessi=rata*nq-resQ,pen=d.tipo==="mutuo"?0:resQ*(nq>12?0.01:0.005),risp=interessi-pen;
  const cdv=STRAT(nq/12).find(s=>s.id==="cdv"),alt=grow(resQ,0,nq/12,cdv.r[2],cdv).gain,detr=d.tipo==="mutuo"?Math.min(interessi*0.19,4000*0.19*nq/12):0;
  return{nq,resQ,interessi,pen,risp,alt,detr,costo:resQ+pen,rata};}
/* ================= viste ================= */
function vInv(){const v=INV(),pr=profilo();
  let o=`<h1>🌱 Investimenti</h1><p class="sub">Che cosa fare dei soldi in arrivo e di quelli che non servono alla cassa: strategie a confronto con i tassi di oggi. Calcoli con ipotesi dichiarate, non consigli.</p>`;
  o+=`<div class="seg" role="tablist" style="margin:0 0 14px;width:max-content;max-width:100%">${IV.map(([k,n])=>`<button role="tab" data-iv="${k}" class="${invV===k?"on":""}" aria-selected="${invV===k}">${n}${k==="prof"&&!pr?`<span class="n">!</span>`:""}</button>`).join("")}</div>`;
  o+=({pan:invPan,prof:invProf,ris:invRis,som:invSom,deb:invDeb,sim:invSim,tas:invTas}[invV]||invPan)();
  return o+`<p class="lbl" style="margin:14px 2px 0">I rendimenti di ETF e portafogli sono ipotesi basate sull’andamento storico, non promesse; quelli di conti deposito e titoli di Stato sono i tassi pubblicati oggi. Le tasse sono quelle in vigore (26%, titoli di Stato 12,5%; bollo 0,20% l’anno). Per una decisione concreta serve un consulente finanziario indipendente: questa sezione mette in fila i numeri, non sostituisce la consulenza.</p>`;}
function invPan(){const K=invCassa(),pr=profilo(),S=somme(),ris=riserva(),D=debiti();let o="";
  o+=`<div class="kpi" style="margin-bottom:12px">${K&&K.oggi!=null?`<div><b>${eurI(K.oggi)}</b><span>liquidità di oggi (Cassa)</span></div>`:""}<div><b>${eurI(ris)}</b><span>riserva di sicurezza (${+(INV().ris.mesi||6)} mesi di spese)</span></div>
    ${S.length?`<div><b>${eurI(S.reduce((a,x)=>a+x.imp,0))}</b><span>somme in arrivo fino al ${fmt(S[S.length-1].d,{month:"short",year:"numeric"})}</span></div>`:""}${pr?`<div><b>${esc(pr.n)}</b><span>il tuo profilo</span></div>`:""}</div>`;
  if(!K)o+=`<div class="card k-inv"><p class="empty">Per i calcoli su liquidità e riserva serve la Cassa: in Pensione → Cassa scrivi da dove parti.</p><div class="btns"><button class="btn sm" data-goinv="cassa">Vai alla Cassa</button></div></div>`;
  if(!pr)o+=`<div class="card k-inv"><h3>🧭 Prima il profilo</h3><p class="lbl" style="margin-top:0">Sette domande: servono a ordinare le strategie da quelle più adatte a te.</p><div class="btns"><button class="btn sm pri" data-iv="prof">Rispondi</button></div></div>`;
  if(S.length){o+=`<div class="card k-inv"><h3>📥 Somme in arrivo</h3>${S.map(x=>{const inv=investibile(x.d);const best=invBest(x.imp,pr?pr.anni:5);
      return `<div class="row"><span class="pill inv">${fmt(x.d,{month:"short",year:"2-digit"})}</span><div class="grow"><b>${esc(x.t)}</b><small>${inv!=null?"investibile senza scendere sotto la riserva: fino a "+eurI(inv):""}${best?" · più adatta ora: "+esc(best.s.n)+" ("+eurI(best.m.gain)+" netti in "+(pr?pr.anni:5)+" anni)":""}</small></div><b>${eurI(x.imp)}</b></div>`;}).join("")}
    <div class="btns"><button class="btn sm" data-iv="som">Confronta le strategie</button></div></div>`;}
  const DC=D.map(d=>({d,c:debCalc(d)})).filter(z=>z.c);
  o+=`<div class="card k-inv"><h3>📑 Debiti</h3>${D.length?D.map(d=>{const c=debCalc(d);return `<div class="row"><div class="grow"><b>${esc(d.x.t)}</b><small>${eurI(d.x.imp)} al mese fino a ${fmt(d.x.a,{month:"short",year:"numeric"})}${c?" · estinguendo oggi risparmi circa "+eurI(c.risp)+" di interessi":" · scrivi il TAN per il calcolo"}</small></div></div>`;}).join(""):`<p class="empty">Nessuna rata con una data di fine nella Cassa.</p>`}
    <div class="btns"><button class="btn sm" data-iv="deb">Estinguere o no</button></div></div>`;
  const m=mkList();o+=`<div class="card k-inv"><h3>📊 Tassi di oggi</h3><div class="kpi">${["infl","bce","btp5","cd12"].map(id=>{const x=m.find(y=>y.id===id);return `<div><b>${ipct(x.valore)}</b><span>${esc(x.t.replace(/ \(.*\)/,""))}</span></div>`;}).join("")}</div><div class="btns"><button class="btn sm" data-iv="tas">Tutti i tassi e le fonti</button></div></div>`;
  return o;}
function invBest(cap,anni){const pr=profilo(),L=STRAT(anni).filter(s=>(!pr||s.risk<=pr.max)&&MIN_Y[s.id]<=anni).map(s=>stratCalc(s,cap,anni));return L.sort((a,b)=>b.m.net-a.m.net)[0]||null;}
function invProf(){const a=INV().prof.r||[],pr=profilo();
  return `<div class="card k-inv"><h3>🧭 Il tuo profilo di rischio</h3><p class="lbl" style="margin-top:0">Un orientamento, non il questionario di una banca (MiFID): serve solo a ordinare le strategie in questa sezione.</p>
    ${QZ.map(([q,op],i)=>`<div class="iq"><b>${i+1}. ${esc(q)}</b><div class="iqo">${op.map((t,j)=>`<button class="btn sm${+a[i]===j&&a[i]!=null?" pri":""}" data-iq="${i}:${j}">${esc(t)}</button>`).join("")}</div></div>`).join("")}
    ${pr?`<div class="card k-inv" style="margin-top:12px;box-shadow:none;border:1px solid var(--line)"><h3>${esc(pr.n)} · ${pr.s} punti su 21</h3><p style="margin:0">${esc(pr.t)}</p><p class="lbl" style="margin:6px 0 0">Orizzonte: circa ${pr.anni} ${pr.anni===1?"anno":"anni"}. Le strategie con rischio più alto restano visibili ma segnate.</p></div>`:`<p class="lbl">Rispondi a tutte le domande per vedere il profilo.</p>`}</div>`;}
function invRis(){const v=INV().ris,K=invCassa(),sp=spesaMese(),m=+(v.mesi||6),r=sp*m;
  let o=`<div class="card k-inv"><h3>🛟 Riserva di sicurezza</h3><p class="lbl" style="margin-top:0">Soldi da tenere sempre disponibili per imprevisti e ritardi (per esempio la pensione che arriva tardi). Una regola diffusa è da 3 a 12 mesi di spese; chi ha entrate fisse sicure spesso sta più vicino a 6.</p>
    <div class="form"><label>Spese al mese €${v.spese!=null&&v.spese!==""?"":K?" (uscite della Cassa di questo mese)":""}<input data-ir="spese" inputmode="decimal" value="${esc(String(Math.round(sp)))}"></label>
    <label>Quanti mesi<select data-ir="mesi">${[3,6,9,12].map(k=>`<option value="${k}"${m===k?" selected":""}>${k} mesi</option>`).join("")}</select></label></div>
    <div class="kpi" style="margin-top:10px"><div><b>${eurI(r)}</b><span>riserva</span></div>${K?`<div><b class="${K.min<r?"amt u":""}">${eurI(K.min)}</b><span>punto più basso della Cassa (${ymLab(K.minM)})</span></div>`:""}</div>
    ${K&&K.min<r?`<p class="lbl" style="color:var(--scad);margin:8px 0 0">⚠️ Nel mese più basso la Cassa scende sotto la riserva: prima di vincolare soldi conviene coprire quel periodo.</p>`:""}</div>`;
  if(K){const S=somme();o+=`<div class="card k-inv"><h3>Quanto si può mettere da parte, e quando</h3><p class="lbl" style="margin-top:0">Per ogni data: il saldo più basso previsto da lì a giugno 2029, meno la riserva. È la somma che si può vincolare senza che la Cassa scenda sotto la riserva in futuro.</p>
    ${[{t:"Oggi",d:K.t}].concat(S).map(x=>`<div class="row"><span class="pill inv">${fmt(x.d,{day:"numeric",month:"short",year:"2-digit"})}</span><div class="grow"><b>${esc(x.t)}</b>${x.imp?`<small>arrivano ${eurI(x.imp)}</small>`:""}</div><b>${eurI(investibile(x.d))}</b></div>`).join("")}</div>`;}
  return o;}
function invSom(){const v=INV().som,pr=profilo(),S=somme(),K=invCassa();
  const opts=S.map(x=>({k:x.k,t:x.t+" ("+fmt(x.d,{month:"short",year:"numeric"})+")",imp:x.imp})).concat(K?[{k:"oggi",t:"Investibile da oggi",imp:investibile(K.t)||0}]:[]);
  const sel=opts.find(x=>x.k===v.k)||opts[0],cap=v.cap!=null&&v.cap!==""?+v.cap:(sel?sel.imp:10000),anni=+(v.anni||(pr?pr.anni:5));
  const L=STRAT(anni).map(s=>stratCalc(s,cap,anni)).map(x=>Object.assign(x,{ok:(!pr||x.s.risk<=pr.max),hz:MIN_Y[x.s.id]<=anni})).sort((a,b)=>(b.ok&&b.hz)-(a.ok&&a.hz)||b.m.net-a.m.net);
  let o=`<div class="card k-inv"><h3>📥 Che cosa fare di una somma</h3><div class="form">
    <label>Somma<select data-is="k">${opts.map(x=>`<option value="${esc(x.k)}"${sel&&sel.k===x.k?" selected":""}>${esc(x.t)}</option>`).join("")}<option value="mano"${v.k==="mano"?" selected":""}>Scrivo io l’importo</option></select></label>
    <label>Importo €<input data-is="cap" inputmode="decimal" value="${esc(String(Math.round(cap)))}"></label>
    <label>Per quanto tempo<select data-is="anni">${[1,2,3,5,7,10,15].map(k=>`<option value="${k}"${anni===k?" selected":""}>${k} ${k===1?"anno":"anni"}</option>`).join("")}</select></label>
    <label>Inflazione ipotizzata<select data-is="inflF">${[2,2.5,3,3.5,4].map(k=>`<option value="${k}"${(L[0]?L[0].infl:3)===k?" selected":""}>${ipct(k)} l’anno</option>`).join("")}</select></label></div>
    <p class="lbl" style="margin:8px 0 0">Oggi l’inflazione è al ${ipct(mk("infl"))} (ISTAT); l’obiettivo della BCE è il 2%. ${pr?"Profilo: <b>"+esc(pr.n)+"</b>.":"<button class=\"lnk\" data-iv=\"prof\">Fai il profilo</button> per ordinare le strategie."}</p></div>`;
  const mx=Math.max(1,...L.map(x=>x.o.gain));
  o+=`<div class="card k-inv"><h3>Risultato dopo ${anni} ${anni===1?"anno":"anni"} su ${eurI(cap)}</h3><div class="ibars">${L.map(x=>{const w=g=>Math.max(0,g)/mx*100;
    return `<div class="ib${x.ok&&x.hz?"":" no"}"><div class="ibh"><b>${x.s.ic} ${esc(x.s.n)}</b><span><b>${x.m.gain>=0?"+":""}${eurI(x.m.gain)}</b> netti</span></div>
      <div class="ibt"><i class="rng" style="left:${w(x.p.gain)}%;width:${Math.max(0.5,w(x.o.gain)-w(x.p.gain))}%"></i><i class="mid" style="width:${w(x.m.gain)}%"></i></div>
      <small>da ${eurI(x.p.gain)} a ${eurI(x.o.gain)} · alla fine ${eurI(x.m.net)}, cioè ${eurI(x.real)} di oggi${x.worst?` · in un anno cattivo fino a −${eurI(x.worst)}`:""} · rischio ${"●".repeat(x.s.risk)}${"○".repeat(5-x.s.risk)} · ${esc(x.s.liq)}${!x.ok?" · ⚠️ più rischiosa del tuo profilo":""}${!x.hz?" · ⚠️ orizzonte troppo breve":""}</small>
      <details class="idt"><summary>Pro e contro</summary><p>➕ ${esc(x.s.pro)}</p><p>➖ ${esc(x.s.con)}</p><p class="lbl">Ipotesi: rendimento lordo ${x.s.r?x.s.r.map(pct).join(" / "):"2% / 4,5% / 6,5% a regime"} (prudente / medio / ottimista)${x.s.ter?", costi "+ipct(x.s.ter)+" l’anno":""}; tasse ${x.s.tax}% ${x.s.id==="btp"?"sulle cedole":"sul guadagno"}${x.s.boll?", bollo "+ipct(x.s.boll):""}.</p></details></div>`;}).join("")}</div>
    <p class="lbl" style="margin:8px 0 0">Barra piena: risultato medio; parte chiara: da prudente a ottimista. Grigie in fondo: più rischiose del profilo o con un orizzonte troppo breve.</p></div>`;
  o+=`<div class="card k-inv"><h3>🧩 Strategie per combinare</h3>
    <div class="row"><div class="grow"><b>A scaglioni («scala» di scadenze)</b><small>dividere la somma in parti con scadenze diverse (1, 2, 3, 5 anni: conti vincolati o BTP): ogni anno una parte torna disponibile e si sceglie se reinvestirla.</small></div></div>
    <div class="row"><div class="grow"><b>Riserva + nucleo sicuro + parte di crescita</b><small>prima la riserva sul conto o deposito libero; poi i soldi che servono entro 5 anni in strumenti con scadenza; solo quello che resta per 10 anni e più in strumenti che oscillano.</small></div></div>
    <div class="row"><div class="grow"><b>Prima i debiti cari</b><small>estinguere una rata con un tasso più alto di quanto renderebbe investire la stessa somma è un guadagno sicuro: vedi «Debiti».</small></div></div>
    <div class="row"><div class="grow"><b>Non tutto in una banca</b><small>il Fondo Interbancario copre fino a 100.000 € per persona e per banca: sopra quella cifra conviene dividere fra banche diverse.</small></div></div></div>`;
  return o;}
function invDeb(){const D=debiti(),S=somme();
  if(!D.length)return `<div class="card k-inv"><p class="empty">Nella Cassa non ci sono rate con una data di fine. Aggiungile in Pensione → Cassa → Entrate e uscite (ogni mese, con «fino al»).</p></div>`;
  return `<div class="card k-inv"><h3>📑 Estinguere o no</h3><p class="lbl" style="margin-top:0">Scrivi il TAN (lo trovi nel contratto o nell’estratto annuale) e, se lo sai, il debito residuo di oggi; altrimenti l’app lo ricava dalla rata e dai mesi che mancano. Il confronto è con un conto deposito vincolato per lo stesso tempo.</p></div>`+D.map(d=>{const q=(INV().deb[d.x.id]||{}).q||"",c=debCalc(d,q||undefined);
    return `<div class="card k-inv"><h3>${esc(d.x.t)} <small class="lbl" style="font-weight:400">${eurI(d.x.imp)} al mese fino a ${fmt(d.x.a,{month:"short",year:"numeric"})} · ${d.n} rate</small></h3><div class="form">
      <label>TAN %<input data-id="${d.x.id}:tan" inputmode="decimal" value="${d.tan!=null?esc(String(d.tan).replace(".",",")):""}" placeholder="per esempio 7,9"></label>
      <label>Debito residuo oggi € (facoltativo)<input data-id="${d.x.id}:res" inputmode="decimal" value="${d.res!=null?esc(String(d.res).replace(".",",")):""}" placeholder="${c?esc(String(Math.round(annuityPV(+d.x.imp,d.tan/1200,d.n)))):"lo calcolo io"}"></label>
      <label>Tipo<select data-id="${d.x.id}:tipo"><option value="consumo"${d.tipo==="consumo"?" selected":""}>prestito o finanziamento</option><option value="mutuo"${d.tipo==="mutuo"?" selected":""}>mutuo per la casa</option></select></label>
      <label>Estinguere<select data-id="${d.x.id}:q"><option value="">oggi</option>${S.map(x=>`<option value="${x.d}"${q===x.d?" selected":""}>con ${esc(x.t)} (${fmt(x.d,{month:"short",year:"numeric"})})</option>`).join("")}</select></label></div>
      ${c?`<div class="kpi" style="margin-top:10px"><div><b>${eurI(c.costo)}</b><span>per chiudere${c.pen?" (con "+eurI(c.pen)+" di penale)":""}</span></div><div><b>${eurI(c.risp)}</b><span>interessi risparmiati${c.detr?", meno la detrazione del 19% (≈ "+eurI(c.detr)+")":""}</span></div><div><b>${eurI(c.alt)}</b><span>renderebbe la stessa somma in un deposito vincolato (netto)</span></div><div><b>${eurI(c.rata)}</b><span>al mese in più nella Cassa per ${c.nq} mesi</span></div></div>
        <p style="margin:10px 0 0">${(c.risp-c.detr)>c.alt?`✅ Con questi numeri estinguere fa risparmiare più di quanto renderebbe investire la stessa somma: <b>${eurI(c.risp-c.detr-c.alt)}</b> di differenza.`:`➖ Con questi numeri investire la somma renderebbe più degli interessi risparmiati (<b>${eurI(c.alt-(c.risp-c.detr))}</b> di differenza), ma solo se il tasso del deposito resta quello di oggi.`}</p>
        <p class="lbl" style="margin:6px 0 0">${d.tipo==="mutuo"?"Mutuo per la casa: nessuna penale per l’estinzione anticipata (art. 120-ter TUB); sugli interessi della prima casa c’è la detrazione del 19% fino a 4.000 € l’anno.":"Prestiti: la banca può chiedere un indennizzo fino all’1% del residuo (0,5% se manca meno di un anno) e deve togliere interessi e costi non ancora maturati (art. 125-sexies TUB)."} Da verificare con il conteggio di estinzione della banca.</p>
        <div class="btns"><button class="btn sm" data-idc="${d.x.id}">📆 Prova nella Cassa</button></div>`:`<p class="lbl" style="margin:8px 0 0">Scrivi il TAN per vedere il conto.</p>`}</div>`;}).join("");}
function invSim(){const v=INV().sim,anni=+(v.anni||10),cap=+(v.cap!=null&&v.cap!==""?v.cap:20000),mens=+(v.mens||0),sid=v.s||"bil",L=STRAT(anni),s=L.find(x=>x.id===sid)||L[5];
  const r=v.r!=null&&v.r!==""?+v.r:null,ss=r!=null?Object.assign({},s,{r:[r-1.5,r,r+1.5]}):s,x=stratCalc(ss,cap,anni,mens);
  const P3=[x.p,x.m,x.o],W=nar2()?360:700,H=210,Lm=46,R=10,TP=14,B=24,mxv=Math.max(...P3.flatMap(z=>z.pts.map(p=>p.v)),1),mnv=Math.min(0,...P3.flatMap(z=>z.pts.map(p=>p.v)));
  const X=m=>Lm+m/(anni*12)*(W-Lm-R),Y=val=>TP+(H-TP-B)*(1-(val-mnv)/(mxv-mnv||1)),line=z=>z.pts.map((p,i)=>(i?"L":"M")+X(p.m).toFixed(1)+" "+Y(p.v).toFixed(1)).join(" ");
  const band=x.o.pts.map((p,i)=>(i?"L":"M")+X(p.m).toFixed(1)+" "+Y(p.v).toFixed(1)).join(" ")+" "+x.p.pts.slice().reverse().map(p=>"L"+X(p.m).toFixed(1)+" "+Y(p.v).toFixed(1)).join(" ")+" Z";
  const vers=[0,anni*12].map(m=>({m,v:cap+mens*m})),st=[1e3,2e3,5e3,1e4,2e4,5e4,1e5,2e5,5e5].find(q=>(mxv-mnv)/q<=5)||1e6;let g="";
  for(let q=Math.ceil(mnv/st)*st;q<=mxv;q+=st)g+=`<line x1="${Lm}" x2="${W-R}" y1="${Y(q)}" y2="${Y(q)}" class="cg"/><text x="${Lm-6}" y="${Y(q)+4}" class="ct" text-anchor="end">${q>=1e3?(q/1e3).toLocaleString("it-IT")+" k":q}</text>`;
  for(let a=1;a<=anni;a++)if(anni<=10||a%2===0)g+=`<text x="${X(a*12)}" y="${H-6}" class="ct" text-anchor="middle">${a}</text>`;
  return `<div class="card k-inv"><h3>🧮 Simulatore</h3><div class="form">
    <label>Capitale iniziale €<input data-im="cap" inputmode="decimal" value="${esc(String(cap))}"></label><label>Versamento al mese €<input data-im="mens" inputmode="decimal" value="${esc(String(mens))}"></label>
    <label>Anni<select data-im="anni">${[1,2,3,5,7,10,15,20].map(k=>`<option value="${k}"${anni===k?" selected":""}>${k}</option>`).join("")}</select></label>
    <label>Strumento<select data-im="s">${L.map(z=>`<option value="${z.id}"${s.id===z.id?" selected":""}>${esc(z.n)}</option>`).join("")}</select></label>
    <label>Rendimento lordo medio % (facoltativo)<input data-im="r" inputmode="decimal" value="${r!=null?esc(String(r).replace(".",",")):""}" placeholder="${s.r?esc(String(s.r[1]).replace(".",",")):"4,5"}"></label></div></div>
    <div class="card k-inv"><h3>Dopo ${anni} ${anni===1?"anno":"anni"}</h3><div class="kpi"><div><b>${eurI(x.m.net)}</b><span>medio, netto di tasse e costi</span></div><div><b>${eurI(x.p.net)} – ${eurI(x.o.net)}</b><span>da prudente a ottimista</span></div><div><b>${eurI(x.m.vers)}</b><span>versati</span></div><div><b>${eurI(x.real)}</b><span>il medio in euro di oggi (inflazione ${ipct(x.infl)})</span></div></div>
    <div class="cs-leg"><span><i class="sw" style="background:var(--inv)"></i>medio</span><span><i class="sw" style="background:var(--inv-bg);height:9px"></i>da prudente a ottimista</span><span><i class="sw" style="background:var(--muted)"></i>versati</span></div>
    <svg class="cs-ch" viewBox="0 0 ${W} ${H}" role="img" aria-label="Crescita simulata">${g}<path d="${band}" fill="var(--inv-bg)" stroke="none"/><path d="${line({pts:vers})}" class="cl" style="stroke:var(--muted);stroke-dasharray:5 4;stroke-width:1.5"/><path d="${line(x.m)}" class="cl" style="stroke:var(--inv)"/></svg>
    <p class="lbl" style="margin:4px 0 0">Asse in basso: anni. ${s.peg?`In un anno cattivo questo strumento può perdere circa il ${Math.round(s.peg*100)}%: la linea non mostra le oscillazioni, solo la crescita media.`:"Strumento senza oscillazioni di prezzo se tenuto fino alla fine."}</p></div>`;}
const nar2=()=>window.innerWidth<640;
function invTas(){const L=mkList(),N=newsData();return `<div class="card k-inv"><h3>📊 Tassi e parametri</h3><p class="lbl" style="margin-top:0">Aggiornati da soli alle 13, alle 17 e alle 23 insieme alle Novità${N.updated?" (ultimo controllo "+new Date(N.updated).toLocaleString("it-IT",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})+")":""}. Puoi scrivere un tuo valore: vale il tuo finché non lo cancelli.</p>
  ${L.map(x=>`<div class="row"><div class="grow"><b>${esc(x.t)}</b><small>${fmt(x.d,{day:"numeric",month:"short",year:"numeric"})} · <a href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.fonte)}</a>${x.nota?" · "+esc(x.nota):""}${x.mio?" · pubblicato "+ipct(x.pub):""}</small></div><input data-it="${x.id}" class="pin" inputmode="decimal" style="flex:0 0 86px;text-align:right" value="${esc(String(x.valore).replace(".",","))}"><span>%</span></div>`).join("")}</div>`;}
function bindInv(){const R=()=>render(),v=INV(),num=x=>{const n=parseFloat(String(x).replace(/\./g,"").replace(",","."));return isFinite(n)?n:null;};
  document.querySelectorAll("[data-iv]").forEach(b=>b.onclick=()=>{invV=b.dataset.iv;try{sessionStorage.setItem("pn-invv",invV);}catch(e){}R();window.scrollTo(0,0);});
  document.querySelectorAll("[data-goinv]").forEach(b=>b.onclick=()=>{pensV="cassa";try{sessionStorage.setItem("pn-pensv","cassa");}catch(e){}go("pens");});
  document.querySelectorAll("[data-iq]").forEach(b=>b.onclick=()=>{const[i,j]=b.dataset.iq.split(":").map(Number);v.prof.r=v.prof.r||[];v.prof.r[i]=j;v.prof.at=today();save();R();});
  document.querySelectorAll("[data-ir]").forEach(i=>i.onchange=()=>{const k=i.dataset.ir;v.ris[k]=k==="mesi"?+i.value:(i.value.trim()===""?"":num(i.value));save();R();});
  document.querySelectorAll("[data-is]").forEach(i=>i.onchange=()=>{const k=i.dataset.is;if(k==="k"){v.som.k=i.value;if(i.value!=="mano")v.som.cap="";}else if(k==="cap"){v.som.cap=num(i.value);v.som.k=v.som.k||"mano";}else if(k==="inflF"){v.ipo.inflF=+i.value;}else v.som[k]=+i.value;save();R();});
  document.querySelectorAll("[data-id]").forEach(i=>i.onchange=()=>{const[id,k]=i.dataset.id.split(":");const o=v.deb[id]=v.deb[id]||{};o[k]=k==="tipo"||k==="q"?i.value:(i.value.trim()===""?"":num(i.value));save();R();});
  document.querySelectorAll("[data-im]").forEach(i=>i.onchange=()=>{const k=i.dataset.im;v.sim[k]=k==="s"?i.value:k==="anni"?+i.value:(i.value.trim()===""?"":num(i.value));save();R();});
  document.querySelectorAll("[data-it]").forEach(i=>i.onchange=()=>{const x=num(i.value),pub=(mkList().find(y=>y.id===i.dataset.it)||{}).pub;if(x==null||x===pub)delete v.ipo[i.dataset.it];else v.ipo[i.dataset.it]=x;save();R();toast("Salvato");});
  document.querySelectorAll("[data-idc]").forEach(b=>b.onclick=()=>{const d=debiti().find(z=>z.x.id===b.dataset.idc);if(!d)return;const q=(v.deb[d.x.id]||{}).q||today(),c=debCalc(d,q);if(!c)return;
    if(!confirm("Provare nella Cassa: la rata «"+d.x.t+"» finisce a "+fmt(q,{month:"long",year:"numeric"})+" e il "+fmt(q,{day:"numeric",month:"short",year:"numeric"})+" esce "+eurI(c.costo)+" per chiuderla. Puoi annullare togliendo l’uscita nella Cassa."))return;
    const p=PENS();d.x.aOrig=d.x.aOrig||d.x.a;d.x.a=add(q,-1)<d.x.da?d.x.da:add(q,-1);p.mov.push({id:uid(),tipo:"u",t:"Estinzione "+d.x.t,imp:Math.round(c.costo),freq:"una",da:q,a:"",cal:1,est:d.x.id});save();toast("Provato nella Cassa: guarda il grafico in Pensione → Cassa");R();});
}
