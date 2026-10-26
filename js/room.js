/* « D'où viennent les couleurs du ciel ? » : une enquête affichée sur les quatre murs d'une pièce.
   On tourne d'un mur à l'autre en glissant (rotation de 90°, comme au centre de la pièce), un clic sur un cadre s'en approche, un clic à côté revient au mur entier,
   un clic sur un texte l'affiche en grand. Chaque mur est dessiné dans un repère fixe de 1200 × 680, mis à l'échelle de l'écran. */
(()=>{const $=id=>document.getElementById(id),NS='http://www.w3.org/2000/svg',DW=1200,DH=680,NAV=2,
  TITLES=['La lumière blanche cache toutes les couleurs','À venir','À venir','À venir'],
  SPEC=['#ff3b30','#ff8a1e','#ffe23a','#3fd06a','#2f9bff','#5a4bff','#a24bff'],CNAME=['rouge','orange','jaune','vert','bleu','indigo','violet'],
  hex=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)),
  spec=u=>{const x=Math.max(0,Math.min(1,u))*(SPEC.length-1),i=Math.min(SPEC.length-2,x|0),t=x-i,a=hex(SPEC[i]),b=hex(SPEC[i+1]);return`rgb(${a.map((v,k)=>Math.round(v+(b[k]-v)*t))})`},
  specStops=SPEC.map((c,i)=>`<stop offset="${(i/(SPEC.length-1)).toFixed(3)}" stop-color="${c}"/>`).join('');

/* ---------- textes : la version courte est sur le mur, la version complète s'ouvre en grand ---------- */
const NOTES={
  newton:{t:'Isaac Newton (1643 – 1727)',s:'Savant anglais. Il explique comment les forces font bouger les objets et découvre la gravitation : la force qui fait tomber une pomme retient aussi la Lune autour de la Terre. Avec un prisme, il montre que la lumière blanche est un mélange de couleurs.',
    l:`<p>Isaac Newton est un physicien et mathématicien anglais, professeur à l’université de Cambridge.</p>
      <p><b>Les forces.</b> Il énonce les lois qui relient les forces au mouvement : un objet ne se met en mouvement, ne freine ou ne tourne que si une force agit sur lui.</p>
      <p><b>La gravitation.</b> Il comprend que la force qui fait tomber une pomme vers le sol est la même que celle qui retient la Lune autour de la Terre, et les planètes autour du Soleil. Il publie tout cela en 1687 dans un livre célèbre, les <i>Principia</i>.</p>
      <p><b>La lumière.</b> En 1666, dans une pièce sombre, il fait passer un rayon de soleil à travers un prisme de verre : la lumière blanche s’étale en un ruban de couleurs. Avec un second prisme, il rassemble les couleurs… et retrouve du blanc ! La lumière blanche est donc un <b>mélange de toutes les couleurs</b>.</p>`},
  soleil:{t:'Pourquoi le Soleil est blanc',s:'À 5 500 °C, le Soleil émet toutes les couleurs : leur mélange nous paraît blanc.',
    l:`<p>Un objet très chaud émet de la lumière, et sa couleur dépend de sa <b>température</b>, comme un morceau de fer chauffé qui devient rouge, puis orange, puis blanc.</p>
      <p>Les étoiles suivent la même règle :</p>
      <dl class="fiche"><dt>Bételgeuse</dt><dd>3 300 °C : rouge</dd><dt>Arcturus</dt><dd>4 000 °C : orange</dd><dt>Soleil</dt><dd>5 500 °C : blanc</dd><dt>Rigel</dt><dd>11 000 °C : bleue</dd></dl>
      <p>À 5 500 °C, le Soleil émet toutes les couleurs en quantités presque égales : leur mélange nous paraît <b>blanc</b>. Vu depuis l’espace, le Soleil est blanc ! S’il nous paraît jaune ou orangé depuis le sol, c’est à cause de l’air qu’il traverse : nous le verrons sur un autre mur.</p>`},
  prisme:{t:'Le prisme',s:'Le verre dévie la lumière, le violet plus que le rouge : les couleurs se séparent. Déplace l’œil !',
    l:`<p>Quand la lumière passe de l’air au verre, puis du verre à l’air, elle change de direction : c’est la <b>réfraction</b>.</p>
      <p>Mais toutes les couleurs ne sont pas déviées de la même façon : le <b>violet</b> est le plus dévié, le <b>rouge</b> le moins. Les couleurs mélangées dans la lumière blanche se séparent donc un peu dans le verre, puis beaucoup plus à la sortie, en s’éloignant du prisme : c’est la <b>dispersion</b>.</p>
      <p>On obtient un ruban de couleurs qui passent de l’une à l’autre sans frontière : le <b>spectre</b>. On y reconnaît le rouge, l’orange, le jaune, le vert, le bleu, l’indigo et le violet.</p>
      <p><b>À toi de jouer :</b> déplace l’œil dans le cadre. Près de la lampe, il reçoit de la lumière blanche ; après le prisme, il ne reçoit qu’une partie des couleurs.</p>
      <p class="petit">Sur l’animation, l’écart entre les couleurs est agrandi pour qu’on le voie bien.</p>`},
  arc:{t:'L’arc-en-ciel',s:'Le Soleil dans le dos, la pluie devant soi. Chaque goutte agit comme un petit prisme : elle renvoie la lumière en séparant les couleurs, chacune avec son propre angle.',
    l:`<p>Pour voir un arc-en-ciel, il faut deux choses : le <b>Soleil dans ton dos</b> et des <b>gouttes de pluie devant toi</b>.</p>
      <p>Chaque goutte se comporte comme un tout petit prisme : la lumière blanche du Soleil y entre (elle est déviée), se <b>réfléchit</b> sur le fond de la goutte, puis ressort (elle est encore déviée). À chaque passage, les couleurs se séparent un peu plus.</p>
      <p>Chaque couleur ressort avec un angle bien précis : environ <b>42°</b> pour le rouge et <b>40°</b> pour le violet. Ainsi, une goutte ne t’envoie qu’une seule couleur : le rouge te parvient des gouttes un peu plus hautes, le violet des gouttes un peu plus basses.</p>
      <p>Toutes les gouttes qui t’envoient du rouge sont sur un cercle autour du point opposé au Soleil : voilà pourquoi l’arc est <b>rond</b>, avec le rouge à l’extérieur et le violet à l’intérieur. Et ton voisin, un peu plus loin, voit son propre arc-en-ciel, fait d’autres gouttes !</p>`}};

