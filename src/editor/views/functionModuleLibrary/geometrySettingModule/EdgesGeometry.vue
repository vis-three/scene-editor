<template>
  <div class="BoxGeometry-container">
    <de-collapse-layout
      label="形状"
      icon="#iconjichubianhuan"
      arrowPosition="left"
    >
      <template #container>
        <de-controller-select
          :keyframe="false"
          label="目标几何"
          :options="geometryList"
          :prop="{
            label: 'name',
            value: 'vid',
          }"
          v-model="config.target"
        ></de-controller-select>
        <de-controller-number
          :keyframe="false"
          label="临界角"
          :step="1"
          :min="0"
          v-model="config.thresholdAngle"
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
    geometryList() {
      return this.$store.getters["geometry/list"];
    },
  },
};
</script>

<style lang="less" scoped></style>
