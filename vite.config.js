import { defineConfig } from "vite";
import { createVuePlugin } from "vite-plugin-vue2";
import mdPlugin from "vite-plugin-markdown";

import path from "path";

export default defineConfig({
  base: "/scene-editor",
  build: {
    outDir: path.resolve(__dirname, "./docs"),
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, "./index.html"),
        preview: path.resolve(__dirname, "./preview.html"),
      },
      output: {
        manualChunks: {
          three: ["three"],
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      vue: "vue/dist/vue.esm.js",
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        additionalData: '@import "./src/assets/less/common.less";',
      },
    },
  },
  plugins: [
    createVuePlugin({
      compilerOptions: {
        whitespace: "condense",
      },
      jsx: true,
      jsxOptions: {
        compositionAPI: true,
      },
    }),
    mdPlugin.plugin({
      mode: "markdown",
    }),
  ],
});
