import { mkdirSync, copyFileSync } from 'node:fs';
mkdirSync('dist', { recursive: true });
for (const file of ['index.html', 'styles.css', 'flow-model.js', 'app.js']) copyFileSync(file, `dist/${file}`);
console.log('Static files prepared in dist.');
