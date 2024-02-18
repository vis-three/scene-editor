<template>
  <drag-plane
    height="710px"
    width="100%"
    :show-dragsign="false"
  >
    <pass-library slot="view1" />
    <div
      slot="view2"
      class="materialSettingModule-container"
    >
      <de-collapse-layout
        v-if="config"
        label="后期"
        :sub-label="config.type"
        icon="#iconcaizhishezhi"
        arrow-position="left"
      >
        <template #container>
          <de-controller-input
            v-model="config.name"
            label="名称"
          />
          <de-controller-input
            v-model="config.alias"
            label="别名"
          />
          <de-controller-code
            v-model="config.meta"
            label="数据"
          />
        </template>
      </de-collapse-layout>
      <components
        :is="type"
        :config="config"
      />
    </div>
  </drag-plane>
</template>

<script>
import dragPlane from "@/editor/components/drag-plane.vue";
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
