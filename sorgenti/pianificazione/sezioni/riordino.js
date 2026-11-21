/* ---------- 🧭 Riordino del menu (21/11/2026, proposte 2, 4, 10, 11 scelte dal proprietario) ----------
   Menu delle sezioni: Oggi · Piano · Calendario · Soldi · Benessere · Imparare · Altro.
   Ogni voce con più parti mostra in alto le sue linguette; le sezioni di prima restano tutte (stessi dati, stessi indirizzi):
   💶 Soldi     = 🎖️ Pensione (#pens) + 🌱 Investimenti (#inv)
   🧘 Benessere = panoramica (#bene) + 📓 Diario (#dia), con i collegamenti a Tai Chi e Ikigai
   📚 Imparare  = 🤖 Cultura digitale (#cd) + 🎓 Corsi online (#corsi), con «la prossima cosa da studiare»
   🧰 Altro     = 🚗 Auto, 🏢 Condominio, 🎟️ Tempo libero, 🗄️ Archivio, ⚙️ Impostazioni
   🗄️ Archivio: Auto ci va da sola quando la riconsegna è passata o segnata fatta; Licenze dopo l'ultimo giorno in servizio.
   Le date stanno solo nei dati dell'iPad: nel codice non c'è nessun dato personale.
   (Scritto dal lavoro programmato del 21/11, completato e provato nella conversazione.) */
const GRP={
  soldi:{ic:"💶",t:"Soldi",m:[["pens","🎖️ Pensione"],["inv","🌱 Investimenti"]]},
  bene:{ic:"🧘",t:"Benessere",m:[["bene","🧘 Come sto"],["dia","📓 Diario"]],link:[["taichi.html","🥋 Tai Chi ›"],["taichi.html#ikigai","🌸 Ikigai ›"]]},
  imp:{ic:"📚",t:"Imparare",m:[["cd","🤖 Cultura digitale"],["corsi","🎓 Corsi online"]]},
  altro:{ic:"🧰",t:"Altro",m:[["auto","🚗 Auto"],["condo","🏢 Condominio"],["tl","🎟️ Tempo libero"],["arch","🗄️ Archivio"],["set","⚙️ Impostazioni"]]}
};
const grpOf=k=>k==="altro"?"altro":Object.keys(GRP).find(g=>GRP[g].m.some(x=>x[0]===k))||k;
function grpLast(g){const L=GRP[g].m.map(x=>x[0]);let v="";try{v=sessionStorage.getItem("pn-grp-"+g)||"";}catch(e){}return L.includes(v)?v:L[0];}
function grpKeep(k){const g=grpOf(k);if(GRP[g]&&g!=="altro")try{sessionStorage.setItem("pn-grp-"+g,k);}catch(e){}}

/* ---------- 🗄️ Archivio a scadenza ---------- */
function arAuto(){const s=(P.scad||[]).find(x=>x.id==="auto-riconsegna"),t=today();
  if(s)return s.done?(s.d||t):(s.d&&s.d<t?s.d:"");
  return "";}
function arLic(){const s=lsJ("licenze-marco-v1");return s&&s.end&&s.end<today()?s.end:"";}

/* linguette in cima alle sezioni di un gruppo */
function grpHead(k){const g=grpOf(k),G=GRP[g];if(!G||k==="altro")return "";
  const M=G.m.filter(([x])=>!(x==="auto"&&arAuto()&&k!=="auto"));
  let o=`<div class="grp"><span class="grp-t">${G.ic} ${G.t}</span><div class="seg grp-tabs" role="tablist">${M.map(([x,n])=>`<button role="tab" data-s="${x}" class="${x===k?"on":""}" aria-selected="${x===k}">${n}</button>`).join("")}${(G.link||[]).map(([h,n])=>`<a class="grp-l" href="${h}">${n}</a>`).join("")}</div></div>`;
  if(g==="imp")o+=impNext();
  return o;}

