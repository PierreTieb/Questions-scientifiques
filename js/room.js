/* « D'où viennent les couleurs du ciel ? » : une enquête affichée sur les quatre murs d'une pièce.
   On tourne d'un mur à l'autre avec les flèches (rotation de 90°, comme au centre de la pièce), un clic sur un cadre s'en approche, un clic à côté revient au mur entier,
   un clic sur un texte l'affiche en grand. Chaque mur est dessiné dans un repère fixe de 1200 × 680, mis à l'échelle de l'écran. */
(()=>{const $=id=>document.getElementById(id),NS='http://www.w3.org/2000/svg',DW=1200,DH=680,NAV=2,
  TITLES=['La lumière blanche cache toutes les couleurs','Dans l’air, des molécules qui dévient le bleu','À venir','À venir'],
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
      <p>Toutes les gouttes qui t’envoient du rouge sont sur un cercle autour du point opposé au Soleil : voilà pourquoi l’arc est <b>rond</b>, avec le rouge à l’extérieur et le violet à l’intérieur. Et ton voisin, un peu plus loin, voit son propre arc-en-ciel, fait d’autres gouttes !</p>`},
  air:{t:'De quoi est fait l’air ?',s:'L’air est un mélange de gaz : 80 % de diazote, 18 % de dioxygène et 2 % de dioxyde de carbone.',
    l:`<p>L’air semble vide, mais il est rempli de <b>molécules</b> minuscules, invisibles même au microscope. Chaque molécule est un petit assemblage d’<b>atomes</b>, que l’on retrouve dans le tableau périodique des éléments : l’azote (N), l’oxygène (O), le carbone (C)…</p>
      <dl class="fiche"><dt>Diazote N₂</dt><dd>2 atomes d’azote : 80 %</dd><dt>Dioxygène O₂</dt><dd>2 atomes d’oxygène : 18 %</dd><dt>Dioxyde de carbone CO₂</dt><dd>1 atome de carbone et 2 d’oxygène : 2 %</dd></dl>
      <p>Sur <b>100 molécules</b> d’air, il y a donc 80 molécules de diazote, 18 de dioxygène et 2 de dioxyde de carbone. On néglige les autres gaz, très peu nombreux.</p>
      <p class="petit">Sur les dessins, chaque atome a une couleur conventionnelle : l’oxygène en rouge, l’azote en bleu, le carbone en gris foncé.</p>`},
  souffle:{t:'Respirer : le rôle des gaz',s:'Le dioxygène passe des poumons dans le sang : nos cellules l’utilisent et rejettent du dioxyde de carbone, qu’on expire. Le diazote entre et ressort sans changer.',
    l:`<p>À chaque inspiration, l’air descend par le nez, la trachée et les bronches jusqu’aux <b>poumons</b>.</p>
      <p><b>Le dioxygène</b> traverse la paroi très fine des poumons et passe dans le sang, qui l’apporte à toutes nos cellules. Les cellules s’en servent pour tirer de l’énergie des aliments, et elles rejettent un déchet : le <b>dioxyde de carbone</b>. Le sang le ramène aux poumons, et nous l’expirons.</p>
      <p><b>Le diazote</b>, lui, ne sert à rien à notre corps : il entre et ressort sans changer. Il est pourtant le gaz le plus abondant de l’air !</p>
      <dl class="fiche"><dt>Air inspiré</dt><dd>18 % de dioxygène, 2 % de dioxyde de carbone</dd><dt>Air expiré</dt><dd>13 % de dioxygène, 7 % de dioxyde de carbone</dd></dl>
      <p class="petit">Sur l’animation, chaque inspiration fait entrer 100 molécules : 80 de diazote, 18 de dioxygène et 2 de dioxyde de carbone. Dans les poumons, 5 molécules de dioxygène sont remplacées par 5 de dioxyde de carbone.</p>`},
  bleu:{t:'Pourquoi le ciel est bleu',s:'Les molécules de l’air laissent passer la plupart des couleurs, mais dévient le bleu et le violet dans toutes les directions. Déplace l’œil : hors du rayon, il ne reçoit que du bleu !',
    l:`<p>La lumière blanche du Soleil contient toutes les couleurs (mur 1). Pour arriver jusqu’à nous, elle traverse l’air et ses milliards de milliards de molécules.</p>
      <p>Ces molécules sont si petites que la plupart des couleurs passent à côté sans être gênées. Mais le <b>bleu</b> et le <b>violet</b> sont <b>déviés</b> par les molécules et partent dans toutes les directions.</p>
      <p>Résultat : où que tu regardes dans le ciel, tu reçois cette lumière bleue déviée par l’air. <b>Le ciel paraît bleu.</b></p>
      <p>Et le Soleil ? La lumière qui vient de lui en ligne droite a perdu un peu de son bleu : il nous paraît légèrement <b>jaune</b>. Attention : ne regarde <b>jamais</b> le Soleil directement, même avec des lunettes de soleil !</p>
      <p><b>Pourquoi pas violet ?</b> Le Soleil envoie moins de violet que de bleu, et nos yeux voient mal le violet : c’est le bleu qui l’emporte.</p>
      <p class="petit">Ce phénomène s’appelle la diffusion de Rayleigh, du nom du physicien anglais qui l’a expliqué en 1871. En réalité, toutes les couleurs sont un tout petit peu déviées, mais le bleu et le violet beaucoup plus que le rouge.</p>`}};

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
    <linearGradient id="r-spec" x1="0" y1="0" x2="0" y2="1">${specStops}</linearGradient><clipPath id="r-rain"><rect x="${RAINX[0]-20}" y="${RAINY[0]}" width="${RAINX[1]-RAINX[0]+30}" height="${RAINY[1]-RAINY[0]+20}"/></clipPath></defs>
    <rect width="${RW}" height="${RH}" fill="url(#r-sky)"/>
    <g clip-path="url(#r-rain)"><g class="r-bow" fill="none" stroke-width="3" opacity=".55">${bow}</g><g class="r-drops" stroke="#e6f1fb" stroke-width="1.2" stroke-linecap="round" stroke-dasharray="5 13">${rain}</g></g>
    <g fill="#8c97a3"><circle cx="268" cy="80" r="22"/><circle cx="300" cy="64" r="30"/><circle cx="336" cy="78" r="24"/><circle cx="360" cy="92" r="16"/><rect x="250" y="80" width="122" height="22" rx="11"/></g>
    <g fill="#a7b1bc"><circle cx="292" cy="58" r="20"/><circle cx="322" cy="62" r="16"/></g>
    <rect y="${CROWD[1]+4}" width="${RW}" height="${RH-CROWD[1]-4}" fill="#78b356"/><rect y="${CROWD[1]+4}" width="${RW}" height="3" fill="#5f9a42"/>
    <g transform="translate(${SUN[0]} ${SUN[1]})"><circle r="44" fill="url(#r-sun)" class="r-glow"/><g class="r-rays" stroke="#ffd23a" stroke-width="3" stroke-linecap="round">${rays}</g><circle r="19" fill="#ffe25a"/><circle r="19" fill="none" stroke="#ffb22e" stroke-width="2"/></g>
    ${crowd}<g id="r-arrows"></g>
    <g class="p-lbl r-lbl"><text x="${SUN[0]}" y="${SUN[1]+52}" text-anchor="middle">Soleil (dans ton dos)</text><text x="306" y="36" text-anchor="middle">Nuage de pluie</text><text x="${CROWD[0]}" y="${RH-12}" text-anchor="middle">Toi et la foule</text></g></svg>`}
/* flèches : une flèche blanche part du Soleil vers une goutte de l'arc ; arrivée dans la goutte, elle fait demi-tour (la lumière s'y réfléchit)
   et se sépare en sept flèches colorées, plus petites, qui repartent vers la foule, chacune avec un angle un peu différent */
const ARW='M-7 -2.4H2V-5L8 0L2 5V2.4H-7Z';let arrows=[],nextShot=0;
function bowPoint(r){for(;;){const a=.62+Math.random()*.42,x=BOWC[0]+Math.cos(a)*r,y=BOWC[1]-Math.sin(a)*r;if(x>RAINX[0]+6&&x<RAINX[1]-4&&y>RAINY[0]+18&&y<RAINY[1]-12)return[x,y]}}
function arrowEl(g,col,sc){const e=document.createElementNS(NS,'path');e.setAttribute('d',ARW);e.setAttribute('fill',col);e.setAttribute('stroke','rgba(30,45,70,.55)');e.setAttribute('stroke-width',sc<1?.5:.8);g.appendChild(e);return e}
const deg=(x0,y0,x1,y1)=>Math.atan2(y1-y0,x1-x0)*180/Math.PI;
function stepArrows(g,now){if(now>nextShot){nextShot=now+700;const D=bowPoint(BOWR),x0=SUN[0]+20,y0=SUN[1]+8;
    arrows.push({k:'go',e:arrowEl(g,'#ffffff',1.15),x0,y0,x1:D[0],y1:D[1],t0:now,dur:1700,sc:1.15,a:deg(x0,y0,D[0],D[1])})}
  const add=[];arrows=arrows.filter(o=>{const t=(now-o.t0)/o.dur;
    if(o.k=='turn'){/* demi-tour sur place : la flèche pivote vers la foule en prenant les couleurs */
      const u=Math.min(1,t),a=o.a0+(o.a1-o.a0)*u*u*(3-2*u);o.e.setAttribute('transform',`translate(${o.x.toFixed(1)} ${o.y.toFixed(1)}) rotate(${a.toFixed(1)}) scale(1.15)`);
      if(u>.5)o.e.setAttribute('fill','url(#r-spec)');if(t<1)return true;o.e.remove();
      SPEC.forEach((c,k)=>{const tx=CROWD[0]+(k-3)*10,ty=CROWD[1]-14+(k-3)*1.2;add.push({k:'back',e:arrowEl(g,c,.78),x0:o.x,y0:o.y,x1:tx,y1:ty,t0:now,dur:1500,sc:.78,a:deg(o.x,o.y,tx,ty)})});return false}
    if(t>=1){if(o.k=='go'){add.push({k:'turn',e:o.e,x:o.x1,y:o.y1,a0:o.a,a1:o.a+((deg(o.x1,o.y1,CROWD[0],CROWD[1]-14)-o.a+540)%360-180),t0:now,dur:380});return false}o.e.remove();return false}
    const x=o.x0+(o.x1-o.x0)*t,y=o.y0+(o.y1-o.y0)*t,f=o.k=='go'?1:Math.min(1,(1-t)*6);o.e.setAttribute('transform',`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${o.a.toFixed(1)}) scale(${o.sc})`);o.e.setAttribute('opacity',f.toFixed(2));return true});
  arrows.push(...add)}

/* ---------- construction des murs ---------- */
const note=(k,x,y,w,r=0,cls='')=>`<div class="note ${cls}" data-note="${k}" role="button" tabindex="0" style="left:${x}px;top:${y}px;width:${w}px;transform:rotate(${r}deg)"><h3>${NOTES[k].t}</h3><p>${NOTES[k].s}</p></div>`;
/* chaque cadre : zone sur laquelle on zoome (repère du mur : x, y, largeur, hauteur) */
/* deux zooms possibles : z, le cadre seul (le texte s'ouvre d'un toucher) ; zt, le cadre et son texte ensemble (plus petit à l'écran sur téléphone).
   ZOOM_TEXT choisit la version utilisée */
const ZOOM_TEXT=false,
  EL=[{id:'newton',z:[14,16,200,290],zt:[12,16,214,612]},{id:'soleil',z:[228,438,324,189],zt:[228,440,324,236]},{id:'prisme',z:[306,26,498,312],zt:[308,28,494,416]},{id:'arc',z:[798,224,396,305],zt:[800,226,392,442]},
  {id:'air',z:[12,14,370,292],zt:[18,18,370,420]},{id:'souffle',z:[398,108,414,424],zt:[398,108,414,560]},{id:'bleu',z:[834,52,360,320],zt:[832,52,364,560]}];
/* un seul fil rouge tendu, qui marque les étapes de l'enquête : Newton, le Soleil, le prisme, l'arc-en-ciel ; et les punaises qui tiennent les papiers */
const STEPS=[[190,200],[262,458],[332,320],[822,370]],
  PINS=[...STEPS.map(p=>[...p,'#d63a2f']),[113,34,'#d63a2f'],[116,317,'#2f6bd6'],[334,48,'#d63a2f'],[776,48,'#d63a2f'],[550,382,'#e0a020'],[520,458,'#d63a2f'],[996,246,'#d63a2f'],[996,533,'#2f9e5e'],[996,35,'#e0a020']];
function wall1(){const d='M'+STEPS.map(p=>p.join(' ')).join('L');
  return`<div class="board"></div>
  <div class="card-title" style="left:812px;top:30px;width:368px;transform:rotate(-.8deg)"><span>Mur 1 / 4</span><h2>${TITLES[0]}</h2><p>Suis le fil rouge. Touche un cadre pour t’en approcher, un texte pour le lire en grand.</p></div>
  <div class="el polaroid" data-el="0" role="button" tabindex="0" aria-label="Portrait d’Isaac Newton" style="left:28px;top:28px;width:170px;transform:rotate(-2deg)"><img src="img/newton.jpg" alt="Isaac Newton, levant le pouce, une pomme accrochée à l’arbre derrière lui" width="150" height="225"><span>Isaac Newton</span></div>
  ${note('newton',20,312,192,1.2)}
  <div class="el exp" data-el="2" role="button" tabindex="0" aria-label="Expérience du prisme" style="left:320px;top:40px;width:470px;height:284px">${prismSVG()}</div>
  ${note('prisme',330,378,440,-.4,'note--wide')}
  <div class="el painting" data-el="1" role="button" tabindex="0" aria-label="Tableau : le Soleil et d’autres étoiles" style="left:240px;top:450px;width:300px;height:165px">${starsSVG()}</div>
  ${note('soleil',240,622,300,0,'note--plaque')}
  <div class="el exp exp--sky" data-el="3" role="button" tabindex="0" aria-label="Formation d’un arc-en-ciel" style="left:812px;top:238px;width:368px;height:277px;transform:rotate(.6deg)">${rainbowSVG()}</div>
  ${note('arc',812,528,368,-.6)}
  <svg class="threads" viewBox="0 0 ${DW} ${DH}" aria-hidden="true"><defs><radialGradient id="pin-hl" cx=".35" cy=".3"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>
    <path d="${d}" stroke="rgba(0,0,0,.28)" stroke-width="3" fill="none" stroke-linejoin="round" transform="translate(2 3)"/><path d="${d}" stroke="#c4161c" stroke-width="2.4" fill="none" stroke-linejoin="round"/><path d="${d}" stroke="#ff6a5a" stroke-width=".7" fill="none" stroke-linejoin="round" opacity=".7"/>
    ${PINS.map(([x,y,c])=>`<ellipse cx="${x+3}" cy="${y+4}" rx="6.5" ry="4" fill="rgba(0,0,0,.3)"/><circle cx="${x}" cy="${y}" r="7" fill="${c}"/><circle cx="${x}" cy="${y}" r="7" fill="url(#pin-hl)"/><circle cx="${x}" cy="${y}" r="7" fill="none" stroke="rgba(0,0,0,.35)" stroke-width="1"/>`).join('')}</svg>`}
const empty=i=>`<div class="board"></div><div class="card-title card-title--soon" style="left:${DW/2-210}px;top:${DH/2-80}px;width:420px"><span>Mur ${i+1} / 4</span><h2>Bientôt…</h2><p>La suite de l’enquête sera affichée ici.</p></div>`;

/* ---------- mur 2 : de quoi est fait l'air ? ---------- */
const MC={N:'#2F6BE0',O:'#E5413A',C:'#3b3f46'},
  mixh=(a,b,t)=>{const B=hex(b);return'#'+hex(a).map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('')},
  /* atomes en boules éclairées : un dégradé par élément */
  atomDefs=Object.entries(MC).map(([k,c])=>`<radialGradient id="a-${k}" cx=".35" cy=".32" r=".7"><stop offset="0" stop-color="${mixh(c,'#ffffff',.6)}"/><stop offset=".45" stop-color="${c}"/><stop offset="1" stop-color="${mixh(c,'#000000',.45)}"/></radialGradient>`).join(''),
  atom=(x,y,r,k)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="url(#a-${k})"/>`;
/* l'affiche : les trois molécules, leurs pourcentages, et une barre qui montre les proportions */
function airSVG(){const M=[['Diazote','N₂','80 %',atom(41,78,17,'N')+atom(67,78,17,'N'),MC.N],['Dioxygène','O₂','18 %',atom(152,78,16,'O')+atom(177,78,16,'O'),MC.O],
    ['Dioxyde de carbone','CO₂','2 %',atom(250,78,13,'O')+atom(292,78,13,'O')+atom(271,78,15,'C'),MC.C]],cx=[54,164,271];
  return`<svg viewBox="0 0 330 230" aria-label="Les trois principaux gaz de l’air"><defs>${atomDefs}</defs><rect width="330" height="230" fill="#fbf8ef"/>
    <text class="po-t" x="316" y="28" text-anchor="end">L’air que tu respires</text>
    ${M.map(([n,f,p,a,c],i)=>`${a}<text class="po-n" x="${cx[i]}" y="118" text-anchor="middle">${n}</text><text class="po-f" x="${cx[i]}" y="134" text-anchor="middle">${f}</text><text class="po-p" x="${cx[i]}" y="162" text-anchor="middle" fill="${c}">${p}</text>`).join('')}
    <rect x="20" y="180" width="232" height="16" fill="${MC.N}"/><rect x="252" y="180" width="52.2" height="16" fill="${MC.O}"/><rect x="304.2" y="180" width="5.8" height="16" fill="${MC.C}"/>
    <rect x="20" y="180" width="290" height="16" fill="none" stroke="#2e3a46" stroke-width="1"/>
    <text class="po-s" x="20" y="214">Sur 100 molécules d’air : 80 N₂, 18 O₂, 2 CO₂</text></svg>`}
/* tableau périodique coloré par familles, posé de biais sur le coin de l'affiche ; l'azote, l'oxygène et le carbone sont mis en valeur */
function mendelSVG(){const C=8,X0=4,Y0=14;let s='';
  const col=(r,g)=>{if(r==1)return g==1?'#9be7ff':'#ce93d8';if(g==1)return'#ff9e80';if(g==2)return'#ffd180';if(g==18)return'#ce93d8';if(g==17)return'#80deea';if(g<=12)return'#b39ddb';
      const d=g-r;return d>=12?'#fff59d':d==11||(d==10&&(r==4||r==5))?'#c5e1a5':'#a5d6a7'},
    has=(r,g)=>r==1?g==1||g==18:r<=3?g<=2||g>=13:true,HL={'2,14':'C','2,15':'N','2,16':'O'};
  for(let r=1;r<=7;r++)for(let g=1;g<=18;g++){if(!has(r,g))continue;const x=X0+(g-1)*C,y=Y0+(r-1)*C,h=HL[r+','+g];
    s+=`<rect x="${x}" y="${y}" width="${C-1}" height="${C-1}" fill="${col(r,g)}"${h?' stroke="#1e2a36" stroke-width="1"':''}/>`;if(h)s+=`<text x="${x+3.5}" y="${y+5.6}" text-anchor="middle" class="md-h">${h}</text>`}
  for(let r=0;r<2;r++)for(let g=3;g<=17;g++)s+=`<rect x="${X0+(g-1)*C}" y="${Y0+7*C+4+r*C}" width="${C-1}" height="${C-1}" fill="${r?'#ffab91':'#f48fb1'}"/>`;
  return`<svg class="mendel" viewBox="0 0 152 94" aria-hidden="true"><rect width="152" height="94" fill="#fdfcf7"/><text x="76" y="9.5" text-anchor="middle" class="md-t">Tableau périodique des éléments</text>${s}</svg>`}

/* l'humain vu en coupe de profil : à chaque inspiration, 100 molécules entrent par le nez jusqu'aux poumons (80 N₂, 18 O₂, 2 CO₂) ;
   dans les poumons, 5 O₂ deviennent CO₂, puis tout ressort à l'expiration. Un cycle dure 7 s */
const BW=390,BH=400,AIRW=[[244,121],[214,117],[190,114],[175,124],[170,146],[172,176],[174,204],[175,230],[176,250]],LUNG=[168,312,56,62],
  BT=7,INH=3.7,KCOL=[MC.N,MC.O,MC.C],
  ease=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x)},
  rndIn=(x0,x1)=>x0+Math.random()*(x1-x0),
  outPt=()=>[rndIn(262,378),rndIn(72,212)],
  lungPt=()=>{const a=Math.random()*6.283,r=Math.sqrt(Math.random());return[LUNG[0]+Math.cos(a)*r*LUNG[2],LUNG[1]+Math.sin(a)*r*LUNG[3]]};
function bodySVG(){return`<svg viewBox="0 0 ${BW} ${BH}" class="body-svg" aria-label="Coupe d’un humain qui respire : les molécules d’air entrent et sortent des poumons">
  <defs><linearGradient id="b-bg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#f4efe6"/><stop offset=".55" stop-color="#eaf3fb"/><stop offset="1" stop-color="#dcecf9"/></linearGradient>
    <radialGradient id="b-lungG" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#ffd3d6"/><stop offset=".6" stop-color="#f2a3aa"/><stop offset="1" stop-color="#d9727e"/></radialGradient>
    <linearGradient id="b-skin" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#d9a57e"/><stop offset=".6" stop-color="#f0c7a2"/><stop offset="1" stop-color="#e8b58e"/></linearGradient></defs>
  <rect width="${BW}" height="${BH}" fill="url(#b-bg)"/>
  <path d="M150 26C196 26 214 56 212 82L236 110Q239 119 222 121L216 125Q223 131 216 136Q222 141 214 146Q216 160 206 166Q190 172 182 176L184 196Q230 204 262 232L272 ${BH}H58L64 250Q68 205 118 196L120 172Q88 150 88 98C88 52 112 26 150 26Z" fill="url(#b-skin)" stroke="#b9825d" stroke-width="2"/>
  <path d="M92 104Q82 40 150 24Q204 24 214 64Q186 44 152 48Q112 56 104 110Z" fill="#5a3a22"/>
  <ellipse cx="136" cy="104" rx="10" ry="16" fill="#e2b08a" stroke="#b9825d" stroke-width="1.5"/><path d="M200 84q7 -5 13 0q-6 4 -13 0Z" fill="#fff" stroke="#6b4a33" stroke-width="1.2"/><circle cx="206.5" cy="84" r="2.2" fill="#3b2a1e"/>
  <path d="M196 74q9 -4 17 1" fill="none" stroke="#5a3a22" stroke-width="2" stroke-linecap="round"/>
  <ellipse cx="168" cy="304" rx="94" ry="104" fill="#e7b291" opacity=".55"/>
  <path d="M232 120Q212 108 188 110Q170 114 168 136L170 176" fill="none" stroke="#d9727e" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M232 120Q212 108 188 110Q170 114 168 136L170 176" fill="none" stroke="#f6b9bc" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
  <g id="b-lung"><path d="M170 210C118 212 88 292 92 374Q106 396 166 390Q228 396 242 372C248 300 218 212 170 210Z" fill="url(#b-lungG)" stroke="#c45f6b" stroke-width="2"/>
    <path d="M176 250L150 282L128 318L114 352M150 282L158 336M176 250L194 280L210 318L218 352M194 280L188 338M128 318L140 360M210 318L200 362" fill="none" stroke="#c45f6b" stroke-width="3.2" stroke-linecap="round" opacity=".75"/></g>
  <path d="M172 176L176 250" stroke="#c45f6b" stroke-width="13" stroke-linecap="round"/><path d="M172 176L176 250" stroke="#f6b9bc" stroke-width="8" stroke-linecap="round" stroke-dasharray="2.5 3.5"/>
  <path id="b-dia" d="M86 396Q166 352 248 396" fill="none" stroke="#b5584a" stroke-width="4" stroke-linecap="round"/>
  <g id="b-dots"></g>
  <g class="b-lbl"><text x="248" y="${BH-12}" text-anchor="end">Poumon</text><text x="230" y="100" text-anchor="end">Nez</text><text x="160" y="222" text-anchor="end">Trachée</text></g>
  <g class="b-leg">${[['N₂ · diazote',MC.N],['O₂ · dioxygène',MC.O],['CO₂ · dioxyde de carbone',MC.C]].map(([t,c],i)=>`<circle cx="256" cy="${20+i*16}" r="4" fill="${c}"/><text x="265" y="${24+i*16}">${t}</text>`).join('')}</g>
  <g class="b-count"><text id="b-phase" x="276" y="248">Inspiration</text><text x="276" y="266" class="b-small">sur 100 molécules :</text>
    ${['N₂','O₂','CO₂'].map((f,i)=>`<circle cx="281" cy="${283+i*18}" r="4.5" fill="${KCOL[i]}"/><text x="291" y="${288+i*18}">${f} : <tspan id="b-n${i}"></tspan></text>`).join('')}</g></svg>`}
let DOTS=[],bCycle=-1;
function buildDots(svg){const g=svg.querySelector('#b-dots'),kinds=[...Array(100)].map((_,i)=>i<80?0:i<98?1:2).sort(()=>Math.random()-.5);
  DOTS=kinds.map(k=>{const e=document.createElementNS(NS,'circle');e.setAttribute('r',3.1);e.setAttribute('stroke','rgba(255,255,255,.75)');e.setAttribute('stroke-width',.7);g.appendChild(e);
    return{k,e,d:Math.random()*.9,j:[rndIn(-2.5,2.5),rndIn(-2.5,2.5)]}})}
/* position le long du trajet O → nez → trachée → poumon (s de 0 à 1, à vitesse constante) */
function along(P,s){let L=0;const seg=[];for(let i=1;i<P.length;i++){const l=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);seg.push(l);L+=l}
  let t=s*L;for(let i=0;i<seg.length;i++){if(t<=seg[i]||i==seg.length-1){const u=seg[i]?Math.min(1,t/seg[i]):0;return[P[i][0]+(P[i+1][0]-P[i][0])*u,P[i][1]+(P[i+1][1]-P[i][1])*u]}t-=seg[i]}}
function stepBreath(now){const svg=box.querySelector('.body-svg');if(!svg||!DOTS.length)return;const T=now/1000,cyc=Math.floor(T/BT),t=T-cyc*BT;
  if(cyc!=bCycle){bCycle=cyc;/* nouvel air : nouvelles positions, et 5 des 18 O₂ seront transformés */
    const o2=DOTS.filter(o=>o.k==1).sort(()=>Math.random()-.5);DOTS.forEach(o=>{o.O=outPt();o.O2=outPt();o.L=lungPt();o.conv=0});o2.slice(0,5).forEach(o=>o.conv=1)}
  const b=t<3.2?ease(t/3.0):t<INH?1:ease(1-(t-INH)/2.9),ex=t>=3.45;
  svg.querySelector('#b-lung').setAttribute('transform',`translate(170 240) scale(${(1+.07*b).toFixed(4)}) translate(-170 -240)`);svg.querySelector('#b-dia').setAttribute('transform',`translate(0 ${(8*b).toFixed(2)})`);
  const fade=Math.min(1,t/.3,(BT-t)/.45);
  DOTS.forEach(o=>{const air=AIRW.map(([x,y])=>[x+o.j[0],y+o.j[1]]),p=t<INH?along([o.O,...air,o.L],ease((t-o.d)/2.1)):along([o.L,...air.slice().reverse(),o.O2],ease((t-INH-o.d)/1.9)),
      c=o.conv?mixh(MC.O,MC.C,ease((t-3.0)/.5)):KCOL[o.k];
    o.e.setAttribute('cx',p[0].toFixed(1));o.e.setAttribute('cy',p[1].toFixed(1));o.e.setAttribute('fill',c);o.e.setAttribute('opacity',fade.toFixed(2))});
  const ph=svg.querySelector('#b-phase');if(ph.dataset.ex!=String(ex)){ph.dataset.ex=ex;ph.textContent=ex?'Expiration':'Inspiration';
    [80,ex?13:18,ex?7:2].forEach((n,i)=>{const e=svg.querySelector('#b-n'+i);e.textContent=n;e.classList.toggle('chg',ex&&i>0)})}}

/* la diffusion par l'air : des flèches de toutes les couleurs partent du Soleil en ligne droite ; dans la couche d'air, le bleu, l'indigo et le violet
   sont déviés dans toutes les directions, les autres couleurs passent. L'œil se déplace : en face du Soleil il reçoit surtout du jaune, ailleurs du bleu */
const SW=340,SH=300,SUN2=[28,150],LAY=[112,250],BEAM=[136,164],
  /* part de rouge, vert et bleu de chaque couleur : les sept ensemble donnent du blanc */
  LW=[[1,.1,0],[1,.5,0],[1,1,0],[0,1.2,.15],[0,.5,1],[.05,.15,1],[.3,0,1]],LS=[0,1,2].map(i=>LW.reduce((s,w)=>s+w[i],0));
function skySVG(){let mol='';for(let i=0;i<64;i++){const x=rndIn(LAY[0]+6,LAY[1]-6),y=rndIn(30,290),a=Math.random()*180,k=Math.random()<.8?'N':'O';
    mol+=`<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${a.toFixed(0)})"><circle cx="-2" r="2.6" fill="url(#a-${k})"/><circle cx="2" r="2.6" fill="url(#a-${k})"/></g>`}
  return`<svg viewBox="0 0 ${SW} ${SH}" class="sky-svg" aria-label="La lumière du Soleil traverse l’air : déplace l’œil">
  <defs><radialGradient id="s2-sun"><stop offset="0" stop-color="#fff"/><stop offset=".35" stop-color="#fffbe8"/><stop offset="1" stop-color="#fff2c8" stop-opacity="0"/></radialGradient>
    <linearGradient id="s2-air" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7fb0ff" stop-opacity="0"/><stop offset=".12" stop-color="#7fb0ff" stop-opacity=".16"/><stop offset=".88" stop-color="#7fb0ff" stop-opacity=".16"/><stop offset="1" stop-color="#7fb0ff" stop-opacity="0"/></linearGradient></defs>
  <rect width="${SW}" height="${SH}" fill="#0a0f26"/>
  <rect x="${LAY[0]-10}" y="0" width="${LAY[1]-LAY[0]+20}" height="${SH}" fill="url(#s2-air)"/>${mol}
  <rect x="40" y="${BEAM[0]}" width="${SW-40}" height="${BEAM[1]-BEAM[0]}" fill="#fff" opacity=".05"/>
  <circle cx="${SUN2[0]}" cy="${SUN2[1]}" r="44" fill="url(#s2-sun)" class="p-bulb"/><circle cx="${SUN2[0]}" cy="${SUN2[1]}" r="13" fill="#fff"/>
  <g id="s2-arrows"></g>
  <g class="p-lbl"><text x="${SUN2[0]}" y="${SUN2[1]+34}" text-anchor="middle">Soleil</text><text x="${(LAY[0]+LAY[1])/2}" y="18" text-anchor="middle">Air : diazote et dioxygène</text></g>
  <g class="eye" id="s2-eye" tabindex="0" role="slider" aria-label="Œil à déplacer">
    <g class="bubble"><path class="b-tail"/><rect class="b-box" rx="10"/><path class="b-tail b-tail2"/><rect class="b-view" rx="4" height="20"/><text class="b-txt" text-anchor="middle"></text></g>
    <ellipse cx="0" cy="0" rx="17" ry="10" fill="#fff" stroke="#2b2b2b" stroke-width="1.6"/><circle cx="-2" cy="0" r="6.4" fill="#5b8fd6"/><circle cx="-2" cy="0" r="3" fill="#111"/><circle cx="-4" cy="-2" r="1.4" fill="#fff"/>
    <path d="M-17 0Q0-16 17 0" fill="none" stroke="#2b2b2b" stroke-width="2"/><circle r="26" fill="transparent"/></g></svg>`}
