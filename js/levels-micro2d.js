/* Étages 0 à 8 : du noyau d'atome à la fourmi.
   Chaque étage renvoie {a: position de l'étage précédent (en unités de celui-ci), c: centre du cadrage, main(c,v), back(c,v): décor qui s'efface dès qu'on part vers l'étage suivant}.
   v donne le temps v.t, la taille d'un pixel en unités v.px, le rectangle visible v.x0..v.x1 / v.y0..v.y1 et v.tag(texte,x,y,a) pour poser une étiquette.
   L'axe y descend : « en haut » veut dire y négatif ; le sol est en y = 0. */

/* 0 · noyau d'oxygène : 8 protons et 8 neutrons serrés en grappe (rayon 2,7 fm = 2 unités) */
function L0(){const n=16,r=.78,P=[];for(let i=0;i<n;i++){const a=i*2.39996,d=Math.sqrt((i+.5)/n)*1.4;P.push([Math.cos(a)*d,Math.sin(a)*d])}
  /* chaque nucléon est attiré vers le centre et repoussé au contact des autres */
  for(let it=0;it<300;it++)P.forEach((p,i)=>{let fx=-p[0]*.04,fy=-p[1]*.04;P.forEach((q,j)=>{if(i==j)return;const dx=p[0]-q[0],dy=p[1]-q[1],l=Math.hypot(dx,dy)||1e-3;if(l<1.3){fx+=dx/l*(1.3-l)*.45;fy+=dy/l*(1.3-l)*.45}});p[0]+=fx;p[1]+=fy});
  const k=2/(Math.max(...P.map(p=>Math.hypot(...p)))+r),kind=[...Array(n)].map((_,i)=>i<8).sort(()=>Math.random()-.5);
  /* les plus éloignés du centre d'abord : ceux du milieu passent devant, comme une grappe vue de face */
  const N=P.map((p,i)=>[p[0]*k,p[1]*k,kind[i]?'#E8483C':'#2F6BE0',i]).sort((a,b)=>Math.hypot(b[0],b[1])-Math.hypot(a[0],a[1]));
  return{a:[0,0],main:(c,v)=>{glow(c,0,0,3.8,'#ffd6c8',.3);N.forEach(([x,y,col,i])=>ball(c,x+Math.sin(v.t*3+i)*.015,y+Math.cos(v.t*2.6+i)*.015,r*k,col))}}}

/* 1 · atome d’oxygène : 2 électrons à ~7 pm du noyau, 6 à ~60 pm (4 unités). Le noyau, 22 000 fois plus petit que l’atome, y devient invisible */
function L1(){const E=[[.47,0,2.4],[.47,Math.PI,2.4],...[0,1,2,3,4,5].map(i=>[4,i*TAU/6+.3,i%2?.55:-.55])];
  return{a:[0,0],main:(c,v)=>{const px=v.px,g=c.createRadialGradient(0,0,0,0,0,4.8);
    [[0,.3],[.12,.08],[.6,.05],[.83,.15],[1,0]].forEach(([s,a])=>g.addColorStop(s,`rgba(111,168,255,${a})`));c.fillStyle=g;c.fillRect(-4.8,-4.8,9.6,9.6);
    c.strokeStyle='rgba(160,200,255,.28)';c.lineWidth=px;[.47,4].forEach(r=>{c.beginPath();c.arc(0,0,r,0,TAU);c.stroke()});
    E.forEach(([r,a0,w])=>{const a=a0+v.t*w*.35,x=Math.cos(a)*r,y=Math.sin(a)*r;glow(c,x,y,10*px,'#6fa8ff',.7);disc(c,x,y,3.4*px,'#dce9ff')})}}}

/* 2 · molécule d'eau H₂O : liaisons O–H de 95,8 pm (2 unités), angle de 104,5°. Autour, ses voisines reliées par des liaisons hydrogène */
const OXY='#E5413A',HYD='#F4F4F4',HA=52.25*R;
/* molécule centrée sur l'oxygène, tournée de a, à l'échelle s ; renvoie la position des deux hydrogènes */
function mol(c,x,y,a,s){const H=[1,-1].map(k=>{const hx=k*Math.sin(HA)*2,hy=Math.cos(HA)*2;return[x+s*(hx*Math.cos(a)-hy*Math.sin(a)),y+s*(hx*Math.sin(a)+hy*Math.cos(a))]});
  H.forEach(p=>ball(c,p[0],p[1],.8*s,HYD));ball(c,x,y,1.25*s,OXY);return H}
