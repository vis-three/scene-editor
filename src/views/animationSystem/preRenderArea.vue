<template>
  <div class="preRenderArea-container">
    <div
      class="preRenderArea-arrow"
      :style="{
        left: arrowLeftOffset,
      }"
      @mousedown="stretchLeft"
    ></div>
    <div
      class="preRenderArea-bar"
      :style="{
        width: `${scrollBarWidth}%`,
        left: `${scrollBarLeft}%`,
      }"
      @mousedown="scrollTrack"
    ></div>
    <div class="preRenderArea-ready-box">
      <div
        class="area-ready"
        :class="{ ready: cacheSignMap[index] }"
        v-for="(item, index) in totalFrame"
        :data-ready="index"
        :key="index"
      ></div>
    </div>
    <div
      class="preRenderArea-arrow"
      :style="{
        left: `${arrowRightOffset}%`,
      }"
      @mousedown="stretchRight"
    ></div>
  </div>
</template>

<script>
export default {
  props: {
    exactWidth: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      bufferRenderStart: "",
      bufferRenderEnd: "",
      bufferScrollFrame: 0,
      throttleTime: 1000 / 30,
      stretchLeftTimer: "",
      stretchLeftCanMove: true,
      stretchRightTimer: "",
      stretchRightCanMove: true,
      scrollTimer: "",
      scrollCanMove: true,
    };
  },
  computed: {
    renderStart() {
      return this.$store.getters["preRenderArea/renderStart"];
    },
    renderEnd() {
      return this.$store.getters["preRenderArea/renderEnd"];
    },
    cacheSignMap() {
      return this.$store.getters["preRenderArea/cacheSignMap"];
    },

    scrollBarLeft() {
      return (this.renderStart / this.totalFrame) * 100;
    },
    scrollBarWidth() {
      return ((this.renderEnd - this.renderStart) / this.totalFrame) * 100;
    },

    arrowLeftOffset() {
      return `calc(${this.scrollBarLeft}% - 10px)`;
    },
    arrowRightOffset() {
      return (this.renderEnd / this.totalFrame) * 100;
    },

    fps() {
      return this.$store.getters["animation/fps"];
    },
    totalFrame() {
      return this.$store.getters["animation/totalFrame"];
    },
    totalDuration() {
      return this.$store.getters["animation/totalDuration"];
    },
  },
  methods: {
    stretchLeft($event) {
      this.bufferRenderStart = this.renderStart;
      const unitMoveDistance =
        this.exactWidth / (this.totalDuration * this.fps);
      const dragFun = (moveEvent) => {
        // 设置鼠标指针
        document.body.style.cursor = "ew-resize";
        if (!this.stretchLeftCanMove) {
          return false;
        } else {
          this.stretchLeftTimer = setTimeout(() => {
            const moveX = moveEvent.clientX - $event.clientX;
            const moveFrame = Math.floor(moveX / unitMoveDistance);
            this.$store.commit(
              "preRenderArea/renderStart",
              this.bufferRenderStart + moveFrame
            );
            this.stretchLeftCanMove = true;
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
    stretchRight($event) {
      this.bufferRenderEnd = this.renderEnd;
      const unitMoveDistance =
        this.exactWidth / (this.totalDuration * this.fps);
      const dragFun = (moveEvent) => {
        // 设置鼠标指针
        document.body.style.cursor = "ew-resize";
        if (!this.stretchRightCanMove) {
          return false;
        } else {
          this.stretchRightTimer = setTimeout(() => {
            const moveX = moveEvent.clientX - $event.clientX;
            const moveFrame = Math.floor(moveX / unitMoveDistance);
            this.$store.commit(
              "preRenderArea/renderEnd",
              this.bufferRenderEnd + moveFrame
            );
            this.stretchRightCanMove = true;
          }, this.throttleTime);
        }
      };
      const removeFun = () => {
        document.body.style.cursor = "default";
        this.bufferScrollWidth = this.scrollBarWidth;
        document.removeEventListener("mousemove", dragFun);
        document.removeEventListener("mouseup", removeFun);
      };

      document.addEventListener("mousemove", dragFun);
      document.addEventListener("mouseup", removeFun);
    },
    scrollTrack($event) {
      this.bufferScrollFrame = 0;
      this.bufferRenderEnd = this.renderEnd;
      this.bufferRenderStart = this.renderStart;
      const unitMoveDistance =
        this.exactWidth / (this.totalDuration * this.fps);
      const dragFun = (moveEvent) => {
        // 设置鼠标指针
        document.body.style.cursor = "pointer";
        if (!this.scrollCanMove) {
          return false;
        } else {
          this.scrollTimer = setTimeout(() => {
            const moveX = moveEvent.clientX - $event.clientX;
            const moveFrame = Math.floor(moveX / unitMoveDistance);
            const direction = moveFrame - this.bufferScrollFrame;
            if (this.renderStart <= 0 && direction < 0) {
              return false;
            }
            if (this.renderEnd >= this.totalFrame && direction > 0) {
              return false;
            }

            this.$store.commit(
              "preRenderArea/renderStart",
              this.bufferRenderStart + moveFrame
            );
            this.$store.commit(
              "preRenderArea/renderEnd",
              this.bufferRenderEnd + moveFrame
            );
            this.bufferScrollFrame = moveFrame;
            this.scrollCanMove = true;
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
@safeDistant: 10px;
.preRenderArea-container {
  .boxSetting(100%, 18px);
  background: @brighterTheme-backgroundColor;
  margin-bottom: 1px;
  position: relative;
  > div {
    height: 100%;
  }
  > .preRenderArea-arrow {
    width: @safeDistant;
    background: @theme-color;
    .absolutePosition();
    z-index: 10;
    cursor: ew-resize;
  }
  > .preRenderArea-bar {
    .absolutePosition();
    background: @disabledText-color;
    cursor: pointer;
  }
  > .preRenderArea-ready-box {
    .absolutePosition(unset, unset, 0, 0);
    .boxSetting(100%, 2px);
    .flexLayout();
    > .area-ready {
      .boxSetting();
    }
    .ready {
      background: fade(@success-color, 70);
    }
  }
}
</style>
