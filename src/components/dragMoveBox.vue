<template>
  <div
    class="dragMoveBox-container"
    :style="{
      top: top,
      left: left,
      bottom: bottom,
      right: right
    }"
    @mousedown.stop="dragStart"
  >
    <slot name="main">拖拽移动盒子</slot>
  </div>
</template>

<script>
export default {
  props: {
    offsetX: {
      type: Number,
      default: 0
    },
    offsetY: {
      type: Number,
      default: 0
    },
    throttleTime: {
      // 节流时间
      type: Number, // ms
      default: 1000 / 30
    },
    isBottom: {
      type: Boolean,
      default: false
    },
    isRight: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      useOffsetX: "",
      useOffsetY: "",
      bufferOffsetX: "",
      bufferOffsetY: "",
      timer: "",
      canMove: true
    };
  },
  computed: {
    top() {
      return this.isBottom ? "unset" : `${this.useOffsetY}px`;
    },
    bottom() {
      return !this.isBottom ? "unset" : `${this.useOffsetY}px`;
    },
    left() {
      return this.isRight ? "unset" : `${this.useOffsetX}px`;
    },
    right() {
      return !this.isRight ? "unset" : `${this.useOffsetX}px`;
    }
  },
  watch: {
    offsetX: {
      handler(newVal) {
        this.useOffsetX = newVal;
        this.bufferOffsetX = newVal;
      },
      immediate: true
    },
    offsetY: {
      handler(newVal) {
        this.useOffsetY = newVal;
        this.bufferOffsetY = newVal;
      },
      immediate: true
    }
  },
  methods: {
    // 拖动开始
    dragStart($event) {
      const dragFun = moveEvent => {
        // 设置鼠标指针
        document.body.style.cursor = "move";

        if (!this.canMove) {
          return false;
        } else {
          this.timer = setTimeout(() => {
            const moveX = moveEvent.clientX - $event.clientX;
            const moveY = moveEvent.clientY - $event.clientY;
            console.log(moveX, moveY);
            this.useOffsetX = this.bufferOffsetX + moveX;
            this.useOffsetY = this.bufferOffsetY - moveY;

            this.$emit("draging");

            this.canMove = true;
          }, this.throttleTime);
        }
      };
      const removeFun = () => {
        document.body.style.cursor = "default";
        this.$emit("draged");
        this.bufferOffsetX = this.useOffsetX;
        this.bufferOffsetY = this.useOffsetY;
        console.log(this.bufferOffsetX, this.bufferOffsetY);
        document.removeEventListener("mousemove", dragFun);
        document.removeEventListener("mouseup", removeFun);
      };

      document.addEventListener("mousemove", dragFun);
      document.addEventListener("mouseup", removeFun);
    }
  },
  mounted() {
    // TODO: 遮罩， 递归寻找父级absolute确定拖拽范围
  }
};
</script>

<style lang="less" scoped>
.dragMoveBox-container {
  .absolutePosition();
}
</style>
