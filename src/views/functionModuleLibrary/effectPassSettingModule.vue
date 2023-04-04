<template>
  <drag-plane height="710px" width="100%" :showDragsign="false">
    <pass-library slot="view1"></pass-library>
    <div class="materialSettingModule-container" slot="view2">
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
  </drag-plane>
</template>

<script>
import dragPlane from "@/components/drag-plane.vue";
import passLibrary from "../objectLibrary/passLibrary.vue";

import UnrealBloomPass from "./effectPassSettingModule/UnrealBloomPass.vue";
import SMAAPass from "./effectPassSettingModule/SMAAPass.vue";

import AfterimagePass from "./effectPassSettingModule/AfterimagePass.vue";
import FXAAShaderPass from "./effectPassSettingModule/FXAAShaderPass.vue";

export default {
  components: {
    dragPlane,
    passLibrary,
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
