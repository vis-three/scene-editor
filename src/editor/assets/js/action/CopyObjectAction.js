import { Action } from "@vis-three/convenient";
import {
  createSymbol,
  generateConfig,
  JSONHandler,
} from "@vis-three/middleware";
import Vue from "vue";

export class CopyObjectAction extends Action {
  static tempSymbol = "";
  constructor({ store, engine }) {
    super();
    this.$store = store;
    this.engine = engine;
    this.targetSymbol = CopyObjectAction.tempSymbol;

    this.canPass = true;
    const config = this.engine.getConfigBySymbol(this.targetSymbol);

    if (!config) {
      console.error(`can not found object in engine: ${this.targetSymbol}`);
      this.canPass = false;
    }

    // TODO:递归配置所有children形成vid映射然后替换

    this.newConfig = new JSONHandler.Pipeline(config)
      .pipe((c) => JSON.stringify(c, JSONHandler.stringify))
      .pipe((c) => c.replace(new RegExp(config.vid, "g"), createSymbol()))
      .pipe((c) => JSON.parse(c, JSONHandler.parse))
      .pipe((c) => {
        c.name = `${c.name}-复制`;
        return c;
      })
      .pipe((c) =>
        generateConfig(c.type, c, {
          hanlder: (c) => Vue.observable(c),
        })
      )
      .get();
  }

  next() {
    this.engine.applyConfig(this.newConfig);
    this.$store.getters["scene/currentScene"].children.push(this.newConfig.vid);
  }

  prev() {
    const currentScene = this.$store.getters["scene/currentScene"];
    currentScene.children.splice(
      currentScene.children.indexOf(this.newConfig.vid),
      1
    );
    this.engine.removeConfigBySymbol(this.newConfig.vid);
  }
}
