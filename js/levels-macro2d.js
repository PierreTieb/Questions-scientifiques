/* Étages 9 à 19 : des enfants en forêt au Superamas de la Vierge (même contrat que levels-micro2d.js). */

/* 9 · deux enfants de 1,50 m en forêt (1 unité = 0,35 m) ; la fourmi est à leurs pieds, le garçon la montre du doigt */
/* enfant debout, pieds en (x,0) ; o : peau, cheveux, haut, bas, chaussures, fille, salut, cible de la main tendue */
function kid(c,x,o,t){const sk=o.skin,hy=-3.92,ds=shade(o.shirt),seg=(a,b,d,e)=>path(p=>{p.moveTo(a,b);p.lineTo(d,e)});c.save();c.translate(x,0);c.lineCap='round';c.lineJoin='round';
  c.beginPath();c.ellipse(.05,0,.85,.13,0,0,TAU);c.fillStyle='rgba(30,20,10,.25)';c.fill();
  /* jambes et chaussures */
  tubeS(c,path(p=>[-.18,.18].forEach(dx=>{p.moveTo(dx,-2.1);p.lineTo(dx*1.1,-.2)})),o.pants,.3);[-.2,.2].forEach(dx=>egg(c,dx*1.1+.06,-.11,.26,.13,o.shoes));
  /* buste (robe à pois pour la fille, t-shirt rayé pour le garçon), éclairé à gauche */
  const tor=new Path2D();if(o.girl){tor.moveTo(-.42,-3.45);tor.lineTo(.42,-3.45);tor.lineTo(.7,-1.72);tor.quadraticCurveTo(0,-1.62,-.7,-1.72);tor.closePath()}else rrect(tor,-.46,-3.45,.92,1.5,.2);
  if(!o.girl){const gp=c.createLinearGradient(-.5,0,.5,0);gp.addColorStop(0,mix(o.pants,'#ffffff',.2));gp.addColorStop(1,shade(o.pants)[2]);c.fillStyle=gp;c.fillRect(-.46,-2.2,.92,.32)}
  const gt=c.createLinearGradient(-.65,0,.65,0);gt.addColorStop(0,mix(o.shirt,'#ffffff',.3));gt.addColorStop(.45,o.shirt);gt.addColorStop(1,ds[2]);fill(c,tor,gt);
  c.save();c.clip(tor);if(o.girl){c.fillStyle='rgba(255,255,255,.55)';for(let i=0;i<14;i++){c.beginPath();c.arc(-.55+(i%4)*.36+(i>>2)%2*.18,-3.2+(i>>2)*.4,.05,0,TAU);c.fill()}}
    else{c.fillStyle='rgba(255,255,255,.4)';c.fillRect(-.5,-2.95,1,.14);c.fillRect(-.5,-2.62,1,.08)}c.restore();
  /* bras : l'un tendu vers la cible (ou qui salue), l'autre le long du corps */
  const arm=(sx,hx,hy2)=>{const mx=lerp(sx,hx,.42),my=lerp(-3.25,hy2,.42);tubeS(c,seg(sx,-3.25,mx,my),o.shirt,.25);tubeS(c,seg(mx,my,hx,hy2),sk,.19);ball(c,hx,hy2,.12,sk)};
  const tg=o.pt?[o.pt[0]-x,o.pt[1]]:null,wave=Math.sin(t*3)*.25;
  if(tg){const d=Math.hypot(tg[0]-.45,tg[1]+3.25),L=1.85;arm(.45,.45+(tg[0]-.45)/d*L,-3.25+(tg[1]+3.25)/d*L)}else arm(.45,.62,-1.6);
  o.wave?arm(-.45,-1.15+wave*.3,-4.55):arm(-.45,-.62,-1.6);
  /* cou, tête, cheveux, visage */
  if(o.girl)egg(c,-.46,-3.62,.2,.45,o.hair,.35);
  c.fillStyle=shade(sk)[2];c.fillRect(-.1,-3.6,.2,.22);ball(c,-.4,hy+.02,.09,sk);ball(c,.4,hy+.02,.09,sk);ball(c,0,hy,.4,sk);
  const hp=new Path2D();hp.arc(0,hy-.02,.43,Math.PI*1.02,Math.PI*1.98);hp.quadraticCurveTo(.2,hy-.2,-.1,hy-.12);hp.quadraticCurveTo(-.35,hy-.05,-.43,hy+.06);hp.closePath();
  const gh=c.createLinearGradient(-.4,hy-.45,.3,hy);gh.addColorStop(0,mix(o.hair,'#ffffff',.3));gh.addColorStop(1,o.hair);fill(c,hp,gh);
  c.beginPath();c.arc(0,hy-.02,.34,Math.PI*1.2,Math.PI*1.45);c.strokeStyle='rgba(255,255,255,.35)';c.lineWidth=.04;c.stroke();
  [-.14,.14].forEach(ex=>{c.beginPath();c.ellipse(ex,hy+.02,.07,.08,0,0,TAU);c.fillStyle='#fff';c.fill();disc(c,ex+.012,hy+.03,.045,'#3b2a1e');disc(c,ex,hy+.012,.016,'#fff');
    c.beginPath();c.arc(ex,hy-.06,.07,Math.PI*1.15,Math.PI*1.85);c.strokeStyle=o.hair;c.lineWidth=.025;c.stroke()});
  disc(c,-.25,hy+.15,.06,'rgba(240,110,110,.3)');disc(c,.25,hy+.15,.06,'rgba(240,110,110,.3)');
  c.beginPath();c.arc(0,hy+.09,.035,.2*Math.PI,.9*Math.PI);c.strokeStyle=shade(sk)[2];c.lineWidth=.025;c.stroke();
  c.strokeStyle='#7a3b2a';c.lineWidth=.035;c.beginPath();c.arc(0,hy+.13,.12,.2*Math.PI,.8*Math.PI);c.stroke();c.restore()}
