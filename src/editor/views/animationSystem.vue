<template>
  <div class="animationSystem-container">
    <drag-trans-box
      class="animationSystem-operationController"
      rightDrag
      :size="areaSetting.size"
      @draging="(result) => draging(result, areaSetting)"
      @draged="
        () => {
          areaSetting.bufferSize = areaSetting.size;
        }
      "
    >
      <operation-controller
        @scrollHandler="scrollHandler"
      ></operation-controller>
    </drag-trans-box>
    <div
      class="animationSystem-trackController"
      :style="{ width: `${trackControllerWidth}px` }"
    >
      <track-controller :scrollTop="scrollTop"></track-controller>
    </div>
  </div>
</template>

<script>
import dragTransBox from "@/editor/components/dragTransBox.vue";

const operationController = () =>
  import("./animationSystem/operationController.vue");
const trackController = () => import("./animationSystem/trackController.vue");
export default {
  components: {
    dragTransBox,
    operationController,
    trackController,
  },
  data() {
    const size = 380;
    return {
      areaSetting: {
        // 拖拽盒子设置
        size,
        bufferSize: size,
        max: 600,
        min: 200,
      },
      scrollTop: 0,
      windowInnerWidth: window.innerWidth,
    };
  },
  computed: {
    trackControllerWidth() {
      return this.windowInnerWidth - this.areaSetting.size;
    },
  },
  methods: {
    scrollHandler(value) {
      this.scrollTop = value;
    },
    draging(result, setting) {
      let resultSize = setting.bufferSize + result;
      if (resultSize <= setting.min) {
        resultSize = setting.min;
      } else if (resultSize >= setting.max) {
        resultSize = setting.max;
      }
      setting.size = resultSize;
    },
  },
  watch: {
    trackControllerWidth: {
      handler(newVal) {
        this.$store.commit("animation/trackWidth", newVal - 10);
      },
      immediate: true,
    },
  },
  mounted() {
    window.addEventListener("resize", () => {
      this.windowInnerWidth = window.innerWidth;
    });
  },
};
</script>

<style lang="less" scoped>
.animationSystem-container {
  .boxSetting();
  .flexLayout();
  /deep/.dragTransBox-contaner .dragBox-rightDrag {
    background: @theme-backgroundColor;
  }
  > .animationSystem-operationController {
  }
  > .animationSystem-trackController {
    .boxSetting();
    background: @theme-backgroundColor;
    border-top: (@box-padding / 2) solid @theme-backgroundColor;
    border-right: @box-margin solid @theme-backgroundColor;
    overflow: hidden;
  }
}
</style>
