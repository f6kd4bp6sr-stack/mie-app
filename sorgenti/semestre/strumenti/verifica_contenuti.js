/* Verifica dei contenuti dell'app «Semestre filtro» (uso: node sorgenti/semestre/strumenti/verifica_contenuti.js)
   Carica i file di dati nell'ordine di build.py e controlla: domande (5 opzioni, indice giusto, completamenti, spiegazione,
   argomento esistente, testi duplicati), test d'ingresso (6 per unità, spiegazioni), argomenti (spiegazione, animazione collegata),
   calcoli a numeri variabili (400 varianti per tipo, nessun valore non valido). Esce con codice 1 se trova errori. */
const fs=require("fs"),path=require("path"),vm=require("vm");
const D=path.join(__dirname,"..");
const body=fs.readFileSync(path.join(D,"build.py"),"utf8").match(/BODY = \[([^\]]*)\]/)[1].match(/"([^"]+)"/g).map(s=>s.slice(1,-1)).filter(f=>f!=="d_app.js"&&f!=="d2_storico.js"&&f!=="d4_extra.js");
const stub=`const window={matchMedia:()=>({matches:false,addEventListener(){}}),devicePixelRatio:1};const document={documentElement:{},createElement:()=>({getContext:()=>({})}),addEventListener(){}};const getComputedStyle=()=>({getPropertyValue:()=>""});const matchMedia=window.matchMedia;const requestAnimationFrame=()=>0;const localStorage={getItem:()=>null,setItem(){}};`;
const src=stub+body.map(f=>fs.readFileSync(path.join(D,f),"utf8")).join("\n;\n")+`
;(function(){const out={err:[],info:[]};const E_=out.err;
for(const k of EXORD){const E=EXAMS[k];const tp=Object.fromEntries(E.topics.map(t=>[t.id,t]));const seen=new Set();
 E.qb.forEach(q=>{if(!tp[q.t])E_.push(k+" argomento inesistente "+q.t+": "+q.q);const key=q.q.trim().toLowerCase();if(seen.has(key))E_.push(k+" DOMANDA DUPLICATA: "+q.q);seen.add(key);
  if(q.k==="m"){if(!Array.isArray(q.o)||q.o.length!==5)E_.push(k+" servono 5 opzioni: "+q.q);else{if(!(q.a>=0&&q.a<5))E_.push(k+" indice risposta errato: "+q.q);if(new Set(q.o).size!==5)E_.push(k+" opzioni uguali: "+q.q);}}
  else if(q.k==="c"){if(!Array.isArray(q.a)||!q.a.length||!q.q.includes("____"))E_.push(k+" completamento malformato: "+q.q);}else E_.push(k+" tipo domanda (k) errato: "+q.q);
  if(!q.s)E_.push(k+" manca la spiegazione: "+q.q);});
 const pu={};E.pt.forEach((p,i)=>{pu[p.u]=(pu[p.u]||0)+1;if(!p.o||p.o.length!==5)E_.push(k+" test d'ingresso "+i+": servono 5 opzioni");if(!p.s||!Array.isArray(p.e)||p.e.length!==5)E_.push(k+" test d'ingresso "+i+": mancano spiegazioni");});
 E.units.forEach(u=>{if((pu[u.id]||0)<4)E_.push(k+" test d'ingresso: poche domande per "+u.id);const m=E.qb.filter(q=>q.u===u.id||tp[q.t]&&tp[q.t].u===u.id);if(m.filter(q=>q.k==="c").length<u.cp||m.filter(q=>q.k==="m").length<u.q-u.cp)E_.push(k+" unità povera per la simulazione: "+u.id);});
 E.topics.forEach(t=>{if(!t.sp||!t.sp.length)E_.push(k+" argomento senza spiegazione: "+t.id);if(!t.anim)E_.push(k+" argomento senza animazione: "+t.id);else if(!AN[t.anim])E_.push(k+" animazione inesistente "+t.anim+" per "+t.id);if(E.qb.filter(q=>q.t===t.id).length<8)E_.push(k+" argomento con meno di 8 domande: "+t.id);});
 let gb=0;(GEN[k]||[]).forEach(G=>{for(let i=0;i<400;i++){const q=genQ(newGenId(k,G));if(!q){gb++;continue;}const txt=q.q+q.o.join("|")+q.s;if(/NaN|undefined|Infinity|null/.test(txt)||new Set(q.o).size!==5)gb++;}});if(gb)E_.push(k+" "+gb+" varianti numeriche non valide");
 out.info.push(k+": "+E.qb.length+" domande ("+E.qb.filter(q=>q.r).length+" delle prove reali), "+E.topics.length+" argomenti, "+E.pt.length+" test d'ingresso, "+(GEN[k]||[]).length+" calcoli variabili");}
out.info.push("animazioni: "+Object.keys(AN).length+" · fonti: "+SOURCES.reduce((a,g)=>a+g.it.length,0));
return out;})()`;
let r;try{r=vm.runInNewContext(src,{console,Math,Date,JSON,Object,Array,String,Number,Set,Map,parseInt,parseFloat,isFinite,RegExp,Error,Proxy});}catch(e){console.error("ERRORE nel caricamento dei dati:",e.message);process.exit(1);}
r.info.forEach(x=>console.log("ℹ️ ",x));if(r.err.length){console.log("\n❌ "+r.err.length+" problemi:\n"+r.err.join("\n"));process.exit(1);}console.log("✅ contenuti in ordine");
