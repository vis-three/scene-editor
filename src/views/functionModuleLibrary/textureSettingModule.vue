<template>
  <div class="textureSettingModule-container" v-if="config">
    <de-collapse-layout
      label="贴图"
      icon="#icontietushezhi"
      arrowPosition="left"
    >
      <template #container>
        <de-controller-input
          label="名称"
          v-model="config.name"
        ></de-controller-input>
        <de-controller-input
          label="类型"
          v-model="config.type"
          disabled
        ></de-controller-input>
      </template>
    </de-collapse-layout>
    <de-collapse-layout
      label="基础设置"
      icon="#iconshezhi"
      arrowPosition="left"
    >
      <template #container>
        <de-controller-number
          label="旋转"
          :step="1"
          :dragMultply="3"
          :min="0"
          :max="360"
          unit="°"
          :displayAccuracy="0"
          v-model="rotation"
          :animation="{
            target: config,
            attribute: 'rotation',
          }"
        ></de-controller-number>
        <de-controller-number
          label="中心点x"
          :step="0.01"
          :dragMultply="3"
          :displayAccuracy="2"
          v-model="config.center.x"
          :animation="{
            target: config.center,
            attribute: 'x',
          }"
        ></de-controller-number>
        <de-controller-number
          label="中心点y"
          :step="0.01"
          :dragMultply="3"
          :displayAccuracy="2"
          v-model="config.center.y"
          :animation="{
            target: config.center,
            attribute: 'y',
          }"
        ></de-controller-number>
        <de-controller-select
          label="x包裹"
          :options="warpList"
          v-model="config.wrapS"
          :animation="{
            target: config,
            attribute: 'wrapS',
          }"
        ></de-controller-select>
        <de-controller-number
          v-if="config.wrapS !== warpList[0].value"
          label="x重复"
          :step="1"
          :min="1"
          :dragMultply="2"
          v-model="config.repeat.x"
          :animation="{
            target: config.repeat,
            attribute: 'x',
          }"
        ></de-controller-number>
        <de-controller-select
          label="y包裹"
          :options="warpList"
          v-model="config.wrapT"
          :animation="{
            target: config,
            attribute: 'wrapT',
          }"
        ></de-controller-select>
        <de-controller-number
          v-if="config.wrapS !== warpList[0].value"
          label="y重复"
          :step="1"
          :min="1"
          :dragMultply="2"
          v-model="config.repeat.y"
          :animation="{
            target: config.repeat,
            attribute: 'y',
          }"
        ></de-controller-number>
        <de-controller-number
          label="x偏移"
          :step="0.01"
          :min="0"
          :max="1"
          :dragMultply="3"
          :displayAccuracy="2"
          v-model="config.offset.x"
          :animation="{
            target: config.offset,
            attribute: 'x',
          }"
        ></de-controller-number>
        <de-controller-number
          label="y偏移"
          :step="0.01"
          :min="0"
          :max="1"
          :dragMultply="3"
          :displayAccuracy="2"
          v-model="config.offset.y"
          :animation="{
            target: config.offset,
            attribute: 'y',
          }"
        ></de-controller-number>
        <de-controller-select
          label="映射类型"
          :options="mappingList"
          v-model="config.mapping"
          :animation="{
            target: config,
            attribute: 'mapping',
          }"
        ></de-controller-select>
        <de-controller-select
          label="格式类型"
          :options="formatList"
          v-model="config.format"
          :animation="{
            target: config,
            attribute: 'format',
          }"
        ></de-controller-select>
        <de-controller-select
          label="放大滤镜"
          :options="magFilterList"
          v-model="config.magFilter"
          :animation="{
            target: config,
            attribute: 'magFilter',
          }"
        ></de-controller-select>
        <de-controller-select
          label="缩小滤镜"
          :options="minFilterList"
          v-model="config.minFilter"
          :animation="{
            target: config,
            attribute: 'minFilter',
          }"
        ></de-controller-select>
        <de-controller-select
          label="编码类型"
          :options="encodingList"
          v-model="config.encoding"
          :animation="{
            target: config,
            attribute: 'encoding',
          }"
        ></de-controller-select>
      </template>
    </de-collapse-layout>

    <components :config="config" :is="type"></components>
  </div>
