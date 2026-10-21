/* Niveaux 8 à 18 : de l'humain à la toile cosmique, à leur taille réelle (voir MPU dans core.js). */

/* herbe (une texture par sol, chacun ayant sa propre répétition) */
const grassT=rep=>{const t=tex(512,512,(x,w,h)=>{x.fillStyle='#5f9a3a';x.fillRect(0,0,w,h);for(let i=0;i<7000;i++){const v=Math.random();x.strokeStyle=v<.5?'rgba(40,90,25,.6)':'rgba(150,200,90,.55)';x.lineWidth=1.3;const p=[rnd(0,w),rnd(0,h)];x.beginPath();x.moveTo(...p);x.lineTo(p[0]+rnd(-3,3),p[1]-rnd(4,10));x.stroke()}
  for(let i=0;i<60;i++){x.fillStyle=['#fff6c8','#ffd0e0','#ffe066'][i%3];x.beginPath();x.arc(rnd(0,w),rnd(0,h),2.5,0,7);x.fill()}},1);t.repeat.set(rep,rep);return t};
/* toit à deux pans : prisme de longueur l (axe x), de largeur w (axe z) et de hauteur h, posé sur y=0 ; pignons = matière 0, pans = matière 1 */
function roofGeo(l,w,h){const s=new THREE.Shape();s.moveTo(-w/2,0);s.lineTo(w/2,0);s.lineTo(0,h);s.closePath();
  return new THREE.ExtrudeGeometry(s,{depth:l,bevelEnabled:false}).rotateY(Math.PI/2).translate(-l/2,0,0)}

/* lecture d'un modèle .glb embarqué en base64 (inutilisé pour l'instant, prêt pour un futur modèle) : maillages, indices et couleurs de base (les normales, absentes du fichier, sont recalculées) */
function glbGroup(b64){const bin=Uint8Array.from(atob(b64),c=>c.charCodeAt(0)).buffer,jl=new DataView(bin).getUint32(12,true),j=JSON.parse(new TextDecoder().decode(new Uint8Array(bin,20,jl))),b0=20+jl+8,
    acc=i=>{const a=j.accessors[i],v=j.bufferViews[a.bufferView],o=b0+(v.byteOffset||0)+(a.byteOffset||0),n=a.count*{SCALAR:1,VEC2:2,VEC3:3,VEC4:4}[a.type],T={5126:Float32Array,5125:Uint32Array,5123:Uint16Array}[a.componentType];return new T(bin.slice(o,o+n*T.BYTES_PER_ELEMENT))},
    mats=j.materials.map(m=>{const c=(m.pbrMetallicRoughness||{}).baseColorFactor||[1,1,1,1];return gloss(new THREE.Color(c[0],c[1],c[2]),{roughness:.6,clearcoat:.15})}),g=new THREE.Group();
  j.nodes.forEach(nd=>{if(nd.mesh===undefined)return;j.meshes[nd.mesh].primitives.forEach(p=>{const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(acc(p.attributes.POSITION),3));
    if(p.indices!==undefined)geo.setIndex(new THREE.BufferAttribute(acc(p.indices),1));geo.computeVertexNormals();g.add(new THREE.Mesh(geo,mats[p.material]))})});return g}

/* 8 · humain de 1,75 m : sweat à capuche, sac à dos, baskets ; la fourmi à ses pieds (à sa vraie taille : quelques pixels) */
function L8(){const g=new THREE.Group(),deco=new THREE.Group(),cloth=c=>gloss(c,{roughness:.75,clearcoat:.05}),skin=gloss(0xF0C29A,{roughness:.6,clearcoat:.1}),hood=cloth(0x2F5FC8),hood2=cloth(0x264EA8),pants=cloth(0x3B3F45),
    white=gloss(0xF6F6F6,{roughness:.5}),sole=gloss(0xD2D2D2),hair=gloss(0x5A3A22,{roughness:.55,clearcoat:.25}),bag=cloth(0x4A5058),bag2=cloth(0x3A3F46),dark=gloss(0x141414,{roughness:.2,clearcoat:1});
  [1,-1].forEach(s=>{
    /* jambes et baskets */
    g.add(tube([V3(.3*s,-.05,0),V3(.32*s,-1.6,.06),V3(.3*s,-2.85,0)],.27,pants,{seg:40,rs:18,rf:t=>1-t*.28}),ell(.22,.14,.44,white,.3*s,-3.03,.14),ell(.235,.05,.46,sole,.3*s,-3.16,.14));
    /* bras : manche, poignet, main */
    g.add(tube([V3(.78*s,1.62,0),V3(.92*s,.75,.04),V3(.98*s,-.12,.14)],.19,hood,{seg:30,rs:16,rf:t=>1-t*.15}),tube([V3(.98*s,-.1,.14),V3(.99*s,-.28,.16)],.165,hood2,{seg:4,rs:16}),ell(.12,.2,.09,skin,1.0*s,-.44,.16));
    /* bretelles du sac par-dessus les épaules */
    g.add(tube([V3(.3*s,1.45,-.42),V3(.34*s,1.92,-.12),V3(.36*s,1.84,.32),V3(.34*s,1.15,.47)],.05,bag2,{seg:30,rs:8}));
    /* visage : yeux, sourcils */
    g.add(ell(.085,.1,.04,white,.15*s,2.64,.39),ball(.052,gloss(0x6A3F22,{clearcoat:1,roughness:.2}),.15*s,2.635,.42,16),ball(.025,dark,.15*s,2.635,.448,10),rod(V3(.08*s,2.79,.39),V3(.23*s,2.78,.35),.02,hair,8),ell(.07,.12,.06,skin,.41*s,2.6,0))});
  /* torse : sweat (profil tourné, aplati d'avant en arrière), poche, cordons, capuche */
  const torso=mesh(new THREE.LatheGeometry([[0,-.35],[.7,-.35],[.74,-.1],[.72,.5],[.76,1.1],[.78,1.5],[.6,1.8],[.25,1.95],[0,1.96]].map(([r,y])=>new THREE.Vector2(r,y)),40),hood);torso.scale.z=.6;
  const hd=mesh(new THREE.TorusGeometry(.33,.15,12,30),hood2,0,2.0,-.12);hd.rotation.x=Math.PI/2*.85;hd.scale.set(1.1,1,.9);
  g.add(torso,hd,ell(.45,.22,.06,hood2,0,.25,.43),rod(V3(.1,1.92,.32),V3(.11,1.45,.43),.022,white,8),rod(V3(-.1,1.92,.32),V3(-.11,1.45,.43),.022,white,8));
  /* sac à dos */
  g.add(ell(.55,.68,.27,bag,0,1.05,-.62),ell(.38,.24,.09,bag2,0,.72,-.86),mesh(new THREE.TorusGeometry(.12,.03,8,16,Math.PI),bag2,0,1.7,-.6));
  /* cou, tête, nez, sourire, cheveux */
  const smile=mesh(new THREE.TorusGeometry(.1,.017,8,20,Math.PI),gloss(0x9A3A30),0,2.44,.405);smile.rotation.z=Math.PI;
  g.add(mesh(new THREE.CylinderGeometry(.14,.16,.3,16),skin,0,2.08,0),ell(.4,.47,.43,skin,0,2.6,0),ell(.05,.08,.06,skin,0,2.53,.44),smile,
    ell(.43,.3,.46,hair,0,2.86,-.04),ell(.33,.15,.22,hair,.06,2.97,.24),ell(.44,.34,.22,hair,0,2.68,-.26));
  g.add(blob(1.2,.8,0,-3.2,.1,.9));
  deco.add(mesh(new THREE.CircleGeometry(9,64).rotateX(-Math.PI/2),soilM({map:grassT(4),color:0xd0d0d0},6),0,-3.205,0));g.add(deco);
  return{g,deco,a:V3(.55,-3.205+.62*MPU[7]/MPU[8],1.15),upd:()=>{}}}

