// Deliberately small motion-study model, not the final cafe domain model.
export const STEP = 1 / 60;
const DURATIONS = [6.5, 4, 2];
export function createStudy() {
  return { tick: 0, pace: 1, cook: 0, queue: [], nextId: 1, created: 0, delivered: 0,
    nextGuest: 0, guests: [0, 0, 0], helperWanted: false, helperArrival: 0,
    actors: [{ phase: 'idle', elapsed: 0, order: null }, { phase: 'off', elapsed: 0, order: null }] };
}
export function command(s, type, value) {
  if (type === 'pace' && Number.isInteger(value) && value >= 0 && value <= 2) { s.pace = value; return true; }
  if (type === 'helper' && typeof value === 'boolean') {
    s.helperWanted = value;
    if (value && s.actors[1].phase === 'off') { s.actors[1].phase = 'arriving'; s.actors[1].elapsed = 0; }
    // A helper finishes a carried delivery before leaving.
    if (!value && ['idle', 'arriving'].includes(s.actors[1].phase)) s.actors[1].phase = 'off';
    return true;
  }
  return false;
}
export function step(s) {
  s.tick++;
  for (let i = 0; i < s.guests.length; i++) s.guests[i] = Math.max(0, s.guests[i] - STEP);
  if (s.queue.length < 6) {
    s.cook += STEP;
    if (s.cook + 1e-9 >= DURATIONS[s.pace]) {
      s.cook -= DURATIONS[s.pace];
      s.queue.push({ id: s.nextId++, guest: s.nextGuest++ % 3 }); s.created++;
    }
  }
  for (let i = 0; i < s.actors.length; i++) {
    const a = s.actors[i];
    if (a.phase === 'off') continue;
    a.elapsed += STEP;
    if (a.phase === 'arriving' && a.elapsed >= 1) { a.phase = 'idle'; a.elapsed = 0; }
    if (a.phase === 'returning' && a.elapsed >= 2.6) {
      a.phase = i === 1 && !s.helperWanted ? 'off' : 'idle'; a.elapsed = 0;
    }
    if (a.phase === 'delivering' && a.elapsed >= 3.5) {
      s.guests[a.order.guest] = 4; a.lastGuest = a.order.guest; s.delivered++; a.order = null; a.phase = 'returning'; a.elapsed = 0;
    }
    if (a.phase === 'idle' && s.queue.length) {
      a.order = s.queue.shift(); a.phase = 'delivering'; a.elapsed = 0;
    }
  }
  return s;
}
export function cooking(s) { return s.queue.length < 6; }
export function progress(s) { return Math.min(1, s.cook / DURATIONS[s.pace]); }
