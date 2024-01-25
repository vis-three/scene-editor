<template>
  <div class="basicElement-container">
    <object-collapse
      v-for="(item, index) in list"
      :key="index"
      :dataList="item.list"
      :clickHanlder="item.click"
      :icon="item.icon"
      :label="item.label"
    ></object-collapse>
  </div>
</template>

<script>
import {
  CONFIGMODULE,
  CONFIGTYPE,
  generateConfig,
} from "@vis-three/middleware";
import objectCollapse from "@/editor/templates/objectCollapse.vue";
import { engine, history } from "@/editor/assets/js/vis";

import { AddMeshAction } from "@/editor/assets/js/action/AddMeshAction";
import { AddLineAction } from "@/editor/assets/js/action/AddLineAction";
import { AddCSS3DAction } from "@/editor/assets/js/action/AddCSS3DAction";
import { AddCSS2DAction } from "@/editor/assets/js/action/AddCSS2DAction";
import { AddSpriteAction } from "@/editor/assets/js/action/AddSpriteAction";
import { AddObjectAction } from "@/editor/assets/js/action/AddObjectAction";
import { AddPointsAction } from "@/editor/assets/js/action/AddPointsAction";

export default {
  components: {
    objectCollapse,
  },
  data() {
    return {
      list: [
        {
          icon: "#iconpingmianjihe",
          label: "参数物体",
          list: [
            {
              icon: "#iconlifangti",
              label: "立方体",
              geometry: CONFIGTYPE.BOXGEOMETRY,
            },
            {
              icon: "#iconqiuti",
              label: "球体",
              geometry: CONFIGTYPE.SPHEREGEOMETRY,
            },
            {
              icon: "#iconzhuiti",
              label: "锥体",
              geometry: CONFIGTYPE.CONEGEOMETRY,
            },
            {
              icon: "#iconzhuti",
              label: "柱体",
              geometry: CONFIGTYPE.CYLINDERGEOMETRY,
            },
            {
              icon: "#iconhuanti",
              label: "环体",
              geometry: CONFIGTYPE.TORUSGEOMETRY,
            },
            {
              icon: "#iconjiyati",
              label: "挤压体",
              geometry: CONFIGTYPE.EXTRUDEGEOMETRY,
            },
            {
              icon: "#iconjuxing",
              label: "矩形",
              geometry: CONFIGTYPE.PLANEGEOMETRY,
            },
            {
              icon: "#iconyuanxing1",
              label: "圆形",
              geometry: CONFIGTYPE.CIRCLEGEOMETRY,
            },
            {
              icon: "#iconyuanhuan",
              label: "圆环",
              geometry: CONFIGTYPE.RINGGEOMETRY,
            },
          ],
          click: function (item) {
            const geometryConfig = generateConfig(item.geometry, undefined, {
              observer: false,
            });
            const meshConfig = generateConfig(CONFIGTYPE.MESH, undefined, {
              observer: false,
            });

            meshConfig.icon = item.icon;
            meshConfig.name = `${item.label}-${meshConfig.vid.slice(-2)}`;
            meshConfig.geometry = geometryConfig.vid;
            geometryConfig.name = `${meshConfig.name}的几何`;

            const helperConfig = generateConfig(
              CONFIGTYPE.OBJECTHELPER,
              {
                target: meshConfig.vid,
                shape: true,
              },
              {
                observer: false,
              }
            );

            history.apply(
              new AddMeshAction({
                geometryConfig,
                meshConfig,
                helperConfig,
                store: this.$store,
                engine: VIS.engine,
              }),
              true
            );
          },
        },
        {
          icon: "#iconpingmianjihe",
          label: "路径与形状",
          list: [
            {
              icon: "#iconlujing",
              label: "路径",
              click: function (item) {
                const path = generateConfig(CONFIGTYPE.PATH, {
                  curves: [],
                });

                path.name = `路径-${path.vid.slice(-2)}`;

                engine.applyConfig(path);

                const geometry = generateConfig(CONFIGTYPE.PATHGEOMETRY, {
                  path: path.vid,
                  space: false,
                });
                const line = generateConfig(CONFIGTYPE.LINE, {
                  geometry: geometry.vid,
                });

                line.name = `${item.label}-${line.vid.slice(-2)}`;

                geometry.name = `路径几何-${line.name}`;

                engine.applyConfig(geometry, line);

                const scene = this.$store.getters["scene/currentScene"];

                scene.children.push(line.vid);

                this.$store.commit("line/notify");

                this.$store.commit("path/draw", {
                  status: !this.draw,
                  geometry: geometry,
                });

                //TODO: add action
                // history.apply(
                //   new AddLineAction({
                //     engine,
                //     store: this.$store,
                //     geometry,
                //     line,
                //   }),
                //   true
                // );
              },
            },
            {
              icon: "#iconxingzhuang",
              label: "形状",
              click: function () {
                const shape = generateConfig(CONFIGTYPE.SHAPE);

                shape.name = `形状-${shape.vid.slice(-2)}`;

                engine.applyConfig(shape);

                const geometry = generateConfig(CONFIGTYPE.SHAPEGEOMETRY, {
                  shape: shape.vid,
                });
                const mesh = generateConfig(CONFIGTYPE.MESH, {
                  geometry: geometry.vid,
                });
                mesh.name = `${item.label}-${mesh.vid.slice(-2)}`;

                history.apply(
                  new AddMeshAction({
                    geometryConfig: geometry,
                    meshConfig: mesh,
                    store: this.$store,
                    engine,
                  }),
                  true
                );
              },
            },
            {
              icon: "#iconguandao",
              label: "管道",
              geometry: CONFIGTYPE.PATHTUBEGEOMETRY,
            },
            {
              icon: "#iconxixian",
              label: "细线",
              object: CONFIGTYPE.LINE,
            },
            {
              icon: "#iconcuxian",
              label: "粗线",
              object: CONFIGTYPE.LINE2,
            },
            {
              icon: "#icondianyun",
              label: "点云",
              object: CONFIGTYPE.POINTS,
              click: function (item) {
                const material = generateConfig(
                  CONFIGTYPE.POINTSMATERIAL,
                  undefined,
                  {
                    observer: false,
                  }
                );
                const points = generateConfig(
                  CONFIGTYPE.POINTS,
                  {
                    material: material.vid,
                  },
                  {
                    observer: false,
                  }
                );
                points.name = `点云-${points.vid.slice(-2)}`;
                points.icon = item.icon;
                material.name = `${points.name}的材质`;

                history.apply(
                  new AddPointsAction({
                    materialConfig: material,
                    pointsConfig: points,
                    store: this.$store,
                    engine,
                  }),
                  true
                );
              },
            },
            {
              icon: "#iconwanggehua",
              label: "网格",
              click: function (item) {
                this.$message.info("请选择场景中的一个几何物体。");

                const selectFun = (event) => {
                  const objectConfig = engine.getConfigBySymbol(
                    event.objectSymbols[0]
                  );

                  if (!objectConfig) {
                    console.error(
                      `engine can not found object with vid: ${event.objectSymbols[0]}`
                    );
                    return;
                  }

                  const geometry = generateConfig(
                    CONFIGTYPE.EDGESGEOMETRY,
                    {
                      target: objectConfig.geometry,
                      thresholdAngle: 0,
                    },
                    {
                      observer: false,
                    }
                  );

                  const line = generateConfig(
                    CONFIGTYPE.LINE,
                    {
                      geometry: geometry.vid,
                    },
                    {
                      observer: false,
                    }
                  );

                  line.name = `${item.label}-${line.vid.slice(-2)}`;

                  geometry.name = `网格几何-${line.name}`;

                  history.apply(
                    new AddLineAction({
                      engine,
                      store: this.$store,
                      line,
                      geometry,
                    }),
                    true
                  );

                  engine.removeEventListener("selected", selectFun);
                };

                engine.addEventListener("selected", selectFun);
              },
            },
            {
              icon: "#iconlifangti",
              label: "描边",
              click: function (item) {
                this.$message.info("请选择场景中的一个几何物体。");

                const selectFun = (event) => {
                  const objectConfig = engine.getConfigBySymbol(
                    event.objectSymbols[0]
                  );

                  if (!objectConfig) {
                    console.error(
                      `engine can not found object with vid: ${event.objectSymbols[0]}`
                    );
                    return;
                  }

                  const geometry = generateConfig(
                    CONFIGTYPE.EDGESGEOMETRY,
                    {
                      target: objectConfig.geometry,
                      thresholdAngle: 1,
                    },
                    {
                      observer: false,
                    }
                  );

                  const line = generateConfig(
                    CONFIGTYPE.LINESEGMENTS,
                    {
                      geometry: geometry.vid,
                    },
                    {
                      observer: false,
                    }
                  );

                  line.name = `${item.label}-${line.vid.slice(-2)}`;

                  geometry.name = `描边几何-${line.name}`;

                  history.apply(
                    new AddLineAction({
                      engine,
                      store: this.$store,
                      line,
                      geometry,
                    }),
                    true
                  );

                  engine.removeEventListener("selected", selectFun);
                };

                engine.addEventListener("selected", selectFun);
              },
            },
          ],
          click: function (item) {
            if (item.click) {
              item.click.call(this, item);
            }
          },
        },
        {
          icon: "#iconpingmianjihe",
          label: "平面",
          list: [
            {
              icon: "#iconjingling",
              label: "精灵",
              click: function (item) {
                const config = generateConfig(
                  CONFIGTYPE.SPRITE,
                  {},
                  {
                    observer: false,
                  }
                );
                config.name = `${item.label}-${config.vid.slice(-2)}`;

                history.apply(
                  new AddSpriteAction({
                    engine,
                    store: this.$store,
                    config,
                  }),
                  true
                );
              },
            },
            {
              icon: "#iconC2jingling",
              label: "C2精灵",
              click: function (item) {
                const config = generateConfig(
                  CONFIGTYPE.CSS2DPLANE,
                  {
                    width: 200,
                    height: 200,
                  },
                  {
                    observer: false,
                  }
                );
                config.name = `${item.label}-${config.vid.slice(-2)}`;

                history.apply(
                  new AddCSS2DAction({
                    engine,
                    store: this.$store,
                    config,
                  }),
                  true
                );
              },
            },
            {
              icon: "#iconC3pingmian",
              label: "C3平面",
              click: function (item) {
                const config = generateConfig(
                  CONFIGTYPE.CSS3DPLANE,
                  {
                    width: 300,
                    height: 300,
                    scale: {
                      x: 0.2,
                      y: 0.2,
                      z: 0.2,
                    },
                  },
                  {
                    observer: false,
                  }
                );
                config.name = `${item.label}-${config.vid.slice(-2)}`;

                history.apply(
                  new AddCSS3DAction({
                    engine,
                    store: this.$store,
                    config,
                  }),
                  true
                );
              },
            },
            {
              icon: "#iconC3jingling",
              label: "C3精灵",
              click: function (item) {
                const config = generateConfig(
                  CONFIGTYPE.CSS3DSPRITE,
                  {
                    width: 100,
                    height: 100,
                    scale: {
                      x: 0.2,
                      y: 0.2,
                      z: 0.2,
                    },
                  },
                  {
                    observer: false,
                  }
                );
                config.name = `${item.label}-${config.vid.slice(-2)}`;

                history.apply(
                  new AddCSS3DAction({
                    engine,
                    store: this.$store,
                    config,
                  }),
                  true
                );
              },
            },
          ],
          click: function (item) {
            if (item.click) {
              item.click.call(this, item);
            }
          },
        },
        {
          icon: "#iconpingmianjihe",
          label: "辅助",
          list: [
            {
              icon: "#iconzu",
              label: "组",
              type: CONFIGTYPE.GROUP,
            },
            {
              icon: "#iconkongduixiang",
              label: "空对象",
              type: CONFIGTYPE.OBJECT3D,
            },
          ],
          click: function (item) {
            const config = generateConfig(item.type);
            config.name = `${item.label}-${config.vid.slice(-2)}`;

            history.apply(
              new AddObjectAction({
                engine,
                store: this.$store,
                config,
                module: CONFIGMODULE[item.type],
              }),
              true
            );
          },
        },
      ],
    };
  },
};
</script>

<style lang="less" scoped>
.basicElement-container {
  .boxSetting(100%, 70vh);
  overflow: auto;
}
</style>
