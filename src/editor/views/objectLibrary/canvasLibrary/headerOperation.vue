<template>
  <div class="headerOperation-container">
    <div class="operate-history">
      <vis-icon
        code="#iconbianjiantouzuo"
        @click.native="
          () => {
            $store.commit('canvasLibrary/backOffHistory');
          }
        "
      />
      <vis-icon
        code="#iconbianjiantouyou"
        @click.native="
          () => {
            $store.commit('canvasLibrary/forwardHistory');
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
        <span class="address-title" v-text="item.name" />
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
          <el-button size="mini" type="text" @click="addClassify">
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
        v-tooltip.top="
          '上传canvas npm压缩包，包含js文件、package.json、preview.png预览图'
        "
        code="#iconshangchuan-fill"
        @click.native="upload"
      />

      <input
        ref="uploadInput"
        type="file"
        style="display: none"
        accept=".zip, .tgz"
        multiple="multiple"
        @change="fileHandler"
      />
    </div>
  </div>
</template>

<script>
import canvasApi from "@/assets/js/api/canvas.js";
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
      return this.$store.getters["canvasLibrary/currentFloder"];
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
        this.$store.commit("canvasLibrary/currentFloder", item);
      }
    },
    upload() {
      this.$tool.safeTips().then(() => {
        this.$refs.uploadInput.click();
      });
    },
    async fileHandler(event) {
      const file = event.target.files[0];
      const classifyId = this.currentFloder.id;

      const zip = new JSZip();
      const zipData = await zip.loadAsync(file);
      const files = zipData.files;

      if (!files["package.json"]) {
        this.$message.warning("上传失败！找不到配置文件：package.json");
        this.$refs.uploadInput.value = "";
        return;
      }

      const pkg = JSON.parse(await files["package.json"].async("string"));

      let indexPath = pkg.module || pkg.main;

      if (!indexPath) {
        this.$message.warning(
          "上传失败！无法从package.json中获取有效的入口路径。",
        );
        this.$refs.uploadInput.value = "";
        return;
      }

      if (indexPath.startsWith("/")) {
        indexPath = indexPath.slice(1);
      } else if (indexPath.startsWith("./")) {
        indexPath = indexPath.slice(2);
      }

      if (!files[indexPath]) {
        this.$message.warning(
          "上传失败！无法根据package.json的相关字段获取入口文件。",
        );
        this.$refs.uploadInput.value = "";
        return;
      }

      let scriptFile = files[indexPath];
      scriptFile = await scriptFile.async("string");
      scriptFile = new Blob([scriptFile], { type: "application/javascript" });

      const previewExt = ["jpg", "png", "jpeg"];
      let preview = undefined;

      for (const ext of previewExt) {
        if (files[`preview.${ext}`]) {
          preview =
            `data:image/${ext};base64,` +
            (await files[`preview.${ext}`].async("base64"));
        }
      }

      canvasApi
        .uploadCanvas({
          classifyId,
          name: file.name.split(".").shift(),
          canvas: scriptFile,
          pkg,
          preview,
          size: Object.values(files).reduce((total, item) => {
            return item.dir ? total : total + item._data.uncompressedSize;
          }, 0),
        })
        .then((data) => {
          this.$store.commit("canvasLibrary/addChildren", data);
        })
        .finally(() => {
          this.$refs.uploadInput.value = "";
        });
    },
    addClassify() {
      if (this.classifyName.trim()) {
        canvasApi
          .addClassify({
            name: this.classifyName.trim(),
            parentId: this.currentFloder.id,
          })
          .then((res) => {
            this.$store.commit("canvasLibrary/addChildren", res);
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
