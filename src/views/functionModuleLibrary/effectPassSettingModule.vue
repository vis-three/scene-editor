<template>
  <div class="materialSettingModule-container">
    <de-collapse-layout
      v-if="config"
      label="后期"
      icon="#iconcaizhishezhi"
      arrowPosition="left"
    >
      <template #container>
        <de-controller-input
          label="名称"
          v-model="config.name"
        ></de-controller-input>
        <de-controller-input
          label="类型"
          v-model="config.label"
          disabled
        ></de-controller-input>
      </template>
    </de-collapse-layout>
    <components :config="config" :is="type"></components>
  </div>
</template>

<script>
import VisUnrealBloomPass from "./effectPassSettingModule/VisUnrealBloomPass";
import VisSMAAPass from "./effectPassSettingModule/VisSMAAPass";

import VisAfterimagePass from "./effectPassSettingModule/VisAfterimagePass.vue";
import VisFXAAShaderPass from "./effectPassSettingModule/VisFXAAShaderPass";

export default {
  components: {
    VisUnrealBloomPass,
    VisFXAAShaderPass,
    VisSMAAPass,
    VisAfterimagePass
  },
  computed: {
    config() {
      return this.$store.getters["effectPass/active"];
    },
    type() {
      if (this.config) {
        return this.config.type;
      } else {
        return false;
      }
    }
  },
  methods: {}
};
</script>

<style lang="less" scoped>
.materialSettingModule-container {
}
</style>
