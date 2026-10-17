/* ================= EXTRA: emoji, tendine, sfondi a tema, novità del giorno, ricerca, autodiagnosi =================
   Caricato prima di d_app.js: qui solo funzioni e costanti; d_app.js le usa nelle viste e all'avvio. */

/* ---------- emoji per argomento (intuitive, una per argomento) ---------- */
const TIC={u1a:"📏",u1b:"🔢",u1c:"↗️",u1d:"🧩",u2a:"🏃",u2b:"🏀",u2c:"🏋️",u2d:"⚡",u2e:"🦾",u2f:"🎱",u3a:"🤿",u3b:"🚢",u3c:"🫀",u3d:"🍯",u3e:"💧",u4a:"〰️",u4b:"🔊",u4c:"🚑",u4d:"🎵",u5a:"🌡️",u5b:"🎈",u5c:"⚙️",u5d:"🔄",u5e:"🔥",u6a:"➕",u6b:"🧲",u6c:"🔌",u6d:"💡",u6e:"🧭",u7a:"🌈",u7b:"🔦",u7c:"👓",u7d:"🧪",u7e:"☢️",
 c1a:"⚛️",c1b:"🔗",c1c:"🧊",c1d:"♨️",c2a:"🥤",c2b:"⚗️",c2c:"🫧",c3a:"⏱️",c3b:"⚖️",c4a:"🍋",c4b:"🩸",c4c:"🔃",c5a:"🪞",c5b:"⛽",c6a:"🍷",c6b:"🧴",c6c:"🧈",c7a:"🥩",c7b:"🍬",c7c:"🫒",c7d:"🧬",
 b1a:"🦠",b1b:"🧫",b1c:"🔬",b1d:"🧱",b2a:"🧵",b2b:"🧶",b2c:"📚",b3a:"📠",b3b:"📝",b3c:"✂️",b3d:"🏭",b4a:"⚠️",b4b:"🫛",b4c:"🔢",b4d:"🌳",b5a:"🧼",b5b:"📮",b5c:"🔋",b5d:"🧽",b5e:"📦",b5f:"🚚",b5g:"🦴",b6a:"🕸️",b6b:"🤝",b6c:"📡",b7a:"🔁",b7b:"➗",b7c:"🥚",b7d:"🍂"};
const tic=t=>TIC[t&&t.id||t]||"•";

