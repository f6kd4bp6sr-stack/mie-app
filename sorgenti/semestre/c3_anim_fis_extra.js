/* ================= FISICA: animazioni per gli argomenti che non ne avevano =================
   u1a estensive, u1b potenze, u1d dimensioni, u2f urti, u3e laplace, u5d carnot, u5e calore, u6a coulomb, u6c condensatore */
Object.assign(AN,{
estensive:{h:280,c:[{k:"f",l:"Frazione del blocco che prendo",min:.1,max:1,st:.05,v:.5}],
 f(g,p,st,dt,W,H){const s=Math.min(H*.55,W*.28),x0=W*.08,y0=H*.18,cut=s*p.f;
  rr(g,x0,y0,s,s,6,A_(C.acc,.25),C.acc);line(g,x0+cut,y0-6,x0+cut,y0+s+6,C.warn,2,[5,4]);rr(g,x0,y0,cut,s,6,A_(C.warn,.25));txt(g,"blocco intero",x0+s/2,y0-14,C.muted,12,"center");
  const x1=W*.5;rr(g,x1,y0,cut,s,6,A_(C.warn,.3),C.warn);txt(g,"pezzo",x1+cut/2,y0-14,C.warn,12,"center",true);
  const m=2*p.f,V=2*p.f,E=m*4186*37/1000;const tx=x1+Math.max(cut,40)+20;
  [["Massa",F2(m,2)+" kg","estensiva"],["Volume",F2(V,2)+" L","estensiva"],["Energia interna (rel.)",F2(E,0)+" kJ","estensiva"],["Temperatura","37 °C","intensiva"],["Densità","1 kg/L","intensiva"],["Pressione","1 atm","intensiva"]].forEach(([a,b,c],i)=>{txt(g,a+": ",tx,y0+10+i*24,C.muted,13);txt(g,b,tx+150,y0+10+i*24,c==="estensiva"?C.warn:C.ok,13,"left",true);});
  return `Prendendo il ${F2(p.f*100,0)}% del blocco d'acqua, le grandezze <b style="color:var(--warn)">estensive</b> (massa, volume, energia) si riducono nella stessa proporzione; quelle <b style="color:var(--ok)">intensive</b> (temperatura, densità, pressione) restano uguali. Due grandezze estensive divise tra loro danno un'intensiva: densità = massa/volume.`;}},
potenze:{h:250,c:[{k:"e",l:"Ordine di grandezza: 10^x metri, x =",min:-10,max:7,st:1,v:-6}],
 f(g,p,st,dt,W,H){const O=[[-10,"atomo"],[-9,"DNA (largh. 2 nm)"],[-7,"virus"],[-6,"batterio"],[-5,"globulo rosso (7 µm)"],[-4,"spessore di un capello"],[-3,"formica"],[0,"persona (1,7 m)"],[2,"campo da calcio"],[4,"Everest"],[6,"Italia"],[7,"Terra (diametro)"]];
  const P={"-9":"nano (n)","-6":"micro (µ)","-3":"milli (m)","-2":"centi (c)","-1":"deci (d)","0":"—","3":"kilo (k)","6":"mega (M)","9":"giga (G)"},x0=30,w=W-60,y=H*.5,X=e=>x0+(e+10)/17*w;
  line(g,x0,y,x0+w,y,C.muted,2);for(let e=-10;e<=7;e++){line(g,X(e),y-6,X(e),y+6,C.muted,1.5);txt(g,"10"+(e<0?"⁻":"")+String(Math.abs(e)).split("").map(d=>"⁰¹²³⁴⁵⁶⁷⁸⁹"[+d]).join(""),X(e),y+20,C.muted,11,"center");}
  O.forEach(([e,l],i)=>{const up=i%2===0;line(g,X(e),y-8,X(e),up?y-40:y-70,A_(C.acc,.5),1);txt(g,l,X(e),up?y-48:y-78,e===p.e?C.acc:C.muted,11,"center",e===p.e);});
  arrow(g,X(p.e),y+60,X(p.e),y+12,C.warn,3);const near=O.reduce((a,b)=>Math.abs(b[0]-p.e)<Math.abs(a[0]-p.e)?b:a);
  return `10^${p.e} m = <b>${p.e>=0?F2(Math.pow(10,p.e),0):"0,"+"0".repeat(-p.e-1)+"1"} m</b>${P[p.e]?` · prefisso <b>${P[p.e]}</b>`:""}. Più vicino: <b>${near[1]}</b>. Ogni tacca è un fattore 10: un globulo rosso (10⁻⁵ m) sta 10⁵ volte in una persona.`;}},
dimensioni:{h:260,c:[{k:"fo",l:"Formula da controllare",seg:["v = √(2gh)","E = ½mv²","p = ρgh","F = m·v","T = 2π√(m/k)","v = λ·T"],v:0}],
 f(g,p,st,dt,W,H){const D=[[[0,1,-1],[0,1,-1],"velocità","√(g·h)"],[[1,2,-2],[1,2,-2],"energia","massa·velocità²"],[[1,-1,-2],[1,-1,-2],"pressione","densità·g·altezza"],[[1,1,-2],[1,1,-1],"forza","massa·velocità"],[[0,0,1],[0,0,1],"tempo","√(massa/costante elastica)"],[[0,1,-1],[0,1,1],"velocità","lunghezza·tempo"]][p.fo];
  const lab=["M","L","T"],x0=W*.12,cw=Math.min(90,W*.12),y0=H*.55,sc=26;
  ["a sinistra: "+D[2],"a destra: "+D[3]].forEach((t,s)=>{txt(g,t,x0+s*(cw*3+60),26,C.muted,12);lab.forEach((l,i)=>{const v=D[s][i],x=x0+s*(cw*3+60)+i*cw;line(g,x,y0,x+cw-12,y0,C.muted,1);rr(g,x+8,v>0?y0-v*sc:y0,cw-28,Math.abs(v)*sc,4,D[0][i]===D[1][i]?C.ok:C.warn);txt(g,l+(v?(v>0?"⁺":"⁻")+"¹²³"[Math.abs(v)-1]:"⁰"),x+cw/2-6,y0+(v<0?-14:16)+(v>0?0:0)+(v>0?14:0),C.ink,13,"center",true);});});
  const ok=D[0].every((v,i)=>v===D[1][i]);txt(g,ok?"✓ dimensionalmente corretta":"✗ dimensioni diverse: formula sbagliata",W/2,H-18,ok?C.ok:C.warn,15,"center",true);
  const f=d=>lab.map((l,i)=>d[i]?`[${l}]${d[i]!==1?"<sup>"+d[i]+"</sup>":""}`:"").join("")||"adimensionale";
  return `Sinistra: ${f(D[0])} · destra: ${f(D[1])}. ${ok?"Gli esponenti di massa, lunghezza e tempo coincidono.":"Gli esponenti non coincidono: la formula non può essere giusta."} I numeri puri (½, 2π) non hanno dimensioni e non contano.`;}},
urti:{h:280,c:[{k:"m1",l:"Massa 1",min:1,max:5,st:.5,v:2,u:" kg"},{k:"v1",l:"Velocità 1",min:1,max:6,st:.5,v:4,u:" m/s"},{k:"m2",l:"Massa 2",min:1,max:5,st:.5,v:2,u:" kg"},{k:"v2",l:"Velocità 2",min:-4,max:3,st:.5,v:0,u:" m/s"},{k:"tipo",l:"Urto",seg:["Elastico","Completamente anelastico"],v:0}],ri:1,
 init(st,p){st.x1=1;st.x2=6;st.u1=p?p.v1:4;st.u2=p?p.v2:0;st.hit=false;st.tt=0;},
 f(g,p,st,dt,W,H){const L=12,sx=(W-40)/L,X=x=>20+x*sx,w1=.4+p.m1*.12,w2=.4+p.m2*.12,y=H*.55;st.tt+=dt;
  if(!st.hit&&st.u1>st.u2&&st.x1+w1>=st.x2){st.hit=true;if(p.tipo==0){const a=((p.m1-p.m2)*p.v1+2*p.m2*p.v2)/(p.m1+p.m2),b=((p.m2-p.m1)*p.v2+2*p.m1*p.v1)/(p.m1+p.m2);st.u1=a;st.u2=b;}else{const v=(p.m1*p.v1+p.m2*p.v2)/(p.m1+p.m2);st.u1=st.u2=v;}}
  st.x1+=st.u1*dt*.6;st.x2+=st.u2*dt*.6;if(p.tipo==1&&st.hit)st.x1=st.x2-w1;if(st.tt>7||st.x1>L+2||st.x2<-3||st.x1<-4)this.init(st,p);
  line(g,10,y+30,W-10,y+30,C.muted,2);rr(g,X(st.x1),y+30-w1*sx*.6,w1*sx,w1*sx*.6,6,C.acc);rr(g,X(st.x2),y+30-w2*sx*.6,w2*sx,w2*sx*.6,6,C.warn);
  txt(g,p.m1+" kg",X(st.x1)+w1*sx/2,y+30-w1*sx*.3,C.card,12,"center",true);txt(g,p.m2+" kg",X(st.x2)+w2*sx/2,y+30-w2*sx*.3,C.card,12,"center",true);
  const p0=p.m1*p.v1+p.m2*p.v2,E0=.5*p.m1*p.v1**2+.5*p.m2*p.v2**2,E1=.5*p.m1*st.u1**2+.5*p.m2*st.u2**2;
  txt(g,`prima: p = ${F2(p0,1)} kg·m/s   Ec = ${F2(E0,1)} J`,20,24,C.muted,13);if(st.hit)txt(g,`dopo: p = ${F2(p.m1*st.u1+p.m2*st.u2,1)} kg·m/s   Ec = ${F2(E1,1)} J`,20,46,C.ink,13,"left",true);
  if(p.v1<=p.v2)return "Il carrello 1 non raggiunge il 2: aumenta v₁ o rendi v₂ più piccola (negativa = verso sinistra).";
  return st.hit?`Dopo l'urto: v₁ = <b>${F2(st.u1,2)} m/s</b>, v₂ = <b>${F2(st.u2,2)} m/s</b>. La quantità di moto totale si conserva (${F2(p0,1)} kg·m/s). ${p.tipo==0?"Urto elastico: si conserva anche l'energia cinetica.":`Urto anelastico: si perdono <b>${F2(E0-E1,1)} J</b> di energia cinetica (calore e deformazione).`}`:"I carrelli si avvicinano…";}},
laplace:{h:300,c:[{k:"mode",l:"Fenomeno",seg:["Due bolle collegate","Capillarità"],v:0},{k:"r",l:"Raggio (bolla piccola o tubo capillare)",min:.2,max:1,st:.05,v:.5}],ri:1,
 init(st,p){const r=p?p.r:.5;st.a=r;st.b=1.2;},
 f(g,p,st,dt,W,H){if(p.mode==0){const V=st.a**3+st.b**3;if(st.a>.05){st.a=Math.max(.05,st.a-dt*.08);st.b=Math.cbrt(V-st.a**3);}const s=Math.min(H*.32,W*.16),cy=H*.5,xa=W*.28,xb=W*.68;
   line(g,xa,cy,xb,cy,C.muted,8);rr(g,(xa+xb)/2-8,cy-14,16,28,4,C.soon);circ(g,xa,cy,st.a*s,A_(C.acc,.25),C.acc,2);circ(g,xb,cy,st.b*s,A_(C.acc,.25),C.acc,2);
   if(st.a>.06)arrow(g,(xa+xb)/2-40,cy-28,(xa+xb)/2+40,cy-28,C.warn,3,"aria");txt(g,"Δp = 4τ/r",xa,cy+st.a*s+16,C.muted,12,"center");
   return `La pressione dentro una bolla è maggiore che fuori: Δp = 2τ/r per una goccia, 4τ/r per una bolla di sapone (due superfici). <b>Più la bolla è piccola, più la pressione interna è alta</b>: l'aria passa dalla piccola alla grande, che si gonfia. Negli alveoli il surfattante abbassa τ ed evita che i piccoli si svuotino nei grandi.`;}
  const rm=p.r,h=1.49e-5/(rm/1000)*100,sc=Math.min(6,(H*.6)/Math.max(h,1)),wy=H*.7,tx=W*.35;
  rr(g,40,wy,W-80,H-wy-10,0,A_(C.acc,.25));[[tx,rm,C.acc,"acqua (bagna il vetro)",1],[W*.65,rm,C.soon,"mercurio (non bagna)",-1]].forEach(([x,r,c,l,sg])=>{const tw=Math.max(6,r*30),hh=sg>0?h*sc:-h*sc*.4;
   rr(g,x-tw/2-3,40,tw+6,H-50-40,4,null,C.muted);rr(g,x-tw/2,wy-hh,tw,hh+(H-wy-10),0,sg>0?A_(C.acc,.5):A_(C.muted,.5));txt(g,l,x,26,c,12,"center",true);});
  txt(g,"h = "+F2(h,1)+" cm",tx+40,wy-h*sc/2,C.acc,13,"left",true);
  return `In un tubo di raggio <b>${F2(rm,2)} mm</b> l'acqua sale di circa <b>${F2(h,1)} cm</b> (h = 2τ/(ρgr)): più il tubo è sottile, più sale. Il mercurio, che non bagna il vetro, scende. È la capillarità, utile per esempio nei prelievi con il capillare dal dito.`;}},
carnot:{h:300,c:[{k:"Tc",l:"Sorgente calda",min:300,max:900,st:10,v:600,u:" K"},{k:"Tf",l:"Sorgente fredda",min:250,max:400,st:5,v:300,u:" K"},{k:"tipo",l:"Macchina",seg:["Carnot (ideale, reversibile)","Reale (metà del rendimento)"],v:0}],
 f(g,p,st,dt,W,H){const ec=Math.max(0,1-p.Tf/p.Tc),e=p.tipo?ec/2:ec,Qc=1000,L=e*Qc,Qf=Qc-L,cx=W*.38;
  rr(g,cx-120,14,240,40,8,A_(C.warn,.3),C.warn);txt(g,"sorgente calda "+p.Tc+" K",cx,34,C.ink,13,"center",true);rr(g,cx-120,H-54,240,40,8,A_(C.acc,.3),C.acc);txt(g,"sorgente fredda "+p.Tf+" K",cx,H-34,C.ink,13,"center",true);
  circ(g,cx,H/2,34,C.card,C.ink,3);txt(g,"⚙",cx,H/2,C.ink,26,"center");const t=(st.t*2)%1;
  g.lineWidth=4+Qc/60;g.strokeStyle=A_(C.warn,.7);line(g,cx,54,cx,H/2-34,A_(C.warn,.7),4+Qc/70);txt(g,"Qc = 1000 J",cx+14,H*.3,C.warn,13,"left",true);
  line(g,cx,H/2+34,cx,H-54,A_(C.acc,.7),4+Qf/70);txt(g,"Qf = "+F2(Qf,0)+" J",cx+14,H*.72,C.acc,13,"left",true);
  if(L>1){arrow(g,cx+34,H/2,cx+34+Math.max(30,L/4),H/2,C.ok,4+L/70);txt(g,"L = "+F2(L,0)+" J",cx+44+Math.max(30,L/4),H/2,C.ok,13,"left",true);}
  for(let i=0;i<3;i++){const y=54+((t+i/3)%1)*(H/2-88);circ(g,cx,y,4,C.warn);}
  const dS=-Qc/p.Tc+Qf/p.Tf;
  return `Rendimento = 1 − T_f/T_c = <b>${F2(ec*100,1)}%</b> (Carnot)${p.tipo?`; la macchina reale arriva solo al <b>${F2(e*100,1)}%</b>`:""}. Lavoro L = ${F2(L,0)} J, calore ceduto ${F2(Qf,0)} J. Variazione di entropia dell'universo: <b>${F2(Math.max(0,dS),2)} J/K</b> ${p.tipo?"(> 0: processo irreversibile)":"(zero: ciclo reversibile)"}. Nessuna macchina può avere rendimento 100%.`;}},
calore:{h:290,c:[{k:"mode",l:"Meccanismo",seg:["Conduzione","Convezione","Irraggiamento"],v:0},{k:"dT",l:"Differenza di temperatura",min:5,max:40,st:1,v:20,u:" °C"},{k:"d",l:"Spessore dello strato (conduzione)",min:1,max:10,st:.5,v:2,u:" cm"}],
 init(st){st.P=Array.from({length:40},(_,i)=>({a:i/40*6.283,r:.3+Math.random()*.6}));},
 f(g,p,st,dt,W,H){if(p.mode==0){const P=.2*1*p.dT/(p.d/100),x0=W*.3,w=Math.max(16,p.d*14),y0=30,h=H-60;
   rr(g,30,y0,x0-30,h,0,A_(C.warn,.3));txt(g,"caldo",50,y0+14,C.warn,12);rr(g,x0+w,y0,W-x0-w-30,h,0,A_(C.acc,.2));txt(g,"freddo",W-80,y0+14,C.acc,12);rr(g,x0,y0,w,h,0,A_(C.soon,.5));txt(g,"strato (es. grasso)",x0+w/2,y0+h+14,C.muted,11,"center");
   const n=Math.min(10,Math.round(P/20)+1);for(let i=0;i<n;i++){const u=((st.t*.6+i/n)%1);circ(g,x0+u*w,y0+h*(i+.5)/n,4,C.warn);}
   return `Conduzione: Q/t = k·A·ΔT/d. Con k = 0,2 W/(m·K) (tessuto adiposo), A = 1 m², ΔT = ${p.dT} °C e spessore ${F2(p.d,1)} cm passano circa <b>${F2(P,0)} W</b>. Raddoppiando lo spessore la potenza si dimezza: il grasso e l'aria ferma isolano.`;}
  if(p.mode==1){const cx=W*.4,cy=H/2,R=Math.min(H*.36,W*.25);rr(g,cx-R,cy-R,2*R,2*R,10,A_(C.acc,.12),C.line);rr(g,cx-R,cy+R-8,2*R,10,3,C.warn);txt(g,"fonte di calore",cx,cy+R+14,C.warn,12,"center");
   st.P.forEach(q=>{q.a+=dt*(.2+p.dT/40);const x=cx+Math.cos(q.a)*R*q.r*.8,y=cy-Math.sin(q.a)*R*q.r*.8;circ(g,x,y,4,Math.cos(q.a)>0?C.warn:C.acc);});
   return `Convezione: il fluido scaldato dal basso diventa meno denso e sale, quello freddo scende: il calore viaggia con il fluido che si muove. Nel corpo il sangue porta il calore dagli organi interni alla pelle; più grande è ΔT, più rapida è la circolazione.`;}
  const T=310,Ta=T-p.dT,s=5.67e-8,P=s*1.8*(T**4-Ta**4),cx=W*.3,cy=H/2;circ(g,cx,cy,40,A_(C.warn,.4),C.warn,2);txt(g,"corpo 37 °C",cx,cy,C.ink,12,"center",true);
  for(let i=0;i<8;i++){const a=i*Math.PI/4;g.strokeStyle=C.lp;g.lineWidth=2;g.beginPath();for(let s2=0;s2<60;s2++){const r=48+s2+((st.t*40)%20),x=cx+Math.cos(a)*r+Math.cos(a+Math.PI/2)*Math.sin(s2*.6)*4,y=cy+Math.sin(a)*r+Math.sin(a+Math.PI/2)*Math.sin(s2*.6)*4;s2?g.lineTo(x,y):g.moveTo(x,y);}g.stroke();}
  return `Irraggiamento: ogni corpo emette onde elettromagnetiche (infrarosso a queste temperature), anche nel vuoto, con potenza proporzionale a T⁴. Con l'ambiente a ${37-p.dT} °C un corpo nudo (1,8 m²) perde circa <b>${F2(P,0)} W</b>: è la via principale di dispersione a riposo.`;}},
coulomb:{h:260,c:[{k:"q1",l:"Carica 1",min:-5,max:5,st:1,v:3,u:" µC"},{k:"q2",l:"Carica 2",min:-5,max:5,st:1,v:-2,u:" µC"},{k:"r",l:"Distanza",min:.1,max:1,st:.05,v:.3,u:" m"}],
 f(g,p,st,dt,W,H){const F=9e9*p.q1*p.q2*1e-12/(p.r*p.r),cy=H/2+10,d=(W-260)*p.r+40,x1=W/2-d/2,x2=W/2+d/2,L=Math.min(110,30*Math.log10(1+Math.abs(F)*20)),att=F<0;
  line(g,x1,cy+50,x2,cy+50,C.muted,1,[3,3]);txt(g,F2(p.r,2)+" m",(x1+x2)/2,cy+62,C.muted,12,"center");
  [[x1,p.q1],[x2,p.q2]].forEach(([x,q])=>{circ(g,x,cy,10+Math.abs(q)*3,q>0?C.warn:q<0?C.acc:C.muted);txt(g,q>0?"+":q<0?"−":"0",x,cy,C.card,18,"center",true);});
  if(F!==0){const r1=10+Math.abs(p.q1)*3+4,r2=10+Math.abs(p.q2)*3+4,LL=Math.max(28,L);if(att){arrow(g,x1+r1,cy-26,x1+r1+LL,cy-26,C.ink,3,"F");arrow(g,x2-r2,cy-26,x2-r2-LL,cy-26,C.ink,3,"F");}else{arrow(g,x1-r1,cy-26,x1-r1-LL,cy-26,C.ink,3,"F");arrow(g,x2+r2,cy-26,x2+r2+LL,cy-26,C.ink,3,"F");}}
  return F===0?"Una delle due cariche è nulla: nessuna forza.":`F = k·q₁q₂/r² = <b>${F2(Math.abs(F),3)} N</b>, ${att?"<b>attrattiva</b> (segni opposti)":"<b>repulsiva</b> (stesso segno)"}. Le due forze sono uguali e opposte (terzo principio). Dimezzando la distanza la forza diventa 4 volte più grande.`;}},
condensatore:{h:280,c:[{k:"d",l:"Distanza tra le armature",min:1,max:10,st:.5,v:2,u:" mm"},{k:"A",l:"Area delle armature",min:20,max:200,st:10,v:100,u:" cm²"},{k:"V",l:"Tensione applicata",min:1,max:12,st:1,v:9,u:" V"},{k:"diel",l:"Tra le armature",seg:["Vuoto/aria (εr 1)","Vetro (εr 5)","Acqua (εr 80)"],v:0}],
 f(g,p,st,dt,W,H){const er=[1,5,80][p.diel],C0=8.85e-12*er*(p.A*1e-4)/(p.d*1e-3),Q=C0*p.V,U=.5*C0*p.V*p.V,E=p.V/(p.d*1e-3),cx=W*.38,cy=H/2,ph=Math.min(H*.75,40+Math.sqrt(p.A)*12),gap=14+p.d*12;
  if(p.diel)rr(g,cx-gap/2,cy-ph/2,gap,ph,0,A_(C.soon,p.diel==2?.45:.25));rr(g,cx-gap/2-8,cy-ph/2,8,ph,2,C.warn);rr(g,cx+gap/2,cy-ph/2,8,ph,2,C.acc);
  const n=Math.max(2,Math.min(12,Math.round(Math.log10(Q*1e12+1)*3)));for(let i=0;i<n;i++){const y=cy-ph/2+ph*(i+.5)/n;txt(g,"+",cx-gap/2-16,y,C.warn,13,"center",true);txt(g,"−",cx+gap/2+16,y,C.acc,13,"center",true);if(i%2===0)arrow(g,cx-gap/2+2,y,cx+gap/2-2,y,A_(C.ink,.6),1.5);}
  line(g,cx-gap/2-4,cy-ph/2,cx-gap/2-4,22,C.ink,2);line(g,cx+gap/2+4,cy-ph/2,cx+gap/2+4,22,C.ink,2);line(g,cx-gap/2-4,22,cx+gap/2+4,22,C.ink,2);rr(g,cx-22,12,44,20,4,C.card,C.ink);txt(g,p.V+" V",cx,22,C.ink,12,"center",true);
  const fx=W*.62;[["C = ε₀εᵣA/d",F2(C0*1e12,1)+" pF"],["Q = C·V",F2(Q*1e9,2)+" nC"],["U = ½CV²",F2(U*1e9,2)+" nJ"],["E = V/d",F2(E,0)+" V/m"]].forEach(([a,b],i)=>{txt(g,a,fx,40+i*34,C.muted,13);txt(g,b,fx+120,40+i*34,C.ink,14,"left",true);});
  return `Capacità <b>${F2(C0*1e12,1)} pF</b>: cresce con l'area e con εᵣ, diminuisce allontanando le armature. A tensione fissa ${p.V} V la carica è Q = CV = ${F2(Q*1e9,2)} nC e l'energia U = ½CV² = ${F2(U*1e9,2)} nJ. Il dielettrico si polarizza e fa aumentare la capacità di εᵣ volte.`;}}
});
