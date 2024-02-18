<template>
  <div class="obejct3D-container">
    <de-collapse-layout
      label="点云设置"
      icon="#iconshezhi"
      arrow-position="left"
    >
      <template #container>
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
        <de-controller-select
          v-model="config.material"
          label="材质"
          :options="materialList"
          :prop="{
            label: 'name',
            value: 'vid',
          }"
          :multiple="multipleMaterial"
          :animation="{
            target: config,
            attribute: 'material',
          }"
        />
        <de-controller-switch
          v-model="multipleMaterial"
          :keyframe="false"
          label="多材质"
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
