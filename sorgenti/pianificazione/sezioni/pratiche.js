/* ---------- 🗂️ PRATICHE: le cose lunghe in corso ----------
   Per ogni pratica: stato, prossimo passo con data (compare nel Calendario e nelle Scadenze), documenti da spuntare,
   uffici e contatti, diario delle cose fatte, file allegati e note. Tutto resta su questo dispositivo (pn-v1);
   i file allegati stanno nel database del dispositivo («licenze-marco», chiavi «pf-…») ed entrano nelle copie (File/iCloud e copia automatica). */
const PRAT_ST={corso:["In corso","soon"],attesa:["In attesa di risposta","fam"],chiusa:["Chiusa","ok"]};
const PRAT_MOD={
  congedo:["🎖️","Congedo / pensione",["Domanda e ricevuta di invio","Documenti richiesti dall’ufficio","Comunicazioni ricevute","Prospetto economico"]],
  auto:["🚗","Auto",["Contratto in corso","Proposta di riscatto","Preventivo di un nuovo contratto","Verbale di riconsegna","Libretto e assicurazione"]],
  casa:["🏠","Casa in affitto",["Contratto di locazione","Registrazione del contratto","Ricevute dei canoni","Foto e inventario della casa","Documento dell’inquilino"]],
  legale:["⚖️","Pratica legale o amministrativa",["Atto o comunicazione ricevuta","Risposta inviata (con ricevuta)","Documenti a supporto","Termini da rispettare"]],
  altro:["📁","Altro",[]]};
let pratSel=null, pratNew=false, pratEditPasso=false;
const PR=()=>{if(!Array.isArray(P.prat))P.prat=[];return P.prat;};
const pratById=id=>PR().find(x=>x.id===id);
const pratIc=x=>(PRAT_MOD[x.mod]||PRAT_MOD.altro)[0];
function pratOn(s){return PR().filter(x=>x.stato!=="chiusa"&&x.passo&&x.passo.d===s);}
function pratDue(days){const t=today();return PR().filter(x=>x.stato!=="chiusa"&&x.passo&&x.passo.d&&diff(t,x.passo.d)<=days).sort((a,b)=>a.passo.d<b.passo.d?-1:1);}
function pratRow(x){const p=x.passo,st=PRAT_ST[x.stato]||PRAT_ST.corso,dn=(x.docs||[]).filter(d=>d.ok).length,dt=(x.docs||[]).length;
  const late=p&&p.d&&p.d<today()&&x.stato!=="chiusa";
  return `<button class="prow" data-psel="${x.id}"><span class="pic">${pratIc(x)}</span><span class="grow"><b>${esc(x.t)}</b><small>${p&&p.t?`➡️ ${esc(p.t)}${p.d?" · "+fmt(p.d,{weekday:"short",day:"numeric",month:"short"})+" ("+rel(p.d)+")":""}`:"Nessun prossimo passo"}${dt?` · 📄 ${dn}/${dt}`:""}</small></span><span class="pill ${late?"warn":st[1]}">${late?"in ritardo":st[0]}</span></button>`;}
