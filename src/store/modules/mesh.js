import Vue from "vue";
import { MeshDataSupport, MODULETYPE } from "@vis-three/middleware";

export const meshDataSupport = new MeshDataSupport();

export const module = {
  namespaced: true,
  state: {
    map: meshDataSupport.getData(),
    module: MODULETYPE.MESH,
    currentModel: "",
  },
  getters: {
    get(state) {
      return state.map;
    },
    currentModel(state) {
      return state.currentModel;
    },
  },
  mutations: {
    add(state, config) {
      state.map[config.vid] = config;
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
