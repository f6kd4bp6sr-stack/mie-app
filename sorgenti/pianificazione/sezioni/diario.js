/* ---------- 📓 DIARIO DEL PASSAGGIO: dal servizio alla pensione, una nota al giorno ----------
   Tre fasi (verso l'uscita · il salto · il primo anno) calcolate dalla data dell'ultimo giorno di servizio:
   la prende dalla Pensione (scheda) o dalle Licenze (congedo), oppure la scrivi qui. Nel codice non ci sono date.
   Parti (7/11/2026): 📝 Giorno (nota del giorno con ‹ › e striscia dei giorni, spunto facoltativo della settimana, 🌡️ termometro),
   ⏳ Tappe e lettera, 🔁 Rileggi (note dei giorni e vecchie risposte settimanali, in ordine di data).
   Dati SOLO su questo iPad: localStorage «pn-diario-v1» + copia nel database del dispositivo (voce «diario»).
   Note dei giorni in DIA.giorni["AAAA-MM-GG"]="testo"; risposte settimanali in DIA.sett (restano e si rileggono).
   Le vecchie parti 🌱 Idee, 🧪 Prove, 👫 Insieme non si vedono più, ma i loro dati (DIA.idee, DIA.prove, DIA.insieme) restano così come sono.
   Vanno nella ☁️ copia automatica cifrata; NON nella copia su File/iCloud (che non è cifrata). Domande: sezioni/diario_domande.json */
const DIA_KEY="pn-diario-v1";
const DIA_DEF={v:1,cess:"",sett:{},giorni:{},idee:[],prove:[],insieme:{},tappe:{},lettera:{t:"",sig:null,open:null}};
const DIA_V=[["giorno","📝 Giorno"],["tappe","⏳ Tappe e lettera"],["rileggi","🔁 Rileggi"]];
const DIA_TEMI=Object.keys(DIA_D.temi);
function diaNorm(o){const d=JSON.parse(JSON.stringify(DIA_DEF));if(o&&typeof o==="object"){Object.assign(d,o);
  ["sett","giorni","insieme","tappe"].forEach(k=>{if(!d[k]||typeof d[k]!=="object"||Array.isArray(d[k]))d[k]={};});
  ["idee","prove"].forEach(k=>{if(!Array.isArray(d[k]))d[k]=[];});d.lettera=Object.assign({t:"",sig:null,open:null},o.lettera||{});}return d;}
let DIA=diaNorm(lsJ(DIA_KEY)),diaV="giorno",diaDay=null,diaTema="";
let diaT=null;
function diaSave(msg){DIA.savedAt=new Date().toISOString();const j=JSON.stringify(DIA);try{localStorage.setItem(DIA_KEY,j);}catch(e){}
  clearTimeout(diaT);diaT=setTimeout(()=>{kv("readwrite","diario",j).catch(()=>{});},400);if(msg)toast(msg);}
(async function diaRecover(){if(lsJ(DIA_KEY))return;try{const t=await kv("readonly","diario");if(t){DIA=diaNorm(JSON.parse(t));localStorage.setItem(DIA_KEY,t);if(cur==="dia")render();}}catch(e){}})();
window.addEventListener("storage",e=>{if(e.key===DIA_KEY){DIA=diaNorm(lsJ(DIA_KEY));if(cur==="dia")softRender();}});

/* ---- date e fasi ---- */
function diaCessAuto(){try{return typeof cessAt==="function"?cessAt():"";}catch(e){return "";}}
function diaCess(){return DIA.cess||diaCessAuto()||"";}
function diaFase(t){const c=diaCess();if(!c)return "verso";const n=diff(c,t);return n< -30?"verso":n<=30?"salto":"anno";}
const diaWk=t=>monday(t||today());
const diaQ=id=>DIA_D.domande.find(q=>q.id===id);
const diaTemaOf=wk=>DIA_TEMI[((Math.floor(diff("2026-01-05",wk)/7)%DIA_TEMI.length)+DIA_TEMI.length)%DIA_TEMI.length];
function diaPick(tema,f,wk,skip){const used=new Set(Object.values(DIA.sett).map(x=>x&&x.q).filter(Boolean));
  const pool=DIA_D.domande.filter(q=>q.tema===tema&&q.fase===f&&q.id!==skip);let fresh=pool.filter(q=>!used.has(q.id));
  if(!fresh.length)fresh=pool.length?pool:DIA_D.domande.filter(q=>q.fase===f&&q.id!==skip);
  let h=7;for(const ch of wk)h=(h*31+ch.charCodeAt(0))|0;return fresh[Math.abs(h)%fresh.length];}
