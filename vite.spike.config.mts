import { defineConfig } from 'vite';
export default defineConfig({publicDir:false,build:{outDir:'dist',emptyOutDir:false,
  rolldownOptions:{input:'worlds/rendering/index.html'}}});
