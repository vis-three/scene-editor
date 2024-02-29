import { Action } from "@vis-three/convenient";
import { SelectionAction } from "./SelectionAction";
import { generateConfig, JSONHandler } from "@vis-three/middleware";
export class DeleteObjectAction extends Action {
  constructor({ store, engine }) {
    super();
    this.$store = store;
    this.engine = engine;
    this.cacheSelected = [];
    this.cacheConfig = [];

    // 递归 symbolbox children
    const recursion = (objectSymbol) => {
      const config = engine.getConfigBySymbol(objectSymbol);

      if (!config) {
        console.warn(`can not found vid in engine: ${objectSymbol}`);
      }

      if (config.helper) {
        const helper = engine.getConfigBySymbol(config.helper);
        this.cacheConfig.push(JSONHandler.clone(helper));
      }

      this.cacheConfig.push(JSONHandler.clone(config));

      if (config.children.length) {
        config.children.forEach((vid) => {
          recursion(vid);
        });
      }
    };

    engine.selectionBox.forEach((object) => {
      const config = engine.getObjectConfig(object);
      this.cacheSelected.push(JSONHandler.clone(config));
      recursion(config.vid);
    });
  }

  next() {
    SelectionAction.touch = true;
    this.engine.setSelectionBox([]);
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
        this.engine.applyConfig(
          generateConfig(config.type, config, {
            strict: false,
          }),
        );
      });

    SelectionAction.touch = true;
    this.engine.setSelectionBoxBySymbol(
      this.cacheSelected.map((config) => {
        const parent = this.engine.getConfigBySymbol(config.parent);
        parent.children.push(config.vid);

        return config.vid;
      }),
    );
  }
}