function L2(){const H=[1,-1].map(k=>[k*Math.sin(HA)*2,Math.cos(HA)*2]),nb=[],hb=[];
  /* deux voisines reçoivent les hydrogènes de la molécule centrale, deux autres lui donnent les leurs */
  H.forEach(([x,y])=>{const l=Math.hypot(x,y);nb.push([x+x/l*4.1,y+y/l*4.1,rnd(0,TAU)]);hb.push([x+x/l*.8,y+y/l*.8,x+x/l*2.9,y+y/l*2.9])});
  [-1,1].forEach(k=>{const a=-Math.PI/2+k*.9,d=6.1,x=Math.cos(a)*d,y=Math.sin(a)*d;nb.push([x,y,Math.atan2(-y,-x)-Math.PI/2+k*HA]);hb.push([Math.cos(a)*1.25,Math.sin(a)*1.25,Math.cos(a)*(d-2.8),Math.sin(a)*(d-2.8)])});
  while(nb.length<18){const x=rnd(-15,15),y=rnd(-11,11);if(nb.every(q=>Math.hypot(q[0]-x,q[1]-y)>4.4)&&Math.hypot(x,y)>5)nb.push([x,y,rnd(0,TAU)])}
  return{a:[0,0],back:(c,v)=>{const px=v.px;nb.forEach(([x,y,a],i)=>mol(c,x+Math.sin(v.t*.7+i)*.06,y+Math.cos(v.t*.6+i)*.06,a+Math.sin(v.t*.5+i)*.04,1));
      c.setLineDash([5*px,4*px]);c.strokeStyle='rgba(255,255,255,.75)';c.lineWidth=2*px;hb.forEach(([a,b,d,e])=>{c.beginPath();c.moveTo(a,b);c.lineTo(d,e);c.stroke()});c.setLineDash([])},
    main:c=>mol(c,0,0,0,1)}}

/* 3 · double hélice d'ADN (2 nm de large = 4 unités, 0,34 nm par paire de bases), dans l'eau. La molécule d'eau de l'étage précédent flotte à côté */
const BASES={A:'#F5C431',T:'#E5413A',C:'#45B74F',G:'#2F6BE0'},PAIR={A:'T',T:'A',C:'G',G:'C'};
function L3(){const seq=Array.from({length:130},()=>'ATCG'[Math.random()*4|0]),Y0=-44,ST=.68,PI=6.8,RH=2,PH=.75*Math.PI,S2=4.8e-11/5e-10,wt=[];
  while(wt.length<180){const x=rnd(-16,16),y=rnd(-30,30);if(Math.abs(x)>2.7&&Math.hypot(x-3.2,y-.6)>.6)wt.push([x,y,rnd(0,TAU)])}
  const X=(y,ph)=>RH*Math.sin(TAU*y/PI+ph);
  const strand=(c,ph,y0,y1)=>{c.beginPath();for(let y=y0,f=1;y<=y1;y+=.15,f=0)f?c.moveTo(X(y,ph),y):c.lineTo(X(y,ph),y);c.stroke()};
  return{a:[3.2,.6],back:(c,v)=>wt.forEach(([x,y,a])=>{if(x>v.x0-1&&x<v.x1+1&&y>v.y0-1&&y<v.y1+1)mol(c,x,y,a,S2)}),
    main:(c,v)=>{const y0=Math.max(Y0,v.y0-1),y1=Math.min(-Y0,v.y1+1);if(y1<y0)return;c.lineCap='round';
      c.lineWidth=.55;c.strokeStyle='#8a93a8';strand(c,PH,y0,y1);
      c.lineWidth=.32;c.lineCap='butt';const i0=Math.max(0,Math.ceil((y0-Y0)/ST)),i1=Math.min(seq.length-1,Math.floor((y1-Y0)/ST));
      for(let i=i0;i<=i1;i++){const y=Y0+i*ST,xa=X(y,0),xb=X(y,PH),xm=(xa+xb)/2,b=seq[i];
        c.strokeStyle=BASES[b];c.beginPath();c.moveTo(xa,y);c.lineTo(xm,y);c.stroke();c.strokeStyle=BASES[PAIR[b]];c.beginPath();c.moveTo(xm,y);c.lineTo(xb,y);c.stroke()}
      c.lineCap='round';c.lineWidth=.6;c.strokeStyle='#e8ecf4';strand(c,0,y0,y1)}}}

