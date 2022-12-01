<template>
  <div class="camera-viewpoint-container" v-tooltip.top="'相机视角'">
    <el-select v-model="cameraView" size="mini" placeholder="请选择">
      <el-option
        v-for="(item, index) in cameraList"
        :key="index"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  props: {
    connector: {
      type: Object,
      required: true,
    },
    viewpoint: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      cameraView: "",
    };
  },
  computed: {
    cameraList() {
      const list = [
        {
          label: "默认",
          value: "",
        },
      ];

      Object.values(this.$store.getters["camera/get"]).forEach((config) => {
        list.push({
          label: config.name,
          value: config.vid,
        });
      });

      return list;
    },
  },
  watch: {
    cameraView: {
      handler(newVal) {
        if (newVal) {
          const camera = VIS.engine.compilerManager.getObjectBySymbol(newVal);
          this.connector.setCamera(camera);
        } else {
          this.connector.setViewpoint(this.viewpoint);
        }

        this.$emit("changeCamera", newVal);
      },
    },
  },
  mounted() {},
};
</script>

<style lang="less" scoped>
.camera-viewpoint-container {
  .flexLayout(row, center, center);
  width: 100px;
  background: @brighterTheme-backgroundColor;
}
</style>
