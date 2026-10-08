import { defineConfig } from 'vite';
export default defineConfig({publicDir:false,build:{outDir:'dist',emptyOutDir:false,
  rolldownOptions:{input:{home:'index.html',comparison:'worlds/rendering/index.html'}}}});
