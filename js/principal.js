/* ---------- controles ---------- */
function render(){rTL();rInsp();rCode();save()}
function rPal(q){q=(q||'').toLowerCase();let h='';for(const g in GR){const ks=Object.keys(FX).filter(k=>FX[k].g==g&&(k+FX[k].n+FX[k].h).toLowerCase().includes(q));if(!ks.length)continue;
 h+=`<h2 style="margin-top:10px">${GR[g][0]}</h2>`+ks.map(k=>`<button class="fx" title="${FX[k].h}" onclick="add('${k}')"><i style="background:${FX[k].c}"></i>${FX[k].n}</button>`).join('')}$('#fxl').innerHTML=h||'<p class="mu">Sin resultados.</p>'}
rPal('');$('#fq').oninput=e=>rPal(e.target.value);
const tab=n=>{$('#ins').style.display=n==1?'block':'none';$('#code').style.display=n==2?'flex':'none';$('#t1').className=n==1?'on':'';$('#t2').className=n==2?'on':''};
$('#t1').onclick=()=>tab(1);$('#t2').onclick=()=>tab(2);
$('#bp').onclick=()=>pp(!S.play);
$('#bs').onclick=()=>{S.head=0;$('#sc').scrollLeft=0;aSync()};
$('#zm').oninput=e=>{S.zoom=+e.target.value;rTL()};
for(const[id,k]of[['bpm','bpm'],['spb','spb'],['len','len']])$('#'+id).oninput=e=>{S[k]=Math.max(1,+e.target.value||1);rTL();rCode();save()};
function sync(){$('#bpm').value=S.bpm;$('#spb').value=S.spb;$('#len').value=S.len}
$('#bc').onclick=()=>{navigator.clipboard.writeText(gen()).then(()=>{$('#bc').textContent='¡Copiado!';setTimeout(()=>$('#bc').textContent='Copiar',1200)}).catch(()=>{})};
$('#bd').onclick=()=>dl('modchart.hx',gen());
$('#bg').onclick=()=>dl('modchart-proyecto.json',JSON.stringify({bpm:S.bpm,spb:S.spb,len:S.len,ev:S.ev}));
$('#fi').onchange=e=>{const fs=[...e.target.files];e.target.value='';Promise.all(fs.map(f=>f.text())).then(ts=>{let bad=0;ts.forEach(t=>{try{const j=JSON.parse(t);
 if(Array.isArray(j.ev)){S.bpm=j.bpm;S.spb=j.spb;S.len=j.len;S.ev=j.ev.filter(x=>FX[x.t]);uid=Math.max(0,...j.ev.map(x=>x.id))}
 else if(j.strumLines)loadChart(j);else{S.bpm=j.bpm||S.bpm;S.spb=j.stepsPerBeat||S.spb}}catch(x){bad++}});
 if(S.chart)fitLen();S.sel=null;sync();render();if(bad)alert('No se pudo leer '+bad+' archivo(s): no son JSON válidos.')})};
addEventListener('keydown',e=>{if(/INPUT|SELECT|TEXTAREA/.test(e.target.tagName))return;if(e.code=='Space'){e.preventDefault();$('#bp').click()}if(e.key=='Delete'&&S.sel)del()});
$('#lay').onchange=e=>S.lay=+e.target.value;$('#ds').onchange=e=>S.ds=+e.target.value;$('#spd').oninput=e=>S.spd=Math.max(.5,+e.target.value||2.5);
addEventListener('resize',fit);
let lt=0;function loop(ts){const dt=Math.min(.1,(ts-lt)/1000);lt=ts;
 if(S.play){const m=AU.find(a=>a&&!a.paused&&a.readyState>1);
  if(m)S.head=m.currentTime/stp();else S.head+=dt*S.bpm/60*S.spb;
  if(S.head>=S.len||(m&&m.ended)){S.head=Math.min(S.head,S.len);pp(false)}
  const sc=$('#sc'),x=S.head*S.zoom;if(x<sc.scrollLeft||x>sc.scrollLeft+sc.clientWidth-40)sc.scrollLeft=x-40}
 $('#ph').style.left=S.head*S.zoom+'px';$('#tm').textContent=`step ${Math.floor(S.head)} · beat ${(S.head/S.spb).toFixed(1)} · ${(S.head*60/S.bpm/S.spb).toFixed(2)} s`;draw();requestAnimationFrame(loop)}
sync();render();tab(1);fit();requestAnimationFrame(loop);
