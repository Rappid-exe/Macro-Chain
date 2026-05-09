import { defineConfig } from 'vite';
import { resolve } from 'path';
import { criticalCssPlugin } from './plugins/vite-plugin-critical-css.js';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
  },
  server: {
    open: true,
  },
  plugins: [
    criticalCssPlugin(),
  ],
});
