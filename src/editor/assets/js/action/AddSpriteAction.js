import { Action } from "@vis-three/convenient";
import { generateConfig } from "@vis-three/middleware";

export class AddSpriteAction extends Action {
  constructor({ sprite, material, store, engine }) {
    super();
    this.sprite = sprite;
    this.material = material;
    this.$store = store;
    this.engine = engine;
  }

  next() {
    const sprite = generateConfig(this.sprite.type, this.sprite);
    const material = generateConfig(this.material.type, this.material);
    this.$store.commit("material/add", material);
    this.$store.commit("sprite/add", sprite);
    this.$store.getters["scene/currentScene"].children.push(this.sprite.vid);
  }

  prev() {
    const currentScene = this.$store.getters["scene/currentScene"];
    currentScene.children.splice(
      currentScene.children.indexOf(this.sprite.vid),
      1,
    );
    //TODO:材质监听删除
    // this.$store.commit("material/remove", this.material.vid);
    this.$store.commit("sprite/remove", this.sprite.vid);
  }
}
