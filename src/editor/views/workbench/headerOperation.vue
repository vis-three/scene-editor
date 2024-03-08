<template>
  <div class="headerOperation-container">
    <div class="operate-history">
      <vis-icon
        code="#iconbianjiantouzuo"
        @click.native="
          () => {
            $store.commit('appLibrary/backOffHistory');
          }
        "
      />
      <vis-icon
        code="#iconbianjiantouyou"
        @click.native="
          () => {
            $store.commit('appLibrary/forwardHistory');
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

        <el-tooltip
          slot="reference"
          effect="dark"
          content="新增分类"
          placement="top"
        >
          <vis-icon v-show="canAddClassify" code="#iconjia1" />
        </el-tooltip>
      </el-popover>

      <vis-icon
        v-if="canUpload"
        v-tooltip.top="'上传项目zip文件'"
        code="#iconshangchuan-fill"
        @click.native="upload"
      ></vis-icon>

      <input
        ref="uploadInput"
        type="file"
        style="display: none"
        accept=".zip"
        @change="fileHandler"
      />
    </div>
  </div>
</template>

<script>
import modelApi from "@/assets/js/api/model.js";
import textureApi from "@/assets/js/api/texture.js";
import componentApi from "@/assets/js/api/component.js";
import canvasApi from "@/assets/js/api/canvas.js";
import shaderApi from "@/assets/js/api/shader.js";
import appApi from "@/assets/js/api/app.js";
import JSZip from "jszip";
import { JSONHandler } from "@vis-three/middleware";

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
      if (!floderChildren.length && this.currentFloder.url !== "/") {
        return true;
      } else if (floderChildren.length && !floderChildren[0].dir) {
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
      this.$tool.safeTips().then(() => {
        this.$refs.uploadInput.click();
      });
    },
    async fileHandler(event) {
      const loading = this.$loading({
        text: "正在上传应用项目...",
        background: "rgb(0, 0, 0)",
      });

      const file = event.target.files[0];
      const classifyId = this.currentFloder.id;

      const zip = new JSZip();
      const zipData = await zip.loadAsync(file);
      const files = zipData.files;

      console.log(files);

      const appFile = files["app.json"];
      const editorFile = files["editor.json"];
      const referenceFile = files["reference.json"];

      if (!appFile || !editorFile || !referenceFile) {
        this.$message.error("上传项目缺少核心文件。");
        this.$refs.uploadInput.value = "";
        return;
      }

      const previewPng = files["preview.png"];

      let appJson = await appFile.async("string");
      let editorJson = await editorFile.async("string");

      const reference = JSON.parse(await referenceFile.async("string"));

      const resources = this.$tool.filesListToTree(files);

      console.log(resources);

      const newAssets = [];

      // texture
      const textureClassify = await textureApi.addClassify({
        name: reference.name,
      });

      for (const dir of Object.values(resources.texture)) {
        for (const name in dir) {
          const file = dir[name];
          const textureFile = await textureApi.uploadTexture({
            classifyId: textureClassify.id,
            name: name,
            texture: await file.async("blob"),
            ext: this.$tool.getFileExt(name),
            size: file._data.uncompressedSize,
          });

          const result = {
            id: textureFile.id,
            module: "texture",
          };

          const oldUrl = `/${file.name}`;

          newAssets.push(result);

          appJson = appJson.replace(
            new RegExp(oldUrl, "g"),
            `<${result.module}-${result.id}>`,
          );
        }
      }

      // model
      const modelClassify = await modelApi.addClassify({
        name: reference.name,
      });

      for (const dir of Object.values(resources.model)) {
        const files = dir;

        const modelExt = ["fbx", "glb", "obj"];
        const previewExt = ["jpg", "png", "jpeg"];

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

        const model = await files[modelFile].async("blob");
        let preview = null;

        if (previewFile) {
          preview =
            `data:image/${this.$tool.getFileExt(previewFile)};base64,` +
            (await files[previewFile].async("base64"));
        }

        const modelMssage = await modelApi.uploadModel({
          classifyId: modelClassify.id,
          name: modelFile,
          model,
          ext: this.$tool.getFileExt(modelFile),
          size: Object.values(files).reduce((total, item) => {
            return item.dir ? total : total + item._data.uncompressedSize;
          }, 0),
          preview,
        });

        const result = {
          id: modelMssage.id,
          module: "model",
        };

        const oldUrl = `/${files[modelFile].name}`;

        newAssets.push(result);

        appJson = appJson.replace(
          new RegExp(oldUrl, "g"),
          `<${result.module}-${result.id}>`,
        );
      }

      // component

      const componentClassify = await componentApi.addClassify({
        name: reference.name,
      });

      for (const oldId in resources.component) {
        const dir = resources.component[oldId];

        const npmFiles = await this.$tool.parseNpmFiles(
          this.$tool.reduceFileListFolder(this.$tool.fileTreeToList(dir)),
        );

        const componentMessage = await componentApi.uploadComponent({
          classifyId: componentClassify.id,
          name: npmFiles.pkg.description || npmFiles.pkg.name,
          component: npmFiles.scriptFile,
          pkg: npmFiles.pkg,
          preview: npmFiles.preview,
          size: npmFiles.preview,
        });

        const result = {
          id: componentMessage.id,
          module: "component",
        };

        const oldUrl = `/component/${oldId}`;

        appJson = appJson.replace(
          new RegExp(oldUrl, "g"),
          `<${result.module}-${result.id}>`,
        );
      }

      // canvas

      const newCanvasAssets = [];

      const canvasClassify = await canvasApi.addClassify({
        name: reference.name,
      });

      for (const oldId in resources.canvas) {
        const dir = resources.canvas[oldId];

        const npmFiles = await this.$tool.parseNpmFiles(
          this.$tool.reduceFileListFolder(this.$tool.fileTreeToList(dir)),
        );

        const canvasMessage = await canvasApi.uploadCanvas({
          classifyId: canvasClassify.id,
          name: npmFiles.pkg.description || npmFiles.pkg.name,
          canvas: npmFiles.scriptFile,
          pkg: npmFiles.pkg,
          preview: npmFiles.preview,
          size: npmFiles.preview,
        });

        const result = {
          id: canvasMessage.id,
          module: "canvas",
        };

        const oldUrl = `/canvas/${oldId}`;

        appJson = appJson.replace(
          new RegExp(oldUrl, "g"),
          `<${result.module}-${result.id}>`,
        );

        newCanvasAssets.push(result);
      }

      // shader

      const newShaderAssets = [];

      const shaderClassify = await shaderApi.addClassify({
        name: reference.name,
      });

      for (const oldId in resources.shader) {
        const dir = resources.shader[oldId];

        const npmFiles = await this.$tool.parseNpmFiles(
          this.$tool.reduceFileListFolder(this.$tool.fileTreeToList(dir)),
        );

        const shaderMessage = await shaderApi.uploadShader({
          classifyId: shaderClassify.id,
          name: npmFiles.pkg.description || npmFiles.pkg.name,
          shader: npmFiles.scriptFile,
          pkg: npmFiles.pkg,
          preview: npmFiles.preview,
          size: npmFiles.preview,
        });

        const result = {
          id: shaderMessage.id,
          module: "shader",
        };

        const oldUrl = `/shader/${oldId}`;

        appJson = appJson.replace(
          new RegExp(oldUrl, "g"),
          `<${result.module}-${result.id}>`,
        );

        newShaderAssets.push(result);
      }

      appJson = JSON.parse(appJson, JSONHandler.parse);
      appJson.assets = newAssets;
      appJson.canvasAssets = newCanvasAssets;
      appJson.shaderAssets = newShaderAssets;

      const editor = JSON.parse(editorJson);

      editor.reference = reference;

      const newApp = await appApi.creatApp({
        classifyId: classifyId,
        name: reference.name,
        app: appJson,
        editor: editor,
        preview: previewPng ? await this.$tool.zipFileToBlob(previewPng) : "",
      });

      this.$store.commit("appLibrary/addChildren", newApp);

      this.$message.success("上传成功！");
      loading.close();
    },
    addClassify() {
      if (this.classifyName.trim()) {
        appApi
          .addClassify({
            name: this.classifyName.trim(),
            parentId: this.currentFloder.id,
          })
          .then((res) => {
            this.$store.commit("appLibrary/addChildren", res);
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
