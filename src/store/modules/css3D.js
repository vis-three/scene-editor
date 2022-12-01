import Vue from "vue";
import { CSS3DDataSupport, MODULETYPE } from "vis-three";

export const css3DDataSupport = new CSS3DDataSupport();

export const module = {
  namespaced: true,
  state: {
    map: css3DDataSupport.getData(),
    module: MODULETYPE.CSS3D,
  },
  getters: {
    get(state) {
      return state.map;
    },
  },
  mutations: {
    add(state, config) {
      const observeObject = Vue.observable(config);
      state.map[observeObject.vid] = observeObject;
      state.map.__ob__.dep.notify();
    },

    remove(state, vid) {
      delete state.map[vid];
    },

    notify(state) {
      state.map.__ob__.dep.notify();
    },
  },
  actions: {},
};
