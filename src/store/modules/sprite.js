import Vue from "vue";
import { SpriteDataSupport, MODULETYPE } from "vis-three";

export const spriteDataSupport = new SpriteDataSupport();

export const module = {
  namespaced: true,
  state: {
    map: spriteDataSupport.getData(),
    module: MODULETYPE.SPRITE
  },
  getters: {
    get(state) {
      return state.map;
    }
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
    }
  },
  actions: {}
};
