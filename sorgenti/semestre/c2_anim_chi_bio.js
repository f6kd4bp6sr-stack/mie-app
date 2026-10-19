/* ================= ANIMAZIONI DI CHIMICA E BIOLOGIA =================
   Stesso motore di Fisica (mountAnim): ogni voce ha h (altezza), c (controlli), init, f(g,p,st,dt,W,H) che disegna e restituisce il testo sotto. */
const SUP=n=>String(n).split("").map(d=>"⁰¹²³⁴⁵⁶⁷⁸⁹"[+d]).join("");
const ELEM=["","H idrogeno","He elio","Li litio","Be berillio","B boro","C carbonio","N azoto","O ossigeno","F fluoro","Ne neon","Na sodio","Mg magnesio","Al alluminio","Si silicio","P fosforo","S zolfo","Cl cloro","Ar argon","K potassio","Ca calcio"];
function chromatid(g,x,y,L,w,col,tip){rr(g,x-w/2,y-L/2,w,L,w/2,col);if(tip){g.save();g.beginPath();g.rect(x-w/2-1,y+L*.15,w+2,L*.4);g.clip();rr(g,x-w/2,y-L/2,w,L,w/2,tip);g.restore();}}
function chromX(g,x,y,L,w,c1,c2,t1,t2){chromatid(g,x-w/2-.5,y,L,w,c1,t1);chromatid(g,x+w/2+.5,y,L,w,c2||c1,t2);circ(g,x,y,w*.55,C.ink);}
const lerp=(a,b,u)=>a+(b-a)*Math.max(0,Math.min(1,u));
Object.assign(AN,{
/* ---------- CHIMICA ---------- */
orbitali:{h:300,c:[{k:"Z",l:"Numero atomico Z",min:1,max:20,st:1,v:8}],
 f(g,p,st,dt,W,H){const subs=[["1s",1],["2s",1],["2p",3],["3s",1],["3p",3],["4s",1]];let rem=p.Z,un=0,cfg=[];const bw=Math.min(34,W/16),bh=26;
  subs.forEach(([nm,k],i)=>{const n=Math.min(rem,2*k);rem-=n;const y=H-30-i*44,x0=W*.18;txt(g,nm,x0-14,y+bh/2,C.muted,14,"right",true);
   for(let j=0;j<k;j++){const x=x0+j*(bw+6);rr(g,x,y,bw,bh,4,null,C.line);const up=j<n,dn=j+k<n;if(up)arrow(g,x+bw*.33,y+bh-4,x+bw*.33,y+5,C.acc,2);if(dn)arrow(g,x+bw*.67,y+5,x+bw*.67,y+bh-4,C.warn,2);if(up&&!dn)un++;}
   if(n)cfg.push(nm+SUP(n));});
  txt(g,"energia ↑",W*.06,24,C.muted,12,"left");const el=ELEM[p.Z]||"";txt(g,el.split(" ")[0],W*.78,H*.38,C.acc,46,"center",true);txt(g,el.split(" ")[1]||"",W*.78,H*.38+36,C.muted,15,"center");txt(g,"Z = "+p.Z,W*.78,H*.38-40,C.muted,13,"center");
  return `Configurazione: <b>${cfg.join(" ")}</b> · elettroni spaiati: <b>${un}</b>. Ogni casella è un orbitale: al massimo 2 elettroni con spin opposti (Pauli); negli orbitali p prima uno per casella (Hund). Nota: il 4s si riempie prima del 3d.`;}},
gibbs:{h:300,c:[{k:"dH",l:"ΔH",min:-200,max:200,st:10,v:-100,u:" kJ"},{k:"dS",l:"ΔS",min:-.5,max:.5,st:.05,v:-.2,u:" kJ/K"},{k:"T",l:"Temperatura",min:100,max:1000,st:10,v:300,u:" K"}],
 f(g,p,st,dt,W,H){const G=T=>p.dH-T*p.dS,m=Math.max(50,Math.abs(G(0)),Math.abs(G(1000)))*1.1,x0=50,y0=20,w=W-80,h=H-50,X=T=>x0+T/1000*w,Y=v=>y0+h/2-v/m*h/2;
  rr(g,x0,y0+h/2,w,h/2,0,A_(C.ok,.08));txt(g,"ΔG < 0: spontanea",x0+6,y0+h-10,C.ok,12);txt(g,"ΔG > 0: non spontanea",x0+6,y0+10,C.warn,12);
  axes(g,x0,y0,w,h,"T (K)","ΔG (kJ)");line(g,x0,Y(0),x0+w,Y(0),C.muted,1,[4,4]);
  g.strokeStyle=C.acc;g.lineWidth=3;g.beginPath();g.moveTo(X(0),Y(G(0)));g.lineTo(X(1000),Y(G(1000)));g.stroke();
  const v=G(p.T);circ(g,X(p.T),Y(v),7,v<0?C.ok:C.warn,C.card);for(let T=0;T<=1000;T+=250)txt(g,T,X(T),y0+h+12,C.muted,11,"center");
  const Tc=p.dS!==0?p.dH/p.dS:null;if(Tc>0&&Tc<1000){line(g,X(Tc),y0,X(Tc),y0+h,C.soon,1.5,[3,3]);txt(g,"T = ΔH/ΔS = "+F2(Tc,0)+" K",X(Tc)+4,y0+24,C.soon,12);}
  return `ΔG = ΔH − TΔS = ${F2(p.dH,0)} − ${p.T}·(${F2(p.dS,2)}) = <b>${F2(v,1)} kJ</b> → ${v<0?"<b>spontanea</b> (esoergonica)":v>0?"<b>non spontanea</b> (endoergonica)":"equilibrio"}. ${Tc>0?`Cambia comportamento a ${F2(Tc,0)} K.`:p.dH<0&&p.dS>0?"Con ΔH < 0 e ΔS > 0 è spontanea a ogni temperatura.":p.dH>0&&p.dS<0?"Con ΔH > 0 e ΔS < 0 non è mai spontanea.":""}`;}},
dalton:{h:300,c:[{k:"h",l:"Altitudine",min:0,max:8800,st:100,v:0,u:" m"}],
 f(g,p,st,dt,W,H){const P=760*Math.exp(-p.h/8000),parts=[["N₂",.78,C.muted],["O₂",.21,C.acc],["Ar e altri",.0096,C.soon],["CO₂",.0004,C.warn]];
  const x0=60,bw=Math.min(90,W/8),base=H-40,sc=(H-80)/760;
  axes(g,x0-20,30,W-90,base-30,"","mmHg");[0,200,400,600,760].forEach(v=>{txt(g,v,x0-26,base-v*sc,C.muted,11,"right");line(g,x0-20,base-v*sc,W-30,base-v*sc,C.line,1,[2,4]);});
  let y=base;parts.forEach(([n,f,c])=>{const hh=P*f*sc;rr(g,x0,y-hh,bw,hh,0,c);y-=hh;});txt(g,"aria totale",x0+bw/2,base+14,C.muted,12,"center");txt(g,F2(P,0),x0+bw/2,y-12,C.ink,14,"center",true);
  const x2=x0+bw+70;parts.slice(0,2).forEach(([n,f,c],i)=>{const v=P*f,xx=x2+i*(bw+40);rr(g,xx,base-v*sc,bw,v*sc,4,c);txt(g,"p"+n,xx+bw/2,base+14,C.muted,12,"center");txt(g,F2(v,0),xx+bw/2,base-v*sc-12,C.ink,14,"center",true);});
  const pO2=P*.21;return `A ${F2(p.h,0)} m la pressione totale è circa <b>${F2(P,0)} mmHg</b>; l'ossigeno è sempre il 21%, ma la sua pressione parziale scende a <b>${F2(pO2,0)} mmHg</b> (al mare circa 160). Legge di Dalton: pᵢ = xᵢ · p_tot.${p.h>=2500?" Sopra i 2500 m compaiono i sintomi del mal di montagna.":""}`;}},
osmosi:{h:320,c:[{k:"o",l:"Osmolarità della soluzione esterna",min:50,max:600,st:10,v:290,u:" mOsm/L"}],ri:0,
 init(st){st.r=1;st.pts=Array.from({length:70},()=>({x:Math.random(),y:Math.random()}));},
 f(g,p,st,dt,W,H){const cx=W*.42,cy=H/2,R0=Math.min(H*.28,W*.18),tgt=Math.max(.55,Math.min(1.5,Math.sqrt(290/p.o)));const burst=p.o<130;
  st.r+=((burst?1.55:tgt)-st.r)*Math.min(1,dt*1.5);const R=R0*st.r;
  rr(g,10,10,W*.84-10,H-20,12,A_(C.acc,.06),C.line);const ns=Math.round(p.o/12);
  for(let i=0;i<ns;i++){const q=st.pts[i%70];const x=20+q.x*(W*.84-40),y=20+q.y*(H-40);if(Math.hypot(x-cx,y-cy)>R+6)circ(g,x,y,3,C.soon);}
  if(burst&&st.r>1.45){for(let i=0;i<10;i++){const a=i*.63;g.strokeStyle=C.warn;g.lineWidth=4;g.beginPath();g.arc(cx,cy,R,a,a+.35);g.stroke();}txt(g,"EMOLISI",cx,cy,C.warn,18,"center",true);}
  else{circ(g,cx,cy,R,A_(C.warn,.35),C.warn,3);for(let i=0;i<24;i++){const a=i*2.4,rr2=R*.6*((i*37%10)/10);circ(g,cx+Math.cos(a)*rr2,cy+Math.sin(a)*rr2,3,C.soon);}}
  const dir=Math.sign(tgt-st.r);if(Math.abs(tgt-st.r)>.02&&!burst){for(let i=0;i<6;i++){const a=i*Math.PI/3+st.t*.5,r1=R+30,r2=R+8;dir>0?arrow(g,cx+Math.cos(a)*r1,cy+Math.sin(a)*r1,cx+Math.cos(a)*r2,cy+Math.sin(a)*r2,C.acc,2):arrow(g,cx+Math.cos(a)*r2,cy+Math.sin(a)*r2,cx+Math.cos(a)*r1,cy+Math.sin(a)*r1,C.acc,2);}}
  txt(g,"● soluto",W*.86,30,C.soon,12);txt(g,"→ acqua",W*.86,50,C.acc,12);txt(g,"globulo rosso",cx,cy+R+16,C.muted,12,"center");
  const tipo=p.o<270?"<b>ipotonica</b>: l'acqua entra e la cellula si gonfia":p.o>310?"<b>ipertonica</b>: l'acqua esce e la cellula raggrinzisce":"<b>isotonica</b>: nessun flusso netto, volume invariato";
  return `Esterno ${p.o} mOsm/L, citoplasma circa 290: soluzione ${tipo}${burst?" fino alla rottura (emolisi)":""}. L'acqua va sempre verso la soluzione più concentrata. Fisiologica 0,9% NaCl ≈ 308 mOsm/L, glucosata 5% ≈ 278: isotoniche.`;}},
cinetica:{h:300,c:[{k:"Ea",l:"Energia di attivazione",min:20,max:120,st:5,v:60,u:" kJ/mol"},{k:"dH",l:"ΔH di reazione",min:-60,max:60,st:5,v:-30,u:" kJ/mol"},{k:"T",l:"Temperatura",min:270,max:400,st:5,v:310,u:" K"},{k:"cat",l:"Catalizzatore",seg:["No","Sì (enzima)"],v:0}],
 f(g,p,st,dt,W,H){const EaU=Math.max(p.Ea,p.dH+10),Ea=p.cat?Math.max(EaU*.5,p.dH+5):EaU,top=Math.max(p.Ea,p.dH)+20,bot=Math.min(0,p.dH)-15,x0=50,y0=20,w=W*.62,h=H-50,Y=E=>y0+h-(E-bot)/(top-bot)*h;
  axes(g,x0,y0,w,h,"avanzamento della reazione","energia");
  const curve=(peak,col,lw,dash)=>{g.strokeStyle=col;g.lineWidth=lw;g.setLineDash(dash||[]);g.beginPath();for(let i=0;i<=100;i++){const u=i/100;const E=u<.2?0:u>.8?p.dH:lerp(0,p.dH,(u-.2)/.6)+(peak-lerp(0,p.dH,.5))*Math.sin(Math.PI*(u-.2)/.6);const X=x0+u*w;i?g.lineTo(X,Y(E)):g.moveTo(X,Y(E));}g.stroke();g.setLineDash([]);};
  if(p.cat)curve(EaU,C.muted,2,[5,4]);curve(Ea,p.cat?C.ok:C.acc,3);
  arrow(g,x0+w*.5,Y(0),x0+w*.5,Y(Ea)+4,C.warn,2,"");txt(g,"Ea = "+Ea+" kJ",x0+w*.5+8,Y(Ea/2),C.warn,12);txt(g,"reagenti",x0+8,Y(0)-10,C.muted,12);txt(g,"prodotti",x0+w-60,Y(p.dH)-10,C.muted,12);
  txt(g,"ΔH = "+p.dH,x0+w-60,Y(p.dH)+12,p.dH<0?C.ok:C.warn,12);
  const R=8.314e-3,kT=Math.exp(-Ea/(R*p.T)),k298=Math.exp(-Ea/(R*298)),rT=kT/k298,rc=p.cat?Math.exp((EaU-Ea)/(R*p.T)):1;
  const bx=x0+w+30;txt(g,"velocità relativa",bx,30,C.muted,12);const bar=(lab,v,y,col)=>{const L=Math.min(1,Math.log10(1+v)/8)*(W-bx-20);rr(g,bx,y,Math.max(3,L),18,4,col);txt(g,lab,bx,y-9,C.muted,11);};
  bar("rispetto a 298 K: ×"+F2(rT,2),rT,60,C.acc);if(p.cat)bar("con catalizzatore: ×"+(rc>1e6?rc.toExponential(1):F2(rc,0)),rc,110,C.ok);
  return `Arrhenius: k ∝ e^(−Ea/RT). A ${p.T} K la reazione è <b>${F2(rT,2)} volte</b> più veloce che a 298 K.${p.cat?` Il catalizzatore abbassa Ea (${EaU} → ${F2(Ea,0)} kJ/mol) e la accelera di circa <b>${rc>1e6?rc.toExponential(1):F2(rc,0)} volte</b>, ma ΔH (e ΔG) restano uguali.`:" Prova ad aggiungere il catalizzatore."}`;}},
equilibrio:{h:320,c:[{k:"kf",l:"Costante diretta k₁ (A → B)",min:.1,max:2,st:.1,v:1},{k:"kr",l:"Costante inversa k₂ (B → A)",min:.1,max:2,st:.1,v:.5},{k:"pert",l:"Perturbazione a metà tempo",seg:["Nessuna","Aggiungo A","Tolgo B"],v:0}],ri:1,
 init(st){st.A=1;st.B=0;st.tt=0;st.hist=[];st.done=false;},
 f(g,p,st,dt,W,H){const tm=10/(p.kf+p.kr)+6;const n=Math.ceil(dt/.02)||0;for(let i=0;i<n&&st.tt<tm;i++){const h=dt/n;const d=(p.kf*st.A-p.kr*st.B)*h;st.A-=d;st.B+=d;st.tt+=h;if(!st.done&&st.tt>tm/2){st.done=true;if(p.pert==1)st.A+=.6;if(p.pert==2)st.B*=.3;}st.hist.push([st.tt,st.A,st.B]);}
  if(st.tt>=tm+2)this.init(st,p);else if(st.tt>=tm)st.tt+=dt;
  const gx=W*.42,gy=20,gw=W*.54,gh=H-56,mx=1.7,X=t=>gx+t/tm*gw,Y=c=>gy+gh-c/mx*gh;axes(g,gx,gy,gw,gh,"tempo","concentrazione");
  [[1,C.warn,"[A]"],[2,C.acc,"[B]"]].forEach(([k,c,l])=>{g.strokeStyle=c;g.lineWidth=2.5;g.beginPath();st.hist.forEach((h,i)=>i?g.lineTo(X(Math.min(h[0],tm)),Y(h[k])):g.moveTo(X(h[0]),Y(h[k])));g.stroke();const L=st.hist[st.hist.length-1];if(L)txt(g,l,X(Math.min(L[0],tm))+6,Y(L[k]),c,12,"left",true);});
  if(p.pert)line(g,X(tm/2),gy,X(tm/2),gy+gh,C.soon,1.5,[3,3]);
  const nA=Math.round(st.A/ (st.A+st.B||1)*100),cs=Math.min((W*.36)/10,(H-30)/10);for(let i=0;i<100;i++){circ(g,14+(i%10)*cs+cs/2,14+Math.floor(i/10)*cs+cs/2,cs*.36,i<nA?C.warn:C.acc);}
  const Q=st.B/st.A,K=p.kf/p.kr;return `K = k₁/k₂ = <b>${F2(K,2)}</b> · Q = [B]/[A] = <b>${F2(Q,2)}</b>. ${Math.abs(Q-K)<.05*K?"All'<b>equilibrio</b> le due reazioni hanno la stessa velocità: le concentrazioni non cambiano più.":Q<K?"Q < K: la reazione va verso B.":"Q > K: la reazione torna verso A."}${p.pert?" Dopo la perturbazione il sistema si sposta e ritrova lo stesso K (Le Châtelier).":""}`;}},
ph:{h:250,c:[{k:"tipo",l:"Sostanza",seg:["Acido forte","Acido debole (Ka 10⁻⁵)","Base forte","Base debole (Kb 10⁻⁵)"],v:0},{k:"lc",l:"Concentrazione 10^x M: x =",min:-6,max:0,st:.1,v:-2}],
 f(g,p,st,dt,W,H){const Cc=Math.pow(10,p.lc),Kw=1e-14,K=1e-5;let x;if(p.tipo==0||p.tipo==2)x=(Cc+Math.sqrt(Cc*Cc+4*Kw))/2;else{const h=(-K+Math.sqrt(K*K+4*K*Cc))/2;x=(h+Math.sqrt(h*h+4*Kw))/2;}
  let pH=-Math.log10(x);if(p.tipo>=2)pH=14-pH;const x0=30,w=W-60,y=H*.45,X=v=>x0+v/14*w;
  for(let i=0;i<140;i++){const v=i/10,hue=v<7?(v/7)*120:120+(v-7)/7*120;g.fillStyle=`hsl(${hue},70%,${C.dark?40:55}%)`;g.fillRect(X(v),y-18,w/140+1,36);}
  for(let v=0;v<=14;v++)txt(g,v,X(v),y+30,C.muted,11,"center");
  [[1.5,"succo gastrico"],[6,"urine"],[7.4,"sangue"],[8.2,"succo pancreatico"]].forEach(([v,l],i)=>{line(g,X(v),y-18,X(v),y-34-(i%2)*16,C.muted,1);txt(g,l,X(v),y-40-(i%2)*16,C.muted,11,"center");});
  arrow(g,X(pH),y+62,X(pH),y+22,C.ink,3);txt(g,"pH "+F2(pH,2),X(pH),y+74,C.ink,15,"center",true);
  const nm=["acido forte (tutto dissociato: [H₃O⁺] = C)","acido debole: [H₃O⁺] ≈ √(Ka·C)","base forte: [OH⁻] = C, pH = 14 − pOH","base debole: [OH⁻] ≈ √(Kb·C)"][p.tipo];
  return `Concentrazione ${F2(Cc,6)} M di ${nm} → <b>pH ${F2(pH,2)}</b>. Diluendo 10 volte un acido forte il pH sale di 1; ma non supera mai 7: a concentrazioni bassissime conta anche l'acqua.`;}},
tampone:{h:310,c:[{k:"pKa",l:"pKa dell'acido debole",min:3,max:10,st:.05,v:4.75},{k:"b",l:"Base forte aggiunta (% dell'equivalenza)",min:0,max:200,st:1,v:50,u:"%"}],
 f(g,p,st,dt,W,H){const C0=.1,Ka=Math.pow(10,-p.pKa),pHof=b=>{const x=b/100,Ca=C0/(1+x),Na=C0*x/(1+x);let lo=-14,hi=0;
   for(let it=0;it<60;it++){const m=(lo+hi)/2,H=Math.pow(10,m),f=Na+H-Ca*Ka/(Ka+H)-1e-14/H;if(f>0)hi=m;else lo=m;}return -(lo+hi)/2;};
  const x0=50,y0=20,w=W-80,h=H-50,X=b=>x0+b/200*w,Y=v=>y0+h-v/14*h;axes(g,x0,y0,w,h,"base aggiunta (%)","pH");
  rr(g,x0,Y(p.pKa+1),w,Y(p.pKa-1)-Y(p.pKa+1),0,A_(C.ok,.12));txt(g,"zona tampone: pKa ± 1",x0+6,Y(p.pKa+1)+10,C.ok,12);
  for(let v=0;v<=14;v+=2)txt(g,v,x0-8,Y(v),C.muted,11,"right");[0,50,100,150].forEach(b=>txt(g,b,X(b),y0+h+12,C.muted,11,"center"));
  g.strokeStyle=C.acc;g.lineWidth=3;g.beginPath();for(let b=0;b<=200;b+=1){const v=pHof(b);b?g.lineTo(X(b),Y(v)):g.moveTo(X(b),Y(v));}g.stroke();
  line(g,X(50),Y(p.pKa),X(50),y0+h,C.soon,1.5,[3,3]);txt(g,"pH = pKa",X(50)+4,Y(p.pKa)+14,C.soon,12);
  const v=pHof(p.b);circ(g,X(p.b),Y(v),7,C.warn,C.card);
  const r=p.b>0&&p.b<100?p.b/(100-p.b):null;
  return `pH = <b>${F2(v,2)}</b>. ${r!=null?`[A⁻]/[HA] = ${F2(r,2)} → Henderson-Hasselbalch: pH = ${F2(p.pKa,2)} + log ${F2(r,2)}. `:""}${p.b==50?"A metà neutralizzazione pH = pKa: il tampone è al massimo dell'efficacia. ":""}${p.b>=95&&p.b<=105?"All'equivalenza resta solo la base coniugata: pH basico. ":""}Nella zona verde il pH cambia poco anche aggiungendo base.`;}},
pila:{h:300,c:[{k:"cp",l:"Coppia di elettrodi",seg:["Zn | Cu","Fe | Cu","Zn | Ag","Cu | Ag"],v:0}],
 f(g,p,st,dt,W,H){const E0={Zn:-.76,Fe:-.44,Cu:.34,Ag:.8},pr=[["Zn","Cu"],["Fe","Cu"],["Zn","Ag"],["Cu","Ag"]][p.cp],a=pr[0],c=pr[1],E=E0[c]-E0[a],dG=-2*96485*E/1000;
  const bw=W*.26,by=H*.42,bh=H*.45,lx=W*.12,rx=W*.62;[lx,rx].forEach((x,i)=>{rr(g,x,by,bw,bh,8,A_(i?C.acc:C.soon,.15),C.line);rr(g,x+bw*.4,by-30,bw*.2,bh*.8,3,C.muted);txt(g,i?c+" (catodo, +)":a+" (anodo, −)",x+bw/2,by+bh+14,i?C.acc:C.soon,13,"center",true);txt(g,i?c+"ⁿ⁺ + ne⁻ → "+c:a+" → "+a+"ⁿ⁺ + ne⁻",x+bw/2,by+bh-14,C.ink,12,"center");});
  const ya=by-30,x1=lx+bw/2,x2=rx+bw/2,ym=24;line(g,x1,ya,x1,ym,C.ink,2);line(g,x1,ym,x2,ym,C.ink,2);line(g,x2,ym,x2,ya,C.ink,2);
  rr(g,(x1+x2)/2-34,ym-14,68,28,6,C.card,C.ink);txt(g,F2(E,2)+" V",(x1+x2)/2,ym,C.ink,14,"center",true);
  g.strokeStyle=C.muted;g.lineWidth=10;g.beginPath();g.moveTo(lx+bw*.85,by+14);g.quadraticCurveTo((x1+x2)/2,by-40,rx+bw*.15,by+14);g.stroke();txt(g,"ponte salino",(x1+x2)/2,by+16,C.muted,11,"center");
  const L=(x2-x1)+2*(ya-ym);for(let i=0;i<8;i++){let s=((st.t*60+i*L/8)%L);let x,y;if(s<ya-ym){x=x1;y=ya-s;}else if(s<ya-ym+(x2-x1)){x=x1+s-(ya-ym);y=ym;}else{x=x2;y=ym+(s-(ya-ym)-(x2-x1));}circ(g,x,y,4,C.warn);}
  txt(g,"e⁻ →",x1+24,ym-12,C.warn,12,"left",true);
  return `${a} si ossida (anodo, polo −), ${c} si riduce (catodo, polo +). E°cella = E°catodo − E°anodo = ${F2(E0[c],2)} − (${F2(E0[a],2)}) = <b>${F2(E,2)} V</b>; ΔG = −nFE ≈ <b>${F2(dG,0)} kJ/mol</b> (n = 2): reazione spontanea. Gli elettroni vanno nel filo dall'anodo al catodo.`;}},
amminoacido:{h:300,c:[{k:"aa",l:"Amminoacido",seg:["Alanina","Acido aspartico","Lisina"],v:0},{k:"pH",l:"pH",min:0,max:14,st:.1,v:7}],
 f(g,p,st,dt,W,H){const D=[{n:"Alanina",gr:[["a",2.3],["b",9.7]],pI:6.0},{n:"Acido aspartico",gr:[["a",2.0],["a",3.9],["b",9.9]],pI:2.95},{n:"Lisina",gr:[["a",2.2],["b",9.0],["b",10.5]],pI:9.75}][p.aa];
  const q=pH=>D.gr.reduce((s,[t,k])=>s+(t==="b"?1/(1+Math.pow(10,pH-k)):-1/(1+Math.pow(10,k-pH))),0);
  const x0=50,y0=20,w=W-80,h=H-60,X=v=>x0+v/14*w,Y=c=>y0+h/2-c/2.2*h/2;axes(g,x0,y0,w,h,"pH","carica netta");line(g,x0,Y(0),x0+w,Y(0),C.muted,1,[4,4]);
  [-2,-1,1,2].forEach(c=>txt(g,(c>0?"+":"")+c,x0-8,Y(c),C.muted,11,"right"));for(let v=0;v<=14;v+=2)txt(g,v,X(v),y0+h+12,C.muted,11,"center");
  g.strokeStyle=C.acc;g.lineWidth=3;g.beginPath();for(let v=0;v<=14;v+=.1){v?g.lineTo(X(v),Y(q(v))):g.moveTo(X(v),Y(q(v)));}g.stroke();
  line(g,X(D.pI),y0,X(D.pI),y0+h,C.soon,1.5,[3,3]);txt(g,"pI "+F2(D.pI,2),X(D.pI)+4,y0+10,C.soon,12);const c=q(p.pH);circ(g,X(p.pH),Y(c),7,C.warn,C.card);
  return `${D.n} a pH ${F2(p.pH,1)}: carica netta <b>${c>0?"+":""}${F2(c,2)}</b>. Al punto isoelettrico (pI ${F2(D.pI,2)}) la carica netta è zero e l'amminoacido non migra in un campo elettrico. Sotto il pI è positivo, sopra è negativo (elettroforesi). Al pH del sangue (7,4) ${D.n.toLowerCase()} ha carica circa ${F2(q(7.4),1)}.`;}},
/* ---------- BIOLOGIA ---------- */
membrana:{h:320,c:[{k:"tipo",l:"Tipo di trasporto",seg:["Diffusione semplice (O₂)","Canale (K⁺)","Pompa Na⁺/K⁺ (ATP)"],v:0}],
 init(st,p){const ty=p?p.tipo:0;st.P=[];st.cyc=0;st.pumped=0;
  if(ty==0)for(let i=0;i<60;i++)st.P.push({x:Math.random(),y:Math.random()*.42,k:0});
  if(ty==1)for(let i=0;i<50;i++)st.P.push({x:Math.random(),y:.58+Math.random()*.42,k:1});
  if(ty==2){for(let i=0;i<24;i++)st.P.push({x:Math.random(),y:.58+Math.random()*.42,k:2});for(let i=0;i<24;i++)st.P.push({x:Math.random(),y:Math.random()*.42,k:1});}},
 f(g,p,st,dt,W,H){const my=.5,mt=.06;const Yp=y=>10+y*(H-20),Xp=x=>10+x*(W-20);
  rr(g,0,Yp(my-mt),W,Yp(my+mt)-Yp(my-mt),0,A_(C.soon,.35));for(let x=8;x<W;x+=14){circ(g,x,Yp(my-mt)+4,4,C.soon);circ(g,x,Yp(my+mt)-4,4,C.soon);}
  txt(g,"esterno",12,22,C.muted,12);txt(g,"citoplasma",12,H-14,C.muted,12);
  const chx=.35,pmx=.65,cw=.04;if(p.tipo==1){rr(g,Xp(chx-cw),Yp(my-mt)-4,Xp(chx+cw)-Xp(chx-cw),Yp(my+mt)-Yp(my-mt)+8,6,C.ok);}
  if(p.tipo==2){rr(g,Xp(pmx-.06),Yp(my-mt)-10,Xp(pmx+.06)-Xp(pmx-.06),Yp(my+mt)-Yp(my-mt)+20,10,C.fam);txt(g,"pompa: ATP → ADP",Xp(pmx),Yp(my-mt)-22,C.fam,12,"center",true);}
  st.P.forEach(q=>{if(p.tipo==2&&q.move)return;const sp=.7*dt;q.x+=(Math.random()-.5)*sp;q.y+=(Math.random()-.5)*sp;q.x=Math.max(0,Math.min(1,q.x));q.y=Math.max(0,Math.min(1,q.y));
   const inM=q.y>my-mt&&q.y<my+mt;if(inM){const ok=p.tipo==0||(p.tipo==1&&Math.abs(q.x-chx)<cw);if(!ok)q.y=q.y<my?my-mt-.001:my+mt+.001;}});
  if(p.tipo==2){st.cyc+=dt;if(st.cyc>1.6){st.cyc=0;const na=st.P.filter(q=>q.k==2&&q.y>my+mt).slice(0,3),k=st.P.filter(q=>q.k==1&&q.y<my-mt).slice(0,2);if(na.length==3){na.forEach(q=>{q.y=my-mt-.05;q.x=pmx+(Math.random()-.5)*.08;});k.forEach(q=>{q.y=my+mt+.05;q.x=pmx+(Math.random()-.5)*.08;});st.pumped++;}}}
  st.P.forEach(q=>{const col=q.k==0?C.acc:q.k==1?C.ok:C.warn;circ(g,Xp(q.x),Yp(q.y),5,col);});
  const up=k=>st.P.filter(q=>q.k==k&&q.y<my).length,dn=k=>st.P.filter(q=>q.k==k&&q.y>my).length;
  if(p.tipo==0)return `O₂ (blu) attraversa direttamente il doppio strato lipidico, dalla zona più concentrata a quella meno: <b>${up(0)}</b> fuori, <b>${dn(0)}</b> dentro. Nessuna energia: diffusione semplice, fino a concentrazioni uguali.`;
  if(p.tipo==1)return `K⁺ (verde) non passa tra i lipidi: esce solo attraverso il canale, secondo gradiente: <b>${dn(1)}</b> dentro, <b>${up(1)}</b> fuori. È la diffusione facilitata che crea il potenziale di riposo (interno negativo).`;
  return `Pompa Na⁺/K⁺: a ogni ciclo, con 1 ATP, porta <b>3 Na⁺ fuori</b> (rossi) e <b>2 K⁺ dentro</b> (verdi), contro gradiente. Cicli fatti: <b>${st.pumped}</b>. Na⁺ fuori ${up(2)}, dentro ${dn(2)} · K⁺ dentro ${dn(1)}, fuori ${up(1)}.`;}},
mendel:{h:300,c:[{k:"p1",l:"Genitore 1",seg:["AA","Aa","aa"],v:1},{k:"p2",l:"Genitore 2",seg:["AA","Aa","aa"],v:1},{k:"dom",l:"Tipo di dominanza",seg:["Completa","Incompleta"],v:0}],
 init(st){st.kids=[];st.acc=0;},
 f(g,p,st,dt,W,H){const G=["AA","Aa","aa"],g1=G[p.p1].split(""),g2=G[p.p2].split(""),cell=Math.min(70,(H-80)/2),x0=60,y0=50;
  const ph=gt=>{const n=(gt.match(/A/g)||[]).length;return p.dom?(n==2?C.warn:n==1?C.lp:C.card):(n>0?C.warn:C.card);};
  g2.forEach((a,j)=>txt(g,a,x0+cell*j+cell/2,y0-14,C.acc,16,"center",true));g1.forEach((a,i)=>txt(g,a,x0-16,y0+cell*i+cell/2,C.fam,16,"center",true));
  const res={};g1.forEach((a,i)=>g2.forEach((b,j)=>{const gt=[a,b].sort().join("");res[gt]=(res[gt]||0)+1;rr(g,x0+cell*j+2,y0+cell*i+2,cell-4,cell-4,8,ph(gt),C.line);txt(g,gt,x0+cell*j+cell/2,y0+cell*i+cell/2,C.ink,16,"center",true);}));
  txt(g,"gameti",x0+cell,y0-34,C.muted,11,"center");
  st.acc+=dt;while(st.acc>.08&&st.kids.length<100){st.acc-=.08;st.kids.push([g1[Math.random()*2|0],g2[Math.random()*2|0]].sort().join(""));}
  const kx=x0+cell*2+50,ks=Math.min(16,(W-kx-10)/10);st.kids.forEach((k,i)=>circ(g,kx+(i%10)*ks+ks/2,y0+Math.floor(i/10)*ks+ks/2,ks*.38,ph(k),C.muted,1));txt(g,"100 figli simulati",kx,y0-14,C.muted,11);
  const cnt=k=>st.kids.filter(x=>x===k).length,fr=gt=>(res[gt]||0)+"/4";
  const fen=p.dom?`fenotipi: rosso ${fr("AA")}, intermedio ${fr("Aa")}, bianco ${fr("aa")}`:`fenotipi: dominante ${(res.AA||0)+(res.Aa||0)}/4, recessivo ${fr("aa")}`;
  return `Genotipi attesi: AA ${fr("AA")}, Aa ${fr("Aa")}, aa ${fr("aa")} · ${fen}. Nei ${st.kids.length} figli simulati: AA ${cnt("AA")}, Aa ${cnt("Aa")}, aa ${cnt("aa")} (il caso si avvicina alle proporzioni attese).`;}},
xlegato:{h:280,c:[{k:"m",l:"Madre",seg:["XᴴXᴴ sana","XᴴXʰ portatrice","XʰXʰ malata"],v:1},{k:"f",l:"Padre",seg:["XᴴY sano","XʰY malato"],v:0}],
 f(g,p,st,dt,W,H){const mg=[["Xᴴ","Xᴴ"],["Xᴴ","Xʰ"],["Xʰ","Xʰ"]][p.m],fg=[["Xᴴ","Y"],["Xʰ","Y"]][p.f],cell=Math.min(80,(H-70)/2),x0=70,y0=46;let ms=0,mm=0,fs=0,fc=0,fm=0;
  fg.forEach((a,j)=>txt(g,a,x0+cell*j+cell/2,y0-14,C.acc,16,"center",true));mg.forEach((a,i)=>txt(g,a,x0-18,y0+cell*i+cell/2,C.fam,16,"center",true));
  txt(g,"♂ padre",x0+cell,y0-34,C.acc,12,"center");txt(g,"♀",x0-40,y0+cell,C.fam,14,"center");
  mg.forEach((a,i)=>fg.forEach((b,j)=>{const son=b==="Y",nh=[a,b].filter(x=>x==="Xʰ").length;let col,lab;if(son){if(nh){mm++;col=C.warn;lab="maschio malato";}else{ms++;col=C.card;lab="maschio sano";}}else{if(nh==2){fm++;col=C.warn;lab="femmina malata";}else if(nh==1){fc++;col=C.lp;lab="portatrice";}else{fs++;col=C.card;lab="femmina sana";}}
   rr(g,x0+cell*j+2,y0+cell*i+2,cell-4,cell-4,8,col,C.line);txt(g,a+(son?"Y":b),x0+cell*j+cell/2,y0+cell*i+cell/2-8,C.ink,15,"center",true);txt(g,lab,x0+cell*j+cell/2,y0+cell*i+cell/2+12,C.ink,10,"center");}));
  const lx=x0+cell*2+40;[[C.warn,"malato/a"],[C.lp,"portatrice sana"],[C.card,"sano/a"]].forEach(([c,l],i)=>{rr(g,lx,y0+i*26,18,18,4,c,C.line);txt(g,l,lx+26,y0+i*26+9,C.ink,13);});
  return `Figli maschi: <b>${mm/2*100}% malati</b> (ricevono l'X solo dalla madre). Figlie: ${fm/2*100}% malate, ${fc/2*100}% portatrici. Il padre trasmette l'X a tutte le figlie e l'Y a tutti i figli maschi: <b>mai trasmissione padre → figlio</b>.`;}},
replicazione:{h:290,c:[],
 f(g,p,st,dt,W,H){const T=8,u=(st.t%T)/T,fx=W*.15+u*W*.7,yt=H*.3,yb=H*.7,ym=H/2,x0=20;
  line(g,fx,ym-10,W-20,ym-10,C.muted,4);line(g,fx,ym+10,W-20,ym+10,C.muted,4);
  rr(g,fx+30,ym-30,34,20,6,C.lp);txt(g,"topo",fx+47,ym-20,C.ink,10,"center",true);
  g.strokeStyle=C.muted;g.lineWidth=4;g.beginPath();g.moveTo(fx,ym-10);g.lineTo(x0,yt);g.moveTo(fx,ym+10);g.lineTo(x0,yb);g.stroke();
  circ(g,fx,ym,12,C.fam);txt(g,"elicasi",fx,ym+28,C.fam,11,"center",true);
  const lead=(x)=>yt+12+(ym-10-yt-12)*((x-x0)/(fx-x0));g.strokeStyle=C.acc;g.lineWidth=4;g.beginPath();g.moveTo(x0,yt+12);g.lineTo(fx-14,lead(fx-14));g.stroke();arrow(g,fx-40,lead(fx-40),fx-14,lead(fx-14),C.acc,4);
  txt(g,"filamento guida (continuo) 5'→3'",x0+10,yt-8,C.acc,12,"left",true);
  const lag=x=>yb-12-(yb-12-ym-10)*((x-x0)/(fx-x0)),fl=70;
  for(let s=x0;s<fx-14;s+=fl){const e=Math.min(s+fl-6,fx-14),age=(fx-14-s)/fl;const done=age>1.4;line(g,e,lag(e),s+4,lag(s+4),C.ok,4);if(!done){line(g,e,lag(e),e-14,lag(e-14),C.warn,5);}
   }
  arrow(g,x0+60,lag(x0+60),x0+30,lag(x0+30),C.ok,3);txt(g,"filamento ritardato: frammenti di Okazaki",x0+10,yb+20,C.ok,12,"left",true);
  txt(g,"■ primer di RNA (primasi)",W-210,H-12,C.warn,11);txt(g,"■ ligasi unisce i frammenti",W-210,H-28,C.ok,11);
  return `La forcella avanza verso destra: l'<b>elicasi</b> separa i filamenti, la <b>topoisomerasi</b> (davanti) toglie il superavvolgimento. La DNA polimerasi lavora solo 5'→3': continua sul filamento guida, a pezzi (frammenti di Okazaki, ognuno con un primer rosso) sul ritardato; poi i primer vengono sostituiti e la <b>ligasi</b> chiude i buchi.`;}},
traduzione:{h:260,c:[{k:"mut",l:"Sequenza",seg:["Normale","Missenso","Nonsenso","Frameshift (−1)"],v:0}],
 f(g,p,st,dt,W,H){const S=["AUGGCUUUCGGAUGGUAAGC","AUGGUUUUCGGAUGGUAAGC","AUGGCUUUCGGAUGAUAAGC","AUGCUUUCGGAUGGUAAGCA"][p.mut];
  const T={AUG:"Met",GCU:"Ala",UUC:"Phe",GGA:"Gly",UGG:"Trp",UAA:"STOP",GUU:"Val",UGA:"STOP",CUU:"Leu",UCG:"Ser",GAU:"Asp",GGU:"Gly",AAG:"Lys",CAG:"Gln"};
  const cods=[];for(let i=0;i+3<=S.length;i+=3)cods.push(S.substr(i,3));let stop=cods.findIndex(c=>T[c]==="STOP");const nC=stop<0?cods.length:stop+1;
  const k=Math.min(nC,Math.floor((st.t%(nC*1.2+2.5))/1.2)+1),bw=Math.min(28,(W-40)/S.length),x0=20,y=H*.72;
  for(let i=0;i<S.length;i++){const ci=Math.floor(i/3);rr(g,x0+i*bw,y,bw-2,26,4,ci%2?A_(C.acc,.18):A_(C.acc,.32));txt(g,S[i],x0+i*bw+bw/2-1,y+13,C.ink,13,"center",true);}
  txt(g,"5'",x0-12,y+13,C.muted,11,"center");txt(g,"3'",x0+S.length*bw+10,y+13,C.muted,11,"center");
  const rx=x0+(k-1)*3*bw-bw*.5;rr(g,rx,y-50,bw*4,90,22,A_(C.fam,.35),C.fam);txt(g,"ribosoma",rx+bw*2,y+52,C.fam,11,"center",true);
  for(let i=0;i<k;i++){const a=T[cods[i]]||"?";if(a==="STOP"){txt(g,"STOP: fattore di rilascio",rx+bw*2,y-62,C.warn,13,"center",true);break;}circ(g,x0+40+i*44,40,18,i===k-1?C.ok:A_(C.ok,.55));txt(g,a,x0+40+i*44,40,C.ink,12,"center",true);if(i)line(g,x0+40+(i-1)*44+18,40,x0+40+i*44-18,40,C.ok,3);}
  const prot=cods.slice(0,nC).map(c=>T[c]||"…").filter(a=>a!=="STOP");
  const nota=["Sequenza normale: Met-Ala-Phe-Gly-Trp, poi lo stop UAA.","Missenso: GCU → GUU cambia un solo amminoacido (Ala → Val), come nell'anemia falciforme (Glu → Val).","Nonsenso: UGG → UGA crea uno stop precoce: proteina tronca.","Frameshift: manca una base dopo AUG; da lì cambia la lettura di tutti i codoni: Leu-Ser-Asp-Gly-Lys…"][p.mut];
  return `Il ribosoma legge l'mRNA a triplette 5'→3' a partire da AUG. Proteina: <b>${prot.join("-")}${stop<0?"…":""}</b>. ${nota}`;}},
ciclo:{h:300,c:[{k:"cond",l:"Condizione",seg:["Cellula normale","Danno al DNA","Senza fattori di crescita"],v:0}],ri:0,
 init(st){st.ph=0;},
 f(g,p,st,dt,W,H){const ph=[["G1",.4,C.acc],["S",.3,C.ok],["G2",.2,C.soon],["M",.1,C.warn]],cx=W*.3,cy=H/2,R=Math.min(H*.38,W*.24);
  const stopAt=p.cond==1?.4:p.cond==2?.25:null;if(stopAt==null||st.ph<stopAt-.005||st.ph>stopAt+.3)st.ph=(st.ph+dt*.08)%1;
  let a0=-Math.PI/2;ph.forEach(([n,f,c])=>{g.strokeStyle=c;g.lineWidth=24;g.beginPath();g.arc(cx,cy,R,a0,a0+f*2*Math.PI);g.stroke();const am=a0+f*Math.PI;txt(g,n,cx+Math.cos(am)*(R+28),cy+Math.sin(am)*(R+28),c,15,"center",true);a0+=f*2*Math.PI;});
  const ang=-Math.PI/2+st.ph*2*Math.PI;arrow(g,cx,cy,cx+Math.cos(ang)*(R-20),cy+Math.sin(ang)*(R-20),C.ink,3);
  const mk=(f,l)=>{const a=-Math.PI/2+f*2*Math.PI;line(g,cx+Math.cos(a)*(R-14),cy+Math.sin(a)*(R-14),cx+Math.cos(a)*(R+14),cy+Math.sin(a)*(R+14),C.ink,3);txt(g,l,cx+Math.cos(a)*(R-34),cy+Math.sin(a)*(R-34),C.muted,10,"center");};
  mk(.25,"R");mk(.4,"G1/S");mk(.9,"G2/M");
  const gx=W*.6,gw=W*.36,gy=30,gh=H-70;txt(g,"cicline",gx,gy-12,C.muted,12);axes(g,gx,gy,gw,gh,"ciclo","");
  [["D",.05,.45,C.acc],["E",.3,.48,C.ok],["A",.42,.9,C.soon],["B",.6,1,C.warn]].forEach(([n,s,e,c],i)=>{g.strokeStyle=c;g.lineWidth=2.5;g.beginPath();for(let x=0;x<=1;x+=.01){const v=x<s||x>e?0:Math.sin(Math.PI*(x-s)/(e-s));const X=gx+x*gw,Y=gy+gh-v*gh*.85;x?g.lineTo(X,Y):g.moveTo(X,Y);}g.stroke();txt(g,n,gx+((s+e)/2)*gw,gy+gh*.1-4,c,13,"center",true);});
  line(g,gx+st.ph*gw,gy,gx+st.ph*gw,gy+gh,C.ink,1.5,[3,3]);
  const where=st.ph<.4?"G1":st.ph<.7?"S":st.ph<.9?"G2":"M";
  return p.cond==1?`Danno al DNA: <b>p53</b> si accumula, accende <b>p21</b> che blocca le CDK: la cellula si ferma al checkpoint <b>G1/S</b> per riparare (o va in apoptosi).`:p.cond==2?`Senza fattori di crescita non si forma ciclina D-CDK4/6, Rb resta legata a E2F: la cellula non supera il <b>punto di restrizione (R)</b> ed entra in G0.`:`Fase attuale: <b>${where}</b>. Ciclina D-CDK4/6 fa superare il punto di restrizione (R), E-CDK2 avvia la fase S, A-CDK2 la porta avanti, B-CDK1 guida la mitosi; poi le cicline vengono degradate.`;}},
mitosi:{h:320,c:[],
 f(g,p,st,dt,W,H){const N=["Interfase","Profase","Prometafase","Metafase","Anafase","Telofase","Citodieresi"],D=2.4,k=Math.floor(st.t/D)%7,u=(st.t%D)/D,cx=W/2,cy=H/2+6,R=Math.min(H*.42,W*.3);
  const ch=[[R*.34,C.acc],[R*.34,C.warn],[R*.2,C.acc],[R*.2,C.warn]],w=Math.max(6,R*.06);
  if(k<6){g.beginPath();g.ellipse(cx,cy,k>=5?R*1.25:R*1.05,R,0,0,7);g.fillStyle=A_(C.acc,.06);g.fill();g.strokeStyle=C.line;g.lineWidth=2;g.stroke();}
  if(k==0){circ(g,cx,cy,R*.5,A_(C.fam,.1),C.fam,2);for(let i=0;i<14;i++){g.strokeStyle=i%2?C.acc:C.warn;g.lineWidth=2;g.beginPath();for(let s=0;s<12;s++){const x=cx-R*.35+((i*13)%28)/28*R*.7+Math.sin(s+i)*6,y=cy-R*.3+s*R*.05;s?g.lineTo(x,y):g.moveTo(x,y);}g.stroke();}}
  const pole=[cx-R*.85,cx+R*.85];if(k>=1&&k<=4)pole.forEach(x=>{circ(g,x,cy,6,C.fam);});
  if(k==1){g.setLineDash([4,4]);circ(g,cx,cy,R*.5,null,C.fam,2);g.setLineDash([]);ch.forEach(([L,c],i)=>chromX(g,cx-R*.25+(i%2)*R*.5,cy-R*.15+Math.floor(i/2)*R*.3,L,w,c));}
  if(k==2||k==3){const al=k==2?u:1;ch.forEach(([L,c],i)=>{const x=lerp(cx-R*.25+(i%2)*R*.5,cx,al),y=lerp(cy-R*.15+Math.floor(i/2)*R*.3,cy+(i-1.5)*R*.42,al);pole.forEach(px=>line(g,px,cy,x,y,A_(C.fam,.5),1));chromX(g,x,y,L,w,c);});if(k==3)line(g,cx,cy-R*.9,cx,cy+R*.9,C.muted,1,[3,4]);}
  if(k==4){ch.forEach(([L,c],i)=>{const y=cy+(i-1.5)*R*.42,d=u*R*.6;pole.forEach(px=>line(g,px,cy,px<cx?cx-d:cx+d,y,A_(C.fam,.5),1));chromatid(g,cx-w-d,y,L,w,c);chromatid(g,cx+w+d,y,L,w,c);});}
  if(k==5||k==6){const sep=k==6?u*R*.35:0;if(k==6){[-1,1].forEach(s=>{circ(g,cx+s*(R*.62+sep),cy,R*.62,A_(C.acc,.06),C.line,2);});}
   [-1,1].forEach(s=>{const nx=cx+s*(R*.62+sep);circ(g,nx,cy,R*.4,A_(C.fam,.08),C.fam,2);ch.forEach(([L,c],i)=>chromatid(g,nx-R*.18+i*R*.12,cy,L*.9,w,c));});}
  txt(g,N[k],16,20,C.ink,16,"left",true);
  const T=["Il DNA si è duplicato (fase S): ogni cromosoma ha due cromatidi, ancora non visibili.","La cromatina si condensa (condensine); i centrosomi vanno ai poli e si forma il fuso.","L'involucro nucleare si rompe; i microtubuli si attaccano ai cinetocori (complesso NDC80).","I cromosomi sono allineati sulla piastra equatoriale; il checkpoint del fuso controlla che tutti siano attaccati.","APC/C fa degradare la securina, la separasi taglia la coesina: i cromatidi fratelli vanno ai poli opposti.","Si riformano due involucri nucleari; la cromatina si decondensa.","L'anello contrattile di actina e miosina divide il citoplasma: due cellule figlie identiche (2n)."];
  return `<b>${N[k]}</b>: ${T[k]} Qui 2n = 4: due coppie di omologhi (blu = materno, rosso = paterno).`;}},
meiosi:{h:320,c:[],
 f(g,p,st,dt,W,H){const N=["Profase I","Metafase I","Anafase I","Telofase I","Metafase II","Anafase II","Telofase II"],D=2.6,k=Math.floor(st.t/D)%7,u=(st.t%D)/D,cx=W/2,cy=H/2+8,R=Math.min(H*.4,W*.22),w=Math.max(6,R*.07);
  const B=C.acc,Rd=C.warn;
  /* cromosomi: lungo (con crossing over) e corto. Orientamento in MI: lungo blu a sinistra, corto rosso a sinistra (assortimento indipendente) */
  const L1=R*.42,L2=R*.26;
  if(k<=3){const ex=k==3?R*.7:0;g.beginPath();g.ellipse(cx,cy,R*1.3+ex,R,0,0,7);g.fillStyle=A_(C.acc,.06);g.fill();g.strokeStyle=C.line;g.lineWidth=2;g.stroke();
   if(k==3){line(g,cx,cy-R,cx,cy+R,C.muted,2,[2,3]);}}
  if(k==0){const sp=lerp(40,10,u);chromX(g,cx-sp/2-18,cy-28,L1,w,B,B,null,u>.5?Rd:null);chromX(g,cx+sp/2-18,cy-28,L1,w,Rd,Rd,u>.5?B:null,null);chromX(g,cx-sp/2+40,cy+30,L2,w,Rd);chromX(g,cx+sp/2+40,cy+30,L2,w,B);if(u>.5)txt(g,"crossing over",cx-18,cy-62,C.fam,12,"center",true);}
  if(k==1||k==2){const d=k==2?u*R*.9:0;line(g,cx,cy-R*.9,cx,cy+R*.9,C.muted,1,[3,4]);
   chromX(g,cx-14-d,cy-26,L1,w,B,B,null,Rd);chromX(g,cx+14+d,cy-26,L1,w,Rd,Rd,B,null);chromX(g,cx-14-d,cy+28,L2,w,Rd);chromX(g,cx+14+d,cy+28,L2,w,B);}
  if(k==3){[-1,1].forEach(s=>{const x=cx+s*R*1.1;s<0?(chromX(g,x,cy-24,L1,w,B,B,null,Rd),chromX(g,x,cy+26,L2,w,Rd)):(chromX(g,x,cy-24,L1,w,Rd,Rd,B,null),chromX(g,x,cy+26,L2,w,B));});}
  if(k>=4){const cells=[cx-R*1.25,cx+R*1.25];
   if(k<6)cells.forEach((x,ci)=>{g.beginPath();g.ellipse(x,cy,R*.9,R*.8,0,0,7);g.fillStyle=A_(C.acc,.06);g.fill();g.strokeStyle=C.line;g.lineWidth=2;g.stroke();line(g,x,cy-R*.7,x,cy+R*.7,C.muted,1,[3,4]);
     const d=k==5?u*R*.5:0,cl=ci?[Rd,B]:[B,Rd],tp=ci?[B,null]:[null,Rd],cs=ci?B:Rd;
     if(k==4){chromX(g,x,cy-22,L1,w,cl[0],cl[0],tp[0],tp[1]);chromX(g,x,cy+24,L2,w,cs);}
     else{chromatid(g,x-w-d,cy-22,L1,w,cl[0],tp[0]);chromatid(g,x+w+d,cy-22,L1,w,cl[0],tp[1]);chromatid(g,x-w-d,cy+24,L2,w,cs);chromatid(g,x+w+d,cy+24,L2,w,cs);}});
   if(k==6){const xs=[cx-R*1.65,cx-R*.55,cx+R*.55,cx+R*1.65],tips=[null,Rd,B,null],cols=[B,B,Rd,Rd],sh=[Rd,Rd,B,B];xs.forEach((x,i)=>{circ(g,x,cy,R*.45,A_(C.acc,.06),C.line,2);chromatid(g,x-8,cy,L1,w,cols[i],tips[i]);chromatid(g,x+8,cy,L2,w,sh[i]);txt(g,"n",x,cy+R*.45+12,C.muted,11,"center");});}}
  txt(g,N[k],16,20,C.ink,16,"left",true);
  const T=["Gli omologhi si appaiano (bivalenti) e si scambiano tratti tra cromatidi non fratelli: crossing over (pachitene).","Le coppie di omologhi si allineano sulla piastra; l'orientamento di ogni coppia è casuale (assortimento indipendente).","Si separano gli OMOLOGHI, non i cromatidi: è la divisione riduzionale (da 2n a n).","Due cellule aploidi, ciascuna con un cromosoma per coppia, ancora formato da due cromatidi.","In ogni cellula i cromosomi si allineano come in una mitosi.","Si separano i cromatidi fratelli (divisione equazionale).","Quattro cellule aploidi, tutte geneticamente diverse grazie a crossing over e assortimento indipendente."];
  return `<b>${N[k]}</b>: ${T[k]}`;}}
});