/* ---------- mur 1 : expérience du prisme (Snell-Descartes, dispersion exagérée pour être visible) ---------- */
const PW=490,PH=296,PA=[240,34],PL=[146,197],PR=[334,197],SRC=[40,236],EF=.52,
  E=[PL[0]+(PA[0]-PL[0])*EF,PL[1]+(PA[1]-PL[1])*EF],
  nrm=v=>{const l=Math.hypot(v[0],v[1]);return[v[0]/l,v[1]/l]},dot=(a,b)=>a[0]*b[0]+a[1]*b[1],
  refr=(I,N,eta)=>{const ci=-dot(N,I),k=1-eta*eta*(1-ci*ci);return k<0?null:nrm([eta*I[0]+(eta*ci-Math.sqrt(k))*N[0],eta*I[1]+(eta*ci-Math.sqrt(k))*N[1]])},
  hit=(P,D,A,B)=>{const ex=B[0]-A[0],ey=B[1]-A[1],den=D[0]*ey-D[1]*ex,t=((A[0]-P[0])*ey-(A[1]-P[1])*ex)/den;return[P[0]+D[0]*t,P[1]+D[1]*t]},
  /* normale sortante de la face d'entrée, normale rentrante de la face de sortie (orientées vers la lumière qui arrive) */
  NB=36,NL=nrm([PA[1]-PL[1],PL[0]-PA[0]]),NRi=nrm([PA[1]-PR[1],PR[0]-PA[0]]),I0=nrm([E[0]-SRC[0],E[1]-SRC[1]]),
  RAYS=Array.from({length:NB+1},(_,i)=>{const u=i/NB,n=1.46+.2*u,T=refr(I0,NL,1/n),X=hit(E,T,PA,PR),O=refr(T,NRi,n);return{u,X,O,F:[X[0]+O[0]*320,X[1]+O[1]*320]}}),
  pt=p=>`${p[0].toFixed(1)} ${p[1].toFixed(1)}`,
  inPoly=(P,Q)=>{let c=0;for(let i=0,j=Q.length-1;i<Q.length;j=i++)if((Q[i][1]>P[1])!=(Q[j][1]>P[1])&&P[0]<(Q[j][0]-Q[i][0])*(P[1]-Q[i][1])/(Q[j][1]-Q[i][1])+Q[i][0])c=!c;return c},
  TRI=[PA,PR,PL];
