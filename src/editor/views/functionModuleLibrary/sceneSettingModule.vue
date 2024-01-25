<template>
  <div class="sceneSettingModule-container">
    <de-collapse-layout
      label="场景设置"
      icon="#iconchangjing"
      arrowPosition="left"
    >
      <template #container>
        <de-controller-input
          label="名称"
          v-model="scene.name"
        ></de-controller-input>
        <de-controller-select
          :keyframe="false"
          label="场景雾"
          :options="fogList"
          v-model="scene.fog.type"
        ></de-controller-select>
        <de-controller-picker
          v-if="scene.fog.type"
          label="颜色"
          v-model="scene.fog.color"
          :animation="{
            target: scene.fog,
            attribute: 'color',
          }"
        ></de-controller-picker>
        <de-controller-number
          v-if="scene.fog.type === 'Fog'"
          label="最小距离"
          :step="1"
          :dragMultply="5"
          :min="0"
          v-model="scene.fog.near"
          :animation="{
            target: scene.fog,
            attribute: 'near',
          }"
        ></de-controller-number>
        <de-controller-number
          v-if="scene.fog.type === 'Fog'"
          label="最大距离"
          :step="1"
          :dragMultply="5"
          :min="0"
          v-model="scene.fog.far"
          :animation="{
            target: scene.fog,
            attribute: 'far',
          }"
        ></de-controller-number>
        <de-controller-number
          v-if="scene.fog.type === 'FogExp2'"
          label="密度"
          :step="0.001"
          :dragMultply="3"
          :min="0"
          v-model="scene.fog.density"
          :animation="{
            target: scene.fog,
            attribute: 'density',
          }"
        ></de-controller-number>
        <de-controller-picker
          v-if="!scene.background"
          label="背景颜色"
          v-model="scene.background"
          :animation="{
            target: scene,
            attribute: 'background',
          }"
        ></de-controller-picker>
        <de-controller-select
          label="背景贴图"
          :options="textureList"
          :prop="{
            label: 'name',
            value: 'vid',
          }"
          v-model="scene.background"
          :animation="{
            target: scene,
            attribute: 'background',
          }"
        ></de-controller-select>
        <de-controller-select
          label="环境贴图"
          :options="textureList"
          :prop="{
            label: 'name',
            value: 'vid',
          }"
          v-model="scene.environment"
          :animation="{
            target: scene,
            attribute: 'environment',
          }"
        ></de-controller-select>
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
