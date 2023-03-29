import Vue from "vue";
import { MODULETYPE } from "@vis-three/middleware";
import { engine } from "../../assets/js/VisFrame";

export const module = {
  namespaced: true,
  state: {
    map: engine.dataSupportManager
      .getDataSupport(MODULETYPE.OBJECT3D)
      .getData(),
    module: MODULETYPE.OBJECT3D,
    currentModel: "",
  },
  getters: {
    get(state) {
      return state.map;
    },
    currentModel(state) {
      return state.currentModel;
    },
  },
  mutations: {
    add(state, config) {
      const observeObject = Vue.observable(config);
      state.map[observeObject.vid] = observeObject;
      state.map.__ob__.dep.notify();
    },

    notify(state) {
      state.map.__ob__.dep.notify();
    },

    remove(state, vid) {
      Vue.delete(state.map, vid);
    },
  },
  actions: {},
};
