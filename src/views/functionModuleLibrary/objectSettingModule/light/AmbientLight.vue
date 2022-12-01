<template>
  <div class="AmbientLight-container">
    <de-collapse-layout label="设置" icon="#iconshezhi" arrowPosition="left">
      <template #container>
        <de-controller-picker
          label="颜色"
          :animation="{
            target: config.vid,
            attribute: 'color',
          }"
          v-model="config.color"
        ></de-controller-picker>
        <de-controller-number
          label="亮度"
          :step="0.1"
          :dragMultply="10"
          :min="0"
          :displayAccuracy="1"
          :animation="{
            target: config.vid,
            attribute: 'intensity',
          }"
          v-model="config.intensity"
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
};
</script>

<style lang="less" scoped></style>