/* tronc cylindrique : dégradé de gauche (éclairé) à droite (ombre) */
function trunk(c,x,w,y0,y1,col){const g=c.createLinearGradient(x-w/2,0,x+w/2,0),s=shade(col);g.addColorStop(0,mix(col,'#ffffff',.18));g.addColorStop(.35,col);g.addColorStop(1,s[2]);c.fillStyle=g;c.fillRect(x-w/2,y0,w,y1-y0)}
function L9(){const far=Array.from({length:30},(_,i)=>[rnd(-28,28),rnd(.4,1.5),i%3]),FC=['#b2c8b4','#97b09a','#7d9580'],
    litter=['#b5651d','#d08a3a','#8a5a2a','#c7a04a'].map(()=>relief(Array.from({length:55},()=>{const r=rnd(.08,.2);return[rnd(-30,30),rnd(.02,.4),r,r*rnd(.35,.6),rnd(0,TAU)]}))),
    fern=path(p=>[[-3.6,1],[4.6,.8],[-9,1.2]].forEach(([x,s])=>{for(let k=0;k<7;k++){const a=-Math.PI/2+(k-3)*.32,l=s*rnd(1.4,1.9),ex=x+Math.cos(a)*l,ey=Math.sin(a)*l*.8;
      p.moveTo(x,0);p.quadraticCurveTo(x+Math.cos(a)*l*.5,-l*.7*Math.abs(Math.sin(a)),ex,ey);
      for(let j=1;j<9;j++){const t=j/9,px=lerp(x,ex,t),py=lerp(0,ey,t)-Math.sin(t*Math.PI)*l*.12,ll=.22*(1-t*.8),na=a+Math.PI/2;p.moveTo(px,py);p.lineTo(px+Math.cos(na)*ll,py+Math.sin(na)*ll-ll*.4);p.moveTo(px,py);p.lineTo(px-Math.cos(na)*ll,py-Math.sin(na)*ll-ll*.4)}}})),
    bark=path(p=>[[-6.5,2.2],[7.6,1.6]].forEach(([x,w])=>{for(let k=0;k<9;k++){let bx=x+rnd(-w*.42,w*.42),by=0;p.moveTo(bx,by);while(by>-30){by-=rnd(.5,1.4);bx+=rnd(-.08,.08);p.lineTo(bx,by)}}})),
    moss=relief(Array.from({length:30},()=>[-6.5+rnd(-1,1),-rnd(0,2.5),rnd(.1,.25),rnd(.06,.15),0])),
    shafts=path(p=>[[-3,1.6],[2.5,1],[6,1.3]].forEach(([x,w])=>{p.moveTo(x-8,-30);p.lineTo(x-8+w,-30);p.lineTo(x+w*1.6,0);p.lineTo(x,0);p.closePath()}));
  return{a:[.55,0],c:[.3,-2.2],
    back:(c,v)=>{const gs=c.createLinearGradient(0,-14,0,0);gs.addColorStop(0,'#eef5e4');gs.addColorStop(1,'#b5d0b8');c.fillStyle=gs;c.fillRect(v.x0,v.y0,v.x1-v.x0,Math.max(0,-v.y0));
      far.forEach(([x,w,l])=>{if(l<2){c.fillStyle=FC[l];c.fillRect(x-w/2,-60,w,60)}else trunk(c,x,w,-60,0,FC[2])});
      const gl=c.createLinearGradient(0,-30,0,0);gl.addColorStop(0,'rgba(255,250,220,.28)');gl.addColorStop(1,'rgba(255,250,220,0)');fill(c,shafts,gl);
      trunk(c,-6.5,2.2,-60,0,'#6b4f3a');trunk(c,7.6,1.6,-60,0,'#6b4f3a');stroke(c,bark,'rgba(35,22,12,.45)',.07);drawRelief(c,moss,'#6f9a3c',.25);
      const gg=c.createLinearGradient(0,0,0,3);gg.addColorStop(0,'#6b5236');gg.addColorStop(1,'#4e3a26');c.fillStyle=gg;c.fillRect(v.x0,0,v.x1-v.x0,Math.max(0,v.y1));
      ['#b5651d','#d08a3a','#8a5a2a','#c7a04a'].forEach((col,i)=>drawRelief(c,litter[i],col,.3));c.lineCap='round';stroke(c,fern,'#3f7a2c',.05);
      [[2.7,.45],[3.1,.3]].forEach(([x,s])=>{trunk(c,x,.12*s/.3,-s*.9,0,'#efe4cf');c.save();c.beginPath();c.ellipse(x,-s*.9,s*.55,s*.42,0,Math.PI,TAU);c.closePath();
        const gm=c.createRadialGradient(x-s*.2,-s*1.15,0,x,-s*.9,s*.6);gm.addColorStop(0,'#ff7a5c');gm.addColorStop(1,'#a8281c');c.fillStyle=gm;c.fill();c.restore();disc(c,x-s*.2,-s*1.05,s*.07,'#fff');disc(c,x+s*.18,-s*1.0,s*.06,'#fff')})},
    main:(c,v)=>{kid(c,-.85,{skin:'#8D5A3B',hair:'#2a1a12',shirt:'#E85D9A',pants:'#2BB3A3',shoes:'#f4f4f4',girl:1,wave:1},v.t);
      kid(c,1.5,{skin:'#F0C29A',hair:'#c4772c',shirt:'#F28C28',pants:'#2F5FC8',shoes:'#3a414c',pt:[.62,-.15]},v.t)}}}