/* ---------- preferenze di aspetto (salvate con i progressi) ---------- */
const BG_OPT=[["tema","🎨 A tema con la materia"],["fis","⚛️ Fisica"],["chi","🧪 Chimica"],["bio","🧬 Biologia"],["tinta","🟦 Tinta unita colorata"],["nessuno","⬜ Nessuno sfondo"]];
const INT_OPT=[["1","Leggero"],["2","Medio"],["3","Marcato"]];
function UI(){Rt.ui=Rt.ui&&typeof Rt.ui==="object"?Rt.ui:{};if(!Rt.ui.bg)Rt.ui.bg="tema";if(!Rt.ui.int)Rt.ui.int="1";if(!Rt.ui.dens)Rt.ui.dens="snella";return Rt.ui;}
/* disegni del motivo di sfondo (tessere SVG 260×260, linee sottili nel colore della materia) */
function bgSVG(k,col,a){const s=`fill="none" stroke="${col}" stroke-opacity="${a}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"`,f=`fill="${col}" fill-opacity="${a}"`;
  const T={fis:`<g ${s}><ellipse cx="60" cy="60" rx="34" ry="12"/><ellipse cx="60" cy="60" rx="34" ry="12" transform="rotate(60 60 60)"/><ellipse cx="60" cy="60" rx="34" ry="12" transform="rotate(120 60 60)"/><path d="M130 200 q15 -30 30 0 t30 0 t30 0"/><path d="M170 60 l50 -20 m-10 -4 l10 4 -6 9"/><circle cx="60" cy="190" r="22"/><path d="M38 190 h44 M60 168 v44"/></g><circle ${f} cx="60" cy="60" r="5"/><text x="170" y="120" ${f} font-size="15" font-family="-apple-system,sans-serif">F = m·a</text><text x="20" y="250" ${f} font-size="13" font-family="-apple-system,sans-serif">E = h·f</text>`,
   chi:`<g ${s}><path d="M60 30 l26 15 v30 l-26 15 -26 -15 v-30 z"/><circle cx="60" cy="60" r="14"/><path d="M86 75 l24 14"/><path d="M180 150 l26 15 v30 l-26 15 -26 -15 v-30 z"/><path d="M190 40 v30 l-22 44 h60 l-22 -44 v-30 z M184 40 h28"/><circle cx="60" cy="200" r="10"/><circle cx="96" cy="216" r="7"/><circle cx="28" cy="216" r="7"/><path d="M68 205 l21 8 M52 205 l-17 8"/></g><text x="150" y="250" ${f} font-size="14" font-family="-apple-system,sans-serif">pH 7,4</text>`,
   bio:`<g ${s}><path d="M40 10 C 90 40, 0 80, 40 110 S 0 180, 40 210 S 90 250, 40 260"/><path d="M60 10 C 10 40, 100 80, 60 110 S 100 180, 60 210 S 10 250, 60 260"/><path d="M44 35 h12 M44 85 h12 M44 135 h12 M44 185 h12 M44 235 h12"/><ellipse cx="180" cy="70" rx="48" ry="36"/><circle cx="190" cy="66" r="14"/><path d="M150 180 q35 -26 70 0 q-35 26 -70 0 z"/><path d="M160 180 q8 -10 16 0 t16 0 t16 0"/></g><circle ${f} cx="190" cy="66" r="4"/>`};
  const body=(k==="hub"?T.fis+`<g transform="translate(130 130) scale(.5)">${T.bio}</g>`:T[k]||"").replace(/<text[^>]*>[^<]*<\/text>/g,"");   /* solo disegni: niente testo dietro al testo */
  return "url(\"data:image/svg+xml,"+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="260" height="260" viewBox="0 0 260 260">${body}</svg>`)+"\")";}
const EXCOL={fis:"--u2",chi:"--u5",bio:"--ok"};
function applyBg(){try{const u=UI(),b=document.body,r=document.documentElement,cs=getComputedStyle(r),inEx=typeof view==="string"&&(view.startsWith("ex:")||view==="arg");
  const subj=u.bg==="tema"?(inEx?EX:"hub"):u.bg;const ck=subj==="hub"?"--accent":(EXAMS[subj]&&EXAMS[subj].col)||EXCOL[subj]||"--accent";const col=cs.getPropertyValue(ck).trim()||"#1f5fae";
  const a={1:.06,2:.1,3:.17}[u.int]||.1;b.dataset.dens=u.dens;b.dataset.bg=u.bg;b.style.backgroundImage="";
  const tint=`linear-gradient(180deg, color-mix(in srgb, ${col} ${u.int*4}%, var(--bg)) 0%, var(--bg) 420px)`;
  /* livello fisso separato (body::before): su Safari per iPad il motivo resta fermo e non lampeggia */
  r.style.setProperty("--tint",u.bg==="nessuno"?"none":tint);
  r.style.setProperty("--pat",u.bg==="nessuno"||u.bg==="tinta"?"none":bgSVG(subj,col,a));}catch(e){}}
try{matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>{try{applyBg();}catch(e){}});}catch(e){}

/* ---------- tendine apri/chiudi (stato ricordato su questo dispositivo) ---------- */
const FKEY="semestre-tendine";let FOLD={};try{FOLD=JSON.parse(localStorage.getItem(FKEY)||"{}")||{};}catch(e){FOLD={};}
const isOpen=(k,def)=>FOLD[k]==null?!!def:!!FOLD[k];
function setFold(k,v){FOLD[k]=v?1:0;try{localStorage.setItem(FKEY,JSON.stringify(FOLD));}catch(e){}}
/* una card che si apre e si chiude toccando il titolo */
function fold(key,head,body,def,cls,uc){return `<details class="card fold${cls?" "+cls:""}" data-fold="${key}"${uc?` style="--uc:var(--${uc})"`:""}${isOpen(key,def)?" open":""}><summary>${head}<span class="chev" aria-hidden="true"></span></summary><div class="fbody">${body}</div></details>`;}
document.addEventListener("toggle",e=>{const d=e.target;if(d&&d.dataset&&d.dataset.fold)setFold(d.dataset.fold,d.open);},true);

/* ---------- novità del giorno: notizie dalle fonti indicizzate, aggiornate in background ---------- */
const NKEY="semestre-novita",NSEEN="semestre-novita-viste";
let NEWS=null;try{NEWS=JSON.parse(localStorage.getItem(NKEY)||"null");}catch(e){NEWS=null;}
let NSEENS={};try{NSEENS=JSON.parse(localStorage.getItem(NSEEN)||"{}")||{};}catch(e){NSEENS={};}
const nid=it=>{let x=5381;const s=(it.url||"")+"|"+(it.title||"");for(let i=0;i<s.length;i++)x=((x<<5)+x+s.charCodeAt(i))|0;return (x>>>0).toString(36);};
function newsItems(){return NEWS&&Array.isArray(NEWS.items)?NEWS.items.filter(i=>i&&i.date&&i.title).slice().sort((a,b)=>b.date.localeCompare(a.date)):[];}
function newsAge(d){return Math.round((dOf(today())-dOf(d))/864e5);}
function newsCounts(){const L=newsItems();return{day:L.filter(i=>newsAge(i.date)<=1).length,week:L.filter(i=>newsAge(i.date)<=7).length,unseen:L.filter(i=>newsAge(i.date)<=14&&!NSEENS[nid(i)]).length,all:L.length};}
let newsBusy=false;
/* scarica news.json (pubblicato e aggiornato ogni giorno dall'agente «ricerca delle novità»); se manca la rete resta la copia salvata */
function newsRefresh(force){if(newsBusy)return;const last=NEWS&&NEWS._got?Date.parse(NEWS._got):0;if(!force&&Date.now()-last<30*60e3)return;newsBusy=true;diagEstRefresh();uffRefresh();
  fetch("news.json?t="+Date.now(),{cache:"no-store"}).then(r=>r.ok?r.json():null).then(j=>{newsBusy=false;if(!j||!Array.isArray(j.items))return;const before=NEWS?newsItems().map(nid).join():"";
    j._got=new Date().toISOString();NEWS=j;try{localStorage.setItem(NKEY,JSON.stringify(j));}catch(e){}
    if(before!==newsItems().map(nid).join()){try{side();if(view==="home"||view==="novita")render();}catch(e){}}}).catch(()=>{newsBusy=false;});}
/* esito della verifica esterna giornaliera (agente che controlla e corregge l'app ogni sera) */
let DEST=null;try{DEST=JSON.parse(localStorage.getItem("semestre-diag-esterna")||"null");}catch(e){}
function diagEstRefresh(){fetch("diagnosi.json?t="+Date.now(),{cache:"no-store"}).then(r=>r.ok?r.json():null).then(j=>{if(j&&j.at){DEST=j;try{localStorage.setItem("semestre-diag-esterna",JSON.stringify(j));}catch(e){}}}).catch(()=>{});}
function markNewsSeen(){newsItems().forEach(i=>NSEENS[nid(i)]=1);try{localStorage.setItem(NSEEN,JSON.stringify(NSEENS));}catch(e){}}
let NFILT="tutte";
/* novità: nessuna evidenza particolare per lo studente, solo le notizie con la loro data e la data dell'ultimo aggiornamento */
const updLab=()=>NEWS&&NEWS.updated?([8,11].includes(new Date(NEWS.updated).getDate())?"l'":"il ")+new Date(NEWS.updated).toLocaleDateString("it-IT",{day:"numeric",month:"long",year:"numeric"}):null;
function vNovita(){const L=newsItems();const tags=[...new Set(L.map(i=>i.tag).filter(Boolean))];const F=NFILT==="tutte"?L:L.filter(i=>i.tag===NFILT||i.scope===NFILT);
  const grp=[["Ultimi 7 giorni",i=>newsAge(i.date)<=7],["Dall'8° al 30° giorno",i=>newsAge(i.date)>7&&newsAge(i.date)<=30],["Prima",i=>newsAge(i.date)>30]];
  setTimeout(markNewsSeen,500);
  let o=`<h1>📰 Novità del giorno</h1><p class="sub">Notizie sul semestre filtro dalle fonti ufficiali (MUR, Universitaly, UPO) e da testate affidabili, in ordine di data, ognuna con il link alla fonte.${updLab()?` Aggiornate ${updLab()}.`:""}</p>
  <div class="chips">${["tutte","UPO",...tags.filter(t=>t!=="UPO")].map(t=>`<button class="chip${NFILT===t?" on":""}" data-nf="${esc(t)}">${t==="tutte"?"Tutte":esc(t)}</button>`).join("")}<button class="chip" id="newsUpd">↻ Aggiorna</button></div>`;
  if(!L.length)o+=`<div class="card"><p class="empty">Nessuna notizia scaricata finora: si caricano appena c'è la connessione.</p></div>`;
  grp.forEach(([t,fn])=>{const g=F.filter(fn);if(!g.length)return;o+=`<h2>${t}</h2><div class="card news">${g.map(i=>{let host="";try{host=new URL(i.url).hostname.replace(/^www\./,"");}catch(e){}
    return `<div class="nrow"><div class="nd"><b>${dOf(i.date).getDate()}</b><span>${dOf(i.date).toLocaleDateString("it-IT",{month:"short"})}</span></div><div class="grow"><p class="nt">${esc(i.title)}</p><p class="ns">${esc(i.summary||"")}</p><p class="lbl" style="margin:0">${i.tag?`<span class="pill">${esc(i.tag)}</span> `:""}Fonte: ${i.url?`<a href="${esc(i.url)}" target="_blank" rel="noopener">${esc(i.source||host)}</a> <span class="lbl">(${esc(host)})</span>`:esc(i.source||"")}</p></div></div>`;}).join("")}</div>`;});
  if(NEWS&&Array.isArray(NEWS.sources)&&NEWS.sources.length)o+=fold("news-fonti",`<h3>🔗 Fonti consultate (${NEWS.sources.length})</h3>`,NEWS.sources.map(s=>`<div class="row"><div class="grow"><b>${esc(s.name)}</b><small>${esc(s.what||"")}</small></div>${s.url?`<a class="btn sm" href="${esc(s.url)}" target="_blank" rel="noopener">Apri</a>`:""}</div>`).join(""),false);
  o+=`<p class="lbl">Per decisioni importanti (date, scadenze) apri sempre la fonte ufficiale.</p>`;
  return o;}
