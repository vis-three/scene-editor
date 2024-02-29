import Vue from "vue";
import { MODULETYPE } from "@vis-three/middleware";
import { engine } from "../../assets/js/vis";

export const module = {
  namespaced: true,
  state: {
    map: engine.dataSupportManager.getDataSupport(MODULETYPE.PATH).getData(),
    module: MODULETYPE.PATH,
    draw: false,
    drawPen: "line",
    drawGeometry: "",
    drawPath: "",
    drawType: "2d",
    cacheCamera: engine.pathSketcher.camera,
  },
  getters: {
    get(state) {
      return state.map;
    },
    list(state) {
      return Object.values(state.map);
    },
    draw(state) {
      return state.draw;
    },
    drawPen(state) {
      return state.drawPen;
    },
    drawGeometry(state) {
      return state.drawGeometry;
    },
    drawPath(state, getter, root) {
      if (state.drawGeometry.path) {
        return state.map[state.drawGeometry.path];
      } else if (state.drawGeometry.shape) {
        const shape = root.shape.map[state.drawGeometry.shape];
        return state.map[shape.shape];
      }
    },
    drawType(state) {
      return state.drawType;
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
    draw(state, { status, geometry, drawType }) {
      if (status) {
        if (drawType === "2d") {
          engine.setViewpoint("front");
          engine.pathSketcher
            .setCamera(state.cacheCamera)
            .setSketcherByPlane()
            .changeToDrawingView()
            .beginDraw();
          engine.setSize();
        } else if (drawType === "3d") {
          engine.pathSketcher
            .setCamera(engine.camera)
            .setAutoPlane(true)
            .beginDraw();
        }
      } else {
        if (drawType === "2d") {
          engine.pathSketcher.endDraw();
          engine.setViewpoint("default");
        } else if (drawType === "3d") {
          engine.pathSketcher.setAutoPlane(false).endDraw();
        }
      }

      state.draw = status;
      state.drawGeometry = geometry || "";
      state.drawType = drawType || "2d";
    },
    drawPen(state, pen) {
      state.drawPen = pen;
    },
  },
  actions: {},
};
