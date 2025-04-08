import vue from '@vitejs/plugin-vue2';
import path from 'path';
import { defineConfig } from 'vite';

const buildWebsite = {
  outDir: 'docs',
};

export default defineConfig({
  base: './',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'], // 扩展了.vue后缀
  },
  build: buildWebsite,
});
