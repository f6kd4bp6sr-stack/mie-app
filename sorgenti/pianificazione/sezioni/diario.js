/* ---------- 📓 DIARIO DEL PASSAGGIO: dal servizio alla pensione, una domanda alla settimana ----------
   Tre fasi (verso l'uscita · il salto · il primo anno) calcolate dalla data dell'ultimo giorno di servizio:
   la prende dalla Pensione (scheda) o dalle Licenze (congedo), oppure la scrivi qui. Nel codice non ci sono date.
   Parti: 📝 Settimana (domanda, 🌡️ termometro, «un mese fa»), 🌱 Dall'idea all'abitudine, 🧪 Giornate di prova (giorni di licenza),
   👫 Il futuro insieme, ⏳ Tappe e lettera, 🔁 Rileggi.
   Dati SOLO su questo iPad: localStorage «pn-diario-v1» + copia nel database del dispositivo (voce «diario»).
   Vanno nella ☁️ copia automatica cifrata; NON nella copia su File/iCloud (che non è cifrata). Domande: sezioni/diario_domande.json */
const DIA_KEY="pn-diario-v1";
const DIA_DEF={v:1,cess:"",sett:{},idee:[],prove:[],insieme:{},tappe:{},lettera:{t:"",sig:null,open:null}};
const DIA_V=[["sett","📝 Settimana"],["idee","🌱 Idee"],["prove","🧪 Prove"],["insieme","👫 Insieme"],["tappe","⏳ Tappe e lettera"],["rileggi","🔁 Rileggi"]];
const DIA_TEMI=Object.keys(DIA_D.temi);
function diaNorm(o){const d=JSON.parse(JSON.stringify(DIA_DEF));if(o&&typeof o==="object"){Object.assign(d,o);
  ["sett","insieme","tappe"].forEach(k=>{if(!d[k]||typeof d[k]!=="object"||Array.isArray(d[k]))d[k]={};});
  ["idee","prove"].forEach(k=>{if(!Array.isArray(d[k]))d[k]=[];});d.lettera=Object.assign({t:"",sig:null,open:null},o.lettera||{});}return d;}
let DIA=diaNorm(lsJ(DIA_KEY)),diaV="sett",diaIdeaPasso=null,diaProva=null,diaTema="",diaChangeOk=false;
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
const diaDone=wk=>{const w=DIA.sett[wk];return !!(w&&w.t&&w.t.trim());};
const diaWords=s=>(String(s||"").trim().match(/\S+/g)||[]).length;
function diaTappe(){const c=diaCess();return c?DIA_D.tappe.map(x=>Object.assign({},x,{dt:add(c,x.giorni)})):[];}
function diaLeaveDays(from,days){const S=licS();if(!S||typeof licDay!=="function")return[];const out=[];
  for(let s=from,i=0;i<days;i++,s=add(s,1)){if(S.end&&s>S.end)break;const d=licDay(S,s);if(d.k==="LAV"&&d.c&&d.c!=="P")out.push(s);}return out;}
const diaFmtL=s=>fmt(s,{weekday:"long",day:"numeric",month:"long",year:"numeric"});

/* ---- vista ---- */
function vDia(){const t=today(),f=diaFase(t),F=DIA_D.fasi[f],c=diaCess();
  let o=`<h1>📓 Diario del passaggio</h1><p class="sub">Dal servizio alla pensione: una domanda alla settimana, le idee che diventano abitudini, le giornate di prova. Qui scrivi solo per te.</p>`;
  o+=`<div class="dia-fasi">${Object.keys(DIA_D.fasi).map(k=>`<span class="pill${k===f?" dia-on":""}">${DIA_D.fasi[k][0]} ${esc(DIA_D.fasi[k][1])}</span>`).join("")}<span class="lbl">${c?`Ultimo giorno di servizio: <b>${fmt(c,{day:"numeric",month:"long",year:"numeric"})}</b> · ${rel(c)}`:"Scrivi in fondo la data dell'ultimo giorno di servizio"}</span></div>`;
  o+=`<div class="seg" role="tablist" style="margin:12px 0 14px;width:max-content;max-width:100%">${DIA_V.map(([k,n])=>`<button role="tab" data-dv="${k}" class="${diaV===k?"on":""}" aria-selected="${diaV===k}">${n}</button>`).join("")}</div>`;
  o+=({sett:diaSett,idee:diaIdee,prove:diaProve,insieme:diaInsieme,tappe:diaTappeV,rileggi:diaRileggi}[diaV]||diaSett)();
  o+=diaFoot();
  return o;}

