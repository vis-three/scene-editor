<template>
  <div class="PointsMaterial-container">
    <de-collapse-layout
      label="参数设置"
      icon="#iconshezhi"
      arrow-position="left"
    >
      <template #container>
        <de-controller-picker
          v-model="config.color"
          :keyframe="false"
          label="材质颜色"
        />
        <de-controller-switch
          v-model="config.sizeAttenuation"
          :keyframe="false"
          label="深度衰减"
        />
        <de-controller-number
          v-model="config.size"
          label="点大小"
          :step="0.1"
          :drag-multply="5"
          :min="0"
          :animation="{
            target: config,
            attribute: 'size',
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
          :keyframe="false"
          label="表面贴图"
          :options="textureList"
          :prop="{
            label: 'name',
            value: 'vid',
          }"
        />

        <de-controller-select
          v-model="config.alphaMap"
          :keyframe="false"
          label="透明贴图"
          :options="textureList"
          :prop="{
            label: 'name',
            value: 'vid',
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
.PointsMaterial-container {
}
</style>
