<template>
  <div class="materialSettingModule-container">
    <de-collapse-layout
      label="基础设置"
      icon="#iconshezhi"
      arrow-position="left"
    >
      <template #container>
        <de-controller-picker
          v-model="config.color"
          label="材质颜色"
          :animation="{
            target: config,
            attribute: 'color',
          }"
        />
        <de-controller-picker
          v-model="config.emissive"
          label="发光颜色"
          :animation="{
            target: config,
            attribute: 'emissive',
          }"
        />
        <de-controller-number
          v-model="config.emissiveIntensity"
          label="发光强度"
          :step="0.01"
          :drag-multply="3"
          :min="0"
          :max="1"
          :display-accuracy="2"
          :animation="{
            target: config,
            attribute: 'emissiveIntensity',
          }"
        />
        <de-controller-number
          v-model="config.metalness"
          label="金属度"
          :step="0.01"
          :drag-multply="3"
          :min="0"
          :max="1"
          :display-accuracy="2"
          :animation="{
            target: config,
            attribute: 'metalness',
          }"
        />
        <de-controller-number
          v-model="config.roughness"
          label="粗糙度"
          :step="0.01"
          :drag-multply="3"
          :min="0"
          :max="1"
          :display-accuracy="2"
          :animation="{
            target: config,
            attribute: 'roughness',
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

<style lang="less" scoped>
.materialSettingModule-container {
}
</style>