function prismSVG(){let fanOut='',fanIn='',rays='';
  for(let i=0;i<NB;i++){const a=RAYS[i],b=RAYS[i+1],c=spec((a.u+b.u)/2);fanOut+=`<path d="M${pt(a.X)}L${pt(a.F)}L${pt(b.F)}L${pt(b.X)}Z" fill="${c}"/>`;fanIn+=`<path d="M${pt(E)}L${pt(a.X)}L${pt(b.X)}Z" fill="${c}"/>`}
  [0,.5,1].forEach((u,k)=>{const r=RAYS[Math.round(u*NB)];rays+=`<path class="flow flow--soft" style="animation-delay:-${k*.4}s" d="M${pt(r.X)}L${pt([r.X[0]+r.O[0]*240,r.X[1]+r.O[1]*240])}" stroke="#fff"/>`});
  const k=6,iA=[PA[0],PA[1]+2*k],iL=[PL[0]+k*1.75,PL[1]-k*.9],iR=[PR[0]-k*1.75,PR[1]-k*.9];
  return`<svg viewBox="0 0 ${PW} ${PH}" class="prism-svg" aria-label="Expérience du prisme : déplace l’œil">
  <defs><radialGradient id="p-glow" cx="${SRC[0]}" cy="${SRC[1]}" r="230" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fffdf2" stop-opacity=".6"/><stop offset=".35" stop-color="#fff6dc" stop-opacity=".22"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
    <radialGradient id="p-bulb"><stop offset="0" stop-color="#fff"/><stop offset=".4" stop-color="#fffbe6"/><stop offset="1" stop-color="#ffe9a8" stop-opacity="0"/></radialGradient>
    <linearGradient id="p-fade" gradientUnits="userSpaceOnUse" x1="${RAYS[0].X[0].toFixed(0)}" y1="0" x2="${PW}" y2="0"><stop offset="0" stop-color="#fff"/><stop offset=".45" stop-color="#fff" stop-opacity=".85"/><stop offset="1" stop-color="#fff" stop-opacity=".08"/></linearGradient>
    <mask id="p-mask"><rect width="${PW}" height="${PH}" fill="url(#p-fade)"/></mask>
    <linearGradient id="p-glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".2"/><stop offset=".6" stop-color="#dff1ff" stop-opacity=".06"/><stop offset="1" stop-color="#fff" stop-opacity=".15"/></linearGradient>
    <linearGradient id="p-specH">${specStops}</linearGradient>
    <filter id="p-blur" x="-10%" y="-30%" width="120%" height="160%"><feGaussianBlur stdDeviation="2.2"/></filter><filter id="p-blur3" x="-10%" y="-30%" width="120%" height="160%"><feGaussianBlur stdDeviation=".9"/></filter><filter id="p-blur2" x="-10%" y="-30%" width="120%" height="160%"><feGaussianBlur stdDeviation="6"/></filter></defs>
  <rect width="${PW}" height="${PH}" fill="#07080f"/>
  <circle class="p-halo" cx="${SRC[0]}" cy="${SRC[1]}" r="230" fill="url(#p-glow)"/>
  <path d="M${pt(SRC)}L${pt(E)}" stroke="#fff" stroke-opacity=".35" stroke-width="7" filter="url(#p-blur)"/>
  <path d="M${pt(SRC)}L${pt(E)}" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/>
  <path class="flow" d="M${pt(SRC)}L${pt(E)}" stroke="#fff"/>
  <g mask="url(#p-mask)"><g opacity=".7" filter="url(#p-blur2)">${fanOut}</g><g filter="url(#p-blur)">${fanOut}</g><g opacity=".55" mask="url(#p-mask)">${rays}</g></g>
  <path d="M${pt(PA)}L${pt(PR)}L${pt(PL)}Z" fill="url(#p-glass)"/>
  <g opacity=".95" filter="url(#p-blur3)">${fanIn}</g>
  <path d="M${pt(PA)}L${pt(PR)}L${pt(iR)}L${pt(iA)}Z" fill="#fff" fill-opacity=".25"/><path d="M${pt(PA)}L${pt(PL)}L${pt(iL)}L${pt(iA)}Z" fill="#fff" fill-opacity=".1"/>
  <path d="M${pt(PL)}L${pt(PR)}L${pt(iR)}L${pt(iL)}Z" fill="#fff" fill-opacity=".18"/><path d="M${pt(PA)}L${pt(PR)}L${pt(PL)}Z" fill="none" stroke="#fff" stroke-opacity=".8" stroke-width="1.5" stroke-linejoin="round"/>
  <circle cx="${E[0].toFixed(1)}" cy="${E[1].toFixed(1)}" r="10" fill="url(#p-bulb)"/>
  <circle cx="${SRC[0]}" cy="${SRC[1]}" r="26" fill="url(#p-bulb)" class="p-bulb"/><circle cx="${SRC[0]}" cy="${SRC[1]}" r="7" fill="#fff"/>
  <g class="p-lbl"><text x="14" y="${SRC[1]+46}">Lampe : lumière blanche</text><text x="${PA[0]}" y="${PL[1]+22}" text-anchor="middle">Prisme de verre</text>
    <text x="${PW-12}" y="${(RAYS[NB].F[1]>PH?PH-14:RAYS[NB].F[1]-14).toFixed(0)}" text-anchor="end">Spectre</text></g>
  <g class="eye" id="p-eye" tabindex="0" role="slider" aria-label="Œil à déplacer">
    <g class="bubble"><path class="b-tail"/><rect class="b-box" rx="10"/><path class="b-tail b-tail2"/><rect class="b-view" rx="4" height="20"/><path class="b-mark"/><text class="b-txt" text-anchor="middle"></text></g>
    <ellipse cx="0" cy="0" rx="17" ry="10" fill="#fff" stroke="#2b2b2b" stroke-width="1.6"/><circle cx="2" cy="0" r="6.4" fill="#5b8fd6"/><circle cx="2" cy="0" r="3" fill="#111"/><circle cx="0" cy="-2" r="1.4" fill="#fff"/>
    <path d="M-17 0Q0-16 17 0" fill="none" stroke="#2b2b2b" stroke-width="2"/><circle r="26" fill="transparent"/></g>
  </svg>`}
