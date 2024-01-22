<template>
  <control-layout
    :keyframe="keyframe"
    :label="label"
    :animation="animation"
    @clickWatch="clickWatch"
  >
    <template #controller>
      <div class="switch-controller">
        <el-switch v-model="inputValue" size="mini"></el-switch>
      </div>
    </template>
  </control-layout>
</template>

<script>
import controlLayout from "./controlLayout.vue";
import { InterpolateDiscrete } from "three";
export default {
  name: "de-controller-switch",
  components: {
    controlLayout,
  },
  props: {
    keyframe: {
      // 是否展示k帧
      type: Boolean,
      default: true,
    },
    animation: {
      // 动画设置
      type: Object,
    },
    label: {
      // 标题
      type: String,
      default: "标签",
    },
    value: null,
  },
  data() {
    return {
      type: "boolean",
    };
  },
  computed: {
    inputValue: {
      get() {
        return this.value;
      },
      set(value) {
        this.applyKeyframe(value);
        this.$emit("input", value);
      },
    },
  },
  methods: {
    // 添加关键帧
    applyKeyframe(value) {
      if (this.active) {
        const animation = this.animation;
        this.$store.commit("animationTrack/setKeyframe", {
          vid: animation.target,
          attribute: animation.attribute,
          frame: this.currentFrame,
          value,
        });
      }
    },
    clickWatch(value) {
      const animation = this.animation;
      if (!value) {
        this.$store.commit("animationTrack/remove", {
          vid: animation.target.vid,
          attribute: animation.attribute,
        });
      } else {
        this.$store.commit("animationTrack/registerFrame", {
          vid: animation.target.vid,
          attribute: animation.attribute,
          config: {
            name: this.label,
            interpolate: InterpolateDiscrete,
            type: this.type,
          },
          value: this.value,
        });
      }
      this.active = value;
    },
  },
};
</script>

<style lang="less" scoped>
.switch-controller {
  .flexLayout(row, flex-end, center);
}
</style>
