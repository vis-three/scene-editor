<template>
  <div class="VisUnrealBloomPass-container">
    <de-collapse-layout
      label="设置"
      icon="#iconshezhi"
      arrow-position="left"
    >
      <template #container>
        <de-controller-number
          v-model="config.threshold"
          label="阈值"
          :step="0.01"
          :drag-multply="3"
          :min="0"
          :display-accuracy="2"
          :animation="{
            target: config.vid,
            attribute: 'threshold',
          }"
        />
        <de-controller-number
          v-model="config.strength"
          label="强度"
          :step="0.01"
          :drag-multply="3"
          :min="0"
          :display-accuracy="2"
          :animation="{
            target: config.vid,
            attribute: 'strength',
          }"
        />
        <de-controller-number
          v-model="config.radius"
          label="发光半径"
          :step="0.01"
          :drag-multply="3"
          :min="0"
          :display-accuracy="2"
          :animation="{
            target: config.vid,
            attribute: 'radius',
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