/* 4 · chromosome (3,2 µm, 1 unité = 0,4 µm) : deux chromatides d'ADN très replié, en X. Des boucles de fibre sortent de sa surface, là où l'on zoome */
function L4(){const CH=[[[-1.75,-3.9],[-.9,-1.8],[-.35,0],[-.9,1.9],[-1.6,3.9]],[[1.75,-3.9],[.9,-1.8],[.35,0],[.9,1.9],[1.6,3.9]]],bl=[];
  const arm=path(p=>CH.forEach(P=>curve(p,P)));
  /* relief : des pelotes de fibre serrées le long des chromatides, chacune éclairée en haut à gauche */
  CH.forEach(P=>{for(let i=0;i<P.length-1;i++)for(let k=0;k<30;k++){const t=Math.random();bl.push([lerp(P[i][0],P[i+1][0],t)+rnd(-.5,.5),lerp(P[i][1],P[i+1][1],t)+rnd(-.5,.5),rnd(.16,.34)])}});
  bl.sort((a,b)=>a[1]-b[1]);
  /* boucles de fibre : petites anses sur le pourtour, dont celle où se trouve l'ADN de l'étage précédent */
  const loops=path(p=>{CH.forEach(P=>P.forEach(([x,y])=>{for(let k=0;k<6;k++){const a=rnd(0,TAU),cx0=x+Math.cos(a)*.92,cy0=y+Math.sin(a)*.92;oval(p,cx0,cy0,rnd(.15,.35),rnd(.08,.16),a)}}));oval(p,2.15,-4.25,.3,.16,-.6)}),
    knots=relief(bl);
  return{a:[2.35,-4.4],main:c=>{c.lineCap='round';c.lineJoin='round';stroke(c,loops,'rgba(190,150,245,.75)',.045);
    stroke(c,arm,'rgba(40,10,70,.35)',1.75);tubeS(c,arm,'#8450d0',1.45);drawRelief(c,knots,'#9C62E6',.3);ball(c,0,0,.42,'#5a2f9a')}}}

/* 5 · cellule de la paroi de l'intestin de la fourmi (8 µm × 20 µm, 1 unité = 2,5 µm) : bordure en brosse vers l'intérieur de l'intestin (en haut),
   noyau (où se trouve le chromosome), mitochondries, réticulum, appareil de Golgi. Ses voisines forment la paroi */
const CW=1.6,CHh=4,LUMEN='#f0dcb4',CELLC='#f7c6b8';
/* grains du cytoplasme et grumeaux de chromatine (coordonnées locales, réutilisées pour chaque cellule et chaque noyau) */
const GRAN=blobs(Array.from({length:160},()=>[rnd(-CW+.2,CW-.2),rnd(-CHh+.2,CHh-.2),rnd(.02,.05)]).flat()),
  CHRP=blobs(Array.from({length:70},()=>{const t=rnd(0,TAU),r=Math.sqrt(Math.random())*.85;return[Math.cos(t)*r,Math.sin(t)*r,rnd(.04,.09)]}).flat()),
  CRIS=path(p=>{p.moveTo(-.3,0);for(let i=0;i<8;i++)p.lineTo(-.26+i*.075,i%2?.11:-.11)});
/* corps de cellule bombé : dégradé, ombre intérieure côté droit, membrane foncée et liseré clair côté lumière */
function cellBody(c,x){c.beginPath();rrect(c,x-CW+.06,-CHh,2*CW-.12,2*CHh,.5);
  const g=c.createLinearGradient(x-CW,-CHh,x+CW,CHh*.6);g.addColorStop(0,'#ffe4da');g.addColorStop(.45,CELLC);g.addColorStop(1,'#df9483');c.fillStyle=g;c.fill();
  c.save();c.clip();c.translate(x,0);fill(c,GRAN,'rgba(170,80,70,.16)');
  const s=c.createLinearGradient(CW-.8,0,CW,0);s.addColorStop(0,'rgba(120,40,30,0)');s.addColorStop(1,'rgba(120,40,30,.3)');c.fillStyle=s;c.fillRect(CW-.8,-CHh,.8,2*CHh);c.restore();
  c.strokeStyle='#b5675a';c.lineWidth=.1;c.stroke();c.save();c.translate(-.05,-.06);c.strokeStyle='rgba(255,244,240,.75)';c.lineWidth=.035;c.stroke();c.restore()}