function vPrat(){
  if(pratSel&&pratById(pratSel))return pratDetail(pratById(pratSel));
  const L=PR(),open=L.filter(x=>x.stato!=="chiusa").sort((a,b)=>((a.passo&&a.passo.d)||"9")<((b.passo&&b.passo.d)||"9")?-1:1),closed=L.filter(x=>x.stato==="chiusa");
  let o=`<h1>🗂️ Pratiche</h1><p class="sub">Le cose lunghe in corso: a che punto sono, qual è il prossimo passo, che cosa manca. Il prossimo passo compare da solo nel Calendario.</p>`;
  o+=`<div class="btns" style="margin:0 0 12px"><button class="btn pri" data-pa="new">➕ Nuova pratica</button></div>`;
  if(pratNew)o+=`<div class="card k-prat"><h3>➕ Nuova pratica</h3><div class="form"><label class="wide">Nome<input id="pnT" maxlength="80" placeholder="es. noleggio auto, affitto appartamento, domanda di congedo"></label>
    <label>Tipo<select id="pnM">${Object.entries(PRAT_MOD).map(([k,v])=>`<option value="${k}">${v[0]} ${v[1]}</option>`).join("")}</select></label>
    <label>Prossimo passo (facoltativo)<input id="pnP" maxlength="120" placeholder="es. chiedere il preventivo"></label><label>Entro il<input id="pnD" type="date"></label></div>
    <p class="lbl">Il tipo propone l’elenco dei documenti più comuni: lo puoi cambiare come vuoi.</p>
    <div class="btns"><button class="btn pri" data-pa="create">Crea</button><button class="btn" data-pa="cancel">Annulla</button></div></div>`;
  o+=open.length?`<div class="card k-prat plist"><h3>🗂️ Pratiche aperte <span class="lbl" style="font-weight:400">${open.length}</span></h3>${open.map(pratRow).join("")}</div>`:(pratNew?"":`<div class="card k-prat"><p class="empty">Nessuna pratica aperta. Creane una con «➕ Nuova pratica».</p></div>`);
  if(closed.length)o+=`<details class="more"><summary>Chiuse (${closed.length})</summary><div class="card plist">${closed.map(pratRow).join("")}</div></details>`;
  return o;
}
function pratDetail(x){
  const p=x.passo||{},st=x.stato||"corso",docs=x.docs||[],cont=x.cont||[],log=(x.log||[]).slice().sort((a,b)=>a.d<b.d?1:-1),files=x.files||[];
  return `<div class="btns" style="margin:0 0 6px"><button class="btn sm" data-pa="back">‹ Tutte le pratiche</button></div>
  <h1>${pratIc(x)} ${esc(x.t)}</h1>
  <div class="card k-prat"><div class="form"><label class="wide">Nome<input data-pf="t" maxlength="80" value="${esc(x.t)}"></label>
    <label>Stato<select data-pf="stato">${Object.entries(PRAT_ST).map(([k,v])=>`<option value="${k}"${st===k?" selected":""}>${v[0]}</option>`).join("")}</select></label>
    <label>Tipo<select data-pf="mod">${Object.entries(PRAT_MOD).map(([k,v])=>`<option value="${k}"${(x.mod||"altro")===k?" selected":""}>${v[0]} ${v[1]}</option>`).join("")}</select></label></div></div>
  <div class="card k-prat"><h3>➡️ Prossimo passo</h3>${p.t&&!pratEditPasso?`<div class="row"><div class="grow"><b>${esc(p.t)}</b><small>${p.d?fmt(p.d,{weekday:"long",day:"numeric",month:"long",year:"numeric"})+" · "+rel(p.d):"senza data"}</small></div><button class="btn ok sm" data-pa="passodone">✓ Fatto</button><button class="btn sm" data-pa="passoedit">Modifica</button></div>`
    :`<div class="form"><label class="wide">Che cosa<input id="ppT" maxlength="120" value="${esc(p.t||"")}" placeholder="es. telefonare all’ufficio, mandare la PEC"></label><label>Entro il<input id="ppD" type="date" value="${esc(p.d||"")}"></label></div><div class="btns"><button class="btn pri" data-pa="passosave">Salva</button>${p.t?'<button class="btn" data-pa="passocancel">Annulla</button>':""}</div>`}
    <p class="lbl" style="margin:8px 0 0">Quando lo segni fatto, finisce nel diario qui sotto e puoi scrivere il passo successivo.</p></div>
  <div class="card k-prat"><h3>📄 Documenti <span class="lbl">${docs.filter(d=>d.ok).length}/${docs.length}</span></h3>${docs.map((d,i)=>`<div class="row"><button class="chk${d.ok?" done":""}" data-pdoc="${i}" aria-label="Segna">✓</button><div class="grow${d.ok?" lbl":""}">${esc(d.t)}</div><button class="btn sm" data-pdocx="${i}" aria-label="Togli">×</button></div>`).join("")}
    <div class="btns"><input id="pdT" maxlength="100" placeholder="Aggiungi un documento" class="pin"><button class="btn sm" data-pa="docadd">Aggiungi</button></div></div>
  <div class="card k-prat"><h3>☎️ Uffici e contatti</h3>${cont.map((c,i)=>`<div class="row"><div class="grow"><b>${esc(c.n)}</b><small>${[c.tel?`<a href="tel:${esc(c.tel.replace(/[^\d+]/g,""))}">${esc(c.tel)}</a>`:"",c.mail?`<a href="mailto:${esc(c.mail)}">${esc(c.mail)}</a>`:"",esc(c.note||"")].filter(Boolean).join(" · ")}</small></div><button class="btn sm" data-pcx="${i}" aria-label="Togli">×</button></div>`).join("")}
    <div class="form" style="margin-top:6px"><label>Ufficio o persona<input id="pcN" maxlength="80"></label><label>Telefono<input id="pcT" inputmode="tel" maxlength="30"></label><label>Email o PEC<input id="pcM" inputmode="email" maxlength="80"></label><label>Nota<input id="pcO" maxlength="100" placeholder="orari, numero di pratica…"></label></div>
    <div class="btns"><button class="btn sm" data-pa="contadd">Aggiungi il contatto</button></div></div>
  <div class="card k-prat"><h3>📝 Diario</h3><div class="form"><label>Data<input id="plD" type="date" value="${today()}"></label><label class="wide">Che cosa è successo<input id="plT" maxlength="300" placeholder="es. inviata la PEC, mi hanno risposto, appuntamento fissato"></label></div>
    <div class="btns"><button class="btn sm pri" data-pa="logadd">Aggiungi al diario</button></div>
    ${log.map(l=>`<div class="row"><span class="pill">${fmt(l.d,{day:"numeric",month:"short",year:"2-digit"})}</span><div class="grow">${esc(l.t)}</div><button class="btn sm" data-plx="${esc(l.id||"")}" aria-label="Togli">×</button></div>`).join("")}</div>
  <div class="card k-prat"><h3>📎 File</h3>${files.map(f=>`<div class="row"><span class="pill">${/pdf/.test(f.type)?"PDF":/image/.test(f.type)?"🖼️":"📄"}</span><div class="grow"><b>${esc(f.n)}</b><small>${Math.max(1,Math.round(f.size/1024))} KB · ${fmt(f.at.slice(0,10),{day:"numeric",month:"short"})}</small></div><button class="btn sm" data-pfo="${f.id}">Apri</button><button class="btn sm" data-pfx="${f.id}" aria-label="Togli">×</button></div>`).join("")}
    <div class="btns"><label class="btn sm" style="cursor:pointer">➕ Aggiungi foto o PDF<input type="file" id="pfIn" accept="image/*,application/pdf" hidden></label></div>
    <p class="lbl" style="margin:8px 0 0">I file restano su questo iPad (massimo 10 MB l’uno) ed entrano nella copia su File/iCloud e nella copia automatica.</p></div>
  <div class="card k-prat"><h3>🗒️ Note</h3><div class="form"><label class="wide"><textarea data-pf="note" rows="3" maxlength="2000" placeholder="numero di pratica, cose da ricordare…">${esc(x.note||"")}</textarea></label></div></div>
  <div class="btns"><button class="btn danger" data-pa="del">Elimina la pratica</button></div>`;
}
function pratSave(msg){save();render();if(msg)toast(msg);}
function bindPrat(){
  document.querySelectorAll("[data-psel]").forEach(b=>b.onclick=()=>{pratSel=b.dataset.psel;pratEditPasso=false;render();window.scrollTo(0,0);});
  const x=pratSel&&pratById(pratSel);
  document.querySelectorAll("[data-pa]").forEach(b=>b.onclick=async()=>{const a=b.dataset.pa;
    if(a==="new"){pratNew=!pratNew;render();const f=$("pnT");if(f)f.focus();return;}
    if(a==="cancel"){pratNew=false;return render();}
    if(a==="create"){const t=$("pnT").value.trim();if(!t)return toast("Scrivi il nome della pratica");const m=$("pnM").value,pt=$("pnP").value.trim(),pd=$("pnD").value;
      const o={id:uid(),t,mod:m,stato:"corso",passo:pt?{t:pt,d:pd}:null,docs:(PRAT_MOD[m]||PRAT_MOD.altro)[2].map(t=>({t,ok:false})),cont:[],log:[{id:uid(),d:today(),t:"Pratica aperta"}],files:[],note:"",creata:today()};
      PR().push(o);pratNew=false;pratSel=o.id;window.scrollTo(0,0);return pratSave("Pratica creata");}
    if(a==="back"){pratSel=null;return render();}
    if(!x)return;
    if(a==="passoedit"){pratEditPasso=true;return render();}
    if(a==="passocancel"){pratEditPasso=false;return render();}
    if(a==="passosave"){const t=$("ppT").value.trim(),d=$("ppD").value;x.passo=t?{t,d}:null;pratEditPasso=false;return pratSave(t?"Prossimo passo salvato":"");}
    if(a==="passodone"){if(x.passo){(x.log=x.log||[]).push({id:uid(),d:today(),t:"✓ "+x.passo.t});x.passo=null;}pratEditPasso=true;return pratSave("Fatto: scrivi il passo successivo");}
    if(a==="docadd"){const t=$("pdT").value.trim();if(!t)return;(x.docs=x.docs||[]).push({t,ok:false});return pratSave();}
    if(a==="contadd"){const n=$("pcN").value.trim();if(!n)return toast("Scrivi l’ufficio o la persona");(x.cont=x.cont||[]).push({n,tel:$("pcT").value.trim(),mail:$("pcM").value.trim(),note:$("pcO").value.trim()});return pratSave("Contatto aggiunto");}
    if(a==="logadd"){const t=$("plT").value.trim();if(!t)return;(x.log=x.log||[]).push({id:uid(),d:$("plD").value||today(),t});return pratSave("Aggiunto al diario");}
    if(a==="del"){if(!confirm("Eliminare la pratica «"+x.t+"» con documenti, contatti, diario e file?"))return;(x.files||[]).forEach(f=>kv("readwrite","pf-"+f.id,undefined).catch(()=>{}));P.prat=PR().filter(y=>y.id!==x.id);pratSel=null;return pratSave("Pratica eliminata");}
  });
  if(!x)return;
  document.querySelectorAll("[data-pf]").forEach(el=>el.onchange=()=>{const k=el.dataset.pf,v=el.value.trim();if(k==="t"&&!v)return;x[k]=v;if(k==="stato"&&v==="chiusa")(x.log=x.log||[]).push({id:uid(),d:today(),t:"Pratica chiusa"});pratSave(k==="note"?"Note salvate":"");});
  document.querySelectorAll("[data-pdoc]").forEach(b=>b.onclick=()=>{const d=x.docs[+b.dataset.pdoc];d.ok=!d.ok;pratSave();});
  document.querySelectorAll("[data-pdocx]").forEach(b=>b.onclick=()=>{x.docs.splice(+b.dataset.pdocx,1);pratSave();});
  document.querySelectorAll("[data-pcx]").forEach(b=>b.onclick=()=>{if(!confirm("Togliere questo contatto?"))return;x.cont.splice(+b.dataset.pcx,1);pratSave();});
  document.querySelectorAll("[data-plx]").forEach(b=>b.onclick=()=>{if(!confirm("Togliere questa riga del diario?"))return;x.log=(x.log||[]).filter(l=>(l.id||"")!==b.dataset.plx);pratSave();});
  const fin=$("pfIn");if(fin)fin.onchange=async()=>{const f=fin.files&&fin.files[0];fin.value="";if(!f)return;if(f.size>10*1024*1024)return toast("File troppo grande (massimo 10 MB)");
    const id=uid();try{await kv("readwrite","pf-"+id,f);}catch(e){return toast("Non riesco a salvare il file su questo iPad");}
    (x.files=x.files||[]).push({id,n:f.name||"file",type:f.type||"",size:f.size,at:new Date().toISOString()});pratSave("File aggiunto");if(window.__pfRefresh)window.__pfRefresh();};
  document.querySelectorAll("[data-pfo]").forEach(b=>b.onclick=async()=>{try{const meta=(x.files||[]).find(f=>f.id===b.dataset.pfo),blob=await kv("readonly","pf-"+b.dataset.pfo);if(!blob)return toast("File non trovato su questo iPad");pratView(blob,meta||{n:"file",type:blob.type});}catch(e){toast("Non riesco ad aprire il file");}});
  document.querySelectorAll("[data-pfx]").forEach(b=>b.onclick=()=>{if(!confirm("Togliere questo file?"))return;kv("readwrite","pf-"+b.dataset.pfx,undefined).catch(()=>{});x.files=(x.files||[]).filter(f=>f.id!==b.dataset.pfx);pratSave();if(window.__pfRefresh)window.__pfRefresh();});
}

