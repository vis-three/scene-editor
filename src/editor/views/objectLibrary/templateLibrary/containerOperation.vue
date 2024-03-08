vabse
<template>
  <div class="containerOperation-container">
    <div v-show="loading" class="loading-mask">
      <vis-icon class="ani" code="#iconxuanzhuan" />
      <span>正在加载...</span>
    </div>

    <div v-if="!loading && !floderChildren.length" class="empty-tips">
      <span>这里暂时是空的哦</span>
    </div>

    <div
      v-for="(item, index) in floderChildren"
      v-else
      :key="index"
      v-tooltip.bottom="`${item.name}`"
      class="file-item-box"
    >
      <template v-if="item.dir">
        <vis-icon :size="iconSize" code="#iconwenjianjia" />
      </template>
      <template v-else>
        <img :src="item.preview" />
        <div
          v-show="selected.id === item.id"
          class="item-selected-mask"
          @click.stop="$store.commit('templateLibrary/cancelSelected')"
        >
          <vis-icon class="item-selected" size="60px" code="#icongou" />
        </div>
      </template>

      <span class="item-title" v-text="item.name" />

      <span v-if="item.dir" class="item-operate-box">
        <vis-icon v-tooltip.bottom="`移动`" size="20px" code="#iconpingyi" />
        <vis-icon
          v-tooltip.bottom="`打开`"
          size="20px"
          code="#iconyidong"
          @click.native.stop="chouseFile(item)"
        />
        <vis-icon
          v-tooltip.bottom="`删除`"
          class="item-delete"
          size="16px"
          code="#iconshanchu"
          @click.native.stop="remove(item)"
        />
      </span>

      <span v-else class="item-operate-box">
        <vis-icon
          v-tooltip.bottom="`更新`"
          size="16px"
          code="#iconxuanzhuan"
          @click.native.stop="updateTempalte(item)"
        />
        <vis-icon
          v-tooltip.bottom="`应用`"
          size="20px"
          code="#iconyingyong"
          @click.native.stop="useTemplate(item)"
        />
        <vis-icon
          v-tooltip.bottom="`删除`"
          class="item-delete"
          size="16px"
          code="#iconshanchu"
          @click.native.stop="remove(item)"
        />
      </span>
    </div>

    <div
      class="file-item-placeholder"
      :style="{
        display: floderChildren.length % 2 !== 0 ? 'block' : 'none',
        flex: 1,
      }"
    />
  </div>
</template>

<script>
import {
  CONFIGTYPE,
  createSymbol,
  generateConfig,
  isObjectModule,
  JSONHandler,
  MODULETYPE,
  Template,
  uniqueSymbol,
} from "@vis-three/middleware";

import { Pipeline } from "@vis-three/utils";

import { engine } from "@/editor/assets/js/vis";

import templateApi from "@/assets/js/api/template.js";

