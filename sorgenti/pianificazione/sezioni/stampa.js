/* ---------- 🗞️ STAMPA DI OGGI: le notizie principali, generali e di Torino ----------
   Sezioni: Italia, Mondo, 🌐 Stampa estera (testate straniere, sintesi tradotte in italiano + link «leggi tradotto»), Economia, Torino, Piemonte, tempo libero, Cultura, Scienza e salute, Tecnologia (sport tolto il 21/11/2026).
   File pubblico stampa-oggi.json, scritto dall'attività programmata alle 5:01 (edizione del mattino) e alle 13:01 (edizione del pomeriggio)
   seguendo strumenti/STAMPA.md: titoli e sintesi con parole nostre, tono neutro, fonti e link di approfondimento.
   Sull'iPad resta una copia (pn-stampa) per quando manca internet; quali notizie hai aperto: pn-stampa-lette (solo su questo iPad). */
const ST_KEY="pn-stampa",ST_LKEY="pn-stampa-lette";
const ST_SEZ=[["italia","🇮🇹","Italia"],["mondo","🌍","Mondo"],["estero","🌐","Stampa estera"],["economia","💶","Economia"],["torino","🏙️","Torino"],["piemonte","🏔️","Piemonte"],["eventi","🎟️","Cose da fare a Torino e in Piemonte"],["spettacoli","🎬","Cinema e teatro a Torino"],["concerti","🎵","Concerti nei prossimi mesi"],["cultura","🎭","Cultura"],["scienza","🔬","Scienza e salute"],["tecnologia","💻","Tecnologia"]];
let stSez="",stBusy=false;
const stData=()=>lsJ(ST_KEY)||{sezioni:{}};
/* articoli stranieri: titolo e sintesi sono già in italiano; «leggi tradotto» apre l'originale tradotto in italiano da Google Traduttore */
const stTrad=u=>"https://translate.google.com/translate?sl=auto&tl=it&u="+encodeURIComponent(u);
const stLette=()=>lsJ(ST_LKEY)||{};
async function stFetch(force){const N=stData();if(stBusy||navigator.onLine===false)return;if(!force&&N.checked&&Date.now()-new Date(N.checked).getTime()<20*60e3)return;
  stBusy=true;try{const r=await fetch("stampa-oggi.json?t="+Date.now(),{cache:"no-store"});if(!r.ok)throw 0;const o=await r.json();if(o.app!=="stampa-oggi"||!o.sezioni)throw 0;
    const before=N.updated;o.checked=new Date().toISOString();try{localStorage.setItem(ST_KEY,JSON.stringify(o));}catch(e){}if(o.updated!==before&&(cur==="st"||cur==="cal"))softRender();if(force)toast(o.updated!==before?"🗞️ Edizione nuova":"Già aggiornata");}
  catch(e){try{N.checked=new Date().toISOString();localStorage.setItem(ST_KEY,JSON.stringify(N));}catch(x){}if(force)toast("Non riesco a scaricare l'edizione: riprova con internet");}finally{stBusy=false;}}
setTimeout(stFetch,1800);
document.addEventListener("visibilitychange",()=>{if(!document.hidden)stFetch();});
const stAll=()=>{const S=stData().sezioni||{};return ST_SEZ.flatMap(([k])=>(S[k]||[]).map(n=>Object.assign({sez:k},n)));};
const stOre=()=>{const u=stData().updated;return u?(Date.now()-new Date(u).getTime())/36e5:Infinity;};
function stQuando(){const N=stData();if(!N.updated)return "";const d=new Date(N.updated);
  return (N.edizione==="pomeriggio"?"🌤️ Edizione del pomeriggio":N.edizione==="sera"?"🌙 Edizione della sera":"☀️ Edizione del mattino")+" · "+d.toLocaleDateString("it-IT",{weekday:"long",day:"numeric",month:"long"})+", "+d.toLocaleTimeString("it-IT",{hour:"2-digit",minute:"2-digit"});}

