/* Accueil : tapisserie de points d'interrogation, dans des polices, tailles, couleurs et inclinaisons variées (tirées à chaque ouverture) */
(()=>{const F=["'Fredoka',sans-serif","'Nunito',sans-serif","Georgia,serif","'Courier New',monospace","'Comic Sans MS','Chalkboard SE',cursive","Impact,'Arial Black',sans-serif","'Times New Roman',serif","'Trebuchet MS',sans-serif","'Brush Script MT',cursive"],
  C=['#7B4DAE','#2F6BE0','#E8483C','#2BB3A3','#F28C28','#E85D9A','#45B74F'],pick=A=>A[Math.random()*A.length|0],cols=8,rows=12;let h='';
  for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){const x=(i+.5+(Math.random()-.5)*.7)/cols*100,y=(j+.5+(Math.random()-.5)*.7)/rows*100;
    h+=`<span style="left:${x.toFixed(1)}%;top:${y.toFixed(1)}%;font-family:${pick(F)};font-size:${18+Math.random()*52|0}px;color:${pick(C)};opacity:${(.18+Math.random()*.22).toFixed(2)};transform:translate(-50%,-50%) rotate(${(Math.random()-.5)*50|0}deg)">?</span>`}
  document.getElementById('qbg').innerHTML=h})();
