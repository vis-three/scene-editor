<template>
  <div class="leftSection-container">
    <drag-plane
      height="100%"
      width="100%"
      :show-dragsign="false"
    >
      <scene-manager slot="view1" />
      <scene-structure slot="view2" />
    </drag-plane>
  </div>
</template>

<script>
import dragPlane from "@/editor/components/drag-plane.vue";
import sceneStructure from "./leftSection/sceneStructure.vue";
import sceneManager from "./leftSection/sceneManager.vue";

export default {
  components: {
    dragPlane,
    sceneStructure,
    sceneManager,
  },
};
</script>

<style lang="less" scoped>
.leftSection-container {
  .boxSetting();
  /deep/ .dragFlexPanel-box .dragFlexPanel-line::before {
    background: @darkestTheme-backgroundColor;
  }
}
</style>