/* 21/11/2026 (scelte del proprietario «1 tutto 2 tutte 3 più notizie 4 implementiamo 5 subito»): la Stampa come un giornale.
   📰 Prima pagina (notizia principale grande + 4 medie + «Oggi a Torino») e quattro linguette:
   🗞️ Notizie (Italia, Mondo, Stampa estera, Economia, Scienza e salute, Tecnologia) · 🏙️ Torino e Piemonte ·
   ⭐ Per me (contratto e pensione, mercati, IA e app: le notizie già presenti in Pensione e Cultura digitale, con il rimando alla sezione) ·
   🎟️ Tempo libero (cose da fare, cinema e teatro, concerti, cultura). Sport tolto. Due colonne larghe, riquadri apri-e-chiudi,
   filtro «solo da leggere» (pn-stampa-f, solo su questo iPad). */
const ST_TABS=[["not","🗞️ Notizie",["italia","mondo","estero","economia","scienza","tecnologia"]],["to","🏙️ Torino e Piemonte",["torino","piemonte"]],["me","⭐ Per me",[]],["tl","🎟️ Tempo libero",["eventi","spettacoli","concerti","cultura"]]];
let stTab=(()=>{try{return sessionStorage.getItem("pn-stampa-tab")||"not";}catch(e){return "not";}})();
const stSolo=()=>{try{return localStorage.getItem("pn-stampa-f")==="1";}catch(e){return false;}};
const stIc=k=>(ST_SEZ.find(x=>x[0]===k)||[])[1]||"🗞️";
const stFonti=n=>`<div class="st-f">${(n.fonti||[]).map(f=>`<a href="${esc(f.url)}" target="_blank" rel="noopener noreferrer" data-stl="${esc(n.id)}">${esc(f.n)}${f.l&&f.l!=="it"?` <span class="st-lang">${esc(f.l.toUpperCase())}</span>`:""} ›</a>${f.l&&f.l!=="it"?`<a class="st-tr" href="${stTrad(f.url)}" target="_blank" rel="noopener noreferrer" data-stl="${esc(n.id)}">🔤 leggi tradotto</a>`:""}`).join("")}${(n.link||[]).map(f=>`<a class="st-ap" href="${esc(f.url)}" target="_blank" rel="noopener noreferrer" data-stl="${esc(n.id)}">🔎 ${esc(f.n)}</a>`).join("")}</div>`;
const stArt=(k,n,L,top)=>`<article class="st-n${top?" st-top":""}${L[n.id]?" st-read":""}"><h3 class="st-t">${esc(n.t)}</h3>${n.quando||n.dove?`<p class="st-ev">${n.quando?"📅 "+esc(n.quando):""}${n.quando&&n.dove?" · ":""}${n.dove?"📍 "+esc(n.dove):""}${n.costo?" · 💶 "+esc(n.costo):""}</p>`:""}<p class="st-s">${esc(n.s)}</p>${["eventi","spettacoli","concerti"].includes(k)?`<p class="st-ev">${typeof TL==="function"&&TL().voci.some(v=>v.src===n.id)?`<span class="pill">✓ nel 🎟️ Tempo libero</span>`:`<button class="btn sm" data-tladd="${esc(n.id)}">➕ Voglio andarci</button>`}</p>`:""}${stFonti(n)}</article>`;
function stPrima(S,L){const pick=k=>(S[k]||[])[0],hero=pick("italia")||pick("mondo");if(!hero)return "";
  const med=["mondo","estero","economia","torino"].map(k=>[k,pick(k)]).filter(([k,n])=>n&&n!==hero),oggi=(S.torino||[]).slice(1,4),tutte=stAll(),da=tutte.filter(n=>!L[n.id]).length;
  return `<div class="card k-st nofold st-prima"><div class="st-ph"><b>📰 Prima pagina</b><span class="lbl">${da} ${da===1?"notizia":"notizie"} da leggere su ${tutte.length}</span></div>
    <div class="st-pg"><div class="st-hero">${stArt("italia",hero,L,true)}</div><div class="st-med">${med.map(([k,n])=>`<article class="st-m${L[n.id]?" st-read":""}"><span class="st-k">${stIc(k)} ${esc((ST_SEZ.find(x=>x[0]===k)||[])[2]||"")}</span><b>${esc(n.t)}</b>${stFonti(n)}</article>`).join("")}</div></div>
    ${oggi.length?`<div class="st-oggi"><b>🏙️ Oggi a Torino</b>${oggi.map(n=>`<span>· ${esc(n.t)}</span>`).join("")}</div>`:""}</div>`;}
