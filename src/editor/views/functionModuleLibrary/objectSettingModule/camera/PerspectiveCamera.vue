<template>
  <div class="VisPerspectiveCamera-container">
    <de-collapse-layout label="设置" icon="#iconshezhi" arrowPosition="left">
      <template #container>
        <de-controller-switch
          :keyframe="false"
          label="跟随窗口"
          v-model="config.adaptiveWindow"
        ></de-controller-switch>
        <de-controller-number
          label="近截面"
          :step="1"
          :dragMultply="3"
          :min="0"
          :displayAccuracy="0"
          :animation="{
            target: config.vid,
            attribute: 'near',
          }"
          v-model="config.near"
        ></de-controller-number>
        <de-controller-number
          label="远截面"
          :step="1"
          :dragMultply="3"
          :min="0"
          :displayAccuracy="0"
          :animation="{
            target: config.vid,
            attribute: 'far',
          }"
          v-model="config.far"
        ></de-controller-number>
        <de-controller-number
          label="视野角度"
          :step="1"
          :dragMultply="3"
          :min="0"
          :max="179"
          unit="°"
          :displayAccuracy="0"
          :animation="{
            target: config.vid,
            attribute: 'fov',
          }"
          v-model="config.fov"
        ></de-controller-number>
        <de-controller-number
          label="视野比例"
          :step="0.1"
          :dragMultply="3"
          :min="0"
          :displayAccuracy="2"
          :animation="{
            target: config.vid,
            attribute: 'aspect',
          }"
          v-if="!config.adaptiveWindow"
          v-model="config.aspect"
        ></de-controller-number>
      </template>
    </de-collapse-layout>
  </div>
</template>

<script>
export default {
  props: {
    config: {
      type: Object,
      required: true,
    },
  },
  computed: {},
};
</script>

<style lang="less" scoped></style>
