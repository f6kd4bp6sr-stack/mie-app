/* ---------- 📆 CALENDARIO: il punto da cui si parte ----------
   Vista Giorno · Settimana · Mese · Anno · Scadenze. Mostra insieme Licenze e presenze, Scadenze, Pratiche,
   Famiglia, eventi del Calendario dell'iPad, Benessere e Tai Chi, «Il mio mondo» (e i pagamenti, se Conti è visibile).
   Ogni modifica fatta su un giorno scrive nella sezione di origine (Licenze, Scadenze, Famiglia, Benessere, Tai Chi),
   così tutta l'app resta allineata. Il collegamento con il Calendario dell'iPad si imposta in ⚙️ Impostazioni. */
const CV=[["giorno","Giorno"],["sett","Settimana"],["mese","Mese"],["anno","Anno"],["scad","Scadenze"]];
let calV=(()=>{try{const v=localStorage.getItem("pn-calv");return CV.some(x=>x[0]===v)?v:"mese";}catch(e){return "mese";}})();
let calD=today(), calSel=today(), calFixed=false, calAdd="", calOpenLav=false, calEdit=null;
const setCalV=v=>{calV=v;try{localStorage.setItem("pn-calv",v);}catch(e){}};
const MESI_L=["gennaio","febbraio","marzo","aprile","maggio","giugno","luglio","agosto","settembre","ottobre","novembre","dicembre"];
const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
const LKEY="licenze-marco-v1";
const CODES=[["P","🏢","In ufficio"],["LP","🏖️","Licenza anni prec."],["LO","🏖️","Licenza anno in corso"],["RL","🔁","Recupero festivo"],["AL","📝","Altra assenza"]];

/* ---- scrittura nelle Licenze (stessa memoria della sezione Licenze: browser + database del dispositivo) ---- */
function licWrite(fn){const s=lsJ(LKEY);if(!s)return false;s.days=s.days||{};fn(s);s.savedAt=new Date().toISOString();const t=JSON.stringify(s);
  try{localStorage.setItem(LKEY,t);}catch(e){return false;}kv("readwrite","stato",t).catch(()=>{});return true;}
function licEditable(S,s){const st=S.start||today();return s>=st&&s<=S.end&&kind(s)==="LAV"&&s!==S.end;}
function licSetCode(s,c){return licWrite(S=>{const d=S.days[s]||{},from=d.c||"P";if(from===c)return;if(c==="P")delete d.c;else d.c=c;
  if(Object.keys(d).length)S.days[s]=d;else delete S.days[s];S.log=(S.log||[]);S.log.push({t:new Date().toISOString(),s,from,to:c});if(S.log.length>60)S.log=S.log.slice(-60);});}
function licSetField(s,k,v){return licWrite(S=>{const d=S.days[s]||{};if(v)d[k]=v;else delete d[k];if(Object.keys(d).length)S.days[s]=d;else delete S.days[s];});}
function licOver(S){ // giorni di licenza oltre i saldi (stesso ordine di consumo della sezione Licenze)
  const st=S.start||today(),b=Object.assign({},S.bal);let over=0;
  for(let s=st;s<=S.end;s=add(s,1)){if(kind(s)!=="LAV")continue;const c=(S.days[s]&&S.days[s].c)||"P",y27=s>="2027-01-01";
    if(c==="LP"){if(b.lo25>0)b.lo25--;else if(y27&&b.lo26>0)b.lo26--;else over++;}
    else if(c==="LO"){if(!y27){if(b.lo26>0)b.lo26--;else over++;}else if(b.lo27>0)b.lo27--;else over++;}
    else if(c==="RL"){if(b.rl26>0)b.rl26--;else if(y27&&b.rl27>0)b.rl27--;else over++;}}
  return over;}

/* ---- «Il mio mondo»: giorni di studio e diario (dai Progressi) ---- */
function valeCal(){const p=lsJ("prog-vale-v1"),inb=lsJ(VIN),d=p?((p.state&&p.state.data)||p.data||{}):{};
  const days=new Set([].concat(Array.isArray(d.days)?d.days:[],inb&&Array.isArray(inb.days)?inb.days:[]).map(x=>{const m=String(x).match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);return m?m[1]+"-"+m[2].padStart(2,"0")+"-"+m[3].padStart(2,"0"):String(x);}));
  return{days,diary:d.diary&&typeof d.diary==="object"?d.diary:{}};}
const VMOOD={felice:["😄","felice"],serena:["😊","serena"],orgogliosa:["🤩","orgogliosa"],carica:["💪","carica"],cosi:["😐","così così"],stanca:["😴","stanca"],triste:["😢","triste"],arrabbiata:["😠","arrabbiata"],preoccupata:["😟","preoccupata"]};
const VDOWN=new Set(["triste","arrabbiata","preoccupata"]);