/* bulle de BD au-dessus de l'œil (en dessous s'il est trop haut), sa pointe tournée vers lui */
function bubbleAt(g,x,y,W0){const up=y>95,bw=172,bh=56,bx=Math.max(8-x,Math.min(W0-8-x-bw,-bw/2)),by=up?-bh-20:22,q=s=>g.querySelector(s),set=(e,a)=>{for(const k in a)e.setAttribute(k,a[k])};
  set(g,{transform:`translate(${x.toFixed(1)} ${y.toFixed(1)})`});g.dataset.x=x;g.dataset.y=y;set(q('.b-box'),{x:bx,y:by,width:bw,height:bh});
  const tail=up?`M-8 ${by+bh-1}L0 -13L8 ${by+bh-1}Z`:`M-8 ${by+1}L0 13L8 ${by+1}Z`;g.querySelectorAll('.b-tail').forEach(e=>e.setAttribute('d',tail));
  set(q('.b-view'),{x:bx+10,y:by+8,width:bw-20});set(q('.b-txt'),{x:bx+bw/2,y:by+bh-12})}
let sArrows=[],sAcc=[1,1,1,1,.2,.2,.2],sLast=0,sSpawn=0,sShow=0;
function placeSky(svg,x,y){x=Math.max(22,Math.min(SW-22,x));y=Math.max(18,Math.min(SH-14,y));bubbleAt(svg.querySelector('#s2-eye'),x,y,SW);sAcc=sAcc.map(v=>v*.3);sShow=0}
function stepSky(now){const svg=box.querySelector('.sky-svg');if(!svg)return;const dt=Math.min(50,now-(sLast||now));sLast=now;const g=svg.querySelector('#s2-arrows'),eye=svg.querySelector('#s2-eye'),ex=+eye.dataset.x,ey=+eye.dataset.y,v=.11;
  /* 50 flèches par seconde, de couleurs tirées au hasard ; une flèche bleue, indigo ou violette sur quatre traverse sans être déviée */
  for(sSpawn+=dt;sSpawn>20;sSpawn-=20){const k=Math.random()*7|0,e=document.createElementNS(NS,'path');e.setAttribute('d',ARW);e.setAttribute('fill',SPEC[k]);g.appendChild(e);
    sArrows.push({k,e,x:SUN2[0]+14,y:rndIn(BEAM[0],BEAM[1]),vx:v,vy:0,sx:k>=4&&Math.random()<.75?rndIn(LAY[0],LAY[1]):1e9,got:0})}
  const decay=Math.exp(-dt/2000);sAcc=sAcc.map(a=>a*decay);
  sArrows=sArrows.filter(o=>{o.x+=o.vx*dt;o.y+=o.vy*dt;
    if(o.x>=o.sx){o.sx=1e9;const a=(25+Math.random()*310)*Math.PI/180;o.vx=v*Math.cos(a);o.vy=v*Math.sin(a)}
    if(o.x<-10||o.x>SW+10||o.y<-10||o.y>SH+10){o.e.remove();return false}
    if(!o.got&&Math.hypot(o.x-ex,o.y-ey)<30){o.got=1;sAcc[o.k]+=1}
    o.e.setAttribute('transform',`translate(${o.x.toFixed(1)} ${o.y.toFixed(1)}) rotate(${(Math.atan2(o.vy,o.vx)*57.3).toFixed(0)}) scale(.55)`);return true});
  /* ce que voit l'œil : le mélange des couleurs reçues ces dernières secondes */
  if((sShow-=dt)>0)return;sShow=120;const tot=sAcc.reduce((a,b)=>a+b,0),view=eye.querySelector('.b-view'),txt=eye.querySelector('.b-txt');
  if(tot<.35){view.setAttribute('fill','#000');txt.textContent='Noir : rien n’arrive ici';return}
  const c=[0,1,2].map(i=>sAcc.reduce((s,a,k)=>s+a*LW[k][i],0)/LS[i]),m=Math.max(...c),bl=(sAcc[4]+sAcc[5]+sAcc[6])/tot;
  view.setAttribute('fill',`rgb(${c.map(x=>Math.round(255*(.2+.8*(.15+.85*x/m)))).join()})`);
  txt.textContent=bl>.7?'Surtout du bleu : le ciel !':bl<.3?'Surtout du jaune : le Soleil':'Blanc : toutes les couleurs'}

