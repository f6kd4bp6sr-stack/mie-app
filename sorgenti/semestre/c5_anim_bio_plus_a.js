/* ================= ANIMAZIONI DI BIOLOGIA – PARTE A (unità 1-4) =================
   Stesso motore (mountAnim / AN): h, c (controlli), init, f(g,p,st,dt,W,H) → testo sotto l'animazione.
   Tutto dentro una funzione per non creare nomi globali nuovi. */
(function(){
const ez=u=>{u=Math.max(0,Math.min(1,u));return u*u*(3-2*u);};
const cl=u=>Math.max(0,Math.min(1,u));
const hr=(i,k)=>{const x=Math.sin(i*127.1+(k||0)*311.7)*43758.5453;return x-Math.floor(x);};
const sm=W=>W<440;
const FONT="px -apple-system,BlinkMacSystemFont,sans-serif";
function tw(g,s,size,bold){g.font=(bold?"700 ":"")+size+FONT;return g.measureText(s).width;}
function fit(g,s,maxW,size,bold){while(size>8&&tw(g,s,size,bold)>maxW)size-=.5;return size;}
function stage(st,b){/* b = confini delle fasi; restituisce [indice, progresso 0-1] */let k=0;while(k<b.length-2&&st>=b[k+1])k++;return [k,cl((st-b[k])/(b[k+1]-b[k]))];}
function hexa(g,x,y,r,fill,stroke,lw){g.beginPath();for(let i=0;i<6;i++){const a=Math.PI/3*i+Math.PI/6,X=x+r*Math.cos(a),Y=y+r*Math.sin(a);i?g.lineTo(X,Y):g.moveTo(X,Y);}g.closePath();if(fill){g.fillStyle=fill;g.fill();}if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||2;g.stroke();}}
function ell(g,x,y,rx,ry,fill,stroke,lw){g.beginPath();g.ellipse(x,y,Math.max(.5,rx),Math.max(.5,ry),0,0,7);if(fill){g.fillStyle=fill;g.fill();}if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||2;g.stroke();}}
function squig(g,x1,x2,y,col,lw,amp,ph){g.strokeStyle=col;g.lineWidth=lw||2;g.beginPath();let f=true;for(let x=x1;x<=x2+.01;x+=2){const Y=y+Math.sin((x+(ph||0))/3.2)*(amp==null?3:amp);f?g.moveTo(x,Y):g.lineTo(x,Y);f=false;}g.stroke();}
function vsq(g,x,y1,y2,col,lw){g.strokeStyle=col;g.lineWidth=lw||2;g.beginPath();let f=true;for(let y=y1;y<=y2+.01;y+=2){const X=x+Math.sin(y/3)*2;f?g.moveTo(X,y):g.lineTo(X,y);f=false;}g.stroke();}
function pill(g,x,y,s,col,size){const w=tw(g,s,size,true)+12;rr(g,x-w/2,y-size*.8,w,size*1.6,size*.8,A_(col,.22),col);txt(g,s,x,y,C.ink,size,"center",true);return w;}

/* ---------- b1a: virus ---------- */
function phage(g,x,y,s,full,a){g.save();g.globalAlpha=a==null?1:a;const col=C.fam;
 for(const d of[-1,1]){line(g,x+d*s*.15,y-s*.3,x+d*s*.6,y,col,1.6);}
 line(g,x-s*.22,y-s*.3,x+s*.22,y-s*.3,col,2.5);
 rr(g,x-s*.12,y-s*1.35,s*.24,s*1.05,2,A_(col,.3),col);
 hexa(g,x,y-s*1.78,s*.48,full?A_(C.warn,.65):A_(col,.12),col,1.6);g.restore();}
function chrLoop(g,cx,cy,rx,ry,col,a0,a1,lw){g.strokeStyle=col;g.lineWidth=lw;g.beginPath();let f=true;for(let a=a0;a<=a1+1e-6;a+=.05){const r=1+.13*Math.sin(7*a),X=cx+rx*r*Math.cos(a),Y=cy+ry*r*Math.sin(a);f?g.moveTo(X,Y):g.lineTo(X,Y);f=false;}g.stroke();}
function bact(g,cx,cy,bw,bh,o){const lys=o.lys||0,chr=o.chr==null?1:o.chr,S=o.seed||0;
 if(lys<.02)rr(g,cx-bw/2,cy-bh/2,bw,bh,bh/2,A_(C.ok,.12),C.ok);
 else{g.save();g.globalAlpha=Math.max(0,1-lys*1.4);g.setLineDash([9,9]);rr(g,cx-bw/2,cy-bh/2,bw,bh,bh/2,A_(C.ok,.05),C.ok);g.setLineDash([]);g.restore();}
 const rx=bw*.2,ry=bh*.24;
 if(chr>.03&&lys<.3){g.save();g.globalAlpha=chr;chrLoop(g,cx,cy,rx,ry,C.acc,0,6.29,2.5);if(o.pro)chrLoop(g,cx,cy,rx,ry,C.warn,-.5,.5,5);g.restore();}
 if(o.free)circ(g,cx+rx*1.1,cy,6,null,C.warn,2.5);
 for(let i=0;i<(o.dna||0);i++){const x=cx+(hr(i+S,1)-.5)*bw*.7,y=cy+(hr(i+S,2)-.5)*bh*.6;squig(g,x-7,x+7,y,C.warn,2,2,i*3);}
 for(let i=0;i<(o.heads||0);i++){const x=cx+(hr(i+S,3)-.5)*bw*.7,y=cy+(hr(i+S,4)-.5)*bh*.55;hexa(g,x,y,4.5,null,C.fam,1.5);}
 for(let i=0;i<(o.phs||0);i++){let x=cx+(hr(i+S,5)-.5)*bw*.72,y=cy+(hr(i+S,6)-.5)*bh*.45+7;if(lys>0){const a=hr(i+S,7)*6.283,d=lys*bw*.55;x+=Math.cos(a)*d;y+=Math.sin(a)*d*.55;}phage(g,x,y,8,true,lys>.8?1-(lys-.8)*3:1);}}
function fagoScene(g,p,st,W,H){const lyso=p.m==1,uv=lyso&&p.uv==1,T=uv?17:13,tt=st.t%T,cx=W/2,cy=H*.6,bw=Math.min(W*.6,340),bh=Math.min(100,bw*.42),s=Math.min(22,H*.07),top=cy-bh/2,F=sm(W)?11:12;
 const N=!lyso?["Adsorbimento","Iniezione del DNA","Replicazione e sintesi","Assemblaggio","Lisi"]:uv?["Adsorbimento","Iniezione del DNA","Integrazione: profago","Divisione cellulare","Induzione da UV","Replicazione e assemblaggio","Lisi"]:["Adsorbimento","Iniezione del DNA","Integrazione: profago","Divisione cellulare","Lisogenia stabile"];
 const B=!lyso?[0,2.2,4.4,6.6,8.8,11.5]:uv?[0,2.2,4.4,6.6,9,11,13.5,15.6]:[0,2.2,4.4,6.6,9,13];
 const [k,u]=stage(tt,B);
 // fago che infetta
 if(k==0)phage(g,cx,lerp(top-95,top+1,ez(u)),s,true);
 else if(k<=3||(!lyso&&k==4)){const a=(!lyso&&k==4)?1-u:k>=3&&lyso?1-u:1;phage(g,lyso&&k==3?cx-lerp(0,bw*.31+8,ez(u)):cx,top+1,s,k==1&&u<.55,a*(k>=2?.55:1));}
 if(k==1){const L=u*bh*.45;if(L>2)vsq(g,cx,top+2,top+2+L,C.warn,2.5);}
 const two=lyso&&k>=3,w2=bw*.62;
 if(!lyso){
  if(k<=1)bact(g,cx,cy,bw,bh,{});
  else if(k==2)bact(g,cx,cy,bw,bh,{chr:1-u,dna:1+Math.floor(u*8),heads:Math.floor(u*6)});
  else if(k==3){const n=Math.floor(u*10);bact(g,cx,cy,bw,bh,{chr:0,dna:Math.max(0,8-n),heads:Math.max(0,6-n),phs:n});}
  else bact(g,cx,cy,bw,bh,{chr:0,phs:10,lys:ez(u)});}
 else if(!two){
  if(k<=1)bact(g,cx,cy,bw,bh,{});
  else{bact(g,cx,cy,bw,bh,{pro:u>.7});if(u<=.7){const x=lerp(cx,cx+bw*.22,ez(u/.7)),y=lerp(top+bh*.3,cy,ez(u/.7));circ(g,x,y,6,null,C.warn,2.5);}}}
 else{const d=k==3?lerp(bw/4,w2/2+8,ez(u)):w2/2+8,ww=k==3?lerp(bw/2,w2,ez(u)):w2;
  [-1,1].forEach((sg,i)=>{let o={pro:true,seed:i*20};
   if(uv&&k==4)o={pro:u<.55,free:u>=.55,seed:i*20};
   if(uv&&k==5)o={chr:1-u,free:u<.3,dna:u<.5?1+Math.floor(u*10):Math.max(0,6-Math.floor((u-.5)*12)),heads:u<.5?Math.floor(u*8):Math.max(0,4-Math.floor((u-.5)*8)),phs:u>.5?Math.floor((u-.5)*12):0,seed:i*20};
   if(uv&&k==6)o={chr:0,phs:6,lys:ez(u),seed:i*20};
   bact(g,cx+sg*d,cy,ww,bh,o);});
  if(uv&&k==4){for(let j=0;j<5;j++){const x=W*(.15+.17*j),y0=10+((st.t*90+j*37)%40);g.strokeStyle=C.fam;g.lineWidth=2;g.beginPath();for(let q=0;q<6;q++){const X=x+(q%2?7:-7),Y=y0+q*9;q?g.lineTo(X,Y):g.moveTo(X,Y);}g.stroke();}txt(g,"UV",W*.15-22,24,C.fam,F,"right",true);}
  if(!uv||k==3){const x=cx+d+ww*.2*1.1,y=cy-bh*.24*1.15;txt(g,"profago",Math.min(W-8,x+28),top-12,C.warn,F,"right",true);line(g,Math.min(W-30,x+10),top-4,x+2,y,C.warn,1.5);}}
 if(!two||k<6)txt(g,"batterio",cx,cy+bh/2+14,C.muted,F,"center");
 txt(g,`${k+1}/${N.length} · ${N[k]}`,12,18,C.ink,sm(W)?13:15,"left",true);
 const TX=!lyso?["Il fago si lega con le fibre della coda a recettori specifici della parete batterica (adsorbimento).","La coda si contrae e il DNA del fago viene iniettato nel batterio; il capside vuoto resta fuori.","Il DNA fagico prende il controllo: il cromosoma batterico (blu) viene degradato, la cellula copia il genoma del fago (rosso) e produce le proteine del capside.","Genomi e capsidi si assemblano in nuovi fagi (qui 10; in realtà da 50 a 200 per cellula).","Un enzima del fago (lisozima) rompe la parete: la cellula <b>lisa</b>, muore e libera i nuovi fagi, pronti a infettare altri batteri."]
  :["Il fago si lega con le fibre della coda a recettori specifici della parete batterica.","Il DNA del fago viene iniettato nel batterio; il capside resta fuori.","Il DNA del fago si chiude ad anello e si <b>integra</b> nel cromosoma batterico (integrasi): diventa un <b>profago</b>; i geni litici restano spenti grazie a un repressore.","Il batterio non muore: si divide e il profago viene replicato insieme al cromosoma, quindi passa a entrambe le cellule figlie.",
   uv?"Il danno da UV attiva la risposta SOS: il repressore del fago viene inattivato e il profago si <b>excide</b> dal cromosoma (anello rosso libero).":"<b>Lisogenia</b>: tutti i discendenti portano il profago e sono immuni a nuove infezioni dello stesso fago. Scegli «Sì: induzione» per vedere cosa succede con un danno al DNA.",
   "Il fago escisso entra nel ciclo litico: replica il suo genoma e assembla nuovi fagi.","Lisi: le cellule si rompono e liberano i fagi. Il ciclo lisogeno può quindi diventare litico."];
 return `<b>${lyso?"Ciclo lisogeno":"Ciclo litico"}</b> – fase ${k+1} di ${N.length}, <b>${N[k]}</b>: ${TX[k]}`;}
