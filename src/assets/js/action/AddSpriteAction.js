import { Action } from "@vis-three/convenient";
import { generateConfig } from "@vis-three/middleware";

export class AddSpriteAction extends Action {
  constructor({ config, store, engine }) {
    super();
    this.config = config;
    this.$store = store;
    this.engine = engine;
  }

  next() {
    const config = generateConfig(this.config.type, this.config);
    this.$store.commit("sprite/add", config);
    this.$store.getters["scene/currentScene"].children.push(this.config.vid);
  }

  prev() {
    const currentScene = this.$store.getters["scene/currentScene"];
    currentScene.children.splice(
      currentScene.children.indexOf(this.config.vid),
      1
    );
    this.$store.commit("sprite/remove", this.config.vid);
  }
}