/* disposition du mur 2 : un seul fil rouge de l'affiche à l'humain, puis à la diffusion */
const STEPS2=[[352,72],[605,128],[850,70]],
  PINS2=[...STEPS2.map(p=>[...p,'#d63a2f']),[205,312,'#2f6bd6'],[205,476,'#e0a020'],[605,538,'#e0a020'],[1014,380,'#2f9e5e']];
function wall2(){const d='M'+STEPS2.map(p=>p.join(' ')).join('L');
  return`<div class="board"></div>
  <div class="el poster" data-el="4" role="button" tabindex="0" aria-label="Affiche : les gaz de l’air" style="left:40px;top:64px;width:330px;height:230px">${airSVG()}${mendelSVG()}</div>
  ${note('air',40,306,330,.8)}
  <div class="card-title" style="left:40px;top:478px;width:330px;transform:rotate(-1deg)"><span>Mur 2 / 4</span><h2>${TITLES[1]}</h2><p>De l’air que tu respires jusqu’au bleu du ciel : suis le fil rouge.</p></div>
  <div class="el exp exp--body" data-el="5" role="button" tabindex="0" aria-label="Un humain qui respire, vu en coupe" style="left:410px;top:120px;width:390px;height:400px">${bodySVG()}</div>
  ${note('souffle',410,532,390,-.5)}
  <div class="el exp" data-el="6" role="button" tabindex="0" aria-label="La lumière du Soleil traverse l’air" style="left:846px;top:64px;width:336px;height:296px">${skySVG()}</div>
  ${note('bleu',846,374,336,.5)}
  <svg class="threads" viewBox="0 0 ${DW} ${DH}" aria-hidden="true">
    <path d="${d}" stroke="rgba(0,0,0,.28)" stroke-width="3" fill="none" stroke-linejoin="round" transform="translate(2 3)"/><path d="${d}" stroke="#c4161c" stroke-width="2.4" fill="none" stroke-linejoin="round"/><path d="${d}" stroke="#ff6a5a" stroke-width=".7" fill="none" stroke-linejoin="round" opacity=".7"/>
    ${PINS2.map(([x,y,c])=>`<ellipse cx="${x+3}" cy="${y+4}" rx="6.5" ry="4" fill="rgba(0,0,0,.3)"/><circle cx="${x}" cy="${y}" r="7" fill="${c}"/><circle cx="${x}" cy="${y}" r="7" fill="url(#pin-hl)"/><circle cx="${x}" cy="${y}" r="7" fill="none" stroke="rgba(0,0,0,.35)" stroke-width="1"/>`).join('')}</svg>`}

