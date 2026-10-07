import {expect,it} from 'vitest';
import {layouts,pointAlong,contains,clientToScene} from './geometry';
it('sampled staff bodies remain outside table-top masks on both layouts',()=>{
  for(const [name,layout] of Object.entries(layouts)) for(const path of layout.paths) {
    const half=name==='desktop'?31:26,height=name==='desktop'?81:68;
    for(let i=0;i<=1000;i++) {
      const p=pointAlong(path,i/1000);
      const body={x:p.x-half,y:p.y-height,w:half*2,h:height};
      for(const table of layout.tables) {
        const overlaps=body.x<table.x+table.w && body.x+body.w>table.x
          && body.y<table.y+table.h && body.y+body.h>table.y;
        expect(overlaps,`${name} at ${i/1000}`).toBe(false);
      }
    }
  }
});
it('paths travel by length and clamp endpoints',()=>{
  const p=[{x:0,y:0},{x:3,y:0},{x:3,y:4}];
  expect(pointAlong(p,3/7)).toEqual({x:3,y:0});
  expect(pointAlong(p,-1)).toEqual(p[0]);expect(pointAlong(p,2)).toEqual(p[2]);
});
it('picking accounts for CSS scaling and rejects outside/zero-size canvases',()=>{
  const bounds={x:20,y:40,w:384,h:256};
  expect(clientToScene({x:212,y:168},bounds,{x:768,y:512})).toEqual({x:384,y:256});
  expect(clientToScene({x:0,y:0},bounds,{x:768,y:512})).toBeNull();
  expect(clientToScene({x:20,y:40},{...bounds,w:0},{x:768,y:512})).toBeNull();
  expect(contains({x:0,y:0,w:44,h:44},{x:22,y:22})).toBe(true);
});
