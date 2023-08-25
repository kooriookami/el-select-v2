import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue2';
import copy from 'rollup-plugin-copy';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import jsonfile from 'jsonfile';
import path from 'path';

function editPackageJson() {
  return {
    name: 'edit-package-json',
    closeBundle() {
      const file = 'dist/package.json';
      jsonfile.readFile(file, (err, obj) => {
        if (!err) {
          obj.main = 'umd/index.js';
          obj.module = 'es/index.mjs';
          jsonfile.writeFile(file, obj, { spaces: 2, EOL: '\r\n' });
        }
      });
    },
  };
}

const buildLib = {
  lib: {
    entry: path.resolve(__dirname, 'packages/el-select-v2'),
    name: 'ElSelectV2',
    fileName: format => {
      if (format === 'es') {
        return `${format}/index.mjs`;
      }
      return `${format}/index.js`;
    },
  },
  rollupOptions: {
    // 确保外部化处理那些你不想打包进库的依赖
    external: ['vue', 'element-ui'],
    output: {
      // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
      globals: {
        'vue': 'Vue',
        'element-ui': 'ElementUI',
      },
    },
    plugins: [
      cssInjectedByJsPlugin(),
      copy({
        targets: [
          { src: 'LICENSE', dest: 'dist' },
          { src: 'README.md', dest: 'dist' },
          { src: 'packages/el-select-v2/package.json', dest: 'dist' },
        ],
        hook: 'writeBundle',
      }),
      editPackageJson(),
    ],
  },
  target: ['es2015'],
};

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
  build: process.argv.includes('lib') ? buildLib : buildWebsite,
});
