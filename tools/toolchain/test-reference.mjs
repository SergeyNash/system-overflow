import { readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const files=[];
function collect(dir) {
  for(const entry of readdirSync(dir,{withFileTypes:true})) {
    if(['node_modules','.git','dist'].includes(entry.name))continue;
    const path=`${dir}/${entry.name}`;
    if(entry.isDirectory())collect(path);
    else if(/\.test\.(cjs|mjs)$/.test(entry.name))files.push(path);
  }
}
collect('.');
if(!files.length)throw Error('No reference/legacy tests found.');
const result=spawnSync(process.execPath,['--test',...files.sort()],{stdio:'inherit'});
if(result.error)throw result.error;
process.exit(result.status ?? 1);
