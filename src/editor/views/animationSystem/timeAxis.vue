<template>
  <div class="timeAxis-conatainer">
    <div class="timeAxis-keyframe-list" @click="jumpTime">
      <div
        class="timeAxis-keyframe"
        v-for="(item, index) in timeKeyframeList"
        :key="index"
        :style="{ left: `${item.position}%` }"
      >
        <div class="time" v-text="item.text"></div>
        <div class="axis">|</div>
      </div>
    </div>
    <div
      class="timeAxis-pointer"
      :style="{ left: `${pointerPosition}%` }"
      @mousedown="pointerMousedown"
    >
      <div class="pointer-header">
        <vis-icon code="#iconzhencopy" color="yellow"></vis-icon>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    exactWidth: {
      // 可视区域的总长px
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      visualMaxTimeQuantum: 24, // 最大可视段数
      timeKeyframeList: [],
      timer: "",
      bufferCurrentFrame: 0,
      canMove: true,
    };
  },
  computed: {
    trackWidth() {
      return this.$store.getters["animation/trackWidth"];
    },
    fps() {
      return this.$store.getters["animation/fps"];
    },
    totalDuration() {
      return this.$store.getters["animation/totalDuration"];
    },
    totalFrame() {
      return this.$store.getters["animation/totalFrame"];
    },
    currentFrame() {
      return this.$store.getters["animation/currentFrame"];
    },
    timekeyFrameMultiplyList() {
      const base = [1, 2, 5, 10];
      const list = base.concat([]);
      const fps = this.fps;
      const second = fps;
      const min = fps * 60;
      list.push(second * 0.5);
      base.forEach((bascMultiply) => {
        list.push(bascMultiply * second);
      });
      list.push(min * 0.5);
      base.forEach((bascMultiply) => {
        list.push(bascMultiply * min);
      });
      return list;
    },
    currentMutiply() {
      const timekeyFrameMultiplyList = this.timekeyFrameMultiplyList;
      const totalKeyframeNumber = this.totalDuration * this.fps;
      const exactWidth = this.exactWidth;
      const minTimeKeyframeWidth = this.trackWidth / this.visualMaxTimeQuantum;

      let currentMutiply = 1;
      // 查找适合倍率
      timekeyFrameMultiplyList.some((multiply) => {
        const currentKeyframeNumber = totalKeyframeNumber / multiply;
        const currentKeyframeWidth = exactWidth / currentKeyframeNumber;
        if (currentKeyframeWidth >= minTimeKeyframeWidth) {
          currentMutiply = multiply;
          return true;
        }
      });
      return currentMutiply;
    },
    pointerPosition() {
      return (this.currentFrame / this.totalFrame) * 100;
    },
  },
  methods: {
    pointerMousedown($event) {
      const unitMoveDistance =
        this.exactWidth / (this.totalDuration * this.fps);
      this.bufferCurrentFrame = this.currentFrame;
      const dragFun = (moveEvent) => {
        // 设置鼠标指针
        document.body.style.cursor = "ew-resize";
        if (!this.canMove) {
          return false;
        } else {
          this.timer = setTimeout(() => {
            const moveX = moveEvent.clientX - $event.clientX;
            const moveFrame = Math.floor(moveX / unitMoveDistance);
            const currentFrame = this.bufferCurrentFrame + moveFrame;
            if (currentFrame !== this.currentFrame) {
              this.$store.commit("animation/currentFrame", currentFrame);
            }
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
    jumpTime($event) {
      // 获取当下点击位置的时间
      const time = ($event.offsetX / this.exactWidth) * this.totalDuration;
      // 根据fps算出最近的帧时间
      const currentFrame = Math.ceil(time * this.fps) - 1;
      this.$store.commit("animation/currentFrame", currentFrame);
    },
  },
  watch: {
    currentMutiply: {
      handler(newValue, oldValue) {
        if (newValue !== oldValue) {
          const fps = this.fps;
          const currentMutiply = this.currentMutiply;
          const totalKeyframeNumber = this.totalDuration * this.fps;
          // 生成列表
          const currentKeyframeNumber = Math.floor(
            totalKeyframeNumber / currentMutiply
          );
          const list = [];
          const getText = (number) => {
            const secondNumber = fps;
            const minNumber = fps * 60;
            const hourNumber = minNumber * 60;
            let unit = "";
            // let fatherUnit = ''
            let value = "";
            let fatherValue = "";
            if (currentMutiply < secondNumber) {
              unit = "f";
              // fatherUnit = 's'
              fatherValue = Math.floor(number / secondNumber);
              value = number - fatherValue * secondNumber;
            } else if (currentMutiply < minNumber) {
              unit = "s";
              // fatherUnit = 'm'
              fatherValue = Math.floor(number / minNumber);
              value = (number - fatherValue * minNumber) / secondNumber;
            } else if (currentMutiply < hourNumber) {
              unit = "m";
              // fatherUnit = 'h'
              fatherValue = Math.floor(number / hourNumber);
              value = (number - fatherValue * hourNumber) / minNumber;
            }
            return `${fatherValue ? fatherValue + ":" : "0:"}${
              value || 0
            }${unit}`;
          };
          for (let i = 0; i <= currentKeyframeNumber; i += 1) {
            list.push({
              position: (i / currentKeyframeNumber) * 100,
              text: getText(i * currentMutiply),
              keyframe: i * currentMutiply,
            });
          }
          this.timeKeyframeList = list;
        }
      },
      immediate: true,
    },
  },
  created() {
    this.bufferCurrentFrame = this.currentFrame;
  },
};
</script>

<style lang="less" scoped>
.timeAxis-conatainer {
  .boxSetting(100%, 20px);
  margin-bottom: 2px;
  background: @theme-backgroundColor;
  > .timeAxis-keyframe-list {
    background: @theme-backgroundColor;
    cursor: pointer;
    .boxSetting(100%, 20px);
    position: relative;
    .flexLayout();
    margin-bottom: 2px;
    > .timeAxis-keyframe {
      .boxSetting(30px);
      .flexLayout(column, center, center);
      font-size: 12px;
      transform: translateX(-14.5px);
      .absolutePosition();
      pointer-events: none;
      > .axis {
        height: 50%;
        overflow: hidden;
      }
    }
  }
  > .timeAxis-pointer {
    .absolutePosition();
    width: 1px;
    height: 100%;
    background: red;
    z-index: 2;
    cursor: ew-resize;
    > .pointer-header {
      > .icon-container {
        .absolutePosition(6px, unset, unset, -7px);
      }
    }
    > .pointer-mask {
      .boxSetting();
      .fixedPosition();
      z-index: 1;
      cursor: ew-resize;
      // background:pink;
    }
  }
}
</style>
