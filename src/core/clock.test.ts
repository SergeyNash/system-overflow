import {describe,it,expect} from 'vitest';
import {FixedClock} from './clock';
describe('fixed clock',()=>{
  it('produces identical ticks at different display rates',()=>{
    const run=(fps:number)=>{const c=new FixedClock();const ticks:number[]=[];
      for(let i=0;i<=fps;i++)c.advance(i*1000/fps,t=>ticks.push(t));return ticks;};
    expect(run(30)).toEqual(run(144));expect(run(60)).toHaveLength(60);
  });
  it('bounds catch-up and discards hidden time without resetting the world',()=>{
    const c=new FixedClock();c.advance(0,()=>{});expect(c.advance(10000,()=>{})).toBe(6);
    expect(c.discardedSeconds).toBeCloseTo(9.9);c.suspend();
    expect(c.advance(100000,()=>{})).toBe(0);expect(c.tick).toBe(6);
    c.reset();expect(c.tick).toBe(0);expect(c.discardedSeconds).toBe(0);
  });
  it('keeps sub-tick interpolation and rejects invalid timestamps',()=>{
    const c=new FixedClock();c.advance(0,()=>{});c.advance(5,()=>{});
    expect(c.interpolation).toBeCloseTo(.3);expect(()=>c.advance(NaN,()=>{})).toThrow();
  });
});
