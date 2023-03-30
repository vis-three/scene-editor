<template>
  <div class="modifierModule-container">
    <de-collapse-layout
      label="物体"
      icon="#icontietushezhi"
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
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    config() {
      return this.$store.getters["active/object"];
    },
  },
  methods: {},
};
</script>

<style lang="less" scoped>
.textureSettingModule-container {
}
</style>
