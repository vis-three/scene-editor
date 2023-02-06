<template>
  <div class="canvasRulerBox-contianer">
    <div class="canvasRuler-origin" @click="resetScroll"></div>
    <div
      class="canvasRuler-top-box"
      :style="{
        width: `${width}px`,
        height: `${rulerSize}px`,
        left: `${rulerLeft}px`,
      }"
      @mouseenter="
        () => {
          showTempColGuide = true;
        }
      "
      @mousemove="setTempColGuidePosition"
      @mouseleave="
        () => {
          showTempColGuide = false;
        }
      "
      @click="addColGuide"
    >
      <canvas :width="width" :height="rulerSize" ref="topCanvas"></canvas>
      <!-- 鼠标位置 STR -->
      <div
        class="ruler-mouse-position-x"
        :style="{
          left: `${rulerMousePositionX}px`,
          width: '1px',
          height: `${rulerSize}px`,
          '--rulerMousePositionX': `'${getRulerDataByLeft(
            rulerMousePositionX
          )}'`,
        }"
        v-show="showMousePosition"
      ></div>
      <!-- 鼠标位置 END -->
      <!-- 辅助线 STR -->
      <div
        class="ruler-guide ruler-col-guide"
        :style="{
          height: `${height}px`,
          left: `${item.position}px`,
          '--positionText': `'${item.text}'`,
        }"
        v-for="(item, index) in colGuideList"
        :key="index"
      ></div>
      <div
        class="ruler-guide ruler-col-guide ruler-col-guide-temp"
        :style="{
          height: `${height}px`,
          left: `${tempColGuidePosition}px`,
        }"
        v-show="showTempColGuide"
      ></div>
      <!-- 辅助线 END -->
    </div>
    <div
      class="canvasRuler-left-box"
      :style="{
        top: `${rulerTop}px`,
        width: `${rulerSize}px`,
        height: `${height}px`,
      }"
      @mouseenter="
        () => {
          showTempRowGuide = true;
        }
      "
      @mousemove="setTempRowGuidePosition"
      @mouseleave="
        () => {
          showTempRowGuide = false;
        }
      "
      @click="addRowGuide"
    >
      <canvas :width="rulerSize" :height="height" ref="leftCanvas"></canvas>
      <div
        class="ruler-mouse-position-y"
        :style="{
          top: `${rulerMousePositionY}px`,
          width: `${rulerSize}px`,
          height: '1px',
          '--rulerMousePositionY': `'${getRulerDataByTop(
            rulerMousePositionY
          )}'`,
        }"
        v-show="showMousePosition"
      ></div>
      <div
        class="ruler-guide ruler-row-guide"
        :style="{
          width: `${width}px`,
          top: `${item.position}px`,
          '--positionText': `'${item.text}'`,
        }"
        v-for="(item, index) in rowGuideList"
        :key="index"
      ></div>
      <div
        class="ruler-guide ruler-row-guide ruler-col-guide-temp"
        :style="{
          width: `${height}px`,
          top: `${tempRowGuidePosition}px`,
        }"
        v-show="showTempRowGuide"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    height: {
      // 标尺高度
      type: Number,
    },
    width: {
      // 保持宽度
      type: Number,
    },
    rulerTop: {
      // 标尺的顶部距离
      type: Number,
    },
    rulerLeft: {
      // 标尺的左部距离
      type: Number,
    },
    originLeft: {
      // 画布起始的左部距离
      type: Number,
    },
    originTop: {
      // 画布起始的顶部距离
      type: Number,
    },
    showMousePosition: {
      // 展示鼠标位置
      type: Boolean,
    },
    mousePositionX: {
      // 鼠标的x位置
      type: Number,
    },
    mousePositionY: {
      // 鼠标的y位置
      type: Number,
    },
  },
  data() {
    return {
      rulerSize: 20, // 标尺统一大小
      originScrollLeft: 0, // 起始的滚动左侧
      originScrollTop: 0, // 起始的滚动顶部距离
      showTempColGuide: false, // 展示纵向辅助线
      showTempRowGuide: false, // 展示横向辅助线
      tempColGuidePosition: 0, // 临时纵向辅助线的位置
      tempRowGuidePosition: 0, // 临时横向辅助线的位置
    };
  },
  computed: {
    // 标尺上鼠标的x位置
    rulerMousePositionX() {
      return -this.rulerLeft + this.mousePositionX;
    },
    // 标尺上鼠标的y位置
    rulerMousePositionY() {
      return -this.rulerTop + this.mousePositionY;
    },
    // 纵向辅助的列表
    colGuideList() {
      return this.$store.getters["guide/getColGuideList"];
    },
    // 横向辅助线列表
    rowGuideList() {
      return this.$store.getters["guide/getRowGuideList"];
    },
  },
  methods: {
    // 画标尺
    drawRuler() {
      const topContext = this.$refs.topCanvas.getContext("2d");
      const leftContext = this.$refs.leftCanvas.getContext("2d");
      const space = 10; // 小间距
      const bigSpace = 100; // 大间距
      const smallLine = 5; // 小线条
      const bigLine = 10; // 大线条
      const smallLineStrocke = "rgb(157, 157, 157)";
      const bigLineStrocke = "rgb(236, 236, 236)";
      const fontSpace = 4;
      const fontSize = "10px";
      const fontFill = smallLineStrocke;

      const drawRuler = (ctx, direction) => {
        const contrast = direction === "top" ? this.width : this.height;
        const bigDistance = direction === "top" ? bigLine : -bigLine;
        const smalDistance = direction === "top" ? smallLine : -smallLine;
        const textBaseline = direction === "top" ? "top" : "bottom";

        if (direction === "left") {
          ctx.rotate((90 * Math.PI) / 180);
        }
        // 1px线条精度
        ctx.translate(0.5, 0);
        for (let position = 0; position <= contrast; position += space) {
          ctx.beginPath();
          ctx.moveTo(position, 0);
          if (position % bigSpace === 0) {
            ctx.strokeStyle = bigLineStrocke;
            ctx.lineTo(position, bigDistance);
            ctx.fillStyle = fontFill;
            ctx.font = fontSize;
            ctx.textBaseline = textBaseline;
            ctx.fillText(
              position - contrast / 2,
              position + fontSpace,
              bigDistance
            );
          } else {
            ctx.strokeStyle = smallLineStrocke;
            ctx.lineTo(position, smalDistance);
          }
          ctx.stroke();
          ctx.closePath();
        }
      };
      drawRuler(topContext, "top");
      drawRuler(leftContext, "left");
    },
    // 根据定位获取标尺数值x
    getRulerDataByLeft(data) {
      return data - this.width / 2;
    },
    // 根据定位获取标尺数值y
    getRulerDataByTop(data) {
      return data - this.height / 2;
    },
    // 重置滚动
    resetScroll() {
      this.$emit("resetScroll");
    },
    // 显示临时的纵向辅助线
    setTempColGuidePosition(event) {
      this.tempColGuidePosition = event.offsetX;
    },
    // 显示临时的横向辅助线
    setTempRowGuidePosition(event) {
      this.tempRowGuidePosition = event.offsetY;
    },
    // 添加纵向辅助线
    addColGuide() {
      this.$store.commit("guide/addColGuide", {
        position: this.tempColGuidePosition,
        text: this.getRulerDataByLeft(this.tempColGuidePosition),
      });
      this.colGuideList.push();
    },
    // 添加横向辅助线
    addRowGuide() {
      this.$store.commit("guide/addRowGuide", {
        position: this.tempRowGuidePosition,
        text: this.getRulerDataByTop(this.tempRowGuidePosition),
      });
    },
  },
  created() {
    // 缓存一份初始的滚动顶部与底部数据
    this.originScrollLeft = this.rulerLeft;
    this.originScrollTop = this.rulerTop;
  },
  mounted() {
    this.drawRuler();
    // canvas初始的移动距离
  },
};
</script>

