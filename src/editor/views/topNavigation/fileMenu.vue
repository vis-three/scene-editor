<template>
  <div class="fileMenu-container">
    <div class="app-tips">
      <el-image :src="logo" />
      <span class="app-title">STATIC</span>
    </div>
    <dropdown-menu icon="#iconxiangmuguanli" label="项目" @select="appSelect">
      <el-dropdown-item command="newOne">新建</el-dropdown-item>
      <el-dropdown-item command="reopen">刷新</el-dropdown-item>
      <el-dropdown-item command="history">历史版本</el-dropdown-item>
    </dropdown-menu>
    <dropdown-menu icon="#iconbangzhu" label="帮助" @select="helpSelect">
      <el-dropdown-item command="shortcutKey">快捷键</el-dropdown-item>
      <el-dropdown-item command="course">使用教程</el-dropdown-item>
      <el-dropdown-item command="question">问题反馈</el-dropdown-item>
    </dropdown-menu>

    <shortcut-key-document ref="shortcutKey" />
    <app-history ref="appHistory"></app-history>
  </div>
</template>

<script>
import dropdownMenu from "@/editor/components/dropdownMenu.vue";

const shortcutKeyDocument = () => import("./fileMenu/shortcutKeyDocument.vue");
const appHistory = () => import("./fileMenu/appHistory.vue");

export default {
  components: {
    dropdownMenu,
    shortcutKeyDocument,
    appHistory,
  },
  data() {
    return {
      logo: import.meta.env.BASE_URL + "/image/logo.png",
    };
  },
  methods: {
    appSelect(command) {
      const actionMap = {
        newOne: () => {
          window.location.href = `${window.location.origin}${window.location.pathname}`;
        },
        reopen: () => {
          window.location.href = `${window.location.origin}${window.location.pathname}?id=${this.$store.getters.id}`;
        },
        history: () => {
          this.$refs.appHistory.visible = true;
        },
      };

      actionMap[command] && actionMap[command]();
    },
    helpSelect(command) {
      const actionMap = {
        shortcutKey: () => {
          this.$refs.shortcutKey.visible = true;
        },
        course: () => {
          window.open("https://space.bilibili.com/3048588");
        },
        question: () => {
          window.open(
            "https://github.com/vis-three/scene-editor/issues/new/choose",
          );
        },
      };

      actionMap[command] && actionMap[command]();
    },
  },
};
</script>

<style lang="less" scoped>
.fileMenu-container {
  .boxSetting();
  .flexLayout(row, flex-start, center);
  .app-tips {
    height: 100%;
    padding: (@box-padding / 2);
    .flexLayout(row, flex-start, center);
    > .el-image {
      .boxSetting(40px, 40px);
    }

    > .app-title {
      font-weight: bold;
      font-size: 18px;
      padding-left: @box-padding;
    }
  }
}

.dropdownSelect-container {
  width: unset;
}
</style>
