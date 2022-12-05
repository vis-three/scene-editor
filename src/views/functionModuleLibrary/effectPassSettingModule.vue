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
          v-model="config.type"
          disabled
        ></de-controller-input>
      </template>
    </de-collapse-layout>
    <components :config="config" :is="type"></components>
  </div>
</template>

<script>
import UnrealBloomPass from "./effectPassSettingModule/UnrealBloomPass";
import SMAAPass from "./effectPassSettingModule/SMAAPass";

import AfterimagePass from "./effectPassSettingModule/AfterimagePass.vue";
import FXAAShaderPass from "./effectPassSettingModule/FXAAShaderPass";

export default {
  components: {
    UnrealBloomPass,
    FXAAShaderPass,
    SMAAPass,
    AfterimagePass,
  },
  computed: {
    config() {
      console.log(this.$store.getters["active/pass"]);
      return this.$store.getters["active/pass"];
    },
    type() {
      if (this.config) {
        return this.config.type;
      } else {
        return false;
      }
    },
  },
  methods: {},
};
</script>

<style lang="less" scoped>
.materialSettingModule-container {
}
</style>
