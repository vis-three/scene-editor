<template>
  <div class="componentCanvas-container" ref="componentCanvas">
    <component-trans-box
      v-for="item in componentStructureList"
      :key="item.id"
      :newStatus="item.newStatus"
      :top="item.top"
      :left="item.left"
      :width="item.width"
      :height="item.height"
      :opacity="item.opacity"
      :rotate="item.rotate"
      :id="item.id"
      :zIndex="item.zIndex"
      :componentType="item.componentType"
      :config="item.config.config"
    ></component-trans-box>
  </div>
</template>

<script>
import componentTransBox from "@/components/componentTransBox";
export default {
  components: {
    componentTransBox // 组件形变盒子
  },
  props: {
    width: null, // 宽度
    height: null
  },
  computed: {
    // 组件构造列表
    componentStructureList() {
      return this.$store.getters.getComponentStructureList;
    }
  },
  mounted() {}
};
</script>

<style lang="less" scoped>
.componentCanvas-container {
  .absolutePosition();
}
</style>
