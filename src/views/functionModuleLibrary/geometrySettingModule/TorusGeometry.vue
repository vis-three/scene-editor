<template>
  <div class="TorusGeometry-container">
    <de-collapse-layout
      label="形状"
      icon="#iconjichubianhuan"
      arrowPosition="left"
    >
      <template #container>
        <de-controller-number
          label="环面半径"
          :step="1"
          :dragMultply="2"
          :min="0"
          v-model="config.radius"
        ></de-controller-number>
        <de-controller-number
          label="管道半径"
          :step="1"
          :dragMultply="2"
          :min="0"
          v-model="config.tube"
        ></de-controller-number>
        <de-controller-number
          label="半径分段"
          :step="1"
          :dragMultply="2"
          :min="0"
          v-model="config.radialSegments"
        ></de-controller-number>
        <de-controller-number
          label="管道分段"
          :step="1"
          :dragMultply="2"
          :min="0"
          v-model="config.tubularSegments"
        ></de-controller-number>
        <de-controller-number
          label="圆心角"
          :step="1"
          :dragMultply="5"
          :min="0"
          :max="360"
          unit="°"
          :displayAccuracy="0"
          v-model="arc"
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
      required: true
    }
  },
  computed: {
    arc: {
      get() {
        return (this.config.arc * 180) / Math.PI;
      },
      set(value) {
        this.config.arc = (value * Math.PI) / 180;
      }
    }
  }
};
</script>

<style lang="less" scoped></style>