/* ---- tutto quello che c'è in un giorno ---- */
function scadOn(s){const out=[];scadOpen().forEach(x=>{let d=x.d,g=0;while(d&&d<s&&g++<400){d=nextDate(d,x.ric);}if(d===s)out.push({x,proj:d!==x.d});});return out;}
function tcOn(s){return tcSessions().filter(x=>x.d===s);}
function dayData(s,V){
  const S=licS(),L=S?licDay(S,s):{k:kind(s),c:null,t:""},it=[];
  if(S&&S.ev&&S.ev[s])it.push({ic:"📅",t:S.ev[s],c:"lic",k:"licev"});
  if(S&&s===S.end)it.push({ic:"🎉",t:"Congedo",c:"lic",k:"congedo"});
  if(HOL[s])it.push({ic:"🇮🇹",t:HOL[s],c:"hol",k:"hol"});
  scadOn(s).forEach(o=>it.push({ic:(CAT[o.x.cat]||CAT.altro)[0],t:o.x.t,c:o.proj?"scad proj":scadState(o.x)==="warn"?"scad warn":"scad",k:"scad",id:o.x.id,proj:o.proj,sub:RIC[o.x.ric]&&o.x.ric!=="no"?RIC[o.x.ric]:""}));
  if(CONTI_ON)try{C().ric.forEach(r=>{if(ricDates(r,s,s).length)it.push({ic:r.tipo==="e"?"💰":"💶",t:r.t,amt:(r.tipo==="e"?"+":"−")+euro(r.imp),c:"pay"+(r.tipo==="e"?" in":""),k:"pay",id:r.id});});}catch(e){}
  famOn(s).forEach(a=>it.push({ic:"👨‍👧",t:(a.chi?a.chi+": ":"")+a.t,o:a.o||"",f:a.f||"",c:"fam",k:a.tipo==="att"?"att":"fev",id:a.id,sub:[a.tipo==="att"?(+a.ogni===2?"ogni 2 settimane":"ogni settimana"):"",a.acc?"🚗 "+a.acc:""].filter(Boolean).join(" · ")}));
  if(typeof pensOn==="function")pensOn(s).forEach(a=>it.push({ic:"🎖️",t:a.t,c:"pens",k:"pens",id:a.id}));
  if(typeof cassaOn==="function")cassaOn(s).forEach(x=>it.push(x));
  if(typeof pratOn==="function")pratOn(s).forEach(x=>it.push({ic:"🗂️",t:x.passo.t,c:"prat",k:"prat",id:x.id,sub:x.t}));
  ((P.met&&P.met.inc)||[]).filter(i=>i&&i.d===s).forEach(i=>it.push({ic:"🍽️",t:"Incontro: "+(i.chi||""),o:i.o||"",c:"met",k:"met",sub:i.dove||""}));
  calOn(s).forEach(e=>it.push({ic:calIc(e),t:e.t,o:e.o||"",f:e.f||"",c:"ipad",k:"ipad",sub:[e.cal,e.loc].filter(Boolean).join(" · ")}));
  const dn=(P.dn||{})[s];
  it.sort((a,b)=>(a.o||"99")<(b.o||"99")?-1:(a.o||"99")>(b.o||"99")?1:0);
  const V2=V||valeCal(),vd=V2.diary[s];
  const mg=((P.met&&P.met.g)||{})[s];
  return{S,L,it,dn,met:mg&&mg.s?mg:null,ben:benDay(s),tc:tcOn(s),vstudy:V2.days.has(s),vmood:vd&&typeof vd==="object"&&VMOOD[vd.m]?vd:null};
}
const offDay=L=>L&&(L.k!=="LAV"||(L.c&&L.c!=="P"&&L.c!=="OUT"));

/* ---- vista principale ---- */
function calTitle(){const d=parse(calD);
  if(calV==="giorno")return cap(fmt(calD,{weekday:"long",day:"numeric",month:"long",year:"numeric"}));
  if(calV==="sett"){const m=monday(calD),e=add(m,6);return parse(m).getDate()+(m.slice(5,7)!==e.slice(5,7)?" "+MESI_L[+m.slice(5,7)-1]:"")+" – "+parse(e).getDate()+" "+MESI_L[+e.slice(5,7)-1]+" "+e.slice(0,4);}
  if(calV==="mese")return cap(MESI_L[d.getMonth()])+" "+d.getFullYear();
  if(calV==="scad")return "Scadenze";
  return String(d.getFullYear());}
