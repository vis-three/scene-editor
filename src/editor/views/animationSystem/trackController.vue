<template>
  <div class="trackController-container">
    <view-track>
      <template slot-scope="{ exactWidth }">
        <time-axis :exact-width="exactWidth" />
        <pre-render-area :exact-width="exactWidth" />
        <animation-track :scroll-top="scrollTop" />
      </template>
    </view-track>
  </div>
</template>

<script>
import viewTrack from "./viewTrack.vue";
import timeAxis from "./timeAxis.vue";
import preRenderArea from "./preRenderArea.vue";

const animationTrack = () => import("./animationTrack.vue");
export default {
  components: {
    viewTrack,
    timeAxis,
    preRenderArea,
    animationTrack,
  },
  props: {
    scrollTop: {
      type: Number,
      default: 0,
    },
  },
};
</script>

<style lang="less" scoped>
.trackController-container {
  .boxSetting();
}
</style>