/* la domanda di una settimana si fissa la prima volta che si guarda, così resta la stessa per tutta la settimana */
function diaWeekQ(wk){const w=DIA.sett[wk];if(w&&w.q&&diaQ(w.q))return diaQ(w.q);const q=diaPick(diaTemaOf(wk),diaFase(wk),wk);
  if(q&&wk<=diaWk()){DIA.sett[wk]=Object.assign({},w||{},{q:q.id});diaSave();}return q;}
const diaDone=wk=>{const w=DIA.sett[wk];return !!(w&&typeof w.t==="string"&&w.t.trim());};
const diaWords=s=>(String(s||"").trim().match(/\S+/g)||[]).length;
function diaTappe(){const c=diaCess();return c?DIA_D.tappe.map(x=>Object.assign({},x,{dt:add(c,x.giorni)})):[];}
const diaFmtL=s=>fmt(s,{weekday:"long",day:"numeric",month:"long",year:"numeric"});
/* ---- note dei giorni ---- */
const diaNota=d=>{const v=DIA.giorni[d];return typeof v==="string"?v:"";};
const diaHasNota=d=>!!diaNota(d).trim();
const diaSel=()=>{const t=today();return diaDay&&/^\d{4}-\d{2}-\d{2}$/.test(diaDay)&&diaDay<t?diaDay:t;};
function diaSetNota(d,v){if(!/^\d{4}-\d{2}-\d{2}$/.test(d))return;if(String(v).trim())DIA.giorni[d]=String(v);else delete DIA.giorni[d];diaSave();}
function diaMonths(s,n){const p=parse(s),g=p.getDate();p.setDate(1);p.setMonth(p.getMonth()+n);p.setDate(Math.min(g,new Date(p.getFullYear(),p.getMonth()+1,0,12).getDate()));return iso(p);}
/* una nota che si sta scrivendo si salva subito quando si cambia giorno, parte o sezione */
let diaNT=null;
function diaFlush(){if(!diaNT)return;clearTimeout(diaNT);diaNT=null;const ta=document.getElementById("diaNota");if(ta)diaSetNota(ta.dataset.day,ta.value);}
/* entrando nel Diario da un'altra sezione si riparte da oggi */
function diaOpen(){diaDay=null;}
window.addEventListener("pagehide",diaFlush);document.addEventListener("visibilitychange",()=>{if(document.hidden)diaFlush();});

/* ---- vista ---- */
function vDia(){const t=today(),f=diaFase(t),F=DIA_D.fasi[f],c=diaCess();
  if(!DIA_V.some(([k])=>k===diaV))diaV="giorno";
  let o=`<h1>📓 Diario</h1><p class="sub">Dal servizio alla pensione: due righe al giorno, con uno spunto della settimana se ti va, le tappe e la lettera. Qui scrivi solo per te.</p>`;
  o+=`<div class="dia-fasi">${Object.keys(DIA_D.fasi).map(k=>`<span class="pill${k===f?" dia-on":""}">${DIA_D.fasi[k][0]} ${esc(DIA_D.fasi[k][1])}</span>`).join("")}<span class="lbl">${c?`Ultimo giorno di servizio: <b>${fmt(c,{day:"numeric",month:"long",year:"numeric"})}</b> · ${rel(c)}`:"Scrivi in fondo la data dell'ultimo giorno di servizio"}</span></div>`;
  o+=`<div class="seg" role="tablist" style="margin:12px 0 14px;width:max-content;max-width:100%">${DIA_V.map(([k,n])=>`<button role="tab" data-dv="${k}" class="${diaV===k?"on":""}" aria-selected="${diaV===k}">${n}</button>`).join("")}</div>`;
  o+=({giorno:diaGiorno,tappe:diaTappeV,rileggi:diaRileggi}[diaV]||diaGiorno)();
  o+=diaFoot();
  return o;}