/* 📚 la prossima cosa da studiare */
function impNext(){const R=[],C=(P.corsi&&P.corsi.st)||{};
  try{if(typeof cdPronto==="function"&&cdPronto()){const c=CD(),nx=CD_LIV.filter(cdAperto).map(cdDel).flat().find(s=>!c.fatte[s.id]),due=cdDue().length;
    R.push(nx?`<div class="row"><div class="grow"><b>🤖 ${esc(nx.t)}</b><small>prossima scheda${nx.liv?" · livello "+nx.liv:""}${due?` · ${due} ${due===1?"domanda":"domande"} da ripassare`:""}</small></div><button class="btn sm" data-impcd="${esc(nx.id)}">Apri</button></div>`
      :`<div class="row"><div class="grow"><b>🤖 Cultura digitale</b><small>schede aperte tutte fatte${due?` · ${due} da ripassare`:""}</small></div><button class="btn sm" data-s="cd">Apri</button></div>`);}}catch(e){}
  if(typeof CO_D!=="undefined"){const L=CO_D.corsi||[],inC=L.find(c=>C[c.id]==="in"),da=L.find(c=>C[c.id]==="da");
    R.push(inC?`<div class="row"><div class="grow"><b>▶️ ${esc(inC.titolo)}</b><small>corso in corso · ${esc(inC.ente)}</small></div><a class="btn sm" href="${esc(inC.url)}" target="_blank" rel="noopener">Continua ›</a></div>`
      :da?`<div class="row"><div class="grow"><b>⭐ ${esc(da.titolo)}</b><small>corso da cominciare · ${esc(da.ente)}</small></div><button class="btn sm" data-s="corsi">Apri</button></div>`
      :`<div class="row"><div class="grow"><b>🎓 Nessun corso in corso</b><small>scegline uno con ⭐ nei Corsi online</small></div><button class="btn sm" data-s="corsi">Scegli</button></div>`);}
  return R.length?`<div class="card k-cd nofold imp-next"><div class="lbl" style="margin:0 0 4px"><b>📌 La prossima cosa da studiare</b></div>${R.join("")}</div>`:"";}

/* 🧘 Benessere: come sto e i collegamenti */
function vBene(){let o=`<h1>🧘 Come sto</h1><p class="sub">Umore, sonno e Tai Chi delle ultime settimane. L’umore e il sonno si segnano nel giorno di ☀️ Oggi; il Tai Chi nella sua pagina.</p><div class="cols2">`;
  o+=benCard();
  o+=`<div class="card k-ben"><h3>🔗 Dove andare</h3>
    <a class="row" href="taichi.html"><div class="grow"><b>🥋 Tai Chi</b><small>sessioni, esercizi e andamento</small></div><span class="pill">Apri ›</span></a>
    <a class="row" href="taichi.html#ikigai"><div class="grow"><b>🌸 Ikigai</b><small>capitoli, Naikan della settimana, volontariato</small></div><span class="pill">Apri ›</span></a>
    <button class="row alt-row" data-s="dia"><div class="grow"><b>📓 Diario del passaggio</b><small>due righe al giorno, le tappe e la lettera</small></div><span class="pill">Apri ›</span></button></div>`;
  return o+`</div>`;}
function beneMini(){const t=today(),d=benDay(t),um=[...Array(7)].map((_,i)=>+(benDay(add(t,-i)).umore||0)).filter(Boolean);
  let tc=0;try{tc=tcSessions().filter(s=>s.d>=monday(t)&&s.d<add(monday(t),7)).length;}catch(e){}
  const m=um.length?Math.round(um.reduce((a,b)=>a+b,0)/um.length*10)/10:null;
  return {oggi:d.umore?+d.umore:null,m,n:um.length,tc};}

