<template>
  <div class="MeshBasicMaterial-container">
    <de-collapse-layout
      label="参数设置"
      icon="#iconshezhi"
      arrowPosition="left"
    >
      <template #container>
        <de-controller-picker
          label="材质颜色"
          v-model="config.color"
        ></de-controller-picker>
        <de-controller-switch
          label="深度衰减"
          v-model="config.sizeAttenuation"
        ></de-controller-switch>
        <de-controller-number
          label="转动角度"
          :step="0.01"
          :dragMultply="3"
          :min="0"
          :displayAccuracy="2"
          unit="°"
          v-model="config.rotation"
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
        ></de-controller-select>

        <de-controller-select
          label="透明贴图"
          :options="textureList"
          :prop="{
            label: 'name',
            value: 'vid',
          }"
          v-model="config.alphaMap"
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
.MeshBasicMaterial-container {
}
</style>
