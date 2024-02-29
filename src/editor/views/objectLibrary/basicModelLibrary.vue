<template>
  <div class="basicElement-container">
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
              },
            );

            history.apply(
              new AddMeshAction({
                geometryConfig,
                meshConfig,
                helperConfig,
                store: this.$store,
                engine: engine,
              }),
              true,
            );
          },
        },
        {
          icon: "#iconpingmianjihe",
          label: "展示平面",
          list: [
            {
              icon: "#iconjingling",
              label: "精灵",
              click: function (item) {
                const material = generateConfig(
                  CONFIGTYPE.SPRITEMATERIAL,
                  { sizeAttenuation: false },
                  { observer: false },
                );
                material.name = `精灵材质-${material.vid.slice(-2)}`;

                const sprite = generateConfig(
                  CONFIGTYPE.SPRITE,
                  {
                    material: material.vid,

                    scale: { x: 0.2, y: 0.2 },
                  },
                  {
                    observer: false,
                  },
                );
                sprite.name = `${item.label}-${sprite.vid.slice(-2)}`;

                history.apply(
                  new AddSpriteAction({
                    engine,
                    store: this.$store,
                    material,
                    sprite,
                  }),
                  true,
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
                  },
                );
                config.name = `${item.label}-${config.vid.slice(-2)}`;

                history.apply(
                  new AddCSS2DAction({
                    engine,
                    store: this.$store,
                    config,
                  }),
                  true,
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
                      x: 0.1,
                      y: 0.1,
                      z: 0.1,
                    },
                  },
                  {
                    observer: false,
                  },
                );
                config.name = `${item.label}-${config.vid.slice(-2)}`;

                history.apply(
                  new AddCSS3DAction({
                    engine,
                    store: this.$store,
                    config,
                  }),
                  true,
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
                  },
                );
                config.name = `${item.label}-${config.vid.slice(-2)}`;

                history.apply(
                  new AddCSS3DAction({
                    engine,
                    store: this.$store,
                    config,
                  }),
                  true,
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
          label: "路径与形状",
          list: [
            {
              icon: "#iconlujing",
              label: "3D路径",
              click: function (item) {
                const path = generateConfig(CONFIGTYPE.PATH3, {
                  curves: [],
                });

                path.name = `${item.label}-${path.vid.slice(-2)}`;

                engine.applyConfig(path);

                const geometry = generateConfig(CONFIGTYPE.PATHGEOMETRY, {
                  path: path.vid,
                  space: false,
                });
                const line = generateConfig(CONFIGTYPE.LINE, {
                  geometry: geometry.vid,
                });

                line.name = path.name;

                geometry.name = `路径几何-${geometry.vid.slice(-2)}`;

                engine.applyConfig(geometry, line);

                const scene = this.$store.getters["scene/currentScene"];

                scene.children.push(line.vid);
                this.$store.commit("path/notify");
                this.$store.commit("line/notify");

                this.$store.commit("path/draw", {
                  status: !this.draw,
                  geometry: geometry,
                  drawType: "3d",
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
              icon: "#iconlujing",
              label: "2D路径",
              click: function (item) {
                const path = generateConfig(CONFIGTYPE.PATH, {
                  curves: [],
                });

                path.name = `${item.label}-${path.vid.slice(-2)}`;

                engine.applyConfig(path);

                const geometry = generateConfig(CONFIGTYPE.PATHGEOMETRY, {
                  path: path.vid,
                  space: false,
                });
                const line = generateConfig(CONFIGTYPE.LINE, {
                  geometry: geometry.vid,
                });

                line.name = path.name;

                geometry.name = `路径几何-${geometry.vid.slice(-2)}`;

                engine.applyConfig(geometry, line);

                const scene = this.$store.getters["scene/currentScene"];

                scene.children.push(line.vid);

                this.$store.commit("path/notify");
                this.$store.commit("line/notify");

                this.$store.commit("path/draw", {
                  status: !this.draw,
                  geometry: geometry,
                  drawType: "2d",
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
              click: function (item) {
                const path = generateConfig(CONFIGTYPE.PATH, {
                  curves: [],
                  autoClose: true,
                });

                path.name = `路径-${path.vid.slice(-2)}`;

                const shape = generateConfig(CONFIGTYPE.SHAPE, {
                  shape: path.vid,
                });

                shape.name = `${item.label}-${shape.vid.slice(-2)}`;

                const geometry = generateConfig(CONFIGTYPE.SHAPEGEOMETRY, {
                  shape: shape.vid,
                });
                const mesh = generateConfig(CONFIGTYPE.MESH, {
                  geometry: geometry.vid,
                });
                mesh.name = shape.name;

                engine.applyConfig(path, shape, geometry, mesh);

                const scene = this.$store.getters["scene/currentScene"];

                scene.children.push(mesh.vid);

                this.$store.commit("shape/notify");
                this.$store.commit("mesh/notify");

                this.$store.commit("path/draw", {
                  status: !this.draw,
                  geometry: geometry,
                  drawType: "2d",
                });
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
          label: "应用物体",
          list: [
            {
              icon: "#iconguandao",
              label: "管道",
              click: function (item) {
                if (!Object.keys(this.$store.getters["path/get"]).length) {
                  this.$message.warning("您还未创建路径。");
                  return;
                }

                this.$message.info("请选择场景中的一个3D路径。");

                const selectFun = (event) => {
                  const objectConfig = engine.getConfigBySymbol(
                    event.objectSymbols[0],
                  );

                  if (!objectConfig) {
                    console.error(
                      `engine can not found object with vid: ${event.objectSymbols[0]}`,
                    );
                    this.$message.warning("未知错误，请重新选择。");
                    return;
                  }

                  const geometryConfig = engine.getConfigBySymbol(
                    objectConfig.geometry,
                  );

                  if (
                    !geometryConfig ||
                    geometryConfig.type !== CONFIGTYPE.PATHGEOMETRY
                  ) {
                    this.$message.warning(
                      "您选择的不是一个3D路径物体，请重新选择。",
                    );
                    return;
                  }

                  const pathConfig = engine.getConfigBySymbol(
                    geometryConfig.path,
                  );

                  if (!pathConfig || pathConfig.type !== CONFIGTYPE.PATH3) {
                    this.$message.warning(
                      "您选择的不是一个3D路径物体，请重新选择。",
                    );
                    return;
                  }

                  const geometry = generateConfig(CONFIGTYPE.PATHTUBEGEOMETRY, {
                    path: geometryConfig.path,
                  });

                  const mesh = generateConfig(CONFIGTYPE.MESH, {
                    geometry: geometry.vid,
                  });

                  mesh.name = `${item.label}-${mesh.vid.slice(-2)}`;

                  geometry.name = `${item.label}-${mesh.name}`;

                  const helper = generateConfig(
                    CONFIGTYPE.OBJECTHELPER,
                    {
                      target: mesh.vid,
                      shape: true,
                    },
                    {
                      observer: false,
                    },
                  );

                  history.apply(
                    new AddMeshAction({
                      geometryConfig: geometry,
                      meshConfig: mesh,
                      helperConfig: helper,
                      store: this.$store,
                      engine: engine,
                    }),
                    true,
                  );

                  engine.removeEventListener("selected", selectFun);
                };

                engine.addEventListener("selected", selectFun);
              },
            },
            // {
            //   icon: "#iconxixian",
            //   label: "细线",
            //   click: function (item) {
            //     if (!Object.keys(this.$store.getters["path/get"]).length) {
            //       this.$message.warning("您还未创建路径。");
            //       return;
            //     }

            //     this.$message.info("请选择场景中的一个路径。");

            //     const selectFun = (event) => {
            //       const objectConfig = engine.getConfigBySymbol(
            //         event.objectSymbols[0],
            //       );

            //       if (!objectConfig) {
            //         console.error(
            //           `engine can not found object with vid: ${event.objectSymbols[0]}`,
            //         );
            //         this.$message.warning("未知错误，请重新选择。");
            //         return;
            //       }

            //       const geometry = engine.getConfigBySymbol(
            //         objectConfig.geometry,
            //       );

            //       const line = generateConfig(CONFIGTYPE.LINE, {
            //         geometry: objectConfig.geometry,
            //       });

            //       line.name = `${item.label}-${line.vid.slice(-2)}`;

            //       history.apply(
            //         new AddLineAction({
            //           geometry,
            //           line,
            //           store: this.$store,
            //           engine: engine,
            //         }),
            //         true,
            //       );

            //       engine.removeEventListener("selected", selectFun);
            //     };

            //     engine.addEventListener("selected", selectFun);
            //   },
            // },
            // {
            //   icon: "#iconcuxian",
            //   label: "粗线",
            //   click: function (item) {
            //     if (!Object.keys(this.$store.getters["path/get"]).length) {
            //       this.$message.warning("您还未创建路径。");
            //       return;
            //     }

            //     this.$message.info("请选择场景中的一个路径。");

            //     const selectFun = (event) => {
            //       const objectConfig = engine.getConfigBySymbol(
            //         event.objectSymbols[0],
            //       );

            //       if (!objectConfig) {
            //         console.error(
            //           `engine can not found object with vid: ${event.objectSymbols[0]}`,
            //         );
            //         this.$message.warning("未知错误，请重新选择。");
            //         return;
            //       }

            //       const geometry = engine.getConfigBySymbol(
            //         objectConfig.geometry,
            //       );

            //       const line = generateConfig(CONFIGTYPE.LINE2, {
            //         geometry: objectConfig.geometry,
            //       });

            //       line.name = `${item.label}-${line.vid.slice(-2)}`;

            //       history.apply(
            //         new AddLineAction({
            //           geometry,
            //           line,
            //           store: this.$store,
            //           engine: engine,
            //         }),
            //         true,
            //       );

            //       engine.removeEventListener("selected", selectFun);
            //     };

            //     engine.addEventListener("selected", selectFun);
            //   },
            // },
            {
              icon: "#iconjiyati",
              label: "挤压体",
              click: function (item) {
                if (!Object.keys(this.$store.getters["shape/get"]).length) {
                  this.$message.warning("您还未创建形状。");
                  return;
                }

                this.$message.info("请选择场景中的一个形状。");

                const selectFun = (event) => {
                  const objectConfig = engine.getConfigBySymbol(
                    event.objectSymbols[0],
                  );

                  if (!objectConfig) {
                    console.error(
                      `engine can not found object with vid: ${event.objectSymbols[0]}`,
                    );
                    this.$message.warning("未知错误，请重新选择。");
                    return;
                  }

                  const geometryConfig = engine.getConfigBySymbol(
                    objectConfig.geometry,
                  );

                  if (
                    !geometryConfig ||
                    geometryConfig.type !== CONFIGTYPE.SHAPEGEOMETRY
                  ) {
                    this.$message.warning("您选择的不是一个形状，请重新选择。");
                    return;
                  }

                  const geometry = generateConfig(CONFIGTYPE.EXTRUDEGEOMETRY, {
                    shapes: geometryConfig.shape,
                    center: false,
                    options: {
                      steps: 128,
                      depth: 10,
                    },
                  });

                  const mesh = generateConfig(CONFIGTYPE.MESH, {
                    geometry: geometry.vid,
                  });

                  mesh.name = `${item.label}-${mesh.vid.slice(-2)}`;

                  geometry.name = `${item.label}几何-${geometry.vid.slice(-2)}`;

                  const helper = generateConfig(
                    CONFIGTYPE.OBJECTHELPER,
                    {
                      target: mesh.vid,
                      shape: true,
                    },
                    {
                      observer: false,
                    },
                  );

                  history.apply(
                    new AddMeshAction({
                      geometryConfig: geometry,
                      meshConfig: mesh,
                      helperConfig: helper,
                      store: this.$store,
                      engine: engine,
                    }),
                    true,
                  );

                  engine.removeEventListener("selected", selectFun);
                };

                engine.addEventListener("selected", selectFun);
              },
            },
            {
              icon: "#iconjiyati",
              label: "车削体",
              click: function (item) {
                if (!Object.keys(this.$store.getters["path/get"]).length) {
                  this.$message.warning("您还未创建路径。");
                  return;
                }

                this.$message.info("请选择场景中的一个2D路径。");

                const selectFun = (event) => {
                  const objectConfig = engine.getConfigBySymbol(
                    event.objectSymbols[0],
                  );

                  if (!objectConfig) {
                    console.error(
                      `engine can not found object with vid: ${event.objectSymbols[0]}`,
                    );
                    this.$message.warning("未知错误，请重新选择。");
                    return;
                  }

                  const geometryConfig = engine.getConfigBySymbol(
                    objectConfig.geometry,
                  );

                  if (
                    !geometryConfig ||
                    geometryConfig.type !== CONFIGTYPE.PATHGEOMETRY
                  ) {
                    this.$message.warning(
                      "您选择的不是一个2D路径物体，请重新选择。",
                    );
                    return;
                  }

                  const pathConfig = engine.getConfigBySymbol(
                    geometryConfig.path,
                  );

                  if (!pathConfig || pathConfig.type !== CONFIGTYPE.PATH) {
                    this.$message.warning(
                      "您选择的不是一个2D路径物体，请重新选择。",
                    );
                    return;
                  }

                  const geometry = generateConfig(CONFIGTYPE.LATHEGEOMETRY, {
                    path: geometryConfig.path,
                    center: false,
                  });

                  const mesh = generateConfig(CONFIGTYPE.MESH, {
                    geometry: geometry.vid,
                  });

                  mesh.name = `${item.label}-${mesh.vid.slice(-2)}`;

                  geometry.name = `${item.label}-${mesh.name}`;

                  const helper = generateConfig(
                    CONFIGTYPE.OBJECTHELPER,
                    {
                      target: mesh.vid,
                      shape: true,
                    },
                    {
                      observer: false,
                    },
                  );

                  history.apply(
                    new AddMeshAction({
                      geometryConfig: geometry,
                      meshConfig: mesh,
                      helperConfig: helper,
                      store: this.$store,
                      engine: engine,
                    }),
                    true,
                  );

                  engine.removeEventListener("selected", selectFun);
                };

                engine.addEventListener("selected", selectFun);
              },
            },
            {
              icon: "#icondianyun",
              label: "点云",
              object: CONFIGTYPE.POINTS,
              click: function (item) {
                this.$message.info("请选择场景中的一个几何物体。");

                const selectFun = (event) => {
                  const objectConfig = engine.getConfigBySymbol(
                    event.objectSymbols[0],
                  );

                  if (!objectConfig) {
                    console.error(
                      `engine can not found object with vid: ${event.objectSymbols[0]}`,
                    );
                    return;
                  }

                  const material = generateConfig(
                    CONFIGTYPE.POINTSMATERIAL,
                    undefined,
                    {
                      observer: false,
                    },
                  );
                  const points = generateConfig(
                    CONFIGTYPE.POINTS,
                    {
                      material: material.vid,
                      geometry: objectConfig.geometry,
                    },
                    {
                      observer: false,
                    },
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
                    true,
                  );

                  engine.removeEventListener("selected", selectFun);
                };

                engine.addEventListener("selected", selectFun);
              },
            },
            {
              icon: "#iconwanggehua",
              label: "网格",
              click: function (item) {
                this.$message.info("请选择场景中的一个几何物体。");

                const selectFun = (event) => {
                  const objectConfig = engine.getConfigBySymbol(
                    event.objectSymbols[0],
                  );

                  if (!objectConfig) {
                    console.error(
                      `engine can not found object with vid: ${event.objectSymbols[0]}`,
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
                    },
                  );

                  const line = generateConfig(
                    CONFIGTYPE.LINE,
                    {
                      geometry: geometry.vid,
                    },
                    {
                      observer: false,
                    },
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
                    true,
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
                    event.objectSymbols[0],
                  );

                  if (!objectConfig) {
                    console.error(
                      `engine can not found object with vid: ${event.objectSymbols[0]}`,
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
                    },
                  );

                  const line = generateConfig(
                    CONFIGTYPE.LINESEGMENTS,
                    {
                      geometry: geometry.vid,
                    },
                    {
                      observer: false,
                    },
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
                    true,
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
              true,
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
