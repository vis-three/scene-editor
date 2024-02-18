<template>
  <div
    v-if="type"
    class="materialSettingModule-container"
  >
    <de-collapse-layout
      label="材质"
      :sub-label="config.type"
      icon="#iconcaizhishezhi"
      arrow-position="left"
    >
      <template #container>
        <de-controller-input
          v-model="config.name"
          :keyframe="false"
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
        <de-controller-switch
          v-model="config.transparent"
          label="允许透明"
          :animation="{
            target: config,
            attribute: 'transparent',
          }"
        />
        <de-controller-number
          v-model="config.opacity"
          label="透明度"
          :step="0.01"
          :drag-multply="3"
          :min="0"
          :max="1"
          :display-accuracy="2"
          :animation="{
            target: config,
            attribute: 'opacity',
          }"
        />
        <de-controller-switch
          v-model="config.visible"
          label="可见性"
          :animation="{
            target: config,
            attribute: 'visible',
          }"
        />
        <de-controller-select
          v-model="config.shadowSide"
          label="投影面"
          :options="shadowSideList"
          :animation="{
            target: config,
            attribute: 'shadowSide',
          }"
        />
        <de-controller-select
          v-model="config.side"
          label="渲染面"
          :options="sideList"
          :animation="{
            target: config,
            attribute: 'side',
          }"
        />
      </template>
    </de-collapse-layout>
    <components
      :is="type"
      :config="config"
    />
    <de-collapse-layout
      label="高级"
      icon="#iconcaizhishezhi"
      arrow-position="left"
    >
      <template #container>
        <de-controller-number
          v-model="config.alphaTest"
          :keyframe="false"
          label="alpha测试"
          :step="0.01"
          :drag-multply="3"
          :min="0"
          :max="1"
          :display-accuracy="2"
        />
        <de-controller-number
          v-model="polygonOffset"
          :keyframe="false"
          label="多边形偏移"
          :step="1"
          :drag-multply="1"
          :min="-3"
          :max="3"
        />
        <de-controller-switch
          v-model="config.colorWrite"
          label="颜色写入"
          :animation="{
            target: config,
            attribute: 'colorWrite',
          }"
        />
        <de-controller-switch
          v-model="config.dithering"
          label="颜色抖动"
          :animation="{
            target: config,
            attribute: 'dithering',
          }"
        />
        <de-controller-switch
          v-model="config.depthTest"
          label="深度测试"
          :animation="{
            target: config,
            attribute: 'depthTest',
          }"
        />
        <de-controller-switch
          v-model="config.depthWrite"
          label="深度写入"
          :animation="{
            target: config,
            attribute: 'depthWrite',
          }"
        />
        <de-controller-select
          v-model="config.depthFunc"
          label="深度函数"
          :options="depthFuncList"
          :animation="{
            target: config,
            attribute: 'depthFunc',
          }"
        />
        <de-controller-switch
          v-model="config.fog"
          label="雾影响"
          :animation="{
            target: config,
            attribute: 'fog',
          }"
        />
        <de-controller-switch
          v-model="config.toneMapped"
          label="色调映射"
          :animation="{
            target: config,
            attribute: 'toneMapped',
          }"
        />
        <de-controller-select
          v-model="config.blending"
          label="混合模式"
          :options="blendingList"
          :animation="{
            target: config,
            attribute: 'blending',
          }"
        />
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