function newsBanner(){const L=newsItems();const top=L[0];return `<button class="newsbtn" data-go="novita"><span class="nb-ic">📰</span><span class="grow"><b>Novità del giorno</b><small>${updLab()?`Aggiornate ${esc(updLab())}`:"Notizie dalle fonti ufficiali"}${top?` · ${esc(top.title)}`:""}</small></span><span class="chev r"></span></button>`;}

/* ---------- materiali ufficiali pubblicati (piattaforma MUR-CRUI-CISIA, avvisi UPO): solo informazioni datate ---------- */
const UKEY="semestre-ufficiale";let UFF=/*UFF0*/null;try{const c=JSON.parse(localStorage.getItem(UKEY)||"null");if(c&&c.updated&&(!UFF||c.updated>=UFF.updated))UFF=c;}catch(e){}
function uffRefresh(){fetch("ufficiale.json?t="+Date.now(),{cache:"no-store"}).then(r=>r.ok?r.json():null).then(j=>{if(j&&Array.isArray(j.voci)&&(!UFF||j.updated>=UFF.updated)){UFF=j;try{localStorage.setItem(UKEY,JSON.stringify(j));}catch(e){}}}).catch(()=>{});}
const uffDate=d=>{const x=new Date(d+"T12:00:00"),g=x.getDate();return (g===1?"1°":g)+" "+x.toLocaleDateString("it-IT",{month:"long",year:"numeric"});};
const dalD=d=>{const g=new Date(d+"T12:00:00").getDate();return ([8,11].includes(g)?"dall'":"dal ")+uffDate(d);};
const uffUpd=()=>UFF&&UFF.updated?([8,11].includes(new Date(UFF.updated).getDate())?"l'":"il ")+new Date(UFF.updated).toLocaleDateString("it-IT",{day:"numeric",month:"long",year:"numeric"}):"";
/* voci che riguardano un esame (o tutte) */
const uffFor=ex=>UFF&&Array.isArray(UFF.voci)?UFF.voci.filter(v=>!ex||!v.materie||(v.materie[ex]&&(v.materie[ex].length||Object.values(v.materie).every(a=>!a.length)))):[];
function uffRow(v,ex){const us=ex&&v.materie&&v.materie[ex]&&v.materie[ex].length?" Unità: "+v.materie[ex].map(u=>{const x=EXAMS[ex].units.find(y=>y.id===u);return x?x.ic+" "+x.t:u;}).join("; ")+".":"";
  return `<div class="nrow"><div class="nd"><b>${new Date(v.date+"T12:00:00").getDate()}</b><span>${new Date(v.date+"T12:00:00").toLocaleDateString("it-IT",{month:"short"})}</span></div><div class="grow"><p class="nt">${esc(v.titolo)}</p><p class="ns">${esc(v.dettaglio||"")}${esc(us)}</p><p class="lbl" style="margin:0">Fonte: <a href="${esc(v.url)}" target="_blank" rel="noopener">${esc(v.fonte)}</a></p></div></div>`;}
