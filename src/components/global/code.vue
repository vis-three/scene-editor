<template>
  <control-layout :keyframe="keyframe" :label="label">
    <template #controller>
      <div class="code-controller">
        <el-button size="mini" type="text" @click="openEditor">
          <vis-icon code="#icondaima" size="18px"></vis-icon>
        </el-button>
      </div>
    </template>
  </control-layout>
</template>

<script>
import controlLayout from "./controlLayout.vue";
import monacoEditor from "../../monaco";
export default {
  name: "de-controller-code",
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
  methods: {
    openEditor() {
      monacoEditor.setValue(this.value).show(true, this.label, {
        confirm: (value) => {
          this.inputValue = value;
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.code-controller {
  .flexLayout(row, space-between, center);
  > .el-button {
    padding: 0;
  }
}
</style>