</template>

<script>
const components = {};

const context = import.meta.glob("./textureSettingModule/*.vue");

Object.keys(context).forEach((url) => {
  components[
    url
      .split("/")
      .pop()
      .replace(/.\/|\.vue$/g, "")
  ] = context[url];
});

import {
  ClampToEdgeWrapping,
  RepeatWrapping,
  MirroredRepeatWrapping,
  UVMapping,
  CubeReflectionMapping,
  CubeRefractionMapping,
  EquirectangularReflectionMapping,
  EquirectangularRefractionMapping,
  CubeUVReflectionMapping,
  NearestFilter,
  LinearFilter,
  NearestMipmapNearestFilter,
  NearestMipmapLinearFilter,
  LinearMipmapNearestFilter,
  LinearMipmapLinearFilter,
  AlphaFormat,
  RedFormat,
  RedIntegerFormat,
  RGFormat,
  RGIntegerFormat,
  RGBAFormat,
  RGBAIntegerFormat,
  LuminanceFormat,
  LuminanceAlphaFormat,
  DepthFormat,
  DepthStencilFormat,
  LinearEncoding,
  sRGBEncoding,
} from "three";

export default {
  components,
  data() {
    return {
      warpList: [
        { label: "末尾延展", value: ClampToEdgeWrapping },
        { label: "重复覆盖", value: RepeatWrapping },
        { label: "镜像覆盖", value: MirroredRepeatWrapping },
      ],
      mappingList: [
        { label: "UV", value: UVMapping },
        { label: "盒状反射", value: CubeReflectionMapping },
        { label: "盒状折射", value: CubeRefractionMapping },
        { label: "等矩形反射", value: EquirectangularReflectionMapping },
        { label: "等矩形折射", value: EquirectangularRefractionMapping },
        { label: "盒状UV反射", value: CubeUVReflectionMapping },
      ],
      magFilterList: [
        { label: "Nearest", value: NearestFilter },
        { label: "Linear", value: LinearFilter },
      ],
      minFilterList: [
        { label: "Nearest", value: NearestFilter },
        { label: "Linear", value: LinearFilter },
        { label: "NearestMipmapNearest", value: NearestMipmapNearestFilter },
        { label: "NearestMipmapLinear", value: NearestMipmapLinearFilter },
        { label: "LinearMipmapNearest", value: LinearMipmapNearestFilter },
        { label: "LinearMipmapLinear", value: LinearMipmapLinearFilter },
      ],
      formatList: [
        { label: "AlphaFormat", value: AlphaFormat },
        { label: "RedFormat", value: RedFormat },
        { label: "RedIntegerFormat", value: RedIntegerFormat },
        { label: "RGFormat", value: RGFormat },
        { label: "RGIntegerFormat", value: RGIntegerFormat },
        { label: "RGBAFormat", value: RGBAFormat },
        { label: "RGBAIntegerFormat", value: RGBAIntegerFormat },
        { label: "LuminanceFormat", value: LuminanceFormat },
        { label: "LuminanceAlphaFormat", value: LuminanceAlphaFormat },
        { label: "DepthFormat", value: DepthFormat },
        { label: "DepthStencilFormat", value: DepthStencilFormat },
      ],
      encodingList: [
        { label: "LinearEncoding", value: LinearEncoding },
        { label: "sRGBEncoding", value: sRGBEncoding },
      ],
    };
  },
  computed: {
    config() {
      return this.$store.getters["texture/currentTexture"];
    },
    type() {
      if (this.config) {
        return this.config.type;
      } else {
        return false;
      }
    },
    rotation: {
      get() {
        return (this.config.rotation * 180) / Math.PI;
      },
      set(value) {
        this.config.rotation = (value * Math.PI) / 180;
      },
    },
  },
  methods: {},
};
</script>

<style lang="less" scoped>
.textureSettingModule-container {
}
</style>
