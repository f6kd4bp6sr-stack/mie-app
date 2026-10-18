/* ---------- 🎖️ PENSIONE: il passaggio dal servizio alla pensione ----------
   Adempimenti con scadenze (compaiono nel Calendario e nel file per il Calendario dell'iPad), leve ancora attivabili,
   cifre stimate con il confronto con gli importi reali, cronologia degli incassi, cassa mese per mese fino al TFS,
   documenti allegati (PDF). Tutto resta su questo dispositivo (pn-v1 → «pens»; file nel database, chiavi «pf-…»):
   il codice pubblico non contiene nessun dato. I dati si caricano da un file privato «scheda pensione» (.json).
   Solo fatti e numeri dei documenti: nessun consiglio.
   📰 Novità su contratto e pensione per il personale della Guardia di Finanza: file pubblico «news-pensione.json»
   (aggiornato alle 13, 17 e 23 da un'attività programmata, solo notizie generali con fonte e data, con l'elenco delle fonti controllate), collegato qui sull'iPad
   alle tue leve, cifre e adempimenti («Cosa cambia per te»), con i parametri ancora attesi che servono al ricalcolo. */
const PV=[["news","Novità"],["adem","Adempimenti"],["leve","Leve"],["cifre","Cifre"],["ced","Cedolino"],["cassa","Cassa"],["cont","Contatti e testi"],["doc","Documenti"]];
let pensV=(()=>{try{const v=sessionStorage.getItem("pn-pensv");return PV.some(x=>x[0]===v)?v:"adem";}catch(e){return "adem";}})(), pensEd=null;
const LV_ST={da:["Da fare","soon"],corso:["In corso","fam"],fatta:["Fatta","ok"],no:["Non serve",""]};
function PENS(){if(!P.pens||typeof P.pens!=="object")P.pens={};const p=P.pens;["adem","leve","cifre","incassi","files","cedolini","contatti","testi","tappe","newsSeen","ipotesi","docAttesi","uscite","mov"].forEach(k=>{if(!Array.isArray(p[k]))p[k]=[];});
  ["dati","cassa","calc","io","ricalc","esito"].forEach(k=>{if(!p[k]||typeof p[k]!=="object")p[k]={};});
  if(!p.cassa.v2){const C=p.cassa,d0=today().slice(0,7)+"-01";p.uscite.forEach(u=>p.mov.push({id:u.id||uid(),tipo:"u",t:u.t||"uscita",imp:+u.imp||0,freq:"una",da:u.ym+"-15",a:"",cal:1}));p.uscite=[];
    if(+C.spese)p.mov.push({id:uid(),tipo:"u",t:"Spese di casa",imp:+C.spese,freq:"m",da:d0,a:"",cal:0});if(+C.altre)p.mov.push({id:uid(),tipo:"e",t:"Altre entrate",imp:+C.altre,freq:"m",da:d0,a:"",cal:0});C.v2=1;}
  return p;}
const pensHas=()=>!!(P.pens&&((P.pens.adem||[]).length||(P.pens.leve||[]).length||(P.pens.cifre||[]).length));
const eur0=n=>n==null||n===""?"—":(Math.round(+n)).toLocaleString("it-IT")+" €";
const rng=(a,b)=>a!=null&&b!=null&&+a!==+b?eur0(a).replace(" €","")+" – "+eur0(b):eur0(a!=null?a:b);
/* scadenze aperte: per il Calendario, il riepilogo di oggi e il numero sulla scheda */
function pensOpen(){return PENS().adem.filter(a=>!a.fatto&&a.d).concat(PENS().leve.filter(l=>(l.stato==="da"||l.stato==="corso")&&l.d).map(l=>({id:"lv-"+l.id,d:l.d,t:"Leva "+l.n+": "+l.t,leva:1}))).sort((a,b)=>a.d<b.d?-1:1);}
function pensOn(s){return P.pens?pensOpen().filter(a=>a.d===s):[];}
const pensLate=()=>P.pens?pensOpen().filter(a=>a.d<today()).length:0;
/* ultimo giorno di presenza in ufficio secondo le Licenze */
function lastPresence(){const S=licS();if(!S)return null;for(let s=add(S.end,-1);s>=(S.start||today());s=add(s,-1)){const d=licDay(S,s);if(d.k==="LAV"&&d.c==="P")return s;}return null;}

function vPens(){
  const p=PENS(),t=today(),D=p.dati,cess=D.cess||(licS()||{}).end;
  let o=`<h1>🎖️ Pensione</h1>`;
  if(!pensHas())return o+`<p class="sub">Il passaggio dal servizio alla pensione: adempimenti, leve, cifre, incassi e cassa fino al TFS.</p>`+skCard()+pensImport(true);
  const op=pensOpen(),late=op.filter(a=>a.d<t),next=op.filter(a=>a.d>=t).slice(0,1)[0],lp=lastPresence();
  o+=`<p class="sub">${esc(p.src||"Dati della scheda pensione")}${p.rev?" · scheda rev. "+esc(String(p.rev))+(p.revAt?" del "+fmt(p.revAt.slice(0,10),{day:"numeric",month:"long"}):""):""}${p.at?" · caricati il "+fmt(p.at.slice(0,10),{day:"numeric",month:"long",year:"numeric"}):""}</p>
  <div class="kpi" style="margin-bottom:14px">${cess?`<div><b>${Math.max(0,diff(t,cess))}</b><span>giorni alla cessazione (${fmt(cess,{day:"numeric",month:"short",year:"numeric"})})</span></div>`:""}
    ${lp?`<div><b>${fmt(lp,{day:"numeric",month:"short"})}</b><span>ultimo giorno in ufficio (dalle Licenze)</span></div>`:""}
    <div><b style="${late.length?"color:var(--scad)":""}">${late.length||op.length}</b><span>${late.length?"scadenze passate da guardare":"adempimenti e leve aperti"}</span></div>
    ${next?`<div><b>${fmt(next.d,{day:"numeric",month:"short"})}</b><span>prossima: ${esc(next.t.slice(0,60))}</span></div>`:""}</div>`;
  o+=pensIcsNag()+pensTimeline2();
  if(D.rientro){const S=licS();if(S&&S.start&&S.start!==D.rientro)o+=`<div class="warnbox" style="margin:0 0 12px">In Licenze il rientro è il ${fmt(S.start,{day:"numeric",month:"long"})}, nella scheda il ${fmt(D.rientro,{day:"numeric",month:"long"})}: controlla quale è giusto in <a href="licenze.html">Licenze</a>.</div>`;}
  o+=`<div class="seg" role="tablist" style="margin:0 0 14px;width:max-content;max-width:100%">${PV.map(([k,n])=>`<button role="tab" data-pv="${k}" class="${pensV===k?"on":""}" aria-selected="${pensV===k}">${n}${k==="adem"&&late.length?`<span class="n">${late.length}</span>`:""}${k==="news"&&newsNew()?`<span class="n">${newsNew()}</span>`:""}</button>`).join("")}</div>`;
  return o+({news:pensNews,adem:pensAdem,leve:pensLeve,cifre:pensCifre,ced:pensCed,cassa:pensCassa,cont:pensCont,doc:pensDoc}[pensV]||pensAdem)();
}
/* ---- adempimenti ---- */
function pensAdem(){
  const p=PENS(),t=today(),L=p.adem.slice().sort((a,b)=>((a.d||"9")<(b.d||"9")?-1:(a.d||"9")>(b.d||"9")?1:0)),open=L.filter(a=>!a.fatto&&a.fase!=="dopo"),dopo=L.filter(a=>!a.fatto&&a.fase==="dopo"),done=L.filter(a=>a.fatto);
  const row=a=>{const st=a.fatto?"ok":!a.d?"":a.d<t?"warn":diff(t,a.d)<=14?"soon":"";
    return `<div class="row"><button class="chk${a.fatto?" done":""}" data-pa2="${a.id}" aria-label="${a.fatto?"Riapri":"Segna fatto"}">✓</button><div class="grow${a.fatto?" lbl":""}"><b>${esc(a.t)}</b>${a.det?`<small>${esc(a.det)}</small>`:""}${a.nota?`<small>📝 ${esc(a.nota)}</small>`:""}</div>
      <span class="pill ${st}">${a.d?fmt(a.d,{day:"numeric",month:"short",year:"2-digit"}):esc(a.quando||"senza data")}</span><button class="btn sm" data-pae="${a.id}" aria-label="Modifica">✏️</button></div>
      ${pensEd===a.id?`<div class="form addf"><label>Data<input type="date" data-paf="d" value="${esc(a.d||"")}"></label><label class="wide">Nota (protocollo, risposta, ufficio…)<input data-paf="nota" maxlength="200" value="${esc(a.nota||"")}"></label><div class="btns wide"><button class="btn sm" data-pae="">Chiudi</button><button class="btn sm danger" data-pax="${a.id}">Togli</button></div></div>`:""}`;};
  let o=pensEsito()+`<div class="card k-pens"><h3>🎖️ Fino alla cessazione</h3>${open.length?open.map(row).join(""):'<p class="empty">Tutto fatto. 👍</p>'}
    <div class="btns"><input id="paT" maxlength="140" placeholder="Aggiungi un adempimento" class="pin"><input id="paD" type="date" class="pin" style="flex:0 1 170px;min-width:150px"><button class="btn sm" data-pa3="add">Aggiungi</button></div></div>`;
  if(dopo.length)o+=`<h2>🧭 Dopo la cessazione</h2><div class="card k-pens">${dopo.map(row).join("")}</div>`;
  if(done.length)o+=`<details class="more"><summary>Fatti (${done.length})</summary><div class="card k-pens">${done.map(row).join("")}</div></details>`;
  return o+`<p class="lbl">Gli adempimenti con una data compaiono nel Calendario e nel file dei promemoria per il Calendario dell’iPad.</p>`;
}
/* ---- leve ---- */
function pensLeve(){
  const p=PENS(),L=p.leve.slice().sort((a,b)=>{const r=s=>s==="fatta"||s==="no"?1:0;return r(a.stato)-r(b.stato)||((a.d||"9")<(b.d||"9")?-1:1);});
  return `<div class="card k-pens">${L.map(l=>{const st=LV_ST[l.stato]||LV_ST.da;return `<div class="fx"><div class="row" style="border:0;padding:0"><span class="pill pens">${esc(String(l.n))}</span><div class="grow"><b>${esc(l.t)}</b><small>💶 ${esc(l.val||"—")} · ⏱️ ${esc(l.term||"—")}${l.d?" ("+fmt(l.d,{day:"numeric",month:"short",year:"numeric"})+")":""}</small>${l.nota?`<small>📝 ${esc(l.nota)}</small>`:""}</div>
      <select data-lvs="${l.id}" aria-label="Stato" class="pin" style="flex:0 0 auto;min-width:0">${Object.entries(LV_ST).map(([k,v])=>`<option value="${k}"${l.stato===k?" selected":""}>${v[0]}</option>`).join("")}</select><button class="btn sm" data-lve="${pensEd===l.id?"":l.id}" aria-label="Nota">📝</button></div>
      ${pensEd===l.id?`<div class="form" style="margin-top:6px"><label class="wide">Nota<input data-lvn="${l.id}" maxlength="240" value="${esc(l.nota||"")}" placeholder="a chi l’hai chiesto, risposta, numero di protocollo…"></label></div>`:""}</div>`;}).join("")||'<p class="empty">Nessuna leva.</p>'}</div>
    <p class="lbl">Valori e termini sono quelli della scheda: verificali con il patronato, l’Amministrazione o un legale prima di decidere.</p>`;
}
/* ---- cifre e incassi ---- */
function pensCifre(){
  const p=PENS(),t=today();
  let o=pensIpotesi()+pensRicalc()+`<div class="card k-pens"><h3>📊 Le cifre stimate e quelle reali</h3>${p.cifre.map(c=>{const r=c.reale!=null&&c.reale!==""?+c.reale:null,lo=c.min!=null?+c.min:c.val,hi=c.max!=null?+c.max:c.val;
    const fuori=r!=null&&lo!=null&&(r<lo*0.98||r>hi*1.02);
    return `<div class="row"><div class="grow"><b>${esc(c.t)}</b><small>stima: ${c.min!=null||c.max!=null?rng(c.min,c.max):eur0(c.val)}${c.centr!=null?" · valore centrale "+eur0(c.centr):""}${c.nota?" · "+esc(c.nota):""}</small>${r!=null?`<small style="color:var(${fuori?"--scad":"--ok"});font-weight:700">${fuori?"⚠️ fuori dalla forbice stimata":"✓ dentro la forbice"}: reale ${eur0(r)}</small>`:""}</div>
      <input data-cfr="${c.id}" inputmode="decimal" placeholder="reale €" value="${r!=null?esc(String(r).replace(".",",")):""}" class="pin" style="flex:0 0 110px;min-width:0" aria-label="Importo reale"></div>`;}).join("")||'<p class="empty">Nessuna cifra.</p>'}
    <p class="lbl">Quando arriva un importo vero (provvedimento INPS, prospetto del Fondo, liquidazione), scrivilo a destra: l’app lo confronta con la stima.</p></div>`;
  const I=p.incassi.slice().sort((a,b)=>(a.d||"9")<(b.d||"9")?-1:1);
  const tot=I.filter(x=>x.una).reduce((s,x)=>s+(+x.netto||0),0);
  o+=`<h2>🗓️ Gli incassi attesi</h2><div class="card k-pens">${I.map(x=>`<div class="row"><span class="pill ${x.ok?"ok":x.d&&x.d<t?"warn":"pens"}">${esc(x.quando||fmt(x.d,{month:"short",year:"numeric"}))}</span><div class="grow"><b>${esc(x.t)}</b><small>${[x.lordo?eur0(x.lordo)+" lordi":"",x.netto?"≈ "+eur0(x.netto)+" netti":"",x.nota?esc(x.nota):""].filter(Boolean).join(" · ")}</small></div>
      <button class="btn sm${x.ok?" ok":""}" data-inc="${x.id}">${x.ok?"✓ Arrivato":"Arrivato?"}</button></div>`).join("")||'<p class="empty">Nessun incasso.</p>'}
    ${tot?`<p class="lbl" style="margin:8px 0 0">Una tantum netti attesi in tutto: <b>≈ ${eur0(tot)}</b></p>`:""}</div>`;
  return o;
}
/* ---- cassa: da giugno 2027 al primo incasso del TFS ---- */
/* ---- 💶 Cassa: da oggi a giugno 2029, aggiornata passo passo ----
   Entrate automatiche: stipendi dal Cedolino (giorno 27), pensione dal Ricalcolo (giorno 1, tredicesima a dicembre in proporzione ai mesi),
   incassi della scheda nel loro mese (senza doppioni con il Cedolino). Movimenti miei in P.pens.mov (una volta o ricorrenti, anche nel Calendario).
   P.pens.cassa: ini {d,imp} punto di partenza, saldi {ym: saldo reale a fine mese}, spunte {chiave: {ok, imp}}, sposta {chiave: ym}, rit, pens. */