function calStep(n){const d=parse(calD);
  if(calV==="giorno")calD=add(calD,n);else if(calV==="sett")calD=add(calD,7*n);
  else if(calV==="mese"){d.setDate(1);d.setMonth(d.getMonth()+n);calD=iso(d);}else{d.setFullYear(d.getFullYear()+n);calD=iso(d);}
}
function vCal(){
  if(calFixed)return calFixedView();
  const late=lateN(),sc=calV==="scad";
  let o=`<div class="cal-head"><h1>${sc?"📌":"📆"} ${esc(calTitle())}</h1>
    <div class="cal-ctl"><div class="seg" role="tablist">${CV.map(([k,n])=>`<button role="tab" data-cv="${k}" class="${calV===k?"on":""}" aria-selected="${calV===k}">${n}${k==="scad"&&late?`<span class="n">${late}</span>`:""}</button>`).join("")}</div>
    ${sc?"":`<div class="cal-nav"><button class="btn sm" data-ca="prev" aria-label="Precedente">‹</button><button class="btn sm" data-ca="today">Oggi</button><button class="btn sm" data-ca="next" aria-label="Successivo">›</button></div>`}</div></div>`;
  if(P.cal.wait)o+=`<div class="btns" style="margin:0 0 10px"><button class="btn pri" data-ca="paste">📥 Tocca qui per inserire gli eventi del Calendario</button></div>`;
  o+=icsNag();
  if(!(calV==="giorno"&&calD===today()))o+=ghWarn(); // chiave GitHub scaduta o in scadenza: si vede in ogni vista
  o+=sc?vScad():calV==="giorno"?calDayView(calD):calV==="sett"?calWeekView():calV==="anno"?calYearView():calMonthView();
  if(!sc)o+=`<div class="cal-foot"><button class="btn sm" data-ca="run">🔄 Aggiorna dal Calendario dell’iPad</button><button class="btn sm" data-ca="paste">📥 Incolla dagli appunti</button><button class="btn sm" data-ca="fixed">👨‍👧 Attività fisse</button><button class="btn sm" data-go="set">ℹ️ Come si collega</button>
    ${P.cal.at?`<p class="lbl">Eventi dell’iPad aggiornati ${rel(P.cal.at.slice(0,10))} alle ${new Date(P.cal.at).toLocaleTimeString("it-IT",{hour:"2-digit",minute:"2-digit"})}</p>`:""}</div>`;
  return o;
}
function cellChips(D,max){const it=D.it.filter(x=>x.k!=="hol"),n=it.length,sh=it.slice(0,max);
  return sh.map(x=>`<span class="cc ${x.c}" title="${esc((x.o?x.o+" ":"")+x.t)}">${x.ic} ${esc(x.k==="att"||x.k==="fev"?x.t.replace(/^[^:]{1,20}:\s*/,""):x.t)}</span>`).join("")+(n>max?`<span class="cc more">+${n-max}</span>`:"")+`<span class="md">${it.slice(0,5).map(x=>`<i class="${x.c.split(" ")[0]}"></i>`).join("")}</span>`;}
function cellIcons(D){return (D.vmood?VMOOD[D.vmood.m][0]:"")+(D.tc.length?"🧘":"")+(D.met&&D.met.ok?"🤝":"")+(D.ben.umore?UMORE[D.ben.umore-1]:"")+(D.dn?"📝":"");}
function calMonthView(){
  const d=parse(calD),y=d.getFullYear(),m=d.getMonth(),first=iso(new Date(y,m,1)),last=iso(new Date(y,m+1,0)),t=today(),V=valeCal();
  let s=monday(first),cells="";
  while(s<=last||((parse(s).getDay()+6)%7)!==0){
    const D=dayData(s,V),inM=s.slice(0,7)===first.slice(0,7),lab=D.L&&D.S?(D.L.c==="P"?"":D.L.c&&D.L.c!=="OUT"?D.L.c:""):"";
    cells+=`<button class="mc${inM?"":" out"}${s===t?" today":""}${s===calSel?" sel":""}${offDay(D.L)?(D.L.k==="LAV"?" lic":" we"):""}${HOL[s]?" hol":""}" data-cd="${s}" aria-label="${esc(fmt(s,{weekday:"long",day:"numeric",month:"long"}))}">
      <span class="mn"><b>${parse(s).getDate()}</b>${lab?`<em class="code">${lab}</em>`:""}${HOL[s]?`<em class="holn">${esc(HOL[s])}</em>`:""}</span>${cellChips(D,3)}<span class="mi">${cellIcons(D)}${D.vstudy?"<i class='vs' title='Ha studiato'>🐉</i>":""}</span></button>`;
    s=add(s,1);}
  return `<div class="cal-mo"><div><div class="mgrid">${GIORNI.map(g=>`<div class="mh">${g.slice(0,3)}</div>`).join("")}${cells}</div>
    <p class="lbl cal-leg"><span class="lg lic"></span> licenza / a casa · <span class="lg we"></span> fine settimana e festivi · 🐉 Il mio mondo · 🧘 Tai Chi · 🤝 missione del Metodo · 📝 nota</p></div>
    <div class="cal-side">${dayEditor(calSel,true)}</div></div>`;
}
function calWeekView(){const m=monday(calD),t=today(),V=valeCal();
  return `<div class="week cal-wk">${[...Array(7)].map((_,i)=>{const s=add(m,i),D=dayData(s,V);
    return `<button class="day${s===t?" today":""}${offDay(D.L)&&D.S?" together":""}" data-cday="${s}"><b class="dn">${fmt(s,{weekday:"long",day:"numeric"})}</b>
      ${D.S?`<span class="ev ${D.L.c==="P"?"job":"off"}">${D.L.c==="P"?"🏢 "+esc(D.L.i||"")+"–"+esc(D.L.o||""):"🏡 "+esc(D.L.t)}</span>`:HOL[s]?`<span class="ev off">🇮🇹 ${esc(HOL[s])}</span>`:""}
      ${D.it.filter(x=>x.k!=="hol").map(x=>`<span class="cc ${x.c}">${x.ic} ${esc(x.o?x.o+" ":"")}${esc(x.t)}${x.amt?" "+x.amt:""}</span>`).join("")}
      <span class="mi">${cellIcons(D)}${D.vstudy?"🐉":""}</span></button>`;}).join("")}</div>`;}
