/* ---------- vista previa ---------- */
const cv=$('#cv'),cx=cv.getContext('2d');
const SK=new Image();SK.src='assets/default.png';
const SP={st:[[1289,2,154,156],[862,600,157,154],[862,444,157,154],[1289,160,154,156]],nt:[[1133,2,154,157],[703,600,157,154],[703,444,157,154],[919,215,154,157]]};
function spr(r,sc,al){if(!SK.complete)return;cx.globalAlpha=al;cx.drawImage(SK,r[0],r[1],r[2],r[3],-r[2]*sc/2,-r[3]*sc/2,r[2]*sc,r[3]*sc);cx.globalAlpha=1}
const STG={w:1280,h:720,sz:112,gap:80};
/* Calcula las posiciones de los 8 strums a partir del ancho del escenario (1280x720):
   disposición 0 = ambos campos centrados con un hueco en medio; 1 = middlescroll (jugador en el centro). */
function layout(){const f=4*STG.sz;let o0,p0;
 if(S.lay==1){o0=60;p0=(STG.w-f)/2}else{const tot=2*f+STG.gap;o0=(STG.w-tot)/2;p0=o0+f+STG.gap}
 const x=[],fc=[];for(let i=0;i<8;i++){const b=i<4?o0:p0;x.push(b+(i%4)*STG.sz);fc.push(b+f/2)}
 return{x,f:fc,D:p0-o0}}
function fit(){const r=cv.parentElement.getBoundingClientRect(),d=devicePixelRatio||1;cv.width=r.width*d;cv.height=r.height*d}
const HC=['#c24b99','#00ffff','#12fa05','#f9393f'];
function draw(){
 const d=devicePixelRatio||1,W=cv.width/d,H=cv.height/d;cx.setTransform(d,0,0,d,0,0);cx.clearRect(0,0,W,H);
 const LAY=layout(),fs=Math.max(.05,Math.min((W-16)/STG.w,(H-16)/STG.h));
 cx.save();cx.translate((W-1280*fs)/2,(H-720*fs)/2);cx.scale(fs,fs);
 cx.fillStyle='#0d0d0d';cx.fillRect(0,0,1280,720);cx.strokeStyle='#5a5a5a';cx.lineWidth=2/fs;cx.strokeRect(0,0,1280,720);
 cx.beginPath();cx.rect(0,0,1280,720);cx.clip();
 const m=sim(S.head),t=S.head,sm=60000/S.bpm/S.spb,pxs=.45*S.spd*sm,ch=S.chart,tot=Math.max(1,720/pxs)*1.3+4;
 const o={L:LAY,ds:S.ds==1,tm:m.tm,bt:m.bt};
 cx.save();cx.translate(640,360);cx.scale(1+m.cz,1+m.cz);if(m.sh)cx.translate((Math.random()-.5)*m.sh*700,(Math.random()-.5)*m.sh*700);cx.translate(-640,-360);
 for(let i=0;i<8;i++){
  const dd=i%4;o.note=false;o.dist=0;const rc=path(m.V,i,o);
  if(rc.s>0&&rc.a>0){cx.save();cx.translate(rc.x,rc.y);cx.rotate(rc.rz*Math.PI/180);cx.scale(.7*rc.sx,.7*rc.sy);spr(SP.st[dd],1,rc.a*.9);cx.restore()}
  const dN=(st,len)=>{o.note=true;o.dist=(Math.max(st,t)-t)*pxs;const r=path(m.V,i,o);if(r.s<=0)return;
   if(len>0){o.dist=(st+len-t)*pxs;const r2=path(m.V,i,o);cx.save();cx.globalAlpha=.55*r.a;cx.strokeStyle=HC[dd];cx.lineCap='round';cx.lineWidth=25*Math.max(r.sx,.05);cx.beginPath();cx.moveTo(r.x,r.y);cx.lineTo(r2.x,r2.y);cx.stroke();cx.restore()}
   if(st>=t&&r.a>0){cx.save();cx.translate(r.x,r.y);cx.rotate(r.rz*Math.PI/180);cx.scale(.7*r.sx,.7*r.sy);spr(SP.nt[dd],1,r.a);cx.restore()}};
  if(ch){const A=ch.n[i];let lo=0,hi=A.length;while(lo<hi){const q=(lo+hi)>>1;if((A[q][0]+A[q][1])/sm<t)lo=q+1;else hi=q}
   for(let q=lo;q<A.length&&A[q][0]/sm<t+tot;q++)dN(A[q][0]/sm,A[q][1]/sm)}
  else for(let n=Math.ceil(t);n<t+tot;n++)if((n+(i>=4?4:0))%8==dd*2)dN(n,0);
 }
 cx.restore();if(m.fl){cx.fillStyle='rgba(255,255,255,'+m.fl*.5+')';cx.fillRect(0,0,1280,720)}
 cx.restore();
}