function diaStrip(d){const t=today(),wk=diaWk(d);
  return `<div class="dia-strip" role="group" aria-label="Giorni della settimana">${[0,1,2,3,4,5,6].map(i=>{const x=add(wk,i),n=diaHasNota(x);
    return `<button type="button" data-dday="${x}" class="${x===d?"on":""}${x===t?" oggi":""}"${x>t?" disabled":""} aria-label="${esc(diaFmtL(x))}${n?", con nota":""}"${x===d?' aria-current="date"':""}><small>${x===t?"oggi":esc(fmt(x,{weekday:"short"}))}</small><b>${+x.slice(8)}</b><i${n?' class="dot"':""}></i></button>`;}).join("")}</div>`;}
function diaMese(d){const t=today(),m0=d.slice(0,8)+"01",off=(parse(m0).getDay()+6)%7,nd=new Date(+d.slice(0,4),+d.slice(5,7),0,12).getDate(),nextM=add(m0,nd);
  const days=[...Array(nd)].map((_,i)=>d.slice(0,8)+String(i+1).padStart(2,"0")),n=days.filter(diaHasNota).length;
  return `<details class="more dia-mese" data-k="dia-mese"><summary>🗓️ ${esc(parse(m0).toLocaleDateString("it-IT",{month:"long",year:"numeric"}))} · ${n} ${n===1?"nota":"note"}</summary>
    <div class="dia-mnav"><button type="button" class="btn sm" data-dday="${add(m0,-1)}">‹ mese prima</button>${nextM<=t?`<button type="button" class="btn sm" data-dday="${nextM}">mese dopo ›</button>`:""}</div>
    <div class="dia-cal">${["L","M","M","G","V","S","D"].map(x=>`<span class="dia-wh">${x}</span>`).join("")}${"<span></span>".repeat(off)}${days.map(x=>`<button type="button" data-dday="${x}" class="${x===d?"on":""}${x===t?" oggi":""}"${x>t?" disabled":""} aria-label="${esc(diaFmtL(x))}${diaHasNota(x)?", con nota":""}">${+x.slice(8)}${diaHasNota(x)?'<i class="dot"></i>':""}</button>`).join("")}</div></details>`;}

function diaGiorno(){const t=today(),d=diaSel(),isT=d===t,wk=diaWk(d),q=diaWeekQ(wk),w=DIA.sett[wk]||{},T=q?DIA_D.temi[q.tema]:null;
  let o=`<div class="card k-dia nofold dia-day">
    <div class="dia-nav"><button type="button" class="btn" data-dd="-1" aria-label="Giorno prima">‹</button><div class="dia-dt"><b>${esc(diaFmtL(d))}</b><small>${isT?"oggi":esc(rel(d))}${!isT?` · <button type="button" class="lnk" data-dday="${t}">torna a oggi</button>`:""}</small></div><button type="button" class="btn" data-dd="1" aria-label="Giorno dopo"${isT?" disabled":""}>›</button></div>
    ${diaStrip(d)}${diaMese(d)}`;
  if(q)o+=`<div class="dia-spunto"><span class="lbl">💭 Spunto della settimana, se ti va · ${T[0]} ${esc(T[1])}</span><p>${esc(q.t)}</p>${diaDone(wk)?`<details class="more" data-k="dia-risp"><summary>La risposta che avevi scritto per questa settimana</summary><p class="dia-pre">${esc(w.t)}</p></details>`:`<button type="button" class="lnk" id="diaAltra">Un altro spunto</button>`}</div>`;
  o+=`<label class="dia-nl" for="diaNota">📝 Nota del giorno</label>
    <textarea id="diaNota" data-day="${d}" rows="7" placeholder="Com'è andata la giornata? Due righe bastano. Puoi dettare con il microfono della tastiera.">${esc(diaNota(d))}</textarea>
    <div class="dia-bar"><span class="lbl" id="diaInfo">${diaHasNota(d)?"✓ Salvata · "+diaWords(diaNota(d))+" parole":"Si salva da sola mentre scrivi"}</span></div></div>`;
  /* termometro (uno alla settimana, come prima) */
  o+=`<div class="card k-dia"><h3>🌡️ Come sto con il passaggio <span class="lbl">facoltativo</span></h3><div class="dia-temp">${DIA_D.termometro.map(([e,n],i)=>`<button class="${w.temp===i+1?"on":""}" data-temp="${i+1}" aria-label="${esc(n)}"><span>${e}</span><small>${esc(n)}</small></button>`).join("")}</div>${diaTempChart()}${diaGentle()}<p class="lbl" style="margin:6px 0 0">Non è un test e non dà voti: serve solo a vedere l'andamento nel tempo.</p></div>`;
  /* rileggere: lo stesso giorno un mese e un anno fa (o la risposta di quella settimana) */
  const old=[[diaMonths(d,-12),"Un anno fa"],[diaMonths(d,-1),"Un mese fa"]].map(([x,n])=>diaHasNota(x)?{n,b:diaFmtL(x),p:diaNota(x)}:diaDone(diaWk(x))?{n,b:"settimana dal "+fmt(diaWk(x),{day:"numeric",month:"short",year:"numeric"}),s:(diaQ(DIA.sett[diaWk(x)].q)||{}).t,p:DIA.sett[diaWk(x)].t}:null).filter(Boolean);
  if(old.length)o+=`<div class="card k-dia"><h3>🔁 Rileggi</h3>${old.map(x=>`<div class="row dia-old"><div class="grow"><b>${x.n} scrivevi</b><small>${esc(x.b)}${x.s?" · "+esc(x.s):""}</small><p>${esc(x.p)}</p></div></div>`).join("")}</div>`;
  return o;}
