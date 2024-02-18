<template>
  <div class="AmbientLight-container">
    <de-collapse-layout
      label="设置"
      icon="#iconshezhi"
      arrow-position="left"
    >
      <template #container>
        <de-controller-picker
          v-model="config.color"
          label="颜色"
          :animation="{
            target: config.vid,
            attribute: 'color',
          }"
        />
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
        <de-controller-number
          v-model="config.width"
          :keyframe="false"
          label="宽度"
          :step="1"
          :drag-multply="5"
          :min="0"
        />
        <de-controller-number
          v-model="config.height"
          :keyframe="false"
          label="高度"
          :step="1"
          :drag-multply="5"
          :min="0"
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
