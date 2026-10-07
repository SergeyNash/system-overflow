import { defineConfig } from 'vite';

export default defineConfig({
  publicDir: false,
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    lib: {
      entry: 'src/shell/world-route.ts',
      formats: ['es'],
      fileName: () => 'worlds/navigation.js',
    },
  },
});
