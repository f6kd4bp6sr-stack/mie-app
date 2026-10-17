/* ================= ESERCIZI GENERATI (seconda serie) =================
   Nuovi generatori a numeri sempre nuovi per Fisica, Chimica e Biologia.
   Valori scelti da elenchi perché i conti siano esatti e fattibili a mente;
   distrattori = errori tipici (unità, formule invertite, fattori dimenticati). */
(function(){
const gcd_=(a,b)=>b?gcd_(b,a%b):a;
const FR=(n,d)=>{if(n===0)return"0";const g=gcd_(n,d);n/=g;d/=g;return d===1?String(n):n+"/"+d;};
const sup_=n=>String(n).split("").map(c=>c==="-"?"⁻":"⁰¹²³⁴⁵⁶⁷⁸⁹"[+c]).join("");
const nsci=(m,e)=>{if(!m)return"0";const sg=m<0?-1:1;m=Math.abs(m);while(m>=10){m/=10;e++;}while(m<1){m*=10;e--;}m=+m.toFixed(3);if(m>=10){m/=10;e++;}return sci(sg*m,e);};
const f2=x=>(+x.toFixed(2)).toLocaleString("it-IT",{maximumFractionDigits:2});
const f3=x=>(+x.toFixed(3)).toLocaleString("it-IT",{maximumFractionDigits:3});
const pct=x=>fm(x)+"%";
/* articolo giusto davanti a un numero: lo 0,1%, l'80%, l'11%, il 25% */
const art=v=>{const t=String(v);return /^0/.test(t)?"lo "+t:/^(8|11(?!\d)|1(?![\d,]))/.test(t)?"l'"+t:"il "+t;};const del_=v=>{const a=art(v);return a.startsWith("lo ")?"dello "+a.slice(3):a.startsWith("l'")?"dell'"+a.slice(2):"del "+a.slice(3);};
/* distrattori: stringhe, senza doppioni, senza la risposta giusta, senza valori non validi */
const U=(a,arr)=>{const out=[];for(const x of arr){if(x==null)continue;const s=String(x);if(s!==String(a)&&!out.includes(s)&&!/NaN|undefined|Infinity|null/.test(s))out.push(s);}return out;};
const rev=s=>s.split("").reverse().join("");
const CD={A:"T",T:"A",G:"C",C:"G"},CR={A:"U",U:"A",G:"C",C:"G",T:"A"};
const cmp=(s,M)=>s.split("").map(x=>M[x]).join("");
const rnd=(r,n,al)=>Array.from({length:n},()=>r.pk((al||"ACGT").split(""))).join("");
const fat=(n,d)=>{const g=gcd_(n,d);n/=g;d/=g;return d===1?(n===1?"resta uguale":`diventa ${n} volte più grande`):(n===1?`diventa 1/${d} di quello iniziale`:`diventa ${n}/${d} di quello iniziale`);};
const chg=v=>v>0?"+"+v:v<0?"−"+(-v):"0";

/* ============================ FISICA ============================ */
GEN.fis.push(
 {g:"vcomp",t:"u1c",f(r){const F=r.pk([10,20,40,50,60,100]),th=r.pk([30,45,60]),ax=r.pk(["x","y"]);const h=fm(F/2);
  const H=h+" N",S3=h+"√3 N",S2=h+"√2 N";const tr={x:{30:"√3/2",45:"√2/2",60:"1/2"},y:{30:"1/2",45:"√2/2",60:"√3/2"}}[ax][th];
  const a=tr==="1/2"?H:tr==="√2/2"?S2:S3;
  return{q:`Una forza di ${F} N forma un angolo di ${th}° con l'asse x. Quanto vale la sua componente ${ax==="x"?"orizzontale Fx":"verticale Fy"}?`,a,w:U(a,[a===H?S3:H,S2,S3,F+" N",fm(F/4)+" N","0 N"]),
   s:`F${ax} = F·${ax==="x"?"cos":"sen"} ${th}° = ${F}·${tr} = ${a} (√3 ≈ 1,73; √2 ≈ 1,41). ${ax==="x"?"Il coseno dà la componente lungo il lato adiacente all'angolo.":"Il seno dà la componente lungo il lato opposto all'angolo."}`};}},
 {g:"pscal",t:"u1c",f(r){const a=r.pk([2,3,4,5]),b=r.pk([2,4,6,10]),th=r.pk([0,60,90,120,180]);const c={0:1,60:0.5,90:0,120:-0.5,180:-1}[th],cs={0:"1",60:"1/2",90:"0",120:"−1/2",180:"−1"}[th];const v=a*b*c;
  return{q:`Due vettori hanno moduli ${a} e ${b} (stessa unità) e formano un angolo di ${th}°. Quanto vale il loro prodotto scalare?`,a:fm(v),w:U(fm(v),[fm(a*b),fm(-a*b),fm(a*b/2),fm(-a*b/2),"0",fm(a+b)]),
   s:`a·b = |a|·|b|·cos θ = ${a}·${b}·cos ${th}° = ${a*b}·(${cs}) = ${fm(v)}. ${th===90?"Vettori perpendicolari: prodotto scalare uguale a zero.":th>90?"Angolo maggiore di 90°: coseno negativo, prodotto scalare negativo.":"È uno scalare, non un vettore."}`};}},
 {g:"lancio",t:"u2b",f(r){const m=r.pk([0,1,2]);
  if(m===0){const t=r.pk([2,3,4]),h=5*t*t,v=r.pk([3,4,5,6,8]),x=v*t;
   return{q:`Un sasso viene lanciato orizzontalmente a ${v} m/s dal bordo di un muro alto ${h} m (g = 10 m/s², aria trascurabile). A quale distanza dalla base del muro tocca terra?`,a:x+" m",w:U(x+" m",[fm(x/2)+" m",2*x+" m",h+" m",fm(v*h/5)+" m",fm(v*h/10)+" m",fm(Math.sqrt(x*x+h*h))+" m",x+h+" m"]),
    s:`In verticale è una caduta libera: h = ½gt² → t = √(2·${h}/10) = ${t} s. In orizzontale il moto è uniforme: x = v·t = ${v}·${t} = ${x} m.`};}
  if(m===1){const v=r.pk([10,20,30,40]),R=v*v/10;
   return{q:`Un pallone viene calciato da terra a ${v} m/s con un angolo di 45° (g = 10 m/s², aria trascurabile). Qual è la gittata?`,a:fm(R)+" m",w:U(fm(R)+" m",[fm(R/2)+" m",fm(2*R)+" m",fm(v)+" m",fm(v/10)+" m",fm(R*1.41)+" m"]),
    s:`Gittata R = v₀²·sen(2θ)/g = ${v}²·sen 90°/10 = ${fm(R)} m (a 45° la gittata è massima).`};}
  const v=r.pk([10,20,30,40,50]),T=v/10;
  return{q:`Un proiettile parte da terra a ${v} m/s con un angolo di 30° sull'orizzontale (g = 10 m/s²). Per quanto tempo resta in volo?`,a:fm(T)+" s",w:U(fm(T)+" s",[fm(T/2)+" s",fm(2*T)+" s",fm(T*1.73)+" s",fm(T*0.87)+" s",fm(v)+" s"]),
   s:`Componente verticale: v₀y = ${v}·sen 30° = ${fm(v/2)} m/s. Tempo di volo T = 2·v₀y/g = 2·${fm(v/2)}/10 = ${fm(T)} s (salita + discesa).`};}},
 {g:"centrip",t:"u2b",f(r){const v=r.pk([2,4,6,8,10,12]),R=r.pk([2,4,8]),a=v*v/R;
  return{q:`Un corpo si muove di moto circolare uniforme su una circonferenza di raggio ${R} m alla velocità di ${v} m/s. Quanto vale la sua accelerazione centripeta?`,a:fm(a)+" m/s²",w:U(fm(a)+" m/s²",[fm(v/R)+" m/s²",fm(v*v*R)+" m/s²",fm(a/2)+" m/s²",fm(2*a)+" m/s²",fm(v*R)+" m/s²"]),
   s:`a_c = v²/r = ${v}²/${R} = ${v*v}/${R} = ${fm(a)} m/s², diretta verso il centro: la velocità cambia direzione anche se il modulo è costante.`};}},
 {g:"pianoinc",t:"u2c",f(r){const m=r.pk([2,4,5,10,20]),th=r.pk([30,60]),c=r.pk(["par","norm"]);const P=m*10,h=fm(P/2);const H=h+" N",S3=h+"√3 N";
  const half=(c==="par")===(th===30);const a=half?H:S3;
  return{q:`Un corpo di ${m} kg è fermo su un piano inclinato di ${th}° (g = 10 m/s²). Quanto vale la componente del peso ${c==="par"?"parallela al piano":"perpendicolare al piano"}?`,a,w:U(a,[half?S3:H,P+" N",fm(m/2)+" N",fm(P*2)+" N","0 N"]),
   s:`Peso P = m·g = ${P} N. Componente ${c==="par"?"parallela: P·sen θ":"perpendicolare: P·cos θ"} = ${P}·${half?"1/2":"√3/2"} = ${a} (√3 ≈ 1,73).`};}},
 {g:"attrito",t:"u2c",f(r){const mu=r.pk([0.1,0.2,0.25,0.3,0.5]),m=r.pk([2,4,8,10,20,40]),F=mu*m*10;
  return{q:`Una cassa di ${m} kg viene trascinata a velocità costante su un pavimento orizzontale; il coefficiente di attrito dinamico è ${fm(mu)}. Quale forza orizzontale serve (g = 10 m/s²)?`,a:fm(F)+" N",w:U(fm(F)+" N",[fm(mu*m)+" N",m*10+" N",fm(F*10)+" N",fm(m*10/mu)+" N",fm(m*10-F)+" N"]),
   s:`A velocità costante la forza risultante è zero: la forza applicata equilibra l'attrito. F = μ·m·g = ${fm(mu)}·${m}·10 = ${fm(F)} N.`};}},
 {g:"hooke",t:"u2c",f(r){const k=r.pk([100,200,250,400,500]),x=r.pk([2,4,5,10,20]),F=k*x/100;
  return{q:`Una molla di costante elastica ${k} N/m viene allungata di ${x} cm. Quale forza elastica esercita?`,a:fm(F)+" N",w:U(fm(F)+" N",[fm(k*x)+" N",fm(F/10)+" N",fm(k/x)+" N",fm(F*10)+" N",fm(F/2)+" N"]),
   s:`Legge di Hooke: F = k·x = ${k} N/m · ${fm(x/100)} m = ${fm(F)} N (prima si converte x in metri). La forza è di richiamo, opposta all'allungamento.`};}},
 {g:"mollaen",t:"u2d",f(r){const k=r.pk([100,200,400,500,800]),x=r.pk([5,10,20]),E=k*(x/100)*(x/100)/2,F=k*x/100;
  return{q:`Quanta energia potenziale elastica accumula una molla di costante ${k} N/m compressa di ${x} cm?`,a:fm(E)+" J",w:U(fm(E)+" J",[fm(k*x*x/2)+" J",fm(2*E)+" J",fm(F/2)+" J",fm(F)+" J",fm(E*100)+" J"]),
   s:`U = ½·k·x² = ½·${k}·(${fm(x/100)} m)² = ${fm(E)} J. Attenzione: x va in metri e compare al quadrato.`};}},
 {g:"leva",t:"u2e",f(r){const b=r.pk([3,4,5]),k=r.pk([6,7,8,10]),P=r.pk([10,20,30,50]),L=b*k,F=P*k;
  return{q:`Avambraccio orizzontale: il bicipite si inserisce a ${b} cm dal gomito (fulcro) e la mano regge un peso di ${P} N a ${L} cm dal gomito. Trascurando il peso dell'avambraccio, quale forza deve esercitare il bicipite?`,a:F+" N",w:U(F+" N",[fm(P/k)+" N",P+" N",P*L+" N",F*2+" N",P*(k-1)+" N"]),
   s:`Equilibrio dei momenti rispetto al gomito: F·${b} = ${P}·${L} → F = ${P}·${L}/${b} = ${F} N. Leva di terzo genere: svantaggiosa (F > carico) ma amplifica lo spostamento della mano.`};}},
 {g:"momento",t:"u2e",f(r){const F=r.pk([10,20,30,40,50]),d=r.pk([0.2,0.5,1,2]),th=r.pk([90,30,0]);const sn=th===90?1:th===30?0.5:0;const M=F*d*sn;
  return{q:`Una forza di ${F} N è applicata a ${fm(d)} m dal fulcro e forma un angolo di ${th}° con il braccio (la congiungente fulcro-punto di applicazione). Quanto vale il momento torcente?`,a:fm(M)+" N·m",w:U(fm(M)+" N·m",[fm(F*d)+" N·m",fm(F*d/2)+" N·m",fm(F/d)+" N·m",fm(2*F*d)+" N·m","0 N·m",fm(F*d*Math.sqrt(3)/2)+" N·m"]),
   s:`τ = F·d·sen θ = ${F}·${fm(d)}·sen ${th}° = ${fm(M)} N·m. ${th===0?"Forza diretta lungo il braccio: non fa ruotare.":th===90?"Forza perpendicolare al braccio: momento massimo.":"Fa ruotare solo la componente perpendicolare, F·sen 30° = F/2."}`};}},
 {g:"gallegg",t:"u3b",f(r){const fl=r.pk([[1000,"acqua (ρ = 1000 kg/m³)",[200,250,400,500,600,750,800,900]],[1200,"una soluzione salina concentrata (ρ = 1200 kg/m³)",[300,600,900]]]);const rc=r.pk(fl[2]);const imm=rc/fl[0]*100,em=100-imm,ask=r.pk([0,1]);const a=pct(ask?em:imm);
  return{q:`Un corpo omogeneo di densità ${rc} kg/m³ galleggia in ${fl[1]}. Quale percentuale del suo volume resta ${ask?"emersa":"immersa"}?`,a,w:U(a,[pct(ask?imm:em),"100%",pct(imm/2),pct(rc/100),pct(em/2),"0%"]),
   s:`All'equilibrio spinta = peso: ρ_fluido·V_imm·g = ρ_corpo·V·g → V_imm/V = ${rc}/${fl[0]} = ${fm(imm)}%; emerge il ${fm(em)}%.`};}},
 {g:"spinta",t:"u3b",f(r){const V=r.pk([0.5,1,2,4,5,10]),S=10*V;
  if(r.pk([0,1]))return{q:`Un oggetto di ${fm(V)} L di volume è completamente immerso in acqua (ρ = 1000 kg/m³, g = 10 m/s²). Quanto vale la spinta di Archimede?`,a:fm(S)+" N",w:U(fm(S)+" N",[fm(S*1000)+" N",fm(V)+" N",fm(S/1000)+" N",fm(S*100)+" N",fm(S/2)+" N"]),
   s:`S = ρ·V·g = 1000·${fm(V/1000)} m³·10 = ${fm(S)} N (1 L = 10⁻³ m³): è il peso dell'acqua spostata.`};
  const rc=r.pk([2000,3000,5000,8000]),P=rc*V/100,Pa=P-S;
  return{q:`Un sasso di ${fm(V)} L e densità ${rc} kg/m³, appeso a un dinamometro, viene immerso completamente in acqua (g = 10 m/s²). Che cosa segna il dinamometro?`,a:fm(Pa)+" N",w:U(fm(Pa)+" N",[fm(P)+" N",fm(S)+" N",fm(P+S)+" N",fm(Pa*1000)+" N",fm(Pa/2)+" N"]),
   s:`Peso: P = ${rc}·${fm(V/1000)}·10 = ${fm(P)} N. Spinta: S = 1000·${fm(V/1000)}·10 = ${fm(S)} N. Peso apparente = P − S = ${fm(Pa)} N.`};}},
 {g:"bernoul",t:"u3c",f(r){const[v1,v2]=r.pk([[1,2],[1,3],[1,4],[1,5],[2,3],[2,4],[2,5]]);const d=500*(v2*v2-v1*v1);
  return{q:`In un vaso orizzontale il sangue (ρ ≈ 1000 kg/m³) passa da ${v1} m/s a ${v2} m/s attraversando una stenosi. Di quanto diminuisce la pressione nella stenosi (fluido ideale)?`,a:fm(d)+" Pa",w:U(fm(d)+" Pa",[fm(500*(v2-v1)*(v2-v1))+" Pa",fm(1000*(v2*v2-v1*v1))+" Pa",fm(500*(v2-v1))+" Pa",fm(500*v2*v2)+" Pa",fm(d/1000)+" Pa"]),
   s:`Bernoulli a quota costante: p₁ − p₂ = ½ρ(v₂² − v₁²) = 500·(${v2*v2} − ${v1*v1}) = ${fm(d)} Pa. Dove la velocità aumenta la pressione cala (rischio di collasso del vaso nella stenosi).`};}},
 {g:"invquad",t:"u4b",f(r){const I=r.pk([36,72,144,360]),k=r.pk([2,3,6]);
  if(r.r()<0.7)return{q:`A una certa distanza da una sorgente sonora puntiforme l'intensità è ${I} mW/m². Quanto vale a una distanza ${k} volte maggiore (assorbimento trascurabile)?`,a:fm(I/k/k)+" mW/m²",w:U(fm(I/k/k)+" mW/m²",[fm(I/k)+" mW/m²",fm(I*k*k)+" mW/m²",fm(I/(2*k))+" mW/m²",fm(I*k)+" mW/m²",fm(I/k/k/k)+" mW/m²"]),
   s:`La potenza si distribuisce su una sfera di area 4πr²: I ∝ 1/r². Distanza ×${k} → intensità ÷${k*k}: ${I}/${k*k} = ${fm(I/k/k)} mW/m².`};
  const kk=r.pk([2,3]);return{q:`Un rilevatore misura ${I} mW/m² a una certa distanza da una sorgente puntiforme. Che intensità misura se la distanza si riduce a 1/${kk}?`,a:fm(I*kk*kk)+" mW/m²",w:U(fm(I*kk*kk)+" mW/m²",[fm(I*kk)+" mW/m²",fm(I/kk/kk)+" mW/m²",fm(I*2*kk)+" mW/m²",fm(I/kk)+" mW/m²",fm(I*kk*kk*kk)+" mW/m²"]),
   s:`I ∝ 1/r²: distanza ÷${kk} → intensità ×${kk*kk}: ${I}·${kk*kk} = ${fm(I*kk*kk)} mW/m².`};}},
 {g:"primop",t:"u5c",f(r){const Q=r.pk([100,200,300,500]),L=r.pk([50,80,150,250,400]),cq=r.pk([1,-1]),cl=r.pk([1,-1]);const dU=cq*Q-cl*L;
  const tq=cq>0?`assorbe ${Q} J di calore`:`cede ${Q} J di calore`,tl=cl>0?`compie un lavoro di ${L} J sull'ambiente (espansione)`:`subisce un lavoro di ${L} J (compressione)`;
  return{q:`Un gas ${tq} e ${tl}. Quanto vale la variazione della sua energia interna?`,a:fm(dU)+" J",w:U(fm(dU)+" J",[fm(cq*Q+cl*L)+" J",fm(-cq*Q-cl*L)+" J",fm(-cq*Q+cl*L)+" J",fm(Q+L)+" J","0 J"]),
   s:`Primo principio: ΔU = Q − L, con Q > 0 se il calore entra e L > 0 se il gas compie lavoro. Q = ${cq*Q} J, L = ${cl*L} J → ΔU = ${cq*Q} − (${cl*L}) = ${fm(dU)} J.`};}},
 {g:"carnot",t:"u5d",f(r){const[Th,Tc]=r.pk([[400,300],[500,250],[600,300],[800,600],[500,400],[1000,300],[600,450],[800,200]]);const e=(1-Tc/Th)*100,hC=Th-273,cC=Tc-273;
  return{q:`Una macchina di Carnot lavora tra una sorgente calda a ${hC} °C e una fredda a ${cC} °C. Qual è il suo rendimento?`,a:pct(e),w:U(pct(e),[pct(100-e),...[(1-cC/hC)*100,cC/hC*100].filter(x=>x>0&&x<100).map(pct),"100%",pct(e/2),pct(Tc/Th*50)]),
   s:`Le temperature vanno in kelvin: ${hC} °C = ${Th} K e ${cC} °C = ${Tc} K. η = 1 − T_fredda/T_calda = 1 − ${Tc}/${Th} = ${fm(e)}%. Nessuna macchina reale tra le stesse temperature fa meglio.`};}},
 {g:"condens",t:"u6c",f(r){const[a,b]=r.pk([[2,2],[3,6],[4,4],[6,12],[2,6],[4,12],[10,10],[10,40],[5,20],[6,3]]);const ser=a*b/(a+b),par=a+b,s=r.pk([0,1]);const v=s?ser:par;
  return{q:`Due condensatori da ${a} μF e ${b} μF sono collegati in ${s?"serie":"parallelo"}. Qual è la capacità equivalente?`,a:fm(v)+" μF",w:U(fm(v)+" μF",[fm(s?par:ser)+" μF",fm(a*b)+" μF",fm(Math.abs(a-b))+" μF",fm((a+b)/2)+" μF",fm(v*2)+" μF"]),
   s:s?`In serie si sommano i reciproci: 1/C = 1/${a} + 1/${b} → C = ${a}·${b}/(${a}+${b}) = ${fm(ser)} μF (minore della più piccola). È il contrario delle resistenze.`:`In parallelo le capacità si sommano: C = ${a} + ${b} = ${par} μF.`};}},
 {g:"encond",t:"u6c",f(r){const C=r.pk([2,4,10,20,50]),V=r.pk([10,20,100,200]);const E=C*V*V/2000;
  return{q:`Un condensatore da ${C} μF è caricato a ${V} V. Quanta energia immagazzina?`,a:fm(E)+" mJ",w:U(fm(E)+" mJ",[fm(E*2)+" mJ",fm(C*V/2000)+" mJ",fm(E*1000)+" mJ",fm(E/1000)+" mJ",fm(C*V/1000)+" mJ"]),
   s:`U = ½·C·V² = ½·${C}·10⁻⁶ F·(${V} V)² = ${fm(C*V*V/2)} μJ = ${fm(E)} mJ.`};}},
 {g:"raggiob",t:"u6e",f(r){const[a,b]=r.pk([[2,1],[1,2],[3,1],[2,3],[3,2],[1,3],[4,3],[3,4]]);const ans=fat(a,b);
  return{q:`Una particella carica entra perpendicolarmente in un campo magnetico uniforme e descrive una circonferenza. Se ${a>1?`la velocità viene moltiplicata per ${a}`:"la velocità resta la stessa"} e ${b>1?`il campo B viene moltiplicato per ${b}`:"il campo resta lo stesso"}, il raggio dell'orbita:`,a:ans,
   w:U(ans,[fat(b,a),fat(a*b,1),fat(a,b*b),fat(a*a,b),fat(1,1),fat(1,a*b),fat(4,1),fat(1,4),fat(9,1)]),
   s:`Forza di Lorentz = forza centripeta: qvB = mv²/r → r = mv/(qB). Il raggio è proporzionale a v e inversamente proporzionale a B: fattore ${a}/${b}, quindi ${ans}.`};}},
 {g:"filo",t:"u6e",f(r){const B=r.pk([0.1,0.2,0.5]),I=r.pk([2,4,5,10]),L=r.pk([0.5,1,2]);const F=B*I*L;
  return{q:`Un filo rettilineo lungo ${fm(L)} m, percorso da una corrente di ${I} A, è perpendicolare a un campo magnetico uniforme di ${fm(B)} T. Quale forza agisce sul filo?`,a:fm(F)+" N",w:U(fm(F)+" N",[fm(B*I)+" N",fm(F*10)+" N",fm(I*L/B)+" N",fm(B*L/I)+" N",fm(F/2)+" N"]),
   s:`F = B·I·L·sen 90° = ${fm(B)}·${I}·${fm(L)} = ${fm(F)} N, perpendicolare sia al filo sia al campo (regola della mano destra).`};}},
 {g:"lavoroq",t:"u6b",f(r){const q=r.pk([2,5,10,20]),V=r.pk([10,50,100,200,500]);const L=q*V/1000;
  return{q:`Una carica di +${q} μC si sposta da un punto a potenziale più alto a uno più basso; la differenza di potenziale è ${V} V. Quanto lavoro compie su di essa il campo elettrico?`,a:fm(L)+" mJ",w:U(fm(L)+" mJ",[fm(L*1000)+" mJ",fm(L/1000)+" mJ",fm(q/V)+" mJ",fm(V/q)+" mJ",fm(L*2)+" mJ"]),
   s:`L = q·ΔV = ${q}·10⁻⁶ C · ${V} V = ${fm(q*V)} μJ = ${fm(L)} mJ. Il lavoro è positivo e l'energia potenziale della carica diminuisce della stessa quantità.`};}},
 {g:"emival",t:"u7d",f(r){const x=r.pk([2,3,4,5]),n=r.pk([1,2,3,4]),T=100/2**n;
  return{q:`Un materiale ha spessore emivalente di ${x} mm per un fascio di raggi X. Quale percentuale dell'intensità attraversa uno schermo spesso ${x*n} mm?`,a:pct(T),w:U(pct(T),[pct(100/(2*n)),pct(100-T),pct(T/2),pct(T*2),pct(100/(n+1)),pct(T/4),pct(100-T/2)]),
   s:`${x*n} mm = ${n} spessor${n===1?"e":"i"} emivalent${n===1?"e":"i"}: ogni strato dimezza l'intensità → I/I₀ = (1/2)^${n} = ${fm(T)}%. L'attenuazione è esponenziale (Lambert-Beer), non lineare.`};}},
 {g:"assorb",t:"u7d",f(r){const A=r.pk([1,2,3]),Ts={1:"10%",2:"1%",3:"0,1%"},m=r.pk([0,1,2]);
  if(m===0)return{q:`Un campione ha assorbanza A = ${A} (A = log I₀/I). Quale percentuale dell'intensità incidente viene trasmessa?`,a:Ts[A],w:U(Ts[A],["10%","1%","0,1%",pct(100-100/10**A),pct(100/A),"0,01%"]),
   s:`T = I/I₀ = 10^(−A) = 10^(−${A}) = ${Ts[A]}. Ogni unità di assorbanza riduce l'intensità di 10 volte.`};
  if(m===1)return{q:`Attraverso un campione passa ${art(Ts[A])} della luce incidente. Quanto vale la sua assorbanza A = log I₀/I?`,a:String(A),w:U(String(A),["1","2","3","0,1","0,01",String(A+1)]),
   s:`I₀/I = ${10**A} → A = log ${10**A} = ${A}.`};
  const k=r.pk([2,3]);return{q:`Una soluzione ha assorbanza 1 (trasmette il 10% della luce). Se lo spessore attraversato diventa ${k} volte maggiore, quale percentuale della luce viene trasmessa?`,a:Ts[k],w:U(Ts[k],[pct(10/k),"10%",pct(10*k),Ts[5-k],"0,01%"]),
   s:`Lambert-Beer: A = ε·c·l è proporzionale allo spessore, quindi A diventa ${k} e T = 10^(−${k}) = ${Ts[k]}. L'intensità cala in modo esponenziale, non lineare.`};}},
 {g:"vluce",t:"u7b",f(r){if(r.pk([0,1])){const n=r.pk([1.25,1.5,2,2.4]),v=3/n;const mz=n===2.4?"il diamante (n = 2,4)":n===1.25?"un mezzo trasparente":"un mezzo trasparente";const S=(x,e)=>sci(fm(x),e||8)+" m/s";
   return{q:`Qual è la velocità della luce in un mezzo con indice di rifrazione ${fm(n)}? (c = 3·10⁸ m/s)`,a:S(v),w:U(S(v),[S(3*n),S(3),S(v,9),S(3/(n*n)),S(v,7)]),
    s:`n = c/v → v = c/n = 3·10⁸/${fm(n)} = ${S(v)}. In ogni mezzo materiale la luce è più lenta che nel vuoto.`};}
  const l0=r.pk([600,450,750,480]),n=r.pk([1.5,1.6,1.2]),l=l0/n;
  return{q:`Una luce di lunghezza d'onda ${l0} nm nel vuoto entra in un mezzo trasparente con indice di rifrazione ${fm(n)}. Quanto vale la lunghezza d'onda nel mezzo?`,a:fm(l)+" nm",w:U(fm(l)+" nm",[fm(l0*n)+" nm",l0+" nm",fm(l0/(n*n))+" nm",fm(l0*n*n)+" nm",fm(l0-n*100)+" nm"]),
   s:`La frequenza non cambia, la velocità diventa c/n: λ = λ₀/n = ${l0}/${fm(n)} = ${fm(l)} nm.`};}},
 {g:"snell",t:"u7b",f(r){if(r.r()<0.6){const s1=r.pk([0.3,0.45,0.6,0.9]),n2=r.pk([1.2,1.5]),s2=s1/n2;
   return{q:`Un raggio di luce passa dall'aria (n = 1) a un mezzo con n = ${fm(n2)}; il seno dell'angolo di incidenza è ${fm(s1)}. Quanto vale il seno dell'angolo di rifrazione?`,a:fm(s2),w:U(fm(s2),[fm(s1*n2),fm(s1),fm(s1/(n2*n2)),fm(n2/s1),fm(1-s2)]),
    s:`Snell: n₁·sen θ₁ = n₂·sen θ₂ → sen θ₂ = 1·${fm(s1)}/${fm(n2)} = ${fm(s2)}: entrando nel mezzo più rifrangente il raggio si avvicina alla normale.`};}
  const c=r.pk([["2","1/2","30°"],["√2 ≈ 1,41","√2/2","45°"],["2/√3 ≈ 1,15","√3/2","60°"]]);
  return{q:`Un raggio passa da un materiale con indice di rifrazione ${c[0]} verso l'aria (n = 1). Qual è l'angolo limite oltre il quale si ha riflessione totale?`,a:c[2],w:U(c[2],["15°","30°","45°","60°","90°"]),
   s:`sen θ_L = n_aria/n_materiale = 1/(${c[0].split(" ")[0]}) = ${c[1]} → θ_L = ${c[2]}. La riflessione totale avviene solo passando verso il mezzo meno rifrangente (come nelle fibre ottiche degli endoscopi).`};}}
);

/* ============================ CHIMICA ============================ */
const NOX=[["H₂SO₄","S",6,"2·(+1) + S + 4·(−2) = 0"],["SO₂","S",4,"S + 2·(−2) = 0"],["H₂S","S",-2,"2·(+1) + S = 0"],["HNO₃","N",5,"+1 + N + 3·(−2) = 0"],["NO₂⁻","N",3,"N + 2·(−2) = −1"],["NH₄⁺","N",-3,"N + 4·(+1) = +1"],["N₂O","N",1,"2·N + (−2) = 0"],["NO","N",2,"N + (−2) = 0"],["H₂O₂","O",-1,"perossido: 2·(+1) + 2·O = 0"],["KMnO₄","Mn",7,"+1 + Mn + 4·(−2) = 0"],["MnO₂","Mn",4,"Mn + 2·(−2) = 0"],["K₂Cr₂O₇","Cr",6,"2·(+1) + 2·Cr + 7·(−2) = 0"],["Fe₂O₃","Fe",3,"2·Fe + 3·(−2) = 0"],["FeCl₂","Fe",2,"Fe + 2·(−1) = 0"],["H₃PO₄","P",5,"3·(+1) + P + 4·(−2) = 0"],["PO₄³⁻","P",5,"P + 4·(−2) = −3"],["SO₄²⁻","S",6,"S + 4·(−2) = −2"],["CH₄","C",-4,"C + 4·(+1) = 0"],["HCHO (metanale)","C",0,"2·(+1) + C + (−2) = 0"],["CH₃OH","C",-2,"C + 4·(+1) + (−2) = 0"],["HCOOH","C",2,"2·(+1) + C + 2·(−2) = 0"],["CO₂","C",4,"C + 2·(−2) = 0"],["NaClO","Cl",1,"+1 + Cl + (−2) = 0"],["HClO₄","Cl",7,"+1 + Cl + 4·(−2) = 0"],["NaH","H",-1,"idruro: +1 + H = 0"]];
const AMM=[["La glicina",[["α-COOH",2.3,"a"],["α-NH₃⁺",9.6,"b"]]],["L'alanina",[["α-COOH",2.3,"a"],["α-NH₃⁺",9.7,"b"]]],["L'acido aspartico",[["α-COOH",2.0,"a"],["COOH laterale",3.9,"a"],["α-NH₃⁺",9.8,"b"]]],["L'acido glutammico",[["α-COOH",2.2,"a"],["COOH laterale",4.3,"a"],["α-NH₃⁺",9.7,"b"]]],["La lisina",[["α-COOH",2.2,"a"],["α-NH₃⁺",9.0,"b"],["NH₃⁺ laterale",10.5,"b"]]],["L'arginina",[["α-COOH",2.2,"a"],["α-NH₃⁺",9.0,"b"],["guanidinio laterale",12.5,"b"]]],["L'istidina",[["α-COOH",1.8,"a"],["imidazolo laterale",6.0,"b"],["α-NH₃⁺",9.2,"b"]]]];
const STEREO=[["il glucosio in forma aperta (aldoesoso)",4],["il glucosio in forma ciclica piranosica",5],["il ribosio in forma aperta (aldopentoso)",3],["il fruttosio in forma aperta (chetoesoso)",3],["il 2-desossiribosio in forma aperta",2],["la treonina",2],["l'isoleucina",2],["l'eritrosio (aldotetroso)",2],["la gliceraldeide",1],["l'alanina",1],["una molecola con 6 centri stereogenici",6]];
const INSAT=[["C₆H₆ (benzene)",6,6,0,0],["C₆H₁₂ (cicloesano)",6,12,0,0],["C₆H₁₀",6,10,0,0],["C₂H₂ (etino)",2,2,0,0],["C₄H₈",4,8,0,0],["C₅H₅N (piridina)",5,5,1,0],["C₆H₁₂O₆ (glucosio)",6,12,0,0],["C₃H₆O (acetone)",3,6,0,0],["C₁₀H₈ (naftalene)",10,8,0,0],["C₇H₈ (toluene)",7,8,0,0],["C₈H₁₈ (ottano)",8,18,0,0],["C₆H₅Cl (clorobenzene)",6,5,0,1],["C₄H₆ (butadiene)",4,6,0,0],["C₇H₆O₂ (acido benzoico)",7,6,0,0],["C₄H₄N₂ (pirimidina)",4,4,2,0],["C₂H₅NO₂ (glicina)",2,5,1,0]];
GEN.chi.push(
 {g:"avog",t:"c1b",f(r){const NA=n=>nsci(n*6.02,23);
  if(r.pk([0,1])){const n=r.pk([0.1,0.2,0.5,2,3,5]);
   return{q:`Quante molecole ci sono in ${fm(n)} mol di una sostanza molecolare? (N_A = 6,02·10²³ mol⁻¹)`,a:NA(n),w:U(NA(n),[NA(n*10),NA(n/10),nsci(n/6.02,-23),NA(1),NA(n*2)]),
    s:`N = n·N_A = ${fm(n)}·6,02·10²³ = ${NA(n)} molecole.`};}
  const sp=r.pk([["H₂O",18,3],["CO₂",44,3],["CH₄",16,5],["NH₃",17,4],["O₂",32,2]]),n=r.pk([0.1,0.5,2]),g=sp[1]*n,at=r.pk([0,1]);const a=at?NA(n*sp[2]):NA(n);
  return{q:`Quant${at?"i atomi in totale":"e molecole"} contengono ${fm(g)} g di ${sp[0]}? (M = ${sp[1]} g/mol; N_A = 6,02·10²³ mol⁻¹)`,a,w:U(a,[at?NA(n):NA(n*sp[2]),NA(g),NA(n*10),NA(n/10),NA(n*sp[2]*2)]),
   s:`n = m/M = ${fm(g)}/${sp[1]} = ${fm(n)} mol → ${NA(n)} molecole${at?`; ogni molecola di ${sp[0]} ha ${sp[2]} atomi → ${a} atomi`:""}.`};}},
 {g:"nox",t:"c1b",f(r){const[fo,el,v,cal]=r.pk(NOX);const a=chg(v);
  return{q:`Qual è il numero di ossidazione di ${el} in ${fo}?`,a,w:U(a,[chg(-v),chg(v+2),chg(v-2),chg(v+1),chg(v-1),chg(v+4)]),
   s:`Regole: H = +1 (−1 negli idruri), O = −2 (−1 nei perossidi), metalli alcalini +1; la somma dei numeri di ossidazione è uguale alla carica della specie. ${cal} → ${el} = ${a}.`};}},
 {g:"gasstp",t:"c1c",f(r){if(r.pk([0,1])){const sp=r.pk([["O₂",32],["N₂",28],["CO₂",44],["He",4],["CH₄",16]]),n=r.pk([0.25,0.5,2,3]),g=sp[1]*n,V=22.4*n;
   return{q:`Che volume occupano ${fm(g)} g di ${sp[0]} (M = ${sp[1]} g/mol) a 0 °C e 1 atm? (volume molare 22,4 L/mol)`,a:fm(V)+" L",w:U(fm(V)+" L",[fm(22.4/n)+" L",fm(g*22.4)+" L",fm(V/2)+" L",fm(V*2)+" L","22,4 L"]),
    s:`n = ${fm(g)}/${sp[1]} = ${fm(n)} mol → V = n·22,4 L/mol = ${fm(V)} L (qualunque gas ideale, in condizioni normali).`};}
  const n=r.pk([0.5,1,2]),V=r.pk([5.6,11.2,22.4,44.8]),p=n*22.4/V;
  return{q:`${fm(n)} mol di gas ideale sono chiuse in un recipiente di ${fm(V)} L a 0 °C. Quale pressione esercitano? (A 0 °C e 1 atm una mole occupa 22,4 L.)`,a:fm(p)+" atm",w:U(fm(p)+" atm",[fm(1/p)+" atm",fm(n*V/22.4)+" atm",fm(p*2)+" atm",fm(p/2)+" atm",fm(p*273)+" atm"]),
   s:`pV = nRT con R·T = 0,082·273 ≈ 22,4 L·atm/mol → p = n·22,4/V = ${fm(n)}·22,4/${fm(V)} = ${fm(p)} atm.`};}},
 {g:"henry",t:"c2a",f(r){const S=r.pk([10,12,15,20]),d=r.pk([10,20,30,40]),p=1+d/10,S2=S*p;
  return{q:`A livello del mare (1 atm) un gas inerte si scioglie nel plasma per ${S} mL/L. Quanto se ne scioglie in un sub a ${d} m di profondità? (ogni 10 m d'acqua +1 atm; temperatura costante)`,a:fm(S2)+" mL/L",w:U(fm(S2)+" mL/L",[fm(S*d/10)+" mL/L",fm(S)+" mL/L",fm(S/p)+" mL/L",fm(S*d)+" mL/L",fm(S*p*p)+" mL/L"]),
   s:`Legge di Henry: la solubilità è proporzionale alla pressione parziale. A ${d} m la pressione è 1 + ${d/10} = ${p} atm → ${S}·${p} = ${fm(S2)} mL/L. Risalendo troppo in fretta il gas in eccesso forma bolle (malattia da decompressione).`};}},
 {g:"pmm",t:"c2b",f(r){const[s,w]=r.pk([[5,95],[10,40],[20,80],[25,75],[15,135],[30,120],[2,48],[12,188],[4,16]]),x=s/(s+w)*100,sol=r.pk(["NaCl","glucosio","KCl","saccarosio"]);
  return{q:`Si sciolgono ${s} g di ${sol} in ${w} g d'acqua. Qual è la concentrazione in % m/m?`,a:pct(x),w:U(pct(x),[pct(s/w*100),pct(s),pct(100-x),pct(x/10),pct(x*2)]),
   s:`% m/m = massa di soluto / massa di soluzione · 100 = ${s}/(${s} + ${w})·100 = ${s}/${s+w}·100 = ${fm(x)}%. Al denominatore va la soluzione, non il solo solvente.`};}},
 {g:"pmv",t:"c2b",f(r){if(r.pk([0,1])){const p=r.pk([0.9,5,10,20]),V=r.pk([100,250,500,1000]),g=p*V/100;const nm=p===0.9?"soluzione fisiologica (NaCl allo 0,9% m/V)":`soluzione glucosata al ${p}% m/V`;
   return{q:`Quanti grammi di soluto sono contenuti in ${V} mL di ${nm}?`,a:fm(g)+" g",w:U(fm(g)+" g",[fm(p*V)+" g",fm(g/10)+" g",fm(g*10)+" g",fm(p)+" g",fm(g/2)+" g"]),
    s:`${fm(p)}% m/V significa ${fm(p)} g ogni 100 mL di soluzione → ${fm(p)}·${V}/100 = ${fm(g)} g.`};}
  const s=r.pk([0.9,1.8,4.5,9,18,45]),V=r.pk([100,500,1000]),x=s/V*100;
  return{q:`${fm(s)} g di NaCl vengono sciolti in acqua fino a un volume di ${V} mL di soluzione. Qual è la concentrazione in % m/V?`,a:pct(x),w:U(pct(x),[pct(s/V),pct(s*V/100),pct(s),pct(x*10),pct(x/10)]),
   s:`% m/V = grammi di soluto per 100 mL di soluzione = ${fm(s)}/${V}·100 = ${fm(x)}%.`};}},
 {g:"molal",t:"c2b",f(r){const sp=r.pk([["glucosio",180],["urea",60],["NaOH",40],["saccarosio",342]]),n=r.pk([0.1,0.2,0.5,1]),kg=r.pk([200,250,500,1000]);const g=sp[1]*n,m=n/(kg/1000);
  return{q:`Si sciolgono ${fm(g)} g di ${sp[0]} (M = ${sp[1]} g/mol) in ${kg} g d'acqua. Qual è la molalità della soluzione?`,a:fm(m)+" mol/kg",w:U(fm(m)+" mol/kg",[fm(n/kg)+" mol/kg",fm(n*kg/1000)+" mol/kg",fm(g/(kg/1000))+" mol/kg",fm(n)+" mol/kg",fm(m*10)+" mol/kg"]),
   s:`n = ${fm(g)}/${sp[1]} = ${fm(n)} mol; molalità = moli di soluto / kg di SOLVENTE = ${fm(n)}/${fm(kg/1000)} = ${fm(m)} mol/kg.`};}},
 {g:"frazmol",t:"c2b",f(r){const[ns,nw]=r.pk([[1,9],[1,4],[2,8],[1,19],[3,7],[1,3],[2,18],[1,49]]),x=ns/(ns+nw);
  return{q:`Si mescolano ${ns*46} g di etanolo (M = 46 g/mol) con ${nw*18} g d'acqua (M = 18 g/mol). Qual è la frazione molare dell'etanolo?`,a:fm(x),w:U(fm(x),[fm(ns/nw),fm(nw/(ns+nw)),fm(ns*46/(ns*46+nw*18)),fm(x*100),fm(x/2)]),
   s:`n(etanolo) = ${ns*46}/46 = ${ns} mol; n(acqua) = ${nw*18}/18 = ${nw} mol → x = ${ns}/(${ns} + ${nw}) = ${fm(x)}. È adimensionale e le frazioni molari di tutti i componenti sommano a 1.`};}},
 {g:"meq",t:"c2b",f(r){const io=r.pk([["Na⁺",23,1,[2,4,5,10]],["K⁺",39,1,[2,4,5]],["Ca²⁺",40,2,[1,1.5,2,2.5]],["Mg²⁺",24,2,[0.5,1,1.5,2]]]);const c=r.pk(io[3]),mg=c*io[1],eq=c*io[2];
  return{q:`Un campione di liquido biologico contiene ${fm(mg)} mg/L di ${io[0]} (massa atomica ${io[1]}). Quanto vale la concentrazione in mEq/L?`,a:fm(eq)+" mEq/L",w:U(fm(eq)+" mEq/L",[fm(io[2]===2?c:c*2)+" mEq/L",fm(mg)+" mEq/L",fm(c/2)+" mEq/L",fm(mg*io[2])+" mEq/L",fm(eq*10)+" mEq/L"]),
   s:`mmol/L = ${fm(mg)} mg/L / ${io[1]} = ${fm(c)} mmol/L; mEq/L = mmol/L × carica dello ione (${io[2]}) = ${fm(eq)} mEq/L.`};}},
 {g:"daltonp",t:"c2b",f(r){const x=r.pk([20,21,40,50,80]),P=r.pk([50,100,200,300,400]),pp=x*P/100,gas=x===21?"O₂":r.pk(["O₂","N₂","He"]);
  return{q:`Una miscela gassosa a pressione totale ${P} kPa contiene il ${x}% in moli di ${gas}. Quanto vale la pressione parziale di ${gas}?`,a:fm(pp)+" kPa",w:U(fm(pp)+" kPa",[fm(P*100/x)+" kPa",fm(x)+" kPa",fm(P-pp)+" kPa",fm(pp/10)+" kPa",fm(pp*2)+" kPa"]),
   s:`Legge di Dalton: p_i = x_i·P_tot = ${fm(x/100)}·${P} = ${fm(pp)} kPa. La somma delle pressioni parziali è la pressione totale.`};}},
 {g:"raoult",t:"c2c",f(r){const P0=r.pk([20,30,40,50,100]),[ns,nw]=r.pk([[1,9],[1,4],[1,19],[1,3]]),x=ns/(ns+nw),dP=P0*x,P=P0-dP,ask=r.pk([0,1]);const a=fm(ask?dP:P)+" mmHg";
  return{q:`${ns===1?"Si scioglie 1 mol":"Si sciolgono "+ns+" mol"} di un soluto non volatile e non elettrolita in ${nw} mol di solvente, la cui tensione di vapore allo stato puro è ${P0} mmHg. ${ask?"Di quanto si abbassa la tensione di vapore?":"Quale tensione di vapore ha la soluzione?"}`,a,
   w:U(a,[fm(ask?P:dP)+" mmHg",P0+" mmHg",fm(P0*ns/nw)+" mmHg",fm(P0*(1-ns/nw))+" mmHg",fm(P0+dP)+" mmHg"]),
   s:`Raoult: P = x_solvente·P° = ${nw}/${ns+nw}·${P0} = ${fm(P)} mmHg; abbassamento ΔP = x_soluto·P° = ${fm(x)}·${P0} = ${fm(dP)} mmHg.`};}},
 {g:"criosc",t:"c2c",f(r){const sp=r.pk([["glucosio",1],["urea",1],["NaCl",2],["CaCl₂",3]]),i=sp[1],m=r.pk(i===3?[0.5,1]:[0.5,1,2]),eb=r.pk([0,1]);const K=eb?0.52:1.86,dT=K*i*m;
  const T=x=>eb?f2(100+x)+" °C":"−"+f2(x)+" °C",a=T(dT);
  return{q:`Si scioglie ${sp[0]} in acqua ottenendo una soluzione ${fm(m)} mol/kg. A quale temperatura ${eb?"bolle":"congela"} la soluzione a 1 atm? (K${eb?"eb":"cr"} = ${f2(K)} °C·kg/mol${i>1?"; dissociazione completa":""})`,a,
   w:U(a,[T(K*m*(i===1?2:1)),T((eb?1.86:0.52)*i*m),eb?f2(100-dT)+" °C":f2(dT)+" °C",T(dT*2),T(K*m*(i+1)),T(dT/2)]),
   s:`ΔT = i·K·m = ${i}·${f2(K)}·${fm(m)} = ${f2(dT)} °C${i>1?` (i = ${i}: ${sp[0]} libera ${i} ioni)`:" (i = 1: non elettrolita)"}. ${eb?`Ebollizione: 100 + ${f2(dT)} = ${f2(100+dT)} °C.`:`Congelamento: 0 − ${f2(dT)} = −${f2(dT)} °C.`}`};}},
 {g:"posm",t:"c2c",f(r){const sp=r.pk([["glucosio",1],["NaCl",2],["KCl",2],["CaCl₂",3]]),M=r.pk([0.1,0.2,0.3,0.4]),i=sp[1],pi=25*i*M;
  return{q:`Qual è la pressione osmotica di una soluzione ${fm(M)} M di ${sp[0]} a 32 °C? (R·T ≈ 25 L·atm/mol${i>1?"; dissociazione completa":""})`,a:fm(pi)+" atm",w:U(fm(pi)+" atm",[fm(25*M)+" atm",fm(25*M*(i+1))+" atm",fm(i*M)+" atm",fm(pi*1000)+" atm",fm(pi/2)+" atm"]),
   s:`π = i·M·R·T = ${i}·${fm(M)}·25 = ${fm(pi)} atm${i>1?` (i = ${i}: ${sp[0]} libera ${i} ioni)`:""}. Conta il numero di particelle, non la loro natura.`};}},
 {g:"ordine",t:"c3a",f(r){const f=r.pk([2,3]),o=r.pk([0,1,2]),R=f**o;const fx=x=>x===1?"non cambia":`diventa ${x} volte maggiore`;
  if(r.pk([0,1]))return{q:`Per la reazione A → prodotti, ${f===2?"raddoppiando":"triplicando"} la concentrazione iniziale di A la velocità iniziale ${fx(R)}. Qual è l'ordine di reazione rispetto ad A?`,a:`ordine ${o}`,w:U(`ordine ${o}`,["ordine 0","ordine 1","ordine 2","ordine 3","ordine ½"]),
   s:`v = k·[A]ⁿ: moltiplicando [A] per ${f} la velocità si moltiplica per ${f}ⁿ = ${R} → n = ${o}.`};
  return{q:`La reazione A → prodotti è di ordine ${o} rispetto ad A. Se la concentrazione di A viene ${f===2?"raddoppiata":"triplicata"}, la velocità:`,a:fx(R),w:U(fx(R),[fx(1),fx(f),fx(f*f),fx(f**3),fx(f+1),"si dimezza"]),
   s:`v = k·[A]^${o} → fattore ${f}^${o} = ${R}: la velocità ${fx(R)}.${o===0?" Ordine zero: la velocità non dipende dalla concentrazione (come un enzima saturato).":""}`};}},
 {g:"tmezzi",t:"c3a",f(r){const t=r.pk([5,10,20,30,40]);
  if(r.pk([0,1])){const n=r.pk([2,3,4]),pc=100/2**n;
   return{q:`Una reazione del primo ordine ha tempo di dimezzamento ${t} min. Dopo quanto tempo resta il ${fm(pc)}% del reagente iniziale?`,a:`${t*n} min`,w:U(`${t*n} min`,[`${t*(n-1)} min`,`${t*(n+1)} min`,`${t*2**n} min`,`${fm(t*(100-pc)/50)} min`,`${fm(t/n)} min`]),
    s:`Nel primo ordine t½ è costante: ${fm(pc)}% = (1/2)^${n}, cioè ${n} tempi di dimezzamento → ${n}·${t} = ${t*n} min.`};}
  const k=0.693/t,ks=(+k.toFixed(6)).toLocaleString("it-IT",{maximumFractionDigits:6});
  return{q:`Una reazione del primo ordine ha costante cinetica k = ${ks} min⁻¹. Qual è il suo tempo di dimezzamento? (ln 2 ≈ 0,693)`,a:`${t} min`,w:U(`${t} min`,[`${fm(1/k)} min`,`${2*t} min`,`${fm(t/2)} min`,`${fm(0.693*k)} min`,`${fm(t*0.693)} min`]),
   s:`Primo ordine: t½ = ln 2 / k = 0,693/${ks} = ${t} min, indipendente dalla concentrazione iniziale.`};}},
 {g:"kpsab2",t:"c3b",f(r){if(r.pk([0,1])){const m=r.pk([1,2]),e=r.pk([-2,-3,-4]);const s=sci(m,e),K=nsci(4*m**3,3*e);
   return{q:`Un sale poco solubile di tipo AB₂ (come CaF₂) ha solubilità s = ${s} mol/L. Quanto vale il Kps?`,a:K,w:U(K,[nsci(m**3,3*e),nsci(m*m,2*e),nsci(4*m*m,2*e),nsci(2*m**3,3*e),nsci(m,e)]),
    s:`AB₂ ⇄ A²⁺ + 2 B⁻: [A²⁺] = s, [B⁻] = 2s → Kps = s·(2s)² = 4s³ = 4·(${s})³ = ${K}.`};}
  const e=r.pk([-2,-4]),K=sci(4,3*e);
  return{q:`Il Kps di un sale poco solubile di tipo AB₂ è ${K}. Qual è la sua solubilità molare?`,a:sci(1,e)+" mol/L",w:U(sci(1,e)+" mol/L",[nsci(2,1.5*e)+" mol/L",sci(4,e)+" mol/L",sci(1,3*e)+" mol/L",sci(1,e-1)+" mol/L",sci(1,e+1)+" mol/L"]),
   s:`Kps = 4s³ → s³ = ${K}/4 = ${sci(1,3*e)} → s = ${sci(1,e)} mol/L. Usare √Kps vale solo per i sali AB.`};}},
 {g:"phdeb",t:"c4a",f(r){const[k,c]=r.pk([[3,1],[4,2],[5,1],[5,3],[6,2],[7,1],[7,3]]),ph=(k+c)/2;
  if(r.pk([0,1]))return{q:`Calcola il pH di una soluzione ${sci(1,-c)} M di un acido debole monoprotico HA con Ka = ${sci(1,-k)}.`,a:fm(ph),w:U(fm(ph),[fm(c),fm(k),fm(k+c),fm((k-c)/2),fm(14-ph),fm(ph+1)]),
   s:`Acido debole: [H⁺] ≈ √(Ka·C) = √(${sci(1,-k)}·${sci(1,-c)}) = ${sci(1,-ph)} M → pH = ½(pKa − log C) = ½(${k} + ${c}) = ${fm(ph)}.`};
  const pOH=ph;return{q:`Calcola il pH di una soluzione ${sci(1,-c)} M di una base debole B con Kb = ${sci(1,-k)} (25 °C).`,a:fm(14-pOH),w:U(fm(14-pOH),[fm(pOH),fm(14-c),fm(c),fm(14-k),fm(15-pOH)]),
   s:`Base debole: [OH⁻] ≈ √(Kb·C) = √(${sci(1,-k)}·${sci(1,-c)}) = ${sci(1,-pOH)} M → pOH = ${fm(pOH)} → pH = 14 − ${fm(pOH)} = ${fm(14-pOH)}.`};}},
 {g:"pkapkb",t:"c4a",f(r){if(r.pk([0,1])){const k=r.pk([3,4,5,6,8,9,10]);
   return{q:`Un acido debole ha Ka = ${sci(1,-k)}. Quanto vale la Kb della sua base coniugata (25 °C)?`,a:sci(1,k-14),w:U(sci(1,k-14),[sci(1,-k),sci(1,14-k),sci(1,-14-k),sci(1,-7),sci(1,k-15)]),
    s:`Ka·Kb = Kw = 10⁻¹⁴ → Kb = 10⁻¹⁴ / ${sci(1,-k)} = ${sci(1,k-14)} (pKb = 14 − ${k} = ${14-k}).`};}
  const c=r.pk([["L'acido acetico",4.76],["L'acido lattico",3.86],["L'acido carbonico (prima dissociazione)",6.35],["Lo ione ammonio NH₄⁺",9.25],["Lo ione diidrogenofosfato H₂PO₄⁻",7.21],["L'acido formico",3.75]]);const pkb=14-c[1];
  return{q:`${c[0]} ha pKa = ${f2(c[1])}. Quanto vale il pKb della sua base coniugata (25 °C)?`,a:f2(pkb),w:U(f2(pkb),[f2(c[1]),f2(14+c[1]),f2(Math.abs(c[1]-7)),f2(7+c[1]/2),f2(pkb+1)]),
   s:`pKa + pKb = pKw = 14 (a 25 °C) → pKb = 14 − ${f2(c[1])} = ${f2(pkb)}. Più l'acido è debole, più forte è la sua base coniugata.`};}},
 {g:"idrolisi",t:"c4a",f(r){const[k,c]=r.pk([[4,2],[5,1],[5,3],[6,2],[3,1]]);
  if(r.pk([0,1])){const pOH=(14-k+c)/2,ph=14-pOH;
   return{q:`Calcola il pH di una soluzione ${sci(1,-c)} M di NaA, sale sodico di un acido debole HA con Ka = ${sci(1,-k)}.`,a:fm(ph),w:U(fm(ph),["7",fm(pOH),fm((k+c)/2),fm(14-c),fm(ph+2)]),
    s:`A⁻ è una base debole: Kb = Kw/Ka = ${sci(1,k-14)}. [OH⁻] ≈ √(Kb·C) = ${sci(1,-pOH)} M → pOH = ${fm(pOH)}, pH = ${fm(ph)}: idrolisi basica.`};}
  const ph=(14-k+c)/2;
  return{q:`Calcola il pH di una soluzione ${sci(1,-c)} M di BHCl, cloruro di una base debole B con Kb = ${sci(1,-k)} (come NH₄Cl).`,a:fm(ph),w:U(fm(ph),["7",fm(14-ph),fm(c),fm((k+c)/2),fm(ph-2)]),
   s:`BH⁺ è un acido debole: Ka = Kw/Kb = ${sci(1,k-14)}. [H⁺] ≈ √(Ka·C) = ${sci(1,-ph)} M → pH = ${fm(ph)}: idrolisi acida.`};}},
 {g:"nernst",t:"c4c",f(r){const c=r.pk([["Ag⁺/Ag",0.80,1,[1,2,3,4]],["Cu²⁺/Cu",0.34,2,[2,4]],["Zn²⁺/Zn",-0.76,2,[2,4]]]);const k=r.pk(c[3]),n=c[2],d=0.059*k/n,E=c[1]-d,V=x=>f3(x)+" V",ion=c[0].split("/")[0];
  return{q:`Semicella ${c[0]} con E° = ${f2(c[1])} V e [${ion}] = ${sci(1,-k)} M (25 °C). Quanto vale il suo potenziale di riduzione?`,a:V(E),w:U(V(E),[V(c[1]+d),V(c[1]-0.059*k),V(c[1]),V(c[1]-2*d),V(c[1]-d/2)]),
   s:`Nernst: E = E° + (0,059/n)·log[${ion}] = ${f2(c[1])} + (0,059/${n})·(−${k}) = ${f2(c[1])} − ${f3(d)} = ${f3(E)} V. Diluendo lo ione ossidato il potenziale di riduzione diminuisce.`};}},
 {g:"dgnfe",t:"c4c",f(r){const[n,E]=r.pk([[1,0.2],[2,0.2],[1,1],[2,1],[4,0.1],[2,0.3],[4,0.5],[1,0.4],[2,0.5]]),G=-96.5*n*E;
  return{q:`In una reazione redox si trasferiscono ${n} mol di elettroni per mole di reazione e ΔE° = +${fm(E)} V. Quanto vale ΔG°? (F ≈ 96 500 C/mol)`,a:fm(G)+" kJ/mol",w:U(fm(G)+" kJ/mol",[fm(-G)+" kJ/mol",fm(G/n)+" kJ/mol",fm(G*1000)+" kJ/mol",fm(-96.5*E/n)+" kJ/mol",fm(G/10)+" kJ/mol",fm(G*2)+" kJ/mol"]),
   s:`ΔG° = −n·F·ΔE° = −${n}·96 500·${fm(E)} = ${fm(G*1000)} J/mol = ${fm(G)} kJ/mol: negativo, quindi la reazione è spontanea.`};}},
 {g:"stereo",t:"c5a",f(r){const[nm,n]=r.pk(STEREO),a=String(2**n);
  return{q:`Quanti stereoisomeri può avere al massimo ${nm}?`,a,w:U(a,[n,2*n,n*n,2**(n-1),2**(n+1),3**n,n+1]),
   s:`${nm.startsWith("una")?"Con":nm.charAt(0).toUpperCase()+nm.slice(1)+" ha"} ${n} centr${n===1?"o":"i"} stereogenic${n===1?"o":"i"} → al massimo 2^${n} = ${2**n} stereoisomeri, cioè ${2**(n-1)} coppi${n===1?"a":"e"} di enantiomeri (meno se esistono forme meso).`};}},
 {g:"insat",t:"c5b",f(r){const[fo,C,H,N,X]=r.pk(INSAT),v=(2*C+2+N-H-X)/2,a=String(v);
  return{q:`Quanti gradi di insaturazione (anelli + legami π) ha ${fo}?`,a,w:U(a,[v+1,v-1,v+2,v+3,2*v,v-2,H/2,v+4].filter(x=>x>=0)),
   s:`GI = (2C + 2 + N − H − X)/2 = (2·${C} + 2${N?" + "+N:""} − ${H}${X?" − "+X:""})/2 = ${v}. Ogni anello o doppio legame vale 1, ogni triplo legame 2.`};}},
 {g:"caricaaa",t:"c7a",f(r){const[nm,gr]=r.pk(AMM);
  if(r.r()<0.6){let pH=7;for(let i=0;i<20;i++){const c=r.pk([1,7,11,13]);if(gr.every(g=>Math.abs(g[1]-c)>=1)){pH=c;break;}}
   let q=0;const det=gr.map(g=>{const ch=g[2]==="a"?(pH>g[1]?-1:0):(pH<g[1]?1:0);q+=ch;return `${g[0]} (pKa ${f2(g[1])}): ${ch?chg(ch):"0"}`;});const a=chg(q);
   const pool=["+3","+2","+1","0","−1","−2","−3"].filter(x=>x!==a).sort((x,y)=>Math.abs(parseInt(x.replace("−","-"))-q)-Math.abs(parseInt(y.replace("−","-"))-q));
   return{q:`${nm} ha questi valori di pKa: ${gr.map(g=>`${f2(g[1])} (${g[0]})`).join("; ")}. Qual è la sua carica netta prevalente a pH ${pH}?`,a,w:pool.slice(0,4),
    s:`A pH ${pH}: un gruppo acido è deprotonato (−1) se pH > pKa, un gruppo basico è protonato (+1) se pH < pKa. ${det.join("; ")}. Carica netta: ${a}.`};}
  const ps=gr.map(g=>g[1]).sort((x,y)=>x-y),nb=gr.filter(g=>g[2]==="b").length,pI=(ps[nb-1]+ps[nb])/2,a=f2(pI);
  const pool=[f2(ps.reduce((s,x)=>s+x,0)/ps.length),ps.length===3?f2((ps[0]+ps[2])/2):null,ps.length===3?f2(nb===1?(ps[1]+ps[2])/2:(ps[0]+ps[1])/2):null,"7",f2(ps[0]),f2(ps[ps.length-1]),f2(pI+1)];
  return{q:`${nm} ha questi valori di pKa: ${gr.map(g=>`${f2(g[1])} (${g[0]})`).join("; ")}. Qual è il suo punto isoelettrico?`,a,w:U(a,pool),
   s:`Il pI è la media dei due pKa che delimitano la forma a carica netta zero: (${f2(ps[nb-1])} + ${f2(ps[nb])})/2 = ${a}.${ps.length===3?(nb===1?" Per gli amminoacidi acidi si usano i due pKa più bassi.":" Per gli amminoacidi basici si usano i due pKa più alti."):""}`};}}
);

/* ============================ BIOLOGIA ============================ */
const ORG=[["Uomo",46],["Cane",78],["Moscerino della frutta",8],["Gatto",38],["Topo",40],["Pisello",14],["Scimpanzé",48]];
const MIT=[["i cromosomi in una cellula in anafase mitotica",N=>2*N,"in anafase i cromatidi fratelli si separano e ciascuno diventa un cromosoma: 2·2n"],["i cromatidi in una cellula in G2",N=>2*N,"dopo la fase S ogni cromosoma è formato da 2 cromatidi: 2·2n"],["i cromosomi in ciascuna cellula figlia al termine della mitosi",N=>N,"la mitosi conserva il numero diploide 2n"],["le molecole di DNA nucleare in una cellula in metafase mitotica",N=>2*N,"ogni cromatidio è una molecola di DNA: 2n cromosomi × 2 cromatidi"],["i cromosomi in una cellula in metafase mitotica",N=>N,"i cromosomi sono ancora 2n, ciascuno con 2 cromatidi uniti al centromero"]];
const MEI=[["i bivalenti (tetradi) in profase I",N=>N/2,"gli omologhi si appaiano a coppie: n bivalenti"],["i cromatidi in una cellula in metafase I",N=>2*N,"2n cromosomi, ciascuno con 2 cromatidi"],["i cromosomi in ciascuna cellula al termine della meiosi I",N=>N/2,"la meiosi I separa gli omologhi: n cromosomi, ancora con 2 cromatidi"],["i cromatidi in ciascuna cellula al termine della meiosi I",N=>N,"n cromosomi × 2 cromatidi"],["i cromatidi in una cellula in metafase II",N=>N,"n cromosomi × 2 cromatidi"],["i cromosomi in una cellula in anafase II",N=>N,"i cromatidi fratelli si separano: 2·n cromosomi nella cellula, n per polo"]];
const fase=(L,t,nome)=>({g:nome,t,f(r){const[o,N]=r.pk(ORG),[c,fn,ex]=r.pk(L),v=fn(N),a=String(v);
  return{q:`${o}: 2n = ${N}. ${/^le /.test(c)?"Quante":"Quanti"} sono ${c}?`,a,w:U(a,[N/2,N,2*N,4*N,3*N/2]),s:`2n = ${N}, n = ${N/2}: ${ex} = ${v}.`};}});
GEN.bio.push(
 {g:"poliibr",t:"b4b",f(r){const n=r.pk([2,3,3]),L=["A","B","C"].slice(0,n),CR_=[["Aa","Aa"],["Aa","aa"],["AA","aa"],["Aa","AA"],["AA","Aa"],["aa","Aa"]];
  let p1="",p2="",num=1;const cs=[],desc=[],ex=[];
  for(const l of L){const c=r.pk(CR_).map(g=>g.replace(/A/g,l).replace(/a/g,l.toLowerCase()));p1+=c[0];p2+=c[1];
   const kids=[];for(const x of c[0])for(const y of c[1])kids.push(x+y);
   const cnt={D:kids.filter(k=>k!==k.toLowerCase()).length,r:kids.filter(k=>k===k.toLowerCase()).length,e:kids.filter(k=>k[0]!==k[1]).length};
   const tg=r.pk(Object.keys(cnt).filter(k=>cnt[k]>0));num*=cnt[tg];cs.push(cnt[tg]);
   desc.push(tg==="D"?`fenotipo dominante per ${l}`:tg==="r"?`fenotipo recessivo per ${l}`:`genotipo eterozigote per ${l}`);ex.push(`${c[0]} × ${c[1]} → ${FR(cnt[tg],4)}`);}
  const den=4**n,a=FR(num,den),sum=cs.reduce((s,x)=>s+x,0);
  const dj=desc.length===2?desc.join(" e "):desc[0]+", "+desc[1]+" e "+desc[2];
  return{q:`Incrocio ${p1} × ${p2} (geni indipendenti, dominanza completa). Probabilità di un figlio con ${dj}?`,a,
   w:U(a,[num*2<=den?FR(num*2,den):null,FR(num,den*2),FR(cs[0],4),sum<=4?FR(sum,4):null,cs[0]<4?FR(num/cs[0]*(4-cs[0]),den):null,...r.sh(["1/4","1/8","1/16","3/16","9/16","1/64","27/64","3/64","9/64","3/32","1/2","3/8"])]),
   s:`Geni indipendenti: si risolve un gene alla volta e si moltiplicano le probabilità. ${ex.join("; ")}. Prodotto: ${a}.`};}},
 {g:"ab0",t:"b4b",f(r){const G=["AA","AO","BB","BO","AB","OO"],sym={A:"Iᴬ",B:"Iᴮ",O:"i"},grp=g=>g.includes("A")&&g.includes("B")?"AB":g.includes("A")?"A":g.includes("B")?"B":"0",dg=g=>g.split("").map(c=>sym[c]).join("");
  const g1=r.pk(G),g2=r.pk(G),cnt={A:0,B:0,AB:0,"0":0};for(const x of g1)for(const y of g2)cnt[grp(x+y)]++;
  const poss=Object.keys(cnt).filter(k=>cnt[k]>0),imp=Object.keys(cnt).filter(k=>!cnt[k]);const tg=(imp.length&&r.r()<0.2)?r.pk(imp):r.pk(poss),a=FR(cnt[tg],4);
  return{q:`Padre ${dg(g1)} (gruppo ${grp(g1)}) e madre ${dg(g2)} (gruppo ${grp(g2)}). Probabilità che un figlio sia di gruppo ${tg}?`,a,w:U(a,["0","1/4","1/2","3/4","1"]),
   s:`Gameti del padre: ${[...new Set(g1)].map(c=>sym[c]).join(" o ")}; della madre: ${[...new Set(g2)].map(c=>sym[c]).join(" o ")}. Iᴬ e Iᴮ sono codominanti, i è recessivo: il gruppo ${tg} compare in ${cnt[tg]} combinazion${cnt[tg]===1?"e":"i"} su 4 → ${a}.`};}},
 {g:"penetr",t:"b4b",f(r){if(r.pk([0,1])){const p=r.pk([60,70,80,90]),x=p/2;
   return{q:`Malattia autosomica dominante con penetranza ${del_(p+"%")}. Un genitore è eterozigote, l'altro è omozigote sano. Probabilità che un figlio manifesti la malattia?`,a:pct(x),w:U(pct(x),[pct(p),"50%",pct(p/4),pct((100-p)/2),pct(x+25)]),
    s:`Probabilità di ereditare l'allele mutato: 1/2. Probabilità che chi lo eredita si ammali: ${p}%. Prodotto: ½·${p}% = ${fm(x)}%.`};}
  const p=r.pk([40,60,80]),x=p/4;
  return{q:`Malattia autosomica recessiva con penetranza ${del_(p+"%")} negli omozigoti. Entrambi i genitori sono portatori sani. Probabilità che un figlio manifesti la malattia?`,a:pct(x),w:U(pct(x),[pct(p),"25%",pct(p/2),pct((100-p)/4),pct(p*3/4)]),
   s:`Probabilità di essere omozigote recessivo: 1/4. Probabilità che l'omozigote manifesti la malattia: ${p}%. Prodotto: ${p}%/4 = ${fm(x)}%.`};}},
 {g:"mappa",t:"b4b",f(r){if(r.pk([0,1])){const rf=r.pk([4,10,12,16,20,24,30]),N=r.pk([200,500,1000]),R=rf*N/100,P=N-R,d=r.pk([0,1,2]),e=r.pk([0,3,5]);const R1=R/2+d,R2=R/2-d,P1=P/2+e,P2=P/2-e;
   return{q:`Reincrocio di un diibrido AB/ab (alleli dominanti in cis) con aabb. Progenie: AaBb ${P1}, aabb ${P2}, Aabb ${R1}, aaBb ${R2}. Qual è la distanza tra i due geni?`,a:rf+" cM",w:U(rf+" cM",[fm(rf/2)+" cM",fm(100-rf)+" cM",R+" cM",2*rf+" cM",fm(R1/N*100)+" cM"]),
    s:`I ricombinanti sono le classi meno numerose (Aabb e aaBb): ${R1} + ${R2} = ${R} su ${N} = ${rf}% di ricombinazione = ${rf} cM (1% di ricombinanti = 1 centiMorgan).`};}
  const D=r.pk([6,10,16,20,30,40]),rec=r.r()<0.5,x=rec?D/2:(100-D)/2,gm=rec?r.pk(["Ab","aB"]):r.pk(["AB","ab"]);
  return{q:`Un individuo AB/ab (A e B in cis) ha i due geni a ${D} cM di distanza. Con quale frequenza produce gameti ${gm}?`,a:pct(x),w:U(pct(x),[pct(rec?(100-D)/2:D/2),pct(D),pct(100-D),"25%","50%"]),
   s:`${D} cM = ${D}% di gameti ricombinanti (Ab + aB), cioè ${fm(D/2)}% ciascuno; i parentali (AB + ab) sono ${art((100-D)+"%")}, cioè ${fm((100-D)/2)}% ciascuno. ${gm} è ${rec?"ricombinante":"parentale"}: ${fm(x)}%.`};}},
 {g:"complem",t:"b3a",f(r){let s="",c="",a="",w=[];for(let i=0;i<40;i++){s=rnd(r,r.pk([6,7,8]));c=cmp(s,CD);a=`5'-${rev(c)}-3'`;
   w=[`5'-${c}-3'`,`5'-${rev(s)}-3'`,`5'-${s}-3'`,`5'-${rev(c).replace(/T/g,"U")}-3'`,`5'-${cmp(s,{A:"G",G:"A",C:"T",T:"C"})}-3'`];if(new Set([a,...w.slice(0,4)]).size===5)break;}
  return{q:`Un filamento di DNA ha sequenza 5'-${s}-3'. Qual è la sequenza del filamento complementare, scritta in direzione 5'→3'?`,a,w,
   s:`Appaiando le basi (A-T, G-C) si ottiene 3'-${c}-5'; poiché i due filamenti sono antiparalleli, letto da 5' a 3' diventa ${a}.`};}},
 {g:"mrna",t:"b3b",f(r){const m=r.pk([0,1,2]);let s="",a="",w=[];
  for(let i=0;i<40;i++){s=(m===0?"TAC":"")+rnd(r,m===0?6:9);const X=[cmp(s,CR),rev(cmp(s,CR)),s.replace(/T/g,"U"),rev(s.replace(/T/g,"U")),cmp(s,CD),rev(cmp(s,CD))].map(x=>`5'-${x}-3'`);
   a=X[m];w=U(a,X);if(w.length>=4&&w.length===new Set(w).size)break;}
  const q=m===2?`Il filamento codificante (non stampo) di un gene ha sequenza 5'-${s}-3'. Quale mRNA viene trascritto, scritto 5'→3'?`:`Il filamento stampo di un gene ha sequenza ${m===0?`3'-${s}-5'`:`5'-${s}-3'`}. Quale mRNA viene trascritto, scritto 5'→3'?`;
  const ex=m===2?`L'mRNA ha la stessa sequenza del filamento codificante, con U al posto di T: ${a}.`:m===0?`L'mRNA è complementare e antiparallelo allo stampo: allo stampo 3'→5' corrisponde un mRNA 5'→3' con le basi complementari (U al posto di T): ${a}.`:`L'mRNA è complementare e antiparallelo allo stampo: si scrive il complementare (con U) e lo si legge al contrario per averlo 5'→3': ${a}.`;
  return{q,a,w,s:ex+" La RNA polimerasi legge lo stampo 3'→5' e sintetizza 5'→3'."};}},
 {g:"anticod",t:"b3d",f(r){let c="GCA",cc,a,w;const mk=()=>{cc=cmp(c,CR);a=`5'-${rev(cc)}-3'`;w=[`5'-${cc}-3'`,`5'-${c}-3'`,`5'-${rev(cc).replace(/U/g,"T")}-3'`,`5'-${cc.replace(/U/g,"T")}-3'`,`5'-${rev(c)}-3'`];return new Set([a,...w.slice(0,4)]).size===5;};
  for(let i=0;i<40;i++){c=rnd(r,3,"ACGU");if(["UAA","UAG","UGA"].includes(c))continue;if(mk())break;c="GCA";}mk();
  return{q:`Un codone dell'mRNA è 5'-${c}-3'. Quale anticodone del tRNA lo riconosce, scritto 5'→3'?`,a,w,
   s:`L'anticodone si appaia al codone in modo complementare e antiparallelo: 3'-${cc}-5', cioè ${a} letto da 5' a 3'. Nell'RNA c'è U, non T.`};}},
 {g:"frameshift",t:"b4a",f(r){if(r.r()<0.6){const k=r.pk([1,2,3,4,5,6,9]),ins=r.pk([0,1]),inf=k%3===0;const fs="slittamento del modulo di lettura: cambiano i codoni a valle della mutazione",
   inF=x=>`${ins?"aggiunta":"perdita"} di ${x} amminoacid${x===1?"o":"i"}, senza alterare il modulo di lettura a valle`;const a=inf?inF(k/3):fs;
   return{q:`Nella regione codificante di un gene avviene ${ins?"un'inserzione":"una delezione"} di ${k} nucleotid${k===1?"e":"i"} (lontano dall'AUG, senza creare codoni di stop). Effetto atteso sulla proteina?`,a,
    w:U(a,[fs,inF(k),"sostituzione di un solo amminoacido (mutazione missenso)","nessun effetto, grazie alla degenerazione del codice","comparsa obbligata di un codone di stop nel punto della mutazione"]),
    s:inf?`${k} nucleotidi = ${k/3} codon${k===3?"e":"i"} interi: il modulo di lettura resta in fase e la proteina ${ins?"acquista":"perde"} ${k/3} amminoacid${k===3?"o":"i"}.`:`${k} non è multiplo di 3: da quel punto la lettura procede sfasata, con amminoacidi diversi e spesso un codone di stop prematuro.`};}
  const N=r.pk([100,150,200,300]),k=r.pk([1,2,3,4]);
  return{q:`La regione codificante di un mRNA (da AUG al codone di stop compreso) è lunga ${3*N+3} nucleotidi. Una delezione in fase elimina ${3*k} nucleotidi interni. Quanti amminoacidi avrà la proteina?`,a:String(N-k),w:U(String(N-k),[N,N-3*k,N+1-k,N-k-1,3*N-3*k]),
   s:`Prima: ${3*N+3} nt = ${N+1} codoni, uno dei quali è lo stop → ${N} amminoacidi. La delezione toglie ${3*k} nt = ${k} codon${k===1?"e":"i"} senza sfasare la lettura: ${N} − ${k} = ${N-k} amminoacidi.`};}},
 fase(MIT,"b7b","fasimit"),
 fase(MEI,"b7c","fasimei"),
 {g:"gameti",t:"b7c",f(r){if(r.r()<0.6){const k=r.pk([3,4,5]);let g="",h=0;for(let i=0;i<20;i++){g="";h=0;for(const l of "ABCDE".slice(0,k)){const t=r.pk([0,1,2]);g+=t===0?l+l:t===1?l+l.toLowerCase():l.toLowerCase()+l.toLowerCase();if(t===1)h++;}if(h>0)break;}
   if(!h){g="Aa"+g.slice(2);h=1;}const a=String(2**h);
   return{q:`Quanti tipi di gameti geneticamente diversi può produrre un individuo ${g} (geni indipendenti)?`,a,w:U(a,[2**k,h,2*h,3**h,4**h,2**(h+1),k]),
    s:`Ogni locus eterozigote dà 2 tipi di alleli nei gameti, ogni locus omozigote uno solo. Loci eterozigoti: ${h} → 2^${h} = ${a} tipi di gameti.`};}
  const[sp,N]=r.pk([["il moscerino della frutta",8],["il pisello",14],["l'uomo",46],["il mais",20],["una specie con 2n = 6",6]]),n=N/2,a=`2${sup_(n)}`;
  return{q:`Considerando solo l'assortimento indipendente degli omologhi (senza crossing-over), quante combinazioni cromosomiche diverse possono avere i gameti prodotti da ${sp}${sp.startsWith("una")?"":` (2n = ${N})`}?`,a,w:U(a,[`2${sup_(N)}`,String(n),String(N),`${n}²`,`4${sup_(n)}`]),
   s:`In metafase I ciascuna delle n = ${n} coppie di omologhi si orienta a caso: 2ⁿ = 2${sup_(n)}${n<=10?` = ${2**n}`:" (circa 8,4 milioni)"} combinazioni. Il crossing-over aumenta ancora la variabilità.`};}},
 {g:"atpres",t:"b5c",f(r){const m=r.pk([0,1,2]);
  if(m===0){const x=r.pk([2,4,6,8,10]),y=r.pk([1,2,4]),A=2.5*x+1.5*y;
   return{q:`Nella catena di trasporto degli elettroni vengono ossidati ${x} NADH e ${y} FADH₂. Quanti ATP si ottengono circa? (2,5 ATP per NADH, 1,5 per FADH₂)`,a:fm(A),w:U(fm(A),[fm(3*x+2*y),fm(2.5*(x+y)),fm(x+y),fm(2.5*x),fm(1.5*x+2.5*y)]),
    s:`ATP ≈ ${x}·2,5 + ${y}·1,5 = ${fm(2.5*x)} + ${fm(1.5*y)} = ${fm(A)}. Il FADH₂ rende meno perché cede gli elettroni al complesso II, saltando il complesso I.`};}
  if(m===1){const n=r.pk([1,2,3,5,10]);
   return{q:`Un globulo rosso (privo di mitocondri) demolisce ${n} molecol${n===1?"a":"e"} di glucosio con la sola glicolisi anaerobica. Quanti ATP netti ottiene?`,a:String(2*n),w:U(String(2*n),[4*n,n,30*n,36*n,2*n+2]),
    s:`La glicolisi produce 4 ATP ma ne consuma 2: bilancio netto 2 ATP per glucosio → ${n}·2 = ${2*n} ATP (il NADH viene riossidato riducendo il piruvato a lattato).`};}
  const n=r.pk([1,2,3,4,6]);
  return{q:`Quanti ATP si ottengono circa dall'ossidazione completa di ${n} acetil-CoA nel ciclo di Krebs e nella catena respiratoria? (2,5 ATP per NADH, 1,5 per FADH₂)`,a:String(10*n),w:U(String(10*n),[12*n,n,3*n,4*n,15*n]),
   s:`Ogni acetil-CoA dà 3 NADH, 1 FADH₂ e 1 GTP: 3·2,5 + 1,5 + 1 = 10 ATP → ${n}·10 = ${10*n} ATP.`};}},
 {g:"xlink2",t:"b4d",f(r){let dom=false,mo=[1,1],fa=0,tg="figlia";
  for(let i=0;i<50;i++){dom=r.r()<0.4;mo=r.pk(dom?[[0,0],[1,0]]:[[0,0],[1,0],[1,1]]);fa=r.pk([0,1]);tg=r.pk(dom?["figlia","figlio","nato"]:["figlia","figlio","nato","portatrice"]);
   if(!mo[0]&&!fa)continue;if(!dom&&mo[0]===1&&mo[1]===0&&!fa&&tg!=="portatrice")continue;break;}
  let dN=0,sN=0,car=0;for(const m of mo){if(dom?(m||fa):(m&&fa))dN++;if(m)sN++;if(!dom&&m+fa===1)car++;}
  const a=tg==="figlia"?FR(dN,2):tg==="figlio"?FR(sN,2):tg==="nato"?FR(dN+sN,4):FR(car,2);
  const md=dom?(mo[0]?"malata (eterozigote)":"sana"):(mo[0]&&mo[1]?"malata":mo[0]?"portatrice sana":"sana non portatrice");
  const td={figlia:"una figlia femmina sia malata",figlio:"un figlio maschio sia malato",nato:"un nuovo nato (sesso non ancora noto) sia malato",portatrice:"una figlia femmina sia portatrice sana"}[tg];
  return{q:`Malattia ${dom?"dominante":"recessiva"} legata all'X. Madre ${md}, padre ${fa?"malato":"sano"}. Probabilità che ${td}?`,a,w:U(a,["0","1/4","1/2","3/4","1"]),
   s:`I maschi ricevono l'X dalla madre e l'Y dal padre; le femmine un X da ciascun genitore. Figlie: X paterno ${fa?"mutato":"normale"} + X materno ${mo[0]===mo[1]?(mo[0]?"mutato":"normale"):"mutato o normale (½ e ½)"} → malate ${FR(dN,2)}${dom?"":`, portatrici ${FR(car,2)}`}. Figli maschi: malati ${FR(sN,2)}. Risposta: ${a}.`};}}
);
})();
