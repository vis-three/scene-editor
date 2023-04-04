<template>
  <div class="booleanModifier-container">
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
      label="目标"
      :options="objects"
      v-model="config.target"
    ></de-controller-select>
    <de-controller-select
      :keyframe="false"
      label="模式"
      :options="modeOptions"
      v-model="config.mode"
    ></de-controller-select>
  </div>
</template>

<script>
import { OBJECTMODULE } from "@vis-three/middleware";

export default {
  props: {
    config: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      modeOptions: [
        {
          lable: "相减",
          value: "subtract",
        },
        {
          lable: "相交",
          value: "union",
        },
        {
          lable: "相加",
          value: "intersect",
        },
      ],
    };
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
  },
};
</script>

<style lang="less" scoped></style>
