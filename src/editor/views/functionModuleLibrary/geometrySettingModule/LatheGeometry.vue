<template>
  <div class="BoxGeometry-container">
    <de-collapse-layout
      label="形状"
      icon="#iconjichubianhuan"
      arrow-position="left"
    >
      <template #container>
        <de-controller-select
          v-model="config.path"
          :keyframe="false"
          label="路径"
          :options="pathList"
          :prop="{
            label: 'name',
            value: 'vid',
          }"
        />
        <de-controller-number
          v-model="config.divisions"
          :keyframe="false"
          label="精度"
          :step="1"
          :min="0"
        />
        <de-controller-number
          v-model="config.segments"
          :keyframe="false"
          label="分段"
          :step="1"
          :min="0"
        />
        <de-controller-number
          v-model="phiStart"
          :keyframe="false"
          label="起始角度"
          unit="°"
          :display-accuracy="2"
          :step="1"
          :min="0"
          :drag-multply="5"
        />
        <de-controller-number
          v-model="phiLength"
          :keyframe="false"
          label="结束角度"
          unit="°"
          :display-accuracy="2"
          :step="1"
          :min="0"
          :drag-multply="5"
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
    pathList() {
      return this.$store.getters["path/list"].filter(
        (item) => item.type === "Path",
      );
    },

    phiStart: {
      get() {
        return (180 / Math.PI) * this.config.phiStart;
      },
      set(value) {
        this.config.phiStart = (value * Math.PI) / 180;
      },
    },

    phiLength: {
      get() {
        return (180 / Math.PI) * this.config.phiLength;
      },
      set(value) {
        this.config.phiLength = (value * Math.PI) / 180;
      },
    },
  },
};
</script>

<style lang="less" scoped></style>
