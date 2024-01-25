<template>
  <div class="CSS3DPlane-container">
    <de-collapse-layout label="C3设置" icon="#iconshezhi" arrowPosition="left">
      <template #container>
        <de-controller-number
          :keyframe="false"
          label="宽度"
          :step="1"
          :dragMultply="1"
          :min="0"
          :max="Infinity"
          v-model="config.width"
        ></de-controller-number>
        <de-controller-number
          :keyframe="false"
          label="高度"
          :step="1"
          :dragMultply="1"
          :min="0"
          :max="Infinity"
          v-model="config.height"
        ></de-controller-number>
        <de-controller-number
          :keyframe="false"
          label="旋转"
          :step="1"
          :dragMultply="5"
          :min="-180"
          :max="180"
          v-model="rotation"
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
    rotation: {
      get() {
        return (this.config.rotation2D * 180) / Math.PI;
      },
      set(value) {
        this.config.rotation2D = (value * Math.PI) / 180;
      },
    },
  },
};
</script>

<style lang="less" scoped></style>
