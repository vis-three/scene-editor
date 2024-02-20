<template>
  <div class="ShaderMaterial-container">
    <el-button
      v-if="!config.shader"
      size="mini"
      type="primary"
      @click="openShaderLibrary"
    >
      选择作色器
    </el-button>
    <de-collapse-layout
      v-if="config.shader"
      label="参数设置"
      icon="#iconshezhi"
      arrowPosition="left"
    >
      <template #container>
        <component
          slot="container"
          v-for="(item, index) in controllers"
          :key="index"
          :is="item.component"
          :label="item.label"
          v-model="config.uniforms[item.key].value"
          v-bind="item.props"
          :keyframe="true"
          :animation="{
            target: config,
            attribute: `uniforms.${item.key}.value`,
          }"
        ></component>
      </template>
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
    configuration() {
      return this.config.shader
        ? this.$store.getters["shader/configuration"][this.config.vid]
        : null;
    },
    controllers() {
      return this.config.shader ? translater(this.configuration) : null;
    },
    textureList() {
      const list = [
        {
          name: "无",
          vid: "",
        },
      ];
      const textureMap = this.$store.getters["texture/get"];
      Object.keys(textureMap).forEach((vid) => {
        list.push({
          vid,
          name: textureMap[vid].name,
        });
      });
      return list;
    },
  },
};
</script>

<style lang="less" scoped>
.ShaderMaterial-container {
  > .el-button {
    width: 100%;
  }
}
</style>
