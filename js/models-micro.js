/* Niveaux 0 à 7 : du noyau d'atome à la fourmi.
   Chaque niveau renvoie {g: groupe, deco: décor qui s'efface dès qu'on dézoome, a: point d'ancrage où se trouve le niveau précédent, upd(t): animation}.
   1 unité de modèle vaut MPU[i] mètres : les objets emboîtés sont à leur taille réelle les uns par rapport aux autres. */

/* membrane translucide à bord lumineux (effet de Fresnel) */
function fres(c,{a0=.06,a1=.7,p=2.5}={}){return new THREE.ShaderMaterial({uniforms:{uC:{value:new THREE.Color(c)},uOp:{value:1}},transparent:true,depthWrite:false,side:THREE.DoubleSide,
  vertexShader:'varying vec3 vN,vV;void main(){vec4 mv=modelViewMatrix*vec4(position,1.);vN=normalize(normalMatrix*normal);vV=normalize(-mv.xyz);gl_Position=projectionMatrix*mv;}',
  fragmentShader:`uniform vec3 uC;uniform float uOp;varying vec3 vN,vV;void main(){float f=pow(1.-abs(dot(normalize(vN),normalize(vV))),${p.toFixed(2)});gl_FragColor=vec4(uC*(.75+.5*f),(${a0.toFixed(3)}+${a1.toFixed(3)}*f)*uOp);}`})}
const ELEC=0x3F7FE0,PURPLES=[0x8B4FD8,0x7A44C8,0x9C62E6,0x6E3DBA,0xA772EE];

/* 0 · noyau d'atome d'oxygène : 8 protons (rouges) et 8 neutrons (bleus) serrés en grappe */
function L0(){const g=new THREE.Group(),core=new THREE.Group(),P=gloss(0xE8483C),N=gloss(0x2F6BE0),r=.78,pos=fib(16,1.2).map(p=>p.add(V3(rnd(-.1,.1),rnd(-.1,.1),rnd(-.1,.1))));
  /* empilement compact : chaque nucléon est attiré vers le centre et repoussé au contact des autres */
  for(let it=0;it<400;it++)pos.forEach((p,i)=>{const f=p.clone().multiplyScalar(-.04);pos.forEach((q,j)=>{if(i!=j){const d=p.clone().sub(q),l=d.length();if(l<1.45)f.addScaledVector(d,(1.45-l)/l*.45)}});p.add(f)});
  /* rayon extérieur ramené à 2 unités (2,7 fm) ; protons et neutrons mélangés */
  const k=2/(Math.max(...pos.map(p=>p.length()))+r),kind=[...Array(16)].map((_,i)=>i<8).sort(()=>Math.random()-.5);
  pos.forEach((p,i)=>{p.multiplyScalar(k);core.add(ball(r*k,kind[i]?P:N,p.x,p.y,p.z,40))});
  g.add(core,glow(0xffd6c8,6,.22));
  return{g,a:V3(0,0,0),upd:t=>{core.rotation.y=t*.25;core.rotation.x=Math.sin(t*.3)*.3}}}

/* 1 · atome d'oxygène : 2 électrons à ~7 pm du noyau, 6 à ~60 pm. Le noyau, 22 000 fois plus petit que l'atome, n'y est plus qu'un repère ;
   les électrons sont des points de taille fixe (ici ce sont les distances qui comptent, pas leur taille) */
function L1(){const g=new THREE.Group(),orb=[];
  [[.27,[.35,0,.1],3],[2.35,[1.15,.35,0],.8],[2.35,[-1,-.5,.7],.7],[2.35,[.2,1.25,-.45],.75]].forEach(([r,rot,sp])=>{const o=new THREE.Group(),ring=orbit(r,0x9fc4ff,.4);ring.rotation.x=Math.PI/2;o.rotation.set(...rot);o.add(ring);
    for(let i=0;i<2;i++){const e=new THREE.Group();e.add(dot(0x6fa8ff,28,.75),dot(0xdfeaff,8));o.add(e);orb.push([e,r,sp,i*Math.PI])}g.add(o)});
  return{g,a:V3(0,0,0),upd:t=>{orb.forEach(([e,r,sp,ph])=>{const a=t*sp+ph;e.position.set(Math.cos(a)*r,Math.sin(a)*r,0)})}}}

