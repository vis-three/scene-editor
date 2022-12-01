<template>
  <div class="headerOperation-container">
    <div class="operate-history">
      <vis-icon
        @click.native="
          () => {
            $store.commit('appLibrary/backOffHistory');
          }
        "
        code="#iconbianjiantouzuo"
      ></vis-icon>
      <vis-icon
        @click.native="
          () => {
            $store.commit('appLibrary/forwardHistory');
          }
        "
        code="#iconbianjiantouyou"
      ></vis-icon>
    </div>
    <div class="operate-address">
      <span
        class="address-sign-box"
        v-for="(item, index) in addressList"
        :key="index"
        @click="chouseFile(item)"
      >
        <vis-icon
          v-if="index > 0"
          code="#iconsanjiaojiantouyou"
          :style="{ transform: 'scale(0.6)' }"
        ></vis-icon>
        <span class="address-title" v-text="item.name"></span>
      </span>
    </div>
    <div class="operate-operation">
      <!-- <vis-icon code="#iconsetting-fill" v-tooltip.top="'设置'"></vis-icon> -->
      <el-popover
        placement="bottom"
        width="200"
        trigger="click"
        v-model="classifyVisible"
      >
        <el-input
          class="popover-input"
          size="mini"
          v-model="classifyName"
          placeholder="输入分类名称"
        ></el-input>
        <div class="popover-operation">
          <el-button size="mini" type="text" @click="addClassify">
            确定
          </el-button>
        </div>
        <vis-icon
          slot="reference"
          code="#iconjia1"
          v-tooltip.top="'新增分类'"
          v-show="canAddClassify"
        ></vis-icon>
      </el-popover>

      <vis-icon
        code="#iconshangchuan-fill"
        v-tooltip.top="'上传'"
        v-if="canUpload"
        @click.native="upload"
      ></vis-icon>

      <input
        type="file"
        style="display: none"
        accept=".png, .jpg .mp4"
        ref="uploadInput"
        @change="fileHandler"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      classifyName: "", // 分类名
      classifyVisible: false,
    };
  },
  computed: {
    currentFloder() {
      return this.$store.getters["appLibrary/currentFloder"];
    },
    // 可以上传的标识
    canUpload() {
      const floderChildren = this.currentFloder.children;
      if (floderChildren.length && !floderChildren[0].dir) {
        return true;
      } else if (!floderChildren.length && this.currentFloder.url !== "/") {
        return true;
      } else {
        return false;
      }
    },
    canAddClassify() {
      const floderChildren = this.currentFloder.children;
      if (floderChildren.length && floderChildren[0].dir) {
        return true;
      } else if (!floderChildren.length) {
        return true;
      } else {
        return false;
      }
    },
    addressList() {
      const result = [this.currentFloder];
      const traverse = (list) => {
        if (list.parent) {
          result.unshift(list.parent);
          traverse(list.parent);
        }
      };
      traverse(this.currentFloder);
      return result;
    },
  },
  methods: {
    chouseFile(item) {
      if (item.dir) {
        this.$store.commit("appLibrary/currentFloder", item);
      }
    },
    upload() {
      this.$refs.uploadInput.click();
    },
    fileHandler(event) {
      const file = event.target.files[0];
      const formData = new FormData();

      formData.append("file", file);
      formData.append("classifyId", this.currentFloder.id);

      this.axios
        .upload("/app/upload", formData)
        .then((res) => {
          this.$store.commit("appLibrary/addChildren", res.data);
        })
        .finally(() => {
          this.$refs.uploadInput.value = "";
        });
    },
    addClassify() {
      if (this.classifyName.trim()) {
        this.axios
          .post("/app/addClassify", {
            name: this.classifyName.trim(),
            parentId: this.currentFloder.id,
          })
          .then((res) => {
            if (res.status === 200) {
              this.$store.commit("appLibrary/addChildren", res.data);
              this.classifyName = "";
              this.classifyVisible = false;
              this.$message.success("添加分类成功！");
            } else {
              this.$message.error(res.message);
            }
          });
      } else {
        this.classifyName = "";
        this.classifyVisible = false;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.headerOperation-container {
  .boxSetting(100%, 30px);
  background: @theme-backgroundColor;
  cursor: move;
  .flexLayout(row, space-between, center);
  position: relative;
  margin-bottom: @box-margin;
  > .operate-history {
    .flexLayout(row, center, center);
    > * {
      cursor: pointer;
      .boxSetting(30px, 30px);
      .flexLayout(row, center, center);
      background: @brighterTheme-backgroundColor;
      .transitionSetting({background: @themeHover-color;});
    }
    > div:first-child {
      margin-right: 1px;
    }
    margin-right: @box-margin;
  }
  > .operate-address {
    flex: 1;
    height: 100%;
    background: @darkerTheme-backgroundColor;
    .flexLayout(row, flex-start, center);
    padding: 0 @box-padding;
    cursor: default;
    > .address-sign-box {
      cursor: pointer;
      margin-right: @box-margin / 2;
      .transitionSetting({color: @themeDarkHover-color;});
      .icon-container {
        margin-right: 2px;
      }
    }
  }
  > .operate-window {
    .absolutePosition(0, 0, unset, unset);
    cursor: pointer;
    .transitionSetting({color: @themeHover-color; transform: rotate(90deg) ;});
    .icon-container {
      padding: @box-padding / 2;
    }
  }

  > .operate-operation {
    .flexLayout(row, center, center);

    .icon-container {
      font-size: 16px;
      font-weight: bold;
      margin-right: @box-margin;
      cursor: pointer;
      .transitionSetting({color: @theme-color;});
    }
  }
}

.popover-input {
  margin: @box-margin 0;
}
.popover-operation {
  text-align: center;
}
</style>
