<template>
  <div class="camera-container">
    <object-collapse
      :data-list="camera"
      :click-hanlder="addCamera"
      icon="#iconxiangji2"
      label="相机"
    />
  </div>
</template>

<script>
import { v4 as getUuid } from "uuid";
import { CONFIGTYPE, MODULETYPE, generateConfig } from "@vis-three/middleware";
import { AddCameraAction } from "@/editor/assets/js/action/AddCameraAction.js";
import objectCollapse from "@/editor/templates/objectCollapse.vue";

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
