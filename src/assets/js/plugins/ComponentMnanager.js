import axios from "@/assets/js/plugins/axios";
import { install } from "@vis-resm/importmap";
import Vue from "vue";

export class ComponentManager {
  constructor() {
    this.cacheURL = new Map();
    this.cacheComponent = new Map();
  }

  async generate(url, packageJSON, config) {
    install(packageJSON);

    if (this.cacheURL.has(url)) {
      url = this.cacheURL.get(url);
    } else {
      const res = await axios.get(url);

      const cacheUrl = URL.createObjectURL(
        new Blob([res], { type: "text/javascript" })
      );

      this.cacheURL.set(url, cacheUrl);
      url = cacheUrl;
    }

    const component = await new Promise((resolve, reject) => {
      // console.log({ ...window.importShim.getImportMap().imports });
      window
        .importShim(url)
        .then((res) => {
          resolve(res.default);
        })
        .catch((err) => {
          reject(err);
        });
    });

    const dom = document.createElement("div");
    dom.style.width = "100%";
    dom.style.height = "100%";
    dom.style.position = "absolute";
    dom.style.overflow = "hidden";

    document.body.appendChild(dom);

    const appDom = document.createElement("div");
    dom.appendChild(appDom);

    const ComponentExtend = Vue.extend(component);

    const app = new ComponentExtend({
      el: appDom,
      data() {
        return JSON.parse(
          JSON.stringify(Object.assign(component.data(), config))
        );
      },
    });

    this.cacheComponent.set(config.cid, dom);

    return { resource: dom, config: app._data };
  }

  register(cid, component) {
    this.cacheComponent.set(cid, component);
  }

  get(cid) {
    return this.cacheComponent.get(cid);
  }

  remove(cid) {
    if (this.cacheComponent.has(cid)) {
      const component = this.cacheComponent.get(cid);
      this.cacheComponent.delete(cid);
      component.$distory && component.$distory();
    }
  }
}
