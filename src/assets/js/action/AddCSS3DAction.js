import { JSONHandler, Action } from "vis-three";

export class AddCSS3DAction extends Action {
  constructor({ config, store, engine }) {
    super();
    this.config = config;
    this.$store = store;
    this.engine = engine;
  }

  next() {
    this.$store.commit("css3D/add", this.config);
    this.$store.getters["scene/currentScene"].children.push(this.config.vid);
  }

  prev() {
    const currentScene = this.$store.getters["scene/currentScene"];
    currentScene.children.splice(
      currentScene.children.indexOf(this.config.vid),
      1
    );
    this.$store.commit("cssD/remove", this.config.vid);
  }
}
