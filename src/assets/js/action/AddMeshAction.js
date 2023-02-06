import { Action } from "@vis-three/convenient";

export class AddMeshAction extends Action {
  constructor({ geometryConfig, meshConfig, store, engine }) {
    super();
    this.geometryConfig = geometryConfig;
    this.meshConfig = meshConfig;
    this.$store = store;
    this.engine = engine;
  }

  next() {
    this.$store.commit("geometry/add", this.geometryConfig);
    this.$store.commit("mesh/add", this.meshConfig);
    this.$store.getters["scene/currentScene"].children.push(
      this.meshConfig.vid
    );
  }

  prev() {
    const currentScene = this.$store.getters["scene/currentScene"];
    console.log(currentScene);
    currentScene.children.splice(
      currentScene.children.indexOf(this.meshConfig.vid),
      1
    );
    this.$store.commit("mesh/remove", this.meshConfig.vid);
    this.$store.commit("geometry/remove", this.geometryConfig.vid);
  }
}
