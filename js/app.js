/* Voyage à l'échelle réelle : à l'étage i, 1 unité de modèle vaut MPU[i] mètres.
   u = log10 du nombre de mètres par unité de scène. Le zoom se fait toujours en ligne droite vers le noyau d'atome, qui reste au centre de l'écran.
   On ne dessine que les étages utiles, mis à l'échelle autour de ce point (évite les très grands nombres qui feraient trembler l'image).
   r : rayon de l'objet (en unités du modèle), pour savoir quand il ne fait plus que quelques pixels et devient un repère ;
   out : décades de dézoom pendant lesquelles il s'efface ; fin : fraction du trajet depuis l'étage précédent où il apparaît
   (négative = déjà visible en arrière-plan à l'étage précédent) ; sol : fait partie du paysage visible dès la fourmi ;
   fr : recul de la caméra à la station (en décades) pour cadrer l'objet entier autour du noyau ; mk : nom de son repère. */
const LV=[
  {n:'Noyau d’atome',b:L0,bg:'#0b1030',r:1.8,out:[1.6,2]},{n:'Atome',b:L1,bg:'#0d1436',r:2.35,out:[.12,.3]},{n:'Molécule',b:L2,bg:'#101a3e',r:2.5,out:[.55,.85]},
  {n:'ADN',b:L3,bg:'#0e2a3c',r:9,out:[1.6,2.1]},{n:'Chromosome',b:L4,bg:'#1b1636',r:3.2,out:[.45,.75],fr:.05},{n:'Cellule',b:L5,bg:'#0f2e33',r:3.4,out:[.5,.8]},
  {n:'Micro-organisme',b:L6,bg:'#1d2a1e',r:5,out:[2,2.5]},{n:'Fourmi',b:L7,bg:'#bfdcef',r:3.2,out:[2.2,2.7],fr:.05},{n:'Humain',b:L8,bg:'#9fd0f0',r:3.2,out:[2.1,2.6],sol:1,fr:.2},
  {n:'Maison',b:L9,bg:'#a6d4f2',r:2.2,out:[1.9,2.4],sol:1,fr:.12},{n:'Village',b:L10,bg:'#a9d2ee',r:7,out:[1.6,2.1],sol:1},
  {n:'France',b:L11,bg:'#16264a',r:6,out:[.6,1],sol:1},{n:'Terre',b:L12,bg:'#04060e',r:2.6,out:[2.2,2.6],fin:[-.6,-.3],fr:.2},
  {n:'Terre et Lune',b:L13,bg:'#020308',r:3.85,out:[1.3,1.7],mk:'Terre'},{n:'Système solaire',b:L14,bg:'#020308',r:9,out:[1.4,1.9],mk:'Soleil'},
  {n:'Étoiles voisines',b:L15,bg:'#020207',r:5,out:[1,1.5],mk:'Soleil'},{n:'Voie lactée',b:L16,bg:'#010104',r:9,out:[2.1,2.5],fr:.23},
  {n:'Galaxies voisines',b:L17,bg:'#000003',r:5,out:[1.5,2],mk:'Groupe local',fr:.1},{n:'Toile cosmique',b:L18,bg:'#000002'}];
/* LM : échelle réelle de chaque étage ; M : position de sa station sur le trajet */
const N=LV.length,LM=MPU.map(Math.log10),M=LM.map((m,i)=>m+(LV[i].fr||0)),BG=LV.map(v=>new THREE.Color(v.bg)),TAN=Math.tan(22.5*R);

/* Trajet : la molette fait avancer p. Chaque saut entre deux étages a une longueur qui grandit avec le nombre de décades à franchir,
   et l'échelle y suit une courbe douce : plus lente près des objets, plus rapide au milieu du vide, sans jamais s'arrêter net.
   À pleine vitesse (VMAX unités de p par seconde), le voyage complet dure ~50 s. */
