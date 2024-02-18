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
            attribute: 'color',
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