const CS_FINE="2029-06",CS_FREQ={una:["una volta",0],m:["ogni mese",1],"2m":["ogni 2 mesi",2],"3m":["ogni 3 mesi",3],"6m":["ogni 6 mesi",6],a:["ogni anno",12]};
let csEd=null,csIt=null,csIniEd=false,csQ="";
const ymAdd=(ym,n)=>{let[y,m]=ym.split("-").map(Number);m+=n;y+=Math.floor((m-1)/12);m=((m-1)%12+12)%12+1;return y+"-"+String(m).padStart(2,"0");};
const ymDays=ym=>{const[y,m]=ym.split("-").map(Number);return new Date(y,m,0).getDate();};
const dayIn=(ym,d)=>ym+"-"+String(Math.max(1,Math.min(+d||1,ymDays(ym)))).padStart(2,"0");
const ymLab=(ym,long)=>parse(ym+"-01").toLocaleDateString("it-IT",long?{month:"long",year:"numeric"}:{month:"short",year:"2-digit"});
const has=v=>v!=null&&v!=="";
function movDates(x,from,to){if(!x||!x.da)return[];const st=CS_FREQ[x.freq]?CS_FREQ[x.freq][1]:0,end=x.a&&x.a<to?x.a:to,out=[];
  if(!st)return x.da>=from&&x.da<=end?[x.da]:[];
  for(let ym=x.da.slice(0,7),i=0;i<600;i++,ym=ymAdd(ym,st)){const d=dayIn(ym,x.da.slice(8,10));if(d>end)break;if(d>=from)out.push(d);}return out;}
function cassaPen(){const p=PENS(),C=p.cassa,rcN=p.calc&&p.calc.base25?rcState().netto:null,penRc=rcN?Math.round(rcN/13):null;
  return{pen:+(has(C.pens)?C.pens:(penRc||p.dati.pensNetta||0)),penRc,man:has(C.pens)};}
function cassaCalc(){const p=PENS(),C=p.cassa,D=p.dati,t=today(),T=t.slice(0,7),ini=C.ini&&C.ini.d&&has(C.ini.imp)?C.ini:null,start=ini?ini.d.slice(0,7):T;
  const SP=C.spunte||{},MV=C.sposta||{},SA=C.saldi||{},{pen}=cassaPen(),rit=+(C.rit||0),dec=(D.decor||"2027-06-01").slice(0,7),items=[];
  const put=(k,d,tipo,t,exp,x)=>{if(MV[k])d=dayIn(MV[k],d.slice(8,10));const s=SP[k]||{};
    items.push(Object.assign({k,d,ym:d.slice(0,7),tipo,t,exp,imp:has(s.imp)?+s.imp:exp,real:has(s.imp),ok:!!s.ok,moved:!!MV[k]},x||{}));return items[items.length-1];};
  p.cedolini.forEach(c=>{if(!c.ym)return;const it=put("ced:"+c.id,c.ym+"-27","e",c.t,+c.netto||0,{src:"Cedolino",ced:c.id});if(has(c.ric)){it.imp=+c.ric;it.real=true;it.ok=true;}});
  for(let ym=dec,i=0;ym<=CS_FINE&&pen;ym=ymAdd(ym,1),i++){if(i<rit)continue;
    put("pen:"+ym,dayIn(ym,1),"e",i===rit&&rit?"Pensione + "+rit+" "+(rit===1?"mese":"mesi")+" arretrati":"Pensione",pen*(i===rit?rit+1:1),{src:"Ricalcolo"});
    if(ym.slice(5)==="12"){const mesi=Math.min(12,12-(+dec.slice(0,4)===+ym.slice(0,4)?+dec.slice(5)-1:0));put("pen13:"+ym,dayIn(ym,1),"e","Tredicesima della pensione"+(mesi<12?" ("+mesi+"/12)":""),Math.round(pen*mesi/12),{src:"Ricalcolo"});}}
  const kw=s=>String(s||"").split(/\s/)[0].toLowerCase();
  p.incassi.forEach(x=>{if(!x.d)return;if(!x.una&&(/pension|cedolino/i.test(x.t)||p.cedolini.some(c=>kw(c.t)===kw(x.t))))return;
    const it=put("inc:"+x.id,x.d,"e",x.t,+x.netto||0,{src:"Scheda",inc:x.id,nd:!x.netto});if(x.ok)it.ok=true;});
  p.mov.forEach(x=>movDates(x,start+"-01",CS_FINE+"-31").forEach(d=>put("mov:"+x.id+":"+d,d,x.tipo,x.t,+x.imp||0,{mov:x.id,freq:x.freq})));
  items.sort((a,b)=>a.d<b.d?-1:a.d>b.d?1:0);
  /* saldi veri: partenza, fine mese (saldi) e a una data qualsiasi (punti); da ognuno il conto riparte */
  const eom=ym=>ym+"-"+String(ymDays(ym)).padStart(2,"0"),cps=[];
  if(ini)cps.push({ev:"c",cp:"ini",d:ini.d,imp:+ini.imp});
  Object.keys(SA).forEach(ym=>{if(has(SA[ym])&&(!ini||eom(ym)>ini.d))cps.push({ev:"c",cp:"m",ym,d:eom(ym),imp:+SA[ym]});});
  (C.punti||[]).forEach(x=>{if(x.d&&has(x.imp)&&(!ini||x.d>ini.d))cps.push({ev:"c",cp:"p",id:x.id,d:x.d,imp:+x.imp});});
  const EV=items.filter(i=>!ini||i.d>ini.d).map(i=>Object.assign(i,{ev:"i"})).concat(cps).sort((a,b)=>a.d<b.d?-1:a.d>b.d?1:(a.cp==="ini"?-1:b.cp==="ini"?1:(a.ev==="c")-(b.ev==="c")));
  let bal=ini?+ini.imp:0;EV.forEach(x=>{if(x.ev==="i")bal+=x.tipo==="e"?x.imp:-x.imp;else{x.diff=x.cp==="ini"?null:x.imp-bal;bal=x.imp;}x.bal=bal;});
  const balAt=d=>{if(ini&&d<ini.d)return null;let r=ini?+ini.imp:0;for(const x of EV){if(x.d>d)break;r=x.bal;}return r;};
  const rows=[];let min=Infinity,minM="";
  for(let ym=start;ym<=CS_FINE;ym=ymAdd(ym,1)){const E=EV.filter(x=>x.d.slice(0,7)===ym),L=E.filter(x=>x.ev==="i"),open=ym===start?(ini?+ini.imp:0):balAt(eom(ymAdd(ym,-1)));
    const e=L.filter(i=>i.tipo==="e").reduce((a,i)=>a+i.imp,0),u=L.filter(i=>i.tipo==="u").reduce((a,i)=>a+i.imp,0),fin=balAt(eom(ym)),real=has(SA[ym])?+SA[ym]:null;
    rows.push({ym,E,L,open,e,u,fin,prev:fin,real,veri:E.filter(x=>x.ev==="c"&&x.cp!=="ini").length});if(ym>=T&&fin<min){min=fin;minM=ym;}}
  const oggi=balAt(t);
  return{ini,start,T,t,rows,items,min,minM,oggi,balAt,fine:rows.length?rows[rows.length-1]:null};}
