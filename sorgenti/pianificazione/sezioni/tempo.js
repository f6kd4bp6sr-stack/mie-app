/* ---------- 🎟️ TEMPO LIBERO (7/11/2026, «Leggere, vedere, fare» accorpato con cinema e teatro) ----------
   Liste personali in P.tl.voci: 📚 Libri, 🎬 Film e serie, 🎭 Teatro e concerti, 🎵 Musica e podcast, ✅ Cose da fare.
   Ogni voce: si aggiunge con il solo titolo; stato voglio → in corso → fatto il…, stelle e «che cosa mi resta».
   Una data va nelle Scadenze del Calendario (id "tl-…"); un costo si prova nella Cassa (uscita una tantum, id "tl-…").
   🎟️ In programma a Torino: cinema (The Space e Ideal), teatro, concerti ed eventi presi dalla 🗞️ Stampa di oggi,
   con ➕ Voglio andarci (lo stesso tasto c'è anche nella Stampa). 🎲 Stasera? e 🏆 Il mio anno.
   I dati stanno solo sull'iPad e nella copia automatica: nel codice non c'è nessun titolo o nome. */
const TL_L=[["libri","📚","Libri","da leggere"],["film","🎬","Film e serie","da vedere"],["palco","🎭","Teatro e concerti","dal vivo"],["musica","🎵","Musica e podcast","da ascoltare"],["fare","✅","Cose da fare","mostre, musei, posti, esperienze"]];
const TL_ST=[["voglio","💭","voglio"],["corso","▶️","in corso"],["fatto","✅","fatto"]];
const TL_V=[["liste","📋 Le mie liste"],["prog","🎟️ In programma a Torino"],["sera","🎲 Stasera?"],["anno","🏆 Il mio anno"]];
const TL_BIBLIO="https://bct.comperio.it/"; /* catalogo delle Biblioteche civiche torinesi (indirizzo dal vademecum ufficiale BCT, verificato il 7/11/2026) */
let tlV="liste",tlEd=null,tlFatti={},tlSera=null;
function TL(){if(!P.tl||typeof P.tl!=="object")P.tl={v:1,voci:[]};if(!Array.isArray(P.tl.voci))P.tl.voci=[];return P.tl;}
const tlL=k=>TL_L.find(x=>x[0]===k)||TL_L[4];
const tlGet=id=>TL().voci.find(v=>v.id===id);
const tlStI=s=>(TL_ST.find(x=>x[0]===s)||TL_ST[0])[1];
const tlStars=n=>n?"★".repeat(n)+"☆".repeat(5-n):"";
const tlFd=d=>d?fmt(d,{day:"numeric",month:"short",year:"numeric"}):"";
const tlNum=x=>{const n=parseFloat(String(x||"").replace(/\./g,"").replace(",","."));return isFinite(n)?n:0;};
/* riga di dettaglio di una voce: solo i campi compilati */
function tlInfo(v){const a=[];
  if(v.aut)a.push(esc(v.aut));
  if(v.l==="libri"&&v.pag)a.push(`pag. ${esc(v.pag)}${v.tot?" di "+esc(v.tot):""}`);
  if(v.l==="film"&&v.tipo==="serie"&&(v.sta||v.epi))a.push(`stagione ${esc(v.sta||"?")}, ep. ${esc(v.epi||"?")}`);
  if(v.l==="musica"&&v.punt)a.push("puntata "+esc(v.punt));
  if(v.dovev)a.push(esc(v.dovev));
  if(v.quando)a.push("📅 "+tlFd(v.quando)+(v.ora?" alle "+esc(v.ora):""));else if(v.qt)a.push("📅 "+esc(v.qt));
  if(v.dove)a.push("📍 "+esc(v.dove));
  if(v.l==="palco"&&v.bigl)a.push("🎫 biglietto preso");
  if(v.prestA)a.push("📤 prestato a "+esc(v.prestA));
  if(v.presoDa)a.push("📥 da restituire a "+esc(v.presoDa));
  if(v.cons)a.push("💬 consigliato da "+esc(v.cons));
  if(v.st==="fatto")a.push((v.fatto?"fatto il "+tlFd(v.fatto):"fatto")+(v.stelle?" · "+tlStars(v.stelle):""));
  return a.join(" · ");}