function diaTempWeeks(n){const out=[];let wk=diaWk();for(let i=0;i<n;i++){out.unshift(wk);wk=add(wk,-7);}return out;}
function diaTempChart(){const W=diaTempWeeks(26),v=W.map(k=>(DIA.sett[k]||{}).temp||0);if(v.filter(Boolean).length<2)return "";
  const w=600,h=120,x=i=>16+i*(w-32)/(W.length-1),y=n=>h-14-(n-1)*(h-28)/4,pts=v.map((n,i)=>n?[x(i),y(n)]:null).filter(Boolean);
  return `<svg class="dia-chart" viewBox="0 0 ${w} ${h}" role="img" aria-label="Andamento del termometro nelle ultime settimane">${[1,2,3,4,5].map(n=>`<line x1="16" x2="${w-16}" y1="${y(n)}" y2="${y(n)}" stroke="var(--line)"/>`).join("")}<polyline fill="none" stroke="var(--dia)" stroke-width="3" stroke-linejoin="round" points="${pts.map(p=>p.join(",")).join(" ")}"/>${pts.map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="4.5" fill="var(--dia)"/>`).join("")}</svg><div class="dia-ax"><span>26 settimane fa</span><span>questa settimana</span></div>`;}
/* tre settimane di fila con il termometro basso (1 o 2): una riga gentile, nient'altro */
function diaGentle(){const W=diaTempWeeks(3).map(k=>(DIA.sett[k]||{}).temp||0);return W.every(n=>n&&n<=2)?`<p class="dia-gentle">💬 ${esc(DIA_D.gentile)}</p>`:"";}

function diaTappeV(){const t=today(),c=diaCess(),T=diaTappe(),L=DIA.lettera,apre=c?add(c,1):null;
  let o="";
  if(!c)o+=`<div class="card k-dia nofold"><p class="empty">Per le tappe serve la data dell'ultimo giorno di servizio: scrivila in fondo alla pagina.</p></div>`;
  else o+=`<div class="card k-dia"><h3>⏳ Tappe</h3>${T.map(x=>{const r=(DIA.tappe[x.id]||{}).r||[],open=x.dt<=t,fatta=r.some(s=>(s||"").trim());
    return `<div class="row dia-tappa" style="flex-wrap:wrap"><span class="pill${open?" dia-on":""}">${x.ic} ${fmt(x.dt,{day:"numeric",month:"short",year:"numeric"})}</span><div class="grow"><b>${esc(x.n)}</b>${open?(fatta?" <small>✓ fatta</small>":` <small>aperta</small>`):`<small>si apre ${rel(x.dt)}</small>`}
      ${open?`<div class="dia-tq">${x.d.map((q,i)=>`<label><span>${esc(q)}</span><textarea data-tp="${x.id}" data-ti="${i}" rows="2">${esc(r[i]||"")}</textarea></label>`).join("")}<button class="btn sm pri" data-tpok="${x.id}">Salva</button></div>`:""}</div></div>`;}).join("")}</div>`;
  /* lettera */
  const leggibile=L.sig&&apre&&t>=apre;
  o+=`<div class="card k-dia nofold"><h3>✉️ Lettera a me del giorno dopo</h3>`;
  if(!L.sig)o+=`<p class="lbl" style="margin-top:0">${esc(DIA_D.lettera)} Quando la sigilli, resta chiusa fino al giorno dopo l'ultimo giorno di servizio${apre?` (<b>${fmt(apre,{day:"numeric",month:"long",year:"numeric"})}</b>)`:""}.</p><textarea id="diaLet" rows="8">${esc(L.t||"")}</textarea><div class="dia-bar"><button class="btn" id="diaLetSave">Salva la bozza</button><button class="btn pri" id="diaLetSig"${(L.t||"").trim()?"":" disabled"}>🔒 Sigilla</button></div>`;
  else if(leggibile)o+=`<p class="lbl" style="margin-top:0">Sigillata il ${fmt(L.sig.slice(0,10),{day:"numeric",month:"long",year:"numeric"})}.</p><div class="dia-letter">${esc(L.t).replace(/\n/g,"<br>")}</div>`;
  else o+=`<p class="dia-sealed">🔒 Sigillata il ${fmt(L.sig.slice(0,10),{day:"numeric",month:"long",year:"numeric"})}. ${apre?`Si apre ${diaFmtL(apre)}.`:"Si apre il giorno dopo l'ultimo giorno di servizio."}</p><button class="btn sm" id="diaLetUn">Riaprila per cambiarla</button>`;
  return o+`</div>`;}