/* riquadro della Cassa che si apre e si chiude: titolo a sinistra, totali a destra (stato ricordato fra un disegno e l'altro) */
function csBox(k,title,right,open,body){return `<details class="card k-pens csm csb" data-k="cb-${k}"${open?" open":""}><summary><span class="csm-h"><b class="csb-t">${title}</b></span><span class="csm-v">${right||""}</span></summary>${body}</details>`;}
function pensCassa(){const p=PENS(),C=p.cassa,D=p.dati,K=cassaCalc(),{pen,penRc,man}=cassaPen(),rit=+(C.rit||0),T=K.T;
  const c=v=>`<span class="amt ${v<0?"u":""}">${eur0(v)}</span>`;
  let o="";
  if(!K.ini||csIniEd)o+=`<div class="card k-pens"><h3>💶 Da dove parti</h3><p class="lbl" style="margin-top:0">Scrivi quanto hai sul conto (o sui conti, insieme) in una data: da lì l’app conta entrate e uscite fino a giugno 2029.</p>
    <div class="form"><label>Soldi disponibili €<input id="csIniI" inputmode="decimal" value="${K.ini?esc(String(K.ini.imp).replace(".",",")):""}" placeholder="0"></label><label>Al giorno<input id="csIniD" type="date" value="${esc(K.ini?K.ini.d:K.t)}"></label></div>
    ${(()=>{const F=finecoStorico();return F?`<p class="lbl">Nei Conti il conto ${esc(F.n)} risulta ${eur0(Math.round(F.oggi))} al ${fmt(F.last<K.t?F.last:K.t,{day:"numeric",month:"short",year:"numeric"})}. <button class="lnk" data-csx="fineco">Usa questo</button></p>`:"";})()}
    <div class="btns"><button class="btn sm pri" data-csx="ini">Parti da qui</button>${K.ini?`<button class="btn sm" data-csx="inino">Annulla</button>`:""}</div></div>`;
  else{const r0=K.rows.find(r=>r.ym===T),last=K.fine,neg=K.min<0;
    o+=csBox("oggi","💶 La tua cassa oggi",K.oggi!=null?`<span class="lbl">oggi</span><b>${c(Math.round(K.oggi))}</b>`:"",true,`<div class="kpi" style="margin-top:10px">
      ${K.oggi!=null?`<div><b>${c(Math.round(K.oggi))}</b><span>dovresti avere oggi</span></div>`:""}${r0?`<div><b>${c(Math.round(r0.fin))}</b><span>a fine ${ymLab(T,1)}${r0.real!=null?" (saldo vero)":""}</span></div>`:""}
      <div><b>${c(Math.round(K.min))}</b><span>punto più basso (${ymLab(K.minM)})</span></div>${last?`<div><b>${c(Math.round(last.fin))}</b><span>a fine ${ymLab(last.ym,1)}</span></div>`:""}</div>
      ${neg?`<p class="lbl" style="color:var(--scad);margin:8px 0 0">⚠️ In ${ymLab(K.minM,1)} il saldo previsto va sotto zero di ${eur0(-K.min)}.</p>`:""}
      <div class="btns cs-add"><span class="lbl">🔎 Saldo previsto al</span><input type="date" id="csQ" class="pin" value="${esc(csQ||"")}" min="${esc(K.ini.d)}" max="${CS_FINE}-30">${csQ?`<b>${(()=>{const v=K.balAt(csQ);return v==null?"—":c(Math.round(v));})()}</b>`:""}</div>
      <div class="btns"><button class="btn sm" data-csx="iniedit">Partenza: ${eur0(K.ini.imp)} al ${fmt(K.ini.d,{day:"numeric",month:"short",year:"numeric"})} · cambia</button></div>`);}
  if(K.ini)o+=cassaChart(K);
  /* movimenti miei */
  const M=p.mov.slice().sort((a,b)=>a.tipo===b.tipo?(a.da<b.da?-1:1):a.tipo==="e"?-1:1),ed=csEd&&csEd!=="new"?p.mov.find(x=>x.id===csEd):null,f=ed||{tipo:"u",freq:"m",da:K.t,cal:1};
  const mrow=x=>`<div class="row"><span class="pill ${x.tipo==="e"?"ok":""}">${x.tipo==="e"?"💰":"💶"}</span><div class="grow"><b>${esc(x.t)}</b><small>${esc((CS_FREQ[x.freq]||CS_FREQ.una)[0])} · ${x.freq==="una"?fmt(x.da,{day:"numeric",month:"short",year:"numeric"}):"dal "+fmt(x.da,{day:"numeric",month:"short",year:"numeric"})+(x.a?" al "+fmt(x.a,{day:"numeric",month:"short",year:"numeric"}):"")}${x.cal?" · 📆 nel Calendario":""}</small></div><b class="amt ${x.tipo==="u"?"u":""}">${x.tipo==="e"?"+":"−"}${eur0(x.imp)}</b><button class="btn sm" data-csm="${x.id}" aria-label="Modifica">✏️</button></div>`;
  const mT=(tp)=>M.filter(x=>x.tipo===tp).reduce((a,x)=>a+movDates(x,T+"-01",T+"-31").length*(+x.imp||0),0),mE=mT("e"),mU=mT("u"),ME=M.filter(x=>x.tipo==="e"),MU=M.filter(x=>x.tipo==="u");
  const sub=(lab,L,tot,cl)=>L.length?`<div class="cs-sub"><b>${lab}</b><span class="amt ${cl}">${cl?"−":"+"}${eur0(tot)} in ${ymLab(T)}</span></div>`+L.map(mrow).join(""):"";
  o+=csBox("mov","🔁 Entrate e uscite tue",M.length?`<span class="lbl">${M.length} · ${ymLab(T)}</span><span class="amt">+${eur0(mE)}</span><span class="amt u">−${eur0(mU)}</span>`:"",!M.length||!!csEd,`${M.length?sub("💰 Entrate",ME,mE,"")+sub("💶 Uscite",MU,mU,"u"):`<p class="empty">Aggiungi le spese di casa, le rate, le bollette, l’affitto che incassi, le entrate extra: una volta sola o ricorrenti.</p>`}
    ${csEd?`<div class="form" style="margin-top:10px"><label>Tipo<select id="mvTi"><option value="u"${f.tipo==="u"?" selected":""}>💶 Uscita</option><option value="e"${f.tipo==="e"?" selected":""}>💰 Entrata</option></select></label>
      <label>Che cos’è<input id="mvT" maxlength="60" value="${esc(f.t||"")}" placeholder="per esempio spese di casa, rata auto, bolletta"></label>
      <label>Importo €<input id="mvI" inputmode="decimal" value="${has(f.imp)?esc(String(f.imp).replace(".",",")):""}" placeholder="0"></label>
      <label>Quante volte<select id="mvF">${Object.entries(CS_FREQ).map(([k,v])=>`<option value="${k}"${f.freq===k?" selected":""}>${v[0]}</option>`).join("")}</select></label>
      <label>${f.freq==="una"?"Il giorno":"Dal giorno"}<input id="mvD" type="date" value="${esc(f.da||K.t)}"></label><label>Fino al (facoltativo)<input id="mvA" type="date" value="${esc(f.a||"")}"></label>
      <label class="chkl"><input type="checkbox" id="mvC"${f.cal?" checked":""}> Nel Calendario e nei promemoria dell’iPad</label></div>
      <div class="btns"><button class="btn sm pri" data-csm="save">${ed?"Salva":"Aggiungi"}</button><button class="btn sm" data-csm="close">Annulla</button>${ed?`<button class="btn sm" data-csm="del">Togli</button>`:""}</div>`
    :`<div class="btns"><button class="btn sm pri" data-csm="new">➕ Entrata o uscita</button></div>`}`);
  o+=csBox("pen","🎖️ Pensione nella cassa",`<span class="lbl">${rit?"ritardo "+rit+" "+(rit===1?"mese":"mesi"):"puntuale"}</span><b>${eur0(pen)}/mese</b>`,false,`<div class="form" style="margin-top:10px">
    <label>Pensione netta al mese €${man?"":penRc?" (dal Ricalcolo)":""}<input data-cs="pens" inputmode="decimal" value="${esc(String(pen).replace(".",","))}" placeholder="0"></label>
    <label>Ritardo della prima pensione<select data-cs="rit">${[0,1,2,3,4].map(k=>`<option value="${k}"${rit===k?" selected":""}>${k?k+" "+(k===1?"mese":"mesi"):"nessuno"}</option>`).join("")}</select></label></div>
    <p class="lbl" style="margin:8px 0 0">${man?"Pensione scritta a mano: cancellala per usare quella del Ricalcolo. ":penRc?"La pensione segue il Ricalcolo (scheda Cifre). ":""}La scheda indica: pensione netta ${esc(D.pensForb||"—")}, possibile liquidazione provvisoria con 2–3 mesi di ritardo. Con il ritardo, gli arretrati arrivano tutti insieme con la prima pensione.</p>`);
  if(!K.ini)return o+`<div class="card k-pens"><p class="empty">Scrivi da dove parti: qui compare la cassa mese per mese, da ${ymLab(T,1)} a giugno 2029.</p></div>`;
  /* mese per mese */
  const ite=x=>{const open=csIt===x.k,auto=x.src?x.src+(x.moved?" · spostato":""):(CS_FREQ[x.freq]||CS_FREQ.una)[0];
    return `<div class="row"><button class="chk${x.ok?" done":""}" data-csk="${esc(x.k)}" aria-label="${x.tipo==="e"?"Arrivata":"Pagata"}">✓</button><span class="pill">${fmt(x.d,{day:"numeric",month:"short"})}</span><div class="grow"><b>${esc(x.t)}</b><small>${esc(auto)}${x.nd&&!x.real?" · importo da definire":""}${x.real&&x.imp!==x.exp?" · previsti "+eur0(x.exp):""}</small></div><span class="cs-am"><b class="amt ${x.tipo==="u"?"u":""}">${x.tipo==="e"?"+":"−"}${eur0(x.imp)}</b><small class="${x.bal<0?"amt u":""}">saldo ${eur0(Math.round(x.bal))}</small></span><button class="btn sm" data-csi="${esc(x.k)}" aria-label="Correggi">✏️</button></div>
    ${open?`<div class="form" style="margin:0 0 10px 40px"><label>Importo vero €<input id="ciI" inputmode="decimal" value="${x.real?esc(String(x.imp).replace(".",",")):""}" placeholder="${esc(String(x.exp))}"></label>${x.mov?"":`<label>Mese<select id="ciM">${K.rows.map(r=>`<option value="${r.ym}"${r.ym===x.ym?" selected":""}>${ymLab(r.ym)}</option>`).join("")}</select></label>`}
      <div class="btns" style="grid-column:1/-1"><button class="btn sm pri" data-csi="save">Salva</button><button class="btn sm" data-csi="close">Chiudi</button>${x.real||x.moved?`<button class="btn sm" data-csi="reset">Torna al previsto</button>`:""}</div></div>`:""}`;};
  const cpr=x=>`<div class="row cs-cp"><span class="pill ok">🏦</span><span class="pill">${fmt(x.d,{day:"numeric",month:"short"})}</span><div class="grow"><b>${x.cp==="ini"?"Partenza":"Saldo vero"}</b><small>${x.diff==null?"da qui parte il conto":x.diff===0?"uguale al previsto":"scarto con il previsto "+(x.diff>0?"+":"−")+eur0(Math.abs(Math.round(x.diff)))+" · da qui riparte il conto"}</small></div><span class="cs-am"><b>${eur0(x.imp)}</b></span>${x.cp==="ini"?`<button class="btn sm" data-csx="iniedit" aria-label="Cambia">✏️</button>`:`<button class="btn sm" data-csp="${x.cp==="m"?"m:"+x.ym:"p:"+x.id}" aria-label="Togli">×</button>`}</div>`;
  const mese=r=>{const past=r.ym<=T,todo=r.L.filter(i=>!i.ok&&i.d<=K.t).length,dd=r.ym===T?K.t:r.ym+"-"+String(ymDays(r.ym)).padStart(2,"0"),mn=r.ym===K.start&&K.ini?K.ini.d:r.ym+"-01";
    return `<details class="csm csm2" data-k="cm-${r.ym}"${r.ym===T?" open":""}><summary><span class="csm-h"><b>${cap(ymLab(r.ym,1))}</b>${todo?`<span class="n">${todo}</span>`:""}</span><span class="csm-v"><span class="amt">+${eur0(r.e)}</span><span class="amt u">−${eur0(r.u)}</span><b>${r.veri?"🏦 ":""}${c(Math.round(r.fin))}</b></span></summary>
      ${r.ym===K.start?"":`<p class="lbl" style="margin:6px 0 0">Inizio mese: ${eur0(Math.round(r.open))}</p>`}
      ${r.E.map(x=>x.ev==="c"?cpr(x):ite(x)).join("")||'<p class="empty">Nessun movimento.</p>'}
      ${past?`<div class="btns cs-add"><span class="lbl">🏦 Saldo vero al</span><input type="date" id="cpD-${r.ym}" class="pin" value="${dd}" min="${mn}" max="${dd}"><input id="cpI-${r.ym}" class="pin" inputmode="decimal" placeholder="previsti ${esc(String(Math.round(K.balAt(dd)??0)))}"><button class="btn sm" data-csp="add:${r.ym}">Aggiungi</button></div>`:""}
      <p class="lbl" style="margin:6px 0 0">A fine mese: <b>${eur0(Math.round(r.fin))}</b>${r.veri?" (con i saldi veri)":" (previsto)"}</p></details>`;};
  const yrs=[...new Set(K.rows.map(r=>r.ym.slice(0,4)))];
  o+=`<h2>📅 Mese per mese</h2>`+yrs.map(y=>{const R=K.rows.filter(r=>r.ym.slice(0,4)===y),e=R.reduce((a,r)=>a+r.e,0),u=R.reduce((a,r)=>a+r.u,0),l=R[R.length-1],todo=R.reduce((a,r)=>a+r.L.filter(i=>!i.ok&&i.d<=K.t).length,0);
    return csBox("y"+y,`📅 ${y}${todo?` <span class="n">${todo}</span>`:""}`,`<span class="lbl">${R.length} ${R.length===1?"mese":"mesi"}</span><span class="amt">+${eur0(e)}</span><span class="amt u">−${eur0(u)}</span><b>${c(Math.round(l.fin))}</b>`,y===T.slice(0,4),R.map(mese).join(""));}).join("")
    +`<p class="lbl" style="margin:8px 2px 0">Stipendi dal Cedolino (il 27), pensione dal Ricalcolo (il 1°, tredicesima a dicembre in proporzione ai mesi), incassi della scheda nel loro mese; ✓ quando un movimento è arrivato o pagato, ✏️ per l’importo vero o un altro mese. Sono i tuoi numeri messi in fila, non consigli.</p>`;
  return o;
}
/* ---- 📈 andamento nel tempo: storico del conto Fineco (dai Conti, anche se la sezione è nascosta) + cassa prevista ---- */
function finecoStorico(){const c=P.conti;if(!c||!Array.isArray(c.acc)||!Array.isArray(c.mov))return null;
  const A=c.acc.filter(a=>!a.arch&&a.bank==="fineco"&&a.tipo==="conto");if(!A.length)return null;
  const ids=new Set(A.map(a=>a.id)),M=c.mov.filter(m=>ids.has(m.acc)&&m.d).sort((a,b)=>a.d<b.d?-1:1);if(!M.length)return null;
  const sg=m=>m.tipo==="e"?+m.imp||0:-(+m.imp||0);
  const at=d=>A.reduce((s,a)=>{let b=+a.s0||0;const d0=a.d0||"0000-00-00";M.forEach(m=>{if(m.acc!==a.id)return;if(m.d>d0&&m.d<=d)b+=sg(m);else if(m.d<=d0&&m.d>d)b-=sg(m);});return s+b;},0);
  const t=today(),lm=[M[M.length-1].d].concat(A.map(a=>a.d0||"")).sort().pop(),last=lm<t?lm:t,end=last,T=end.slice(0,7);let ym=M[0].d.slice(0,7);const lim=ymAdd(T,-36);if(ym<lim)ym=lim;
  const pts=[];for(;ym<=T;ym=ymAdd(ym,1)){const d=ym===T?end:ym+"-"+String(ymDays(ym)).padStart(2,"0");pts.push({ym,d,v:at(d)});}
  return{pts,n:A.map(a=>a.n).join(" + "),last,oggi:at(end)};}