function uffHTML(ex){const L=uffFor(ex);if(!L.length)return "";return `<div class="card news"><h3>📚 Materiali ufficiali pubblicati</h3><p class="lbl" style="margin-top:0">Esercitazioni, simulazioni e unità didattiche disponibili sulla piattaforma ufficiale gratuita (semestreaperto-medodovet.it), in ordine di data. Aggiornato ${uffUpd()}.</p>${L.map(v=>uffRow(v,ex)).join("")}</div>`;}
/* per un'unità: dal quando ci sono esercitazioni ufficiali (la prima data registrata) */
function uffUnit(ex,u){const L=uffFor(ex).filter(v=>v.tipo==="esercitazioni"&&v.materie&&(v.materie[ex]||[]).includes(u));if(!L.length)return "";const first=L[L.length-1];
  return `<p class="lbl" style="margin:6px 0 0">Esercitazioni ufficiali su questa unità: sulla piattaforma ${dalD(first.date)} (fonte ${esc(first.fonte)}).</p>`;}

/* ---------- ricerca in tutte le materie ---------- */
let QS_="",QFOCUS=null;
function vCerca(){const q=QS_.trim();let o=`<h1>🔎 Cerca</h1><p class="sub">Cerca un argomento, una formula o una parola nelle spiegazioni e nelle domande di Fisica, Chimica e Biologia.</p><div class="card"><input id="srch" class="srch" type="search" placeholder="Es. Bernoulli, tampone, mitosi, emivita…" value="${esc(q)}" autocomplete="off"></div><div id="srchRes">${cercaRes(q)}</div>`;return o;}
/* ricerca: da 2 lettere (pH, Ka), prima le corrispondenze nel titolo, tolleranza agli errori di battitura, la domanda trovata si apre direttamente */
const nrmS=s=>String(s||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/\s+/g," ").trim();
function lev(a,b){if(Math.abs(a.length-b.length)>2)return 9;const d=[...Array(b.length+1).keys()];for(let i=1;i<=a.length;i++){let p=d[0];d[0]=i;for(let j=1;j<=b.length;j++){const t=d[j];d[j]=Math.min(d[j]+1,d[j-1]+1,p+(a[i-1]===b[j-1]?0:1));p=t;}}return d[b.length];}
let VOC=null;function vocab(){if(VOC)return VOC;const w=new Set();EXORD.forEach(ex=>EXAMS[ex].topics.forEach(t=>[t.t].concat(t.breve||[]).forEach(x=>nrmS(x).split(/[^a-z0-9]+/).forEach(y=>{if(y.length>=5)w.add(y);}))));return VOC=[...w];}
function cercaRes(q){const k=nrmS(q);if(k.length<2)return `<p class="lbl">Scrivi almeno 2 lettere.</p>`;let o="",tot=0;const pl=(n,a,b)=>n+" "+(n===1?a:b);
  const has=(x)=>{const t=nrmS(x);return k.length<=3?new RegExp("(^|[^a-z0-9])"+k.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+"($|[^a-z0-9])").test(t):t.includes(k);};
  EXORD.forEach(ex=>{const X=EXAMS[ex];
   const ts=X.topics.map(t=>{const tt=nrmS(t.t);const sc=tt===k?100:tt.startsWith(k)?80:has(t.t)?60:(t.breve||[]).some(has)?40:(t.syl||[]).some(has)?30:(t.sp||[]).some(has)?20:0;return [t,sc];}).filter(x=>x[1]).sort((a,b)=>b[1]-a[1]).map(x=>x[0]);
   const qs=X.qb.filter(x=>has(x.q)).concat(X.qb.filter(x=>!has(x.q)&&has(x.s))).slice(0,8);if(!ts.length&&!qs.length)return;tot+=ts.length+qs.length;
   o+=fold("cerca-"+ex,`<h3>${X.ic} ${esc(X.short||X.t)} · ${pl(ts.length,"argomento","argomenti")}${qs.length?`, ${pl(qs.length,"domanda","domande")}${qs.length===8?"+":""}`:""}</h3>`,ts.map(t=>`<button class="trow" data-go="${ex}/t/${t.id}"><span class="tic">${tic(t)}</span><div class="grow"><b>${esc(t.t)}</b><small>${esc(((t.breve||[]).find(has)||(t.sp||[]).find(has)||"").slice(0,140))}</small></div><span class="chev r"></span></button>`).join("")+qs.map(x=>`<button class="trow" data-go="${ex}/t/${x.t}" data-qf="${x.id}"><span class="tic">✏️</span><div class="grow">${esc(x.q)}<small>${esc((X.topics.find(t=>t.id===x.t)||{}).t||"")}</small></div><span class="chev r"></span></button>`).join(""),true);});
  if(tot)return o;
  const sug=k.length>=4?vocab().map(w=>[w,lev(k,w)]).filter(x=>x[1]<=(k.length>6?2:1)).sort((a,b)=>a[1]-b[1]).slice(0,3).map(x=>x[0]):[];
  return `<p class="empty">Nessun risultato per «${esc(q)}».${sug.length?` Forse cercavi: ${sug.map(w=>`<button class="chip" data-sug="${esc(w)}">${esc(w)}</button>`).join(" ")}`:""}</p>`;}
