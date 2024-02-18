<template>
  <div class="BoxGeometry-container">
    <de-collapse-layout
      label="形状"
      icon="#iconjichubianhuan"
      arrow-position="left"
    >
      <template #container>
        <de-controller-select
          v-model="config.target"
          :keyframe="false"
          label="目标几何"
          :options="geometryList"
          :prop="{
            label: 'name',
            value: 'vid',
          }"
        />
        <de-controller-number
          v-model="config.thresholdAngle"
          :keyframe="false"
          label="临界角"
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

  computed: {
    geometryList() {
      return this.$store.getters["geometry/list"];
    },
  },
};
</script>

<style lang="less" scoped></style>
