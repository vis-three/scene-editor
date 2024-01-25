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
  state: {
    id: "",
    name: "",
    cacheUrlDetails: {}, // url -> file
    cacheUrls: {}, // [module-id] -> url
  },
  getters: {
    id(state) {
      return state.id;
    },
    name(state) {
      return state.name;
    },
    objectMapList(state, getters) {
      return Object.keys(OBJECTMODULE).map((module) => {
        return getters[`${module}/get`];
      });
    },
    urlDetails(state) {
      return state.cacheUrlDetails;
    },
    urls(state) {
      return state.cacheUrls;
    },
  },
  mutations: {
    initProject(state, { id, name }) {
      state.id = Number(id);
      state.name = name;
    },
    name(state, name) {
      state.name = name;
    },
    notifyAll(state) {
      Object.values(MODULETYPE).forEach((module) => {
        this.commit(`${module}/notify`);
      });
    },
    cacheUrl(state, { module, url, file }) {
      state.cacheUrls[`${module}-${file.id}`] = url;
      state.cacheUrlDetails[url] = file;
    },
  },
  actions: {
    notifyAll(context) {
      context.commit("notifyAll");
    },
    exportConfig(ctx) {
      const animation = ctx.rootGetters["animation/editorMap"];
      const animationTrack = ctx.rootGetters["animationTrack/get"];

      return {
        animation: JSON.parse(JSON.stringify(animation)),
        animationTrack: JSON.parse(JSON.stringify(animationTrack)),
      };
    },

    initEditorConfig(ctx, config) {
      ctx.commit("animation/init", config.animation || {});
      ctx.commit("animationTrack/init", config.animationTrack || {});
    },

    appendTemplateInit(ctx, config) {
      ctx.commit("animation/appendInit", config.animation || {});
      ctx.commit("animationTrack/appendInit", config.animationTrack || {});
    },
  },
  modules,
});