document.addEventListener("input",e=>{if(e.target.id==="srch"){QS_=e.target.value;const r=$("srchRes");if(r)r.innerHTML=cercaRes(QS_);}});

/* ---------- autodiagnosi giornaliera con correzione automatica ----------
   All'apertura (una volta al giorno) e alla chiusura controlla dati e contenuti; corregge da sola ciò che può
   (riferimenti a domande tolte, bozze non valide, voci rovinate) e annota tutto nel registro, sempre consultabile. */
function diagnosi(full){const fix=[],warn=[],okk=[];const t0=Date.now();
  try{EXORD.forEach(ex=>{const X=EXAMS[ex],e=Rt.exams[ex];const ids=new Set(X.qb.map(q=>q.id)),tids=new Set(X.topics.map(t=>t.id));
    // progressi che puntano a domande o argomenti non più presenti
    let n=0;Object.keys(e.qs||{}).forEach(k=>{const s=e.qs[k];if(!s||typeof s!=="object"){delete e.qs[k];n++;return;}if(!ids.has(k)&&!k.startsWith("g~")){if(!e.qsOld)e.qsOld={};e.qsOld[k]=s;delete e.qs[k];n++;}});if(n)fix.push(`${X.ic} ${n} risultati di domande non più presenti messi da parte`);
    n=0;Object.keys(e.tp||{}).forEach(k=>{if(!tids.has(k)){delete e.tp[k];n++;}});if(n)fix.push(`${X.ic} ${n} argomenti inesistenti tolti dai progressi`);
    if(e.ptDraft&&(!e.ptDraft.sel||e.ptDraft.sel.some(i=>!(i>=0&&i<X.pt.length)))){e.ptDraft=null;fix.push(`${X.ic} bozza del test d'ingresso non valida azzerata`);}
    if(e.pt&&e.pt.sel&&e.pt.sel.some(i=>!(i>=0&&i<X.pt.length))){e.pt.sel=e.pt.sel.filter(i=>i>=0&&i<X.pt.length);fix.push(`${X.ic} test d'ingresso: riferimenti corretti`);}
    if(e.goal&&Array.isArray(e.goal.t)){const b=e.goal.t.length;e.goal.t=e.goal.t.filter(t=>tids.has(t));if(e.goal.t.length!==b)fix.push(`${X.ic} obiettivo: tolti argomenti inesistenti`);}
    if(e.run){const b=e.run.q.length;if(!Array.isArray(e.run.q)||!e.run.q.length){e.run=null;fix.push(`${X.ic} simulazione vuota chiusa`);}else{const bad=e.run.q.filter(id=>!ids.has(id)&&!String(id).startsWith("g~"));if(bad.length)warn.push(`${X.ic} simulazione in corso con ${bad.length} domande non più presenti (verranno ignorate nel punteggio)`);}}
    if(Array.isArray(e.hist)&&e.hist.length>400){e.hist=e.hist.slice(-300);fix.push(`${X.ic} storico compattato (tenute le ultime 300 prove)`);}
    ["sims","hist","goalsDone"].forEach(k=>{if(!Array.isArray(e[k])){e[k]=[];fix.push(`${X.ic} elenco ${k} ricostruito`);}});
    if(full){// contenuti dell'app
      const seen=new Set();let dup=0,badq=0;X.qb.forEach(q=>{if(seen.has(q.id))dup++;seen.add(q.id);if(!tids.has(q.t))badq++;else if(q.k==="m"&&(!Array.isArray(q.o)||q.o.length!==5||!(q.a>=0&&q.a<5)))badq++;else if(q.k==="c"&&!Array.isArray(q.a))badq++;});
      if(dup)warn.push(`${X.ic} ${dup} domande con lo stesso testo`);if(badq)warn.push(`${X.ic} ${badq} domande malformate`);
      const noAnim=X.topics.filter(t=>t.anim&&!AN[t.anim]).map(t=>t.id);if(noAnim.length){X.topics.forEach(t=>{if(t.anim&&!AN[t.anim])delete t.anim;});fix.push(`${X.ic} animazioni mancanti nascoste: ${noAnim.join(", ")}`);}
      let gbad=0;(GEN[ex]||[]).forEach(G=>{for(let i=0;i<5;i++){if(!genQ(newGenId(ex,G)))gbad++;}});if(gbad)warn.push(`${X.ic} ${gbad} varianti numeriche non generate`);
      okk.push(`${X.ic} ${X.qb.length} domande, ${X.topics.length} argomenti, ${X.topics.filter(t=>t.anim&&AN[t.anim]).length} animazioni, ${X.pt.length} domande del test d'ingresso, ${(GEN[ex]||[]).length} calcoli a numeri variabili`);}
  });}catch(err){warn.push("Errore durante il controllo: "+(err&&err.message||err));}
  try{const sz=JSON.stringify(Rt).length;okk.push(`Dati salvati: ${(sz/1024).toFixed(0)} kB su questo dispositivo`);if(sz>3.5e6)warn.push("I dati salvati sono molto grandi: salva una copia su File / iCloud");localStorage.setItem("semestre-test","1");localStorage.removeItem("semestre-test");}catch(err){warn.push("La memoria del browser non accetta scritture: i dati restano nel database del dispositivo");}
  const r={at:new Date().toISOString(),full:!!full,fix,warn,ok:okk,ms:Date.now()-t0};Rt.diag=r;Rt.diagLog=(Array.isArray(Rt.diagLog)?Rt.diagLog:[]).concat([{at:r.at,f:fix.length,w:warn.length,full:!!full,fix:fix.slice(0,8),warn:warn.slice(0,8)}]).slice(-40);
  try{if(navigator.storage&&navigator.storage.persisted)navigator.storage.persisted().then(p=>{Rt.diag.persist=p;}).catch(()=>{});}catch(e){}
  return r;}
