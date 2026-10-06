import { STEP, createStudy, command, step, cooking, progress } from './model.mjs';
const $ = id => document.getElementById(id);
const canvas=$('scene'),ctx=canvas.getContext('2d'),stage=$('stage');
const names=['Спокойно','Обычно','Быстро'];
const spriteRects=[[80,85,300,445],[465,90,295,440],[820,110,315,420],[1205,110,310,420],[85,570,245,395],[465,555,245,410],[840,550,245,415],[1195,550,315,420]];
const emptyRects=[[360,80,290,430],[945,80,315,430],[355,565,300,415],[945,565,315,415]];
let state=createStudy(),userPaused=false,ready=false,portrait=false,reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let last=0,acc=0,frame=0,feedbackUntil=0,images={},liveKey='';
let displayedGuests=[0,0,0];
const query=matchMedia('(max-width:600px)');
const scenePoints=()=>portrait?{cook:[78,155],pickup:[175,237],apron:[318,225],guests:[[42,389],[307,391],[128,494]],targets:[[125,365],[244,367],[230,480]]}:{cook:[239,207],pickup:[400,266],apron:[620,235],guests:[[213,351],[635,365],[368,424]],targets:[[313,340],[537,355],[465,424]]};
function resize(){portrait=query.matches;canvas.width=portrait?360:768;canvas.height=portrait?560:512;ctx.imageSmoothingEnabled=false;render();}
function sync(){
 const paused=userPaused||document.hidden;
 document.querySelectorAll('[data-pace]').forEach(b=>{b.setAttribute('aria-pressed',String(+b.dataset.pace===state.pace));b.disabled=!ready||paused;});
 for(const id of ['dial','apron','helper'])$(id).disabled=!ready||paused;
 $('pause').disabled=!ready;$('reset').disabled=!ready;
 $('pause').textContent=userPaused?'Продолжить':'Пауза';
 $('dial').setAttribute('aria-label',`Темп кухни: ${names[state.pace]}. Нажми для изменения`);
 $('needle').style.transform=`rotate(${[-45,0,45][state.pace]}deg)`;
 for(const id of ['helper','apron'])$(id).setAttribute('aria-pressed',String(state.helperWanted));
 $('helper').textContent=state.helperWanted?'Отпустить помощника':'Позвать помощника';
 $('apron').setAttribute('aria-label',$('helper').textContent);
}
function say(text){$('status').textContent=text;}
function acknowledge(id){$(id).classList.add('accepted');feedbackUntil=performance.now()+180;}
function pace(value){if(!ready||userPaused||document.hidden)return;if(command(state,'pace',value)){sync();say(`Темп кухни: ${names[value].toLowerCase()}.`);acknowledge('dial');render();}}
function helper(){if(!ready||userPaused||document.hidden)return;command(state,'helper',!state.helperWanted);sync();say(state.helperWanted?'Помощник идёт к выдаче.':'Помощник завершит доставку и уйдёт.');acknowledge('apron');render();}
$('dial').addEventListener('click',()=>pace((state.pace+1)%3));
document.querySelectorAll('[data-pace]').forEach(b=>b.addEventListener('click',()=>pace(+b.dataset.pace)));
$('helper').addEventListener('click',helper);$('apron').addEventListener('click',helper);
$('pause').addEventListener('click',()=>{userPaused=!userPaused;acc=0;last=0;sync();say(userPaused?'Кафе на паузе.':'Кафе продолжает жить.');render();});
$('reset').addEventListener('click',()=>{state=createStudy();displayedGuests=[0,0,0];acc=0;last=0;liveKey='';feedbackUntil=0;clearFeedback();sync();say(userPaused?'Начальное состояние. Кафе на паузе.':'Кафе начинает сначала.');render();});
$('reduce').checked=reduced;$('reduce').addEventListener('change',()=>{reduced=$('reduce').checked;render();});
const motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
motionPreference.addEventListener('change',e=>{reduced=e.matches;$('reduce').checked=reduced;render();});
query.addEventListener('change',resize);
document.addEventListener('visibilitychange',()=>{last=0;acc=0;sync();if(document.hidden){cancelAnimationFrame(frame);frame=0;}else if(ready&&!frame)frame=requestAnimationFrame(loop);});
window.addEventListener('pagehide',()=>{cancelAnimationFrame(frame);frame=0;});
window.addEventListener('pageshow',()=>{last=0;if(ready&&!document.hidden&&!frame)frame=requestAnimationFrame(loop);});
function clearFeedback(){for(const id of ['dial','apron'])$(id).classList.remove('accepted');}
function sprite(rect,x,y,h,{empty=false,flip=false}={}){
 const [sx,sy,sw,sh]=rect,w=h*sw/sh;ctx.save();ctx.translate(Math.round(x),Math.round(y));if(flip)ctx.scale(-1,1);
 ctx.drawImage(empty?images.empty:images.characters,sx,sy,sw,sh,-Math.round(w/2),-Math.round(h),Math.round(w),Math.round(h));ctx.restore();
}
function plate(x,y,scale=1){ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.scale(scale,scale);ctx.fillStyle='#49392d';ctx.fillRect(-12,-3,24,7);ctx.fillStyle='#fff3d5';ctx.fillRect(-11,-4,22,7);ctx.fillStyle='#bc6434';ctx.fillRect(-6,-6,12,6);ctx.fillStyle='#709b46';ctx.fillRect(-5,-8,4,3);ctx.restore();}
function background(){
 if(!portrait){ctx.drawImage(images.environment,0,0,768,512);return;}
 ctx.fillStyle='#db9a57';ctx.fillRect(0,0,360,560);
 ctx.strokeStyle='#c68646';ctx.lineWidth=1;for(let y=210;y<560;y+=30){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(360,y);ctx.stroke();}
 for(let x=0;x<=360;x+=45){ctx.beginPath();ctx.moveTo(x,210);ctx.lineTo(x,560);ctx.stroke();}
 ctx.drawImage(images.environment,285,0,1090,510,0,0,360,210);
 // Recompose the same furniture instead of shrinking the desktop canvas.
 ctx.drawImage(images.environment,397,535,285,205,25,315,135,97);
 ctx.drawImage(images.environment,1035,553,280,205,202,318,135,99);
 ctx.drawImage(images.environment,694,648,290,200,111,421,141,97);
 ctx.drawImage(images.environment,25,463,363,423,0,406,84,98);
}
function actorPosition(a,i,p){
 if(a.phase==='arriving'){const t=Math.min(1,a.elapsed);return [p.apron[0]+(p.pickup[0]-p.apron[0])*t,p.apron[1]+(p.pickup[1]-p.apron[1])*t];}
 if(a.phase==='idle')return [p.pickup[0]+i*24,p.pickup[1]+6];
 const target=p.targets[a.order?.guest??a.lastGuest??0];
 const t=Math.min(1,a.elapsed/(a.phase==='delivering'?3.5:2.6));
 const from=a.phase==='delivering'?p.pickup:target,to=a.phase==='delivering'?target:p.pickup;
 // Floor path stays in front of the pickup counter.
 const middle=[(from[0]+to[0])/2,Math.max(from[1],to[1])-10];
 const local=t<.5?t*2:(t-.5)*2,begin=t<.5?from:middle,end=t<.5?middle:to;
 return [begin[0]+(end[0]-begin[0])*local,begin[1]+(end[1]-begin[1])*local];
}
function render(){
 if(!ready)return;ctx.clearRect(0,0,canvas.width,canvas.height);ctx.imageSmoothingEnabled=false;background();const p=scenePoints();
 const phase=reduced?0:Math.floor(state.tick/15)%2;
 sprite(spriteRects[cooking(state)?phase:0],...p.cook,portrait?68:85);
 if(!reduced&&cooking(state)){ctx.fillStyle='#fff5d4';const t=(state.tick%80)/80;ctx.globalAlpha=(1-t)*.5;ctx.fillRect(p.cook[0]+15,p.cook[1]-60-t*17,3,4);ctx.globalAlpha=1;}
 state.queue.forEach((o,i)=>plate(portrait?111+i*23:305+i*42,portrait?137:173,portrait?.85:1));
 // Guest poses change only when a delivery actually completes.
 p.guests.forEach((g,i)=>{
   sprite(spriteRects[[4,5,6][i]],...g,portrait?65:75);
   if(state.guests[i]>0&&i<2)plate(g[0]+(i===0?25:-25),g[1]-30,portrait?.8:1);
 });
 const visible=state.actors.map((a,i)=>({a,i,pos:actorPosition(a,i,p)})).filter(v=>v.a.phase!=='off').sort((a,b)=>a.pos[1]-b.pos[1]);
 for(const {a,i,pos} of visible){
   const walk=reduced?0:Math.floor(state.tick/12)%2;
   if(a.phase==='delivering')sprite(spriteRects[i===0?2+walk:7],...pos,portrait?68:81,{flip:false});
   else sprite(emptyRects[i*2+walk],...pos,portrait?68:81,{empty:true,flip:a.phase==='returning'});
 }
 if(progress(state)>.9&&cooking(state)&&!reduced){ctx.fillStyle='#fff1b8';ctx.fillRect(p.cook[0]+28,p.cook[1]-44,2,3);}
}
function loop(now){
 frame=0;if(document.hidden)return;
 if(!last)last=now;const elapsed=Math.min(.1,(now-last)/1000);last=now;
 if(!userPaused){acc+=elapsed;let n=0;while(acc+1e-9>=STEP&&n<6){
  step(state);
  acc-=STEP;n++;
 }if(n===6)acc=0;
 const key=state.queue.length>=4?'queue':state.actors[1].phase==='idle'&&!state.queue.length?'idle':state.helperWanted?'helper':'normal';
 if(key!==liveKey){liveKey=key;if(key==='queue')say('Блюда готовы и ждут на выдаче.');else if(key==='idle')say('Помощник свободен: на выдаче пока нет блюд.');}
 }
 if(feedbackUntil&&now>=feedbackUntil){clearFeedback();feedbackUntil=0;}render();frame=requestAnimationFrame(loop);
}
async function load(){
 ready=false;sync();$('loading').hidden=false;$('loading').replaceChildren(document.createTextNode('Открываем кафе…'));stage.setAttribute('aria-busy','true');
 try{
 const entries=[['environment','environment.webp'],['characters','characters.webp'],['empty','return-poses.webp']];
 const loaded=await Promise.all(entries.map(async([key,file])=>{const img=new Image();img.src=new URL(`assets/${file}`,import.meta.url);await img.decode();return [key,img];}));
 images=Object.fromEntries(loaded);ready=true;$('loading').hidden=true;stage.setAttribute('aria-busy','false');sync();resize();last=0;if(!frame&&!document.hidden)frame=requestAnimationFrame(loop);
 }catch{
 stage.setAttribute('aria-busy','false');$('loading').replaceChildren(document.createTextNode('Не удалось загрузить кафе. Проверь соединение и попробуй снова.'));
 const retry=document.createElement('button');retry.textContent='Попробовать снова';retry.addEventListener('click',load);$('loading').append(retry);
 }
}
load();
