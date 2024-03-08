<template>
  <div class="renderWindow-container">
    <iframe
      ref="renderMask"
      width="100%"
      height="100%"
      scrolling="no"
      class="render-mask"
    />
    <div ref="renderElement" class="render-window" tabindex="0" />
  </div>
</template>

<script>
import {
  uniqueSymbol,
  Template,
  generateConfig,
  CONFIGTYPE,
  JSONHandler,
} from "@vis-three/middleware";
import { engine } from "@/preview/assets/js/vis";
import appApi from "@/assets/js/api/app.js";
import modelApi from "@/assets/js/api/model.js";
import textureApi from "@/assets/js/api/texture.js";
import componentApi from "@/assets/js/api/component.js";
import canvasApi from "@/assets/js/api/canvas.js";
import shaderApi from "@/assets/js/api/shader.js";

import parse from "url-parse";

export default {
  data() {
    return {
      timer: "", // 刷新定时器
      canResize: true,
      throttleTime: 1000 / 60,
    };
  },
  async mounted() {
    engine.setDom(this.$refs.renderElement).setSize().play();

    // 渲染监听
    this.$watch(
      "play",
      (newVal) => {
        if (newVal) {
          engine.play();
        } else {
          engine.stop();
        }
      },
      { immediate: true },
    );

    // 自动窗口大小
    const renderMask = this.$refs.renderMask;
    renderMask.contentWindow.addEventListener("resize", (e) => {
      if (!this.canResize) {
        return false;
      } else {
        this.canResize = false;
        this.timer = setTimeout(() => {
          engine.setSize(renderMask.offsetWidth, renderMask.offsetHeight);
          this.canResize = true;
        }, this.throttleTime);
      }
    });

    const loading = this.$loading({
      text: "正在初始化项目...",
      background: "rgba(0, 0, 0, 0.3)",
    });

    const query = parse(window.location.href, true).query;

    const id = query.id;

    if (!id) {
      this.$message.warning("地址不正确！");
      loading.close();
      window.close();
    }

    const appMessage = await appApi.getApp(id).catch((err) => {
      this.$message.error(err);
      loading.close();
    });

    let config = appMessage.app || {};

    delete config.helper;

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

    const shaderAssetsPromise = [];

    config.shaderAssets.forEach((item) => {
      shaderAssetsPromise.push(
        new Promise((resolve, reject) => {
          shaderApi
            .getShader(item.id)
            .then((file) => {
              const url = URL.createObjectURL(file.shader);

              configJson = configJson.replace(
                new RegExp(`<${item.module}-${item.id}>`, "g"),
                url,
              );
              resolve({ url, pkg: file.pkg, file });
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
    config.shaderAssets = await Promise.all(shaderAssetsPromise);
    config.component = await Promise.all(componentsPromise);

    configJson = JSON.parse(configJson, JSONHandler.parse);
    configJson.assets = config.assets;
    configJson.canvasAssets = config.canvasAssets;
    configJson.shaderAssets = config.shaderAssets;
    configJson.component = config.component;

    configJson.canvas &&
      configJson.canvas.forEach((elem) => {
        elem.$pkg = config.canvasAssets.find(
          (item) => item.url === elem.$url,
        ).file.pkg;
      });

    config = configJson;

    config = Template.handler(
      config,
      (c) =>
        generateConfig(c.type, c, {
          strict: false,
        }),
      {
        filter: [
          "assets",
          "component",
          "canvasAssets",
          "canvas",
          "shaderAssets",
        ],
      },
    );

    await engine.loadConfigAsync(config);

    engine.setSceneBySymbol(config.scene[0].vid);
    config.camera[0] && engine.setCameraBySymbol(config.camera[0].vid);

    engine.play();

    loading.close();
  },

  methods: {},
};
</script>

<style lang="less" scoped>
.renderWindow-container {
  position: relative;
  .boxSetting();
  overflow: hidden;
  .render-mask {
    position: absolute;
    pointer-events: none;
    z-index: -1;
  }

  .render-window {
    .boxSetting();
    position: absolute;
  }
}
</style>
