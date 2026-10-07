// S01 reference calculation only. No renderer, world API or browser dependency.
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';

export const CONFIG = Object.freeze({ dt: 0.1, tables: 3, queue: 6, pickup: 2,
  seating: 20, ordering: 10, eating: 70, leaving: 20,
  outbound: 20, transfer: 10, returning: 20, helperTravel: 20,
  work: 180, rates: [2, 3, 6] });

export function create(seed = 17) {
  const s = { tick: 0, rng: seed >>> 0, nextArrival: 40, nextId: 4,
    pace: 1, admission: true, helperWanted: false, queue: [],
    tables: [1, 2, 3], visits: [], cook: null,
    workers: [{ phase: 'idle', job: null, remaining: 0 },
      { phase: 'off', job: null, remaining: 0 }],
    admitted: 3, passed: 0, exited: 0, closed: 0, delivered: 0,
    maxQueue: 0, maxPickup: 0, dirtyTicks: 0, readyTicks: 0,
    maxJobWait: 0, firstDelivery: null, firstExit: null, firstReuse: null,
    events: [] };
  for (let id = 1; id <= 3; id++) s.visits.push({ id, table: id - 1,
    stage: 'requested', remaining: 0, since: 0 });
  return s;
}
function event(s, type, id) {
  // Diagnostic output is bounded; aggregate counters retain accounting.
  if (s.events.length < 160) s.events.push({ tick: s.tick, type, id });
}
export function command(s, c) {
  if (c.type === 'pace' && Number.isInteger(c.value) && c.value >= 0 && c.value <= 2) s.pace = c.value;
  else if (c.type === 'admission' && typeof c.value === 'boolean') s.admission = c.value;
  else if (c.type === 'helper' && typeof c.value === 'boolean') {
    s.helperWanted = c.value;
    const w = s.workers[1];
    if (c.value && w.phase === 'off') { w.phase = 'arriving'; w.remaining = CONFIG.helperTravel; }
    // Arrival/departure never reverse mid-path. Desired state applies at the endpoint.
  } else return false;
  return true;
}
function stage(s, v, name, remaining = 0) {
  v.stage = name; v.remaining = remaining; v.since = s.tick; event(s, name, v.id);
}
export function step(s) {
  s.tick++;
  // 1. Complete timed customer stages.
  for (const v of s.visits) {
    if (!['seating', 'ordering', 'eating', 'leaving'].includes(v.stage)) continue;
    if (--v.remaining > 0) continue;
    if (v.stage === 'seating') stage(s, v, 'ordering', CONFIG.ordering);
    else if (v.stage === 'ordering') stage(s, v, 'requested');
    else if (v.stage === 'eating') stage(s, v, 'leaving', CONFIG.leaving);
    else { stage(s, v, 'dirty'); s.exited++; s.firstExit ??= s.tick; }
  }
  // 2. Complete staff phases. Transfer occurs at the table, not after the return walk.
  for (const [i, w] of s.workers.entries()) {
    if(i === 1 && w.phase === 'off' && s.helperWanted) {
      w.phase = 'arriving'; w.remaining = CONFIG.helperTravel;
      continue;
    }
    if (['idle', 'off'].includes(w.phase)) continue;
    if (--w.remaining > 0) continue;
    if (w.phase === 'arriving') w.phase = 'idle';
    else if (w.phase === 'departing') w.phase = 'off';
    else if (w.phase === 'outbound') { w.phase = 'transfer'; w.remaining = CONFIG.transfer; }
    else if (w.phase === 'transfer') {
      const v = s.visits.find(v => v.id === w.job.id);
      if (w.job.type === 'delivery') {
        stage(s, v, 'eating', CONFIG.eating); s.delivered++; s.firstDelivery ??= s.tick;
      } else { v.plateCollected = true; event(s, 'plate-collected', v.id); }
      w.phase = 'returning'; w.remaining = CONFIG.returning;
    } else if (w.phase === 'returning') {
      if (w.job.type === 'cleanup') {
        const v = s.visits.find(v => v.id === w.job.id);
        s.tables[v.table] = null; s.visits = s.visits.filter(x => x.id !== v.id);
        s.closed++; event(s, 'clean', v.id);
      }
      w.job = null; w.phase = 'idle';
    }
    if (i === 1 && w.phase === 'idle' && !s.helperWanted) {
      w.phase = 'departing'; w.remaining = CONFIG.helperTravel;
    }
  }
  // 3. Progress one preparation; hold the finished dish if pickup is full.
  if (s.cook) {
    s.cook.work = Math.max(0, s.cook.work - CONFIG.rates[s.pace]);
    if (s.cook.work === 0 && s.visits.filter(v => v.stage === 'ready').length < CONFIG.pickup) {
      stage(s, s.visits.find(v => v.id === s.cook.id), 'ready'); s.cook = null;
    }
  }
  // 4. Arrivals use the same PRNG draw regardless of admission policy.
  if (s.tick >= s.nextArrival) {
    s.rng = (Math.imul(1664525, s.rng) + 1013904223) >>> 0;
    s.nextArrival = s.tick + 40 + (s.rng % 11) - 5;
    const id = s.nextId++;
    if (s.admission && s.queue.length < CONFIG.queue) {
      s.visits.push({ id, table: null, stage: 'queue', remaining: 0, since: s.tick });
      s.queue.push(id); s.admitted++; event(s, 'arrival', id);
    } else { s.passed++; event(s, 'pass-by', id); }
  }
  // 5. Reserve clean tables in FIFO order.
  for (let table = 0; table < s.tables.length && s.queue.length; table++) {
    if (s.tables[table] !== null) continue;
    const id = s.queue.shift(), v = s.visits.find(v => v.id === id);
    s.tables[table] = id; v.table = table; stage(s, v, 'seating', CONFIG.seating);
    if (s.closed) s.firstReuse ??= s.tick;
  }
  // 6. Oldest eligible job wins across delivery and cleanup; table/id breaks ties.
  for (const [i, w] of s.workers.entries()) {
    if (w.phase !== 'idle') continue;
    if (i === 1 && !s.helperWanted) { w.phase = 'departing'; w.remaining = CONFIG.helperTravel; continue; }
    const v = s.visits.filter(v => ['ready', 'dirty'].includes(v.stage))
      .sort((a, b) => a.since - b.since || a.id - b.id)[0];
    if (!v) continue;
    s.maxJobWait = Math.max(s.maxJobWait, s.tick - v.since);
    w.job = { type: v.stage === 'ready' ? 'delivery' : 'cleanup', id: v.id };
    stage(s, v, w.job.type === 'delivery' ? 'delivering' : 'cleaning');
    w.phase = 'outbound'; w.remaining = CONFIG.outbound;
  }
  // 7. Start one requested order. No demand-free cooking.
  if (!s.cook) {
    const v = s.visits.filter(v => v.stage === 'requested').sort((a,b) => a.since-b.since || a.id-b.id)[0];
    if (v) { stage(s,v,'preparing'); s.cook = { id:v.id, work:CONFIG.work }; }
  }
  const ready = s.visits.filter(v => v.stage === 'ready').length;
  s.maxQueue = Math.max(s.maxQueue,s.queue.length); s.maxPickup = Math.max(s.maxPickup,ready);
  s.readyTicks += ready; s.dirtyTicks += s.visits.filter(v => ['dirty','cleaning'].includes(v.stage)).length;
  check(s);
}
export function check(s) {
  assert.equal(s.admitted, s.closed + s.visits.length);
  assert.equal(s.exited, s.closed + s.visits.filter(v => ['dirty','cleaning'].includes(v.stage)).length);
  assert.equal(s.delivered, s.closed + s.visits.filter(v => ['eating','leaving','dirty','cleaning'].includes(v.stage)).length);
  assert(s.queue.length <= CONFIG.queue); assert(s.visits.length <= CONFIG.queue + CONFIG.tables);
  assert(s.visits.filter(v => v.stage === 'ready').length <= CONFIG.pickup);
  assert.equal(new Set(s.visits.map(v => v.id)).size,s.visits.length);
  assert.equal(s.queue.length,s.visits.filter(v => v.stage === 'queue').length);
  for (const [i,id] of s.tables.entries()) if (id !== null) {
    const v = s.visits.find(v => v.id === id); assert(v && v.table === i && v.stage !== 'queue');
  }
  for (const v of s.visits) if (v.table !== null) assert.equal(s.tables[v.table],v.id);
  const jobs=s.workers.flatMap(w => w.job ? [w.job.id] : []); assert.equal(new Set(jobs).size,jobs.length);
  for (const w of s.workers) if(w.job) assert(s.visits.some(v => v.id === w.job.id));
  if(s.cook) assert(s.visits.some(v => v.id === s.cook.id && v.stage === 'preparing'));
}
export function run(commands = [], seconds = 180, seed = 17) {
  const s = create(seed), schedule = [...commands].sort((a,b)=>a.tick-b.tick);
  let n=0;
  for(let tick=0; tick<seconds/CONFIG.dt; tick++) {
    while(n<schedule.length && schedule[n].tick===tick) command(s,schedule[n++]);
    step(s);
  }
  return s;
}
export const CASES = {
  baseline: [],
  'kitchen-first': [{tick:50,type:'pace',value:2},{tick:200,type:'helper',value:true}],
  'helper-first': [{tick:50,type:'helper',value:true},{tick:200,type:'pace',value:2}],
  'fast-only': [{tick:50,type:'pace',value:2}],
  'helper-only': [{tick:50,type:'helper',value:true}],
  'admission-pause': [{tick:300,type:'admission',value:false},{tick:900,type:'admission',value:true}],
};
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  console.log('# Café scenario reference traces\n\nGenerated with `node tools/cafe-scenario/probe.mjs`; seed 17, 100 ms ticks. Reference calculation only, not a browser run.\n');
  console.log('| Run (180 s) | Admitted | Exited | Cleaned visits | Passed by | Max queue | Max pickup | Ready dish-seconds | Dirty table-seconds | Max job wait (s) |');
  console.log('| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |');
  for(const [name,commands] of Object.entries(CASES)) {
    const s=run(commands);
    console.log(`| ${name} | ${s.admitted} | ${s.exited} | ${s.closed} | ${s.passed} | ${s.maxQueue} | ${s.maxPickup} | ${(s.readyTicks/10).toFixed(1)} | ${(s.dirtyTicks/10).toFixed(1)} | ${(s.maxJobWait/10).toFixed(1)} |`);
  }
  const s=run([],30);
  console.log(`\nBaseline first delivery: ${s.firstDelivery/10}s; first exit: ${s.firstExit/10}s; first cleaned-table reuse: ${s.firstReuse/10}s.`);
  console.log('\n| Snapshot (s) | Run | Queue | Active visit records | Admitted | Exited | Cleaned visits |\n| ---: | --- | ---: | ---: | ---: | ---: | ---: |');
  for(const seconds of [30,60,90,120,180]) for(const name of ['baseline','admission-pause']) {
    const s=run(CASES[name],seconds);
    console.log(`| ${seconds} | ${name} | ${s.queue.length} | ${s.visits.length} | ${s.admitted} | ${s.exited} | ${s.closed} |`);
  }
}
