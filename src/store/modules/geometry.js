import Vue from "vue";
// 扩展vue
import { GeometryDataSupport, MODULETYPE } from "vis-three";

export const geometryDataSupport = new GeometryDataSupport();

export const module = {
  namespaced: true,
  state: {
    map: geometryDataSupport.getData(),
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