function capsid(g,x,y,s){g.beginPath();g.moveTo(x-s*.55,y-s*.7);g.lineTo(x+s*.55,y-s*.7);g.lineTo(x+s*.28,y+s*.7);g.lineTo(x-s*.28,y+s*.7);g.closePath();g.fillStyle=A_(C.fam,.22);g.fill();g.strokeStyle=C.fam;g.lineWidth=1.5;g.stroke();vsq(g,x-s*.15,y-s*.5,y+s*.5,C.warn,1.6);vsq(g,x+s*.15,y-s*.5,y+s*.5,C.warn,1.6);}
function virion(g,x,y,r,a){g.save();g.globalAlpha=a==null?1:a;circ(g,x,y,r,A_(C.lp,.12),C.lp,2);for(let i=0;i<9;i++){const an=i/9*6.283;line(g,x+Math.cos(an)*r,y+Math.sin(an)*r,x+Math.cos(an)*(r+5),y+Math.sin(an)*(r+5),C.lp,2);circ(g,x+Math.cos(an)*(r+6),y+Math.sin(an)*(r+6),2.3,C.lp);}g.restore();capsid(g,x,y,r*.75);}
function retro(g,st,W,H){const T=15,tt=st.t%T,N=["Legame al recettore","Fusione e ingresso","Trascrizione inversa","Integrazione: provirus","Trascrizione e traduzione","Gemmazione e maturazione"],[k,u]=stage(tt,[0,2.2,4.4,6.6,8.8,11,13.6]);
 const F=sm(W)?10.5:12,ym=H*.3,x0=W*.03,cx=W/2,r=Math.max(13,Math.min(20,W*.045)),nx=W/2,ny=H*.76,nrx=Math.min(W*.36,200),nry=H*.15,chY=ny+5,pw=Math.min(70,nrx*.5);
 rr(g,x0,ym,W-2*x0,H-ym-4,26,A_(C.ok,.07),C.ok);txt(g,"linfocita T CD4+",x0+12,ym+14,C.ok,F,"left",true);
 ell(g,nx,ny,nrx,nry,A_(C.fam,.07),C.fam,2);txt(g,"nucleo",nx+nrx-8,ny-nry+14,C.fam,F,"right",true);
 const integ=k>3||(k==3&&u>.6);
 if(integ){squig(g,nx-nrx*.82,nx-pw/2,chY,C.acc,2.5,2);rr(g,nx-pw/2,chY-5,pw,10,4,A_(C.lp,.45),C.lp);squig(g,nx+pw/2,nx+nrx*.82,chY,C.acc,2.5,2);txt(g,"provirus",nx,chY+18,C.lp,F,"center",true);}
 else squig(g,nx-nrx*.82,nx+nrx*.82,chY,C.acc,2.5,2);
 txt(g,"cromosoma",nx-nrx*.82,chY-14,C.acc,F,"left");
 [-1,1].forEach(s=>{const x=cx+s*16;line(g,x,ym,x,ym-11,C.ben,2.5);line(g,x,ym-11,x-5,ym-17,C.ben,2);line(g,x,ym-11,x+5,ym-17,C.ben,2);});
 if(k<=1)txt(g,"CD4 + corecettore",cx+26,ym-12,C.ben,F,"left");
 const dnaAt=(x,y,w)=>{line(g,x-w/2,y-2.5,x+w/2,y-2.5,C.acc,2.5);line(g,x-w/2,y+2.5,x+w/2,y+2.5,C.acc,2.5);};
 if(k==0)virion(g,cx,lerp(24,ym-r-17,ez(u)),r);
 if(k==1){const y=lerp(ym-r-17,ym+44,ez(u));if(u<.6)virion(g,cx,ym-r-17+u*10,r,1-u/.6);capsid(g,cx,y,r*.75);}
 if(k==2){const y=ym+44,L=Math.min(90,W*.28);capsid(g,cx,y,r*.75*(1-u*.5));squig(g,cx-L/2,cx+L/2,y+30,C.warn,2,2.5);const d=L*u;if(d>2)dnaAt(cx-L/2+d/2,y+42,d);txt(g,"RNA",cx-L/2-6,y+30,C.warn,F,"right",true);txt(g,"DNA",cx-L/2-6,y+42,C.acc,F,"right",true);txt(g,"trascrittasi inversa",cx,y-r-6,C.fam,F,"center",true);}
 if(k==3&&!integ){const v=ez(u/.6),x=lerp(cx,nx,v),y=lerp(ym+86,chY-16,v);dnaAt(x,y,pw);txt(g,"integrasi",x,y-14,C.fam,F,"center",true);}
 if(k==4){for(let i=0;i<4;i++){const v=cl(u*1.3-i*.12),tx=W*(.2+.2*i),x=lerp(nx,tx,ez(v)),y=lerp(ny-nry,ym+28,ez(v));squig(g,x-9,x+9,y,C.warn,2,2);}
  if(u>.45)for(let i=0;i<8;i++){circ(g,W*(.14+.1*i),ym+12+(i%2)*7,3.5,A_(C.fam,cl((u-.45)*3)));}
  txt(g,"RNA virali → proteine Gag, Pol, Env",cx,ym+62,C.fam,F,"center",true);}
 if(k==5){[W*.28,W*.72].forEach((bx,i)=>{const v=cl(u*1.15-i*.12),up=ez(v/.7)*(r*1.25),off=v>.75?(v-.75)*90:0;virion(g,bx,ym-up-off+r*.2,r);});txt(g,"gemmazione",cx,ym-28,C.lp,F,"center",true);}
 txt(g,`${k+1}/6 · ${N[k]}`,12,18,C.ink,sm(W)?13:15,"left",true);
 const TX=["La glicoproteina dell'involucro (gp120) riconosce il recettore <b>CD4</b> e un corecettore (CCR5 o CXCR4) del linfocita T.","L'involucro si <b>fonde</b> con la membrana plasmatica e il capside entra nel citoplasma (altri virus entrano per endocitosi).","La <b>trascrittasi inversa</b>, portata dal virus, copia l'RNA genomico in DNA a doppio filamento: l'informazione va da RNA a DNA.","Il DNA virale entra nel nucleo e l'<b>integrasi</b> lo inserisce in un cromosoma: è il <b>provirus</b>, copiato a ogni divisione della cellula.","La RNA polimerasi II della cellula trascrive il provirus; gli RNA virali escono dal nucleo, sono tradotti in proteine (Gag, Pol, Env) o fanno da nuovi genomi.","I nuovi virioni escono per <b>gemmazione</b> prendendo l'involucro dalla membrana della cellula; la proteasi virale li rende maturi e infettivi."];
 return `<b>Retrovirus (HIV)</b> – fase ${k+1} di 6, <b>${N[k]}</b>: ${TX[k]}`;}

/* ---------- b1b: colorazione di Gram ---------- */
const STN=[[150,150,150,.12],[122,60,196,.85],[88,40,150,.92],[150,150,150,.12],[226,90,143,.82]];
function stain(k,gp){return k<3?STN[k]:k==3?(gp?STN[2]:STN[0]):(gp?STN[2]:STN[4]);}
function mixc(a,b,u){const m=a.map((v,i)=>v+(b[i]-v)*u);return `rgba(${m[0]|0},${m[1]|0},${m[2]|0},${m[3].toFixed(3)})`;}
function bilayer(g,x,y,w,h,col,a){const r=Math.max(2,h*.17),n=Math.max(3,Math.floor(w/(r*2.4)));g.save();g.globalAlpha=a==null?1:a;for(let i=0;i<n;i++){const X=x+r+i*(w-2*r)/(n-1);line(g,X-1.5,y+r*2,X-1.5,y+h-r*2,C.muted,1);line(g,X+1.5,y+r*2,X+1.5,y+h-r*2,C.muted,1);circ(g,X,y+r,r,col);circ(g,X,y+h-r,r,col);}g.restore();}
function pgRows(g,x,y,w,h,n){const dy=n>1?h/(n-1):0;for(let j=0;j<n;j++){const Y=y+j*dy;line(g,x,Y,x+w,Y,C.soon,3);if(j<n-1)for(let X=x+8+(j%2)*10;X<x+w;X+=20)line(g,X,Y,X,Y+dy,C.soon,1.5);}}

/* ---------- b1c: endosimbiosi e dimensioni ---------- */
function mito(g,x,y,w,h,a){g.save();g.globalAlpha=a==null?1:a;ell(g,x,y,w/2,h/2,A_(C.lp,.15),C.lp,2);g.strokeStyle=C.lp;g.lineWidth=1.5;g.beginPath();const n=5;for(let i=0;i<=n;i++){const X=x-w*.36+i*w*.72/n,Y=y+(i%2?-1:1)*h*.28;i?g.lineTo(X,Y):g.moveTo(X,Y);}g.stroke();circ(g,x+w*.2,y+h*.12,Math.max(2,h*.12),null,C.warn,1.5);g.restore();}
function wobCell(g,cx,cy,R,t){g.beginPath();for(let a=0;a<=6.3;a+=.05){const r=R*(1+.025*Math.sin(5*a+t*1.5)),X=cx+r*Math.cos(a),Y=cy+r*.86*Math.sin(a);a?g.lineTo(X,Y):g.moveTo(X,Y);}g.closePath();g.fillStyle=A_(C.ok,.07);g.fill();g.strokeStyle=C.ok;g.lineWidth=2.5;g.stroke();}
function endoScene(g,st,W,H){const T=17,tt=st.t%T,N=["Procariote ancestrale","Invaginazioni: nucleo e RE","Fagocitosi di un batterio aerobio","Endosimbionte a doppia membrana","Da endosimbionte a mitocondrio"],[k,u]=stage(tt,[0,2.8,5.6,8.6,11.6,15.2]);
 const F=sm(W)?10.5:12,cx=sm(W)?W*.45:W*.42,cy=H*.57,R=Math.min(H*.42,W*.36),Ry=R*.86;
 wobCell(g,cx,cy,R,st.t);txt(g,"cellula ospite",cx-R*.95,cy-Ry-8,C.ok,F,"left",true);
 for(let i=0;i<14;i++){const a=hr(i,2)*6.283,d=R*(.45+.4*hr(i,3));circ(g,cx+Math.cos(a)*d,cy+Math.sin(a)*d*.86,1.8,C.muted);}
 const nucA=k==0?0:k==1?ez(u):1,nrx=R*.3,nry=R*.25;
 chrLoop(g,cx,cy,R*.18,R*.14,C.acc,0,6.29,2);
 if(nucA>0){g.save();g.globalAlpha=nucA;ell(g,cx,cy,nrx,nry,A_(C.fam,.08),C.fam,2);ell(g,cx,cy,nrx+4,nry+4,null,C.fam,1.5);
  for(let j=0;j<3;j++){g.strokeStyle=C.fam;g.lineWidth=1.5;g.beginPath();g.ellipse(cx,cy,nrx+12+j*7,nry+12+j*7,0,2.3,3.9);g.stroke();}g.restore();
  txt(g,"nucleo",cx,cy+nry+(sm(W)?36:40),C.fam,F,"center",true);txt(g,"RE",cx-nrx-34,cy-nry*.2,C.fam,F,"center",true);}
 if(k==1&&u<.7){const v=ez(u/.5);[-2.3,-.85,2.4].forEach(a=>{const X=cx+Math.cos(a)*R,Y=cy+Math.sin(a)*Ry;line(g,X,Y,lerp(X,cx+Math.cos(a)*nrx*1.3,v),lerp(Y,cy+Math.sin(a)*nry*1.3,v),A_(C.ok,1-cl((u-.4)/.3)),4);});}
 const bw=R*.42,bh=R*.2,fx=cx+R*.45,fy=cy-Ry*.42,bx0=Math.min(cx+R*1.45,W-bw*.6);
 const drawBac=(x,y,dbl,a)=>{g.save();g.globalAlpha=a==null?1:a;if(dbl)rr(g,x-bw/2-5,y-bh/2-5,bw+10,bh+10,(bh+10)/2,null,C.ok);rr(g,x-bw/2,y-bh/2,bw,bh,bh/2,A_(C.lp,.15),C.lp);circ(g,x+bw*.18,y,Math.max(3,bh*.2),null,C.warn,1.5);g.restore();};
 if(k==2){const v=ez(u),x=lerp(bx0,fx,v),y=lerp(cy-Ry*.15,fy,v);if(x<cx+R+bw*.3&&v>.3){g.save();g.globalAlpha=cl((v-.3)*3);g.setLineDash([4,4]);rr(g,x-bw/2-5,y-bh/2-5,bw+10,bh+10,(bh+10)/2,null,C.ok);g.setLineDash([]);g.restore();}drawBac(x,y,false);if(u<.6)txt(g,"α-proteobatterio aerobio",Math.min(W-6,x+bw*.5),y-bh/2-10,C.lp,F,"right",true);}
 if(k==3){drawBac(fx,fy,true);txt(g,"doppia membrana",Math.min(W-6,fx+bw*.6),fy-bh/2-14,C.lp,F,"right",true);const a=(st.t*1.5)%1;txt(g,"O₂ → ATP",fx,fy+bh/2+14+a*6,A_(C.ok,1-a),F,"center",true);}
 if(k==4){const P=[[fx,fy],[cx-R*.55,cy+Ry*.42],[cx+R*.35,cy+Ry*.58]];if(u<.25)drawBac(fx,fy,true,1-u/.25);
  P.forEach((q,i)=>{const a=i==0?cl(u/.25):cl((u-.25-i*.2)/.2);if(a>0)mito(g,q[0],q[1],bw,bh*1.2,a);});
  for(let j=0;j<2;j++){const v=((u*2.5)+j*.5)%1,x=lerp(fx-bw*.3,cx+nrx*.6,v),y=lerp(fy+bh*.3,cy-nry*.4,v);line(g,x-5,y,x+5,y,C.warn,3);}
  txt(g,"mitocondri",Math.min(W-6,fx+bw*.6),fy-bh/2-14,C.lp,F,"right",true);if(u>.2)txt(g,"geni → nucleo",cx+nrx+6,cy-nry-14,C.warn,F,"left",true);}
 txt(g,`${k+1}/5 · ${N[k]}`,12,18,C.ink,sm(W)?13:15,"left",true);
 const TX=["Una cellula procariotica (probabilmente un archeobatterio), con il DNA libero nel citoplasma e nessun organello.","La membrana plasmatica si ripiega verso l'interno e circonda il DNA: nascono l'<b>involucro nucleare</b> (doppio, con pori) e il <b>reticolo endoplasmatico</b>, continui tra loro (sistema delle endomembrane).","La cellula ingloba per fagocitosi un <b>α-proteobatterio aerobio</b>, capace di usare l'O₂ per produrre molto ATP.","Il batterio non viene digerito: vive dentro l'ospite (endosimbionte) avvolto da <b>due membrane</b>, l'interna sua, l'esterna dalla vescicola dell'ospite. Scambio: nutrienti in cambio di ATP.","Si divide per scissione e cede gran parte dei suoi geni al nucleo: diventa il <b>mitocondrio</b>. Prove: doppia membrana, DNA circolare proprio, ribosomi 70S, divisione per scissione, dimensioni di un batterio."];
 return `<b>Teoria endosimbiotica</b> – fase ${k+1} di 5: ${TX[k]}`;}
