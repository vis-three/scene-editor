<template>
  <div class="VisConeModel-container">
    <de-collapse-layout
      label="形状"
      icon="#iconjichubianhuan"
      arrowPosition="left"
    >
      <template #container>
        <de-controller-number
          :keyframe="false"
          label="底部半径"
          :step="1"
          :min="0"
          v-model="config.radius"
        ></de-controller-number>
        <de-controller-number
          :keyframe="false"
          label="高度"
          :step="1"
          :min="0"
          v-model="config.height"
        ></de-controller-number>
        <de-controller-number
          :keyframe="false"
          label="侧面分段"
          :step="1"
          :min="3"
          v-model="config.radialSegments"
        ></de-controller-number>
      </template>
    </de-collapse-layout>
    <de-collapse-layout
      label="高级"
      icon="#iconzhuanshupeizhi"
      arrowPosition="left"
    >
      <template #container>
        <de-controller-switch
          :keyframe="false"
          label="开放底面"
          v-model="config.openEnded"
        ></de-controller-switch>
        <de-controller-number
          :keyframe="false"
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
          :keyframe="false"
          label="闭合角度"
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