function diaSett(){const t=today(),wk=diaWk(t),q=diaWeekQ(wk),w=DIA.sett[wk]||{},T=DIA_D.temi[q.tema],dom=add(wk,6);
  let o=`<div class="card k-dia nofold dia-q"><div class="lbl">${T[0]} ${esc(T[1])} · settimana dal ${fmt(wk,{day:"numeric",month:"short"})} al ${fmt(dom,{day:"numeric",month:"short"})}</div>
    <p class="dia-qt">${esc(q.t)}</p>
    <textarea id="diaTxt" rows="6" placeholder="Scrivi come viene, anche poche righe. Puoi dettare con il microfono della tastiera.">${esc(w.t||"")}</textarea>
    <div class="dia-bar"><button class="btn pri" id="diaSave">Salva</button>${!diaDone(wk)?`<button class="btn sm" id="diaAltra">Un'altra domanda</button>`:""}<span class="lbl" id="diaInfo">${w.at?"Salvata "+rel(w.at.slice(0,10)):""}</span></div></div>`;
  /* termometro */
  o+=`<div class="card k-dia"><h3>🌡️ Come sto con il passaggio <span class="lbl">facoltativo</span></h3><div class="dia-temp">${DIA_D.termometro.map(([e,n],i)=>`<button class="${w.temp===i+1?"on":""}" data-temp="${i+1}" aria-label="${esc(n)}"><span>${e}</span><small>${esc(n)}</small></button>`).join("")}</div>${diaTempChart()}${diaGentle()}<p class="lbl" style="margin:6px 0 0">Non è un test e non dà voti: serve solo a vedere l'andamento nel tempo.</p></div>`;
  /* rileggere */
  const m1=diaWk(add(t,-28)),y1=diaWk(add(t,-364)),old=[[y1,"Un anno fa"],[m1,"Un mese fa"]].filter(([k])=>diaDone(k));
  if(old.length)o+=`<div class="card k-dia"><h3>🔁 Rileggi</h3>${old.map(([k,n])=>{const x=DIA.sett[k],qq=diaQ(x.q);return `<div class="row dia-old"><div class="grow"><b>${n} scrivevi</b><small>${qq?esc(qq.t):""}</small><p>${esc(x.t)}</p></div></div>`;}).join("")}</div>`;
  return o;}