/* ce que reçoit l'œil en (x,y) : blanc près de la lampe, une couleur précise dans le spectre, rien ailleurs */
function seen(P){if(inPoly(P,TRI)){for(let i=0;i<NB;i++)if(inPoly(P,[E,RAYS[i].X,RAYS[i+1].X]))return{k:'spec',u:(i+.5)/NB,in:1};return{k:'glass'}}
  for(let i=0;i<NB;i++)if(inPoly(P,[RAYS[i].X,RAYS[i].F,RAYS[i+1].F,RAYS[i+1].X]))return{k:'spec',u:(i+.5)/NB};
  const yy=Math.max(PA[1],Math.min(PL[1],P[1])),bx=PL[0]+(PA[0]-PL[0])*(PL[1]-yy)/(PL[1]-PA[1]);
  return P[0]<bx&&Math.hypot(P[0]-SRC[0],P[1]-SRC[1])<215?{k:'white'}:{k:'dark'}}
function placeEye(svg,x,y){x=Math.max(22,Math.min(PW-22,x));y=Math.max(18,Math.min(PH-14,y));const g=svg.querySelector('#p-eye'),s=seen([x,y]),up=y>95,bw=172,bh=56,
    bx=Math.max(8-x,Math.min(PW-8-x-bw,-bw/2)),by=up?-bh-20:22,q=g.querySelector.bind(g),set=(e,a)=>{for(const k in a)e.setAttribute(k,a[k])};
  set(g,{transform:`translate(${x.toFixed(1)} ${y.toFixed(1)})`});g.dataset.x=x;g.dataset.y=y;
  /* bulle de BD au-dessus de l'œil (en dessous s'il est trop haut), avec sa pointe tournée vers lui */
  set(q('.b-box'),{x:bx,y:by,width:bw,height:bh});const tail=up?`M-8 ${by+bh-1}L0 -13L8 ${by+bh-1}Z`:`M-8 ${by+1}L0 13L8 ${by+1}Z`;g.querySelectorAll('.b-tail').forEach(e=>e.setAttribute('d',tail));
  const v=q('.b-view'),m=q('.b-mark'),t=q('.b-txt'),vx=bx+10,vy=by+8;set(v,{x:vx,y:vy,width:bw-20});set(t,{x:bx+bw/2});m.setAttribute('d','');
  v.setAttribute('fill',s.k=='white'?'#ffffff':s.k=='spec'?'url(#p-specH)':s.k=='glass'?'#e9eef5':'#000');
  if(s.k=='spec'){const mx=vx+s.u*(bw-20);m.setAttribute('d',`M${mx-5} ${vy+27}L${mx} ${vy+21}L${mx+5} ${vy+27}Z`);t.textContent=(s.in?'Dans le verre · ici : ':'Couleurs séparées · ici : ')+CNAME[Math.round(s.u*6)]}
  else t.textContent=s.k=='white'?'Lumière blanche : tout est mélangé':s.k=='glass'?'Dans le verre, pas encore séparé':'Noir : aucune lumière ici';
  t.setAttribute('y',by+bh-(s.k=='spec'?8:12))}

/* ---------- mur 1 : le Soleil et d'autres étoiles ---------- */
function starsSVG(){let st='';for(let i=0;i<70;i++)st+=`<circle cx="${(Math.random()*330).toFixed(1)}" cy="${(Math.random()*180).toFixed(1)}" r="${(Math.random()*.8+.3).toFixed(2)}" fill="#fff" opacity="${(Math.random()*.6+.2).toFixed(2)}"/>`;
  const S=[['Bételgeuse','3 300 °C','#ff5a3c',236,38,11],['Arcturus','4 000 °C','#ffa040',268,92,9],['Rigel','11 000 °C','#8fb4ff',236,146,10]];
  return`<svg viewBox="0 0 330 180" aria-label="Le Soleil et trois étoiles de couleurs différentes"><defs><radialGradient id="s-sun"><stop offset="0" stop-color="#fff"/><stop offset=".55" stop-color="#fffdf6"/><stop offset=".7" stop-color="#fff6e2" stop-opacity=".7"/><stop offset="1" stop-color="#ffe9c4" stop-opacity="0"/></radialGradient>
    ${S.map(([,,c],i)=>`<radialGradient id="s-g${i}"><stop offset="0" stop-color="#fff"/><stop offset=".3" stop-color="${c}"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`).join('')}
    <radialGradient id="s-bg" cx=".3" cy=".45" r=".9"><stop offset="0" stop-color="#1c2147"/><stop offset="1" stop-color="#05060f"/></radialGradient></defs>
    <rect width="330" height="180" fill="url(#s-bg)"/>${st}<circle cx="100" cy="82" r="78" fill="url(#s-sun)"/><circle cx="100" cy="82" r="44" fill="#fff"/>
    <text class="s-lbl s-sun" x="100" y="160" text-anchor="middle">Soleil · 5 500 °C</text>
    ${S.map(([n,t,c,x,y,r],i)=>`<circle cx="${x}" cy="${y}" r="${r*2.4}" fill="url(#s-g${i})"/><circle cx="${x}" cy="${y}" r="${r*.62}" fill="${c}"/><text class="s-lbl" x="${x+r+8}" y="${y-1}">${n}</text><text class="s-lbl s-t" x="${x+r+8}" y="${y+10}">${t}</text>`).join('')}</svg>`}

