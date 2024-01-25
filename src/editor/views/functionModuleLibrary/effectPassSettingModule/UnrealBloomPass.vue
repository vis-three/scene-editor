<template>
  <div class="VisUnrealBloomPass-container">
    <de-collapse-layout label="设置" icon="#iconshezhi" arrowPosition="left">
      <template #container>
        <de-controller-number
          label="阈值"
          :step="0.01"
          :dragMultply="3"
          :min="0"
          :displayAccuracy="2"
          :animation="{
            target: config.vid,
            attribute: 'threshold',
          }"
          v-model="config.threshold"
        ></de-controller-number>
        <de-controller-number
          label="强度"
          :step="0.01"
          :dragMultply="3"
          :min="0"
          :displayAccuracy="2"
          :animation="{
            target: config.vid,
            attribute: 'strength',
          }"
          v-model="config.strength"
        ></de-controller-number>
        <de-controller-number
          label="发光半径"
          :step="0.01"
          :dragMultply="3"
          :min="0"
          :displayAccuracy="2"
          :animation="{
            target: config.vid,
            attribute: 'radius',
          }"
          v-model="config.radius"
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
.VisUnrealBloomPass-container {
}
</style>