/* 9 · maison et jardin, l'humain sur la pelouse (1 unité = 3 m) : toit de tuiles, cheminée, volets bleus, buissons */
const tileTex=()=>{const t=tex(256,256,(x,w,h)=>{x.fillStyle='#A8401F';x.fillRect(0,0,w,h);for(let r=0;r<8;r++)for(let c=-1;c<9;c++){const X=c*32+(r%2?16:0)+16,Y=r*32,g=x.createLinearGradient(0,Y,0,Y+32);
  g.addColorStop(0,'#F08A55');g.addColorStop(.7,'#D45A30');g.addColorStop(1,'#8A3018');x.fillStyle=g;x.beginPath();x.moveTo(X-15,Y);x.lineTo(X+15,Y);x.quadraticCurveTo(X+16,Y+30,X,Y+32);x.quadraticCurveTo(X-16,Y+30,X-15,Y);x.fill()}},1);return t};
const bush=(m,x,z,s)=>{const b=new THREE.Group();for(let i=0;i<5;i++)b.add(ball(s*rnd(.55,.8),m,x+rnd(-s,s)*.6,s*rnd(.4,.7),z+rnd(-s,s)*.6,14));return b};
function L9(){const g=new THREE.Group(),deco=new THREE.Group(),h=new THREE.Group(),wall=gloss(0xF6EBD9,{roughness:.8,clearcoat:0}),roof=gloss(0xffffff,{map:tileTex(),roughness:.6,clearcoat:.15}),
    blue=gloss(0x3A6FC8,{roughness:.5}),frame=gloss(0xFFFFFF,{roughness:.5}),glassW=gloss(0x8FB8E8,{roughness:.1,clearcoat:1}),stone=gloss(0xB9B2A8,{roughness:.9,clearcoat:0}),brick=gloss(0xB86A50,{roughness:.8,clearcoat:0});
  h.add(mesh(new THREE.BoxGeometry(3.4,1.9,2.6),wall,0,.95,0),mesh(new THREE.BoxGeometry(3.5,.2,2.7),stone,0,.1,0),mesh(roofGeo(3.8,3.05,1.25),[wall,roof],0,1.9,0),
    rod(V3(-1.9,3.15,0),V3(1.9,3.15,0),.07,gloss(0x9A3A1E)),mesh(new THREE.BoxGeometry(.32,.85,.32),brick,.9,2.8,-.5),mesh(new THREE.BoxGeometry(.4,.08,.4),stone,.9,3.24,-.5));
  /* fenêtres à cadre blanc et volets bleus, porte bleue */
  const win=(x,y,z,side)=>{const w=new THREE.Group();w.add(mesh(new THREE.BoxGeometry(.56,.52,.05),frame),mesh(new THREE.BoxGeometry(.44,.4,.07),glassW),mesh(new THREE.BoxGeometry(.04,.4,.08),frame),
      mesh(new THREE.BoxGeometry(.22,.5,.05),blue,-.4,0,0),mesh(new THREE.BoxGeometry(.22,.5,.05),blue,.4,0,0));w.position.set(x,y,z);if(side)w.rotation.y=side*Math.PI/2;h.add(w)};
  [[-1.1,.6],[1.05,.6],[-1.1,1.4],[0,1.4],[1.05,1.4]].forEach(([x,y])=>win(x,y,1.31,0));
  [1,-1].forEach(s=>[[.6,-.6],[1.4,.5],[1.4,-.6]].forEach(([y,z])=>win(1.71*s,y,z,s)));
  h.add(mesh(new THREE.BoxGeometry(.62,1.0,.05),frame,0,.5,1.31),mesh(new THREE.BoxGeometry(.5,.92,.08),blue,0,.46,1.32),ball(.035,gloss(0xE8C24A),.17,.46,1.37,10));
  const bm=[gloss(0x4CAF50,{roughness:.7,clearcoat:0}),gloss(0x3E9A40,{roughness:.7,clearcoat:0})];
  [[-1.4,1.55],[-.7,1.55],[.7,1.55],[1.4,1.55],[1.95,.5],[-1.95,-.4]].forEach(([x,z],i)=>h.add(bush(bm[i%2],x,z,.28)));
  h.add(blob(2.5,2.0,0,.01,0,.7));h.position.set(-.9,0,-.9);g.add(h);
  /* jardin : pelouse, allée, haie et arbres ronds */
  deco.add(mesh(new THREE.CircleGeometry(9,96).rotateX(-Math.PI/2),soilM({map:grassT(43),color:0xd0d0d0},4)),mesh(new THREE.PlaneGeometry(.6,4.2).rotateX(-Math.PI/2),soilM({color:0xd9c9a3},5),-.9,0,2.5));
  const hm=gloss(0x3d7e2e,{roughness:.8,clearcoat:0});[[0,-4.2,9.2,.3],[-4.6,.2,.3,8.8],[4.6,.2,.3,8.8],[-2.95,4.6,3.3,.3],[2.05,4.6,5.1,.3]].forEach(([x,z,w,d])=>deco.add(mesh(new THREE.BoxGeometry(w,.4,d),hm,x,.2,z)));
  [[-3.4,-2.8,1],[3.3,-2.9,1.15],[-3.6,2.7,.9]].forEach(([x,z,s])=>{const t=new THREE.Group();t.add(mesh(new THREE.CylinderGeometry(.09*s,.13*s,1.1*s,10),gloss(0x7A4A28,{roughness:.8,clearcoat:0}),0,.55*s,0));
    [[0,1.75,0,.62],[.38,1.5,.1,.45],[-.35,1.55,-.12,.48],[.05,1.45,.38,.42],[0,2.1,-.1,.4]].forEach(([a,b,c,r])=>t.add(ball(r*s,bm[0],a*s,b*s,c*s,18)));t.position.set(x,0,z);deco.add(t,blob(.9*s,.9*s,x,.01,z,.6))});
  g.add(deco);
  return{g,deco,a:V3(1.8,3.205*MPU[8]/MPU[9],2),c:V3(-.9,1,-.9),upd:()=>{}}}

