import { Action } from "@vis-three/convenient";
import { JSONHandler, generateConfig } from "@vis-three/middleware";

export class AddCSS2DAction extends Action {
  constructor({ config, store, engine }) {
    super();
    this.config = JSONHandler.clone(config);
    this.$store = store;
    this.engine = engine;
  }

  next() {
    this.$store.commit(
      "css2D/add",
      generateConfig(this.config.type, this.config)
    );
    this.$store.getters["scene/currentScene"].children.push(this.config.vid);
  }

  prev() {
    const currentScene = this.$store.getters["scene/currentScene"];
    currentScene.children.splice(
      currentScene.children.indexOf(this.config.vid),
      1
    );
    this.$store.commit("css2D/remove", this.config.vid);
  }
}
