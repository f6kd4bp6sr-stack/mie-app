/* ---------- 🗞️ STAMPA DI OGGI: le notizie principali, generali e di Torino ----------
   Sezioni: Italia, Mondo, 🌐 Stampa estera (testate straniere, sintesi tradotte in italiano + link «leggi tradotto»), Economia, Torino, Cultura, Sport.
   File pubblico stampa-oggi.json, scritto dall'attività programmata alle 6 (edizione del mattino) e alle 22 (edizione della sera)
   seguendo strumenti/STAMPA.md: titoli e sintesi con parole nostre, tono neutro, fonti e link di approfondimento.
   Sull'iPad resta una copia (pn-stampa) per quando manca internet; quali notizie hai aperto: pn-stampa-lette (solo su questo iPad). */
const ST_KEY="pn-stampa",ST_LKEY="pn-stampa-lette";
const ST_SEZ=[["italia","🇮🇹","Italia"],["mondo","🌍","Mondo"],["estero","🌐","Stampa estera"],["economia","💶","Economia"],["torino","🏙️","Torino"],["cultura","🎭","Cultura"],["sport","⚽","Sport"]];
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
  return (N.edizione==="sera"?"🌙 Edizione della sera":"☀️ Edizione del mattino")+" · "+d.toLocaleDateString("it-IT",{weekday:"long",day:"numeric",month:"long"})+", "+d.toLocaleTimeString("it-IT",{hour:"2-digit",minute:"2-digit"});}

function vSt(){const N=stData(),S=N.sezioni||{},L=stLette(),old=stOre()>30;
  let o=`<h1>🗞️ Stampa di oggi</h1><p class="sub">Le notizie principali dai quotidiani online italiani ed esteri (tradotte in italiano), generali e di Torino: aggiornate ogni giorno alle 6 e alle 22, con le fonti per approfondire.</p>`;
  o+=`<div class="st-head"><span class="pill st-ed">${N.updated?esc(stQuando()):"in attesa della prima edizione"}</span><button class="btn sm" id="stRefresh">🔄 Aggiorna</button></div>`;
  if(N.updated&&old)o+=`<p class="st-old">⚠️ Questa edizione ha più di un giorno: la prossima arriva alle ${new Date().getHours()<22&&new Date().getHours()>=6?"22":"6"}.</p>`;
  const tabs=[["","📰","Tutte"]].concat(ST_SEZ.filter(([k])=>(S[k]||[]).length));
  o+=`<div class="seg" role="tablist" style="margin:12px 0 14px;width:max-content;max-width:100%">${tabs.map(([k,i,t])=>`<button role="tab" data-sts="${k}" class="${stSez===k?"on":""}">${i} ${t}</button>`).join("")}</div>`;
  if(!N.updated)return o+`<div class="card k-st nofold"><p class="empty">Le notizie arrivano da internet: apri la sezione quando sei collegato.</p></div>`;
  (stSez?ST_SEZ.filter(([k])=>k===stSez):ST_SEZ).forEach(([k,ic,t])=>{const A=S[k]||[];if(!A.length)return;
    o+=`<h2>${ic} ${t}</h2><div class="card k-st nofold">${A.map((n,i)=>`<article class="st-n${i===0?" st-top":""}${L[n.id]?" st-read":""}"><h3 class="st-t">${esc(n.t)}</h3><p class="st-s">${esc(n.s)}</p>
      <div class="st-f">${(n.fonti||[]).map(f=>`<a href="${esc(f.url)}" target="_blank" rel="noopener noreferrer" data-stl="${esc(n.id)}">${esc(f.n)}${f.l&&f.l!=="it"?` <span class="st-lang">${esc(f.l.toUpperCase())}</span>`:""} ›</a>${f.l&&f.l!=="it"?`<a class="st-tr" href="${stTrad(f.url)}" target="_blank" rel="noopener noreferrer" data-stl="${esc(n.id)}">🔤 leggi tradotto</a>`:""}`).join("")}${(n.link||[]).map(f=>`<a class="st-ap" href="${esc(f.url)}" target="_blank" rel="noopener noreferrer" data-stl="${esc(n.id)}">🔎 ${esc(f.n)}</a>`).join("")}</div></article>`).join("")}</div>`;});
  o+=`<p class="lbl" style="margin-top:12px">Titoli e sintesi sono scritti per questa app con parole proprie, in tono neutro, partendo dalle testate indicate: per il testo completo apri la fonte (alcuni articoli sono riservati agli abbonati). Non sono opinioni né consigli.</p>`;
  return o;}

/* riquadro nel riepilogo di oggi: le prime notizie generali e di Torino */
function stCard(){const S=stData().sezioni||{};if(!stData().updated)return "";const g=[...(S.italia||[]).slice(0,2),...(S.mondo||[]).slice(0,1)],t=(S.torino||[]).slice(0,2);
  if(!g.length&&!t.length)return "";
  return `<div class="card k-st"><h3>🗞️ Stampa di oggi <button class="lnk" data-go="st">Tutte ›</button></h3><div class="lbl">${esc(stQuando())}</div>${g.concat(t).map(n=>`<div class="row"><div class="grow"><b>${esc(n.t)}</b></div></div>`).join("")}</div>`;}

function bindSt(){document.querySelectorAll("[data-sts]").forEach(b=>b.onclick=()=>{stSez=b.dataset.sts;render();});
  const r=$("stRefresh");if(r)r.onclick=()=>stFetch(true);
  document.querySelectorAll("[data-stl]").forEach(a=>a.addEventListener("click",()=>{const L=stLette();L[a.dataset.stl]=today();const k=Object.keys(L);if(k.length>300)k.slice(0,k.length-300).forEach(x=>delete L[x]);try{localStorage.setItem(ST_LKEY,JSON.stringify(L));}catch(e){}a.closest(".st-n")&&a.closest(".st-n").classList.add("st-read");}));}
