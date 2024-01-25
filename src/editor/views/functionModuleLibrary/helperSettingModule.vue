<template>
  <div class="helperSettingModule-container" v-if="activeObject">
    <div class="helperSetting-title">
      <vis-icon code="#iconjihetuxing"></vis-icon>
      <de-controller-input
        label="名称"
        v-model="activeObject.name"
      ></de-controller-input>
    </div>

    <el-button
      slot="reference"
      type="primary"
      size="mini"
      v-if="!helperConfig"
      @click="generateHelper"
    >
      生成辅助
    </el-button>

    <div class="helperSetting-main" v-else>
      <de-controller-switch
        :keyframe="false"
        label="形状"
        v-model="helperConfig.shape"
      ></de-controller-switch>
      <de-controller-switch
        :keyframe="false"
        label="几何中心"
        v-model="helperConfig.geometricOrigin"
      ></de-controller-switch>
      <de-controller-switch
        :keyframe="false"
        label="包围盒"
        v-model="helperConfig.boundingBox"
      ></de-controller-switch>
      <de-controller-switch
        :keyframe="false"
        label="本地坐标"
        v-model="helperConfig.localAxes"
      ></de-controller-switch>
    </div>
  </div>
</template>

<script>
import { CONFIGTYPE, generateConfig } from "@vis-three/middleware";

export default {
  computed: {
    activeObject() {
      return this.$store.getters["active/object"];
    },
    helperConfig() {
      return this.$store.getters["helper/get"][this.activeObject.helper];
    },
  },
  methods: {
    generateHelper() {
      const helper = generateConfig(CONFIGTYPE.OBJECTHELPER, {
        target: this.activeObject.vid,
        shape: true,
      });

      this.$store.commit("helper/add", helper);
      console.log(helper);
    },
  },
};
</script>

<style lang="less" scoped>
.helperSettingModule-container {
  padding: @box-padding;
  width: 100%;

  .helperSetting-title {
    .flexLayout();
    .icon-container {
      color: @theme-color;
      margin-right: (@box-margin / 2);
    }
  }

  .el-button {
    width: 100%;
  }
}
</style>
