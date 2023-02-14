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
      @click="chouseFile(item)"
      v-tooltip.bottom="`${item.name}`"
    >
      <template v-if="item.dir">
        <vis-icon :size="iconSize" code="#iconwenjianjia"></vis-icon>
      </template>
      <template v-else>
        <img :src="item.preview" />
        <div
          class="item-selected-mask"
          v-show="selected.id === item.id"
          @click.stop="$store.commit('templateLibrary/cancelSelected')"
        >
          <vis-icon
            class="item-selected"
            size="60px"
            code="#icongou"
          ></vis-icon>
        </div>
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
import {
  CONFIGTYPE,
  JSONHandler,
  MODULETYPE,
  Template,
  uniqueSymbol,
} from "@vis-three/middleware";

import { Pipeline } from "@vis-three/utils";

import { AddTemplateAction } from "@/assets/js/action/AddTemplateAction.js";
import { history, engine } from "@/assets/js/VisFrame";

export default {
  data() {
    return {
      iconSize: "35px",
      timer: "",
      cacheMap: {}, // url -> template
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
      } else {
        console.log(item);
        const url = item.app;
        if (this.cacheMap[url]) {
          const { config, detail } = Template.clone(this.cacheMap[url], {
            detail: true,
            fillName: true,
          });

          console.log(detail);

          const template = new Pipeline(config)
            .pipe((c) => {
              delete c[MODULETYPE.SCENE];
              delete c[MODULETYPE.RENDERER];
              delete c[MODULETYPE.CONTROLS];
              c[MODULETYPE.LIGHT].forEach((elem, i, arr) => {
                if (elem.type === CONFIGTYPE.AMBIENTLIGHT) {
                  arr.splice(i, 1);
                }
              });
              return c;
            })
            .pipe((c) => JSON.stringify(c, JSONHandler.stringify))
            .pipe((c) =>
              c.replace(
                new RegExp(detail[uniqueSymbol(CONFIGTYPE.SCENE)], "g"),
                this.currentScene.vid
              )
            )
            .pipe((c) => JSON.parse(c, JSONHandler.parse))
            .get();

          console.log(template);

          history.apply(
            new AddTemplateAction({
              engine,
              store: this.$store,
              template,
            }),
            true
          );
        } else {
          const loading = this.$message.loading("正在加载配置...");
          this.axios
            .get(url)
            .then((res) => {
              this.cacheMap[url] = res;
              this.chouseFile(item);
            })
            .finally(() => {
              loading.close();
            });
        }
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
          }
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
  },
};
</script>

<style lang="less" scoped>
.containerOperation-container {
  .boxSetting(100%);
  background: @darkerTheme-backgroundColor;
  margin-bottom: @box-margin;
  padding: @box-padding;
  .flexLayout(row);
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
