<template>
  <div class="VisDirectionalLight-container">
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
          :animation="{
            target: config.vid,
            attribute: 'intensity',
          }"
          v-model="config.intensity"
        ></de-controller-number>
      </template>
    </de-collapse-layout>
    <!-- <de-collapse-layout label="目标" icon="#iconkejian" arrowPosition="left">
      <template #container>
        <de-controller-vector3
          label="目标位置"
          :step="1"
          :dragMultply="2"
          :displayAccuracy="0"
          :animation="{
            target: config.vid,
            attribute: 'target.position'
          }"
          v-model="config.target.position"
        ></de-controller-vector3>
      </template>
    </de-collapse-layout> -->
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