function cassaChart(K){const F=finecoStorico(),P2=[{ym:K.ini.d.slice(0,7),d:K.ini.d,v:+K.ini.imp,ini:1}].concat(K.rows.map(r=>({ym:r.ym,d:r.ym+"-"+String(ymDays(r.ym)).padStart(2,"0"),v:r.fin})));
  const d0=F&&F.pts.length&&F.pts[0].d<P2[0].d?F.pts[0].d.slice(0,7)+"-01":P2[0].d,d1=P2[P2.length-1].d,day=d=>Date.parse(d+"T12:00:00Z")/864e5,D0=day(d0),D1=day(d1);
  const nar=window.innerWidth<640,W=nar?380:720,H=nar?250:230,L=nar?40:52,R=nar?8:14,TP=22,B=26,x=d=>L+(day(d)-D0)/(D1-D0||1)*(W-L-R);
  const cps=K.rows.flatMap(r=>r.E.filter(e=>e.ev==="c"&&e.cp!=="ini")),big=K.items.filter(i=>i.src==="Scheda"&&i.imp>=5000&&(!K.ini||i.d>K.ini.d));
  const vals=P2.map(p=>p.v).concat(F?F.pts.map(p=>p.v):[]).concat(cps.map(c=>c.imp));let mn=Math.min(0,...vals),mx=Math.max(1,...vals);
  const st=[1e3,2e3,5e3,1e4,2e4,5e4,1e5,2e5].find(s=>(mx-mn)/s<=5)||5e5;mn=Math.floor(mn/st)*st;mx=Math.ceil(mx/st)*st;const y=v=>TP+(H-TP-B)*(1-(v-mn)/(mx-mn||1));
  const k=v=>Math.abs(v)>=1e3?(Math.round(v/100)/10).toLocaleString("it-IT")+" k":String(Math.round(v));
  let g="";for(let v=mn;v<=mx+1;v+=st)g+=`<line x1="${L}" x2="${W-R}" y1="${y(v)}" y2="${y(v)}" class="cg${v===0?" z":""}"/><text x="${L-6}" y="${y(v)+4}" class="ct" text-anchor="end">${k(v)}</text>`;
  for(let yr=+d0.slice(0,4)+1;yr<=+d1.slice(0,4);yr++){const xx=x(yr+"-01-01");g+=`<line x1="${xx}" x2="${xx}" y1="${TP}" y2="${H-B}" class="cg"/><text x="${xx}" y="${H-8}" class="ct" text-anchor="middle">${yr}</text>`;}
  const t=K.t,dec=((PENS().dati||{}).decor||"2027-06-01");
  if(dec>d0&&dec<d1)g+=`<line x1="${x(dec)}" x2="${x(dec)}" y1="${TP}" y2="${H-B}" class="cv"/><text x="${x(dec)+4}" y="${TP+10}" class="ct">🎖️ pensione</text>`;
  if(t>=d0&&t<=d1)g+=`<line x1="${x(t)}" x2="${x(t)}" y1="${TP}" y2="${H-B}" class="co"/><text x="${x(t)+4}" y="${H-B-6}" class="ct oc">oggi</text>`;
  const path=a=>a.map((p,i)=>(i?"L":"M")+x(p.d).toFixed(1)+" "+y(p.v).toFixed(1)).join(" ");
  if(F)g+=`<path d="${path(F.pts)}" class="cl s"/>`;
  g+=`<path d="${path(P2)}" class="cl p"/>`;
  big.forEach(i=>{const p=P2.find(q=>q.ym===i.ym);if(p)g+=`<circle cx="${x(p.d)}" cy="${y(p.v)}" r="4.5" class="cm p"/><text x="${x(p.d)}" y="${y(p.v)-10}" class="ct" text-anchor="middle">${esc(/TFS/.test(i.t)?"TFS":/F\.A\.F/.test(i.t)?"F.A.F.":/premio/i.test(i.t)?"premio":i.t.split(" ")[0])}</text>`;});
  cps.forEach(c=>g+=`<circle cx="${x(c.d)}" cy="${y(c.imp)}" r="5" class="cm v"/>`);
  g+=`<g id="csX" style="display:none"><line y1="${TP}" y2="${H-B}" class="cx"/><circle r="5" class="cm p"/><circle r="5" class="cm s"/></g><rect x="${L}" y="${TP}" width="${W-L-R}" height="${H-TP-B}" fill="transparent" id="csHit"/>`;
  window.__csCh={x0:L,x1:W-R,W,D0,D1,P2,F:F?F.pts:[],y,x,day};
  const leg=`<div class="cs-leg"><span><i class="sw p"></i>Cassa prevista</span>${F?`<span><i class="sw s"></i>${esc(F.n)} (storico dai Conti)</span>`:""}${cps.length?`<span><i class="sw v"></i>saldo vero</span>`:""}</div>`;
  const note=F?(F.last<add(t,-10)?`<p class="lbl" style="margin:6px 0 0">Storico Fineco fino al ${fmt(F.last,{day:"numeric",month:"short",year:"numeric"})}, ultimo movimento importato: per allungarlo importa l’estratto nei Conti.</p>`:"")
    :`<p class="lbl" style="margin:6px 0 0">Per vedere anche lo storico, la linea del conto Fineco usa i movimenti importati nei Conti (sezione nascosta): finora non ce ne sono su questo iPad.</p>`;
  return csBox("graf","📈 Andamento nel tempo",F?`<span class="lbl">Fineco ${F.last<t?"al "+fmt(F.last,{day:"numeric",month:"short"}):"oggi"}</span><b>${eur0(Math.round(F.oggi))}</b>`:`<span class="lbl">fino a giugno 2029</span>`,true,
    leg+`<svg class="cs-ch" viewBox="0 0 ${W} ${H}" role="img" aria-label="Andamento del saldo: storico e previsione">${g}</svg><p class="cs-tip" id="csTip">Tocca il grafico per leggere il saldo di un giorno.</p>`+note);}
function bindChart(){const S=$("csHit"),C=window.__csCh;if(!S||!C)return;const svg=S.ownerSVGElement,X=$("csX"),tip=$("csTip");
  const near=(L,dd)=>{let b=null;for(const p of L){if(!b||Math.abs(C.day(p.d)-dd)<Math.abs(C.day(b.d)-dd))b=p;}return b;};
  const show=ev=>{const r=svg.getBoundingClientRect(),px=(ev.clientX-r.left)*C.W/r.width;if(px<C.x0||px>C.x1)return;const dd=C.D0+(px-C.x0)/(C.x1-C.x0)*(C.D1-C.D0);
    const p=near(C.P2,dd),f=C.F.length?near(C.F,dd):null,pp=p&&Math.abs(C.day(p.d)-dd)<=20?p:null,ff=f&&Math.abs(C.day(f.d)-dd)<=20?f:null;if(!pp&&!ff)return;const ref=pp||ff;
    X.style.display="";const ln=X.querySelector("line"),cs=X.querySelectorAll("circle");ln.setAttribute("x1",C.x(ref.d));ln.setAttribute("x2",C.x(ref.d));
    [[cs[0],pp],[cs[1],ff]].forEach(([c,q])=>{if(q){c.style.display="";c.setAttribute("cx",C.x(q.d));c.setAttribute("cy",C.y(q.v));}else c.style.display="none";});
    tip.innerHTML=`<b>${fmt(ref.d,{day:"numeric",month:"long",year:"numeric"})}</b>${pp?` · prevista <b>${eur0(Math.round(pp.v))}</b>`:""}${ff?` · Fineco <b>${eur0(Math.round(ff.v))}</b>`:""}`;};
  S.onpointerdown=show;S.onpointermove=show;}
/* giorni del Calendario e promemoria dell'iPad per i movimenti segnati «nel Calendario» */
function cassaOn(s){return P.pens?(PENS().mov||[]).filter(x=>x.cal&&movDates(x,s,s).length).map(x=>({ic:x.tipo==="e"?"💰":"💶",t:x.t,amt:(x.tipo==="e"?"+":"−")+eur0(x.imp),c:"pens",k:"pens",id:"mov-"+x.id,sub:(x.tipo==="e"?"+":"−")+eur0(x.imp)+" · "+(CS_FREQ[x.freq]||CS_FREQ.una)[0]})):[];}
function cassaIcs(t){if(!P.pens)return[];const out=[],h=add(t,400);(PENS().mov||[]).filter(x=>x.cal).forEach(x=>movDates(x,t,h).forEach(d=>out.push({uid:"pens-mov-"+x.id+"-"+d,lines:["DTSTART;VALUE=DATE:"+dval(d),"DTEND;VALUE=DATE:"+dval(add(d,1)),"SUMMARY:"+icsEsc((x.tipo==="e"?"💰 ":"💶 ")+x.t+" "+(x.tipo==="e"?"+":"−")+eur0(x.imp)),"TRANSP:TRANSPARENT",...alarm(1)]})));return out;}
/* riquadro di oggi: saldo da scrivere a inizio mese, movimenti da spuntare */
function cassaNag(){const p=P.pens;if(!p||!p.cassa||!p.cassa.ini)return null;const K=cassaCalc(),prev=ymAdd(K.T,-1),day=+K.t.slice(8,10);
  const askSaldo=day<=10&&prev>=K.start&&!has((p.cassa.saldi||{})[prev])&&!(p.cassa.punti||[]).some(x=>x.d>=prev+"-24"&&x.d<=K.t),r=K.rows.find(x=>x.ym===K.T),todo=r?r.L.filter(i=>!i.ok&&i.d<=K.t):[],next=K.items.filter(i=>i.d>K.t&&i.d<=add(K.t,7));
  return{askSaldo,prev,todo,next,oggi:K.oggi};}
function bindCassa(p,num){const R=()=>render(),C=p.cassa;bindChart();C.spunte=C.spunte||{};C.sposta=C.sposta||{};C.saldi=C.saldi||{};
  document.querySelectorAll("[data-csx]").forEach(b=>b.onclick=()=>{const a=b.dataset.csx;
    if(a==="ini"){const v=num($("csIniI").value),d=$("csIniD").value||today();if(v==null)return toast("Scrivi i soldi disponibili");C.ini={d,imp:v};csIniEd=false;save();R();toast("Cassa: si parte da "+eur0(v));}
    else if(a==="fineco"){const F=finecoStorico();if(F){$("csIniI").value=String(Math.round(F.oggi*100)/100).replace(".",",");$("csIniD").value=F.last<today()?F.last:today();}}
    else if(a==="iniedit"){csIniEd=true;R();}else if(a==="inino"){csIniEd=false;R();}});
  document.querySelectorAll("[data-csm]").forEach(b=>b.onclick=()=>{const a=b.dataset.csm;
    if(a==="new"){csEd="new";R();const i=$("mvT");if(i)i.focus();return;}if(a==="close"){csEd=null;R();return;}
    if(a==="del"){if(!confirm("Togliere questo movimento?"))return;p.mov=p.mov.filter(x=>x.id!==csEd);csEd=null;save();R();return;}
    if(a==="save"){const t=$("mvT").value.trim(),v=num($("mvI").value),d=$("mvD").value,fr=$("mvF").value,to=$("mvA").value;
      if(!t||v==null||!d)return toast("Scrivi che cos’è, l’importo e il giorno");if(to&&to<d)return toast("La fine viene prima dell’inizio");
      const x={tipo:$("mvTi").value,t,imp:Math.abs(v),freq:fr,da:d,a:fr==="una"?"":to,cal:$("mvC").checked?1:0};
      if(csEd==="new")p.mov.push(Object.assign({id:uid()},x));else Object.assign(p.mov.find(y=>y.id===csEd)||{},x);csEd=null;save();R();toast("Salvato");return;}
    csEd=a;R();});
  const find=k=>cassaCalc().items.find(i=>i.k===k);
  document.querySelectorAll("[data-csk]").forEach(b=>b.onclick=()=>{const x=find(b.dataset.csk);if(!x)return;const on=!x.ok;
    if(x.inc){const y=p.incassi.find(z=>z.id===x.inc);if(y)y.ok=on?today():"";}
    else if(x.ced&&!on){const y=p.cedolini.find(z=>z.id===x.ced);if(y)y.ric="";}
    const s=C.spunte[x.k]||{};if(on)s.ok=today();else delete s.ok;if(Object.keys(s).length)C.spunte[x.k]=s;else delete C.spunte[x.k];
    save();R();toast(on?(x.tipo==="e"?"Arrivata ✓":"Pagata ✓"):"Riaperta");});
  document.querySelectorAll("[data-csi]").forEach(b=>b.onclick=()=>{const a=b.dataset.csi;
    if(a==="close"){csIt=null;R();return;}const x=find(csIt);
    if(a==="save"&&x){const v=num($("ciI").value),m=$("ciM")?$("ciM").value:x.ym;
      if(x.ced){const y=p.cedolini.find(z=>z.id===x.ced);if(y)y.ric=v==null?"":v;}else{const s=C.spunte[x.k]||{};if(v==null)delete s.imp;else{s.imp=v;s.ok=s.ok||today();}C.spunte[x.k]=s;}
      if(x.inc&&v!=null){const y=p.incassi.find(z=>z.id===x.inc);if(y&&!y.ok)y.ok=today();}
      const orig=x.d.slice(0,7);if(!x.mov){if(m&&m!==(x.moved?null:orig))C.sposta[x.k]=m;if(m===orig&&!x.moved)delete C.sposta[x.k];}
      csIt=null;save();R();toast("Salvato");return;}
    if(a==="reset"&&x){if(x.ced){const y=p.cedolini.find(z=>z.id===x.ced);if(y)y.ric="";}const s=C.spunte[x.k];if(s)delete s.imp;delete C.sposta[x.k];csIt=null;save();R();return;}
    csIt=a;R();});
  const q=$("csQ");if(q)q.onchange=()=>{csQ=q.value;R();};
  document.querySelectorAll("[data-csp]").forEach(b=>b.onclick=()=>{const a=b.dataset.csp;C.punti=C.punti||[];
    if(a.startsWith("add:")){const ym=a.slice(4),d=$("cpD-"+ym).value,v=num($("cpI-"+ym).value);if(!d||v==null)return toast("Scrivi la data e il saldo vero");
      const eom=ym+"-"+String(ymDays(ym)).padStart(2,"0");if(d===eom)C.saldi[ym]=v;else{C.punti=C.punti.filter(x=>x.d!==d);C.punti.push({id:uid(),d,imp:v});}
      save();R();toast("🏦 Saldo vero del "+fmt(d,{day:"numeric",month:"short"})+": da qui riparte il conto");return;}
    if(!confirm("Togliere questo saldo vero?"))return;if(a.startsWith("m:"))delete C.saldi[a.slice(2)];else C.punti=C.punti.filter(x=>x.id!==a.slice(2));save();R();});
  document.querySelectorAll("[data-csr]").forEach(i=>i.onchange=()=>{const v=num(i.value);if(v==null)delete C.saldi[i.dataset.csr];else C.saldi[i.dataset.csr]=v;save();R();toast(v==null?"Saldo tolto":"Saldo vero salvato: i mesi dopo ripartono da qui");});
}
/* ---- documenti e scheda ---- */
function pensDoc(){const p=PENS(),files=p.files||[];
  return pensDocAttesi()+`<div class="card k-pens"><h3>📎 Documenti</h3>${files.map(f=>`<div class="row"><span class="pill">${/pdf/.test(f.type)?"PDF":/image/.test(f.type)?"🖼️":"📄"}</span><div class="grow"><b>${esc(f.n)}</b><small>${Math.max(1,Math.round(f.size/1024))} KB · ${fmt(f.at.slice(0,10),{day:"numeric",month:"short",year:"numeric"})}</small></div><button class="btn sm" data-pfo2="${f.id}">Apri</button><button class="btn sm" data-pfx2="${f.id}" aria-label="Togli">×</button></div>`).join("")||'<p class="empty">Nessun documento: allega l’analisi previdenziale e i provvedimenti quando arrivano.</p>'}
    <div class="btns"><label class="btn sm pri" style="cursor:pointer">➕ Aggiungi PDF o foto<input type="file" id="pfIn2" accept="application/pdf,image/*" hidden></label></div>
    <p class="lbl" style="margin:8px 0 0">I documenti restano su questo iPad (massimo 15 MB l’uno) ed entrano nelle copie.</p></div>`+skCard()+pensImport(false);}