const PS=[0];for(let i=0;i<N-1;i++)PS[i+1]=PS[i]+.7+.45*(M[i+1]-M[i]);const PMAX=PS[N-1],VMAX=.6,KLIN=.3;
const S3=t=>t*t*(3-2*t);
function uOf(p){p=Math.max(0,Math.min(PMAX,p));let i=0;while(i<N-2&&p>=PS[i+1])i++;const t=(p-PS[i])/(PS[i+1]-PS[i]);return M[i]+(M[i+1]-M[i])*((1-KLIN)*S3(t)+KLIN*t)}
function pOf(u){let i=0;while(i<N-2&&u>=M[i+1])i++;let a=PS[i],b=PS[i+1];for(let j=0;j<40;j++){const m=(a+b)/2;if(uOf(m)<u)a=m;else b=m}return(a+b)/2}
/* voyage vers un étage choisi sur la jauge : départ très lent, arrivée très amortie (vitesse en x²(1-x)⁴) */
const B=x=>105*x*x*x*(1/3-x+1.2*x*x-2/3*x*x*x+x*x*x*x/7);

/* fondu d'un ensemble de matières */
function mats(g,skip){const s=new Set(),walk=o=>{if(o===skip)return;if(o.material)(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>s.add(m));o.children.forEach(walk)};walk(g);
  return{w:-1,m:[...s].map(m=>{m.userData.o0=m.opacity;m.userData.t0=m.transparent;return m})}}
function fade(F,w){if(F.w===w)return;F.w=w;F.m.forEach(m=>{if(m.uniforms&&m.uniforms.uOp){m.uniforms.uOp.value=w;return}
  const tr=w<.999||m.userData.t0;if(m.transparent!==tr){m.transparent=tr;m.needsUpdate=true}m.opacity=m.userData.o0*w})}

/* fond étoilé autour de la caméra, de la Terre jusqu'aux étoiles voisines */
const sky=(()=>{const P=[],C=[];for(let i=0;i<3000;i++){const v=V3(rnd(-1,1),rnd(-1,1),rnd(-1,1)).normalize().multiplyScalar(300),k=rnd(.4,1),t=Math.random();P.push(v.x,v.y,v.z);C.push(k*(t<.2?.8:1),k*.95,k*(t>.85?.75:1))}
  const o=cloud(P,C,1.6,1);o.material.sizeAttenuation=false;o.material.size=2;return o})();scene.add(sky);

/* étiquettes HTML posées sur des objets 3D */
const TG=$('tags'),tmp=V3(0,0,0);
function label(t,cls){const e=document.createElement('div');e.className='tag'+(cls?' '+cls:'');e.textContent=t;e.style.opacity=0;TG.appendChild(e);return e}
function place(e,o,w){if(w<.02){if(e.style.opacity!=='0')e.style.opacity=0;return}o.getWorldPosition(tmp).project(cam);
  if(tmp.z>1||Math.abs(tmp.x)>1.1||Math.abs(tmp.y)>1.1){e.style.opacity=0;return}e.style.opacity=w.toFixed(2);e.style.transform=`translate(${((tmp.x+1)/2*W).toFixed(1)}px,${((1-tmp.y)/2*H).toFixed(1)}px)`}

let LS=null,u=M[0],p=0,pT=0,vel=0,fl=null,yaw=.7,pitch=.32,t0=performance.now(),tp=0,run=0;const D=12;
function build(){if(LS)return;LS=LV.map((v,i)=>{const o=v.b();o.g.visible=false;scene.add(o.g);
  /* tailles des nuages de points proportionnelles à l'échelle de l'étage */
  const pm=[];o.g.traverse(q=>{if(q.isPoints&&q.material.sizeAttenuation)pm.push([q.material,q.material.size]);if(q.isMesh&&q.material.userData&&q.material.userData.ro!==undefined)q.renderOrder=q.material.userData.ro});
  /* repère de l'objet quand il devient trop petit : anneau jaune et nom */
  const mk=new THREE.Points(new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute([0,0,0],3)),new THREE.PointsMaterial({size:22,map:ringTex,color:0xFFD84D,transparent:true,depthTest:false,depthWrite:false,sizeAttenuation:false}));
  mk.renderOrder=20;mk.frustumCulled=false;mk.visible=false;scene.add(mk);
  return Object.assign(o,{i,pm,main:o.g.children.filter(c=>c!==o.deco),fm:mats(o.g,o.deco),fd:o.deco?mats(o.deco):null,c:o.c||V3(0,0,0),mk,ml:i<N-1?label(v.mk||v.n,'chain'):null,tg:(o.tags||[]).map(([ob,t,c])=>({o:ob,e:label(t,c)}))})})}

/* le sol (fourmi → France) : la caméra ne passe pas dessous */
const onGround=()=>u>M[7]-.5&&u<M[11]+.3;