function calYearView(){const y=parse(calD).getFullYear(),t=today(),S=licS();
  let o=`<div class="ygrid">`;
  for(let m=0;m<12;m++){const first=iso(new Date(y,m,1)),last=iso(new Date(y,m+1,0));let s=first,cells='<i class="x"></i>'.repeat((parse(first).getDay()+6)%7),nl=0;
    while(s<=last){const L=S?licDay(S,s):{k:kind(s)},hasS=scadOn(s).length,cls=(L.c&&L.c!=="P"&&L.c!=="OUT"&&L.k==="LAV")?"lic":L.k!=="LAV"?"we":"";if(cls==="lic")nl++;
      cells+=`<button class="${cls}${s===t?" today":""}${S&&s===S.end?" end":""}" data-cday="${s}" title="${esc(fmt(s,{weekday:"long",day:"numeric",month:"long"}))}">${parse(s).getDate()}${hasS?"<u></u>":""}</button>`;s=add(s,1);}
    o+=`<div class="ym"><button class="ymt" data-cmon="${first}">${cap(MESI_L[m])}${nl?` <small>${nl} gg a casa</small>`:""}</button><div class="ymg">${["L","M","M","G","V","S","D"].map(g=>`<i class="h">${g}</i>`).join("")}${cells}</div></div>`;}
  return o+`</div><p class="lbl cal-leg"><span class="lg lic"></span> licenza / a casa · <span class="lg we"></span> fine settimana e festivi · <u class="lgu"></u> scadenza · ⭐ congedo. Tocca un mese o un giorno.</p>`;}

