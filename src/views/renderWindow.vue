<template>
  <div class="renderWindow-container">
    <iframe
      width="100%"
      height="100%"
      scrolling="no"
      ref="renderMask"
      class="render-mask"
    ></iframe>
    <div
      class="render-window"
      ref="renderElement"
      @click.stop="keyboardWatch"
      tabindex="0"
    ></div>

    <position-layout-box
      class="bottom-function-box"
      :offsetX="5"
      :offsetY="5"
      :isBottom="true"
    >
      <template #main>
        <render-viewpoint
          v-show="showRenderViewPoint"
          :viewpoint="currentViewPoint"
          @changeViewpoint="changeViewpoint"
        ></render-viewpoint>
        <auxiliary-display></auxiliary-display>
        <camera-viewpoint
          ref="cameraViewpoint"
          :viewpoint="currentViewPoint"
          @changeCamera="changeCamera"
        ></camera-viewpoint>
      </template>
    </position-layout-box>

    <position-layout-box class="top-function-box" :offsetX="5" :offsetY="5">
      <template #main>
        <performance-monitor></performance-monitor>
      </template>
    </position-layout-box>

    <position-layout-box
      class="top-function-box"
      :offsetX="5"
      :offsetY="35"
      v-show="draw"
    >
      <template #main>
        <path-drawing></path-drawing>
      </template>
    </position-layout-box>

    <position-layout-box
      class="top-function-box"
      isRight
      :offsetX="5"
      :offsetY="5"
    >
      <object-library slot="main"></object-library>
    </position-layout-box>
  </div>
</template>

<script>
import { engine } from "@/assets/js/vis";

import positionLayoutBox from "@/components/positionLayoutBox.vue";
// import dragMoveBox from '@//components/dragMoveBox'
import objectLibrary from "./renderWindow/objectLibrary.vue";

const renderViewpoint = () => import("./renderWindow/renderViewpoint.vue");
const cameraViewpoint = () => import("./renderWindow/cameraViewpoint.vue");
const auxiliaryDisplay = () => import("./renderWindow/auxiliaryDisplay.vue");
const performanceMonitor = () =>
  import("./renderWindow/performanceMonitor.vue");
const pathDrawing = () => import("./renderWindow/pathDrawing.vue");

export default {
  components: {
    objectLibrary,
    // dragMoveBox,
    positionLayoutBox,
    renderViewpoint,
    cameraViewpoint,
    auxiliaryDisplay,
    performanceMonitor,
    pathDrawing,
  },
  props: {
    // 窗口标识
    sign: {
      type: String,
      required: true,
    },
    // 是否播放
    play: {
      type: Boolean,
      default: false,
    },
    // 初始的视角
    viewpoint: {
      type: String,
      default: "default",
    },
  },
  data() {
    return {
      timer: "", // 刷新定时器
      canResize: true,
      throttleTime: 1000 / 60,
      width: "",
      height: "",
      showRenderViewPoint: true,
      currentViewPoint: "",
      visTarget: "", // vis引擎放置的target
    };
  },

  computed: {
    draw() {
      return this.$store.getters["path/draw"];
    },
  },
  methods: {
    // 相机视角改名
    changeCamera(vid) {
      this.showRenderViewPoint = !vid;
    },
    // 更改视角
    changeViewpoint(value) {
      this.currentViewPoint = value;
    },
    // 快捷键应用
    keyboardWatch() {
      engine.keyboardManager.watch(this.$refs.renderElement);
    },
  },
  watch: {
    viewpoint: {
      handler(newVal) {
        this.currentViewPoint = newVal;
      },
      immediate: true,
    },
  },
  async mounted() {
    engine.setDom(this.$refs.renderElement).setSize().play();

    // 渲染监听
    this.$watch(
      "play",
      (newVal) => {
        if (newVal) {
          engine.play();
        } else {
          engine.stop();
        }
      },
      { immediate: true }
    );

    // 自动窗口大小
    const renderMask = this.$refs.renderMask;
    renderMask.contentWindow.addEventListener("resize", (e) => {
      if (!this.canResize) {
        return false;
      } else {
        this.canResize = false;
        this.timer = setTimeout(() => {
          engine.setSize(renderMask.offsetWidth, renderMask.offsetHeight);
          this.canResize = true;
        }, this.throttleTime);
      }
    });
  },
};
</script>

<style lang="less" scoped>
.renderWindow-container {
  position: relative;
  .boxSetting();
  overflow: hidden;
  .render-mask {
    position: absolute;
    pointer-events: none;
    z-index: -1;
  }

  .render-window {
    .boxSetting();
    position: absolute;
  }
  .bottom-function-box {
    .flexLayout(row, flex-start, center);
    > * {
      margin-right: (@box-margin / 2);
    }
  }
  .top-function-box {
    .flexLayout(row, flex-start, center);
  }
}
.positionLayoutBox-container {
  z-index: 100;
}
</style>
