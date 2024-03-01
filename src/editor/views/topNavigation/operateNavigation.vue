<template>
  <div class="operateNavigation-container">
    <el-button
      size="mini"
      type="primary"
      @click="screenshotDialogVisible = true"
    >
      快照
    </el-button>
    <el-button size="mini" type="success" @click="save">保存</el-button>
    <el-button size="mini" type="info" @click="display">展示</el-button>
    <!-- <el-button size="mini" type="info" @click="download">导出</el-button> -->
    <el-dialog
      title="快照设置"
      :visible.sync="screenshotDialogVisible"
      width="30%"
      center
    >
      <el-form label-position="left" label-width="90px">
        <el-form-item label="文件名">
          <el-input v-model="screenshotSetting.name" size="mini" />
        </el-form-item>
        <el-form-item label="宽度（px）">
          <el-input-number
            v-model="screenshotSetting.width"
            size="mini"
            :controls="false"
          />
        </el-form-item>
        <el-form-item label="高度（px）">
          <el-input-number
            v-model="screenshotSetting.height"
            size="mini"
            :controls="false"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="screenshotDialogVisible = false">
          取 消
        </el-button>
        <el-button size="mini" type="primary" @click="getScreenshot">
          确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { engine } from "@/editor/assets/js/vis";
import appApi from "@/assets/js/api/app.js";
import JSZip from "jszip";
import { JSONHandler } from "@vis-three/middleware";

export default {
  data() {
    return {
      screenshotDialogVisible: false,
      buildDialogVisible: false,
      screenshotSetting: {
        width: 1920,
        height: 1080,
        name: "vis-screenshot",
      },

      exportSetting: {
        name: "vis-scene",
      },
    };
  },

  computed: {
    name() {
      return this.$store.getters.name;
    },
    id() {
      return this.$store.getters.id;
    },
  },

  mounted() {
    engine.keyboardManager.register({
      shortcutKey: ["ctrl", "s"],
      desp: "在线保存",
      keydown: (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.save();
      },
    });
  },

  methods: {
    async getScreenshot() {
      const data = await engine.getScreenshot({
        width: this.screenshotSetting.width,
        height: this.screenshotSetting.height,
      });
      const a = document.createElement("a");
      a.download = this.screenshotSetting.name;
      a.href = data;
      a.click();
      this.screenshotDialogVisible = false;
      this.screenshotSetting = {
        width: 1920,
        height: 1080,
        name: "vis-screenshot",
      };
    },

    async save() {
      const loading = this.$loading({
        text: "正在保存...",
        background: "rgb(0, 0, 0)",
        target: ".renderWindow-container",
      });

      const editor = await this.$store.dispatch("exportConfig");
      const preview = await engine.getScreenshot({
        width: 1920,
        height: 1080,
      });

      let app = await this.$store.dispatch(
        "urlTransform",
        engine.exportConfig(),
      );

      appApi
        .saveApp({
          id: this.id,
          name: this.name,
          app,
          editor,
          preview,
        })
        .then((res) => {
          console.log(res);
          this.$message.success("保存成功！");
        })
        .finally(() => {
          loading.close();
        });
    },

    display() {
      window.open(
        window.location.origin +
          window.location.pathname +
          `/preview.html?id=${this.id}`,
      );
    },

    async download() {
      const loading = this.$loading({
        text: "正在打包项目...",
        background: "rgb(0, 0, 0)",
        target: ".renderWindow-container",
      });

      const editor = await this.$store.dispatch("exportConfig");
      const preview = await engine.getScreenshot({
        width: 1920,
        height: 1080,
      });

      const { app, zip } = await this.$store.dispatch(
        "exportTransform",
        engine.exportConfig(),
      );

      zip.file("editor.json", JSON.stringify(editor, JSONHandler.stringify));
      zip.file("app.json", JSON.stringify(app, JSONHandler.stringify));
      zip.file("preview.png", this.$tool.dataURLToBlob(preview));

      const blob = await zip.generateAsync({ type: "blob" });

      const a = document.createElement("a");

      a.download = `${this.$store.getters.name}.zip`;

      a.href = URL.createObjectURL(blob);

      a.click();

      loading.close();
    },
  },
};
</script>

<style lang="less" scoped>
.operateNavigation-container {
  .flexLayout(row, flex-end, center);
  padding-right: @box-padding;
}

/deep/ .el-dropdown {
  .el-button-group {
    width: 82px;
    margin: 0 @box-margin;
  }
}
</style>