function stSezCard(k,S,L){const s=ST_SEZ.find(x=>x[0]===k);if(!s)return "";const A0=S[k]||[],A=stSolo()?A0.filter(n=>!L[n.id]):A0;if(!A0.length)return "";
  return `<div class="card k-st"><h3>${s[1]} ${s[2]} <span class="lbl" style="margin-left:auto">${A.length<A0.length?A.length+" / ":""}${A0.length}</span></h3>${A.length?A.map((n,i)=>stArt(k,n,L,false)).join(""):`<p class="lbl">Tutte lette ✓</p>`}</div>`;}
/* ⭐ Per me: le notizie che l'app ha già (Pensione → Novità e mercati; Cultura digitale → Novità), qui in breve, con il rimando */
function stPerMe(){let o="";
  if(typeof newsList==="function"){const V=newsList().slice(0,6);
    o+=`<div class="card k-st"><h3>🎖️ Contratto e pensione</h3>${V.length?V.map(v=>`<article class="st-n"><h3 class="st-t">${esc(v.titolo)}</h3><p class="st-ev">${fmt(v.d,{day:"numeric",month:"long"})}${v.fonte?" · "+esc(v.fonte):""}</p><p class="st-s">${esc(String(v.sintesi||"").split(/\s+/).slice(0,45).join(" "))}${String(v.sintesi||"").split(/\s+/).length>45?"…":""}</p>${/^https:\/\//.test(v.url||"")?`<div class="st-f"><a href="${esc(v.url)}" target="_blank" rel="noopener noreferrer">${esc(v.fonte||"Fonte")} ›</a></div>`:""}</article>`).join(""):`<p class="lbl">Ancora nessuna novità scaricata.</p>`}
      <div class="btns"><button class="btn sm" data-stgo="pens">Tutte in 🎖️ Pensione › Novità</button></div></div>`;
    const M=(newsData().mercati||[]),pick=["infl","bce","btp2","btp5","btp10","cd12"].map(id=>M.find(x=>x.id===id)).filter(Boolean);
    o+=`<div class="card k-st"><h3>📈 Mercati</h3>${pick.length?`<div class="st-mk">${pick.map(m=>`<div><b>${esc(String(m.valore).replace(".",","))}${esc(m.unita||"")}</b><span>${esc(m.t)}</span><small>${m.d?fmt(m.d,{day:"numeric",month:"short"}):""}${m.fonte?" · "+esc(m.fonte):""}</small></div>`).join("")}</div>`:`<p class="lbl">Dati non ancora scaricati.</p>`}
      <p class="lbl" style="margin:8px 0 0">Solo dati con data e fonte, non consigli.</p><div class="btns"><button class="btn sm" data-stgo="pens">Tutti in 🎖️ Pensione › Novità</button></div></div>`;}
  if(typeof cdNov==="function"){const V=(cdNov().voci||[]).slice().sort((a,b)=>a.d<b.d?1:-1).slice(0,5);
    o+=`<div class="card k-st"><h3>🤖 IA e app</h3>${V.length?V.map(v=>`<article class="st-n"><h3 class="st-t">${esc(v.t)}</h3><p class="st-ev">${fmt(v.d,{day:"numeric",month:"long",year:"numeric"})}${v.fonte?" · "+esc(v.fonte):""}</p><p class="st-s">${esc(v.s||"")}</p>${/^https:\/\//.test(v.url||"")?`<div class="st-f"><a href="${esc(v.url)}" target="_blank" rel="noopener noreferrer">${esc(v.fonte||"Fonte")} ›</a></div>`:""}</article>`).join(""):`<p class="lbl">Ancora nessuna novità scaricata.</p>`}
      <div class="btns"><button class="btn sm" data-stgo="cd">Tutte in 🤖 Cultura digitale › Novità</button></div></div>`;}
  return o;}
function vSt(){const N=stData(),S=N.sezioni||{},L=stLette(),old=stOre()>30;
  if(typeof newsFetch==="function")newsFetch(false);if(typeof cdNovFetch==="function")cdNovFetch();
  let o=`<h1>🗞️ Stampa di oggi</h1><p class="sub">Le notizie principali dai quotidiani online italiani ed esteri (tradotte in italiano), di Torino e del Piemonte, più le novità che ti riguardano: aggiornate ogni giorno alle 6 e alle 13, con le fonti per approfondire.</p>`;
  o+=`<div class="st-head"><span class="pill st-ed">${N.updated?esc(stQuando()):"in attesa della prima edizione"}</span><button class="btn sm" id="stRefresh">🔄 Aggiorna</button><button class="btn sm${stSolo()?" pri":""}" id="stSolo">${stSolo()?"✓ ":""}Solo da leggere</button></div>`;
  if(N.updated&&old)o+=`<p class="st-old">⚠️ Questa edizione ha più di un giorno: la prossima arriva alle ${new Date().getHours()<13&&new Date().getHours()>=6?"13":"6"}.</p>`;
  if(!N.updated)return o+`<div class="card k-st nofold"><p class="empty">Le notizie arrivano da internet: apri la sezione quando sei collegato.</p></div>`;
  o+=stPrima(S,L);
  o+=`<div class="seg st-tabs" role="tablist">${ST_TABS.map(([k,n,ks])=>{const c=ks.reduce((a,x)=>a+((S[x]||[]).filter(z=>!L[z.id]).length),0);return `<button role="tab" data-sttab="${k}" class="${stTab===k?"on":""}" aria-selected="${stTab===k}">${n}${c?` <span class="st-c">${c}</span>`:""}</button>`;}).join("")}</div>`;
  const T=ST_TABS.find(t=>t[0]===stTab)||ST_TABS[0];
  o+=`<div class="cols2 st-cols">`+(T[0]==="me"?stPerMe():T[2].map(k=>stSezCard(k,S,L)).join(""))+`</div>`;
  o+=`<p class="lbl" style="margin-top:12px">Titoli e sintesi sono scritti per questa app con parole proprie, in tono neutro, partendo dalle testate indicate: per il testo completo apri la fonte (alcuni articoli sono riservati agli abbonati). Non sono opinioni né consigli.</p>`;
  return o;}

/* riquadro nel riepilogo di oggi: le prime notizie generali e di Torino */
function stCard(){const S=stData().sezioni||{};if(!stData().updated)return "";const g=[...(S.italia||[]).slice(0,2),...(S.mondo||[]).slice(0,1)],t=(S.torino||[]).slice(0,2);
  if(!g.length&&!t.length)return "";
  return `<div class="card k-st"><h3>🗞️ Stampa di oggi <button class="lnk" data-go="st">Tutte ›</button></h3><div class="lbl">${esc(stQuando())}</div>${g.concat(t).map(n=>`<div class="row"><div class="grow"><b>${esc(n.t)}</b></div></div>`).join("")}</div>`;}

function bindSt(){document.querySelectorAll("[data-sttab]").forEach(b=>b.onclick=()=>{stTab=b.dataset.sttab;try{sessionStorage.setItem("pn-stampa-tab",stTab);}catch(e){}render();});
  const so=$("stSolo");if(so)so.onclick=()=>{try{localStorage.setItem("pn-stampa-f",stSolo()?"0":"1");}catch(e){}render();};
  document.querySelectorAll("[data-stgo]").forEach(b=>b.onclick=()=>{const g=b.dataset.stgo;if(g==="pens"){pensV="news";try{sessionStorage.setItem("pn-pensv","news");}catch(e){}}if(g==="cd")cdV="nov";go(g);});
  document.querySelectorAll("[data-sts]").forEach(b=>b.onclick=()=>{stSez=b.dataset.sts;render();});
  const r=$("stRefresh");if(r)r.onclick=()=>stFetch(true);
  document.querySelectorAll("[data-stl]").forEach(a=>a.addEventListener("click",()=>{const L=stLette();L[a.dataset.stl]=today();const k=Object.keys(L);if(k.length>300)k.slice(0,k.length-300).forEach(x=>delete L[x]);try{localStorage.setItem(ST_LKEY,JSON.stringify(L));}catch(e){}a.closest(".st-n")&&a.closest(".st-n").classList.add("st-read");}));}
