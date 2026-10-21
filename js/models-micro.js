/* Niveaux 0 à 7 : du noyau d'atome à la fourmi.
   Chaque niveau renvoie {g: groupe, deco: décor qui s'efface dès qu'on dézoome, a: point d'ancrage où se trouve le niveau précédent, upd(t): animation}.
   1 unité de modèle vaut MPU[i] mètres : les objets emboîtés sont à leur taille réelle les uns par rapport aux autres. */

/* membrane translucide à bord lumineux (effet de Fresnel) */
function fres(c,{a0=.06,a1=.7,p=2.5}={}){return new THREE.ShaderMaterial({uniforms:{uC:{value:new THREE.Color(c)},uOp:{value:1}},transparent:true,depthWrite:false,side:THREE.DoubleSide,
  vertexShader:'varying vec3 vN,vV;void main(){vec4 mv=modelViewMatrix*vec4(position,1.);vN=normalize(normalMatrix*normal);vV=normalize(-mv.xyz);gl_Position=projectionMatrix*mv;}',
  fragmentShader:`uniform vec3 uC;uniform float uOp;varying vec3 vN,vV;void main(){float f=pow(1.-abs(dot(normalize(vN),normalize(vV))),${p.toFixed(2)});gl_FragColor=vec4(uC*(.75+.5*f),(${a0.toFixed(3)}+${a1.toFixed(3)}*f)*uOp);}`})}
const PROTON=0xEF6F6C,NEUTRON=0x59C08A,ELEC=0x3F7FE0,CPK={C:0x3a3f47,O:0xD9463B,N:0x3F6FE0,H:0xF2F2F2,P:0xF2A65A};

/* 0 · noyau d'atome de carbone : 6 protons + 6 neutrons */
function L0(){const g=new THREE.Group(),f=(1+Math.sqrt(5))/2,v=[[0,1,f],[0,-1,-f],[0,-1,f],[0,1,-f],[1,f,0],[-1,-f,0],[-1,f,0],[1,-f,0],[f,0,1],[-f,0,-1],[f,0,-1],[-f,0,1]];
  const P=gloss(PROTON),N=gloss(NEUTRON),core=new THREE.Group();
  v.forEach((q,i)=>{const p=V3(...q).normalize().multiplyScalar(1.02);core.add(ball(.78,i%2?N:P,p.x,p.y,p.z,40))});
  g.add(core,glow(0xffd6c8,6.5,.35));
  return{g,a:V3(0,0,0),upd:t=>{core.rotation.y=t*.25;core.rotation.x=Math.sin(t*.3)*.3}}}

/* 1 · atome de carbone : 2 électrons à ~9 pm du noyau, 4 à ~70 pm. Le noyau, 25 000 fois plus petit, n'y est plus qu'un repère ;
   les électrons sont des points de taille fixe (ici ce sont les distances qui comptent, pas leur taille) */
function L1(){const g=new THREE.Group(),orb=[];
  [[.3,[.35,0,.1],2,3],[2.35,[1.15,.35,0],2,.8],[2.35,[-1,-.5,.7],2,.7]].forEach(([r,rot,n,sp])=>{const o=new THREE.Group(),ring=orbit(r,0x9fc4ff,.4);ring.rotation.x=Math.PI/2;o.rotation.set(...rot);o.add(ring);
    for(let i=0;i<n;i++){const e=new THREE.Group();e.add(dot(0x6fa8ff,28,.75),dot(0xdfeaff,8));o.add(e);orb.push([e,r,sp,i*Math.PI])}g.add(o)});
  return{g,a:V3(0,0,0),upd:t=>{orb.forEach(([e,r,sp,ph])=>{const a=t*sp+ph;e.position.set(Math.cos(a)*r,Math.sin(a)*r,0)})}}}