/* ---------- mur 1 : l'arc-en-ciel (flèches de lumière animées) ---------- */
const RW=385,RH=290,SUN=[54,52],CROWD=[66,246],BOWC=[80,420],BOWR=340,RAINX=[246,360],RAINY=[96,236];
function rainbowSVG(){let rain='',crowd='',bow='',rays='';
  for(let i=0;i<46;i++){const x=RAINX[0]+Math.random()*(RAINX[1]-RAINX[0]),y=RAINY[0]+Math.random()*10;rain+=`<path d="M${x.toFixed(1)} ${y.toFixed(1)}l-14 ${(RAINY[1]-y+14).toFixed(1)}" style="animation-delay:-${(Math.random()*.7).toFixed(2)}s"/>`}
  SPEC.forEach((c,i)=>bow+=`<path d="M${BOWC[0]+(BOWR+9-i*3)} ${BOWC[1]}A${BOWR+9-i*3} ${BOWR+9-i*3} 0 0 0 ${BOWC[0]} ${BOWC[1]-(BOWR+9-i*3)}" stroke="${c}"/>`);
  const P=['#d9534f','#3b6fb6','#e8a33a','#2ba39a','#8a5cc8','#5a8f3a','#c0563a'];for(let i=0;i<7;i++){const x=22+i*13+(i%2)*3,s=.85+(i%3)*.12;crowd+=`<g transform="translate(${x} ${CROWD[1]+4}) scale(${s})"><rect x="-3" y="-11" width="6" height="10" rx="2.5" fill="${P[i]}"/><circle cy="-14.5" r="3.2" fill="${['#f0c29a','#8d5a3b','#d9a27a'][i%3]}"/></g>`}
  for(let i=0;i<12;i++)rays+=`<path d="M0 -26V-36" transform="rotate(${i*30})"/>`;
  return`<svg viewBox="0 0 ${RW} ${RH}" aria-label="Formation d’un arc-en-ciel"><defs><linearGradient id="r-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6aa8e0"/><stop offset="1" stop-color="#d6ebf7"/></linearGradient>
    <radialGradient id="r-sun"><stop offset="0" stop-color="#fffbe6"/><stop offset=".45" stop-color="#ffe066"/><stop offset="1" stop-color="#ffb52e" stop-opacity="0"/></radialGradient>
    <clipPath id="r-rain"><rect x="${RAINX[0]-20}" y="${RAINY[0]}" width="${RAINX[1]-RAINX[0]+30}" height="${RAINY[1]-RAINY[0]+20}"/></clipPath></defs>
    <rect width="${RW}" height="${RH}" fill="url(#r-sky)"/>
    <g clip-path="url(#r-rain)"><rect x="${RAINX[0]-20}" y="${RAINY[0]}" width="${RAINX[1]-RAINX[0]+30}" height="${RAINY[1]-RAINY[0]+20}" fill="#8796a6" opacity=".35"/><g class="r-bow" fill="none" stroke-width="3" opacity=".55">${bow}</g><g class="r-drops" stroke="#e6f1fb" stroke-width="1.2" stroke-linecap="round" stroke-dasharray="5 13">${rain}</g></g>
    <g fill="#8c97a3"><circle cx="268" cy="80" r="22"/><circle cx="300" cy="64" r="30"/><circle cx="336" cy="78" r="24"/><circle cx="360" cy="92" r="16"/><rect x="250" y="80" width="122" height="22" rx="11"/></g>
    <g fill="#a7b1bc"><circle cx="292" cy="58" r="20"/><circle cx="322" cy="62" r="16"/></g>
    <rect y="${CROWD[1]+4}" width="${RW}" height="${RH-CROWD[1]-4}" fill="#78b356"/><rect y="${CROWD[1]+4}" width="${RW}" height="3" fill="#5f9a42"/>
    <g transform="translate(${SUN[0]} ${SUN[1]})"><circle r="44" fill="url(#r-sun)" class="r-glow"/><g class="r-rays" stroke="#ffd23a" stroke-width="3" stroke-linecap="round">${rays}</g><circle r="19" fill="#ffe25a"/><circle r="19" fill="none" stroke="#ffb22e" stroke-width="2"/></g>
    ${crowd}<g id="r-arrows"></g>
    <g class="p-lbl r-lbl"><text x="${SUN[0]}" y="${SUN[1]+52}" text-anchor="middle">Soleil (dans ton dos)</text><text x="306" y="36" text-anchor="middle">Nuage de pluie</text><text x="${CROWD[0]}" y="${RH-12}" text-anchor="middle">Toi et la foule</text></g></svg>`}
/* flèches : une flèche blanche part du Soleil vers une goutte de l'arc ; à son arrivée, sept petites flèches colorées repartent vers la foule, chacune avec son angle */
const ARW='M-7 -2.4H2V-5L8 0L2 5V2.4H-7Z';let arrows=[],nextShot=0;
function bowPoint(r){for(;;){const a=.62+Math.random()*.42,x=BOWC[0]+Math.cos(a)*r,y=BOWC[1]-Math.sin(a)*r;if(x>RAINX[0]+6&&x<RAINX[1]-4&&y>RAINY[0]+18&&y<RAINY[1]-12)return[x,y]}}
function spawn(g,x0,y0,x1,y1,dur,col,sc,now,next){const e=document.createElementNS(NS,'path');e.setAttribute('d',ARW);e.setAttribute('fill',col);e.setAttribute('stroke','rgba(30,45,70,.55)');e.setAttribute('stroke-width',sc<1?.5:.8);g.appendChild(e);
  arrows.push({e,x0,y0,x1,y1,t0:now,dur,sc,a:Math.atan2(y1-y0,x1-x0)*180/Math.PI,next})}
