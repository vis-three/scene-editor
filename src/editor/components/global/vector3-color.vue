<template>
  <control-layout
    :keyframe="keyframe"
    :label="label"
    :animation="animation"
    @clickWatch="clickWatch"
  >
    <template #controller>
      <div class="color-controller">
        <el-input v-model="inputValue" size="mini" />
        <el-color-picker
          v-model="inputValue"
          size="mini"
          :show-alpha="showAlpha"
          :color-format="colorFormat"
        />
      </div>
    </template>
  </control-layout>
</template>

<script>
import controlLayout from "./controlLayout.vue";
import { InterpolateLinear } from "three";
// import { Photoshop } from 'vue-color'
export default {
  name: "DeControllerVector3Color",
  components: {
    controlLayout,
    // 'photoshop-picker': Photoshop
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
    colorFormat: {
      // 色彩格式
      type: String,
      default: "rgb",
    },
    showAlpha: {
      // 展示透明度
      type: Boolean,
      default: false,
    },
    value: null,
  },
  data() {
    return {
      type: "color", // 数据类型
      active: false, // 是否激活
    };
  },
  computed: {
    inputValue: {
      get() {
        return `rgb(${Math.round(this.value.r * 255)}, ${Math.round(
          this.value.g * 255,
        )},${Math.round(this.value.b * 255)})`;
      },
      set(value) {
        this.applyKeyframe(value);
        const color = value
          .slice(4, -1)
          .split(",")
          .map((c) => Number(c.trim()) / 255);
        this.value.r = color[0];
        this.value.g = color[1];
        this.value.b = color[2];

        this.$emit("input", this.value);
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

<style lang="less" scoped>
.color-controller {
  .flexLayout(row, space-between, center);
  > .el-input {
    margin-right: (@box-margin / 2);
  }
}
</style>
