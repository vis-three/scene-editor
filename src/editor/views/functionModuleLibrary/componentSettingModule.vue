<template>
  <div
    v-if="cid"
    class="componentSettingModule-container"
  >
    <de-collapse-layout
      label="组件配置"
      icon="#iconvuejs"
      arrow-position="left"
    >
      <component
        :is="item.component"
        v-for="(item, index) in controllers"
        slot="container"
        :key="index"
        v-model="config[item.key]"
        :label="item.label"
        v-bind="item.props"
        :keyframe="false"
      />
    </de-collapse-layout>
  </div>
</template>

<script>
import { translater } from "@/editor/assets/js/configurationTranslater";

export default {
  computed: {
    cid() {
      return this.$store.getters["active/object"].element;
    },
    // 组件配置
    config() {
      return this.cid ? this.$store.getters["component/get"][this.cid] : null;
    },
    // 配置单
    configuration() {
      return this.cid
        ? this.$store.getters["component/configuration"][this.cid]
        : null;
    },
    controllers() {
      return this.cid ? translater(this.configuration) : null;
    },
  },
};
</script>

<style lang="less" scoped></style>
