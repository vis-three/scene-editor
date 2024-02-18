<template>
  <div class="CircleGeometry-container">
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
          :drag-multply="2"
          :min="0"
        />
        <de-controller-number
          v-model="config.segments"
          :keyframe="false"
          label="分段"
          :step="1"
          :drag-multply="2"
          :min="3"
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
