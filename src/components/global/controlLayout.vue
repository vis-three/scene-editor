<template>
  <div class="controlLayout-container">
    <div
      class="config-keyframe"
      :class="{ active: active }"
      v-if="keyframe"
      @click="clickWatch"
    >
      <vis-icon code="#iconziyuan29"></vis-icon>
    </div>
    <div class="config-title" v-text="label"></div>
    <div class="config-component">
      <slot name="controller"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    keyframe: {
      // 是否展示k帧
      type: Boolean,
      default: true,
    },
    animation: {
      type: Object,
    },
    label: {
      // 标题
      type: String,
      default: "标签",
    },
  },
  data() {
    return {
      watcher: "",
    };
  },
  computed: {
    keyframeTrack() {
      return this.$store.getters["keyframeTrack/get"];
    },
    active() {
      if (this.keyframe) {
        const animationObject = this.keyframeTrack[this.animation.target];
        if (animationObject) {
          if (animationObject[this.animation.attribute]) {
            return true;
          }
        }
      }

      return false;
    },
  },
  methods: {
    clickWatch() {
      this.$emit("clickWatch", !this.active);
    },
  },
};
</script>

<style lang="less" scoped>
.controlLayout-container {
  .boxSetting(100%);
  .flexLayout(row, flex-start, center);
  margin-bottom: @box-margin;
  .config-keyframe {
    margin-right: @box-margin;
    cursor: pointer;
    .transitionSetting({color: @themeDarkHover-color;});
  }
  .active {
    color: @theme-color;
  }
  .config-title {
    width: 64px;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-right: @box-margin;
    .transitionSetting({max-width: unset;});
  }
  .config-component {
    width: calc(~"100% - 74px");
  }
}
</style>
