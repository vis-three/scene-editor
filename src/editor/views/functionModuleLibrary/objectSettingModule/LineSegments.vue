<template>
  <div class="obejct3D-container">
    <de-collapse-layout
      label="网格设置"
      icon="#iconshezhi"
      arrowPosition="left"
    >
      <template #container>
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
        <de-controller-select
          label="材质"
          :options="materialList"
          :prop="{
            label: 'name',
            value: 'vid',
          }"
          :multiple="multipleMaterial"
          v-model="config.material"
          :animation="{
            target: config,
            attribute: 'material',
          }"
        ></de-controller-select>
        <de-controller-switch
          :keyframe="false"
          label="多材质"
          v-model="multipleMaterial"
        ></de-controller-switch>
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
    multipleMaterial: {
      get() {
        return Array.isArray(this.config.material);
      },
      set(value) {
        if (value) {
          this.config.material = [this.config.material];
        } else {
          this.config.material = this.config.material[0] || "";
        }
      },
    },

    materialList() {
      return [
        {
          name: "无",
          vid: "",
        },
      ].concat(this.$store.getters["material/list"]);
    },

    geometryList() {
      return this.$store.getters["geometry/list"];
    },
  },
};
</script>

<style lang="less" scoped></style>