/* 10 · village : rues, champs, bois, rivière et église (1 unité = 100 m) */
const vRoad=x=>.9*Math.sin(x*.35)+.3,vCross=z=>.25*Math.sin(z*.5)-.1,vRiver=x=>-2.6+.6*Math.sin(x*.45+1),HOME=V3(1.4,0,vRoad(1.4)-.16),CHURCH=V3(-.45,0,-.15);
const WOODS=[[-4,-4.6,1.3],[4.6,3.4,1.2],[-4.8,2.9,1],[3.8,-4.2,.9]];
const villageTex=()=>tex(1024,1024,(x,w,h)=>{const r=7,X=v=>(v+r)/(2*r)*w,Y=v=>(v+r)/(2*r)*h,K=w/(2*r);
  x.fillStyle='#86b35a';x.fillRect(0,0,w,h);
  const pal=['#9cc25a','#c9c06a','#b8a36a','#6f9d45','#d8c87a','#8bb350','#a88a5a','#7aa84c'];
  for(let i=0;i<260;i++){const a=rnd(0,6.28),d=rnd(1.6,7.2);x.save();x.translate(X(Math.cos(a)*d),Y(Math.sin(a)*d));x.rotate([.2,.25,1.75,-.6][i%4]+rnd(-.08,.08));
    const fw=rnd(.4,1.1)*K,fh=rnd(.3,.8)*K;x.fillStyle=pal[i%pal.length];x.fillRect(-fw/2,-fh/2,fw,fh);x.strokeStyle='rgba(60,90,40,.6)';x.lineWidth=1.5;x.strokeRect(-fw/2,-fh/2,fw,fh);x.restore()}
  const gc=x.createRadialGradient(X(0),Y(0),0,X(0),Y(0),2*K);gc.addColorStop(0,'rgba(120,165,85,1)');gc.addColorStop(1,'rgba(120,165,85,0)');x.fillStyle=gc;x.fillRect(0,0,w,h);
  WOODS.forEach(([cx,cz,rr])=>{for(let i=0;i<40;i++){x.fillStyle='rgba(46,90,38,.55)';x.beginPath();x.arc(X(cx+rnd(-rr,rr)*.8),Y(cz+rnd(-rr,rr)*.8),rnd(.2,.45)*K,0,7);x.fill()}});
  const line=(f,hz,col,wd)=>{x.strokeStyle=col;x.lineWidth=wd;x.lineCap=x.lineJoin='round';x.beginPath();for(let i=0;i<=300;i++){const s=-7.5+i*.05,px=hz?X(s):X(f(s)),py=hz?Y(f(s)):Y(s);i?x.lineTo(px,py):x.moveTo(px,py)}x.stroke()};
  line(vRiver,1,'#4a8ec8',10);line(vRoad,1,'#8d877c',8);line(vRoad,1,'#c4beb2',5.5);line(vCross,0,'#8d877c',7);line(vCross,0,'#c4beb2',4.5);
  /* bord fondu dans le paysage de l'étage suivant */
  x.globalCompositeOperation='destination-in';const e=x.createRadialGradient(w/2,h/2,w*.36,w/2,h/2,w*.5);e.addColorStop(0,'#000');e.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=e;x.fillRect(0,0,w,h)});
/* campagne autour du village, sur 4 km : champs, bois, hameaux, routes et rivière prolongées */
const FARWOODS=Array.from({length:28},()=>{const a=rnd(0,6.28),d=rnd(8,36);return[Math.cos(a)*d,Math.sin(a)*d,rnd(1,3)]}),
  HAMLETS=Array.from({length:8},()=>{const a=rnd(0,6.28),d=rnd(10,32);return[Math.cos(a)*d,Math.sin(a)*d]});
