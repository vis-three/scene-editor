<template>
  <div class="BoxGeometry-container">
    <de-collapse-layout
      label="形状"
      icon="#iconjichubianhuan"
      arrow-position="left"
    >
      <template #container>
        <de-controller-select
          v-model="config.shapes"
          :keyframe="false"
          label="形状"
          :options="shapeList"
          :prop="{
            label: 'name',
            value: 'vid',
          }"
        />
        <de-controller-select
          v-model="config.options.extrudePath"
          :keyframe="false"
          label="挤压路径"
          :options="pathList"
          :prop="{
            label: 'name',
            value: 'vid',
          }"
        />
        <de-controller-number
          v-model="config.options.depth"
          :keyframe="false"
          label="厚度"
          :step="1"
          :min="0"
        />
        <de-controller-number
          v-model="config.options.steps"
          :keyframe="false"
          label="挤压分段"
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
    shapeList() {
      return this.$store.getters["shape/list"];
    },
    pathList() {
      return this.$store.getters["path/list"];
    },
  },
};
</script>

<style lang="less" scoped></style>
