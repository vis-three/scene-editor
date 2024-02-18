<template>
  <div class="VisSphereModel-container">
    <de-collapse-layout
      label="形状"
      icon="#iconjichubianhuan"
      arrow-position="left"
    >
      <template #container>
        <de-controller-number
          v-model="config.radius"
          :keyframe="false"
          label="半径"
          :step="1"
          :min="0"
        />
        <de-controller-number
          v-model="config.widthSegments"
          :keyframe="false"
          label="水平分段"
          :step="1"
          :min="3"
        />
        <de-controller-number
          v-model="config.heightSegments"
          :keyframe="false"
          label="垂直分段"
          :step="2"
          :min="0"
        />
      </template>
    </de-collapse-layout>
    <de-collapse-layout
      label="高级"
      icon="#iconzhuanshupeizhi"
      arrow-position="left"
    >
      <template #container>
        <de-controller-number
          v-model="phiStart"
          :keyframe="false"
          label="水平起始"
          :step="1"
          :drag-multply="5"
          :min="0"
          :max="360"
          unit="°"
          :display-accuracy="0"
        />
        <de-controller-number
          v-model="phiLength"
          :keyframe="false"
          label="水平闭合"
          :step="1"
          :drag-multply="5"
          :min="0"
          :max="360"
          unit="°"
          :display-accuracy="0"
        />
        <de-controller-number
          v-model="thetaStart"
          :keyframe="false"
          label="垂直起始"
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
          label="垂直闭合"
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
