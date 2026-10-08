(function(root){
'use strict';
const overlap=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
class World{
 constructor(data){this.data=JSON.parse(JSON.stringify(data));Object.assign(this,this.data);this.players=this.spawn.map((p,i)=>({...p,w:28,h:38,vx:0,vy:0,type:i?'water':'fire',ground:false,coyote:0,jumpBuffer:0,jumpHeld:false,actionHeld:false}));this.time=0;this.deaths=0;this.collected=0;this.status='play';this.signals={};this.timers={};this.gems.forEach(g=>g.taken=false);this.crates.forEach(c=>Object.assign(c,{vy:0}));this.lifts.forEach(l=>l.dir=-1);}
 solids(){return [...this.platforms,...this.lifts,...this.gates.filter(g=>!g.open)];}
 move(o,dx,dy,solids){o.x+=dx;for(const s of solids)if(overlap(o,s)){o.x=dx>0?s.x-o.w:s.x+s.w;}o.x=Math.max(0,Math.min(1200-o.w,o.x));o.y+=dy;o.ground=false;for(const s of solids)if(overlap(o,s)){if(dy>=0){o.y=s.y-o.h;o.ground=true;}else o.y=s.y+s.h;o.vy=0;}}
 step(dt,inputs=[{},{}]){
  if(this.status!=='play')return;dt=Math.min(dt,1/30);this.time+=dt;
  for(const [id,t] of Object.entries(this.timers)){this.timers[id]=Math.max(0,t-dt);this.signals[id]=this.timers[id]>0;}
  for(const l of this.lifts){const old=l.y;l.y+=l.dir*l.speed*dt;if(l.y<=l.high){l.y=l.high;l.dir=1;}if(l.y>=l.low){l.y=l.low;l.dir=-1;}for(const p of this.players)if(p.x+p.w>l.x&&p.x<l.x+l.w&&Math.abs(p.y+p.h-old)<3){p.y+=l.y-old;}}
  let solid=this.solids();for(const c of this.crates){c.vy=Math.min(650,c.vy+1400*dt);this.move(c,0,c.vy*dt,solid);}
  for(let i=0;i<2;i++){
   const p=this.players[i],input=inputs[i]||{};p.coyote=p.ground?.11:Math.max(0,p.coyote-dt);if(input.jump&&!p.jumpHeld)p.jumpBuffer=.13;else p.jumpBuffer=Math.max(0,p.jumpBuffer-dt);p.jumpHeld=!!input.jump;
   if(p.jumpBuffer>0&&p.coyote>0){p.vy=-575;p.jumpBuffer=0;p.coyote=0;p.ground=false;}
   p.vx=((input.right?1:0)-(input.left?1:0))*235;p.vy=Math.min(720,p.vy+1400*dt);
   const dx=p.vx*dt;for(const c of this.crates){if(overlap({...p,x:p.x+dx},c)&&dx){this.move(c,dx,0,[...solid,...this.crates.filter(o=>o!==c)]);}}
   this.move(p,dx,p.vy*dt,[...solid,...this.crates]);
   for(const s of this.switches)if(s.kind==='lever'&&input.action&&!p.actionHeld&&(s.type==='any'||s.type===p.type)&&Math.abs((p.x+14)-(s.x+13))<62&&Math.abs(p.y+p.h-(s.y+s.h))<65){this.signals[s.id]=true;if(s.duration)this.timers[s.id]=s.duration;}
   p.actionHeld=!!input.action;
   for(const g of this.gems)if(!g.taken&&g.type===p.type&&overlap(p,{x:g.x-10,y:g.y-12,w:20,h:24})){g.taken=true;this.collected++;}
   if(p.y>760||this.hazards.some(h=>h.type!==p.type&&overlap(p,{...h,y:h.y-4,h:h.h+4}))){this.status='dead';this.deaths++;return;}
  }
  const active={};for(const s of this.switches.filter(s=>s.kind==='plate')){const actors=s.type==='crate'?this.crates:this.players.filter(p=>s.type==='any'||s.type===p.type);active[s.id]=actors.some(p=>p.x+p.w>s.x&&p.x<s.x+s.w&&Math.abs(p.y+p.h-(s.y+s.h))<10);s.pressed=active[s.id];}
  for(const s of this.switches.filter(s=>s.kind==='plate'))if(active[s.id]&&(!s.group||this.switches.filter(a=>a.group===s.group).every(a=>active[a.id])))this.signals[s.id]=true;
  for(const g of this.gates){const wanted=g.requires.every(id=>this.signals[id]);if(wanted)g.open=true;else if(!this.players.some(p=>overlap(p,g))&&!this.crates.some(c=>overlap(c,g)))g.open=false;}
  if(this.players.every((p,i)=>overlap(p,this.exits[i])&&p.ground))this.status='win';
 }
}
root.GameEngine={World,overlap};if(typeof module!=='undefined')module.exports=root.GameEngine;
})(typeof window==='undefined'?globalThis:window);
