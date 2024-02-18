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
          :filterable="filterable"
          :multiple="multiple"
          @change="change"
        >
          <el-option
            v-for="(item, index) in options"
            :key="index"
            :label="listType ? item : item[prop.label]"
            :value="listType ? item : prop.value ? item[prop.value] : item"
          />
        </el-select>
      </div>
    </template>
  </control-layout>
</template>

<script>
import controlLayout from "./controlLayout.vue";
import { InterpolateDiscrete } from "three";
export default {
  name: "DeControllerSelect",
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
    filterable: {
      type: Boolean,
      default: true,
    },
    multiple: {
      type: Boolean,
      default: false,
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
    listType: {
      type: Boolean,
      default: false,
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
      if (Array.isArray(value)) {
        this.value.splice(0, this.value.length);
        this.value.push(...value);
      } else {
        this.inputValue = value;
      }
    },
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
