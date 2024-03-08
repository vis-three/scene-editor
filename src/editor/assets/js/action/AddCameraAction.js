import { Action } from "@vis-three/convenient";
import { generateConfig } from "@vis-three/middleware";

export class AddCameraAction extends Action {
  constructor({ config, helper, store, engine }) {
    super();
    this.config = config;
    this.helper = helper;
    this.$store = store;
    this.engine = engine;
  }

  next() {
    const config = generateConfig(this.config.type, this.config);
    const helper = generateConfig(this.helper.type, this.helper);
    this.$store.commit("camera/add", config);
    this.$store.getters["scene/currentScene"].children.push(this.config.vid);
    this.$store.commit("helper/add", helper);
  }

  prev() {
    const currentScene = this.$store.getters["scene/currentScene"];
    currentScene.children.splice(
      currentScene.children.indexOf(this.config.vid),
      1,
    );
    this.$store.commit("camera/remove", this.config.vid);
    this.$store.commit("helper/remove", this.helper.vid);
  }
}
