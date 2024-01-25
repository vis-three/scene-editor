<template>
  <div
    class="icon-container"
    :style="{
      'font-size': size,
      color: color,
    }"
  >
    <svg class="icon" aria-hidden="true">
      <use :xlink:href="code"></use>
    </svg>
  </div>
</template>

<script>
export default {
  name: "vis-icon",
  props: {
    // 图标code
    code: {
      type: String,
    },
    // 图标大小
    size: {
      type: String,
    },
    // 图标颜色
    color: {
      type: String,
    },
  },
  data() {
    return {};
  },
  mounted() {},
  beforeDestroy() {},
};
</script>

<style lang="less">
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
.icon-container {
  display: inline-block;
}
</style>
