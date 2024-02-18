<template>
  <div class="functionModelLibrary-container">
    <side-tabs
      cache
      :active="functionModule"
    >
      <side-tab-item
        icon="#iconchangjing1"
        title="渲染器设置"
      >
        <renderer-setting-module />
      </side-tab-item>
      <side-tab-item
        icon="#iconchangjing2"
        title="场景设置"
      >
        <scene-setting-module />
      </side-tab-item>
      <side-tab-item
        icon="#iconhouqi"
        title="后期配置"
      >
        <effect-pass-setting-module />
      </side-tab-item>
      <side-tab-item
        icon="#iconzhuanshupeizhi"
        title="物体配置"
      >
        <object-setting-module />
      </side-tab-item>
      <side-tab-item
        icon="#iconcaizhishezhi"
        title="材质配置"
      >
        <material-setting-module />
      </side-tab-item>
      <side-tab-item
        icon="#icontietushezhi"
        title="贴图配置"
      >
        <texture-setting-module />
      </side-tab-item>
      <side-tab-item
        icon="#iconjiaohu"
        title="交互配置"
      >
        <interact-setting-module />
      </side-tab-item>
      <side-tab-item
        icon="#iconbanshou"
        title="修改器"
      >
        <modifier-module />
      </side-tab-item>
      <side-tab-item
        icon="#iconyueshu"
        title="约束器"
      >
        <constraintor-module />
      </side-tab-item>
      <side-tab-item
        icon="#iconxiankuang"
        title="辅助配置"
      >
        <helper-setting-module />
      </side-tab-item>
    </side-tabs>
  </div>
</template>

<script>
import sideTabs from "@/editor/components/sideTabs.vue";
import sideTabItem from "@/editor/components/sideTabItem.vue";

const context = import.meta.glob("./functionModuleLibrary/*.vue");

const components = { sideTabs, sideTabItem };

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
  data() {
    return {
      modules: [
        "renderer",
        "scene",
        "effect",
        "object",
        "material",
        "texture",
        "interact",
        "modifier",
        "helper",
      ],
    };
  },

  computed: {
    functionModule() {
      return this.$store.getters["active/functionModule"];
    },
  },

  mounted() {
    this.$store.commit("active/initFunctionModules", this.modules);
  },
};
</script>

<style lang="less" scoped>
.functionModelLibrary-container {
  .boxSetting();
}
</style>
