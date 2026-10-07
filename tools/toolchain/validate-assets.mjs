import { existsSync, readdirSync, readFileSync } from 'node:fs';

let count=0;
function walk(dir) {
  for(const entry of readdirSync(dir,{withFileTypes:true})) {
    const path=`${dir}/${entry.name}`;
    if(entry.isDirectory())walk(path);
    else if(entry.name.endsWith('.webp')) {
      const data=readFileSync(path);
      if(data.toString('ascii',0,4)!=='RIFF'||data.toString('ascii',8,12)!=='WEBP')throw Error(`Invalid WebP: ${path}`);
      count++;
    }
  }
}
if(existsSync('worlds'))walk('worlds');
console.log(`Checked ${count} WebP file headers. Production asset manifests are pending V02.`);