function tlRow(v){const nx=v.st==="voglio"?["corso","▶️ Comincio"]:v.st==="corso"?["fatto","✅ Fatto"]:null;
  return `<div class="row tl-row"><span class="pill tl-st">${tlStI(v.st)}</span><div class="grow"><b>${esc(v.t)}</b>${tlInfo(v)?`<small>${tlInfo(v)}</small>`:""}${v.st==="fatto"&&v.resta?`<small class="tl-resta">“${esc(v.resta)}”</small>`:""}</div>${nx?`<button class="btn sm" data-tlnx="${v.id}" data-to="${nx[0]}">${nx[1]}</button>`:""}<button class="btn sm" data-tled="${v.id}" aria-label="Apri la scheda">✏️</button></div>`;}

function vTl(){const V=TL().voci;
  let o=`<h1>🎟️ Tempo libero</h1><p class="sub">Leggere, vedere, ascoltare, fare: le tue liste in un posto solo, con il cinema, il teatro e i concerti di Torino presi ogni giorno dalla Stampa.</p>`;
  o+=`<div class="kpi" style="margin-bottom:12px">${TL_L.map(([k,ic,t])=>{const L=V.filter(v=>v.l===k);return `<div><b>${L.filter(v=>v.st!=="fatto").length}</b><span>${ic} ${t}</span></div>`;}).join("")}</div>`;
  o+=`<div class="seg" role="tablist" style="margin:0 0 14px;width:max-content;max-width:100%">${TL_V.map(([k,n])=>`<button role="tab" data-tlv="${k}" class="${tlV===k?"on":""}" aria-selected="${tlV===k}">${n}</button>`).join("")}</div>`;
  if(tlEd&&tlGet(tlEd))o+=tlEditor(tlGet(tlEd));
  return o+({liste:tlListe,prog:tlProg,sera:tlSeraV,anno:tlAnno}[tlV]||tlListe)();}

function tlListe(){const V=TL().voci;
  return `<div class="cols2">${TL_L.map(([k,ic,t,sub])=>{const L=V.filter(v=>v.l===k),aperte=L.filter(v=>v.st!=="fatto").sort((a,b)=>((a.st==="corso"?0:1)-(b.st==="corso"?0:1))||((a.quando||"9")<(b.quando||"9")?-1:(a.quando||"9")>(b.quando||"9")?1:0)),fatte=L.filter(v=>v.st==="fatto").sort((a,b)=>(a.fatto||"")<(b.fatto||"")?1:-1);
    return `<div class="card k-tl"><h3>${ic} ${t} <span class="lbl" style="margin-left:auto">${aperte.length}</span></h3><p class="lbl" style="margin:0 0 6px">${sub}</p>
      <div class="tl-add"><input id="tlNew-${k}" placeholder="aggiungi un titolo…" enterkeyhint="done"><button class="btn sm pri" data-tlnew="${k}">➕</button></div>
      ${aperte.length?aperte.map(tlRow).join(""):`<p class="empty">Ancora niente: scrivi un titolo e premi ➕.</p>`}
      ${fatte.length?`<button class="lnk" data-tlf="${k}">${tlFatti[k]?"▴ Nascondi":"▾ Mostra"} i ${fatte.length} già fatti</button>${tlFatti[k]?fatte.map(tlRow).join(""):""}`:""}</div>`;}).join("")}</div>`;}

