/* ================= ANIMAZIONI BIOLOGIA (parte B): unità 5, 6 e morte cellulare ================= */
(function(){
const rnd=i=>{const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x);};
const cl=(v,a,b)=>Math.max(a,Math.min(b,v));
const FONT=(z,b)=>(b?"700 ":"")+z+"px -apple-system,BlinkMacSystemFont,sans-serif";
/* testo che si restringe per stare in maxW */
function ftxt(g,s,x,y,col,maxW,size,al,bold){let z=size||12;g.font=FONT(z,bold);while(z>8&&g.measureText(s).width>maxW){z-=.5;g.font=FONT(z,bold);}txt(g,s,x,y,col,z,al||"left",bold);}
/* etichetta a pillola */
function pill(g,s,x,y,col,size,fa){size=size||11;g.font=FONT(size,true);const w=g.measureText(s).width+10,h=size+7;rr(g,x-w/2,y-h/2,w,h,h/2,A_(col,fa==null?.2:fa));g.strokeStyle=col;g.lineWidth=1.5;g.stroke();txt(g,s,x,y,C.ink,size,"center",true);return w;}
/* punto lungo una spezzata (u da 0 a 1, per lunghezza) */
function along(P,u){let L=0;const d=[];for(let i=1;i<P.length;i++){const l=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);d.push(l);L+=l;}let s=cl(u,0,1)*L;for(let i=0;i<d.length;i++){if(s<=d[i]||i==d.length-1){const v=d[i]?Math.min(1,s/d[i]):0;return [lerp(P[i][0],P[i+1][0],v),lerp(P[i][1],P[i+1][1],v)];}s-=d[i];}return P[0];}
/* punto su un percorso a nodi temporali [[u,[x,y]],...] */
function onPath(K,u){for(let i=1;i<K.length;i++)if(u<=K[i][0]){const a=K[i-1],b=K[i],v=(u-a[0])/((b[0]-a[0])||1);return [lerp(a[1][0],b[1][0],v),lerp(a[1][1],b[1][1],v)];}return K[K.length-1][1];}
/* importina: mezzaluna */
function importina(g,x,y,col,r){r=r||10;g.strokeStyle=col;g.lineWidth=5;g.lineCap="round";g.beginPath();g.arc(x,y,r,.6,2*Math.PI-.6);g.stroke();g.lineCap="butt";}
function ranDot(g,x,y,gtp){circ(g,x,y,7,gtp?C.soon:A_(C.soon,.35),C.soon,1.5);txt(g,gtp?"T":"D",x,y+.5,gtp?C.card:C.ink,9,"center",true);}
/* catena a zig-zag (acido grasso) */
function zz(g,x,y,n,col,ang){ang=ang||0;const c=Math.cos(ang),s=Math.sin(ang);g.strokeStyle=col;g.lineWidth=2;g.beginPath();for(let i=0;i<=n;i++){const a=i*5,b=(i%2?3:-3);const X=x+a*c-b*s,Y=y+a*s+b*c;i?g.lineTo(X,Y):g.moveTo(X,Y);}g.stroke();}
/* molla (talina) */
function spring(g,x1,y1,x2,y2,amp,col,n){n=n||8;const dx=x2-x1,dy=y2-y1,L=Math.hypot(dx,dy)||1,nx=-dy/L,ny=dx/L;g.strokeStyle=col;g.lineWidth=2.5;g.beginPath();g.moveTo(x1,y1);for(let i=1;i<n;i++){const u=i/n,s=(i%2?1:-1)*amp;g.lineTo(x1+dx*u+nx*s,y1+dy*u+ny*s);}g.lineTo(x2,y2);g.stroke();}
function darrow(g,x1,y1,x2,y2,col){line(g,x1,y1,x2,y2,col,1.5,[5,5]);const a=Math.atan2(y2-y1,x2-x1);arrow(g,x2-Math.cos(a)*10,y2-Math.sin(a)*10,x2,y2,col,1.5);}
const bt=id=>(typeof BIO_TOPICS!=="undefined"&&BIO_TOPICS.find(t=>t.id===id))||{};