/* 2 · molécule d'eau H₂O : liaisons O–H de 95,8 pm, angle de 104,5°.
   Autour, d'autres molécules d'eau tenues par des liaisons hydrogène (pointillés), à 280 pm d'oxygène à oxygène */
const WA=104.5/2*R,WH=[V3(Math.sin(WA)*1.7,-Math.cos(WA)*1.7,0),V3(-Math.sin(WA)*1.7,-Math.cos(WA)*1.7,0)];
const OXY=0xE5413A,HYD=0xF4F4F4;
function water(s,mo,mh,mb){const w=new THREE.Group();w.add(ball(.95*s,mo,0,0,0,40));WH.forEach(h=>{const p=h.clone().multiplyScalar(s);w.add(ball(.6*s,mh,p.x,p.y,p.z,32),rod(V3(0,0,0),p,.2*s,mb))});return w}
function L2(){const g=new THREE.Group(),deco=new THREE.Group(),O=gloss(OXY),Hm=gloss(HYD),B=gloss(0xDADDE2);g.add(water(1,O,Hm,B));
  const dOO=280e-12/MPU[2],dash=new THREE.LineDashedMaterial({color:0xffffff,dashSize:.2,gapSize:.15,transparent:true,opacity:.7}),
    dirs=[WH[0].clone().normalize(),WH[1].clone().normalize(),V3(0,.55,.83).normalize(),V3(0,.55,-.83).normalize()],hb=(a,b)=>{const l=new THREE.Line(new THREE.BufferGeometry().setFromPoints([a,b]),dash);l.computeLineDistances();deco.add(l)};
  dirs.forEach((d,i)=>{const w=water(1,O,Hm,B),p=d.clone().multiplyScalar(dOO);w.position.copy(p);
    /* les deux premières reçoivent nos hydrogènes, les deux autres nous donnent l'un des leurs */
    if(i<2){w.quaternion.setFromUnitVectors(V3(0,-1,0),d);hb(d.clone().multiplyScalar(2.4),d.clone().multiplyScalar(dOO-1))}
    else{w.quaternion.setFromUnitVectors(WH[0].clone().normalize(),d.clone().negate());const h=p.clone().add(WH[0].clone().applyQuaternion(w.quaternion));hb(h.clone().lerp(V3(0,0,0),.12),d.clone().multiplyScalar(1))}
    deco.add(w)});
  g.add(deco);
  return{g,deco,a:V3(0,0,0),upd:()=>{}}}

/* 3 · double hélice d'ADN dans l'eau : les barreaux sont les paires de bases A–T et C–G.
   La molécule d'eau de l'étage précédent est contre l'hélice, au milieu de milliers d'autres (toutes à leur vraie taille) */
