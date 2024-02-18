<template>
  <div class="SSRPass-container">
    <de-collapse-layout
      label="设置"

      icon="#iconshezhi"
      arrow-position="left"
    >
      <template #container>
        <de-controller-switch
          v-model="config.ground"
          :keyframe="false"
          label="地面"
        />
        <de-controller-picker
          v-model="config.groudOption.color"
          :keyframe="false"
          label="地面颜色"
        />
        <de-controller-number
          v-model="config.opacity"
          :keyframe="false"
          label="透明度"
          :step="0.01"
          :drag-multply="3"
          :min="0"
          :max="1"
          :display-accuracy="2"
        />
        <de-controller-number
          v-model="config.maxDistance"
          :keyframe="false"
          label="反射距离"
          :step="0.1"
          :drag-multply="10"
          :min="0"
          :display-accuracy="1"
        />
        <de-controller-select
          v-model="config.selects"
          :keyframe="false"
          label="反射物体"
          :options="objects"
        />
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
