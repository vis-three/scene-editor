import Vue from "vue";
import { MODULETYPE } from "@vis-three/middleware";
import { engine } from "../../assets/js/vis";

export const module = {
  namespaced: true,
  state: {
    map: engine.dataSupportManager.getDataSupport(MODULETYPE.SHAPE).getData(),
    module: MODULETYPE.SHAPE,
  },
  getters: {
    get(state) {
      return state.map;
    },
    list(state) {
      return Object.values(state.map);
    },
  },
  mutations: {
    add(state, config) {
      state.map[config.vid] = config;
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
