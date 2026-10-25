/* ---------- audio y chart ---------- */
const AU=[null,null,null],stp=()=>60/S.bpm/S.spb;
function setAudio(n,f){const o=AU[n];if(o){o.pause();URL.revokeObjectURL(o.src);AU[n]=null}
 if(!f){$('#an'+n).textContent='Sin cargar';return}
 const a=new Audio(URL.createObjectURL(f));AU[n]=a;$('#an'+n).textContent=f.name;
 a.onloadedmetadata=()=>{const l=Math.ceil(a.duration/stp()/16)*16;if(l>S.len){S.len=l;sync();rTL();rCode();save()}if(S.play)aSync()}}
function aSync(){AU.forEach(a=>{if(a)try{a.currentTime=S.head*stp()}catch(e){}})}
function pp(p){S.play=p;$('#bp').textContent=p?'⏸ Pausa':'▶ Reproducir';if(p){if(S.head>=S.len)S.head=0;aSync();AU.forEach(a=>a&&a.play().catch(()=>{}))}else AU.forEach(a=>a&&a.pause())}
function loadChart(j){const n=Array.from({length:8},()=>[]);let last=0;
 (j.strumLines||[]).forEach(sl=>{const g=sl.position=='dad'?0:sl.position=='boyfriend'?4:-1;if(g<0)return;
  (sl.notes||[]).forEach(o=>{if(o.id>=0&&o.id<4){n[g+o.id].push([o.time,o.sLen||0]);last=Math.max(last,o.time+(o.sLen||0))}})});
 n.forEach(a=>a.sort((x,y)=>x[0]-y[0]));S.chart={n,last};if(j.scrollSpeed){S.spd=j.scrollSpeed;$('#spd').value=j.scrollSpeed}}
function fitLen(){S.len=Math.max(S.len,Math.ceil(S.chart.last/(60000/S.bpm/S.spb)/16)*16+32)}
