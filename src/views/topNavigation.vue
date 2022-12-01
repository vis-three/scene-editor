<template>
  <div class="topNavigation-container">
    <file-menu></file-menu>
    <function-navigation></function-navigation>
    <operate-navigation></operate-navigation>
  </div>
</template>

<script>
const fileMenu = () => import("./topNavigation/fileMenu");
const functionNavigation = () => import("./topNavigation/functionNavigation");
const operateNavigation = () => import("./topNavigation/operateNavigation.vue");

export default {
  components: {
    fileMenu,
    functionNavigation,
    operateNavigation,
  },
};
</script>

<style lang="less" scoped>
.topNavigation-container {
  .boxSetting();
  .flexLayout(row, space-between, center);
  > div:first-child,
  div:last-child {
    width: 20%;
  }
  > div:nth-child(2) {
    flex: 1;
  }
}
</style>
