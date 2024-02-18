<template>
  <div
    class="renderArea-container"
    :style="{ width: `${width}px`, height: `${height}px` }"
  >
    <!-- 大窗口1 STR -->
    <div
      ref="renderAreaLeft"
      class="renderArea-left"
      :style="{ width: `${leftAreaWidth}%`, height: '100%' }"
    >
      <div
        v-if="areaNum > 0"
        ref="leftTopWindow"
        class="renderWindow"
        :style="{ width: '100%', height: `${leftTopAreaHeight}%` }"
      >
        <render-window
          ref="renderWindowFirst"
          sign="first"
          :play="areaNum > 0"
        />
        <div
          v-if="areaNum > 2"
          class="bottom-drag-line"
          @mousedown="dragStart($event, 'bottomLeft')"
        />
      </div>
      <div
        v-if="areaNum > 2"
        class="renderWindow"
        :style="{ width: '100%', height: `${100 - leftTopAreaHeight}%` }"
      >
        <render-window
          ref="renderWindowThird"
          sign="third"
          viewpoint="right"
          :play="areaNum > 2"
        />
      </div>
      <div
        v-if="areaNum > 1"
        class="middle-drag-line"
        @mousedown="dragStart($event, 'middle')"
      />
    </div>
    <!-- 大窗口1 END -->
    <!-- 大窗口2 STR -->
    <div
      v-if="areaNum > 1"
      class="renderArea-right"
      :style="{ width: `${100 - leftAreaWidth}%`, height: '100%' }"
    >
      <div
        v-if="areaNum > 1"
        ref="rightTopWindow"
        class="renderWindow"
        :style="{ width: '100%', height: `${rightTopAreaHeight}%` }"
      >
        <render-window
          ref="renderWindowSecond"
          sign="second"
          viewpoint="front"
          :play="areaNum > 1"
        />
        <div
          v-if="areaNum > 3"
          class="bottom-drag-line"
          @mousedown="dragStart($event, 'bottomRight')"
        />
      </div>
      <div
        v-if="areaNum > 3"
        class="renderWindow"
        :style="{ width: '100%', height: `${100 - rightTopAreaHeight}%` }"
      >
        <render-window
          ref="renderWindowFouth"
          sign="fouth"
          viewpoint="top"
          :play="areaNum > 3"
        />
      </div>
    </div>
    <!-- 大窗口2 STR -->
  </div>
</template>

<script>
import renderWindow from "./renderWindow.vue";

export default {
  components: {
    renderWindow,
  },
  props: {
    top: {
      // 顶部距离
      type: Number,
      require: true,
    },
    left: {
      // 左侧距离
      type: Number,
      require: true,
    },
    width: {
      // 宽度
      type: Number,
      require: true,
    },
    height: {
      // 高度
      type: Number,
      require: true,
    },
  },
  data() {
    return {
      areaWidth: 50, // %
      leftAreaHeight: 50, // %
      rightAreaHeight: 50, // %
      timer: "", // 定时器
      canMove: true, // 节流标识
      throttleTime: 1000 / 30,
      limitMin: 10,
      limitMax: 90,
      areaNum: 1, // 窗口数量
    };
  },
  computed: {
    leftAreaWidth() {
      return this.areaNum > 1 ? this.areaWidth : 100; // %
    },
    leftTopAreaHeight() {
      return this.areaNum > 2 ? this.leftAreaHeight : 100; // %
    },
    rightTopAreaHeight() {
      return this.areaNum > 3 ? this.rightAreaHeight : 100; // %
    },
  },
  mounted() {},
  methods: {
    // 拖动开始
    dragStart($event, cursor) {
      const offsetSize = cursor === "middle" ? this.left : this.top;

      const dragFun = (moveEvent) => {
        // 设置鼠标指针
        document.body.style.cursor =
          cursor === "middle" ? "ew-resize" : "ns-resize";
        if (!this.canMove) {
          return false;
        } else {
          this.canMove = false;
          this.timer = setTimeout(() => {
            const mouseY = moveEvent.clientY;
            const mouseX = moveEvent.clientX;
            let result =
              cursor === "middle"
                ? (mouseX - offsetSize) / this.width
                : (mouseY - offsetSize) / this.height;

            result *= 100;
            if (result >= this.limitMax) {
              result = this.limitMax;
            } else if (result <= this.limitMin) {
              result = this.limitMin;
            }

            const doMap = {
              middle: () => {
                this.areaWidth = result;
              },
              bottomLeft: () => {
                this.leftAreaHeight = result;
              },
              bottomRight: () => {
                this.rightAreaHeight = result;
              },
            };

            doMap[cursor]();

            this.canMove = true;
          }, this.throttleTime);
        }
      };
      const removeFun = () => {
        document.body.style.cursor = "default";
        document.removeEventListener("mousemove", dragFun);
        document.removeEventListener("mouseup", removeFun);
      };

      document.addEventListener("mousemove", dragFun);
      document.addEventListener("mouseup", removeFun);
    },
  },
};
</script>

<style lang="less" scoped>
.renderArea-container {
  .flexLayout(row);
  > .renderArea-left {
    // background: green;
    position: relative;
  }
  > .renderArea-right {
    // background: blue;
  }
  .renderWindow {
    position: relative;
    .bottom-drag-line {
      .boxSetting(100%, 2px);
      background: @theme-backgroundColor;
      .absolutePosition(unset, unset, -1px, 0);
      cursor: ns-resize;
      box-shadow: 0 0 2px rgba(255, 255, 255, 0.4);
    }
  }
  .middle-drag-line {
    .boxSetting(2px, 100%);
    background: fade(@theme-backgroundColor, 20);
    .absolutePosition(0, -1px, unset, unset);
    cursor: ew-resize;
    box-shadow: 0 0 3px rgba(255, 255, 255, 0.5);
  }
}
</style>
