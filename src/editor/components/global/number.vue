<template>
  <control-layout
    :keyframe="keyframe"
    :label="label"
    :animation="animation"
    @clickWatch="clickWatch"
  >
    <template #controller>
      <number-controller
        v-model="inputValue"
        :step="step"
        :drag-multply="dragMultply"
        :min="min"
        :max="max"
        :unit="unit"
        :display-accuracy="displayAccuracy"
      />
    </template>
  </control-layout>
</template>

<script>
import controlLayout from "./controlLayout.vue";
import numberController from "./numberController.vue";
import { InterpolateLinear } from "three";

export default {
  name: "DeControllerNumber",
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
        this.$store.commit("animationTrack/setKeyframe", {
          vid: animation.target,
          attribute: animation.attribute,
          frame: this.currentFrame,
          value,
        });
      }
    },
    clickWatch(value) {
      if (!this.$store.getters["animationTrack/currentPickup"]) {
        return this.$tool.devTips();
      }
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
