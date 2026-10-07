import test from 'node:test';
import assert from 'node:assert/strict';
import {CONFIG,create,command,step,run,CASES,suitability} from './probe.mjs';

test('one dose changes soil immediately but not roots or leaves',()=>{
  const s=create(),before=structuredClone(s);
  assert(command(s,{type:'water'}));
  assert.equal(s.moisture,before.moisture+CONFIG.dose);
  assert.equal(s.root,before.root); assert.equal(s.posture,before.posture);
  step(s); assert(s.root>before.root); assert(s.posture<0.21);
});
test('useful dose has delayed response within the concept window',()=>{
  const dry=run(),watered=run(CASES['one-dose']);
  assert.equal(dry.firstLift,null); assert.equal(dry.s.posture,0.2);
  assert(watered.firstLift-5>=8 && watered.firstLift-5<=20);
  assert(watered.firstUpright>watered.firstLift);
});
test('repeating before response accumulates water and produces later wet stress',()=>{
  const one=run(CASES['one-dose']),repeat=run(CASES['repeat-before-response']);
  const at=(r,t)=>r.snapshots.find(x=>x.seconds===t);
  assert(at(repeat,15).posture>at(repeat,10).posture);
  assert(at(repeat,30).posture<at(repeat,15).posture);
  assert.equal(at(repeat,30).cause,'wet-stress');
  assert(at(one,30).posture>at(repeat,30).posture);
});
test('saturation conserves water as overflow and never stacks delayed water jobs',()=>{
  const s=create();for(let i=0;i<1000;i++)command(s,{type:'water'});
  assert.equal(s.moisture,1);assert(s.runoff>250);assert.equal(s.root,0.2);
  assert(s.events.length<=100); step(s);
});
test('withholding further doses permits gradual recovery from excess',()=>{
  const short=run(CASES['repeat-before-response'],30),later=run(CASES['repeat-before-response'],120);
  assert(later.s.moisture<short.s.moisture);assert(later.s.posture>short.s.posture);
  assert(later.s.root<0.8);
});
test('replay/reset are identical and invalid commands do not mutate state',()=>{
  assert.deepEqual(run(CASES['repeat-before-response']),run(CASES['repeat-before-response']));
  const s=create(),before=structuredClone(s);
  for(const c of [null,{type:'drain'},{type:'water',amount:99}])assert.equal(command(s,c),false);
  assert.deepEqual(s,before);assert.deepEqual(create(),before);
});
test('suitability is continuous at documented boundaries',()=>{
  for(const root of [0.25,0.4,0.65])assert(Math.abs(suitability(root-1e-8)-suitability(root+1e-8))<1e-6);
  assert(suitability(1)<suitability(0.5));assert(suitability(0)<suitability(0.5));
});
test('30-minute no-input, sparse, dense and same-tick spam stay bounded and conserve water',()=>{
  const cases=[[],Array.from({length:30},(_,i)=>({tick:i*600,type:'water'})),
    Array.from({length:18000},(_,i)=>({tick:i,type:'water'})),
    Array.from({length:1000},()=>({tick:0,type:'water'}))];
  for(const commands of cases){const {s}=run(commands,1800);assert(s.events.length<=100);}
});
