<template>
  <div class="functionModelLibrary-container">
    <side-tabs cache>
      <side-tab-item icon="#iconchangjing1" title="渲染器设置">
        <renderer-setting-module></renderer-setting-module>
      </side-tab-item>
      <side-tab-item icon="#iconchangjing2" title="场景设置">
        <scene-setting-module></scene-setting-module>
      </side-tab-item>
      <side-tab-item icon="#iconhouqi" title="后期配置">
        <effect-pass-setting-module></effect-pass-setting-module>
      </side-tab-item>
      <side-tab-item icon="#iconzhuanshupeizhi" title="物体配置">
        <object-setting-module></object-setting-module>
      </side-tab-item>
      <side-tab-item icon="#iconcaizhishezhi" title="材质配置">
        <material-setting-module></material-setting-module>
      </side-tab-item>
      <side-tab-item icon="#icontietushezhi" title="贴图配置">
        <texture-setting-module></texture-setting-module>
      </side-tab-item>
      <side-tab-item icon="#iconjiaohu" title="交互配置">
        <interact-setting-module></interact-setting-module>
      </side-tab-item>
      <side-tab-item icon="#iconbanshou" title="修改器">
        <modifier-module></modifier-module>
      </side-tab-item>
    </side-tabs>
  </div>
</template>

<script>
import sideTabs from "@/components/sideTabs.vue";
import sideTabItem from "@/components/sideTabItem.vue";

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
    return {};
  },
};
</script>

<style lang="less" scoped>
.functionModelLibrary-container {
  .boxSetting();
}
</style>
