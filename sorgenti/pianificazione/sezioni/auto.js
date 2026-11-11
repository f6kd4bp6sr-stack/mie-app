/* ---------- 🚗 Auto (3/11/2026, proposta n. 7 approvata): fine del noleggio, riconsegna e confronto dei costi ----------
   I dati restano solo su questo iPad (P.auto, nelle copie come il resto): nel codice non c'è nessun dato personale.
   Il confronto fa solo i conti con i numeri inseriti: nessun consiglio, nessuna classifica. */
const AU_CHECK=[
  ["prima","📄","Rileggi il contratto: data, luogo e orario della riconsegna, chilometri inclusi e costo di quelli in più."],
  ["prima","📞","Se il contratto lo chiede, prenota l’appuntamento per la riconsegna."],
  ["prima","📸","Fai foto e un breve video dell’auto con la luce del giorno: carrozzeria, cerchi, vetri, interni, gomme e cruscotto con chilometri, carburante ed eventuali spie accese."],
  ["prima","🔍","Guarda bene graffi, ammaccature e vetri: confronta con quello che il contratto considera usura normale."],
  ["prima","🧽","Lava l’auto e pulisci gli interni."],
  ["prima","⛽","Lascia il carburante al livello previsto dal contratto."],
  ["prima","🎒","Togli le cose personali (portaoggetti, bagagliaio, sotto i sedili) e cancella dal sistema dell’auto il telefono collegato e gli indirizzi salvati."],
  ["prima","🔑","Prepara libretto e documenti, tutte le chiavi e gli accessori consegnati con l’auto (per esempio kit di riparazione, cavi, catene, gomme invernali e dispositivo di telepedaggio, se te li ha dati il noleggiatore)."],
  ["alla","🧾","Alla riconsegna partecipa al controllo dell’auto, leggi il verbale prima di firmare e chiedine una copia. Spesso la perizia definitiva si fa dopo, anche da una società esterna: chiedi anche quella e confrontala con le tue foto."],
  ["alla","🔢","Annota i chilometri finali e il livello del carburante."],
  ["dopo","🗂️","Conserva verbale, foto e ricevute finché il contratto non è chiuso del tutto."],
  ["dopo","💶","Controlla la fattura finale (chilometri in più, eventuali danni) e, se non sei d’accordo, scrivi entro i tempi indicati nel contratto."],
  ["dopo","📬","Le multe prese prima della riconsegna possono arrivare anche mesi dopo, con in più una spesa di gestione del noleggiatore: conserva le date."],
  ["dopo","📵","Aggiorna o disdici i servizi legati alla targa: telepedaggio, app di parcheggio, permessi."]
];
const AU_FASI={prima:"Prima della riconsegna",alla:"Il giorno della riconsegna",dopo:"Dopo"};
const AU_CAMPI=[["n","Nome dell’offerta","text"],["mesi","Durata (mesi)","num"],["ant","Anticipo €","num"],["can","Canone al mese €","num"],["km","Km all’anno inclusi","num"],["ass","Assicurazione all’anno € (se non inclusa)","num"],["bol","Bollo all’anno € (se non incluso)","num"],["man","Manutenzione all’anno € (se non inclusa)","num"],["alt","Altre spese all’anno €","num"]];
let auEdit=-1;
function auD(){P.auto=P.auto||{};const A=P.auto;A.chk=A.chk||{};A.opz=A.opz||[];return A;}
const auNum=v=>{const n=parseFloat(String(v==null?"":v).replace(/\./g,"").replace(",","."));return isFinite(n)?n:0;};
const auEur=n=>n.toLocaleString("it-IT",{style:"currency",currency:"EUR",maximumFractionDigits:0});
function auTot(o){const m=auNum(o.mesi);if(!m)return null;const anno=auNum(o.ass)+auNum(o.bol)+auNum(o.man)+auNum(o.alt);const t=auNum(o.ant)+auNum(o.can)*m+anno*m/12;return {t,mese:t/m,m};}
function auGiorni(d){if(!d)return null;return Math.round((new Date(d+"T12:00")-new Date(today()+"T12:00"))/864e5);}
function vAuto(){
  const A=auD(),g=auGiorni(A.scad),done=AU_CHECK.filter((_,i)=>A.chk[i]).length;
  let o=`<h1>🚗 Auto</h1><p class="sub">Fine del noleggio, riconsegna e confronto dei costi della prossima auto. I dati restano solo su questo iPad.</p>`;
  o+=`<div class="card k-auto"><h3>📅 Riconsegna</h3>`+
    (A.scad?`<p class="au-big">${g>0?`Mancano <b>${g}</b> ${g===1?"giorno":"giorni"}`:g===0?"<b>È oggi!</b>":`Era ${-g} ${g===-1?"giorno":"giorni"} fa`} · ${new Date(A.scad+"T12:00").toLocaleDateString("it-IT",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}${A.ora?" alle "+esc(A.ora):""}</p>`:`<p class="empty">Scrivi la data di fine del noleggio: la metto anche nelle Scadenze del Calendario.</p>`)+
    `<div class="au-form"><label>Data<input type="date" id="auScad" value="${esc(A.scad||"")}"></label><label>Ora<input type="time" id="auOra" value="${esc(A.ora||"")}"></label><label class="au-w">Dove<input id="auLuogo" maxlength="80" placeholder="es. sede o concessionaria" value="${esc(A.luogo||"")}"></label><label>Km attuali<input id="auKm" inputmode="numeric" maxlength="7" value="${esc(A.km||"")}"></label></div>`+
    `<div class="btns"><button class="btn" id="auSave">💾 Salva</button>${A.scad?`<button class="btn sm" id="auCal">📌 ${P.scad.some(x=>x.id==="auto-riconsegna")?"Aggiorna nel":"Metti nel"} Calendario</button>`:""}</div></div>`;
  o+=`<div class="card k-auto"><h3>✅ Checklist della riconsegna <span class="pill">${done} su ${AU_CHECK.length}</span></h3>`+
    Object.keys(AU_FASI).map(f=>`<h3>${AU_FASI[f]}</h3><ul class="au-chk">`+AU_CHECK.map((c,i)=>c[0]!==f?"":`<li><label><input type="checkbox" data-auc="${i}"${A.chk[i]?" checked":""}> ${c[1]} ${esc(c[2])}</label></li>`).join("")+`</ul>`).join("")+
    `<p class="lbl">Consigli generali: per i dettagli vale sempre il tuo contratto.</p></div>`;
  const R=A.opz.map((x,i)=>({x,i,c:auTot(x)}));
  o+=`<div class="card k-auto"><h3>🔢 Confronto dei costi della prossima auto</h3><p class="lbl">Scrivi le offerte che stai valutando: l’app somma anticipo, canoni e spese all’anno per tutta la durata. Fa solo i conti, non sceglie per te. Bollo, assicurazione e manutenzione spesso sono già nel canone: scrivi solo le spese <b>non comprese</b>, e metti tutti gli importi con l’IVA (oppure tutti senza).</p>`+
    (R.length?`<div class="au-tab"><div class="au-row au-h"><span>Offerta</span><span>Durata</span><span>Totale</span><span>Al mese</span><span>Km/anno</span><span></span></div>`+R.map(r=>`<div class="au-row"><span><b>${esc(r.x.n||"Offerta "+(r.i+1))}</b></span><span>${r.c?r.c.m+" mesi":"–"}</span><span>${r.c?auEur(r.c.t):"–"}</span><span>${r.c?auEur(r.c.mese):"–"}</span><span>${auNum(r.x.km)?auNum(r.x.km).toLocaleString("it-IT"):"–"}</span><span><button class="btn sm" data-aue="${r.i}">✏️</button></span></div>`).join("")+`</div>`:`<p class="empty">Nessuna offerta ancora.</p>`)+
    (auEdit>=-1&&auEdit!==-2?auForm(auEdit>=0?A.opz[auEdit]:null):"")+`</div>`;
  return o;
}
function auForm(x){
  x=x||{};
  return `<details class="more"${auEdit>=0?" open":""}><summary>${auEdit>=0?"✏️ Modifica l’offerta":"➕ Aggiungi un’offerta"}</summary><div class="au-form">`+AU_CAMPI.map(([k,t,ty])=>`<label${k==="n"?' class="au-w"':""}>${t}<input id="auO-${k}" ${ty==="num"?'inputmode="decimal"':""} maxlength="${k==="n"?60:9}" value="${esc(x[k]==null?"":x[k])}"></label>`).join("")+
    `</div><div class="btns"><button class="btn" id="auOSave">💾 ${auEdit>=0?"Salva le modifiche":"Aggiungi"}</button>${auEdit>=0?`<button class="btn sm" id="auODel">🗑️ Togli</button><button class="btn sm" id="auONo">Annulla</button>`:""}</div></details>`;
}
function bindAuto(){
  const A=auD();
  if($("auSave"))$("auSave").onclick=()=>{A.scad=$("auScad").value||"";A.ora=$("auOra").value||"";A.luogo=$("auLuogo").value.trim();A.km=$("auKm").value.trim();
    const s=P.scad.find(x=>x.id==="auto-riconsegna");if(s&&A.scad){s.d=A.scad;s.note=[A.ora,A.luogo].filter(Boolean).join(" · ");}
    save();render();toast("🚗 Salvato");};
  if($("auCal"))$("auCal").onclick=()=>{let s=P.scad.find(x=>x.id==="auto-riconsegna");const note=[A.ora,A.luogo].filter(Boolean).join(" · ");
    if(s){s.d=A.scad;s.note=note;s.done=false;}else P.scad.push({id:"auto-riconsegna",t:"🚗 Riconsegna dell’auto a noleggio",d:A.scad,cat:"auto",ric:"",av:7,note,done:false});
    save();render();toast("📌 Nelle Scadenze del Calendario, con avviso 7 giorni prima");};
  document.querySelectorAll("[data-auc]").forEach(c=>c.onchange=()=>{A.chk[c.dataset.auc]=c.checked?1:0;save();render();});
  document.querySelectorAll("[data-aue]").forEach(b=>b.onclick=()=>{auEdit=+b.dataset.aue;render();});
  if($("auOSave"))$("auOSave").onclick=()=>{const o={};AU_CAMPI.forEach(([k,,ty])=>{const v=$("auO-"+k).value.trim();o[k]=ty==="num"?(v===""?"":auNum(v)):v;});
    if(!o.n&&!o.can){toast("Scrivi almeno il nome o il canone");return;}
    if(auEdit>=0)A.opz[auEdit]=o;else A.opz.push(o);auEdit=-1;save();render();toast("🔢 Offerta salvata");};
  if($("auODel"))$("auODel").onclick=()=>{A.opz.splice(auEdit,1);auEdit=-1;save();render();};
  if($("auONo"))$("auONo").onclick=()=>{auEdit=-1;render();};
}
/* riquadro per il riepilogo di oggi (Oggi e Calendario): solo nei 45 giorni prima della riconsegna e fino a 3 giorni dopo */
function auCard(){const A=P.auto||{},g=auGiorni(A.scad);if(g==null||g>45||g<-3)return "";const done=AU_CHECK.filter((_,i)=>(A.chk||{})[i]).length;
  return `<div class="card k-auto"><h3>🚗 Auto <button class="lnk" data-go="auto">Apri ›</button></h3><div class="big">${g>0?g:g===0?"oggi":"✓"}</div><div class="lbl">${g>0?(g===1?"giorno":"giorni")+" alla riconsegna":g===0?"è il giorno della riconsegna":"riconsegna fatta? controlla la checklist del «dopo»"}</div><div class="row"><div class="grow">Checklist della riconsegna</div><b>${done} su ${AU_CHECK.length}</b></div></div>`;}
