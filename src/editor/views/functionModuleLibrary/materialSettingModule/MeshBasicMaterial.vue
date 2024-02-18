<template>
  <div class="MeshBasicMaterial-container">
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
            attribute: 'wireframe',
          }"
        />
        <de-controller-picker
          v-model="config.color"
          label="材质颜色"
          :animation="{
            target: config,
            attribute: 'color',
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
            attribute: 'aoMapIntensity',
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
            attribute: 'lightMapIntensity',
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
            attribute: 'refractionRatio',
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
            attribute: 'map',
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
            attribute: 'alphaMap',
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
            attribute: 'envMap',
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
            attribute: 'aoMap',
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
.MeshBasicMaterial-container {
}
</style>
