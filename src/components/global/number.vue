<template>
  <control-layout
    :keyframe="keyframe"
    :label="label"
    :animation="animation"
    @clickWatch="clickWatch"
  >
    <template #controller>
      <number-controller
        :step="step"
        :dragMultply="dragMultply"
        :min="min"
        :max="max"
        :unit="unit"
        :displayAccuracy="displayAccuracy"
        v-model="inputValue"
      ></number-controller>
    </template>
  </control-layout>
</template>

<script>
import controlLayout from "./controlLayout.vue";
import numberController from "./numberController.vue";
import { InterpolateLinear } from "three";

export default {
  name: "de-controller-number",
  components: {
    controlLayout,
    numberController,
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
    step: {
      // 步长
      type: Number,
      default: 1,
    },
    dragMultply: {
      // 拖拽倍率
      type: Number,
      default: 1,
    },
    min: {
      // 最小值
      type: Number,
      default: -Infinity,
    },
    max: {
      // 最大值
      type: Number,
      default: Infinity,
    },
    unit: {
      // 单位
      type: String,
      default: "",
    },
    // 显示精度
    displayAccuracy: {
      type: Number,
    },
    throttleTime: {
      type: Number,
      default: 1000 / 25,
    },
    value: null,
  },
  data() {
    return {
      type: "number",

      active: false,
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
    currentFrame() {
      return this.$store.getters["animation/currentFrame"];
    },
  },
  methods: {
    // 添加关键帧
    applyKeyframe(value) {
      if (this.active) {
        const animation = this.animation;
        this.$store.commit("keyframeTrack/setKeyframe", {
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
        this.$store.commit("keyframeTrack/remove", {
          vid: animation.target,
          attribute: animation.attribute,
        });
      } else {
        this.$store.commit("keyframeTrack/add", {
          vid: animation.target,
          attribute: animation.attribute,
          config: {
            name: this.label,
            interpolate: animation.interpolate || InterpolateLinear,
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

<style lang="less" scoped></style>
