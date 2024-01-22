<template>
  <div class="headerOperation-container">
    <div class="operate-history">
      <vis-icon
        @click.native="
          () => {
            $store.commit('modelLibrary/backOffHistory');
          }
        "
        code="#iconbianjiantouzuo"
      ></vis-icon>
      <vis-icon
        @click.native="
          () => {
            $store.commit('modelLibrary/forwardHistory');
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
        accept=".zip, .tgz"
        ref="uploadInput"
        @change="fileHandler"
      />
    </div>
  </div>
</template>

<script>
import modelApi from "@/assets/js/api/model.js";
import JSZip from "jszip";

export default {
  data() {
    return {
      classifyName: "", // 分类名
      classifyVisible: false,
    };
  },
  computed: {
    currentFloder() {
      return this.$store.getters["modelLibrary/currentFloder"];
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
        this.$store.commit("modelLibrary/currentFloder", item);
      }
    },
    upload() {
      this.$refs.uploadInput.click();
    },
    async fileHandler(event) {
      const modelExt = ["fbx", "glb", "obj"];
      const previewExt = ["jpg", "png", "jpeg"];

      const file = event.target.files[0];
      const classifyId = this.currentFloder.id;

      const zip = new JSZip();
      const zipData = await zip.loadAsync(file);

      console.log(zipData);

      const files = zipData.files;

      let modelFile = false;
      let previewFile = null;

      for (const name of Object.keys(files)) {
        if (modelExt.includes(this.$tool.getFileExt(name))) {
          modelFile = name;
        }
        if (previewExt.includes(this.$tool.getFileExt(name))) {
          previewFile = name;
        }
      }

      if (!modelFile) {
        this.$message.warning(
          `不支持的模型文件格式。支持的模型文件格式：${modelExt.join(", ")}`
        );
      }

      const model = await files[modelFile].async("blob");
      let preview = null;

      if (previewFile) {
        preview =
          `data:image/${this.$tool.getFileExt(previewFile)};base64,` +
          (await files[previewFile].async("base64"));
      }

      modelApi
        .uploadModel({
          classifyId,
          name: modelFile,
          model,
          ext: this.$tool.getFileExt(modelFile),
          size: Object.values(files).reduce((total, item) => {
            return total + item._data.uncompressedSize;
          }, 0),
          preview,
        })
        .then((data) => {
          this.$store.commit("modelLibrary/addChildren", data);
        })
        .finally(() => {
          this.$refs.uploadInput.value = "";
        });
    },
    addClassify() {
      if (this.classifyName.trim()) {
        modelApi
          .addClassify({
            name: this.classifyName.trim(),
            parentId: this.currentFloder.id,
          })
          .then((res) => {
            console.log(res);
            this.$store.commit("modelLibrary/addChildren", res);
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
  .flexLayout(row, flex-start, center);
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
    .boxSetting(80%);
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
