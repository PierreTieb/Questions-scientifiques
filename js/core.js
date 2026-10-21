/* Base commune : rendu Three.js, éclairage studio, matières et outils de modélisation */
const R=Math.PI/180,$=i=>document.getElementById(i),cl=t=>Math.max(0,Math.min(1,t)),sm=(a,b,x)=>{const t=cl((x-a)/(b-a));return t*t*(3-2*t)},
  lerp=(a,b,t)=>a+(b-a)*t,rnd=(a,b)=>a+Math.random()*(b-a);
const cv=$('c'),rd=new THREE.WebGLRenderer({canvas:cv,antialias:true});
const scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(45,1,.5,1e5);
let W,H;function rs(){W=innerWidth;H=innerHeight;rd.setPixelRatio(Math.min(2,devicePixelRatio));rd.setSize(W,H);cam.aspect=W/H;cam.updateProjectionMatrix()}rs();addEventListener('resize',rs);

/* lumière : ciel + soleil + contre-jour, et environnement « studio » pour les reflets */
const hemi=new THREE.HemisphereLight(0xeaf2ff,0x2a2030,.75),key=new THREE.DirectionalLight(0xfff4e6,1.15),rim=new THREE.DirectionalLight(0x9fc4ff,.55);
key.position.set(5,8,7);rim.position.set(-6,3,-6);scene.add(hemi,key,rim);
const tex=(w,h,f,rep)=>{const c=document.createElement('canvas');c.width=w;c.height=h;f(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.anisotropy=8;if(rep)t.wrapS=t.wrapT=THREE.RepeatWrapping;return t};
(()=>{const t=tex(512,256,(x,w,h)=>{const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'#ffffff');g.addColorStop(.45,'#c9d4e6');g.addColorStop(.55,'#4a4f63');g.addColorStop(1,'#14141c');
  x.fillStyle=g;x.fillRect(0,0,w,h);x.fillStyle='#fff';x.fillRect(w*.1,h*.12,w*.16,h*.2);x.fillRect(w*.62,h*.18,w*.08,h*.14);x.fillStyle='rgba(255,236,210,.8)';x.fillRect(w*.38,h*.06,w*.18,h*.07)});
  t.mapping=THREE.EquirectangularReflectionMapping;scene.environment=new THREE.PMREMGenerator(rd).fromEquirectangular(t).texture})();

const STD=o=>new THREE.MeshStandardMaterial(o),PHY=o=>new THREE.MeshPhysicalMaterial(o);
const gloss=(c,o={})=>PHY(Object.assign({color:c,roughness:.35,metalness:0,clearcoat:.6,clearcoatRoughness:.2,envMapIntensity:.55},o));
const matte=(c,o={})=>STD(Object.assign({color:c,roughness:.75,envMapIntensity:.35},o));
const glass=(c,op=.3,o={})=>PHY(Object.assign({color:c,roughness:.15,metalness:0,transparent:true,opacity:op,depthWrite:false,side:THREE.DoubleSide,clearcoat:1},o));
const mesh=(g,m,x=0,y=0,z=0)=>{const o=new THREE.Mesh(g,m);o.position.set(x,y,z);return o};
const ball=(r,m,x=0,y=0,z=0,s=32)=>mesh(new THREE.SphereGeometry(r,s,Math.max(8,s*.6|0)),m,x,y,z);
const V3=(x,y,z)=>new THREE.Vector3(x,y,z);
/* tube le long d'une courbe ; rf(t) module le rayon (0..1 le long du tube) */
function tube(pts,r,m,{closed=false,seg=120,rs=16,rf=null}={}){
  const cu=new THREE.CatmullRomCurve3(pts,closed),g=new THREE.TubeGeometry(cu,seg,r,rs,closed);
  if(rf){const p=g.attributes.position,n=new THREE.Vector3(),c=new THREE.Vector3();for(let i=0;i<=seg;i++){const t=i/seg,k=rf(t);cu.getPointAt(Math.min(t,1),c);
    for(let j=0;j<=rs;j++){const id=i*(rs+1)+j;n.fromBufferAttribute(p,id).sub(c).multiplyScalar(k).add(c);p.setXYZ(id,n.x,n.y,n.z)}}g.computeVertexNormals()}
  return new THREE.Mesh(g,m)}
