<template>
  <div class="AmbientLight-container">
    <de-collapse-layout
      label="设置"
      icon="#iconshezhi"
      arrow-position="left"
    >
      <template #container>
        <de-controller-number
          v-model="config.intensity"
          label="亮度"
          :step="0.1"
          :drag-multply="10"
          :min="0"
          :display-accuracy="1"
          :animation="{
            target: config.vid,
            attribute: 'intensity',
          }"
        />
        <de-controller-picker
          v-model="config.color"
          label="天空颜色"
          :animation="{
            target: config.vid,
            attribute: 'color',
          }"
        />
        <de-controller-picker
          v-model="config.groundColor"
          label="地面颜色"
          :animation="{
            target: config.vid,
            attribute: 'groundColor',
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
};
</script>

<style lang="less" scoped></style>
