<template>
  <div class="VisPerspectiveCamera-container">
    <de-collapse-layout
      label="设置"
      icon="#iconshezhi"
      arrow-position="left"
    >
      <template #container>
        <de-controller-switch
          v-model="config.adaptiveWindow"
          :keyframe="false"
          label="跟随窗口"
        />
        <de-controller-number
          v-model="config.near"
          label="近截面"
          :step="1"
          :drag-multply="3"
          :min="0"
          :display-accuracy="0"
          :animation="{
            target: config.vid,
            attribute: 'near',
          }"
        />
        <de-controller-number
          v-model="config.far"
          label="远截面"
          :step="1"
          :drag-multply="3"
          :min="0"
          :display-accuracy="0"
          :animation="{
            target: config.vid,
            attribute: 'far',
          }"
        />
        <de-controller-number
          v-model="config.fov"
          label="视野角度"
          :step="1"
          :drag-multply="3"
          :min="0"
          :max="179"
          unit="°"
          :display-accuracy="0"
          :animation="{
            target: config.vid,
            attribute: 'fov',
          }"
        />
        <de-controller-number
          v-if="!config.adaptiveWindow"
          v-model="config.aspect"
          label="视野比例"
          :step="0.1"
          :drag-multply="3"
          :min="0"
          :display-accuracy="2"
          :animation="{
            target: config.vid,
            attribute: 'aspect',
          }"
        />
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
