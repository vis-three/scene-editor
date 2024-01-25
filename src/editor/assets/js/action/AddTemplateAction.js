import { Action } from "@vis-three/convenient";
import { Template, generateConfig, OBJECTMODULE } from "@vis-three/middleware";
import Vue from "vue";

export class AddTemplateAction extends Action {
  constructor({ template, editor, store, engine }) {
    super();
    this.template = template;
    this.editor = editor;
    this.$store = store;
    this.engine = engine;
    this.objectList = [];

    const currentScene = store.getters["scene/currentScene"].vid;

    for (const module in template) {
      if (OBJECTMODULE[module]) {
        for (const config of template[module]) {
          if (config.parent == currentScene) {
            this.objectList.push(config.vid);
          }
        }
      }
    }
  }

  next() {
    this.engine
      .loadConfigAsync(
        Template.handler(this.template, (c) =>
          generateConfig(c.type, c, { handler: (c) => Vue.observable(c) })
        )
      )
      .then((res) => {
        this.$store.getters["scene/currentScene"].children.push(
          ...this.objectList
        );

        this.$store.commit("appendTemplateInit", this.editor);
      });
  }

  prev() {
    const sceneConfig = this.$store.getters["scene/currentScene"];
    for (const vid of this.objectList) {
      sceneConfig.children.splice(sceneConfig.children.indexOf(vid), 1);
    }
    this.engine.removeConfig(this.template);
  }
}
