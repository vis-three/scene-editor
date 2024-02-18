<template>
  <div class="fileSystem-container">
    <header-operation />
    <container-operation ref="container" />
  </div>
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
    this.$store.commit("appLibrary/request", "");
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
