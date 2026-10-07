export interface Point { x: number; y: number }
export interface Rect { x: number; y: number; w: number; h: number }
export function pointAlong(path: readonly Point[], fraction: number): Point {
  if(path.length<2)throw new Error('Path requires at least two points');
  const lengths=path.slice(1).map((p,i)=>Math.hypot(p.x-path[i]!.x,p.y-path[i]!.y));
  let distance=lengths.reduce((a,b)=>a+b,0)*Math.max(0,Math.min(1,fraction));
  for(let i=0;i<lengths.length;i++) {
    const length=lengths[i]!;
    if(distance<=length || i===lengths.length-1) {
      const a=path[i]!,b=path[i+1]!,t=length?distance/length:0;
      return {x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t};
    }
    distance-=length;
  }
  return path[0]!;
}
export function contains(r:Rect,p:Point):boolean {
  return p.x>=r.x && p.x<=r.x+r.w && p.y>=r.y && p.y<=r.y+r.h;
}
export function clientToScene(client:Point,bounds:Rect,size:Point):Point|null {
  if(bounds.w<=0 || bounds.h<=0 || !contains(bounds,client))return null;
  return {x:(client.x-bounds.x)*size.x/bounds.w,y:(client.y-bounds.y)*size.y/bounds.h};
}
export const layouts = {
  desktop: {width:768,height:512,pickup:{x:400,y:260},
    tables:[{x:221,y:278,w:94,h:44},{x:545,y:288,w:84,h:47},{x:375,y:334,w:89,h:48}],
    paths:[[{x:400,y:260},{x:350,y:260},{x:350,y:330}],
      [{x:400,y:260},{x:510,y:260},{x:510,y:365}],
      [{x:400,y:260},{x:495,y:260},{x:495,y:425}]],
    targets:[{x:370,y:110,w:60,h:65},{x:585,y:185,w:60,h:65}]},
  portrait:{width:360,height:560,pickup:{x:175,y:237},
    tables:[{x:15,y:322,w:110,h:41},{x:235,y:325,w:110,h:42},{x:111,y:436,w:141,h:50}],
    paths:[[{x:175,y:237},{x:158,y:237},{x:158,y:390}],
      [{x:175,y:237},{x:208,y:237},{x:208,y:399}],
      [{x:175,y:237},{x:158,y:237},{x:158,y:435},{x:80,y:435},
        {x:80,y:555},{x:280,y:555},{x:280,y:510}]],
    targets:[{x:53,y:85,w:58,h:65},{x:291,y:178,w:60,h:65}]},
} as const;
