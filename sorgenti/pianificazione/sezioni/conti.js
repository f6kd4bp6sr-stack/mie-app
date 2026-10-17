/* ================= 💶 CONTI =================
   Conti e carte di più banche (Fineco, BNL, N26, BBVA…), importazione dei movimenti dai file della banca
   (CSV, XLSX, XLS: letti sull'iPad, mai inviati), categorie e budget, grafici, ricorrenti, rate e trattenute,
   proiezione «Dopo il congedo». Tutti gli importi sono quelli inseriti o importati dall'utente. */
const FREQ={m:["ogni mese",1],b:["ogni 2 mesi",2],t:["ogni 3 mesi",3],s:["ogni 6 mesi",6],a:["ogni anno",12]};
const BANCHE={fineco:["Fineco","#0a3e8a"],bnl:["BNL","#00915a"],n26:["N26","#36a18b"],bbva:["BBVA","#004481"],intesa:["Intesa Sanpaolo","#2f6f3a"],unicredit:["UniCredit","#c8102e"],poste:["BancoPosta","#e9b500"],sella:["Banca Sella","#7a1f2b"],contanti:["Contanti","#6b7280"],altro:["Altra banca","#6b7280"]};
const TIPI_ACC={conto:"🏦 Conto corrente",credito:"💳 Carta di credito",debito:"💳 Carta di debito",prepagata:"💳 Carta prepagata",deposito:"🐖 Conto deposito / risparmio",wallet:"👛 Portafoglio (PayPal, Satispay…)",contanti:"💵 Contanti"};
const isCard=t=>t==="credito"||t==="debito"||t==="prepagata";
/* banche: quelle già pronte più quelle aggiunte da te (Impostazioni in «Conti e carte»), tutte con nome e colore */
const bankOf=id=>{const b=(C().banks||[]).find(x=>x.id===id);return b?[b.n,b.col||"#6b7280"]:(BANCHE[id]||BANCHE.altro);};
const allBanks=()=>Object.entries(BANCHE).filter(([k])=>k!=="altro").map(([k,v])=>({id:k,n:v[0],col:v[1]})).concat(C().banks||[]).concat([{id:"altro",n:"Altra banca",col:"#6b7280"}]);
const accActive=()=>C().acc.filter(a=>!a.arch);
const accLabel=a=>a.n+(a.l4?" ··"+a.l4:"");
const AIUTO_BANCA={
  fineco:"Sito Fineco → Movimenti conto → «Esporta in Excel» (file .xlsx). Carte: Movimenti carte → Esporta (file .xls).",
  n26:"Sito web N26 (non l’app) → Movimenti → Scarica → scegli le date → file CSV.",
  bnl:"Area clienti BNL → Movimenti → esporta in Excel o CSV, se disponibile. Se c’è solo il PDF, inserisci a mano o importa un CSV fatto con Numbers.",
  bbva:"Sito BBVA → Conto → Movimenti → esporta in Excel.",
  contanti:"I contanti si inseriscono a mano dai Movimenti.",altro:"Scarica i movimenti in Excel o CSV dal sito della banca."};
