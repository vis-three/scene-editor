import Vue from "vue";

import { TextureDataSupport, MODULETYPE } from "vis-three";

export const textureDataSupport = new TextureDataSupport();

export const module = {
  namespaced: true,
  state: {
    map: textureDataSupport.getData(),
    module: MODULETYPE.TEXTURE,
    currentTexture: ""
  },
  getters: {
    get(state) {
      return state.map;
    },
    list(state) {
      return Object.values(state.map);
    },
    currentTexture(state) {
      return state.currentTexture;
    }
  },
  mutations: {
    add(state, config) {
      const observeObject = Vue.observable(config);
      state.map[observeObject.vid] = observeObject;
      state.map.__ob__.dep.notify();
      this.commit("texture/setCurrentTexture", config.vid);
    },

    notify(state) {
      state.map.__ob__.dep.notify();
    },

    setCurrentTexture(state, vid) {
      state.currentTexture = state.map[vid];
    },

    remove(state, vid) {
      Vue.delete(state.map, vid);
    }
  },
  actions: {}
};
