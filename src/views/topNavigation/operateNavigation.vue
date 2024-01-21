<template>
  <div class="operateNavigation-container">
    <el-button
      size="mini"
      type="primary"
      @click="screenshotDialogVisible = true"
    >
      快照
    </el-button>
    <!-- <el-button size="mini" type="success" @click="save">保存</el-button>
    <el-button size="mini" type="info" @click="display">展示</el-button>
    <el-button size="mini" type="info" @click="download">导出</el-button> -->
    <el-dialog
      title="快照设置"
      :visible.sync="screenshotDialogVisible"
      width="30%"
      center
    >
      <el-form label-position="left" label-width="90px">
        <el-form-item label="文件名">
          <el-input size="mini" v-model="screenshotSetting.name"></el-input>
        </el-form-item>
        <el-form-item label="宽度（px）">
          <el-input-number
            size="mini"
            v-model="screenshotSetting.width"
            :controls="false"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="高度（px）">
          <el-input-number
            size="mini"
            v-model="screenshotSetting.height"
            :controls="false"
          ></el-input-number>
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
import { engine } from "@/assets/js/vis";

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
      const loading = this.$message.loading("正在保存...");
      const config = engine.exportConfig();
      //TODO: save in storage
    },

    display() {
      window.open(`/app/${this.$store.getters.id}/dist`);
    },

    download() {
      const a = document.createElement("a");
      a.download = `${this.$store.getters.name}.zip`;
      a.href = `/app/${this.$store.getters.id}/dist.zip`;
      a.click();
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
