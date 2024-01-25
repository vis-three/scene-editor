<template>
  <div class="viewTrack-container">
    <div class="viewTrack-track">
      <div
        class="track-scroll"
        :style="{
          left: `${scrollBarLeft}%`,
          width: `${scrollBarWidth}%`,
        }"
      >
        <div class="scroll-arrow" @mousedown="stretchLeft"></div>
        <div class="scroll-bar" @mousedown="scrollTrack"></div>
        <div class="scroll-arrow" @mousedown="stretchRight"></div>
      </div>
    </div>
    <div class="viewTrack-veiw">
      <div
        class="viewTrack-exact"
        :style="{
          width: `${exactWidth}px`,
          left: `${exactOffset}px`,
        }"
      >
        <div class="viewTrack-exact-slot">
          <slot :exactWidth="exactWidth"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    const scrollBarWidth = 100;
    const scrollBarLeft = 0;
    return {
      scrollBarLeft,
      scrollBarWidth,
      bufferScrollLeft: scrollBarLeft,
      bufferScrollWidth: scrollBarWidth,
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
    trackWidth() {
      return this.$store.getters["animation/trackWidth"];
    },
    exactWidth() {
      return (this.trackWidth - 20) / (this.scrollBarWidth / 100);
    },
    exactOffset() {
      return (-this.exactWidth * this.scrollBarLeft) / 100;
    },
  },
  methods: {
    checkScrollWidth() {
      const min = (20 / this.trackWidth) * 100;
      const max = 100 - this.scrollBarLeft;
      if (this.scrollBarWidth < min) {
        this.scrollBarWidth = min;
      } else if (this.scrollBarWidth > max) {
        this.scrollBarWidth = max;
      }
    },

    checkOffset() {
      const min = 0;
      const max = 100 - this.scrollBarWidth;
      if (this.scrollBarLeft < min) {
        this.scrollBarLeft = min;
      } else if (this.scrollBarLeft > max) {
        this.scrollBarLeft = max;
      }
    },

    stretchLeft($event) {
      const dragFun = (moveEvent) => {
        // 设置鼠标指针
        document.body.style.cursor = "ew-resize";
        if (!this.stretchLeftCanMove) {
          return false;
        } else {
          this.stretchLeftTimer = setTimeout(() => {
            const moveX = moveEvent.clientX - $event.clientX;
            this.scrollBarLeft =
              this.bufferScrollLeft + (moveX / this.trackWidth) * 100;
            this.checkOffset();
            this.scrollBarWidth =
              this.bufferScrollWidth - (moveX / this.trackWidth) * 100;
            this.checkScrollWidth();
            this.stretchLeftTimer = true;
          }, this.throttleTime);
        }
      };
      const removeFun = () => {
        document.body.style.cursor = "default";
        this.bufferScrollWidth = this.scrollBarWidth;
        this.bufferScrollLeft = this.scrollBarLeft;
        document.removeEventListener("mousemove", dragFun);
        document.removeEventListener("mouseup", removeFun);
      };

      document.addEventListener("mousemove", dragFun);
      document.addEventListener("mouseup", removeFun);
    },
    stretchRight($event) {
      const dragFun = (moveEvent) => {
        // 设置鼠标指针
        document.body.style.cursor = "ew-resize";
        if (!this.stretchRightCanMove) {
          return false;
        } else {
          this.stretchRightTimer = setTimeout(() => {
            const moveX = moveEvent.clientX - $event.clientX;
            this.scrollBarWidth =
              this.bufferScrollWidth + (moveX / this.trackWidth) * 100;
            this.checkScrollWidth();

            this.stretchRightTimer = true;
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
      const dragFun = (moveEvent) => {
        // 设置鼠标指针
        document.body.style.cursor = "pointer";
        if (!this.scrollCanMove) {
          return false;
        } else {
          this.scrollTimer = setTimeout(() => {
            const moveX = moveEvent.clientX - $event.clientX;
            // const moveY = moveEvent.clientY - $event.clientY
            this.scrollBarLeft =
              this.bufferScrollLeft + (moveX / this.trackWidth) * 100;
            this.checkOffset();
            this.scrollTimer = true;
          }, this.throttleTime);
        }
      };
      const removeFun = () => {
        document.body.style.cursor = "default";
        this.bufferScrollLeft = this.scrollBarLeft;
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
@trackHeight: 5px;
.viewTrack-container {
  .boxSetting();
  > .viewTrack-track {
    .boxSetting(100%, @trackHeight);
    background-color: @darkestTheme-backgroundColor;
    position: relative;
    > .track-scroll {
      .boxSetting();
      .flexLayout();
      .absolutePosition();
      > .scroll-arrow {
        .boxSetting(@safeDistant);
        background: @theme-color;
        cursor: ew-resize;
        position: relative;
        &::after {
          position: absolute;
          content: "";
          height: 3px;
          width: 2px;
          top: 1px;
          left: 2px;
          background-color: @darkestTheme-backgroundColor;
        }
        &::before {
          position: absolute;
          content: "";
          height: 3px;
          width: 2px;
          top: 1px;
          right: 2px;
          background-color: @darkestTheme-backgroundColor;
        }
      }
      > .scroll-bar {
        .boxSetting(calc(~"100% - 20px"));
        background-color: @disabledText-color;
        cursor: pointer;
      }
    }
  }
  > .viewTrack-veiw {
    .boxSetting(100%, calc(100% - @trackHeight - @box-padding * 2));
    background: @darkestTheme-backgroundColor;
    position: relative;
    border-left: @safeDistant solid transparent;
    border-right: @safeDistant solid transparent;
    > .viewTrack-exact {
      .absolutePosition();
      height: 100%;
      .viewTrack-exact-slot {
        height: 100%;
      }
    }
  }
}
</style>
