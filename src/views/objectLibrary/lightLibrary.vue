<template>
  <div class="light-container">
    <object-collapse
      :dataList="light"
      :clickHanlder="addLight"
      icon="#icondengpao"
      label="灯光"
    ></object-collapse>
  </div>
</template>

<script>
import { v4 as getUuid } from "uuid";
import { CONFIGTYPE, generateConfig, MODULETYPE } from "@vis-three/middleware";
import { AddLightAction } from "@/assets/js/action/AddLightAction.js";
import objectCollapse from "@/templates/objectCollapse.vue";
import Vue from "vue";

export default {
  components: {
    objectCollapse,
  },
  data() {
    return {
      light: [
        {
          icon: "#iconhuanjingguang",
          label: "环境光",
          light: CONFIGTYPE.AMBIENTLIGHT,
        },
        {
          icon: "#icondengpao",
          label: "点光",
          light: CONFIGTYPE.POINTLIGHT,
        },
        {
          icon: "#iconjuguang",
          label: "聚光",
          light: CONFIGTYPE.SPOTLIGHT,
        },
        {
          icon: "#iconpinghangguang",
          label: "平行光",
          light: CONFIGTYPE.DIRECTIONALLIGHT,
        },
        {
          icon: "#iconbanqiuguang",
          label: "半球光",
          light: CONFIGTYPE.HEMISPHERELIGHT,
        },
        {
          icon: "#iconpingmianguang",
          label: "平面光",
          light: CONFIGTYPE.RECTAREALIGHT,
        },
      ],
    };
  },
  methods: {
    addLight(item) {
      const config = generateConfig(item.light, {
        vid: getUuid(),
      });
      config.name = `${item.label}-${config.vid.slice(-2)}`;

      const helper = generateConfig(CONFIGTYPE.OBJECTHELPER, {
        target: config.vid,
        shape: true,
      });

      VIS.history.apply(
        new AddLightAction({
          config,
          helper,
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
