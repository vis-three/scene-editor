import { Action } from "@vis-three/convenient";
import { createSymbol } from "@vis-three/middleware";
import { Message } from "element-ui";

import axios from "@/assets/js/plugins/axios";

export class ChangeComponentAction extends Action {
  constructor({ engine, store, componentItem, objectSymbol }) {
    super();
    this.engine = engine;
    this.$store = store;
    this.componentItem = componentItem;
    this.objectSymbol = objectSymbol;

    const objectConfig = engine.getConfigBySymbol(objectSymbol);
    if (!objectConfig) {
      this.error = true;
      return;
    }
    this.oldElement = objectConfig.element;
    this.$cid = "";
  }

  async generateComponent() {
    const loading = Message.loading("正在生成组件...");
    const file = this.componentItem;

    console.log(file);
    const urls = this.$store.getters.urls;

    let url = urls[`component-${file.id}`];

    if (!url) {
      url = URL.createObjectURL(file.component);
      this.$store.commit("cacheUrl", {
        module: "component",
        file,
        url,
      });
    }

    const { resource, config } = await this.engine.componentManager.generate(
      url,
      file.pkg,
      {
        $cid: createSymbol(),
      }
    );

    this.$store.commit("component/add", {
      config,
      configuration: file.pkg.configuration,
    });

    this.engine.registerResources({
      [config.$cid]: resource,
    });

    this.$cid = config.$cid;
    loading.close();
  }

  next() {
    if (!this.error) {
      const config = this.engine.getConfigBySymbol(this.objectSymbol);
      config.element = this.$cid;
    }
  }

  prev() {
    if (!this.error) {
      const config = this.engine.getConfigBySymbol(this.objectSymbol);
      config.element = this.oldElement;
    }
  }
}
