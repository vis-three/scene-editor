<template>
  <div class="materialSettingModule-container">
    <de-collapse-layout
      label="基础设置"
      icon="#iconshezhi"
      arrowPosition="left"
    >
      <template #container>
        <de-controller-picker
          label="材质颜色"
          v-model="config.color"
          :animation="{
            target: config,
            attribute: 'color',
          }"
        ></de-controller-picker>
        <de-controller-picker
          label="发光颜色"
          v-model="config.emissive"
          :animation="{
            target: config,
            attribute: 'emissive',
          }"
        ></de-controller-picker>
        <de-controller-number
          label="发光强度"
          :step="0.01"
          :dragMultply="3"
          :min="0"
          :max="1"
          :displayAccuracy="2"
          v-model="config.emissiveIntensity"
          :animation="{
            target: config,
            attribute: 'emissiveIntensity',
          }"
        ></de-controller-number>
        <de-controller-number
          label="金属度"
          :step="0.01"
          :dragMultply="3"
          :min="0"
          :max="1"
          :displayAccuracy="2"
          v-model="config.metalness"
          :animation="{
            target: config,
            attribute: 'metalness',
          }"
        ></de-controller-number>
        <de-controller-number
          label="粗糙度"
          :step="0.01"
          :dragMultply="3"
          :min="0"
          :max="1"
          :displayAccuracy="2"
          v-model="config.roughness"
          :animation="{
            target: config,
            attribute: 'roughness',
          }"
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

<style lang="less" scoped>
.materialSettingModule-container {
}
</style>
