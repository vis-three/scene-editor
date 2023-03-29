import Vue from "vue";
import { MODULETYPE } from "@vis-three/middleware";
import { engine } from "../../assets/js/VisFrame";

export const module = {
  namespaced: true,
  state: {
    map: engine.dataSupportManager
      .getDataSupport(MODULETYPE.MATERIAL)
      .getData(),
    module: MODULETYPE.MATERIAL,
    draggedMaterial: "",
    dragging: false,
  },
  getters: {
    get(state) {
      return state.map;
    },
    list(state) {
      return Object.values(state.map);
    },
    dragging(state) {
      return state.dragging;
    },
    draggedMaterial(state) {
      return state.draggedMaterial;
    },
  },
  mutations: {
    dragging(state, status) {
      state.dragging = status;
    },
    setDraggedMaterial(state, vid) {
      state.draggedMaterial = vid;
    },

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
