<template>
  <div class="basicTransformModule-container">
    <de-collapse-layout
      v-for="(item, index) in activeModelList"
      :key="index"
      :label="$store.getters['attribute/nameMap'][item]"
      :icon="$store.getters['attribute/iconMap'][item]"
      arrowPosition="left"
    >
      <template #container>
        <de-controller-vector3
          label="位置"
          :step="1"
          :displayAccuracy="displayAccuracy"
          v-model="$store.getters['attribute/configMap'][item].position"
          :animation="{
            target: item,
            attribute: 'position',
          }"
        ></de-controller-vector3>
        <de-controller-vector3
          label="旋转"
          :step="1"
          :displayAccuracy="displayAccuracy"
          unit="°"
          v-model="$store.getters['attribute/configMap'][item].rotation"
          :animation="{
            target: item,
            attribute: 'rotation',
          }"
        ></de-controller-vector3>
        <de-controller-vector3
          label="缩放"
          :step="1"
          :displayAccuracy="displayAccuracy"
          v-model="$store.getters['attribute/configMap'][item].scale"
          :animation="{
            target: item,
            attribute: 'scale',
          }"
        ></de-controller-vector3>
      </template>
    </de-collapse-layout>
  </div>
</template>

<script>
export default {
  data() {
    return {
      displayAccuracy: 2,
      bufferData: "",
      activeModelList: [],
    };
  },
  computed: {},
  methods: {},
  watch: {},
};
</script>

<style lang="less" scoped></style>