const farTex=()=>tex(2048,2048,(x,w,h)=>{const r=40,X=v=>(v+r)/(2*r)*w,Y=v=>(v+r)/(2*r)*h,K=w/(2*r);
  x.fillStyle='#86b35a';x.fillRect(0,0,w,h);
  const pal=['#9cc25a','#c9c06a','#b8a36a','#6f9d45','#d8c87a','#8bb350','#a88a5a','#7aa84c'];
  for(let i=0;i<2600;i++){const a=rnd(0,6.28),d=Math.sqrt(rnd(16,1700));x.save();x.translate(X(Math.cos(a)*d),Y(Math.sin(a)*d));x.rotate([.2,.25,1.75,-.6][i%4]+rnd(-.1,.1));
    const fw=rnd(.5,1.5)*K,fh=rnd(.4,1)*K;x.fillStyle=pal[i%pal.length];x.fillRect(-fw/2,-fh/2,fw,fh);x.strokeStyle='rgba(60,90,40,.5)';x.lineWidth=1;x.strokeRect(-fw/2,-fh/2,fw,fh);x.restore()}
  FARWOODS.forEach(([cx,cz,rr])=>{for(let i=0;i<30;i++){x.fillStyle='rgba(46,90,38,.6)';x.beginPath();x.arc(X(cx+rnd(-rr,rr)*.8),Y(cz+rnd(-rr,rr)*.8),rnd(.3,.7)*K,0,7);x.fill()}});
  HAMLETS.forEach(([cx,cz])=>{const g=x.createRadialGradient(X(cx),Y(cz),0,X(cx),Y(cz),.8*K);g.addColorStop(0,'rgba(120,165,85,1)');g.addColorStop(1,'rgba(120,165,85,0)');x.fillStyle=g;x.fillRect(0,0,w,h)});
  const line=(f,col,wd)=>{x.strokeStyle=col;x.lineWidth=wd;x.lineCap=x.lineJoin='round';x.beginPath();for(let i=0;i<=400;i++){const [a,b]=f(-41+i*.205);i?x.lineTo(X(a),Y(b)):x.moveTo(X(a),Y(b))}x.stroke()};
  line(s=>[s,vRiver(s)],'#4a8ec8',4);
  [s=>[s,vRoad(s)],s=>[vCross(s),s],s=>[s,-12+s*.45],s=>[10-s*.4,s],...HAMLETS.map(([hx,hz])=>s=>{const t=(s+41)/82;return[hx*t,hz*t]})].forEach(f=>{line(f,'#8d877c',3.2);line(f,'#c4beb2',2)});
  x.globalCompositeOperation='destination-in';const e=x.createRadialGradient(w/2,h/2,w*.38,w/2,h/2,w*.5);e.addColorStop(0,'#000');e.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=e;x.fillRect(0,0,w,h)});
function L10(){const g=new THREE.Group(),o=new THREE.Object3D(),cc=new THREE.Color(),H=[];
  /* sols transparents dessinés du plus grand au plus petit (renderOrder), chacun par-dessus le précédent */
  g.add(Object.assign(mesh(new THREE.CircleGeometry(7,96).rotateX(-Math.PI/2),soilM({map:villageTex(),transparent:true,depthWrite:false,color:0xb4b4b4},2)),{renderOrder:-2}),
    Object.assign(mesh(new THREE.CircleGeometry(40,128).rotateX(-Math.PI/2),soilM({map:farTex(),transparent:true,depthWrite:false,color:0xb4b4b4},1)),{renderOrder:-3}));
  /* hameaux : quelques maisons serrées */
  HAMLETS.forEach(([cx,cz])=>{for(let i=0;i<7;i++){const x=cx+rnd(-.5,.5),z=cz+rnd(-.5,.5);if(!H.some(q=>Math.hypot(q[0]-x,q[1]-z)<.15))H.push([x,z,rnd(0,6.28)])}});
  /* maisons le long des rues, plus serrées au centre ; la nôtre (étage précédent) est en HOME */
  const add=(x,z,ry)=>{if(Math.hypot(x-HOME.x,z-HOME.z)<.38||Math.hypot(x-CHURCH.x,z-CHURCH.z)<.35||Math.abs(z-vRiver(x))<.2||Math.abs(z-vRoad(x))<.1||Math.abs(x-vCross(z))<.1||H.some(q=>Math.hypot(q[0]-x,q[1]-z)<.15))return;H.push([x,z,ry])};
  for(let s=-6;s<=6;s+=.2)[1,-1].forEach(sd=>{const dd=s*s;
    if(Math.random()<Math.exp(-dd/5)*.95+.04){const dz=(vRoad(s+.01)-vRoad(s-.01))/.02,n=V3(-dz,0,1).normalize().multiplyScalar(sd);add(s+n.x*.16,vRoad(s)+n.z*.16,Math.atan2(-n.x,-n.z))}
    if(Math.random()<Math.exp(-dd/4)*.95+.03){const dx=(vCross(s+.01)-vCross(s-.01))/.02,n=V3(1,0,-dx).normalize().multiplyScalar(sd);add(vCross(s)+n.x*.16,s+n.z*.16,Math.atan2(-n.x,-n.z))}});
  const hb=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1).translate(0,.5,0),matte(0xffffff),H.length),hr=new THREE.InstancedMesh(roofGeo(1,1,.5),matte(0xffffff,{roughness:.6}),H.length),
    wc=[0xF2E6D0,0xEADBC0,0xF5EEDF,0xE6D3B3,0xD9CBB5],rc=[0xE0632F,0xD4532A,0xC8452A,0xE87A3A,0x8A8F99];
  H.forEach(([x,z,ry],i)=>{const w=rnd(.1,.15),hh=rnd(.05,.065),d=rnd(.08,.1);o.position.set(x,0,z);o.rotation.set(0,ry,0);o.scale.set(w,hh,d);o.updateMatrix();hb.setMatrixAt(i,o.matrix);hb.setColorAt(i,cc.set(wc[i%5]));
    o.position.y=hh;o.scale.set(w*1.06,d*.9,d*1.12);o.updateMatrix();hr.setMatrixAt(i,o.matrix);hr.setColorAt(i,cc.set(rc[i%5]))});
  /* arbres : bois et alignements le long de la route */
  const T=[];WOODS.forEach(([cx,cz,rr])=>{for(let i=0;i<170;i++){const a=rnd(0,6.28),d=rr*Math.sqrt(Math.random());T.push([cx+Math.cos(a)*d,cz+Math.sin(a)*d*.8])}});
  FARWOODS.forEach(([cx,cz,rr])=>{for(let i=0;i<rr*90;i++){const a=rnd(0,6.28),d=rr*.8*Math.sqrt(Math.random());T.push([cx+Math.cos(a)*d,cz+Math.sin(a)*d])}});
  for(let i=0;i<90;i++){const s=rnd(-6,6),z=vRoad(s)+(Math.random()<.5?-1:1)*rnd(.3,.5);if(Math.hypot(s,z)>1.5&&Math.hypot(s-HOME.x,z-HOME.z)>.3)T.push([s,z])}
  const tm=new THREE.InstancedMesh(new THREE.SphereGeometry(1,8,6),matte(0xffffff),T.length);
  T.forEach(([x,z],i)=>{const r=rnd(.025,.05);o.position.set(x,r*1.1,z);o.rotation.set(0,0,0);o.scale.set(r,r*1.15,r);o.updateMatrix();tm.setMatrixAt(i,o.matrix);tm.setColorAt(i,cc.set([0x4CAF50,0x3E9A40,0x5DBB4A][i%3]))});
  /* cheminées */
  const cm=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),gloss(0xB86A50,{roughness:.8,clearcoat:0}),H.length);
  H.forEach(([x,z,ry],i)=>{o.position.set(x+Math.cos(ry)*.03,.09,z-Math.sin(ry)*.03);o.rotation.set(0,ry,0);o.scale.set(.014,.04,.014);o.updateMatrix();cm.setMatrixAt(i,o.matrix)});
  hb.frustumCulled=hr.frustumCulled=tm.frustumCulled=cm.frustumCulled=false;g.add(hb,hr,tm,cm);
  /* pont de pierre là où la rue croise la rivière */
  let zb=-2.6;for(let i=0;i<20;i++)zb=vRiver(vCross(zb));const br=new THREE.Group(),st=gloss(0xC9C0B2,{roughness:.9,clearcoat:0});
  br.add(mesh(new THREE.BoxGeometry(.08,.02,.36),st,0,.012,0),mesh(new THREE.BoxGeometry(.008,.025,.36),st,.04,.03,0),mesh(new THREE.BoxGeometry(.008,.025,.36),st,-.04,.03,0));br.position.set(vCross(zb),0,zb);g.add(br);
  /* église et son clocher */
  const ch=new THREE.Group(),stone=matte(0xe8e0d0),slate=matte(0x6b6b70);
  ch.add(mesh(new THREE.BoxGeometry(.32,.12,.14).translate(0,.06,0),stone),mesh(roofGeo(.34,.16,.08),[stone,slate],0,.12,0),mesh(new THREE.BoxGeometry(.07,.22,.07).translate(0,.11,0),stone,-.18,0,0),mesh(new THREE.ConeGeometry(.055,.16,4),slate,-.18,.3,0));
  ch.position.copy(CHURCH);g.add(ch);
  return{g,a:HOME.clone(),upd:()=>{}}}

