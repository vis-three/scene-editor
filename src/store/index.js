import { MODULETYPE, OBJECTMODULE } from "@vis-three/middleware";
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const context = import.meta.glob("./modules/*.js", {
  import: "module",
  eager: true,
});

const modules = {};

Object.keys(context).forEach((url) => {
  modules[
    url
      .split("/")
      .pop()
      .replace(/.\/|\.js$/g, "")
  ] = context[url];
});

export default new Vuex.Store({
  getters: {
    objectMapList(state, getters) {
      return Object.keys(OBJECTMODULE).map((module) => {
        return getters[`${module}/get`];
      });
    },
  },
  mutations: {
    notifyAll(state) {
      Object.values(MODULETYPE).forEach((module) => {
        this.commit(`${module}/notify`);
      });
    },
  },
  actions: {
    notifyAll(context) {
      context.commit("notifyAll");
    },
  },
  modules,
});