/* ---- il giorno: elenco e modifiche ---- */
function dayEditor(s,compact){
  const D=dayData(s),S=D.S,t=today();
  let o=`<div class="card k-cal dayed"><h3>${compact?cap(fmt(s,{weekday:"long",day:"numeric",month:"long"})):"🗓️ In programma"} <span class="pill${s===t?" ok":""}">${rel(s)}</span>${compact?`<button class="lnk" data-cday="${s}">Apri il giorno ›</button>`:""}</h3>`;
  // lavoro
  if(S){const L=D.L,ed=licEditable(S,s);
    o+=`<div class="row"><span class="pill ${L.c==="P"?"":"lp"}">${L.c==="P"?"🏢":L.c==="OUT"?"—":L.k!=="LAV"?"🏡":"🏖️"}</span><div class="grow"><b>${esc(L.c==="P"?"In ufficio":cap(L.t||""))}</b>${L.c==="P"?`<small>${esc(L.i||"")}–${esc(L.o||"")}${(S.days[s]||{}).n?" · "+esc(S.days[s].n):""}</small>`:(S.days[s]||{}).n?`<small>${esc(S.days[s].n)}</small>`:""}</div>${ed?`<button class="btn sm" data-ca="lav">${calOpenLav?"Chiudi":"Cambia"}</button>`:""}</div>`;
    if(ed&&calOpenLav){const c=L.c,d=S.days[s]||{};
      o+=`<div class="lavbox"><div class="codes">${CODES.map(([k,i,n])=>`<button data-lc="${k}" class="${c===k?"on":""}"><b>${i} ${k}</b><small>${n}</small></button>`).join("")}</div>
        ${c==="P"?`<div class="form" style="margin-top:8px"><label>Entrata<input type="time" data-lt="in" value="${esc(L.i||"")}"></label><label>Uscita<input type="time" data-lt="out" value="${esc(L.o||"")}"></label></div>`:""}
        <div class="form" style="margin-top:8px"><label class="wide">Nota sul giorno di lavoro<input data-lt="n" maxlength="140" value="${esc(d.n||"")}" placeholder="facoltativa"></label></div>
        ${(()=>{const S2=licS(),L2=licCalc(S2),ov=licOver(S2);return `<p class="lbl" style="margin:8px 0 0">Licenza ancora da collocare: <b>${L2.unpl}</b> giorni${ov?` · <b style="color:var(--warn)">⚠️ ${ov} ${ov===1?"giorno":"giorni"} oltre i saldi</b>`:""}. Il cambio aggiorna subito la sezione <a href="licenze.html">Licenze</a>.</p>`;})()}</div>`;}}
  else o+=`<div class="row"><div class="grow lbl">Imposta rientro e saldi in <a href="licenze.html">Licenze</a> per vedere qui i giorni di lavoro.</div></div>`;
  // elenco
  const it=D.it;
  o+=it.length?it.map(x=>`<div class="row"><span class="pill cc ${x.c}">${x.o?esc(x.o)+(x.f?"–"+esc(x.f):""):x.ic}</span><div class="grow"><b>${x.o?x.ic+" ":""}${esc(x.t)}</b>${x.sub||x.proj?`<small>${esc([x.sub,x.proj?"prossima volta (si ripete)":""].filter(Boolean).join(" · "))}</small>`:""}</div>${x.amt?`<span class="amt ${/in/.test(x.c)?"e":"u"}">${x.amt}</span>`:""}
    ${x.k==="scad"&&!x.proj?`<button class="chk" data-done="${x.id}" aria-label="Segna fatto">✓</button>`:""}${x.k==="fev"||x.k==="att"?`<button class="btn sm" data-ca="fedit:${x.k}:${x.id}">Modifica</button>`:""}${x.k==="pay"?`<button class="lnk" data-go="conti">Conti ›</button>`:""}${x.k==="prat"?`<button class="lnk" data-psel="${x.id}">Pratica ›</button>`:""}${x.k==="pens"?`<button class="lnk" data-go="pens">Pensione ›</button>`:""}</div>`).join(""):`<p class="empty">Niente in programma.</p>`;
  if(D.dn)o+=`<div class="row"><span class="pill">📝</span><div class="grow">${esc(D.dn)}</div><button class="btn sm" data-ca="add:nota">Modifica</button></div>`;
  // aggiungi
  o+=`<div class="addbar">${[["scad","📌 Scadenza"]].concat(CONTI_ON?[["pay","💶 Pagamento"]]:[],[["fam","👨‍👧 Impegno"],["nota","📝 Nota"]]).map(([k,n])=>`<button class="btn sm${calAdd===k?" pri":""}" data-ca="add:${k}">${n}</button>`).join("")}</div>`;
  if(calAdd==="scad")o+=`<div class="form addf"><label class="wide">Che cosa<input id="caT" maxlength="120" placeholder="es. revisione auto, rinnovo documento"></label><label>Categoria<select id="caC">${Object.entries(CAT).map(([k,v])=>`<option value="${k}">${v[0]} ${v[1]}</option>`).join("")}</select></label><label>Si ripete<select id="caR">${Object.entries(RIC).map(([k,v])=>`<option value="${k}">${v}</option>`).join("")}</select></label><label>Avvisami<select id="caA">${[[0,"il giorno stesso"],[1,"1 giorno prima"],[3,"3 giorni prima"],[7,"1 settimana prima"],[14,"2 settimane prima"],[30,"1 mese prima"]].map(([k,v])=>`<option value="${k}"${k===7?" selected":""}>${v}</option>`).join("")}</select></label><div class="btns wide"><button class="btn pri" data-ca="save:scad">Aggiungi la scadenza</button></div></div>`;
  if(CONTI_ON&&calAdd==="pay")o+=`<div class="form addf"><label>Voce<input id="caT" maxlength="60" placeholder="es. bollo, rata, affitto"></label><label>Importo €<input id="caI" inputmode="decimal" placeholder="0,00"></label><label>Tipo<select id="caTp"><option value="u">uscita</option><option value="e">entrata</option></select></label><label>Si ripete<select id="caF"><option value="1">una volta</option>${Object.entries(FREQ).map(([k,v])=>`<option value="${k}">${v[0]}</option>`).join("")}</select></label><label>Ultima data (facoltativa)<input id="caE" type="date"></label><div class="btns wide"><button class="btn pri" data-ca="save:pay">Aggiungi il pagamento</button></div></div>`;
  if(calAdd==="fam"){const E=calEdit?(calEdit.k==="att"?P.fam.att:P.fam.ev).find(a=>a.id===calEdit.id):null,att=calEdit&&calEdit.k==="att",rip=att?String(+E.ogni===2?2:1):"0";
    o+=`<div class="form addf"><label class="wide">Che cosa<input id="caT" maxlength="80" value="${esc(E?E.t:"")}" placeholder="es. pattinaggio, colloquio con le maestre, gara"></label>
      <label>Chi<input id="caC2" list="chiL2" maxlength="40" value="${esc(E&&E.chi||"")}" placeholder="facoltativo"><datalist id="chiL2">${chiList().map(c=>`<option value="${esc(c)}">`).join("")}</datalist></label>
      <label>Dalle<input id="caO" type="time" value="${esc(E&&E.o||"")}"></label><label>Alle<input id="caF2" type="time" value="${esc(E&&E.f||"")}"></label>
      <label>Si ripete<select id="caRp"${E&&!att?" disabled":""}>${att?"":`<option value="0"${rip==="0"?" selected":""}>una volta</option>`}<option value="1"${rip==="1"?" selected":""}>ogni settimana</option><option value="2"${rip==="2"?" selected":""}>ogni 2 settimane</option></select></label>
      <label>Fino al (se si ripete)<input id="caFi" type="date" value="${esc(E&&E.fino||"")}"></label><label>Chi accompagna<input id="caAc" maxlength="40" value="${esc(E&&E.acc||"")}" placeholder="facoltativo"></label>
      <div class="btns wide"><button class="btn pri" data-ca="save:fam">${E?"Salva le modifiche":"Aggiungi l’impegno"}</button>${E?`<button class="btn" data-ca="fcancel">Annulla</button>`:""}${att?`<button class="btn" data-ca="fskip">Togli solo questo giorno</button>`:""}${E?`<button class="btn danger" data-ca="fdel">${att?"Togli sempre":"Togli"}</button>`:""}</div></div>`;}
  if(calAdd==="nota")o+=`<div class="form addf"><label class="wide">Nota del giorno<textarea id="caN" rows="2" maxlength="300">${esc(D.dn||"")}</textarea></label><div class="btns wide"><button class="btn pri" data-ca="save:nota">Salva la nota</button>${D.dn?'<button class="btn danger" data-ca="save:notadel">Togli</button>':""}</div></div>`;
  // benessere
  if(s<=t){const tm=D.tc.filter(x=>x.s==="mattina").length,tp=D.tc.filter(x=>x.s==="pomeriggio").length;
    o+=`<div class="row ben"><span class="pill ben">🧘</span><div class="grow"><div class="mood sm">${UMORE.map((u,i)=>`<button data-cmood="${i+1}" class="${+D.ben.umore===i+1?"on":""}" aria-label="umore ${i+1}">${u}</button>`).join("")}</div>
      <div class="btns" style="margin-top:6px"><button class="btn sm${tm?" ok":""}" data-tc="mattina">${tm?"✓ ":""}Tai Chi mattino</button><button class="btn sm${tp?" ok":""}" data-tc="pomeriggio">${tp?"✓ ":""}Tai Chi pomeriggio</button></div>
      <details class="benx"><summary>Sonno, passi, energia${D.ben.sonno?" · "+String(D.ben.sonno).replace(".",",")+" h":""}</summary><div class="form">
        <label>Ore di sonno<input data-bf="sonno" type="text" inputmode="decimal" placeholder="es. 7,5" value="${esc(String(D.ben.sonno||"").replace(".",","))}"></label>
        <label>Passi<input data-bf="passi" type="number" inputmode="numeric" step="100" min="0" value="${esc(D.ben.passi||"")}"></label>
        <label>Energia (1–5)<select data-bf="energia"><option value="">—</option>${[1,2,3,4,5].map(n=>`<option${+D.ben.energia===n?" selected":""}>${n}</option>`).join("")}</select></label>
        <label class="wide">Nota su come stai<input data-bf="note" maxlength="200" value="${esc(D.ben.note||"")}" placeholder="facoltativa"></label></div></details></div></div>`;}
  // 🤝 Metodo: la sfida del giorno (si sceglie e si segna nella pagina Metodo)
  if(s<=t){const g=D.met,F=["🙂","😐","😕"];
    if(g)o+=`<div class="row"><span class="pill cc met">🤝</span><div class="grow"><b>${g.ok?"✓ ":""}Missione: ${esc(g.txt||"")}</b><small>${g.ok?[g.f?F[g.f-1]:"",g.t?"«"+esc(g.t)+"»":"fatta"].filter(Boolean).join(" "):"da fare"}</small></div><a class="lnk" href="metodo.html#oggi">Metodo ›</a></div>`;
    else if(s===t)o+=`<div class="row"><span class="pill cc met">🤝</span><div class="grow"><b>Missione del giorno</b><small>Tre carte coperte ti aspettano nel Metodo</small></div><a class="lnk" href="metodo.html#oggi">Pesca ›</a></div>`;}
  // il mio mondo
  if(D.vstudy||D.vmood){const v=D.vmood;
    o+=`<div class="row"><span class="pill">🐉</span><div class="grow"><b>Il mio mondo</b><small>${D.vstudy?"ha studiato":"non ha studiato"}${v?" · diario: "+VMOOD[v.m][0]+" "+VMOOD[v.m][1]+(v.f?" ("+["","pochissimo","un po’","abbastanza","tanto","tantissimo"][Math.min(5,+v.f||0)]+")":""):""}</small>${v&&v.w?`<small class="vw${VDOWN.has(v.m)?" down":""}">«${esc(v.w)}»</small>`:""}</div><a class="lnk" href="progressi.html">Progressi ›</a></div>`;}
  return o+`</div>`;
}
function calDayView(s){
  let o=dayEditor(s,false);
  if(s===today())o+=`<h2>📋 Il riepilogo di oggi</h2>`+vOggi();
  return o;
}

