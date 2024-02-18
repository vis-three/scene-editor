<template>
  <div class="DeepWater-container">
    <de-collapse-layout
      label="深水域"
      icon="#iconshezhi"
      arrow-position="left"
    >
      <template #container>
        <de-controller-picker
          v-model="config.waterColor"
          label="水纹色泽"
          :animation="{
            target: config,
            attribute: 'waterColor',
          }"
        />
        <de-controller-picker
          v-model="config.sunColor"
          label="光照色泽"
          :animation="{
            target: config,
            attribute: 'sunColor',
          }"
        />
        <de-controller-number
          v-model="config.distortionScale"
          label="失真度"
          :step="0.1"
          :drag-multply="5"
          :min="0"
          :animation="{
            target: config,
            attribute: 'distortionScale',
          }"
        />
        <!-- <de-controller-number
          label="透明度"
          :step="0.1"
          :dragMultply="3"
          :min="0"
          v-model="config.alpha"
          :animation="{
            target: config,
            attribute: 'alpha',
          }"
        ></de-controller-number> -->
        <de-controller-number
          v-model="config.size"
          label="纹理大小"
          :step="0.1"
          :drag-multply="3"
          :min="0"
          :animation="{
            target: config,
            attribute: 'size',
          }"
        />
        <de-controller-select
          v-model="config.waterNormals"
          label="水纹法线"
          :options="textureList"
          :prop="{
            label: 'name',
            value: 'vid',
          }"
          :animation="{
            target: config,
            attribute: 'waterNormals',
          }"
        />
        <de-controller-select
          v-model="config.geometry"
          label="几何"
          :options="geometryList"
          :prop="{
            label: 'name',
            value: 'vid',
          }"
          :animation="{
            target: config,
            attribute: 'geometry',
          }"
        />
      </template>
    </de-collapse-layout>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    config: {
      type: Object,
      required: true,
    },
  },
  computed: {
    geometryList() {
      return this.$store.getters["geometry/list"];
    },
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

<style lang="less" scoped></style>
