<template>
  <div class="materialSettingModule-container" v-if="type">
    <de-collapse-layout
      label="材质"
      :subLabel="config.type"
      icon="#iconcaizhishezhi"
      arrowPosition="left"
    >
      <template #container>
        <de-controller-input
          :keyframe="false"
          label="名称"
          v-model="config.name"
        ></de-controller-input>
        <de-controller-input
          label="别名"
          v-model="config.alias"
        ></de-controller-input>
        <de-controller-code
          label="数据"
          v-model="config.meta"
        ></de-controller-code>
        <de-controller-switch
          label="允许透明"
          v-model="config.transparent"
          :animation="{
            target: config,
            attribute: 'transparent',
          }"
        ></de-controller-switch>
        <de-controller-number
          label="透明度"
          :step="0.01"
          :dragMultply="3"
          :min="0"
          :max="1"
          :displayAccuracy="2"
          v-model="config.opacity"
          :animation="{
            target: config,
            attribute: 'opacity',
          }"
        ></de-controller-number>
        <de-controller-switch
          label="可见性"
          v-model="config.visible"
          :animation="{
            target: config,
            attribute: 'visible',
          }"
        ></de-controller-switch>
        <de-controller-select
          label="投影面"
          :options="shadowSideList"
          v-model="config.shadowSide"
          :animation="{
            target: config,
            attribute: 'shadowSide',
          }"
        ></de-controller-select>
        <de-controller-select
          label="渲染面"
          :options="sideList"
          v-model="config.side"
          :animation="{
            target: config,
            attribute: 'side',
          }"
        ></de-controller-select>
      </template>
    </de-collapse-layout>
    <components :config="config" :is="type"></components>
    <de-collapse-layout
      label="高级"
      icon="#iconcaizhishezhi"
      arrowPosition="left"
    >
      <template #container>
        <de-controller-number
          :keyframe="false"
          label="alpha测试"
          :step="0.01"
          :dragMultply="3"
          :min="0"
          :max="1"
          :displayAccuracy="2"
          v-model="config.alphaTest"
        ></de-controller-number>
        <de-controller-number
          :keyframe="false"
          label="多边形偏移"
          :step="1"
          :dragMultply="1"
          :min="-3"
          :max="3"
          v-model="polygonOffset"
        ></de-controller-number>
        <de-controller-switch
          label="颜色写入"
          v-model="config.colorWrite"
          :animation="{
            target: config,
            attribute: 'colorWrite',
          }"
        ></de-controller-switch>
        <de-controller-switch
          label="颜色抖动"
          v-model="config.dithering"
          :animation="{
            target: config,
            attribute: 'dithering',
          }"
        ></de-controller-switch>
        <de-controller-switch
          label="深度测试"
          v-model="config.depthTest"
          :animation="{
            target: config,
            attribute: 'depthTest',
          }"
        ></de-controller-switch>
        <de-controller-switch
          label="深度写入"
          v-model="config.depthWrite"
          :animation="{
            target: config,
            attribute: 'depthWrite',
          }"
        ></de-controller-switch>
        <de-controller-select
          label="深度函数"
          :options="depthFuncList"
          v-model="config.depthFunc"
          :animation="{
            target: config,
            attribute: 'depthFunc',
          }"
        ></de-controller-select>
        <de-controller-switch
          label="雾影响"
          v-model="config.fog"
          :animation="{
            target: config,
            attribute: 'fog',
          }"
        ></de-controller-switch>
        <de-controller-switch
          label="色调映射"
          v-model="config.toneMapped"
          :animation="{
            target: config,
            attribute: 'toneMapped',
          }"
        ></de-controller-switch>
        <de-controller-select
          label="混合模式"
          :options="blendingList"
          v-model="config.blending"
          :animation="{
            target: config,
            attribute: 'blending',
          }"
        ></de-controller-select>
      </template>
    </de-collapse-layout>
  </div>
</template>

<script>
import {
  FrontSide,
  BackSide,
  DoubleSide,
  NoBlending,
  NormalBlending,
  AdditiveBlending,
  SubtractiveBlending,
  MultiplyBlending,
  CustomBlending,
  NeverDepth,
  AlwaysDepth,
  LessDepth,
  LessEqualDepth,
  GreaterEqualDepth,
  GreaterDepth,
  NotEqualDepth,
} from "three";

const components = {};

const context = import.meta.glob("./materialSettingModule/*.vue");

Object.keys(context).forEach((url) => {
  components[
    url
      .split("/")
      .pop()
      .replace(/.\/|\.vue$/g, "")
  ] = context[url];
});

export default {
  components,
  data() {
    return {
      shadowSideList: [
        { label: "无", value: null },
        { label: "背面", value: FrontSide },
        { label: "前面", value: BackSide },
        { label: "双面", value: DoubleSide },
      ],
      sideList: [
        { label: "背面", value: FrontSide },
        { label: "前面", value: BackSide },
        { label: "双面", value: DoubleSide },
      ],
      blendingList: [
        { label: "无", value: NoBlending },
        { label: "正常", value: NormalBlending },
        { label: "叠加", value: AdditiveBlending },
        { label: "相减", value: SubtractiveBlending },
        { label: "相乘", value: MultiplyBlending },
        { label: "自定义", value: CustomBlending },
      ],
      depthFuncList: [
        { label: "NeverDepth", value: NeverDepth },
        { label: "AlwaysDepth", value: AlwaysDepth },
        { label: "LessDepth", value: LessDepth },
        { label: "LessEqualDepth", value: LessEqualDepth },
        { label: "GreaterEqualDepth", value: GreaterEqualDepth },
        { label: "GreaterDepth", value: GreaterDepth },
        { label: "NotEqualDepth", value: NotEqualDepth },
      ],
    };
  },
  computed: {
    config() {
      return this.$store.getters["active/material"];
    },
    type() {
      return this.config?.type;
    },
    polygonOffset: {
      get() {
        if (!this.config.polygonOffset) {
          return 0;
        } else {
          return this.config.polygonOffsetFactor;
        }
      },
      set(value) {
        if (!value) {
          this.config.polygonOffset = false;
          this.config.polygonOffsetFactor = 0;
          this.config.polygonOffsetUnits = 0;
        } else {
          this.config.polygonOffset = true;
          this.config.polygonOffsetFactor = value;
          this.config.polygonOffsetUnits = value;
        }
      },
    },
  },
  methods: {},
};
</script>

<style lang="less" scoped>
.materialSettingModule-container {
}
</style>
