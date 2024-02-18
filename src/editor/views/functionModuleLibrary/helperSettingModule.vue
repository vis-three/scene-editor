<template>
  <div
    v-if="activeObject"
    class="helperSettingModule-container"
  >
    <div class="helperSetting-title">
      <vis-icon code="#iconjihetuxing" />
      <de-controller-input
        v-model="activeObject.name"
        label="名称"
      />
    </div>

    <el-button
      v-if="!helperConfig"
      slot="reference"
      type="primary"
      size="mini"
      @click="generateHelper"
    >
      生成辅助
    </el-button>

    <div
      v-else
      class="helperSetting-main"
    >
      <de-controller-switch
        v-model="helperConfig.shape"
        :keyframe="false"
        label="形状"
      />
      <de-controller-switch
        v-model="helperConfig.geometricOrigin"
        :keyframe="false"
        label="几何中心"
      />
      <de-controller-switch
        v-model="helperConfig.boundingBox"
        :keyframe="false"
        label="包围盒"
      />
      <de-controller-switch
        v-model="helperConfig.localAxes"
        :keyframe="false"
        label="本地坐标"
      />
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
