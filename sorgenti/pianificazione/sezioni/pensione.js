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
function PENS(){if(!P.pens||typeof P.pens!=="object")P.pens={};const p=P.pens;["adem","leve","cifre","incassi","files","cedolini","contatti","testi","tappe","newsSeen"].forEach(k=>{if(!Array.isArray(p[k]))p[k]=[];});
  ["dati","cassa","calc","io","ricalc"].forEach(k=>{if(!p[k]||typeof p[k]!=="object")p[k]={};});return p;}
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
  if(!pensHas())return o+`<p class="sub">Il passaggio dal servizio alla pensione: adempimenti, leve, cifre, incassi e cassa fino al TFS.</p>`+pensImport(true);
  const op=pensOpen(),late=op.filter(a=>a.d<t),next=op.filter(a=>a.d>=t).slice(0,1)[0],lp=lastPresence();
  o+=`<p class="sub">${esc(p.src||"Dati della scheda pensione")}${p.at?" · caricati il "+fmt(p.at.slice(0,10),{day:"numeric",month:"long",year:"numeric"}):""}</p>
  <div class="kpi" style="margin-bottom:14px">${cess?`<div><b>${Math.max(0,diff(t,cess))}</b><span>giorni alla cessazione (${fmt(cess,{day:"numeric",month:"short",year:"numeric"})})</span></div>`:""}
    ${lp?`<div><b>${fmt(lp,{day:"numeric",month:"short"})}</b><span>ultimo giorno in ufficio (dalle Licenze)</span></div>`:""}
    <div><b style="${late.length?"color:var(--scad)":""}">${late.length||op.length}</b><span>${late.length?"scadenze passate da guardare":"adempimenti e leve aperti"}</span></div>
    ${next?`<div><b>${fmt(next.d,{day:"numeric",month:"short"})}</b><span>prossima: ${esc(next.t.slice(0,60))}</span></div>`:""}</div>`;
  o+=pensTimeline();
  if(D.rientro){const S=licS();if(S&&S.start&&S.start!==D.rientro)o+=`<div class="warnbox" style="margin:0 0 12px">In Licenze il rientro è il ${fmt(S.start,{day:"numeric",month:"long"})}, nella scheda il ${fmt(D.rientro,{day:"numeric",month:"long"})}: controlla quale è giusto in <a href="licenze.html">Licenze</a>.</div>`;}
  o+=`<div class="seg" role="tablist" style="margin:0 0 14px;width:max-content;max-width:100%">${PV.map(([k,n])=>`<button role="tab" data-pv="${k}" class="${pensV===k?"on":""}" aria-selected="${pensV===k}">${n}${k==="adem"&&late.length?`<span class="n">${late.length}</span>`:""}${k==="news"&&newsNew()?`<span class="n">${newsNew()}</span>`:""}</button>`).join("")}</div>`;
  return o+({news:pensNews,adem:pensAdem,leve:pensLeve,cifre:pensCifre,ced:pensCed,cassa:pensCassa,cont:pensCont,doc:pensDoc}[pensV]||pensAdem)();
}
/* ---- adempimenti ---- */
function pensAdem(){
  const p=PENS(),t=today(),L=p.adem.slice().sort((a,b)=>((a.d||"9")<(b.d||"9")?-1:(a.d||"9")>(b.d||"9")?1:0)),open=L.filter(a=>!a.fatto),done=L.filter(a=>a.fatto);
  const row=a=>{const st=a.fatto?"ok":!a.d?"":a.d<t?"warn":diff(t,a.d)<=14?"soon":"";
    return `<div class="row"><button class="chk${a.fatto?" done":""}" data-pa2="${a.id}" aria-label="${a.fatto?"Riapri":"Segna fatto"}">✓</button><div class="grow${a.fatto?" lbl":""}"><b>${esc(a.t)}</b>${a.det?`<small>${esc(a.det)}</small>`:""}${a.nota?`<small>📝 ${esc(a.nota)}</small>`:""}</div>
      <span class="pill ${st}">${a.d?fmt(a.d,{day:"numeric",month:"short",year:"2-digit"}):esc(a.quando||"senza data")}</span><button class="btn sm" data-pae="${a.id}" aria-label="Modifica">✏️</button></div>
      ${pensEd===a.id?`<div class="form addf"><label>Data<input type="date" data-paf="d" value="${esc(a.d||"")}"></label><label class="wide">Nota (protocollo, risposta, ufficio…)<input data-paf="nota" maxlength="200" value="${esc(a.nota||"")}"></label><div class="btns wide"><button class="btn sm" data-pae="">Chiudi</button><button class="btn sm danger" data-pax="${a.id}">Togli</button></div></div>`:""}`;};
  let o=`<div class="card k-pens">${open.length?open.map(row).join(""):'<p class="empty">Tutto fatto. 👍</p>'}
    <div class="btns"><input id="paT" maxlength="140" placeholder="Aggiungi un adempimento" class="pin"><input id="paD" type="date" class="pin" style="flex:0 1 170px;min-width:150px"><button class="btn sm" data-pa3="add">Aggiungi</button></div></div>`;
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
  let o=pensRicalc()+`<div class="card k-pens"><h3>📊 Le cifre stimate e quelle reali</h3>${p.cifre.map(c=>{const r=c.reale!=null&&c.reale!==""?+c.reale:null,lo=c.min!=null?+c.min:c.val,hi=c.max!=null?+c.max:c.val;
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
function pensCassa(){
  const p=PENS(),C=p.cassa,D=p.dati,start=(D.decor||"2027-06-01").slice(0,7),n=+(C.mesi||9);
  const pen=+(C.pens!=null?C.pens:(D.pensNetta||0)),sp=+(C.spese||0),alt=+(C.altre||0),sal=+(C.saldo||0),rit=+(C.rit||0),pm=C.premioMese||"",pv=+(C.premio!=null?C.premio:(D.premio||0));
  const months=[...Array(n)].map((_,i)=>{const d=parse(start+"-01");d.setMonth(d.getMonth()+i);return iso(d).slice(0,7);});
  const run=delay=>{let s=sal,min=Infinity,minM="";const rows=months.map((ym,i)=>{let e=alt,note=[];
      if(i===delay){e+=pen*(delay+1);if(delay)note.push("pensione + "+delay+" "+(delay===1?"mese":"mesi")+" arretrati");}else if(i>delay)e+=pen;
      if(ym.slice(5)==="12"&&i>=delay){e+=pen;note.push("tredicesima");}
      if(pm&&ym===pm&&pv){e+=pv;note.push("premio di previdenza");}
      s+=e-sp;if(s<min){min=s;minM=ym;}return{ym,e,s,note};});return{rows,min,minM};};
  const A=run(0),B=run(rit);
  const mm=ym=>parse(ym+"-01").toLocaleDateString("it-IT",{month:"short",year:"2-digit"});
  const num=(id,v,lab,ph)=>`<label>${lab}<input data-cs="${id}" inputmode="decimal" value="${v?esc(String(v).replace(".",",")):""}" placeholder="${ph||"0"}"></label>`;
  let o=`<div class="card k-pens"><h3>💶 I tuoi numeri</h3><div class="form">
    ${num("saldo",C.saldo,"Soldi disponibili al 31 maggio 2027 €")}${num("spese",C.spese,"Spese di casa al mese €")}${num("altre",C.altre,"Altre entrate al mese € (affitto…)")}
    ${num("pens",C.pens!=null?C.pens:D.pensNetta,"Pensione netta al mese €")}
    <label>Ritardo della prima pensione<select data-cs="rit">${[0,1,2,3,4].map(k=>`<option value="${k}"${rit===k?" selected":""}>${k?k+" "+(k===1?"mese":"mesi"):"nessuno"}</option>`).join("")}</select></label>
    <label>Premio di previdenza arriva a<select data-cs="premioMese"><option value="">non contarlo</option>${months.map(ym=>`<option value="${ym}"${pm===ym?" selected":""}>${mm(ym)}</option>`).join("")}</select></label>
    ${num("premio",C.premio!=null?C.premio:D.premio,"Premio di previdenza €")}</div>
    <p class="lbl" style="margin:8px 0 0">La scheda indica: pensione netta ${esc(D.pensForb||"—")}, possibile liquidazione provvisoria con 2–3 mesi di ritardo, premio di previdenza nel secondo semestre 2027, prima rata del TFS fra marzo e giugno 2028.</p></div>`;
  if(!sp&&!sal)return o+`<div class="card k-pens"><p class="empty">Scrivi i soldi disponibili e le spese al mese: qui compare il saldo mese per mese.</p></div>`;
  o+=`<div class="card k-pens"><h3>📉 Saldo mese per mese</h3><div style="overflow-x:auto"><table class="ptab"><thead><tr><th>Mese</th><th>Pensione puntuale</th>${rit?`<th>Con ${rit} ${rit===1?"mese":"mesi"} di ritardo</th>`:""}</tr></thead><tbody>
    ${months.map((ym,i)=>{const a=A.rows[i],b=B.rows[i];const c=v=>`<span class="amt ${v<0?"u":""}">${eur0(v)}</span>`;return `<tr><td>${mm(ym)}</td><td>${c(a.s)}<small>${a.note.join(", ")}</small></td>${rit?`<td>${c(b.s)}<small>${b.note.join(", ")}</small></td>`:""}</tr>`;}).join("")}</tbody></table></div>
    <div class="kpi" style="margin-top:10px"><div><b class="${A.min<0?"amt u":""}">${eur0(A.min)}</b><span>saldo più basso, pensione puntuale (${mm(A.minM)})</span></div>${rit?`<div><b class="${B.min<0?"amt u":""}">${eur0(B.min)}</b><span>saldo più basso con il ritardo (${mm(B.minM)})</span></div>`:""}
    ${Math.min(A.min,B.min)<0?`<div><b class="amt u">${eur0(-Math.min(A.min,B.min))}</b><span>mancano nel mese peggiore</span></div>`:""}</div>
    <p class="lbl" style="margin:8px 0 0">Calcolo con i numeri scritti sopra: entrate meno spese, mese per mese. La tredicesima della pensione è contata a dicembre.</p></div>`;
  return o;
}
/* ---- documenti e scheda ---- */
function pensDoc(){const p=PENS(),files=p.files||[];
  return `<div class="card k-pens"><h3>📎 Documenti</h3>${files.map(f=>`<div class="row"><span class="pill">${/pdf/.test(f.type)?"PDF":/image/.test(f.type)?"🖼️":"📄"}</span><div class="grow"><b>${esc(f.n)}</b><small>${Math.max(1,Math.round(f.size/1024))} KB · ${fmt(f.at.slice(0,10),{day:"numeric",month:"short",year:"numeric"})}</small></div><button class="btn sm" data-pfo2="${f.id}">Apri</button><button class="btn sm" data-pfx2="${f.id}" aria-label="Togli">×</button></div>`).join("")||'<p class="empty">Nessun documento: allega l’analisi previdenziale e i provvedimenti quando arrivano.</p>'}
    <div class="btns"><label class="btn sm pri" style="cursor:pointer">➕ Aggiungi PDF o foto<input type="file" id="pfIn2" accept="application/pdf,image/*" hidden></label></div>
    <p class="lbl" style="margin:8px 0 0">I documenti restano su questo iPad (massimo 15 MB l’uno) ed entrano nelle copie.</p></div>`+pensImport(false);}
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
  document.querySelectorAll("[data-cs]").forEach(i=>i.onchange=()=>{const k=i.dataset.cs;p.cassa[k]=k==="premioMese"?i.value:k==="rit"?+i.value:num(i.value);save();R();});
  bindPens2(p,num);
  const pin=$("pnsIn");if(pin)pin.onchange=async()=>{const f=pin.files&&pin.files[0];pin.value="";if(!f)return;
    try{const o=JSON.parse(await f.text());if(o.app!=="pianificazione-pensione"||!o.pens)throw 0;
      if(pensHas()&&!confirm("Aggiornare la scheda con il file «"+f.name+"»? Le tue spunte, note e importi reali restano."))return;
      pensMerge(o.pens);save();pensV="adem";R();toast("🎖️ Scheda pensione caricata");}catch(e){toast("Questo file non è una scheda pensione");}};
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
    ${late.length?`<div class="row"><div class="grow" style="color:var(--scad)"><b>${late.length} ${late.length===1?"scadenza passata":"scadenze passate"}</b><small>${esc(late[0].t.slice(0,70))}</small></div></div>`:""}
    ${nx.map(a=>`<div class="row"><span class="pill ${diff(t,a.d)<=14?"soon":"pens"}">${fmt(a.d,{day:"numeric",month:"short"})}</span><div class="grow">${esc(a.t.slice(0,80))}</div></div>`).join("")}</div>`;}
