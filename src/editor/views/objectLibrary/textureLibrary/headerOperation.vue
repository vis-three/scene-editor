<template>
  <div class="headerOperation-container">
    <div class="operate-history">
      <vis-icon
        code="#iconbianjiantouzuo"
        @click.native="
          () => {
            $store.commit('textureLibrary/backOffHistory');
          }
        "
      />
      <vis-icon
        code="#iconbianjiantouyou"
        @click.native="
          () => {
            $store.commit('textureLibrary/forwardHistory');
          }
        "
      />
    </div>
    <div class="operate-address">
      <span
        v-for="(item, index) in addressList"
        :key="index"
        class="address-sign-box"
        @click="chouseFile(item)"
      >
        <vis-icon
          v-if="index > 0"
          code="#iconsanjiaojiantouyou"
          :style="{ transform: 'scale(0.6)' }"
        />
        <span
          class="address-title"
          v-text="item.name"
        />
      </span>
    </div>
    <div class="operate-operation">
      <!-- <vis-icon code="#iconsetting-fill" v-tooltip.top="'设置'"></vis-icon> -->
      <el-popover
        v-model="classifyVisible"
        placement="bottom"
        width="200"
        trigger="click"
      >
        <el-input
          v-model="classifyName"
          class="popover-input"
          size="mini"
          placeholder="输入分类名称"
        />
        <div class="popover-operation">
          <el-button
            size="mini"
            type="text"
            @click="addClassify"
          >
            确定
          </el-button>
        </div>
        <vis-icon
          v-show="canAddClassify"
          slot="reference"
          v-tooltip.top="'新增分类'"
          code="#iconjia1"
        />
      </el-popover>

      <vis-icon
        v-if="canUpload"
        v-tooltip.top="'上传'"
        code="#iconshangchuan-fill"
        @click.native="upload"
      />

      <input
        ref="uploadInput"
        type="file"
        style="display: none"
        :accept="ext"
        multiple="multiple"
        @change="fileHandler"
      >
    </div>
  </div>
</template>

<script>
import textureApi from "@/assets/js/api/texture.js";

export default {
  data() {
    return {
      classifyName: "", // 分类名
      classifyVisible: false,
      ext: [".jpg", ".png", ".jpeg", ".video", ".hdr", ".dds"],
    };
  },
  computed: {
    currentFloder() {
      return this.$store.getters["textureLibrary/currentFloder"];
    },
    // 可以上传的标识
    canUpload() {
      const floderChildren = this.currentFloder.children;

      if (!this.currentFloder.parent) {
        return false;
      }

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
        this.$store.commit("textureLibrary/currentFloder", item);
      }
    },
    upload() {
      this.$refs.uploadInput.click();
    },
    async fileHandler(event) {
      const files = event.target.files;
      const classifyId = this.currentFloder.id;

      const promises = [];

      for (const file of event.target.files) {
        promises.push(
          textureApi.uploadTexture({
            classifyId,
            name: file.name,
            texture: await this.$tool.fileToBlob(file),
            ext: this.$tool.getFileExt(file.name),
            size: file.size,
          })
        );
      }

      Promise.all(promises)
        .then((data) => {
          this.$store.commit("textureLibrary/addChildren", data);
        })
        .finally(() => {
          this.$refs.uploadInput.value = "";
        });
    },
    addClassify() {
      if (this.classifyName.trim()) {
        textureApi
          .addClassify({
            name: this.classifyName.trim(),
            parentId: this.currentFloder.id,
          })
          .then((res) => {
            this.$store.commit("textureLibrary/addChildren", res);
            this.classifyName = "";
            this.classifyVisible = false;
            this.$message.success("添加分类成功！");
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
      margin-right: (@box-margin / 2);
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
      padding: (@box-padding / 2);
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
