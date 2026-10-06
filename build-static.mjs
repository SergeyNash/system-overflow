import { mkdirSync, copyFileSync, cpSync, rmSync } from 'node:fs';
rmSync('dist', { recursive: true, force: true });
mkdirSync('dist', { recursive: true });
for (const file of ['index.html', 'styles.css', 'flow-model.js', 'app.js']) copyFileSync(file, `dist/${file}`);
cpSync('worlds', 'dist/worlds', { recursive: true, filter: (source) => !source.endsWith('.test.mjs') && !source.endsWith('README.md') });
console.log('Static files prepared in dist.');
