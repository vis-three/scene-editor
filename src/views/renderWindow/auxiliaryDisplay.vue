<template>
  <div class="auxiliaryDisplay-container">
    <div
      v-tooltip.top="'坐标'"
      class="auxiliary-elem"
      :class="{ 'active-elem ': showAxes }"
      @click.stop="
        () => {
          showAxes = !showAxes;
        }
      "
    >
      <vis-icon size="16px" code="#iconzuobiaozhou"></vis-icon>
    </div>
    <div
      v-tooltip.top="'网格'"
      class="auxiliary-elem"
      :class="{ 'active-elem ': showGrid }"
      @click.stop="
        () => {
          showGrid = !showGrid;
        }
      "
    >
      <vis-icon size="16px" code="#iconwangge"></vis-icon>
    </div>
    <div
      v-tooltip.top="'辅助'"
      class="auxiliary-elem"
      :class="{ 'active-elem ': showHelper }"
      @click.stop="
        () => {
          showHelper = !showHelper;
        }
      "
    >
      <vis-icon size="16px" code="#iconxiankuang"></vis-icon>
    </div>
    <div
      v-tooltip.top="'控件'"
      class="auxiliary-elem"
      :class="{ 'active-elem ': showTransformControls }"
      @click.stop="
        () => {
          showTransformControls = !showTransformControls;
        }
      "
    >
      <vis-icon size="16px" code="#iconkongjian1"></vis-icon>
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
      showAxes: true,
      showGrid: true,
      showHelper: true,
      showTransformControls: true,
    };
  },
  watch: {
    showAxes: {
      handler(newVal) {
        this.connector.setAxesHelper({ show: newVal });
      },
      immediate: true,
    },
    showGrid: {
      handler(newVal) {
        this.connector.setGridHelper({ show: newVal });
      },
      immediate: true,
    },
    showHelper: {
      handler(newVal) {
        this.connector.setObjectHelper({ show: newVal });
      },
      immediate: true,
    },
    showTransformControls: {
      handler(newVal) {
        this.connector.setTransformControls(newVal);
      },
      // immediate: true,
    },
    // showHelper: {
    //   handler (newVal) {
    //     this.connector.setObjectHelper(newVal)
    //   },
    //   immediate: true
    // }
    // showTransformControls: {
    //   handler (newVal) {
    //     this.connector.setTransformControls(newVal)
    //   },
    //   immediate: true
    // }
  },
};
</script>

<style lang="less" scoped>
.auxiliaryDisplay-container {
  .flexLayout(row, center, center);
  background: @brighterTheme-backgroundColor;
  height: 20px;
  > .auxiliary-elem {
    .flexLayout(row, center, center);
    padding: 0 @box-padding / 2;
    .transitionSetting({
      background: @themeDarkHover-color;
    });
    border-left: 1px solid @darkestTheme-backgroundColor;
    cursor: pointer;
  }
  > .auxiliary-elem:first-child {
    border-left: unset;
  }
  > .active-elem {
    height: 100%;
    background: @theme-color;
  }
}
</style>