Object.assign(AN,{
/* ---------- b5b: trasporto nucleare e ciclo di Ran ---------- */
nucleoRan:{h:300,c:[{k:"nls",l:"Proteina carico",seg:["Con NLS","Senza NLS"],v:0},{k:"gef",l:"RanGEF (RCC1) nel nucleo",seg:["Attivo","Inattivo"],v:0}],
 init(st,p){p=p||{};st.nIn=0;st.prev=[0,.333,.667];st.c=[p.nls?0:1,p.nls?0:1,0];},
 f(g,p,st,dt,W,H){if(!st.prev)this.init(st,p);const sm=W<480,fs=sm?10:12,N=12,K=3,T=5.6,ex=W*.5,py=H*.5,gap=22;
  rr(g,ex,0,W-ex,H,0,A_(C.fam,.08));
  txt(g,"CITOSOL",10,14,C.muted,fs,"left",true);txt(g,"NUCLEO",W-10,14,C.fam,fs,"right",true);
  [ex-6,ex+6].forEach(x=>{line(g,x,0,x,py-gap,C.fam,3);line(g,x,py+gap,x,H,C.fam,3);});
  rr(g,ex-11,py-gap-6,22,10,4,C.fam);rr(g,ex-11,py+gap-4,22,10,4,C.fam);
  for(let i=0;i<4;i++){g.strokeStyle=A_(C.fam,.55);g.lineWidth=1.3;g.beginPath();const y0=py-gap+4+i*(2*gap-8)/3;for(let x=-10;x<=10;x+=2){const yy=y0+2.2*Math.sin(x*.9+st.t*3+i);x>-10?g.lineTo(ex+x,yy):g.moveTo(ex+x,yy);}g.stroke();}
  txt(g,"poro (nucleoporine FG)",ex,py-gap-16,C.fam,fs-1,"center",true);
  /* cromatina con RanGEF */
  const chx=ex+(W-ex)*.62,chy=H*.86;g.strokeStyle=A_(C.fam,.7);g.lineWidth=3;g.beginPath();for(let x=-40;x<=40;x+=3){const yy=chy+6*Math.sin(x*.35)+3*Math.cos(x*.9);x>-40?g.lineTo(chx+x,yy):g.moveTo(chx+x,yy);}g.stroke();
  txt(g,p.gef?"RanGEF inattivo":"RanGEF sulla cromatina",chx,chy-16,p.gef?C.warn:C.fam,fs-1,"center",true);
  /* Ran di fondo */
  for(let i=0;i<5;i++){ranDot(g,ex+16+rnd(i+40)*(W-ex-34),26+rnd(i+50)*(H*.62-26)+3*Math.sin(st.t*1.3+i),!p.gef);}
  for(let i=0;i<4;i++){ranDot(g,14+rnd(i+60)*(ex-40),H*.08+rnd(i+70)*H*.2+3*Math.sin(st.t+i),false);}
  txt(g,"RanGAP",ex-(sm?W*.3:W*.28),H*.72+22,C.soon,fs-1,"center",true);
  /* percorso dei trasportatori */
  const P0=[ex-W*.3,H*.3],P1=[ex-24,py-6],P2=[ex+24,py-6],P3=[ex+W*.27,H*.3],P4=[ex+W*.24,H*.66],P5=[ex+24,py+6],P6=[ex-24,py+6],P7=[ex-W*.28,H*.72];
  const KN=[[0,P0],[.18,P1],[.26,P2],[.38,P3],[.44,P3],[.56,P4],[.66,P5],[.74,P6],[.86,P7],[.9,P7],[1,P0]];
  let carried=0;
  for(let k=0;k<K;k++){const u=((st.t/T)+k/K)%1,pv=st.prev[k];
   if(u<pv){const av=N-st.nIn-st.c.reduce((a,b,j)=>a+(j!==k?b:0),0);st.c[k]=(p.nls==0&&av>0)?1:0;}
   if(pv<.41&&u>=.41&&st.c[k]&&p.gef==0){st.nIn=Math.min(N,st.nIn+1);st.c[k]=0;}
   st.prev[k]=u;carried+=st.c[k];}
  /* carichi fermi */
  const nCyt=N-st.nIn-carried;
  for(let i=0;i<nCyt;i++){const x=14+rnd(i+1)*(ex-50),y=H*.36+rnd(i+20)*(H*.5)+2*Math.sin(st.t*1.7+i);circ(g,x,y,6,C.ok);if(p.nls==0)rr(g,x+4,y-2,7,4,1,C.warn);}
  for(let i=0;i<st.nIn;i++){const x=ex+18+rnd(i+80)*(W-ex-40),y=H*.32+rnd(i+90)*(H*.38)+2*Math.sin(st.t*1.5+i);circ(g,x,y,6,C.ok);rr(g,x+4,y-2,7,4,1,C.warn);}
  for(let k=0;k<K;k++){const u=((st.t/T)+k/K)%1,[x,y]=onPath(KN,u);
   if(st.c[k]){circ(g,x+9,y,6,C.ok);rr(g,x+3,y-2,6,4,1,C.warn);}
   importina(g,x,y,C.acc,9);
   if(p.gef==0&&u>=.41&&u<.88)ranDot(g,x-13,y-8,true);
   if(u>=.86&&u<.97){const v=(u-.86)/.11;ranDot(g,x-13-v*30,y-8+v*10,false);if(u<.92)txt(g,"GTP → GDP",x,y-22,C.soon,fs-1,"center",true);}
   if(p.gef==0&&st.c[k]==0&&u>=.38&&u<.46&&p.nls==0)txt(g,"rilascio",x,y-18,C.ok,fs-1,"center",true);}
  if(p.nls==1)return `Senza NLS l'importina (blu) non riconosce il carico (verde): una proteina grande (oltre ~40 kDa) non attraversa da sola il poro e resta nel citosol (<b>0/${N}</b> nel nucleo). Le importine girano a vuoto. Le molecole piccole, invece, diffondono liberamente attraverso il poro.`;
  if(p.gef==1)return `Senza RanGEF nel nucleo non si forma Ran-GTP (T): il gradiente Ran-GTP nucleo / Ran-GDP citosol scompare. L'importina entra con il carico ma non lo rilascia e lo riporta fuori: nel nucleo <b>${st.nIn}/${N}</b>. È il gradiente di Ran a dare la direzione al trasporto.`;
  return `L'importina (blu) lega l'NLS (rosso) del carico nel citosol e attraversa il poro tra le nucleoporine FG. Nel nucleo Ran-GTP (prodotta da RanGEF sulla cromatina) si lega all'importina e libera il carico; nel citosol RanGAP fa idrolizzare il GTP, Ran-GDP si stacca e l'importina riparte. Carico nel nucleo: <b>${st.nIn}/${N}</b>.`;}},

/* ---------- b5c: catena respiratoria e ATP sintasi ---------- */
catenaResp:{h:310,c:[{k:"o2",l:"Ossigeno",seg:["O₂ presente","Senza O₂ (o cianuro)"],v:0},{k:"u",l:"Disaccoppiante (DNP, UCP1)",min:0,max:100,st:10,v:0,u:" %"}],
 f(g,p,st,dt,W,H){const sm=W<480,fs=sm?10:12,ym=H*.4,mh=26,on=p.o2==0,u=p.u/100,sp=on?1+u*1.2:0;
  st.rot=(st.rot||0)+dt*(on?(1-u)*4:0);st.tt=(st.tt||0)+dt*sp;const tt=st.tt;
  rr(g,0,0,W,ym-mh/2,0,A_(C.warn,.05));
  txt(g,"spazio intermembrana",8,12,C.muted,fs,"left",true);txt(g,"matrice",8,ym+mh/2+12,C.muted,fs,"left",true);
  rr(g,0,ym-mh/2,W,mh,0,A_(C.soon,.22));for(let x=5;x<W;x+=10){circ(g,x,ym-mh/2+3,2.6,A_(C.soon,.7));circ(g,x,ym+mh/2-3,2.6,A_(C.soon,.7));}
  const X=[.1,.27,.44,.62,.86].map(v=>v*W),cw=Math.min(46,W*.11);
  /* H+ nello spazio intermembrana: il gradiente */
  const nH=on?Math.round(14*(1-.6*u)):3;for(let i=0;i<nH;i++){const x=12+rnd(i+3)*(W*.78-24),y=26+rnd(i+13)*(ym-mh/2-66)+3*Math.sin(st.t*2+i);txt(g,"H⁺",x,y,A_(C.warn,.75),fs,"center",true);}
  for(let i=0;i<3;i++){txt(g,"H⁺",W*.18+rnd(i+33)*W*.6,ym+mh/2+28+rnd(i+43)*40,A_(C.warn,.45),fs,"center",true);}
  /* complessi */
  [[0,"I"],[2,"III"],[3,"IV"]].forEach(([i,n])=>{rr(g,X[i]-cw/2,ym-34,cw,68,8,A_(C.acc,.3),C.acc);txt(g,n,X[i],ym-23,C.ink,12,"center",true);});
  rr(g,X[1]-cw*.4,ym-12,cw*.8,40,8,A_(C.ben,.3),C.ben);txt(g,"II",X[1],ym+19,C.ink,11,"center",true);
  /* ATP sintasi */
  rr(g,X[4]-cw/2,ym-mh/2-4,cw,mh+8,6,A_(C.ok,.35),C.ok);line(g,X[4],ym+mh/2+4,X[4],ym+36,C.ok,4);
  const fr=cw*.42;circ(g,X[4],ym+36+fr,fr,A_(C.ok,.25),C.ok,2);for(let k=0;k<3;k++){const a=st.rot+k*2.094;line(g,X[4],ym+36+fr,X[4]+Math.cos(a)*fr*.85,ym+36+fr+Math.sin(a)*fr*.85,C.ok,3);}
  txt(g,"ATP sintasi",X[4],ym-62,C.ok,fs,"center",true);
  /* elettroni: NADH -> I -> Q -> III -> c -> IV -> O2 */
  const E=[[X[0],ym+60],[X[0],ym],[X[2],ym],[X[2],ym-30],[X[3],ym-30],[X[3],ym],[X[3],ym+60]];
  txt(g,"NADH → NAD⁺",X[0],ym+72,C.ink,fs,"center",true);txt(g,"½O₂ → H₂O",X[3],ym+72,on?C.ink:C.warn,fs,"center",true);txt(g,"FADH₂",X[1],ym+40,C.ink,fs,"center",true);
  if(!on){line(g,X[3]-14,ym+62,X[3]+14,ym+82,C.warn,2.5);line(g,X[3]+14,ym+62,X[3]-14,ym+82,C.warn,2.5);}
  const qx=on?lerp(X[0]+cw/2+6,X[2]-cw/2-6,.5+.5*Math.sin(tt*2.2)):X[2]-cw/2-8;circ(g,qx,ym,7,C.soon);txt(g,"Q",qx,ym,C.card,9,"center",true);
  const cx=on?lerp(X[2]+cw/2+4,X[3]-cw/2-4,.5+.5*Math.sin(tt*2.6+1)):X[3]-cw/2-8;circ(g,cx,ym-mh/2-9,7,C.lp);txt(g,"c",cx,ym-mh/2-9,C.card,10,"center",true);
  for(let j=0;j<7;j++){const v=on?(tt*.22+j/7)%1:[.16,.3,.4,.5,.6,.68,.74][j];const [x,y]=along(E,v);circ(g,x,y,4,C.u5);}
  const E2=[[X[1],ym+30],[X[1],ym],[X[2],ym]];if(on)for(let j=0;j<2;j++){const [x,y]=along(E2,(tt*.3+j/2)%1);circ(g,x,y,4,C.u5);}
  /* pompaggio di H+ */
  if(on)[[0,4],[2,4],[3,2]].forEach(([i,n])=>{for(let j=0;j<Math.min(n,3);j++){const v=(tt*.45+j/3+i*.1)%1;txt(g,"H⁺",X[i]+cw/2+9,lerp(ym+30,ym-58,v),C.warn,fs,"center",true);}
   arrow(g,X[i]-cw/2-5,ym+24,X[i]-cw/2-5,ym-46,A_(C.warn,.55),2);txt(g,String(n),X[i]-cw/2-13,ym-42,C.warn,fs,"center",true);});
  /* ritorno di H+ dall'ATP sintasi e ATP */
  if(on&&u<1){const rt=st.t*(1-u)*.5;for(let j=0;j<3;j++){const v=(rt+j/3)%1;txt(g,"H⁺",X[4]-cw/2-9,lerp(ym-46,ym+24,v),C.warn,fs,"center",true);}
   for(let j=0;j<2;j++){const v=(rt*.7+j/2)%1;pill(g,"ATP",X[4]+lerp(0,sm?-14:-30,v),ym+36+2*fr+8+v*36,C.ok,fs-1,.3*(1-v)+.1);}}
  /* disaccoppiante */
  if(on&&u>0){const xl=(X[3]+X[4])/2;const n=Math.max(1,Math.round(u*4));for(let j=0;j<n;j++){const v=(st.t*.6+j/n)%1,x=xl+(j-(n-1)/2)*12;txt(g,"H⁺",x,lerp(ym-40,ym+30,v),C.warn,fs,"center",true);}
   g.strokeStyle=A_(C.warn,.6);g.lineWidth=2;for(let j=0;j<3;j++){g.beginPath();for(let y=0;y<26;y+=2){const xx=xl-10+j*10+3*Math.sin(y*.5+st.t*5);y?g.lineTo(xx,ym+50+y):g.moveTo(xx,ym+50);}g.stroke();}
   txt(g,"calore",xl,ym+86,C.warn,fs,"center",true);}
  /* bilancio */
  const atp=on?Math.round(4+28*(1-u)):2,heat=on?28*u:0,bw=W-16,by=H-20;
  txt(g,`ATP per glucosio ≈ ${atp}`+(heat>0?` · ${F2(heat/32*100,0)}% dell'energia → calore`:""),8,by-16,C.ink,fs+1,"left",true);
  rr(g,8,by-6,bw,12,6,A_(C.muted,.18));rr(g,8,by-6,bw*atp/32,12,6,C.ok);if(heat>0)rr(g,8+bw*atp/32,by-6,bw*heat/32,12,6,A_(C.warn,.7));
  if(!on)return `Senza O₂ (o con il cianuro, che blocca il complesso IV) gli elettroni non hanno l'accettore finale: i trasportatori restano ridotti, il pompaggio si ferma e il gradiente si dissipa. Il NADH non viene riossidato, quindi si ferma anche il ciclo di Krebs: resta solo la glicolisi con fermentazione lattica, <b>2 ATP per glucosio</b>.`;
  if(u>0)return `Il disaccoppiante riporta nella matrice il <b>${p.u}%</b> degli H⁺ senza passare dall'ATP sintasi: la catena corre anche più veloce (consumo di O₂ alto), ma l'energia del gradiente diventa calore (UCP1 / termogenina nel grasso bruno; il DNP è tossico). ATP per glucosio ≈ <b>${atp}</b> invece di 32.`;
  return `Gli elettroni (arancio) del NADH passano I → Q → III → citocromo c → IV → O₂, che diventa H₂O. L'energia pompa H⁺ nello spazio intermembrana (I: 4, III: 4, IV: 2 per NADH; il complesso II del FADH₂ non pompa). Gli H⁺ rientrano dall'ATP sintasi, che ruota: ≈ 2,5 ATP per NADH e 1,5 per FADH₂. Bilancio: <b>≈ 32 ATP per glucosio</b> (30 con la navetta del glicerolo-fosfato).`;}},

/* ---------- b5d: perossisomi, PTS1 e Zellweger ---------- */
perossisoma:{h:310,c:[{k:"z",l:"Cellula",seg:["Normale","Zellweger (PEX mutato)"],v:0},{k:"vl",l:"Acidi grassi a catena molto lunga in arrivo",min:1,max:10,st:1,v:4}],
 init(st){st.acc=4;},
 f(g,p,st,dt,W,H){const sm=W<480,fs=sm?10:12,zel=p.z==1,R=Math.min(H*.3,W*.2),px=W*.6,py=H*.44;if(st.acc==null)st.acc=4;
  st.acc=zel?Math.min(100,st.acc+dt*p.vl*.9):Math.max(4,st.acc-dt*25);
  txt(g,"citosol",8,12,C.muted,fs,"left",true);
  /* perossisoma */
  if(zel){g.setLineDash([6,5]);circ(g,px,py,R,A_(C.ben,.04),A_(C.ben,.6),2.5);g.setLineDash([]);ftxt(g,"«fantasma» vuoto",px,py,C.muted,R*1.8,fs,"center",true);}
  else{circ(g,px,py,R,A_(C.ben,.12),C.ben,3);
   /* nucleo cristallino di catalasi */
   const kx=px-R*.15,ky=py+R*.32;for(let i=0;i<4;i++)rr(g,kx-12+(i%2)*13,ky-12+(i>>1)*13,11,11,3,C.ben);txt(g,"catalasi",kx+1,ky+22,C.ben,fs-1,"center",true);
   circ(g,px+R*.35,py-R*.32,8,A_(C.soon,.5),C.soon,1.5);txt(g,"acil-CoA ossidasi",px+R*.35,py-R*.32+16,C.soon,fs-1,"center",true);txt(g,"β-ossidazione",px-R*.1,py-R*.62,C.soon,fs-1,"center",true);}
  txt(g,"perossisoma",px,py-R-10,C.ben,fs,"center",true);
  /* attracco PEX14 */
  const dx=px-R,dy=py;rr(g,dx-5,dy-8,10,16,3,C.fam);txt(g,"PEX14",dx-6,dy+20,C.fam,fs-1,"right",true);
  /* ribosoma libero che produce la catalasi con PTS1 */
  const rx=W*.1,ry=H*.22;line(g,rx-28,ry+9,rx+32,ry+9,C.muted,2);circ(g,rx,ry,11,A_(C.fam,.45),C.fam,1.5);circ(g,rx,ry+9,6,A_(C.fam,.45),C.fam,1.5);txt(g,"ribosoma libero",rx-20,ry-20,C.muted,fs-1,"left",true);
  const T=3.2,u=(st.t/T)%1;
  const K=zel?[[0,[rx+14,ry+16]],[.45,[dx-26,dy]],[.6,[dx-14,dy]],[.8,[dx-40,dy+30]],[1,[dx-60,dy+46]]]:[[0,[rx+14,ry+16]],[.45,[dx-26,dy]],[.55,[dx-14,dy]],[.75,[dx+18,dy]],[1,[px-R*.15,py+R*.3]]];
  const [qx,qy]=onPath(K,u);const fade=zel?1:(u>.9?(1-u)*10:1);
  g.globalAlpha=fade;rr(g,qx-6,qy-6,12,12,3,C.ben);rr(g,qx+6,qy-2,9,4,1,C.warn);if(u<.45)txt(g,"–SKL",qx+18,qy-10,C.warn,fs-1,"left",true);
  if(u<.6||(zel&&u<.8)){importina(g,qx-10,qy,C.acc,7);if(u<.45)txt(g,"PEX5",qx-10,qy+16,C.acc,fs-1,"center",true);}
  g.globalAlpha=1;
  if(!zel&&u>=.55){const v=(u-.55)/.45;importina(g,lerp(dx-14,dx-60,v),dy-14-v*30,A_(C.acc,.6),7);}
  /* catalasi rimasta nel citosol (Zellweger) */
  if(zel){const n=Math.min(10,Math.floor(st.t/T));for(let i=0;i<n;i++)rr(g,12+rnd(i+5)*(dx-60),H*.38+rnd(i+15)*H*.2,9,9,2,A_(C.ben,.8));if(n)txt(g,"catalasi nel citosol",12,H*.35,C.ben,fs-1,"left",true);}
  /* acidi grassi a catena molto lunga */
  const ea=-.75,exx=px+R*Math.cos(ea),eyy=py+R*Math.sin(ea),nc=Math.ceil(p.vl/2),spd=.1+p.vl*.02;
  txt(g,"VLCFA",W-8,12,C.soon,fs,"right",true);
  let h2=0;
  for(let j=0;j<nc;j++){const v=(st.t*spd+j/nc)%1;
   if(v<.4){const w=v/.4;zz(g,lerp(W-46,exx+6,w),lerp(22+j*8,eyy-6,w),8,C.soon,.6);}
   else if(zel){const w=(v-.4)/.6;zz(g,exx+10+8*Math.sin(st.t*3+j)-w*20,eyy-10-w*10+j*8,8,A_(C.soon,1-w*.6),.6);}
   else{const w=(v-.4)/.6,n=Math.round(lerp(8,3,cl((w-.15)/.4,0,1)));const cx2=lerp(exx-4,px-R*.05,cl(w*2,0,1)),cy2=lerp(eyy+4,py-R*.3,cl(w*2,0,1));zz(g,cx2-12,cy2,n,A_(C.soon,1-cl((w-.75)*4,0,1)),0);
    if(w>.35&&w<.8){h2++;const z=(w-.35)/.45,hx=lerp(px+R*.3,px-R*.12,z),hy=lerp(py-R*.32,py+R*.18,z);circ(g,hx,hy,4.5,C.warn);if(!sm||j==0)txt(g,"H₂O₂",hx+8,hy-8,C.warn,fs-1,"left",true);}
    if(w>=.8&&w<.95){const z=(w-.8)/.15;circ(g,px-R*.15-z*R*.35,py+R*.2-z*R*.2,3,C.acc);circ(g,px-R*.05+z*R*.3,py+R*.15-z*R*.2,3,C.acc);}}}
  if(!zel)txt(g,"2 H₂O₂ → 2 H₂O + O₂",px,py+R+14,C.ink,fs,"center",true);
  /* indicatore */
  const bw=Math.min(W-16,360),by=H-14;txt(g,"VLCFA nel citosol",8,by-14,C.ink,fs,"left",true);rr(g,8,by-5,bw,10,5,A_(C.muted,.18));rr(g,8,by-5,bw*st.acc/100,10,5,zel?C.warn:C.ok);
  if(zel)return `Sindrome di Zellweger: un gene PEX (perossine) è mutato, i perossisomi non si formano (restano «fantasmi» di membrana vuoti). La catalasi con il segnale PTS1 resta nel citosol e le VLCFA non vengono accorciate: si accumulano (indice <b>${F2(st.acc,0)}</b>/100, sale più in fretta con ${p.vl} in arrivo). Mancano anche i plasmalogeni della mielina: grave danno neurologico, epatico e renale già nel neonato.`;
  return `La catalasi nasce su ribosomi liberi con il segnale <b>PTS1</b> (–Ser-Lys-Leu, SKL) all'estremità C: il recettore PEX5 la riconosce e la porta, già ripiegata, dentro il perossisoma (attracco su PEX14), poi torna nel citosol. Dentro, la β-ossidazione degli acidi grassi a catena molto lunga (${p.vl} in arrivo) produce H₂O₂ (<b>${h2}</b> in questo istante), che la catalasi smonta subito in H₂O e O₂.`;}},

/* ---------- b5e: via secretoria, SRP, calnexina, ERAD ---------- */
secretoriaER:{h:330,c:[{k:"m",l:"Proteina",seg:["Ripiegata bene","Mal ripiegata (CFTR ΔF508)","Senza sequenza segnale"],v:0}],
 f(g,p,st,dt,W,H){const sm=W<480,fs=sm?10:12,ym=H*.42,mh=16,xT=W*.17,xC=W*.47,xG=W*.72,xD=W*.9;
  const S0=[[2,"Ribosoma libero: esce la sequenza segnale","La sequenza segnale è un tratto N-terminale idrofobico (rosso)."],[1.8,"SRP lega la sequenza segnale","La particella di riconoscimento del segnale (SRP) ferma la traduzione."],[2,"Attracco al recettore di SRP","SRP (con GTP) si aggancia al suo recettore e passa il ribosoma al traslocone Sec61, poi si stacca."],[2.4,"Traslocazione cotraduzionale","La catena cresce passando dal traslocone dentro il lume del RE."],[2.2,"Peptidasi del segnale e N-glicosilazione","Il segnale viene tagliato; l'oligosaccaride-transferasi aggiunge Glc₃Man₉GlcNAc₂ a un'asparagina."],[1.8,"Glucosidasi I e II","Tolgono due glucosi: resta un solo glucosio."],[2.4,"Calnexina","La lectina calnexina lega la glicoproteina monoglucosilata e la aiuta a ripiegarsi."]];
  const SG=S0.concat([[1.8,"Ripiegata: l'ultimo glucosio va via","La glucosidasi II toglie l'ultimo glucosio: la proteina, corretta, si stacca dalla calnexina."],[2.6,"Uscita in vescicola COPII","Lascia il RE verso il cis-Golgi, poi Golgi e trans-Golgi: secrezione costitutiva o regolata."],[1.2,"…","Il ciclo ricomincia con una nuova proteina."]]);
  const SB=S0.concat([[1.6,"Glucosio tolto, ma ancora mal ripiegata","La glucosidasi II toglie l'ultimo glucosio anche se il ripiegamento non è riuscito."],[1.6,"UGGT riaggiunge un glucosio","L'enzima UGGT riconosce le proteine non native e le rimanda alla calnexina."],[2,"Nuovo ciclo sulla calnexina","Altro tentativo di ripiegamento (ciclo calnexina/calreticulina)."],[1.6,"Mannosidasi: «tempo scaduto»","Dopo troppi cicli una mannosidasi accorcia l'oligosaccaride: segnale di degradazione."],[2.2,"ERAD: retrotraslocazione","La proteina viene riportata nel citosol attraverso un canale (Hrd1)."],[1.8,"Ubiquitinazione","Le ligasi E3 aggiungono una catena di ubiquitina."],[2.2,"Proteasoma","Il proteasoma 26S la degrada. Se ne accumulano troppe si attiva la risposta UPR."],[1.2,"…","Il ciclo ricomincia."]]);
  const SN=[[2,"Ribosoma libero","Questa proteina non ha la sequenza segnale per il RE."],[3,"Traduzione nel citosol","SRP non la riconosce: il ribosoma resta libero e completa la catena nel citosol."],[2.4,"Ripiegamento con Hsp70","Le chaperon citosoliche (Hsp70) la aiutano a ripiegarsi."],[2.4,"Resta nel citosol","Oppure va a nucleo, mitocondri o perossisomi, se ha i segnali giusti."]];
  const SS=[SG,SB,SN][p.m],tot=SS.reduce((a,b)=>a+b[0],0);let tt=st.t%tot,s=0;while(s<SS.length-1&&tt>=SS[s][0]){tt-=SS[s][0];s++;}const u=tt/SS[s][0];
  /* ambienti */
  rr(g,0,ym+mh/2,W,H-ym-mh/2,0,A_(C.ben,.08));txt(g,"citosol",8,12,C.muted,fs,"left",true);txt(g,"lume del RE",8,H-12,C.ben,fs,"left",true);
  rr(g,0,ym-mh/2,W,mh,0,A_(C.soon,.22));line(g,0,ym-mh/2,W,ym-mh/2,A_(C.soon,.8),2);line(g,0,ym+mh/2,W,ym+mh/2,A_(C.soon,.8),2);
  rr(g,xT-15,ym-mh/2-3,10,mh+6,3,C.fam);rr(g,xT+5,ym-mh/2-3,10,mh+6,3,C.fam);if(!sm)txt(g,"Sec61",xT+19,ym+mh/2+10,C.fam,fs-1,"left",true);
  rr(g,xT-34,ym-mh/2-8,14,8,3,A_(C.soon,.7));
  /* calnexina */
  line(g,xC,ym-mh/2,xC,ym+30,C.ben,4);circ(g,xC,ym+40,11,A_(C.ben,.35),C.ben,2);txt(g,"calnexina",xC,ym+62+(sm?0:0),C.ben,fs-1,"center",true);
  /* canale ERAD e proteasoma */
  rr(g,xD-6,ym-mh/2-3,12,mh+6,3,A_(C.warn,.5),C.warn);if(!sm)txt(g,"Hrd1",xD-10,ym+mh/2+10,C.warn,fs-1,"right",true);
  const pzx=xD,pzy=ym-72;rr(g,pzx-12,pzy-22,24,44,6,A_(C.muted,.25),C.muted);for(let i=1;i<4;i++)line(g,pzx-12,pzy-22+i*11,pzx+12,pzy-22+i*11,C.muted,1);txt(g,"proteasoma",pzx,pzy-32,C.muted,fs-1,"center",true);
  txt(g,"→ Golgi",xG,14,C.ok,fs,"center",true);
  /* disegno proteina */
  const prot=(x,y,fold,glc,man,alpha)=>{g.globalAlpha=alpha==null?1:alpha;
   if(fold>.85)circ(g,x,y,13,A_(C.acc,.55),C.acc,2);else{const a=(1-fold)*9,L=16+(1-fold)*30;g.strokeStyle=C.acc;g.lineWidth=4;g.beginPath();for(let i=0;i<=12;i++){const xx=x-L/2+L*i/12,yy=y+a*Math.sin(i*1.3+st.t*2);i?g.lineTo(xx,yy):g.moveTo(xx,yy);}g.stroke();}
   if(glc!=null){const gx=x+2,gy=y+14;line(g,gx,y+3,gx,gy+6,C.ok,2);[[0,0],[-6,7],[6,7]].slice(0,man).forEach(([a,b])=>circ(g,gx+a,gy+6+b,4,C.ok));for(let i=0;i<glc;i++)rr(g,gx-11+i*8,gy+19,6,6,1,C.soon);}
   g.globalAlpha=1;};
  const ribo=(x,y)=>{line(g,x-34,y-10,x+34,y-10,C.muted,2);rr(g,x-16,y-20,32,16,8,A_(C.fam,.45),C.fam);rr(g,x-20,y-6,40,20,9,A_(C.fam,.45),C.fam);};
  const nascent=(x,y,L,col)=>{g.strokeStyle=col;g.lineWidth=3;g.beginPath();g.moveTo(x,y);for(let i=1;i<=8;i++)g.lineTo(x+3*Math.sin(i*1.4+st.t*3),y+L*i/8);g.stroke();};
  let lab=SS[s][1],expl=SS[s][2];
  if(p.m==2){const rx=W*.42,ry=ym-62;ribo(rx,ry);
   if(s==0)line(g,rx,ry+14,rx,ry+14+8*u,C.acc,3);
   if(s==1){g.strokeStyle=C.acc;g.lineWidth=3;g.beginPath();g.moveTo(rx,ry+14);for(let i=1;i<=10;i++)g.lineTo(rx+18*i/10*u+4*Math.sin(i*1.5+st.t*2),ry+14+8+i*1.5);g.stroke();
    circ(g,rx+70,ry-6,9,A_(C.soon,.5),C.soon,1.5);txt(g,"SRP",rx+70,ry-22,C.soon,fs-1,"center",true);}
   if(s>=2){prot(rx+46,ry+30,s==2?u*.9:1);if(s==2){circ(g,rx+46+14,ry+30-8,8,A_(C.warn,.3),C.warn,1.5);txt(g,"Hsp70",rx+46+28,ry+30-14,C.warn,fs-1,"left",true);}}
   txt(g,"(nessun contatto con il RE)",xT+60,ym+34,C.muted,fs-1,"left");}
  else{let rx=xT,ry=ym-62,rAl=1;if(s==0||s==1){rx=xT-W*.05;}if(s==2){rx=lerp(xT-W*.05,xT,u);ry=lerp(ym-62,ym-mh/2-14,u);}if(s>=3){ry=ym-mh/2-14;}if(s==4)rAl=1-u;
   if(s<=4){g.globalAlpha=rAl;ribo(rx,ry);g.globalAlpha=1;}
   if(s==0)line(g,rx,ry+14,rx,ry+14+10*u,C.warn,4);
   if(s==1||s==2){line(g,rx,ry+14,rx,ry+24,C.warn,4);const sx=s==1?rx+lerp(40,16,u):rx+16+(u>.6?(u-.6)*80:0),sy=s==1?ry+18:ry+18-(u>.6?(u-.6)*60:0);circ(g,sx,sy,10,A_(C.soon,.55),C.soon,1.5);txt(g,"SRP",sx,sy,C.ink,9,"center",true);
    if(s==1)txt(g,"traduzione in pausa",rx+30,ry-30,C.soon,fs-1,"left",true);if(s==2&&u<.6)txt(g,"recettore di SRP",xT-34,ym-mh/2-20,C.soon,fs-1,"center",true);}
   if(s==3){line(g,xT,ym-mh/2-2,xT,ym+2,C.warn,4);nascent(xT,ym+mh/2,10+60*u,C.acc);}
   if(s==4){line(g,xT-1,ym-mh/2,xT-1,ym+mh/2,C.warn,4);const cut=u>.3;if(!cut)nascent(xT,ym+mh/2,70,C.acc);
    if(u<.5){const k=xT+14,y=ym+mh/2+4;line(g,k-6,y-6,k+6,y+6,C.ink,2);line(g,k-6,y+6,k+6,y-6,C.ink,2);if(!sm)txt(g,"peptidasi del segnale",k+12,y,C.ink,fs-1,"left",true);}
    if(cut)prot(xT+34,ym+50,.1,u>.6?3:null,3);}
   if(s>=5){line(g,xT-1,ym-mh/2,xT-1,ym+mh/2,A_(C.warn,.6),4);}
   const bad=p.m==1;
   if(s==5)prot(xT+34,ym+50,.15,u<.33?3:u<.66?2:1,3);
   if(s==6){const x=lerp(xT+34,xC+20,cl(u*2,0,1));prot(x,ym+52,lerp(.15,bad?.35:.8,u),1,3);}
   if(!bad&&s>=7){if(s==7)prot(lerp(xC+20,xC+44,u),ym+52,lerp(.8,1,u),0,3);
    if(s==8){if(u<.4){const x=lerp(xC+44,xG,u/.4);prot(x,lerp(ym+52,ym+28,u/.4),1,0,3);}else{const v=(u-.4)/.6,vy=lerp(ym+20,30,v);circ(g,xG,vy,18,A_(C.ok,.12),C.ok,2);g.setLineDash([3,3]);circ(g,xG,vy,22,null,A_(C.ok,.7),2);g.setLineDash([]);prot(xG,vy-4,1,0,3,1);if(v<.5)txt(g,"COPII",xG+28,vy,C.ok,fs-1,"left",true);}}}
   if(bad&&s>=7){const cyc=s<9?1:2;
    if(s==7)prot(lerp(xC+20,xC+44,u),ym+52,.35,0,3);
    if(s==8){prot(xC+44,ym+52,.35,u>.4?1:0,3);txt(g,"UGGT",xC+44,ym+86,C.soon,fs-1,"center",true);}
    if(s==9)prot(lerp(xC+44,xC+20,u),ym+52,.35+.1*Math.sin(st.t*3),1,3);
    if(s==10){prot(xC+28,ym+52,.35,0,u>.4?2:3);txt(g,"mannosidasi",xC+28,ym+86,C.warn,fs-1,"center",true);}
    if(s==11){const v=u;const x=lerp(xC+28,xD,cl(v*1.6,0,1)),y=v<.6?ym+52-v*40:lerp(ym+28,ym-40,(v-.6)/.4);prot(x,y,.35,v<.6?0:null,2);}
    if(s==12){prot(xD-30,ym-40,.3);for(let i=0;i<Math.ceil(u*4);i++)circ(g,xD-30+10+i*7,ym-40-8-i*5,3.5,C.u5);txt(g,"ubiquitina",xD-30,ym-74+(sm?0:0),C.u5,fs-1,"center",true);}
    if(s==13){const v=u;if(v<.5){prot(lerp(xD-30,pzx,v*2),lerp(ym-40,pzy+20,v*2),.3);}else{for(let i=0;i<5;i++)circ(g,pzx+(i-2)*6,pzy-22-(v-.5)*40-rnd(i)*10,2.5,C.acc);}}
    if(s>=7&&s<=13)txt(g,"cicli calnexina: "+cyc,xC,ym+100,C.muted,fs-1,"center",true);}}
  ftxt(g,(s+1)+". "+lab,W-8,H-12,C.ink,W*.62,fs+1,"right",true);
  if(!sm&&p.m!=2&&s>=4){circ(g,W*.36,H-36,4,C.ok);txt(g,"mannosio",W*.36+8,H-36,C.muted,fs-1);rr(g,W*.36+70,H-39,6,6,1,C.soon);txt(g,"glucosio",W*.36+80,H-36,C.muted,fs-1);}
  return `<b>${lab}</b> — ${expl}${p.m==1?" Nella fibrosi cistica la CFTR ΔF508 sarebbe in parte funzionante, ma il controllo di qualità del RE la trattiene e la manda all'ERAD: non arriva alla membrana.":""}`;}},

/* ---------- b5f: endocitosi mediata da recettori delle LDL ---------- */
endocitosiLDL:{h:330,c:[{k:"r",l:"Recettore delle LDL",seg:["Normale","Non lega le LDL","Lega ma non entra (coda NPxY)"],v:0}],
 f(g,p,st,dt,W,H){const sm=W<480,fs=sm?10:12,ym=H*.24,xP=W*.2,xR=W*.68,E=[W*.44,H*.56],Ly=[W*.17,H*.8],T=7,u=(st.t/T)%1,cyc=Math.floor(st.t/T),rv=17;
  rr(g,0,0,W,ym-5,0,A_(C.warn,.05));txt(g,"sangue",8,12,C.muted,fs,"left",true);txt(g,"citosol",8,ym+16,C.muted,fs,"left",true);
  /* membrana con fossetta */
  const d=u<.22?u/.22:(u<.3?1:0);const pitD=d*(rv*2+6);
  g.strokeStyle=A_(C.soon,.9);g.lineWidth=5;g.beginPath();g.moveTo(0,ym);g.lineTo(xP-rv-8,ym);if(pitD>2){g.bezierCurveTo(xP-rv-2,ym,xP-rv-2,ym+pitD,xP,ym+pitD);g.bezierCurveTo(xP+rv+2,ym+pitD,xP+rv+2,ym,xP+rv+8,ym);}else g.lineTo(xP+rv+8,ym);g.lineTo(W,ym);g.stroke();
  if(pitD>2){for(let i=0;i<7;i++){const a=Math.PI*(.15+.7*i/6);const x=xP-Math.cos(a)*(rv+3),y=ym+Math.sin(a)*pitD*.95+3;txt(g,"▾",x,y+4,C.muted,10,"center");}txt(g,"clatrina + AP2",xP+rv+12,ym+pitD*.6+6,C.muted,fs-1,"left",true);}
  /* LDL libere */
  for(let i=0;i<9;i++){const x=W*.05+rnd(i+2)*(W*.9),y=16+rnd(i+9)*(ym-34)+3*Math.sin(st.t*1.2+i);circ(g,x,y,7,A_(C.soon,.7),C.soon,1.5);}
  const ldl=(x,y,a)=>{g.globalAlpha=a==null?1:a;circ(g,x,y,7,A_(C.soon,.7),C.soon,1.5);g.globalAlpha=1;};
  const rec=(x,y,dn,lab)=>{line(g,x,y,x,y-10*dn,C.acc,3);line(g,x,y-10*dn,x-4,y-15*dn,C.acc,2.5);line(g,x,y-10*dn,x+4,y-15*dn,C.acc,2.5);};
  const binds=p.r!=1,enters=p.r!=2;
  /* posizioni dei 3 recettori-carico lungo il ciclo */
  const off=[-9,0,9];
  if(enters){
   for(let k=0;k<3;k++){let x,y,ang=1,carry=binds;const o=off[k];
    if(u<.22){x=xP+o;y=ym+pitD*(1-Math.abs(o)/24)-2;}
    else if(u<.45){const v=u<.3?0:(u-.3)/.15;const cx=lerp(xP,E[0],v),cy=lerp(ym+rv+8,E[1],v);x=cx+o;y=cy+rv-4-Math.abs(o)*.4;}
    else if(u<.55){x=E[0]+o*1.8;y=E[1]+20;carry=binds&&u<.5;}
    else if(u<.75){const v=(u-.55)/.2;x=lerp(E[0]+o*.8+30,xR+o,v);y=lerp(E[1]-10,ym+2,v);carry=false;}
    else{const v=(u-.75)/.25;x=lerp(xR+o,xP+o,v);y=ym;carry=false;}
    rec(x,y,1);if(carry&&u<.5)ldl(x,y-21);}
   if(u>=.22&&u<.45){const v=u<.3?0:(u-.3)/.15,cx=lerp(xP,E[0],v),cy=lerp(ym+rv+8,E[1],v);circ(g,cx,cy,rv+4,A_(C.ben,.08),C.ben,2);
    if(u<.36){g.globalAlpha=1-cl((u-.3)/.06,0,1);for(let i=0;i<10;i++){const a=i/10*6.283;txt(g,"▴",cx+Math.cos(a)*(rv+9),cy+Math.sin(a)*(rv+9),C.muted,9,"center");}g.globalAlpha=1;}
    if(u<.3){g.strokeStyle=C.fam;g.lineWidth=4;g.beginPath();g.ellipse(xP,ym+4,8,4,0,0,7);g.stroke();txt(g,"dinamina",xP-14,ym+8,C.fam,fs-1,"right",true);}}
   if(u>=.55&&u<.75){const v=(u-.55)/.2;circ(g,lerp(E[0]+30,xR,v),lerp(E[1]-10,ym+14,v),14,null,A_(C.acc,.6),2);if(binds){const lx=lerp(E[0],Ly[0],v),ly=lerp(E[1]+10,Ly[1],v);circ(g,lx,ly,15,A_(C.lp,.08),C.lp,2);[-6,6,0].forEach((o,i)=>ldl(lx+o,ly+(i==2?-5:4)));}}
   if(u>=.75&&binds){const v=(u-.75)/.25;[-6,6,0].forEach((o,i)=>ldl(Ly[0]+o*(1-v),Ly[1]+(i==2?-5:4)*(1-v),1-v));
    for(let i=0;i<4;i++){const w=cl(v*1.3-i*.1,0,1);if(w>0)circ(g,lerp(Ly[0],Ly[0]+W*.22,w),lerp(Ly[1],Ly[1]-H*.06-i*6,w),3,C.u5);}}}
  else{/* recettori fuori dalle fossette */
   for(let k=0;k<3;k++){const x=W*.5+k*22+6*Math.sin(st.t*.6+k);rec(x,ym,1);ldl(x,ym-21);}
   if(u>=.22&&u<.45){const v=u<.3?0:(u-.3)/.15;circ(g,lerp(xP,E[0],v),lerp(ym+rv+8,E[1],v),rv+4,A_(C.ben,.05),C.ben,2);}}
  /* percorsi */
  const pc=A_(C.muted,.55);darrow(g,xP+6,ym+rv*2+16,E[0]-36,E[1]-12,pc);darrow(g,E[0]+30,E[1]-24,xR-4,ym+16,pc);darrow(g,E[0]-26,E[1]+24,Ly[0]+28,Ly[1]-10,pc);
  txt(g,"riciclo del recettore",(E[0]+xR)/2+14,(E[1]+ym)/2,C.acc,fs-1,"left",true);if(!sm)txt(g,"endosoma tardivo",(E[0]+Ly[0])/2+8,(E[1]+Ly[1])/2+12,C.muted,fs-1,"left",true);
  /* endosoma e lisosoma */
  circ(g,E[0],E[1],30,A_(C.ben,.12),C.ben,2.5);txt(g,"endosoma precoce",E[0],E[1]-40,C.ben,fs-1,"center",true);txt(g,"pH ≈ 6",E[0],E[1],C.ben,fs-1,"center",true);
  circ(g,Ly[0],Ly[1],24,A_(C.lp,.15),C.lp,2.5);txt(g,"lisosoma pH ≈ 5",Ly[0],Ly[1]-34,C.lp,fs-1,"center",true);
  if(enters&&binds&&u>=.75)txt(g,"colesterolo libero → RE: ↓ sintesi (SREBP)",Ly[0]+W*.06,Ly[1]+(sm?36:30),C.u5,fs-1,"left",true);
  const n=enters&&binds?3*cyc+(u>=.3?3:0):0;
  if(p.r==1)return `Recettore che non lega le LDL (ipercolesterolemia familiare): le fossette rivestite si formano e il recettore viene comunque internalizzato e riciclato, ma vuoto. Le LDL restano nel sangue (<b>0</b> entrate), la cellula non riceve colesterolo e aumenta la propria sintesi (HMG-CoA reduttasi): colesterolo plasmatico alto, aterosclerosi precoce.`;
  if(p.r==2)return `Il recettore lega le LDL ma, senza il segnale NPxY nella coda citosolica, non viene agganciato dall'adattatore AP2: resta fuori dalle fossette, che si chiudono vuote. LDL internalizzate: <b>0</b> (il caso del paziente «J.D.» di Brown e Goldstein): anche questa è ipercolesterolemia familiare.`;
  return `Le LDL (apoB-100, gialle) si legano al recettore (blu), che grazie al segnale NPxY si raccoglie nelle fossette di clatrina (adattatore AP2); la dinamina strozza il collo e la vescicola perde il rivestimento. Nell'endosoma precoce il pH ≈ 6 stacca le LDL: il recettore torna in membrana (riciclo), le LDL vanno al lisosoma, dove le idrolasi liberano colesterolo. LDL portate dentro: <b>${n}</b>.`;}},

/* ---------- b5g: instabilità dinamica dei microtubuli ---------- */
microtubuli:{h:330,c:[{k:"c",l:"Tubulina-GTP libera",min:2,max:20,st:1,v:10,u:" µM"},{k:"d",l:"Farmaco",seg:["Nessuno","Taxolo","Colchicina"],v:0}],
 init(st){st.m=[0,1,2,3].map(i=>({L:2+i*2,gr:1}));st.h=[];st.acc=0;st.ncat=0;},
 f(g,p,st,dt,W,H){if(!st.m)this.init(st);const sm=W<480,fs=sm?10:12,ce=p.d==2?p.c*.25:p.c,tax=p.d==1;
  const vg=Math.max(0,.2*(ce-2)),vs=tax?.15:3.2,fcat=tax?0:.06+1.3*Math.exp(-.33*ce),fres=tax?1:.04+.03*ce,Lmax=10;
  st.m.forEach(m=>{if(m.gr){m.L+=vg*dt;if(m.L>=Lmax)m.L=Lmax;if(Math.random()<fcat*dt*(m.L>=Lmax?3:1)){m.gr=0;st.ncat++;}}
   else{m.L-=vs*dt;if(m.L<=0){m.L=0;if(vg>0&&Math.random()<dt*1.2)m.gr=1;}else if(Math.random()<fres*dt)m.gr=1;}});
  st.acc+=dt;while(st.acc>.1){st.acc-=.1;st.h.push(st.m[0].L);if(st.h.length>200)st.h.shift();}
  const ht=H*.6,cx=28,cy=ht*.52,s=(W-cx-26)/Lmax,amax=Math.asin(Math.min(.45,(ht*.42)/(Lmax*s)));
  /* tubulina libera */
  const nd=Math.round(p.c*1.6);for(let i=0;i<nd;i++){const x=40+rnd(i+7)*(W-60),y=10+rnd(i+17)*(ht-20)+3*Math.sin(st.t*1.5+i);circ(g,x-2.5,y,2.6,A_(C.ok,.55));circ(g,x+2.5,y,2.6,A_(C.ok,.8));if(p.d==2&&i%4!=3)circ(g,x+6,y-3,2,C.warn);}
  /* bordo cellula */
  line(g,cx+Lmax*s+6,6,cx+Lmax*s+6,ht-6,C.muted,1.5,[4,4]);if(!sm)txt(g,"bordo della cellula",cx+Lmax*s,ht-2,C.muted,fs-1,"right");
  circ(g,cx,cy,10,A_(C.fam,.35),C.fam,2);txt(g,"−",cx,cy,C.ink,13,"center",true);txt(g,"centrosoma (γTuRC)",6,cy+24,C.fam,fs-1,"left",true);
  let ng=0;
  st.m.forEach((m,i)=>{const a=amax*(i-1.5)/1.5,dx=Math.cos(a),dy=Math.sin(a),x0=cx+dx*10,y0=cy+dy*10,L=m.L*s;if(m.gr)ng++;
   const cap=m.gr&&!tax?Math.min(L,(.3+vg*.35)*s):0;
   line(g,x0,y0,x0+dx*(L-cap),y0+dy*(L-cap),C.acc,6);if(cap>0)line(g,x0+dx*(L-cap),y0+dy*(L-cap),x0+dx*L,y0+dy*L,C.ok,6);
   const tx=x0+dx*L,ty=y0+dy*L;
   if(!m.gr&&L>2){for(const sg of[-1,1]){g.strokeStyle=C.warn;g.lineWidth=2;g.beginPath();g.moveTo(tx,ty);g.quadraticCurveTo(tx+dx*8-dy*sg*2,ty+dy*8+dx*sg*2,tx+dx*9-dy*sg*9,ty+dy*9+dx*sg*9);g.stroke();}}
   txt(g,"+",tx+dx*12,ty+dy*12-1,m.gr?C.ok:C.warn,13,"center",true);});
  /* legenda */
  const lx=sm?W-118:W-250,ly=12;
  if(!sm){rr(g,lx,ly-4,10,8,2,C.ok);txt(g,"cappuccio GTP",lx+14,ly,C.ink,fs-1);rr(g,lx+108,ly-4,10,8,2,C.acc);txt(g,"tubulina-GDP",lx+122,ly,C.ink,fs-1);}
  /* grafico */
  const gx=34,gy=ht+18,gw=W-gx-14,gh=H-gy-22;axes(g,gx,gy,gw,gh,"tempo (ultimi 20 s)","");txt(g,"lunghezza del microtubulo 1",gx+6,gy-6,C.muted,fs-1,"left");
  g.strokeStyle=C.acc;g.lineWidth=2;g.beginPath();st.h.forEach((v,i)=>{const X=gx+i/200*gw,Y=gy+gh-v/Lmax*gh;i?g.lineTo(X,Y):g.moveTo(X,Y);});g.stroke();
  const Lm=st.m.reduce((a,m)=>a+m.L,0)/4;
  const extra=tax?" Il <b>taxolo</b> stabilizza il reticolo di tubulina-GDP: niente catastrofi, microtubuli lunghi e immobili; il fuso mitotico non funziona (chemioterapico).":p.d==2?" La <b>colchicina</b> lega la tubulina libera (puntini rossi) e la sottrae: crescita lenta, catastrofi frequenti, i microtubuli spariscono (blocca la mitosi e la migrazione dei neutrofili: usata nella gotta).":ce<4?" Con poca tubulina libera il cappuccio GTP si perde presto: catastrofi frequenti.":"";
  return `Tubulina-GTP libera ${p.c} µM: in crescita <b>${ng}/4</b> microtubuli, lunghezza media <b>${F2(Lm,1)} µm</b>, catastrofi finora <b>${st.ncat}</b>. All'estremità + i dimeri si aggiungono legati al GTP (cappuccio verde); il GTP del β-tubulina viene poi idrolizzato. Se l'idrolisi raggiunge la punta il cappuccio si perde: <b>catastrofe</b>, i protofilamenti si arricciano e il microtubulo si accorcia in fretta, finché un <b>salvataggio</b> lo fa ricrescere: è l'instabilità dinamica.${extra}`;}},

/* ---------- b6a: integrine, fibronectina e meccanotrasduzione ---------- */
integrineFA:{h:320,c:[{k:"F",l:"Trazione della miosina II",min:0,max:10,st:1,v:6},{k:"m",l:"Matrice",seg:["Rigida (fibronectina)","Morbida","Peptide RGD solubile"],v:0}],
 f(g,p,st,dt,W,H){const sm=W<480,fs=sm?10:12,blk=p.m==2,Tn=blk?0:p.F/10*(p.m==0?1:.35),ym=H*.6,yf=H*.86,ya=H*.36,N=6,ord=[2,3,1,4,0,5];
  const neng=blk?0:Math.max(1,Math.round(1+Tn*5)),eng=i=>ord.indexOf(i)<neng;
  const xs=[...Array(N)].map((_,i)=>W*.07+i*(W*.74)/(N-1));
  /* indicatori */
  const fak=blk?0:Math.min(1,.15+Tn*.85),yap=p.m==0?.1+Tn*.85:p.m==1?.12+Tn*.2:.05;
  const R=[["integrine legate",neng/N,C.acc],["vinculina",Tn,C.soon],["FAK attiva",fak,C.fam],["YAP nel nucleo",yap,C.ok]];const cols=sm?2:4,cw=(W-16)/cols;
  R.forEach(([l,v,c],i)=>{const x=8+(i%cols)*cw,y=12+Math.floor(i/cols)*28;txt(g,l+" "+F2(v*100,0)+"%",x,y,C.ink,fs-1,"left",true);rr(g,x,y+8,cw-14,7,3,A_(C.muted,.2));rr(g,x,y+8,(cw-14)*v,7,3,c);});
  /* matrice */
  rr(g,0,ym+8,W,H-ym-8,0,A_(C.soon,.05));txt(g,"matrice extracellulare",8,H-10,C.muted,fs-1,"left",true);
  const def=p.m==1?Tn*14*(1+.1*Math.sin(st.t*3)):0;
  const fy=x=>{let d=0;xs.forEach((xx,i)=>{if(eng(i))d+=Math.exp(-(((x-xx)/18)**2));});return yf+3*Math.sin(x*.08)-def*Math.min(1,d);};
  g.strokeStyle=C.soon;g.lineWidth=4;g.beginPath();for(let x=0;x<=W;x+=4)x?g.lineTo(x,fy(x)):g.moveTo(x,fy(x));g.stroke();
  for(let x=10;x<W;x+=26)circ(g,x,fy(x)-3,3,C.ok);txt(g,"fibronectina (RGD = punti verdi)",W-8,H-10,C.soon,fs-1,"right",true);
  /* membrana */
  rr(g,0,ym-7,W,14,0,A_(C.soon,.25));line(g,0,ym-7,W,ym-7,A_(C.soon,.8),2);line(g,0,ym+7,W,ym+7,A_(C.soon,.8),2);
  /* actina e flusso retrogrado */
  const clutch=neng/N,vf=blk?70:70*(1-.85*clutch);st.fl=((st.fl||0)+dt*vf)%24;
  for(let x=-24+st.fl%8;x<W*.86;x+=8){const ph=Math.round((x-st.fl%8)/8);circ(g,x,ya+(ph%2?2.5:-2.5),4,C.u5);}
  if(!sm)txt(g,"actina",6,ya-12,C.u5,fs-1,"left",true);
  const mx=W*.9;rr(g,mx-14,ya-7,28,14,7,A_(C.fam,.4),C.fam);arrow(g,mx+16,ya,mx+16+6+p.F*1.6,ya,C.fam,3);txt(g,"miosina II",mx,ya+18,C.fam,fs-1,"center",true);
  /* integrine */
  xs.forEach((x,i)=>{const e=eng(i);
   if(e&&!blk){const yb=fy(x)-4;line(g,x-3,ym-8,x-3,yb,C.acc,3);line(g,x+3,ym-8,x+3,yb,C.fam,3);circ(g,x,yb,4,C.ok);
    const amp=lerp(6,1.2,Tn);spring(g,x,ym-9,x,ya+5,amp,C.ben,8);
    const nv=Math.round(Tn*3);for(let k=0;k<nv;k++)circ(g,x+7,lerp(ym-16,ya+12,(k+1)/(nv+1)),4,C.soon);
    if(i==ord[0]){if(!sm)txt(g,"talina",x-9,(ym+ya)/2,C.ben,fs-1,"right",true);txt(g,"α  β",x,ym+20,C.ink,fs-1,"center",true);}}
   else{g.strokeStyle=C.acc;g.lineWidth=3;g.beginPath();g.moveTo(x-3,ym+7);g.lineTo(x-3,ym+30);g.lineTo(x+6,ym+14);g.stroke();g.strokeStyle=C.fam;g.beginPath();g.moveTo(x+3,ym+7);g.lineTo(x+3,ym+32);g.lineTo(x+12,ym+17);g.stroke();
    if(blk){circ(g,x+11,ym+13,4,C.ok);}}});
  txt(g,"integrine",W*.07,ym-18,C.acc,fs-1,"left",true);
  if(blk)return `Il peptide RGD solubile occupa il sito di legame delle integrine (verde sulle teste): non possono legare la fibronectina, restano piegate e non reclutano talina. L'actina scorre all'indietro senza presa (frizione 0), nessuna adesione focale: la cellula si arrotonda e, se dipende dall'adesione, può andare incontro ad anoikis.`;
  return `Trazione ${p.F}/10 su matrice ${p.m==0?"rigida":"morbida"}: le integrine (eterodimeri α/β) attivate si estendono, legano la sequenza RGD della fibronectina fuori e la talina dentro. La forza della miosina II stira la talina, che espone siti per la <b>vinculina</b> e rinforza il legame con l'actina: integrine impegnate <b>${neng}/6</b>, l'actina scorre meno (frizione). ${p.m==0?`L'adesione focale cresce, FAK si attiva e YAP/TAZ entrano nel nucleo (<b>${F2(yap*100,0)}%</b>): la cellula «sente» la rigidità (meccanotrasduzione).`:`La matrice morbida si deforma invece di opporsi: poca tensione, adesioni piccole, YAP resta soprattutto nel citoplasma (<b>${F2(yap*100,0)}%</b> nel nucleo).`}`;}},

/* ---------- b6b: giunzioni cellulari ---------- */
giunzioni:{h:330,c:[{k:"t",l:"Giunzione",seg:["Occludente","Aderente","Desmosoma","Emidesmosoma","Comunicante (gap)"],v:0},{k:"ca",l:"Ca²⁺ extracellulare",seg:["Normale","Assente (EGTA)"],v:0}],
 f(g,p,st,dt,W,H){const sm=W<480,fs=sm?10:12,t=p.t,noCa=p.ca==1;
  if(t==3){/* emidesmosoma */
   const yA=26,yb=H*.66,wob=3*Math.sin(st.t*2);rr(g,12,yA,W-24,yb-yA+wob,16,A_(C.acc,.08),A_(C.acc,.7));txt(g,"cellula epiteliale (basale)",20,yA+14,C.muted,fs,"left",true);
   rr(g,0,yb+16,W,12,0,A_(C.soon,.45));txt(g,"lamina basale (laminina)",8,yb+42,C.soon,fs,"left",true);txt(g,"tessuto connettivo",8,H-10,C.muted,fs-1,"left");
   const n=sm?2:3;for(let k=0;k<n;k++){const x=W*(k+1)/(n+1),py=yb+wob;rr(g,x-26,py-14,52,9,4,C.fam);
    line(g,x-6,py-5,x-6,yb+18,C.acc,3);line(g,x+6,py-5,x+6,yb+18,C.ok,3);
    for(const sg of[-1,1]){g.strokeStyle=C.ben;g.lineWidth=2.5;g.beginPath();g.moveTo(x+sg*14,py-14);g.bezierCurveTo(x+sg*40,py-60,x-sg*10,py-100-6*Math.sin(st.t*1.5+k),x+sg*4,py-14);g.stroke();}
    if(k==0){txt(g,"placca (plectina)",x+30,py-10,C.fam,fs-1,"left",true);txt(g,"α6β4",x+12,yb+8,C.acc,fs-1,"left",true);txt(g,"cheratina",x-30,py-74,C.ben,fs-1,"right",true);}}
   return `<b>Emidesmosoma</b>: lega la cellula alla lamina basale, non a un'altra cellula. L'integrina α6β4 si attacca alla laminina fuori e, tramite la placca (plectina), ai filamenti intermedi di cheratina dentro: la cellula resiste alla trazione (il bordo oscilla ma non si stacca). ${noCa?"Togliere il Ca²⁺ qui cambia poco: non ci sono caderine, l'adesione dipende dalle integrine.":"Nel pemfigoide bolloso gli autoanticorpi colpiscono proprio l'emidesmosoma e l'epidermide si stacca dal derma."}`;}
  /* due cellule epiteliali con il complesso giunzionale */
  const yA=H*.2,xm=W/2,cg=16,sep=noCa&&t<=2?lerp(0,14,st.t/2):0,xl=xm-cg/2-sep,xr=xm+cg/2+sep;
  const yT=yA+10,yAd=H*.42,yD=H*.6,yG=H*.8;
  rr(g,8,yA,xl-8,H-yA-8,14,A_(C.acc,.08),A_(C.acc,.7));rr(g,xr,yA,W-8-xr,H-yA-8,14,A_(C.acc,.08),A_(C.acc,.7));
  for(let x=20;x<xl-12;x+=12)rr(g,x,yA-9,6,10,3,A_(C.acc,.25),A_(C.acc,.6));for(let x=xr+12;x<W-18;x+=12)rr(g,x,yA-9,6,10,3,A_(C.acc,.25),A_(C.acc,.6));
  txt(g,"lume (lato apicale)",xm,12,C.muted,fs,"center",true);txt(g,"cellula 1",16,H-18,C.muted,fs-1,"left");txt(g,"cellula 2",W-16,H-18,C.muted,fs-1,"right");
  const A=k=>{g.globalAlpha=k===t?1:.22;};
  /* occludente */
  A(0);for(let r=0;r<4;r++){const y=yT+r*8,open=noCa&&st.t>.8;circ(g,xl+4,y,3.5,C.fam);circ(g,xr-4,y,3.5,C.fam);if(!open){circ(g,xm-sep*0-3.5+(xl+xr)/2-xm,y,3.5,C.fam);circ(g,(xl+xr)/2+3.5,y,3.5,C.fam);}}
  /* aderente */
  A(1);{const hh=34,mid=(xl+xr)/2;for(let k=0;k<5;k++){const y=yAd-hh/2+k*hh/4;if(sep<6){line(g,xl,y,mid-1,y,C.ok,3);line(g,xr,y,mid+1,y,C.ok,3);if(!noCa)circ(g,mid,y-4,2,C.soon);}else{line(g,xl,y,xl+6,y+5,C.ok,3);line(g,xr,y,xr-6,y+5,C.ok,3);}}
   rr(g,xl-13,yAd-hh/2-4,9,hh+8,4,A_(C.fam,.6));rr(g,xr+4,yAd-hh/2-4,9,hh+8,4,A_(C.fam,.6));
   for(let k=0;k<3;k++){const y=yAd-12+k*12;for(let x=16;x<xl-16;x+=7)circ(g,x,y+(Math.round(x/7)%2?1.5:-1.5),2.6,C.u5);for(let x=xr+16;x<W-14;x+=7)circ(g,x,y+(Math.round(x/7)%2?1.5:-1.5),2.6,C.u5);}}
  /* desmosoma */
  A(2);{const hh=26,mid=(xl+xr)/2;for(let k=0;k<4;k++){const y=yD-hh/2+k*hh/3;if(sep<6){line(g,xl,y,mid,y+1,C.fam,3);line(g,xr,y,mid,y,C.fam,3);}else{line(g,xl,y,xl+6,y+5,C.fam,3);line(g,xr,y,xr-6,y+5,C.fam,3);}}
   rr(g,xl-14,yD-hh/2-6,11,hh+12,4,C.fam);rr(g,xr+3,yD-hh/2-6,11,hh+12,4,C.fam);
   for(const [x0,sg] of [[xl-14,-1],[xr+14,1]])for(let k=0;k<3;k++){g.strokeStyle=C.ben;g.lineWidth=2.5;g.beginPath();g.moveTo(x0,yD-8+k*7);g.bezierCurveTo(x0+sg*(50+k*14),yD-34+k*6+3*Math.sin(st.t+k),x0+sg*(60+k*14),yD+30-k*6,x0,yD+10-k*5);g.stroke();}}
  /* comunicante */
  A(4);const ys=[yG-20,yG,yG+20];ys.forEach(y=>{rr(g,xl-9,y-7,11,14,3,C.ben);rr(g,xr-2,y-7,11,14,3,C.ben);if(sep<6)line(g,xl,y,xr,y,A_(C.ok,.5),2);});
  g.globalAlpha=1;
  /* etichette e particelle del tipo scelto */
  const L=(s,x,y,col,al)=>txt(g,s,x,y,col,fs-1,al||"left",true);
  const lume=(i)=>[xm+(rnd(i)-.5)*W*.8,10+rnd(i+30)*(yA-24)+3*Math.sin(st.t*1.4+i)];
  let np=0,info="";
  if(t==0){L("claudine / occludina",xr+10,yT+6,C.fam);
   const pass=noCa&&st.t>.8;for(let i=0;i<10;i++){const big=i%3==2,v=(st.t*.2+i/10)%1;let x,y;
    if(v<.4){const [x0,y0]=lume(i);x=lerp(x0,xm,v/.4);y=lerp(y0,yA-2,v/.4);}else{const w=(v-.4)/.6;x=xm+(rnd(i+3)-.5)*(cg+2*sep-8);y=pass?lerp(yA-2,H-14,w):yA-2+Math.sin(w*Math.PI)*(yT-yA-6);}
    circ(g,x,y,big?5:3,big?C.soon:C.ok);}
   np=pass?Math.floor(Math.max(0,st.t-.8)*.2*10):0;
   info=`<b>Giunzione occludente</b> (tight), la più apicale del complesso giunzionale: file di claudine e occludina «cuciono» le membrane vicine. Ioni (verdi) e molecole (gialle) del lume non passano tra le cellule (via paracellulare chiusa) e le proteine di membrana non migrano tra dominio apicale e basolaterale (funzione di recinto). `+(noCa?`Senza Ca²⁺ le caderine si staccano e anche le giunzioni occludenti si aprono: la barriera cede, particelle passate <b>${np}</b>.`:`Particelle passate: <b>0</b>.`);}
  if(t==1||t==2){if(t==1){L("E-caderine",xr+16,yAd+28,C.ok);L("cintura di actina",16,yAd-24,C.u5);L("catenine",xl-16,yAd+28,C.fam,"right");}
    else{L("desmogleina / desmocollina",xr+16,yD+26,C.fam);L("placca (desmoplachina)",xl-18,yD-26,C.fam,"right");L("cheratina",16,yD+34,C.ben);}
   for(let i=0;i<6;i++){const v=(st.t*.15+i/6)%1,x=xm+(rnd(i+3)-.5)*(cg+2*sep-8)*.6,y=lerp(yAd-40,H-14,v);circ(g,x,y,i%3==2?5:3,i%3==2?C.soon:C.ok);}
   info=t==1?`<b>Giunzione aderente</b>: E-caderine di cellule vicine si legano tra loro (legame omofilo, dipendente dal Ca²⁺: puntini gialli) e dentro, tramite le catenine (β e α), alla cintura di actina. Non è una barriera: nello spazio sottostante ioni e molecole passano liberamente. `+(noCa?`Senza Ca²⁺ le caderine perdono la forma rigida, si staccano e le cellule si separano.`:``)
    :`<b>Desmosoma</b>: caderine desmosomiali (desmogleina e desmocollina) unite a placche dense (placoglobina, desmoplachina) ancorate ai filamenti intermedi di cheratina: distribuiscono la trazione (pelle, cuore). Non sigilla lo spazio intercellulare. Gli autoanticorpi contro la desmogleina causano il pemfigo. `+(noCa?`Senza Ca²⁺ anche queste caderine si staccano e le cellule si separano.`:``);}
  if(t==4){L("connessoni (6 connessine)",xr+14,yG-34,C.ben);
   for(let i=0;i<6;i++){const v=(st.t*.2+i/6)%1,lane=ys[i%3];const ax=20+rnd(i)*(xl-50),ay=yA+30+rnd(i+5)*(H-yA-60),bx=xr+20+rnd(i+2)*(W-xr-50),by=yA+30+rnd(i+8)*(H-yA-60);let x,y;
    if(v<.4){x=lerp(ax,xl-12,v/.4);y=lerp(ay,lane,v/.4);}else if(v<.6){x=lerp(xl-12,xr+12,(v-.4)/.2);y=lane;}else{x=lerp(xr+12,bx,(v-.6)/.4);y=lerp(lane,by,(v-.6)/.4);}circ(g,x,y,3,C.ok);}
   for(let i=0;i<3;i++){const x=30+rnd(i+20)*(xl-70)+12*Math.sin(st.t*1.3+i),y=yA+30+rnd(i+30)*(H-yA-80)+10*Math.cos(st.t+i);circ(g,x,y,7,C.soon);}
   np=Math.floor(st.t*.2*6);
   info=`<b>Giunzione comunicante</b> (gap): due connessoni allineati formano un canale tra i citoplasmi. Passano ioni e piccole molecole sotto ~1 kDa (verdi: Ca²⁺, cAMP, IP₃, glucosio; <b>${np}</b> passate), non le proteine (gialle: <b>0</b>). Accoppiano elettricamente le cellule del cuore e del muscolo liscio (sinapsi elettriche). `+(noCa?`Il Ca²⁺ extracellulare non serve ai connessoni: è un forte aumento del Ca²⁺ dentro la cellula a chiuderli, isolando una cellula danneggiata.`:``);}
  return info;}},

/* ---------- b6c: trasduzione del segnale (GPCR-cAMP oppure RTK-Ras-MAPK) ---------- */
trasduzione:{h:340,c:[{k:"via",l:"Via",seg:["GPCR → AMP ciclico","RTK → Ras → MAPK"],v:0},{k:"L",l:"Ligando (ormone / fattore di crescita)",min:0,max:10,st:1,v:5},{k:"gt",l:"GTPasi di Gαs / Ras",seg:["Normale","Bloccata"],v:0}],
 init(st){st.a=0;st.m=0;st.h=[];st.acc=0;},
 f(g,p,st,dt,W,H){if(!st.h)this.init(st);const sm=W<480,fs=sm?10:12,rtk=p.via==1,dif=p.gt==1,L=p.L/10;
  const kon=1.4,koff=dif?0:.9,bas=dif?.05:0;st.a+=dt*(kon*L*(1-st.a)+bas*(1-st.a)-koff*st.a);st.a=cl(st.a,0,1);
  st.m+=dt*(1.1*st.a*(1-st.m)-.45*st.m);st.m=cl(st.m,0,1);
  st.acc+=dt;while(st.acc>.1){st.acc-=.1;st.h.push([st.a,st.m]);if(st.h.length>200)st.h.shift();}
  const ym=H*.16,a=st.a,m=st.m;
  txt(g,"esterno",8,10,C.muted,fs-1,"left",true);
  rr(g,0,ym-7,W,14,0,A_(C.soon,.25));line(g,0,ym-7,W,ym-7,A_(C.soon,.8),2);line(g,0,ym+7,W,ym+7,A_(C.soon,.8),2);
  for(let i=0;i<p.L;i++){const x=W*.2+rnd(i+4)*W*.75,y=8+rnd(i+12)*(ym-22)+2*Math.sin(st.t*1.6+i);circ(g,x,y,4,C.soon);}
  const xR=W*.1;
  if(!rtk){rr(g,xR-14,ym-14,28,28,6,A_(C.acc,.35),C.acc);for(let k=0;k<7;k++)line(g,xR-11+k*3.7,ym-11,xR-11+k*3.7,ym+11,C.acc,1.5);if(p.L>0)circ(g,xR,ym-19,5,C.soon);txt(g,"GPCR",xR,ym+24,C.acc,fs-1,"center",true);
   const xG=W*.28,xA=W*.5,gx=lerp(xG,xA-20,a);circ(g,xG-16,ym+18,8,A_(C.fam,.5),C.fam,1.5);txt(g,"βγ",xG-16,ym+18,C.ink,9,"center",true);
   circ(g,gx,ym+22,11,a>.5?C.ok:A_(C.ok,.35),C.ok,1.5);txt(g,"α",gx,ym+22,a>.5?C.card:C.ink,11,"center",true);pill(g,a>.5?"GTP":"GDP",gx,ym+44,a>.5?C.ok:C.muted,fs-1);
   rr(g,xA-12,ym-12,24,30,6,A_(C.ben,.35+.5*a),C.ben);txt(g,"AC",xA,ym+2,C.ink,10,"center",true);txt(g,"adenilato ciclasi",xA+16,ym-20,C.ben,fs-1,"left",true);
   const nc=Math.round(m*30);for(let i=0;i<nc;i++){const x=xA-10+rnd(i+30)*W*.26+3*Math.sin(st.t*2+i),y=ym+30+rnd(i+40)*(H*.42-ym-30);circ(g,x,y,3,C.u5);}
   txt(g,"cAMP",xA+W*.13,H*.47,C.u5,fs,"center",true);
   const kx=W*.86,ky=ym+H*.18;circ(g,kx-8,ky,8,A_(C.muted,.4),C.muted,1.5);circ(g,kx+8,ky,8,A_(C.muted,.4),C.muted,1.5);txt(g,"R",kx-8,ky,C.ink,9,"center",true);txt(g,"R",kx+8,ky,C.ink,9,"center",true);
   for(const sg of[-1,1]){const cxk=kx+sg*(8+m*22),cyk=ky+18+m*16;circ(g,cxk,cyk,8,C.warn);txt(g,"C",cxk,cyk,C.card,9,"center",true);}
   txt(g,"PKA",kx,ky-18,C.ink,fs,"center",true);}
  else{const dim=a>.25,sep=dim?7:16;[-1,1].forEach(sg=>{const x=xR+sg*sep;rr(g,x-5,ym-20,10,44,4,A_(C.acc,.35),C.acc);if(dim){circ(g,x+sg*9,ym+14,4.5,C.warn);txt(g,"P",x+sg*9,ym+14,C.card,7,"center",true);}});
   if(p.L>0)circ(g,xR,ym-25,5,C.soon);txt(g,"RTK",xR,ym+36,C.acc,fs-1,"center",true);
   const sx=W*.3,sy=ym+22;pill(g,"Grb2·SOS",sx,sy,C.fam,fs-1,.15+.5*a);if(a>.25)line(g,xR+20,ym+14,sx-30,sy,A_(C.fam,.7),2,[3,3]);
   const rx=W*.5,ry=ym+16;circ(g,rx,ry,12,a>.5?C.ok:A_(C.ok,.35),C.ok,1.5);txt(g,"Ras",rx,ry,a>.5?C.card:C.ink,10,"center",true);pill(g,a>.5?"GTP":"GDP",rx,ry+24,a>.5?C.ok:C.muted,fs-1);
   const K=[["Raf",W*.6,ym+60],["MEK",W*.66,ym+96],["ERK",W*.72,ym+132]];let px=rx,py=ry+12;K.forEach(([n,x,y],i)=>{const on=cl(m*1.6-i*.25,0,1);arrow(g,px,py+8,x-8,y-10,A_(C.muted,.7),2);pill(g,n+(on>.5?"-P":""),x,y,C.fam,fs-1,.12+.6*on);px=x;py=y;});
   const nx=W*.9,ny=ym+H*.3,nr=Math.min(34,W*.08);circ(g,nx,ny,nr,A_(C.fam,.1),C.fam,2);txt(g,"nucleo",nx,ny-nr-8,C.fam,fs-1,"center",true);
   const ne=Math.round(m*8);for(let i=0;i<ne;i++){const v=(st.t*.4+i/8)%1;circ(g,lerp(W*.75,nx-4+rnd(i)*8,v),lerp(ym+132,ny-10+rnd(i+3)*20,v),3.5,C.warn);}}
  /* grafico */
  const gx=30,gy=H*.6,gw=W-gx-12,gh=H-gy-22;axes(g,gx,gy,gw,gh,"tempo (ultimi 20 s)","");
  const n1=rtk?"Ras-GTP":"Gαs-GTP",n2=rtk?"ERK fosforilata":"cAMP";
  [[0,C.ok,n1],[1,C.u5,n2]].forEach(([k,c,l],j)=>{g.strokeStyle=c;g.lineWidth=2.5;g.beginPath();st.h.forEach((v,i)=>{const X=gx+i/200*gw,Y=gy+gh-v[k]*gh;i?g.lineTo(X,Y):g.moveTo(X,Y);});g.stroke();txt(g,"— "+l,gx+8+j*(sm?100:130),gy-6,c,fs-1,"left",true);});
  const pa=F2(a*100,0),pm=F2(m*100,0);
  if(!rtk)return `Ligando ${p.L}: il recettore a 7 eliche attivato fa da GEF per Gαs (GDP → GTP); Gαs-GTP si stacca da βγ e attiva l'adenilato ciclasi, ATP → cAMP, che libera le subunità catalitiche (C) della PKA. Gαs attiva <b>${pa}%</b>, cAMP <b>${pm}%</b>: ogni passaggio moltiplica il segnale (amplificazione). `+(dif?`La tossina del colera blocca la GTPasi di Gαs: resta accesa anche con poco o nessun ormone, il cAMP resta alto e l'intestino perde Cl⁻ e acqua (diarrea).`:`Il segnale si spegne da solo: Gα idrolizza il GTP (aiutata dalle RGS, che fanno da GAP) e la fosfodiesterasi degrada il cAMP. Porta il ligando a 0 per vederlo.`);
  return `Ligando ${p.L}: il fattore di crescita fa dimerizzare il recettore tirosin-chinasico, che si autofosforila; Grb2 lega le fosfotirosine e porta SOS (GEF) che scambia il GDP di Ras con GTP. Ras-GTP attiva Raf → MEK → ERK (MAP chinasi), che entra nel nucleo e accende i geni della proliferazione. Ras-GTP <b>${pa}%</b>, ERK-P <b>${pm}%</b>. `+(dif?`Ras G12V non idrolizza il GTP nemmeno con le GAP: proliferazione sempre accesa anche senza fattore di crescita, è un <b>oncogene</b> (Ras è mutato in circa un tumore umano su quattro).`:`Le GAP (es. neurofibromina, NF1) aiutano Ras a idrolizzare il GTP e spengono il segnale.`);}},

/* ---------- b7d: apoptosi (intrinseca, estrinseca) e necrosi ---------- */
morteCellulare:{h:330,ri:1,c:[{k:"s",l:"Stimolo",seg:["Danno al DNA (via intrinseca)","FasL (via estrinseca)","Ischemia grave (necrosi)"],v:0},{k:"b",l:"BCL-2 (anti-apoptotica)",min:0,max:10,st:1,v:2}],
 init(st){st.t0=st.t||0;},
 f(g,p,st,dt,W,H){if(st.t0==null)st.t0=0;const sm=W<480,fs=sm?10:12,tau=st.t-st.t0;
  const ST=[[["DNA danneggiato → p53",C.acc],["PUMA, NOXA (BH3-only)",C.acc],["BAX/BAK sul mitocondrio",C.warn],["MOMP: esce il citocromo c",C.lp],["Apoptosoma (Apaf-1)",C.fam],["Caspasi-9 (iniziatrice)",C.fam],["Caspasi-3/7 (esecutrici)",C.warn],["Corpi apoptotici → fagocitosi",C.ok]],
   [["FasL lega Fas (rec. di morte)",C.acc],["DISC: FADD + pro-caspasi-8",C.fam],["Caspasi-8 (iniziatrice)",C.fam],["Caspasi-3/7 (esecutrici)",C.warn],["(taglia BID → tBID: amplifica)",C.lp],["Corpi apoptotici → fagocitosi",C.ok]],
   [["Niente O₂ → ATP crolla",C.acc],["Pompe ferme: entrano Na⁺ e acqua",C.ben],["Cellula e organelli rigonfi",C.soon],["Lisosomi rilasciano enzimi",C.lp],["Membrana rotta → infiammazione",C.warn]]][p.s];
  const n=ST.length,blockAt=p.s==0&&p.b>=6?2:-1,dur=p.s==0?1.5*(1+p.b*.12):1.5,tot=n*dur+3,tl=blockAt>=0?Math.min(tau,blockAt*dur+dur*.99):tau%tot;
  const k=Math.min(n-1,Math.floor(tl/dur)),done=tl/dur;
  /* lista dei passaggi */
  const bx=sm?W*.5:W*.56,bw=W-bx-8,bh=Math.min(30,(H-16)/n-5);
  ST.forEach(([l,c],i)=>{const y=8+i*(bh+5),st_=i<k?2:i==k?1:0;const blocked=blockAt>=0&&i>blockAt;
   rr(g,bx,y,bw,bh,7,st_==2?A_(c,.22):st_==1?A_(c,.35+.15*Math.sin(st.t*5)):A_(C.muted,.06),st_?c:A_(C.muted,.4));
   ftxt(g,l,bx+8,y+bh/2,blocked?A_(C.muted,.7):st_?C.ink:C.muted,bw-14,fs,"left",st_>0);
   if(blockAt==i&&tl>=blockAt*dur+dur*.5){line(g,bx+bw-18,y+6,bx+bw-6,y+bh-6,C.warn,2.5);line(g,bx+bw-6,y+6,bx+bw-18,y+bh-6,C.warn,2.5);}});
  /* cellula */
  const cx=bx*.5,cy=H*.5,R0=Math.min(H*.33,bx*.4);
  let fe=0,sw=0;
  if(p.s==0)fe=cl((done-6)/2,0,1);if(p.s==1)fe=cl((done-3)/3,0,1);if(p.s==2)sw=cl(done/4,0,1);
  const R=R0*(1-.25*fe+.22*sw),broken=p.s==2&&done>=4;
  g.beginPath();for(let i=0;i<=72;i++){const a=i/72*6.283,b=fe*R*.13*Math.max(0,Math.sin(a*7+st.t*2)),rr_=R+b,x=cx+Math.cos(a)*rr_,y=cy+Math.sin(a)*rr_;i?g.lineTo(x,y):g.moveTo(x,y);}
  g.fillStyle=A_(fe>0?C.warn:C.acc,.08+.08*fe);g.fill();g.strokeStyle=fe>0?C.warn:C.acc;g.lineWidth=2.5;g.setLineDash(broken?[10,8]:[]);g.stroke();g.setLineDash([]);
  if(fe>.85){for(let i=0;i<5;i++){const a=i*1.256+.3,d=R*.9+fe*8;circ(g,cx+Math.cos(a)*d,cy+Math.sin(a)*d,R*.18,A_(C.warn,.15),C.warn,1.5);}}
  /* nucleo */
  const nr=R*.36,nx=cx-R*.15,ny=cy-R*.1;
  if(fe<.6)circ(g,nx,ny,nr*(1-.3*fe),A_(C.fam,.15+.6*fe),C.fam,2);else for(let i=0;i<3;i++)circ(g,nx+(i-1)*nr*.6,ny+(i%2)*nr*.4,nr*.32,A_(C.fam,.8),C.fam,1.5);
  /* mitocondri e citocromo c */
  const mito=[[cx+R*.42,cy-R*.3],[cx+R*.3,cy+R*.38],[cx-R*.38,cy+R*.45]];const momp=p.s==0&&done>=3&&blockAt<0;
  mito.forEach(([x,y],i)=>{g.beginPath();g.ellipse(x,y,R*.2*(1+sw*.4),R*.11*(1+sw*.6),i,0,7);g.fillStyle=A_(C.lp,.2);g.fill();g.strokeStyle=C.lp;g.lineWidth=1.5;g.stroke();
   if(p.s==0&&k>=2){const nb=k==2&&blockAt<0?Math.ceil((done-2)*4):4;for(let j=0;j<Math.min(4,nb);j++)circ(g,x+Math.cos(j*1.6)*R*.2,y+Math.sin(j*1.6)*R*.12,2.5,blockAt>=0?A_(C.warn,.4):C.warn);}
   for(let j=0;j<3;j++){const v=momp?cl(done-3,0,1):0;circ(g,lerp(x+(j-1)*4,cx+(rnd(i*3+j)-.5)*R*.9,v),lerp(y,cy+(rnd(i*3+j+9)-.5)*R*.9,v),2.4,C.soon);}});
  if(blockAt>=0)txt(g,"BCL-2",cx+R*.42,cy-R*.3-R*.2,C.ok,fs,"center",true);
  if(p.s==0&&done>=4&&fe<.85){const ax=cx+R*.05,ay=cy+R*.12,ar=R*.13;for(let j=0;j<7;j++){const a=j/7*6.283+st.t*.5;line(g,ax,ay,ax+Math.cos(a)*ar,ay+Math.sin(a)*ar,C.fam,2);circ(g,ax+Math.cos(a)*ar,ay+Math.sin(a)*ar,2.5,C.fam);}}
  if(p.s==1){const fx=cx,fy=cy-R-4;line(g,fx,fy+4,fx,fy+14,C.acc,3);if(done>=0.5)for(let j=0;j<3;j++)circ(g,fx-6+j*6,fy-6,4,C.ok);txt(g,"FasL",fx+18,fy-8,C.ok,fs-1,"left",true);}
  if(broken){for(let i=0;i<10;i++){const a=rnd(i)*6.283,v=(st.t*.3+rnd(i+4))%1,d=R+v*R*.6;circ(g,cx+Math.cos(a)*d,cy+Math.sin(a)*d,3,A_(C.soon,1-v));}txt(g,"infiammazione",cx,cy+R+R*.45,C.warn,fs,"center",true);}
  const lab=ST[k][0];
  if(blockAt>=0)return `BCL-2 alta (${p.b}/10): lega e trattiene BAX e BAK, che non riescono a forare la membrana mitocondriale esterna. Niente MOMP, niente citocromo c: la cellula <b>sopravvive</b> nonostante il danno al DNA. È il meccanismo della traslocazione t(14;18) nel linfoma follicolare. Abbassa BCL-2 sotto 6 per vedere l'apoptosi.`;
  if(p.s==0)return `Via intrinseca, ora: <b>${lab}</b>. p53 induce le proteine BH3-only (PUMA, NOXA) che liberano BAX/BAK; questi forano la membrana mitocondriale esterna (MOMP) e il citocromo c (giallo) esce nel citosol, dove con Apaf-1 e dATP forma l'apoptosoma che attiva la caspasi-9 e poi le caspasi-3/7. ${p.b>0?`BCL-2 a ${p.b}/10 rallenta il processo ma non basta a fermarlo.`:""} La cellula si restringe, la cromatina si condensa e si frammenta, si formano corpi apoptotici fagocitati senza infiammazione.`;
  if(p.s==1)return `Via estrinseca, ora: <b>${lab}</b>. FasL (trimero) lega il recettore di morte Fas; il dominio di morte recluta FADD e la pro-caspasi-8 (complesso DISC). La caspasi-8 attiva direttamente le caspasi-3/7, quindi BCL-2 (qui ${p.b}/10) <b>non la blocca</b>; taglia anche BID in tBID, che amplifica il segnale attraverso il mitocondrio. Linfociti T citotossici e NK usano questa via.`;
  return `Necrosi, ora: <b>${lab}</b>. Senza O₂ l'ATP crolla, la pompa Na⁺/K⁺ si ferma, entrano Na⁺ e acqua: la cellula e i mitocondri si gonfiano, la membrana si rompe e il contenuto esce provocando <b>infiammazione</b>. È una morte passiva, non programmata: BCL-2 (${p.b}/10) non c'entra. Nell'apoptosi invece la cellula si restringe e la membrana resta integra.`;}}
});

bt("b5b").anim="nucleoRan";
bt("b5c").anim="catenaResp";
bt("b5d").anim="perossisoma";
bt("b5e").anim="secretoriaER";
bt("b5f").anim="endocitosiLDL";
bt("b5g").anim="microtubuli";
bt("b6a").anim="integrineFA";
bt("b6b").anim="giunzioni";
bt("b6c").anim="trasduzione";
bt("b7d").anim="morteCellulare";
})();