/* la scheda di una voce: i campi cambiano con la lista */
function tlEditor(v){const f=(id,lab,val,typ,ph,cls)=>`<label${cls?` class="${cls}"`:""}>${lab}<input id="${id}" type="${typ||"text"}" value="${esc(val||"")}"${ph?` placeholder="${esc(ph)}"`:""}${typ==="number"?' inputmode="decimal"':""}></label>`,
    sel=(id,lab,opts,val)=>`<label>${lab}<select id="${id}">${opts.map(([k,t])=>`<option value="${k}"${k===val?" selected":""}>${t}</option>`).join("")}</select></label>`;
  let o=`<div class="card k-tl nofold tl-ed"><h3>${tlL(v.l)[1]} ${esc(v.t)} <button class="lnk" data-tla="chiudi">Chiudi ✕</button></h3><div class="form">`;
  o+=f("tlT","Titolo",v.t,"text","","wide")+sel("tlLst","Lista",TL_L.map(([k,ic,t])=>[k,ic+" "+t]),v.l)+sel("tlSt","Stato",TL_ST.map(([k,ic,t])=>[k,ic+" "+t]),v.st);
  if(v.l==="libri")o+=f("tlAut","Autore",v.aut)+f("tlPag","A pagina",v.pag,"number")+f("tlTot","Pagine in tutto",v.tot,"number")+f("tlFrase","Una frase che mi è piaciuta",v.frase,"text","","wide")+f("tlPrA","Prestato a",v.prestA)+f("tlPrD","Preso in prestito da",v.presoDa);
  if(v.l==="film")o+=sel("tlTipo","Che cos'è",[["film","🎬 film"],["serie","📺 serie"]],v.tipo||"film")+f("tlDovev","Dove si vede",v.dovev,"text","al cinema, in TV, su una piattaforma…")+(v.tipo==="serie"?f("tlSta","Stagione",v.sta,"number")+f("tlEpi","Episodio",v.epi,"number"):"");
  if(v.l==="musica")o+=f("tlAut","Artista o autore",v.aut)+sel("tlTipo","Che cos'è",[["album","💿 album"],["brano","🎶 brano"],["podcast","🎙️ podcast"]],v.tipo||"album")+f("tlDovev","Dove si ascolta",v.dovev)+(v.tipo==="podcast"?f("tlPunt","Puntata",v.punt):"");
  if(v.l==="palco")o+=f("tlAut","Compagnia, interpreti o artista",v.aut)+`<label class="chkl"><input type="checkbox" id="tlBigl"${v.bigl?" checked":""}> 🎫 Biglietto preso</label>`;
  o+=f("tlQ","Quando",v.quando,"date")+f("tlOra","Ora",v.ora,"time")+f("tlDove","Dove",v.dove)+f("tlCosto","Costo (€)",v.costo,"number")+f("tlCons","Chi me l'ha consigliato",v.cons)+f("tlCon","Con chi",v.con);
  if(v.qt&&!v.quando)o+=`<p class="lbl wide">Dalla Stampa: ${esc(v.qt)}. Scegli il giorno in «Quando» per metterlo nel Calendario.</p>`;
  if(v.st==="fatto")o+=f("tlFatto","Fatto il",v.fatto||today(),"date")+`<label>Stelle<span class="tl-stars">${[1,2,3,4,5].map(n=>`<button type="button" data-tlstar="${n}" class="${(v.stelle||0)>=n?"on":""}" aria-label="${n} stelle">★</button>`).join("")}</span></label>`+f("tlResta","Che cosa mi resta",v.resta,"text","una frase per ricordarlo","wide");
  o+=`<label class="wide">Note<textarea id="tlNote" rows="2">${esc(v.note||"")}</textarea></label></div>`;
  const inCal=P.scad.some(x=>x.id==="tl-"+v.id),inCas=P.pens&&(PENS().mov||[]).some(x=>x.id==="tl-"+v.id);
  o+=`<div class="btns"><button class="btn pri" data-tla="salva">💾 Salva</button><button class="btn sm" data-tla="cal">📌 ${inCal?"Aggiorna nel":"Metti nel"} Calendario</button><button class="btn sm" data-tla="cassa">💶 ${inCas?"Togli dalla":"Prova nella"} Cassa</button>${v.l==="libri"?`<button class="btn sm" data-tla="bib">🔎 Cerca in biblioteca</button>`:""}${v.link?`<a class="btn sm" href="${esc(v.link)}" target="_blank" rel="noopener noreferrer">🔗 Scheda</a>`:""}<button class="btn sm" data-tla="del">🗑️ Elimina</button></div></div>`;
  return o;}

/* 🎟️ In programma: le proposte della Stampa di oggi */
const TL_PROG=[["spettacoli","🎬","Cinema e teatro"],["concerti","🎵","Concerti nei prossimi mesi"],["eventi","🎟️","Cose da fare a Torino e in Piemonte"]];
function tlProg(){if(typeof stData!=="function"||!stData().updated)return `<div class="card k-tl nofold"><p class="empty">Le proposte arrivano con la 🗞️ Stampa di oggi: apri l'app quando sei collegato.</p></div>`;
  const S=stData().sezioni||{},src=new Set(TL().voci.map(v=>v.src).filter(Boolean));
  return `<p class="lbl" style="margin-top:0">${esc(stQuando())}: cinema (solo The Space e Ideal), teatro, concerti ed eventi. Con ➕ entrano nelle tue liste.</p><div class="cols2 tl-cols3">${TL_PROG.map(([k,ic,t])=>{const A=S[k]||[];
    return `<div class="card k-tl"><h3>${ic} ${t} <span class="lbl" style="margin-left:auto">${A.length}</span></h3>${A.length?A.map(n=>`<div class="row"><div class="grow"><b>${esc(n.t)}</b><small>${[n.quando?"📅 "+esc(n.quando):"",n.dove?"📍 "+esc(n.dove):"",n.costo?"💶 "+esc(n.costo):""].filter(Boolean).join(" · ")}</small>${n.s?`<small>${esc(n.s)}</small>`:""}</div>${src.has(n.id)?`<span class="pill">✓ in lista</span>`:`<button class="btn sm" data-tladd="${esc(n.id)}">➕ Voglio andarci</button>`}</div>`).join(""):`<p class="empty">Niente in questa edizione.</p>`}</div>`;}).join("")}</div>`;}