/* noyau : enveloppe double percée de pores, chromatine en grumeaux, nucléole */
function nucleus(c,x,y,rx,ry,nl=1){const g=c.createRadialGradient(x-rx*.35,y-ry*.35,0,x,y,Math.max(rx,ry));g.addColorStop(0,'#f6efff');g.addColorStop(.6,'#d6c0f5');g.addColorStop(1,'#a985e0');
  c.beginPath();c.ellipse(x,y,rx,ry,0,0,TAU);c.fillStyle=g;c.fill();c.save();c.translate(x,y);c.scale(rx,ry);fill(c,CHRP,'rgba(110,70,170,.25)');c.restore();
  c.strokeStyle='#7d55c0';c.lineWidth=.1;c.stroke();c.setLineDash([.06,.16]);c.strokeStyle='#f3ecff';c.lineWidth=.05;c.stroke();c.setLineDash([]);if(nl)ball(c,x-rx*.45,y+ry*.42,Math.min(rx,ry)*.25,'#8c64cf')}
/* mitochondrie avec ses crêtes */
function mito(c,x,y,a){egg(c,x,y,.42,.2,'#f08a4b',a);c.save();c.translate(x,y);c.rotate(a);stroke(c,CRIS,'rgba(255,228,195,.9)',.03);c.restore()}
function L5(){const MI=[[-.9,-1.5,.5],[.8,-2.2,-.4],[-.7,3.1,.3],[.9,3.3,-.8],[-1,-2.8,1.2],[.6,-.6,.2],[-.8,.2,1.4]],rib=[],
    er=path(p=>{for(let k=0;k<3;k++){const P=[];for(let a=-1;a<=4.2;a+=.35){const r=1.6+k*.2+Math.sin(a*5+k)*.06,q=[Math.cos(a)*r*.82,1.2+Math.sin(a)*r];P.push(q);rib.push(q[0]+rnd(-.08,.08),q[1]+rnd(-.08,.08),.03)}curve(p,P)}}),
    ribo=blobs(rib),golgi=path(p=>{for(let k=0;k<4;k++){p.moveTo(-.7,-1.0-k*.19);p.quadraticCurveTo(0,-1.38-k*.19,.7,-1.0-k*.19)}}),
    ves=relief([[-.9,-.9,.1],[.95,-1.25,.08],[.2,-2.05,.09],[-.3,-3.4,.08],[1.1,-3.6,.1],[-1.2,2.3,.07],[.95,-.55,.07]]),
    mvP=x0=>path(p=>{for(let x=x0-CW+.12;x<x0+CW-.12;x+=.13)rrect(p,x,-4.6,.08,.68,.04)}),mvMe=mvP(0),mvNb=path(p=>{for(let k=-5;k<=5;k++)if(k)p.addPath(mvP(k*3.2))}),
    bac=relief(Array.from({length:70},()=>[rnd(-17,17),rnd(-16,-5),.38,.15,rnd(0,TAU)])),
    fib=path(p=>{for(let y=CHh+.3;y<CHh+1.6;y+=.22){p.moveTo(-20,y);p.lineTo(20,y)}});
  const mv=(c,p)=>{const g=c.createLinearGradient(0,-4.6,0,-3.9);g.addColorStop(0,'#ffeae2');g.addColorStop(1,'#e2998a');fill(c,p,g)};
  return{a:[.15,1.2],
    back:(c,v)=>{const W0=v.x0,Wd=v.x1-v.x0,gm=c.createLinearGradient(0,CHh+.1,0,CHh+1.7);gm.addColorStop(0,'#d98078');gm.addColorStop(1,'#a8504a');
      c.fillStyle='#e8d7a0';c.fillRect(W0,CHh+1.7,Wd,Math.max(0,v.y1-CHh-1.7));c.fillStyle=gm;c.fillRect(W0,CHh+.1,Wd,1.6);stroke(c,fib,'rgba(255,200,190,.35)',.05);
      c.fillStyle='#a85a4e';c.fillRect(W0,-CHh+.3,Wd,2*CHh-.4);drawRelief(c,bac,'#b58bd0',.25);mv(c,mvNb);
      for(let k=-5;k<=5;k++){const x=k*3.2;if(!k||x+CW<v.x0||x-CW>v.x1)continue;cellBody(c,x);nucleus(c,x+(k%2)*.12,1.25,1.1,1.45);mito(c,x-.8,-1.8,.6);mito(c,x+.7,-2.6,-.5);mito(c,x+.8,3.2,.9)}},
    main:c=>{mv(c,mvMe);cellBody(c,0);c.lineCap='round';tubeS(c,er,'#e07fa0',.1);fill(c,ribo,'#8a3a5a');tubeS(c,golgi,'#e8a83a',.13);
      MI.forEach(([x,y,a])=>mito(c,x,y,a));drawRelief(c,ves,'#e8a83a',.25);nucleus(c,0,1.2,1.15,1.5,0);ball(c,-.55,1.85,.26,'#8c64cf')}}}

