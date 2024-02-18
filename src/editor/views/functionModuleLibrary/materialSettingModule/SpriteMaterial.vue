<template>
  <div class="MeshBasicMaterial-container">
    <de-collapse-layout
      label="参数设置"
      icon="#iconshezhi"
      arrow-position="left"
    >
      <template #container>
        <de-controller-picker
          v-model="config.color"
          label="材质颜色"
          :animation="{
            target: config,
            attrubute: 'color',
          }"
        />
        <de-controller-switch
          v-model="config.sizeAttenuation"
          :keyframe="false"
          label="深度衰减"
        />
        <de-controller-number
          v-model="config.rotation"
          label="转动角度"
          :step="0.01"
          :drag-multply="3"
          :min="0"
          :display-accuracy="2"
          unit="°"
          :animation="{
            target: config,
            attrubute: 'rotation',
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