/* 🎲 Stasera? Una proposta da casa e una fuori casa, pescate dalle liste e dalla Stampa */
function tlPesca(){const V=TL().voci.filter(v=>v.st!=="fatto"),pick=a=>a.length?a[Math.floor(Math.random()*a.length)]:null,
    casa=pick(V.filter(v=>["film","musica","libri"].includes(v.l))),t=today(),
    oggi=V.filter(v=>v.quando===t),fuori=pick(oggi.length?oggi:V.filter(v=>["fare","palco"].includes(v.l)&&(!v.quando||v.quando>=t))),
    st=typeof stData==="function"?pick(((stData().sezioni||{}).spettacoli||[]).concat((stData().sezioni||{}).eventi||[])):null;
  tlSera={casa:casa&&casa.id,fuori:fuori&&fuori.id,st:st&&st.id};}
function tlSeraV(){if(!tlSera)tlPesca();const c=tlGet(tlSera.casa),f=tlGet(tlSera.fuori),s=tlSera.st&&typeof stAll==="function"?stAll().find(n=>n.id===tlSera.st):null;
  const box=(tit,v)=>`<div class="card k-tl nofold"><h3>${tit}</h3>${v?tlRow(v):`<p class="empty">Aggiungi qualche titolo nelle liste.</p>`}</div>`;
  return `<div class="cols2">${box("🛋️ Da casa",c)}${box("🚶 Fuori casa",f)}${s?`<div class="card k-tl nofold"><h3>🗞️ Dalla Stampa di oggi</h3><div class="row"><div class="grow"><b>${esc(s.t)}</b><small>${[s.quando,s.dove].filter(Boolean).map(esc).join(" · ")}</small></div>${TL().voci.some(v=>v.src===s.id)?`<span class="pill">✓ in lista</span>`:`<button class="btn sm" data-tladd="${esc(s.id)}">➕</button>`}</div></div>`:""}</div><div class="btns"><button class="btn pri" data-tla="pesca">🎲 Un'altra proposta</button></div>`;}

/* 🏆 Il mio anno */
function tlAnno(){const y=String(new Date().getFullYear()),F=TL().voci.filter(v=>v.st==="fatto"&&(v.fatto||"").startsWith(y)),best=F.filter(v=>v.stelle===5),R=F.filter(v=>v.resta).sort((a,b)=>a.fatto<b.fatto?1:-1),pag=F.filter(v=>v.l==="libri").reduce((s,v)=>s+(tlNum(v.tot)||0),0);
  let o=`<div class="kpi" style="margin-bottom:12px"><div><b>${F.length}</b><span>cose fatte nel ${y}</span></div>${TL_L.map(([k,ic,t])=>`<div><b>${F.filter(v=>v.l===k).length}</b><span>${ic} ${t}</span></div>`).join("")}${pag?`<div><b>${pag}</b><span>pagine lette</span></div>`:""}</div>`;
  o+=`<div class="cols2"><div class="card k-tl"><h3>⭐ Le cinque stelle</h3>${best.length?best.map(tlRow).join(""):`<p class="empty">Quando segni una voce come fatta, dalle le stelle.</p>`}</div><div class="card k-tl"><h3>💭 Che cosa mi resta</h3>${R.length?R.map(v=>`<div class="row"><div class="grow"><b>“${esc(v.resta)}”</b><small>${tlL(v.l)[1]} ${esc(v.t)} · ${tlFd(v.fatto)}</small></div></div>`).join(""):`<p class="empty">Le frasi scritte in «Che cosa mi resta» compaiono qui.</p>`}</div></div>`;
  return o;}