/* contours des terres (les anneaux qui franchissent 180° sont « dépliés ») */
const landPath=(c,X,Y,offs=[0])=>{c.beginPath();LAND.forEach(r=>{const u=[];let off=0;for(let i=0;i<r.length;i+=2){if(i){const d=r[i]+off-u[u.length-2];if(d>180)off-=360;else if(d<-180)off+=360}u.push(r[i]+off,r[i+1])}
  offs.forEach(o=>{for(let i=0;i<u.length;i+=2)i?c.lineTo(X(u[i]+o),Y(u[i+1])):c.moveTo(X(u[i]+o),Y(u[i+1]));c.closePath()})})};
/* Terres peintes en degrés (lon, lat, rayon) : la Terre et la carte régionale tirent les mêmes taches, déserts et reliefs,
   la carte régionale n'est qu'une version plus fine du globe et s'y fond sans raccord visible */
const BLOBS=Array.from({length:2500},()=>[rnd(-180,180),rnd(-90,90),rnd(.7,4.6),Math.random()<.5]),
  DESERTS=[[10,23,16],[45,24,10],[133,-25,14],[-112,36,8],[-69,-24,6],[95,42,14],[20,-22,9]],
  RELIEFS=[[6.8,45.6,1.3,1],[8.6,46.4,1.4,1],[10.6,46.7,1.3,1],[12.6,47.1,1.1,1],[7.3,44.4,.7,.6],[.6,42.75,1,.8],[-.9,42.95,.7,.7],[2,42.55,.6,.7],[2.9,45.3,1,.35],[6.9,48.1,.6,.3]];
function paintLand(l,X,Y,kx,ky,box){const blot=(lo,la,r,st)=>{if(box&&(lo+r<box[0]||lo-r>box[1]||la+r<box[2]||la-r>box[3]))return;l.save();l.translate(X(lo),Y(la));l.scale(kx,ky);
    if(typeof st=='string')l.fillStyle=st;else{const g=l.createRadialGradient(0,0,0,0,0,r);st.forEach(([s,c])=>g.addColorStop(s,c));l.fillStyle=g}l.beginPath();l.arc(0,0,r,0,7);l.fill();l.restore()};
  landPath(l,X,Y,[-360,0,360]);l.fillStyle='#3F9D45';l.fill('evenodd');l.globalCompositeOperation='source-atop';
  BLOBS.forEach(([lo,la,r,d])=>blot(lo,la,r,d?'rgba(30,70,25,.18)':'rgba(140,170,80,.16)'));
  DESERTS.forEach(([lo,la,r])=>blot(lo,la,r,[[0,'rgba(214,180,118,.95)'],[.6,'rgba(200,165,105,.7)'],[1,'rgba(200,165,105,0)']]));
  RELIEFS.forEach(([lo,la,r,k])=>blot(lo,la,r,[[0,`rgba(${k>.9?'240,242,245':'196,178,140'},${.85*k})`],[.45,`rgba(190,170,130,${.6*k})`],[1,'rgba(190,170,130,0)']]));
  blot(-40,72,16,[[0,'rgba(245,250,255,1)'],[1,'rgba(245,250,255,.2)']])}
/* océan : même dégradé en latitude partout */
const ocean=(x,Y,w,h)=>{const o=x.createLinearGradient(0,Y(90),0,Y(-90));o.addColorStop(0,'#1A4E9E');o.addColorStop(.5,'#1E78D8');o.addColorStop(1,'#1A4E9E');x.fillStyle=o;x.fillRect(0,0,w,h)};

/* texture de la Terre dessinée à partir des contours des continents */
const earthTex=tex(2048,1024,(x,w,h)=>{const X=lo=>(lo+180)/360*w,Y=la=>(90-la)/180*h;ocean(x,Y,w,h);
  const lc=document.createElement('canvas');lc.width=w;lc.height=h;const l=lc.getContext('2d');
  paintLand(l,X,Y,w/360,h/180);l.fillStyle='rgba(245,250,255,.95)';l.fillRect(0,Y(-64),w,h);
  x.drawImage(lc,0,0);x.fillStyle='rgba(240,248,255,.9)';x.fillRect(0,0,w,Y(82))});
