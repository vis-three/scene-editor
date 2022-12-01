import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const context = require.context("./", true, /\.js$/);

const modules = {};

context.keys().forEach((url) => {
  if (url !== "./index.js") {
    modules[
      url
        .split("/")
        .pop()
        .replace(/.\/|\.js$/g, "")
    ] = context(url).module;
  }
});

export default new Vuex.Store({
  state: {
    id: "",
    name: "",
  },
  getters: {
    id(state) {
      return state.id;
    },
    name(state) {
      return state.name;
    },
    objectMapList(state, getters) {
      return [
        getters["mesh/get"],
        getters["light/get"],
        getters["camera/get"],
        getters["sprite/get"],
        getters["css3D/get"],
        getters["group/get"],
        getters["line/get"],
        getters["object3D/get"],
      ];
    },
  },
  mutations: {
    initProject(state, id) {
      state.id = Number(id);
    },
    name(state, name) {
      state.name = name;
    },
    notifyAll(state) {
      this.commit("texture/notify");
      this.commit("material/notify");
      this.commit("camera/notify");
      this.commit("light/notify");
      this.commit("line/notify");
      this.commit("group/notify");
      this.commit("css3D/notify");
      this.commit("sprite/notify");
      this.commit("object3D/notify");
      this.commit("scene/notify");
      this.commit("renderer/notify");
    },
  },
  actions: {
    notifyAll(context) {
      context.commit("notifyAll");
    },
  },
  modules,
});
