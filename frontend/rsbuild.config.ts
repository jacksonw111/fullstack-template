import { defineConfig, loadEnv } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  source: {
    alias: {
      "@": "./src"
    }
  },
  server: {
    proxy: {
      "/service": {
        target: process.env.APP_BASE_API,
        changeOrigin: true,
        pathRewrite: (path) => path.replace(/^\/service/, ""),
      },
      ai: {
        target: process.env.AI_BASE_API,
        changeOrigin: true,
        pathRewrite: (path) => path.replace(/^\/ai/, ""),
      },
    },
  },
  performance: {
    removeConsole: true,
    removeMomentLocale: true, 
    chunkSplit: {
      strategy: 'split-by-module'
    }
  },
  output: {
    minify: {
      js: true, 
      css: true
    },
    manifest: true,
  },
});
