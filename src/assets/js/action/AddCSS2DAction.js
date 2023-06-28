import { Action } from "@vis-three/convenient";

export class AddCSS2DAction extends Action {
  constructor({ config, store, engine }) {
    super();
    this.config = config;
    this.$store = store;
    this.engine = engine;
  }

  next() {
    this.$store.commit("css2D/add", this.config);
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
