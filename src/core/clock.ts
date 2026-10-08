/** Renderer-independent fixed clock. Hidden/paused time is deliberately discarded. */
export class FixedClock {
  readonly dtSeconds = 1 / 60;
  tick = 0;
  discardedSeconds = 0;
  private last: number | null = null;
  private debt = 0;
  advance(nowMs: number, step: (tick: number, dtSeconds: number) => void): number {
    if (!Number.isFinite(nowMs)) throw new Error('Clock timestamp must be finite');
    if (this.last === null) { this.last = nowMs; return 0; }
    const elapsed = Math.max(0, (nowMs - this.last) / 1000);
    this.last = nowMs;
    this.discardedSeconds += Math.max(0, elapsed - .1);
    this.debt += Math.min(.1, elapsed);
    let count = 0;
    while (this.debt + 1e-12 >= this.dtSeconds && count < 6) {
      this.tick++; step(this.tick, this.dtSeconds);
      this.debt = Math.max(0, this.debt - this.dtSeconds); count++;
    }
    if (count === 6 && this.debt >= this.dtSeconds) {
      this.discardedSeconds += this.debt; this.debt = 0;
    }
    return count;
  }
  get interpolation(): number { return this.debt / this.dtSeconds; }
  suspend(): void { this.last = null; this.debt = 0; }
  reset(): void { this.suspend(); this.tick = 0; this.discardedSeconds = 0; }
}
