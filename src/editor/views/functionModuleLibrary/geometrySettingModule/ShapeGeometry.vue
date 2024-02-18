<template>
  <div class="pathGeometry-container">
    <de-collapse-layout
      label="形状"
      icon="#iconjichubianhuan"
      arrow-position="left"
    >
      <template #container>
        <de-controller-select
          v-model="shape.shape"
          :keyframe="false"
          label="路径选择"
          :options="pathOptions"
        />
        <de-controller-number
          v-model="config.curveSegments"
          :keyframe="false"
          label="面分段"
          :step="1"
          :drag-multply="3"
          :min="3"
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
    shape() {
      return this.$store.getters["shape/get"][this.config.shape];
    },
    pathOptions() {
      return Object.values(this.$store.getters["path/get"]).map((config) => {
        return {
          label: config.name,
          value: config.vid,
        };
      });
    },
  },
  methods: {},
};
</script>

<style lang="less" scoped></style>