/* riquadro in ☀️ Oggi: quello che hai in corso e le date dei prossimi 14 giorni */
function tlCard(){const t=today(),h=add(t,14),V=TL().voci.filter(v=>v.st!=="fatto"),dt=V.filter(v=>v.quando&&v.quando>=t&&v.quando<=h).sort((a,b)=>a.quando<b.quando?-1:1),co=V.filter(v=>v.st==="corso"&&!dt.includes(v)).slice(0,4);
  if(!dt.length&&!co.length)return "";
  return `<div class="card k-tl"><h3>🎟️ Tempo libero <button class="lnk" data-go="tl">Apri ›</button></h3>${dt.map(v=>`<div class="row"><span class="pill">${v.quando===t?"oggi":fmt(v.quando,{weekday:"short",day:"numeric",month:"short"})}</span><div class="grow"><b>${tlL(v.l)[1]} ${esc(v.t)}</b>${v.ora||v.dove?`<small>${[v.ora,v.dove].filter(Boolean).map(esc).join(" · ")}</small>`:""}</div></div>`).join("")}${co.map(v=>`<div class="row"><span class="pill">▶️</span><div class="grow"><b>${tlL(v.l)[1]} ${esc(v.t)}</b>${tlInfo(v)?`<small>${tlInfo(v)}</small>`:""}</div></div>`).join("")}</div>`;}

/* ➕ da una proposta della Stampa (qui o nella sezione 🗞️) */
function tlDaStampa(id){if(typeof stAll!=="function")return;const n=stAll().find(x=>x.id===id);if(!n)return toast("Proposta non trovata: aggiorna la Stampa");
  if(TL().voci.some(v=>v.src===id))return toast("È già nelle tue liste");
  const cin=/the space|ideal/i.test((n.dove||"")+" "+(n.t||"")),l=n.sez==="spettacoli"?(cin?"film":"palco"):n.sez==="concerti"?"palco":"fare";
  TL().voci.push({id:uid(),l,t:n.t,st:"voglio",qt:n.quando||"",dove:n.dove||"",dovev:cin?"al cinema":"",note:n.costo?"💶 "+n.costo:"",src:id,link:((n.fonti||[])[0]||{}).url||"",add:today()});
  save();toast("➕ In 🎟️ Tempo libero → "+tlL(l)[2]);if(cur==="tl"||cur==="st")render();}
document.addEventListener("click",e=>{const a=e.target.closest&&e.target.closest("[data-tladd]");if(a){e.preventDefault();tlDaStampa(a.dataset.tladd);}});

/* legge la scheda aperta e la scrive nella voce */
function tlRead(v){const g=id=>{const e=$(id);return e?(e.type==="checkbox"?e.checked:e.value.trim()):undefined;},set=(k,id)=>{const x=g(id);if(x!==undefined)v[k]=x;};
  const t=g("tlT");if(t)v.t=t;set("l","tlLst");const st=g("tlSt");if(st&&st!==v.st){v.st=st;if(st==="fatto"&&!v.fatto)v.fatto=today();}
  [["aut","tlAut"],["pag","tlPag"],["tot","tlTot"],["frase","tlFrase"],["prestA","tlPrA"],["presoDa","tlPrD"],["tipo","tlTipo"],["dovev","tlDovev"],["sta","tlSta"],["epi","tlEpi"],["punt","tlPunt"],["bigl","tlBigl"],["quando","tlQ"],["ora","tlOra"],["dove","tlDove"],["costo","tlCosto"],["cons","tlCons"],["con","tlCon"],["fatto","tlFatto"],["resta","tlResta"],["note","tlNote"]].forEach(([k,id])=>set(k,id));
  /* data e costo già nel Calendario o nella Cassa: si aggiornano con la voce */
  const s=P.scad.find(x=>x.id==="tl-"+v.id);if(s){if(v.quando){s.d=v.quando;s.t="🎟️ "+v.t;s.note=[v.ora,v.dove].filter(Boolean).join(" · ");}else P.scad=P.scad.filter(x=>x!==s);}
  if(P.pens){const m=(PENS().mov||[]).find(x=>x.id==="tl-"+v.id);if(m){if(tlNum(v.costo)>0){m.imp=Math.round(tlNum(v.costo));m.t="🎟️ "+v.t;if(v.quando)m.da=v.quando;}else PENS().mov=PENS().mov.filter(x=>x!==m);}}}