/* ---------- la pièce : quatre murs ; on regarde le mur « cur ». Le plafond et le parquet sont peints sur le fond, derrière les murs ---------- */
const room=$('room'),scene=$('room-scene'),box=$('room-box');let W=0,H=0,cur=0,ang=0,zoomed=null,built=0,raf=0,K=[];
function build(){if(built)return;built=1;
  /* liège : un carreau de grains clairs et sombres, répété sur le tableau */
  room.style.setProperty('--cork',`url(${(()=>{const c=document.createElement('canvas');c.width=c.height=256;const g=c.getContext('2d');g.fillStyle='#c08a55';g.fillRect(0,0,256,256);
    for(let i=0;i<5200;i++){const v=Math.random();g.fillStyle=v<.45?`rgba(120,72,32,${.25+Math.random()*.4})`:v<.8?`rgba(222,178,120,${.3+Math.random()*.4})`:`rgba(80,46,20,${.3+Math.random()*.3})`;
      g.beginPath();g.ellipse(Math.random()*256,Math.random()*256,.6+Math.random()*1.6,.5+Math.random()*1.1,Math.random()*3,0,6.3);g.fill()}return c.toDataURL()})()})`);
  box.innerHTML=[0,1,2,3].map(i=>`<div class="face wall" data-wall="${i}"><div class="wall-in">${i==0?wall1():i==1?wall2():empty(i)}</div></div>`).join('');
  const svg=box.querySelector('.prism-svg');placeEye(svg,96,118);eyeDrag(svg);
  const s2=box.querySelector('.sky-svg');placeSky(s2,300,150);eyeDrag(s2,SW,SH,placeSky);buildDots(box.querySelector('.body-svg'))}
