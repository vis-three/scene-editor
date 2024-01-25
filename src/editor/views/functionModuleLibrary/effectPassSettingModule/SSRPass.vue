<template>
  <div class="SSRPass-container">
    <de-collapse-layout
      label="设置"

      icon="#iconshezhi"
      arrowPosition="left"
    >
      <template #container>
        <de-controller-switch
          :keyframe="false"
          label="地面"
          v-model="config.ground"
        ></de-controller-switch>
        <de-controller-picker
          :keyframe="false"
          label="地面颜色"
          v-model="config.groudOption.color"
        ></de-controller-picker>
        <de-controller-number
          :keyframe="false"
          label="透明度"
          :step="0.01"
          :dragMultply="3"
          :min="0"
          :max="1"
          :displayAccuracy="2"
          v-model="config.opacity"
        ></de-controller-number>
        <de-controller-number
          :keyframe="false"
          label="反射距离"
          :step="0.1"
          :dragMultply="10"
          :min="0"
          :displayAccuracy="1"
          v-model="config.maxDistance"
        ></de-controller-number>
        <de-controller-select
          :keyframe="false"
          label="反射物体"
          :options="objects"
          v-model="config.selects"
        ></de-controller-select>
      </template>
    </de-collapse-layout>
  </div>
</template>

<script>
import { CONFIGTYPE, OBJECTMODULE } from "@vis-three/middleware";

export default {
  props: {
    config: {
      type: Object,
      required: true,
    },
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
