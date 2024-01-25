<template>
  <div class="DeepWater-container">
    <de-collapse-layout label="深水域" icon="#iconshezhi" arrowPosition="left">
      <template #container>
        <de-controller-picker
          label="水纹色泽"
          v-model="config.waterColor"
          :animation="{
            target: config,
            attribute: 'waterColor',
          }"
        ></de-controller-picker>
        <de-controller-picker
          label="光照色泽"
          v-model="config.sunColor"
          :animation="{
            target: config,
            attribute: 'sunColor',
          }"
        ></de-controller-picker>
        <de-controller-number
          label="失真度"
          :step="0.1"
          :dragMultply="5"
          :min="0"
          v-model="config.distortionScale"
          :animation="{
            target: config,
            attribute: 'distortionScale',
          }"
        ></de-controller-number>
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
          label="纹理大小"
          :step="0.1"
          :dragMultply="3"
          :min="0"
          v-model="config.size"
          :animation="{
            target: config,
            attribute: 'size',
          }"
        ></de-controller-number>
        <de-controller-select
          label="水纹法线"
          :options="textureList"
          :prop="{
            label: 'name',
            value: 'vid',
          }"
          v-model="config.waterNormals"
          :animation="{
            target: config,
            attribute: 'waterNormals',
          }"
        ></de-controller-select>
        <de-controller-select
          label="几何"
          :options="geometryList"
          :prop="{
            label: 'name',
            value: 'vid',
          }"
          v-model="config.geometry"
          :animation="{
            target: config,
            attribute: 'geometry',
          }"
        ></de-controller-select>
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