/* 10 · les grands arbres (1 unité = 4 m) : des chênes de 25 à 32 m ; les enfants, au pied, mesurent moins d'un vingtième de leur hauteur */
function L10(){const T=[[-13,6.8,.32,2],[-9.5,7.2,.35,2.2],[-6,6.4,.3,1.9],[-2.8,7.9,.4,2.3],[3.6,7.5,.38,2.2],[6.8,6.2,.3,1.8],[10,7,.33,2],[13.5,7.4,.36,2.1]],cr=[],hi=[],
    tp=T.map(([x,h,w])=>path(p=>{p.moveTo(x-w,0);p.quadraticCurveTo(x-w*.4,-.4,x-w*.35,-h+.6);p.lineTo(x+w*.35,-h+.6);p.quadraticCurveTo(x+w*.4,-.4,x+w,0);p.closePath()})),
    br=path(p=>T.forEach(([x,h])=>{for(let k=0;k<4;k++){const y=-h*rnd(.55,.8),s=k%2?1:-1;p.moveTo(x,y);p.quadraticCurveTo(x+s*.5,y-.4,x+s*rnd(.8,1.3),y-rnd(.7,1.2))}})),
    farF=relief(Array.from({length:60},()=>{const r=rnd(1,2);return[rnd(-26,26),-rnd(3,5.5),r]})),bush=relief(Array.from({length:50},()=>{const r=rnd(.15,.45);return[rnd(-24,24),-rnd(0,.15),r,r*.75]}));
  T.forEach(([x,h,,r])=>{for(let k=0;k<12;k++){const a=rnd(0,TAU),d=Math.sqrt(Math.random())*r*.75,cx0=x+Math.cos(a)*d*1.2,cy0=-h+Math.sin(a)*d*.8,rr=r*rnd(.36,.5);cr.push([cx0,cy0,rr]);if(cy0<-h+.2)hi.push([cx0-rr*.2,cy0-rr*.25,rr*.45])}});
  cr.sort((a,b)=>a[1]-b[1]);const crowns=relief(cr),light=relief(hi);
  return{a:[.4,0],c:[0,-3.6],main:(c,v)=>{const gs=c.createLinearGradient(0,-12,0,0);gs.addColorStop(0,'#78b8ec');gs.addColorStop(1,'#d6ecf5');c.fillStyle=gs;c.fillRect(v.x0,v.y0,v.x1-v.x0,Math.max(0,-v.y0));
      c.globalAlpha*=.6;drawRelief(c,farF,'#8fb59a',.12);c.globalAlpha=v.w;
      const gg=c.createLinearGradient(0,0,0,2);gg.addColorStop(0,'#6a8a40');gg.addColorStop(1,'#4c6a2c');c.fillStyle=gg;c.fillRect(v.x0,0,v.x1-v.x0,Math.max(0,v.y1));
      T.forEach(([x,,,r])=>{c.beginPath();c.ellipse(x+.6,.05,r*.9,.14,0,0,TAU);c.fillStyle='rgba(20,40,10,.25)';c.fill()});
      T.forEach(([x,,w],i)=>{const g=c.createLinearGradient(x-w,0,x+w,0);g.addColorStop(0,'#8a6a50');g.addColorStop(.4,'#6b4f3a');g.addColorStop(1,'#3e2c1f');fill(c,tp[i],g)});
      c.lineCap='round';tubeS(c,br,'#5e4532',.12);drawRelief(c,crowns,'#3f8a34',.35);drawRelief(c,light,'#5aa646',0);drawRelief(c,bush,'#3f7a2c',.3);
      v.tag('Chêne · 32 m',-2.8,-10.2,.9)}}}

