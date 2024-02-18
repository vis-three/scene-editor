<template>
  <div
    ref="editorCanvas-container"
    class="editorCanvas-container"
    contenteditable="true"
    @mouseenter="editorCanvasMouseenter"
    @mousemove="editorCanvasMousemove"
    @mouseleave="editorCanvasMouseleave"
  >
    <canvas-ruler-box
      ref="canvasRulerBox"
      :height="boardHeight"
      :width="boardWidth"
      :ruler-left="rulerLeft"
      :ruler-top="rulerTop"
      :origin-left="originLeft"
      :origin-top="originTop"
      :show-mouse-position="showMousePosition"
      :mouse-position-x="mousePositionX"
      :mouse-position-y="mousePositionY"
      contenteditable="false"
      @resetScroll="resetScroll"
    />
    <div
      ref="drawingBox"
      class="canvas-drawing-box"
      contenteditable="false"
      @scroll="scroll"
    >
      <div
        class="editorCanvas-drawingBoard"
        :style="{ height: `${boardHeight}px`, width: `${boardWidth}px` }"
      >
        <div
          id="editorCanvas-iframe"
          class="editorCanvas-iframe"
          :style="{
            width: `${iframeWidth}px`,
            height: `${iframeHeight}px`,
            top: `${iframeTop}px`,
            left: `${iframeLeft}px`,
          }"
        >
          <!-- <three-engine
            v-if="canLoadEngine"
            :width="iframeWidth"
            :height="iframeHeight"
          ></three-engine> -->
          <component-canvas
            :width="iframeWidth"
            :height="iframeHeight"
          />
        </div>
      </div>
    </div>
    <div
      v-show="moveMaskShow"
      class="canvas-move-mask"
      contenteditable="false"
      :style="{ cursor: canMoveCanvas ? 'grabbing' : 'grab' }"
      @mousedown="moveMaskMousedown"
      @mousemove="moveMaskMousemove"
      @mouseup="moveMaskMouseup"
    />
  </div>
</template>

<script>
const componentCanvas = () => import("./editorCanvas/componentCanvas"); // 组件画板
const canvasRulerBox = () => import("./editorCanvas/canvasRulerBox"); // 编辑器标尺组件

export default {
  components: {
    componentCanvas, // 组件画板
    canvasRulerBox, // 编辑器标尺组件
  },
  props: {
    // 画布宽度
    iframeWidth: {
      type: Number,
      required: true,
    },
    // 画布高度
    iframeHeight: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      boardHeight: 3000, // 画板高度
      boardWidth: 3000, // 画板宽度
      originLeft: 50, // 嵌页起始左部距离
      originTop: 50, // 嵌页起始顶部距离
      iframeTop: 0, // 嵌页顶部距离
      iframeLeft: 0, // 嵌页左部距离
      originScrollLeft: 0, // 起始的左部滚动距离
      originScrollTop: 0, // 起始的
      scrollTop: 0, // 滚动顶部距离
      scrollLeft: 0, // 滚动左部距离
      bufferScrollTop: 0, // 缓存滚动顶部距离
      bufferScrollLeft: 0, // 缓存滚动左部距离
      canLoadEngine: false, // 是否可以加载引擎
      moveMaskShow: false, // 移动罩子是否显示
      canMoveCanvas: false, // 是否可以移动画布
      moveStartX: 0, // 移动罩子起始点x
      moveStartY: 0, // 移动罩子起始点y
      showMousePosition: false, // 展示鼠标位置
      mousePositionX: 0, // 鼠标的x位置
      mousePositionY: 0, // 鼠标的y位置
    };
  },
  computed: {
    // 标尺的左边移动距离
    rulerLeft() {
      return (
        -(this.scrollLeft - this.originScrollLeft + this.boardWidth / 2) +
        this.originLeft
      );
    },
    // 标尺的顶部移动距离
    rulerTop() {
      return (
        -(this.scrollTop - this.originScrollTop + this.boardHeight / 2) +
        this.originTop
      );
    },
  },
  mounted() {
    const drawingBox = this.$refs.drawingBox;
    const canvasWidth = drawingBox.offsetWidth;
    const canvasHeight = drawingBox.offsetHeight;
    // 整个画板居中
    drawingBox.scrollTop = this.boardHeight / 2 - canvasHeight / 2;
    drawingBox.scrollLeft = this.boardWidth / 2 - canvasWidth / 2;
    // 缓存居中的位移距离
    this.originScrollLeft = drawingBox.scrollLeft;
    this.originScrollTop = drawingBox.scrollTop;
    // 初始嵌页
    this.iframeTop = drawingBox.scrollTop + this.originTop;
    this.iframeLeft = drawingBox.scrollLeft + this.originLeft;
  },
  methods: {
    // 滚动方法
    scroll(event) {
      this.scrollTop = event.target.scrollTop;
      this.scrollLeft = event.target.scrollLeft;
    },
    // 重置滚动
    resetScroll() {
      const drawingBox = this.$refs.drawingBox;
      drawingBox.scrollLeft = this.originScrollLeft;
      drawingBox.scrollTop = this.originScrollTop;
    },
    // 移动罩子鼠标按下
    moveMaskMousedown(event) {
      this.canMoveCanvas = true;
      this.moveStartX = event.clientX;
      this.moveStartY = event.clientY;
      this.bufferScrollTop = this.scrollTop;
      this.bufferScrollLeft = this.scrollLeft;
    },
    // 移动罩子鼠标移动
    moveMaskMousemove(event) {
      if (this.canMoveCanvas) {
        const moveX = event.clientX - this.moveStartX;
        const moveY = event.clientY - this.moveStartY;
        const drawingBox = this.$refs.drawingBox;
        drawingBox.scrollLeft = this.bufferScrollLeft - moveX;
        drawingBox.scrollTop = this.bufferScrollTop - moveY;
      }
    },
    // 移动罩子鼠标抬起
    moveMaskMouseup() {
      this.canMoveCanvas = false;
    },
    // 编辑器鼠标进入
    editorCanvasMouseenter() {
      this.showMousePosition = true;
      this.setKeyboardJS();
    },
    // 编辑器鼠标移动
    editorCanvasMousemove(event) {
      const editorCanvas = this.$refs["editorCanvas-container"];
      this.mousePositionX = event.clientX - editorCanvas.offsetLeft;
      this.mousePositionY = event.clientY - editorCanvas.offsetTop;
    },
    // 编辑器鼠标移出
    editorCanvasMouseleave() {
      this.showMousePosition = false;
    },
  },
};
</script>

<style lang="less" scoped>
.editorCanvas-container {
  .boxSetting(calc(100% - 640px), 100%);
  position: relative;
  overflow: hidden;
  outline: none;
  > .canvas-drawing-box {
    .boxSetting();
    .absolutePosition();
    overflow: auto;
    > .editorCanvas-drawingBoard {
      .boxSetting(3000px, 3000px);
      > .editorCanvas-iframe {
        // background: pink;
        .absolutePosition();
      }
    }
  }
  > .canvas-move-mask {
    .boxSetting();
    .fixedPosition();
    // background: pink;
  }
}
</style>