function pensImport(first){return `<div class="card k-pens"><h3>📥 ${first?"Carica la scheda pensione":"Aggiorna la scheda"}</h3><p class="lbl" style="margin-top:0">${first?"Scegli il file «scheda pensione» (.json): contiene adempimenti, leve, cifre e incassi presi dall’analisi previdenziale. Resta solo su questo iPad.":"Un file nuovo sostituisce adempimenti, leve, cifre e incassi; le tue spunte, gli stati, le note, gli importi reali e i documenti restano."}</p>
  <div class="btns"><label class="btn sm${first?" pri":""}" style="cursor:pointer">📥 Scegli il file<input type="file" id="pnsIn" accept="application/json,.json" hidden></label></div></div>`;}
/* unione: i dati nuovi della scheda + quello che hai già segnato sull'iPad */
function pensMerge(nw){const old=PENS(),by=(L,id)=>(L||[]).find(x=>x.id===id);
  (nw.adem||[]).forEach(a=>{const o=by(old.adem,a.id);if(o){if(o.fatto)a.fatto=o.fatto;if(o.nota)a.nota=o.nota;if(o.d0!=null&&o.d!==o.d0)a.d=o.d;}});
  (nw.leve||[]).forEach(l=>{const o=by(old.leve,l.id);if(o){if(o.stato&&o.stato!=="da")l.stato=o.stato;if(o.nota)l.nota=o.nota;}});
  (nw.cifre||[]).forEach(c=>{const o=by(old.cifre,c.id);if(o&&o.reale!=null&&o.reale!=="")c.reale=o.reale;});
  (nw.incassi||[]).forEach(x=>{const o=by(old.incassi,x.id);if(o&&o.ok)x.ok=o.ok;});
  old.adem.filter(a=>a.mio&&!by(nw.adem,a.id)).forEach(a=>nw.adem.push(a));
  (nw.cedolini||[]).forEach(x=>{const o=by(old.cedolini,x.id);if(o&&o.ric!=null&&o.ric!=="")x.ric=o.ric;});
  (nw.ipotesi||[]).forEach(x=>{const o=by(old.ipotesi,x.id);if(o&&o.st)x.st=o.st;});
  (nw.docAttesi||[]).forEach(x=>{const o=by(old.docAttesi,x.id);if(o){if(o.ok)x.ok=o.ok;if(o.file)x.file=o.file;}});
  nw.esito=Object.assign({},nw.esito||{},old.esito||{});nw.uscite=old.uscite&&old.uscite.length?old.uscite:(nw.uscite||[]);nw.mov=old.mov&&old.mov.length?old.mov:(nw.mov||[]);
  nw.files=old.files||[];nw.cassa=Object.assign({},nw.cassa||{},old.cassa||{});nw.io=Object.assign({},nw.io||{},old.io||{});nw.ricalc=Object.assign({},old.ricalc||{});nw.newsSeen=old.newsSeen||[];
  nw.at=new Date().toISOString();P.pens=nw;}

function bindPens(){
  const R=()=>render(),p=PENS(),num=v=>{const n=parseFloat(String(v).replace(/\./g,"").replace(",","."));return isFinite(n)?n:null;};
  document.querySelectorAll("[data-pv]").forEach(b=>b.onclick=()=>{pensV=b.dataset.pv;try{sessionStorage.setItem("pn-pensv",pensV);}catch(e){}R();});
  document.querySelectorAll("[data-pa2]").forEach(b=>b.onclick=()=>{const a=p.adem.find(x=>x.id===b.dataset.pa2);if(!a)return;a.fatto=a.fatto?"":today();save();R();toast(a.fatto?"Fatto ✓":"Riaperto");});
  document.querySelectorAll("[data-pae]").forEach(b=>b.onclick=()=>{pensEd=b.dataset.pae||null;R();});
  document.querySelectorAll("[data-paf]").forEach(inp=>inp.onchange=()=>{const a=p.adem.find(x=>x.id===pensEd);if(!a)return;a[inp.dataset.paf]=inp.value.trim();save();toast("Salvato");if(inp.dataset.paf==="d")R();});
  document.querySelectorAll("[data-pax]").forEach(b=>b.onclick=()=>{if(!confirm("Togliere questo adempimento?"))return;p.adem=p.adem.filter(x=>x.id!==b.dataset.pax);pensEd=null;save();R();});
  document.querySelectorAll("[data-pa3]").forEach(b=>b.onclick=()=>{const t=$("paT").value.trim();if(!t)return toast("Scrivi l’adempimento");p.adem.push({id:"m"+uid(),t,d:$("paD").value||"",mio:1});save();R();toast("Aggiunto");});
  document.querySelectorAll("[data-lvs]").forEach(s=>s.onchange=()=>{const l=p.leve.find(x=>x.id===s.dataset.lvs);if(l){l.stato=s.value;save();R();toast("Leva: "+LV_ST[s.value][0]);}});
  document.querySelectorAll("[data-lve]").forEach(b=>b.onclick=()=>{pensEd=b.dataset.lve||null;R();const i=document.querySelector("[data-lvn]");if(i)i.focus();});
  document.querySelectorAll("[data-lvn]").forEach(i=>i.onchange=()=>{const l=p.leve.find(x=>x.id===i.dataset.lvn);if(l){l.nota=i.value.trim();save();toast("Nota salvata");}});
  document.querySelectorAll("[data-cfr]").forEach(i=>i.onchange=()=>{const c=p.cifre.find(x=>x.id===i.dataset.cfr);if(c){const v=num(i.value);c.reale=v==null?"":v;save();R();toast("Salvato");}});
  document.querySelectorAll("[data-inc]").forEach(b=>b.onclick=()=>{const x=p.incassi.find(y=>y.id===b.dataset.inc);if(x){x.ok=x.ok?"":today();save();R();}});
  document.querySelectorAll("[data-cs]").forEach(i=>i.onchange=()=>{const k=i.dataset.cs;p.cassa[k]=k==="premioMese"?i.value:k==="rit"?+i.value:(k==="pens"&&!i.value.trim()?"":num(i.value));save();R();});
  bindPens2(p,num);bindPens3(p,num);bindSk();
  const pin=$("pnsIn");if(pin)pin.onchange=async()=>{const f=pin.files&&pin.files[0];pin.value="";if(!f)return;
    try{const o=JSON.parse(await f.text());if(o.app!=="pianificazione-pensione"||!o.pens)throw 0;
      if(pensHas()&&!confirm("Aggiornare la scheda con il file «"+f.name+"»? Le tue spunte, note e importi reali restano."))return;
      pensMerge(o.pens);P.pens.rev=+o.v||0;save();pensV="adem";R();toast("🎖️ Scheda pensione caricata");}catch(e){toast("Questo file non è una scheda pensione");}};
  const fin=$("pfIn2");if(fin)fin.onchange=async()=>{const f=fin.files&&fin.files[0];fin.value="";if(!f)return;if(f.size>15*1024*1024)return toast("File troppo grande (massimo 15 MB)");
    const id=uid();try{await kv("readwrite","pf-"+id,f);}catch(e){return toast("Non riesco a salvare il file su questo iPad");}
    p.files.push({id,n:f.name||"documento",type:f.type||"",size:f.size,at:new Date().toISOString()});save();R();toast("Documento allegato");if(window.__pfRefresh)window.__pfRefresh();};
  document.querySelectorAll("[data-pfo2]").forEach(b=>b.onclick=async()=>{try{const meta=p.files.find(f=>f.id===b.dataset.pfo2),blob=await kv("readonly","pf-"+b.dataset.pfo2);if(!blob)return toast("File non trovato su questo iPad");pratView(blob,meta||{n:"documento",type:blob.type});}catch(e){toast("Non riesco ad aprire il file");}});
  document.querySelectorAll("[data-pfx2]").forEach(b=>b.onclick=()=>{if(!confirm("Togliere questo documento?"))return;kv("readwrite","pf-"+b.dataset.pfx2,undefined).catch(()=>{});p.files=p.files.filter(f=>f.id!==b.dataset.pfx2);save();R();if(window.__pfRefresh)window.__pfRefresh();});
}
/* riquadro nel riepilogo di oggi */
function pensCard(){if(!pensHas())return "";const t=today(),op=pensOpen(),late=op.filter(a=>a.d<t),nx=op.filter(a=>a.d>=t).slice(0,3),cess=(P.pens.dati||{}).cess,nn=newsNew();
  return `<div class="card k-pens"><h3>🎖️ Pensione <button class="lnk" data-go="pens">Apri ›</button></h3>${cess?`<div class="row"><div class="grow">Giorni alla cessazione</div><b>${Math.max(0,diff(t,cess))}</b></div>`:""}
    ${nn?`<div class="row"><div class="grow"><b>📰 ${nn} ${nn===1?"novità che ti riguarda":"novità che ti riguardano"}</b><small>${esc((newsList().find(n=>!PENS().newsSeen.includes(n.id)&&newsTouch(n).length)||{}).titolo||"")}</small></div><button class="btn sm" data-gonews="1">Leggi</button></div>`:""}
    ${pensCassaCard()}
    ${late.length?`<div class="row"><div class="grow" style="color:var(--scad)"><b>${late.length} ${late.length===1?"scadenza passata":"scadenze passate"}</b><small>${esc(late[0].t.slice(0,70))}</small></div></div>`:""}
    ${nx.map(a=>`<div class="row"><span class="pill ${diff(t,a.d)<=14?"soon":"pens"}">${fmt(a.d,{day:"numeric",month:"short"})}</span><div class="grow">${esc(a.t.slice(0,80))}</div></div>`).join("")}</div>`;}
function pensCassaCard(){let N;try{N=cassaNag();}catch(e){N=null;}if(!N)return "";const o=[];
  if(N.askSaldo)o.push(`<div class="row"><div class="grow"><b>💶 Scrivi il saldo vero di fine ${ymLab(N.prev,1)}</b><small>così la cassa riparte dai numeri veri</small></div><button class="btn sm" data-gocassa="1">Scrivi</button></div>`);
  if(N.todo.length)o.push(`<div class="row"><div class="grow"><b>💶 ${N.todo.length} ${N.todo.length===1?"movimento da spuntare":"movimenti da spuntare"}</b><small>${esc(N.todo.slice(0,3).map(i=>i.t).join(" · "))}</small></div><button class="btn sm" data-gocassa="1">Cassa</button></div>`);
  if(N.next.length)o.push(`<div class="row"><div class="grow"><b>💶 Nei prossimi 7 giorni</b><small>${esc(N.next.slice(0,3).map(i=>fmt(i.d,{day:"numeric",month:"short"})+" "+i.t+" "+(i.tipo==="e"?"+":"−")+eur0(i.imp)).join(" · "))}</small></div></div>`);
  return o.join("");}
/* promemoria per il Calendario dell'iPad */
function pensIcs(t){return P.pens?cassaIcs(t).concat(pensOpen().filter(a=>a.d>=t).map(a=>({uid:"pens-"+a.id,lines:["DTSTART;VALUE=DATE:"+dval(a.d),"DTEND;VALUE=DATE:"+dval(add(a.d,1)),"SUMMARY:"+icsEsc("🎖️ "+a.t),...alarm(7)]}))):[];}

/* ---------- 📰 Novità: file pubblico news-pensione.json (copia sull'iPad per quando manca internet) ---------- */
const NEWS_KEY="pn-news", TEMI={contratto:["📄","Contratto"],previdenza:["🛡️","Previdenza dedicata"],inps:["🏛️","INPS e bilancio"],fondi:["🎖️","Fondi del Corpo"]};
let newsBusy=false, newsTema="";
const newsData=()=>lsJ(NEWS_KEY)||{voci:[],attesa:[]};
const newsList=()=>(newsData().voci||[]).slice().sort((a,b)=>a.d<b.d?1:a.d>b.d?-1:0);
async function newsFetch(force){const N=newsData();if(newsBusy||navigator.onLine===false)return;if(!force&&N.checked&&Date.now()-new Date(N.checked).getTime()<30*60e3)return;
  newsBusy=true;try{const r=await fetch("news-pensione.json?t="+Date.now(),{cache:"no-store"});if(!r.ok)throw 0;const o=await r.json();if(o.app!=="pianificazione-novita"||!Array.isArray(o.voci))throw 0;
    const before=N.updated;o.checked=new Date().toISOString();try{localStorage.setItem(NEWS_KEY,JSON.stringify(o));}catch(e){}if(o.updated!==before&&(cur==="pens"||cur==="cal"))softRender();}
  catch(e){try{N.checked=new Date().toISOString();localStorage.setItem(NEWS_KEY,JSON.stringify(N));}catch(x){}}finally{newsBusy=false;}}
/* «Cosa cambia per te»: le tue leve, cifre e adempimenti con gli stessi argomenti della notizia */
function newsTouch(n){if(!P.pens)return[];const tg=new Set(n.tocca||[]),p=PENS(),out=[];if(!tg.size)return out;
  const hit=x=>(x.tag||[]).some(t=>tg.has(t));
  p.leve.filter(l=>hit(l)&&l.stato!=="no").forEach(l=>out.push({k:"leve",t:"Leva "+l.n+": "+l.t}));
  p.cifre.filter(hit).forEach(c=>out.push({k:"cifre",t:"Cifra: "+c.t}));
  p.adem.filter(a=>hit(a)&&!a.fatto).forEach(a=>out.push({k:"adem",t:"Adempimento: "+a.t}));
  return out;}