<style lang="less" scoped>
@guideTop: 25px;
@guideLeft: 2px;
.canvasRulerBox-contianer {
  .boxSetting(0, 0);
  .absolutePosition();
  z-index: 10;
  > .canvasRuler-origin {
    .boxSetting(15px, 15px);
    background-color: @theme-color;
    cursor: pointer;
    .absolutePosition();
    z-index: 10;
    .transitionSetting({background-color: @themeHover-color;});
  }
  > .canvasRuler-top-box,
  .canvasRuler-left-box {
    .boxSetting(0, 0);
    .absolutePosition();
    // background: pink;
    > canvas {
      .absolutePosition();
      cursor: pointer;
    }
    > .ruler-mouse-position-x {
      .absolutePosition();
      border-left: 1px dashed @theme-color;
      pointer-events: none;
      &::before {
        .absolutePosition(5px, unset, unset, 2px);
        content: var(--rulerMousePositionX);
        color: @text-color;
        background: @theme-color;
        padding: 0 2px;
      }
    }
    > .ruler-mouse-position-y {
      .absolutePosition();
      border-top: 1px dashed @theme-color;
      pointer-events: none;
      &::before {
        .absolutePosition(7px);
        content: var(--rulerMousePositionY);
        color: @text-color;
        background: @theme-color;
        padding: 0 2px;
        transform: rotate(90deg);
      }
    }
    > .ruler-guide {
      .absolutePosition();
      pointer-events: none;
      background: @theme-color;
      &::before {
        .absolutePosition();
        content: var(--positionText);
        font-size: 10px;
        color: @theme-color;
      }
    }
    > .ruler-col-guide {
      .boxSetting(1px);
      &::before {
        top: @guideTop;
        left: @guideLeft;
      }
    }
    > .ruler-row-guide {
      .boxSetting(unset, 1px);
      &::before {
        top: @guideLeft;
        left: @guideTop;
      }
    }
  }
}
</style>
