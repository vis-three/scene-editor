<template>
  <div class="fileSystem-container">
    <header-operation></header-operation>
    <container-operation></container-operation>
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
  created() {
    this.$store.commit("modelLibrary/request", "");
  },
};
</script>

<style lang="less" scoped>
.fileSystem-container {
  .flexLayout(column, flex-start, flex-start);
  .boxSetting();
  background: @theme-backgroundColor;
  border-radius: 3px;
  box-shadow: 2px 2px 8px @darkestTheme-backgroundColor;
}
</style>