const OB=[["emoglobina",.0055,"5,5 nm"],["ribosoma",.025,"25 nm"],["virus HIV",.12,"120 nm"],["mitocondrio",1.5,"~1,5 µm"],["batterio",2,"~2 µm"],["nucleo",6,"~6 µm"],["globulo rosso",7.5,"7,5 µm"],["epatocita",25,"~25 µm"],["ovocita",120,"~120 µm"]];
const ZS=[-1.301,-.301,.699,1.699,2.477],ZL=["0,05 µm","0,5 µm","5 µm","50 µm","300 µm"];
function dimScene(g,p,st,dt,W,H){if(st.zz==null)st.zz=ZS[p.z];st.zz+=(ZS[p.z]-st.zz)*Math.min(1,(dt||0)*3);if(!dt)st.zz=st.zz;
 const Fw=Math.pow(10,st.zz),sc=(W-20)/Fw,gap=sm(W)?80:100,F=sm(W)?10.5:12,Y=H*.47;
 const xs=[];let x=0,pr=0;OB.forEach((o,i)=>{const r=o[1]*sc/2;if(i)x+=pr+r+gap;xs.push(x);pr=r;});
 const Lt=Math.log10(.3*Fw),L=OB.map(o=>Math.log10(o[1]));let fi=0;if(Lt<=L[0])fi=0;else if(Lt>=L[8])fi=8;else{for(let i=0;i<8;i++)if(Lt>=L[i]&&Lt<L[i+1]){fi=i+(Lt-L[i])/(L[i+1]-L[i]);break;}}
 const i0=Math.floor(fi),f=fi-i0,cX=i0<8?lerp(xs[i0],xs[i0+1],f):xs[8],off=W/2-cX,vis=[];
 OB.forEach((o,i)=>{const X=xs[i]+off,r=o[1]*sc/2;if(X+r<0||X-r>W)return;const rd=Math.max(r,1.5),t=st.t;
  if(r>4000){rr(g,Math.max(-10,X-r),0,W+20,H,0,A_(C.soon,.06));line(g,X-r,0,X-r,H,C.soon,2);vis.push(o[0]+" (enorme: ne vedi solo il bordo)");return;}
  if(r>=6&&r<=W*.6)vis.push(o[0]);
  if(i==0)circ(g,X,Y,rd,A_(C.warn,.6),C.warn,1);
  if(i==1){circ(g,X,Y+rd*.3,rd*.8,A_(C.fam,.45),C.fam,1);circ(g,X,Y-rd*.45,rd*.58,A_(C.fam,.3),C.fam,1);}
  if(i==2){circ(g,X,Y,rd,A_(C.lp,.15),C.lp,Math.min(2,rd/3));if(rd>8)for(let j=0;j<10;j++){const a=j/10*6.283+t*.3;circ(g,X+Math.cos(a)*rd*1.08,Y+Math.sin(a)*rd*1.08,rd*.07,C.lp);}if(rd>12)capsid(g,X,Y,rd*.7);}
  if(i==3){g.save();g.translate(X,Y);g.rotate(Math.sin(t*.7)*.15);mito(g,0,0,2*rd,rd*.8);g.restore();}
  if(i==4){rr(g,X-rd,Y-rd*.4,2*rd,rd*.8,rd*.4,A_(C.ok,.15),C.ok);if(rd>10)chrLoop(g,X,Y,rd*.3,rd*.18,C.acc,0,6.29,1.5);}
  if(i==5){circ(g,X,Y,rd,A_(C.fam,.1),C.fam,2);if(rd>6)circ(g,X+rd*.25,Y-rd*.2,rd*.3,A_(C.fam,.3));}
  if(i==6){circ(g,X,Y,rd,A_(C.warn,.35),C.warn,2);if(rd>5)circ(g,X,Y,rd*.45,A_(C.warn,.18));}
  if(i==7){hexa(g,X,Y,rd,A_(C.ok,.08),C.ok,2);if(rd>8)circ(g,X,Y,rd*.24,A_(C.fam,.2),C.fam,1.5);}
  if(i==8){circ(g,X,Y,rd*1.06,null,A_(C.soon,.5),3);circ(g,X,Y,rd,A_(C.soon,.1),C.soon,2);if(rd>8)circ(g,X,Y,rd*.2,A_(C.fam,.2),C.fam,1.5);}
  if(X>-30&&X<W+30){const xl=Math.max(40,Math.min(W-40,X));txt(g,o[0],xl,H-30,C.ink,F,"center",true);txt(g,o[2],xl,H-14,C.muted,F,"center");}});
 let v=.25*W/sc;const e=Math.pow(10,Math.floor(Math.log10(v))),m=v/e,nv=(m>=5?5:m>=2?2:1)*e,bl=nv*sc;
 line(g,12,20,12+bl,20,C.ink,3);line(g,12,14,12,26,C.ink,2);line(g,12+bl,14,12+bl,26,C.ink,2);
 txt(g,nv<1?F2(nv*1000,1)+" nm":F2(nv,1)+" µm",18+bl,20,C.ink,F+1,"left",true);
 txt(g,"campo: "+F2(Fw,Fw<1?2:0)+" µm",W-10,20,C.muted,F,"right");
 return `Campo visivo largo <b>${F2(Fw,Fw<1?2:0)} µm</b>${Math.abs(st.zz-ZS[p.z])>.02?" (zoom in corso)":""}. Disegnati in scala: <b>${vis.join(", ")||"–"}</b>. Un batterio (1–2 µm) è circa 10 volte più piccolo di una cellula eucariotica (10–100 µm) e ha le dimensioni di un mitocondrio, un indizio dell'endosimbiosi; i virus (20–300 nm) si vedono solo al microscopio elettronico.`;}

/* ---------- b1d: condensazione/idrolisi, chinasi/fosfatasi ---------- */
function water(g,x,y,a){g.save();g.globalAlpha=a==null?1:a;circ(g,x-6,y+4,3,C.muted);circ(g,x+6,y+4,3,C.muted);circ(g,x,y,5.5,C.warn);g.restore();}
function condScene(g,p,st,W,H){const n=p.n,J=1.1,bt=(n-1)*J,T=bt*2+2.8,tt=st.t%T,F=sm(W)?10.5:12;let ph,j,u;
 if(tt<bt){ph=0;j=Math.floor(tt/J);u=(tt%J)/J;}else if(tt<bt+1.4){ph=1;j=n-1;u=0;}else if(tt<bt*2+1.4){ph=2;const h=tt-bt-1.4;j=n-2-Math.floor(h/J);u=(h%J)/J;}else{ph=3;j=-1;u=0;}
 const sp=Math.min(70,(W-30)/n),s=Math.min(22,sp*.34),y=H*.62,x0=W/2-(n-1)*sp/2,X=i=>x0+i*sp;
 const formed=b=>ph==0?b<j||(b==j&&u>=.5):ph==1?true:ph==2?b<j||(b==j&&u<.5):false;
 let nb=0;for(let b=0;b<n-1;b++){const xa=X(b)+s*.87,xb=X(b+1)-s*.87,xm=(xa+xb)/2;
  if(formed(b)){nb++;line(g,xa,y,xb,y,C.ink,2.5);if(sp>34)txt(g,"O",xm,y-9,C.warn,F,"center",true);}
  else if(sp>40){txt(g,"OH",xa+2,y+12,C.muted,9.5,"left",true);txt(g,"H",xb-2,y+12,C.muted,9.5,"right",true);}
  let wy=null,wa=1;if(ph==0&&b==j){if(u>=.5)wy=lerp(y,46,ez((u-.5)*2));else{circ(g,lerp(xa,xm,u*2),y+4,3,C.warn);circ(g,lerp(xb,xm,u*2),y+4,2.5,C.muted);}}
  else if(ph==2&&b==j){if(u<.5)wy=lerp(46,y,ez(u*2));}
  else if(formed(b))wy=46+Math.sin(st.t*3+b)*2;
  if(wy!=null)water(g,xm,wy,wa);}
 for(let i=0;i<n;i++){hexa(g,X(i),y,s,A_(C.acc,.25),C.acc,2);if(s>=12)txt(g,"Glc",X(i),y,C.ink,s>17?11:9,"center",true);}
 const H1=["Condensazione (anabolismo): si forma un legame, esce H₂O","Polimero formato","Idrolisi (catabolismo): entra H₂O, il legame si rompe","Monomeri di nuovo liberi"][ph];
 txt(g,H1,12,18,C.ink,fit(g,H1,W-24,sm(W)?12.5:15,true),"left",true);
 txt(g,`legami: ${nb} · H₂O liberate: ${nb}`,W/2,H-16,C.muted,F+1,"center",true);
 return `Con <b>${n}</b> monomeri (qui glucosio) si formano <b>${n-1}</b> legami glicosidici e si liberano <b>${n-1}</b> molecole d'acqua: è la <b>condensazione</b>, tipica dell'anabolismo (richiede energia). L'<b>idrolisi</b> fa il contrario: consuma ${n-1} H₂O e rompe i legami (catabolismo, es. digestione). Ora: <b>${nb}</b> legami. Vale anche per legame peptidico (proteine) e fosfodiestere (acidi nucleici).`;}
function kinScene(g,p,st,dt,W,H){const r=p.r/100,F=sm(W)?10.5:12,cols=sm(W)?4:6,rows=12/cols;
 if(!st.pr||st.pr.length!==12){st.pr=[];for(let i=0;i<12;i++)st.pr.push({ph:Math.random()<r,fl:0,by:0});}
 const kk=.9*r,kp=.9*(1-r);st.pr.forEach(q=>{q.fl=Math.max(0,q.fl-(dt||0));if(!q.ph&&Math.random()<kk*(dt||0)){q.ph=true;q.fl=.8;q.by=0;}else if(q.ph&&Math.random()<kp*(dt||0)){q.ph=false;q.fl=.8;q.by=1;}});
 const bwid=(W-36)/2,by=12,bh=36;rr(g,12,by,bwid,bh,10,A_(C.soon,.15),C.soon);rr(g,24+bwid,by,bwid,bh,10,A_(C.ben,.15),C.ben);
 txt(g,"chinasi",12+bwid/2,by+12,C.ink,F+1,"center",true);txt(g,"ATP → ADP: aggiunge P",12+bwid/2,by+27,C.muted,fit(g,"ATP → ADP: aggiunge P",bwid-10,F,false),"center");
 txt(g,"fosfatasi",24+bwid*1.5,by+12,C.ink,F+1,"center",true);txt(g,"+ H₂O: toglie Pᵢ",24+bwid*1.5,by+27,C.muted,fit(g,"+ H₂O: toglie Pᵢ",bwid-10,F,false),"center");
 const gy=by+bh+14,cw=(W-24)/cols,ch=(H-gy-8)/rows,R=Math.min(cw,ch)*.3;let na=0;
 st.pr.forEach((q,i)=>{const x=12+cw*(i%cols)+cw/2,y=gy+ch*Math.floor(i/cols)+ch/2;
  if(q.fl>0){const a=q.fl/.8,sx=q.by?24+bwid*1.5:12+bwid/2;line(g,sx,by+bh,x,y-R,A_(q.by?C.ben:C.soon,a),2,[4,4]);}
  if(q.ph){na++;g.beginPath();g.moveTo(x,y);g.arc(x,y,R,.45,6.283-.45);g.closePath();g.fillStyle=A_(C.ok,.3);g.fill();g.strokeStyle=C.ok;g.lineWidth=2;g.stroke();
   const sx=x+R*1.25+Math.cos(st.t*5+i)*1;circ(g,sx,y,R*.18,C.soon);circ(g,x+R*.75,y-R*.75,R*.28,C.soon);txt(g,"P",x+R*.75,y-R*.75,C.card,Math.max(8,R*.38),"center",true);}
  else{rr(g,x-R,y-R*.85,2*R,1.7*R,R*.35,A_(C.muted,.22),C.muted);}
  if(q.fl>.4)circ(g,x,y,R*1.25,null,A_(q.by?C.ben:C.soon,(q.fl-.4)/.4),2);});
 return `Proteine fosforilate e <b>attive</b> (verdi): <b>${na} su 12</b>. Con la chinasi al ${p.r}% dell'attività totale l'equilibrio atteso è circa <b>${p.r}%</b> di proteine attive. La <b>chinasi</b> trasferisce il fosfato γ dell'ATP su una Ser, Thr o Tyr; la <b>fosfatasi</b> lo rimuove per idrolisi: un interruttore reversibile (modificazione post-traduzionale). Qui la forma fosforilata è quella attiva, ma in altre proteine è il contrario.`;}

/* ---------- b2b: cromatina ---------- */
/* ---------- b2c: genoma ---------- */
const GEN=[["Esoni codificanti",1.5,"warn"],["Introni e UTR",24,"soon"],["LINE (L1)",21,"acc"],["SINE (Alu)",13,"ben"],["Retrovirus endogeni (LTR)",8,"fam"],["Trasposoni a DNA",3,"lp"],["Ripetizioni in tandem",3,"u5"],["Altro: DNA unico, satelliti, duplicazioni",26.5,"muted"]];
function boxes(g,x,y,w,h,L,F){let X=x;L.forEach(([s,f,col])=>{const bw=w*f;rr(g,X,y,bw-2,h,4,A_(C[col],.3),C[col]);const fs=fit(g,s,bw-6,F,true);if(tw(g,s,fs,true)<=bw-4)txt(g,s,X+bw/2-1,y+h/2,C.ink,fs,"center",true);X+=bw;});}
function geneEx(g,x,y,w,hl,F){const E=[[0,.1],[.26,.33],[.5,.56],[.78,.92]];line(g,x,y+9,x+w,y+9,hl==1?C.soon:C.muted,hl==1?4:2);E.forEach(([a,b])=>rr(g,x+a*w,y,(b-a)*w,18,4,hl==0?A_(C.warn,.5):A_(C.muted,.25),hl==0?C.warn:C.muted));txt(g,hl==0?"esoni":"introni",x+w*(hl==0?.53:.41),y+30,hl==0?C.warn:C.soon,F,"center",true);}
function dna2(g,x1,x2,y,col){line(g,x1,y-4,x2,y-4,col||C.muted,2.5);line(g,x1,y+4,x2,y+4,col||C.muted,2.5);for(let x=x1+5;x<x2;x+=9)line(g,x,y-4,x,y+4,A_(col||C.muted,.5),1);}

