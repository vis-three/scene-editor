<template>
  <div class="objectLibrary-container">
    <el-tabs v-model="active" type="card" @tab-click="triggle">
      <el-tab-pane
        v-for="(item, index) in list"
        :key="index"
        :name="item.component"
      >
        <div slot="label" class="tab-plane-label" v-tooltip.top="item.label">
          <vis-icon :code="item.icon"></vis-icon>
        </div>
        <component :is="item.component"></component>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import sideTabs from "@/components/sideTabs";
import sideTabItem from "@/components/sideTabItem";

const context = require.context("../objectLibrary", true, /\.vue$/, "lazy");

const components = {
  sideTabs,
  sideTabItem,
};

context.keys().forEach((url) => {
  components[
    url
      .split("/")
      .pop()
      .replace(/.\/|\.vue$/g, "")
  ] = () => context(url);
});

export default {
  components,
  data() {
    return {
      active: "",
      cacheActive: "",
      list: [
        {
          label: "参数化物体",
          icon: "#iconjihetuxing",
          component: "basic-model-library",
        },
        {
          label: "模型",
          icon: "#iconkucunfenxi",
          component: "model-library",
        },
        {
          label: "UI组件",
          icon: "#iconvuejs",
          component: "component-library",
        },
        {
          label: "灯光",
          icon: "#icondengpao",
          component: "light-library",
        },
        {
          label: "相机",
          icon: "#iconxiangji1",
          component: "camera-library",
        },
        {
          label: "材质",
          icon: "#iconcaizhi",
          component: "material-library",
        },
        {
          label: "贴图",
          icon: "#icontexture",
          component: "texture-library",
        },
        {
          label: "后期",
          icon: "#iconhouqi",
          component: "pass-library",
        },
      ],
    };
  },
  methods: {
    triggle(component) {
      if (component.name !== "" && component.name === this.cacheActive) {
        this.$nextTick(() => {
          this.active = "";
          this.cacheActive = "";
        });
      }
      this.cacheActive = this.active;
    },
  },
};
</script>

<style lang="less" scoped>
.objectLibrary-container {
  .boxSetting();

  /deep/ .el-tabs {
    .boxSetting(334px, unset);
    max-height: 70vh;
    .flexLayout(column);
    overflow: visible;

    .el-tabs__header {
      margin-bottom: 0;
    }
    .el-tabs__content {
      height: unset;
      overflow: visible;
    }
  }

  .tab-plane-label {
    .boxSetting(40px, 35px);
  }
}
</style>
