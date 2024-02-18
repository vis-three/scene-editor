<template>
  <div class="RingGeometry-container">
    <de-collapse-layout
      label="形状"
      icon="#iconjichubianhuan"
      arrow-position="left"
    >
      <template #container>
        <de-controller-number
          v-model="config.innerRadius"
          :keyframe="false"
          label="内环半径"
          :step="1"
          :drag-multply="2"
          :min="0"
        />
        <de-controller-number
          v-model="config.outerRadius"
          :keyframe="false"
          label="外环半径"
          :step="1"
          :drag-multply="2"
          :min="0"
        />
        <de-controller-number
          v-model="config.thetaSegments"
          :keyframe="false"
          label="圆环分段"
          :step="1"
          :drag-multply="2"
          :min="3"
        />
        <de-controller-number
          v-model="config.phiSegments"
          :keyframe="false"
          label="环面分段"
          :step="1"
          :drag-multply="2"
          :min="1"
        />
        <de-controller-number
          v-model="thetaStart"
          :keyframe="false"
          label="起始角度"
          :step="1"
          :drag-multply="5"
          :min="0"
          :max="360"
          unit="°"
          :display-accuracy="0"
        />
        <de-controller-number
          v-model="thetaLength"
          :keyframe="false"
          label="环面范围"
          :step="1"
          :drag-multply="5"
          :min="0"
          :max="360"
          unit="°"
          :display-accuracy="0"
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
