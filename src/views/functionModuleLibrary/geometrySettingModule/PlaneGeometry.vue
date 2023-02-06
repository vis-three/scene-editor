<template>
  <div class="VisBoxModel-container">
    <de-collapse-layout
      label="形状"
      icon="#iconjichubianhuan"
      arrowPosition="left"
    >
      <template #container>
        <de-controller-number
          :keyframe="false"
          label="宽度"
          :step="1"
          :min="0"
          v-model="config.width"
        ></de-controller-number>
        <de-controller-number
          :keyframe="false"
          label="高度"
          :step="1"
          :min="0"
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
};
</script>

<style lang="less" scoped></style>
