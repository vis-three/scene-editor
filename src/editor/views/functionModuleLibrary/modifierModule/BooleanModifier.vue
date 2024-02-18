<template>
  <div class="booleanModifier-container">
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
      v-model="config.target"
      :keyframe="false"
      label="目标"
      :options="objects"
    />
    <de-controller-select
      v-model="config.mode"
      :keyframe="false"
      label="模式"
      :options="modeOptions"
    />
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
