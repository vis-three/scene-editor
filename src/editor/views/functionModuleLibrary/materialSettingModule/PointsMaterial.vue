<template>
  <div class="PointsMaterial-container">
    <de-collapse-layout
      label="参数设置"
      icon="#iconshezhi"
      arrowPosition="left"
    >
      <template #container>
        <de-controller-picker
          :keyframe="false"
          label="材质颜色"
          v-model="config.color"
        ></de-controller-picker>
        <de-controller-switch
          :keyframe="false"
          label="深度衰减"
          v-model="config.sizeAttenuation"
        ></de-controller-switch>
        <de-controller-number
          label="点大小"
          :step="0.1"
          :dragMultply="5"
          :min="0"
          v-model="config.size"
          :animation="{
            target: config,
            attribute: 'size',
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
          :keyframe="false"
          label="表面贴图"
          :options="textureList"
          :prop="{
            label: 'name',
            value: 'vid',
          }"
          v-model="config.map"
        ></de-controller-select>

        <de-controller-select
          :keyframe="false"
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
.PointsMaterial-container {
}
</style>
