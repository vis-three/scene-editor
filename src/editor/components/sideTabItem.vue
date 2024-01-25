<template>
  <div class="sideTabItem-container">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "sideTabItem",
  props: {
    icon: {
      type: String,
    },
    title: {
      type: String,
      default: "默认",
    },
  },
};
</script>

<style lang="less" scoped></style>