/* promemoria per il Calendario dell'iPad */
function pensIcs(t){return P.pens?pensOpen().filter(a=>a.d>=t).map(a=>({uid:"pens-"+a.id,lines:["DTSTART;VALUE=DATE:"+dval(a.d),"DTEND;VALUE=DATE:"+dval(add(a.d,1)),"SUMMARY:"+icsEsc("🎖️ "+a.t),...alarm(7)]})):[];}

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
function pensTimeline(){const L=pensTappe();if(!L.length)return "";
  const t=today(),d0="2026-10-01",d1="2029-07-01",W=1000,H=92,X=s=>20+(W-40)*Math.max(0,Math.min(1,diff(d0,s)/diff(d0,d1)));
  const yrs=["2027-01-01","2028-01-01","2029-01-01"];let svg=`<line x1="20" x2="${W-20}" y1="58" y2="58" stroke="var(--line)" stroke-width="4" stroke-linecap="round"/>`;
  svg+=yrs.map(y=>`<line x1="${X(y)}" x2="${X(y)}" y1="50" y2="66" stroke="var(--muted)" stroke-width="1"/><text x="${X(y)}" y="84" font-size="13" text-anchor="middle" fill="var(--muted)">${y.slice(0,4)}</text>`).join("");
  svg+=`<line x1="20" x2="${X(t)}" y1="58" y2="58" stroke="var(--pens)" stroke-width="4" stroke-linecap="round"/><circle cx="${X(t)}" cy="58" r="6" fill="var(--cal)"/><text x="${X(t)}" y="84" font-size="12" text-anchor="middle" fill="var(--cal)" font-weight="700">oggi</text>`;
  L.forEach((x,i)=>{const a=X(x.da),b=x.a?X(x.a):a,sel=pensTp===x.id,y=i%2?16:30;
    svg+=(x.a?`<rect x="${a}" y="52" width="${Math.max(6,b-a)}" height="12" rx="6" fill="var(--pens)" opacity="${sel?1:.55}" data-tp="${x.id}" style="cursor:pointer"/>`:`<circle cx="${a}" cy="58" r="${sel?8:6}" fill="var(--pens)" stroke="var(--card)" stroke-width="2" data-tp="${x.id}" style="cursor:pointer"/>`)
      +`<text x="${(a+b)/2}" y="${y+12}" font-size="${sel?22:18}" text-anchor="middle" data-tp="${x.id}" style="cursor:pointer">${x.ic||"•"}</text>`;});
  const s=L.find(x=>x.id===pensTp);
  return `<div class="card k-pens" style="padding-bottom:10px"><svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto;display:block" role="img" aria-label="Linea del tempo dal 2026 al 2029">${svg}</svg>
    <div class="btns" style="margin-top:4px">${L.map(x=>`<button class="btn sm${pensTp===x.id?" pri":""}" data-tp="${x.id}">${x.ic||""} ${fmt(x.da,{day:x.a?undefined:"numeric",month:"short",year:"2-digit"})}${x.a?"–"+fmt(x.a,{month:"short",year:"2-digit"}):""}</button>`).join("")}</div>
    ${s?`<p style="margin:8px 2px 0"><b>${s.ic||""} ${esc(s.t)}</b>${s.nota?` <span class="lbl">· ${esc(s.nota)}</span>`:""}</p>`:`<p class="lbl" style="margin:8px 2px 0">Tocca una tappa per i dettagli.</p>`}</div>`;}
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