/* 2 · trois atomes liés (O–C–N, fragment du brin d'ADN) */
function L2(){const g=new THREE.Group(),bond=gloss(0xc4ccd6,{roughness:.4}),C=V3(0,0,0),O=V3(-1.8,.95,.35),N=V3(1.85,.75,-.45);
  [[C,.85,CPK.C],[O,.8,CPK.O],[N,.82,CPK.N]].forEach(([p,r,c])=>{g.add(ball(r,gloss(c),p.x,p.y,p.z,48));if(p!==C)g.add(ball(r*1.45,glass(c,.12),p.x,p.y,p.z))});
  g.add(rod(C,O,.16,bond),rod(C,N,.16,bond));
  /* liaisons qui continuent vers le reste de la molécule */
  [[O,V3(-2.9,2.2,.2)],[C,V3(-.3,-1.6,.9)],[C,V3(.5,-.9,-1.5)],[N,V3(2.6,1.7,-1.6)],[N,V3(2.9,-.3,.2)]].forEach(([a,b])=>{g.add(rod(a,b,.14,bond));g.add(ball(.3,glass(0xffffff,.35),b.x,b.y,b.z))});
  return{g,a:C,upd:()=>{}}}

/* 3 · double hélice d'ADN au milieu d'autres molécules */
function L3(){const g=new THREE.Group(),Rh=1.7,P=3.6,pts=[[],[]],bp=[],step=.36;
  for(let y=-9;y<=9.01;y+=step/2){const th=y/P*2*Math.PI;pts[0].push(V3(Rh*Math.cos(th),y,Rh*Math.sin(th)));pts[1].push(V3(Rh*Math.cos(th+2.3),y,Rh*Math.sin(th+2.3)))}
  g.add(tube(pts[0],.2,gloss(0xF2A65A),{seg:400}),tube(pts[1],.2,gloss(0x9B7BE0),{seg:400}));
  const pairs=[[0xF6C344,0xE5604C],[0x4FBE7A,0x45A6CC]],ph=[gloss(0xFFD6A0),gloss(0xD8C8FF)];let anchor=null;
  for(let y=-9;y<=9.01;y+=step){const th=y/P*2*Math.PI,a=V3(Rh*Math.cos(th),y,Rh*Math.sin(th)),b=V3(Rh*Math.cos(th+2.3),y,Rh*Math.sin(th+2.3)),m=a.clone().lerp(b,.5),pr=pairs[Math.random()<.5?0:1],sw=Math.random()<.5;
    g.add(rod(a,m,.12,gloss(pr[sw?0:1])),rod(m,b,.12,gloss(pr[sw?1:0])),ball(.27,ph[0],a.x,a.y,a.z,20),ball(.27,ph[1],b.x,b.y,b.z,20));
    if(!anchor&&y>-.2)anchor=a.clone().lerp(b,.14)}
  /* autres molécules : eau, glucose, protéines */
  const ctx=new THREE.Group(),Om=gloss(CPK.O),Hm=gloss(CPK.H),waters=[],away=(r0,r1)=>{let p;do{p=V3(rnd(-r1,r1),rnd(-r1,r1),rnd(-r1,r1))}while(p.length()>r1||Math.hypot(p.x,p.z)<r0);return p};
  for(let i=0;i<46;i++){const w=new THREE.Group(),p=away(2.7,8);w.add(ball(.24,Om,0,0,0,20),ball(.15,Hm,.3,.2,0,16),ball(.15,Hm,-.3,.2,0,16));w.position.copy(p);w.rotation.set(rnd(0,6),rnd(0,6),0);w.userData.p=p.clone();waters.push(w);ctx.add(w)}
  for(let i=0;i<5;i++){const s=new THREE.Group(),p=away(3,7.5);for(let k=0;k<6;k++){const a=k*Math.PI/3,b=(k+1)*Math.PI/3;s.add(ball(.13,gloss(k==5?CPK.O:CPK.C),Math.cos(a)*.42,0,Math.sin(a)*.42,16),rod(V3(Math.cos(a)*.42,0,Math.sin(a)*.42),V3(Math.cos(b)*.42,0,Math.sin(b)*.42),.04,gloss(0xc4ccd6)))}
    s.position.copy(p);s.rotation.set(rnd(0,6),rnd(0,6),0);ctx.add(s)}
  [0xFF9DC8,0x6FC3E4,0xF2CB3F,0xA4D65E].forEach(c=>{const pr=new THREE.Group(),p=away(3.4,7.5),m=gloss(c);fib(34,1).forEach(q=>{q.multiplyScalar(rnd(.3,1.1));pr.add(ball(rnd(.22,.34),m,q.x,q.y,q.z,16))});pr.position.copy(p);ctx.add(pr)});
  g.add(ctx);
  return{g,deco:ctx,a:anchor,upd:t=>{waters.forEach((w,i)=>{w.position.copy(w.userData.p).add(V3(Math.sin(t*1.3+i)*.08,Math.cos(t*1.1+i*2)*.08,0));w.rotation.y+=.004})}}}

