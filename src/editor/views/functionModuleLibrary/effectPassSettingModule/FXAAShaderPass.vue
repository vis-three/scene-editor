<template>
  <div class="VisUnrealBloomPass-container">
    <de-collapse-layout
      label="设置"
      icon="#iconshezhi"
      arrow-position="left"
    >
      <template #container>
        <de-controller-number
          v-model="config.resolution.x"
          label="宽分辨率"
          :step="0.01"
          :drag-multply="3"
          :min="0"
          :display-accuracy="2"
          :animation="{
            target: config.vid,
            attribute: 'resolution.x',
          }"
        />
        <de-controller-number
          v-model="config.resolution.y"
          label="高分辨率"
          :step="0.01"
          :drag-multply="3"
          :min="0"
          :display-accuracy="2"
          :animation="{
            target: config.vid,
            attribute: 'resolution.y',
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
.VisUnrealBloomPass-container {
}
</style>
