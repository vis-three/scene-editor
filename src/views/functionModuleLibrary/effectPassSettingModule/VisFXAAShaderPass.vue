<template>
  <div class="VisUnrealBloomPass-container">
    <de-collapse-layout label="设置" icon="#iconshezhi" arrowPosition="left">
      <template #container>
        <de-controller-number
          label="宽分辨率"
          :step="0.01"
          :dragMultply="3"
          :min="0"
          :displayAccuracy="2"
          :animation="{
            target: config.vid,
            attribute: 'resolution.x',
          }"
          v-model="config.resolution.x"
        ></de-controller-number>
        <de-controller-number
          label="高分辨率"
          :step="0.01"
          :dragMultply="3"
          :min="0"
          :displayAccuracy="2"
          :animation="{
            target: config.vid,
            attribute: 'resolution.y',
          }"
          v-model="config.resolution.y"
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
