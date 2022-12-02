import { Action } from "vis-three";
import { Message } from "element-ui";
import { v4 } from "uuid";
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
    const url = this.componentItem.entry;
    const pkg = this.componentItem.pkg;

    const packageJSON = await axios.get(pkg);

    const { resource, config } = await this.engine.componentManager.generate(
      url,
      packageJSON,
      {
        $cid: v4(),
        $url: url,
        $pkg: pkg,
      }
    );

    this.$store.commit("component/add", {
      config,
      configuration: packageJSON.configuration,
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
