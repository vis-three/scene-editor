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
          :connector="connector"
          @changeViewpoint="changeViewpoint"
        ></render-viewpoint>
        <auxiliary-display :connector="connector"></auxiliary-display>
        <camera-viewpoint
          ref="cameraViewpoint"
          :connector="connector"
          :viewpoint="currentViewPoint"
          @changeCamera="changeCamera"
        ></camera-viewpoint>
      </template>
    </position-layout-box>

    <position-layout-box
      class="bottom-function-box"
      :offsetX="5"
      :offsetY="5"
      :isBottom="true"
      :isRight="true"
    >
      <template #main>
        <!-- <render-mode :connector="connector"></render-mode> -->
      </template>
    </position-layout-box>

    <position-layout-box class="top-function-box" :offsetX="5" :offsetY="5">
      <template #main>
        <performance-monitor :connector="connector"></performance-monitor>
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
import Vue from "vue";

import { engine, componentManager } from "@/assets/js/VisFrame";

import Connector from "@/assets/js/Connector";

// import { v4 as getUuid } from 'uuid'

import positionLayoutBox from "@/components/positionLayoutBox";
// import dragMoveBox from '@//components/dragMoveBox'
import objectLibrary from "./renderWindow/objectLibrary.vue";
import {
  CONFIGTYPE,
  generateConfig,
  JSONHandler,
  Template,
  uniqueSymbol,
} from "@vis-three/middleware";

const renderViewpoint = () => import("./renderWindow/renderViewpoint");
const cameraViewpoint = () => import("./renderWindow/cameraViewpoint");
const auxiliaryDisplay = () => import("./renderWindow/auxiliaryDisplay");
// const renderScene = () => import('./renderWindow/renderScene')
// const renderMode = () => import("./renderWindow/renderMode");
const performanceMonitor = () => import("./renderWindow/performanceMonitor");

export default {
  components: {
    objectLibrary,
    // dragMoveBox,
    positionLayoutBox,
    renderViewpoint,
    cameraViewpoint,
    auxiliaryDisplay,
    // // renderScene,
    // renderMode,
    performanceMonitor,
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
      connector: "", // 引擎连接器
      showRenderViewPoint: true,
      currentViewPoint: "",
      visTarget: "", // vis引擎放置的target
    };
  },

  computed: {
    mode() {
      return this.$store.getters.mode;
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

    // 设置连通器
    this.connector = new Connector().apply(engine, [
      "setSize",
      "play",
      "stop",
      "setTransformControls",
      "setStats",
      "setViewpoint",
      "setAxesHelper",
      "setCamera",
      "setGridHelper",
      "setDisplayMode",
      "setObjectHelper",
    ]);

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

    const loading = this.$loading({
      text: "正在初始化项目...",
      background: "rgba(0, 0, 0, 0.3)",
    });

    const id = this.$store.getters.id;
    const appMessage = await this.axios
      .post("app/detail", { id })
      .catch((err) => {
        this.$message.error(err.message);
        loading.close();
      });

    if (appMessage.status !== 200) {
      this.$message.error(appMessage.message);
      loading.close();
      return;
    }

    this.$store.commit("name", appMessage.data.name);

    let config = (await this.axios.get(appMessage.data.app)) || {};

    // // 组件加载
    // const component = config.component;

    // if (component) {
    //   delete config.component;

    //   const componentValues = [...Object.values(component)];

    //   // 获取所有的packageJSON
    //   const packageJSONList = await Promise.all(
    //     componentValues.map((item) => this.axios.get(item.pkg))
    //   ).catch((err) => {
    //     this.$message.error(err.message);
    //     loading.close();
    //   });

    //   // 获取所有组件注册组件
    //   const componentList = await Promise.all(
    //     componentValues.map((item, i) =>
    //       componentManager.generate(item.url, packageJSONList[i], item)
    //     )
    //   ).catch((err) => {
    //     this.$message.error(err.message);
    //     loading.close();
    //   });

    //   componentList.forEach(({ resource, config }, i) => {
    //     this.$store.commit("component/add", {
    //       config,
    //       configuration: packageJSONList[i].configuration,
    //     });
    //     engine.registerResources({
    //       [config.cid]: resource,
    //     });
    //   });
    // }

    config = Template.handler(config, (objectConfig) =>
      generateConfig(objectConfig.type, objectConfig, {
        handler: (c) => Vue.observable(c),
      })
    );

    engine.loadConfigAsync(config).then((res) => {
      this.$store.commit(
        "renderer/webGLRenderer",
        uniqueSymbol(CONFIGTYPE.WEBGLRENDERER)
      );
      this.$store.commit("scene/currentScene", uniqueSymbol(CONFIGTYPE.SCENE));
      this.$store.commit("notifyAll");
    });

    loading.close();
  },
};
</script>

<style lang="less" scoped>
.renderWindow-container {
  position: relative;
  .boxSetting();
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
      margin-right: @box-margin / 2;
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
