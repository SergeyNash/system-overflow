import test from 'node:test';
import assert from 'node:assert/strict';
import {createStudy, command, step} from './model.mjs';
const advance=(s,n)=>{for(let i=0;i<n;i++)step(s);return s};
const invariant=s=>{
 const carrying=s.actors.filter(a=>a.order).map(a=>a.order);
 assert.equal(s.created,s.delivered+s.queue.length+carrying.length);
 assert(s.queue.length<=6);
 assert.equal(new Set([...s.queue,...carrying].map(o=>o.id)).size,s.queue.length+carrying.length);
};
test('fast cooking accumulates a bounded queue without losing orders',()=>{
 const s=createStudy();command(s,'pace',2);
 for(let i=0;i<60*180;i++){step(s);invariant(s)}
 assert(s.queue.length>0);
});
test('helper arrives before serving and completes delivery on release',()=>{
 const s=createStudy();command(s,'pace',2);advance(s,500);
 command(s,'helper',true);advance(s,30);assert.equal(s.actors[1].phase,'arriving');
 advance(s,60);assert.equal(s.actors[1].phase,'delivering');
 command(s,'helper',false);advance(s,400);assert.equal(s.actors[1].phase,'off');invariant(s);
});
test('two staff deliver more of the same input over a fixed interval',()=>{
 const a=createStudy(),b=createStudy();command(a,'pace',2);command(b,'pace',2);command(b,'helper',true);
 advance(a,3600);advance(b,3600);assert(b.delivered>a.delivered);invariant(a);invariant(b);
});
test('invalid commands have no effect and reset reproduces a run',()=>{
 const s=createStudy(),initial=structuredClone(s);assert.equal(command(s,'pace',99),false);assert.deepEqual(s,initial);
 const run=()=>{const r=createStudy();command(r,'pace',2);advance(r,1000);command(r,'helper',true);return advance(r,1200)};
 assert.deepEqual(run(),run());
});
