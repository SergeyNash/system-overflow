import { mkdirSync, writeFileSync, cpSync, rmSync } from 'node:fs';
rmSync('dist', { recursive: true, force: true });
mkdirSync('dist/assets/worlds/cafe', { recursive: true });
cpSync('worlds/motion/assets', 'dist/assets/worlds/cafe', { recursive: true });
// Compatibility URLs show the current experience; old executable pages are not shipped.
for (const route of ['motion', 'rendering']) {
  mkdirSync(`dist/worlds/${route}`, { recursive: true });
  writeFileSync(`dist/worlds/${route}/index.html`, '<!doctype html><html lang="ru"><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=/"><title>Маленькие миры</title><a href="/">Открыть маленькие миры</a></html>');
}
console.log('Current world assets prepared; retired pages excluded.');
