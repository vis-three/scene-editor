<template>
  <div id="app">
    <render-window />
    <loading-manager />
  </div>
</template>

<script>
import renderWindow from "./views/renderWindow.vue";
import loadingManager from "./views/loadingManager.vue";

export default {
  components: {
    renderWindow,
    loadingManager,
  },
  mounted() {},
};
</script>

<style lang="less" scoped>
#app {
  .boxSetting();
}
</style>
