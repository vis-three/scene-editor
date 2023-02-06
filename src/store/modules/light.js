import Vue from "vue";
import {
  CONFIGTYPE,
  generateConfig,
  LightDataSupport,
  MODULETYPE,
} from "@vis-three/middleware";

export const lightDataSupport = new LightDataSupport();

export const module = {
  namespaced: true,
  state: {
    map: lightDataSupport.getData(),
    module: MODULETYPE.LIGHT,
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

    notify(state) {
      state.map.__ob__.dep.notify();
    },

    remove(state, vid) {
      Vue.delete(state.map, vid);
    },
  },
  actions: {},
};
