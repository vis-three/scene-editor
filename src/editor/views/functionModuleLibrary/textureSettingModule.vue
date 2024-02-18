<template>
  <div
    v-if="config"
    class="textureSettingModule-container"
  >
    <de-collapse-layout
      label="贴图"
      :sub-label="config.type"
      icon="#icontietushezhi"
      arrow-position="left"
    >
      <template #container>
        <de-controller-input
          v-model="config.name"
          label="名称"
        />
        <de-controller-input
          v-model="config.alias"
          label="别名"
        />
        <de-controller-code
          v-model="config.meta"
          label="数据"
        />
      </template>
    </de-collapse-layout>
    <de-collapse-layout
      label="基础设置"
      icon="#iconshezhi"
      arrow-position="left"
    >
      <template #container>
        <de-controller-switch
          v-model="config.flipY"
          :keyframe="false"
          label="纵向翻转"
        />
        <de-controller-number
          v-model="rotation"
          label="旋转"
          :step="1"
          :drag-multply="3"
          :min="-360"
          :max="360"
          unit="°"
          :display-accuracy="0"
          :animation="{
            target: config,
            attribute: 'rotation',
          }"
        />
        <de-controller-number
          v-model="config.center.x"
          label="中心点x"
          :step="0.01"
          :drag-multply="3"
          :display-accuracy="2"
          :animation="{
            target: config.center,
            attribute: 'x',
          }"
        />
        <de-controller-number
          v-model="config.center.y"
          label="中心点y"
          :step="0.01"
          :drag-multply="3"
          :display-accuracy="2"
          :animation="{
            target: config.center,
            attribute: 'y',
          }"
        />
        <de-controller-select
          v-model="config.wrapS"
          label="x包裹"
          :options="warpList"
          :animation="{
            target: config,
            attribute: 'wrapS',
          }"
        />
        <de-controller-number
          v-if="config.wrapS !== warpList[0].value"
          v-model="config.repeat.x"
          label="x重复"
          :step="1"
          :min="1"
          :drag-multply="2"
          :animation="{
            target: config.repeat,
            attribute: 'x',
          }"
        />
        <de-controller-select
          v-model="config.wrapT"
          label="y包裹"
          :options="warpList"
          :animation="{
            target: config,
            attribute: 'wrapT',
          }"
        />
        <de-controller-number
          v-if="config.wrapS !== warpList[0].value"
          v-model="config.repeat.y"
          label="y重复"
          :step="1"
          :min="1"
          :drag-multply="2"
          :animation="{
            target: config.repeat,
            attribute: 'y',
          }"
        />
        <de-controller-number
          v-model="config.offset.x"
          label="x偏移"
          :step="0.01"
          :min="0"
          :max="1"
          :drag-multply="3"
          :display-accuracy="2"
          :animation="{
            target: config.offset,
            attribute: 'x',
          }"
        />
        <de-controller-number
          v-model="config.offset.y"
          label="y偏移"
          :step="0.01"
          :min="0"
          :max="1"
          :drag-multply="3"
          :display-accuracy="2"
          :animation="{
            target: config.offset,
            attribute: 'y',
          }"
        />
        <de-controller-select
          v-model="config.mapping"
          label="映射类型"
          :options="mappingList"
          :animation="{
            target: config,
            attribute: 'mapping',
          }"
        />
        <de-controller-select
          v-model="config.format"
          label="格式类型"
          :options="formatList"
          :animation="{
            target: config,
            attribute: 'format',
          }"
        />
        <de-controller-select
          v-model="config.magFilter"
          label="放大滤镜"
          :options="magFilterList"
          :animation="{
            target: config,
            attribute: 'magFilter',
          }"
        />
        <de-controller-select
          v-model="config.minFilter"
          label="缩小滤镜"
          :options="minFilterList"
          :animation="{
            target: config,
            attribute: 'minFilter',
          }"
        />
        <de-controller-select
          v-model="config.encoding"
          label="编码类型"
          :options="encodingList"
          :animation="{
            target: config,
            attribute: 'encoding',
          }"
        />
      </template>
    </de-collapse-layout>

    <components
      :is="type"
      :config="config"
    />
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
