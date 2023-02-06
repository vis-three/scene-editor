<template>
  <div class="sceneSettingModel-container">
    <de-collapse-layout
      label="渲染器设置"
      icon="#iconchangjing1"
      arrowPosition="left"
    >
      <template #container>
        <de-controller-picker
          label="背景色"
          showAlpha
          v-model="renderer.clearColor"
          :animation="{
            target: renderer,
            attribute: 'clearColor',
          }"
        ></de-controller-picker>
        <de-controller-number
          label="映射曝光"
          :step="0.01"
          :dragMultply="10"
          :min="0"
          v-model="renderer.toneMappingExposure"
          :animation="{
            target: renderer,
            attribute: 'toneMappingExposure',
          }"
        ></de-controller-number>
        <de-controller-switch
          :keyframe="false"
          label="物理光照"
          v-model="renderer.physicallyCorrectLights"
          :animation="{
            target: renderer,
            attribute: 'physicallyCorrectLights',
          }"
        ></de-controller-switch>
        <de-controller-switch
          :keyframe="false"
          label="全局阴影"
          v-model="renderer.shadowMap.enabled"
          :animation="{
            target: renderer.shadowMap,
            attribute: 'enabled',
          }"
        ></de-controller-switch>
        <de-controller-switch
          :keyframe="false"
          label="适应相机"
          v-model="renderer.adaptiveCamera"
          :animation="{
            target: renderer,
            attribute: 'adaptiveCamera',
          }"
        ></de-controller-switch>
        <de-controller-select
          :keyframe="false"
          label="阴影类型"
          :options="shadowMapType"
          v-model="renderer.shadowMap.type"
          :animation="{
            target: renderer.shadowMap,
            attribute: 'type',
          }"
        ></de-controller-select>
        <de-controller-select
          :keyframe="false"
          label="色调映射"
          :options="toneMapping"
          v-model="renderer.toneMapping"
          :animation="{
            target: renderer,
            attribute: 'toneMapping',
          }"
        ></de-controller-select>
        <de-controller-number
          :keyframe="false"
          label="像素比例"
          :step="0.01"
          :dragMultply="2"
          :min="0"
          :displayAccuracy="2"
          v-model="renderer.pixelRatio"
          :animation="{
            target: renderer,
            attribute: 'pixelRatio',
          }"
        ></de-controller-number>
        <de-controller-select
          :keyframe="false"
          label="输出编码"
          :options="outputEncoding"
          v-model="renderer.outputEncoding"
          :animation="{
            target: renderer,
            attribute: 'outputEncoding',
          }"
        ></de-controller-select>
      </template>
    </de-collapse-layout>
    <de-collapse-layout
      label="轨道控制器设置"
      icon="#iconchangjing1"
      arrowPosition="left"
    >
      <template #container>
        <de-controller-switch
          :keyframe="false"
          label="允许平移"
          v-model="orbitControls.enablePan"
        ></de-controller-switch>
        <de-controller-switch
          :keyframe="false"
          label="允许旋转"
          v-model="orbitControls.enableRotate"
        ></de-controller-switch>
        <de-controller-switch
          :keyframe="false"
          label="允许缩放"
          v-model="orbitControls.enableZoom"
        ></de-controller-switch>
        <de-controller-switch
          :keyframe="false"
          label="自动旋转"
          v-model="orbitControls.autoRotate"
        ></de-controller-switch>
        <de-controller-switch
          :keyframe="false"
          label="阻尼感"
          v-model="orbitControls.enableDamping"
        ></de-controller-switch>
        <de-controller-number
          :keyframe="false"
          label="旋转速度"
          :step="0.01"
          :dragMultply="10"
          v-model="orbitControls.autoRotateSpeed"
        ></de-controller-number>
        <de-controller-number
          :keyframe="false"
          label="阻尼系数"
          :step="0.01"
          :dragMultply="10"
          :min="0"
          v-model="orbitControls.dampingFactor"
        ></de-controller-number>
        <de-controller-number
          :keyframe="false"
          label="最大距离"
          :step="1"
          :dragMultply="5"
          :min="0"
          v-model="orbitControls.maxDistance"
        ></de-controller-number>
        <de-controller-number
          :keyframe="false"
          label="最小距离"
          :step="1"
          :dragMultply="5"
          :min="0"
          v-model="orbitControls.minDistance"
        ></de-controller-number>
        <de-controller-number
          :keyframe="false"
          label="平移速度"
          :step="0.01"
          :dragMultply="5"
          :min="0"
          v-model="orbitControls.panSpeed"
        ></de-controller-number>
        <de-controller-number
          :keyframe="false"
          label="旋转速度"
          :step="0.01"
          :dragMultply="5"
          :min="0"
          v-model="orbitControls.rotateSpeed"
        ></de-controller-number>
        <de-controller-number
          :keyframe="false"
          label="缩放速度"
          :step="0.01"
          :dragMultply="5"
          :min="0"
          v-model="orbitControls.zoomSpeed"
        ></de-controller-number>
      </template>
    </de-collapse-layout>
  </div>
</template>

<script>
import {
  BasicShadowMap,
  PCFShadowMap,
  PCFSoftShadowMap,
  VSMShadowMap,
  NoToneMapping,
  LinearToneMapping,
  ReinhardToneMapping,
  CineonToneMapping,
  LinearEncoding,
  sRGBEncoding,
  LogLuvEncoding,
  RGBM7Encoding,
  RGBDEncoding,
  BasicDepthPacking,
  RGBADepthPacking,
} from "three";
export default {
  data() {
    return {
      shadowMapType: [
        { label: "BasicShadowMap", value: BasicShadowMap },
        { label: "PCFShadowMap", value: PCFShadowMap },
        { label: "PCFSoftShadowMap", value: PCFSoftShadowMap },
        // { label: "VSMShadowMap", value: VSMShadowMap },
      ],
      toneMapping: [
        { label: "NoToneMapping", value: NoToneMapping },
        { label: "LinearToneMapping", value: LinearToneMapping },
        { label: "ReinhardToneMapping", value: ReinhardToneMapping },
        { label: "CineonToneMapping", value: CineonToneMapping },
      ],
      outputEncoding: [
        { label: "LinearEncoding", value: LinearEncoding },
        { label: "sRGBEncoding", value: sRGBEncoding },
        { label: "BasicDepthPacking", value: BasicDepthPacking },
        { label: "RGBADepthPacking", value: RGBADepthPacking },
      ],
    };
  },
  computed: {
    renderer() {
      return this.$store.getters["renderer/webGLRenderer"];
    },
    orbitControls() {
      return this.$store.getters["controls/orbitControls"];
    },
  },
  methods: {},
};
</script>

<style lang="less" scoped>
.sceneSettingModel-container {
}
</style>