/* ---- azioni ---- */
function bindCal(){
  const R=()=>render();
  if(calFixed)bindFixed();
  document.querySelectorAll("[data-cv]").forEach(b=>b.onclick=()=>{setCalV(b.dataset.cv);if(calV==="giorno")calD=calSel;R();});
  document.querySelectorAll("[data-cd]").forEach(b=>b.onclick=()=>{calSel=b.dataset.cd;calAdd="";calEdit=null;calOpenLav=false;R();
    if(!matchMedia("(min-width:1100px)").matches){const p=document.querySelector(".cal-side");if(p)p.scrollIntoView({behavior:"smooth",block:"start"});}});
  document.querySelectorAll("[data-cday]").forEach(b=>b.onclick=e=>{e.stopPropagation();calSel=calD=b.dataset.cday;setCalV("giorno");calAdd="";calOpenLav=false;R();window.scrollTo(0,0);});
  document.querySelectorAll("[data-cmon]").forEach(b=>b.onclick=()=>{calD=b.dataset.cmon;setCalV("mese");R();});
  document.querySelectorAll("[data-ca]").forEach(b=>b.onclick=()=>{const a=b.dataset.ca,s=calV==="giorno"?calD:calSel;
    if(a==="prev"||a==="next"){calStep(a==="prev"?-1:1);if(calV==="giorno")calSel=calD;return R();}
    if(a==="today"){calD=calSel=today();return R();}
    if(a==="icsgo")return exportIcs(false);
    if(a==="icsnot"){try{localStorage.setItem("pn-icsnag",String(Date.now()+7*864e5));}catch(e){}return R();}
    if(a==="run")return runShortcut();
    if(a==="paste")return pasteCal();
    if(a==="lav"){calOpenLav=!calOpenLav;return R();}
    if(a.startsWith("add:")){const k=a.slice(4);calEdit=null;calAdd=calAdd===k?"":k;R();const f=document.getElementById("caT")||document.getElementById("caN");if(f)f.focus();return;}
    if(a==="save:scad"){const t=$("caT").value.trim();if(!t)return toast("Scrivi che cosa");P.scad.push({id:uid(),t,d:s,cat:$("caC").value,ric:$("caR").value,av:+$("caA").value,note:"",done:false});calAdd="";save();R();return toast("📌 Scadenza aggiunta");}
    if(a==="save:pay"){const t=$("caT").value.trim(),i=parseFloat(String($("caI").value).replace(/\./g,"").replace(",","."));if(!t||!(i>0))return toast("Scrivi voce e importo");
      const f=$("caF").value,one=f==="1";C().ric.push({id:uid(),t,imp:Math.round(i*100)/100,tipo:$("caTp").value,kind:"",freq:one?"m":f,d0:s,fine:one?s:($("caE").value||""),cat:"altro"});calAdd="";save();R();return toast("💶 Pagamento aggiunto in Conti");}
    if(a==="save:fam"){const t=$("caT").value.trim();if(!t)return toast("Scrivi che cosa");const o={t,chi:$("caC2").value.trim(),o:$("caO").value,f:$("caF2").value,acc:$("caAc").value.trim()},rp=$("caRp").value,fi=$("caFi").value;
      if(calEdit){const L=calEdit.k==="att"?P.fam.att:P.fam.ev,E=L.find(x=>x.id===calEdit.id);if(E){Object.assign(E,o);if(calEdit.k==="att"){E.ogni=rp==="2"?2:1;E.fino=fi||"";}}calEdit=null;calAdd="";save();R();return toast("Modificato");}
      if(rp==="0")P.fam.ev.push(Object.assign({id:uid(),d:s},o));else P.fam.att.push(Object.assign({id:uid(),g:(parse(s).getDay()+6)%7+1,dal:s,ogni:rp==="2"?2:1,fino:fi||"",pause:[]},o));
      calAdd="";save();R();return toast(rp==="0"?"👨‍👧 Impegno aggiunto":"👨‍👧 Attività fissa aggiunta");}
    if(a.startsWith("fedit:")){const[,k,id]=a.split(":");calEdit={k,id};calAdd="fam";return R();}
    if(a==="fcancel"){calEdit=null;calAdd="";return R();}
    if(a==="fskip"&&calEdit){const E=P.fam.att.find(x=>x.id===calEdit.id);if(E){(E.pause=E.pause||[]).push({da:s,a:s});}calEdit=null;calAdd="";save();R();return toast("Tolta solo per questo giorno");}
    if(a==="fdel"&&calEdit){if(!confirm(calEdit.k==="att"?"Togliere questa attività da tutte le settimane?":"Togliere questo impegno?"))return;if(calEdit.k==="att")P.fam.att=P.fam.att.filter(x=>x.id!==calEdit.id);else P.fam.ev=P.fam.ev.filter(x=>x.id!==calEdit.id);calEdit=null;calAdd="";save();R();return toast("Tolto");}
    if(a==="fixed"){calFixed=true;R();return window.scrollTo(0,0);}
    if(a==="fixback"){calFixed=false;return R();}
    if(a==="save:nota"||a==="save:notadel"){P.dn=P.dn||{};const v=a==="save:notadel"?"":$("caN").value.trim();if(v)P.dn[s]=v;else delete P.dn[s];calAdd="";save();R();return toast(v?"📝 Nota salvata":"Nota tolta");}
  });
  document.querySelectorAll("[data-lc]").forEach(b=>b.onclick=()=>{const s=calV==="giorno"?calD:calSel;if(licSetCode(s,b.dataset.lc)){toast("Licenze aggiornate");R();}});
  document.querySelectorAll("[data-lt]").forEach(inp=>inp.onchange=()=>{const s=calV==="giorno"?calD:calSel;if(licSetField(s,inp.dataset.lt,inp.value.trim())){toast("Licenze aggiornate");R();}});
  const BF={sonno:v=>{const n=parseFloat(String(v).replace(",","."));return n>0&&n<=16?n:"";},passi:v=>v?+v:"",energia:v=>v?+v:"",note:v=>v.trim()};
  document.querySelectorAll("[data-bf]").forEach(inp=>inp.onchange=()=>{const s=calV==="giorno"?calD:calSel,k=inp.dataset.bf;setBen(s,k,BF[k](inp.value));toast("Salvato");if(k!=="note")setTimeout(R,50);});
  document.querySelectorAll("[data-cmood]").forEach(b=>b.onclick=()=>{const s=calV==="giorno"?calD:calSel,v=+b.dataset.cmood;setBen(s,"umore",+benDay(s).umore===v?"":v);R();toast("Umore salvato");});
  document.querySelectorAll("[data-tc]").forEach(b=>b.onclick=()=>{const s=calV==="giorno"?calD:calSel,k=b.dataset.tc,m=lsJ("tc_sessions")||{};
    const mine=Object.values(m).filter(x=>x&&x.d===s&&x.s===k);
    if(mine.length){const man=mine.filter(x=>x.man);if(!man.length)return toast("Sessione registrata dal Tai Chi: si toglie da lì");man.forEach(x=>delete m[x.id]);toast("Tolta");}
    else{const id="cal-"+s+"-"+k;m[id]={id,d:s,s:k,startedAt:Date.parse(s+"T"+(k==="mattina"?"09:00":"18:00")),planned:0,doneIdx:[],doneEx:[],dur:0,saved:true,man:1,rev:1,updatedAt:Date.now()};toast("🧘 Tai Chi segnato");}
    try{localStorage.setItem("tc_sessions",JSON.stringify(m));}catch(e){}R();});
  document.querySelectorAll("[data-cdel]").forEach(b=>b.onclick=()=>{const[tp,id]=b.dataset.cdel.split(":");if(tp==="fev"){if(!confirm("Togliere questo impegno?"))return;P.fam.ev=P.fam.ev.filter(a=>a.id!==id);save();R();}});
}

