<template>
  <div class="PathTubeGeometry-container">
    <de-collapse-layout
      label="形状"
      icon="#iconjichubianhuan"
      arrow-position="left"
    >
      <template #container>
        <de-controller-select
          v-model="config.path"
          :keyframe="false"
          label="路径"
          :options="pathList"
          :prop="{
            label: 'name',
            value: 'vid',
          }"
        />
        <de-controller-number
          v-model="config.radius"
          :keyframe="false"
          label="半径"
          :step="0.1"
          :min="0"
        ></de-controller-number>
        <de-controller-number
          v-model="config.tubularSegments"
          :keyframe="false"
          label="管道分段"
          :step="1"
          :min="0"
        ></de-controller-number>
        <de-controller-number
          v-model="config.radialSegments"
          :keyframe="false"
          label="半径分段"
          :step="1"
          :min="0"
        ></de-controller-number>
        <de-controller-switch
          v-model="config.closed"
          :keyframe="false"
          label="头尾合并"
        />
      </template>
    </de-collapse-layout>
  </div>
</template>

<script>
import { CONFIGTYPE } from "@vis-three/middleware";

export default {
  props: {
    config: {
      type: Object,
      required: true,
    },
  },
  computed: {
    pathList() {
      return this.$store.getters["path/list"].filter(
        (config) => config.type === CONFIGTYPE.PATH3,
      );
    },
  },
};
</script>

<style lang="less" scoped></style>