/* l'œil est un peu en arrière du centre de la pièce (1,3 W du mur regardé) : aucun mur ne passe jamais derrière lui, ce que les navigateurs dessinent mal,
   et les faces vues de dos restent cachées ; au repos, le mur regardé remplit exactement l'écran */
function layout(){W=innerWidth;H=innerHeight;scene.style.perspective=1.3*W+'px';
  box.querySelectorAll('.wall').forEach((w,i)=>w.style.transform=`rotateY(${-90*i}deg) translateZ(${-W/2}px)`);
  const m=Math.min(W,H)*.025,k=Math.min((W-2*m)/DW,(H-2*m)/DH);K=[k,(W-DW*k)/2,(H-DH*k)/2];
  box.querySelectorAll('.wall-in').forEach(w=>{w.style.transition='none';w.style.transform=`translate(${K[1]}px,${K[2]}px) scale(${k})`;void w.offsetWidth;w.style.transition=''});
  if(zoomed)zoomTo(zoomed,1);setAng(90*cur,0)}
function setAng(a,anim=1){ang=a;box.classList.toggle('drag',!anim);box.style.transform=`translateZ(${W/2}px) rotateY(${a}deg)`}
function go(i){if(zoomed)unzoom();cur=Math.max(0,Math.min(NAV-1,i));setAng(90*cur);box.querySelectorAll('.wall').forEach((w,k)=>w.classList.toggle('cur',k==cur));ui()}
function ui(){$('room-prev').hidden=cur<=0||!!zoomed;$('room-next').hidden=cur>=NAV-1||!!zoomed;$('room-back').hidden=!zoomed}
/* zoom vers un cadre : il vient au centre et remplit l'écran ; transition douce */
function zoomTo(el,now){const z=EL[+el.dataset.el][ZOOM_TEXT?'zt':'z'],wi=el.closest('.wall-in'),k=Math.min(W*.94/z[2],H*.88/z[3]),tx=W/2-(z[0]+z[2]/2)*k,ty=H/2-(z[1]+z[3]/2)*k;
  if(now){wi.style.transition='none'}wi.style.transform=`translate(${tx}px,${ty}px) scale(${k})`;if(now){void wi.offsetWidth;wi.style.transition=''}
  box.querySelectorAll('.el.on').forEach(e=>e.classList.remove('on'));el.classList.add('on');zoomed=el;room.classList.add('zoomed');ui()}