/* 11 · la forêt vue d'en haut (1 unité = 300 m) : la forêt de Tronçais, au centre de la France ; les enfants sont dans la clairière */
function L11(){const edge=Array.from({length:40},(_,i)=>{const a=i/40*TAU,r=10+Math.sin(a*3)*1.6+Math.sin(a*7+1)*.8+rnd(-.4,.4);return[Math.cos(a)*r*1.2,Math.sin(a)*r*.85]}),
    inF=(x,y)=>{const a=Math.atan2(y/.85,x/1.2),i=Math.round((a<0?a+TAU:a)/TAU*40)%40,e=edge[i];return Math.hypot(x/1.2,y/.85)<Math.hypot(e[0]/1.2,e[1]/.85)-.2},
    forest=path(p=>{p.moveTo(...edge[0]);curve(p,[...edge,edge[0],edge[1]]);p.closePath()}),
    fc=['#e3c75a','#9cc25a','#b88a52','#c9d77a','#7fae4a'],fields=fc.map(()=>new Path2D()),sh=['#21521f','#2f6b2a','#3f8a34'],can=[[],[],[]],near=[[],[],[]];
  for(let x=-40;x<40;x+=rnd(.6,1.4))for(let y=-30;y<30;y+=rnd(.5,1.1))fields[Math.random()*fc.length|0].rect(x,y,rnd(.6,1.5),rnd(.5,1.2));
  /* la canopée : des dizaines de milliers de houppiers de 10 à 20 m, peints une fois dans une image (±15 unités) */
  const FE=15,canopy=off(2048,2048,(x,w)=>{const k=w/(2*FE),o=w/2;x.translate(o,o);x.scale(k,k);x.fillStyle='#2a5e26';x.fill(forest);x.clip(forest);
    sh.forEach((col,j)=>{x.fillStyle=col;x.beginPath();for(let i=0;i<26000;i++){const X=rnd(-FE,FE),Y=rnd(-FE,FE),r=rnd(.03,.065);x.moveTo(X+r,Y-r*j*.2);x.arc(X,Y-r*j*.2,r*(1-j*.2),0,TAU)}x.fill()})});
  for(let i=0;i<1400;i++){const a=rnd(0,TAU),r=rnd(.2,2),x=Math.cos(a)*r*1.25,y=Math.sin(a)*r;if(Math.hypot(x/.25,y/.2)>1.05)near[i%3].push(x,y,rnd(.035,.065))}
  const nearP=near.map(blobs),
    river=path(p=>curve(p,[[-40,-14],[-14,-9],[-6,-4],[3,-2.5],[8,1],[15,3],[40,9]])),road=path(p=>curve(p,[[-30,12],[-8,4],[-1.2,.9],[.3,.25],[2,-1],[9,-6],[30,-16]])),
    vil=path(p=>{for(let i=0;i<45;i++)p.rect(13+rnd(-.5,.5),7+rnd(-.4,.4),.05,.04)});
  return{a:[0,0],main:(c,v)=>{fields.forEach((p,i)=>fill(c,p,fc[i]));c.drawImage(canopy,-FE,-FE,2*FE,2*FE);
      c.beginPath();c.ellipse(0,0,.27,.22,0,0,TAU);c.fillStyle='#8fbf5a';c.fill();nearP.forEach((p,i)=>fill(c,p,sh[i]));
      c.lineCap='round';stroke(c,river,'#3a86d0',.07);stroke(c,road,'#d9c49a',Math.max(.025,1.5*v.px));fill(c,vil,'#c0563a');
      v.tag('Forêt de Tronçais',0,-6,.9);v.tag('Clairière',.3,0,sm(-.6,-.2,v.d)*(1-sm(.4,.7,v.d)))}}}

