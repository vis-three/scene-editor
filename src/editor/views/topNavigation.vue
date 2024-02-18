<template>
  <div class="topNavigation-container">
    <file-menu />
    <function-navigation />
    <operate-navigation />
  </div>
</template>

<script>
const fileMenu = () => import("./topNavigation/fileMenu.vue");
const functionNavigation = () =>
  import("./topNavigation/functionNavigation.vue");
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
