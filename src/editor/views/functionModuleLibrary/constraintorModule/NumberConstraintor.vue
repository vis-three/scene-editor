<template>
  <div class="NumberConstraintor-container">
    <de-controller-input
      :keyframe="false"
      label="名称"
      v-model="config.name"
    ></de-controller-input>
    <de-controller-input
      :keyframe="false"
      label="类型"
      v-model="config.type"
      disabled
    ></de-controller-input>
    <de-controller-select
      :keyframe="false"
      label="约束属性"
      :options="targetAttrList"
      listType
      v-model="config.targetAttr"
    ></de-controller-select>
    <de-controller-select
      :keyframe="false"
      label="参照物"
      :options="objects"
      v-model="config.ref"
    ></de-controller-select>
    <de-controller-select
      v-if="config.ref"
      :keyframe="false"
      label="参照属性"
      :options="refAttrList"
      listType
      v-model="config.refAttr"
    ></de-controller-select>
    <de-controller-select
      :keyframe="false"
      label="运算符"
      :options="['+', '-', '*', '/']"
      listType
      v-model="config.offset.operate"
    ></de-controller-select>
    <de-controller-number
      :keyframe="false"
      label="运算量"
      v-model="config.offset.value"
    ></de-controller-number>
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
