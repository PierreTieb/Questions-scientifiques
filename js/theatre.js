/* « C'est quoi l'orage ? » : une leçon mise en scène dans un petit théâtre.
   Un grand rideau rouge s'ouvre sur une scène en planches ; les décors (dessins en 2D) entrent, avancent et reculent sur scène,
   et un nuage blanc, sur le côté, raconte dans des bulles de BD. La scène est dessinée dans un repère fixe de 1200 × 680, mis à l'échelle de l'écran. */
(()=>{const $=id=>document.getElementById(id),SW=1200,SH=680,th=$('theatre'),stage=$('th-stage');

/* ---------- décors ---------- */
/* nuage gris en carton, pendu aux cintres par deux cordes ; de temps en temps, des éclairs l'illuminent de l'intérieur (décor en réserve pour la suite) */
const CL='M40 150C10 150 4 108 36 98C30 62 74 46 100 66C110 22 170 10 194 50C214 22 270 28 276 72C312 66 340 96 324 126C350 140 338 172 306 170H48Z';
const greyCloud=`<svg viewBox="0 0 360 520" class="th-svg" aria-hidden="true">
  <defs><linearGradient id="tc-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9aa3b0"/><stop offset=".6" stop-color="#7d8794"/><stop offset="1" stop-color="#5f6874"/></linearGradient>
    <radialGradient id="tc-f"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".35" stop-color="#e6ecff" stop-opacity=".6"/><stop offset="1" stop-color="#c8d4ff" stop-opacity="0"/></radialGradient>
    <clipPath id="tc-clip"><path d="${CL}"/></clipPath></defs>
  <g stroke="#c9b48a" stroke-width="3"><path d="M110 0V392"/><path d="M250 0V392"/></g><g stroke="#8a7550" stroke-width="1" stroke-dasharray="3 5"><path d="M110 0V392"/><path d="M250 0V392"/></g>
  <g transform="translate(0 340)">
    <path d="${CL}" fill="#4c5560" transform="translate(6 7)"/>
    <path d="${CL}" fill="url(#tc-g)" stroke="#525b66" stroke-width="3"/>
    <g clip-path="url(#tc-clip)" class="th-flash"><circle class="f1" cx="130" cy="96" r="120" fill="url(#tc-f)"/><circle class="f2" cx="246" cy="110" r="110" fill="url(#tc-f)"/></g>
    <path d="M70 92C86 70 110 72 118 84M168 52C190 40 214 52 218 70M262 92C280 88 298 98 302 112" fill="none" stroke="#b9c1cc" stroke-width="5" stroke-linecap="round" opacity=".7"/>
    <circle cx="110" cy="52" r="7" fill="#d8c79c" stroke="#8a7550" stroke-width="2"/><circle cx="250" cy="52" r="7" fill="#d8c79c" stroke="#8a7550" stroke-width="2"/>
  </g></svg>`;
/* le narrateur : un nuage blanc jovial */
const narrator=`<svg viewBox="0 0 240 200" class="th-svg" aria-hidden="true">
  <defs><radialGradient id="tn-g" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#ffffff"/><stop offset=".7" stop-color="#f2f5fb"/><stop offset="1" stop-color="#d6deeb"/></radialGradient></defs>
  <ellipse cx="120" cy="186" rx="58" ry="6" fill="#000" opacity=".22"/>
  <path d="M52 160C14 160 8 112 44 104C38 64 86 46 112 70C124 26 190 22 204 66C236 64 250 106 226 126C246 148 226 168 200 164H60Z" fill="url(#tn-g)" stroke="#b9c4d6" stroke-width="3"/>
  <ellipse cx="96" cy="112" rx="9" ry="12" fill="#2b3442"/><ellipse cx="150" cy="112" rx="9" ry="12" fill="#2b3442"/><circle cx="99" cy="107" r="3.2" fill="#fff"/><circle cx="153" cy="107" r="3.2" fill="#fff"/>
  <ellipse cx="76" cy="134" rx="13" ry="8" fill="#ff9aa8" opacity=".55"/><ellipse cx="172" cy="134" rx="13" ry="8" fill="#ff9aa8" opacity=".55"/>
  <path d="M104 134Q123 156 142 134Q123 146 104 134Z" fill="#2b3442" stroke="#2b3442" stroke-width="3" stroke-linejoin="round"/>
  <path d="M86 92Q96 84 106 90M140 90Q150 84 160 92" fill="none" stroke="#2b3442" stroke-width="3.5" stroke-linecap="round"/>
  <g class="th-arm"><path d="M222 128Q248 112 246 86" fill="none" stroke="#b9c4d6" stroke-width="12" stroke-linecap="round"/><path d="M222 128Q248 112 246 86" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round"/></g></svg>`;

/* ---------- décors des étapes : tous dans le repère de la scène, à droite du narrateur (x de 640 à 1095) ---------- */
const flake=(x,y,k)=>`<g class="flk" style="animation-delay:-${(k*.77%6).toFixed(2)}s"><g transform="translate(${x} ${y})" stroke="#fff" stroke-width="2.2" stroke-linecap="round">${[0,60,120].map(a=>`<path d="M-8 0H8" transform="rotate(${a})"/>`).join('')}</g></g>`;
/* étape 1 : l'air froid du haut, panneau bleu pendu aux cintres, où tombent des flocons */
const coldAir=`<svg viewBox="0 0 455 270" class="th-svg" aria-hidden="true">
  <defs><linearGradient id="ta-c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e2f1ff"/><stop offset="1" stop-color="#93c4f0"/></linearGradient>
    <clipPath id="ta-cc"><rect x="8" y="120" width="440" height="135" rx="34"/></clipPath></defs>
  <g stroke="#c9b48a" stroke-width="3"><path d="M110 -800V128"/><path d="M345 -800V128"/></g>
  <rect x="14" y="128" width="440" height="135" rx="34" fill="#5d86ad"/>
  <rect x="8" y="120" width="440" height="135" rx="34" fill="url(#ta-c)" stroke="#6f9cc6" stroke-width="3"/>
  <g clip-path="url(#ta-cc)">${[[40,0],[90,1],[150,2],[205,3],[260,4],[320,5],[380,6],[425,7],[65,8],[180,9],[290,10],[400,11]].map(([x,k])=>flake(x,108,k)).join('')}</g>
  <rect x="112" y="166" width="232" height="44" rx="12" fill="#fff" opacity=".88"/><text x="228" y="196" text-anchor="middle" class="ta-lbl" fill="#1f4f7a">Air froid · −20 °C</text>
  <circle cx="110" cy="130" r="7" fill="#d8c79c" stroke="#8a7550" stroke-width="2"/><circle cx="345" cy="130" r="7" fill="#d8c79c" stroke="#8a7550" stroke-width="2"/></svg>`;
/* étape 1 : l'air chaud près du sol, panneau orange posé sur ses pieds, traversé de vaguelettes de chaleur qui montent */
const warmAir=`<svg viewBox="0 0 455 250" class="th-svg" aria-hidden="true">
  <defs><linearGradient id="ta-w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd38a"/><stop offset="1" stop-color="#ff8a3d"/></linearGradient>
    <clipPath id="ta-wc"><rect x="8" y="12" width="440" height="150" rx="30"/></clipPath></defs>
  <ellipse cx="228" cy="240" rx="200" ry="10" fill="#000" opacity=".25"/>
  ${[90,365].map(x=>`<path d="M${x} 160V236M${x-26} 236H${x+26}" stroke="#4e3420" stroke-width="10" stroke-linecap="round"/><path d="M${x} 160V236" stroke="#8a5a34" stroke-width="6"/>`).join('')}
  <rect x="14" y="20" width="440" height="150" rx="30" fill="#b35a22"/>
  <rect x="8" y="12" width="440" height="150" rx="30" fill="url(#ta-w)" stroke="#c9622a" stroke-width="3"/>
  <g clip-path="url(#ta-wc)" fill="none" stroke="#fff" stroke-opacity=".65" stroke-width="3" stroke-linecap="round">${[40,95,150,205,260,315,370,420].map((x,i)=>`<path class="wav" style="animation-delay:-${(i*.37).toFixed(2)}s" d="M${x} 170${[...Array(8)].map((_,k)=>`Q${x+(k%2?-9:9)} ${160-k*20} ${x} ${150-k*20}`).join('')}"/>`).join('')}</g>
  <rect x="112" y="64" width="232" height="44" rx="12" fill="#fff" opacity=".88"/><text x="228" y="94" text-anchor="middle" class="ta-lbl" fill="#8a3b0e">Air chaud · 30 °C</text></svg>`;
/* étape 1 : des bulles d'air chaud qui montent, des bulles d'air froid qui descendent (visibles quand la scène a la classe « conv ») */
const conv=`<svg viewBox="0 0 1200 680" class="th-svg" aria-hidden="true"><defs>
    <radialGradient id="tp-w" cx=".38" cy=".32"><stop offset="0" stop-color="#ffe2b0"/><stop offset=".55" stop-color="#ffa14a"/><stop offset="1" stop-color="#e2671f"/></radialGradient>
    <radialGradient id="tp-c" cx=".38" cy=".32"><stop offset="0" stop-color="#eaf5ff"/><stop offset=".55" stop-color="#7fb5ec"/><stop offset="1" stop-color="#3f7fc7"/></radialGradient></defs>
  ${[[690,0,1],[765,1,0],[840,2,1],[915,3,0],[990,4,1],[1060,5,0]].map(([x,k,up])=>`<g transform="translate(${x} ${up?470:180})"><g class="${up?'pu':'pd'}" style="animation-delay:-${(k*.75).toFixed(2)}s">
    <circle r="25" fill="url(#tp-${up?'w':'c'})" stroke="#fff" stroke-width="2.5"/><path d="${up?'M0 11V-11M-8 -3L0 -11L8 -3':'M0 -11V11M-8 3L0 11L8 3'}" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></g></g>`).join('')}</svg>`;
/* étape 2 : gouttes d'eau et cristaux de glace pendus à des fils, par paires ; quand une paire se croise, les deux se cognent */
const ICE=(id)=>{const h=[...Array(6)].map((_,k)=>{const a=(k*60+30)*Math.PI/180;return`${(34*Math.cos(a)).toFixed(1)} ${(34*Math.sin(a)).toFixed(1)}`}).join('L');
    return`<path d="M${h}Z" fill="#6d9bbd" transform="translate(5 6)"/><path d="M${h}Z" fill="url(#tq-i)" stroke="#6aa7cf" stroke-width="2.5"/>
      <g stroke="#fff" stroke-width="2.6" stroke-linecap="round" opacity=".85">${[0,60,120].map(a=>`<g transform="rotate(${a})"><path d="M-24 0H24M14 0l7 -7M14 0l7 7M-14 0l-7 -7M-14 0l-7 7"/></g>`).join('')}</g>`},
  DROP=()=>{const d='M0 -38C12 -20 30 -2 30 12A30 30 0 0 1 -30 12C-30 -2 -12 -20 0 -38Z';
    return`<path d="${d}" fill="#1f5ea8" transform="translate(5 6)"/><path d="${d}" fill="url(#tq-d)" stroke="#2a6fbd" stroke-width="2.5"/><ellipse cx="-11" cy="2" rx="6" ry="11" fill="#fff" opacity=".55" transform="rotate(20 -11 2)"/>`},
  PAIRS=[[670,'ice','drop',3.2,.9],[830,'ice','ice',3.9,2.1],[990,'drop','ice',3.5,4.0]],CY=320,CA=115;
const crystals=`<svg viewBox="0 0 1200 680" class="th-svg" aria-hidden="true"><defs>
    <linearGradient id="tq-i" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f4fcff"/><stop offset="1" stop-color="#a5d6f2"/></linearGradient>
    <radialGradient id="tq-d" cx=".38" cy=".38"><stop offset="0" stop-color="#cfe9ff"/><stop offset=".6" stop-color="#5aa4f0"/><stop offset="1" stop-color="#2a6fbd"/></radialGradient>
    <radialGradient id="tq-s"><stop offset="0" stop-color="#fff8c0"/><stop offset=".4" stop-color="#ffe04a" stop-opacity=".7"/><stop offset="1" stop-color="#ffb81f" stop-opacity="0"/></radialGradient></defs>
  ${PAIRS.map(([x,a,b],p)=>[[x,a],[x+60,b]].map(([xx,k],j)=>`<path class="str" id="tq-s${p}${j}" stroke="#c9b48a" stroke-width="2"/><g class="it" id="tq-${p}${j}">${k=='ice'?ICE():DROP()}</g>`).join('')).join('')}
  <g id="tq-sparks"></g></svg>`;
/* ---------- la scène : fond, plancher, décors, narrateur, cadre de scène, rideau ---------- */
const planks=(()=>{const top=478,bot=SH,vx=SW/2,n=18;let s='';
  for(let i=0;i<=n;i++){const xb=-120+i*(SW+240)/n,xt=vx+(xb-vx)*.7;s+=`<path d="M${xt.toFixed(1)} ${top}L${xb.toFixed(1)} ${bot}" stroke="#5a3a20" stroke-width="2" opacity=".55"/>`}
  [0,.18,.4,.66].forEach((t,k)=>{const y=top+(bot-top)*t*t+ (k?0:0);s+=`<path d="M0 ${y.toFixed(1)}H${SW}" stroke="#5a3a20" stroke-width="1.5" opacity=".35"/>`});
  return`<svg viewBox="0 0 ${SW} ${SH-470}" preserveAspectRatio="none" class="th-floor-svg" aria-hidden="true"><defs><linearGradient id="tf-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7a5230"/><stop offset=".35" stop-color="#a87445"/><stop offset="1" stop-color="#c88d55"/></linearGradient></defs>
    <rect y="8" width="${SW}" height="${SH-478}" fill="url(#tf-g)"/><g transform="translate(0 -470)">${s}</g><path d="M0 8H${SW}" stroke="#3a2412" stroke-width="4"/></svg>`})();
/* lambrequin : festons de velours rouge qui pendent, bordés d'une frange dorée */
const valance=(()=>{const n=12,w=SW/n;let d=`M0 0H${SW}V54`,fr='';for(let i=n-1;i>=0;i--){const x0=(i+1)*w,x1=i*w;d+=`L${x0} 54Q${x0-w/2} 104 ${x1} 54`}d+='Z';
  for(let i=0;i<n;i++){const x0=i*w;fr+=`<path d="M${x0} 54Q${x0+w/2} 104 ${x0+w} 54" fill="none" stroke="#e6c25a" stroke-width="7" stroke-dasharray="3 3"/>`}
  return`<svg viewBox="0 0 ${SW} 110" preserveAspectRatio="none" class="th-svg" aria-hidden="true"><defs><linearGradient id="tv-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4f0b0f"/><stop offset=".55" stop-color="#a51f26"/><stop offset="1" stop-color="#6e1217"/></linearGradient></defs>
    <path d="${d}" fill="url(#tv-g)"/>${fr}<path d="M0 22H${SW}" stroke="#e6c25a" stroke-width="5"/></svg>`})();
stage.innerHTML=`
  <div class="th-back"></div><div class="th-floor">${planks}</div><div class="th-foot"></div>
  <div class="th-set" id="th-set">
  <div class="th-conv" id="th-conv">${conv}</div>
  <div class="th-spot"></div>
  <div class="th-pool"></div>
  <div class="th-narr" id="th-narr">${narrator}</div>
  <div class="th-bubble" id="th-bubble"><p id="th-say"></p></div>
  </div>
  <div class="th-frame th-frame--l"></div><div class="th-frame th-frame--r"></div>
  <div class="th-curtain th-curtain--l"></div><div class="th-curtain th-curtain--r"></div>
  <div class="th-valance">${valance}</div>`;

/* ---------- mise à l'échelle et déroulé ---------- */
/* la scène remplit tout l'écran : fond, plancher, rideaux et lambrequin s'étirent sur la largeur (ou la hauteur) en trop ;
   les décors et le narrateur restent dans une zone de 1200 × 680 centrée, posée sur le plancher */
function fit(){const W=innerWidth,H=innerHeight,k=Math.min(W/SW,H/SH),w=W/k,h=H/k;
  stage.style.width=w+'px';stage.style.height=h+'px';stage.style.transform=`scale(${k})`;const set=$('th-set');set.style.left=(w-SW)/2+'px';set.style.top=(h-SH)+'px'}
/* ---------- l'histoire : des étapes (une scène chacune), faites de phrases du narrateur ; « go » met en place le décor de la phrase ---------- */
const SCENES=[
  [{t:'Bonjour ! Je suis un petit nuage, et je vais te raconter comment naît un orage.'},
   {t:'Tout se passe dans l’air. En haut, très loin au-dessus du sol, l’air est froid : il y fait souvent moins de −20 °C, et il neige !',go:()=>add('cold')},
   {t:'En bas, près du sol, l’air est chaud : le Soleil a chauffé le sol, et le sol chauffe l’air.',go:()=>add('warm')},
   {t:'Un orage se forme quand la température de l’air change très vite, ou quand il y a un grand écart de température entre deux couches d’air : l’air chaud du bas et l’air froid du haut.'},
   {t:'Alors l’air se met en mouvement : l’air chaud, plus léger, monte. L’air froid, plus lourd, descend.',go:()=>th.classList.add('conv')},
   {t:'C’est une question de densité : l’air chaud est moins dense que l’air froid. Ces mouvements forment de grands courants d’air, vers le haut et vers le bas.'}],
  [{t:'Dans ces courants d’air, il y a de minuscules gouttes d’eau et de petits cristaux de glace.',go:()=>add('crystals')},
   {t:'Emportés par l’air, ils montent et descendent sans arrêt… et se cognent les uns contre les autres !',go:()=>moving=1},
   {t:'À chaque choc, ils s’échangent ce qu’ils ont à leur surface : des électrons, de toutes petites particules qui viennent des molécules d’eau.',go:()=>sparks=1},
   {t:'La suite de l’histoire… très bientôt !'}]];
/* décors : position dans la scène, et d'où ils viennent (ils y repartent à la fin de l'étape) */
const PROPS={cold:{html:coldAir,cls:'th-hang',box:[640,0,455,270],out:'translateY(-900px)'},warm:{html:warmAir,box:[640,330,455,250],out:'translateX(1400px)'},
  crystals:{html:crystals,box:[0,0,1200,680],out:'translateY(-1000px)',init:initCrystals}};
let T=[],sc=0,li=0,busy=0,ended=0,raf=0,moving=0,sparks=0,CRY=null,last=0;
const later=(f,ms)=>T.push(setTimeout(f,ms)),btn=$('th-next');
function say(t){const b=$('th-bubble');b.classList.remove('on');if(t)later(()=>{$('th-say').textContent=t;b.classList.add('on')},150)}
function add(k){const P=PROPS[k],e=document.createElement('div');e.className='th-prop '+(P.cls||'');e.dataset.prop=k;
  e.style.cssText=`left:${P.box[0]}px;top:${P.box[1]}px;width:${P.box[2]}px;height:${P.box[3]}px;--out:${P.out}`;e.innerHTML=P.html;
  $('th-set').insertBefore(e,$('th-conv'));if(P.init)P.init(e);void e.offsetWidth;e.classList.add('in')}
/* fin d'étape : tous les décors repartent d'où ils sont venus, puis disparaissent */
function clearProps(now){th.classList.remove('conv');moving=sparks=0;document.querySelectorAll('#th-set .th-prop').forEach(e=>{if(now){e.remove();return}e.classList.remove('in');later(()=>e.remove(),1700)});if(now)CRY=null;else later(()=>CRY=null,1700)}
/* bouton « Compris » : phrase suivante ; il reste bloqué un instant, le temps que le décor se mette en place */
function lock(ms){busy=1;btn.disabled=true;later(()=>{busy=0;btn.disabled=false},ms)}
function line(){const L=SCENES[sc][li];say(L.t);if(L.go)L.go();lock(L.go?1300:700)}
function next(){if(busy||btn.hidden)return;
  if(ended){restart();return}
  if(li<SCENES[sc].length-1){li++;line();return}
  if(sc<SCENES.length-1){say('');clearProps();lock(2100);later(()=>{sc++;li=0;line()},1900);return}
  /* fin : le rideau se referme */
  ended=1;say('');clearProps();th.classList.remove('opening');lock(2600);later(()=>btn.textContent='Revoir depuis le début',2200)}
function start(){sc=li=ended=0;btn.textContent='Compris';btn.hidden=true;later(()=>th.classList.add('opening'),500);later(()=>{btn.hidden=false;line()},2400)}
function restart(){T.forEach(clearTimeout);T=[];clearProps(1);busy=0;start()}

/* étape 2 : chaque paire de particules monte et descend en sens contraire ; quand elles se croisent, elles se cognent (et, une fois expliqué, une étincelle jaillit) */
function initCrystals(e){CRY={e,pairs:PAIRS.map(([x,,,per,a],p)=>({x,w:2*Math.PI/per,a,g:[0,1].map(j=>e.querySelector(`#tq-${p}${j}`)),s:[0,1].map(j=>e.querySelector(`#tq-s${p}${j}`))})),sp:e.querySelector('#tq-sparks')};stepCrystals(0)}
function spark(x,y){const g=document.createElementNS('http://www.w3.org/2000/svg','g');g.setAttribute('transform',`translate(${x} ${y})`);
  g.innerHTML=`<g class="spk"><circle r="34" fill="url(#tq-s)"/><path d="M0 -26L6 -7L24 -12L9 1L20 18L2 9L-8 26L-7 6L-26 4L-9 -6Z" fill="#ffe04a" stroke="#f0a020" stroke-width="2" stroke-linejoin="round"/></g>`;CRY.sp.appendChild(g);setTimeout(()=>g.remove(),700)}
function stepCrystals(dt){if(!CRY)return;CRY.pairs.forEach(p=>{const a0=p.a;if(moving)p.a+=p.w*dt;const s=Math.sin(p.a);
  [CY-CA*s,CY+CA*s].forEach((y,j)=>{const x=p.x+60*j;p.g[j].setAttribute('transform',`translate(${x} ${y.toFixed(1)})`);p.s[j].setAttribute('d',`M${x} -800V${(y-34).toFixed(1)}`)});
  if(sparks&&Math.floor(p.a/Math.PI)!=Math.floor(a0/Math.PI))spark(p.x+30,CY)})}
function loop(now){raf=requestAnimationFrame(loop);const dt=last?Math.min(.05,(now-last)/1000):0;last=now;stepCrystals(dt)}

function open(){$('start').hidden=true;th.hidden=false;th.className='';fit();rot.hidden=!portrait.matches;void th.offsetWidth;start();last=0;if(!raf)raf=requestAnimationFrame(loop)}
function close(){T.forEach(clearTimeout);T=[];clearProps(1);cancelAnimationFrame(raf);raf=0;th.hidden=true;th.className='';say('');btn.hidden=true;$('start').hidden=false;$('go-storm').focus({preventScroll:true})}
/* invitation à passer en paysage : disparaît seule quand on tourne le téléphone, ou d'un toucher */
const portrait=matchMedia('(orientation: portrait)'),rot=$('th-rot');portrait.addEventListener('change',()=>{if(!portrait.matches)rot.hidden=true});rot.onclick=()=>rot.hidden=true;
$('go-storm').onclick=open;$('th-quit').onclick=close;$('th-next').onclick=next;
addEventListener('resize',()=>{if(!th.hidden)fit()});addEventListener('orientationchange',()=>{if(!th.hidden)setTimeout(fit,300)});
addEventListener('keydown',e=>{if(th.hidden)return;if(e.key=='Escape')close();else if((e.key=='Enter'||e.key==' '||e.key=='ArrowRight')&&!e.target.closest('button')&&rot.hidden){e.preventDefault();next()}})})();
