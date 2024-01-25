<template>
  <div class="AmbientLight-container">
    <de-collapse-layout label="设置" icon="#iconshezhi" arrowPosition="left">
      <template #container>
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
        <de-controller-picker
          label="天空颜色"
          :animation="{
            target: config.vid,
            attribute: 'color',
          }"
          v-model="config.color"
        ></de-controller-picker>
        <de-controller-picker
          label="地面颜色"
          :animation="{
            target: config.vid,
            attribute: 'groundColor',
          }"
          v-model="config.groundColor"
        ></de-controller-picker>
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