/* 6 · micro-organisme (grégarine, 200 µm, 1 unité = 30 µm) accroché à la paroi de l'intestin, juste à côté de la cellule de l'étage précédent.
   Une seule cellule géante : un crochet planté dans la paroi, une petite tête (protomérite) et un long corps (deutomérite) parcouru de plis, avec son noyau.
   La paroi n'est dessinée que sur ±200 µm autour de la grégarine, avec des bords fondus : plus loin, c'est l'intestin de l'étage suivant qui la montre */
function L6(){const cw=2*CW*2.5/30,ch=2*CHh*2.5/30,WX=7,K=14,
    chunks=Array.from({length:K},(_,j)=>{const x0=-WX+j*2*WX/K,x1=x0+2*WX/K,cells=new Path2D(),nuc=[],mv=new Path2D();
      for(let k=Math.ceil(x0/cw-.5);(k-.5)*cw<x1;k++){const x=k*cw;rrect(cells,x-cw/2+.005,-ch/2,cw-.01,ch,.045);nuc.push([x+rnd(-.015,.015),.1+rnd(-.02,.02),.085,.115]);
        for(let m=-3;m<=3;m++)mv.rect(x+m*.033-.008,-ch/2-.05,.016,.055)}
      return{x0,x1,a:1-sm(WX*.5,WX,Math.abs((x0+x1)/2)),cells,nuc:relief(nuc),mv}}),
    near=()=>{let x;do x=rnd(-WX,WX);while(Math.random()>1-sm(WX*.4,WX,Math.abs(x)));return x},
    bac=path(p=>{for(let i=0;i<650;i++){const x=near(),y=rnd(-8.6,-.45),a=rnd(0,TAU),l=.035;p.moveTo(x-Math.cos(a)*l,y-Math.sin(a)*l);p.lineTo(x+Math.cos(a)*l,y+Math.sin(a)*l)}}),
    food=relief(Array.from({length:28},()=>[near(),rnd(-8,-1.5),rnd(.15,.5),rnd(.12,.4),rnd(0,TAU)])),
    gr=relief(Array.from({length:150},()=>{const t=rnd(0,TAU),r=Math.sqrt(Math.random());return[Math.cos(t)*r*.68,-3.9+Math.sin(t)*r*2.35,rnd(.03,.065)]})),
    body=path(p=>{oval(p,0,-.75,.62,.68);oval(p,0,-3.9,.88,2.6)}),
    folds=path(p=>{for(let k=-4;k<=4;k++){const x=k*.2;p.moveTo(x*.55,-1.45);p.quadraticCurveTo(x*1.15,-3.9,x*.55,-6.35);p.moveTo(x*.6,-.2);p.quadraticCurveTo(x*.85,-.75,x*.6,-1.3)}});
  return{a:[0,0],c:[-1.6,-2.9],
    back:(c,v)=>{const W0=v.w,gc=c.createLinearGradient(0,-ch/2,0,ch/2),gm=c.createLinearGradient(0,ch/2,0,ch/2+.3),gh=c.createLinearGradient(0,ch/2+.3,0,ch/2+2.5);
      gc.addColorStop(0,'#ffe2d8');gc.addColorStop(.5,CELLC);gc.addColorStop(1,'#d98a7a');gm.addColorStop(0,'#d77a72');gm.addColorStop(1,'#a8504a');gh.addColorStop(0,'rgba(232,215,160,1)');gh.addColorStop(1,'rgba(232,215,160,0)');
      chunks.forEach(k=>{if(k.x1<v.x0||k.x0>v.x1)return;c.globalAlpha=W0*k.a;const w=k.x1-k.x0+.003;
        c.fillStyle=gh;c.fillRect(k.x0,ch/2+.3,w,2.2);c.fillStyle=gm;c.fillRect(k.x0,ch/2+.02,w,.28);c.fillStyle='#a85a4e';c.fillRect(k.x0,-ch/2+.03,w,ch-.03);
        fill(c,k.mv,'#f2b8a8');fill(c,k.cells,gc);stroke(c,k.cells,'#b5675a',.012);drawRelief(c,k.nuc,'#c7a8ef',.2)});
      c.globalAlpha=W0*.6;drawRelief(c,food,'#c9a46a',.15);c.globalAlpha=W0;c.lineCap='round';stroke(c,bac,'#6e4596',.032);c.save();c.translate(-.006,-.007);stroke(c,bac,'#d9b8f0',.012);c.restore()},
    main:(c,v)=>{c.save();c.translate(-.55,-ch/2);c.rotate(-25*R+Math.sin(v.t*.6)*.03);
      c.fillStyle='rgba(80,50,30,.16)';c.beginPath();c.ellipse(.2,-3.7,.95,2.6,0,0,TAU);c.fill();
      [[-.2,.05],[.2,.05]].forEach(([x,y])=>{c.beginPath();c.moveTo(0,-.05);c.quadraticCurveTo(x*1.4,y+.1,x*1.6,y+.18);c.strokeStyle='#8fbf6a';c.lineWidth=.04;c.stroke()});ball(c,0,.02,.17,'#b7d99a');
      const g=c.createRadialGradient(-.35,-4.5,.1,0,-3.9,2.8);g.addColorStop(0,'rgba(238,250,220,.96)');g.addColorStop(.6,'rgba(196,226,160,.93)');g.addColorStop(1,'rgba(125,175,90,.96)');fill(c,body,g);
      c.save();c.clip(body);stroke(c,folds,'rgba(85,135,55,.3)',.025);drawRelief(c,gr,'#a98a52',.18);c.restore();
      stroke(c,body,'#5c9443',.07);c.save();c.translate(-.05,-.06);stroke(c,body,'rgba(255,255,255,.45)',.03);c.restore();
      c.beginPath();c.moveTo(-.6,-1.38);c.lineTo(.6,-1.38);c.strokeStyle='#5c9443';c.lineWidth=.05;c.stroke();ball(c,0,-3.3,.38,'#7a5cc8');ball(c,.06,-3.36,.12,'#3f2780');
      c.restore();v.tag('Grégarine',-2.2,-3.6)}}}

