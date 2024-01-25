<template>
  <div class="VisSphereModel-container">
    <de-collapse-layout
      label="形状"
      icon="#iconjichubianhuan"
      arrowPosition="left"
    >
      <template #container>
        <de-controller-number
          :keyframe="false"
          label="半径"
          :step="1"
          :min="0"
          v-model="config.radius"
        ></de-controller-number>
        <de-controller-number
          :keyframe="false"
          label="水平分段"
          :step="1"
          :min="3"
          v-model="config.widthSegments"
        ></de-controller-number>
        <de-controller-number
          :keyframe="false"
          label="垂直分段"
          :step="2"
          :min="0"
          v-model="config.heightSegments"
        ></de-controller-number>
      </template>
    </de-collapse-layout>
    <de-collapse-layout
      label="高级"
      icon="#iconzhuanshupeizhi"
      arrowPosition="left"
    >
      <template #container>
        <de-controller-number
          :keyframe="false"
          label="水平起始"
          :step="1"
          :dragMultply="5"
          :min="0"
          :max="360"
          unit="°"
          :displayAccuracy="0"
          v-model="phiStart"
        ></de-controller-number>
        <de-controller-number
          :keyframe="false"
          label="水平闭合"
          :step="1"
          :dragMultply="5"
          :min="0"
          :max="360"
          unit="°"
          :displayAccuracy="0"
          v-model="phiLength"
        ></de-controller-number>
        <de-controller-number
          :keyframe="false"
          label="垂直起始"
          :step="1"
          :dragMultply="5"
          :min="0"
          :max="360"
          unit="°"
          :displayAccuracy="0"
          v-model="thetaStart"
        ></de-controller-number>
        <de-controller-number
          :keyframe="false"
          label="垂直闭合"
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
    phiStart: {
      get() {
        return (this.config.phiStart * 180) / Math.PI;
      },
      set(value) {
        this.config.phiStart = (value * Math.PI) / 180;
      },
    },
    phiLength: {
      get() {
        return (this.config.phiLength * 180) / Math.PI;
      },
      set(value) {
        this.config.phiLength = (value * Math.PI) / 180;
      },
    },
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