/* cylindre entre deux points */
function rod(a,b,r,m,s=14){const d=b.clone().sub(a),o=mesh(new THREE.CylinderGeometry(r,r,d.length(),s),m);o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(V3(0,1,0),d.normalize());return o}
/* ellipsoïde */
const ell=(rx,ry,rz,m,x=0,y=0,z=0)=>{const o=ball(1,m,x,y,z,40);o.scale.set(rx,ry,rz);return o};
/* points d'une sphère de Fibonacci */
const fib=(n,r=1)=>Array.from({length:n},(_,i)=>{const y=1-2*(i+.5)/n,q=Math.sqrt(1-y*y),a=i*2.39996;return V3(Math.cos(a)*q*r,y*r,Math.sin(a)*q*r)});
/* halo lumineux (sprite additif) */
const glowTex=tex(128,128,x=>{const g=x.createRadialGradient(64,64,0,64,64,64);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.25,'rgba(255,255,255,.55)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,128,128)});
const glow=(c,s,op=1)=>{const o=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,color:c,blending:THREE.AdditiveBlending,depthWrite:false,transparent:true,opacity:op}));o.scale.setScalar(s);return o};
/* nuage de points (étoiles, particules) */
const dotTex=tex(64,64,x=>{const g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.4,'rgba(255,255,255,.6)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,64,64)});
function cloud(pos,col,size,op=1,add=true){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));if(col)g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));
  const p=new THREE.Points(g,new THREE.PointsMaterial({size,map:dotTex,vertexColors:!!col,transparent:true,opacity:op,depthWrite:false,blending:add?THREE.AdditiveBlending:THREE.NormalBlending,sizeAttenuation:true}));p.frustumCulled=false;return p}
/* points de taille fixe à l'écran (en pixels) quelle que soit l'échelle : électrons, planètes, étoiles, repères */
function dots(pos,col,px,op=1,c=0xffffff){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));if(col)g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));
  const p=new THREE.Points(g,new THREE.PointsMaterial({size:px,map:dotTex,color:c,vertexColors:!!col,transparent:true,opacity:op,depthWrite:false,blending:THREE.AdditiveBlending,sizeAttenuation:false}));p.frustumCulled=false;return p}
const dot=(c,px,op=1)=>dots([0,0,0],null,px,op,c);
/* cercle d'un trait fin dans le plan xz (orbites) ; beaucoup de segments pour qu'il passe bien par l'objet même très agrandi */
function orbit(r,c,op=.3,n=2048){const P=[];for(let i=0;i<n;i++){const a=i/n*2*Math.PI;P.push(Math.cos(a)*r,0,Math.sin(a)*r)}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));
  const o=new THREE.LineLoop(g,new THREE.LineBasicMaterial({color:c,transparent:true,opacity:op,depthWrite:false}));o.frustumCulled=false;return o}
/* anneau des repères « tu viens d'ici » */
const ringTex=tex(64,64,x=>{x.strokeStyle='#fff';x.lineWidth=5;x.beginPath();x.arc(32,32,25,0,7);x.stroke();x.fillStyle='#fff';x.beginPath();x.arc(32,32,6,0,7);x.fill()});
/* sols emboîtés posés au même niveau : ils sont dessinés après les objets opaques, sans écrire de profondeur, du plus grand au plus petit
   (ordre k : le sol de l'étage le plus petit a le k le plus grand et se peint par-dessus les autres) */
const soilM=(o,k)=>{const m=matte(0xffffff,Object.assign({roughness:1,transparent:true,depthWrite:false},o));m.userData.ro=k-20;return m};

/* Échelle réelle : combien de mètres vaut 1 unité de modèle à chaque étage (chaque modèle est cadré à cette échelle).
   Noyau de carbone (rayon 2,7 fm), électrons externes à 70 pm, liaison C–O de 143 pm, ADN (0,34 nm par paire de bases), chromosome de ~3 µm,
   cellule de 20 µm, micro-organisme de 200 µm, fourmi de 5 mm, humain de 1,75 m, maison (1 u = 3 m), village (100 m), France (100 km), Terre (rayon 6 371 km),
   orbite de la Lune (1 u = 100 000 km), orbite de Neptune (30 ua), étoiles proches, Voie lactée (100 000 al), Groupe local (Andromède à 2,5 millions d'al), toile cosmique. */
const LY=9.461e15,MPU=[2.7e-15/1.8,70e-12/2.35,143e-12/2.065,.34e-9/.36,4.5e-7,10e-6/3.4,2e-4/10,5e-3/6.4,1.75/6.35,3,100,1e5,6.371e6/2.6,1e8,30.07*1.496e11/6.5,2.5e16,5e4*LY/9,2.54e6*LY/4.5,1e8*LY];
