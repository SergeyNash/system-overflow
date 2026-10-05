const test = require('node:test');
const assert = require('node:assert/strict');
const { FlowModel: F } = require('./flow-model.js');
function advance(model, seconds) {
  for(let i=0; i<Math.round(seconds*60); i++) F.step(model,1/60);
}
test('initial split constrains C1; boosting moves restriction to D and the exit', () => {
  const m = F.create();
  advance(m,5);
  assert.equal(F.steady(m).limit,'C1');
  assert.ok(Math.abs(F.steady(m).output-.601)<1e-10);
  assert.ok(m.queues.C1>0);
  const q = m.queues.C1;
  m.levels.C1=1;
  advance(m,3);
  assert.equal(F.steady(m).limit,'D');
  assert.ok(m.queues.C1<q);
  assert.ok(m.queues.D>0);
  m.levels.D=1;
  advance(m,4);
  assert.equal(F.steady(m).limit,'out');
  assert.ok(m.queues.out>0);
  assert.equal(F.steady(m).output,.78);
});
test('upgrades away from restriction do not increase steady output', () => {
  for(const id of ['A','B','C2','D']) {
    const m=F.create();
    const before=F.steady(m).output;
    m.levels[id]=3;
    assert.equal(F.steady(m).output,before,id);
    assert.equal(F.steady(m).limit,'C1');
  }
});
test('three power increments have diminishing returns and lowering restores capacity', () => {
  const m=F.create();
  const c=[0,1,2,3].map(level=>{m.levels.C1=level;return F.capacities(m).C1;});
  assert.ok(c[1]-c[0]>c[2]-c[1]);
  assert.ok(c[2]-c[1]>c[3]-c[2]);
  m.levels.C1=0;
  assert.equal(F.capacities(m).C1,F.base.C1);
  assert.equal(F.steady(m).limit,'C1');
});
test('flow is conserved across branches, queues, and in-transit units', () => {
  const m=F.create();
  const dt=1/60;
  for(let i=0;i<3600;i++) {
    if(i===900)m.levels.C1=1;
    if(i===1800)m.levels.D=1;
    if(i===2700)m.levels.C1=0;
    F.step(m,i % 2 ? dt : dt / 2);
    const inTransit=Object.values(m.transit).reduce((sum,value)=>sum+value,0);
    const queued=Object.values(m.queues).reduce((sum,value)=>sum+value,0);
    assert.ok(Math.abs(m.entered-m.exited-queued-inTransit)<1e-8);
    for(const [id,amount] of Object.entries(m.processed)) {
      assert.ok(amount<=F.capacities(m)[id]+1e-10);
      assert.ok(amount>=0);
    }
  }
});
