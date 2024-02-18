<template>
  <div class="VisSpotLight-container">
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
          :display-accuracy="1"
          :animation="{
            target: config.vid,
            attribute: 'intensity',
          }"
        />
        <de-controller-number
          v-model="config.distance"
          label="距离"
          :step="1"
          :drag-multply="5"
          :min="0"
          :display-accuracy="0"
          :animation="{
            target: config.vid,
            attribute: 'distance',
          }"
        />
        <de-controller-number
          v-model="angle"
          label="角度"
          :step="1"
          :drag-multply="5"
          :min="0"
          unit="°"
          :display-accuracy="0"
          :animation="{
            target: config.vid,
            attribute: 'angle',
          }"
        />
        <de-controller-number
          v-model="config.decay"
          label="距离衰减"
          :step="0.1"
          :drag-multply="5"
          :min="0"
          :display-accuracy="1"
          :animation="{
            target: config.vid,
            attribute: 'decay',
          }"
        />
        <de-controller-number
          v-model="config.penumbra"
          label="椎体衰减"
          :step="0.1"
          :drag-multply="5"
          :min="0"
          :max="1"
          :display-accuracy="1"
          :animation="{
            target: config.vid,
            attribute: 'penumbra',
          }"
        />
      </template>
    </de-collapse-layout>
    <de-collapse-layout
      label="目标"
      icon="#iconkejian"
      arrow-position="left"
    >
      <template #container>
        <de-controller-vector3
          v-model="config.target.position"
          label="目标位置"
          :step="1"
          :drag-multply="2"
          :display-accuracy="0"
          :animation="{
            target: config.vid,
            attribute: 'target.position',
          }"
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
    angle: {
      get() {
        return (this.config.angle * 180) / Math.PI;
      },
      set(value) {
        this.config.angle = (value * Math.PI) / 180;
      },
    },
  },
};
</script>

<style lang="less" scoped></style>