function unzoom(){if(!zoomed)return;const wi=zoomed.closest('.wall-in');wi.style.transform=`translate(${K[1]}px,${K[2]}px) scale(${K[0]})`;zoomed.classList.remove('on');zoomed=null;room.classList.remove('zoomed');ui()}

/* ---------- l'œil : on le fait glisser (ou, de près, on touche l'endroit où l'on veut le poser) ---------- */
function eyeDrag(svg,W0=PW,H0=PH,place=placeEye){const eye=svg.querySelector('.eye'),toSvg=e=>{const r=svg.getBoundingClientRect();return[(e.clientX-r.left)/r.width*W0,(e.clientY-r.top)/r.height*H0]};let on=0;
  eye.addEventListener('pointerdown',e=>{e.stopPropagation();on=1;eye.setPointerCapture(e.pointerId);eye.classList.add('grab')});
  eye.addEventListener('pointermove',e=>{if(on){const[x,y]=toSvg(e);place(svg,x,y)}});
  eye.addEventListener('pointerup',e=>{on=0;eye.classList.remove('grab');e.stopPropagation()});eye.addEventListener('click',e=>e.stopPropagation());
  eye.addEventListener('keydown',e=>{const d={ArrowLeft:[-10,0],ArrowRight:[10,0],ArrowUp:[0,-10],ArrowDown:[0,10]}[e.key];if(!d)return;e.preventDefault();e.stopPropagation();place(svg,+eye.dataset.x+d[0],+eye.dataset.y+d[1])});
  svg.addEventListener('click',e=>{if(zoomed&&zoomed.contains(svg)){e.stopPropagation();const[x,y]=toSvg(e);place(svg,x,y)}})}

