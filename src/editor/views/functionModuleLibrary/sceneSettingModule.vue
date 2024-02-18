<template>
  <div class="sceneSettingModule-container">
    <de-collapse-layout
      label="场景设置"
      icon="#iconchangjing"
      arrow-position="left"
    >
      <template #container>
        <de-controller-input
          v-model="scene.name"
          label="名称"
        />
        <de-controller-select
          v-model="scene.fog.type"
          :keyframe="false"
          label="场景雾"
          :options="fogList"
        />
        <de-controller-picker
          v-if="scene.fog.type"
          v-model="scene.fog.color"
          label="颜色"
          :animation="{
            target: scene.fog,
            attribute: 'color',
          }"
        />
        <de-controller-number
          v-if="scene.fog.type === 'Fog'"
          v-model="scene.fog.near"
          label="最小距离"
          :step="1"
          :drag-multply="5"
          :min="0"
          :animation="{
            target: scene.fog,
            attribute: 'near',
          }"
        />
        <de-controller-number
          v-if="scene.fog.type === 'Fog'"
          v-model="scene.fog.far"
          label="最大距离"
          :step="1"
          :drag-multply="5"
          :min="0"
          :animation="{
            target: scene.fog,
            attribute: 'far',
          }"
        />
        <de-controller-number
          v-if="scene.fog.type === 'FogExp2'"
          v-model="scene.fog.density"
          label="密度"
          :step="0.001"
          :drag-multply="3"
          :min="0"
          :animation="{
            target: scene.fog,
            attribute: 'density',
          }"
        />
        <de-controller-picker
          v-if="!scene.background"
          v-model="scene.background"
          label="背景颜色"
          :animation="{
            target: scene,
            attribute: 'background',
          }"
        />
        <de-controller-select
          v-model="scene.background"
          label="背景贴图"
          :options="textureList"
          :prop="{
            label: 'name',
            value: 'vid',
          }"
          :animation="{
            target: scene,
            attribute: 'background',
          }"
        />
        <de-controller-select
          v-model="scene.environment"
          label="环境贴图"
          :options="textureList"
          :prop="{
            label: 'name',
            value: 'vid',
          }"
          :animation="{
            target: scene,
            attribute: 'environment',
          }"
        />
      </template>
    </de-collapse-layout>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fogList: [
        {
          label: "无",
          value: "",
        },
        {
          label: "线性雾",
          value: "Fog",
        },
        {
          lable: "指数雾",
          value: "FogExp2",
        },
      ],
    };
  },
  computed: {
    scene() {
      return this.$store.getters["scene/currentScene"];
    },
    textureList() {
      return [].concat(
        [{ name: "无", vid: "" }],
        this.$store.getters["texture/list"]
      );
    },
  },
};
</script>

<style lang="less" scoped>
.add-scene {
  width: 100%;
  margin-bottom: @box-margin;
}
</style>
