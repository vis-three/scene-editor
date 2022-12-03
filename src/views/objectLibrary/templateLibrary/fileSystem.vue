<template>
  <div class="fileSystem-container">
    <header-operation></header-operation>
    <container-operation ref="container"></container-operation>
  </div>
</template>

<script>
const headerOperation = () => import("./headerOperation");
const containerOperation = () => import("./containerOperation");

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
  created() {
    this.$store.commit("templateLibrary/request", "");
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
