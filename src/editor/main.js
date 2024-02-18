import "element-ui/lib/theme-chalk/index.css";
// 引入公共less配置
import "@/assets/less/init.less";
// 引入elementUI重置配置
import "@/assets/less/resetElementUI.less";
// 引入v-tooltip样式
import "@/assets/less/tooltip.less";
// 引入 animate
import "animate.css";
// 引入进度条样式
import "@/assets/css/nprogress.css";
// vis样式
import "@/editor/assets/less/visFrame.less";

// 进度条
import Nprogress from "nprogress";
// 引入UI组件库
import ElementUI from "element-ui";
// 引入通用组件
import VisUI from "@/editor/components";
// 引入全局自定义组件
import DEComponents from "@/editor/components/global";
// collapse 展开折叠
import CollapseTransition from "element-ui/lib/transitions/collapse-transition";
// 引入图片懒加载
import VueLazyload from "vue-lazyload";
// 引入工具类
import tool from "@/editor/assets/js/tool.js";
//顶部提示
import VTooltip from "v-tooltip";
// axios
import { Plugin } from "@/assets/js/plugins/axios";

import "@/assets/js/optimize.js";
import "@/editor/assets/js/combination.js";

import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "@/assets/js/db";

Nprogress.start();

Vue.use(ElementUI);
Vue.use(VTooltip);
Vue.use(VisUI);
Vue.use(DEComponents);
Vue.use(Plugin);
Vue.use(VueLazyload, {
  error: "/image/error.png",
  loading: "/image/loading.gif",
  silent: false,
});

Vue.component(CollapseTransition.name, CollapseTransition);

Vue.prototype.$tool = tool;

Vue.config.productionTip = false;

const app = new Vue({
  // router,
  store,
  mounted() {
    Nprogress.done();
  },
  render: (h) => h(App),
}).$mount("#app");
