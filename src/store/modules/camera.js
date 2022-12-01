import Vue from "vue";
import { CameraDataSupport, MODULETYPE } from "vis-three";

export const cameraDataSupport = new CameraDataSupport();

export const module = {
  namespaced: true,
  state: {
    map: cameraDataSupport.getData(),
    module: MODULETYPE.CAMERA,
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
      delete state.map[vid];
    },
  },
  actions: {},
};
