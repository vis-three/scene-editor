vabse
<template>
  <div class="containerOperation-container">
    <div v-show="loading" class="loading-mask">
      <vis-icon class="ani" code="#iconxuanzhuan"></vis-icon>
      <span>正在加载...</span>
    </div>

    <div v-if="!loading && !floderChildren.length" class="empty-tips">
      <span>这里暂时是空的哦</span>
    </div>

    <div
      v-else
      v-for="(item, index) in floderChildren"
      :key="index"
      class="file-item-box"
      :class="{ active: false }"
      @click="chouseFile(item)"
      v-tooltip.bottom="`${item.name}`"
    >
      <template v-if="item.dir">
        <vis-icon :size="iconSize" code="#iconwenjianjia"></vis-icon>
      </template>
      <template v-else>
        <img :src="item.preview" />
      </template>

      <span class="item-title" v-text="item.name"></span>
      <vis-icon
        class="item-delete"
        size="16px"
        code="#iconshanchu"
        v-tooltip.bottom="`删除`"
        @click.native.stop="remove(item)"
      ></vis-icon>
    </div>

    <div
      class="file-item-placeholder"
      :style="{
        display: floderChildren.length % 2 !== 0 ? 'block' : 'none',
        flex: 1,
      }"
    ></div>
  </div>
</template>

<script>
import { engine } from "@/assets/js/VisFrame";
import { generateConfig, Template } from "@vis-three/middleware";
import Vue from "vue";

export default {
  data() {
    return {
      iconSize: "35px",
      timer: "",
      fileIcon: {
        mtl: "#iconmtl",
      },
      configTemplateCache: {}, // 配置缓存
      configRootCache: {}, // 根物体缓存
    };
  },
  computed: {
    loading() {
      return this.$store.getters["modelLibrary/loading"];
    },
    currentFloder() {
      return this.$store.getters["modelLibrary/currentFloder"];
    },
    floderChildren() {
      return this.currentFloder.children;
    },
    currentScene() {
      return this.$store.getters["scene/currentScene"];
    },
  },
  methods: {
    chouseFile(item) {
      if (item.dir) {
        this.$store.commit("modelLibrary/currentFloder", item);
      } else {
        this.modelSelected(item);
      }
    },
    modelSelected(file) {
      console.log(file);
      const url = file.model;

      if (!this.configTemplateCache[url]) {
        engine.loadResourcesAsync([url]).then((res) => {
          this.configTemplateCache[url] = res.resourceConfig[url];

          const rootPathList = [url, url + ".scene"];
          for (const rootPath of rootPathList) {
            if (res.configMap.has(rootPath)) {
              const root = res.configMap.get(rootPath);
              root.name = file.name;
              this.configRootCache[url] = root.vid;
              break;
            }
          }

          if (!this.configTemplateCache[url]) {
            this.$message.error("加载模型失败！");
            return;
          }

          if (!this.configRootCache[url]) {
            this.$message.error("获取模型根元素失败！");
            return;
          }

          this.modelSelected(file);
        });
      } else {
        const configTemplate = this.configTemplateCache[url];

        const { config, detail } = Template.clone(configTemplate, {
          detail: true,
          fillName: true,
        });

        const reactive = Template.handler(config, (config) =>
          generateConfig(config.type, config)
        );

        engine.loadConfigAsync(Vue.observable(reactive)).then((res) => {
          if (this.configRootCache[url]) {
            this.$store.commit("notifyAll");
            this.$nextTick(() => {
              this.currentScene.children.push(
                detail[this.configRootCache[url]]
              );
            });
          }
        });
      }
    },
    // 删除文件
    remove(item) {
      if (item.dir) {
        this.$confirm(`是否删除此分类: ${item.name}?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.axios
            .post("/model/removeClassify", {
              id: item.id,
            })
            .then((res) => {
              if (res.status === 200) {
                this.$message({
                  type: "success",
                  message: "删除成功!",
                });
                this.$store.commit("modelLibrary/removeChildren", item);
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
          }
        ).then(() => {
          this.axios
            .post("/model/removeModel", {
              id: item.id,
            })
            .then((res) => {
              if (res.status === 200) {
                this.$message({
                  type: "success",
                  message: "删除成功!",
                });
                this.$store.commit("modelLibrary/removeChildren", item);
              } else {
                this.$message.error(res.message);
              }
            });
        });
      }
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
    .boxSetting(170px, 110px);
    margin: 0 0 @box-margin 0;
    cursor: pointer;
    .transitionSetting({background: @themeDarkHover-color;});
    &:hover .item-delete {
      opacity: 1;
    }
    position: relative;
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

    .item-delete {
      .absolutePosition(0, 0, unset, unset);
      height: unset !important;
      color: @error-color;
      opacity: 0;
    }
  }
  .active {
    position: relative;
    &::after {
      .absolutePosition(0, 0, unset, unset);
      content: "\2611";
      font-size: @title-fontSize;
      color: @theme-color;
      .boxSetting(@title-fontSize, @title-fontSize);
      text-align: center;
      line-height: @title-fontSize;
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
