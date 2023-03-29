import Vue from "vue";
import { MODULETYPE } from "@vis-three/middleware";
import { engine } from "../../assets/js/VisFrame";

export const module = {
  namespaced: true,
  state: {
    map: engine.dataSupportManager.getDataSupport(MODULETYPE.PASS).getData(),
    module: MODULETYPE.PASS,
  },
  getters: {
    get(state) {
      return state.map;
    },
  },
  mutations: {
    add(state, config) {
      state.map[config.vid] = config;
      state.map.__ob__.dep.notify();
    },

    remove(state, vid) {
      Vue.delete(state.map, vid);
    },

    notify(state) {
      state.map.__ob__.dep.notify();
    },
  },
  actions: {},
};