/* visore dentro l'app: nell'app sulla schermata Home non c'è il tasto «indietro», quindi il file non si apre in una pagina nuova */
function pratView(blob,meta){const u=URL.createObjectURL(blob),ov=document.createElement("div"),img=/image/.test(meta.type||blob.type);
  ov.className="pview";ov.innerHTML=`<div class="pvbar"><b>${esc(meta.n)}</b><span style="flex:1"></span>${navigator.share?'<button class="btn sm" id="pvSh">📤 Condividi / Salva</button>':`<a class="btn sm" href="${u}" download="${esc(meta.n)}">⬇️ Scarica</a>`}<button class="btn sm pri" id="pvX">Chiudi</button></div>`+
    (img?`<div class="pvbody"><img src="${u}" alt="${esc(meta.n)}"></div>`:`<iframe class="pvbody" src="${u}" title="${esc(meta.n)}"></iframe>`);
  document.body.appendChild(ov);const close=()=>{ov.remove();URL.revokeObjectURL(u);};
  ov.querySelector("#pvX").onclick=close;
  const sh=ov.querySelector("#pvSh");if(sh)sh.onclick=async()=>{try{const f=new File([blob],meta.n||"file",{type:meta.type||blob.type});await navigator.share({files:[f],title:meta.n});}catch(e){if(!e||e.name!=="AbortError")toast("Condivisione non riuscita");}};}