/* 7 · l'intestin de la fourmi : son abdomen (gastre, 1,8 mm) vu en coupe, 1 unité = 0,2 mm.
   Le jabot garde la nourriture que la fourmi partage avec les autres ; l'intestin moyen digère, c'est là que vit la grégarine */
function L7(){const mg=path(p=>curve(p,[[.2,-.4],[-.4,.5],[-1.4,.5],[-2.4,.5],[-3.3,-.3],[-2.6,-1.5],[-1.3,-1.65],[-.9,-1.2]])),
    hg=path(p=>curve(p,[[-.9,-1.2],[-1.6,-.6],[-3.2,.9],[-4.55,.3]])),
    mal=path(p=>{for(let k=0;k<7;k++){const P=[[-.9,-1.2]];let x=-.9,y=-1.2,a=rnd(0,TAU);for(let i=0;i<9;i++){a+=rnd(-1.2,1.2);x+=Math.cos(a)*.35;y+=Math.sin(a)*.35;x=Math.max(-4,Math.min(1,x));y=Math.max(-2.5,Math.min(2.3,y));P.push([x,y])}curve(p,P)}}),
    fat=relief(Array.from({length:80},()=>{const t=rnd(0,TAU),r=Math.sqrt(Math.random());return[Math.cos(t)*r*4,Math.sin(t)*r*2.8,rnd(.15,.32)]})),
    seg=path(p=>[-2.6,-.9,.9,2.7].forEach(x=>{const h=3.3*Math.sqrt(1-x*x/21.2);p.moveTo(x,-h);p.quadraticCurveTo(x+.25,0,x,h)})),
    heart=path(p=>curve(p,[[-4,-2.05],[-1.5,-2.75],[1.5,-2.8],[3.9,-2.25]])),nerve=path(p=>curve(p,[[-3.9,2.1],[-1.5,2.8],[1.5,2.85],[3.8,2.3]])),
    gs=path(p=>oval(p,0,0,4.6,3.3)),sa=-25*R,dx=Math.sin(sa),dy=-Math.cos(sa);
  return{a:[-1,1.2],main:(c,v)=>{const gi=c.createRadialGradient(-.8,-.8,.5,0,0,4.8);gi.addColorStop(0,'#fdf4e2');gi.addColorStop(1,'#ecd2a6');fill(c,gs,gi);
      drawRelief(c,fat,'#f3d79a',.15);c.lineCap='round';c.lineJoin='round';tubeS(c,heart,'#e9a0a0',.2);tubeS(c,nerve,'#f4efe0',.1);[-2.6,-.9,.9,2.7].forEach(x=>ball(c,x,2.62+Math.abs(x)*-.05,.13,'#f4efe0'));
      tubeS(c,mal,'#c7d65a',.1);egg(c,2.2,-.3,1.9,1.5,'#f2c94c');c.beginPath();c.ellipse(1.6,-1.05,.7,.32,-.4,0,TAU);c.fillStyle='rgba(255,255,255,.35)';c.fill();
      tubeS(c,hg,'#d98a6e',.75);stroke(c,hg,'#ead2a8',.5);
      /* paroi de l'intestin moyen : une rangée de cellules (pointillés), puis l'intérieur */
      stroke(c,mg,'#b8675b',1.56);c.setLineDash([.06,.035]);stroke(c,mg,'#eba595',1.47);c.setLineDash([]);stroke(c,mg,LUMEN,1.3);ball(c,.25,-.35,.36,'#d98a6e');
      /* la grégarine, minuscule, accrochée en bas de l'intestin moyen */
      egg(c,-1.08+dx*.55,1.15+dy*.55,.13,.5,'#a8d488',sa);
      stroke(c,gs,'#5e2a0e',.34);stroke(c,gs,'#8a4418',.24);c.save();c.translate(-.05,-.06);stroke(c,gs,'rgba(235,170,120,.5)',.06);c.restore();stroke(c,seg,'rgba(122,58,20,.55)',.1);
      v.tag('Jabot',2.2,-1.9);v.tag('Intestin',-2.1,-.35)}}}

