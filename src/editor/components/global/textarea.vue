<template>
  <control-layout
    :keyframe="keyframe"
    :label="label"
  >
    <template #controller>
      <div class="textarea-controller">
        <el-input
          v-model="inputValue"
          size="mini"
          :disabled="disabled"
          :autosize="{ minRows: minRows, maxRows: minRows }"
        />
      </div>
    </template>
  </control-layout>
</template>

<script>
import controlLayout from "./controlLayout.vue";
export default {
  name: "DeControllerTextarea",
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
    minRows: {
      type: Number,
      default: 3,
    },
    maxRows: {
      type: Number,
      default: 6,
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
.textarea-controller {
  .flexLayout(row, space-between, center);
  > .el-input {
    margin-right: (@box-margin / 2);
  }
}
</style>
