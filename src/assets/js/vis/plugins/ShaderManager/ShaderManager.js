import { ShaderGeneratorManager } from "@vis-three/middleware";
import Vue from "vue";

export class ShaderManager {
  constructor() {
    this.map = new Map(); // material.vid -> instanceof
    this.cacheShader = {}; // url -> Shader
    this.cachePkg = {}; // url -> pkg
    this.nameSourcesMap = {}; // name -> url
  }

  async loadList(urls = []) {
    return await Promise.all(
      urls.map((param) => this.load(param.url, param.pkg)),
    );
  }

  async load(url, pkg) {
    if (this.cacheShader[url]) {
      return this.cacheShader[url];
    }

    const shader = await new Promise((resolve, reject) => {
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

    this.cacheShader[url] = shader;
    this.cachePkg[url] = pkg;
    this.nameSourcesMap[shader.name] = url;

    ShaderGeneratorManager.register(shader);

    return shader;
  }

  async generate(url, pkg, material, config) {
    const shader = await this.load(url, pkg);

    const defaultConfig = {};

    pkg.configuration.forEach((item) => {
      defaultConfig[item.name] = item.default;
    });

    const shaderConfig = Vue.observable(
      ShaderGeneratorManager.generateConfig(shader.name, config),
    );

    this.map.set(material, shaderConfig);

    return {
      config: shaderConfig,
      packageJSON: pkg,
    };
  }

  get(vid) {
    return this.map.get(vid);
  }

  getPkgByName(name) {
    const url = this.nameSourcesMap[name];
    if (!url) {
      console.warn(`ShaderManager can not found name\`s url:${name}`);
      return;
    }

    return this.cachePkg[url];
  }

  remove(vid) {
    if (this.map.has(vid)) {
      const shader = this.map.get(vid);
      if (!shader) {
        console.warn(`shaderManager can not found shader width: ${vid}`);
        return;
      }

      this.map.delete(vid);
    }
  }

  exportConfig() {
    return {
      shaderAssets: Object.keys(this.cachePkg),
    };
  }
}
