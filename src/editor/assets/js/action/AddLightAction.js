import { Action } from "@vis-three/convenient";
import { JSONHandler, generateConfig } from "@vis-three/middleware";

export class AddLightAction extends Action {
  constructor({ config, helper, store, engine }) {
    super();
    this.config = JSONHandler.clone(config);
    this.helper = JSONHandler.clone(helper);
    this.$store = store;
    this.engine = engine;
  }

  next() {
    const config = generateConfig(this.config.type, this.config);
    const helper = generateConfig(this.helper.type, this.helper);
    this.$store.commit("light/add", config);
    this.$store.commit("helper/add", helper);
    this.$store.getters["scene/currentScene"].children.push(config.vid);
  }

  prev() {
    const currentScene = this.$store.getters["scene/currentScene"];
    currentScene.children.splice(
      currentScene.children.indexOf(this.config.vid),
      1
    );

    this.$store.commit("light/remove", this.config.vid);
    this.$store.commit("helper/remove", this.helper.vid);
  }
}