/* ---- 👨‍👧 attività fisse della famiglia: elenco, pausa, fine, togli ---- */
function calFixedView(){const L=P.fam.att.slice().sort((a,b)=>(+a.g-+b.g)||((a.o||"")<(b.o||"")?-1:1)),t=today();
  let o=`<div class="btns" style="margin:0 0 6px"><button class="btn sm" data-ca="fixback">‹ Torna al calendario</button></div><h1>👨‍👧 Attività fisse</h1><p class="sub">Le attività che si ripetono ogni settimana. Per aggiungerne una: nel Calendario tocca il primo giorno → «👨‍👧 Impegno» → «Si ripete».</p>`;
  if(!L.length)return o+`<div class="card k-fam"><p class="empty">Nessuna attività fissa.</p></div>`;
  o+=`<div class="card k-fam">${L.map(a=>{const ps=(a.pause||[]).filter(p=>(p.a||p.da)>=t),ended=a.fino&&a.fino<t;
    return `<div class="fx"><div class="row" style="border:0;padding:0"><span class="pill fam">${GIORNI[a.g-1].slice(0,3)} ${esc(a.o||"")}${a.f?"–"+esc(a.f):""}</span><div class="grow"><b>${esc(a.chi?a.chi+": ":"")}${esc(a.t)}</b><small>${+a.ogni===2?"ogni 2 settimane":"ogni settimana"}${a.dal?" dal "+fmt(a.dal,{day:"numeric",month:"short"}):""}${a.fino?(ended?" · finita il ":" · fino al ")+fmt(a.fino,{day:"numeric",month:"short",year:"numeric"}):""}${a.acc?" · 🚗 "+esc(a.acc):""}</small>
      ${ps.length?`<small>⏸️ in pausa: ${ps.map((p,i)=>`${fmt(p.da,{day:"numeric",month:"short"})}${p.a&&p.a!==p.da?" → "+fmt(p.a,{day:"numeric",month:"short"}):""} <button class="lnk" data-fxp="${a.id}:${(a.pause||[]).indexOf(p)}">togli</button>`).join(" · ")}</small>`:""}</div></div>
      <div class="form" style="margin-top:6px"><label>Pausa dal<input type="date" data-fxa="${a.id}"></label><label>al<input type="date" data-fxb="${a.id}"></label><div class="btns"><button class="btn sm" data-fx="pause:${a.id}">⏸️ Metti in pausa</button><button class="btn sm" data-fx="end:${a.id}">Finisce oggi</button><button class="btn sm danger" data-fx="del:${a.id}">Togli</button></div></div></div>`;}).join("")}</div>`;
  return o;}
