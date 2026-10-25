/* ---------- simulación de modificadores (vista previa) ---------- */
const MODS=Object.keys(FX).filter(k=>!FX[k].cam);
function sim(t){
 const V={};MODS.forEach(k=>V[k]=Array(8).fill(FX[k].base||0));
 let cz=0,sh=0,fl=0;
 for(const e of [...S.ev].sort((a,b)=>a.s-b.s)){
  if(t<e.s)continue;const p=Math.min(1,(t-e.s)/Math.max(e.d,.001)),k=EA[e.e](p);
  if(e.t=='camZoom'){cz+=e.v*(1-p);continue}
  if(e.t=='camShake'){if(p<1)sh+=e.v;continue}
  if(e.t=='flash'){fl=Math.max(fl,1-p);continue}
  const a=V[e.t];if(a)IDS(e.tg).forEach(i=>{a[i]+=(e.v-a[i])*k});
 }
 return{V,cz,sh,fl,tm:t*60/S.bpm/S.spb,bt:t/S.spb};
}
function rot(p,a,b,c){let x=p[0],y=p[1],z=p[2],t;const r=Math.PI/180;a*=r;b*=r;c*=r;
 t=y*Math.cos(a)-z*Math.sin(a);z=y*Math.sin(a)+z*Math.cos(a);y=t;
 t=x*Math.cos(b)+z*Math.sin(b);z=-x*Math.sin(b)+z*Math.cos(b);x=t;
 t=x*Math.cos(c)-y*Math.sin(c);y=x*Math.sin(c)+y*Math.cos(c);x=t;return[x,y,z]}
/* Posición, escala, ángulo y alpha de un receptor (o de una nota a distancia "dist" px del receptor). El script .hx usa la misma matemática. */
function path(V,i,o){
 const g=k=>V[k][i],col=i%4,f=i<4?0:1,L=o.L,tm=o.tm,d=o.dist,P=Math.PI;
 const topY=50,half=STG.sz/2,botY=STG.h-50-STG.sz,x0=L.x;
 let r=g('reverse')+((col==1||col==2)?g('cross'):0)+(col%2?g('alternate'):0);
 r=((r%2)+2)%2;if(r>1)r=2-r;if(o.ds)r=1-r;
 let recY=topY+(botY-topY)*r;recY+=(360-half-recY)*g('centered');
 let yo=d;
 if(g('boost')){const ny=yo*1.5/((yo+600)/720);yo+=clamp(g('boost')*(ny-yo),-400,400)}
 if(g('brake')){const ny=yo*clamp(yo/720,0,2);yo+=clamp(g('brake')*(ny-yo),-400,400)}
 yo+=g('wave')*20*Math.sin(d/38);
 const dir=1-2*r;
 let x=x0[i]+half,y=recY+half+dir*yo,z=g('transformZ')*1000;
 x+=(x0[f*4+3-col]-x0[i])*g('flip')+(x0[f*4+(col^1)]-x0[i])*g('invert')+(x0[(1-f)*4+col]-x0[i])*g('opponentSwap');
 x+=g('transformX');y+=g('transformY');
 y+=g('tipsy')*Math.cos(tm*(1.2+g('tipsySpeed'))+col*1.8+g('tipsyOffset'))*45;
 x+=g('drunk')*Math.cos(tm*(1+g('drunkSpeed'))+col*(.2+g('drunkPeriod'))+d*(10+g('drunkOffset'))/720)*56;
 z+=g('tipZ')*Math.cos(tm*(1.2+g('tipZSpeed'))+col*1.8+g('tipZOffset'))*500;
 if(g('beat')){let fb=o.bt+.2;const ev=Math.floor(fb)%2!=0;fb-=Math.floor(fb);
  if(fb<.5){let am;if(fb<.2){am=fb/.2;am*=am}else{am=1-(fb-.2)/.3;am=1-(1-am)*(1-am)}let sh=20*am*Math.sin(d/30+P/2);if(ev)sh=-sh;x+=g('beat')*sh}}
 if(g('infinite')){const th=d/160;x+=g('infinite')*140*Math.sin(th);y+=g('infinite')*30*Math.sin(2*th)}
 if(!o.note&&g('receptorScroll'))y=((y+g('receptorScroll')*tm*320)%720+720)%720;
 const fcx=L.f[i];
 let q=rot([x-fcx,y-360,z],g('localrotateX'),g('localrotateY'),g('localrotateZ'));
 q=rot([q[0]+fcx-640,q[1],q[2]],g('centerrotateX'),g('centerrotateY'),g('centerrotateZ'));
 const dd=FOV+q[2],s=dd>1?FOV/dd:0,rd=P/180,fsx=Math.abs(Math.cos((g('localrotateY')+g('centerrotateY'))*rd)),fsy=Math.abs(Math.cos((g('localrotateX')+g('centerrotateX'))*rd));
 const sc0=1-.5*g('mini'),sx=sc0*(1-.5*g('miniX'))*(o.note?g('noteScaleX'):g('receptorScaleX')),sy=sc0*(1-.5*g('miniY'))*(o.note?g('noteScaleY'):g('receptorScaleY'));
 let a=1;
 if(o.note){a=1-clamp(g('alpha'),0,1);a*=1-clamp((g('stealth')-.5)*2,0,1);
  if(g('hidden'))a*=1-g('hidden')*clamp(1-(d-(120+g('hiddenOffset')))/100,0,1);
  if(g('sudden'))a*=1-g('sudden')*clamp((d-(200+g('suddenOffset')))/100,0,1);
  if(g('blink'))a*=1-g('blink')*(Math.sin(tm*10)>0?0:1)}
 else a=1-clamp(g('dark'),0,1);
 return{x:640+q[0]*s,y:360+q[1]*s,s,rz:g('confusion')+(o.note?g('noteAngle'):g('receptorAngle'))+g('localrotateZ')+g('centerrotateZ'),sx:sx*s*fsx,sy:sy*s*fsy,a:clamp(a,0,1)}
}
