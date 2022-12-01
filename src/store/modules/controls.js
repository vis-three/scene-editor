import Vue from "vue";
import {
  CONFIGTYPE,
  ControlsDataSupport,
  generateConfig,
  MODULETYPE,
  uniqueSymbol,
} from "vis-three";

const transformControls = generateConfig(CONFIGTYPE.TRNASFORMCONTROLS);
const orbitControls = generateConfig(CONFIGTYPE.ORBITCONTROLS);

export const controlsDataSupport = new ControlsDataSupport([
  transformControls,
  orbitControls,
]);

export const module = {
  namespaced: true,
  state: {
    map: controlsDataSupport.getData(),
    module: MODULETYPE.CONTROLS,
  },
  getters: {
    get(state) {
      return state.map;
    },

    transformControls(state) {
      return state.map[transformControls.vid];
    },

    orbitControls(state) {
      return state.map[orbitControls.vid];
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
  },
  actions: {},
};
