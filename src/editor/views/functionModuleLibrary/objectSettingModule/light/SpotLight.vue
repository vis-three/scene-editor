<template>
  <div class="VisSpotLight-container">
    <de-collapse-layout label="设置" icon="#iconshezhi" arrowPosition="left">
      <template #container>
        <de-controller-picker
          label="颜色"
          :animation="{
            target: config.vid,
            attribute: 'color',
          }"
          v-model="config.color"
        ></de-controller-picker>
        <de-controller-number
          label="亮度"
          :step="0.1"
          :dragMultply="10"
          :min="0"
          :displayAccuracy="1"
          :animation="{
            target: config.vid,
            attribute: 'intensity',
          }"
          v-model="config.intensity"
        ></de-controller-number>
        <de-controller-number
          label="距离"
          :step="1"
          :dragMultply="5"
          :min="0"
          :displayAccuracy="0"
          :animation="{
            target: config.vid,
            attribute: 'distance',
          }"
          v-model="config.distance"
        ></de-controller-number>
        <de-controller-number
          label="角度"
          :step="1"
          :dragMultply="5"
          :min="0"
          unit="°"
          :displayAccuracy="0"
          :animation="{
            target: config.vid,
            attribute: 'angle',
          }"
          v-model="angle"
        ></de-controller-number>
        <de-controller-number
          label="距离衰减"
          :step="0.1"
          :dragMultply="5"
          :min="0"
          :displayAccuracy="1"
          :animation="{
            target: config.vid,
            attribute: 'decay',
          }"
          v-model="config.decay"
        ></de-controller-number>
        <de-controller-number
          label="椎体衰减"
          :step="0.1"
          :dragMultply="5"
          :min="0"
          :max="1"
          :displayAccuracy="1"
          :animation="{
            target: config.vid,
            attribute: 'penumbra',
          }"
          v-model="config.penumbra"
        ></de-controller-number>
      </template>
    </de-collapse-layout>
    <de-collapse-layout label="目标" icon="#iconkejian" arrowPosition="left">
      <template #container>
        <de-controller-vector3
          label="目标位置"
          :step="1"
          :dragMultply="2"
          :displayAccuracy="0"
          :animation="{
            target: config.vid,
            attribute: 'target.position',
          }"
          v-model="config.target.position"
        ></de-controller-vector3>
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
