<template>
  <el-dialog
    title="贴图库"
    :visible.sync="visible"
    width="70vw"
    append-to-body
    :modal="false"
  >
    <div class="fileSystem-container">
      <header-operation />
      <container-operation ref="container" />
    </div>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        size="mini"
        @click="visible = false"
      >取 消</el-button>
      <el-button
        type="primary"
        size="mini"
        @click="confirm"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
const headerOperation = () => import("./headerOperation.vue");
const containerOperation = () => import("./containerOperation.vue");

export default {
  components: {
    headerOperation,
    containerOperation,
  },
  data() {
    return {
      visible: false,
      confirmFun: () => {},
    };
  },
  created() {
    this.$store.commit("textureLibrary/request", "");
  },
  methods: {
    open({ confirm }) {
      this.visible = true;
      this.confirmFun = confirm;
    },
    confirm() {
      this.visible = false;
      this.confirmFun({ files: [].concat(this.$refs.container.selected) });
      this.$refs.container.selected = [];
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .el-dialog {
  .el-dialog__body {
    height: 50vh;
  }
}
.fileSystem-container {
  .flexLayout(column, flex-start, flex-start);
  .boxSetting();
  background: @theme-backgroundColor;
}
</style>
