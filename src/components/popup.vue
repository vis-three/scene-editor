<template>
  <transition
    enter-active-class="animate__animated animate__fadeIn animate__fast"
    leave-active-class="animate__animated animate__fadeOut animate__fast"
  >
    <div class="vis-popup-container" v-show="value">
      <div
        ref="main"
        class="popup-main"
        :style="{
          width: width,
          height: height,
          minWidth: minWidth,
          minHeight: minHeight,
          marginLeft: `${-marginLeft}px`,
          marginTop: `${-marginTop}px`,
          padding: padding ? '10px' : '',
        }"
      >
        <div class="close-button" v-if="showClose" @click="close">
          <vis-icon code="#iconguanbi"></vis-icon>
        </div>

        <slot name="main">
          <div class="popup-header">
            <slot name="header">
              <div
                class="title"
                :style="{ fontSize: fontSize }"
                v-text="title"
              ></div>
            </slot>
          </div>

          <div class="popup-container">
            <slot name="container"></slot>
          </div>

          <div class="popup-footer">
            <slot name="footer"></slot>
          </div>
        </slot>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "vis-popup",
  props: {
    // 标题
    title: {
      type: String,
      default: "vis-popup弹窗",
    },
    // 标题字体大小
    fontSize: {
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
    // 宽
    width: {
      type: String,
      default: "30%",
    },
    // 高
    height: {
      type: String,
      default: "30%",
    },
    // 宽
    minWidth: {
      type: String,
    },
    // 高
    minHeight: {
      type: String,
    },
    showClose: {
      type: Boolean,
      default: true,
    },
    value: {
      type: Boolean,
      default: false,
    },
    padding: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      marginLeft: 0,
      marginTop: 0,
    };
  },
  methods: {
    cacleCenter() {
      const mainDom = this.$refs.main;
      this.marginLeft = mainDom.offsetWidth / 2;
      this.marginTop = mainDom.offsetHeight / 2;
    },

    close() {
      this.$emit("close");
      this.$emit("input", false);
    },
  },
  watch: {
    value: {
      handler(newValue) {
        if (newValue) {
          this.$nextTick(() => {
            this.cacleCenter();
          });
        }
      },
      immediate: true,
    },
  },
  mounted() {
    document.addEventListener("onresize", this.cacleCenter);
  },

  beforeDestroy() {
    document.removeEventListener("onresize", this.cacleCenter);
  },
};
</script>

<style lang="less">
.vis-popup-container {
  .fixedPosition();
  .boxSetting();
  background: fade(@darkerTheme-backgroundColor, 60);

  .close-button {
    .absolutePosition(@box-padding, @box-padding, unset, unset);
    .transitionSetting({transform: rotate(90deg) ;});
    cursor: pointer;
  }

  .popup-main {
    background: @theme-backgroundColor;
    border-radius: 5px;
    .absolutePosition(50%, unset, unset, 50%);
    .flexLayout(column);
    overflow: hidden;
    .popup-header {
      .flexLayout(row, center, center);
      width: 100%;
      margin-bottom: @box-margin;
      .title {
        font-size: @title-fontSize;
      }
    }

    .popup-container {
      width: 100%;
      flex: 1;
      margin-bottom: @box-margin;
    }

    .popup-footer {
      width: 100%;
    }
  }
}
</style>
