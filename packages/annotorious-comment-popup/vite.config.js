import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import sveltePreprocess from 'svelte-preprocess';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    svelte({ preprocess: sveltePreprocess() }),
    dts({
      insertTypesEntry: true,
      include: ['./src/'],
      entryRoot: './src'
    })
  ],
  server: {
    open: '/test/index.html'
  },
  build: {
    sourcemap: true,
    lib: {
      entry: './src/index.ts',
      name: 'CommentPopup',
      formats: ['es', 'umd'],
      fileName: (format) => 
        format === 'umd' ? `annotorious-comment-popup.js` : `annotorious-comment-popup.es.js` 
    },
    rollupOptions: {
      output: {
        assetFileNames: 'annotorious-comment-popup.[ext]'
      }
    }
  }
});