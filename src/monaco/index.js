import ElementUI from "element-ui";
import Editor from "./editor.vue";
import Vue from "vue";

const MonacoExtend = Vue.extend(Editor);

MonacoExtend.use(ElementUI);

const ref = document.createElement("div");
ref.id = "monaco";
document.body.appendChild(ref);

export default new MonacoExtend().$mount("#monaco");
