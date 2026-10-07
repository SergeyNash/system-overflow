import {layouts,pointAlong,clientToScene,contains} from '../rendering/geometry';
import {canvasRenderer,pixiRenderer} from '../rendering/spike-adapter';
import type {Draw,SpikeRenderer} from '../rendering/spike-adapter';

const element=<T extends HTMLElement>(id:string)=>document.getElementById(id) as T;
const stage=element('stage'),status=element('status');
const rendererSelect=element<HTMLSelectElement>('renderer'),layoutSelect=element<HTMLSelectElement>('layout');
const guides=element<HTMLInputElement>('guides'),reduce=element<HTMLInputElement>('reduce');
const actions=['dial','helper','water','pause','reset'];
const media=matchMedia('(max-width:600px)'),motion=matchMedia('(prefers-reduced-motion: reduce)');
reduce.checked=motion.matches;
let renderer:SpikeRenderer|null=null,images:Record<string,HTMLImageElement>={},generation=0;
let frame=0,last=0,acc=0,tick=0,userPaused=false,helper=false,pace=1;
let moisture=.2,root=.2,posture=.2,feedback=0;
let intervals:number[]=[],renders:number[]=[],latencies:number[]=[],pendingInput:number|null=null;
let readyAt=0,initMs=0,drawCount=0,lastReport=0;
const rects=[[80,85,300,445],[465,90,295,440],[820,110,315,420],[1205,110,310,420],
  [85,570,245,395],[465,555,245,410],[840,550,245,415],[1195,550,315,420]];
const empty=[[360,80,290,430],[945,80,315,430],[355,565,300,415],[945,565,315,415]];
function isPortrait(){return layoutSelect.value==='portrait'||layoutSelect.value==='auto'&&media.matches;}
function layout(){return isPortrait()?layouts.portrait:layouts.desktop;}
function say(text:string){status.textContent=text;}
function enabled(){return !!renderer&&!userPaused&&!document.hidden;}
function sync(){for(const id of actions)element<HTMLButtonElement>(id).disabled=!renderer||(id!=='pause'&&id!=='reset'&&!enabled());
  element('pause').textContent=userPaused?'Продолжить':'Пауза';
  element('helper').textContent=helper?'Убрать помощника':'Позвать помощника';
  element('helper').setAttribute('aria-pressed',String(helper));
  element('dial').textContent=`Темп кухни: ${['спокойно','обычно','быстро'][pace]}`;
}
function sample(list:number[],value:number){list.push(value);if(list.length>600)list.shift();}
function percentile(list:number[],p:number){const sorted=[...list].sort((a,b)=>a-b);return sorted[Math.floor((sorted.length-1)*p)]??0;}
function report(){return {renderer:rendererSelect.value,layout:isPortrait()?'portrait':'desktop',
  viewport:{width:innerWidth,height:innerHeight,devicePixelRatio},logical:{width:layout().width,height:layout().height,resolution:1},
  reducedMotion:reduce.checked,userAgent:navigator.userAgent,samples:intervals.length,
  initMs:Math.round(initMs),drawCommands:drawCount,
  frameIntervalMs:{p50:+percentile(intervals,.5).toFixed(2),p95:+percentile(intervals,.95).toFixed(2)},
  renderCallMs:{p50:+percentile(renders,.5).toFixed(2),p95:+percentile(renders,.95).toFixed(2)},
  inputToRenderCallMs:{samples:latencies.length,p95:+percentile(latencies,.95).toFixed(2)},
  limits:'CPU render-call timings, not GPU completion; last 600 visible unpaused frames; model is a visual probe.'};}
function resetMetrics(){intervals=[];renders=[];latencies=[];pendingInput=null;lastReport=0;}
function resize(){if(!renderer)return;const l=layout();renderer.resize(l.width,l.height);
  stage.classList.toggle('portrait',isPortrait());resetMetrics();last=0;acc=0;render();}
