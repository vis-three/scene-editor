import Vue from "vue";
import { LineDataSupport, MODULETYPE } from "@vis-three/middleware";

export const lineDataSupport = new LineDataSupport();

export const module = {
  namespaced: true,
  state: {
    map: lineDataSupport.getData(),
    module: MODULETYPE.LINE,
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
