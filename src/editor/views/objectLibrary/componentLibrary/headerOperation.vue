<template>
  <div class="headerOperation-container">
    <div class="operate-history">
      <vis-icon
        @click.native="
          () => {
            $store.commit('componentLibrary/backOffHistory');
          }
        "
        code="#iconbianjiantouzuo"
      ></vis-icon>
      <vis-icon
        @click.native="
          () => {
            $store.commit('componentLibrary/forwardHistory');
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
          v-if="canAddClassify"
        ></vis-icon>
      </el-popover>

      <vis-icon
        code="#iconshangchuan-fill"
        v-tooltip.top="
          '上传UI组件zip压缩包，包含index.js入口文件，package.json包描述文件，preview.png预览图片'
        "
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
import componentApi from "@/assets/js/api/component.js";
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
      return this.$store.getters["componentLibrary/currentFloder"];
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
        this.$store.commit("componentLibrary/currentFloder", item);
      }
    },
    upload() {
      this.$refs.uploadInput.click();
    },
    async fileHandler(event) {
      const file = event.target.files[0];

      const classifyId = this.currentFloder.id;

      const zip = new JSZip();
      const zipData = await zip.loadAsync(file);
      const files = zipData.files;

      const previewExt = ["jpg", "png", "jpeg"];

      let indexFile = null;
      let preview = null;
      let pkg = null;

      if (!files["index.js"]) {
        this.$message.warning("上传失败！找不到入口文件：index.js");
        return;
      }

      if (!files["package.json"]) {
        this.$message.warning("上传失败！找不到配置文件：package.json");
        return;
      }

      indexFile = await files["index.js"].async("string");
      indexFile = new Blob([indexFile], { type: "application/javascript" });

      pkg = JSON.parse(await files["package.json"].async("string"));

      for (const ext of previewExt) {
        if (files[`preview.${ext}`]) {
          preview =
            `data:image/${ext};base64,` +
            (await files[`preview.${ext}`].async("base64"));
        }
      }

      componentApi
        .uploadComponent({
          classifyId,
          name: file.name.split(".").shift(),
          component: indexFile,
          pkg,
          preview,
          size: Object.values(files).reduce((total, item) => {
            return total + item._data.uncompressedSize;
          }, 0),
        })
        .then((data) => {
          this.$store.commit("componentLibrary/addChildren", data);
        })
        .finally(() => {
          this.$refs.uploadInput.value = "";
        });
    },
    addClassify() {
      if (this.classifyName.trim()) {
        componentApi
          .addClassify({
            name: this.classifyName.trim(),
            parentId: this.currentFloder.id,
          })
          .then((res) => {
            this.$store.commit("componentLibrary/addChildren", res);
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
