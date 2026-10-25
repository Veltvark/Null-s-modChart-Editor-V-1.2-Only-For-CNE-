const $=s=>document.querySelector(s),clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
/* Modificadores estilo Nightmare Vision (wiki "Modcharts & Modifiers"). Cada uno tiene un valor por strum que se anima con easing. */
const GR={pos:['Posición','#7b93ff'],mov:['Movimiento','#f2a56b'],acc:['Aceleración','#4fd6a8'],r3d:['Rotación 3D','#6ee7ff'],rg:['Rotación de gráficos','#ff86b8'],vis:['Visibilidad','#c19cff'],esc:['Escala','#58d3e6'],ruta:['Ruta','#e8cf7a'],cam:['Cámara','#9bb4ff']};
const FX={};
const MD=(g,k,v,d,h,o)=>{FX[k]=Object.assign({g,n:k,v,d,h,c:GR[g][1]},o||{})};
MD('pos','transformX',100,4,'Mueve el campo en X (px).');MD('pos','transformY',100,4,'Mueve el campo en Y (px).');MD('pos','transformZ',0.2,4,'Profundidad: 1 = 1000 px.');
MD('pos','opponentSwap',1,6,'Intercambia los campos de lado.');MD('pos','flip',1,6,'Cada columna pasa a la opuesta.');MD('pos','invert',1,6,'Intercambia columnas contiguas.');
MD('mov','drunk',1,8,'Las notas se mueven en X como una onda coseno.');MD('mov','drunkSpeed',2,4,'Velocidad de drunk.');MD('mov','drunkPeriod',1,4,'Periodo de drunk.');MD('mov','drunkOffset',1,4,'Desfase de drunk.');
MD('mov','tipsy',1,8,'Sube y baja en Y con onda coseno.');MD('mov','tipsySpeed',1,4,'Velocidad de tipsy.');MD('mov','tipsyOffset',1,4,'Desfase de tipsy.');
MD('mov','tipZ',0.2,8,'Sube y baja en Z (3D).');MD('mov','tipZSpeed',1,4,'Velocidad de tipZ.');MD('mov','tipZOffset',1,4,'Desfase de tipZ.');MD('mov','beat',1,8,'Los campos se sacuden en X al ritmo del beat.');
MD('acc','boost',1,8,'Las notas se frenan y luego aceleran al acercarse.');MD('acc','wave',1,8,'Las notas aceleran y frenan como una ola.');MD('acc','brake',1,8,'Aceleran mucho y frenan cerca del receptor.');
MD('r3d','localrotateX',60,8,'Gira el campo en X sobre su centro (grados).',{deg:1});MD('r3d','localrotateY',60,8,'Gira el campo en Y sobre su centro (grados).',{deg:1});MD('r3d','localrotateZ',45,8,'Gira el campo en Z sobre su centro (grados).',{deg:1});
MD('r3d','centerrotateX',45,8,'Gira respecto al centro de la pantalla en X (grados).',{deg:1});MD('r3d','centerrotateY',45,8,'Gira respecto al centro de la pantalla en Y (grados).',{deg:1});MD('r3d','centerrotateZ',30,8,'Gira respecto al centro de la pantalla en Z (grados).',{deg:1});
MD('rg','confusion',90,8,'Gira los gráficos de notas y receptores (grados).',{deg:1});MD('rg','noteAngle',45,8,'Gira solo las notas (grados).',{deg:1});MD('rg','receptorAngle',45,8,'Gira solo los receptores (grados).',{deg:1});
MD('vis','alpha',0.5,6,'Opacidad de notas. OJO: 1 = invisible.');MD('vis','stealth',1,6,'0-0.5 cambia color, 0.5-1 baja la opacidad.');MD('vis','dark',0.5,6,'Opacidad de los receptores (1 = invisibles).');
MD('vis','hidden',1,6,'Las notas desaparecen al acercarse al receptor.');MD('vis','hiddenOffset',100,4,'Punto donde actúa hidden (px).');MD('vis','sudden',1,6,'Las notas aparecen de golpe al acercarse.');MD('vis','suddenOffset',0,4,'Punto donde actúa sudden (px).');MD('vis','blink',1,8,'Las notas parpadean.');
MD('esc','mini',0.5,6,'Reduce todo el campo.');MD('esc','miniX',0.5,6,'Reduce el ancho del campo.');MD('esc','miniY',0.5,6,'Reduce el alto del campo.');
MD('esc','receptorScaleX',1.5,6,'Escala X de los receptores (1 = normal).',{base:1});MD('esc','receptorScaleY',1.5,6,'Escala Y de los receptores (1 = normal).',{base:1});
MD('esc','noteScaleX',1.5,6,'Escala X de las notas (1 = normal).',{base:1});MD('esc','noteScaleY',1.5,6,'Escala Y de las notas (1 = normal).',{base:1});
MD('ruta','reverse',1,8,'Invierte el scroll (se invierte solo en downscroll).');MD('ruta','cross',1,8,'Invierte el scroll en las columnas 2 y 3.');MD('ruta','alternate',1,8,'Invierte una columna sí y otra no.');
MD('ruta','centered',1,8,'Centra el campo en vertical.');MD('ruta','infinite',1,8,'Las notas siguen un camino en forma de infinito.');MD('ruta','receptorScroll',1,8,'Los receptores recorren la pantalla y las notas quedan quietas.');
const CM=(k,n,v,d)=>{FX[k]={g:'cam',n,v,d,c:GR.cam[1],cam:1,h:''}};CM('camZoom','Zoom de cámara',0.1,4);CM('camShake','Temblor de cámara',0.01,4);CM('flash','Flash del HUD',0,4);
const FOV=640;
const EA={linear:x=>x,quadOut:x=>1-(1-x)*(1-x),quadIn:x=>x*x,quadInOut:x=>x<.5?2*x*x:1-2*(1-x)*(1-x),cubeOut:x=>1-Math.pow(1-x,3),cubeInOut:x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2,sineInOut:x=>-(Math.cos(Math.PI*x)-1)/2,backOut:x=>1+2.70158*Math.pow(x-1,3)+1.70158*Math.pow(x-1,2),elasticOut:x=>x==0||x==1?x:Math.pow(2,-10*x)*Math.sin((x*10-.75)*2*Math.PI/3)+1,bounceOut:x=>{const n=7.5625,d=2.75;if(x<1/d)return n*x*x;if(x<2/d)return n*(x-=1.5/d)*x+.75;if(x<2.5/d)return n*(x-=2.25/d)*x+.9375;return n*(x-=2.625/d)*x+.984375}};
const AR=['←','↓','↑','→'],T=[['opp','Oponente (todos)',[0,1,2,3]],['player','Jugador (todos)',[4,5,6,7]],['all','Los 8 strums',[0,1,2,3,4,5,6,7]]];
for(let i=0;i<4;i++)T.push(['o'+i,'Oponente '+AR[i],[i]]);for(let i=0;i<4;i++)T.push(['p'+i,'Jugador '+AR[i],[i+4]]);
const IDS=g=>(T.find(x=>x[0]==g)||T[1])[2],lane=e=>FX[e.t].cam?2:e.tg[0]=='o'?0:1;
let uid=0,S={bpm:155,spb:4,len:256,ev:[],sel:null,head:0,zoom:14,play:false,name:'modchart',ds:0,spd:2.5,lay:0};
const mk=(t,tg,s,d,v,e)=>({id:++uid,t,tg,s,d,v,e:e||'quadOut'});
S.ev=[mk('camZoom','all',16,4,.1),mk('drunk','all',16,16,1,'sineInOut'),mk('drunk','all',40,8,0),mk('tipsy','player',32,16,1,'sineInOut'),mk('localrotateX','all',48,12,60,'quadInOut'),mk('beat','all',64,32,1,'linear'),mk('localrotateX','all',80,8,0),mk('reverse','player',96,8,1,'cubeInOut'),mk('centerrotateY','all',112,16,45,'backOut'),mk('flash','all',128,4,0)];
try{const j=JSON.parse(localStorage.getItem('mcs2'));if(j&&j.ev){Object.assign(S,{bpm:j.bpm,spb:j.spb,len:j.len,ev:j.ev.filter(e=>FX[e.t])});uid=Math.max(0,...j.ev.map(e=>e.id))}}catch(e){}
const sel=()=>S.ev.find(e=>e.id==S.sel);
function save(){try{localStorage.setItem('mcs2',JSON.stringify({bpm:S.bpm,spb:S.spb,len:S.len,ev:S.ev}))}catch(e){}}
