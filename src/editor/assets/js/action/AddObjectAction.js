import { Action } from "@vis-three/convenient";

export class AddObjectAction extends Action {
  constructor({ config, store, engine, module }) {
    super();
    this.config = config;
    this.$store = store;
    this.engine = engine;
    this.module = module;
  }

  next() {
    this.$store.commit(`${this.module}/add`, this.config);
    this.$store.getters["scene/currentScene"].children.push(this.config.vid);
  }

  prev() {
    const currentScene = this.$store.getters["scene/currentScene"];
    currentScene.children.splice(
      currentScene.children.indexOf(this.config.vid),
      1
    );
    this.$store.commit(`${this.module}/remove`, this.config.vid);
  }
}
