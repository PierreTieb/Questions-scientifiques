/* Sons du théâtre de l'orage : tout est synthétisé dans le navigateur (aucun enregistrement, donc aucun droit d'auteur).
   Musique : une petite valse originale, jouée « au loin » (filtrée, réverbérée, faible), en boucle ;
   machinerie quand les décors bougent (poulies des cintres, frottement sur le plancher) ; tonnerre ; applaudissements. */
window.ThAudio=(()=>{let AC=null,out=null,muted=false,mus=null,app=null,rum=null,run=0;const BUF={};
  function ctx(){if(!AC){try{AC=new(window.AudioContext||window.webkitAudioContext)();const comp=AC.createDynamicsCompressor();out=AC.createGain();out.gain.value=muted?0:1;out.connect(comp);comp.connect(AC.destination)}catch(e){AC=null}}
    if(AC&&AC.state!='running')AC.resume();return AC}
  const rnd=(a,b)=>a+Math.random()*(b-a),hz=m=>440*Math.pow(2,(m-69)/12);
  /* bruit blanc, ou brun (grave et sourd, pour le tonnerre) */
  function noise(c,sec,brown){const n=Math.floor(c.sampleRate*sec),b=c.createBuffer(1,n,c.sampleRate),d=b.getChannelData(0);let l=0;
    for(let i=0;i<n;i++){const w=Math.random()*2-1;if(brown){l=(l+.02*w)/1.02;d[i]=l*3.5}else d[i]=w}return b}
  const white=c=>BUF.w||(BUF.w=noise(c,4)),brown=c=>BUF.b||(BUF.b=noise(c,8,1));
  function src(c,buf,loop){const s=c.createBufferSource();s.buffer=buf;s.loop=!!loop;return s}
  function filt(c,type,f,q){const b=c.createBiquadFilter();b.type=type;b.frequency.value=f;if(q)b.Q.value=q;return b}
  function chain(...n){for(let i=0;i<n.length-1;i++)n[i].connect(n[i+1]);return n[n.length-1]}

  /* ---------- la musique : 16 mesures à trois temps, mélodie de piano, basse et accords « poum-tchi-tchi » ---------- */
  const BEAT=.62,BAR=3*BEAT,LEN=16*BAR,TAIL=3.5;
  const MEL=[[[69,2],[72,1]],[[70,1],[69,1],[67,1]],[[69,2],[65,1]],[[74,2],[72,1]],[[72,1],[69,1],[72,1]],[[76,2],[74,1]],[[72,1],[69,1],[67,1]],[[65,3]],
    [[77,2],[76,1]],[[76,1],[73,1],[69,1]],[[74,2],[70,1]],[[72,1],[70,1],[67,1]],[[69,1],[72,1],[77,1]],[[72,2],[74,1]],[[70,1],[67,1],[64,1]],[[65,2]]];
  const CH={F:[41,[53,57,60]],C7:[36,[52,55,58]],Bb:[46,[53,58,62]],Dm:[38,[53,57,62]],A7:[45,[55,61,64]],Gm:[43,[55,58,62]],D7:[38,[54,57,60]]};
  const HAR=[['F'],['C7'],['F'],['Bb'],['F'],['C7'],['F','F','C7'],['F'],['Dm'],['A7'],['Gm'],['C7'],['F'],['D7'],['Gm','Gm','C7'],['F']];
  /* une note : quelques harmoniques, attaque brève puis extinction ; écrite « en boucle » (ce qui dépasse la fin revient au début) */
  function note(L,R,sr,m,t,dur,vol,P,tau,pan){const n=L.length,w=2*Math.PI*hz(m)/sr,i0=Math.floor(t*sr),len=Math.floor((dur+.6)*sr),sum=P.reduce((a,p)=>a+p,0),gl=vol*(1-pan)/sum,gr=vol*pan/sum,
      H=P.length,cs=P.map((_,h)=>Math.cos(w*(h+1))),sn=P.map((_,h)=>Math.sin(w*(h+1))),x=P.map(()=>0),y=P.map(()=>1),att=Math.floor(.012*sr),end=Math.floor(dur*sr),k1=Math.exp(-1/(tau*sr)),k2=Math.exp(-1/(.12*sr));
    /* les sinus sont obtenus par rotation (pas de Math.sin à chaque échantillon) et l'enveloppe par multiplication : le calcul reste rapide */
    let e=1;for(let i=0,j=i0%n;i<len;i++){if(i>=att){e*=i>=end?k1*k2:k1;if(e<1e-4)break}
      let v=0;for(let h=0;h<H;h++){const a=x[h]*cs[h]+y[h]*sn[h];y[h]=y[h]*cs[h]-x[h]*sn[h];x[h]=a;v+=P[h]*a}
      v*=i<att?e*i/att:e;L[j]+=v*gl;R[j]+=v*gr;if(++j==n)j=0}}
  /* réverbération (filtres en peigne et passe-tout) et filtre passe-bas : le son vient « du fond de la salle » ; deux tours de boucle pour que la fin s'enchaîne au début */
  function room(x,sr,off){const n=x.length,D=[558,594,639,678,278,220].map(d=>d+off),B=D.map(d=>new Float32Array(d)),I=[0,0,0,0,0,0],F=[0,0,0,0],y=new Float32Array(n),a=Math.exp(-2*Math.PI*1700/sr);let lp=0;
    for(let k=0;k<2*n;k++){const xi=x[k<n?k:k-n];let wet=0;
      for(let c=0;c<4;c++){const b=B[c],o=b[I[c]];F[c]=o*.7+F[c]*.3;b[I[c]]=xi+F[c]*.8;if(++I[c]==D[c])I[c]=0;wet+=o}wet*=.25;
      for(let c=4;c<6;c++){const b=B[c],o=b[I[c]],v=o-wet*.5;b[I[c]]=wet+o*.5;if(++I[c]==D[c])I[c]=0;wet=v}
      lp=(1-a)*(xi*.5+wet*.55)+a*lp;if(k>=n)y[k-n]=lp}return y}
  function renderMusic(){if(BUF.m)return BUF.m;const sr=22050,n=Math.round(LEN*sr),L=new Float32Array(n),R=new Float32Array(n);
    MEL.forEach((bar,k)=>{let b=0;bar.forEach(([m,d])=>{note(L,R,sr,m,k*BAR+b*BEAT+rnd(0,.015),d*BEAT*.95,.32,[1,.45,.18,.08],.55,.55);b+=d})});
    HAR.forEach((h,k)=>{const t=k*BAR,[root]=CH[h[0]];note(L,R,sr,root,t,BEAT*.9,.3,[1,.5,.15],.3,.45);
      [1,2].forEach(j=>{const[,acc]=CH[h[j]||h[0]];acc.forEach(m=>note(L,R,sr,m,t+j*BEAT,BEAT*.6,.07,[1,.3],.18,.4))})});
    const b=ctx().createBuffer(2,n,sr);b.getChannelData(0).set(room(L,sr,0));b.getChannelData(1).set(room(R,sr,13));return BUF.m=b}

  /* ---------- applaudissements : des centaines de claquements de mains, calculés échantillon par échantillon, en boucle ---------- */
  function renderApplause(){if(BUF.a)return BUF.a;const c=ctx(),sr=c.sampleRate,D=8,n=D*sr,b=c.createBuffer(2,n,sr),L=b.getChannelData(0),R=b.getChannelData(1),cl=Math.floor(.05*sr);
    for(let k=0;k<D*34;k++){const at=Math.floor(Math.random()*n),f=rnd(700,2300),w=2*Math.PI*f/sr,al=Math.sin(w)/(2*rnd(1.2,2.5)),a0=1+al,
      b0=al/a0,b2=-al/a0,a1=-2*Math.cos(w)/a0,a2=(1-al)/a0,pan=Math.random(),v=rnd(.35,1);let x1=0,x2=0,y1=0,y2=0;
      for(let i=0;i<cl;i++){const x=(Math.random()*2-1)*Math.exp(-i/(.007*sr)),y=b0*x+b2*x2-a1*y1-a2*y2;x2=x1;x1=x;y2=y1;y1=y;const j=(at+i)%n;L[j]+=y*v*(1-pan)*1.6;R[j]+=y*v*pan*1.6}}
    return BUF.a=b}

  /* ---------- bruitages ---------- */
  /* poulie des cintres : la corde frotte, la roue grince par petits coups */
  function pulley(dur=1.6){const c=ctx();if(!c)return;const t=c.currentTime+.02,g=c.createGain();
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.09,t+.15);g.gain.setValueAtTime(.09,t+dur-.3);g.gain.linearRampToValueAtTime(0,t+dur);
    const s=src(c,white(c));chain(s,filt(c,'bandpass',rnd(550,750),.9),g,out);s.start(t,rnd(0,2));s.stop(t+dur+.1);
    const lfo=c.createOscillator(),lg=c.createGain();lfo.frequency.value=rnd(7,10);lg.gain.value=.04;lfo.connect(lg);lg.connect(g.gain);lfo.start(t);lfo.stop(t+dur);
    for(let u=t+.1;u<t+dur-.2;u+=rnd(.26,.38)){const o=c.createOscillator(),q=c.createGain(),f=rnd(950,1250);o.type='sawtooth';
      o.frequency.setValueAtTime(f,u);o.frequency.linearRampToValueAtTime(f*1.22,u+.13);q.gain.setValueAtTime(0,u);q.gain.linearRampToValueAtTime(.022,u+.03);q.gain.linearRampToValueAtTime(0,u+.15);
      chain(o,filt(c,'bandpass',1700,4),q,out);o.start(u);o.stop(u+.17)}}
  /* décor qui glisse sur le plancher : roulettes qui grondent et bois qui frotte */
  function slide(dur=1.6){const c=ctx();if(!c)return;const t=c.currentTime+.02;
    [[brown(c),'lowpass',260,.5],[white(c),'bandpass',1100,.05]].forEach(([buf,ty,f,v])=>{const g=c.createGain(),s=src(c,buf);
      g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.2);g.gain.setValueAtTime(v,t+dur-.4);g.gain.linearRampToValueAtTime(0,t+dur);
      const lfo=c.createOscillator(),lg=c.createGain();lfo.frequency.value=rnd(5,13);lg.gain.value=v*.45;lfo.connect(lg);lg.connect(g.gain);lfo.start(t);lfo.stop(t+dur);
      chain(s,filt(c,ty,f,.8),g,out);s.start(t,rnd(0,3));s.stop(t+dur+.1)})}
  /* tonnerre : « muffled » étouffé dans le nuage, « far » au loin, « near » tout près et fracassant */
  function thunder(kind){const c=ctx();if(!c)return;const K={muffled:[260,.55,3],far:[750,.6,4],near:[2200,1,5.5]}[kind],[f,v,d]=K,t=c.currentTime+.02;
    const g=c.createGain(),lp=filt(c,'lowpass',f,.7),s=src(c,brown(c));lp.frequency.setValueAtTime(f,t);lp.frequency.exponentialRampToValueAtTime(Math.max(90,f*.2),t+d);
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+(kind=='near'?.02:.25));let u=t+.3;
    for(let k=0;k<4;k++){u+=rnd(.25,.6);g.gain.linearRampToValueAtTime(v*rnd(.45,.85)*(1-k*.17),u)}g.gain.setTargetAtTime(0,u,d/5);
    chain(s,lp,g,out);s.start(t,rnd(0,2));s.stop(t+d+2);
    if(kind!='muffled'){const cg=c.createGain(),cs=src(c,white(c)),a=kind=='near'?.9:.12;cg.gain.setValueAtTime(a,t);cg.gain.setTargetAtTime(0,t,kind=='near'?.12:.05);
      chain(cs,filt(c,'highpass',kind=='near'?600:1200),cg,out);cs.start(t,rnd(0,2));cs.stop(t+1.2)}}
  /* grondement qui monte pendant que la tension s'accumule */
  function rumble(on){const c=ctx();if(!c)return;const t=c.currentTime;
    if(on&&!rum){const g=c.createGain(),s=src(c,brown(c),1);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.55,t+4);chain(s,filt(c,'lowpass',140),g,out);s.start();rum={s,g}}
    else if(!on&&rum){rum.g.gain.cancelScheduledValues(t);rum.g.gain.setTargetAtTime(0,t,.25);rum.s.stop(t+1.5);rum=null}}
  function applause(on){const c=ctx();if(!c)return;const t=c.currentTime;
    if(on&&!app){const g=c.createGain(),s=src(c,renderApplause(),1);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(1.4,t+1.2);chain(s,filt(c,'lowpass',5000),g,out);s.start();app={s,g}}
    else if(!on&&app){app.g.gain.setTargetAtTime(0,t,.3);app.s.stop(t+2);app=null}}
  /* musique : démarre en fondu, très bas ; « fade » la fait disparaître (fin du spectacle) */
  function music(on){const c=ctx();if(!c)return;const t=c.currentTime,id=++run;
    if(mus){const m=mus;m.g.gain.cancelScheduledValues(t);m.g.gain.setTargetAtTime(0,t,on?.1:.8);m.s.stop(t+(on?.6:4));mus=null}
    if(on)setTimeout(()=>{if(id!=run||!AC)return;let buf;try{buf=renderMusic()}catch(e){return}const g=AC.createGain(),s=src(AC,buf,1),u=AC.currentTime;g.gain.setValueAtTime(0,u);g.gain.linearRampToValueAtTime(.3,u+3);
      chain(s,g,out);s.start();mus={s,g}},30)}
  function stop(){music(false);applause(false);rumble(false)}
  function mute(m){muted=m;if(out)out.gain.setTargetAtTime(m?0:1,AC.currentTime,.05)}
  return{unlock:ctx,music,pulley,slide,thunder,rumble,applause,stop,mute}})();
