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
import "@/assets/less/visFrame.less";

// 进度条
import Nprogress from "nprogress";
// 引入UI组件库
import ElementUI from "element-ui";
// 引入通用组件
import VisUI from "@/components";
// 引入全局自定义组件
import DEComponents from "@/components/global";
// collapse 展开折叠
import CollapseTransition from "element-ui/lib/transitions/collapse-transition";
// 引入图片懒加载
import VueLazyload from "vue-lazyload";
// 引入工具类
import tool from "@/assets/js/tool.js";
//顶部提示
import VTooltip from "v-tooltip";
// axios
import { Plugin } from "@/assets/js/plugins/axios";

import "@/assets/js/optimize.js";
import "@/assets/js/combination.js";

import parse from "url-parse";

import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

// // 引入socket服务;
import ClientSocketIO from "socket.io-client";

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

Vue.prototype.$socket = ClientSocketIO(`http://localhost:3001`, {
  transports: ["websocket"],
});

Vue.config.productionTip = false;

const app = new Vue({
  // router,
  store,
  render: (h) => h(App),
  created() {
    const { query } = parse(window.location.href, true);
  },
  mounted() {
    Nprogress.done();
  },
}).$mount("#app");

window.$store = store;
