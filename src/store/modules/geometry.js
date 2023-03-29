import Vue from "vue";
import { MODULETYPE } from "@vis-three/middleware";
import { engine } from "../../assets/js/VisFrame";

export const module = {
  namespaced: true,
  state: {
    map: engine.dataSupportManager
      .getDataSupport(MODULETYPE.GEOMETRY)
      .getData(),
    module: MODULETYPE.GEOMETRY,
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
      const vid = config.vid;

      state.map[vid] = config;
      state.map.__ob__.dep.notify();
      state.active = state.map[vid];
    },

    remove(state, vid) {
      Vue.delete(state.map, vid);
    },
  },
  actions: {},
};