const BASES={A:0xF5C431,T:0xE5413A,C:0x45B74F,G:0x2F6BE0};
function L3(){const g=new THREE.Group(),deco=new THREE.Group(),Rh=1.7,P=3.6,step=.36,pts=[[],[]],bm={};for(const k in BASES)bm[k]=gloss(BASES[k]);
  const at=(y,s)=>{const th=y/P*2*Math.PI+s*2.3;return V3(Rh*Math.cos(th),y,Rh*Math.sin(th))};
  for(let y=-9;y<=9.01;y+=step/2){pts[0].push(at(y,0));pts[1].push(at(y,1))}
  g.add(tube(pts[0],.26,gloss(0x2A7BE4),{seg:420,rs:18}),tube(pts[1],.26,gloss(0x1F63C4),{seg:420,rs:18}));
  for(let y=-9;y<=9.01;y+=step){const a=at(y,0),b=at(y,1),m=a.clone().lerp(b,.5),pr=['AT','TA','CG','GC'][Math.random()*4|0];
    g.add(rod(a,m,.15,bm[pr[0]],12),rod(m,b,.15,bm[pr[1]],12),ball(.15,bm[pr[0]],m.x,m.y,m.z,12))}
  /* la molécule d'eau de l'étage précédent, même orientation, un peu plus petite pour ne pas se superposer */
  const s2=MPU[2]/MPU[3],anchor=V3(Rh+.42,.12,.22),O=gloss(OXY),Hm=gloss(HYD),wa=water(s2*.97,O,Hm,gloss(0xDADDE2));wa.position.copy(anchor);g.add(wa);
  /* l'eau autour : molécules en instances (oxygène, puis les deux hydrogènes) */
  const n=900,oi=new THREE.InstancedMesh(new THREE.SphereGeometry(.95*s2,12,8),O,n),hi=new THREE.InstancedMesh(new THREE.SphereGeometry(.6*s2,10,6),Hm,2*n),o=new THREE.Object3D(),q=new THREE.Quaternion(),e=new THREE.Euler();
  for(let i=0;i<n;){const p=V3(rnd(-7,7),rnd(-9,9),rnd(-7,7)),r=Math.hypot(p.x,p.z);if(r<2.05||r>7||p.distanceTo(anchor)<.3)continue;
    q.setFromEuler(e.set(rnd(0,6.3),rnd(0,6.3),rnd(0,6.3)));o.position.copy(p);o.quaternion.copy(q);o.updateMatrix();oi.setMatrixAt(i,o.matrix);
    WH.forEach((h,k)=>{o.position.copy(h).multiplyScalar(s2).applyQuaternion(q).add(p);o.updateMatrix();hi.setMatrixAt(2*i+k,o.matrix)});i++}
  oi.frustumCulled=hi.frustumCulled=false;deco.add(oi,hi);g.add(deco);
  return{g,deco,a:anchor,upd:t=>{deco.rotation.y=Math.sin(t*.2)*.01}}}

/* 4 · chromosome : de l'ADN très replié en forme de X. Des boucles de fibre d'ADN sortent de sa surface, là où l'on zoome */
function chromo(c,s=1,bent=0){const g=new THREE.Group(),m=gloss(c,{roughness:.55,clearcoat:.2}),rf=t=>Math.max(.01,Math.min(1,Math.pow(Math.min(t,1-t)*9,.45)))*(1-.32*Math.exp(-Math.pow((t-.48)/.06,2)));
  const A=[V3(-1.25,3,0),V3(-.55,1.3,.1),V3(0,0,0),V3(.55-bent,-1.4,.1),V3(1.35-bent,-3.1,0)],B=A.map(p=>V3(-p.x,p.y,-p.z));
  /* surface grumeleuse : deux couches de bosses */
  [A,B].forEach(P=>g.add(lumpy(lumpy(tube(P,.6,m,{rf,seg:140,rs:36}),.05,6),.025,15)));g.scale.setScalar(s);g.userData.A=A;return g}
function L4(){const g=new THREE.Group(),deco=new THREE.Group(),main=chromo(PURPLES[0]);g.add(main,deco);
  const cu=new THREE.CatmullRomCurve3(main.userData.A),anchor=cu.getPointAt(.24).add(V3(0,0,.58)),fm=gloss(0xB48CF0,{roughness:.5}),fr=15e-9/MPU[4];
  /* boucles de fibre d'ADN (30 nm d'épaisseur) ; la première passe exactement par le point où se trouve l'ADN de l'étage précédent */
  for(let i=0;i<8;i++){const n=i?V3(rnd(-.4,.4),rnd(-.4,.4),1).normalize():V3(0,0,1),h=i?rnd(.12,.4):.3,c=i?anchor.clone().add(V3(rnd(-.35,.35),rnd(-.45,.45),-.05)):anchor.clone().addScaledVector(n,-h),
    t=V3(rnd(-1,1),rnd(-1,1),0).normalize(),w=rnd(.07,.18);
    g.add(tube([c.clone().addScaledVector(t,-w).addScaledVector(n,-.06),c.clone().addScaledVector(t,-w*.9).addScaledVector(n,h*.7),c.clone().addScaledVector(n,h),c.clone().addScaledVector(t,w*.9).addScaledVector(n,h*.7),c.clone().addScaledVector(t,w).addScaledVector(n,-.06)],fr,fm,{seg:40,rs:8}))}
  for(let i=0;i<12;i++){const o=chromo(PURPLES[i%5],rnd(.32,.55),rnd(-.4,.4)),a=rnd(0,6.28),r=rnd(5,9);o.position.set(Math.cos(a)*r,rnd(-4,4),Math.sin(a)*r-1);o.rotation.set(rnd(-1,1),rnd(0,6),rnd(-1,1));deco.add(o)}
  return{g,deco,a:anchor,upd:()=>{deco.children.forEach((o,i)=>{o.rotation.y+=.0015*(i%2?1:-1)})}}}

