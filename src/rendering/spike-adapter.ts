export interface DrawRect {kind:'rect'; x:number;y:number;w:number;h:number;color:number}
export interface DrawImage {kind:'image'; image:string;crop:readonly number[];x:number;y:number;w:number;h:number;flip?:boolean}
export type Draw=DrawRect|DrawImage;
export interface SpikeRenderer {
  canvas:HTMLCanvasElement;
  resize(width:number,height:number):void;
  render(draws:readonly Draw[]):void;
  dispose():void;
}
export async function canvasRenderer(images:Record<string,HTMLImageElement>):Promise<SpikeRenderer> {
  const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');
  if(!ctx)throw Error('Canvas 2D unavailable');
  return {canvas,resize(w,h){canvas.width=w;canvas.height=h;ctx.imageSmoothingEnabled=false;},
    render(draws){ctx.clearRect(0,0,canvas.width,canvas.height);ctx.imageSmoothingEnabled=false;
      for(const d of draws) if(d.kind==='rect'){ctx.fillStyle=`#${d.color.toString(16).padStart(6,'0')}`;ctx.fillRect(d.x,d.y,d.w,d.h);}
      else {ctx.save();if(d.flip){ctx.translate(d.x+d.w,d.y);ctx.scale(-1,1);}else ctx.translate(d.x,d.y);
        ctx.drawImage(images[d.image]!,d.crop[0]!,d.crop[1]!,d.crop[2]!,d.crop[3]!,0,0,d.w,d.h);ctx.restore();}
    },dispose(){canvas.width=0;canvas.height=0;canvas.remove();}};
}
export async function pixiRenderer(images:Record<string,HTMLImageElement>):Promise<SpikeRenderer> {
  const {Application,Texture,Sprite,Rectangle,ImageSource}=await import('pixi.js');
  const app=new Application();
  try {await app.init({width:768,height:512,preference:'webgl',autoStart:false,
    sharedTicker:false,antialias:false,resolution:1,backgroundAlpha:0});}
  catch(error){try{app.destroy(true);}catch{/* initialization may be partial */}throw error;}
  app.stop();
  const sources=Object.fromEntries(Object.entries(images).map(([key,image])=>{
    const texture=new Texture({source:new ImageSource({resource:image,scaleMode:'nearest'})});return [key,texture];
  }));
  const crops=new Map<string,InstanceType<typeof Texture>>(),pool:InstanceType<typeof Sprite>[]=[];
  return {canvas:app.canvas,resize(w,h){app.renderer.resize(w,h);},
    render(draws){
      for(let i=0;i<draws.length;i++) {
        const d=draws[i]!;let sprite=pool[i];
        if(!sprite){sprite=new Sprite();pool.push(sprite);app.stage.addChild(sprite);}
        sprite.visible=true;sprite.tint=d.kind==='rect'?d.color:0xffffff;
        if(d.kind==='rect')sprite.texture=Texture.WHITE;
        else {const key=`${d.image}:${d.crop.join(',')}`;let texture=crops.get(key);
          if(!texture){texture=new Texture({source:sources[d.image]!.source,
            frame:new Rectangle(d.crop[0]!,d.crop[1]!,d.crop[2]!,d.crop[3]!)});crops.set(key,texture);}sprite.texture=texture;}
        sprite.scale.set(1);sprite.x=d.x;sprite.y=d.y;sprite.width=d.w;sprite.height=d.h;
        if(d.kind==='image'&&d.flip){sprite.scale.x=-Math.abs(sprite.scale.x);sprite.x=d.x+d.w;}
      }
      for(let i=draws.length;i<pool.length;i++)pool[i]!.visible=false;
      app.render();
    },dispose(){app.destroy(true,{children:true,texture:false,textureSource:false});
      for(const t of crops.values())t.destroy(false);
      for(const t of Object.values(sources))t.destroy(true);crops.clear();pool.length=0;}};
}
