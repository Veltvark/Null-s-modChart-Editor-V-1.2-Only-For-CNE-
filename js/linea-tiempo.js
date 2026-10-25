/* ---------- línea de tiempo ---------- */
function rTL(){
 const z=S.zoom;$('#tr').style.width=S.len*z+60+'px';$('#tr').style.setProperty('--z',z+'px');
 let h='';for(let i=0;i<=S.len;i+=4)h+=`<i class="tk${i%16?'':' m'}" style="left:${i*z}px">${i%16?'':i}</i>`;$('#ru').innerHTML=h;
 const L=['','',''];
 S.ev.forEach(e=>{L[lane(e)]+=`<div class="bk${e.id==S.sel?' s':''}" data-id="${e.id}" style="left:${e.s*z}px;width:${Math.max(e.d,1)*z}px;background:${FX[e.t].c}" title="${FX[e.t].n} · step ${e.s}">${FX[e.t].n}</div>`});
 L.forEach((x,i)=>$('#l'+i).innerHTML=x);
}
let dr=null;const tx=ev=>ev.clientX-$('#tr').getBoundingClientRect().left;
$('#tr').addEventListener('pointerdown',ev=>{const b=ev.target.closest('.bk'),x=tx(ev);
 if(b){S.sel=+b.dataset.id;const e=sel();dr={e,ox:x,os:e.s};rInsp();rTL()}else{dr={sc:1};S.head=clamp(Math.round(x/S.zoom),0,S.len);if(S.play)aSync()}});
addEventListener('pointermove',ev=>{if(!dr)return;const x=tx(ev);if(dr.sc){S.head=clamp(Math.round(x/S.zoom),0,S.len);if(S.play)aSync()}else dr.e.s=clamp(Math.round(dr.os+(x-dr.ox)/S.zoom),0,S.len);rTL()});
addEventListener('pointerup',()=>{if(dr&&!dr.sc){rInsp();rCode();save()}dr=null});