/* 4 · chromosome en X au milieu d'autres chromosomes (motif de bandes) */
const bandTex=(c1,c2)=>tex(512,32,(x,w,h)=>{x.fillStyle=c1;x.fillRect(0,0,w,h);for(let s=0;s<w;){const b=4+Math.random()*26;if(Math.random()<.45){x.fillStyle=c2;x.fillRect(s,0,b,h)}s+=b+3+Math.random()*12}
  x.fillStyle='rgba(255,255,255,.18)';for(let s=0;s<w;s+=5)x.fillRect(s,0,1.5,h)});
function chromo(c1,c2,s=1,bent=0){const g=new THREE.Group(),m=STD({map:bandTex(c1,c2),roughness:.5,bumpMap:bandTex('#888','#444'),bumpScale:.03}),rf=t=>Math.max(.12,Math.min(1,Math.pow(Math.min(t,1-t)*9,.45)))*(1-.32*Math.exp(-Math.pow((t-.48)/.06,2)));
  const A=[V3(-1.25,3,0),V3(-.55,1.3,.1),V3(0,0,0),V3(.55-bent,-1.4,.1),V3(1.35-bent,-3.1,0)],B=A.map(p=>V3(-p.x,p.y,-p.z));
  const ta=tube(A,.6,m,{rf,seg:90}),tb=tube(B,.6,m,{rf,seg:90});g.add(ta,tb);g.scale.setScalar(s);g.userData.A=A;return g}
function L4(){const g=new THREE.Group(),deco=new THREE.Group(),main=chromo('#8E7BE0','#4B3A9A');g.add(main,deco);
  const cu=new THREE.CatmullRomCurve3(main.userData.A),anchor=cu.getPointAt(.24).add(V3(0,0,.58));
  [['#FF9DC8','#B23A70'],['#6FC3E4','#256D90'],['#F2CB3F','#9A7A10'],['#A4D65E','#4F7A1E'],['#FFA85C','#A0501A'],['#C098EE','#5A3288']].forEach((c,i)=>{for(let k=0;k<2;k++){
    const o=chromo(c[0],c[1],rnd(.32,.55),rnd(-.4,.4)),a=rnd(0,6.28),r=rnd(5,9);o.position.set(Math.cos(a)*r,rnd(-4,4),Math.sin(a)*r-1);o.rotation.set(rnd(-1,1),rnd(0,6),rnd(-1,1));deco.add(o)}});
  return{g,deco,a:anchor,upd:()=>{deco.children.forEach((o,i)=>{o.rotation.y+=.0015*(i%2?1:-1)})}}}

