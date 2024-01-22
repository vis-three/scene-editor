<template>
  <drag-plane height="710px" width="100%" :showDragsign="false">
    <pass-library slot="view1"></pass-library>
    <div class="materialSettingModule-container" slot="view2">
      <de-collapse-layout
        v-if="config"
        label="后期"
        :subLabel="config.type"
        icon="#iconcaizhishezhi"
        arrowPosition="left"
      >
        <template #container>
          <de-controller-input
            label="名称"
            v-model="config.name"
          ></de-controller-input>
          <de-controller-input
            label="别名"
            v-model="config.alias"
          ></de-controller-input>
          <de-controller-code
            label="数据"
            v-model="config.meta"
          ></de-controller-code>
        </template>
      </de-collapse-layout>
      <components :config="config" :is="type"></components>
    </div>
  </drag-plane>
</template>

<script>
import dragPlane from "@/components/drag-plane.vue";
import passLibrary from "../objectLibrary/passLibrary.vue";

const components = { dragPlane, passLibrary };

const context = import.meta.glob("./effectPassSettingModule/*.vue");

Object.keys(context).forEach((url) => {
  components[
    url
      .split("/")
      .pop()
      .replace(/.\/|\.vue$/g, "")
  ] = context[url];
});

export default {
  components,
  computed: {
    config() {
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