/* 5 · cellule de 20 µm, aplatie comme la plupart des cellules animales : membrane, noyau et ses chromosomes, mitochondries, réticulum, appareil de Golgi */
const CELL=[3.4,2.1,3.4];
function L5(){const g=new THREE.Group(),nc=V3(.9,.15,.3),NR=1.5,s4=MPU[4]/MPU[5],inside=(p,k=1)=>p.x*p.x/(CELL[0]*CELL[0])+p.y*p.y/(CELL[1]*CELL[1])+p.z*p.z/(CELL[2]*CELL[2])<k*k;
  g.add(ell(...CELL,fres(0x4FA8F0,{a0:.06,a1:.8,p:2.2})),ell(CELL[0]*.99,CELL[1]*.98,CELL[2]*.99,glass(0xA8D8FF,.1)));
  g.add(ell(NR,NR*.85,NR,fres(0x9A62F0,{a0:.12,a1:.8,p:2})).translateX(nc.x).translateY(nc.y).translateZ(nc.z),ball(.38,gloss(0x5B2FB0),nc.x+.55,nc.y-.45,nc.z-.45));
  /* chromosomes à leur taille réelle (~3 µm) ; celui du premier plan est le chromosome de l'étage précédent (un peu plus petit pour ne pas se superposer) */
  const anchor=nc.clone().add(V3(-.25,.3,.55)),mc=chromo(PURPLES[0],s4*.97);mc.position.copy(anchor);g.add(mc);
  fib(8,.8).map(q=>nc.clone().add(q.multiply(V3(1,.8,1)))).sort((p,q)=>q.distanceTo(anchor)-p.distanceTo(anchor)).slice(0,7).forEach((p,i)=>{const o=chromo(PURPLES[(i+1)%5],s4*rnd(.55,.9),rnd(-.4,.4));o.position.copy(p);o.rotation.set(rnd(0,3),rnd(0,3),rnd(0,3));g.add(o)});
  const free=(r)=>{let p;do{p=V3(rnd(-3,3),rnd(-1.8,1.8),rnd(-3,3))}while(!inside(p,.82)||p.distanceTo(nc)<NR+r);return p};
  /* mitochondries orange, vertes et jaunes, avec leurs crêtes */
  const mitos=[];[['#F28A3A','#B5532A'],['#6CC24A','#3F7F2A'],['#F2C230','#A07A10']].forEach(([c1,c2])=>{const m=gloss(0xffffff,{map:tex(256,64,(x,w,h)=>{x.fillStyle=c1;x.fillRect(0,0,w,h);x.strokeStyle=c2;x.lineWidth=5;for(let s=12;s<w;s+=22){x.beginPath();x.moveTo(s,4);x.quadraticCurveTo(s+10,h/2,s,h-4);x.stroke()}})});
    for(let i=0;i<4;i++){const p=free(.6),o=ell(.55,.22,.22,m,p.x,p.y,p.z);o.rotation.set(rnd(0,6),rnd(0,6),rnd(0,6));o.userData.p=p;mitos.push(o);g.add(o)}});
  /* réticulum : rubans bleus repliés autour du noyau */
  for(let k=0;k<3;k++){const pts=[];for(let i=0;i<12;i++){const a=i/11*Math.PI*.9+k*2.1,r=1.85+.14*Math.sin(i*1.7+k);pts.push(V3(nc.x+Math.cos(a)*r,nc.y+Math.sin(i*.9+k)*.3,nc.z+Math.sin(a)*r))}g.add(tube(pts,.07,gloss(0x3F8FE8,{transparent:true,opacity:.85}),{seg:140,rs:8}))}
  const go=new THREE.Group();for(let i=0;i<4;i++){const t=mesh(new THREE.TorusGeometry(.6-i*.06,.08,10,28,Math.PI*.85),gloss(0xE85FB0));t.position.z=i*.18;go.add(t)}go.position.set(-1.6,-.6,1.2);go.rotation.set(.4,.8,0);g.add(go);
  for(let i=0;i<16;i++){const p=free(.3);g.add(ball(rnd(.1,.2),glass(0xF6D86A,.6),p.x,p.y,p.z,16))}
  const rb=[];for(let i=0;i<700;i++){const p=free(.1);rb.push(p.x,p.y,p.z)}g.add(cloud(rb,null,.06,.8,false));g.children[g.children.length-1].material.color.set(0x2A4A9A);
  return{g,a:anchor,upd:t=>{mitos.forEach((o,i)=>{o.position.copy(o.userData.p).add(V3(0,Math.sin(t*.8+i)*.05,0));o.rotation.y+=.003})}}}

