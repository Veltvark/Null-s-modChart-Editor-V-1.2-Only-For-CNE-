/* ---------- inspector ---------- */
const opts=(a,s)=>a.map(([k,n])=>`<option value="${k}"${k==s?' selected':''}>${n}</option>`).join('');
function rInsp(){const e=sel(),el=$('#ins');
 if(!e){el.innerHTML='<p class="mu">Selecciona un bloque o añade un efecto desde la paleta de la izquierda.</p>';return}
 const f=FX[e.t];
 el.innerHTML=`<label>Efecto<select onchange="upd('t',this.value);rInsp()">${opts(Object.keys(FX).map(k=>[k,FX[k].n]),e.t)}</select></label>`+
 (f.cam?'':`<label>Objetivo<select onchange="upd('tg',this.value);rTL()">${opts(T.map(t=>[t[0],t[1]]),e.tg)}</select></label>`)+
 `<div class="r2"><label>Step<input type="number" min="0" value="${e.s}" oninput="upd('s',+this.value)"></label><label>Duración (steps)<input type="number" min="0" value="${e.d}" oninput="upd('d',+this.value)"></label></div>`+
 (e.t=='flash'?'':`<label>Valor${f.deg?' (grados)':''}<input type="number" step="0.01" value="${e.v}" oninput="upd('v',+this.value)"></label>`)+
 (f.h?`<p class="mu" style="margin:0 0 9px">${f.h}</p>`:'')+
 (f.co?'':`<label>Easing<select onchange="upd('e',this.value)">${opts(Object.keys(EA).map(k=>[k,k]),e.e)}</select></label>`)+
 `<div class="r2"><button onclick="dup()">Duplicar</button><button class="dg" onclick="del()">Eliminar</button></div><p class="mu">Empieza en ${(e.s*60/S.bpm/S.spb).toFixed(2)} s y dura ${(e.d*60/S.bpm/S.spb).toFixed(2)} s</p>`}
function upd(k,v){const e=sel();if(!e)return;e[k]=v;rTL();rCode();save()}
function add(t){const e=mk(t,FX[t].cam?'all':'player',Math.round(S.head),FX[t].d,FX[t].v);S.ev.push(e);S.sel=e.id;render()}
function dup(){const e=sel();if(!e)return;const n={...e,id:++uid,s:e.s+Math.max(e.d,1)};S.ev.push(n);S.sel=n.id;render()}
function del(){S.ev=S.ev.filter(e=>e.id!=S.sel);S.sel=null;render()}
