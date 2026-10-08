import { readFileSync, readdirSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
function walk(dir) {
  for(const e of readdirSync(dir,{withFileTypes:true})) {
    const path=`${dir}/${e.name}`;
    if(e.isDirectory())walk(path);
    else assert(!/\.test\.|\.md$|package(-lock)?\.json$/.test(e.name),`Development file leaked: ${path}`);
  }
}
walk('dist');
for(const file of ['app.js','flow-model.js','styles.css'])assert(!existsSync(`dist/${file}`),`Retired file shipped: ${file}`);
for(const route of ['index.html','worlds/rendering/index.html']) {
  const html=readFileSync(`dist/${route}`,'utf8');
  assert(!html.includes('.ts"'),'Uncompiled TypeScript entry');
  assert(/type="module"[^>]+\/assets\//.test(html),'Compiled entry missing');
  assert(!html.includes('Исходная проба кафе'),'Retired link shipped');
}
for(const route of ['motion'])assert(readFileSync(`dist/worlds/${route}/index.html`,'utf8').includes('0;url=/'),'Compatibility page must point to current root');
console.log('Current root and compiled comparison verified; retired executable assets excluded.');
