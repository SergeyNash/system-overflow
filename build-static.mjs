import { mkdirSync, copyFileSync, cpSync, rmSync, existsSync } from 'node:fs';
rmSync('dist', { recursive: true, force: true });
mkdirSync('dist', { recursive: true });
for (const file of ['index.html', 'styles.css', 'flow-model.js', 'app.js']) copyFileSync(file, `dist/${file}`);
if (existsSync('worlds')) cpSync('worlds', 'dist/worlds', {
  recursive: true,
  filter: path => !/\.test\.(mjs|cjs)$/.test(path) && !path.endsWith('README.md'),
});
console.log('Static files prepared in dist.');
