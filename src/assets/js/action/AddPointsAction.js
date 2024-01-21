import { Action } from "@vis-three/convenient";
import { generateConfig } from "@vis-three/middleware";

export class AddPointsAction extends Action {
  constructor({ materialConfig, pointsConfig, store, engine }) {
    super();
    this.materialConfig = materialConfig;
    this.pointsConfig = pointsConfig;
    this.$store = store;
    this.engine = engine;
  }

  next() {
    const material = generateConfig(
      this.materialConfig.type,
      this.materialConfig
    );

    const points = generateConfig(this.pointsConfig.type, this.pointsConfig);

    this.$store.commit("material/add", material);
    this.$store.commit("points/add", points);

    this.$store.getters["scene/currentScene"].children.push(
      this.pointsConfig.vid
    );
  }

  prev() {
    const currentScene = this.$store.getters["scene/currentScene"];

    currentScene.children.splice(
      currentScene.children.indexOf(this.pointsConfig.vid),
      1
    );
    this.$store.commit("points/remove", this.pointsConfig.vid);
    this.$store.commit("material/remove", this.materialConfig.vid);
  }
}