/* 🔁 Rileggi: note dei giorni e risposte settimanali insieme, dalla più recente; il filtro «📝 Giorni» mostra solo le note, un tema solo le risposte di quel tema */
function diaRileggi(){const f=diaTema;
  const G=Object.keys(DIA.giorni).filter(k=>/^\d{4}-\d{2}-\d{2}$/.test(k)&&diaHasNota(k)).map(k=>({d:k,g:1})),S=Object.keys(DIA.sett).filter(k=>/^\d{4}-\d{2}-\d{2}$/.test(k)&&diaDone(k)).map(k=>({d:k,g:0}));
  let o=`<div class="seg" role="tablist" style="margin:0 0 12px;width:max-content;max-width:100%"><button data-dt="" class="${f?"":"on"}">Tutti</button><button data-dt="giorni" class="${f==="giorni"?"on":""}">📝 Giorni</button>${DIA_TEMI.map(k=>`<button data-dt="${k}" class="${f===k?"on":""}">${DIA_D.temi[k][0]} ${esc(DIA_D.temi[k][1])}</button>`).join("")}</div>`;
  const R=(f==="giorni"?G:f?S.filter(x=>{const q=diaQ(DIA.sett[x.d].q);return q&&q.tema===f;}):G.concat(S)).sort((a,b)=>a.d<b.d?1:a.d>b.d?-1:b.g-a.g);
  if(!R.length)return o+`<p class="empty">Qui ritrovi le note dei giorni e le risposte della settimana, mese per mese. Per ora non ce ne sono${f?" con questo filtro":""}.</p>`;
  const byM={};R.forEach(x=>{(byM[x.d.slice(0,7)]=byM[x.d.slice(0,7)]||[]).push(x);});
  Object.keys(byM).forEach(m=>{const L=byM[m],cnt={},ng=L.filter(x=>x.g).length;L.forEach(x=>{if(x.g)return;const q=diaQ(DIA.sett[x.d].q);if(q)cnt[q.tema]=(cnt[q.tema]||0)+1;});
    o+=`<div class="card k-dia"><h3>${parse(m+"-01").toLocaleDateString("it-IT",{month:"long",year:"numeric"})} <span class="lbl">${(ng?["📝 "+ng]:[]).concat(Object.keys(cnt).map(k=>DIA_D.temi[k][0]+" "+cnt[k])).join(" · ")}</span></h3>${L.map(x=>{
      if(x.g){const v=diaNota(x.d);return `<div class="row dia-old"><div class="grow"><b>📝 ${esc(diaFmtL(x.d))}</b><small>nota del giorno · ${diaWords(v)} parole · <button type="button" class="lnk" data-dopen="${x.d}">apri il giorno</button></small><p>${esc(v)}</p></div></div>`;}
      const w=DIA.sett[x.d],q=diaQ(w.q),tp=w.temp&&DIA_D.termometro[w.temp-1]?DIA_D.termometro[w.temp-1][0]:"";return `<div class="row dia-old"><div class="grow"><b>${q?DIA_D.temi[q.tema][0]+" "+esc(q.t):"Domanda della settimana"}</b><small>risposta della settimana dal ${fmt(x.d,{day:"numeric",month:"short"})}${tp?" · "+tp:""} · ${diaWords(w.t)} parole</small><p>${esc(w.t)}</p></div></div>`;}).join("")}</div>`;});
  return o;}

