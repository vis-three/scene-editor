import { Action } from "vis-three";

// 物体变换动作
export class TransformAction extends Action {
  constructor({ engine, transformControls }) {
    super();
    this.transformControls = transformControls;
    this.engine = engine;
    this.nextState = {
      mode: "translate",
      space: "world",
      tranform: "",
      objectMap: new Map()
    };
    this.prevState = {
      mode: "translate",
      space: "world",
      tranform: "",
      objectMap: new Map()
    };
  }

  generate(status) {
    const compilerManager = this.engine.compilerManager;
    const dataSupportManager = this.engine.dataSupportManager;
    const transformControls = this.transformControls;
    const mode = transformControls.mode;
    const tranform =
      mode === "rotate" ? "rotation" : mode === "translate" ? "position" : mode;
    const objectSet = transformControls.getTransObjectSet();
    const state = this[`${status}State`];

    // 缓存变换控制器设置
    state.mode = mode;
    state.tranform = tranform;
    state.space = transformControls.space;

    // 缓存物体位置
    const cacheMap = state.objectMap;
    objectSet.forEach(object => {
      const vid = compilerManager.getObjectSymbol(object);
      if (vid) {
        cacheMap.set(vid, {
          x: object[tranform].x,
          y: object[tranform].y,
          z: object[tranform].z
        });
      } else {
        console.warn(`transform action can not found vid`, object);
      }
    });

    this[status] = function() {
      const transformControls = this.transformControls;
      const state = this[`${status}State`];
      transformControls.mode = state.mode;
      transformControls.space = state.space;
      const tranform = state.tranform;
      const objects = [];
      state.objectMap.forEach((vector3, vid) => {
        const config = dataSupportManager.getConfigBySymbol(vid);
        const object = compilerManager.getObjectBySymbol(vid);
        if (config) {
          config[tranform].x = vector3.x;
          config[tranform].y = vector3.y;
          config[tranform].z = vector3.z;
        } else {
          console.warn(`transform action can not found config: ${vid}`);
        }

        if (object) {
          objects.push(object);
          object.updateWorldMatrix();
        } else {
          console.warn(`transform action can not found object: ${vid}`);
        }
      });

      transformControls.setAttach(...objects);
    };
  }
}
