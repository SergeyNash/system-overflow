// A fluid queue model. Each unit leaves exactly one branch; merging adds flows.
// Queues persist over time and never create or discard units.
((scope) => {
  const ids = ["A", "B", "C1", "C2", "D", "out"];
  const base = { source: 0.86, A: 0.90, B: 0.92, C1: 0.30, C2: 0.70, D: 0.70, out: 0.78 };
  const increments = [0, 0.36, 0.54, 0.63];
  function create() {
    return { levels: Object.fromEntries(ids.map(id => [id, 0])), queues: Object.fromEntries(ids.map(id => [id, 0])), transit: {}, processed: {}, incoming: {}, time: 0, entered: 0, exited: 0, output: 0 };
  }
  function capacities(model) {
    return Object.fromEntries(Object.entries(base).map(([id, value]) => [id, value + (increments[model.levels[id] || 0] || 0)]));
  }
  function steady(model) {
    const cap = capacities(model);
    const b = Math.min(cap.source, cap.A, cap.B);
    const branches = Math.min(b * 0.65, cap.C1) + Math.min(b * 0.35, cap.C2);
    const output = Math.min(branches, cap.D, cap.out);
    let limit;
    if (branches < Math.min(b, cap.D, cap.out) - 1e-8) limit = b * 0.65 > cap.C1 ? "C1" : "C2";
    else limit = ["source", "A", "B", "D", "out"].sort((a, b) => cap[a] - cap[b])[0];
    return { output, limit, cap };
  }
  function step(model, dt) {
    const cap = capacities(model);
    model.time += dt;
    model.entered += cap.source * dt;
    const input = { ...model.transit, A: cap.source * dt };
    // Snapshot inputs impose one simulation tick of travel per connection.
    for (const id of ids) {
      model.incoming[id] = (input[id] || 0) / dt;
      model.queues[id] += input[id] || 0;
      const amount = Math.min(model.queues[id], cap[id] * dt);
      model.queues[id] = Math.max(0, model.queues[id] - amount);
      model.processed[id] = amount / dt;
    }
    model.transit = { B: model.processed.A * dt, C1: model.processed.B * dt * 0.65, C2: model.processed.B * dt * 0.35, D: (model.processed.C1 + model.processed.C2) * dt, out: model.processed.D * dt };
    model.exited += model.processed.out * dt;
    model.output += (model.processed.out - model.output) * (1 - Math.exp(-dt * 2));
    return steady(model);
  }
  scope.FlowModel = { create, capacities, steady, step, base, increments };
})(typeof module === "object" ? module.exports : window);
