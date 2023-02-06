<template>
  <div class="RingGeometry-container">
    <de-collapse-layout
      label="形状"
      icon="#iconjichubianhuan"
      arrowPosition="left"
    >
      <template #container>
        <de-controller-number
          label="内环半径"
          :step="1"
          :dragMultply="2"
          :min="0"
          v-model="config.innerRadius"
        ></de-controller-number>
        <de-controller-number
          label="外环半径"
          :step="1"
          :dragMultply="2"
          :min="0"
          v-model="config.outerRadius"
        ></de-controller-number>
        <de-controller-number
          label="圆环分段"
          :step="1"
          :dragMultply="2"
          :min="3"
          v-model="config.thetaSegments"
        ></de-controller-number>
        <de-controller-number
          label="环面分段"
          :step="1"
          :dragMultply="2"
          :min="1"
          v-model="config.phiSegments"
        ></de-controller-number>
        <de-controller-number
          label="起始角度"
          :step="1"
          :dragMultply="5"
          :min="0"
          :max="360"
          unit="°"
          :displayAccuracy="0"
          v-model="thetaStart"
        ></de-controller-number>
        <de-controller-number
          label="环面范围"
          :step="1"
          :dragMultply="5"
          :min="0"
          :max="360"
          unit="°"
          :displayAccuracy="0"
          v-model="thetaLength"
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
  computed: {
    thetaStart: {
      get() {
        return (this.config.thetaStart * 180) / Math.PI;
      },
      set(value) {
        this.config.thetaStart = (value * Math.PI) / 180;
      },
    },
    thetaLength: {
      get() {
        return (this.config.thetaLength * 180) / Math.PI;
      },
      set(value) {
        this.config.thetaLength = (value * Math.PI) / 180;
      },
    },
  },
};
</script>

<style lang="less" scoped></style>