const cloudTex=tex(1024,512,(x,w,h)=>{for(let i=0;i<1800;i++){const y=rnd(0,h),la=Math.abs(.5-y/h),k=la>.08&&la<.38?1:.5;x.fillStyle=`rgba(255,255,255,${rnd(.08,.2)*k})`;x.beginPath();x.ellipse(rnd(0,w),y,rnd(8,46),rnd(4,14),rnd(-.3,.3),0,7);x.fill()}});
const earthMat=STD({map:earthTex,bumpMap:earthTex,bumpScale:.012,roughness:.75,metalness:0,envMapIntensity:.35});
const atmo=r=>{const m=fres(0x6fb0ff,{a0:0,a1:.85,p:3.2});m.side=THREE.FrontSide;return ball(r,m,0,0,0,64)};
/* le village est au centre de la France (46,5° N, 2,5° E) : ce point est tourné vers le haut */
const FR=V3(Math.cos(46.5*R)*Math.cos(2.5*R),Math.sin(46.5*R),-Math.cos(46.5*R)*Math.sin(2.5*R)),FRQ=new THREE.Quaternion().setFromUnitVectors(FR,V3(0,1,0));

/* 11 · la France vue de 400 km : morceau de sphère au rayon de la Terre (3 km au-dessus d'elle), avec la même carte que le globe en plus fin */
const LO0=-12,LO1=22,LA0=34,LA1=58;
const regTex=()=>tex(2048,1024,(x,w,h)=>{const X=lo=>(lo-LO0)/(LO1-LO0)*w,Y=la=>(LA1-la)/(LA1-LA0)*h,kx=w/(LO1-LO0),ky=h/(LA1-LA0);ocean(x,Y,w,h);
  const lc=document.createElement('canvas');lc.width=w;lc.height=h;const l=lc.getContext('2d');
  paintLand(l,X,Y,kx,ky,[LO0,LO1,LA0,LA1]);
  /* détail fin, très léger pour ne pas changer la teinte d'ensemble */
  for(let i=0;i<4000;i++){l.fillStyle=Math.random()<.5?'rgba(30,70,25,.07)':'rgba(140,170,80,.07)';l.beginPath();l.ellipse(rnd(0,w),rnd(0,h),rnd(2,8),rnd(2,8),0,0,7);l.fill()}
  x.drawImage(lc,0,0);
  /* bords fondus dans le globe */
  x.globalCompositeOperation='destination-in';[[w,0],[0,h]].forEach(([gx,gy])=>{const e=x.createLinearGradient(0,0,gx,gy);e.addColorStop(0,'rgba(0,0,0,0)');e.addColorStop(.08,'#000');e.addColorStop(.92,'#000');e.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=e;x.fillRect(0,0,w,h)})});
function L11(){const g=new THREE.Group(),Rc=(6.371e6+3000)/MPU[11],dy=-Rc-5/MPU[11],rot=new THREE.Matrix4().makeRotationFromQuaternion(FRQ),tags=[];
  /* géométrie recentrée sur le village (coordonnées petites près de lui : pas de tremblement) */
  const geo=new THREE.SphereGeometry(Rc,256,192,(LO0+180)*R,(LO1-LO0)*R,(90-LA1)*R,(LA1-LA0)*R).applyMatrix4(rot).translate(0,dy,0);
  g.add(Object.assign(mesh(geo,STD({map:regTex(),transparent:true,depthWrite:false,roughness:.8,envMapIntensity:.3})),{renderOrder:-21}));
  const ll=(la,lo)=>V3(Math.cos(la*R)*Math.cos(lo*R),Math.sin(la*R),-Math.cos(la*R)*Math.sin(lo*R)).multiplyScalar(Rc+.02).applyQuaternion(FRQ).add(V3(0,dy,0));
  [['Paris',48.86,2.35],['Lyon',45.76,4.83],['Marseille',43.3,5.37],['Bordeaux',44.84,-.58],['Toulouse',43.6,1.44]].forEach(([n,la,lo])=>{const d=dot(0xffffff,6);d.position.copy(ll(la,lo));g.add(d);tags.push([d,n])});
  return{g,a:V3(0,0,0),tags,upd:()=>{}}}

/* 12 · la Terre (rayon 6 371 km ; la France est en haut) */
function L12(){const g=new THREE.Group(),e=new THREE.Group(),cl=ball(2.61,STD({map:cloudTex,transparent:true,depthWrite:false,roughness:1}),0,0,0,64);
  e.add(ball(2.6,earthMat,0,0,0,96),cl,atmo(2.82));e.quaternion.copy(FRQ);g.add(e);
  return{g,a:V3(0,2.6+3005/MPU[12],0),upd:t=>{cl.rotation.y=t*.01}}}

/* 13 · la Terre et la Lune : 384 400 km les séparent, 30 fois le diamètre de la Terre ; la Lune est 3,7 fois plus petite qu'elle */
const moonTex=tex(1024,512,(x,w,h)=>{x.fillStyle='#a9a6a0';x.fillRect(0,0,w,h);for(let i=0;i<14;i++){x.fillStyle=`rgba(70,70,75,${rnd(.18,.3)})`;x.beginPath();x.ellipse(rnd(0,w),rnd(h*.2,h*.8),rnd(30,110),rnd(20,70),rnd(0,3),0,7);x.fill()}
  for(let i=0;i<700;i++){const cx=rnd(0,w),cy=rnd(0,h),r=Math.pow(Math.random(),3)*22+1.5;x.fillStyle='rgba(60,60,62,.2)';x.beginPath();x.arc(cx,cy,r,0,7);x.fill();x.strokeStyle='rgba(215,212,205,.22)';x.lineWidth=Math.max(.5,r*.12);x.beginPath();x.arc(cx-r*.15,cy-r*.15,r,0,7);x.stroke()}});
function L13(){const g=new THREE.Group(),r=3.844e8/MPU[13],a=150*R,moon=new THREE.Group();
  moon.add(ball(1.737e6/MPU[13],STD({map:moonTex,roughness:.95}),0,0,0,48),dot(0xd8d4cc,7));moon.position.set(Math.cos(a)*r,0,Math.sin(a)*r);
  g.add(moon,orbit(r,0xffffff,.22));
  return{g,a:V3(0,0,0),tags:[[moon,'Lune']],upd:()=>{}}}

