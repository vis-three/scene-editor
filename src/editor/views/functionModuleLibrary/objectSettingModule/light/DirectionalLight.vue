<template>
  <div class="VisDirectionalLight-container">
    <de-collapse-layout
      label="设置"
      icon="#iconshezhi"
      arrow-position="left"
    >
      <template #container>
        <de-controller-picker
          v-model="config.color"
          label="颜色"
          :animation="{
            target: config.vid,
            attribute: 'color',
          }"
        />
        <de-controller-number
          v-model="config.intensity"
          label="亮度"
          :step="0.1"
          :drag-multply="10"
          :min="0"
          :animation="{
            target: config.vid,
            attribute: 'intensity',
          }"
        />
      </template>
    </de-collapse-layout>
    <de-collapse-layout
      label="阴影"
      icon="#iconshezhi"
      arrow-position="left"
    >
      <template #container>
        <de-controller-number
          v-model="config.shadow.camera.near"
          :keyframe="false"
          label="近截面"
          :step="1"
          :drag-multply="5"
          :min="0"
        />
        <de-controller-number
          v-model="config.shadow.camera.far"
          :keyframe="false"
          label="远截面"
          :step="1"
          :drag-multply="5"
          :min="0"
        />
        <de-controller-number
          v-model="shaowWidth"
          :keyframe="false"
          label="阴影宽"
          :step="1"
          :drag-multply="5"
          :min="0"
        />
        <de-controller-number
          v-model="shaowHeight"
          :keyframe="false"
          label="阴影高"
          :step="1"
          :drag-multply="5"
          :min="0"
        />
        <de-controller-number
          v-model="config.shadow.bias"
          :keyframe="false"
          label="偏差"
          :step="0.0001"
          :drag-multply="2"
          :min="0"
        />
        <de-controller-number
          v-model="config.shadow.normalBias"
          :keyframe="false"
          label="法线偏移"
          :step="0.1"
          :drag-multply="2"
          :min="0"
        />
        <de-controller-number
          v-model="config.shadow.mapSize.width"
          :keyframe="false"
          label="宽精度"
          :step="1"
          :drag-multply="5"
          :min="0"
        />
        <de-controller-number
          v-model="config.shadow.mapSize.height"
          :keyframe="false"
          label="高精度"
          :step="1"
          :drag-multply="5"
          :min="0"
        />
      </template>
    </de-collapse-layout>
    <!-- <de-collapse-layout label="目标" icon="#iconkejian" arrowPosition="left">
      <template #container>
        <de-controller-vector3
          label="目标位置"
          :step="1"
          :dragMultply="2"
          :displayAccuracy="0"
          :animation="{
            target: config.vid,
            attribute: 'target.position'
          }"
          v-model="config.target.position"
        ></de-controller-vector3>
      </template>
    </de-collapse-layout> -->
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
    shaowWidth: {
      get() {
        return this.config.shadow.camera.right - this.config.shadow.camera.left;
      },
      set(value) {
        this.config.shadow.camera.right = value / 2;
        this.config.shadow.camera.left = -value / 2;
      },
    },
    shaowHeight: {
      get() {
        return this.config.shadow.camera.top - this.config.shadow.camera.bottom;
      },
      set(value) {
        this.config.shadow.camera.top = value / 2;
        this.config.shadow.camera.bottom = -value / 2;
      },
    },
  },
};
</script>

<style lang="less" scoped></style>
