import { defineConfig } from "vite";
import { createVuePlugin } from "vite-plugin-vue2";
import path from "path";

export default defineConfig({
  build: {
    outDir: path.resolve(__dirname, "./docs"),
    rollupOptions: {
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
  ],
});
