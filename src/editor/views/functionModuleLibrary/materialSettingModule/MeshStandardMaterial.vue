<template>
  <div class="materialSettingModule-container">
    <de-collapse-layout
      label="参数设置"
      icon="#iconshezhi"
      arrow-position="left"
    >
      <template #container>
        <de-controller-switch
          v-model="config.wireframe"
          label="线框化"
          :animation="{
            target: config,
            attrubute: 'wireframe',
          }"
        />
        <de-controller-switch
          v-model="config.flatShading"
          label="平面着色"
          :animation="{
            target: config,
            attrubute: 'flatShading',
          }"
        />
        <de-controller-picker
          v-model="config.color"
          label="材质颜色"
          :animation="{
            target: config,
            attrubute: 'color',
          }"
        />
        <de-controller-picker
          v-model="config.emissive"
          label="反光颜色"
          :animation="{
            target: config,
            attrubute: 'emissive',
          }"
        />
        <de-controller-number
          v-model="config.emissiveIntensity"
          label="反光强度"
          :step="0.01"
          :drag-multply="3"
          :min="0"
          :display-accuracy="2"
          :animation="{
            target: config,
            attrubute: 'emissiveIntensity',
          }"
        />
        <de-controller-number
          v-model="config.metalness"
          label="金属度"
          :step="0.01"
          :drag-multply="3"
          :min="0"
          :max="1"
          :display-accuracy="2"
          :animation="{
            target: config,
            attrubute: 'metalness',
          }"
        />
        <de-controller-number
          v-model="config.roughness"
          label="粗糙度"
          :step="0.01"
          :drag-multply="3"
          :min="0"
          :max="1"
          :display-accuracy="2"
          :animation="{
            target: config,
            attrubute: 'roughness',
          }"
        />
        <de-controller-number
          v-model="config.aoMapIntensity"
          label="环境遮挡"
          :step="0.01"
          :drag-multply="3"
          :min="0"
          :display-accuracy="2"
          :animation="{
            target: config,
            attrubute: 'aoMapIntensity',
          }"
        />
        <de-controller-number
          v-model="config.envMapIntensity"
          label="环境反射"
          :step="0.01"
          :drag-multply="3"
          :min="0"
          :display-accuracy="2"
          :animation="{
            target: config,
            attrubute: 'envMapIntensity',
          }"
        />
        <de-controller-number
          v-model="config.lightMapIntensity"
          label="光照强度"
          :step="0.01"
          :drag-multply="3"
          :min="0"
          :display-accuracy="2"
          :animation="{
            target: config,
            attrubute: 'lightMapIntensity',
          }"
        />
        <de-controller-number
          v-model="config.bumpScale"
          label="凹凸程度"
          :step="0.01"
          :drag-multply="3"
          :min="0"
          :display-accuracy="2"
          :animation="{
            target: config,
            attrubute: 'bumpScale',
          }"
        />
        <de-controller-number
          v-model="config.displacementScale"
          label="位移程度"
          :step="0.01"
          :drag-multply="3"
          :min="0"
          :display-accuracy="2"
          :animation="{
            target: config,
            attrubute: 'displacementScale',
          }"
        />
        <de-controller-number
          v-model="config.displacementBias"
          label="偏移量"
          :step="0.01"
          :drag-multply="3"
          :min="0"
          :display-accuracy="2"
          :animation="{
            target: config,
            attrubute: 'displacementBias',
          }"
        />
        <de-controller-number
          v-model="config.refractionRatio"
          label="空气折射率"
          :step="0.01"
          :drag-multply="3"
          :min="0"
          :max="1"
          :display-accuracy="2"
          :animation="{
            target: config,
            attrubute: 'refractionRatio',
          }"
        />
      </template>
    </de-collapse-layout>
    <de-collapse-layout
      label="贴图设置"
      icon="#icontexture"
      arrow-position="left"
    >
      <template #container>
        <de-controller-select
          v-model="config.map"
          label="表面贴图"
          :options="textureList"
          :prop="{
            label: 'name',
            value: 'vid',
          }"
          :animation="{
            target: config,
            attrubute: 'map',
          }"
        />
        <de-controller-select
          v-model="config.emissiveMap"
          label="反光贴图"
          :options="textureList"
          :prop="{
            label: 'name',
            value: 'vid',
          }"
          :animation="{
            target: config,
            attrubute: 'emissiveMap',
          }"
        />
        <de-controller-select
          v-model="config.alphaMap"
          label="透明贴图"
          :options="textureList"
          :prop="{
            label: 'name',
            value: 'vid',
          }"
          :animation="{
            target: config,
            attrubute: 'alphaMap',
          }"
        />
        <de-controller-select
          v-model="config.metalnessMap"
          label="金属贴图"
          :options="textureList"
          :prop="{
            label: 'name',
            value: 'vid',
          }"
          :animation="{
            target: config,
            attrubute: 'metalnessMap',
          }"
        />
        <de-controller-select
          v-model="config.roughnessMap"
          label="粗糙贴图"
          :options="textureList"
          :prop="{
            label: 'name',
            value: 'vid',
          }"
          :animation="{
            target: config,
            attrubute: 'roughnessMap',
          }"
        />
        <de-controller-select
          v-model="config.bumpMap"
          label="凹凸贴图"
          :options="textureList"
          :prop="{
            label: 'name',
            value: 'vid',
          }"
          :animation="{
            target: config,
            attrubute: 'bumpMap',
          }"
        />
        <de-controller-select
          v-model="config.displacementMap"
          label="位移贴图"
          :options="textureList"
          :prop="{
            label: 'name',
            value: 'vid',
          }"
          :animation="{
            target: config,
            attrubute: 'displacementMap',
          }"
        />
        <de-controller-select
          v-model="config.normalMap"
          label="法线贴图"
          :options="textureList"
          :prop="{
            label: 'name',
            value: 'vid',
          }"
          :animation="{
            target: config,
            attrubute: 'normalMap',
          }"
        />
        <de-controller-select
          v-model="config.envMap"
          label="环境贴图"
          :options="textureList"
          :prop="{
            label: 'name',
            value: 'vid',
          }"
          :animation="{
            target: config,
            attrubute: 'envMap',
          }"
        />
        <de-controller-select
          v-model="config.aoMap"
          label="环境遮挡贴图"
          :options="textureList"
          :prop="{
            label: 'name',
            value: 'vid',
          }"
          :animation="{
            target: config,
            attrubute: 'aoMap',
          }"
        />
        <de-controller-select
          v-model="config.lightMap"
          label="光照贴图"
          :options="textureList"
          :prop="{
            label: 'name',
            value: 'vid',
          }"
          :animation="{
            target: config,
            attrubute: 'lightMap',
          }"
        />
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