/* 5 · cellule de 20 µm : membrane, noyau et ses chromosomes, mitochondries, réticulum, appareil de Golgi */
function L5(){const g=new THREE.Group(),nc=V3(.9,.2,.3),NR=1.5,s4=MPU[4]/MPU[5];
  g.add(ball(3.4,fres(0x7fd6c0,{a0:.05,a1:.75,p:2.2}),0,0,0,64),ball(3.36,glass(0xbfeee2,.07),0,0,0,48));
  g.add(ball(NR,fres(0xb48ae6,{a0:.1,a1:.8,p:2}),nc.x,nc.y,nc.z,48),ball(.4,gloss(0x6a3fa8),nc.x+.55,nc.y-.5,nc.z-.45));
  /* chromosomes à leur taille réelle (~3 µm) ; celui du premier plan est le chromosome de l'étage précédent (un peu plus petit pour ne pas se superposer) */
  const anchor=nc.clone().add(V3(-.25,.35,.55)),mc=chromo('#8E7BE0','#4B3A9A',s4*.97);mc.position.copy(anchor);g.add(mc);
  const cols=[['#FF9DC8','#B23A70'],['#6FC3E4','#256D90'],['#F2CB3F','#9A7A10'],['#A4D65E','#4F7A1E'],['#FFA85C','#A0501A'],['#C098EE','#5A3288'],['#8E7BE0','#4B3A9A']];
  fib(8,.85).map(q=>nc.clone().add(q)).sort((p,q)=>q.distanceTo(anchor)-p.distanceTo(anchor)).slice(0,7).forEach((p,i)=>{const o=chromo(cols[i][0],cols[i][1],s4*rnd(.55,.9),rnd(-.4,.4));o.position.copy(p);o.rotation.set(rnd(0,3),rnd(0,3),rnd(0,3));g.add(o)});
  const mito=tex(256,64,(x,w,h)=>{x.fillStyle='#F2955A';x.fillRect(0,0,w,h);x.strokeStyle='#B5532A';x.lineWidth=5;for(let s=12;s<w;s+=22){x.beginPath();x.moveTo(s,4);x.quadraticCurveTo(s+10,h/2,s,h-4);x.stroke()}}),mm=gloss(0xffffff,{map:mito}),mitos=[];
  for(let i=0;i<8;i++){let p;do{p=V3(rnd(-2.7,2.7),rnd(-2.7,2.7),rnd(-2.7,2.7))}while(p.length()>2.7||p.distanceTo(nc)<2.1);const o=ell(.55,.22,.22,mm,p.x,p.y,p.z);o.rotation.set(rnd(0,6),rnd(0,6),rnd(0,6));o.userData.p=p;mitos.push(o);g.add(o)}
  for(let k=0;k<2;k++){const pts=[];for(let i=0;i<10;i++){const a=i/9*Math.PI*.9+k*2.6,r=1.85+.12*Math.sin(i*1.7);pts.push(V3(nc.x+Math.cos(a)*r,nc.y+Math.sin(i*.9+k)*.35,nc.z+Math.sin(a)*r))}g.add(tube(pts,.045,glass(0x8fd0f0,.7),{seg:120,rs:8}))}
  const go=new THREE.Group();for(let i=0;i<4;i++){const t=mesh(new THREE.TorusGeometry(.6-i*.06,.07,8,24,Math.PI*.85),gloss(0xFF8FB8));t.position.z=i*.17;go.add(t)}go.position.set(-1.6,-1,1.2);go.rotation.set(.4,.8,0);g.add(go);
  for(let i=0;i<14;i++){let p;do{p=V3(rnd(-2.8,2.8),rnd(-2.8,2.8),rnd(-2.8,2.8))}while(p.length()>2.9||p.distanceTo(nc)<1.75);g.add(ball(rnd(.1,.2),glass(0xF6D86A,.55),p.x,p.y,p.z,16))}
  const rb=[];for(let i=0;i<700;i++){let q;do{q=V3(rnd(-3.2,3.2),rnd(-3.2,3.2),rnd(-3.2,3.2))}while(q.length()>3.2||q.distanceTo(nc)<1.6);rb.push(q.x,q.y,q.z)}g.add(cloud(rb,null,.06,.8,false));
  g.children[g.children.length-1].material.color.set(0x5a4a7a);
  return{g,a:anchor,upd:t=>{mitos.forEach((o,i)=>{o.position.copy(o.userData.p).add(V3(0,Math.sin(t*.8+i)*.05,0));o.rotation.y+=.003})}}}

/* 6 · micro-organisme en bâtonnet (200 µm sur 60 µm), couvert de cils, avec quelques flagelles : dix fois la taille d'une cellule,
   vingt-cinq fois plus petit que la fourmi dans laquelle il vit. La cellule de l'étage précédent est dans l'une de ses vacuoles. */
