<template>
  <div class="materialSettingModule-container">
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
            attrubute: 'wireframe',
          }"
        ></de-controller-switch>
        <de-controller-switch
          label="平面着色"
          v-model="config.flatShading"
          :animation="{
            target: config,
            attrubute: 'flatShading',
          }"
        ></de-controller-switch>
        <de-controller-picker
          label="材质颜色"
          v-model="config.color"
          :animation="{
            target: config,
            attrubute: 'color',
          }"
        ></de-controller-picker>
        <de-controller-picker
          label="反光颜色"
          v-model="config.emissive"
          :animation="{
            target: config,
            attrubute: 'emissive',
          }"
        ></de-controller-picker>
        <de-controller-number
          label="反光强度"
          :step="0.01"
          :dragMultply="3"
          :min="0"
          :displayAccuracy="2"
          v-model="config.emissiveIntensity"
          :animation="{
            target: config,
            attrubute: 'emissiveIntensity',
          }"
        ></de-controller-number>
        <de-controller-number
          label="金属度"
          :step="0.01"
          :dragMultply="3"
          :min="0"
          :max="1"
          :displayAccuracy="2"
          v-model="config.metalness"
          :animation="{
            target: config,
            attrubute: 'metalness',
          }"
        ></de-controller-number>
        <de-controller-number
          label="粗糙度"
          :step="0.01"
          :dragMultply="3"
          :min="0"
          :max="1"
          :displayAccuracy="2"
          v-model="config.roughness"
          :animation="{
            target: config,
            attrubute: 'roughness',
          }"
        ></de-controller-number>
        <de-controller-number
          label="环境遮挡"
          :step="0.01"
          :dragMultply="3"
          :min="0"
          :displayAccuracy="2"
          v-model="config.aoMapIntensity"
          :animation="{
            target: config,
            attrubute: 'aoMapIntensity',
          }"
        ></de-controller-number>
        <de-controller-number
          label="环境反射"
          :step="0.01"
          :dragMultply="3"
          :min="0"
          :displayAccuracy="2"
          v-model="config.envMapIntensity"
          :animation="{
            target: config,
            attrubute: 'envMapIntensity',
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
            attrubute: 'lightMapIntensity',
          }"
        ></de-controller-number>
        <de-controller-number
          label="凹凸程度"
          :step="0.01"
          :dragMultply="3"
          :min="0"
          :displayAccuracy="2"
          v-model="config.bumpScale"
          :animation="{
            target: config,
            attrubute: 'bumpScale',
          }"
        ></de-controller-number>
        <de-controller-number
          label="位移程度"
          :step="0.01"
          :dragMultply="3"
          :min="0"
          :displayAccuracy="2"
          v-model="config.displacementScale"
          :animation="{
            target: config,
            attrubute: 'displacementScale',
          }"
        ></de-controller-number>
        <de-controller-number
          label="偏移量"
          :step="0.01"
          :dragMultply="3"
          :min="0"
          :displayAccuracy="2"
          v-model="config.displacementBias"
          :animation="{
            target: config,
            attrubute: 'displacementBias',
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
            attrubute: 'refractionRatio',
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
            attrubute: 'map',
          }"
        ></de-controller-select>
        <de-controller-select
          label="反光贴图"
          :options="textureList"
          :prop="{
            label: 'name',
            value: 'vid',
          }"
          v-model="config.emissiveMap"
          :animation="{
            target: config,
            attrubute: 'emissiveMap',
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
            attrubute: 'alphaMap',
          }"
        ></de-controller-select>
        <de-controller-select
          label="金属贴图"
          :options="textureList"
          :prop="{
            label: 'name',
            value: 'vid',
          }"
          v-model="config.metalnessMap"
          :animation="{
            target: config,
            attrubute: 'metalnessMap',
          }"
        ></de-controller-select>
        <de-controller-select
          label="粗糙贴图"
          :options="textureList"
          :prop="{
            label: 'name',
            value: 'vid',
          }"
          v-model="config.roughnessMap"
          :animation="{
            target: config,
            attrubute: 'roughnessMap',
          }"
        ></de-controller-select>
        <de-controller-select
          label="凹凸贴图"
          :options="textureList"
          :prop="{
            label: 'name',
            value: 'vid',
          }"
          v-model="config.bumpMap"
          :animation="{
            target: config,
            attrubute: 'bumpMap',
          }"
        ></de-controller-select>
        <de-controller-select
          label="位移贴图"
          :options="textureList"
          :prop="{
            label: 'name',
            value: 'vid',
          }"
          v-model="config.displacementMap"
          :animation="{
            target: config,
            attrubute: 'displacementMap',
          }"
        ></de-controller-select>
        <de-controller-select
          label="法线贴图"
          :options="textureList"
          :prop="{
            label: 'name',
            value: 'vid',
          }"
          v-model="config.normalMap"
          :animation="{
            target: config,
            attrubute: 'normalMap',
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
            attrubute: 'envMap',
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
            attrubute: 'aoMap',
          }"
        ></de-controller-select>
        <de-controller-select
          label="光照贴图"
          :options="textureList"
          :prop="{
            label: 'name',
            value: 'vid',
          }"
          v-model="config.lightMap"
          :animation="{
            target: config,
            attrubute: 'lightMap',
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
      const list = [
        {
          name: "无",
          vid: "",
        },
      ];
      const textureMap = this.$store.getters["texture/get"];
      Object.keys(textureMap).forEach((vid) => {
        list.push({
          vid,
          name: textureMap[vid].name,
        });
      });
      return list;
    },
  },
};
</script>

<style lang="less" scoped>
.materialSettingModule-container {
}
</style>