/* 6 · micro-organisme en bâtonnet (200 µm sur 60 µm), translucide, couvert de cils, avec quelques flagelles : dix fois la taille d'une cellule,
   vingt-cinq fois plus petit que la fourmi dans laquelle il vit. La cellule de l'étage précédent est dans l'une de ses vacuoles. */
function L6(){const g=new THREE.Group(),piv=new THREE.Group(),body=new THREE.Group(),deco=new THREE.Group(),pts=[],RB=1.5,s5=MPU[5]/MPU[6],cR=3.4*s5;
  for(let x=-5;x<=5.01;x+=.5)pts.push(V3(x,0,0));
  const cu=new THREE.CatmullRomCurve3(pts),rf=t=>{const s=Math.abs(2*t-1),q=Math.max(0,(s-.7)/.3);return Math.max(.05,Math.sqrt(1-q*q))};
  /* corps en capsule fermée (profil tourné autour de l'axe x) */
  const caps=(k,m)=>{const pr=[];for(let i=0;i<=80;i++){const t=i/80;pr.push(new THREE.Vector2(i%80?RB*k*rf(t):0,-5+10*t))}return mesh(new THREE.LatheGeometry(pr,48).rotateZ(-Math.PI/2),m)};
  body.add(caps(1,fres(0x5FD68A,{a0:.1,a1:.85,p:2})),caps(.95,glass(0xA8F0C0,.16)));
  /* repère local le long du corps : point de l'axe, normale et binormale */
  const T=V3(0,0,0),Nn=V3(0,0,0),Bn=V3(0,0,0),at=t=>{T.copy(cu.getTangentAt(t));Nn.crossVectors(T,V3(0,0,1)).normalize();Bn.crossVectors(T,Nn);return cu.getPointAt(t)};
  /* cils : des milliers de petits poils sur toute la surface */
  const cp=[];for(let i=0;i<3500;i++){const t=rnd(.01,.99),c=at(t),a=rnd(0,6.28),n=Nn.clone().multiplyScalar(Math.cos(a)).addScaledVector(Bn,Math.sin(a)),p=c.addScaledVector(n,RB*rf(t)),q=p.clone().addScaledVector(n,.25).addScaledVector(T,-.08);cp.push(p.x,p.y,p.z,q.x,q.y,q.z)}
  const cg=new THREE.BufferGeometry();cg.setAttribute('position',new THREE.Float32BufferAttribute(cp,3));body.add(new THREE.LineSegments(cg,new THREE.LineBasicMaterial({color:0x7FE89A,transparent:true,opacity:.6,depthWrite:false})));
  /* longs flagelles ondulés à l'arrière */
  const fm=gloss(0xD8ECFF,{roughness:.4}),fl=[];for(let k=0;k<4;k++){const a=k*1.6+.4,o=V3(0,Math.cos(a)*.5,Math.sin(a)*.5),f=[];for(let i=0;i<=18;i++){const s=i/18;f.push(V3(-4.85-s*7,o.y*(1+s)+Math.sin(s*9+k)*.4*s,o.z*(1+s)+Math.cos(s*9+k)*.4*s))}const m=tube(f,.055,fm,{seg:70,rs:6,rf:t=>1-t*.6});fl.push(m);body.add(m)}
  /* intérieur : long filament bleu enroulé (son matériel génétique), vacuoles contractiles, vacuoles digestives, granules */
  const hx=[];for(let x=-3.6;x<=3.6;x+=.1)hx.push(V3(x,Math.cos(x*3.2)*.28+Math.sin(x*.7)*.12,Math.sin(x*3.2)*.28-.35));body.add(lumpy(tube(hx,.13,gloss(0x2F6BE0),{seg:300,rs:10,rf:t=>Math.min(1,Math.min(t,1-t)*12)}),.03,9));
  [-3.2,3.2].forEach(x=>{const c=at((x+5)/10),v=new THREE.Group();v.add(ball(.35,glass(0x9fd8f0,.5),0,0,0,20));for(let i=0;i<6;i++){const a=i/6*Math.PI*2;v.add(rod(V3(0,0,0),V3(0,Math.cos(a)*.75,Math.sin(a)*.75),.035,glass(0x9fd8f0,.6),6))}v.position.copy(c).add(V3(0,.55,.4));body.add(v)});
  [[.6,.6,.5,.38],[2.6,-.5,.45,.3],[-3,.35,-.5,.35],[1.2,-.65,.5,.28]].forEach(([x,y,z,r])=>{body.add(ball(r,glass(0xf2d27a,.3),x,y,z,20));for(let i=0;i<4;i++)body.add(ball(r*.18,gloss(0xb08840),x+rnd(-r,r)*.5,y+rnd(-r,r)*.5,z+rnd(-r,r)*.5,8))});
  /* la cellule de l'étage précédent, à sa vraie taille et aplatie comme elle, avec son noyau, dans une vacuole */
  const anchor=V3(-1.5,.25,.5),nk=V3(.9,.15,.3).multiplyScalar(s5).add(anchor);
  body.add(ball(cR*1.25,glass(0xf2d27a,.22),anchor.x,anchor.y,anchor.z,24),ell(CELL[0]*s5*.97,CELL[1]*s5*.97,CELL[2]*s5*.97,glass(0x4FA8F0,.55),anchor.x,anchor.y,anchor.z),ball(1.5*s5,gloss(0x9A62F0),nk.x,nk.y,nk.z,16));
  const gp=[];while(gp.length<3600){const t=rnd(.05,.95),c=at(t),r=RB*.85*rf(t)*Math.sqrt(Math.random()),a=rnd(0,6.28),p=c.addScaledVector(Nn,r*Math.cos(a)).addScaledVector(Bn,r*Math.sin(a));if(p.distanceTo(anchor)>cR*1.4)gp.push(p.x,p.y,p.z)}
  body.add(cloud(gp,null,.06,.7,false));body.children[body.children.length-1].material.color.set(0x3F9A5A);
  body.position.copy(anchor).negate();piv.position.copy(anchor);piv.add(body);g.add(piv,deco);
  /* autour : des bactéries (2 µm, cent fois plus petites), des algues et des débris */
  const n=420,bi=new THREE.InstancedMesh(new THREE.SphereGeometry(1,10,6),gloss(0xffffff,{roughness:.5}),n),o=new THREE.Object3D(),cc=new THREE.Color();
  for(let i=0;i<n;i++){o.position.set(rnd(-16,16),rnd(-9,9),rnd(-14,8));if(o.position.length()<4){i--;continue}o.rotation.set(rnd(0,6),rnd(0,6),rnd(0,6));o.scale.set(.05,.018,.018);o.updateMatrix();bi.setMatrixAt(i,o.matrix);bi.setColorAt(i,cc.set([0xE59AB0,0xA6D27A,0xE8C46A][i%3]))}
  bi.frustumCulled=false;deco.add(bi);
  for(let i=0;i<14;i++){let p;do{p=V3(rnd(-14,14),rnd(-8,8),rnd(-12,4))}while(p.length()<5);deco.add(ball(rnd(.2,.4),gloss(0x5aa848,{transparent:true,opacity:.8}),p.x,p.y,p.z,16))}
  const P=[],Cc=[];for(let i=0;i<900;i++){const q=V3(rnd(-16,16),rnd(-9,9),rnd(-14,8));P.push(q.x,q.y,q.z);const k=rnd(.6,1);Cc.push(.9*k,.75*k,.45*k)}deco.add(cloud(P,Cc,.1,.5,false));
  return{g,deco,a:anchor,upd:t=>{piv.rotation.x=Math.sin(t*.4)*.15;piv.rotation.z=Math.sin(t*.6)*.04;fl.forEach((m,k)=>m.rotation.x=Math.sin(t*3+k*2)*.08)}}}