/* ---------- toucher un cadre pour s'en approcher, un texte pour le lire ; on change de mur avec les flèches ---------- */
scene.addEventListener('click',e=>{const n=e.target.closest('.note');if(n){openNote(n.dataset.note);return}
  const el=e.target.closest('.el');if(el&&el!==zoomed){zoomTo(el);return}if(!el&&zoomed)unzoom()});
scene.addEventListener('keydown',e=>{if(e.key!='Enter'&&e.key!=' ')return;const n=e.target.closest('.note'),el=e.target.closest('.el');if(n){e.preventDefault();openNote(n.dataset.note)}else if(el&&!e.target.closest('.eye')){e.preventDefault();el===zoomed?unzoom():zoomTo(el)}});
$('room-prev').onclick=()=>go(cur-1);$('room-next').onclick=()=>go(cur+1);$('room-back').onclick=unzoom;

/* ---------- fenêtre de lecture ---------- */
const pop=$('note-pop');let lastFocus=null;
function openNote(k){lastFocus=document.activeElement;$('note-title').textContent=NOTES[k].t;$('note-body').innerHTML=NOTES[k].l;pop.hidden=false;pop.querySelector('.pop-card').scrollTop=0;$('note-ok').focus({preventScroll:true})}
const closeNote=()=>{pop.hidden=true;if(lastFocus)lastFocus.focus()};$('note-ok').onclick=closeNote;pop.onclick=e=>{if(e.target===pop)closeNote()};

