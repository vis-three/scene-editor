<template>
  <el-dialog
    title="我的应用"
    :visible.sync="visible"
    width="70vw"
    append-to-body
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
  >
    <div class="workbench-container">
      <file-system></file-system>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button
        type="primary"
        size="mini"
        v-if="!selected && currentFloder.parent"
        @click="addNew"
      >
        新 建
      </el-button>
      <el-button type="primary" size="mini" v-if="selected" @click="select">
        确 定
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import appApi from "@/assets/js/api/app.js";

const fileSystem = () => import("./workbench/fileSystem.vue");
export default {
  components: {
    fileSystem,
  },
  data() {
    return {
      visible: false,
    };
  },
  computed: {
    selected() {
      return this.$store.getters["appLibrary/selected"];
    },
    currentFloder() {
      return this.$store.getters["appLibrary/currentFloder"];
    },
  },
  methods: {
    addNew() {
      this.$prompt("应用名称", "新建应用", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      }).then(({ value }) => {
        appApi
          .creatApp({
            name: value,
            classifyId: this.$store.getters["appLibrary/currentFloder"].id,
          })
          .then((data) => {
            this.$store.commit("initProject", {
              id: data.id,
              name: value,
            });
            this.visible = false;
          });
      });
    },
    select() {
      this.$store.commit("initProject", {
        id: this.selected.id,
        name: this.selected.name,
      });
      this.visible = false;
    },
  },
  created() {},
};
</script>

<style lang="less" scoped>
/deep/ .el-dialog {
  .el-dialog__body {
    height: 50vh;
  }
}
.workbench-container {
  .flexLayout(column, flex-start, flex-start);
  .boxSetting();
  background: @theme-backgroundColor;
}
</style>
