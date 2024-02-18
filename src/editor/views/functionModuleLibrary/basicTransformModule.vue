<template>
  <div class="basicTransformModule-container">
    <de-collapse-layout
      v-for="(item, index) in activeModelList"
      :key="index"
      :label="$store.getters['attribute/nameMap'][item]"
      :icon="$store.getters['attribute/iconMap'][item]"
      arrow-position="left"
    >
      <template #container>
        <de-controller-vector3
          v-model="$store.getters['attribute/configMap'][item].position"
          label="位置"
          :step="1"
          :display-accuracy="displayAccuracy"
          :animation="{
            target: item,
            attribute: 'position',
          }"
        />
        <de-controller-vector3
          v-model="$store.getters['attribute/configMap'][item].rotation"
          label="旋转"
          :step="1"
          :display-accuracy="displayAccuracy"
          unit="°"
          :animation="{
            target: item,
            attribute: 'rotation',
          }"
        />
        <de-controller-vector3
          v-model="$store.getters['attribute/configMap'][item].scale"
          label="缩放"
          :step="1"
          :display-accuracy="displayAccuracy"
          :animation="{
            target: item,
            attribute: 'scale',
          }"
        />
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
  watch: {},
  methods: {},
};
</script>

<style lang="less" scoped></style>
