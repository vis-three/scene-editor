<template>
  <div class="NumberConstraintor-container">
    <de-controller-input
      v-model="config.name"
      :keyframe="false"
      label="名称"
    />
    <de-controller-input
      v-model="config.type"
      :keyframe="false"
      label="类型"
      disabled
    />
    <de-controller-select
      v-model="config.targetAttr"
      :keyframe="false"
      label="约束属性"
      :options="targetAttrList"
      list-type
    />
    <de-controller-select
      v-model="config.ref"
      :keyframe="false"
      label="参照物"
      :options="objects"
    />
    <de-controller-select
      v-if="config.ref"
      v-model="config.refAttr"
      :keyframe="false"
      label="参照属性"
      :options="refAttrList"
      list-type
    />
    <de-controller-select
      v-model="config.offset.operate"
      :keyframe="false"
      label="运算符"
      :options="['+', '-', '*', '/']"
      list-type
    />
    <de-controller-number
      v-model="config.offset.value"
      :keyframe="false"
      label="运算量"
    />
  </div>
</template>

<script>
import Tool from "@/editor/assets/js/tool.js";
import { CONFIGTYPE, OBJECTMODULE } from "@vis-three/middleware";
import { engine } from "../../../assets/js/vis";

export default {
  props: {
    config: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    objects() {
      const objectList = Object.keys(OBJECTMODULE).map(
        (module) => this.$store.getters[`${module}/get`]
      );

      const list = [];

      for (const map of objectList) {
        for (const config of Object.values(map)) {
          list.push({
            label: config.name,
            value: config.vid,
          });
        }
      }
      return list;
    },
    targetAttrList() {
      return Tool.getObjectAttrList(
        engine.getConfigBySymbol(this.config.target)
      );
    },

    refAttrList() {
      return Tool.getObjectAttrList(engine.getConfigBySymbol(this.config.ref));
    },
  },
};
</script>

<style lang="less" scoped></style>
