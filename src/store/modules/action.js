import { engine } from "@/assets/js/VisFrame";

export const module = {
  namespaced: true,
  state: {},
  getters: {
    get() {
      return 1;
    },
  },
  mutations: {
    objectAdd(state, { vid, next, prev }) {
      const cacheObject = this.getters["active/object"];
      this.commit("history/apply", {
        next: () => {
          next();
          this.commit("active/setObject", vid);
        },
        prev: () => {
          prev();
          if (cacheObject) {
            this.commit("active/setObject", cacheObject.vid);
          } else {
            this.commit("active/clearObject");
          }
        },
      });
    },
    // 变换
    transform(state, { mode, oldData, newData }) {
      const transform = (data) => {
        this.getters["controls/transformControls"].mode = mode;
        let key = mode;
        key === "translate" && (key = "position");
        key === "rotate" && (key = "rotation");
        let objectList = [];
        for (let object of data) {
          const config = this.getters["attribute/getConfig"](object.vid);
          config[key].x = object.x;
          config[key].y = object.y;
          config[key].z = object.z;
          objectList.push(engine.compilerManager.getObject(object.vid));
        }
        engine.transformControls.setAttach(...objectList);
      };
      this.commit("history/apply", {
        next: () => {
          transform(newData);
        },
        prev: () => {
          transform(oldData);
        },
      });
    },
    // 模型添加
    modelAdd(state, { geometryConfig, modelConfig }) {
      this.commit("action/objectAdd", {
        vid: modelConfig.vid,
        next: () => {
          this.commit("geometry/add", geometryConfig);
          this.commit("mesh/add", modelConfig);
        },
        prev: () => {
          this.commit("mesh/remove", modelConfig.vid);
          this.commit("geometry/remove", geometryConfig.vid);
        },
      });
    },
    // 灯光添加
    lightAdd(state, config) {
      this.commit("action/objectAdd", {
        vid: config.vid,
        next: () => {
          this.commit("light/add", config);
        },
        prev: () => {
          this.commit("light/remove", config.vid);
        },
      });
    },
    // 相机添加
    cameraAdd(state, config) {
      this.commit("action/objectAdd", {
        vid: config.vid,
        next: () => {
          this.commit("camera/add", config);
        },
        prev: () => {
          this.commit("camera/remove", config.vid);
        },
      });
    },
  },
  actions: {},
};