const newsNew=()=>{if(!pensHas())return 0;const seen=new Set(PENS().newsSeen);return newsList().filter(n=>!seen.has(n.id)&&newsTouch(n).length).length;};
function pensNews(){
  const N=newsData(),L=newsList().filter(n=>!newsTema||(n.temi||[]).includes(newsTema)),seen=new Set(PENS().newsSeen),A=N.attesa||[];
  let o=`<div class="card k-pens"><h3>⏳ Parametri in attesa <span class="lbl" style="margin-left:auto;font-weight:600">servono al ricalcolo</span></h3>${A.map(x=>`<div class="row"><span class="pill ${x.stato==="uscito"?"ok":"soon"}">${x.stato==="uscito"?"uscito":"atteso"}</span><div class="grow"><b>${esc(x.t)}</b><small>${[x.valore!=null&&x.valore!==""?"valore: "+(x.id==="tasso2026"?"+"+String(Math.round((x.valore-1)*1e4)/100).replace(".",",")+"%":esc(String(x.valore))):"",x.stima!=null&&(x.valore==null||x.valore==="")?"stima non ufficiale: "+(x.id==="tasso2026"?"+"+String(Math.round((x.stima-1)*1e4)/100).replace(".",",")+"%":esc(String(x.stima))):"",x.quando?esc(x.quando):"",x.nota?esc(x.nota):""].filter(Boolean).join(" · ")}</small>${x.url?`<small><a href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.fonte||"fonte")} ›</a></small>`:""}</div></div>`).join("")||'<p class="empty">Nessun parametro in attesa.</p>'}</div>`;
  o+=`<div class="seg" style="margin:0 0 12px;width:max-content;max-width:100%"><button data-nt="" class="${newsTema?"":"on"}">Tutte</button>${Object.entries(TEMI).map(([k,v])=>`<button data-nt="${k}" class="${newsTema===k?"on":""}">${v[0]} ${v[1]}</button>`).join("")}</div>`;
  o+=`<div class="card k-pens">${L.map(n=>{const tc=newsTouch(n),nw=!seen.has(n.id);return `<div class="fx"><div class="row" style="border:0;padding:0;align-items:flex-start"><span class="pill ${nw?"soon":"pens"}">${fmt(n.d,{day:"numeric",month:"short",year:"2-digit"})}</span><div class="grow"><b>${nw?"🆕 ":""}${esc(n.titolo)}</b><small style="color:var(--ink);margin-top:2px">${esc(n.sintesi)}</small>
      <small>${(n.temi||[]).map(t=>TEMI[t]?TEMI[t][0]+" "+TEMI[t][1]:"").filter(Boolean).join(" · ")}${n.url?` · <a href="${esc(n.url)}" target="_blank" rel="noopener">${esc(n.fonte||"fonte")} ›</a>`:""}</small>
      ${n.effetto||tc.length?`<div class="warnbox" style="margin-top:6px;background:var(--pens-bg);border-color:var(--pens)"><b>Cosa cambia per te.</b> ${esc(n.effetto||"")}${tc.length?`<br>${tc.slice(0,3).map(x=>"• "+esc(x.t)).join("<br>")}${tc.length>3?`<br><span class="lbl">e altre ${tc.length-3} voci della tua scheda</span>`:""}`:""}</div>`:""}</div></div></div>`;}).join("")||'<p class="empty">Ancora nessuna notizia scaricata: serve internet una volta.</p>'}</div>
    <p class="lbl">Dati e fonti si aggiornano da soli alle 13, alle 17 e alle 23${N.updated?" · ultimo controllo "+whenIt(N.updated):""}. Sono informazioni con data e fonte, non consigli: per decidere vale il testo ufficiale.</p>`;
  const F=N.fonti||[],G={};F.forEach(f=>(G[f.tipo]=G[f.tipo]||[]).push(f));
  if(F.length)o+=`<details class="more"><summary>🔎 Fonti controllate (${F.length})</summary><div class="card k-pens">${Object.entries(G).map(([tp,L])=>`<h3 style="color:var(--ink);font-size:14.5px;margin:6px 0 4px">${esc(tp.charAt(0).toUpperCase()+tp.slice(1))}</h3>${L.map(f=>`<div class="row" style="padding:5px 0"><div class="grow"><a href="${esc(f.url)}" target="_blank" rel="noopener">${esc(f.n)}</a></div><small class="lbl" style="${f.esito&&f.esito!=="ok"?"color:var(--scad)":""}">${f.ultimo?(f.esito&&f.esito!=="ok"?esc(f.esito)+" · ":"")+whenIt(f.ultimo):"da controllare"}</small></div>`).join("")}`).join("")}</div></details>`;
  const K=(N.controlli||[]).slice(-6).reverse();
  if(K.length)o+=`<details class="more"><summary>🕒 Ultimi controlli</summary><div class="card k-pens">${K.map(k=>`<div class="row"><span class="pill pens">${whenIt(k.at)}</span><div class="grow">${k.notizie?`<b>${k.notizie} ${k.notizie===1?"novità":"novità"}</b> · `:""}${esc(k.note||"")}</div></div>`).join("")}</div></details>`;
  return o;}
const whenIt=t=>{const d=new Date(t);if(isNaN(d))return "";const o=new Date();return (d.toDateString()===o.toDateString()?"oggi":d.toLocaleDateString("it-IT",{day:"numeric",month:"short"}))+" "+d.toLocaleTimeString("it-IT",{hour:"2-digit",minute:"2-digit"});};
/* ---------- 🔁 Ricalcolo con la formula in chiaro (parametri della scheda + quelli pubblicati) ---------- */
function rcState(){const p=PENS(),C=p.calc,R=p.ricalc,A=newsData().attesa||[],get=id=>A.find(x=>x.id===id)||{};
  const cU=get("coeff2728"),tU=get("tasso2026"),cUff=cU.valore!=null&&cU.valore!==""?+cU.valore:null,tUff=tU.valore!=null&&tU.valore!==""?+tU.valore:null,tSt=tU.stima!=null?+tU.stima:null;
  const coeffs=[["A",C.coeffA,"ipotesi A, invariato"],["B",C.coeffB,"ipotesi B, riduzione stimata"]].concat(cUff?[["U",cUff,"ufficiale 2027-2028"]]:[]);
  const tassi=[["1",1,"non applicato (come nella scheda)"]].concat(tSt?[["S",tSt,"stima non ufficiale"]]:[]).concat(tUff?[["U",tUff,"ufficiale"]]:[]);
  const ck=R.coeff&&coeffs.some(x=>x[0]===R.coeff)?R.coeff:(cUff?"U":"B"),tk=R.tasso&&tassi.some(x=>x[0]===R.tasso)?R.tasso:(tUff?"U":"1"),qa=(C.quotaA||[]),qk=R.qa!=null&&qa[+R.qa]?+R.qa:Math.min(1,qa.length-1);
  const co=coeffs.find(x=>x[0]===ck),ta=tassi.find(x=>x[0]===tk);
  const mont=(+C.base25||0)*ta[1]+(+C.c26||0)+(+C.c27||0),tot=mont+(+C.molt||0),qc=tot*co[1]/100,q=qa[qk]?+qa[qk][0]:0,lordo=qc+q;
  const NT=(C.netto||[]).slice().sort((a,b)=>a[0]-b[0]);let netto=null;
  if(NT.length>=2){let i=NT.findIndex(x=>x[0]>=lordo);if(i<=0)i=i<0?NT.length-1:1;const[a,b]=[NT[i-1],NT[i]];netto=a[1]+(lordo-a[0])*(b[1]-a[1])/(b[0]-a[0]);}
  return{C,coeffs,tassi,ck,tk,qa,qk,co,ta,mont,tot,qc,q,lordo,netto,cUff,tUff};}
function pensRicalc(){const p=PENS();if(!p.calc||!p.calc.base25)return "";const S=rcState(),C=S.C,n0=x=>Math.round(x).toLocaleString("it-IT");
  return `<div class="card k-pens"><h3>🔁 Ricalcolo della pensione</h3><div class="form">
    <label>Coefficiente a 60 anni<select data-rc="coeff">${S.coeffs.map(([k,v,t])=>`<option value="${k}"${S.ck===k?" selected":""}>${String(v).replace(".",",")}% · ${t}</option>`).join("")}</select></label>
    <label>Tasso di capitalizzazione 2026<select data-rc="tasso">${S.tassi.map(([k,v,t])=>`<option value="${k}"${S.tk===k?" selected":""}>${k==="1"?"—":String(v).replace(".",",")} · ${t}</option>`).join("")}</select></label>
    <label>Quota A (retributiva)<select data-rc="qa">${S.qa.map((x,i)=>`<option value="${i}"${S.qk===i?" selected":""}>${n0(x[0])} € · ${esc(x[1])}</option>`).join("")}</select></label></div>
    <table class="ptab" style="margin-top:10px"><tbody>
      <tr><td>Montante al 31/12/2025</td><td>${n0(C.base25)} €${S.ta[1]!==1?` × ${String(S.ta[1]).replace(".",",")}`:""}</td></tr>
      <tr><td>+ contributi 2026 e 2027</td><td>${n0(C.c26)} € + ${n0(C.c27)} €</td></tr>
      <tr><td>+ moltiplicatore (art. 3 c. 7)</td><td>${n0(C.molt)} €</td></tr>
      <tr><td><b>= montante complessivo</b></td><td><b>${n0(S.tot)} €</b></td></tr>
      <tr><td>× coefficiente ${String(S.co[1]).replace(".",",")}%</td><td>${n0(S.qc)} € all’anno (quota contributiva)</td></tr>
      <tr><td>+ quota A</td><td>${n0(S.q)} €</td></tr>
      <tr><td><b>= pensione lorda all’anno</b></td><td><b>${n0(S.lordo)} €</b> · ${n0(S.lordo/13)} € lordi al mese</td></tr>
      ${S.netto?`<tr><td><b>Netta al mese (13 mensilità)</b></td><td><b>≈ ${n0(S.netto/13)} €</b></td></tr>`:""}</tbody></table>
    <p class="lbl" style="margin:8px 0 0">${S.cUff?"Coefficiente 2027-2028 pubblicato. ":"Coefficienti 2027-2028 non ancora pubblicati: ipotesi della scheda. "}${S.tUff?"Tasso 2026 pubblicato. ":"Tasso 2026 non ancora pubblicato. "}Il netto usa lo stesso rapporto lordo/netto dei quattro scenari della scheda. Stima da confrontare con il provvedimento INPS.</p></div>`;}
/* ---------- 🧾 Controllo del cedolino ---------- */
function pensCed(){const p=PENS(),L=p.cedolini,t=today().slice(0,7);if(!L.length)return `<div class="card k-pens"><p class="empty">La scheda non contiene i cedolini attesi.</p></div>`;
  const mm=ym=>parse(ym+"-01").toLocaleDateString("it-IT",{month:"short",year:"2-digit"});let tA=0,tR=0;
  const rows=L.map(x=>{const r=x.ric!=null&&x.ric!==""?+x.ric:null,d=r!=null?r-x.netto:null;if(r!=null){tA+=+x.netto;tR+=r;}const big=d!=null&&Math.abs(d)>30;
    return `<tr><td>${mm(x.ym)}${x.ym===t?" ◀":""}</td><td><b>${esc(x.t)}</b><small>${esc(x.nota||"")}</small></td><td>≈ ${eur0(x.netto)}</td><td><input data-ced="${x.id}" inputmode="decimal" placeholder="ricevuto" value="${r!=null?esc(String(r).replace(".",",")):""}" class="pin" style="min-width:0;width:100px;padding:6px 8px"></td><td>${d!=null?`<span class="amt ${big?(d<0?"u":"e"):""}">${d>0?"+":""}${eur0(d)}</span>${big?"<small>⚠️ da guardare</small>":""}`:""}</td></tr>`;}).join("");
  return `<div class="card k-pens"><h3>🧾 Il cedolino mese per mese</h3><div style="overflow-x:auto"><table class="ptab"><thead><tr><th>Mese</th><th>Voce</th><th>Atteso</th><th>Ricevuto</th><th>Differenza</th></tr></thead><tbody>${rows}</tbody></table></div>
    ${tR?`<p class="lbl" style="margin:8px 0 0">Mesi controllati: ricevuti ${eur0(tR)} contro ${eur0(tA)} attesi (${tR-tA>=0?"+":""}${eur0(tR-tA)}).</p>`:""}
    <p class="lbl" style="margin:8px 0 0">Scrivi il netto del cedolino NoiPA quando arriva. Una differenza oltre 30 € è segnata: di solito dipende da aumenti o arretrati non ancora pagati, da rate finite o da conguagli.</p></div>`;}
