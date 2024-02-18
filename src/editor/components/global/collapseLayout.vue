<template>
  <div class="collapseLayout-container">
    <div
      class="collapseLayout-title"
      @click="toggle"
    >
      <vis-icon
        v-if="arrowPosition === 'left'"
        code="#iconjian"
        style="margin-right: 5px"
        :class="{ 'icon-open': !showCollapse }"
      />
      <div class="title-box">
        <vis-icon
          v-if="showIcon"
          :code="icon"
        />
        <span v-text="label" />
        <span
          v-if="subLabel"
          style="color: rgb(100, 100, 100); font-size: 14px"
        >
          &nbsp;-&nbsp;{{ subLabel }}
        </span>
      </div>
      <vis-icon
        v-if="arrowPosition === 'right'"
        code="#iconjian"
        :class="{ 'icon-open': !showCollapse }"
      />
    </div>
    <el-collapse-transition>
      <div
        v-show="showCollapse"
        class="collapseLayout-main"
      >
        <slot name="container" />
      </div>
    </el-collapse-transition>
  </div>
</template>

<script>
export default {
  name: "DeCollapseLayout",
  props: {
    icon: {
      type: String,
      default: "#iconmoxing",
    },
    showIcon: {
      type: Boolean,
      default: true,
    },
    label: {
      type: String,
      default: "折叠面板布局",
    },
    subLabel: {
      type: String,
      default: "",
    },
    fold: {
      // 是否折叠面板
      type: Boolean,
      default: false,
    },
    arrowPosition: {
      type: String,
      default: "right",
    },
  },
  data() {
    return {
      showCollapse: true,
    };
  },
  watch: {
    fold: {
      handler(newValue) {
        this.showCollapse = !newValue;
      },
      immediate: true,
    },
  },
  methods: {
    toggle() {
      this.showCollapse = !this.showCollapse;
      this.$emit("change", this.showCollapse);
    },
  },
};
</script>

<style lang="less" scoped>
.collapseLayout-container {
  .boxSetting(100%, unset);
  margin-bottom: @box-margin;
  padding-right: 0;
  background: @theme-backgroundColor;
  > .collapseLayout-title {
    cursor: pointer;
    .boxSetting(100%);
    padding: @box-padding;
    .flexLayout(row, flex-start, center);
    > .title-box {
      width: calc(100% - 19px);
      .flexLayout(row, flex-start, center);
      span {
        // width: calc(100% - 19px);
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    > .title-box {
      > .icon-container {
        margin-right: 5px;
        .transitionSetting();
      }
      > .icon-container:first-child {
        color: @theme-color;
      }
    }
    > .icon-container {
      color: @placeHolderText-color;
    }
    > .icon-open {
      transform: rotate(-90deg);
    }
  }
  > .collapseLayout-main {
    .flexLayout(row, flex-start, center);
    padding: @box-padding;
    padding-top: unset;
    flex-wrap: wrap;
    overflow: hidden;
  }
}
</style>
