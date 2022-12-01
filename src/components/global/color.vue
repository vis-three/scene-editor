<template>
  <control-layout
    :keyframe="keyframe"
    :label="label"
    :animation="animation"
    @clickWatch="clickWatch"
  >
    <template #controller>
      <div class="color-controller">
        <el-input v-model="inputValue" size="mini"></el-input>
        <el-color-picker
          size="mini"
          v-model="inputValue"
          :show-alpha="showAlpha"
          :color-format="colorFormat"
        ></el-color-picker>
      </div>
    </template>
  </control-layout>
</template>

<script>
import controlLayout from "./controlLayout";
import { InterpolateLinear } from "three";
// import { Photoshop } from 'vue-color'
export default {
  name: "de-controller-picker",
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

<style lang="less" scoped>
.color-controller {
  .flexLayout(row, space-between, center);
  > .el-input {
    margin-right: @box-margin / 2;
  }
}
</style>