/* 🧰 Altro */
function vAltro(){const a=arAuto(),nA=(a?1:0)+(arLic()?1:0);
  const T=[["auto","🚗","Auto","riconsegna del noleggio e confronto dei costi"],["condo","🏢","Condominio","rate, spese e rendiconto"],["tl","🎟️","Tempo libero","libri, film, teatro, concerti"],["arch","🗄️","Archivio",nA?nA+" "+(nA===1?"sezione conclusa":"sezioni concluse"):"vuoto: qui finiscono le sezioni concluse"],["set","⚙️","Impostazioni","blocco, Calendario dell’iPad, copie, testo"]].filter(x=>!(x[0]==="auto"&&a));
  return `<h1>🧰 Altro</h1><p class="sub">Le sezioni che servono ogni tanto.</p><div class="alt-g">${T.map(([k,i,n,s])=>`<button class="card alt-t nofold" data-s="${k}"><span class="alt-i">${i}</span><b>${n}</b><small>${esc(s)}</small></button>`).join("")}</div>`;}

/* 🗄️ Archivio */
function vArch(){const a=arAuto(),l=arLic(),D=d=>fmt(d,{day:"numeric",month:"long",year:"numeric"});
  let o=`<h1>🗄️ Archivio</h1><p class="sub">Le sezioni concluse escono da sole dal menu e restano qui, con tutti i loro dati. Auto ci arriva quando la riconsegna è passata o segnata fatta; Licenze dopo l’ultimo giorno in servizio.</p>`;
  if(!a&&!l)return o+`<div class="card nofold"><p class="empty">Per ora l’archivio è vuoto: tutte le sezioni sono ancora in uso.</p></div>`;
  o+=`<div class="alt-g">`;
  if(a)o+=`<button class="card alt-t nofold" data-s="auto"><span class="alt-i">🚗</span><b>Auto</b><small>riconsegna del ${esc(D(a))} · checklist e confronto dei costi</small></button>`;
  if(l)o+=`<a class="card alt-t nofold" href="licenze.html"><span class="alt-i">📅</span><b>Licenze</b><small>ultimo giorno in servizio: ${esc(D(l))}</small></a>`;
  return o+`</div>`;}

/* ☀️ Oggi in breve: le 3 priorità, la prossima scadenza, come sto */
function ogTop(){const t=today(),pr=(typeof piPrio==="function"?piPrio():[]).slice(0,3);
  let I=[];try{I=piItems().filter(x=>x.d);}catch(e){}
  const nx=I[0],b=beneMini();
  let o=`<div class="og-top">`;
  o+=`<div class="card k-piano nofold"><h3>🎯 Priorità della settimana</h3>${pr.length?`<ol class="pi-pr">${pr.map(p=>`<li>${esc(p)}</li>`).join("")}</ol>`:`<p class="empty">Nessuna ancora: le scegli nella revisione della settimana.</p>`}<div class="btns"><button class="btn sm" data-pigo2="sett">🧭 ${pr.length?"Piano":"Scegli le priorità"}</button></div></div>`;
  o+=`<div class="card k-scad nofold"><h3>📌 Prossima scadenza</h3>${nx?`<div class="og-big">${esc(nx.t)}</div><div class="lbl">${fmt(nx.d,{weekday:"long",day:"numeric",month:"long"})} · ${nx.d<t?`<b style="color:var(--scad)">scaduta</b>`:rel(nx.d)} · ${nx.src}</div>`:`<p class="empty">Nessuna scadenza aperta. 👍</p>`}<div class="btns"><button class="btn sm" data-pigo2="fare">✅ Tutte le cose da fare</button></div></div>`;
  o+=`<div class="card k-ben nofold"><h3>🧘 Come sto</h3><div class="og-big">${b.oggi?UMORE[b.oggi-1]+" umore "+b.oggi+"/5":"umore di oggi da segnare"}</div><div class="lbl">${b.m!=null?`media degli ultimi 7 giorni: ${String(b.m).replace(".",",")} (${b.n} ${b.n===1?"giorno":"giorni"} segnati) · `:""}Tai Chi questa settimana: <b>${b.tc}</b></div><div class="btns"><button class="btn sm" data-s="bene">Benessere ›</button></div></div>`;
  return o+`</div>`;}

function bindRiordino(){document.querySelectorAll("[data-impcd]").forEach(b=>b.onclick=()=>{try{cdV="perc";cdSel=b.dataset.impcd;}catch(e){}go("cd");});}
