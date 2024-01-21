import { Action } from "@vis-three/convenient";
import { generateConfig } from "@vis-three/middleware";

export class AddMeshAction extends Action {
  constructor({ geometryConfig, meshConfig, helperConfig, store, engine }) {
    super();
    this.geometryConfig = geometryConfig;
    this.meshConfig = meshConfig;
    this.helperConfig = helperConfig;
    this.$store = store;
    this.engine = engine;
  }

  next() {
    const geometry = generateConfig(
      this.geometryConfig.type,
      this.geometryConfig
    );

    const mesh = generateConfig(this.meshConfig.type, this.meshConfig);

    const helper = generateConfig(this.helperConfig.type, this.helperConfig);

    this.$store.commit("geometry/add", geometry);
    this.$store.commit("mesh/add", mesh);

    this.$store.getters["scene/currentScene"].children.push(
      this.meshConfig.vid
    );

    this.$store.commit("helper/add", helper);
  }

  prev() {
    const currentScene = this.$store.getters["scene/currentScene"];

    currentScene.children.splice(
      currentScene.children.indexOf(this.meshConfig.vid),
      1
    );
    this.$store.commit("helper/remove", this.helperConfig.vid);
    this.$store.commit("mesh/remove", this.meshConfig.vid);
    this.$store.commit("geometry/remove", this.geometryConfig.vid);
  }
}
