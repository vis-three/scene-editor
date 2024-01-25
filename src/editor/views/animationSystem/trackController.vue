<template>
  <div class="trackController-container">
    <view-track>
      <template slot-scope="{ exactWidth }">
        <time-axis :exactWidth="exactWidth"></time-axis>
        <pre-render-area :exactWidth="exactWidth"></pre-render-area>
        <animation-track :scrollTop="scrollTop"></animation-track>
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
