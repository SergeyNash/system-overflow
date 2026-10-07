import test from 'node:test';
import assert from 'node:assert/strict';
import { create, command, step, run, CASES, CONFIG } from './probe.mjs';

test('baseline finishes distinct visits and reuses cleaned tables', () => {
  const s=run([],60);
  assert(s.closed>=2); assert(s.firstDelivery<s.firstExit); assert(s.firstExit<s.firstReuse);
  const clean=s.events.find(e=>e.type==='clean');
  assert(s.events.some(e=>e.type==='seating' && e.tick>=clean.tick && e.id>3));
});
test('admission pause drains all accepted work and reopening does not spawn a batch', () => {
  const s=create(); for(let i=0;i<300;i++)step(s);
  command(s,{type:'admission',value:false}); const admitted=s.admitted;
  for(let i=0;i<1600;i++)step(s);
  assert.equal(s.admitted,admitted); assert.equal(s.closed,admitted);
  assert.equal(s.queue.length,0); assert(s.tables.every(id=>id===null));
  const due=s.nextArrival;
  command(s,{type:'admission',value:true}); assert.equal(s.admitted,admitted);
  while(s.tick<due-1)step(s);
  assert.equal(s.admitted,admitted); step(s); assert.equal(s.admitted,admitted+1);
});
test('helper release completes delivery and cleanup, including return', () => {
  for(const kind of ['delivery','cleanup']) {
    const s=create(); command(s,{type:'helper',value:true}); command(s,{type:'pace',value:2});
    while(!(s.workers[1].job?.type===kind && s.workers[1].phase==='outbound') && s.tick<2000)step(s);
    assert.equal(s.workers[1].job?.type,kind);
    const id=s.workers[1].job.id;
    command(s,{type:'helper',value:false});
    for(let i=0;i<CONFIG.outbound+CONFIG.transfer+CONFIG.returning+CONFIG.helperTravel;i++)step(s);
    assert.equal(s.workers[1].phase,'off'); assert.equal(s.workers[1].job,null);
    if(kind==='delivery') assert(s.events.some(e=>e.type==='eating' && e.id===id));
    else assert(s.events.some(e=>e.type==='clean' && e.id===id));
  }
});
test('repeated commands and arrival/departure reversals never duplicate helper capacity', () => {
  const s=create(); command(s,{type:'helper',value:true});
  step(s); const remaining=s.workers[1].remaining;
  command(s,{type:'helper',value:true}); assert.equal(s.workers[1].remaining,remaining);
  command(s,{type:'helper',value:false});
  while(s.workers[1].phase==='arriving')step(s);
  assert.equal(s.workers[1].phase,'departing');
  command(s,{type:'helper',value:true});
  while(s.workers[1].phase==='departing')step(s);
  assert.equal(s.workers[1].phase,'off'); step(s);
  // Desired-on must start a fresh arrival after finishing the departure.
  assert.equal(s.workers[1].phase,'arriving');
});
test('dirty plate remains until collection and table remains reserved until disposal', () => {
  const s=create();
  while(!s.workers.some(w=>w.job?.type==='cleanup') && s.tick<1000)step(s);
  const w=s.workers.find(w=>w.job?.type==='cleanup'); assert(w);
  const id=w.job.id, v=s.visits.find(v=>v.id===id), table=v.table;
  assert.equal(v.plateCollected,undefined);
  while(w.phase!=='returning') { assert.equal(s.tables[table],id); step(s); }
  assert.equal(v.plateCollected,true); assert.equal(s.tables[table],id);
  while(w.remaining>1) { step(s); assert.equal(s.tables[table],id); }
  step(s); assert.notEqual(s.tables[table],id); assert(!s.visits.some(v=>v.id===id));
});
test('same seed and commands replay identically; invalid inputs do not mutate state', () => {
  assert.deepEqual(run(CASES['kitchen-first']),run(CASES['kitchen-first']));
  const s=create(), before=structuredClone(s);
  assert.equal(command(s,{type:'pace',value:99}),false);
  assert.equal(command(s,{type:'helper',value:'yes'}),false); assert.deepEqual(s,before);
});
test('rate reversal preserves completed cooking work', () => {
  const s=create(); for(let i=0;i<10;i++)step(s);
  const work=s.cook.work; command(s,{type:'pace',value:0});
  assert.equal(s.cook.work,work); step(s); assert.equal(s.cook.work,work-CONFIG.rates[0]);
});
test('causal comparisons distinguish waiting reduction from completed visits', () => {
  const base=run(),fast=run(CASES['fast-only']),both=run(CASES['kitchen-first']);
  assert(fast.readyTicks>base.readyTicks); assert.equal(fast.closed,base.closed);
  assert(both.closed>base.closed); assert(both.readyTicks<fast.readyTicks);
});
test('30-minute extremes and rapid toggles preserve bounds/accounting each tick', () => {
  for(const pace of [0,1,2]) for(const helper of [false,true]) {
    const s=run([{tick:0,type:'pace',value:pace},{tick:0,type:'helper',value:helper}],1800);
    assert(s.closed>0); assert(s.maxJobWait<=150); // finite FIFO workahead: <= three table jobs
  }
  const s=create();
  for(let i=0;i<18000;i++) {
    if(i%7===0)command(s,{type:'helper',value:i%14===0});
    if(i%11===0)command(s,{type:'pace',value:i%3});
    if(i%13===0)command(s,{type:'admission',value:i%26===0});
    step(s);
  }
  assert(s.events.length<=160);
});
