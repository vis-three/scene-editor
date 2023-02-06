import Vue from "vue";
import { MODULETYPE } from "@vis-three/middleware";
import { PassDataSupport } from "@vis-three/composer-support-strategy";

export const passDataSupport = new PassDataSupport();

export const module = {
  namespaced: true,
  state: {
    map: passDataSupport.getData(),
    module: MODULETYPE.PASS,
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
      Vue.delete(state.map, vid);
    },

    notify(state) {
      state.map.__ob__.dep.notify();
    },
  },
  actions: {},
};
