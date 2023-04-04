<template>
  <div class="fileMenu-container">
    <div class="app-tips">
      <el-image src="/image/logo.png"></el-image>
    </div>
    <!-- <dropdown-menu
      icon="#iconwode"
      label="我的"
      @click.native="select('my')"
    ></dropdown-menu> -->
    <dropdown-menu icon="#iconbangzhu" label="帮助" @select="select">
      <el-dropdown-item command="shortcutKey">快捷键</el-dropdown-item>
      <el-dropdown-item command="course">使用教程</el-dropdown-item>
    </dropdown-menu>

    <shortcut-key-document ref="shortcutKey"></shortcut-key-document>
  </div>
</template>

<script>
import dropdownMenu from "@/components/dropdownMenu.vue";

const shortcutKeyDocument = () => import("./fileMenu/shortcutKeyDocument.vue");
export default {
  components: {
    dropdownMenu,
    shortcutKeyDocument,
  },
  data() {
    return {};
  },
  methods: {
    my() {
      console.log(1);
    },
    select(command) {
      this[command] && this[command]();
    },

    shortcutKey() {
      this.$refs.shortcutKey.visible = true;
    },
    course() {},
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
  }
}

.dropdownSelect-container {
  width: unset;
}
</style>