function bindFixed(){
  document.querySelectorAll("[data-fx]").forEach(b=>b.onclick=()=>{const[k,id]=b.dataset.fx.split(":"),a=P.fam.att.find(x=>x.id===id);if(!a)return;
    if(k==="pause"){const da=document.querySelector(`[data-fxa="${id}"]`).value,al=document.querySelector(`[data-fxb="${id}"]`).value||da;if(!da)return toast("Scegli il primo giorno di pausa");(a.pause=a.pause||[]).push({da,a:al<da?da:al});save();render();return toast("⏸️ In pausa");}
    if(k==="end"){a.fino=today();save();render();return toast("Finisce oggi");}
    if(k==="del"){if(!confirm("Togliere «"+a.t+"» da tutte le settimane?"))return;P.fam.att=P.fam.att.filter(x=>x.id!==id);save();render();return toast("Tolta");}});
  document.querySelectorAll("[data-fxp]").forEach(b=>b.onclick=()=>{const[id,i]=b.dataset.fxp.split(":"),a=P.fam.att.find(x=>x.id===id);if(a&&a.pause){a.pause.splice(+i,1);save();render();}});
}

/* ---- 📆 richiamo: promemoria nuovi da mandare al Calendario dell'iPad (gli avvisi ad app chiusa arrivano solo da lì) ---- */
function icsNews(){try{const opt=P.ics.opt||{abs:true,app:true,scad:true,pens:true,prat:true,pay:true,fam:true};return icsItems(opt).filter(i=>P.ics.sent[i.uid]!==i.sig).length;}catch(e){return 0;}}
function icsNag(){const n=icsNews();if(!n)return "";let snooze=0;try{snooze=+localStorage.getItem("pn-icsnag")||0;}catch(e){}if(Date.now()<snooze)return "";
  const first=!Object.keys(P.ics.sent||{}).length;
  return `<div class="card k-cal icsnag"><div class="row" style="border:0;padding:0"><span style="font-size:24px">📆</span><div class="grow"><b>${first?"Manda i promemoria al Calendario dell’iPad":n+(n===1?" promemoria nuovo o cambiato":" promemoria nuovi o cambiati")+" da mandare al Calendario dell’iPad"}</b><small>Così gli avvisi arrivano anche ad app chiusa (scadenze, pensione, pratiche, licenze, famiglia).</small></div>
    <button class="btn pri sm" data-ca="icsgo">Aggiungi le novità</button><button class="btn sm" data-ca="icsnot">Non ora</button></div></div>`;}
