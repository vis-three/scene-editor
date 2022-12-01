<template>
  <div class="render-viewpoint-container" v-tooltip.top="'视角切换'">
    <el-select v-model="cameraView" size="mini" placeholder="请选择">
      <el-option
        v-for="(item, index) in cameraViewList"
        :key="index"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
import { VIEWPOINT } from "vis-three";

export default {
  props: {
    connector: {
      type: Object,
      required: true
    },
    viewpoint: {
      type: String,
      default: VIEWPOINT.DEFAULT
    }
  },
  data() {
    return {
      cameraView: "",
      cameraViewList: [
        { label: "默认视图", value: VIEWPOINT.DEFAULT },
        { label: "俯视图", value: VIEWPOINT.TOP },
        { label: "右视图", value: VIEWPOINT.RIGHT },
        { label: "正视图", value: VIEWPOINT.FRONT },
        { label: "仰视图", value: VIEWPOINT.BOTTOM },
        { label: "左视图", value: VIEWPOINT.LEFT },
        { label: "后视图", value: VIEWPOINT.BACK }
      ]
    };
  },
  watch: {
    cameraView: {
      handler(newVal) {
        this.connector.setViewpoint(newVal);
        this.$emit("changeViewpoint", newVal);
      }
    },
    viewpoint: {
      handler(newVal) {
        this.cameraView = newVal;
      },
      immediate: true
    }
  },
  mounted() {}
};
</script>

<style lang="less" scoped>
.render-viewpoint-container {
  .flexLayout(row, center, center);
  width: 100px;
  background: @brighterTheme-backgroundColor;
}
</style>
