<template>
  <div class="componentLibarary-container">
    <el-tabs v-model="active" tab-position="left">
      <el-tab-pane name="user">
        <div class="tab-pane" slot="label">
          <vis-icon code="#iconhuakuai"></vis-icon>
          <span>我的</span>
        </div>
        <file-system class="file-system"></file-system>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
const fileSystem = () => import("./componentLibrary/fileSystem.vue");
export default {
  components: {
    fileSystem,
  },
  data() {
    return {
      active: "user",
    };
  },
};
</script>

<style lang="less" scoped>
.componentLibarary-container {
  .boxSetting();

  .file-system {
    height: 100%;
  }

  /deep/ .el-tabs {
    position: relative;
    overflow: visible;
    .el-tabs__header {
      width: 70px;
      .absolutePosition(0, 0, 0, -70px);
      .el-tabs__nav {
        display: block;
        .is-active {
          border-bottom: 0;
        }
        .el-tabs__active-bar {
          display: none;
        }
      }

      .el-tabs__item:hover {
        border-bottom: 0 !important;
      }
    }

    .el-tabs__nav-wrap.is-left::after {
      display: none;
    }
  }

  .tab-pane {
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
    padding: 0 @box-padding;
    > .icon-container {
      color: @theme-color;
      margin-right: @box-margin / 2;
      font-size: 12px;
    }
  }
}
</style>
