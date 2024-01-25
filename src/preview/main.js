import "element-ui/lib/theme-chalk/index.css";
// 引入公共less配置
import "@/assets/less/init.less";
// 引入elementUI重置配置
import "@/assets/less/resetElementUI.less";
import "@/assets/css/nprogress.css";
// 引入UI组件库
import ElementUI from "element-ui";
// 进度条
import Nprogress from "nprogress";

import Vue from "vue";
import App from "./App.vue";

import "@/assets/js/optimize.js";
import "@/assets/js/db";

Nprogress.start();

Vue.config.productionTip = false;

Vue.use(ElementUI);

const app = new Vue({
  render: (h) => h(App),
  mounted() {
    Nprogress.done();
  },
}).$mount("#app");
