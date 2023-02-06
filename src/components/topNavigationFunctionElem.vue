<template>
  <div class="topNavigationFunctionElem-container">
    <div
      class="elem-button"
      :class="{ active: active }"
      v-tooltip.top="tooltip"
    >
      <slot>
        <vis-icon :code="icon" :size="size"></vis-icon>
      </slot>
    </div>
    <!-- <span class="elem-label" v-text="tooltip"></span> -->
  </div>
</template>

<script>
export default {
  name: "top-navigation-function-elem",
  props: {
    icon: {
      type: String,
      default: "#iconxzhou",
    },
    tooltip: {
      type: String,
      default: "提示",
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      size: "20px",
    };
  },
};
</script>

<style lang="less" scoped>
.topNavigationFunctionElem-container {
  .flexLayout(column, space-between, center);
  > .elem-button {
    .boxSetting(28px, 28px);
    .flexLayout(row, center, center);
    // background: @brighterTheme-backgroundColor;
    overflow: hidden;
    // border: 1px solid @themeDarkHover-color;
    cursor: pointer;
    border-radius: 50%;
    .transitionSetting({color: @themeHover-color;}, {color: @theme-color;});
    transition-duration: 100ms;
  }
  .active {
    color: @theme-color;
  }
  > .elem-label {
    color: @placeHolderText-color;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