function bindTl(){const qa=s=>document.querySelectorAll(s),R=()=>render();
  qa("[data-tlv]").forEach(b=>b.onclick=()=>{tlV=b.dataset.tlv;if(tlV==="sera")tlSera=null;R();});
  qa("[data-tlf]").forEach(b=>b.onclick=()=>{tlFatti[b.dataset.tlf]=!tlFatti[b.dataset.tlf];R();});
  const nuova=k=>{const i=$("tlNew-"+k),t=i&&i.value.trim();if(!t)return toast("Scrivi un titolo");TL().voci.push({id:uid(),l:k,t,st:"voglio",add:today()});save();R();toast("➕ Aggiunto");const n=$("tlNew-"+k);if(n)n.focus();};
  qa("[data-tlnew]").forEach(b=>b.onclick=()=>nuova(b.dataset.tlnew));
  TL_L.forEach(([k])=>{const i=$("tlNew-"+k);if(i)i.onkeydown=e=>{if(e.key==="Enter"){e.preventDefault();nuova(k);}};});
  qa("[data-tlnx]").forEach(b=>b.onclick=()=>{const v=tlGet(b.dataset.tlnx);if(!v)return;v.st=b.dataset.to;if(v.st==="fatto"){v.fatto=v.fatto||today();tlEd=v.id;toast("✅ Fatto! Dagli le stelle e scrivi che cosa ti resta");window.scrollTo(0,0);}save();R();});
  qa("[data-tled]").forEach(b=>b.onclick=()=>{tlEd=b.dataset.tled;R();window.scrollTo(0,0);});
  const v=tlEd&&tlGet(tlEd);
  if(v){["tlLst","tlSt","tlTipo"].forEach(id=>{const e=$(id);if(e)e.onchange=()=>{tlRead(v);save();R();};});
    qa("[data-tlstar]").forEach(b=>b.onclick=()=>{tlRead(v);const n=+b.dataset.tlstar;v.stelle=v.stelle===n?0:n;save();R();});}
  qa("[data-tla]").forEach(b=>b.onclick=async()=>{const a=b.dataset.tla;
    if(a==="pesca"){tlPesca();return R();}
    if(a==="chiudi"){tlEd=null;return R();}
    if(!v)return;
    if(a==="salva"){tlRead(v);tlEd=null;save();R();return toast("💾 Salvato");}
    if(a==="del"){if(!confirm("Eliminare «"+v.t+"» dalle liste?"))return;TL().voci=TL().voci.filter(x=>x!==v);P.scad=P.scad.filter(x=>x.id!=="tl-"+v.id);if(P.pens)PENS().mov=(PENS().mov||[]).filter(x=>x.id!=="tl-"+v.id);tlEd=null;save();R();return toast("Eliminato");}
    tlRead(v);
    if(a==="cal"){if(!v.quando){save();R();return toast("Scegli prima il giorno in «Quando»");}if(!P.scad.some(x=>x.id==="tl-"+v.id))P.scad.push({id:"tl-"+v.id,t:"🎟️ "+v.t,d:v.quando,cat:"altro",ric:"",av:1,note:[v.ora,v.dove].filter(Boolean).join(" · "),done:false});save();R();return toast("📌 Nelle Scadenze del Calendario, con avviso il giorno prima");}
    if(a==="cassa"){const p=PENS();p.mov=p.mov||[];const m=p.mov.find(x=>x.id==="tl-"+v.id);if(m){p.mov=p.mov.filter(x=>x!==m);save();R();return toast("Tolto dalla Cassa");}
      const imp=Math.round(tlNum(v.costo));if(!(imp>0)){save();R();return toast("Scrivi prima il costo");}p.mov.push({id:"tl-"+v.id,tipo:"u",t:"🎟️ "+v.t,imp,freq:"una",da:v.quando||today(),a:"",cal:0});save();R();return toast("💶 Nella Cassa come uscita del "+tlFd(v.quando||today())+": guarda in Pensione → Cassa");}
    if(a==="bib"){save();let ok=false;try{await navigator.clipboard.writeText(v.t);ok=true;}catch(e){}window.open(TL_BIBLIO,"_blank","noopener");toast(ok?"📋 Titolo copiato: incollalo nella ricerca del catalogo":"Cerca il titolo nel catalogo");}
  });}
