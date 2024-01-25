import { Action } from "@vis-three/convenient";
import Vue from "vue";

export class AddLineAction extends Action {
  constructor({ engine, store, line, geometry }) {
    super();
    this.$store = store;
    this.engine = engine;
    this.line = line;
    this.geometry = geometry;
  }

  next() {
    const geometry = Vue.observable(this.geometry);
    const line = Vue.observable(this.line);

    this.engine.applyConfig(geometry, line);

    const scene = this.$store.getters["scene/currentScene"];
    scene.children.push(line.vid);
    this.$store.commit("line/notify");
  }

  prev() {
    const line = this.line;
    const scene = this.$store.getters["scene/currentScene"];
    scene.children.splice(scene.children.indexOf(line.vid), 1);
    this.engine.removeConfigBySymbol(this.line.vid, this.geometry.vid);
  }
}
