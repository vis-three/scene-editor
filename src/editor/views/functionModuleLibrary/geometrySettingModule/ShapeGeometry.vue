<template>
  <div class="pathGeometry-container">
    <de-collapse-layout
      label="形状"
      icon="#iconjichubianhuan"
      arrowPosition="left"
    >
      <template #container>
        <de-controller-select
          :keyframe="false"
          label="路径选择"
          :options="pathOptions"
          v-model="shape.shape"
        ></de-controller-select>
        <de-controller-number
          :keyframe="false"
          label="面分段"
          :step="1"
          :dragMultply="3"
          :min="3"
          v-model="config.curveSegments"
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