function L6(){const g=new THREE.Group(),piv=new THREE.Group(),body=new THREE.Group(),deco=new THREE.Group(),pts=[],RB=1.5,s5=MPU[5]/MPU[6],cR=3.4*s5;
  for(let x=-5;x<=5.01;x+=.5)pts.push(V3(x,0,0));
  const cu=new THREE.CatmullRomCurve3(pts),rf=t=>{const s=Math.abs(2*t-1),q=Math.max(0,(s-.7)/.3);return Math.max(.05,Math.sqrt(1-q*q))};
  /* corps en capsule fermée (profil tourné autour de l'axe x) */
  const caps=(k,m)=>{const pr=[];for(let i=0;i<=80;i++){const t=i/80;pr.push(new THREE.Vector2(i%80?RB*k*rf(t):0,-5+10*t))}return mesh(new THREE.LatheGeometry(pr,48).rotateZ(-Math.PI/2),m)};
  body.add(caps(1,fres(0xbfe8d0,{a0:.07,a1:.8,p:2.2})),caps(.95,glass(0xe4f6ea,.12)));
  /* repère local le long du corps : point de l'axe, normale et binormale */
  const T=V3(0,0,0),Nn=V3(0,0,0),Bn=V3(0,0,0),at=t=>{T.copy(cu.getTangentAt(t));Nn.crossVectors(T,V3(0,0,1)).normalize();Bn.crossVectors(T,Nn);return cu.getPointAt(t)};
  /* cils : des milliers de petits traits sur toute la surface */
  const cp=[];for(let i=0;i<3500;i++){const t=rnd(.01,.99),c=at(t),a=rnd(0,6.28),n=Nn.clone().multiplyScalar(Math.cos(a)).addScaledVector(Bn,Math.sin(a)),p=c.addScaledVector(n,RB*rf(t)),q=p.clone().addScaledVector(n,.22).addScaledVector(T,-.08);cp.push(p.x,p.y,p.z,q.x,q.y,q.z)}
  const cg=new THREE.BufferGeometry();cg.setAttribute('position',new THREE.Float32BufferAttribute(cp,3));body.add(new THREE.LineSegments(cg,new THREE.LineBasicMaterial({color:0xd8f2e0,transparent:true,opacity:.55,depthWrite:false})));
  /* flagelles ondulés à l'arrière */
  const fm=gloss(0xcfe8d6,{roughness:.4}),fl=[];for(let k=0;k<3;k++){const a=k*2.1+.4,o=V3(0,Math.cos(a)*.5,Math.sin(a)*.5),f=[];for(let i=0;i<=16;i++){const s=i/16;f.push(V3(-4.85-s*6,o.y*(1+s)+Math.sin(s*9+k)*.35*s,o.z*(1+s)+Math.cos(s*9+k)*.35*s))}const m=tube(f,.05,fm,{seg:60,rs:6,rf:t=>1-t*.6});fl.push(m);body.add(m)}
  /* intérieur : noyau, vacuoles contractiles, vacuoles digestives, granules */
  body.add(ell(1.1,.6,.65,gloss(0x9a6ad8,{transparent:true,opacity:.85}),1.4,0,-.2),ball(.22,gloss(0x6a3fa8),2.3,.35,.2,16));
  [-3.2,3.2].forEach(x=>{const c=at((x+5)/10),v=new THREE.Group();v.add(ball(.35,glass(0x9fd8f0,.5),0,0,0,20));for(let i=0;i<6;i++){const a=i/6*Math.PI*2;v.add(rod(V3(0,0,0),V3(0,Math.cos(a)*.75,Math.sin(a)*.75),.035,glass(0x9fd8f0,.6),6))}v.position.copy(c).add(V3(0,.55,.4));body.add(v)});
  [[-.3,-.55,.45,.42],[.6,.55,-.6,.38],[2.9,-.45,.3,.3],[-3,.35,-.5,.35],[.9,-.7,.6,.28]].forEach(([x,y,z,r])=>{body.add(ball(r,glass(0xf2d27a,.3),x,y,z,20));for(let i=0;i<4;i++)body.add(ball(r*.18,gloss(0xb08840),x+rnd(-r,r)*.5,y+rnd(-r,r)*.5,z+rnd(-r,r)*.5,8))});
  /* la cellule de l'étage précédent, à sa vraie taille, avec son noyau, dans une vacuole */
  const anchor=V3(-1.5,.25,.5),nk=V3(.9,.2,.3).multiplyScalar(s5).add(anchor);
  body.add(ball(cR*1.25,glass(0xf2d27a,.22),anchor.x,anchor.y,anchor.z,24),ball(cR*.97,glass(0xF4B8C8,.6),anchor.x,anchor.y,anchor.z,24),ball(1.5*s5,gloss(0x8a3a5a),nk.x,nk.y,nk.z,16));
  const gp=[];while(gp.length<3600){const t=rnd(.05,.95),c=at(t),r=RB*.85*rf(t)*Math.sqrt(Math.random()),a=rnd(0,6.28),p=c.addScaledVector(Nn,r*Math.cos(a)).addScaledVector(Bn,r*Math.sin(a));if(p.distanceTo(anchor)>cR*1.4)gp.push(p.x,p.y,p.z)}
  body.add(cloud(gp,null,.06,.7,false));body.children[body.children.length-1].material.color.set(0x7a9a6a);
  body.position.copy(anchor).negate();piv.position.copy(anchor);piv.add(body);g.add(piv,deco);
  /* autour : des bactéries (2 µm, cent fois plus petites), des algues et des débris */
  const n=420,bi=new THREE.InstancedMesh(new THREE.SphereGeometry(1,10,6),gloss(0xffffff,{roughness:.5}),n),o=new THREE.Object3D(),cc=new THREE.Color();
  for(let i=0;i<n;i++){o.position.set(rnd(-16,16),rnd(-9,9),rnd(-14,8));if(o.position.length()<4){i--;continue}o.rotation.set(rnd(0,6),rnd(0,6),rnd(0,6));o.scale.set(.05,.018,.018);o.updateMatrix();bi.setMatrixAt(i,o.matrix);bi.setColorAt(i,cc.set([0xE59AB0,0xA6D27A,0xE8C46A][i%3]))}
  bi.frustumCulled=false;deco.add(bi);
  for(let i=0;i<14;i++){let p;do{p=V3(rnd(-14,14),rnd(-8,8),rnd(-12,4))}while(p.length()<5);deco.add(ball(rnd(.2,.4),gloss(0x5aa848,{transparent:true,opacity:.8}),p.x,p.y,p.z,16))}
  const P=[],Cc=[];for(let i=0;i<900;i++){const q=V3(rnd(-16,16),rnd(-9,9),rnd(-14,8));P.push(q.x,q.y,q.z);const k=rnd(.6,1);Cc.push(.9*k,.75*k,.45*k)}deco.add(cloud(P,Cc,.1,.5,false));
  return{g,deco,a:anchor,upd:t=>{piv.rotation.x=Math.sin(t*.4)*.15;piv.rotation.z=Math.sin(t*.6)*.04;fl.forEach((m,k)=>m.rotation.x=Math.sin(t*3+k*2)*.08)}}}
