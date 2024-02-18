<template>
  <div class="CanvasTexture-container">
    <de-collapse-layout
      v-if="config.url"
      label="画布配置"
      icon="#iconvuejs"
      arrow-position="left"
    >
      <component
        :is="item.component"
        v-for="(item, index) in controllers"
        slot="container"
        :key="index"
        v-model="canvas[item.key]"
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
  props: {
    config: {
      type: Object,
      required: true,
    },
  },

  computed: {
    texture() {
      return this.$store.getters["texture/currentTexture"];
    },
    canvas() {
      return this.$store.getters["canvas/get"][this.texture.url];
    },
    configuration() {
      return this.texture.url
        ? this.$store.getters["canvas/configuration"][this.texture.url]
        : null;
    },
    controllers() {
      return this.texture.url ? translater(this.configuration) : null;
    },
  },
};
</script>

<style lang="less" scoped>
.CanvasTexture-container {
  padding: 0 @box-padding;
  > .el-button {
    width: 100%;
  }
}
</style>
