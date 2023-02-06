<template>
  <div
    class="positionLayoutBox-container"
    :style="{
      top: top,
      left: left,
      right: right,
      bottom: bottom,
    }"
  >
    <slot name="main">布局盒子</slot>
  </div>
</template>

<script>
export default {
  props: {
    offsetX: {
      type: Number,
      default: 0,
    },
    offsetY: {
      type: Number,
      default: 0,
    },
    isBottom: {
      type: Boolean,
      default: false,
    },
    isRight: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    top() {
      return this.isBottom ? "unset" : `${this.offsetY}px`;
    },
    bottom() {
      return !this.isBottom ? "unset" : `${this.offsetY}px`;
    },
    left() {
      return this.isRight ? "unset" : `${this.offsetX}px`;
    },
    right() {
      return !this.isRight ? "unset" : `${this.offsetX}px`;
    },
  },
};
</script>

<style lang="less" scoped>
.positionLayoutBox-container {
  position: absolute;
}
</style>