function diagDaily(){try{const last=Rt.diagLog&&Rt.diagLog.filter(x=>x.full).slice(-1)[0];if(!last||last.at.slice(0,10)!==today()){diagnosi(true);save();}}catch(e){}}
function diagHTML(){const d=Rt.diag;const L=(Rt.diagLog||[]).slice().reverse();
  const head=`<h3>🩺 Autodiagnosi${d?` <span class="pill ${d.warn.length?"soon":"ok"}">${d.warn.length?d.warn.length+" avvisi":"tutto in ordine"}</span>`:""}</h3>`;
  const body=`<p class="lbl" style="margin-top:0">Ogni giorno, all'apertura, l'app controlla da sola dati e contenuti; alla chiusura ripete il controllo dei dati. Quello che può correggere lo corregge in automatico, senza chiedere nulla. ${d?`Ultimo controllo: <b>${new Date(d.at).toLocaleString("it-IT",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})}</b>.`:""}</p>
   ${d?`${d.ok.map(x=>`<div class="drow ok">✓ ${esc(x)}</div>`).join("")}${d.fix.map(x=>`<div class="drow fx">🔧 Corretto: ${esc(x)}</div>`).join("")}${d.warn.map(x=>`<div class="drow wn">⚠️ ${esc(x)}</div>`).join("")}${d.fix.length||d.warn.length?"":`<div class="drow ok">✓ Nessun problema trovato</div>`}`:""}
   ${DEST?`<div class="drow ${DEST.ok?"ok":"wn"}">🛰️ Verifica esterna giornaliera (${esc(new Date(DEST.at).toLocaleString("it-IT",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"}))}): ${esc(DEST.sintesi||"")}${DEST.corretti&&DEST.corretti.length?`<br><span class="lbl">Corretto: ${esc(DEST.corretti.join(" · "))}</span>`:""}</div>`:""}
   <div class="btns"><button class="btn sm" id="diagRun">Esegui ora</button></div>
   ${L.length?`<details class="esv"><summary><b>Registro dei controlli</b> (${L.length})</summary>${L.map(x=>`<div class="drow">${new Date(x.at).toLocaleString("it-IT",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})} · ${x.full?"completo":"chiusura"} · ${x.f} correzioni · ${x.w} avvisi${(x.fix||[]).concat(x.warn||[]).length?`<br><span class="lbl">${esc((x.fix||[]).concat(x.warn||[]).join(" · "))}</span>`:""}</div>`).join("")}</details>`:""}`;
  return fold("diag",head,body,false);}
function aspettoHTML(){const u=UI();return fold("aspetto",`<h3>🎨 Aspetto e sfondo</h3>`,`<p class="lbl" style="margin-top:0">Lo sfondo «a tema» cambia da solo con la materia che stai studiando: atomi e onde per Fisica, anelli e provette per Chimica, DNA e cellule per Biologia.</p>
  <p class="lbl" style="margin:8px 0 4px"><b>Sfondo</b></p><div class="segc wrapc" data-ui="bg">${BG_OPT.map(([k,t])=>`<button type="button" data-v="${k}" class="${u.bg===k?"on":""}">${t}</button>`).join("")}</div>
  <p class="lbl" style="margin:10px 0 4px"><b>Intensità del disegno</b></p><div class="segc" data-ui="int">${INT_OPT.map(([k,t])=>`<button type="button" data-v="${k}" class="${u.int===k?"on":""}">${t}</button>`).join("")}</div>
  <p class="lbl" style="margin:10px 0 4px"><b>Densità</b></p><div class="segc" data-ui="dens">${[["snella","Snella"],["ampia","Ampia"]].map(([k,t])=>`<button type="button" data-v="${k}" class="${u.dens===k?"on":""}">${t}</button>`).join("")}</div>`,true);}
document.addEventListener("click",e=>{const b=e.target.closest("[data-ui] button");if(b){const k=b.closest("[data-ui]").dataset.ui;UI()[k]=b.dataset.v;b.parentNode.querySelectorAll("button").forEach(x=>x.classList.toggle("on",x===b));save();applyBg();return;}
  const sg=e.target.closest("[data-sug]");if(sg){QS_=sg.dataset.sug;const i=$("srch");if(i)i.value=QS_;const r=$("srchRes");if(r)r.innerHTML=cercaRes(QS_);return;}
  const qf=e.target.closest("[data-qf]");if(qf)QFOCUS=qf.dataset.qf;
  const nf=e.target.closest("[data-nf]");if(nf){NFILT=nf.dataset.nf;render();return;}
  if(e.target.closest("#newsUpd")){toast("Cerco aggiornamenti…");newsRefresh(true);return;}
  if(e.target.closest("#diagRun")){diagnosi(true);save();render();toast("Autodiagnosi completata");return;}
  if(e.target.closest("[data-mtog]")){setFold("side-menu",!isOpen("side-menu",false));side();return;}
  /* menu delle materie: la freccia apre/chiude sempre; toccare di nuovo la materia già aperta richiude l'albero */
  const sf=e.target.closest("[data-sfold]");if(sf){e.stopPropagation();const k="side-"+sf.dataset.sfold,v=!isOpen(k,sf.dataset.on==="1");if(v)EXORD.forEach(x=>{if("side-"+x!==k)setFold("side-"+x,0);});setFold(k,v);side();return;}
  const ex=e.target.closest("#side .exb");if(ex){const k=ex.dataset.go,act=(view.startsWith("ex:")||view==="arg")&&EX===k;
    if(act){e.stopPropagation();setFold("side-"+k,!isOpen("side-"+k,true));side();return;}
    EXORD.forEach(x=>setFold("side-"+x,x===k?1:0));}
  if(e.target.closest("#side [data-go]")&&isOpen("side-menu",false))setFold("side-menu",false);},true);
