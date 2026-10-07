import { readFileSync, readdirSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
for(const file of ['index.html','styles.css','flow-model.js','app.js'])
  assert(readFileSync(file).equals(readFileSync(`dist/${file}`)),`Legacy file differs: ${file}`);
function walk(dir) {
  for(const e of readdirSync(dir,{withFileTypes:true})) {
    const path=`${dir}/${e.name}`;
    if(e.isDirectory())walk(path);
    else assert(!/\.test\.|\.md$|package(-lock)?\.json$/.test(e.name),`Development file leaked: ${path}`);
  }
}
walk('dist'); assert(existsSync('dist/worlds/navigation.js'));
if(existsSync('worlds/rendering/index.html')) {
  const html=readFileSync('dist/worlds/rendering/index.html','utf8');
  assert(!html.includes('.ts"'),'Uncompiled TypeScript entry in spike output');
  assert(/type="module"[^>]+\/assets\//.test(html),'Compiled spike entry missing');
}
console.log('Legacy output is byte-identical; typed navigation bundle exists; no development files in dist.');