function diaTempWeeks(n){const out=[];let wk=diaWk();for(let i=0;i<n;i++){out.unshift(wk);wk=add(wk,-7);}return out;}
function diaTempChart(){const W=diaTempWeeks(26),v=W.map(k=>(DIA.sett[k]||{}).temp||0);if(v.filter(Boolean).length<2)return "";
  const w=600,h=120,x=i=>16+i*(w-32)/(W.length-1),y=n=>h-14-(n-1)*(h-28)/4,pts=v.map((n,i)=>n?[x(i),y(n)]:null).filter(Boolean);
  return `<svg class="dia-chart" viewBox="0 0 ${w} ${h}" role="img" aria-label="Andamento del termometro nelle ultime settimane">${[1,2,3,4,5].map(n=>`<line x1="16" x2="${w-16}" y1="${y(n)}" y2="${y(n)}" stroke="var(--line)"/>`).join("")}<polyline fill="none" stroke="var(--dia)" stroke-width="3" stroke-linejoin="round" points="${pts.map(p=>p.join(",")).join(" ")}"/>${pts.map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="4.5" fill="var(--dia)"/>`).join("")}</svg><div class="dia-ax"><span>26 settimane fa</span><span>questa settimana</span></div>`;}
/* tre settimane di fila con il termometro basso (1 o 2): una riga gentile, nient'altro */
function diaGentle(){const W=diaTempWeeks(3).map(k=>(DIA.sett[k]||{}).temp||0);return W.every(n=>n&&n<=2)?`<p class="dia-gentle">💬 ${esc(DIA_D.gentile)}</p>`:"";}

function diaIdee(){const L=DIA.idee,st={idea:["💡","Idee"],passo:["👣","Primo passo fatto"],abit:["🔁","Abitudini"]};
  let o=`<div class="card k-dia nofold"><p class="lbl" style="margin-top:0">Ogni progetto per il dopo passa da <b>idea</b> a <b>primo passo fatto</b> (con la data), poi diventa <b>abitudine</b>. Così si vede la differenza tra un piano e una cosa cominciata. Per esempio: Tai Chi al mattino, un turno di volontariato del 🤝 Metodo, un corso, una passeggiata fissa.</p>
    <div class="form"><label class="wide">Nuova idea<input id="diaIdea" maxlength="120" placeholder="che cosa vorresti fare"></label><button class="btn pri" id="diaIdeaAdd">Aggiungi</button></div></div>`;
  o+=`<div class="kpi" style="margin:12px 0">${Object.keys(st).map(k=>`<div><b>${L.filter(x=>x.st===k).length}</b><span>${st[k][0]} ${st[k][1]}</span></div>`).join("")}</div>`;
  Object.keys(st).forEach(k=>{const R=L.filter(x=>x.st===k);if(!R.length)return;
    o+=`<div class="card k-dia"><h3>${st[k][0]} ${st[k][1]}</h3>${R.map(x=>{const ed=diaIdeaPasso===x.id;return `<div class="row dia-idea"><div class="grow"><b>${esc(x.t)}</b>${x.passo&&x.passo.d?`<small>primo passo ${fmt(x.passo.d,{day:"numeric",month:"short",year:"numeric"})}${x.passo.t?": "+esc(x.passo.t):""}</small>`:""}${x.abitDa?`<small>abitudine dal ${fmt(x.abitDa,{day:"numeric",month:"short",year:"numeric"})}</small>`:""}
      ${ed?`<div class="form" style="margin-top:8px"><label>Quando<input type="date" id="diaPD" value="${today()}"></label><label class="wide">Che cosa hai fatto<input id="diaPT" maxlength="160" placeholder="per esempio: mi sono iscritto, ho chiamato, ho provato"></label><button class="btn pri" data-ipok="${x.id}">Salva</button><button class="btn" data-ipno="1">Annulla</button></div>`:""}</div>
      <div class="dia-acts">${k==="idea"&&!ed?`<button class="btn sm pri" data-ipasso="${x.id}">👣 Primo passo</button>`:""}${k==="passo"?`<button class="btn sm ok" data-iabit="${x.id}">🔁 È un'abitudine</button>`:""}${k!=="idea"?`<button class="btn sm" data-iback="${x.id}" aria-label="Torna indietro">↩︎</button>`:""}<button class="btn sm danger" data-idel="${x.id}" aria-label="Togli">✕</button></div></div>`;}).join("")}</div>`;});
  if(!L.length)o+=`<p class="empty">Ancora nessuna idea: scrivi la prima qui sopra.</p>`;
  return o;}

function diaProve(){const t=today(),P2=DIA.prove,next=diaLeaveDays(t,120).filter(d=>!P2.some(p=>p.d===d)).slice(0,6),todo=P2.filter(p=>p.d<=t&&!p.com).sort((a,b)=>a.d<b.d?1:-1),fut=P2.filter(p=>p.d>t).sort((a,b)=>a.d<b.d?-1:1),done=P2.filter(p=>p.com).sort((a,b)=>a.d<b.d?1:-1);
  let o=`<div class="card k-dia nofold"><p class="lbl" style="margin-top:0">Un giorno di licenza diventa una <b>prova del dopo</b>: scegli prima che cosa fare, la sera scrivi com'è andata. I giorni vengono dalle 📅 Licenze; puoi anche scegliere una data a mano.</p>
    ${next.length?`<div class="dia-chips">${next.map(d=>`<button class="btn sm" data-pnew="${d}">🧪 ${fmt(d,{weekday:"short",day:"numeric",month:"short"})}</button>`).join("")}</div>`:`<p class="empty">Nessun giorno di licenza nei prossimi mesi nelle Licenze.</p>`}
    <div class="form" style="margin-top:8px"><label>Un'altra data<input type="date" id="diaPDate" min="${t}"></label><button class="btn" id="diaPOther">Prepara la prova</button></div></div>`;
  if(diaProva){const p=diaProva,id=DIA.idee.filter(x=>x.st!=="abit");
    o+=`<div class="card k-dia nofold"><h3>🧪 Prova di ${diaFmtL(p.d)}</h3><div class="form"><label class="wide">Che cosa farai<textarea id="diaPPiano" rows="3" placeholder="per esempio: mattina al mercato, pranzo fuori, pomeriggio in biblioteca">${esc(p.piano||"")}</textarea></label>${id.length?`<label class="wide">Per provare un'idea (facoltativo)<select id="diaPIdea"><option value="">—</option>${id.map(x=>`<option value="${x.id}"${p.idea===x.id?" selected":""}>${esc(x.t)}</option>`).join("")}</select></label>`:""}<button class="btn pri" id="diaPSave">Salva</button><button class="btn" id="diaPNo">Annulla</button></div></div>`;}
  if(todo.length)o+=`<div class="card k-dia"><h3>💬 Com'è andata?</h3>${todo.map(p=>`<div class="row" style="flex-wrap:wrap"><div class="grow"><b>${diaFmtL(p.d)}</b><small>${esc(p.piano||"")}</small><textarea data-pcom="${p.id}" rows="3" placeholder="com'è andata, che cosa ti è piaciuto, che cosa cambieresti"></textarea></div><button class="btn sm pri" data-pcomok="${p.id}">Salva</button></div>`).join("")}</div>`;
  if(fut.length)o+=`<div class="card k-dia"><h3>📅 Prove in arrivo</h3>${fut.map(p=>`<div class="row"><span class="pill">${fmt(p.d,{weekday:"short",day:"numeric",month:"short"})}</span><div class="grow">${esc(p.piano||"")}${p.idea&&DIA.idee.find(x=>x.id===p.idea)?`<small>🌱 ${esc(DIA.idee.find(x=>x.id===p.idea).t)}</small>`:""}</div><button class="btn sm" data-pedit="${p.id}">✏️</button><button class="btn sm danger" data-pdel="${p.id}" aria-label="Togli">✕</button></div>`).join("")}</div>`;
  if(done.length)o+=`<div class="card k-dia"><h3>✅ Prove fatte (${done.length})</h3>${done.map(p=>`<div class="row dia-old"><div class="grow"><b>${fmt(p.d,{weekday:"short",day:"numeric",month:"long",year:"numeric"})}</b><small>${esc(p.piano||"")}</small><p>${esc(p.com)}</p></div></div>`).join("")}</div>`;
  return o;}

function diaInsieme(){const I=DIA.insieme,n=DIA_D.insieme.filter(x=>(I[x.id]||"").trim()).length;
  let o=`<div class="card k-dia nofold"><p class="lbl" style="margin-top:0">Tracce da usare in due, con calma: si scrive quello che decidete o che vi viene in mente, anche un poco alla volta. Con «Condividi» il testo si manda come messaggio.</p></div>`;
  o+=`<div class="card k-dia nofold">${DIA_D.insieme.map(x=>`<label class="dia-ins"><b>${esc(x.t)}</b><textarea data-ins="${x.id}" rows="3">${esc(I[x.id]||"")}</textarea></label>`).join("")}
    <div class="dia-bar"><button class="btn pri" id="diaInsSave">Salva</button><button class="btn" id="diaInsShare"${n?"":" disabled"}>📤 Condividi</button><span class="lbl">${n} tracce su ${DIA_D.insieme.length}</span></div></div>`;
  return o;}

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

function diaRileggi(){const W=Object.keys(DIA.sett).filter(diaDone).sort().reverse(),f=diaTema;
  let o=`<div class="seg" role="tablist" style="margin:0 0 12px;width:max-content;max-width:100%"><button data-dt="" class="${f?"":"on"}">Tutti</button>${DIA_TEMI.map(k=>`<button data-dt="${k}" class="${f===k?"on":""}">${DIA_D.temi[k][0]} ${esc(DIA_D.temi[k][1])}</button>`).join("")}</div>`;
  const R=W.filter(k=>{const q=diaQ(DIA.sett[k].q);return !f||(q&&q.tema===f);});
  if(!R.length)return o+`<p class="empty">Qui ritrovi tutte le risposte, mese per mese. Per ora non ce ne sono${f?" su questo tema":""}.</p>`;
  const byM={};R.forEach(k=>{(byM[k.slice(0,7)]=byM[k.slice(0,7)]||[]).push(k);});
  Object.keys(byM).forEach(m=>{const L=byM[m],cnt={};L.forEach(k=>{const q=diaQ(DIA.sett[k].q);if(q)cnt[q.tema]=(cnt[q.tema]||0)+1;});
    o+=`<div class="card k-dia"><h3>${parse(m+"-01").toLocaleDateString("it-IT",{month:"long",year:"numeric"})} <span class="lbl">${Object.keys(cnt).map(k=>DIA_D.temi[k][0]+" "+cnt[k]).join(" · ")}</span></h3>${L.map(k=>{const x=DIA.sett[k],q=diaQ(x.q),tp=x.temp?DIA_D.termometro[x.temp-1][0]:"";return `<div class="row dia-old"><div class="grow"><b>${q?DIA_D.temi[q.tema][0]+" "+esc(q.t):""}</b><small>settimana dal ${fmt(k,{day:"numeric",month:"short"})}${tp?" · "+tp:""} · ${diaWords(x.t)} parole</small><p>${esc(x.t)}</p></div></div>`;}).join("")}</div>`;});
  return o;}

function diaFoot(){const auto=diaCessAuto(),cb=lsJ("pn-copia-cloud"),on=!!(cb&&cb.gist&&!cb.err);
  return `<details class="more dia-foot"><summary>⚙️ Data e privacy del diario</summary><div class="card k-dia nofold"><div class="form"><label>Ultimo giorno di servizio<input type="date" id="diaCess" value="${esc(DIA.cess||"")}"></label><button class="btn" id="diaCessOk">Salva</button></div>
    <p class="lbl">${DIA.cess?"Data scritta qui.":auto?"Data presa da "+((P.pens&&P.pens.dati&&P.pens.dati.cess)?"🎖️ Pensione":"📅 Licenze (congedo)")+": "+fmt(auto,{day:"numeric",month:"long",year:"numeric"})+". Se la scrivi qui, vale questa.":"Nessuna data in Pensione o in Licenze: scrivila qui."}</p>
    <p class="lbl">🔒 Il diario resta su questo iPad. Va nella <b>☁️ copia automatica cifrata</b>${on?" (attiva)":" (oggi non è attiva: attivala in ⚙️ Impostazioni, altrimenti il diario è solo su questo iPad)"}; non va nella copia su File/iCloud, che non è cifrata.</p></div></details>`;}

/* ---- riquadro nel riepilogo di oggi (Calendario) ---- */
function diaCard(){const t=today(),wk=diaWk(t),rows=[];
  if(!diaDone(wk)){const q=diaWeekQ(wk);if(q)rows.push(`<div class="row"><div class="grow"><b>📝 Domanda della settimana</b><small>${esc(q.t)}</small></div><button class="btn sm" data-go="dia">Scrivi</button></div>`);}
  const pv=DIA.prove.find(p=>p.d===t);if(pv)rows.push(`<div class="row"><div class="grow"><b>🧪 Oggi è una giornata di prova</b><small>${esc(pv.piano||"")}</small></div><button class="btn sm" data-dgo="prove">Apri</button></div>`);
  diaTappe().filter(x=>x.dt<=t&&!(((DIA.tappe[x.id]||{}).r||[]).some(s=>(s||"").trim()))&&diff(x.dt,t)<=30).forEach(x=>rows.push(`<div class="row"><div class="grow"><b>${x.ic} ${esc(x.n)}</b><small>la tappa è aperta</small></div><button class="btn sm" data-dgo="tappe">Apri</button></div>`));
  const c=diaCess();if(DIA.lettera.sig&&c&&t>=add(c,1)&&!DIA.lettera.open)rows.push(`<div class="row"><div class="grow"><b>✉️ La tua lettera si può aprire</b></div><button class="btn sm" data-dgo="tappe">Leggi</button></div>`);
  return rows.length?`<div class="card k-dia"><h3>📓 Diario <button class="lnk" data-go="dia">Apri ›</button></h3>${rows.join("")}</div>`:"";}

/* ---- promemoria nel Calendario dell'iPad: la domenica sera e le tappe (solo titoli, mai le risposte) ---- */
function diaIcs(t){const c=diaCess(),out=[],sun=add(diaWk(t),6),until=c?add(c,366):add(t,730);
  out.push({uid:"diario-domenica",lines:["DTSTART:"+dval(sun)+"T190000","DTEND:"+dval(sun)+"T191500","SUMMARY:"+icsEsc("📓 Diario: la domanda della settimana"),"RRULE:FREQ=WEEKLY;BYDAY=SU;UNTIL="+dval(until)+"T235959","BEGIN:VALARM","ACTION:DISPLAY","DESCRIPTION:Diario","TRIGGER:PT0M","END:VALARM"]});
  diaTappe().filter(x=>x.dt>=t).forEach(x=>out.push({uid:"diario-tappa-"+x.id,lines:["DTSTART;VALUE=DATE:"+dval(x.dt),"DTEND;VALUE=DATE:"+dval(add(x.dt,1)),"SUMMARY:"+icsEsc("📓 "+x.n),...alarm(0)]}));
  return out;}

/* ---- azioni ---- */
function bindDia(){const R=()=>render(),q=s=>document.querySelector(s),qa=s=>document.querySelectorAll(s);
  qa("[data-dv]").forEach(b=>b.onclick=()=>{diaV=b.dataset.dv;diaIdeaPasso=null;diaProva=null;R();});
  qa("[data-dt]").forEach(b=>b.onclick=()=>{diaTema=b.dataset.dt;R();});
  const wk=diaWk();
  if($("diaSave"))$("diaSave").onclick=()=>{const v=$("diaTxt").value;DIA.sett[wk]=Object.assign({},DIA.sett[wk]||{},{t:v,at:new Date().toISOString()});diaSave(v.trim()?"Risposta salvata":"Salvato");R();};
  if($("diaAltra"))$("diaAltra").onclick=()=>{const cq=diaWeekQ(wk),n=diaPick(cq.tema,diaFase(today()),wk+"x"+Date.now(),cq.id);if(n){DIA.sett[wk]=Object.assign({},DIA.sett[wk]||{},{q:n.id});diaSave();R();}};
  if($("diaTxt")){const ta=$("diaTxt");let tt=null;ta.oninput=()=>{clearTimeout(tt);tt=setTimeout(()=>{DIA.sett[wk]=Object.assign({},DIA.sett[wk]||{},{t:ta.value,at:new Date().toISOString()});diaSave();const i=$("diaInfo");if(i)i.textContent="Salvata adesso";},1200);};}
  qa("[data-temp]").forEach(b=>b.onclick=()=>{const v=+b.dataset.temp,w=DIA.sett[wk]||{};const ta=$("diaTxt");DIA.sett[wk]=Object.assign({},w,{temp:w.temp===v?0:v},ta?{t:ta.value}:{});diaSave();R();});
  /* idee */
  if($("diaIdeaAdd"))$("diaIdeaAdd").onclick=()=>{const v=$("diaIdea").value.trim();if(!v){toast("Scrivi l'idea");return;}DIA.idee.push({id:uid(),t:v,st:"idea",at:today()});diaSave("Idea aggiunta");R();};
  if($("diaIdea"))$("diaIdea").onkeydown=e=>{if(e.key==="Enter")$("diaIdeaAdd").click();};
  const I=id=>DIA.idee.find(x=>x.id===id);
  qa("[data-ipasso]").forEach(b=>b.onclick=()=>{diaIdeaPasso=b.dataset.ipasso;R();});
  qa("[data-ipno]").forEach(b=>b.onclick=()=>{diaIdeaPasso=null;R();});
  qa("[data-ipok]").forEach(b=>b.onclick=()=>{const x=I(b.dataset.ipok);if(!x)return;x.st="passo";x.passo={d:$("diaPD").value||today(),t:$("diaPT").value.trim()};diaIdeaPasso=null;diaSave("👣 Primo passo segnato");R();});
  qa("[data-iabit]").forEach(b=>b.onclick=()=>{const x=I(b.dataset.iabit);if(!x)return;x.st="abit";x.abitDa=today();diaSave("🔁 Ora è un'abitudine");R();});
  qa("[data-iback]").forEach(b=>b.onclick=()=>{const x=I(b.dataset.iback);if(!x)return;if(x.st==="abit"){x.st="passo";delete x.abitDa;}else{x.st="idea";delete x.passo;}diaSave();R();});
  qa("[data-idel]").forEach(b=>b.onclick=()=>{if(!confirm("Togliere questa idea?"))return;DIA.idee=DIA.idee.filter(x=>x.id!==b.dataset.idel);diaSave();R();});
  /* prove */
  const pNew=d=>{diaProva={id:uid(),d};R();setTimeout(()=>{const e=$("diaPPiano");if(e){e.focus();e.scrollIntoView({block:"center"});}},50);};
  qa("[data-pnew]").forEach(b=>b.onclick=()=>pNew(b.dataset.pnew));
  if($("diaPOther"))$("diaPOther").onclick=()=>{const d=$("diaPDate").value;if(!d){toast("Scegli la data");return;}pNew(d);};
  if($("diaPNo"))$("diaPNo").onclick=()=>{diaProva=null;R();};
  if($("diaPSave"))$("diaPSave").onclick=()=>{const p=diaProva,old=DIA.prove.find(x=>x.id===p.id),v={id:p.id,d:p.d,piano:$("diaPPiano").value.trim(),idea:$("diaPIdea")?$("diaPIdea").value:"",com:old?old.com:""};
    DIA.prove=DIA.prove.filter(x=>x.id!==p.id).concat([v]);diaProva=null;diaSave("🧪 Prova salvata");R();};
  qa("[data-pedit]").forEach(b=>b.onclick=()=>{const p=DIA.prove.find(x=>x.id===b.dataset.pedit);if(p){diaProva=Object.assign({},p);R();}});
  qa("[data-pdel]").forEach(b=>b.onclick=()=>{if(!confirm("Togliere questa prova?"))return;DIA.prove=DIA.prove.filter(x=>x.id!==b.dataset.pdel);diaSave();R();});
  qa("[data-pcomok]").forEach(b=>b.onclick=()=>{const p=DIA.prove.find(x=>x.id===b.dataset.pcomok),ta=q('[data-pcom="'+b.dataset.pcomok+'"]');if(!p||!ta||!ta.value.trim()){toast("Scrivi com'è andata");return;}p.com=ta.value.trim();p.at=today();diaSave("Salvato");R();});
  /* insieme */
  const insRead=()=>qa("[data-ins]").forEach(t=>{DIA.insieme[t.dataset.ins]=t.value;});
  if($("diaInsSave"))$("diaInsSave").onclick=()=>{insRead();diaSave("Salvato");R();};
  if($("diaInsShare"))$("diaInsShare").onclick=async()=>{insRead();diaSave();const txt="Il futuro insieme\n\n"+DIA_D.insieme.filter(x=>(DIA.insieme[x.id]||"").trim()).map(x=>"• "+x.t+"\n"+DIA.insieme[x.id].trim()).join("\n\n");
    try{if(navigator.share){await navigator.share({title:"Il futuro insieme",text:txt});return;}}catch(e){if(e&&e.name==="AbortError")return;}
    try{await navigator.clipboard.writeText(txt);toast("Testo copiato: incollalo in un messaggio");}catch(e){toast("Condivisione non disponibile qui");}};
  /* tappe e lettera */
  qa("[data-tpok]").forEach(b=>b.onclick=()=>{const id=b.dataset.tpok,r=[];qa('[data-tp="'+id+'"]').forEach(t=>{r[+t.dataset.ti]=t.value;});DIA.tappe[id]={r,at:new Date().toISOString()};diaSave("Tappa salvata");R();});
  if($("diaLetSave"))$("diaLetSave").onclick=()=>{DIA.lettera.t=$("diaLet").value;diaSave("Bozza salvata");R();};
  if($("diaLet"))$("diaLet").oninput=()=>{const b=$("diaLetSig");if(b)b.disabled=!$("diaLet").value.trim();};
  if($("diaLetSig"))$("diaLetSig").onclick=()=>{const v=$("diaLet").value;if(!v.trim())return;if(!confirm("Sigillare la lettera? Resterà chiusa fino al giorno dopo l'ultimo giorno di servizio."))return;DIA.lettera.t=v;DIA.lettera.sig=new Date().toISOString();diaSave("✉️ Lettera sigillata");R();};
  if($("diaLetUn"))$("diaLetUn").onclick=()=>{if(!confirm("Riaprire la lettera? Vedrai di nuovo il testo per cambiarlo."))return;DIA.lettera.sig=null;diaSave();R();};
  if(DIA.lettera.sig&&diaV==="tappe"&&document.querySelector(".dia-letter")&&!DIA.lettera.open){DIA.lettera.open=new Date().toISOString();diaSave();}
  /* data */
  if($("diaCessOk"))$("diaCessOk").onclick=()=>{DIA.cess=$("diaCess").value||"";diaSave(DIA.cess?"Data salvata":"Torna la data di Pensione o Licenze");R();};
}
/* dal riquadro di oggi: apri una parte precisa del diario */
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-dgo]");if(!b)return;diaV=b.dataset.dgo;go("dia");});