function diaFoot(){const auto=diaCessAuto(),cb=lsJ("pn-copia-cloud"),on=!!(cb&&cb.gist&&!cb.err);
  return `<details class="more dia-foot"><summary>⚙️ Data e privacy del diario</summary><div class="card k-dia nofold"><div class="form"><label>Ultimo giorno di servizio<input type="date" id="diaCess" value="${esc(DIA.cess||"")}"></label><button class="btn" id="diaCessOk">Salva</button></div>
    <p class="lbl">${DIA.cess?"Data scritta qui.":auto?"Data presa da "+((P.pens&&P.pens.dati&&P.pens.dati.cess)?"🎖️ Pensione":"📅 Licenze (congedo)")+": "+fmt(auto,{day:"numeric",month:"long",year:"numeric"})+". Se la scrivi qui, vale questa.":"Nessuna data in Pensione o in Licenze: scrivila qui."}</p>
    <p class="lbl">🔒 Il diario resta su questo iPad. Va nella <b>☁️ copia automatica cifrata</b>${on?" (attiva)":" (oggi non è attiva: attivala in ⚙️ Impostazioni, altrimenti il diario è solo su questo iPad)"}; non va nella copia su File/iCloud, che non è cifrata.</p></div></details>`;}

/* ---- riquadro nel riepilogo di oggi (Calendario): la nota di oggi (mai il testo), le tappe aperte, la lettera ---- */
function diaCard(){const t=today(),rows=[];
  if(diaHasNota(t))rows.push(`<div class="row"><div class="grow"><b>📝 Nota di oggi ✓</b><small>scritta · ${diaWords(diaNota(t))} parole</small></div><button class="btn sm" data-dgo="giorno">Apri</button></div>`);
  else{const q=diaWeekQ(diaWk(t));rows.push(`<div class="row"><div class="grow"><b>📝 Nota di oggi</b><small>ancora da scrivere${q?" · spunto: "+esc(q.t):""}</small></div><button class="btn sm" data-dgo="giorno">Scrivi</button></div>`);}
  diaTappe().filter(x=>x.dt<=t&&!(((DIA.tappe[x.id]||{}).r||[]).some(s=>(s||"").trim()))&&diff(x.dt,t)<=30).forEach(x=>rows.push(`<div class="row"><div class="grow"><b>${x.ic} ${esc(x.n)}</b><small>la tappa è aperta</small></div><button class="btn sm" data-dgo="tappe">Apri</button></div>`));
  const c=diaCess();if(DIA.lettera.sig&&c&&t>=add(c,1)&&!DIA.lettera.open)rows.push(`<div class="row"><div class="grow"><b>✉️ La tua lettera si può aprire</b></div><button class="btn sm" data-dgo="tappe">Leggi</button></div>`);
  return rows.length?`<div class="card k-dia"><h3>📓 Diario <button class="lnk" data-go="dia">Apri ›</button></h3>${rows.join("")}</div>`:"";}

/* ---- promemoria nel Calendario dell'iPad: la domenica sera e le tappe (solo titoli, mai le risposte) ---- */
function diaIcs(t){const c=diaCess(),out=[],sun=add(diaWk(t),6),until=c?add(c,366):add(t,730);
  out.push({uid:"diario-domenica",lines:["DTSTART:"+dval(sun)+"T190000","DTEND:"+dval(sun)+"T191500","SUMMARY:"+icsEsc("📓 Diario: la domanda della settimana"),"RRULE:FREQ=WEEKLY;BYDAY=SU;UNTIL="+dval(until)+"T235959","BEGIN:VALARM","ACTION:DISPLAY","DESCRIPTION:Diario","TRIGGER:PT0M","END:VALARM"]});
  diaTappe().filter(x=>x.dt>=t).forEach(x=>out.push({uid:"diario-tappa-"+x.id,lines:["DTSTART;VALUE=DATE:"+dval(x.dt),"DTEND;VALUE=DATE:"+dval(add(x.dt,1)),"SUMMARY:"+icsEsc("📓 "+x.n),...alarm(0)]}));
  return out;}