function recipe():Draw[]{
  const p=isPortrait(),l=layout(),draws:Draw[]=[];
  const box=(x:number,y:number,w:number,h:number,color:number)=>draws.push({kind:'rect',x:Math.round(x),y:Math.round(y),w,h,color});
  const image=(key:string,crop:readonly number[],x:number,y:number,w:number,h:number,flip=false)=>draws.push({kind:'image',image:key,crop,x:Math.round(x),y:Math.round(y),w:Math.round(w),h:Math.round(h),flip});
  const sprite=(key:string,crop:readonly number[],x:number,y:number,h:number,flip=false)=>image(key,crop,x-h*crop[2]!/crop[3]!/2,y-h,h*crop[2]!/crop[3]!,h,flip);
  if(!p)image('environment',[0,0,1536,1024],0,0,768,512);
  else {box(0,0,360,560,0xdb9a57);
    for(let y=210;y<560;y+=30)box(0,y,360,1,0xc68646);
    image('environment',[285,0,1090,510],0,0,360,210);
    image('environment',[397,535,285,205],15,315,110,79);
    image('environment',[1035,553,280,205],235,318,110,81);
    image('environment',[694,648,290,200],111,421,141,97);
    image('environment',[25,463,363,423],0,406,65,98);
  }
  const poses=reduce.checked?0:Math.floor(tick/(pace===2?10:pace===0?30:20))%2;
  sprite('characters',rects[poses]!,p?78:239,p?155:207,p?68:85);
  const guests=p?[[28,389],[327,391],[128,494]]:[[213,351],[635,365],[368,424]];
  guests.forEach(([x,y],i)=>sprite('characters',rects[4+i]!,x!,y!,p?65:75));
  const actors=[];
  for(let i=0;i<(helper?2:1);i++) {
    const seconds=tick/60+i*2,cycle=Math.floor(seconds/12),fraction=seconds%12/6;
    const path=l.paths[cycle%3]!,returning=fraction>1;
    const pos=pointAlong(path,returning?2-fraction:fraction);
    actors.push({i,pos,returning});
  }
  actors.sort((a,b)=>a.pos.y-b.pos.y);
  for(const {i,pos,returning} of actors){const walk=reduce.checked?0:Math.floor(tick/12)%2;
    sprite(returning?'empty':'characters',returning?empty[i*2+walk]!:rects[i?7:2+walk]!,pos.x,pos.y,p?68:81,returning);}
  // Code-native plant inset tests state-driven silhouette changes, not production greenhouse art.
  const gx=p?207:20,gy=15;
  box(gx,gy,130,150,0xf7e8c6);box(gx+30,gy+108,70,30,0xb75f37);
  box(gx+27,gy+103,76,8,moisture>.8?0x574b37:moisture<.3?0xb59a69:0x786948);
  box(gx+63,gy+45,5,60,0x477446);
  const droop=(1-posture)*24;
  for(let i=0;i<3;i++){
    box(gx+37-i*5,gy+43+i*15+droop,28,9,0x567f46);
    box(gx+68,gy+38+i*15+droop,29,9,0x739c54);
  }
  if(feedback>0)box(gx+32,gy+92,64,3,0x3b9baf);
  l.targets.forEach((target,i)=>{
    box(target.x,target.y,target.w,target.h,i===0?0xecd8a6:0x467e7c);
    box(target.x+8,target.y+8,target.w-16,target.h-16,i===0?0x9f663d:0xefe2c2);
    if(i===0)box(target.x+16+pace*8,target.y+16,6,26,0x49392d);
  });
  if(guides.checked){
    for(const table of l.tables){box(table.x,table.y,table.w,2,0xdb2439);box(table.x,table.y+table.h,table.w,2,0xdb2439);
      box(table.x,table.y,2,table.h,0xdb2439);box(table.x+table.w,table.y,2,table.h,0xdb2439);}
    for(const path of l.paths)for(let i=0;i<=40;i++){const pt=pointAlong(path,i/40);box(pt.x-1,pt.y-1,3,3,0x17696b);}
  }
  return draws;
}
function render(){if(!renderer)return;const draws=recipe(),before=performance.now();renderer.render(draws);
  sample(renders,performance.now()-before);drawCount=draws.length;
  if(pendingInput!==null){sample(latencies,performance.now()-pendingInput);pendingInput=null;}}
function step(){tick++;moisture=Math.max(0,moisture-.003/60);root+=(moisture-root)/360;
  const target=root<=.25?.2:root<.4?.2+.8*(root-.25)/.15:root<=.65?1:1-.85*(root-.65)/.35;
  posture+=(target-posture)/480;feedback=Math.max(0,feedback-1/60);}