const KCATS=[
  ["casa","🏠","Casa e utenze",/verisure|internet telefono|utenze|casa e|affitto|mutuo|condomin|enel|iren|hera|a2a|edison|engie|sorgenia|acea|smat|tari\b|tim\b|telecom|fastweb|vodafone|iliad|windtre|wind tre|sky wifi|gas\b|luce\b/],
  ["spesa","🛒","Spesa",/alimentari|supermercat|conad|coop\b|esselunga|carrefour|lidl|eurospin|\bpam\b|ipercoop|iper\b|bennet|penny|\bmd\b|aldi|famila|crai|despar|supermerc|unes|in'?s\b|simply/],
  ["auto","🚗","Auto e carburante",/carburant|arval|unipol|\beni\b|enilive|q8|\bip\b|tamoil|esso|\bapi\b|shell|telepass|autostrad|parchegg|leasys|ald\b|arval|ayvens|noleggio|assicuraz|revisione|gommist|officina|carrozz|bollo auto|aci\b/],
  ["rate","📑","Rate, mutui e finanziamenti",/mutui|finanziament|prestito|leasing|unicredit|findomestic|agos|compass|cofidis|\brata\b/],
  ["trasporti","🚌","Trasporti",/\bgtt\b|trenitalia|italo|uber|taxi|bus\b|metro|frecciarossa|flixbus/],
  ["salute","🩺","Salute",/salute e benessere|farmac|ospedal|\basl\b|dentist|medic|ottica|analisi|ticket|sanitar|clinica|parafarm/],
  ["figli","🧒","Figli, scuola e sport",/go.?fit|scuola|libreria|cartoleria|piscina|pattinaggio|palestra|sport|ludoteca|mensa|giocattol/],
  ["ristoranti","☕","Bar e ristoranti",/ristoranti e bar|\bbar\b|ristor|pizzer|trattoria|mcdonald|burger|deliveroo|glovo|just ?eat|caff[eè]|gelater|sushi|kebab/],
  ["acquisti","🛍️","Acquisti",/paypal|vinted|e-commerce|shopping|abbigliamento|amazon|zalando|ikea|decathlon|mediaworld|unieuro|euronics|leroy|obi\b|zara|h&m|primark|ovs|tigota|acqua e sapone/],
  ["abbonamenti","📺","Abbonamenti",/netflix|spotify|disney|apple\.com|itunes|google|prime video|amazon prime|dazn|now tv|\bsky\b|youtube|icloud|microsoft|claude|openai|anthropic/],
  ["svago","🎟️","Svago e viaggi",/cinema|teatro|museo|booking|airbnb|ryanair|easyjet|wizz|hotel|vacanz|viaggi/],
  ["tasse","🏛️","Tasse e bolli",/\bf24\b|agenzia entrate|\bimu\b|pagopa|comune di|tributi|imposta(?! di bollo)|multa/],
  ["banca","🏦","Banca e commissioni",/commission|canone|imposta di bollo|interessi passivi|spese tenuta|competenze/],
  ["contanti","💵","Prelievi e ricariche",/prelievo|prelev|atm\b|bancomat|satispay|top-up|ricarica (dell'app|carta prepagata)/],
  ["stipendio","💼","Stipendio e pensione",/stipendio|emolument|noipa|cedolino|pensione|\binps\b|mef\b|ministero/],
  ["entrate","➕","Altre entrate",null],
  ["saldocarta","💳","Addebito carta di credito",/saldo carta|addebito carta|estratto conto carta|e\/c carta|carta di credito|carta credito|american express|amex|nexi|rata carta/],
  ["giro","🔁","Giroconti tra miei conti",/giroconto|giro conto|trasferimento tra|bonifico a me stesso|ricarica conto|ricarica n26|ricarica carta/],
  ["altro","📦","Altro",null]
];
const KCAT=Object.fromEntries(KCATS.map(c=>[c[0],c]));
const catName=id=>(KCAT[id]||KCAT.altro)[1]+" "+(KCAT[id]||KCAT.altro)[2];

/* ---------- dati ---------- */
function C(){const c=P.conti;["acc","mov","ric","rules","banks"].forEach(k=>{if(!Array.isArray(c[k]))c[k]=[];});if(!c.bud)c.bud={};if(!c.proj)c.proj={};if(!c.bmap)c.bmap={};
  c.mov.forEach(m=>{if(!m.cat)m.cat=m.tipo==="e"?"entrate":"altro";});return c;}
const cents=n=>Math.round((+n||0)*100);
const normDesc=s=>String(s||"").toLowerCase().replace(/\s+/g," ").replace(/[^a-z0-9àèéìòù ]/g,"").trim();
function movHash(acc,d,signed,desc){return acc+"|"+d+"|"+cents(signed)+"|"+normDesc(desc).slice(0,24);}
/* bonifici verso o da sé stessi (es. Fineco → N26): giroconti, non spese. Il nome è letto dal file della banca e resta sull'iPad */
function isOwn(desc,signed){const n=(C().own||"").toLowerCase().split(/\s+/).filter(w=>w.length>2);if(n.length<2)return false;const d=String(desc||"").toLowerCase();
  // uscita: il beneficiario sono io; entrata: l'ordinante sono io (lo stipendio ha me come beneficiario, ma non è un giroconto)
  const m=signed<0?d.match(/benef\w*:?\s*(.+?)(?:\s+(?:iban|ib|bic|causale|note)\b|·|$)/):d.match(/\bord(?:inante)?\.?:?\s*(.+?)(?:\s+ben\w*\b|·|$)/);
  return !!m&&n.every(w=>m[1].includes(w));}
function guessCat(desc,signed){const s=" "+String(desc||"").toLowerCase()+" ";
  for(const r of C().rules)if(r.k&&s.includes(r.k))return r.cat;
  const IN=["stipendio","giro","saldocarta"];
  if(signed>0){for(const c of KCATS)if(IN.includes(c[0])&&c[3].test(s))return c[0];return "entrate";}
  for(const c of KCATS)if(c[3]&&c[0]!=="stipendio"&&c[3].test(s))return c[0];
  return "altro";}
const hasCardMov=()=>{const c=C();const cards=new Set(c.acc.filter(a=>a.tipo==="credito").map(a=>a.id));return c.mov.some(m=>cards.has(m.acc));};
/* portafogli (PayPal, Satispay…) con «ricariche come giroconti»: la ricarica dal conto non è una spesa, le spese vere sono nei movimenti del portafoglio */
function walletTopUp(m){const ws=C().acc.filter(a=>a.tipo==="wallet"&&a.giro);if(!ws.length)return false;const w=ws.find(x=>x.id===m.acc);
  if(w)return m.tipo==="e"; // nel portafoglio: le entrate sono ricariche dal conto
  const d=normDesc(m.t);return ws.some(x=>String(x.key||bankOf(x.bank)[0]).toLowerCase().split(",").map(k=>normDesc(k)).filter(k=>k.length>2).some(k=>d.includes(k)));}
const isTransfer=m=>m.cat==="giro"||(m.cat==="saldocarta"&&hasCardMov())||walletTopUp(m);
function accBal(a){const c=C();let b=+a.s0||0;c.mov.forEach(m=>{if(m.acc===a.id&&(!a.d0||m.d>a.d0))b+=m.tipo==="e"?+m.imp:-m.imp;});return b;}
function totBal(){return accActive().filter(a=>a.tipo!=="credito").reduce((s,a)=>s+accBal(a),0);} // le carte di credito si pagano dal conto: non si sommano due volte

/* ---------- ricorrenti, rate e trattenute ---------- */
function ricDates(r,from,to){const out=[],step=(FREQ[r.freq]||FREQ.m)[1];let d=r.d0||from;if(!d)return out;
  let x=parse(d),guard=0;while(iso(x)<from&&guard++<600){x.setMonth(x.getMonth()+step);}
  guard=0;while(iso(x)<=to&&guard++<400){if(r.fine&&iso(x)>r.fine)break;out.push(iso(x));x.setMonth(x.getMonth()+step);}return out;}
function ricLeft(r){if(!r.fine)return null;const n=ricDates(r,today(),r.fine).length;return{n,tot:n*(+r.imp||0)};}
function nextPayments(days){const t=today(),to=add(t,days),out=[];C().ric.forEach(r=>ricDates(r,t,to).forEach(d=>out.push({d,r})));return out.sort((a,b)=>a.d<b.d?-1:1);}

/* ---------- totali ---------- */
function monthEnd(ym){return iso(new Date(+ym.slice(0,4),+ym.slice(5,7),0));}
function monthActual(ym){const from=ym+"-01",to=monthEnd(ym);let e=0,u=0;const per={};
  C().mov.forEach(m=>{if(m.d<from||m.d>to||isTransfer(m))return;const v=+m.imp||0;if(m.tipo==="e")e+=v;else{u+=v;per[m.cat]=(per[m.cat]||0)+v;}});return{e,u,per};}
function monthTotals(ym){const a=monthActual(ym);if(C().mov.some(m=>m.d.slice(0,7)===ym))return a;
  let e=0,u=0;C().ric.forEach(r=>{const n=ricDates(r,ym+"-01",monthEnd(ym)).length;if(r.tipo==="e")e+=n*(+r.imp||0);else u+=n*(+r.imp||0);});return{e,u,per:{},prev:true};}
function lastMonths(n){const out=[],d=parse(today());d.setDate(1);for(let i=n-1;i>=0;i--){const x=new Date(d.getFullYear(),d.getMonth()-i,1);out.push(iso(x).slice(0,7));}return out;}
const MESE=ym=>parse(ym+"-01").toLocaleDateString("it-IT",{month:"short",year:"2-digit"});

/* ---------- importazione ---------- */
const H={date:/^(data( dell'?)?( operazione| contabile| movimento| registrazione| transazione)?|booking date|transaction date|date|data op\.?)$/,valuta:/valuta|value date/,
  amount:/^(importo( netto| in euro| eur| movimento)?|amount|ammontare|valore)$/,credit:/^(entrate|avere|accrediti?|entrata|importo avere)$/,debit:/^(uscite|dare|addebiti?|uscita|importo dare)$/,bcat:/^(categoria|moneymap|categoria moneymap|category)$/,
  desc:/descrizione|causale|partner name|payee|payment reference|dettagli|beneficiario|tipologia|merchant|esercente/,status:/^(stato( operazione)?|status)$/};
const low=v=>String(v==null?"":v).replace(/^\uFEFF/,"").trim().toLowerCase();
/* intestazioni normalizzate: «Data_Operazione», «Entrate (€)», «Importo Netto (€)» → «data operazione», «entrate», «importo netto» */
const hnorm=v=>low(v).replace(/[_]+/g," ").replace(/\((?:€|eur|euro)\)/g,"").replace(/[€:]/g,"").replace(/\s+/g," ").trim();
function detect(rows){let best=null;
  for(let i=0;i<Math.min(rows.length,60);i++){const r=(rows[i]||[]).map(hnorm);let date=-1,amount=-1,credit=-1,debit=-1,status=-1,bcat=-1;const desc=[];
    r.forEach((h,j)=>{if(!h)return;if(H.valuta.test(h))return;if(date<0&&H.date.test(h))date=j;else if(amount<0&&H.amount.test(h))amount=j;else if(credit<0&&H.credit.test(h))credit=j;else if(debit<0&&H.debit.test(h))debit=j;else if(status<0&&H.status.test(h))status=j;else if(bcat<0&&H.bcat.test(h))bcat=j;else if(H.desc.test(h))desc.push(j);});
    const score=(date>=0)*2+((amount>=0)||(credit>=0||debit>=0))*2+(desc.length>0);
    if(date>=0&&(amount>=0||credit>=0||debit>=0)&&(!best||score>best.score))best={row:i,score,date,amount,credit,debit,status,bcat,desc:desc.slice(0,2)};}
  return best;}
function parseDateCell(v){if(typeof v==="number"&&v>20000&&v<80000){const d=new Date(Date.UTC(1899,11,30)+v*864e5);return d.toISOString().slice(0,10);}
  const s=String(v||"").trim();let m=s.match(/^(\d{4})-(\d{2})-(\d{2})/);if(m)return m[1]+"-"+m[2]+"-"+m[3];
  m=s.match(/^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{2,4})/);if(m){const y=+m[3]<100?2000+ +m[3]:+m[3];return y+"-"+pad(+m[2])+"-"+pad(+m[1]);}return null;}
function parseAmt(v){if(typeof v==="number")return v;let s=String(v||"").replace(/[€\s]|eur/gi,"").trim();if(!s)return null;
  let neg=false;if(/^\(.*\)$/.test(s)){neg=true;s=s.slice(1,-1);}if(/-$/.test(s)){neg=true;s=s.slice(0,-1);}if(/^[-−]/.test(s)){neg=true;s=s.slice(1);}if(/^\+/.test(s))s=s.slice(1);
  const lc=s.lastIndexOf(","),ld=s.lastIndexOf(".");if(lc>ld)s=s.replace(/\./g,"").replace(",",".");else s=s.replace(/,/g,"");
  const n=parseFloat(s);return isNaN(n)?null:(neg?-n:n);}
let IMP=null; // importazione in corso: {acc,rows,map,file}
function buildImport(){const I=IMP,a=C().acc.find(x=>x.id===I.acc),M=I.map,out=[],seen=new Set(C().mov.map(m=>m.h)),occ={};let dup=0,skip=0,pend=0;
  for(let i=M.row+1;i<I.rows.length;i++){const r=I.rows[i]||[];const d=parseDateCell(r[M.date]);if(!d){skip++;continue;}
    let v=null;if(M.amount>=0)v=parseAmt(r[M.amount]);else{const cr=M.credit>=0?parseAmt(r[M.credit]):null,db=M.debit>=0?parseAmt(r[M.debit]):null;v=(cr?Math.abs(cr):0)-(db?Math.abs(db):0);if(!cr&&!db)v=null;}
    if(v==null||!v){skip++;continue;}
    const desc=M.desc.map(j=>String(r[j]==null?"":r[j]).trim()).filter(Boolean).filter((x,k,arr)=>arr.indexOf(x)===k).join(" · ")||"(senza descrizione)";
    if(/^totale/i.test(desc)){skip++;continue;}
    const st=M.status>=0?low(r[M.status]):"",p=/autorizzat|in lavorazione|pending|prenotat|da contabilizzare/.test(st)?1:0;
    const h0=movHash(a.id,d,v,desc),nth=occ[h0]=(occ[h0]||0)+1,h=nth>1?h0+"#"+nth:h0; // due spese identiche nello stesso file contano entrambe
    if(seen.has(h)){dup++;continue;}if(p)pend++;
    const bc=M.bcat>=0?String(r[M.bcat]||""):"";
    out.push({id:uid(),d,t:desc,imp:Math.round(Math.abs(v)*100)/100,tipo:v>0?"e":"u",cat:isOwn(desc,v)?"giro":guessCat(desc+" | "+bc,v),acc:a.id,h,src:"file",p});}
  // nello stesso file: un movimento «in attesa» che compare anche contabilizzato si tiene una volta sola
  const booked=out.filter(m=>!m.p);const fin=out.filter(m=>!m.p||!booked.some(b=>b.tipo===m.tipo&&cents(b.imp)===cents(m.imp)&&Math.abs(diff(b.d,m.d))<=6&&!b._used&&(b._used=1)));
  booked.forEach(b=>delete b._used);const dropped=out.length-fin.length;
  return{out:fin,dup:dup+dropped,skip,pend:pend-dropped};}
function commitImport(){const R=buildImport(),c=C();
  // movimenti «in attesa» già presenti che ora arrivano contabilizzati: sostituiti
  R.out.filter(m=>!m.p).forEach(m=>{const k=c.mov.findIndex(x=>x.p&&x.acc===m.acc&&x.tipo===m.tipo&&cents(x.imp)===cents(m.imp)&&Math.abs(diff(x.d,m.d))<=6);if(k>=0)c.mov.splice(k,1);});
  if(!c.own){ // nome dell'intestatario: dal beneficiario degli accrediti (es. stipendio «Ben: Cognome Nome»), resta sull'iPad
    const f={};R.out.filter(m=>m.tipo==="e").forEach(m=>{const x=String(m.t).toLowerCase().match(/\bben\w*:?\s+([a-zà-ù']+\s+[a-zà-ù']+)/);if(x)f[x[1]]=(f[x[1]]||0)+1;});
    const top=Object.entries(f).sort((a,b)=>b[1]-a[1])[0];if(top&&top[1]>=2)c.own=top[0];}
  c.mov.push(...R.out);
  if(c.own)c.mov.forEach(m=>{if(m.cat!=="giro"&&isOwn(m.t,m.tipo==="e"?m.imp:-m.imp))m.cat="giro";});const a=c.acc.find(x=>x.id===IMP.acc);a.map=Object.assign({},IMP.map,{sig:IMP.sig});c.bmap[a.bank]=Object.assign({},IMP.map,{sig:IMP.sig});a.last=today();IMP=null;save();toast("📥 "+R.out.length+" movimenti importati"+(R.dup?" · "+R.dup+" già presenti":"")+(a.rec||a.tipo==="credito"?"":" · ora imposta il saldo con «Riconcilia»"));return R;}
async function readImportFile(file,accId){const u8=new Uint8Array(await file.arrayBuffer());const rows=await Fogli.readTable(u8);
  if(!C().own){for(const r of rows.slice(0,15)){const t=String((r||[])[0]||"");const m=t.match(/intestazi\w*[^:]*:\s*(.+)$/i)||t.match(/^intestatario:\s*(.+)$/i);if(m){C().own=m[1].trim();save();break;}}}
  const a=C().acc.find(x=>x.id===accId),bm=C().bmap[a.bank],det=detect(rows),sigOf=r=>(rows[r]||[]).map(low).join("|");
  // 1) colonne già scelte per questo conto 2) per la stessa banca 3) riconosciute da sole 4) scelte a mano
  const same=m=>m&&m.sig&&rows.some((r,k)=>k<40&&sigOf(k)===m.sig)?m:null;
  let map=null,from="",manual=false,mm=same(a.map)||same(bm);
  if(mm){map=Object.assign({},mm);map.row=rows.findIndex((r,k)=>k<40&&sigOf(k)===mm.sig);from=mm===a.map?"":bankOf(a.bank)[0];}
  else if(det)map=det;
  else{if(!rows.some(r=>(r||[]).filter(x=>x!==""&&x!=null).length>=2))throw new Error("Questo file non sembra una tabella di movimenti");
    manual=true;const r0=Math.max(0,rows.findIndex(r=>(r||[]).filter(x=>x!==""&&x!=null).length>=3));map={row:r0,date:-1,amount:-1,credit:-1,debit:-1,desc:[],status:-1,bcat:-1};}
  delete map.sig;if(!Array.isArray(map.desc))map.desc=[];if(map.bcat==null)map.bcat=-1;
  IMP={acc:accId,rows,map,sig:sigOf(map.row),file:file.name,from,manual};}
function impHelp(a){if(!a)return AIUTO_BANCA.altro;const k=a.bank;return (AIUTO_BANCA[k]||("Scarica i movimenti in Excel o CSV dal sito di "+bankOf(k)[0]+"."))+(C().bmap[k]?" Le colonne di questa banca sono già memorizzate.":" Se le colonne non vengono riconosciute, le scegli tu e restano memorizzate per questa banca.");}

/* ---------- proiezione «Dopo il congedo» ---------- */
function projDefaults(){const c=C(),pr=c.proj,S=typeof licS==="function"?licS():null;
  return{stip:pr.stip||((c.ric.find(r=>r.tipo==="e"&&/stipend|emolum|noipa|cedolino/i.test(r.t))||{}).id||""),nuovo:pr.nuovo!=null?pr.nuovo:"",dal:pr.dal||(S&&S.end?add(S.end,1):""),mesi:pr.mesi||24,var:pr.var,extra:pr.extra||[]};}
function varEstimate(){const ms=lastMonths(4).slice(0,3);let tot=0,n=0;ms.forEach(ym=>{const a=monthActual(ym);if(!a.u)return;let ru=0;C().ric.forEach(r=>{if(r.tipo!=="e")ru+=ricDates(r,ym+"-01",monthEnd(ym)).length*(+r.imp||0);});tot+=Math.max(0,a.u-ru);n++;});return n?Math.round(tot/n):null;}
function projection(){const c=C(),D=projDefaults(),v=D.var!=null&&D.var!==""?+D.var:(varEstimate()||0),out=[];let bal=totBal();
  const d0=parse(today());d0.setDate(1);
  for(let i=1;i<=D.mesi;i++){const m=new Date(d0.getFullYear(),d0.getMonth()+i,1),ym=iso(m).slice(0,7),from=ym+"-01",to=monthEnd(ym);let e=0,u=0;
    c.ric.forEach(r=>{const ds=ricDates(r,from,to);ds.forEach(d=>{if(r.id===D.stip&&D.dal&&d>=D.dal)return;if(r.tipo==="e")e+=+r.imp||0;else u+=+r.imp||0;});});
    if(D.nuovo&&D.dal&&from>=D.dal.slice(0,7)+"-01"&&!(D.dal>from&&D.dal.slice(0,7)===ym))e+=+D.nuovo||0;
    (D.extra||[]).forEach(x=>{if(x.d&&x.d.slice(0,7)===ym)e+=+x.imp||0;});
    u+=v;bal+=e-u;out.push({ym,e,u,bal});}
  return{rows:out,var:v,D};}

/* ---------- grafici (SVG semplici) ---------- */
function barChart12(){const ms=lastMonths(12),data=ms.map(ym=>monthActual(ym)),max=Math.max(1,...data.map(d=>Math.max(d.e,d.u))),W=640,Hh=170,bw=(W-40)/12;
  return `<svg class="chart" style="height:190px" viewBox="0 0 ${W} ${Hh+20}" role="img" aria-label="Entrate e uscite degli ultimi 12 mesi">${data.map((d,i)=>{const x=20+i*bw,he=(d.e/max)*(Hh-20),hu=(d.u/max)*(Hh-20);
    return `<rect x="${x+3}" y="${Hh-he}" width="${bw/2-4}" height="${he}" rx="3" fill="#2e7d5b"/><rect x="${x+bw/2}" y="${Hh-hu}" width="${bw/2-4}" height="${hu}" rx="3" fill="#c0392b"/><text x="${x+bw/2}" y="${Hh+14}" font-size="11" text-anchor="middle" fill="var(--muted)">${MESE(ms[i]).replace(" "," ")}</text>`;}).join("")}</svg><div class="lbl"><span style="color:#2e7d5b">■</span> entrate · <span style="color:#c0392b">■</span> uscite (senza giroconti)</div>`;}
function lineChart(rows){const W=640,Hh=170,vals=rows.map(r=>r.bal),mn=Math.min(0,...vals),mx=Math.max(1,...vals),x=i=>20+i*(W-40)/Math.max(1,rows.length-1),y=v=>10+(Hh-20)*(1-(v-mn)/(mx-mn||1));
  return `<svg class="chart" style="height:190px" viewBox="0 0 ${W} ${Hh+20}" role="img" aria-label="Saldo previsto">${mn<0?`<line x1="20" x2="${W-20}" y1="${y(0)}" y2="${y(0)}" stroke="#c0392b" stroke-dasharray="4 4"/>`:""}
    <polyline fill="none" stroke="#1f5fae" stroke-width="3" points="${rows.map((r,i)=>x(i)+","+y(r.bal)).join(" ")}"/>${rows.map((r,i)=>i%3?"":`<text x="${x(i)}" y="${Hh+14}" font-size="11" text-anchor="middle" fill="var(--muted)">${MESE(r.ym)}</text>`).join("")}</svg>`;}

/* ---------- viste ---------- */
let CT=(()=>{try{return sessionStorage.getItem("pn-ct")||"pan";}catch(e){return "pan";}})(), movF={ym:today().slice(0,7),acc:"",cat:"",q:""};
const CTABS=[["pan","Panoramica"],["mov","Movimenti"],["imp","📥 Importa"],["acc","Conti e carte"],["bud","Budget"],["ric","Ricorrenti e rate"],["proj","Dopo il congedo"],["stat","📊 Statistiche"],["risp","💡 Risparmio"]];
function vConti(){const c=C();
  let o=`<div class="${c.hide?"hidden-amt":""}"><h1>💶 Conti</h1><div class="btns" style="margin:0 0 12px">${CTABS.map(([k,t])=>`<button class="btn sm${k===CT?" pri":""}" data-ct="${k}">${t}</button>`).join("")}<button class="btn sm" id="cHide" style="margin-left:auto">${c.hide?"👁 Mostra":"🙈 Nascondi"} cifre</button></div>`;
  if(!c.acc.length&&CT!=="acc"&&CT!=="ric"&&CT!=="proj")o+=`<div class="card"><h3>👋 Comincia da qui</h3><p class="lbl">Aggiungi i tuoi conti e le tue carte (Fineco, BNL, N26, BBVA…): poi potrai importare i movimenti dai file della banca.</p><div class="btns"><button class="btn pri" data-ct="acc">Aggiungi conti e carte</button></div></div>`;
  o+=({pan:cPan,mov:cMov,imp:cImp,acc:cAcc,bud:cBud,ric:cRic,proj:cProj,stat:cStat,risp:cRisp}[CT]||cPan)();
  return o+"</div>";}
function cPan(){const c=C(),t=today(),ym=t.slice(0,7),a=monthActual(ym),np=nextPayments(30),bud=Object.entries(c.bud).filter(([k,v])=>+v>0);
  let o=`<div class="kpi">${accActive().map(x=>`<div><b class="amt ${accBal(x)>=0?"e":"u"}">${euro(accBal(x))}</b><span>${esc(accLabel(x))}${x.tipo==="credito"?" · speso dal "+fmt(x.d0,{day:"numeric",month:"short"}):""}${!x.rec&&x.tipo!=="credito"?' · <b style="color:var(--soon)">saldo da impostare</b>':""}</span></div>`).join("")}${accActive().filter(x=>x.tipo!=="credito").length>1?`<div style="border-color:var(--accent)"><b class="amt">${euro(totBal())}</b><span>totale sui conti</span></div>`:""}</div>
  <h2>${parse(t).toLocaleDateString("it-IT",{month:"long",year:"numeric"})}</h2><div class="kpi"><div><b class="amt e">${euro(a.e)}</b><span>entrate</span></div><div><b class="amt u">${euro(a.u)}</b><span>uscite</span></div><div><b class="amt ${a.e-a.u>=0?"e":"u"}">${euro(a.e-a.u)}</b><span>differenza</span></div></div>`;
  if(bud.length)o+=`<h2>Budget del mese</h2><div class="card">${bud.map(([k,v])=>{const s=a.per[k]||0,pct=Math.min(100,Math.round(s/v*100));return `<div class="row"><div class="grow"><b>${catName(k)}</b><div style="height:8px;border-radius:5px;background:var(--seg);margin-top:5px"><div style="height:8px;border-radius:5px;width:${pct}%;background:${s>v?"var(--warn)":s>v*.8?"var(--soon)":"var(--ok)"}"></div></div></div><span class="amt">${euro(s)} / ${euro(v)}</span></div>`;}).join("")}</div>`;
  const top=Object.entries(a.per).sort((x,y)=>y[1]-x[1]).slice(0,6);
  if(top.length)o+=`<h2>Dove vanno i soldi questo mese</h2><div class="card">${top.map(([k,v])=>`<div class="row"><div class="grow">${catName(k)}</div><span class="amt u">${euro(v)}</span></div>`).join("")}</div>`;
  o+=`<h2>Ultimi 12 mesi</h2><div class="card">${barChart12()}${(()=>{const ly=(+ym.slice(0,4)-1)+ym.slice(4),b=monthActual(ly);return b.u?`<p class="lbl">Uscite di questo mese: ${euro(a.u)} · stesso mese dell’anno scorso: ${euro(b.u)}</p>`:"";})()}</div>`;
  o+=`<h2>Prossimi 30 giorni</h2><div class="card">${np.length?np.map(p=>`<div class="row"><div class="grow"><b>${esc(p.r.t)}</b><small>${fmt(p.d)} · ${rel(p.d)}</small></div><span class="amt ${p.r.tipo==="e"?"e":"u"}">${p.r.tipo==="e"?"+":"−"}${euro(p.r.imp)}</span></div>`).join(""):'<p class="empty">Nessuna voce ricorrente in arrivo.</p>'}</div>`;
  return o;}
function cMov(){const c=C(),F=movF;let L=c.mov.filter(m=>(!F.ym||m.d.slice(0,7)===F.ym)&&(!F.acc||m.acc===F.acc)&&(!F.cat||m.cat===F.cat)&&(!F.q||normDesc(m.t).includes(normDesc(F.q)))).sort((a,b)=>a.d<b.d?1:-1);
  const months=[...new Set(c.mov.map(m=>m.d.slice(0,7)).concat([today().slice(0,7)]))].sort().reverse();
  return `<div class="card"><div class="form"><label>Mese<select id="fM"><option value="">tutti</option>${months.map(m=>`<option value="${m}"${m===F.ym?" selected":""}>${MESE(m)}</option>`).join("")}</select></label>
    <label>Conto<select id="fA"><option value="">tutti</option>${c.acc.map(a=>`<option value="${a.id}"${a.id===F.acc?" selected":""}>${esc(a.n)}</option>`).join("")}</select></label>
    <label>Categoria<select id="fC"><option value="">tutte</option>${KCATS.map(k=>`<option value="${k[0]}"${k[0]===F.cat?" selected":""}>${k[1]} ${k[2]}</option>`).join("")}</select></label>
    <label>Cerca<input id="fQ" value="${esc(F.q)}" placeholder="es. esselunga"></label></div></div>
  <div class="card">${L.length?L.slice(0,300).map(m=>{const a=c.acc.find(x=>x.id===m.acc);return `<div class="row"><div class="grow"><b>${esc(m.t)}</b><small>${fmt(m.d)}${a?" · "+esc(accLabel(a)):""}${m.p?" · ⏳ in attesa":""}${isTransfer(m)?(m.cat!=="giro"&&walletTopUp(m)?" · ricarica del portafoglio, non conta nei totali":" · non conta nei totali"):""}</small></div>
    <select data-mcat="${m.id}" style="max-width:170px;border:1px solid var(--line);border-radius:8px;padding:5px">${KCATS.map(k=>`<option value="${k[0]}"${k[0]===m.cat?" selected":""}>${k[1]} ${k[2]}</option>`).join("")}</select>
    <span class="amt ${m.tipo==="e"?"e":"u"}">${m.tipo==="e"?"+":"−"}${euro(m.imp)}</span><button class="btn sm" data-mdel="${m.id}" aria-label="Togli">×</button></div>`;}).join("")+(L.length>300?`<p class="lbl">Mostro i primi 300 di ${L.length}: usa i filtri.</p>`:""):'<p class="empty">Nessun movimento con questi filtri.</p>'}</div>
  <div class="card"><h3>➕ Movimento a mano</h3><div class="form"><label>Che cosa<input id="mT" maxlength="80"></label><label>Importo €<input id="mI" type="text" inputmode="decimal" placeholder="0,00"></label><label>Tipo<select id="mTp"><option value="u">uscita</option><option value="e">entrata</option></select></label>
    <label>Conto<select id="mA">${accActive().map(a=>`<option value="${a.id}">${esc(accLabel(a))}</option>`).join("")}<option value="">—</option></select></label><label>Data<input id="mD" type="date" value="${today()}"></label></div><div class="btns"><button class="btn pri" id="mAdd">Aggiungi</button></div></div>`;}
function cImp(){const c=C();if(!c.acc.length)return "";
  if(IMP){const R=buildImport(),M=IMP.map,hdr=IMP.rows[M.row]||[],opt=(sel,none)=>`<option value="-1">${none||"—"}</option>`+hdr.map((h,j)=>`<option value="${j}"${j===sel?" selected":""}>${esc(h||"colonna "+(j+1))}</option>`).join("");
    return `<div class="card"><h3>📄 ${esc(IMP.file)} → ${esc(accLabel(c.acc.find(a=>a.id===IMP.acc)))}</h3><p class="lbl">${IMP.manual?"<b>Non ho riconosciuto da solo le colonne di questo file.</b> Scegli tu la riga dei titoli e le colonne di data, importo e descrizione: le ricordo per i prossimi file di questa banca.":IMP.from?"Colonne come l’ultima volta per "+esc(IMP.from)+". Se una è sbagliata, cambiala.":"Controlla le colonne: le ho riconosciute da sole. Se una è sbagliata, cambiala."}</p>
      <div class="form"><label>Riga dei titoli<select data-map="row">${IMP.rows.slice(0,25).map((r,j)=>`<option value="${j}"${j===M.row?" selected":""}>${j+1}: ${esc((r||[]).filter(x=>x!==""&&x!=null).slice(0,3).join(" · ").slice(0,40)||"(vuota)")}</option>`).join("")}</select></label><label>Data<select data-map="date">${opt(M.date)}</select></label><label>Importo (con segno)<select data-map="amount">${opt(M.amount,"— usa Entrate/Uscite —")}</select></label>
      <label>Entrate<select data-map="credit">${opt(M.credit)}</select></label><label>Uscite<select data-map="debit">${opt(M.debit)}</select></label>
      <label>Descrizione<select data-map="desc0">${opt(M.desc[0])}</select></label><label>Descrizione 2<select data-map="desc1">${opt(M.desc[1])}</select></label><label>Stato<select data-map="status">${opt(M.status)}</select></label></div>
      <div class="kpi" style="margin-top:10px"><div><b>${R.out.length}</b><span>movimenti nuovi</span></div><div><b>${R.dup}</b><span>già presenti (saltati)</span></div><div><b>${R.pend}</b><span>in attesa di contabilizzazione</span></div><div><b>${R.skip}</b><span>righe non movimento</span></div></div>
      <div style="margin-top:10px">${R.out.slice(0,8).map(m=>`<div class="row"><div class="grow"><b>${esc(m.t)}</b><small>${fmt(m.d)} · ${catName(m.cat)}</small></div><span class="amt ${m.tipo==="e"?"e":"u"}">${m.tipo==="e"?"+":"−"}${euro(m.imp)}</span></div>`).join("")}</div>
      <div class="btns"><button class="btn pri" id="impGo"${R.out.length?"":" disabled"}>Importa ${R.out.length} movimenti</button><button class="btn" id="impNo">Annulla</button></div></div>`;}
  return `<div class="card"><h3>📥 Importa i movimenti della banca</h3><p class="lbl">Scarica i movimenti dal sito della banca (Excel o CSV) e scegli il file qui. Il file viene letto solo su questo iPad. I doppioni vengono saltati, quindi puoi importare anche periodi che si sovrappongono.</p>
    <div class="form"><label>In quale conto o carta<select id="impAcc">${accActive().map(a=>`<option value="${a.id}">${esc(accLabel(a))}</option>`).join("")}</select></label><label>File<input id="impFile" type="file" accept=".csv,.txt,.xls,.xlsx,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"></label></div>
    <p class="lbl" id="impHelp">${esc(impHelp(accActive()[0]))}</p></div>
    <div class="card"><h3>Ultime importazioni</h3>${accActive().map(a=>`<div class="row"><div class="grow">${esc(accLabel(a))}</div><span class="lbl">${a.last?"il "+fmt(a.last):"mai"}</span></div>`).join("")}</div>`;}
let ACC_ED=null; // conto in modifica
function accForm(a){const c=C(),id=a?"e":"a",bk=a?a.bank:"fineco",tp=a?a.tipo:"conto";
  return `<div class="form">
    <label>Banca<select id="${id}B">${allBanks().map(b=>`<option value="${b.id}"${b.id===bk?" selected":""}>${esc(b.n)}</option>`).join("")}</select></label>
    <label>Tipo<select id="${id}T">${Object.entries(TIPI_ACC).map(([k,v])=>`<option value="${k}"${k===tp?" selected":""}>${v}</option>`).join("")}</select></label>
    <label>Nome<input id="${id}N" maxlength="40" value="${a?esc(a.n):""}" placeholder="es. Fineco conto"></label>
    <label>Ultime 4 cifre (carte)<input id="${id}4" maxlength="4" inputmode="numeric" pattern="[0-9]*" value="${a&&a.l4?esc(a.l4):""}" placeholder="es. 1234"></label>
    ${a?`<label>Saldo iniziale €<input id="eS" type="text" inputmode="decimal" value="${String(Math.round((+a.s0||0)*100)/100).replace(".",",")}"></label><label>Saldo alla data<input id="eD" type="date" value="${a.d0||""}"></label>`:`<label>Saldo di oggi €<input id="aS" type="text" inputmode="decimal" placeholder="0,00"></label>`}
    <label>Carta addebitata su<select id="${id}L"><option value="">—</option>${accActive().filter(x=>x.tipo==="conto"&&(!a||x.id!==a.id)).map(x=>`<option value="${x.id}"${a&&a.link===x.id?" selected":""}>${esc(x.n)}</option>`).join("")}</select></label>
    <label class="wide" data-wallet ${tp==="wallet"?"":"hidden"}><span><input type="checkbox" id="${id}G"${a&&a.giro?" checked":""} style="width:auto;margin-right:6px">Le ricariche dal conto sono giroconti (importo anche i movimenti di questo portafoglio)</span></label>
    <label class="wide" data-wallet ${tp==="wallet"?"":"hidden"}>Parole che riconoscono le ricariche nel conto (separate da virgola)<input id="${id}K" maxlength="80" value="${a&&a.key?esc(a.key):""}" placeholder="es. satispay"></label></div>`;}
function cAcc(){const c=C(),act=accActive(),arch=c.acc.filter(a=>a.arch);
  const row=a=>{const link=a.link?c.acc.find(x=>x.id===a.link):null,b=bankOf(a.bank);
    if(ACC_ED===a.id)return `<div class="card" style="border-color:var(--accent)"><h3>✏️ ${esc(a.n)}</h3>${accForm(a)}<div class="btns"><button class="btn pri" id="eSave">Salva</button><button class="btn" id="eArch">${a.arch?"Ripristina":"📦 Archivia (conto chiuso)"}</button><button class="btn" id="eNo">Annulla</button></div>
      <p class="lbl">Archiviato, il conto sparisce dagli elenchi e dal totale, ma i suoi movimenti restano nelle statistiche. «Togli» invece cancella anche i movimenti.</p></div>`;
    return `<div class="row"><span class="pill" style="background:${b[1]};color:#fff">${esc(b[0])}</span><div class="grow"><b>${esc(accLabel(a))}</b><small>${TIPI_ACC[a.tipo]||""}${link?" · addebitata su "+esc(link.n):""}${a.tipo==="wallet"?(a.giro?" · ricariche = giroconti":" · ricariche contate come spesa"):""}</small></div><span class="amt ${accBal(a)>=0?"e":"u"}">${euro(accBal(a))}</span><button class="btn sm" data-aed="${a.id}">✏️ Modifica</button>${a.arch?"":`<button class="btn sm" data-arec="${a.id}">Riconcilia</button>`}<button class="btn sm" data-adel="${a.id}">Togli</button></div>`;};
  return `<div class="card"><h3>I tuoi conti e carte</h3>${act.length?act.map(row).join(""):'<p class="empty">Nessun conto ancora.</p>'}</div>
  ${arch.length?`<details class="card"${arch.some(a=>a.id===ACC_ED)?" open":""}><summary><b>📦 Archiviati (${arch.length})</b></summary>${arch.map(row).join("")}</details>`:""}
  <div class="card"><h3>➕ Aggiungi conto o carta</h3>${accForm(null)}
    <div class="btns"><button class="btn pri" id="aAddAcc">Aggiungi</button><button class="btn" id="aPreset">Crea Fineco, BNL, N26 e BBVA (conto + carta)</button></div>
    <p class="lbl">Le carte di debito (N26, bancomat) addebitano ogni spesa sul conto: basta importare il conto. Per le carte di credito importa il file della carta: l’addebito mensile sul conto viene escluso dai totali, così non conti la spesa due volte. Per la carta di credito il saldo è il debito del periodo (negativo). Per un <b>portafoglio</b> (PayPal, Satispay…): se importi anche i suoi movimenti, spunta «le ricariche sono giroconti», così le spese si contano una volta sola.</p></div>
  <div class="card"><h3>🏦 Le tue banche</h3><p class="lbl">Aggiungi qualsiasi banca o servizio con un nome e un colore: compare nell’elenco delle banche.</p>
    ${c.banks.length?c.banks.map(b=>`<div class="row"><span class="pill" style="background:${b.col};color:#fff">${esc(b.n)}</span><div class="grow"><small>${c.acc.filter(a=>a.bank===b.id).length} conti</small></div><input type="color" data-bcol="${b.id}" value="${b.col}" aria-label="Colore" style="width:44px;height:34px;border:0;background:none"><button class="btn sm" data-bren="${b.id}">Rinomina</button><button class="btn sm" data-bdel="${b.id}">Togli</button></div>`).join(""):'<p class="empty">Nessuna banca aggiunta.</p>'}
    <div class="form" style="margin-top:8px"><label>Nome<input id="bN" maxlength="30" placeholder="es. Intesa, Poste, Revolut, Satispay"></label><label>Colore<input id="bC" type="color" value="#7a4fd1" style="height:42px"></label></div>
    <div class="btns"><button class="btn pri" id="bAdd">Aggiungi banca</button></div></div>`;}
function cBud(){const c=C(),a=monthActual(today().slice(0,7)),avg={};lastMonths(4).slice(0,3).forEach(ym=>{const x=monthActual(ym);Object.entries(x.per).forEach(([k,v])=>avg[k]=(avg[k]||0)+v/3);});
  return `<div class="card"><h3>Budget mensile per categoria</h3><p class="lbl">Lascia vuoto dove non vuoi un tetto. Accanto: speso questo mese e media degli ultimi 3 mesi.</p>
    ${KCATS.filter(k=>!["stipendio","entrate","giro","saldocarta"].includes(k[0])).map(k=>`<div class="row"><div class="grow"><b>${k[1]} ${k[2]}</b><small>questo mese ${euro(a.per[k[0]]||0)} · media ${euro(avg[k[0]]||0)}</small></div><input data-bud="${k[0]}" type="text" inputmode="decimal" value="${c.bud[k[0]]||""}" placeholder="€" style="width:110px;border:1px solid var(--line);border-radius:10px;padding:8px"></div>`).join("")}</div>
  <div class="card"><h3>Regole imparate</h3>${c.rules.length?c.rules.map((r,i)=>`<div class="row"><div class="grow">«${esc(r.k)}» → ${catName(r.cat)}</div><button class="btn sm" data-rdel="${i}">Togli</button></div>`).join(""):'<p class="empty">Quando cambi la categoria di un movimento, l’app ti chiede se usarla sempre per quel nome.</p>'}</div>`;}
function cRic(){const c=C(),t=today();
  return `<div class="card">${c.ric.length?c.ric.map(r=>{const L=ricLeft(r);return `<div class="row"><div class="grow"><b>${r.kind==="rata"?"📑 ":r.kind==="tratt"?"✂️ ":""}${esc(r.t)}</b><small>${(FREQ[r.freq]||FREQ.m)[0]} · dal ${fmt(r.d0,{day:"numeric",month:"short",year:"numeric"})}${r.fine?" · fino al "+fmt(r.fine,{day:"numeric",month:"short",year:"numeric"}):""}${L?" · restano "+L.n+" ("+euro(L.tot)+")":""}</small></div><span class="amt ${r.tipo==="e"?"e":"u"}">${r.tipo==="e"?"+":"−"}${euro(r.imp)}</span><button class="btn sm" data-cdel="ric:${r.id}">Togli</button></div>`;}).join(""):'<p class="empty">Nessuna voce ricorrente.</p>'}</div>
  <div class="card"><h3>➕ Voce ricorrente, rata o trattenuta</h3><div class="form">
    <label>Voce<input id="rT" maxlength="60" placeholder="es. stipendio, affitto, rata auto"></label><label>Importo €<input id="rI" type="text" inputmode="decimal" placeholder="0,00"></label>
    <label>Tipo<select id="rTp"><option value="u">uscita</option><option value="e">entrata</option></select></label><label>Genere<select id="rK"><option value="">ricorrente</option><option value="rata">rata / finanziamento</option><option value="tratt">trattenuta sullo stipendio</option></select></label>
    <label>Ogni<select id="rF">${Object.entries(FREQ).map(([k,v])=>`<option value="${k}">${v[0]}</option>`).join("")}</select></label><label>Prima data<input id="rD" type="date" value="${t}"></label><label>Ultima data (facoltativa)<input id="rE" type="date"></label>
    <label>Categoria<select id="rC">${KCATS.map(k=>`<option value="${k[0]}">${k[1]} ${k[2]}</option>`).join("")}</select></label></div>
    <div class="btns"><button class="btn pri" id="rAdd">Aggiungi</button></div><p class="lbl">Rate e trattenute con l’ultima data mostrano quante ne restano e spariscono da sole dalla proiezione quando finiscono.</p></div>`;}
function cProj(){const c=C(),R=projection(),D=R.D,neg=R.rows.find(r=>r.bal<0),S=typeof licS==="function"?licS():null;
  return `<div class="card"><h3>Impostazioni</h3><p class="lbl">La proiezione parte dal saldo di oggi di tutti i conti e somma, mese per mese, le voci ricorrenti (con le rate che finiscono), la nuova entrata dopo il congedo e una stima delle spese variabili. Gli importi sono quelli che inserisci tu.</p><div class="form">
    <label>Quale voce è lo stipendio<select id="pS"><option value="">—</option>${c.ric.filter(r=>r.tipo==="e").map(r=>`<option value="${r.id}"${r.id===D.stip?" selected":""}>${esc(r.t)} (${euro(r.imp)})</option>`).join("")}</select></label>
    <label>Smette dal<input id="pD" type="date" value="${D.dal}">${S&&S.end?`<small class="lbl">congedo nelle Licenze: ${fmt(S.end,{day:"numeric",month:"long",year:"numeric"})}</small>`:""}</label>
    <label>Nuova entrata mensile € (es. pensione)<input id="pN" type="text" inputmode="decimal" value="${D.nuovo}" placeholder="0,00"></label>
    <label>Spese variabili al mese €<input id="pV" type="text" inputmode="decimal" value="${D.var!=null&&D.var!==""?D.var:""}" placeholder="stima: ${euro(varEstimate()||0)}"></label>
    <label>Mesi<select id="pM">${[12,24,36].map(n=>`<option${n===D.mesi?" selected":""}>${n}</option>`).join("")}</select></label></div>
    <h3 style="margin-top:12px">Entrate una tantum</h3>${(D.extra||[]).map((x,i)=>`<div class="row"><div class="grow">${esc(x.t)}<small>${fmt(x.d,{day:"numeric",month:"short",year:"numeric"})}</small></div><span class="amt e">+${euro(x.imp)}</span><button class="btn sm" data-xdel="${i}">Togli</button></div>`).join("")}
    <div class="form"><label>Che cosa<input id="xT" placeholder="es. liquidazione"></label><label>Importo €<input id="xI" type="text" inputmode="decimal"></label><label>Mese previsto<input id="xD" type="date"></label></div><div class="btns"><button class="btn" id="xAdd">Aggiungi una tantum</button></div></div>
  <div class="card"><h3>Saldo previsto</h3>${lineChart(R.rows)}${neg?`<p style="color:var(--warn);font-weight:700">⚠️ Con questi numeri il saldo andrebbe sotto zero a ${MESE(neg.ym)}.</p>`:`<p class="lbl">Con questi numeri il saldo resta sopra zero per ${D.mesi} mesi.</p>`}</div>
  <div class="card"><h3>Mese per mese</h3>${R.rows.map(r=>`<div class="row"><div class="grow"><b>${MESE(r.ym)}</b>${D.dal&&r.ym===D.dal.slice(0,7)?' <span class="pill lp">congedo</span>':""}</div><span class="amt e">+${euro(r.e)}</span><span class="amt u">−${euro(r.u)}</span><span class="amt ${r.bal>=0?"":"u"}" style="min-width:110px;text-align:right">${euro(r.bal)}</span></div>`).join("")}</div>`;}

/* ---------- eventi ---------- */
const num=v=>{const n=parseAmt(v);return n==null?null:n;};
function bindConti(){const c=C();if(typeof bindStat==="function")bindStat();
  document.querySelectorAll("[data-ct]").forEach(b=>b.onclick=()=>{CT=b.dataset.ct;try{sessionStorage.setItem("pn-ct",CT);}catch(e){}if(cur!=="conti")go("conti");else render();});
  if($("cHide"))$("cHide").onclick=()=>{c.hide=!c.hide;save();render();};
  // movimenti
  [["fM","ym"],["fA","acc"],["fC","cat"]].forEach(([id,k])=>{if($(id))$(id).onchange=e=>{movF[k]=e.target.value;render();};});
  if($("fQ"))$("fQ").onchange=e=>{movF.q=e.target.value;render();};
  document.querySelectorAll("[data-mcat]").forEach(s=>s.onchange=()=>{const m=c.mov.find(x=>x.id===s.dataset.mcat);if(!m)return;m.cat=s.value;
    const key=normDesc(m.t).split(" ").filter(w=>w.length>3&&!/^(pagamento|acquisto|carta|bonifico|addebito|presso|visa|debit|pos|sepa)$/.test(w))[0];
    if(key&&confirm("Usare sempre «"+catName(s.value)+"» per i movimenti con «"+key+"»?")){c.rules=c.rules.filter(r=>r.k!==key);c.rules.unshift({k:key,cat:s.value});c.mov.forEach(x=>{if(x.id!==m.id&&normDesc(x.t).includes(key))x.cat=s.value;});}
    save();render();});
  document.querySelectorAll("[data-mdel]").forEach(b=>b.onclick=()=>{if(!confirm("Togliere questo movimento?"))return;c.mov=c.mov.filter(x=>x.id!==b.dataset.mdel);save();render();});
  if($("mAdd"))$("mAdd").onclick=()=>{const t=$("mT").value.trim(),i=num($("mI").value);if(!t||!(i>0)){toast("Scrivi che cosa e importo");return;}const tp=$("mTp").value,acc=$("mA").value,d=$("mD").value||today();
    c.mov.push({id:uid(),d,t,imp:i,tipo:tp,cat:guessCat(t,tp==="e"?i:-i),acc,h:movHash(acc||"-",d,tp==="e"?i:-i,t),src:"man"});save();render();toast("Aggiunto");};
  // importazione
  if($("impAcc"))$("impAcc").onchange=e=>{const a=c.acc.find(x=>x.id===e.target.value);$("impHelp").textContent=impHelp(a);};
  if($("impFile"))$("impFile").onchange=async e=>{const f=e.target.files[0];if(!f)return;try{await readImportFile(f,$("impAcc").value);render();}catch(err){toast(err.message||"File non leggibile");}};
  document.querySelectorAll("[data-map]").forEach(s=>s.onchange=()=>{const k=s.dataset.map,v=+s.value;if(k==="desc0"||k==="desc1"){const d=IMP.map.desc.slice();d[k==="desc0"?0:1]=v;IMP.map.desc=d.filter(x=>x>=0);}else IMP.map[k]=v;if(k==="row")IMP.sig=(IMP.rows[v]||[]).map(low).join("|");render();});
  if($("impGo"))$("impGo").onclick=()=>{commitImport();CT="mov";movF={ym:"",acc:"",cat:"",q:""};render();};
  if($("impNo"))$("impNo").onclick=()=>{IMP=null;render();};
  // conti e carte
  const showWallet=pre=>{const t=$(pre+"T");if(!t)return;const f=()=>document.querySelectorAll("[data-wallet]").forEach(x=>{if(x.closest(".card").contains(t))x.hidden=t.value!=="wallet";});t.addEventListener("change",f);};
  showWallet("a");showWallet("e");
  const l4=v=>String(v||"").replace(/\D/g,"").slice(-4);
  if($("aAddAcc"))$("aAddAcc").onclick=()=>{const b=$("aB").value,tp=$("aT").value,bn=bankOf(b)[0],n=$("aN").value.trim()||(bn+" "+(tp==="conto"?"conto":tp==="contanti"||tp==="wallet"?"":tp==="deposito"?"deposito":"carta")).trim(),s=num($("aS").value)||0;
    c.acc.push({id:uid(),n,bank:b,tipo:tp,link:isCard(tp)?$("aL").value:"",l4:l4($("a4").value),giro:tp==="wallet"&&$("aG").checked?1:0,key:tp==="wallet"?($("aK").value.trim()||bn.toLowerCase()):"",s0:s,d0:today(),rec:$("aS").value.trim()?1:0});save();render();toast("Aggiunto");};
  document.querySelectorAll("[data-aed]").forEach(b=>b.onclick=()=>{ACC_ED=b.dataset.aed;render();const e=$("eN");if(e)e.scrollIntoView({block:"center"});});
  if($("eNo"))$("eNo").onclick=()=>{ACC_ED=null;render();};
  if($("eSave"))$("eSave").onclick=()=>{const a=c.acc.find(x=>x.id===ACC_ED);if(!a)return;const n=$("eN").value.trim();if(!n){toast("Scrivi un nome");return;}const s0=num($("eS").value);if(s0==null){toast("Saldo non valido");return;}
    const tp=$("eT").value;Object.assign(a,{n,bank:$("eB").value,tipo:tp,l4:l4($("e4").value),link:isCard(tp)?$("eL").value:"",s0,d0:$("eD").value||a.d0,giro:tp==="wallet"&&$("eG").checked?1:0,key:tp==="wallet"?($("eK").value.trim()||bankOf($("eB").value)[0].toLowerCase()):""});
    ACC_ED=null;save();render();toast("Salvato");};
  if($("eArch"))$("eArch").onclick=()=>{const a=c.acc.find(x=>x.id===ACC_ED);if(!a)return;a.arch=a.arch?0:1;ACC_ED=null;save();render();toast(a.arch?"📦 Archiviato: i movimenti restano nelle statistiche":"Ripristinato");};
  // banche tue
  if($("bAdd"))$("bAdd").onclick=()=>{const n=$("bN").value.trim();if(!n){toast("Scrivi il nome della banca");return;}if(allBanks().some(b=>b.n.toLowerCase()===n.toLowerCase())){toast("C’è già");return;}
    c.banks.push({id:"b"+uid(),n,col:$("bC").value||"#7a4fd1"});save();render();toast("Banca aggiunta: ora scegli «"+n+"» nel nuovo conto");};
  document.querySelectorAll("[data-bcol]").forEach(i=>i.onchange=()=>{const b=c.banks.find(x=>x.id===i.dataset.bcol);if(b){b.col=i.value;save();render();}});
  document.querySelectorAll("[data-bren]").forEach(x=>x.onclick=()=>{const b=c.banks.find(y=>y.id===x.dataset.bren);const v=b&&prompt("Nuovo nome per «"+b.n+"»:",b.n);if(v&&v.trim()){b.n=v.trim();save();render();}});
  document.querySelectorAll("[data-bdel]").forEach(x=>x.onclick=()=>{const id=x.dataset.bdel,n=c.acc.filter(a=>a.bank===id).length;if(n){toast("Ci sono "+n+" conti di questa banca: cambiali o toglili prima");return;}c.banks=c.banks.filter(b=>b.id!==id);delete c.bmap[id];save();render();});
  if($("aPreset"))$("aPreset").onclick=()=>{if(c.acc.length&&!confirm("Aggiungere i conti di Fineco, BNL, N26 e BBVA a quelli che hai già?"))return;
    [["fineco","Fineco"],["bnl","BNL"],["n26","N26"],["bbva","BBVA"]].forEach(([b,nm])=>{const id=uid();c.acc.push({id,n:nm+" conto",bank:b,tipo:"conto",s0:0,d0:today()});if(b!=="n26")c.acc.push({id:uid(),n:nm+" carta di credito",bank:b,tipo:"credito",link:id,s0:0,d0:today()});});
    save();render();toast("Creati: imposta i saldi con «Riconcilia»");};
  document.querySelectorAll("[data-adel]").forEach(b=>b.onclick=()=>{const n=c.mov.filter(m=>m.acc===b.dataset.adel).length;if(!confirm("Togliere questo conto"+(n?" e i suoi "+n+" movimenti":"")+"?"))return;c.acc=c.acc.filter(a=>a.id!==b.dataset.adel);c.mov=c.mov.filter(m=>m.acc!==b.dataset.adel);save();render();});
  document.querySelectorAll("[data-arec]").forEach(b=>b.onclick=()=>{const a=c.acc.find(x=>x.id===b.dataset.arec);const v=prompt("Saldo di oggi secondo la banca per «"+a.n+"» (€):",String(Math.round(accBal(a)*100)/100).replace(".",","));if(v==null)return;const n=num(v);if(n==null){toast("Importo non valido");return;}
    const delta=n-accBal(a);a.s0=(+a.s0||0)+delta;a.rec=1;save();render();toast(Math.abs(delta)<0.005?"✓ Torna al centesimo":"Allineato (differenza "+euro(delta)+")");});
  // budget e regole
  document.querySelectorAll("[data-bud]").forEach(i=>i.onchange=()=>{const n=num(i.value);if(n>0)c.bud[i.dataset.bud]=n;else delete c.bud[i.dataset.bud];save();});
  document.querySelectorAll("[data-rdel]").forEach(b=>b.onclick=()=>{c.rules.splice(+b.dataset.rdel,1);save();render();});
  // ricorrenti
  if($("rAdd"))$("rAdd").onclick=()=>{const t=$("rT").value.trim(),i=num($("rI").value);if(!t||!(i>0)){toast("Scrivi voce e importo");return;}
    c.ric.push({id:uid(),t,imp:i,tipo:$("rTp").value,kind:$("rK").value,freq:$("rF").value,d0:$("rD").value||today(),fine:$("rE").value||"",cat:$("rC").value});save();render();toast("Aggiunta");};
  document.querySelectorAll("[data-cdel]").forEach(b=>b.onclick=()=>{const[tp,id]=b.dataset.cdel.split(":");if(!confirm("Togliere questa voce?"))return;if(tp==="ric")c.ric=c.ric.filter(r=>r.id!==id);else c.mov=c.mov.filter(r=>r.id!==id);save();render();});
  // proiezione
  const pset=(k,v)=>{c.proj[k]=v;save();render();};
  if($("pS"))$("pS").onchange=e=>pset("stip",e.target.value);
  if($("pD"))$("pD").onchange=e=>pset("dal",e.target.value);
  if($("pN"))$("pN").onchange=e=>pset("nuovo",num(e.target.value)||"");
  if($("pV"))$("pV").onchange=e=>{const n=num(e.target.value);pset("var",n==null?null:n);};
  if($("pM"))$("pM").onchange=e=>pset("mesi",+e.target.value);
  if($("xAdd"))$("xAdd").onclick=()=>{const t=$("xT").value.trim()||"Entrata",i=num($("xI").value),d=$("xD").value;if(!(i>0)||!d){toast("Scrivi importo e mese");return;}c.proj.extra=(c.proj.extra||[]).concat([{t,imp:i,d}]);save();render();};
  document.querySelectorAll("[data-xdel]").forEach(b=>b.onclick=()=>{c.proj.extra.splice(+b.dataset.xdel,1);save();render();});
}
