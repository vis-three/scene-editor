<template>
  <div class="VisAfterimagePass-container">
    <de-collapse-layout label="设置" icon="#iconshezhi" arrowPosition="left">
      <template #container>
        <de-controller-number
          label="程度"
          :step="0.01"
          :dragMultply="3"
          :min="0"
          :displayAccuracy="2"
          :animation="{
            target: config.vid,
            attribute: 'damp',
          }"
          v-model="config.damp"
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
.VisAfterimagePass-container {
}
</style>
