<template>
  <div class="VisBoxModel-container">
    <de-collapse-layout
      label="形状"
      icon="#iconjichubianhuan"
      arrow-position="left"
    >
      <template #container>
        <de-controller-number
          v-model="config.width"
          :keyframe="false"
          label="宽度"
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