/* ---- azioni ---- */
function bindDia(){const R=()=>{diaFlush();render();},q=s=>document.querySelector(s),qa=s=>document.querySelectorAll(s);
  qa("[data-dv]").forEach(b=>b.onclick=()=>{diaV=b.dataset.dv;R();});
  qa("[data-dt]").forEach(b=>b.onclick=()=>{diaTema=b.dataset.dt;R();});
  /* giorno: frecce, striscia, mese */
  const day=s=>{diaFlush();const t=today();diaDay=s&&s<t?s:null;render();};
  qa("[data-dd]").forEach(b=>b.onclick=()=>day(add(diaSel(),+b.dataset.dd)));
  qa("[data-dday]").forEach(b=>b.onclick=()=>day(b.dataset.dday));
  qa("[data-dopen]").forEach(b=>b.onclick=()=>{diaV="giorno";day(b.dataset.dopen);window.scrollTo(0,0);});
  const d=diaSel(),wk=diaWk(d);
  if($("diaAltra"))$("diaAltra").onclick=()=>{const cq=diaWeekQ(wk),n=cq&&diaPick(cq.tema,diaFase(d),wk+"x"+Date.now(),cq.id);if(n){DIA.sett[wk]=Object.assign({},DIA.sett[wk]||{},{q:n.id});diaSave();R();}};
  if($("diaNota")){const ta=$("diaNota"),info=()=>{const i=$("diaInfo");if(i)i.textContent=ta.value.trim()?"✓ Salvata adesso · "+diaWords(ta.value)+" parole":"Si salva da sola mentre scrivi";
      document.querySelectorAll('[data-dday="'+ta.dataset.day+'"]').forEach(b=>{if(b.closest(".dia-strip")){const i2=b.querySelector("i");if(i2)i2.className=ta.value.trim()?"dot":"";}});};
    ta.oninput=()=>{clearTimeout(diaNT);diaNT=setTimeout(()=>{diaNT=null;diaSetNota(ta.dataset.day,ta.value);info();},700);};
    ta.onblur=()=>{if(diaNT){diaFlush();info();}};}
  qa("[data-temp]").forEach(b=>b.onclick=()=>{const v=+b.dataset.temp,w=DIA.sett[wk]||{};DIA.sett[wk]=Object.assign({},w,{temp:w.temp===v?0:v});diaSave();R();});
  /* tappe e lettera */
  qa("[data-tpok]").forEach(b=>b.onclick=()=>{const id=b.dataset.tpok,r=[];qa('[data-tp="'+id+'"]').forEach(t=>{r[+t.dataset.ti]=t.value;});DIA.tappe[id]={r,at:new Date().toISOString()};diaSave("Tappa salvata");R();});
  if($("diaLetSave"))$("diaLetSave").onclick=()=>{DIA.lettera.t=$("diaLet").value;diaSave("Bozza salvata");R();};
  if($("diaLet"))$("diaLet").oninput=()=>{const b=$("diaLetSig");if(b)b.disabled=!$("diaLet").value.trim();};
  if($("diaLetSig"))$("diaLetSig").onclick=()=>{const v=$("diaLet").value;if(!v.trim())return;if(!confirm("Sigillare la lettera? Resterà chiusa fino al giorno dopo l'ultimo giorno di servizio."))return;DIA.lettera.t=v;DIA.lettera.sig=new Date().toISOString();diaSave("✉️ Lettera sigillata");R();};
  if($("diaLetUn"))$("diaLetUn").onclick=()=>{if(!confirm("Riaprire la lettera? Vedrai di nuovo il testo per cambiarla."))return;DIA.lettera.sig=null;diaSave();R();};
  if(DIA.lettera.sig&&diaV==="tappe"&&document.querySelector(".dia-letter")&&!DIA.lettera.open){DIA.lettera.open=new Date().toISOString();diaSave();}
  /* data */
  if($("diaCessOk"))$("diaCessOk").onclick=()=>{DIA.cess=$("diaCess").value||"";diaSave(DIA.cess?"Data salvata":"Torna la data di Pensione o Licenze");R();};
}
/* dal riquadro di oggi: apri una parte precisa del diario (le parti tolte portano al Giorno) */
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-dgo]");if(!b)return;diaV=DIA_V.some(([k])=>k===b.dataset.dgo)?b.dataset.dgo:"giorno";diaDay=null;diaFlush();go("dia");});
