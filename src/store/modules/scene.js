import { CONFIGTYPE, generateConfig, MODULETYPE } from "@vis-three/middleware";
import { engine } from "../../assets/js/VisFrame";

export const defaultScene = generateConfig(CONFIGTYPE.SCENE, {
  name: "默认场景",
});

export const sceneDataSupport = engine.dataSupportManager.getDataSupport(
  MODULETYPE.SCENE
);

sceneDataSupport.addConfig(defaultScene);

engine.setSceneBySymbol(defaultScene.vid);

export const module = {
  namespaced: true,
  state: {
    map: sceneDataSupport.getData(),
    currentScene: sceneDataSupport.getData()[defaultScene.vid],
  },
  getters: {
    get(state) {
      return state.map;
    },
    list(state) {
      return Object.values(state.map);
    },
    currentScene(state) {
      return state.currentScene;
    },
  },
  mutations: {
    notify(state) {
      state.map.__ob__.dep.notify();
    },
    currentScene(state, vid) {
      if (state.map[vid]) {
        state.currentScene = state.map[vid];
      } else {
        console.warn("scene store: can not found vid in map", vid);
      }
    },
  },
  actions: {},
};
