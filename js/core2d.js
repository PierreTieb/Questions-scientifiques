/* Base commune du rendu 2D : canevas, couleurs et petits outils de dessin.
   Chaque étage dessine en « unités » : à sa station, la plus petite dimension de l'écran fait environ 10 unités. */
const $=i=>document.getElementById(i),cl=t=>Math.max(0,Math.min(1,t)),sm=(a,b,x)=>{const t=cl((x-a)/(b-a));return t*t*(3-2*t)},
  lerp=(a,b,t)=>a+(b-a)*t,rnd=(a,b)=>a+Math.random()*(b-a),TAU=2*Math.PI,R=Math.PI/180,LY=9.461e15,AU=1.496e11;
const cv=$('c'),cx=cv.getContext('2d');
/* PXU : taille d'un pixel en unités de l'étage en cours de dessin (mise à jour par le moteur) */
let PXU=1;

/* couleurs */
const rgb=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)),
  mix=(a,b,t)=>{const B=rgb(b);return'#'+rgb(a).map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('')},
  rgba=(h,a)=>`rgba(${rgb(h)},${a})`;

/* boule éclairée en haut à gauche (teintes calculées une fois par couleur) ; à quelques pixels, un simple disque suffit */
const SH=new Map();
function ball(c,x,y,r,col){if(r<3*PXU){disc(c,x,y,r,col);return}let s=SH.get(col);if(!s)SH.set(col,s=[mix(col,'#ffffff',.6),col,mix(col,'#000000',.4)]);
  const g=c.createRadialGradient(x-r*.35,y-r*.4,r*.05,x,y,r);g.addColorStop(0,s[0]);g.addColorStop(.45,s[1]);g.addColorStop(1,s[2]);
  c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,TAU);c.fill()}
/* ellipse éclairée de la même façon, tournée de a */
function egg(c,x,y,rx,ry,col,a=0){c.save();c.translate(x,y);c.rotate(a);c.scale(rx,ry);const p=PXU;PXU/=Math.min(rx,ry);ball(c,0,0,1,col);PXU=p;c.restore()}
const disc=(c,x,y,r,f)=>{c.fillStyle=f;c.beginPath();c.arc(x,y,r,0,TAU);c.fill()};
/* halo lumineux */
function glow(c,x,y,r,col,a=1){const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,rgba(col,a));g.addColorStop(.25,rgba(col,a*.5));g.addColorStop(1,rgba(col,0));c.fillStyle=g;c.fillRect(x-r,y-r,2*r,2*r)}

/* chemins préparés une fois (Path2D) et redessinés à chaque image, quelle que soit l'échelle */
const path=f=>{const p=new Path2D();f(p);return p};
const oval=(p,x,y,rx,ry,a=0)=>{p.moveTo(x+rx*Math.cos(a),y+rx*Math.sin(a));p.ellipse(x,y,rx,ry,a,0,TAU)};
/* plusieurs disques dans un seul chemin : [x,y,r, x,y,r, ...] */
const blobs=L=>path(p=>{for(let i=0;i<L.length;i+=3){p.moveTo(L[i]+L[i+2],L[i+1]);p.arc(L[i],L[i+1],L[i+2],0,TAU)}});
const rrect=(p,x,y,w,h,r)=>{p.moveTo(x+r,y);p.arcTo(x+w,y,x+w,y+h,r);p.arcTo(x+w,y+h,x,y+h,r);p.arcTo(x,y+h,x,y,r);p.arcTo(x,y,x+w,y,r);p.closePath()};
/* ligne lissée passant au milieu des points [[x,y],...] */
function curve(p,P){p.moveTo(P[0][0],P[0][1]);for(let i=1;i<P.length-1;i++)p.quadraticCurveTo(P[i][0],P[i][1],(P[i][0]+P[i+1][0])/2,(P[i][1]+P[i+1][1])/2);const l=P[P.length-1];p.lineTo(l[0],l[1])}
const stroke=(c,p,col,w)=>{c.strokeStyle=col;c.lineWidth=w;c.stroke(p)},fill=(c,p,col)=>{c.fillStyle=col;c.fill(p)};
/* image préparée hors écran (galaxies, toile cosmique) */
const off=(w,h,f)=>{const c=document.createElement('canvas');c.width=w;c.height=h;f(c.getContext('2d'),w,h);return c};
const gauss=()=>{let s=0;for(let i=0;i<4;i++)s+=Math.random();return(s-2)/1.15};
