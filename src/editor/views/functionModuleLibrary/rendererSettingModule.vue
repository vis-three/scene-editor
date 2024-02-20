<template>
  <div class="sceneSettingModel-container">
    <de-collapse-layout
      label="渲染器设置"
      icon="#iconchangjing1"
      arrow-position="left"
    >
      <template #container>
        <de-controller-picker
          v-model="renderer.clearColor"
          label="背景色"
          show-alpha
          :animation="{
            target: renderer,
            attribute: 'clearColor',
          }"
        />
        <de-controller-number
          v-model="renderer.toneMappingExposure"
          label="映射曝光"
          :step="0.01"
          :drag-multply="10"
          :min="0"
          :animation="{
            target: renderer,
            attribute: 'toneMappingExposure',
          }"
        />
        <de-controller-switch
          v-model="renderer.physicallyCorrectLights"
          :keyframe="false"
          label="物理光照"
          :animation="{
            target: renderer,
            attribute: 'physicallyCorrectLights',
          }"
        />
        <de-controller-switch
          v-model="renderer.shadowMap.enabled"
          :keyframe="false"
          label="全局阴影"
          :animation="{
            target: renderer.shadowMap,
            attribute: 'enabled',
          }"
        />
        <de-controller-switch
          v-model="renderer.adaptiveCamera"
          :keyframe="false"
          label="适应相机"
          :animation="{
            target: renderer,
            attribute: 'adaptiveCamera',
          }"
        />
        <de-controller-select
          v-model="renderer.shadowMap.type"
          :keyframe="false"
          label="阴影类型"
          :options="shadowMapType"
          :animation="{
            target: renderer.shadowMap,
            attribute: 'type',
          }"
        />
        <de-controller-select
          v-model="renderer.toneMapping"
          :keyframe="false"
          label="色调映射"
          :options="toneMapping"
          :animation="{
            target: renderer,
            attribute: 'toneMapping',
          }"
        />
        <de-controller-number
          v-model="renderer.pixelRatio"
          :keyframe="false"
          label="像素比例"
          :step="0.01"
          :drag-multply="2"
          :min="0"
          :display-accuracy="2"
          :animation="{
            target: renderer,
            attribute: 'pixelRatio',
          }"
        />
        <de-controller-select
          v-model="renderer.outputEncoding"
          :keyframe="false"
          label="输出编码"
          :options="outputEncoding"
          :animation="{
            target: renderer,
            attribute: 'outputEncoding',
          }"
        />
      </template>
    </de-collapse-layout>
    <!-- <de-collapse-layout
      label="轨道控制器设置"
      icon="#iconchangjing1"
      arrow-position="left"
    >
      <template #container>
        <de-controller-switch
          v-model="orbitControls.enablePan"
          :keyframe="false"
          label="允许平移"
        />
        <de-controller-switch
          v-model="orbitControls.enableRotate"
          :keyframe="false"
          label="允许旋转"
        />
        <de-controller-switch
          v-model="orbitControls.enableZoom"
          :keyframe="false"
          label="允许缩放"
        />
        <de-controller-switch
          v-model="orbitControls.autoRotate"
          :keyframe="false"
          label="自动旋转"
        />
        <de-controller-switch
          v-model="orbitControls.enableDamping"
          :keyframe="false"
          label="阻尼感"
        />
        <de-controller-number
          v-model="orbitControls.autoRotateSpeed"
          :keyframe="false"
          label="旋转速度"
          :step="0.01"
          :drag-multply="10"
        />
        <de-controller-number
          v-model="orbitControls.dampingFactor"
          :keyframe="false"
          label="阻尼系数"
          :step="0.01"
          :drag-multply="10"
          :min="0"
        />
        <de-controller-number
          v-model="orbitControls.maxDistance"
          :keyframe="false"
          label="最大距离"
          :step="1"
          :drag-multply="5"
          :min="0"
        />
        <de-controller-number
          v-model="orbitControls.minDistance"
          :keyframe="false"
          label="最小距离"
          :step="1"
          :drag-multply="5"
          :min="0"
        />
        <de-controller-number
          v-model="orbitControls.panSpeed"
          :keyframe="false"
          label="平移速度"
          :step="0.01"
          :drag-multply="5"
          :min="0"
        />
        <de-controller-number
          v-model="orbitControls.rotateSpeed"
          :keyframe="false"
          label="旋转速度"
          :step="0.01"
          :drag-multply="5"
          :min="0"
        />
        <de-controller-number
          v-model="orbitControls.zoomSpeed"
          :keyframe="false"
          label="缩放速度"
          :step="0.01"
          :drag-multply="5"
          :min="0"
        />
      </template>
    </de-collapse-layout> -->
  </div>
</template>

<script>
import {
  BasicShadowMap,
  PCFShadowMap,
  PCFSoftShadowMap,
  NoToneMapping,
  LinearToneMapping,
  ReinhardToneMapping,
  CineonToneMapping,
  LinearEncoding,
  sRGBEncoding,
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