function frame(){if(!run)return;requestAnimationFrame(frame);
  const now=performance.now(),dt=Math.min(.05,(now-tp)/1000),t=(now-t0)/1000;tp=now;
  if(fl){fl.t+=dt;const x=Math.min(1,fl.t/fl.T);u=fl.u0+(fl.u1-fl.u0)*B(x);if(x>=1){u=fl.u1;p=pT=PS[fl.j];fl=null}else p=pT=pOf(u);vel=0}
  else{const vT=Math.max(-VMAX,Math.min(VMAX,(pT-p)*2.5));vel+=(vT-vel)*Math.min(1,dt*3);p=Math.max(0,Math.min(PMAX,p+vel*dt));u=uOf(p)}
  let k=0;while(k<N-2&&u>=M[k+1])k++;
  /* positions emboîtées à partir du noyau, placé au centre */
  const sig=i=>Math.pow(10,LM[i]-u),P=[V3(0,0,0)];
  for(let i=1;i<N;i++)P[i]=P[i-1].clone().sub(LS[i].a.clone().multiplyScalar(sig(i)));
  /* en portrait, on recule la caméra pour garder toute la largeur du modèle */
  const dc=D*Math.max(1,.85/(W/H)),ppu=H/(2*dc*TAN),wk=[],tags=[],fsol=sm(M[7]-.5,M[7]-.2,u);
  LS.forEach((L,i)=>{const v=LV[i],s=sig(i),d=u-LM[i],fi=v.fin||[.25,.65],
    /* un sol trop agrandi (plus de ~2 000 fois) n'est plus dessiné : ses coordonnées géantes fausseraient la profondeur */
    fin=v.sol?fsol*(1-sm(3.2,3.5,Math.log10(s))):i?sm(fi[0],fi[1],(u-M[i-1])/(M[i]-M[i-1])):1,wm=fin*(v.out?1-sm(v.out[0],v.out[1],d):1),wd=L.deco?fin*(i<N-1?1-sm(.25,.65,(u-M[i])/(M[i+1]-M[i])):1):0;
    L.g.visible=wm>.004||wd>.004;
    if(L.g.visible){L.g.position.copy(P[i]);L.g.scale.setScalar(s);L.main.forEach(o=>o.visible=wm>.004);fade(L.fm,wm);if(L.deco){L.deco.visible=wd>.004;fade(L.fd,wd)}
      L.pm.forEach(([m,s0])=>m.size=s0*s);L.upd(t)}
    const wt=L.g.visible?wm*sm(-.5,-.1,d)*(v.out?1-sm(v.out[0]-.3,v.out[0],d):1):0;L.tg.forEach(T=>tags.push([T.e,T.o,wt]));
    wk[i]=i<N-1?(1-sm(4,9,v.r*s*ppu))*sm(.05,.3,d)*(1-sm(M[i+1]+.1,M[i+1]+.5,u)):0});
  /* un seul repère à la fois dans une même lignée : celui du parent l'emporte */
  for(let i=N-2;i>=0;i--){const L=LS[i],w=wk[i]*(1-(wk[i+1]||0));L.mk.visible=w>.01;if(L.mk.visible){L.mk.position.copy(P[i]).addScaledVector(L.c,sig(i));L.mk.material.opacity=w}tags.push([L.ml,L.mk,w])}
  /* fond : couleur de l'étage, étoiles autour de la caméra dans l'espace proche */
  scene.background=BG[k].clone().lerp(BG[k+1],sm(.3,.8,(u-M[k])/(M[k+1]-M[k])));
  const sw=sm(5.5,6.2,u)*(1-sm(18,19.3,u));sky.visible=sw>.01;sky.material.opacity=sw;sky.position.copy(cam.position);
  hemi.intensity=lerp(.75,.35,sm(4.5,6.2,u));
  if(onGround()&&pitch<.06)pitch+=(.06-pitch)*.1;
  yaw+=.0009;cam.position.set(Math.sin(yaw)*Math.cos(pitch)*dc,Math.sin(pitch)*dc,Math.cos(yaw)*Math.cos(pitch)*dc);cam.lookAt(0,0,0);
  rd.render(scene,cam);tags.forEach(([el,o,w])=>place(el,o,w));scaleBar(dc);ui()}