function stepArrows(g,now){if(now>nextShot){nextShot=now+650;const D=bowPoint(BOWR);spawn(g,SUN[0]+20,SUN[1]+8,D[0],D[1],1700,'#ffffff',1.15,now,D)}
  arrows=arrows.filter(o=>{const t=(now-o.t0)/o.dur;if(t>=1){o.e.remove();
      if(o.next){const D=o.next;SPEC.forEach((c,k)=>spawn(g,D[0],D[1],CROWD[0]+(k-3)*9,CROWD[1]-12+(k-3)*1.5,1500+k*40,c,.62,now,null))}return false}
    const x=o.x0+(o.x1-o.x0)*t,y=o.y0+(o.y1-o.y0)*t,f=o.next?1:Math.min(1,t*6,(1-t)*5);o.e.setAttribute('transform',`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${o.a.toFixed(1)}) scale(${o.sc})`);o.e.setAttribute('opacity',f.toFixed(2));return true})}

/* ---------- construction des murs ---------- */
const note=(k,x,y,w,r=0,cls='')=>`<div class="note ${cls}" data-note="${k}" role="button" tabindex="0" style="left:${x}px;top:${y}px;width:${w}px;transform:rotate(${r}deg)"><h3>${NOTES[k].t}</h3><p>${NOTES[k].s}</p></div>`;
/* chaque cadre : position, taille, inclinaison, zone sur laquelle on zoome (le cadre et son texte) */
const EL=[{id:'newton',x:30,y:30,w:175,h:262,r:-2,z:[12,18,246,462]},{id:'soleil',x:300,y:428,w:330,h:180,r:0,z:[288,416,354,262]},
  {id:'prisme',x:250,y:52,w:490,h:296,r:0,z:[238,40,514,384]},{id:'arc',x:790,y:228,w:385,h:280,r:.6,z:[776,214,414,446]}];
/* punaises (et couleurs) et fil rouge entre elles, comme sur un tableau d'enquête */
const PINS=[[117,37,'#d63a2f'],[133,310,'#2f6bd6'],[264,60,'#d63a2f'],[726,60,'#d63a2f'],[495,363,'#e0a020'],[465,436,'#d63a2f'],[806,236,'#d63a2f'],[982,523,'#2f9e5e'],[985,41,'#e0a020']],
  THREADS=[[0,2,26],[4,5,14],[3,6,30]];
function wall1(){const P=i=>PINS[i];
  return`<div class="board"></div>
  <div class="card-title" style="left:790px;top:36px;width:385px;transform:rotate(-.8deg)"><span>Mur 1 / 4</span><h2>${TITLES[0]}</h2><p>Suis le fil rouge. Touche un cadre pour t’en approcher, un texte pour le lire en grand.</p></div>
  <div class="el polaroid" data-el="0" role="button" tabindex="0" aria-label="Portrait d’Isaac Newton" style="left:30px;top:30px;width:175px;transform:rotate(-2deg)"><img src="img/newton.jpg" alt="Isaac Newton, levant le pouce, une pomme accrochée à l’arbre derrière lui" width="155" height="232"><span>Isaac Newton</span></div>
  ${note('newton',22,306,222,1.2)}
  <div class="el exp" data-el="2" role="button" tabindex="0" aria-label="Expérience du prisme" style="left:250px;top:52px;width:490px;height:296px">${prismSVG()}</div>
  ${note('prisme',250,358,490,-.4,'note--wide')}
  <div class="el painting" data-el="1" role="button" tabindex="0" aria-label="Tableau : le Soleil et d’autres étoiles" style="left:300px;top:428px;width:330px;height:180px">${starsSVG()}</div>
  ${note('soleil',300,616,330,0,'note--plaque')}
  <div class="el exp exp--sky" data-el="3" role="button" tabindex="0" aria-label="Formation d’un arc-en-ciel" style="left:790px;top:228px;width:385px;height:280px;transform:rotate(.6deg)">${rainbowSVG()}</div>
  ${note('arc',790,518,385,-.6)}
  <svg class="threads" viewBox="0 0 ${DW} ${DH}" aria-hidden="true"><defs><radialGradient id="pin-hl" cx=".35" cy=".3"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>
    ${THREADS.map(([a,b,s])=>{const A=P(a),B=P(b),d=`M${A[0]} ${A[1]}Q${(A[0]+B[0])/2} ${(A[1]+B[1])/2+s} ${B[0]} ${B[1]}`;return`<path d="${d}" stroke="rgba(0,0,0,.28)" stroke-width="3" fill="none" transform="translate(2 3)"/><path d="${d}" stroke="#c4161c" stroke-width="2.2" fill="none"/><path d="${d}" stroke="#ff6a5a" stroke-width=".7" fill="none" opacity=".7"/>`}).join('')}
    ${PINS.map(([x,y,c])=>`<ellipse cx="${x+3}" cy="${y+4}" rx="6.5" ry="4" fill="rgba(0,0,0,.3)"/><circle cx="${x}" cy="${y}" r="7" fill="${c}"/><circle cx="${x}" cy="${y}" r="7" fill="url(#pin-hl)"/><circle cx="${x}" cy="${y}" r="7" fill="none" stroke="rgba(0,0,0,.35)" stroke-width="1"/>`).join('')}</svg>`}
