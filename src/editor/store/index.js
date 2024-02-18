import { MODULETYPE, OBJECTMODULE, JSONHandler } from "@vis-three/middleware";
import modelApi from "@/assets/js/api/model.js";
import textureApi from "@/assets/js/api/texture.js";
import componentApi from "@/assets/js/api/component.js";
import canvasApi from "@/assets/js/api/canvas.js";
import { Message } from "element-ui";
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const context = import.meta.glob("./modules/*.js", {
  import: "module",
  eager: true,
});

const modules = {};

Object.keys(context).forEach((url) => {
  modules[
    url
      .split("/")
      .pop()
      .replace(/.\/|\.js$/g, "")
  ] = context[url];
});

export default new Vuex.Store({
  state: {
    id: "",
    name: "",
    cacheUrlDetails: {}, // url -> file
    cacheUrls: {}, // [module-id] -> url
  },
  getters: {
    id(state) {
      return state.id;
    },
    name(state) {
      return state.name;
    },
    objectMapList(state, getters) {
      return Object.keys(OBJECTMODULE).map((module) => {
        return getters[`${module}/get`];
      });
    },
    urlDetails(state) {
      return state.cacheUrlDetails;
    },
    urls(state) {
      return state.cacheUrls;
    },
  },
  mutations: {
    initProject(state, { id, name }) {
      state.id = Number(id);
      state.name = name;
    },
    name(state, name) {
      state.name = name;
    },
    notifyAll(state) {
      Object.values(MODULETYPE).forEach((module) => {
        this.commit(`${module}/notify`);
      });
    },
    cacheUrl(state, { module, url, file }) {
      state.cacheUrls[`${module}-${file.id}`] = url;
      state.cacheUrlDetails[url] = file;
    },
  },
  actions: {
    notifyAll(context) {
      context.commit("notifyAll");
    },
    exportConfig(ctx) {
      const animation = ctx.rootGetters["animation/editorMap"];
      const animationTrack = ctx.rootGetters["animationTrack/get"];

      return {
        animation: JSON.parse(JSON.stringify(animation)),
        animationTrack: JSON.parse(JSON.stringify(animationTrack)),
      };
    },

    initEditorConfig(ctx, config) {
      ctx.commit("animation/init", config.animation || {});
      ctx.commit("animationTrack/init", config.animationTrack || {});
    },

    appendTemplateInit(ctx, config) {
      ctx.commit("animation/appendInit", config.animation || {});
      ctx.commit("animationTrack/appendInit", config.animationTrack || {});
    },
    urlTransform(ctx, app) {
      let appJson = JSON.stringify(app, JSONHandler.stringify);
      const urlDetails = ctx.state.cacheUrlDetails;

      app.assets = app.assets.map((elem) => {
        const result = {
          id: null,
          module: null,
        };

        if (!urlDetails[elem.url]) {
          Message.error(`导出失败，未找到相关资源缓存：${elem.url}`);
        } else {
          const file = urlDetails[elem.url];
          result.id = file.id;
          result.module = file.model
            ? "model"
            : file.texture
              ? "texture"
              : null;

          appJson = appJson.replace(
            new RegExp(elem.url, "g"),
            `<${result.module}-${result.id}>`,
          );
        }

        return result;
      });

      app.canvasAssets = app.canvasAssets.map((url) => {
        const result = {
          id: null,
          module: "canvas",
        };

        if (!urlDetails[url]) {
          Message.error(`导出失败，未找到相关资源缓存：${url}`);
        } else {
          const file = urlDetails[url];
          result.id = file.id;

          appJson = appJson.replace(
            new RegExp(url, "g"),
            `<${result.module}-${result.id}>`,
          );
        }

        return result;
      });

      app.component.forEach((elem) => {
        const result = {
          id: null,
          module: "component",
        };

        if (!urlDetails[elem.$url]) {
          Message.error(`导出失败，未找到相关资源缓存：${elem.$url}`);
        } else {
          const file = urlDetails[elem.$url];
          result.id = file.id;
          appJson = appJson.replace(
            new RegExp(elem.$url, "g"),
            `<${result.module}-${result.id}>`,
          );
        }

        elem.$url = `<${result.module}-${result.id}>`;
      });

      appJson = JSON.parse(appJson, JSONHandler.parse);
      appJson.assets = app.assets;
      appJson.canvasAssets = app.canvasAssets;
      app = appJson;

      return app;
    },
    async assetsTransform(ctx, config) {
      let configJson = JSON.stringify(config, JSONHandler.stringify);

      !config.assets && (config.assets = []);
      !config.canvasAssets && (config.canvasAssets = []);

      const assetsPromise = [];

      config.assets.forEach((item) => {
        if (item.module === "model") {
          assetsPromise.push(
            new Promise((resolve, reject) => {
              modelApi
                .getModel(item.id)
                .then((file) => {
                  const url = URL.createObjectURL(file.model);
                  ctx.commit("cacheUrl", {
                    module: "model",
                    file,
                    url,
                  });

                  configJson = configJson.replace(
                    new RegExp(`<${item.module}-${item.id}>`, "g"),
                    url,
                  );
                  resolve({ url, ext: file.ext });
                })
                .catch(reject);
            }),
          );
        } else if (item.module === "texture") {
          assetsPromise.push(
            new Promise((resolve, reject) => {
              textureApi
                .getTexture(item.id)
                .then((file) => {
                  const url = URL.createObjectURL(file.texture);
                  ctx.commit("cacheUrl", {
                    module: "texture",
                    file,
                    url,
                  });
                  configJson = configJson.replace(
                    new RegExp(`<${item.module}-${item.id}>`, "g"),
                    url,
                  );
                  resolve({ url, ext: file.ext });
                })
                .catch(reject);
            }),
          );
        }
      });

      const canvasAssetsPromise = [];

      config.canvasAssets.forEach((item) => {
        canvasAssetsPromise.push(
          new Promise((resolve, reject) => {
            canvasApi
              .getCanvas(item.id)
              .then((file) => {
                const url = URL.createObjectURL(file.canvas);
                ctx.commit("cacheUrl", {
                  module: "canvas",
                  file,
                  url,
                });

                configJson = configJson.replace(
                  new RegExp(`<${item.module}-${item.id}>`, "g"),
                  url,
                );
                resolve({ url, file });
              })
              .catch(reject);
          }),
        );
      });

      !config.component && (config.component = []);
      const componentsPromise = [];

      config.component.forEach((item) => {
        const [module, id] = item.$url.slice(1, -1).split("-");
        componentsPromise.push(
          new Promise((resolve, reject) => {
            componentApi.getComponent(id).then((file) => {
              const url = URL.createObjectURL(file.component);
              ctx.commit("cacheUrl", {
                module: "component",
                file,
                url,
              });

              configJson = configJson.replace(
                new RegExp(`<${module}-${id}>`, "g"),
                url,
              );

              item.$url = url;
              item.$pkg = file.pkg;

              resolve(item);
            });
          }),
        );
      });

      config.assets = await Promise.all(assetsPromise);
      config.canvasAssets = await Promise.all(canvasAssetsPromise);
      config.component = await Promise.all(componentsPromise);

      configJson = JSON.parse(configJson, JSONHandler.parse);
      configJson.assets = config.assets;
      configJson.canvasAssets = config.canvasAssets;
      configJson.component = config.component;

      configJson.canvas &&
        configJson.canvas.forEach((elem) => {
          elem.$pkg = config.canvasAssets.find(
            (item) => item.url === elem.$url,
          ).file.pkg;
        });

      return configJson;
    },
  },
  modules,
});
