vabse
<template>
  <div class="containerOperation-container">
    <div v-show="loading" class="loading-mask">
      <vis-icon class="ani" code="#iconxuanzhuan" />
      <span>正在加载...</span>
    </div>

    <div v-if="!loading && !floderChildren.length" class="empty-tips">
      <span>这里暂时是空的哦</span>
      <el-button
        v-if="currentFloder.url === '/'"
        class="operate-classify"
        type="primary"
        size="mini"
        icon="el-icon-circle-plus"
        @click="addOneClassify"
      >
        新增一个分类
      </el-button>
    </div>

    <div
      v-for="(item, index) in floderChildren"
      v-else
      :key="index"
      v-tooltip.bottom="`${item.name}`"
      class="file-item-box"
      @click="chouseFile(item)"
    >
      <template v-if="item.dir">
        <vis-icon :size="iconSize" code="#iconwenjianjia" />
      </template>
      <template v-else>
        <img :src="item.preview" />
        <div
          v-show="selected.id === item.id"
          class="item-selected-mask"
          @click.stop="$store.commit('appLibrary/cancelSelected')"
        >
          <vis-icon class="item-selected" size="60px" code="#icongou" />
        </div>
      </template>

      <span class="item-title" v-text="item.name" />
      <vis-icon
        v-tooltip.bottom="`删除`"
        class="item-delete"
        size="16px"
        code="#iconshanchu"
        @click.native.stop="remove(item)"
      />
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
import appApi from "@/assets/js/api/app.js";

export default {
  data() {
    return {
      iconSize: "35px",
      timer: "",
      fileIcon: {
        mtl: "#iconmtl",
      },
    };
  },
  computed: {
    loading() {
      return this.$store.getters["appLibrary/loading"];
    },
    currentFloder() {
      return this.$store.getters["appLibrary/currentFloder"];
    },
    floderChildren() {
      return this.currentFloder.children;
    },
    currentScene() {
      return this.$store.getters["scene/currentScene"];
    },
    selected() {
      return this.$store.getters["appLibrary/selected"];
    },
  },
  methods: {
    chouseFile(item) {
      if (item.dir) {
        this.$store.commit("appLibrary/currentFloder", item);
      } else {
        this.$store.commit("appLibrary/select", item);
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
            .post("/model/removeClassify", {
              id: item.id,
            })
            .then((res) => {
              if (res.status === 200) {
                this.$message({
                  type: "success",
                  message: "删除成功!",
                });
                this.$store.commit("appLibrary/removeChildren", item);
              } else {
                this.$message.error(res.message);
              }
            });
        });
      } else {
        this.$confirm(
          `是否删除此应用: ${item.name}, 删除此应用相关的编辑项目会受到影响，是否继续?`,
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          },
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
                this.$store.commit("appLibrary/removeChildren", item);
              } else {
                this.$message.error(res.message);
              }
            });
        });
      }
    },
    addOneClassify() {
      this.$prompt("输入分类名称", "新增分类")
        .then(({ value }) => {
          if (value.trim()) {
            appApi
              .addClassify({
                name: value.trim(),
                parentId: this.currentFloder.id,
              })
              .then((res) => {
                this.$store.commit("appLibrary/addChildren", res);
                this.$message.success("添加分类成功！");
              });
          } else {
            this.$message.warning("无效的分类名称。");
          }
        })
        .catch(() => {});
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

    > .operate-classify {
      margin-top: @box-margin * 4;
    }
  }
}
</style>
