<template>
  <div class="renderWindow-container">
    <iframe
      ref="renderMask"
      width="100%"
      height="100%"
      scrolling="no"
      class="render-mask"
    />
    <div
      ref="renderElement"
      class="render-window"
      tabindex="0"
      @click.stop="keyboardWatch"
    />

    <position-layout-box
      class="bottom-function-box"
      :offset-x="5"
      :offset-y="5"
      :is-bottom="true"
    >
      <template #main>
        <render-viewpoint
          v-show="showRenderViewPoint"
          :viewpoint="currentViewPoint"
          @changeViewpoint="changeViewpoint"
        />
        <auxiliary-display />
        <camera-viewpoint
          ref="cameraViewpoint"
          :viewpoint="currentViewPoint"
          @changeCamera="changeCamera"
        />
      </template>
    </position-layout-box>

    <position-layout-box class="top-function-box" :offset-x="5" :offset-y="5">
      <template #main>
        <performance-monitor />
      </template>
    </position-layout-box>

    <position-layout-box
      v-show="draw"
      class="top-function-box"
      :offset-x="5"
      :offset-y="35"
    >
      <template #main>
        <path-drawing />
      </template>
    </position-layout-box>

    <position-layout-box
      class="top-function-box"
      is-right
      :offset-x="5"
      :offset-y="5"
    >
      <object-library slot="main" />
    </position-layout-box>
  </div>
</template>

<script>
import {
  uniqueSymbol,
  Template,
  generateConfig,
  CONFIGTYPE,
  JSONHandler,
} from "@vis-three/middleware";
import { engine } from "@/editor/assets/js/vis";
import appApi from "@/assets/js/api/app.js";

import positionLayoutBox from "@/editor/components/positionLayoutBox.vue";
// import dragMoveBox from '@/editor//components/dragMoveBox'
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
      { immediate: true },
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

    const loading = this.$loading({
      text: "正在初始化项目...",
      background: "rgba(0, 0, 0, 0.3)",
    });

    const id = this.$store.getters.id;

    const appMessage = await appApi.getApp(id).catch((err) => {
      this.$message.error(err);
      loading.close();
    });

    let config = await this.$store.dispatch(
      "assetsTransform",
      appMessage.app || {},
    );

    config = Template.handler(
      config,
      (c) =>
        generateConfig(c.type, c, {
          strict: false,
        }),
      {
        filter: [
          "assets",
          "component",
          "canvasAssets",
          "canvas",
          "shaderAssets",
        ],
      },
    );

    engine.loadConfigAsync(config).then((res) => {
      res.component.forEach((component) => {
        this.$store.commit("component/add", {
          config: component.config,
          configuration: component.packageJSON.configuration,
        });
      });

      res.canvas.forEach((canvas) => {
        this.$store.commit("canvas/add", {
          config: canvas.config,
          configuration: canvas.packageJSON.configuration,
        });
      });

      res.shaders.forEach((shader) => {
        this.$store.commit("shader/add", {
          vid: shader.config.vid,
          configuration: shader.packageJSON.configuration,
        });
      });

      this.$store.commit(
        "renderer/webGLRenderer",
        uniqueSymbol(CONFIGTYPE.WEBGLRENDERER),
      );
      this.$store.commit("scene/currentScene", uniqueSymbol(CONFIGTYPE.SCENE));
      this.$store.commit("notifyAll");

      this.$store.dispatch("initEditorConfig", appMessage.editor);
    });

    loading.close();
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