/* ---------- ☎️ Contatti e testi pronti ---------- */
function pensCont(){const p=PENS(),io=p.io,fill=s=>String(s||"").replace(/\{(\w+)\}/g,(m,k)=>io[k]||(p.dati[k]!=null?p.dati[k]:"["+k+"]"));
  let o=`<div class="card k-pens"><h3>☎️ Uffici e contatti</h3>${p.contatti.map(c=>`<div class="row"><div class="grow"><b>${esc(c.n)}</b><small>${[c.ruolo?esc(c.ruolo):"",c.tel?`<a href="tel:${esc(c.tel.split("/")[0].replace(/[^\d+]/g,""))}">${esc(c.tel)}</a>`:"",c.mail?`<a href="mailto:${esc(c.mail)}">${esc(c.mail)}</a>`:"",c.pec?"PEC "+`<a href="mailto:${esc(c.pec)}">${esc(c.pec)}</a>`:"",c.note?esc(c.note):""].filter(Boolean).join(" · ")}</small></div></div>`).join("")||'<p class="empty">Nessun contatto nella scheda.</p>'}</div>`;
  o+=`<div class="card k-pens"><h3>✍️ I tuoi dati per i testi</h3><div class="form">${[["nome","Nome e cognome"],["grado","Grado"],["matricola","Matricola"],["reparto","Reparto"]].map(([k,l])=>`<label>${l}<input data-io="${k}" maxlength="80" value="${esc(io[k]||p.dati[k]||"")}"></label>`).join("")}</div><p class="lbl" style="margin:8px 0 0">Restano solo su questo iPad e compaiono nei testi qui sotto.</p></div>`;
  o+=p.testi.map(x=>`<details class="more"><summary>${esc(x.t)}</summary><div class="card k-pens"><p class="lbl" style="margin-top:0">A: <b>${esc(x.a||"")}</b>${x.quando?" · "+esc(x.quando):""}</p><div class="form"><label class="wide">Testo (lo puoi cambiare prima di copiarlo)<textarea id="tx-${x.id}" rows="10">${esc(fill(x.testo))}</textarea></label></div>
    <div class="btns"><button class="btn sm pri" data-tx="${x.id}">📋 Copia il testo</button>${x.mail?`<a class="btn sm" href="mailto:${esc(x.mail)}?subject=${encodeURIComponent(fill(x.oggetto||x.t))}&body=${encodeURIComponent(fill(x.testo))}">✉️ Apri in Mail</a>`:""}</div></div></details>`).join("");
  return o+`<p class="lbl">Bozze da controllare prima dell’invio (con il patronato o l’ufficio): non sono pareri legali.</p>`;}
/* ---------- 🗓️ Linea del tempo 2026–2029 ---------- */
let pensTp=null;
function pensTappe(){const p=PENS(),L=p.tappe.slice(),lp=lastPresence();
  if(lp&&!L.some(x=>x.id==="lic"))L.push({id:"lic",ic:"🏖️",t:"Inizio della licenza in coda",da:add(lp,1),nota:"ultimo giorno in ufficio "+fmt(lp,{weekday:"long",day:"numeric",month:"long"})+" (dalle Licenze)"});
  return L.filter(x=>x.da).sort((a,b)=>a.da<b.da?-1:1);}
function bindPens2(p,num){const R=()=>render();
  document.querySelectorAll("[data-tp]").forEach(b=>b.onclick=()=>{pensTp=pensTp===b.dataset.tp?null:b.dataset.tp;R();});
  document.querySelectorAll("[data-nt]").forEach(b=>b.onclick=()=>{newsTema=b.dataset.nt;R();});
  document.querySelectorAll("[data-rc]").forEach(s=>s.onchange=()=>{p.ricalc[s.dataset.rc]=s.value;save();R();});
  document.querySelectorAll("[data-ced]").forEach(i=>i.onchange=()=>{const x=p.cedolini.find(y=>y.id===i.dataset.ced);if(x){const v=num(i.value);x.ric=v==null?"":v;save();R();toast("Salvato");}});
  document.querySelectorAll("[data-io]").forEach(i=>i.onchange=()=>{p.io[i.dataset.io]=i.value.trim();save();R();});
  document.querySelectorAll("[data-tx]").forEach(b=>b.onclick=()=>{const ta=$("tx-"+b.dataset.tx);if(!ta)return;const v=ta.value;
    const old=()=>{try{ta.select();const ok=document.execCommand("copy");return ok;}catch(e){return false;}};
    try{navigator.clipboard.writeText(v).then(()=>toast("📋 Testo copiato"),()=>toast(old()?"📋 Testo copiato":"Tieni premuto sul testo e scegli Copia"));}catch(e){toast(old()?"📋 Testo copiato":"Tieni premuto sul testo e scegli Copia");}});
  /* le novità guardate non contano più nel numero sulla scheda */
  if(pensV==="news"){const ids=newsList().map(n=>n.id),miss=ids.filter(id=>!p.newsSeen.includes(id));if(miss.length)setTimeout(()=>{p.newsSeen=p.newsSeen.concat(miss).slice(-300);save();side();},2500);}
  if(cur==="pens")newsFetch(false);
}

/* ---------- 🧪 Ipotesi della scheda: confermate o superate dai dati ufficiali ---------- */
const IP_ST={da:["Da verificare","soon"],ok:["Confermata","ok"],no:["Superata","warn"]};
function licPlanned(){const S=licS();if(!S)return null;let n=0;const st=S.start||today(),from=today()>st?today():st;
  for(let s=from;s<=S.end;s=add(s,1)){const d=licDay(S,s);if(d.k==="LAV"&&(d.c==="LP"||d.c==="LO"))n++;}return n;}
function ipAuto(x){const A=newsData().attesa||[],a=x.attesa?A.find(y=>y.id===x.attesa):null,p=PENS();
  if(x.auto==="licenza"){const n=licPlanned();if(n==null)return null;return n>=(+x.soglia||0)?{st:"ok",why:n+" giorni di licenza già messi in Licenze"}:{st:"no",why:"in Licenze ne risultano "+n+" su "+x.soglia+": completa il piano"};}
  if(x.auto==="arretrati"){const c=p.cedolini.find(y=>/arretrat/i.test(y.t));if(c&&c.ric!=null&&c.ric!=="")return{st:"ok",why:"arretrati arrivati nel cedolino di "+parse(c.ym+"-01").toLocaleDateString("it-IT",{month:"long",year:"numeric"})};if(today()>"2027-05-31")return{st:"no",why:"non risultano arrivati entro maggio 2027"};return null;}
  if(!a||a.stato!=="uscito"||a.valore==null||a.valore==="")return a&&a.quando?{st:"da",why:a.quando}:null;
  const v=a.valore;
  if(x.attesa==="dpr2527"){const d=String(v).slice(0,10);return d<=(x.entro||"2026-12-31")?{st:"ok",why:"in Gazzetta il "+fmt(d,{day:"numeric",month:"long",year:"numeric"})}:{st:"no",why:"in Gazzetta solo il "+fmt(d,{day:"numeric",month:"long",year:"numeric"})};}
  if(x.attesa==="coeff2728"){const d=Math.abs(+v-(+x.atteso));return d<0.0051?{st:"ok",why:"ufficiale "+String(v).replace(".",",")+"%"}:{st:"no",why:"ufficiale "+String(v).replace(".",",")+"% (scheda "+String(x.atteso).replace(".",",")+"%): vedi il Ricalcolo"};}
  if(x.attesa==="tasso2026")return{st:"no",why:"tasso ufficiale +"+String(Math.round((+v-1)*1e4)/100).replace(".",",")+"%: chiedi al patronato se va applicato al montante e guarda il Ricalcolo"};
  if(x.attesa==="faf2027"){const d=(+v-(+x.atteso))/(+x.atteso);return Math.abs(d)<0.05?{st:"ok",why:"quota ufficiale "+eur0(v)}:{st:"no",why:"quota ufficiale "+eur0(v)+" (scheda "+eur0(x.atteso)+")"};}
  return null;}
function pensIpotesi(){const p=PENS();if(!p.ipotesi.length)return "";
  const rows=p.ipotesi.map(x=>{const au=ipAuto(x),st=x.st&&x.st!=="da"?x.st:(au&&au.st)||"da",S=IP_ST[st];
    return `<div class="row"><span class="pill ${S[1]}">${S[0]}</span><div class="grow"><b>${esc(x.t)}</b><small>${esc(x.det||"")}${au&&au.why?" · "+(x.st&&x.st!=="da"?"dato: ":"")+esc(au.why):""}</small></div>
      <select data-ips="${x.id}" class="pin" style="flex:0 0 auto;min-width:0" aria-label="Stato"><option value="">${au?"automatico":"—"}</option>${Object.entries(IP_ST).map(([k,v])=>`<option value="${k}"${x.st===k?" selected":""}>${v[0]}</option>`).join("")}</select></div>`;}).join("");
  const no=p.ipotesi.filter(x=>(x.st&&x.st!=="da"?x.st:(ipAuto(x)||{}).st)==="no").length;
  return `<div class="card k-pens"><h3>🧪 Le ipotesi della scheda${no?` <span class="pill warn">${no} superate</span>`:""}</h3>${rows}<p class="lbl" style="margin:8px 0 0">Lo stato cambia da solo quando escono i dati ufficiali (novità delle 13, 17 e 23), dalle Licenze e dal Cedolino; puoi anche fissarlo a mano. Un’ipotesi superata vuol dire che le cifre della scheda vanno riviste.</p></div>`;}
/* ---------- 🩺 Esito del C.M.O. e domanda di congedo ---------- */
const ESITI=[["","—"],["idoneo","Idoneo"],["limitazioni","Idoneo con limitazioni"],["non","Non idoneo al servizio"],["altro","Altro (vedi nota)"]];
function pensEsito(){const p=PENS(),E=p.esito,lv=n=>p.leve.find(l=>+l.n===n);
  const link=[[6,"Trattamento privilegiato"],[7,"Accesso all’ausiliaria"],[12,"Domanda di congedo"]].map(([n,t])=>{const l=lv(n);return l?`<span class="pill ${(LV_ST[l.stato]||LV_ST.da)[1]}">Leva ${n} · ${(LV_ST[l.stato]||LV_ST.da)[0]}</span>`:"";}).join(" ");
  const hint=E.esito==="limitazioni"||E.esito==="non"?`<div class="warnbox" style="margin-top:8px">Con questo esito la scheda indica: ausiliaria preclusa (il moltiplicatore spetta di diritto) e possibile istanza di trattamento privilegiato entro due anni dal congedo (leva 6, termine 31 maggio 2029). Da verificare con il patronato.</div>`:E.esito==="idoneo"?`<div class="warnbox" style="margin-top:8px;background:var(--pens-bg);border-color:var(--pens)">Con l’idoneità la scelta fra riserva e ausiliaria resta aperta: la categoria indicata nella domanda decide il moltiplicatore (leva 7).</div>`:"";
  return `<div class="card k-pens"><h3>🩺 C.M.O. e domanda di congedo</h3><div class="form">
    <label>Esito del verbale C.M.O.<select data-es="esito">${ESITI.map(([k,t])=>`<option value="${k}"${(E.esito||"")===k?" selected":""}>${t}</option>`).join("")}</select></label>
    <label>Data del verbale<input type="date" data-es="dVerb" value="${esc(E.dVerb||"")}"></label>
    <label>Categoria scelta nella domanda<select data-es="cat"><option value="">—</option><option value="riserva"${E.cat==="riserva"?" selected":""}>Riserva (mod. 1/A età-ris)</option><option value="ausiliaria"${E.cat==="ausiliaria"?" selected":""}>Ausiliaria (mod. 1/A età-aus)</option></select></label>
    <label>Protocollo della domanda di congedo<input data-es="prot" maxlength="60" value="${esc(E.prot||"")}" placeholder="numero del Comando Regionale"></label>
    <label>Data di presa in carico<input type="date" data-es="dProt" value="${esc(E.dProt||"")}"></label>
    <label class="wide">Note sul verbale<input data-es="nota" maxlength="240" value="${esc(E.nota||"")}" placeholder="infermità riconosciute, limitazioni, prossimi passi…"></label></div>
    <p class="lbl" style="margin:8px 0 0">Collegate: ${link}</p>${hint}</div>`;}
function esitoApply(p){const E=p.esito,lv=n=>p.leve.find(l=>+l.n===n);
  if(E.prot){const a=p.adem.find(x=>/Domanda di congedo presentata/.test(x.t));if(a)a.nota="prot. "+E.prot+(E.dProt?" del "+fmt(E.dProt,{day:"numeric",month:"short",year:"numeric"}):"");const l=lv(12);if(l&&l.stato!=="fatta")l.stato="fatta";}
  if(E.cat){const l=lv(7);if(l){if(E.cat==="riserva"&&(l.stato==="da"||!l.stato))l.nota=l.nota||"categoria scelta: riserva";}}
  if(E.esito==="limitazioni"||E.esito==="non"){const l=lv(6);if(l&&l.stato==="no")l.stato="da";if(l&&!l.d)l.d="2029-05-31";}}
/* ---------- 📋 Documenti attesi ---------- */
function pensDocAttesi(){const p=PENS(),L=p.docAttesi;if(!L.length)return "";const files=p.files||[],n=L.filter(d=>d.ok).length;
  return `<div class="card k-pens"><h3>📋 Documenti attesi <span class="lbl" style="margin-left:auto;font-weight:600">${n}/${L.length}</span></h3>${L.map(d=>{const f=d.file&&files.find(x=>x.id===d.file);
    return `<div class="row"><button class="chk${d.ok?" done":""}" data-dak="${d.id}" aria-label="Segna">✓</button><div class="grow${d.ok?" lbl":""}"><b>${esc(d.t)}</b><small>${esc(d.da||"")}${d.quando?" · "+esc(d.quando):""}${f?" · 📎 "+esc(f.n):""}</small></div>
      ${f?`<button class="btn sm" data-pfo2="${f.id}">Apri</button>`:`<label class="btn sm" style="cursor:pointer">📎<input type="file" data-daf="${d.id}" accept="application/pdf,image/*" hidden></label>`}</div>`;}).join("")}
    <p class="lbl" style="margin:8px 0 0">Spunta quando lo hai; con 📎 alleghi direttamente il PDF o la foto (resta su questo iPad e nelle copie).</p></div>`;}