/* ---------- b4a: mutazioni ---------- */
const GC={ATG:"Met",GAG:"Glu",GTG:"Val",AAG:"Lys",TAG:"STOP",CTG:"Leu",CTA:"Leu",ATT:"Ile",TTT:"Phe",GAT:"Asp",GGT:"Gly",TGG:"Trp",TAA:"STOP",AAT:"Asn",TGA:"STOP"};
const WT="ATGGAGAAGCTGATTTTTGATGGTTGGTAA";
const MUT=[{s:"ATGGAGAAGCTAATTTTTGATGGTTGGTAA",i:[11]},{s:"ATGGTGAAGCTGATTTTTGATGGTTGGTAA",i:[4]},{s:"ATGGAGTAGCTGATTTTTGATGGTTGGTAA",i:[6]},{s:"ATGGAGAAGCTGAATTTTTGATGGTTGGTAA",i:[12]},{s:"ATGGAGAAGTGATTTTTGATGGTTGGTAA",d:[9],at:9},{s:"ATGGAGAAGCTGATTGATGGTTGGTAA",d:[15,16,17],at:15}];
function transl(s){const a=[];for(let i=0;i+3<=s.length;i+=3){const c=GC[s.substr(i,3)]||"?";a.push(c);if(c==="STOP")break;}return a;}
function codRow(g,s,x0,y,cw,F,hiB,dl,scan,shiftFrom){const nC=Math.ceil(s.length/3),aa=transl(s),stopAt=aa.indexOf("STOP"),lw=F*.66;
 for(let c=0;c<nC;c++){const x=x0+c*cw,after=stopAt>=0&&c>stopAt,fs=shiftFrom!=null&&c>=shiftFrom&&!after;
  rr(g,x+1,y-11,cw-2,22,5,after?A_(C.muted,.1):fs?A_(C.warn,.16):A_(C.acc,c%2?.14:.26),scan===c?C.ink:null);
  for(let j=0;j<3;j++){const bi=c*3+j;if(bi>=s.length)break;const hi=hiB&&hiB.includes(bi);txt(g,s[bi],x+cw/2+(j-1)*lw,y,hi?C.warn:after?C.muted:C.ink,F,"center",true);}}
 if(dl!=null){const x=x0+Math.floor(dl/3)*cw+((dl%3)/3)*cw;txt(g,"▲",x,y+17,C.warn,10,"center");}
 return aa;}
function aaRow(g,aa,x0,y,cw,F,n,ref){for(let c=0;c<Math.min(n,aa.length);c++){const a=aa[c],x=x0+c*cw+cw/2,diff=ref&&ref[c]!==a;
  if(a==="STOP"){rr(g,x-cw/2+2,y-9,cw-4,18,9,A_(C.warn,.25),C.warn);txt(g,"stop",x,y,C.warn,Math.min(F,cw/3.2),"center",true);}
  else{circ(g,x,y,Math.min(cw*.46,13),diff?A_(C.warn,.3):A_(C.ok,.3),diff?C.warn:C.ok,1.5);txt(g,a,x,y,C.ink,Math.min(F-1,cw/3.1),"center",true);}}}
const RS="ATGCCGTTAGCATGGA",RC={A:"T",T:"A",G:"C",C:"G"};
function duplex(g,x0,y,bw,top,bot,dxR,brk,F){/* top/bot: stato per base: n normale, d danno, x assente, w nuova; dxR: spostamento delle basi dopo brk */
 for(let i=0;i<16;i++){const dx=i>=brk?dxR:0,x=x0+i*bw+dx;[[top,RS[i],y,C.acc],[bot,RC[RS[i]],y+bw+3,C.ben]].forEach(([S,ch,yy,col])=>{const s=S[i];if(s==="x")return;
  const f=s==="d"?A_(C.warn,.6):s==="w"?A_(C.ok,.5):A_(col,.22);rr(g,x+1,yy,bw-2,bw,4,f,s==="d"?C.warn:s==="w"?C.ok:null);if(bw>=15)txt(g,ch,x+bw/2,yy+bw/2,C.ink,F,"center",true);});}}
function repairScene(g,p,st,W,H){const F=sm(W)?10.5:12,bw=Math.min(34,(W-40)/16.5),x0=(W-16*bw)/2,y=H*.36,A=Array(16).fill("n"),Bt=Array(16).fill("n");let k,u,N,TX,dx=0,brk=99;
 const enz=(x,yy,s,col)=>pill(g,x,yy,s,col,F);
 if(p.r==1){N=["Riconoscimento del danno","Incisione ed escissione","Sintesi (DNA polimerasi)","Saldatura (DNA ligasi)","Riparato"];[k,u]=stage(st.t%11,[0,2.2,4.4,6.8,8.8,11]);
  if(k==0){A[6]=A[7]="d";enz(lerp(30,x0+7*bw,ez(u)),y-22,"riconoscimento",C.fam);}
  if(k==1){for(let i=4;i<10;i++)A[i]="x";g.save();g.globalAlpha=1-u;for(let i=4;i<10;i++){rr(g,x0+i*bw+1,y-u*30,bw-2,bw,4,i==6||i==7?A_(C.warn,.6):A_(C.acc,.22));}g.restore();enz(x0+7*bw,y-46,"nucleasi",C.fam);}
  if(k>=2){const m=k==2?Math.floor(u*6.99):6;for(let i=4;i<10;i++)A[i]=i-4<m?"w":"x";if(k==2)enz(x0+(4+m)*bw,y-22,"DNA polimerasi",C.ok);}
  if(k==3){if(u<.7)line(g,x0+10*bw,y-6,x0+10*bw,y+bw+6,C.warn,2);enz(x0+10*bw,y-22,"DNA ligasi",C.soon);}
  if(k==0)txt(g,"dimero di timina",x0+7*bw,y+2*bw+24,C.warn,F,"center",true);
  TX=["Un danno (qui un <b>dimero di timina</b> da UV) deforma l'elica e viene riconosciuto.","Il filamento danneggiato viene inciso ai due lati e un breve tratto viene rimosso (riparazione per escissione di nucleotidi, NER).","La DNA polimerasi riempie il buco copiando il filamento integro, che fa da stampo.","La DNA ligasi salda l'ultimo legame fosfodiestere.","Riparazione <b>esatta</b>, perché l'informazione c'è sull'altro filamento. Per una singola base alterata agisce la BER (glicosilasi), per gli appaiamenti sbagliati la mismatch repair. Difetti della NER causano lo xeroderma pigmentoso."];}
 else if(p.r==2){N=["Rottura del doppio filamento","Le proteine Ku legano le estremità","Le estremità vengono rifinite","Saldatura diretta (ligasi IV)","Riparato con piccola delezione"];[k,u]=stage(st.t%11,[0,2,4,6.2,8.6,11]);brk=8;
  dx=k==0?ez(u)*30:k<3?30:k==3?lerp(30,-2*bw,ez(u)):-2*bw;
  if(k>=2){const a=k==2?1-u:0;if(a<=0){A[7]=A[8]=Bt[7]=Bt[8]="x";}else{A[7]=A[8]=Bt[7]=Bt[8]="d";}}
  if(k>=1&&k<=3){const a=k==1?u:1;g.save();g.globalAlpha=a;ell(g,x0+8*bw-6,y+bw,10,bw+6,null,C.fam,3);ell(g,x0+8*bw+dx+6,y+bw,10,bw+6,null,C.fam,3);g.restore();txt(g,"Ku",x0+8*bw+dx/2,y-16,C.fam,F,"center",true);}
  if(k>=4)txt(g,"−2 bp",x0+7*bw,y+2*bw+22,C.warn,F+1,"center",true);
  TX=["Radiazioni ionizzanti o farmaci rompono <b>entrambi</b> i filamenti: non resta uno stampo sull'altro filamento.","L'eterodimero Ku riconosce e protegge le due estremità.","Le estremità danneggiate vengono rifinite: si perdono alcune basi.","La DNA ligasi IV unisce direttamente le estremità (unione di estremità non omologhe, NHEJ).","La NHEJ è rapida e funziona in tutte le fasi del ciclo, ma è <b>imprecisa</b>: qui si sono perse 2 coppie di basi."];}
 else{N=["Rottura del doppio filamento","Resezione: code 3' a singolo filamento","Invasione del cromatide fratello","Sintesi sullo stampo","Riparato senza errori"];[k,u]=stage(st.t%12,[0,2,4.2,6.6,9.2,12]);brk=8;
  const y2=y+2*bw+34;duplex(g,x0,y2,bw,Array(16).fill("n"),Array(16).fill("n"),0,99,F);txt(g,"cromatide fratello (stampo)",W/2,y2+2*bw+18,C.ben,F,"center",true);
  dx=k==0?ez(u)*24:k<3?24:k==3?lerp(24,0,ez(u)):0;
  if(k>=1){const a=k==1?u:1;for(let i=4;i<8;i++)Bt[i]=a>.5?"x":"d";for(let i=8;i<12;i++)A[i]=a>.5?"x":"d";}
  if(k==2||k==3){g.save();g.globalAlpha=k==2?ez(u):1;rr(g,x0+4*bw-3,y2-3,8*bw+6,2*bw+9,8,null,C.ok);g.restore();for(const i of[5,10]){const xx=x0+i*bw+(i>=8?dx:0);arrow(g,xx,y+(i<8?bw:2*bw+3),xx,y2-4,A_(C.ok,k==2?ez(u):1),2);}}
  if(k>=3){const m=k==3?Math.floor(u*4.99):4;for(let i=4;i<8;i++)if(i-4<m)Bt[i]="w";for(let i=8;i<12;i++)if(i-8<m)A[i]="w";}
  TX=["Una rottura su entrambi i filamenti, ma dopo la fase S c'è il <b>cromatide fratello</b>, identico.","Le estremità 5' vengono degradate: restano code 3' a singolo filamento.","Una coda 3' (con la ricombinasi Rad51) invade il cromatide fratello e si appaia alla sequenza identica.","La DNA polimerasi copia lo stampo e ricostruisce le basi mancanti.","La ricombinazione omologa è <b>esatta</b>, ma possibile solo in S e G2. BRCA1 e BRCA2 vi partecipano: se mutati, aumenta il rischio di tumori."];}
 duplex(g,x0,y,bw,A,Bt,dx,brk,F);txt(g,"5'",x0-10,y+bw/2,C.muted,F,"center");txt(g,"3'",x0-10,y+bw*1.5+3,C.muted,F,"center");
 txt(g,`${k+1}/5 · ${N[k]}`,12,18,C.ink,sm(W)?13:15,"left",true);
 return `<b>${["","Riparazione per escissione","Rottura a doppio filamento: NHEJ","Rottura a doppio filamento: ricombinazione omologa"][p.r]}</b> – ${N[k]}: ${TX[k]}`;}

/* ---------- b4c: non disgiunzione e traslocazione ---------- */
function acro(g,x,y,L,w,top,bot,split){/* cromosoma acrocentrico non duplicato: centromero in alto */const s=split==null?0:split;
 if(s>0){rr(g,x-w/2,y-L/2,w,L*s,w/2,top);rr(g,x-w/2,y-L/2+L*s,w,L*(1-s),w/2,bot);circ(g,x,y-L/2+L*s,w*.55,C.ink);}
 else{rr(g,x-w/2,y-L/2,w,L,w/2,top);circ(g,x,y-L/2+w*.6,w*.55,C.ink);}}
function chSet(g,x,y,items,L,w){const n=items.length,sp=w*3.2;items.forEach((it,j)=>{const X=x+(j-(n-1)/2)*sp;if(it.d)chromX(g,X,y,L,w,it.c);else if(it.der)acro(g,X,y,L*1.5,w,C.warn,C.acc,.33);else acro(g,X,y,it.L?L*it.L:L,w,it.c);});}