/* 14 · système solaire jusqu'à Neptune (30 ua) : orbites réelles ; Soleil et planètes, bien trop petits pour être vus, sont des points */
const sunTex=tex(512,256,(x,w,h)=>{x.fillStyle='#ffb22e';x.fillRect(0,0,w,h);for(let i=0;i<2500;i++){x.fillStyle=Math.random()<.5?`rgba(255,240,140,${rnd(.1,.35)})`:`rgba(220,90,20,${rnd(.08,.25)})`;x.beginPath();x.arc(rnd(0,w),rnd(0,h),rnd(1,6),0,7);x.fill()}});
/* icône du Soleil : boule incandescente à granulation, bord plus sombre, halo (vue à taille fixe, le vrai Soleil n'y faisant qu'une fraction de pixel) */
const sunIcon=tex(128,128,(x,w,h)=>{const c=w/2,R0=w*.36,g=x.createRadialGradient(c,c,0,c,c,w/2);g.addColorStop(0,'rgba(255,190,80,.5)');g.addColorStop(.7,'rgba(255,140,40,.25)');g.addColorStop(1,'rgba(255,120,30,0)');x.fillStyle=g;x.fillRect(0,0,w,h);
  x.save();x.beginPath();x.arc(c,c,R0,0,7);x.clip();const d=x.createRadialGradient(c-6,c-6,0,c,c,R0);d.addColorStop(0,'#FFF4B0');d.addColorStop(.55,'#FFC23A');d.addColorStop(1,'#F06A10');x.fillStyle=d;x.fillRect(0,0,w,h);
  for(let i=0;i<260;i++){x.fillStyle=Math.random()<.5?`rgba(255,240,150,${rnd(.15,.4)})`:`rgba(210,70,10,${rnd(.12,.3)})`;x.beginPath();x.arc(c+rnd(-R0,R0),c+rnd(-R0,R0),rnd(1.5,5),0,7);x.fill()}x.restore()});
function L14(){const g=new THREE.Group(),k=1.496e11/MPU[14],tags=[],sun=new THREE.Group();
  sun.add(ball(6.96e8/MPU[14],new THREE.MeshBasicMaterial({map:sunTex}),0,0,0,32),dot(0xff9a2a,120,.35),dot(0xffffff,46,1,sunIcon,false));g.add(sun);tags.push([sun,'Soleil','up']);
  [['Mercure',.387,0x9a8f86,5,110],['Vénus',.723,0xE8C68A,6,200],['Terre',1,0,0,40],['Mars',1.524,0xC1502E,5,300],['Jupiter',5.203,0xd8b48a,8,20],['Saturne',9.537,0xe8d29c,7,150],['Uranus',19.19,0x9fd8e0,6,250],['Neptune',30.07,0x6f8ff8,6,70]].forEach(([n,a,c,px,an])=>{
    g.add(orbit(a*k,0xffffff,.18));if(!c)return;const d=dot(c,px);d.position.set(a*k*Math.cos(an*R),0,a*k*Math.sin(an*R));g.add(d);if(a>5)tags.push([d,n])});
  /* ceinture d'astéroïdes (2,2–3,3 ua) et ceinture de Kuiper (30–50 ua) */
  const ab=[],kb=[];for(let i=0;i<1400;i++){const a=rnd(0,6.28),r=rnd(2.2,3.3)*k;ab.push(Math.cos(a)*r,rnd(-.03,.03)*k,Math.sin(a)*r)}
  for(let i=0;i<1600;i++){const a=rnd(0,6.28),r=rnd(30,50)*k;kb.push(Math.cos(a)*r,rnd(-2,2)*k,Math.sin(a)*r)}
  g.add(dots(ab,null,1.6,.5,0xb0a090),dots(kb,null,1.4,.3,0x9fb0c8));
  return{g,a:V3(k*Math.cos(40*R),0,k*Math.sin(40*R)),tags,upd:()=>{}}}

/* 15 · étoiles voisines à moins de 12 al, à leur vraie position (distance, ascension droite en h, déclinaison en °) */
const NEAR=[['Proxima du Centaure',4.24,14.5,-62.7,0xff9a6a,4],['Alpha du Centaure',4.37,14.66,-60.8,0xfff0c8,9,1],['Étoile de Barnard',5.96,17.96,4.7,0xff8a5a,4,1],['Wolf 359',7.86,10.94,7,0xff7a5a,3],
  ['Lalande 21185',8.31,11.06,35.97,0xff9a6a,4],['Sirius',8.6,6.75,-16.7,0xcfe0ff,11,1],['Luyten 726-8',8.7,1.65,-17.95,0xff7a5a,3],['Ross 154',9.69,18.83,-23.8,0xff8a5a,3],['Ross 248',10.3,23.7,44.2,0xff7a5a,3],
  ['Epsilon Eridani',10.5,3.55,-9.46,0xffc890,5,1],['Lacaille 9352',10.7,23.1,-35.85,0xff9a6a,4],['Ross 128',11,11.8,.8,0xff8a5a,3],['EZ Aquarii',11.1,22.64,-15.3,0xff7a5a,3],['Procyon',11.46,7.65,5.2,0xfff6e0,9,1],
  ['61 Cygni',11.4,21.12,38.75,0xffb070,5],['Struve 2398',11.5,18.71,59.6,0xff8a5a,3],['Groombridge 34',11.6,.3,44,0xff9a6a,3],['Epsilon Indi',11.9,22.05,-56.8,0xffb070,5],['Tau Ceti',11.9,1.73,-15.9,0xffe6b0,6,1]];
function L15(){const g=new THREE.Group(),k=LY/MPU[15],tags=[],lp=[];
  NEAR.forEach(([n,d,ra,de,c,px,lb])=>{const a=ra*15*R,b=de*R,p=V3(Math.cos(b)*Math.cos(a),Math.sin(b),-Math.cos(b)*Math.sin(a)).multiplyScalar(d*k),s=new THREE.Group();
    s.add(dot(c,px*2.6,.35),dot(c,px));s.position.copy(p);g.add(s);if(lb){tags.push([s,`${n} · ${d.toLocaleString('fr-FR')} al`]);lp.push(0,0,0,p.x,p.y,p.z)}});
  const lg=new THREE.BufferGeometry();lg.setAttribute('position',new THREE.Float32BufferAttribute(lp,3));g.add(new THREE.LineSegments(lg,new THREE.LineBasicMaterial({color:0xffffff,transparent:true,opacity:.14,depthWrite:false})));
  /* entre 12 et 20 al : une centaine d'autres étoiles, surtout des naines rouges */
  const P=[];for(let i=0;i<110;i++){const v=V3(rnd(-1,1),rnd(-1,1),rnd(-1,1)).normalize().multiplyScalar(Math.cbrt(rnd(1728,8000))*k);P.push(v.x,v.y,v.z)}g.add(dots(P,null,3,.55,0xff8a6a));
  return{g,a:V3(0,0,0),tags,upd:()=>{}}}

