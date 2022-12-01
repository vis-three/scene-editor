<template>
  <div class="eidtor-container">
    <!-- 顶部导航 STR -->
    <div
      class="top-area"
      :style="{
        height: `${topAreaSetting.size}px`,
      }"
    >
      <top-navigation></top-navigation>
    </div>
    <!-- 顶部导航 END -->
    <div
      class="middle-area"
      :style="{
        height: `${middleAreaHeight}px`,
      }"
    >
      <drag-trans-box
        rightDrag
        :size="leftAreaSetting.size"
        @draging="(result) => draging(result, leftAreaSetting)"
        @draged="
          () => {
            leftAreaSetting.bufferSize = leftAreaSetting.size;
          }
        "
      >
        <left-section></left-section>
      </drag-trans-box>
      <!-- 3d可视化区域 STR -->
      <div
        class="three-vis"
        :style="{
          width: `${threeVisWidth}px`,
          height: `${middleAreaHeight}px`,
        }"
      >
        <render-area
          :top="topAreaSetting.size"
          :left="leftAreaSetting.size"
          :width="threeVisWidth"
          :height="middleAreaHeight"
        ></render-area>
      </div>
      <!-- 3d可视化区域 END -->
      <drag-trans-box
        leftDrag
        :size="rightAreaSetting.size"
        @draging="(result) => draging(result, rightAreaSetting)"
        @draged="
          () => {
            rightAreaSetting.bufferSize = rightAreaSetting.size;
          }
        "
      >
        <function-module-library></function-module-library>
      </drag-trans-box>
    </div>
    <drag-trans-box
      class="bottom-area"
      topDrag
      :size="bottomAreaSetting.size"
      @draging="(result) => draging(result, bottomAreaSetting)"
      @draged="
        () => {
          bottomAreaSetting.bufferSize = bottomAreaSetting.size;
        }
      "
    >
      <animtion-system></animtion-system>
    </drag-trans-box>
  </div>
</template>

<script>
import dragTransBox from "@/components/dragTransBox";
import renderArea from "@/views/renderArea.vue";
import leftSection from "./leftSection.vue";
import topNavigation from "./topNavigation";
import functionModuleLibrary from "./functionModuleLibrary";
import animtionSystem from "./animationSystem.vue";

export default {
  components: {
    dragTransBox,
    renderArea,
    leftSection,
    topNavigation,
    functionModuleLibrary,
    animtionSystem,
  },
  data() {
    return {
      topAreaSetting: {
        // 顶部
        size: 50,
      },
      rightAreaSetting: {
        // 右侧拖拽盒子设置
        size: 322,
        bufferSize: 322,
        max: 600,
        min: 130,
      },
      leftAreaSetting: {
        // 左侧拖拽盒子设置
        size: 322,
        bufferSize: 322,
        max: 600,
        min: 130,
      },
      bottomAreaSetting: {
        size: 200, // 底部拖拽盒子设置
        bufferSize: 250,
        max: 500,
        min: 150,
      },
    };
  },
  computed: {
    middleAreaHeight() {
      return (
        window.innerHeight -
        (this.topAreaSetting.size + this.bottomAreaSetting.size)
      );
    },
    threeVisWidth() {
      return (
        window.innerWidth -
        (this.rightAreaSetting.size + this.leftAreaSetting.size)
      );
    },
  },
  watch: {},
  methods: {
    draging(result, setting) {
      let resultSize = setting.bufferSize + result;
      if (resultSize <= setting.min) {
        resultSize = setting.min;
      } else if (resultSize >= setting.max) {
        resultSize = setting.max;
      }
      setting.size = resultSize;
    },

    resetWindow() {
      this.rightAreaSetting = {
        // 右侧拖拽盒子设置
        size: 300,
        bufferSize: 300,
        max: 600,
        min: 130,
      };
      this.leftAreaSetting = {
        // 左侧拖拽盒子设置
        size: 300,
        bufferSize: 300,
        max: 600,
        min: 130,
      };
      this.bottomAreaSetting = {
        size: 200, // 底部拖拽盒子设置
        bufferSize: 250,
        max: 600,
        min: 150,
      };
    },
  },
  mounted() {
    window.onresize = (e) => {
      this.resetWindow();
    };
  },
};
</script>

<style lang="less" scoped>
.eidtor-container {
  .boxSetting();
  overflow: hidden;
  .flexLayout(column, flex-start, center);
  .top-area {
    .flexLayout(row, flex-start, center);
    width: 100%;
  }
  .middle-area {
    width: 100%;
    .flexLayout(row, space-between, center);
  }
  .bottom-area {
    width: 100%;
  }
}
</style>
