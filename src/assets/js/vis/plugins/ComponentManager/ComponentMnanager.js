import { install } from "@vis-resm/importmap";
import Vue from "vue";

export class ComponentManager {
  constructor() {
    this.map = new Map(); // cid -> instanceof
    this.cacheComponent = {}; // url -> component
    this.cachePkg = {}; // url -> pkg
  }

  async loadList(urls = []) {
    return await Promise.all(urls.map((url) => this.load(url)));
  }

  async load(url, pkg) {
    if (this.cacheComponent[url]) {
      return this.cacheComponent[url];
    }

    if (pkg.importmap) {
      await install(pkg, "custom", pkg.importmap);
    } else {
      await install(pkg);
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

    this.cacheComponent[url] = component;
    this.cachePkg[url] = pkg;
    return component;
  }

  async generate(url, pkg, config) {
    const component = await this.load(url, pkg);

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
          JSON.stringify(Object.assign(component.data(), config, { $url: url }))
        );
      },
    });

    this.map.set(config.$cid, app);

    return {
      resource: dom,
      config: app._data,
      packageJSON: pkg,
    };
  }

  register(cid, component) {
    this.map.set(cid, component);
  }

  get(cid) {
    return this.map.get(cid);
  }

  remove(cid) {
    if (this.map.has(cid)) {
      const component = this.map.get(cid);
      this.map.delete(cid);
      component.$distory && component.$distory();
    }
  }

  exportConfig() {
    const object = [];
    for (const component of this.map.values()) {
      const pkg = this.cachePkg[component._data.$url];
      if (!pkg) {
        console.warn(
          `can not found pkg in componentManager: ${component._data.$url}`
        );
        continue;
      }

      const data = {
        $cid: component._data.$cid,
        $url: component._data.$url,
      };

      pkg.configuration.forEach((item) => {
        data[item.name] = component[item.name];
      });

      object.push(JSON.parse(JSON.stringify(data)));
    }

    return object;
  }
}