/* 7 · fourmi de 5 mm sur le sol : tête et mandibules, antennes coudées, thorax fin, pétiole, abdomen translucide (le micro-organisme vit à l'intérieur) */
function L7(){const g=new THREE.Group(),deco=new THREE.Group(),body=gloss(0xB8541F,{roughness:.35,clearcoat:.6}),legM=gloss(0x8A3A16,{roughness:.4}),dark=gloss(0x5A2410),eye=gloss(0x0a0a0a,{roughness:.1,clearcoat:1});
  const head=ell(.62,.5,.55,body,2.35,.8,0);head.rotation.z=-.15;g.add(head,ell(.17,.22,.12,eye,2.52,.95,.45),ell(.17,.22,.12,eye,2.52,.95,-.45),ball(.16,body,1.85,.74,0,20));
  [1,-1].forEach(s=>{g.add(tube([V3(2.85,.55,.22*s),V3(3.15,.5,.26*s),V3(3.38,.44,.07*s)],.075,dark,{seg:20,rs:8,rf:t=>1-t*.7}));
    /* antenne coudée : long scape, puis le funicule terminé en massue */
    const an=new THREE.Group();an.position.set(2.75,1.08,.2*s);
    an.add(tube([V3(0,0,0),V3(.1,.4,.1*s),V3(.2,.75,.22*s)],.05,legM,{seg:16,rs:8}),ball(.065,legM,.2,.75,.22*s,12),tube([V3(.2,.75,.22*s),V3(.65,.8,.4*s),V3(1.05,.55,.55*s),V3(1.3,.25,.62*s)],.042,legM,{seg:30,rs:8,rf:t=>1+t*.5}),ball(.075,legM,1.3,.25,.62*s,12));
    an.userData.s=s;g.add(an)});
  g.add(ell(.42,.34,.33,body,1.5,.8,0),ell(.38,.28,.28,body,1.0,.76,0),ell(.32,.3,.27,body,.55,.74,0),ell(.12,.1,.1,body,.3,.68,0),ell(.13,.27,.17,body,.12,.8,0),ell(.12,.1,.1,body,-.08,.66,0));
  /* abdomen (gastre) brun foncé, translucide, à anneaux */
  const gm=PHY({color:0x6A3216,roughness:.22,clearcoat:1,transparent:true,opacity:.6,depthWrite:false,map:tex(256,64,(x,w,h)=>{x.fillStyle='#fff';x.fillRect(0,0,w,h);x.fillStyle='rgba(40,12,4,.6)';for(let s=40;s<w;s+=46)x.fillRect(s,0,9,h)})});
  g.add(ell(1.3,.98,.95,gm,-1.6,.6,0));
  /* pattes : hanche, fémur, tibia et tarse, avec leurs articulations */
  const leg=(x0,dx,s)=>{const b=V3(x0,.5,.18*s),k1=V3(x0+dx*.15,1.05,.75*s),k2=V3(x0+dx*.55,.55,1.45*s),f=V3(x0+dx,-.6,1.85*s);
    g.add(tube([b,b.clone().lerp(k1,.5).add(V3(0,.06,0)),k1],.075,legM,{seg:16,rs:8}),ball(.085,legM,k1.x,k1.y,k1.z,12),tube([k1,k1.clone().lerp(k2,.5).add(V3(0,.1,0)),k2],.06,legM,{seg:16,rs:8}),ball(.07,legM,k2.x,k2.y,k2.z,12),tube([k2,k2.clone().lerp(f,.5),f],.045,legM,{seg:16,rs:8,rf:t=>1-t*.4}))};
  [[1.45,.95],[1.0,.1],[.55,-1.15]].forEach(([x,dx])=>{leg(x,dx,1);leg(x,dx,-1)});
  g.add(blob(2.9,1.7,.4,-.61,0,.8));
  const soil=tex(512,512,(x,w,h)=>{x.fillStyle='#7a5a3a';x.fillRect(0,0,w,h);for(let i=0;i<9000;i++){const v=Math.random();x.fillStyle=v<.5?`rgba(60,40,22,${rnd(.2,.6)})`:`rgba(170,140,100,${rnd(.15,.5)})`;x.fillRect(rnd(0,w),rnd(0,h),rnd(1,4),rnd(1,4))}},1);soil.repeat.set(3,3);
  deco.add(mesh(new THREE.CircleGeometry(9,64).rotateX(-Math.PI/2),soilM({map:soil,color:0xd0d0d0},8),0,-.62,0));
  /* plus loin : la terre laisse place à l'herbe, sur une douzaine de centimètres */
  const far=tex(1024,1024,(x,w,h)=>{const gr=x.createRadialGradient(w/2,h/2,0,w/2,h/2,w/2);gr.addColorStop(0,'#7a5a3a');gr.addColorStop(.12,'#7a5a3a');gr.addColorStop(.3,'#5f8a3a');gr.addColorStop(1,'#5f9a3a');x.fillStyle=gr;x.fillRect(0,0,w,h);
    for(let i=0;i<16000;i++){const a=rnd(0,6.28),r=Math.sqrt(Math.random())*w/2,k=r/(w/2);x.fillStyle=k<.18?`rgba(60,40,22,${rnd(.2,.5)})`:`rgba(${rnd(30,70)|0},${rnd(80,140)|0},${rnd(20,45)|0},${rnd(.3,.6)})`;x.fillRect(w/2+Math.cos(a)*r,h/2+Math.sin(a)*r,rnd(1,3),rnd(1,3))}
    x.globalCompositeOperation='destination-in';const e=x.createRadialGradient(w/2,h/2,w*.4,w/2,h/2,w*.5);e.addColorStop(0,'#000');e.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=e;x.fillRect(0,0,w,h)});
  deco.add(mesh(new THREE.CircleGeometry(160,96).rotateX(-Math.PI/2),soilM({map:far,color:0xd0d0d0},7),0,-.62,0));
  for(let i=0;i<120;i++){const a=rnd(0,6.28),r=i<34?rnd(3,8.5):rnd(9,45),s=i<34?rnd(.12,.45):rnd(.3,1.6),o=mesh(new THREE.DodecahedronGeometry(s,0),matte([0x8a8278,0x6e5a44,0xa09080][i%3],{flatShading:true}),Math.cos(a)*r,-.6,Math.sin(a)*r);o.scale.y=.6;o.rotation.set(rnd(0,3),rnd(0,3),0);deco.add(o)}
  /* brins d'herbe à leur vraie taille : 5 à 9 cm, soit 60 à 120 fois la longueur de la fourmi */
  const bm=[0x4f8a34,0x5f9a3a,0x3f7a2c].map(c=>gloss(c,{roughness:.6,clearcoat:.1}));
  for(let i=0;i<60;i++){const a=rnd(0,6.28),r=rnd(22,120),hb=rnd(60,120),x0=Math.cos(a)*r,z0=Math.sin(a)*r,b=a+rnd(-1.5,1.5),ln=rnd(.1,.45),f=[];
    for(let k=0;k<=6;k++){const s=k/6;f.push(V3(x0+Math.cos(b)*ln*hb*s*s,-.62+hb*s*(1-.15*s*ln),z0+Math.sin(b)*ln*hb*s*s))}deco.add(tube(f,1.6,bm[i%3],{seg:24,rs:6,rf:t=>1-t*.92}))}
  g.add(deco);const ants=g.children.filter(o=>o.userData.s);
  return{g,deco,a:V3(-1.6,.6,0),c:V3(.4,.5,0),upd:t=>{ants.forEach(a=>{a.rotation.z=Math.sin(t*2+a.userData.s)*.08;a.rotation.y=Math.sin(t*1.3)*.1*a.userData.s})}}}