/* ---------- 📆 avviso: scadenze della Pensione non ancora mandate al Calendario dell'iPad ---------- */
function pensIcsNag(){try{const opt=P.ics.opt||{abs:true,app:true,scad:true,pens:true,prat:true,pay:true,fam:true};if(opt.pens===false)return "";
  const n=icsItems(opt).filter(i=>/^pens-/.test(i.uid)&&P.ics.sent[i.uid]!==i.sig).length;if(!n)return "";
  return `<div class="card k-cal icsnag"><div class="row" style="border:0;padding:0"><span style="font-size:24px">📆</span><div class="grow"><b>${n} ${n===1?"promemoria della Pensione":"promemoria della Pensione"} da mandare al Calendario dell’iPad</b><small>Scadenze (avviso una settimana prima) ed entrate e uscite della Cassa (avviso il giorno prima), anche ad app chiusa.</small></div><button class="btn pri sm" data-pics="1">Aggiungi al Calendario</button></div></div>`;}catch(e){return "";}}
/* ---------- 🗓️ linea del tempo: tappe vicine raggruppate, verticale sul telefono ---------- */
function pensTimeline2(){const L=pensTappe();if(!L.length)return "";const t=today(),narrow=window.innerWidth<640,s=L.find(x=>x.id===pensTp);
  const det=s?`<p style="margin:8px 2px 0"><b>${s.ic||""} ${esc(s.t)}</b>${s.nota?` <span class="lbl">· ${esc(s.nota)}</span>`:""}</p>`:"";
  if(narrow){const items=L.map(x=>({k:x.da,x})).concat([{k:t,oggi:1}]).sort((a,b)=>a.k<b.k?-1:a.k>b.k?1:(a.oggi?-1:1));
    return `<div class="card k-pens"><div class="vtl">${items.map(it=>it.oggi?`<div class="vt oggi"><i></i><b>Oggi</b><small>${fmt(t,{day:"numeric",month:"short",year:"numeric"})}</small></div>`:
      `<button class="vt${it.k<t?" past":""}${pensTp===it.x.id?" sel":""}" data-tp="${it.x.id}"><i></i><span class="ic">${it.x.ic||"•"}</span><span class="tx"><b>${esc(it.x.t)}</b><small>${fmt(it.x.da,{day:it.x.a?undefined:"numeric",month:"short",year:"numeric"})}${it.x.a?" – "+fmt(it.x.a,{month:"short",year:"numeric"}):""}${pensTp===it.x.id&&it.x.nota?" · "+esc(it.x.nota):""}</small></span></button>`).join("")}</div></div>`;}
  const d0="2026-10-01",d1="2029-07-01",W=1000,H=96,X=q=>20+(W-40)*Math.max(0,Math.min(1,diff(d0,q)/diff(d0,d1)));
  let svg=`<line x1="20" x2="${W-20}" y1="62" y2="62" stroke="var(--line)" stroke-width="4" stroke-linecap="round"/>`+["2027-01-01","2028-01-01","2029-01-01"].map(y=>`<line x1="${X(y)}" x2="${X(y)}" y1="54" y2="70" stroke="var(--muted)"/><text x="${X(y)}" y="88" font-size="13" text-anchor="middle" fill="var(--muted)">${y.slice(0,4)}</text>`).join("")
    +`<line x1="20" x2="${X(t)}" y1="62" y2="62" stroke="var(--pens)" stroke-width="4" stroke-linecap="round"/><circle cx="${X(t)}" cy="62" r="6" fill="var(--cal)"/><text x="${X(t)}" y="88" font-size="12" text-anchor="middle" fill="var(--cal)" font-weight="700">oggi</text>`;
  /* le icone di tappe a meno di 34 punti l'una dall'altra vanno in un gruppo, una sopra l'altra */
  const groups=[];L.forEach(x=>{const cx=x.a?(X(x.da)+X(x.a))/2:X(x.da),g=groups.find(g=>Math.abs(g.cx-cx)<34);if(g){g.L.push(x);}else groups.push({cx,L:[x]});});
  L.forEach(x=>{const a=X(x.da),b=x.a?X(x.a):a,sel=pensTp===x.id;svg+=x.a?`<rect x="${a}" y="56" width="${Math.max(6,b-a)}" height="12" rx="6" fill="var(--pens)" opacity="${sel?1:.5}" data-tp="${x.id}" style="cursor:pointer"/>`:`<circle cx="${a}" cy="62" r="${sel?8:6}" fill="var(--pens)" stroke="var(--card)" stroke-width="2" data-tp="${x.id}" style="cursor:pointer"/>`;});
  groups.forEach(g=>g.L.forEach((x,j)=>{svg+=`<text x="${g.cx+(g.L.length>1?(j-(g.L.length-1)/2)*24:0)}" y="${40-(j%2)*0}" font-size="${pensTp===x.id?22:19}" text-anchor="middle" data-tp="${x.id}" style="cursor:pointer">${x.ic||"•"}</text>`;}));
  return `<div class="card k-pens" style="padding-bottom:10px"><svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto;display:block" role="img" aria-label="Linea del tempo dal 2026 al 2029">${svg}</svg>
    <div class="btns" style="margin-top:4px">${L.map(x=>`<button class="btn sm${pensTp===x.id?" pri":""}" data-tp="${x.id}">${x.ic||""} ${fmt(x.da,{day:x.a?undefined:"numeric",month:"short",year:"2-digit"})}${x.a?"–"+fmt(x.a,{month:"short",year:"2-digit"}):""}</button>`).join("")}</div>
    ${det||`<p class="lbl" style="margin:8px 2px 0">Tocca una tappa per i dettagli.</p>`}</div>`;}
function bindPens3(p,num){const R=()=>render();
  document.querySelectorAll("[data-ips]").forEach(s=>s.onchange=()=>{const x=p.ipotesi.find(y=>y.id===s.dataset.ips);if(x){x.st=s.value;save();R();}});
  document.querySelectorAll("[data-es]").forEach(i=>i.onchange=()=>{p.esito[i.dataset.es]=i.value.trim();esitoApply(p);save();R();toast("Salvato");});
  document.querySelectorAll("[data-dak]").forEach(b=>b.onclick=()=>{const d=p.docAttesi.find(x=>x.id===b.dataset.dak);if(d){d.ok=d.ok?"":today();save();R();}});
  document.querySelectorAll("[data-daf]").forEach(inp=>inp.onchange=async()=>{const f=inp.files&&inp.files[0],d=p.docAttesi.find(x=>x.id===inp.dataset.daf);inp.value="";if(!f||!d)return;if(f.size>15*1024*1024)return toast("File troppo grande (massimo 15 MB)");
    const id=uid();try{await kv("readwrite","pf-"+id,f);}catch(e){return toast("Non riesco a salvare il file su questo iPad");}
    p.files.push({id,n:f.name||d.t,type:f.type||"",size:f.size,at:new Date().toISOString()});d.file=id;d.ok=d.ok||today();save();R();toast("📎 "+d.t+" allegato");if(window.__pfRefresh)window.__pfRefresh();});
  document.querySelectorAll("[data-pics]").forEach(b=>b.onclick=()=>exportIcs(false));
  bindCassa(p,num);
}

/* ---------- 🔄 Scheda che si aggiorna da sola ----------
   File pubblico «scheda-pensione.cifrata.json» (AES-256-GCM). La chiave (32 byte, base64url) sta solo su questo iPad
   in «pn-scheda-chiave», fuori dalle copie: senza chiave il file è illeggibile. Arriva con il collegamento …/licenze/#sk=<chiave>
   (la parte dopo # non lascia mai l'iPad) o incollata a mano. Lo aggiornano Claude e l'attività delle 13 · 17 · 23
   (strumenti/scheda_cifrata.py); qui si unisce con pensMerge: spunte, note, importi reali, esito e documenti restano. */
const SK_KEY="pn-scheda-chiave",SK_META="pn-scheda-meta",SK_AAD="pianificazione-scheda-v1";let skBusy=false;
const skKey=()=>{try{return localStorage.getItem(SK_KEY)||"";}catch(e){return "";}};
const skMeta=()=>lsJ(SK_META)||{};
const skSetMeta=m=>{try{localStorage.setItem(SK_META,JSON.stringify(Object.assign(skMeta(),m)));}catch(e){}};
function b64u(s){s=String(s).replace(/-/g,"+").replace(/_/g,"/");while(s.length%4)s+="=";const b=atob(s),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u;}
function skValid(k){try{return /^[A-Za-z0-9_-]{43}$/.test(k)&&b64u(k).length===32;}catch(e){return false;}}
function skFromHash(k){try{k=decodeURIComponent(k||"").trim();}catch(e){k="";}
  if(!skValid(k)){setTimeout(()=>toast("Il collegamento della scheda non è valido"),700);return;}
  try{localStorage.setItem(SK_KEY,k);localStorage.removeItem(SK_META);}catch(e){}pensV="doc";try{sessionStorage.setItem("pn-pensv","doc");}catch(e){}
  setTimeout(()=>schedaFetch(true),400);}
async function skOpen(o,k){const key=await crypto.subtle.importKey("raw",b64u(k),"AES-GCM",false,["decrypt"]);
  const pt=await crypto.subtle.decrypt({name:"AES-GCM",iv:b64u(o.iv),additionalData:new TextEncoder().encode(SK_AAD)},key,b64u(o.ct));
  return JSON.parse(new TextDecoder().decode(pt));}
async function schedaFetch(force){const k=skKey();if(!k||skBusy||navigator.onLine===false)return;const M=skMeta();
  if(!force&&M.checked&&Date.now()-new Date(M.checked).getTime()<30*60e3)return;
  skBusy=true;let err="";
  try{let o;try{const r=await fetch("scheda-pensione.cifrata.json?t="+Date.now(),{cache:"no-store"});if(!r.ok)throw 0;o=await r.json();}catch(e){err="rete";throw e;}
    if(!o||o.app!=="pianificazione-scheda-cifrata"||!o.iv||!o.ct){err="file";throw 0;}
    const mine=P.pens&&+P.pens.rev||0;
    if(o.rev>mine){let s;try{s=await skOpen(o,k);}catch(e){err="chiave";throw e;}
      if(!s||s.app!=="pianificazione-pensione"||!s.pens||s.v!==o.rev){err="file";throw 0;}
      pensMerge(s.pens);P.pens.rev=o.rev;P.pens.revAt=o.updated;save();
      toast("🎖️ Scheda pensione aggiornata (rev. "+o.rev+")");}
    skSetMeta({checked:new Date().toISOString(),pub:o.rev,err:""});}
  catch(e){skSetMeta({checked:new Date().toISOString(),err:err||"rete"});if(force)toast(err==="chiave"?"La chiave non apre la scheda":err==="file"?"Il file della scheda non è valido":"Scheda non raggiungibile ora");}
  finally{skBusy=false;if(cur==="pens"||cur==="cal")softRender();}}
function skCard(){const k=skKey(),M=skMeta(),p=P.pens||{},when=s=>s?new Date(s).toLocaleString("it-IT",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"}):"";
  if(!k)return `<div class="card k-pens"><h3>🔄 Aggiornamento automatico della scheda</h3><p class="lbl" style="margin-top:0">Apri il collegamento della scheda oppure incolla qui la chiave: da quel momento la scheda si aggiorna da sola quando cambia, e le tue spunte, note e importi restano. La chiave resta solo su questo iPad.</p>
    <div class="form"><label>Chiave della scheda<input id="skIn" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="43 caratteri"></label></div><div class="btns"><button class="btn sm pri" data-sk="on">Attiva</button></div></div>`;
  const err=M.err==="chiave"?"⚠️ La chiave non apre la scheda pubblicata: disattiva e incolla la chiave nuova.":M.err==="file"?"⚠️ Il file pubblicato non è valido: riprovo al prossimo controllo.":M.err==="rete"?"Ultimo controllo senza rete: riprovo da solo.":"";
  const mods=(p.modifiche||[]).slice(-6).reverse();
  return `<div class="card k-pens"><h3>🔄 Aggiornamento automatico della scheda</h3>
    <div class="row"><span class="pill pens">rev. ${esc(String(p.rev||"—"))}</span><div class="grow"><b>Attivo</b><small>${p.revAt?"scheda del "+when(p.revAt)+" · ":""}${M.checked?"controllata il "+when(M.checked):"non ancora controllata"}</small></div><button class="btn sm" data-sk="now">Controlla ora</button></div>
    ${err?`<p class="lbl" style="color:var(--scad)">${err}</p>`:""}
    ${mods.length?`<details data-k="skmod"><summary>Ultime modifiche della scheda</summary>${mods.map(m=>`<div class="row"><span class="pill">rev. ${esc(String(m.rev))}</span><div class="grow">${esc(m.t||"")}<small>${when(m.at)}${/^https:\/\//.test(m.fonte||"")?` · <a href="${esc(m.fonte)}" target="_blank" rel="noopener">fonte</a>`:""}</small></div></div>`).join("")}</details>`:""}
    <p class="lbl" style="margin:8px 0 0">Controllo a ogni apertura (al massimo ogni mezz’ora). Le modifiche arrivano da Claude e dall’attività delle 13, 17 e 23.</p>
    <div class="btns"><button class="btn sm" data-sk="off">Disattiva</button></div></div>`;}
function bindSk(){document.querySelectorAll("[data-sk]").forEach(b=>b.onclick=()=>{const a=b.dataset.sk;
  if(a==="on"){const i=$("skIn"),v=(i&&i.value||"").trim();if(!skValid(v))return toast("La chiave non è valida (43 caratteri)");try{localStorage.setItem(SK_KEY,v);localStorage.removeItem(SK_META);}catch(e){}schedaFetch(true);render();}
  else if(a==="now")schedaFetch(true);
  else if(a==="off"){if(!confirm("Disattivare l’aggiornamento automatico? La scheda resta com’è su questo iPad."))return;try{localStorage.removeItem(SK_KEY);localStorage.removeItem(SK_META);}catch(e){}render();}});}
