/* ================= CHIMICA: animazioni per gli argomenti che non ne avevano =================
   c1b legame · c2a dissoluzione · c5a chiralita · c5b sn1sn2 · c6a ebollizione · c6b carbonile
   c6c carbossile · c7b anomeri · c7c fluidita · c7d fenton
   Stesso motore (mountAnim di c_anim.js). Tutto dentro una funzione: nessun nuovo nome globale oltre alle voci di AN. */
(function(){
const cl=(v,a,b)=>Math.max(a,Math.min(b,v)),rnd=Math.random,PI=Math.PI;
const L01=(a,b,u)=>a+(b-a)*cl(u,0,1);
/* atomo: cerchio pieno con sigla */
function atm(g,x,y,r,fill,lab,lc,fs){circ(g,x,y,r,fill,A_(C.ink,.35),1.2);if(lab)txt(g,lab,x,y+.5,lc||C.card,fs||Math.max(9,Math.round(r*.9)),"center",true);}
/* gruppo chimico scritto dentro una «pillola» */
function pill(g,x,y,s,col,fs,al){fs=fs||12;g.font="700 "+fs+"px -apple-system,BlinkMacSystemFont,sans-serif";const w=g.measureText(s).width+10,h=fs+8;g.globalAlpha=al==null?1:al;rr(g,x-w/2,y-h/2,w,h,h/2,A_(col,.2),col);txt(g,s,x,y+.5,C.ink,fs,"center",true);g.globalAlpha=1;return w;}
function dbl(g,x1,y1,x2,y2,col,lw,gap){const a=Math.atan2(y2-y1,x2-x1),nx=-Math.sin(a)*gap,ny=Math.cos(a)*gap;line(g,x1+nx,y1+ny,x2+nx,y2+ny,col,lw);line(g,x1-nx,y1-ny,x2-nx,y2-ny,col,lw);}
/* freccia curva (spostamento di una coppia di elettroni) */
function curv(g,x1,y1,x2,y2,bend,col,lw){const mx=(x1+x2)/2,my=(y1+y2)/2,dx=x2-x1,dy=y2-y1,qx=mx-dy*bend,qy=my+dx*bend;g.strokeStyle=col;g.lineWidth=lw||2;g.setLineDash([]);g.beginPath();g.moveTo(x1,y1);g.quadraticCurveTo(qx,qy,x2,y2);g.stroke();
 const a=Math.atan2(y2-qy,x2-qx);g.fillStyle=col;g.beginPath();g.moveTo(x2,y2);g.lineTo(x2-9*Math.cos(a-.45),y2-9*Math.sin(a-.45));g.lineTo(x2-9*Math.cos(a+.45),y2-9*Math.sin(a+.45));g.closePath();g.fill();}
/* legame tratteggiato «a cuneo» (verso il retro del foglio) */
function hashb(g,x1,y1,x2,y2,col,w){const a=Math.atan2(y2-y1,x2-x1);for(let i=1;i<=7;i++){const u=i/7,x=x1+(x2-x1)*u,y=y1+(y2-y1)*u,h=w*u/2;line(g,x-Math.sin(a)*h,y+Math.cos(a)*h,x+Math.sin(a)*h,y-Math.cos(a)*h,col,1.6);}}
/* molecola d'acqua: O (δ−) rosso, H (δ+) chiari; ang = direzione in cui puntano gli H */
function wat(g,x,y,ang,sc,al){g.globalAlpha=al==null?1:al;for(const s of[-.91,.91]){const hx=x+Math.cos(ang+s)*6*sc,hy=y+Math.sin(ang+s)*6*sc;line(g,x,y,hx,hy,C.muted,1.2*sc);circ(g,hx,hy,2.4*sc,C.card,C.muted,1);}circ(g,x,y,3.8*sc,C.warn);g.globalAlpha=1;}
const pct=v=>v>.999?"> 99,9":v<.001?"< 0,1":F2(v*100,1);

Object.assign(AN,{
/* ---------- c1b · legame chimico e geometria VSEPR ---------- */
legame:{h:380,c:[{k:"xa",l:"Elettronegatività dell'atomo A (χ)",min:.7,max:4,st:.1,v:2.2},{k:"xb",l:"Elettronegatività dell'atomo B (χ)",min:.7,max:4,st:.1,v:3.2},{k:"mol",l:"Geometria (VSEPR)",seg:["CO₂","BF₃","CH₄","NH₃","H₂O"],v:2}],
 f(g,p,st,dt,W,H){const wide=W>=560,bw=wide?W*.56:W,bh=wide?H:H*.57,d=p.xb-p.xa,ad=Math.round(Math.abs(d)*10)/10,ion=ad>=1.9,pol=ad>=.4,neg=d>=0?1:-1;
  const cx=bw/2,cy=wide?H*.36:bh*.33,r=Math.min(30,bw*.085,bh*.16);
  txt(g,"Legame tra A e B",12,16,C.muted,12,"left",true);
  let note="";
  if(!ion){const sep=r*1.5,xA=cx-sep/2,xB=cx+sep/2,f=cl(ad/1.9,0,1)*neg,ec=cx+f*sep*.45;
   circ(g,xA,cy,r,A_(C.acc,.14),C.acc,1.5);circ(g,xB,cy,r,A_(C.fam,.14),C.fam,1.5);
   const gr=g.createRadialGradient(ec,cy,1,ec,cy,r*1.3);gr.addColorStop(0,A_(C.soon,.55));gr.addColorStop(1,A_(C.soon,0));g.fillStyle=gr;g.beginPath();g.ellipse(ec,cy,r*1.35,r*.85,0,0,7);g.fill();
   txt(g,"A",xA-r*.25,cy,C.acc,18,"center",true);txt(g,"B",xB+r*.25,cy,C.fam,18,"center",true);
   for(let i=0;i<2;i++){const ph=st.t*2.4+i*PI,amp=sep*.42*(1-.5*Math.abs(f));circ(g,ec+Math.cos(ph)*amp,cy+Math.sin(ph*2)*r*.3,4,C.soon,C.card,1.2);}
   if(pol){txt(g,"δ+",neg>0?xA:xB,cy-r-12,C.acc,14,"center",true);txt(g,"δ−",neg>0?xB:xA,cy-r-12,C.warn,14,"center",true);}
   note=pol?"coppia condivisa, spostata verso "+(neg>0?"B":"A"):"coppia condivisa in modo equo";
   txt(g,"χ "+F2(p.xa,1),xA-r*.3,cy+r+14,C.acc,12,"center",true);txt(g,"χ "+F2(p.xb,1),xB+r*.3,cy+r+14,C.fam,12,"center",true);}
  else{const T=4,s=(st.t%T)/T,dn=neg>0?-1:1,sep0=r*2.7,sep=s<.4?sep0:L01(sep0,r*2.15,(s-.4)/.3)+(s>.7?Math.sin(st.t*6)*1.5:0);
   const xD=cx+dn*sep/2,xR=cx-dn*sep/2,k=s>=.4,rD=k?r*.72:r,rR=k?r*1.15:r,cD=dn<0?C.acc:C.fam,cR=dn<0?C.fam:C.acc,lD=dn<0?"A":"B",lR=dn<0?"B":"A";
   circ(g,xD,cy,rD,A_(cD,.14),cD,1.5);circ(g,xR,cy,rR,A_(cR,.14),cR,1.5);txt(g,lD+(k?"⁺":""),xD,cy,cD,18,"center",true);txt(g,lR+(k?"⁻":""),xR,cy,cR,18,"center",true);
   let ex,ey;if(s<.1){ex=xD-dn*rD*.8;ey=cy;}else if(s<.4){const u=(s-.1)/.3;ex=L01(xD-dn*rD*.8,xR+dn*rR*.7,u);ey=cy-Math.sin(u*PI)*r*.9;}else{ex=xR+Math.cos(st.t*3)*rR*.75;ey=cy+Math.sin(st.t*3)*rR*.75;}
   circ(g,ex,ey,4.5,C.soon,C.card,1.2);
   if(k){arrow(g,xD-dn*0,cy+rR+16,cx+dn*4,cy+rR+16,C.muted,2);arrow(g,xR,cy+rR+16,cx-dn*4,cy+rR+16,C.muted,2);}
   note=k?"ioni di carica opposta: attrazione elettrostatica":"l'elettrone passa all'atomo più elettronegativo";
   txt(g,"χ "+F2(dn<0?p.xa:p.xb,1),xD,cy-r-14,cD,12,"center",true);txt(g,"χ "+F2(dn<0?p.xb:p.xa,1),xR,cy-r-14,cR,12,"center",true);}
  txt(g,note,cx,cy+r+(ion?42:30),C.muted,12,"center");
  /* scala del Δχ */
  const y0=wide?H*.72:bh*.84,x0=16,w=bw-32,X=v=>x0+cl(v,0,3.3)/3.3*w;
  rr(g,X(0),y0,X(.4)-X(0),14,0,A_(C.ok,.35));rr(g,X(.4),y0,X(1.9)-X(.4),14,0,A_(C.soon,.35));rr(g,X(1.9),y0,X(3.3)-X(1.9),14,0,A_(C.warn,.35));
  txt(g,"apolare",X(0),y0+27,C.ok,11,"left",true);txt(g,"covalente polare",(X(.4)+X(1.9))/2,y0+27,C.soon,11,"center",true);txt(g,"ionico",(X(1.9)+X(3.3))/2,y0+27,C.warn,11,"center",true);
  const EX=[[0,"H–H, Cl–Cl"],[.35,"C–H"],[.49,"C–N"],[.89,"C–O"],[.96,"H–Cl"],[1.24,"O–H"],[2.13,"Mg–O"],[2.23,"Na–Cl"],[3.16,"K–F"]],ne=EX.reduce((a,b)=>Math.abs(b[0]-ad)<Math.abs(a[0]-ad)?b:a),es=Math.abs(ne[0]-ad)<=.12?ne[1]:"";
  const mx0=X(ad);g.fillStyle=C.ink;g.beginPath();g.moveTo(mx0,y0-2);g.lineTo(mx0-6,y0-12);g.lineTo(mx0+6,y0-12);g.closePath();g.fill();
  txt(g,"Δχ = "+F2(ad,1)+(es?" ("+es+")":""),cl(mx0,70,bw-70),y0-22,C.ink,13,"center",true);
  /* geometria VSEPR */
  const t3=Math.sqrt(8)/3,Hc=C.card,GEO=[
   {f:"CO₂",c:["C",C.muted],a:[["O",C.warn,[1,0,0]],["O",C.warn,[-1,0,0]]],lp:[],nm:"lineare",ang:"180°",hy:"sp",dl:"nessun doppietto libero",pol:0},
   {f:"BF₃",c:["B",C.soon],a:[["F",C.ok,[0,1,0]],["F",C.ok,[.866,-.5,0]],["F",C.ok,[-.866,-.5,0]]],lp:[],nm:"trigonale planare",ang:"120°",hy:"sp²",dl:"nessun doppietto libero",pol:0},
   {f:"CH₄",c:["C",C.muted],a:[["H",Hc,[0,1,0]],["H",Hc,[t3,-1/3,0]],["H",Hc,[-t3/2,-1/3,t3*.866]],["H",Hc,[-t3/2,-1/3,-t3*.866]]],lp:[],nm:"tetraedrica",ang:"109,5°",hy:"sp³",dl:"nessun doppietto libero",pol:0},
   {f:"NH₃",c:["N",C.acc],a:[["H",Hc,[.925,-.38,0]],["H",Hc,[-.4625,-.38,.801]],["H",Hc,[-.4625,-.38,-.801]]],lp:[[0,1,0]],nm:"piramidale trigonale",ang:"107°",hy:"sp³",dl:"1 doppietto libero",pol:1},
   {f:"H₂O",c:["O",C.warn],a:[["H",Hc,[.79,-.61,0]],["H",Hc,[-.79,-.61,0]]],lp:[[0,.57,.82],[0,.57,-.82]],nm:"angolare (a V)",ang:"104,5°",hy:"sp³",dl:"2 doppietti liberi",pol:1}],G=GEO[p.mol];
  let mx,my,L;if(wide){line(g,bw,14,bw,H-14,C.line,1.5);txt(g,"Geometria (VSEPR)",bw+14,16,C.muted,12,"left",true);mx=W*.78;my=H*.38;L=Math.min(W*.11,H*.2);}
  else{line(g,14,bh,W-14,bh,C.line,1.5);txt(g,"Geometria (VSEPR)",12,bh+16,C.muted,12,"left",true);mx=W*.7;my=bh+(H-bh)*.55;L=Math.min((H-bh)*.3,W*.15);}
  const a=st.t*.7,b=.35,ca=Math.cos(a),sa=Math.sin(a),cb=Math.cos(b),sb=Math.sin(b);
  const Pj=v=>{const x=v[0]*ca+v[2]*sa,z=-v[0]*sa+v[2]*ca,y=v[1]*cb-z*sb,zz=v[1]*sb+z*cb;return[mx+x*L,my-y*L,zz];};const it=[];
  G.a.forEach(([el,col,v])=>{const q=Pj(v);it.push({z:q[2],d:()=>{line(g,mx,my,q[0],q[1],C.muted,4);atm(g,q[0],q[1],(el==="H"?.19:.26)*L*(1+q[2]*.12),col,el,el==="H"?C.ink:C.card);}});});
  G.lp.forEach(v=>{const q=Pj([v[0]*.8,v[1]*.8,v[2]*.8]);it.push({z:q[2],d:()=>{const an=Math.atan2(q[1]-my,q[0]-mx),len=Math.hypot(q[0]-mx,q[1]-my);g.save();g.translate(mx+Math.cos(an)*len*.62,my+Math.sin(an)*len*.62);g.rotate(an);
   g.fillStyle=A_(C.fam,.25);g.strokeStyle=A_(C.fam,.7);g.lineWidth=1.2;g.beginPath();g.ellipse(0,0,Math.max(9,len*.5),L*.17,0,0,7);g.fill();g.stroke();circ(g,0,-4,2.4,C.fam);circ(g,0,4,2.4,C.fam);g.restore();}});});
  it.sort((u,v)=>u.z-v.z);it.filter(o=>o.z<0).forEach(o=>o.d());atm(g,mx,my,L*.29,G.c[1],G.c[0],C.card);it.filter(o=>o.z>=0).forEach(o=>o.d());txt(g,G.c[0],mx,my+.5,C.card,Math.round(L*.26),"center",true);
  const info=[[G.f,C.ink,15,1],[G.nm,C.ink,12,1],["angolo "+G.ang,C.muted,12,0],["ibridazione "+G.hy,C.muted,12,0],[G.dl,C.fam,12,0],[G.pol?"molecola polare":"molecola apolare",G.pol?C.warn:C.ok,12,1]];
  if(wide)info.forEach(([s,c,z,bo],i)=>txt(g,s,mx,H*.66+i*18,c,z,"center",bo));else info.forEach(([s,c,z,bo],i)=>txt(g,s,12,bh+40+i*18,c,z,"left",bo));
  const tipo=ion?"ionico":pol?"covalente polare":"covalente apolare (puro)";
  return `Δχ = |${F2(p.xb,1)} − ${F2(p.xa,1)}| = <b>${F2(ad,1)}</b> → legame <b>${tipo}</b>${es?" (es. "+es+")":""}. ${ion?"L'atomo meno elettronegativo cede l'elettrone all'altro: si formano un catione e un anione tenuti insieme dall'attrazione elettrostatica.":pol?"La coppia di legame è spostata verso l'atomo più elettronegativo, che acquista una carica parziale δ−.":"La coppia di legame è condivisa in modo equo."} Soglie indicative: 0,4 e 1,9 (alcuni testi usano 1,7). ${G.f}: 4 regioni di elettroni intorno all'atomo centrale si dispongono il più lontano possibile → geometria <b>${G.nm}</b>, angolo ${G.ang}, molecola ${G.pol?"<b>polare</b>":"<b>apolare</b> (i dipoli di legame si annullano)"}.`.replace("4 regioni",G.a.length+G.lp.length===2?"2 regioni":G.a.length+G.lp.length===3?"3 regioni":"4 regioni");}},

/* ---------- c2a · dissoluzione, effetto idrofobico, legge di Henry ---------- */
dissoluzione:{h:330,c:[{k:"es",l:"Esperimento",seg:["NaCl in acqua","Olio in acqua","O₂: legge di Henry"],v:0},{k:"T",l:"Temperatura",min:0,max:40,st:1,v:25,u:" °C"},{k:"P",l:"Pressione di O₂ sul liquido (Henry)",min:.2,max:3,st:.1,v:1,u:" atm"}],
 init(st){st.ok=0;},
 f(g,p,st,dt,W,H){
  const bgw=()=>{st.wat=[];for(let i=0;i<70&&st.wat.length<34;i++){const x=20+rnd()*(W-40),y=24+rnd()*(H-44);if(st.box&&x>st.box[0]&&x<st.box[2]&&y>st.box[1]&&y<st.box[3])continue;st.wat.push({x,y,a:rnd()*6,va:(rnd()-.5)*2});}};
  if(!st.ok||st.k!==p.es||st.W!==W){st.ok=1;st.k=p.es;st.W=W;st.wait=0;st.acc=0;st.box=null;
   if(p.es===0){const s=Math.min(28,W/16,H/8),co=6,ro=4,ox=W/2-(co-1)*s/2,oy=H*.56-(ro-1)*s/2;st.s=s;st.ion=[];for(let r=0;r<ro;r++)for(let c=0;c<co;c++)st.ion.push({r,c,q:(r+c)%2?1:-1,free:0,x:ox+c*s,y:oy+r*s,vx:0,vy:0,rot:rnd()*6});st.box=[ox-s,oy-s,ox+co*s,oy+ro*s];}
   if(p.es===1){st.dr=[];for(let i=0;i<14;i++)st.dr.push({x:30+rnd()*(W-60),y:H*.42+rnd()*H*.46,r:5+rnd()*5});st.lay=0;}
   if(p.es===2)st.gp=[];
   bgw();}
  const kr=Math.exp(1700*(1/(p.T+273.15)-1/298.15));
  if(p.es<2){rr(g,10,10,W-20,H-20,10,A_(C.acc,.07),C.line);
   st.wat.forEach(w=>{w.x=cl(w.x+(rnd()-.5)*dt*40,20,W-20);w.y=cl(w.y+(rnd()-.5)*dt*40,22,H-20);w.a+=w.va*dt;});
   if(p.es===1)for(let i=0;i<st.wat.length;i++)for(let j=i+1;j<st.wat.length;j++){const a=st.wat[i],b=st.wat[j];if(Math.hypot(a.x-b.x,a.y-b.y)<40)line(g,a.x,a.y,b.x,b.y,A_(C.ok,.55),1,[2,3]);}
   st.wat.forEach(w=>wat(g,w.x,w.y,w.a,1,.55));}
  if(p.es===0){const s=st.s,key={};st.ion.forEach(o=>{if(!o.free)key[o.r+","+o.c]=1;});
   st.acc+=dt*1.2*Math.exp((p.T-25)/40);
   while(st.acc>=1){st.acc-=1;const cand=st.ion.filter(o=>!o.free&&[[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>!key[(o.r+a)+","+(o.c+b)]));if(!cand.length)break;const o=cand[rnd()*cand.length|0];o.free=1;delete key[o.r+","+o.c];const ccx=W/2,ccy=H*.56,an=Math.atan2(o.y-ccy,o.x-ccx);o.vx=Math.cos(an)*60;o.vy=Math.sin(an)*60;}
   const nf=st.ion.filter(o=>o.free).length;if(nf===st.ion.length){st.wait+=dt;if(st.wait>4)st.ok=0;}
   st.ion.forEach(o=>{if(!o.free)return;o.vx=(o.vx+(rnd()-.5)*200*dt)*.97;o.vy=(o.vy+(rnd()-.5)*200*dt)*.97;o.x+=o.vx*dt;o.y+=o.vy*dt;const m=26;if(o.x<m||o.x>W-m)o.vx*=-1;if(o.y<m+14||o.y>H-m)o.vy*=-1;o.x=cl(o.x,m,W-m);o.y=cl(o.y,m+14,H-m);});
   const ri=o=>o.q>0?s*.3:s*.44;
   st.ion.filter(o=>!o.free).sort((a,b)=>a.q-b.q).forEach(o=>atm(g,o.x,o.y,ri(o),o.q>0?C.acc:C.ok,o.q>0?"+":"−",C.card,13));
   st.ion.filter(o=>o.free).forEach(o=>{const R=ri(o)+9;for(let k=0;k<6;k++){const th=o.rot+k*PI/3+st.t*.4;wat(g,o.x+Math.cos(th)*R,o.y+Math.sin(th)*R,o.q>0?th:th+PI,1);}atm(g,o.x,o.y,ri(o),o.q>0?C.acc:C.ok,o.q>0?"+":"−",C.card,13);});
   circ(g,24,26,6,C.acc);txt(g,"Na⁺",34,26,C.ink,12);circ(g,78,26,8,C.ok);txt(g,"Cl⁻",90,26,C.ink,12);wat(g,132,26,-PI/2,1);txt(g,"H₂O",142,26,C.ink,12);
   const sol=35.65+.019*p.T;
   return `Ioni passati in soluzione: <b>${nf} su ${st.ion.length}</b>. L'acqua è un solvente polare: verso Na⁺ si orienta l'ossigeno (δ−), verso Cl⁻ gli idrogeni (δ+). Sono interazioni ione-dipolo: ogni ione si circonda di una <b>sfera di idratazione</b> che vince l'energia del reticolo. Solubilità di NaCl a ${p.T} °C ≈ <b>${F2(sol,1)} g/100 mL</b>: cambia pochissimo con la temperatura (il calore accelera solo la dissoluzione). NaCl è un elettrolita forte: la soluzione conduce.`;}
  if(p.es===1){const th=PI*st.lay/(W-20),yS=12+th;
   st.dr.forEach((d,i)=>{d.y-=(10+d.r*1.3)*dt*(1+(p.T-25)/120);d.x+=Math.sin(st.t+i)*dt*6;});
   for(let i=0;i<st.dr.length;i++)for(let j=i+1;j<st.dr.length;j++){const a=st.dr[i],b=st.dr[j];if(!a.dead&&!b.dead&&Math.hypot(a.x-b.x,a.y-b.y)<a.r+b.r){a.x=(a.x*a.r*a.r+b.x*b.r*b.r)/(a.r*a.r+b.r*b.r);a.y=Math.min(a.y,b.y);a.r=Math.hypot(a.r,b.r);b.dead=1;}}
   st.dr.forEach(d=>{if(!d.dead&&d.y-d.r<=yS){st.lay+=d.r*d.r;d.dead=1;}});st.dr=st.dr.filter(d=>!d.dead);
   if(!st.dr.length){st.wait+=dt;if(st.wait>4)st.ok=0;}
   if(th>.5){rr(g,11,11,W-22,th,6,A_(C.soon,.45));if(th>12)txt(g,"strato d'olio (d ≈ 0,9 g/mL)",W/2,11+th/2,C.ink,12,"center",true);}
   st.dr.forEach(d=>circ(g,d.x,d.y,d.r,A_(C.soon,.6),C.soon,1.5));
   txt(g,"● gocce d'olio",20,H-22,C.soon,12,"left",true);txt(g,"- - legami H tra molecole d'acqua",W-20,H-22,C.ok,12,"right");
   return `I trigliceridi dell'olio sono <b>apolari</b>: non formano legami a idrogeno con l'acqua. L'acqua «preferisce» restare legata a sé stessa (linee tratteggiate), così le gocce si uniscono (${st.dr.length} ancora in sospensione) e, meno dense, salgono a formare uno strato separato: miscela <b>eterogenea</b>. È l'<b>effetto idrofobico</b>, lo stesso che tiene insieme le membrane: il simile scioglie il simile. La temperatura (${p.T} °C) non lo rende solubile.`;}
  /* legge di Henry */
  const yS=H*.46,top=34,bx0=12,bx1=W-12;
  rr(g,bx0,top,bx1-bx0,H-top-10,8,null,C.line);g.fillStyle=A_(C.acc,.13);g.fillRect(bx0+1,yS,bx1-bx0-2,H-10-yS-1);line(g,bx0,yS,bx1,yS,C.acc,2);
  rr(g,bx0+2,top-10,bx1-bx0-4,10,3,C.muted);const na=Math.round(1+p.P);for(let i=0;i<na;i++){const x=bx0+(bx1-bx0)*(i+1)/(na+1);arrow(g,x,6,x,top-12,C.ink,2);}
  txt(g,"p(O₂) = "+F2(p.P,1)+" atm",bx0+6,top+12,C.ink,13,"left",true);txt(g,"T = "+p.T+" °C",bx1-6,top+12,C.ink,13,"right",true);
  const nG=Math.min(20,Math.round(6*p.P)),nL=Math.round(6*p.P*kr);let ng=0,nl=0;st.gp.forEach(q=>{if(q.ph==="g"||q.ph==="up")ng++;else nl++;});
  if(nl<nL&&rnd()<dt*4){const c=st.gp.filter(q=>q.ph==="g");if(c.length){const q=c[rnd()*c.length|0];q.ph="dn";q.vy=50;q.ty=yS+18+rnd()*(H-yS-40);}}
  if(nl>nL&&rnd()<dt*4){const c=st.gp.filter(q=>q.ph==="l");if(c.length){const q=c[rnd()*c.length|0];q.ph="up";q.vy=-50;}}
  if(ng<nG&&rnd()<dt*8)st.gp.push({x:bx0+20+rnd()*(bx1-bx0-40),y:top+4,vx:(rnd()-.5)*120,vy:40+rnd()*40,ph:"g",a:rnd()*6});
  if(ng>nG+1&&rnd()<dt*6){const i=st.gp.findIndex(q=>q.ph==="g");if(i>=0)st.gp.splice(i,1);}
  const sp=60*Math.sqrt((p.T+273)/300);
  st.gp.forEach(q=>{q.a+=dt*2;if(q.ph==="g"){q.x+=q.vx*dt;q.y+=q.vy*dt;if(q.x<bx0+8||q.x>bx1-8)q.vx*=-1;if(q.y<top+6||q.y>yS-6)q.vy*=-1;q.x=cl(q.x,bx0+8,bx1-8);q.y=cl(q.y,top+6,yS-6);if(Math.hypot(q.vx,q.vy)<20){q.vx=sp;q.vy=sp;}}
   else if(q.ph==="dn"){q.y+=60*dt;if(q.y>(q.ty||yS+14))q.ph="l";}else if(q.ph==="up"){q.y-=50*dt;if(q.y<yS-14){q.ph="g";q.vy=-sp;q.vx=(rnd()-.5)*2*sp;}}
   else{q.x=cl(q.x+(rnd()-.5)*dt*60,bx0+8,bx1-8);q.y=cl(q.y+(rnd()-.5)*dt*60,yS+8,H-18);}
   const dx=Math.cos(q.a)*3,dy=Math.sin(q.a)*3;circ(g,q.x-dx,q.y-dy,3.6,C.acc);circ(g,q.x+dx,q.y+dy,3.6,C.acc);});
  const c=1.3*kr*p.P;txt(g,"O₂ disciolto: "+F2(c,2)+" mmol/L",bx0+8,H-22,C.ink,13,"left",true);txt(g,"acqua",bx1-8,H-22,C.muted,12,"right");
  return `Legge di Henry: c = k<sub>H</sub> · p. Con p(O₂) = ${F2(p.P,1)} atm a ${p.T} °C si sciolgono circa <b>${F2(c,2)} mmol/L</b> di O₂ (k<sub>H</sub> ≈ ${F2(1.3*kr,2)} mmol/L·atm). Raddoppiando la pressione raddoppia il gas disciolto; scaldando il liquido la solubilità dei gas <b>diminuisce</b>. Nel plasma a 37 °C (p(O₂) ≈ 0,13 atm) se ne scioglie solo ≈ 0,14 mmol/L: per questo serve l'emoglobina. Risalire troppo in fretta da un'immersione libera bolle di N₂: malattia da decompressione.`;}},

/* ---------- c5a · stereochimica: enantiomeri, R/S, D/L, potere ottico rotatorio ---------- */
chiralita:{h:360,c:[{k:"r",l:"Quota di (R)-gliceraldeide nel campione",min:0,max:100,st:5,v:100,u:"%"},{k:"vis",l:"Rappresentazione",seg:["Cunei (R/S)","Fischer (D/L)"],v:0}],
 f(g,p,st,dt,W,H){const top=H*.6,mx=W/2,L=Math.min(W*.12,top*.3),fs=L>45?13:11;
  line(g,mx,10,mx,top-12,C.muted,1.5,[6,5]);txt(g,"specchio",mx,top-4,C.muted,11,"center");
  const pulse=.5+.5*Math.sin(st.t*3);
  [[W*.25,1],[W*.75,-1]].forEach(([cx,sg])=>{const cy=top*.46;
   if(p.vis===0){const G=[["OH",-30,C.warn,"1"],["CHO",90,C.soon,"2"],["CH₂OH",210,C.acc,"3"]];
    const ang=a=>(sg>0?a:180-a)*PI/180;
    const hx=cx,hy=cy-L*.62;hashb(g,cx,cy,hx,hy,C.muted,9);txt(g,"H",hx,hy-10,C.muted,fs,"center",true);
    G.forEach(([s,a,c,n])=>{const x=cx+Math.cos(ang(a))*L,y=cy+Math.sin(ang(a))*L;line(g,cx,cy,x-Math.cos(ang(a))*12,y-Math.sin(ang(a))*12,C.ink,3);const w=pill(g,x,y,s,c,fs);const bx=x+(Math.cos(ang(a))>=0?1:-1)*(w/2+8);circ(g,bx,y-11,8,C.card,c,1.5);txt(g,n,bx,y-11,c,11,"center",true);});
    circ(g,cx,cy,5,C.ink);
    const pr=cl((st.t%3.2)/2.2,0,1),a0=ang(-30),sw=sg*240*PI/180*pr,R=L*.45;if(pr>.02){g.strokeStyle=C.fam;g.lineWidth=2.5;g.beginPath();g.arc(cx,cy,R,a0,a0+sw,sg<0);g.stroke();const ae=a0+sw,tx=-Math.sin(ae)*sg,ty=Math.cos(ae)*sg,ex=cx+Math.cos(ae)*R,ey=cy+Math.sin(ae)*R;g.fillStyle=C.fam;g.beginPath();g.moveTo(ex+tx*7,ey+ty*7);g.lineTo(ex-tx*2+Math.cos(ae)*5,ey-ty*2+Math.sin(ae)*5);g.lineTo(ex-tx*2-Math.cos(ae)*5,ey-ty*2-Math.sin(ae)*5);g.closePath();g.fill();}
    txt(g,sg>0?"(R) · senso orario":"(S) · senso antiorario",cx,top-24,C.fam,fs,"center",true);}
   else{const ty=cy-L*.95,by=cy+L*.95,sx=L*.95;line(g,cx,ty+10,cx,by-10,C.ink,3);line(g,cx-sx+16,cy,cx+sx-16,cy,C.ink,3);
    pill(g,cx,ty,"CHO",C.soon,fs);pill(g,cx,by,"CH₂OH",C.acc,fs);
    g.globalAlpha=.55+.45*pulse;pill(g,cx+sg*sx,cy,"OH",C.warn,fs);g.globalAlpha=1;pill(g,cx-sg*sx,cy,"H",C.muted,fs);
    txt(g,sg>0?"D-(+) · OH a destra":"L-(−) · OH a sinistra",cx,top-24,C.fam,fs,"center",true);}
   txt(g,sg>0?"(R)-gliceraldeide":"(S)-gliceraldeide",cx,14,sg>0?C.ink:C.ink,fs,"center",true);});
  /* polarimetro */
  const net=(2*p.r-100)/100,al=8.7*net,ad=al*4*PI/180,py=top+(H-top)*.42,x0=14,xp=W*.15,xt1=W*.3,xt2=W*.66,xa=W*.82,amp=Math.min(16,(H-top)*.18);
  circ(g,x0+10,py,9,C.soon);txt(g,"luce",x0+10,py+24,C.muted,11,"center");
  rr(g,xt1,py-amp-10,xt2-xt1,2*amp+20,8,A_(p.r>50?C.ok:p.r<50?C.fam:C.muted,.12+.18*Math.abs(net)),C.line);
  g.strokeStyle=C.acc;g.lineWidth=2;g.beginPath();for(let x=x0+20;x<=xa;x+=2){const th=x<xt1?0:x>xt2?ad:ad*(x-xt1)/(xt2-xt1),y=py-amp*Math.cos(th)*Math.sin((x-st.t*90)/9);x===x0+20?g.moveTo(x,y):g.lineTo(x,y);}g.stroke();
  const pol=(x,th,col)=>{g.strokeStyle=C.muted;g.lineWidth=1.5;g.beginPath();g.ellipse(x,py,7,amp+8,0,0,7);g.stroke();const dx=Math.sin(th)*(amp+4),dy=-Math.cos(th)*(amp+4);arrow(g,x,py,x+dx,py+dy,col,2.5);arrow(g,x,py,x-dx,py-dy,col,2.5);};
  pol(xp,0,C.ink);pol(xa,ad,C.warn);if(Math.abs(ad)>.01)line(g,xa,py-amp-8,xa,py+amp+8,C.muted,1,[3,3]);
  txt(g,"campione: "+p.r+"% R · "+(100-p.r)+"% S",(xt1+xt2)/2,py+amp+22,C.muted,11,"center");
  txt(g,"α = "+(al>0?"+":al<0?"−":"")+F2(Math.abs(al),1)+"°",Math.min(xa,W-40),py-amp-20,C.warn,13,"center",true);
  const kind=Math.abs(al)<.05?"<b>nessuna rotazione</b>: è una miscela racemica (50:50), otticamente inattiva":al>0?"la luce ruota in senso orario: campione <b>destrogiro (+)</b>":"la luce ruota in senso antiorario: campione <b>levogiro (−)</b>";
  return `Campione con ${p.r}% di (R) e ${100-p.r}% di (S): α osservato = <b>${al>0?"+":al<0?"−":""}${F2(Math.abs(al),1)}°</b> → ${kind}. I due enantiomeri sono immagini speculari non sovrapponibili: hanno le stesse proprietà fisiche, ma ruotano la luce polarizzata di angoli uguali e opposti. ${p.vis===0?"R/S: guarda la molecola con H (priorità 4) dietro e segui 1 → 2 → 3 (OH > CHO > CH₂OH).":"Fischer: verticali dietro il foglio, orizzontali verso di te; OH del C chirale a destra = D. D/L e (+)/(−) non coincidono sempre (qui sì)."} Nel disegno la rotazione è ingrandita 4 volte.`;}},

/* ---------- c5b · sostituzione nucleofila SN2 / SN1 ---------- */
sn1sn2:{h:340,c:[{k:"sub",l:"Substrato R–Br",seg:["Metile","Primario","Secondario","Terziario"],v:1},{k:"nu",l:"Concentrazione del nucleofilo [OH⁻]",min:.1,max:2,st:.1,v:1,u:" M"}],
 init(st){st.cy=-1;st.inv=0;st.ret=0;st.side=-1;},
 f(g,p,st,dt,W,H){const k2=[30,1,.02,0][p.sub],k1=[0,0,.012,1.2][p.sub],v2=k2*p.nu,v1=k1,mech=v2>=v1?2:1;
  const wide=W>=560,cx=wide?W*.31:W/2,cy=wide?H*.5:H*.32,L=wide?Math.min(W*.1,H*.17):Math.min(W*.13,H*.13);
  const T=mech===2?4:5,cyc=Math.floor(st.t/T),s=(st.t%T)/T;
  if(cyc!==st.cy||st.mech!==mech){st.cy=cyc;st.mech=mech;st.side=rnd()<.5?-1:1;if(mech===1){st.side<0?st.inv++:st.ret++;}}
  const subs=[["H","H","H"],["CH₃","H","H"],["CH₃","CH₃","H"],["CH₃","CH₃","CH₃"]][p.sub];
  let u=1,nuX=-2.6,brX=1.05,nuB=0,brB=2,plus=0,brA=1,cap="",ts=0;
  if(mech===2){if(s<.35){nuX=L01(-2.6,-1.5,s/.35);}else if(s<.65){const e=(s-.35)/.3;nuX=L01(-1.5,-1.05,e);u=L01(1,-1,e);brX=L01(1.05,1.45,e);nuB=1;brB=1;ts=e>.25&&e<.75;}else{nuX=-1.05;u=-1;brX=L01(1.45,2.6,(s-.65)/.35);nuB=2;brB=0;brA=1-cl((s-.85)/.15,0,1);}
   cap=s<.35?"1 · OH⁻ si avvicina dal lato opposto a Br":s<.65?"‡ stato di transizione: C pentacoordinato":"inversione di configurazione (Walden)";}
  else{if(s<.3){const e=s/.3;brX=L01(1.05,1.6,e);u=L01(1,0,e);brB=e>.4?1:2;plus=e>.6;nuX=-2.6;}else if(s<.55){brX=L01(1.6,2.6,(s-.3)/.25);u=0;brB=0;plus=1;}else if(s<.85){const e=(s-.55)/.3;brX=2.6;brB=0;brA=1-cl(e*2,0,1);nuX=st.side*L01(2.6,1.05,e);u=e>.6?L01(0,st.side,(e-.6)/.4):0;nuB=e>.6?1:0;plus=e<.8;}else{brA=0;brB=0;nuX=st.side*1.05;u=st.side;nuB=2;}
   cap=s<.3?"1 · Br⁻ se ne va (stadio lento)":s<.55?"carbocatione planare (sp²)":s<.85?"2 · OH⁻ attacca da "+(st.side<0?"sinistra":"destra"):(st.side<0?"inversione":"ritenzione")+": in media 50:50 → racemo";}
  const P=v=>[cx+(v[0]+v[2]*.5)*L,cy+(v[1]-v[2]*.25)*L];
  const xc=-u/3,rad=Math.sqrt(1-xc*xc),dirs=[-90,30,150].map(a=>[xc,rad*Math.sin(a*PI/180),rad*Math.cos(a*PI/180)]);
  const it=dirs.map((d,i)=>({z:d[2],d,s:subs[i]})).sort((a,b)=>a.z-b.z);
  const C0=P([0,0,0]),Nu=P([nuX,0,0]),Br=P([brX,0,0]);
  if(brA>0&&brB){line(g,C0[0],C0[1],Br[0],Br[1],C.ink,3,brB===1?[4,4]:null);}
  if(nuB)line(g,C0[0],C0[1],Nu[0],Nu[1],C.ink,3,nuB===1?[4,4]:null);
  it.forEach(o=>{const q=P(o.d);line(g,C0[0],C0[1],q[0],q[1],C.muted,3);if(o.s==="H")atm(g,q[0],q[1],L*.22,C.card,"H",C.ink);else atm(g,q[0],q[1],L*.38,A_(C.muted,.85),"CH₃",C.card,Math.max(9,Math.round(L*.27)));});
  atm(g,C0[0],C0[1],L*.3,C.ink,"C",C.card);if(plus)txt(g,"+",C0[0]+L*.32,C0[1]-L*.36,C.warn,16,"center",true);
  if(brA>0){g.globalAlpha=brA;atm(g,Br[0],Br[1],L*.42,C.fam,brB===2?"Br":"Br⁻",C.card,Math.max(10,Math.round(L*.3)));g.globalAlpha=1;}
  const nuShow=mech===2||s>=.55;if(nuShow)atm(g,Nu[0],Nu[1],L*.36,C.warn,nuB===2?"OH":"OH⁻",C.card,Math.max(9,Math.round(L*.27)));
  if(mech===2&&s>.12&&s<.4)curv(g,Nu[0]+L*.38,Nu[1]-4,C0[0]-L*.35,C0[1]-4,-.35,C.soon,2);
  if(ts){g.strokeStyle=C.muted;g.lineWidth=1.5;const bl=Nu[0]-L*.5,br2=Br[0]+L*.5,bt=cy-L*1.3,bb=cy+L*1.3;g.beginPath();g.moveTo(bl+6,bt);g.lineTo(bl,bt);g.lineTo(bl,bb);g.lineTo(bl+6,bb);g.moveTo(br2-6,bt);g.lineTo(br2,bt);g.lineTo(br2,bb);g.lineTo(br2-6,bb);g.stroke();txt(g,"‡",br2+8,bt,C.muted,14,"left",true);}
  txt(g,cap,wide?cx:W/2,wide?H*.13:14,C.ink,12,"center",true);
  if(mech===1)txt(g,"SN1: inversione "+st.inv+" · ritenzione "+st.ret,wide?cx:W/2,wide?H*.9:cy+L*1.65,C.muted,11,"center");
  /* barre di velocità */
  const bx=wide?W*.64:16,bwid=wide?W*.33:W-32,by=wide?H*.28:H*.68,lg=v=>v<=0?0:cl((Math.log10(v)+4)/6,0,1);
  txt(g,"velocità relativa (scala log)",bx,by-16,C.muted,12,"left",true);
  [["SN2  v = k[RX][Nu⁻]",v2,C.acc,mech===2],["SN1  v = k[RX]",v1,C.fam,mech===1]].forEach(([l,v,c,on],i)=>{const y=by+i*(wide?70:46);txt(g,l,bx,y+2,on?c:C.muted,12,"left",on);rr(g,bx,y+12,bwid,12,6,A_(C.muted,.15));
   const w=lg(v)*bwid;if(w>0)rr(g,bx,y+12,Math.max(6,w),12,6,on?c:A_(c,.45));txt(g,v<=0||v<1e-4?"≈ 0":F2(v,3),w>bwid-50?bx+w-6:bx+w+8,y+18,v>0&&w>bwid-50?C.card:C.ink,11,w>bwid-50?"right":"left",true);});
  const nm=["CH₃Br (metile)","primario (es. CH₃CH₂Br)","secondario (es. 2-bromopropano)","terziario (es. 2-bromo-2-metilpropano)"][p.sub];
  const body=mech===2?`prevale la <b>SN2</b>: un solo stadio, OH⁻ attacca il carbonio dal lato opposto al bromo e la configurazione si <b>inverte</b>. v = k[RX][Nu⁻]: raddoppiando [OH⁻] raddoppia. L'ingombro dei gruppi CH₃ la rallenta: metile > primario > secondario ≫ terziario.`:`prevale la <b>SN1</b>: prima esce Br⁻ (stadio lento) e si forma un <b>carbocatione</b> planare, stabilizzato dai gruppi alchilici elettron-donatori (effetto induttivo +I); poi OH⁻ attacca da entrambe le facce → miscela racemica. v = k[RX] non dipende da [OH⁻].`;
  return `Substrato ${nm}: v(SN2) ≈ ${v2<=0?"0":F2(v2,3)}, v(SN1) ≈ ${v1<=0?"0":F2(v1,3)} → ${body}${p.sub===2?" Nei secondari i due meccanismi competono: prova ad alzare o abbassare [OH⁻].":""}${p.sub===3?" Con basi forti e calore compete l'eliminazione (E1/E2) che dà un alchene.":""}`;}},

/* ---------- c6a · legame a idrogeno e punto di ebollizione (alcoli, eteri, tioli, ammine) ---------- */
ebollizione:{h:330,c:[{k:"m",l:"Composto (massa molare simile)",seg:["Propano","Dimetiletere","Etantiolo","Etilammina","Etanolo"],v:4},{k:"T",l:"Temperatura",min:-60,max:100,st:1,v:25,u:" °C"}],
 init(st){st.P=null;},
 f(g,p,st,dt,W,H){const D=[{n:"Propano",s:"propano",f:"CH₃CH₂CH₃",M:44,bp:-42,h:0,c:null,fz:"solo deboli forze di London (molecola apolare)"},
   {n:"Dimetiletere",s:"etere",f:"CH₃OCH₃",M:46,bp:-24,h:0,c:C.warn,fz:"interazioni dipolo-dipolo: l'O può accettare legami H ma non ha H legati all'O da donare"},
   {n:"Etantiolo",s:"tiolo",f:"CH₃CH₂SH",M:62,bp:35,h:0,c:C.soon,fz:"il legame S–H è poco polare: legami H trascurabili, contano dipolo e London (molecola più pesante)"},
   {n:"Etilammina",s:"ammina",f:"CH₃CH₂NH₂",M:45,bp:17,h:1,c:C.acc,fz:"legami a idrogeno N–H···N, più deboli di quelli O–H···O (N è meno elettronegativo di O)"},
   {n:"Etanolo",s:"etanolo",f:"CH₃CH₂OH",M:46,bp:78,h:2,c:C.warn,fz:"legami a idrogeno O–H···O, forti"}],m=D[p.m];
  const wide=W>=560,bx0=12,by0=12,bx1=wide?W*.56:W-12,by1=wide?H-12:H*.56,bw=bx1-bx0,bh=by1-by0,N=16;
  if(!st.P){st.P=[];for(let i=0;i<N;i++)st.P.push({x:.1+rnd()*.8,y:.6+rnd()*.35,vx:rnd()-.5,vy:rnd()-.5,a:rnd()*6,va:(rnd()-.5)*3});}
  const gasF=p.T>=m.bp?1:Math.min(1,.45*Math.exp(-(m.bp-p.T)/12)),nGas=Math.round(N*gasF),jit=(p.T+273)/300,sp=.45*Math.sqrt(jit);
  rr(g,bx0,by0,bw,bh,10,A_(C.acc,.05),C.line);
  st.P.forEach((q,i)=>{q.a+=q.va*dt*jit;const gas=i<nGas;
   if(gas){if(Math.hypot(q.vx,q.vy)<.3){const an=rnd()*6;q.vx=Math.cos(an);q.vy=Math.sin(an);}const n=Math.hypot(q.vx,q.vy);q.x+=q.vx/n*sp*dt;q.y+=q.vy/n*sp*dt;if(q.x<.05||q.x>.95)q.vx*=-1;if(q.y<.07||q.y>.93)q.vy*=-1;q.x=cl(q.x,.05,.95);q.y=cl(q.y,.07,.93);}
   else{const k=i-nGas,co=6,col=k%co,row=Math.floor(k/co),sx=(col+.6+(row%2)*.4)/(co+.4),sy=.9-row*.15;q.x+=(sx-q.x)*Math.min(1,dt*2.5)+(rnd()-.5)*dt*.12*jit;q.y+=(sy-q.y)*Math.min(1,dt*2.5)+(rnd()-.5)*dt*.12*jit;q.vx=rnd()-.5;q.vy=rnd()-.5;}});
  const pos=q=>[bx0+q.x*bw,by0+q.y*bh],head=q=>{const[x,y]=pos(q);return[x+Math.cos(q.a)*7,y+Math.sin(q.a)*7];};
  if(m.h)for(let i=nGas;i<N;i++)for(let j=i+1;j<N;j++){const a=head(st.P[i]),b=head(st.P[j]),dd=Math.hypot(a[0]-b[0],a[1]-b[1]);if(dd<bw/6.5*1.35&&Math.sin(st.t*2.5+i*1.7+j)>-.2)line(g,a[0],a[1],b[0],b[1],C.ok,m.h===2?2:1.3,[3,3]);}
  st.P.forEach(q=>{const[x,y]=pos(q),hx=x+Math.cos(q.a)*7,hy=y+Math.sin(q.a)*7,tx=x-Math.cos(q.a)*7,ty=y-Math.sin(q.a)*7;circ(g,tx,ty,5.5,A_(C.muted,.75));circ(g,x,y,6,A_(C.muted,.75));if(m.c)circ(g,hx,hy,4.6,m.c,C.card,1);else circ(g,hx,hy,5,A_(C.muted,.75));});
  txt(g,m.f,bx0+10,by0+14,C.ink,13,"left",true);txt(g,"T = "+p.T+" °C",bx1-10,by0+14,C.ink,13,"right",true);
  const state=p.T>=m.bp?"gas":"liquido";txt(g,state.toUpperCase(),bx1-10,by1-14,p.T>=m.bp?C.warn:C.acc,12,"right",true);
  if(m.h)txt(g,"- - legame H",bx0+10,by1-14,C.ok,11,"left",true);
  /* grafico dei punti di ebollizione */
  const gx0=wide?W*.63:44,gx1=W-14,gy0=wide?30:H*.6+8,gy1=wide?H-34:H-24,Y=T=>gy1-(T+60)/160*(gy1-gy0),cw=(gx1-gx0)/5;
  txt(g,"punto di ebollizione (°C)",gx0-(wide?0:30),gy0-14,C.muted,11,"left",true);
  [-40,0,40,80].forEach(T=>{line(g,gx0,Y(T),gx1,Y(T),C.line,1);txt(g,T,gx0-5,Y(T),C.muted,10,"right");});
  D.forEach((d,i)=>{const x=gx0+i*cw+cw*.18,w=cw*.64,on=i===p.m,col=d.c||C.muted;rr(g,x,Y(d.bp),w,Y(-60)-Y(d.bp),4,on?col:A_(col,.35),on?C.ink:null);txt(g,(d.bp>0?"+":"")+d.bp+"°",x+w/2,Y(d.bp)-8,C.ink,10,"center",on);txt(g,d.s,x+w/2,gy1+10,on?C.ink:C.muted,10,"center",on);});
  line(g,gx0,Y(p.T),gx1,Y(p.T),C.warn,2,[5,4]);txt(g,"T",gx1+2,Y(p.T),C.warn,11,"left",true);
  return `<b>${m.n}</b> (${m.f}, ${m.M} g/mol) bolle a <b>${m.bp} °C</b>: a ${p.T} °C è <b>${state}</b>. Tra le molecole: ${m.fz}. A parità di massa molare i legami a idrogeno alzano molto il punto di ebollizione: etanolo +78 °C, propano −42 °C. Alcoli e ammine piccoli sono anche solubili in acqua per lo stesso motivo.`;}},

/* ---------- c6b · addizione nucleofila al carbonile ---------- */
carbonile:{h:340,c:[{k:"cb",l:"Composto carbonilico",seg:["Formaldeide","Acetaldeide","Acetone"],v:1},{k:"nu",l:"Nucleofilo",seg:["H₂O","R'–OH (alcol)","R'–NH₂ (ammina)","H⁻ da NADH"],v:1}],
 f(g,p,st,dt,W,H){const wide=W>=560,cx=wide?W*.3:W*.5,cy=wide?H*.52:H*.37,L=wide?Math.min(W*.075,H*.16):Math.min(W*.115,H*.115);
  const T=7,s=(st.t%T)/T,sub=[["H","H"],["CH₃","H"],["CH₃","CH₃"]][p.cb],im=p.nu===2,ket=p.cb===2;
  const NU=[{a:"H₂O",b:"OH",c:C.acc},{a:"R'OH",b:"OR'",c:C.acc},{a:"R'NH₂",b:"NHR'",c:C.ok},{a:"H⁻",b:"H",c:C.soon}][p.nu];
  const e=im?cl((s-.7)/.18,0,1):0,q=s<.25?0:s<.5?(s-.25)/.25:1;
  const lp=(a,b,u)=>[L01(a[0],b[0],u),L01(a[1],b[1],u)];
  let O=lp([1.15,0],[.98,.32],q),R1=lp([-.87,-.5],[-.95,.28],q),R2=lp([-.87,.5],[-.12,.98],q),Nu=s<.25?lp([-.75,-2.15],[-.3,-1.05],s/.25):[-.3,-1.05],Oa=1;
  if(e>0){R1=lp(R1,[-.95,.55],e);R2=lp(R2,[.95,.55],e);Nu=lp(Nu,[0,-1.05],e);O=lp(O,[2.3,-.1],e*1.6);Oa=1-cl(e*1.6,0,1);}
  const P=v=>[cx+v[0]*L,cy+v[1]*L],c0=P([0,0]),o=P(O),r1=P(R1),r2=P(R2),nu=P(Nu);
  const prot=s>=.66,minus=s>=.42&&s<.66;
  if(Oa>0){g.globalAlpha=Oa;if(q<.5)dbl(g,c0[0],c0[1],o[0],o[1],C.ink,2.5,3);else if(e<.15)line(g,c0[0],c0[1],o[0],o[1],C.ink,2.5);g.globalAlpha=1;}
  line(g,c0[0],c0[1],r1[0],r1[1],C.ink,2.5);line(g,c0[0],c0[1],r2[0],r2[1],C.ink,2.5);
  if(s>=.25){if(e>.5)dbl(g,c0[0],c0[1],nu[0],nu[1],C.ink,2.5,3);else line(g,c0[0],c0[1],nu[0],nu[1],C.ink,2.5,s<.33?[4,4]:null);}
  [[r1,sub[0]],[r2,sub[1]]].forEach(([r,lab])=>pill(g,r[0],r[1],lab,C.muted,12));
  atm(g,c0[0],c0[1],L*.28,C.ink,"C",C.card);
  if(Oa>0){g.globalAlpha=Oa;atm(g,o[0],o[1],L*.28,C.warn,"O",C.card);if(minus)txt(g,"−",o[0]+L*.3,o[1]-L*.3,C.warn,18,"center",true);
   if(prot){const h=[o[0]+L*.48,o[1]-L*.22];line(g,o[0],o[1],h[0],h[1],C.ink,2);atm(g,h[0],h[1],L*.16,C.card,"H",C.ink);}g.globalAlpha=1;
   if(e>.3)txt(g,"H₂O",o[0],o[1]+L*.55,C.warn,12,"center",true);}
  if(s<.42){txt(g,"δ+",c0[0]+L*.3,c0[1]-L*.4,C.acc,13,"center",true);txt(g,"δ−",o[0],o[1]-L*.5,C.warn,13,"center",true);}
  const nuLab=s<.25?NU.a:e>.5?(p.nu===2?"NR'":NU.b):NU.b;pill(g,nu[0],nu[1],nuLab,NU.c,12);
  if(p.nu===3)txt(g,s<.25?"da NADH":"NADH → NAD⁺",nu[0]-L*.6,nu[1]-L*.55,C.soon,11,"center",s<.25);
  if(s>.08&&s<.3)curv(g,nu[0]+L*.2,nu[1]+L*.25,c0[0]-L*.1,c0[1]-L*.32,.3,C.soon,2);
  if(s>.24&&s<.44){const m=[(c0[0]+o[0])/2,(c0[1]+o[1])/2-4];curv(g,m[0],m[1],o[0]-L*.05,o[1]-L*.3,.5,C.soon,2);}
  if(s>.5&&s<.68){const hp=lp([2.3,-1],[O[0]+.5,O[1]-.22],(s-.5)/.16),h=P(hp);if(s<.66)atm(g,h[0],h[1],L*.18,C.card,"H⁺",C.ink,10);}
  const prodN=p.nu===0?"idrato (gem-diolo)":p.nu===1?(ket?"emichetale":"emiacetale"):p.nu===2?"immina (base di Schiff)":["metanolo (alcol primario)","etanolo (alcol primario)","2-propanolo (alcol secondario)"][p.cb];
  const cap=s<.25?"1 · il nucleofilo attacca il C δ+":s<.5?"2 · elettroni π sull'O: C diventa sp³":s<.7?"3 · l'O⁻ prende un H⁺":im&&s<.9?"4 · esce H₂O: si forma C=N":"prodotto: "+prodN;
  txt(g,cap,wide?cx:W/2,14,C.ink,12,"center",true);
  if(s>=.7&&(!im||s>=.9))txt(g,prodN,wide?cx:W/2,cy+L*1.7,C.fam,13,"center",true);
  /* reattività */
  const bx=wide?W*.6:16,bwid=wide?W*.36:W-32,by=wide?H*.3:H*.7,hyd=["99,9%","≈ 50%","≈ 0,1%"],rv=[1,.62,.25];
  txt(g,"reattività verso i nucleofili",bx,by-18,C.muted,12,"left",true);
  ["formaldeide","acetaldeide","acetone"].forEach((n,i)=>{const y=by+i*(wide?44:30),on=i===p.cb;txt(g,n+(p.nu===0?" · idrato "+hyd[i]:""),bx,y,on?C.ink:C.muted,11,"left",on);rr(g,bx,y+8,bwid,8,4,A_(C.muted,.15));rr(g,bx,y+8,bwid*rv[i],8,4,on?C.acc:A_(C.acc,.4));});
  const extra=["L'idrato è reversibile: quanto se ne forma dipende dal carbonile (percentuali a destra).",`Con un alcol si forma un ${ket?"emichetale":"emiacetale"} (C con –OH e –OR'); con un secondo alcol e catalisi acida diventa ${ket?"chetale":"acetale"}. Gli zuccheri si chiudono ad anello proprio così.`,"L'ammina primaria forma una carbinolammina che perde H₂O: immina C=N (base di Schiff). Così il piridossal fosfato lega gli amminoacidi e il retinale l'opsina.",`Lo ione idruro di NADH riduce il carbonile: aldeide → alcol primario, chetone → alcol secondario (es. alcol deidrogenasi: acetaldeide → etanolo).`][p.nu];
  return `Il carbonio del C=O è <b>δ+</b> (l'ossigeno è più elettronegativo) e viene attaccato dal nucleofilo: <b>addizione nucleofila</b>, il C passa da sp² planare a sp³ tetraedrico. ${extra} Le aldeidi reagiscono più dei chetoni: meno ingombro e meno gruppi alchilici elettron-donatori sul C.`;}},

/* ---------- c6c · acidità degli acidi carbossilici ---------- */
carbossile:{h:340,c:[{k:"ac",l:"Acido",seg:["Acetico (pKa 4,76)","Lattico (3,86)","Piruvico (2,5)","Fenolo (10,0)"],v:0},{k:"pH",l:"pH della soluzione",min:0,max:14,st:.1,v:7.4}],
 init(st){st.m=null;st.hp=[];st.acc=0;},
 f(g,p,st,dt,W,H){const pKa=[4.76,3.86,2.5,10][p.ac],nm=["acido acetico","acido lattico","acido piruvico","fenolo"][p.ac],an=["acetato","lattato","piruvato","fenossido"][p.ac],a=1/(1+Math.pow(10,pKa-p.pH));
  const wide=W>=560,bx0=12,bx1=wide?W*.44:W-12,by0=wide?H*.38:12,by1=wide?H-12:H*.42,bw=bx1-bx0,bh=by1-by0,N=20;
  if(!st.m){st.m=[];for(let i=0;i<N;i++)st.m.push({x:.1+rnd()*.8,y:.15+rnd()*.75,d:i<Math.round(N*a),f:0});st.hp=[];}
  const nd=Math.round(N*a);st.acc+=dt;if(st.acc>.12){st.acc=0;const cur=st.m.filter(o=>o.d).length;if(cur!==nd){const c=st.m.filter(o=>o.d===(cur>nd));const o=c[rnd()*c.length|0];o.d=!o.d;o.f=.5;if(o.d)st.hp.push({x:o.x,y:o.y,vx:(rnd()-.5)*.6,vy:-.3-rnd()*.3,l:.9});}}
  rr(g,bx0,by0,bw,bh,10,A_(C.acc,.06),C.line);
  const nH=cl(Math.round((7-p.pH)*1.8),0,12),nO=cl(Math.round((p.pH-7)*1.8),0,12);
  for(let i=0;i<nH+nO;i++){const x=bx0+bw*(.05+.9*((i*.618+.13)%1)),y=by0+bh*(.1+.8*((i*.381+.27)%1))+Math.sin(st.t*2+i)*3;circ(g,x,y,3.2,i<nH?C.soon:C.ok);}
  st.m.forEach(o=>{o.x=cl(o.x+(rnd()-.5)*dt*.12,.08,.92);o.y=cl(o.y+(rnd()-.5)*dt*.12,.14,.9);o.f=Math.max(0,o.f-dt);const x=bx0+o.x*bw,y=by0+o.y*bh;if(o.f>0)circ(g,x,y,18*(1-o.f)+6,null,A_(C.soon,o.f*1.6),2);pill(g,x,y,o.d?"A⁻":"HA",o.d?C.warn:C.acc,11);});
  st.hp=st.hp.filter(h=>(h.l-=dt)>0);st.hp.forEach(h=>{h.x+=h.vx*dt*.4;h.y+=h.vy*dt*.4;g.globalAlpha=cl(h.l,0,1);txt(g,"H⁺",bx0+h.x*bw,by0+h.y*bh,C.soon,11,"center",true);g.globalAlpha=1;});
  txt(g,"● H₃O⁺",bx1-80,by0+12,C.soon,11,"left",true);txt(g,"● OH⁻",bx1-80,by0+26,C.ok,11,"left",true);txt(g,nd+" A⁻ su "+N,bx0+10,by0+12,C.ink,12,"left",true);
  if(wide){const rx=W*.2,ry=H*.17,R=Math.min(W*.045,H*.085);txt(g,p.ac<3?"carbossilato: risonanza":"fenossido: carica sull'anello",rx,14,C.muted,12,"center",true);
   if(p.ac<3){const ph=Math.floor(st.t/1.2)%2,c0=[rx,ry],oa=[rx+R*.95,ry-R*.65],ob=[rx+R*.95,ry+R*.65],rr0=[rx-R*1.2,ry];
    line(g,c0[0],c0[1],rr0[0],rr0[1],C.ink,2.5);pill(g,rr0[0]-6,rr0[1],"R",C.muted,12);
    [[oa,ph===0],[ob,ph===1]].forEach(([q,d])=>{if(d)dbl(g,c0[0],c0[1],q[0],q[1],C.ink,2.2,2.6);else line(g,c0[0],c0[1],q[0],q[1],C.ink,2.2);atm(g,q[0],q[1],R*.3,C.warn,"O",C.card);if(!d)txt(g,"−",q[0]+R*.38,q[1]-R*.3,C.warn,16,"center",true);});
    atm(g,c0[0],c0[1],R*.28,C.ink,"C",C.card);txt(g,"½− su ciascun O",rx,ry+R*1.35,C.warn,11,"center",true);}
   else{const ph=Math.floor(st.t/1)%3;g.strokeStyle=C.ink;g.lineWidth=2;g.beginPath();for(let k=0;k<=6;k++){const an2=-PI/2+k*PI/3,x=rx+Math.cos(an2)*R,y=ry+R*.25+Math.sin(an2)*R;k?g.lineTo(x,y):g.moveTo(x,y);}g.stroke();circ(g,rx,ry+R*.25,R*.55,null,A_(C.ink,.5),1.2);
    const tp=[rx,ry+R*.25-R];line(g,tp[0],tp[1],tp[0],tp[1]-R*.55,C.ink,2);atm(g,tp[0],tp[1]-R*.75,R*.25,C.warn,"O",C.card);
    const sites=[1,5,3];const k=sites[ph],an2=-PI/2+k*PI/3;txt(g,"−",rx+Math.cos(an2)*R*1.35,ry+R*.25+Math.sin(an2)*R*1.35,C.warn,18,"center",true);txt(g,"orto / para",rx,ry+R*1.75,C.warn,11,"center",true);}}
  /* curva di dissociazione */
  const gx=wide?W*.53:44,gw=wide?W*.43:W-64,gy=wide?28:H*.5+10,gh=wide?H-72:H*.5-46,X=v=>gx+v/14*gw,Y=v=>gy+gh-v*gh;
  axes(g,gx,gy,gw,gh,"pH","% A⁻");[0,50,100].forEach(v=>txt(g,v,gx-6,Y(v/100),C.muted,10,"right"));for(let v=0;v<=14;v+=2)txt(g,v,X(v),gy+gh+11,C.muted,10,"center");
  line(g,X(7.4),gy,X(7.4),gy+gh,C.ok,1.2,[2,4]);txt(g,"sangue",X(7.4)+3,gy+6,C.ok,10,"left");
  line(g,X(pKa),gy,X(pKa),gy+gh,C.soon,1.5,[4,3]);txt(g,"pKa",X(pKa)+(pKa>12?-3:3),gy+gh*.62,C.soon,11,pKa>12?"right":"left",true);
  g.strokeStyle=C.acc;g.lineWidth=3;g.beginPath();for(let v=0;v<=14;v+=.1){const y=Y(1/(1+Math.pow(10,pKa-v)));v?g.lineTo(X(v),y):g.moveTo(X(v),y);}g.stroke();circ(g,X(p.pH),Y(a),7,C.warn,C.card);
  const dd=p.pH-pKa,ratio=Math.abs(dd)<3?F2(Math.pow(10,dd),Math.abs(dd)<1?2:0):"10^"+F2(dd,1);
  return `${nm[0].toUpperCase()+nm.slice(1)} (pKa ${F2(pKa,2)}) a pH ${F2(p.pH,1)}: dissociato al <b>${pct(a)}%</b> come ${an} (A⁻/HA = 10^(pH − pKa) = ${ratio}). ${Math.abs(dd)<.05?"A pH = pKa metà acido e metà anione. ":p.pH>pKa?"Sopra la pKa prevale la base coniugata. ":"Sotto la pKa prevale la forma indissociata. "}${p.ac<3?"L'anione carbossilato è stabilizzato dalla risonanza (carica divisa su due O): per questo gli acidi carbossilici sono molto più acidi degli alcoli (pKa ≈ 16). Al pH del sangue sono quasi tutti anioni: si parla di lattato, piruvato, acetato.":"Il fenolo è molto meno acido degli acidi carbossilici, ma più degli alcoli (pKa ≈ 16): la carica dell'anione fenossido si delocalizza sull'anello (posizioni orto e para). Al pH del sangue è quasi tutto indissociato."}`;}},

/* ---------- c7b · ciclizzazione del glucosio, anomeri, mutarotazione ---------- */
anomeri:{h:340,c:[{k:"v",l:"Vista",seg:["Ciclizzazione","Mutarotazione in acqua"],v:0},{k:"an",l:"Anomero (che si forma / di partenza)",seg:["α","β"],v:0}],
 init(st){st.pop=null;},
 f(g,p,st,dt,W,H){const wide=W>=560,up=p.an===1;
  if(p.v===0){const cx=wide?W*.36:W*.47,cy=wide?H*.55:H*.5,L=wide?Math.min(W*.15,H*.25):Math.min(W*.24,H*.2),T=7,s=(st.t%T)/T,P=v=>[cx+v[0]*L,cy+v[1]*L];
   const A={O5:[.45,-.42],C1:[1,0],C2:[.5,.42],C3:[-.5,.42],C4:[-1,0],C5:[-.45,-.42]},a=k=>P(A[k]);
   [["C1","C2",5],["C2","C3",6],["C3","C4",5],["C4","C5",2.5],["C5","O5",2.5]].forEach(([u,v,w])=>{const x=a(u),y=a(v);line(g,x[0],x[1],y[0],y[1],C.ink,w);});
   const cls=cl((s-.42)/.16,0,1);if(cls>0){const x=a("O5"),y=a("C1");line(g,x[0],x[1],L01(x[0],y[0],cls),L01(x[1],y[1],cls),C.ink,2.5);}
   const stub=(k,dir,lab,col)=>{const q=a(k),y2=q[1]+dir*L*.36;line(g,q[0],q[1],q[0],y2,C.ink,2);txt(g,lab,q[0],y2+dir*9,col,lab==="H"?11:13,"center",true);};
   stub("C2",1,"OH",C.warn);stub("C2",-1,"H",C.muted);stub("C3",-1,"OH",C.warn);stub("C3",1,"H",C.muted);stub("C4",1,"OH",C.warn);stub("C4",-1,"H",C.muted);stub("C5",-1,"CH₂OH",C.ink);stub("C5",1,"H",C.muted);
   ["C1","C2","C3","C4","C5"].forEach((k,i)=>{const q=P([A[k][0]*.72,A[k][1]*.6]);txt(g,String(i+1),q[0],q[1],C.muted,10,"center",true);});
   const o5=a("O5");atm(g,o5[0],o5[1],L*.13,C.warn,"O",C.card,11);
   const u=cl((s-.3)/.25,0,1),thO=L01(up?-20:20,up?-90:90,u)*PI/180,thH=L01(up?70:-70,up?90:-90,u)*PI/180,c1=a("C1"),ol=L01(L*.45,L*.36,u),ox=c1[0]+Math.cos(thO)*ol,oy=c1[1]+Math.sin(thO)*ol;
   if(u<1)dbl(g,c1[0],c1[1],ox,oy,C.ink,2,2.5);else line(g,c1[0],c1[1],ox,oy,C.ink,2);
   const hx=c1[0]+Math.cos(thH)*L*.36,hy=c1[1]+Math.sin(thH)*L*.36;line(g,c1[0],c1[1],hx,hy,C.ink,2);txt(g,"H",hx+Math.cos(thH)*9,hy+Math.sin(thH)*9,C.muted,11,"center",true);
   const hT=cl((s-.55)/.2,0,1),hp=[L01(o5[0]+L*.2,ox+L*.18,hT),L01(o5[1]-L*.14,oy,hT)];
   if(s<.75){atm(g,hp[0],hp[1],L*.08+3,C.card,"H",C.ink,10);if(s<.55)line(g,o5[0],o5[1],hp[0],hp[1],C.ink,1.5);}
   if(s>=.75)txt(g,"OH",ox+Math.cos(thO)*12,oy+Math.sin(thO)*12,C.warn,13,"center",true);else atm(g,ox,oy,L*.12,C.warn,"O",C.card,11);
   if(s<.55&&s>.04)txt(g,"δ+",c1[0]+L*.2,c1[1]+(up?L*.28:-L*.28),C.acc,12,"center",true);
   if(s>.26&&s<.48)curv(g,o5[0]+L*.08,o5[1]+L*.08,c1[0]-L*.12,c1[1]-L*.06,-.35,C.soon,2);
   if(s>=.8){g.setLineDash([3,3]);circ(g,c1[0],c1[1],L*.2,null,C.fam,1.5);g.setLineDash([]);txt(g,"C1 anomerico",c1[0]+L*.22,c1[1]+(up?L*.5:-L*.5),C.fam,11,"left",true);}
   const cap=s<.3?"D-glucosio, forma aperta (aldeide)":s<.55?"l'OH del C5 attacca il C1 del carbonile":s<.75?"un H⁺ passa sull'ossigeno del C1":(up?"β":"α")+"-D-glucopiranosio (emiacetale ciclico)";
   txt(g,cap,wide?cx:W/2,16,C.ink,12,"center",true);
   if(wide){const ix=W*.7;[["α: OH del C1 in basso",C.acc,!up],["   (trans rispetto al CH₂OH)",C.muted,0],["β: OH del C1 in alto",C.ok,up],["   (cis rispetto al CH₂OH)",C.muted,0],["",C.muted,0],["In acqua all'equilibrio:",C.muted,0],["36% α · 64% β",C.ink,1],["forma aperta < 0,1%",C.muted,0]].forEach(([t2,c,b],i)=>txt(g,t2,ix,H*.25+i*20,c,12,"left",!!b));}
   return `Il glucosio in soluzione si chiude ad anello: l'–OH del C5 fa un'<b>addizione nucleofila</b> al carbonile del C1 e si forma un <b>emiacetale ciclico</b> a 6 termini (piranosio). Il C1 diventa un nuovo centro chirale, il <b>carbonio anomerico</b>: con l'OH anomerico in basso (trans rispetto al CH₂OH) è l'anomero <b>α</b>, in alto il <b>β</b>${up?" (quello mostrato)":""}. α e β sono diastereoisomeri: si chiamano anomeri.`;}
  /* mutarotazione */
  const N=30;if(!st.pop||st.pop.an!==p.an){st.pop={an:p.an,t0:st.t,m:Array.from({length:N},()=>({b:p.an,x:.08+rnd()*.84,y:.12+rnd()*.78,o:0})),acc:0};}
  let tt=st.t-st.pop.t0;if(tt>17||tt<0){st.pop=null;return this.f(g,p,st,dt,W,H);}
  const k=.32,faE=.36,fa0=p.an===0?1:0,fa=t=>faE+(fa0-faE)*Math.exp(-k*t),R=t=>112.2*fa(t)+18.7*(1-fa(t)),tm=16;
  const bx0=12,bx1=wide?W*.45:W-12,by0=12,by1=wide?H-12:H*.44,bw=bx1-bx0,bh=by1-by0;rr(g,bx0,by0,bw,bh,10,A_(C.acc,.05),C.line);
  const na=Math.round(N*fa(Math.min(tt,tm)));st.pop.acc+=dt;if(st.pop.acc>.1){st.pop.acc=0;const cur=st.pop.m.filter(o=>!o.b).length;if(cur!==na){const c=st.pop.m.filter(o=>o.b===(cur>na?0:1)&&!o.o);if(c.length){const o=c[rnd()*c.length|0];o.o=.45;o.nb=cur>na?1:0;}}}
  st.pop.m.forEach(o=>{o.x=cl(o.x+(rnd()-.5)*dt*.1,.06,.94);o.y=cl(o.y+(rnd()-.5)*dt*.1,.12,.9);const x=bx0+o.x*bw,y=by0+o.y*bh;
   if(o.o>0){o.o-=dt;g.strokeStyle=C.soon;g.lineWidth=2;g.beginPath();for(let i=0;i<6;i++){const xx=x-12+i*5,yy=y+(i%2?4:-4);i?g.lineTo(xx,yy):g.moveTo(xx,yy);}g.stroke();if(o.o<=0){o.b=o.nb;o.o=0;}return;}
   const col=o.b?C.ok:C.acc;g.strokeStyle=col;g.lineWidth=2;g.beginPath();for(let i=0;i<=6;i++){const an2=i*PI/3,xx=x+Math.cos(an2)*8,yy=y+Math.sin(an2)*5.5;i?g.lineTo(xx,yy):g.moveTo(xx,yy);}g.stroke();line(g,x+8,y,x+8,y+(o.b?-9:9),col,2);circ(g,x+8,y+(o.b?-10:10),2.5,col);});
  const nA=st.pop.m.filter(o=>!o.b&&!o.o).length,nB=st.pop.m.filter(o=>o.b&&!o.o).length;
  txt(g,"α "+nA,bx0+10,by0+12,C.acc,12,"left",true);txt(g,"β "+nB,bx0+52,by0+12,C.ok,12,"left",true);txt(g,"~ forma aperta",bx1-10,by0+12,C.soon,11,"right",true);
  const gx=wide?W*.54:46,gw=wide?W*.42:W-66,gy=wide?30:H*.52+10,gh=wide?H-74:H*.48-44,X=t=>gx+t/tm*gw,Y=v=>gy+gh-v/120*gh;
  axes(g,gx,gy,gw,gh,"tempo","[α] (°)");[0,40,80,120].forEach(v=>txt(g,v,gx-5,Y(v),C.muted,10,"right"));
  line(g,gx,Y(52.7),gx+gw,Y(52.7),C.soon,1.5,[4,3]);txt(g,"equilibrio +52,7°",gx+gw-4,Y(52.7)-9,C.soon,11,"right",true);
  g.strokeStyle=A_(C.fam,.35);g.lineWidth=2;g.beginPath();for(let t=0;t<=tm;t+=.2)t?g.lineTo(X(t),Y(R(t))):g.moveTo(X(t),Y(R(t)));g.stroke();
  const t1=Math.min(tt,tm);g.strokeStyle=C.fam;g.lineWidth=3;g.beginPath();for(let t=0;t<=t1;t+=.2)t?g.lineTo(X(t),Y(R(t))):g.moveTo(X(t),Y(R(t)));g.stroke();circ(g,X(t1),Y(R(t1)),6,C.fam,C.card);
  const f=fa(t1);
  return `Parto da <b>${up?"β":"α"}-D-glucosio puro</b> ([α] = ${up?"+18,7°":"+112,2°"}). In acqua l'anello si apre e si richiude passando per la forma aperta, e il carbonio anomerico cambia configurazione: ora <b>${F2(f*100,0)}% α</b> e ${F2((1-f)*100,0)}% β, rotazione specifica <b>+${F2(R(t1),1)}°</b>. È la <b>mutarotazione</b>: si arriva sempre a +52,7° (36% α, 64% β). Il β prevale perché nella conformazione a sedia ha tutti i gruppi –OH equatoriali.`;}},

/* ---------- c7c · acidi grassi, fluidità del doppio strato, micelle ---------- */
fluidita:{h:330,c:[{k:"T",l:"Temperatura",min:-10,max:60,st:1,v:37,u:" °C"},{k:"u",l:"Code insature (doppio legame cis)",min:0,max:100,st:5,v:30,u:"%"},{k:"s",l:"Struttura",seg:["Doppio strato (fosfolipidi)","Micella (acidi grassi, saponi)"],v:0}],
 f(g,p,st,dt,W,H){const Tm=41-.6*p.u,fl=1/(1+Math.exp(-(p.T-Tm)/3)),uns=i=>((i*.6180339)%1)<p.u/100,t=st.t;
  const tail=(x0,y0,ang,len,i,kink,col)=>{const n=8,sl=len/n;let x=x0,y=y0,a=ang;g.strokeStyle=col;g.lineWidth=2.2;g.beginPath();g.moveTo(x,y);let kx=null,ky=null;
   for(let k=0;k<n;k++){a+=(fl*.42+.03)*Math.sin(t*(2.2+(i%3)*.6)+k*1.1+i*2.3)*(k?1:.4);if(kink&&k===4){a+=.55;kx=x;ky=y;}const zz=(k%2?1:-1)*1.6;x+=Math.cos(a)*sl-Math.sin(a)*zz*.3;y+=Math.sin(a)*sl+Math.cos(a)*zz*.3;g.lineTo(x+Math.cos(a+PI/2)*zz,y+Math.sin(a+PI/2)*zz);}g.stroke();if(kx!=null)circ(g,kx,ky,2.8,C.warn);};
  if(p.s===0){const sp=L01(16,20.5,fl),n=Math.floor((W-24)/sp),Lt=H*.21,cy=H*.54,yt=cy-Lt-9,yb=cy+Lt+9;
   rr(g,0,yt-10,W,yb-yt+20,0,A_(C.soon,.06));txt(g,"acqua",12,14,C.muted,12,"left",true);txt(g,"citoplasma (acqua)",12,H-10,C.muted,12,"left",true);
   for(let lf=0;lf<2;lf++)for(let i=0;i<n;i++){const id=i+lf*97,x=12+sp*(i+.5)+fl*2.5*Math.sin(t*1.7+id*1.3),y=lf?yb:yt,dir=lf?-1:1,un=uns(id);
    tail(x-3,y+dir*5,dir*PI/2,Lt,id,0,C.muted);tail(x+3,y+dir*5,dir*PI/2,Lt,id+50,un,un?C.soon:C.muted);circ(g,x,y,6.5,C.acc,C.card,1);}
   const gel=fl<.5;rr(g,W-150,6,140,22,11,gel?A_(C.acc,.2):A_(C.warn,.18),gel?C.acc:C.warn);txt(g,gel?"GEL (ordinato)":"FLUIDO",W-80,17,gel?C.acc:C.warn,12,"center",true);
   return `Con il ${p.u}% di code insature la membrana passa da gel a fluida verso <b>${F2(Tm,0)} °C</b> (Tm, indicativa): a ${p.T} °C è <b>${gel?"in gel, code ordinate e impaccate":"fluida, code mobili e disordinate"}</b>. Il doppio legame <b>cis</b> (punto rosso) piega la catena di circa 30° e impedisce l'impaccamento: più insaturi → Tm più bassa → più fluidità. Per lo stesso motivo l'acido stearico (18:0) fonde a 70 °C, l'oleico (18:1 cis) a 13 °C: grassi saturi solidi, oli ricchi di insaturi liquidi. Il colesterolo tampona la fluidità.`;}
  const cx=W/2,cy=H*.52,R=Math.min(H*.36,W*.3),n=22,rot=t*.12;
  for(let i=0;i<26;i++){const an=i*2.4+t*.1,rr2=R*1.35+((i*37)%30);wat(g,cx+Math.cos(an)*rr2,cy+Math.sin(an)*rr2*.9,an,.9,.5);}
  circ(g,cx,cy,R*.92,A_(C.soon,.08));
  for(let i=0;i<n;i++){const an=rot+i*2*PI/n,x=cx+Math.cos(an)*R,y=cy+Math.sin(an)*R,un=uns(i);tail(x-Math.cos(an)*6,y-Math.sin(an)*6,an+PI,R*.78,i,un,un?C.soon:C.muted);circ(g,x,y,7,C.acc,C.card,1);txt(g,"−",x,y,C.card,11,"center",true);}
  txt(g,"teste polari (COO⁻) verso l'acqua",12,14,C.acc,12,"left",true);txt(g,"code apolari all'interno",12,H-10,C.muted,12,"left",true);
  return `Le molecole con <b>una sola coda</b> (acidi grassi ionizzati, saponi, sali biliari) hanno forma a cono e in acqua formano <b>micelle</b>: teste cariche verso l'acqua, code idrofobe nascoste al centro. I fosfolipidi, con due code (forma a cilindro), formano invece il doppio strato. Le micelle dei sali biliari emulsionano i grassi nell'intestino; il sapone intrappola lo sporco grasso al centro. A ${p.T} °C le code sono ${fl<.5?"poco mobili":"molto mobili"}.`;}},

/* ---------- c7d · reazione di Fenton, radicale ossidrile, antiossidanti ---------- */
fenton:{h:340,c:[{k:"h",l:"H₂O₂ prodotto (stress ossidativo)",min:0,max:10,st:1,v:5},{k:"ao",l:"Antiossidanti (glutatione, vitamina E)",min:0,max:10,st:1,v:3},{k:"fe",l:"Ferro",seg:["Fe²⁺ libero","Fe legato (ferritina)"],v:0}],
 init(st){st.ok=0;},
 f(g,p,st,dt,W,H){const dY=H*.2,mY=H*.8,nL=Math.floor((W-16)/12);
  if(!st.ok||st.lip.length!==nL){st.ok=1;st.tt=0;st.fe=Array.from({length:5},(_,i)=>({x:W*(.12+.19*i),y:dY+20+rnd()*(mY-dY-40),s:2,tm:0,vx:(rnd()-.5)*10,vy:(rnd()-.5)*10}));st.h2=[];st.oh=[];st.gsh=[];st.lip=Array.from({length:nL},()=>({s:0,tm:0}));st.ve=[];st.dna=[];st.n={r:0,q:0,d:0,l:0};st.acc=0;st.fl=[];}
  st.tt+=dt;if(st.tt>32){st.ok=0;return this.f(g,p,st,0,W,H);}
  const nG=Math.round(p.ao*1.2),nV=Math.round(p.ao*.6);while(st.gsh.filter(o=>!o.used).length<nG)st.gsh.push({x:20+rnd()*(W-40),y:dY+16+rnd()*(mY-dY-32),used:0,tm:0});
  if(st.gsh.filter(o=>!o.used).length>nG)st.gsh.splice(st.gsh.findIndex(o=>!o.used),1);
  while(st.ve.length<nV)st.ve.push({i:rnd()*nL|0,used:0});if(st.ve.length>nV)st.ve.pop();
  st.acc+=dt*p.h*.55;while(st.acc>=1){st.acc--;st.h2.push({x:20+rnd()*(W-40),y:dY+12+rnd()*(mY-dY-24),l:5});}
  const mv=(o,v)=>{o.x=cl(o.x+(rnd()-.5)*dt*v,12,W-12);o.y=cl(o.y+(rnd()-.5)*dt*v,dY+10,mY-10);};
  st.fe.forEach(f=>{f.x=cl(f.x+f.vx*dt,16,W-16);f.y=cl(f.y+f.vy*dt,dY+16,mY-16);if(f.x<=16||f.x>=W-16)f.vx*=-1;if(f.y<=dY+16||f.y>=mY-16)f.vy*=-1;if(f.s===3){f.tm-=dt;if(f.tm<=0){f.s=2;st.fl.push({x:f.x,y:f.y-18,l:1,t:"O₂•⁻"});}}});
  st.h2.forEach(h=>{mv(h,60);h.l-=dt;if(p.fe===0){const f=st.fe.find(f=>f.s===2&&Math.hypot(f.x-h.x,f.y-h.y)<20);if(f){f.s=3;f.tm=2;h.l=0;st.n.r++;const an=rnd()*6;st.oh.push({x:h.x,y:h.y,vx:Math.cos(an)*150,vy:Math.sin(an)*150,l:2.2});}}});st.h2=st.h2.filter(h=>h.l>0);
  st.gsh.forEach(o=>{if(o.used){o.tm-=dt;}else mv(o,30);});st.gsh=st.gsh.filter(o=>!o.used||o.tm>0);
  st.oh.forEach(r=>{r.x+=r.vx*dt;r.y+=r.vy*dt;r.l-=dt;if(r.x<12||r.x>W-12){r.vx*=-1;r.x=cl(r.x,12,W-12);}
   const gs=st.gsh.find(o=>!o.used&&Math.hypot(o.x-r.x,o.y-r.y)<14);if(gs){gs.used=1;gs.tm=1.2;r.l=0;st.n.q++;st.fl.push({x:r.x,y:r.y,l:.8,t:"H₂O"});return;}
   if(r.y<dY){r.l=0;st.dna.push(r.x);st.n.d++;}else if(r.y>mY){r.l=0;const i=cl(Math.round((r.x-8)/12),0,nL-1);if(st.lip[i].s===0){st.lip[i].s=1;st.lip[i].tm=.7;st.n.l++;}}});
  st.oh=st.oh.filter(r=>r.l>0);
  st.lip.forEach((l,i)=>{if(l.s!==1)return;l.tm-=dt;if(l.tm<=0){l.s=2;const ve=st.ve.find(v=>!v.used&&Math.abs(v.i-i)<=1);if(ve){ve.used=1;st.fl.push({x:8+i*12,y:mY-8,l:.8,t:"vit. E"});}else{const j=i+(rnd()<.5?-1:1);if(j>=0&&j<nL&&st.lip[j].s===0){st.lip[j].s=1;st.lip[j].tm=.7;st.n.l++;}}}});
  /* disegno */
  g.fillStyle=A_(C.acc,.06);g.fillRect(0,0,W,dY);g.strokeStyle=C.fam;g.lineWidth=2.5;for(const ph of[0,PI]){g.beginPath();for(let x=0;x<=W;x+=4){const y=dY*.5+Math.sin(x/22+ph)*dY*.28;x?g.lineTo(x,y):g.moveTo(x,y);}g.stroke();}
  for(let x=6;x<W;x+=11){const y1=dY*.5+Math.sin(x/22)*dY*.28,y2=dY*.5+Math.sin(x/22+PI)*dY*.28;line(g,x,y1,x,y2,A_(C.fam,.35),1.5);}
  st.dna.forEach(x=>{circ(g,x,dY*.5,6,C.warn,C.card,1.5);});txt(g,"DNA",8,10,C.fam,11,"left",true);
  g.fillStyle=A_(C.soon,.08);g.fillRect(0,mY,W,H-mY);
  st.lip.forEach((l,i)=>{const x=8+i*12,col=l.s===0?C.acc:l.s===1?C.warn:A_(C.warn,.55);line(g,x-2,mY+8,x-2,H-6,l.s?A_(C.warn,.6):C.muted,1.5);line(g,x+2,mY+8,x+2,H-6,l.s?A_(C.warn,.6):C.muted,1.5);circ(g,x,mY+6,4.5,col);if(l.s===1)circ(g,x,mY+6,8+3*Math.sin(st.t*12),null,C.warn,1.5);});
  st.ve.forEach(v=>{if(v.used)return;const x=8+v.i*12,y=mY+(H-mY)*.6;g.fillStyle=C.ok;g.beginPath();g.moveTo(x,y-6);g.lineTo(x+5,y);g.lineTo(x,y+6);g.lineTo(x-5,y);g.closePath();g.fill();});
  txt(g,"membrana (acidi grassi polinsaturi)",8,H-8,C.soon,11,"left",true);
  st.fe.forEach(f=>{if(p.fe===1){circ(g,f.x,f.y,15,A_(C.muted,.15),C.muted,2);}atm(g,f.x,f.y,10,f.s===2?C.soon:C.lp,"Fe",C.card,10);txt(g,f.s===2?"2+":"3+",f.x+13,f.y-9,f.s===2?C.soon:C.lp,10,"left",true);});
  st.h2.forEach(h=>pill(g,h.x,h.y,"H₂O₂",C.acc,10));
  st.gsh.forEach(o=>{if(o.used){g.globalAlpha=cl(o.tm,0,1);pill(g,o.x,o.y,"GS•",C.ok,10);g.globalAlpha=1;}else pill(g,o.x,o.y,"GSH",C.ok,10);});
  st.oh.forEach(r=>{const k=6+2*Math.sin(st.t*30);g.strokeStyle=C.warn;g.lineWidth=2;for(let i=0;i<4;i++){const an=i*PI/4;line(g,r.x-Math.cos(an)*k,r.y-Math.sin(an)*k,r.x+Math.cos(an)*k,r.y+Math.sin(an)*k,C.warn,2);}txt(g,"•OH",r.x+9,r.y-9,C.warn,11,"left",true);});
  st.fl=st.fl.filter(f=>(f.l-=dt)>0);st.fl.forEach(f=>{g.globalAlpha=cl(f.l*1.5,0,1);txt(g,f.t,f.x,f.y-(1-f.l)*12,f.t==="O₂•⁻"?C.lp:C.ok,11,"center",true);g.globalAlpha=1;});
  const n=st.n,extra=p.fe===1?"Con il ferro legato a ferritina e transferrina la reazione non avviene: per questo nell'organismo il ferro libero è tenuto bassissimo.":p.ao===0?"Senza antiossidanti la perossidazione dei lipidi si propaga a catena da un acido grasso al vicino.":"Il glutatione (GSH, un tiolo) cede un atomo di H al radicale e diventa GS•; la vitamina E (tocoferolo, rombi verdi) nella membrana interrompe la catena della perossidazione.";
  return `Reazione di Fenton: Fe²⁺ + H₂O₂ → Fe³⁺ + OH⁻ + <b>•OH</b>; il superossido (O₂•⁻) riporta Fe³⁺ a Fe²⁺ (ciclo di Haber-Weiss). Radicali •OH formati <b>${n.r}</b> · neutralizzati <b>${n.q}</b> · danni al DNA (es. 8-oxo-guanina) <b>${n.d}</b> · lipidi perossidati <b>${n.l}</b>. ${extra}`;}}
});

[["c1b","legame"],["c2a","dissoluzione"],["c5a","chiralita"],["c5b","sn1sn2"],["c6a","ebollizione"],["c6b","carbonile"],["c6c","carbossile"],["c7b","anomeri"],["c7c","fluidita"],["c7d","fenton"]]
 .forEach(([id,a])=>{const t=CHI_TOPICS.find(x=>x.id===id);if(t)t.anim=a;});
})();
