<template>
  <div class="VisConeModel-container">
    <de-collapse-layout
      label="形状"
      icon="#iconjichubianhuan"
      arrow-position="left"
    >
      <template #container>
        <de-controller-number
          v-model="config.radius"
          :keyframe="false"
          label="底部半径"
          :step="1"
          :min="0"
        />
        <de-controller-number
          v-model="config.height"
          :keyframe="false"
          label="高度"
          :step="1"
          :min="0"
        />
        <de-controller-number
          v-model="config.radialSegments"
          :keyframe="false"
          label="侧面分段"
          :step="1"
          :min="3"
        />
      </template>
    </de-collapse-layout>
    <de-collapse-layout
      label="高级"
      icon="#iconzhuanshupeizhi"
      arrow-position="left"
    >
      <template #container>
        <de-controller-switch
          v-model="config.openEnded"
          :keyframe="false"
          label="开放底面"
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
          label="闭合角度"
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
