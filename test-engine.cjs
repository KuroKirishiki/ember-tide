const assert=require('node:assert/strict');
const {World}=require('./engine.js');
const levels=require('./levels.json').levels;
const tick=(w,n,inputs=[{},{}])=>{for(let i=0;i<n;i++)w.step(1/120,inputs);};
function place(p,x,bottom){Object.assign(p,{x,y:bottom-p.h,vy:0,ground:true});}
assert.equal(levels.length,10);assert.equal(new Set(levels.map(l=>JSON.stringify(l.platforms))).size,10);
for(const l of levels){const w=new World(l);tick(w,2);assert.equal(w.status,'play',`spawn ${l.id}`);assert(w.players.every(p=>p.ground));
 for(const g of w.gates)assert(g.requires.every(id=>w.switches.some(s=>s.id===id)));
 for(const s of w.switches){assert(w.platforms.some(p=>s.x>=p.x&&s.x+s.w<=p.x+p.w&&s.y+s.h===p.y),`switch supported ${l.id}`);}
 for(const e of w.exits)assert(w.platforms.some(p=>e.x>=p.x&&e.x+e.w<=p.x+p.w&&e.y+e.h===p.y));
}
let w=new World(levels[0]);tick(w,1);let y=w.players[0].y;tick(w,10,[{jump:true,right:true},{jump:true,right:true}]);assert(w.players.every(p=>p.y<y));assert(w.players[0].x>55&&w.players[1].x>105);
for(const type of ['fire','water','acid'])for(const pi of [0,1]){w=new World(levels[1]);let h=w.hazards.find(h=>h.type===type);place(w.players[pi],h.x+20,h.y);tick(w,1);assert.equal(w.status,type===w.players[pi].type?'play':'dead');}
w=new World(levels[4]);tick(w,150,[{right:true},{}]);assert(w.signals.a,'crate activates plate');assert(w.gates[0].open);
w=new World(levels[6]);place(w.players[0],240,620);tick(w,1);assert(!w.signals.a);place(w.players[1],480,550);tick(w,1);assert(w.signals.a&&w.signals.b);assert(w.gates[0].open);place(w.players[0],100,620);tick(w,1);assert(w.gates[0].open,'duet latches');
w=new World(levels[7]);place(w.players[0],385,565);tick(w,1,[{action:true},{}]);assert(w.gates[0].open);tick(w,1441);assert(!w.gates[0].open);tick(w,1,[{action:true},{}]);assert(w.gates[0].open,'timer rearm');
w=new World(levels[8]);let s=w.switches.find(s=>s.id==='b');place(w.players[1],s.x,s.y+s.h);tick(w,1,[{},{action:true}]);assert(!w.signals.b);place(w.players[0],s.x,s.y+s.h);tick(w,1,[{action:true},{}]);assert(w.signals.b);
for(const l of levels){w=new World(l);w.players.forEach((p,i)=>place(p,w.exits[i].x,w.exits[i].y+w.exits[i].h));tick(w,1);assert.equal(w.status,'win',`dual exit ${l.id}`);}
w=new World(levels[5]);const lift=w.lifts[0];place(w.players[0],lift.x+30,lift.y);const py=w.players[0].y;tick(w,30);assert(w.players[0].y<py,'lift carries player');
console.log('PASS: 10 distinct levels; spawns; supports; two-player input; hazards; pushing crates; duet; timers; color locks; exits; elevator.');
