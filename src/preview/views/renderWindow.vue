<template>
  <div class="renderWindow-container">
    <iframe
      width="100%"
      height="100%"
      scrolling="no"
      ref="renderMask"
      class="render-mask"
    ></iframe>
    <div class="render-window" ref="renderElement" tabindex="0"></div>
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

import parse from "url-parse";

export default {
  data() {
    return {
      timer: "", // 刷新定时器
      canResize: true,
      throttleTime: 1000 / 60,
    };
  },

  methods: {},
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
      { immediate: true }
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
                  url
                );
                resolve({ url, ext: file.ext });
              })
              .catch(reject);
          })
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
                  url
                );
                resolve({ url, ext: file.ext });
              })
              .catch(reject);
          })
        );
      }
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
              url
            );

            item.$url = url;
            item.$pkg = file.pkg;

            resolve(item);
          });
        })
      );
    });

    config.assets = await Promise.all(assetsPromise);
    config.component = await Promise.all(componentsPromise);

    configJson = JSON.parse(configJson, JSONHandler.parse);
    configJson.assets = config.assets;
    configJson.component = config.component;

    config = configJson;

    config = Template.handler(
      config,
      (c) =>
        generateConfig(c.type, c, {
          strict: false,
        }),
      {
        filter: ["assets", "component"],
      }
    );

    await engine.loadConfigAsync(config);

    engine.setSceneBySymbol(config.scene[0].vid);

    engine.play();

    loading.close();
  },
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
