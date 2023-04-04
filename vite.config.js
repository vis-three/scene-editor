import { defineConfig } from "vite";
import { createVuePlugin } from "vite-plugin-vue2";
import path from "path";

const apiList = ["app", "template", "texture", "model", "component"];

const proxy = {};

apiList.forEach((url) => {
  proxy[`/${url}`] = {
    target: "http://localhost:3001",
    changeOrigin: true,
  };
});

console.log(proxy);

export default defineConfig({
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

  server: {
    proxy,
  },
});