/* 12 · la France (1 unité ≈ 110 km, soit un degré de latitude) */
const LON0=2.5,LAT0=46.5,KF=111.32e3/1.1e5,FX=lo=>(lo-LON0)*KF*Math.cos(LAT0*R),FY=la=>-(la-LAT0)*KF;
function L12(){const land=path(p=>LAND.forEach(r=>{let a=1e9,b=-1e9,d=1e9,e=-1e9;for(let i=0;i<r.length;i+=2){a=Math.min(a,r[i]);b=Math.max(b,r[i]);d=Math.min(d,r[i+1]);e=Math.max(e,r[i+1])}
      if(b<-30||a>45||e<25||d>75)return;for(let i=0;i<r.length;i+=2)i?p.lineTo(FX(r[i]),FY(r[i+1])):p.moveTo(FX(r[i]),FY(r[i+1]));p.closePath()})),
    REL=[[6.9,45.8,1.3,1],[8.6,46.4,1.4,1],[10.6,46.7,1.3,1],[12.6,47.1,1.1,1],[.6,42.75,1,.8],[-.9,42.95,.7,.7],[2.9,45.3,1,.4],[6.9,48.1,.6,.35]],
    /* taches de verdure et de cultures, pour que le sol ne soit pas uni de près */
    tex=[0,1].map(()=>blobs(Array.from({length:500},()=>[rnd(-12,12),rnd(-9,9),rnd(.05,.4)]).flat())),
    CITY=[['Paris',48.86,2.35],['Lyon',45.76,4.83],['Marseille',43.3,5.37],['Bordeaux',44.84,-.58],['Toulouse',43.6,1.44],['Lille',50.63,3.06],['Strasbourg',48.58,7.75],['Nantes',47.22,-1.55]];
  return{a:[FX(2.69),FY(46.63)],main:(c,v)=>{fill(c,land,'#3F9D45');c.save();c.clip(land);
      REL.forEach(([lo,la,r,k])=>{const x=FX(lo),y=FY(la),g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(${k>.9?'240,242,245':'196,178,140'},${.85*k})`);g.addColorStop(.5,`rgba(190,170,130,${.5*k})`);g.addColorStop(1,'rgba(190,170,130,0)');c.fillStyle=g;c.fillRect(x-r,y-r,2*r,2*r)});
      fill(c,tex[0],'rgba(30,70,25,.18)');fill(c,tex[1],'rgba(160,180,90,.18)');
      /* la forêt de Tronçais : une dizaine de kilomètres de chênes */
      const tx=FX(2.69),ty=FY(46.63),gt=c.createRadialGradient(tx,ty,0,tx,ty,.07);gt.addColorStop(0,'rgba(31,74,28,.95)');gt.addColorStop(.6,'rgba(31,74,28,.7)');gt.addColorStop(1,'rgba(31,74,28,0)');c.fillStyle=gt;c.fillRect(tx-.07,ty-.07,.14,.14);
      c.restore();
      CITY.forEach(([n,la,lo])=>{disc(c,FX(lo),FY(la),2.6*v.px,'#ffffff');v.tag(n,FX(lo),FY(la))})}}}

/* 13 · la Terre (rayon 6 371 km = 3,6 unités), vue au-dessus de la France ; peinte une fois dans une image (océans, terres, déserts, glaces, nuages, ombre) */
function L13(){const p0=LAT0*R,pr=(lo,la)=>{const l=(lo-LON0)*R,f=la*R,x=Math.cos(f)*Math.sin(l),y=-(Math.cos(p0)*Math.sin(f)-Math.sin(p0)*Math.cos(f)*Math.cos(l)),
      cc=Math.sin(p0)*Math.sin(f)+Math.cos(p0)*Math.cos(f)*Math.cos(l);if(cc>=0)return[x,y,1];const n=Math.hypot(x,y)||1;return[x/n,y/n,0]};
  const land=path(p=>LAND.forEach(r=>{let vis=0;const Q=[];for(let i=0;i<r.length;i+=2){const q=pr(r[i],r[i+1]);vis|=q[2];Q.push(q)}if(!vis)return;Q.forEach((q,i)=>i?p.lineTo(q[0],q[1]):p.moveTo(q[0],q[1]));p.closePath()})),
    ER=3.6,E=1.15,img=off(2048,2048,(x,w)=>{const k=w/(2*E);x.translate(w/2,w/2);x.scale(k,k);
      const blot=(lo,la,r,f)=>{const q=pr(lo,la);if(!q[2])return;x.fillStyle=f;x.beginPath();x.arc(q[0],q[1],r*R,0,TAU);x.fill()},
        grad=(lo,la,r,c0,c1)=>{const q=pr(lo,la);if(!q[2])return;const g=x.createRadialGradient(q[0],q[1],0,q[0],q[1],r*R);g.addColorStop(0,c0);g.addColorStop(1,c1);x.fillStyle=g;x.fillRect(q[0]-r*R,q[1]-r*R,2*r*R,2*r*R)};
      const go=x.createRadialGradient(-.3,-.3,0,0,0,1);go.addColorStop(0,'#2f92ea');go.addColorStop(1,'#123a80');x.fillStyle=go;x.beginPath();x.arc(0,0,1,0,TAU);x.fill();x.save();x.clip();
      x.fillStyle='#3d9a45';x.fill(land);x.save();x.clip(land);
      for(let i=0;i<3000;i++)blot(rnd(-90,95),rnd(-60,85),rnd(.6,3.5),Math.random()<.5?'rgba(25,70,25,.2)':'rgba(150,175,85,.18)');
      [[10,23,16],[45,24,10],[-5,30,7],[20,-22,9],[60,40,8]].forEach(([lo,la,r])=>grad(lo,la,r,'rgba(218,186,124,.95)','rgba(205,170,110,0)'));
      [[8,46.2,3,.9],[12,47,2.4,.9],[.5,42.7,1.6,.7],[-5,32,3,.5],[44,42,3,.6],[30,62,6,.15]].forEach(([lo,la,r,k])=>grad(lo,la,r,`rgba(240,240,236,${k})`,'rgba(190,170,130,0)'));
      x.restore();grad(0,90,14,'rgba(245,250,255,.85)','rgba(245,250,255,0)');
      x.filter='blur(3px)';for(let i=0;i<220;i++){const q=pr(rnd(-90,95),rnd(-65,85));if(!q[2])continue;x.fillStyle=`rgba(255,255,255,${rnd(.25,.6)})`;x.beginPath();x.ellipse(q[0],q[1],rnd(.02,.09),rnd(.01,.03),rnd(-.3,.3),0,TAU);x.fill()}x.filter='none';
      const sh=x.createRadialGradient(-.45,-.45,.15,0,0,1.02);sh.addColorStop(0,'rgba(0,0,20,0)');sh.addColorStop(.65,'rgba(0,0,20,.12)');sh.addColorStop(1,'rgba(0,0,20,.6)');x.fillStyle=sh;x.fillRect(-1,-1,2,2);
      const sp=x.createRadialGradient(-.4,-.42,0,-.4,-.42,.4);sp.addColorStop(0,'rgba(255,255,255,.22)');sp.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=sp;x.fillRect(-1,-1,2,2);x.restore()});
  return{a:[0,0],main:c=>{const ga=c.createRadialGradient(0,0,ER*.95,0,0,ER*1.13);ga.addColorStop(0,'rgba(111,176,255,.65)');ga.addColorStop(1,'rgba(111,176,255,0)');c.fillStyle=ga;c.fillRect(-ER*1.2,-ER*1.2,ER*2.4,ER*2.4);
    c.drawImage(img,-E*ER,-E*ER,2*E*ER,2*E*ER)}}}

/* 14 · la Terre et la Lune (1 unité = 100 000 km) : 384 400 km les séparent, 30 fois le diamètre de la Terre ; la Lune est 3,7 fois plus petite */
function L14(){const r=3.844,a=-35*R,mx=Math.cos(a)*r,my=Math.sin(a)*r;
  return{a:[0,0],main:(c,v)=>{c.strokeStyle='rgba(255,255,255,.22)';c.lineWidth=v.px;c.beginPath();c.arc(0,0,r,0,TAU);c.stroke();
    ball(c,mx,my,Math.max(.01737,.9*v.px),'#c9c6c0');v.tag('Lune',mx,my)}}}

/* 15 · le système solaire jusqu'à Neptune (30 ua ; 1 ua = 0,15 unité). Le Soleil et les planètes sont dessinés à leur vraie taille, donc presque invisibles ;
   seul le Soleil garde un halo, de plus en plus petit et pâle quand on s'éloigne. Le nom de chaque planète s'affiche quand son orbite passe dans l'écran */
const MSS=30.07*AU/4.5,KA=AU/MSS;
function L15(){const PL=[['Mercure',.387,'#9a8f86',110],['Vénus',.723,'#E8C68A',200],['Terre',1,'#6fa8ff',40],['Mars',1.524,'#C1502E',300],['Jupiter',5.203,'#d8b48a',20],['Saturne',9.537,'#e8d29c',150],['Uranus',19.19,'#9fd8e0',250],['Neptune',30.07,'#6f8ff8',70]]
    .map(([n,a,col,an])=>[n,a*KA,col,Math.cos(an*R)*a*KA,-Math.sin(an*R)*a*KA]),SR=6.96e8/MSS,ring=(c,r0,r1,f)=>{c.beginPath();c.arc(0,0,r1,0,TAU);c.arc(0,0,r0,TAU,0,true);c.fillStyle=f;c.fill()};
  return{a:[KA*Math.cos(40*R),-KA*Math.sin(40*R)],
    back:(c,v)=>{const px=v.px;ring(c,2.2*KA,3.3*KA,'rgba(176,160,144,.14)');ring(c,30*KA,50*KA,'rgba(159,176,200,.07)');c.lineWidth=px;
      PL.forEach(([n,r,col,x,y])=>{if(r*v.q>1e6)return;c.strokeStyle=n=='Terre'?'rgba(140,190,255,.35)':'rgba(255,255,255,.18)';c.beginPath();c.arc(0,0,r,0,TAU);c.stroke();disc(c,x,y,1.3*px,col);
        const f=r*v.q/v.mn;v.tag(n,x,y,sm(.47,.41,f)*(1-sm(.29,.23,f)))})},
    main:(c,v)=>{const rp=SR*v.q;if(rp>=12){glow(c,0,0,SR*3,'#ffb347',.8);ball(c,0,0,SR,'#FFC23A')}
      else{const k=rp/12,Rr=12*Math.pow(k,.15),a=Math.min(1,Math.pow(k,.12));glow(c,0,0,Rr*2.6*v.px,'#ffb347',a);disc(c,0,0,Rr*v.px,rgba('#fff4c0',a))}
      v.tag('Soleil',0,0,sm(-1.2,-.6,v.d))}}}

/* 16 · les étoiles voisines à moins de 12 al, à leur vraie position (distance en al, ascension droite en h, déclinaison en °) ; 1 unité = 2,64 al */
const NEAR=[['Proxima du Centaure',4.24,14.5,-62.7,'#ff9a6a',4],['Alpha du Centaure',4.37,14.66,-60.8,'#fff0c8',9,1],['Étoile de Barnard',5.96,17.96,4.7,'#ff8a5a',4,1],['Wolf 359',7.86,10.94,7,'#ff7a5a',3],
  ['Lalande 21185',8.31,11.06,35.97,'#ff9a6a',4],['Sirius',8.6,6.75,-16.7,'#cfe0ff',11,1],['Luyten 726-8',8.7,1.65,-17.95,'#ff7a5a',3],['Ross 154',9.69,18.83,-23.8,'#ff8a5a',3],['Ross 248',10.3,23.7,44.2,'#ff7a5a',3],
  ['Epsilon Eridani',10.5,3.55,-9.46,'#ffc890',5,1],['Lacaille 9352',10.7,23.1,-35.85,'#ff9a6a',4],['Ross 128',11,11.8,.8,'#ff8a5a',3],['EZ Aquarii',11.1,22.64,-15.3,'#ff7a5a',3],['Procyon',11.46,7.65,5.2,'#fff6e0',9,1],
  ['61 Cygni',11.4,21.12,38.75,'#ffb070',5],['Struve 2398',11.5,18.71,59.6,'#ff8a5a',3],['Groombridge 34',11.6,.3,44,'#ff9a6a',3],['Epsilon Indi',11.9,22.05,-56.8,'#ffb070',5],['Tau Ceti',11.9,1.73,-15.9,'#ffe6b0',6,1]];
function L16(){const k=LY/2.5e16,pj=(d,ra,de)=>{const a=ra*15*R,b=de*R,X=Math.cos(b)*Math.cos(a)*d*k,Y=Math.sin(b)*d*k,Z=-Math.cos(b)*Math.sin(a)*d*k;return[X*.94+Z*.34,-Y*.9+Z*.2]},
    S=NEAR.map(([n,d,ra,de,col,s,lk])=>[...pj(d,ra,de),col,s,`${n} · ${d.toLocaleString('fr-FR')} al`,lk]),
    lines=path(p=>S.forEach(([x,y,,,,lk])=>{if(lk){p.moveTo(0,0);p.lineTo(x,y)}})),
    bg=Array.from({length:110},()=>{const d=Math.cbrt(rnd(1728,8000)),a=rnd(0,TAU),b=Math.asin(rnd(-1,1));return pj(d,a/(15*R),b/R)});
  /* comme pour les planètes : le nom d'une étoile s'affiche quand elle entre dans l'écran, et s'efface avant d'arriver au centre où elles se regroupent */
  return{a:[0,0],main:(c,v)=>{const px=v.px;stroke(c,lines,'rgba(255,255,255,.14)',px);bg.forEach(([x,y])=>disc(c,x,y,.9*px,'rgba(255,150,120,.55)'));
    S.forEach(([x,y,col,s,lb])=>{glow(c,x,y,s*1.6*px,col,.4);disc(c,x,y,s*.33*px,col);const f=Math.hypot(x,y)*v.q/v.mn;v.tag(lb,x,y,sm(.5,.45,f)*(1-sm(.38,.33,f)))})}}}

/* galaxie spirale dessinée une fois dans une image (rayon 1 = bord du disque ; l'image couvre ±1,2) */
function galaxy(n,arms,{tw=2.3,core='#ffe2a8',arm='#a898ff',seed=0,size=1024}={}){return off(size,size,(x,w)=>{const k=w/2.4,o=w/2,col=[core,arm,'#ff7fd0'];
  x.globalCompositeOperation='lighter';const gc=x.createRadialGradient(o,o,0,o,o,k*.35);gc.addColorStop(0,rgba(core,.6));gc.addColorStop(1,rgba(core,0));x.fillStyle=gc;x.fillRect(0,0,w,w);
  col.forEach((cc,ci)=>{x.fillStyle=rgba(cc,.35);for(let i=0;i<n;i++){let X,Y;
    if(ci==0){if(i>n*.25)break;const r=Math.abs(gauss())*.16,a=rnd(0,TAU);X=Math.cos(a)*r*1.3;Y=Math.sin(a)*r*.8}
    else{if(ci==2&&i>n*.08)break;const j=i%arms,t=Math.pow(Math.random(),.8),r=.12+t*.88,a=j*TAU/arms+Math.log(r/.12)*tw+gauss()*.32*(1-t*.4)+seed;X=Math.cos(a)*r;Y=Math.sin(a)*r}
    const s=rnd(.8,2.2)*w/1024;x.fillRect(o+X*k,o+Y*k,s,s)}})})}
const sunInMW=(()=>{const r=26000/5e4,a=TAU/4+Math.log(r/.12)*2.1;return[Math.cos(a)*r,Math.sin(a)*r]})();
/* 17 · la Voie lactée (100 000 al ; 1 unité ≈ 11 000 al) : le Soleil est à 26 000 al du centre, sur un bras */
function L17(){const img=galaxy(70000,4,{tw:2.1,size:2048}),R0=4.5;
  return{a:[sunInMW[0]*R0,sunInMW[1]*R0],main:(c,v)=>{c.drawImage(img,-1.2*R0,-1.2*R0,2.4*R0,2.4*R0);v.tag('Soleil',sunInMW[0]*R0,sunInMW[1]*R0,sm(-.6,0,v.d)*(1-sm(.6,1,v.d))*.9)}}}

/* 18 · les galaxies voisines (1 unité ≈ 635 000 al) : Andromède, deux fois plus grande que la Voie lactée, à 2,5 millions d'al */
function L18(){const K=LY/(2.54e6*LY/4),mw=[-1.8,.7],an=[mw[0]+3.8,mw[1]-1.2],tr=[an[0]+.5,an[1]+1.1],G=[galaxy(70000,4,{tw:2.1,size:512}),galaxy(30000,2,{tw:1.7,core:'#fff0d0',arm:'#d0c8ff',seed:1,size:512}),galaxy(8000,2,{core:'#ffe2a8',arm:'#a8c8ff',seed:2,size:256})],
    dw=Array.from({length:60},(_,i)=>{const b=i%2?mw:an,a=rnd(0,TAU),d=rnd(.08,1.6);return[b[0]+Math.cos(a)*d,b[1]+Math.sin(a)*d]}),far=Array.from({length:400},()=>[rnd(-45,45),rnd(-30,30)]),
    gx=(c,g,[x,y],r,a,sq)=>{c.save();c.translate(x,y);c.rotate(a);c.scale(1,sq);c.drawImage(g,-1.2*r,-1.2*r,2.4*r,2.4*r);c.restore()};
  return{a:mw,c:[mw[0]+1.9,mw[1]-.6],main:(c,v)=>{const px=v.px;far.forEach(([x,y])=>disc(c,x,y,.8*px,'rgba(220,214,255,.45)'));dw.forEach(([x,y])=>disc(c,x,y,1.1*px,'rgba(255,230,192,.7)'));
    gx(c,G[0],mw,5e4*K,0,1);gx(c,G[1],an,1.1e5*K,.6,.35);gx(c,G[2],tr,3e4*K,-.4,.6);
    const ta=1-sm(.3,.7,v.d);v.tag('Voie lactée',mw[0],mw[1],ta);v.tag('Andromède',an[0],an[1],ta);v.tag('Galaxie du Triangle',tr[0],tr[1],ta)}}}

/* 19 · le Superamas de la Vierge, ou Superamas local (environ 110 millions d'al ; 1 unité = 13,5 millions d'al).
   Une centaine de groupes et d'amas de galaxies, à plat le long du « plan supergalactique » ; au centre, l'amas de la Vierge (plus de 1 300 galaxies),
   à 54 millions d'al de notre Groupe local, qui est en bordure. Positions schématiques, distances réelles depuis le Groupe local */
function L19(){const LG=[-3.5,1.95],VC=[0,0],GR=[['Groupe de M81',[LG[0]+.55,LG[1]-.7]],['Groupe du Lion',[LG[0]+2.3,LG[1]-1.05]],['Amas du Fourneau',[-5.6,4.4]]],
    E=8,img=off(2048,2048,(x,w)=>{const k=w/(2*E);x.translate(w/2,w/2);x.scale(k,k);x.globalCompositeOperation='lighter';const px=1/k,
      gal=(X,Y,s,col)=>{if(Math.hypot(X-LG[0],Y-LG[1])<.25)return;x.fillStyle=col;x.fillRect(X,Y,s*px*2.6,s*px*2.6)},
      cols=['rgba(255,230,192,.4)','rgba(207,216,255,.4)','rgba(255,245,225,.5)'],
      group=([cx,cy],n,sg)=>{for(let i=0;i<n;i++)gal(cx+gauss()*sg,cy+gauss()*sg*.7,rnd(1.2,2.6),cols[i%3])};
      /* l'amas de la Vierge, avec M87 au centre */
      for(let i=0;i<1500;i++)gal(gauss()*.38,gauss()*.28,rnd(.7,1.8),cols[i%3]);
      const gc=x.createRadialGradient(0,0,0,0,0,.6);gc.addColorStop(0,'rgba(255,225,180,.45)');gc.addColorStop(1,'rgba(255,225,180,0)');x.fillStyle=gc;x.fillRect(-.6,-.6,1.2,1.2);
      /* nuages et groupes le long du plan, plus serrés près de la Vierge, et filaments qui en partent */
      const ax=[.875,-.487];for(let g=0;g<90;g++){const t=gauss()*3.2,o=gauss()*.85;group([VC[0]+ax[0]*t-ax[1]*o,VC[1]+ax[1]*t+ax[0]*o],rnd(6,40)|0,rnd(.06,.16))}
      [[2.2,2.8],[2.8,-1.8],[-1.2,-2.2],[1.5,1.2]].forEach(([ex,ey])=>{for(let n=0;n<500;n++){const t=Math.random();gal(ex*t+gauss()*.15,ey*t+gauss()*.15,rnd(1,2),cols[n%3])}});
      GR.forEach(([,p])=>group(p,60,.14));
      for(let i=0;i<4000;i++){const t=gauss()*4,o=gauss()*2.2;gal(ax[0]*t-ax[1]*o,ax[1]*t+ax[0]*o,rnd(1,1.8),'rgba(200,205,255,.3)')}}),
    /* le Groupe local, dessiné à part pour rester net : la Voie lactée, Andromède et le Triangle (positions de l'étage précédent, réduites) */
    kl=(2.54e6/4)/1.35e7,lg=[[-1.8,.7],[2,-.5],[2.5,.6]].map(([gx,gy])=>[LG[0]+gx*kl,LG[1]+gy*kl]);
  return{a:LG,c:[-1.75,.95],main:(c,v)=>{const px=v.px;c.drawImage(img,-E,-E,2*E,2*E);lg.forEach(([gx,gy],i)=>disc(c,gx,gy,(i<2?1.6:1.1)*px,'rgba(255,240,220,.9)'));
    v.tag('Amas de la Vierge',VC[0],VC[1],.95);v.tag('Groupe local',LG[0],LG[1],sm(-.8,-.2,v.d));GR.forEach(([n,p])=>v.tag(n,p[0],p[1],.8))}}}
