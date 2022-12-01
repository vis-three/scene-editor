<template>
  <div class="camera-container">
    <object-collapse
      :dataList="camera"
      :clickHanlder="addCamera"
      icon="#iconxiangji2"
      label="相机"
    ></object-collapse>
  </div>
</template>

<script>
import { v4 as getUuid } from "uuid";
import { CONFIGTYPE, MODULETYPE, generateConfig } from "vis-three";
import { AddCameraAction } from "@/assets/js/action/AddCameraAction.js";
import objectCollapse from "@/templates/objectCollapse.vue";

export default {
  components: {
    objectCollapse,
  },
  data() {
    return {
      camera: [
        {
          icon: "#icontoushixiangji",
          label: "透视相机",
          camera: CONFIGTYPE.PERSPECTIVECAMERA,
        },
        {
          icon: "#icontoushixiangji",
          label: "正交相机",
          camera: CONFIGTYPE.ORTHOGRAPHICCAMERA,
        },
      ],
    };
  },
  methods: {
    addCamera(item) {
      const config = generateConfig(item.camera, {
        vid: getUuid(),
      });

      config.icon = item.icon;
      config.name = `${item.label}${config.vid.slice(-2)}`;

      VIS.history.apply(
        new AddCameraAction({
          config,
          store: this.$store,
          engine: VIS.engine,
        }),
        true
      );
    },
  },
};
</script>

<style lang="less" scoped></style>
