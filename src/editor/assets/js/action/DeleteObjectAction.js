import { Action } from "@vis-three/convenient";
import { generateConfig, JSONHandler } from "@vis-three/middleware";
export class DeleteObjectAction extends Action {
  constructor({ store, engine, objectSymbol }) {
    super();
    this.$store = store;
    this.engine = engine;
    this.cacheConfig = [];

    // 递归 symbolbox children
    const recursion = (objectSymbol) => {
      const config = engine.getConfigBySymbol(objectSymbol);

      if (!config) {
        console.warn(`can not found vid in engine: ${objectSymbol}`);
      }

      this.cacheConfig.push(JSONHandler.clone(config));

      if (config.children.length) {
        config.children.forEach((vid) => {
          recursion(vid);
        });
      }
    };

    recursion(objectSymbol);
  }

  next() {
    // 先移除所有child
    this.cacheConfig.forEach((config) => {
      if (config.parent) {
        const parent = this.engine.getConfigBySymbol(config.parent);

        if (!parent) {
          console.warn(`can not found vid in engine: ${config.vid}`);
        } else {
          parent.children.splice(parent.children.indexOf(config.vid), 1);
        }
      }
    });
    // 从上往下移除
    this.cacheConfig.forEach((config) => {
      this.engine.removeConfigBySymbol(config.vid);
    });
  }

  prev() {
    // 从后往前添加
    []
      .concat(this.cacheConfig)
      .reverse()
      .forEach((config) => {
        this.engine.applyConfig(generateConfig(config.type, config));
      });
    const parent = this.engine.getConfigBySymbol(this.cacheConfig[0].parent);
    parent.children.push(this.cacheConfig[0].vid);
  }
}