const empty=i=>`<div class="board"></div><div class="card-title card-title--soon" style="left:${DW/2-210}px;top:${DH/2-80}px;width:420px"><span>Mur ${i+1} / 4</span><h2>Bientôt…</h2><p>La suite de l’enquête sera affichée ici.</p></div>`;

/* ---------- la pièce : quatre murs ; on regarde le mur « cur ». Le plafond et le parquet sont peints sur le fond, derrière les murs ---------- */
const room=$('room'),scene=$('room-scene'),box=$('room-box');let W=0,H=0,cur=0,ang=0,zoomed=null,built=0,raf=0,K=[];
function build(){if(built)return;built=1;
  /* liège : un carreau de grains clairs et sombres, répété sur le tableau */
  room.style.setProperty('--cork',`url(${(()=>{const c=document.createElement('canvas');c.width=c.height=256;const g=c.getContext('2d');g.fillStyle='#c08a55';g.fillRect(0,0,256,256);
    for(let i=0;i<5200;i++){const v=Math.random();g.fillStyle=v<.45?`rgba(120,72,32,${.25+Math.random()*.4})`:v<.8?`rgba(222,178,120,${.3+Math.random()*.4})`:`rgba(80,46,20,${.3+Math.random()*.3})`;
      g.beginPath();g.ellipse(Math.random()*256,Math.random()*256,.6+Math.random()*1.6,.5+Math.random()*1.1,Math.random()*3,0,6.3);g.fill()}return c.toDataURL()})()})`);
  box.innerHTML=[0,1,2,3].map(i=>`<div class="face wall" data-wall="${i}"><div class="wall-in">${i==0?wall1():empty(i)}</div></div>`).join('');
  const svg=box.querySelector('.prism-svg');placeEye(svg,96,118);eyeDrag(svg)}
/* l'œil est un peu en arrière du centre de la pièce (1,3 W du mur regardé) : aucun mur ne passe jamais derrière lui, ce que les navigateurs dessinent mal,
   et les faces vues de dos restent cachées ; au repos, le mur regardé remplit exactement l'écran */
function layout(){W=innerWidth;H=innerHeight;scene.style.perspective=1.3*W+'px';
  box.querySelectorAll('.wall').forEach((w,i)=>w.style.transform=`rotateY(${-90*i}deg) translateZ(${-W/2}px)`);
  const m=Math.min(W,H)*.025,k=Math.min((W-2*m)/DW,(H-2*m)/DH);K=[k,(W-DW*k)/2,(H-DH*k)/2];
  box.querySelectorAll('.wall-in').forEach(w=>{w.style.transition='none';w.style.transform=`translate(${K[1]}px,${K[2]}px) scale(${k})`;void w.offsetWidth;w.style.transition=''});
  if(zoomed)zoomTo(zoomed,1);if(!drag)setAng(90*cur,0)}
function setAng(a,anim=1){ang=a;box.classList.toggle('drag',!anim);box.style.transform=`translateZ(${W/2}px) rotateY(${a}deg)`}
function go(i){if(zoomed)unzoom();cur=Math.max(0,Math.min(NAV-1,i));setAng(90*cur);ui()}
function ui(){$('room-label').textContent=`Mur ${cur+1} / 4 · ${TITLES[cur]}`;$('room-prev').hidden=cur<=0||!!zoomed;$('room-next').hidden=cur>=NAV-1||!!zoomed;$('room-back').hidden=!zoomed}
/* zoom vers un cadre : il vient au centre et remplit l'écran ; transition douce */
function zoomTo(el,now){const z=EL[+el.dataset.el].z,wi=el.closest('.wall-in'),k=Math.min(W*.94/z[2],H*.88/z[3]),tx=W/2-(z[0]+z[2]/2)*k,ty=H/2-(z[1]+z[3]/2)*k;
  if(now){wi.style.transition='none'}wi.style.transform=`translate(${tx}px,${ty}px) scale(${k})`;if(now){void wi.offsetWidth;wi.style.transition=''}
  box.querySelectorAll('.el.on').forEach(e=>e.classList.remove('on'));el.classList.add('on');zoomed=el;room.classList.add('zoomed');ui()}
function unzoom(){if(!zoomed)return;const wi=zoomed.closest('.wall-in');wi.style.transform=`translate(${K[1]}px,${K[2]}px) scale(${K[0]})`;zoomed.classList.remove('on');zoomed=null;room.classList.remove('zoomed');ui()}