/* 7 · fourmi de 5 mm sur le sol (abdomen translucide : le micro-organisme vit à l'intérieur) */
function L7(){const g=new THREE.Group(),deco=new THREE.Group(),ch=gloss(0x4a1f0e,{roughness:.32}),ch2=gloss(0x3a160a,{roughness:.4}),eye=gloss(0x0a0a0a,{roughness:.1});
  g.add(ell(.75,.6,.62,ch,2.3,.6,0),ell(.19,.22,.16,eye,2.62,.78,.47),ell(.19,.22,.16,eye,2.62,.78,-.47));
  [1,-1].forEach(s=>{g.add(tube([V3(2.85,.42,.22*s),V3(3.25,.36,.18*s),V3(3.45,.3,-.02*s)],.07,ch2,{seg:20,rs:8,rf:t=>1-t*.7}));
    const an=new THREE.Group();an.position.set(2.75,1.05,.25*s);an.add(tube([V3(0,0,0),V3(.25,.85,.22*s),V3(.35,1.15,.3*s),V3(1.05,1.35,.65*s),V3(1.55,1.2,.85*s)],.045,ch2,{seg:40,rs:8}));an.userData.s=s;g.add(an)});
  g.add(ell(1.05,.46,.42,ch,.85,.55,0),ell(.24,.32,.2,ch,-.28,.5,0),ell(.18,.22,.16,ch,-.52,.42,0));
  const gm=PHY({color:0x8a3a14,roughness:.25,clearcoat:1,transparent:true,opacity:.55,depthWrite:false}),gs=tex(256,64,(x,w,h)=>{x.fillStyle='#fff';x.fillRect(0,0,w,h);x.fillStyle='rgba(60,20,5,.55)';for(let s=40;s<w;s+=46)x.fillRect(s,0,10,h)});
  gm.map=gs;g.add(ell(1.3,.98,.95,gm,-1.6,.6,0));
  const leg=(x0,dx,s)=>g.add(tube([V3(x0,.32,.28*s),V3(x0+dx*.3,.95,1.0*s),V3(x0+dx*.7,.35,1.7*s),V3(x0+dx,-.58,2.05*s)],.06,ch2,{seg:40,rs:8,rf:t=>1-t*.5}));
  [[1.3,1.1],[.85,.1],[.45,-1.2]].forEach(([x,dx])=>{leg(x,dx,1);leg(x,dx,-1)});
  const soil=tex(512,512,(x,w,h)=>{x.fillStyle='#7a5a3a';x.fillRect(0,0,w,h);for(let i=0;i<9000;i++){const v=Math.random();x.fillStyle=v<.5?`rgba(60,40,22,${rnd(.2,.6)})`:`rgba(170,140,100,${rnd(.15,.5)})`;x.fillRect(rnd(0,w),rnd(0,h),rnd(1,4),rnd(1,4))}},1);soil.repeat.set(3,3);
  deco.add(mesh(new THREE.CircleGeometry(9,64).rotateX(-Math.PI/2),soilM({map:soil,color:0xd0d0d0},8),0,-.62,0));
  /* plus loin : la terre laisse place à l'herbe, sur une douzaine de centimètres */
  const far=tex(1024,1024,(x,w,h)=>{const gr=x.createRadialGradient(w/2,h/2,0,w/2,h/2,w/2);gr.addColorStop(0,'#7a5a3a');gr.addColorStop(.12,'#7a5a3a');gr.addColorStop(.3,'#5f8a3a');gr.addColorStop(1,'#5f9a3a');x.fillStyle=gr;x.fillRect(0,0,w,h);
    for(let i=0;i<16000;i++){const a=rnd(0,6.28),r=Math.sqrt(Math.random())*w/2,k=r/(w/2);x.fillStyle=k<.18?`rgba(60,40,22,${rnd(.2,.5)})`:`rgba(${rnd(30,70)|0},${rnd(80,140)|0},${rnd(20,45)|0},${rnd(.3,.6)})`;x.fillRect(w/2+Math.cos(a)*r,h/2+Math.sin(a)*r,rnd(1,3),rnd(1,3))}
    x.globalCompositeOperation='destination-in';const e=x.createRadialGradient(w/2,h/2,w*.4,w/2,h/2,w*.5);e.addColorStop(0,'#000');e.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=e;x.fillRect(0,0,w,h)});
  deco.add(Object.assign(mesh(new THREE.CircleGeometry(160,96).rotateX(-Math.PI/2),soilM({map:far,transparent:true,depthWrite:false,color:0xd0d0d0},7),0,-.62,0),{renderOrder:-1}));
  for(let i=0;i<120;i++){const a=rnd(0,6.28),r=i<34?rnd(3,8.5):rnd(9,45),s=i<34?rnd(.12,.45):rnd(.3,1.6),o=mesh(new THREE.DodecahedronGeometry(s,0),matte([0x8a8278,0x6e5a44,0xa09080][i%3],{flatShading:true}),Math.cos(a)*r,-.6,Math.sin(a)*r);o.scale.y=.6;o.rotation.set(rnd(0,3),rnd(0,3),0);deco.add(o)}
  /* brins d'herbe à leur vraie taille : 5 à 9 cm, soit 60 à 120 fois la longueur de la fourmi */
  const bm=[0x4f8a34,0x5f9a3a,0x3f7a2c].map(c=>matte(c));
  for(let i=0;i<60;i++){const a=rnd(0,6.28),r=rnd(22,120),hb=rnd(60,120),x0=Math.cos(a)*r,z0=Math.sin(a)*r,b=a+rnd(-1.5,1.5),ln=rnd(.1,.45),f=[];
    for(let k=0;k<=6;k++){const s=k/6;f.push(V3(x0+Math.cos(b)*ln*hb*s*s,-.62+hb*s*(1-.15*s*ln),z0+Math.sin(b)*ln*hb*s*s))}deco.add(tube(f,1.6,bm[i%3],{seg:24,rs:6,rf:t=>1-t*.92}))}
  g.add(deco);const ants=g.children.filter(o=>o.userData.s);
  return{g,deco,a:V3(-1.6,.6,0),c:V3(.4,.5,0),upd:t=>{ants.forEach(a=>{a.rotation.z=Math.sin(t*2+a.userData.s)*.08;a.rotation.y=Math.sin(t*1.3)*.1*a.userData.s})}}}
