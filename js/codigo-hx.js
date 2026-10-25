const DEPS={drunk:['drunkSpeed','drunkPeriod','drunkOffset'],tipsy:['tipsySpeed','tipsyOffset'],tipZ:['tipZSpeed','tipZOffset'],hidden:['hiddenOffset'],sudden:['suddenOffset']};
function usedMods(){const u=new Set();S.ev.forEach(e=>{if(!FX[e.t].cam){u.add(e.t);(DEPS[e.t]||[]).forEach(x=>u.add(x))}});return u}
function head(u){
 const h=k=>u.has(k),c=(k,s)=>h(k)?s+'\n':'',v=(k,d)=>h(k)?'m.'+k:d;
 const rTerms=[h('reverse')?'m.reverse':'',h('cross')?'(col == 1 || col == 2 ? m.cross : 0)':'',h('alternate')?'(col % 2 == 1 ? m.alternate : 0)':''].filter(Boolean).join(' + ')||'0.0';
 const blank=[...u].map(k=>k+': '+(FX[k].base||0)).join(', ');
 const LRX=v('localrotateX','0'),LRY=v('localrotateY','0'),LRZ=v('localrotateZ','0'),CRX=v('centerrotateX','0'),CRY=v('centerrotateY','0'),CRZ=v('centerrotateZ','0');
 return `
/*
this was made with Null's ModChart Editor (v1.2)
tysm claude :3!!
*/
var S = [];
var bx = []; var by = []; var bsv = [];
var M = [];
var ds = false;
var fov = 640;
var tm = 0.0; var bt = 0.0;

function postCreate() {
    ds = Options.downscroll;
    for (sl in strumLines.members)
        for (s in sl.members) {
            S.push(s); bx.push(s.x); by.push(s.y); bsv.push(s.scale.x);
            M.push(blank());
        }
}

function blank() { return {${blank}}; }

function sec(st) { return st * Conductor.stepCrochet / 1000; }

function ez(ids, k, v, st, ease) {
    for (i in ids) {
        if (st <= 0) { Reflect.setField(M[i], k, v); continue; }
        ezOne(M[i], k, v, st, ease);
    }
}
function ezOne(o, k, v, st, ease) {
    FlxTween.num(Reflect.field(o, k), v, sec(st), {ease: ease}, function(n) { Reflect.setField(o, k, n); });
}

function rot(x, y, z, a, b, c) {
    var r = 0.0174533; a *= r; b *= r; c *= r;
    var t = y * Math.cos(a) - z * Math.sin(a); z = y * Math.sin(a) + z * Math.cos(a); y = t;
    t = x * Math.cos(b) + z * Math.sin(b); z = -x * Math.sin(b) + z * Math.cos(b); x = t;
    t = x * Math.cos(c) - y * Math.sin(c); y = x * Math.sin(c) + y * Math.cos(c); x = t;
    return [x, y, z];
}

function pth(i, dist, isNote) {
    var m = M[i];
    var col = i % 4; var f = i < 4 ? 0 : 1;
    var fw = S[i].frameWidth; var fh = S[i].frameHeight;
    var topY = ds ? 720 - by[i] - fh : by[i];
    var botY = ds ? by[i] : 720 - by[i] - fh;
    var r = ${rTerms};
    r = ((r % 2) + 2) % 2; if (r > 1) r = 2 - r;
    if (ds) r = 1 - r;
    var recY = topY + (botY - topY) * r;
${c('centered','    recY += (360 - fh / 2 - recY) * m.centered;')}    var yo = dist;
${c('boost','    if (m.boost != 0) { var ny = yo * 1.5 / ((yo + 600) / 720); yo += Math.max(-400, Math.min(400, m.boost * (ny - yo))); }')}${c('brake','    if (m.brake != 0) { var nb = yo * Math.max(0, Math.min(2, yo / 720)); yo += Math.max(-400, Math.min(400, m.brake * (nb - yo))); }')}${c('wave','    yo += m.wave * 20 * Math.sin(dist / 38);')}    var dir = 1 - 2 * r;
    var x = bx[i] + fw / 2; var y = recY + fh / 2 + dir * yo; var z = 0.0;
${c('transformZ','    z += m.transformZ * 1000;')}${c('flip','    x += (bx[f * 4 + 3 - col] - bx[i]) * m.flip;')}${c('invert','    x += (bx[f * 4 + (col % 2 == 0 ? col + 1 : col - 1)] - bx[i]) * m.invert;')}${c('opponentSwap','    x += (bx[(1 - f) * 4 + col] - bx[i]) * m.opponentSwap;')}${c('transformX','    x += m.transformX;')}${c('transformY','    y += m.transformY;')}${c('tipsy','    y += m.tipsy * Math.cos(tm * (1.2 + m.tipsySpeed) + col * 1.8 + m.tipsyOffset) * 45;')}${c('drunk','    x += m.drunk * Math.cos(tm * (1 + m.drunkSpeed) + col * (0.2 + m.drunkPeriod) + dist * (10 + m.drunkOffset) / 720) * 56;')}${c('tipZ','    z += m.tipZ * Math.cos(tm * (1.2 + m.tipZSpeed) + col * 1.8 + m.tipZOffset) * 500;')}${h('beat')?`    if (m.beat != 0) {
        var fb = bt + 0.2; var evn = Std.int(fb) % 2 != 0; fb -= Math.floor(fb);
        if (fb < 0.5) {
            var am = 0.0;
            if (fb < 0.2) { am = fb / 0.2; am *= am; } else { am = 1 - (fb - 0.2) / 0.3; am = 1 - (1 - am) * (1 - am); }
            var sh = 20 * am * Math.sin(dist / 30 + Math.PI / 2); if (evn) sh = -sh;
            x += m.beat * sh;
        }
    }
`:''}${c('infinite','    var th = dist / 160; x += m.infinite * 140 * Math.sin(th); y += m.infinite * 30 * Math.sin(2 * th);')}${c('receptorScroll','    if (!isNote && m.receptorScroll != 0) y = ((y + m.receptorScroll * tm * 320) % 720 + 720) % 720;')}    var fcx = (bx[f * 4] + bx[f * 4 + 3]) / 2 + fw / 2;
    var q = rot(x - fcx, y - 360, z, ${LRX}, ${LRY}, ${LRZ});
    q = rot(q[0] + fcx - 640, q[1], q[2], ${CRX}, ${CRY}, ${CRZ});
    var dd = fov + q[2]; var s = dd > 1 ? fov / dd : 0;
    var fsx = Math.abs(Math.cos((${LRY} + ${CRY}) * 0.0174533));
    var fsy = Math.abs(Math.cos((${LRX} + ${CRX}) * 0.0174533));
    var sx = (1 - 0.5 * ${v('mini','0')}) * (1 - 0.5 * ${v('miniX','0')}) * (isNote ? ${v('noteScaleX','1')} : ${v('receptorScaleX','1')});
    var sy = (1 - 0.5 * ${v('mini','0')}) * (1 - 0.5 * ${v('miniY','0')}) * (isNote ? ${v('noteScaleY','1')} : ${v('receptorScaleY','1')});
    var a = 1.0;
    if (isNote) {
${c('alpha','        a = 1 - Math.max(0, Math.min(1, m.alpha));')}${c('stealth','        a *= 1 - Math.max(0, Math.min(1, (m.stealth - 0.5) * 2));')}${c('hidden','        a *= 1 - m.hidden * Math.max(0, Math.min(1, 1 - (dist - (120 + m.hiddenOffset)) / 100));')}${c('sudden','        a *= 1 - m.sudden * Math.max(0, Math.min(1, (dist - (200 + m.suddenOffset)) / 100));')}${c('blink','        a *= 1 - m.blink * (Math.sin(tm * 10) > 0 ? 0 : 1);')}    } else {
${c('dark','        a = 1 - Math.max(0, Math.min(1, m.dark));')}    }
    a = Math.max(0, Math.min(1, a));
    var rz = ${v('confusion','0')} + (isNote ? ${v('noteAngle','0')} : ${v('receptorAngle','0')}) + ${LRZ} + ${CRZ};
    return [640 + q[0] * s, 360 + q[1] * s, s, rz, sx * s * fsx, sy * s * fsy, a];
}

function postUpdate(elapsed) {
    if (S.length < 8) return;
    tm = Conductor.songPosition / 1000;
    bt = Conductor.songPosition / Conductor.crochet;
    var dg = ds ? -1 : 1;
    for (g in 0...2) {
        for (n in strumLines.members[g].notes.members) {
            if (n == null || !n.exists || !n.alive || n.isSustainNote) continue;
            var i = g * 4 + n.strumID;
            var dist = dg * ((n.y + n.frameHeight / 2) - (S[i].y + S[i].frameHeight / 2));
            var r = pth(i, dist, true);
            n.x = r[0] - n.frameWidth / 2; n.y = r[1] - n.frameHeight / 2;
            n.scale.set(bsv[i] * r[4], bsv[i] * r[5]);
            n.angle = r[3]; n.alpha = r[6];
        }
    }
    for (i in 0...8) {
        var r = pth(i, 0, false);
        S[i].x = r[0] - S[i].frameWidth / 2; S[i].y = r[1] - S[i].frameHeight / 2;
        S[i].scale.set(bsv[i] * r[4], bsv[i] * r[5]);
        S[i].angle = r[3]; S[i].alpha = r[6];
    }
}
`}
function line(e){const I='['+IDS(e.tg).join(', ')+']',E='FlxEase.'+e.e,v=e.v,d=e.d;
 switch(e.t){
 case'camZoom':return`camGame.zoom = defaultCamZoom + ${v}; FlxTween.tween(camGame, {zoom: defaultCamZoom}, sec(${d}), {ease: ${E}});`;
 case'camShake':return`camGame.shake(${v}, sec(${d})); camHUD.shake(${v}, sec(${d}));`;
 case'flash':return`camHUD.flash(0xFFFFFFFF, sec(${d}));`;
 default:return`ez(${I}, "${e.t}", ${v}, ${d}, ${E});`}}
function gen(){const g={};[...S.ev].sort((a,b)=>a.s-b.s).forEach(e=>(g[e.s]=g[e.s]||[]).push(e));
 let o=`// Generado con Modchart Studio · Codename Engine (modificadores estilo Nightmare Vision)\n// BPM ${S.bpm} · stepsPerBeat ${S.spb}\n// Rotaciones y ángulos en GRADOS. transformZ/tipZ: 1 = 1000 px / 500 px de profundidad.\n\n`+head(usedMods())+'\nfunction stepHit(curStep) {\n    switch (curStep) {\n';
 for(const s in g)o+=`        case ${s}:\n`+g[s].map(e=>`            // ${e.t}\n            ${line(e)}\n`).join('');
 return o+'    }\n}\n'}
function rCode(){$('#pre').textContent=gen()}
function dl(name,txt){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt],{type:'text/plain'}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)}