/* galaxie spirale en nuage d'étoiles */
function spiral(n,R0,arms,{tw=2.3,th=.12,core=0xffe2a8,arm=0xA898FF,size=.06,seed=0}={}){
  const P=[],C=[],cc=new THREE.Color(core),ca=new THREE.Color(arm),pk=new THREE.Color(0xFF7FD0),g=()=>{let s=0;for(let i=0;i<4;i++)s+=Math.random();return(s-2)/1.15};
  for(let i=0;i<n;i++){let x,y,z,c;
    if(i<n*.22){const r=Math.abs(g())*R0*.16;const a=rnd(0,6.28);x=Math.cos(a)*r*1.3;z=Math.sin(a)*r*.8;y=g()*R0*.04;c=cc.clone().multiplyScalar(rnd(.7,1.1))}
    else{const k=i%arms,t=Math.pow(Math.random(),.8),r=R0*(.12+t*.88),a=k*2*Math.PI/arms+Math.log(r/(R0*.12))*tw+g()*.32*(1-t*.4)+seed;x=Math.cos(a)*r;z=Math.sin(a)*r;y=g()*R0*th*.15;
      c=(Math.random()<.1?pk:ca.clone().lerp(cc,(1-t)*.6)).clone().multiplyScalar(rnd(.6,1.1))}
    P.push(x,y,z);C.push(c.r,c.g,c.b)}
  const o=new THREE.Group();o.add(cloud(P,C,size,.9),glow(0x8A6CFF,R0*2.2,.22),glow(core,R0*1.1,.5),glow(core,R0*.35,.85));return o}

/* 16 · la Voie lactée (100 000 al ; le Soleil à 26 000 al du centre, sur un bras) */
function L16(){const g=new THREE.Group();g.add(spiral(32000,9,4,{tw:2.1,size:.07}));
  const r=26000*LY/MPU[16],a=1*2*Math.PI/4+Math.log(r/(9*.12))*2.1;
  return{g,a:V3(Math.cos(a)*r,0,Math.sin(a)*r),upd:()=>{}}}

/* 17 · galaxies voisines (Groupe local) : Andromède à 2,5 millions d'al, deux fois plus grande que la Voie lactée */
function L17(){const g=new THREE.Group(),k=LY/MPU[17],mw=V3(-1.8,0,.7),an=mw.clone().add(V3(.95,.1,-.3).normalize().multiplyScalar(2.54e6*k)),tags=[];
  const m31=spiral(9000,110000*k,2,{tw:1.7,core:0xfff0d0,arm:0xd0c8ff,size:110000*k*.08,seed:1});m31.position.copy(an);m31.rotation.set(1.1,.3,.5);g.add(m31);tags.push([m31,'Andromède']);
  const m33=spiral(3000,30000*k,2,{core:0xffe2a8,arm:0xa8c8ff,size:30000*k*.1,seed:2});m33.position.copy(an).add(V3(.4,-.3,.6).normalize().multiplyScalar(.8e6*k));m33.rotation.set(.4,1,-.6);g.add(m33);tags.push([m33,'Galaxie du Triangle']);
  /* une soixantaine de galaxies naines autour des deux grandes, et au loin d'autres groupes */
  const dw=[],far=[];for(let i=0;i<60;i++){const p=V3(rnd(-1,1),rnd(-1,1),rnd(-1,1)).normalize().multiplyScalar(rnd(.05,1.2)*1e6*k).add(i%2?mw:an);dw.push(p.x,p.y,p.z)}
  for(let i=0;i<1500;i++){const v=V3(rnd(-1,1),rnd(-1,1),rnd(-1,1)).normalize().multiplyScalar(rnd(25,60));far.push(v.x,v.y,v.z)}
  g.add(dots(dw,null,2.6,.7,0xffe6c0),dots(far,null,1.6,.45,0xdcd6ff));
  return{g,a:mw,tags,upd:()=>{}}}

/* 18 · toile cosmique (1 milliard d'al) : les galaxies se rassemblent en amas reliés par des filaments ; le Groupe local est sur l'un d'eux */
function L18(){const g=new THREE.Group(),nodes=[V3(-1,-.1,.4),V3(1,.1,-.4)];
  while(nodes.length<46){const p=V3(rnd(-8,8),rnd(-5,5),rnd(-8,8));if(nodes.every(q=>q.distanceTo(p)>1.4))nodes.push(p)}
  const P=[],C=[],ca=new THREE.Color(0x9fb4ff),cb=new THREE.Color(0xffc890),gs=()=>{let s=0;for(let i=0;i<4;i++)s+=Math.random();return(s-2)/1.15},
    push=(p,k)=>{P.push(p.x,p.y,p.z);const c=ca.clone().lerp(cb,Math.random()*.6).multiplyScalar(k);C.push(c.r,c.g,c.b)},
    fil=(a,b)=>{const d=a.distanceTo(b);for(let n=0;n<d*260;n++)push(a.clone().lerp(b,Math.random()).add(V3(gs(),gs(),gs()).multiplyScalar(.12)),rnd(.4,.9))},E=new Set(['0-1']);
  fil(nodes[0],nodes[1]);fil(nodes[0],nodes[1]);
  nodes.forEach((a,i)=>nodes.map((b,j)=>[b.distanceTo(a),j]).sort((x,y)=>x[0]-y[0]).slice(1,4).forEach(([d,j])=>{const key=Math.min(i,j)+'-'+Math.max(i,j);if(E.has(key)||d>5)return;E.add(key);fil(a,nodes[j])}));
  nodes.forEach((a,i)=>{const n=i<2?120:rnd(150,500);for(let k=0;k<n;k++)push(a.clone().add(V3(gs(),gs(),gs()).multiplyScalar(.22)),rnd(.6,1.2))});
  g.add(cloud(P,C,.035,.85));
  return{g,a:V3(0,0,0),upd:()=>{}}}
