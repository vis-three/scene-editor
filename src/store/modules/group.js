import Vue from "vue";
import { GroupDataSupport, MODULETYPE } from "@vis-three/middleware";

export const groupDataSupport = new GroupDataSupport();

export const module = {
  namespaced: true,
  state: {
    map: groupDataSupport.getData(),
    module: MODULETYPE.SPRITE,
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