/* ---------- invitation à passer en paysage : disparaît seule quand on tourne le téléphone, ou d'un toucher ---------- */
const portrait=matchMedia('(orientation: portrait)'),rot=$('room-rot');
portrait.addEventListener('change',()=>{if(!portrait.matches)rot.hidden=true});rot.onclick=()=>rot.hidden=true;

/* ---------- entrée, sortie, animations ---------- */
function loop(now){raf=requestAnimationFrame(loop);if(document.hidden)return;if(cur==0)stepArrows(box.querySelector('#r-arrows'),now);if(cur==1){stepBreath(now);stepSky(now)}else sLast=0}
function open(){build();$('start').hidden=true;room.hidden=false;zoomed=null;room.classList.remove('zoomed');layout();go(0);rot.hidden=!portrait.matches;if(!raf)raf=requestAnimationFrame(loop)}
function close(){room.hidden=true;$('start').hidden=false;cancelAnimationFrame(raf);raf=0;if(zoomed)unzoom();pop.hidden=true;$('go-sky').focus()}
$('go-sky').onclick=open;$('room-quit').onclick=close;
addEventListener('resize',()=>{if(!room.hidden)layout()});
addEventListener('keydown',e=>{if(room.hidden)return;if(e.key=='Escape'){if(!pop.hidden)closeNote();else if(zoomed)unzoom();return}
  if(!pop.hidden||zoomed)return;if(e.key=='ArrowRight')go(cur+1);if(e.key=='ArrowLeft')go(cur-1)})})();
