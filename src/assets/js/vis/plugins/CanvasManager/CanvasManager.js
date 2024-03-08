import { install } from "@vis-resm/importmap";
import Vue from "vue";

export class CanvasManager {
  static textureUpdate = function (texture) {};

  constructor() {
    this.map = new Map(); // cid -> instanceof
    this.cacheReactor = {}; // url -> Reactor
    this.cachePkg = {}; // url -> pkg
    this.cacheFun = {}; // cid -> {update: fun, reload: fun}
  }

  async loadList(urls = []) {
    return await Promise.all(urls.map((url) => this.load(url)));
  }

  async load(url, pkg) {
    if (this.cacheReactor[url]) {
      return this.cacheReactor[url];
    }

    if (pkg.importmap) {
      await install(pkg, "custom", pkg.importmap);
    } else {
      await install(pkg);
    }

    const reactor = await new Promise((resolve, reject) => {
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

    this.cacheReactor[url] = reactor;
    this.cachePkg[url] = pkg;

    return reactor;
  }

  async generate(url, pkg, config) {
    const Reactor = await this.load(url, pkg);

    const defaultConfig = {};

    pkg.configuration.forEach((item) => {
      defaultConfig[item.name] = item.default;
    });

    const reactor = new Reactor(
      Vue.observable(
        JSON.parse(
          JSON.stringify(Object.assign(defaultConfig, config, { $url: url })),
        ),
      ),
    );

    this.map.set(config.$cid, reactor);

    return {
      resource: reactor,
      canvas: reactor.canvas,
      config: reactor.data,
      packageJSON: pkg,
    };
  }

  eventDocking(cid, texture) {
    const reactor = this.map.get(cid);
    if (!reactor) {
      console.warn(`canvasManager can not found reactor width: ${cid}`);
      return;
    }

    const updateFun = () => {
      texture.needsUpdate = true;
      CanvasManager.textureUpdate(texture);
    };

    const reloadFun = () => {
      texture.url = texture.url;
      CanvasManager.textureUpdate(texture);
    };

    this.cacheFun[cid] = {
      update: updateFun,
      reload: reloadFun,
    };

    reactor.on("update", updateFun);
    reactor.on("reload", reloadFun);
  }

  get(cid) {
    return this.map.get(cid);
  }

  remove(cid) {
    if (this.map.has(cid)) {
      const reactor = this.map.get(cid);
      if (!reactor) {
        console.warn(`canvasManager can not found reactor width: ${cid}`);
        return;
      }

      this.map.delete(cid);

      const cacheFun = this.cacheFun[cid];
      if (cacheFun) {
        reactor.off("update", cacheFun.update);
        reactor.off("reload", cacheFun.reload);
        delete this.cacheFun[cid];
      }
    }
  }

  exportConfig() {
    const canvas = [];
    for (const reactor of this.map.values()) {
      const pkg = this.cachePkg[reactor.data.$url];
      if (!pkg) {
        console.warn(
          `can not found pkg in canvasManager: ${reactor.data.$url}`,
        );
        continue;
      }

      const data = {
        $cid: reactor.data.$cid,
        $url: reactor.data.$url,
      };

      pkg.configuration.forEach((item) => {
        data[item.name] = reactor.data[item.name];
      });

      canvas.push(JSON.parse(JSON.stringify(data)));
    }

    return {
      canvas,
      canvasAssets: Object.keys(this.cachePkg),
    };
  }
}
