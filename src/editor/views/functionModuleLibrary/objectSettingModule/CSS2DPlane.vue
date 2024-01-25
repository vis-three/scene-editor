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
  computed: {},
};
</script>

<style lang="less" scoped></style>