Object.assign(AN,{
fago:{h:330,c:[{k:"m",l:"Virus",seg:["Fago: ciclo litico","Fago: ciclo lisogeno","Retrovirus (HIV)"],v:0},{k:"uv",l:"Stress da raggi UV (ciclo lisogeno)",seg:["No","Sì: induzione"],v:0}],
 f(g,p,st,dt,W,H){return p.m==2?retro(g,st,W,H):fagoScene(g,p,st,W,H);}},

gram:{h:310,c:[{k:"b",l:"Batterio",seg:["Gram positivo (stafilococco)","Gram negativo (E. coli)"],v:0},{k:"ps",l:"Passaggio",seg:["Automatico","1 Cristalvioletto","2 Lugol","3 Alcol","4 Safranina"],v:0}],
 f(g,p,st,dt,W,H){const gp=p.b==0,nar=W<540,F=nar?10.5:12,NM=["Prima della colorazione","Cristalvioletto","Lugol (mordente)","Alcol (decolorazione)","Safranina (contrasto)"];
  let k,u;if(p.ps>0){k=p.ps;u=cl(st.t/1);}else{const D=2.8;k=Math.floor(st.t/D)%5;u=cl((st.t%D)/1);}
  const prev=k==0?0:k-1,col=mixc(stain(prev,gp),stain(k,gp),u);
  const E=nar?{x:10,y:34,w:W-20,h:160}:{x:W*.42,y:34,w:W*.56,h:H-44},M=nar?{x:10,y:204,w:W-20,h:H-210}:{x:10,y:34,w:W*.38,h:H-44};
  txt(g,k?`${k}/4 · ${NM[k]}`:NM[0],12,16,C.ink,nar?13:15,"left",true);
  rr(g,M.x,M.y,M.w,M.h,14,C.card,C.line);txt(g,"al microscopio ottico",M.x+10,M.y+12,C.muted,F-1,"left");
  const rc=Math.max(4,Math.min(M.w,M.h)*.05),dk=mixc(stain(prev,gp).map((v,i)=>i<3?v*.7:1),stain(k,gp).map((v,i)=>i<3?v*.7:1),u);
  if(gp){const ng=nar?5:4;for(let c=0;c<ng;c++){const gx=M.x+M.w*(.14+.72*hr(c,11)),gy=M.y+24+(M.h-36)*(.15+.7*hr(c,12));for(let i=0;i<7;i++){const a=i*2.4+c,d=i?rc*1.9:0;circ(g,gx+Math.cos(a)*d,gy+Math.sin(a)*d,rc,col,(k==0||(k==3&&!gp))?C.muted:dk,1.2);}}}
  else{for(let i=0;i<(nar?12:10);i++){const x=M.x+M.w*(.1+.8*hr(i,13)),y=M.y+24+(M.h-36)*(.1+.8*hr(i,14));g.save();g.translate(x,y);g.rotate(hr(i,15)*3.14);rr(g,-rc*2.1,-rc*.85,rc*4.2,rc*1.7,rc*.85,col,(stain(k,gp)[3]<.2&&u>.5)?C.muted:dk);g.restore();}}
  rr(g,E.x,E.y,E.w,E.h,14,null,C.line);const lw=E.w*(nar?.56:.58),lx=E.x+8,LW=lw-8,y0=E.y+18,y1=E.y+E.h-18,Hl=y1-y0,lab=(s,y)=>txt(g,s,lx+LW+8,y,C.ink,fit(g,s,E.w-LW-20,F,true),"left",true);
  txt(g,"esterno",lx,E.y+9,C.muted,F-1,"left");txt(g,"citoplasma",lx,y1+9,C.muted,F-1,"left");
  const dots=(ya,yb,n,c,dy,a)=>{for(let i=0;i<n;i++){const x=lx+8+(LW-16)*hr(i,21),y=ya+(yb-ya)*hr(i,22)+(dy||0);circ(g,x,y,2.6,c.replace(/[\d.]+\)$/,(a==null?1:a).toFixed(2)+")"));}};
  if(gp){const yT=y0,yP=y0+Hl*.12,yM=y0+Hl*.62,yC=y0+Hl*.8;
   for(let x=lx+12;x<lx+LW-6;x+=26){line(g,x,yP+8,x,yT+4,C.ben,2);circ(g,x,yT+3,3,C.ben);}
   pgRows(g,lx,yP+4,LW,yM-yP-10,7);bilayer(g,lx,yM,LW,yC-yM,C.lp);
   if(k>=1)dots(yP+4,yM-6,26,col,0,1);if(k>=1)dots(yC+4,y1-2,8,col,0,1);
   lab("acidi teicoici",yT+3);lab("peptidoglicano",(yP+yM)/2-8);lab("spesso (20–80 nm)",(yP+yM)/2+8);lab("membrana",(yM+yC)/2);}
  else{const yL=y0,yO=y0+Hl*.16,yPe=y0+Hl*.36,yPm=y0+Hl*.62,yC=y0+Hl*.82,dis=k>=3?(k==3?u:1):0;
   g.save();g.globalAlpha=1-dis*.65;for(let x=lx+10;x<lx+LW-6;x+=20){line(g,x,yO+2,x,yL+8,C.lp,2);for(let q=0;q<3;q++)circ(g,x+(q%2?3:-3),yL+8-q*3,2,C.lp);}g.restore();
   if(dis>0)g.setLineDash([6,5]);bilayer(g,lx,yO,LW,yPe-yO-2,C.warn,1-dis*.6);g.setLineDash([]);
   rr(g,lx,yPe,LW,yPm-yPe-2,0,A_(C.muted,.07));pgRows(g,lx,yPe+(yPm-yPe)*.38,LW,6,2);bilayer(g,lx,yPm,LW,yC-yPm,C.lp);
   if(k==1||k==2)dots(yPe+2,yPm-4,14,col,0,1);if(k==1||k==2)dots(yC+4,y1-2,8,col,0,1);
   if(k==3){const c0=mixc(STN[2],STN[2],0);dots(yPe+2,yPm-4,14,c0,-u*(Hl*.7),1-u);dots(yC+4,y1-2,8,c0,-u*(Hl*.9),1-u);}
   if(k==4){dots(yPe+2,yPm-4,14,mixc(STN[4],STN[4],0),0,u);dots(yC+4,y1-2,8,mixc(STN[4],STN[4],0),0,u);}
   lab("LPS",yL+6);lab("membrana esterna",(yO+yPe)/2);lab("peptidoglicano",(yPe+yPm)/2-7);lab("sottile + periplasma",(yPe+yPm)/2+8);lab("membrana",(yPm+yC)/2);}
  const T0={0:"Batteri fissati sul vetrino, ancora incolori. Scegli un passaggio o lascia «Automatico».",1:"Il <b>cristalvioletto</b> colora di viola tutte le cellule, Gram positive e Gram negative.",2:"Il <b>Lugol</b> (iodio, mordente) forma con il cristalvioletto un complesso grande e insolubile: tutte le cellule restano viola."};
  const T3=gp?"L'<b>alcol</b> disidrata lo spesso strato di peptidoglicano (fino a 40 strati), i pori si stringono e il complesso resta intrappolato: la cellula <b>resta viola</b>.":"L'<b>alcol</b> scioglie i lipidi della membrana esterna e il peptidoglicano è sottile: il complesso viene lavato via e la cellula <b>si decolora</b>.";
  const T4=gp?"La <b>safranina</b> (rosa) è coperta dal viola: al microscopio le cellule appaiono <b>viola: Gram positive</b>.":"La <b>safranina</b> colora le cellule decolorate: appaiono <b>rosa: Gram negative</b>. La loro membrana esterna contiene LPS (endotossina).";
  return `${k<3?T0[k]:k==3?T3:T4} ${gp?"Gram+: membrana + peptidoglicano spesso con acidi teicoici, niente membrana esterna.":"Gram−: membrana, periplasma con peptidoglicano sottile, membrana esterna con LPS."}`;}},

endosimbiosi:{h:320,c:[{k:"s",l:"Scena",seg:["Origine della cellula eucariotica","Confronto delle dimensioni"],v:0},{k:"z",l:"Larghezza del campo (confronto dimensioni)",seg:ZL,v:2}],
 f(g,p,st,dt,W,H){return p.s==1?dimScene(g,p,st,dt,W,H):endoScene(g,st,W,H);}},

enzimi:{h:300,c:[{k:"m",l:"Processo",seg:["Condensazione e idrolisi","Chinasi e fosfatasi"],v:0},{k:"n",l:"Monomeri (condensazione)",min:2,max:8,st:1,v:4},{k:"r",l:"Peso della chinasi rispetto alla fosfatasi",min:0,max:100,st:5,v:50,u:"%"}],ri:1,
 init(st){st.pr=null;},
 f(g,p,st,dt,W,H){return p.m==1?kinScene(g,p,st,dt,W,H):condScene(g,p,st,W,H);}},

telomeri:{h:330,c:[{k:"tel",l:"Telomerasi",seg:["Assente (cellula somatica)","Attiva (staminale, germinale, tumore)"],v:0},{k:"loss",l:"Basi perse a ogni divisione",min:50,max:200,st:10,v:100,u:" bp"}],ri:1,
 init(st){st.L=10;st.n=0;st.acc=0;st.hist=[[0,10]];st.sen=false;st.cut=0;st.add=0;st.senT=0;},
 f(g,p,st,dt,W,H){const F=sm(W)?10.5:12,P=18/(5000/p.loss);dt=dt||0;st.cut=Math.max(0,st.cut-dt);st.add=Math.max(0,st.add-dt);
  if(!st.sen){st.acc+=dt;while(st.acc>P){st.acc-=P;st.n++;st.L-=p.loss/1000;st.cut=.45;if(p.tel==1&&st.L<9.6){st.L=10;st.add=.45;}st.hist.push([st.n,st.L]);if(p.tel==0&&st.L<=5){st.sen=true;st.senT=st.t;break;}}}
  else if(st.t-st.senT>5){this.init(st);}
  if(st.hist.length>400)st.hist.shift();
  const x0=16,x1=W-16,cy=44,th=sm(W)?18:22,cen=x0+(x1-x0)*.38,tl=Math.max(2,st.L*(sm(W)?2.4:3.4));
  rr(g,x0,cy-th/2,cen-x0-4,th,th/2,A_(C.acc,.25),C.acc);rr(g,cen+4,cy-th/2,x1-cen-4,th,th/2,A_(C.acc,.25),C.acc);
  rr(g,x0,cy-th/2,tl,th,th/2,C.warn);rr(g,x1-tl,cy-th/2,tl,th,th/2,C.warn);circ(g,cen,cy,th*.42,C.ink);
  const oris=[.12,.22,.3,.5,.62,.74,.86];oris.forEach(f=>{const x=x0+(x1-x0)*f;g.fillStyle=C.ok;g.beginPath();g.moveTo(x,cy+th/2+2);g.lineTo(x-5,cy+th/2+10);g.lineTo(x+5,cy+th/2+10);g.closePath();g.fill();});
  txt(g,"telomero",x0,cy-th/2-10,C.warn,F,"left",true);txt(g,"centromero",cen,cy-th/2-10,C.ink,F,"center",true);txt(g,"telomero",x1,cy-th/2-10,C.warn,F,"right",true);
  txt(g,sm(W)?"▲ origini di replicazione":"▲ origini di replicazione (molte, lungo tutto il cromosoma)",x0,cy+th/2+20,C.ok,F,"left");
  const ry=104,nb=Math.max(0,Math.round(st.L*2.4)),bw=Math.min(26,(W-40-60)/26);txt(g,"(TTAGGG)n",x0,ry,C.warn,F,"left",true);const bx=x0+(sm(W)?62:76);
  for(let i=0;i<nb;i++)rr(g,bx+i*bw,ry-7,bw-2,14,3,A_(C.warn,.45),C.warn);
  if(st.cut>0&&p.tel==0||st.cut>0&&st.add<=0){const v=1-st.cut/.45;g.save();g.globalAlpha=1-v;rr(g,bx+nb*bw,ry-7+v*24,bw-2,14,3,A_(C.warn,.45),C.warn);g.restore();}
  if(p.tel==1){const ex=bx+nb*bw+12;ell(g,ex,ry,14,11,A_(C.fam,.3+(st.add>0?.4:0)),C.fam,2);txt(g,sm(W)?"TERT":"telomerasi (RNA stampo)",ex+18,ry,C.fam,F,"left",true);}
  const gx=44,gy=140,gw=W-gx-16,gh=H-gy-30,maxN=p.tel==1?60:Math.ceil(5000/p.loss)+6,xmin=Math.max(0,st.n-maxN+4);
  axes(g,gx,gy,gw,gh,"divisioni","kb");const Y=v=>gy+gh-v/12*gh,X=n=>gx+(n-xmin)/maxN*gw;
  [0,5,10].forEach(v=>txt(g,String(v),gx-6,Y(v),C.muted,F-1,"right"));
  line(g,gx,Y(5),gx+gw,Y(5),C.warn,1.5,[5,4]);txt(g,"soglia critica",gx+gw-2,Y(5)-9,C.warn,F-1,"right");
  g.strokeStyle=C.acc;g.lineWidth=2.5;g.beginPath();let f=true;st.hist.forEach(([n,L])=>{if(n<xmin)return;const X1=X(n),Y1=Y(L);f?g.moveTo(X1,Y1):g.lineTo(X1,Y1);f=false;});g.stroke();
  if(st.sen){rr(g,gx+gw*.15,gy+gh*.12,gw*.7,34,10,A_(C.warn,.15),C.warn);txt(g,"SENESCENZA REPLICATIVA",gx+gw*.5,gy+gh*.12+17,C.warn,fit(g,"SENESCENZA REPLICATIVA",gw*.66,F+2,true),"center",true);}
  const lim=Math.round(5000/p.loss);
  return p.tel==0?`Divisioni: <b>${st.n}</b> · telomeri: <b>${F2(Math.max(st.L,5),1)} kb</b>. La DNA polimerasi non riesce a copiare l'estremità 3' del filamento ritardato (problema della replicazione delle estremità): a ogni divisione si perdono circa ${p.loss} bp di ripetizioni TTAGGG. Da 10 a 5 kb servono circa <b>${lim}</b> divisioni; ${st.sen?"<b>raggiunta la soglia: la cellula smette di dividersi (senescenza, limite di Hayflick)</b>.":"poi la cellula va in senescenza (limite di Hayflick)."}`
   :`Divisioni: <b>${st.n}</b> · telomeri: <b>${F2(st.L,1)} kb</b>, stabili. La <b>telomerasi</b> (trascrittasi inversa con un proprio RNA stampo) riaggiunge le ripetizioni TTAGGG all'estremità 3': la cellula può dividersi senza limite. È attiva in cellule germinali e staminali e in circa il 90% dei tumori.`;}},

cromatina:{h:300,c:[{k:"e",l:"Enzima che agisce sul gene",seg:["HAT: acetila gli istoni","HDAC: deacetila","DNMT: metila il DNA"],v:0}],
 init(st){if(!st.t||st.ac==null){st.ac=.15;st.me=0;st.m=0;st.pol=[];st.acc=0;st.rna=[];}},
 f(g,p,st,dt,W,H){dt=dt||0;const F=sm(W)?10.5:12,e=p.e;
  if(e==0){st.ac+=(1-st.ac)*Math.min(1,dt*.6);st.me=Math.max(0,st.me-dt*.05);}
  if(e==1)st.ac+=(0-st.ac)*Math.min(1,dt*.6);
  if(e==2){st.me+=(1-st.me)*Math.min(1,dt*.7);st.ac+=(0-st.ac)*Math.min(1,dt*.35);}
  const o=cl(st.ac*(1-.85*st.me)),os=ez((o-.15)/.7),yD=H*.5,N=8,rN=Math.max(8,Math.min(16,W*.03)),pA=W*.6,pB=W*.69,gA=W*.72,gB=W-14;
  const P=[];for(let i=0;i<N;i++){const xc=W*.28+i*(W*.43)/(N-1),xo=20+rN+i*(W*.55-20-2*rN)/(N-1);P.push([lerp(xc,xo,os),yD+(i%2?-1:1)*rN*.9*(1-os)]);}
  g.strokeStyle=C.acc;g.lineWidth=2.5;g.beginPath();g.moveTo(6,yD);P.forEach(q=>g.lineTo(q[0],q[1]));g.lineTo(W-6,yD);g.stroke();
  rr(g,pA,yD-6,pB-pA,12,4,A_(C.fam,.4),C.fam);txt(g,"promotore",(pA+pB)/2,yD+20,C.fam,F,"center",true);
  line(g,gA,yD,gB-6,yD,C.ben,6);g.fillStyle=C.ben;g.beginPath();g.moveTo(gB,yD);g.lineTo(gB-10,yD-7);g.lineTo(gB-10,yD+7);g.closePath();g.fill();txt(g,"gene",(gA+gB)/2,yD+20,C.ben,F,"center",true);
  for(let j=0;j<4;j++){const x=pA+(j+.5)*(pB-pA)/4;if(hr(j,9)<st.me*1.05){line(g,x,yD-6,x,yD-14,C.warn,1.5);circ(g,x,yD-16,3.5,C.warn);}}
  P.forEach((q,i)=>{const[x,y]=q;[-2.3,-.85].forEach((a,j)=>{const ex=x+Math.cos(a)*rN*1.7,ey=y+Math.sin(a)*rN*1.7;line(g,x+Math.cos(a)*rN,y+Math.sin(a)*rN,ex,ey,C.soon,1.5);if(hr(i*2+j,1)<st.ac)circ(g,ex,ey,3.5,C.ok);});
   circ(g,x,y,rN+2,null,C.acc,2);circ(g,x,y,rN,A_(C.soon,.5),C.soon,1.5);if(os<.9){circ(g,x,y+rN+4,3.2,A_(C.fam,1-os));}});
  const sp=os>.6?(os-.6)*3:0;st.acc+=dt*sp;if(st.acc>1&&st.pol.length<3){st.acc-=1;st.pol.push(0);}
  st.pol=st.pol.filter(v=>v<1);for(let i=0;i<st.pol.length;i++){st.pol[i]+=dt*.33;if(st.pol[i]>=1){st.m++;st.rna.push(0);}}
  st.pol.forEach(v=>{if(v>=1)return;const x=lerp(pA,gB,v);squig(g,pA,x,yD+30,C.warn,2,2);ell(g,x,yD-2,12,9,A_(C.fam,.55),C.fam,2);});
  st.rna=st.rna.filter(v=>v<1);for(let i=0;i<st.rna.length;i++){st.rna[i]+=dt*.4;const v=st.rna[i];g.save();g.globalAlpha=1-v;squig(g,gA,gB-10,yD-34-v*40,C.warn,2,2);g.restore();}
  if(st.pol.length)txt(g,"RNA pol II",gA,yD-26,C.fam,F,"left",true);
  const ex=20+(Math.sin(st.t*1.1)*.5+.5)*(W*.5),ecol=[C.ok,C.muted,C.warn][e];pill(g,Math.max(30,Math.min(W*.6,ex)),yD-58,["HAT","HDAC","DNMT"][e],ecol,F);
  const stt=os>.65?"Eucromatina: aperta, trascritta":os<.3?"Eterocromatina: compatta, silente":"Cromatina in trasformazione";txt(g,stt,12,18,C.ink,fit(g,stt,W*.68,sm(W)?13:15,true),"left",true);
  txt(g,"mRNA: "+st.m,W-12,18,C.warn,F+1,"right",true);
  const bar=(lab,v,y,col)=>{txt(g,lab,12,y,C.muted,F,"left");const bx=sm(W)?118:150,bw=W-bx-16;rr(g,bx,y-5,bw,10,5,A_(col,.15));rr(g,bx,y-5,Math.max(10,bw*v),10,5,col);};
  bar("acetilazione istoni",st.ac,H-36,C.ok);bar("metilazione CpG",st.me,H-16,C.warn);
  if(!sm(W)){circ(g,W*.62,H-90,3.5,C.ok);txt(g,"acetile",W*.62+8,H-90,C.muted,F-1,"left");circ(g,W*.74,H-90,3.5,C.warn);txt(g,"metile (CpG)",W*.74+8,H-90,C.muted,F-1,"left");circ(g,W*.62,H-72,3.2,C.fam);txt(g,"istone H1",W*.62+8,H-72,C.muted,F-1,"left");}
  const EX=["L'<b>acetilazione</b> delle lisine neutralizza le cariche positive degli istoni: il DNA (negativo) si lega meno, i nucleosomi si distanziano e la RNA polimerasi II raggiunge il promotore."+(st.me>.3?" Ma il promotore è ancora metilato: le proteine che legano le CpG metilate richiamano deacetilasi e frenano l'apertura.":""),"Le <b>deacetilasi</b> tolgono gli acetili: gli istoni tornano positivi, i nucleosomi si compattano con l'istone H1 (fibra di 30 nm) e il promotore non è più accessibile: il gene si spegne.","Le <b>DNA metiltransferasi</b> metilano le citosine delle CpG del promotore; proteine che legano le CpG metilate reclutano deacetilasi: si forma eterocromatina. Il silenziamento è ereditato dopo la divisione (epigenetica)."][e];
  return `Acetilazione degli istoni <b>${Math.round(st.ac*100)}%</b>, metilazione del promotore <b>${Math.round(st.me*100)}%</b>, mRNA prodotti <b>${st.m}</b>. ${EX}`;}},

genoma:{h:330,c:[{k:"v",l:"Vista",seg:["Composizione del genoma","LINE: copia e incolla","Trasposone a DNA: taglia e incolla"],v:0}],
 f(g,p,st,dt,W,H){const F=sm(W)?10.5:12;
  if(p.v==0){const k=Math.floor(st.t/2.4)%8,x0=12,bw=W-24,by=46,bh=26,grow=ez(st.t/1.5);let x=x0;const tot=100;
   GEN.forEach(([n,v,c],i)=>{const w=bw*v/tot*grow;rr(g,x,by,Math.max(1,w-1),bh,3,i==k?C[c]:A_(C[c],.4),i==k?C.ink:null);x+=w;});
   const ma=x0+bw*25.5/100,mb=x0+bw*70.5/100;line(g,ma,by-6,mb,by-6,C.ink,1.5);line(g,ma,by-6,ma,by-1,C.ink,1.5);line(g,mb,by-6,mb,by-1,C.ink,1.5);txt(g,"elementi mobili ≈ 45%",(ma+mb)/2,by-16,C.ink,F,"center",true);
   txt(g,"3,1 miliardi di bp",x0,by-16,C.muted,F-1,"left");
   const two=W>=560,ly=by+bh+20,rh=sm(W)?17:19,colW=two?bw/2:bw;
   GEN.forEach(([n,v,c],i)=>{const cx=x0+(two?(i%2)*colW:0),cy=ly+(two?Math.floor(i/2):i)*rh,b=i==k;rr(g,cx,cy-6,12,12,3,C[c]);const s=n+"  "+(v==26.5?"≈26":F2(v,1))+"%";txt(g,s,cx+18,cy,b?C.ink:C.muted,fit(g,s,colW-24,F,b),"left",b);});
   const ey=ly+(two?4:8)*rh+12,ew=W-24;rr(g,x0-4,ey-6,ew+8,H-ey,10,A_(C[GEN[k][2]],.08));
   const ex=x0+4,ewi=ew-8,yy=ey+12;
   if(k<=1)geneEx(g,ex,yy,ewi,k,F);
   if(k==2)boxes(g,ex,yy,ewi,22,[["5'UTR",.1,"acc"],["ORF1",.2,"acc"],[sm(W)?"ORF2: EN + RT":"ORF2: endonucleasi + trascrittasi inversa",.58,"acc"],["A(n)",.12,"muted"]],F);
   if(k==3)boxes(g,ex,yy,ewi*.45,22,[["Alu ~300 bp",.8,"ben"],["A(n)",.2,"muted"]],F);
   if(k==4)boxes(g,ex,yy,ewi,22,[["LTR",.12,"fam"],["gag",.22,"fam"],["pol",.32,"fam"],["env",.22,"fam"],["LTR",.12,"fam"]],F);
   if(k==5)boxes(g,ex,yy,ewi,22,[["IR",.12,"lp"],["gene della trasposasi",.76,"lp"],["IR",.12,"lp"]],F);
   if(k==6){const s="…CACACACACACACACACA…";txt(g,s,ex,yy+10,C.u5,fit(g,s,ewi,F+3,true),"left",true);}
   if(k==7){const s="sequenze uniche · famiglie geniche · satelliti · ncRNA";txt(g,s,ex,yy+10,C.muted,fit(g,s,ewi,F,true),"left",true);}
   const cap=["~20 000 geni per proteine, ma esoni piccoli","trascritti, poi rimossi con lo splicing","~6 kb, autonomo: ~500 000 copie (quasi tutte inattive)","non autonomo: usa gli enzimi delle LINE","resti di antiche infezioni retrovirali","IR = ripetizioni invertite; quasi tutti inattivi","STR (1–6 bp), VNTR (10–60 bp): impronta genetica","globine, rRNA ripetuti, DNA α-satellite dei centromeri"][k];
   txt(g,cap,ex,yy+42,C.muted,fit(g,cap,ewi,F,false),"left");
   const TX=["<b>Esoni codificanti</b>: solo circa l'1,5% del genoma, pur con circa 20 000 geni per proteine.","<b>Introni e UTR</b>: circa un quarto del genoma; vengono trascritti, poi gli introni sono rimossi dallo splicing.","<b>LINE</b> (soprattutto L1): circa il 21%; retrotrasposoni autonomi di ~6 kb che codificano endonucleasi e trascrittasi inversa.","<b>SINE</b> (soprattutto Alu): circa il 13%; brevi (~300 bp) e non autonomi, si spostano con gli enzimi delle LINE; Alu ha oltre un milione di copie.","<b>Retrovirus endogeni</b> (elementi LTR): circa l'8%; provirus di antiche infezioni della linea germinale.","<b>Trasposoni a DNA</b>: circa il 3%; si spostano con la trasposasi (taglia e incolla), nell'uomo sono quasi tutti inattivi.","<b>Ripetizioni in tandem</b>: microsatelliti (STR, unità di 1–6 bp) e minisatelliti (VNTR), molto variabili tra individui; la loro espansione causa alcune malattie.","<b>Altro</b>: sequenze uniche non codificanti e regolative, famiglie geniche (globine, rRNA), DNA satellite dei centromeri, duplicazioni."];
   return `${TX[k]} Gli elementi mobili (LINE + SINE + LTR + trasposoni a DNA) sono circa il <b>45%</b> del genoma. Percentuali approssimate: parte delle ripetizioni si trova dentro gli introni.`;}
  const line1=p.v==1,col=line1?C.acc:C.lp,yD=H*.4,xs=W*.07,ew=Math.min(W*.22,170),xt=W*.66,gA=W*.54,gB=W*.93,eh=18;
  const T=line1?12:11,[k,u]=stage(st.t%T,line1?[0,2.2,4.4,7,9.6,12]:[0,2,4.2,6.6,8.8,11]);
  let gap=0;if(line1)gap=k<2?0:k==2?ew*ez(u):ew;else gap=k<2?0:k==2?ew*ez((u-.5)*2):ew;
  const ins=line1?k>=2:k>=3;
  dna2(g,6,xt,yD);dna2(g,xt+gap,W-6+gap,yD);rr(g,gA,yD+10,xt-gA,8,3,A_(C.ben,.5));rr(g,xt+gap,yD+10,gB-xt,8,3,A_(C.ben,.5));txt(g,(ins&&gap>ew*.9)?"gene interrotto":"gene",(gA+gB+gap)/2,yD+30,C.ben,F,"center",true);
  const elem=(x,y,w,a,lab)=>{g.save();g.globalAlpha=a;rr(g,x,y-eh/2,w,eh,5,A_(col,.4),col);if(w>30)txt(g,lab,x+w/2,y,C.ink,fit(g,lab,w-6,F,true),"center",true);g.restore();};
  if(line1){elem(xs,yD,ew,1,"L1");
   if(k==0){const w=ew*u;if(w>3)squig(g,xs,xs+w,yD+26,C.warn,2.5,2.5);txt(g,"trascrizione → RNA",xs,yD+46,C.warn,F,"left",true);}
   if(k==1){const v=ez(u),x=lerp(xs,xt-ew/2,v),y=lerp(yD+26,yD+40,v);squig(g,x,x+ew,y,C.warn,2.5,2.5);ell(g,x+ew*.75,y+10,12,9,A_(C.fam,.5),C.fam);txt(g,"RNA + ORF1p/ORF2p",x+ew/2,y+30,C.fam,F,"center",true);}
   if(k==2){const w=ew*(1-u);if(w>3)squig(g,xt,xt+w,yD+40,C.warn,2.5,2.5);ell(g,xt+gap,yD-18,12,9,A_(C.fam,.5),C.fam);elem(xt,yD,gap,cl(u*1.5),"nuova copia");txt(g,"taglio + trascrizione inversa",xt,yD-38,C.fam,F,"center",true);}
   if(k>=3)elem(xt,yD,gap,1,"L1 (nuova copia)");
   txt(g,`${k+1}/4 · ${["Trascrizione dell'elemento","RNA e proteine ORF1p/ORF2p","Taglio e trascrizione inversa nel bersaglio","Nuova copia inserita"][k]}`,12,18,C.ink,sm(W)?13:15,"left",true);
   txt(g,`copie di L1: ${k>=3?2:1}`,W-12,H-14,C.ink,F+1,"right",true);
   return `<b>Retrotrasposizione (copia e incolla)</b>: l'elemento L1 viene trascritto in RNA, ORF2p (endonucleasi + trascrittasi inversa) taglia il DNA in un nuovo sito e vi copia l'RNA in DNA. L'originale resta: le copie passano da 1 a <b>${k>=3?2:1}</b>. Così LINE e SINE sono arrivati a circa un terzo del genoma; un'inserzione dentro un gene può interromperlo (es. alcuni casi di emofilia A).`;}
  else{const up=yD-52;let ex=xs,ey=yD;
   if(k==1){ey=lerp(yD,up,ez(u));}if(k==2){ey=up;ex=lerp(xs,xt,ez(u));}if(k==3){ex=xt;ey=lerp(up,yD,ez(u));}if(k>=4){ex=xt;ey=yD;}
   if(k>=1){g.save();g.beginPath();g.rect(xs-1,yD-8,ew+2,16);g.clip();g.clearRect(xs-1,yD-8,ew+2,16);g.restore();rr(g,xs-1,yD-8,ew+2,16,0,A_(C.card,1));
    const rep=k==1?ez((u-.6)/.4):1;if(rep>0){g.save();g.globalAlpha=rep;dna2(g,xs,xs+ew,yD,C.ok);g.restore();txt(g,"riparato",xs+ew/2,yD+22,C.ok,F,"center",true);}}
   elem(ex,ey,ew,1,"trasposone");
   if(k==0){const a=ez(u);[xs,xs+ew].forEach((x,i)=>ell(g,lerp(i?W*.4:6,x,a),yD-16,10,8,A_(C.fam,.5),C.fam));txt(g,"trasposasi",xs+ew/2,yD-34,C.fam,F,"center",true);}
   txt(g,`${k+1}/5 · ${["La trasposasi riconosce le estremità","Excisione (taglio)","Spostamento","Inserzione nel nuovo sito","Fine: stesso numero di copie"][k]}`,12,18,C.ink,sm(W)?13:15,"left",true);
   txt(g,"copie del trasposone: 1",W-12,H-14,C.ink,F+1,"right",true);
   return `<b>Trasposizione conservativa (taglia e incolla)</b>: la trasposasi riconosce le ripetizioni invertite alle estremità, taglia l'elemento e lo inserisce altrove; il buco lasciato viene riparato. Il numero di copie <b>non cambia</b> (1). Nell'uomo i trasposoni a DNA sono circa il 3% del genoma e oggi quasi tutti inattivi.`;}}},

operone:{h:310,c:[{k:"lat",l:"Lattosio",seg:["Assente","Presente"],v:0},{k:"glu",l:"Glucosio",seg:["Presente","Assente"],v:0}],
 init(st){st.P=[];st.m=0;st.acc=0;st.ry=0;st.cp=0;},
 f(g,p,st,dt,W,H){dt=dt||0;const F=sm(W)?10:12,x0=12,Wu=W-24,yD=H*.42,bh=20;
  const EL=[["lacI",.13,"muted",1],["",.03,null,0],["CAP",.07,"ok",0],["P",.09,"fam",0],["O",.07,"warn",0],["lacZ",.28,"acc",1],["lacY",.18,"ben",1],["lacA",.12,"soon",1]],tot=EL.reduce((a,e)=>a+e[1],0);
  const pos={};let x=x0;line(g,6,yD,W-6,yD,C.muted,3);
  EL.forEach(([n,f,c,gene])=>{const w=Wu*f/tot;if(n){pos[n]=[x,w];rr(g,x+1,yD-bh/2,w-2,bh,5,A_(C[c],gene?.3:.45),C[c]);if(gene)txt(g,n,x+w/2,yD,C.ink,fit(g,n,w-6,F+1,true),"center",true);else txt(g,n,x+w/2,yD+bh/2+11,C[c],F,"center",true);}x+=w;});
  txt(g,"geni strutturali → un solo mRNA",pos.lacZ[0],yD+bh/2+12,C.muted,fit(g,"geni strutturali → un solo mRNA",pos.lacA[0]+pos.lacA[1]-pos.lacZ[0],F,false),"left");
  st.ry+=((p.lat?1:0)-st.ry)*Math.min(1,dt*2);st.cp+=((p.glu?1:0)-st.cp)*Math.min(1,dt*2);
  const [ox,ow]=pos.O,rx=ox+ow/2,ryy=lerp(yD-bh/2-10,yD-74,ez(st.ry)),rs=Math.min(11,ow*.45+4);
  circ(g,rx-rs*.55,ryy,rs*.75,A_(C.warn,.55),C.warn,1.5);circ(g,rx+rs*.55,ryy,rs*.75,A_(C.warn,.55),C.warn,1.5);
  if(st.ry>.5){circ(g,rx-rs*.55,ryy-rs*.8,3.5,C.soon);circ(g,rx+rs*.55,ryy-rs*.8,3.5,C.soon);}
  txt(g,st.ry>.5?"repressore + allolattosio":"repressore",rx+rs*1.6,ryy-(st.ry>.5?6:16),C.warn,F,"left",true);
  const[lx,lw]=pos.lacI;arrow(g,lx+lw/2,yD-bh/2-2,lx+lw/2,yD-38,C.muted,2);txt(g,"LacI",lx+lw/2,yD-48,C.muted,F,"center",true);
  const[cx,cw]=pos.CAP,cy=lerp(yD-110,yD-bh/2-10,ez(st.cp));g.save();g.globalAlpha=.35+.65*st.cp;ell(g,cx+cw/2,cy,Math.max(9,cw*.5),9,A_(C.ok,.5),C.ok);g.restore();if(st.cp>.3)circ(g,cx+cw/2+6,cy-9,3.5,C.ok);
  if(st.cp>.5)txt(g,"CAP-cAMP",cx+cw/2,cy-22,C.ok,F,"center",true);
  if(p.lat)for(let i=0;i<6;i++){const a=st.t*.6+i;circ(g,W*(.55+.07*i)+Math.sin(a)*8,22+Math.cos(a*1.3)*6+(i%2)*10,3.5,C.soon);}
  if(p.lat)txt(g,"lattosio / allolattosio",W*.55-6,22,C.soon,F,"right",true);
  if(!p.glu){for(let i=0;i<3;i++)hexa(g,W-22-i*22,H-22,8,A_(C.acc,.25),C.acc,1.5);txt(g,"glucosio",W-80,H-22,C.acc,F,"right",true);}
  const free=st.ry>.8,rate=free?(st.cp>.8?1.1:.22):0;st.acc+=dt*rate;if(st.acc>1&&st.P.length<4){st.acc-=1;st.P.push(0);}
  const[px,pw]=pos.P,zA=pos.lacZ[0],zB=pos.lacA[0]+pos.lacA[1];
  if(!free||st.P.length==0){ell(g,px+pw/2,yD-2,Math.max(10,pw*.55),10,A_(C.fam,.45),C.fam);if(!free)txt(g,"RNA polimerasi bloccata",px+pw/2,yD+40,C.fam,F,"left",true);}
  st.P.forEach((v,i)=>{st.P[i]=v+dt*.42;});st.P=st.P.filter(v=>{if(v>=1){st.m++;return false;}return true;});
  st.P.forEach(v=>{const X=lerp(zA,zB,v);[[zA,pos.lacY[0],C.acc],[pos.lacY[0],pos.lacA[0],C.ben],[pos.lacA[0],zB,C.soon]].forEach(([a,b,c])=>{if(X>a)squig(g,a,Math.min(X,b),yD+28,c,2.5,2);});ell(g,X,yD-2,12,10,A_(C.fam,.55),C.fam);});
  const n=Math.min(st.m,12),iw=Math.min(54,(W*.62)/6);for(let i=0;i<n;i++){const X=12+(i%6)*(iw+6),Y=H-40+Math.floor(i/6)*14;line(g,X,Y,X+iw*.5,Y,C.acc,3);line(g,X+iw*.5,Y,X+iw*.8,Y,C.ben,3);line(g,X+iw*.8,Y,X+iw,Y,C.soon,3);}
  txt(g,`mRNA policistronici: ${st.m}`,12,H-56,C.ink,F,"left",true);
  const state=!p.lat?"SPENTO":p.glu?"ACCESO al massimo":"acceso, ma debole";txt(g,"Operone lac: "+state,12,18,C.ink,fit(g,"Operone lac: "+state,W*.5,sm(W)?13:15,true),"left",true);
  const ex=!p.lat?`Senza lattosio il <b>repressore</b> LacI è legato all'<b>operatore</b> e blocca la RNA polimerasi: lacZ, lacY e lacA sono spenti (controllo negativo).${p.glu?" Anche se il glucosio manca e CAP-cAMP è legato, il repressore prevale.":""}`
   :!p.glu?"L'<b>allolattosio</b> (induttore) stacca il repressore, ma con glucosio il cAMP è basso: CAP non si lega e la polimerasi si lega male al promotore: trascrizione <b>bassa</b> (repressione da catabolita)."
   :"Senza glucosio il cAMP sale: <b>CAP-cAMP</b> si lega vicino al promotore e recluta la RNA polimerasi (controllo positivo); con il repressore staccato la trascrizione è <b>massima</b>.";
  return `${ex} mRNA prodotti: <b>${st.m}</b>; ogni mRNA è <b>policistronico</b> e codifica β-galattosidasi (lacZ), permeasi (lacY) e transacetilasi (lacA).`;}},

splicing:{h:320,c:[{k:"v",l:"Splicing alternativo",seg:["Esoni 1-2-3-4","Salta l'esone 3","Salta l'esone 2"],v:0}],
 f(g,p,st,dt,W,H){const F=sm(W)?10.5:12,EX=[120,150,90,210],inc=[[1,1,1,1],[1,1,0,1],[1,0,1,1]][p.v],EC=[C.acc,C.ok,C.soon,C.fam];
  const [k,u]=stage(st.t%13,[0,3,4.6,8.2,11,13]),N=["Trascrizione e cappuccio","Taglio e poli(A)","Splicing","Esportazione e traduzione","mRNA maturo nel citoplasma"];
  const x0=30,Wu=W-x0-58,Ip=Wu*.13,kx=(Wu-3*Ip)/570,yD=44,yR=100,yN=H*.62,yC=H*.8,eh=18;
  const pre=[];let x=x0;EX.forEach((n,i)=>{pre.push(x);x+=n*kx+(i<3?Ip:0);});const preEnd=x;
  const mat=[];let m=x0;EX.forEach((n,i)=>{mat.push(m);if(inc[i])m+=n*kx;});
  line(g,0,yN,W,yN,C.line,3);line(g,0,yN+6,W,yN+6,C.line,3);rr(g,W/2-12,yN-2,24,10,0,A_(C.card,1));txt(g,"nucleo",W-10,yN-12,C.muted,F,"right");txt(g,"citoplasma",W-10,yN+20,C.muted,F,"right");
  const sl=k<2?0:k==2?ez((u-.35)/.65):1,yy=k<3?yR:k==3?lerp(yR,yC,ez(u/.6)):yC;
  const ex=i=>lerp(pre[i],mat[i],sl),w=i=>EX[i]*kx;
  if(k==0){line(g,x0-12,yD-3,preEnd+16,yD-3,C.muted,2);line(g,x0-12,yD+3,preEnd+16,yD+3,C.muted,2);txt(g,"DNA",x0-14,yD,C.muted,F,"right");}
  const xh=k==0?x0+u*(preEnd-x0+8):1e9;
  g.save();g.beginPath();g.rect(0,0,xh,H);g.clip();
  if(k<2){for(let i=0;i<3;i++){const a=pre[i]+w(i),b=pre[i+1];line(g,a,yy,b,yy,C.muted,2);if(Ip>34){txt(g,"GU",a+9,yy-9,C.muted,9,"center",true);txt(g,"AG",b-9,yy-9,C.muted,9,"center",true);}}}
  else{let last=0;for(let i=1;i<4;i++){if(!inc[i])continue;const a=ex(last)+w(last),b=ex(i),fade=1-ez((u-.45)/.35);if(k==2&&fade>0&&b-a>1){const hh=26*ez(u/.35);g.save();g.globalAlpha=fade;g.strokeStyle=C.muted;g.lineWidth=2;g.beginPath();g.moveTo(a,yy);g.bezierCurveTo(a+(b-a)*.1,yy-hh*1.6,b-(b-a)*.1,yy-hh*1.6,b,yy);g.stroke();
     for(let j=last+1;j<i;j++){const cx=(a+b)/2,ww=w(j)*.7;rr(g,cx-ww/2,yy-hh*1.2-eh/2,ww,eh*.8,4,A_(EC[j],.5),EC[j]);}
     if(u<.4){ell(g,a+6,yy-6,8,6,A_(C.fam,.5),C.fam,1.5);ell(g,b-6,yy-6,8,6,A_(C.fam,.5),C.fam,1.5);}g.restore();}last=i;}}
  for(let i=0;i<4;i++){if(k>=2&&!inc[i]&&sl>=1)continue;if(k>=2&&!inc[i]){continue;}const X=k>=2?ex(i):pre[i];rr(g,X,yy-eh/2,w(i)-1,eh,4,A_(EC[i],.4),EC[i]);txt(g,String(i+1),X+w(i)/2,yy,C.ink,F,"center",true);}
  g.restore();
  if(k==0)ell(g,Math.min(xh,preEnd+6),yD,13,10,A_(C.fam,.55),C.fam,2);
  if(k>0||u>.08){circ(g,x0-9,yy,7,C.warn);txt(g,"m⁷G",x0-9,yy+(k<3?-16:16),C.warn,9.5,"center",true);if(k==0)txt(g,"cappuccio 5'",x0+4,yy+22,C.warn,F,"left",true);}
  const lastE=(k>=2?ex(3):pre[3])+w(3),tl=k==0?0:k==1?40*ez(u):40;if(tl>2){rr(g,lastE+1,yy-5,tl,10,5,A_(C.warn,.3),C.warn);txt(g,"AAAA",lastE+1+tl/2,yy,C.ink,8.5,"center",true);if(k==1)txt(g,"poli(A) ~200 A",Math.min(W-6,lastE+tl),yy+22,C.warn,F,"right",true);}
  if(k==2&&u<.5)txt(g,"spliceosoma (snRNP)",W/2,yR-46,C.fam,F,"center",true);
  if(k>=3&&(k>3||u>.6)){const mEnd=mat[3]+w(3),v=k==3?cl((u-.6)/.4):1,rx=lerp(x0+20,mEnd-10,(st.t*.25)%1);ell(g,rx,yy-12,16,10,A_(C.ben,.45),C.ben,2);const na=Math.floor(v*6+((st.t*2)%4));for(let i=0;i<Math.min(8,na);i++)circ(g,rx-6-i*9,yy-30-Math.sin(i)*3,4,C.lp);txt(g,"ribosoma",rx,yy+22,C.ben,F,"center",true);}
  txt(g,`${k+1}/5 · ${N[k]}`,12,18,C.ink,sm(W)?13:15,"left",true);
  const L=EX.reduce((a,n,i)=>a+(inc[i]?n:0),0),aa=(L-120)/3-1,list=[1,2,3,4].filter((n,i)=>inc[i]).join("-");
  const TX=["La RNA polimerasi II trascrive il gene: il pre-mRNA contiene <b>esoni</b> (colorati) e <b>introni</b>. Subito il 5' riceve il <b>cappuccio</b> di 7-metilguanosina (legame 5'-5'), che lo protegge e serve al ribosoma.","Dopo il segnale AAUAAA l'RNA viene tagliato e la poli(A) polimerasi aggiunge una <b>coda di circa 200 A</b> senza stampo: stabilità ed esportazione.","Lo <b>spliceosoma</b> (snRNP con gli snRNA U1, U2, U4, U5, U6) riconosce GU al 5' e AG al 3' di ogni introne, lo rimuove come cappio (lariat) e unisce gli esoni."+(p.v?` Qui lo splicing alternativo <b>salta l'esone ${p.v==1?3:2}</b>.`:""),"L'mRNA maturo esce dal nucleo attraverso un poro nucleare.","Nel citoplasma il ribosoma traduce l'mRNA."];
  return `${TX[k]} mRNA maturo: esoni <b>${list}</b> = <b>${L} nt</b> + poli(A) → proteina di <b>${aa} aa</b>. Gli esoni 2 (150 nt) e 3 (90 nt) sono multipli di 3: saltarli non sposta il quadro di lettura. Da un gene, proteine diverse in tessuti diversi.`;}},

mutazioni:{h:290,c:[{k:"m",l:"Mutazione",seg:["Silente","Missenso","Nonsenso","Inserzione +1","Delezione −1","Delezione −3"],v:1},{k:"r",l:"Riparazione del DNA",seg:["Non mostrare","Escissione","NHEJ","Ricombinazione omologa"],v:0}],
 f(g,p,st,dt,W,H){if(p.r>0)return repairScene(g,p,st,W,H);
  const M=MUT[p.m],F=sm(W)?9.5:13,lx=sm(W)?30:44,cw=Math.min(62,(W-lx-10)/11),y1=58,y2=y1+76;
  const wtAA=transl(WT),mAA=transl(M.s),stopM=mAA.indexOf("STOP"),nC=mAA.length,scan=Math.floor(st.t/.75)%(nC+4);
  const sf=p.m==3?4:p.m==4?3:null;
  txt(g,"normale",6,y1,C.muted,F,"left",true);txt(g,"mutato",6,y2,C.warn,F,"left",true);
  codRow(g,WT,lx,y1,cw,F,M.d||[],null,null,null);aaRow(g,wtAA,lx,y1+28,cw,F+1,99,null);
  codRow(g,M.s,lx,y2,cw,F,M.i||[],M.d?M.at:null,scan<nC?scan:null,sf);aaRow(g,mAA,lx,y2+30,cw,F+1,Math.min(scan+1,nC),wtAA);
  const by=H-46,bmax=W-lx-60,bl=n=>n*bmax/9;txt(g,"proteina",6,by-16,C.muted,F,"left",true);
  rr(g,lx,by-6,bl(9),10,5,A_(C.ok,.5));txt(g,"9 aa",lx+bl(9)+6,by-1,C.ink,F,"left",true);
  const na=stopM<0?nC:stopM;rr(g,lx,by+12,Math.max(4,bl(na)),10,5,p.m==0?A_(C.ok,.5):A_(C.warn,.5));txt(g,na+" aa",lx+Math.max(4,bl(na))+6,by+17,C.ink,F,"left",true);
  txt(g,"5'→3', filamento codificante; il ribosoma legge triplette",W-8,18,C.muted,fit(g,"5'→3', filamento codificante; il ribosoma legge triplette",W*.62,F,false),"right");
  const nome=["Silente","Missenso","Nonsenso","Inserzione di 1 base","Delezione di 1 base","Delezione di 3 basi"][p.m];txt(g,nome,6,18,C.ink,sm(W)?13:15,"left",true);
  const TX=["Sostituzione CTG → CTA: entrambi codificano Leu (codice degenerato, terza base): <b>proteina identica</b>, mutazione silente.","Sostituzione A → T: GAG (Glu) → GTG (Val). Cambia <b>un solo amminoacido</b>: è la mutazione dell'anemia falciforme (β-globina, Glu6Val).","Sostituzione A → T: AAG (Lys) → TAG = <b>stop prematuro</b>. Proteina tronca a 2 aa (e l'mRNA è spesso degradato).","L'inserzione di una A sposta il <b>quadro di lettura</b> (frameshift): tutti i codoni a valle cambiano (Asn-Phe) e compare presto uno stop.","La delezione della C sposta il quadro di lettura: il codone che segue diventa TGA, uno stop: proteina di soli 3 aa.","Togliere 3 basi (TTT) <b>mantiene il quadro di lettura</b>: manca solo una Phe, come nella ΔF508 della fibrosi cistica (CFTR)."];
  return `${TX[p.m]} Proteina mutata: <b>${mAA.filter(a=>a!=="STOP").join("-")}</b> (${na} aa contro 9). Le mutazioni puntiformi (sostituzioni, piccole inserzioni o delezioni) sono mutazioni <b>geniche</b>; quelle che cambiano numero o struttura dei cromosomi sono <b>cromosomiche</b>.`;}},

nondisgiunzione:{h:340,c:[{k:"e",l:"Evento",seg:["Meiosi normale","Non disgiunzione in MI","Non disgiunzione in MII","Traslocazione 14;21"],v:1}],
 f(g,p,st,dt,W,H){const F=sm(W)?10:12,e=p.e;
  if(e<3){const [k,u]=stage(st.t%11,[0,2,4,6,8,11]),rc=Math.min(28,W*.075),L=rc*.8,w=Math.max(3.5,rc*.14),Y=[H*.12,H*.36,H*.6],G=[W/2],M1=[W*.3,W*.7],GA=[W*.125,W*.375,W*.625,W*.875];
   const A={d:1,c:C.acc},B={d:1,c:C.warn},a={c:C.acc},b={c:C.warn};
   const mi=e==1?[[A,B],[]]:[[A],[B]],gm=e==0?[[a],[a],[b],[b]]:e==1?[[a,b],[a,b],[],[]]:[[a,a],[],[b],[b]];
   const cell=(x,y,r,al)=>{g.save();g.globalAlpha=al;circ(g,x,y,r,A_(C.acc,.06),C.line,2);g.restore();};
   cell(G[0],Y[0],rc,1);if(k==0)chSet(g,G[0],Y[0],[A,B],L,w);
   if(k>=1){const v=k==1?ez(u):1;M1.forEach((x,i)=>{line(g,G[0],Y[0]+rc,x,Y[1]-rc,A_(C.line,1),1.5);cell(x,Y[1],rc,v);});
    if(k==1){[A,B].forEach((c,j)=>{const dst=e==1?0:j,X=lerp(G[0]+(j-.5)*w*3.2,M1[dst]+(e==1?(j-.5)*w*3.2:0),v),Yy=lerp(Y[0],Y[1],v);chromX(g,X,Yy,L,w,c.c);});}
    else mi.forEach((s,i)=>chSet(g,M1[i],Y[1],s,L,w));}
   if(k>=2){const v=k==2?ez(u):1;GA.forEach((x,i)=>{line(g,M1[i>>1],Y[1]+rc,x,Y[2]-rc*.85,C.line,1.5);cell(x,Y[2],rc*.85,v);});
    if(k==2){gm.forEach((s,i)=>{const src=M1[i>>1];s.forEach((c,j)=>{const X=lerp(src,GA[i]+(j-(s.length-1)/2)*w*3.2,v),Yy=lerp(Y[1],Y[2],v);acro(g,X,Yy,L,w,c.c);});});}
    else gm.forEach((s,i)=>chSet(g,GA[i],Y[2],s,L,w));}
   if(k>=3){const v=k==3?ez(u):1;g.save();g.globalAlpha=v;gm.forEach((s,i)=>{const n=s.length+1,lab=n==2?["46","normale",C.ok]:n==3?["47,+21","trisomia 21",C.warn]:["45,−21","non vitale",C.muted];txt(g,"+ gamete normale",GA[i],Y[2]+rc+12,C.muted,F-1.5,"center");txt(g,lab[0],GA[i],Y[2]+rc+30,lab[2],F+2,"center",true);txt(g,lab[1],GA[i],Y[2]+rc+46,lab[2],F,"center",true);});g.restore();}
   txt(g,"cromosoma 21",G[0]+rc+8,Y[0],C.muted,F,"left");if(k>=1)txt(g,"meiosi I",6,Y[1],C.muted,F,"left",true);if(k>=2)txt(g,"meiosi II",6,(Y[1]+Y[2])/2,C.muted,F,"left",true);
   const nT=gm.filter(s=>s.length==2).length,n0=gm.filter(s=>s.length==0).length;
   const TX=["<b>Meiosi normale</b>: in meiosi I si separano gli omologhi (blu materno, rosso paterno), in meiosi II i cromatidi. Ogni gamete ha <b>un</b> cromosoma 21: con un gamete normale lo zigote ha 46 cromosomi.","<b>Non disgiunzione in meiosi I</b>: gli omologhi restano insieme. Due gameti hanno due 21 (diversi: uno blu e uno rosso), due nessuno. Dopo la fecondazione: <b>50% trisomie</b> (47,+21, sindrome di Down) e 50% monosomie (non vitali). È la causa più frequente, soprattutto materna, e aumenta con l'età della madre.","<b>Non disgiunzione in meiosi II</b>: in una cellula i cromatidi fratelli non si separano. Un gamete ha due 21 <b>identici</b>, uno nessuno, due sono normali: <b>25% trisomie</b>, 25% monosomie, 50% normali."];
   return `${TX[e]} Gameti con due 21: <b>${nT}</b> su 4; senza 21: <b>${n0}</b> su 4. Circa il 95% dei casi di Down è una trisomia libera (47,XX,+21 o 47,XY,+21).`;}
  const [k,u]=stage(st.t%11,[0,1.5,6.3,11]),rc=Math.min(30,W*.09),L=rc*.62,w=Math.max(4,rc*.15),cx=W/2,cy=H*.13,X=[W/6,W/2,W*5/6],Yr=[H*.43,H*.75];
  const c14={c:C.acc,L:1.5},c21={c:C.warn},der={der:1};
  circ(g,cx,cy,rc,A_(C.acc,.06),C.line,2);chSet(g,cx,cy,[c14,c21,der],L,w);txt(g,"portatore bilanciato: 45 cromosomi",cx,cy+rc+12,C.ink,fit(g,"portatore bilanciato: 45 cromosomi",W-20,F,true),"center",true);
  const GM=[[[c14,c21],"46, normale",C.ok],[[der],"45, portatore",C.ok],[[der,c21],"Down (rob)",C.warn],[[c14],"monosomia 21",C.muted],[[der,c14],"trisomia 14",C.muted],[[c21],"monosomia 14",C.muted]];
  const shown=k==0?0:k==1?Math.min(6,Math.floor(u*6.99)):6;
  for(let i=0;i<shown;i++){const x=X[i%3],y=Yr[Math.floor(i/3)];line(g,cx,cy+rc+20,x,y-rc,C.line,1.2);circ(g,x,y,rc*.9,A_(C.acc,.06),C.line,2);chSet(g,x,y,GM[i][0],L,w);txt(g,GM[i][1],x,y+rc+12,GM[i][2],fit(g,GM[i][1],W/3-8,F,true),"center",true);if(k==2||i<shown-1)txt(g,i==0?"sano":i==1?"sano":i==2?"46 cromosomi":"non vitale",x,y+rc+27,C.muted,F-1,"center");}
  if(!sm(W)){acro(g,22,H-28,L*1.5,w,C.acc);txt(g,"14",34,H-28,C.ink,F,"left");acro(g,62,H-28,L,w,C.warn);txt(g,"21",74,H-28,C.ink,F,"left");acro(g,102,H-28,L*1.5,w,C.warn,C.acc,.33);txt(g,"rob(14;21)",114,H-28,C.ink,F,"left");}
  txt(g,"Gameti di un portatore di traslocazione robertsoniana",12,18,C.ink,fit(g,"Gameti di un portatore di traslocazione robertsoniana",W-24,sm(W)?13:15,true),"left",true);
  return `Nella <b>traslocazione robertsoniana</b> i bracci lunghi di 14 e 21 sono fusi (rob(14;21), blu + rosso). Il portatore ha <b>45 cromosomi</b> ma tutto il materiale genetico: è sano. Nei gameti sono possibili 6 combinazioni (${shown} mostrate): 1 normale, 1 bilanciata, 1 con un 21 in più che dà la <b>sindrome di Down da traslocazione</b> (46 cromosomi, 46,XX,rob(14;21),+21) e 3 non vitali. È circa il 4% dei casi di Down e, a differenza della trisomia libera, può ripetersi nella famiglia.`;}}
});

(BIO_TOPICS.find(t=>t.id==="b1a")||{}).anim="fago";
(BIO_TOPICS.find(t=>t.id==="b1b")||{}).anim="gram";
(BIO_TOPICS.find(t=>t.id==="b1c")||{}).anim="endosimbiosi";
(BIO_TOPICS.find(t=>t.id==="b1d")||{}).anim="enzimi";
(BIO_TOPICS.find(t=>t.id==="b2a")||{}).anim="telomeri";
(BIO_TOPICS.find(t=>t.id==="b2b")||{}).anim="cromatina";
(BIO_TOPICS.find(t=>t.id==="b2c")||{}).anim="genoma";
(BIO_TOPICS.find(t=>t.id==="b3b")||{}).anim="operone";
(BIO_TOPICS.find(t=>t.id==="b3c")||{}).anim="splicing";
(BIO_TOPICS.find(t=>t.id==="b4a")||{}).anim="mutazioni";
(BIO_TOPICS.find(t=>t.id==="b4c")||{}).anim="nondisgiunzione";
})();