/* ---------- l'œil : on le fait glisser (ou, de près, on touche l'endroit où l'on veut le poser) ---------- */
function eyeDrag(svg){const eye=svg.querySelector('#p-eye'),toSvg=e=>{const r=svg.getBoundingClientRect();return[(e.clientX-r.left)/r.width*PW,(e.clientY-r.top)/r.height*PH]};let on=0;
  eye.addEventListener('pointerdown',e=>{e.stopPropagation();on=1;eye.setPointerCapture(e.pointerId);eye.classList.add('grab')});
  eye.addEventListener('pointermove',e=>{if(on){const[x,y]=toSvg(e);placeEye(svg,x,y)}});
  eye.addEventListener('pointerup',e=>{on=0;eye.classList.remove('grab');e.stopPropagation()});eye.addEventListener('click',e=>e.stopPropagation());
  eye.addEventListener('keydown',e=>{const d={ArrowLeft:[-10,0],ArrowRight:[10,0],ArrowUp:[0,-10],ArrowDown:[0,10]}[e.key];if(!d)return;e.preventDefault();e.stopPropagation();placeEye(svg,+eye.dataset.x+d[0],+eye.dataset.y+d[1])});
  svg.addEventListener('click',e=>{if(zoomed&&zoomed.contains(svg)){e.stopPropagation();const[x,y]=toSvg(e);placeEye(svg,x,y)}})}

/* ---------- glisser pour tourner ; toucher pour s'approcher ---------- */
let sx=0,sy=0,drag=0,down=0,moved=0;
scene.addEventListener('pointerdown',e=>{if(e.button)return;down=1;drag=0;moved=0;sx=e.clientX;sy=e.clientY});
scene.addEventListener('pointermove',e=>{if(!down)return;const dx=e.clientX-sx,dy=e.clientY-sy;if(Math.hypot(dx,dy)>8)moved=1;
  if(!drag&&!zoomed&&Math.abs(dx)>12&&Math.abs(dx)>Math.abs(dy)*1.2){drag=1;scene.setPointerCapture(e.pointerId)}
  if(drag){let a=90*cur-dx/W*90;const mx=90*(NAV-1);if(a<0)a*=.3;if(a>mx)a=mx+(a-mx)*.3;setAng(a,0)}});
const end=e=>{if(!down)return;down=0;if(drag){const dx=e.clientX-sx;go(dx<-W*.14?cur+1:dx>W*.14?cur-1:cur)}drag=0};
scene.addEventListener('pointerup',end);scene.addEventListener('pointercancel',end);
scene.addEventListener('click',e=>{if(moved)return;const n=e.target.closest('.note');if(n){openNote(n.dataset.note);return}
  const el=e.target.closest('.el');if(el&&el!==zoomed){zoomTo(el);return}if(!el&&zoomed)unzoom()});
scene.addEventListener('keydown',e=>{if(e.key!='Enter'&&e.key!=' ')return;const n=e.target.closest('.note'),el=e.target.closest('.el');if(n){e.preventDefault();openNote(n.dataset.note)}else if(el&&!e.target.closest('.eye')){e.preventDefault();el===zoomed?unzoom():zoomTo(el)}});
$('room-prev').onclick=()=>go(cur-1);$('room-next').onclick=()=>go(cur+1);$('room-back').onclick=unzoom;

/* ---------- fenêtre de lecture ---------- */
const pop=$('note-pop');let lastFocus=null;
function openNote(k){lastFocus=document.activeElement;$('note-title').textContent=NOTES[k].t;$('note-body').innerHTML=NOTES[k].l;pop.hidden=false;$('note-ok').focus()}
const closeNote=()=>{pop.hidden=true;if(lastFocus)lastFocus.focus()};$('note-ok').onclick=closeNote;pop.onclick=e=>{if(e.target===pop)closeNote()};

/* ---------- invitation à passer en paysage : disparaît seule quand on tourne le téléphone ---------- */
const portrait=matchMedia('(orientation: portrait)'),rot=$('room-rot');
portrait.addEventListener('change',()=>{if(!portrait.matches)rot.hidden=true});$('room-rot-ok').onclick=()=>rot.hidden=true;

/* ---------- entrée, sortie, animations ---------- */
function loop(now){raf=requestAnimationFrame(loop);if(cur==0&&!document.hidden)stepArrows(box.querySelector('#r-arrows'),now)}
function open(){build();$('start').hidden=true;room.hidden=false;cur=0;zoomed=null;room.classList.remove('zoomed');layout();ui();rot.hidden=!portrait.matches;if(!raf)raf=requestAnimationFrame(loop)}
function close(){room.hidden=true;$('start').hidden=false;cancelAnimationFrame(raf);raf=0;if(zoomed)unzoom();pop.hidden=true;$('go-sky').focus()}
$('go-sky').onclick=open;$('room-quit').onclick=close;
addEventListener('resize',()=>{if(!room.hidden)layout()});
addEventListener('keydown',e=>{if(room.hidden)return;if(e.key=='Escape'){if(!pop.hidden)closeNote();else if(zoomed)unzoom();return}
  if(!pop.hidden||zoomed)return;if(e.key=='ArrowRight')go(cur+1);if(e.key=='ArrowLeft')go(cur-1)})})();
