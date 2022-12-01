<template>
  <control-layout
    :keyframe="keyframe"
    :label="label"
    :animation="animation"
    @clickWatch="clickWatch"
  >
    <template #controller>
      <div class="select-controller">
        <el-select
          :value="value"
          size="mini"
          :placeholder="placeholder"
          @change="change"
        >
          <el-option
            v-for="(item, index) in options"
            :key="index"
            :label="item[prop.label]"
            :value="prop.value ? item[prop.value] : item"
          ></el-option>
        </el-select>
      </div>
    </template>
  </control-layout>
</template>

<script>
import controlLayout from "./controlLayout";
import { InterpolateDiscrete } from "three";
export default {
  name: "de-controller-select",
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
    placeholder: {
      type: String,
      default: "请选择",
    },
    prop: {
      // 规定options字段
      type: Object,
      default: () => {
        return {
          label: "label",
          value: "value",
        };
      },
    },
    options: Array, // 选项
    value: null,
  },
  data() {
    return {};
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
    change(value) {
      this.inputValue = value;
    },
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
            interpolate: InterpolateDiscrete,
            type: animation.type || "string",
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
.select-controller {
  .flexLayout(row, flex-end, center);
  .el-select {
    width: 100%;
  }
}
</style>
