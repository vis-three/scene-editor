<template>
  <control-layout
    :keyframe="keyframe"
    :label="label"
  >
    <template #controller>
      <div class="color-controller">
        <el-input
          v-model="inputValue"
          size="mini"
          :disabled="disabled"
        />
      </div>
    </template>
  </control-layout>
</template>

<script>
import controlLayout from "./controlLayout.vue";
export default {
  name: "DeControllerInput",
  components: {
    controlLayout,
  },
  props: {
    keyframe: {
      // 是否展示k帧
      type: Boolean,
      default: false,
    },
    label: {
      // 标题
      type: String,
      default: "标签",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    value: null,
  },
  computed: {
    inputValue: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
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
