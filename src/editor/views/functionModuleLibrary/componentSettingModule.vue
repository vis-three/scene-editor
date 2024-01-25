<template>
  <div class="componentSettingModule-container" v-if="cid">
    <de-collapse-layout label="组件配置" icon="#iconvuejs" arrowPosition="left">
      <component
        slot="container"
        v-for="(item, index) in controllers"
        :key="index"
        :is="item.component"
        :label="item.label"
        v-model="config[item.key]"
        v-bind="item.props"
        :keyframe="false"
      ></component>
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
