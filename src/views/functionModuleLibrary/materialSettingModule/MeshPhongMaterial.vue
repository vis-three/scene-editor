<template>
  <div class="MeshPhongMaterial-container">
    <de-collapse-layout
      label="参数设置"
      icon="#iconshezhi"
      arrowPosition="left"
    >
      <template #container>
        <de-controller-switch
          label="线框化"
          v-model="config.wireframe"
          :animation="{
            target: config,
            attribute: 'wireframe',
          }"
        ></de-controller-switch>
        <de-controller-picker
          label="材质颜色"
          v-model="config.color"
          :animation="{
            target: config,
            attribute: 'color',
          }"
        ></de-controller-picker>

        <de-controller-number
          label="环境遮挡"
          :step="0.01"
          :dragMultply="3"
          :min="0"
          :displayAccuracy="2"
          v-model="config.aoMapIntensity"
          :animation="{
            target: config,
            attribute: 'aoMapIntensity',
          }"
        ></de-controller-number>
        <de-controller-number
          label="光照强度"
          :step="0.01"
          :dragMultply="3"
          :min="0"
          :displayAccuracy="2"
          v-model="config.lightMapIntensity"
          :animation="{
            target: config,
            attribute: 'lightMapIntensity',
          }"
        ></de-controller-number>

        <de-controller-number
          label="空气折射率"
          :step="0.01"
          :dragMultply="3"
          :min="0"
          :max="1"
          :displayAccuracy="2"
          v-model="config.refractionRatio"
          :animation="{
            target: config,
            attribute: 'refractionRatio',
          }"
        ></de-controller-number>
      </template>
    </de-collapse-layout>
    <de-collapse-layout
      label="贴图设置"
      icon="#icontexture"
      arrowPosition="left"
    >
      <template #container>
        <de-controller-select
          label="表面贴图"
          :options="textureList"
          :prop="{
            label: 'name',
            value: 'vid',
          }"
          v-model="config.map"
          :animation="{
            target: config,
            attribute: 'map',
          }"
        ></de-controller-select>

        <de-controller-select
          label="透明贴图"
          :options="textureList"
          :prop="{
            label: 'name',
            value: 'vid',
          }"
          v-model="config.alphaMap"
          :animation="{
            target: config,
            attribute: 'alphaMap',
          }"
        ></de-controller-select>

        <de-controller-select
          label="环境贴图"
          :options="textureList"
          :prop="{
            label: 'name',
            value: 'vid',
          }"
          v-model="config.envMap"
          :animation="{
            target: config,
            attribute: 'envMap',
          }"
        ></de-controller-select>
        <de-controller-select
          label="环境遮挡贴图"
          :options="textureList"
          :prop="{
            label: 'name',
            value: 'vid',
          }"
          v-model="config.aoMap"
          :animation="{
            target: config,
            attribute: 'aoMap',
          }"
        ></de-controller-select>
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
    textureList() {
      return [
        {
          name: "无",
          vid: "",
        },
      ].concat(this.$store.getters["texture/list"]);
    },
  },
};
</script>

<style lang="less" scoped>
.MeshPhongMaterial-container {
}
</style>
