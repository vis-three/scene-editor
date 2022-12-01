<template>
  <div class="performanceMonitor-container">
    <div
      v-tooltip.top="'性能监视器'"
      class="operate-elem"
      :class="{ 'active-elem ': show }"
      @click="
        () => {
          show = !show;
        }
      "
    >
      <vis-icon size="16px" code="#iconjiankong"></vis-icon>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    connector: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      show: false,
    };
  },
  watch: {
    show: {
      handler(newVal) {
        this.connector.setStats(newVal);
      },
      immediate: true,
    },
  },
};
</script>

<style lang="less" scoped>
.performanceMonitor-container {
  .flexLayout(row, center, center);
  background: @brighterTheme-backgroundColor;
  height: 20px;
  > .operate-elem {
    .flexLayout(row, center, center);
    padding: 0 @box-padding / 2;
    .transitionSetting({
      background: @themeDarkHover-color;
    });
    border-left: 1px solid @darkestTheme-backgroundColor;
    cursor: pointer;
  }
  > .operate-elem:first-child {
    border-left: unset;
  }
  > .active-elem {
    background: @theme-color;
  }
}
</style>