export default {
  data() {
    return {
      iconSize: "35px",
      timer: "",
    };
  },
  computed: {
    loading() {
      return this.$store.getters["templateLibrary/loading"];
    },
    currentFloder() {
      return this.$store.getters["templateLibrary/currentFloder"];
    },
    floderChildren() {
      return this.currentFloder.children;
    },
    currentScene() {
      return this.$store.getters["scene/currentScene"];
    },
    selected() {
      return this.$store.getters["templateLibrary/selected"];
    },
  },
  methods: {
    chouseFile(item) {
      if (item.dir) {
        this.$store.commit("templateLibrary/currentFloder", item);
      }
    },
    // 删除文件
    remove(item) {
      return this.$tool.devTips();
      if (item.dir) {
        this.$confirm(`是否删除此分类: ${item.name}?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.axios
            .post("/template/removeClassify", {
              id: item.id,
            })
            .then((res) => {
              if (res.status === 200) {
                this.$message({
                  type: "success",
                  message: "删除成功!",
                });
                this.$store.commit("templateLibrary/removeChildren", item);
              } else {
                this.$message.error(res.message);
              }
            });
        });
      } else {
        this.$confirm(
          `是否删除此模型: ${item.name}, 删除此模型相关的编辑项目会受到影响，是否继续?`,
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          },
        ).then(() => {
          // this.axios
          //   .post("/model/removeModel", {
          //     id: item.id,
          //   })
          //   .then((res) => {
          //     if (res.status === 200) {
          //       this.$message({
          //         type: "success",
          //         message: "删除成功!",
          //       });
          //       this.$store.commit("templateLibrary/removeChildren", item);
          //     } else {
          //       this.$message.error(res.message);
          //     }
          //   });
        });
      }
    },

    async useTemplate(item) {
      const message = this.$message.loading("正在应用模板...");

      let template = JSONHandler.clone(item.template);

      delete template.renderer;
      delete template.controls;
      delete template.scene;

      template = await this.$store.dispatch("assetsTransform", template);

      const sceneChildren = [];
      let replaceSymbolMap = {};

      template = new Pipeline(template)
        .pipe((c) => {
          let { config, detail } = Template.clone(c, {
            detail: true,
            filter: [
              "canvas",
              "component",
              "assets",
              "shaderAssets",
              "canvasAssets",
            ],
          });

          replaceSymbolMap = detail;

          if (config.canvas) {
            let jsonConfig = JSON.stringify(config, JSONHandler.stringify);

            config.canvas.forEach((canvas) => {
              const newCid = createSymbol();

              jsonConfig = jsonConfig.replace(
                new RegExp(canvas.$cid, "g"),
                newCid,
              );

              detail[canvas.$cid] = newCid;
            });

            config = JSON.parse(jsonConfig, JSONHandler.parse);
          }
          return config;
        })
        .pipe((c) => {
          let cJson = JSON.stringify(c, JSONHandler.c);
          c.component.forEach((item) => {
            const newCid = createSymbol();
            const oldCide = item.$cid;
            replaceSymbolMap[item.$cid] = newCid;
            item.$cid = newCid;
            cJson = cJson.replace(new RegExp(oldCide, "g"), newCid);
          });

          return JSON.parse(cJson, JSONHandler.parse);
        })
        .pipe((c) => {
          Object.keys(c).forEach((module) => {
            if (isObjectModule(module)) {
              Object.values(c[module]).forEach((config) => {
                if (config.parent === uniqueSymbol(CONFIGTYPE.SCENE)) {
                  sceneChildren.push(config.vid);
                }
              });
            }
          });
          return c;
        })
        .pipe((c) =>
          Template.handler(
            c,
            (c) =>
              generateConfig(c.type, c, {
                strict: false,
              }),
            {
              filter: [
                "canvas",
                "component",
                "assets",
                "shaderAssets",
                "canvasAssets",
              ],
            },
          ),
        )
        .get();

      let editor = item.editor;

      editor = new Pipeline(editor)
        .pipe((c) => {
          c = JSON.stringify(c);

          Object.keys(replaceSymbolMap).forEach((key) => {
            c = c.replace(new RegExp(key, "g"), replaceSymbolMap[key]);
          });

          return JSON.parse(c);
        })
        .get();

      engine
        .loadConfigAsync(template)
        .then((res) => {
          res.component.forEach((component) => {
            this.$store.commit("component/add", {
              config: component.config,
              configuration: component.packageJSON.configuration,
            });
          });

          res.shaders.forEach((shader) => {
            this.$store.commit("shader/add", {
              vid: shader.config.vid,
              configuration: shader.packageJSON.configuration,
            });
          });

          res.canvas.forEach((canvas) => {
            this.$store.commit("canvas/add", {
              config: canvas.config,
              configuration: canvas.packageJSON.configuration,
            });
          });

          this.currentScene.children.push(...sceneChildren);
          this.$store.commit("notifyAll");
          this.$store.dispatch("appendTemplateInit", editor);
        })
        .finally(() => {
          message.close();
        });
    },

    async updateTempalte(item) {
      console.log(item);
      const loading = this.$message.loading("正在更新模板...");
      let config = await this.$store.dispatch(
        "urlTransform",
        engine.exportConfig(),
      );
      const editor = await this.$store.dispatch("exportConfig");

      config[MODULETYPE.CONTROLS] && delete config[MODULETYPE.CONTROLS];
      config[MODULETYPE.RENDERER] && delete config[MODULETYPE.RENDERER];
      config[MODULETYPE.SCENE] && delete config[MODULETYPE.SCENE];
      config[MODULETYPE.PASS] && delete config[MODULETYPE.PASS];

      if (config[MODULETYPE.LIGHT]) {
        config[MODULETYPE.LIGHT].forEach((cfg, i, arr) => {
          if (
            [
              CONFIGTYPE.AMBIENTLIGHT,
              CONFIGTYPE.DIRECTIONALLIGHT,
              CONFIGTYPE.HEMISPHERELIGHT,
            ].includes(cfg.type)
          ) {
            arr.splice(i, 1);
          }
        });
      }

      templateApi
        .modifyTemplate({
          id: item.id,
          name: item.name,
          template: config,
          editor: editor,
          preview: await engine.getScreenshot({
            width: 960,
            height: 540,
          }),
        })
        .then((res) => {
          if (res.status === 200) {
            this.$message.success("保存成功！");
            this.templateName = "";
            this.templateVisible = false;
          }
        })
        .finally(() => {
          loading.close();
        });
    },
  },
};
</script>

<style lang="less" scoped>
.containerOperation-container {
  .boxSetting(100%);
  background: @darkerTheme-backgroundColor;
  margin-bottom: @box-margin;
  padding: @box-padding;
  .flexLayout(row, space-around, center);
  flex-wrap: wrap;
  overflow: auto;
  max-height: 65vh;
  min-height: 100px;

  > .file-item-box {
    .flexLayout(column, space-between, center);
    .boxSetting(140px, 110px);
    margin: 0 0 @box-margin 0;
    cursor: pointer;
    &:hover .item-operate-box {
      opacity: 1;
    }
    position: relative;

    > img {
      width: 100%;
      object-fit: cover;
    }

    > *:not(.item-title) {
      height: calc(100% - 12px - 10px) !important;
      .flexLayout(row, center, center);
    }
    .item-title {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: center;
      font-size: 12px;
    }

    .item-operate-box {
      .absolutePosition(0, 0, unset, unset);
      .boxSetting();
      .flexLayout(row, space-around, center);
      opacity: 0;

      > div {
        .boxSetting();
        .flexLayout(row, center, center);
        .transitionSetting({
          background-color: @themeDarkHover-color;
        });
      }

      .item-delete {
        color: @error-color;
      }
    }
    .item-selected-mask {
      .boxSetting();
      .absolutePosition(0, 0);
      .flexLayout(row, center, center);
      background-color: rgba(0, 0, 0, 0.3);
      .icon-container {
        color: @success-color;
      }
    }
  }
  > .loading-mask {
    .boxSetting();
    .flexLayout(column, center, center);
    .absolutePosition();
    color: @placeHolderText-color;
    .ani {
      animation: rotate 800ms ease infinite;
    }
  }
  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  > .empty-tips {
    .boxSetting(100%, 150px);
    .flexLayout(column, center, center);
  }
}
</style>