/* 8 · fourmi de 5 mm sur le sol de la forêt (1 unité = 1 mm) : tête, antennes coudées, thorax, pétiole, gastre (où se trouve l'intestin) */
function L8(){const legs=[[[.95,-.8],[1.45,-1.3],[1.95,-.45],[2.2,0]],[[.55,-.75],[.6,-1.3],[.25,-.4],[.05,0]],[[.2,-.78],[-.35,-1.3],[-1.1,-.5],[-1.55,0]]],
    far=path(p=>legs.forEach(L=>curve(p,L.map(([x,y],i)=>[x+.18+(i==3?.25:0),y-(i?.04:0)])))),near=path(p=>legs.forEach(L=>curve(p,L))),
    ant=path(p=>{curve(p,[[1.95,-1.5],[2.05,-1.9],[2.15,-2.25]]);curve(p,[[2.15,-2.25],[2.6,-2.15],[2.9,-1.9],[3.1,-1.55]])}),
    mand=path(p=>{p.moveTo(2.1,-1.02);p.quadraticCurveTo(2.5,-1.02,2.5,-.8);p.lineTo(2.35,-.86);p.lineTo(2.3,-.78);p.quadraticCurveTo(2.2,-.92,2.05,-.9);p.closePath()}),
    stripes=path(p=>[-2.1,-1.6,-1.1].forEach(x=>{p.moveTo(x,-1.6);p.quadraticCurveTo(x+.12,-1,x,-.4)})),
    /* poils fins sur le pourtour du corps */
    hairs=path(p=>[[-1.6,-1,.92,.66,26],[1.75,-1.2,.5,.42,12],[.45,-1.02,.62,.3,10]].forEach(([x,y,rx,ry,n])=>{for(let i=0;i<n;i++){const a=rnd(Math.PI*1.05,Math.PI*2.05),px=x+Math.cos(a)*rx,py=y+Math.sin(a)*ry;p.moveTo(px,py);p.lineTo(px+Math.cos(a)*.13,py+Math.sin(a)*.13-.03)}})),
    /* sol : grains de sable (0,2 à 1,5 mm), brindille, mousse, une feuille morte et des brins d'herbe immenses à l'arrière */
    grains=['#9a7a56','#b09a80','#6a4e34'].map(()=>relief(Array.from({length:70},()=>{const r=rnd(.12,.7);return[rnd(-30,30),rnd(-.1,.5)+r*.3,r,r*rnd(.7,1),rnd(0,3)]}))),
    moss=path(p=>{for(let i=0;i<40;i++){const x=rnd(3,30)*(i%2?1:-1),h=rnd(.8,2.5);p.moveTo(x,0);p.quadraticCurveTo(x+rnd(-.4,.4),-h*.6,x+rnd(-.6,.6),-h)}}),
    leaf=path(p=>{p.moveTo(-26,-.1);p.bezierCurveTo(-20,-9,-10,-11,-4.5,-.1);p.closePath()}),
    veins=path(p=>{p.moveTo(-25,-.2);p.quadraticCurveTo(-15,-6.5,-5,-.2);for(let k=1;k<6;k++){const x=-25+k*3.4;p.moveTo(x,-.3-k*.2);p.lineTo(x+1.8,-4.5+Math.abs(k-3)*.6)}}),
    blades=[[-14,3.2,-.08],[-9,2.4,.05],[12,3,.06],[17,2.6,-.05],[23,3.4,.03]],twig=path(p=>{p.moveTo(6,-.35);p.lineTo(28,-.9)});
  return{a:[-1.6,-1],c:[.3,-1.4],
    back:(c,v)=>{blades.forEach(([x,w,a])=>{c.save();c.translate(x,0);c.rotate(a);const g=c.createLinearGradient(-w/2,0,w/2,0);g.addColorStop(0,'rgba(70,125,45,.55)');g.addColorStop(.45,'rgba(140,195,95,.55)');g.addColorStop(1,'rgba(60,110,40,.55)');
        c.fillStyle=g;c.beginPath();c.moveTo(-w/2,0);c.quadraticCurveTo(-w*.4,-40,0,-90);c.quadraticCurveTo(w*.4,-40,w/2,0);c.fill();c.restore()});
      const gl=c.createLinearGradient(-20,-9,-8,0);gl.addColorStop(0,'#b97a44');gl.addColorStop(1,'#8a5630');fill(c,leaf,gl);stroke(c,veins,'#6a3e1c',.25);c.lineCap='round';tubeS(c,twig,'#6b4a2e',.7);stroke(c,moss,'#5f9a3a',.18);
      const gs=c.createLinearGradient(0,0,0,4);gs.addColorStop(0,'#7a5a3a');gs.addColorStop(1,'#5a3f28');c.fillStyle=gs;c.fillRect(v.x0,0,v.x1-v.x0,Math.max(0,v.y1));
      ['#9a7a56','#b09a80','#6a4e34'].forEach((col,i)=>drawRelief(c,grains[i],col,.3))},
    main:(c,v)=>{const s=Math.sin(v.t*2)*.06;c.lineCap='round';c.lineJoin='round';stroke(c,far,'#5e240c',.09);
      egg(c,-1.6,-1,.92,.66,'#9a4418');stroke(c,stripes,'rgba(60,20,5,.45)',.07);c.beginPath();c.ellipse(-1.9,-1.38,.38,.14,-.25,0,TAU);c.fillStyle='rgba(255,235,210,.35)';c.fill();
      egg(c,-.55,-1.05,.16,.22,'#B8541F');egg(c,.45,-1.02,.62,.3,'#B8541F',-.1);egg(c,.85,-1.12,.35,.3,'#B8541F');egg(c,1.25,-1.1,.12,.1,'#B8541F');
      tubeS(c,near,'#8A3A16',.11);fill(c,mand,'#5A2410');egg(c,1.75,-1.2,.5,.42,'#B8541F',.25);ball(c,1.86,-1.33,.12,'#151515');disc(c,1.82,-1.37,.035,'rgba(255,255,255,.8)');
      stroke(c,hairs,'rgba(70,30,10,.55)',.016);
      c.save();c.translate(1.95,-1.5);c.rotate(s);c.translate(-1.95,1.5);tubeS(c,ant,'#8A3A16',.065);ball(c,3.1,-1.55,.08,'#8A3A16');c.restore()}}}
