<template>
  <div class="camera-container">
    <object-collapse
      v-for="(item, index) in list"
      :key="index"
      :data-list="item.list"
      :click-hanlder="item.click"
      :icon="item.icon"
      :label="item.label"
    />
  </div>
</template>

<script>
import {
  CONFIGTYPE,
  MODULETYPE,
  generateConfig,
  AniScriptGeneratorManager,
  createSymbol,
} from "@vis-three/middleware";
import { AddCameraAction } from "@/editor/assets/js/action/AddCameraAction.js";
import objectCollapse from "@/editor/templates/objectCollapse.vue";
import { engine } from "@/editor/assets/js/vis";

export default {
  components: {
    objectCollapse,
  },
  data() {
    return {
      list: [
        {
          icon: "#iconxiangji",
          label: "相机",
          list: [
            {
              icon: "#icontoushixiangji",
              label: "透视相机",
              camera: CONFIGTYPE.PERSPECTIVECAMERA,
            },
            {
              icon: "#iconzhengjiaoxiangji",
              label: "正交相机",
              camera: CONFIGTYPE.ORTHOGRAPHICCAMERA,
            },
          ],
          click(item) {
            const config = generateConfig(item.camera, {
              vid: createSymbol(),
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
        {
          icon: "#iconic_shuiliu",
          label: "水域",
          list: [
            {
              icon: "#iconic_shuiliu",
              label: "深水",
              type: CONFIGTYPE.DEEPWATER,
            },
          ],
          click(item) {
            const geometry = generateConfig(CONFIGTYPE.PLANEGEOMETRY, {
              width: 200,
              height: 200,
            });

            this.$store.commit("geometry/add", geometry);

            const water = generateConfig(item.type, {
              geometry: geometry.vid,
              rotation: {
                x: -Math.PI / 2,
              },
            });
            water.name = `${item.label}-${water.vid.slice(-2)}`;

            this.$store.commit("water/add", water);

            this.$store.getters["scene/currentScene"].children.push(water.vid);

            const config = generateConfig(
              CONFIGTYPE.SCRIPTANIMATION,
              {
                target: water.vid,
                attribute: ".material.uniforms.time.value",
                script: AniScriptGeneratorManager.generateConfig("linearTime"),
              },
              { strict: false }
            );

            engine.applyConfig(config);
          },
        },
        {
          icon: "#iconpitaya-YSguanli",
          label: "粒子",
          list: [
            {
              icon: "#iconpitaya-YSguanli",
              label: "漂浮粒子",
              type: CONFIGTYPE.FLOATPARTICLE,
            },
          ],
          click(item) {
            const particle = generateConfig(item.type, {
              amount: 1000,
            });
            particle.name = `${item.label}-${particle.vid.slice(-2)}`;
            this.$store.commit("particle/add", particle);

            this.$store.getters["scene/currentScene"].children.push(
              particle.vid
            );

            const config = generateConfig(
              CONFIGTYPE.SCRIPTANIMATION,
              {
                target: particle.vid,
                attribute: ".material.uniforms.time.value",
                script: AniScriptGeneratorManager.generateConfig("linearTime"),
              },
              { strict: false }
            );

            engine.applyConfig(config);
          },
        },
      ],
    };
  },
  methods: {},
};
</script>

<style lang="less" scoped></style>