function loop(now:number){frame=0;if(document.hidden||!renderer)return;
  const elapsed=last?Math.min(.1,(now-last)/1000):0;
  if(last&&!userPaused&&now-readyAt>1000)sample(intervals,now-last);last=now;
  if(!userPaused){acc+=elapsed;let n=0;while(acc>=1/60&&n<6){step();acc-=1/60;n++;}if(n===6)acc=0;}
  render();if(now-lastReport>1000){element('metrics').textContent=JSON.stringify(report(),null,2);lastReport=now;}
  if(!userPaused)frame=requestAnimationFrame(loop);
}
function startLoop(){if(renderer&&!document.hidden&&!userPaused&&!frame){last=0;frame=requestAnimationFrame(loop);}}
function act(action:string){if(!enabled())return;pendingInput=performance.now();
  if(action==='dial'){pace=(pace+1)%3;say('Темп меняет позы повара в этой пробе.');}
  else if(action==='helper'){helper=!helper;say(helper?'В сцене появился второй официант.':'Второй официант скрыт.');}
  else{moisture=Math.min(1,moisture+.26);feedback=.5;say('Почва изменилась. Листья реагируют постепенно.');}
  sync();render();}
for(const id of ['dial','helper','water'])element(id).addEventListener('click',()=>act(id));
element('pause').addEventListener('click',()=>{userPaused=!userPaused;cancelAnimationFrame(frame);frame=0;acc=0;last=0;sync();render();startLoop();});
element('reset').addEventListener('click',()=>{tick=0;moisture=root=posture=.2;feedback=0;helper=false;pace=1;acc=0;last=0;resetMetrics();sync();render();});
async function initialize(){
  const mine=++generation;cancelAnimationFrame(frame);frame=0;renderer?.dispose();renderer=null;sync();
  stage.setAttribute('aria-busy','true');say('Загружаем сцену…');resetMetrics();const before=performance.now();
  try {
    if(!Object.keys(images).length){
      const loaded=await Promise.all([['environment','environment.webp'],['characters','characters.webp'],['empty','return-poses.webp']].map(async([key,file])=>{
        const image=new Image();image.src=`/worlds/motion/assets/${file}`;await image.decode();return [key!,image] as const;
      }));if(mine!==generation)return;images=Object.fromEntries(loaded);
    }
    const created=await (rendererSelect.value==='pixi'?pixiRenderer(images):canvasRenderer(images));
    if(mine!==generation){created.dispose();return;}renderer=created;initMs=performance.now()-before;readyAt=performance.now();
    stage.replaceChildren(renderer.canvas);renderer.canvas.setAttribute('aria-label','Кафе: движущиеся официанты и небольшая проба растения. Действия доступны кнопками ниже.');
    renderer.canvas.addEventListener('click',event=>{
      const bounds=renderer!.canvas.getBoundingClientRect(),l=layout();
      const pt=clientToScene({x:event.clientX,y:event.clientY},{x:bounds.x,y:bounds.y,w:bounds.width,h:bounds.height},{x:l.width,y:l.height});
      if(!pt)return;const target=l.targets.findIndex(r=>contains(r,pt));
      if(target>=0)act(target===0?'dial':'helper');
      else if(contains({x:isPortrait()?207:20,y:15,w:130,h:150},pt))act('water');
    });stage.setAttribute('aria-busy','false');resize();sync();say('Сцена готова. Движение — проверка проходов, а не полный цикл гостей.');startLoop();
  }catch(error){if(mine!==generation)return;stage.replaceChildren();stage.setAttribute('aria-busy','false');sync();
    say(`Не удалось запустить отрисовку. Попробуй Canvas или перезапуск. ${error instanceof Error?error.message:''}`);}
}
rendererSelect.addEventListener('change',()=>{void initialize();});element('retry').addEventListener('click',()=>{void initialize();});
layoutSelect.addEventListener('change',resize);media.addEventListener('change',resize);
guides.addEventListener('change',()=>render());reduce.addEventListener('change',()=>{resetMetrics();render();});
motion.addEventListener('change',()=>{reduce.checked=motion.matches;render();});
document.addEventListener('visibilitychange',()=>{cancelAnimationFrame(frame);frame=0;last=0;acc=0;resetMetrics();sync();startLoop();});
window.addEventListener('pagehide',()=>{generation++;cancelAnimationFrame(frame);frame=0;renderer?.dispose();renderer=null;});
window.addEventListener('pageshow',event=>{if(event.persisted)void initialize();});
element('copy').addEventListener('click',()=>{void navigator.clipboard.writeText(JSON.stringify(report(),null,2)).then(()=>say('Измерения скопированы.'),()=>say('Не удалось скопировать. Текст измерений можно выделить вручную.'));});
void initialize();