/* échelle : segment de longueur fixe dont la valeur est la puissance de 10 la plus proche ;
   du micro-organisme à la Terre on parle en mm, cm, m et km, ailleurs en puissances de 10 de mètres */
const BAR=110;let lastS='';
function fmtL(pw,hu){if(!hu)return pw?`10<sup>${pw<0?'−':''}${Math.abs(pw)}</sup> m`:'1 m';const v=Math.pow(10,pw),f=n=>n.toLocaleString('fr-FR',{maximumFractionDigits:3});
  return pw<-2?f(v*1e3)+' mm':pw<0?f(v*100)+' cm':pw<3?f(v)+' m':f(v/1e3)+' km'}
function scaleBar(dc){const pw=Math.round(Math.log10(BAR*2*dc*TAN*Math.pow(10,u)/H)),s=fmtL(pw,u>=M[6]-.01&&u<=M[12]+.01);if(s!==lastS){lastS=s;$('scale-v').innerHTML=s}}

/* interface : nom de l'étage le plus proche, jauge des échelles */
let lastI=-1;
function ui(){let i=0;for(let j=1;j<N;j++)if(Math.abs(PS[j]-p)<Math.abs(PS[i]-p))i=j;if(i!=lastI){lastI=i;$('lvl').textContent=LV[i].n;$('lvl').classList.remove('pop');void $('lvl').offsetWidth;$('lvl').classList.add('pop');
  [...$('gauge').children].forEach((d,j)=>d.classList.toggle('on',N-1-j==i))}}
$('gauge').innerHTML=LV.map((v,i)=>`<button type="button" data-i="${i}" aria-label="${v.n}"><span>${v.n}</span></button>`).reverse().join('');
$('gauge').onclick=e=>{const b=e.target.closest('button');if(!b)return;const j=+b.dataset.i,du=Math.abs(M[j]-u);if(du<1e-3)return;
  fl={u0:u,u1:M[j],t:0,T:2.2+3.2*Math.sqrt(du),j};$('hint').classList.add('off')};

/* commandes : molette / pincement = zoom ; glisser = tourner autour du centre de l'écran (le noyau) */
const Pt=new Map();let pd=0;
const zoom=d=>{if(fl){fl=null;p=pT=pOf(u);vel=0}pT=Math.max(0,Math.min(PMAX,Math.max(p-1,Math.min(p+1,pT+d))));$('hint').classList.add('off')};
cv.addEventListener('wheel',e=>{e.preventDefault();const dy=e.deltaY*(e.deltaMode==1?33:e.deltaMode==2?400:1);zoom(Math.max(-120,Math.min(120,dy))*.0015)},{passive:false});
cv.onpointerdown=e=>{Pt.set(e.pointerId,[e.clientX,e.clientY]);cv.setPointerCapture(e.pointerId);if(Pt.size==2){const a=[...Pt.values()];pd=Math.hypot(a[0][0]-a[1][0],a[0][1]-a[1][1])}};
cv.onpointermove=e=>{const o=Pt.get(e.pointerId);if(!o)return;
  if(Pt.size==2){Pt.set(e.pointerId,[e.clientX,e.clientY]);const a=[...Pt.values()],d=Math.hypot(a[0][0]-a[1][0],a[0][1]-a[1][1]);if(pd)zoom(Math.log(pd/d)*1.2);pd=d;return}
  yaw-=(e.clientX-o[0])*.006;pitch=Math.max(onGround()?.06:-1.3,Math.min(1.3,pitch+(e.clientY-o[1])*.005));Pt.set(e.pointerId,[e.clientX,e.clientY])};
cv.onpointerup=cv.onpointercancel=e=>{Pt.delete(e.pointerId);pd=0};
addEventListener('keydown',e=>{if($('ui').hidden)return;if(e.key=='-'||e.key=='ArrowDown')zoom(.25);if(e.key=='+'||e.key=='ArrowUp')zoom(-.25)});

$('go').onclick=()=>{$('start').hidden=true;$('ui').hidden=false;$('load').hidden=false;
  setTimeout(()=>{build();$('load').hidden=true;u=M[0];p=pT=vel=0;fl=null;tp=performance.now();if(!run){run=1;frame()}},30)};
$('quit').onclick=()=>{run=0;$('ui').hidden=true;$('start').hidden=false;$('hint').classList.remove('off')};
